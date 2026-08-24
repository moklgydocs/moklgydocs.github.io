# 智能体框架的权衡——图、角色与 Actor 编排

> 每个框架卖的都是同一个 demo(研究智能体产出一份报告),藏的都是同一个 bug(状态 schema 与编排层打架)。选那个抽象与你问题形状匹配的框架;除此之外的一切,都是你要写两遍的胶水。

**类型:** 学习
**编程语言:** Python
**前置要求:** 第 11 阶段 · 09(函数调用),第 11 阶段 · 16(LangGraph)
**预计耗时:** 约 45 分钟

## 问题

你手上有个任务,一次 LLM 调用搞不定。可能是研究工作流(规划、搜索、总结、引用),可能是代码评审流水线(解析 diff、批评、打补丁、验证),也可能是一个订机票、写邮件、填报销单的多轮助手。你挑了一个框架。

三天后,你发现这个框架的抽象在漏风:CrewAI 给了你角色,但当"研究员"要把一份结构化计划交给"写手"时,它处处与你作对;AutoGen 给了你智能体之间的聊天,却没有一等公民的状态——你的检查点只能是一坨对话日志的 pickle;LangGraph 给了你状态图,却逼你在还不知道智能体会干什么之前,就给每个转移命名;Agno 给了你单智能体抽象,当你要扇出到三个并发 worker 时,它会尖叫。

解法不是"挑最好的框架",而是让框架的核心抽象对上你问题的形状。本课就画这张地图。

## 概念

![智能体框架矩阵:核心抽象 vs 问题形状](./assets/framework-matrix.svg)

四个框架主导 2026 年的版图。它们的核心抽象并不相同。

| 框架 | 核心抽象 | 最佳匹配 | 最差匹配 |
|-----------|------------------|----------|-----------|
| **LangGraph** | `StateGraph`——类型化状态、节点、条件边、检查点器 | 状态显式、带人在环路中断的工作流;需要时间旅行调试的生产智能体 | 拓扑未知的松散角色式头脑风暴 |
| **CrewAI** | `Crew`——角色(goal、backstory)、任务、流程(顺序或层级) | 角色扮演或人设驱动、计划短而线性的工作流 | 任何超出 crew 轮次历史的带状态需求;复杂分支 |
| **AutoGen** | `ConversableAgent` 对——两个或多个智能体轮流对话,直到满足退出条件 | 多智能体*对话*(师生、提议者-批评者、演员-评审),思考从聊天中涌现 | 已知 DAG 的确定性工作流;任何需要跨重启持久状态的需求 |
| **Agno** | `Agent`——单个 LLM + 工具 + 记忆,可组合成团队 | 快速搭建的单智能体与轻量团队;多模态强、内置存储驱动 | 需要自定义 reducer 的深度显式分支图 |

### "抽象"到底是什么意思

框架的核心抽象,就是你在白板上推销架构时画出来的那个东西。

- **LangGraph** → 你画一张图:节点是步骤,边是转移,每个点上的状态对象都是带类型的。心智模型是状态机。
- **CrewAI** → 你画一张组织架构图:每个角色有岗位描述,经理负责派活。心智模型是一小队专家。
- **AutoGen** → 你画一个 Slack 私聊:两个智能体互发消息,需要主持人就拉第三个进来。心智模型是聊天。
- **Agno** → 你画一个挂着工具的方盒子;要团队就把几个盒子摆在一起。心智模型是"自带电池的智能体"。

### 状态问题

生产环境里,大多数框架选型都死在状态上。

- **LangGraph。** 类型化状态(`TypedDict` 或 Pydantic 模型)、逐字段 reducer、一等公民的检查点器(SQLite/Postgres/Redis)。恢复、中断、时间旅行全免费。*(见第 11 阶段 · 16。)*
- **CrewAI。** 状态以字符串形式经 `context` 字段在任务间流动,或经 `output_pydantic` 结构化。开箱没有按 crew 的持久存储——要让 crew 活过重启,得自己挂。
- **AutoGen。** 状态就是聊天历史,外加用户自定义的 `context`。对话记录可持久;任意的工作流状态不行,除非你写适配器。
- **Agno。** 内置存储驱动(SQLite、Postgres、Mongo、Redis、DynamoDB),经 `storage=` 挂到 `Agent` 上——会话与用户记忆自动持久。不是完整的图检查点器,只是会话存储。

