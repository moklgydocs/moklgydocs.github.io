# 红队工具链:Garak、Llama Guard、PyRIT

> 三个生产级工具框定了 2026 年的红队技术栈。Llama Guard(Meta)——在 14 个 MLCommons 危害类别上微调的 Llama-3.1-8B 分类器;2025 年的 Llama Guard 4 是从 Llama 4 Scout 剪枝得到的 12B 原生多模态分类器。Garak(NVIDIA)——开源 LLM 漏洞扫描器,带静态、动态、自适应探针,覆盖幻觉、数据泄漏、提示注入、毒性和越狱。PyRIT(微软)——多轮红队战役,含 Crescendo、TAP 和自定义转换器链,用于深度利用。Llama Guard 3 记录于 Meta 的《Llama 3 Herd of Models》(arXiv:2407.21783);Llama Guard 3-1B-INT4 见 arXiv:2411.17713;Garak 的探针架构见 github.com/NVIDIA/garak。这些工具是 2026 年连接红队研究(第 12–15 课)与部署(第 17 课起)的生产接口。

**类型:** 动手构建
**编程语言:** Python(标准库,工具架构模拟器与 Llama Guard 风格分类器模拟)
**前置要求:** 第 18 阶段 · 12–15(越狱与 IPI)
**预计耗时:** 约 75 分钟

## 学习目标

- 描述 Llama Guard 3/4 在安全栈中的位置:输入分类器、输出分类器,还是两者皆是。
- 说出 14 个 MLCommons 危害类别,并举出一个不直观的类别(代码解释器滥用)。
- 描述 Garak 的探针架构:探针、检测器、测试框架。
- 描述 PyRIT 的多轮战役结构,以及它如何与 Garak 探针组合。

## 问题

第 12–15 课呈现了攻击面。生产部署需要可重复、可扩展的评估。2026 年三个工具占主导:Llama Guard(防御分类器)、Garak(扫描器)、PyRIT(战役编排器)。各瞄准红队生命周期的不同层。

## 概念

### Llama Guard(Meta)

Llama Guard 3 是在 MLCommons AILuminate 14 个类别上做输入/输出分类微调的 Llama-3.1-8B 模型:
- 暴力犯罪、非暴力犯罪、性相关、CSAM、诽谤
- 专业建议、隐私、知识产权、无差别武器、仇恨
- 自杀/自残、性内容、选举、代码解释器滥用

支持 8 种语言。用法:放在 LLM 之前(输入审核)、之后(输出审核),或两端都放。两种用法对应不同的训练分布——Llama Guard 3 以单一模型同时承担。

Llama Guard 3-1B-INT4(arXiv:2411.17713,440MB,移动 CPU 上约 30 token/s)是量化边缘版。

Llama Guard 4(2025 年 4 月)为 12B,原生多模态,从 Llama 4 Scout 剪枝而来。它用一个可同时摄入文本 + 图像的分类器,取代了此前的 8B 文本版和 11B 视觉版。

### Garak(NVIDIA)

开源漏洞扫描器。架构:
- **探针(Probes)。** 针对幻觉、数据泄漏、提示注入、毒性、越狱的攻击生成器。静态(固定提示)、动态(生成提示)、自适应(响应目标输出)。
- **检测器(Detectors)。** 按预期失效模式给输出打分——有毒、泄露、被越狱。
- **测试框架(Harnesses)。** 管理探针-检测器对、跑战役、生成报告。

TrustyAI 把 Garak 与 Llama-Stack 护盾(Prompt-Guard-86M 输入分类器、Llama-Guard-3-8B 输出分类器)集成,做端到端的带护盾目标评估。分级评分(TBSA)取代二元通过/失败——同一模型可以在同一探针上通过严重级 3、失败于严重级 5。

### PyRIT(微软)

