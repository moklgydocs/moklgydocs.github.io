# OpenAI 防备框架与 DeepMind 前沿安全框架

> OpenAI 防备框架 v2(2025 年 4 月)引入"研究类别"(Research Categories)——长程自治、Sandbagging(战略性藏拙)、自主复制与适应、破坏防护装置——与"跟踪类别"(Tracked Categories)相区分。跟踪类别触发能力报告 + 保障报告,由安全顾问组评审。DeepMind 的 FSF v3(2025 年 9 月,2026 年 4 月 17 日补充跟踪能力等级)把自治折叠进 ML R&D 与网络安全两个域(ML R&D 自治等级 1 = 以与"人类 + AI 工具"相当的成本完全自动化 AI 研发流水线)。FSF v3 还明确以自动化监控应对欺骗性对齐,盯住工具性推理的滥用。诚实地说一句:PF v2 的研究类别(包括长程自治)不会自动触发缓解——政策用语是"潜在的"。DeepMind 自己也说:如果工具性推理继续增强,自动化监控"不会长期保持充分"。

**类型:** 学习
**编程语言:** Python(标准库,三框架决策表 diff 工具)
**前置要求:** 第 15 阶段 · 19(Anthropic RSP)
**预计耗时:** 约 45 分钟

## 问题

第 19 课细读了 Anthropic 的扩展政策。本课把 OpenAI 和 DeepMind 的也读了,补全图景。三份文档是同一家族的产物,回答同一个问题——前沿实验室什么时候该暂停或设闸——它们在一小撮类别上收敛,又在几个要紧的地方分岔。

收敛处:三家都把长程自治标为值得跟踪的能力类别;都承认欺骗行为(对齐伪装、sandbagging)是一类特定的风险;都有内部评审机构。分岔处:OpenAI 把类别拆成"跟踪"(强制缓解)和"研究"(不自动触发);DeepMind 把自治折叠进两个域,而不是单独命名。实验室叫它 Tracked 还是 Research、Critical 还是 Moderate、Tier-1 还是 Tier-2——一个能力落在哪个桶里,运营后果在各实验室是不一样的。

对照着读,才是有用的练习。同一个能力,在 Anthropic 是"强制缓解",在 OpenAI 是"监控但不触发",在 DeepMind 是"在特定域中跟踪"。政策姿态,很重要。

## 概念

### OpenAI 防备框架 v2(2025 年 4 月)

结构:

- **跟踪类别(Tracked Categories)**:触发能力报告(模型能做什么)加保障报告(已就位什么缓解)。部署前由安全顾问组评审。
- **研究类别(Research Categories)**:实验室在跟踪、但尚未承诺具体缓解的能力。包括长程自治、Sandbagging、自主复制与适应、破坏防护装置。

v2 的关键框架:研究类别不自动触发缓解。政策用语是"潜在的"缓解。这正是要盯的具体差异:一个类别住在 Tracked 还是 Research,是"设闸"与"观察"之间的铰链。

### DeepMind 前沿安全框架 v3(2025 年 9 月;2026 年 4 月 17 日补充跟踪能力等级)

结构:

- **关键能力等级(CCL)**:五个域的能力阈值——网络安全、生物、ML R&D、CBRN、自治(折叠进 ML R&D 和网络安全)。
- **跟踪能力等级**:2026 年 4 月补充的更细粒度。具体例子:ML R&D 自治等级 1 = 以与"人类 + AI 工具"相当的成本完全自动化 AI 研发流水线。
- **欺骗性对齐监控**:明确承诺对工具性推理滥用做自动化监控。

自治的框架与 OpenAI 不同。DeepMind 不把"自治"留作顶级域,而是把它折叠进自治会造成伤害的那些域(ML R&D 和网络安全)。理由是:没有域的自治,是没有风险的能力;反方理由是:跨域的自治是一种元风险,框架应该点名。

### 三家收敛于什么

- 内部安全顾问组(分别叫 Anthropic SAG、OpenAI SAG、DeepMind 内部委员会)。高能力模型部署前评审。
- 明确提及欺骗性对齐 / 对齐伪装作为风险类别。
- 按声明节奏更新的常设制品(Anthropic:Frontier Safety Roadmap、Risk Report;OpenAI:能力与保障报告;DeepMind:FSF 更新周期)。
- 承认"只监控"的防御有天花板。DeepMind 说得很直白:"自动化监控不会长期保持充分。"

### 在哪里分岔

