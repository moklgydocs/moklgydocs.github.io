# MFA 管理

> **这一步解决什么问题？**
> 多因素认证（MFA）是租户安全的重要组成。运营中心需要管理租户级 MFA 开关、用户级 TOTP 设置（QR 码）、验证码校验和 MFA 移除。本节我们从 API 到页面，完整理解 MFA 的前端实现。
>
> **ASP.NET Core 开发者的直觉**：TOTP 就像 ASP.NET Core Identity 的 `AuthenticatorKey`——后端生成 Base32 密钥，用户用 Google Authenticator 等应用扫描 QR 码，之后每 30 秒生成 6 位验证码。运营中心的 MFA 管理相当于 Identity 的管理员面板——可以查看、设置、验证和移除任意用户的 MFA。

---

## 一、MFA API 层

### 1.1 完整 API 代码

```typescript
// src/api/ops/mfa.ts
import { get, post, del } from "./http"
import type { MfaSetupResult, VerifyMfaCodeRequest } from "@/types"

export const mfaApi = {
  isEnabled: (tenantId: string) =>
    get<{ tenantId: string; mfaEnabled: boolean }>(`/api/tenant-ops/mfa/tenants/${tenantId}/enabled`),
  getStatus: (userId: string, tenantId: string) =>
    get<{ userId: string; status: string }>(`/api/tenant-ops/mfa/users/${userId}/status`, { tenantId } as Record<string, unknown>),
  setup: (userId: string, tenantId: string, email: string) =>
    post<MfaSetupResult>(`/api/tenant-ops/mfa/users/${userId}/setup?tenantId=${tenantId}&email=${encodeURIComponent(email)}`),
  verify: (userId: string, data: VerifyMfaCodeRequest) =>
    post<{ valid: boolean; result: string }>(`/api/tenant-ops/mfa/users/${userId}/verify`, data),
  remove: (userId: string, tenantId: string) =>
    del<void>(`/api/tenant-ops/mfa/users/${userId}?tenantId=${tenantId}`),
}
```

### 1.2 5 个方法解读

| 方法 | HTTP | 路径 | 说明 |
|------|------|------|------|
| `isEnabled` | GET | `/api/tenant-ops/mfa/tenants/{tenantId}/enabled` | 查询租户级 MFA 开关 |
| `getStatus` | GET | `/api/tenant-ops/mfa/users/{userId}/status` | 查询用户级 MFA 状态 |
| `setup` | POST | `/api/tenant-ops/mfa/users/{userId}/setup` | 为用户生成 TOTP 密钥和 QR 码 |
| `verify` | POST | `/api/tenant-ops/mfa/users/{userId}/verify` | 校验 6 位验证码 |
| `remove` | DELETE | `/api/tenant-ops/mfa/users/{userId}` | 移除用户的 MFA 设置 |

【易错点】 `setup` 方法的 `email` 参数通过 query string 传递，且用 `encodeURIComponent` 编码。这是因为邮箱包含 `@` 等特殊字符，直接拼 URL 可能导致请求错误。注意 `tenantId` 也通过 query string 传递（而非 URL 路径），所以这个 API 同时用了路径参数（`userId`）和查询参数（`tenantId`、`email`）。

> **思考**：为什么 `setup` 用 POST 而不是 PUT？因为每次调用 `setup` 都会生成新的 TOTP 密钥，是"创建新资源"而非"更新已有资源"。如果用户已经设置了 MFA，再次 setup 会覆盖旧密钥——这就是为什么操作前需要确认。

---

## 二、MFA 注册流程图

用户从"未启用 MFA"到"完成 MFA 绑定"的完整流程：

