# 感知机

> 感知机是神经网络的原子。把它拆开,里面只有权重、偏置和一个决策。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 1 阶段(线性代数直觉)
**预计耗时:** 约 60 分钟

## 学习目标

- 用 Python 从零实现感知机,包括权重更新规则和阶跃激活函数
- 解释为什么单个感知机只能解决线性可分问题,并演示 XOR 的失败案例
- 用 OR、NAND、AND 三个门组合出多层感知机,求解 XOR
- 用 sigmoid 激活和反向传播训练一个两层网络,自动学会 XOR

## 问题

你已经会向量、会点积,也知道矩阵能把输入变换成输出。但机器是怎么"学"出该用哪个变换的?

感知机回答了这个问题。它是最简单的学习机器:接收若干输入,各自乘上权重,求和,加偏置,做出一个二值决策,然后调整。仅此而已。人类造过的每一个神经网络,都是把这个想法层层堆叠起来的产物。

理解感知机,就是理解"学习"在代码里到底意味着什么:不断调整数字,直到输出与现实吻合。

## 概念

### 一个神经元,一个决策

感知机接收 n 个输入,各自乘上权重,求和,加偏置,再把结果送进激活函数。

```mermaid
graph LR
    x1["x1"] -- "w1" --> sum["Σ(wi*xi) + b"]
    x2["x2"] -- "w2" --> sum
    x3["x3"] -- "w3" --> sum
    bias["bias"] --> sum
    sum --> step["step(z)"]
    step --> out["output (0 or 1)"]
```

阶跃函数毫不留情:加权和加偏置 >= 0,输出 1;否则输出 0。

```
step(z) = 1  if z >= 0
           0  if z < 0
```

这是一个线性分类器。权重和偏置定义了一条直线(高维中是超平面),把输入空间切成两个区域。

### 决策边界

对两个输入,感知机在二维空间里画出一条线:

```
  x2
  ┤
  │  Class 1        /
  │    (0)          /
  │                /
  │               / w1·x1 + w2·x2 + b = 0
  │              /
  │             /     Class 2
  │            /        (1)
  ┼───────────/──────────── x1
```

线的一侧全部输出 0,另一侧全部输出 1。训练就是移动这条线,直到它把两类正确分开。

### 学习规则

感知机的学习规则很简单:

```
For each training example (x, y_true):
    y_pred = predict(x)
    error = y_true - y_pred

    For each weight:
        w_i = w_i + learning_rate * error * x_i
    bias = bias + learning_rate * error
```

预测正确时,error = 0,一切不变。预测 0 但真值是 1 时,权重上调;预测 1 但真值是 0 时,权重下调。学习率控制每次调整的幅度。

### XOR 问题

出问题的地方在这里。看看这几个逻辑门:

```
AND gate:           OR gate:            XOR gate:
x1  x2  out         x1  x2  out         x1  x2  out
0   0   0           0   0   0           0   0   0
0   1   0           0   1   1           0   1   1
1   0   0           1   0   1           1   0   1
1   1   1           1   1   1           1   1   0
```

AND 和 OR 是线性可分的:画一条线就能把 0 和 1 分开。XOR 不行:不存在任何一条线,能把 [0,1]、[1,0] 与 [0,0]、[1,1] 分开。

```
AND (separable):        XOR (not separable):

  x2                      x2
  1 ┤  0     1            1 ┤  1     0
    │     /                 │
  0 ┤  0 / 0              0 ┤  0     1
    ┼──/──────── x1         ┼──────────── x1
       line works!          no single line works!
```

这是一个根本性的限制:单个感知机只能解决线性可分问题。Minsky 和 Papert 在 1969 年证明了这一点,神经网络研究因此几乎停摆了十年。

解法是:把感知机堆成层。多层感知机把两个线性决策组合成一个非线性决策,从而解决 XOR。

```figure
perceptron-boundary
```

## 动手构建

### 第 1 步:Perceptron 类

```python
class Perceptron:
    def __init__(self, n_inputs, learning_rate=0.1):
        self.weights = [0.0] * n_inputs
        self.bias = 0.0
        self.lr = learning_rate

    def predict(self, inputs):
        total = sum(w * x for w, x in zip(self.weights, inputs))
        total += self.bias
        return 1 if total >= 0 else 0

    def train(self, training_data, epochs=100):
        for epoch in range(epochs):
            errors = 0
            for inputs, target in training_data:
                prediction = self.predict(inputs)
                error = target - prediction
                if error != 0:
                    errors += 1
                    for i in range(len(self.weights)):
                        self.weights[i] += self.lr * error * inputs[i]
                    self.bias += self.lr * error
            if errors == 0:
                print(f"Converged at epoch {epoch + 1}")
                return
        print(f"Did not converge after {epochs} epochs")
```

