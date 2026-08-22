# JAX 入门

> PyTorch 原地改张量,TensorFlow 构建计算图,JAX 编译纯函数。最后这一种,会改变你思考深度学习的方式。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 03 阶段第 01-10 课,基础 NumPy
**预计耗时:** 约 90 分钟

## 学习目标

- 用 JAX 的函数式 API(jax.numpy、jax.grad、jax.jit、jax.vmap)编写纯函数风格的神经网络代码
- 解释 PyTorch 的即时可变执行与 JAX 的函数式编译模型之间的关键设计差异
- 应用 jit 编译和 vmap 向量化,让训练循环相比朴素 Python 大幅提速
- 在 JAX 中训练一个简单网络,并对比其显式状态管理与 PyTorch 面向对象方式的不同

## 问题

你已经会用 PyTorch 搭神经网络了。定义一个 `nn.Module`,调 `.backward()`,优化器走一步。能用,百万人在用。

但 PyTorch 的 DNA 里刻着一个约束:它在 Python 里即时地、一次一个操作地追踪执行。每个 `tensor + tensor` 都是一次独立的内核启动,每个训练步都重新解释一遍同样的 Python 代码。平时没问题,直到你要在 2048 块 TPU 上训练一个 5400 亿参数的模型——这时候开销会要了你的命。

Google DeepMind 用 JAX 训练 Gemini,Anthropic 用 JAX 训练 Claude。这些不是小打小闹——它们是地球上最大规模的神经网络训练。它们选 JAX,是因为 JAX 把你的训练循环当作一个可编译的程序,而不是一串 Python 调用。

JAX 就是长了三种超能力的 NumPy:自动微分、JIT 编译到 XLA、自动向量化。你写一个处理单个样本的函数,JAX 给你一个能处理整个批次、能算梯度、能编译成机器码、能跨多设备运行的函数——原函数一行都不用改。

## 概念

### JAX 哲学

JAX 是函数式框架。没有类,没有可变状态,没有 `.backward()` 方法。取而代之的是:

| PyTorch | JAX |
|---------|-----|
| 带状态的 `nn.Module` 类 | 纯函数:`f(params, x) -> y` |
| `loss.backward()` | `jax.grad(loss_fn)(params, x, y)` |
| 即时执行 | 经 XLA 的 JIT 编译 |
| `for x in batch:` 手写循环 | `jax.vmap(f)` 自动向量化 |
| `DataParallel` / `FSDP` | `jax.pmap(f)` 自动并行 |
| 可变的 `model.parameters()` | 不可变的数组 pytree |

这不是风格偏好,而是编译器的硬性约束。JIT 编译要求纯函数——同样的输入永远产出同样的输出,没有副作用。正是这个限制,让 100 倍加速成为可能。

### jax.numpy:熟悉的表面

JAX 在加速器上重新实现了 NumPy API:

```python
import jax.numpy as jnp

a = jnp.array([1.0, 2.0, 3.0])
b = jnp.array([4.0, 5.0, 6.0])
c = jnp.dot(a, b)
```

函数名一样,广播规则一样,切片语义一样。但数组活在 GPU/TPU 上,每个操作都能被编译器追踪。

一个关键区别:JAX 数组是不可变的。不能写 `a[0] = 5`,要写 `a = a.at[0].set(5)`。这会别扭一个星期,然后你就想通了——正是不可变性,让 `grad`、`jit`、`vmap` 这些变换可以任意组合。

### jax.grad:函数式自动微分

PyTorch 把梯度挂在张量上(`.grad`),JAX 把梯度挂在函数上。

```python
import jax

def f(x):
    return x ** 2

df = jax.grad(f)
df(3.0)
```

`jax.grad` 接收一个函数,返回一个计算梯度的新函数。没有 `.backward()` 调用,张量上也不存计算图。梯度就是另一个你可以调用、组合、JIT 编译的函数。

组合可以任意深:

```python
d2f = jax.grad(jax.grad(f))
d2f(3.0)
```

二阶导、三阶导、Jacobian、Hessian——全靠组合 `grad`。PyTorch 也能做(`torch.autograd.functional.hessian`),但那是后来补上去的;在 JAX 里,这是地基。

约束是:`grad` 只作用于纯函数。函数里不能有 print(它只在追踪时执行,不在真正执行时)、不能改外部状态、不能用没有显式密钥管理的随机数。

### jit:编译到 XLA

