# Show-o 与离散扩散统一模型

> Transfusion 混合连续与离散表示。Show-o(Xie et al., 2024 年 8 月)走另一条路:文本 token 用因果 next-token 预测,图像 token 用 MaskGIT 式的掩码离散扩散。两者共居一个 Transformer,配混合注意力掩码。结果:VQA、文生图、局部重绘和混合模态生成,统一在一个骨干、每模态一个分词器、一种损失形式(next-token 推广到掩码预测)之上。本课精读 Show-o 的设计——为什么掩码离散扩散是一个并行的、几步到位的图像生成器——并与 Transfusion、Emu3 对照。

**类型:** 学习
**编程语言:** Python(标准库,掩码离散扩散采样器)
**前置要求:** 第 12 阶段第 13 课(Transfusion)
**预计耗时:** 约 120 分钟

## 学习目标

- 解释掩码离散扩散:均匀掩掉 token、再让 Transformer 把它们恢复出来的调度。
- 从速度与质量对比并行图像解码(Show-o、MaskGIT)与自回归图像解码(Chameleon、Emu3)。
- 说出 Show-o 用一个检查点处理的三类任务:文生图、VQA、图像重绘。
- 挑选掩码调度(余弦、线性、截断),并推理它对样本质量的影响。

## 问题

Transfusion 的双损失训练有效,但动力学更微妙——连续扩散损失与离散 NTP 损失活在不同的数值尺度上,平衡损失权重是一场超参搜索。架构有效,但复杂。

Show-o 的回答:两种模态都保持离散(像 Chameleon),但图像生成改为掩码离散扩散的并行方式,而不是串行。训练目标变成单一的掩码 token 预测——它自然地推广了 next-token 预测。

## 概念

### 掩码离散扩散(MaskGIT)

Chang et al.(2022)的 MaskGIT 戏法很优雅。从全掩码图像起步(每个 token 都是特殊 `<MASK>` id)。每一步:并行预测所有被掩 token,保留置信度最高的前 K 个,其余的重新掩上。约 8–16 轮后,全部 token 填完。每步揭开多少 token 的调度需要调——余弦调度效果好。

训练很简单:从 [0, 1] 均匀采一个掩码率,作用到图像的 VQ token 上,训练 Transformer 恢复被掩的那些。正是 BERT 对文本做的事,放大到了图像生成。

### Show-o:一个 Transformer,混合掩码

Show-o 把 MaskGIT 装进一个因果语言模型 Transformer。注意力掩码:

- 文本 token:因果(标准 LLM)。
- 图像 token:图像块内全双向(被掩 token 预测时能看见其他所有图像 token)。
- 文到图:文本 attend 此前的图像,图像 attend 此前的文本。

训练在三者间交替:

1. 文本序列上的标准 NTP。
2. 文生图样本:文本 → 图像,图像 token 被掩,做掩码 token 预测损失。
3. VQA 样本:图像 → 文本,文本 token 被掩(其实就是 NTP)。

统一损失是 `<MASK>` token 上的交叉熵——它同时覆盖了文本 NTP(只有最后一个 token 算"被掩")和图像掩码扩散(随机子集被掩)。

### 并行采样

Show-o 生成一张图约 16 步,而不是约 1000 步(逐 token 自回归)或约 20 步(扩散)。每一步:并行预测所有被掩 token,提交置信度前 K 个,重复。

对比:

- Chameleon / Emu3(token 自回归):每图 N_tokens 次前向,典型 1024–4096 次。
- Transfusion(连续扩散):约 20 步,每步一次完整 Transformer 前向。
- Show-o(掩码离散扩散):约 16 步,每步一次完整 Transformer 前向。

同规模下 Show-o 比 Chameleon 快;步数与 Transfusion 大致相当,但单步成本更低(离散词表 logits,而非连续 MSE 损失)。

### 一个检查点,多种任务

Show-o 推理时按提示格式支持四种任务:

- 文本生成:标准自回归文本输出。
- VQA:图像进,文本出。
- 文生图:文本进,图像出,走掩码离散扩散。
- 局部重绘:部分 token 被掩的图像,补全。