```
┌───────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────────┐
│ 运营人员   │     │  前端页面     │     │  后端 API      │     │ Authenticator App│
│           │     │              │     │               │     │                  │
│ 1.输入    ├────►│ isEnabled()  ├────►│ 查询租户 MFA  │     │                  │
│   tenantId│     │              │◄────┤ 开关状态      │     │                  │
│           │     │              │     │               │     │                  │
│ 2.点击    ├────►│ setup()      ├────►│ 生成 TOTP     │     │                  │
│   "设置"  │     │              │◄────┤ 密钥+QR码     │     │                  │
│           │     │ 展示QR码     │     │ +恢复码        │     │                  │
│           │     │ 和密钥       │     │               │     │                  │
│           │     │              │     │               │     │                  │
│ 3.用户    │     │              │     │               │     │ 3.扫描QR码       │
│   扫码    │     │              │     │               │◄────┤ 生成6位验证码    │
│           │     │              │     │               │     │ (每30秒变化)     │
│           │     │              │     │               │     │                  │
│ 4.输入    ├────►│ verify()     ├────►│ 校验验证码    │     │                  │
│   验证码  │     │              │◄────┤ valid/invalid │     │                  │
│           │     │              │     │               │     │                  │
│ 5.验证    │     │ 显示结果     │     │               │     │                  │
│   成功    │◄────┤ ✓/✗          │     │               │     │                  │
└───────────┘     └──────────────┘     └───────────────┘     └──────────────────┘
```

**步骤说明**：
1. 运营人员先查询租户的 MFA 开关状态
2. 点击"设置"后，后端生成 TOTP 密钥，返回 QR 码和恢复码
3. 用户用 Authenticator App（如 Google Authenticator、Microsoft Authenticator）扫描 QR 码
4. App 生成 6 位验证码，运营人员输入后提交验证
5. 验证通过则 MFA 绑定成功，验证失败则可重试

---

## 三、完整页面源码

### 3.1 MfaPage 组件

