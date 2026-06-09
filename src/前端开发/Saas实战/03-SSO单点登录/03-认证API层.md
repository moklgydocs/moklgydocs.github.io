# 认证 API 层 — 前端的 HttpClient 工厂模式

> **这一步解决什么问题？**
>
> 在 ASP.NET Core 里，我们用 `IHttpClientFactory` 创建命名 HttpClient：每个微服务一个命名的 Client，各自配置不同的 BaseAddress、超时、Handler。React 里对应的概念是 **createHttp 工厂函数** + **API 模块对象**。这一步我们实现认证 API 层的两层结构：HTTP 客户端工厂（类似 `IHttpClientFactory`）和 API 模块对象（类似 Service 类），搞清楚前端如何优雅地封装 HTTP 请求。

---

## 前置知识

| 概念 | 你需要知道的 | ASP.NET Core 类比 |
|------|------------|-----------------|
| axios 拦截器 | 请求/响应的中间件管道，自动注入 Token、处理错误 | 类似 `DelegatingHandler` 管道 |
| 工厂模式 | `createHttp()` 创建预配置的 axios 实例 | 类似 `IHttpClientFactory.CreateClient("name")` |
| Content-Type | `application/json` vs `application/x-www-form-urlencoded` | 类似 `JsonContent` vs `FormUrlEncodedContent` |
| 泛型参数 | `get<CurrentUser>(url)` 让返回值有类型提示 | 类似 `GetFromJsonAsync<CurrentUser>(url)` |
| Vite 代理 | 开发时 `/sso-api/*` 转发到后端服务 | 类似 YARP/Ocelot 反向代理 |

---

## 概念：API 模块的三层架构

AdminWeb 的 API 层分三层，每层职责单一：

```
┌─────────────────────────────────────────────────────────────────┐
│                    API 层三层架构                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  第三层：Hook / 组件                                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ useAuth() → authApi.getToken(username, password)        │    │
│  │ LoginPage → useAuth().login()                           │    │
│  │ 组件只关心"做什么"，不关心"怎么调 API"                      │    │
│  └──────────────────────────┬──────────────────────────────┘    │
│                             │ 调用                               │
│  第二层：API 模块对象                                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ authApi = {                                             │    │
│  │   getToken(username, password) → postForm(...)           │    │
│  │   getCurrentUser()           → get(...)                  │    │
│  │   getMyTenants()             → get(...)                  │    │
│  │   switchTenant(tenantId)     → postForm(...)             │    │
│  │   logout()                   → post(...)                 │    │
│  │ }                                                       │    │
│  │ 定义"调哪个 URL + 传什么参数"，不关心 HTTP 底层              │    │
│  └──────────────────────────┬──────────────────────────────┘    │
│                             │ 调用                               │
│  第一层：HTTP 客户端工厂                                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ createHttp("/sso-api", { sendTenantId: false })         │    │
│  │ → 创建 axios 实例 + 拦截器（Token 注入、401 刷新）        │    │
│  │ → 暴露 get / post / put / del / postForm 方法           │    │
│  │ 关心"HTTP 怎么发"，不关心"业务 API 是什么"                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

类比 ASP.NET Core：
- 第一层 ≈ `IHttpClientFactory` + `DelegatingHandler`（HTTP 管道）
- 第二层 ≈ `AuthService` / `PermService`（业务封装）
- 第三层 ≈ `Controller`（调用 Service 处理请求）

---

## 完整代码：认证 HTTP 客户端

以下是 AdminWeb `src/api/auth/http.ts` 的完整源码（12行）：

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

💡 只有 12 行！但这 12 行背后是 `createHttp` 的 226 行——Token 自动注入、401 自动刷新、ApiResult 自动包裹全在工厂函数里。这就是工厂模式的力量：**调用方 12 行，基础设施 226 行，但每个 API 模块都复用基础设施**。

---

## 完整代码：认证 API 模块

以下是 AdminWeb `src/api/auth/auth.ts` 的完整源码（74行）：

```typescript
import { get, post, postForm } from "./http"
import { useAuthStore } from "@/stores/auth-store"
import type { CurrentUser, UserTenantInfo } from "@/types"

