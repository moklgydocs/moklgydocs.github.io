# Flamingo 与门控交叉注意力:少样本 VLM

> DeepMind 的 Flamingo(2022)比别人早做了两件事:证明单个模型能处理图像、视频、文本任意交错的序列;证明 VLM 能上下文学习——给一个含 3 个示例(图像, 描述)对的少样本提示,模型不做任何梯度更新就能给新图写描述。机制是:插在冻结 LLM 各层之间的门控交叉注意力层,配一个初始为零的可学习 tanh 门,初始化时 LLM 的文本能力分毫无损。本课精读 Flamingo 的 Perceiver resampler 与门控交叉注意力架构——Gemini 交错输入和 Idefics2 视觉 token 的祖先。

**类型:** 学习
**编程语言:** Python(标准库,门控交叉注意力 + Perceiver resampler 演示)
**前置要求:** 第 12 阶段第 03 课(BLIP-2 Q-Former)
**预计耗时:** 约 120 分钟

## 学习目标

- 解释门控交叉注意力如何通过 tanh(gate) = 0,在初始化时保住冻结 LLM 的文本能力。
- 走通 Perceiver resampler:N 个图像 patch → K 个固定"潜在"查询,经交叉注意力。
- 描述 Flamingo 如何处理图文交错序列:因果掩码要尊重图像的位置。
- 复现一个少样本多模态提示结构(3 个图文示例,然后一张查询图)。

## 问题

BLIP-2 把 32 个视觉 token 喂进冻结 LLM 的输入层。单图单提示没问题。但如果你想喂*多*张图,与文本交错——"这是图 A,描述它;这是图 B,描述它;这是图 C,描述它"——LLM 的自注意力就得在同一条流里同时处理图像 token 和文本 token,而"哪些位置能 attend 哪些图"会变得很讲究。

Flamingo 的回答:根本不改 LLM 的输入流。在现有 LLM 块之间插入额外的交叉注意力层。文本 token 照常流过 LLM 的因果自注意力;每隔几个 LLM 块,文本 token 还通过一个新的门控层对图像特征做交叉注意力。门初始为零,意味着第 0 步时新层是无操作——模型的行为与预训练 LLM 完全一致。训练推进,门逐渐打开,视觉信息开始流入。

Flamingo 回答的第二个问题:每个提示里图像数量不定(0、1 或很多)怎么办?Perceiver resampler——一个小交叉注意力模块,无论你有多少 patch,都产出固定数量的视觉潜在 token。LLM 交叉注意力层看到的形状永远相同。

## 概念

### 冻结 LLM

Flamingo 从一个冻结的 Chinchilla 70B LLM 起步。70B 权重一概不动,原有的文本自注意力和 FFN 正常工作。

### Perceiver resampler

对提示中的每张图,ViT 产出 N 个 patch token。Perceiver resampler 有 K 个固定可学习潜在向量(Flamingo 用 K=64)。每个 resampler 块是两步:

1. 交叉注意力:K 个潜在向量 attend N 个 patch token(Q 来自潜在向量,K/V 来自 patch)。
2. 潜在向量内部的自注意力 + FFN。

6 个 resampler 块之后,输出是 64 个 1024 维视觉 token——不管 ViT 产出了多少 patch。224x224 的图(196 patch)和 480x480 的图(900 patch),出来都是 64 个 resampler token。

对视频,resampler 沿时间应用:每帧的 patch 产出 64 个潜在 token,时间位置编码让模型分清 t=0 与 t=N。整段视频变成 T * 64 个视觉 token。

### 门控交叉注意力

在冻结 LLM 每隔 M 层(Flamingo 用 M=4)插入一个新的门控交叉注意力块:

```
x_after_llm_block = llm_block(x_before)
cross = cross_attn(x_after, resampler_output)
gated = tanh(alpha) * cross + x_after
x_before_next_block = gated
```

- `alpha` 是初始化为零的可学习标量。
- `tanh(0) = 0`,初始化时门控分支贡献为零。
- `alpha` 离开零点后,交叉注意力的贡献平滑增长。
- 残差连接意味着:即使门全开,也不会覆写 LLM 的文本表示,只是在上面叠加视觉信息。

这是 Flamingo 最重要的单个设计决策:视觉条件化是可加的、带门的、初始化时为零的。第 0 步的 Flamingo,在纯文本输入上就是一个完好的 Chinchilla 70B。

### 交错输入的掩码交叉注意力

在 "<图 A> 描述 A <图 B> 描述 B <图 C> ?" 这样的提示里,每个文本 token 只应看到在它之前出现的图像。交叉注意力掩码强制:位置 `t` 的文本 token 只 attend 图像索引 `i < i_t` 的图像 resampler token,`i_t` 是位置 `t` 之前最近那张图的索引。"只看最近的前一张图"或"看此前所有图"都讲得通;Flamingo 选了前者。

### 上下文少样本学习

一个 Flamingo 提示长这样:

```
<image1> A photo of a cat. <image2> A photo of a dog. <image3> A photo of a
```

模型看出补全模式,输出 "bird"(或 image3 实际显示的任何东西)。没有梯度步。冻结 LLM 的上下文学习能力,穿透门控交叉注意力传了下来——这正是论文的题眼,也是它重要的原因。

### 训练数据

Flamingo 在三个数据集上训练:

1. MultiModal MassiveWeb(M3W):4300 万网页,图文交错,重建阅读顺序。
2. 图文对(ALIGN + LTIP):44 亿对。
3. 视频-文本对(VTP):2700 万短视频片段。

OBELICS(2023)是交错网页语料的开放复现,Idefics、Idefics2 和多数开放的"类 Flamingo"模型都在它上面训练。

### OpenFlamingo 与 Otter

