# 硬件专用推理编译 —— Blackwell 上的 FP8 与 NVFP4

> 硬件专用推理编译用可移植性换吞吐量,而 TensorRT-LLM——仅限 NVIDIA、专为 Blackwell 调优——是这笔交易最划算的范例。2026 年 Q1-Q2,SemiAnalysis InferenceX 在 GB200 NVL72 + Dynamo 编排下测得 120B 模型每百万 token 成本 0.012 美元,而 H100 + vLLM 是 0.09 美元/M——7 倍的经济差距。这套栈由三层浮点机制复合而成:FP8 对 KV 缓存和注意力内核依然关键,因为它们需要足够的动态范围;NVFP4(4 位微缩放)承载权重和激活;多 token 预测(MTP)和 prefill/decode 分离再叠加 2-3 倍。Day-0 模型支持直接加载 FP4 权重,无需训练后转换。2026 年工程团队要注意的坑:TRT-LLM 虽开源但 NVIDIA 专用——深度绑定 CUDA 和 Blackwell——采用它就是用可移植性换吞吐量。下注之前,先按你的模型和硬件组合算清这笔账。

**类型:** 学习
**编程语言:** Python(标准库,玩具级 FP8/NVFP4 显存与成本计算器)
**前置要求:** 第 17 阶段 · 04(推理引擎内部机制)、第 10 阶段 · 13(量化)
**预计耗时:** 约 75 分钟

## 学习目标

- 解释为什么即使权重用了 NVFP4,KV 缓存和注意力仍然离不开 FP8。
- 计算前沿模型在 BF16、FP8、NVFP4 下的 HBM 占用,并讲清节省来自哪里。
- 说出 TRT-LLM 利用的 Blackwell 专有特性(day-0 FP4、MTP、分离式推理、all-to-all 原语)。
- 判断什么时候 TRT-LLM 的 NVIDIA 锁定配得上它相对 Hopper 上 vLLM 的 7 倍成本差距。

## 问题

2026 年推理经济学的前沿问题是"每美元能出多少 token"。答案取决于四层叠加的选择:硬件代际(Hopper H100/H200 vs Blackwell B200/GB200)、精度(BF16 → FP8 → NVFP4)、推理引擎(vLLM vs SGLang vs TRT-LLM)、编排(普通 vs 分离式 vs Dynamo)。

在 Hopper + vLLM 上,一个 120B MoE 跑下来约每百万 token 0.09 美元。在 Blackwell + TRT-LLM + Dynamo 上,同一模型约 0.012 美元——便宜 7 倍。差距一部分来自硬件(Blackwell 单卡 LLM 吞吐是 Hopper 的 11-15 倍),一部分来自软件栈:FP4 权重、MTP 草稿、prefill/decode 分离、NVLink 5 all-to-all 的 MoE 专家通信。

在 NVIDIA 的栈之外无法复制这个结果。这就是权衡所在——可移植性换经济性。本课的目的就是弄清每一项栈选择各自贡献了多大份额的差距。

## 概念

### 为什么 FP8 仍是 KV 缓存的底线

2026 年一个常见错误:以为 NVFP4 可以处处用。不行。KV 缓存需要 FP8(8 位浮点),因为它存的注意力键值跨越很宽的动态范围。把 KV 量化到 FP4 会造成灾难性的精度损失——分布尾部被削掉,注意力分数崩塌。FP8 的指数位恰好给了 KV 缓存所需的范围。

NVFP4(2025-2026)用于权重和激活。微缩放(microscaling):每块权重有自己的缩放因子,小块之间可以覆盖不同的动态范围,避免整张量共用一个缩放因子带来的损失。激活用 FP4 也撑得住,因为单层内激活的范围很小。

典型的 Blackwell 配置:

- 权重:NVFP4(4 位微缩放)。
- 激活:NVFP4。
- KV 缓存:FP8。
- 注意力累加器:FP32(保证 softmax 稳定)。

### TRT-LLM 用到的 Blackwell 专有原语

- **Day-0 FP4 权重**:模型厂商直接发布 FP4 权重;TRT-LLM 无需训练后转换即可加载。FP4 不再需要 AWQ / GPTQ 这一步。
- **多 token 预测(MTP)**:与 EAGLE(第 17 阶段 · 05)同一思路,但集成进了 TRT-LLM 构建。
- **分离式推理**:prefill 和 decode 放在不同 GPU 池,KV 缓存经 NVLink 或 InfiniBand 传输。与 Dynamo(第 17 阶段 · 20)同一思路。
- **All-to-all 通信原语**:NVLink 5 把 MoE 专家通信延迟相比 Hopper 砍了 3 倍。TRT-LLM 的 MoE 内核专门为此调优。
- **NVFP4 + MXFP8 微缩放**:Blackwell Tensor Core 硬件加速的缩放因子处理。

### 该背下来的数字

- HGX B200 通过 TRT-LLM 在 GPT-OSS-120B 上做到 0.02 美元/M token。
- GB200 NVL72 通过 Dynamo(编排 TRT-LLM)做到 0.012 美元/M token。
- H100 + vLLM 在可比负载上约 0.09 美元/M token。
- TRT-LLM 三个月(2026 年)更新带来 2.8 倍吞吐提升。
- Blackwell vs Hopper 单卡 LLM 吞吐 11-15 倍。
- MLPerf Inference v6.0(2026 年 4 月):Blackwell 在所有提交任务上全面领先。

