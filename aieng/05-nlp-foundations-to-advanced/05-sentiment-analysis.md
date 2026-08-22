# 情感分析

> NLP 的 经典 任务。经典文本分类里你需要知道的大部分东西,都会在这里登场。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 5 阶段 · 02(词袋 + TF-IDF),第 2 阶段 · 14(朴素贝叶斯)
**预计耗时:** 约 75 分钟

## 问题

"The food was not great."——正面还是负面?

情感听起来很简单:评论者说了喜欢还是不喜欢,给句子打个标签就行。它之所以成为 NLP 的 经典 任务,是因为每个看似简单的案例背后都藏着一个难的:否定翻转语义,反讽再翻一次;"Not bad at all" 带着两个负面色彩的词,却是正面的;emoji 携带的信号比正文还多;领域词汇很关键(乐评里的 `tight` 和时装评论里的 `tight` 不是一回事)。

情感分析是经典 NLP 的练兵场。如果你明白每个朴素基线为什么有各自特定的失效模式,你就明白为什么后来每一种更强的模型会被发明出来。本课从零构建朴素贝叶斯基线,加上逻辑回归,并点名那些让生产级情感分析变成合规级问题的陷阱。

## 概念

经典情感分析是两步配方。

1. **表示。** 把文本变成特征向量:词袋、TF-IDF 或 n-gram。
2. **分类。** 在标注样本上拟合线性模型(朴素贝叶斯、逻辑回归、SVM)。

朴素贝叶斯是能用的模型里最笨的那个:假设给定标签时所有特征相互独立,从计数估计 `P(词 | 正面)` 和 `P(词 | 负面)`,推理时把概率连乘。"朴素"的独立性假设错得可笑,结果却强得惊人。原因在于:文本特征稀疏、数据量中等时,分类器更在乎每个词倒向哪边,而不是倒了多少。

逻辑回归修掉了独立性假设:它为每个特征学一个权重,包括负权重。`not good` 作为二元特征可以拿到负权重——朴素贝叶斯对从未标注过的二元组做不到这一点。

```figure
sentiment-logits
```

## 动手构建

### 第 1 步:一个真实感迷你数据集

```python
POSITIVE = [
    "absolutely loved this movie",
    "beautiful cinematography and a great story",
    "one of the best films of the year",
    "brilliant acting from the lead",
    "heartwarming and funny",
]

NEGATIVE = [
    "boring and far too long",
    "not worth your time",
    "the plot made no sense",
    "terrible acting, awful script",
    "i want my two hours back",
]
```

故意做小。真实工作用几万条样本(IMDb、SST-2、Yelp polarity),数学完全一样。

### 第 2 步:从零实现多项朴素贝叶斯

```python
import math
from collections import Counter


def train_nb(docs_by_class, vocab, alpha=1.0):
    class_priors = {}
    class_word_probs = {}
    total_docs = sum(len(d) for d in docs_by_class.values())

    for cls, docs in docs_by_class.items():
        class_priors[cls] = len(docs) / total_docs
        counts = Counter()
        for doc in docs:
            for token in doc:
                counts[token] += 1
        total = sum(counts.values()) + alpha * len(vocab)
        class_word_probs[cls] = {
            w: (counts[w] + alpha) / total for w in vocab
        }
    return class_priors, class_word_probs


def predict_nb(doc, class_priors, class_word_probs):
    scores = {}
    for cls in class_priors:
        s = math.log(class_priors[cls])
        for token in doc:
            if token in class_word_probs[cls]:
                s += math.log(class_word_probs[cls][token])
        scores[cls] = s
    return max(scores, key=scores.get)
```

加法平滑(alpha=1.0)就是拉普拉斯平滑:没有它,某个类里没见过的词概率为零,取对数直接爆炸。实践中常用 `alpha=0.01`,`alpha=1.0` 是教学默认值。

### 第 3 步:从零实现逻辑回归

