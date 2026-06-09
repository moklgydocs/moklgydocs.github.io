# 02 - SignalR 封装与通知 Store：连接管理与消息处理

> **这一步解决什么问题？**
> 上一节我们理解了 SignalR 的通信基础，但 `signalr.ts` 只是"管道"——谁负责打开管道？谁负责处理从管道里流出来的消息？这就是 `notification-store.ts` 要做的事。
>
> **ASP.NET Core 类比**：`signalr.ts` 相当于你的 `AddSignalR()` + `MapHub()`，而 `notification-store.ts` 相当于你的 **Hub 业务逻辑**——处理 `OnConnectedAsync`、`OnDisconnectedAsync`，以及消息到达时的业务处理。

---

## 前置知识

- 第 1 节的 SignalR 基础（HubConnection、断线重连、accessTokenFactory）
- Zustand 的 `create` + `set`/`get` 用法（含函数式 set）
- ASP.NET Core Hub 的生命周期（`OnConnectedAsync`/`OnDisconnectedAsync`）
- React `useEffect` 的 cleanup 机制
- `URL.createObjectURL` / `revokeObjectURL` 的基本概念

---

## 一、两文件的职责分工

```
┌─────────────────────────────────────────────────────────────────┐
│ signalr.ts (196行) — 通信基础设施                                │
│ ┌───────────────┐ ┌──────────────┐ ┌──────────────────────────┐│
│ │startConnection │ │platformHub   │ │onConnectionStateChange  ││
│ │stopConnection  │ │ on/off/invoke│ │(连接状态订阅)             ││
│ └───────────────┘ └──────────────┘ └──────────────────────────┘│
│ 职责：连接生命周期、Token 注入、重连策略、状态通知                  │
│ 不关心：业务逻辑（收到通知后做什么）                                │
├─────────────────────────────────────────────────────────────────┤
│ notification-store.ts (210行) — 通知业务状态                      │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐│
│ │fetchUnreadCount│ │onNewNotification│ │initSignalR / disposeSignalR││
│ │fetchRecent    │ │markRead      │ │(注册/移除 Hub 事件监听)   ││
│ │markAllRead    │ │              │ │                          ││
│ └──────────────┘ └──────────────┘ └──────────────────────────┘│
│ 职责：未读计数、通知列表、标记已读、SignalR 事件处理                │
│ 不关心：WebSocket 连接的建立与维护                                 │
└─────────────────────────────────────────────────────────────────┘
```

⚠️ **【设计取舍】为什么要拆成两个文件？**
单一职责原则。`signalr.ts` 是通用基础设施，理论上可以被聊天、协作编辑等模块复用；`notification-store.ts` 只管通知业务。如果通知逻辑变了，不需要动通信层。

---

## 二、signalr.ts 完整代码精读

### 2.1 模块级变量与类型

```typescript
import * as signalR from "@microsoft/signalr"
import { useAuthStore } from "@/stores/auth-store"

/** Hub 端点路径（通过 Vite proxy 转发到 NotificationCenter 服务） */
const HUB_URL = "/hubs/platform"

/** 断线重连延迟策略（毫秒）。重试 5 次后放弃，需手动重连。 */
const RECONNECT_DELAYS = [0, 2000, 5000, 10000, 30000]

/** 全局唯一的 Hub 连接实例 */
let connection: signalR.HubConnection | null = null

/** 连接状态变更监听器类型 */
type ConnectionStateListener = (state: "connected" | "disconnected" | "reconnecting") => void
/** 连接状态变更监听器列表 */
const stateListeners: ConnectionStateListener[] = []
```

逐行精讲：

| 标记 | 代码 | 解读 |
|------|------|------|
| **【易错点】** | `let connection: signalR.HubConnection \| null = null` | 用 `let` 而非 `const`，因为 `stopConnection()` 会将其设为 `null`。这是**单例模式**的变体——延迟创建、可销毁重建 |
| **【设计取舍】** | `stateListeners: ConnectionStateListener[]` | 为什么不用 EventEmitter？因为这个文件是 lib 层，不依赖任何 UI 框架。数组 + 手动遍历是最轻量的方案 |

