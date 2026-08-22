# Serverless LLM 的冷启动缓解

> 一个 20 GB 的模型镜像,从冷到能服务要 5-10 分钟(7B),70B 则要 20 分钟以上。在真正的 serverless 世界里,这不叫预热——这叫故障。缓解手段分布在五层:预置节点镜像(AWS 上的 Bottlerocket,双卷架构)、模型流式加载(NVIDIA Run:ai Model Streamer,vLLM 原生集成)、GPU 显存快照(Modal 检查点,重启最快 10 倍)、热池(`min_workers=1`)、分层加载(ServerlessLLM 的 NVMe→DRAM→HBM 流水线,延迟降 10-200 倍),以及 live migration——搬运输入 token(KB 级)而非 KV 缓存(GB 级)。Modal 公布的冷启动下限是 2-4 秒;Baseten 默认 5-10 秒,预热后亚秒。本课教你测量、做预算、把五层叠起来。

**类型:** 学习
**编程语言:** Python(标准库,玩具级冷启动路径模拟器)
**前置要求:** 第 17 阶段 · 02(推理平台经济学)、第 17 阶段 · 03(GPU 自动扩缩)
**预计耗时:** 约 60 分钟

## 学习目标

- 列举冷启动缓解的五层,每层说出一个工具或模式。
- 把 70B 模型的总冷启动时间算成(节点供给)+(权重下载)+(权重载入 HBM)+(引擎初始化)之和。
- 解释为什么 live migration 传输入 token(KB)而不传 KV 缓存(GB),代价是什么(重新计算)。
- 说出热池的权衡(为闲置 GPU 付费,还是接受冷启动尾延迟),以及 `min_workers > 0` 变成硬要求的 SLA 门槛。

## 问题

你的 serverless LLM 端点夜间缩容到零。早上 8 点流量飙升。第一个请求要等着:

1. Karpenter 供给 GPU 节点:45-60 秒。
2. 容器拉取 30 GB 含权重镜像:120-300 秒。
3. 引擎把权重载入 HBM:45-120 秒,取决于模型大小和存储速度。
4. vLLM 或 TRT-LLM 初始化 CUDA 图、KV 缓存池、分词器:10-30 秒。

合计:220-510 秒(约 3-8 分钟)才吐出第一个 token。而你的 SLA 是 2 秒。你上了热池(`min_workers=1`),问题看似消失——但现在你要为一块 24x7 闲置的 GPU 付费。如果服务有 5 个产品各留一个热副本,就是 5 × 24 × 30 = 每月 3,600 GPU 小时,无论有没有一个用户调用。

冷启动缓解的意义,就是在保住 serverless 经济性的同时,逼近常驻服务的延迟。

## 概念

### 第 1 层 —— 预置节点镜像(Bottlerocket)

AWS 上,Bottlerocket 的双卷架构把 OS 和数据分开。给预拉好容器镜像的数据卷做快照,在 `EC2NodeClass` 里引用快照 ID。新节点启动时权重已在本地 NVMe 上——第 2 步和第 3 步的一部分直接消失。与 Karpenter 原生兼容。大模型每次冷启动通常省 2-4 分钟。

GCP 上的等价物:预烤容器层的自定义 VM 镜像。Azure 上:托管磁盘快照,同一模式。

### 第 2 层 —— 模型流式加载(Run:ai Model Streamer)

不再等整个文件加载完才响应第一个请求,而是把权重逐层流进 GPU 显存,第一个 Transformer 块一就位就开始处理。NVIDIA Run:ai Model Streamer 在 2026 年的 vLLM 中原生集成。支持 S3、GCS 和本地 NVMe。靠 I/O 与计算准备的重叠,大模型权重加载时间大约砍半。

### 第 3 层 —— GPU 显存快照(Modal)

Modal 在首次加载后给 GPU 状态(权重、CUDA 图、KV 缓存区)做检查点。后续重启直接反序列化进 HBM——比重新初始化快 10 倍。这是最接近"2 秒唤醒一块热 GPU"的东西。代价:快照绑定特定 GPU 拓扑,Karpenter 把你迁到别的 SKU 就得重新做检查点。

### 第 4 层 —— 热池(min_workers=1)

最简单的缓解:永远保一个副本就绪。成本是一块 GPU 的小时费率 24x7。这笔账对小模型很残忍(花 0.85-1.50 美元/小时只为躲 30 秒冷启动),对大模型很划算(花 4 美元/小时躲 5 分钟冷启动)。热池变成硬要求的 SLA 门槛:通常是 70B+ 模型上 TTFT P99 < 60 秒。

### 第 5 层 —— 分层加载(ServerlessLLM)

ServerlessLLM 把存储当层级结构用:NVMe(快但容量大)、DRAM(中等但分层)、HBM(最小但即时)。权重预载到 DRAM,按需载入 HBM。论文报告冷加载延迟相比朴素磁盘到 HBM 降 10-200 倍。生产采用尚处早期,但已有与 vLLM 的集成。

