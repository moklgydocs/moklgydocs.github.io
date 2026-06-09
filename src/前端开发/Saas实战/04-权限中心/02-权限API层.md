# 02 - 权限 API 层

> **这一步解决什么问题？** 我们要搭建权限中心（PermCenter）的前端 API 层。就像 ASP.NET Core 里写 `HttpClient` 调用后端接口一样，前端也需要封装 API 调用函数。但前端的封装方式不同——我们用 axios + 工厂函数，每个微服务一个 HTTP 实例，自动注入 Token 和租户 ID。

---

## 前置知识

阅读本文档前，你需要了解：

- **ASP.NET Core HttpClient**：`IHttpClientFactory` 的注册和使用方式
- **axios 基础**：请求/响应拦截器、`baseURL` 配置
- **TypeScript 泛型**：`Promise<T>`、`ApiResult<T>` 的用法
- **Vite 代理配置**：`vite.config.ts` 中 `proxy` 字段的作用

---

## 一、ASP.NET Core 类比：HttpClient vs createHttp

在 ASP.NET Core 里，你习惯这样调用远程服务：

```csharp
// ASP.NET Core: 注册命名 HttpClient
services.AddHttpClient("PermCenter", c =>
{
    c.BaseAddress = new Uri("http://moklgy.me:10002/");
    c.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
});

// 使用时
public class AppService
{
    private readonly HttpClient _http;
    public AppService(IHttpClientFactory factory)
    {
        _http = factory.CreateClient("PermCenter");
    }

    public async Task<List<AppDto>> GetAppsAsync()
    {
        return await _http.GetFromJsonAsync<List<AppDto>>("/api/apps");
    }
}
```

前端用 `createHttp` 工厂函数实现类似的效果：

```
ASP.NET Core IHttpClientFactory    →    前端 createHttp()
注册时指定 BaseAddress              →    创建时传入 basePrefix
自动注入 Authorization Header      →    请求拦截器自动注入 Bearer Token
命名 HttpClient 隔离服务            →    每个微服务一个 HTTP 实例
```

---

## 二、权限中心的 HTTP 客户端

权限中心的后端服务运行在 `http://moklgy.me:10002/`，通过 Vite 代理路径 `/perm-api/*` 转发。

### 2.1 创建 HTTP 实例

```typescript
// src/api/perm/http.ts
import { createHttp } from "@/lib/create-http"

/** 权限中心 HTTP 客户端，基础路径为 /perm-api */
const permHttp = createHttp("/perm-api")

/** 导出常用 HTTP 方法 */
export const { get, post, put, del, postForm } = permHttp
/** 导出 axios 实例，供需要自定义配置的场景使用 */
export default permHttp.instance
```

关键点：
- `createHttp("/perm-api")` 创建了一个绑定到 `/perm-api` 前缀的 axios 实例
- 所有通过这个实例发出的请求，URL 会自动加上 `/perm-api` 前缀
- 请求拦截器自动注入 `Authorization: Bearer {token}` 和 `X-Tenant-Id` 头

### 2.2 createHttp 工厂函数做了什么

```typescript
// src/lib/create-http.ts（核心逻辑简化版）
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

  // 响应拦截：401 自动刷新 Token + 非标准响应自动包裹 ApiResult
  http.interceptors.response.use(/* ... */)

  return {
    instance: http,
    async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResult<T>> {
      const res = await http.get<ApiResult<T>>(url, { params })
      return res.data
    },
    async post<T>(url: string, data?: unknown): Promise<ApiResult<T>> { /* ... */ },
    async put<T>(url: string, data?: unknown): Promise<ApiResult<T>> { /* ... */ },
    async del<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> { /* ... */ },
    async postForm<T>(url: string, data: Record<string, string>): Promise<T> { /* ... */ },
  }
}
```

💡 **ASP.NET Core 类比**：这就像 `IHttpClientFactory` + `DelegatingHandler` 的组合——请求拦截器相当于 `DelegatingHandler.SendAsync()`，在发出请求前自动添加 Header。

> **🤔 导师提问**：`createHttp` 的请求拦截器在每次请求时自动注入 `Authorization` 和 `X-Tenant-Id` Header。在 ASP.NET Core 中，你会用什么机制实现同样的效果？提示：想想 `DelegatingHandler` 或中间件。前端的拦截器和后端的中间件，在执行时机上有什么关键区别？

---

## 三、统一响应格式 ApiResult

所有 API 都返回统一的 `ApiResult<T>` 格式：

