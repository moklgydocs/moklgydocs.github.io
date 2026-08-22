# 数值稳定性

> 浮点是个会漏的抽象。训练时被它咬中的人,往往浑然不觉。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 1 阶段,第 01–04 课
**预计耗时:** 约 120 分钟

## 学习目标

- 用减最大值技巧(max-subtraction trick)实现数值稳定的 softmax 和 log-sum-exp
- 识别浮点计算中的上溢、下溢与灾难性抵消
- 用中心有限差分验证解析梯度与数值梯度是否一致
- 解释为什么训练时 bfloat16 优于 float16,以及损失缩放如何防止梯度下溢

## 问题

模型训了三个小时,损失突然变成 NaN。你加了一条打印语句:第 9000 步时 logits 还好好的,第 9001 步变成了 `inf`,到第 9002 步,所有梯度都是 `nan`,训练彻底报废。

另一种情况:模型顺利训完,但准确率比论文宣称的低 2%。你把一切查了个遍——架构一致、超参数一致、数据一致。问题在于论文用的是 float32,而你用了 float16 却没做正确的缩放。三十二分之一的累计舍入误差,悄无声息地吃掉了你的准确率。

还有一种情况:你从零实现交叉熵损失。小数值的 logits 上一切正常,一旦 logits 超过 100,直接返回 `inf`。softmax 溢出了,因为 `exp(100)` 超出了 float32 能表示的范围。每个机器学习框架都用一个两行代码的技巧处理这个问题,而你根本不知道这个技巧的存在。

数值稳定性不是理论洁癖。它是一次训练成功与悄悄失败之间的分界线。你将来调试的每一个棘手 ML bug,追根溯源几乎都会落到浮点上。

## 概念

### IEEE 754:计算机如何存储实数

计算机按 IEEE 754 标准把实数存成浮点值。一个浮点数由三部分组成:符号位、指数位和尾数位(有效数字)。

```
Float32 layout (32 bits total):
[1 sign] [8 exponent] [23 mantissa]

Value = (-1)^sign * 2^(exponent - 127) * 1.mantissa
```

尾数决定精度(能保留多少位有效数字),指数决定范围(数能有多大或多小)。

```
Format     Bits   Exponent  Mantissa  Decimal digits  Range (approx)
float64    64     11        52        ~15-16          +/- 1.8e308
float32    32     8         23        ~7-8            +/- 3.4e38
float16    16     5         10        ~3-4            +/- 65,504
bfloat16   16     8         7         ~2-3            +/- 3.4e38
```

float32 大约能提供 7 位十进制精度。也就是说,它能分清 1.0000001 和 1.0000002,却分不清 1.00000001 和 1.00000002。7 位之后,全是舍入噪声。

float16 只有约 3 位精度,能表示的最大数是 65,504。对机器学习来说这个小得可怕——logits、梯度和激活值轻易就会超过它。

bfloat16 是 Google 针对 float16 范围问题的答案:指数位与 float32 相同(范围一致,最大约 3.4e38),但尾数只有 7 位(精度比 float16 还低)。训练神经网络时,范围比精度更重要,所以 bfloat16 通常胜出。

### 为什么 0.1 + 0.2 != 0.3

0.1 在二进制浮点中无法被精确表示。换成二进制,它是一个无限循环小数:

```
0.1 in binary = 0.0001100110011001100110011... (repeating forever)
```

float32 把它截断到 23 位尾数,存下的值约为 0.100000001490116。同样,0.2 存为约 0.200000002980232。两者相加得到 0.300000004470348,而不是 0.3。

```
In Python:
>>> 0.1 + 0.2
0.30000000000000004

>>> 0.1 + 0.2 == 0.3
False
```

这对 ML 的影响在于:

1. `if loss < threshold` 这类损失比较可能给出错误结果
2. 累加大量小值(数千步的梯度更新)会偏离真实总和
3. 用 `==` 比较浮点数,校验和与可复现性测试会失败

解决办法:永远不要用 `==` 比较浮点数。用 `abs(a - b) < epsilon` 或 `math.isclose()`。

### 灾难性抵消

两个几乎相等的浮点数相减时,有效数字会相互抵消,剩下的结果里,舍入噪声被抬到了最高有效位。

```
a = 1.0000001    (stored as 1.00000011920929 in float32)
b = 1.0000000    (stored as 1.00000000000000 in float32)

True difference:  0.0000001
Computed:         0.00000011920929

Relative error: 19.2%
```

