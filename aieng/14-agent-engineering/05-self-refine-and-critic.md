# Self-Refine 与 CRITIC:迭代式输出改进

> Self-Refine(Madaan 等,2023)让一个 LLM 分饰三角——生成、反馈、改进——循环往复。平均收益:7 个任务上 +20 个绝对点。CRITIC(Gou 等,2023)把反馈步骤加固:验证走外部工具。2026 年,这个模式以"评估器-优化器"(Anthropic)或护栏循环(OpenAI Agents SDK)的形态进入每个框架。

**类型:** 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 01(智能体循环)、第 14 阶段 · 03(Reflexion)
**预计耗时:** 约 60 分钟

## 学习目标

- 说出 Self-Refine 的三个提示词(生成、反馈、改进),并解释为什么历史对改进提示词很重要。
- 解释 CRITIC 的关键洞察:没有外部落地,LLM 的自我验证不可靠。
- 用纯标准库实现带历史和可选外部验证器的 Self-Refine 循环。
- 把这个模式映射到 Anthropic 的"评估器-优化器"工作流和 OpenAI Agents SDK 的输出护栏。

## 问题

智能体产出了一个差点意思的答案:某行代码有语法错误,某段摘要太长,某个计划漏了边角情况。你想要的是:智能体批评自己的输出,然后修好它。

Self-Refine 证明了:单个模型、无训练数据、无 RL,就能做到。但有个坑:LLM 在硬事实上不擅长自我验证。CRITIC 给出了修复的名字——把验证步骤路由到外部工具(搜索、代码解释器、计算器、测试运行器)。

这两篇论文合起来,定义了 2026 年迭代改进的默认做法:生成、验证(能外部就外部)、改进、验证通过就停。

## 概念

### Self-Refine(Madaan 等,NeurIPS 2023)

一个 LLM,三个角色:

```
generate(task)            -> output_0
feedback(task, output_0)  -> critique_0
refine(task, output_0, critique_0, history) -> output_1
feedback(task, output_1)  -> critique_1
refine(task, output_1, critique_1, history) -> output_2
...
stop when feedback says "no issues" or budget exhausted.
```

关键细节:`refine` 能看到完整历史——所有先前输出和批评——所以不会重复犯错。论文做了消融:去掉历史,质量骤降。

头条数字:7 个任务(数学、代码、首字母缩略、对话)上平均 +20 个绝对点,含 GPT-4。无训练、无外部工具、单一模型。

### CRITIC(Gou 等,arXiv:2305.11738,v4 2024 年 2 月)

Self-Refine 的软肋:反馈步骤是 LLM 给自己打分。对事实性主张这不可靠(幻觉在产出它的模型看来往往很可信)。CRITIC 把 `feedback(task, output)` 换成 `verify(task, output, tools)`,`tools` 包括:

- 搜索引擎,验事实主张。
- 代码解释器,验代码正确性。
- 计算器,验算术。
- 领域特定验证器(单元测试、类型检查器、linter)。

验证器产出以工具结果为据的结构化批评,改进器再以这段批评为条件。

头条:在有事实性任务上 CRITIC 胜过 Self-Refine,因为批评有落地。在没有外部验证器的任务上(创意写作、格式整理),CRITIC 退化为 Self-Refine。

### 停止条件

两种常见形状:

1. **验证器通过。** 外部测试返回成功。有就首选(单元测试、类型检查器、护栏断言)。
2. **无反馈发出。** 模型说"输出没问题"。便宜但不可靠;要配最大迭代上限。

2026 年默认:两者组合。"验证器通过就停,或模型说没问题且迭代数 ≥ 2,或迭代数 ≥ max_iterations。"

### 评估器-优化器(Anthropic,2024)

Anthropic 2024 年 12 月的文章把它命名为五种工作流模式之一。两个角色:

- 评估器:给输出打分,产出批评。
- 优化器:根据批评修订输出。

循环到评估器通过。这就是 Anthropic 框架下的 Self-Refine/CRITIC。Anthropic 补充的关键工程细节:评估器和优化器的提示词要有实质差异,否则模型只会橡皮图章式放行。

### OpenAI Agents SDK 输出护栏

