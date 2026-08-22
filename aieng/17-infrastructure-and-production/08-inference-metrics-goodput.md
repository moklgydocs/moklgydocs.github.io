# 推理指标 —— TTFT、TPOT、ITL、Goodput、P99

> 四个指标决定一套推理部署行不行。TTFT 是 prefill 加排队加网络;TPOT(等价于 ITL)是显存带宽瓶颈下每个 token 的解码成本;端到端延迟 = TTFT + TPOT × 输出长度;吞吐量是全集群聚合的每秒 token 数。但对产品真正重要的是 goodput——同时满足所有 SLO 的请求占比。高吞吐配低 goodput,意味着你在处理的 token 根本没能按时到达用户。2026 年 TRT-LLM 上 Llama-3.1-8B-Instruct 的参考数字:平均 TTFT 162 ms,平均 TPOT 7.33 ms,平均端到端 1,093 ms。永远报 P50、P90、P99——别只报均值。还要小心测量陷阱:GenAI-Perf 在算 ITL 时剔除 TTFT,LLMPerf 则包含;同一次运行,两个工具的 TPOT 能对不上。

**类型:** 学习
**编程语言:** Python(标准库,玩具级百分位计算器与 goodput 报告器)
**前置要求:** 第 17 阶段 · 04(推理引擎内部机制)
**预计耗时:** 约 60 分钟

## 学习目标

- 精确定义 TTFT、TPOT、ITL、E2E、吞吐量和 goodput,说出每个指标各自度量哪个环节。
- 解释为什么均值是 LLM 推理的错误统计量,以及如何读 P50/P90/P99。
- 构造一个多约束 SLO(如 TTFT<500 ms 且 TPOT<15 ms 且 E2E<2 s),并据此计算 goodput。
- 说出两个在同一次运行上 TPOT 结果不一致的基准工具,并解释原因。

## 问题

"我们吞吐 15,000 token/s。"所以呢?如果 40% 的请求端到端超过 2 秒,用户早就关掉会话了。单看吞吐,你不知道产品到底行不行。

推理的延迟有多个轴,每个轴的坏法不一样。prefill 是算力瓶颈,随提示词长度增长;decode 是显存带宽瓶颈,随批大小变化;排队延迟是运维问题;网络是物理距离问题。每个环节都需要单独的指标,需要百分位,还需要一个复合指标回答"用户拿到他们期待的体验了吗"——那就是 goodput。

## 概念

### TTFT —— 首 token 时间

`TTFT = queue_time + network_request + prefill_time`

提示词长时 prefill 占主导。H100 上 Llama-3.3-70B FP8,32k 提示词的纯 prefill 约 800 ms。排队时间反映负载下调度器的行为;网络请求是含 TLS 的线上耗时。TTFT 是用户在看到任何流式输出之前所等待的时间。

### TPOT / ITL —— token 间延迟

同一个量的好几个名字。`TPOT`(time per output token)、`ITL`(inter-token latency)、"每 token 解码延迟"——都一样,指首 token 之后相邻两个流式 token 之间的时间。

`TPOT = (decode_forward_time + scheduler_overhead) / tokens_produced`

同一套 Llama-3.3-70B H100 栈、开启 chunked prefill 时,平均 TPOT 约 7 ms。不开 chunked prefill,相邻序列做一次长 prefill 期间,TPOT 能飙到 50 ms。盯 P99,别盯均值。

### 端到端延迟

`E2E = TTFT + TPOT * output_tokens + network_response`

输出长(>500 token)时,E2E 由 TPOT 主导;提示词长而输出短时,E2E 由 TTFT 主导。报 E2E 要按输出长度分层报。

### 吞吐量

`throughput = total_output_tokens / elapsed_time`

聚合指标,告诉你集群效率,不告诉你单个请求的健康度。

### Goodput —— 你真正该关心的指标

`goodput = 满足 (TTFT <= a) 且 (TPOT <= b) 且 (E2E <= c) 的请求占比`

SLO 是多约束的。一个请求只有全部约束都满足才算"好"。goodput 就是这个占比。60% goodput 的高吞吐是失败;99% goodput 的较低吞吐才是目标。

2026 年,goodput 是 MLPerf Inference v6.0 提交结果所用的指标,也是各大 AI 平台内部 SLA 跟踪的指标。

### 为什么均值是错的统计量

LLM 延迟分布是右偏的。一个解码批次里只要有个做长 prefill 的邻居,就可能 500 个 token 的 TPOT 约 7 ms、另外 20 个约 60 ms。平均 TPOT 是 9 ms,P99 TPOT 是 65 ms。用户经常撞上 P99——他们就是这么流失的。

永远报三件套(P50、P90、P99)。优化用户体验,优化的是 P99。

### 参考数字 —— 2026 年 TRT-LLM 上的 Llama-3.1-8B-Instruct

