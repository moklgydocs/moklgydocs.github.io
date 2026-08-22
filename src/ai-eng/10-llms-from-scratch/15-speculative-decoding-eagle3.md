# 投机解码与 EAGLE-3

> 第 7 阶段 · 第 16 课证明了数学:Leviathan 拒绝规则精确保留验证模型的分布。本课讲的是 2026 年生产级投机解码的训练技术栈视角。EAGLE-3 把草稿模型从"便宜的近似"变成了专门构建的微型网络——在验证模型自己的隐状态上训练,再加一个训练时测试(training-time test)循环,对齐它的训练与推理分布。结果:端到端加速 3 到 6.5 倍,聊天场景单 token 接受率超过 0.9,分布零损失。2026 年,每一个生产推理栈都默认带它。

**类型:** 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 7 阶段 · 16(投机解码数学),第 10 阶段 · 12(推理优化)
**预计耗时:** 约 75 分钟

## 学习目标

- 用一句话陈述 Leviathan 定理,并证明投机循环产出的样本与验证模型直接采样同分布
- 梳理从经典投机解码(Leviathan 2023)到 EAGLE、EAGLE-2、EAGLE-3 的两年演进,点名每一步消除了什么限制
- 由接受率 `α` 和草稿/验证成本比 `c` 计算期望加速比,并为每种情形选择最优草稿长度 `N`
- 从零实现完整的投机循环:起草、验证、拒绝时从残差分布采样、拒绝时回滚 KV 缓存、全部接受时发出 bonus token

## 问题

70B 模型的自回归解码,在 H100 上大约每秒 35 个 token。GPU 远没吃饱,天花板是显存带宽:每个 token 都要把 70B 的权重从 HBM 读进来,做一步算术,产出一个浮点数。计算单元大部分时间在闲置。

投机解码把问题变成一个真正可解的吞吐问题。便宜的草稿用 N 次小前向提议 `N` 个 token,验证模型对"前缀 + 全部 N 个草稿"跑一次。如果验证模型在位置 `i` 的分布与草稿一致(以我们即将精确定义的统计意义),就接受;否则拒绝,并从残差分布采样一个修正。一次大模型前向,最多产出 `N+1` 个被接受的 token,而不是 1 个。

要紧的定理是 Leviathan、Kalman、Matias(ICML 2023):输出分布与直接从验证模型采样完全一致。不是近似,是完全一致。这就是投机解码能进生产的全部理由——它是纯粹的延迟优化,没有质量代价。

第 7 阶段 · 第 16 课给你的是数学,本课给你的是训练技术栈。好草稿比便宜草稿多值 2 倍加速。EAGLE、EAGLE-2、EAGLE-3(Li 等人,2024–2025)把"草稿 = 同家族的小号模型"变成了一门精确的工程学科。2026 年的生产推理服务器,默认就是 EAGLE-3。

## 概念

### 不变式:Leviathan 拒绝采样

设 `p(t)` 是草稿模型给定前缀时对下一 token 的分布,`q(t)` 是验证模型的。采一个草稿 token `d ~ p`,以概率 `min(1, q(d) / p(d))` 接受。拒绝时,从残差分布 `(q - p)_+ / ||(q - p)_+||_1` 采样。这样产出的样本服从 `q`——无论 `p` 有多差都成立:`p` 越差,拒绝越频繁,但输出始终精确。

把 N 次这样的调用背靠背串起来,用验证模型对 `prefix + d_1 + ... + d_N` 做一次前向,同时得到 `q_1, q_2, ..., q_{N+1}`。从左往右走:在位置 `j` 首次拒绝时,从 `residual(q_j, p_j)` 采样并停止;全部接受时,从 `q_{N+1}` 多采一个 bonus token。

### 加速比由什么决定

设 `α` 为每个草稿 token 的期望接受率,`c = cost(draft) / cost(verifier)` 为成本比。每次验证前向的期望接受 token 数:

```
E[accepted] = (1 - α^(N+1)) / (1 - α)
```

每个被接受 token 的期望总墙钟是 `(N * c + 1) / E[accepted]`。对 `N` 求最小,就得到甜点。`α = 0.8, c = 0.05`:最优 `N` 约 5–7,加速 3.2 倍。`α = 0.95, c = 0.02`:最优 `N` 约 8–10,加速逼近 5 倍。

最大的杠杆是 `α`。固定 `N = 5`,从 `α = 0.6`(经典草稿)到 `α = 0.9`(EAGLE-3),每次验证前向的期望接受 token 从 2.2 涨到 4.1。同一个验证模型,吞吐几乎翻倍。

### 两年的演进

**经典投机(Leviathan,2023)。** 草稿模型是同家族独立训练的小号 LLM。好接线,`α ≈ 0.6`,加速最多 2 倍左右。

**EAGLE-1(Li 等人,2024)。** 草稿是一个微型 Transformer——通常一两层——以验证模型最后一层的隐状态为输入,直接预测下一个 token。草稿看得到验证模型的特征表示,分布因此贴近得多。`α` 爬到 0.7–0.8。

