# 投机解码与 EAGLE

> 前沿 LLM 生成一个 token,就要对几十亿参数做一次完整前向。这次前向的配置是严重过剩的:大多数时候,一个小得多的模型就能猜对接下来 3–5 个 token,大模型只需要*验证*这个猜测。猜对了,你就用一次前向的价钱拿到了 5 个 token。投机解码(Leviathan 等人,2023)让这一切在数学上严格成立;EAGLE-3(2025)则把每次验证的接受量推到约 4.5 个 token——输出分布完全一致的前提下,4–5 倍加速。

**类型:** 动手构建
**编程语言:** Python(含 numpy)
**前置要求:** 第 10 阶段第 12 课(推理优化),第 10 阶段第 04 课(预训练迷你 GPT)
**预计耗时:** 约 75 分钟

## 问题

70B 级模型在 H100 上的 decode 吞吐,通常是每秒 40–80 个 token。每个 token 都要做一次完整前向,从 HBM 读出全部模型权重。你不能把模型变小(那会变输出),也不能把 batch 加大(显存不够)。你被卡死了——除非能让模型一次前向产出多个 token。

自回归生成看起来本质就是串行的:`x_{t+1} = sample(p(· | x_{1:t}))`。但这里有一个并发机会。如果你有一个便宜的预测器,说"接下来 4 个 token 大概是 [a, b, c, d]",你就能用**大模型的一次前向**验证全部 5 个位置,收下最长的匹配前缀。

Leviathan、Kalai、Matias(2023,《Fast Inference from Transformers via Speculative Decoding》)用一个精巧的接受/拒绝规则让这一切严格成立,规则保持目标模型的采样分布不变。同样的输出分布,快 2–4 倍。

## 概念

### 双模型设定

- **目标模型** `M_p`:大而慢、质量高的模型,你真正想从它采样。分布:`p(x)`。
- **草稿模型** `M_q`:小而快、质量较低的模型。分布:`q(x)`,小 5–30 倍。

每一步:

1. 草稿模型自回归地提议 `K` 个 token:`x_1, x_2, ..., x_K ~ q`。
2. 目标模型对全部 `K+1` 个位置并行跑**一次**前向,为每个被提议 token 产出 `p(x_k)`。
3. 用下面的改进拒绝采样规则,从左到右逐个接受/拒绝,收下最长匹配前缀。
4. 任何 token 被拒,就从修正分布采样替代并停止;全部接受时,从 `p(· | x_1...x_K)` 多采一个 bonus token。

草稿与目标完全一致时,一次目标前向拿 K+1 个 token;草稿在位置 1 就错,只拿 1 个。

### 严格性规则

投机解码可以**证明与直接从 p 采样同分布**。拒绝规则:

```
For each drafted token x_t:
    r ~ Uniform(0, 1)
    if r < p(x_t) / q(x_t):
        accept x_t
    else:
        sample replacement from residual: (p - q)+ / ||(p - q)+||_1
        stop
```

其中 `(p - q)+` 是逐点差值的正部。草稿与目标一致时(`p ≈ q`),接受率接近 1;不一致时,残差分布的构造保证整体样本仍然恰好服从 `p`。

**贪心情形。** temperature=0 采样时,只需检查 `argmax(p) == x_t`:是则接受,否则输出 `argmax(p)` 并停止。

### 期望加速比

设草稿模型的单 token 接受率为 `α`,每次目标前向的期望产出 token 数为:

```
E[tokens] = (1 - α^{K+1}) / (1 - α)        # K = draft length, α in [0, 1]
```

`α = 0.8, K = 4` 时:`(1 - 0.8^5)/(1 - 0.8) = 3.36` 个 token/前向。一次目标前向的成本约为 `cost_q * K + cost_p`(K 步草稿加一次目标验证)。`cost_p >> cost_q * K` 时,吞吐加速比就是 `3.36× / 1 = 3.36×`。

唯一真正的参数是 `α`,而它完全取决于草稿与目标的对齐程度。好草稿就是一切。

### 训练草稿:蒸馏

随便抓一个小模型,当不了好草稿。标准配方是从目标模型蒸馏:

1. 选一个小架构(70B 目标配约 1B,7B 目标配约 500M)。
2. 让目标模型在大语料上跑,存下它的下一 token 分布。
3. 用对目标分布的 KL 散度训练草稿(而不是对真值 token)。

结果:代码上 `α` 典型 0.6–0.8,自然语言聊天 0.7–0.85。生产中加速 2–3 倍。

### EAGLE:树形起草 + 特征复用

