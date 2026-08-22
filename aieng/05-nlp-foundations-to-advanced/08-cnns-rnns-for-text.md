# 文本 CNN 与 RNN

> 卷积学 n-gram,循环网络有记忆。两者都被注意力取代,但在受限硬件上依然重要。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 3 阶段 · 11(PyTorch 入门),第 5 阶段 · 03(词嵌入),第 4 阶段 · 02(从零实现卷积)
**预计耗时:** 约 75 分钟

## 问题

TF-IDF 和 Word2Vec 产出的是忽略词序的扁平向量:建立在它们之上的分类器,分不出 `dog bites man` 和 `man bites dog`。而词序有时恰恰承载信号。

在 Transformer 到来之前,有两个架构家族补上了这个缺口。

**文本卷积网络(TextCNN)。** 在词嵌入序列上施加一维卷积:宽度为 3 的滤波器就是一个可学习的三元组检测器——它横跨三个词,输出一个分数。堆叠不同宽度(2、3、4、5)就能检测多尺度模式,再做最大池化得到定长表示。扁平、并行、快。

**循环网络(RNN、LSTM、GRU)。** 一次处理一个 token,维护一个把信息向前传递的隐藏状态。串行、带记忆、输入长度灵活。2014 到 2017 年统治序列建模,然后注意力来了。

本课把两者都构建出来,然后点名那个催生了注意力机制的失效。

## 概念

**TextCNN**(Kim, 2014):token 先被嵌入;宽度为 `k` 的一维卷积让滤波器滑过连续的 k 元嵌入组,产出特征图;对特征图做全局最大池化,取最强激活;把几种宽度的池化输出拼接起来,喂给分类头。

为什么有效:一个滤波器就是一个可学习的 n-gram;最大池化与位置无关,所以 "not good" 出现在评论开头还是中间,都会触发同一个特征。三种宽度各配 100 个滤波器,就是 300 个学出来的 n-gram 检测器。训练完全并行,没有串行依赖。

**RNN。** 每个时间步 `t`,隐藏状态 `h_t = f(W * x_t + U * h_{t-1} + b)`。`W`、`U`、`b` 在时间上共享。时刻 `T` 的隐藏状态就是整个前缀的摘要。做分类时,在 `h_1 ... h_T` 上池化(最大、平均或取最后一个)。

朴素 RNN 受梯度消失之苦。**LSTM** 加了门:决定遗忘什么、存储什么、输出什么,让长序列上的梯度稳定下来。**GRU** 把 LSTM 简化成两个门,参数更少,表现相当。

**双向 RNN** 一个正向跑、一个反向跑,拼接隐藏状态。每个 token 的表示同时看到左右两边的上下文——对序列标注任务必不可少。

```figure
rnn-unroll
```

## 动手构建

### 第 1 步:PyTorch 实现 TextCNN

```python
import torch
import torch.nn as nn
import torch.nn.functional as F


class TextCNN(nn.Module):
    def __init__(self, vocab_size, embed_dim, n_classes, filter_widths=(2, 3, 4), n_filters=64, dropout=0.3):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.convs = nn.ModuleList([
            nn.Conv1d(embed_dim, n_filters, kernel_size=k)
            for k in filter_widths
        ])
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(n_filters * len(filter_widths), n_classes)

    def forward(self, token_ids):
        x = self.embed(token_ids).transpose(1, 2)
        pooled = []
        for conv in self.convs:
            c = F.relu(conv(x))
            p = F.max_pool1d(c, c.size(2)).squeeze(2)
            pooled.append(p)
        h = torch.cat(pooled, dim=1)
        return self.fc(self.dropout(h))
```

`transpose(1, 2)` 把 `[batch, seq_len, embed_dim]` 变成 `[batch, embed_dim, seq_len]`,因为 `nn.Conv1d` 把中间轴当通道。池化后的输出是定长的,与输入长度无关。

### 第 2 步:LSTM 分类器

```python
class LSTMClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, n_classes, bidirectional=True, dropout=0.3):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True, bidirectional=bidirectional)
        factor = 2 if bidirectional else 1
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_dim * factor, n_classes)

    def forward(self, token_ids):
        x = self.embed(token_ids)
        out, _ = self.lstm(x)
        pooled = out.max(dim=1).values
        return self.fc(self.dropout(pooled))
```

在序列上做最大池化,而不是取最后状态:做分类时,最大池化通常胜过取最后一个隐藏状态,因为长序列尾部的信息往往会主导最后状态。

### 第 3 步:梯度消失演示(直觉)

不带门控的朴素 RNN 学不会长距离依赖。看一个玩具任务:预测 token `A` 是否在序列中出现过。如果 `A` 在第 1 位而序列长 100,损失传来的梯度要倒着流过 99 次循环权重乘法。权重小于 1,梯度消失;大于 1,梯度爆炸。

```python
def vanishing_gradient_sim(seq_len, recurrent_weight=0.9):
    import math
    return math.pow(recurrent_weight, seq_len)


# At weight=0.9 over 100 steps:
#   0.9 ^ 100 ≈ 2.7e-5
# The gradient from step 100 to step 1 is effectively zero.
```

LSTM 用**细胞状态**(cell state)修复了这个问题:细胞状态贯穿网络,只做加性交互(遗忘门对它做乘性缩放,但梯度仍能沿这条"高速公路"流动)。GRU 用更少的参数做了类似的事。两者都能让 100 步以上的序列稳定训练。

### 第 4 步:为什么这还不够

