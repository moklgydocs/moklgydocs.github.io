# 02 - 运营 API 层：从 HTTP 客户端到 7 大模块

> **这一步解决什么问题？**
> 就像后端用 `IHttpClientFactory` 封装微服务调用一样，前端也需要为运营中心创建独立的 API 客户端。运营中心后端是独立微服务（TenantOpsCenter），监听在 `http://moklgy.me:10013`。前端通过 Vite 代理 `/ops-api/*` 转发请求。我们需要一个 HTTP 客户端 + 各子模块的 API 封装。
>
> **ASP.NET Core 开发者的直觉**：`createHttp("/ops-api")` 就像注册 `IHttpClientFactory.AddHttpClient("OpsCenter")`，为每个微服务创建命名的 HttpClient。解构导出 `{ get, post, put, del }` 就像注入 `HttpClient` 后直接使用。

---

## 前置知识

- 理解 `createHttp` 工厂函数与 axios 实例创建（见模块 03-HTTP客户端封装）
- 了解 ASP.NET Core 的 `IHttpClientFactory` 命名客户端模式
- 熟悉上一节（01-SaaS多租户架构）中运营中心的整体架构和 `/ops-api` 前缀

---

## 一、HTTP 客户端：运营中心的"门户"

### 1.1 http.ts 的完整实现

```typescript
// src/api/ops/http.ts
import { createHttp } from "@/lib/create-http"

/** 租户运营中心 HTTP 客户端，基础路径为 /ops-api */
const opsHttp = createHttp("/ops-api")

/** 导出常用 HTTP 方法 */
export const { get, post, put, del, postForm } = opsHttp
/** 导出 axios 实例，供需要自定义配置的场景使用 */
export default opsHttp.instance
```

4 行代码，但做了很多事：

1. **创建 axios 实例**：`baseURL: "/ops-api"`，所有请求自动加前缀
2. **Token 自动注入**：每次请求自动从 Zustand Store 读取 `accessToken`，加到 `Authorization: Bearer xxx`
3. **租户 ID 自动注入**：默认发送 `X-Tenant-Id` 请求头（运营中心场景下可忽略，因为是跨租户操作）
4. **401 自动刷新**：Token 过期时自动用 `refresh_token` 换新 Token，重发原请求
5. **响应格式统一**：非标准 `ApiResult<T>` 格式自动包裹

【设计取舍】 每个微服务一个 HTTP 客户端实例，类似 ASP.NET 的 Typed HttpClient。好处是拦截器互相隔离——如果 SSO 的 API 需要特殊处理（比如不发 X-Tenant-Id），不会影响运营中心的 API。

> **🤔 导师提问**：在 ASP.NET Core 中，你习惯用 `IHttpClientFactory.AddHttpClient("OpsCenter")` 注册命名的 HttpClient。前端的 `createHttp("/ops-api")` 和它有何异同？如果两个微服务需要不同的请求拦截逻辑（比如 SSO 不发 X-Tenant-Id），`createHttp` 的 `options` 参数如何帮你实现这种隔离？

### 1.2 createHttp 的核心逻辑

```typescript
// src/lib/create-http.ts（简化版）
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
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
    if (sendTenantId && currentTenantId) config.headers["X-Tenant-Id"] = currentTenantId
    return config
  })

  // 响应拦截：401 自动刷新 Token
  http.interceptors.response.use(/* ... */)

  return { instance: http, get, post, put, del, postForm }
}
```

【易错点】 `sendTenantId` 默认为 `true`，但 SSO 等跨服务 API 应设为 `false`。运营中心虽然是跨租户操作，但后端仍然需要 `X-Tenant-Id` 做审计日志记录，所以保持默认。

---

## 二、7 大 API 模块全景

### 2.1 模块目录结构