/** Token 响应结构，对应 OpenID Connect 令牌端点返回值 */
interface TokenResponse {
  /** 访问令牌 */
  access_token: string
  /** 令牌类型，通常为 "Bearer" */
  token_type: string
  /** 过期时间（秒） */
  expires_in: number
  /** 刷新令牌（仅在请求 offline_access 时返回） */
  refresh_token?: string
  /** 授权范围 */
  scope: string
}

/** 认证相关 API，包含登录、登出、用户信息、租户切换等操作 */
export const authApi = {
  /** 用户登出（通过 Cookie 中的 Token） */
  logout() {
    return post("/api/account/logout")
  },

  /** 通过显式传递 Token 登出（适用于无 Cookie 场景） */
  logoutByToken() {
    return post("/api/account/logout-token")
  },

  /** 获取当前登录用户信息 */
  getCurrentUser() {
    return get<CurrentUser>("/api/account/current")
  },

  /** 获取当前用户所属的租户列表 */
  getMyTenants() {
    return get<UserTenantInfo[]>("/api/account/my-tenants")
  },

  /**
   * 切换当前用户的活动租户
   * 使用自定义授权类型 urn:custom:switch_tenant 在 /connect/token 端点签发新 Token
   * @param tenantId 目标租户 ID
   * @returns 新的 Token 响应，包含切换后租户的 access_token
   */
  switchTenant(tenantId: string) {
    const accessToken = useAuthStore.getState().accessToken ?? ""
    return postForm<TokenResponse>("/connect/token", {
      grant_type: "urn:custom:switch_tenant",
      client_id: "mok-web-app",
      subject_token: accessToken,
      tenant_id: tenantId,
      scope: "openid profile email roles api offline_access",
    })
  },

  // 密码模式获取 Token（/connect 走独立代理，不需要 sso-api 前缀）
  /**
   * 使用密码模式获取 Token（Resource Owner Password Credentials Grant）
   * @param username 用户名
   * @param password 密码
   * @returns Token 响应，包含 access_token、refresh_token 等
   */
  getToken(username: string, password: string) {
    return postForm<TokenResponse>("/connect/token", {
      grant_type: "password", // OAuth2 密码模式
      client_id: "mok-web-app", // 客户端标识
      username,
      password,
      scope: "openid profile email roles api offline_access", // 请求的权限范围
    })
  },
}
```

---

## API 目录结构对比

AdminWeb 的每个微服务 API 都遵循相同的两层结构：

```
src/api/
├── auth/              ← SSO 认证服务
│   ├── http.ts        ← 第一层：createHttp 工厂，创建 /sso-api 客户端
│   └── auth.ts        ← 第二层：authApi 对象，封装所有认证 API
│
├── perm/              ← 权限中心服务
│   ├── http.ts        ← createHttp("/perm-api")
│   └── perm.ts        ← permApi 对象
│
├── gateway/           ← API 网关管理
│   ├── http.ts        ← createHttp("/gw-api")
│   └── gateway.ts     ← gatewayApi 对象
│
├── file/              ← 文件服务
│   ├── http.ts        ← createHttp("/file-api")
│   └── file.ts        ← fileApi 对象
│
├── print/             ← 打印服务
│   ├── http.ts        ← createHttp("/print-api")
│   └── print.ts       ← printApi 对象
│
└── notify/            ← 通知中心
    ├── http.ts        ← createHttp("/notify-api")
    └── notify.ts      ← notifyApi 对象
```

💡 每个微服务的 `http.ts` 几乎一样（只改 basePrefix），但各自独立——SSO 不发租户头，文件服务需要 `responseType: "blob"`，各服务互不干扰。

类比 ASP.NET Core：就像 `Program.cs` 里为每个微服务注册命名的 HttpClient：

```csharp
builder.Services.AddHttpClient("AuthServer", c => c.BaseAddress = new Uri("http://sso:10001/"));
builder.Services.AddHttpClient("PermCenter", c => c.BaseAddress = new Uri("http://perm:10002/"));
builder.Services.AddHttpClient("Gateway", c => c.BaseAddress = new Uri("http://gw:10003/"));
// 每个命名的 Client 有自己的配置，互不干扰
```

---

## 逐行解读：10个关键点

### 1️⃣ createHttp 的 sendTenantId: false — SSO 不需要租户头

```typescript
const ssoHttp = createHttp("/sso-api", { sendTenantId: false })
```

💡 SSO 认证中心是跨租户的公共服务。用户还没选租户呢（连登录都没登录），怎么可能发送 `X-Tenant-Id`？

> **🤔 导师提问**：如果 SSO 客户端也默认发送 `X-Tenant-Id`，在登录阶段（用户还没选租户）会发生什么？SSO 服务器会怎么处理这个多余的头？

对比其他 API 模块：
```typescript
// perm/http.ts — 权限中心需要租户头
const permHttp = createHttp("/perm-api")  // sendTenantId 默认 true

