# 流水线并行与气泡分析

> 张量并行把矩阵乘法切到多个 rank 上。流水线并行把模型切到多个 rank 上,一个 rank 一个 stage。微批次在流水线中流动。开头和结尾的空转时间就是气泡;把它降到最小就是这门手艺的全部。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 19 阶段 Track C 第 42-49 课
**预计耗时:** 约 90 分钟

## 学习目标

- 把串行模型切成 N 个 stage,在 N 个 rank 上模拟前向流水线。
- 用 GPipe 调度(先纯前向灌满,再反向)让 M 个微批次流过流水线,并计算气泡占比。
- 与 Megatron-LM 和 PipeDream 使用的交错 1F1B 调度对比气泡。
- 能为 stage 划分辩护:每个 stage 计算量相等比参数量相等更重要。

## 问题

fp16 的 70B 参数模型,光参数就要 140 GB。没有消费级 GPU 装得下。ZeRO-3 把参数分片到各 rank,但每次前向仍需每个 rank allgather 完整层,每层付 log(N) 跳。流水线并行走另一条路:把模型切成 N 个 stage,每个 rank 放一个 stage。第 1 层的前向在 rank 0 完成后,把激活张量交给 rank 1;rank 1 跑第 2 层,交给 rank 2;依此类推。反向沿反方向流。内存线性下降,因为每个 rank 只持一个 stage;计算是串行的,这就是气泡问题。

气泡是流水线开头的空闲时间(等第一个微批次到达最后一个 stage)和结尾的空闲时间(等最后一个微批次反向排干回来)。M 个微批次、N 个 stage 时,每 stage 气泡占比是 (N-1)/(M+N-1)。M=8、N=4 时是 27%;M=64、N=4 时是 4.5%。每步微批次越多,气泡越小,这意味着每个微批次的 batch 更小——这正是驱动微批次设计的约束。

## 概念

```mermaid
flowchart LR
  R0[rank 0: stage 0 / layer 0] --> R1[rank 1: stage 1 / layer 1]
  R1 --> R2[rank 2: stage 2 / layer 2]
  R2 --> R3[rank 3: stage 3 / loss]
  R3 -.backward.-> R2
  R2 -.backward.-> R1
  R1 -.backward.-> R0
```

### GPipe 调度

先用全部 M 个微批次前向灌满流水线,再开始任何反向;然后按反方向反向排干。每个微批次的激活必须保留到它的反向,所以内存随 M 线性增长。前向花 M+N-1 个周期,反向再花 M+N-1 个周期。每 stage 有效工作是 2M 个周期;每 stage 气泡是 2(N-1) 个周期。当前向和反向各花一个单位时间时,气泡占比是 (N-1)/(M+N-1)。选 M 远大于 N 就能藏住气泡。

### 1F1B 调度

交错:一个微批次的前向一到最后 stage,立刻开始它的反向,让它流回去。调度在每个 stage 上交替一次前向一次反向。气泡仍是 N-1,但激活内存以流水线深度为界,而不是以微批次数为界。生产流水线用 1F1B(Megatron、PipeDream)。本课先实现 GPipe,因为它更简单;1F1B 留作练习。

### 为什么每 stage 计算量相等很重要

如果 stage 0 花 50 ms、stage 1 花 100 ms,每个周期都被 stage 1 卡住。其他 stage 每周期空转 50 ms 等 stage 1 释放。参数量相等是错的轴:Transformer 的计算由每层的注意力加 MLP 主导,而嵌入层参数多、计算少。stage 划分应该拉平每 stage 的 FLOPs,而不是每 stage 的权重数。

### 微批次 vs 批次

一条流水线跑 M 个大小为 B 的微批次。有效批次大小是 M*B。流水线 step 结束时的梯度是全部 M*B 个样本上的梯度。气泡占比取决于 M;优化器看到的是 M*B。调 M 是在气泡(M 大则小)与每微批次内存(GPipe 下 M 大则激活内存高)之间做权衡。