```
api/ops/
  ├── http.ts          ← HTTP 客户端（门户）
  ├── overview.ts      ← 平台概览（1 个方法）
  ├── editions.ts      ← 版本管理（5 个方法）
  ├── tenants.ts       ← 租户管理（12 个方法，最复杂）
  ├── features.ts      ← 功能开关（3 个方法）
  ├── webhooks.ts      ← Webhook 管理（4 个方法）
  ├── mfa.ts           ← MFA 多因素认证（5 个方法）
  ├── data-exchange.ts ← 数据导入导出（4 个方法）
  └── workflow.ts      ← 工作流审批（4 个方法）
```

---

## 三、逐模块源码解读

### 3.1 overview.ts —— 平台概览

```typescript
// src/api/ops/overview.ts
import { get } from "./http"
import type { PlatformOverviewDto } from "@/types"

export const overviewApi = {
  get: () => get<PlatformOverviewDto>("/api/tenant-ops/overview"),
}
```

最简单的模块——一个 `get` 请求，返回 5 个统计数字。`PlatformOverviewDto` 定义在全局 `types/index.ts` 中：

```typescript
export interface PlatformOverviewDto {
  totalTenants: number              // 租户总数
  activeTenants: number             // 活跃租户
  suspendedTenants: number          // 暂停租户
  totalEditions: number             // 版本总数
  monthlyRecurringRevenue: number   // 月度经常性收入(MRR)
}
```

**ASP.NET Core 类比**：`overviewApi.get()` 就像调用 `IMediator.Send(new GetPlatformOverviewQuery())`——一个只读查询，不修改任何状态。

> **🤔 导师提问**：7 个 API 模块按领域拆分成独立文件，而不是写在一个 `api.ts` 中。在后端你习惯用 `Controllers/EditionsController.cs` + `Controllers/TenantsController.cs` 做类似的拆分。前端的模块拆分和后端的 Controller 拆分，在职责边界划分上有什么共同的指导原则？

### 3.2 editions.ts —— 版本管理

```typescript
// src/api/ops/editions.ts
import { get, post, put, del } from "./http"
import type { EditionDto, CreateEditionRequest, UpdateEditionRequest } from "@/types"

export const editionsApi = {
  getList: () => get<EditionDto[]>("/api/tenant-ops/editions"),
  getById: (id: string) => get<EditionDto>(`/api/tenant-ops/editions/${id}`),
  create: (data: CreateEditionRequest) => post<string>("/api/tenant-ops/editions", data),
  update: (id: string, data: UpdateEditionRequest) => put<void>(`/api/tenant-ops/editions/${id}`, data),
  delete: (id: string) => del<void>(`/api/tenant-ops/editions/${id}`),
}
```

标准的 CRUD 五件套：`getList` / `getById` / `create` / `update` / `delete`。

【易错点】 `create` 的返回类型是 `post<string>`，不是 `post<EditionDto>`。后端只返回新建版本的 ID（string），不是完整的 DTO。前端创建成功后，调用 `getList()` 刷新列表即可。

【易错点】 `CreateEditionRequest` 包含 `code` 字段，`UpdateEditionRequest` 不包含。版本代码创建后不可修改。

> **🤔 导师提问**：`tenantsApi` 有 12 个方法，是所有模块中最多的。观察它的方法命名——`provision`、`suspend`、`activate`、`terminate`，而不是 `createStatus("suspended")`。这和后端用独立 Action 方法（而非一个大 Switch）有什么共同的设计考量？

### 3.3 tenants.ts —— 租户管理

这是最复杂的模块，包含 12 个方法，分为三大类：

