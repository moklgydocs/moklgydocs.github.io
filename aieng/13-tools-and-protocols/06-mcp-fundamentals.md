# MCP 基础 —— 原语、生命周期、JSON-RPC 底座

> 在 MCP 之前，每个集成都是一次性的手工活。Model Context Protocol 由 Anthropic 在 2024 年 11 月首发，现在由 Linux 基金会旗下的 Agentic AI Foundation 托管，它把发现与调用标准化，让任何客户端都能和任何服务器对话。2025-11-25 版规范定义了六个原语（服务端三个、客户端三个）、三阶段生命周期和 JSON-RPC 2.0 线上格式。学会这些，本阶段 MCP 章节的其余部分就只是阅读了。

**类型：** Learn
**编程语言：** Python（标准库，JSON-RPC 解析器）
**前置要求：** 第 13 阶段 · 01 至 05（工具接口与函数调用）
**预计耗时：** 约 45 分钟

## 学习目标

- 说出全部六个 MCP 原语（服务端的 tools、resources、prompts；客户端的 roots、sampling、elicitation)，各给一个用例
- 走完三阶段生命周期（initialize、operation、shutdown)，说清每个阶段谁发什么消息
- 解析和生成 JSON-RPC 2.0 的 request、response、notification 信封
- 解释 `initialize` 时的能力协商是什么，没有它会坏掉什么

## 问题

MCP 之前，每个用工具的智能体都有自己的协议。Cursor 有一个形似 MCP 但不兼容的工具系统；Claude Desktop 自带另一个；VS Code 的 Copilot 扩展是第三个。一个团队做"Postgres 查询"工具，同一个工具要写三遍，分别对接三个宿主的 API。想复用？复制代码。

结果是寒武纪大爆发式的一次性集成，生态速度撞上了天花板。

MCP 通过标准化线上格式解决这个问题：一个 MCP 服务器能在每一个 MCP 客户端里工作——Claude Desktop、ChatGPT、Cursor、VS Code、Gemini、Goose、Zed、Windsurf，到 2026 年 4 月已有 300+ 客户端；SDK 月下载量 1.1 亿；公开服务器超过 1 万个。Linux 基金会于 2025 年 12 月在新成立的 Agentic AI Foundation 下接管了托管。

本阶段使用的规范版本是 **2025-11-25**。它新增了异步 Tasks(SEP-1686)、URL 模式 elicitation(SEP-1036)、带工具的 sampling(SEP-1577)、增量 scope 同意（SEP-835）和 OAuth 2.1 resource-indicator 语义。第 13 阶段 · 09 至 16 会讲这些扩展。本课只打地基。

## 概念

### 三个服务端原语

1. **Tools（工具）。** 可调用的动作。就是 第 13 阶段 · 01 那个四步循环。
2. **Resources（资源）。** 暴露的数据。只读内容，用 URI 寻址：`file:///path`、`db://query/...` 或自定义 scheme。
3. **Prompts（提示词）。** 可复用的模板。宿主 UI 里的斜杠命令：服务器供模板，客户端填参数。

### 三个客户端原语

4. **Roots（根范围）。** 服务器被允许触碰的 URI 集合。客户端声明，服务器遵守。
5. **Sampling（采样）。** 服务器请求客户端的模型执行一次补全。让服务器端能跑智能体循环，而不需要服务器自己持 API key。
6. **Elicitation（征询）。** 服务器在流程中途向客户端的用户请求结构化输入。表单或 URL(SEP-1036)。

MCP 里每一项能力都恰好属于这六个之一。第 13 阶段 · 10 至 14 逐个深入。

### 线上格式：JSON-RPC 2.0

每条消息都是一个 JSON 对象，字段如下：

- 请求：`{jsonrpc: "2.0", id, method, params}`。
- 响应：`{jsonrpc: "2.0", id, result | error}`。
- 通知：`{jsonrpc: "2.0", method, params}` —— 没有 `id`，不期待响应。

基础规范约 15 个方法，按原语分组。重要的几个：

- `initialize` / `initialized`（握手）
- `tools/list`、`tools/call`
- `resources/list`、`resources/read`、`resources/subscribe`
- `prompts/list`、`prompts/get`
- `sampling/createMessage`（服务器 → 客户端）
- `notifications/tools/list_changed`、`notifications/resources/updated`、`notifications/progress`

### 三阶段生命周期

**第 1 阶段：initialize。**

客户端发送 `initialize`，带自己的 `capabilities` 和 `clientInfo`。服务器响应自己的 `capabilities`、`serverInfo` 和它讲的规范版本。客户端消化完响应后，发送 `notifications/initialized`。从这里开始，双方按协商好的能力互发请求。

**第 2 阶段：operation。**

双向进行。客户端调 `tools/list` 发现，然后 `tools/call` 调用。声明了该能力的服务器可以发 `sampling/createMessage`。工具集变化时，服务器可以发 `notifications/tools/list_changed`。用户改了根范围时，客户端可以发 `notifications/roots/list_changed`。

**第 3 阶段：shutdown。**

任一方关闭传输层。MCP 没有结构化的 shutdown 方法；传输层（stdio 或 Streamable HTTP，见 第 13 阶段 · 09）承载连接结束信号。

### 能力协商

`initialize` 握手里的 `capabilities` 就是契约。服务器示例：

```json
{
  "tools": {"listChanged": true},
  "resources": {"subscribe": true, "listChanged": true},
  "prompts": {"listChanged": true}
}
```

