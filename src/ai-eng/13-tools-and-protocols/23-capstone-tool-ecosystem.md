# 毕业设计 —— 构建完整的工具生态

> 第 13 阶段教了每一个零件。本毕业设计把它们接成一个生产形态的系统:一个带 tools + resources + prompts + tasks + UI 的 MCP 服务器,边缘的 OAuth 2.1,RBAC 网关,多服务器客户端,一次 A2A 子智能体调用,接进 collector 的 OTel 追踪,CI 里的工具投毒检测,以及一个 AGENTS.md + SKILL.md 包。做完之后,你能为每一个架构决策辩护。

**类型:** 动手构建
**编程语言:** Python(标准库,端到端生态测试台)
**前置要求:** 第 13 阶段 · 01 至 21
**预计耗时:** 约 120 分钟

## 学习目标

- 组合一个暴露 tools、resources、prompts 和一个带 `ui://` 应用的 task 的 MCP 服务器。
- 用强制执行 RBAC 和固定哈希的 OAuth 2.1 网关挡在服务器前面。
- 写一个用 OTel GenAI 属性端到端追踪的多服务器客户端。
- 把部分负载委派给 A2A 子智能体;验证黑盒性得到保留。
- 用 AGENTS.md + SKILL.md 打包整个技术栈,让其他智能体也能驱动它。

## 问题

交付"研究并成文"系统:

- 用户问:"总结 2026 年 arXiv 上被引最多的三篇智能体协议论文。"
- 系统:经 MCP 搜索 arXiv;经 A2A 把论文总结委派给专门的写作智能体;聚合结果;把交互式报告渲染为 MCP Apps 的 `ui://` 资源;每一步都记入 OTel。

第 13 阶段的所有原语都会出现。这不是玩具——2026 年 Anthropic(Claude Research 产品)、OpenAI(带 Apps SDK 的 GPTs)和第三方交付的生产级研究助手系统,正是这个形状。

## 概念

### 架构

```
[user] -> [client] -> [gateway (OAuth 2.1 + RBAC)] -> [research MCP server]
                                                      |
                                                      +- MCP tool: arxiv_search (pure)
                                                      +- MCP resource: notes://recent
                                                      +- MCP prompt: /research_topic
                                                      +- MCP task: generate_report (long)
                                                      +- MCP Apps UI: ui://report/current
                                                      +- A2A call: writer-agent (tasks/send)
                                                      |
                                                      +- OTel GenAI spans
```

### Trace 层级

```
agent.invoke_agent
 ├── llm.chat (kick off)
 ├── mcp.call -> tools/call arxiv_search
 ├── mcp.call -> resources/read notes://recent
 ├── mcp.call -> prompts/get research_topic
 ├── a2a.tasks/send -> writer-agent
 │    └── task transitions (opaque internals)
 ├── mcp.call -> tools/call generate_report (task-augmented)
 │    └── tasks/status polling
 │    └── tasks/result (completed, returns ui:// resource)
 └── llm.chat (final synthesis)
```

一个 trace id。每个 span 都带正确的 `gen_ai.*` 属性。

### 安全姿态

- OAuth 2.1 + PKCE,resource indicator 把 audience 钉在网关上。
- 网关持有上游凭证;用户永远看不到。
- RBAC:`alice` 有 `research:read`、`research:write`,可调用所有工具。`bob` 有 `research:read`,不能调用 `generate_report`。
- 固定描述清单:任何工具哈希发生变化的服务器,直接丢弃。
- Rule of Two 审计:没有任何工具同时具备 不可信输入、敏感数据、重大后果动作 三要素。

### 渲染

最终的 `generate_report` 任务返回内容块加一个 `ui://report/current` 资源。客户端宿主(Claude Desktop 等)在沙箱 iframe 里渲染交互式仪表盘。仪表盘里有排序后的论文列表、引用数,以及一个按钮:用户点击任何论文,就调用 `host.callTool('summarize_paper', {arxiv_id})`。

### 打包

整个系统交付为:

```
research-system/
  AGENTS.md                     # project conventions
  skills/
    run-research/
      SKILL.md                  # the top-level workflow
  servers/
    research-mcp/               # the MCP server
      pyproject.toml
      src/
  agents/
    writer/                     # the A2A agent
  gateway/
    config.yaml                 # RBAC + pinned manifest
```

