# 生产级扩展 —— 队列、检查点与持久性

> 把多智能体系统扩展到数千个并发运行,需要**持久化执行(durable execution)**——工作队列加检查点,这样只要租约处理、幂等副作用和确定性重放就位,任何 worker 都能在任何崩溃之后恢复任何运行。LangGraph 的运行时是参考范例:它在每个 super-step 之后按 `thread_id` 写一条检查点(默认用 Postgres);worker 崩溃会释放租约,另一个 worker 接手恢复。智能体可以无限期睡眠、等待人类输入。**MegaAgent**(arXiv:2408.09955)跑了每智能体一条生产者-消费者队列、三个状态(Idle / Processing / Response)和两层协调(组内聊天 + 组间管理聊天)的实验。**Fiber/async** 胜过"每任务一线程"的 LLM 流式处理:线程 99% 的时间在空等 token,而 fiber 在 I/O 上协作式让出。反方观点:Ashpreet Bedi 的"Scaling Agentic Software"主张**只用 FastAPI + Postgres,别的都不要**,直到负载证明不够为止——简单架构能走得比预想更远。本课构建一个持久化检查点日志、一个带状态迁移的每智能体工作队列、一个 async 对比线程的演示,并把"从简单做起"这条务实法则落地。

**类型:** 学习 + 动手构建
**编程语言:** Python(标准库,`asyncio`、`sqlite3`)
**前置要求:** 第 16 阶段 · 09(并行蜂群网络)、第 16 阶段 · 13(共享记忆)
**预计耗时:** 约 75 分钟

## 问题

一个多智能体原型在笔记本上用内存事件循环跑三个智能体,很好使。搬到生产环境之后:

- 智能体有时一跑就是几个小时(长研究、人类在环等待)。
- Worker 进程会崩。一重启,状态就没了。
- 峰值负载是平均值的 10 倍;你需要水平扩展。
- 用户按智能体运行次数付费;计费需要 exactly-once 语义。

内存事件循环一样都不满足。你需要在下面垫一层持久化执行层。2026 年的主流选项是:

1. 带检查点的工作流引擎(Temporal、LangGraph 运行时)。
2. 消息队列加状态存储(Postgres + SQS/RabbitMQ)。
3. Actor 模型框架(MegaAgent 的每智能体生产者-消费者)。
4. 手搓 FastAPI + Postgres(Bedi 的主张)。

本课把每一种都搭一个微缩版。

## 概念

### 持久化执行这个模式

持久化执行引擎在每个"步"(用 LangGraph 的话说,super-step)之后持久化完整的程序状态。崩溃时:

```
worker crashes mid-step
  -> lease timeout
  -> another worker picks up the thread_id
  -> resumes from last checkpoint
  -> no duplicate side effects
```

要让这套机制工作,需要:

- **可序列化的状态。** 所有智能体状态都必须可持久化。带着活数据库连接的函数闭包是活不下来的。
- **确定性恢复。** 给定相同状态和相同输入,智能体产生相同的动作(或者把 LLM 调用交给一个外部确定性预言机)。
- **幂等副作用。** 外部调用(工具调用、支付)必须幂等,或带一个去重键。

LangGraph 在每个 super-step 后写检查点;Temporal 在每个 activity 后写;Restate 用事件溯源日志。三者实现的是同一个模式。

### 每步一检查点的运行时

LangGraph 的运行时是现成的例子:每个智能体有一个 `thread_id`;状态是一个带类型的 dict;每个 super-step 向 checkpoints 表写一行。恢复时,运行时的重放从最后一个检查点开始,而不是从头开始。智能体可以 `interrupt()` 等待人类输入;运行时会持久化状态并释放 worker。输入到达时,任何 worker 都可以恢复。

这是 2026 年 4 月的生产参考设计。

### MegaAgent 的每智能体队列

arXiv:2408.09955 描述了一个规模实验:一个集群里数千个并发智能体。架构:

```
agent i:
  state ∈ {Idle, Processing, Response}
  in_queue   <- messages addressed to agent i
  out_queue  -> replies + side effects

coordinators:
  intra-group chat  (agents in the same group)
  inter-group admin chat  (high-level routing)
```

两层协调让组内对话可以密集进行,而组间保持稀疏——这是把数千智能体的成本保持在线性水平的模式。

### Async 对比每任务一线程

LLM 调用是 I/O 密集的。一个等下一个 token 的线程 99% 的时间是空闲的。每个线程约耗 1MB 内存;1 万个并发调用,光栈就要 10GB。

Fiber(Python `asyncio`、Go goroutine、Rust `tokio`)在 I/O 上协作式让出。同样的 1 万个调用在一个进程里就能轻松装下。在 LLM 智能体的规模下,async 不是优化——它就是架构。

例外:CPU 密集的后处理(嵌入、分词器技巧)仍然要线程或进程。把你的 I/O 层和 CPU 层分开。

### Bedi 的反方观点

"Scaling Agentic Software"(Ashpreet Bedi,2026)认为,大多数团队在还没测过负载之前就已经过度工程了。务实的默认方案:

- FastAPI + Postgres。
- 每次智能体运行是一行记录;状态用乐观并发原地更新。
- 后台任务走 `pg_notify` 或一个简单的 Celery worker。
- 重试策略写在应用代码里。

对于大约 100 个并发智能体运行以下、任务可控的负载,这往往就是你需要的一切。等实测到它不行了再升级。

这条法则是:当简单架构解决不了的具体问题真的出现时,再采用持久化执行框架。过早采用会把时间烧在不会有回报的仪式上。

