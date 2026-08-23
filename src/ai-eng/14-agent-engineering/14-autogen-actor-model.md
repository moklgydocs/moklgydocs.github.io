# 智能体的 Actor 模型 —— 异步消息与带类型运行时

> 智能体即 actor:异步消息交换、事件驱动处理器、逐 actor 故障隔离、天然并发。AutoGen v0.4(Microsoft Research,2025 年 1 月)围绕这个模型重设计了智能体编排;该框架现处于维护模式,生产后继者是 Microsoft Agent Framework(2025 年 10 月公开预览)。

**类型:** 学习 + 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 01(智能体循环)、第 14 阶段 · 12(工作流模式)
**预计耗时:** 约 75 分钟

## 学习目标

- 描述 actor 模型:智能体即 actor,消息是唯一 IPC,逐 actor 故障隔离。
- 说出 AutoGen v0.4 的三层 API——Core、AgentChat、Extensions——及各自用途。
- 解释为什么把消息投递与处理解耦能带来故障隔离和天然并发。
- 用 Python 纯标准库实现一个 actor 运行时,并把一个双智能体代码评审流程移植上去。

## 问题

大多数智能体框架是同步的:一个智能体产出,一个智能体消费,都在一条调用栈上。一次失败搞垮整条栈;并发是后贴的;分布式要重写。

AutoGen v0.4 的答案:actor 模型。每个智能体是一个带私有收件箱的 actor,消息是唯一交互方式,运行时把投递与处理解耦。故障隔离在单个 actor 内,并发是天然的,分布式只是换个传输层。

## 概念

### Actor

一个 actor 有:

- 私有状态(外部永远不能直接碰)。
- 收件箱(消息队列)。
- 处理器:`receive(message) -> effects`,effects 可以是"回复"、"发给其他 actor"、"生成新 actor"、"更新状态"、"停止自己"。

两个 actor 不能共享内存,只能发消息。

### 三层 API

AutoGen v0.4 把表面分成三层:

1. **Core。** 低层 actor 框架:`AgentRuntime`、`Agent`、`Message`、`Topic`。异步消息交换,事件驱动。
2. **AgentChat。** 任务驱动的高层 API(替代 v0.2 的 ConversableAgent):`AssistantAgent`、`UserProxyAgent`、`RoundRobinGroupChat`、`SelectorGroupChat`。
3. **Extensions。** 集成——OpenAI、Anthropic、Azure、工具、记忆。

### 为什么解耦要紧

v0.2 模型里,`agent_a.chat(agent_b)` 同步阻塞 agent_a 直到 agent_b 返回。v0.4 里,`send(agent_b, msg)` 把消息放进 agent_b 的收件箱就返回,运行时稍后投递。三个后果:

- **故障隔离。** actor B 崩了不会拖垮 actor A——运行时在 B 的处理器里接住失败,决定怎么办(记日志、重试、进死信队列)。
- **天然并发。** 许多消息同时在途;actor 并发处理自己的收件箱。
- **分布式就绪。** 收件箱 + 传输是同一个抽象,无论 actor 在进程内还是另一台主机上。

### 拓扑

- **RoundRobinGroupChat。** 智能体按固定轮转依次发言。
- **SelectorGroupChat。** 一个 selector 智能体根据对话上下文挑选下一个发言者。
- **Magentic-One。** 参考多智能体团队:网页浏览、代码执行、文件处理。建在 AgentChat 上。

### 可观测性

内置 OpenTelemetry 支持。每条消息发出一个 span;工具调用按 2026 年 OTel GenAI 语义约定携带 `gen_ai.*` 属性(第 23 课)。

### 现状:维护模式

2026 年初:AutoGen v0.7.x 对研究和原型稳定可用。微软已把主力开发转向 Microsoft Agent Framework——生产后继者(2025 年 10 月 1 日公开预览;1.0 GA 目标 2026 年 Q1 末)。AutoGen 的模式可以干净地前移——actor 模型是经得起时间的那个思想。

```figure
actor-mailbox
```

## 动手构建

`code/main.py` 用纯标准库实现 actor 运行时:

- `Message` —— 带类型载荷:`sender`、`recipient`、`topic`、`body`。
- `Actor` —— 抽象类,含 `receive(message, runtime)`。
- `Runtime` —— 事件循环:共享队列、投递、故障隔离。
- 双 actor 演示:`ReviewerAgent` 评审代码,`ChecklistAgent` 跑检查清单;它们交换消息直到达成共识。

运行:

```
python3 code/main.py
```

轨迹展示:消息投递、一个 actor 的模拟失败不拖垮另一个、收敛到共同结论。

## 投入使用

- **AutoGen v0.4/v0.7**(维护中)—— 研究、原型、多智能体模式上稳定。
- **Microsoft Agent Framework** —— 生产后继者(2025 年 10 月公开预览);同样的 actor 模型思想,刷新的 API。
- **LangGraph swarm 拓扑**(第 13 课)—— 通过共享工具交接的相似模式。
- **自建 actor 运行时** —— 需要特定传输(NATS、RabbitMQ、gRPC)时。

## 交付

`outputs/skill-actor-runtime.md`:生成最小 actor 运行时,外加给定多智能体任务的团队模板(RoundRobin 或 Selector)。

## 练习

1. 加死信队列:处理器抛异常时,把失败消息停进去供人工检查。你的玩具里 DLQ 命中频率多高?
2. 实现 `SelectorGroupChat`:selector actor 根据对话状态挑选谁处理下一条消息。
3. 加分布式传输:把进程内队列换成 JSON-over-HTTP 服务器,让 actor 能跑在不同进程里。
4. 给每条消息接一个 OTel span(或空操作替身)。按第 23 课发出 `gen_ai.agent.name`、`gen_ai.operation.name`。
5. 读 AutoGen v0.4 架构文章。把玩具移植到真实的 `autogen_core` API。你跳过了哪些生产中要紧的东西?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| Actor | "智能体" | 私有状态 + 收件箱 + 处理器;无共享内存 |
| 消息 | "事件" | 带类型载荷;actor 交互的唯一方式 |
| 收件箱 | "邮箱" | 逐 actor 的待处理消息队列 |
| 运行时 | "智能体宿主" | 路由消息并隔离故障的事件循环 |
| Topic | "频道" | actor 之间命名的发布-订阅路由 |
| 故障隔离 | "让它崩" | 一个 actor 失败不拖垮其他 |
| RoundRobinGroupChat | "固定轮转团队" | 智能体按顺序轮流 |
| SelectorGroupChat | "上下文路由团队" | selector 挑选下一个 |
| Magentic-One | "参考团队" | 网页 + 代码 + 文件的多智能体小队 |

## 延伸阅读

- [AutoGen v0.4,Microsoft Research](https://www.microsoft.com/en-us/research/articles/autogen-v0-4-reimagining-the-foundation-of-agentic-ai-for-scale-extensibility-and-robustness/) —— 重设计文章
- [LangGraph 概览](https://docs.langchain.com/oss/python/langgraph/overview) —— 图形态的替代
- [OpenTelemetry GenAI 语义约定](https://opentelemetry.io/docs/specs/semconv/gen-ai/) —— AutoGen 默认发出的 span
