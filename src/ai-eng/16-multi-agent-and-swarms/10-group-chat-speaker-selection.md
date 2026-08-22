# 群聊与发言者选择

> 共享会话编排:把 N 个智能体放进同一段对话;一个选择器函数(LLM、轮询或自定义)决定下一个谁发言。这是涌现式多智能体对话的原型——智能体不知道自己在静态图中的角色,它们只是对共享池做出反应。AutoGen GroupChat 和 AG2 GroupChat 是参考实现:AutoGen v0.2 的 GroupChat 语义被 AG2 分支保留了下来;AutoGen v0.4 则把它重写为事件驱动的 actor 模型。微软在 2026 年 2 月把 AutoGen 转入维护模式,将其与 Semantic Kernel 合并为 Microsoft Agent Framework(2026 年 2 月 RC)。GroupChat 这个原语在 AG2 和 Microsoft Agent Framework 两条线上都活着——学一次,到处用。

**类型:** 学习 + 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 16 阶段 · 04(原语模型)
**预计耗时:** 约 60 分钟

## 问题

静态图(LangGraph)在工作流已知时很好用。真实对话不是静态的:有时程序员问评审,有时问研究员,有时问写作者。把每一种可能的移交都硬编码,会得到边爆炸。你想要的是*智能体对一个共享池做出反应*,由某个函数决定下一个谁说话。

这正是 AutoGen GroupChat 做的事。

## 概念

### 形状

```
              ┌─── shared pool ────┐
              │   m1  m2  m3  ...  │
              └─────────┬──────────┘
                        │ (everyone reads all)
      ┌───────┬─────────┼─────────┬───────┐
      ▼       ▼         ▼         ▼       ▼
    Agent A  Agent B  Agent C  Agent D  Selector
                                           │
                                           ▼
                                  "next speaker = C"
```

每个智能体看到每条消息。每轮调用一次选择器函数,挑出下一个发言者。

### 三种选择器风味

**轮询(Round-robin)。** 固定循环。确定性。随 N 线性扩展,但无视上下文——话题明明是法务评审,照样轮到程序员。

**LLM 选择。** 调用一个 LLM,读最近的池内容,返回最佳下一个发言者。感知上下文,但慢:每一轮多一次 LLM 调用。AutoGen 的默认。

**自定义。** 一个 Python 函数,逻辑随你写。典型:LLM 选择加回退规则(如"程序员说完之后,永远给验证者一轮")。

### ConversableAgent API

```
agent = ConversableAgent(
    name="coder",
    system_message="You write Python.",
    llm_config={...},
)
chat = GroupChat(agents=[coder, reviewer, tester], messages=[])
manager = GroupChatManager(groupchat=chat, llm_config={...})
```

`GroupChatManager` 持有选择器。一个智能体完成一轮后,管理器调用选择器,返回下一个智能体。循环继续,直到满足终止条件。

### 终止

三种常见模式:

- **最大轮数。** 总轮数硬上限。
- **"TERMINATE" token。** 智能体可以发出哨兵消息;管理器见到即停。
- **目标达成检查。** 一个轻量验证者每轮运行,完成即停。

### 谱系:分支与合并

2025 年初,微软开始围绕事件驱动的 actor 模型对 AutoGen 做大改写(v0.4)。社区把 AutoGen v0.2 的 GroupChat 语义 fork 为 AG2,保住了早期采用者已经集成的 API。

2026 年 2 月,微软宣布 AutoGen 进入维护模式,事件驱动的 actor 模型并入 **Microsoft Agent Framework**(2026 年 2 月 RC,现已与 Semantic Kernel 合并)。GroupChat 概念在两条线上都活着,实现细节不同。需要 v0.2 兼容代码,AG2 是首选上游。

### GroupChat 何时合适

- **涌现式对话。** 你不想预先接好每一种"下一个谁发言"。
- **角色混合任务。** 程序员问研究员,研究员问档案员,档案员回头问程序员。流程不是 DAG。
- **探索式解题。** 是"头脑风暴会",不是"流水线"。

### 何时失败

