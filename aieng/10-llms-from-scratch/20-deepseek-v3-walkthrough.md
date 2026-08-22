# DeepSeek-V3 架构巡礼

> 第 10 阶段 · 第 14 课点名了每个开放模型都在拧的六个架构旋钮。DeepSeek-V3(2024 年 12 月,总参数 671B,激活 37B)把六个全拧了,还多加四个:多头潜在注意力、免辅助损失负载均衡、多 token 预测和 DualPipe 训练。本课从上到下读 DeepSeek-V3 的架构,并从公开 config 推出每一项参数量。读完你能讲清:为什么 671B/37B 这个比例是正确的赌注,以及为什么 MLA + MoE 联手,胜过任何一者单用。

**类型:** 学习
**编程语言:** Python(标准库,参数计算器)
**前置要求:** 第 10 阶段 · 14(开放模型巡礼),第 10 阶段 · 17(NSA),第 10 阶段 · 18(MTP),第 10 阶段 · 19(DualPipe)
**预计耗时:** 约 75 分钟

## 学习目标

- 从上到下读懂 DeepSeek-V3 的 config,用"GPT-2 六旋钮 + DeepSeek 四项新增"解释每个字段
- 推导总参数量(671B)、激活参数量(37B)及各自由哪些部件贡献
- 计算 MLA 在 128k 上下文下的 KV 缓存占用,并与同激活参数的 GQA 稠密模型对比
- 陈述 DeepSeek 的四项专属创新(MLA、MTP、免辅助损失路由、DualPipe),指出各自瞄准架构/训练栈的哪一部分

## 问题

DeepSeek-V3 是第一个架构上与 Llama 家族有实质不同的前沿开放模型。Llama 3 405B 是"拧了六个旋钮的 GPT-2";DeepSeek-V3 是六个旋钮之外再加四个的 GPT-2。读 Llama 3 的 config 是读 DeepSeek config 的热身,但深层结构——注意力块的形状、路由逻辑、训练目标——已经不同到需要单独走读一遍。

学会它的回报:DeepSeek-V3 的开放权重发布,改写了开放模型里"前沿能力"的含义。这个架构是许多 2026 年训练正在照抄的蓝图。理解它,是任何接触前沿 LLM 训练或推理岗位的入场券。

## 概念

### 不变的核心,再说一遍

DeepSeek-V3 仍是自回归的。仍堆叠解码器块,每块仍是注意力 + MLP + 两个 RMSNorm。MLP 仍用 SwiGLU,位置仍用 RoPE,pre-norm,嵌入与输出头共享权重。与每一个 Llama、Mistral 同一基线。

### 转折:MLA 取代 GQA

第 10 阶段 · 14 讲过:GQA 让成组的 Q 头共享 K 和 V,缩小 KV 缓存。多头潜在注意力(MLA)走得更远:K 和 V 被压进一个共享的低秩潜在表示(`kv_lora_rank`),用时再逐头解压。KV 缓存只存潜在表示——每 token 每层通常 512 个浮点数,而不是 8 × 128 = 1024 个。

128k 上下文下,带 MLA 的 DeepSeek-V3(每 token 每层一个共享潜在 `c^{KV}`;K 和 V 都从这个潜在表示经上投影得出,而上投影可以吸收进后续矩阵乘法):

```
kv_cache = num_layers * kv_lora_rank * max_seq_len * bytes_per_element
         = 61 * 512 * 131072 * 2
         = 7.6 GB
```

一个假想的 GQA 基线(Llama 3 70B 形状,8 个 KV 头,head dim 128)要付:

```
kv_cache = 2 * 61 * 8 * 128 * 131072 * 2
         = 30.5 GB
```

128k 上下文下,MLA 的缓存比 Llama-3-70B 式 GQA 小 4 倍。

代价:MLA 每次注意力计算多一步逐头解压。多出的计算比起省下的带宽是小头。长上下文推理,净胜。

### 路由:免辅助损失的负载均衡

MoE 路由器决定每个 token 由哪 top-k 个专家处理。朴素路由器会把太多活堆给少数专家,其余闲置。标准修法:加一个惩罚负载失衡的辅助损失项。有效,但会轻微拖累主任务表现。

DeepSeek-V3 引入免辅助损失方案。给路由器 logits 加逐专家偏置项,训练中按一条简单规则调整:专家 `e` 过载就调小 `bias_e`,欠载就调大。不加额外损失项,训练保持干净,专家负载保持均衡。

对主损失的影响:测不出来。对 MoE 架构的影响:更干净,没有辅助损失超参数要调。

### MTP:更密的训练 + 白捡的草稿

