# Roots 与 Elicitation —— 范围界定与流程中途的用户输入

> 硬编码的路径，用户一换项目就崩；预填的工具参数，用户一说得不全就崩。Roots 把服务器限定在用户控制的 URI 集合内；elicitation 在工具调用中途暂停，通过表单或 URL 向用户请求结构化输入。两个客户端原语，治好 MCP 两种常见病。SEP-1036(URL 模式 elicitation,2025-11-25）在 2026 年上半年仍是实验性的——依赖它之前先查 SDK 版本。

**类型：** Build
**编程语言：** Python（标准库，roots + elicitation 演示）
**前置要求：** 第 13 阶段 · 07(MCP 服务器）
**预计耗时：** 约 45 分钟

## 学习目标

- 声明 `roots` 并响应 `notifications/roots/list_changed`
- 把服务器的文件操作限制在所声明 root 集合内的 URI 上
- 用 `elicitation/create` 在工具调用中途向用户请求确认或结构化输入
- 在表单模式和 URL 模式的 elicitation 之间做选择（后者是实验性的，注意漂移风险）

## 问题

一个笔记 MCP 服务器在生产上会撞上两个具体的失败。

**路径假设崩了。** 服务器是照 `~/notes` 写的。另一台机器上的用户，笔记在 `~/Documents/Notes`，工具调用静默失败（找不到文件），或者更糟——写到了错误的地方。

**缺一个只有用户知道的参数。** 用户说"删掉旧的 TPS 报告笔记"。模型调用 `notes_delete(title: "TPS report")`，但有三条匹配的笔记，分别来自 2023、2024 和 2025 年。工具猜不出来。报"歧义"失败很恼人；对三条全删则是灾难。

Roots 治第一个：客户端在 `initialize` 时声明服务器可以触碰的 URI 集合。Elicitation 治第二个：服务器暂停工具调用，发 `elicitation/create` 让用户挑到底是哪一条。

## 概念

### Roots

客户端在 `initialize` 时声明 root 清单：

```json
{
  "capabilities": {"roots": {"listChanged": true}}
}
```

服务器随后可以调 `roots/list`:

```json
{"roots": [{"uri": "file:///Users/alice/Documents/Notes", "name": "Notes"}]}
```

服务器必须把 roots 当作边界：任何 root 集合之外的文件读写都要拒绝。这不是客户端强制的（服务器毕竟是用户信任才运行的代码），但合规的服务器会遵守。

用户增删 root 时，客户端发送 `notifications/roots/list_changed`。服务器重新调 `roots/list`，更新自己的边界。

### 为什么 roots 是客户端原语

roots 由客户端声明，因为它代表用户的同意模型。是用户告诉 Claude Desktop:"给这个笔记服务器访问这两个目录的权限。"服务器不能擅自扩大这个范围。

### Elicitation：表单模式（默认）

`elicitation/create` 接受一个表单 schema 加一段自然语言说明：

```json
{
  "method": "elicitation/create",
  "params": {
    "message": "Delete 'TPS report'? Multiple notes match; pick one.",
    "requestedSchema": {
      "type": "object",
      "properties": {
        "note_id": {
          "type": "string",
          "enum": ["note-3", "note-7", "note-14"]
        },
        "confirm": {"type": "boolean"}
      },
      "required": ["note_id", "confirm"]
    }
  }
}
```

客户端渲染表单，收集用户的回答，返回：

```json
{
  "action": "accept",
  "content": {"note_id": "note-14", "confirm": true}
}
```

三种可能的动作：`accept`（用户填了）、`decline`（用户关了）、`cancel`（用户中止了整个工具调用）。

表单 schema 是扁平的——v1 不支持嵌套对象。SDK 通常会拒绝任何比单层更复杂的结构。

### Elicitation:URL 模式（SEP-1036，实验性）

2025-11-25 新增。服务器不给 schema，改发一个 URL:

```json
{
  "method": "elicitation/create",
  "params": {
    "message": "Sign in to GitHub",
    "url": "https://github.com/login/oauth/authorize?client_id=..."
  }
}
```

客户端在浏览器里打开这个 URL，等待完成，用户回来后返回。适合表单不够用的场景：OAuth 流程、支付授权、文件签署。

漂移风险提示：SEP-1036 的响应形状还在定型；有的 SDK 返回回调 URL，有的返回完成令牌。在生产用 URL 模式之前，先读你所用 SDK 的发布说明。

### 什么时候该用 elicitation

- 破坏性操作前的用户确认（destructive hint + elicitation)。
- 消歧（N 个匹配里挑一个）。
- 首次运行配置（API key、目录、偏好）。
- OAuth 式流程（URL 模式）。

### 什么时候不该用 elicitation

- 填那些模型本可以用散文向用户询问的工具必填参数。用正常的重新提示，别弹 elicitation 对话框。
- 高频调用。Elicitation 会打断对话；别在循环里触发它。
- 任何服务器可以事后校验的东西。先校验、返回错误，让模型用文字问用户。

### 人在回路的桥梁

Elicitation 加 sampling，合起来构成 MCP 的"人在回路"模型。服务器的智能体循环可以因用户输入（elicitation）或模型推理（sampling）而暂停。第 13 阶段 · 11 讲了 sampling，本课讲 elicitation。两者合体，就是完整的循环中途控制。

```figure
t3-roots-boundary
```

## 投入使用

`code/main.py` 在笔记服务器上扩展了：

- `roots/list` 响应：root 列表变更通知到达后，服务器重新查询。
- 一个 `notes_delete` 工具：多条笔记匹配时用 `elicitation/create` 消歧。
- 一个 `notes_setup` 工具：用 URL 模式 elicitation 打开首次运行配置页（模拟）。
- 一个边界检查：拒绝在所声明 roots 之外的 URI 上的操作。

演示跑三个场景：顺利路径（一个匹配）、消歧（三个匹配，触发 elicitation)、root 外写入（被拒绝）。

