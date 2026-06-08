# OAuth2 与 JWT 基础

> **这一步解决什么问题？**
>
> SaaS 系统必须有统一的身份认证——用户登录一次，所有子系统都信任。SSO（单点登录）就是这个信任链条的起点。这一步我们理解 AdminWeb 选择的 OAuth2 密码模式和 JWT 令牌格式，搞清楚"用户输入密码后，前端拿到了什么、怎么用"。这类似 ASP.NET Core 中 Identity Server 的认证流程，但前端需要手动管理 Token 而非依赖浏览器 Cookie。

---

## OAuth2 Resource Owner Password Credentials 流程

OAuth2 定义了多种授权方式（Grant Type），AdminWeb 使用的是 **Resource Owner Password Credentials**（资源所有者密码凭证模式，简称密码模式）：

```
┌──────────┐                         ┌──────────────┐
│  用户     │  1. 输入用户名/密码      │              │
│  (浏览器) │ ───────────────────────→ │  前端应用     │
│          │                         │  (AdminWeb)  │
│          │                         │              │
│          │                         │  2. POST /connect/token  ┌──────────┐
│          │                         │  grant_type=password    │  SSO 服务器│
│          │                         │ ──────────────────────→ │ (OpenIddict)│
│          │                         │                         │          │
│          │                         │  3. 返回 access_token   │          │
│          │                         │     + refresh_token     │          │
│          │                         │ ←────────────────────── │          │
│          │  4. 登录成功，进入首页    │                         └──────────┘
│          │ ←─────────────────────── │
└──────────┘                         └──────────────┘
```

密码模式的特点：

| 特性 | 说明 |
|------|------|
| 适用场景 | 第一方应用（前端和后端同属一个组织） |
| 用户参与 | 用户直接在前端输入用户名和密码 |
| Token 获取 | 前端直接调用 `/connect/token`，无需跳转授权页 |
| 安全等级 | 中等（前端会接触到密码，但不存储） |
| 对比授权码模式 | 授权码模式更安全（密码不经过前端），但需要跳转，体验较差 |

> **为什么不选授权码模式？** AdminWeb 是内部管理后台，用户信任度高，密码模式简化了登录流程。如果是面向公众的应用，应优先选择 Authorization Code + PKCE。

> **🤔 导师提问**：继续阅读之前想一想：如果你来设计这个流程，你会把密码放在前端请求中吗？这会带来什么安全隐患？

> **后端类比**：如果你用过 ASP.NET Core Identity 的 Cookie 认证，密码模式就是把"浏览器自动发 Cookie"换成了"前端手动发 Bearer Token"。本质上都是用凭证换取认证标识，只是传输方式不同。

### 【设计取舍】ROPC vs Authorization Code + PKCE

| 维度 | ROPC（密码模式） | Authorization Code + PKCE |
|------|-----------------|--------------------------|
| 用户体验 | 直接输入密码，无跳转 | 需跳转到 SSO 授权页 |
| 密码暴露 | 前端代码能接触到明文密码 | 前端永远看不到密码 |
| 实现复杂度 | 简单（一个 POST 请求） | 复杂（授权码交换 + PKCE 挑战） |
| 适用场景 | 第一方内部应用 | 公开客户端、第三方应用 |
| OAuth2.1 兼容 | ⚠ OAuth2.1 已废弃 ROPC | ✅ OAuth2.1 推荐方式 |

**为什么 AdminWeb 选 ROPC？** 内部管理后台、前后端同属一个组织、用户信任度高——ROPC 的简单性收益远大于安全性风险。如果要升级到 Authorization Code + PKCE，主要改动在 SSO 服务器端增加授权页，前端改为跳转方式。

---

## JWT Token 结构

JWT（JSON Web Token）由三段 Base64Url 编码的字符串组成，用 `.` 分隔：

