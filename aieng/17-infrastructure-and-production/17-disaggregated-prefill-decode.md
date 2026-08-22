# 分离式 Prefill/Decode —— NVIDIA Dynamo 与 llm-d

> Prefill 是算力瓶颈,decode 是显存带宽瓶颈。同一块 GPU 上跑两样,必有一种资源被浪费。分离式部署把两者拆到不同池子,KV 缓存经 NIXL(RDMA/InfiniBand,TCP 兜底)在池间传输。NVIDIA Dynamo(2025 GTC 发布,1.0 已 GA)架在 vLLM/SGLang/TRT-LLM 之上——Planner Profiler + SLA Planner 自动配比 prefill:decode 以达成 SLO。NVIDIA 公布的吞吐提升大致在这个量级——developer.nvidia.com(2025-06)显示,GB200 NVL72 + Dynamo 上 DeepSeek-R1 MoE 在中等延迟区间有约 6 倍提升;Dynamo 产品页(developer.nvidia.com,未标日期)宣称 GB300 NVL72 + Dynamo 对比 Hopper 最高 50 倍 MoE 吞吐。"30 倍"的说法是社区对"Blackwell 全栈 + Dynamo + DeepSeek-R1"多份报告的聚合;我们没找到明确写着 30 倍的第一手来源,按方向性说法对待即可。llm-d(Red Hat + AWS)是 Kubernetes 原生:prefill / decode / router 各自是独立 Service,按角色配 HPA。llm-d 0.5 新增分层 KV 卸载、缓存感知 LoRA 路由、UCCL 网络、缩容到零。经济账:多份客户披露的内部汇总显示,年推理支出 200 万美元级别的客户,从同置推理切换到 Dynamo 分离式后,在 SLA 不变下省 30-40%(即每年 60-80 万美元);"200 万 → 60-80 万"这个具体数字是内部合成的,不是某一篇公开案例——当数量级锚点用,别当引用文献。短提示词(<512 token、输出也短)不划算,传输成本收不回来。

**类型:** 学习
**编程语言:** Python(标准库,玩具级分离式 vs 同置模拟器)
**前置要求:** 第 17 阶段 · 04(推理引擎内部机制)、第 17 阶段 · 08(推理指标)
**预计耗时:** 约 75 分钟

## 学习目标

- 解释为什么 prefill 和 decode 的最优 GPU 配置不同,并量化同置下的浪费。
- 画出分离式架构:prefill 池、decode 池、NIXL 传输 KV、路由器。
- 说出分离式不划算的条件(短提示词、短输出)。
- 区分 NVIDIA Dynamo(架在栈之上的编排)与 llm-d(Kubernetes 原生),各自匹配到运维场景。

## 问题

你用 8 块 H100 跑 Llama 3.3 70B。负载是长提示词 + 短输出时,GPU 在 decode 阶段闲置——算力大头都花在 prefill 上了。负载换成短提示词 + 长输出,情况反过来。prefill 和 decode 同置,意味着两边都得超配。

预算影响:20-40% 的 GPU 时间浪费在错的资源上。你要么在拿 H100 的算力跑带宽瓶颈的 decode,要么在拿 H100 的 HBM 带宽跑算力瓶颈的 prefill。两种浪费都很贵。

分离式部署按各自的瓶颈给 prefill 和 decode 分池定容。KV 缓存经高带宽互连从 prefill 池传到 decode 池。

## 概念

### 为什么瓶颈不同

**Prefill** —— 对整个输入提示词跑一次前向。矩阵乘占主导,算力瓶颈。H100 FP8 约有 2000 TFLOPS 的有效吞吐。批效率高——一次前向处理很多 token。

**Decode** —— 一次生成一个 token,每轮迭代都要读全部权重。显存带宽瓶颈。HBM3 约 3 TB/s。只有高并发下批效率才好——权重读取要摊到整个批次上。

