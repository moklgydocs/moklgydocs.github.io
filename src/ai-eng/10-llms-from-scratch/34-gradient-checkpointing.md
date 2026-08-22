# 梯度检查点与激活重计算

> 反向传播会保留每一个中间激活值。700 亿参数、128K 上下文时,每个 rank 上的激活值就是 3 TB。检查点技术用 FLOP 换显存:不存,重算。问题是丢掉哪些段,而答案不是"全丢"。

**类型:** 动手构建
**编程语言:** Python(用 numpy,可选 torch)
**前置要求:** 第 10 阶段第 04 课(预训练 Mini-GPT)、第 10 阶段第 05 课(扩展与分布式)
**预计耗时:** 约 70 分钟

## 问题

训练 Transformer 时,每一层都要为反向传播中求导的每个操作保存输入:注意力的输入、Q/K/V 投影、softmax 输出、FFN 输入、归一化输出和残差流。对隐藏维度 `d`、序列长度 `L`、批次 `B` 的一层来说,这大约是 `12 * B * L * d` 个浮点数。

取 `d=8192, L=8192, B=1`,BF16 下就是每层 800 MB。64 层的模型,激活值就是 51 GB——这还没乘微批次大小,没加注意力 softmax 的中间量(每个头 `L^2`),也没算张量并行的部分副本。

这是一张两头收的账单:BF16 权重加优化器状态或许塞得进 80GB,但激活值会把你顶出去。梯度检查点(又名激活重计算)是标准解法:丢掉大部分激活,反向时重跑前向把它们算回来。代价:额外的 FLOP。收益:显存按检查点段数与总层数之比下降。

做法朴素时,检查点每步大约多付 33% 的前向 FLOP;做法讲究时——按 Korthikanti 等人的"聪明选择"做选择性检查点——你能省 5 倍显存,FLOP 开销不到 5%。而在 FP8 矩阵乘、FSDP 卸载和专家并行 MoE 的时代,这一点尤为关键:显存你付不起,算力你也浪费不起。

## 概念

### 反向传播到底需要什么

`output = layer(input)`。反向传播要算 `grad_input` 和 `grad_params`,为此需要:

- `input`(线性层算 `grad_params = input.T @ grad_output` 要用)
- 一些激活导数中间量(ReLU/GELU/softmax 的导数取决于激活值本身)

前向传播时,autograd 图会自动保存这些。每个 `tensor.retain_grad()`、每个需要输入的算子都会保留一份引用。

### 朴素全量检查点

把网络切成 `N` 段。前向时只存每段的*输入*。反向需要中间量时,重跑这一段的前向把它们物化出来,再求导。

例:32 层 Transformer 切成 32 段,每段 1 层。

- 显存:32 份层输入(小)vs 32 ×(每层激活量)(巨大)。
- 额外计算:每段多一次前向,即总前向 FLOP 多约 33%(反向是前向的 2 倍,整步从 1 + 2 = 3 个单位变成 1 + 1 + 2 = 4 个)。

这就是 Chen 等人 2016 年的原始配方:每 `sqrt(L)` 层设一个检查点,平衡显存与算力。L=64 时,就是 8 个检查点。

### 选择性检查点(Korthikanti 2022)

不是所有激活都同样贵。注意力 softmax 输出是 `B*L*L*heads`,随序列长度*平方*增长;FFN 隐藏层激活是 `B*L*4d`,线性增长。长序列时,softmax 是大头。

选择性检查点保留存储便宜的激活(线性投影、残差),只重算贵的(注意力)。重算的 FLOP 付得极少,O(L^2) 的显存却省了下来。

Megatron-Core 把这叫"选择性"激活重计算。2024 年之后的前沿训练大多在用。

### 卸载(Offload)

重计算的替代方案:在前向和反向之间,把激活运到 CPU 内存。需要 PCIe 带宽;当空闲带宽的代价低于重新物化的代价时划算。混合策略很常见:一部分层做检查点,另一部分做卸载。

FSDP2 把卸载作为一等选项提供。当 GPU 卡在显存上、而 CPU-GPU 传输还有余量时,卸载大放异彩。

### 重计算成本模型

朴素地在 `L` 层中每 `k` 层设检查点,每步 FLOP:

```
flops_fwd_normal = L * f_layer
flops_bwd_normal = 2 * L * f_layer
flops_total_normal = 3 * L * f_layer

flops_fwd_ckpt = L * f_layer
flops_recompute = L * f_layer  # one extra forward per layer in the segment
flops_bwd_ckpt = 2 * L * f_layer
flops_total_ckpt = 4 * L * f_layer
overhead = 4 / 3 - 1 = 0.33 = 33%
```

选择性检查点只重算注意力内核,不是整层:

```
flops_recompute_selective = L * f_attention ~= L * f_layer * 0.15
overhead_selective = (3 + 0.15) / 3 - 1 = 0.05 = 5%
```

### 显存节省模型

每层激活量:`A`。`L` 层的总激活显存:`L * A`。

全量检查点(段长 1):只存 `L * input_volume`(标准 Transformer 约 `L * 1/10 A`)。节省约 `9 * L * A * 1/10`。

