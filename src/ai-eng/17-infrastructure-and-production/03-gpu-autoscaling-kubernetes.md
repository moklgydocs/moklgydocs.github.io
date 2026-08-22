# Kubernetes 上的 GPU 自动伸缩 —— Karpenter、KAI Scheduler、成组调度

> 三层,不是一层。Karpenter 动态供给节点(一分钟内,比 Cluster Autoscaler 快 40%);KAI Scheduler 管成组调度、拓扑感知和层级队列——它防止"7/8 部分分配"陷阱:七个节点干等烧钱,只为缺一块 GPU;应用层自动伸缩器(NVIDIA Dynamo Planner、llm-d Workload Variant Autoscaler)按推理专属信号伸缩——队列深度、KV 缓存利用率——而不是 CPU/DCGM 占空比。经典 HPA 陷阱是:`DCGM_FI_DEV_GPU_UTIL` 是占空比测量,100% 可能是 10 个请求也可能是 100 个;而 vLLM 预分配 KV 缓存内存,内存永远不会触发缩容。本课教你组合三层,并避开默认的 Karpenter `WhenEmptyOrUnderutilized` 策略——它会在推理途中把正在跑的 GPU 任务终止。

**类型:** 学习
**编程语言:** Python(标准库,玩具队列深度自动伸缩模拟器)
**前置要求:** 第 17 阶段 · 02(推理平台经济学)、第 17 阶段 · 04(serving 引擎内幕)
**预计耗时:** 约 75 分钟

## 学习目标

- 画出三层自动伸缩(节点供给、成组调度、应用层),并说出每层的工具。
- 解释为什么 `DCGM_FI_DEV_GPU_UTIL` 对 vLLM 是错误的 HPA 信号,说出两个替代(队列深度、KV 缓存利用率)。
- 描述成组调度,以及 KAI Scheduler 防止的部分分配失败模式(8 块 GPU 闲 7 块)。
- 说出会终止运行中 GPU 任务的 Karpenter 整合策略(`WhenEmptyOrUnderutilized`),以及 2026 年的安全替代。

## 问题

团队在 Kubernetes 上跑 LLM serving 服务。你用 `DCGM_FI_DEV_GPU_UTIL` 作信号配了 HPA。工作时间里服务钉在 100% 利用率,HPA 从不扩容——它已经觉得你满了。你手动加副本,TTFT 降了,HPA 还是不动。这个信号在骗你。

另一头,你用 Cluster Autoscaler 管节点。凌晨 2 点来了个 100 万 token 的提示词,集群花 3 分钟供给节点,请求超时了。

再一头,你部署一个需要跨 2 节点 8 块 GPU 的 70B 模型。集群有 7 块空闲、1 块散在 3 个节点上。Cluster Autoscaler 为那缺失的 1 块供给一个节点,7 个节点干等 4 分钟烧钱,等 Kubernetes 把最后一块 GPU 弄起来。

三层,三种失败模式。2026 年的 GPU 感知自动伸缩,不是"打开 HPA"就完事——是组合节点供给、成组调度和应用信号伸缩。

## 概念

### 第 1 层 —— 节点供给(Karpenter)

Karpenter 盯着 pending pod,约 45–60 秒内供给节点(Cluster Autoscaler 对 GPU 节点通常要 90–120 秒)。它按 `NodePool` 约束动态选实例类型——pod 需要 8 块 H100 而集群没有匹配节点时,Karpenter 直接供给一个,而不是扩容现有组。

**整合陷阱**:Karpenter 默认的 `consolidationPolicy: WhenEmptyOrUnderutilized` 对 GPU 池很危险。它会为把 pod 迁到更便宜的恰配实例,终止正在运行的 GPU 节点。对推理负载,这意味着驱逐进行中的请求、在新节点上重新加载 70B 模型——损失是几分钟的容量加上请求失败。

GPU 池的安全设置:

```yaml
disruption:
  consolidationPolicy: WhenEmpty
  consolidateAfter: 1h
```

让 Karpenter 在一小时后整合真正空着的节点,但永不驱逐运行中的任务。

### 第 2 层 —— 成组调度(KAI Scheduler)

KAI Scheduler(原项目名 "Karp",后改名)处理默认 kube-scheduler 不管的事:

**成组调度** —— 要么全上要么全不上。需要 8 块 GPU 的分布式推理 pod,要么 8 块一起启动,要么都不启动。没有它,就会掉进部分分配陷阱:8 个 pod 起了 7 个,无限干等,烧着钱。

**拓扑感知** —— 知道哪些 GPU 共享 NVLink、哪些同机架、哪些之间有 InfiniBand,按此摆放 pod。DeepSeek-V3 67B 的张量并行负载必须留在同一个 NVLink 域内;KAI Scheduler 尊重这一点。

**层级队列** —— 多个团队竞争同一 GPU 池,带优先级和配额。团队 A 的生产 pinch 只有优先级规则允许时,才会被团队 B 的训练任务抢占。

KAI 作为第二调度器与 kube-scheduler 并排部署,给负载加注解即可使用。Ray 和 vLLM production-stack 都已集成。

### 第 3 层 —— 应用级信号

**HPA 陷阱**:`DCGM_FI_DEV_GPU_UTIL` 是占空比指标——它测的是每个采样间隔 GPU 是否在干活。100% 利用率可能意味着 10 个并发请求,也可能是 100 个——GPU 反正都在忙。按占空比伸缩就是瞎伸缩。

更糟的是,vLLM 这类引擎预分配 KV 缓存内存(直到 `--gpu-memory-utilization`)。只有一个请求时内存占用也接近 90%,基于内存的 HPA 永远不缩容。

