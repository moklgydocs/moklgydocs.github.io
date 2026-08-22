# 多智能体原语模型

> 四个原语,仅此而已——智能体、移交、共享状态、编排者——张成一个四维设计空间,2026 年交付的主流多智能体框架(AutoGen、LangGraph、CrewAI、OpenAI Agents SDK、Microsoft Agent Framework)都是其中的点。本课从零构建这四个原语,在全部四种形态上跑一个玩具系统,然后把每个主流框架映射到同一组坐标轴上,让你一段话就能读懂任何新发布的框架。

**类型:** 学习
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段(智能体工程)、第 16 阶段 · 01(为什么要多智能体)
**预计耗时:** 约 60 分钟

## 问题

每半年就有一个新的多智能体框架发布。2023 年是 AutoGen,2024 年是 CrewAI、LangGraph 和 OpenAI Swarm,2025 年 4 月是 Google ADK,2026 年 2 月是 Microsoft Agent Framework RC。每篇新闻稿都自称"正确的抽象"。

如果你试图一个一个学,你会 burnout。API 长得不一样,文档对"智能体"是什么各执一词。这个框架把共享内存叫 "blackboard",那个叫 "message pool",第三个叫 "StateGraph"。你开始怀疑这个领域只是在空转。

不是的。剥掉营销外衣,四个原语是稳定的。学一次,之后每个新框架一段话读懂。

## 概念

### 四个原语

1. **智能体(Agent)** —— 一份系统提示词加一份工具列表。无状态;每次运行都从系统提示词和当前消息历史出发。
2. **移交(Handoff)** —— 从一个智能体到另一个的结构化控制权转移。机制上,是一个返回新智能体的工具调用,或一条按条件走的图边。
3. **共享状态(Shared state)** —— 多个智能体能读(有时能写)的任何数据结构。消息池、黑板、键值存储、向量记忆。
4. **编排者(Orchestrator)** —— 决定下一个谁说话的那位。选项:显式的图(确定性)、LLM 发言选择器(软)、上一位发言者的移交调用(OpenAI Swarm)、或队列上的调度器(蜂群架构)。

这就是整个设计空间。每个框架为每个轴选好默认值,剩下的全是表面语法。

### 2026 年每个框架如何映射

| 框架 | 智能体 | 移交 | 共享状态 | 编排者 |
|-----------|-------|---------|--------------|--------------|
| OpenAI Swarm / Agents SDK | `Agent(instructions, tools)` | 工具返回 Agent | 调用方的问题 | LLM 的下一次移交调用 |
| AutoGen v0.4 / AG2 | `ConversableAgent` | GroupChat 上的发言选择器 | 消息池 | 选择器函数(LLM 或轮询) |
| CrewAI | `Agent(role, goal, backstory)` | `Process.Sequential / Hierarchical` | 链式传递的 Task 输出 | 管理者 LLM 或静态顺序 |
| LangGraph | 节点函数 | 图边 + 条件 | `StateGraph` reducer | 图,确定性 |
| Microsoft Agent Framework | 智能体 + 编排模式 | 视模式而定 | 线程 / 上下文 | 视模式而定 |
| Google ADK | 智能体 + A2A 卡片 | A2A 任务 | A2A 工件 | 宿主决定 |

表面差异看起来巨大。底下:同样的四个旋钮。

### 这为什么重要

看清原语之后,框架比较变成一张简短的检查清单:

- 编排者是信任 LLM 来路由(Swarm),还是把路由钉死在代码里(LangGraph)?
- 共享状态是全历史(GroupChat)还是投影式(StateGraph reducer)?
- 智能体能否修改彼此的提示词(CrewAI 管理者),还是只能移交(Swarm)?

这三个问题能回答 80% 的"哪个框架适合这个问题"。你不再选购"最好的多智能体框架",而是为你真正关心的那个轴做设计。

### 无状态的洞察

除共享状态外,每个原语都是无状态的。智能体是 (prompt, tools) 的函数,移交是一次函数调用,编排者是一个调度器。**系统中唯一有状态的东西就是共享状态。** 所有有趣的 bug 都住在那里:记忆投毒(第 15 课)、消息排序、版本管理、写入竞争。

隐藏共享状态的框架(Swarm)把问题推给调用方;集中管理它的框架(LangGraph checkpoint、AutoGen 池)让它可检查,但把协调成本转移到了共享状态的实现上。

### 单个原语的剖析

#### 智能体

```
Agent = (system_prompt, tools, model, optional_name)
```

没有记忆,没有状态。两个系统提示词和工具相同的智能体可以互换。一切看起来像"每智能体状态"的东西,实际上都在共享状态或移交协议里。

#### 移交

```
Handoff = (from_agent, to_agent, reason, payload)
```

三种实现占主导:

- **函数返回** —— 工具返回下一个智能体。这是 OpenAI Swarm 模式。智能体把路由携带在自己的工具 schema 里。
- **图边** —— LangGraph。边是声明式的。LLM 产出一个值,一个条件选出下一个节点。
- **发言选择** —— AutoGen GroupChat。一个选择器函数(有时本身就是一次 LLM 调用)读消息池,挑出下一个发言者。

#### 共享状态

```
SharedState = { messages: [], artifacts: {}, context: {} }
```

最少是一个消息列表。常常更多:结构化工件(CrewAI Task 输出)、带类型的上下文(LangGraph reducer)、外部记忆(MCP、向量数据库)。