OpenAI Agents SDK 以"输出护栏"的形态提供这个模式。护栏是运行在智能体最终输出上的验证器:护栏触发(抛出 `OutputGuardrailTripwireTriggered`),输出被拒绝,智能体可重试。护栏可以调工具(CRITIC 式),也可以是纯函数(Self-Refine 式)。

### 2026 年的坑

- **橡皮图章循环。** 同一模型用同一种提示词风格既生成又批评,会收敛到"我看挺好"。用结构不同的提示词,或用一个便宜小模型做批评。
- **过度精炼。** 每轮改进都加延迟和 token。预算 1–3 轮;超过就升级人工复核。
- **琐事用 CRITIC。** 没有外部验证器时,CRITIC 退化为 Self-Refine;别为一个空壳验证器付延迟。

```figure
self-refine
```

## 动手构建

`code/main.py` 在一个玩具任务上实现 Self-Refine 和 CRITIC:给定主题产出一个简短要点列表。验证器检查格式(3 条要点、每条 60 字符以内)。CRITIC 再加一个外部"事实验证器",惩罚已知幻觉。

组件:

- `generate` —— 脚本化生产者。
- `feedback` —— LLM 式自我批评。
- `verify_external` —— CRITIC 式落地验证器。
- `refine` —— 根据历史重写输出。
- 停止条件 —— 验证器通过,或最多 4 轮。

运行:

```
python3 code/main.py
```

对比 Self-Refine 与 CRITIC 的运行。CRITIC 抓住了一个 Self-Refine 漏掉的事实错误——外部验证器有自我批评者没有的落地。

## 投入使用

Anthropic 的评估器-优化器就是这个模式的 Claude 友好说法。OpenAI Agents SDK 的输出护栏是 CRITIC 形状(护栏可以调工具)。LangGraph 内置的反思节点读起来就是 Self-Refine。Google 的 Gemini 2.5 Computer Use 加了每步安全评估器,是 CRITIC 的变体:每个动作提交前先验证。

## 交付

`outputs/skill-refine-loop.md`:给定任务形状、验证器可用性和迭代预算,配置一个评估器-优化器循环。产出生成器、评估器/验证器、优化器的提示词,外加停止策略。

## 练习

1. 用 max_iterations=1 跑玩具。CRITIC 还有帮助吗?
2. 把外部验证器换成有噪声的(随机 30% 假阳性)。循环会怎样?这就是 2026 年大多数护栏栈的现实。
3. 实现"生成-批评用不同模型"变体:大模型生成,小模型批评。能胜过同模型吗?
4. 读 CRITIC 第 3 节(arXiv:2305.11738 v4)。说出三类验证工具并各举一例。
5. 把 OpenAI Agents SDK 的 `output_guardrails` 映射到 CRITIC 的验证器角色。SDK 哪里做得不对,哪里做得对?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| Self-Refine | "自我修复的 LLM" | 单模型内的 生成 → 反馈 → 改进 循环,带历史 |
| CRITIC | "工具落地的验证" | 用外部验证器(搜索、代码、计算器、测试)替换反馈 |
| 评估器-优化器 | "Anthropic 工作流模式" | 两个角色——评估器打分、优化器修订——循环到收敛 |
| 输出护栏 | "事后检查" | OpenAI Agents SDK 在智能体产出输出后运行的验证器 |
| 验证步骤 | "批评阶段" | 承重的决策:有落地还是自评 |
| 改进历史 | "模型已经试过什么" | 先前输出 + 批评 prepend 到改进提示词;去掉则质量崩塌 |
| 橡皮图章循环 | "自我同意失败" | 同提示词批评只会回"我看行";用结构不同的提示词修 |
| 停止条件 | "收敛测试" | 验证器通过,或无反馈且迭代达上限;绝不要单一条件 |

## 延伸阅读

- [Madaan 等,《Self-Refine》(arXiv:2303.17651)](https://arxiv.org/abs/2303.17651) —— 经典论文
- [Gou 等,《CRITIC》(arXiv:2305.11738)](https://arxiv.org/abs/2305.11738) —— 工具落地的验证
- [Anthropic,《构建高效智能体》](https://www.anthropic.com/research/building-effective-agents) —— 评估器-优化器工作流模式
- [OpenAI Agents SDK 文档](https://openai.github.io/openai-agents-python/) —— 作为 CRITIC 式验证器的输出护栏