### 2.2 连接创建与事件绑定

```typescript
function getOrCreateConnection(): signalR.HubConnection {
  if (connection) return connection

  connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => {
        const { accessToken } = useAuthStore.getState()
        return accessToken ?? ""
      },
    })
    .withAutomaticReconnect(RECONNECT_DELAYS)
    .configureLogging(signalR.LogLevel.Warning)
    .build()

  connection.onreconnecting((_error) => {
    console.warn("[SignalR] 正在重连...")
    notifyStateListeners("reconnecting")
  })

  connection.onreconnected((_connectionId) => {
    console.info("[SignalR] 重连成功")
    notifyStateListeners("connected")
  })

  connection.onclose((_error) => {
    console.info("[SignalR] 连接已关闭")
    notifyStateListeners("disconnected")
  })

  return connection
}
```

> **🤔 导师提问**：`accessTokenFactory` 为什么要写成函数而不是直接传 Token 字符串？想想 ASP.NET Core 里 `HttpClient` 的 Bearer Token 如果硬编码，Token 刷新后会怎样？

> **🤔 导师提问**：`withAutomaticReconnect(RECONNECT_DELAYS)` 指定了 5 次重试延迟。5 次用完后 SignalR 不会自动重连了——此时用户需要手动操作。在 ASP.NET Core 的 `IHubContext` 里，你会怎么处理"重连耗尽"的场景？前端又该如何让用户感知到连接已断开？

💡 **【设计取舍】为什么事件绑定放在 `getOrCreateConnection` 里？**
因为这些事件是连接本身的属性，应该和连接实例一起创建。如果放在外面，每次调用 `startConnection` 都会重复绑定。`getOrCreateConnection` 的 "Create Once" 语义保证了事件只绑定一次。

逐行精讲：

| 标记 | 代码 | 解读 |
|------|------|------|
| **【易错点】** | `accessTokenFactory: () => useAuthStore.getState().accessToken` | 不用 `useAuthStore(state => state.accessToken)`，因为那是个 React Hook 写法，这里在非组件上下文中。`getState()` 是 Zustand 的**非 React**用法 |
| **【性能陷阱】** | `LogLevel.Warning` | 开发时用 `LogLevel.Information` 便于调试，但生产环境应设 Warning，否则每个心跳都会打印日志 |
| **【易错点】** | `accessTokenFactory` 是函数而非固定值 | Token 会过期刷新！如果写成 `accessToken: "xxx"`，刷新后的新 Token 不会被使用。写成 `factory` 函数，SignalR 每次建立/重建连接时都会调用它获取最新 Token |

### 2.3 startConnection / stopConnection

```typescript
export async function startConnection(): Promise<void> {
  const conn = getOrCreateConnection()

  if (conn.state === signalR.HubConnectionState.Connected) {
    return
  }

  if (conn.state === signalR.HubConnectionState.Disconnected) {
    try {
      await conn.start()
      console.info("[SignalR] 连接成功")
      notifyStateListeners("connected")
    } catch (err) {
      console.error("[SignalR] 连接失败:", err)
      notifyStateListeners("disconnected")
    }
  }
}

export async function stopConnection(): Promise<void> {
  if (connection) {
    try {
      await connection.stop()
    } catch (err) {
      console.error("[SignalR] 断开失败:", err)
    }
    connection = null
  }
}
```

逐行精讲：

| 标记 | 代码 | 解读 |
|------|------|------|
| **【易错点】** | `if (conn.state === Connected) return` | 必须检查状态！重复调用 `start()` 会抛异常 `Cannot start a connection that is not in the Disconnected state` |
| **【设计取舍】** | `if (conn.state === Disconnected)` | 不在 Connecting/Reconnecting 状态下调用 start()，因为这两种状态 SignalR 内部正在处理，强行介入会冲突 |
| **【易错点】** | `connection = null` | stop 后必须清空！否则下次 `getOrCreateConnection()` 会复用已停止的连接，导致 `start()` 抛异常 |