即便有了 LSTM,三个问题依然存在。

1. **串行瓶颈。** 在长度 1000 的序列上训练 RNN,需要 1000 次串行的前向/反向步,无法沿时间维并行。
2. **编码器-解码器结构中的定长上下文向量。** 解码器只能看到编码器的最后一个隐藏状态——整个输入被压缩进一个向量,长输入丢细节。第 09 课直接讲这个问题。
3. **远距离依赖的准确率天花板。** LSTM 胜过朴素 RNN,但要把特定信息传播 200 步以上仍然吃力。

注意力把三个问题全解决了:Transformer 干脆抛弃了循环。第 10 课就是那个转折点。

## 投入使用

PyTorch 的 `nn.LSTM`、`nn.GRU`、`nn.Conv1d` 都是生产级,训练代码是标准写法。

Hugging Face 提供预训练嵌入,可直接插作输入层:

```python
from transformers import AutoModel

encoder = AutoModel.from_pretrained("bert-base-uncased")
for param in encoder.parameters():
    param.requires_grad = False


class BertCNN(nn.Module):
    def __init__(self, n_classes, filter_widths=(2, 3, 4), n_filters=64):
        super().__init__()
        self.encoder = encoder
        self.convs = nn.ModuleList([nn.Conv1d(768, n_filters, kernel_size=k) for k in filter_widths])
        self.fc = nn.Linear(n_filters * len(filter_widths), n_classes)

    def forward(self, input_ids, attention_mask):
        with torch.no_grad():
            out = self.encoder(input_ids=input_ids, attention_mask=attention_mask).last_hidden_state
        x = out.transpose(1, 2)
        pooled = [F.max_pool1d(F.relu(conv(x)), kernel_size=conv(x).size(2)).squeeze(2) for conv in self.convs]
        return self.fc(torch.cat(pooled, dim=1))
```

"什么约束用什么方案"清单:

- **边缘/端上推理。** TextCNN 配 GloVe 嵌入比 Transformer 小 10–100 倍。部署目标是手机,就用这套。
- **流式/在线分类。** RNN 一次处理一个 token;Transformer 需要完整序列。实时进来的文本,LSTM 仍然赢。
- **快速基线小模型。** 新任务上快速迭代:CPU 上 5 分钟训一个 TextCNN。
- **有限数据下的序列标注。** BiLSTM-CRF(第 06 课)在 1 千到 1 万条标注句子下仍是生产级 NER 架构。

其余一切,上 Transformer。

## 交付

保存为 `outputs/prompt-text-encoder-picker.md`:

```markdown
---
name: text-encoder-picker
description: Pick a text encoder architecture for a given constraint set.
phase: 5
lesson: 08
---

Given constraints (task, data volume, latency budget, deploy target, compute budget), output:

1. Encoder architecture: TextCNN, BiLSTM, BiLSTM-CRF, transformer fine-tune, or "use a pretrained transformer as a frozen encoder + small head".
2. Embedding input: random init, GloVe / fastText frozen, or contextualized transformer embeddings.
3. Training recipe in 5 lines: optimizer, learning rate, batch size, epochs, regularization.
4. One monitoring signal. For RNN/CNN models: attention mechanism absence means they miss long-range deps; check per-length accuracy. For transformers: fine-tuning collapse if LR too high; check train loss.

Refuse to recommend fine-tuning a transformer when data is under ~500 labeled examples without showing that a TextCNN / BiLSTM baseline has plateaued. Flag edge deployment as needing architecture-before-everything.
```

## 练习

1. **简单。** 在一个三类玩具数据集(自己造数据)上训练 TextCNN,验证滤波器宽度 (2, 3, 4) 的组合在平均 F1 上优于单一宽度 (3)。
2. **中等。** 为 LSTM 分类器实现最大池化、平均池化和最后状态池化三种方案,在小数据集上对比,记录哪种池化胜出并给出你的假设。
3. **困难。** 构建 BiLSTM-CRF NER 标注器(结合第 06 课与本课),在 CoNLL-2003 上训练,与第 06 课的纯 CRF 基线和 BERT 微调对比,报告训练时间、显存占用和 F1。

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|-----------------|-----------------------|
| TextCNN | 文本 CNN | 词嵌入上的一维卷积堆叠加全局最大池化,Kim (2014) |
| RNN | 循环网络 | 每步更新隐藏状态:`h_t = f(W x_t + U h_{t-1})` |
| LSTM | 带门的 RNN | 加输入/遗忘/输出门和细胞状态,长序列上训练稳定 |
| GRU | 简化版 LSTM | 两个门代替三个,准确率相当、参数更少 |
| 双向(Bidirectional) | 两个方向 | 正向加反向 RNN 拼接,每个 token 同时看到两侧上下文 |
| 梯度消失(Vanishing gradient) | 训练信号死了 | 朴素 RNN 中反复乘以小于 1 的权重,早期步的梯度实际上归零 |

## 延伸阅读

- [Kim, Y. (2014). Convolutional Neural Networks for Sentence Classification](https://arxiv.org/abs/1408.5882)——TextCNN 论文,八页,易读
- [Hochreiter, S. and Schmidhuber, J. (1997). Long Short-Term Memory](https://www.bioinf.jku.at/publications/older/2604.pdf)——LSTM 原始论文,出乎意料地清晰
- [Olah, C. (2015). Understanding LSTM Networks](https://colah.github.io/posts/2015-08-Understanding-LSTMs/)——让所有人看懂 LSTM 的那套图
