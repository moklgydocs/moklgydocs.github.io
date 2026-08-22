# GloVe、FastText 与子词嵌入

> Word2Vec 给每个词训练一个嵌入;GloVe 分解了共现矩阵;FastText 嵌入词的零件;BPE 架起了通往 Transformer 的桥。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 5 阶段 · 03(从零实现 Word2Vec)
**预计耗时:** 约 45 分钟

## 问题

Word2Vec 留下了两个悬而未决的问题。

第一,当时还有一条并行的研究路线:直接分解共现矩阵(LSA、HAL),而不是做在线的 skip-gram 更新。Word2Vec 的迭代方法真的本质上更好,还是两者的差别只是处理计数方式不同造成的假象?**GloVe** 回答了这个问题:配上精心选择的损失函数,矩阵分解能追平甚至超过 Word2Vec,训练成本还更低。

第二,两种方法对从未见过的词都毫无办法:`Zoomer-approved`、`dogecoin`、上周刚造出来的任何专有名词、罕见词根的每一种变形。**FastText** 修复了这一点:它嵌入字符 n-gram——词是其组成部分之和,包括语素,于是词表外的词也能拿到合理的向量。

第三,Transformer 到来之后,问题再次变形:词级词表封顶在一百万条左右,而真实语言比这更开放。**字节对编码(BPE)** 及其同类解决了这个问题:学出一套高频子词单元组成的词表,覆盖一切。如今每一个现代 LLM 的分词器都是子词分词器。

本课把三者都走一遍,然后讲清何时该用哪个。

## 概念

**GloVe(全局向量)。** 构建词-词共现矩阵 `X`,`X[i][j]` 是词 `j` 出现在词 `i` 上下文中的次数。训练向量,使得 `v_i · v_j + b_i + b_j ≈ log(X[i][j])`。给损失加权,别让高频词对主导。完成。

**FastText。** 词是它的字符 n-gram 之和,再加上词本身:`where` 变成 `<wh, whe, her, ere, re>, <where>`。词向量就是这些分量向量之和,按 Word2Vec 的方式训练。好处:未见过的词(`whereupon`)可以从已知的 n-gram 组合出来。

**BPE(字节对编码)。** 从单个字节(或字符)组成的词表出发,统计语料中所有相邻对,把最高频的一对合并成新 token,重复 `k` 轮。结果:一个词表含 `k + 256` 个 token,高频序列(`ing`、`tion`、`the`)是单 token,罕见词被拆成熟悉的零件。任何句子都能被分词成某种东西。

```figure
n5-subword-merge
```

## 动手构建

### GloVe:分解共现矩阵

```python
import numpy as np
from collections import Counter


def build_cooccurrence(docs, window=5):
    pair_counts = Counter()
    vocab = {}
    for doc in docs:
        for token in doc:
            if token not in vocab:
                vocab[token] = len(vocab)
    for doc in docs:
        indexed = [vocab[t] for t in doc]
        for i, center in enumerate(indexed):
            for j in range(max(0, i - window), min(len(indexed), i + window + 1)):
                if i != j:
                    distance = abs(i - j)
                    pair_counts[(center, indexed[j])] += 1.0 / distance
    return vocab, pair_counts


def glove_train(vocab, pair_counts, dim=16, epochs=100, lr=0.05, x_max=100, alpha=0.75, seed=0):
    n = len(vocab)
    rng = np.random.default_rng(seed)
    W = rng.normal(0, 0.1, size=(n, dim))
    W_tilde = rng.normal(0, 0.1, size=(n, dim))
    b = np.zeros(n)
    b_tilde = np.zeros(n)

    for epoch in range(epochs):
        for (i, j), x_ij in pair_counts.items():
            weight = (x_ij / x_max) ** alpha if x_ij < x_max else 1.0
            diff = W[i] @ W_tilde[j] + b[i] + b_tilde[j] - np.log(x_ij)
            coef = weight * diff

            grad_W_i = coef * W_tilde[j]
            grad_W_tilde_j = coef * W[i]
            W[i] -= lr * grad_W_i
            W_tilde[j] -= lr * grad_W_tilde_j
            b[i] -= lr * coef
            b_tilde[j] -= lr * coef

    return W + W_tilde
```

