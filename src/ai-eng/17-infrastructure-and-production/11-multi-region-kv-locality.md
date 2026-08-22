# 多区域 LLM 推理与 KV 缓存局部性

> 轮询负载均衡对带缓存的 LLM 推理是有害的。请求如果没落到持有其前缀的节点上,就要付全额 prefill 成本——长提示词下 P50 约 800 ms,而缓存命中只有约 80 ms。2026 年的生产模式是缓存感知路由器(Rust 写的 vLLM Router、llm-d router):消费 KV 缓存事件,按前缀哈希匹配路由。最新研究(GORGO)把跨区域网络延迟显式写进路由目标函数。商业化的"跨区域推理"产品(Bedrock cross-region inference、GKE 多集群网关)把推理当黑盒——它们解决可用性,不解决 TTFT。JPMorgan 和 Mayo Clinic 在 2024 年 11 月的 us-east-1 故障切换演练约 22 分钟。DR 的现实:32% 的 LLM 灾难恢复失败,是因为团队备份了权重却忘了分词器文件或量化配置。

**类型:** 学习
**编程语言:** Python(标准库,玩具级前缀缓存感知路由器模拟器)
**前置要求:** 第 17 阶段 · 04(vLLM 推理)、第 17 阶段 · 06(SGLang RadixAttention)
**预计耗时:** 约 60 分钟

## 学习目标

- 解释为什么轮询负载均衡会破坏缓存推理,并量化 TTFT 代价。
- 画出缓存感知路由器:输入(KV 缓存事件)、算法(前缀哈希匹配)、平局裁决(GPU 利用率)。
- 说出 LLM 灾难恢复失败的 32% 主因(缺分词器文件/量化配置),并给出三件套 DR 清单。
- 区分商业跨区域产品(Bedrock CRI、GKE Multi-Cluster Gateway)与 KV 感知路由。

## 问题

你的服务跑在 us-east-1、us-west-2 和 eu-west-1。前面架一个 ALB,轮询分发。生产环境前缀缓存命中率跌到 8%,TTFT P50 涨了三倍。vLLM 日志显示每个请求都在付全额 prefill 成本。

轮询对无状态服务是最优。LLM 推理天生有状态——KV 缓存编码了模型见过的一切。盲路由就是把请求送进错误的缓存。

另一边,你们团队有 DR 计划。模型权重跨区备份到 S3。区域故障来了,你尝试切换,副本拒绝启动。你忘了 tokenizer.json、量化配置和 RoPE 缩放配置在另一个没同步的桶里。

多区域 LLM 推理是缓存问题、路由问题、DR 卫生问题——不是负载均衡器问题。

## 概念

### 缓存感知路由

请求带着提示词到达。路由器对前缀(比如前 512 个 token)做哈希,问每个副本:"你缓存里有这个前缀吗?"副本在分配和驱逐 KV 块时,往发布/订阅频道上发事件。路由器挑命中的副本;都没命中就退化为按 GPU 利用率裁决。

**vLLM Router**(Rust,2026 生产栈):订阅 `kv.cache.block_added` 事件,维护"前缀哈希 → 副本"索引,O(1) 查找路由。无命中时退化为队列最浅优先。

**llm-d router**:同一模式,Kubernetes 原生,经 ControlPlane API 发布事件。

**SGLang RadixAttention**(第 17 阶段 · 06)是副本内部的等价物。跨副本路由在它的上游。

### 数字

Llama 3.3 70B FP8、H100、2K token 提示词的 TTFT P50:
- 缓存命中(同副本,前缀驻留):约 80 ms。
- 缓存未命中(冷 prefill):约 800 ms。

10 倍差距。如果路由器跨副本能命中 60-80% 的前缀缓存,你就在 N 副本容量下逼近单副本性能。只命中 10%,就退化成朴素扩容。

### 跨区域多一个约束 —— 网络延迟

区域间 RTT:
- us-east-1 ↔ us-west-2:约 65 ms。
- us-east-1 ↔ eu-west-1:约 75 ms。
- us-east-1 ↔ ap-southeast-1:约 220 ms。

如果路由把 us-east-1 的请求送去 ap-southeast-1 吃一个热前缀,省下的 prefill(800 → 80 ms)被 440 ms 往返直接淹没。GORGO(2026 年研究)把这件事显式化——联合最小化 `prefill_time + network_latency`,而不是只看 prefill。多数时候答案是保持区域内路由,除非前缀大到 MB 级、prefill 绝对主导。

### 商业"跨区域推理"帮不上这个忙

AWS Bedrock 跨区域推理会在容量紧张时自动把请求路由到其他区域。它优化的是可用性,不是 TTFT,而且把推理当黑盒。GKE Multi-Cluster Gateway 也一样——服务级故障切换,对 KV 缓存无感知。