一次减法就带来 19% 的相对误差。在 ML 中,以下场景都会踩中它:

- 对均值很大的数据求方差:当 E[x] 很大时计算 `E[x^2] - E[x]^2`
- 两个几乎相等的对数概率相减
- 用过小的 epsilon 计算有限差分梯度

解决办法:重排公式,避免让很大的、几乎相等的数相减。求方差用 Welford 算法,或先把数据去中心化;处理对数概率时,全程待在对数空间里。

### 上溢与下溢

结果大到无法表示,就是上溢;小到无法表示(比最小的可表示正数更接近零),就是下溢。

```
Float32 boundaries:
  Maximum:  3.4028235e+38
  Minimum positive (normal): 1.175e-38
  Minimum positive (denorm): 1.401e-45
  Overflow:  anything > 3.4e38 becomes inf
  Underflow: anything < 1.4e-45 becomes 0.0
```

`exp()` 是 ML 中上溢的头号来源:

```
exp(88.7)  = 3.40e+38   (barely fits in float32)
exp(89.0)  = inf         (overflow)
exp(-87.3) = 1.18e-38   (barely above underflow)
exp(-104)  = 0.0         (underflow to zero)
```

`log()` 则在另一个方向上出事:

```
log(0.0)   = -inf
log(-1.0)  = nan
log(1e-45) = -103.3      (fine)
log(1e-46) = -inf        (input underflowed to 0, then log(0) = -inf)
```

在 ML 里,`exp()` 出现在 softmax、sigmoid 和概率计算中;`log()` 出现在交叉熵、对数似然和 KL 散度中。没有合适的技巧,`log(exp(x))` 这个组合就是一片雷区。

### log-sum-exp 技巧

直接计算 `log(sum(exp(x_i)))` 在数值上是危险的。任何一个 `x_i` 偏大,`exp(x_i)` 就会上溢;所有 `x_i` 都非常负时,每个 `exp(x_i)` 都下溢到零,于是 `log(0)` 得到 `-inf`。

技巧:取指数之前,先减去最大值。

```
log(sum(exp(x_i))) = max(x) + log(sum(exp(x_i - max(x))))
```

为什么有效:减去 `max(x)` 之后,最大的指数项是 `exp(0) = 1`,不可能上溢。求和里至少有一项是 1,总和至少是 1,而 `log(1) = 0`,也不可能下溢出 `-inf`。

证明:

```
log(sum(exp(x_i)))
= log(sum(exp(x_i - c + c)))                    (add and subtract c)
= log(sum(exp(x_i - c) * exp(c)))               (exp(a+b) = exp(a)*exp(b))
= log(exp(c) * sum(exp(x_i - c)))               (factor out exp(c))
= c + log(sum(exp(x_i - c)))                    (log(a*b) = log(a) + log(b))
```

令 `c = max(x)`,上溢就消除了。

这个技巧在 ML 中无处不在:

- softmax 归一化
- 交叉熵损失计算
- 序列模型中的对数概率求和
- 高斯混合模型
- 变分推断

### 为什么 softmax 需要减最大值技巧

softmax 把 logits 转换成概率:

```
softmax(x_i) = exp(x_i) / sum(exp(x_j))
```

不用这个技巧,logits 为 [100, 101, 102] 就会溢出:

```
exp(100) = 2.69e43
exp(101) = 7.31e43
exp(102) = 1.99e44
sum      = 2.99e44

These overflow float32 (max ~3.4e38)? No, 2.69e43 < 3.4e38? Actually:
exp(88.7) is already at the float32 limit.
exp(100) = inf in float32.
```

用上技巧,减去 max(x) = 102:

```
exp(100 - 102) = exp(-2) = 0.135
exp(101 - 102) = exp(-1) = 0.368
exp(102 - 102) = exp(0)  = 1.000
sum = 1.503

softmax = [0.090, 0.245, 0.665]
```

概率完全相同,计算却是安全的。这不是优化,而是正确性的硬性要求。

### NaN 与 Inf:检测与预防

`nan`(非数)和 `inf`(无穷大)会像病毒一样在计算中传播。梯度更新里混进一个 `nan`,权重就变成 `nan`,随后所有输出都变成 `nan`。一步之内,训练报废。

`inf` 怎么来的:

- 对很大的正数取 `exp()`
- 除以零:`1.0 / 0.0`
- `float32` 累加时溢出

`nan` 怎么来的:

- `0.0 / 0.0`
- `inf - inf`
- `inf * 0`
- 对负数开 `sqrt()`
- 对负数取 `log()`
- 任何涉及已有 `nan` 的运算

