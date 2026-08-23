# ReWOO 与 Plan-and-Execute:解耦的规划

> ReAct 把思考与动作交织在一条流里;ReWOO 把它们分开:先一次性出完整计划,再执行。token 省 5 倍,HotpotQA 准确率 +4 个点,而且规划器可以蒸馏进一个 7B 模型。Plan-and-Execute 把它推广,Plan-and-Act 把它扩展到网页导航。

**类型:** 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 01(智能体循环)
**预计耗时:** 约 60 分钟

## 学习目标

- 解释为什么 ReWOO 的 Planner / Worker / Solver 三分法比 ReAct 的交织循环更省 token、更健壮。
- 实现一个计划 DAG、一个按依赖排序的执行器,以及一个组装 worker 输出的 solver——全部纯标准库。
- 用 2026 年"五种工作流模式"框架(Anthropic)判断一个任务该用"先规划再执行"还是交织 ReAct。
- 识别长程网页/移动任务何时需要 Plan-and-Act 的合成计划数据。

## 问题

ReAct 的"思考-动作-观测"交织循环简单灵活,但每次工具调用都得带上全部先前上下文——包括之前的每一段思考。token 用量随深度平方增长。更糟的是:工具在循环中途失败时,模型得从错误观测里重新推导出整个计划。

ReWOO(Xu 等,arXiv:2305.18323,2023 年 5 月)注意到这点,下了一个注:开头就把整件事规划好,并行取证据,最后组装答案。一次 LLM 调用做规划,N 次工具调用取证据(可并行),一次 LLM 调用做求解。用更少的灵活性(计划是静态的)换来好得多的 token 效率和更清晰的失败模式。

## 概念

### 三个角色

```
Planner:  user_question -> [plan_dag]
Workers:  [plan_dag]     -> [evidence]        (tool calls, possibly parallel)
Solver:   user_question, plan_dag, evidence -> final_answer
```

Planner 产出一个 DAG。每个节点指明工具、参数,以及依赖哪些更早的节点(`#E1`、`#E2` 这样的引用)。Worker 按拓扑序执行节点。Solver 把一切缝合成答案。

### 为什么 token 省 5 倍

ReAct 的提示词长度随步数线性增长:第 10 步时,提示词里有 thought 1 + action 1 + observation 1 + thought 2 + action 2 + observation 2……而且每个中间步骤还冗余地带着原始提示词。

ReWOO 只付一次 planner 提示词(大)、N 个小小的 worker 提示词(每个就是一次工具调用,不带思维链)和一次 solver 提示词。论文在 HotpotQA 上测得 token 省约 5 倍,同时准确率绝对高 4 个点。

### 为什么更健壮

ReAct 里 worker 3 失败,循环得在流中段现场推理脱身;ReWOO 里 worker 3 返回一个错误字符串,solver 带着原始计划在上下文里看到它,可以优雅降级。失败定位是逐节点的,不是逐步的。

### 规划器蒸馏

论文的第二个结果:因为规划器看不到观测,你可以用 175B 教师模型的规划输出,微调一个 7B 模型。小模型管规划,推理时不再需要大模型。这已成标准——2026 年许多生产智能体用小规划器配大执行器,或反过来。

### Plan-and-Execute(2023)

LangChain 团队 2023 年 8 月的文章把 ReWOO 推广成一个模式名:Plan-and-Execute。前置规划器产出步骤列表,执行器逐步执行,可选的重规划器在观察到结果后可以修订。它比 ReWOO 更接近 ReAct(重规划器把观测带回规划),但保留了 token 节省。

### Plan-and-Act(Erdogan 等,arXiv:2503.09572,ICML 2025)

Plan-and-Act 把这个模式扩展到长程网页与移动智能体。关键贡献是合成计划数据:一个带标注的轨迹生成器产出"计划显式可见"的训练数据,用来微调规划器模型——在 WebArena 类任务上,单条 ReAct 轨迹早已失去连贯性的 30–50 步之后,它仍能工作。

### 何时选哪个