用户用 `docker compose up` 部署。Claude Code、Cursor、Codex 和 opencode 的用户,调用 `run-research` skill 就能驱动这个系统。

### 第 13 阶段每课各贡献了什么

| 课 | 毕业设计用到的 |
|--------|------------------------|
| 01-05 | 工具接口、厂商可移植、并行调用、schema、lint |
| 06-10 | MCP 原语、服务器、客户端、传输、resources + prompts |
| 11-14 | 采样、roots + elicitation、异步 tasks、`ui://` 应用 |
| 15-17 | 工具投毒、OAuth 2.1、网关 + 注册表 |
| 18 | A2A 子智能体委派 |
| 19 | OTel GenAI 追踪 |
| 20 | LLM 层的路由网关 |
| 21 | SKILL.md + AGENTS.md 打包 |

```figure
t3-capstone-chain
```

## 投入使用

`code/main.py` 把之前各课的模式缝成一个可运行 demo。全标准库、全进程内,你可以从头读到尾。它跑完"研究并成文"场景的完整流程:与网关握手、模拟 OAuth 2.1、合并 tools/list、以 task 形式跑 generate_report、A2A 调用 writer、返回 ui:// 资源、发射 OTel span。

重点看:

- 每一跳共享同一个 trace id。
- 网关策略挡住第二个用户的写操作。
- Task 生命周期走 working → completed,同时返回文本和 ui:// 内容。
- A2A 调用的内部状态对编排者不可见。
- AGENTS.md 和 SKILL.md 是另一个智能体复现这个工作流所需的全部文件。

## 交付

本课产出 `outputs/skill-ecosystem-blueprint.md`。给定一个产品需求(研究、摘要、自动化),该技能产出完整架构:用哪些 MCP 原语、哪些网关控制、哪些 A2A 调用、哪些遥测、怎么打包。

## 练习

1. 运行 `code/main.py`。注意单一的 trace id 和 span 的嵌套方式。数一数这个 demo 触到了第 13 阶段的多少个原语。

2. 扩展 demo:加第二个后端 MCP 服务器(如 `bibliography`),确认网关把它的工具合并进同一个命名空间。

3. 把假的 A2A 写作智能体换成跑在子进程里的真智能体。用第 19 课的测试台。

4. 在编排者与 LLM 之间的路由网关里加一步 PII 脱敏。确认用户查询里的邮箱被 scrub 掉。

5. 为将来维护这个系统的队友写一份 AGENTS.md。五分钟以内能读完,并给他用 Cursor 或 Codex 驱动这个毕业设计所需的一切。

## 关键术语

| 术语 | 大家口头的说法 | 实际含义 |
|------|----------------|------------------------|
| 毕业设计(Capstone) | "第 13 阶段集成 demo" | 用上每个原语的端到端系统 |
| 研究并成文 | "那个场景" | 搜索、总结、渲染的模式 |
| 生态 | "所有零件合一起" | 服务器 + 客户端 + 网关 + 子智能体 + 遥测 + 打包 |
| Trace 层级 | "单一 trace id" | 每一跳的 span 共享 trace;经 span id 连父子 |
| 网关签发的 token | "传递式授权" | 客户端只见网关的 token;上游凭证由网关持有 |
| 合并命名空间 | "所有工具一个扁平列表" | 网关上多服务器合并,撞名加前缀 |
| 黑盒边界 | "A2A 调用隐藏内部" | 子智能体的推理对编排者不可见 |
| 三层栈 | "AGENTS.md + SKILL.md + MCP" | 项目上下文 + 工作流 + 工具 |
| 纵深防御 | "多层安全" | 固定哈希、OAuth、RBAC、Rule of Two、审计日志 |
| 规范合规矩阵 | "我们交付了规范要求的什么" | 把交付物映射到 2025-11-25 规范要求的清单 |

## 延伸阅读

- [MCP — Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25) — 综合参考
- [MCP blog — 2026 roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/) — 协议的走向
- [a2a-protocol.org](https://a2a-protocol.org/latest/) — A2A v1.0 参考
- [OpenTelemetry — GenAI semconv](https://opentelemetry.io/docs/specs/semconv/gen-ai/) — 权威追踪约定
- [Anthropic — Claude Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview) — 生产智能体运行时模式