### 分支问题

每个不平凡的智能体都要分支。谁来决定分支,至关重要。

- **LangGraph**——你决定,用条件边:路由是一个带命名分支的 Python 函数;分支是编译图里的一等公民,检查点会记录走了哪一支。
- **CrewAI**——层级模式下由经理决定;顺序模式下你在构建时决定。路由隐含在任务列表里,经理提示词之外没有一等公民的"if"。
- **AutoGen**——智能体通过聊天决定:分支从"下一个谁说话"中涌现。`GroupChatManager` 选择下一个发言者;你可以手写 `speaker_selection_method`,但默认由 LLM 驱动。
- **Agno**——由智能体决定下一个调哪个工具。团队有 coordinator/router/collaborator 三种模式;超出这个范围的分支是开发者自己的责任。

### 可观测性问题

- **LangGraph**——经 LangSmith 或任意 OTel 导出器接 OpenTelemetry:每次节点转移都是一个 trace span,检查点同时就是可回放的轨迹。LangSmith 是第一方选项,Langfuse/Phoenix 也有适配器。
- **CrewAI**——2025 年底起有一等 OpenTelemetry;集成 Langfuse、Phoenix、Opik、AgentOps。
- **AutoGen**——经 `autogen-core` 集成 OpenTelemetry;AgentOps 和 Opik 有连接器。追踪粒度是每条智能体消息,而不是每个节点。
- **Agno**——内置 `monitoring=True` 开关加 OpenTelemetry 导出器;与 Langfuse 的会话轨迹集成紧密。

### 成本与延迟

四个框架都有每次调用的开销(框架逻辑、校验、序列化)。开销从小到大大致是:Agno ≈ LangGraph < CrewAI ≈ AutoGen。差异主要由框架做了多少额外的 LLM 路由决定:CrewAI 的层级经理要花 token 决定下一个谁上,AutoGen 的 `GroupChatManager` 也一样;LangGraph 只在你写 `llm.invoke` 的地方花 token;Agno 的单智能体路径很薄。

当单次运行成本要紧时,优先显式路由(LangGraph 的边、AutoGen 的 `speaker_selection_method`),而不是 LLM 自选路由。

### 互操作性

- **LangGraph** ↔ **LangChain** 的工具、检索器、LLM。一等 MCP 适配器(工具作为 MCP 服务器导入)。
- **CrewAI** ↔ 工具继承 `BaseTool`;LangChain 工具、LlamaIndex 工具和 MCP 工具都能适配接入。crew 之间经 `allow_delegation=True` 委派。
- **AutoGen** → `FunctionTool` 包装任意 Python 可调用;有 MCP 适配器。智能体间模式与 AG2 生态耦合紧。
- **Agno** → `@tool` 装饰器或 BaseTool 子类;MCP 适配器;工具可跨智能体与团队共享。

## 技能

> 你能用一句话说清:为什么这个框架适合这个智能体问题。

动手前检查单:

1. **画出形状。** 这是一张图(类型化状态、命名转移)?一场角色扮演(专家之间交接工作)?一场聊天(智能体聊到完成为止)?还是一个带工具的单智能体?
2. **决定谁分支。** 开发者决定 → LangGraph;经理智能体决定 → CrewAI 层级模式;聊天涌现 → AutoGen;工具调用决定 → Agno。
3. **核对状态预算。** 需要从检查点恢复吗?时间旅行?运行中的人类中断?需要,默认 LangGraph;Agno 的会话能覆盖对话级状态。
4. **核对成本预算。** LLM 自选路由每轮多花 token。智能体一天跑几千次的话,优先显式路由。
5. **预算框架开销。** 每个框架都是一份依赖。任务只是两次 LLM 调用加一个工具的话,写 30 行纯 Python——没有框架比"不用框架"更便宜。

在你能画出图、组织架构图、聊天或智能体方盒之前,拒绝伸手拿框架;拒绝选一个逼你在它的状态模型上为真正需要的东西打架的框架。

## 决策矩阵