两者同置:你买的 GPU 得两头兼顾。H100 两样都行,但价格一分不少。规模化之后,你会想让 prefill 池用 H100 这类算力重的卡,decode 池用 H200 这类显存重的卡,或上激进量化。

### 架构

```
            ┌──────────────┐
  Request → │    Router    │ ───────────────────────┐
            └──────┬───────┘                        │
                   │                                │
                   ▼ (prompt only)                  │
            ┌──────────────┐    KV cache    ┌───────▼──────┐
            │ Prefill pool │ ─── NIXL ────► │ Decode pool  │
            │  (compute)   │                │  (memory)    │
            └──────────────┘                └──────┬───────┘
                                                   │ tokens
                                                   ▼
                                                 Client
```

NIXL 是 NVIDIA 的节点间传输层。有 RDMA/InfiniBand 就走 RDMA,否则 TCP 兜底。传输延迟是实打实的——70B FP8 上 4K token 提示词的 KV 缓存,典型 20-80 ms。这就是短提示词不适合分离的原因:传输税超过了省下的部分。

### Dynamo vs llm-d

**NVIDIA Dynamo**(2025 GTC 发布,1.0 已 GA):
- 作为编排层架在 vLLM、SGLang、TRT-LLM 之上。
- Planner Profiler 测量负载,SLA Planner 自动配置 prefill:decode 配比。
- Rust 内核,Python 可扩展。
- 吞吐提升:NVIDIA 报告 GB200 NVL72 + Dynamo 上 DeepSeek-R1 MoE 在中等延迟区间约 6 倍(developer.nvidia.com,2025-06);社区流传的"最高 30 倍"针对 Blackwell + Dynamo + DeepSeek-R1 全栈,缺单一第一手来源,按方向性说法对待。
- GB300 NVL72 + Dynamo:产品页宣称对比 Hopper 最高 50 倍 MoE 吞吐(developer.nvidia.com,未标日期)。

**llm-d**(Red Hat + AWS,Kubernetes 原生):
- prefill / decode / router 各自是独立的 Kubernetes Service。
- 按角色配 HPA,信号用队列深度(prefill)/ KV 利用率(decode)。
- `topologyConstraint packDomain: rack` 把 prefill+decode 小簇装到同一机架,保证 KV 传输带宽。
- llm-d 0.5(2026):分层 KV 卸载、缓存感知 LoRA 路由、UCCL 网络、缩容到零。

想要托管的"栈之上"编排器选 Dynamo;想要 Kubernetes 原生原语、认准 CNCF 生态选 llm-d。

### 经济账

内部合成数据(非单一公开案例——数量级锚点):

- 同置推理年支出 200 万美元。
- 切换到 Dynamo 分离式。
- 请求量不变,P99 延迟 SLA 不变。
- 报告节省:每年 60-80 万美元(降 30-40%)。
- 没加新硬件。

这个数字由多份客户披露合成,不是单一可引用案例;最接近的公开数据点是 Baseten 用 Dynamo KV 路由拿到的 2 倍 TTFT 提速 / 61% 吞吐提升(baseten.co,2025-10),以及 VAST + CoreWeave 在 40-60% KV 命中率下每美元 token 数提升 60-130% 的预测(vastdata.com,2025-12)。节省来自两个池各自定容;prefill 重的负载(8K+ 前缀的 RAG)比均衡负载受益更多。

### 什么时候不要分离

- 提示词 < 512 token 且输出 < 200 token:传输税盖过收益。
- 小集群(< 4 块 GPU):池子分不出多样性。
- 团队运维不了两个按角色扩缩的 GPU 池:Dynamo 有帮助,但并不省心。
- 没有 RDMA 网络:TCP 的传输税更重。

### 路由器与 第 17 阶段 · 11 的衔接

分离式路由器是 KV 缓存感知的(第 17 阶段 · 11)。请求落到持有其前缀的 decode 池——没命中才走 prefill → decode 全流程。命中率和分离式是复合收益——缓存感知路由器决定了一次新 prefill 到底有没有必要发生。

