# 矩阵变换

> 矩阵是一台重塑空间的机器。弄清它对每个点做了什么,你就理解了整个变换。

**类型:** 动手构建
**编程语言:** Python, Julia
**前置要求:** 第 1 阶段,第 01–02 课(线性代数直觉、向量与矩阵运算)
**预计耗时:** 约 75 分钟

## 学习目标

- 构造旋转、缩放、剪切和反射矩阵,并作用于二维和三维点
- 用矩阵乘法组合多个变换,并验证顺序确实影响结果
- 从特征方程出发,手算 2×2 矩阵的特征值与特征向量
- 解释为什么特征值决定了 PCA 的方向、RNN 的稳定性,以及谱聚类的行为

## 问题

你读 PCA 的资料,看到"求协方差矩阵的特征向量";读模型稳定性的资料,看到"检查所有特征值的模是否小于 1";读数据增强的资料,看到"施加一个随机旋转"。在不理解矩阵对空间做了什么几何操作之前,这些话全是天书。

矩阵不只是数字网格,它们是空间机器。旋转矩阵让点转动,缩放矩阵让点拉伸,剪切矩阵让点倾斜。神经网络对数据施加的每一次变换,都是这些操作之一,或是它们的组合。本课让这些操作变得具体可感。

## 概念

### 变换即矩阵

二维空间中的每个线性变换都能写成一个 2×2 矩阵。矩阵精确地告诉你基向量 [1, 0] 和 [0, 1] 最终去了哪里,其余一切都由此推出。

```mermaid
graph LR
    subgraph Before["Standard Basis"]
        e1["e1 = [1, 0] (along x)"]
        e2["e2 = [0, 1] (along y)"]
    end
    subgraph Transform["Matrix M"]
        M["M = columns are new basis vectors"]
    end
    subgraph After["After Transformation M"]
        e1p["e1' = new x-basis"]
        e2p["e2' = new y-basis"]
    end
    e1 --> M --> e1p
    e2 --> M --> e2p
```

### 旋转

二维旋转(角度为 theta)保持距离和角度不变,让每个点沿圆弧移动。

```mermaid
graph LR
    subgraph Before["Before Rotation"]
        A["A(2, 1)"]
        B["B(0, 2)"]
    end
    subgraph Rot["Rotate 45 degrees"]
        R["R(θ) = [[cos θ, -sin θ], [sin θ, cos θ]]"]
    end
    subgraph After["After Rotation"]
        Ap["A'(0.71, 2.12)"]
        Bp["B'(-1.41, 1.41)"]
    end
    A --> R --> Ap
    B --> R --> Bp
```

在三维中,旋转是绕轴进行的,每个轴有自己的旋转矩阵:

```
Rz(theta) = | cos  -sin  0 |     Rotate around z-axis
            | sin   cos  0 |     (x-y plane spins, z stays)
            |  0     0   1 |

Rx(theta) = | 1   0     0    |   Rotate around x-axis
            | 0  cos  -sin   |   (y-z plane spins, x stays)
            | 0  sin   cos   |

Ry(theta) = |  cos  0  sin |     Rotate around y-axis
            |   0   1   0  |     (x-z plane spins, y stays)
            | -sin  0  cos |
```

### 缩放

缩放沿每个轴独立地拉伸或压缩。

```mermaid
graph LR
    subgraph Before["Before Scaling"]
        A["A(2, 1)"]
        B["B(0, 2)"]
    end
    subgraph Scale["Scale sx=2, sy=0.5"]
        S["S = [[2, 0], [0, 0.5]]"]
    end
    subgraph After["After Scaling"]
        Ap["A'(4, 0.5)"]
        Bp["B'(0, 1)"]
    end
    A --> S --> Ap
    B --> S --> Bp
```

### 剪切

剪切在固定一个轴的同时倾斜另一个轴,把矩形变成平行四边形。

```mermaid
graph LR
    subgraph Before["Before Shear"]
        A["A(1, 0)"]
        B["B(0, 1)"]
    end
    subgraph Shear["Shear in x, k=1"]
        Sh["Shx = [[1, k], [0, 1]]"]
    end
    subgraph After["After Shear"]
        Ap["A(1, 0) unchanged"]
        Bp["B'(1, 1) shifted"]
    end
    A --> Sh --> Ap
    B --> Sh --> Bp
```

剪切矩阵:
- `Shx = [[1, k], [0, 1]]` 让 x 偏移 k * y
- `Shy = [[1, 0], [k, 1]]` 让 y 偏移 k * x

### 反射

