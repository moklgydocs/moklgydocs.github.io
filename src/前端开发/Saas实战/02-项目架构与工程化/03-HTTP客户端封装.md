# HTTP 客户端封装

> **这一步解决什么问题？**
> 上一步我们实现了 `createHttp()` 工厂函数，但"7 个服务怎么用"和"Token 刷新队列怎么跑"这两个关键问题还没展开。本文将深入 Token 刷新的并发机制，并为 7 个后端服务分别创建 HTTP 实例文件——这是所有 API 调用的入口。
>
> 对于 ASP.NET Core 开发者来说，这就像为每个微服务注册独立的 Typed HttpClient——不同的 BaseAddress、不同的 DelegatingHandler、不同的超时配置，但共享同一套 Token 刷新管道。

## 前置知识

### Token 刷新的并发问题

在 .NET 中，如果你用 `SemaphoreSlim(1,1)` 来控制并发刷新，逻辑很简单——同一时刻只有一个线程能获取新 token，其他线程等待。但前端没有线程和锁的概念，需要用 Promise 队列来实现等价效果。

问题的场景是这样的：页面加载时，5 个 API 请求同时发出，5 个都返回 401（因为 token 过期了）。如果没有队列机制，会触发 5 次 token 刷新请求，其中后 4 次是浪费的，甚至可能导致第一次刷新获得的 token 被第二次刷新覆盖。

### .NET 类比：DelegatingHandler 管道

```
ASP.NET Core 请求管道                    axios 拦截器管道
────────────────────                    ──────────────────
HttpClient                              axios.create()
  └─ AuthHeaderHandler                    └─ request interceptor (注入 Bearer)
  └─ TenantIdHandler                      └─ request interceptor (注入 X-Tenant-Id)
  └─ TokenRefreshHandler                  └─ response interceptor (401 刷新)
  └─ 实际 HTTP 请求                        └─ 实际 HTTP 请求
```

## 代码实现

### Token 刷新队列流程图

```
  请求 A ──→ 401 ──┐
  请求 B ──→ 401 ──┤     刷新 Token
  请求 C ──→ 401 ──┤     （仅一次）     ┌────────────────┐
                    ├─→ isRefreshing=true ──→ POST /connect/token ──→ 新 token
                    │     │                 └────────────────┘
                    │     │                         │
                    │     │              ┌──────────┴──────────┐
                    │     │              │ 成功                  │ 失败
                    │     │              ▼                       ▼
                    │  请求 A 立即重试    processQueue(null,    processQueue(error,
                    │                   newToken)              null)
                    │              ▼                       ▼
                    │     请求 B 从队列取出  请求 B 被 reject
                    │     请求 C 从队列取出  请求 C 被 reject
                    │     ──→ 用新 token 重发  ──→ 跳转登录页
                    │
                    └─→ isRefreshing=true
                        请求 B/C 加入 failedQueue
                        等待 A 刷新完成
```

### 完整的 create-http.ts（逐段讲解版）

