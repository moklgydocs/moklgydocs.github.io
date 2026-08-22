# 从 CLIP 到 BLIP-2 —— 作为模态桥梁的 Q-Former

> CLIP 对齐了图像与文本,但写不了描述、答不了问题、聊不了天。BLIP-2(Salesforce, 2023)用一座小小的可训练桥梁解决了这个:32 个可学习查询向量,通过交叉注意力 attend 冻结 ViT 的特征,然后直接插进冻结 LLM 的输入流。188M 参数的桥,把一个 110 亿参数 LLM 接到了 ViT-g/14 上。直到 2026 年,每一个适配器式 VLM——MiniGPT-4、InstructBLIP、LLaVA 的表亲们——都是它的后代。本课精读 Q-Former 架构,讲解两阶段训练,并搭一个玩具版,把视觉 token 喂进冻结的文本解码器。

**类型:** 动手构建
**编程语言:** Python(标准库,交叉注意力 + 可学习查询演示)
**前置要求:** 第 12 阶段第 02 课(CLIP)、第 7 阶段(Transformer)
**预计耗时:** 约 180 分钟

## 学习目标

- 解释为什么在冻结视觉编码器与冻结 LLM 之间放一座可训练瓶颈,在成本与稳定性上胜过端到端微调。
- 实现一个交叉注意力块:固定数量的一组可学习查询 attend 外部图像特征。
- 走通 BLIP-2 两阶段预训练:表示阶段(ITC + ITM + ITG),然后生成阶段(冻结解码器上的 LM 损失)。
- 对比 Q-Former 与 LLaVA 使用的更简单 MLP 投影器,论证各自何时胜出。

## 问题

你有一个冻结 ViT,每张图产出 256 个 1408 维 patch token;你有一个冻结的 70 亿参数 LLM,期望 4096 维的 token 嵌入。最显然的桥——一个 1408 → 4096 的线性层——能跑通,但把全部 256 个 patch token 塞进 LLM 上下文,每张图要多花 256 个 token。一批 32 张图,光视觉模态就吃掉 8192 个 token。

BLIP-2 的问题是:能不能把 256 token 的图像表示压成少得多的 token(比如 32 个),同时保住足够信息,让 LLM 能写描述、答问题、对图像做推理?而且,能不能在完全不碰两个冻结骨干的情况下训练这座桥,让训练成本只有桥本身的参数?

答案就是 Q-Former:32 个可学习"查询"向量,对 ViT 的 patch token 做交叉注意力,产出 32 token 的视觉摘要喂给 LLM。总共 188M 参数,在接触 LLM 之前,已经用对比、匹配和生成三种目标训过了。

## 概念

### 可学习查询

Q-Former 的核心戏法:不让 LLM 的文本 token 去 attend 图像 patch,而是引入一组新的 32 个可学习查询向量 `Q`,让*它们*去 attend 图像 patch。查询是模型参数——训练中学出来,对每张图都用同样这 32 个查询。

交叉注意力之后,每个查询都装着图像的一份压缩摘要——"描述主体"、"描述背景"、"数物体"之类。查询并不真的按语义标签分工;它们学到的是任何能让下游损失下降的编码。

### 架构

Q-Former 是一个小 Transformer(12 层,约 1 亿参数),有两条通路:

1. 查询通路:32 个查询向量先过自注意力(彼此之间),再对冻结 ViT 的 patch token 做交叉注意力,然后过 FFN。
2. 文本通路:一个 BERT 式文本编码器,与查询通路共享自注意力和 FFN 权重。文本通路不做交叉注意力。

训练时两条通路都跑。查询与文本通过共享自注意力交互,意味着查询可以按文本条件化,服务有需要的任务(ITM、ITG)。VLM 交接的推理时刻,只有查询流过,产出 32 个视觉 token。

### 两阶段训练

BLIP-2 的预训练分两阶段:

第 1 阶段:表示学习(不碰 LLM)。三个损失:

- ITC(图文对比):CLIP 式对比,在池化查询 token 与文本 CLS token 之间。
- ITM(图文匹配):二分类器——这对图文配不配?带硬负样本挖掘。
- ITG(图像条件文本生成):文本上的因果 LM 头,以查询为条件。逼查询编码"能被文本生成出来"的内容。

只有 Q-Former 在训练,ViT 冻结,LLM 不参与。

第 2 阶段:生成学习。接上冻结 LLM(OPT-2.7B 或 Flan-T5-XL 等)。用一个小线性层把 32 个查询输出投影到 LLM 嵌入维度,拼在文本提示前面。只训练线性投影和 Q-Former,在 提示 + 图像 + 描述 的拼接序列上做 LM 损失。

第 2 阶段结束后,Q-Former + 投影就是完整的视觉适配器。推理路径:图像 → ViT → Q-Former → 线性投影 → 拼到文本前 → 冻结 LLM 产出回答。

### 参数经济学

BLIP-2 = ViT-g/14(11 亿,冻结)+ OPT-6.7B(67 亿,冻结)+ Q-Former(1.88 亿,训练)= 全栈 80 亿参数,训练的只有 1.88 亿。Q-Former 自己只占全栈参数的约 2.4%。训练成本随之:几张 A100 上几天,而不是端到端的几周。

质量上,BLIP-2 在零样本 VQA 上追平或击败 Flamingo-80B,而体积只有 1/50。桥,是管用的。

### InstructBLIP 与指令感知的 Q-Former

InstructBLIP(2023)给 Q-Former 加了一个额外输入:指令文本本身。交叉注意力时,查询现在同时看得见图像 patch 和指令,于是可以按指令分工("数有几辆车"、"描述一下氛围"),而不是学一份固定摘要。留出任务上的基准成绩因此提升。

### MiniGPT-4 与纯投影做法

MiniGPT-4 保留了 Q-Former,但只训练输出端的线性投影,其余全冻结。便宜,但代价是质量——查询是 BLIP-2 学出来的,不是你的。适合快速迭代,不是最佳架构。

### 为什么 LLaVA 选了更简单的路

LLaVA(2023,第 12.05 课)把 Q-Former 换成了一个朴素的 2 层 MLP,把每个 ViT patch token 投影到 LLM 空间——24x24 网格就是 576 个 token,全喂给 LLM。压缩更差,但 LLM 能 attend 原始 patch。当时这还有争议;到 2023 年底它成了主流,因为视觉指令数据(LLaVA-Instruct-150k)证明 MLP 也能训练到保留足够信号。取舍是:LLaVA 的上下文塞得更快,但它天然扩展到多图与视频。

到 2026 年,领域分两派:token 预算紧张的场景(长视频、多图)Q-Former 仍然存活;追求每 token 质量的场景,MLP 投影器占主导。

### 门控交叉注意力:前辈 Flamingo

Flamingo(第 12.04 课)早于 BLIP-2,用的是同样的交叉注意力思想,但加在冻结 LLM 的*每一层*,而不是单独一座桥。BLIP-2 证明只在输入层做一次压缩也能成立。Gemini 和 Idefics 两者结合:交错输入 token,外加可选的门控交叉注意力做上下文少样本。

### 2026 年的后代们

- Q-Former:BLIP-2、InstructBLIP、MiniGPT-4,以及多数出于 token 预算考虑的视频-语言模型。
- Perceiver resampler:Flamingo 的变体(第 12.04 课);Idefics 家族、Eagle、OmniMAE。
- MLP 投影器:LLaVA、LLaVA-NeXT、LLaVA-OneVision、Cambrian-1。
- 注意力池化:VILA、PaliGemma。

四种都成立。决定性问题是:你受限于 token 预算,还是每 token 的质量。

```figure
modality-projection
```

## 投入使用

`code/main.py` 用标准库搭一个 Q-Former 式交叉注意力:

1. 模拟 256 个图像 patch token(128 维)。
2. 实例化 32 个可学习查询(128 维)。
3. 跑缩放点积交叉注意力(Q 来自查询,K/V 来自 patch)。
4. 经线性层投影到 LLM 维度(512)。
5. 输出 32 个 LLM 就绪的视觉 token。

