# 学习率调度与预热

> 学习率是最重要的超参数,没有之一。不是架构,不是数据集大小,不是激活函数,是学习率。如果你只调一个东西,就调它。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 03.06 课(优化器)、第 03.08 课(权重初始化)
**预计耗时:** 约 90 分钟

## 学习目标

- 从零实现恒定、阶梯衰减、余弦退火、预热 + 余弦和 1cycle 五种学习率调度
- 演示学习率选择的三种失败模式:发散(太高)、停滞(太低)、震荡(不衰减)
- 解释为什么基于 Adam 的优化器需要预热,以及预热如何稳定训练初期
- 在同一任务上比较五种调度的收敛速度,并针对给定的训练预算选出合适的一种

## 问题

把学习率设为 0.1,训练发散——损失 3 步之内冲到无穷大。设为 0.0001,训练龟速——100 个 epoch 过去,模型几乎没离开随机起点。设为 0.01,前 50 个 epoch 跑得好好的,然后损失开始在一个永远到不了的最小值附近震荡,因为步子太大了。

最优学习率不是一个常数,它在训练过程中变化。训练初期,你想要大步长,快速推进;训练后期,你想要小碎步,稳稳落进一个尖锐的最小值。90% 精度的模型和 95% 精度的模型之间,差别往往只在调度上。

过去三年发布的每个重要模型都在用学习率调度。Llama 3 用峰值 lr=3e-4、2000 步预热、余弦衰减到 3e-5;GPT-3 用 lr=6e-4、跨越 3.75 亿 token 的预热。这些不是拍脑袋的选择,而是耗资数百万美元的超参数扫描的结果。

你需要理解调度,因为默认值不会适合你的问题。微调预训练模型时,正确的调度与从零训练不同;增大批大小时,预热长度要跟着变;训练在第 10000 步崩掉时,你需要判断这是调度的问题还是别的问题。

## 概念

### 恒定学习率

最简单的做法。选一个数,每一步都用它。

```
lr(t) = lr_0
```

很少是最优的。它对训练末期来说往往太高(在最小值附近震荡),对训练初期来说又往往太低(小碎步浪费算力)。小模型和调试用着没问题,但任何要训练一小时以上的任务,选它都很糟。

### 阶梯衰减

ResNet 时代的老派做法。在固定的 epoch 把学习率砍一个因子(通常是 10 倍)。

```
lr(t) = lr_0 * gamma^(floor(epoch / step_size))
```

gamma = 0.1、step_size = 30 意味着:每 30 个 epoch,学习率降 10 倍。ResNet-50 就是这么做的——lr=0.1,在第 30、60、90 个 epoch 各降 10 倍。

问题在于:最优的衰减时点取决于数据集和架构。换一个问题,你就得重新调衰减时机。而且切换是突兀的——学习率骤变时,损失可能猛跳一下。

### 余弦退火

沿余弦曲线,从最大学习率平滑衰减到最小值:

```
lr(t) = lr_min + 0.5 * (lr_max - lr_min) * (1 + cos(pi * t / T))
```

t 是当前步数,T 是总步数。

t=0 时,余弦项为 1,lr = lr_max;t=T 时,余弦项为 -1,lr = lr_min。衰减先缓、中段加快、结尾再放缓。

这是现代大多数训练运行的默认选择。除了 lr_max 和 lr_min 之外没有超参数要调。余弦的形状契合一个经验观察:大部分学习发生在训练中段——在那个关键期,你需要合理的步长。

### 预热:为什么要从小开始

Adam 等自适应优化器维护梯度均值和方差的滑动估计。在第 0 步,这些估计初始为零,最初几步更新依据的是垃圾统计量。如果这段时间学习率很大,模型就会迈出巨大而方向糟糕的步子。

预热解决这个问题。从极小的学习率开始(常取 lr_max / warmup_steps,甚至从零开始),在前 N 步内线性爬升到 lr_max。等你到达完整学习率时,Adam 的统计量已经稳定了。

```
lr(t) = lr_max * (t / warmup_steps)     for t < warmup_steps
```

典型预热长度:总训练步数的 1-5%。Llama 3 训练了约 1.8 万亿 token,预热了 2000 步;GPT-3 的预热跨了 3.75 亿 token。

### 线性预热 + 余弦衰减

现代默认方案。先线性爬升,再余弦衰减:

```
if t < warmup_steps:
    lr(t) = lr_max * (t / warmup_steps)
else:
    progress = (t - warmup_steps) / (total_steps - warmup_steps)
    lr(t) = lr_min + 0.5 * (lr_max - lr_min) * (1 + cos(pi * progress))
```

