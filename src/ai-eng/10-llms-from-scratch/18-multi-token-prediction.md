# 多 token 预测(MTP)

> 从 GPT-2 到 Llama 3,每一个自回归 LLM 在每个位置上只有一个损失:预测下一个 token。DeepSeek-V3 加了第二个:预测下下个 token。多出的 14B 参数(在 671B 的模型上)通过梯度流被"蒸馏"回主模型,而训练好的 MTP 头在推理时被改造为投机解码的草稿器,接受率 80%+。1.8 倍生成吞吐,白捡。本课按 DeepSeek 技术报告构建顺序式 MTP 模块,计算损失与共享头部的参数布局,并解释为什么 MTP 保住了因果链,而 Gloeckle 等人的原始并行 MTP 打断了它。

**类型:** 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 10 阶段 · 04(预训练迷你 GPT),第 10 阶段 · 15(投机解码)
**预计耗时:** 约 60 分钟

## 学习目标

- 陈述 MTP 训练目标,并推导跨预测深度的联合损失
- 解释 Gloeckle 等人的并行 MTP 头(2024)与 DeepSeek-V3 顺序式 MTP 模块的区别,以及为什么顺序设计保住了因果链
- 计算为预训练添加 MTP 模块的参数与显存开销
- 从零实现一个 MTP 模块:共享嵌入、逐深度 Transformer 块、投影层和共享输出头

## 问题

下一 token 预测是标准的 LLM 训练目标。每个隐状态只被监督预测一样东西:紧跟其后的那个 token。这是一个出乎意料地弱的信号。序列中的大部分信息超出单个 token——结构、连贯性、事实性、算术流。模型只能靠在万亿 token 上累积无数个单 token 信号,把它们学出来。

MTP 问:如果每个隐状态被监督同时预测多个未来 token 呢?Gloeckle 等人(Meta,2024)证明了这有帮助。他们的实现在骨干之上放几个独立的输出头,各预测一个偏移。并行、简单,但所有头看到的是同一个隐状态,没有任何层级化打磨——而且预测之间不构成因果链,所以没法拿去做投机解码。

DeepSeek-V3(2024 年 12 月)把 MTP 重新设计为在每个预测深度保住因果链的顺序式模块。模型从 `h_i^(0)` 预测 `t+1`,再从把 `h_i^(0)` 与 `E(t+1)` 嵌入组合而成的新隐状态 `h_i^(1)` 预测 `t+2`,依此类推。每个深度是自己的一个小 Transformer 块。共享嵌入和共享输出头把参数开销控制得很小。在 DeepSeek-V3 的规模上,671B 主模型权重之上,MTP 模块多 14B 参数。这 2% 的开销,换来了更密的训练信号,外加一个推理时现成的投机解码草稿。

本课从零构建单个 MTP 模块和 D 深度的损失。数学很干净,实现 150 行。

## 概念

### 顺序式 MTP 配方

DeepSeek-V3 在主模型上加 `D` 个 MTP 模块。模块 `k`(k = 1..D)预测深度 `k` 的 token——即给定到位置 `i` 的前缀,预测 `t_{i+k}`。

模块 `k` 由以下组成:

- 一个有自己注意力和 MLP 的 Transformer 块 `T_k`。
- 一个投影矩阵 `M_k`,把上一深度的隐状态与下一深度真值 token 的嵌入组合起来。
- 共享嵌入 `E`(与主模型同一份)。
- 共享输出头 `Out`(与主模型同一份)。

训练时,对到位置 `i` 的前缀,逐深度隐状态为:

```
h_i^(0) = main model backbone at position i
h_i^(k) = T_k( M_k * concat(RMSNorm(h_i^(k-1)), RMSNorm(E(t_{i+k}))) )   for k >= 1
```

逐深度预测:

```
logits_{i+k} = Out(h_i^(k-1))   for k = 1..D
```

逐深度损失是相对真值 `t_{i+k}` 的交叉熵:

```
L_k = CE(logits_{i+k}, t_{i+k})
```

跨深度联合损失:

```
L_MTP = (lambda / D) * sum_{k=1..D} L_k
```

`lambda` 是小权重因子——DeepSeek-V3 在训练前 10% 用 0.3,之后用 0.1。总训练损失为 `L_main + L_MTP`。

### 为什么顺序,而不是并行

Gloeckle 的原始并行 MTP 有 D 个输出头,都直接作用在 `h_i^(0)` 上,每个头从同一个骨干隐状态预测 `t_{i+k}`。训练没问题,但预测之间互不条件化——`head_1` 的输出帮不了 `head_2`,因为各头是并行开火的。

