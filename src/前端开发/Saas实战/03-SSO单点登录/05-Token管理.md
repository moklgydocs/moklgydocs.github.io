# Token 管理

> **这一步解决什么问题？**
>
> 登录成功后拿到了 access_token 和 refresh_token，但 Token 会过期。这一步我们解决两个核心问题：(1) 每次请求如何自动带上 Token 和租户信息？(2) Token 过期后如何无感刷新？答案是 HTTP 拦截器 + 并发刷新队列——一个前端版的"中间件管道"。这类似 ASP.NET Core 中认证中间件自动附加 Cookie 和处理 401 的逻辑，但前端需要自己实现。

---

## 存储策略

AdminWeb 使用 `localStorage` 存储 token（通过 Zustand persist）：

| 存储方式 | XSS 攻击 | CSRF 攻击 | 跨页持久化 | 适用场景 |
|---------|---------|----------|-----------|---------|
| localStorage | 可被 JS 读取 | 不受影响 | 是 | SPA 应用（AdminWeb 的选择） |
| HttpOnly Cookie | JS 无法读取 | 需要防护 | 是 | 传统多页应用 |
| 内存（state） | 可被 JS 读取 | 不受影响 | 否（刷新丢失） | 极高安全要求 |

> **选择 localStorage 的理由**：AdminWeb 是 SPA 应用，所有页面在同一个域下运行。HttpOnly Cookie 在前后端分离架构中需要额外处理 CORS 和 CSRF。

### 【设计取舍】localStorage vs HttpOnly Cookie

| 维度 | localStorage + Bearer | HttpOnly Cookie |
|------|----------------------|-----------------|
| XSS 风险 | JS 可读取 token，XSS 攻击可窃取 | JS 无法读取，XSS 无法窃取 |
| CSRF 风险 | 不受影响（手动附加 Header） | 需要 CSRF Token 防护 |
| 跨域处理 | 简单（Authorization Header） | 复杂（CORS + credentials） |
| 过期续期 | 前端主动刷新 | 浏览器自动管理 |
| 适用架构 | SPA 前后端分离 | 传统服务端渲染 |

**AdminWeb 选 localStorage 的核心理由**：SPA + 前后端分离 + Bearer Token 是最自然的组合。如果安全要求提升到必须防 XSS 窃取 Token，可以考虑 BFF（Backend for Frontend）模式——后端代理 API 请求，Token 只存在 BFF 层。

> **🤔 导师提问**：你是后端开发者，习惯了 HttpOnly Cookie。为什么 SPA 不能用 HttpOnly Cookie 来存 Token？具体会遇到什么 CORS 问题？

---

## Zustand persist 持久化

auth store 通过 Zustand 的 `persist` 中间件自动同步到 localStorage：

```typescript
// src/stores/auth-store.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      currentTenantId: null,
      currentTenantName: null,
      availableTenants: null,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken: refreshToken ?? null, isAuthenticated: true }),

      setUser: (user) => set({ user }),

      setCurrentTenant: (tenantId, tenantName) =>
        set({ currentTenantId: tenantId, currentTenantName: tenantName }),

      setAvailableTenants: (tenants) => set({ availableTenants: tenants }),

      logout: () => set({
        accessToken: null, refreshToken: null, user: null, isAuthenticated: false,
        currentTenantId: null, currentTenantName: null, availableTenants: null,
      }),
    }),
    { name: "admin-auth" }
  )
)
```

**persist 的工作原理**：

```
┌─────────────────────┐         ┌─────────────────────┐
│   Zustand Store      │  同步    │   localStorage       │
│   (内存中)           │ ←─────→ │   key: "admin-auth"  │
│                     │         │   value: JSON        │
│  setTokens() 调用后  │ ──────→ │  自动写入             │
│  页面刷新时          │ ←────── │  自动恢复             │
└─────────────────────┘         └─────────────────────┘
```

### 【易错点】persist 只持久化 state，不持久化 action

`persist` 中间件只保存数据字段（accessToken、user 等），不保存方法（setTokens、logout 等）。方法在 store 创建时重新生成，所以不需要序列化。但如果 store 中有不可序列化的值（如函数、Date 对象、Map/Set），persist 会报错或丢失数据。

