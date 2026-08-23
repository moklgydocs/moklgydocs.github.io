# A2A —— 智能体对智能体协议

> Google 在 2025 年 4 月发布 A2A；到 2026 年 4 月，规范位于 https://a2a-protocol.org/latest/specification/，已有 150+ 家组织支持。A2A 是 MCP（第 13 课）在水平方向上的补充:MCP 是垂直的（智能体 ↔ 工具）,A2A 是点对点的（智能体 ↔ 智能体）。它定义了 Agent Card（发现）、带 artifact 的任务（文本、结构化数据、视频）、不透明的任务生命周期和认证。生产系统越来越多地把 MCP 和 A2A 搭配使用。Google Cloud 在 2025-2026 年间把 A2A 支持卷进了 Vertex AI Agent Builder。

**类型：** Learn + Build
**编程语言：** Python（标准库，`http.server`、`json`)
**前置要求：** 第 16 阶段 · 04（原语模型）
**预计耗时：** 约 75 分钟

## 问题

你的智能体需要调用另一个系统上的另一个智能体。怎么调？你可以暴露一个 HTTP 端点，定义一套自定义 JSON schema，然后祈祷对面讲同一种语言。每一对智能体都变成一次定制集成。

A2A 就是为这种调用准备的通用线上协议。标准的发现、标准的任务模型、标准的传输、标准的 artifact。就像 HTTP+REST，只不过智能体是一等公民。

## 概念

### 四个要素

**Agent Card（智能体名片）。** 位于 `/.well-known/agent.json` 的 JSON 文档，描述这个智能体：名称、技能、端点、支持的模态、认证要求。发现就是读这张卡。

```
GET https://agent.example.com/.well-known/agent.json
→ {
    "name": "code-review-agent",
    "skills": ["review-python", "review-typescript"],
    "endpoints": {
      "tasks": "https://agent.example.com/tasks"
    },
    "auth": {"type": "bearer"},
    "modalities": ["text", "structured"]
  }
```

**Task（任务）。** 工作单元。一个异步的、有状态的对象，带生命周期：`submitted → working → completed / failed / canceled`。客户端发送任务，轮询或订阅更新。

**Artifact（产物）。** 任务产出的结果类型。文本、结构化 JSON、图像、视频、音频。Artifact 是类型化的，不同模态都是一等公民。

**不透明的生命周期。** A2A 不规定远程智能体*如何*解决任务。客户端看到的是状态转移和 artifact；实现用什么框架都行。

### MCP/A2A 的分工

- **MCP**（第 13 课）：智能体 ↔ 工具。智能体通过 JSON-RPC 对工具服务器读写。默认无状态。
- **A2A**：智能体 ↔ 智能体。对等协议；两边都是有自己推理能力的智能体。

生产级多智能体系统两个都用。一个 A2A 对端在它自己那侧调 MCP 工具。这个分工让两件事各管各的，保持干净。

### 发现流程

```
Client                     Agent server
  ├──GET /.well-known/agent.json──>
  <──Agent Card JSON─────────────
  ├──POST /tasks {skill, input}──>
  <──201 task_id, state=submitted
  ├──GET /tasks/{id}──────────────>
  <──state=working, 42% done──────
  ├──GET /tasks/{id}──────────────>
  <──state=completed, artifacts──
```

或者用流式：订阅 `/tasks/{id}/events` 的 SSE，拿推送更新。

### 认证

A2A 支持三种常见模式：

- **Bearer token** —— OAuth2 或不透明令牌。
- **mTLS** —— 双向 TLS；组织互相证明身份。
- **签名请求** —— 对载荷做 HMAC。

认证方式在 Agent Card 里声明；客户端发现后遵守。

### 截至 2026 年 4 月，150+ 家组织

企业采用推高了 A2A 的规模。头条结论：A2A 成了企业智能体系统跨越信任边界的方式。Google Cloud 交付了 Vertex AI Agent Builder 的 A2A 支持；Microsoft Agent Framework 支持它；大多数主流框架（LangGraph、CrewAI、AutoGen）都交付了 A2A 适配器。

### A2A 赢在哪

- **跨组织调用。** A 公司的智能体调 B 公司的智能体。没有 A2A，每一对都是定制契约。
- **异构框架。** LangGraph 智能体调 CrewAI 智能体，再调自定义 Python 智能体。A2A 把它们归一化。
- **类型化 artifact。** 视频结果、结构化 JSON、音频——全是一等公民。
- **长时间运行的任务。** 不透明生命周期 + 轮询，让几小时的任务变得 straightforward。

