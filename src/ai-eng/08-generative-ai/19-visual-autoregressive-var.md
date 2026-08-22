# 视觉自回归建模(VAR):下一尺度预测

> 扩散模型沿时间迭代采样(去噪步);VAR 沿尺度迭代采样——先预测 1x1 的 token,再 2x2、4x4,直到最终分辨率,每个尺度都以前面的尺度为条件。2024 年的论文证明:VAR 在图像生成上展现出 GPT 式的缩放定律,并在同等算力预算下击败 DiT。本课构建其核心机制。

**类型:** 动手构建
**编程语言:** Python(配 PyTorch)
**前置要求:** 第 7 阶段第 03 课(多头注意力)、第 8 阶段第 06 课(DDPM)
**预计耗时:** 约 90 分钟

## 问题

自回归生成统治语言建模,因为它的规模化是可预测的:算力越多、参数越多、困惑度越低、输出越好。2024 年之前,图像生成有过两次主要的自回归尝试:PixelRNN/PixelCNN(逐像素)和 DALL-E 1 / Parti / MuseGAN(在 VQ-VAE 编码上逐 token)。

两者都败在生成顺序问题上。像素和 token 排在 2D 网格上,AR 模型却必须按 1D 光栅顺序访问。角落里先生成的像素,根本不知道这张图最终长什么样。生成质量的规模化不如文本上的 GPT,同等算力下从没摸到过扩散模型的质量。

VAR 通过改变"生成的是什么"来修复顺序问题:不再在空间上逐个预测图像 token,而是在逐渐升高的分辨率上预测整张图。第 1 步:预测 1x1 token(整张图的"摘要")。第 2 步:预测 2x2 token 网格(更粗的特征)。第 3 步:预测 4x4 网格。第 K 步:预测最终的 (H/8)x(W/8) 网格。

每个尺度 attend 此前所有尺度(按"尺度顺序"因果),并在自己的尺度内并行。顺序问题消失了:尺度 k 的整张图,一次 Transformer 前向就出来了。

## 概念

### VQ-VAE 多尺度分词器

VAR 需要一个**多尺度离散分词器**。对图像 x,它产出一串分辨率渐升的 token 网格:

```
x -> encoder -> latent f
f -> tokenize at 1x1: token grid z_1 of shape (1, 1)
f -> tokenize at 2x2: token grid z_2 of shape (2, 2)
...
f -> tokenize at (H/p)x(W/p): token grid z_K of shape (H/p, W/p)
```

每个 z_k 用同一个码本(典型大小 4096–16384)。各尺度的分词并不独立——训练目标让各尺度残差之和能重建 f:

```
f ≈ upsample(embed(z_1), target_size) + ... + upsample(embed(z_K), target_size)
```

这是一种**残差 VQ** 变体:尺度 k 捕获尺度 1..k-1 漏掉的东西。解码器把所有尺度的嵌入求和,产出图像。

多尺度 VQ 分词器只训一次(像 VQGAN 那样),然后冻结。全部生成工作由上面的自回归模型完成。

### 下一尺度预测

生成模型是一个 Transformer:看到此前所有尺度的 token,预测下一尺度的 token。

输入序列结构:

```
[START, z_1 tokens, z_2 tokens, z_3 tokens, ..., z_K tokens]
```

位置嵌入同时编码尺度索引和尺度内的空间位置。注意力按尺度顺序因果:尺度 k、位置 (i, j) 的 token 可以 attend 尺度 1..k 的所有 token,以及尺度 k 内部按某种尺度内顺序排在它之前的 token(VAR 实际用固定位置注意力,尺度内不设因果——尺度内所有位置并行预测)。

训练损失:在每个尺度 k,给定所有先前尺度的 token,预测 z_k。对离散 VQ 编码做交叉熵。结构与 GPT 相同,只是"序列"变成了尺度结构化的。

### 生成

推理时:

```
generate z_1 = sample from p(z_1)                    # 1 token
generate z_2 = sample from p(z_2 | z_1)              # 4 tokens in parallel
generate z_3 = sample from p(z_3 | z_1, z_2)         # 16 tokens in parallel
...
decode: f = sum of embed-and-upsample scales 1..K
image = VAE_decoder(f)
```

K = 10 个尺度,生成就是 10 次 Transformer 前向。每次前向并行产出整个尺度——尺度内不做逐 token 自回归。256x256 图像,约 10 次前向,而 DiT 要 28–50 次。

### 为什么下一尺度胜过下一 token

三个结构性优势:

1. **由粗到细,贴合自然图像统计。** 人类视觉感知和图像数据集都呈现尺度相关的规律:低频结构稳定、可预测;高频细节以低频内容为条件。下一尺度预测正好利用这一点。
2. **尺度内并行生成。** 与 GPT 式逐 token AR 不同,VAR 一步产出一个尺度的全部 token。有效生成长度是对数级而非线性。
3. **没有生成顺序偏置。** 尺度 k 的 token 看得见尺度 k-1 的全部;不存在"在左边"或"在上边"的偏置,不会逼着早期 token 在后期上下文出现之前就下注。

### 缩放定律

