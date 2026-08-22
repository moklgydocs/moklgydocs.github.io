# OpenTelemetry GenAI —— 端到端追踪工具调用

> 一个智能体调了 5 个工具、3 个 MCP 服务器和 2 个子智能体。你需要一条贯穿一切的 trace。OpenTelemetry GenAI 语义约定(v1.37 起属性稳定)就是 2026 年的标准,Datadog、Langfuse、Arize Phoenix、OpenLLMetry 和 AgentOps 都原生支持。本课点名必备属性,走完 span 层级(agent → LLM → tool),并交付一个可插进任何 OTel exporter 的标准库 span 发射器。

**类型:** 动手构建
**编程语言:** Python(标准库,OTel span 发射器)
**前置要求:** 第 13 阶段 · 07(MCP 服务器)、第 13 阶段 · 08(MCP 客户端)
**预计耗时:** 约 75 分钟

## 学习目标

- 说出 LLM span 和工具执行 span 的必备 OTel GenAI 属性。
- 构建覆盖智能体循环、LLM 调用、工具调用和 MCP 客户端分发的 trace 层级。
- 决定哪些内容要捕获(可选开启)、哪些要脱敏(默认)。
- 不改写工具代码,把 span 发到本地 collector(Jaeger、Langfuse)。

## 问题

2026 年 2 月的一次调试:用户报告"我的智能体有时 30 秒才响应,有时 3 秒"。没有 trace。日志里有 LLM 调用,但没有工具分发、没有 MCP 服务器往返、没有子智能体。你只能猜。最后你才发现:有个 MCP 服务器偶尔在冷启动时挂住。

没有端到端追踪,你永远找不到这个。OTel GenAI 解决了它。

这套约定在 2025-2026 年由 OpenTelemetry semantic-conventions 小组敲定。它定义了稳定的属性名,让 Datadog、Langfuse、Phoenix、OpenLLMetry 和 AgentOps 都能解析同样的 span。埋点一次,发到任何后端。

## 概念

### Span 层级

```
agent.invoke_agent  (top, INTERNAL span)
 ├── llm.chat       (CLIENT span)
 ├── tool.execute   (INTERNAL)
 │    └── mcp.call  (CLIENT span)
 ├── llm.chat       (CLIENT span)
 └── subagent.invoke (INTERNAL)
```

整棵树挂在同一个 trace id 下。span id 串起父子关系。

### 必备属性

按 2025-2026 semconv:

- `gen_ai.operation.name` —— `"chat"`、`"text_completion"`、`"embeddings"`、`"execute_tool"`、`"invoke_agent"`。
- `gen_ai.provider.name` —— `"openai"`、`"anthropic"`、`"google"`、`"azure_openai"`。
- `gen_ai.request.model` —— 请求的模型字符串(如 `"gpt-4o-2024-08-06"`)。
- `gen_ai.response.model` —— 实际服务的模型。
- `gen_ai.usage.input_tokens` / `gen_ai.usage.output_tokens`。
- `gen_ai.response.id` —— 厂商响应 id,用于关联。

工具 span:

- `gen_ai.tool.name` —— 工具标识。
- `gen_ai.tool.call.id` —— 具体调用 id。
- `gen_ai.tool.description` —— 工具描述(可选)。

智能体 span:

- `gen_ai.agent.name` / `gen_ai.agent.id` / `gen_ai.agent.description`。

### Span 种类

- `SpanKind.CLIENT` 用于跨进程边界的调用(LLM 厂商、MCP 服务器)。
- `SpanKind.INTERNAL` 用于智能体自己的循环步骤和工具执行。

### 可选开启的内容捕获

默认情况下,span 只带指标和计时——不带提示词或补全内容。大载荷和 PII 默认关闭。设 `OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental` 和相应的内容捕获环境变量,才会纳入内容。在生产开启之前,务必仔细审查。

### span 上的事件

token 级事件可以作为 span 事件添加:

- `gen_ai.content.prompt` —— 输入消息。
- `gen_ai.content.completion` —— 输出消息。
- `gen_ai.content.tool_call` —— 记录下的工具调用。

事件在 span 内按时间排序,供详细回放。

### Exporter

OTel span 可以导出到:

- **Jaeger / Tempo。** 开源,本地部署。
- **Langfuse。** LLM 可观测专用;可视化 token 用量。
- **Arize Phoenix。** 评测 + 追踪一体。
- **Datadog。** 商业;原生解析 `gen_ai.*` 属性。
- **Honeycomb。** 列式存储;查询友好。

