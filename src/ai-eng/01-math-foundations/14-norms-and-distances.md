# 范数与距离

> 距离函数定义了什么叫"相似"。选错了,下游一切都会跟着错。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 1 阶段,第 01 课(线性代数直觉)、第 02 课(向量、矩阵与运算)
**预计耗时:** 约 90 分钟

## 学习目标

- 从零实现 L1、L2、余弦、马氏(Mahalanobis)、Jaccard 和编辑距离
- 为给定的 ML 任务选择合适的距离度量,并解释为什么其他选择不行
- 把 L1、L2 范数与 LASSO、Ridge 正则化及其几何约束区域联系起来
- 演示同一份数据在不同度量下会产生不同的最近邻

## 问题

你有两个向量。也许是词嵌入,也许是用户画像,也许是像素数组。你需要知道:它们有多接近?

答案完全取决于你选哪个距离函数。两个数据点在一种度量下是最近邻,换一种度量可能天各一方。你的 KNN 分类器、推荐引擎、向量数据库、聚类算法、损失函数——全都建立在这个选择之上。选错了,模型优化的就是错误的目标。

不存在 universally 最好的距离。L2 适合空间数据,余弦相似度统治 NLP,Jaccard 处理集合,编辑距离处理字符串,马氏距离考虑相关性,Wasserstein 搬运概率质量。每一种都编码了对"相似"含义的不同假设。

本课将从零构建所有主流距离函数,告诉你每种何时是正确工具,并演示同一份数据在不同度量下会产生完全不同的最近邻。

## 概念

### 范数:度量向量的"大小"

范数衡量向量的"大小"。任意两个向量之间的距离都可以写成它们差向量的范数:d(a, b) = ||a - b||。所以理解了范数,就理解了距离。

### L1 范数(曼哈顿距离)

L1 范数是所有分量绝对值之和。

```
||x||_1 = |x_1| + |x_2| + ... + |x_n|
```

之所以叫曼哈顿距离,是因为它度量的是在只能沿坐标轴移动的城市网格上要走多远——不许走对角线。

```
Point A = (1, 1)
Point B = (4, 5)

L1 distance = |4-1| + |5-1| = 3 + 4 = 7

On a grid, you walk 3 blocks east and 4 blocks north.
```

什么时候用 L1:

- 高维稀疏数据(文本特征、one-hot 编码)
- 需要对离群点鲁棒时(单个巨大差异不会主导结果)
- 特征选择问题(L1 正则化促进稀疏性)

与 L1 正则化(Lasso)的联系:把 ||w||_1 加进损失函数,惩罚的是权重绝对值之和。这会把较小的权重压到恰好为零,实现自动特征选择。L1 惩罚在权重空间中形成菱形约束区域,而菱形的角正好落在坐标轴上——那里某些权重为零。

与损失函数的联系:平均绝对误差(MAE)就是预测值与目标值之间的平均 L1 距离。它对所有误差线性惩罚,因此相比 MSE 对离群点更鲁棒。

### L2 范数(欧氏距离)

L2 范数是直线距离:各分量平方和的平方根。

```
||x||_2 = sqrt(x_1^2 + x_2^2 + ... + x_n^2)
```

这就是你在几何课上学过的距离——n 维空间里的勾股定理。

```
Point A = (1, 1)
Point B = (4, 5)

L2 distance = sqrt((4-1)^2 + (5-1)^2) = sqrt(9 + 16) = sqrt(25) = 5.0

The straight line, cutting diagonally through the grid.
```

什么时候用 L2:

- 低维到中等维度的连续数据
- 各特征尺度相近时
- 物理距离(空间数据、传感器读数)
- 像素级的图像相似度

与 L2 正则化(Ridge)的联系:把 ||w||_2^2 加进损失函数,惩罚的是大权重。与 L1 不同,它不会把权重压到零,而是按比例把所有权重向零收缩。L2 惩罚形成圆形约束区域,坐标轴上没有角点。权重会变小,但很少恰好为零。

