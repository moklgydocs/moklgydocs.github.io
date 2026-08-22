# 任意分辨率视觉:Patch-n'-Pack 与 NaFlex

> 真实图像不是 224x224 的正方形。收据是 9:16,图表是 16:9,医学扫描可能是 4096x4096,手机截图是 9:19.5。2024 年之前 VLM 的答案——把一切缩放到固定正方形——扔掉的正是让 OCR、文档理解和高分辨率场景解析work起来的信号。NaViT(Google, 2023)证明:可以用块对角掩码,把可变分辨率的 patch 打包进同一个 Transformer 批次。Qwen2-VL 的 M-RoPE(2024)干脆扔掉了绝对位置表。LLaVA-NeXT 的 AnyRes 把高分辨率图切成 基础图 + 子图。SigLIP 2 的 NaFlex 变体(2025)如今是开放 VLM 的默认编码器——一个检查点服务所有宽高比。本课端到端实现 patch-n'-pack。

**类型:** 动手构建
**编程语言:** Python(标准库,patch 打包器 + 块对角掩码)
**前置要求:** 第 12 阶段第 01 课(ViT patch)、第 12 阶段第 05 课(LLaVA)
**预计耗时:** 约 120 分钟

## 学习目标

- 把一批可变分辨率图像的 patch 打包进一条序列,并构建块对角注意力掩码。
- 面对给定任务,在 AnyRes 平铺(LLaVA-NeXT)、NaFlex(SigLIP 2)和 M-RoPE(Qwen2-VL)之间做选择。
- 不缩放图像,为 OCR、图表和摄影计算 token 预算。
- 说出正方形缩放的三种失败模式:文字压扁、内容裁掉、padding 浪费 token。

## 问题

Transformer 期望序列,批次是一摞等长序列。图像都是 224x224 时,每次都是 196 个 patch token,不用 padding,万事大吉。在 224 上训练,在 224 上推理,永远不必想分辨率。

可惜世界不配合。文档是竖版的(8.5x11 英寸,约 2:3);图表截图是横版的(16:9);收据又细又长(1:3);医学影像发货就是 2048x2048 起步;手机截图是 1170x2532(0.46:1)。

2024 年前的三个选项,以及各自为何失败:

1. 缩放到固定正方形(224x224 或 336x336)。挤压让文字和人脸变形,降采样毁掉图表标签和 OCR 内容。LLaVA-1.5 之前的标准做法。
2. 按固定宽高比裁剪。扔掉大半个图像,而选裁剪位置本身又是个视觉问题。
3. 补齐到最长边。修了变形,但竖版图有 50%+ 的 token 浪费在 padding 上,而这些 pad token 还要付平方级注意力成本。

2024–2025 年的答案:让 Transformer 按图像原生分辨率吃 patch,再想办法把异构批次打包进一条序列,不浪费算力。

## 概念

### NaViT 与 patch-n'-pack

NaViT(Dehghani et al., 2023)证明了这条路在规模上可行。想法很机械:

1. 对批次中每张图,按选定的 patch 大小(比如 14)计算其原生 patch 网格。
2. 把每张图的 patch 展平成各自的变长序列。
3. 把所有图的 patch 拼成批次的一条长序列。
4. 构建块对角注意力掩码,图 A 的 patch 只在图 A 内部 attend。
5. 携带逐 patch 位置信息(2D RoPE 或分数位置嵌入)。

一批三张图:336x336(576 token)、224x224(256 token)、448x336(768 token),变成一条 1600 token 的序列,配 1600x1600 的块对角掩码。没有 padding,没有浪费算力,任意宽高比都能处理。

NaViT 还提出了训练时的分数 patch 丢弃——批次内随机丢 50% 的 patch——既正则化又加速训练。SigLIP 2 继承了这一点。

### AnyRes(LLaVA-NeXT)

LLaVA-NeXT 的 AnyRes 是务实的替代方案。给定高分辨率图和一个固定编码器(336 的 CLIP 或 SigLIP),做平铺:

