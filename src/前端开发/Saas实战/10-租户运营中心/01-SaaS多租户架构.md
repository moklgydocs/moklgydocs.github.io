# 01 - SaaS 多租户架构

> **这一步解决什么问题？**
> 我们从后端最熟悉的"多数据库"场景出发，理解前端 SaaS 系统如何管理多租户的生命周期。运营中心不是某个租户的内部管理，而是**跨租户的全局视角**——管理所有租户的开通、暂停、配额、模块开关。
>
> **ASP.NET Core 开发者的直觉**：就像 SQL Server 的 `master` 数据库管理所有用户数据库一样，运营中心是 SaaS 平台的"master"。后端用 EF Core 的 `HasQueryFilter` 做行级隔离，运营中心则绕过这个 Filter，看到全局数据。

---

## 一、多租户隔离策略

### 1.1 三种经典策略

| 策略 | 数据库层 | 前端体现 | ASP.NET Core 类比 |
|------|---------|---------|-------------------|
| 独立数据库 | 每租户一个 DB | 租户完全隔离 | `DbContext` 连接串按租户切换 |
| 共享数据库+行隔离 | `TenantId` 列 | 查询自动过滤 | `HasQueryFilter(b => b.TenantId == tenantId)` |
| 共享数据库+Schema | PostgreSQL Schema | 部分隔离 | `modelBuilder.HasDefaultSchema(tenantId)` |

本项目采用**独立数据库**策略：每个租户有独立的数据库连接串。运营中心管理的是租户的元数据（名称、标识符、状态），而非租户内部数据。

> **思考**：如果我们采用共享数据库+行隔离策略，前端每个 API 请求都需要在请求头或参数中带上 `tenantId`。那运营中心的 API 调用呢？运营中心看到的是全局数据，不需要 `tenantId`——但如果后端全局启用 `HasQueryFilter`，运营中心怎么绕过？

### 1.2 多租户请求流转架构

从浏览器到后端，一个多租户请求的完整路径：

```
┌──────────┐     ┌──────────────┐     ┌───────────────────────────────────────┐
│  浏览器   │     │  Vite Proxy  │     │           后端服务                     │
│          │     │ /ops-api/*   │     │                                       │
│ React App├────►│ ──────────►  ├────►│  ┌─────────────┐  ┌─────────────────┐ │
│          │     │ moklgy.me    │     │  │ 租户运营中心  │  │ 租户内部服务     │ │
│ ·运营中心 │     │ :10013       │     │  │ (无租户过滤)  │  │ (TenantId 过滤) │ │
│ ·租户内部 │     │              │     │  └──────┬──────┘  └────────┬────────┘ │
│          │     │              │     │         │                  │          │
└──────────┘     └──────────────┘     │         ▼                  ▼          │
                                      │  ┌─────────────┐  ┌────────────────┐ │
                                      │  │ master DB    │  │ Tenant DB A    │ │
                                      │  │ (全局元数据)  │  │ Tenant DB B    │ │
                                      │  └─────────────┘  │ Tenant DB C    │ │
                                      │                    └────────────────┘ │
                                      └───────────────────────────────────────┘
```

**关键点**：
- 运营中心的请求走 `/ops-api` 前缀，后端不注入 `TenantId` 过滤器
- 租户内部的请求走其他前缀（如 `/api`），后端自动附加 `TenantId` 过滤
- 运营中心读写的 `master DB` 存储租户元数据，不直接访问租户数据库

> **思考**：在 ASP.NET Core 中，我们通常用 Middleware 注入 `TenantId`。那运营中心的 Controller 怎么"跳过"这个 Middleware？常见方案：在 Middleware 中判断请求路径前缀，`/ops-api` 开头的跳过租户注入。前端 Vite Proxy 的路径前缀正好对应了后端的这个分支。

### 1.3 运营中心的特殊定位

```
┌──────────────────────────────────────────────────────────────────┐
│                    SaaS 平台的两层视图                              │
│                                                                  │
│  运营中心（平台管理员）                                            │
│    ├── 看到所有租户                                               │
│    ├── 管理版本、配额、模块开关                                     │
│    └── 绕过 TenantId 过滤（全局视角）                              │
│                                                                  │
│  租户内部（租户管理员）                                            │
│    ├── 只看到自己租户的数据                                        │
│    ├── 使用权限中心、文件服务等                                     │
│    └── 受 TenantId 过滤（隔离视角）                                │
└──────────────────────────────────────────────────────────────────┘
```

