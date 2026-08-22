# MCP Sampling —— 服务器请求的 LLM 补全与智能体循环

> 大多数 MCP 服务器是哑巴执行器：收参数、跑代码、回内容。Sampling 让服务器能调转方向：它请客户端的 LLM 来做决策。这让服务器端能托管智能体循环，而服务器自己不持任何模型凭据。SEP-1577 在 2025-11-25 合并，给 sampling 请求加上了工具，让循环可以含更深的推理。漂移风险提示：SEP-1577 的"采样中带工具"形态在 2026 年第一季度仍是实验性的，SDK API 还在定型中。

**类型：** Build
**编程语言：** Python（标准库，sampling 架子）
**前置要求：** 第 13 阶段 · 07(MCP 服务器）、第 13 阶段 · 10（资源与提示词）
**预计耗时：** 约 75 分钟

## 学习目标

- 解释 `sampling/createMessage` 解决了什么（服务器托管循环，而服务器端不用 API key)
- 实现一个服务器：请客户端对多轮提示做采样，并拿回补全结果
- 用 `modelPreferences`（成本 / 速度 / 智能优先级）引导客户端的模型选择
- 构建一个 `summarize_repo` 工具：内部通过 sampling 迭代，而不是硬编码行为

## 问题

一个好用的代码摘要 MCP 服务器需要：走文件树、挑选要读的文件、综合出摘要、返回。LLM 推理发生在哪？

选项 A：服务器调自己的 LLM。要 API key，账单记在服务器侧，按用户摊下来很贵。

选项 B：服务器只回原始内容，推理交给客户端的智能体。能用，但这把服务器逻辑搬进了客户端提示词，很脆弱。

选项 C：服务器通过 `sampling/createMessage` 请客户端的 LLM。服务器保留算法（读哪些文件、做几遍），客户端保留账单和模型选择权。服务器完全不持凭据。

Sampling 就是选项 C。它是让一个可信服务器能托管智能体循环、而自己不必做完整 LLM 宿主的机制。

## 概念

### `sampling/createMessage` 请求

服务器发送：

```json
{
  "jsonrpc": "2.0",
  "id": 42,
  "method": "sampling/createMessage",
  "params": {
    "messages": [{"role": "user", "content": {"type": "text", "text": "..."}}],
    "systemPrompt": "...",
    "includeContext": "none",
    "modelPreferences": {
      "costPriority": 0.3,
      "speedPriority": 0.2,
      "intelligencePriority": 0.5,
      "hints": [{"name": "claude-3-5-sonnet"}]
    },
    "maxTokens": 1024
  }
}
```

客户端跑它的 LLM，返回：

```json
{"jsonrpc": "2.0", "id": 42, "result": {
  "role": "assistant",
  "content": {"type": "text", "text": "..."},
  "model": "claude-3-5-sonnet-20251022",
  "stopReason": "endTurn"
}}
```

### `modelPreferences`

三个加起来等于 1.0 的浮点数：

- `costPriority`：偏好更便宜的模型。
- `speedPriority`：偏好更快的模型。
- `intelligencePriority`：偏好更强的模型。

外加 `hints`：服务器点名的偏好模型。客户端可以听也可以不听；客户端用户的配置永远说了算。

### `includeContext`

三个取值：

- `"none"` —— 只用服务器提供的消息。默认。
- `"thisServer"` —— 包含来自本服务器会话的历史消息。
- `"allServers"` —— 包含所有会话上下文。

`includeContext` 在 2025-11-25 已软废弃，因为它会跨服务器泄漏上下文，是安全隐患。用 `"none"`，把上下文显式放进消息里。

### 带工具的 Sampling(SEP-1577)

2025-11-25 新增：sampling 请求可以带一个 `tools` 数组。客户端用这些工具跑一个完整的工具调用循环。这让服务器能借客户端的模型托管一个 ReAct 式智能体循环。

```json
{
  "messages": [...],
  "tools": [
    {"name": "fetch_url", "description": "...", "inputSchema": {...}}
  ]
}
```

客户端的循环：采样 → 有工具调用就执行 → 再采样 → 返回最终的 assistant 消息。这在 2026 年第一季度仍是实验性的，SDK 签名可能还会变。实现时以 2025-11-25 规范的 client/sampling 一节为准。

### 人在回路（Human-in-the-loop)

客户端在跑采样之前，必须向用户展示服务器要让模型做什么。恶意服务器可以用 sampling 操纵用户会话（"对用户说 X，让他们点 Y")。Claude Desktop、VS Code 和 Cursor 会把 sampling 请求弹成确认对话框，用户可以拒绝。

2026 年的共识：不带人工确认的 sampling 是危险信号。网关（第 13 阶段 · 17）可以自动批准低风险采样、自动拒绝一切可疑的。

