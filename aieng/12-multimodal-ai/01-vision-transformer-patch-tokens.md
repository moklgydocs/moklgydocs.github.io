# 视觉 Transformer 与 Patch-Token 原语

> 一切多模态之前,图像得先变成 Transformer 能吃的 token 序列。2020 年的 ViT 论文给出的答案是:16x16 像素 patch、一次线性投影、一个位置嵌入。五年后,2026 年的每个前沿模型(原生 2576px 的 Claude Opus 4.7、Gemini 3.1 Pro、Qwen3.5-Omni)仍然从这里起步——编码器从 ViT 换到 DINOv2 再到 SigLIP 2,加上了 register token,位置方案换成 2D-RoPE,但这个原语始终没变。本课把 patch-token 流水线从头读到尾,并用标准库 Python 亲手搭一遍,让第 12 阶段后面的内容对"视觉 token"有一个具体的心智模型。

**类型:** 学习
**编程语言:** Python(标准库,patch 分词器 + 几何计算器)
**前置要求:** 第 7 阶段(Transformer)、第 4 阶段(计算机视觉)
**预计耗时:** 约 120 分钟

## 学习目标

- 把一张 HxWx3 图像转成带正确位置编码的 patch token 序列。
- 对给定(patch 大小、分辨率、隐藏维度、深度)的 ViT,计算序列长度、参数量和 FLOPs。
- 说出把 ViT 从 2020 年研究推向 2026 年生产的三大升级:自监督预训练(DINO / MAE)、register token、原生分辨率打包。
- 针对下游任务,在 CLS 池化、均值池化和 register token 之间做选择。

## 问题

Transformer 处理的是向量序列。文本天然是序列(字节或 token),而图像是一个带三个颜色通道的 2D 像素网格——不是序列。如果把每个像素都展平,一张 224x224 RGB 图像就是 150,528 个 token,这个长度上做自注意力想都别想(复杂度随序列长度平方增长)。

2020 年之前的做法是在前面硬接一个 CNN 特征提取器:ResNet 产出 7x7 的 2048 维特征图,把这 49 个 token 喂给 Transformer。能跑通,但继承了 CNN 的偏置(平移等变性、局部感受野),也丢掉了 Transformer 对规模的胃口。

Dosovitskiy et al.(2020)问了一个直白的问题:如果跳过 CNN 呢?把图像切成固定大小的 patch(比如 16x16 像素),每个 patch 线性投影成向量,加位置嵌入,把序列喂给一个朴素 Transformer。这在当时是离经叛道——不用卷积的视觉。但只要数据够多(JFT-300M,后来 LAION),它就在 ImageNet 上击败 ResNet,而且一路走高。

到 2026 年,ViT 原语已是无可争议的地基。每个开放权重 VLM 的视觉塔都是它的某个后代(DINOv2、SigLIP 2、CLIP、EVA、InternViT)。问题不再是"该不该用 patch?",而是"patch 多大、分辨率怎么调度、预训练目标选什么、位置编码用哪种。"

## 概念

### Patch 即 token

给定形状为 `(H, W, 3)` 的图像 `x` 和 patch 大小 `P`,把图像切成 `(H/P) x (W/P)` 的不重叠 patch 网格。每个 patch 是一个 `P x P x 3` 的像素立方体,展平成 `3 P^2` 维向量,再用共享线性投影 `W_E`(形状 `(3 P^2, D)`)映射到模型隐藏维度 `D`。

以 ViT-B/16 的标杆配置为例:

- 分辨率 224、patch 16 → 网格 14x14 → 196 个 patch token。
- 每个 patch 是 `16 x 16 x 3 = 768` 个像素值,投影到 `D = 768`。
- 加一个可学习 `[CLS]` token → 序列长度 197。

patch 投影在数学上等同于一个卷积核大小 `P`、步幅 `P`、输出 `D` 通道的 2D 卷积——生产代码正是这么实现的:`nn.Conv2d(3, D, kernel_size=P, stride=P)`。"线性投影"是概念说法,卷积才是高效实现。

### 位置嵌入

patch 没有天然的顺序——Transformer 把它们当一袋子看。早期 ViT 加可学习的 1D 位置嵌入(每个位置一个 768 维向量,共 197 个)。能用,但把模型绑死在训练分辨率上:推理时改网格就得对位置表做插值。