**关键理解**：运营中心的目标用户是**平台管理员**，不是租户管理员。所以它需要看到所有租户的数据，而非某个租户内部。

### 1.4 平台级数据 vs 租户级数据

运营中心处理的所有数据可以分为两类，理解这个划分是避免逻辑混乱的关键：

| 数据类别 | 示例 | 存储位置 | 查询范围 |
|---------|------|---------|---------|
| 平台级数据 | 版本列表、全局功能开关、Webhook 端点 | master DB | 无需 TenantId |
| 租户级数据 | 租户配额、租户模块、租户健康状态 | master DB + tenantId 字段 | 按 TenantId 筛选 |

【易错点】 即使是运营中心的"全局视角"，查看租户详情时仍然需要传 `tenantId`。这不是租户过滤，而是**指定操作对象**——就像 DBA 执行 `USE TenantDB_A` 一样，是在选择目标，不是在限制权限。

---

## 二、版本（Edition）与租户（Tenant）的关系

### 2.1 版本是"套餐模板"，租户是"实例"

```
版本(Edition) ── 定义"套餐模板"
  ├── 模块列表: [权限中心, 文件服务, 打印服务, ...]
  ├── 配额默认值: { MaxUsers: 100, StorageGB: 50 }
  └── 定价: { Monthly: ¥299, Yearly: ¥2999 }

租户(Tenant) ── 版本的"实例"
  ├── 订阅版本 → 继承模块和配额
  ├── 实际配额 → 可在版本默认值基础上调整
  └── 生命周期 → Active → Suspended → Terminated
```

**ASP.NET Core 类比**：版本就像 `appsettings.json` 中的默认配置，租户就像 `appsettings.Production.json` 中的覆盖配置——后者继承前者并可覆盖。

### 2.2 版本的数据结构

```typescript
// src/types/index.ts
export interface EditionDto {
  id: string
  code: string                    // 版本代码（创建后不可修改）
  displayName: string             // 显示名称
  description: string | null      // 描述
  monthlyPrice: number            // 月度价格
  yearlyPrice: number             // 年度价格
  isActive: boolean               // 是否启用
  sortOrder: number               // 排序
  featuresJson: string | null     // 功能特性（JSON）
  modules: EditionModuleDto[]     // 包含的模块列表
  quotaDefaults: EditionQuotaDefaultDto[]  // 配额默认值
}
```

版本的 `modules` 定义了"哪些模块可用"，`quotaDefaults` 定义了"默认配额"。租户订阅版本后，继承这些默认值，但可以单独调整。

> **思考**：`featuresJson` 为什么用 `string | null` 而不是 `Record<string, unknown>`？因为后端数据库中 JSON 字段存的是字符串，前端可以 `JSON.parse(featuresJson)` 按需解析。这和 EF Core 中 `HasColumnType("jsonb")` 的做法一样——数据库存 JSON 字符串，代码中按需反序列化。

### 2.3 版本代码的不可变性

```typescript
// 版本代码创建后不可修改
<Input value={form.code} onChange={...} disabled={isEdit} />
```

版本代码（`code`）是系统内部标识，修改会影响 API 路由和权限映射。就像数据库的主键，一旦创建就不可变更。

**ASP.NET Core 类比**：`code` 相当于数据库的 `UNIQUE` 约束。`CreateEditionRequest` 包含 `code`，`UpdateEditionRequest` 不包含 `code`。

---

## 三、租户生命周期状态机

### 3.1 四种状态

```typescript
// src/types/index.ts
export const TENANT_STATUS = {
  Provisioning: 0,  // 创建中
  Active: 1,        // 正常
  Suspended: 2,     // 已暂停
  Terminated: 3,    // 已终止
} as const

export const TENANT_STATUS_LABELS: Record<TenantStatus, string> = {
  [TENANT_STATUS.Provisioning]: "创建中",
  [TENANT_STATUS.Active]: "正常",
  [TENANT_STATUS.Suspended]: "已暂停",
  [TENANT_STATUS.Terminated]: "已终止",
}
```

### 3.2 状态流转

```
              开通(provision)
                  │
                  ▼
            ┌──────────┐
            │Provisioning│ ──自动──→ Active
            └──────────┘
                  │
                  ▼
            ┌─────────┐
            │  Active  │ ◄── activate
            └────┬────┘
                 │ suspend
                 ▼
           ┌──────────┐
           │ Suspended │ ──terminate──► Terminated
           └──────────┘
```

**Terminated 是终态，不可逆！** 就像数据库被 `DROP` 了，不是 `OFFLINE`。

