# 朴素贝叶斯

> "朴素"的假设是错的,但它照样管用。这正是它的美妙之处。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 2 阶段,第 01–07 课(分类、贝叶斯定理)
**预计耗时:** 约 75 分钟

## 学习目标

- 从零实现带拉普拉斯平滑的 Multinomial 朴素贝叶斯,用于文本分类
- 解释为什么朴素独立性假设在数学上是错的,实践中却能给出正确的类别排序
- 对比 Multinomial、Bernoulli、Gaussian 三种朴素贝叶斯变体,并针对给定特征类型选出合适的那个
- 在高维稀疏数据上对比朴素贝叶斯与逻辑回归,并解释其中的偏差-方差权衡

## 问题

你要做文本分类:邮件分成垃圾/非垃圾,用户评论分成正面/负面,工单分到各个类目。你有上万个特征(一个词一个特征),训练数据却有限。

大多数分类器在这里都会呛住:逻辑回归需要足够多的样本才能可靠地估计上千个权重;决策树一次只按一个词分裂,过拟合得肆无忌惮;一万维空间里的 KNN 毫无意义,因为每个点到其他所有点的距离都差不多。

朴素贝叶斯扛得住。它做了一个数学上错误的假设(给定类别时,每个特征都相互独立),却在文本分类上胜过那些"更聪明"的模型——尤其在训练集小的时候。它训练只需过一遍数据,能扩到上百万特征,还能给出概率估计(尽管由于独立性假设,校准往往不好)。

弄懂"为什么一个错误假设能产出好预测",你会学到机器学习的根本一课:最好的模型不是理论上最正确的那个,而是在你的数据上偏差-方差权衡最好的那个。

## 概念

### 贝叶斯定理(快速回顾)

贝叶斯定理把条件概率翻转过来:

```
P(class | features) = P(features | class) * P(class) / P(features)
```

我们想要的是 `P(class | features)`——一篇文档在出现这些词的情况下属于某个类别的概率。它可以由以下部分算出:
- `P(features | class)` —— 在该类文档中看到这些词的似然
- `P(class)` —— 类别的先验概率(垃圾邮件总体上有多常见?)
- `P(features)` —— 证据项,对所有类别都相同,比较时可以直接忽略

`P(class | features)` 最大的类别获胜。

### 朴素独立性假设

要精确计算 `P(features | class)`,得估计所有特征联合起来的概率。词表有 10,000 个词,就要估计 2^10,000 种可能组合上的分布——不可能。

朴素假设:给定类别时,每个特征条件独立。

```
P(w1, w2, ..., wn | class) = P(w1 | class) * P(w2 | class) * ... * P(wn | class)
```

原本是一个不可能的联合分布,现在变成 n 个简单的单特征分布,每个只需要一个计数。

这个假设显然是错的——任何文档里,"machine"和"learning"都不可能独立。但分类器不需要正确的概率估计,它需要正确的**排序**:哪个类别概率最高。独立性假设引入了系统性误差,但这些误差对所有类别的影响相似,所以排序依然正确。

### 为什么它仍然有效

三个原因:

1. **要排序,不要校准。** 分类只要求排第一的类别正确。哪怕真实概率是 0.7 而模型给出 P(spam) = 0.99999,分类器照样选对 spam。我们不需要正确的概率,只需要正确的赢家。

2. **高偏差,低方差。** 独立性假设是一个强先验,给模型施加了重约束,从而防止过拟合。训练数据有限时,一个略有偏差但稳定的模型,胜过一个理论正确却抖得厉害的模型。这就是偏差-方差权衡在起作用。

3. **特征冗余会相互抵消。** 相关特征提供冗余证据,分类器会重复计算这些证据——但它对正确的类别也同样重复计算。如果"machine"和"learning"总是同现,两者都为"科技"类提供证据,NB 把它们算了两遍,但这两遍都算在了正确的类别头上。

