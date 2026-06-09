# 03 - 通知 API 层与类型定义：前后端契约

> **这一步解决什么问题？**
> 前端要和后端通信，需要两样东西：**类型定义**（数据长什么样）和 **API 函数**（怎么发请求）。这一节我们把通知中心的所有类型和 API 都搞清楚。
>
> **ASP.NET Core 类比**：类型定义 ≈ 你的 DTO 类（`NotificationDto`、`SendNotificationRequest`），API 函数 ≈ 你的 Controller 方法（`[HttpGet] GetNotifications`、`[HttpPost] MarkAsRead`）。

---

## 前置知识

- 第 1-2 节的 SignalR 连接与通知 Store 概念
- ASP.NET Core 的 DTO 模式和 `[JsonIgnore]` / `[JsonPropertyName]` 特性
- TypeScript 泛型与 `as const` 类型推断
- `createHttp` 工厂函数的用法（第 3 章已封装）
- JSON 序列化中枚举的 int vs string 格式差异

---

## 一、文件结构总览

```
src/api/notify/
├── http.ts          ← HTTP 客户端工厂（通知中心专用）
├── notifications.ts ← 通知记录 API（查询、标记已读、发送）
├── templates.ts     ← 模板 CRUD API
└── preferences.ts   ← 偏好设置 API

src/types/
└── notification.ts  ← 所有通知相关类型定义
```

```
┌──────────────────────────────────────────────────────────────┐
│                     请求流转链路                               │
│                                                              │
│  React 组件                                                  │
│    │                                                         │
│    ▼                                                         │
│  API 函数 (notifications.ts)                                  │
│    │  get<PagedResult<NotificationDto>>("/api/notifications") │
│    ▼                                                         │
│  HTTP 客户端 (http.ts)                                        │
│    │  notifyHttp.get(url, params)                             │
│    ▼                                                         │
│  create-http.ts → axios                                      │
│    │  baseURL: "/notify-api"                                  │
│    │  自动注入: Bearer Token + X-Tenant-Id                    │
│    ▼                                                         │
│  Vite Proxy: /notify-api/* → http://localhost:10012/*        │
│    │                                                         │
│    ▼                                                         │
│  ASP.NET Core Controller                                     │
└──────────────────────────────────────────────────────────────┘
```

> **🤔 导师提问**：请求从 React 组件到 ASP.NET Core Controller，经过了 4 层（API 函数 → http.ts → create-http → Vite Proxy）。在 ASP.NET Core 里，请求从 Controller 到数据库也要经过多层（Controller → Service → Repository → DbContext）。你能画出前端这 4 层各自对应的 ASP.NET Core 分层吗？为什么要分这么多层？

---

## 二、HTTP 客户端：http.ts

```typescript
// NotificationCenter 模块 HTTP 客户端
// 代理路径：/notify-api/* → http://localhost:10012/*
import { createHttp } from "@/lib/create-http"

/** 通知中心 HTTP 客户端，基础路径为 /notify-api */
const notifyHttp = createHttp("/notify-api")

/** 导出常用 HTTP 方法 */
export const { get, post, put, del } = notifyHttp
/** 导出 axios 实例，供需要自定义配置的场景使用 */
export default notifyHttp.instance
```

逐行精讲：

| 标记 | 代码 | 解读 |
|------|------|------|
| **【设计取舍】** | `createHttp("/notify-api")` | 每个后端微服务一个 HTTP 客户端！通知中心跑在 `:10012`，权限跑在 `:10013`，SSO 跑在 `:10010`。不同前缀走不同 Vite proxy 规则 |
| **【易错点】** | `export const { get, post, put, del }` | 解构导出，调用者不需要关心 `notifyHttp` 的存在。`import { get } from "./http"` 比 `import notifyHttp from "./http"; notifyHttp.get(...)` 更简洁 |
| **【设计取舍】** | `export default notifyHttp.instance` | 导出底层 axios 实例，用于特殊场景（如文件下载需要 `responseType: 'blob'`）。正常 CRUD 用不到 |

💡 **ASP.NET Core 类比**：
- `createHttp("/notify-api")` ≈ `services.AddHttpClient("NotificationCenter", c => c.BaseAddress = new Uri("http://localhost:10012"))`
- `get/post/put/del` ≈ 命名 HttpClient 的扩展方法