```typescript
// src/api/ops/tenants.ts
import { get, post, put } from "./http"
import type {
  ProvisionTenantRequest, SubscribeEditionRequest,
  TenantDashboardDto, TenantQuotaDto, UpdateQuotaRequest,
  TenantModuleAccessDto, ToggleModuleRequest,
  TenantFeatureFlagDto, SetFeatureFlagRequest,
  TenantHealthCheckDto, TenantOperationLogDto,
} from "@/types"

export const tenantsApi = {
  // ── 生命周期（5 个方法）──
  provision: (data: ProvisionTenantRequest) =>
    post<string>("/api/tenant-ops/tenants/provision", data),
  suspend: (tenantId: string, reason?: string) =>
    post<void>(`/api/tenant-ops/tenants/${tenantId}/suspend`, { reason }),
  activate: (tenantId: string) =>
    post<void>(`/api/tenant-ops/tenants/${tenantId}/activate`),
  terminate: (tenantId: string, reason?: string) =>
    post<void>(`/api/tenant-ops/tenants/${tenantId}/terminate`, { reason }),
  subscribeEdition: (tenantId: string, data: SubscribeEditionRequest) =>
    post<void>(`/api/tenant-ops/tenants/${tenantId}/edition`, data),

  // ── 详情查询（7 个方法）──
  getDashboard: (tenantId: string) =>
    get<TenantDashboardDto>(`/api/tenant-ops/tenants/${tenantId}/dashboard`),
  getQuotas: (tenantId: string) =>
    get<TenantQuotaDto[]>(`/api/tenant-ops/tenants/${tenantId}/quotas`),
  updateQuota: (tenantId: string, resourceType: string, data: UpdateQuotaRequest) =>
    put<void>(`/api/tenant-ops/tenants/${tenantId}/quotas`, { ...data, tenantId, resourceType }),
  getModules: (tenantId: string) =>
    get<TenantModuleAccessDto[]>(`/api/tenant-ops/tenants/${tenantId}/modules`),
  toggleModule: (tenantId: string, data: ToggleModuleRequest) =>
    post<void>(`/api/tenant-ops/tenants/${tenantId}/modules/toggle`, { ...data, tenantId }),
  getFeatures: (tenantId: string) =>
    get<TenantFeatureFlagDto[]>(`/api/tenant-ops/tenants/${tenantId}/features`),
  setFeature: (tenantId: string, data: SetFeatureFlagRequest) =>
    post<void>(`/api/tenant-ops/tenants/${tenantId}/features`, { ...data, tenantId }),
  getHealth: (tenantId: string) =>
    get<TenantHealthCheckDto>(`/api/tenant-ops/tenants/${tenantId}/health`),
  getOperations: (tenantId: string, params?) =>
    get<TenantOperationLogDto[]>(`/api/tenant-ops/tenants/${tenantId}/operations`, params),
}
```

逐行关键点：

| 行 | 代码 | 说明 |
|----|------|------|
| 1 | `provision` | 开通租户，返回新建租户 ID。后端异步初始化数据库 |
| 2 | `suspend(tenantId, reason?)` | 暂停需要原因（审计日志）。`reason` 是可选参数 |
| 3 | `activate(tenantId)` | 激活不需要原因（恢复正常操作） |
| 4 | `terminate(tenantId, reason?)` | 终止需要原因。**不可逆操作！** |
| 5 | `subscribeEdition` | 【易错点】订阅是"创建订阅关系"，不是"更新租户字段" |
| 6 | `{ ...data, tenantId, resourceType }` | 【易错点】展开运算符把 URL 中的 tenantId 再塞进 body |
| 7 | `getOperations` 支持分页 | `params` 对象包含 `operationType`、`page`、`pageSize` |

【易错点】 `suspend` 和 `terminate` 的 `reason` 参数：后端接口设计为 `POST body: { reason?: string }`。如果前端直接传 `reason` 字符串，后端收到的不是对象，会解析失败。所以必须包装为 `{ reason }` 对象。

### 3.4 features.ts —— 功能开关

