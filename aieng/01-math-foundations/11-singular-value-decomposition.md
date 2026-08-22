# 奇异值分解

> SVD 是线性代数的瑞士军刀。每个矩阵都有它,每个数据科学家都需要它。

**类型:** 动手构建
**编程语言:** Python, Julia
**前置要求:** 第 1 阶段,第 01 课(线性代数直觉)、02(向量与矩阵运算)、03(矩阵变换)
**预计耗时:** 约 120 分钟

## 学习目标

- 用幂迭代实现 SVD,并解释 U、Sigma、V^T 的几何意义
- 应用截断 SVD 做图像压缩,衡量压缩率与重构误差的此消彼长
- 通过 SVD 计算 Moore-Penrose 伪逆,求解超定最小二乘系统
- 把 SVD 与 PCA、推荐系统(潜在因子)、NLP 中的潜在语义分析联系起来

## 问题

你有一个 1000x2000 的矩阵。可能是用户-电影评分表,可能是文档-词频表,也可能是一张图片的像素值。你想压缩它、去噪它、挖出其中的隐藏结构,或者用它解一个最小二乘系统。特征分解只对方阵有效,即便如此,还要求矩阵拥有一整套线性无关的特征向量。

SVD 对任何矩阵都有效。任何形状,任何秩,没有任何前提条件。它把矩阵分解成三个因子,揭示出这个矩阵对空间做了什么几何操作。它是整个线性代数中最通用、最有用的分解。

## 概念

### SVD 在几何上做了什么

任何矩阵,无论形状如何,都按顺序执行三个操作:旋转、缩放、再旋转。SVD 把这个分解显式化。

```
A = U * Sigma * V^T

      m x n     m x m    m x n    n x n
     (any)    (rotate)  (scale)  (rotate)
```

给定任意矩阵 A,SVD 把它分解为:
- V^T 在输入空间(n 维)中旋转向量
- Sigma 沿每个轴缩放(拉伸或压缩)
- U 把结果旋转到输出空间(m 维)

```mermaid
graph LR
    A["Input space (n-dim)\nData cloud\n(arbitrary orientation)"] -->|"V^T\n(rotate)"| B["Scaled space\nAligned with axes\nthen scaled by Sigma"]
    B -->|"U\n(rotate)"| C["Output space (m-dim)\nRotated to output\norientation"]
```

可以这样理解:你把一个矩阵交给 SVD,它告诉你:"这个矩阵先把输入球体用 V^T 旋转,再用 Sigma 把它拉成椭球,最后用 U 旋转这个椭球。"奇异值就是椭球各轴的长度。

### 完整分解

对于形状为 m x n 的矩阵 A:

```
A = U * Sigma * V^T

where:
  U     is m x m, orthogonal (U^T U = I)
  Sigma is m x n, diagonal (singular values on the diagonal)
  V     is n x n, orthogonal (V^T V = I)

The singular values sigma_1 >= sigma_2 >= ... >= sigma_r > 0
where r = rank(A)
```

U 的列叫左奇异向量,V 的列叫右奇异向量,Sigma 对角线上的元素叫奇异值。它们永远非负,并且按惯例降序排列。

### 左奇异向量、奇异值、右奇异向量

SVD 的每个部分都有明确的几何含义。

**右奇异向量(V 的列):** 构成输入空间(R^n)的一组标准正交基。它们是输入空间中被矩阵映射到输出空间正交方向的那些方向。可以把它们看作定义域的自然坐标系。

**奇异值(Sigma 的对角线):** 是缩放因子。第 i 个奇异值告诉你矩阵沿第 i 个右奇异向量方向把向量拉伸多少。奇异值为零,意味着矩阵把那个方向彻底压扁。

**左奇异向量(U 的列):** 构成输出空间(R^m)的一组标准正交基。第 i 个左奇异向量是第 i 个右奇异向量(经缩放后)在输出空间中的落点方向。

三者的关系:

```
A * v_i = sigma_i * u_i

The matrix A takes the i-th right singular vector v_i,
scales it by sigma_i, and maps it to the i-th left singular vector u_i.
```