每 `k` 层一个检查点:存 `L/k * A`,加上活跃段内 `k-1` 层的量。

取 `k = sqrt(L)` 时,显存与重计算成本都随 `sqrt(L)` 伸缩——对各层成本均匀的情况,这是最优折中。

### 什么时候不做检查点

- 已在飞行中的流水线段的最内层。反正马上算完。
- 首层和末层,如果它们占了一段计算的大头(Transformer 里少见)。
- 已经在用 FlashAttention 的注意力内核——Flash 本身就会快速重算 softmax,再叠加层级检查点收益甚微。

### 实现模式

1. **函数包装:** 用 `torch.utils.checkpoint.checkpoint(fn, input)` 包一段。PyTorch 只存 `input`,反向时重算其余一切。

2. **装饰器式:** 给层打上可检查点标记;训练器在配置时决定包装哪些段。

3. **手写显式重算:** 自己写反向传播,调用自定义的 `recompute_forward`,用保存的输入把前向复制一遍。

三者功能等价。包装是标准写法。

### 与 TP / PP / FP8 的相互影响

- **张量并行:** 重算时检查点输入要重新 gather 或 rescatter,通信成本要算进去。
- **流水线并行:** 典型做法是对每个流水线段的前向做检查点,让逆序的微批次复用激活显存。
- **FP8 重算:** 重算时更新的 amax 历史必须与原前向一致,否则 FP8 缩放会漂移。多数框架会对缩放做快照。

```figure
activation-recompute
```

## 动手构建

### 第 1 步:带分段的玩具模型

```python
import numpy as np


def linear_forward(x, w, b):
    return x @ w + b


def relu(x):
    return np.maximum(x, 0)


def layer_forward(x, w1, b1, w2, b2):
    h = relu(linear_forward(x, w1, b1))
    return linear_forward(h, w2, b2)


def model_forward(x, params):
    activations = [x]
    h = x
    for w1, b1, w2, b2 in params:
        h = layer_forward(h, w1, b1, w2, b2)
        activations.append(h)
    return h, activations
```

### 第 2 步:需要全部激活的朴素反向

```python
def model_backward(grad_output, activations, params):
    grads = [None] * len(params)
    g = grad_output
    for i in range(len(params) - 1, -1, -1):
        w1, b1, w2, b2 = params[i]
        x_in = activations[i]
        h_pre = linear_forward(x_in, w1, b1)
        h = relu(h_pre)
        gh = g @ w2.T
        gw2 = h.T @ g
        gb2 = g.sum(axis=0)
        g_pre = gh * (h_pre > 0)
        gx = g_pre @ w1.T
        gw1 = x_in.T @ g_pre
        gb1 = g_pre.sum(axis=0)
        grads[i] = (gw1, gb1, gw2, gb2)
        g = gx
    return g, grads
```

### 第 3 步:每 k 层一个检查点的显存

```python
def model_forward_checkpointed(x, params, k=4):
    saved_inputs = [x]
    h = x
    for i, (w1, b1, w2, b2) in enumerate(params):
        h = layer_forward(h, w1, b1, w2, b2)
        if (i + 1) % k == 0:
            saved_inputs.append(h)
    return h, saved_inputs


def model_backward_checkpointed(grad_output, saved_inputs, params, k=4):
    grads = [None] * len(params)
    g = grad_output
    segments = [(j * k, min((j + 1) * k, len(params))) for j in range(len(saved_inputs))]
    for seg_idx in range(len(saved_inputs) - 1, -1, -1):
        start, end = segments[seg_idx]
        if start >= end:
            continue
        x_in = saved_inputs[seg_idx]
        _, seg_acts = model_forward(x_in, params[start:end])
        g, seg_grads = model_backward(g, seg_acts, params[start:end])
        for j, gr in enumerate(seg_grads):
            grads[start + j] = gr
    return g, grads
```

### 第 4 步:成本模型

```python
def checkpoint_cost(n_layers, segment_size, flops_per_layer=1.0):
    fwd = n_layers * flops_per_layer
    recompute = n_layers * flops_per_layer
    bwd = 2 * n_layers * flops_per_layer
    return {
        "fwd": fwd,
        "recompute": recompute,
        "bwd": bwd,
        "total": fwd + recompute + bwd,
        "overhead_vs_no_ckpt": (fwd + recompute + bwd) / (fwd + bwd) - 1.0,
    }


def selective_checkpoint_cost(n_layers, attention_fraction=0.15,
                              flops_per_layer=1.0):
    fwd = n_layers * flops_per_layer
    recompute = n_layers * attention_fraction * flops_per_layer
    bwd = 2 * n_layers * flops_per_layer
    return {
        "fwd": fwd,
        "recompute": recompute,
        "bwd": bwd,
        "total": fwd + recompute + bwd,
        "overhead_vs_no_ckpt": (fwd + recompute + bwd) / (fwd + bwd) - 1.0,
    }
```

### 第 5 步:显存估算器

