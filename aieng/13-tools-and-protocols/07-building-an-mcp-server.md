# 构建 MCP 服务器 —— Python + TypeScript SDK

> 大多数 MCP 教程只演示 stdio 的 hello-world。一个真实的服务器要暴露工具加资源加提示词，处理能力协商，发出结构化错误，并且在不同 SDK 间表现一致。本课端到端构建一个笔记服务器：标准库 stdio 传输、JSON-RPC 分发、三个服务端原语，以及纯函数风格——等你升级时，可以直接搬进 Python SDK 的 FastMCP 或 TypeScript SDK，不用重写。

**类型：** Build
**编程语言：** Python（标准库，stdio MCP 服务器）
**前置要求：** 第 13 阶段 · 06(MCP 基础）
**预计耗时：** 约 75 分钟

## 学习目标

- 实现 `initialize`、`tools/list`、`tools/call`、`resources/list`、`resources/read`、`prompts/list`、`prompts/get` 方法
- 写一个从 stdin 读 JSON-RPC 消息、往 stdout 写响应的分发循环
- 按 JSON-RPC 2.0 规范和 MCP 新增的错误码，发出结构化错误响应
- 把标准库实现平滑升级到 FastMCP(Python SDK）或 TypeScript SDK，不重写工具逻辑

## 问题

在能用远程传输（第 13 阶段 · 09）或认证层（第 13 阶段 · 16）之前，你需要一个干净的本地服务器。本地意味着 stdio：服务器由客户端作为子进程拉起，消息以换行分隔的方式在 stdin/stdout 上流动。

2025-11-25 版规范规定：stdio 消息编码为 JSON 对象，用显式的 `\n` 分隔。这里没有 SSE;SSE 是旧的远程模式，2026 年中正在移除（Atlassian 的 Rovo MCP 服务器在 2026 年 6 月 30 日弃用了它，Keboola 在 2026 年 4 月 1 日弃用）。对 stdio 来说，一行一个 JSON 对象就是全部的线上格式。

笔记服务器是个好的练习形状，因为它能练到全部三个服务端原语：工具做变更（`notes_create`)，资源暴露数据（`notes://{id}`)，提示词提供模板（`review_note`)。本课的形状可以推广到任何领域。

## 概念

### 分发循环

```
loop:
  line = stdin.readline()
  msg = json.loads(line)
  if has id:
    handle request -> write response
  else:
    handle notification -> no response
```

三条规则：

- 不要往 stdout 打印任何不是 JSON-RPC 信封的东西。调试日志走 stderr。
- 每个请求都必须配一个带相同 `id` 的响应。
- 通知绝不能回复。

### 实现 `initialize`

```python
def initialize(params):
    return {
        "protocolVersion": "2025-11-25",
        "capabilities": {
            "tools": {"listChanged": True},
            "resources": {"listChanged": True, "subscribe": False},
            "prompts": {"listChanged": False},
        },
        "serverInfo": {"name": "notes", "version": "1.0.0"},
    }
```

只声明你真支持的。客户端靠能力集来门控特性。

### 实现 `tools/list` 和 `tools/call`

`tools/list` 返回 `{tools: [...]}`，每项带 `name`、`description`、`inputSchema`。`tools/call` 接受 `{name, arguments}`，返回 `{content: [blocks], isError: bool}`。

内容块是类型化的。最常见的：

```json
{"type": "text", "text": "Found 2 notes"}
{"type": "resource", "resource": {"uri": "notes://14", "text": "..."}}
{"type": "image", "data": "<base64>", "mimeType": "image/png"}
```

工具错误有两种形状。协议级错误（未知方法、参数错误）是 JSON-RPC 错误；工具级错误（调用合法但工具失败了）以 `{content: [...], isError: true}` 返回——这让模型能在自己的上下文里看到失败。

### 实现资源

资源按设计是只读的。`resources/list` 返回清单；`resources/read` 返回内容。URI 可以是 `file://...`、`http://...`，或 `notes://` 这样的自定义 scheme。

把数据暴露为资源而不是工具时：

- 模型不"调用"它；客户端可以按用户请求把它注入上下文。
- 订阅让服务器在资源变化时推送更新（第 13 阶段 · 10)。
- 第 13 阶段 · 14 用 `ui://` 把它扩展成交互式资源。

### 实现提示词

提示词是带命名参数的模板。宿主把它们呈现为斜杠命令。一个 `review_note` 提示词可以接受 `note_id` 参数，产出一个多消息提示词模板，由客户端喂给它的模型。

### stdio 传输的细节