反射让点关于某条轴或某条直线做镜像。

```mermaid
graph LR
    subgraph Before["Before Reflection"]
        A["A(2, 1)"]
    end
    subgraph Reflect["Reflect across y-axis"]
        R["[[-1, 0], [0, 1]]"]
    end
    subgraph After["After Reflection"]
        Ap["A'(-2, 1)"]
    end
    A --> R --> Ap
```

反射矩阵:
- 关于 y 轴反射:`[[-1, 0], [0, 1]]`
- 关于 x 轴反射:`[[1, 0], [0, -1]]`

### 组合:把变换串起来

先施加变换 A 再施加 B,等价于把两个矩阵相乘:`result = B @ A @ point`。顺序很重要,先旋转再缩放与先缩放再旋转,结果不同。

```mermaid
graph LR
    subgraph Path1["Rotate 90 then Scale (2, 0.5)"]
        P1["(1, 0)"] -->|"Rotate 90"| P2["(0, 1)"] -->|"Scale"| P3["(0, 0.5)"]
    end
```

组合后:`S @ R = [[0, -2], [0.5, 0]]`

```mermaid
graph LR
    subgraph Path2["Scale (2, 0.5) then Rotate 90"]
        Q1["(1, 0)"] -->|"Scale"| Q2["(2, 0)"] -->|"Rotate 90"| Q3["(0, 2)"]
    end
```

组合后:`R @ S = [[0, -0.5], [2, 0]]`

结果不同——矩阵乘法不满足交换律。

### 特征值与特征向量

大多数向量被矩阵作用后会改变方向。特征向量是特殊的:矩阵只缩放它们,从不旋转它们。缩放的比例就是特征值。

```
A @ v = lambda * v

v is the eigenvector (direction that survives)
lambda is the eigenvalue (how much it stretches)

Example: A = | 2  1 |
             | 1  2 |

Eigenvector [1, 1] with eigenvalue 3:
  A @ [1,1] = [3, 3] = 3 * [1, 1]     (same direction, scaled by 3)

Eigenvector [1, -1] with eigenvalue 1:
  A @ [1,-1] = [1, -1] = 1 * [1, -1]  (same direction, unchanged)
```

这个矩阵沿 [1, 1] 方向把空间拉伸 3 倍,沿 [1, -1] 方向保持不变。其他所有方向都是这两个方向的混合。

### 特征分解

如果一个矩阵有 n 个线性无关的特征向量,就可以做分解:

```
A = V @ D @ V^(-1)

V = matrix whose columns are eigenvectors
D = diagonal matrix of eigenvalues
V^(-1) = inverse of V

This says: rotate into eigenvector coordinates, scale along each axis, rotate back.
```

### 为什么特征值重要

**PCA。** 协方差矩阵的特征向量就是主成分,特征值告诉你每个成分捕获了多少方差。按特征值排序、取前 k 个,就得到了降维。

**稳定性。** 在循环网络和动力系统中,模大于 1 的特征值会让输出爆炸,模小于 1 则让输出消失。梯度消失/爆炸问题,用这一句话就说完了。

**谱方法。** 图神经网络使用邻接矩阵的特征值,谱聚类使用拉普拉斯矩阵的特征值。特征向量揭示了图的结构。

### 行列式:体积缩放因子

变换矩阵的行列式告诉你它把面积(2D)或体积(3D)缩放了多少。

```
det = 1:   area preserved (rotation)
det = 2:   area doubled
det = 0:   space crushed to lower dimension (singular)
det = -1:  area preserved but orientation flipped (reflection)

| det(Rotation) | = 1        (always)
| det(Scale sx, sy) | = sx * sy
| det(Shear) | = 1           (area preserved)
| det(Reflection) | = -1     (orientation flipped)
```

```figure
matrix-transform
```

## 动手构建

### 第 1 步:从零实现变换矩阵(Python)