> **🤔 导师提问**：`createHttp("/notify-api")` 为每个微服务创建独立的 HTTP 客户端，这和 ASP.NET Core 的 `IHttpClientFactory` 命名客户端（`AddHttpClient("NotificationCenter")`）是同一个思路。为什么不给所有 API 共用一个 axios 实例？想想如果一个实例的 `baseURL` 被另一个服务覆盖了会怎样。

### createHttp 做了什么？（回顾）

```
createHttp("/notify-api") 返回的对象：

┌─────────────────────────────────────────────────┐
│  get<T>(url, params?)  → Promise<ApiResult<T>> │
│  post<T>(url, data?)   → Promise<ApiResult<T>> │
│  put<T>(url, data?)    → Promise<ApiResult<T>> │
│  del<T>(url, config?)  → Promise<ApiResult<T>> │
│  postForm<T>(url, data) → Promise<T>           │
│  instance: AxiosInstance                        │
│                                                 │
│  自动注入:                                       │
│  - Authorization: Bearer {accessToken}          │
│  - X-Tenant-Id: {currentTenantId}              │
│                                                 │
│  自动处理:                                       │
│  - 401 → 尝试刷新 Token → 重发请求              │
│  - 非 ApiResult 响应 → 自动包裹为 ApiResult      │
└─────────────────────────────────────────────────┘
```

---

## 三、通知记录 API：notifications.ts

```typescript
// 通知 API —— 当前用户的通知查询与操作
import { get, post } from "./http"
import type { PagedResult } from "@/types"
import type { NotificationDto, SendNotificationRequest, SendNotificationResult } from "@/types/notification"

/**
 * 获取当前用户通知列表（分页）
 * @param params 查询参数
 * @param params.page 页码
 * @param params.pageSize 每页条数
 * @param params.status 通知状态筛选
 * @param params.channel 通知渠道筛选
 */
export function getNotifications(params: {
  page?: number
  pageSize?: number
  status?: number
  channel?: number
}) {
  return get<PagedResult<NotificationDto>>("/api/notifications", params)
}

/** 获取当前用户未读通知数 */
export function getUnreadCount() {
  return get<{ unreadCount: number }>("/api/notifications/unread-count")
}

/**
 * 标记单条通知为已读
 * @param id 通知 ID
 */
export function markAsRead(id: string) {
  return post<void>(`/api/notifications/${id}/read`)
}

/** 标记所有通知为已读，返回标记数量 */
export function markAllAsRead() {
  return post<{ markedCount: number }>("/api/notifications/read-all")
}

/**
 * 管理员发送通知
 * @param data 通知发送请求数据
 */
export function sendNotification(data: SendNotificationRequest) {
  return post<SendNotificationResult>("/api/notifications/send", data)
}
```

逐行精讲：

| 标记 | 代码 | 解读 |
|------|------|------|
| **【易错点】** | `get<PagedResult<NotificationDto>>` | 泛型嵌套！`PagedResult` 是分页容器，`NotificationDto` 是单条数据。返回类型是 `ApiResult<PagedResult<NotificationDto>>` |
| **【设计取舍】** | `status?: number` vs `status?: string` | 这里用了 `number`，因为后端枚举是 int。但 `NotificationStatus` 类型定义是字符串枚举。这是**前后端枚举映射**的常见不一致，需要在调用时做转换 |
| **【易错点】** | `` post<void>(`/api/notifications/${id}/read`) `` | 模板字符串 + 反引号拼接路径参数。**不要用** `/api/notifications/` + id（容易漏斜杠或多斜杠） |
| **【设计取舍】** | `post<{ markedCount: number }>` | `markAllAsRead` 返回标记数量，方便 UI 显示"已标记 N 条为已读" |

💡 **API 函数的命名规律**：

| 操作 | 命名模式 | HTTP 方法 | 示例 |
|------|----------|----------|------|
| 查列表 | get + 复数名词 | GET | `getNotifications` |
| 查数量 | get + 名词 + Count | GET | `getUnreadCount` |
| 标记状态 | mark + 目标 + 状态 | POST | `markAsRead`, `markAllAsRead` |
| 发送动作 | send + 名词 | POST | `sendNotification` |

> **🤔 导师提问**：`markAsRead` 用的是 POST 而不是 PUT。在 ASP.NET Core 里，你通常怎么区分 POST 和 PUT？`markAsRead(id)` 是"创建一个已读记录"还是"更新通知状态"？这个语义判断决定了应该用 POST 还是 PUT。

