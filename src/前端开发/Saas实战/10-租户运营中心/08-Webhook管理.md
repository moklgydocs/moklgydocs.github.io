# Webhook 管理

> **这一步解决什么问题？**
> 当租户被暂停、配额被修改、模块被切换时，外部系统需要及时知道这些事件。Webhook 就是"事件推送"机制——平台主动通知订阅方，而不是让订阅方反复轮询。
>
> **ASP.NET Core 开发者的直觉**：Webhook 就是 MediatR 的 `INotification` 的外部版本。内部事件用 MediatR 在进程内传播，外部事件用 Webhook 跨系统传播。两者都是发布-订阅模式，只是传输通道不同。

---

## 一、Webhook API 层

### 1.1 完整 API 代码

```typescript
// src/api/ops/webhooks.ts
import { get, post, del } from "./http"
import type { WebhookEndpointDto, CreateWebhookEndpointRequest } from "@/types"

export const webhooksApi = {
  getEndpoints: (tenantId?: string, appId?: string) =>
    get<WebhookEndpointDto[]>("/api/tenant-ops/webhooks/endpoints", { tenantId, appId } as Record<string, unknown>),
  createEndpoint: (data: CreateWebhookEndpointRequest) => post<WebhookEndpointDto>("/api/tenant-ops/webhooks/endpoints", data),
  deleteEndpoint: (id: string) => del<void>(`/api/tenant-ops/webhooks/endpoints/${id}`),
  getDeliveries: (endpointId?: string, page?: number, pageSize?: number) =>
    get<unknown[]>("/api/tenant-ops/webhooks/deliveries", { endpointId, page, pageSize } as Record<string, unknown>),
}
```

### 1.2 4 个方法解读

| 方法 | HTTP | 路径 | 说明 |
|------|------|------|------|
| `getEndpoints` | GET | `/api/tenant-ops/webhooks/endpoints` | 获取端点列表，可选按 tenantId/appId 过滤 |
| `createEndpoint` | POST | `/api/tenant-ops/webhooks/endpoints` | 创建新端点 |
| `deleteEndpoint` | DELETE | `/api/tenant-ops/webhooks/endpoints/{id}` | 删除端点 |
| `getDeliveries` | GET | `/api/tenant-ops/webhooks/deliveries` | 获取投递记录（含分页） |

【易错点】 `getEndpoints` 的参数 `tenantId` 和 `appId` 都是可选的——不传就返回所有端点，传了就按条件过滤。`as Record<string, unknown>` 是 TypeScript 的类型断言，因为 `get` 方法的 params 类型是 `Record<string, unknown>`，而可选参数的类型不匹配。

> **思考**：`getDeliveries` 返回的是 `unknown[]` 而不是具体类型，这意味着前端还没有定义投递记录的 DTO。在实际项目中，这应该定义为 `WebhookDeliveryDto[]`，包含投递状态、响应码、重试次数等字段。为什么这里是 `unknown[]`？可能是投递记录的结构还在迭代中，先用 `unknown` 占位。

---

## 二、Webhook 事件投递流程

一个 Webhook 事件从触发到投递的完整流程：

```
┌──────────┐     ┌──────────────┐     ┌───────────────────┐     ┌──────────────┐
│ 平台操作  │     │  后端服务     │     │  Webhook 投递服务  │     │ 订阅方服务   │
│          │     │              │     │                   │     │              │
│ 暂停租户  ├────►│ 发布领域事件  ├────►│ 1. 查找匹配端点    │     │              │
│ 修改配额  │     │              │     │ 2. 构造 Payload   │     │              │
│ 切换模块  │     │              │     │ 3. HMAC-SHA256    ├────►│ 接收 POST    │
│          │     │              │     │    签名           │     │ 验证签名     │
│          │     │              │     │ 4. HTTP POST      │     │ 处理事件     │
│          │     │              │     │    (超时 10s)      │     │ 返回 200     │
│          │     │              │     │ 5. 记录投递结果    │◄────┤              │
│          │     │              │     │ 6. 失败则重试      │     │              │
│          │     │              │     │    (最多 3 次)     │     │              │
└──────────┘     └──────────────┘     └───────────────────┘     └──────────────┘
```