还有第四个现实原因:朴素贝叶斯快得离谱。训练就是过一遍数据统计频率,预测就是一次矩阵乘法,一百万篇文档几秒钟训完。这种速度意味着你能更快迭代、试更多特征组合、跑更多实验。

### 一步一步走数学

来看一个具体例子。两个类别:spam 和 not-spam。词表三个词:"free"、"money"、"meeting"。

训练数据:
- 垃圾邮件中 "free" 出现 80 次,"money" 60 次,"meeting" 10 次(共 150 个词)
- 正常邮件中 "free" 出现 5 次,"money" 10 次,"meeting" 100 次(共 115 个词)
- 40% 的邮件是垃圾邮件,60% 是正常邮件

使用拉普拉斯平滑(alpha=1):

```
P(free | spam)    = (80 + 1) / (150 + 3) = 81/153 = 0.529
P(money | spam)   = (60 + 1) / (150 + 3) = 61/153 = 0.399
P(meeting | spam) = (10 + 1) / (150 + 3) = 11/153 = 0.072

P(free | not-spam)    = (5 + 1) / (115 + 3) = 6/118 = 0.051
P(money | not-spam)   = (10 + 1) / (115 + 3) = 11/118 = 0.093
P(meeting | not-spam) = (100 + 1) / (115 + 3) = 101/118 = 0.856
```

新邮件内容:"free"(2 次)、"money"(1 次)、"meeting"(0 次)。

```
log P(spam | email) = log(0.4) + 2*log(0.529) + 1*log(0.399) + 0*log(0.072)
                    = -0.916 + 2*(-0.637) + (-0.919) + 0
                    = -3.109

log P(not-spam | email) = log(0.6) + 2*log(0.051) + 1*log(0.093) + 0*log(0.856)
                        = -0.511 + 2*(-2.976) + (-2.375) + 0
                        = -8.838
```

spam 大比分获胜。"free"出现两次是垃圾邮件的强证据。注意"meeting"没出现,对两个对数和的贡献都是零(0 * log(P))——在 Multinomial NB 里,缺席的词没有影响。显式建模"词缺席"的是 Bernoulli NB。

### 三种变体

朴素贝叶斯有三个流派,各自对 `P(feature | class)` 的建模不同。

#### Multinomial 朴素贝叶斯

把每个特征建模为计数。最适合文本数据——特征是词频或 TF-IDF 值。

```
P(word_i | class) = (count of word_i in class + alpha) / (total words in class + alpha * vocab_size)
```

`alpha` 是拉普拉斯平滑(下文详述)。这个变体是文本分类的主力。

#### Gaussian 朴素贝叶斯

把每个特征建模为正态分布。最适合连续特征。

```
P(x_i | class) = (1 / sqrt(2 * pi * var)) * exp(-(x_i - mean)^2 / (2 * var))
```

每个类别下,每个特征各有自己的均值和方差。当特征在每个类别内确实接近钟形分布时,效果很好。

#### Bernoulli 朴素贝叶斯

把每个特征建模为二值(出现/缺席)。最适合短文本或二值特征向量。

```
P(word_i | class) = (docs in class containing word_i + alpha) / (total docs in class + 2 * alpha)
```

与 Multinomial 不同,Bernoulli 会显式惩罚词的缺席:如果"free"通常出现在垃圾邮件里,而这封邮件没有它,Bernoulli 会把这当作反对 spam 的证据。

### 什么时候用哪个变体

| 变体 | 特征类型 | 最适合 | 例子 |
|---------|-------------|----------|---------|
| Multinomial | 计数或频率 | 文本分类、词袋 | 垃圾邮件、主题分类 |
| Gaussian | 连续值 | 特征近似正态的表格数据 | 鸢尾花分类、传感器数据 |
| Bernoulli | 二值(0/1) | 短文本、二值特征向量 | 短信垃圾分类、出现/缺席特征 |