```typescript
// src/types/index.ts
export interface ApiResult<T = unknown> {
  code: number        // 业务状态码，0 表示成功
  message: string     // 响应消息
  success: boolean    // 是否成功
  data?: T           // 响应数据
}
```

💡 **ASP.NET Core 类比**：这就像你定义了一个 `Result<T>` 基类，所有 Controller Action 都返回 `Result<T>` 而不是裸的 `T`。前端消费时先检查 `success`，再取 `data`。

**但有个特殊处理**：有些后端接口（如权限中心的 CRUD）返回的不是标准 `ApiResult` 格式，而是直接返回数据。`createHttp` 的响应拦截器会自动包裹：

```typescript
// 非标准响应自动包裹为 ApiResult 格式
if (data !== null && typeof data === 'object' && !('success' in data)) {
  response.data = { success: true, code: 0, message: 'ok', data } as ApiResult<unknown>
}
```

---

## 四、API 模块文件结构

> **🤔 导师提问**：观察上面的文件列表，每个 API 文件对应一个后端 Controller。在 ASP.NET Core 中，你会在 Controller 里注入 `HttpClient` 来调用服务；而前端这里，API 文件只负责"定义调用哪个 URL、传什么参数"。这种分离有什么好处？如果把 API 调用直接写在组件里，会遇到什么问题？

权限中心的 API 文件按资源维度组织：

```
src/api/perm/
├── http.ts          # HTTP 客户端实例 + 导出 get/post/put/del
├── apps.ts          # 应用管理 API
├── permissions.ts   # 权限定义 API（分组 + 定义）
├── roles.ts         # 角色管理 API
├── menus.ts         # 菜单管理 API
├── user-roles.ts    # 用户角色关联 API
├── org-units.ts     # 组织单元 API
├── companies.ts     # 公司管理 API
├── positions.ts     # 岗位管理 API
├── members.ts       # 成员档案 API
├── tenant-members.ts # 租户成员 API
└── tenants.ts       # 租户管理 API
```

**命名规律**：
- 每个 API 文件对应一个后端 Controller
- 导出一个命名对象（如 `appsApi`、`rolesApi`），而非独立函数
- 对象内的方法名 = 业务动作（`getList`、`create`、`update`、`delete`）

> **🤔 导师提问**：API 模块导出的是对象（如 `appsApi = { getList(), create(), ... }`）而不是独立函数（如 `export function getApps()`）。在 ASP.NET Core 中，你习惯用 `AppService` 类来组织方法。对比两种导出方式：对象导出 vs 独立函数导出，前者在 IDE 自动补全和依赖管理上有什么优势？

---

## 五、典型 API 模块示例

### 5.1 应用管理 API

```typescript
// src/api/perm/apps.ts
import { get, post, put, del } from "./http"
import type { AppDto, CreateAppRequest, UpdateAppRequest } from "@/types"

/** 应用管理 API，用于管理权限中心注册的应用 */
export const appsApi = {
  /** 获取所有应用列表 */
  getList() {
    return get<AppDto[]>("/api/apps")
  },

  /** 创建新应用 */
  create(data: CreateAppRequest) {
    return post<AppDto>("/api/apps", data)
  },

  /** 更新应用信息 */
  update(id: string, data: UpdateAppRequest) {
    return put<string>(`/api/apps/${id}`, data)
  },

  /** 删除应用 */
  delete(id: string) {
    return del<string>(`/api/apps/${id}`)
  },
}
```

### 5.2 角色管理 API（含权限分配）

```typescript
// src/api/perm/roles.ts
import { get, post, put } from "./http"
import type { RoleDto, CreateRoleRequest, SetRolePermissionsRequest } from "@/types"

/** 权限中心角色管理 API */
export const permRolesApi = {
  /** 获取指定应用的角色列表 */
  getList(appCode: string) {
    return get<RoleDto[]>("/api/roles", { appCode })
  },

  /** 创建角色 */
  create(data: CreateRoleRequest) {
    return post<RoleDto>("/api/roles", data)
  },

  /** 获取角色已分配的权限编码列表 */
  getPermissions(roleId: string) {
    return get<string[]>(`/api/roles/${roleId}/permissions`)
  },

  /** 设置角色的权限（全量覆盖） */
  setPermissions(roleId: string, data: SetRolePermissionsRequest) {
    return put<string>(`/api/roles/${roleId}/permissions`, data)
  },
}
```

### 5.3 用户角色关联 API

