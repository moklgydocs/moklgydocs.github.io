# useAuth Hook

> **这一步解决什么问题？**
>
> 用户输入用户名密码后，前端需要完成一系列步骤：获取 Token → 解析 JWT → 加载用户信息 → 获取租户列表 → 决定跳转目标。`useAuth` Hook 就是这整个流程的编排者。它把分散的 API 调用和状态管理统一到一个 Hook 中，任何组件只需 `const { login, logout, user } = useAuth()` 即可。这类似 ASP.NET Core 中 `SignInManager` 封装了密码验证、Cookie 签发、重定向等步骤。

---

## 登录流程的核心

`useAuth` 是整个 SSO 登录最核心的代码，封装了完整的登录/登出/租户切换逻辑。

```typescript
// src/hooks/use-auth.ts
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/auth-store"
import { authApi } from "@/api/auth/auth"
import { toast } from "sonner"
import type { CurrentUser } from "@/types"

/**
 * 认证 Hook，提供登录/登出及用户状态管理。
 * 封装了 token 获取、用户信息加载、租户选择等完整登录流程。
 */
export function useAuth() {
  const navigate = useNavigate()
  const {
    user, isAuthenticated,
    setTokens, setUser, setCurrentTenant, setAvailableTenants,
    logout: clearAuth,
  } = useAuthStore()

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        // ── 第一步：获取 access_token 和 refresh_token ──
        const tokenRes = await authApi.getToken(username, password)
        setTokens(tokenRes.access_token, tokenRes.refresh_token)

        // 从 JWT 解析组织 claims
        const payload = parseJwtPayload(tokenRes.access_token)

        // ── 第二步：获取用户详情，并合并 JWT 中的组织信息 ──
        try {
          const userRes = await authApi.getCurrentUser()
          if (userRes.success && userRes.data) {
            setUser({
              ...userRes.data,
              tenantId: payload?.tenant_id ? String(payload.tenant_id) : undefined,
              tenantName: payload?.tenant_name ? String(payload.tenant_name) : undefined,
              tenantIdentifier: payload?.tenant_identifier ? String(payload.tenant_identifier) : undefined,
              primaryCompanyId: payload?.primary_company_id ? String(payload.primary_company_id) : undefined,
              primaryCompanyName: payload?.primary_company_name ? String(payload.primary_company_name) : undefined,
              primaryCompanyCode: payload?.primary_company_code ? String(payload.primary_company_code) : undefined,
              primaryOrgUnitId: payload?.primary_org_unit_id ? String(payload.primary_org_unit_id) : undefined,
              primaryOrgUnitName: payload?.primary_org_unit_name ? String(payload.primary_org_unit_name) : undefined,
              primaryPositionId: payload?.primary_position_id ? String(payload.primary_position_id) : undefined,
              primaryPositionName: payload?.primary_position_name ? String(payload.primary_position_name) : undefined,
              primaryPositionCode: payload?.primary_position_code ? String(payload.primary_position_code) : undefined,
              employeeNo: payload?.employee_no ? String(payload.employee_no) : undefined,
            })
          }
        } catch {
          // 获取用户详情失败，降级从 JWT payload 构建
          if (payload) {
            setUser(buildUserFromPayload(payload, username))
          }
        }

        // ── 第三步：获取用户可用租户列表，决定跳转目标 ──
        try {
          const tenantsRes = await authApi.getMyTenants()
          const tenants = tenantsRes.success ? (tenantsRes.data ?? []) : []
          setAvailableTenants(tenants)

          if (tenants.length === 0) {
            toast.success("登录成功")
            navigate("/")
          } else if (tenants.length === 1) {
            const t = tenants[0]
            setCurrentTenant(t.tenantId, t.tenantName)
            toast.success("登录成功")
            navigate("/")
          } else {
            toast.success("登录成功，请选择租户")
            navigate("/select-tenant")
          }
        } catch {
          toast.success("登录成功")
          navigate("/")
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { error_description?: string }; status?: number } }
        const msg =
          error.response?.data?.error_description ??
          (error.response?.status === 400 ? "用户名或密码错误" : "登录失败，请检查网络")
        toast.error(msg)
        throw err
      }
    },
    [navigate, setTokens, setUser, setCurrentTenant, setAvailableTenants]
  )

  const logout = useCallback(() => {
    clearAuth()
    navigate("/login")
    toast.success("已退出登录")
    authApi.logoutByToken().catch(() => {})
  }, [clearAuth, navigate])

  return { user, isAuthenticated, login, logout }
}
```

