# 序列到序列模型

> 两个 RNN 假装自己是翻译器。它们撞上的瓶颈,就是注意力机制存在的理由。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 5 阶段 · 08(文本 CNN 与 RNN),第 3 阶段 · 11(PyTorch 入门)
**预计耗时:** 约 75 分钟

## 问题

分类把变长序列映射到一个标签;翻译把变长序列映射到另一个变长序列。输入和输出活在不同的词表里,可能是不同的语言,长度也没有任何对齐保证。

seq2seq 架构(Sutskever、Vinyals、Le,2014)用一个刻意简单的配方破解了这个问题:两个 RNN——一个读源句子,产出一个定长上下文向量;另一个读这个向量,逐个 token 生成目标句子。代码就是你在第 08 课写过的那些,只是换种方式粘起来。

它值得学,有两个原因。第一,上下文向量瓶颈是 NLP 里教学价值最高的一次失败——注意力和 Transformer 擅长的一切都由它而来。第二,这套训练配方(teacher forcing、scheduled sampling、推理时的 beam search)至今适用于每一个现代生成系统,包括 LLM。

## 概念

**编码器。** 一个读源句子的 RNN。它的最后隐藏状态就是**上下文向量**——对整个输入的定长摘要,理论上除了源句信息什么都不丢。

**解码器。** 另一个 RNN,用上下文向量初始化。每一步:输入上一步生成的 token,输出目标词表上的分布;采样或 argmax 选出下一个 token,喂回去,重复,直到产出 `<EOS>` 或达到最大长度。

**训练:** 解码器每步算交叉熵损失,沿序列求和,沿时间对两个网络做标准反向传播。

**Teacher forcing(教师强制)。** 训练时,解码器第 `t` 步的输入是位置 `t-1` 的*真值* token,而不是解码器自己上一步的预测。这让训练稳定——没有它,早期的错误会级联放大,模型永远学不会。但推理时你只能用自己的预测,于是训练和推理之间永远存在分布差距,这个差距叫**暴露偏差(exposure bias)**。

**瓶颈。** 编码器对源句学到的一切,都必须挤进那一个上下文向量。长句子丢细节,罕见词被磨平,语序调整(chat noir vs. black cat)只能靠死记,而不是算出来。

注意力(第 10 课)的修法:让解码器看到编码器的*每一个*隐藏状态,而不只是最后一个。这就是全部的卖点。

```figure
lstm-gates
```

## 动手构建

### 第 1 步:编码器

```python
import torch
import torch.nn as nn


class Encoder(nn.Module):
    def __init__(self, src_vocab_size, embed_dim, hidden_dim):
        super().__init__()
        self.embed = nn.Embedding(src_vocab_size, embed_dim, padding_idx=0)
        self.gru = nn.GRU(embed_dim, hidden_dim, batch_first=True)

    def forward(self, src):
        e = self.embed(src)
        outputs, hidden = self.gru(e)
        return outputs, hidden
```

`outputs` 形状为 `[batch, seq_len, hidden_dim]`——每个输入位置一个隐藏状态;`hidden` 形状为 `[1, batch, hidden_dim]`——最后一步。第 08 课说"分类时在 outputs 上池化";这里我们把最后隐藏状态留作上下文向量,逐步输出则弃之不用。

### 第 2 步:解码器

```python
class Decoder(nn.Module):
    def __init__(self, tgt_vocab_size, embed_dim, hidden_dim):
        super().__init__()
        self.embed = nn.Embedding(tgt_vocab_size, embed_dim, padding_idx=0)
        self.gru = nn.GRU(embed_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, tgt_vocab_size)

    def forward(self, token, hidden):
        e = self.embed(token)
        out, hidden = self.gru(e, hidden)
        logits = self.fc(out)
        return logits, hidden
```

解码器一次被调用一步:输入是一批单个 token 和当前隐藏状态,输出是下一个 token 的词表 logits 和更新后的隐藏状态。

### 第 3 步:带 teacher forcing 的训练循环

```python
def train_batch(encoder, decoder, src, tgt, bos_id, optimizer, teacher_forcing_ratio=0.9):
    optimizer.zero_grad()
    _, hidden = encoder(src)
    batch_size, tgt_len = tgt.shape
    input_token = torch.full((batch_size, 1), bos_id, dtype=torch.long)
    loss = 0.0
    loss_fn = nn.CrossEntropyLoss(ignore_index=0)

    for t in range(tgt_len):
        logits, hidden = decoder(input_token, hidden)
        step_loss = loss_fn(logits.squeeze(1), tgt[:, t])
        loss += step_loss
        use_teacher = torch.rand(1).item() < teacher_forcing_ratio
        if use_teacher:
            input_token = tgt[:, t].unsqueeze(1)
        else:
            input_token = logits.argmax(dim=-1)

    loss.backward()
    optimizer.step()
    return loss.item() / tgt_len
```

两个值得点名的旋钮:`ignore_index=0` 跳过 padding 位置的损失;`teacher_forcing_ratio` 是每一步使用真值 token 而非模型预测的概率。从 1.0(完全 teacher forcing)开始,训练中逐渐退火到约 0.5,弥合暴露偏差的差距。

### 第 4 步:推理循环(贪心)

```python
@torch.no_grad()
def greedy_decode(encoder, decoder, src, bos_id, eos_id, max_len=50):
    _, hidden = encoder(src)
    batch_size = src.shape[0]
    input_token = torch.full((batch_size, 1), bos_id, dtype=torch.long)
    output_ids = []
    for _ in range(max_len):
        logits, hidden = decoder(input_token, hidden)
        next_token = logits.argmax(dim=-1)
        output_ids.append(next_token)
        input_token = next_token
        if (next_token == eos_id).all():
            break
    return torch.cat(output_ids, dim=1)
```