```figure
cd-pipeline-bubble
```

## 动手构建

`code/main.py` 实现了:

- `PipelineStage`:一个小 `nn.Module`,持有一个 stage 的参数,暴露 `forward(activation)`。
- `Pipeline(stages, num_microbatches)`:在模拟 stage 上按模拟的逐 stage 墙上时钟编排 GPipe 调度。
- `bubble_fraction(num_stages, num_microbatches)`:闭式公式 (N-1)/(M+N-1)。
- 4 stage 演示,打印逐微批次轨迹和实测气泡占比。

运行:

```bash
python3 code/main.py
```

输出:stage × 微批次甘特图,以及与闭式预测对照的气泡百分比。

## 野外的生产模式

三个模式把流水线并行加固到可交付程度。

**激活检查点与流水线是搭档。** GPipe 下 M 个微批次同时在飞,激活内存是单微批次的 M 倍。激活检查点在反向时重算前向,拿计算换内存;这个组合让流水线对长序列可行。

**stage 均衡靠测量,不靠假设。** 生产团队跑一遍 profiling,在目标硬件上测量真实的逐层计算量(FLOPs 和墙上时钟),再按测量值划分。Megatron-LM 的 `--num-layers-per-stage` 参数接受列表,允许各 stage 每层成本不同时用不均匀的层数。

**收发调度必须避免死锁。** 每个 stage 都先 send 再 recv 的流水线会在线路上死锁。标准修法是交错:偶数 rank 的 stage 先 send 再 recv,奇数 rank 的 stage 先 recv 再 send。本课显式调度各 rank,让这个模式可见。

## 投入使用

生产中的样子:

- **Megatron-LM。** 大规模流水线并行的参考。用 1F1B,支持张量 + 流水线 + 数据并行组合。
- **DeepSpeed Pipeline。** 与 ZeRO 集成;ZeRO-1 + 流水线是最大开源模型的常见组合。
- **PyTorch Pipe。** PyTorch 原生流水线包装,基于 `torch.distributed.pipeline.sync.Pipe`。

## 交付

第 80 课把逐 stage 参数分片存进分片检查点。第 81 课把 DDP + ZeRO + 流水线组合进端到端演示(精神上如此;演示为控制运行时间保持流水线是模拟的)。

## 练习

1. 实现 1F1B,验证气泡占比与 GPipe 相同但激活内存有界。
2. 在更深的模型上 profile 真实的逐 stage 时间,按实测墙上时钟重新均衡 stage。
3. 加流水线微批次上的梯度累积,检查梯度等于等效全批次前向的梯度。
4. 把流水线与激活检查点配对,测量内存下降对计算代价。
5. 把流水线与 DDP 组合(每个流水线 rank 在一个数据并行组内复制),推理这个 2D 调度。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|----------|
| 流水线 | "沿深度的模型并行" | 每 rank 一个 stage,激活逐 stage 流动 |
| 气泡 | "流水线空闲时间" | 开头 + 结尾共 (N-1) 步,部分 stage 没活干 |
| 微批次 | "批次的切片" | 一次前向/反向单元;M 越大气泡越小 |
| GPipe | "先灌后排" | 全部 M 个前向之后才开始反向;激活内存高 |
| 1F1B | "交错调度" | 每 stage 一次前向一次反向;激活内存有界 |

## 延伸阅读

- [Huang et al, GPipe: Efficient Training of Giant Neural Networks](https://arxiv.org/abs/1811.06965)
- [Narayanan et al, PipeDream: Generalized Pipeline Parallelism for DNN Training](https://arxiv.org/abs/1806.03377)
- [Megatron-LM 流水线并行文档](https://github.com/NVIDIA/Megatron-LM)
- 第 19 阶段第 76 课 —— 调度使用的收发原语
- 第 19 阶段第 78 课 —— ZeRO 与流水线正交,常被组合