// file/http.ts — 文件服务需要租户头（数据隔离）
const fileHttp = createHttp("/file-api")  // sendTenantId 默认 true
```

类比 ASP.NET Core：就像某些中间件需要 TenantId（如数据隔离过滤器），某些不需要（如认证中间件）。SSO 服务在认证阶段根本不知道租户上下文。

### 2️⃣ 解构导出 — 按需导入 HTTP 方法

```typescript
export const { get, post, put, del, postForm } = ssoHttp
export default ssoHttp.instance
```

💡 两种导出方式各有用途：

```typescript
// auth.ts 用命名导入——只需要 get、post、postForm
import { get, post, postForm } from "./http"

// 特殊场景用 default 导入——需要 axios 实例的高级功能
import ssoHttpInstance from "./http"
// 例如：ssoHttpInstance.get(url, { responseType: "blob" })
```

类比 ASP.NET Core：就像 `IHttpClientFactory.CreateClient()` 返回 `HttpClient`，你可以用它的 `GetAsync` / `PostAsync`，也可以直接访问底层 `HttpMessageHandler`。

### 3️⃣ authApi 是对象，不是类 — 函数式 vs OOP

```typescript
export const authApi = {
  getToken(username: string, password: string) { ... },
  getCurrentUser() { ... },
  getMyTenants() { ... },
  switchTenant(tenantId: string) { ... },
  logout() { ... },
  logoutByToken() { ... },
}
```

💡 AdminWeb 选择用**对象字面量**而非**类**来组织 API。原因：
1. API 模块不需要实例化——只有一个 SSO 服务，不需要 `new AuthApi(baseUrl)`
2. API 方法都是无状态的——只是调 HTTP，不需要维护实例状态
3. Tree-shaking 更友好——未使用的方法可以被打包器移除

类比 ASP.NET Core：更接近 `static class AuthService` 而非 `class AuthService : IAuthService`。后端用类是因为 DI 容器需要管理生命周期；前端不需要 DI，对象字面量更简洁。

### 4️⃣ postForm vs post — 两种 Content-Type

```typescript
// post — application/json（默认）
getCurrentUser() {
  return get<CurrentUser>("/api/account/current")
}

// postForm — application/x-www-form-urlencoded
getToken(username: string, password: string) {
  return postForm<TokenResponse>("/connect/token", {
    grant_type: "password",
    client_id: "mok-web-app",
    username,
    password,
    scope: "openid profile email roles api offline_access",
  })
}
```

💡 OAuth2 规范要求 Token 端点必须使用 `application/x-www-form-urlencoded` 格式。如果发 JSON，服务端会返回 415 Unsupported Media Type。

> **🤔 导师提问**：OAuth2 规范为什么要求 Token 端点用 form 编码而不是 JSON？提示：考虑 Web 浏览器原生 `<form>` 的提交方式和 OAuth2 的设计历史。

`postForm` 内部把对象转为 `URLSearchParams`：

```typescript
// create-http.ts 中的 postForm 实现
async postForm<T>(url: string, data: Record<string, string>): Promise<T> {
  const res = await http.post<T>(url, new URLSearchParams(data), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })
  return res.data
}
```

类比 ASP.NET Core：
```csharp
// JSON 请求
var response = await httpClient.GetAsync("/api/account/current");

