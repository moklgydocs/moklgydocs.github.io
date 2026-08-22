# OpenAI Agents SDK:Handoff、护栏、追踪

> OpenAI Agents SDK 是建在 Responses API 上的轻量多智能体框架。五个原语:Agent、Handoff、Guardrail、Session、Tracing。Handoff 是名为 `transfer_to_<agent>` 的工具;Guardrail 在输入或输出上触发;Tracing 默认开启。

**类型:** 学习 + 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 01(智能体循环)、第 14 阶段 · 06(工具使用)
**预计耗时:** 约 75 分钟

## 学习目标

- 说出 OpenAI Agents SDK 的五个原语。
- 解释 handoff:为什么建模成工具、模型看到的名字形状、上下文如何传递。
- 区分输入护栏、输出护栏、工具护栏;解释 `run_in_parallel` 与阻塞模式。
- 用纯标准库实现一个带 handoff + 护栏 + span 式追踪的运行时。

## 问题

不会干净委派的智能体,最后把所有东西塞进一个提示词;没有护栏的智能体,会输出 PII、违反政策的内容,或永远循环。OpenAI 的 SDK 把让多智能体工作变得可控的三个原语固定了下来。

## 概念

### 五个原语

1. **Agent。** LLM + 指令 + 工具 + handoff。
2. **Handoff。** 委派给另一个智能体。对模型呈现为名为 `transfer_to_<agent_name>` 的工具。
3. **Guardrail。** 在输入(仅第一个智能体)、输出(仅最后一个智能体)或工具调用(逐函数工具)上的校验。
4. **Session。** 跨轮自动对话历史。
5. **Tracing。** 内置 span:LLM 生成、工具调用、handoff、护栏。

### 作为工具的 handoff

模型在它的工具列表里看到 `transfer_to_billing_agent`。调用它,运行时就:

1. 拷贝对话上下文(或通过 beta 的 `nest_handoff_history` 折叠)。
2. 用目标智能体的指令初始化它。
3. 以目标智能体继续运行。

这就是产品化的 supervisor 模式(第 13 / 28 课)。

### 护栏

三种口味:

- **输入护栏。** 在第一个智能体的输入上运行。在任何 LLM 调用之前,拒掉不安全或越界的请求。
- **输出护栏。** 在最后一个智能体的输出上运行。抓 PII 泄漏、政策违规、格式错误响应。
- **工具护栏。** 逐函数工具运行。校验参数、检查权限、审计执行。

模式:

- **并行(默认)。** 护栏 LLM 与主 LLM 并排跑。尾延迟更低。若触发,主 LLM 的工作被丢弃(token 浪费)。
- **阻塞**(`run_in_parallel=False`)。护栏 LLM 先跑。若触发,主调用一个 token 都不浪费。

触发时抛出 `InputGuardrailTripwireTriggered` / `OutputGuardrailTripwireTriggered`。

### 追踪

默认开启。每次 LLM 生成、工具调用、handoff、护栏都发出一个 span。`OPENAI_AGENTS_DISABLE_TRACING=1` 可关闭。`add_trace_processor(processor)` 把 span 扇出到你自己的后端,与 OpenAI 的并行。

### 会话

`Session` 把对话历史存在后端(SQLite、Redis、自定义)。`Runner.run(agent, input, session=session)` 自动加载与追加。

### 这个模式在哪里出错

- **handoff 打转转。** 智能体 A 交给 B,B 又交回 A。加跳数计数器。
- **护栏绕过。** 工具护栏只在函数工具上触发;内置工具(文件读取、网页抓取)需要单独的政策。
- **过度追踪。** span 里的敏感内容。配合 OTel GenAI 内容捕获规则(第 23 课)——外部存储,按 ID 引用。

```figure
ae-agent-handoff
```

## 动手构建

`code/main.py` 用纯标准库实现 SDK 的形状:

- `Agent`、`FunctionTool`、`Handoff`(带转移语义的函数工具)。
- `Runner`:输入/输出/工具护栏、handoff 派发、跳数计数器。
- 一个简单 span 发射器,展示轨迹形状。
- 一个分诊智能体:按用户查询交给 billing 或 support;护栏在一个输入上触发。

运行:

```
python3 code/main.py
```

轨迹展示:两次成功的 handoff、一次输入护栏触发,以及一棵与真实 SDK 发射形状一致的 span 树。

## 投入使用

- **OpenAI Agents SDK**:OpenAI 优先的产品。
- **Claude Agent SDK**(第 17 课):Claude 优先的产品。
- **LangGraph**(第 13 课):要显式状态和持久恢复时。
- **自建**:需要精确控制时(语音、多提供商、联邦部署)。

## 交付

`outputs/skill-agents-sdk-scaffold.md`:搭一个 Agents SDK 应用,含分诊智能体、handoff、输入/输出/工具护栏、会话存储和 trace 处理器。

## 练习

1. 加 handoff 跳数计数器:N 次转移后拒绝。追踪行为。
2. 把 `nest_handoff_history` 实现为选项——转移前把先前消息折叠成一条摘要。
3. 写一个阻塞式输出护栏。对比会触发它与会通过它的提示词的延迟。
4. 把 `add_trace_processor` 接到一个 JSON 日志器。每个 span 发出什么形状?
5. 读 SDK 文档。把你的标准库玩具移植到 `openai-agents-python`。你哪里建模错了?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| Agent | "LLM + 指令" | SDK 中的 Agent 类型;持有工具与 handoff |
| Handoff | "转移" | 模型调用来委派给另一智能体的工具 |
| Guardrail | "政策检查" | 在输入/输出/工具调用上的校验 |
| Tripwire | "护栏触发" | 护栏拒绝时抛出的异常 |
| Session | "历史存储" | 跨运行持久的对话记忆 |
| Tracing | "span" | 覆盖 LLM + 工具 + handoff + 护栏的内置可观测性 |
| 阻塞护栏 | "顺序检查" | 护栏先跑;触发时不浪费 token |
| 并行护栏 | "并发检查" | 护栏并排跑;延迟更低,触发时浪费 token |

## 延伸阅读

- [OpenAI Agents SDK 文档](https://openai.github.io/openai-agents-python/) —— 原语、handoff、护栏、追踪
- [Claude Agent SDK 概览](https://platform.claude.com/docs/en/agent-sdk/overview) —— Claude 口味的对应物
- [Anthropic,《构建高效智能体》](https://www.anthropic.com/research/building-effective-agents) —— 何时才该用 handoff
- [OpenTelemetry GenAI 语义约定](https://opentelemetry.io/docs/specs/semconv/gen-ai/) —— Agents SDK 的 span 所映射的标准
