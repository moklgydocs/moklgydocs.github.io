# Anthropic 负责任扩展政策(RSP)v3.0

> RSP v3.0 于 2026 年 2 月 24 日生效,取代 2023 年版。缓解分两层:Anthropic 单方面会做的,与作为行业建议提出的(包括 RAND SL-4 安全标准)。新增 Frontier Safety Roadmap 和 Risk Report,作为常设文档而非一次性交付物。删掉了 2023 年的暂停承诺。引入 AI R&D-4 阈值:一旦跨越,Anthropic 必须发布一份"肯定性论证",指明失配风险与缓解措施。Claude Opus 4.6 尚未跨越。Anthropic 在 v3.0 公告中说:"要有把握地排除这一点,正变得越来越难。"SaferAI 给 2023 年 RSP 打 2.2 分;v3.0 被下调到 1.9,把 Anthropic 归入与 OpenAI、DeepMind 同档的"弱"RSP 类别。定性阈值取代了 2023 年的定量承诺;删除暂停条款,是其中最尖锐的倒退。

**类型:** 学习
**编程语言:** Python(标准库,RSP 阈值判定引擎)
**前置要求:** 第 15 阶段 · 06(AAR),第 15 阶段 · 07(RSI)
**预计耗时:** 约 45 分钟

## 问题

前沿实验室发布的扩展政策,一部分是技术文档,一部分是治理文档,还有一部分是给监管者的信号。RSP v3.0 是 Anthropic 当前的版本。细读它的意义,不在于遵守它具有约束力(没有),而在于这套框架塑造了一家实验室如何理解灾难性风险,以及如何向公众交代权衡。

v3.0 与 v2.0 的 diff,是有用的分析单元。新增了什么:Frontier Safety Roadmap、Risk Report、AI R&D-4 阈值。删掉了什么:2023 年的暂停承诺。重构了什么:缓解拆成"Anthropic 单方面"与"行业建议"两层。外部评审——SaferAI——把分数从 2.2(v2)下调到 1.9(v3.0)。一份扩展政策,就是这样在看起来更精致的同时,变得不那么严格的。

## 概念

### 两层缓解表

- **Anthropic 单方面行动**:无论其他实验室怎么做,Anthropic 都会做的。超过阈值的训练停止、特定的安全措施、特定的部署闸门。
- **行业范围建议**:Anthropic 认为行业应当集体做的事。包括 RAND SL-4 安全标准。这些不是 Anthropic 的承诺,是政策倡导。

两层结构在 v2 里没有。这意味着读者必须看清每条承诺住在哪一栏。住在"行业范围建议"栏里的安全措施,不是 Anthropic 的承诺,是 Anthropic 的愿望。

### AI R&D-4 阈值

这是 RSP v3.0 点名的下一个重要能力等级。具体说:能以有竞争力的成本,把相当大一部分 AI 研究自动化的模型。一旦 Anthropic 认为某个模型跨越了它,在继续扩展之前,必须发布一份肯定性论证,指明失配风险与缓解措施。

按 v3.0 公告,Claude Opus 4.6 没有跨越。文档补了一句:"要有把握地排除这一点,正变得越来越难。"这个措辞要紧——它承认阈值已经近到是一个活的关切,而不是思辨中的极限。

第 6 课(自动化对齐研究)和第 7 课(递归自我改进)直接喂进这个阈值:自动化对齐研究员越过研究质量线,正是 AI R&D-4 阈值逼近的证据。

### Frontier Safety Roadmap 与 Risk Report

v3.0 把两类制品提升为常设文档:

- **Frontier Safety Roadmap**:前瞻性文档,描述计划中的安全工作、能力预期和缓解研究。
- **Risk Report**:回顾性文档,在模型发布后描述观测到的能力与残余风险。

两者都公开,都按声明的节奏更新。用处在于:读者可以追踪 Anthropic 在 Roadmap 里说要做的,与他们在 Risk Report 里报告做了的,是否对得上。

### 删除暂停条款

2023 年 RSP 有一条明确的暂停承诺:模型跨过特定能力阈值时,训练暂停,直到缓解措施就位。v3.0 用更软的表述替代(发布肯定性论证,缓解充分则可继续)。SaferAI 和其他分析者直接点名:这是新文档中最强的倒退。

