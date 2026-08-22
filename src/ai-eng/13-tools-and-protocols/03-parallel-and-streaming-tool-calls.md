# 并行工具调用与流式工具调用

> 三次独立的天气查询串行做，就是三个来回。并行跑，总耗时塌缩为最慢那一次调用的时间。如今每家前沿厂商都能在单轮里发出多个工具调用。收益是真的，管道工程是微妙的。本课两半都讲：并行扇出和流式参数重组，重点在 id 对号这个坑。

**类型：** Build
**编程语言：** Python（标准库，线程池 + 流式架子）
**前置要求：** 第 13 阶段 · 02（函数调用深潜）
**预计耗时：** 约 75 分钟

## 学习目标

- 解释 `parallel_tool_calls: true` 为什么存在，什么时候该关掉它
- 在并行扇出时，把流式参数片段对回正确的工具调用 id
- 把残缺的 `arguments` 字符串拼成完整 JSON，不提前解析
- 跑一个三城市天气基准，演示串行与并行的延迟差异

## 问题

没有并行调用，智能体回答"班加罗尔、东京和苏黎世天气如何"的流程是这样：

```
user -> LLM
LLM -> call get_weather(Bengaluru)
host -> run executor, reply with result
LLM -> call get_weather(Tokyo)
host -> run executor, reply with result
LLM -> call get_weather(Zurich)
host -> run executor, reply with result
LLM -> final text answer
```

三次 LLM 往返，每次还要搭上执行器延迟。墙上时钟时间大约是理想值的 4 倍。

有了并行调用：

```
user -> LLM
LLM -> call get_weather(Bengaluru); call get_weather(Tokyo); call get_weather(Zurich)
host -> run all three executors concurrently, reply with three results
LLM -> final text answer
```

一次 LLM 往返。执行器耗时是三者最大值，不是总和。OpenAI、Anthropic、Gemini 的生产基准显示，扇出型负载的墙上时钟下降 60-70%。

代价是对号变复杂了。三个调用乱序完成时，你返回的结果必须带匹配的 `tool_call_id`，模型才能对上线。结果流式到达时，你必须先把零碎的参数片段拼成完整 JSON 才能执行。Gemini 3 加唯一 id，部分原因就是要解决一个真实问题：对同一个工具的两个并行调用无法区分。

## 概念

### 开启并行

- **OpenAI。** `parallel_tool_calls: true` 默认开。设 `false` 强制串行。
- **Anthropic。** 通过 `disable_parallel_tool_use: false` 开并行（Claude 3.5 起为默认）。设 `true` 则串行。
- **Gemini。** 始终支持并行；`tool_config.function_calling_config.mode = "AUTO"` 让模型自己定。

这些情况要关掉并行：工具之间有顺序依赖（先 `create_file` 再 `write_file`)；一个调用的输出是另一个调用的输入；限流器扛不住扇出。

### id 对号

模型发出的每个调用都有 `id`。宿主返回的每个结果必须带同一个 id。没有它，结果就分不清谁是谁。