与损失函数的联系:均方误差(MSE)就是 L2 距离平方的平均。平方操作让大误差受到的惩罚远重于小误差。

```
MAE (L1 loss):  |y - y_hat|         Linear penalty. Robust to outliers.
MSE (L2 loss):  (y - y_hat)^2       Quadratic penalty. Sensitive to outliers.
```

### Lp 范数:通用家族

L1 和 L2 都是 Lp 范数的特例:

```
||x||_p = (|x_1|^p + |x_2|^p + ... + |x_n|^p)^(1/p)
```

p 取不同值,"单位球"(所有与原点距离为 1 的点构成的集合)形状也不同:

```
p=1:    Diamond shape      (corners on axes)
p=2:    Circle/sphere      (the usual round ball)
p=3:    Superellipse       (rounded square)
p=inf:  Square/hypercube   (flat sides along axes)
```

### L-无穷范数(切比雪夫距离)

当 p 趋于无穷,Lp 范数收敛到绝对值最大的那个分量。

```
||x||_inf = max(|x_1|, |x_2|, ..., |x_n|)
```

两点之间的距离由它们差异最大的那个维度决定,其他维度全部被忽略。

```
Point A = (1, 1)
Point B = (4, 5)

L-inf distance = max(|4-1|, |5-1|) = max(3, 4) = 4
```

什么时候用 L-无穷:

- 当任意单一维度的最坏偏差很关键时
- 棋盘(国际象棋中的王走的就是 L-无穷:向任意方向走一步代价都是 1)
- 制造业公差(每个维度都必须在规格内)

### 余弦相似度与余弦距离

余弦相似度度量两个向量之间的夹角,忽略它们的模长。

```
cos_sim(a, b) = (a . b) / (||a||_2 * ||b||_2)
```

取值范围从 -1(方向相反)到 +1(方向相同)。垂直向量的余弦相似度为 0。

余弦距离把它转成距离:cosine_distance = 1 - cosine_similarity。范围从 0(方向完全相同)到 2(方向完全相反)。

```
a = (1, 0)    b = (1, 1)

cos_sim = (1*1 + 0*1) / (1 * sqrt(2)) = 1/sqrt(2) = 0.707
cos_dist = 1 - 0.707 = 0.293
```

为什么余弦统治 NLP 和嵌入:在文本中,文档长度不应影响相似度。一篇讲猫的文档长度是另一篇讲猫文档的两倍,它们仍然应该"相似"。余弦相似度忽略模长(长度),只关心方向。词分布相同但长度不同的两篇文档指向同一方向,余弦相似度就是 1.0。

什么时候用余弦相似度:

- 文本相似度(TF-IDF 向量、词嵌入、句嵌入)
- 任何"模长是噪声、方向才是信号"的领域
- 推荐系统(用户偏好向量)
- 嵌入检索(向量数据库几乎总是用余弦或点积)

### 点积相似度 vs 余弦相似度

两个向量的点积是:

```
a . b = a_1*b_1 + a_2*b_2 + ... + a_n*b_n
      = ||a|| * ||b|| * cos(angle)
```

余弦相似度就是点积除以两个模长做归一化。当两个向量都已单位化(模长 = 1)时,点积和余弦相似度完全相等。

```
If ||a|| = 1 and ||b|| = 1:
    a . b = cos(angle between a and b)
```

两者何时不同:点积包含模长信息。模长更大的向量会拿到更高的点积分数。在某些检索系统中这很有用——你可能希望"热门"条目排在前面,模长就充当了隐含的质量或重要性信号。

```
a = (3, 0)    b = (1, 0)    c = (0, 1)

dot(a, b) = 3     dot(a, c) = 0
cos(a, b) = 1.0   cos(a, c) = 0.0

Both agree on direction, but dot product also reflects magnitude.
```

实践中:

- 想要纯粹的方向相似度,用余弦相似度
- 模长携带有意义信息时,用点积
- 很多向量数据库(Pinecone、Weaviate、Qdrant)允许你在两者之间选择
- 如果你的嵌入做了 L2 归一化,选哪个都一样

### 马氏距离(Mahalanobis Distance)

欧氏距离对所有维度一视同仁。但如果特征之间存在相关性或尺度不同,L2 会给出误导性的结果。

马氏距离考虑了数据的协方差结构。

```
d_M(x, y) = sqrt((x - y)^T * S^(-1) * (x - y))
```

其中 S 是数据的协方差矩阵。

直觉上:马氏距离先对数据去相关并归一化(白化),然后在变换后的空间里算 L2 距离。如果 S 是单位矩阵(特征不相关、方差为 1),马氏距离就退化为欧氏距离。

```
Example: height and weight are correlated.
Someone 6'2" and 180 lbs is not unusual.
Someone 5'0" and 180 lbs is unusual.

Euclidean distance might say they are equally far from the mean.
Mahalanobis distance correctly identifies the second as an outlier
because it accounts for the height-weight correlation.
```

什么时候用马氏距离:

- 离群点检测(与均值马氏距离大的点就是离群点)
- 特征尺度和相关性各不相同时的分类
- 有足够数据估计可靠协方差矩阵时
- 制造业质量控制(多变量过程监控)

### Jaccard 相似度(用于集合)

Jaccard 相似度度量两个集合的重叠程度。

```
J(A, B) = |A intersect B| / |A union B|
```

取值从 0(毫无重叠)到 1(完全相同)。Jaccard 距离 = 1 - Jaccard 相似度。

```
A = {cat, dog, fish}
B = {cat, bird, fish, snake}

Intersection = {cat, fish}         size = 2
Union = {cat, dog, fish, bird, snake}  size = 5

Jaccard similarity = 2/5 = 0.4
Jaccard distance = 0.6
```

什么时候用 Jaccard:

- 比较标签、类别或特征集合
- 基于词出现与否(而非频率)的文档相似度
- 近似重复检测(Jaccard 的 MinHash 近似)
- 比较二值特征向量(出现/缺失数据)
- 评估分割模型(IoU 交并比就是 Jaccard)

### 编辑距离(Levenshtein Distance)

编辑距离是把一个字符串变成另一个字符串所需的最少单字符操作次数。操作有三种:插入、删除、替换。

```
"kitten" -> "sitting"

kitten -> sitten  (substitute k -> s)
sitten -> sittin  (substitute e -> i)
sittin -> sitting (insert g)

Edit distance = 3
```

用动态规划计算:填一个矩阵,其中 (i, j) 项表示字符串 A 的前 i 个字符与字符串 B 的前 j 个字符之间的编辑距离。

```
        ""  s  i  t  t  i  n  g
    ""   0  1  2  3  4  5  6  7
    k    1  1  2  3  4  5  6  7
    i    2  2  1  2  3  4  5  6
    t    3  3  2  1  2  3  4  5
    t    4  4  3  2  1  2  3  4
    e    5  5  4  3  2  2  3  4
    n    6  6  5  4  3  3  2  3
```

什么时候用编辑距离:

- 拼写检查与纠错
- DNA 序列比对(使用加权操作)
- 模糊字符串匹配
- 脏文本数据的去重

### KL 散度(不是距离,但常被当距离用)

KL 散度度量一个概率分布与另一个概率分布的差异。第 09 课讲过,但它属于这里的讨论,因为人们总把它当"距离"用——尽管它不是。

```
D_KL(P || Q) = sum(p(x) * log(p(x) / q(x)))
```

关键性质:KL 散度不对称。

```
D_KL(P || Q) != D_KL(Q || P)
```

这意味着它不满足距离度量的基本要求,也不满足三角不等式。它是散度(divergence),不是距离。

