# 长时运行的后台智能体:持久化执行

> 生产级长程智能体,不跑在 `while True` 里。每一次 LLM 调用都变成一个带检查点、重试和回放的活动(activity)。Temporal 的 OpenAI Agents SDK 集成于 2026 年 3 月 GA;Claude Code Routines(Anthropic)不需要常驻本地进程,就能跑定时触发的 Claude Code 调用。会话可以在等待人类输入时暂停、在部署之后存活,并按 `thread_id` 从最近的检查点恢复。新交互体验的背后,是一个老模式——工作流编排——只加了一个新输入:LLM 调用作为非确定性活动,恢复时必须能被确定性地回放。

**类型:** 学习
**编程语言:** Python(标准库,最小持久化执行状态机)
**前置要求:** 第 15 阶段 · 10(权限模式),第 15 阶段 · 01(长程智能体)
**预计耗时:** 约 60 分钟

## 问题

设想一个跑四小时的智能体:调三个工具,问用户两次,做四十次 LLM 调用。跑到一半,宿主机重启了。会发生什么?

- 朴素的 `while True` 循环:一切尽失。运行从零开始,三个(有真实副作用的)工具调用再执行一遍,用户被重复询问已经批准过的东西,四十次 LLM 调用再收一遍费。
- 有持久化执行:运行从最近的检查点恢复。已完成的活动不再执行,它们的结果从持久日志里回放。用户不用重复批准,已做过的 LLM 调用不再收费。

这正是工作流引擎十年来一直在交付的模式(Temporal、Cadence、Uber 的 Cherami)。新的是:LLM 调用如今也是一种活动——非确定、昂贵、带副作用——而且它干净地嵌进了这个模式。

本课的主线:长程可靠性会衰减(METR 观察到"35 分钟退化"——成功率随时程大致按平方下降)。持久化执行让运行时长可以超过可靠性画像允许的长度——设计对了,这是一种新的安全失败方式;设计错了,是不安全的失败方式。

## 概念

### 活动、工作流与回放

- **工作流(workflow)**:确定性的编排代码。定义活动序列、分支和等待。必须确定性,这样才能从事件日志回放而不意外分叉。
- **活动(activity)**:非确定的、可能失败的工作单元。LLM 调用、工具调用、文件写入、HTTP 请求。每个活动记录其输入,以及(完成后)输出。
- **事件日志(event log)**:持久的后端存储。每个活动的开始、完成、失败、重试,以及每个工作流决策,都记录在案。
- **回放(replay)**:恢复时,工作流代码从头再跑;每个已完成的活动直接返回日志里的结果,不再执行。只有未完成的活动才真正运行。

这与 React 对着虚拟 DOM 重渲染、Git 从提交重建工作树,是同一个形状。编排器的确定性,让持久化变得便宜。

### 为什么 LLM 调用嵌得进这个模式

LLM 调用是:
- 非确定的(temperature > 0 时;即使 temperature 0,也会随模型版本漂移)。
- 昂贵的(钱和延迟)。
- 可能失败的(限流、超时)。
- 带副作用的(如果它会调工具)。

这正是活动的画像。把每次 LLM 调用包成活动,你就得到:指数退避重试、跨重启的检查点、可回放的调试轨迹。

### 按 `thread_id` 键控的检查点

LangGraph、Microsoft Agent Framework、Cloudflare Durable Objects 和 Claude Code Routines,收敛到了同一个 API 形状:`thread_id`(或等价物)标识会话;每次状态转移持久化到后端(默认 PostgreSQL,开发用 SQLite,缓存用 Redis);恢复时读最近的检查点。

后端的选择要紧:

- **PostgreSQL**:持久、可查询、跨部署存活。LangGraph 的默认。
- **SQLite**:仅本地开发;跨主机丢数据。
- **Redis**:快,但没配 AOF/快照就是易失的。
- **Cloudflare Durable Objects**:透明分布;按唯一键限定范围;可存活数小时到数周。

### 人类输入作为一等状态