> **🤔 导师提问**：`status?: number` 的类型是 `number`，但 `NotificationStatus` 枚举是字符串（`"sent"`、`"read"`）。这是前后端枚举映射的常见不一致。在 ASP.NET Core 项目中，你通常怎么处理枚举在 HTTP API 中的序列化格式——用 int 还是用 string？各有什么利弊？

---

## 四、模板 API：templates.ts

```typescript
// 通知模板 API —— 模板 CRUD
import { get, post, put, del } from "./http"
import type { PagedResult } from "@/types"
import type {
  TemplateListDto,
  TemplateDetailDto,
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from "@/types/notification"

export function getTemplates(params: {
  page?: number
  pageSize?: number
  keyword?: string
}) {
  return get<PagedResult<TemplateListDto>>("/api/notification-templates", params)
}

export function getTemplate(id: string) {
  return get<TemplateDetailDto>(`/api/notification-templates/${id}`)
}

export function createTemplate(data: CreateTemplateRequest) {
  return post<{ id: string }>("/api/notification-templates", data)
}

export function updateTemplate(id: string, data: UpdateTemplateRequest) {
  return put<void>(`/api/notification-templates/${id}`, data)
}

export function deleteTemplate(id: string) {
  return del<void>(`/api/notification-templates/${id}`)
}
```

⚠️ **【设计取舍】为什么列表用 `TemplateListDto`，详情用 `TemplateDetailDto`？**
列表只需要 id/code/name/description/isEnabled，而详情需要各渠道的模板内容（站内信标题/正文、邮件主题/正文、短信模板等）。列表不返回模板内容是为了**减少传输体积**——模板内容可能很长（HTML 邮件模板）。

```
TemplateListDto (列表用)          TemplateDetailDto (详情用，继承 ListDto)
┌─────────────────────┐          ┌─────────────────────────────────────┐
│ id                  │          │ id                                  │
│ code                │          │ code                                │
│ name                │          │ name                                │
│ description         │          │ description                         │
│ isEnabled           │          │ isEnabled                           │
│ creationTime        │          │ creationTime                        │
└─────────────────────┘          │ ── 以下为详情独有 ──                  │
                                 │ inAppTitleTemplate                  │
                                 │ inAppBodyTemplate                   │
                                 │ emailSubjectTemplate                │
                                 │ emailBodyTemplate                   │
                                 │ smsTemplate                         │
                                 │ weChatTemplateId                    │
                                 │ weChatDataTemplate                  │
                                 │ mobilePushTitleTemplate             │
                                 │ mobilePushBodyTemplate              │
                                 └─────────────────────────────────────┘
```

💡 **ASP.NET Core 类比**：
- `TemplateListDto` ≈ 你在 `GET /api/templates` 返回的投影（`Select(t => new { t.Id, t.Code, t.Name })`）
- `TemplateDetailDto` ≈ 你在 `GET /api/templates/{id}` 返回的完整实体

---

## 五、偏好 API：preferences.ts

```typescript
// 通知偏好 API —— 用户渠道偏好管理
import { get, put } from "./http"
import type { PreferenceDto, UpdatePreferenceRequest } from "@/types/notification"

/** 获取当前用户的通知偏好列表，包含各渠道的开关状态 */
export function getPreferences() {
  return get<PreferenceDto[]>("/api/notification-preferences")
}

/**
 * 批量更新通知偏好设置
 * @param data 偏好更新请求数组，每项包含偏好 ID 和新的开关状态
 */
export function updatePreferences(data: UpdatePreferenceRequest[]) {
  return put<void>("/api/notification-preferences", data)
}
```

逐行精讲：

| 标记 | 代码 | 解读 |
|------|------|------|
| **【设计取舍】** | `get<PreferenceDto[]>` | 偏好不分页！因为一个用户最多 5 个渠道 × N 个模板，数量有限，不需要分页 |
| **【易错点】** | `updatePreferences(data: UpdatePreferenceRequest[])` | 批量更新！不是一条一条更新。传入数组，一次 PUT 更新所有偏好。减少网络请求 |

