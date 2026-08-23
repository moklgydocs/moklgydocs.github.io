# 构建 MCP 客户端 —— 发现、调用、会话管理

> 大多数 MCP 内容都是服务器教程，对客户端一笔带过。而难的编排恰恰在客户端代码里：拉起进程、能力协商、跨多服务器的工具清单合并、sampling 回调、重连、命名冲突解决。本课构建一个多服务器客户端，把三个不同的 MCP 服务器抬进一个扁平的工具命名空间，供模型使用。

**类型：** Build
**编程语言：** Python（标准库，多服务器 MCP 客户端）
**前置要求：** 第 13 阶段 · 07（构建 MCP 服务器）
**预计耗时：** 约 75 分钟

## 学习目标

- 以子进程方式拉起 MCP 服务器，完成 `initialize`，并发出 `notifications/initialized`
- 维护每个服务器的会话状态（能力、工具清单、最后见到的通知 id)
- 把多个服务器的工具清单合并成一个命名空间，处理好冲突
- 把工具调用路由给拥有它的服务器，并组装响应

## 问题

真实的智能体宿主（Claude Desktop、Cursor、Goose、Gemini CLI）同时加载多个 MCP 服务器。用户可能同时跑着一个文件系统服务器、一个 Postgres 服务器和一个 GitHub 服务器。客户端的活儿：

1. 拉起每个服务器。
2. 各自独立握手。
3. 对每个调 `tools/list`，把结果拍平。
4. 模型发出 `notes_search` 时，在合并后的命名空间里查它，路由到正确的服务器。
5. 处理来自任意服务器的通知（`tools/list_changed`)，不阻塞主流程。
6. 传输失败时重连。

把这一整套手搓出来，就是"玩具"和"能用"的分水岭。官方 SDK 把这些包了，但心智模型必须是你自己的。

## 概念

### 拉起子进程

用 `subprocess.Popen`，参数 `stdin=PIPE, stdout=PIPE, stderr=PIPE`。设 `bufsize=1` 并用文本模式，按行读。每个服务器一个进程；客户端为每个服务器持有一个 `Popen` 句柄。

### 每服务器会话状态

每个服务器一个 `Session` 对象，持有：

- `process` —— Popen 句柄。
- `capabilities` —— 服务器在 `initialize` 时声明的能力。
- `tools` —— 最近一次 `tools/list` 的结果。
- `pending` —— 请求 id 到等待响应的 promise/future 的映射。

请求天然是异步的：发给服务器 A 的 `tools/call`，不能因为服务器 B 正在调用中就卡住。要么用线程加队列，要么用 asyncio。

### 合并命名空间

客户端看到聚合的工具清单时，名字可能撞车。两个服务器可能都暴露 `search`。客户端有三个选项：

1. **按服务器名加前缀。** `notes/search`、`files/search`。清楚但难看。
2. **先来先得，静默覆盖。** 后来者的 `search` 覆盖前者的。危险，会把冲突藏起来。
3. **拒绝冲突。** 拒绝加载第二个服务器，通知用户。对安全敏感的宿主最稳。

Claude Desktop 用按服务器加前缀；Cursor 用拒绝冲突并报清楚的错误；VS Code 的 MCP 也用按服务器加前缀。

### 路由

合并之后，一张分发表映射 `tool_name -> session`。模型按名字发出调用；客户端找到会话，往那个服务器的 stdin 写一条 `tools/call` 消息，然后等响应。

### Sampling 回调

如果服务器在 `initialize` 时声明了 `sampling` 能力，它可能发 `sampling/createMessage`，请客户端跑它的 LLM。客户端必须：

1. 在采样解决前，阻塞对该服务器的后续请求——或者如果实现支持并发，就做流水线。
2. 调用自己的 LLM 厂商。
3. 把响应发回服务器。

第 11 课端到端讲 sampling。本课为了完整性先打桩。

### 通知处理

`notifications/tools/list_changed` 意味着重新调 `tools/list`。`notifications/resources/updated` 意味着如果该资源正在使用中，重新读它。通知绝不能产生响应——别想着去 ack 它们。

一个常见的客户端 bug：读循环被 `tools/call` 阻塞，而此时流里正躺着一条通知。解法：用一个后台读线程，把每条消息推入队列；主线程出队并分发。

### 重连