### 拉普拉斯平滑

如果一个词在测试数据里出现了,但训练数据中某个类别里从没出现过,会发生什么?

不做平滑:`P(word | class) = 0/N = 0`。一个零乘进整个连乘,`P(class | features) = 0`——无论其他证据多么充分,一个没见过的词就毁掉整个预测。

拉普拉斯平滑给每个特征计数加上一个小量 `alpha`(通常取 1):

```
P(word_i | class) = (count(word_i, class) + alpha) / (total_words_in_class + alpha * vocab_size)
```

alpha=1 时,每个词至少有一点微小的概率。测试邮件里出现"discombobulate"这样的生僻词,不会再杀死 spam 概率。平滑有贝叶斯解释:它等价于在词分布上放置一个均匀 Dirichlet 先验。

alpha 越大,平滑越强(分布越均匀);alpha 越小,模型越信任数据。alpha 是一个需要调的超参数。

alpha 的影响:

| Alpha | 效果 | 何时使用 |
|-------|--------|-------------|
| 0.001 | 几乎不平滑,信任数据 | 训练集非常大,预计没有未见特征 |
| 0.1 | 轻度平滑 | 训练集大 |
| 1.0 | 标准拉普拉斯平滑 | 默认起点 |
| 10.0 | 重度平滑,压平分布 | 训练集很小,预计有大量未见特征 |

### 对数空间计算

几百个(都小于 1 的)概率连乘会导致浮点下溢:真实值明明是个极小的正数,浮点表示下乘积却变成了零。

解决办法:在对数空间计算。把概率相乘变成对数相加:

```
log P(class | x1, x2, ..., xn) = log P(class) + sum_i log P(xi | class)
```

这把预测变成了一次点积:

```
log_scores = X @ log_feature_probs.T + log_class_priors
prediction = argmax(log_scores)
```

矩阵乘法——这就是朴素贝叶斯预测如此快的原因,它和单层线性模型是同一种运算。

### 朴素贝叶斯 vs 逻辑回归

两者都是文本上的线性分类器,区别在于建模对象不同。

| 方面 | 朴素贝叶斯 | 逻辑回归 |
|--------|------------|-------------------|
| 类型 | 生成式(建模 P(X\|Y)) | 判别式(建模 P(Y\|X)) |
| 训练 | 数频率 | 优化损失函数 |
| 小数据 | 更好(强先验帮了忙) | 更差(样本不够估权重) |
| 大数据 | 更差(错误假设拖后腿) | 更好(决策边界灵活) |
| 特征 | 假设独立 | 能处理相关性 |
| 速度 | 一遍过,极快 | 迭代优化 |
| 校准 | 概率不准 | 概率更可靠 |

经验法则:先上朴素贝叶斯。如果数据够多且 NB 到顶了,换逻辑回归。

### 分类流水线

```mermaid
flowchart LR
    A[Raw Text] --> B[Tokenize]
    B --> C[Build Vocabulary]
    C --> D[Count Word Frequencies]
    D --> E[Apply Smoothing]
    E --> F[Compute Log Probabilities]
    F --> G[Predict: argmax P class given words]

    style A fill:#f9f,stroke:#333
    style G fill:#9f9,stroke:#333
```

实践中我们在对数空间计算,避免浮点下溢。不再把许多小概率相乘,而是把它们的对数相加:

```
log P(class | features) = log P(class) + sum_i log P(feature_i | class)
```

```figure
naive-bayes
```

## 动手构建

`code/naive_bayes.py` 中的代码从零实现了 MultinomialNB 和 GaussianNB。

### MultinomialNB

从零实现的要点:

1. **fit(X, y)**:对每个类别,统计每个特征的频率,加拉普拉斯平滑,算对数概率,存类别先验(类别频率的对数)。

2. **predict_log_proba(X)**:对每个样本、每个类别,计算 log P(class) + Σ log P(feature_i | class)。这是一次矩阵乘法:X @ log_probs.T + log_priors。

