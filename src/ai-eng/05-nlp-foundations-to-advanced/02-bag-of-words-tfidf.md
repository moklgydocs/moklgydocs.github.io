# 词袋、TF-IDF 与文本表示

> 先数数,再思考。到了 2026 年,TF-IDF 在定义明确的任务上依然胜过嵌入。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 5 阶段 · 01(文本处理),第 2 阶段 · 02(从零实现线性回归)
**预计耗时:** 约 75 分钟

## 问题

模型要的是数字,你手上是字符串。

每条 NLP 流水线都要回答同一个问题:如何把一条变长的 token 流变成一个定长向量,好让分类器吃得下去。这个领域落地的第一个答案,是最笨但能用的那个:数词,做成向量。

这个向量扛起过的生产 NLP,比任何嵌入模型都多:垃圾邮件过滤、主题分类、日志异常检测、搜索排序(BM25 之前)、第一波情感分析、学术 NLP 基准测试的头十年。2026 年的实践者在窄分类任务上仍然第一个想到它——快、可解释,而且在"词是否出现"才是关键的任务上,效果常常与 4 亿参数的嵌入模型难以区分。

本课从零构建词袋,再构建 TF-IDF,然后展示 scikit-learn 三行做完同样的事,最后点名那个让你不得不转向嵌入的失效模式。

## 概念

**词袋(Bag of Words, BoW)** 丢掉顺序:对每篇文档,统计词表中每个词出现了几次。向量长度等于词表大小,位置 `i` 就是词 `i` 的计数。

**TF-IDF** 给 BoW 重新加权:在每篇文档里都出现的词没有信息量,调低;在整个语料中罕见、却在某篇文档里高频的词是信号,调高。

```
TF-IDF(w, d) = TF(w, d) * IDF(w)
             = count(w in d) / |d| * log(N / df(w))
```

其中 `TF` 是词在文档中的频率,`df` 是文档频率(多少篇文档含有该词),`N` 是文档总数。`log` 让无处不在的词权重不致失控。

关键性质:两者都产出稀疏且坐标轴可解释的向量。你可以查看训练好的分类器权重,直接读出哪些词把文档推向哪个类别。对着 768 维的 BERT 嵌入,你做不到这一点。

```figure
bow-tfidf
```

## 动手构建

### 第 1 步:构建词表

```python
def build_vocab(docs):
    vocab = {}
    for doc in docs:
        for token in doc:
            if token not in vocab:
                vocab[token] = len(vocab)
    return vocab
```

输入:分好词的文档列表(任何词级分词器都行;本课的 `code/main.py` 用的是简化的小写版)。输出:`{词: 下标}` 字典。稳定的插入顺序意味着 0 号词是第一篇文档里见到的第一个词。各家约定不同——scikit-learn 按字母序排。

### 第 2 步:词袋

```python
def bag_of_words(docs, vocab):
    matrix = [[0] * len(vocab) for _ in docs]
    for i, doc in enumerate(docs):
        for token in doc:
            if token in vocab:
                matrix[i][vocab[token]] += 1
    return matrix
```

```python
>>> docs = [["cat", "sat", "on", "mat"], ["cat", "cat", "ran"]]
>>> vocab = build_vocab(docs)
>>> bag_of_words(docs, vocab)
[[1, 1, 1, 1, 0], [2, 0, 0, 0, 1]]
```

行是文档,列是词表下标,`[i][j]` 表示"词 `j` 在文档 `i` 中出现了几次"。文档 1 的 `cat` 是 2,因为它确实出现了两次;文档 0 的 `ran` 是 0,因为它没出现过。

### 第 3 步:词频与文档频率

```python
import math


def term_frequency(doc_bow, doc_length):
    return [c / doc_length if doc_length else 0 for c in doc_bow]


def document_frequency(bow_matrix):
    df = [0] * len(bow_matrix[0])
    for row in bow_matrix:
        for j, count in enumerate(row):
            if count > 0:
                df[j] += 1
    return df


def inverse_document_frequency(df, n_docs):
    return [math.log((n_docs + 1) / (d + 1)) + 1 for d in df]
```

两个值得点名的平滑技巧:`(n+1)/(d+1)` 避免了 `log(x/0)`;末尾的 `+1` 让出现在每篇文档里的词 IDF 为 1(而非 0),与 scikit-learn 的默认行为一致。其他实现用裸的 `log(N/df)`,两种都行,平滑版更友好。