```typescript
// src/lib/create-http.ts
import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios"
import type { ApiResult } from "@/types"
import { useAuthStore } from "@/stores/auth-store"

/** 创建 HTTP 实例的选项 */
interface CreateHttpOptions {
  /** 是否自动注入 X-Tenant-Id（默认 true）。SSO 等跨服务 API 不共享租户库，应设为 false */
  sendTenantId?: boolean
}

/**
 * 创建一个绑定到特定后端前缀的 axios 实例（含 Token 自动注入 & 刷新逻辑）。
 *
 * @param basePrefix  Vite proxy 的路径前缀，例如 '/sso-api'、'/perm-api'、'/gw-api'
 * @param options     可选配置项，如是否发送租户 ID
 * @returns 封装了 get/post/put/del/postForm 的 HTTP 客户端对象
 */
export function createHttp(basePrefix: string, options?: CreateHttpOptions) {
  // ─── Step 1: 创建 axios 实例 ─────────────────────────────────
  const { sendTenantId = true } = options ?? {}

  const http = axios.create({
    baseURL: basePrefix,
    timeout: 15000,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  })

  // ─── Step 2: 请求拦截器 — 自动注入 Token 和租户 ID ───────────────
  http.interceptors.request.use((config) => {
    const { accessToken, currentTenantId } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    if (sendTenantId && currentTenantId) {
      config.headers["X-Tenant-Id"] = currentTenantId
    }
    return config
  })

  // ─── Step 3: Token 刷新队列 — 并发 401 的核心处理 ─────────────────
  /** 是否正在刷新 Token（防止并发刷新） */
  let isRefreshing = false
  /** Token 刷新期间被挂起的请求队列 */
  let failedQueue: { resolve: (token: string) => void; reject: (error: unknown) => void }[] = []

  /**
   * 处理挂起的请求队列：刷新成功时重发所有请求，失败时全部拒绝
   * @param error 刷新错误，不为 null 表示刷新失败
   * @param token 刷新成功后的新 access_token
   */
  function processQueue(error: unknown, token: string | null = null) {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
    failedQueue = []
  }

  // ─── Step 4: 响应拦截器 — 成功分支 ─────────────────────────────
  http.interceptors.response.use(
    (response) => {
      const data = response.data
      const url = response.config.url ?? ""

      // 4a. Blob 响应：检测后端是否返回了 JSON 错误
      if (data instanceof Blob) {
        if (data.type && data.type.includes('application/json')) {
          return data.text().then((text) => {
            try {
              const json = JSON.parse(text)
              const err = new Error(json.message || json.error_description || json.title || '请求失败')
              ;(err as any).response = { data: json, status: response.status }
              return Promise.reject(err)
            } catch {
              return response
            }
          })
        }
        return response
      }

      // 4b. ArrayBuffer 响应：直接放行
      if (data instanceof ArrayBuffer) {
        return response
      }

      // 4c. 非 ApiResult 格式的响应：自动包裹为统一格式
      if (data !== null && typeof data === 'object' && !('success' in data) && !url.includes("/connect/")) {
        response.data = { success: true, code: 0, message: 'ok', data } as ApiResult<unknown>
      }
      return response
    },

    // ─── Step 5: 响应拦截器 — 错误分支（401 刷新逻辑） ───────────────
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      if (error.response?.status === 401) {
        // 5a. /connect/token 本身 401 → refresh_token 已过期，不再刷新
        const url = originalRequest?.url ?? ""
        if (url.includes("/connect/token")) return Promise.reject(error)

        const { refreshToken, isAuthenticated } = useAuthStore.getState()

        // 5b. 无 refresh_token 或未认证 → 直接跳转登录页
        if (!refreshToken || !isAuthenticated) {
          useAuthStore.getState().logout()
          window.location.href = "/login"
          return Promise.reject(error)
        }

        // 5c. 已重试过仍 401 → 新 token 也无效，跳转登录页
        if (originalRequest._retry) {
          useAuthStore.getState().logout()
          window.location.href = "/login"
          return Promise.reject(error)
        }

        // 5d. 正在刷新中 → 加入等待队列
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return http(originalRequest)
          })
        }

        // 5e. 开始刷新
        originalRequest._retry = true
        isRefreshing = true

        try {
          const res = await axios.post<{ access_token: string; refresh_token?: string }>(
            "/connect/token",
            new URLSearchParams({
              grant_type: "refresh_token",
              client_id: "mok-web-app",
              refresh_token: refreshToken,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          )

          const { access_token, refresh_token } = res.data
          useAuthStore.getState().setTokens(access_token, refresh_token)
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          processQueue(null, access_token)
          return http(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          useAuthStore.getState().logout()
          window.location.href = "/login"
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )

  // ─── Step 6: 封装常用方法 ─────────────────────────────────────
  return {
    instance: http,
    async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResult<T>> {
      const res = await http.get<ApiResult<T>>(url, { params })
      return res.data
    },
    async post<T>(url: string, data?: unknown): Promise<ApiResult<T>> {
      const res = await http.post<ApiResult<T>>(url, data)
      return res.data
    },
    async put<T>(url: string, data?: unknown): Promise<ApiResult<T>> {
      const res = await http.put<ApiResult<T>>(url, data)
      return res.data
    },
    async del<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
      const res = await http.delete<ApiResult<T>>(url, config)
      return res.data
    },
    async postForm<T>(url: string, data: Record<string, string>): Promise<T> {
      const res = await http.post<T>(url, new URLSearchParams(data), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      return res.data
    },
  }
}
```

### 7 个服务的 HTTP 实例文件

**src/api/auth/http.ts** — SSO 认证服务

