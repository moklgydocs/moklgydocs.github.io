# 原生稀疏注意力(DeepSeek NSA)

> 64k token 时,注意力吃掉 decode 延迟的 70–80%。每家开放模型实验室都有一个修复计划,而站住脚的是 DeepSeek 的 NSA(ACL 2025 最佳论文):三条并行的注意力分支——压缩的粗粒度 token、选择性保留的细粒度 token、负责局部上下文的滑窗——由一个学习的门控混合。它硬件对齐(kernel 友好)、原生可训练(在预训练中生效,而不是推理时外挂),在 64k decode 上比 FlashAttention 还快,质量还追平甚至超过全注意力。本课端到端构建三条分支,并讲清为什么这里的稀疏是端到端可微的。

**类型:** 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 7 阶段 · 12(KV 缓存、Flash Attention),第 7 阶段 · 15(注意力变体),第 10 阶段 · 16(差分注意力)
**预计耗时:** 约 60 分钟

## 学习目标

- 说出 NSA 的三条注意力分支及各自捕获什么
- 解释为什么 NSA 是"原生可训练",而此前的稀疏注意力方法只能用于推理
- 以压缩块大小和选择 top-k 为参数,计算 NSA 相对全注意力在 64k 上下文下的算力节省
- 用标准库 Python 在短的合成序列上实现三分支组合,验证门控权重行为正常

## 问题

序列长度 N 的全注意力,时间成本 `O(N^2)`,每层 KV 缓存 `O(N)`。64k token 时,算力和显存带宽的数字都是灾难性的。NSA 论文的实测理论估算:64k 时注意力占总 decode 延迟的 70–80%。下游的一切——TTFT、token/秒、每百万 token 成本——都被注意力成本统治。

稀疏注意力是显而易见的答案。此前的尝试分两桶。固定模式稀疏(滑窗、跨步、块局部)直接扔掉信息,在长程回忆任务上翻车。推理时稀疏(KV 缓存剪枝、H2O、StreamingLLM)施加在稠密注意力预训练的模型上,只能兑现理论加速的一小部分——因为模型从未被要求把信息路由过那个稀疏模式。

原生稀疏注意力(Yuan 等人,DeepSeek + 北大 + 华大,ACL 2025 最佳论文,arXiv:2502.11089)两头都占:模型在预训练中学会的稀疏模式,实现为一个 kernel 对齐、推理时真正兑现算力节省的算法。两年内,NSA 或它的直系后代会成为每一个前沿长上下文模型的默认注意力。

## 概念

### 三条并行分支

对每个 query,NSA 对 KV 缓存的三个不同视图各跑一次注意力:

1. **压缩分支。** token 按大小 `l`(典型 32 或 64)分块,每块由一个小型学习 MLP 压成一个摘要 token。query 在这些压缩 token 上做注意力,得到整条序列的粗粒度视图。

2. **选择分支。** 用压缩分支的注意力分数,找出与当前 query 最相关的 top-k 个块,读出这些块的细粒度(未压缩)token,query 对它们全体做注意力。可以把压缩分支注意力理解为选择的"路由信号"。

3. **滑窗分支。** query 关注最近 `W` 个 token(典型 512),处理局部上下文。这条分支捕获结构密集的短程模式(句法、局部共指),前两条分支可能会漏掉它们。

三条分支的输出,由一个逐位置学习的门控混合:

```
out = g_cmp * out_cmp + g_sel * out_sel + g_win * out_win
```

`g_cmp, g_sel, g_win` 是 query 过一个小 MLP 得到的门控权重。它们不必和为 1——可以独立加权各分支。

### 为什么这叫"原生可训练"

选择步(top-k 块)是离散操作,离散操作会断梯度。此前的稀疏注意力工作,要么跳过选择过程的反向传播(限制训练),要么用连续松弛——但推理时又得不到真正的稀疏。

NSA 绕开了这个死结:压缩分支注意力本身就是对整个序列的可微粗粒度注意力。top-k 操作只是复用压缩分支的最高注意力分数,去挑选要加载哪些细粒度块。梯度流过压缩分支的分数(它们同时影响压缩输出和选择逻辑),被选中块对最终输出的贡献也是可微的。那个不可微的 `top_k`,在前向计算图上是个空操作——它只控制从显存里加载哪些块。

这就是为什么 NSA 能在预训练中端到端使用。模型学会把信息联合路由过三条分支,训出的稀疏模式在推理时真正兑现承诺的加速。