```
eyJhbGciOiJSUzI1NiIs.eyJzdWIiOiIxMjM0NTY3ODkwIi. SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV

│      Header       │.│      Payload      │.│    Signature    │
│  算法和令牌类型    │ │  用户信息和声明    │ │  防篡改签名      │
```

**Header**（头部）：声明签名算法

```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

**Payload**（载荷）：存储用户声明（Claims），AdminWeb 的 JWT 包含：

```json
{
  "sub": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "张三",
  "email": "zhangsan@example.com",
  "role": ["admin", "user-manager"],
  "tenant_id": "1",
  "tenant_name": "默认租户",
  "tenant_identifier": "default",
  "primary_company_id": "10",
  "primary_company_name": "总公司",
  "primary_org_unit_id": "100",
  "primary_org_unit_name": "技术部",
  "primary_position_id": "1000",
  "primary_position_name": "高级工程师",
  "employee_no": "EMP001",
  "iss": "mok-sso",
  "aud": "mok-web-app",
  "exp": 1717891200,
  "iat": 1717804800
}
```

> **关键理解**：JWT 的 Payload 是 Base64 编码，**不是加密**。任何人都能解码查看内容，所以绝对不能在 JWT 中存储密码等敏感信息。JWT 的安全性依赖于 Signature 防篡改，而非 Payload 的保密性。

> **🤔 导师提问**：为什么 SSO 服务器要把组织/租户信息放进 JWT，而不是让前端再调一个 API 去获取？这样做有什么权衡？

> **后端类比**：JWT 类似一个签名的 `ClaimsPrincipal`。ASP.NET Core 的 `[Authorize]` 中间件验证 JWT 签名后，将 Payload 的 claims 注入到 `HttpContext.User` 中。

### 【易错点】JWT 是 Base64Url 编码，不是加密

很多初学者看到 JWT 中的 `eyJ...` 以为是加密后的密文——其实这只是 Base64Url 编码，任何人都能用 `atob()` 解码。JWT 的安全保障来自 Signature（签名防篡改），而非 Payload 的保密性。

```
┌─────────────────────────────────────────────────────────────┐
│              Base64 vs Base64Url 对比                        │
├──────────────┬──────────────────┬───────────────────────────┤
│     维度      │     Base64       │       Base64Url           │
├──────────────┼──────────────────┼───────────────────────────┤
│ 字符 62      │ +                │ - (减号)                   │
│ 字符 63      │ /                │ _ (下划线)                  │
│ 填充         │ = (可能1-2个)     │ 通常省略                    │
│ URL 安全     │ ❌ +/ 需编码      │ ✅ 直接用在 URL/Header 中   │
│ 使用场景     │ 通用二进制编码     │ JWT、文件名、URL 参数        │
└──────────────┴──────────────────┴───────────────────────────┘

前端解码 JWT 的关键步骤：
  base64url 字符串
    .replace(/-/g, '+')    // - → +
    .replace(/_/g, '/')    // _ → /
  然后用 atob() 解码

这就是为什么 parseJwtPayload() 中有两行 replace！
```

### JWT 标准字段说明

| 字段 | 全称 | 说明 |
|------|------|------|
| `sub` | Subject | 用户唯一标识（用户 ID） |
| `iss` | Issuer | 签发者（`mok-sso`） |
| `aud` | Audience | 接收者（`mok-web-app`） |
| `exp` | Expiration | 过期时间（Unix 时间戳） |
| `iat` | Issued At | 签发时间（Unix 时间戳） |
| `role` | Role | 用户角色列表 |

### 【性能陷阱】JWT 体积对请求的影响

AdminWeb 的 JWT 包含大量组织信息（租户、公司、部门、岗位等），这会让 Token 体积膨胀：

```
一个典型的 AdminWeb JWT：
  Header:    ~50 bytes
  Payload:   ~500-800 bytes（含组织 claims）
  Signature: ~256 bytes（RS256）
  ─────────────────────
  总计:      ~800-1100 bytes

每次 API 请求都要在 Authorization Header 中携带：
  Authorization: Bearer eyJ...（约 1KB）

