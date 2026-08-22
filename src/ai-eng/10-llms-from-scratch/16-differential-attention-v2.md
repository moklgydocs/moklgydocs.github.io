# 差分注意力(V2)

> softmax 注意力会给每一个不匹配的 token 都撒上一点概率质量。十万 token 累积起来,噪声就能淹没信号。差分 Transformer(Ye 等人,ICLR 2025)的修法:把注意力算成两个 softmax 之差,减掉共享的噪声地板。DIFF V2(微软,2026 年 1 月)是面向生产栈的重写:解码延迟与基线 Transformer 打平,不要自定义 kernel,兼容 FlashAttention。本课从 V1 讲到 V2,并附上一个可在标准库 Python 里跑的差分运算玩具实现。

**类型:** 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 7 阶段 · 02(自注意力),第 7 阶段 · 15(注意力变体),第 10 阶段 · 14(架构巡礼)
**预计耗时:** 约 60 分钟

## 学习目标

- 精确说明 softmax 注意力为什么存在噪声地板,以及它为什么随上下文长度增长
- 推导差分注意力公式,解释为什么减法能抵消共享噪声分量而保住信号
- 走完 V1 到 V2 的 diff:什么变快了、什么变简了、什么变稳了,以及为什么每一处改动都是生产预训练的必需品
- 用纯 Python 从零实现差分注意力,并在合成的"信号 + 噪声"查询上实证噪声抵消性质

## 问题

标准 softmax 注意力有一个数学性质,规模化之后会变成运维头疼事。对查询 `q`,注意力权重是 `softmax(qK^T / sqrt(d))`。softmax 永远给不出精确的零——每个不匹配的 token 都分到一点正的概率质量。这点残余质量就是噪声,而且它随上下文长度增长。128k token 时,即使每个不匹配 token 只分到 0.001% 的概率,127,999 个加起来也占了总量的约 12%。模型被迫学着绕开一条随上下文不断抬升的噪声地板。

实证上,这表现为注意力头互相干扰:长上下文 RAG 里幻觉引用、10 万 token 检索任务上的"中间丢失"(lost-in-the-middle)失败,以及 32k 之后大海捞针基准上悄悄掉点。差分 Transformer 论文(arXiv:2410.05258,ICLR 2025)量化了这个差距:同规模下,DIFF Transformer 困惑度更低、长上下文准确率更高、幻觉更少。

DIFF V1 有三个问题,使它进不了前沿预训练流水线:value 缓存每个 decode 步要加载两次;需要自定义 CUDA kernel,破坏了 FlashAttention 兼容性;逐头的 RMSNorm 在 70B 以上规模的长时间训练中不稳定。DIFF V2(微软 unilm 博客,2026 年 1 月 20 日)把三个都修了。本课走完两个版本,构建差分算子,并在玩具查询上基准测试噪声抵消。

## 概念

### softmax 的噪声地板

对查询 `q` 和 keys `K = [k_1, ..., k_N]`,注意力权重为:

```
w_i = exp(q . k_i / sqrt(d)) / sum_j exp(q . k_j / sqrt(d))
```

没有任何 `w_i` 会是零。就算 `k_i` 与 `q` 毫不相关,分数 `q . k_i` 也不是 0——它以 `||q||^2 / d` 的方差在零附近波动。softmax 归一化之后,每个无关 token 仍向加权求和贡献 `O(1/N)`。无关 token 的总贡献是 `O((N-1)/N) = O(1)`——不是个小量。

模型想要的是接近硬 top-k 的东西:匹配的 token 高权重,其余接近零。softmax 太光滑了,直接做不到。

### 差分思想

把每个头的 Q 和 K 投影一分为二:Q = (Q_1, Q_2),K = (K_1, K_2)。算两个注意力图:

```
A_1 = softmax(Q_1 K_1^T / sqrt(d))
A_2 = softmax(Q_2 K_2^T / sqrt(d))
```

输出:

```
DiffAttn = (A_1 - lambda * A_2) V
```

减法抵消了两张图共享的噪声分布。如果两张图在那 127k 个无关 token 上都摊着大致均匀的权重(随机初始化时必然如此),它们就抵消了。信号——集中在少数真正相关 token 上的尖峰权重——只有当它在两张图中以相同幅度出现时才会抵消,而训练之后不会。

`lambda` 是逐头的可学习标量,参数化为 `lambda = exp(lambda_q1 dot lambda_k1) - exp(lambda_q2 dot lambda_k2) + lambda_init`,可以为负。`lambda_init` 默认取 0.8 这样的小正数。

### 为什么这像头戴式降噪耳机

想象两支录音的麦克风,录到的是同一个声音加相关的背景噪声。一支减去另一支,共享的噪声就掉了。声音能活下来,是因为两路信号在相位或幅度上的差异足以避免完全抵消。逐头的 `lambda` 学的正是这个平衡。

