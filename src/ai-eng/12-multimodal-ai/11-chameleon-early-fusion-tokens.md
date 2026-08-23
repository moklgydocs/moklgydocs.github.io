# Chameleon 与早期融合的纯 token 多模态模型

> 此前见过的所有 VLM,都把图像和文本分开放:视觉 token 出自视觉编码器,流过投影器,然后在 LLM 内部与文本相遇。视觉词表和文本词表从不相交。Chameleon(Meta, 2024 年 5 月)问:如果相交呢?训一个 VQ-VAE,把图像变成共享词表中的离散 token 序列。于是每份多模态文档都是一条序列——文本 token 与图像 token 交错,一个自回归损失。附带效果:模型能生成混合模态输出——一次推理调用里,文本与图像 token 交替出现。本课精读早期融合的主张,并端到端搭一个玩具版。

**类型:** 动手构建
**编程语言:** Python(标准库,VQ-VAE 分词器 + 交错解码器)
**前置要求:** 第 12 阶段第 05 课、第 8 阶段(生成式 AI)
**预计耗时:** 约 180 分钟

## 学习目标

- 解释为什么共享词表 + 单一损失会改变模型能做的事。
- 描述 VQ-VAE 如何把图像分词成与 Transformer next-token 目标兼容的离散序列。
- 说出 Chameleon 的训练稳定技巧:QK-Norm、dropout 放置、LayerNorm 顺序。
- 对比 Chameleon 与 BLIP-2 的 Q-Former 路线,说明各自何时是正确选择。

## 问题

适配器式 VLM(LLaVA、BLIP-2、Qwen-VL)把文本和图像当两样东西:文本 token 走 `embed(text_token)`;图像走 `visual_encoder(image) → projector → ... 伪token`。模型有两条输入路径,中途才汇合。

三个后果:

1. LLM 只能消费图像,不能产出图像。输出只能是文本。
2. 混合模态文档(像文章那样段落与图片交替)很别扭——要么在模型外解析多模态输入,要么串联多次生成。
3. 分布不匹配。视觉 token 和文本 token 住在隐空间的不同区域,埋下微妙的对齐问题。

Chameleon 拒绝这个前提:图像不过是共享词表里的离散 token 序列。在交错文档上训练,一个损失、一个自回归解码器,混合模态生成能力免费解锁。

## 概念

### VQ-VAE 作为图像分词器

这个分词器是向量量化变分自编码器。架构:

- 编码器:CNN + ViT,把图像映射到空间特征图,比如 32x32 个 256 维特征。
- 码本:K 个可学习向量(Chameleon 用 8192 个),同样 256 维。
- 量化:对每个空间特征,按 L2 距离找最近码本条目,用整数索引替换连续特征。
- 解码器:CNN,把量化特征还原回像素。

训练:VAE 重建损失 + 承诺损失 + 码本损失。码本索引构成图像的离散字母表。

对 Chameleon:一张图变成 32*32 = 1024 个 token,出自 8192 大小的词表。与文本 token(LLM 的 BPE 词表,比如 32000)拼接。最终词表:40192。Transformer 看到一条序列、一个损失。

### 共享词表

Chameleon 的词表合并了文本 token、图像 token 和模态分隔符。每个 token 有唯一 ID。输入嵌入层把每个 ID 映射到 D 维隐向量;输出投影把隐向量映射回词表 logits。softmax 选下一个 token——不管是什么模态。

分隔符很关键:`<image>` 和 `</image>` 标签把图像 token 序列括起来。生成时,模型一旦输出 `<image>`,下游软件就知道接下来 1024 个 token 是要送去解码器渲染像素的 VQ 索引。

### 混合模态生成

推理就是共享词表上的 next-token 预测。示例提示:"Draw a cat and describe it." Chameleon 输出:

```
<image> 4821 1029 2891 ... (1024 image tokens) </image>
The cat is orange, sitting on a windowsill...
```

模型自主决定顺序——可以先图后文、先文后图,或交替。同一个解码器,同一个损失。

对比一下:适配器 VLM 的生成只能是文本。Chameleon 重新打开了"模型能输出什么模态"这个问题。

### 训练稳定性 —— QK-Norm、dropout、LayerNorm 顺序

早期融合训练在规模上不稳定。Chameleon 论文记录了三个技巧:

- **QK-Norm。** 在注意力内部,对 query 和 key 投影先过 LayerNorm 再算点积。防止深层处 logit 幅度爆炸。2024 年后多个大模型在用。
- **Dropout 放置。** 每个残差相加之后都放 dropout,不只是在注意力和 MLP 之后。图像 token 的梯度可能占主导,需要更多正则。
- **LayerNorm 顺序。** 残差分支用 pre-LN(标准做法),另外在最后一个 block 的跳跃连接上再加一层 LN。稳定末层梯度流。

没有这些技巧,340 亿参数的 Chameleon 训练在多个检查点发散;有了它们,就能收敛。训练配方与架构本身,是同等重要的贡献。

### 分词器的重建天花板