| 问题形状 | 首选框架 | 为什么 |
|---------------|---------------------|-----|
| 带类型化状态、人类批准、长运行的 DAG 工作流 | LangGraph | 一等状态、检查点器、中断、时间旅行 |
| 角色分明的研究/写作流水线 | CrewAI(顺序)或 LangGraph 子图 | 每任务一角色在 CrewAI 里表达便宜;分支变复杂时上 LangGraph |
| 提议者-批评者或师生对话 | AutoGen | 双智能体聊天是它的原生形状 |
| 带工具、会话、记忆的单智能体 | Agno | 搭建最薄,内置存储与记忆 |
| 数千路并行扇出加 reducer | LangGraph + `Send` | 唯一有一等并行派发 API 的 |
| 快速原型,不想绑定框架 | 纯 Python + 提供方 SDK | 不用框架是最快的框架 |

```figure
l5-framework-fit
```

## 练习

1. **简单。** 同一个任务——"调研 Anthropic 总部地址,写 200 字简报,附引用来源"——分别用 LangGraph(四个节点:plan、search、write、cite)和 CrewAI(三个角色:researcher、writer、editor)实现。报告每次运行的 token 成本和代码行数。
2. **中等。** 用 AutoGen(researcher ↔ writer 聊天,editor 经 `GroupChat` 加入)和 Agno(单智能体带 `search_tools` 与 `write_tools`,加会话存储)实现同一任务。从三个维度给四种实现排序:(a) 单次运行成本,(b) 崩溃后恢复能力,(c) 在写步骤前插入人类批准的能力。
3. **困难。** 构建一个决策树脚本 `pick_framework.py`:输入简短的问题描述(JSON:`{has_typed_state, has_roles, has_dialogue, has_parallel_fanout, needs_resume}`),输出推荐及一句话理由。用你自己设计的六个案例验证。

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|-----------------|-----------------------|
| 编排(Orchestration) | "智能体们怎么协调" | 决定下一个运行哪个节点/角色/智能体的那一层 |
| 持久状态(Durable state) | "重启后能恢复" | 挂在检查点或会话存储上、进程死掉也幸存的状态 |
| LLM 自选路由(LLM-selected routing) | "让模型决定" | 规划 LLM 每轮挑选下一步;灵活,但每个决定都花 token |
| 显式路由(Explicit routing) | "开发者决定" | 由 Python 函数或静态边挑选下一步;便宜且可审计 |
| Crew | "CrewAI 的团队" | 角色 + 任务 + 流程(顺序或层级)绑定成的单个可运行体 |
| GroupChat | "AutoGen 的多智能体聊天" | N 个智能体之间带发言选择器的受管对话 |
| Team(Agno) | "Agno 多智能体" | 一组智能体之上的 route / coordinate / collaborate 模式 |
| StateGraph | "LangGraph 的图" | 类型化状态、节点、条件边、检查点器的抽象 |

## 延伸阅读

- [LangGraph documentation](https://langchain-ai.github.io/langgraph/)——StateGraph、检查点器、中断、时间旅行
- [CrewAI documentation](https://docs.crewai.com/)——Crew、Flow、Agent、Task、Process
- [AutoGen documentation](https://microsoft.github.io/autogen/)——ConversableAgent、GroupChat、team、tool
- [Agno documentation](https://docs.agno.com/)——Agent、Team、Workflow、storage、memory
- [Anthropic — Building effective agents (Dec 2024)](https://www.anthropic.com/research/building-effective-agents)——框架无关的模式库(提示链、路由、并行化、orchestrator-workers、evaluator-optimizer)
- [Yao et al., "ReAct: Synergizing Reasoning and Acting" (ICLR 2023)](https://arxiv.org/abs/2210.03629)——每个框架都在包装的那个循环
- [Wu et al., "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation" (2023)](https://arxiv.org/abs/2308.08155)——AutoGen 的设计论文
- [Park et al., "Generative Agents: Interactive Simulacra of Human Behavior" (UIST 2023)](https://arxiv.org/abs/2304.03442)——CrewAI 式人设栈赖以搭建的角色扮演基础
- 第 11 阶段 · 16(LangGraph)——本课拿来对标的框架
- 第 11 阶段 · 19(Reflexion)——一个映射到 LangGraph 很自然、映射到 CrewAI 很别扭的模式
- 第 11 阶段 · 22(生产可观测性)——无论你选了哪个框架,如何给它插桩