- **严格确定性。** LLM 选择器可能不一致。同样的提示词,不同运行,不同的下一个发言者。
- **谄媚级联。** 智能体倒向说话最自信的那个。要用反提示明确对冲。
- **上下文膨胀。** 每个智能体读每条消息;10 轮之后上下文巨大。用投影(第 15 课)限定视图。
- **热门发言者。** 一个智能体主导对话,因为选择器偏爱它的专长。把发言均衡作为选择器的一个特征。

### 群聊 vs 监督者

同样的原语,不同的默认值:

- 监督者:一个智能体规划,其他执行。选择器是"问规划者该做什么"。
- 群聊:所有智能体对等;选择器是共享池上的一个函数。

两者都用第 04 课的四个原语。群聊默认 LLM 选择式编排和全量池共享状态。

```figure
swarm-speaker
```

## 动手构建

`code/main.py` 用标准库从零实现一个 GroupChat。三个智能体(coder、reviewer、manager),轮询与 LLM 选择两个变体,以及基于 `TERMINATE` token 的终止。

演示打印对话记录,外加两个变体各自的选择器决策轨迹。

运行:

```
python3 code/main.py
```

## 投入使用

`outputs/skill-groupchat-selector.md` 为给定任务配置 GroupChat 选择器——轮询 vs LLM 选择 vs 自定义,以及该用哪些选择器输入(最近消息、智能体专长、轮数统计)。

## 交付

检查清单:

- **最大轮数上限。** 永远要设。典型任务 10-20。
- **发言均衡指标。** 跟踪每智能体轮数;失衡超过阈值就告警。
- **终止 token。** `TERMINATE` 或一个专门的验证者智能体。
- **投影或限定记忆。** 约 10 条消息之后,考虑给每个智能体只提供限定视图,防上下文膨胀。
- **选择器日志。** LLM 选择变体,要把选择器的输入和它的选择都记下来。否则无法调试。

## 练习

1. 运行 `code/main.py`。对比轮询与 LLM 选择下的对话。每种模式下哪个智能体占主导?
2. 在选择器里加一条"每智能体最大发言数"规则。它对对话记录有什么影响?
3. 实现目标达成终止:评审返回 "approved" 即停。它在轮数上限之前触发的频率有多高?
4. 读 AutoGen 稳定版文档的 GroupChat 一节(https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/group-chat.html)。指出 `GroupChatManager` 的默认选择器。
5. 读 AG2 仓库(https://github.com/ag2ai/ag2),对比它的 v0.2 GroupChat 与 v0.4 事件驱动版。v0.4 具体增加了什么性质(吞吐、容错、可组合性)?

## 关键术语

| 术语 | 大家口头的说法 | 实际含义 |
|------|----------------|------------------------|
| GroupChat | "一个聊天室里的智能体们" | 共享消息池 + 选择器函数。AutoGen / AG2 的原语。 |
| 发言者选择 | "下一个谁说" | 挑出下一个智能体的函数。轮询、LLM 选择或自定义。 |
| GroupChatManager | "会议主持人" | 持有选择器、驱动轮次循环的 AutoGen 组件。 |
| ConversableAgent | "基础智能体" | AutoGen 基类;能收发消息的智能体。 |
| 终止 token | "那个'停'字" | 结束对话的哨兵字符串(通常是 `TERMINATE`)。 |
| 热门发言者 | "一个智能体霸屏" | 选择器反复挑同一个智能体的失败模式。 |
| 上下文膨胀 | "池子无限涨" | 每个智能体读每条历史消息;上下文随轮数膨胀。 |
| 投影(Projection) | "限定视图" | 按角色划定的共享池视图,防上下文膨胀。 |

## 延伸阅读

- [AutoGen group chat docs](https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/group-chat.html) — 参考实现
- [AG2 repo](https://github.com/ag2ai/ag2) — 社区 AutoGen v0.2 延续
- [Microsoft Agent Framework docs](https://learn.microsoft.com/en-us/agent-framework/) — 合并后的继任者,2026 年 2 月 RC
- [AutoGen v0.4 release notes](https://microsoft.github.io/autogen/stable/) — 事件驱动 actor 模型重写细节