先提议后提交(第 15 课)需要一个持久的"等待人类"状态。工作流暂停,外部队列挂起待决请求,批准后从那个点精确恢复。没有持久化,这是尽力而为;有了它,隔夜才到的批准,第二天早上工作流照样接上。

### 35 分钟退化

METR 观察到:被测的每一类智能体,连续运行约 35 分钟后可靠性就开始衰减。任务时长翻倍,失败率大致翻两番。持久化执行治不了这个;它只是让你能跑得比可靠性画像更长。安全的做法是:持久化与"重进时必须重新人审"的检查点组合,再加上限制总计算量(不看墙钟)的预算急停开关(第 13 课)。

### 什么时候持久化执行是错误答案

- 运行只有几分钟、不需要人类输入。开销大于收益。
- 严格只读的信息检索。
- 正确性要求在一个上下文窗口内端到端完成的任务(某些推理任务、某些一次性生成)。

```figure
memory-consolidation
```

## 投入使用

`code/main.py` 用标准库 Python 实现一个最小持久化执行引擎,支持:

- `@activity` 装饰器:把输入输出记入 JSON 事件日志。
- 工作流函数:把活动串起来。
- `run_or_replay(workflow, event_log)`:回放已完成的活动,不再执行。

驱动程序模拟一个三活动工作流,中途崩溃,展示 (a) 朴素重试会重跑一切,而 (b) 回放只跑缺失的那个活动。

## 交付

`outputs/skill-durable-execution-review.md` 评审一个长时运行智能体部署的持久化执行形状是否正确:活动、确定性、检查点后端、人类输入状态,以及恢复时的人审策略。

## 练习

1. 运行 `code/main.py`。观察朴素重试与回放的活动执行次数差。改变崩溃点,展示回放次数随之变化。

2. 把玩具引擎改成显式使用 `thread_id`。模拟两个并发会话共享引擎,确认它们的事件日志不冲突。

3. 在玩具引擎里挑一个活动,引入非确定性(工作流决策里放一个墙钟时间戳)。演示回放时的分叉。解释真实引擎怎么处理(副作用登记、`Workflow.now()` 这类 API)。

4. 读 LangChain 的《Runtime behind production deep agents》一文。列出运行时持久化的每一项状态,并说明各自覆盖哪种失败模式。

5. 为一个 6 小时的自治编程任务设计检查点策略。在哪里设检查点?崩溃恢复长什么样?哪里需要重新人审?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|---|---|---|
| 工作流(Workflow) | "智能体的剧本" | 确定性编排代码;可从事件日志回放 |
| 活动(Activity) | "一步" | 非确定单元(LLM 调用、工具调用);前后都记日志 |
| 事件日志(Event log) | "后端存储" | 每次状态转移的持久记录 |
| 回放(Replay) | "恢复" | 重跑工作流;已完成活动返回日志结果,不再执行 |
| 检查点(Checkpoint) | "存档点" | 按 thread_id 键控的持久状态;恢复时取最新 |
| thread_id | "会话键" | 划定持久状态范围的标识符 |
| 35 分钟退化 | "可靠性衰减" | METR:成功率随时程大致按平方下降 |
| 非确定性(Non-determinism) | "回放时漂移" | 墙钟、随机数、LLM 输出;必须登记为副作用 |

## 延伸阅读

- [Anthropic — Claude Code Agent SDK: agent loop](https://code.claude.com/docs/en/agent-sdk/agent-loop) ——预算、轮次与恢复语义
- [Microsoft — Agent Framework: human-in-the-loop and checkpointing](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop) ——RequestInfoEvent 的形状
- [LangChain — The Runtime Behind Production Deep Agents](https://www.langchain.com/conceptual-guides/runtime-behind-production-deep-agents) ——具体的运行时要求
- [OpenAI Agents SDK + Temporal integration (Trigger.dev announcement)](https://trigger.dev) ——LLM 调用的活动形态
- [Anthropic — Measuring agent autonomy in practice](https://www.anthropic.com/research/measuring-agent-autonomy) ——35 分钟退化的出处