```python
def activation_memory_mb(n_layers, hidden=8192, seq=8192,
                        batch=1, bytes_per_value=2):
    per_layer = 12 * batch * seq * hidden * bytes_per_value
    return n_layers * per_layer / 1e6


def memory_after_checkpoint(n_layers, segment_size, hidden=8192,
                           seq=8192, batch=1, bytes_per_value=2):
    n_seg = max(1, n_layers // segment_size)
    saved = (n_seg + segment_size) * 1 * batch * seq * hidden * bytes_per_value
    return saved / 1e6
```

### 第 6 步:最优段长

```python
def optimal_segment(n_layers):
    return int(round(np.sqrt(n_layers)))
```

### 第 7 步:选择性检查点决策

```python
def should_recompute(layer_type, activation_bytes, recompute_flops_ratio):
    if layer_type == "attention" and activation_bytes > 100 * 1e6:
        return True
    if layer_type == "ffn" and activation_bytes > 500 * 1e6:
        return recompute_flops_ratio < 0.1
    return False
```

## 投入使用

- **torch.utils.checkpoint**:`from torch.utils.checkpoint import checkpoint` —— PyTorch 的权威包装。包一个函数;只存输入,反向时重算。
- **Megatron-Core 激活重计算**:支持 `selective`、`full`、`block` 三种模式。2024 年之后前沿训练的标配。
- **FSDP2 offload**:`module.to_empty(device="cpu")` 配合 FSDP2 的 `offload_policy`,把激活分片到 CPU,代替重算。
- **DeepSpeed ZeRO-Offload**:优化器状态与激活的 CPU 卸载,与检查点互补。

## 交付

本课产出 `outputs/prompt-activation-recompute-policy.md` —— 一个提示词:输入你的模型配置(层数、隐藏维度、序列长、批次)和可用 GPU 显存,输出逐层的重计算策略(无 / 选择性 / 全量 / 卸载)。

## 练习

1. 验证正确性。跑 `model_forward` + `model_backward`(全激活)对比 `model_forward_checkpointed` + `model_backward_checkpointed`(分段)。参数梯度必须在机器精度内完全一致。

2. 让段长 `k` 从 1 扫到 `L`。画出 FLOP 开销与显存曲线,找到拐点。

3. 实现选择性检查点:存注意力模块的输入,不存其中间量。在 seq=8192 的 32 层模型上,测量它与全层检查点的 FLOP 开销差。

4. 加卸载。把分段输入存到一个模拟的"CPU 缓冲区"(另一个列表)。把"PCIe 带宽"按字节/时间建模,找出卸载与重算的盈亏平衡点。

5. 给真实 PyTorch Transformer 做基准:用与不用 `torch.utils.checkpoint`。测量显存(`torch.cuda.max_memory_allocated`)和每步耗时。

## 关键术语

| 术语 | 大家口头的说法 | 实际含义 |
|------|----------------|----------------------|
| 梯度检查点 | "重跑前向省显存" | 只存分段输入;反向时重算中间量,得到求梯度所需的张量 |
| 激活重计算 | "和检查点一样" | 同一技术的 HPC 风味叫法 |
| 段长(k) | "每个检查点管几层" | 中间量被一起丢弃、一起重新物化的层数 |
| 选择性检查点 | "Korthikanti 的招" | 只重算存储昂贵的激活(注意力 softmax),保留便宜的 |
| 全量检查点 | "朴素版" | 重算每段中每一层的全部中间量 |
| 块级检查点 | "粗粒度" | 以整个 Transformer 块为单位做检查点;最大粒度 |
| FLOP 开销 | "算力税" | 每步额外 FLOP =(重算 FLOP)/(前向 + 反向 FLOP);朴素 33%,选择性 5% |
| 激活卸载 | "运到 CPU" | 在前向与反向之间把激活搬到 CPU 内存;重计算的替代方案 |
| sqrt-L 法则 | "经典最优" | 各层成本均匀时,最优检查点间隔是 sqrt(L) 层 |
| 注意力 softmax 体积 | "O(L^2) 问题" | L^2 * heads * batch 个浮点数;长上下文时主导激活显存 |

## 延伸阅读

- [Chen et al., 2016 -- "Training Deep Nets with Sublinear Memory Cost"](https://arxiv.org/abs/1604.06174) -- 将梯度检查点形式化的原始论文
- [Korthikanti et al., 2022 -- "Reducing Activation Recomputation in Large Transformer Models"](https://arxiv.org/abs/2205.05198) -- 选择性激活重计算与形式化成本分析
- [Pudipeddi et al., 2020 -- "Training Large Neural Networks with Constant Memory using a New Execution Algorithm"](https://arxiv.org/abs/2002.05645) -- 通过逆模式重新物化实现恒定显存的另一条路
- [Ren et al., 2021 -- "ZeRO-Offload: Democratizing Billion-Scale Model Training"](https://arxiv.org/abs/2101.06840) -- 大规模激活卸载
- [PyTorch torch.utils.checkpoint docs](https://pytorch.org/docs/stable/checkpoint.html) -- 标准 API
- [Megatron-Core activation recomputation documentation](https://docs.nvidia.com/nemo-framework/user-guide/latest/nemotoolkit/features/memory_optimizations.html) -- selective、full、block 三种模式