```typescript
// src/api/ops/features.ts
import { get, post } from "./http"
import type { FeatureFlagCheckResult, FeatureFlagValueResult } from "@/types"

export const featuresApi = {
  isEnabled: (tenantId: string, featureKey: string) =>
    get<FeatureFlagCheckResult>(`/api/tenant-ops/features/tenants/${tenantId}/${featureKey}`),
  getValue: (tenantId: string, featureKey: string) =>
    get<FeatureFlagValueResult>(`/api/tenant-ops/features/tenants/${tenantId}/${featureKey}/value`),
  invalidateCache: (tenantId: string, featureKey: string) =>
    post<{ message: string }>(`/api/tenant-ops/features/tenants/${tenantId}/${featureKey}/invalidate`),
}
```

三个方法的返回类型不同：

```typescript
export interface FeatureFlagCheckResult {
  tenantId: string
  featureKey: string
  enabled: boolean       // 是否启用
}

export interface FeatureFlagValueResult {
  tenantId: string
  featureKey: string
  value: string | null   // 功能值（JSON 字符串）
}
```

**ASP.NET Core 类比**：
- `isEnabled` → `FeatureManager.IsEnabledAsync("MaxUsers")`
- `getValue` → `FeatureManager.GetFeatureValueAsync("MaxUsers")`
- `invalidateCache` → `IMemoryCache.Remove("feature:MaxUsers")`

功能开关通常有后端缓存（如 Redis），`invalidateCache` 清除缓存后下次请求会重新从数据库加载。

### 3.5 data-exchange.ts —— 数据导入导出

```typescript
// src/api/ops/data-exchange.ts
import opsHttpInstance from "./http"

export const dataExchangeApi = {
  exportOperations: (params) =>
    opsHttpInstance.get("/api/tenant-ops/data/export/operations", { params, responseType: "blob" }),
  exportInvoices: (params) =>
    opsHttpInstance.get("/api/tenant-ops/data/export/invoices", { params, responseType: "blob" }),
  exportUsage: (params) =>
    opsHttpInstance.get("/api/tenant-ops/data/export/usage", { params, responseType: "blob" }),
  importTenants: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return opsHttpInstance.post("/api/tenant-ops/data/import/tenants", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
}
```

【易错点】 data-exchange 是唯一使用 `opsHttpInstance`（axios 原始实例）而非解构方法 `get/post` 的模块。原因是：

1. **导出**：需要 `responseType: "blob"` 接收二进制文件。解构的 `get<T>` 方法返回 `ApiResult<T>`，但 blob 响应不是 JSON 格式，需要原始 `AxiosResponse`。
2. **导入**：需要 `FormData` + `multipart/form-data`。解构的 `post<T>` 方法自动设 `Content-Type: application/json`，不适合文件上传。

**ASP.NET Core 类比**：`responseType: "blob"` 对应后端的 `FileStreamResult`；`FormData` 对应 `IFormFile` 参数。

> **🤔 导师提问**：`data-exchange.ts` 使用 axios 原始实例而非解构方法，因为 blob 和 FormData 不兼容统一的 `ApiResult<T>` 包装。在后端，你也会遇到类似场景——比如 `ControllerBase.File()` 返回 `FileStreamResult` 而非 JSON。前端和后端在"统一响应格式 vs 特殊响应类型"的取舍上，有什么共同的思路？

### 3.6 mfa.ts —— MFA 多因素认证

```typescript
// src/api/ops/mfa.ts
import { get, post, del } from "./http"
import type { MfaSetupResult, VerifyMfaCodeRequest } from "@/types"

export const mfaApi = {
  isEnabled: (tenantId: string) =>
    get<{ tenantId: string; mfaEnabled: boolean }>(`/api/tenant-ops/mfa/tenants/${tenantId}/enabled`),
  getStatus: (userId: string, tenantId: string) =>
    get<{ userId: string; status: string }>(`/api/tenant-ops/mfa/users/${userId}/status`, { tenantId } as Record<string, unknown>),
  setup: (userId: string, tenantId: string, email: string) =>
    post<MfaSetupResult>(`/api/tenant-ops/mfa/users/${userId}/setup?tenantId=${tenantId}&email=${encodeURIComponent(email)}`),
  verify: (userId: string, data: VerifyMfaCodeRequest) =>
    post<{ valid: boolean; result: string }>(`/api/tenant-ops/mfa/users/${userId}/verify`, data),
  remove: (userId: string, tenantId: string) =>
    del<void>(`/api/tenant-ops/mfa/users/${userId}?tenantId=${tenantId}`),
}
```