💡 **ASP.NET Core 类比**：
- `startConnection()` ≈ `app.MapHub<PlatformHub>("/hubs/platform")` —— 注册 Hub 端点
- `stopConnection()` ≈ 应用关闭时断开所有连接

> **🤔 导师提问**：`stopConnection` 中 `connection = null` 这一行如果删掉，下次调用 `startConnection` 会发生什么？类比 ASP.NET Core 中 `IDisposable.Dispose()` 后继续使用对象会怎样？

### 2.4 platformHub 代理对象

```typescript
export const platformHub = {
  on: (method: string, callback: (...args: unknown[]) => void) => {
    getOrCreateConnection().on(method, callback)
  },

  off: (method: string, callback: (...args: unknown[]) => void) => {
    getOrCreateConnection().off(method, callback)
  },

  invoke: async (method: string, ...args: unknown[]): Promise<void> => {
    const conn = getOrCreateConnection()
    if (conn.state === signalR.HubConnectionState.Connected) {
      await conn.invoke(method, ...args)
    } else {
      console.warn(`[SignalR] 未连接，跳过调用 ${method}`)
    }
  },

  get state(): signalR.HubConnectionState {
    return connection?.state ?? signalR.HubConnectionState.Disconnected
  },
}
```

⚠️ **【易错点】`on` 和 `off` 必须传入同一个回调引用！**

> **🤔 导师提问**：`platformHub.on("ReceiveNotification", handler)` 注册监听后，如果组件卸载时没有调用 `platformHub.off`，会出现什么问题？这和 C# 中事件订阅忘记 `-=` 导致内存泄漏是同一个道理——你能说出具体的影响链路吗？

```typescript
// ❌ 错误：off 无法移除 on 注册的回调（两个箭头函数是不同的引用）
platformHub.on("ReceiveNotification", (data) => { /* ... */ })
platformHub.off("ReceiveNotification", (data) => { /* ... */ })

// ✅ 正确：保存引用，用同一个引用 on 和 off
const handler = (data: unknown) => { /* ... */ }
platformHub.on("ReceiveNotification", handler)
platformHub.off("ReceiveNotification", handler)
```

⚠️ **【设计取舍】invoke 为什么在未连接时静默跳过？**
因为通知推送的语义是"通知你来拿消息"，而不是"你必须回复"。如果断线时 invoke 抛异常，会导致 UI 闪红色错误。静默跳过 + 轮询兜底是更稳健的策略。

💡 **【设计取舍】为什么用代理对象而不是直接导出 connection？**
封装！`platformHub` 对外只暴露 3 个操作（on/off/invoke）和 1 个状态（state），隐藏了连接创建的细节。调用者不需要知道 `getOrCreateConnection()` 的存在。

### 2.5 连接状态订阅机制

```typescript
export function onConnectionStateChange(listener: ConnectionStateListener): () => void {
  stateListeners.push(listener)
  return () => {
    const index = stateListeners.indexOf(listener)
    if (index >= 0) stateListeners.splice(index, 1)
  }
}

function notifyStateListeners(state: "connected" | "disconnected" | "reconnecting") {
  stateListeners.forEach((listener) => listener(state))
}
```

💡 **这个设计模式和 ASP.NET Core 的 `IObserver<T>` 异曲同工**：
- `onConnectionStateChange` ≈ `Subscribe(observer)`
- 返回的函数 ≈ `IDisposable.Dispose()`（取消订阅）
- `notifyStateListeners` ≈ `OnNext(state)`

⚠️ **【性能陷阱】** 返回的取消订阅函数务必在组件卸载时调用，否则监听器数组会持续增长，造成内存泄漏。

---

## 三、notification-store.ts 完整代码精读

### 3.1 模块级辅助函数