1. 从预定义布局集合——(1x1)、(1x2)、(2x1)、(1x3)、(3x1)、(2x2) 等——中挑最贴合图像宽高比的一个。
2. 把整图按布局切成块,每块裁成 336x336。
3. 再产一张缩略图:整图缩到 336x336,作为全局上下文 token。
4. 每块过冻结的 336 编码器,拼接 切块 token + 缩略图 token。

672x672 的图,2x2 网格加缩略图:4 * 576 + 576 = 2880 个视觉 token。贵但有效——LLM 同时看得见局部细节和全局上下文。

编码器冻结且只支持一种分辨率时,AnyRes 是首选路线。代价是大图 token 爆炸(1344x1344 的图,4x4 网格是 9216 + 576 ≈ 9800 token,8k 的 LLM 上下文基本塞满)。

### M-RoPE(Qwen2-VL)

Qwen2-VL 提出多模态旋转位置嵌入(M-RoPE)。不用 NaViT 的分数位置,也不用 AnyRes 的 切块+缩略图,而是让每个 patch 携带 3D 位置(时间, 高, 宽),query/key 旋转能处理任意 H、W 和时间长度。

M-RoPE 不重训即支持原生动态分辨率。推理时喂任意 HxW 图像,patch 嵌入器产出 H/14 x W/14 个 token,每个 token 拿到自己的 (t=0, r=行, c=列) 位置,RoPE 按正确频率旋转注意力,完事。Qwen2.5-VL、Qwen3-VL 延续此路;InternVL3 的 V2PE 是同一思想,按模态可变编码。

与 AnyRes 不同,M-RoPE 是原生分辨率下 O(H x W / P^2) 的 token——没有平铺的乘性开销。与 NaViT 不同,它仍期望一次前向一张图;跨分辨率组批仍需在上面叠 patch-n'-pack。

### NaFlex(SigLIP 2)

NaFlex 是 SigLIP 2 检查点的原生灵活模式。单个模型在推理时服务多种序列长度(256、729、1024 token)。内部训练用 NaViT 式 patch-n'-pack,逐 patch 用绝对分数位置。卖点:一个检查点,推理时按任务选 token 预算。

语义任务(分类、检索)用 256 token;OCR 或图表理解用 1024 token。不重训。

### 打包掩码

块对角掩码是多数实现栽跟头的地方。对总长 `N_total`、覆盖图像 `i=0..B-1`(长度 `n_i`)的打包序列,掩码 `M`(形状 `(N_total, N_total)`)在两个下标落在同一图像块内时为 1,否则为 0。可以从累计长度表构建:

```
offsets = [0, n_0, n_0+n_1, ..., N_total]
M[i, j] = 1 iff there exists b where offsets[b] <= i < offsets[b+1] and offsets[b] <= j < offsets[b+1]
```

PyTorch 里一行 `torch.block_diag` 或显式 gather 就能写。FlashAttention 的变长路径(`cu_seqlens`)则完全跳过掩码,直接用累计长度张量在序列内做注意力——典型批次下比稠密掩码快约 10 倍。

### Token 预算

按任务选策略:

- OCR / 文档:1024–4096 token。SigLIP 2 NaFlex 用 1024,或 AnyRes 3x3 + 缩略图。
- 图表与 UI:384–448 原生分辨率下 729–1024 token。Qwen2.5-VL 动态分辨率配 max pixels 上限。
- 自然照片:256–576 token 足够,下游 LLM 看到的信息够了。把 token 花在内容密度高的地方。
- 视频:空间池化后每帧 64–128 token,2–8 FPS。第 12.17 课详讲。

2026 年生产法则:按任务设 max-pixels 上限,在该上限内按原生宽高比编码,打包批次,跳过 padding。Qwen2.5-VL 暴露的 `min_pixels` 和 `max_pixels` 正是这个旋钮。

```figure
mm-patch-n-pack
```

## 投入使用