【易错点】 `Provisioning` 是过渡状态——租户创建时，后端需要初始化数据库、分配资源，这个过程是异步的。前端调用 `provision` API 后，租户进入 `Provisioning` 状态，后端完成初始化后自动变为 `Active`。前端不需要轮询——开通对话框关闭后刷新列表即可。

【易错点】 **租户 ID 跨请求泄漏**：在运营中心页面，我们同时操作多个租户。如果在一个租户的上下文中发起请求，却把 `tenantId` 残留在下一个请求中，就会造成数据错乱。运营中心的 API 都显式传 `tenantId`（在 URL 或 body 中），而不是依赖全局状态或请求头——这正是为了避免上下文泄漏。

> **思考**：如果后端的 Provisioning 过程可能失败（比如数据库创建超时），租户会永远停留在 Provisioning 状态吗？我们需要一个超时机制或手动重试按钮吗？

### 3.3 版本订阅状态

租户的版本订阅有独立的状态：

```typescript
export const TENANT_EDITION_STATUS = {
  Active: 1,     // 活跃
  Expired: 2,    // 已过期
  Cancelled: 3,  // 已取消
  Trial: 4,      // 试用中
  Suspended: 5,  // 已暂停
} as const
```

租户状态（Active）和版本订阅状态（Expired）是独立的。一个租户可能是 Active 但版本已过期——此时后端可以限制功能或提示续费。

### 3.4 计费周期

```typescript
export const BILLING_CYCLE = {
  Monthly: 1,  // 月付
  Yearly: 2,   // 年付
} as const

export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  [BILLING_CYCLE.Monthly]: "月付",
  [BILLING_CYCLE.Yearly]: "年付",
}
```

每个租户订阅版本时选择计费周期，支持自动续费：

```typescript
export interface TenantEditionDto {
  id: string
  editionId: string
  editionDisplayName: string | null
  status: TenantEditionStatus
  startsAt: string          // 订阅开始时间
  expiresAt: string         // 订阅到期时间
  cycle: BillingCycle       // 计费周期
  autoRenew: boolean        // 是否自动续费
  customMonthlyPrice: number | null  // 自定义月价（可覆盖版本默认价）
  customYearlyPrice: number | null   // 自定义年价
}
```

---

## 四、运营中心的 API 架构

### 4.1 统一的 HTTP 客户端

运营中心的所有 API 共享一个 HTTP 客户端实例：

```typescript
// src/api/ops/http.ts
import { createHttp } from "@/lib/create-http"

const opsHttp = createHttp("/ops-api")

export const { get, post, put, del, postForm } = opsHttp
export default opsHttp.instance
```

`createHttp("/ops-api")` 创建了一个 `baseURL` 为 `/ops-api` 的 axios 实例。所有运营中心 API 的请求都会加上这个前缀，由 Vite Proxy 转发到 `http://moklgy.me:10013`。

**ASP.NET Core 类比**：这就像注册 `IHttpClientFactory`，为运营中心微服务创建一个命名的 `HttpClient`。每个微服务一个客户端实例，避免拦截器互相污染。

【易错点】 **异步操作中的租户上下文丢失**：如果 `opsHttp` 的拦截器中设置了租户相关的 header，异步操作（如 `setTimeout`、Promise chain）可能读不到正确的值。本项目的 `opsHttp` 不依赖拦截器注入租户信息，而是通过 API 参数显式传递——这避免了异步上下文问题，就像 ASP.NET 中用 `ITenantAccessor` 而不是 `AsyncLocal` 一样可靠。

### 4.2 7 个 API 模块

```
api/ops/
  ├── http.ts          ← HTTP 客户端（= IHttpClientFactory 注册）
  ├── overview.ts      ← 平台概览（1 个方法）
  ├── editions.ts      ← 版本管理（5 个方法：CRUD + getById）
  ├── tenants.ts       ← 租户管理（12 个方法，最复杂）
  ├── features.ts      ← 功能开关（3 个方法：isEnabled, getValue, invalidateCache）
  ├── webhooks.ts      ← Webhook 管理（4 个方法）
  ├── mfa.ts           ← MFA 多因素认证（5 个方法）
  ├── data-exchange.ts ← 数据导入导出（4 个方法）
  └── workflow.ts      ← 工作流审批（4 个方法）
```

### 4.3 tenantsApi 的方法全景

租户管理是最复杂的模块，方法数量最多：