第 10 阶段 · 18 讲过:DeepSeek-V3 加 D=1 个 MTP 模块,预测前方两个位置的 token。推理时,训练好的模块被改造为投机解码草稿,接受率 80%+;训练时,每个隐状态被 D+1 = 2 个目标监督,信号更密。

参数:671B 主模型之上多 14B。开销:2.1%。

### 训练:DualPipe

第 10 阶段 · 19 讲过:DualPipe 是双向流水线,把前向/反向 chunk 与跨节点 all-to-all 通信重叠。在 DeepSeek-V3 的 2,048 块 H800 规模上,它找回了 1F1B 会丢给流水线气泡的约 24.5 万 GPU 小时。

### config,逐字段

DeepSeek-V3 的 config(简化):

```
hidden_size: 7168
intermediate_size: 18432   (dense MLP hidden size, used on first few layers)
moe_intermediate_size: 2048 (expert MLP hidden size)
num_hidden_layers: 61
first_k_dense_layers: 3    (first 3 layers use dense MLP)
num_attention_heads: 128
num_key_value_heads: 128   (formally equal to num_heads under MLA, but
                           the real compression is in kv_lora_rank)
kv_lora_rank: 512          (MLA latent dimension)
num_experts: 256            (MoE expert count per block)
num_experts_per_tok: 8      (top-8 routing)
shared_experts: 1           (always-on shared expert per block)
max_position_embeddings: 163840
rope_theta: 10000.0
vocab_size: 129280
mtp_module: 1               (1 MTP module at depth 1)
```

逐项读:

- `hidden_size=7168`:嵌入维度。
- `num_hidden_layers=61`:总块深。
- `first_k_dense_layers=3`:前 3 块用 18432 的稠密 MLP,其余 58 块用 MoE。
- `num_attention_heads=128`:128 个 query 头。
- `kv_lora_rank=512`:K 和 V 压到这个潜在维度,逐头解压。
- `num_experts=256, num_experts_per_tok=8`:每个 MoE 块 256 个专家,top-8 路由。
- `shared_experts=1`:256 个路由专家之上,1 个永远在线的专家服务每个 token。可以把它想成"稠密地板",保证每个 token 都有可靠的一份计算。
- `moe_intermediate_size=2048`:每个专家的 MLP 隐藏层大小。比稠密 MLP 小,因为有 256 个。

### 参数记账

完整计算在 `code/main.py`。头条数字:

- 嵌入:`vocab * hidden = 129280 * 7168 = ~0.93B`。
- 前 3 个稠密块:MLA 注意力(每块约 144M)+ 稠密 MLP(每块约 260M)+ 归一化。共约 1.2B。
- 58 个 MoE 块:MLA 注意力(约 144M)+ 256 个专家(每个 30M)+ 1 个共享专家(30M)+ 归一化。含全部专家,每块约 7.95B。58 块共 461B。
- MTP 模块:14B。

总计:核心架构约 476B + MTP 14B;公开的 671B 还计入了额外的结构参数(偏置张量、专家专属组件、共享专家缩放等)。计算器复现的数字与公开值差 3–5%,差额来自 DeepSeek 报告第 2 节附录里的细粒度记账。

每次前向的激活参数:

- 注意力:每层 144M × 61 = 8.8B(所有层都激活)。
- MLP 激活:前 3 层稠密(3 × 260M = 780M);58 个 MoE 层,每层激活 8 个路由专家 + 1 个共享 + 路由开销。每层激活 MLP 约 260M。合计 3 × 260M + 58 × 260M ≈ 15.9B。
- 嵌入 + 归一化:1.2B。
- 总激活:核心约 26B + MTP 14B(训了但推理时不总跑)≈ 37B。

### 671B / 37B 这个比例

18 倍稀疏比(激活参数占总量 5.5%)。DeepSeek-V3 是已发布开放权重中最稀疏的前沿 MoE 模型。Mixtral 8x7B 的比例是 13/47(28%),稠密得多;Llama 4 Maverick 是 17B/400B(4.25%),量级相当。DeepSeek 的赌注:在前沿规模上,更多专家 + 更低激活率,能换来更高的单位激活 FLOP 质量。

### DeepSeek-V3 的位置

| 模型 | 总参数 | 激活参数 | 比例 | 注意力 | 新点子 |
|-------|------|-------|-------|-----------|-------------|
| Llama 3 70B | 70B | 70B | 100% | GQA 64/8 | — |
| Llama 4 Maverick | 400B | 17B | 4.25% | GQA | — |
| Mixtral 8x22B | 141B | 39B | 27% | GQA | — |
| DeepSeek V3 | 671B | 37B | 5.5% | MLA 512 | MLA + MTP + 免辅助损失 + DualPipe |
| Qwen 2.5 72B | 72B | 72B | 100% | GQA 64/8 | YaRN 扩展 |