前向 KL(D_KL(P || Q))是"求均值"的:Q 试图覆盖 P 的所有众数(mode)。
反向 KL(D_KL(Q || P))是"求众数"的:Q 聚焦在 P 的单个众数上。

你会在这些地方见到 KL 散度:

- VAE(ELBO 中的 KL 项把潜在分布推近先验)
- 知识蒸馏(学生模型试图匹配教师模型的分布)
- RLHF(KL 惩罚让微调后的模型不偏离基座模型太远)
- 策略梯度方法(约束策略更新幅度)

### Wasserstein 距离(推土机距离)

Wasserstein 距离度量把一个概率分布变成另一个所需的最小"工作量"。想象成:一个分布是一堆土,另一个是一个坑,你要搬多少土、搬多远?

```
W(P, Q) = inf over all transport plans gamma of E[d(x, y)]
```

对一维分布,它简化为累积分布函数之差的绝对值的积分:

```
W_1(P, Q) = integral |CDF_P(x) - CDF_Q(x)| dx
```

Wasserstein 为什么重要:

- 它是真正的度量(对称、满足三角不等式)
- 即使两个分布不重叠,它也能提供梯度(此时 KL 散度会趋于无穷)
- 正是这个性质让它成为 Wasserstein GAN(WGAN)的核心,解决了原始 GAN 的训练不稳定问题

```
Distributions with no overlap:

P: [1, 0, 0, 0, 0]    Q: [0, 0, 0, 0, 1]

KL divergence: infinity (log of zero)
Wasserstein: 4 (move all mass 4 bins)

Wasserstein gives a meaningful gradient. KL does not.
```

什么时候用 Wasserstein:

- GAN 训练(WGAN、WGAN-GP)
- 比较可能不重叠的分布
- 最优传输问题
- 图像检索(比较颜色直方图)

### 为什么不同任务需要不同距离

| 任务 | 最佳距离 | 原因 |
|------|--------------|-----|
| 文本相似度 | 余弦 | 模长是噪声,方向才是意义 |
| 图像像素比较 | L2 | 空间关系重要,特征尺度相近 |
| 稀疏高维特征 | L1 | 鲁棒,不放大罕见的大差异 |
| 集合重叠(标签、类别) | Jaccard | 数据天然是集合而非向量 |
| 字符串匹配 | 编辑距离 | 操作对应人类的编辑直觉 |
| 离群点检测 | 马氏距离 | 考虑特征相关性与尺度 |
| 比较分布 | KL 散度 | 度量用 Q 代替 P 损失的信息量 |
| GAN 训练 | Wasserstein | 分布不重叠时也能提供梯度 |
| 嵌入(向量数据库) | 余弦或点积 | 嵌入被训练成把意义编码进方向 |
| 推荐 | 点积 | 模长可编码流行度或置信度 |
| DNA 序列 | 加权编辑距离 | 不同核苷酸对的替换代价不同 |
| 制造业质检 | L-无穷 | 任意维度的最坏偏差很关键 |

### 与损失函数的联系

损失函数就是作用在"预测 vs 目标"上的距离函数。

```
Loss function       Distance it uses       Behavior
MSE                 L2 squared             Penalizes large errors heavily
MAE                 L1                     Penalizes all errors equally
Huber loss          L1 for large errors,   Best of both: robust to outliers,
                    L2 for small errors    smooth gradient near zero
Cross-entropy       KL divergence          Measures distribution mismatch
Hinge loss          max(0, margin - d)     Only penalizes below margin
Triplet loss        L2 (typically)         Pulls positives close, pushes
                                           negatives away
Contrastive loss    L2                     Similar pairs close, dissimilar
                                           pairs beyond margin
```

### 与正则化的联系

正则化就是在损失函数上加一个关于权重的范数惩罚项。

