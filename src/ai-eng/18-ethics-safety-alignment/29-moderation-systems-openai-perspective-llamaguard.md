# 内容审核系统——OpenAI、Perspective、Llama Guard

> 生产级审核系统把第 12-16 课定义的安全策略落地为可运行的防线。OpenAI Moderation API:`omni-moderation-latest`(2024)基于 GPT-4o,一次调用同时分类文本和图片;多语言测试集上比上一代好 42%;响应 schema 返回 13 个类别布尔值——harassment、harassment/threatening、hate、hate/threatening、illicit、illicit/violent、self-harm、self-harm/intent、self-harm/instructions、sexual、sexual/minors、violence、violence/graphic;对大多数开发者免费。分层模式:输入审核(生成前)、输出审核(生成后)、自定义审核(领域规则)。异步并行调用掩盖延迟;命中时先给占位响应。Llama Guard 3/4(第 16 课):14 个 MLCommons 危害类别、代码解释器滥用、8 种语言(v3)、多图片(v4)。Perspective API(Google Jigsaw):早于"LLM 当审核员"浪潮的毒性打分系统;以单维度毒性为主,带 severe-toxicity/insult/profanity 变体;内容审核研究的基线。弃用时间线:Azure Content Moderator 2024 年 2 月弃用,2027 年 2 月退役,由 Azure AI Content Safety 接替。

**类型:** 动手构建
**编程语言:** Python(标准库,三层审核框架)
**前置要求:** 第 18 阶段 · 16(Llama Guard / Garak / PyRIT)
**预计耗时:** 约 60 分钟

## 学习目标

- 描述 OpenAI Moderation API 的类别体系,以及它与 Llama Guard 3 的 MLCommons 类别集有何不同。
- 描述三层审核模式(输入、输出、自定义),并各说出一个失效模式。
- 描述 Perspective API 作为前 LLM 时代基线的地位,以及它为何仍被研究界使用。
- 说出 Azure 的弃用时间线。

## 问题

第 12-16 课讲的是攻击和防御工具。第 29 课讲的是部署在用户触达产品那一面的、把防御落地运行的审核系统。三层模式是 2026 年的默认配置。

## 概念

### OpenAI Moderation API

`omni-moderation-latest`(2024)。基于 GPT-4o。一次调用同时分类文本 + 图片。对大多数开发者免费。

类别(响应 schema 中的 13 个布尔值):
- harassment、harassment/threatening
- hate、hate/threatening
- self-harm、self-harm/intent、self-harm/instructions
- sexual、sexual/minors
- violence、violence/graphic
- illicit、illicit/violent

多模态支持适用于 `violence`、`self-harm` 和 `sexual`,但不包括 `sexual/minors`;其余类别仅支持文本。

在 `code/main.py` 的代码框架里,为了教学简洁,我们把 `/threatening`、`/intent`、`/instructions`、`/graphic` 这些子类别合并进各自的顶层父类别。生产代码应使用完整的 13 类 schema。

多语言测试集上比上一代审核端点好 42%。按类别给分;应用自行设阈值。

### Llama Guard 3/4

第 16 课讲过。14 个 MLCommons 危害类别(组织方式与 OpenAI 的 13 个响应布尔值不同)。支持 8 种语言(v3)。Llama Guard 4(2025 年 4 月)原生多模态,12B。

OpenAI 和 Llama Guard 的类别体系有重叠但不一致。OpenAI 用 "illicit" 作为大类;Llama Guard 把 "violent crimes" 和 "non-violent crimes" 分开。部署方按自己的策略-类别匹配度来选。

### Perspective API(Google Jigsaw)

早于"LLM 当审核员"浪潮(2020 年前)的毒性打分系统。类别:TOXICITY、SEVERE_TOXICITY、INSULT、PROFANITY、THREAT、IDENTITY_ATTACK。以单维度主分数(TOXICITY)加子维度变体。

被广泛用作内容审核研究基线,因为 API 稳定、文档齐全、有多年校准数据。对现代 LLM 相关场景,Llama Guard 或 OpenAI Moderation 通常更合适。

