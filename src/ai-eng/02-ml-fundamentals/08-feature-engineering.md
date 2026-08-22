# 特征工程与特征选择

> 一个好特征,胜过一千个数据点。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 1 阶段(ML 统计、线性代数),第 2 阶段 第 1-7 课
**预计耗时:** 约 90 分钟

## 学习目标

- 实现数值变换(标准化、最小-最大缩放、对数变换、分箱),并讲清各自的适用场景
- 为类别特征构建 one-hot、label、target 三种编码,并识别 target 编码中的数据泄漏风险
- 从零构建 TF-IDF 向量化器,解释它为什么在文本分类上优于原始词频
- 应用基于过滤的特征选择(方差阈值、相关性、互信息)降低维度

## 问题

你拿到一个数据集,选了个算法,训练,效果平平。换个更花哨的算法,还是平平。花一周调超参数,提升微乎其微。

然后有人把原始数据变成了更好的特征,一个简单的逻辑回归就把你调好的梯度提升集成打得落花流水。

这种事太常见了。在经典 ML 里,数据的表示方式比算法的选择更重要。一个用"面积"和"卧室数"的房价模型,无论学习器多高级,都能碾压用"原始地址字符串"的模型。算法只能消化你喂给它的东西。

特征工程,是把原始数据变换成让模型更容易发现模式的表示的过程。特征选择,是把只添噪声不添信号的特征扔掉的过程。两者加起来,是经典 ML 里杠杆最高的动作。

## 概念

### 特征流水线

```mermaid
flowchart LR
    A[Raw Data] --> B[Handle Missing Values]
    B --> C[Numerical Transforms]
    B --> D[Categorical Encoding]
    B --> E[Text Features]
    C --> F[Feature Interactions]
    D --> F
    E --> F
    F --> G[Feature Selection]
    G --> H[Model-Ready Data]
```

### 数值特征

原始数字很少能直接喂给模型。常见变换:

**缩放(Scaling):** 把特征放到同一尺度,让基于距离的算法(K-Means、KNN、SVM)平等对待每个特征。最小-最大缩放映射到 [0, 1];标准化(z-score)映射到均值 0、标准差 1。

**对数变换:** 压缩右偏分布(收入、人口、词频)。把乘法关系变成加法关系。

**分箱(Binning):** 把连续值变成类别。当特征和目标呈非线性但阶梯状的关系时有用(比如年龄段)。

**多项式特征:** 生成 x^2、x^3、x1*x2 这样的项。让线性模型捕捉非线性关系,代价是特征变多。

### 类别特征

模型只吃数字,类别需要编码。

**One-hot 编码:** 每个类别生成一个 0/1 列。"color = red/blue/green" 变成三列:is_red、is_blue、is_green。类别少时好用,类别一多就爆炸。

**Label 编码:** 把每个类别映射成一个整数:red=0、blue=1、green=2。会引入虚假的排序(模型可能以为 green > blue > red)。只适合按单个值分裂的树模型。

**Target 编码:** 用该类别下目标变量的均值替换类别本身。威力大但危险:数据泄漏风险极高。必须只在训练集上计算,再应用到测试集。

### 文本特征

**词频向量化(Count vectorizer):** 统计每个词在文档中出现的次数。"the cat sat on the mat" 变成 {the: 2, cat: 1, sat: 1, on: 1, mat: 1}。

**TF-IDF:** 词频-逆文档频率。按词在文档集合中的独特程度加权。"the" 这种大路货权重低;稀有、有区分度的词权重高。

```
TF(word, doc) = count(word in doc) / total words in doc
IDF(word) = log(total docs / docs containing word)
TF-IDF = TF * IDF
```

### 缺失值

真实数据总有窟窿。应对策略:

- **删行:** 只在缺失很少且随机时用
- **均值/中位数填充:** 简单,保持分布形状(中位数对离群值更稳)
- **众数填充:** 用于类别特征
- **缺失指示列:** 填充前先加一列 "was_this_missing" 的 0/1 列。"数据缺失"这件事本身可能就携带信息
- **前向/后向填充:** 用于时间序列

### 特征交互

有时候信号藏在组合里。光有"身高"和"体重",不如"BMI = 体重 / 身高²"有预测力。特征交互会让特征空间成倍膨胀,所以要用领域知识挑对的组合。