Llama、GPT、PaLM 和大多数现代 Transformer 用的都是它。预热防止早期不稳定,余弦衰减把模型安稳落进一个好最小值。

### 1cycle 策略

Leslie Smith 的发现(2018):训练前半段把学习率从低值 ramp 到高值,后半段再 ramp 回来。反直觉——为什么中途要*升高*学习率?

理论是:高学习率通过给优化轨迹注入噪声,起到正则化作用。爬升阶段,模型在损失曲面上探索更多区域,找到更好的盆地;下降阶段再在找到的最佳盆地内精修。

```
Phase 1 (0 to T/2):    lr ramps from lr_max/25 to lr_max
Phase 2 (T/2 to T):    lr ramps from lr_max to lr_max/10000
```

在固定算力预算下,1cycle 常常比余弦退火收敛更快。代价是:你必须提前知道总步数。

### 调度形状

```mermaid
graph LR
    subgraph "Constant"
        C1["lr"] --- C2["lr"] --- C3["lr"]
    end

    subgraph "Step Decay"
        S1["0.1"] --- S2["0.1"] --- S3["0.01"] --- S4["0.001"]
    end

    subgraph "Cosine Annealing"
        CS1["lr_max"] --> CS2["gradual"] --> CS3["steep"] --> CS4["lr_min"]
    end

    subgraph "Warmup + Cosine"
        WC1["0"] --> WC2["lr_max"] --> WC3["cosine"] --> WC4["lr_min"]
    end
```

### 决策流程图

```mermaid
flowchart TD
    Start["Choosing a LR schedule"] --> Know{"Know total<br/>training steps?"}

    Know -->|"Yes"| Budget{"Compute budget?"}
    Know -->|"No"| Constant["Use constant LR<br/>with manual decay"]

    Budget -->|"Large (days/weeks)"| WarmCos["Warmup + Cosine Decay<br/>(Llama/GPT default)"]
    Budget -->|"Small (hours)"| OneCycle["1cycle Policy<br/>(fastest convergence)"]
    Budget -->|"Moderate"| Cosine["Cosine Annealing<br/>(safe default)"]

    WarmCos --> Warmup["Warmup = 1-5% of steps"]
    OneCycle --> FindLR["Find lr_max with LR range test"]
    Cosine --> MinLR["Set lr_min = lr_max / 10"]
```

### 已发表模型的真实数字

```mermaid
graph TD
    subgraph "Published LR Configs"
        L3["Llama 3 (405B)<br/>Peak: 3e-4<br/>Warmup: 2000 steps<br/>Schedule: Cosine to 3e-5"]
        G3["GPT-3 (175B)<br/>Peak: 6e-4<br/>Warmup: 375M tokens<br/>Schedule: Cosine to 0"]
        R50["ResNet-50<br/>Peak: 0.1<br/>Warmup: none<br/>Schedule: Step decay x0.1 at 30,60,90"]
        B["BERT (340M)<br/>Peak: 1e-4<br/>Warmup: 10K steps<br/>Schedule: Linear decay"]
    end
```

```figure
lr-schedule
```

## 动手构建

### 第 1 步:调度函数

每个函数接收当前步数,返回该步的学习率。

```python
import math


def constant_schedule(step, lr=0.01, **kwargs):
    return lr


def step_decay_schedule(step, lr=0.1, step_size=100, gamma=0.1, **kwargs):
    return lr * (gamma ** (step // step_size))


def cosine_schedule(step, lr=0.01, total_steps=1000, lr_min=1e-5, **kwargs):
    if step >= total_steps:
        return lr_min
    return lr_min + 0.5 * (lr - lr_min) * (1 + math.cos(math.pi * step / total_steps))


def warmup_cosine_schedule(step, lr=0.01, total_steps=1000, warmup_steps=100, lr_min=1e-5, **kwargs):
    if total_steps <= warmup_steps:
        return lr * (step / max(warmup_steps, 1))
    if step < warmup_steps:
        return lr * step / warmup_steps
    progress = (step - warmup_steps) / (total_steps - warmup_steps)
    return lr_min + 0.5 * (lr - lr_min) * (1 + math.cos(math.pi * progress))


def one_cycle_schedule(step, lr=0.01, total_steps=1000, **kwargs):
    mid = max(total_steps // 2, 1)
    if step < mid:
        return (lr / 25) + (lr - lr / 25) * step / mid
    else:
        progress = (step - mid) / max(total_steps - mid, 1)
        return lr * (1 - progress) + (lr / 10000) * progress
```

### 第 2 步:可视化所有调度

打印一张文本图,展示每种调度在训练过程中的变化。