**EAGLE-2(Li 等人,2024)。** 加了动态草稿树:不再提议单条 N token 序列,而是提议一小棵候选树,用验证模型一次前向(树形注意力)给每个候选打分,走概率最高的路径。草稿长度逐步自适应。被接受路径上的 `α` 超过 0.85。

**EAGLE-3(Li 等人,2025,NeurIPS)。** 又改两处。第一,彻底丢掉特征预测损失——EAGLE-1/2 训练草稿去匹配验证模型的隐状态,这限制了数据能带来多少帮助;EAGLE-3 直接在 token 预测上训练。第二,训练时测试(TTT):训练草稿时,把草稿自己之前的预测喂回输入,连喂多步,与它推理时的工作方式一致。这让训练分布与测试分布对齐,阻止误差累积。实测加速:聊天场景最高 6.5 倍;H100 上 SGLang、batch 64 时吞吐提升 38%。

### KV 缓存回滚

验证会一次把验证模型的 KV 缓存延长 `N` 项。如果在位置 `j` 发生拒绝,位置 `j-1` 之后的缓存内容就是错的。两种常见实现:写入临时缓冲区、接受才提交(vLLM、TensorRT-LLM);或者维护物理 KV 缓存加一个逻辑长度,拒绝时截断。无论哪种,回滚成本是每层每头若干字节,相对前向成本可忽略。

EAGLE-2 的树搜索里,验证模型用尊重树拓扑的非因果掩码做注意力。工程上琐碎,但计算就是一次带自定义掩码的标准 Flash Attention 调用。

### 2026 年的草稿架构

| 策略 | 草稿类型 | `α` | 加速比 | 训练成本 |
|----------|-----------|-----|---------|---------------|
| 经典 | 独立小 LLM | 0.55–0.70 | 1.8–2.3× | 无(复用现成小模型) |
| Medusa | 验证模型上的额外 LM 头 | 0.65–0.75 | 2–3× | 约 1B SFT token |
| EAGLE-1 | 隐状态上的 1 层 Transformer | 0.70–0.80 | 2.5–3× | 约 60B token |
| EAGLE-2 | EAGLE-1 + 动态草稿树 | 0.80–0.88 | 3–4× | 约 60B token |
| EAGLE-3 | 多层特征融合 + TTT | 0.88–0.92 | 3.5–6.5× | 约 60–200B token |
| Lookahead | 无草稿(Jacobi 迭代) | N/A | 1.3–1.6× | 无 |

2026 年的生产:vLLM 和 SGLang 有 EAGLE-3 就用 EAGLE-3,否则 EAGLE-2。TensorRT-LLM 对 Meta 和 NVIDIA 公开模型有最快的 Medusa 路径。llama.cpp 为 CPU 部署提供经典草稿。

```figure
l5-spec-decode-eagle
```

## 动手构建

见 `code/main.py`。这是带全部零件的完整 Leviathan 投机循环:N 个草稿、验证并行前向、逐位置拒绝、残差采样、bonus token、KV 回滚,以及"输出分布与直接采样 `q` 一致"的实证检验。

### 第 1 步:拒绝规则

```python
def accept(q_prob, p_prob, u):
    if p_prob <= 0:
        return True
    return u < min(1.0, q_prob / p_prob)
```

### 第 2 步:残差分布

```python
def residual(q, p):
    raw = [max(0.0, qi - pi) for qi, pi in zip(q, p)]
    s = sum(raw)
    if s == 0:
        return list(q)
    return [r / s for r in raw]
```

### 第 3 步:完整投机一步

`spec_step` 函数从 `p` 起草 `N` 个 token,再用一次并行 `q` 评估全部验证。对每个草稿 token 施加拒绝规则;首次拒绝时从残差采样修正。全部接受时,从 `q_{N+1}` 发出 bonus token。

### 第 4 步:KV 回滚记账

模拟器为每个工作序列跟踪一个逻辑 `kv_length`。接受 `k` 个草稿时,`kv_length += k`;在位置 `j` 拒绝时,缓存虽已写过了 `j`,但逻辑长度设为 `prefix_length + j + 1`——修正 token 之后一位。后续读取按逻辑长度截断。

### 第 5 步:Leviathan 检验

跑 50,000 步投机,统计被接受 token 的经验分布,与 50,000 个直接来自 `q` 的样本对比。卡方统计量应远低于临界值。定理在实践中成立。

### 第 6 步:加速比 vs α

以不同幅度扰动 `p` 使其偏离 `q`,扫出不同的草稿质量,测 `α`,画出"每次验证调用的期望 token 数"随 `α` 和 `N` 的变化。代码会打印一张表,展示 EAGLE-3 级别的草稿质量(`α ≈ 0.9`)如何让每次验证调用产出 4–5 个 token。

## 投入使用

生产级 `vllm serve` 配 EAGLE-3:

```bash
vllm serve meta-llama/Llama-3.3-70B-Instruct \
  --speculative-config '{
    "model": "yuhuili/EAGLE3-LLaMA3.3-Instruct-70B",
    "num_speculative_tokens": 5,
    "method": "eagle3"
  }'
```

