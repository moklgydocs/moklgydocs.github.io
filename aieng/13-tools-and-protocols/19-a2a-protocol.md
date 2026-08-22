# A2A —— 智能体对智能体协议

> MCP 是智能体对工具。A2A(Agent2Agent)是智能体对智能体——一个让基于不同框架构建的黑盒智能体相互协作的开放协议。Google 于 2025 年 4 月发布,2025 年 6 月捐赠给 Linux 基金会,2026 年 4 月达到 v1.0,支持者超过 150 家,包括 AWS、Cisco、Microsoft、Salesforce、SAP 和 ServiceNow。它吸收了 IBM 的 ACP,并加入了 AP2 支付扩展。本课走完 Agent Card、Task 生命周期和两种传输绑定。

**类型:** 动手构建
**编程语言:** Python(标准库,Agent Card + Task 测试台)
**前置要求:** 第 13 阶段 · 06(MCP 基础)、第 13 阶段 · 08(MCP 客户端)
**预计耗时:** 约 75 分钟

## 学习目标

- 区分智能体对工具(MCP)与智能体对智能体(A2A)的用例。
- 在 `/.well-known/agent.json` 发布带技能和端点元数据的 Agent Card。
- 走完 Task 生命周期(submitted → working → input-required → completed / failed / canceled / rejected)。
- 使用带 Part(text、file、data)的 Message 和作为输出的 Artifact。

## 问题

一个客服智能体需要把写报告的活委派给一个专门的写作智能体。A2A 出现之前的选项:

- 定制 REST API。能用,但每一对都是一次性工程。
- 共享代码库。要求两个智能体跑同一个框架。
- MCP。不合适:MCP 是调用工具的,不是让两个智能体在各自内部推理保持黑盒的前提下协作的。

A2A 填上了这个缺口。它把交互建模为一个智能体向另一个智能体发送 Task,带生命周期、消息和工件。被调智能体的内部状态保持黑盒——调用方只看到任务状态迁移和最终输出。

A2A 是"让跨框架的智能体相互对话"的协议。它不取代 MCP,两者互补。

## 概念

### Agent Card

每个 A2A 兼容智能体在 `/.well-known/agent.json` 发布一张卡片:

```json
{
  "schemaVersion": "1.0",
  "name": "research-agent",
  "description": "Summarizes academic papers and drafts citations.",
  "url": "https://research.example.com/a2a",
  "version": "1.2.0",
  "skills": [
    {
      "id": "summarize_paper",
      "name": "Summarize a paper",
      "description": "Read a paper PDF and produce a 3-paragraph summary.",
      "inputModes": ["text", "file"],
      "outputModes": ["text", "artifact"]
    }
  ],
  "capabilities": {"streaming": true, "pushNotifications": true}
}
```

发现机制基于 URL:拉取卡片,获知 A2A 端点的 URL,枚举技能。

### 签名的 Agent Card(AP2)

AP2 扩展(2025 年 9 月)给 Agent Card 加上加密签名。发布方用 JWT 给自己的卡片签名,消费方验签。防止冒名顶替。

### Task 生命周期

```
submitted -> working -> completed | failed | canceled | rejected
             -> input_required -> working (loop via message)
```

客户端用 `tasks/send` 发起。被调智能体在状态间迁移;客户端通过 SSE 订阅状态更新,或轮询。

### Message 与 Part

一条消息携带一个或多个 Part:

- `text` —— 纯文本内容。
- `file` —— 带 mimeType 的 base64 二进制块。
- `data` —— 带类型的 JSON 载荷(给被调智能体的结构化输入)。

示例:

```json
{
  "role": "user",
  "parts": [
    {"type": "text", "text": "Summarize this paper."},
    {"type": "file", "file": {"name": "paper.pdf", "mimeType": "application/pdf", "bytes": "..."}},
    {"type": "data", "data": {"targetLength": "3 paragraphs"}}
  ]
}
```

### Artifact

输出是 Artifact,不是裸字符串。Artifact 是一个具名、带类型的输出:

```json
{
  "name": "summary",
  "parts": [{"type": "text", "text": "..."}],
  "mimeType": "text/markdown"
}
```

Artifact 可以分块流式返回,调用方负责累积。

### 两种传输绑定

1. **HTTP 上的 JSON-RPC。** `/a2a` 端点,POST 发请求,可选 SSE 做流式。默认绑定。
2. **gRPC。** 面向 gRPC 原生环境的企业场景。

两种绑定承载相同的逻辑消息形状。

### 黑盒性保留

一条关键设计原则:被调智能体的内部状态是黑盒的。调用方看到任务状态和工件;被调智能体的思维链、工具调用、子智能体委派——全部不可见。这与 MCP 不同,MCP 的工具调用是透明的。