Li、Wei、Zhang、Zhang(2024,《EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty》)观察到标准投机解码的两处低效:

1. 草稿要走 K 个串行步骤,每步都是完整栈。但草稿本可以复用目标模型最近一次验证算出的特征(隐状态)——目标已经算出了丰富的表示,草稿却在从头重推。
2. 草稿输出一条线性链。如果草稿能输出一棵候选*树*(每个节点多个猜测),目标的一次前向就能通过树形注意力掩码并行验证多条候选路径,取最长的被接受分支。

EAGLE-1 的改动:
- 草稿输入 = 目标模型在位置 t 的最后隐状态,而不是原始 token。
- 草稿架构 = 1 个 Transformer 解码器层(不是独立小模型)。
- 输出 = 每层 K = 4–8 个候选、深度 4–6 的树。

EAGLE-2(2024)加了动态树拓扑:草稿不确定的地方树长宽,自信的地方保持窄。不增加验证成本就抬高了 `α_effective`。

EAGLE-3(Li 等人,2025)移除了对顶层特征的固定依赖,改用"测试时模拟"损失训练草稿——草稿在与目标模型测试时分布一致的输出上训练,而不是 teacher-forcing 的训练分布。接受率从 0.75(EAGLE-2)升到 0.82(EAGLE-3),每次验证的平均 token 从 3.0 升到 4.5。

### 树形注意力验证

草稿输出树时,目标模型用**树形注意力掩码**在一次前向内完成验证——这个因果掩码编码的是树拓扑,而不是一条直线。每个 token 只关注它在树中的祖先。验证仍是一次前向、一次矩阵乘法;拓扑掩码只多几条 KV 项的成本。

```
        root
       /    \
      a      b
     / \    / \
    c  d   e   f
```

`a, b` 是竞争的首 token 候选,`c, d, e, f` 是第二 token 候选,全部六个位置在一次前向内验证。输出是任意被接受路径上的最长前缀。

### 什么时候赢,什么时候不赢

**赢:**
- 文本可预测的聊天/补全(代码、常见英文、结构化输出)。`α` 高。
- decode 阶段 GPU 算力闲置(带宽受限阶段)。树形起草正好用上这些 FLOPs。

**输 / 不赚:**
- 高随机性输出(高温度的创意写作)。`α` 跌向 `1/|vocab|`。
- 高并发的批量服务——批处理本已填满 FLOPs,树验证没地方插。
- 目标模型很小,草稿小不了多少。

生产团队的典型报告:聊天墙钟加速 2–3 倍,代码生成 3–5 倍,创意写作接近零。

```figure
speculative-decoding
```

## 动手构建

`code/main.py`:

- 一个参考实现 `speculative_decode(target, draft, prompt, K, temperature)`:实现严格的拒绝规则,并验证它保持目标分布(相对朴素目标采样,经验 KL < 0.01)。
- 一个 EAGLE 式树形起草器:以 top-p 分支构建深度 K 的树。
- 一个树形注意力掩码构造器:为验证器产出正确的因果图案。
- 一个接受率测试框架:在迷你 LM 上跑两者(从 GPT-2-medium 目标蒸一个 GPT-2-small 草稿)。

```python
def speculative_step(p_target, q_draft, K, temperature=1.0):
    """One round of speculative decoding. Returns list of accepted tokens."""
    # 1. Draft K tokens
    draft_tokens = []
    q_probs = []
    state = draft_state_init()
    for _ in range(K):
        probs = softmax(q_draft(state) / temperature)
        t = np.random.choice(len(probs), p=probs)
        draft_tokens.append(t)
        q_probs.append(probs[t])
        state = draft_step(state, t)

    # 2. Target computes p at every drafted position + 1 extra
    p_probs_all = target_forward_batched(p_target, draft_tokens, temperature)

    # 3. Accept/reject left-to-right
    accepted = []
    for k, tok in enumerate(draft_tokens):
        r = np.random.uniform()
        if r < p_probs_all[k][tok] / q_probs[k]:
            accepted.append(tok)
        else:
            residual = np.maximum(p_probs_all[k] - q_probs[k], 0)
            residual /= residual.sum()
            accepted.append(np.random.choice(len(residual), p=residual))
            return accepted
    # 4. All K accepted → sample bonus token from target
    accepted.append(np.random.choice(len(p_probs_all[-1]), p=p_probs_all[-1]))
    return accepted
```

## 投入使用