```python
@jax.jit
def train_step(params, x, y):
    loss = loss_fn(params, x, y)
    return loss

fast_step = jax.jit(train_step)
```

第一次调用时,JAX 追踪这个函数——它记录发生了哪些操作,但不真正执行。然后它把这份追踪交给 XLA(Accelerated Linear Algebra),Google 为 TPU 和 GPU 打造的编译器。XLA 融合操作、消除冗余的内存拷贝、生成优化的机器码。

之后的调用完全跳过 Python,编译后的代码在加速器上以 C++ 的速度运行。

JIT 什么时候有用:
- 训练步(同样的计算重复几千次)
- 推理(同一个模型,不同输入)
- 任何用相似形状的输入反复调用的函数

JIT 什么时候帮倒忙:
- 函数里有依赖数值的 Python 控制流(`if x > 0`,而 x 是被追踪的数组)
- 只用一次的计算(编译开销超过运行时间)
- 调试(追踪掩盖了真实执行)

控制流的限制是真的。`jax.lax.cond` 替代 `if/else`,`jax.lax.scan` 替代 `for` 循环。这不是可选项,而是编译的代价。

### vmap:自动向量化

你写一个处理单个样本的函数:

```python
def predict(params, x):
    return jnp.dot(params['w'], x) + params['b']
```

`vmap` 把它提升为处理整个批次:

```python
batch_predict = jax.vmap(predict, in_axes=(None, 0))
```

`in_axes=(None, 0)` 的意思是:`params` 不做批处理(共享),`x` 沿第 0 轴做批处理。不用手写 `for` 循环,不用 reshape,不用手动穿批次维度。JAX 自己找出批次维度,把整个计算向量化。

这不是语法糖。`vmap` 生成的融合向量化代码比 Python 循环快 10-100 倍。而且它还能与 `jit` 和 `grad` 组合:

```python
per_example_grads = jax.vmap(jax.grad(loss_fn), in_axes=(None, 0, 0))
```

逐样本梯度,一行搞定。在 PyTorch 里,不靠 hack 几乎做不到。

### pmap:跨设备数据并行

```python
parallel_step = jax.pmap(train_step, axis_name='devices')
```

`pmap` 把函数复制到所有可用设备(GPU/TPU)上,并切分批次。函数内部用 `jax.lax.pmean` 和 `jax.lax.psum` 跨设备同步梯度。

Google 用 `pmap`(及其后继 `shard_map`)在几千块 TPU v5e 芯片上训练 Gemini。编程模型是:写单设备版本,用 `pmap` 一包,完事。

### Pytree:万能数据结构

JAX 操作的对象是 "pytree"——列表、元组、字典和数组的任意嵌套组合。你的模型参数就是一个 pytree:

```python
params = {
    'layer1': {'w': jnp.zeros((784, 256)), 'b': jnp.zeros(256)},
    'layer2': {'w': jnp.zeros((256, 128)), 'b': jnp.zeros(128)},
    'layer3': {'w': jnp.zeros((128, 10)),  'b': jnp.zeros(10)},
}
```

每个 JAX 变换——`grad`、`jit`、`vmap`——都知道如何遍历 pytree。`jax.tree.map(f, tree)` 把 `f` 应用到每片叶子。优化器就是这样一次性更新所有参数的:

```python
params = jax.tree.map(lambda p, g: p - lr * g, params, grads)
```

没有 `.parameters()` 方法,没有参数注册。这棵树本身就是模型。

### 函数式 vs 面向对象

PyTorch 把状态存在对象里:

```python
class Model(nn.Module):
    def __init__(self):
        self.linear = nn.Linear(784, 10)

    def forward(self, x):
        return self.linear(x)
```

JAX 用纯函数加显式状态:

```python
def predict(params, x):
    return jnp.dot(x, params['w']) + params['b']
```

参数是传进来的。什么都不存,什么都不改。这让每个函数都可测试、可组合、可编译。代价是参数要你自己管——或者用 Flax、Equinox 这样的库。

### JAX 生态

JAX 给你原语,库给你易用性:

| 库 | 角色 | 风格 |
|---------|------|-------|
| **Flax**(Google) | 神经网络层 | 带显式状态的 `nn.Module` |
| **Equinox**(Patrick Kidger) | 神经网络层 | 基于 pytree,Pythonic |
| **Optax**(DeepMind) | 优化器 + 学习率调度 | 可组合的梯度变换 |
| **Orbax**(Google) | 检查点 | 保存/恢复 pytree |
| **CLU**(Google) | 指标 + 日志 | 训练循环工具 |