```typescript
// AuthServer 模块 HTTP 客户端
// 代理路径：/sso-api/* → http://moklgy.me:10001/*
import { createHttp } from "@/lib/create-http"

/** 认证服务 HTTP 客户端，基础路径为 /sso-api，不发送租户 ID */
const ssoHttp = createHttp("/sso-api", { sendTenantId: false })

/** 导出常用 HTTP 方法 */
export const { get, post, put, del, postForm } = ssoHttp
/** 导出 axios 实例，供需要自定义配置（如 responseType、onUploadProgress）的场景使用 */
export default ssoHttp.instance
```

**src/api/perm/http.ts** — 权限中心

```typescript
// PermCenter 模块 HTTP 客户端
// 代理路径：/perm-api/* → http://moklgy.me:10002/*
import { createHttp } from "@/lib/create-http"

/** 权限中心 HTTP 客户端，基础路径为 /perm-api */
const permHttp = createHttp("/perm-api")

/** 导出常用 HTTP 方法 */
export const { get, post, put, del, postForm } = permHttp
/** 导出 axios 实例，供需要自定义配置的场景使用 */
export default permHttp.instance
```

**src/api/gateway/http.ts** — API 网关

```typescript
// Gateway 模块 HTTP 客户端
// 代理路径：/gw-api/* → http://moklgy.me:10000/*
import { createHttp } from "@/lib/create-http"

/** 网关管理 HTTP 客户端，基础路径为 /gw-api */
const gwHttp = createHttp("/gw-api")

/** 导出常用 HTTP 方法 */
export const { get, post, put, del } = gwHttp
/** 导出 axios 实例，供需要自定义配置的场景使用 */
export default gwHttp.instance
```

**src/api/file/http.ts** — 文件服务

```typescript
// FileService 模块 HTTP 客户端
// 代理路径：/file-api/* → http://moklgy.me:10004/*
import { createHttp } from "@/lib/create-http"

/** 文件服务 HTTP 客户端，基础路径为 /file-api */
const fileHttp = createHttp("/file-api")

/** 导出常用 HTTP 方法 */
export const { get, post, put, del } = fileHttp
/** 导出 axios 实例，供需要自定义配置（如 responseType、onUploadProgress）的场景使用 */
export default fileHttp.instance
```

**src/api/print/http.ts** — 打印服务

```typescript
// PrintService 模块 HTTP 客户端
// 代理路径：/print-api/* → http://localhost:11010/*
import { createHttp } from "@/lib/create-http"

/** 打印服务 HTTP 客户端，基础路径为 /print-api，超时 120s（报表渲染耗时长） */
const printHttp = createHttp("/print-api")

/** 设置打印服务默认超时为 120s（FastReport 渲染可能超过 15s） */
printHttp.instance.defaults.timeout = 120000

/** 导出常用 HTTP 方法 */
export const { get, post, put, del } = printHttp
/** 导出 axios 实例，供需要自定义配置（如 responseType）的场景使用 */
export default printHttp.instance
```

**src/api/notify/http.ts** — 通知中心

```typescript
// NotificationCenter 模块 HTTP 客户端
// 代理路径：/notify-api/* → http://localhost:10012/*
import { createHttp } from "@/lib/create-http"

/** 通知中心 HTTP 客户端，基础路径为 /notify-api */
const notifyHttp = createHttp("/notify-api")

/** 导出常用 HTTP 方法 */
export const { get, post, put, del } = notifyHttp
/** 导出 axios 实例，供需要自定义配置的场景使用 */
export default notifyHttp.instance
```

**src/api/ops/http.ts** — 租户运营中心

```typescript
// TenantOpsCenter 模块 HTTP 客户端
// 代理路径：/ops-api/* → http://moklgy.me:10013/*
import { createHttp } from "@/lib/create-http"

/** 租户运营中心 HTTP 客户端，基础路径为 /ops-api */
const opsHttp = createHttp("/ops-api")

/** 导出常用 HTTP 方法 */
export const { get, post, put, del, postForm } = opsHttp
/** 导出 axios 实例，供需要自定义配置的场景使用 */
export default opsHttp.instance
```

## 代码讲解

### Token 刷新队列的六步流程

让我们用时间线来追踪 3 个并发 401 请求的处理过程：

```
T0: 请求 A 发出 → 200 OK（token 仍有效）
T1: 请求 B 发出 → 200 OK（token 仍有效）
T2: Token 过期（后台此时未知）
T3: 请求 C 发出 → 401（第一个触发刷新的请求）
T4: 请求 D 发出 → 401
T5: 请求 E 发出 → 401
```

**Step 5a — `/connect/token` 本身 401 不触发刷新**