SGLang 配 EAGLE-3、H100、batch 64:按 EAGLE-3 论文,吞吐比 batch-64 朴素解码高约 1.38 倍。

什么时候用投机解码:

- 任何 p50 延迟比峰值吞吐更要紧的交互式聊天负载。
- 代码生成与结构化输出(JSON、SQL)。目标分布高度可预测,`α` 在 0.9 以上。
- 长文生成(数千 token)。摊薄的加速持续兑现。

什么时候不用:

- 很小的模型(< 3B)。草稿并不比验证便宜多少。
- 微型 batch-1 CPU 部署。草稿模型的显存开销可能不值。
- `α` 会崩塌的超高温度创意采样。

## 交付

本课会产出 `outputs/skill-eagle3-tuner.md`。给定推理负载(模型、batch 大小、目标延迟、任务画像),它推荐投机解码策略与调参(草稿家族、`N`、树深度、温度感知切换)。

## 练习

1. 运行 `code/main.py`,确认 Leviathan 分布检验的卡方统计量在 50,000 个样本上低于 95% 临界值。

2. 固定 `α = 0.9`、`c = 0.04`,把 `N` 从 1 扫到 10。画出每次验证调用的期望 token 数和每 token 实际墙钟。找出使墙钟最小的 `N`,解释曲线形状。

3. 修改代码模拟 EAGLE-2 树搜索:每步草稿提议一棵 `[2, 2, 2]` 形状的树(八条候选路径),验证模型跑一次,概率最高的被接受路径胜出。计算每叶的 `α` 和每次验证调用的总 token 数,与同等算力下的线性链投机解码对比。

4. 实现两个并发序列的批量 KV 回滚模拟器。序列 A 草稿全被接受,序列 B 在位置 2 拒绝。证明每个序列的 `kv_length` 都更新正确,且没有浪费的计算。

5. 读 EAGLE-3 论文第 4 节(Training-Time Test)。用两句话解释:为什么不用 TTT 的朴素草稿训练受曝光偏差(exposure bias)之苦,而训练时把草稿自己的预测喂回输入能修好它。并把它与 seq2seq 的 scheduled sampling 文献联系起来。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| Leviathan 规则 | "min(1, q 比 p)" | 以概率 `min(1, q(d)/p(d))` 做伯努利接受/拒绝;配合拒绝时从残差采样,精确保留验证模型分布 |
| 残差分布(Residual distribution) | "(q 减 p) 取正再归一" | `(q - p)_+` 截零后重新归一化——拒绝时正确的采样分布 |
| 接受率 α | "草稿有多准" | 拒绝规则下的期望单 token 伯努利成功概率;一切加速数学的主宰 |
| EAGLE-1 | "隐状态草稿" | 以验证模型最后一层隐状态为条件的微型 Transformer 草稿(Li 等人,2024) |
| EAGLE-2 | "动态草稿树" | EAGLE-1 加候选续写树,验证模型一次前向用树形注意力打分 |
| EAGLE-3 | "训练时测试" | 丢掉特征预测损失,直接在 token 预测上训练,且训练时把草稿自己的输出喂回给它 |
| 训练时测试(TTT) | "曝光偏差修复" | 训练时让草稿自回归运行,使训练与测试的输入分布一致——scheduled sampling 的直接对应 |
| KV 回滚(KV rollback) | "撤销被拒草稿" | 拒绝后把验证模型的 KV 缓存重置到已接受前缀长度的记账机制 |
| Bonus token | "白送的那个" | 全部 `N` 个草稿被接受时,从 `q_{N+1}` 多采一个,不花额外验证成本 |
| 树形注意力(Tree attention) | "一次验证多个候选" | 用尊重草稿树拓扑的非因果掩码做注意力;一次前向算出树中每个节点的 `q_i` |

## 延伸阅读

- [Leviathan, Kalman, Matias — Fast Inference from Transformers via Speculative Decoding (arXiv:2211.17192, ICML 2023)](https://arxiv.org/abs/2211.17192) ——奠基论文与等价定理
- [Chen et al. — Accelerating Large Language Model Decoding with Speculative Sampling (arXiv:2302.01318)](https://arxiv.org/abs/2302.01318) ——同期独立提出,证明干净
- [Li et al. — EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty (arXiv:2401.15077)](https://arxiv.org/abs/2401.15077) ——EAGLE-1,以隐状态为条件的草稿
- [Li et al. — EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees (arXiv:2406.16858)](https://arxiv.org/abs/2406.16858) ——动态树搜索
- [Li et al. — EAGLE-3: Scaling up Inference Acceleration via Training-Time Test (arXiv:2503.01840, NeurIPS 2025)](https://arxiv.org/abs/2503.01840) ——2026 年的生产默认
- [Cai et al. — Medusa: Multiple Decoding Heads (arXiv:2401.10774)](https://arxiv.org/abs/2401.10774) ——无草稿的替代路线
- [vLLM Speculative Decoding documentation](https://docs.vllm.ai/en/latest/features/spec_decode.html) ——所有策略全部接线的权威生产参考
