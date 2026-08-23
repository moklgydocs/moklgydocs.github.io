# 异步任务（SEP-1686)—— 先调用，后取结果

> 真实的智能体工作要几分钟到几小时：CI 运行、深度研究综合、批量导出。同步工具调用会掉线、超时，或卡住 UI。SEP-1686 在 2025-11-25 合并，加入了 Tasks 原语：任何请求都可以被增强为一个任务，结果可以稍后再取，或通过状态通知流式推送。漂移风险提示：Tasks 在 2026 年上半年仍是实验性的；SDK 表面还在围绕规范设计中。

**类型：** Build
**编程语言：** Python（标准库，异步任务状态机）
**前置要求：** 第 13 阶段 · 07(MCP 服务器）、第 13 阶段 · 09（传输）
**预计耗时：** 约 75 分钟

## 学习目标

- 识别何时该把工具从同步提升为任务增强（服务器端工作超过 30 秒）
- 走完任务生命周期：`working` → `input_required` → `completed` / `failed` / `cancelled`
- 持久化任务状态，崩溃不丢在途工作
- 正确地轮询 `tasks/status`、获取 `tasks/result`

## 问题

一个 `generate_report` 工具要跑好几分钟的抽取流水线。同步模型下的选项：

1. 把连接挂三分钟。远程传输会掐断它，客户端会超时，UI 会卡死。
2. 立刻返回一个占位符，让客户端去轮询一个自定义端点。破坏 MCP 的一致性。
3. 发了就忘，没有结果。

没一个好的。SEP-1686 加了第四个：任务增强。任何请求（通常是 `tools/call`）都可以被标记为任务。服务器立刻返回一个任务 id。客户端轮询 `tasks/status`，完成后取 `tasks/result`。服务器端状态在重启后存活。

## 概念

### 任务增强

通过在 `params._meta.task` 里设 `required: true`（或 `optional: true`，由服务器定），请求就变成了任务。服务器立刻响应：

```json
{
  "jsonrpc": "2.0", "id": 1,
  "result": {
    "_meta": {
      "task": {
        "id": "tsk_9f7b...",
        "state": "working",
        "ttl": 900000
      }
    }
  }
}
```

`ttl` 是服务器保留状态的承诺；过了 ttl，任务结果会被丢弃。

### 按工具选择启用

工具注解可以声明任务支持：

- `taskSupport: "forbidden"` —— 这个工具永远同步跑。适合快工具。
- `taskSupport: "optional"` —— 客户端可以请求任务增强。
- `taskSupport: "required"` —— 客户端必须使用任务增强。

`generate_report` 会是 `required`;`notes_search` 会是 `forbidden`。

### 状态

```
working  -> input_required -> working  (loop via elicitation)
working  -> completed
working  -> failed
working  -> cancelled
```

状态机是只追加的：一旦进入 `completed`、`failed` 或 `cancelled`，任务就终结了。

### 方法

- `tasks/status {taskId}` —— 返回当前状态和进度提示。
- `tasks/result {taskId}` —— 阻塞等待，或未完成时返回 404。
- `tasks/cancel {taskId}` —— 幂等；终结状态忽略。
- `tasks/list` —— 可选；枚举活跃的和最近完成的任务。

### 流式状态变更

服务器支持时，客户端可以订阅状态通知：

```
server -> notifications/tasks/updated {taskId, state, progress?}
```

用流而不是轮询的客户端，UX 更好。轮询永远受支持，是最小可用面。

### 持久状态

规范要求声明了任务支持的服务器必须持久化状态。在 ttl 之内，崩溃不该丢失已完成的结果。存储可以从 SQLite 到 Redis 到文件系统。第 13 课的架子用文件系统。

### 取消语义

`tasks/cancel` 是幂等的。任务在执行中途，服务器尝试停止（检查执行器的协作式取消）；已经终结的，请求是空操作。

### 崩溃恢复

服务器进程重启时：

1. 加载所有持久化的任务状态。
2. 把进程死掉的 `working` 任务标记为 `failed`，错误为 `CRASH_RECOVERY`。
3. 在 ttl 内保留 `completed` / `failed` / `cancelled`。

### 异步任务加 sampling

任务自己也可以调 `sampling/createMessage`。长时间运行的研究任务就是这么工作的：服务器的任务线程按需采样客户端的模型，而客户端 UI 把任务显示为 `working` 并周期性更新进度。

### 为什么它是实验性的

SEP-1686 在 2025-11-25 发布，但路线图指出了三个开放问题：持久订阅原语、子任务（父子任务关系）、结果 TTL 标准化。规范在 2026 年还会继续演进。生产代码应只把 Tasks 的常见用例当作稳定，并对未来 SDK 在子任务上的变动做好防护。

```figure
tp-task-lifecycle
```

## 投入使用

`code/main.py` 实现了一个持久的任务存储（文件系统后端）和一个在后台线程里跑的 `generate_report` 工具。客户端调用工具，立刻拿到任务 id，在 worker 更新进度时轮询 `tasks/status`，完成后取 `tasks/result`。取消可用；崩溃恢复通过杀掉 worker 线程并重新加载状态来模拟。

要看的地方：

- 任务状态 JSON 持久化到 `/tmp/lesson-13-tasks/<id>.json`。
- worker 线程更新 `progress` 字段；轮询能看到它前进。
- 客户端侧的取消会设置一个事件；worker 检查后提前退出。
- "崩溃"后重新加载状态，把在途任务标记为 `failed`、`CRASH_RECOVERY`。

## 交付

本课产出 `outputs/skill-task-store-designer.md`。给它一个长时间运行的工具（研究、构建、导出），这个 skill 设计任务存储（状态形状、ttl、持久性）、挑选正确的 taskSupport 标记，并勾画进度通知。

## 练习

1. 跑 `code/main.py`。发起一个 `generate_report` 任务，轮询状态，然后取结果。

2. 在运行中途加一个 `tasks/cancel` 调用。验证 worker 响应它，状态变为 `cancelled`。

3. 模拟崩溃恢复：杀掉 worker 线程，重启加载器，观察 `CRASH_RECOVERY` 失败模式。

4. 把存储扩展到 SQLite。持久性收益相同，但查询能力打开了（列出会话 X 的所有任务）。

5. 读 MCP 的 2026 路线图文章。找出最可能影响明年 SDK API 设计的那个 Tasks 相关开放问题。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| 任务（Task) | "长调用" | 用 `_meta.task` 增强为异步执行的请求 |
| SEP-1686 | "任务规范" | 2025-11-25 加入 Tasks 的规范演进提案 |
| `_meta.task` | "任务信封" | 含 id、state、ttl 的每请求元数据 |
| taskSupport | "工具标记" | 按工具的 `forbidden` / `optional` / `required` |
| `tasks/status` | "轮询方法" | 获取当前状态和可选的进度提示 |
| `tasks/result` | "取结果" | 返回已完成的载荷，未完成则 404 |
| `tasks/cancel` | "停掉" | 幂等的取消请求 |
| ttl | "保留预算" | 服务器承诺保留任务状态的毫秒数 |
| `notifications/tasks/updated` | "状态推送" | 服务器发起的状态变更事件 |
| 持久存储 | "不怕崩的状态" | 文件系统 / SQLite / Redis 持久层 |

## 延伸阅读

- [MCP —— GitHub SEP-1686 issue](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1686) —— 起源提案与完整讨论
- [WorkOS —— 面向 AI 智能体工作流的 MCP 异步任务](https://workos.com/blog/mcp-async-tasks-ai-agent-workflows) —— 带设计理由的走读
- [DeepWiki —— MCP 任务系统与异步操作](https://deepwiki.com/modelcontextprotocol/modelcontextprotocol/2.7-task-system-and-async-operations) —— 机制与状态机
- [FastMCP —— Tasks](https://gofastmcp.com/servers/tasks) —— SDK 层的任务实现模式
- [MCP 博客 —— 2026 路线图](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/) —— 开放问题与 2026 优先级（含子任务）