> **🤔 导师提问**：偏好 API 用 PUT 批量更新（一次提交所有渠道），而通知 API 的 `markAsRead` 是单条操作。为什么不提供 `markAsRead(ids: string[])` 的批量接口？想想 ASP.NET Core 中批量操作的事务一致性——5 条标记已读，3 成功 2 失败，你该怎么返回结果？

---

## 六、类型定义完整精读：notification.ts

### 6.1 枚举定义（const enum 模式）

```typescript
// ─── 通知渠道 ─────────────────────────────────────────────────────────────

/** 通知渠道（与后端 JsonStringEnumConverter(CamelCase) 输出一致） */
export const NotificationChannel = {
  /** 站内通知 */
  InApp: "inApp",
  /** 邮件 */
  Email: "email",
  /** 短信 */
  Sms: "sms",
  /** 微信模板消息 */
  WeChatTemplate: "weChatTemplate",
  /** 移动端推送 */
  MobilePush: "mobilePush",
} as const

export type NotificationChannel = (typeof NotificationChannel)[keyof typeof NotificationChannel]
```

⚠️ **【易错点】为什么不用 TypeScript 的 `enum`？**

```typescript
// ❌ TypeScript enum（数字枚举）
enum NotificationChannel {
  InApp = 0,     // 编译后变成数字 0
  Email = 1,
}

// ❌ TypeScript enum（字符串枚举）
enum NotificationChannel {
  InApp = "inApp",  // 编译后是 { InApp: "inApp", "inApp": "InApp" }（双向映射）
}

// ✅ AdminWeb 的做法：const 对象 + as const + 类型提取
const NotificationChannel = { InApp: "inApp" } as const
type NotificationChannel = (typeof NotificationChannel)[keyof typeof NotificationChannel]
// 等价于 type NotificationChannel = "inApp" | "email" | "sms" | ...
```

**为什么？** 因为后端 ASP.NET Core 用了 `[JsonStringEnumConverter(CamelCase)]`，序列化输出是 `"inApp"` 而不是 `0`。用 `const` 对象可以直接匹配后端字符串值，且**运行时可用**（TypeScript enum 在运行时会生成额外代码）。

```
后端 C#                          → JSON         → 前端 TypeScript
NotificationChannel.InApp        → "inApp"      → NotificationChannel.InApp (= "inApp")
NotificationChannel.Email        → "email"      → NotificationChannel.Email (= "email")
```

### 6.2 通知状态枚举

```typescript
export const NotificationStatus = {
  Pending: "pending",
  Sent: "sent",
  Failed: "failed",
  Read: "read",
} as const

export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus]
```

💡 **状态流转**：

```
  Pending ──→ Sent ──→ Read
               │
               └──→ Failed
```

- `Pending`：待发送（后端入队但未发出）
- `Sent`：已发送（用户未读）— 相当于"未读"
- `Failed`：发送失败
- `Read`：已读

⚠️ **【易错点】`Sent` 不是"已发送"，而是"未读"！** 在通知中心语境里，`Sent = 已送达 = 你还没读`。这是后端设计的选择，前端需要适配。

### 6.3 优先级枚举

```typescript
export const NotificationPriority = {
  Low: "low",
  Normal: "normal",
  High: "high",
  Urgent: "urgent",
} as const

export type NotificationPriority = (typeof NotificationPriority)[keyof typeof NotificationPriority]
```

### 6.4 通知记录 DTO

```typescript
export interface NotificationDto {
  id: string
  templateCode: string
  channel: NotificationChannel
  status: NotificationStatus
  priority: NotificationPriority
  title?: string
  body?: string
  dataJson?: string
  sentAt?: string
  readAt?: string
  creationTime: string
}
```

逐行精讲：

| 字段 | 类型 | 为什么 |
|------|------|--------|
| `id` | `string` | UUID，非自增 int（分布式系统用 UUID 避免冲突）|
| `templateCode` | `string` | 关联模板编码，如 `"order.shipped"` |
| `channel` | `NotificationChannel` | 联合类型，值为 `"inApp" \| "email" \| ...` |
| `status` | `NotificationStatus` | 通知当前状态 |
| `priority` | `NotificationPriority` | 优先级（紧急通知忽略用户偏好） |
| `title?` | `string \| undefined` | **可选**！因为短信没有标题 |
| `body?` | `string \| undefined` | **可选**！某些通知只有标题没有正文 |
| **【易错点】** `dataJson?` | `string \| undefined` | JSON **字符串**，不是对象！需要 `JSON.parse()` 才能使用。这是后端的设计——`dataJson` 存储任意结构化数据，无法用固定 TypeScript 类型表达 |
| `sentAt?` | `string \| undefined` | ISO 8601 格式字符串，如 `"2025-06-08T10:30:00Z"` |
| `creationTime` | `string` | **必填**，所有通知都有创建时间 |

