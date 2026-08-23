# 机器学习中的统计学

> 统计学回答的问题是:你的模型是真的有效,还是只是运气好。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 1 阶段,第 06 课(概率与分布)、第 07 课(贝叶斯定理)
**预计耗时:** 约 120 分钟

## 学习目标

- 从零计算描述性统计量、Pearson/Spearman 相关系数和协方差矩阵
- 执行假设检验(t 检验、卡方检验),并正确解读 p 值与置信区间
- 用 bootstrap 重采样为任意指标构建置信区间,无需任何分布假设
- 用效应量指标区分统计显著性与实际显著性

## 问题

你训了两个模型。模型 A 在测试集上得 0.87,模型 B 得 0.89。你上线了模型 B。三周后,线上指标比以前更差。发生了什么?

模型 B 根本没有真正优于模型 A。那 0.02 的差距是噪声——测试集太小,或者方差太大,或者两者兼有。你把随机性当成改进发布了出去。

这种事时时刻刻都在发生:Kaggle 排行榜大洗牌、无法复现的论文、仅凭几百个样本就宣布胜者的 A/B 测试。根因永远是同一个:有人跳过了统计学。

统计学给你分辨信号与噪声的工具。它告诉你一个差异何时是真的、你该有多大把握、以及需要多少数据才能信任一个结果。每一条 ML 流水线、每一次模型对比、每一个实验都需要统计学。没有它,你就是在猜。

## 概念

### 描述性统计:概括你的数据

在建模之前,你得先知道数据长什么样。描述性统计把数据集压缩成几个能刻画其形态的数字。

**集中趋势度量**回答"中间在哪儿?"

```
Mean:   sum of all values / count
        mu = (1/n) * sum(x_i)

Median: middle value when sorted
        Robust to outliers. If you have [1, 2, 3, 4, 1000], the mean is 202
        but the median is 3.

Mode:   most frequent value
        Useful for categorical data. For continuous data, rarely informative.
```

均值是平衡点,中位数是半程标记。两者背离时,分布就是偏斜的。收入分布通常均值 >> 中位数(亿万富翁拉出右偏);训练中的损失分布常常均值 << 中位数(简单样本拉出左偏)。

**离散程度度量**回答"数据有多分散?"

```
Variance:   average squared deviation from the mean
            sigma^2 = (1/n) * sum((x_i - mu)^2)

Standard deviation:  square root of variance
                     sigma = sqrt(sigma^2)
                     Same units as the data, so more interpretable.

Range:      max - min
            Sensitive to outliers. Almost never useful alone.

IQR:        Q3 - Q1 (interquartile range)
            The range of the middle 50% of the data.
            Robust to outliers. Used for box plots and outlier detection.
```

**百分位数**把排序后的数据分成 100 等份。第 25 百分位数(Q1)表示 25% 的值落在它之下。第 50 百分位数就是中位数。第 75 百分位数是 Q3。

```
For latency monitoring:
  P50 = median latency        (typical user experience)
  P95 = 95th percentile       (bad but not worst case)
  P99 = 99th percentile       (tail latency, often 10x the median)
```

在 ML 中,你关心百分位数的场景包括:推理延迟、预测置信度分布、理解误差分布。一个平均误差很低但 P99 误差惨不忍睹的模型,在安全关键场景里可能毫无用处。