即便用了这些产品,你仍然需要应用层的缓存感知路由器。它们管"us-east-1 起火了"这种场面,缓存感知路由管 TTFT。

### DR 卫生 —— 32% 的缺文件问题

2026 年被广泛引用的统计:32% 的 LLM DR 失败,是因为团队备份了权重却忘了:

- `tokenizer.json` 或 `tokenizer.model`
- 量化配置(`quantize_config.json`、AWQ 缩放系数、GPTQ 零点)
- 模型专属配置(RoPE 缩放、注意力掩码、聊天模板)
- 引擎配置(`vllm_config.yaml`、采样默认值、LoRA 适配器清单)

解法是三件套最低 DR 清单:

1. HF 模型仓库下的全部文件(权重 + 配置 + 分词器)。
2. 引擎专属的推理配置。
3. 部署清单(K8s YAML、Dockerfile、依赖锁定文件)。

另外:每季度做一次 DR 演练。JPMorgan 2024 年 11 月的 us-east-1 演练能做到 22 分钟恢复,唯一原因是 playbook 排练过。

### 数据驻留是另一个维度

欧盟客户的 PHI 不能离开欧盟。如果你的缓存感知路由器为了一个前缀命中,把巴黎发起的请求送去 us-east-1,TTFT 赚得再多,GDPR 也已经违反了。先按驻留边界给路由器分区,再谈缓存优化。

### 该记住的数字

- 缓存命中 vs 未命中的 TTFT 差距:约 10 倍(2K 提示词下 80 ms vs 800 ms)。
- 美欧跨区域 RTT:约 75 ms。
- DR 失败:32% 缺分词器/量化配置。
- JPMorgan 2024 年 11 月 us-east-1 切换:22 分钟(SLA 30 分钟)。

```figure
cache-aware-router
```

## 投入使用

`code/main.py` 在多区域负载上模拟三种路由策略(轮询、区域内缓存感知、全局缓存感知)。报告缓存命中率、TTFT P50/P99 和跨区域账单。

## 交付

本课产出 `outputs/skill-multi-region-router.md`。给定区域、驻留约束和 SLA,设计出一份路由方案。

## 练习

1. 运行 `code/main.py`。RTT 75 ms 时,提示词长到多少,跨区域路由开始胜过纯本地路由?
2. 你的缓存命中率从 70% 掉到 12%。给出三个可能原因,以及能证实每个原因的可观测信号。
3. 为一个 AWQ 量化的 70B 模型(vLLM 服务,挂 5 个 LoRA 适配器)设计 DR 清单。列出每一个文件和配置。
4. 论证对 TTFT SLO 严格的金融科技公司,Bedrock 跨区域推理是否"够用"。引用具体行为。
5. 一个巴黎发起的请求命中了 us-east-1 的前缀。路由过去吗?把策略写出来。

## 关键术语

| 术语 | 别人嘴里的说法 | 实际含义 |
|------|----------------|----------|
| 缓存感知路由 | "智能 LB" | 按前缀哈希匹配,路由到持有该 KV 缓存的副本 |
| KV 缓存事件 | "缓存 pub-sub" | 副本发布块的分配/驱逐;路由器建索引 |
| 前缀哈希 | "缓存键" | 前 N 个 token 的哈希,作路由器查找键 |
| GORGO | "跨区域路由研究" | arXiv 2602.11688;把网络延迟写成显式项 |
| 跨区域推理 | "Bedrock CRI" | AWS 产品;可用性切换,不感知 TTFT |
| DR 清单 | "备份列表" | 恢复所需的每一个文件——不只是权重 |
| 数据驻留 | "GDPR 边界" | 用户数据可进入哪个区域的法律约束 |
| RTT | "往返时间" | 网络延迟;美欧 75 ms,美亚太 220 ms |
| LLM 感知 LB | "缓存命中 LB" | 缓存感知路由器作为产品品类 |

## 延伸阅读

- [BentoML — Multi-cloud and cross-region inference](https://bentoml.com/llm/infrastructure-and-operations/multi-cloud-and-cross-region-inference)
- [arXiv — GORGO (2602.11688)](https://arxiv.org/html/2602.11688v1) —— 带网络延迟项的跨区域 KV 缓存复用。
- [TianPan — Multi-Region LLM Serving Cache Locality](https://tianpan.co/blog/2026-04-17-multi-region-llm-serving-data-residency-routing)
- [AWS Bedrock Cross-Region Inference](https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html) —— 可用性切换文档。
- [vLLM Production Stack Router](https://github.com/vllm-project/production-stack) —— 缓存感知路由器源码。