## 交付

本课产出 `outputs/skill-elicitation-form-designer.md`。给它一个可能需要用户确认或消歧的工具，这个 skill 设计 elicitation 的表单 schema 和消息模板。

## 练习

1. 跑 `code/main.py`。触发消歧路径，确认模拟的用户答案被路由回工具。

2. 加一个新工具 `notes_archive`，每次都要求 elicitation 确认（destructive hint)。体会 UX：和模型用文字重新询问相比如何？

3. 为首次运行的 OAuth 流程实现 URL 模式 elicitation。注意漂移风险，加一个 SDK 版本守卫。

4. 扩展 `roots/list` 处理：通知到达时，服务器应原子地重新读取，并重新扫描那些可能已经出界的打开文件句柄。

5. 读 GitHub 上 SEP-1036 的 issue 讨论帖。找出一个影响服务器该如何处理 URL 模式回调的开放问题。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| Root | "同意边界" | 客户端允许服务器触碰的 URI |
| `roots/list` | "服务器问范围" | 客户端返回当前的 root 集合 |
| `notifications/roots/list_changed` | "用户改范围了" | 客户端通知 root 集合已变化 |
| Elicitation（征询） | "调用中途问用户" | 服务器发起的结构化用户输入请求 |
| `elicitation/create` | "那个方法" | 发起 elicitation 请求的 JSON-RPC 方法 |
| 表单模式 | "schema 驱动的表单" | 在客户端 UI 里渲染成表单的扁平 JSON Schema |
| URL 模式 | "浏览器跳转" | SEP-1036 实验特性；打开一个 URL 然后等待 |
| `accept` / `decline` / `cancel` | "用户回答的结果" | 服务器要处理的三个分支 |
| 消歧 | "挑一个" | 工具有 N 个候选时 elicitation 的常见用例 |
| 扁平表单 | "只要顶层属性" | elicitation 的 schema 不能嵌套 |

## 延伸阅读

- [MCP —— 客户端 roots 规范](https://modelcontextprotocol.io/specification/draft/client/roots) —— roots 权威参考
- [MCP —— 客户端 elicitation 规范](https://modelcontextprotocol.io/specification/draft/client/elicitation) —— elicitation 权威参考
- [Cisco —— MCP elicitation、结构化内容与 OAuth 增强新特性](https://blogs.cisco.com/developer/whats-new-in-mcp-elicitation-structured-content-and-oauth-enhancements) —— 2025-11-25 新增内容走读
- [MCP —— GitHub SEP-1036](https://github.com/modelcontextprotocol/modelcontextprotocol) —— URL 模式 elicitation 提案（实验性，注意漂移）
- [The New Stack —— elicitation 如何把人在回路带给 AI 工具](https://thenewstack.io/how-elicitation-in-mcp-brings-human-in-the-loop-to-ai-tools/) —— UX 走读