```python
import math

def rotation_2d(theta):
    c, s = math.cos(theta), math.sin(theta)
    return [[c, -s], [s, c]]

def scaling_2d(sx, sy):
    return [[sx, 0], [0, sy]]

def shearing_2d(kx, ky):
    return [[1, kx], [ky, 1]]

def reflection_x():
    return [[1, 0], [0, -1]]

def reflection_y():
    return [[-1, 0], [0, 1]]

def mat_vec_mul(matrix, vector):
    return [
        sum(matrix[i][j] * vector[j] for j in range(len(vector)))
        for i in range(len(matrix))
    ]

def mat_mul(a, b):
    rows_a, cols_b = len(a), len(b[0])
    cols_a = len(a[0])
    return [
        [sum(a[i][k] * b[k][j] for k in range(cols_a)) for j in range(cols_b)]
        for i in range(rows_a)
    ]

point = [1.0, 0.0]
angle = math.pi / 4

rotated = mat_vec_mul(rotation_2d(angle), point)
print(f"Rotate (1,0) by 45 deg: ({rotated[0]:.4f}, {rotated[1]:.4f})")

scaled = mat_vec_mul(scaling_2d(2, 3), [1.0, 1.0])
print(f"Scale (1,1) by (2,3): ({scaled[0]:.1f}, {scaled[1]:.1f})")

sheared = mat_vec_mul(shearing_2d(1, 0), [1.0, 1.0])
print(f"Shear (1,1) kx=1: ({sheared[0]:.1f}, {sheared[1]:.1f})")

reflected = mat_vec_mul(reflection_y(), [2.0, 1.0])
print(f"Reflect (2,1) across y: ({reflected[0]:.1f}, {reflected[1]:.1f})")
```

### 第 2 步:变换的组合

```python
R = rotation_2d(math.pi / 2)
S = scaling_2d(2, 0.5)

rotate_then_scale = mat_mul(S, R)
scale_then_rotate = mat_mul(R, S)

point = [1.0, 0.0]
result1 = mat_vec_mul(rotate_then_scale, point)
result2 = mat_vec_mul(scale_then_rotate, point)

print(f"Rotate 90 then scale: ({result1[0]:.2f}, {result1[1]:.2f})")
print(f"Scale then rotate 90: ({result2[0]:.2f}, {result2[1]:.2f})")
print(f"Same? {result1 == result2}")
```

### 第 3 步:从零求特征值(2×2)

对于 2×2 矩阵 `[[a, b], [c, d]]`,特征值满足特征方程:`lambda^2 - (a+d)*lambda + (ad - bc) = 0`。

```python
def eigenvalues_2x2(matrix):
    a, b = matrix[0]
    c, d = matrix[1]
    trace = a + d
    det = a * d - b * c
    discriminant = trace ** 2 - 4 * det
    if discriminant < 0:
        real = trace / 2
        imag = (-discriminant) ** 0.5 / 2
        return (complex(real, imag), complex(real, -imag))
    sqrt_disc = discriminant ** 0.5
    return ((trace + sqrt_disc) / 2, (trace - sqrt_disc) / 2)

def eigenvector_2x2(matrix, eigenvalue):
    a, b = matrix[0]
    c, d = matrix[1]
    if abs(b) > 1e-10:
        v = [b, eigenvalue - a]
    elif abs(c) > 1e-10:
        v = [eigenvalue - d, c]
    else:
        if abs(a - eigenvalue) < 1e-10:
            v = [1, 0]
        else:
            v = [0, 1]
    mag = (v[0] ** 2 + v[1] ** 2) ** 0.5
    return [v[0] / mag, v[1] / mag]

A = [[2, 1], [1, 2]]
vals = eigenvalues_2x2(A)
print(f"Matrix: {A}")
print(f"Eigenvalues: {vals[0]:.4f}, {vals[1]:.4f}")

for val in vals:
    vec = eigenvector_2x2(A, val)
    result = mat_vec_mul(A, vec)
    scaled = [val * vec[0], val * vec[1]]
    print(f"  lambda={val:.1f}, v={[round(x,4) for x in vec]}")
    print(f"    A@v = {[round(x,4) for x in result]}")
    print(f"    l*v = {[round(x,4) for x in scaled]}")
```

### 第 4 步:行列式即体积缩放因子

```python
def det_2x2(matrix):
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]

print(f"det(rotation 45) = {det_2x2(rotation_2d(math.pi/4)):.4f}")
print(f"det(scale 2,3)   = {det_2x2(scaling_2d(2, 3)):.1f}")
print(f"det(shear kx=1)  = {det_2x2(shearing_2d(1, 0)):.1f}")
print(f"det(reflect y)   = {det_2x2(reflection_y()):.1f}")

singular = [[1, 2], [2, 4]]
print(f"det(singular)     = {det_2x2(singular):.1f}")
print("Singular: columns are proportional, space collapses to a line.")
```

## 投入使用

NumPy 用优化过的例程处理所有这些。

