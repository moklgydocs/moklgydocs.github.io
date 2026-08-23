# 作为库的 Harness —— 子智能体与会话存储

> 一个可以 import 的 harness:内置工具、做上下文隔离的子智能体、钩子、W3C 追踪传播、会话持久化。Claude Agent SDK 是参考样例——Claude Code harness 的库形态——而 Claude Managed Agents 是长时运行异步工作的托管替代。

**类型:** 学习 + 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 01(智能体循环)、第 14 阶段 · 10(技能库)
**预计耗时:** 约 75 分钟

## 学习目标

- 解释 Anthropic Client SDK(裸 API)与 Claude Agent SDK(harness 形态)的区别。
- 描述子智能体——并行化与上下文隔离——以及何时该用。
- 说出 Python SDK 的会话存储表面(`append`、`load`、`list_sessions`、`delete`、`list_subkeys`)和 `--session-mirror` 的作用。
- 用纯标准库实现一个 harness:内置工具、带隔离上下文的子智能体生成、生命周期钩子、会话存储。

## 问题

裸 LLM API 只给你一次往返。生产智能体需要工具执行、MCP 服务器、生命周期钩子、子智能体生成、会话持久化、追踪传播。Claude Agent SDK 把这个形态打包成库——Claude Code 在用的同一套 harness,开放给自定义智能体。

## 概念

### Client SDK vs Agent SDK

- **Client SDK(`anthropic`)。** 裸 Messages API。循环、工具、状态都归你管。
- **Agent SDK(`claude-agent-sdk`)。** 内置工具执行、MCP 连接、钩子、子智能体生成、会话存储。库形态的 Claude Code 循环。

### 内置工具

SDK 开箱带 10+ 工具:文件读写、shell、grep、glob、网页抓取等。自定义工具经标准工具 schema 接口注册。

### 子智能体

Anthropic 文档写明两个用途:

1. **并行化。** 独立工作并发跑。"给这 20 个模块各找测试文件"就是 20 个并行子智能体任务。
2. **上下文隔离。** 子智能体用自己的上下文窗口,只有结果回到编排器。编排器的预算得以保全。

Python SDK 近期新增:`list_subagents()`、`get_subagent_messages()`,用于读取子智能体转录。

### 会话存储

与 TypeScript 协议对齐:

- `append(session_id, message)` —— 加一轮。
- `load(session_id)` —— 恢复对话。
- `list_sessions()` —— 枚举。
- `delete(session_id)` —— 级联到子智能体会话。
- `list_subkeys(session_id)` —— 列出子智能体键。

`--session-mirror`(CLI 标志)把转录边流式边镜像到外部文件,供调试。

### 钩子

可注册的生命周期钩子:

- `PreToolUse`、`PostToolUse` —— 拦截或审计工具调用。
- `SessionStart`、`SessionEnd` —— 建立与拆除。
- `UserPromptSubmit` —— 在模型看到用户输入之前行动。
- `PreCompact` —— 上下文压缩前运行。
- `Stop` —— 智能体退出时清理。
- `Notification` —— 旁路告警。

钩子是 pro-workflow(第 14 阶段 课程参考)及类似系统添加横切行为的方式。

### W3C 追踪上下文

调用方活跃的 OTel span,经 W3C trace context 头传播进 CLI 子进程。整个多进程轨迹在你的后端显示为一条 trace。

### Claude Managed Agents

托管替代(beta 头 `managed-agents-2026-04-01`)。长时运行异步工作,内置提示词缓存、内置压缩。用控制换托管基础设施。

### 这个模式在哪里出错

- **子智能体超生。** 100 个小任务生成 100 个子智能体,开销盖过收益。改成批处理。
- **钩子蔓延。** 每个团队都加钩子,启动时间膨胀。每季度评审一次钩子。
- **会话膨胀。** 会话累积,体积膨胀。用 `list_sessions` + 过期策略。

```figure
ae-subagent-isolation
```

## 动手构建

`code/main.py` 用纯标准库实现 SDK 形态:

- `Tool`、`ToolRegistry`,内置 `read_file`、`write_file`、`list_dir`。
- `Subagent` —— 私有上下文、隔离运行、返回结果。
- `SessionStore` —— append、load、list、delete、list_subkeys。
- `Hooks` —— `pre_tool_use`、`post_tool_use`、`session_start`、`session_end`。
- 演示:主智能体并行生成 3 个子智能体(各自隔离),聚合结果,持久化会话。

运行:

```
python3 code/main.py
```

轨迹展示:子智能体上下文隔离(编排器上下文大小保持有界)、钩子执行、会话持久化。

## 投入使用

- **Claude Agent SDK**:想要 Claude Code harness 形态的 Claude 优先产品。
- **Claude Managed Agents**:托管的长时运行异步工作。
- **OpenAI Agents SDK**(第 16 课):OpenAI 优先的对应物。
- **LangGraph + 自定义工具**:想要图形态状态机时。

## 交付

`outputs/skill-claude-agent-scaffold.md`:搭一个 Claude Agent SDK 应用,含子智能体、钩子、会话存储、MCP 服务器挂载和 W3C 追踪传播。

## 练习

1. 加一个子智能体生成器:把 20 个任务按每组 5 个并行子智能体批处理。测量编排器上下文大小,与"一任务一子智能体"对比。
2. 实现一个 `PreToolUse` 钩子:限速 `write_file` 调用(每会话每分钟 5 次)。追踪行为。
3. 接上 `list_subkeys` 渲染子智能体树。深嵌套长什么样?
4. 把玩具移植到真实的 `claude-agent-sdk` Python 包。工具注册有什么变化?
5. 读 Claude Managed Agents 文档。什么时候你会从自托管切换到托管?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| Agent SDK | "库形态的 Claude Code" | harness 形态:工具、MCP、钩子、子智能体、会话存储 |
| 子智能体 | "子代智能体" | 独立上下文、自己的预算;结果上浮 |
| 会话存储 | "对话数据库" | 持久、加载、枚举、删除轮次,子智能体级联 |
| 钩子 | "生命周期回调" | 工具前后、会话、提示提交、压缩、停止 |
| W3C 追踪上下文 | "跨进程 trace" | 父 span 传播进 CLI 子进程 |
| Managed Agents | "托管 harness" | Anthropic 托管的长时运行异步工作 |
| `--session-mirror` | "转录镜像" | 会话轮次边流式边写入外部文件 |
| MCP 服务器 | "工具面" | 挂到智能体上的外部工具/资源来源 |

## 延伸阅读

- [Claude Agent SDK 概览](https://platform.claude.com/docs/en/agent-sdk/overview) —— Claude Code 的库形态
- [Anthropic,《用 Claude Agent SDK 构建智能体》](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk) —— 生产模式
- [Claude Managed Agents 概览](https://platform.claude.com/docs/en/managed-agents/overview) —— 托管替代
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) —— 对应物