### 三层模式

1. **输入审核。** 生成前先分类用户提示词。命中就拒绝。延迟:一次分类器调用。
2. **输出审核。** 交付前先分类模型输出。命中就替换成拒答。延迟:生成后一次分类器调用。
3. **自定义审核。** 领域特定规则(正则、白名单、业务策略)。跑在输入侧或输出侧。

三层按设计是串行的:输入审核必须先于生成完成,输出审核在生成之后跑。并行发生在层内——多个分类器(如 OpenAI Moderation + Llama Guard + Perspective)对同一段文本并发跑,可以掩盖单分类器的延迟。一个可选优化:输入审核期间先显示占位响应("请稍候,正在检查……"),推迟第一个 token 的流式输出。命中行为可配置:拒绝、净化、升级人工复核。

### 失效模式

- **只设输入审核。** 抓不住输出幻觉(第 12-14 课的编码攻击能绕过输入分类器)。
- **只设输出审核。** 任何输入都能到达模型;增加成本;还把内部推理暴露给攻击者。
- **只设自定义审核。** 跨类别不鲁棒;正则太脆。

分层是默认做法。双保险。

### Azure 弃用

Azure Content Moderator:2024 年 2 月弃用,2027 年 2 月退役。由 Azure AI Content Safety 接替——基于 LLM,与 Azure OpenAI 集成。对 Azure 部署来说,这是一次 2024-2027 年的全量迁移工程。

### 本课在第 18 阶段中的位置

第 16 课讲红队语境下的审核工具。第 29 课讲部署中的审核。第 30 课以当前的双重用途能力证据收尾。

```figure
an-moderation-layers
```

## 投入使用

`code/main.py` 构建一个三层审核框架:输入审核器(关键词 + 类别分数)、输出审核器(同一个分类器跑输出)、自定义审核器(领域规则)。你可以把输入喂进去,观察每一层各自拦住什么。

## 交付

本课产出 `outputs/skill-moderation-stack.md`。给定一个部署,给出审核栈配置建议:输入侧用哪个分类器、输出侧用哪个、自定义规则定什么、边界情况用什么裁判模型。

## 练习

1. 运行 `code/main.py`。把一条良性、一条边界、一条有害的输入分别跑过三层。报告每条输入触发了哪一层。

2. 给框架扩展一个 Perspective API 风格的毒性打分,针对某个特定类别。比较它和类别分数的阈值行为。

3. 读 OpenAI Moderation API 文档和 Llama Guard 3 的类别列表。把每个 OpenAI 类别映射到最接近的 Llama Guard 类别。找出三个无法干净映射的类别。

4. 为代码助手部署(如 GitHub Copilot)设计一个审核栈。指出最相关和最不相关的类别,并提出自定义规则。

5. Azure Content Moderator 2027 年 2 月退役。规划一次到 Azure AI Content Safety 的迁移。找出迁移中风险最高的环节。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|-----------------|------------------------|
| OpenAI Moderation | "omni-moderation-latest" | 基于 GPT-4o 的 13 类(文本)分类器,部分多模态 |
| Perspective API | "Google Jigsaw 毒性分" | 前 LLM 时代的毒性打分基线 |
| Llama Guard | "MLCommons 14 类" | Meta 的危害分类器(v3:8B 文本、8 种语言;v4:12B 多模态) |
| 输入审核 | "生成前过滤器" | 模型调用前对用户提示词分类 |
| 输出审核 | "生成后过滤器" | 交付前对模型输出分类 |
| 自定义审核 | "领域规则" | 部署特定规则(正则、白名单、策略) |
| 分层审核 | "三层全上" | 标准的生产部署模式 |

## 延伸阅读

- [OpenAI Moderation API docs](https://platform.openai.com/docs/api-reference/moderations)——omni-moderation 端点
- [Meta PurpleLlama + Llama Guard](https://github.com/meta-llama/PurpleLlama)——Llama Guard 仓库
- [Google Jigsaw Perspective API](https://perspectiveapi.com/)——毒性打分
- [Azure AI Content Safety](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/)——Azure 替代方案
