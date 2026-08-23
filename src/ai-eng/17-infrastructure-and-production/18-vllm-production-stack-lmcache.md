# 生产推理栈 —— KV 卸载与缓存感知路由

> 生产推理栈把路由器、引擎和可观测性接进一个 Kubernetes 部署——并且把 KV 缓存当作一种可以离开 GPU 的资源。KV 卸载把 KV 缓存挪出 GPU 显存,跨查询、跨引擎复用(先到 CPU DRAM,再到磁盘/Ceph)。vLLM 的 production-stack 是参考部署,LMCache 是卸载层。vLLM 0.11.0 的 KV Offloading Connector(2026 年 1 月)经 Connector API(v0.9.0+ 引入)把卸载做成了异步、可插拔。卸载路径通常对请求路径透明,但缓存未命中和数据晋升(promotion)仍会增加端到端延迟。即使没有共享前缀,LMCache 也有价值——GPU 的 KV 槽位耗尽时,被抢占的请求可以从 CPU 恢复,而不必重算 prefill。已公布的基准(4 台 a3-highgpu-4g 共 16 块 H100,80GB HBM):KV 缓存超过 HBM 时,原生 CPU 卸载和 LMCache 都显著提升吞吐;KV 占用低时,各配置与基线持平,仅有小开销。

**类型:** 学习
**编程语言:** Python(标准库,玩具级 KV 溢出模拟器)
**前置要求:** 第 17 阶段 · 04(推理引擎内部机制)、第 17 阶段 · 06(SGLang/RadixAttention)
**预计耗时:** 约 60 分钟

## 学习目标

- 画出 vLLM production-stack 的分层:路由器、引擎、KV 卸载、可观测性。
- 解释 KV Offloading Connector API(v0.9.0+)以及 0.11.0 的异步路径如何掩盖卸载延迟。
- 量化 LMCache CPU-DRAM 何时有用(KV > HBM)、何时只增开销(KV 装得下 HBM)。
- 按部署约束在原生 vLLM CPU 卸载与 LMCache connector 之间做选择。

## 问题

你的 vLLM 服务在并发一涨时 GPU HBM 就顶到 100%,抢占事件不断。请求被逐出、重排队,同一段 2K token 提示词一分钟内重算了四次 prefill。GPU 算力耗在重复 prefill 上;goodput 远低于账面吞吐。

加 GPU,成本线性上涨;加 HBM,不可能。但 CPU DRAM 便宜——一个插槽 512 GB 起步,延迟比 HBM 差几个数量级,但放"暂时温热"的 KV 缓存完全够用。

LMCache 把 KV 缓存抽到 CPU DRAM:被抢占的请求快速恢复;跨引擎的重复前缀共享缓存,不必每个引擎各自重算 prefill。

## 概念

### vLLM production-stack

`github.com/vllm-project/production-stack` 是参考 Kubernetes 部署:

- **路由器** —— 缓存感知(第 17 阶段 · 11),消费 KV 事件。
- **引擎** —— vLLM worker,每 GPU 一个或每 TP/PP 组一个。
- **KV 缓存卸载** —— LMCache 部署或原生 connector。
- **可观测性** —— Prometheus 抓取、Grafana 看板、OTel 链路。
- **控制面** —— 服务发现、配置、滚动更新。

以 Helm chart + operator 形式交付。

### KV Offloading Connector API(v0.9.0+)

vLLM 0.9.0 引入了可插拔 KV 缓存后端的 Connector API。引擎把 KV 块卸载给 connector;connector 负责存(RAM、磁盘、对象存储、LMCache)。请求需要某块时,connector 再载回。

vLLM 0.11.0(2026 年 1 月)新增异步卸载路径——卸载在后台发生,常见情况下引擎不阻塞。端到端延迟和吞吐仍取决于负载形状、KV 命中率和系统压力;vLLM 自己的说明也指出:自定义内核卸载在低命中率下会拖累吞吐,且异步调度与投机解码存在已知的交互问题。

### 原生 CPU 卸载 vs LMCache

**原生 vLLM CPU 卸载**:引擎本地。KV 块存本机 RAM。实现快,零网络跳。不跨引擎。

**LMCache connector**:集群级。块存到共享 LMCache 服务(CPU DRAM + Ceph/S3 层),任何引擎都能访问。有 16 块 H100 的公开基准。