OpenFlamingo(2023)是开放复现:架构相同(Perceiver resampler + 冻结 LLaMA 或 MPT 上的门控交叉注意力),检查点有 3B、4B、9B。受基座 LLM 更小、数据更少所限,质量落后于 Flamingo。

Otter(2023)在 OpenFlamingo 之上,用 MIMIC-IT(多模态指令数据集)做指令微调,证明门控交叉注意力同样适用于指令遵循。

### 后代们

- Idefics / Idefics2 / Idefics3:Hugging Face 的门控交叉注意力谱系,逐代简化(Idefics2 弃用 resampler,改为直接 patch token + 自适应池化)。
- Flamingo 到 Chameleon 的过渡:到 2024 年,许多团队转向早期融合(第 12.11 课);Flamingo 式门控交叉注意力仍留在需要冻结骨干的生产场景。
- Gemini 的交错输入:概念上继承了 Flamingo 的交错格式灵活性,具体机制未公开。

### 与 BLIP-2 对比

| | BLIP-2 | Flamingo |
|---|---|---|
| 视觉桥 | 输入处一座 Q-Former | 每隔 M 层一个门控交叉注意力 |
| 视觉 token | 每图 32 个 | 每个交叉注意力层每图 64 个 |
| 冻结 LLM | 是 | 是 |
| 少样本上下文 | 弱 | 强——论文的核心卖点 |
| 交错输入 | 不原生支持 | 支持,设计目标 |
| 训练数据 | 1.3 亿对 | 13 亿对 + 4300 万交错页面 |
| 参数量 | 训练 1.88 亿 | 训练约 100 亿(交叉注意力层) |
| 算力 | 8 张 A100 几天 | 数千 TPUv4 几周 |

单图 VQA 且预算紧,选 BLIP-2;交错、少样本或多图推理,选 Flamingo/Idefics2。

```figure
cross-attention-fusion
```

## 投入使用

`code/main.py` 演示:

1. 在 36 个假 patch token 上跑 Perceiver resampler,8 个可学习潜在向量(纯 Python 交叉注意力)。
2. 门控交叉注意力步:`alpha = 0` → 输出等于输入(LLM 不变);`alpha = 2.0` → 视觉贡献混入。
3. 交错掩码构造器:为 "(图 1)(文 1)(图 2)(文 2)" 序列产出 2D 注意力掩码。

## 交付

本课产出 `outputs/skill-gated-bridge-diagnostic.md`。给定一个开放 VLM 的配置(有无 resampler、交叉注意力频率、门控方案),识别其中的 Flamingo 谱系元素并解释冻结策略。调试"微调后文本性能退化"时有用(答案通常是:门开得太快太猛)。

## 练习

1. 计算 Flamingo-9B 的视觉参数量:90 亿 LLM + 14 亿门控交叉注意力层 + 6400 万 resampler。训练参数占总参数的几分之几?

2. 用 PyTorch 实现门控残差 `y = tanh(alpha) * cross + x`。实验证明:`alpha=0` 时,初始化处 `y==x` 严格成立。

3. 读 OpenFlamingo 第 3.2 节(arXiv:2308.01390),关于当批次中各提示图像数量不同时如何处理多图。描述其 padding 策略。

4. 为什么 Flamingo 的交叉注意力掩码让文本 token 只 attend *最近的*前一张图,而不是此前所有图?读 Flamingo 论文第 2.4 节,解释这个取舍。

5. 上下文少样本:为某个新 Flamingo 变体构造含 4 个 "图像 → 主体颜色" 示例的提示。描述示例数从 0 变到 8 时,预期的准确率变化曲线。

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|----------------|------------------------|
| Perceiver resampler | "定长潜在交叉注意力" | 把可变数量的输入 patch 变成 K 个固定 token 的模块 |
| 门控交叉注意力 | "tanh 门桥" | 残差层 `y = tanh(alpha)*cross + x`,alpha 可学习、初始为 0 |
| 交错输入 | "混合序列" | 图像与文本按阅读顺序自由混合的提示格式 |
| 冻结 LLM | "LLM 无梯度" | 文本 LLM 权重不更新;只有 resampler + 交叉注意力层训练 |
| 少样本 | "上下文示例" | 提示里给几个(图像, 答案)对;模型不微调即可泛化 |
| OBELICS | "交错网页语料" | 1.41 亿网页的开放数据集,图文按阅读顺序排列 |
| Chinchilla | "70B 冻结基座" | Flamingo 的冻结文本 LLM,来自 DeepMind 的 Chinchilla 论文 |
| 门控调度 | "alpha 怎么动" | 训练中交叉注意力门打开的节奏 |
| 交叉注意力频率 | "每隔 M 层" | 门控交叉注意力块的插入间隔;Flamingo 用 M=4 |
| OpenFlamingo | "开放复现" | MosaicML/LAION 的 3–9B 开放检查点;架构与 Flamingo 相同 |

## 延伸阅读

- [Alayrac et al. — Flamingo (arXiv:2204.14198)](https://arxiv.org/abs/2204.14198) — 原始论文。
- [Awadalla et al. — OpenFlamingo (arXiv:2308.01390)](https://arxiv.org/abs/2308.01390) — 开放复现。
- [Laurençon et al. — OBELICS (arXiv:2306.16527)](https://arxiv.org/abs/2306.16527) — 交错网页语料。
- [Jaegle et al. — Perceiver IO (arXiv:2107.14795)](https://arxiv.org/abs/2107.14795) — Perceiver 通用架构。
- [Li et al. — Otter (arXiv:2305.03726)](https://arxiv.org/abs/2305.03726) — 指令微调的 Flamingo 后代。
- [Laurençon et al. — Idefics2 (arXiv:2405.02246)](https://arxiv.org/abs/2405.02246) — Flamingo 路线的现代简化版。