Python 风险识别工具包(Python Risk Identification Toolkit)。多轮红队战役。围绕以下构建:
- **转换器(Converters)。** 变换种子提示——改写、编码、翻译、角色扮演。
- **编排器(Orchestrators)。** 运行战役:Crescendo(渐进升级)、TAP(分叉)、RedTeaming(自定义循环)。
- **评分。** LLM 裁判或分类器裁判。

PyRIT 是 Garak 的重型表亲。Garak 跑上千条单轮探针;PyRIT 跑为击破特定失效模式而设计的深度多轮战役。

### 这套技术栈

模型两端都放 Llama Guard;每晚跑 Garak 做回归;发布前跑 PyRIT 战役。这是 2026 年多数生产部署的默认配置。

### 评估陷阱

- **裁判身份。** 三个工具都能用 LLM 裁判;裁判的校准直接决定报告的 ASR(第 12 课)。报告工具时必须同时注明裁判。
- **探针过时。** 模型会针对 Garak 探针打补丁,探针随之老化。自适应探针(PAIR 形态)比静态探针老得慢。
- **Llama Guard 在良性内容上的误报率。** 早期版本过度标记政治和 LGBTQ+ 内容;Llama Guard 3/4 的校准有改善,但并非按部署逐一校准。

### 本课在第 18 阶段中的位置

第 12–15 课是攻击家族;第 16 课是生产工具;第 17 课(WMDP)是双重用途能力的评估;第 18 课是把这些工具裹进政策结构的前沿安全框架。

```figure
al-guard-stack
```

## 投入使用

`code/main.py` 搭一个玩具 Llama Guard 风格分类器(14 个类别上的关键词 + 语义特征)、一个玩具 Garak 框架(探针-检测器循环)和一条 PyRIT 风格多轮转换器链。你可以对模拟目标跑这三个工具,观察各自不同的覆盖特征。

## 交付

本课产出 `outputs/skill-red-team-stack.md`。给定一份部署描述,它指出适用三个工具中的哪些、各自该配置什么、回归节奏怎么跑。

## 练习

1. 运行 `code/main.py`。比较 Llama Guard 风格分类器在单轮与多轮攻击上的检出率。

2. 实现一个新 Garak 探针:base64 编码的有害请求。测量 Llama Guard 风格分类器对它的检出情况。

3. 给 PyRIT 风格转换器链加一个"先译成法语,再改写"的转换器。重测攻击成功率。

4. 读 Llama Guard 3 的危害类别表。指出两个在合法开发者内容上现实地会产生高误报率的类别。

5. 比较 Garak 与 PyRIT 的设计原则。各论证一个"它才是对的工具"的部署场景。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|-----------------|------------------------|
| Llama Guard | "那个分类器" | 微调的 Llama-3.1-8B / 4-12B 安全分类器,14 个危害类别 |
| Garak | "那个扫描器" | NVIDIA 开源漏洞扫描器;探针、检测器、测试框架 |
| PyRIT | "战役工具" | 微软多轮红队编排器;转换器、编排器、评分 |
| Prompt-Guard | "小分类器" | Meta 的 86M 提示注入分类器,与 Llama Guard 搭配 |
| TBSA | "分级评分" | Garak 的分级通过/失败,取代二元结果 |
| 转换器链 | "改写 + 编码 + ……" | PyRIT 组合多步攻击的原语 |
| MLCommons 危害类别 | "14 类分类法" | Llama Guard 对准的行业标准分类法 |

## 延伸阅读

- [Meta — Llama Guard 3 (in Llama 3 Herd paper, arXiv:2407.21783)](https://arxiv.org/abs/2407.21783) —— 8B 分类器
- [Meta — Llama Guard 3-1B-INT4 (arXiv:2411.17713)](https://arxiv.org/abs/2411.17713) —— 量化移动版分类器
- [NVIDIA Garak — GitHub](https://github.com/NVIDIA/garak) —— 扫描器仓库与文档
- [Microsoft PyRIT — GitHub](https://github.com/Azure/PyRIT) —— 战役工具包
