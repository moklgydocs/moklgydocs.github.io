# 链式法则与自动微分

> 链式法则,是每个会学习的神经网络背后的引擎。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 1 阶段,第 04 课(导数与梯度)
**预计耗时:** 约 90 分钟

## 学习目标

- 构建一个迷你 autograd 引擎(Value 类),记录运算并通过反向模式自动微分计算梯度
- 借助拓扑排序,在计算图上实现前向与反向传播
- 只用这个从零实现的 autograd 引擎,构建并在 XOR 上训练一个多层感知机(MLP)
- 用数值有限差分做梯度检查,验证自动微分的正确性

## 问题

你已经会算简单函数的导数了。但神经网络不是简单函数,而是上百个函数复合在一起:矩阵乘法、加偏置、激活、再来一次矩阵乘法、softmax、交叉熵损失。输出是函数的函数的函数。

要训练网络,你需要损失对每一个权重的梯度。面对上百万个参数,手算不可能,数值方法(有限差分)又太慢。

链式法则给你数学,自动微分给你算法。两者合体,就能在任意函数复合上算出精确梯度,耗时与一次前向传播同量级。

PyTorch、TensorFlow、JAX 就是这么工作的。本课带你从零造一个迷你版。

## 概念

### 链式法则

若 `y = f(g(x))`,则 `y` 对 `x` 的导数是:

```
dy/dx = dy/dg * dg/dx = f'(g(x)) * g'(x)
```

沿链条把导数一路乘下去,每一环贡献自己的局部导数。

例子:`y = sin(x^2)`

```
g(x) = x^2       g'(x) = 2x
f(g) = sin(g)     f'(g) = cos(g)

dy/dx = cos(x^2) * 2x
```

复合层次更深时,链条跟着延长:

```
y = f(g(h(x)))

dy/dx = f'(g(h(x))) * g'(h(x)) * h'(x)
```

神经网络的每一层,都是这条链上的一环。

### 计算图

计算图把链式法则画了出来。每个运算是一个节点,数据沿图向前流动,梯度沿图向后流动。

**前向传播(计算数值):**

```mermaid
graph TD
    x1["x1 = 2"] --> mul["* (multiply)"]
    x2["x2 = 3"] --> mul
    mul -->|"a = 6"| add["+ (add)"]
    b["b = 1"] --> add
    add -->|"c = 7"| relu["relu"]
    relu -->|"y = 7"| y["output y"]
```

**反向传播(计算梯度):**

```mermaid
graph TD
    dy["dy/dy = 1"] -->|"relu'(c)=1 since c>0"| dc["dy/dc = 1"]
    dc -->|"dc/da = 1"| da["dy/da = 1"]
    dc -->|"dc/db = 1"| db["dy/db = 1"]
    da -->|"da/dx1 = x2 = 3"| dx1["dy/dx1 = 3"]
    da -->|"da/dx2 = x1 = 2"| dx2["dy/dx2 = 2"]
```

反向传播在每个节点套用链式法则,把梯度从输出端一路传回输入端。

### 前向模式 vs 反向模式

在图上套用链式法则有两种方式。

**前向模式**从输入出发,把导数向前推。先算 `dx/dx = 1`,再逐运算传播。输入少、输出多时好用。

```
Forward mode: seed dx/dx = 1, propagate forward

  x = 2       (dx/dx = 1)
  a = x^2     (da/dx = 2x = 4)
  y = sin(a)  (dy/dx = cos(a) * da/dx = cos(4) * 4 = -2.615)
```

**反向模式**从输出出发,把梯度向后拉。先算 `dy/dy = 1`,再沿各运算逆向传播。输入多、输出少时好用。

```
Reverse mode: seed dy/dy = 1, propagate backward

  y = sin(a)  (dy/dy = 1)
  a = x^2     (dy/da = cos(a) = cos(4) = -0.654)
  x = 2       (dy/dx = dy/da * da/dx = -0.654 * 4 = -2.615)
```

神经网络有上百万个输入(权重),却只有一个输出(损失)。反向模式一次反向传播就能算出全部梯度——这就是反向传播算法选择反向模式的原因。

| 模式 | 种子 | 方向 | 适用场景 |
|------|------|-----------|-----------|
| 前向 | `dx_i/dx_i = 1` | 输入 → 输出 | 输入少、输出多 |
| 反向 | `dy/dy = 1` | 输出 → 输入 | 输入多、输出少(神经网络) |

### 用对偶数实现前向模式

前向模式可以用对偶数(dual numbers)优雅地实现。对偶数形如 `a + b*epsilon`,其中 `epsilon^2 = 0`。

