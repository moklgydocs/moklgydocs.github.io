# 项目架构与工程化

设计目录结构，封装 HTTP 客户端与工具函数，搭建路由、布局、状态管理和类型体系。

## 步骤导航

| 步骤 | 文件 | 核心内容 |
|------|------|----------|
| 1 | [01-目录结构设计](./01-目录结构设计.md) | 完整目录树、服务化 API 组织 vs 功能化、MVC 对比 |
| 2 | [02-工具函数](./02-工具函数.md) | cn()、createHttp 工厂（Token 刷新队列+Blob 错误检测） |
| 3 | [03-HTTP客户端封装](./03-HTTP客户端封装.md) | 401 刷新队列时序图、7 个服务 http.ts、并发刷新详解 |
| 4 | [04-路由系统](./04-路由系统.md) | App.tsx 全路由、ProtectedRoute、lazy loading |
| 5 | [05-布局组件](./05-布局组件.md) | AppLayout、AppSidebar 动态菜单、AppHeader |
| 6 | [06-状态管理](./06-状态管理.md) | auth-store、menu-store、Zustand vs Redux、persist |
| 7 | [07-类型定义体系](./07-类型定义体系.md) | ApiResult、PagedResult、as const vs enum、Vite 代理全映射 |

[返回上级](../)
