# 词嵌入——从零实现 Word2Vec

> 看词知义,看它身边的词。用这个想法训练一个浅层网络,几何结构自然浮现。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 5 阶段 · 02(词袋 + TF-IDF),第 3 阶段 · 03(从零实现反向传播)
**预计耗时:** 约 75 分钟

## 问题

TF-IDF 知道 `dog` 和 `puppy` 是两个不同的词,却不知道它们意思几乎一样。在 `dog` 上训练的分类器,无法泛化到一篇讲 `puppy` 的评论。你可以列同义词表糊弄过去,但这对罕见词、领域黑话,以及一切你没预料到的语言都会失效。

你想要的是这样一种表示:`dog` 和 `puppy` 在空间中落得很近;`king - man + woman` 落在 `queen` 附近;在 `dog` 上训练的模型能免费把一部分信号迁移给 `puppy`。

Word2Vec 给了我们这个空间:两层神经网络、万亿 token 的训练量、2013 年发表。架构简单到近乎简陋,结果却重塑了之后十年的 NLP。

## 概念

**分布假设**(Firth, 1957):"观其伴,知其词。"两个词若出现在相似的上下文里,它们多半意思相近。

Word2Vec 有两个变体,都利用了这个思想。

- **Skip-gram。** 给定中心词,预测周围的词:窗口为 2 时,`cat -> (the, sat, on)`。
- **CBOW(连续词袋)。** 给定周围的词,预测中心词:`(the, sat, on) -> cat`。

Skip-gram 训练更慢,但对罕见词更好,因此成了默认选择。

网络只有一个不带非线性的隐藏层:输入是词表上的 one-hot 向量,输出是词表上的 softmax。训练结束后,输出层直接扔掉——隐藏层权重就是嵌入。

```
one-hot(center) ── W ──▶ hidden (d-dim) ── W' ──▶ softmax(vocab)
                          ^
                          this is the embedding
```

关键技巧:对 10 万词做 softmax 代价高到无法接受。Word2Vec 用**负采样**把它变成二分类任务:预测"这个上下文词是否真的出现在这个中心词附近,是还是否"。每个训练对只采样少数几个负(不共现的)词,而不是对整个词表算 softmax。

```figure
word-vector-arithmetic
```

## 动手构建

### 第 1 步:从语料生成训练对

```python
def skipgram_pairs(docs, window=2):
    pairs = []
    for doc in docs:
        for i, center in enumerate(doc):
            for j in range(max(0, i - window), min(len(doc), i + window + 1)):
                if i == j:
                    continue
                pairs.append((center, doc[j]))
    return pairs
```

```python
>>> skipgram_pairs([["the", "cat", "sat", "on", "mat"]], window=2)
[('the', 'cat'), ('the', 'sat'),
 ('cat', 'the'), ('cat', 'sat'), ('cat', 'on'),
 ('sat', 'the'), ('sat', 'cat'), ('sat', 'on'), ('sat', 'mat'),
 ...]
```

窗口内的每个 (center, context) 对都是一个正训练样本。

### 第 2 步:嵌入表

两个矩阵:`W` 是中心词嵌入表(你要保留的那个);`W'` 是上下文词表(通常丢弃,有时与 `W` 取平均)。

```python
import numpy as np


def init_embeddings(vocab_size, dim, seed=0):
    rng = np.random.default_rng(seed)
    W = rng.normal(0, 0.1, size=(vocab_size, dim))
    W_prime = rng.normal(0, 0.1, size=(vocab_size, dim))
    return W, W_prime
```

小的随机初始化。词表 1 万、维度 100 是现实配置;教学用 50 词 x 16 维就足以看出几何结构。

### 第 3 步:负采样目标

对每个正样本对 `(center, context)`,从词表中随机采 `k` 个词作为负样本。训练目标是让点积 `W[center] · W'[context]` 对正样本尽量大、对负样本尽量小。