两种拓扑:**全量池**(每个智能体看到每条消息)和**投影池**(智能体看到按角色划定的视图)。全量池简单但扩展性差;投影池能扩展,但需要预先设计 schema。

#### 编排者

```
Orchestrator = ({state, last_speaker}) -> next_agent
```

四种风味:

- **静态** —— 图在构建时固定(LangGraph 确定性、CrewAI Sequential)。
- **LLM 选择** —— 一个 LLM 读消息池,挑下一个发言者(AutoGen、CrewAI Hierarchical)。
- **移交驱动** —— 当前智能体通过调用移交工具来决定(Swarm)。
- **队列驱动** —— 工人从共享队列领活;没有显式的"下一个发言者"(蜂群架构、Matrix)。

### 框架之间真正变化的是什么

原语定了之后,剩下的设计决策是:

- **记忆策略** —— 易失 vs 持久检查点(LangGraph checkpointer)。
- **安全边界** —— 谁能批准一次移交(human-in-the-loop)。
- **成本核算** —— 每智能体的 token 预算。
- **可观测性** —— 追踪移交、持久化状态供回放。

全都可以在四个原语之上实现。没有一个是新原语。

```figure
a5-primitive-radar
```

## 动手构建

`code/main.py` 用约 150 行标准库 Python 实现四个原语。没有真实 LLM——每个智能体是一个脚本化策略,好让焦点留在协调结构上。

文件导出:

- `Agent` —— 一个 dataclass:名字、系统提示词、工具、策略函数。
- `Handoff` —— 一个返回新智能体的函数。
- `SharedState` —— 一个线程安全的消息池。
- `Orchestrator` —— 三个变体:`StaticOrchestrator`、`HandoffOrchestrator`、`LLMSelectorOrchestrator`(模拟)。

演示把同一条三智能体流水线(研究 → 写作 → 评审)在全部三种编排者类型上各跑一遍,最后打印消息池。你会看到:输出的差别只在*谁挑下一个*;各次运行中,智能体和共享状态完全相同。

运行:

```
python3 code/main.py
```

预期输出:三次编排者运行,每种模式一次。各自打印最终消息池。移交驱动的那次,如果研究员早早决定自己干完了,到达的智能体就更少——这就是 LLM 路由取舍的缩影。

## 投入使用

`outputs/skill-primitive-mapper.md` 是一个技能:读任何多智能体代码库或框架文档,返回四原语映射。在新框架发布时跑一遍,深入读文档之前先拿到一段话的理解。

## 交付

采用新框架之前,先写出它的原语映射。写不出来,说明文档不全,或框架发明了第五个原语(罕见——检查是不是有你没见过的共享状态风味)。

把映射钉进你的架构文档。新团队成员加入时,先发映射再发 API 文档。框架版本变化时,diff 映射,而不是 changelog。

## 练习

1. 用不同的智能体策略跑 `code/main.py` 三次。观察编排者的选择如何改变哪些智能体运行。
2. 实现第四种编排者类型:队列驱动的,智能体轮询共享状态领活。会发生什么死锁,怎么检测?
3. 拿 LangGraph 快速上手(https://docs.langchain.com/oss/python/langgraph/workflows-agents),把它改写成四个原语。LangGraph 的哪些抽象是一一映射,哪些只是便利包装?
4. 读 OpenAI Swarm  cookbook(https://developers.openai.com/cookbook/examples/orchestrating_agents)。指出四个原语中,Swarm 把哪个做得最顺手,又把哪个推给了调用方。
5. 在这张表里找一个完全隐藏共享状态的框架。解释当智能体需要跨移交协调、又不能重读历史时,会坏掉什么。

## 关键术语

| 术语 | 大家口头的说法 | 实际含义 |
|------|----------------|------------------------|
| 智能体(Agent) | "带工具的 LLM" | 一个 `(system_prompt, tools, model)` 三元组。无状态。 |
| 移交(Handoff) | "控制权转移" | 一次指名下一个智能体和可选载荷的结构化调用。三种实现:函数返回、图边、发言选择。 |
| 共享状态 | "记忆" / "上下文" | 多智能体系统中唯一有状态的部分。消息池或黑板。 |
| 编排者(Orchestrator) | "协调者" | 决定下一个谁运行的那位。静态图、LLM 选择器、移交驱动或队列驱动。 |
| 原语(Primitive) | "抽象" | 每个框架都要参数化的四个轴之一。不是框架特性。 |
| 消息池 | "共享聊天记录" | 全历史的共享状态。容易推理,扩展性差。 |
| 投影状态 | "限定视图" | 按角色划定的共享状态视图。可扩展,需要 schema 设计。 |
| 发言选择 | "下一个谁说" | 一种编排模式:一个函数(常常是 LLM)从一组智能体中挑出下一个。 |

## 延伸阅读

- [OpenAI cookbook: Orchestrating Agents — Routines and Handoffs](https://developers.openai.com/cookbook/examples/orchestrating_agents) — 移交驱动编排最清晰的阐述
- [AutoGen stable docs](https://microsoft.github.io/autogen/stable/) — GroupChat + 发言选择,LLM 选择式编排的参考
- [LangGraph workflows and agents](https://docs.langchain.com/oss/python/langgraph/workflows-agents) — 图边编排与基于 reducer 的共享状态
- [CrewAI introduction](https://docs.crewai.com/en/introduction) — 角色-目标-背景设定的智能体,Sequential / Hierarchical 流程
- [AG2(社区 AutoGen 延续)](https://github.com/ag2ai/ag2) — 微软把 v0.4 转入维护后,AutoGen v0.2 的活跃分支
