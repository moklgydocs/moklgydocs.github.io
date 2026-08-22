# Jamba——SSM 与 Transformer 的混血

> 状态空间模型(SSM)和 Transformer 想要的东西不一样。Transformer 用二次方代价的注意力买质量;SSM 用循环结构买线性时间推理和恒定显存,但质量落后。AI21 的 Jamba(2024 年 3 月)和 Jamba 1.5(2024 年 8 月)把两者装进同一个模型:每 7 层 Mamba 配 1 层 Transformer,每隔一层上 MoE,256k 上下文窗口塞进单块 80GB GPU。Mamba-3(ICLR 2026)则用复数状态空间和 MIMO 投影,把 SSM 这一侧又拧紧了一扣。本课端到端读两种架构,并解释:为什么纯 SSM 和纯 Transformer 的长上下文尝试都没能撑过三年,而混血配方活了下来。

**类型:** 学习
**编程语言:** Python(标准库,层配比计算器)
**前置要求:** 第 10 阶段 · 14(开放模型架构),第 10 阶段 · 17(原生稀疏注意力)
**预计耗时:** 约 60 分钟

## 学习目标

- 解释 Jamba 块里的三种原语——Transformer 层、Mamba 层、MoE——以及 1:7:隔层 的交错配方
- 从高层次描述 SSM 的循环结构,以及它为什么能实现恒定显存推理
- 计算 Jamba 模型在 256k 上下文下的 KV 缓存占用,并与纯 Transformer 模型对比
- 说出 Mamba-3 的三项创新(指数-梯形离散化、复数状态更新、MIMO)及各自瞄准的问题

## 问题

注意力随序列长度二次方增长,状态空间模型是线性的。这个差距会复利:256k token 时,Transformer 每个头的注意力图有 650 亿项;SSM 的循环状态则是固定大小,与序列长度无关。

纯 SSM 模型(Mamba、Mamba-2)在小规模上能追平 Transformer 的困惑度,但在状态跟踪任务上落后,在部分上下文检索类别上失败。直觉是:SSM 把历史压进固定状态,历史一长,信息就漏。注意力什么都精确记得,但要付二次方的价。

显而易见的修法:两个都用。精确回忆重要的地方放 Transformer 层,其他地方用 SSM 层,调比例。Jamba 是第一个把这个混血配方规模化落地的生产级模型(总参数 52B、激活 12B、256k 上下文、单块 80GB GPU)。Jamba 1.5 把家族扩到 398B 总参 / 94B 激活。Mamba-3(ICLR 2026)则是当前最强的纯 SSM 基线,下一代混血可以围绕它重建。

本课读完三篇论文,产出"怎么挑比例"的心智模型。

## 概念

### 一页纸讲清 SSM

状态空间模型用一个固定大小的状态 `h` 处理序列 `x_1, ..., x_N`:

```
h_t = A h_{t-1} + B x_t
y_t = C h_t
```

每一步,状态经线性动力学 `A` 演化,接收输入 `B x_t`,产出 `C h_t`。`A, B, C` 可以学习。注意关键性质:计算 `y_t` 只需要 `h_{t-1}` 和 `x_t`,不需要任何更早的 `x`。显存恒定,推理每 token O(1)。

建模质量的窍门在 `A` 的结构上。S4(Gu 2021)用一个高度结构化的矩阵,训练时可以当作长卷积高效求值。Mamba(Gu、Dao 2023)把固定的 `A, B, C` 换成依赖数据的("选择性"的由来)。Mamba-2(2024)进一步简化结构。Mamba-3(2026)又在特定地方把复杂度加了回来。

关键性质:对解码器 LLM 来说,SSM 层是注意力层的即插即用替代品——每层固定大小的状态,取代不断增长的 KV 缓存。

### Jamba 块

Jamba 块按两个数字交错层:

- `l`:注意力与 Mamba 的比例。Jamba 用 `l = 8`,即每 7 层 Mamba 配 1 层 Transformer(7 Mamba + 1 Attention = 每组 8 层)。
- `e`:MoE 频率。Jamba 用 `e = 2`,即每隔一层应用 MoE。

块内的层序:

```
M  M  M  M  M  M  M  A    (7 Mamba + 1 Attention)
|  M  |  M  |  M  |  M    (where | marks MoE applied)
```

每个 Jamba 块 8 层。4 块深(共 32 层)时,有 28 层 Mamba、4 层注意力,其中 16 层带 MoE。

### 为什么是 1:7

AI21 做了消融:注意力与 Mamba 什么比例,能在他们的长上下文评估上同时拿到最好的"单位参数困惑度"和上下文回忆?

- 注意力太多(1:1):质量上去了,显存和速度垮了。
- 注意力太少(1:15):显存漂亮,但上下文检索失败。
- 甜点:1:7 或 1:8。