```python
def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-np.clip(x, -20, 20)))


def train_pair(W, W_prime, center_idx, context_idx, negative_indices, lr):
    v_c = W[center_idx]
    u_pos = W_prime[context_idx]
    u_negs = W_prime[negative_indices]

    pos_score = sigmoid(v_c @ u_pos)
    neg_scores = sigmoid(u_negs @ v_c)

    grad_center = (pos_score - 1) * u_pos
    for i, u in enumerate(u_negs):
        grad_center += neg_scores[i] * u

    W[context_idx] = W[context_idx]
    W_prime[context_idx] -= lr * (pos_score - 1) * v_c
    for i, neg_idx in enumerate(negative_indices):
        W_prime[neg_idx] -= lr * neg_scores[i] * v_c
    W[center_idx] -= lr * grad_center
```

神奇的公式:正样本对上的 logistic 损失(想让 sigmoid 接近 1)加负样本对上的 logistic 损失(想让 sigmoid 接近 0),梯度流向两张表。完整推导见原始论文——想真正记住的话,拿纸笔推一遍。

### 第 4 步:在玩具语料上训练

```python
def train(docs, dim=16, window=2, k_neg=5, epochs=100, lr=0.05, seed=0):
    vocab = build_vocab(docs)
    vocab_size = len(vocab)
    rng = np.random.default_rng(seed)
    W, W_prime = init_embeddings(vocab_size, dim, seed=seed)
    pairs = skipgram_pairs(docs, window=window)

    for epoch in range(epochs):
        rng.shuffle(pairs)
        for center, context in pairs:
            c_idx = vocab[center]
            ctx_idx = vocab[context]
            negs = rng.integers(0, vocab_size, size=k_neg)
            negs = [n for n in negs if n != ctx_idx and n != c_idx]
            train_pair(W, W_prime, c_idx, ctx_idx, negs, lr)
    return vocab, W
```

在大语料上训够 epoch 之后,共享上下文的词会得到相似的中心词嵌入。玩具语料上只能看到微弱的迹象;十亿级 token 上,效果极为显著。

### 第 5 步:类比魔术

```python
def nearest(vocab, W, target_vec, topk=5, exclude=None):
    exclude = exclude or set()
    inv_vocab = {i: w for w, i in vocab.items()}
    norms = np.linalg.norm(W, axis=1, keepdims=True) + 1e-9
    W_norm = W / norms
    target = target_vec / (np.linalg.norm(target_vec) + 1e-9)
    sims = W_norm @ target
    order = np.argsort(-sims)
    out = []
    for i in order:
        if i in exclude:
            continue
        out.append((inv_vocab[i], float(sims[i])))
        if len(out) == topk:
            break
    return out


def analogy(vocab, W, a, b, c, topk=5):
    v = W[vocab[b]] - W[vocab[a]] + W[vocab[c]]
    return nearest(vocab, W, v, topk=topk, exclude={vocab[a], vocab[b], vocab[c]})
```

在预训练的 300 维 Google News 向量上:

```python
>>> analogy(vocab, W, "man", "king", "woman")
[('queen', 0.71), ('monarch', 0.62), ('princess', 0.59), ...]
```

`king - man + woman = queen`。不是因为模型懂什么叫王室,而是因为向量 `(king - man)` 捕捉到了类似"王室的"这个方向,把它加到 `woman` 上,正好落在"王室-女性"的区域附近。

## 投入使用

从零写 Word2Vec 是教学。生产环境用 `gensim`。

```python
from gensim.models import Word2Vec

sentences = [
    ["the", "cat", "sat", "on", "the", "mat"],
    ["the", "dog", "ran", "across", "the", "room"],
]

model = Word2Vec(
    sentences,
    vector_size=100,
    window=5,
    min_count=1,
    sg=1,
    negative=5,
    workers=4,
    epochs=30,
)

print(model.wv["cat"])
print(model.wv.most_similar("cat", topn=3))
```

真实工作中,你几乎不会自己训练 Word2Vec——直接下载预训练向量。

- **GloVe**——斯坦福的共现矩阵分解方案,有 50d、100d、200d、300d 检查点,通用覆盖好。第 04 课专门讲 GloVe。
- **fastText**——Facebook 的 Word2Vec 扩展,嵌入字符 n-gram,通过组合子词处理词表外的词。第 04 课讲。
- **Google News 预训练 Word2Vec**——300 维、300 万词词表,2013 年发布,至今每天仍被下载。

### Word2Vec 在 2026 年仍胜出的场景