### Exactly-once 语义

对付费的智能体运行,你需要"有效 exactly-once"(至少一次投递 + 幂等消费者)。工程动作:

- **每次运行一个去重键。** 每个副作用调用都带上它。
- **Outbox 模式。** 副作用先写进一张表,再由一个独立进程执行。两步都幂等。
- **补偿事务。** 当副作用成功了但跟踪写入失败时,安排一次补偿。

这些是数据库工程模式,不是 LLM 特有的。LLM 带来的额外税负只是 LLM 调用慢;其余全是标准的分布式系统。

### 彩虹部署

Anthropic 的多智能体研究系统使用"彩虹部署"(rainbow deployment):多个版本的智能体运行时同时在线,这样每次发代码时就不必杀掉还在长时间运行的智能体。新版本在一小片流量上做金丝雀;旧版本等它上面的智能体跑完再退役。

这是长时运行有状态系统的标准做法;2026 年的适配点在于智能体可以存活数小时,所以部署周期必须能容纳。

### 生产环境标准检查清单

- 持久化状态(检查点、快照,或 outbox + 可重放日志)。
- 幂等副作用。
- LLM 调用走 async I/O 层。
- 至少一次投递 + 去重。
- 面向有状态负载的彩虹/金丝雀部署。
- 可观测性:逐智能体追踪、super-step 审计、重试计数器。

```figure
sw-checkpoint-replay
```

## 动手构建

`code/main.py` 实现了:

- `CheckpointStore` —— 基于 SQLite 的检查点日志,以 thread-id 为键。每个 super-step 追加一行。
- `run_with_checkpoint(agent, thread_id)` —— 模拟运行中途崩溃;第二个 worker 从最后一个检查点恢复。
- `AgentQueue` —— 每智能体的 Idle / Processing / Response 状态机,带一个小工作队列。
- `demo_async_vs_threads()` —— 用 asyncio 和用线程分别跑 500 个并发模拟"LLM 调用";报告墙上时钟和峰值内存(近似值)。

运行:

```
python3 code/main.py
```

预期输出:模拟崩溃后检查点恢复成功;async 版本在 1 秒内处理完 500 个并发调用;线程版本要数秒,而且每个并发单元的内存占用高出几个数量级。

## 投入使用

`outputs/skill-scaling-advisor.md` 就持久化执行的选型给出建议:FastAPI + Postgres、LangGraph 运行时、Temporal,还是自研。按负载、状态保留需求和部署频率校准。

## 交付

生产加固的标准做法:

- **从简单做起(Bedi 法则)。** FastAPI + Postgres,直到你实测到它不行。
- **优化之前先全量插桩。** 逐运行延迟直方图、逐步耗时、重试次数、失败分类。
- **副作用走 outbox 模式。** 尤其是支付和外部 API 调用。
- **彩虹部署。** 发布时绝不杀掉在途的智能体运行。
- **当你撞上具体问题时,再采用持久化执行引擎(Temporal / LangGraph / Restate):** 数小时的人类在环等待、跨区域协调、复杂的重试/补偿策略。
- **I/O 层用 async。** 线程只留给 CPU 密集的后处理。

## 练习

1. 运行 `code/main.py`。确认检查点恢复可用;测量 async 与线程的并发差异。
2. 实现一张 **outbox** 表:每个工具调用先写 outbox,再由一个独立的 goroutine/任务执行。把同一个工具调用跑两遍,验证幂等性。
3. 模拟一次**彩虹部署**:两个并发运行时版本;把新 thread_id 的一半路由给各版本;确认旧版本上的在途线程不被打断。
4. 阅读 LangGraph 的运行时文档(下方链接)。找出哪些特性在手搓 FastAPI + Postgres 版本里复制起来最耗时。这是采用它的理由吗,还是可以缓一缓?
5. 阅读 MegaAgent(arXiv:2408.09955)第 3 节。两层协调(组内 + 组间管理聊天)是显式的。草拟一下你如何把它映射到一套带两个队列族的消息队列。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|----------|
| Durable execution(持久化执行) | "把程序状态存下来" | 引擎在每个 super-step 后写状态;崩溃恢复是确定性的。 |
| Super-step | "事务边界" | 两个检查点之间的工作单元。LangGraph 术语。 |
| thread_id | "智能体运行标识" | 绑定检查点和恢复逻辑的键。 |
| 幂等性 | "重试安全" | 重复一次副作用与执行一次结果相同。 |
| Outbox 模式 | "解耦副作用" | 把意图写进表;独立执行器执行并标记完成。 |
| 至少一次投递 | "可能有重复" | 消息队列语义;去重键让消费者达到有效一次。 |
| 彩虹部署 | "版本重叠" | 长时运行负载期间多个运行时版本并存。 |
| Async fiber | "协作式让出" | 用户态并发;对 I/O 密集负载比线程便宜。 |
| 检查点 | "状态快照" | super-step 边界上的序列化状态;恢复的关键。 |

## 延伸阅读

- [LangChain —— The runtime behind production deep agents](https://www.langchain.com/conceptual-guides/runtime-behind-production-deep-agents) —— LangGraph 运行时设计
- [MegaAgent](https://arxiv.org/abs/2408.09955) —— 每智能体生产者-消费者队列;数千并发智能体下的两层协调
- [Matrix](https://arxiv.org/abs/2511.21686) —— 以消息队列为协调底座的去中心化框架
- [Temporal 文档](https://docs.temporal.io/) —— 持久化执行的参考工作流引擎
- [Anthropic —— Multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) —— 生产经验,包括彩虹部署