---

## createHttp 完整源码

`createHttp` 是 AdminWeb HTTP 层的核心，所有 API 客户端都由它创建。它封装了 Token 自动注入、401 自动刷新、并发刷新队列、ApiResult 自动包裹等逻辑。

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
  // 解构选项，默认发送租户 ID
  const { sendTenantId = true } = options ?? {}

  // 创建 axios 实例，配置基础路径、超时时间和默认请求头
  const http = axios.create({
    baseURL: basePrefix,
    timeout: 15000,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  })

  // 请求拦截：自动挂 Bearer Token + 租户 ID
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

> **🤔 导师提问**：拦截器里读取状态用的是 `useAuthStore.getState()` 而不是 `useAuthStore()`。如果在拦截器里用了 Hook 形式，会发生什么？

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

  // 响应拦截：非 ApiResult 响应自动包裹（跳过 /connect/* OIDC 端点）+ 401 自动刷新
  http.interceptors.response.use(
    (response) => {
      const data = response.data
      const url = response.config.url ?? ""
      // Blob / ArrayBuffer 响应：检测后端是否返回了 JSON 错误（如 200 但 body 是错误 JSON）
      if (data instanceof Blob) {
        if (data.type && data.type.includes('application/json')) {
          // 后端返回了 JSON 而非文件，解析为错误
          return data.text().then((text) => {
            try {
              const json = JSON.parse(text)
              const err = new Error(json.message || json.error_description || json.title || '请求失败')
              ;(err as any).response = { data: json, status: response.status }
              return Promise.reject(err)
            } catch {
              // JSON 解析失败，当作正常 blob 处理
              return response
            }
          })
        }
        return response
      }
      if (data instanceof ArrayBuffer) {
        return response
      }
      // 跳过 OIDC/OAuth2 端点（/connect/*），这些端点返回原生格式，不应包裹 ApiResult
      if (data !== null && typeof data === 'object' && !('success' in data) && !url.includes("/connect/")) {
        // 将非标准响应自动包裹为 ApiResult 格式，统一前端处理
        response.data = { success: true, code: 0, message: 'ok', data } as ApiResult<unknown>
      }
      return response
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      if (error.response?.status === 401) {
        // /connect/token 本身 401 不触发刷新（说明 refresh_token 也已过期）
        const url = originalRequest?.url ?? ""
        if (url.includes("/connect/token")) return Promise.reject(error)

        const { refreshToken, isAuthenticated } = useAuthStore.getState()

        // 无 refresh_token 或未认证状态，直接跳转登录页
        if (!refreshToken || !isAuthenticated) {
          useAuthStore.getState().logout()
          window.location.href = "/login"
          return Promise.reject(error)
        }

        // 已经重试过一次仍 401，说明新 token 也无效，跳转登录页
        if (originalRequest._retry) {
          useAuthStore.getState().logout()
          window.location.href = "/login"
          return Promise.reject(error)
        }

        // 正在刷新中，将当前请求加入等待队列，刷新成功后自动重发
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return http(originalRequest)
          })
        }

        // 标记为重试请求，开始刷新
        originalRequest._retry = true
        isRefreshing = true

        try {
          // 刷新 token 直接走 /connect/token（走 Vite proxy，不带 basePrefix）
          const res = await axios.post<{ access_token: string; refresh_token?: string }>(
            "/connect/token",
            new URLSearchParams({
              grant_type: "refresh_token",
              client_id: "mok-web-app",
              refresh_token: refreshToken,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          )

          // 更新 store 中的 token
          const { access_token, refresh_token } = res.data
          useAuthStore.getState().setTokens(access_token, refresh_token)
          // 用新 token 重发原请求
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          // 唤醒所有等待中的请求
          processQueue(null, access_token)
          return http(originalRequest)
        } catch (refreshError) {
          // 刷新失败，所有等待中的请求全部拒绝
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

  return {
    /** 底层 axios 实例（特殊场景可直接使用） */
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

    /**
     * 表单 POST 请求（application/x-www-form-urlencoded 格式）
     * 用于 OAuth2 等需要表单提交的接口
     */
    async postForm<T>(url: string, data: Record<string, string>): Promise<T> {
      const res = await http.post<T>(url, new URLSearchParams(data), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      return res.data
    },
  }
}
```

---

## 请求拦截器：Bearer + X-Tenant-Id 注入

```typescript
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
```

**工作流程**：

```
组件调用 http.get("/api/users")
  │
  ▼
请求拦截器自动注入：
  Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
  X-Tenant-Id: 1
  │
  ▼
实际发出的请求：
  GET /sso-api/api/users
  Headers:
    Authorization: Bearer eyJ...
    X-Tenant-Id: 1
```

### 【易错点】sendTenantId 参数

SSO API 不需要 `X-Tenant-Id`（因为 SSO 服务器不按租户隔离数据），所以创建 SSO HTTP 客户端时传入 `{ sendTenantId: false }`：

```typescript
// src/api/auth/http.ts
const ssoHttp = createHttp("/sso-api", { sendTenantId: false })
//                           ^^^^^^^^           ^^^^^^^^^^^^^^^^^^^^
//                           SSO 代理路径        不发送租户 ID

// 而权限 API 客户端默认发送
const permHttp = createHttp("/perm-api")  // sendTenantId 默认 true
```

如果错误地给 SSO 客户端也发送 `X-Tenant-Id`，SSO 服务器可能会忽略它（无害），也可能会报错（有害），取决于后端实现。

---

## 响应拦截器：ApiResult 自动包裹

```typescript
// 跳过 OIDC/OAuth2 端点（/connect/*），这些端点返回原生格式，不应包裹 ApiResult
if (data !== null && typeof data === 'object' && !('success' in data) && !url.includes("/connect/")) {
  response.data = { success: true, code: 0, message: 'ok', data } as ApiResult<unknown>
}
```

**为什么需要自动包裹？** AdminWeb 的 API 返回格式不统一：

| 来源 | 返回格式 | 处理方式 |
|------|---------|---------|
| 业务 API | `{ success: true, data: {...}, code: 0, message: "ok" }` | 已经是 ApiResult，不需要处理 |
| 旧接口 | `{ id: 1, name: "xxx" }` | 自动包裹为 `{ success: true, data: { id: 1, name: "xxx" } }` |
| OAuth2 端点 | `{ access_token: "eyJ...", token_type: "Bearer" }` | 跳过，不包裹 |

### 【设计取舍】自动包裹 vs 强制统一

**自动包裹的优势**：前端代码可以统一用 `res.data.xxx` 访问，不需要判断响应格式。

**自动包裹的风险**：如果后端新增的接口恰好返回了含 `success` 字段的对象但不是 ApiResult 格式，会被误判为已是 ApiResult 而跳过包裹。当前通过 `!('success' in data)` 判断，虽然不完美，但实际中尚未遇到冲突。

---

## 响应拦截器：Blob 错误检测

```typescript
if (data instanceof Blob) {
  if (data.type && data.type.includes('application/json')) {
    // 后端返回了 JSON 而非文件，解析为错误
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
```

**这个场景什么时候发生？** 前端请求文件下载时设置了 `responseType: 'blob'`。如果后端返回了错误（如权限不足），HTTP 状态码可能是 200，但 body 是 JSON 错误信息而非文件。axios 会把 JSON 字符串也当成 Blob 处理。

**检测方式**：检查 Blob 的 `type` 属性。如果是 `application/json`，说明后端返回的是错误信息，需要解析为异常抛出。

---

## 并发刷新详解

### 场景1：正在刷新 → 加入等待队列

```typescript
if (isRefreshing) {
  return new Promise<string>((resolve, reject) => {
    failedQueue.push({ resolve, reject })
  }).then((newToken) => {
    originalRequest.headers.Authorization = `Bearer ${newToken}`
    return http(originalRequest)
  })
}
```

### 场景2：开始刷新

```typescript
originalRequest._retry = true
isRefreshing = true

try {
  const res = await axios.post("/connect/token", ...)
  processQueue(null, access_token)   // 唤醒所有等待中的请求
  return http(originalRequest)
} catch (refreshError) {
  processQueue(refreshError, null)    // 刷新失败，全部拒绝
  useAuthStore.getState().logout()
  window.location.href = "/login"
} finally {
  isRefreshing = false
}
```

### 并发刷新时序图（3 个并发请求）

```
时间线 ──────────────────────────────────────────────────────→

请求A ──GET /api/users────401──┐
                                │ isRefreshing=false → 开始刷新
请求B ──GET /api/roles───401──┤ isRefreshing=true → 加入 failedQueue
                                │
请求C ──GET /api/menus───401──┘ isRefreshing=true → 加入 failedQueue
                                │
                     ┌──────────┴──────────┐
                     │  POST /connect/token │
                     │  grant_type=         │
                     │  refresh_token       │
                     │  ⏱ 200-500ms         │
                     └──────────┬──────────┘
                                │
                     ┌──────────┴──────────────────────┐
                     │  processQueue(null, newToken)     │
                     │  → A: resolve(newToken) → 重发    │
                     │  → B: resolve(newToken) → 重发    │
                     │  → C: resolve(newToken) → 重发    │
                     │  failedQueue = []                 │
                     │  isRefreshing = false              │
                     └──────────────────────────────────┘
                                │
                     ┌──────────┴──────────┐
                     │  三个请求都用新 token  │
                     │  自动重发，对调用方无感  │
                     └─────────────────────┘
```

> **后端类比**：类似"双重检查锁定"（Double-Checked Locking）模式。`isRefreshing` 是锁标志，`failedQueue` 是等待队列，`processQueue` 相当于 `Monitor.PulseAll`。

> **🤔 导师提问**：如果 10 个请求同时返回 401，实际会发起多少次刷新请求？为什么？

### processQueue 的作用

当 `processQueue` 调用 `resolve(newToken)` 时，每个排队请求的 `.then()` 回调自动执行，用新 token 重发。对调用方完全无感。

> **后端类比**：`processQueue` 类似 `TaskCompletionSource<T>`。排队请求创建了 TCS，刷新完成后通过 `SetResult()` 一次性唤醒所有等待者。

### `_retry` 标志

防止无限循环：如果刷新 token 后重发请求仍然 401，`_retry` 标记确保不会再次刷新，而是直接跳转登录页。

```
请求A → 401 → _retry=false → 开始刷新 → 获得新 token → 重发
  → 仍然 401 → _retry=true → 不再刷新 → 直接跳转登录页
```

> **🤔 导师提问**：`_retry` 标志加在 `originalRequest` 上，而不是共享变量。两个不同请求同时 401 时，它们会共享同一个 `_retry` 标志吗？为什么这样是安全的？

### 【易错点】刷新 Token 用裸 axios，不走 createHttp

刷新 Token 的请求使用 `axios.post("/connect/token", ...)` 而不是 `http.post()`，因为：

1. `http` 实例带 `baseURL`（如 `/sso-api`），但 `/connect/token` 不需要前缀
2. `http` 的响应拦截器会触发 401 刷新逻辑，而刷新请求本身不应该再触发刷新
3. 避免循环依赖：刷新逻辑不能触发自己

```typescript
// ✅ 刷新时用裸 axios
const res = await axios.post("/connect/token", ...)

// ❌ 如果用 http 实例，会走 baseURL 前缀，且响应拦截器可能再触发刷新
// const res = await http.post("/connect/token", ...)  // 危险！
```

---

## createHttp 的使用示例

AdminWeb 中有多个 HTTP 客户端，每个对应一个后端服务：

```typescript
// src/api/auth/http.ts — SSO 服务（不发送租户 ID）
const ssoHttp = createHttp("/sso-api", { sendTenantId: false })

// src/api/perm/http.ts — 权限服务（默认发送租户 ID）
const permHttp = createHttp("/perm-api")

// src/api/gateway/http.ts — 网关服务
const gwHttp = createHttp("/gw-api")

// src/api/file/http.ts — 文件服务
const fileHttp = createHttp("/file-api")
```

每个 HTTP 客户端实例独立维护自己的 `isRefreshing` 和 `failedQueue`。这意味着刷新 Token 时，只有同一个 HTTP 实例下的并发请求会被排队。

### 【性能陷阱】多个 HTTP 实例可能同时刷新

如果用户在页面加载时同时请求了 SSO API 和权限 API，且两个 token 都过期了，可能会触发两次独立的刷新请求。但实际中这种情况很少发生——因为所有 HTTP 实例共享同一个 `useAuthStore`，第一个刷新成功后 token 就更新了，第二个实例的请求拦截器会拿到新 token。

> **🤔 导师提问**：如果两个 HTTP 实例同时开始刷新，第一个先成功并更新了 store 中的 token，第二个也会成功但拿到不同的 refresh_token——这会导致 token 竞争问题吗？

---

## 改进建议：主动检查 token 过期

当前方案完全依赖 401 触发刷新。改进：在请求拦截器中主动检查 token 是否即将过期：

```typescript
http.interceptors.request.use(async (config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    const expiresAt = parseJwtExpiry(accessToken)
    // 提前 60 秒刷新
    if (expiresAt && Date.now() > expiresAt - 60_000) {
      await refreshTokenSilently()
    }
    config.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`
  }
  return config
})
```

> **后端类比**：类似 ASP.NET Core 中 Cookie 认证的"滑动过期"——每次请求都检查是否即将过期，如果是则自动续期。

### 【设计取舍】被动刷新 vs 主动刷新

| 方案 | 优点 | 缺点 |
|------|------|------|
| 被动刷新（401 触发） | 简单，只在必要时刷新 | 用户可能看到短暂的加载卡顿 |
| 主动刷新（定时检查） | 用户无感知，体验更流畅 | 实现复杂，需要定时器管理 |
| 混合方案 | 兼顾体验和简单性 | 需要处理两种刷新路径 |

AdminWeb 当前选择被动刷新，因为 401 刷新的延迟很小（200-500ms），用户几乎无感知。

---

> **🔍 验证步骤**
>
> 1. 登录后，打开 DevTools → Network，触发任意 API 请求（如刷新用户列表）
> 2. 检查 Request Headers：应包含 `Authorization: Bearer xxx` 和 `X-Tenant-Id: xxx`
> 3. 在 Console 中手动将 token 过期：`useAuthStore.getState().setTokens("expired-token", null)`
> 4. 再次触发 API 请求，观察 Network：应看到 401 响应 → 自动 `/connect/token` 刷新请求 → 原请求重试成功
> 5. 如果同时触发 3 个 API 请求且 token 已过期，Network 中应只有 1 个刷新请求（并发队列生效）

## 🤔 思考题

**Level 1（概念级）**：请求拦截器中，为什么用 `useAuthStore.getState()` 而不是 `useAuthStore()` 来读取状态？

**Level 2（推理级）**：并发刷新队列中，`processQueue` 的 `resolve` 和 `reject` 是什么时候被创建的？它们是如何在刷新完成后被调用的？如果刷新过程中用户关闭了浏览器，队列中的请求会怎样？

**Level 3（动手级）**：在 `createHttp` 中，`_retry` 标志加在 `originalRequest` 上而非用独立变量追踪。如果两个不同的请求同时 401，第二个请求也会检查 `_retry`——这会导致问题吗？为什么？

---

## ✅ 输出检查清单

读完本节，我们应该能回答：

- [ ] `createHttp` 的请求拦截器做了哪两件事？（Bearer Token 和 X-Tenant-Id 注入）
- [ ] `sendTenantId` 参数的作用是什么？SSO 客户端为什么设为 `false`？
- [ ] 响应拦截器如何处理非 ApiResult 格式的响应？为什么跳过 `/connect/` 路径？
- [ ] Blob 错误检测的场景是什么？如何判断 Blob 中包含的是错误 JSON？
- [ ] 并发刷新队列的完整流程：`isRefreshing` + `failedQueue` + `processQueue` 如何配合？
- [ ] `_retry` 标志防止的是什么问题？
- [ ] 为什么刷新 Token 要用裸 `axios` 而不是 `http` 实例？
- [ ] Zustand persist 的作用是什么？它持久化了哪些内容？

---

[← 上一篇](./04-useAuth-Hook.md) | [下一篇 →](./06-路由守卫.md)