### 硬件对齐的 kernel

NSA 的 kernel 为现代 GPU 显存层级设计。kernel 按 GQA 组加载 query(外循环),按组取回对应的稀疏 KV 块(内循环),在 SRAM 上做注意力。因为同一 query 组看到的是同一批选中块(选择是按 query 组做的,不是按 query 头),KV 加载在整个组上摊薄。算术强度保持高位。

论文报告:Triton kernel 在 64k decode 上比 FlashAttention 快 9 倍,且加速比随序列长度继续扩大。前向和反向 kernel 都提供了。

### 算力账本

设 `N` 为序列长度,`l` 为压缩块大小,`k` 为 top-k 选择数,`w` 为滑窗,`b` 为选中块大小(通常等于 `l`)。

- 压缩分支:每 query `O(N/l)` 个 key,共 `O(N * N / l)`。
- 选择分支:每 query `O(k * b)` 个 key,共 `O(N * k * b)`。
- 滑窗分支:每 query `O(w)` 个 key,共 `O(N * w)`。

合计:`O(N * (N/l + k*b + w))`。

`N = 64k, l = 64, k = 16, b = 64, w = 512`:每 query 成本 `1000 + 1024 + 512 = 2536` 个 key。全注意力是 64,000。算力缩 25 倍。

`N = 128k, l = 64, k = 16, b = 64, w = 512`:每 query 成本 `2000 + 1024 + 512 = 3536` 个 key。全注意力是 128,000。缩 36 倍。收益随序列长度增长——这正是全部意义所在。

### 横向对比

| 方法 | 可微 | 真实推理加速 | 长程回忆 |
|--------|---------------|----------------------|-------------------|
| 纯滑窗 | 是 | 是 | 失败 |
| 跨步 / 块稀疏 | 是 | 是 | 部分 |
| KV 剪枝(H2O、StreamingLLM) | N/A(推理时) | 是 | 部分 |
| MoBA(Moonshot) | 部分 | 是 | 良好 |
| NSA | 是(原生) | 是(64k 上 9 倍) | 追平全注意力 |

MoBA(Moonshot,arXiv:2502.13189)同期发表,思路同为"三个臭皮匠",把 MoE 原则应用到注意力块上。NSA 和 MoBA 是 2026 年长上下文预训练必知的两个架构。

```figure
sliding-window-attention
```

## 动手构建

`code/main.py` 在短的合成序列上实现三条分支,并展示:

- 压缩 MLP(教学上用简单的均值池化基线;真实 NSA 用学习 MLP)。
- 由压缩分支分数驱动的 top-k 块选择。
- 对最后 `w` 个 token 的滑窗注意力。
- 门控组合。
- 与全注意力对比的算力统计打印。

### 第 1 步:把 token 压成块

```python
def compress(K, l):
    n = len(K)
    n_blocks = (n + l - 1) // l
    out = []
    for b in range(n_blocks):
        start, end = b * l, min((b + 1) * l, n)
        block = K[start:end]
        summary = [sum(row[d] for row in block) / len(block) for d in range(len(K[0]))]
        out.append(summary)
    return out
```

### 第 2 步:压缩分支注意力

query 对压缩 key 做 softmax 注意力。压缩分支的分数同时充当 top-k 选择的信号。

### 第 3 步:top-k 块选择

挑出分数最高的 `k` 个压缩块的索引,加载这些块的原始未压缩 token,对它们做注意力。

### 第 4 步:滑窗注意力

取最后 `w` 个 token,对它们做标准注意力。

### 第 5 步:门控 + 组合

query 过一个小 MLP 产生三个门控权重。最终输出是三条分支输出的加权和。

### 第 6 步:算力统计

打印每条分支每 query 关注的 key 数和总数,与 `N`(全注意力)对比。1024 token 的合成序列、`l = 32, k = 4, w = 128` 时,NSA 每 query 看 `32 + 128 + 128 = 288` 个 key,全注意力是 1024——少 3.5 倍。

## 投入使用

NSA 已在 DeepSeek 自己的长上下文预训练流水线中出货。截至 2026 年 4 月,公开推理栈的集成状态:

- **DeepSeek 内部**:原生;公开权重使用 NSA 或其继任者 DSA(Deepseek Sparse Attention)。
- **vLLM**:面向 DeepSeek-V3.x 权重的实验性 NSA 支持,开发中。
- **SGLang**:已发布 NSA 基准;生产路径跟随 vLLM。
- **llama.cpp / CPU**:不支持;kernel 拆分的开销在 CPU 吞吐下不值。