```python
import numpy as np


def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-np.clip(x, -20, 20)))


def train_lr(X, y, epochs=500, lr=0.05, l2=0.01):
    n_features = X.shape[1]
    w = np.zeros(n_features)
    b = 0.0
    for _ in range(epochs):
        logits = X @ w + b
        preds = sigmoid(logits)
        err = preds - y
        grad_w = X.T @ err / len(y) + l2 * w
        grad_b = err.mean()
        w -= lr * grad_w
        b -= lr * grad_b
    return w, b


def predict_lr(X, w, b):
    return (sigmoid(X @ w + b) >= 0.5).astype(int)
```

L2 正则在这里很重要:文本特征稀疏,不加 L2 模型就会背下训练样本。从 `0.01` 起步再调。

### 第 4 步:处理否定(失效模式)

考虑 "not good" 和 "not bad"。词袋分类器看到的是 `{not, good}` 和 `{not, bad}`,训练里哪种组合出现得多就学成什么样。二元组分类器看到的则是 `not_good` 和 `not_bad` 两个不同的特征,分别学习——这通常就够了。

没有二元组时,还有一个更糙但有效的办法:**否定作用域**(negation scoping)。把否定词之后、下一个标点之前的 token 都加上 `NOT_` 前缀。

```python
NEGATION_WORDS = {"not", "no", "never", "nor", "none", "nothing", "neither"}
NEGATION_TERMINATORS = {".", "!", "?", ",", ";"}


def apply_negation(tokens):
    out = []
    negate = False
    for token in tokens:
        if token in NEGATION_TERMINATORS:
            negate = False
            out.append(token)
            continue
        if token in NEGATION_WORDS:
            negate = True
            out.append(token)
            continue
        out.append(f"NOT_{token}" if negate else token)
    return out
```

```python
>>> apply_negation(["not", "good", "at", "all", ".", "but", "funny"])
['not', 'NOT_good', 'NOT_at', 'NOT_all', '.', 'but', 'funny']
```

现在 `good` 和 `NOT_good` 是不同的特征,分类器可以给它们相反的权重。三行预处理,在情感基准上就能带来可测量的准确率提升。

### 第 5 步:真正要紧的评估指标

类别不平衡时,单看准确率会骗人。真实的情感语料往往是 70–80% 正面或 70–80% 负面,一个永远猜多数类的分类器能拿 80% 准确率,却毫无价值。以下每一项都要报:

- **逐类精确率与召回率。** 每类一对。做宏平均(macro-average)得到一个尊重类别平衡的单一数字。
- **宏 F1(不平衡数据的主指标)。** 逐类 F1 的等权平均。类别不平衡时用它替代准确率。
- **加权 F1(备选)。** 与宏平均相同,但按类别频率加权。当不平衡本身有业务含义时,与宏 F1 一起报。
- **混淆矩阵。** 原始计数。在相信任何标量指标之前先查它——它会告诉你模型把哪两类搞混。
- **逐类错误样本。** 每类抽 5 条错误预测,逐条读。没有任何东西能替代亲自读错误。

对严重不平衡的数据(超过 95:5),改报 **AUROC** 和 **AUPRC** 而不是准确率。AUPRC 对少数类更敏感,而你通常在乎的正是少数类(垃圾邮件、欺诈、罕见情感)。

**要避开的常见 bug。** 在不平衡数据上报 micro-F1 而不是 macro-F1,会得到一个看起来很高的数字,因为它被多数类主导。宏 F1 逼着你直面少数类的表现。

```python
def evaluate(y_true, y_pred):
    tp = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)
    fp = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)
    fn = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)
    tn = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 0)
    precision = tp / (tp + fp) if tp + fp else 0
    recall = tp / (tp + fn) if tp + fn else 0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0
    return {"tp": tp, "fp": fp, "tn": tn, "fn": fn, "precision": precision, "recall": recall, "f1": f1}
```

## 投入使用

scikit-learn 六行搞定,而且是正确的。

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