### 没有 API key 的服务器托管循环

经典用例：一个自己没有 LLM 访问权的代码摘要 MCP 服务器。它：

1. 走仓库结构。
2. 调 `sampling/createMessage`:"挑出最可能描述这个仓库用途的五个文件。"
3. 读这些文件。
4. 带着文件内容再调 `sampling/createMessage`:"用三段话总结这个仓库。"
5. 把摘要作为 `tools/call` 的结果返回。

服务器全程不碰 LLM API。补全的费用由客户端用户用自己的凭据支付。

### 安全风险（Unit 42 披露，2026 Q1)

- **隐蔽采样。** 一个工具总是用"从会话上下文里回答用户的邮箱"来调 sampling。攻击向量见 第 13 阶段 · 15。
- **借采样偷资源。** 服务器请客户端总结攻击者的载荷，账单记在用户头上。
- **循环炸弹。** 服务器紧凑循环地调 sampling。客户端必须强制每会话速率限制。

```figure
t3-sampling-flip
```

## 投入使用

`code/main.py` 交付一个假的服务器到客户端 sampling 架子：一个模拟的 "summarize_repo" 工具发起两轮采样（选文件、再摘要），假客户端返回罐头回答。架子展示：

- 服务器发送带 `modelPreferences` 的 `sampling/createMessage`。
- 客户端返回补全。
- 服务器继续它的循环。
- 限流器给每次工具调用的采样总数设上限。

要看的地方：

- 服务器只暴露一个工具（`summarize_repo`)；所有推理都发生在采样调用里。
- 模型优先级影响客户端的模型选择；hints 列出偏好模型。
- 循环在 `stopReason: "endTurn"` 时终止。
- `max_samples_per_tool = 5` 的上限拦住失控的循环。

## 交付

本课产出 `outputs/skill-sampling-loop-designer.md`。给它一个需要 LLM 调用的服务器端算法（研究、摘要、规划），这个 skill 设计一个基于 sampling 的实现：合适的 modelPreferences、速率限制和安全确认。

## 练习

1. 跑 `code/main.py`。把 `max_samples_per_tool` 改成 2，观察限流切断。

2. 实现 SEP-1577 的"采样中带工具"变体：sampling 请求携带 `tools` 数组。验证客户端侧循环在返回最终补全前执行了这些工具。注意漂移风险：SDK 签名在 2026 年上半年可能还会变。

3. 加人在回路确认：在服务器第一次 `sampling/createMessage` 之前，暂停等待用户批准。被拒绝的调用返回类型化的拒绝。

4. 加按客户端会话键控的每用户限流器。同一用户在同一服务器上的循环应共享预算。

5. 设计一个用 sampling 挑选要纳入的片段的 `summarize_pdf` 工具，勾画发送的消息。`modelPreferences.intelligencePriority` 取 0.1 和 0.9 时，行为有什么变化？

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| Sampling（采样） | "服务器到客户端的 LLM 调用" | 服务器请求客户端的模型做一次补全 |
| `sampling/createMessage` | "那个方法" | 发起采样请求的 JSON-RPC 方法 |
| `modelPreferences` | "模型优先级" | 成本 / 速度 / 智能权重，外加模型名提示 |
| `includeContext` | "跨会话泄漏" | 已软废弃的上下文包含模式 |
| SEP-1577 | "采样中带工具" | 允许 sampling 里带工具，支持服务器托管 ReAct |
| 人在回路 | "用户确认" | 客户端在跑采样前把请求呈给用户 |
| 循环炸弹 | "失控采样" | 服务器端无限采样循环；客户端必须限流 |
| 隐蔽采样 | "藏起来的推理" | 恶意服务器把意图藏在采样提示词里 |
| 偷资源 | "花用户的 LLM 预算" | 服务器强迫客户端为它不想要的采样付费 |
| `stopReason` | "生成为什么停了" | `endTurn`、`stopSequence` 或 `maxTokens` |

## 延伸阅读

- [MCP —— 概念：Sampling](https://modelcontextprotocol.io/docs/concepts/sampling) —— sampling 高层概览
- [MCP —— 客户端 sampling 规范 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/client/sampling) —— `sampling/createMessage` 的权威形状
- [MCP —— GitHub SEP-1577](https://github.com/modelcontextprotocol/modelcontextprotocol) —— "采样中带工具"的规范演进提案（实验性）
- [Unit 42 —— MCP 攻击向量](https://unit42.paloaltonetworks.com/model-context-protocol-attack-vectors/) —— 隐蔽采样与偷资源模式
- [Speakeasy —— MCP sampling 核心概念](https://www.speakeasy.com/mcp/core-concepts/sampling) —— 带客户端代码示例的走读