如果刷新 token 的请求本身返回 401，说明 refresh_token 也已过期。此时不应该递归刷新，而是直接拒绝，让调用方跳转到登录页。

**Step 5b — 无 refresh_token 直接跳登录**

用户从未登录过（`isAuthenticated === false`）或 refresh_token 为空，说明这不是 token 过期的场景，而是根本没登录。

**Step 5c — `_retry` 标记防止无限循环**

刷新 token 后用新 token 重发原请求，如果新 token 仍然 401，说明后端有问题。`_retry` 标记确保只重试一次，不会无限循环。

**Step 5d — 队列等待机制**

当请求 D 和 E 发现 `isRefreshing === true` 时，不发起刷新请求，而是返回一个 Promise 并加入 `failedQueue`。当请求 C 的刷新完成后，`processQueue` 会统一 resolve 或 reject 所有等待中的 Promise。

> **.NET 类比**：这等价于 `SemaphoreSlim(1,1)` + `TaskCompletionSource`。第一个获取到信号量的线程执行刷新，其他线程在 `TaskCompletionSource.Task` 上等待。

**Step 5e — 刷新请求使用裸 axios**

注意刷新请求不使用 `http` 实例，而是直接用 `axios.post`。这是因为：
- 刷新请求不走 `basePrefix`（`/connect/token` 不需要加 `/sso-api` 前缀）
- 刷新请求的 URL 已经在 Vite proxy 中直接配置了（`/connect` → 10001 端口）

> **【易错点】** 刷新请求必须用裸 axios，不能用 http 实例。如果用 `http.post("/connect/token", ...)`，请求会走 `baseURL` 前缀变成 `/sso-api/connect/token`，这不是 Vite proxy 配置的路径——后端会返回 404。

**Step 5f — finally 重置 isRefreshing**

无论刷新成功还是失败，`finally` 块都会重置 `isRefreshing = false`。这确保了后续的 401 请求可以发起新的刷新流程。

> **【性能陷阱】** 不同服务的 HTTP 实例有独立的 `isRefreshing` 和 `failedQueue`（闭包作用域）。如果 SSO 和权限中心同时返回 401，会触发两次独立的刷新请求。但因为 `useAuthStore.getState().setTokens()` 是覆盖式写入，第二次刷新只是重复写入相同的 token，不会出数据一致性问题——只是多了一次网络请求。如果未来服务数量增加，可以考虑将刷新逻辑提取为全局共享的单例。

> **🤔 导师提问**：每个 `createHttp` 实例的 `isRefreshing` 是独立的，这意味着 SSO 和权限中心各刷新一次。有人建议把 `isRefreshing` 和 `failedQueue` 提取为全局变量，只刷新一次。两种方案的 trade-off 是什么？提示：想想 .NET 中 `SemaphoreSlim(1,1)` 是全局共享的还是每个 HttpClient 独立的。

### 非标准响应包裹

后端 API 的响应格式不统一：
- 大部分接口返回 `{ success, code, message, data }` 格式
- OIDC 端点（`/connect/*`）返回原生格式（如 `{ access_token, token_type }`）
- 少数旧接口只返回 data 对象，没有 success 字段

响应拦截器的成功分支处理了后两种情况：
1. 跳过 `/connect/*` 端点
2. 其他没有 `success` 字段的响应自动包裹为 `ApiResult` 格式

> **【设计取舍】** 自动包裹非标准响应为 `ApiResult` 格式，好处是调用方代码统一（都检查 `res.success`），坏处是隐藏了后端接口不规范的事实。如果后端最终修复了所有接口返回 `ApiResult`，这段包裹逻辑就变成了冗余代码——但留着不会有副作用（已有 `success` 字段的响应不会被二次包裹）。这是一种"防御性编程" vs "暴露问题"的取舍。

> **🤔 导师提问**：如果后端某个旧接口返回 `{ id: 1, name: "test" }` 而不是 `{ success: true, data: { id: 1, name: "test" } }`，响应拦截器会自动包裹。但如果后端又新增了一个接口也返回类似格式，你如何区分"这是需要包裹的旧接口"还是"这是本来就应该是裸数据的新接口"？

### 打印服务的特殊超时

打印服务的 HTTP 实例在创建后手动设置了 120 秒超时：

```typescript
printHttp.instance.defaults.timeout = 120000
```

这是因为 FastReport 渲染大型报表可能需要 30-60 秒，远超默认的 15 秒。通过 `instance` 属性访问底层 axios 实例来修改默认配置。