```tsx
// src/pages/ops/mfa/index.tsx
import { useState } from "react"
import { AnimatedPage } from "@/components/shared/animated-page"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { toast } from "sonner"
import { mfaApi } from "@/api/ops/mfa"
import type { MfaSetupResult } from "@/types"
import { ShieldCheck, ShieldOff, QrCode, Key, CheckCircle2, XCircle, Trash2 } from "lucide-react"

export default function MfaPage() {
  // ── 租户 MFA 状态 ──
  const [statusTenantId, setStatusTenantId] = useState("")
  const [statusResult, setStatusResult] = useState<{ tenantId: string; mfaEnabled: boolean } | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)

  // ── 用户 MFA 设置 ──
  const [setupUserId, setSetupUserId] = useState("")
  const [setupTenantId, setSetupTenantId] = useState("")
  const [setupEmail, setSetupEmail] = useState("")
  const [setupResult, setSetupResult] = useState<MfaSetupResult | null>(null)
  const [setupLoading, setSetupLoading] = useState(false)

  // ── 用户 MFA 验证 ──
  const [verifyUserId, setVerifyUserId] = useState("")
  const [verifyTenantId, setVerifyTenantId] = useState("")
  const [verifyCode, setVerifyCode] = useState("")
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; result: string } | null>(null)
  const [verifyLoading, setVerifyLoading] = useState(false)

  // ── 移除 MFA ──
  const [removeUserId, setRemoveUserId] = useState("")
  const [removeTenantId, setRemoveTenantId] = useState("")
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false)
  const [removeLoading, setRemoveLoading] = useState(false)

  async function handleCheckStatus() {
    if (!statusTenantId.trim()) {
      toast.error("请输入租户 ID")
      return
    }
    setStatusLoading(true)
    setStatusResult(null)
    try {
      const res = await mfaApi.isEnabled(statusTenantId)
      setStatusResult(res.data ?? null)
    } catch (err) {
      toast.error("查询失败", { description: err instanceof Error ? err.message : String(err) })
    } finally {
      setStatusLoading(false)
    }
  }

  async function handleSetup() {
    if (!setupUserId.trim() || !setupTenantId.trim() || !setupEmail.trim()) {
      toast.error("请填写所有字段")
      return
    }
    setSetupLoading(true)
    setSetupResult(null)
    try {
      const res = await mfaApi.setup(setupUserId, setupTenantId, setupEmail)
      setSetupResult(res.data ?? null)
    } catch (err) {
      toast.error("设置失败", { description: err instanceof Error ? err.message : String(err) })
    } finally {
      setSetupLoading(false)
    }
  }

  async function handleVerify() {
    if (!verifyUserId.trim() || !verifyTenantId.trim() || !verifyCode.trim()) {
      toast.error("请填写所有字段")
      return
    }
    setVerifyLoading(true)
    setVerifyResult(null)
    try {
      const res = await mfaApi.verify(verifyUserId, { tenantId: verifyTenantId, code: verifyCode })
      setVerifyResult(res.data ?? null)
    } catch (err) {
      toast.error("验证失败", { description: err instanceof Error ? err.message : String(err) })
    } finally {
      setVerifyLoading(false)
    }
  }

  async function handleRemove() {
    if (!removeUserId.trim() || !removeTenantId.trim()) return
    setRemoveLoading(true)
    try {
      await mfaApi.remove(removeUserId, removeTenantId)
      toast.success("MFA 已移除")
      setRemoveConfirmOpen(false)
    } catch (err) {
      toast.error("移除失败", { description: err instanceof Error ? err.message : String(err) })
    } finally {
      setRemoveLoading(false)
    }
  }

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <PageHeader title="MFA 管理" description="多因素认证的查询、设置、验证与移除" />

        {/* ── 租户 MFA 状态 ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              租户 MFA 状态
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <div className="space-y-1.5 flex-1 max-w-xs">
                <Label className="text-xs">租户 ID</Label>
                <Input placeholder="输入租户 ID" value={statusTenantId} onChange={e => setStatusTenantId(e.target.value)} className="h-8 text-sm" />
              </div>
              <Button size="sm" onClick={handleCheckStatus} disabled={statusLoading}>
                {statusLoading ? "查询中..." : "查询"}
              </Button>
            </div>
            {statusResult && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">MFA 状态：</span>
                <Badge variant={statusResult.mfaEnabled ? "default" : "secondary"}>
                  {statusResult.mfaEnabled ? "已启用" : "未启用"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── 用户 MFA 设置 ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              用户 MFA 设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-3 flex-wrap">
              <div className="space-y-1.5">
                <Label className="text-xs">用户 ID</Label>
                <Input placeholder="输入用户 ID" value={setupUserId} onChange={e => setSetupUserId(e.target.value)} className="h-8 text-sm w-48" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">租户 ID</Label>
                <Input placeholder="输入租户 ID" value={setupTenantId} onChange={e => setSetupTenantId(e.target.value)} className="h-8 text-sm w-48" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">邮箱</Label>
                <Input placeholder="输入邮箱" value={setupEmail} onChange={e => setSetupEmail(e.target.value)} className="h-8 text-sm w-56" />
              </div>
              <Button size="sm" onClick={handleSetup} disabled={setupLoading}>
                {setupLoading ? "设置中..." : "设置"}
              </Button>
            </div>

            {setupResult && (
              <div className="space-y-4 border rounded-lg p-4">
                {/* QR Code */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-muted-foreground">扫描二维码绑定验证器</p>
                  <img
                    src={`data:image/png;base64,${setupResult.qrCodeBase64}`}
                    alt="MFA QR Code"
                    className="w-48 h-48 border rounded"
                  />
                </div>

                {/* Secret Key */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Key className="h-3.5 w-3.5" />
                    Secret Key
                  </div>
                  <code className="block bg-muted rounded px-3 py-2 text-sm font-mono break-all">
                    {setupResult.secretKey}
                  </code>
                </div>

                {/* Recovery Codes */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">恢复码（请妥善保存）</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {setupResult.recoveryCodes.map(code => (
                      <code key={code} className="bg-muted rounded px-2 py-1 text-xs font-mono text-center">
                        {code}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── 用户 MFA 验证 ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              用户 MFA 验证
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 flex-wrap">
              <div className="space-y-1.5">
                <Label className="text-xs">用户 ID</Label>
                <Input placeholder="输入用户 ID" value={verifyUserId} onChange={e => setVerifyUserId(e.target.value)} className="h-8 text-sm w-48" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">租户 ID</Label>
                <Input placeholder="输入租户 ID" value={verifyTenantId} onChange={e => setVerifyTenantId(e.target.value)} className="h-8 text-sm w-48" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">验证码</Label>
                <Input placeholder="输入 6 位验证码" value={verifyCode} onChange={e => setVerifyCode(e.target.value)} className="h-8 text-sm w-36" />
              </div>
              <Button size="sm" onClick={handleVerify} disabled={verifyLoading}>
                {verifyLoading ? "验证中..." : "验证"}
              </Button>
            </div>
            {verifyResult && (
              <div className="mt-4 flex items-center gap-2">
                {verifyResult.valid ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <Badge variant="default">验证通过</Badge>
                    <span className="text-sm text-muted-foreground">{verifyResult.result}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-destructive" />
                    <Badge variant="destructive">验证失败</Badge>
                    <span className="text-sm text-muted-foreground">{verifyResult.result}</span>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── 移除 MFA ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              移除 MFA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 flex-wrap">
              <div className="space-y-1.5">
                <Label className="text-xs">用户 ID</Label>
                <Input placeholder="输入用户 ID" value={removeUserId} onChange={e => setRemoveUserId(e.target.value)} className="h-8 text-sm w-48" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">租户 ID</Label>
                <Input placeholder="输入租户 ID" value={removeTenantId} onChange={e => setRemoveTenantId(e.target.value)} className="h-8 text-sm w-48" />
              </div>
              <Button size="sm" variant="destructive" onClick={() => setRemoveConfirmOpen(true)}>
                <ShieldOff className="h-3.5 w-3.5 mr-1.5" />
                移除
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 移除确认对话框 */}
        <ConfirmDialog
          open={removeConfirmOpen}
          onOpenChange={setRemoveConfirmOpen}
          title="确认移除 MFA？"
          description={`将移除用户 ${removeUserId} 在租户 ${removeTenantId} 下的 MFA 绑定，移除后该用户登录将不再需要二次验证。此操作不可撤销。`}
          onConfirm={handleRemove}
          loading={removeLoading}
          type="danger"
        />
      </div>
    </AnimatedPage>
  )
}
```