- 换行分隔的 JSON，没有长度前缀的帧格式。
- 不要缓冲，每次写完 `sys.stdout.flush()`。
- 生命周期由客户端控制。stdin 关闭（EOF）时，干净退出。
- 不要静默吞掉 SIGPIPE；记录日志再退出。

### 注解（Annotations)

每个工具可以带 `annotations` 描述安全属性：

- `readOnlyHint: true` —— 纯读取，重试安全。
- `destructiveHint: true` —— 不可逆副作用，客户端应确认。
- `idempotentHint: true` —— 同样输入产出同样输出。
- `openWorldHint: true` —— 与外部系统交互。

客户端用这些决定 UX（确认对话框、状态指示）和路由（第 13 阶段 · 17)。

### 升级路径

`code/main.py` 里的标准库服务器约 180 行。FastMCP(Python）把同样的逻辑折叠成装饰器风格：

```python
from fastmcp import FastMCP
app = FastMCP("notes")

@app.tool()
def notes_search(query: str, limit: int = 10) -> list[dict]:
    ...
```

TypeScript SDK 有对应的形状。准备好之后升级是即插即用的；概念（能力、分发、内容块）完全一样。

```figure
t3-dispatch-loop
```

## 投入使用

`code/main.py` 是一个完整的 stdio 笔记 MCP 服务器，纯标准库。它处理 `initialize`、`tools/list`、三个工具（`notes_list`、`notes_search`、`notes_create`）的 `tools/call`、每条笔记的 `resources/list` 和 `resources/read`，以及一个 `review_note` 提示词。你可以用管道喂 JSON-RPC 消息来驱动它：

```
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | python main.py
```

要看的地方：

- 分发器是一个按方法名做键的 `dict[str, Callable]`。
- 每个工具执行器返回内容块列表，不是裸字符串。
- 执行器抛异常时设置 `isError: true`。

## 交付

本课产出 `outputs/skill-mcp-server-scaffolder.md`。给它一个领域（笔记、工单、文件、数据库），这个 skill 会按正确的工具/资源/提示词划分，搭出一个 MCP 服务器脚手架，并给出 SDK 升级路径。

## 练习

1. 跑 `code/main.py`，用手工构造的 JSON-RPC 消息驱动它。调用 `notes_create`，然后 `resources/read` 读回新笔记。

2. 加一个带 `annotations: {destructiveHint: true}` 的 `notes_delete` 工具。验证客户端会弹出确认对话框（需要真实宿主；Claude Desktop 可以）。

3. 实现 `resources/subscribe`，让服务器在笔记被修改时推送 `notifications/resources/updated`。加一个保活任务。

4. 把服务器移植到 FastMCP。Python 文件应该缩到 80 行以内。线上行为必须完全一致；用同一个 JSON-RPC 测试架子验证。

5. 读规范里 `server/tools` 一节，找出本课服务器没实现的工具定义字段。（提示：有好几个；挑一个加上。)

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| MCP 服务器 | "暴露工具的那个" | 通过 stdio 或 HTTP 讲 MCP JSON-RPC 的进程 |
| stdio 传输 | "子进程模式" | 服务器由客户端拉起，经 stdin/stdout 通信 |
| 分发器（Dispatcher) | "方法路由器" | JSON-RPC 方法名到处理函数的映射 |
| 内容块 | "工具结果的一块" | 工具响应 `content` 数组里的类型化元素 |
| `isError` | "工具级失败" | 表示工具失败，与 JSON-RPC 错误区分开 |
| 注解（Annotations) | "安全提示" | readOnly / destructive / idempotent / openWorld 标记 |
| FastMCP | "Python SDK" | 基于装饰器的 MCP 协议上层框架 |
| 资源 URI | "可寻址数据" | 标识资源的 `file://`、`db://` 或自定义 scheme |
| 提示词模板 | "斜杠命令简报" | 服务器提供的、给宿主 UI 用的带参数槽的模板 |
| 能力声明 | "特性开关" | 在 `initialize` 里声明的按原语分的标记 |

## 延伸阅读

- [Model Context Protocol —— Python SDK](https://github.com/modelcontextprotocol/python-sdk) —— Python 参考实现
- [Model Context Protocol —— TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) —— 对应的 TS 实现
- [FastMCP —— 服务器框架](https://gofastmcp.com/) —— 装饰器风格的 Python MCP 服务器 API
- [MCP —— 服务器快速上手](https://modelcontextprotocol.io/quickstart/server) —— 用任一 SDK 的端到端教程
- [MCP —— 服务器工具规范](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) —— tools/* 消息的完整参考