【易错点】 `setup` 方法中 `email` 参数通过 query string 传递，且用了 `encodeURIComponent(email)` 编码。邮箱中的 `@` 如果不编码，URL 解析器可能把 `@` 后面的部分当作域名，导致请求路径错误。

**ASP.NET Core 类比**：`encodeURIComponent` 对应后端的 `Uri.EscapeDataString()`——URL 编码是全栈必须注意的安全细节。

### 3.7 webhooks.ts 与 workflow.ts

```typescript
// src/api/ops/webhooks.ts
export const webhooksApi = {
  getEndpoints: (tenantId?: string, appId?: string) =>
    get<WebhookEndpointDto[]>("/api/tenant-ops/webhooks/endpoints", { tenantId, appId } as Record<string, unknown>),
  createEndpoint: (data: CreateWebhookEndpointRequest) =>
    post<WebhookEndpointDto>("/api/tenant-ops/webhooks/endpoints", data),
  deleteEndpoint: (id: string) =>
    del<void>(`/api/tenant-ops/webhooks/endpoints/${id}`),
  getDeliveries: (endpointId?, page?, pageSize?) =>
    get<unknown[]>("/api/tenant-ops/webhooks/deliveries", { endpointId, page, pageSize } as Record<string, unknown>),
}

// src/api/ops/workflow.ts
export const workflowApi = {
  startProvision: (data: StartProvisionWorkflowRequest) =>
    post<{ instanceId: string; status: string }>("/api/tenant-ops/workflow/provision/start", data),
  startUpgrade: (data: StartUpgradeWorkflowRequest) =>
    post<{ instanceId: string; status: string }>("/api/tenant-ops/workflow/upgrade/start", data),
  approve: (instanceId: string, data: ApprovalRequest) =>
    post<void>(`/api/tenant-ops/workflow/instances/${instanceId}/approve`, data),
  reject: (instanceId: string, data: ApprovalRequest) =>
    post<void>(`/api/tenant-ops/workflow/instances/${instanceId}/reject`, data),
}
```

**ASP.NET Core 类比**：工作流模块就像 MediatR 的 `INotificationHandler`——`startProvision` 发布"开通租户"事件，`approve`/`reject` 是审批人处理事件。Webhook 是事件的外部消费者，类似于 `IEventPublisher` + Webhook 端点。

---

## 四、API 路径设计规则

所有运营中心接口共享 `/api/tenant-ops/` 前缀：

```
/api/tenant-ops/overview
/api/tenant-ops/editions
/api/tenant-ops/editions/:id
/api/tenant-ops/tenants/provision
/api/tenant-ops/tenants/:id/suspend
/api/tenant-ops/tenants/:id/dashboard
/api/tenant-ops/features/tenants/:tenantId/:featureKey
/api/tenant-ops/webhooks/endpoints
/api/tenant-ops/mfa/users/:userId/setup
/api/tenant-ops/data/export/operations
/api/tenant-ops/workflow/provision/start
```

**路径结构规律**：

```
/api/tenant-ops/{资源}/{子资源}/{操作}

示例：
/api/tenant-ops/tenants/:id/quotas     → 租户的配额
/api/tenant-ops/tenants/:id/modules/toggle → 切换租户模块
/api/tenant-ops/features/tenants/:tid/:key  → 查询功能开关
/api/tenant-ops/mfa/users/:uid/setup     → MFA 设置
```

