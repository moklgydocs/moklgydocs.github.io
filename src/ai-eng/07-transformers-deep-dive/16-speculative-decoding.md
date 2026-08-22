# 投机解码——草稿、验证、重复

> 自回归解码是串行的:每个 token 都要等前一个落地。投机解码砸开这条链:便宜的模型先起草 N 个 token,昂贵的模型一次前向并行验证全部 N 个。草稿对了,你就用一次大模型前向换来了 N 个生成。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 7 阶段 · 07(GPT 因果语言建模),第 7 阶段 · 12(KV 缓存与 Flash Attention)
**预计耗时:** 约 60 分钟

## 问题

70B 的 LLM 在 H100 上采样一个 token 约 30 ms,3B 的草稿模型约 3 ms。让 3B 先起草 5 个 token,再让 70B 跑*一次*验证这 5 个,总耗时 `5×3 + 30 = 45 ms`,最多收下 5 个 token——而直线生成要 `5×30 = 150 ms`。这就是投机解码的全部卖点:多付一点显存(草稿模型),换 2–4 倍的解码延迟下降。

这个技巧必须保持分布不变。Leviathan 等人(2023)与 Chen 等人同期提出的投机采样(speculative sampling)保证:输出序列与大模型自己采样的结果**分布完全相同**。没有质量代价,只是更快。

2026 年的推理,被四类"草稿—验证"组合统治:

1. **经典投机(Leviathan 2023)。** 独立的草稿模型(如 Llama 3 1B)+ 验证模型(如 Llama 3 70B)。
2. **Medusa(Cai 2024)。** 验证模型上加多个解码头,并行预测位置 `t+1..t+k`。不需要独立草稿模型。
3. **EAGLE 家族(Li 2024、2025)。** 复用验证模型隐状态的轻量草稿;接受率比经典投机更高;典型加速 3–4 倍。
4. **Lookahead 解码(Fu 2024)。** Jacobi 迭代,完全不需要草稿模型,自我投机。小众但零依赖。

2026 年,每一个生产推理栈都默认带投机解码。vLLM、TensorRT-LLM、SGLang、llama.cpp 至少都支持经典投机 + EAGLE-2。

## 概念

### 核心算法

给定验证模型 `M_q` 和更便宜的草稿模型 `M_p`:

1. 设 `x_1..x_k` 是已解码的前缀。
2. **起草**:用 `M_p` 自回归地提议 `d_{k+1}, d_{k+2}, ..., d_{k+N}`,草稿概率为 `p_1..p_N`。
3. **并行验证**:让 `M_q` 在 `x_1..x_k, d_{k+1}, ..., d_{k+N}` 上跑一次,得到位置 `k+1..k+N+1` 的验证概率 `q_1..q_{N+1}`。
4. **从左到右逐个接受/拒绝草稿 token**:对每个 `i`,以概率 `min(1, q_i(d_i) / p_i(d_i))` 接受。
5. 在位置 `j` 首次拒绝时:从"残差"分布 `(q_j - p_j)_+` 归一化后采样 `t_j`。`j` 之后的草稿全部丢弃。
6. 全部 N 个都接受时:从 `q_{N+1}` 多采样一个 token(白送的 bonus token)。

残差分布这个技巧,正是让输出分布与 `M_q` 从头采样完全一致的数学关键。

### 加速比由什么决定

设 `α` = 每个草稿 token 的期望接受率,`c` = 草稿与验证的成本比。每一步:

- 朴素生成:每个 token 调一次大模型。
- 投机解码:每 `(1 - α^{N+1}) / (1 - α) ≈ 1/(1-α)` 个 token 调一次大模型(α 高时)。

经验值:`α = 0.75`、`N = 5` 时,大模型调用少 3 倍;草稿成本只有 1/5;总墙钟约降 2.5 倍。

**α 取决于:**

- 草稿对验证的近似程度。同一家族 / 同一训练数据,α 显著提升。
- 解码策略。贪心草稿对贪心验证:α 高。温度采样:更难匹配,接受率下降。
- 任务类型。代码和结构化输出接受率高(可预测);自由创意写作接受率低。

### Medusa——不要草稿模型的草稿

Medusa 用在验证模型上加额外输出头来取代草稿模型。在位置 `t`:

```
shared trunk → hidden h_t
    ├── head_0: predict token at t+1  (standard LM head)
    ├── head_1: predict token at t+2
    ├── head_2: predict token at t+3
    ├── head_3: predict token at t+4
```

每个头输出自己的 logits。推理时从每个头采样得到候选序列,再用一次前向、以树形注意力(tree-attention)同时考虑所有候选续写来验证。

