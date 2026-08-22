# CLIP 与对比式视觉-语言预训练

> OpenAI 的 CLIP(2021)证明了一个足以驱动此后五年的想法:只用嘈杂的网络图文对和一个对比损失,把图像编码器与文本编码器对齐到同一个向量空间。零监督标签,4 亿对数据。得到的嵌入空间能做零样本分类、图文检索,并作为视觉塔插进 2026 年的每一个 VLM。SigLIP 2(2025)把 softmax 换成 sigmoid,以更低成本超越了 CLIP。本课把数学从 InfoNCE 走到 sigmoid 逐对损失,并用标准库 Python 搭出训练步。

**类型:** 动手构建
**编程语言:** Python(标准库,InfoNCE + sigmoid 损失实现)
**前置要求:** 第 12 阶段第 01 课(ViT patch)、第 7 阶段(Transformer)
**预计耗时:** 约 180 分钟

## 学习目标

- 从互信息推导 InfoNCE 损失,并实现数值稳定的向量化版本。
- 解释为什么 sigmoid 逐对损失(SigLIP)能扩展到 32768+ 的批次,而不需要 softmax 要求的 all-gather 开销。
- 构造文本模板(`a photo of a {class}`)并对余弦相似度取 argmax,跑零样本 ImageNet 分类。
- 说出 CLIP / SigLIP 预训练给你的四个杠杆:批次大小、温度、提示模板、数据质量。

## 问题

CLIP 之前的视觉是监督式的:收集标注数据集(ImageNet:120 万张图、1000 个类),训一个 CNN,交付。标注很贵,标注偏向标注者能达成一致的东西,而且标注不微调就迁移不到新任务。

图文网络上,免费躺着超过十亿对弱标注数据。一张金毛寻回犬的照片配着 alt 文本"公园里我家的 Max",就携带监督信号——文本在描述图像。问题是:能不能把这变成有用的训练?

CLIP 的回答:把图文对当匹配任务。给一批 N 张图和 N 段描述,学着把每张图匹配到它自己的描述,对抗其余 N-1 个干扰项。监督信号就是"这两个属于彼此,那 N-1 个不属于"。没有类标签,没有人工标注,只有一个对比损失。

得到的嵌入空间,做到的远超 CLIP 的训练目标。零样本 ImageNet 之所以成立,是因为"a photo of a cat"的嵌入,落在那些从没被显式标为"猫"的猫图片附近。正是这个赌注,催生了 2026 年的每一个 VLM。

## 概念

### 双编码器

CLIP 有两座塔:

- 图像编码器 `f`:ViT 或 ResNet,每张图输出一个 D 维向量。
- 文本编码器 `g`:小 Transformer,每段描述输出一个 D 维向量。

两座塔都把输出归一化到单位长度。相似度是 `cos(f(x), g(y)) = f(x)^T g(y)`(两者都是单位范数)。

对一批 N 个(图像, 描述)对,构建形状为 `(N, N)` 的相似度矩阵 `S`:

```
S[i, j] = cos(f(x_i), g(y_j)) / tau
```

其中 `tau` 是可学习温度(CLIP 初始化为 0.07,在对数空间学习)。

### InfoNCE 损失

CLIP 在行和列上做对称交叉熵:

```
loss_i2t = CE(S, labels=identity)     # each image's positive is its own caption
loss_t2i = CE(S^T, labels=identity)   # each caption's positive is its own image
loss = (loss_i2t + loss_t2i) / 2
```

这就是 InfoNCE。CE 里的 softmax 强迫每张图对它的描述得分高于批次里所有其他描述。"负样本"就是批次里其他所有样本。批次越大 = 负样本越多 = 信号越强。CLIP 用 3.2 万批次训练,规模很关键。

### 温度

`tau` 控制 softmax 的锐度。tau 低 → 分布尖锐,有硬负样本挖掘的效果;tau 高 → 分布平缓,所有样本都有贡献。CLIP 学习 log(1/tau),并做钳制防止坍缩。SigLIP 2 固定初始 tau,改用一个可学习偏置。

### 为什么 sigmoid 扩展性更好(SigLIP)

softmax 需要整个相似度矩阵保持同步。分布式训练时,必须把每个嵌入 all-gather 到每个副本,再做 softmax——通信量随集群规模平方增长。

SigLIP 把 softmax 换成逐元素 sigmoid:对每一对 `(i, j)`,损失是一个"这对是不是匹配对"的二分类;正对角线是正类,其余全是负类。损失为:

```
L = -1/N sum over (i, j) [ y_ij log sigmoid(S[i,j]) + (1-y_ij) log sigmoid(-S[i,j]) ]
```

`y_ij = 1` 当 `i == j`,否则 0。每对的损失相互独立,不需要 all-gather:每个 GPU 算自己的本地块再求和。SigLIP 2 能以低廉代价扩展到 3.2 万–51.2 万批次,而 CLIP 需要同比例更多的通信。

### 零样本分类

给定 N 个类名,为每个类构造文本模板:

```
"a photo of a {class}"
```

用文本编码器嵌入每个模板,用图像编码器嵌入你的图像。余弦相似度取 argmax 就是预测类别。不在目标类上做任何训练。

提示模板有影响。CLIP 原论文每类用 80 个模板(plain、artistic、photo、painting 等)并对嵌入取平均,ImageNet 多 3 个点。现代用法通常只挑一两个模板。

### 线性探针与微调

零样本只是基线。线性探针(冻结 CLIP 特征,只在其上为你的目标类训一个线性层)在域内任务上胜过零样本;全量微调胜过线性探针,但可能损害零样本迁移。三种范式,三种取舍。

### SigLIP 2:NaFlex 与稠密特征

SigLIP 2(2025)新增:

- NaFlex:单模型处理可变宽高比与分辨率。
- 更好的稠密特征,面向分割与深度估计,目标是当 VLM 的冻结骨干。
- 多语言:在 100+ 种语言上训练,而 CLIP 只有英语。
- 参数规模到 10 亿,CLIP 封顶在 4 亿。

2026 年的开放 VLM 里,SigLIP 2 SO400m/14 是默认视觉塔。纯图文检索场景下 CLIP 仍是默认——只要你的查询模式恰好匹配 LAION-2B 的训练分布。

### ALIGN、BASIC、OpenCLIP、EVA-CLIP

ALIGN(Google, 2021):与 CLIP 同思路,18 亿对规模,90% 是噪声数据,证明噪声数据也能规模化。OpenCLIP(LAION):在 LAION-400M / 2B 上对 CLIP 的开放复现,多个规模,首选开放检查点。EVA-CLIP:从掩码图像建模初始化,VLM 的强骨干。BASIC:Google 的 CLIP+ALIGN 混合。同一家族,数据与调优不同。

### 零样本天花板

CLIP 类模型在 ImageNet 零样本上封顶约 76%(CLIP-G、OpenCLIP-G)。再往上,要么大得多的数据(SigLIP 2 到 80%+),要么改架构(监督头、更多参数)。这个基准正在饱和;真正的价值是下游 VLM 消费的那个嵌入空间。

```figure
multimodal-fusion
```

## 投入使用

`code/main.py` 实现了:

1. 一个玩具双编码器(基于哈希的图像特征、文本字符特征),让你不用 numpy 也能看清 InfoNCE 的形状。
2. 纯 Python 的 InfoNCE 损失(经 log-sum-exp 保持数值稳定)。
3. 用于对比的 sigmoid 逐对损失。
4. 零样本分类流程:对一组文本提示计算余弦相似度,argmax 得预测。

跑起来看损失曲线。绝对数值是玩具,形状与真实 CLIP 训练器吐出的一致。

## 交付

本课产出 `outputs/skill-clip-zero-shot.md`。给定一组图像(按路径)和一个目标类列表,它用 CLIP 模板构造文本提示,用指定检查点(如 `openai/clip-vit-large-patch14`)嵌入两侧,返回带相似度分数的 top-1 / top-5 预测。对不在提示列表里的类,该技能拒绝下结论。

## 练习

1. 手工为 4 对样本算一遍 InfoNCE:构造 4x4 相似度矩阵,跑 softmax,取出对角线,算交叉熵。用你的 Python 实现对照手算结果验证。

2. SigLIP 在温度之外还有一个偏置参数 `b`:`S'[i,j] = S[i,j]/tau + b`。当批次存在大类不平衡(每行负样本远多于正样本)时,`b` 起什么作用?读 SigLIP 第 3 节(arXiv:2303.15343)。

3. 搭一个猫 vs 狗的零样本分类器。试两个提示模板:`a photo of a {class}` 和 `a picture of a {class}`。在 100 张测试图上测准确率。模板集成胜过单模板吗?

4. 计算 512 GPU、批次 3.2 万的 run 中,softmax InfoNCE 与 sigmoid 逐对损失的通信成本。哪个是 O(N),哪个是 O(N^2)?引 SigLIP 第 4 节。

5. 读 OpenCLIP 缩放定律论文(arXiv:2212.07143, Cherti et al.)。从图中复现他们关于数据缩放的结论:模型规模固定时,ImageNet 零样本准确率与训练数据量之间是什么对数线性关系?

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|----------------|------------------------|
| InfoNCE | "对比损失" | 批次相似度矩阵上的交叉熵;每个样本的正例是它的配对,其余全是负例 |
| Sigmoid 损失 | "SigLIP 损失" | 逐对二元交叉熵;无 softmax、无 all-gather,分布式下廉价扩展 |
| 温度 | "tau" | softmax/sigmoid 前缩放 logits 的标量;控制分布锐度 |
| 零样本 | "不微调的分类" | 用文本提示构造类嵌入,按余弦相似度分类;不在目标类上训练 |
| 提示模板 | "a photo of a ..." | 包在类名外的文本脚手架;影响零样本准确率 1–5 个点 |
| 双编码器 | "双塔" | 一个图像编码器 + 一个文本编码器,输出在同一 D 维空间 |
| 硬负样本 | "难缠的干扰项" | 与正样本足够相似、逼得模型费力区分的负样本 |
| 线性探针 | "冻结 + 一层" | 只在冻结特征上训线性分类器;度量特征质量 |
| NaFlex | "原生灵活分辨率" | SigLIP 2 能力:不缩放即可接收任意宽高比与分辨率的图像 |
| 温度缩放 | "对数参数化的 tau" | CLIP 参数化 `log(1/tau)` 让梯度表现良好;钳制防止 tau 坍缩到近零 |

## 延伸阅读

- [Radford et al. — Learning Transferable Visual Models From Natural Language Supervision (arXiv:2103.00020)](https://arxiv.org/abs/2103.00020) — CLIP 论文。
- [Zhai et al. — Sigmoid Loss for Language Image Pre-Training (arXiv:2303.15343)](https://arxiv.org/abs/2303.15343) — SigLIP。
- [Tschannen et al. — SigLIP 2 (arXiv:2502.14786)](https://arxiv.org/abs/2502.14786) — 多语言 + NaFlex。
- [Jia et al. — ALIGN (arXiv:2102.05918)](https://arxiv.org/abs/2102.05918) — 噪声网络数据的规模化。
- [Cherti et al. — Reproducible scaling laws for contrastive language-image learning (arXiv:2212.07143)](https://arxiv.org/abs/2212.07143) — OpenCLIP 缩放定律。