pipe = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=2, sublinear_tf=True, stop_words=None)),
    ("clf", LogisticRegression(C=1.0, max_iter=1000)),
])
pipe.fit(X_train, y_train)
print(pipe.score(X_test, y_test))
```

注意三件事:`stop_words=None` 保留否定词;`ngram_range=(1, 2)` 加入二元组,让 `not_good` 成为特征;`sublinear_tf=True` 抑制重复词。在 SST-2 上,这三个开关就是 75% 准确率基线和 85% 准确率基线之间的差别。

### 什么时候该上 Transformer

- 反讽检测:经典模型在这里全军覆没,没有例外。
- 情感在文档中途转向的长评论。
- 方面级情感分析(aspect-based sentiment):"Camera was great but battery was terrible." 需要把情感归因到具体方面——只有 Transformer 或结构化输出模型能做。
- 非英语的低资源语言:多语言 BERT 免费送你一个零样本基线。

需要以上任何一条,直接跳到第 7 阶段(Transformer 深入)。否则,TF-IDF 加二元组加否定处理,配朴素贝叶斯或逻辑回归,就是你 2026 年的生产基线。

### 可复现性陷阱(再次)

重训情感模型是日常,重估基线却不是。论文里报的准确率数字用的是特定的数据划分、特定的预处理、特定的分词器。如果你不用完全相同的流水线去复现基线,而是拿论文数字来比,得到的差值会误导你。永远在你自己的流水线上重新生成基线,别引论文的数。

## 交付

保存为 `outputs/prompt-sentiment-baseline.md`:

```markdown
---
name: sentiment-baseline
description: Design a sentiment analysis baseline for a new dataset.
phase: 5
lesson: 05
---

Given a dataset description (domain, language, size, label granularity, latency budget), you output:

1. Feature extraction recipe. Specify tokenizer, n-gram range, stopword policy (usually keep), negation handling (scoped prefix or bigrams).
2. Classifier. Naive Bayes for baseline, logistic regression for production, transformer only if the domain needs sarcasm / aspects / cross-lingual.
3. Evaluation plan. Report precision, recall, F1, confusion matrix, and per-class error samples (not just scalars).
4. One failure mode to monitor post-deployment. Domain drift and sarcasm are the top two.

Refuse to recommend dropping stopwords for sentiment tasks. Refuse to report accuracy as the sole metric when classes are imbalanced (e.g., 90% positive). Flag subword-rich languages as needing FastText or transformer embeddings over word-level TF-IDF.
```

## 练习

1. **简单。** 把 `apply_negation` 作为预处理步骤加进 scikit-learn 流水线,在一个小情感数据集上测量 F1 的变化。
2. **中等。** 实现带类别权重的逻辑回归(给 scikit-learn 传 `class_weight="balanced"`,或自己推导梯度)。在合成的 90:10 类别不平衡数据上测量效果。
3. **困难。** 在情感模型的残差上训练第二个分类器,构建一个反讽检测器。记录你的实验设置;当准确率低于随机水平时提醒读者(二分类反讽的随机水平约 50%,大多数第一次尝试就落在那里)。

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|-----------------|-----------------------|
| 极性(Polarity) | 正面或负面 | 二值标签;有时扩展出中性或细粒度(五星) |
| 方面级情感(Aspect-based sentiment) | 按方面分极性 | 把情感归因到文本中提及的具体实体或属性 |
| 否定作用域(Negation scoping) | 反转附近的 token | 把 "not" 之后到标点之前的 token 加 `NOT_` 前缀 |
| 拉普拉斯平滑(Laplace smoothing) | 计数加 1 | 防止朴素贝叶斯里出现零概率特征 |
| L2 正则(L2 regularization) | 收缩权重 | 往损失里加 `lambda * sum(w^2)`,稀疏文本特征必需 |

## 延伸阅读

- [Pang and Lee (2008). Opinion Mining and Sentiment Analysis](https://www.cs.cornell.edu/home/llee/opinion-mining-sentiment-analysis-survey.html)——奠基性综述,很长,但前四节覆盖了经典方法的一切
- [Wang and Manning (2012). Baselines and Bigrams: Simple, Good Sentiment and Topic Classification](https://aclanthology.org/P12-2018/)——证明了短文本上"二元组 + 朴素贝叶斯"很难被打败的论文
- [scikit-learn text feature extraction docs](https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction)——`CountVectorizer`、`TfidfVectorizer` 及你要调的每个旋钮的参考