全部数学用纯 Python(向量上的嵌套循环)。玩具规模,形状正确。注意力权重矩阵会打印出来,你能看到每个查询从哪些 patch 取了信息。

## 交付

本课产出 `outputs/skill-modality-bridge-picker.md`。给定目标 VLM 配置(视觉编码器 token 数、LLM 上下文预算、部署约束、质量目标),在 Q-Former / MLP / Perceiver resampler 中给出推荐,附简短理由和每种桥的参数量估算。

## 练习

1. 用 PyTorch 实现交叉注意力块。验证:32 个查询、256 个键/值时,注意力权重矩阵是 32 x 256,softmax 后每行和为 1。

2. BLIP-2 第 1 阶段,Q-Former 同时跑三个损失:ITC、ITM、ITG。用伪代码写出每个的前向签名。哪个需要文本编码器通路处于激活状态?

3. 对比参数量:Q-Former(12 层、隐藏 768)vs 2 层 MLP 投影器(1408 → 4096,两层)。LLM 规模到多大时,188M 的 Q-Former 成本能在训练效率上回本?

4. 读 BLIP-2 论文(arXiv:2301.12597)第 3.2 节,关于 Q-Former 如何初始化。解释为什么从 BERT-base 初始化(而非随机)能加速收敛。

5. 一段 10 分钟视频,按 1 FPS 抽 60 帧。分别计算每帧 token 成本:(Q-Former → 32 token/帧)vs(MLP 投影器 → 576 token/帧)。哪个装得进 12.8 万 token 的 LLM 上下文窗口?

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|----------------|------------------------|
| Q-Former | "查询 Transformer" | 带 32 个可学习查询向量的小 Transformer,对冻结 ViT 特征做交叉注意力 |
| 可学习查询 | "视觉版软提示" | 一组固定参数,充当交叉注意力的查询侧;按模型学习,所有输入共享 |
| 交叉注意力 | "Q 从这来,K/V 从那来" | query、key、value 来自不同来源的注意力;查询靠它从 ViT patch 取信息 |
| ITC | "图文对比" | 作用在 Q-Former 池化查询与文本 CLS 之间的 CLIP 式损失 |
| ITM | "图文匹配" | 对硬负样本挖掘的配对做二分类;逼查询区分细粒度不匹配 |
| ITG | "图像条件文本生成" | 以查询为条件生成文本的因果 LM 损失;逼查询编码可被文本解码的内容 |
| 两阶段预训练 | "先表示后生成" | 第 1 阶段单训 Q-Former(ITC/ITM/ITG);第 2 阶段接冻结 LLM,只训投影 + Q-Former |
| 冻结骨干 | "不微调" | 视觉编码器与 LLM 权重固定;只有桥在训练 |
| 投影头 | "到 LLM 维度的线性层" | 把 Q-Former 输出映射到 LLM 嵌入维度的最终线性层 |
| Perceiver resampler | "Flamingo 的版本" | 类似的可学习查询交叉注意力,Flamingo 用在每一层而不是单独一座桥 |

## 延伸阅读

- [Li et al. — BLIP-2 (arXiv:2301.12597)](https://arxiv.org/abs/2301.12597) — 核心论文。
- [Li et al. — BLIP (arXiv:2201.12086)](https://arxiv.org/abs/2201.12086) — 前身,提出 ITC/ITM/ITG 三件套。
- [Li et al. — ALBEF (arXiv:2107.07651)](https://arxiv.org/abs/2107.07651) — "先对齐再融合",第 1 阶段训练的思想祖先。
- [Dai et al. — InstructBLIP (arXiv:2305.06500)](https://arxiv.org/abs/2305.06500) — 指令感知 Q-Former。
- [Zhu et al. — MiniGPT-4 (arXiv:2304.10592)](https://arxiv.org/abs/2304.10592) — 纯投影做法。
- [Jaegle et al. — Perceiver IO (arXiv:2107.14795)](https://arxiv.org/abs/2107.14795) — 可学习查询交叉注意力的通用架构。