### 特征选择

特征不是越多越好。无关特征添噪声、拖慢训练,还会导致过拟合。

**过滤法(建模前):**
- 相关性:删掉彼此高度相关的特征(冗余)
- 互信息:衡量知道某特征后,目标的不确定性减少了多少
- 方差阈值:删掉几乎不变化的特征

**包装法(基于模型):**
- L1 正则(Lasso):把无关特征的权重压到恰好为零
- 递归特征消除:训练、删掉最不重要的特征、重复

**为什么要做选择:** 一个用 10 个好特征的模型,通常能打赢用 10 个好特征加 90 个噪声特征的模型。噪声特征给了模型过拟合训练数据的机会,而那些模式无法泛化。

```figure
feature-scaling
```

## 动手构建

### 第 1 步:从零实现数值变换

```python
import math


def min_max_scale(values):
    min_val = min(values)
    max_val = max(values)
    if max_val == min_val:
        return [0.0] * len(values)
    return [(v - min_val) / (max_val - min_val) for v in values]


def standardize(values):
    n = len(values)
    mean = sum(values) / n
    variance = sum((v - mean) ** 2 for v in values) / n
    std = math.sqrt(variance) if variance > 0 else 1.0
    return [(v - mean) / std for v in values]


def log_transform(values):
    return [math.log(v + 1) for v in values]


def bin_values(values, n_bins=5):
    min_val = min(values)
    max_val = max(values)
    bin_width = (max_val - min_val) / n_bins
    if bin_width == 0:
        return [0] * len(values)
    result = []
    for v in values:
        bin_idx = int((v - min_val) / bin_width)
        bin_idx = min(bin_idx, n_bins - 1)
        result.append(bin_idx)
    return result


def polynomial_features(row, degree=2):
    n = len(row)
    result = list(row)
    if degree >= 2:
        for i in range(n):
            result.append(row[i] ** 2)
        for i in range(n):
            for j in range(i + 1, n):
                result.append(row[i] * row[j])
    return result
```

### 第 2 步:从零实现类别编码

```python
def one_hot_encode(values):
    categories = sorted(set(values))
    cat_to_idx = {cat: i for i, cat in enumerate(categories)}
    n_cats = len(categories)

    encoded = []
    for v in values:
        row = [0] * n_cats
        row[cat_to_idx[v]] = 1
        encoded.append(row)

    return encoded, categories


def label_encode(values):
    categories = sorted(set(values))
    cat_to_int = {cat: i for i, cat in enumerate(categories)}
    return [cat_to_int[v] for v in values], cat_to_int


def target_encode(feature_values, target_values, smoothing=10):
    global_mean = sum(target_values) / len(target_values)

    category_stats = {}
    for feat, target in zip(feature_values, target_values):
        if feat not in category_stats:
            category_stats[feat] = {"sum": 0.0, "count": 0}
        category_stats[feat]["sum"] += target
        category_stats[feat]["count"] += 1

    encoding = {}
    for cat, stats in category_stats.items():
        cat_mean = stats["sum"] / stats["count"]
        weight = stats["count"] / (stats["count"] + smoothing)
        encoding[cat] = weight * cat_mean + (1 - weight) * global_mean

    return [encoding[v] for v in feature_values], encoding
```

### 第 3 步:从零实现文本特征

```python
def count_vectorize(documents):
    vocab = {}
    idx = 0
    for doc in documents:
        for word in doc.lower().split():
            if word not in vocab:
                vocab[word] = idx
                idx += 1

    vectors = []
    for doc in documents:
        vec = [0] * len(vocab)
        for word in doc.lower().split():
            vec[vocab[word]] += 1
        vectors.append(vec)

    return vectors, vocab


def tfidf(documents):
    n_docs = len(documents)

    vocab = {}
    idx = 0
    for doc in documents:
        for word in doc.lower().split():
            if word not in vocab:
                vocab[word] = idx
                idx += 1

    doc_freq = {}
    for doc in documents:
        seen = set()
        for word in doc.lower().split():
            if word not in seen:
                doc_freq[word] = doc_freq.get(word, 0) + 1
                seen.add(word)

    vectors = []
    for doc in documents:
        words = doc.lower().split()
        word_count = len(words)
        tf_map = {}
        for word in words:
            tf_map[word] = tf_map.get(word, 0) + 1

        vec = [0.0] * len(vocab)
        for word, count in tf_map.items():
            tf = count / word_count
            idf = math.log(n_docs / doc_freq[word])
            vec[vocab[word]] = tf * idf
        vectors.append(vec)

    return vectors, vocab
```