这给了你一幅逐坐标的图景:任何矩阵在做什么,一目了然。

### 外积形式

SVD 可以写成一系列秩-1 矩阵之和:

```
A = sigma_1 * u_1 * v_1^T + sigma_2 * u_2 * v_2^T + ... + sigma_r * u_r * v_r^T

Each term sigma_i * u_i * v_i^T is a rank-1 matrix (an outer product).
The full matrix is the sum of r such matrices, where r is the rank.
```

这个形式是低秩近似的根基。每一项添上一层结构:第一项捕获最重要的单一模式,第二项捕获次重要的,依此类推。把这个求和截断,你就得到了给定秩下最好的近似。

```
Rank-1 approx:    A_1 = sigma_1 * u_1 * v_1^T
                  (captures the dominant pattern)

Rank-2 approx:    A_2 = sigma_1 * u_1 * v_1^T + sigma_2 * u_2 * v_2^T
                  (captures the two most important patterns)

Rank-k approx:    A_k = sum of top k terms
                  (optimal by the Eckart-Young theorem)
```

### 与特征分解的关系

SVD 和特征分解血脉相连。A 的奇异值与奇异向量,直接来自 A^T A 和 A A^T 的特征值与特征向量。

```
A^T A = V * Sigma^T * U^T * U * Sigma * V^T
      = V * Sigma^T * Sigma * V^T
      = V * D * V^T

where D = Sigma^T * Sigma is a diagonal matrix with sigma_i^2 on the diagonal.

So:
- The right singular vectors (V) are eigenvectors of A^T A
- The singular values squared (sigma_i^2) are eigenvalues of A^T A

Similarly:
A A^T = U * Sigma * V^T * V * Sigma^T * U^T
      = U * Sigma * Sigma^T * U^T

So:
- The left singular vectors (U) are eigenvectors of A A^T
- The eigenvalues of A A^T are also sigma_i^2
```

这层联系告诉你三件事:
1. 奇异值永远是实数且非负(它们是半正定矩阵特征值的平方根)。
2. 你确实可以通过对 A^T A 做特征分解来算 SVD,但这会把条件数平方,损失数值精度。专门的 SVD 算法会避开这条路。
3. 当 A 是对称半正定方阵时,SVD 与特征分解是同一件事。

### 截断 SVD:低秩近似

Eckart-Young-Mirsky 定理指出:A 的最佳秩-k 近似(无论按 Frobenius 范数还是谱范数衡量),就是只保留前 k 个奇异值及其对应向量:

```
A_k = U_k * Sigma_k * V_k^T

where:
  U_k     is m x k  (first k columns of U)
  Sigma_k is k x k  (top-left k x k block of Sigma)
  V_k     is n x k  (first k columns of V)

Approximation error = sigma_{k+1}  (in spectral norm)
                    = sqrt(sigma_{k+1}^2 + ... + sigma_r^2)  (in Frobenius norm)
```

这不只是"一个不错的"近似。它是可证明的最佳秩-k 近似——不存在更接近 A 的秩-k 矩阵。

| 成分 | 相对大小 | 保留在秩-3 近似中? |
|-----------|-------------------|------------------------|
| sigma_1 | 最大 | 是 |
| sigma_2 | 大 | 是 |
| sigma_3 | 中大 | 是 |
| sigma_4 | 中 | 否(构成误差) |
| sigma_5 | 中小 | 否(构成误差) |
| sigma_6 | 小 | 否(构成误差) |
| sigma_7 | 很小 | 否(构成误差) |
| sigma_8 | 极小 | 否(构成误差) |

保留前 3 个:A_3 捕获最大的三个奇异值。误差 = 剩余部分(sigma_4 到 sigma_8)。

如果奇异值衰减得快,很小的 k 就能捕获矩阵的大部分;衰减得慢,说明这个矩阵没有低秩结构。

### 用 SVD 做图像压缩

灰度图就是一个像素强度矩阵。一张 800x600 的图有 48 万个值。SVD 让你用少得多的值去近似它。