**关键步骤说明**：
1. **匹配端点**：根据事件类型和租户 ID，找到所有订阅了该事件的 Webhook 端点
2. **构造 Payload**：包含事件类型、时间戳、租户信息、变更详情
3. **签名**：用端点的 `secret` 对 Payload 做 HMAC-SHA256 签名，放在 `X-Webhook-Signature` header 中
4. **HTTP POST**：将签名后的 Payload 发送到端点的 URL
5. **记录结果**：保存 HTTP 状态码、响应时间、失败原因
6. **失败重试**：如果返回非 2xx 或超时，按指数退避重试

---

## 三、事件类型

| 事件 | 触发时机 |
|------|---------|
| `tenant.created` | 新租户开通 |
| `tenant.suspended` | 租户被暂停 |
| `tenant.activated` | 租户被激活 |
| `tenant.terminated` | 租户被终止 |
| `edition.changed` | 租户版本变更 |
| `quota.updated` | 配额修改 |
| `module.toggled` | 模块启用/禁用 |
| `feature.changed` | 功能开关变更 |

> **后端类比**：事件类型就像 ASP.NET Core 的 `IEventPublisher` + MediatR 的 `INotification`——定义领域事件，Webhook 是事件的外部消费者。

---

## 四、端点列表页

### 4.1 完整源码

```tsx
// src/pages/ops/webhooks/index.tsx
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageToolbar, ToolbarButton } from "@/components/shared/page-toolbar"
import { AgTable, type AgColumn } from "@/components/shared/ag-table"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { CreateEndpointDialog } from "./create-endpoint-dialog"
import { webhooksApi } from "@/api/ops/webhooks"
import { toast } from "sonner"
import { Plus, RefreshCw, Trash } from "lucide-react"
import type { WebhookEndpointDto } from "@/types"

/**
 * Webhook 端点管理页面
 * 展示租户运营中心的 Webhook 端点列表，支持创建和删除端点。
 */
export default function WebhooksPage() {
  const [data, setData] = useState<WebhookEndpointDto[]>([])
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<WebhookEndpointDto | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  /** 获取 Webhook 端点列表 */
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await webhooksApi.getEndpoints()
      setData(res.data ?? [])
    } catch {
      toast.error("获取端点列表失败")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  /** 删除选中的端点 */
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await webhooksApi.deleteEndpoint(deleteTarget.id)
      toast.success("端点已删除")
      setDeleteOpen(false)
      fetchData()
    } catch {
      toast.error("删除失败")
    } finally {
      setDeleteLoading(false)
    }
  }

  /** 表格列定义 */
  const columns: AgColumn<WebhookEndpointDto>[] = [
    {
      field: "appId",
      headerName: "应用",
      minWidth: 120,
      flex: 1,
      cellRenderer: ({ data }) => <span className="text-sm">{data.appId ?? "—"}</span>,
    },
    {
      field: "url",
      headerName: "回调地址",
      minWidth: 200,
      flex: 2,
      cellRenderer: ({ data }) => (
        <span className="font-mono text-sm truncate block max-w-full" title={data.url}>
          {data.url}
        </span>
      ),
    },
    {
      field: "eventTypes",
      headerName: "事件类型",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "isPaused",
      headerName: "状态",
      width: 80,
      cellRenderer: ({ data }) => (
        <Badge variant={data.isPaused ? "destructive" : "default"}>
          {data.isPaused ? "暂停" : "运行"}
        </Badge>
      ),
    },
    {
      field: "__actions__",
      headerName: "操作",
      width: 80,
      pinned: "right",
      cellRenderer: ({ data: r }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={() => { setDeleteTarget(r); setDeleteOpen(true) }}
        >
          <Trash className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <PageToolbar
        title="Webhook 端点"
        actions={
          <>
            <ToolbarButton icon={Plus} variant="primary" onClick={() => setFormOpen(true)}>
              新建端点
            </ToolbarButton>
            <ToolbarButton icon={RefreshCw} onClick={fetchData}>
              刷新
            </ToolbarButton>
          </>
        }
      />

      <AgTable
        columns={columns}
        data={data}
        total={data.length}
        loading={loading}
        rowKey="id"
      />

      <CreateEndpointDialog open={formOpen} onOpenChange={setFormOpen} onSuccess={fetchData} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="删除端点"
        description={`确定要删除端点「${deleteTarget?.url}」吗？删除后将无法接收相关事件推送。`}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  )
}
```

### 4.2 列表页关键点