| 模式 | 何时用 |
|---------|------|
| ReAct | 短任务、未知环境、需要反应式异常处理 |
| ReWOO | 工具已知的结构化任务、token 敏感、证据可并行 |
| Plan-and-Execute | 类似 ReWOO,但部分执行后可重规划 |
| Plan-and-Act | 长程(>30 步)、网页/移动/计算机操作 |
| 思维树 | 值得为搜索付费时(第 04 课) |

Anthropic 2024 年 12 月的建议:从最简单的开始。任务是一次工具调用加一段总结,就别建 ReWOO;任务是 40 步的研究课题,就别只用 ReAct。

```figure
rewoo-plan
```

## 动手构建

`code/main.py` 实现一个玩具 ReWOO:

- `Planner` —— 一个脚本化策略,从提示词产出计划 DAG。
- `Worker` —— 通过注册表派发每个节点的工具调用。
- `Solver` —— 脚本化的组装,读证据、产出最终答案。
- 依赖解析 —— `#E1` 这类引用在派发时替换成先前 worker 的输出。

演示回答这个问题:"What is the population of the capital of France, rounded to millions?",用两步计划:(1) 查首都,(2) 查人口,然后求解。

运行:

```
python3 code/main.py
```

轨迹先展示完整计划,再是 worker 结果,最后是 solver 组装。把 token 数(我们打印粗略字符数)与 ReAct 式交织运行对比——这类结构化任务上 ReWOO 胜出。

## 投入使用

LangGraph 把 Plan-and-Execute 做成现成配方(ReAct 用 `create_react_agent`,plan-execute 用自定义图)。CrewAI 的 Flows 直接编码这个模式:你预先定义任务,Flow DAG 执行它们。Plan-and-Act 的合成数据方法仍主要停留在研究;其运行时模式(显式计划 DAG)已通过 LangGraph 和 CrewAI Flows 进入生产。

## 交付

`outputs/skill-rewoo-planner.md`:给定工具目录,从用户请求生成 ReWOO 计划 DAG。交给执行器之前先校验计划(无环、每个引用可解析、每个工具存在)。

## 练习

1. 并行执行相互独立的计划节点。在一个含 2 个并行组的 6 节点 DAG 上,它能带来什么?
2. 加一个重规划节点:任一 worker 返回错误时触发。把 ReWOO 变成 Plan-and-Execute 的最小改动是什么?
3. 把 `Planner` 换成小模型(7B 级),`Solver` 保持前沿模型。对比端到端质量——这个分工在哪里会失败?
4. 读 ReWOO 论文第 4 节关于规划器蒸馏的部分。概念上复现 175B → 7B 的结果:你需要什么训练数据,如何给计划质量打分?
5. 把玩具改造成 Plan-and-Act 的轨迹形状:计划是序列而非 DAG。权衡有什么变化?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| ReWOO | "无观测推理" | 先规划,再并行取证据,再求解——规划提示词里没有观测 |
| Plan-and-Execute | "LangChain 的 plan-execute 模式" | ReWOO 加一个执行后的可选重规划节点 |
| Plan-and-Act | "规模化的 plan-execute" | 显式的 planner/executor 分工,配长程任务的合成计划训练数据 |
| 证据引用 | "#E1、#E2……" | 计划节点占位符,派发时替换成先前 worker 的输出 |
| 规划器蒸馏 | "小规划器,大执行器" | 用大教师的规划轨迹微调小模型 |
| token 效率 | "更少往返" | 论文中 HotpotQA 上比 ReAct 省 5 倍 token |
| DAG 执行器 | "拓扑派发器" | 按依赖顺序运行计划节点;每层可并行 |

## 延伸阅读

- [Xu 等,《ReWOO:将推理与观测解耦》(arXiv:2305.18323)](https://arxiv.org/abs/2305.18323) —— 经典论文
- [Erdogan 等,《Plan-and-Act》(arXiv:2503.09572)](https://arxiv.org/abs/2503.09572) —— 带合成计划的规模化 planner-executor
- [LangGraph Plan-and-Execute 教程](https://docs.langchain.com/oss/python/langgraph/overview) —— 框架配方
- [Anthropic,《构建高效智能体》](https://www.anthropic.com/research/building-effective-agents) —— 选能用的最简单模式