```
Original image: 800 x 600 = 480,000 values

SVD with rank k:
  U_k:      800 x k values
  Sigma_k:  k values
  V_k:      600 x k values
  Total:    k * (800 + 600 + 1) = k * 1401 values

  k=10:   14,010 values   (2.9% of original)
  k=50:   70,050 values  (14.6% of original)
  k=100: 140,100 values  (29.2% of original)

  The compression ratio improves as k gets smaller,
  but visual quality degrades.
```

关键洞察:自然图像的奇异值衰减得很快。前几个奇异值捕获大致结构(形状、渐变),后面的捕获细节与噪声。在秩 50 处截断,得到的图像往往与原作几乎无异,存储却省了 85%。

### SVD 与推荐系统

Netflix 大奖赛让这个用法出了名。你有一个用户-电影评分矩阵,大部分条目是缺失的。

```
             Movie1  Movie2  Movie3  Movie4  Movie5
  User1      [  5      ?       3       ?       1  ]
  User2      [  ?      4       ?       2       ?  ]
  User3      [  3      ?       5       ?       ?  ]
  User4      [  ?      ?       ?       4       3  ]

  ? = unknown rating
```

核心想法:这个评分矩阵是低秩的。用户的口味并非完全独立——少数几个潜在因子(动作片还是剧情片、老片还是新片、烧脑还是刺激)就能解释大部分偏好。

对(填补后的)评分矩阵做 SVD,分解出:
- U:潜在因子空间中的用户画像
- Sigma:每个潜在因子的重要程度
- V^T:潜在因子空间中的电影画像

某用户对某电影的预测评分,就是其用户画像与电影画像的点积(按奇异值加权)。低秩近似顺带把缺失的条目填上了。

实践中,你会用 Simon Funk 的增量 SVD 或 ALS(交替最小二乘)这类能直接处理缺失值的变体。但核心思想相同:通过 SVD 做潜在因子分解。

### SVD 在 NLP 中的应用:潜在语义分析

潜在语义分析(LSA),也叫潜在语义索引(LSI),把 SVD 用在词项-文档矩阵上。

```
             Doc1   Doc2   Doc3   Doc4
  "cat"      [  3      0      1      0  ]
  "dog"      [  2      0      0      1  ]
  "fish"     [  0      4      1      0  ]
  "pet"      [  1      1      1      1  ]
  "ocean"    [  0      3      0      0  ]

After SVD with rank k=2:

  Each document becomes a point in 2D "concept space."
  Each term becomes a point in the same 2D space.
  Documents about similar topics cluster together.
  Terms with similar meanings cluster together.

  "cat" and "dog" end up near each other (land pets).
  "fish" and "ocean" end up near each other (water concepts).
  Doc1 and Doc3 cluster if they share similar topics.
```

LSA 是最早成功从原始文本捕获语义相似度的方法之一。它之所以有效,是因为同义词倾向出现在相似的文档里,SVD 于是把它们归进同一个潜在维度。现代词嵌入(Word2Vec、GloVe)可以看作这个想法的后裔。

### SVD 降噪

带噪数据的信号集中在头部奇异值上,噪声则摊在所有奇异值上。截断就能把噪声地板削掉。

**干净信号的奇异值:**

| 成分 | 大小 | 类型 |
|-----------|-----------|------|
| sigma_1 | 非常大 | 信号 |
| sigma_2 | 大 | 信号 |
| sigma_3 | 中 | 信号 |
| sigma_4 | 接近零 | 可忽略 |
| sigma_5 | 接近零 | 可忽略 |

**带噪信号的奇异值(噪声抬高了所有值):**

| 成分 | 大小 | 类型 |
|-----------|-----------|------|
| sigma_1 | 非常大 | 信号 |
| sigma_2 | 大 | 信号 |
| sigma_3 | 中 | 信号 |
| sigma_4 | 小 | 噪声 |
| sigma_5 | 小 | 噪声 |
| sigma_6 | 小 | 噪声 |
| sigma_7 | 小 | 噪声 |

```mermaid
graph TD
    A["All singular values"] --> B{"Clear gap?"}
    B -->|"Above gap"| C["Signal: keep these (top k)"]
    B -->|"Below gap"| D["Noise: discard these"]
    C --> E["Reconstruct with A_k to get denoised version"]
```