- **PageToolbar**：统一的页面工具栏，包含标题和操作按钮（新建、刷新）
- **AgTable**：基于 AG Grid 的表格组件，支持列宽自适应、固定列
- **ConfirmDialog**：删除前的确认对话框，防止误操作
- **删除后刷新**：`handleDelete` 成功后调用 `fetchData()` 刷新列表

【易错点】 删除端点后，平台不会再向该 URL 投递事件。但已经投递中的消息可能还在重试队列中——删除端点不会取消正在重试的投递。如果需要立即停止所有投递，应该先暂停端点（`isPaused = true`），等重试队列清空后再删除。

---

## 五、创建端点对话框

### 5.1 完整源码

```tsx
// src/pages/ops/webhooks/create-endpoint-dialog.tsx
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { webhooksApi } from "@/api/ops/webhooks"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface CreateEndpointDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

/**
 * 创建 Webhook 端点对话框
 * 填写回调地址、事件类型、密钥和自定义请求头等信息。
 */
export function CreateEndpointDialog({ open, onOpenChange, onSuccess }: CreateEndpointDialogProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    tenantId: "",
    appId: "",
    url: "",
    eventTypes: "",
    secret: "",
    customHeaders: "",
  })

  // 对话框打开时重置表单
  useEffect(() => {
    if (open) {
      setForm({
        tenantId: "",
        appId: "",
        url: "",
        eventTypes: "",
        secret: "",
        customHeaders: "",
      })
    }
  }, [open])

  /** 提交表单，创建端点 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.url || !form.eventTypes) {
      toast.error("回调地址和事件类型不能为空")
      return
    }

    // 解析自定义请求头 JSON
    let customHeaders: Record<string, string> | undefined
    if (form.customHeaders.trim()) {
      try {
        customHeaders = JSON.parse(form.customHeaders)
      } catch {
        toast.error("自定义请求头格式错误，请输入有效的 JSON")
        return
      }
    }

    setLoading(true)
    try {
      await webhooksApi.createEndpoint({
        tenantId: form.tenantId || undefined,
        appId: form.appId || undefined,
        url: form.url,
        eventTypes: form.eventTypes,
        secret: form.secret || undefined,
        customHeaders,
      })
      toast.success("端点已创建")
      onSuccess()
      onOpenChange(false)
    } catch {
      toast.error("创建失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>新建 Webhook 端点</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenantId">租户ID</Label>
              <Input
                id="tenantId"
                placeholder="留空表示全局"
                value={form.tenantId}
                onChange={(e) => setForm({ ...form, tenantId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appId">应用ID</Label>
              <Input
                id="appId"
                placeholder="留空表示全局"
                value={form.appId}
                onChange={(e) => setForm({ ...form, appId: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">回调地址 *</Label>
            <Input
              id="url"
              placeholder="https://example.com/webhook"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventTypes">事件类型 *</Label>
            <Input
              id="eventTypes"
              placeholder="tenant.created,tenant.updated"
              value={form.eventTypes}
              onChange={(e) => setForm({ ...form, eventTypes: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">多个事件类型用逗号分隔</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secret">密钥</Label>
            <Input
              id="secret"
              placeholder="可选，用于签名验证"
              value={form.secret}
              onChange={(e) => setForm({ ...form, secret: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customHeaders">自定义请求头</Label>
            <Textarea
              id="customHeaders"
              placeholder='{"X-Custom-Header": "value"}'
              rows={3}
              value={form.customHeaders}
              onChange={(e) => setForm({ ...form, customHeaders: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">JSON 格式的键值对</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              创建
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

### 5.2 对话框关键点

【易错点】 **Webhook URL 验证**：表单只检查了 `!form.url`（非空），但没有验证 URL 格式。用户可能输入 `not-a-url`，创建成功后所有投递都会失败。更好的做法是用 `new URL(form.url)` 验证，或使用 `z.string().url()` schema 校验。

【易错点】 **事件类型的格式**：`eventTypes` 字段是逗号分隔的字符串（如 `"tenant.created,tenant.suspended"`），不是数组。这是后端 API 的设计选择——字符串更简单，但前端需要 `split(",")` 来逐个展示。创建表单用 Input 而非 Checkbox 组，降低了用户出错的可能（但不如 Checkbox 直观）。

【易错点】 **密钥（secret）的安全处理**：创建时输入密钥，但创建后无法再查看。如果用户忘了密钥，只能删除端点重新创建。这就是为什么密钥是可选的——如果不需要签名验证，可以不设。

---

## 六、设计取舍

【设计取舍】 Webhook（推送）vs 轮询（拉取）——两种事件通知模式的对比：

| 维度 | Webhook（推送） | 轮询（拉取） |
|------|---------------|------------|
| **实时性** | 事件发生后立即通知 | 取决于轮询间隔（秒级~分钟级） |
| **服务端压力** | 低（只在事件发生时推送） | 高（无事件也持续查询） |
| **客户端复杂度** | 需要暴露 HTTP 端点接收请求 | 只需定时发 GET 请求 |
| **可靠性** | 需要重试机制+死信队列 | 天然可靠（拉不到就再拉） |
| **防火墙** | 需要公网可访问的端点 | 客户端主动出站，无此限制 |
| **调试** | 需要 ngrok 等工具暴露本地端口 | 直接浏览器访问即可 |
| **适用场景** | 事件驱动、实时性要求高 | 定时同步、无公网端点 |

**本项目选择 Webhook 的原因**：SaaS 平台的事件（租户暂停、配额变更）需要实时通知外部系统，轮询延迟不可接受。而且订阅方（如 ERP 系统）通常有公网端点。

> **思考**：如果订阅方的服务临时不可用，Webhook 投递失败怎么办？当前的重试机制（最多 3 次指数退避）能覆盖多长的故障时间？如果订阅方宕机 2 小时，重试 3 次后消息就丢了——需要引入死信队列或降级为手动重发。

【性能陷阱】 **Webhook 投递超时**：如果订阅方的端点响应缓慢（比如处理事件时做了大量数据库操作），投递请求会一直等待。设置合理的超时时间（通常 5-10 秒）至关重要——超时后立即返回失败，进入重试队列。如果不设超时，一个慢端点就能阻塞整个投递线程池。

---

## 七、验证与自检

完成 Webhook 管理的学习后，用以下步骤验证理解：

1. **打开 Webhook 管理页**，确认端点列表正常显示
2. **点击"新建端点"**，确认对话框表单字段完整（租户ID、应用ID、URL、事件类型、密钥、自定义请求头）
3. **创建一个端点**，URL 填 `https://httpbin.org/post`（测试用），事件类型选 `tenant.created`
4. **暂停一个租户**，观察 httpbin 是否收到 Webhook 请求（可在 httpbin 网站查看）
5. **删除端点**，确认需要二次确认

