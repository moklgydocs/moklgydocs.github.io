# MCP 资源与提示词 —— 工具之外的上下文暴露

> 工具拿走了 MCP 九成的注意力。另外两个服务端原语解决的是不同的问题：资源暴露可读的数据；提示词把可复用模板暴露为斜杠命令。很多服务器本该用资源，而不是把读取包进工具；本该用提示词，而不是把工作流硬编码在客户端提示词里。本课给出判定规则，并走完 `resources/*` 和 `prompts/*` 消息。

**类型：** Build
**编程语言：** Python（标准库，资源 + 提示词处理器）
**前置要求：** 第 13 阶段 · 07(MCP 服务器）
**预计耗时：** 约 45 分钟

## 学习目标

- 为一个给定领域的能力，决定暴露成工具、资源还是提示词
- 实现 `resources/list`、`resources/read`、`resources/subscribe`，并处理 `notifications/resources/updated`
- 实现带参数模板的 `prompts/list` 和 `prompts/get`
- 分清宿主何时把提示词呈现为斜杠命令，何时自动注入上下文

## 问题

一个朴素的笔记应用 MCP 服务器，会把一切都暴露成工具：`notes_read`、`notes_list`、`notes_search`。这把每一次数据访问都包成了模型驱动的工具调用。后果：

- 每个可能受益于上下文的查询，模型都得决定要不要调 `notes_read`。
- 只读内容没法被订阅，也没法流到宿主的侧边栏。
- 客户端 UI(Claude Desktop 的资源附着面板、Cursor 的 "Include file" 选择器）没法呈现这些数据。

正确的分工：数据暴露为资源，变更或计算动作暴露为工具，可复用的多步工作流暴露为提示词。每个原语有自己的 UX 形态和访问模式。

## 概念

### 工具 vs 资源 vs 提示词 —— 判定规则

| 能力 | 原语 |
|------------|-----------|
| 用户想搜索、过滤或变换数据 | 工具 |
| 用户想让宿主把这份数据作为上下文纳入 | 资源 |
| 用户想要一个能反复运行的模板化工作流 | 提示词 |

准则：如果模型在每个相关查询里都能从调用它中受益，它是工具；如果用户能从把它附着到对话中受益，它是资源；如果用户想复用的单位是整个多步工作流，它是提示词。

### 资源

`resources/list` 返回 `{resources: [{uri, name, mimeType, description?}]}`。`resources/read` 接受 `{uri}`，返回 `{contents: [{uri, mimeType, text | blob}]}`。

URI 可以是任何可寻址的东西：

- `file:///Users/alice/notes/mcp.md`
- `postgres://my-db/query/SELECT ...`
- `notes://note-14`（自定义 scheme)
- `memory://session-2026-04-22/recent`（服务器自定义）

`contents[]` 同时支持文本和二进制。二进制用 `blob` 字段（base64 编码字符串）加 `mimeType`。

### 资源订阅

在能力里声明 `{resources: {subscribe: true}}`。客户端调用 `resources/subscribe {uri}`。资源变化时，服务器发送 `notifications/resources/updated {uri}`，客户端重新读取。

用例：资源是磁盘文件的笔记服务器；文件监视器触发更新通知；文件在宿主之外被编辑时，Claude Desktop 把它重新拉进上下文。

### 资源模板（2025-11-25 新增）

`resourceTemplates` 让你暴露参数化的 URI 模式：`notes://{id}`，其中 `id` 是补全目标。客户端可以在资源选择器里自动补全 id。

### 提示词

`prompts/list` 返回 `{prompts: [{name, description, arguments?}]}`。`prompts/get` 接受 `{name, arguments}`，返回 `{description, messages: [{role, content}]}`。

提示词是一个模板，填充后成为一串消息，由宿主喂给它的模型。比如一个 `code_review` 提示词接受 `file_path` 参数，返回三条消息的序列：一条系统消息、一条带文件正文的用户消息，和一条带推理模板的 assistant 开场。

### 宿主与提示词

Claude Desktop、VS Code 和 Cursor 把提示词暴露为聊天 UI 里的斜杠命令。用户输入 `/code_review`，从表单里选参数。服务器的提示词，就是"用户快捷方式"和"发给模型的完整提示词"之间的契约。

不是每个客户端都支持提示词——查能力协商。声明了提示词能力的服务器，遇上不支持提示词的客户端，斜杠命令就是不会出现。

### "list changed" 通知

资源和提示词在集合变化时都会发 `notifications/list_changed`。刚导入 20 条新笔记的笔记服务器发出 `notifications/resources/list_changed`，客户端重新调 `resources/list` 拿到新增内容。

### 内容类型约定

文本：`mimeType: "text/plain"`、`text/markdown`、`application/json`。
二进制：`image/png`、`application/pdf`，配 `blob` 字段。
MCP Apps（第 14 课）:`ui://` URI 下的 `text/html;profile=mcp-app`。

### 动态资源

资源 URI 不一定对应静态文件。`notes://recent` 可以每次读取都返回最新的五条笔记；`db://query/users/active` 可以执行参数化查询。服务器可以自由地动态计算内容。

规则：如果客户端会按 URI 缓存，URI 必须稳定。如果计算是一次性的，URI 应该带时间戳或随机数，客户端缓存才不会变陈。

### 订阅 vs 轮询

支持订阅的客户端通过 `notifications/resources/updated` 收服务器推送。老客户端或不支持订阅的宿主靠重新读取来轮询。两种都合规。服务器的能力声明告诉客户端它支持哪种。

订阅的代价：服务器上的每会话状态（谁订阅了什么）。订阅集合要有界；断开的客户端应该超时回收。

### 提示词 vs 系统提示词

MCP 的提示词不是系统提示词。宿主的系统提示词（它自己的操作指令）和 MCP 提示词（服务器提供、由用户触发的模板）是并存的。行为良好的客户端永远不让服务器提示词覆盖自己的系统提示词——它是叠加。

```figure
t3-primitive-sort
```

## 投入使用

`code/main.py` 在第 07 课笔记服务器的基础上扩展了：

- 每条笔记一个资源（`notes://note-1` 等），支持 `resources/subscribe`。
- 一个 `review_note` 提示词，渲染成三条消息的模板。
- 一个文件监视器模拟：笔记被修改时发出 `notifications/resources/updated`。
- 一个 `notes://recent` 动态资源，永远返回最新五条笔记。

跑演示看完整流程。

## 交付

本课产出 `outputs/skill-primitive-splitter.md`。给它一个拟议中的 MCP 服务器，这个 skill 把每项能力分类为工具 / 资源 / 提示词，并给出理由。

## 练习

1. 跑 `code/main.py`。观察初始资源清单，然后触发一次笔记编辑，验证 `notifications/resources/updated` 事件触发。

2. 加一个 `resources/list_changed` 发射器：创建新笔记时发出通知，让客户端重新发现。

3. 为一个 GitHub MCP 服务器设计三个提示词：`summarize_pr`、`triage_issue`、`release_notes`，各带参数 schema。提示词本体应该不做进一步编辑就能用。

4. 从第 07 课的服务器里挑一个现有工具，分类它应该继续当工具，还是拆成"资源 + 工具"对。用一句话给出理由。

5. 读规范的 `server/resources` 和 `server/prompts` 两节。找出 `resources/read` 里一个很少填但规范支持的字段。（提示：看资源内容上的 `_meta`。)

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| 资源（Resource) | "暴露的数据" | 宿主可读取的、用 URI 寻址的内容 |
| 资源 URI | "数据指针" | 带 scheme 前缀的标识符（`file://`、`notes://` 等） |
| `resources/subscribe` | "盯着变化" | 客户端可选订阅的、针对特定 URI 的服务器推送更新 |
| `notifications/resources/updated` | "资源变了" | 告知客户端某个订阅的资源有了新内容的信号 |
| 资源模板 | "参数化 URI" | 给宿主选择器提供补全提示的 URI 模式 |
| 提示词（Prompt) | "斜杠命令模板" | 带参数槽的命名多消息模板 |
| 提示词参数 | "模板输入" | 宿主在渲染前收集的类型化参数 |
| `prompts/get` | "渲染模板" | 服务器返回填充好的消息列表 |
| 内容块 | "类型化的一块" | `{type: text \| image \| resource \| ui_resource}` |
| 斜杠命令 UX | "用户快捷方式" | 宿主把提示词呈现为以 `/` 开头的命令 |

## 延伸阅读

- [MCP —— 概念：资源](https://modelcontextprotocol.io/docs/concepts/resources) —— 资源 URI、订阅与模板
- [MCP —— 概念：提示词](https://modelcontextprotocol.io/docs/concepts/prompts) —— 提示词模板与斜杠命令集成
- [MCP —— 服务器资源规范 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/server/resources) —— `resources/*` 消息完整参考
- [MCP —— 服务器提示词规范 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/server/prompts) —— `prompts/*` 消息完整参考
- [MCP —— 协议信息站：资源](https://modelcontextprotocol.info/docs/concepts/resources/) —— 对官方文档扩展的社区指南
