# SSO 单点登录

实现基于 OAuth2 + JWT 的单点登录，包含登录页面、Token 管理、路由守卫和租户选择。

## 步骤导航

| 步骤 | 文件 | 核心内容 |
|------|------|----------|
| 1 | [01-OAuth2与JWT基础](./01-OAuth2与JWT基础.md) | ROPC 流程图、JWT 结构、switch_tenant 自定义授权 |
| 2 | [02-登录页面](./02-登录页面.md) | LoginPage 完整代码、framer-motion 动画、密码可见切换 |
| 3 | [03-认证API层](./03-认证API层.md) | auth.ts 6 方法、postForm vs post、3 种 grant_type |
| 4 | [04-useAuth-Hook](./04-useAuth-Hook.md) | 登录 5 步流程图、parseJwtPayload、buildUserFromPayload |
| 5 | [05-Token管理](./05-Token管理.md) | 并发刷新队列时序图、isRefreshing+failedQueue、Zustand persist |
| 6 | [06-路由守卫](./06-路由守卫.md) | ProtectedRoute 三条件守卫、Navigate vs navigate() |
| 7 | [07-租户选择](./07-租户选择.md) | SelectTenantPage、多租户判断、租户切换机制 |

[返回上级](../)