Tian et al. 证明,VAR 在 ImageNet 上的 FID 遵循幂律缩放曲线——正如 GPT 的困惑度。参数或算力翻倍,误差可靠地减半。这是第一个像语言模型一样干净地展现缩放行为的图像生成模型。结果是:VAR 规模下的表现可以从算力预测,而不必逐架构靠经验猜。

### 与扩散的关系

VAR 和扩散共享同一个数据压缩故事:都把生成问题拆成一串更容易的子问题。

- 扩散:逐渐加噪,学习撤销一步。
- VAR:逐渐加分辨率,学习预测下一尺度。

它们是穿过同一个问题的两根不同的轴,都给出可解的条件分布。实证上,VAR 推理更快(前向次数更少,尺度内全并行),在类条件 ImageNet 上追平或击败 DiT。文本条件 VAR(VARclip、HART)是活跃的研究方向。

```figure
gx-var-next-scale
```

## 动手构建

在 `code/main.py` 中,你将:

1. 在合成"图像"数据(2D 高斯环)上构建一个迷你**多尺度 VQ 分词器**。
2. 训练一个 **VAR 式 Transformer**,做下一尺度预测。
3. 调用 Transformer 4 次(4 个尺度)采样并解码。
4. 验证:尺度有序的训练,让尺度内生成可以并行。

这是玩具实现。重点是亲眼看到尺度结构化的注意力掩码和尺度内并行生成真的跑起来。

## 交付

本课产出 `outputs/skill-var-tokenizer-designer.md` —— 设计多尺度分词器的技能:尺度数量、尺度比例、码本大小、残差共享、解码器架构。

## 练习

1. **尺度数量消融。** 分别用 4、6、8、10 个尺度训练 VAR。测量重建质量 vs 自回归前向次数。尺度越多 = 残差越细 = 质量越好,但前向越多。

2. **码本大小。** 训练码本大小为 512、4096、16384 的分词器。码本越大重建越好,但预测越难。找到拐点。

3. **尺度内并行检查。** 对训好的 VAR,显式测量注意力模式:尺度 k 内,模型是否只 attend 跨尺度位置、不 attend 尺度内位置?验证掩码实现。

4. **VAR vs DiT 缩放。** 在同一个 ImageNet 类条件任务上,按相等参数预算(如 33M、130M、458M)分别训练 VAR 和 DiT。画 FID vs 算力曲线。每个尺寸下 VAR 都应领先 DiT——在小规模上复现论文结果。

5. **文本条件化。** 扩展 VAR,通过 adaLN 接受文本嵌入(CLIP 池化)作为额外条件输入——这是 HART 配方。文本对齐采样下 FID 改善多少?

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|----------------|----------------------|
| VAR | "视觉自回归" | 在 VQ token 网格金字塔上做下一尺度预测的图像生成 |
| 下一尺度预测 | "先粗后细" | 模型按渐升的分辨率尺度预测 token,每个尺度以此前的全部尺度为条件 |
| 多尺度 VQ 分词器 | "残差 VQ" | 产出 K 个渐升分辨率 token 网格的 VQ-VAE,解码器对所有尺度求和 |
| 尺度 k | "金字塔第 k 层" | K 个分辨率级别之一,从 k=1 的 1x1 到 k=K 的 (H/p)x(W/p) |
| 尺度内并行 | "每尺度一次前向" | 尺度 k 的全部 token 在一次 Transformer 前向中产出,不逐 token 自回归 |
| 跨尺度因果 | "尺度有序注意力" | 尺度 k 的 token 可 attend 尺度 1..k,不可 attend 尺度 k+1..K |
| 残差 VQ | "加性分词" | 每个尺度的 token 编码低尺度留下的残差;解码器对所有尺度嵌入求和 |
| VAR 缩放定律 | "图像版 GPT 缩放" | FID 随算力遵循可预测的幂律,如同语言模型的困惑度 |
| HART | "VAR + 文本混合" | 文本条件 VAR 变体,把 MaskGIT 式迭代解码与 VAR 的尺度结构结合 |
| 尺度位置嵌入 | "(尺度, 行, 列) 三元组" | 位置编码同时携带尺度索引与尺度内空间坐标 |

## 延伸阅读

- [Tian et al., 2024 — "Visual Autoregressive Modeling: Scalable Image Generation via Next-Scale Prediction"](https://arxiv.org/abs/2404.02905) — VAR 论文,权威参考
- [Peebles and Xie, 2022 — "Scalable Diffusion Models with Transformers"](https://arxiv.org/abs/2212.09748) — DiT,扩散对照基线
- [Esser et al., 2021 — "Taming Transformers for High-Resolution Image Synthesis"](https://arxiv.org/abs/2012.09841) — VQGAN,VAR 多尺度分词器所扩展的分词器家族
- [van den Oord et al., 2017 — "Neural Discrete Representation Learning"](https://arxiv.org/abs/1711.00937) — VQ-VAE,离散图像分词的根基
- [Tang et al., 2024 — "HART: Efficient Visual Generation with Hybrid Autoregressive Transformer"](https://arxiv.org/abs/2410.10812) — 文本条件 VAR