3. **predict(X)**:返回对数概率最高的类别。

```python
class MultinomialNB:
    def __init__(self, alpha=1.0):
        self.alpha = alpha

    def fit(self, X, y):
        classes = np.unique(y)
        n_classes = len(classes)
        n_features = X.shape[1]

        self.classes_ = classes
        self.class_log_prior_ = np.zeros(n_classes)
        self.feature_log_prob_ = np.zeros((n_classes, n_features))

        for i, c in enumerate(classes):
            X_c = X[y == c]
            self.class_log_prior_[i] = np.log(X_c.shape[0] / X.shape[0])
            counts = X_c.sum(axis=0) + self.alpha
            self.feature_log_prob_[i] = np.log(counts / counts.sum())

        return self
```

关键洞见:拟合完成后,预测就是矩阵乘法加一个偏置。这就是朴素贝叶斯快的原因。

### GaussianNB

对连续特征,按类别、按特征估计均值和方差:

```python
class GaussianNB:
    def __init__(self):
        pass

    def fit(self, X, y):
        classes = np.unique(y)
        self.classes_ = classes
        self.means_ = np.zeros((len(classes), X.shape[1]))
        self.vars_ = np.zeros((len(classes), X.shape[1]))
        self.priors_ = np.zeros(len(classes))

        for i, c in enumerate(classes):
            X_c = X[y == c]
            self.means_[i] = X_c.mean(axis=0)
            self.vars_[i] = X_c.var(axis=0) + 1e-9
            self.priors_[i] = X_c.shape[0] / X.shape[0]

        return self
```

预测时对每个特征用高斯 PDF,跨特征连乘(对数空间里是相加)。

### 演示:文本分类

代码生成模拟两个类别(科技文章 vs 体育文章)的合成词袋数据,每个类别有不同的词频分布,用 MultinomialNB 按词计数分类。

合成数据这样构造:创建 200 个"词"(特征列)。词 0–39 在科技文章中高频、体育文章中低频;词 80–119 相反;词 40–79 在两类中都是中频。这制造出真实场景:有些词是强类别指示词,有些是噪声。

### 演示:连续特征

代码生成类鸢尾花数据(3 个类别、4 个特征、高斯簇),GaussianNB 用逐类均值和方差分类。每个类别有不同的中心(均值向量)和不同的离散度(方差),模拟真实世界中各类别测量值存在系统性差异的情形。

代码还演示了:
- **平滑对比:** 用不同 alpha 训练 MultinomialNB,展示平滑强度对准确率的影响。
- **训练集规模实验:** 训练样本从 20 增到 1600 时 NB 准确率的变化。样本极少时 NB 也能拿到不错的准确率——这是它的主要优势。
- **混淆矩阵:** 逐类的精确率、召回率和 F1,展示 NB 在哪里犯错。

### 预测速度

朴素贝叶斯的预测就是矩阵乘法。对 n 个样本、d 个特征、k 个类别:
- MultinomialNB:一次矩阵乘法 (n x d) @ (d x k) = O(n · d · k)
- GaussianNB:n·k 次高斯 PDF 求值,每次覆盖 d 个特征 = O(n · d · k)

两者在每个维度上都是线性的。对比 KNN(要算到所有训练点的距离)或 RBF 核 SVM(要对所有支持向量做核求值),NB 的预测快上几个数量级。

## 投入使用

用 sklearn,两个变体都是一行起:

```python
from sklearn.naive_bayes import GaussianNB, MultinomialNB

gnb = GaussianNB()
gnb.fit(X_train, y_train)
print(f"GaussianNB accuracy: {gnb.score(X_test, y_test):.3f}")

mnb = MultinomialNB(alpha=1.0)
mnb.fit(X_train_counts, y_train)
print(f"MultinomialNB accuracy: {mnb.score(X_test_counts, y_test):.3f}")
```