服务器声明：它能发 `tools/list_changed` 通知，支持 `resources/subscribe`。客户端也声明自己的，作为应答：

```json
{
  "roots": {"listChanged": true},
  "sampling": {},
  "elicitation": {}
}
```

客户端没声明 `sampling`，服务器就不得调用 `sampling/createMessage`。对称地：服务器没声明 `resources.subscribe`，客户端就不得尝试订阅。

这就是防止生态漂移的机制。不支持 sampling 的客户端仍是合法的 MCP 客户端；不调 `sampling` 的服务器仍是合法的 MCP 服务器。它们只是不一起用那个特性。

### 结构化内容与错误形状

`tools/call` 返回一个类型化块的 `content` 数组：`text`、`image`、`resource`。第 13 阶段 · 14 会给这个列表加上 MCP Apps(`ui://` 交互界面）。

错误用 JSON-RPC 错误码。规范新增的：`-32002` "Resource not found"、`-32603` "Internal error"，外加放在 `error.data` 里的 MCP 专属错误数据。

### 客户端能力 vs 工具调用细节

一个常见混淆：`capabilities.tools` 表示客户端是否支持工具列表变更通知。客户端*会不会*调用某个具体工具，是它的模型在运行时的选择，不是能力标记。能力标记是规范层的契约，模型的选择是另一回事。

### 为什么用 JSON-RPC 而不是 REST?

JSON-RPC 2.0(2010）是轻量级的双向协议。REST 只能客户端发起。MCP 需要服务器发起的消息（sampling、通知），所以请求/响应形状对称的 JSON-RPC 是天作之合。JSON-RPC 在 stdio 和 WebSocket/Streamable HTTP 上也组合得很干净，不用重新发明 HTTP 的请求形状。

```figure
mcp-tool-call
```

## 投入使用

`code/main.py` 交付一个最小的 JSON-RPC 2.0 解析器与生成器，然后手动走一遍 `initialize` → `tools/list` → `tools/call` → `shutdown` 序列，打印每一条消息。没有真实传输层，只看消息形状。对照延伸阅读里的规范链接，逐个信封验证。

要看的地方：

- `initialize` 双向声明能力；响应里有 `serverInfo` 和 `protocolVersion: "2025-11-25"`。
- `tools/list` 返回 `tools` 数组；每项有 `name`、`description`、`inputSchema`。
- `tools/call` 用 `params.name` 和 `params.arguments`。
- 响应的 `content` 是 `{type, text}` 块的数组。

## 交付

本课产出 `outputs/skill-mcp-handshake-tracer.md`。给它一份 pcap 风格的 MCP 客户端-服务器交互记录，这个 skill 给每条消息标注：属于哪个原语、哪个生命周期阶段、依赖哪项能力。

## 练习

1. 跑 `code/main.py`。找出能力协商发生的那一行，描述如果服务器没声明 `tools.listChanged` 会有什么变化。

2. 扩展解析器，处理 `notifications/progress`。消息形状：`{method: "notifications/progress", params: {progressToken, progress, total}}`。在一个长时间运行的 `tools/call` 期间发出它，确认客户端处理器会显示进度条。

3. 把 MCP 2025-11-25 规范从头读到尾——全文约 80 页。找出大多数服务器并不需要的那一个能力标记。（提示：和资源订阅有关。)

4. 在纸上勾画一个假想的"定时任务"特性该归到哪个原语。（提示：服务器希望客户端在指定时间调用它。今天六个原语都不合适。)MCP 的 2026 路线图里有一份这方面的 SEP 草案。

5. 从 GitHub 上找一个开放的 MCP 服务器，解析它的一份会话日志。数一数 request、response、notification 各多少条，算出生命周期流量和操作流量的占比。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| MCP | "Model Context Protocol" | 模型与工具之间发现与调用的开放协议 |
| 服务端原语 | "服务器暴露什么" | tools（动作）、resources（数据）、prompts（模板） |
| 客户端原语 | "客户端让服务器用什么" | roots（范围）、sampling(LLM 回调）、elicitation（用户输入） |
| JSON-RPC 2.0 | "线上格式" | 对称的 request/response/notification 信封 |
| `initialize` 握手 | "能力协商" | 第一对消息；服务器与客户端声明各自支持的特性 |
| `tools/list` | "发现" | 客户端向服务器询问当前工具集 |
| `tools/call` | "调用" | 客户端让服务器带参数执行一个工具 |
| `notifications/*_changed` | "变更事件" | 服务器告知客户端它的原语清单变了 |
| 内容块 | "类型化结果" | 工具结果里的 `{type: "text" \| "image" \| "resource" \| "ui_resource"}` |
| SEP | "规范演进提案" | 有编号的草案提案（如异步 Tasks 的 SEP-1686) |

## 延伸阅读

- [Model Context Protocol —— 规范 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25) —— 权威规范文档
- [Model Context Protocol —— 架构概念](https://modelcontextprotocol.io/docs/concepts/architecture) —— 六原语心智模型
- [Anthropic —— Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) —— 2024 年 11 月发布文章
- [MCP 博客 —— MCP 一周年](https://blog.modelcontextprotocol.io/posts/2025-11-25-first-mcp-anniversary/) —— 一年回顾与 2025-11-25 规范变更
- [WorkOS —— MCP 2025-11-25 规范更新](https://workos.com/blog/mcp-2025-11-25-spec-update) —— SEP-1686、1036、1577、835、1724 综述