**2026 年的替代信号**:

- 队列深度(等待 prefill 的请求数)。
- KV 缓存利用率(已分配给活跃序列的块占比)。
- 逐副本 P99 TTFT(你的 SLA 信号)。
- Goodput(每秒满足全部 SLO 的请求数)。

NVIDIA Dynamo Planner 和 llm-d Workload Variant Autoscaler 消费这些信号来伸缩副本。对 LLM serving,它们完全取代 HPA。

### 何时用什么

| 伸缩决策 | 工具 |
|----------------|------|
| 增删节点 | Karpenter |
| 调度多 GPU 任务 | KAI Scheduler |
| 增删副本 | Dynamo Planner / llm-d WVA(或基于队列深度的自定义 HPA) |
| 选 GPU 类型 | Karpenter NodePool |
| 抢占低优先级 | KAI Scheduler 队列 |

### 分离式 prefill/decode 让一切更复杂

如果跑分离式 prefill/decode(第 17 阶段 · 17),你有两类 pod,伸缩触发器不同:prefill pod 按队列深度伸缩,decode pod 按 KV 缓存压力伸缩。llm-d 把它们暴露为独立的 `Service`,各配各的 HPA。别妄想一个 HPA 管两者。

### 冷启动在这里也要紧

冷启动缓解(第 17 阶段 · 10)是节点供给时间变成用户可见的地方。Karpenter 的 45–60 秒预热 + 20GB 模型加载 + 引擎初始化,意味着从零起来的请求要 2–5 分钟。SLO 关键路径留一个热池(`min_workers=1`),或在应用层用 Modal 式检查点。

### 该记住的数字

- Karpenter 节点供给:约 45–60 秒,vs Cluster Autoscaler 约 90–120 秒(GPU 节点)。
- KAI Scheduler 防止部分分配浪费——7/8 陷阱。
- `DCGM_FI_DEV_GPU_UTIL` 作 HPA 信号:不可用;用队列深度或 KV 利用率。
- Karpenter `WhenEmptyOrUnderutilized`:会终止运行中的 GPU 任务。推理用 `WhenEmpty + consolidateAfter: 1h`。

```figure
autoscaling
```

## 投入使用

`code/main.py` 在突发 GPU 负载上模拟三层自动伸缩。对比朴素 HPA(占空比)、队列深度 HPA 和 KAI 成组调度伸缩。报告未满足请求数、GPU 空转分钟数和一个综合分。

## 交付

本课产出 `outputs/skill-gpu-autoscaler-plan.md`。给定集群拓扑、负载形状和 SLO,设计一份三层自动伸缩方案。

## 练习

1. 运行 `code/main.py`。突发负载下,朴素占空比 HPA 丢了多少队列深度 HPA 能接住的请求?差异从哪来?
2. 为一个在 H100 SXM5 上 serving FP8 Llama 3.3 70B 的集群设计 Karpenter NodePool。指定 `capacity-type`、`disruption.consolidationPolicy`、`consolidateAfter`,以及一个把非 GPU 负载挡在这些节点外的 taint。
3. 团队报告部署卡在 Pending:"GPU 有空但 pod 不调度。"诊断——这是 Karpenter、kube-scheduler 还是 KAI Scheduler 的问题?哪些指标能确认?
4. 为分离式 prefill pod 和 decode pod 各挑一个伸缩信号,并论证。
5. 一个 24x7 生产服务,平均每天 60 起 P99 TTFT > 10s 的丢请求事件。计算 `WhenEmptyOrUnderutilized` 整合陷阱的成本。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| Karpenter | "节点供给器" | Kubernetes 节点自动伸缩器;亚分钟级供给 |
| Cluster Autoscaler | "老的伸缩器" | 上一代 Kubernetes 节点伸缩器;更慢,基于组 |
| KAI Scheduler | "GPU 调度器" | 管成组 + 拓扑 + 队列的第二调度器 |
| 成组调度 | "全有或全无" | N 个 pod 原子性调度,否则全部推迟 |
| 拓扑感知 | "机架感知" | 按 NVLink/IB/机架位置摆放 pod |
| `DCGM_FI_DEV_GPU_UTIL` | "GPU 利用率" | 占空比指标;不是 LLM 的伸缩信号 |
| 队列深度 | "等待中的请求" | prefill 受限伸缩的正确 HPA 信号 |
| KV 缓存利用率 | "显存压力" | decode 受限伸缩的正确 HPA 信号 |
| 整合 | "Karpenter consolidation" | 把节点终止迁到更便宜的实例类型 |
| `WhenEmpty + 1h` | "安全整合" | 不驱逐运行中 GPU 任务的策略 |

## 延伸阅读

- [KAI Scheduler GitHub](https://github.com/kai-scheduler/KAI-Scheduler) —— 设计文档与配置示例。
- [Karpenter Disruption Controls](https://karpenter.sh/docs/concepts/disruption/) —— 整合策略语义与 GPU 安全默认值。
- [NVIDIA —— Kubernetes 上的分离式 LLM 推理](https://developer.nvidia.com/blog/deploying-disaggregated-llm-inference-workloads-on-kubernetes/) —— Dynamo Planner 伸缩信号。
- [Ray 文档 —— RayClusters 的 KAI Scheduler](https://docs.ray.io/en/latest/cluster/kubernetes/k8s-ecosystem/kai-scheduler.html) —— Ray 集成模式。
- [AWS EKS 计算与自动伸缩最佳实践](https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html) —— 托管 Kubernetes 专属指引。
- [llm-d GitHub](https://github.com/llm-d/llm-d) —— Workload Variant Autoscaler 设计。
