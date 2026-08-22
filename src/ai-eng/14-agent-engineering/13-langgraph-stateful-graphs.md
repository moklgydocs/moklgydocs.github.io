# 有状态图编排 —— 持久执行与检查点

> 智能体就是状态机:节点是函数,边是转移,状态在每个节点之后存检查点。任何失败,都从上一个成功的检查点恢复。LangGraph 是 2026 年这种低层有状态编排模型的参考实现。

**类型:** 学习 + 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 01(智能体循环)、第 14 阶段 · 12(工作流模式)
**预计耗时:** 约 75 分钟

## 学习目标

- 描述 LangGraph 的核心模型:带类型状态的状态机、函数节点、条件边、节点后检查点。
- 说出文档强调的四种能力:持久执行、流式、人在环中、全面记忆。
- 解释 LangGraph 支持的三种编排拓扑:supervisor、点对点(swarm)、层级(嵌套子图)。
- 用纯标准库实现一个状态图:带类型状态、条件边、检查点/恢复循环。

## 问题

智能体和工作流共享一个问题:40 步的运行在第 38 步挂了,你想从第 38 步恢复,而不是从头再来。二流的状态模型会让运维围着一个假设"每次都是全新运行"的库打重试补丁。

LangGraph 的设计答案:状态是一等带类型对象,变更显式,每个节点后持久化检查点。恢复就是一次 `load_state(session_id)` 调用。

## 概念

### 图

图由这些定义:

- **状态类型。** 一个带类型的 dict(或 Pydantic 模型),每个节点读它、改它。
- **节点。** 纯函数 `(state) -> state_update`。返回后,更新被合并进状态。
- **边。** 节点间的条件或直接转移。
- **入口与出口。** `START` 和 `END` 哨兵节点标记边界。

例子:一个有 `classify`、`refund`、`bug`、`sales`、`done` 节点的智能体——一个图形态的路由工作流。

### 持久执行

每个节点返回后,运行时把状态序列化写入检查点存储(SQLite、Postgres、Redis、自定义)。第 N 步失败时,运行时可以 `resume(session_id)`,带着精确状态从第 N+1 步继续。

LangGraph 文档明确点名了在意这个的生产用户:Klarna、Uber、J.P. Morgan。卖点不是图的形状,而是图的形状加检查点让恢复变便宜。

### 流式

每个节点可以产出部分输出。图把逐节点增量事件流给调用方,UI 随图运行实时更新。

### 人在环中

在节点之间检查并修改状态。实现:在关键节点前暂停,把状态呈给人类,接受修改,恢复。检查点让这很容易,因为状态本来就序列化了。

### 记忆

短期(单次运行内——状态中的对话历史)与长期(跨运行——经检查点加一个独立长期存储持久化)。LangGraph 通过工具与外部记忆系统(Mem0、自定义)集成。

### 三种拓扑

1. **Supervisor。** 中央路由器 LLM 派发给专家子智能体。`langgraph-supervisor` 里的 `create_supervisor()`(不过 LangChain 团队 2026 年建议直接通过工具调用做,上下文控制更强)。
2. **Swarm / 点对点。** 智能体通过共享工具面直接交接,没有中央路由器。
3. **层级。** supervisor 管 sub-supervisor,用嵌套子图实现。

### 这个模式在哪里出错

- **检查点太小。** 只存对话轮次,工具状态和记忆写入就无法恢复。完整状态必须序列化。
- **节点非确定。** 恢复假设同样输入产出同样状态更新。随机种子、墙钟时间、外部 API 都必须被捕获。
- **条件边滥用。** 每条边都是条件的图,是一台无法推理的状态机。优先线性链,偶尔分支。

```figure
langgraph-state
```

## 动手构建

`code/main.py` 用纯标准库实现有状态图:

- `State` —— 带类型 dict,含 `messages`、`step`、`route`、`output`、`human_approval`。
- `Node` —— 接收状态、返回更新 dict 的可调用对象。
- `StateGraph` —— 节点 + 边 + 条件边 + run + resume。
- `SQLiteCheckpointer`(内存假实现)—— 每个节点后序列化状态;`load(session_id)` 恢复。
- 演示图:classify → 分支(refund / bug / sales)→ 人工闸门 → 发送。

运行:

```
python3 code/main.py
```

轨迹展示:第一次运行在人工闸门处失败,持久化,然后恢复并产出最终输出。

## 投入使用

- **LangGraph** —— 参考实现,生产就绪。用 `create_react_agent`、`create_supervisor`,或自建图。
- **AutoGen v0.4**(第 14 课)—— 高并发场景的 actor 模型替代。
- **Claude Agent SDK**(第 17 课)—— 托管 harness,内置会话存储。
- **自建** —— 需要精确控制状态形状或检查点后端时。

## 交付

`outputs/skill-state-graph.md`:在任何目标运行环境生成 LangGraph 形状的状态图,接好检查点与恢复。

## 练习

1. 加一条条件边:分类置信度低于阈值时从 `classify` 到 `end`。人工手动设 `route` 后恢复运行。
2. 把类 SQLite 假实现换成真 SQLite 检查点。测量每步序列化开销。
3. 实现并行边:两个节点并发跑,用自定义 reducer 合并。不可变状态在这里带来什么?
4. 读 `langgraph-supervisor` 参考。把玩具移植到 `create_supervisor`。对比轨迹形状。
5. 加流式:每个节点运行时产出部分状态。增量到达即打印。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| 状态图 | "状态机形态的智能体" | 带类型状态 + 节点 + 边 + reducer |
| 检查点存储 | "持久化后端" | 每个节点后序列化状态;支撑恢复 |
| Reducer | "状态合并器" | 把当前状态与节点更新合并的函数 |
| 条件边 | "分支" | 由状态函数选出的边 |
| 子图 | "嵌套图" | 作为另一个图的节点使用的图 |
| 持久执行 | "从失败恢复" | 带精确状态在上个成功节点重启 |
| Supervisor | "路由器 LLM" | 专家子智能体的中央派发器 |
| Swarm | "P2P 智能体" | 经共享工具交接;无中央路由器 |

## 延伸阅读

- [LangGraph 概览](https://docs.langchain.com/oss/python/langgraph/overview) —— 参考文档
- [langgraph-supervisor 参考](https://reference.langchain.com/python/langgraph/supervisor/) —— supervisor 模式 API
- [AutoGen v0.4,Microsoft Research](https://www.microsoft.com/en-us/research/articles/autogen-v0-4-reimagining-the-foundation-of-agentic-ai-for-scale-extensibility-and-robustness/) —— actor 模型替代
- [Claude Agent SDK 概览](https://platform.claude.com/docs/en/agent-sdk/overview) —— 会话存储与子智能体
