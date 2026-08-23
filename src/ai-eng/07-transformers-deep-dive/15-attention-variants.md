# 注意力变体——滑窗、稀疏、差分

> 全注意力是一个圆:每个 token 看得到所有 token,显存为此买单。四个变体把这个圆掰弯,省下一半代价。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 7 阶段 · 02(自注意力),第 7 阶段 · 03(多头注意力),第 7 阶段 · 12(KV 缓存 / Flash Attention)
**预计耗时:** 约 60 分钟

## 问题

全注意力的显存和计算都随序列长度 `O(N²)` 增长。128K 上下文的 Llama 3 70B,每层有 160 亿个注意力项,乘上 80 层。Flash Attention(第 12 课)藏住了 `O(N²)` 的激活显存,但算术成本没变——每个 token 仍然要关注其他所有 token。

三类变体直接改变注意力矩阵的拓扑:

1. **滑动窗口注意力(SWA)。** 每个 token 只关注固定窗口内的邻居,不看完整前缀。显存和计算降到 `O(N · W)`,W 是窗口。Gemma 2/3、Mistral 7B 的靠前层、Phi-3-Long。
2. **稀疏 / 分块注意力。** 只有被选中的位置对 `(i, j)` 参与打分,其余强制权重为零。Longformer、BigBird、OpenAI 稀疏 Transformer。
3. **差分注意力(Differential attention)。** 用两组独立的 Q/K 投影算两个注意力图,相减。杀死那个把权重漏给前几个 token 的"注意力汇聚点"(attention sink)。微软的 DIFF Transformer(2024)。

这些可以共存。2026 年的前沿模型常常是混着用:大多数层是 SWA-1024,每隔五层来一次全局全注意力,再掺几个差分头清理检索。Gemma 3 的 5:1 SWA/全局配比,是当前的教科书默认。

## 概念

### 滑动窗口注意力(SWA)

位置 `i` 的 query 只关注 `[i - W, i]`(因果 SWA)或 `[i - W/2, i + W/2]`(双向)内的位置。窗口外的 token 在分数矩阵里拿 `-inf`。

```
full causal:           sliding window (W=4):
positions 0-7          positions 0-7, W=4
    0 1 2 3 4 5 6 7        0 1 2 3 4 5 6 7
0 | x                0 |  x
1 | x x              1 |  x x
2 | x x x            2 |  x x x
3 | x x x x          3 |  x x x x
4 | x x x x x        4 |    x x x x
5 | x x x x x x      5 |      x x x x
6 | x x x x x x x    6 |        x x x x
7 | x x x x x x x x  7 |          x x x x
```

`N = 8192`、`W = 1024` 时,分数矩阵期望只有 1024 × 8192 个非零行——缩减 8 倍。

**KV 缓存随 SWA 一起缩。** 每层只需保留最后 `W` 个 token 的 K 和 V。类 Gemma-3 配置(窗口 1024、上下文 128K),KV 缓存缩小 128 倍。

**质量代价。** 纯 SWA 的 Transformer 在长程检索上很吃力。修法:SWA 层与全注意力层交替。Gemma 3 用 5:1 的 SWA:全局比。Mistral 7B 用因果 SWA 堆叠,让信息通过重叠的窗口"向前流"——每层把有效感受野扩大 `W`,L 层之后模型能回看 `L × W` 个 token。

### 稀疏 / 分块注意力

预先选定一个 `N × N` 稀疏模式。三种经典形状:

- **局部 + 跨步(OpenAI 稀疏 Transformer)。** 关注最后 `W` 个 token,外加更早的每隔 `stride` 一个的 token。局部和长程都照顾到,计算 `O(N · sqrt(N))`。
- **Longformer / BigBird。** 局部窗口 + 一小撮全局 token(如 `[CLS]`,它们关注所有人,也被所有人关注)+ 随机稀疏连接。实测同质量下上下文翻倍。
- **原生稀疏注意力(DeepSeek,2025)。** 学习哪些 `(Q, K)` 块重要,kernel 层面跳过全零块。与 FlashAttention 兼容。

稀疏注意力是个 kernel 工程的故事。数学很简单(给分数矩阵加掩码),收益来自"零项永远不进 SRAM"。FlashAttention-3 和 2026 年的 FlexAttention API,让自定义稀疏模式在 PyTorch 里成了一等公民。

### 差分注意力(DIFF Transformer,2024)