用 sklearn 做文本分类:

```python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

text_clf = Pipeline([
    ("vectorizer", CountVectorizer()),
    ("classifier", MultinomialNB(alpha=1.0)),
])

text_clf.fit(train_texts, train_labels)
accuracy = text_clf.score(test_texts, test_labels)
```

`naive_bayes.py` 中的代码在相同数据上对比了从零实现与 sklearn,验证正确性。

### TF-IDF 配朴素贝叶斯

原始词频让每次出现的词权重相同。但"the"、"is"这类常用词在每个类别里都高频出现——它们不携带任何信息。TF-IDF(词频-逆文档频率)压低常见词、抬高稀有而有区分度的词。

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

text_clf = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", MultinomialNB(alpha=0.1)),
])
```

TF-IDF 值非负,与 MultinomialNB 兼容。TF-IDF + MultinomialNB 是文本分类最强的基线之一,在训练样本少于一万的数据集上经常击败更复杂的模型。

### 短文本用 BernoulliNB

短文本(推文、短信、聊天消息)上,BernoulliNB 可能胜过 MultinomialNB。短文本词数少,MultinomialNB 依赖的频率信息噪声大;BernoulliNB 只关心出现与否,在短文本上更可靠。

```python
from sklearn.naive_bayes import BernoulliNB
from sklearn.feature_extraction.text import CountVectorizer

text_clf = Pipeline([
    ("vectorizer", CountVectorizer(binary=True)),
    ("classifier", BernoulliNB(alpha=1.0)),
])
```

CountVectorizer 的 `binary=True` 把所有计数转成 0/1。不设它,BernoulliNB 也能跑,但它看到的计数并不是为它设计的输入形式。

### 校准 NB 概率

NB 的概率校准很差。它说 P(spam) = 0.95 时,真实概率可能只有 0.7。如果你需要可靠的概率估计(比如要设阈值,或与其他模型组合),用 sklearn 的 CalibratedClassifierCV:

```python
from sklearn.calibration import CalibratedClassifierCV