优点:没有第二个模型。缺点:增加可训练参数;需要一个监督微调阶段(约 1B token);接受率比配上好草稿的经典投机略低。

### EAGLE——复用隐状态的更好草稿

EAGLE-1/2/3(Li 等人,2024–2025)把草稿模型做成一个微型 Transformer(通常 1 层),输入是验证模型最后一层的隐状态。因为草稿看得到验证模型的特征表示,它的预测与验证模型的输出分布高度相关。接受率从约 0.6(经典投机)爬到 0.85+。

EAGLE-3(2025)在候选续写上加了树搜索。vLLM 和 SGLang 把 EAGLE-2/3 作为 Llama 3/4 和 Qwen 3 的默认投机路径。

### KV 缓存的舞步

验证时,把 `N` 个草稿 token 一次前向喂进验证模型,KV 缓存随之延长 `N` 项。如果有草稿被拒,必须把缓存回滚到已接受前缀的长度。

生产实现(vLLM 的 `--speculative-model`、TensorRT-LLM 的 LookaheadDecoder)用临时 KV 缓冲区处理:先写入,接受才提交。概念上不难,但工程上很琐碎。

```figure
draft-verify-tokens
```

## 动手构建

见 `code/main.py`。我们实现投机采样核心算法(拒绝步 + 残差分布),配置:

- 一个"大模型":对手写分布做确定性 softmax(这样能解析地验证接受数学)。
- 一个"草稿模型":大模型的扰动版。
- 一个接受/拒绝循环,产出与直接采样相同的边际分布。

### 第 1 步:拒绝步

```python
def accept_or_reject(q_prob, p_prob, draft_token, u):
    ratio = q_prob / p_prob if p_prob > 0 else float("inf")
    return u < min(1.0, ratio)
```

`u` 是均匀随机数。`q_prob` 是验证模型给草稿 token 的概率,`p_prob` 是草稿模型给的概率。Leviathan 定理:这个伯努利判定,加上拒绝时从残差分布采样,精确保留验证模型的分布。

### 第 2 步:残差分布

```python
def residual_dist(q, p):
    raw = [max(0.0, qi - pi) for qi, pi in zip(q, p)]
    s = sum(raw)
    return [r / s for r in raw]
```

`q` 逐元素减 `p`,负值截为零,重新归一化。任何拒绝发生时,从它采样。

### 第 3 步:一步投机

```python
def spec_step(prefix, q_model, p_model, N, rng):
    drafts = []
    p_probs = []
    ctx = list(prefix)
    for _ in range(N):
        p_dist = p_model(ctx)
        d = sample(p_dist, rng)
        drafts.append(d)
        p_probs.append(p_dist[d])
        ctx.append(d)

    q_dists = [q_model(prefix + drafts[:i]) for i in range(N + 1)]

    for i, d in enumerate(drafts):
        u = rng.random()
        q_prob = q_dists[i][d]
        p_prob = p_probs[i]
        if u < min(1.0, q_prob / p_prob if p_prob > 0 else float("inf")):
            prefix = prefix + [d]
        else:
            res = residual_dist(q_dists[i], p_model(prefix))
            prefix = prefix + [sample(res, rng)]
            return prefix
    prefix = prefix + [sample(q_dists[N], rng)]
    return prefix
```

接受 5 个 → 送 1 个 bonus → 一次验证前向产出 6 个 token。

### 第 4 步:测量接受率

在不同草稿质量下跑 10,000 步投机。画出接受率与草稿/验证分布间 KL 散度的关系。应看到干净的单调关系。

### 第 5 步:验证分布等价

实证:投机循环产出的 token 直方图,应与直接从验证模型采样的直方图一致。这就是 Leviathan 定理的落地。卡方检验在采样误差内通过。

## 投入使用

生产用法:

```bash
# vLLM with EAGLE
vllm serve meta-llama/Llama-3.1-70B-Instruct \
    --speculative-model /models/llama-3.1-eagle-70b \
    --speculative-draft-tensor-parallel-size 1 \
    --num-speculative-tokens 5

# vLLM with vanilla draft model
vllm serve meta-llama/Llama-3.1-70B-Instruct \
    --speculative-model meta-llama/Llama-3.2-1B-Instruct \
    --num-speculative-tokens 5
```

截至 2026 年中,TensorRT-LLM 有最快的 Medusa 路径。`faster-whisper` 为 Whisper-large 封装了带小草稿的投机解码。

**草稿怎么选:**