`code/main.py` 为一批整数像素坐标的异构图像实现 patch-n'-pack:

- 输入一组 (H, W) 图像尺寸。
- 按 patch 14 计算每张图的 patch 序列长度。
- 打包成总长 `sum(n_i)` 的一条序列。
- 构建块对角注意力掩码(稠密版,便于看清)。
- 对比打包方案 vs 正方形缩放 vs AnyRes 平铺的成本。
- 为混合批次(收据、图表、截图、照片)打印 token 预算表。

跑起来。掉出来的那些数字,就是 2026 年每个开放 VLM 都用 patch-n'-pack 的原因。

## 交付

本课产出 `outputs/skill-resolution-budget-planner.md`。给定混合宽高比的工作负载(OCR、图表、照片、视频帧)和总 token 预算,选出正确策略(NaFlex、AnyRes、M-RoPE 或固定正方形),产出按请求的配置。给产品级 VLM 做容量规划时用——它能防住那种悄悄 10 倍 token 膨胀、杀死延迟预算的事故。

## 练习

1. 一张收据 600x1500(1:2.5)。patch 14 下原生分辨率多少 token?缩放到 336 正方形后多少?实践中哪个丢的 OCR 准确率更多?

2. 为长度 256、576、729、1024 的四张图构建块对角掩码。验证注意力矩阵是 2585x2585,且非零元素恰好 `256^2 + 576^2 + 729^2 + 1024^2` 个。

3. 对 1792x896 的图,在 patch 14 下对比:(a) 缩放到 336 正方形再编码;(b) AnyRes 2x1 + 缩略图;(c) M-RoPE 原生分辨率。哪个 token 最少?哪个保住的细节最多?

4. 实现分数 patch 丢弃:给定打包序列,均匀随机丢 50% token,并相应更新块对角掩码。测量掩码稀疏度变化。

5. 读 Qwen2-VL 论文(arXiv:2409.12191)第 3.2 节。用两句话说明 `min_pixels` 和 `max_pixels` 分别控制什么,以及为什么两个界都需要。

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|-----------------|------------------------|
| Patch-n'-pack | "NaViT 式打包" | 把不同图像的变长 patch 序列拼进同一个批次维度 |
| 块对角掩码 | "打包掩码" | 把每张图的 patch 注意力限制在图内、不越界到邻图的注意力掩码 |
| AnyRes | "LLaVA-NeXT 平铺" | 高分辨率图切成定长块网格加一张全局缩略图;每块过固定编码器 |
| NaFlex | "SigLIP 2 原生灵活" | 单个 SigLIP 2 检查点,推理时不重训即可服务 256/729/1024 token 预算 |
| M-RoPE | "多模态 RoPE" | 3D 旋转位置编码(时间, 行, 列),无需位置表即可处理任意 H、W、T |
| cu_seqlens | "FlashAttention 打包" | FlashAttention 变长路径用来替代稠密块对角掩码的累计长度张量 |
| min_pixels / max_pixels | "分辨率上下界" | Qwen2.5-VL 的按请求旋钮,给过小或过大输入的 token 数封顶 |
| 视觉 token 预算 | "每图多少 token" | 每张图产出 patch token 的大致数量;决定 LLM 提示预算与注意力成本 |

## 延伸阅读

- [Dehghani et al. — Patch n' Pack: NaViT (arXiv:2307.06304)](https://arxiv.org/abs/2307.06304)
- [Wang et al. — Qwen2-VL (arXiv:2409.12191)](https://arxiv.org/abs/2409.12191)
- [Laurençon et al. — What matters when building vision-language models? (Idefics2, arXiv:2405.02246)](https://arxiv.org/abs/2405.02246)
- [Tschannen et al. — SigLIP 2 (arXiv:2502.14786)](https://arxiv.org/abs/2502.14786)
- [Qwen Team — Qwen2.5-VL Technical Report (arXiv:2502.13923)](https://arxiv.org/abs/2502.13923)