这个方法用在信号处理、科学测量和数据清洗里。只要你的矩阵被加性噪声污染,截断 SVD 就是一种有理论依据的信噪分离手段。

### 用 SVD 求伪逆

Moore-Penrose 伪逆 A+ 把矩阵求逆推广到非方阵和奇异矩阵。SVD 让计算它变得 trivial。

```
If A = U * Sigma * V^T, then:

A+ = V * Sigma+ * U^T

where Sigma+ is formed by:
  1. Transpose Sigma (swap rows and columns)
  2. Replace each non-zero diagonal entry sigma_i with 1/sigma_i
  3. Leave zeros as zeros

For A (m x n):      A+ is (n x m)
For Sigma (m x n):  Sigma+ is (n x m)
```

伪逆解决最小二乘问题。如果 Ax = b 没有精确解(超定系统),那么 x = A+ b 就是最小二乘解(最小化 ||Ax - b||)。

```
Overdetermined system (more equations than unknowns):

  [1  1]         [3]
  [2  1] x   =   [5]       No exact solution exists.
  [3  1]         [6]

  x_ls = A+ b = V * Sigma+ * U^T * b

  This gives the x that minimizes the sum of squared residuals.
  Same result as the normal equations (A^T A)^(-1) A^T b,
  but numerically more stable.
```

### 数值稳定性优势

对 A^T A 做特征分解会把奇异值平方(A^T A 的特征值是 sigma_i^2),条件数也随之平方,放大数值误差。

```
Example:
  A has singular values [1000, 1, 0.001]
  Condition number of A: 1000 / 0.001 = 10^6

  A^T A has eigenvalues [10^6, 1, 10^{-6}]
  Condition number of A^T A: 10^6 / 10^{-6} = 10^{12}

  Computing SVD directly: works with condition number 10^6
  Computing via A^T A:     works with condition number 10^{12}
                           (6 extra digits of precision lost)
```

现代 SVD 算法(Golub-Kahan 双对角化)直接对 A 操作,从不构造 A^T A。这就是为什么你应该永远用 `np.linalg.svd(A)`,而不是 `np.linalg.eig(A.T @ A)`。

### 与 PCA 的联系

PCA 就是对中心化数据做 SVD。这不是类比,字面意义上就是同一个计算。

```
Given data matrix X (n_samples x n_features), centered (mean subtracted):

Covariance matrix: C = (1/(n-1)) * X^T X

PCA finds eigenvectors of C. But:

  X = U * Sigma * V^T    (SVD of X)

  X^T X = V * Sigma^2 * V^T

  C = (1/(n-1)) * V * Sigma^2 * V^T

So the principal components are exactly the right singular vectors V.
The explained variance for each component is sigma_i^2 / (n-1).

In sklearn, PCA is implemented using SVD, not eigendecomposition.
It is faster and more numerically stable.
```

这意味着第 10 课讲的降维,底层全是 SVD。PCA 是 SVD 在机器学习中最常见的应用。

```figure
svd-rank-reconstruction
```

## 动手构建

### 第 1 步:用幂迭代从零实现 SVD

思路:要求最大的奇异值及其向量,对 A^T A(或 A A^T)做幂迭代。然后对矩阵做紧缩(deflate),再求下一个奇异值。

```python
import numpy as np

def power_iteration(M, num_iters=100):
    n = M.shape[1]
    v = np.random.randn(n)
    v = v / np.linalg.norm(v)

    for _ in range(num_iters):
        Mv = M @ v
        v = Mv / np.linalg.norm(Mv)

    eigenvalue = v @ M @ v
    return eigenvalue, v

def svd_from_scratch(A, k=None):
    m, n = A.shape
    if k is None:
        k = min(m, n)

    sigmas = []
    us = []
    vs = []

    A_residual = A.copy().astype(float)

    for _ in range(k):
        AtA = A_residual.T @ A_residual
        eigenvalue, v = power_iteration(AtA, num_iters=200)

        if eigenvalue < 1e-10:
            break

        sigma = np.sqrt(eigenvalue)
        u = A_residual @ v / sigma

        sigmas.append(sigma)
        us.append(u)
        vs.append(v)

        A_residual = A_residual - sigma * np.outer(u, v)

    U = np.column_stack(us) if us else np.empty((m, 0))
    S = np.array(sigmas)
    V = np.column_stack(vs) if vs else np.empty((n, 0))

    return U, S, V
```