- **OpenAI。** 每条 tool 角色消息带 `tool_call_id`。
- **Anthropic。** 每个 `tool_result` 块带 `tool_use_id`。
- **Gemini。** 每个 `functionResponse` 带 `id`(Gemini 3 起；Gemini 2 按名称对号，同名并行调用会崩）。

### 并发执行调用

宿主把每个调用的执行器放到自己的线程、协程或远程 worker 上跑。最简单的架子用线程池；生产用 asyncio 加 `asyncio.gather` 或结构化并发。完成顺序不可预测——id 才是身份。

一个常见 bug：按调用列表的顺序而不是完成顺序回结果。通常没事，因为模型只看 `tool_call_id`；但如果某个结果丢了或重了，乱序提交会让调试更难。建议按完成顺序、带显式 id 回复。

### 流式工具调用

模型流式输出时，`arguments` 是一段一段来的。三个并行调用的三股片段流，在线上是交错的。每个 id 需要一个单独的累加器。

各家形状：

- **OpenAI。** 每个片段是 `choices[0].delta.tool_calls[i].function.arguments`（部分字符串），片段带 `index`（在调用列表里的位置）。按 index 累积，`id` 首次出现时记下，`finish_reason = "tool_calls"` 时解析 JSON。
- **Anthropic。** 流事件是 `message_start`，然后每个块一个 `content_block_start`，类型为 `tool_use`（含 id、name、空 input)。`content_block_delta` 事件携带 `input_json_delta` 片段。`content_block_stop` 关闭每个块。
- **Gemini。** `streamFunctionCallArguments`(Gemini 3 起）发出的片段带 `functionCallId`，调用之间干净交错。Gemini 3 之前，流式一次只返回一个完整调用。

### 残缺 JSON 与提前解析的坑

在 `arguments` 完整之前，你不能解析它。`{"city": "Beng` 这样的残缺 JSON 不合法，直接报错。正确的闸门是厂商的"调用结束"信号：OpenAI 的 `finish_reason = "tool_calls"`、Anthropic 的 `content_block_stop`、或 Gemini 的流结束事件。到那一步才 `json.loads`。更稳的做法是用增量 JSON 解析器，结构完整一部分就吐一个事件；OpenAI 的流式指南推荐用它来做实时"思考中"指示的 UX。数括号不是可靠的完整性判据（引号字符串里或转义内容中的括号会造成误判），只能当非正式的调试启发式用。

### 乱序完成

```
call_A: fast API, returns first
call_B: slow API, returns second
call_C: median API, returns third
```

宿主的回复仍要引用 id:

```
[{role: "tool", tool_call_id: "call_A", content: ...},
 {role: "tool", tool_call_id: "call_B", content: ...},
 {role: "tool", tool_call_id: "call_C", content: ...}]
```

在 OpenAI 和 Anthropic 上，回复顺序不影响正确性。Gemini 也接受任意顺序，只要 id 匹配。

### 基准：串行 vs 并行

`code/main.py` 的架子模拟三个延迟分别为 400、600、800ms 的执行器。串行总耗时 1800ms；并行是 max(400, 600, 800) = 800ms。差距是恒定的，不是成比例的，所以工具越多，省得越多。

真实世界的警告：并行调用会冲击下游 API。对着一个限流的服务做 10 路扇出，一定会挂。第 13 阶段 · 17 讲网关级背压；重试语义计划在后续阶段讲。

### 流式扇出的墙上时钟

如果模型本身在流式输出，你可以在某个调用的参数一完整就开始执行，而不是等所有调用都定型。这是 OpenAI 文档里写了的优化，但不是所有 SDK 都暴露。本课的架子做到了：模拟流一产出完整的参数对象，宿主立刻启动那个调用。

```figure
tp-parallel-fanout
```

## 投入使用

`code/main.py` 分两半。前半用 `concurrent.futures.ThreadPoolExecutor` 把三个模拟天气调用分别串行和并行跑一遍，打印墙上时钟。后半回放一段伪造的流式响应——三个并行调用的 `arguments` 片段交错在一条流上——用 `StreamAccumulator` 按 id 重组。没有 LLM，没有网络，只有重组逻辑。

要看的地方：

- 串行计时器显示 1.8 秒，并行计时器在同样的假延迟下显示 0.8 秒。
- 累加器通过按 id 缓冲来处理乱序到达的片段，只在每个调用的 JSON 完整时才解析。
- 执行器在某个 id 的参数一定型就启动，不等所有流结束。

## 交付

本课产出 `outputs/skill-parallel-call-safety-check.md`。给它一个工具注册表，这个 skill 审计哪些工具可以安全并行、哪些有顺序依赖、哪些会打爆下游限流——返回一份带逐工具 `parallel_safe` 标记的修订注册表。

## 练习

1. 跑 `code/main.py` 并改变模拟延迟。确认并行与串行的比值约等于 `max/sum`（真实运行会略微偏离理想值，因为线程调度、序列化和架子开销）。在什么样的延迟分布下，并行就不再重要了？

2. 扩展累加器，处理"调用在流中途被取消"的情况：丢弃它的缓冲并发出 `cancelled` 事件。哪家厂商明确文档化了这种情况？查 Anthropic 的 `content_block_stop` 语义和 OpenAI 的 `finish_reason: "length"` 行为。

3. 把线程池换成 `asyncio.gather`，给两者计时。你应该能看到 async 的小幅优势（上下文切换成本更低），但前提是执行器做的是真实 I/O。

4. 挑两个不该并行的工具（比如 `create_file` 然后 `write_file`)。给注册表加一张 `ordering_dependency` 图，并让并行扇出受这张图门控。这是依赖感知调度的最小机制，后续的智能体工程阶段会把它形式化。

5. 读 OpenAI 的并行函数调用章节和 Anthropic 的 `disable_parallel_tool_use` 文档。找出 Anthropic 建议关闭并行的那一类真实工具。（提示：对同一资源的后果性变更。)

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| 并行工具调用 | "一轮扇出" | 模型在一条 assistant 消息里发出多个工具调用 |
| `parallel_tool_calls` | "OpenAI 的开关" | 开启或关闭多调用发出 |
| `disable_parallel_tool_use` | "Anthropic 的反开关" | 退出并行的开关；默认并行开启 |
| 工具调用 id | "对号把手" | 每个调用的标识符，结果消息必须原样带回 |
| 累加器（Accumulator) | "流缓冲" | 按 id 缓存残缺 `arguments` 片段的字符串缓冲区 |
| 乱序完成 | "快的先回" | 并行调用的完成顺序不可预测，id 是胶水 |
| 依赖图 | "顺序约束" | 输出喂给其他工具输入的工具，不能并行 |
| 提前解析的坑 | "JSON.parse 炸了" | 试图解析不完整的 `arguments` 字符串 |
| `streamFunctionCallArguments` | "Gemini 3 特性" | 带每调用唯一 id 的流式参数片段 |
| 按完成顺序回复 | "不等齐" | 结果一到就按 id 回复，不等全部完成 |

## 延伸阅读

- [OpenAI —— 并行函数调用](https://platform.openai.com/docs/guides/function-calling#parallel-function-calling) —— 默认行为与退出开关
- [Anthropic —— 工具使用：实现](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/implementing-tool-use) —— `disable_parallel_tool_use` 与结果批处理
- [Google —— Gemini 函数调用并行章节](https://ai.google.dev/gemini-api/docs/function-calling) —— Gemini 3 起按 id 对号的并行调用
- [OpenAI —— 带工具的流式响应](https://platform.openai.com/docs/api-reference/responses-streaming) —— OpenAI 流的片段参数重组
- [Anthropic —— 流式消息](https://docs.anthropic.com/en/api/messages-streaming) —— 带 `input_json_delta` 的 `content_block_delta`