> **🤔 导师提问**：JWT 解析（第2步）是纯前端操作，不涉及网络请求。为什么不在登录时跳过 JWT 解析，只依赖 API 返回的用户信息？如果跳过 JWT 解析，会丢失什么？

### 【易错点】useCallback 的依赖数组

`login` 的 `useCallback` 依赖了 `[navigate, setTokens, setUser, setCurrentTenant, setAvailableTenants]`。如果遗漏任何一个：

- 遗漏 `navigate`：登录成功后跳转可能用旧的导航实例
- 遗漏 `setTokens` 等：Zustand store 方法本身是稳定的（不会变），但 ESLint 规则要求全部列出

> 实际上 Zustand store 的 action 方法引用是稳定的（不会重新创建），所以即使依赖数组不完整，运行时也不会出 bug。但遵循 exhaustive-deps 规则是好习惯。

---

## useAuthStore 的结构

`useAuth` 内部使用 `useAuthStore`（Zustand store），它管理所有认证相关的状态：

```typescript
// src/stores/auth-store.ts
interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: CurrentUser | null
  isAuthenticated: boolean
  currentTenantId: string | null
  currentTenantName: string | null
  availableTenants: UserTenantInfo[] | null

  setTokens: (accessToken: string, refreshToken?: string) => void
  setUser: (user: CurrentUser | null) => void
  setCurrentTenant: (tenantId: string, tenantName: string) => void
  setAvailableTenants: (tenants: UserTenantInfo[]) => void
  logout: () => void
}
```

### 状态之间的依赖关系

```
setTokens(accessToken, refreshToken)
  → isAuthenticated = true        ← Token 存在即认证

setUser(currentUser)
  → user = { ...API, ...JWT }     ← API + JWT 合并

setCurrentTenant(tenantId, tenantName)
  → currentTenantId = tenantId    ← 决定 X-Tenant-Id 请求头

setAvailableTenants(tenants)
  → availableTenants = [...]      ← 决定是否跳转选择页

logout()
  → 全部清空                      ← isAuthenticated = false
```

### Zustand persist：状态持久化到 localStorage

```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({ /* ... */ }),
    { name: "admin-auth" }  // localStorage key
  )
)
```

`persist` 中间件将 store 状态自动同步到 `localStorage`，key 为 `"admin-auth"`。这意味着：

- **页面刷新后状态不丢失**：`accessToken`、`user`、`currentTenantId` 等从 localStorage 恢复
- **多 Tab 共享**：同一个浏览器多个 Tab 共享认证状态
- **logout 清除 localStorage**：`logout()` 重置所有状态，persist 中间件自动清除对应 key

> **🤔 导师提问**：用户开了两个浏览器 Tab，在其中一个 Tab 点击了登出。另一个 Tab 会立即反映登出状态吗？为什么？

> **后端类比**：类似 ASP.NET Core 中 Cookie 认证的持久化——认证 Cookie 存在浏览器中，刷新页面不需要重新登录。localStorage 就是前端的"Cookie 罐"。

### 【设计取舍】useAuth 中从 store 解构 vs 直接用 store

```typescript
// 当前写法：从 useAuthStore() 解构
const { user, isAuthenticated, setTokens, ... } = useAuthStore()

// 另一种写法：按需选择器
const user = useAuthStore((s) => s.user)
const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
```

当前写法更简洁，但有一个潜在问题：**任何一个 store 字段变化，`useAuth` 所在组件都会重新渲染**。因为 `useAuthStore()` 订阅了整个 store。如果未来 `useAuth` 被用在很多组件中，且 store 更新频繁，可能需要改为按需选择器。

> **🤔 导师提问**：`useAuthStore.getState()` 在 React 组件内调用时不会触发重新渲染——那什么时候应该用 `getState()` 而不是 Hook 形式？

但目前 AdminWeb 的 store 更新频率很低（只在登录/登出/切换租户时），所以当前写法没有性能问题。

---

## 登录流程全景（5 步时序图）