```typescript
// src/api/perm/user-roles.ts
import { get, put } from "./http"
import type { UserWithRolesDto, UserRolesDto, AssignUserRolesRequest } from "@/types"

/** 用户角色关联 API */
export const userRolesApi = {
  /** 获取指定应用下所有用户及其角色分配情况 */
  getByApp(appCode: string) {
    return get<UserWithRolesDto[]>("/api/user-roles/by-app", { appCode })
  },

  /** 获取指定用户的角色分配详情 */
  getUserRoles(userId: string) {
    return get<UserRolesDto>(`/api/user-roles/${userId}`)
  },

  /** 为用户分配角色（全量覆盖） */
  assign(data: AssignUserRolesRequest) {
    return put<string>("/api/user-roles", data)
  },
}
```

### 5.4 菜单管理 API

```typescript
// src/api/perm/menus.ts
import { get, post, put, del } from "./http"
import type {
  MenuDto, CreateMenuRequest, UpdateMenuRequest,
  MoveMenuRequest, SortMenuRequest, ToggleMenuRequest,
} from "@/types"

/** 菜单管理 API */
export const menusApi = {
  /** 获取当前用户在某应用的菜单树（权限过滤） */
  getCurrentUserMenus(appCode: string) {
    return get<MenuDto[]>("/api/menus/current", { appCode })
  },

  /** 获取应用完整菜单树（管理用） */
  getTree(appCode: string) {
    return get<MenuDto[]>("/api/menus/tree", { appCode })
  },

  /** 创建菜单 */
  create(data: CreateMenuRequest) {
    return post<MenuDto>("/api/menus", data)
  },

  /** 更新菜单 */
  update(id: string, data: UpdateMenuRequest) {
    return put<MenuDto>(`/api/menus/${id}`, data)
  },

  /** 删除菜单 */
  delete(id: string) {
    return del<string>(`/api/menus/${id}`)
  },

  /** 移动菜单到新的父节点 */
  move(id: string, data: MoveMenuRequest) {
    return post<string>(`/api/menus/${id}/move`, data)
  },

  /** 批量排序 */
  sort(data: SortMenuRequest) {
    return post<string>("/api/menus/sort", data)
  },

  /** 切换可见/启用状态 */
  toggle(id: string, data: ToggleMenuRequest) {
    return post<string>(`/api/menus/${id}/toggle`, data)
  },
}
```

---

## 六、API 调用的完整数据流

```
组件调用 appsApi.getList()
        │
        ▼
  get<AppDto[]>("/api/apps")
        │
        ▼
  axios 发送 GET /perm-api/api/apps
        │
        ▼
  Vite 代理: /perm-api/* → http://moklgy.me:10002/*
        │
        ▼
  后端 PermCenter 服务处理请求
        │
        ▼
  返回 JSON: [{ id, code, name, ... }]
        │
        ▼
  响应拦截器: 自动包裹为 ApiResult<AppDto[]>
        │
        ▼
  组件拿到 res.data = AppDto[]
```

---

## 七、请求/响应类型定义

每个 API 的请求和响应都有对应的 TypeScript 类型定义。它们集中放在 `src/types/index.ts` 中：

```typescript
// ── 应用相关 ──
export interface AppDto {
  id: string
  code: string           // 必须与 OAuth2 Client ID 一致
  name: string
  description: string | null
  logoUrl: string | null
  isEnabled: boolean
  sort: number
}

export interface CreateAppRequest {
  code: string
  name: string
  description?: string
  logoUrl?: string
  sort: number
}

export interface UpdateAppRequest {
  name: string
  description?: string
  logoUrl?: string
  isEnabled: boolean
  sort: number
}
```

⚠️ **注意命名规律**：
- `XxxDto` = 后端返回的响应数据类型
- `CreateXxxRequest` = 创建请求的类型
- `UpdateXxxRequest` = 更新请求的类型
- 请求类型中，创建时包含 `code`（唯一标识），更新时不包含（code 不可修改）

💡 **ASP.NET Core 类比**：这就像你定义了 `AppDto` 作为 Controller 的返回类型，`CreateAppRequest` 作为 `[FromBody]` 的入参类型。区别是 C# 靠命名约定，TypeScript 靠显式类型导入。

> **🤔 导师提问**：注意 `XxxDto` 和 `CreateXxxRequest` 的命名规律——Dto 是后端返回的，Request 是前端发送的。在 C# 中，你通常会用同一个类既做请求又做响应吗？为什么前后端都需要分离请求和响应的类型？想想 `code` 字段在创建时必填、更新时不能传，如果用同一个类型怎么处理？

---

## 八、错误处理模式

所有 API 调用都使用 try-catch + toast 模式：

