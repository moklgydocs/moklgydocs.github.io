# 对齐研究生态——MATS、Redwood、Apollo、METR

> 五个机构定义了 2026 年实验室之外的对齐研究层。MATS(ML Alignment & Theory Scholars):2021 年末以来培养了 527+ 名研究者,产出 180+ 篇论文,被引 10K+ 次,h-index 47;2024 年夏季班注册为 501(c)(3),约 90 名学员、40 名导师;2025 年前的校友中 80% 从事安全/安全工作,200+ 人进入 Anthropic、DeepMind、OpenAI、UK AISI、RAND、Redwood、METR、Apollo。Redwood Research:Buck Shlegeris 创办的应用对齐实验室;提出了 AI 控制(第 10 课);与 UK AISI 合作控制安全论证(control safety cases)。Apollo Research:为前沿实验室做部署前图谋(scheming)评估;著有 In-Context Scheming(第 8 课)和 Towards Safety Cases for AI Scheming。METR(Model Evaluation and Threat Research):基于任务的能力评估、自主任务时间跨度研究;《Common Elements of Frontier AI Safety Policies》比较了各实验室的框架。Eleos AI Research:模型福祉(model welfare)部署前评估(第 19 课);完成了 Claude Opus 4 福祉评估。

**类型:** 学习
**编程语言:** 无
**前置要求:** 第 18 阶段 · 01-27(本阶段此前的课程)
**预计耗时:** 约 45 分钟

## 学习目标

- 认出实验室之外对齐研究生态的五个机构及各自的核心产出。
- 描述 MATS 的规模(学员、论文、h-index)及其人才管道角色。
- 描述 Redwood 的 AI 控制议程及其与 UK AISI 的合作。
- 描述 METR 基于任务的评估方法论。

## 问题

前沿实验室(第 18 课)内部做安全评估,并选择性发布结果。实验室之外的生态,是这些评估被验证的地方,是新失效模式最早被发现的地方,也是人才被培养的地方。理解这个生态,才能判断哪些研究发现被谁采信。

## 概念

### MATS(ML Alignment & Theory Scholars)

2021 年末启动。研究导师制项目;学员跟随一位资深研究者,用 10-12 周攻关一个具体的对齐问题。

规模(2026):
- 创办以来 527+ 名研究者。
- 发表 180+ 篇论文。
- 被引 10K+ 次。
- h-index 47。
- 2024 年夏季:90 名学员 + 40 名导师;注册为 501(c)(3)。

职业去向:2025 年前的校友约 80% 在做安全/安全工作。200+ 人在 Anthropic、DeepMind、OpenAI、UK AISI、RAND、Redwood、METR、Apollo。

### Redwood Research

应用对齐实验室。由 Buck Shlegeris 创办。提出了 AI 控制议程(第 10 课)。与 UK AISI 合作控制安全论证。为 DeepMind 和 Anthropic 的评估设计提供咨询。

代表论文:Greenblatt、Shlegeris 等,《AI Control》(arXiv:2312.06942,ICML 2024);《Alignment Faking》(Greenblatt、Denison、Wright 等,arXiv:2412.14093,与 Anthropic 合著)。

风格:具体的威胁模型、最坏情况的对手、可以压测的具体协议。

### Apollo Research

为前沿实验室做部署前图谋评估。著有 In-Context Scheming(第 8 课,arXiv:2412.04984)。2025 年 OpenAI 反图谋训练合作的合作方。产出 Towards Safety Cases for AI Scheming(2024)。

风格:在可能涌现欺骗的智能体场景中做评估;三支柱分解(错位、目标导向性、情境感知)。

### METR(Model Evaluation and Threat Research)

基于任务的能力评估。自主任务完成时间跨度研究。《Common Elements of Frontier AI Safety Policies》(metr.org/common-elements,2025)比较了各实验室的框架。

与 Apollo 合著了 AI Scheming 安全论证草案。

风格:长跨度任务评估、实证能力测量、框架综合。

### Eleos AI Research

模型福祉部署前评估。完成了系统卡第 5.3 节记录的 Claude Opus 4 福祉评估。为第 19 课与福祉相关的主张提供外部方法论核验。

### 生态的流动

MATS 培养研究者。毕业生进入 Anthropic、DeepMind、OpenAI(实验室安全团队)或 Redwood、Apollo、METR、Eleos(外部评估)。外部评估方与实验室以及 UK AISI / CAISI 合作。发表的成果回流生态,反哺 MATS 的下一届学员。

### 为什么这一层重要

单一来源的评估不可靠:实验室评估自己的模型,存在结构性的利益冲突。外部评估方能提出并验证实验室可能少报的失效模式。2024 年的 Sleeper Agents 论文(第 7 课)出自 Anthropic + Redwood;Alignment Faking 出自 Anthropic + Redwood;In-Context Scheming 出自 Apollo;反图谋训练出自 Apollo + OpenAI。多机构结构本身就是质量控制。

### 本课在第 18 阶段中的位置

第 7-11 课引用了 Redwood 和 Apollo 的工作;第 18 课引用了 METR 的框架比较;第 19 课引用了 Eleos。第 28 课就是本阶段其余课程所依赖的这个生态的机构地图。

```figure
sae-features
```

## 投入使用

无代码。读 METR 的《Common Elements of Frontier AI Safety Policies》,看外部综合如何为实验室内部的政策工作增值。

## 交付

本课产出 `outputs/skill-ecosystem-map.md`。给定一条对齐主张或一项评估,识别其所属机构、发表渠道和方法论风格,并与已知的对应机构交叉核验。

## 练习

1. 从第 7-15 课中选一篇论文,识别涉及的机构。把作者与 MATS 校友名单及当前生态任职交叉核对。

2. 读 METR 的《Common Elements of Frontier AI Safety Policies》。找出他们强调的三个跨实验室共识点和两个最大分歧点。

3. MATS 的职业去向约 80% 是安全/安全方向。论证这种选择压力是适应性的(培养了这个领域)还是有偏的(滤掉了异端立场)。

4. Redwood 和 Apollo 都做控制/图谋方向,但风格不同。选一个失效模式,描述两家各自会如何调查它。

5. Eleos AI 是唯一一家纯模型福祉机构。设计一个假想的第二家机构,专注于另一个福祉邻近问题(认知自由、机器人具身等),并阐明它的方法论。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|-----------------|------------------------|
| MATS | "那个导师制项目" | ML Alignment & Theory Scholars;2021 年以来 527+ 名研究者 |
| Redwood Research | "搞控制的那家" | 应用对齐;AI 控制论文作者;UK AISI 合作方 |
| Apollo Research | "搞图谋评估的" | 为前沿实验室做部署前图谋评估 |
| METR | "搞任务跨度评估的" | 基于任务的能力评估;框架综合 |
| Eleos AI | "搞福祉的那家" | 模型福祉部署前评估 |
| 人才管道 | "MATS → 实验室" | MATS 毕业生流向 Anthropic、DM、OpenAI、Redwood、Apollo、METR |
| 外部评估 | "非实验室核验" | 不由模型生产方做的评估;增加可信度 |

## 延伸阅读

- [MATS(ML Alignment & Theory Scholars)](https://www.matsprogram.org/)——导师制项目
- [Redwood Research](https://www.redwoodresearch.org/)——AI 控制论文
- [Apollo Research](https://www.apolloresearch.ai/)——图谋评估
- [METR — Common Elements of Frontier AI Safety Policies](https://metr.org/blog/2025-03-26-common-elements-of-frontier-ai-safety-policies/)——框架比较
- [Eleos AI Research](https://www.eleosai.org/research)——模型福祉方法论