// 表单请求
var content = new FormUrlEncodedContent(new Dictionary<string, string>
{
    ["grant_type"] = "password",
    ["client_id"] = "mok-web-app",
    ["username"] = username,
    ["password"] = password,
});
var response = await httpClient.PostAsync("/connect/token", content);
```

### 5️⃣ TokenResponse 接口 — OIDC 标准响应

```typescript
interface TokenResponse {
  access_token: string      // JWT 访问令牌
  token_type: string        // 固定 "Bearer"
  expires_in: number        // 有效期（秒），如 3600
  refresh_token?: string    // 刷新令牌（需要 offline_access scope）
  scope: string             // 实际授予的权限范围
}
```

💡 这是 OpenID Connect 规范定义的标准响应格式。`snake_case` 命名是因为 OIDC 规范使用 snake_case，不是前端代码风格。

⚠️ `refresh_token` 是可选的：只有请求了 `offline_access` scope 时才会返回。AdminWeb 的 scope 包含 `offline_access`，所以登录时一定会拿到 refresh_token。

类比 ASP.NET Core：就像 `TokenResponse` DTO 对应 OpenIddict 的 `OpenIddictResponse`——字段名完全一致，因为都是 OIDC 规范。

### 6️⃣ switchTenant — 自定义 Grant Type

```typescript
switchTenant(tenantId: string) {
  const accessToken = useAuthStore.getState().accessToken ?? ""
  return postForm<TokenResponse>("/connect/token", {
    grant_type: "urn:custom:switch_tenant",
    client_id: "mok-web-app",
    subject_token: accessToken,
    tenant_id: tenantId,
    scope: "openid profile email roles api offline_access",
  })
}
```

💡 这是 AdminWeb 自定义的 OAuth2 扩展：`urn:custom:switch_tenant` 不是标准 Grant Type，而是后端 OpenIddict 的自定义扩展。

工作流程：
1. 用户已有 `access_token`（当前租户的）
2. 把当前 token 作为 `subject_token` 传给 `/connect/token`
3. 后端验证当前 token 有效后，签发一个**新租户**的 token
4. 前端用新 token 替换旧 token，后续所有 API 请求就自动切换到新租户

⚠️ 注意 `useAuthStore.getState().accessToken`——这里用了 Zustand 的非 Hook 调用方式，因为 `authApi` 不是 React 组件，不能用 Hook。

类比 ASP.NET Core：就像 `SignInManager.RefreshSignInAsync()`——用当前有效的身份重新签发一个不同声明的身份。

### 7️⃣ logout vs logoutByToken — 两种登出方式

```typescript
/** 用户登出（通过 Cookie 中的 Token） */
logout() {
  return post("/api/account/logout")
},

/** 通过显式传递 Token 登出（适用于无 Cookie 场景） */
logoutByToken() {
  return post("/api/account/logout-token")
},
```

💡 为什么有两种登出？

- `logout()`：通过 Cookie 携带的 Token 登出——传统 Web 应用场景
- `logoutByToken()`：通过 Authorization 头携带的 Bearer Token 登出——SPA 场景

AdminWeb 使用 Bearer Token（不发 Cookie），所以实际调用的是 `logoutByToken()`。`logout()` 是兼容旧版 Cookie 认证保留的。

类比 ASP.NET Core：就像 `SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme)` vs `SignOutAsync(JwtBearerDefaults.AuthenticationScheme)`——两种认证方案需要不同的登出处理。

### 8️⃣ get/post 的泛型参数 — 类型安全的 API 调用

```typescript
getCurrentUser() {
  return get<CurrentUser>("/api/account/current")
}