```typescript
import { create } from "zustand"
import { toast } from "sonner"
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "@/api/notify/notifications"
import { jobsApi } from "@/api/print/jobs"
import { platformHub, startConnection } from "@/lib/signalr"
import { NotificationChannel, NotificationStatus, NotificationPriority } from "@/types/notification"
import type { NotificationDto } from "@/types/notification"

// ── SignalR handler 引用（用于正确 off 移除）──
let _handlerRef: ((...args: unknown[]) => void) | null = null

/** 通过 jobId 下载异步渲染结果（带 Authorization header） */
async function downloadJob(jobId: string) {
  try {
    const res = await jobsApi.download(jobId)
    const rawBlob = res.data as BlobPart
    const blob = new Blob([rawBlob])
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `report_${jobId.slice(0, 8)}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    toast.error("下载失败")
  }
}
```

逐行精讲：

| 标记 | 代码 | 解读 |
|------|------|------|
| **【易错点】** | `let _handlerRef` | 模块级变量保存回调引用，因为 `on/off` 必须用同一引用。放在模块级而非 store 内部，是因为 Zustand 的 `create` 回调里每次调用都会创建新闭包 |
| **【性能陷阱】** | `URL.revokeObjectURL(url)` | 必须在 `a.click()` 之后调用！如果不 revoke，Blob URL 会一直占内存。但如果在 click 之前 revoke，下载会失败（文件已被回收） |
| **【设计取舍】** | `a.download = \`report_${jobId.slice(0, 8)}.pdf\`` | 截取前 8 位作为文件名，因为完整 UUID 太长。这是用户体验和可读性的平衡 |

### 3.2 Store 接口定义

```typescript
interface NotificationState {
  /** 未读通知数 */
  unreadCount: number
  /** 最近通知列表（通知铃铛下拉用） */
  recentItems: NotificationDto[]
  /** 是否正在加载 */
  loading: boolean

  /** 拉取未读计数 */
  fetchUnreadCount: () => Promise<void>
  /** 拉取最近通知 */
  fetchRecent: () => Promise<void>
  /** 标记单条已读 */
  markRead: (id: string) => Promise<void>
  /** 全部标记已读 */
  markAllRead: () => Promise<void>
  /** 通过 SignalR 收到新通知时调用 */
  onNewNotification: (notification: NotificationDto) => void
  /** 初始化 SignalR 监听 */
  initSignalR: () => void
  /** 清除 SignalR 监听 */
  disposeSignalR: () => void
}
```

💡 **接口设计原则**：状态（`unreadCount`、`recentItems`、`loading`）在前，操作在后。操作分为两类：
- **数据操作**：`fetchUnreadCount`、`fetchRecent`、`markRead`、`markAllRead` — 都是 HTTP API 调用
- **SignalR 操作**：`onNewNotification`、`initSignalR`、`disposeSignalR` — 都是实时通信相关

### 3.3 Store 实现核心

```typescript
export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  recentItems: [],
  loading: false,

  fetchUnreadCount: async () => {
    try {
      const res = await getUnreadCount()
      if (res?.data) {
        set({ unreadCount: res.data.unreadCount })
      }
    } catch {
      // 静默失败
    }
  },

  fetchRecent: async () => {
    set({ loading: true })
    try {
      const res = await getNotifications({ page: 1, pageSize: 10 })
      if (res?.data) {
        set({ recentItems: res.data.items })
      }
    } catch {
      // 静默失败
    } finally {
      set({ loading: false })
    }
  },
```

逐行精讲：

| 标记 | 代码 | 解读 |
|------|------|------|
| **【设计取舍】** | `catch { // 静默失败 }` | 通知计数和列表加载失败不应该打断用户操作。这和表单提交不同——表单提交失败必须告知用户，但后台数据同步失败应该静默 |
| **【性能陷阱】** | `pageSize: 10` | 铃铛下拉只展示 10 条，不要拉全量！通知可能有几千条 |

### 3.4 乐观更新：标记已读