VQ-VAE 是有损的。8192 码本、每张 512x512 图 1024 token 的配置下,重建 PSNR 封顶约 26–28 dB。生成能认得出内容的图像够了,但明显不如连续空间扩散(Stable Diffusion 3 能到 32+ dB)。

瓶颈在分词器。更好的分词器(MAGVIT-v2、IBQ、SBER-MoVQGAN)能抬高天花板。Emu3(第 12.12 课)单凭更好的分词器就做到了 SDXL 级生成质量。

### Chameleon vs BLIP-2 / LLaVA

Chameleon(早期融合,共享词表):

- 一个损失,一个解码器。
- 生成混合模态输出。
- 分词器是质量天花板。
- 贵:推理路径上每张生成图都要过 VQ-VAE 解码器。

BLIP-2 / LLaVA(晚期融合,分离双塔):

- 视觉进,文本出。
- 复用预训练 LLM。
- 理解任务没有分词器瓶颈。
- 便宜:单次前向。

按任务选。要做图像生成,选 Chameleon 家族;只要理解,适配器 VLM 更简单,复用的预训练算力也更多。

### Fuyu 与 AnyGPT

Fuyu(Adept, 2023)是相关路线:干脆不要独立视觉编码器,把原始图像 patch 直接过 LLM 的输入投影,就当它们是 token,连分词器都不用。比 Chameleon 更简单,但失去了共享词表的输出生成。

AnyGPT(Zhan et al., 2024)把 Chameleon 扩到四种模态:文本、图像、语音、音乐。每种都用同样的 VQ-VAE 戏法,共享 Transformer。任意到任意生成。第 12.16 课详讲。

```figure
vq-codebook
```

## 投入使用

`code/main.py` 搭一个端到端玩具早期融合模型:

- 迷你 VQ-VAE 式量化器,把 8x8 patch 映射到码本索引(K=16)。
- 共享词表:(文本 id 0..31)+ (图像 id 32..47)+ (分隔符 48, 49)。
- 玩具自回归解码器(bigram 表),在合成的 标注 + 图像token 序列上训练。
- 采样循环:给定提示,交替输出文本与图像 token。

代码故意把 Transformer 压到最小(bigram),让你能端到端追踪信号流。

## 交付

本课产出 `outputs/skill-tokenizer-vs-adapter-picker.md`。给定产品规格(只要理解 vs 理解+生成、所需图像质量、成本预算),在 Chameleon 家族(早期融合)与 LLaVA 家族(晚期融合)之间做选择,并用量化经验法则论证。

## 练习

1. Chameleon 用 K=8192 码本、每张 512x512 图 1024 token。估算对 24 位 RGB 图像的压缩比。有损吗?损多少?

2. 一张 4K 图(3840x2160)按同样的 VQ-VAE 密度,产出多少图像 token?Chameleon 式模型能在一次推理调用里生成 4K 图吗?先崩的是什么——上下文、分词器质量,还是 KV cache?

3. 用纯 Python 实现 QK-Norm。给定 64 维 query 和 key,展示 LayerNorm 前后的点积。为什么深层处幅度控制很重要?

4. 读 Chameleon 第 2.3 节训练稳定性。描述论文在 34B 规模、无 QK-Norm 时观察到的确切失败模式。"范数爆炸"的特征是什么?

5. 扩展玩具解码器:给定纯文本提示,输出混合模态回答。在训练数据分布为 60% 先文 / 40% 先图时,测量模型选先图与先文的频率。

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|-----------------|------------------------|
| 早期融合 | "统一 token" | 图像转成与 Transformer 共享词表的离散 token,从第一步起 |
| VQ-VAE | "图像分词器" | CNN + ViT + 码本,把图像映射成 Transformer 可预测的整数索引 |
| 共享词表 | "一本词典" | 覆盖 文本 + 图像 + 模态分隔符 的单一 token ID 空间 |
| QK-Norm | "注意力稳定器" | 点积之前对 query 和 key 施加 LayerNorm,防止范数爆炸 |
| 混合模态生成 | "文 + 图输出" | 一次前向中自主产出交错文本与图像 token 的推理 |
| 码本大小 | "K 个条目" | VQ-VAE 能量化到的离散向量数;压缩率与保真度的权衡 |
| 分词器天花板 | "重建极限" | 解码 VQ token 能达到的最高 PSNR;给模型图像质量封顶 |

## 延伸阅读

- [Chameleon Team — Chameleon: Mixed-Modal Early-Fusion Foundation Models (arXiv:2405.09818)](https://arxiv.org/abs/2405.09818)
- [Aghajanyan et al. — CM3 (arXiv:2201.07520)](https://arxiv.org/abs/2201.07520)
- [Yu et al. — CM3Leon (arXiv:2309.02591)](https://arxiv.org/abs/2309.02591)
- [Zhan et al. — AnyGPT (arXiv:2402.12226)](https://arxiv.org/abs/2402.12226)
- [Adept — Fuyu-8B blog (adept.ai)](https://www.adept.ai/blog/fuyu-8b)