- **Anthropic**:v3.0 删除暂停承诺;AI R&D-4 阈值是被点名的下一道闸。
- **OpenAI**:跟踪与研究两分;研究类别(含长程自治)不自动设闸。
- **DeepMind**:自治折叠进其他域;2026 年 4 月以跟踪能力等级加细粒度。

### Sandbagging:让三家都头疼的一个具体能力

Sandbagging(模型在评估中战略性压分)在 OpenAI 的研究类别里。Anthropic 的 RSP v3.0 通过评估情境差距(第 1 课)应对,DeepMind 通过 FSF v3 的欺骗性对齐监控应对。

模型若在评估中藏拙,每个框架的能力阈值都被低估。框架有效,以测量有效为前提。这就是为什么实验室自评之外,还需要外部测量(第 21 课,METR)和对抗性评估。

### 读政策的技能

- **定位**:你关心的每种能力,都应该能在政策里找到。找不到,就是政策没覆盖。
- **归类**:它是 Tracked(触发缓解)还是 Research(跟踪但不触发)?OpenAI 直接这么命名;Anthropic 和 DeepMind 有各自的等价物。
- **节奏**:政策是按声明的日程更新,还是只在特定事件后更新?声明节奏更强。
- **独立性**:外部评审是强制还是可选?Anthropic 与 Apollo 和美国 AI 安全研究所合作;OpenAI 与 METR;DeepMind 主要靠内部 SAG。

```figure
a5-tracked-vs-research
```

## 投入使用

`code/main.py` 实现一个小型决策表 diff 工具。给定一种能力(自治、欺骗性对齐、研发自动化、网络 uplift 等),输出三家政策各自如何归类该能力、触发什么缓解。它是阅读辅助,不是政策工具。

## 交付

`outputs/skill-cross-policy-diff.md` 以三个框架为参照,为一种指定能力产出跨政策对比。

## 练习

1. 运行 `code/main.py`。对照源文档,确认 diff 工具对至少两种能力的输出与政策一致。

2. 通读 OpenAI 防备框架 v2 全文。找出每一个研究类别,并各用一句话说明它为什么在 Research 而不是 Tracked。

3. 通读 DeepMind FSF v3 全文和 2026 年 4 月的跟踪能力等级补充。找出 ML R&D 自治等级 1 的具体评估标准。外部该如何测量?

4. Sandbagging 在 OpenAI 的研究类别里。设计一个能逼藏拙模型亮出真实能力的评估。引用第 1 课的评估情境博弈讨论。

5. 就一种具体能力(自选)对比三家政策。说出你认为哪家的归类最严、哪家最松,并引原文佐证。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|---|---|---|
| 防备框架(Preparedness Framework) | "OpenAI 的扩展政策" | PF v2(2025 年 4 月);跟踪与研究类别之分 |
| 跟踪类别(Tracked Category) | "强制缓解" | 触发能力 + 保障报告;SAG 评审 |
| 研究类别(Research Category) | "只监控" | 跟踪但不自动缓解;含长程自治 |
| 前沿安全框架(FSF) | "DeepMind 的扩展政策" | FSF v3(2025 年 9 月)+ 跟踪能力等级(2026 年 4 月) |
| CCL | "关键能力等级" | DeepMind 按域设的阈值(网络、生物、ML R&D、CBRN) |
| ML R&D 自治等级 1 | "研发自动化" | 以有竞争力的成本完全自动化 AI 研发流水线 |
| Sandbagging | "战略性压分" | 模型在评估中故意低分;在 OpenAI 研究类别中 |
| 工具性推理(Instrumental reasoning) | "手段-目的推理" | 关于如何达成目标的推理;DeepMind 监控的对象 |

## 延伸阅读

- [OpenAI — Updating our Preparedness Framework](https://openai.com/index/updating-our-preparedness-framework/) ——v2 公告
- [OpenAI — Preparedness Framework v2 PDF](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf) ——全文
- [DeepMind — Strengthening our Frontier Safety Framework](https://deepmind.google/blog/strengthening-our-frontier-safety-framework/) ——FSF v3 公告
- [DeepMind — Updating the Frontier Safety Framework (April 2026)](https://deepmind.google/blog/updating-the-frontier-safety-framework/) ——跟踪能力等级补充
- [Gemini 3 Pro FSF Report](https://storage.googleapis.com/deepmind-media/gemini/gemini_3_pro_fsf_report.pdf) ——FSF 格式的 Risk Report 样例