贪心解码每步选概率最高的 token,但它可能走岔:一旦选定一个 token,就收不回来了。**Beam search(束搜索)** 同时保留前 `k` 条部分序列,最后选出总分最高的完整序列。束宽 3–5 是标准配置。

### 第 5 步:瓶颈,实证

在玩具复制任务上训练:源 `[a, b, c, d, e]`,目标 `[a, b, c, d, e]`。增加序列长度,观察准确率。

```
seq_len=5   copy accuracy: 98%
seq_len=10  copy accuracy: 91%
seq_len=20  copy accuracy: 62%
seq_len=40  copy accuracy: 23%
```

单个 GRU 隐藏状态无法无损记住 40 个 token 的输入。信息在编码器的每一步都在,但解码器只看得到最后状态。注意力直接修复这一点。

## 投入使用

PyTorch 有 `nn.Transformer` 和基于 `nn.LSTM` 的 seq2seq 模板。Hugging Face 的 `transformers` 库提供在数十亿 token 上训练好的完整编码器-解码器模型(BART、T5、mBART、NLLB)。

```python
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

tok = AutoTokenizer.from_pretrained("facebook/bart-base")
model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-base")

src = tok("Translate this to French: Hello, how are you?", return_tensors="pt")
out = model.generate(**src, max_new_tokens=50, num_beams=4)
print(tok.decode(out[0], skip_special_tokens=True))
```

现代编码器-解码器把 RNN 换成了 Transformer,但高层形状(编码器、解码器、逐 token 生成)与 2014 年的 seq2seq 论文一模一样,变的只是每个方块内部的机制。

### 什么时候还该用 RNN 版 seq2seq

新项目几乎永远不用。具体的例外:

- 流式翻译:一次消费一个输入 token,内存有界。
- 端上文本生成:Transformer 的内存开销不可接受。
- 教学:理解编码器-解码器瓶颈,是理解 Transformer 为何胜出的最短路径。

### 暴露偏差及其缓解

- **Scheduled sampling(计划采样)。** 训练中退火 teacher forcing 比例,让模型学会从自己的错误中恢复。
- **最小风险训练(Minimum risk training)。** 在句子级 BLEU 分数上训练,而不是 token 级交叉熵——更接近你真正想要的东西。
- **强化学习微调。** 用指标奖励序列生成器,现代 LLM 的 RLHF 就是这么做的。

这三条对基于 Transformer 的生成依然适用。

## 交付

保存为 `outputs/prompt-seq2seq-design.md`:

```markdown
---
name: seq2seq-design
description: Design a sequence-to-sequence pipeline for a given task.
phase: 5
lesson: 09
---

Given a task (translation, summarization, paraphrase, question rewrite), output:

1. Architecture. Pretrained transformer encoder-decoder (BART, T5, mBART, NLLB) is the default. RNN-based seq2seq only for specific constraints.
2. Starting checkpoint. Name it (`facebook/bart-base`, `google/flan-t5-base`, `facebook/nllb-200-distilled-600M`). Match the checkpoint to task and language coverage.
3. Decoding strategy. Greedy for deterministic output, beam search (width 4-5) for quality, sampling with temperature for diversity. One sentence justification.
4. One failure mode to verify before shipping. Exposure bias manifests as generation drift on longer outputs; sample 20 outputs at the 90th-percentile length and eyeball.

Refuse to recommend training a seq2seq from scratch for under a million parallel examples. Flag any pipeline that uses greedy decoding for user-facing content as fragile (greedy repeats and loops).
```

## 练习

1. **简单。** 实现玩具复制任务:用 GRU seq2seq 在"目标等于源"的输入输出对上训练,测量长度 5、10、20 下的准确率,复现瓶颈现象。
2. **中等。** 加入束宽为 3 的 beam search 解码,在一个小型平行语料上与贪心解码对比 BLEU,记录 beam search 在哪些地方胜出(通常是靠后的 token)、哪些地方没有差别。
3. **困难。** 在一个 1 万对的释义数据集上微调 `facebook/bart-base`,在留出输入上对比微调模型与基座模型的 beam-4 输出,报告 BLEU 并挑 10 个例子做定性分析。

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|-----------------|-----------------------|
| 编码器(Encoder) | 输入 RNN | 读源句,产出逐步隐藏状态和最终上下文向量 |
| 解码器(Decoder) | 输出 RNN | 由上下文向量初始化,一次生成一个目标 token |
| 上下文向量(Context vector) | 那个摘要 | 编码器最后的隐藏状态,定长,注意力要解决的瓶颈 |
| Teacher forcing | 用真值 token | 训练时喂入真实的前一个 token,稳定学习 |
| 暴露偏差(Exposure bias) | 训练/测试差距 | 在真值 token 上训练的模型,从未练习过从自己的错误中恢复 |
| Beam search | 更好的解码 | 每步保留前 k 条部分序列,而不是贪心地下注一条 |

## 延伸阅读

- [Sutskever, Vinyals, Le (2014). Sequence to Sequence Learning with Neural Networks](https://arxiv.org/abs/1409.3215)——seq2seq 原始论文,四页
- [Cho et al. (2014). Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation](https://arxiv.org/abs/1406.1078)——提出了 GRU 和编码器-解码器框架
- [Bahdanau, Cho, Bengio (2014). Neural Machine Translation by Jointly Learning to Align and Translate](https://arxiv.org/abs/1409.0473)——注意力论文,本课之后立刻读
- [PyTorch NLP from Scratch tutorial](https://pytorch.org/tutorials/intermediate/seq2seq_translation_tutorial.html)——可动手的 seq2seq + 注意力代码