```python
def visualize_schedule(name, schedule_fn, total_steps=500, **kwargs):
    steps = list(range(0, total_steps, total_steps // 20))
    if total_steps - 1 not in steps:
        steps.append(total_steps - 1)

    lrs = [schedule_fn(s, total_steps=total_steps, **kwargs) for s in steps]
    max_lr = max(lrs) if max(lrs) > 0 else 1.0

    print(f"\n{name}:")
    for s, lr_val in zip(steps, lrs):
        bar_len = int(lr_val / max_lr * 40)
        bar = "#" * bar_len
        print(f"  Step {s:4d}: lr={lr_val:.6f} {bar}")
```

### 第 3 步:训练网络

在 circle 数据集上训练一个简单的两层网络,与之前的课程相同,但这次我们改变调度。

```python
import random


def sigmoid(x):
    x = max(-500, min(500, x))
    return 1.0 / (1.0 + math.exp(-x))


def relu(x):
    return max(0.0, x)


def relu_deriv(x):
    return 1.0 if x > 0 else 0.0


def make_circle_data(n=200, seed=42):
    random.seed(seed)
    data = []
    for _ in range(n):
        x = random.uniform(-2, 2)
        y = random.uniform(-2, 2)
        label = 1.0 if x * x + y * y < 1.5 else 0.0
        data.append(([x, y], label))
    return data


def train_with_schedule(schedule_fn, schedule_name, data, epochs=300, base_lr=0.05, **kwargs):
    random.seed(0)
    hidden_size = 8
    total_steps = epochs * len(data)

    std = math.sqrt(2.0 / 2)
    w1 = [[random.gauss(0, std) for _ in range(2)] for _ in range(hidden_size)]
    b1 = [0.0] * hidden_size
    w2 = [random.gauss(0, std) for _ in range(hidden_size)]
    b2 = 0.0

    step = 0
    epoch_losses = []

    for epoch in range(epochs):
        total_loss = 0
        correct = 0

        for x, target in data:
            lr = schedule_fn(step, lr=base_lr, total_steps=total_steps, **kwargs)

            z1 = []
            h = []
            for i in range(hidden_size):
                z = w1[i][0] * x[0] + w1[i][1] * x[1] + b1[i]
                z1.append(z)
                h.append(relu(z))

            z2 = sum(w2[i] * h[i] for i in range(hidden_size)) + b2
            out = sigmoid(z2)

            error = out - target
            d_out = error * out * (1 - out)

            for i in range(hidden_size):
                d_h = d_out * w2[i] * relu_deriv(z1[i])
                w2[i] -= lr * d_out * h[i]
                for j in range(2):
                    w1[i][j] -= lr * d_h * x[j]
                b1[i] -= lr * d_h
            b2 -= lr * d_out

            total_loss += (out - target) ** 2
            if (out >= 0.5) == (target >= 0.5):
                correct += 1
            step += 1

        avg_loss = total_loss / len(data)
        accuracy = correct / len(data) * 100
        epoch_losses.append(avg_loss)

    return epoch_losses
```

### 第 4 步:比较所有调度

用每种调度训练同一个网络,比较最终损失和收敛行为。

```python
def compare_schedules(data):
    configs = [
        ("Constant", constant_schedule, {}),
        ("Step Decay", step_decay_schedule, {"step_size": 15000, "gamma": 0.1}),
        ("Cosine", cosine_schedule, {"lr_min": 1e-5}),
        ("Warmup+Cosine", warmup_cosine_schedule, {"warmup_steps": 3000, "lr_min": 1e-5}),
        ("1cycle", one_cycle_schedule, {}),
    ]

    print(f"\n{'Schedule':<20} {'Start Loss':>12} {'Mid Loss':>12} {'End Loss':>12} {'Best Loss':>12}")
    print("-" * 70)

    for name, schedule_fn, extra_kwargs in configs:
        losses = train_with_schedule(schedule_fn, name, data, epochs=300, base_lr=0.05, **extra_kwargs)
        mid_idx = len(losses) // 2
        best = min(losses)
        print(f"{name:<20} {losses[0]:>12.6f} {losses[mid_idx]:>12.6f} {losses[-1]:>12.6f} {best:>12.6f}")
```

### 第 5 步:学习率过高 vs 过低

演示三种失败模式:太高(发散)、太低(龟速)和恰到好处。