### 第 2 步:与 NumPy 对比测试

```python
np.random.seed(42)
A = np.random.randn(5, 4)

U_ours, S_ours, V_ours = svd_from_scratch(A)
U_np, S_np, Vt_np = np.linalg.svd(A, full_matrices=False)

print("Our singular values:", np.round(S_ours, 4))
print("NumPy singular values:", np.round(S_np, 4))

A_reconstructed = U_ours @ np.diag(S_ours) @ V_ours.T
print(f"Reconstruction error: {np.linalg.norm(A - A_reconstructed):.8f}")
```

### 第 3 步:图像压缩演示

```python
def compress_image_svd(image_matrix, k):
    U, S, Vt = np.linalg.svd(image_matrix, full_matrices=False)
    compressed = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
    return compressed

image = np.random.seed(42)
rows, cols = 200, 300
image = np.random.randn(rows, cols)

for k in [1, 5, 10, 20, 50]:
    compressed = compress_image_svd(image, k)
    error = np.linalg.norm(image - compressed) / np.linalg.norm(image)
    original_size = rows * cols
    compressed_size = k * (rows + cols + 1)
    ratio = compressed_size / original_size
    print(f"k={k:>3d}  error={error:.4f}  storage={ratio:.1%}")
```

### 第 4 步:降噪

```python
np.random.seed(42)
clean = np.outer(np.sin(np.linspace(0, 4*np.pi, 100)),
                 np.cos(np.linspace(0, 2*np.pi, 80)))
noise = 0.3 * np.random.randn(100, 80)
noisy = clean + noise

U, S, Vt = np.linalg.svd(noisy, full_matrices=False)
denoised = U[:, :5] @ np.diag(S[:5]) @ Vt[:5, :]

print(f"Noisy error:    {np.linalg.norm(noisy - clean):.4f}")
print(f"Denoised error: {np.linalg.norm(denoised - clean):.4f}")
print(f"Improvement:    {(1 - np.linalg.norm(denoised - clean) / np.linalg.norm(noisy - clean)):.1%}")
```

### 第 5 步:伪逆

```python
A = np.array([[1, 1], [2, 1], [3, 1]], dtype=float)
b = np.array([3, 5, 6], dtype=float)

U, S, Vt = np.linalg.svd(A, full_matrices=False)
S_inv = np.diag(1.0 / S)
A_pinv = Vt.T @ S_inv @ U.T

x_svd = A_pinv @ b
x_lstsq = np.linalg.lstsq(A, b, rcond=None)[0]
x_pinv = np.linalg.pinv(A) @ b

print(f"SVD pseudoinverse solution:  {x_svd}")
print(f"np.linalg.lstsq solution:   {x_lstsq}")
print(f"np.linalg.pinv solution:    {x_pinv}")
```

## 投入使用

完整可运行的演示在 `code/svd.py` 里。运行它,可以看到 SVD 应用于图像压缩、推荐系统、潜在语义分析和降噪。

```bash
python svd.py
```

`code/svd.jl` 里的 Julia 版本用 Julia 原生的 `svd()` 函数和 `LinearAlgebra` 包演示了同样的概念。

```bash
julia svd.jl
```

## 交付

本课产出:
- `outputs/skill-svd.md` - 一份关于在真实项目中何时、如何应用 SVD 的技能文档

## 练习

1. 不用幂迭代,从零实现完整的 SVD:对 A^T A 做特征分解得到 V 和奇异值,再计算 U = A V Sigma^{-1}。与幂迭代版本和 NumPy 的结果比较数值精度。

2. 加载一张真实的灰度图(或把一张图转成灰度)。分别按秩 1、5、10、25、50、100 压缩。对每个秩,计算压缩率和相对误差。找出图像在视觉上可接受的那个秩。