---

## 四、逐行讲解关键点

### 4.1 状态分组

MFA 页面有 4 个功能区域，每个区域都有独立的状态：

```
租户 MFA 状态 → statusTenantId, statusResult, statusLoading
用户 MFA 设置 → setupUserId, setupTenantId, setupEmail, setupResult, setupLoading
用户 MFA 验证 → verifyUserId, verifyTenantId, verifyCode, verifyResult, verifyLoading
移除 MFA     → removeUserId, removeTenantId, removeConfirmOpen, removeLoading
```

共 14 个 `useState`。这是页面级组件的典型状态管理——如果状态更多或需要跨组件共享，应该提取为自定义 Hook 或使用 Context。

### 4.2 QR 码的渲染

```tsx
<img
  src={`data:image/png;base64,${setupResult.qrCodeBase64}`}
  alt="MFA QR Code"
  className="w-48 h-48 border rounded"
/>
```

后端返回的是 Base64 编码的 PNG 图片，前端用 `data:image/png;base64,` 前缀构造 Data URL。这种方式不需要额外的网络请求，但会增加 API 响应体积（Base64 比二进制大约 33%）。

【易错点】 **TOTP Secret 的安全处理**：`setupResult.secretKey` 是明文的 TOTP 密钥，只在 MFA 设置时返回一次。前端不应该缓存或持久化这个密钥——它只在设置流程中展示给用户。如果页面刷新或组件重新挂载，密钥就丢失了，需要重新 setup 生成新密钥。

【易错点】 **恢复码的一次性**：`recoveryCodes` 是一次性使用的备用验证码。每个恢复码只能用一次，用过后应该从列表中删除。当前的实现只是展示恢复码，没有跟踪使用状态——恢复码的使用状态由后端管理，前端不需要维护。

### 4.3 错误信息展示

```typescript
toast.error("查询失败", { description: err instanceof Error ? err.message : String(err) })
```

错误信息包含两部分：固定的中文标题和动态的英文描述。`err instanceof Error` 判断确保 `err.message` 安全访问——非 Error 对象（如字符串、数字）用 `String(err)` 兜底。

> **思考**：为什么 MFA 页面没有用 `useCallback` 包裹处理函数，而概览页用了？因为 MFA 页面没有 `useEffect` 依赖这些函数——它们只在用户点击按钮时调用，不需要缓存引用。`useCallback` 只在函数被用作 `useEffect` 依赖或传给子组件时才有意义。