```typescript
export const tenantsApi = {
  // ── 生命周期 ──
  provision: (data) => post("/api/tenant-ops/tenants/provision", data),
  suspend: (tenantId, reason?) => post(`/api/tenant-ops/tenants/${tenantId}/suspend`, { reason }),
  activate: (tenantId) => post(`/api/tenant-ops/tenants/${tenantId}/activate`),
  terminate: (tenantId, reason?) => post(`/api/tenant-ops/tenants/${tenantId}/terminate`, { reason }),
  subscribeEdition: (tenantId, data) => post(`/api/tenant-ops/tenants/${tenantId}/edition`, data),

  // ── 详情 ──
  getDashboard: (tenantId) => get(`/api/tenant-ops/tenants/${tenantId}/dashboard`),
  getQuotas: (tenantId) => get(`/api/tenant-ops/tenants/${tenantId}/quotas`),
  updateQuota: (tenantId, resourceType, data) => put(`/api/tenant-ops/tenants/${tenantId}/quotas`, { ...data, tenantId, resourceType }),
  getModules: (tenantId) => get(`/api/tenant-ops/tenants/${tenantId}/modules`),
  toggleModule: (tenantId, data) => post(`/api/tenant-ops/tenants/${tenantId}/modules/toggle`, { ...data, tenantId }),
  getFeatures: (tenantId) => get(`/api/tenant-ops/tenants/${tenantId}/features`),
  setFeature: (tenantId, data) => post(`/api/tenant-ops/tenants/${tenantId}/features`, { ...data, tenantId }),
  getHealth: (tenantId) => get(`/api/tenant-ops/tenants/${tenantId}/health`),
  getOperations: (tenantId, params?) => get(`/api/tenant-ops/tenants/${tenantId}/operations`, params),
}
```

【易错点】 `updateQuota` 和 `toggleModule` 的请求体中用展开运算符 `{ ...data, tenantId, resourceType }`，把 URL 中的 `tenantId` 和 `resourceType` 再塞进 body。后端可能两处都需要——URL 做路由匹配，body 做数据绑定。

【易错点】 `suspend` 和 `terminate` 需要传 `reason`（原因），而 `activate` 不需要。这是因为暂停和终止是**不可逆操作**（至少终止是不可逆的），需要审计追踪。`activate` 是恢复正常状态，不需要理由。

### 4.4 API 路径的命名规律

观察运营中心 API 的 URL，可以发现统一的命名模式：

```
/api/tenant-ops/{资源名}              ← 列表/创建
/api/tenant-ops/{资源名}/{id}          ← 详情/更新/删除
/api/tenant-ops/tenants/{id}/{子资源}  ← 租户的子资源
```

**ASP.NET Core 类比**：这就是 RESTful Controller 的 `[Route("api/tenant-ops/[controller]")]` 模式。`tenant-ops` 是 Area（区域），对应运营中心这个业务域。

> **思考**：为什么路径是 `/api/tenant-ops/...` 而不是 `/api/ops/...`？`tenant-ops` 明确了这是"租户运营"操作，和未来可能出现的"用户运营"、"内容运营"区分开。前端的 `createHttp("/ops-api")` 只是 Vite Proxy 的前缀，真正的业务路径在后端定义。

---

## 五、运营中心页面的路由结构

```
/ops
  ├── /ops/overview          ← 平台概览（StatCard 仪表盘）
  ├── /ops/editions           ← 版本管理（AgTable + 表单对话框）
  ├── /ops/tenants            ← 租户管理（搜索 + 仪表盘 + 生命周期操作）
  ├── /ops/tenants/:id        ← 租户详情（6 个标签页）
  ├── /ops/features           ← 功能开关（查询 + 值获取 + 缓存失效）
  ├── /ops/webhooks           ← Webhook 管理（列表 + 创建对话框）
  ├── /ops/mfa                ← MFA 管理
  ├── /ops/data                ← 数据交换（导入导出）
  └── /ops/workflow           ← 工作流审批
```

租户详情页的 6 个标签页：概览、配额、模块、特性、健康、操作日志。每个标签页按需加载——切换标签时才请求数据，避免一次性加载所有数据。

> **思考**：租户详情页为什么不用 URL 的 query 参数来切换标签（如 `?tab=quota`），而是用组件内部状态？因为标签页切换只是 UI 状态变化，不需要被浏览器历史记录或书签捕获。但如果需要"直接链接到某个标签页"的功能，就需要 URL 参数了。

---

---

## 六、隔离策略的设计取舍

【设计取舍】 共享数据库 vs 独立数据库——SaaS 多租户最经典的架构选择：