什么时候用 NSA:

- 瞄准 64k+ 上下文、算力预算充足的预训练或续训。
- 推理 DeepSeek 自己的长上下文检查点——权重是 NSA 原生的。

什么时候不用:

- 服务已有的稠密注意力预训练模型。不续训就没法改装 NSA。
- 16k 以下上下文。三分支的开销压过节省。
- batch-1 交互聊天。decode 延迟受益,但只在长上下文下。

## 交付

本课会产出 `outputs/skill-nsa-integrator.md`。给定长上下文预训练规格,它产出 NSA 集成计划:压缩块大小、top-k、滑窗、门控 MLP 宽度、kernel 选择,以及能证明这次架构改动值得的长上下文评估项。

## 练习

1. 在 1024 token 的合成序列上运行 `code/main.py`。扫三组 `(l, k, w)` 预设并打印算力统计。找出在大海捞针测试上保持 95% 召回(相对全注意力)的前提下,每 query key 数最少的那组预设。

2. 把均值池化压缩器换成一个小的学习 MLP(2 层,hidden 32)。在"信号是块均值"的合成任务上训练,在留出数据上测量它与均值池化基线的困惑度差。

3. 实现门控 MLP:输入 query,输出三个标量。展示其行为合理:随机 query 时接近均匀加权;query 命中遥远后方的块时,重压选择分支。

4. 计算支持 NSA 的 70B 模型在 128k 上下文下的 KV 缓存预算。KV 头 8,head dim 128,BF16。与全注意力和 MLA(第 10 阶段 · 14 给过 MLA 的数字)对比。找出 NSA 细粒度分支 KV 缓存与全注意力相等的序列长度。

5. 读 NSA 论文(arXiv:2502.11089)第 4 节,用三句话解释:为什么 top-k 选择复用压缩分支的注意力分数,而不是单独算一个路由分数。答案要扣到梯度流上。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| 压缩分支(Compressed branch) | "粗视图" | 对块平均 key 做注意力,以每 query O(N/l) 个 key 提供全局上下文 |
| 选择分支(Selected branch) | "top-k 块" | 对压缩分支分数最高的 `k` 个块做细粒度注意力 |
| 滑窗(Sliding window) | "局部上下文" | 对最后 `W` 个 token 做注意力,捕获短程模式 |
| 原生可训练(Native trainability) | "预训练时就开着稀疏" | 稀疏模式在预训练中学习,不是推理时外挂 |
| 压缩块大小 l | "粗视图的分组大小" | 多少个 token 压成一个摘要;典型 32–64 |
| Top-k | "保留哪些块" | 其未压缩 token 会被读取的压缩块数量;典型 16 |
| 滑窗 W | "局部注意力半径" | 典型 512;太短伤局部连贯,太长浪费算力 |
| 分支门控(Branch gate) | "三条怎么混" | 逐位置 MLP 输出,给三条分支的贡献加权 |
| 硬件对齐(Hardware alignment) | "kernel 友好的稀疏" | 稀疏模式的选择让真实 GPU kernel 能兑现理论加速 |
| DSA | "NSA 的继任者" | Deepseek Sparse Attention,DeepSeek 谱系中继 NSA 之后的架构 |

## 延伸阅读

- [Yuan et al. — Native Sparse Attention: Hardware-Aligned and Natively Trainable Sparse Attention (arXiv:2502.11089, ACL 2025 Best Paper)](https://arxiv.org/abs/2502.11089) ——原论文
- [DeepSeek-V3 Technical Report (arXiv:2412.19437)](https://arxiv.org/abs/2412.19437) ——NSA 所服务的架构家族
- [Moonshot AI — MoBA: Mixture of Block Attention for Long-Context LLMs (arXiv:2502.13189)](https://arxiv.org/abs/2502.13189) ——同期工作,MoE 式块注意力
- [Beltagy et al. — Longformer: The Long-Document Transformer (arXiv:2004.05150)](https://arxiv.org/abs/2004.05150) ——滑窗的源头
- [Xiao et al. — StreamingLLM: Efficient Streaming Language Models with Attention Sinks (arXiv:2309.17453)](https://arxiv.org/abs/2309.17453) ——NSA 所超越的推理时稀疏基线
- [Dao et al. — FlashAttention-2 (arXiv:2307.08691)](https://arxiv.org/abs/2307.08691) ——NSA kernel 在 64k 上击败的全注意力基线