---

## 五、设计取舍

【设计取舍】 TOTP vs SMS vs Email——三种 MFA 方式的对比：

| 维度 | TOTP（时间型一次性密码） | SMS（短信验证码） | Email（邮件验证码） |
|------|----------------------|-----------------|-------------------|
| **安全性** | 高（密钥不离开用户设备） | 中（SIM 卡劫持风险） | 低（邮箱可能被盗） |
| **成本** | 零（纯算法） | 高（每条短信几毛钱） | 低（邮件几乎免费） |
| **可靠性** | 高（离线可用） | 中（依赖运营商） | 中（可能进垃圾邮件） |
| **用户体验** | 需安装 App | 无需额外操作 | 需查邮件 |
| **实现复杂度** | 中（QR码+算法） | 高（对接短信服务商） | 中（对接邮件服务） |
| **适用场景** | 企业 SaaS、高安全要求 | B2C、大众用户 | 低安全要求的场景 |

**本项目选择 TOTP 的原因**：SaaS 平台面向企业客户，安全要求高；TOTP 零运营成本，实现相对简单；用户（运营人员）通常已有 Authenticator App。

> **思考**：如果产品经理要求"支持 SMS 作为第二因素"，你会怎么扩展当前的 MFA 架构？提示：后端需要新增 `SmsMfaProvider`，前端需要新增"发送验证码"和"输入验证码"的 UI 区块。API 路径可以从 `/mfa/users/{userId}/setup` 扩展为 `/mfa/users/{userId}/setup/sms`。

---

## 六、验证与自检

完成 MFA 管理的学习后，用以下步骤验证理解：

1. **打开 MFA 管理页**，确认 4 个卡片区域正常显示
2. **查询租户 MFA 状态**，输入租户 ID 点击"查询"
3. **生成 MFA 设置**，填写用户 ID、租户 ID、邮箱，点击"设置"
4. **验证 QR 码**：用手机 Authenticator App 扫描 QR 码，确认 App 中显示 6 位验证码
5. **校验验证码**：输入 App 中显示的验证码，确认验证结果
6. **移除 MFA**：确认需要二次确认，且对话框提示"不可撤销"

---

## 七、小结

| 功能 | 实现 |
|------|------|
| 租户 MFA 状态 | `isEnabled` → Badge 展示 |
| 用户 MFA 设置 | `setup` → QR 码 + Secret Key + 恢复码 |
| 验证码校验 | `verify` → 6 位输入 + 结果展示 |
| 移除 MFA | `remove` → ConfirmDialog 二次确认 |
| 错误处理 | `toast.error` + `err.message` 动态描述 |

---

## ✅ 输出检查清单

完成本节学习后，确认以下知识点已掌握：

- [ ] 能列出 `mfaApi` 的 5 个方法及其用途
- [ ] 理解 MFA 注册流程（查询→设置→扫码→验证）
- [ ] 知道 QR 码的 Data URL 渲染方式
- [ ] 理解 TOTP Secret 的安全处理原则
- [ ] 知道恢复码的一次性特性
- [ ] 能解释 TOTP vs SMS vs Email 的设计取舍
- [ ] 理解为什么 `setup` 的 `email` 参数需要 `encodeURIComponent`
- [ ] 知道 MFA 移除操作为什么需要 ConfirmDialog 和"不可撤销"提示

---

## 递进思考

**L1 入门**：MFA 设置时为什么要传 `email` 参数？提示：QR 码中包含 `otpauth://totp/` URI，其中需要标识这是哪个用户的密钥。

**L2 进阶**：如果用户连续 5 次输入错误的验证码，应该怎么处理？提示：考虑暴力破解防护——锁定一段时间或要求重新 setup。

**L3 架构**：假设我们需要支持"管理员强制重置用户 MFA"，和"用户自助重置 MFA"两种场景。当前 API 是否足够？如果不够，需要新增哪些端点？自助重置时如何验证用户身份（避免攻击者冒充用户重置 MFA）？

---

[← 上一篇：Webhook管理](08-Webhook管理.md) | [下一篇：数据交换 →](10-数据交换.md)