重绘能力免费来自掩码预测训练:掩掉 VQ token 网格的一块区域,连其余部分加文本提示一起喂入,预测被掩 token。

### 掩码调度

每步揭开多少 token 的调度,塑造样本质量。Show-o 推荐余弦:

```
mask_ratio(t) = cos(pi * t / (2 * T))   # t = 0..T
```

第 0 步全掩(ratio 1.0),第 T 步无掩。余弦把质量集中在预测信息量最大的中段比例。线性调度也行,但更早进入平台。

### Show-o2

Show-o2(2025 年续作,arXiv 2506.15564)放大 Show-o:更大的 LLM 基座、更好的分词器、改进的掩码调度。架构模式不变。

### Show-o 的位置

2026 年的分类法里:

- 离散 token + NTP:Chameleon、Emu3。简单,但推理慢。
- 离散 token + 掩码扩散:Show-o、MaskGIT、LlamaGen、Muse。并行采样,仍受分词器损失所限。
- 连续 + 扩散:Transfusion、MMDiT、DiT。质量最高,训练更复杂。
- 连续 + VLM 内 flow matching:JanusFlow、InternVL-U。最新。

按任务选:想要一个开放模型同时有 文生图 + 重绘 + VQA 且速度合理,选 Show-o;质量至上且负担得起双损失管线,选 Transfusion。

```figure
masked-diffusion-unmask
```

## 投入使用

`code/main.py` 模拟 Show-o 采样:

- 16 个 VQ token 的玩具网格。
- 一个模拟"Transformer":根据提示和当前已揭 token 预测 logits。
- 余弦调度下 8 步并行掩码采样。
- 打印中间状态(掩码图案演化)与最终 token。

跑起来,看掩码一步步溶解。

## 交付

本课产出 `outputs/skill-unified-gen-model-picker.md`。给定一个既要理解(VQA、描述)又要生成(文生图、重绘)、且限定开放权重的产品,在 Show-o 家族、Transfusion/MMDiT 家族、Emu3 / Chameleon 家族之间做选择,给出具体取舍。

## 练习

1. 掩码离散扩散约 16 步采样。为什么不 1 步?第 0 步全揭开会怎样?

2. 重绘是掩码扩散的免费能力。提出一个(真实或假想的)产品场景,其中 Show-o 的重绘胜过专家模型。

3. 余弦调度 vs 线性调度:对 T=8,写出每步揭开 token 数。哪个更均衡?

4. 一张 512x512 的 Show-o 图像是 1024 token。词表 K=16384 时,模型输出 1024 * log2(16384) = 14,336 位(约 1.75 KiB)数据;Stable Diffusion 输出 512*512*24 位 = 6,291,456 位(约 768 KiB)原始像素。压缩比多少?这换来了什么质量?

5. 读 LlamaGen(arXiv:2406.06525)。LlamaGen 的类条件自回归图像模型,与 Show-o 的掩码路线有何不同?

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|-----------------|------------------------|
| 掩码离散扩散 | "MaskGIT 式" | 训练预测被掩 token;推理时迭代揭开置信度最高的预测 |
| 余弦调度 | "揭掩调度" | 推理步间掩码率的衰减;把置信度增长集中在中段 |
| 并行解码 | "一次全出" | 每步一次前向预测全部掩 token,再提交前 K 个 |
| 混合注意力 | "因果 + 双向" | 文本 token 因果、图像块内双向的掩码 |
| 局部重绘 | "补全生成" | 以部分 token 被掩的图像为条件,预测缺失部分;训练目标免费附带 |
| 提交率 | "每步前 K" | 每轮宣布"完成"的 token 数;控制推理与质量的权衡 |

## 延伸阅读

- [Xie et al. — Show-o (arXiv:2408.12528)](https://arxiv.org/abs/2408.12528)
- [Show-o2 (arXiv:2506.15564)](https://arxiv.org/abs/2506.15564)
- [Chang et al. — MaskGIT (arXiv:2202.04200)](https://arxiv.org/abs/2202.04200)
- [Sun et al. — LlamaGen (arXiv:2406.06525)](https://arxiv.org/abs/2406.06525)
- [Chang et al. — Muse (arXiv:2301.00704)](https://arxiv.org/abs/2301.00704)