```
Dual number: (value, derivative)

(2, 1) means: value is 2, derivative w.r.t. x is 1

Arithmetic rules:
  (a, a') + (b, b') = (a+b, a'+b')
  (a, a') * (b, b') = (a*b, a'*b + a*b')
  sin(a, a')         = (sin(a), cos(a)*a')
```

给输入变量播种导数 1,导数就会自动穿过每一个运算传播下去。

### 构建 autograd 引擎

一个 autograd 引擎需要三样东西:

1. **数值包装。** 把每个数包进一个对象,同时存它的值和梯度。
2. **图记录。** 每个运算记下自己的输入和局部梯度函数。
3. **反向传播。** 对图做拓扑排序,然后逆序遍历,在每个节点套用链式法则。

PyTorch 的 `autograd` 做的正是这件事:`torch.Tensor` 类包装数值,在 `requires_grad=True` 时记录运算,调用 `.backward()` 时计算梯度。

### PyTorch autograd 的底层机制

当你写下 PyTorch 代码:

```python
x = torch.tensor(2.0, requires_grad=True)
y = x ** 2 + 3 * x + 1
y.backward()
print(x.grad)  # 7.0 = 2*x + 3 = 2*2 + 3
```

PyTorch 在内部:

1. 为 `x` 创建一个 `Tensor` 节点,带上 `requires_grad=True`
2. 每个运算(`**`、`*`、`+`)都创建新节点,并记录反向函数
3. `y.backward()` 沿记录好的图触发反向模式自动微分
4. 每个节点的 `grad_fn` 计算局部梯度,传给父节点
5. 梯度以累加(而非覆盖)的方式汇入 `.grad` 属性

这个图是动态的(define-by-run):每次前向传播都新建一张图。所以 PyTorch 才能在模型里直接写 if/else、循环这类控制流。

```figure
chain-rule
```

## 动手构建

### 第 1 步:Value 类

```python
class Value:
    def __init__(self, data, children=(), op=''):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(children)
        self._op = op

    def __repr__(self):
        return f"Value(data={self.data:.4f}, grad={self.grad:.4f})"
```

每个 `Value` 存它的数值、梯度(初始为零)、一个反向函数,以及指向产生它的子节点的指针。

### 第 2 步:带梯度追踪的算术运算

```python
    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), '+')
        def _backward():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), '*')
        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def relu(self):
        out = Value(max(0, self.data), (self,), 'relu')
        def _backward():
            self.grad += (1.0 if out.data > 0 else 0.0) * out.grad
        out._backward = _backward
        return out
```

每个运算创建一个闭包,它知道如何计算局部梯度,并乘以上游梯度(`out.grad`)。`+=` 处理的是一个值被多个运算使用的情形。

### 第 3 步:反向传播

```python
    def backward(self):
        topo = []
        visited = set()
        def build_topo(v):
            if v not in visited:
                visited.add(v)
                for child in v._prev:
                    build_topo(child)
                topo.append(v)
        build_topo(self)

        self.grad = 1.0
        for v in reversed(topo):
            v._backward()
```

拓扑排序保证每个节点在把梯度传给子节点之前,自己的梯度已经算完。种子梯度是 1.0(dy/dy = 1)。

### 第 4 步:补齐引擎所需的更多运算

基础版 Value 类支持加法、乘法和 relu。真正的 autograd 引擎需要更多。下面是构建神经网络所需的运算:

```python
    def __neg__(self):
        return self * -1

    def __sub__(self, other):
        return self + (-other)

    def __radd__(self, other):
        return self + other

    def __rmul__(self, other):
        return self * other

    def __rsub__(self, other):
        return other + (-self)

    def __pow__(self, n):
        out = Value(self.data ** n, (self,), f'**{n}')
        def _backward():
            self.grad += n * (self.data ** (n - 1)) * out.grad
        out._backward = _backward
        return out

    def __truediv__(self, other):
        return self * (other ** -1) if isinstance(other, Value) else self * (Value(other) ** -1)

    def exp(self):
        import math
        e = math.exp(self.data)
        out = Value(e, (self,), 'exp')
        def _backward():
            self.grad += e * out.grad
        out._backward = _backward
        return out

    def log(self):
        import math
        out = Value(math.log(self.data), (self,), 'log')
        def _backward():
            self.grad += (1.0 / self.data) * out.grad
        out._backward = _backward
        return out

    def tanh(self):
        import math
        t = math.tanh(self.data)
        out = Value(t, (self,), 'tanh')
        def _backward():
            self.grad += (1 - t ** 2) * out.grad
        out._backward = _backward
        return out
```

**每个运算为什么重要:**