DeepSeek-V3 的顺序设计,用 `h_i^(k-1)` 加上真实的下一 token 嵌入 `E(t_{i+k})` 来构建 `h_i^(k)`。这保住了因果链:预测 `t_{i+k+1}` 时,深度 `k+1` 的模块看得到 `t_{i+k}` 上是什么。这在结构上与自回归解码器消费自己输出的方式完全一致——于是 MTP 模块可以直接拿去做投机解码的草稿器。

推理时:把 `h_i^(k-1)` 和起草的 `t_{i+k}` 喂给模块 `k+1`,得到 `t_{i+k+1}` 的预测。重复。这正是 EAGLE 式草稿,只是把训练好的 MTP 模块当草稿网络用。DeepSeek-V3 报告:第一个 MTP 模块接受率 80%+,加速约 1.8 倍。

### 参数记账

对隐藏维度 `h`、词表 `V` 的模型:

- 主模型:数十亿参数,外加一个 `V * h` 的输出头。
- 共享输出头:复用主模型的头。零额外参数。
- 共享嵌入:复用主模型的嵌入。零额外参数。
- 每个 MTP 模块:
  - 投影 `M_k`:`(2h) * h = 2h^2`。
  - Transformer 块 `T_k`:注意力(MHA 为 `4h^2`)加 MLP(SwiGLU 按 8/3 比约 `8h^2`)。每块约 `12h^2`。

每模块总额外参数:约 `14h^2`。DeepSeek-V3 的 `h = 7168`、D = 1 个模块:纸面约 `14 * 7168^2 = ~720M` 参数。DeepSeek-V3 报告的是 14B——差额主要来自 MTP 模块中的专家层也是 MoE 结构。

### 投机解码的回报

预训练期间,MTP 模块让训练慢约 10%(更多前向计算、额外损失)。回报是双重的:

1. 更密的训练信号。每个隐状态看到 D+1 个监督目标。DeepSeek-V3 的消融中,MMLU、GSM8K、MATH、HumanEval 都有一致的几个点提升。

2. 推理时白捡的投机解码草稿。MTP 模块本来就训练来预测未来几个 token。改造成草稿网络,接受率 80%+。在这个水平,N=3 或 N=5 的投机解码给 1.8 倍吞吐。10% 的训练成本,第一次跑推理就回本。

### 与 EAGLE 的关系

EAGLE 在预训练*之后*单独训练一个小草稿模型;MTP 把草稿*烘进*预训练。两条路线收敛到相近的接受率,但流水线不同:

| 维度 | EAGLE-3 | MTP(DeepSeek-V3) |
|-----------|---------|------------------|
| 何时训练 | 预训练后 | 预训练中 |
| 对已有权重向后兼容 | 是 | 否(需要重训) |
| 草稿参数 | 1–2 个 Transformer 层 | 1 个 Transformer 块 + 投影 |
| 接受率 | 0.88–0.92 | 深度 1 处 0.80+ |
| 加速之外的收益 | 仅投机解码 | 更密的训练信号 + 加速 |

```figure
multi-token-predict
```

## 动手构建

`code/main.py` 端到端构建单个 MTP 模块:共享嵌入、投影、Transformer 块、共享输出头。然后在短的合成序列上计算逐深度交叉熵损失,并按部件打印参数量。32 个 token 的玩具词表让数字可读。

### 第 1 步:共享嵌入表

一张 `vocab_size x hidden` 的表,主模型和每个深度的每个 MTP 模块共用。不是第二份拷贝——字面意义上的同一个张量。

### 第 2 步:逐深度组合

```python
def combine(prev_hidden, next_token_embed, M_k):
    # concat along feature dim, then project down to hidden
    concat = rms_norm(prev_hidden) + rms_norm(next_token_embed)  # vector addition stand-in
    projected = matvec(M_k, concat)
    return projected
```

真实的 DeepSeek-V3 把两个 RMSNorm 后的向量拼成 `[2h]`,用一个 `h x 2h` 矩阵投影。玩具版为标准库简洁,用向量加法代替。

### 第 3 步:深度 k 的 Transformer 块

自注意力加 MLP。玩具版用一层线性注意力块和一个 SwiGLU MLP,不用 numpy 也能看清结构。

### 第 4 步:共享输出头

复用主模型的输出投影。产出词表上的 logits。

### 第 5 步:逐深度损失

softmax(logits) 对偏移 `k` 处真值 token 的交叉熵。按 `lambda / D` 因子跨深度聚合。

### 第 6 步:参数记账

打印总参数量、共享部分(嵌入、头)参数量和每模块额外参数量。展示 MTP 额外参数与主模型规模的比值。

## 投入使用

MTP 已集成进 DeepSeek-V3(2024 年 12 月)和 DeepSeek-R1 系列。推理侧:

- DeepSeek 自己的服务栈开箱即用,把 MTP 模块当投机解码器消费。
- 截至 2026 年 4 月,vLLM 和 SGLang 已有 DeepSeek-V3 MTP 的集成路径。
- AMD 的 ROCm SGLang 教程给出一个具体的 MTP 投机解码配置,在 V3 检查点上实测 1.8 倍加速。

新的预训练什么时候上 MTP:

- 你掌控完整预训练流水线,想囤下更密的训练信号。
- 你确定要规模化服务这个模型,想白拿投机解码。
- 你的隐藏维度至少 4096。1B 规模上,开销的痛感大于收益。

什么时候不上:

- 微调已有的预训练稠密模型。MTP 模块没训过。
- 需要干净基线做对照的研究模型。MTP 改变了架构。

## 交付

本课会产出 `outputs/skill-mtp-planner.md`。给定预训练规格(模型规模、数据、算力),它返回 MTP 集成计划:深度数 D、`lambda` 调度、显存开销,以及推理时投机解码的接线方式。

## 练习

1. 运行 `code/main.py`。展示合成信号增强时,逐深度损失单调下降。把合成数据改成固定模式,验证深度 1 和深度 2 的损失都收敛。

2. 计算稠密 70B 模型(hidden 8192,80 层)加 D=1 个 MTP 模块的参数开销,与 DeepSeek-V3 报告的 14B 对比。解释为什么 DeepSeek 的数字更高:MTP 的 Transformer 块继承了同样的 MoE 结构,膨胀了每模块参数量。

3. 在玩具版中实现 D=2:加第二个 MTP 模块,输入 h^(1),预测 `t_{i+2}`。验证联合损失和参数记账与 DeepSeek 论文的公式 19–21 一致。

4. 把玩具版切成并行 MTP(Gloeckle 式):在主隐状态上加 D 个输出头,各预测一个偏移。在同一合成信号上,测量逐深度损失与顺序版的对比。顺序版在 k > 1 的深度上应产生更低的损失,因为它条件化了中间预测。

5. 把训练好的 MTP 模块当 EAGLE 式草稿用:推理时调用模块 k 提议 `t_{i+k}`。在留出序列上,测量这些草稿 token 与主模型预测的一致率。玩具上达到 50%+,你就复现了"MTP 即草稿"的实证性质。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| MTP 模块 | "额外损失块" | 一个小 Transformer 块加投影,预测主模型前方 `k` 个位置的 token |
| 预测深度(Prediction depth) | "哪个偏移" | 整数 `k`,模块 `k` 从到位置 `i` 的前缀预测 `t_{i+k}` |
| 并行 MTP | "Gloeckle 式" | 同一骨干隐状态上的 D 个独立头,没有条件链 |
| 顺序式 MTP | "DeepSeek-V3 式" | 每个模块条件于上一深度隐状态加下一 token 嵌入;保住因果链 |
| 共享输出头 | "复用主头" | MTP 模块调用主模型的 LM 头,不用单独的输出投影 |
| 共享嵌入 | "复用主表" | 同一份词表嵌入到处使用;无重复参数 |
| 投影矩阵 M_k | "隐状态 + 下一 token 的融合器" | 一个 `h x 2h` 线性层,把上一隐状态与目标 token 嵌入折进下一深度的输入 |
| 联合损失 L_MTP | "平均的额外损失" | 逐深度交叉熵的算术平均,乘 `lambda` 缩放 |
| 深度 1 接受率 | "MTP 草稿有多准" | D=1 模块的 top-1 预测与主模型 top-1 预测一致的比率;DeepSeek-V3 上 80%+ |
| Lambda 加权 | "额外损失的重要性" | 逐深度缩放因子;DeepSeek-V3 训练初期 0.3,后期 0.1 |

## 延伸阅读

- [DeepSeek-AI — DeepSeek-V3 Technical Report (arXiv:2412.19437)](https://arxiv.org/abs/2412.19437) ——顺序式 MTP 的完整描述(第 2.2 节),含联合损失公式与推理时 1.8 倍加速
- [Gloeckle et al. — Better & Faster Large Language Models via Multi-token Prediction (arXiv:2404.19737)](https://arxiv.org/abs/2404.19737) ——DeepSeek 设计所改进的并行 MTP 基线
- [DeepSeek-V3 model card on Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V3) ——685B 总量(671B 主模型 + 14B MTP),部署说明
- [Leviathan et al. — Fast Inference from Transformers via Speculative Decoding (arXiv:2211.17192)](https://arxiv.org/abs/2211.17192) ——MTP 所嵌入的投机解码框架
- [Li et al. — EAGLE-3 (arXiv:2503.01840)](https://arxiv.org/abs/2503.01840) ——EAGLE 的 2025 草稿架构,MTP 的对标者