### 第 4 步:TF-IDF

```python
def tfidf(bow_matrix):
    n_docs = len(bow_matrix)
    df = document_frequency(bow_matrix)
    idf = inverse_document_frequency(df, n_docs)
    out = []
    for row in bow_matrix:
        length = sum(row)
        tf = term_frequency(row, length)
        out.append([tf_j * idf_j for tf_j, idf_j in zip(tf, idf)])
    return out
```

```python
>>> docs = [
...     ["the", "cat", "sat"],
...     ["the", "dog", "sat"],
...     ["the", "cat", "ran"],
... ]
>>> vocab = build_vocab(docs)
>>> bow = bag_of_words(docs, vocab)
>>> tfidf(bow)
```

三篇文档,五个词表词(`the`、`cat`、`sat`、`dog`、`ran`)。`the` 三篇都出现,IDF 低;`dog` 只出现在一篇,IDF 高。向量是稀疏的(大多数分量很小),有区分度的词脱颖而出。

### 第 5 步:行向量 L2 归一化

```python
def l2_normalize(matrix):
    out = []
    for row in matrix:
        norm = math.sqrt(sum(x * x for x in row))
        out.append([x / norm if norm else 0 for x in row])
    return out
```

不归一化的话,长文档向量更大,会在相似度计算中占据主导。L2 归一化把每篇文档都放到单位超球面上,行间的余弦相似度就简化成一次点积。

## 投入使用

scikit-learn 提供了生产版本。

```python
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

docs = ["the cat sat on the mat", "the dog sat on the mat", "the cat ran"]

bow_vectorizer = CountVectorizer()
bow = bow_vectorizer.fit_transform(docs)
print(bow_vectorizer.get_feature_names_out())
print(bow.toarray())

tfidf_vectorizer = TfidfVectorizer()
tfidf = tfidf_vectorizer.fit_transform(docs)
print(tfidf.toarray().round(3))
```

`CountVectorizer` 一次调用完成分词、建词表和 BoW;`TfidfVectorizer` 再加上 IDF 加权和 L2 归一化。两者都返回稀疏矩阵。10 万篇文档时,稠密版根本放不进内存——在分类器强制要求稠密之前,一直保持稀疏。

改变一切的旋钮:

| 参数 | 效果 |
|-----|--------|
| `ngram_range=(1, 2)` | 加入二元组,通常能提升分类效果 |
| `min_df=2` | 丢弃出现在不足 2 篇文档中的词,在噪声数据上给词表瘦身 |
| `max_df=0.95` | 丢弃出现在超过 95% 文档中的词,不依赖硬编码停用词表也能近似去停用词 |
| `stop_words="english"` | scikit-learn 内置停用词表。视任务而定——情感分析*不应*丢弃否定词 |
| `sublinear_tf=True` | 用 `1 + log(tf)` 代替原始 `tf`,一个词在单篇文档中重复很多次时有用 |

### TF-IDF 至今仍胜出的场景(截至 2026)

- 垃圾邮件检测、主题标注、日志异常标记:词是否出现才是关键,语义细微差别不重要。
- 低数据场景(几百条标注样本):TF-IDF 加逻辑回归,零预训练成本。
- 任何看重延迟的地方:TF-IDF 加线性模型以微秒作答;文档过一次 Transformer 嵌入要 10–100ms。
- 必须解释预测结果的系统:查看分类器系数,权重最高的正词就是理由。

### TF-IDF 失效的场景

语义盲失效。看这两篇文档:

- "The movie was not good at all."
- "The movie was excellent."

一条是差评,一条是好评。它们的 TF-IDF 重合部分恰好是 `{the, movie, was}`。词袋分类器只能死记"`not` 出现在 `good` 附近会翻转标签"这件事——数据够多也能学会,但永远不如理解句法的模型学得优雅。

另一个失效:推理时遇到词表之外的词。在 IMDb 影评上训练的 BoW 模型,遇到训练时从未出现的 `Zoomer-approved` 就完全不知所措。子词嵌入(第 04 课)能处理,TF-IDF 不能。

### 混合:TF-IDF 加权嵌入

2026 年中等数据量分类的务实默认:用 TF-IDF 权重对词嵌入做加权汇聚。