### FP4 在质量上的实际代价

NVFP4 很激进。在重推理负载上(思维链、数学、长上下文代码生成),FP4 权重会出现肉眼可见的退化。按块校准能缓解但无法消除。发推理模型的团队常折中用 FP8 权重 + FP4 激活,或者干脆留在 H200 上全程 FP8。

铁律:承诺用 NVFP4 权重之前,先在你的评测集上验证任务质量。

### 为什么这是一次 NVIDIA 锁定决策

TRT-LLM 是 C++ + CUDA + 闭源内核。模型要为特定 GPU SKU 编译。没有 AMD、没有 Intel、没有 ARM。如果你的基础设施战略是多厂商,TRT-LLM 服务层直接出局——混合硬件上你仍可以用 vLLM 服务。如果你本来就是全 NVIDIA,7 倍差距足以为锁定买单。

### 2026 年实战配方

年度推理账单过一亿美元,还在 Hopper + vLLM 上跑,等于把 7-10 倍留在桌上。把成本大头负载迁到 Blackwell + TRT-LLM + Dynamo。实验层留在 H100 + vLLM 上,保模型迭代速度。每个转 NVFP4 的模型上线前先验证质量。

### 分离式部署的加成

TRT-LLM 的分离式推理(prefill 和 decode 分池)在 第 17 阶段 · 20 有深入讲解。在 Blackwell 上,乘数是叠加的:FP4 权重 × MTP 加速 × 分离式摆放 × 缓存感知路由。7 倍这个数字假设的是完整栈。

```figure
pipeline-parallel
```

## 投入使用

`code/main.py` 计算三种栈下某模型的 HBM 占用、解码吞吐(显存带宽瓶颈区间)和每百万 token 成本:H100 + BF16 + vLLM、H100 + FP8 + vLLM、B200 + NVFP4/FP8 + TRT-LLM。运行它,看复合效应,以及每一步改动各贡献了多大份额。

## 交付

本课产出 `outputs/skill-trtllm-blackwell-advisor.md`。给定负载、模型规模和年度 token 量,它判断 Blackwell + TRT-LLM 这套栈是否值得用 NVIDIA 锁定来换。

## 练习

1. 运行 `code/main.py`。对一个 30% 激活参数的 120B MoE,计算 H100 BF16、H100 FP8、B200 NVFP4/FP8 下显存带宽受限的解码吞吐。最大的一跳来自哪里?
2. 某客户每年在 H100 + vLLM 上花 200 万美元。按 7 倍经济差距,要买多少块 Blackwell GPU 才能让迁移到 TRT-LLM 在 12 个月内回本?
3. 权重转 NVFP4 后 MATH 掉了 3 个点。给出两条恢复路径:一条质量优先(保留 FP8 权重),一条成本优先(用领域内数据校准)。
4. 阅读 MLPerf v6.0 推理结果。哪个任务 Blackwell 对 Hopper 的差距最小?为什么?
5. 计算 405B 模型在 NVFP4 权重 + FP8 KV 缓存、128k 上下文下需要的 HBM。单台 GB200 NVL72 节点装得下吗?

## 关键术语

| 术语 | 别人嘴里的说法 | 实际含义 |
|------|----------------|----------|
| FP8 | "8 位浮点" | 8 位浮点;因动态范围够宽,用于 KV 缓存和注意力 |
| NVFP4 | "4 位微缩放" | NVIDIA 的 4 位微缩放浮点格式;Blackwell 上用于权重和激活 |
| MXFP8 | "MX 8" | 微缩放 FP8 变体;Blackwell Tensor Core 硬件加速 |
| Day-0 FP4 | "直接发 FP4 权重" | 模型厂商发布时权重已是 FP4;免训练后转换 |
| MTP | "多 token 预测" | TRT-LLM 集成的投机解码草稿(见 第 17 阶段 · 05) |
| 分离式推理 | "prefill/decode 拆开" | prefill 和 decode 放在不同 GPU 池;KV 经 NVLink/IB 传输 |
| All-to-all | "MoE 专家通信" | 把 token 路由到专家 GPU 的通信模式;NVLink 5 降 3 倍延迟 |
| InferenceX | "SemiAnalysis 推理基准" | 2026 年行业公认的每 token 成本基准 |

## 延伸阅读

- [NVIDIA — Blackwell Ultra MLPerf Inference v6.0](https://developer.nvidia.com/blog/nvidia-blackwell-ultra-sets-new-inference-records-in-mlperf-debut/) —— 2026 年 4 月 MLPerf 结果。
- [NVIDIA — MoE Inference on Blackwell](https://developer.nvidia.com/blog/delivering-massive-performance-leaps-for-mixture-of-experts-inference-on-nvidia-blackwell/) —— NVLink 5 all-to-all 与 MoE 内核。
- [TensorRT-LLM Overview](https://nvidia.github.io/TensorRT-LLM/overview.html) —— 官方引擎文档。
- [NVIDIA — Introducing Dynamo](https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/) —— TRT-LLM 之上的分离式编排。
- [MLPerf Inference](https://mlcommons.org/benchmarks/inference-datacenter/) —— 发布 Blackwell 数据的基准套件。