---

## 八、小结

| 功能 | 实现 |
|------|------|
| 端点列表 | AgTable + PageToolbar + 状态 Badge |
| 创建端点 | Dialog + URL + 事件类型 + 密钥 + 自定义请求头 |
| 删除端点 | ConfirmDialog + API 调用 |
| 事件类型 | 8 种平台事件，逗号分隔字符串 |
| 投递记录 | `getDeliveries` API（分页查询） |

---

## ✅ 输出检查清单

完成本节学习后，确认以下知识点已掌握：

- [ ] 能列出 `webhooksApi` 的 4 个方法及其用途
- [ ] 理解 Webhook 事件投递流程（触发→匹配→签名→投递→重试）
- [ ] 知道 8 种平台事件的名称和触发时机
- [ ] 理解 Webhook URL 验证的重要性
- [ ] 能解释 Webhook（推送）vs 轮询（拉取）的设计取舍
- [ ] 知道密钥（secret）的安全处理方式
- [ ] 理解 Webhook 投递超时的性能陷阱
- [ ] 知道删除端点前应该先暂停，避免重试中的投递丢失

---

## 递进思考

**L1 入门**：Webhook 端点中的 `tenantId` 和 `appId` 是可选的，留空表示"全局"。全局端点和租户级端点分别接收哪些事件？

**L2 进阶**：如果订阅方的 Webhook 端点返回 500 错误，当前的重试策略是指数退避 3 次。如果 3 次都失败了，这条消息怎么办？你会怎么设计"死信队列"？

**L3 架构**：假设我们需要支持"Webhook 密钥轮换"——定期更换密钥而不中断投递。怎么做？提示：考虑双密钥过渡期，新请求用新密钥签名，但旧密钥在过渡期内仍然有效。

---

[← 上一篇：功能开关](07-功能开关.md) | [下一篇：MFA管理 →](09-MFA管理.md)
