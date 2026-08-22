# 生产量化 —— AWQ、GPTQ、GGUF K-quants、FP8、MXFP4/NVFP4

> 量化格式没有通用答案——它是硬件、推理引擎和负载的函数。CPU 和边缘侧归 GGUF Q4_K_M 或 Q5_K_M 管,经 llama.cpp 和 Ollama 交付。要在 vLLM 里给同一底座挂多 LoRA,GPTQ 胜出。AWQ 配 Marlin-AWQ 内核,7B 级模型跑到约 741 tok/s,INT4 里 Pass@1 最好——2026 年数据中心生产的默认选择。FP8 是 Hopper、Ada、Blackwell 上稳妥的中间地带——近乎无损、支持广泛。NVFP4 和 MXFP4(Blackwell 微缩放)激进,需要逐块验证。两个坑经常咬人:校准数据集必须匹配部署领域;KV 缓存与权重量化是两码事——"我的模型现在只有 4 GB"这种话,忘了生产批大小下还有 10-30 GB 的 KV 缓存。

**类型:** 学习
**编程语言:** Python(标准库,玩具级跨格式显存与吞吐对比)
**前置要求:** 第 10 阶段 · 13(量化基础)、第 17 阶段 · 04(推理引擎内部机制)
**预计耗时:** 约 75 分钟

## 学习目标

- 说出 2026 年六种主流量化格式及各自的适用场景。
- 给定硬件(CPU vs GPU、Hopper vs Blackwell)、引擎(vLLM、TRT-LLM、llama.cpp)和负载(日常聊天、推理、多 LoRA),选出格式。
- 计算所选格式省下的权重显存,以及原封不动的 KV 缓存开销。
- 说出会让量化模型在领域流量上掉点的校准数据集陷阱。

## 问题

量化砍的是显存占用和 HBM 带宽,这正是解码阶段最缺的。FP16 的 70B 模型权重 140 GB。权重量化到 INT4(AWQ 或 GPTQ)后只要 35 GB——一张 H100 就装得下,还能给 KV 缓存留地方。这很重要:128 路并发、2k 上下文时,仅 KV 缓存就要 20-30 GB。

但量化不是白来的。激进量化会掉质量,重推理任务上尤其明显。不同格式适配不同引擎,不同硬件原生支持不同精度。2026 年的格式动物园是真实存在的,不能照抄别人的选择——得按自己的栈来选。

## 概念

### 六种格式

| 格式 | 位宽 | 适用场景 | 引擎 |
|------|------|----------|------|
| GGUF Q4_K_M / Q5_K_M | 4-5 | CPU、边缘、笔记本 | llama.cpp、Ollama |
| GPTQ | 4-8 | vLLM 上多 LoRA | vLLM、TGI |
| AWQ | 4 | 数据中心 GPU 生产 | vLLM(Marlin-AWQ)、TGI |
| FP8 | 8 | Hopper/Ada/Blackwell 数据中心 | vLLM、TRT-LLM、SGLang |
| MXFP4 | 4 | Blackwell 多租户 | TRT-LLM |
| NVFP4 | 4 | Blackwell 多租户 | TRT-LLM |

### GGUF —— CPU/边缘默认

GGUF 是文件格式,本身不是某种量化方案——它把 K-quant 各变体(Q2_K、Q3_K_M、Q4_K_M、Q5_K_M、Q6_K、Q8_0)打进一个容器。Q4_K_M 和 Q5_K_M 是生产默认——4-5 位下质量接近 BF16。CPU 或边缘推理的最佳选择,因为 llama.cpp 是目前最快的 CPU 推理引擎,没有之一。

在 vLLM 里的吞吐代价:7B 只有约 93 tok/s——这种格式没为 GPU 内核优化。只有部署目标是 CPU/边缘时才用 GGUF,其他场景别用。

### GPTQ —— vLLM 里的多 LoRA

GPTQ 是带校准过程的训练后量化算法。Marlin 内核让它在 GPU 上很快(相比非 Marlin GPTQ 提速 2.6 倍),7B 约 712 tok/s。

独家优势:GPTQ-Int4 在 vLLM 里支持 LoRA 适配器。如果你要服务一个底座模型加 10-50 个微调变体(每个一个 LoRA),GPTQ 就是那条路。截至 2026 年初,NVFP4 还不支持 LoRA。

### AWQ —— 数据中心 GPU 默认

激活感知权重量化(Activation-aware Weight Quantization)。量化时保护约 1% 最关键权重。Marlin-AWQ 内核:相比朴素实现提速 10.9 倍。7B 约 741 tok/s,INT4 格式中 Pass@1 最好。

新上 GPU 推理,默认选 AWQ——除非你要多 LoRA(选 GPTQ)或激进的 Blackwell FP4(选 NVFP4)。

### FP8 —— 稳妥的中间档

8 位浮点。近乎无损,支持广泛。Hopper Tensor Core 原生加速 FP8,Blackwell 继承。质量不容妥协时(推理、医疗、代码生成),FP8 是 2026 年的安全默认。显存节省只有 INT4 的一半,但质量风险低得多。

### MXFP4 / NVFP4 —— Blackwell 激进派

微缩放 FP4。每块权重有自己的缩放因子。激进,但有 Blackwell Tensor Core 硬件加速。每 token 字节数比 FP8 再减半——这就是 第 17 阶段 · 07 里的经济账。