Optax 是标准优化器库。它把梯度变换(Adam、SGD、裁剪)与参数更新解耦,组合起来易如反掌:

```python
optimizer = optax.chain(
    optax.clip_by_global_norm(1.0),
    optax.adam(learning_rate=1e-3),
)
```

### 什么时候用 JAX,什么时候用 PyTorch

| 因素 | JAX | PyTorch |
|--------|-----|---------|
| TPU 支持 | 一等公民(Google 自产) | 社区维护(torch_xla) |
| GPU 支持 | 好(经 XLA 走 CUDA) | 最强(原生 CUDA) |
| 调试 | 难(追踪 + 编译) | 易(即时执行,逐行调试) |
| 生态 | 研究导向(Flax、Equinox) | 庞大(HuggingFace、torchvision 等) |
| 招聘市场 | 小众(Google/DeepMind/Anthropic) | 主流(到处都是) |
| 大规模训练 | 更强(XLA、pmap、mesh) | 好(FSDP、DeepSpeed) |
| 原型速度 | 较慢(函数式开销) | 较快(改了就能跑) |
| 生产推理 | TensorFlow Serving、Vertex AI | TorchServe、Triton、ONNX |
| 谁在用 | DeepMind(Gemini)、Anthropic(Claude) | Meta(Llama)、OpenAI(GPT)、Stability AI |

诚实的答案:除非你有具体理由,否则用 PyTorch。这些理由是——有 TPU 可用、需要逐样本梯度、超大规模多设备训练,或者你就在 Google/DeepMind/Anthropic 工作。

### JAX 里的随机数

JAX 没有全局随机状态。每个随机操作都需要显式的 PRNG 密钥:

```python
key = jax.random.PRNGKey(42)
key1, key2 = jax.random.split(key)
w = jax.random.normal(key1, shape=(784, 256))
```

一开始会很烦。但它保证了跨设备、跨编译的可复现性——这是 PyTorch 的 `torch.manual_seed` 在多 GPU 场景下保证不了的性质。

```figure
batchnorm-effect
```

## 动手构建

### 第 1 步:环境与数据

我们用 JAX 和 Optax 在 MNIST 上训练一个 3 层 MLP。784 个输入,两个隐藏层各 256 和 128 个神经元,10 个输出类别。

```python
import jax
import jax.numpy as jnp
from jax import random
import optax

def get_mnist_data():
    from sklearn.datasets import fetch_openml
    mnist = fetch_openml('mnist_784', version=1, as_frame=False, parser='auto')
    X = mnist.data.astype('float32') / 255.0
    y = mnist.target.astype('int')
    X_train, X_test = X[:60000], X[60000:]
    y_train, y_test = y[:60000], y[60000:]
    return X_train, y_train, X_test, y_test
```

### 第 2 步:初始化参数

没有类,只有一个返回 pytree 的函数:

```python
def init_params(key):
    k1, k2, k3 = random.split(key, 3)
    scale1 = jnp.sqrt(2.0 / 784)
    scale2 = jnp.sqrt(2.0 / 256)
    scale3 = jnp.sqrt(2.0 / 128)
    params = {
        'layer1': {
            'w': scale1 * random.normal(k1, (784, 256)),
            'b': jnp.zeros(256),
        },
        'layer2': {
            'w': scale2 * random.normal(k2, (256, 128)),
            'b': jnp.zeros(128),
        },
        'layer3': {
            'w': scale3 * random.normal(k3, (128, 10)),
            'b': jnp.zeros(10),
        },
    }
    return params
```

手动做 He 初始化。三个 PRNG 密钥从一个种子分裂出来。每个权重都是嵌套字典里的一个不可变数组。

### 第 3 步:前向传播

```python
def forward(params, x):
    x = jnp.dot(x, params['layer1']['w']) + params['layer1']['b']
    x = jax.nn.relu(x)
    x = jnp.dot(x, params['layer2']['w']) + params['layer2']['b']
    x = jax.nn.relu(x)
    x = jnp.dot(x, params['layer3']['w']) + params['layer3']['b']
    return x

def loss_fn(params, x, y):
    logits = forward(params, x)
    one_hot = jax.nn.one_hot(y, 10)
    return -jnp.mean(jnp.sum(jax.nn.log_softmax(logits) * one_hot, axis=-1))
```