如果页面加载时并发 10 个 API 请求，仅 Token 就占了 ~10KB 的请求头。
```

**影响**：HTTP/1.1 下请求头过大会影响性能（默认 8KB 限制）；HTTP/2 下有 HPACK 压缩，影响较小。如果 JWT 体积超过 1KB，可以考虑把部分 claims 移到 API 获取。

> **🤔 导师提问**：打开浏览器 DevTools 的 Network 面板，找任意一个 API 请求，检查 Authorization 请求头的大小——它占了多少字节？

---

## Token 生命周期

access_token 有效期短（通常 1-2 小时），refresh_token 有效期长（通常 7-30 天）。当 access_token 过期时，用 refresh_token 换取新的 token 对：

```
access_token 过期 → 前端请求 API → 返回 401
  → 用 refresh_token 调用 /connect/token
  ├─ 成功 → 获得新 token 对 → 重发原请求
  └─ 失败 → refresh_token 也过期 → 跳转登录页
```

| | access_token | refresh_token |
|---|---|---|
| 用途 | 访问 API 的凭证 | 换取新 access_token |
| 有效期 | 短（1-2 小时） | 长（7-30 天） |
| 使用频率 | 每次请求 | 仅在过期时 |
| 泄露风险 | 高 | 低 |

### 【易错点】refresh_token 只能用一次？

OAuth2 规范建议 refresh_token 使用一次后失效（Rotation），签发新 access_token 的同时也会签发新 refresh_token。但并非所有 SSO 服务器都实现了 Rotation。AdminWeb 的 OpenIddict 配置决定了 refresh_token 是否支持 Rotation——如果启用，前端每次刷新后必须保存新的 refresh_token，否则旧的会失效。

### Token 刷新的请求格式

```
POST /connect/token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&client_id=mok-web-app
&refresh_token=eyJhbGciOiJSUzI1NiIs...
```

注意刷新请求也走 `/connect/token` 端点，只是 `grant_type` 从 `password` 变成了 `refresh_token`。同一个端点，不同的授权类型。

> **后端类比**：类似 ASP.NET Identity 的"滑动过期"策略。access_token 相当于 Session Cookie，refresh_token 相当于 Remember Me Cookie。

### 密码模式请求的实际格式

```
POST /connect/token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=password
&client_id=mok-web-app
&username=admin
&password=P@ssw0rd
&scope=openid profile email roles api offline_access
```

注意几个关键点：
- **Content-Type 是 `application/x-www-form-urlencoded`**，不是 JSON。这是 OAuth2 规范要求的格式
- **`scope` 包含 `offline_access`**：这是获取 refresh_token 的前提条件。没有 `offline_access`，SSO 服务器只返回 access_token
- **`client_id` 是 `mok-web-app`**：公开客户端（Public Client），不需要 `client_secret`

> **后端类比**：类似 ASP.NET Core 中 `SignInManager.PasswordSignInAsync()` 的底层调用——把用户名密码传给认证中间件，换取认证 Cookie。这里只是把 Cookie 换成了 Token。

### 【易错点】OAuth2 错误响应不是 ApiResult 格式

AdminWeb 的业务 API 统一返回 `ApiResult<T>` 格式（`{ success, code, message, data }`），但 OAuth2 端点的错误响应遵循 **RFC 6749** 标准：

```json
// OAuth2 错误响应（不是 ApiResult！）
{
  "error": "invalid_grant",
  "error_description": "用户名或密码错误"
}
```

这就是为什么 `useAuth` 的错误处理要特殊提取 `error_description`，而不是读取 `message` 字段。

> **后端类比**：类似 ASP.NET Core Identity 返回的 `IdentityResult.Errors` 和自定义 API 错误格式不同——一个是框架标准格式，一个是业务自定义格式。

---

## 多租户选择

SaaS 系统的核心特征是**多租户隔离**。一个用户可能属于多个租户：

```
用户 "张三"
  ├── 租户A（科技公司） → 只能看到租户A的数据
  ├── 租户B（贸易公司） → 只能看到租户B的数据
  └── 租户C（咨询公司） → 只能看到租户C的数据