```python
import numpy as np

theta = np.pi / 4
R = np.array([[np.cos(theta), -np.sin(theta)],
              [np.sin(theta),  np.cos(theta)]])

point = np.array([1.0, 0.0])
print(f"Rotate (1,0) by 45 deg: {R @ point}")

S = np.diag([2.0, 3.0])
composed = S @ R
print(f"Scale(2,3) after Rotate(45): {composed @ point}")

A = np.array([[2, 1], [1, 2]], dtype=float)
eigenvalues, eigenvectors = np.linalg.eig(A)
print(f"\nEigenvalues: {eigenvalues}")
print(f"Eigenvectors (columns):\n{eigenvectors}")

for i in range(len(eigenvalues)):
    v = eigenvectors[:, i]
    lam = eigenvalues[i]
    print(f"  A @ v{i} = {A @ v}, lambda * v{i} = {lam * v}")

print(f"\ndet(R) = {np.linalg.det(R):.4f}")
print(f"det(S) = {np.linalg.det(S):.1f}")

B = np.array([[3, 1], [0, 2]], dtype=float)
vals, vecs = np.linalg.eig(B)
D = np.diag(vals)
V = vecs
reconstructed = V @ D @ np.linalg.inv(V)
print(f"\nEigendecomposition A = V @ D @ V^-1:")
print(f"Original:\n{B}")
print(f"Reconstructed:\n{reconstructed}")
```

### 用 NumPy 做三维旋转

```python
def rotation_3d_z(theta):
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])

def rotation_3d_x(theta):
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])

point_3d = np.array([1.0, 0.0, 0.0])
rotated_z = rotation_3d_z(np.pi / 2) @ point_3d
rotated_x = rotation_3d_x(np.pi / 2) @ point_3d

print(f"\n3D point: {point_3d}")
print(f"Rotate 90 around z: {np.round(rotated_z, 4)}")
print(f"Rotate 90 around x: {np.round(rotated_x, 4)}")
```

## 交付

本课为 PCA(第 2 阶段)和神经网络权重分析打下几何基础。这里实现的特征值/特征向量代码,与生产级机器学习系统中驱动降维、谱聚类和稳定性分析的是同一套算法。

## 练习

1. 对一个单位正方形(顶点为 [0,0]、[1,0]、[1,1]、[0,1])分别施加旋转、缩放和剪切,打印每种变换后的顶点坐标。验证旋转保持顶点间的距离不变。

2. 用特征方程手算矩阵 [[4, 2], [1, 3]] 的特征值,然后分别用你从零实现的函数和 NumPy 验证。

3. 组合三个变换(旋转 30 度、按 [1.5, 0.8] 缩放、kx=0.3 的剪切),作用于排列成圆环的 8 个点,打印变换前后的坐标。计算组合矩阵的行列式,并验证它等于各自行列式的乘积。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|----------------------|
| 旋转矩阵 | "让东西转起来" | 一种正交矩阵,让点沿圆弧移动,同时保持距离和角度不变。行列式恒为 1 |
| 缩放矩阵 | "把东西放大" | 对角矩阵,沿每个轴独立地拉伸或压缩。行列式是各缩放因子的乘积 |
| 剪切矩阵 | "把东西弄斜" | 让一个坐标按另一个坐标成比例偏移的矩阵,把矩形变成平行四边形。行列式为 1 |
| 反射 | "做镜像" | 把空间关于某条轴或某个平面翻转的矩阵。行列式为 -1 |
| 组合 | "做两件事" | 把变换矩阵相乘以串联操作。顺序很重要:B @ A 表示先施加 A,再施加 B |
| 特征向量 | "特殊方向" | 矩阵只缩放、从不旋转的方向。变换的指纹 |
| 特征值 | "拉伸多少" | 矩阵缩放其特征向量的标量因子。可以为负(翻转)或复数(旋转) |
| 特征分解 | "把矩阵拆开" | 把矩阵写成 V @ D @ V^(-1),分离出它最基本的缩放方向和缩放倍数 |
| 行列式 | "从矩阵算出的一个数" | 变换对面积(2D)或体积(3D)的缩放倍数。为零意味着变换不可逆 |
| 特征方程 | "特征值从哪来" | det(A - lambda * I) = 0。其根就是特征值的多项式方程 |

## 延伸阅读

- [3Blue1Brown:线性变换](https://www.3blue1brown.com/lessons/linear-transformations) —— 矩阵如何重塑空间的可视化直觉
- [3Blue1Brown:特征向量与特征值](https://www.3blue1brown.com/lessons/eigenvalues) —— 特征向量几何含义的最佳可视化讲解
- [MIT 18.06 第 21 讲:特征值与特征向量](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) —— Gilbert Strang 的经典讲授