- 平均 TTFT:162 ms
- 平均 TPOT:7.33 ms
- 平均 E2E:1,093 ms
- P99 TPOT:随 chunked-prefill 配置在 10-25 ms 间波动。

这是 NVIDIA 公布的参考点。模型变大(70B 会差 3-5 倍)、硬件换代(H100 vs B200 约 3 倍)、负载变化,数字都会变。

### 测量陷阱

2026 年最常用的两个基准工具,对同一次运行的 TPOT 结论相反:

- **NVIDIA GenAI-Perf**:算 ITL 时剔除 TTFT。ITL 从第 2 个 token 起算。
- **LLMPerf**:包含 TTFT。ITL 从第 1 个 token 起算。

某请求 TTFT 500 ms,100 个输出 token 的解码总耗时 700 ms:GenAI-Perf 报 `ITL = 700/99 = 7.07 ms`,LLMPerf 报 `ITL = 1200/100 = 12.00 ms`。选哪个工具,数字就是哪个。

永远注明用的是哪个工具,永远公布指标定义。

### 构造 SLO

2026 年面向消费者的 70B 聊天模型,一套合理 SLO:

- TTFT P99 <= 800 ms。
- TPOT P99 <= 25 ms。
- E2E P99 <= 3 s(输出 <300 token)。
- goodput 目标 >= 99%。

企业级 SLO 会收紧 TTFT(200-400 ms)、放宽 E2E。重点是把它们写下来,三个都测,把 goodput 当单一复合指标来跟踪。

### 怎么测

- 跑真实流量或足够真实的合成流量(LLMPerf 加 `--mean-input-tokens 800 --stddev-input-tokens 300 --mean-output-tokens 150`)。
- 基准运行目标设为 2 倍峰值并发。
- 跑 30-50 轮,对合并样本取百分位。
- 发布时注明工具名、工具版本、模型、硬件、并发、提示词分布。

```figure
throughput-latency
```

## 投入使用

`code/main.py` 是个玩具级 goodput 计算器。生成合成延迟分布,套一个 SLO,算出 goodput。还会在同一份 trace 上演示 GenAI-Perf 与 LLMPerf 的 TPOT 差异。

## 交付

本课产出 `outputs/skill-slo-goodput-gate.md`。给定负载和 SLO,它产出一份可直接进 CI/CD 的基准配方,用 goodput——而不是吞吐量——做发布门禁。

## 练习

1. 运行 `code/main.py`。生成一个带 1% 尾部尖峰的分布。把 P99 TPOT 从 30 ms 收紧到 15 ms,goodput 怎么变?
2. 某厂商宣称"Llama 3.3 70B H100 上 15,000 tok/s"。信它之前该问哪三个问题?
3. 为什么 chunked prefill 保得住 P99 TPOT,却保不住平均 TPOT?
4. 给语音助手(首 token 是被听到,不是被读到)构造一套消费者 SLO。哪个指标用户感知最强?
5. 阅读 LLMPerf 的 README 和 GenAI-Perf 文档。再找出三个两个工具口径不一致的指标。

## 关键术语

| 术语 | 别人嘴里的说法 | 实际含义 |
|------|----------------|----------|
| TTFT | "首 token 时间" | 排队 + 网络 + prefill;长提示词下 prefill 主导 |
| TPOT | "每输出 token 时间" | 首 token 之后显存带宽瓶颈下单 token 解码成本 |
| ITL | "token 间延迟" | 多数工具里与 TPOT 相同(并非全部——见 GenAI-Perf) |
| E2E | "端到端" | TTFT + TPOT × 输出长度;另加响应侧网络 |
| 吞吐量 | "tok/s" | 集群效率;没有延迟百分位就没有意义 |
| Goodput | "SLO 达标率" | 同时满足所有 SLO 约束的请求占比 |
| P99 | "尾部" | 百里挑一的最差延迟;用户体验指标 |
| SLO 多约束 | "联合约束" | 三个延迟上限的与;任一违反请求即失败 |
| GenAI-Perf vs LLMPerf | "工具陷阱" | 两工具对 ITL 是否含 TTFT 口径相反 |

## 延伸阅读

- [NVIDIA NIM — LLM Benchmarking Metrics](https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html) —— TTFT、ITL、TPOT 的权威定义。
- [Anyscale — LLM Serving Benchmarking Metrics](https://docs.anyscale.com/llm/serving/benchmarking/metrics) —— 另一套定义与测量配方。
- [BentoML — LLM Inference Metrics](https://bentoml.com/llm/inference-optimization/llm-inference-metrics) —— 真实部署上的应用级测量。
- [LLMPerf](https://github.com/ray-project/llmperf) —— 基于 Ray 的开源基准。
- [GenAI-Perf](https://github.com/triton-inference-server/perf_analyzer/blob/main/genai-perf/README.md) —— NVIDIA 的基准工具。
- [MLPerf Inference](https://mlcommons.org/benchmarks/inference-datacenter/) —— 行业公认的、以 goodput 为核心的基准。