- 轻量的领域检索:在笔记本上花一小时用医学摘要训练,得到通用模型捕捉不到的专业向量。
- 类比式特征工程:`gender_vector = mean(man - woman pairs)`,从其他词中减去它得到性别中性的方向。公平性研究至今在用。
- 可解释性:100 维足够小,可以用 PCA 或 t-SNE 画出来,亲眼看簇的形成。
- 任何要在无 GPU 的设备上跑推理的地方:Word2Vec 查表就是取一行。

### Word2Vec 失效的地方

一词多义这堵墙。`bank` 只有一个向量,"河岸"和"银行"共享它;`table`(表格 vs 家具)也只有一个向量。下游分类器无法从这个向量里区分词义。

上下文嵌入(ELMo、BERT,以及之后每一个 Transformer)解决了这个问题:根据周围上下文,为同一个词的每次出现产出不同的向量。这就是从 Word2Vec 到 BERT 的跨越——从静态到上下文。Transformer 那一半,第 7 阶段讲。

词表外(OOV)问题是另一个失效:训练数据里没出现过 `Zoomer-approved`,Word2Vec 就没有任何办法。fastText 用子词组合修复了它(第 04 课)。

## 交付

保存为 `outputs/skill-embedding-probe.md`:

```markdown
---
name: embedding-probe
description: Inspect a word2vec model. Run analogies, find neighbors, diagnose quality.
version: 1.0.0
phase: 5
lesson: 03
tags: [nlp, embeddings, debugging]
---

You probe trained word embeddings to verify they are working. Given a `gensim.models.KeyedVectors` object and a vocabulary, you run:

1. Three canonical analogy tests. `king : man :: queen : woman`. `paris : france :: tokyo : japan`. `walking : walked :: swimming : ?`. Report the top-1 result and its cosine.
2. Five nearest-neighbor tests on domain-specific words the user supplies. Print top-5 neighbors with cosines.
3. One symmetry check. `similarity(a, b) == similarity(b, a)` to within float precision.
4. One degenerate check. If any embedding has a norm below 0.01 or above 100, the model has a training bug. Flag it.

Refuse to declare a model good on analogy accuracy alone. Analogy benchmarks are gameable and do not transfer to downstream tasks. Recommend intrinsic + downstream evaluation together.
```

## 练习

1. **简单。** 在迷你语料(20 句关于猫和狗的句子)上跑训练循环。200 个 epoch 后,验证 `nearest(vocab, W, W[vocab["cat"]])` 的前 3 名里有 `dog`。如果没有,增加 epoch 或扩大词表。
2. **中等。** 加入高频词亚采样:频率高于 `10^-5` 的词按正比于其频率的概率从训练对中丢弃。测量这对罕见词相似度的影响。
3. **困难。** 在 20 Newsgroups 语料上训练模型。计算两个偏见轴:`he - she` 和 `doctor - nurse`。把职业词投影到两个轴上,报告哪些职业的偏见差距最大。这正是公平性研究者使用的那类探针。

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|-----------------|-----------------------|
| 词嵌入(Word embedding) | 把词变成向量 | 从上下文中学出的稠密低维(通常 100–300)表示 |
| Skip-gram | Word2Vec 的技巧 | 用中心词预测上下文词,比 CBOW 慢但对罕见词更好 |
| 负采样(Negative sampling) | 训练捷径 | 用对 k 个随机词的二分类代替全词表 softmax |
| 静态嵌入(Static embedding) | 一词一向量 | 与上下文无关的固定向量,在一词多义上失效 |
| 上下文嵌入(Contextual embedding) | 随上下文变化的向量 | 同一个词每次出现都根据周围词得到不同向量,Transformer 的产物 |
| OOV | 词表外 | 训练中未见过的词,Word2Vec 无法为其产出向量 |

## 延伸阅读

- [Mikolov et al. (2013). Distributed Representations of Words and Phrases and their Compositionality](https://arxiv.org/abs/1310.4546)——负采样论文,短而易读
- [Rong, X. (2014). word2vec Parameter Learning Explained](https://arxiv.org/abs/1411.2738)——如果你觉得原论文的数学太密,这是最清晰的梯度推导
- [gensim Word2Vec tutorial](https://radimrehurek.com/gensim/models/word2vec.html)——真正能用的生产训练配置