### 7 个服务实例的差异

| 服务 | basePrefix | sendTenantId | 超时 | 导出 postForm | 特殊说明 |
|------|-----------|-------------|------|-------------|---------|
| SSO 认证 | `/sso-api` | false | 15s | 是 | 跨租户，不发 X-Tenant-Id |
| 权限中心 | `/perm-api` | true | 15s | 是 | 默认配置 |
| API 网关 | `/gw-api` | true | 15s | 否 | — |
| 文件服务 | `/file-api` | true | 15s | 否 | 处理 Blob 响应 |
| 打印服务 | `/print-api` | true | **120s** | 否 | 渲染耗时长 |
| 通知中心 | `/notify-api` | true | 15s | 否 | — |
| 租户运营 | `/ops-api` | true | 15s | 是 | — |

## 踩坑提醒

1. **刷新请求必须用裸 axios，不能用 http 实例**。如果用 `http.post("/connect/token", ...)`，请求会走 `baseURL` 前缀变成 `/sso-api/connect/token`，这不是 Vite proxy 配置的路径。

2. **`_retry` 是自定义属性，不在 AxiosRequestConfig 类型中**。TypeScript 会报类型错误，需要用 `as InternalAxiosRequestConfig & { _retry?: boolean }` 类型断言。

3. **`processQueue` 必须在 `finally` 之前调用**。如果放在 `finally` 中，等待中的请求会等到 `isRefreshing = false` 之后才被处理，但此时 `isRefreshing` 已经不影响逻辑了——因为队列已经被 `processQueue` 清空了。关键是要确保在刷新成功后**立即**重发等待中的请求。

4. **不同服务的 HTTP 实例有独立的 `isRefreshing` 和 `failedQueue`**。这是闭包作用域决定的——每个 `createHttp` 调用都创建新的闭包变量。这意味着如果 SSO 和权限中心同时返回 401，会触发两次独立的刷新。但由于 `useAuthStore.getState().setTokens()` 是覆盖式写入，第二次刷新只是重复写入相同的 token，不会出问题。

## 自测题

### 概念级（理解定义）

1. 7 个服务的 HTTP 实例中，哪个不发送 `X-Tenant-Id`？为什么？

2. 打印服务为什么要把超时设为 120 秒？如果不设会怎样？

### 推理级（分析原因）

3. 假设用户 token 过期后，页面同时发出了 3 个 API 请求（权限中心 2 个 + 文件服务 1 个），都返回 401。请描述完整的处理流程——会触发几次 token 刷新？3 个请求最终怎么处理？

4. 响应拦截器中为什么 `/connect/` 端点的响应不包裹为 `ApiResult`？如果包裹了会出什么问题？

### 动手级（实践验证）

5. 当前设计中，每个 `createHttp` 实例有独立的 `isRefreshing` 和 `failedQueue`。有人建议将它们提取为全局共享变量，这样无论哪个实例触发刷新，所有实例的请求都能排队等待。请分析两种设计的优缺点。

6. 如果后端新增了一个"审计日志服务"（端口 10014），请列出从 Vite proxy 配置到创建 HTTP 实例的完整步骤，并写出 `src/api/audit/http.ts` 的代码。

## 验证步骤

1. 创建 7 个 `src/api/*/http.ts` 文件，确认 TypeScript 无类型错误
2. 在浏览器 Network 面板中观察：登录后访问任意 API，请求头应包含 `Authorization: Bearer xxx` 和 `X-Tenant-Id: xxx`
3. 在 Network 面板中触发 Token 过期（等待 access_token 过期或手动删除 store 中的 token），观察是否自动刷新并重发请求
4. 验证 SSO 请求不包含 `X-Tenant-Id` 头，而权限中心请求包含

## ✅ 输出检查清单

完成本节后，确认以下各项：

- [ ] 能画出 Token 刷新队列的六步流程图
- [ ] 知道刷新请求必须用裸 axios 而不能用 http 实例的原因
- [ ] 理解不同服务的 HTTP 实例有独立的 `isRefreshing` 闭包变量
- [ ] 能说出 7 个服务的 basePrefix、sendTenantId、超时的差异
- [ ] 理解非标准响应自动包裹为 `ApiResult` 的设计取舍

## 下一步

[← 上一篇：工具函数](./02-工具函数.md) | [下一篇：路由系统 →](./04-路由系统.md)