```

登录后必须确定当前操作的租户上下文，后续所有 API 请求都会带上 `X-Tenant-Id` 请求头。

> **后端类比**：多租户在 ASP.NET Core 中通常是每个请求带 `TenantId`，中间件根据 `TenantId` 切换数据库连接或查询条件。

---

## 自定义 Grant Type：switch_tenant

AdminWeb 的 SSO 服务器（基于 OpenIddict）扩展了一个自定义授权类型 `urn:custom:switch_tenant`，用于在已登录状态下切换租户上下文：

```
┌──────────┐                                    ┌──────────────┐
│  前端     │  POST /connect/token              │  SSO 服务器    │
│          │  grant_type=urn:custom:switch_tenant│              │
│          │  subject_token=当前access_token     │              │
│          │  tenant_id=目标租户ID               │              │
│          │ ──────────────────────────────────→ │              │
│          │                                    │  验证 subject_token           │
│          │                                    │  签发新 token（含新租户 claims）│
│          │  返回 新的 access_token + refresh_token            │
│          │ ←────────────────────────────────── │              │
└──────────┘                                    └──────────────┘
```

**为什么不用重新登录？** 用户已经通过了身份认证，切换租户只是改变"组织上下文"，不需要重新输入密码。SSO 服务器验证旧 token 有效后，用新租户的 claims 签发新 token。

**对应的 API 调用**（来自 `src/api/auth/auth.ts`）：

```typescript
interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope: string
}

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

> **后端类比**：类似 ASP.NET Core 中的 Impersonation——用一个已认证身份换取另一个身份的上下文。但 AdminWeb 的实现更轻量，不需要重新认证，SSO 服务器只替换 JWT 中的租户 claims。

> **🤔 导师提问**：如果 SSO 服务器不支持自定义 Grant Type，你会怎么实现租户切换？如果只在前端本地改一个 tenantId 变量，会有什么安全风险？

### 【易错点】switch_tenant 不是标准 OAuth2 Grant Type

`urn:custom:switch_tenant` 是自定义扩展，不是 OAuth2 标准定义的授权类型。标准类型有 `password`、`authorization_code`、`refresh_token` 等。自定义 Grant Type 需要 SSO 服务器支持——OpenIddict 允许注册自定义 Handler 来处理非标准 grant_type。

---

## Vite 代理配置：/connect 与 /sso-api

AdminWeb 的 SSO 相关请求走两个代理路径：

```
浏览器 (localhost:3000)
  │
  ├── /connect/* ──────────→ http://moklgy.me:10001/connect/*
  │   (OIDC 端点：/connect/token, /connect/authorize 等)
  │   ⚠ 不 rewrite！路径原样转发
  │
  └── /sso-api/* ─────────→ http://moklgy.me:10001/*
      (SSO 业务 API：/api/account/*)
      ⚠ rewrite：去掉 /sso-api 前缀
```

**Vite 配置**（来自 `vite.config.ts`）：

```typescript
server: {
  port: 3000,
  proxy: {
    "/sso-api": {
      target: "http://moklgy.me:10001",
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/sso-api/, ""),  // /sso-api/api/account/current → /api/account/current
    },
    "/connect": {
      target: "http://moklgy.me:10001",
      changeOrigin: true,
      // 不 rewrite！/connect/token → /connect/token
    },
    "/.well-known": {
      target: "http://moklgy.me:10001",
      changeOrigin: true,
    },
  },
}
```

### 为什么 /connect 不 rewrite 而 /sso-api 要 rewrite？