### Blackwell 上的 MoE 才是大数字所在

GB300 NVL72 + Dynamo 展示了对比 Hopper 基线 50 倍的 MoE 吞吐。MoE 专家路由在 prefill 侧算力重、decode 侧显存重(专家缓存),所以分离式是双重收益。2026 年前沿模型推理已是 MoE 主导(DeepSeek-V3、未来的 GPT-5 变体)。

### 该记住的数字

基准数字会漂移——NVIDIA 和推理栈社区每季度都发新结果,引用前复核。

- GB200 NVL72 + Dynamo 上的 DeepSeek-R1:中等延迟区间吞吐约 6 倍于基线(developer.nvidia.com,2025-06);社区"最高 30 倍"说法是没有单一第一手来源的方向性聚合。
- GB300 NVL72 + Dynamo:对比 Hopper 最高 50 倍 MoE 吞吐(developer.nvidia.com,未标日期)。
- 节省锚点(内部合成,非单一案例):年支出 200 万美元、SLA 不变下每年省 60-80 万。
- 分离门槛:提示词 >512 token 且输出 >200 token。
- NIXL 传输 KV:70B FP8、4K 提示词约 20-80 ms。

```figure
prefill-decode-split
```

## 投入使用

`code/main.py` 模拟同置 vs 分离式推理。报告吞吐、单请求成本和提示词长度的临界交叉点。

## 交付

本课产出 `outputs/skill-disaggregation-decider.md`。给定负载和集群,判断是否该做分离。

## 练习

1. 运行 `code/main.py`。提示词多长时分离式开始胜过同置?
2. 为一个 P99 前缀 8K、输出 300 token 的 RAG 服务设计 prefill 池和 decode 池。
3. Dynamo vs llm-d:一家纯 Kubernetes 团队、无 Python 运行时偏好,选哪个?
4. 计算 KV 传输成本:70B FP8 上 4K prefill ≈ 500 MB KV。RDMA 100 GB/s 传输 5 ms,TCP 10 GB/s 要 50 ms。对你的 SLA 哪个要紧?
5. MoE 专家路由改变了 KV 访问模式。对每 token 激活不同专家的 MoE,分离式表现如何?

## 关键术语

| 术语 | 别人嘴里的说法 | 实际含义 |
|------|----------------|----------|
| 分离式推理 | "prefill/decode 拆开" | 两个阶段各自独立的 GPU 池 |
| NIXL | "NVIDIA 传输层" | Dynamo 的节点间 KV 传输(RDMA/TCP) |
| NVIDIA Dynamo | "那个编排器" | 架在 vLLM/SGLang/TRT-LLM 之上的协调器 |
| llm-d | "K8s 原生" | Red Hat + AWS 的 K8s 分离式栈 |
| Planner Profiler | "Dynamo 自动配置" | 测量负载,配置池配比 |
| SLA Planner | "Dynamo 策略" | 自动配比 prefill:decode 以达成 SLO |
| `packDomain: rack` | "llm-d 拓扑" | 把 prefill+decode 装同机架,KV 传输更快 |
| UCCL | "统一集合通信" | llm-d 0.5 的网络层,支持缩容到零 |
| MoE 专家路由 | "每 token 一专家" | DeepSeek-V3 模式;分离式有加成 |

## 延伸阅读

- [NVIDIA — Introducing Dynamo](https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/)
- [NVIDIA — Disaggregated LLM Inference on Kubernetes](https://developer.nvidia.com/blog/deploying-disaggregated-llm-inference-workloads-on-kubernetes/)
- [TensorRT-LLM Disaggregated Serving blog](https://nvidia.github.io/TensorRT-LLM/blogs/tech_blog/blog5_Disaggregated_Serving_in_TensorRT-LLM.html)
- [llm-d GitHub](https://github.com/llm-d/llm-d)
- [llm-d 0.5 release notes](https://github.com/llm-d/llm-d/releases)