```python
def tfidf_weighted_embedding(doc, tfidf_scores, embedding_table, dim):
    vec = [0.0] * dim
    total_weight = 0.0
    for token in doc:
        if token not in embedding_table or token not in tfidf_scores:
            continue
        weight = tfidf_scores[token]
        emb = embedding_table[token]
        for i in range(dim):
            vec[i] += weight * emb[i]
        total_weight += weight
    if total_weight == 0:
        return vec
    return [v / total_weight for v in vec]
```

语义能力来自嵌入,罕见词强调来自 TF-IDF,分类器在汇聚后的向量上训练。在约 5 万条标注样本以下的情感、主题、意图分类上,这个组合超过任何单独一方。

## 交付

保存为 `outputs/prompt-vectorization-picker.md`:

```markdown
---
name: vectorization-picker
description: Given a text-classification task, recommend BoW, TF-IDF, embeddings, or a hybrid.
phase: 5
lesson: 02
---

You recommend a text-vectorization strategy. Given a task description, output:

1. Representation (BoW, TF-IDF, transformer embeddings, or a hybrid). Explain why in one sentence.
2. Specific vectorizer configuration. Name the library. Quote the arguments (`ngram_range`, `min_df`, `max_df`, `sublinear_tf`, `stop_words`).
3. One failure mode to test before shipping.

Refuse to recommend embeddings when the user has under 500 labeled examples unless they show evidence of semantic failure in a TF-IDF baseline. Refuse to remove stopwords for sentiment analysis (negations carry signal). Flag class imbalance as needing more than a vectorizer change.

Example input: "Classifying 30k customer support tickets into 12 categories. Most tickets are 2-3 sentences. English only. Need explainability for audit logs."

Example output:

- Representation: TF-IDF. 30k examples is not small; explainability requirement rules out dense embeddings.
- Config: `TfidfVectorizer(ngram_range=(1, 2), min_df=3, max_df=0.95, sublinear_tf=True, stop_words=None)`. Keep stopwords because category keywords sometimes are stopwords ("not working" vs "working").
- Failure to test: verify `min_df=3` does not drop rare category keywords. Run `get_feature_names_out` filtered by class and eyeball.
```

## 练习

1. **简单。** 在 L2 归一化后的 TF-IDF 输出上实现 `cosine_similarity(doc_vec_a, doc_vec_b)`。验证完全相同的文档得 1.0,词表毫无交集的文档得 0.0。
2. **中等。** 给 `bag_of_words` 加 n-gram 支持:参数 `n` 产生 n-gram 计数。验证 `n=2` 时,`["the", "cat", "sat"]` 产出二元组 `["the cat", "cat sat"]` 的计数。
3. **困难。** 用 GloVe 100d 向量(下载一次并缓存)构建上面的 TF-IDF 加权嵌入混合方案,在 20 Newsgroups 数据集上对比它与纯 TF-IDF、纯均值汇聚嵌入的分类准确率,报告谁在哪里胜出。

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|-----------------|-----------------------|
| 词袋(BoW) | 词频向量 | 一篇文档中词表各词的计数,丢掉顺序 |
| 词频(TF) | Term frequency | 词在文档中的计数,可按文档长度归一化 |
| 文档频率(DF) | Document frequency | 至少含该词一次的文档数 |
| 逆文档频率(IDF) | Inverse document frequency | 平滑后的 `log(N / df)`,给无处不在的词降权 |
| 稀疏向量(Sparse vector) | 大部分是零 | 词表通常 1 万到 10 万词,任意一篇文档只用到其中极少数 |
| 余弦相似度(Cosine similarity) | 向量夹角 | L2 归一化向量的点积:1 表示完全相同,0 表示正交 |

## 延伸阅读

- [scikit-learn — feature extraction from text](https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction)——权威 API 参考,附每个旋钮的说明
- [Salton, G., & Buckley, C. (1988). Term-weighting approaches in automatic text retrieval](https://www.sciencedirect.com/science/article/pii/0306457388900210)——让 TF-IDF 称王十年的论文
- ["Why TF-IDF Still Beats Embeddings" — Ashfaque Thonikkadavan (Medium)](https://medium.com/@cmtwskb/why-tf-idf-still-beats-embeddings-ad85c123e1b2)——2026 年视角:老方法何时胜出、为何胜出