检测:

```python
import math

math.isnan(x)       # True if x is nan
math.isinf(x)       # True if x is +inf or -inf
math.isfinite(x)    # True if x is neither nan nor inf
```

预防策略:

1. 钳制 `exp()` 的输入:`exp(clamp(x, -80, 80))`
2. 给分母加 epsilon:`x / (y + 1e-8)`
3. 在 `log()` 里加 epsilon:`log(x + 1e-8)`
4. 使用稳定实现(log-sum-exp、稳定版 softmax)
5. 梯度裁剪,防止权重爆炸
6. 调试时,每次前向传播后检查 `nan`/`inf`

### 数值梯度检验

解析梯度(来自反向传播)可能有 bug。数值梯度检验用有限差分计算梯度,以此验证解析梯度。

中心差分公式:

```
df/dx ~= (f(x + h) - f(x - h)) / (2h)
```

它的精度是 O(h^2),远好于只有 O(h) 的前向差分 `(f(x+h) - f(x)) / h`。

h 的选取:太大,近似不准;太小,灾难性抵消会毁掉结果。典型取值是 `h = 1e-5` 到 `1e-7`。

检验方法:计算解析梯度与数值梯度的相对差异。

```
relative_error = |grad_analytical - grad_numerical| / max(|grad_analytical|, |grad_numerical|, 1e-8)
```

经验法则:

- relative_error < 1e-7:完美,梯度正确
- relative_error < 1e-5:可接受,基本正确
- relative_error > 1e-3:有问题
- relative_error > 1:梯度完全错误

实现新层或新损失函数时,一定要做梯度检验。PyTorch 提供了 `torch.autograd.gradcheck()` 干这件事。

### 混合精度训练

现代 GPU 有专用硬件(Tensor Core),float16 矩阵乘法的速度是 float32 的 2–8 倍。混合精度训练正是利用这一点:

```
1. Maintain float32 master copy of weights
2. Forward pass in float16 (fast)
3. Compute loss in float32 (prevents overflow)
4. Backward pass in float16 (fast)
5. Scale gradients to float32
6. Update float32 master weights
```

纯 float16 训练的问题在于:梯度常常非常小(1e-8 甚至更小),而 float16 会把约 6e-8 以下的值下溢成零。所有梯度更新全是零,模型停止学习。

解决办法是损失缩放(loss scaling):

```
1. Multiply loss by a large scale factor (e.g., 1024)
2. Backward pass computes gradients of (loss * 1024)
3. All gradients are 1024x larger (pushed above float16 underflow)
4. Divide gradients by 1024 before updating weights
5. Net effect: same update, but no underflow
```

动态损失缩放会自动调整缩放因子:从一个较大的值起步(65536),若梯度溢出成 `inf` 就减半,若连续 N 步没有溢出就翻倍。

### bfloat16 与 float16:为什么训练选 bfloat16

```
float16:   [1 sign] [5 exponent]  [10 mantissa]
bfloat16:  [1 sign] [8 exponent]  [7 mantissa]
```

float16 精度更高(尾数 10 位对 7 位),但范围有限(最大约 65,504)。bfloat16 精度更低,但范围与 float32 相同(最大约 3.4e38)。

对训练神经网络来说:

- 训练尖峰期间,激活值和 logits 经常超过 65,504。float16 会溢出,bfloat16 扛得住。
- float16 必须配损失缩放,而 bfloat16 通常不需要——它的范围覆盖了梯度幅度的整个谱系。
- bfloat16 就是 float32 的简单截断:砍掉尾数低 16 位。转换极其平凡,指数部分无损。

float16 更适合推理——取值有界,精度更重要。bfloat16 更适合训练——范围更重要。这就是为什么 TPU 和现代 NVIDIA GPU(A100、H100)都原生支持 bfloat16。

### 梯度裁剪

梯度在穿过很多层时指数级增长,就会发生梯度爆炸(RNN、深层网络和 Transformer 中很常见)。单个巨大的梯度,一步就能毁掉全部权重。

两种裁剪方式:

**按值裁剪:** 独立钳制每个梯度元素。

```
grad = clamp(grad, -max_val, max_val)
```

简单,但可能改变梯度向量的方向。

**按范数裁剪:** 整体缩放梯度向量,使其范数不超过阈值。

```
if ||grad|| > max_norm:
    grad = grad * (max_norm / ||grad||)
```