### V1 vs V2:diff

V1 保持参数量与基线 Transformer 相等。为了每个头得到两个 query,它把头维度减半。这牺牲了头的表达能力,更疼的是,每个头的 value 缓存也减半。decode 时每步要加载两次 value 缓存(每个 softmax 分支一次)。结果:参数量持平,decode 却比基线慢。

V2 把 query 头数翻倍,KV 头数不变(参数从上投影借)。头维度与基线保持一致。减法之后,多出的维度被投影回基线 Transformer 的 O_W 投影大小。三件事同时发生:

1. decode 速度与基线持平(KV 缓存只加载一次)。
2. FlashAttention 原样运行(不要自定义 kernel)。
3. decode 的算术强度上升(每从 HBM 读一字节,算得更多)。

V2 还移除了 V1 用来稳定减法的逐头 RMSNorm。在 70B 级预训练规模上,那个 RMSNorm 会让训练后期失稳。V2 用更简单的初始化方案替代,不用额外模块也能保持训练稳定。

### 什么时候用它

| 工作负载 | 收益 |
|----------|---------|
| 长上下文 RAG(64k+) | 注意力图更干净,幻觉引用更少 |
| 大海捞针基准 | 32k 之后准确率显著提升 |
| 多文档问答 | 跨文档干扰更少 |
| 8k 代码补全 | 收益边际,不值架构改动 |
| 短聊天(< 4k) | 与基线基本无差别 |

收益随上下文长度增长。4k token 时噪声地板还小,标准注意力够用;128k 时它在拖你后腿。

### 与 2026 年其他旋钮的兼容性

| 特性 | 与 DIFF V2 兼容? |
|---------|------------------------|
| GQA | 兼容(V2 加 Q 头,不动 KV 头) |
| MLA(DeepSeek) | 原则上兼容,尚无两者结合的公开论文 |
| MoE | 兼容(注意力与 MLP 块独立) |
| RoPE | 兼容(无改动) |
| YaRN / 长上下文缩放 | 兼容(正是 DIFF 帮得最多的地方) |
| FlashAttention | V2 兼容(V1 不兼容) |
| 投机解码 | 兼容(注意力改动对投机循环不可见) |

```figure
differential-attention
```

## 动手构建

`code/main.py` 用纯 Python 实现差分注意力。一个信号位置已知的玩具查询,让你直接测量噪声抵消率。

### 第 1 步:标准 softmax 注意力

标准库矩阵操作:列表的列表,手写矩阵乘,softmax 减最大值保数值稳定。

```python
def softmax(row):
    m = max(row)
    exps = [math.exp(x - m) for x in row]
    s = sum(exps)
    return [e / s for e in exps]
```

### 第 2 步:把 Q、K 劈成两半

V1 风格:头维度减半。V2 风格:头维度不变,头数翻倍。玩具实现用 V1,教学上更清楚——数学一模一样,只是记账不同。

### 第 3 步:两个 softmax 分支 + 减法

```python
A1 = [softmax([dot(q1, k) / scale for k in K1]) for q1 in Q1]
A2 = [softmax([dot(q2, k) / scale for k in K2]) for q2 in Q2]
diff_weights = [[a1 - lam * a2 for a1, a2 in zip(r1, r2)] for r1, r2 in zip(A1, A2)]
out = [[sum(w * v[j] for w, v in zip(row, V)) for j in range(d_v)] for row in diff_weights]
```

注意:输出权重可以为负。没问题——value 缓存照样处理带符号的贡献,后续的 V 投影会吸收符号。

### 第 4 步:噪声抵消测量

构造一条长度 1024 的合成序列。信号 token 放在已知位置,其余填满噪声。分别计算 (a) 标准 softmax 注意力在信号位置上的权重和 (b) 差分注意力的权重,测量两者的信噪比。差分注意力稳定产出 3–10 倍的信噪比提升,具体取决于两个分支被训练出多大差异。

### 第 5 步:V1 vs V2 参数记账

给定配置(hidden=4096,heads=32,d_head=128),打印:

- 基线 Transformer:Q、K、V 各为 `hidden * hidden`,MLP 为 4 * hidden。
- DIFF V1:Q、K 各为 `hidden * hidden`,V 为 `hidden * hidden`(不变),头维度内部减半。增加逐头 `lambda` 参数(O(heads * d_head))。
- DIFF V2:Q 为 `2 * hidden * hidden`,K 为 `hidden * hidden`,V 为 `hidden * hidden`。多出的维度在 O_W 前投影回去。同样增加 `lambda` 参数。

玩具会测量 V2 的额外参数成本(每个注意力块大约多出 `hidden * hidden`)并打印。

## 投入使用