两个值得点名的活动部件:加权函数 `f(x) = (x/x_max)^alpha` 给非常高频的词对(如 `(the, and)`)降权,免得它们主导损失;最终嵌入是 `W`(中心)和 `W_tilde`(上下文)两张表之和。两张相加是论文里发表过的技巧,通常优于只用一张。

### FastText:感知子词的嵌入

```python
def char_ngrams(word, n_min=3, n_max=6):
    wrapped = f"<{word}>"
    grams = {wrapped}
    for n in range(n_min, n_max + 1):
        for i in range(len(wrapped) - n + 1):
            grams.add(wrapped[i:i + n])
    return grams
```

```python
>>> char_ngrams("where")
{'<where>', '<wh', 'whe', 'her', 'ere', 're>', '<whe', 'wher', 'here', 'ere>', '<wher', 'where', 'here>'}
```

每个词由它的一组 n-gram(通常 3 到 6 个字符)表示,词嵌入是其 n-gram 嵌入之和。做 skip-gram 训练时,把这个和插到 Word2Vec 原来用单向量的位置即可。

```python
def fasttext_vector(word, ngram_table):
    grams = char_ngrams(word)
    vecs = [ngram_table[g] for g in grams if g in ngram_table]
    if not vecs:
        return None
    return np.sum(vecs, axis=0)
```

对未见过的词,只要它的部分 n-gram 是已知的,你仍能拿到向量:`whereupon` 与 `where` 共享 `<wh`、`her`、`ere` 和 `<where`,于是两者落得很近。

### BPE:学出来的子词词表

```python
def learn_bpe(corpus, k_merges):
    vocab = Counter()
    for word, freq in corpus.items():
        tokens = tuple(word) + ("</w>",)
        vocab[tokens] = freq

    merges = []
    for _ in range(k_merges):
        pair_freq = Counter()
        for tokens, freq in vocab.items():
            for a, b in zip(tokens, tokens[1:]):
                pair_freq[(a, b)] += freq
        if not pair_freq:
            break
        best = pair_freq.most_common(1)[0][0]
        merges.append(best)

        new_vocab = Counter()
        for tokens, freq in vocab.items():
            new_tokens = []
            i = 0
            while i < len(tokens):
                if i + 1 < len(tokens) and (tokens[i], tokens[i + 1]) == best:
                    new_tokens.append(tokens[i] + tokens[i + 1])
                    i += 2
                else:
                    new_tokens.append(tokens[i])
                    i += 1
            new_vocab[tuple(new_tokens)] = freq
        vocab = new_vocab
    return merges


def apply_bpe(word, merges):
    tokens = list(word) + ["</w>"]
    for a, b in merges:
        new_tokens = []
        i = 0
        while i < len(tokens):
            if i + 1 < len(tokens) and tokens[i] == a and tokens[i + 1] == b:
                new_tokens.append(a + b)
                i += 2
            else:
                new_tokens.append(tokens[i])
                i += 1
        tokens = new_tokens
    return tokens
```

```python
>>> corpus = Counter({"low": 5, "lower": 2, "newest": 6, "widest": 3})
>>> merges = learn_bpe(corpus, k_merges=10)
>>> apply_bpe("lowest", merges)
['low', 'est</w>']
```

第一轮合并最高频的相邻对。迭代足够多轮后,高频子串(`low`、`est`、`tion`)变成单 token,罕见词也能干净地拆开。

真实的 GPT / BERT / T5 分词器学习 3 万到 10 万次合并。结果:任何文本都能被分词成定长边界内的已知 ID 序列,永远没有 OOV。

## 投入使用

实践中,你很少自己训练这些东西——直接加载预训练检查点。

```python
import fasttext.util
fasttext.util.download_model("en", if_exists="ignore")
ft = fasttext.load_model("cc.en.300.bin")
print(ft.get_word_vector("whereupon").shape)
print(ft.get_word_vector("zoomerapproved").shape)
```

Transformer 时代的 BPE 风格子词分词:

```python
from transformers import AutoTokenizer

tok = AutoTokenizer.from_pretrained("gpt2")
print(tok.tokenize("unbelievably tokenized"))
```

```
['un', 'bel', 'iev', 'ably', 'Ġtoken', 'ized']
```

`Ġ` 前缀标记词边界(GPT-2 的约定)。每一个现代分词器都是 BPE 变体、WordPiece(BERT)或 SentencePiece(T5、LLaMA)。

### 什么场景选哪个

| 场景 | 选择 |
|-----------|------|
| 预训练通用词向量,不需要容忍 OOV | GloVe 300d |
| 预训练通用词向量,必须处理拼写错误/新造词/形态丰富的语言 | FastText |
| 任何要进 Transformer 的东西(训练或推理) | 模型自带的分词器,永远不要换 |
| 从零训练自己的语言模型 | 先在你的语料上训练一个 BPE 或 SentencePiece 分词器 |
| 线性模型做生产文本分类 | 仍然是 TF-IDF,见第 02 课 |

## 交付

保存为 `outputs/skill-embeddings-picker.md`:

```markdown
---
name: tokenizer-picker
description: Pick a tokenization approach for a new language model or text pipeline.
version: 1.0.0
phase: 5
lesson: 04
tags: [nlp, tokenization, embeddings]
---

Given a task and dataset description, you output:

1. Tokenization strategy (word-level, BPE, WordPiece, SentencePiece, byte-level). One-sentence reason.
2. Vocabulary size target (e.g., 32k for an English-only LM, 64k-100k for multilingual).
3. Library call with the exact training command. Name the library. Quote the arguments.
4. One reproducibility pitfall. Tokenizer-model mismatch is the single most common silent production bug; call out which pair must be used together.

Refuse to recommend training a custom tokenizer when the user is fine-tuning a pretrained LLM. Refuse to recommend word-level tokenization for any model targeting production inference. Flag non-English / multi-script corpora as needing SentencePiece with byte fallback.
```

## 练习

1. **简单。** 运行 `char_ngrams("playing")` 和 `char_ngrams("played")`,计算两组 n-gram 的 Jaccard 重合度。你应该会看到大量共享零件(`pla`、`lay`、`play`),这就是 FastText 在形态变体之间迁移良好的原因。
2. **中等。** 扩展 `learn_bpe`,追踪词表增长:画出"每语料字符对应的 token 数"随合并次数变化的曲线。你应该会看到先快速压缩,然后收敛到每 token 约 2–3 个字符。
3. **困难。** 在莎士比亚全集上训练一个 1k 合并的 BPE。比较高频词与罕见专有名词的分词结果,测量前后的平均每词 token 数。写下让你意外的发现。

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|-----------------|-----------------------|
| 共现矩阵(Co-occurrence matrix) | 词-词频率表 | `X[i][j]` = 词 `j` 出现在词 `i` 周围窗口中的次数 |
| 子词(Subword) | 词的零件 | 字符 n-gram(FastText)或学出来的 token(BPE/WordPiece/SentencePiece) |
| BPE | 字节对编码 | 反复合并最高频相邻对,直到词表达到目标大小 |
| OOV | 词表外 | 模型从未见过的词。Word2Vec/GloVe 失效,FastText 和 BPE 能处理 |
| 字节级 BPE(Byte-level BPE) | 在原始字节上做 BPE | GPT-2 的方案:词表从 256 个字节起步,任何输入都不会 OOV |

## 延伸阅读

- [Pennington, Socher, Manning (2014). GloVe: Global Vectors for Word Representation](https://nlp.stanford.edu/pubs/glove.pdf)——GloVe 论文,七页,至今仍是对该损失最好的推导
- [Bojanowski et al. (2017). Enriching Word Vectors with Subword Information](https://arxiv.org/abs/1607.04606)——FastText
- [Sennrich, Haddow, Birch (2016). Neural Machine Translation of Rare Words with Subword Units](https://arxiv.org/abs/1508.07909)——把 BPE 引入现代 NLP 的论文
- [Hugging Face tokenizer summary](https://huggingface.co/docs/transformers/tokenizer_summary)——BPE、WordPiece、SentencePiece 在实践中到底有何不同