### 6.5 发送通知请求/结果

```typescript
export interface SendNotificationRequest {
  templateCode: string
  recipientUserIds: string[]
  model?: Record<string, unknown>
  tenantId?: string
  channels?: string[]
  dataJson?: string
  priority?: NotificationPriority
}

export interface SendNotificationResult {
  totalAttempts: number
  successCount: number
  failureCount: number
  skippedCount: number
}
```

逐行精讲：

| 标记 | 代码 | 解读 |
|------|------|------|
| **【设计取舍】** | `recipientUserIds: string[]` | 收件人用 ID 数组而非用户名/邮箱。因为 ID 是唯一标识，用户名可能重复（不同租户下） |
| **【易错点】** | `model?: Record<string, unknown>` | 模板变量是**动态结构**。后端用 Scriban 模板引擎渲染，`{{ model.UserName }}` 对应前端传 `{ "UserName": "张三" }`。`Record<string, unknown>` 表示"键是 string，值可以是任何类型" |
| **【设计取舍】** | `channels?: string[]` | 可选！如果不指定，后端使用模板默认渠道。如果指定，只发指定渠道 |

### 6.6 模板相关类型

```typescript
export interface TemplateListDto {
  id: string
  code: string
  name: string
  description?: string
  isEnabled: boolean
  creationTime: string
}

export interface TemplateDetailDto extends TemplateListDto {
  inAppTitleTemplate?: string
  inAppBodyTemplate?: string
  emailSubjectTemplate?: string
  emailBodyTemplate?: string
  smsTemplate?: string
  weChatTemplateId?: string
  weChatDataTemplate?: string
  mobilePushTitleTemplate?: string
  mobilePushBodyTemplate?: string
}

export interface CreateTemplateRequest {
  code: string
  name: string
  description?: string
  tenantId?: string
  isEnabled?: boolean
  inAppTitleTemplate?: string
  inAppBodyTemplate?: string
  emailSubjectTemplate?: string
  emailBodyTemplate?: string
  smsTemplate?: string
  weChatTemplateId?: string
  weChatDataTemplate?: string
  mobilePushTitleTemplate?: string
  mobilePushBodyTemplate?: string
}

export interface UpdateTemplateRequest {
  isEnabled?: boolean
  inAppTitleTemplate?: string
  inAppBodyTemplate?: string
  emailSubjectTemplate?: string
  emailBodyTemplate?: string
  smsTemplate?: string
  weChatTemplateId?: string
  weChatDataTemplate?: string
  mobilePushTitleTemplate?: string
  mobilePushBodyTemplate?: string
}
```

⚠️ **【易错点】CreateRequest 和 UpdateRequest 的区别**：
- `CreateTemplateRequest` 有 `code`、`name`（必填）— 创建时必须指定
- `UpdateTemplateRequest` **没有** `code`、`name` — 编码和名称创建后不可修改

这是后端的设计决策：模板编码是业务标识，修改编码会导致关联的通知找不到模板。

### 6.7 偏好相关类型

```typescript
export interface PreferenceDto {
  id: string
  channel: NotificationChannel
  isEnabled: boolean
  templateCode?: string
}

export interface UpdatePreferenceRequest {
  channel: NotificationChannel
  isEnabled: boolean
  templateCode?: string
}
```

逐行精讲：

| 字段 | 解读 |
|------|------|
| `templateCode?` | **可选**。为空表示"全局偏好"（该渠道所有通知），有值表示"模板级偏好"（仅对该模板生效）。前端当前只使用全局偏好 |

---

## 七、前后端类型映射对照表

