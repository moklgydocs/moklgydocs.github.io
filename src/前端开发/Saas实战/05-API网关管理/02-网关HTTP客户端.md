# 网关 HTTP 客户端

[← 上一篇：YARP网关基础](01-YARP网关基础.md) | [下一篇：集群管理 →](03-集群管理.md)

---

> **这一步解决什么问题？** 上一步我们了解了 YARP 网关的概念和类型定义。现在要动手写代码了——第一步是搭建网关模块的 HTTP 客户端层。网关模块所有 API 调用都基于这个 HTTP 客户端，理解它是理解后续 API 层和页面的前提。

---

## `createHttp` 工厂回顾

网关模块的 HTTP 客户端通过 `createHttp("/gw-api")` 创建，源码来自 `src/lib/create-http.ts`：

```typescript
/**
 * 创建一个绑定到特定后端前缀的 axios 实例（含 Token 自动注入 & 刷新逻辑）。
 */
export function createHttp(basePrefix: string, options?: CreateHttpOptions) {
  const { sendTenantId = true } = options ?? {}

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

  // ... 响应拦截（401 自动刷新 Token 等）

  return {
    instance: http,
    async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResult<T>> { ... },
    async post<T>(url: string, data?: unknown): Promise<ApiResult<T>> { ... },
    async put<T>(url: string, data?: unknown): Promise<ApiResult<T>> { ... },
    async del<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> { ... },
    async postForm<T>(url: string, data: Record<string, string>): Promise<T> { ... },
  }
}
```

**后端类比**：

| 前端 | 后端 (ASP.NET Core) | 作用 |
|------|---------------------|------|
| `createHttp("/gw-api")` | `services.AddHttpClient("gateway", c => c.BaseAddress = ...)` | 创建命名客户端 |
| `http.interceptors.request` | `DelegatingHandler` | 请求拦截（加 Token、租户头） |
| `http.interceptors.response` | `DelegatingHandler` + Polly | 响应拦截（401 刷新重试） |
| `ApiResult<T>` | 统一响应包装 `Result<T>` | 标准化 API 返回格式 |

---

## 网关 HTTP 客户端完整源码

### `src/api/gateway/http.ts`

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

### 逐行讲解

**`createHttp("/gw-api")`**：

- 传入 `"/gw-api"` 作为 `baseURL`，之后所有 `get("/api/gateway/clusters")` 请求实际发出的是 `/gw-api/api/gateway/clusters`。
- Vite 开发服务器会拦截 `/gw-api/*` 请求，去掉前缀后转发到 `http://moklgy.me:10000`。【生产环境】Nginx 做同样的 rewrite。
- 没有传第二个参数 `options`，所以 `sendTenantId` 使用默认值 `true`——每个请求都会自动带上 `X-Tenant-Id` 请求头。

> **🤔 导师提问**：如果未来有个新模块需要跨租户访问（比如 SSO），该怎么配置 `createHttp`？你会传什么参数？

**`const { get, post, put, del } = gwHttp`**：

- 解构出四个常用方法，其他模块文件直接 `import { get, post } from "./http"` 即可。
- **后端类比**：就像 `IHttpClientFactory.CreateClient("gateway")` 返回一个配好 BaseAddress 的 `HttpClient`，子模块直接用。

【性能陷阱】解构出的 `get/post/put/del` 都是闭包，绑定了 `baseURL` 和拦截器。不要在循环中反复创建 HTTP 客户端——整个模块只创建一次 `gwHttp`，所有子模块共享。

**`export default gwHttp.instance`**：

- 导出底层 axios 实例，供特殊场景使用（如需要自定义请求配置、添加额外拦截器等）。
- 日常 CRUD 不需要直接用 instance，解构出的 `get/post/put/del` 已经够用。

---

## 网关运行时 API 完整源码

### `src/api/gateway/gateway.ts`

```typescript
import { post, get } from "./http"
import type { GatewayStatus } from "@/types"

/** 网关运行时管理 API，提供配置重载和状态查询功能 */
export const gatewayApi = {
  /** 重新加载网关配置（使修改的集群/路由/限流策略生效） */
  reload: () => post<object>("/api/gateway/reload"),

  /** 获取网关当前运行状态 */
  status: () => get<GatewayStatus>("/api/gateway/status"),
}
```

### 逐行讲解

**`gatewayApi` 对象**：

- 用对象字面量组织 API 方法，而非一个个 `export function`。【风格统一】本项目中所有 `xxxApi` 都用对象字面量，方便调用方 `import { gatewayApi }` 后统一访问。
- **后端类比**：类似于 `IGatewayService` 接口定义，把相关方法放在一起。

**`reload()`**：

- 调用后端的配置重载接口。YARP 的配置变更（如新加集群、修改路由）不会立即生效，需要**显式重载**。
- **后端类比**：类似于 `IOptionsMonitor<T>.Reload()` 或手动重启服务，只不过这里是热重载，不需要停机。
- 返回 `post<object>`，因为重载操作只关心成功/失败，不需要返回数据。