### 第 4 步:从零实现缺失值填充

```python
def impute_mean(values):
    present = [v for v in values if v is not None]
    if not present:
        return [0.0] * len(values), 0.0
    mean = sum(present) / len(present)
    return [v if v is not None else mean for v in values], mean


def impute_median(values):
    present = sorted(v for v in values if v is not None)
    if not present:
        return [0.0] * len(values), 0.0
    n = len(present)
    if n % 2 == 0:
        median = (present[n // 2 - 1] + present[n // 2]) / 2
    else:
        median = present[n // 2]
    return [v if v is not None else median for v in values], median


def impute_mode(values):
    present = [v for v in values if v is not None]
    if not present:
        return values, None
    counts = {}
    for v in present:
        counts[v] = counts.get(v, 0) + 1
    mode = max(counts, key=counts.get)
    return [v if v is not None else mode for v in values], mode


def add_missing_indicator(values):
    return [0 if v is not None else 1 for v in values]
```

### 第 5 步:从零实现特征选择

```python
def correlation(x, y):
    n = len(x)
    mean_x = sum(x) / n
    mean_y = sum(y) / n
    cov = sum((xi - mean_x) * (yi - mean_y) for xi, yi in zip(x, y)) / n
    std_x = math.sqrt(sum((xi - mean_x) ** 2 for xi in x) / n)
    std_y = math.sqrt(sum((yi - mean_y) ** 2 for yi in y) / n)
    if std_x == 0 or std_y == 0:
        return 0.0
    return cov / (std_x * std_y)


def mutual_information(feature, target, n_bins=10):
    feat_min = min(feature)
    feat_max = max(feature)
    bin_width = (feat_max - feat_min) / n_bins if feat_max != feat_min else 1.0
    feat_binned = [
        min(int((f - feat_min) / bin_width), n_bins - 1) for f in feature
    ]

    n = len(feature)
    target_classes = sorted(set(target))

    feat_bins = sorted(set(feat_binned))
    p_feat = {}
    for b in feat_bins:
        p_feat[b] = feat_binned.count(b) / n

    p_target = {}
    for t in target_classes:
        p_target[t] = target.count(t) / n

    mi = 0.0
    for b in feat_bins:
        for t in target_classes:
            joint_count = sum(
                1 for fb, tv in zip(feat_binned, target) if fb == b and tv == t
            )
            p_joint = joint_count / n
            if p_joint > 0:
                mi += p_joint * math.log(p_joint / (p_feat[b] * p_target[t]))

    return mi


def variance_threshold(features, threshold=0.01):
    n_features = len(features[0])
    n_samples = len(features)
    selected = []

    for j in range(n_features):
        col = [features[i][j] for i in range(n_samples)]
        mean = sum(col) / n_samples
        var = sum((v - mean) ** 2 for v in col) / n_samples
        if var >= threshold:
            selected.append(j)

    return selected


def remove_correlated(features, threshold=0.9):
    n_features = len(features[0])
    n_samples = len(features)

    to_remove = set()
    for i in range(n_features):
        if i in to_remove:
            continue
        col_i = [features[r][i] for r in range(n_samples)]
        for j in range(i + 1, n_features):
            if j in to_remove:
                continue
            col_j = [features[r][j] for r in range(n_samples)]
            corr = abs(correlation(col_i, col_j))
            if corr >= threshold:
                to_remove.add(j)

    return [i for i in range(n_features) if i not in to_remove]
```

### 第 6 步:完整流水线与演示