### A2A 吃力在哪

- **延迟敏感的微调用。** A2A 的生命周期是异步的。亚毫秒级的智能体互调不合适，用直接 RPC。
- **同进程紧耦合的智能体。** 两个智能体跑在同一个 Python 进程里时，A2A 的 HTTP 往返就是杀鸡用牛刀。
- **小团队。** 规范的开销是实打实的；纯内部的智能体可能不需要这份正式。

### A2A vs ACP、ANP、NLIP

2024-2026 年间冒出了几个相关规范：

- **ACP**(IBM / Linux 基金会）—— A2A 的前身，范围更窄。
- **ANP**(Agent Network Protocol)—— 重对端发现，去中心化优先。
- **NLIP**(Ecma Natural Language Interaction Protocol,2025 年 12 月标准化）—— 自然语言内容类型。

截至 2026 年 4 月，A2A 是采用最广的对等协议。对比见 arXiv:2505.02279(Liu et al.,"A Survey of Agent Interoperability Protocols")。

```figure
sw-agent-card-discovery
```

## 动手构建

`code/main.py` 用 `http.server` 和 JSON 实现了一个 A2A 最小服务器和客户端。服务器：

- 暴露 `/.well-known/agent.json`,
- 接受 `POST /tasks`,
- 管理任务状态，
- 在 `GET /tasks/{id}` 上返回 artifact。

客户端：

- 拉取 Agent Card,
- 提交任务，
- 轮询直到完成，
- 读取 artifact。

运行：

```
python3 code/main.py
```

脚本在后台线程里启动服务器，然后跑客户端打它。你会看到完整流程：发现、提交、轮询、artifact。

## 投入使用

`outputs/skill-a2a-integrator.md` 设计一次 A2A 集成：Agent Card 内容、任务 schema、认证选择、流式还是轮询。

## 交付

检查清单：

- **钉住规范版本。** A2A 还在演进；Agent Card 应声明协议版本。
- **幂等的任务创建。** 重复提交（网络重试）应只产生一个任务。
- **Artifact schema。** 声明智能体返回的形状；消费方应校验。
- **限流 + 认证。** A2A 是公网面对的；应用标准的 Web 安全措施。
- **失败任务的死信。** 长期观察，找出反复出现的失败类型。

## 练习

1. 跑 `code/main.py`。确认客户端发现了服务器并收到正确的 artifact。
2. 给服务器加第二个技能（如 "summarize")，更新 Agent Card。写一个按任务类型挑技能的客户端。
3. 实现一个 SSE 流式端点：`/tasks/{id}/events`，发出状态变更。客户端要改什么？
4. 读 A2A 规范（https://a2a-protocol.org/latest/specification/)。找出三件规范强制而这个演示没实现的事。
5. 对比 A2A(Agent Card 发现）和 MCP（服务器侧经 `listTools` 的能力清单）。自我描述的智能体和能力探测之间，是什么权衡？

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| A2A | "智能体对智能体" | 智能体跨系统互调的对等协议。Google,2025 |
| Agent Card | "智能体的名片" | 描述技能、端点、认证的 JSON，位于 `/.well-known/agent.json` |
| Task | "工作单元" | 异步有状态对象，带生命周期；完成时产出 artifact |
| Artifact | "结果" | 类型化输出：文本、结构化 JSON、图像、视频、音频。一等媒体 |
| 不透明生命周期 | "怎么解决是智能体自己的事" | 客户端看状态转移；服务器随便选框架和工具 |
| 发现 | "找到智能体" | `GET /.well-known/agent.json` 返回名片 |
| MCP vs A2A | "工具 vs 对等" | MCP：垂直的智能体 ↔ 工具。A2A：水平的智能体 ↔ 智能体 |
| ACP / ANP / NLIP | "兄弟协议" | 相邻规范；A2A 是 2026 年采用最广的 |

## 延伸阅读

- [A2A 规范](https://a2a-protocol.org/latest/specification/) —— 权威规范
- [Google Developers Blog —— A2A 发布公告](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) —— 2025 年 4 月发布文章
- [A2A GitHub 仓库](https://github.com/a2aproject/A2A) —— 参考实现与 SDK
- [Liu et al. —— A Survey of Agent Interoperability Protocols](https://arxiv.org/html/2505.02279v1) —— MCP、ACP、A2A、ANP 对比