理由:A2A 让竞争对手也能在不暴露内部实现的前提下协作。"调用这个客服智能体"可以不让调用方知道那个智能体是怎么实现服务的。

### 时间线

- **2025-04-09。** Google 发布 A2A。
- **2025-06-23。** 捐赠给 Linux 基金会。
- **2025-08。** 吸收 IBM 的 ACP。
- **2025-09。** AP2 扩展(智能体支付)发布。
- **2026-04。** v1.0 发布,支持组织超过 150 家。

### 与 MCP 的关系

| 维度 | MCP | A2A |
|-----------|-----|-----|
| 用例 | 智能体对工具 | 智能体对智能体 |
| 黑盒性 | 透明的工具调用 | 黑盒的内部推理 |
| 典型调用方 | 智能体运行时 | 另一个智能体 |
| 状态 | 工具调用结果 | 带生命周期的 Task |
| 授权 | OAuth 2.1(第 13 阶段 · 16) | JWT 签名的 Agent Card(AP2) |
| 传输 | Stdio / 可流式 HTTP | HTTP 上的 JSON-RPC / gRPC |

要调用一个具体工具,用 MCP;要把整个任务委派给另一个智能体,用 A2A。许多生产系统两个都用:智能体的工具层走 MCP,协作层走 A2A。

```figure
a2a-task-lifecycle
```

## 投入使用

`code/main.py` 实现了一个最小 A2A 测试台:一个研究智能体发布卡片,一个写作智能体收到含 PDF 和文本指令的 `tasks/send`,依次经过 working → input_required → working → completed,返回一个文本工件。全部标准库;用内存传输,聚焦消息形状。

重点看:

- Agent Card 的 JSON 形状。
- Task id 分配与状态迁移。
- 混合类型 Part 的 Message。
- 任务中途的 input-required 分支。
- 完成时的 Artifact 返回。

## 交付

本课产出 `outputs/skill-a2a-agent-spec.md`。给定一个需要被其他智能体调用的新智能体,该技能产出 Agent Card JSON、技能 schema 和端点蓝图。

## 练习

1. 运行 `code/main.py`。追踪完整的 Task 生命周期,包括被调智能体请求澄清时的 input-required 暂停。

2. 加一张签名的 Agent Card。对卡片的规范 JSON 做 HMAC 签名。写一个验证器,确认篡改过的卡片验签失败。

3. 实现任务流式:写作智能体经 SSE 发出三个增量工件块,调用方累积它们。

4. 设计一个包装 MCP 服务器的 A2A 智能体。把每个 MCP 工具映射为一个 A2A 技能。记下取舍——损失了什么黑盒性?

5. 读 A2A v1.0 发布说明,找出截至 2026 年 4 月尚无任何框架实现的那个特性。(提示:与多跳任务委派有关。)

## 关键术语

| 术语 | 大家口头的说法 | 实际含义 |
|------|----------------|------------------------|
| A2A | "智能体对智能体协议" | 黑盒智能体协作的开放协议 |
| Agent Card | "`.well-known/agent.json`" | 描述智能体技能与端点的已发布元数据 |
| 技能(Skill) | "可调用单元" | 智能体支持的具名操作(类比 MCP 工具) |
| Task | "委派的单位" | 带生命周期和最终工件的工作项 |
| Message | "任务输入" | 携带 Part(text、file、data) |
| Part | "带类型的块" | 消息的 `text` / `file` / `data` 元素 |
| Artifact | "任务输出" | 完成时返回的具名、带类型输出 |
| AP2 | "智能体支付协议" | 为信任与支付设计的签名 Agent Card 扩展 |
| 黑盒性(Opacity) | "黑盒协作" | 被调智能体的内部对调用方隐藏 |
| Input-required | "任务暂停" | 智能体需要更多信息时的生命周期状态 |

## 延伸阅读

- [a2a-protocol.org](https://a2a-protocol.org/latest/) — A2A 权威规范
- [a2aproject/A2A — GitHub](https://github.com/a2aproject/A2A) — 参考实现与 SDK
- [Linux Foundation — A2A launch press release](https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents) — 2025 年 6 月治理移交
- [Google Cloud — A2A protocol upgrade](https://cloud.google.com/blog/products/ai-machine-learning/agent2agent-protocol-is-getting-an-upgrade) — 路线图与伙伴势头
- [Google Dev — A2A 1.0 milestone](https://discuss.google.dev/t/the-a2a-1-0-milestone-ensuring-and-testing-backward-compatibility/352258) — v1.0 发布说明与向后兼容指引