保持梯度方向不变。`torch.nn.utils.clip_grad_norm_()` 就是这么做的,也是标准选择。

典型取值:Transformer 用 `max_norm=1.0`,强化学习用 `max_norm=0.5`,较简单的网络用 `max_norm=5.0`。

梯度裁剪不是野路子,而是安全机制。没有它,一个异常批次产生的巨大梯度,足以毁掉数周的训练成果。

### 归一化层也是数值稳定器

批归一化、层归一化和 RMS 归一化,通常被介绍为帮助训练收敛的正则化手段。它们同时也是数值稳定器。

不做归一化,激活值会逐层指数级膨胀或收缩:

```
Layer 1: values in [0, 1]
Layer 5: values in [0, 100]
Layer 10: values in [0, 10,000]
Layer 50: values in [0, inf]
```

归一化在每一层把激活值重新定心、重新缩放:

```
LayerNorm(x) = (x - mean(x)) / (std(x) + epsilon) * gamma + beta
```

其中 `epsilon`(通常 1e-5)在所有激活值完全相同的情况下防止除零。可学习参数 `gamma` 和 `beta` 让网络可以恢复它需要的任何尺度。

这让整个网络中的数值都保持在数值安全的范围内,既防前向溢出,也防反向传播时的梯度爆炸。

### 常见 ML 数值 bug

**Bug:几个 epoch 后损失变成 NaN。**
原因:logits 涨得太大,softmax 溢出;或者学习率过高,权重发散。
修复:使用稳定版 softmax(减最大值)、降低学习率、加梯度裁剪。

**Bug:损失卡在 log(num_classes)。**
原因:模型输出接近均匀分布。通常意味着梯度消失,或者模型根本没在学。
修复:检查数据标签是否正确、验证损失函数、检查是否有"死亡"的 ReLU。

**Bug:验证准确率比预期低 1–3%。**
原因:混合精度训练没配好损失缩放。梯度下溢悄悄把小更新抹成零。
修复:启用动态损失缩放,或改用 bfloat16。

**Bug:某些层的梯度范数是 0.0。**
原因:ReLU 神经元死亡(输入全为负),或 float16 下溢。
修复:换 LeakyReLU 或 GELU、做梯度缩放、检查权重初始化。

**Bug:模型在一块 GPU 上正常,换一块结果就不同。**
原因:浮点累加顺序不确定。GPU 并行归约在不同硬件上按不同顺序求和,而浮点加法不满足结合律。
修复:接受微小差异(1e-6 量级);或者设置 `torch.use_deterministic_algorithms(True)`,接受速度损失。

**Bug:损失计算中 `exp()` 返回 `inf`。**
原因:原始 logits 没经减最大值处理就直接喂给了 `exp()`。
修复:使用 `torch.nn.functional.log_softmax()`,它内部实现了 log-sum-exp。

**Bug:从 float32 切到 float16 后训练发散。**
原因:float16 表示不了小于 6e-8 的梯度幅度,也装不下超过 65,504 的激活值。
修复:用带损失缩放的混合精度(AMP),或改用 bfloat16。

```figure
logsumexp-stability
```

## 动手构建

### 第 1 步:演示浮点精度极限

```python
print("=== Floating Point Precision ===")
print(f"0.1 + 0.2 = {0.1 + 0.2}")
print(f"0.1 + 0.2 == 0.3? {0.1 + 0.2 == 0.3}")
print(f"Difference: {(0.1 + 0.2) - 0.3:.2e}")
```

### 第 2 步:实现朴素版与稳定版 softmax

```python
import math

def softmax_naive(logits):
    exps = [math.exp(z) for z in logits]
    total = sum(exps)
    return [e / total for e in exps]

def softmax_stable(logits):
    max_logit = max(logits)
    exps = [math.exp(z - max_logit) for z in logits]
    total = sum(exps)
    return [e / total for e in exps]

safe_logits = [2.0, 1.0, 0.1]
print(f"Naive:  {softmax_naive(safe_logits)}")
print(f"Stable: {softmax_stable(safe_logits)}")

dangerous_logits = [100.0, 101.0, 102.0]
print(f"Stable: {softmax_stable(dangerous_logits)}")
# softmax_naive(dangerous_logits) would return [nan, nan, nan]
```

### 第 3 步:实现稳定版 log-sum-exp