### 第 2 步:在逻辑门上训练

```python
and_data = [
    ([0, 0], 0),
    ([0, 1], 0),
    ([1, 0], 0),
    ([1, 1], 1),
]

or_data = [
    ([0, 0], 0),
    ([0, 1], 1),
    ([1, 0], 1),
    ([1, 1], 1),
]

not_data = [
    ([0], 1),
    ([1], 0),
]

print("=== AND Gate ===")
p_and = Perceptron(2)
p_and.train(and_data)
for inputs, _ in and_data:
    print(f"  {inputs} -> {p_and.predict(inputs)}")

print("\n=== OR Gate ===")
p_or = Perceptron(2)
p_or.train(or_data)
for inputs, _ in or_data:
    print(f"  {inputs} -> {p_or.predict(inputs)}")

print("\n=== NOT Gate ===")
p_not = Perceptron(1)
p_not.train(not_data)
for inputs, _ in not_data:
    print(f"  {inputs} -> {p_not.predict(inputs)}")
```

### 第 3 步:看 XOR 如何失败

```python
xor_data = [
    ([0, 0], 0),
    ([0, 1], 1),
    ([1, 0], 1),
    ([1, 1], 0),
]

print("\n=== XOR Gate (single perceptron) ===")
p_xor = Perceptron(2)
p_xor.train(xor_data, epochs=1000)
for inputs, expected in xor_data:
    result = p_xor.predict(inputs)
    status = "OK" if result == expected else "WRONG"
    print(f"  {inputs} -> {result} (expected {expected}) {status}")
```

它永远不会收敛。这就是单个感知机学不会 XOR 的铁证。

### 第 4 步:用两层网络解决 XOR

诀窍在于:XOR = (x1 OR x2) AND NOT (x1 AND x2)。把三个感知机组合起来:

```mermaid
graph LR
    x1["x1"] --> OR["OR neuron"]
    x1 --> NAND["NAND neuron"]
    x2["x2"] --> OR
    x2 --> NAND
    OR --> AND["AND neuron"]
    NAND --> AND
    AND --> out["output"]
```

```python
def xor_network(x1, x2):
    or_neuron = Perceptron(2)
    or_neuron.weights = [1.0, 1.0]
    or_neuron.bias = -0.5

    nand_neuron = Perceptron(2)
    nand_neuron.weights = [-1.0, -1.0]
    nand_neuron.bias = 1.5

    and_neuron = Perceptron(2)
    and_neuron.weights = [1.0, 1.0]
    and_neuron.bias = -1.5

    hidden1 = or_neuron.predict([x1, x2])
    hidden2 = nand_neuron.predict([x1, x2])
    output = and_neuron.predict([hidden1, hidden2])
    return output


print("\n=== XOR Gate (multi-layer network) ===")
for inputs, expected in xor_data:
    result = xor_network(inputs[0], inputs[1])
    print(f"  {inputs} -> {result} (expected {expected})")
```

四种输入全部正确。把感知机堆成层,就能产生任何单个感知机都画不出的决策边界。

### 第 5 步:训练两层网络

第 4 步的权重是手工写死的。这对 XOR 行得通,但对真实问题不行——你事先并不知道正确的权重。解法:把阶跃函数换成 sigmoid,用反向传播自动学权重。

```python
class TwoLayerNetwork:
    def __init__(self, learning_rate=0.5):
        import random
        random.seed(0)
        self.w_hidden = [[random.uniform(-1, 1), random.uniform(-1, 1)] for _ in range(2)]
        self.b_hidden = [random.uniform(-1, 1), random.uniform(-1, 1)]
        self.w_output = [random.uniform(-1, 1), random.uniform(-1, 1)]
        self.b_output = random.uniform(-1, 1)
        self.lr = learning_rate

    def sigmoid(self, x):
        import math
        x = max(-500, min(500, x))
        return 1.0 / (1.0 + math.exp(-x))

    def forward(self, inputs):
        self.inputs = inputs
        self.hidden_outputs = []
        for i in range(2):
            z = sum(w * x for w, x in zip(self.w_hidden[i], inputs)) + self.b_hidden[i]
            self.hidden_outputs.append(self.sigmoid(z))
        z_out = sum(w * h for w, h in zip(self.w_output, self.hidden_outputs)) + self.b_output
        self.output = self.sigmoid(z_out)
        return self.output

    def train(self, training_data, epochs=10000):
        for epoch in range(epochs):
            total_error = 0
            for inputs, target in training_data:
                output = self.forward(inputs)
                error = target - output
                total_error += error ** 2

                d_output = error * output * (1 - output)

                saved_w_output = self.w_output[:]
                hidden_deltas = []
                for i in range(2):
                    h = self.hidden_outputs[i]
                    hd = d_output * saved_w_output[i] * h * (1 - h)
                    hidden_deltas.append(hd)

                for i in range(2):
                    self.w_output[i] += self.lr * d_output * self.hidden_outputs[i]
                self.b_output += self.lr * d_output

                for i in range(2):
                    for j in range(len(inputs)):
                        self.w_hidden[i][j] += self.lr * hidden_deltas[i] * inputs[j]
                    self.b_hidden[i] += self.lr * hidden_deltas[i]
```