它们都说 OTLP 这门线上语言。你的代码无需关心。

### 跨 MCP 的传播

MCP 客户端调用服务器时,把 W3C traceparent 头注入请求。可流式 HTTP 支持标准头;Stdio 原生不携带 HTTP 头,规范的 2026 路线图讨论了在 JSON-RPC 调用上加 `_meta.traceparent` 字段。

在该特性落地之前:手动把 traceparent 放进每个请求的 `_meta`。服务器端记录 trace id。

### 指标

span 之外,GenAI semconv 还定义了指标:

- `gen_ai.client.token.usage` —— 直方图。
- `gen_ai.client.operation.duration` —— 直方图。
- `gen_ai.tool.execution.duration` —— 直方图。

不需要逐调用细节的仪表盘,用这些。

### AgentOps 层

AgentOps(2024 年创立)专攻 GenAI 可观测。它包装主流框架(LangGraph、Pydantic AI、CrewAI)自动发射 OTel span。你的技术栈用了受支持的框架,用它很方便;否则就手动埋点。

```figure
t3-span-waterfall
```

## 投入使用

`code/main.py` 向 stdout 发射 OTel 形状的 span(类 OTLP-JSON 格式),场景是一个智能体调用 LLM、分发两个工具、做一次 MCP 往返。没有真实 exporter——本课聚焦 span 的形状和属性集。把输出粘进 OTLP 兼容的查看器,或直接阅读。

重点看:

- trace id 在所有 span 间共享。
- 父子链接通过 `parentSpanId` 编码。
- 必备的 `gen_ai.*` 属性都已填上。
- 内容捕获默认关闭;有一个场景通过环境变量打开它。

## 交付

本课产出 `outputs/skill-otel-genai-instrumentation.md`。给定一个智能体代码库,该技能产出埋点方案:在哪里加 span、填哪些属性、目标是哪些 exporter。

## 练习

1. 运行 `code/main.py`。数 span 个数,指出哪些是 CLIENT、哪些是 INTERNAL。

2. 打开内容捕获(环境变量),确认 `gen_ai.content.prompt` 和 `gen_ai.content.completion` 事件出现。注意这对 PII 的影响。

3. 加上工具执行指标 `gen_ai.tool.execution.duration`,每次调用发射一个直方图样本。

4. 把父智能体 span 的 traceparent 传播进 MCP 请求的 `_meta.traceparent` 字段。验证 MCP 服务器将看到同一个 trace id。

5. 读 OTel GenAI semconv 规范。找出一个规范里列出、但本课代码*没有*发射的属性,把它加上。

## 关键术语

| 术语 | 大家口头的说法 | 实际含义 |
|------|----------------|------------------------|
| OTel | "OpenTelemetry" | trace、指标、日志的开放标准 |
| GenAI semconv | "GenAI 语义约定" | LLM / 工具 / 智能体 span 的稳定属性名 |
| `gen_ai.*` | "那个属性命名空间" | 所有 GenAI 属性共享此前缀 |
| Span | "计时的操作" | 有开始、结束和属性的工作单元 |
| Trace | "跨 span 的谱系" | 共享一个 trace id 的 span 树 |
| SpanKind | "CLIENT / SERVER / INTERNAL" | 关于 span 方向的提示 |
| OTLP | "OpenTelemetry 线上协议" | exporter 的线格式 |
| 可选内容 | "提示词/补全捕获" | 默认关闭;环境变量开启 |
| traceparent | "W3C 头" | 跨服务传播 trace 上下文 |
| Exporter | "后端专属发货员" | 把 span 发到 Jaeger / Datadog 等的组件 |

## 延伸阅读

- [OpenTelemetry — GenAI semconv](https://opentelemetry.io/docs/specs/semconv/gen-ai/) — GenAI span、指标与事件的权威约定
- [OpenTelemetry — GenAI spans](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/) — LLM 与工具执行 span 属性清单
- [OpenTelemetry — GenAI agent spans](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/) — 智能体级 `invoke_agent` span
- [open-telemetry/semantic-conventions — GenAI spans](https://github.com/open-telemetry/semantic-conventions/blob/main/docs/gen-ai/gen-ai-spans.md) — GitHub 上的权威来源
- [Datadog — LLM OTel semantic convention](https://www.datadoghq.com/blog/llm-otel-semantic-convention/) — 生产集成实战