```
L1 regularization (Lasso):   loss + lambda * ||w||_1
  -> Sparse weights. Some weights become exactly zero.
  -> Automatic feature selection.
  -> Solution has corners (non-differentiable at zero).

L2 regularization (Ridge):   loss + lambda * ||w||_2^2
  -> Small weights. All weights shrink toward zero.
  -> No feature selection (nothing goes to exactly zero).
  -> Smooth solution everywhere.

Elastic Net:                  loss + lambda_1 * ||w||_1 + lambda_2 * ||w||_2^2
  -> Combines sparsity of L1 with stability of L2.
  -> Groups of correlated features are kept or dropped together.
```

为什么 L1 产生稀疏而 L2 不产生:想象二维权重空间中的约束区域。L1 是菱形,L2 是圆形。损失函数的等高线(椭圆)最可能先碰到菱形的角——那里某个权重为零;而碰到圆时总是在平滑点上——两个权重都非零。

### 最近邻搜索

每种距离函数都隐含一个最近邻搜索问题:给定查询点,在数据集中找最接近的点。

精确最近邻搜索在 n 个点、d 维的数据集上,每次查询是 O(n * d)。数据集一大,就慢得不可接受。

近似最近邻(ANN)算法用一点点精度换数量级的速度提升:

```
Algorithm         Approach                      Used by
KD-trees          Axis-aligned space partition   scikit-learn (low-dim)
Ball trees        Nested hyperspheres            scikit-learn (medium-dim)
LSH               Random hash projections        Near-duplicate detection
HNSW              Hierarchical navigable         FAISS, Qdrant, Weaviate
                  small-world graph
IVF               Inverted file index with       FAISS (billion-scale)
                  cluster-based search
Product quant.    Compress vectors, search       FAISS (memory-constrained)
                  in compressed space
```

HNSW(分层可导航小世界图)是现代向量数据库中的主流算法。它构建一个多层图,每个节点连接到自己的近似最近邻。搜索从顶层(稀疏、大跳)开始,逐层下降到底层(稠密、小跳)。

```figure
norm-unit-balls
```

## 动手构建

### 第 1 步:所有范数与距离函数

完整实现见 `code/distances.py`。每个函数都只用基础 Python 数学从零构建。

### 第 2 步:同样的数据,不同的距离,不同的邻居

`distances.py` 中的演示会创建一个数据集、选一个查询点,展示最近邻如何随距离度量而变化。在 L1 下"最近"的点,在 L2 或余弦下可能不是最近。

### 第 3 步:嵌入相似度搜索

代码里包含一个模拟的嵌入相似度搜索:分别用余弦相似度和 L2 距离找出与查询最相似的"文档",展示两种排名可以不同。

## 投入使用

最常见的实际用途:在向量数据库中查找相似条目。

```python
import numpy as np

def cosine_similarity_matrix(X):
    norms = np.linalg.norm(X, axis=1, keepdims=True)
    norms = np.where(norms == 0, 1, norms)
    X_normalized = X / norms
    return X_normalized @ X_normalized.T

embeddings = np.random.randn(1000, 768)

sim_matrix = cosine_similarity_matrix(embeddings)

query_idx = 0
similarities = sim_matrix[query_idx]
top_k = np.argsort(similarities)[::-1][1:6]
print(f"Top 5 most similar to item 0: {top_k}")
print(f"Similarities: {similarities[top_k]}")
```

当你调用 `model.encode(text)` 然后去查向量数据库时,底层发生的就是这件事:嵌入模型把文本映射成向量,向量数据库计算查询向量与每个库存向量的余弦相似度(或点积),并用 ANN 算法避免逐个检查。

## 练习

1. 计算 (1, 2, 3) 与 (4, 0, 6) 之间的 L1、L2 和 L-无穷距离。验证对任意两点,L-inf <= L2 <= L1 恒成立,并证明为什么这个顺序是必然保证的。

2. 构造两个向量,使它们余弦相似度很高(> 0.9)但 L2 距离很大(> 10)。从几何上解释发生了什么。然后再构造两个向量,使余弦相似度很低(< 0.3)但 L2 距离很小(< 0.5)。