| 策略 | 何时选 | 加速比 |
|----------|--------------|---------|
| 经典草稿(1B/3B Llama 家族) | 快速原型,无需训练 | 1.8–2.3× |
| Medusa 头 | 你能微调验证模型 | 2–3× |
| EAGLE-2 / 3 | 生产环境,极限速度 | 3–4× |
| Lookahead | 无草稿、无训练、无额外参数 | 1.3–1.6× |

**什么时候不用投机解码:**

- 单序列只生成 1–5 个 token。开销压过收益。
- 极度创意 / 高温度采样(α 会掉)。
- 显存吃紧的部署(草稿模型占 VRAM)。

## 交付

见 `outputs/skill-spec-decode-picker.md`。这个技能为新的推理负载挑选投机解码策略(经典 / Medusa / EAGLE / lookahead)和调参(N、草稿温度)。

## 练习

1. **易。** 运行 `code/main.py`,确认 50,000 个 token 上投机分布与验证模型直接采样分布在卡方 p > 0.05 下一致。
2. **中。** 画出 `α = 0.5, 0.7, 0.85` 下加速比(每次大模型前向产出的 token 数)随 `N` 变化的曲线,找出每个 α 的最优 N。(提示:每次验证调用的期望 token 数 = `(1 - α^{N+1}) / (1 - α)`。)
3. **难。** 实现迷你 Medusa:拿第 14 课的毕业设计 GPT,加 3 个额外 LM 头,分别预测位置 t+2、t+3、t+4。用联合多头损失在 tinyshakespeare 上训练。与"把同一模型截短当草稿"的经典方案对比接受率。
4. **难。** 实现回滚:从 10 token 前缀的 KV 缓存开始,喂 5 个草稿 token,模拟位置 3 处拒绝。验证下一轮迭代时,缓存读出的内容恰好是"前缀 + 前 2 个已接受草稿"。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|-----------------|-----------------------|
| 草稿模型(Draft model) | "便宜的那个" | 提议候选 token 的小模型;通常比验证模型便宜 10–50 倍 |
| 验证模型(Verifier) | "大的那个" | 我们要保留其分布的目标模型;每步投机跑一次 |
| 接受率(α) | "草稿有多准" | 验证模型接受草稿的单 token 概率。典型 0.7–0.9 |
| 残差分布(Residual distribution) | "拒绝后的退路" | `(q - p)_+` 归一化;拒绝时从它采样,保留验证模型的分布 |
| Bonus token | "白送的那个" | N 个草稿全被接受时,从验证模型的下一步分布多采一个 |
| Medusa | "无草稿的投机" | 验证模型上的多个 LM 头,并行预测 t+1..t+k |
| EAGLE | "隐状态草稿" | 以验证模型最后一层隐状态为条件的微型 Transformer 草稿 |
| Lookahead 解码 | "Jacobi 迭代" | 用不动点迭代自我投机;不需要草稿模型 |
| 树形注意力(Tree attention) | "一次验证多个候选" | 分支式验证,同时考虑多条草稿续写 |
| KV 回滚(KV rollback) | "撤销被拒的草稿" | 临时 KV 缓冲区;接受才提交,拒绝即丢弃 |

## 延伸阅读

- [Leviathan, Kalman, Matias (2023). Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192) ——核心算法与等价定理
- [Chen et al. (2023). Accelerating Large Language Model Decoding with Speculative Sampling](https://arxiv.org/abs/2302.01318) ——同期独立提出;伯努利拒绝的干净证明
- [Cai et al. (2024). Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads](https://arxiv.org/abs/2401.10774) ——Medusa 论文;树形注意力验证
- [Li et al. (2024). EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty](https://arxiv.org/abs/2401.15077) ——EAGLE-1;以隐状态为条件的草稿
- [Li et al. (2024). EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees](https://arxiv.org/abs/2406.16858) ——EAGLE-2;动态树深度
- [Li et al. (2025). EAGLE-3: Scaling up Inference Acceleration of Large Language Models via Training-Time Test](https://arxiv.org/abs/2503.01840) ——EAGLE-3
- [Fu et al. (2024). Break the Sequential Dependency of LLM Inference Using Lookahead Decoding](https://arxiv.org/abs/2402.02057) ——无草稿的 lookahead 方案
- [vLLM docs — Speculative Decoding](https://docs.vllm.ai/en/latest/features/spec_decode.html) ——四种策略全部接线的权威生产参考
- [SafeAILab / EAGLE reference implementation](https://github.com/SafeAILab/EAGLE) ——EAGLE-1/2/3 的参考代码
