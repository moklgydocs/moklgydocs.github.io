# 终局项目 14 —— 投机解码推理服务器

> 投机解码——便宜的草稿模型提议 token,目标模型一次前向验证——如今已是生产就绪的优化,而非研究技巧。vLLM 0.7 里的 EAGLE-3 在真实流量上交付 2.5–3 倍吞吐。P-EAGLE(AWS 2026)把并行投机推得更远。SGLang 的 SpecForge 规模化训练草稿头。Red Hat 的 Speculators 中心发布了常见开源模型的对齐草稿。TensorRT-LLM 把投机解码做成了一等公民。2026 年的生产服务栈是:vLLM 或 SGLang 配 EAGLE 家族草稿,FP8 或 INT4 量化,按队列等待做 HPA。本终局项目是把两个开源模型服务到基线吞吐的 2.5 倍以上,并交出完整的尾延迟报告。

**类型:** 终局项目
**编程语言:** Python(服务),C++ / CUDA(内核检视),YAML(配置)
**前置要求:** 第 3 阶段(深度学习)、第 7 阶段(Transformer)、第 10 阶段(从零构建 LLM)、第 17 阶段(基础设施)
**涉及阶段:** P3 · P7 · P10 · P17
**预计耗时:** 30 小时

## 问题

投机解码在 2026 年成了大宗商品。EAGLE-3 草稿头在目标模型的隐状态上训练,一次预测前向 N 个 token;目标模型一遍验证。60–80% 的接受率折算成 2–3 倍端到端吞吐。vLLM 0.7 原生集成。SGLang + SpecForge 给你训练流水线。Red Hat 的 Speculators 发布了 Llama 3.3 70B、Qwen3-Coder-30B MoE、GPT-OSS-120B 的对齐草稿。

手艺在服务运维,不在模型。接受率随流量分布漂移(ShareGPT vs 代码 vs 领域数据)。被拒时的尾延迟比不开投机还糟——所以必须报告多个 batch 档位的 p99,而不能只报稳态 tokens/s。对比 Anthropic / OpenAI API 的每百万 token 成本,是说服力的杠杆。

## 概念

投机解码分两层。**草稿**模型(EAGLE-3 头、ngram,或更小的目标对齐模型)每步提议 k 个候选 token。**目标**模型一遍验证全部 k 个;任何被接受的前缀直接替换贪心路径。接受率取决于草稿与目标的对齐程度,以及输入分布。

EAGLE-3 在多数流量上胜过 ngram 草稿。P-EAGLE 跑并行投机,草稿树更深。代价是:被拒时 p99 延迟更高,因为验证那遍更大。服务配置必须按 batch 大小分桶报告延迟,才能把这层代价暴露出来。

部署用 Kubernetes。vLLM 0.7 每 GPU 或每张量并行分片跑一个副本。HPA 按队列等待而非 CPU 扩缩。FP8(Marlin)与 INT4(AWQ)量化把显存控制在 H100 / H200 的容量内。端到端报告包含:吞吐、接受率、batch 1/8/32 的 p50/p99,以及 $/1M token。

## 架构

```
request ingress
    |
    v
vLLM server (0.7) or SGLang (0.4)
    |
    +-- draft: EAGLE-3 heads | P-EAGLE parallel | ngram fallback
    +-- target: Llama 3.3 70B | Qwen3-Coder-30B | GPT-OSS-120B
    |     quantized FP8-Marlin or INT4-AWQ
    |
    v
verify pass: batch k draft tokens through target
    |
    v (accept prefix; resample for rejected suffix)
    v
token stream back to client
    |
    v
Prometheus metrics: throughput, acceptance rate, queue wait, latency p50/p99
    |
    v
HPA on queue-wait metric
```

## 技术栈

- 服务:vLLM 0.7 或 SGLang 0.4
- 投机方法:EAGLE-3 草稿头、P-EAGLE 并行投机、ngram 兜底
- 草稿训练:SpecForge(SGLang)或 Red Hat Speculators
- 目标模型:Llama 3.3 70B、Qwen3-Coder-30B MoE、GPT-OSS-120B
- 量化:FP8(Marlin)、INT4 AWQ
- 部署:Kubernetes + NVIDIA device plugin;按队列等待指标做 HPA
- 评测:ShareGPT、MT-Bench-v2、GSM8K、HumanEval,度量跨领域接受率
- 参考:TensorRT-LLM 投机解码,作厂商基线

```figure
cf-spec-decode
```

## 动手构建

1. **目标模型准备。** 选 Llama 3.3 70B,用 Marlin 量化到 FP8,在 1 张 H100(或 2 卡张量并行)上部署于 vLLM 0.7。