```python
def lr_sensitivity(data):
    learning_rates = [1.0, 0.1, 0.01, 0.001, 0.0001]

    print("\nLR Sensitivity (constant schedule, 100 epochs):")
    print(f"  {'LR':>10} {'Start Loss':>12} {'End Loss':>12} {'Status':>15}")
    print("  " + "-" * 52)

    for lr in learning_rates:
        losses = train_with_schedule(constant_schedule, f"lr={lr}", data, epochs=100, base_lr=lr)
        start = losses[0]
        end = losses[-1]

        if end > start or math.isnan(end) or end > 1.0:
            status = "DIVERGED"
        elif end > start * 0.9:
            status = "BARELY MOVED"
        elif end < 0.15:
            status = "CONVERGED"
        else:
            status = "LEARNING"

        end_str = f"{end:.6f}" if not math.isnan(end) else "NaN"
        print(f"  {lr:>10.4f} {start:>12.6f} {end_str:>12} {status:>15}")
```

## 投入使用

PyTorch 在 `torch.optim.lr_scheduler` 里提供了各种调度器:

```python
import torch
import torch.optim as optim
from torch.optim.lr_scheduler import CosineAnnealingLR, OneCycleLR, StepLR

model = nn.Sequential(nn.Linear(10, 64), nn.ReLU(), nn.Linear(64, 1))
optimizer = optim.Adam(model.parameters(), lr=3e-4)

scheduler = CosineAnnealingLR(optimizer, T_max=1000, eta_min=1e-5)

for step in range(1000):
    loss = train_step(model, optimizer)
    scheduler.step()
```

预热 + 余弦可以用 lambda 调度器,或者用 HuggingFace 的 `get_cosine_schedule_with_warmup`:

```python
from transformers import get_cosine_schedule_with_warmup

scheduler = get_cosine_schedule_with_warmup(
    optimizer,
    num_warmup_steps=2000,
    num_training_steps=100000,
)
```

HuggingFace 这个函数是大多数 Llama 和 GPT 微调脚本的标配。拿不准的时候,就用预热 + 余弦,预热取总步数的 3-5%。它几乎对一切都有效。

## 交付

本课产出:
- `outputs/prompt-lr-schedule-advisor.md` -- 一个为你的训练配置推荐合适学习率调度和超参数的提示词

## 练习

1. 实现指数衰减:lr(t) = lr_0 * gamma^t,取 gamma = 0.999。在 circle 数据集上与余弦退火对比。

2. 实现学习率范围测试(Leslie Smith):训练几百步,同时让学习率从 1e-7 指数增长到 1。画出损失对学习率的曲线。最优的最大学习率就在损失开始上升之前。

3. 用预热 + 余弦训练,但改变预热长度:总步数的 0%、1%、5%、10%、20%。找出训练最稳定的甜点。

4. 实现带热重启的余弦退火(SGDR):每 T 步把学习率重置回 lr_max,再次衰减。在更长的训练运行中与普通余弦对比。

5. 构建一个"调度外科医生":监控训练损失,在损失稳定时自动从预热切换到余弦,并在损失平台期过长时降低学习率。

## 关键术语

| 术语 | 大家口头的说法 | 实际含义 |
|------|----------------|----------------------|
| 学习率 | "模型学多快" | 与梯度相乘、决定参数更新步幅的标量 |
| 调度 | "随时间改学习率" | 把训练步数映射到学习率的函数,为优化收敛而设计 |
| 预热 | "先用小学习率" | 在前 N 步把学习率从接近零线性爬升到目标值,让优化器统计量稳定下来 |
| 余弦退火 | "平滑的学习率衰减" | 让学习率沿余弦曲线从 lr_max 降到 lr_min |
| 阶梯衰减 | "到里程碑就降" | 在固定的 epoch 间隔把学习率乘以一个因子(通常 0.1) |
| 1cycle 策略 | "先升后降" | Leslie Smith 的方法:学习率在一个周期内先 ramp 上去再 ramp 下来,收敛更快 |
| 学习率范围测试 | "找最好的学习率" | 短暂训练并逐步增大学习率,找到损失开始发散前的那个值 |
| 带热重启的余弦 | "重置再来" | 周期性地把学习率重置回 lr_max 再衰减(SGDR) |
| Eta min | "学习率的地板" | 调度衰减到的最小学习率 |
| 峰值学习率 | "最大学习率" | 训练中达到的最高学习率,通常在预热结束之后 |

## 延伸阅读

- Loshchilov & Hutter, "SGDR: Stochastic Gradient Descent with Warm Restarts" (2017) -- 提出余弦退火与热重启
- Smith, "Super-Convergence: Very Fast Training of Neural Networks Using Large Learning Rates" (2018) -- 1cycle 策略论文
- Touvron et al., "Llama 2: Open Foundation and Fine-Tuned Chat Models" (2023) -- 记录了大规模使用的预热 + 余弦调度
- Goyal et al., "Accurate, Large Minibatch SGD: Training ImageNet in 1 Hour" (2017) -- 大批量训练的线性缩放规则与预热