```python
def logsumexp_naive(values):
    return math.log(sum(math.exp(v) for v in values))

def logsumexp_stable(values):
    c = max(values)
    return c + math.log(sum(math.exp(v - c) for v in values))

safe = [1.0, 2.0, 3.0]
print(f"Naive:  {logsumexp_naive(safe):.6f}")
print(f"Stable: {logsumexp_stable(safe):.6f}")

large = [500.0, 501.0, 502.0]
print(f"Stable: {logsumexp_stable(large):.6f}")
# logsumexp_naive(large) returns inf
```

### 第 4 步:实现稳定版交叉熵

```python
def cross_entropy_naive(true_class, logits):
    probs = softmax_naive(logits)
    return -math.log(probs[true_class])

def cross_entropy_stable(true_class, logits):
    max_logit = max(logits)
    shifted = [z - max_logit for z in logits]
    log_sum_exp = math.log(sum(math.exp(s) for s in shifted))
    log_prob = shifted[true_class] - log_sum_exp
    return -log_prob

logits = [2.0, 5.0, 1.0]
true_class = 1
print(f"Naive:  {cross_entropy_naive(true_class, logits):.6f}")
print(f"Stable: {cross_entropy_stable(true_class, logits):.6f}")
```

### 第 5 步:梯度检验

```python
def numerical_gradient(f, x, h=1e-5):
    grad = []
    for i in range(len(x)):
        x_plus = x[:]
        x_minus = x[:]
        x_plus[i] += h
        x_minus[i] -= h
        grad.append((f(x_plus) - f(x_minus)) / (2 * h))
    return grad

def check_gradient(analytical, numerical, tolerance=1e-5):
    for i, (a, n) in enumerate(zip(analytical, numerical)):
        denom = max(abs(a), abs(n), 1e-8)
        rel_error = abs(a - n) / denom
        status = "OK" if rel_error < tolerance else "FAIL"
        print(f"  param {i}: analytical={a:.8f} numerical={n:.8f} "
              f"rel_error={rel_error:.2e} [{status}]")

def f(params):
    x, y = params
    return x**2 + 3*x*y + y**3

def f_grad(params):
    x, y = params
    return [2*x + 3*y, 3*x + 3*y**2]

point = [2.0, 1.0]
analytical = f_grad(point)
numerical = numerical_gradient(f, point)
check_gradient(analytical, numerical)
```

## 投入使用

### 混合精度模拟

```python
import struct

def float32_to_float16_round(x):
    packed = struct.pack('f', x)
    f32 = struct.unpack('f', packed)[0]
    packed16 = struct.pack('e', f32)
    return struct.unpack('e', packed16)[0]

def simulate_bfloat16(x):
    packed = struct.pack('f', x)
    as_int = int.from_bytes(packed, 'little')
    truncated = as_int & 0xFFFF0000
    repacked = truncated.to_bytes(4, 'little')
    return struct.unpack('f', repacked)[0]
```

### 梯度裁剪

```python
def clip_by_norm(gradients, max_norm):
    total_norm = math.sqrt(sum(g**2 for g in gradients))
    if total_norm > max_norm:
        scale = max_norm / total_norm
        return [g * scale for g in gradients]
    return gradients

grads = [10.0, 20.0, 30.0]
clipped = clip_by_norm(grads, max_norm=5.0)
print(f"Original norm: {math.sqrt(sum(g**2 for g in grads)):.2f}")
print(f"Clipped norm:  {math.sqrt(sum(g**2 for g in clipped)):.2f}")
print(f"Direction preserved: {[c/clipped[0] for c in clipped]} == {[g/grads[0] for g in grads]}")
```

### NaN/Inf 检测

```python
def check_tensor(name, values):
    has_nan = any(math.isnan(v) for v in values)
    has_inf = any(math.isinf(v) for v in values)
    if has_nan or has_inf:
        print(f"WARNING {name}: nan={has_nan} inf={has_inf}")
        return False
    return True

check_tensor("good", [1.0, 2.0, 3.0])
check_tensor("bad",  [1.0, float('nan'), 3.0])
check_tensor("ugly", [1.0, float('inf'), 3.0])
```

完整实现(含所有边界情况的演示)见 `code/numerical.py`。

## 交付

本课产出:

- `code/numerical.py`:稳定版 softmax、log-sum-exp、交叉熵、梯度检验与混合精度模拟
- `outputs/prompt-numerical-debugger.md`:用于诊断训练中的 NaN/Inf 与数值问题

这些稳定实现会在第 3 阶段搭建训练循环、第 4 阶段实现注意力机制时再次用到。

## 练习

