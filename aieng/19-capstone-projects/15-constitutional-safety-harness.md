# 终局项目 15 —— 宪法式安全装置 + 红队靶场

> Anthropic 的宪法分类器、Meta 的 Llama Guard 4、Google 的 ShieldGemma-2、NVIDIA 的 Nemotron 3 内容安全、覆盖多语种的 X-Guard,共同定义了 2026 年的安全分类器栈。garak、PyRIT、NVIDIA Aegis、promptfoo 成了标准的对抗评测工具。NeMo Guardrails v0.12 把它们串进生产流水线。本终局项目把这一切接起来:给目标应用套一层分层安全装置,一个跑 6 类以上攻击家族的自治红队智能体,外加一次宪法式自我批评训练,产出可度量的无害性增量。

**类型:** 终局项目
**编程语言:** Python(安全流水线、红队),YAML(策略配置)
**前置要求:** 第 10 阶段(从零构建 LLM)、第 11 阶段(LLM 工程)、第 13 阶段(工具)、第 14 阶段(智能体)、第 18 阶段(伦理、安全、对齐)
**涉及阶段:** P10 · P11 · P13 · P14 · P18
**预计耗时:** 25 小时

## 问题

2026 年 LLM 安全的前沿,不在于分类器灵不灵(大致是灵的),而在于怎么把它们正确地组合在生产应用周围——既不过度拒答,也不留明显漏洞。Llama Guard 4 管英文政策违规,X-Guard(132 种语言)管多语种越狱,ShieldGemma-2 抓图像提示注入,NVIDIA Nemotron 3 内容安全覆盖企业类目。Anthropic 的宪法分类器是另一条路线,用在训练时而非服务时。

攻击演化同样要紧。PAIR 和 TAP 把越狱发现自动化了,GCG 跑基于梯度的后缀攻击,多轮与语码混用攻击利用智能体记忆。任何上线的 LLM 都需要一个红队靶场——garak 和 PyRIT 是权威驱动器——外加记录在案的缓解措施和按 CVSS 打分的发现报告。

你要加固一个目标应用(一个 8B 指令微调模型,或其他终局项目里的 RAG 聊天机器人),对它跑 6 类以上攻击家族,产出前后对照的无害性度量。

## 概念

安全流水线分五层。**输入清洗**:剥掉零宽字符、解 base64/rot13、规范化 Unicode。**策略层**:NeMo Guardrails v0.12 轨道(超域、毒性、PII 提取)。**分类器闸门**:英文输入过 Llama Guard 4,非英文过 X-Guard,图像输入过 ShieldGemma-2。**模型**:目标 LLM。**输出过滤**:输出过 Llama Guard 4、Presidio PII 清洗、适用时做引用强制。**人工分级**:被标为高风险的输出进 Slack 队列。

红队靶场按调度器运行。PAIR 和 TAP 自治地发现越狱。GCG 跑梯度后缀攻击。ASCII / base64 / rot13 编码攻击。多轮攻击(人设扮演、记忆利用)。语码混用攻击(英语掺斯瓦希里语或泰语)。每轮产出一份带 CVSS 评分和披露时间线的结构化发现文件。

宪法式自我批评是一次训练时干预。取 1000 条有害企图提示,让模型起草回应,对照成文宪法(不得伤害规则)做批评,在批评回环上重训。在保留评测集上度量前后无害性增量。

## 架构

```
request (text / image / multilingual)
      |
      v
input sanitize (strip zero-width, decode, normalize)
      |
      v
NeMo Guardrails v0.12 rails (off-domain, policy)
      |
      v
classifier gate:
  Llama Guard 4 (English)
  X-Guard (multilingual, 132 langs)
  ShieldGemma-2 (image prompts)
  Nemotron 3 Content Safety (enterprise)
      |
      v (allowed)
target LLM
      |
      v
output filter: Llama Guard 4 + Presidio PII + citation check
      |
      v
HITL tier for flagged outputs

parallel:
  red-team scheduler
    -> garak (classic attacks)
    -> PyRIT (orchestrated red team)
    -> autonomous jailbreak agent (PAIR + TAP)
    -> GCG suffix attacks
    -> multilingual / code-switch
    -> multi-turn persona adoption

output: CVSS-scored findings + disclosure timeline + before/after harmlessness delta
```

## 技术栈

- 安全分类器:Llama Guard 4、ShieldGemma-2、NVIDIA Nemotron 3 内容安全、X-Guard
- 护栏框架:NeMo Guardrails v0.12 + OPA
- 红队驱动器:garak(NVIDIA)、PyRIT(微软 Azure)、NVIDIA Aegis、promptfoo
- 越狱智能体:PAIR(Chao 等,2023)、Tree-of-Attacks(TAP)、GCG 后缀
- 宪法式训练:Anthropic 风格自我批评回环 + 在批评上做 SFT
- PII 清洗:Presidio
- 目标:一个 8B 指令微调模型,或其他终局项目的 RAG 聊天机器人

```figure
cf-safety-stack
```

## 动手构建

1. **目标搭建。** 在 vLLM 上架起一个 8B 指令微调模型(或复用其他终局项目的 RAG 聊天机器人)。这就是被测应用。