普通注意力有"注意力汇聚点"问题:softmax 强制每行和为 1,所以那些"并不想特别关注谁"的 token,会把权重倾倒给第一个 token(或前几个)。本该给真实内容的容量被偷走了。

差分注意力的修法:算**两个**注意力图,相减:

```
A1 = softmax(Q1 K1^T / √d)
A2 = softmax(Q2 K2^T / √d)
DiffAttn = (A1 - λ · A2) V
```

`λ` 是学习的标量(通常 0.5–0.8)。A1 捕获真实内容的权重,A2 捕获汇聚点。相减抵消汇聚点,把权重重新分配给相关 token。

报告的结果(微软 2024):困惑度低 5–10%,同等训练长度下有效上下文长 1.5–2 倍,大海捞针检索更准。

### 变体对比

| 变体 | 计算 | KV 缓存 | 相对全注意力质量 | 生产使用 |
|---------|---------|----------|-----------------|----------------|
| 全注意力 | O(N²) | 每层 O(N) | 基线 | 每个模型的默认层 |
| SWA(窗口 1024) | O(N·W) | 每层 O(W) | -0.1 ppl,配全局层良好 | Gemma 2/3、Phi-3-Long |
| 局部 + 跨步稀疏 | O(N·√N) | 混合 | 与 SWA 相近 | OpenAI 稀疏 Transformer、Longformer |
| BigBird(局部+全局+随机) | 约 O(N) | 混合 | 2 倍上下文追平全注意力 | 早期长上下文 BERT |
| 原生稀疏(DeepSeek-V3.2) | O(N · 激活比例) | O(N) | 差距 0.05 ppl 以内 | DeepSeek-V3.2,2025 |
| 差分 | O(2·N²) | O(2N) | -5% 至 -10% ppl | DIFF Transformer、2026 年初的模型 |

```figure
gqa-kv-sharing
```

## 动手构建

见 `code/main.py`。我们实现一个因果掩码对比器,在玩具序列上并排展示全注意力、SWA、局部+跨步和差分注意力。

### 第 1 步:全因果掩码(基线)

```python
def causal_mask(n):
    return [[0.0 if j <= i else float("-inf") for j in range(n)] for i in range(n)]
```

第 07 课的基线。下三角,对角线上方权重为零。

### 第 2 步:滑窗因果掩码

```python
def swa_mask(n, window):
    M = [[float("-inf")] * n for _ in range(n)]
    for i in range(n):
        lo = max(0, i - window + 1)
        for j in range(lo, i + 1):
            M[i][j] = 0.0
    return M
```

一个参数——`window`。`window >= n` 时退回全因果注意力;`window = 1` 时每个 token 只看自己。

### 第 3 步:局部 + 跨步稀疏掩码

```python
def strided_mask(n, window, stride):
    M = [[float("-inf")] * n for _ in range(n)]
    for i in range(n):
        lo = max(0, i - window + 1)
        for j in range(lo, i + 1):
            M[i][j] = 0.0
        for j in range(0, i + 1, stride):
            M[i][j] = 0.0
    return M
```

稠密的局部窗口,加上从序列起点开始每隔 `stride` 一个的 token。感受野随层数按对数步增长。

### 第 4 步:差分注意力

```python
def diff_attention(Q1, K1, Q2, K2, V, lam):
    A1 = softmax_causal(Q1 @ K1.T / sqrt_d)
    A2 = softmax_causal(Q2 @ K2.T / sqrt_d)
    return (A1 - lam * A2) @ V
```

两遍注意力,用一个学习的混合系数相减。代码里我们对比单注意力与差分注意力的汇聚点热力图,看汇聚点如何塌掉。

### 第 5 步:KV 缓存大小

打印 `N = 131072` 时每种变体每层的缓存大小。SWA 和稀疏变体降 10–100 倍,差分翻倍。显存账单,要花得明白。

## 投入使用

2026 年的生产模式:

```python
from transformers import AutoModelForCausalLM
# Gemma 3 mixes SWA (window=1024) and global layers at 5:1.
model = AutoModelForCausalLM.from_pretrained("google/gemma-3-27b-it")
# print(model.config.sliding_window, model.config.layer_types)
```

PyTorch 2.5+ 的 FlexAttention 接收一个掩码函数:

```python
from torch.nn.attention.flex_attention import flex_attention, create_block_mask

def swa_pattern(b, h, q_idx, kv_idx):
    return (q_idx - kv_idx < 1024) & (q_idx >= kv_idx)

mask = create_block_mask(swa_pattern, B=batch, H=heads, Q_LEN=n, KV_LEN=n)
out = flex_attention(q, k, v, block_mask=mask)
```