3. 搭一个迷你推荐系统。造一个 10x8 的用户-电影评分矩阵,有一些已知条目。用行均值填缺失条目。计算 SVD,重构秩-3 近似。用重构矩阵预测缺失的评分,并验证预测是否合理。

4. 造一个 100x50 的文档-词项矩阵,含 3 个合成主题,每个主题关联 5 个词。加入噪声。应用 SVD,验证前 3 个奇异值远大于其余。把文档投影到 3D 潜在空间,检查同一主题的文档是否聚到一起。

5. 生成一个干净的低秩矩阵(秩 3,50x40),加入不同强度的高斯噪声(sigma = 0.1、0.5、1.0、2.0)。对每个噪声水平,从 1 到 40 扫一遍 k,以对干净矩阵的重构误差为标准找出最优截断秩。画出最优 k 如何随噪声水平变化。

## 关键术语

| 术语 | 大家口头的说法 | 实际含义 |
|------|----------------|----------------------|
| SVD | "分解任何矩阵" | 把 A 分解为 U Sigma V^T,其中 U、V 正交,Sigma 是对角线非负的对角矩阵。任何形状的任何矩阵都适用。 |
| 奇异值 | "这个成分有多重要" | Sigma 的第 i 个对角元素。度量矩阵沿第 i 个主方向的拉伸程度。永远非负,降序排列。 |
| 左奇异向量 | "输出方向" | U 的一列。第 i 个右奇异向量(经 sigma_i 缩放后)映射到输出空间的方向。 |
| 右奇异向量 | "输入方向" | V 的一列。输入空间中被矩阵映射到第 i 个左奇异向量(经 sigma_i 缩放后)的方向。 |
| 截断 SVD | "低秩近似" | 只保留前 k 个奇异值及其向量。得到可证明的最佳秩-k 近似(Eckart-Young 定理)。 |
| 秩 | "真实的维度" | 非零奇异值的个数。告诉你矩阵实际用到了多少个独立方向。 |
| 伪逆 | "广义逆" | V Sigma+ U^T。把非零奇异值取倒数,零保持为零。为非方阵或奇异矩阵求解最小二乘问题。 |
| 条件数 | "对误差有多敏感" | sigma_max / sigma_min。条件数大,意味着输入的微小变化会引起输出的巨大变化。SVD 直接把它暴露出来。 |
| 潜在因子 | "隐藏变量" | SVD 发现的低秩空间中的一个维度。推荐系统里可能对应题材偏好,NLP 里可能对应一个主题。 |
| Frobenius 范数 | "矩阵的总大小" | 所有元素平方和的平方根。等于奇异值平方和的平方根。用于度量近似误差。 |
| Eckart-Young 定理 | "SVD 给出最佳压缩" | 对任何目标秩 k,截断 SVD 在所有可能的秩-k 矩阵中使近似误差最小。 |
| 幂迭代 | "找最大的特征向量" | 反复用矩阵乘一个随机向量并归一化。收敛到最大特征值对应的特征向量。是许多 SVD 算法的基本构件。 |

## 延伸阅读

- [Gilbert Strang: Linear Algebra and Its Applications, Chapter 7](https://math.mit.edu/~gs/linearalgebra/) - 对 SVD 及其应用的透彻讲解
- [3Blue1Brown: But what is the SVD?](https://www.youtube.com/watch?v=vSczTbgc8Rc) - SVD 的几何直觉
- [We Recommend a Singular Value Decomposition](https://www.ams.org/publicoutreach/feature-column/fcarc-svd) - 美国数学会的通俗综述
- [Netflix Prize and Matrix Factorization](https://sifter.org/~simon/journal/20061211.html) - Simon Funk 关于推荐系统 SVD 的原始博文
- [Latent Semantic Analysis](https://en.wikipedia.org/wiki/Latent_semantic_analysis) - SVD 在 NLP 中的最初应用
- [Numerical Linear Algebra by Trefethen and Bau](https://people.maths.ox.ac.uk/trefethen/text.html) - 理解 SVD 算法及其数值性质的金标准