支持改动的政策论据:2023 年的定量阈值,在 2026 年时代的能力基准下变得不可达,因为基准本身被重新标定了。反对论据:扩展政策里的暂停条款是一个承诺机制;删掉它,就删掉了政策的可信度。

### SaferAI 的降级

SaferAI 是一个给 RSP 类文档打分的独立组织。他们的公开评分:2023 年 Anthropic RSP 得 2.2(量表上 4.0 是当前最佳 RSP,1.0 是名义水平);v3.0 得 1.9。这把 Anthropic 从"中等"挪到"弱",与 OpenAI、DeepMind 同档。

SaferAI 给出的降级因素:
- 定性阈值取代了定量阈值。
- 暂停承诺被删除。
- AI R&D-4 阈值的缓解写成"肯定性论证",而不是具体措施。
- 评审机制依赖 Anthropic 自己的 Safety Advisory Group,独立监督有限。

### 本课不是什么

这不是合规课。RSP v3.0 不是法规,没有任何东西强迫 Anthropic 遵守它。本课教的是:以这份文档应得的精细和怀疑去读它。扩展政策是前沿实验室关于灾难性风险姿态发出的主要公开信号。任何工作依赖前沿能力的人,读懂它们都是实用技能。

```figure
a5-rsp-ladder
```

## 投入使用

`code/main.py` 实现一个小型判定引擎,复刻 RSP 阈值评估的形状:给定候选模型和一组能力测量,返回 AI R&D-4 阈值是否跨越、所需的肯定性论证章节,以及部署能否继续。它故意简单——重点是把文档的逻辑显式化。

## 交付

`outputs/skill-scaling-policy-review.md` 以 v3.0 为参照,评审一份扩展政策(Anthropic、OpenAI、DeepMind 或内部的):两层结构、阈值、暂停承诺、独立评审。

## 练习

1. 运行 `code/main.py`。喂入三个不同能力等级的合成模型,确认阈值评估器行为符合预期,并产出正确的肯定性论证模板。

2. 通读 RSP v3.0 全文(32 页)。找出住在"行业范围建议"层的每一条承诺。其中哪些在 v2 里本属于"Anthropic 单方面"?

3. 读 SaferAI 的 RSP 评分方法论。用他们的评分细则对 v3.0 复算 1.9 分。哪一行细则对降级贡献最大?

4. 2023 年的暂停承诺被删了。提出一个替代承诺:既保住政策的可信度,又承认 2026 年基准重标定的问题。

5. 对比 RSP v3.0 与 OpenAI 防备框架 v2(第 20 课)。挑一个 v3.0 更强的方面,再挑一个防备框架更强的方面。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|---|---|---|
| RSP | "Anthropic 的扩展政策" | 负责任扩展政策;v3.0 自 2026 年 2 月 24 日生效 |
| AI R&D-4 | "研究自动化阈值" | 以有竞争力的成本自动化相当大一部分 AI 研究的能力 |
| 肯定性论证(Affirmative case) | "安全论证" | 公开论证风险已识别、缓解已充分的文档 |
| Frontier Safety Roadmap | "前瞻计划" | 关于计划中的安全工作与预期能力的常设文档 |
| Risk Report | "模型回顾" | 发布后关于观测能力与残余风险的常设文档 |
| 两层缓解 | "单方面 vs 行业" | Anthropic 承诺与行业建议,分列两栏 |
| 暂停承诺 | "2023 年条款" | 暂停训练的明确承诺;v3.0 中删除 |
| SaferAI 评分 | "独立的 RSP 打分" | 第三方评分细则;v3.0 得 1.9(v2 为 2.2) |

## 延伸阅读

- [Anthropic — Responsible Scaling Policy v3.0](https://anthropic.com/responsible-scaling-policy/rsp-v3-0) ——32 页政策全文
- [Anthropic — RSP v3.0 announcement](https://www.anthropic.com/news/responsible-scaling-policy-v3) ——相对 v2 的变更摘要
- [Anthropic — Frontier Safety Roadmap](https://www.anthropic.com/research/frontier-safety) ——RSP v3.0 链接的常设文档
- [Anthropic — Risk Report: Claude Opus 4.6](https://www.anthropic.com/research/risk-report-claude-opus-4-6) ——当前前沿模型的回顾
- [Anthropic — Measuring agent autonomy in practice](https://www.anthropic.com/research/measuring-agent-autonomy) ——把 AI R&D-4 与实测自治度联系起来