```
  用户点击"登录"
       │
       ▼
  ┌──────────────────────────────────────────────────────────────┐
  │ 1. authApi.getToken(username, password)                      │
  │    POST /connect/token  grant_type=password                  │
  │    → 获得 access_token + refresh_token                       │
  │    ⏱ 约 200-500ms                                            │
  ├──────────────────────────────────────────────────────────────┤
  │ 2. parseJwtPayload(access_token)                             │
  │    纯前端解析，无网络请求                                       │
  │    → 提取 tenant_id, primary_company_id 等组织 claims          │
  │    ⏱ < 1ms                                                   │
  ├──────────────────────────────────────────────────────────────┤
  │ 3. authApi.getCurrentUser()                                  │
  │    GET /sso-api/api/account/current                          │
  │    → 获取用户名、邮箱、角色等基本资料                             │
  │    → 与 JWT claims 合并为完整 CurrentUser                      │
  │    ⏱ 约 100-300ms                                            │
  ├──────────────────────────────────────────────────────────────┤
  │ 4. authApi.getMyTenants()                                    │
  │    GET /sso-api/api/account/my-tenants                       │
  │    → 获取用户关联的租户列表                                      │
  │    ⏱ 约 100-200ms                                            │
  ├──────────────────────────────────────────────────────────────┤
  │ 5. 根据租户数量决定跳转目标：                                    │
  │    0 个 → 平台管理员，直接进首页 navigate("/")                  │
  │    1 个 → 自动选中，直接进首页 navigate("/")                    │
  │    2+ 个 → 跳转租户选择页 navigate("/select-tenant")           │
  └──────────────────────────────────────────────────────────────┘
       │
       ▼
  总耗时约 400-1000ms（3 个串行网络请求）
```

> **后端类比**：类似 `SignInManager.PasswordSignInAsync()` → `HttpContext.SignInAsync()` → 重定向。只是前端涉及更多步骤（JWT 解析、租户选择）。

> **🤔 导师提问**：如果用户快速连续点了两次登录按钮，两个 `login()` 调用会同时执行——这会引发什么竞态条件？

### 【性能陷阱】三个串行网络请求

登录流程中有 3 个串行网络请求（getToken → getCurrentUser → getMyTenants）。能否并行？**不能**——因为每个请求都依赖前一个的结果：

- `getCurrentUser` 需要 `getToken` 返回的 access_token 作为 Authorization Header
- `getMyTenants` 也需要 access_token

但第 2 步和第 3 步可以并行——它们都只需要 access_token，互不依赖：

```typescript
// 优化：第2步和第3步并行
const [userRes, tenantsRes] = await Promise.all([
  authApi.getCurrentUser(),
  authApi.getMyTenants(),
])
```

不过 AdminWeb 当前保持串行，因为：如果 getCurrentUser 失败需要降级到 JWT payload 构建，getMyTenants 的结果可能不再需要。串行更简单，性能差异在毫秒级。

---

## JWT 解析：parseJwtPayload

```typescript
function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    // JWT 格式：header.payload.signature，取第二段
    const base64 = token.split(".")[1]
    if (!base64) return null
    // Base64Url → Base64 解码
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(json)
  } catch {
    return null
  }
}
```

### 逐行解析

```
步骤 1：token.split(".")[1]
  "eyJhbGciOiJSUzI1NiIs.eyJzdWIiOiIxMjM0Ii.SflKxwRJSMeK"
  → 提取中间段 "eyJzdWIiOiIxMjM0Ii"

步骤 2：base64.replace(/-/g, "+").replace(/_/g, "/")
  Base64Url 中： - → +  _ → /
  "eyJzdWIiOiIxMjM0Ii" → "eyJzdWIiOiIxMjM0Ii"（本例无变化）

步骤 3：atob(base64)
  将 Base64 字符串解码为 JSON 字符串
  → '{"sub":"1234","name":"张三",...}'

步骤 4：JSON.parse(json)
  → { sub: "1234", name: "张三", ... }
```

**为什么需要解析 JWT？** 因为 SSO 服务器把用户的组织信息（租户、公司、部门、岗位、工号等）放进了 JWT claims，而 `/api/account/current` 接口返回的 `CurrentUser` 不含这些字段。

> **后端类比**：在 ASP.NET Core 中，`ClaimsPrincipal` 的 claims 来自 Cookie/JWT，`UserManager.GetUserAsync()` 返回的是数据库中的用户实体。两者信息有重叠但不完全一致，需要合并。

### 【易错点】parseJwtPayload 可能返回 null

如果 token 格式不正确（比如没有 `.` 分隔符），或 Base64 解码失败，函数返回 `null`。所以后续代码都用可选链 `payload?.tenant_id` 访问：

```typescript
tenantId: payload?.tenant_id ? String(payload.tenant_id) : undefined,
```

如果忘记处理 `null`，运行时会报 `Cannot read property 'tenant_id' of null`。

### 【性能陷阱】parseJwtPayload 在每次登录时调用