注意事项:
- 尚不支持 LoRA(2026 年初)。
- 重推理负载上质量下降肉眼可见。
- 每个模型都要在自己的评测集上验证。

### 校准陷阱

AWQ 和 GPTQ 需要校准数据集——通常是 C4 或 WikiText。对领域模型(代码、医疗、法律),用通用网页文本校准,会让算法在"保护哪些权重"上做错决定。HumanEval 的 Pass@1 能掉好几个点。

解法:用领域内数据校准。几百条领域样本通常就够。发布前在评测集上测。

### KV 缓存陷阱

AWQ 把权重压到 4 位,但 KV 缓存是另一回事,仍是 FP16/FP8。70B 模型用 AWQ:

- 权重:约 35 GB(从 140 GB 降到 INT4)。
- KV 缓存:128 并发 × 2k 上下文,约 20 GB。
- 激活:约 5 GB。
- 合计:约 60 GB——H100 80GB 装得下。

天真地想"我把模型量化到 4 GB 了",忘了还有另外 30-50 GB。HBM 预算要整体算。

另外,KV 缓存量化(FP8 KV 或 INT8 KV)是独立选择,有自己的取舍——它直接影响注意力精度,不是白捡的便宜。

### AWQ INT4 对推理任务有硬伤

思维链、数学、长上下文代码生成——这些任务会被激进量化明显拉低。AWQ INT4 在 MATH 上掉约 3-5 个点。重推理负载,就发 FP8 或 BF16,认下显存成本。

### 2026 选型指南

- CPU/边缘推理:GGUF Q4_K_M,不用想。
- GPU 推理、日常聊天、无 LoRA:AWQ。
- GPU 推理、多 LoRA:GPTQ 配 Marlin。
- 推理型负载:FP8。
- Blackwell 数据中心、质量已验证:NVFP4 + FP8 KV。
- 拿不准:每个候选格式跑 1,000 条样本的评测。

```figure
gpu-memory-breakdown
```

## 投入使用

`code/main.py` 对一系列模型规模,计算六种格式的显存占用(权重 + KV + 激活)和相对吞吐。展示 KV 缓存在哪里占主导、权重压缩在哪里划算、FP8 在哪里是安全选择。

## 交付

本课产出 `outputs/skill-quantization-picker.md`。给定硬件、模型规模、负载类型和质量容忍度,选出格式并产出校准/验证计划。

## 练习

1. 运行 `code/main.py`。70B 模型、128 并发、2k 上下文,算每种格式的总 HBM。哪种格式能塞进一张 H100 80GB?
2. 你有一个 7B 代码模型。选个格式并论证。如果质量容忍度判断错了,补救路径是什么?
3. 计算给医疗领域模型做 AWQ 校准需要多大规模的校准数据集。为什么数据不是越多越好?
4. 阅读 Marlin-AWQ 内核论文或发布说明。用三句话解释为什么 AWQ 在 7B 上能到 741 tok/s,而原始 GPTQ 只有约 712。
5. 什么时候该把 AWQ 权重和 FP8 KV 缓存组合使用,而不是让 KV 保持 BF16?

## 关键术语

| 术语 | 别人嘴里的说法 | 实际含义 |
|------|----------------|----------|
| GGUF | "llama.cpp 格式" | 打包 K-quant 各变体的文件格式;CPU/边缘默认 |
| Q4_K_M | "Q4 K M" | 4 位 K-quant medium;GGUF 生产默认 |
| GPTQ | "G P T Q" | 带校准的训练后 INT4;vLLM 里支持 LoRA |
| AWQ | "A W Q" | 激活感知 INT4;Marlin 内核;INT4 中 Pass@1 最好 |
| Marlin 内核 | "快速 INT4 内核" | Hopper 上的定制 INT4 CUDA 内核;10 倍提速 |
| FP8 | "8 位浮点" | Hopper/Ada/Blackwell 上的安全精度默认 |
| MXFP4 / NVFP4 | "微缩放 4 位" | Blackwell 的 4 位浮点,逐块缩放因子 |
| 校准数据集 | "cal data" | 用于确定量化参数的输入文本;必须匹配领域 |
| KV 缓存量化 | "KV INT8" | 与权重独立的选项;直接影响注意力精度 |

## 延伸阅读

- [VRLA Tech — LLM Quantization 2026](https://vrlatech.com/llm-quantization-explained-int4-int8-fp8-awq-and-gptq-in-2026/) —— 对比基准。
- [Jarvis Labs — vLLM Quantization Complete Guide](https://jarvislabs.ai/blog/vllm-quantization-complete-guide-benchmarks) —— 按格式给出吞吐数字。
- [PremAI — GGUF vs AWQ vs GPTQ vs bitsandbytes 2026](https://blog.premai.io/llm-quantization-guide-gguf-vs-awq-vs-gptq-vs-bitsandbytes-compared-2026/) —— 逐格式选型。
- [vLLM docs — Quantization](https://docs.vllm.ai/en/latest/features/quantization/index.html) —— 支持的格式与开关。
- [AWQ paper (arXiv:2306.00978)](https://arxiv.org/abs/2306.00978) —— AWQ 原始论文。
- [GPTQ paper (arXiv:2210.17323)](https://arxiv.org/abs/2210.17323) —— GPTQ 原始论文。