3. 实现一个函数:输入数据集和查询点,分别返回 L1、L2、余弦和马氏距离下的最近邻。找一个四种度量给出的最近邻全都不相同的数据集。

4. 用 CDF 方法手工计算 [0.5, 0.5, 0, 0] 与 [0, 0, 0.5, 0.5] 之间的 Wasserstein 距离,再计算 [0.25, 0.25, 0.25, 0.25] 与 [0, 0, 0.5, 0.5] 之间的距离。哪个更大?为什么?

5. 实现近似 Jaccard 相似度的 MinHash。生成 100 个随机集合,计算所有集合对的精确 Jaccard,再分别用 50、100、200 个哈希函数做 MinHash 近似对比。画出近似误差。

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|----------------|----------------------|
| 范数 | "向量的大小" | 把向量映射到非负标量的函数,满足三角不等式、绝对齐次性,且只有零向量取零 |
| L1 范数 | "曼哈顿距离" | 各分量绝对值之和。在优化中产生稀疏性,对离群点鲁棒 |
| L2 范数 | "欧氏距离" | 各分量平方和的平方根。欧氏空间中的直线距离 |
| Lp 范数 | "广义范数" | 各分量绝对值 p 次方之和的 p 次方根。L1、L2 都是特例 |
| L-无穷范数 | "最大范数"或"切比雪夫距离" | 各分量绝对值的最大值。Lp 在 p 趋于无穷时的极限 |
| 余弦相似度 | "向量夹角" | 点积除以两个模长归一化。范围 -1 到 +1,忽略向量长度 |
| 余弦距离 | "1 减余弦相似度" | 把余弦相似度转成距离。范围 0 到 2 |
| 点积 | "未归一化的余弦" | 各分量乘积之和。等于余弦相似度乘上两个模长 |
| 马氏距离 | "感知相关性的距离" | 在用数据协方差矩阵白化(去相关并归一化)后的空间里计算 L2 距离 |
| Jaccard 相似度 | "集合重叠度" | 交集大小除以并集大小。用于集合而非向量 |
| 编辑距离 | "Levenshtein 距离" | 把一个字符串变成另一个所需的最少插入、删除、替换次数 |
| KL 散度 | "分布之间的距离" | 不是真正的距离(不对称)。度量用 Q 编码 P 多花的比特数 |
| Wasserstein 距离 | "推土机距离" | 把质量从一个分布搬到另一个的最小工作量。是真正的度量 |
| 近似最近邻 | "ANN 搜索" | 比精确搜索快得多、返回近似最近点的算法(HNSW、LSH、IVF) |
| HNSW | "向量数据库算法" | 分层可导航小世界图。用于快速近似最近邻搜索的多层图 |
| L1 正则化 | "Lasso" | 把权重的 L1 范数加进损失。把权重压向零(产生稀疏) |
| L2 正则化 | "Ridge"或"权重衰减" | 把权重的 L2 范数平方加进损失。把权重向零收缩但不产生稀疏 |
| 弹性网络 | "L1 + L2" | 结合 L1 与 L2 正则化。处理相关特征组比单用任一个都好 |

## 延伸阅读

- [FAISS: A Library for Efficient Similarity Search](https://github.com/facebookresearch/faiss) — Meta 的十亿级 ANN 搜索库
- [Wasserstein GAN (Arjovsky et al., 2017)](https://arxiv.org/abs/1701.07875) — 把推土机距离引入 GAN 的论文
- [Locality-Sensitive Hashing (Indyk & Motwani, 1998)](https://dl.acm.org/doi/10.1145/276698.276876) — ANN 奠基性算法
- [Efficient Estimation of Word Representations (Mikolov et al., 2013)](https://arxiv.org/abs/1301.3781) — Word2Vec,余弦相似度自此成为嵌入的默认选择
- [sklearn.neighbors documentation](https://scikit-learn.org/stable/modules/neighbors.html) — scikit-learn 中距离度量与邻居算法的实战指南