这个结构让 Vite Proxy 可以用一条规则统一转发：`/ops-api/* → http://moklgy.me:10013/*`。

> **🤔 导师提问**：所有 API 路径共享 `/api/tenant-ops/` 前缀，加上 Vite Proxy 的 `/ops-api/*` 转发。请求从浏览器发出到后端，完整路径经过了怎样的变换？`/ops-api/api/tenant-ops/editions` 这个 URL 是怎么变成后端的 `/api/tenant-ops/editions` 的？

---

## 五、小结

| 要点 | 说明 |
|------|------|
| HTTP 客户端 | `createHttp("/ops-api")` + 解构导出 |
| API 模块化 | 7 个文件，按领域拆分 |
| tenantsApi | 12 个方法，最复杂（生命周期 + 详情查询） |
| data-exchange | 唯一用 axios 原始实例的模块（blob + FormData） |
| reason 参数 | suspend/terminate 需要原因（审计日志） |
| encodeURIComponent | URL 中的邮箱等特殊字符必须编码 |
| API 路径前缀 | 统一 `/api/tenant-ops/` |

---

## 🔧 验证步骤

1. 打开浏览器 DevTools 的 Network 面板，在运营中心任意页面操作，观察请求 URL 是否以 `/ops-api/api/tenant-ops/` 开头——这验证了 `createHttp("/ops-api")` + API 路径前缀的组合
2. 在 Console 中输入 `import("@/api/ops/editions").then(m => m.editionsApi.getList())`，观察返回的 `ApiResult` 结构是否包含 `success` 和 `data` 字段——这验证了解构方法 `get<T>` 的统一响应包装
3. 查看 Network 面板中任意请求的 Request Headers，确认包含 `Authorization: Bearer xxx` 和 `X-Tenant-Id`——这验证了请求拦截器的自动注入
4. 在 Console 中调用 `import("@/api/ops/overview").then(m => m.overviewApi.get())`，确认返回的 `PlatformOverviewDto` 包含 5 个统计字段

---

## ⚠️ 踩坑提醒

1. **`sendTenantId` 默认为 true**：SSO 等跨服务 API 应设为 `false`。运营中心虽然是跨租户操作，但后端仍然需要 `X-Tenant-Id` 做审计日志记录，所以保持默认。
2. **`data-exchange.ts` 使用 axios 原始实例**：因为 blob 和 FormData 不兼容统一的 `ApiResult<T>` 包装。导出需要 `responseType: "blob"`，导入需要 `multipart/form-data`。
3. **suspend/terminate 的 reason 必须包装为对象**：后端接口设计为 `POST body: { reason?: string }`。如果前端直接传 reason 字符串，后端收到的不是对象，会解析失败。
4. **`encodeURIComponent` 对邮箱等特殊字符必须编码**：邮箱中的 `@` 如果不编码，URL 解析器可能把 `@` 后面的部分当作域名，导致请求路径错误。

---

## 🤔 思考题

### 概念级（理解 What）
1. 为什么 `data-exchange.ts` 使用 `opsHttpInstance` 而不是解构的 `get/post`？

### 推理级（推导 What-if）
2. `tenantsApi.updateQuota` 的 `{ ...data, tenantId, resourceType }` 为什么要在 body 中重复 tenantId 和 resourceType？后端可能需要两处的哪个值？
3. 如果我们要给 `webhooksApi.getEndpoints` 增加分页支持，需要修改哪些地方？提示：考虑返回类型 `WebhookEndpointDto[]` 是否需要改为 `PagedResult<WebhookEndpointDto>`。

### 动手级（代码实践）
4. 画出从浏览器发出 `GET /ops-api/api/tenant-ops/editions` 到后端返回数据的完整请求链路，标明 Vite proxy 的 rewrite 行为。

---

[← 上一篇：01-SaaS多租户架构](01-SaaS多租户架构.md) | [下一篇：03-平台概览 →](03-平台概览.md)