```typescript
  markRead: async (id: string) => {
    await markAsRead(id)
    set((state) => ({
      unreadCount: Math.max(0, state.unreadCount - 1),
      recentItems: state.recentItems.map((item) =>
        item.id === id ? { ...item, status: NotificationStatus.Read, readAt: new Date().toISOString() } : item
      ),
    }))
  },

  markAllRead: async () => {
    await markAllAsRead()
    set((state) => ({
      unreadCount: 0,
      recentItems: state.recentItems.map((item) => ({
        ...item,
        status: NotificationStatus.Read,
        readAt: new Date().toISOString(),
      })),
    }))
  },
```

⚠️ **【易错点】什么是乐观更新？**
先更新本地状态，再等服务端响应。用户看到的是"瞬间已读"，而不是等 HTTP 请求返回后才变化。

```
普通更新：  用户点击 → 发HTTP → 等待 → 服务端确认 → 更新UI   （用户感知延迟）
乐观更新：  用户点击 → 立即更新UI → 发HTTP → 服务端确认      （用户感知瞬间）
                                                   ↓
                                            如果失败呢？→ 回滚状态
```

💡 **当前代码的隐含风险**：如果 `markAsRead` API 失败了，本地状态已经被更新了，但服务端没有。当前代码没有回滚逻辑。这是**设计取舍**——标记已读失败的后果很轻（下次刷新会恢复），不值得加回滚的复杂度。

⚠️ **【易错点】`Math.max(0, state.unreadCount - 1)`**：
为什么用 `Math.max`？如果用户快速双击通知，`markRead` 可能被调用两次，`unreadCount` 可能变成 -1。`Math.max(0, ...)` 是防御性编程。

### 3.5 SignalR 消息处理核心

```typescript
  initSignalR: () => {
    if (_handlerRef) return

    startConnection()

    const handler = (message: unknown) => {
      const msg = message as {
        type: string
        title?: string
        body?: string
        payload?: { recordId?: string; dataJson?: string }
      }
      if (msg.type === "notification") {
        const notification: NotificationDto = {
          id: msg.payload?.recordId ?? crypto.randomUUID(),
          templateCode: "",
          channel: NotificationChannel.InApp,
          status: NotificationStatus.Sent,
          priority: NotificationPriority.Normal,
          title: msg.title,
          body: msg.body,
          dataJson: msg.payload?.dataJson,
          creationTime: new Date().toISOString(),
        }
        get().onNewNotification(notification)

        if (notification.dataJson) {
          try {
            const data = JSON.parse(notification.dataJson)
            if (data.status === "completed" && data.jobId) {
              toast.success(notification.title ?? "渲染完成", {
                description: notification.body,
                action: {
                  label: "下载",
                  onClick: () => downloadJob(data.jobId),
                },
                duration: 10000,
              })
            } else if (data.status === "failed") {
              toast.error(notification.title ?? "渲染失败", {
                description: notification.body,
                duration: 10000,
              })
            }
          } catch {
            // dataJson 不是合法 JSON，忽略
          }
        }
      }
    }

    _handlerRef = handler
    platformHub.on("ReceiveNotification", handler)
  },

  disposeSignalR: () => {
    if (_handlerRef) {
      platformHub.off("ReceiveNotification", _handlerRef)
      _handlerRef = null
    }
  },
```

这是整个通知中心最核心的代码段！逐行精讲：

| 标记 | 代码 | 解读 |
|------|------|------|
| **【易错点】** | `if (_handlerRef) return` | 防止重复注册！React 18 strict mode 下 `useEffect` 会执行两次，不加这个会导致同一条消息被处理两次 |
| **【设计取舍】** | `msg.payload?.recordId ?? crypto.randomUUID()` | 后端可能不返回 recordId，此时用 `crypto.randomUUID()` 生成临时 ID。这不是理想方案（和服务端 ID 不一致），但避免了 `undefined` 导致的 key 重复 |
| **【易错点】** | `notification.dataJson` 的 JSON.parse | `dataJson` 是字符串形式的 JSON，必须 parse 才能用。但 parse 可能抛异常（格式错误），所以必须 try-catch |
| **【设计取舍】** | `toast.success` 的 `action` 按钮 | 通知到达时，不只是显示文字，还提供"下载"按钮。这是**可操作通知**的设计——用户无需离开当前页面就能执行操作 |
| **【性能陷阱】** | `duration: 10000` | 默认 toast 4 秒消失，但打印完成通知用户可能需要时间看到并点击下载，所以延长到 10 秒 |

