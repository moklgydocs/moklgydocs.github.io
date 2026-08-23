# OpenTelemetry GenAI 语义约定

> OpenTelemetry 的 GenAI SIG(2024 年 4 月成立)定义了智能体遥测的标准 schema。span 名称、属性和内容捕获规则在各厂商之间收敛,让智能体链路在 Datadog、Grafana、Jaeger 和 Honeycomb 里含义一致。

**类型:** 学习 + 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 13(LangGraph),第 14 阶段 · 24(可观测性平台)
**预计耗时:** 约 60 分钟

## 学习目标

- 说出 GenAI 的 span 类别:model/client、agent、tool
- 区分 `invoke_agent` 的 CLIENT 与 INTERNAL span,以及各自的适用场景
- 列出顶层 GenAI 属性:provider name、request model、data-source ID
- 解释内容捕获契约:默认 opt-in、`OTEL_SEMCONV_STABILITY_OPT_IN`、外部引用推荐

## 问题

每个厂商都自己发明 span 名称,运维团队最后只能为每个框架单独搭仪表盘。OpenTelemetry 的 GenAI SIG 用一套全生态共同瞄准的标准解决了这个问题。

## 概念

### Span 类别

1. **模型 / 客户端 span。** 覆盖原始 LLM 调用,由提供方 SDK(Anthropic、OpenAI、Bedrock)和框架的模型适配器发出。
2. **智能体 span。** `create_agent`(智能体被构建时)和 `invoke_agent`(它运行时)。
3. **工具 span。** 每次工具调用一个,以父子关系挂在智能体 span 下。

### 智能体 span 命名

- span 名:有名字时为 `invoke_agent {gen_ai.agent.name}`,否则回退为 `invoke_agent`。
- span 类型(kind):
  - **CLIENT**——远程智能体服务(OpenAI Assistants API、Bedrock Agents)。
  - **INTERNAL**——进程内智能体框架(LangChain、CrewAI、本地 ReAct)。

### 关键属性

- `gen_ai.provider.name`——`anthropic`、`openai`、`aws.bedrock`、`google.vertex`。
- `gen_ai.request.model`——请求的模型 ID。
- `gen_ai.response.model`——实际解析到的模型(可能因路由与请求不同)。
- `gen_ai.agent.name`——智能体标识。
- `gen_ai.operation.name`——`chat`、`completion`、`invoke_agent`、`tool_call`。
- `gen_ai.data_source.id`——RAG 场景:本次检索命中了哪个语料库或存储。

针对 Anthropic、Azure AI Inference、AWS Bedrock、OpenAI 还有各自的技术专属约定。

### 内容捕获

默认规则:埋点 SHOULD NOT 默认捕获输入/输出。捕获是 opt-in 的,通过:

- `gen_ai.system_instructions`
- `gen_ai.input.messages`
- `gen_ai.output.messages`

推荐的生产模式:内容存到外部(S3、你的日志存储),span 上只记引用(指针 ID,不是正文)。这就是把第 27 课的内容投毒防御接进可观测性的做法。

### 稳定性

截至 2026 年 3 月,大多数约定仍是实验性。用以下方式开启稳定预览:

```
OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental
```

Datadog v1.37+ 把 GenAI 属性原生映射进它的 LLM Observability schema;其他后端(Grafana、Honeycomb、Jaeger)支持原始属性。

### 这个模式在哪里会走歪

- **在 span 里捕获完整提示词。** PII、密钥、客户数据进了运维能看到的链路里。要存外部。
- **不设 `gen_ai.provider.name`。** 缺失归属信息时,多提供方仪表盘直接碎掉。
- **span 没有父链接。** 孤儿工具 span。永远传播上下文。
- **不设稳定性 opt-in。** 后端升级时你的属性可能被改名。

```figure
ae-genai-span-tree
```

## 动手构建

`code/main.py` 用标准库实现了一个符合 GenAI 约定的 span 发射器:

- 带 GenAI 属性 schema 的 `Span`。
- 带 `start_span`、嵌套上下文的 `Tracer`。
- 一个脚本化的智能体运行,发出:`create_agent`、`invoke_agent`(INTERNAL)、逐工具 span、LLM 调用的 `chat` span。
- 一个内容捕获模式:提示词存外部,span 上只记 ID。

运行:

```
python3 code/main.py
```

输出:一棵带全部必需 GenAI 属性的 span 树,以及展示 opt-in 内容引用的"外部存储"。

## 投入使用

- **Datadog LLM Observability**(v1.37+)原生映射属性。
- **Langfuse / Phoenix / Opik**(第 24 课)——自动埋点整个生态。
- **Jaeger / Honeycomb / Grafana Tempo**——原始 OTel 链路;用 GenAI 属性搭仪表盘。
- **自托管**——跑 OTel Collector,配 GenAI 处理器。

## 交付

`outputs/skill-otel-genai.md` 把 OTel GenAI span 接进一个现有智能体,带内容捕获默认值与外部引用存储。

## 练习

1. 给你的第 01 课 ReAct 循环加上 `invoke_agent`(INTERNAL)+ 逐工具 span 埋点,发送到一个 Jaeger 实例。
2. 以"仅引用"模式加内容捕获:提示词存 SQLite,span 属性只带行 ID。
3. 阅读 `gen_ai.data_source.id` 的规范,把它接进你第 09 课的 Mem0 搜索。
4. 设置 `OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental`,验证你的属性不会被 collector 改名。
5. 搭一个仪表盘:仅凭 GenAI 属性回答"哪些工具报错与哪些模型相关"。

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|----------------|------------------------|
| GenAI SIG | "OpenTelemetry 的 GenAI 组" | 定义这套 schema 的 OTel 工作组 |
| invoke_agent | "智能体 span" | 表示一次智能体运行的 span 名称 |
| CLIENT span | "远程调用" | 调用远程智能体服务的 span |
| INTERNAL span | "进程内" | 进程内智能体运行的 span |
| gen_ai.provider.name | "提供方" | anthropic / openai / aws.bedrock / google.vertex |
| gen_ai.data_source.id | "RAG 来源" | 一次检索命中了哪个语料库/存储 |
| 内容捕获(Content capture) | "提示词日志" | 对消息的 opt-in 捕获;生产中存外部 |
| 稳定性 opt-in(Stability opt-in) | "预览模式" | 钉住实验性约定的环境变量 |

## 延伸阅读

- [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)——规范原文
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)——默认发 GenAI span
- [AutoGen v0.4 (Microsoft Research)](https://www.microsoft.com/en-us/research/articles/autogen-v0-4-reimagining-the-foundation-of-agentic-ai-for-scale-extensibility-and-robustness/)——内置 OTel span
- [Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview)——W3C trace context 传播