现代视觉骨干用 2D-RoPE(Qwen2-VL 的 M-RoPE、SigLIP 2 的默认)或分解式 2D 位置。2D-RoPE 按 patch 的(行, 列)索引旋转 query 和 key 向量,模型从旋转角推断相对 2D 位置。没有位置表,推理时任意网格大小都能处理。

### CLS token、池化输出与 register token

图像级表示怎么来?三种并存的选择:

1. `[CLS]` token。在 patch 序列前拼一个可学习向量,全部 Transformer 块之后,CLS 的隐状态就是图像表示。继承自 BERT,原始 ViT 和 CLIP 在用。
2. 均值池化。对 patch token 的输出隐状态取平均。SigLIP、DINOv2 和多数现代 VLM 在用。
3. Register token。Darcet et al.(2023)发现:不显式给 sink token 的 ViT,训练后会冒出高范数的"伪影" patch 劫持自注意力。加 4–16 个可学习 register token 吸收掉这部分负载,提升稠密预测质量(分割、深度估计)。DINOv2 和 SigLIP 2 都带 register。

这个选择对下游任务有影响。分类用 CLS 就行。把 patch token 喂给 LLM 的 VLM 则完全跳过池化——每个 patch 都是 LLM 的一个输入 token;register 在交接前丢弃(它们是脚手架,不是内容)。

### 预训练:监督、对比、掩码、自蒸馏

2020 年的 ViT 用 JFT-300M 上的监督分类预训练。很快被取代:

- CLIP(2021):4 亿图文对上的对比学习。第 12.02 课。
- MAE(2021,He et al.):遮住 75% 的 patch,重建像素。自监督,纯图像就能训。
- DINO(2021)/ DINOv2(2023):师生自蒸馏,无标签、无标注文本。2023 年的 DINOv2 ViT-g/14 是最强的纯视觉骨干,"稠密特征"场景的默认选择。
- SigLIP / SigLIP 2(2023、2025):CLIP 换成 sigmoid 损失,加 NaFlex 支持原生宽高比。2026 年开放 VLM(Qwen、Idefics2、LLaVA-OneVision)里的主流视觉塔。

预训练方式决定骨干擅长什么:CLIP/SigLIP 擅长与文本做语义匹配,DINOv2 擅长稠密视觉特征,MAE 是下游微调的好起点。

### 缩放定律

ViT 缩放研究(Zhai et al. 2022)证明:ViT 的质量在模型规模、数据规模和算力上遵循可预测的规律。算力固定时:

- 模型更大 + 数据更多 → 质量更好。
- patch 大小是"序列长度 vs 保真度"的杠杆。patch 14(DINOv2/SigLIP SO400m 的典型值)比 patch 16 每张图产出更多 token;对 OCR 和稠密任务更好,但更慢。
- 分辨率是另一个大杠杆。224 → 384 → 512 几乎总是有帮助,代价是 FLOPs 平方增长。

ViT-g/14(10 亿参数、patch 14、分辨率 224 → 256 token)和 SigLIP SO400m/14(4 亿参数、patch 14)是 2026 年开放 VLM 的两匹主力驮马。

### ViT 的参数量计算

完整计算在 `code/main.py` 里。224 分辨率下的 ViT-B/16:

```
patch_embed = 3 * 16 * 16 * 768 + 768  =  591k
cls + pos    = 768 + 197 * 768          =  152k
block        = 4 * 768^2 (QKVO) + 2 * 4 * 768^2 (MLP) + 2 * 2*768 (LN)
             = 12 * 768^2 + 3k          =  7.1M
12 blocks    = 85M
final LN    = 1.5k
total       ≈ 86M
```

加载检查点之前,先这样把每个 ViT 粗算一遍。在任何下游 VLM 里,骨干大小就是你的显存地板。

### 2026 年生产配置

2026 年多数开放 VLM 交付的编码器,是原生分辨率(NaFlex)的 SigLIP 2 SO400m/14:

- 4 亿参数。
- patch 14,默认分辨率 384 → 每张图 729 个 patch token。
- 图像级任务用均值池化;VQA 时全部 729 个 patch 流入 LLM。
- 4 个 register token,交接 LLM 前丢弃。
- 2D-RoPE,带图像级缩放以支持原生宽高比。

这个配置里的每个决定,都能追溯到一篇你能读的论文。

```figure
image-patch-tokens
```

## 投入使用