【易错点】`reload()` 只对路由和集群配置生效。限流策略的变更需要**重启 Gateway 服务**，因为 ASP.NET Core 的 `RateLimiterOptions` 在注册后是只读快照，不支持热更新。

**`status()`**：

- 查询当前 YARP 运行时状态：有多少活跃路由、多少集群、各集群有多少目标地址。
- 返回 `GatewayStatus` 类型，用于仪表盘页面展示。
- **后端类比**：类似于 ASP.NET Core 的 `/health` 端点 + 自定义诊断信息。

### `gatewayApi` 方法汇总

| 方法 | HTTP | 路径 | 返回类型 | 说明 |
|------|------|------|----------|------|
| `reload()` | POST | `/api/gateway/reload` | `ApiResult<object>` | 热重载路由和集群配置 |
| `status()` | GET | `/api/gateway/status` | `ApiResult<GatewayStatus>` | 查询网关运行时状态 |

> **🤔 导师提问**：`reload()` 只对路由和集群生效，对限流策略无效。为什么？提示：想想 YARP 架构中"reload"意味着什么。

---

## 为什么网关模块不需要 `sendTenantId: false`？

你可能注意到 `createHttp("/gw-api")` 没有传 `options`。默认 `sendTenantId = true`，意味着请求会自动带 `X-Tenant-Id` 头。

这和 SSO 模块不同（SSO 用 `createHttp("/sso-api", { sendTenantId: false })`）。原因是：

- **SSO 是跨租户的**：登录、Token 刷新不属于任何租户，所以不带租户头。
- **网关管理是租户级的**：不同租户可能有不同的网关配置（路由、限流策略），所以需要租户标识。

| 模块 | `sendTenantId` | 原因 | 后端类比 |
|------|---------------|------|----------|
| SSO (`/sso-api`) | `false` | 登录/Token 是跨租户操作 | `[AllowAnonymous]` 公开端点 |
| 权限 (`/perm-api`) | `true`（默认） | 权限数据按租户隔离 | 需要 `TenantResolver` 的端点 |
| 网关 (`/gw-api`) | `true`（默认） | 网关配置按租户隔离 | 需要 `TenantResolver` 的端点 |

> **🤔 导师提问**：为什么权限 API（`/perm-api`）默认要带 `X-Tenant-Id`，而 SSO 不带？权限和网关在安全模型上有什么本质区别？

【设计取舍】`sendTenantId` 默认为 `true`，是因为系统中大多数 API 都是租户隔离的，只有 SSO 这种跨租户场景才需要显式关闭。这遵循了"安全默认值"原则——默认带租户头，宁可多传一个后端忽略的头，也不要漏传导致数据串租户。

---

## `createHttp` 的请求方法签名

`createHttp` 返回的对象提供了 5 个方法，每个方法都封装了 axios 调用 + 统一错误处理：

| 方法 | 签名 | 用途 | 后端类比 |
|------|------|------|----------|
| `get<T>` | `(url, params?) → ApiResult<T>` | 查询资源 | `HttpGet` |
| `post<T>` | `(url, data?) → ApiResult<T>` | 创建资源 / 执行操作 | `HttpPost` |
| `put<T>` | `(url, data?) → ApiResult<T>` | 全量更新资源 | `HttpPut` |
| `del<T>` | `(url, config?) → ApiResult<T>` | 删除资源 | `HttpDelete` |
| `postForm<T>` | `(url, data) → T` | 表单提交（无统一包装） | `HttpPost` + `multipart/form-data` |

【易错点】`post` 和 `postForm` 的返回类型不同：`post<T>` 返回 `ApiResult<T>`（统一包装），`postForm<T>` 返回 `T`（原始数据）。这是因为表单提交场景（如 SSO 登录）的响应格式与标准 API 不同。

### `ApiResult<T>` 统一响应结构

```typescript
export interface ApiResult<T = unknown> {
  /** 业务状态码，0 表示成功 */
  code: number
  /** 响应消息 */
  message: string
  /** 是否成功 */
  success: boolean
  /** 响应数据 */
  data?: T
}
```

**后端类比**：这就是后端的 `Result<T>` 模式——`return Result.Ok(data)` / `return Result.Fail("error message")`。前端通过 `res.success` 判断，不再需要检查 HTTP 状态码。`code` 为 0 表示业务成功，非 0 对应不同业务错误码。`data` 是可选的（`data?: T`），因为失败响应可能没有数据。

---

## 请求流转全景图

一个完整的网关 API 请求，从前端发出到后端响应，经历以下环节：