`parseJwtPayload` 是纯计算函数，复杂度很低（split + replace + atob + JSON.parse），调用一次的开销可以忽略不计。但如果有人把它放在 React 组件的渲染路径中（比如每次渲染都解析 JWT），就会产生不必要的重复计算。当前实现把它放在 `login` 回调中，只在登录时调用一次——这是正确的做法。

---

## 降级方案：buildUserFromPayload

当 `/api/account/current` 接口不可用时，从 JWT payload 构建基本的用户信息。

```typescript
function buildUserFromPayload(payload: Record<string, unknown>, fallbackName: string): CurrentUser {
  const roles = payload.role
  return {
    id: String(payload.sub ?? ""),
    userName: String(payload.name ?? payload.preferred_username ?? fallbackName),
    displayName: String(payload.name ?? fallbackName),
    email: String(payload.email ?? ""),
    // role 可能是字符串或字符串数组，统一转为数组
    roles: Array.isArray(roles) ? roles.map(String) : roles ? [String(roles)] : [],
    primaryCompanyId: payload.primary_company_id ? String(payload.primary_company_id) : undefined,
    primaryCompanyName: payload.primary_company_name ? String(payload.primary_company_name) : undefined,
    primaryCompanyCode: payload.primary_company_code ? String(payload.primary_company_code) : undefined,
    primaryOrgUnitId: payload.primary_org_unit_id ? String(payload.primary_org_unit_id) : undefined,
    primaryOrgUnitName: payload.primary_org_unit_name ? String(payload.primary_org_unit_name) : undefined,
    primaryPositionId: payload.primary_position_id ? String(payload.primary_position_id) : undefined,
    primaryPositionName: payload.primary_position_name ? String(payload.primary_position_name) : undefined,
    primaryPositionCode: payload.primary_position_code ? String(payload.primary_position_code) : undefined,
    employeeNo: payload.employee_no ? String(payload.employee_no) : undefined,
  }
}
```

### 【易错点】JWT 中的 role 可能是字符串也可能是数组

OIDC 规范允许 `role` claim 为单个字符串或字符串数组：

```json
// 单角色：字符串
{ "role": "admin" }

// 多角色：数组
{ "role": ["admin", "user-manager"] }
```

`buildUserFromPayload` 中用 `Array.isArray(roles)` 做了兼容处理：

```typescript
roles: Array.isArray(roles) ? roles.map(String) : roles ? [String(roles)] : [],
//      ↑ 数组：直接 map                    ↑ 字符串：包成数组     ↑ null/undefined：空数组
```

如果忘记这个兼容，单角色用户会导致 `roles.map is not a function` 报错。

### JWT Claims 合并的两步策略

```typescript
// 第一步：从 JWT 解析组织 claims
const payload = parseJwtPayload(tokenRes.access_token)

// 第二步：API 获取用户详情 + 合并 JWT claims
setUser({
  ...userRes.data,           // API 返回的基本信息
  tenantId: payload?.tenant_id ? ...  // JWT 中的组织信息覆盖
})
```

为什么不直接用 JWT 或直接用 API？因为二者包含的信息不同：

- **JWT claims**：包含租户、公司、部门、岗位等组织信息（随 token 变化）
- **API 返回**：包含用户名、邮箱、角色等基本资料（稳定不变）

合并时 JWT claims 优先级更高（后覆盖）。

### 【设计取舍】JWT claims + API 合并策略

| 策略 | 优点 | 缺点 |
|------|------|------|
| 只用 JWT | 无网络请求，速度快 | 信息有限，不含邮箱等资料 |
| 只用 API | 信息完整 | 缺少组织 claims（API 不返回） |
| **JWT + API 合并**（AdminWeb 选择） | 信息最完整 | 需要额外解析 JWT |
| 降级到 JWT only | API 不可用时仍能工作 | 信息不全 |

---

## logout 的时序

```typescript
clearAuth()                          // 1. 先清本地状态
navigate("/login")                   // 2. 立即跳转
toast.success("已退出登录")           // 3. 提示用户
authApi.logoutByToken().catch(() => {}) // 4. 后端撤销异步执行
```

顺序很重要：**先清本地、再跳转，最后异步调后端**。如果先调后端（可能很慢），用户会看到页面卡住。

### 【易错点】logout 中的操作顺序不可颠倒

| 顺序 | 效果 |
|------|------|
| ✅ clearAuth → navigate → toast → logoutByToken | 用户立即感知退出，后端异步处理 |
| ❌ logoutByToken → clearAuth → navigate | 等后端响应（可能 5s+），页面卡住 |
| ❌ navigate → clearAuth | 跳转了但状态没清，回来还是登录态 |