纯函数。参数进,预测出。没有 `self`,不存状态。`loss_fn` 从零计算交叉熵——softmax、取 log、负均值。

### 第 4 步:JIT 编译的训练步

```python
@jax.jit
def train_step(params, opt_state, x, y):
    loss, grads = jax.value_and_grad(loss_fn)(params, x, y)
    updates, opt_state = optimizer.update(grads, opt_state, params)
    params = optax.apply_updates(params, updates)
    return params, opt_state, loss

@jax.jit
def accuracy(params, x, y):
    logits = forward(params, x)
    preds = jnp.argmax(logits, axis=-1)
    return jnp.mean(preds == y)
```

`jax.value_and_grad` 一次前向同时返回损失值和梯度。`@jax.jit` 装饰器把两个函数都编译到 XLA。第一次调用之后,每个训练步都不再经过 Python。

### 第 5 步:训练循环

```python
optimizer = optax.adam(learning_rate=1e-3)

X_train, y_train, X_test, y_test = get_mnist_data()
X_train, X_test = jnp.array(X_train), jnp.array(X_test)
y_train, y_test = jnp.array(y_train), jnp.array(y_test)

key = random.PRNGKey(0)
params = init_params(key)
opt_state = optimizer.init(params)

batch_size = 128
n_epochs = 10

for epoch in range(n_epochs):
    key, subkey = random.split(key)
    perm = random.permutation(subkey, len(X_train))
    X_shuffled = X_train[perm]
    y_shuffled = y_train[perm]

    epoch_loss = 0.0
    n_batches = len(X_train) // batch_size
    for i in range(n_batches):
        start = i * batch_size
        xb = X_shuffled[start:start + batch_size]
        yb = y_shuffled[start:start + batch_size]
        params, opt_state, loss = train_step(params, opt_state, xb, yb)
        epoch_loss += loss

    train_acc = accuracy(params, X_train[:5000], y_train[:5000])
    test_acc = accuracy(params, X_test, y_test)
    print(f"Epoch {epoch + 1:2d} | Loss: {epoch_loss / n_batches:.4f} | "
          f"Train Acc: {train_acc:.4f} | Test Acc: {test_acc:.4f}")
```

10 个 epoch,测试精度约 97%。第一个 epoch 慢(JIT 编译),第 2-10 个 epoch 快。

注意少了什么:没有 `.zero_grad()`,没有 `.backward()`,没有 `.step()`。整个更新就是一次组合好的函数调用。梯度被算出、经 Adam 变换、应用到参数上——全在 `train_step` 内部完成。

## 投入使用

### Flax:Google 标准

Flax 是最常见的 JAX 神经网络库。它把 `nn.Module` 加了回来,但状态管理是显式的:

```python
import flax.linen as nn

class MLP(nn.Module):
    @nn.compact
    def __call__(self, x):
        x = nn.Dense(256)(x)
        x = nn.relu(x)
        x = nn.Dense(128)(x)
        x = nn.relu(x)
        x = nn.Dense(10)(x)
        return x

model = MLP()
params = model.init(jax.random.PRNGKey(0), jnp.ones((1, 784)))
logits = model.apply(params, x_batch)
```

结构与 PyTorch 相同,但 `params` 与模型是分开的。`model.init()` 创建参数,`model.apply(params, x)` 跑前向。模型对象本身没有状态。

### Equinox:Pythonic 的替代者

Equinox(Patrick Kidger 编写)把模型表示为 pytree:

```python
import equinox as eqx

model = eqx.nn.MLP(
    in_size=784, out_size=10, width_size=256, depth=2,
    activation=jax.nn.relu, key=jax.random.PRNGKey(0)
)
logits = model(x)
```

模型本身就是 pytree,不需要 `.apply()`。参数就是模型的叶子。这更贴近 JAX 的思维方式。

### Optax:可组合的优化器

Optax 把梯度变换与参数更新解耦:

```python
schedule = optax.warmup_cosine_decay_schedule(
    init_value=0.0, peak_value=1e-3,
    warmup_steps=1000, decay_steps=50000
)

optimizer = optax.chain(
    optax.clip_by_global_norm(1.0),
    optax.adamw(learning_rate=schedule, weight_decay=0.01),
)
```

梯度裁剪、学习率预热、权重衰减——全都组合成一条变换链。每个变换看到梯度、修改它、传给下一个。没有臃肿的一体化优化器类。

## 交付

**安装:**