### 3.6 onNewNotification

```typescript
  onNewNotification: (notification: NotificationDto) => {
    set((state) => ({
      unreadCount: state.unreadCount + 1,
      recentItems: [notification, ...state.recentItems].slice(0, 10),
    }))
  },
```

⚠️ **【易错点】`[notification, ...state.recentItems].slice(0, 10)`**
- 新通知插入**开头**（最新的在最前）
- `slice(0, 10)` 保持列表不超过 10 条
- 如果不截断，长时间在线的用户 `recentItems` 会越来越大

---

## 四、SignalR 消息处理流程图

```
后端 Hub                          signalr.ts                    notification-store.ts
─────────                         ──────────                    ─────────────────────
Clients.User(userId)
  .SendAsync("ReceiveNotification",
    { type:"notification",         │
      title:"渲染完成",              │
      body:"报表已生成",             │
      payload:{ recordId,           │
        dataJson: "{"status":"completed","jobId":"xxx"}"
      }                            │
  })                               │
                        WebSocket ──┤
                                   │ connection.on("ReceiveNotification", handler)
                                   │
                                   │                    handler(msg) {
                                   │                      msg.type === "notification" ?
                                   │                      ├─ Yes → 构建 NotificationDto
                                   │                      │         get().onNewNotification(dto)
                                   │                      │         dto.dataJson?
                                   │                      │         ├─ JSON.parse(dataJson)
                                   │                      │         │  ├─ status==="completed" → toast.success("下载")
                                   │                      │         │  └─ status==="failed" → toast.error()
                                   │                      │         └─ catch → 忽略
                                   │                      └─ No → 忽略
                                   │                    }
```

---

## 五、initSignalR / disposeSignalR 的生命周期

```
组件挂载                        组件卸载
   │                              │
   ▼                              ▼
initSignalR()               disposeSignalR()
   │                              │
   ├─ if (_handlerRef) return    ├─ platformHub.off("ReceiveNotification", _handlerRef)
   │  (防止重复注册)              │  (用同一引用移除监听)
   │                              │
   ├─ startConnection()          └─ _handlerRef = null
   │  (启动 WebSocket 连接)          (清空引用，允许下次重新注册)
   │
   ├─ const handler = (msg) => { ... }
   │
   ├─ _handlerRef = handler
   │  (保存引用，供 off 使用)
   │
   └─ platformHub.on("ReceiveNotification", handler)
      (注册监听)
```

⚠️ **【易错点】为什么不用 React 的 cleanup 机制自动 off？**
因为 Zustand store 不是 React 组件，没有 `useEffect` 的 cleanup。`initSignalR` 和 `disposeSignalR` 是**手动生命周期管理**，需要调用者在 `useEffect` 的 cleanup 中显式调用。

> **🤔 导师提问**：`initSignalR` / `disposeSignalR` 是手动生命周期管理。在 ASP.NET Core 中，Hub 的 `OnConnectedAsync` / `OnDisconnectedAsync` 由框架自动调用。前端的 Zustand store 为什么不能享受同样的"自动生命周期"？如果让你设计一个自动管理 SignalR 生命周期的 React Hook，你会怎么写？

---

## 六、连接状态流转图

```
                    startConnection()
  Disconnected ─────────────────────→ Connected
       ↑                                 │  │
       │                          onclose()  onreconnecting()
       │                                 │  │
       │                                 ↓  ↓
       └────────────────────────── Disconnected  Reconnecting
                                         ↑          │
                                         │   onreconnected()
                                         │          │
                                         └──────────↓
                                               Connected
```