### 第 6 层 —— live migration(补充模式)

节点不可用(spot 被回收、节点排空)时,传统做法是冷启动另一个副本并排干请求队列。live migration 则把输入 token(KB 级)搬到已加载模型的目标节点,在目标端重算 KV 缓存。重算比把 GB 级 KV 缓存搬过网络便宜。适用于分离式部署。

### 热池的账

对 P99 TTFT SLA 为 2 秒的服务,问题不是"要不要热池",而是"留几个热副本、给哪些路径留"。

- 高价值交互路径(实时聊天、语音助手):`min_workers=1-2`。
- 后台批处理路径(夜间分类):接受缩到零,容忍 5-10 分钟冷启动。
- 高级租户档:按租户配 `min_workers`,给专属容量。

### 先测量,再优化

70B 模型在全新节点上的冷启动解剖(示意):

| 阶段 | 耗时 | 缓解手段 |
|-------|------|-----------|
| 节点供给 | 50s | Bottlerocket + 预置镜像、热池 |
| 镜像拉取 | 180s | 预置数据卷(直接消除) |
| 权重入 HBM | 75s | 模型流式加载(减半);GPU 快照(消除) |
| 引擎初始化 | 20s | 持久化 CUDA 图缓存 |
| 首次前向 | 3s | 固有延迟下限 |
| **裸冷启动合计** | **328s** | |
| **叠加缓解后** | **约 15s** | 22 倍削减 |

### 该记住的数字

- Modal 冷启动:2-4 秒(用 GPU 快照)。
- Baseten 默认冷启动:5-10 秒;预热后亚秒。
- 70B 裸冷启动:3-8 分钟。
- Run:ai Model Streamer:权重加载约 2 倍提速。
- ServerlessLLM 分层加载:延迟降 10-200 倍(论文数字)。

```figure
cold-start-pipeline
```

## 投入使用

`code/main.py` 建模了有无各层缓解手段时的冷启动路径。报告总冷启动时间、热池成本,以及热池开始回本的那个请求速率临界点。

## 交付

本课产出 `outputs/skill-cold-start-planner.md`。给定 SLA、模型大小和流量形状,选出该叠哪些缓解层。

## 练习

1. 运行 `code/main.py`。算出那个临界请求速率:高于它,留热副本比吃"SLO 掉请求"的冷启动税更便宜。
2. 你部署 13B 模型,P99 TTFT SLA 3 秒。选出能达标的最小缓解栈(层数最少)。
3. Bottlerocket 预置消掉了镜像拉取,但权重仍要从快照读到 HBM。快照后端 NVMe 读速 7 GB/s 时,70B 模型的实际墙钟时间是多少?
4. 你的 serverless 供应商提供 GPU 快照(Modal),但团队拒绝,理由是"快照会泄露 PII"。为正反两方各做论证——真实风险是什么?缓解手段是什么(临时快照、加密、命名空间隔离)?
5. 设计一套分层热池策略:付费用户、试用用户、批处理负载各留几个热副本?把账算出来。

## 关键术语

| 术语 | 别人嘴里的说法 | 实际含义 |
|------|----------------|----------|
| 冷启动 | "那一大段停顿" | 新副本从收到请求到吐出首 token 的时间 |
| 热池 | "常驻下限" | `min_workers >= 1`,至少保一个副本就绪 |
| 预置镜像 | "烤好的 AMI" | 容器权重预先驻留的节点镜像 |
| Bottlerocket | "AWS 节点 OS" | AWS 容器优化 OS,支持双卷快照 |
| 模型流式加载 | "流式加载" | 权重 I/O 与计算准备重叠 |
| GPU 快照 | "HBM 检查点" | 序列化加载后的 GPU 状态;重启时反序列化 |
| 分层加载 | "NVMe + DRAM + HBM" | 存储层级结构;按需加载 |
| Live migration | "搬 token" | 传输入(KB),目标端重算 KV |
| `min_workers` | "热副本" | Serverless 最小保活数 |
| 缩容到零 | "纯 serverless" | 闲置零成本;吃全额冷启动税 |

## 延伸阅读

- [Modal — Cold start performance](https://modal.com/docs/guide/cold-start) —— Modal 公布的基准与检查点架构。
- [AWS Bottlerocket](https://github.com/bottlerocket-os/bottlerocket) —— 预置数据卷快照模式。
- [NVIDIA Run:ai Model Streamer](https://github.com/run-ai/runai-model-streamer) —— 权重加载与计算准备重叠。
- [Baseten — Cold-start mitigation](https://www.baseten.co/blog/cold-start-mitigation/) —— 预热 playbook。
- [ServerlessLLM paper (USENIX OSDI'24)](https://www.usenix.org/conference/osdi24/presentation/fu) —— 分层加载设计。
- [NVIDIA — Disaggregated LLM Inference on Kubernetes](https://developer.nvidia.com/blog/deploying-disaggregated-llm-inference-workloads-on-kubernetes/) —— 分离式部署的 live migration。
