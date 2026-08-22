# 函数调用深潜 —— OpenAI、Anthropic、Gemini

> 三家前沿厂商在 2024 年收敛到了同一个工具调用循环，然后在其余一切上分道扬镳。OpenAI 用 `tools` 和 `tool_calls`;Anthropic 用 `tool_use` 和 `tool_result` 块；Gemini 用 `functionDeclarations` 和唯一 id 对号。本课把三家并排做 diff，让你在一家上线的代码，移植到另一家时不至于散架。

**类型：** Build
**编程语言：** Python（标准库，schema 翻译器）
**前置要求：** 第 13 阶段 · 01（工具接口）
**预计耗时：** 约 75 分钟

## 学习目标

- 说出 OpenAI、Anthropic、Gemini 函数调用载荷的三处形状差异（声明、调用、结果）
- 把一份工具声明翻译成全部三家厂商的格式，预判严格模式约束的差异点
- 在各厂商中使用 `tool_choice` 来强制、禁止或自动选择工具调用
- 知道各厂商的硬上限（工具数量、schema 深度、参数长度），以及超限时的报错特征

## 问题

函数调用请求的形状因厂商而异。三个来自 2026 年生产技术栈的具体例子：

**OpenAI Chat Completions / Responses API。** 你传 `tools: [{type: "function", function: {name, description, parameters, strict}}]`。模型响应里是 `choices[0].message.tool_calls: [{id, type: "function", function: {name, arguments}}]`，其中 `arguments` 是一个 JSON 字符串，你得自己解析。严格模式（`strict: true`）用约束解码强制 schema 合规。

**Anthropic Messages API。** 你传 `tools: [{name, description, input_schema}]`。响应以 `content: [{type: "text"}, {type: "tool_use", id, name, input}]` 的形式回来。`input` 已经是解析好的对象，不是字符串。你回复时发一条新的 `user` 消息，内含 `{type: "tool_result", tool_use_id, content}` 块。

**Google Gemini API。** 你传 `tools: [{functionDeclarations: [{name, description, parameters}]}]`（嵌套在 `functionDeclarations` 下）。响应以 `candidates[0].content.parts: [{functionCall: {name, args, id}}]` 到来，其中 `id` 在 Gemini 3 及以上是唯一的，用于并行调用对号。你回复 `{functionResponse: {name, id, response}}`。

同一个循环，不同的字段名、不同的嵌套、不同的字符串-vs-对象约定、不同的对号机制。一个在 OpenAI 上写好天气智能体的团队，移植到 Anthropic 要花两天，移植到 Gemini 再花一天——全花在管道工程上。

本课构建一个翻译器：把三种格式统一成一份规范的工具声明，在边缘处路由。第 13 阶段 · 17 会把同一个模式泛化成 LLM 网关。

## 概念

### 共同结构

每家厂商都需要五样东西：

1. **工具清单。** 每个工具的名称、描述和输入 schema。
2. **工具选择。** 强制用某个工具、禁止用工具，或让模型自己定。
3. **调用发出。** 指名工具和参数的结构化输出。
4. **调用 id。** 把结果对回正确的调用（并行时很关键）。
5. **结果注入。** 把结果绑回调用的消息或块。

### 逐字段的形状差异