getMyTenants() {
  return get<UserTenantInfo[]>("/api/account/my-tenants")
}
```

💡 `<CurrentUser>` 和 `<UserTenantInfo[]>` 是 TypeScript 泛型参数，告诉 `get` 方法："这个 API 返回的数据是 CurrentUser 类型"。这样调用方就能获得完整的类型提示：

```typescript
const res = await authApi.getCurrentUser()
// res 的类型是 ApiResult<CurrentUser>
// res.data 的类型是 CurrentUser
// res.data.userName → TypeScript 知道这是 string
// res.data.unknownField → TypeScript 报错：属性不存在
```

类比 ASP.NET Core：就像 `HttpClient.GetFromJsonAsync<CurrentUser>(url)`——泛型参数让反序列化结果有类型。

### 9️⃣ /connect/token 不走 sso-api 前缀

```typescript
getToken(username: string, password: string) {
  return postForm<TokenResponse>("/connect/token", { ... })
}
```

💡 `/connect/token` 是 OpenIddict 的标准端点路径。Vite 开发服务器配置了独立的代理规则：

```
/connect/* → http://moklgy.me:10001/*   （SSO 根路径代理）
/sso-api/* → http://moklgy.me:10001/*   （SSO API 代理，带 /api 前缀重写）
```

所以 `/connect/token` 和 `/sso-api/api/account/current` 最终都指向同一个 SSO 服务器，只是路径不同。

注释里写了"密码模式获取 Token（/connect 走独立代理，不需要 sso-api 前缀）"就是为了提醒维护者：**不要给 /connect/* 加 /sso-api 前缀，否则路径会变成 /sso-api/connect/token，代理匹配不到**。

### 🔟 authApi 没有错误处理 — 让调用方决定

```typescript
getToken(username: string, password: string) {
  return postForm<TokenResponse>("/connect/token", { ... })
  // 没有 try/catch，没有 toast 提示
}
```

💡 `authApi` 只负责发请求和返回数据，**不做任何错误处理**。错误处理的职责在 `useAuth` Hook：

> **🤔 导师提问**：`authApi` 不做错误处理，`useAuth` 做。如果另一个 Hook（如 `useTenantSwitch`）也调用 `authApi.switchTenant()`，它需要自己写错误处理吗？这种"API 层不处理错误"的模式有什么优缺点？

```typescript
// use-auth.ts
try {
  const tokenRes = await authApi.getToken(username, password)
  // 成功逻辑
} catch (err: unknown) {
  // 错误处理在这里——提取错误消息、toast 提示、throw 给调用方
  const msg = error.response?.data?.error_description ?? "登录失败"
  toast.error(msg)
  throw err
}
```

这种设计让同一个 API 可以被不同场景使用：
- 登录页：失败时显示 toast
- 自动刷新：失败时跳登录页（不需要 toast）
- 租户切换：失败时显示不同的错误消息

类比 ASP.NET Core：就像 Service 层抛异常，Controller 层决定怎么处理——返回 400、500 还是重定向。

---

## 五个 API 方法完整对照表

```
┌──────────────────┬──────────────────────────┬──────────────────────────────┐
│ authApi 方法      │ HTTP 请求                 │ ASP.NET Core 等价             │
├──────────────────┼──────────────────────────┼──────────────────────────────┤
│ getToken()       │ POST /connect/token      │ HttpClient.PostAsync         │
│                  │ grant_type=password       │ + FormUrlEncodedContent      │
│                  │ Content-Type: x-www-form  │                              │
├──────────────────┼──────────────────────────┼──────────────────────────────┤
│ getCurrentUser() │ GET /api/account/current │ HttpClient.GetAsync          │
│                  │ Authorization: Bearer xxx │ + 受 [Authorize] 保护        │
├──────────────────┼──────────────────────────┼──────────────────────────────┤
│ getMyTenants()   │ GET /api/account/         │ HttpClient.GetAsync          │
│                  │     my-tenants            │ + 受 [Authorize] 保护        │
├──────────────────┼──────────────────────────┼──────────────────────────────┤
│ switchTenant()   │ POST /connect/token      │ HttpClient.PostAsync         │
│                  │ grant_type=              │ + 自定义 GrantType            │
│                  │   urn:custom:switch_tenant│                              │
│                  │ subject_token=xxx         │                              │
├──────────────────┼──────────────────────────┼──────────────────────────────┤
│ logout()         │ POST /api/account/logout │ SignOutAsync()               │
│ logoutByToken()  │ POST /api/account/       │ SignOutAsync()               │
│                  │       logout-token        │ + Bearer 认证                │
└──────────────────┴──────────────────────────┴──────────────────────────────┘
```

---

## Vite 代理配置：前端如何与多个微服务通信

AdminWeb 的 5 个微服务运行在不同端口。开发时，Vite 的 `server.proxy` 把前端请求转发到对应的后端：

```typescript
// vite.config.ts（简化）
export default defineConfig({
  server: {
    proxy: {
      // SSO 认证服务 — 端口 10001
      "/sso-api": {
        target: "http://moklgy.me:10001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sso-api/, ""),
      },
      // OIDC 端点（/connect/*）也指向 10001
      "/connect": {
        target: "http://moklgy.me:10001",
        changeOrigin: true,
      },

      // 权限中心 — 端口 10002
      "/perm-api": {
        target: "http://moklgy.me:10002",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/perm-api/, ""),
      },

      // API 网关管理 — 端口 10003
      "/gw-api": {
        target: "http://moklgy.me:10003",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gw-api/, ""),
      },

      // 文件服务 — 端口 10004
      "/file-api": {
        target: "http://moklgy.me:10004",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/file-api/, ""),
      },

      // 打印服务 — 端口 10005
      "/print-api": {
        target: "http://moklgy.me:10005",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/print-api/, ""),
      },
    },
  },
})
```

请求流转：

```
浏览器                          Vite Dev Server                     后端微服务
  │                                │                                  │
  │ GET /sso-api/api/account/current                                 │
  │ ───────────────────────────→   │                                  │
  │                                │ rewrite: /sso-api → ""           │
  │                                │ GET /api/account/current         │
  │                                │ ──────────────────────────────→  │ 10001
  │                                │ ← 200 { data }                  │
  │ ← 200 { data }                │                                  │
  │                                │                                  │
  │ GET /perm-api/api/apps                                            │
  │ ───────────────────────────→   │                                  │
  │                                │ rewrite: /perm-api → ""         │
  │                                │ GET /api/apps                    │
  │                                │ ──────────────────────────────→  │ 10002
  │                                │ ← 200 { data }                  │
  │ ← 200 { data }                │                                  │
```

类比 ASP.NET Core：就像 YARP/Ocelot 反向代理——前端发 `/sso-api/*`，代理根据前缀转发到不同的后端服务。生产环境中，这个代理角色由 Nginx/YARP 承担。

---

## 验证步骤

1. 打开 `src/api/perm/http.ts` 和 `src/api/file/http.ts`，对比它们和 `src/api/auth/http.ts` 的差异。确认 `sendTenantId` 的值不同
2. 在浏览器中执行登录，打开 DevTools → Application → Local Storage，查看 `admin-auth` 的值
3. 找到 `accessToken`，粘贴到 jwt.io 解码，观察 payload 中的 `sub`、`role`、`tenant_id` 等字段
4. 对比 JWT claims 和 `authApi.getCurrentUser()` 返回的数据——哪些字段只在 JWT 中，哪些只在 API 返回中？

---

## 踩坑提醒

1. **`/connect/token` 不走 `/sso-api` 前缀**：OIDC 端点走独立代理规则，加 `/sso-api` 前缀会导致路径变成 `/sso-api/connect/token`，代理匹配不到
2. **OAuth2 端点必须用 `postForm` 而非 `post`**：OAuth2 规范要求 `application/x-www-form-urlencoded` 格式，发 JSON 会返回 415 错误
3. **`switchTenant` 用 `useAuthStore.getState()` 读取 Token**：因为 `authApi` 不是 React 组件，不能用 Hook 形式的 `useAuthStore()`
4. **`postForm` 返回原始数据，`get/post` 返回 `ApiResult<T>`**：调用方需要用不同的方式访问返回数据，`postForm` 直接 `res.access_token`，`get` 需要 `res.data.xxx`

---

## 自测题

**概念级**：`authApi` 用对象字面量组织，而 `useAuth` 用自定义 Hook 组织。它们各适合什么场景？如果 `authApi` 也改成 Hook（`useAuthApi()`），会有什么问题？

**推理级**：`switchTenant` 方法里用了 `useAuthStore.getState().accessToken`，而 `getToken` 方法不需要从 store 读任何东西。为什么切换租户需要当前 Token，而登录不需要？

**动手级**：打开 `src/api/perm/http.ts` 和 `src/api/file/http.ts`，对比它们和 `src/api/auth/http.ts` 的差异。确认 `sendTenantId` 的值不同，思考为什么。

---

## 输出检查清单

读完本节，我们应该能回答：

- [ ] `createHttp` 的 `sendTenantId` 参数作用是什么？SSO 客户端为什么设为 `false`？
- [ ] `postForm` 和 `post` 的 Content-Type 有什么区别？OAuth2 端点为什么必须用 `postForm`？
- [ ] `authApi` 为什么用对象字面量而不是类？
- [ ] `switchTenant` 的自定义 Grant Type `urn:custom:switch_tenant` 的工作流程是什么？
- [ ] `authApi` 不做错误处理，错误处理的职责在哪里？这种设计有什么好处？
- [ ] Vite 代理中 `/connect` 和 `/sso-api` 的路由策略有什么不同？

---

[← 上一篇](02-登录页面.md) | [下一篇 →](04-useAuth-Hook.md)