直觉:Transformer 层管精确回忆和状态跟踪,Mamba 层管便宜的大头处理。

### 位置编码

Mamba 层靠循环结构自带位置感知。最初基于 Mamba 的混血里,注意力层不用 RoPE——SSM 层提供位置信息。Jamba 1.5 则给注意力层加了 RoPE,改善长上下文泛化——这是根据长上下文实测做的后置改进。

### 显存预算

以 Jamba-1 的形状(32 层:28 Mamba + 4 Attention,hidden 4096,32 个注意力头)为例:

- KV 缓存(仅注意力层):256k BF16 下 `2 * 4 * 32 * 128 * 256k * 2 = 8.4 GB`。只有 4 个注意力层贡献。
- SSM 状态:每层固定大小,不随序列长度增长。典型 Mamba 状态是每个特征 16、hidden 4096:总共 `28 * 4096 * 16 * 2 = 3.7 MB`。

对比同形状 32 层纯 Transformer、32 头完整 MHA:256k BF16 下 `2 * 32 * 32 * 128 * 256k * 2 = 128 GB`。KV 缓存差 8 倍。即使对比多数 2024 模型用的 GQA(8) 基线(`2 * 32 * 8 * 128 * 256k * 2 = 32 GB`),Jamba 的 1:7 混血(16 GB)仍然小 2 倍。

这就是 AI21 说"单块 80GB GPU 跑 256k 上下文"的底气:完整 MHA 纯 Transformer 的 KV 缓存根本装不下;GQA 基线装下缓存就没地方放权重和激活;Jamba 装得下。

### Mamba-3:2026 年的纯 SSM 基线

Mamba-3(ICLR 2026,arXiv:2603.15569)在纯 SSM 一侧引入三项创新:

1. **指数-梯形离散化。** 把 Mamba-2 的欧拉法离散化换成表达力更强的循环结构。类卷积操作施加在核心循环内部的状态-输入上,而不是作为 `x_t` 上的外部卷积。

2. **复数状态更新。** 之前的 Mamba 一路做减法:状态矩阵从复数(S4)减到实对角(Mamba)再减到缩放单位阵(Mamba-2)。Mamba-3 把复数加回来——等价于在状态上施加依赖数据的旋转嵌入。这找回了此前实数简化丢掉的状态跟踪能力。

3. **多输入多输出(MIMO)投影。** 把逐特征标量投影换成矩阵值投影。提升建模能力和推理时的硬件利用率,而不增加 decode 延迟。

1.5B 参数下,Mamba-3 的平均下游准确率比 Gated DeltaNet 高 0.6 个点;MIMO 变体再加 1.2,合计 1.8 个点。同状态大小下,Mamba-3 用一半状态就能追平 Mamba-2。

Mamba-3 还没有在规模化生产混血中出货——但它是下一个 Jamba 级模型 SSM 一侧的显然候选。

### 什么时候选混血

混血胜出的场景:

- 上下文长到纯 Transformer 的 KV 缓存开始疼(64k+)。
- 任务混合短程结构(SSM 擅长)与长程回忆(要 Transformer)。
- 部署显存预算只有单卡,纯 Transformer 光 KV 缓存就塞不下。

混血输的场景:

- 上下文短(16k 以下)。SSM 的开销白付,纯 Transformer 就够。
- 任务需要处处到处的注意力(深度推理、多文档交叉引用)。混血中注意力层的稀疏会拖后腿。
- 你要扩到万亿参数前沿模型。纯 Transformer + MLA + MoE(DeepSeek-V3 式)目前赢在能力竞赛。

### 竞争格局

| 模型 | 家族 | 规模 | 独特卖点 |
|-------|--------|------|-------------|
| Mamba-2 | 纯 SSM | 3B | 线性时间,恒定显存 |
| Jamba | 混血 | 52B/12B | 80GB 上 256k |
| Jamba 1.5 Large | 混血 | 398B/94B | 企业级长上下文 |
| Mamba-3 | 纯 SSM | 1.5B(论文) | 找回状态跟踪 |
| DeepSeek-V3 | 纯 Transformer + MoE | 671B/37B | 前沿能力 |

2026 年的格局:纯 Transformer MoE 统治前沿,混血占稳 256k+ 上下文的生态位。Mamba-3 在状态跟踪上的胜利,可能让下一代混血的比例更低(SSM 更多,注意力更少)。

```figure
swiglu-ffn
```

## 投入使用

`code/main.py` 是一个混血架构的显存计算器。给定 SSM-Transformer 比例和 hidden-size / 层数配置,它计算:

- 目标上下文下的 KV 缓存。
- SSM 状态显存。
- 上下文 N 下、一系列模型形状的总显存。

计算器支持:

- 纯 Transformer 基线(KV 缓存随 N 增长)。
- Jamba 式 1:7 混血。
- 纯 SSM(完全没有 KV 缓存)。