传输会失败：服务器崩了、OS 杀了进程、stdio 管道断了。客户端在 stdout 上检测到 EOF，就把该会话标记为死亡。选项：

- 静默重启服务器并重新握手。适合纯只读服务器。
- 把失败暴露给用户。适合有用户可见会话的有状态服务器。

第 13 阶段 · 09 讲 Streamable HTTP 的重连语义；stdio 更简单。

### 保活与会话 id

Streamable HTTP 用 `Mcp-Session-Id` 头。stdio 没有会话 id——进程身份就是会话。保活 ping 是可选的；stdio 管道不会因闲置而断。

```figure
tp-client-merge
```

## 投入使用

`code/main.py` 拉起三个模拟 MCP 服务器作为子进程，逐一握手，合并它们的工具清单，并把工具调用路由到正确的服务器。这些"服务器"其实是跑玩具响应器的其他 Python 进程（没有真实 LLM)。跑起来你会看到：

- 三次初始化，各带各的能力集。
- 三份 `tools/list` 结果合并成一个 7 工具的命名空间。
- 一次基于工具名的路由决策。
- 一次被命名空间前缀阻止的冲突。

要看的地方：

- `Session` dataclass 干净地持有每服务器状态。
- 后台读线程把 stdout 上每一行出队，不阻塞主线程。
- 分发表就是简单的 `dict[str, Session]`。
- 冲突处理是显式的：两个服务器声明同名时，后声明的被改名加前缀。

## 交付

本课产出 `outputs/skill-mcp-client-harness.md`。给它一份声明式的 MCP 服务器列表（名称、命令、参数），这个 skill 产出一个架子：拉起服务器、合并工具清单、交付带冲突解决的路由函数。

## 练习

1. 跑 `code/main.py`，观察服务器拉起日志。用 SIGTERM 杀掉一个模拟服务器进程，观察客户端如何检测 EOF 并把该会话标记为死亡。

2. 实现命名空间前缀：两个服务器都暴露 `search` 时，把第二个改名为 `<server>/search`。更新分发表，验证工具调用路由正确。

3. 为服务器重启加连接池式退避：连续失败指数退避、封顶 30 秒、失败三次后向用户发通知。

4. 勾画一个支持 100 个并发 MCP 服务器的客户端。什么数据结构能替代简单的分发字典？（提示：前缀命名空间用 trie，外加每服务器工具数的指标。)

5. 把客户端移植到官方 MCP Python SDK。SDK 包装了 `stdio_client` 和 `ClientSession`，代码应从约 200 行缩到约 40 行，同时保留多服务器路由。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| MCP 客户端 | "智能体宿主" | 拉起服务器并编排工具调用的进程 |
| 会话（Session) | "每服务器状态" | 能力、工具清单和待响应请求的记账 |
| 合并命名空间 | "一份工具清单" | 横跨所有活跃服务器的扁平工具名集合 |
| 命名空间冲突 | "两个服务器同一个工具" | 客户端必须加前缀、拒绝或先来先得 |
| 路由 | "这个调用给谁？" | 从工具名到所属服务器的分发 |
| 后台读线程 | "不阻塞的 stdout" | 把服务器 stdout 排干到队列的线程或任务 |
| Sampling 回调 | "LLM 即服务" | 客户端处理服务器发来的 `sampling/createMessage` |
| `notifications/*_changed` | "原语变了" | 客户端必须重新发现或重新读取的信号 |
| 重连策略 | "服务器死了之后" | 传输失败时的重启语义 |
| stdio 会话 | "进程即会话" | 没有会话 id；子进程的生命周期就是会话 |

## 延伸阅读

- [Model Context Protocol —— 客户端规范](https://modelcontextprotocol.io/specification/2025-11-25/client) —— 客户端行为的权威定义
- [MCP —— 客户端快速上手](https://modelcontextprotocol.io/quickstart/client) —— 用 Python SDK 的 hello-world 客户端教程
- [MCP Python SDK —— client 模块](https://github.com/modelcontextprotocol/python-sdk) —— 参考 `ClientSession` 与 `stdio_client`
- [MCP TypeScript SDK —— Client](https://github.com/modelcontextprotocol/typescript-sdk) —— TS 对应实现
- [VS Code —— 扩展中的 MCP](https://code.visualstudio.com/api/extension-guides/ai/mcp) —— VS Code 如何在单个编辑器宿主里复用多个 MCP 服务器