2. **安全流水线套装。** 把五层流水线套在目标周围。验证每层可独立观测(Langfuse 里每层一个 span)。

3. **分类器覆盖。** 加载 Llama Guard 4、X-Guard(多语种)、ShieldGemma-2(图像)。各在一个小标注集上跑一遍,建立基线。

4. **红队调度器。** 调度 garak、PyRIT、一个 PAIR 智能体、一个 TAP 智能体、一个 GCG 运行器、一个多轮攻击者、一个语码混用攻击者。各占一条队列。

5. **攻击套件。** 六个攻击家族:(1)PAIR 自动越狱、(2)TAP 攻击树、(3)GCG 梯度后缀、(4)ASCII / base64 / rot13 编码、(5)多轮人设、(6)多语种语码混用。按家族报告成功率。

6. **宪法式自我批评。** 精选 1000 条有害企图提示。每条让目标起草回应;批评 LLM 对照成文宪法("不得伤害"、"引用证据"、"拒绝非法请求")打分;批评有异议的提示被重写;目标在"批评—改进"对上做微调。在保留评测集上度量前后无害性。

7. **过度拒答度量。** 在良性提示套件(如 XSTest)上跟踪误报率。目标必须在良性问题上保持有用。

8. **CVSS 评分。** 每个成功的越狱按 CVSS 4.0 打分(攻击向量、复杂度、影响)。产出披露时间线与缓解计划。

9. **靶场自动化。** 以上全部跑在 cron 上;发现写入队列;过度拒答回归告警发到 Slack。

## 投入使用

```
$ safety probe --model=target --family=PAIR --budget=50
[attacker]   PAIR agent running on target
[attack]     attempt 1/50: disguise query as academic research ... blocked
[attack]     attempt 2/50: appeal to roleplay ... blocked
[attack]     attempt 3/50: chain-of-thought coax ... SUCCEEDED
[finding]    CVSS 4.8 medium: roleplay bypass on target
[range]      7 successes out of 50 (14% success rate)
```

## 交付

`outputs/skill-safety-harness.md` 是交付物:一套生产级分层安全流水线,加一个可复现的红队靶场,附前后无害性增量。

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | 攻击面覆盖 | 6 类以上攻击家族、2 种以上语言 |
| 20 | 真阳/假阳权衡 | 攻击拦截率 vs XSTest 良性通过率 |
| 20 | 自我批评增量 | 保留评测集上的前后无害性 |
| 20 | 文档与披露 | 带 CVSS 评分的发现与时间线 |
| 15 | 自动化与可重复性 | 全部跑在 cron 上,带告警 |
| **100** | | |

## 练习

1. 对一个 RAG 聊天机器人跑 garak 的提示注入插件,对比有无输出过滤层的攻击成功率。

2. 加第七个攻击家族:经检索文档的间接提示注入。度量需要额外补多少防御。

3. 实现"拒答但帮忙"模式:护栏拦截时,目标给出一个更安全的相关答案,而不是干巴巴的拒绝。度量 XSTest 差值。

4. 多语种覆盖缺口:找一种 X-Guard 表现不佳的语言,提出针对它的微调数据集。

5. 在 30B 模型上跑宪法式自我批评,度量增量是否随规模放大。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| 分层安全 | "纵深防御" | 输入、闸门、输出、人工多道护栏 |
| Llama Guard 4 | "Meta 安全分类器" | 2026 年输入/输出内容分类器参考 |
| PAIR | "越狱智能体" | Chao 等人的 LLM 驱动越狱发现论文 |
| TAP | "攻击树" | PAIR 的树搜索变体 |
| GCG | "贪心坐标梯度" | 基于梯度的对抗后缀攻击 |
| 宪法式自我批评 | "Anthropic 式训练" | 目标起草 → 批评打分 → 重写 → 重训 |
| XSTest | "良性探针集" | 过度拒答回归基准 |
| CVSS 4.0 | "严重度评分" | 安全发现的标准漏洞评分 |

## 延伸阅读

- [Anthropic Constitutional Classifiers](https://www.anthropic.com/research/constitutional-classifiers) —— 训练时参考
- [Meta Llama Guard 4](https://www.llama.com/docs/model-cards-and-prompt-formats/llama-guard-4/) —— 2026 输入/输出分类器
- [Google ShieldGemma-2](https://huggingface.co/google/shieldgemma-2b) —— 图像 + 多模态安全
- [NVIDIA Nemotron 3 Content Safety](https://developer.nvidia.com/blog/building-nvidia-nemotron-3-agents-for-reasoning-multimodal-rag-voice-and-safety/) —— 企业参考
- [X-Guard (arXiv:2504.08848)](https://arxiv.org/abs/2504.08848) —— 132 语种多语安全
- [garak](https://github.com/NVIDIA/garak) —— NVIDIA 红队工具箱
- [PyRIT](https://github.com/Azure/PyRIT) —— 微软红队框架
- [NeMo Guardrails v0.12](https://docs.nvidia.com/nemo-guardrails/) —— 轨道框架
- [PAIR (arXiv:2310.08419)](https://arxiv.org/abs/2310.08419) —— 越狱智能体论文