- **vLLM** 和 **SGLang** 有一等公民的投机解码。参数:`--speculative_model`、`--num_speculative_tokens`。EAGLE-2/3 通过 `--spec_decoding_algorithm eagle` 支持。
- **NVIDIA TensorRT-LLM** 原生支持 Medusa 和 EAGLE 树。
- **参考草稿模型**:`Qwen/Qwen3-0.6B-spec`(给 Qwen3-32B 当草稿)、`meta-llama/Llama-3.2-1B-Instruct-spec`(给 70B 当草稿)。
- **Medusa 头**(Cai 等人,2024):不要草稿模型,直接在目标模型上加 K 个并行预测头。部署更简单,接受率略低于 EAGLE。

## 交付

本课会产出 `outputs/skill-speculative-tuning.md` ——一个技能:给目标模型的负载画像,并选定草稿模型、K(草稿长度)、树宽、温度,以及何时回退到朴素 decode。

## 练习

1. 实现严格的拒绝规则并实证检验。用 `speculative_decode` 和朴素目标采样各跑 10K 样本,计算两个输出分布的 TV 距离,应小于 0.01。

2. 计算加速比公式。固定 `α` 和 `K`,画出每次目标前向的期望 token 数。为 α ∈ {0.5, 0.7, 0.9} 各找出最优 K。

3. 训练一个迷你草稿。以 124M 的 GPT-2 为目标,用 KL 损失在 100M token 上蒸一个 30M 的 GPT-2 草稿。在留出文本上测 `α`,预期 0.6–0.7。

4. 实现 EAGLE 式树形起草。草稿不再输出链,而是每层输出 top-3 分支。构建树形注意力掩码,验证目标模型接受了最长的正确分支。

5. 测量失败模式。在 temperature=1.5(高随机性)下跑投机解码。展示 α 崩塌,算法因草稿开销反而比朴素 decode 更慢。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|-----------------|------------------------|
| 目标模型(Target model) | "大模型" | 你真正想采样的那个慢而高质量的模型(p 分布) |
| 草稿模型(Draft model) | "投机客" | 小而快的预测器(q 分布);小 5–30 倍 |
| K / 草稿长度 | "往前看几步" | 每次验证 pass 投机的 token 数 |
| α / 接受率 | "命中率" | 草稿提议被接受的单 token 概率 |
| 严格拒绝规则 | "接受检验" | r < p/q 的比较,保持目标分布不变 |
| 残差分布(Residual distribution) | "修正的 p-q" | `(p - q)+ / \|\|(p - q)+\|\|_1`,拒绝时采样的分布 |
| 树形起草(Tree drafting) | "分叉的投机" | 草稿输出候选树,用树形注意力掩码一次前向验证 |
| 树形注意力掩码 | "拓扑掩码" | 编码树拓扑的因果掩码,每个节点只关注自己的祖先 |
| Medusa 头 | "并行头" | 加在目标模型上的 K 个额外预测头;无需独立草稿模型 |
| EAGLE 特征复用 | "隐状态草稿" | 草稿的输入是目标的最后隐状态而不是原始 token,草稿因此更小 |
| 测试时模拟损失 | "EAGLE-3 的训练" | 让草稿在与目标测试时分布一致的输出上训练,而不是 teacher forcing |

## 延伸阅读

- [Leviathan, Kalai, Matias, 2023 — "Fast Inference from Transformers via Speculative Decoding"](https://arxiv.org/abs/2211.17192) ——严格拒绝规则与理论加速分析
- [Chen, Borgeaud, Irving et al., 2023 — "Accelerating Large Language Model Decoding with Speculative Sampling"](https://arxiv.org/abs/2302.01318) ——DeepMind 同期发表的投机采样论文
- [Cai, Li, Geng, Wang, Wang, Zhu, Dao, 2024 — "Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads"](https://arxiv.org/abs/2401.10774) ——并行头,草稿模型的替代方案
- [Li, Wei, Zhang, Zhang, 2024 — "EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty"](https://arxiv.org/abs/2401.15077) ——特征复用与树形起草
- [Li et al., 2024 — "EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees"](https://arxiv.org/abs/2406.16858) ——动态树拓扑
- [Li et al., 2025 — "EAGLE-3: Scaling up Inference Acceleration of Large Language Models via Training-Time Test"](https://arxiv.org/abs/2503.01840) ——训练分布与测试分布对齐
- [Fu, Haotian, Peng et al., 2024 — "Break the Sequential Dependency of LLM Inference Using Lookahead Decoding"](https://arxiv.org/abs/2402.02057) ——Jacobi/lookahead 解码,不要草稿的替代路线