单引擎 HBM 吃紧选原生;多引擎共享前缀(共享系统提示词的 RAG、共享模板的多租户)选 LMCache。

### 基准表现

16 块 H100(80 GB HBM)分布在 4 台 a3-highgpu-4g 的测试:

- KV 占用低(短提示词、低并发):各配置与基线持平,LMCache 多约 3-5% 开销。
- 中等占用:LMCache 在跨引擎前缀复用上开始见效。
- KV 超过 HBM:原生 CPU 卸载和 LMCache 都显著提升吞吐;LMCache 因跨引擎共享收益更大。

### LMCache 起决定性作用的场景

- 多租户推理,系统提示词跨租户共享。
- RAG,文档块跨查询重复。
- 同一底座上的微调变体(LoRA),底座模型 KV 复用砍掉重复劳动。
- 抢占频繁的负载:从 CPU 恢复比重算 prefill 便宜。

### 什么时候不要开

- HBM 压力小——白付开销,没有收益。
- 短上下文(<1K token)——传输时间 > 重算 prefill。
- 单租户单提示词负载——没有可复用的东西。

### 与分离式推理的组合

第 17 阶段 · 17 的分离式推理 + LMCache 是复合收益:prefill 池传给 decode 池的 KV,没被用上的落进 LMCache;后续查询直接从 LMCache 拉。第 17 阶段 · 11 的缓存感知路由器可以把请求路由到本地缓存或 LMCache 共享缓存命中的那个引擎。

### 该记住的数字

- vLLM 0.9.0:Connector API 发布。
- vLLM 0.11.0(2026 年 1 月):异步卸载路径;端到端延迟影响取决于负载、KV 命中率和系统压力(不是绝对保证)。
- 16 块 H100 基准:KV 占用超过 HBM 时 LMCache 见效。
- HBM 压力小时:3-5% 纯开销。

```figure
zero-sharding
```

## 投入使用

`code/main.py` 模拟一个抢占频繁的负载,对比有无 LMCache。报告避免的 prefill 重算次数、吞吐提升和盈亏平衡的 HBM 利用率。

## 交付

本课产出 `outputs/skill-vllm-stack-decider.md`。给定负载形状和 vLLM 部署,在原生 / LMCache / 都不用之间做决策。

## 练习

1. 运行 `code/main.py`。HBM 利用率到多少时 LMCache 开始划算?
2. 某租户共享 6K token 系统提示词,每小时 200 次查询。算每租户的预期 LMCache 节省。
3. LMCache 服务是单点。设计高可用策略(副本、降级到原生)。
4. LMCache 落 Ceph 机械盘。70B FP8 上 4K token 的 KV(500 MB),读取耗时 vs 重算 prefill,各是多少?
5. 论证 vLLM 0.11.0 异步路径是否"免费"——开销藏在哪里?

## 关键术语

| 术语 | 别人嘴里的说法 | 实际含义 |
|------|----------------|----------|
| Production-stack | "参考部署" | vLLM 的 Kubernetes Helm chart + operator |
| Connector API | "KV 后端接口" | vLLM 0.9.0+ 可插拔 KV 存储接口 |
| 原生 CPU 卸载 | "引擎本地溢出" | KV 存同一引擎所在主机的 RAM |
| LMCache | "集群 KV 缓存" | 跨引擎 KV 缓存服务,CPU DRAM + 磁盘 |
| 0.11.0 异步 | "非阻塞卸载" | 卸载藏在引擎流后面 |
| 抢占 | "腾地方" | HBM 满时的 KV 缓存搬移 |
| 前缀复用 | "同一系统提示词" | 多查询共享开头;缓存命中 |
| Ceph 层 | "磁盘层" | 缓存层级中 DRAM 之下的持久存储 |

## 延伸阅读

- [vLLM Blog — KV Offloading Connector (Jan 2026)](https://blog.vllm.ai/2026/01/08/kv-offloading-connector.html)
- [vLLM Production Stack GitHub](https://github.com/vllm-project/production-stack) —— Helm chart + operator。
- [LMCache for Enterprise-Scale LLM Inference (arXiv:2510.09665)](https://arxiv.org/html/2510.09665v2)
- [LMCache GitHub](https://github.com/LMCache/LMCache) —— Connector 实现。
- [vLLM 0.11.0 release notes](https://github.com/vllm-project/vllm/releases) —— 异步路径细节。