| 维度 | 独立数据库 | 共享数据库+行隔离 |
|------|-----------|-----------------|
| **数据隔离** | 物理隔离，最安全 | 逻辑隔离，依赖代码正确性 |
| **运维成本** | 高（N 个 DB 要备份/迁移） | 低（一个 DB 统一管理） |
| **跨租户查询** | 困难（需要联邦查询） | 简单（WHERE 条件） |
| **租户迁移** | 导出导入整个 DB | 移动行即可 |
| **Schema 升级** | 需要逐租户执行迁移 | 一次迁移全部生效 |
| **故障隔离** | 好（一个 DB 坏不影响其他） | 差（一个慢查询拖垮所有租户） |
| **成本** | 高（每个 DB 占独立资源） | 低（共享资源池） |
| **前端影响** | 切换连接串，API 无感 | 所有 API 传 TenantId，运营中心需绕过 |

**本项目选独立数据库的原因**：SaaS 平台面向企业客户，数据隔离是合规硬要求。运维成本可以通过自动化（CI/CD 数据库迁移）来降低。前端影响最小——运营中心用 `/ops-api` 前缀，租户内部用 `/api` 前缀，路径即隔离。

> **思考**：如果你的 SaaS 产品面向个人用户（如笔记应用），租户数量可能达到百万级。独立数据库策略还适用吗？这时候共享数据库+行隔离可能更现实——但你需要特别关注 `TenantId` 过滤的正确性和查询性能。

---

## 七、验证与自检

在理解了多租户架构后，用以下步骤验证我们的理解是否正确：

1. **打开运营中心**，确认能看到所有租户（而不是只有自己租户）
2. **检查网络请求**，确认 API 路径以 `/ops-api` 开头
3. **创建一个新租户**，观察状态从 `Provisioning` → `Active` 的变化
4. **暂停一个租户**，确认需要填写原因，且恢复时不需要原因
5. **查看租户详情的 6 个标签页**，确认数据按需加载
6. **切换到租户内部应用**（如权限中心），确认只能看到自己租户的数据——对比运营中心的全局视角
7. **检查浏览器 DevTools Network 面板**，确认运营中心和租户内部应用的 API 前缀不同

---

## 八、小结

| 概念 | 前端实现 | 后端类比 |
|------|---------|---------|
| 多租户隔离 | API 层 `tenantId` 参数 | EF Core `HasQueryFilter` |
| 版本(Edition) | EditionDto + EditionFormDialog | `appsettings.json` 默认配置 |
| 租户生命周期 | tenantsApi.suspend/activate/terminate | 数据库 ONLINE/OFFLINE/DROP |
| 版本订阅 | TenantEditionDto + BillingCycle | 订阅模式 + 自动续费 |
| 配额 | TenantQuotaDto + 内联编辑 | 连接池 max pool size |
| HTTP 客户端 | createHttp("/ops-api") | IHttpClientFactory 命名客户端 |
| API 模块化 | 7 个 API 文件 | 按领域拆分的 Controller |

---

## ✅ 输出检查清单

完成本节学习后，确认以下知识点已掌握：

- [ ] 能解释三种多租户隔离策略的区别
- [ ] 能说明运营中心为什么需要绕过 TenantId 过滤
- [ ] 能画出从浏览器到后端的多租户请求流转图
- [ ] 理解版本（Edition）和租户（Tenant）的"模板-实例"关系
- [ ] 能列出租户的四种状态和它们的流转规则
- [ ] 知道为什么 `suspend`/`terminate` 需要 `reason` 而 `activate` 不需要
- [ ] 理解 `createHttp("/ops-api")` 的作用和 ASP.NET Core `IHttpClientFactory` 的类比
- [ ] 能解释独立数据库 vs 共享数据库的设计取舍
- [ ] 能区分平台级数据和租户级数据，并知道何时需要传 TenantId

---

## 递进思考

**L1 入门**：运营中心的目标用户是谁？为什么它需要看到所有租户的数据，而不是只看自己租户的？

**L2 进阶**：如果租户从 Suspended 恢复到 Active，但它的版本订阅已过期，会发生什么？前端应该怎么提示？后端应该怎么处理？

**L3 架构**：假设我们要新增一个"归档(Archived)"状态，它和 Terminated 有什么区别？需要修改哪些 API？归档的租户数据库是否还保留？成本如何？

---

[← 上一篇：07-偏好设置](../08-通知中心/07-偏好设置.md) | [下一篇：02-运营API层 →](02-运营API层.md)