| 运算 | 反向规则 | 用在哪 |
|-----------|--------------|---------|
| `__sub__` | 复用 add + neg | 损失计算(pred - target) |
| `__pow__` | n * x^(n-1) | 多项式激活、MSE(error²) |
| `__truediv__` | 复用 mul + pow(-1) | 归一化、学习率缩放 |
| `exp` | exp(x) × 上游梯度 | softmax、对数似然 |
| `log` | (1/x) × 上游梯度 | 交叉熵损失、对数概率 |
| `tanh` | (1 - tanh²) × 上游梯度 | 经典激活函数 |

妙处在于:`__sub__` 和 `__truediv__` 是用已有运算定义出来的,梯度天然正确——因为链式法则会自动穿过底层的 add/mul/pow 复合起来。

### 第 5 步:从零搭迷你 MLP

有了完整的 Value 类,你就能搭神经网络了。不用 PyTorch,不用 NumPy,只用 Value 和链式法则。

```python
import random

class Neuron:
    def __init__(self, n_inputs):
        self.w = [Value(random.uniform(-1, 1)) for _ in range(n_inputs)]
        self.b = Value(0.0)

    def __call__(self, x):
        act = sum((wi * xi for wi, xi in zip(self.w, x)), self.b)
        return act.tanh()

    def parameters(self):
        return self.w + [self.b]

class Layer:
    def __init__(self, n_inputs, n_outputs):
        self.neurons = [Neuron(n_inputs) for _ in range(n_outputs)]

    def __call__(self, x):
        return [n(x) for n in self.neurons]

    def parameters(self):
        return [p for n in self.neurons for p in n.parameters()]

class MLP:
    def __init__(self, sizes):
        self.layers = [Layer(sizes[i], sizes[i+1]) for i in range(len(sizes)-1)]

    def __call__(self, x):
        for layer in self.layers:
            x = layer(x)
        return x[0] if len(x) == 1 else x

    def parameters(self):
        return [p for layer in self.layers for p in layer.parameters()]
```

一个 `Neuron` 计算 `tanh(w1*x1 + w2*x2 + ... + b)`;一个 `Layer` 是一组神经元;一个 `MLP` 把层叠起来。每个权重都是 `Value`,所以调用 `loss.backward()` 会把梯度传播到每个参数。

**在 XOR 上训练:**

```python
random.seed(42)
model = MLP([2, 4, 1])  # 2 inputs, 4 hidden neurons, 1 output

xs = [[0, 0], [0, 1], [1, 0], [1, 1]]
ys = [-1, 1, 1, -1]  # XOR pattern (using -1/1 for tanh)

for step in range(100):
    preds = [model(x) for x in xs]
    loss = sum((p - y) ** 2 for p, y in zip(preds, ys))

    for p in model.parameters():
        p.grad = 0.0
    loss.backward()

    lr = 0.05
    for p in model.parameters():
        p.data -= lr * p.grad

    if step % 20 == 0:
        print(f"step {step:3d}  loss = {loss.data:.4f}")

print("\nPredictions after training:")
for x, y in zip(xs, ys):
    print(f"  input={x}  target={y:2d}  pred={model(x).data:6.3f}")
```

这就是 micrograd:纯 Python 写的完整神经网络训练循环,带自动微分。每个商用深度学习框架做的事情与此相同,只是规模大了无数倍。

### 第 6 步:梯度检查

怎么知道你的自动微分是对的?跟数值导数对比——这就是梯度检查。

```python
def gradient_check(build_expr, x_val, h=1e-7):
    x = Value(x_val)
    y = build_expr(x)
    y.backward()
    autodiff_grad = x.grad

    y_plus = build_expr(Value(x_val + h)).data
    y_minus = build_expr(Value(x_val - h)).data
    numerical_grad = (y_plus - y_minus) / (2 * h)

    diff = abs(autodiff_grad - numerical_grad)
    return autodiff_grad, numerical_grad, diff
```

在一个复杂表达式上测试:

```python
def expr(x):
    return (x ** 3 + x * 2 + 1).tanh()

ad, num, diff = gradient_check(expr, 0.5)
print(f"Autodiff:  {ad:.8f}")
print(f"Numerical: {num:.8f}")
print(f"Difference: {diff:.2e}")
# Difference should be < 1e-5
```

实现新运算时,梯度检查必不可少:反向传播若有 bug,数值检查会抓住它。所有严肃的深度学习实现,在开发阶段都会跑梯度检查。

**什么时候该做梯度检查:**

| 情形 | 要做梯度检查吗? |
|-----------|-------------------|
| 给 autograd 添加新运算 | 要,每次都做 |
| 调试一个不收敛的训练循环 | 要,先查梯度 |
| 生产环境训练 | 不要,太慢(每个参数要 2 次前向) |
| autograd 代码的单元测试 | 要,做成自动化 |

### 第 7 步:与手算结果核对