它会编译成自定义 Triton kernel。常见模式下速度在 FlashAttention-3 的 10% 以内,而掩码函数只是一个 Python 可调用对象。

**怎么选:**

- **纯全注意力** ——约 16K 上下文以内的每一层,或者检索质量压倒一切时。
- **SWA + 全局混合** ——长上下文(>32K),训练和推理都受显存带宽限制。2026 年 32K 以上的默认。
- **稀疏分块注意力** ——自定义 kernel、自定义模式。留给专门负载(检索、音频)。
- **差分注意力** ——任何被注意力汇聚点污染伤害的工作负载(长上下文 RAG、大海捞针)。

## 交付

见 `outputs/skill-attention-variant-picker.md`。这个技能根据目标上下文长度、检索需求和训练/推理算力画像,为新模型挑选注意力拓扑。

## 练习

1. **易。** 运行 `code/main.py`。验证 `window=4` 的 SWA 把每行最后 4 个 token 之外全部置零;验证 `window=n` 时与全因果注意力逐位一致。
2. **中。** 在第 07 课毕业设计上叠加 `window=1024` 的因果 SWA。在 tinyshakespeare 上训 1,000 步。验证损失相对全注意力回退多少?峰值显存降多少?
3. **难。** 在毕业设计模型里实现 Gemma 3 式 5:1 层混合(5 层 SWA、1 层全局)。在同参数前提下,对比它与纯 SWA、纯全局基线的损失、显存和生成质量。
4. **难。** 实现逐头学习 `λ` 的差分注意力。在合成检索任务(一根针、2,000 个干扰项)上训练。同参数下与单注意力基线对比检索准确率。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|-----------------|-----------------------|
| 滑动窗口注意力(SWA) | "局部注意力" | 每个 query 只关注最后 `W` 个 token;KV 缓存缩到 `O(W)` |
| 有效感受野(Effective receptive field) | "模型能回看多运" | L 层 SWA、窗口 W 的堆叠,最多 `L × W` 个 token |
| Longformer / BigBird | "局部 + 全局 + 随机" | 带少量永远全局关注 token 的稀疏模式;早期的长上下文方案 |
| 原生稀疏注意力(Native Sparse Attention) | "DeepSeek 的 kernel 技巧" | 学习块级稀疏;kernel 层跳过零块,同时保住质量 |
| 差分注意力(Differential attention) | "两个图,减一个" | DIFF Transformer:从第一个注意力图减去学习系数 `λ` 倍的第二个图,抵消汇聚点 |
| 注意力汇聚点(Attention sink) | "权重漏向 0 号 token" | softmax 归一化强制行和为 1;无信息量的 query 把权重倒向位置 0 |
| FlexAttention | "掩码即 Python" | PyTorch 2.5+ 的 API,把任意掩码函数编译成 FlashAttention 形状的 kernel |
| 层类型混合(Layer type mix) | "5:1 的 SWA 与全局" | 在堆叠中交替稀疏层与全注意力层,用更少显存保住质量 |

## 延伸阅读

- [Beltagy, Peters, Cohan (2020). Longformer: The Long-Document Transformer](https://arxiv.org/abs/2004.05150) ——滑窗 + 全局 token 的经典论文
- [Zaheer et al. (2020). Big Bird: Transformers for Longer Sequences](https://arxiv.org/abs/2007.14062) ——局部 + 全局 + 随机
- [Child et al. (2019). Generating Long Sequences with Sparse Transformers](https://arxiv.org/abs/1904.10509) ——OpenAI 的局部+跨步模式
- [Gemma Team (2024). Gemma 2: Improving Open Language Models at a Practical Size](https://arxiv.org/abs/2408.00118) ——1:1 的 SWA:全局混合
- [Gemma Team (2025). Gemma 3 technical report](https://arxiv.org/abs/2503.19786) ——窗口 1024 的 5:1 混合,如今的教科书默认
- [Ye et al. (2024). Differential Transformer](https://arxiv.org/abs/2410.05258) ——DIFF Transformer 论文
- [Yuan et al. (2025). Native Sparse Attention](https://arxiv.org/abs/2502.11089) ——DeepSeek-V3.2 的学习稀疏注意力
- [PyTorch — FlexAttention blog and docs](https://pytorch.org/blog/flexattention/) ——"投入使用"一节中"掩码即可调用对象"模式的 API 参考