已发布形状的数字直接来自 Jamba-1 和 Jamba-1.5 论文,假想变体为外推。

真实部署的集成注意事项:

- 多数生产推理服务器(vLLM、SGLang)支持 Jamba 和 Mamba,注意查具体版本。
- 256k 上下文下,Jamba 的显存优势体现在并发请求吞吐上:同样的 VRAM,Jamba 序列比 Transformer 序列塞得更多。
- Mamba-3 作为独立模型尚未进入生产——目前还是 1.5B 的研究预览。

## 交付

本课会产出 `outputs/skill-hybrid-picker.md`。给定负载规格(上下文长度画像、任务组合、显存预算),它在纯 Transformer、Jamba 式混血和纯 SSM 之间做推荐,并就显存与质量权衡给出明确推理。

## 练习

1. 运行 `code/main.py`,计算 32 层纯 Transformer(hidden 4096,32 头)与同形状 Jamba-1 混血在 256k 上下文下的 KV 缓存。验证 AI21 论文声称的约 8 倍显存缩减。

2. 修改计算器,建模 1:3 混血(4 Mamba : 1 Attention)和 1:15 混血(14 Mamba : 1 Attention)。画出 KV 缓存随比例变化的曲线。什么比例时 KV 缓存等于 SSM 状态显存?

3. 读 Jamba 论文(arXiv:2403.19887)第 3 节。解释为什么 AI21 用 Mamba-1 而不是更快的 Mamba-2。提示:混血消融一节有记录。

4. 计算 Jamba 1.5 Large(总 398B、激活 94B)隔层 MoE 的参数开销。把激活比与 DeepSeek-V3(37B/671B)对比,解释为什么 Jamba 的架构把激活比推得更高。

5. 读 Mamba-3 论文(arXiv:2603.15569)第 3 节。用三句话解释:为什么复数状态更新等价于依赖数据的旋转嵌入。答案要扣回第 7 阶段 · 第 04 课的 RoPE 推导。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| 状态空间模型(SSM) | "固定状态的循环" | 带学习循环 `h_t = A h_{t-1} + B x_t` 的层;每 token 显存恒定 |
| 选择性 SSM | "Mamba 的技巧" | 依赖数据的 A、B、C 参数,让模型在线性时间内获得门控式选择性 |
| 注意力-Mamba 比 | "多少注意力层" | Jamba 中 `l = 8` 表示每 7 层 Mamba 配 1 层注意力 |
| Jamba 块 | "8 层一组" | 1 注意力 + 7 Mamba,隔位上 MoE |
| SSM 状态 | "那个隐状态缓冲" | 每层固定大小的状态,取代 Mamba 层的 KV 缓存 |
| 256k 上下文 | "Jamba 的招牌数字" | Jamba-1 能塞进单块 80GB GPU 的序列长度;同规模纯 Transformer 做不到 |
| Mamba-3 | "2026 纯 SSM" | 当前最强纯 SSM 架构,复数状态 + MIMO;混血重建时围绕的基线 |
| MIMO | "多输入多输出" | Mamba-3 的创新:用矩阵值投影取代逐特征标量投影 |
| 指数-梯形离散化 | "Mamba-3 的循环" | 表达力更强的循环结构,涵盖 Mamba-2 的欧拉法离散化 |
| 混血架构(Hybrid) | "注意力混 SSM" | 交错 Transformer 层与 SSM 层的模型;Jamba 是生产 archetype |

## 延伸阅读

- [Lieber et al. — Jamba: A Hybrid Transformer-Mamba Language Model (arXiv:2403.19887)](https://arxiv.org/abs/2403.19887) ——Jamba 原始论文,比例消融,256k 上下文主张
- [AI21 — Jamba 1.5: Hybrid Transformer-Mamba at Scale (arXiv:2408.12570)](https://arxiv.org/abs/2408.12570) ——放大的家族,398B/94B 与 12B/52B 公开发布
- [Gu, Dao — Mamba: Linear-Time Sequence Modeling with Selective State Spaces (arXiv:2312.00752)](https://arxiv.org/abs/2312.00752) ——Jamba 所基于的选择性 SSM 论文
- [Dao, Gu — Mamba-2 (arXiv:2405.21060)](https://arxiv.org/abs/2405.21060) ——简化结构化状态空间的后继
- [Lahoti et al. — Mamba-3 (arXiv:2603.15569, ICLR 2026)](https://arxiv.org/abs/2603.15569) ——复数状态、MIMO,2026 年纯 SSM 前沿
- [Gu et al. — Efficiently Modeling Long Sequences with Structured State Spaces (arXiv:2111.00396)](https://arxiv.org/abs/2111.00396) ——S4 论文,SSM 谱系在 LLM 上的起点