```python
net = TwoLayerNetwork(learning_rate=2.0)
net.train(xor_data, epochs=10000)
for inputs, expected in xor_data:
    result = net.forward(inputs)
    predicted = 1 if result >= 0.5 else 0
    print(f"  {inputs} -> {result:.4f} (rounded: {predicted}, expected {expected})")
```

与第 4 步有两个关键区别。第一,sigmoid 取代了阶跃函数——它是光滑的,梯度因此存在。第二,`train` 方法把误差从输出层反向传播回隐藏层,按每个权重对误差的贡献比例调整它们。这就是 20 行代码写出来的反向传播。

这是通往第 03 课的桥梁:`d_output` 和 `hidden_deltas` 背后的数学,就是作用在网络图上的链式法则。我们会在那一课把它严格推导出来。

## 投入使用

你刚才从零写的一切,一个 import 就有:

```python
from sklearn.linear_model import Perceptron as SkPerceptron
import numpy as np

X = np.array([[0,0],[0,1],[1,0],[1,1]])
y = np.array([0, 0, 0, 1])

clf = SkPerceptron(max_iter=100, tol=1e-3)
clf.fit(X, y)
print([clf.predict([x])[0] for x in X])
```

五行代码,效果和你那 30 行的 `Perceptron` 类一样。sklearn 版本多了收敛检查、多种损失函数和稀疏输入支持——但核心循环完全相同:加权和、阶跃函数、出错就更新权重。

真正的差距出现在规模上。生产环境中的网络会有这些变化:

- 阶跃函数换成 sigmoid、ReLU 或其他光滑激活
- 权重通过反向传播自动学习(第 03 课)
- 层数不断加深:3 层、10 层、100+ 层
- 但原理不变:每一层都从上一层的输出中构造新特征

单个感知机只能画直线;把它们堆起来,就能画出任意形状。

## 交付

本课产出:
- `outputs/skill-perceptron.md`——一份讲清何时需要单层、何时需要多层结构的技能文档

## 练习

1. 在 NAND 门上训练一个感知机(NAND 是万能门——任何逻辑电路都能用它搭出来)。验证它的权重和偏置确实构成一个合法的决策边界。
2. 修改 Perceptron 类,记录每个 epoch 的决策边界(w1*x1 + w2*x2 + b = 0),打印在 AND 门训练过程中这条线如何移动。
3. 构建一个三输入感知机:仅当至少 2 个输入为 1 时输出 1(多数表决函数)。它线性可分吗?为什么?

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|----------------|----------------------|
| 感知机(Perceptron) | "人造神经元" | 一个线性分类器:输入与权重做点积,加偏置,过阶跃函数 |
| 权重(Weight) | "输入有多重要" | 缩放每个输入对决策贡献的乘数 |
| 偏置(Bias) | "阈值" | 一个平移决策边界的常数,让输入全零时感知机也可能触发 |
| 激活函数(Activation function) | "把值压扁的东西" | 施加在加权和之后的函数——感知机用阶跃函数,现代网络用 sigmoid/ReLU |
| 线性可分(Linearly separable) | "中间能画条线" | 存在单个超平面能把各类完美分开的数据集 |
| XOR 问题(XOR problem) | "感知机做不到的事" | 证明了单层网络无法学习非线性可分函数 |
| 决策边界(Decision boundary) | "分类器翻脸的地方" | 把输入空间分成两类的超平面 w*x + b = 0 |
| 多层感知机(Multi-layer perceptron) | "真正的神经网络" | 感知机按层堆叠,每层输出喂给下一层输入 |

## 延伸阅读

- Frank Rosenblatt,"The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain"(1958)——开启一切的原始论文
- Minsky & Papert,"Perceptrons"(1969)——证明单层网络解不了 XOR 的书,让感知机研究沉寂了十年
- Michael Nielsen,"Neural Networks and Deep Learning"第 1 章(http://neuralnetworksanddeeplearning.com/)——免费在线,对感知机如何组合成网络的最佳可视化讲解