> **后端类比**：类似"先响应客户端，再异步执行清理"的模式。ASP.NET Core 中 `SignOutAsync()` 也是先清除 Cookie 再返回响应。

> **🤔 导师提问**：如果 `logoutByToken()` 因网络错误失败，用户本地已经被清除了登录状态——这是安全问题，还是可以接受的 UX 折衷？

---

## 错误提取

```typescript
const msg =
  error.response?.data?.error_description ??     // OAuth2 标准错误描述
  (error.response?.status === 400 ? "用户名或密码错误" : "登录失败，请检查网络")
```

OAuth2 的错误响应格式是 `{ error: "invalid_grant", error_description: "用户名或密码错误" }`，不是标准的 `ApiResult` 格式。

### 常见的 OAuth2 错误码

| error 值 | 含义 | 前端提示 |
|----------|------|---------|
| `invalid_grant` | 用户名或密码错误 | "用户名或密码错误" |
| `invalid_client` | client_id 无效 | "登录失败，请检查网络" |
| `invalid_scope` | 请求的 scope 无效 | "登录失败，请检查网络" |
| 网络错误 | 无法连接服务器 | "登录失败，请检查网络" |

### 【易错点】throw err 重新抛出异常

`login` 函数在错误处理末尾有 `throw err`，这意味着调用 `login` 的组件也能 catch 到异常：

```typescript
// 登录页面中的用法
const { login } = useAuth()

const handleSubmit = async (values: LoginFormValues) => {
  try {
    await login(values.username, values.password)
    // 登录成功，不需要额外处理（login 内部已经 navigate 了）
  } catch {
    // 登录失败，toast 已经在 login 内部显示了
    // 这里只需要阻止表单提交后的后续逻辑
    setLoading(false)
  }
}
```

如果不 `throw err`，调用方无法知道登录是否成功，可能会在登录失败后执行不应该执行的逻辑。

---

## 完整的代码文件位置

| 文件 | 作用 |
|------|------|
| `src/hooks/use-auth.ts` | `useAuth` Hook，登录/登出逻辑 |
| `src/stores/auth-store.ts` | Zustand store，认证状态管理 + persist |
| `src/api/auth/auth.ts` | 认证 API 封装（getToken, getCurrentUser, switchTenant 等） |
| `src/api/auth/http.ts` | SSO HTTP 客户端（createHttp("/sso-api")） |
| `src/types/index.ts` | `CurrentUser`、`UserTenantInfo` 类型定义 |

---

> **🔍 验证步骤**
>
> 1. 登录成功后，在 Console 中执行 `useAuthStore.getState()`，检查 `user` 对象是否包含 `id`、`userName`、`displayName`、`roles` 字段
> 2. 检查 `user.tenantName` 和 `user.tenantIdentifier`——这些来自 JWT payload，不在 API 返回的 `CurrentUser` 中
> 3. 打开 React DevTools → Components → 找到任意使用 `useAuth` 的组件 → 查看 Hooks，确认 `isAuthenticated` 为 `true`
> 4. 执行 `useAuthStore.getState().logout()`，确认页面跳转到 `/login`，localStorage 中的 `admin-auth` 被清除

## 🤔 思考题

**Level 1（概念级）**：`parseJwtPayload` 为什么可能返回 `null`？在什么场景下会返回 `null`？

**Level 2（推理级）**：登录流程中 `getCurrentUser` 和 `getMyTenants` 可以并行吗？如果可以，为什么 AdminWeb 当前选择串行？如果不行，为什么？

**Level 3（动手级）**：在浏览器控制台中，手动执行 `parseJwtPayload` 的逻辑：取一个 JWT token，用 `atob()` 解码 Payload 部分，验证 `tenant_id` 字段。然后尝试修改一个字符再解码——会抛出异常吗？为什么？

---

## ✅ 输出检查清单

读完本节，我们应该能回答：

- [ ] `useAuth` Hook 的 `login` 函数包含哪 5 个步骤？每一步的作用是什么？
- [ ] `parseJwtPayload` 的解码流程是什么？为什么需要 replace `-` 和 `_`？
- [ ] JWT 中的 `role` claim 为什么可能是字符串也可能是数组？`buildUserFromPayload` 如何兼容？
- [ ] JWT claims + API 合并策略中，为什么 JWT claims 的优先级更高？
- [ ] `logout` 中为什么必须先 `clearAuth` 再 `navigate`？
- [ ] OAuth2 错误响应和 `ApiResult` 的格式有什么区别？

---

[← 上一篇](./03-认证API层.md) | [下一篇 →](./05-Token管理.md)