```python
import random


def make_housing_data(n=200, seed=42):
    random.seed(seed)
    data = []
    for _ in range(n):
        sqft = random.uniform(500, 5000)
        bedrooms = random.choice([1, 2, 3, 4, 5])
        age = random.uniform(0, 50)
        neighborhood = random.choice(["downtown", "suburbs", "rural"])
        has_pool = random.choice([True, False])

        sqft_with_missing = sqft if random.random() > 0.05 else None
        age_with_missing = age if random.random() > 0.08 else None

        price = (
            50 * sqft
            + 20000 * bedrooms
            - 1000 * age
            + (50000 if neighborhood == "downtown" else 10000 if neighborhood == "suburbs" else 0)
            + (15000 if has_pool else 0)
            + random.gauss(0, 20000)
        )

        data.append({
            "sqft": sqft_with_missing,
            "bedrooms": bedrooms,
            "age": age_with_missing,
            "neighborhood": neighborhood,
            "has_pool": has_pool,
            "price": price,
        })
    return data


if __name__ == "__main__":
    data = make_housing_data(200)

    print("=== Raw Data Sample ===")
    for row in data[:3]:
        print(f"  {row}")

    sqft_raw = [d["sqft"] for d in data]
    age_raw = [d["age"] for d in data]
    prices = [d["price"] for d in data]

    print("\n=== Missing Value Handling ===")
    sqft_missing = sum(1 for v in sqft_raw if v is None)
    age_missing = sum(1 for v in age_raw if v is None)
    print(f"  sqft missing: {sqft_missing}/{len(sqft_raw)}")
    print(f"  age missing: {age_missing}/{len(age_raw)}")

    sqft_indicator = add_missing_indicator(sqft_raw)
    age_indicator = add_missing_indicator(age_raw)
    sqft_imputed, sqft_fill = impute_median(sqft_raw)
    age_imputed, age_fill = impute_mean(age_raw)
    print(f"  sqft filled with median: {sqft_fill:.0f}")
    print(f"  age filled with mean: {age_fill:.1f}")

    print("\n=== Numerical Transforms ===")
    sqft_scaled = standardize(sqft_imputed)
    age_scaled = min_max_scale(age_imputed)
    sqft_log = log_transform(sqft_imputed)
    age_binned = bin_values(age_imputed, n_bins=5)
    print(f"  sqft standardized: mean={sum(sqft_scaled)/len(sqft_scaled):.4f}, std={math.sqrt(sum(v**2 for v in sqft_scaled)/len(sqft_scaled)):.4f}")
    print(f"  age min-max: [{min(age_scaled):.2f}, {max(age_scaled):.2f}]")
    print(f"  age bins: {sorted(set(age_binned))}")

    print("\n=== Categorical Encoding ===")
    neighborhoods = [d["neighborhood"] for d in data]

    ohe, ohe_cats = one_hot_encode(neighborhoods)
    print(f"  One-hot categories: {ohe_cats}")
    print(f"  Sample encoding: {neighborhoods[0]} -> {ohe[0]}")

    le, le_map = label_encode(neighborhoods)
    print(f"  Label encoding map: {le_map}")

    te, te_map = target_encode(neighborhoods, prices, smoothing=10)
    print(f"  Target encoding: {({k: round(v) for k, v in te_map.items()})}")

    print("\n=== Text Features ===")
    descriptions = [
        "large modern house with pool",
        "small cozy cottage near downtown",
        "spacious family home with large yard",
        "modern apartment downtown with view",
        "rustic cabin in rural area",
    ]
    cv, cv_vocab = count_vectorize(descriptions)
    print(f"  Vocabulary size: {len(cv_vocab)}")
    print(f"  Doc 0 non-zero features: {sum(1 for v in cv[0] if v > 0)}")

    tf, tf_vocab = tfidf(descriptions)
    print(f"  TF-IDF vocabulary size: {len(tf_vocab)}")
    top_words = sorted(tf_vocab.keys(), key=lambda w: tf[0][tf_vocab[w]], reverse=True)[:3]
    print(f"  Doc 0 top TF-IDF words: {top_words}")

    print("\n=== Polynomial Features ===")
    sample_row = [sqft_scaled[0], age_scaled[0]]
    poly = polynomial_features(sample_row, degree=2)
    print(f"  Input: {[round(v, 4) for v in sample_row]}")
    print(f"  Polynomial: {[round(v, 4) for v in poly]}")
    print(f"  Features: [x1, x2, x1^2, x2^2, x1*x2]")

    print("\n=== Feature Selection ===")
    feature_matrix = [
        [sqft_scaled[i], age_scaled[i], float(sqft_indicator[i]), float(age_indicator[i])]
        + ohe[i]
        for i in range(len(data))
    ]

    print(f"  Total features: {len(feature_matrix[0])}")

    surviving_var = variance_threshold(feature_matrix, threshold=0.01)
    print(f"  After variance threshold (0.01): {len(surviving_var)} features kept")

    surviving_corr = remove_correlated(feature_matrix, threshold=0.9)
    print(f"  After correlation filter (0.9): {len(surviving_corr)} features kept")

    binary_prices = [1 if p > sum(prices) / len(prices) else 0 for p in prices]
    print("\n  Mutual information with target:")
    feature_names = ["sqft", "age", "sqft_missing", "age_missing"] + [f"neigh_{c}" for c in ohe_cats]
    for j in range(len(feature_matrix[0])):
        col = [feature_matrix[i][j] for i in range(len(feature_matrix))]
        mi = mutual_information(col, binary_prices, n_bins=10)
        print(f"    {feature_names[j]}: MI={mi:.4f}")

    print("\n  Correlation with price:")
    for j in range(len(feature_matrix[0])):
        col = [feature_matrix[i][j] for i in range(len(feature_matrix))]
        corr = correlation(col, prices)
        print(f"    {feature_names[j]}: r={corr:.4f}")
```