```bash
pip install jax jaxlib optax flax
```

GPU 支持:

```bash
pip install jax[cuda12]
```

TPU(Google Cloud):

```bash
pip install jax[tpu] -f https://storage.googleapis.com/jax-releases/libtpu_releases.html
```

**性能注意事项:**

- 第一次 JIT 调用很慢(编译)。做基准测试前先热身。
- JIT 内部避免对 JAX 数组写 Python 循环。用 `jax.lax.scan` 或 `jax.lax.fori_loop`。
- `jax.debug.print()` 在 JIT 里能用,普通 `print()` 不能。
- 用 `jax.profiler` 或 TensorBoard 做性能分析。XLA 编译可能掩盖瓶颈。
- JAX 默认预分配 75% 的 GPU 显存。设 `XLA_PYTHON_CLIENT_PREALLOCATE=false` 可关闭。

**检查点:**

```python
import orbax.checkpoint as ocp
checkpointer = ocp.PyTreeCheckpointer()
checkpointer.save('/tmp/model', params)
restored = checkpointer.restore('/tmp/model')
```

**本课产出:**
- `outputs/prompt-jax-optimizer.md` -- 一个选择合适 JAX 优化器配置的提示词
- `outputs/skill-jax-patterns.md` -- 一份涵盖 JAX 函数式模式的技能文档

## 练习

1. 给 MLP 加 dropout。在 JAX 里,dropout 需要 PRNG 密钥——把一个密钥穿进前向传播,为每个 dropout 层分裂。对比有无 dropout 的测试精度。

2. 用 `jax.vmap` 为一个 32 张 MNIST 图像的批次计算逐样本梯度。算出每个样本的梯度范数。哪些样本梯度最大,为什么?

3. 把手写的 forward 函数换成通用的 `mlp_forward(params, x)`,支持任意层数。用 `jax.tree.leaves` 自动判断深度。

4. 对比有无 `@jax.jit` 的训练步速度。各计时 100 步。在你的硬件上加速比多大?第一次调用的编译开销是多少?

5. 用 `optax.chain(optax.clip_by_global_norm(1.0), optax.adam(1e-3))` 组合实现梯度裁剪。分别在有裁剪和无裁剪下训练。画出训练中的梯度范数曲线,观察效果。

## 关键术语

| 术语 | 大家口头的说法 | 实际含义 |
|------|----------------|----------------------|
| XLA | "让 JAX 变快的东西" | Accelerated Linear Algebra——一个编译器,从计算图出发融合操作、生成优化的 GPU/TPU 内核 |
| JIT | "即时编译" | JAX 在第一次调用时追踪函数、编译到 XLA,之后的调用直接跑编译产物 |
| 纯函数 | "没有副作用" | 输出只取决于输入的函数——没有全局状态、没有原地修改、没有不带显式密钥的随机性 |
| vmap | "自动批处理" | 把处理单个样本的函数变换成处理整个批次的函数,无需改写 |
| pmap | "自动并行" | 把函数复制到多个设备上,并切分输入批次 |
| Pytree | "嵌套的数组字典" | 列表、元组、字典和数组的任意嵌套结构,JAX 可以遍历和变换它 |
| 追踪(Tracing) | "记录计算过程" | JAX 用抽象值执行函数以构建计算图,不算真实结果 |
| 函数式自动微分 | "对函数求导" | 通过变换函数来计算导数,而不是把梯度存储挂在张量上 |
| Optax | "JAX 的优化器库" | 可组合的梯度变换库——Adam、SGD、裁剪、调度——像链条一样串起来 |
| Flax | "JAX 的 nn.Module" | Google 的 JAX 神经网络库,在保持状态显式的前提下加上层抽象 |

## 延伸阅读

- JAX documentation: https://jax.readthedocs.io/ -- 官方文档,grad、jit、vmap 教程写得极好
- "JAX: composable transformations of Python+NumPy programs" (Bradbury et al., 2018) -- 阐述设计哲学的原始论文
- Flax documentation: https://flax.readthedocs.io/ -- Google 的 JAX 神经网络库
- Patrick Kidger, "Equinox: neural networks in JAX via callable PyTrees and filtered transformations" (2021) -- Flax 之外更 Pythonic 的选择
- DeepMind, "Optax: composable gradient transformation and optimisation" -- 标准优化器库
- "You Don't Know JAX" (Colin Raffel, 2020) -- JAX 坑与模式的实战指南,作者来自 T5 团队