```
┌──────────────────────┬────────────────────────────────────────┐
│ 后端 C#              │ 前端 TypeScript                        │
├──────────────────────┼────────────────────────────────────────┤
│ enum NotificationChannel │ const NotificationChannel = {...}   │
│ [JsonStringEnumConverter]│ as const + type extraction          │
│   InApp = 0          │   InApp: "inApp"                       │
│   Email = 1          │   Email: "email"                       │
├──────────────────────┼────────────────────────────────────────┤
│ class NotificationDto│ interface NotificationDto              │
│   string? Title      │   title?: string                       │
│   string? DataJson   │   dataJson?: string                    │
│   DateTime CreationTime│ creationTime: string  (ISO 8601)    │
├──────────────────────┼────────────────────────────────────────┤
│ class PagedResult<T> │ type PagedResult<T>                    │
│   IReadOnlyList<T>   │   items: T[]                           │
│   int TotalCount     │   totalCount: number                   │
└──────────────────────┴────────────────────────────────────────┘
```

⚠️ **【易错点】DateTime vs string**
后端 C# 的 `DateTime` 序列化后是 ISO 8601 字符串（`"2025-06-08T10:30:00Z"`）。前端不要用 `Date` 类型接收，因为 JSON.parse 不会自动转 Date。用 `string` 接收，需要时 `new Date(str)` 转换。

---

## 踩坑提醒

1. **后端 `DateTime` 序列化后是 ISO 8601 字符串**：前端不要用 `Date` 类型接收，因为 JSON.parse 不会自动转 Date。用 `string` 接收，需要时 `new Date(str)` 转换
2. **`dataJson` 是字符串不是对象**：后端存储的是 JSON 字符串，前端使用时必须 `JSON.parse()`，不能直接当对象用
3. **所有通知 API 的 baseURL 是 `/notify-api`**：不是 `/gw-api`，代理配置和请求前缀必须一致，否则 404
4. **批量更新偏好用 `UpdatePreferenceRequest[]`**：不是逐条更新，而是一次性提交所有变更，减少网络请求

---

## 验证步骤

在继续下一节之前，确认以下内容已经正确实现：

1. 打开 DevTools → Network，刷新页面，筛选 XHR 请求，找到以 `/notify-api/` 开头的请求（预期：所有通知 API 的 baseURL 都是 `/notify-api`）
2. 在 Console 中执行 `import { getUnreadCount } from "@/api/notify/notifications"` 然后调用 `getUnreadCount()`，观察返回数据结构（预期：`{ success: true, data: { unreadCount: N } }`）
3. 在 Console 中执行 `import { getPreferences } from "@/api/notify/preferences"` 然后调用 `getPreferences()`，观察返回数据（预期：`PreferenceDto[]` 数组，每项包含 `channel`、`isEnabled` 字段）
4. 在 Network 面板中点击任意 `/notify-api` 请求，检查 Request Headers（预期：包含 `Authorization: Bearer xxx` 和 `X-Tenant-Id` header）

---

## 自测题

### 概念级（理解 Why）1. 为什么 `NotificationChannel` 用 `const` 对象 + `as const` 而不是 TypeScript `enum`？
2. `TemplateListDto` 和 `TemplateDetailDto` 为什么要分成两个类型？

### 推理级（推导 What-if）

3. 如果后端把 `NotificationStatus.Sent` 改名为 `NotificationStatus.Unread`，前端需要改哪些文件？
4. `dataJson` 为什么是 `string` 而不是 `Record<string, unknown>`？如果改成对象类型有什么好处和坏处？

### 动手级（代码实践）

5. 给 `notifications.ts` 添加一个 `deleteNotification(id: string)` 函数，使用 `del` 方法，路径为 `/api/notifications/{id}`。
6. 在 `notification.ts` 中添加一个新的枚举 `NotificationType`（如 `System`、`Business`、`PrintJob`），并确保和后端 `CamelCase` 序列化一致。

---

## 输出检查清单

- [ ] 理解 `createHttp("/notify-api")` 的作用和 Vite 代理的关系
- [ ] 能说出 API 函数的命名规律（get/mark/send + 名词）
- [ ] 理解 `const` 对象 + `as const` 枚举模式及其与 TypeScript `enum` 的区别
- [ ] 知道 `dataJson` 是字符串需要 `JSON.parse()`，以及为什么这么设计
- [ ] 理解 `TemplateListDto` 和 `TemplateDetailDto` 的继承关系
- [ ] 掌握前后端类型映射的核心规则（枚举 → const 对象，DateTime → string）
- [ ] 理解批量更新偏好（`UpdatePreferenceRequest[]`）的设计原因

---

[← 上一篇](02-SignalR封装.md) | [下一篇 →](04-通知铃铛.md)