calibrated_nb = CalibratedClassifierCV(MultinomialNB(), cv=5, method="sigmoid")
calibrated_nb.fit(X_train, y_train)
proba = calibrated_nb.predict_proba(X_test)
```

它用交叉验证在 NB 原始分数之上再拟合一个逻辑回归,产出的概率会接近真实的类别频率。

### 常见坑

1. **特征为负。** MultinomialNB 要求特征非负。如果有负值(比如某些设置下的 TF-IDF,或标准化后的特征),改用 GaussianNB,或把特征平移成正。

2. **零方差特征。** GaussianNB 要除以方差。若某类别下某特征方差为零(所有值相同),概率计算会崩。代码给所有方差加了一个小平滑项(1e-9)来防止这种情况。

3. **类别不平衡。** 若 99% 的邮件都是正常邮件,先验 P(not-spam) = 0.99 强到会淹没似然证据。可以手动设置类别先验,或用 sklearn 的 class_prior 参数。

4. **特征缩放。** MultinomialNB 不需要缩放(它在计数上工作),GaussianNB 也不需要(它按特征估计统计量)。相比对特征尺度敏感的逻辑回归和 SVM,这是一个优势。

## 交付

本课产出:
- `outputs/skill-naive-bayes-chooser.md` —— 一个挑选合适 NB 变体的决策技能文档
- `code/naive_bayes.py` —— 从零实现的 MultinomialNB 与 GaussianNB,附 sklearn 对比

### 朴素贝叶斯什么时候会失败

当独立性假设导致错误的**排序**(而不只是错误的概率)时,NB 就失败了。这发生在:

1. **强特征交互。** 如果类别取决于两个特征的组合、而单独任一特征都说明不了什么(XOR 型模式),NB 会完全错过:每个特征单独都不提供证据,NB 又无法非线性组合它们。

2. **高度相关但证据相反的特征。** 特征 A 指向"spam",特征 B 指向"not-spam",而 A、B 实际上完全相关(现实中总是一致),NB 会在本不存在冲突的地方看到互相矛盾的证据。

3. **训练集非常大。** 数据足够多时,逻辑回归等判别式模型能学到真实的决策边界,超过 NB。小数据时帮了忙的独立性假设,此时成了拖累。

实践中,文本分类很少遇到这些失败模式:文本特征数量多、单个弱,独立性假设的误差往往相互抵消。对于特征少且强相关的表格数据,优先考虑逻辑回归或树模型。

## 练习

1. **平滑实验。** 在文本数据上用 alpha 取 0.01、0.1、1.0、10.0、100.0 训练 MultinomialNB,画出准确率随 alpha 变化的曲线。性能峰值在哪?为什么 alpha 太高反而有害?

2. **特征独立性检验。** 取一个真实文本数据集,挑两个明显相关的词(如"machine"和"learning")。计算 P(word1 | class) * P(word2 | class),与 P(word1 AND word2 | class) 对比。独立性假设错得有多离谱?它影响分类准确率吗?

3. **Bernoulli 实现。** 给代码扩展一个 BernoulliNB 类。把词袋转成二值(出现/缺席),在文本数据上与 MultinomialNB 对比准确率。Bernoulli 什么时候赢?

4. **NB vs 逻辑回归。** 在同一文本数据上训练两者,训练样本从 100 逐步增到 10,000,画出两者准确率随训练集规模变化的曲线。逻辑回归在什么时候反超朴素贝叶斯?

5. **垃圾邮件过滤器。** 构建完整的垃圾邮件分类器:分词原始邮件文本、建词表、造词袋特征、训练 MultinomialNB,用精确率和召回率评估(为什么不只看准确率?)。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|----------------------|
| 朴素贝叶斯 | "简单的概率分类器" | 应用贝叶斯定理、并假设给定类别时特征条件独立的分类器 |
| 条件独立 | "特征互不影响" | P(A, B \| C) = P(A \| C) * P(B \| C)——已知 C 后,知道 B 对判断 A 没有新帮助 |
| 拉普拉斯平滑 | "加一平滑" | 给每个特征加一个小计数,防止零概率主宰预测 |
| 先验 | "看到数据前相信什么" | P(class)——观察任何特征之前每个类别的概率 |
| 似然 | "数据有多吻合" | P(features \| class)——类别已知时观察到这些特征的概率 |
| 后验 | "看到数据后相信什么" | P(class \| features)——观察到特征之后类别的更新概率 |
| 生成式模型 | "建模数据如何生成" | 学习 P(X \| Y) 和 P(Y),再用贝叶斯定理得到 P(Y \| X) 的模型 |
| 判别式模型 | "建模决策边界" | 直接学习 P(Y \| X),不建模 X 如何生成的模型 |
| 对数概率 | "避免下溢" | 用 log P 代替 P 计算,防止许多小数连乘在浮点中变成零 |

## 延伸阅读

- [scikit-learn 朴素贝叶斯文档](https://scikit-learn.org/stable/modules/naive_bayes.html) —— 三种变体及数学细节
- [McCallum 与 Nigam,《朴素贝叶斯文本分类事件模型比较》(1998)](https://www.cs.cmu.edu/~knigam/papers/multinomial-aaaiws98.pdf) —— Multinomial 与 Bernoulli 在文本上的经典对比
- [Rennie 等,《改善朴素贝叶斯文本分类器的糟糕假设》(2003)](https://people.csail.mit.edu/jrennie/papers/icml03-nb.pdf) —— 对文本 NB 的改进
- [Ng 与 Jordan,《论判别式与生成式分类器》(2001)](https://ai.stanford.edu/~ang/papers/nips01-discriminativegenerative.pdf) —— 证明了 NB 比逻辑回归收敛更快、所需数据更少