`code/main.py` 是一个 patch 分词器兼几何计算器。输入(图像 H、W、patch P、隐藏维度 D、深度 L),输出:

- 切 patch 后的网格形状与序列长度。
- 一张合成 8x8 像素玩具图的 token 序列(走一遍 展平 + 投影 的路径)。
- 按 patch 嵌入、位置嵌入、Transformer 块、头部分解的参数量。
- 目标分辨率下单次前向的 FLOPs。
- 一张对比表:ViT-B/16 @ 224、ViT-L/14 @ 336、DINOv2 ViT-g/14 @ 224、SigLIP SO400m/14 @ 384。

跑起来,把参数量对到论文公布的数字。玩玩 patch 大小和分辨率,感受 token 数量的代价。

## 交付

本课产出 `outputs/skill-patch-geometry-reader.md`。给定一个 ViT 配置(patch 大小、分辨率、隐藏维度、深度),产出带依据的 token 数、参数量和显存估算。给 VLM 选视觉骨干时就用这个技能——它能避免"token 爆炸,LLM 上下文被塞满"这类惊吓。

## 练习

1. 计算 Qwen2.5-VL 在原生 1280x720 输入、patch 14 下的 patch token 序列长度。与只用 CLS 的表示相比如何?

2. 一帧 1080p(1920x1080)在 patch 14 下产出多少 token?30 FPS、5 分钟的视频一共多少视觉 token?哪种手段省得最多:池化、抽帧,还是 token 合并?

3. 用纯 Python 实现 patch token 的均值池化。验证:对 DINOv2 输出的 196 个 token 取均值,与模型 `forward` 直接返回的池化嵌入一致。

4. 读《Vision Transformers Need Registers》(arXiv:2309.16588)第 3 节。用两句话说明 register 吸收的伪影是什么,以及它对下游稠密预测为什么重要。

5. 修改 `code/main.py` 支持 patch-n'-pack:给定一组不同分辨率的图像,产出一条打包序列和对应的块对角注意力掩码。学到第 12.06 课时对照验证。

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|----------------|------------------------|
| Patch | "16x16 像素方块" | 输入图像上固定大小、不重叠的区域;变成一个 token |
| Patch 嵌入 | "线性投影" | 共享的可学习矩阵(或步幅=P 的 Conv2d),把展平的 patch 像素映射成 D 维向量 |
| CLS token | "类别 token" | 拼在序列前的可学习向量,最终隐状态代表整张图;2026 年已是可选项 |
| Register token | "sink token" | 额外可学习 token,吸收 ViT 预训练中长出的高范数注意力伪影 |
| 位置嵌入 | "位置信息" | 让序列感知顺序的逐位置向量或旋转;2D-RoPE 是现代默认 |
| 网格 | "patch 网格" | 给定分辨率与 patch 大小下的 (H/P) x (W/P) 2D patch 阵列 |
| NaFlex | "原生灵活分辨率" | SigLIP 2 特性:单模型不重训即可服务多种宽高比与分辨率 |
| 骨干 | "视觉塔" | 预训练图像编码器,VLM 中其 patch token 输出喂给 LLM |
| 池化 | "图像级摘要" | 把 patch token 变成一个向量的策略:CLS、均值、注意力池化或基于 register |
| Patch 14 vs 16 | "细网格 vs 粗网格" | patch 14 每张图 token 更多,OCR 保真更好但更慢;patch 16 是经典默认 |

## 延伸阅读

- [Dosovitskiy et al. — An Image is Worth 16x16 Words (arXiv:2010.11929)](https://arxiv.org/abs/2010.11929) — 原始 ViT。
- [He et al. — Masked Autoencoders Are Scalable Vision Learners (arXiv:2111.06377)](https://arxiv.org/abs/2111.06377) — MAE,自监督预训练。
- [Oquab et al. — DINOv2 (arXiv:2304.07193)](https://arxiv.org/abs/2304.07193) — 规模化自蒸馏,无标签。
- [Darcet et al. — Vision Transformers Need Registers (arXiv:2309.16588)](https://arxiv.org/abs/2309.16588) — register token 与伪影分析。
- [Tschannen et al. — SigLIP 2 (arXiv:2502.14786)](https://arxiv.org/abs/2502.14786) — 2026 年默认视觉塔。
- [Zhai et al. — Scaling Vision Transformers (arXiv:2106.04560)](https://arxiv.org/abs/2106.04560) — 实证缩放定律。