| 路径 | 是否 rewrite | 原因 |
|------|-------------|------|
| `/connect/*` | ❌ 不 rewrite | OIDC 标准端点，SSO 服务器期望收到 `/connect/token` |
| `/sso-api/*` | ✅ rewrite | `/sso-api` 是前端为了区分后端服务而加的前缀，SSO 服务器不知道这个前缀 |
| `/.well-known/*` | ❌ 不 rewrite | OIDC 发现端点，标准路径 |

**请求路径流转示例**：

```
前端代码                         浏览器实际请求                    SSO 服务器收到
──────────                      ──────────────                   ──────────────
postForm("/connect/token",...)  → POST /connect/token           → POST /connect/token        ✅
get("/api/account/current")     → GET  /sso-api/api/account/... → GET  /api/account/current  ✅
```

### 【易错点】前端代码中 /connect 路径不加 /sso-api 前缀

> **🤔 导师提问**：为什么 `/connect` 不加 `/sso-api` 前缀，而 `/api/account/*` 要加？分别追踪这两个请求从浏览器到 SSO 服务器的完整路径。

注意 `authApi.getToken()` 和 `authApi.switchTenant()` 都直接调用 `/connect/token`，不加 `/sso-api` 前缀。而 `getCurrentUser()` 和 `getMyTenants()` 通过 `ssoHttp` 客户端，自动加 `/sso-api` 前缀。

```typescript
// src/api/auth/http.ts
const ssoHttp = createHttp("/sso-api", { sendTenantId: false })
//                           ^^^^^^^^ 所有请求自动加 /sso-api 前缀

// 但 /connect/token 走裸 axios（不经过 ssoHttp），因为 OIDC 端点不共享 /sso-api 路径
```

---

> **🔍 验证步骤**
>
> 1. 打开浏览器 DevTools → Network，访问 `http://localhost:3000`
> 2. 在登录页输入用户名密码并登录，在 Network 中找到 `/connect/token` 请求
> 3. 检查 Request Payload：应包含 `grant_type=password`、`client_id=mok-web-app`
> 4. 检查 Response：应包含 `access_token`（JWT 格式）和 `refresh_token`
> 5. 复制 `access_token` 的值，粘贴到 `jwt.io` 或在 Console 中执行 `JSON.parse(atob(token.split('.')[1]))`，确认 payload 包含 `sub`、`role`、`tenant_id` 等 claims

## 🤔 思考题

**Level 1（概念级）**：JWT 的 Payload 使用 Base64Url 编码而非加密，这意味着什么？我们能否在 JWT 中安全地存储用户密码？

**Level 2（推理级）**：AdminWeb 选择 ROPC 而非 Authorization Code + PKCE。如果未来要将 AdminWeb 开放给第三方应用使用，认证方式需要怎样调整？`switch_tenant` 这个自定义 Grant Type 是否还能继续使用？

**Level 3（动手级）**：在浏览器控制台中，用 `atob()` 手动解码一个 JWT Token 的 Payload 部分。验证 JWT 中的 `tenant_id` 和 `exp` 字段。思考：为什么 JWT 使用 Base64Url 而不是普通 Base64？

---

## ✅ 输出检查清单

读完本节，我们应该能回答：

- [ ] AdminWeb 为什么选择 ROPC 而非 Authorization Code + PKCE？
- [ ] JWT 的 Payload 是加密的吗？为什么不能在 JWT 中存敏感信息？
- [ ] Base64Url 和 Base64 有什么区别？前端解码 JWT 时为什么要先 replace？
- [ ] JWT 体积过大对性能有什么影响？
- [ ] `switch_tenant` 自定义 Grant Type 的工作原理是什么？
- [ ] Vite 代理中 `/connect` 和 `/sso-api` 的 rewrite 策略有什么不同？为什么？
- [ ] OAuth2 端点的错误响应格式和业务 API 的 `ApiResult` 格式有什么区别？前端如何分别处理？
- [ ] `offline_access` scope 在获取 Token 时起什么作用？

---

[← 上一篇](../02-项目架构与工程化/07-类型定义体系.md) | [下一篇 →](./02-登录页面.md)