截至 2026 年 4 月,DIFF V2 尚未进入每一个生产推理服务器,但 vLLM 和 SGLang 的集成已在推进。目前它出现在:

- 微软内部的长上下文生产模型。
- 若干瞄准 256k+ 上下文的开放模型训练中的研究复现。
- 交替层混用 DIFF 注意力与滑窗注意力的混合架构。

2026 年什么时候该用它:

- 从零训练一个瞄准 64k+ 有效上下文的新模型。从一开始就上差分注意力,事后补训很贵。
- 微调一个长上下文模型,而"中间丢失"是你评估里的主要失败。在 Q 投影上加 LoRA,可以逼近 DIFF 结构。

什么时候不用:

- 你在服务一个长上下文表现稳定的预训练稠密模型。对已有权重,重训成本很难回本。
- 你的上下文永远在 16k 以内。噪声地板可忽略。

## 交付

本课会产出 `outputs/skill-diff-attention-integrator.md`。给定模型架构、目标上下文长度、幻觉画像和训练预算,它产出一个把差分注意力集成到新预训练或 LoRA 微调的计划。

## 练习

1. 运行 `code/main.py`。验证差分注意力在合成查询上的信噪比高于标准 softmax 注意力。改变噪声幅度,找出标准注意力变得不可用的临界点。

2. 对一个 7B 级模型(hidden=4096,heads=32,d_head=128,32 层),计算基线到 DIFF V1、基线到 DIFF V2 的参数量差值。指出哪些部件加了参数、哪些没变。

3. 读 DIFF V1 论文(arXiv:2410.05258)第 3 节和 DIFF V2 Hugging Face 博客第 2 节。用两句话解释:V1 的逐头 RMSNorm 为什么必要,V2 为什么能移除它而不引起训练发散。

4. 实现一个消融:分别以 `lambda = 0`(纯第一 softmax)和 `lambda = 1`(完全相减)计算差分注意力。在合成查询上扫描,测量信噪比变化,找出使信噪比最大的 `lambda`。

5. 把玩具扩展到 GQA + DIFF V2。取 8 个 KV 头、32 个 Q 头,证明 KV 缓存大小与同配置(8, 32)的基线 GQA 模型一致。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| 差分注意力(Differential attention) | "两个 softmax 相减" | Q、K 劈成两半,算两个 softmax 图,第一个减去 lambda 倍的第二个,再乘 V |
| 噪声地板(Noise floor) | "softmax 的非零尾巴" | softmax 摊在每个无关 token 上的 O(1/N) 权重,长上下文下合计达 O(1) |
| lambda | "减法系数" | 逐头可学习标量,参数化为 `exp(lq1.lk1) - exp(lq2.lk2) + lambda_init`;可以为负 |
| DIFF V1 | "ICLR 2025 版" | 原始差分 Transformer;为保参数量把头维度减半,需自定义 kernel,decode 更慢 |
| DIFF V2 | "2026 年 1 月的修复" | Q 头翻倍、KV 头不变;decode 与基线持平,兼容 FlashAttention |
| 逐头 RMSNorm | "V1 的稳定器" | V1 在差分之后加的额外归一化;V2 为防止训练后期失稳把它移除了 |
| 信噪比(SNR) | "注意力浪费了多少" | 真实信号位置上的权重与无关位置平均权重之比 |
| 中间丢失(Lost in the middle) | "长上下文失败模式" | 长上下文中间位置文档的检索准确率下降的现象——差分注意力能缓解 |
| 算术强度(Arithmetic intensity) | "每读一字节算多少 FLOPs" | V2 通过每次 KV 加载配双倍 query 提升了 decode 的这个比值;对带宽受限的 decode 很重要 |

## 延伸阅读

- [Ye et al. — Differential Transformer (arXiv:2410.05258, ICLR 2025)](https://arxiv.org/abs/2410.05258) ——原始论文,含噪声抵消理论与长上下文消融
- [Microsoft unilm — Differential Transformer V2 (Hugging Face blog, January 2026)](https://huggingface.co/blog/microsoft/diff-attn-v2) ——生产栈重写:decode 与基线持平,兼容 FlashAttention
- [Understanding Differential Transformer Unchains Pretrained Self-Attentions (arXiv:2505.16333)](https://arxiv.org/abs/2505.16333) ——关于减法为何能恢复预训练注意力结构的理论分析
- [Shared DIFF Transformer (arXiv:2501.17900)](https://arxiv.org/html/2501.17900) ——参数共享变体
- [Vaswani et al. — Attention Is All You Need (arXiv:1706.03762)](https://arxiv.org/abs/1706.03762) ——DIFF 做减法的那个基线 Transformer
- [Liu et al. — Lost in the Middle (arXiv:2307.03172)](https://arxiv.org/abs/2307.03172) ——差分注意力所瞄准的长上下文基准