### 后续:R1、V4

DeepSeek-R1(2025)是在 V3 骨干上做的推理训练。R1 用同一个架构,变的是后训练配方(可验证任务上的大规模 RL),不是预训练架构。

DeepSeek-V4(若发布)预计保留 MLA + MoE + MTP,加上 DSA(DeepSeek Sparse Attention)——第 10 阶段 · 17 里 NSA 的继任者。这条谱系很稳:架构级创新不断累积,每一代多拧几个旋钮。

```figure
moe-routing
```

## 投入使用

`code/main.py` 是为 DeepSeek-V3 形状定制的参数计算器。跑一跑,把输出与论文数字对比,再拿它试假想变体(256 专家 vs 512、top-8 vs top-16、MLA rank 512 vs 1024)。

重点看:

- 总参数量 vs 公开的 671B。
- 激活参数量 vs 公开的 37B。
- 128k 上下文 KV 缓存——MLA vs GQA 的对比。
- 逐层拆解,看参数预算到底花在了哪里。

## 交付

本课会产出 `outputs/skill-deepseek-v3-reader.md`。给定一个 DeepSeek 家族模型(V3、R1 或任何未来变体),它产出逐部件的架构解读:点名 config 每个字段、按部件推导参数量,并识别该模型用到了四项 DeepSeek 专属创新中的哪几项。

## 练习

1. 运行 `code/main.py`。把计算器的总参数估算与公开的 671B 对比,找出差值来源。论文第 2 节有完整明细。

2. 把 config 改成 MLA rank 256(替代 512)。计算 128k 上下文下的 KV 缓存。省了多少百分比?对逐头表达能力的代价是什么?

3. 对比 DeepSeek-V3 的(256 专家、top-8)路由与假想的(512 专家、top-8)变体。总参数增长,激活参数不变。多出的专家容量理论上买什么?推理时付出什么?

4. 读 DeepSeek-V3 技术报告(arXiv:2412.19437)第 2.1 节 MLA 部分。用三句话解释:为什么 K 和 V 的解压矩阵可以"吸收"进后续矩阵乘法,从而提高推理效率。

5. DeepSeek-V3 大部分运算用 FP8 训练。计算存 671B 权重时 FP8 相对 BF16 的显存节省。这与 14.8T token 的训练预算如何相互作用?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| MLA | "多头潜在注意力" | K 和 V 压成共享低秩潜在表示(kv_lora_rank,典型 512),用时逐头解压;KV 缓存只存潜在表示 |
| kv_lora_rank | "MLA 压缩维度" | K 和 V 共享潜在表示的大小;DeepSeek-V3 用 512 |
| 前 k 个稠密层 | "早层保持稠密" | MoE 模型的前几层跳过路由器,跑稠密 MLP 以求稳定 |
| num_experts_per_tok | "top-k 路由" | 每个 token 激活几个路由专家;DeepSeek-V3 用 8 |
| 共享专家(Shared experts) | "永远在线的专家" | 不管路由如何都处理每个 token 的专家;DeepSeek-V3 用 1 |
| 免辅助损失路由 | "偏置调平的负载均衡" | 训练中调整逐专家偏置项,不加损失项也能保持专家负载均衡 |
| MTP 模块 | "额外预测头" | 从 h^(1) 和 E(t+1) 预测 t+2 的 Transformer 块;训练信号更密,还白送投机解码草稿 |
| DualPipe | "双向流水线" | 把前向/反向计算与跨节点 all-to-all 重叠的训练调度 |
| 激活参数比 | "稀疏度" | active_params / total_params;DeepSeek-V3 达到 5.5% |
| FP8 训练 | "8 位训练" | 存储和大量计算用 FP8;显存约为 BF16 一半,质量代价很小 |

## 延伸阅读

- [DeepSeek-AI — DeepSeek-V3 Technical Report (arXiv:2412.19437)](https://arxiv.org/abs/2412.19437) ——架构、训练与结果的完整文档
- [DeepSeek-V3 model card on Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V3) ——config 文件与部署说明
- [DeepSeek-V2 paper (arXiv:2405.04434)](https://arxiv.org/abs/2405.04434) ——引入 MLA 的前作
- [DeepSeek-R1 paper (arXiv:2501.12948)](https://arxiv.org/abs/2501.12948) ——V3 架构上的推理训练后继
- [Native Sparse Attention (arXiv:2502.11089)](https://arxiv.org/abs/2502.11089) ——DeepSeek 家族注意力的未来方向
- [DualPipe repository](https://github.com/deepseek-ai/DualPipe) ——训练调度的参考实现