```
前端代码调用 clustersApi.getAll()
  │
  ▼
gwHttp.get("/api/gateway/clusters")
  │ baseURL = "/gw-api"
  │ 实际请求: GET /gw-api/api/gateway/clusters
  ▼
请求拦截器 (interceptors.request)
  │ 1. 从 useAuthStore 读取 accessToken → Authorization: Bearer xxx
  │ 2. 从 useAuthStore 读取 currentTenantId → X-Tenant-Id: tenant-001
  ▼
浏览器发出请求
  │
  ▼
Vite Dev Server (开发环境) / Nginx (生产环境)
  │ 匹配 /gw-api 前缀
  │ rewrite: 去掉 /gw-api 前缀
  │ changeOrigin: true (修改 Host 头)
  ▼
YARP Gateway (moklgy.me:10000)
  │ GET /api/gateway/clusters
  │ 验证 Token → 验证租户 → 路由匹配 → 转发
  ▼
Gateway Admin API (ASP.NET Core)
  │ [Authorize] + [TenantResolver]
  │ Controller 处理 → 返回 JSON
  ▼
响应拦截器 (interceptors.response)
  │ 401 → 尝试刷新 Token → 重试
  │ 其他错误 → toast 提示
  ▼
前端收到 ApiResult<ClusterDto[]>
```

> **🤔 导师提问**：追踪一下：当后端返回 401 时，请求流转图中的哪个环节会处理它？会触发什么状态变化？

---

### 开发环境 vs 生产环境的代理差异

| 维度 | 开发环境 (Vite) | 生产环境 (Nginx) |
|------|----------------|-----------------|
| 代理配置 | `vite.config.ts` 的 `server.proxy` | `nginx.conf` 的 `location` |
| 前缀去除 | `rewrite: (p) => p.replace(/^\/gw-api/, "")` | `rewrite ^/gw-api/(.*) /$1 break;` |
| 目标地址 | `target: "http://moklgy.me:10000"` | `proxy_pass http://gateway:10000;` |
| Host 头 | `changeOrigin: true` | `proxy_set_header Host $proxy_host;` |
| HTTPS | 通常不需要 | 需要 `proxy_ssl_verify off;` |

【易错点】开发环境和生产环境的代理配置要保持一致。常见 bug：Vite 配了 `changeOrigin: true` 但 Nginx 忘了 `proxy_set_header Host`，导致本地正常但线上 403。

---

> **🔍 验证步骤**
>
> 1. 在 Console 中执行 `gatewayApi.getAll()`，应返回包含 `success: true` 的 `ApiResult`
> 2. 检查 Network：请求 URL 应为 `/gw-api/api/gateway/clusters`，Header 中应有 `X-Tenant-Id`
> 3. 对比执行 `ssoApi.getCurrentUser()`，其请求 URL 为 `/sso-api/api/account/current`，Header 中没有 `X-Tenant-Id`——确认 `sendTenantId` 参数生效

## 🤔 思考题

**Level 1（概念级）**：`createHttp("/gw-api")` 创建的 HTTP 客户端，`get("/api/gateway/clusters")` 实际发出的请求 URL 是什么？经过了哪些中间环节？

**Level 2（推理级）**：为什么网关模块用 `sendTenantId: true`（默认值），而 SSO 模块用 `sendTenantId: false`？如果网关模块误设为 `false`会发生什么？

**Level 3（动手级）**：如果要给网关模块加一个 `healthCheck()` 方法（调用 `/api/gateway/health`），返回 `ApiResult<{ status: string; uptime: number }>`，我们会怎么写？提示：在 `gatewayApi` 对象中新增一个方法即可。

参考答案：

```typescript
export const gatewayApi = {
  reload: () => post<object>("/api/gateway/reload"),
  status: () => get<GatewayStatus>("/api/gateway/status"),
  // 新增：网关健康检查
  healthCheck: () => get<{ status: string; uptime: number }>("/api/gateway/health"),
}
```

只需要在 `gatewayApi` 对象中加一行，因为 `get` 方法已经封装了 axios 调用 + `ApiResult` 包装。这就是 `createHttp` 工厂模式的优势——新增 API 方法只需一行代码。

---

## ✅ 输出检查清单

完成本篇学习后，确认我们能够：

- [ ] 说明 `createHttp("/gw-api")` 创建的 HTTP 客户端如何工作（baseURL 拼接、拦截器注入）
- [ ] 区分 `gwHttp.get/post/put/del` 和 `gwHttp.instance` 的使用场景
- [ ] 解释 `gatewayApi.reload()` 和 `gatewayApi.status()` 的作用和区别
- [ ] 理解 `sendTenantId` 参数的设计意图（安全默认值原则）
- [ ] 画出完整的请求流转路径（前端代码 → 拦截器 → Vite/Nginx → YARP → Admin API）
- [ ] 知道 `reload()` 只对路由/集群生效，限流策略需要重启 Gateway
- [ ] 理解开发环境和生产环境代理配置的差异和一致性要求
- [ ] 能够新增一个 API 方法（只需在 `xxxApi` 对象中加一行）

---

## 📋 本步产出清单

| 文件 | 说明 |
|------|------|
| `05-API网关管理/02-网关HTTP客户端.md` | 本文件：createHttp 工厂、网关 HTTP 客户端完整源码、运行时 API、请求流转全景图、与 SSO 模块的对比、sendTenantId 设计取舍 |

---

[← 上一篇：YARP网关基础](01-YARP网关基础.md) | [下一篇：集群管理 →](03-集群管理.md)
