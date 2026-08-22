# 编排模式:Supervisor、Swarm、层级

> 四种编排模式在 2026 年的框架中反复出现:supervisor-worker、swarm / 点对点、层级、辩论。Anthropic 的忠告:"关键不是构建最复杂的系统,而是为你的需求构建对的系统。"从简单开始;只有当"单智能体 + 五种工作流模式"不够用,才上拓扑。

**类型:** 学习 + 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 12(工作流模式),第 14 阶段 · 25(多智能体辩论)
**预计耗时:** 约 60 分钟

## 学习目标

- 说出四种反复出现的编排模式及各自的适用场景
- 描述 2026 年 LangChain 的建议:基于工具调用的监督 vs supervisor 库
- 解释 Anthropic 的"构建对的系统"原则,以及它如何决定拓扑选择
- 用标准库对同一个脚本化 LLM 实现全部四种模式

## 问题

团队在还不需要的时候就伸手拿"多智能体"。四种模式在各框架中反复出现;一旦你能叫出名字,就能选对那一个——或者干脆不上拓扑。

## 概念

### Supervisor-worker

- 一个中央路由 LLM 把任务派发给专家智能体。
- 它决定:回到自己、转给专家、终止。
- 专家之间互不交谈,所有路由都经过 supervisor。

框架:LangGraph `create_supervisor`、Anthropic orchestrator-workers、CrewAI Hierarchical Process。

**2026 年 LangChain 的建议:** 用直接工具调用做监督,而不是 `create_supervisor`。这给你更细的上下文工程控制——每个专家看到什么,完全由你决定。

### Swarm / 点对点

- 智能体通过共享的工具面直接 handoff。
- 没有中央路由。
- 比 supervisor 延迟更低(跳数更少)。
- 更难推理(没有单一控制点)。

框架:LangGraph 的 swarm 拓扑、OpenAI Agents SDK 的 handoff(当所有智能体都能互相 handoff 时)。

### 层级

- Supervisor 管理子 supervisor,子 supervisor 管理 worker。
- LangGraph 里实现为嵌套子图;CrewAI 里是嵌套 crew。
- 能扩展到大量智能体,代价是运维复杂度。

什么时候需要:当单个 supervisor 的上下文预算装不下所有专家的描述时。

### 辩论

- 并行提议者 + 迭代交叉批评(第 25 课)。
- 严格说不算编排——更像验证——但在框架里总是以拓扑选项的面目出现。

### 自治 crew vs 确定性 flow

CrewAI 把两种部署模式形式化:

- **Flow**:确定性的事件驱动自动化(生产的推荐起点)。
- **Crew**:自治的角色协作。

这与上面四种模式正交,但会映射到拓扑上:Flow 通常是 supervisor 或层级;Crew 通常是带 LLM 路由的 supervisor。

### Anthropic 的忠告

"在 LLM 领域,成功不在于构建最复杂的系统,而在于为你的需求构建对的系统。"

决策顺序:

1. 单智能体 + 工作流模式(第 12 课)——从这里开始。
2. Supervisor-worker——当你有 2–4 个专家。
3. Swarm——当延迟比推理清晰度更要紧。
4. 层级——仅当 supervisor 的上下文预算崩了。
5. 辩论——当准确率比成本更要紧。

### 这个模式在哪里会走歪

- **拓扑先行思维。** 还没搞清楚多智能体要解决什么问题,就先喊"我们需要多智能体"。
- **Swarm 里的弹跳 handoff。** A -> B -> A -> B。用跳数计数器。
- **假层级。** 因为"企业级"就搞三层,实际只有两个团队。合并掉。

```figure
orchestration-pattern
```

## 动手构建

`code/main.py` 用标准库对同一个脚本化 LLM 实现全部四种模式:

- `Supervisor`——中央路由。
- `Swarm`——点对点直接 handoff。
- `Hierarchical`——supervisor 的 supervisor。
- `Debate`——并行提议者 + 批评。

每种模式处理同一个三意图任务(退款 / bug / 销售)。链路形状各不相同。

运行:

```
python3 code/main.py
```

输出:逐模式链路 + 操作计数。Supervisor 最干净;swarm 最短;层级最深;辩论最贵。

## 投入使用

- **LangGraph**:supervisor 与层级(嵌套子图)。
- **OpenAI Agents SDK**:handoff 即工具(supervisor 形状)。
- **CrewAI Flow**:生产确定性。
- **自定义**:辩论,或当你需要精确控制时。

## 交付

`outputs/skill-orchestration-picker.md` 选定一种拓扑并实现它。

## 练习

1. 把一个 supervisor-worker 去掉路由改成 swarm。哪里坏了?哪里变好了?
2. 给 swarm 加跳数计数器:3 次 handoff 后拒绝。它能抓住 A->B->A 弹跳吗?
3. 为一个 12 专家的领域构建两级层级系统。不嵌套的话,上下文预算在哪里崩掉?
4. 在一个生产形状的工作负载上 profile 四种模式:在延迟、成本、准确率、可调试性上,各自谁赢?
5. 读 Anthropic 的 "Building Effective Agents" 文章,把你每条生产流程映射到四种模式之一。有映射不干净的吗?

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|----------------|------------------------|
| Supervisor-worker | "路由 + 专家" | 中央 LLM 派发给专家,专家之间互不交谈 |
| Swarm | "点对点" | 经共享工具直接 handoff,无中央路由 |
| 层级(Hierarchical) | "supervisor 的 supervisor" | 面向大规模智能体群的嵌套子图 |
| 辩论(Debate) | "提议者 + 批评" | 并行提议、交叉批评(第 25 课) |
| 基于工具调用的监督(Tool-call-based supervision) | "不用库的 supervisor" | 把 supervisor 实现为直接工具调用,换取上下文控制 |
| Crew | "自治团队" | CrewAI 的角色协作模式 |
| Flow | "确定性工作流" | CrewAI 的事件驱动生产模式 |

## 延伸阅读

- [Anthropic, Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)——五种模式 + 智能体 vs 工作流
- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)——supervisor、swarm、层级
- [CrewAI docs](https://docs.crewai.com/en/introduction)——Crew vs Flow
- [Du et al., Society of Minds (arXiv:2305.14325)](https://arxiv.org/abs/2305.14325)——辩论模式