## 投入使用

用 scikit-learn,这些变换可以拼成流水线:

```python
from sklearn.preprocessing import StandardScaler, OneHotEncoder, PolynomialFeatures
from sklearn.impute import SimpleImputer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_selection import mutual_info_classif, VarianceThreshold
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

numeric_pipe = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
])

categorical_pipe = Pipeline([
    ("encoder", OneHotEncoder(sparse_output=False)),
])

preprocessor = ColumnTransformer([
    ("num", numeric_pipe, ["sqft", "age"]),
    ("cat", categorical_pipe, ["neighborhood"]),
])
```

从零实现的版本让你看清每种变换内部发生了什么。库的版本补上了边界情况处理、稀疏矩阵支持和流水线组合能力,但数学是一样的。

## 交付

本课产出:
- `outputs/prompt-feature-engineer.md` —— 一条系统性地从原始数据构造特征的提示词

## 练习

1. 给数值变换加上稳健缩放(robust scaling,用中位数和四分位距代替均值和标准差)。在含极端离群值的数据上和标准化做对比。
2. 实现留一法 target 编码:对每一行,计算目标均值时排除该行自身的目标值。展示它相对朴素 target 编码如何缓解过拟合。
3. 搭一条自动特征选择流水线,组合方差阈值、相关性过滤和互信息排序。应用到房价数据集上,用简单线性回归对比全特征与精选特征的模型表现。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|----------------------|
| 特征工程 | "造新列" | 把原始数据变换成能把模式暴露给模型的表示 |
| 标准化 | "弄成正态的" | 减均值再除以标准差,让特征均值=0、标准差=1 |
| One-hot 编码 | "造虚拟变量" | 每个类别一个 0/1 列,每行恰好有一列是 1 |
| Target 编码 | "拿答案来编码" | 用该类别的目标均值替换类别,带平滑以防过拟合 |
| TF-IDF | "高级词频" | 词频乘逆文档频率:按词在整个语料中的区分度加权 |
| 填充(Imputation) | "补空" | 用估计值(均值、中位数、众数或模型预测值)替换缺失值 |
| 特征选择 | "扔掉烂列" | 删掉添噪声或冗余的特征,只留对目标有信号的 |
| 互信息 | "一个东西能告诉你另一个东西多少" | 观察到变量 X 后,对变量 Y 不确定性的减少量 |
| 数据泄漏 | "不小心作弊" | 训练时用了预测时拿不到的信息,得到虚高的好结果 |

## 延伸阅读

- [Feature Engineering and Selection(Max Kuhn & Kjell Johnson)](http://www.feat.engineering/) —— 免费在线书,覆盖特征工程全景
- [scikit-learn 预处理指南](https://scikit-learn.org/stable/modules/preprocessing.html) —— 所有标准变换的实战参考
- [Target Encoding Done Right(Micci-Barreca, 2001)](https://dl.acm.org/doi/10.1145/507533.507538) —— 带平滑的 target 编码原始论文