```typescript
const fetchData = async () => {
  setLoading(true)
  try {
    const res = await appsApi.getList()
    setData(res.data ?? [])
  } catch {
    toast.error("获取应用列表失败")
  } finally {
    setLoading(false)
  }
}
```

关键模式：
1. **设置 loading 状态** → 请求前 `setLoading(true)`
2. **try-catch 包裹** → 捕获网络错误和 4xx/5xx 错误
3. **toast 提示** → 失败时显示错误提示
4. **finally 清理** → 无论成功失败都重置 loading

💡 **ASP.NET Core 类比**：这就像你在 Service 层捕获异常后记录日志。前端没有全局异常过滤器（不像 ASP.NET Core 的 `ExceptionFilter`），所以每个调用点都需要自己处理。

> **🤔 导师提问**：ASP.NET Core 有全局异常过滤器，可以统一处理 Controller 抛出的异常。前端的 `createHttp` 响应拦截器可以做类似的统一处理（如 401 跳转登录），但业务错误（如"名称已存在"）仍然需要在每个调用点处理。为什么业务错误不适合在拦截器中统一处理？想想 toast 提示的信息应该由谁决定——拦截器还是调用方？

---

## 踩坑提醒

1. **非标准响应的自动包裹**：部分后端接口直接返回数据而非标准 `ApiResult` 格式。`createHttp` 的响应拦截器会自动包裹为 `ApiResult`，但如果接口返回的 JSON 恰好包含 `success` 字段（却不是 `ApiResult` 格式），拦截器不会包裹它，可能导致组件拿到的数据结构不符合预期。调试时注意检查 `res.data` 的实际结构。
2. **请求拦截器中的 Token 过期**：`createHttp` 每次请求时从 `useAuthStore.getState()` 读取 `accessToken`。如果 Token 在页面停留期间过期，请求拦截器仍然会注入过期的 Token，后端返回 401。响应拦截器需要处理 401 自动刷新 Token 的逻辑，否则用户会看到大量错误提示。
3. **`sendTenantId` 的误用**：SSO 服务的 API 不需要租户 ID，创建 HTTP 实例时必须传 `sendTenantId: false`。如果忘了这个选项，SSO 请求会带上无关的 `X-Tenant-Id` Header，某些网关可能会拒绝请求。

---

## 🔍 验证步骤

1. 打开浏览器开发者工具（F12），切换到 Console 面板，输入 `await (await fetch('/perm-api/api/apps', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })).json()`，观察返回的 JSON 结构是否为 `ApiResult` 格式（包含 `success`、`code`、`data` 字段）
2. 在 Network 面板中刷新权限中心的任意页面，找到 `/perm-api/` 开头的请求，检查 Request Headers 中是否包含 `Authorization: Bearer xxx` 和 `X-Tenant-Id: xxx`
3. 在 Console 中尝试调用 `import('/src/api/perm/apps.ts').then(m => m.appsApi.getList())`（如果项目支持），观察返回数据的结构是否与 `AppDto[]` 类型匹配
4. 故意访问一个不存在的 API 路径（如 `/perm-api/api/not-exist`），确认 toast 错误提示正常弹出

---

## 🤔 思考题

### 概念级（理解）
1. 为什么每个微服务要创建独立的 HTTP 实例，而不是共享一个？如果共享一个实例会有什么问题？
2. `createHttp` 的 `sendTenantId` 选项什么时候需要设为 `false`？SSO 服务的 API 为什么不需要租户 ID？

### 推理级（分析）
3. 响应拦截器为什么要把非标准响应自动包裹为 `ApiResult` 格式？如果不包裹，组件里消费 API 时需要怎样处理？
4. `get` 方法的第二个参数是 `params`（查询参数），`post` 方法的第二个参数是 `data`（请求体）。为什么 GET 请求用 params 而不是 data？

### 实操级（动手）
5. 假设你要新增一个"审计日志"的 API 模块（后端路径 `/api/audit-logs`，支持分页查询），请参照现有模式写出 `src/api/perm/audit-logs.ts` 文件。
6. 如果后端新增了一个"批量导出"接口 `POST /api/apps/export`，返回的是文件流（Blob），你应该用哪个 HTTP 方法？需要怎样处理响应？

---

## 输出检查清单

| 文件 | 说明 |
|------|------|
| `02-权限API层.md` | HTTP 客户端工厂、ApiResult 统一格式、API 模块组织、请求/响应类型定义、错误处理模式 |

---

[上一节：01-RBAC模型与权限树](01-RBAC模型与权限树.md) | [下一节：03-应用管理](03-应用管理.md)