| 方面 | OpenAI | Anthropic | Gemini |
|--------|--------|-----------|--------|
| 声明信封 | `{type: "function", function: {...}}` | `{name, description, input_schema}` | `{functionDeclarations: [{...}]}` |
| Schema 字段 | `parameters` | `input_schema` | `parameters` |
| 响应容器 | assistant 消息上的 `tool_calls[]` | `content[]` 中类型为 `tool_use` 的块 | `parts[]` 中类型为 `functionCall` 的项 |
| 参数类型 | JSON 字符串 | 解析好的对象 | 解析好的对象 |
| id 格式 | `call_...`(OpenAI 生成） | `toolu_...`(Anthropic) | UUID(Gemini 3+) |
| 结果块 | 角色 `tool`，带 `tool_call_id` | `user` 消息含 `tool_result`，带 `tool_use_id` | `functionResponse`，带匹配的 `id` |
| 强制某工具 | `tool_choice: {type: "function", function: {name}}` | `tool_choice: {type: "tool", name}` | `tool_config: {function_calling_config: {mode: "ANY"}}` |
| 禁止工具 | `tool_choice: "none"` | `tool_choice: {type: "none"}` | `mode: "NONE"` |
| 严格 schema | `strict: true` | schema 即契约（始终强制） | 请求级的 `responseSchema` |

### 你实际会撞上的上限

- **OpenAI。** 每请求 128 个工具。schema 深度 5。参数字符串 ≤ 8192 字节。严格模式要求：不用 `$ref`、不用有重叠的 `oneOf`/`anyOf`/`allOf`、每个属性都列在 `required` 里。
- **Anthropic。** 每请求 64 个工具。schema 深度实际上不设限，但实用上限 10。没有严格模式开关；schema 就是契约，模型倾向于遵守。
- **Gemini。** 每请求 64 个函数。schema 类型是 OpenAPI 3.0 子集（与 JSON Schema 2020-12 略有出入）。Gemini 3 起并行调用带唯一 id。

### `tool_choice` 的行为

三种模式大家都支持，只是名字不同。

- **Auto。** 模型自己选工具或文本。默认。
- **Required / Any。** 模型必须至少调用一个工具。
- **None。** 模型不得调用工具。

外加每家一个独有模式：

- **OpenAI。** 按名称强制指定工具。
- **Anthropic。** 按名称强制指定工具；`disable_parallel_tool_use` 开关区分单发与多发。
- **Gemini。** `mode: "VALIDATED"` 让每份响应都过 schema 校验器，不管模型意图如何。

### 并行调用

OpenAI 的 `parallel_tool_calls: true`（默认）在一条 assistant 消息里发出多个调用。你全部执行完，回一条批量 tool 角色消息，每个 `tool_call_id` 一项。Anthropic 历史上是单调用；`disable_parallel_tool_use: false`(Claude 3.5 起为默认）开启多调用。Gemini 2 允许并行调用但没有稳定 id;Gemini 3 加了 UUID，乱序返回也能干净地对号。

### 流式

三家都支持流式工具调用，但线上格式不同：

- **OpenAI。** `tool_calls[i].function.arguments` 的增量片段陆续到达，累积到 `finish_reason: "tool_calls"` 为止。
- **Anthropic。** block-start / block-delta / block-stop 事件，`input_json_delta` 片段携带部分参数。
- **Gemini。** `streamFunctionCallArguments`(Gemini 3 新增）发出的片段带 `functionCallId`，多个并行调用可以交错。

第 13 阶段 · 03 深挖并行 + 流式重组。本课聚焦声明和单调用形状。

### 错误与修复

参数非法的错误，长得也不一样。

- **OpenAI（非严格）。** 模型返回 `arguments: "{bad json}"`，你的 JSON 解析失败，注入错误消息后重新调用。
- **OpenAI（严格）。** 校验发生在解码阶段，非法 JSON 不可能出现，但可能出现 `refusal`。
- **Anthropic。** `input` 可能含有意料之外的字段；schema 是建议性的，要在服务端校验。
- **Gemini。** OpenAPI 3.0 的怪癖：对象字段上的 `enum` 会被静默忽略，自己校验。

### 翻译器模式

你代码里的一份规范工具声明长这样（形状你自己定）:

```python
Tool(
    name="get_weather",
    description="Use when ...",
    input_schema={"type": "object", "properties": {...}, "required": [...]},
    strict=True,
)
```

三个小函数把它翻译成三家厂商的形状。`code/main.py` 里的架子做的就是这件事，然后把一个手工构造的工具调用在每家厂商的响应形状里往返一遍。不需要联网——本课教的是形状，不是 HTTP。

生产团队把这个翻译器包进 `AbstractToolset`(Pydantic AI)、`UniversalToolNode`(LangGraph）或 `BaseTool`(LlamaIndex)。第 13 阶段 · 17 会交付一个网关：对外暴露 OpenAI 形状的 API，背后接任意一家。

```figure
function-call-args
```

## 投入使用

`code/main.py` 定义了一个规范的 `Tool` dataclass 和三个翻译器，分别产出 OpenAI、Anthropic、Gemini 的声明 JSON。然后把手工构造的三家响应各自解析回同一个规范调用对象，证明皮囊之下语义完全相同。跑一遍，把三份声明并排 diff。

要看的地方：

- 三个声明块的差别只在信封和字段名。
- 三个响应块的差别在调用住的位置（顶层 `tool_calls`、`content[]` 块、`parts[]` 项）。
- 一个 `canonical_call()` 函数能从全部三种响应形状里提取出 `{id, name, args}`。

## 交付

本课产出 `outputs/skill-provider-portability-audit.md`。给它一份针对某家厂商的函数调用集成，这个 skill 产出可移植性审计：它依赖了哪些厂商上限、哪些字段要改名、移植到其他两家时会坏掉什么。

## 练习

1. 跑 `code/main.py`，验证三份厂商声明 JSON 序列化的是同一个底层 `Tool` 对象。给规范工具加一个 enum 参数，确认只有 Gemini 翻译器需要处理 OpenAPI 怪癖。

2. 为每家厂商写一个 `ListToolsResponse` 解析器，提取模型在 `list_tools` 或发现调用后返回的工具清单。OpenAI 原生没有这个接口——记下这个不对称。

3. 实现 `tool_choice` 转换：把规范的 `ToolChoice(mode="force", tool_name="x")` 映射到三家厂商的形状，再映射 `mode="any"` 和 `mode="none"`。对照本课的 diff 表。

4. 挑一家厂商，把它的函数调用指南从头读到尾。找出它的 schema 规范里另外两家不支持的一个字段。候选：OpenAI 的 `strict`、Anthropic 的 `disable_parallel_tool_use`、Gemini 的 `function_calling_config.allowed_function_names`。

5. 写一个测试向量：一个参数违反声明 schema 的工具调用。让它过每家厂商的校验器（第 01 课的标准库校验器可以当代理），记录触发了哪些错误。写下你在生产环境会选哪家来保证严格性。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| 函数调用 | "工具使用" | 发出结构化工具调用的厂商级 API |
| 工具声明 | "工具规格" | 名称 + 描述 + JSON Schema 输入载荷 |
| `tool_choice` | "强制 / 禁止" | auto / required / none / 指定名称 等模式 |
| 严格模式 | "schema 强制" | OpenAI 的开关，约束解码使其匹配 schema |
| `tool_use` 块 | "Anthropic 的调用形状" | 内联内容块，带 id、name、input |
| `functionCall` 项 | "Gemini 的调用形状" | `parts[]` 中的一项，含 name、args、id |
| 字符串化参数 | "Stringified JSON" | OpenAI 把 args 作为 JSON 字符串返回，不是对象 |
| 并行工具调用 | "一轮扇出" | 一条 assistant 消息里发出多个工具调用 |
| 拒绝（Refusal) | "模型婉拒" | 仅严格模式：返回拒绝块而不是调用 |
| OpenAPI 3.0 子集 | "Gemini 的 schema 怪癖" | Gemini 使用一种与 JSON Schema 类似但有小差异的方言 |

## 延伸阅读

- [OpenAI —— 函数调用指南](https://platform.openai.com/docs/guides/function-calling) —— 权威参考，含严格模式与并行调用
- [Anthropic —— 工具使用概览](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview) —— `tool_use` 与 `tool_result` 块语义
- [Google —— Gemini 函数调用](https://ai.google.dev/gemini-api/docs/function-calling) —— 并行调用、唯一 id 与 OpenAPI 子集
- [Vertex AI —— 函数调用参考](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/function-calling) —— Gemini 的企业级界面
- [OpenAI —— 结构化输出](https://platform.openai.com/docs/guides/structured-outputs) —— 严格模式的 schema 强制细节
