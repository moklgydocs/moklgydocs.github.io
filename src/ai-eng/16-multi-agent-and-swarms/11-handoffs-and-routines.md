# Handoff 与 Routine —— 无状态编排

> OpenAI 的 Swarm(2024 年 10 月）把多智能体编排蒸馏成两个原语：**routine**（指令 + 工具，作为系统提示词）和 **handoff**（一个返回另一个 Agent 的工具）。没有状态机，没有分支 DSL——由 LLM 通过调用正确的 handoff 工具来路由。OpenAI Agents SDK(2025 年 3 月）是它的生产继任者。Swarm 本身仍是最干净的概念参考——它的全部源码只有几百行。这个模式之所以病毒式传播，是因为它的 API 表面大致就是"agent = prompt + tools;handoff = 返回 agent 的函数"。局限：无状态，所以记忆是调用方自己的问题。

**类型：** Learn + Build
**编程语言：** Python（标准库）
**前置要求：** 第 16 阶段 · 04（原语模型）
**预计耗时：** 约 60 分钟

## 问题

每个多智能体框架都想让你学它的 DSL:LangGraph 的节点和边、CrewAI 的 crew 和 task、AutoGen 的 GroupChat 和 manager。这些 DSL 是真实的抽象，但它们让这件事显得比实际更重。

Swarm 推向相反的方向：直接用模型已有的工具调用能力。handoff 变成工具调用；编排者就是当前持有对话的那个智能体；状态机隐含在各智能体的系统提示词里。

## 概念

### 两个原语

**Routine（例程）。** 一段定义智能体角色和可用工具的系统提示词。把它想成一组有范围的指令："你是分诊智能体；如果用户问退款，handoff 给退款智能体。"

**Handoff（移交）。** 一个智能体可以调用的工具，它返回一个新的 Agent 对象。Swarm 运行时检测到 Agent 返回值，就为下一轮切换活跃智能体。

这就是全部的抽象。

```
def transfer_to_refunds():
    return refund_agent  # Swarm sees Agent return → switch active agent

triage_agent = Agent(
    name="triage",
    instructions="Route the user to the right specialist.",
    functions=[transfer_to_refunds, transfer_to_sales, transfer_to_support],
)
```

分诊智能体的系统提示词让它根据用户消息选择正确的 handoff。路由由 LLM 的工具调用完成。

### 为什么它病毒式传播

- **API 小。** 只要学两个概念。
- **用的是模型本来就会的。** 工具调用在各厂商那里早就是生产级的。
- **没有状态机负担。** 你不用描述图；各智能体的提示词描述了它们移交给谁。

### 无状态的代价

Swarm 明确地在两次运行之间无状态。框架在一次运行内保持消息历史，但不持久化任何东西。记忆、连续性、长时间运行的任务——全是调用方的问题。

在生产继任者（OpenAI Agents SDK,2025 年 3 月）里，这是主要的变化点之一：SDK 在保留 handoff 原语的同时，加上了内置的会话管理、护栏和追踪。

### Swarm/handoff 适合的场景

- **分诊模式。** 一线智能体把用户路由给专家。
- **按技能的移交。** "任务需要代码，叫 coder；需要调研，叫 researcher。"
- **短而有限的对话。** 客服、FAQ 转工单、简单工作流。

### Swarm 吃力的场景

- **带共享记忆的长会话。** Handoff 会把对话状态重置为"新智能体的提示词 + 历史"。没有调用方管理的记忆，跨智能体就没有持久状态。
- **并行执行。** Handoff 一次一个——活跃智能体切换。并行需要调用方编排多个 Swarm 运行。
- **审计与重放。** 无状态的运行难以精确重放；LLM 的 handoff 选择不是确定性的。

### OpenAI Agents SDK(2025 年 3 月）

生产继任者增加了：

- **会话状态。** 跨运行持久的线程。
- **护栏。** 输入/输出校验钩子。
- **追踪。** 每次工具调用和 handoff 都有日志。
- **Handoff 过滤器。** 控制 handoff 时转移哪些上下文。

handoff 原语留存下来，生产级的人体工学加在了它周围。

### Swarm vs GroupChat

两者都用 LLM 驱动的路由，但**谁挑下一个**不同：

- GroupChat：一个选择器（函数或 LLM）从外部挑选下一个发言者。
- Swarm：当前智能体通过调用 handoff 工具挑选自己的继任者。

Swarm 是"智能体决定接下来是谁";GroupChat 是"管理者决定接下来是谁"。Swarm 的决策活在活跃智能体的工具调用里；GroupChat 的决策活在 `GroupChatManager` 里。

```figure
sw-handoff-routing
```

## 动手构建

`code/main.py` 从零实现 Swarm：一个 Agent dataclass、一个 handoff 机制（工具返回 Agent)，以及一个能检测智能体切换的运行循环。

演示：一个分诊智能体把用户路由给退款、销售或支持专家。每个专家有自己的工具。运行循环打印每次 handoff。

运行：

```
python3 code/main.py
```

## 投入使用

`outputs/skill-handoff-designer.md` 为给定任务设计 handoff 拓扑：有哪些智能体、它们能调哪些 handoff、移交时转移什么上下文。

## 交付

检查清单：

- **Handoff 日志。** 每次 handoff 写一条追踪事件：from-agent、to-agent、上下文快照。
- **上下文转移规则。** 决定 handoff 时转移什么：完整历史（贵）、最近 N 条消息、或一份摘要。
- **Handoff 上的护栏。** 移交到一个工具权限不同的专家时必须认证——否则提示词注入可以强迫发生不想要的 handoff。
- **循环检测。** 两个智能体来回互转是常见故障；用一个简单的 last-K 环形检查来检测。
- **兜底智能体。** 如果 handoff 目标不存在，退回一个安全的默认。

## 练习

1. 跑 `code/main.py`，分诊到退款智能体。确认第二轮的活跃智能体是 refund。
2. 加一条循环检测规则：如果同一对智能体连续互转 3 次，强制退出。设计兜底方案。
3. 读 OpenAI Agents SDK 文档里关于 handoff 过滤器的部分。实现一个"移交时摘要"版本：离开的智能体先把上下文压缩成要点摘要，再由进入的智能体接手。
4. 对比 Swarm 的 handoff 和 GroupChatManager 的选择器。哪个模式会让提示词注入更糟，为什么？
5. 读 Swarm cookbook(https://developers.openai.com/cookbook/examples/orchestrating_agents)。找出一个 Swarm 做的而 OpenAI Agents SDK 改掉或保留的明确设计决策。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| Routine | "智能体的提示词" | 系统提示词 + 工具清单。定义角色和可用的 handoff |
| Handoff | "转给另一个智能体" | 活跃智能体可调用的、返回新 Agent 的工具。运行时切换活跃智能体 |
| 无状态 | "运行之间没记忆" | Swarm 不持久化任何东西；记忆是调用方的责任 |
| 活跃智能体 | "现在谁在说话" | 当前持有对话的智能体。Handoff 会改变它 |
| 上下文转移 | "移交时带走什么" | 进入的智能体看到多少历史的策略：全部、最近 N 条、或摘要 |
| Handoff 循环 | "智能体打乒乓" | 两个智能体不停互转的故障模式 |
| OpenAI Agents SDK | "生产版 Swarm" | 2025 年 3 月的继任者；在 handoff 原语之上加了会话、护栏、追踪 |
| Handoff 过滤器 | "转移闸门" | SDK 特性，在 handoff 边界检查和修改上下文 |

## 延伸阅读

- [OpenAI cookbook —— Orchestrating Agents: Routines and Handoffs](https://developers.openai.com/cookbook/examples/orchestrating_agents) —— 参考级阐述
- [OpenAI Swarm 仓库](https://github.com/openai/swarm) —— 原始实现，作为概念参考保留
- [OpenAI Agents SDK 文档](https://openai.github.io/openai-agents-python/) —— 带会话与追踪的生产继任者
- [Anthropic 关于 Claude 中 handoff 的说明](https://docs.anthropic.com/en/docs/claude-code) —— Claude Code 的子智能体如何通过 `Task` 使用类 handoff 模式