1. **灾难性抵消。** 用朴素公式 `E[x^2] - E[x]^2` 在 float32 下计算 [1000000.0, 1000001.0, 1000002.0] 的方差,再用 Welford 在线算法算一遍。与真实方差(0.6667)对比两者的误差。

2. **精度寻踪。** 找出在 Python 中使 `1.0 + x == 1.0` 成立的最小正 float32 值 `x`——这就是机器 epsilon。验证它与 `numpy.finfo(numpy.float32).eps` 一致。

3. **log-sum-exp 边界情况。** 用以下输入测试你的 `logsumexp_stable`:(a) 所有值相等;(b) 一个值远大于其余;(c) 所有值都非常负(-1000)。验证在朴素版本失败的地方,它能给出正确结果。

4. **神经网络层的梯度检验。** 实现单个线性层 `y = Wx + b` 及其解析反向传播,用 `numerical_gradient` 对一个 3x2 权重矩阵验证正确性。

5. **损失缩放实验。** 模拟 float16 训练:在 [1e-9, 1e-3] 范围内生成随机梯度,转成 float16,统计变成零的比例。然后应用损失缩放(乘以 1024),转成 float16 再缩回来,重新统计零值比例。

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|----------------|----------------------|
| IEEE 754 | "浮点标准" | 定义二进制浮点格式、舍入规则和特殊值(inf、nan)的国际标准。所有现代 CPU 和 GPU 都实现它。 |
| 机器 epsilon | "精度极限" | 在给定浮点格式下,使 1.0 + e != 1.0 成立的最小值 e。float32 下约为 1.19e-7。 |
| 灾难性抵消 | "减法丢精度" | 两个几乎相等的浮点数相减时,有效数字相互抵消,结果被舍入噪声主导。 |
| 上溢 | "数太大了" | 结果超过可表示的最大值,变成 inf。exp(89) 在 float32 下就会上溢。 |
| 下溢 | "数太小了" | 结果比最小可表示正数更接近零,变成 0.0。exp(-104) 在 float32 下就会下溢。 |
| log-sum-exp 技巧 | "先减最大值" | 计算 log(sum(exp(x))) 时提出 exp(max(x)) 这个因子,防止上溢和下溢。用于 softmax、交叉熵和对数概率运算。 |
| 稳定版 softmax | "不会炸的 softmax" | 取指数前先减去 max(logits)。数值结果完全相同,但不可能溢出。 |
| 梯度检验 | "验证你的反向传播" | 把反向传播算出的解析梯度与有限差分算出的数值梯度对比,抓实现 bug。 |
| 混合精度 | "前向 float16,反向 float32" | 对速度敏感的操作用低精度浮点,对数值敏感的操作用高精度浮点。典型加速 2–3 倍。 |
| 损失缩放 | "防止梯度下溢" | 反向传播前把损失乘以一个大常数,让梯度留在 float16 可表示范围内,更新权重前再除以同一常数。 |
| bfloat16 | "大脑浮点" | Google 的 16 位格式:8 位指数(范围与 float32 相同)、7 位尾数(精度低于 float16)。训练首选。 |
| 梯度裁剪 | "给梯度范数封顶" | 缩放梯度向量使其范数不超过阈值,防止梯度爆炸毁掉权重。 |
| NaN | "非数" | 未定义运算(0/0、inf-inf、sqrt(-1))产生的特殊浮点值,会在后续一切运算中传播。 |
| Inf | "无穷大" | 上溢或除零产生的特殊浮点值。相互组合可产生 NaN(inf - inf、inf * 0)。 |
| 数值梯度 | "暴力求导" | 通过计算 f(x+h) 和 f(x-h) 再除以 2h 来近似导数。慢,但用于验证很可靠。 |

## 延伸阅读

- [What Every Computer Scientist Should Know About Floating-Point Arithmetic (Goldberg 1991)](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html) — 权威参考文献,艰深但完备
- [Mixed Precision Training (Micikevicius et al., 2018)](https://arxiv.org/abs/1710.03740) — 提出 float16 训练损失缩放的 NVIDIA 论文
- [AMP: Automatic Mixed Precision (PyTorch docs)](https://pytorch.org/docs/stable/amp.html) — PyTorch 混合精度实战指南
- [bfloat16 format (Google Cloud TPU docs)](https://cloud.google.com/tpu/docs/bfloat16) — Google 为什么为 TPU 选这个格式
- [Kahan Summation (Wikipedia)](https://en.wikipedia.org/wiki/Kahan_summation_algorithm) — 降低浮点求和舍入误差的算法