**样本统计量 vs 总体统计量。** 用样本计算方差时,要除以 (n-1) 而不是 n。这就是贝塞尔校正(Bessel's correction)。它补偿的是:样本均值并非真实总体均值。除以 n 会系统性低估真实方差,除以 (n-1) 才是无偏估计。

```
Population variance: sigma^2 = (1/N) * sum((x_i - mu)^2)
Sample variance:     s^2     = (1/(n-1)) * sum((x_i - x_bar)^2)
```

实践中:n 很大(数千个样本)时,差别可以忽略;n 很小(几十个样本)时,差别很关键。

### 相关性:变量如何共同变化

相关性问题衡量两个变量之间线性关系的强度与方向。

**Pearson 相关系数**度量线性关联:

```
r = sum((x_i - x_bar)(y_i - y_bar)) / (n * s_x * s_y)

r = +1:  perfect positive linear relationship
r = -1:  perfect negative linear relationship
r =  0:  no linear relationship (but there might be a nonlinear one!)

Range: [-1, 1]
```

Pearson 假设关系是线性的,且两个变量都近似正态分布。它对离群点敏感——单个极端点就能把 r 从 0.1 拉到 0.9。

**Spearman 秩相关**度量单调关联:

```
1. Replace each value with its rank (1, 2, 3, ...)
2. Compute Pearson correlation on the ranks

Spearman catches any monotonic relationship, not just linear.
If y = x^3, Pearson gives r < 1 but Spearman gives rho = 1.
```

**各自的使用场景:**

```
Pearson:    Both variables are continuous and roughly normal.
            You care about the linear relationship specifically.
            No extreme outliers.

Spearman:   Ordinal data (rankings, ratings).
            Data is not normally distributed.
            You suspect a monotonic but not linear relationship.
            Outliers are present.
```

**黄金法则:** 相关不代表因果。冰淇淋销量与溺水死亡人数相关,是因为两者都在夏天升高。模型准确率与参数量相关,但增加参数并不自动提升准确率(参见:过拟合)。

### 协方差矩阵

两个变量之间的协方差衡量它们如何共同变化:

```
Cov(X, Y) = (1/n) * sum((x_i - x_bar)(y_i - y_bar))

Cov(X, Y) > 0:  X and Y tend to increase together
Cov(X, Y) < 0:  when X increases, Y tends to decrease
Cov(X, Y) = 0:  no linear co-movement
```

对 d 个特征,协方差矩阵 C 是一个 d x d 矩阵,其中 C[i][j] = Cov(feature_i, feature_j)。对角线元素 C[i][i] 是各特征自身的方差。

```
C = | Var(x1)      Cov(x1,x2)  Cov(x1,x3) |
    | Cov(x2,x1)  Var(x2)      Cov(x2,x3) |
    | Cov(x3,x1)  Cov(x3,x2)  Var(x3)     |

Properties:
  - Symmetric: C[i][j] = C[j][i]
  - Positive semi-definite: all eigenvalues >= 0
  - Diagonal = variances
  - Off-diagonal = covariances
```

**与 PCA 的联系。** PCA 对协方差矩阵做特征分解:特征向量就是主成分(方差最大的方向),特征值告诉你每个成分捕获了多少方差。这正是第 10 课讲的内容,但现在你能看清为什么该分解的是协方差矩阵——它编码了数据中所有两两线性关系。

**与相关系数的联系。** 相关矩阵就是标准化变量(各自除以自己的标准差)的协方差矩阵。相关系数把协方差归一化到 [-1, 1] 区间。

### 假设检验

假设检验是在不确定性下做决策的框架:先提出一个论断,再收集数据,最后判断数据是否与该论断一致。

**基本设定:**

```
Null hypothesis (H0):        the default assumption, usually "no effect"
Alternative hypothesis (H1): what you are trying to show

Example:
  H0: Model A and Model B have the same accuracy
  H1: Model B has higher accuracy than Model A
```

**p 值**是在 H0 成立的前提下,观察到与现有数据一样极端(或更极端)的概率。它不是"H0 为真的概率"——这是统计学中最常见的误解,没有之一。

```
p-value = P(data this extreme | H0 is true)

If p-value < alpha (typically 0.05):
    Reject H0. The result is "statistically significant."
If p-value >= alpha:
    Fail to reject H0. You do not have enough evidence.
    This does NOT mean H0 is true.
```

**置信区间**给出参数的一个合理取值范围:

```
95% confidence interval for the mean:
    x_bar +/- z * (s / sqrt(n))

where z = 1.96 for 95% confidence

Interpretation: if you repeated this experiment many times, 95% of the
computed intervals would contain the true mean. It does NOT mean there
is a 95% probability the true mean is in this specific interval.
```

置信区间的宽度反映精度:区间越宽,不确定性越高;区间越窄,估计越精确(但如果数据有偏,精确不等于准确)。

### t 检验

t 检验用于比较均值,有几种变体。

**单样本 t 检验:** 总体均值是否不同于某个假设值?

```
t = (x_bar - mu_0) / (s / sqrt(n))

degrees of freedom = n - 1
```

**双样本 t 检验(独立样本):** 两组均值是否不同?

```
t = (x_bar_1 - x_bar_2) / sqrt(s1^2/n1 + s2^2/n2)

This is Welch's t-test, which does not assume equal variances.
Always use Welch's unless you have a specific reason for equal variances.
```

**配对 t 检验:** 当测量成对出现时(同一模型在相同数据划分上评估):

```
Compute d_i = x_i - y_i for each pair
Then run a one-sample t-test on the d_i values against mu_0 = 0
```

在 ML 中,配对 t 检验很常见:把两个模型跑在同样的 10 折交叉验证划分上,逐折比较得分。

### 卡方检验

卡方检验检查观察频数与期望频数是否吻合,适用于类别数据。

```
chi^2 = sum((observed - expected)^2 / expected)

Example: does a language model's output distribution match the
training distribution across categories?

Category    Observed   Expected
Positive       120        100
Negative        80        100
chi^2 = (120-100)^2/100 + (80-100)^2/100 = 4 + 4 = 8

With 1 degree of freedom, chi^2 = 8 gives p < 0.005.
The difference is significant.
```

### ML 模型的 A/B 测试

ML 中的 A/B 测试和网页 A/B 测试不是一回事。模型对比有其特有的挑战:

```
1. Same test set:    Both models must be evaluated on identical data.
                     Different test sets make comparison meaningless.

2. Multiple metrics: Accuracy alone is not enough. You need precision,
                     recall, F1, latency, and fairness metrics.

3. Variance:         Use cross-validation or bootstrap to estimate
                     the variance of each metric, not just point estimates.

4. Data leakage:     If the test set was used during model selection,
                     your comparison is biased. Hold out a final test set.
```

**标准流程:**

```
1. Define your metric and significance level (alpha = 0.05)
2. Run both models on the same k-fold cross-validation splits
3. Collect paired scores: [(a1, b1), (a2, b2), ..., (ak, bk)]
4. Compute differences: d_i = b_i - a_i
5. Run a paired t-test on the differences
6. Check: is the mean difference significantly different from 0?
7. Compute a confidence interval for the mean difference
8. Compute effect size (Cohen's d) to judge practical significance
```

### 统计显著性 vs 实际显著性

一个结果可以统计上显著、实际上毫无意义。只要数据够多,再微不足道的差异也能变得统计显著。

```
Example:
  Model A accuracy: 0.9234
  Model B accuracy: 0.9237
  n = 1,000,000 test samples
  p-value = 0.001

Statistically significant? Yes.
Practically significant? A 0.03% improvement is not worth the
engineering cost of deploying a new model.
```

**效应量**(effect size)量化差异有多大,与样本量无关:

```
Cohen's d = (mean_1 - mean_2) / pooled_std

d = 0.2:  small effect
d = 0.5:  medium effect
d = 0.8:  large effect
```

p 值和效应量永远都要一起报告。p 值告诉你差异是不是真的,效应量告诉你这个差异值不值得在乎。

### 多重比较问题

检验的假设多了,总有一些会"碰巧显著"。如果你在 alpha = 0.05 下检验 20 个假设,即使全都不是真的,也会期望出现 1 个假阳性。

```
P(at least one false positive) = 1 - (1 - alpha)^m

m = 20 tests, alpha = 0.05:
P(false positive) = 1 - 0.95^20 = 0.64

You have a 64% chance of at least one false positive.
```

**Bonferroni 校正:** 把 alpha 除以检验次数。

```
Adjusted alpha = alpha / m = 0.05 / 20 = 0.0025

Only reject H0 if p-value < 0.0025.
Conservative but simple. Works when tests are independent.
```

在 ML 中,以下场景都要小心这个问题:跨多个指标比较模型、测试大量超参数配置、在多个数据集上评估。

### Bootstrap 方法

Bootstrap 通过对数据有放回重采样,估计统计量的抽样分布。不需要对底层分布做任何假设。

**算法:**

```
1. You have n data points
2. Draw n samples WITH replacement (some points appear multiple times,
   some not at all)
3. Compute your statistic on this bootstrap sample
4. Repeat B times (typically B = 1000 to 10000)
5. The distribution of bootstrap statistics approximates the
   sampling distribution
```

**Bootstrap 置信区间(百分位法):**

```
Sort the B bootstrap statistics
95% CI = [2.5th percentile, 97.5th percentile]
```

**为什么 bootstrap 对 ML 重要:**

```
- Test set accuracy is a point estimate. Bootstrap gives you
  confidence intervals.
- You cannot assume metric distributions are normal (especially
  for AUC, F1, precision at k).
- Bootstrap works for ANY statistic: median, ratio of two means,
  difference in AUC between two models.
- No closed-form formula needed.
```

**用 bootstrap 做模型对比:**

```
1. You have predictions from Model A and Model B on the same test set
2. For each bootstrap iteration:
   a. Resample test indices with replacement
   b. Compute metric_A and metric_B on the resampled set
   c. Store diff = metric_B - metric_A
3. 95% CI for the difference:
   [2.5th percentile of diffs, 97.5th percentile of diffs]
4. If the CI does not contain 0, the difference is significant
```

这比配对 t 检验更稳健,因为它不做任何分布假设。

### 参数检验 vs 非参数检验

**参数检验**假设数据服从特定分布(通常是正态):

```
t-test:         assumes normally distributed data (or large n by CLT)
ANOVA:          assumes normality and equal variances
Pearson r:      assumes bivariate normality
```

**非参数检验**不做分布假设:

```
Mann-Whitney U:     compares two groups (replaces independent t-test)
Wilcoxon signed-rank: compares paired data (replaces paired t-test)
Spearman rho:       correlation on ranks (replaces Pearson)
Kruskal-Wallis:     compares multiple groups (replaces ANOVA)
```

**什么时候用非参数:**

```
- Small sample size (n < 30) and data is clearly non-normal
- Ordinal data (ratings, rankings)
- Heavy outliers you cannot remove
- Skewed distributions
```

**什么时候用参数:**

```
- Large sample size (CLT makes the test statistic approximately normal)
- Data is roughly symmetric without extreme outliers
- More statistical power (better at detecting real differences)
```

ML 实验里样本量通常很小(5 折或 10 折交叉验证),所以 Wilcoxon 符号秩这类非参数检验往往比 t 检验更合适。

### 中心极限定理:实践含义

CLT 说的是:无论总体服从什么分布,随着 n 增大,样本均值的分布都趋近正态分布。

```
If X_1, X_2, ..., X_n are iid with mean mu and variance sigma^2:

    X_bar ~ Normal(mu, sigma^2 / n)    as n -> infinity

Works for n >= 30 in most cases.
For highly skewed distributions, you might need n >= 100.
```

**为什么这对 ML 重要:**

```
1. Justifies confidence intervals and t-tests on aggregated metrics
2. Explains why averaging over cross-validation folds gives stable
   estimates even when individual folds vary wildly
3. Mini-batch gradient descent works because the average gradient
   over a batch approximates the true gradient (CLT in action)
4. Ensemble methods: averaging predictions from many models gives
   more stable output than any single model
```

**CLT 做不到的:**

```
- Does NOT make your data normal. It makes the MEAN of samples normal.
- Does NOT work for heavy-tailed distributions with infinite variance
  (Cauchy distribution).
- Does NOT apply to dependent data (time series without correction).
```

### ML 论文中常见的统计错误

1. **在训练集上测试。** 必然过拟合。永远要留出模型在训练中从未见过的数据。

2. **不给置信区间。** 只报一个准确率数字、不报不确定性,结果既无法复现也无法验证。

3. **忽视多重比较。** 试了 50 种配置、不做校正就直接报最好的那个,假阳性率被人为抬高。

4. **混淆统计显著与实际显著。** 0.01% 的准确率提升配上 p = 0.001,没有任何实际意义。

5. **在类别不平衡的数据上用准确率。** 负类占 99% 的数据集上拿到 99% 准确率,说明模型什么都没学到。该用精确率、召回率、F1 或 AUC。

6. **挑着报指标。** 只报自己模型赢的那个指标。诚实的评估应该报告所有相关指标。

7. **训练/测试划分之间信息泄漏。** 划分之前先做归一化,或者用未来数据预测过去。

8. **测试集太小又不给方差估计。** 在 100 个样本上评估就宣称提升 2%,那是噪声不是信号。

9. **数据不独立却假设独立。** 同一患者的多张医学影像、同一文档的多个句子——组内观测是相关的。

10. **P-hacking。** 换不同的检验、子集或排除标准,直到刷出 p < 0.05。得到的结果只是搜索过程的产物。

## 动手构建

你将实现:

1. **从零实现描述性统计**(均值、中位数、众数、标准差、百分位数、IQR)
2. **相关性函数**(Pearson 与 Spearman,以及协方差矩阵)
3. **假设检验**(单样本 t 检验、双样本 t 检验、卡方检验)
4. **Bootstrap 置信区间**(适用于任意统计量,无需假设)
5. **A/B 测试模拟器**(生成数据、做检验、检查第一类和第二类错误)
6. **统计显著 vs 实际显著演示**(展示大样本量如何让一切都"显著")

全部从零实现,只用 `math` 和 `random`。不用 numpy,不用 scipy。

```figure
f3-bootstrap-resample
```

## 关键术语

| 术语 | 定义 |
|---|---|
| 均值 | 所有值之和除以个数。对离群点敏感。 |
| 中位数 | 排序后位于中间的值。对离群点鲁棒。 |
| 标准差 | 方差的平方根。以原始单位衡量离散程度。 |
| 百分位数 | 给定百分比的数据落在其下的那个值。 |
| IQR | 四分位距。Q3 减 Q1,中间 50% 数据的离散范围。 |
| Pearson 相关 | 度量两个变量间的线性关联。范围 [-1, 1]。 |
| Spearman 相关 | 基于秩次度量单调关联。 |
| 协方差矩阵 | 所有特征两两协方差构成的矩阵。 |
| 零假设 | 默认假设:无效应或无差异。 |
| p 值 | 在零假设成立时,得到如此极端数据的概率。 |
| 置信区间 | 给定置信水平下,参数的合理取值范围。 |
| t 检验 | 检验均值差异是否显著。基于 t 分布。 |
| 卡方检验 | 检验观察频数与期望频数是否有差异。 |
| 效应量 | 差异的大小,与样本量无关。常用 Cohen's d。 |
| Bonferroni 校正 | 显著性阈值除以检验次数,控制假阳性。 |
| Bootstrap | 有放回重采样,用于估计抽样分布。 |
| 第一类错误 | 假阳性。H0 为真时拒绝了它。 |
| 第二类错误 | 假阴性。H0 为假时没能拒绝它。 |
| 统计功效 | 正确拒绝错误 H0 的概率。功效 = 1 - 第二类错误率。 |
| 中心极限定理 | 样本量增大时,样本均值收敛到正态分布。 |
| 参数检验 | 假设数据服从特定分布(通常是正态)。 |
| 非参数检验 | 不做分布假设,基于秩次或符号。 |