💡 **ASP.NET Core 类比**：这和后端的 `IHubContext` 生命周期类似，但后端由 DI 容器管理，前端需要我们手动管理连接的启动和停止。

---

## 踩坑提醒

1. **`_handlerRef` 必须放在模块级**：如果放在 store 的 state 里，每次 state 更新都会导致引用变化，`off` 无法移除 `on` 注册的回调，造成监听器泄漏
2. **`markRead` 的乐观更新没有回滚逻辑**：如果 API 调用失败，前端 `unreadCount` 已经减 1 但后端没有真正标记已读，会导致前后端不一致
3. **`dataJson` 的解析必须 try-catch**：后端推送的 `data` 字段可能是无效 JSON，直接 `JSON.parse` 会抛异常导致整个 `onNewNotification` 回调崩溃
4. **`URL.createObjectURL` 必须在 `a.click()` 之后 `revokeObjectURL`**：反过来会导致 Object URL 在下载使用前就被释放，下载失败

---

## 验证步骤

在继续下一节之前，确认以下内容已经正确实现：

1. 打开浏览器 DevTools → Network → 筛选 WS，登录后应看到到 `/hubs/platform` 的 WebSocket 连接，状态码 101（预期：连接成功建立）
2. 在 Console 中执行 `useNotificationStore.getState().fetchUnreadCount()`，观察返回值中 `unreadCount` 字段（预期：返回当前用户的未读数）
3. 在 Console 中执行 `useNotificationStore.getState().initSignalR()`，然后在 DevTools → Network → WS 中观察是否收到 `ReceiveNotification` 类型的消息帧
4. 断开网络（DevTools → Network → Offline），等待 5-10 秒，Console 应出现 `[SignalR] 正在重连...`；恢复网络后应出现 `[SignalR] 重连成功`（预期：自动重连机制生效）
5. 在 Console 中执行 `useNotificationStore.getState().disposeSignalR()`，观察 WS 连接是否关闭（预期：连接断开，不再收到推送）

---

## 自测题

### 概念级（理解 Why）

1. 为什么 `_handlerRef` 放在模块级而不是 store 的 state 里？
2. `downloadJob` 函数中 `a.click()` 之后才 `URL.revokeObjectURL(url)`，如果反过来会怎样？

### 推理级（推导 What-if）

3. 如果用户同时打开了两个浏览器 Tab，两个 Tab 都会收到 SignalR 推送。`unreadCount` 会双倍吗？怎么解决？
4. 当前 `markRead` 的乐观更新没有回滚逻辑。假设网络断开时用户标记已读，然后恢复网络，会出现什么不一致？如何修复？

### 动手级（代码实践）

5. 给 `initSignalR` 添加重连后自动重新注册 handler 的逻辑。提示：利用 `onConnectionStateChange` 监听 `connected` 状态。
6. 在 `onNewNotification` 中添加去重逻辑：如果 `recentItems` 中已存在相同 ID 的通知，不重复插入。

---

## 输出检查清单

- [ ] 能说出 signalr.ts 和 notification-store.ts 的职责边界
- [ ] 理解 `_handlerRef` 模块级变量的作用和必要性
- [ ] 掌握乐观更新的概念，以及 `Math.max(0, ...)` 的防御性编程
- [ ] 理解 `initSignalR` / `disposeSignalR` 的完整生命周期
- [ ] 能解释 SignalR 消息从后端到 toast 的完整处理链路
- [ ] 知道 `dataJson` 的解析为什么要 try-catch
- [ ] 能解释 `URL.createObjectURL` / `revokeObjectURL` 的内存管理
- [ ] 掌握 `accessTokenFactory` 必须是函数的原因
- [ ] 理解 `on/off` 必须使用同一回调引用的规则

---

[← 上一篇](01-实时通信基础.md) | [下一篇 →](03-通知API层.md)