2. **草稿来源。** 从 Red Hat Speculators 拉一个对齐的 EAGLE-3 草稿头(或用 SpecForge 自己训一个)。加载进 vLLM 的投机解码配置。

3. **基线数字。** 开投机之前:batch 1/8/32 的 tokens/s、p50/p99 延迟、GPU 利用率。发布。

4. **启用 EAGLE-3。** 改配置,重跑同一基准。报告加速比、接受率、p99 尾延迟差值。

5. **P-EAGLE。** 启用并行投机,对比串行 EAGLE-3 度量更深草稿树。报告 P-EAGLE 由帮到害的拐点。

6. **领域流量。** 让 ShareGPT、HumanEval、领域专属流量分别过同一服务器。按分布度量接受率,找出草稿何时漂移。

7. **第二个目标模型。** 同一条流水线跑 Qwen3-Coder-30B MoE。草稿更难(MoE 路由噪声)。报告结果。

8. **K8s HPA。** K8s 部署,HPA 盯 `queue_wait_ms`。演示负载翻三倍时的扩容。

9. **成本对比。** 在同一评测上算 $/1M token,对比 Anthropic Claude Sonnet 4.7 与 OpenAI GPT-5.4。发布。

## 投入使用

```
$ curl https://infer.example.com/v1/chat/completions -d '{"messages":[...]}'
[serve]     vLLM 0.7, Llama 3.3 70B FP8, EAGLE-3 active
[decode]    bs=8, accepted_tokens_per_step=3.2, acceptance_rate=0.76
[latency]   first-token 42ms, full-response 980ms (620 tokens)
[cost]      $0.34 per 1M output tokens at sustained throughput
```

## 交付

`outputs/skill-inference-server.md` 描述交付物:一套带投机解码的实测服务栈、完整基准报告和 K8s 部署。

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | 相对基线的实测加速 | 两个模型在同质量下吞吐 2.5 倍以上 |
| 20 | 真实流量上的接受率 | 按流量分布的接受率报告 |
| 20 | p99 尾延迟纪律 | 有无投机两种情况下 batch 1/8/32 的 p99 |
| 20 | 运维 | K8s 部署、按队列等待的 HPA、平滑滚动发布 |
| 15 | 报告与方法论 | 讲清改了什么、为什么 |
| **100** | | |

## 练习

1. 度量草稿落后目标一个版本时的接受率衰减(如 Llama 3.3 → 3.4 漂移)。配一个监控告警。

2. 实现 ngram 兜底:EAGLE-3 接受率跌破阈值时切到 ngram 草稿。报告可靠性提升。

3. 做一次受控 MoE 实验:同一 Qwen3-Coder-30B,注入与不注入路由噪声对比。度量草稿接受率的敏感度。

4. 扩展到 H200(141 GB)。报告每副本的模型尺寸余量,以及能否不做量化服务 Llama 3.3 70B。

5. 在同一 H100 硬件上基准 TensorRT-LLM 投机解码。报告它相对 vLLM 赢在哪。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| 草稿模型 | "投机器" | 提议 N 个 token 给目标模型验证的小模型 |
| EAGLE-3 | "2026 草稿架构" | 在目标隐状态上训练的草稿头;接受率约 75% |
| P-EAGLE | "并行投机" | 草稿分支成树,目标模型一遍验证 |
| 接受率 | "命中率" | 草稿 token 无需重采样即被接受的比例 |
| 量化 | "FP8 / INT4" | 低精度权重,让 GPU 显存装下更大的模型 |
| 队列等待 | "HPA 指标" | 请求在待处理队列里等到开始推理的时间 |
| Speculators 中心 | "对齐草稿库" | Red Hat Neural Magic 的常见开源模型 EAGLE 草稿中心 |

## 延伸阅读

- [vLLM EAGLE and P-EAGLE documentation](https://docs.vllm.ai) —— 参考服务栈
- [P-EAGLE (AWS 2026)](https://aws.amazon.com/blogs/machine-learning/p-eagle-faster-llm-inference-with-parallel-speculative-decoding-in-vllm/) —— 并行投机解码论文 + 集成
- [SGLang SpecForge](https://github.com/sgl-project/SpecForge) —— 草稿头训练流水线
- [Red Hat Speculators](https://github.com/neuralmagic/speculators) —— 对齐草稿中心
- [TensorRT-LLM speculative decoding](https://nvidia.github.io/TensorRT-LLM/) —— 厂商替代方案
- [Fireworks.ai serving architecture](https://fireworks.ai/blog) —— 商业参考
- [EAGLE-3 paper (arXiv:2503.01840)](https://arxiv.org/abs/2503.01840) —— 方法论文
- [vLLM repository](https://github.com/vllm-project/vllm) —— 代码与基准