```python
x1 = Value(2.0)
x2 = Value(3.0)
a = x1 * x2          # a = 6.0
b = a + Value(1.0)    # b = 7.0
y = b.relu()          # y = 7.0

y.backward()

print(f"y = {y.data}")          # 7.0
print(f"dy/dx1 = {x1.grad}")   # 3.0 (= x2)
print(f"dy/dx2 = {x2.grad}")   # 2.0 (= x1)
```

手算核对:`y = relu(x1*x2 + 1)`。因为 `x1*x2 + 1 = 7 > 0`,relu 相当于恒等。`dy/dx1 = x2 = 3`,`dy/dx2 = x1 = 2`。引擎的结果一致。

## 投入使用

### 与 PyTorch 对照验证

```python
import torch

x1 = torch.tensor(2.0, requires_grad=True)
x2 = torch.tensor(3.0, requires_grad=True)
a = x1 * x2
b = a + 1.0
y = torch.relu(b)
y.backward()

print(f"PyTorch dy/dx1 = {x1.grad.item()}")  # 3.0
print(f"PyTorch dy/dx2 = {x2.grad.item()}")  # 2.0
```

梯度相同。你的引擎算出了与 PyTorch 相同的结果,因为数学是一样的:基于链式法则的反向模式自动微分。

### 一个更复杂的表达式

```python
a = Value(2.0)
b = Value(-3.0)
c = Value(10.0)
f = (a * b + c).relu()  # relu(2*(-3) + 10) = relu(4) = 4

f.backward()
print(f"df/da = {a.grad}")  # -3.0 (= b)
print(f"df/db = {b.grad}")  #  2.0 (= a)
print(f"df/dc = {c.grad}")  #  1.0
```

## 交付

本课产出:
- `outputs/skill-autodiff.md` —— 一个关于构建与调试 autograd 系统的技能文档
- `code/autodiff.py` —— 一个可扩展的迷你 autograd 引擎

本课构建的 Value 类,是 第 3 阶段 神经网络训练循环的地基。

## 练习

1. 给 Value 类添加 `__pow__`,使其能计算 `x ** n`。验证 `d/dx(x³)` 在 `x=2` 处等于 `12.0`。

2. 添加 `tanh` 激活函数。验证 `tanh'(0) = 1`、`tanh'(2) = 0.0707`(近似)。

3. 为单个神经元构建计算图:`y = relu(w1*x1 + w2*x2 + b)`。算出全部五个梯度,并与 PyTorch 核对。

4. 用对偶数实现前向模式自动微分。创建一个 `Dual` 类,验证它给出的导数与你的反向模式引擎一致。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|----------------------|
| 链式法则 | "把导数乘起来" | 复合函数的导数等于各函数局部导数的乘积,注意要在正确的点取值 |
| 计算图 | "网络结构图" | 一张有向无环图:节点是运算,边在前向时承载数值、反向时承载梯度 |
| 前向模式 | "把导数往前推" | 从输入向输出传播导数的自动微分。每个输入变量需要一趟 |
| 反向模式 | "反向传播" | 从输出向输入传播梯度的自动微分。每个输出变量需要一趟 |
| autograd | "自动求梯度" | 记录数值上的运算、构建图、并用链式法则算出精确梯度的系统 |
| 对偶数 | "值加导数" | 形如 a + b·ε(ε² = 0)的数,在算术运算中携带导数信息 |
| 拓扑排序 | "依赖顺序" | 给图节点排序,使每个节点都排在它所有依赖之后。梯度正确传播的前提 |
| 梯度累积 | "累加,不覆盖" | 一个值喂给多个运算时,它的梯度是所有传入梯度贡献之和 |
| 动态图 | "边运行边定义" | 每次前向传播都重建的计算图,允许在模型里写 Python 控制流(PyTorch 风格) |
| 梯度检查 | "数值验证" | 把自动微分的梯度与数值有限差分梯度对比,验证正确性。调试必备 |
| MLP | "多层感知机" | 带一个或多个隐藏层的神经网络。每个神经元计算加权和加偏置,再过激活函数 |
| 神经元 | "加权和 + 激活" | 基本单元:output = activation(w1*x1 + w2*x2 + ... + b)。权重和偏置是可学习参数 |

## 延伸阅读

- [3Blue1Brown:反向传播的微积分](https://www.youtube.com/watch?v=tIeHLnjs5U8) —— 神经网络中链式法则的可视化讲解
- [PyTorch autograd 机制](https://pytorch.org/docs/stable/notes/autograd.html) —— 真实系统是如何工作的
- [Baydin 等,《机器学习中的自动微分:综述》](https://arxiv.org/abs/1502.05767) —— 全面的参考文献
