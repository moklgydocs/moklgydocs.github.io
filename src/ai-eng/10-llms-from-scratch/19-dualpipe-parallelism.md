# DualPipe 并行

> DeepSeek-V3 在 2,048 块 H800 GPU 上训练,MoE 专家散布在各节点。跨节点专家 all-to-all 通信,达到了每 1 GPU 小时计算配 1 GPU 小时通信的程度——GPU 有一半时间在闲置。DualPipe(DeepSeek,2024 年 12 月)是一种双向流水线:把前向、反向计算与它们触发的 all-to-all 通信重叠起来。气泡缩小,吞吐上升;而保存两份模型参数(名字里那个 "dual")这件事,在专家并行反正已经把专家摊到各个 rank 之后,代价很轻。本课是"学习"型走读:DualPipe 到底做了什么,以及为什么 Sea AI Lab 的 DualPipeV 改进版能以略大一点的气泡为代价,去掉 2 倍参数成本。

**类型:** 学习
**编程语言:** Python(标准库,调度模拟器)
**前置要求:** 第 10 阶段 · 05(分布式训练、FSDP、DeepSpeed),第 10 阶段 · 14(开放模型架构与 MoE)
**预计耗时:** 约 60 分钟

## 学习目标

- 说出一个 DualPipe 前向—反向 chunk 的四个组成部分,以及为什么每一个都有自己的重叠窗口
- 解释规模化下的流水线气泡问题,以及"无气泡"在实践中(对比营销话术)的真实含义
- 手工追踪 8 个 PP rank、16 个微批次的 DualPipe 调度,确认正向流与反向流互相填满对方的空闲槽
- 陈述 DualPipeV(Sea AI Lab,2025)的权衡:去掉 2 倍参数复制,代价是专家并行未激活时气泡略大

## 问题

在 2,000 块 H800 上训练 671B 的 MoE 模型,会撞上三个互相叠加的瓶颈:

1. **显存压力。** 每块 GPU 持有模型的一片。8k 序列、61 层、128 头,激活显存巨大。
2. **流水线气泡。** 传统流水线并行(GPipe、1F1B)让 GPU 干等自己阶段的输入或梯度。8 个阶段时,即使用 1F1B 调度,也有约 12% 的 GPU 时间是气泡。
3. **跨节点 all-to-all。** 专家并行的 MoE 把专家撒在各节点。每次前向都触发一次把 token 发给专家的 all-to-all,还有一次收回来的。2,000 块 GPU 时,这很容易变成 1:1 的计算通信比。

每一个瓶颈都有单独的解法:梯度检查点治显存,Zero Bubble(Sea AI Lab,2023)治流水线气泡,专家并行通信 kernel 治 all-to-all。DualPipe 做的是让它们协同工作:在同一个前向—反向 chunk 内重叠计算与通信,从流水线两端同时注入微批次,并用这样形成的调度,把 all-to-all 藏进计算窗口里。

报告的结果:流水线气泡接近消除,DeepSeek-V3 的 14.8T token 训练中 GPU 利用率超过 95%。

## 概念

### 流水线并行复习

把 N 层模型切到 P 个设备上。设备 `i` 持有第 `i * N/P .. (i+1) * N/P - 1` 层。一个微批次前向流过设备 0 到 P-1,再反向从 P-1 流回 0。每个设备只有收到上游设备的输出才能开始自己的前向阶段,只有收到下游设备回传的梯度才能开始反向。

GPipe(Huang 等人,2019)一次调度一个微批次,浪费大部分 GPU 时间。1F1B(Narayanan 等人,2021)把多个微批次的前向与反向交错。Zero Bubble(Qi 等人,2023)把反向拆成两半——对输入的反向(B)和对权重的反向(W)——调度它们去填气泡。Zero Bubble 之后,流水线已经很紧了。

DualPipe 是下一步。它再加上两个想法:

### 想法 1:chunk 分解

每个前向 chunk 拆成四个部分:

- **注意力。** Q/K/V 投影、注意力、输出投影。
- **All-to-all 派发。** 把 token 发给各专家的跨节点通信。
- **MLP。** MoE 专家计算。
- **All-to-all 合并。** 把专家输出收回来的跨节点通信。

反向 chunk 则加上每一部分的梯度版本。DualPipe 的调度让 all-to-all 派发与下一个 chunk 的注意力计算并行,all-to-all 合并与再下一个 chunk 的 MLP 计算并行。

### 想法 2:双向调度

大多数流水线调度从 stage 0 注入微批次,流向 stage P-1。DualPipe 从两端同时注入。stage 0 看到从那里出发的正向微批次;stage P-1 也看到从那里出发的正向微批次。两股流在中间相遇。

要做到这一点,设备 `i` 必须同时持有流水线前段的第 `i` 层和后段的第 `P - 1 - i` 层。这就是 DualPipe 的 "dual":每个设备保存它要服务的两份模型层(每个方向一份)。在 DeepSeek-V3 的规模上,这是 2 倍的参数复制成本。之所以付得起,是因为专家并行已经把 MoE 专家摊得极薄——非专家层复制两份,只是小零头。

关键在于:一个方向的前向流和另一个方向的反向流,恰好重叠在单向调度会出现气泡的位置。气泡消失了。

### 手工追踪一次调度

设 P = 4 个 rank,8 个微批次,4 正向 / 4 反向。时间从左到右,行是设备 rank。

```
           Time →
rank 0:  F1 F2 F3 F4  F5R F6R F7R F8R  B1 B2 B3 B4  ...
rank 1:     F1 F2 F3  F4/F5R F6R F7R   B1 B2 ...
rank 2:        F1 F2  F3/F5R F4/F6R    B1 ...
rank 3:           F1  F2/F5R F3/F6R    ...
```

"F4/F5R" 的读法:rank 1 在同一时间槽里,既在跑沿流水线正向(从左到右)的微批次 4 的前向,又在跑反向(从右到左)的微批次 5 的前向。这就是"双向"在操作层面的含义。

rank 2 上两股流更早重叠,rank 0 和 P-1 上最晚。在调度的稳定中段,每个 rank 都在跑"X 方向的前向"与"Y 方向的反向"的重叠。计算是满的:前向的 all-to-all 派发藏进反向计算,all-to-all 合并藏进前向计算。气泡被挤干了。

### 气泡记账

标准 1F1B 的流水线气泡(每个 rank 浪费的时间):

```
bubble_1F1B = (P - 1) * forward_chunk_time
```

Zero Bubble 的改良能压低,但压不到零。DualPipe 在稳定阶段:只要微批次数是流水线深度两倍的倍数,气泡就是零。稳定阶段之外(warmup 和 cooldown),仍有一些气泡,但它不随微批次数增长——这是论文强调的关键性质。

营销话术:"无气泡"。技术语言:气泡不随微批次数增长。Sea AI Lab 的后续分析(DualPipeV / Cut-in-half)显示,只有当专家并行不是瓶颈时才有完全的零气泡;有 EP 驱动的 all-to-all 时,调度上总要做一些妥协。

### DualPipeV——改良版

Sea AI Lab(2025)观察到:当 EP 通信重叠不是重点时,2 倍参数复制是浪费。他们的 DualPipeV 调度把双向注入折成一个跑在单份参数上的 "V 形" 调度。气泡比 DualPipe 略大,但显存节省可观。DeepSeek 在自己开源的 DualPipe 实现中,把 DualPipeV 采纳为"EP 关闭"模式。

权衡一览:

| 特性 | DualPipe | DualPipeV | 1F1B | Zero Bubble |
|---------|---------|-----------|------|------------|
| 每设备参数份数 | 2 | 1 | 1 | 1 |
| 气泡与微批次数 | 恒定 | 小幅增长 | 增长 | 增长 |
| 计算通信重叠 | 完全 | 部分 | 极少 | 部分 |
| 适用场景 | EP 密集型 MoE | 稠密或 EP 轻量 | 基线 | 任何流水线 |

### 对一次 14.8T token 训练意味着什么

DeepSeek-V3 的预训练在 2,048 块 H800 上消耗 14.8T token,约 280 万 GPU 小时。用朴素 1F1B,其中 12–15% 会丢给流水线气泡——34 万到 42 万 GPU 小时,够完整训一个 70B 模型。DualPipe 把大部分找了回来。没有内部日志很难精确量化贡献,但论文声称整个训练平均 GPU 利用率超过 95%。

对更小的训练(1,000 块 GPU 以下),DualPipe 是杀鸡用牛刀——流水线气泡相对总成本更小,稠密模型训练也很少撞上 all-to-all 瓶颈。对数千 GPU 规模的前沿 MoE 训练,它实际上是必需品。

### 它在技术栈中的位置

- 与 **FSDP**(第 10 阶段 · 05)互补。FSDP 跨 rank 切分模型参数,DualPipe 跨 rank 调度计算。两者可组合。
- 兼容 **ZeRO-3** 梯度分片。两份复制的记账需要与 ZeRO 的分片梯度配合。
- 需要为特定集群拓扑调优的**自定义 all-to-all kernel**。DeepSeek 开源的 kernel 是参考实现。

```figure
expert-capacity
```

## 投入使用

`code/main.py` 是一个流水线调度模拟器。输入 `(P, n_micro_batches, schedule)`,打印 1F1B、Zero Bubble、DualPipe、DualPipeV 各自的稳定阶段利用率。它是教学工具——数字与论文的定性结论一致,不代表生产实测加速。

模拟器的价值:换不同的 P 和微批次数跑一跑,看 1F1B 的气泡占比怎么涨,而 DualPipe 不涨。

真实训练的集成注意事项:

- 选一个能整除微批次数的流水线深度。
- 确认你的专家并行网格支持双向 all-to-all。DeepSeek 的 kernel 是参考。
- 第一次接调度,做好烧一周调试时间的准备。记账很琐碎。
- 按 rank 监控 GPU 利用率,不要只看聚合值。DualPipe 的收益来自收紧掉队者。

## 交付

本课会产出 `outputs/skill-dualpipe-planner.md`。给定训练集群规格(GPU 数量、拓扑、互连、模型形状),它推荐流水线并行策略、该用的调度算法,以及目标规模下的预期气泡占比。

## 练习

1. 在 `(P=8, micro_batches=16, schedule=dualpipe)` 和 `(P=8, micro_batches=16, schedule=1f1b)` 上运行 `code/main.py`。计算 GPU 利用率差,并折算成每百万 token 训练找回的 GPU 小时数。

2. 手工画出 `(P=4, micro_batches=8, schedule=dualpipe)` 的调度表。每个时间槽标上微批次 ID 和方向。找出第一个没有气泡的时间槽。

3. 读 DeepSeek-V3 技术报告(arXiv:2412.19437)的图 5。找出 DualPipe 前向 chunk 内 all-to-all 派发的重叠窗口,解释计算调度如何把它藏起来。

4. 分别计算 DualPipe 对 70B 稠密模型(P=8 个流水线阶段)和 671B MoE 模型(P=16 个流水线阶段)的 2 倍参数开销。说明为什么 MoE 情形的开销占比更小(参数大头是专家,已分片到庞大的 EP 组)。

5. 对比 DualPipe 与 Chimera(2021 年的另一个双向调度器)。参照论文第 3.4 节,指出 DualPipe 新增而 Chimera 没有的两个具体性质。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| 流水线气泡(Pipeline bubble) | "每个 rank 的空转时间" | 流水线阶段因等待输入或梯度而浪费的 GPU 周期 |
| 1F1B | "默认流水线调度" | 一前向 / 一反向交错调度;DualPipe 所超越的基线 |
| Zero Bubble | "Sea AI Lab 2023" | 把反向拆成 B(输入梯度)和 W(权重梯度);几乎把流水线完全收紧 |
| DualPipe | "DeepSeek-V3 的调度" | 双向流水线 + 计算通信重叠;气泡不随微批次数增长 |
| DualPipeV | "Cut-in-half" | V 形改良版:去掉 2 倍参数复制,代价是气泡略大 |
| Chunk | "流水线工作单元" | 一个微批次在一个流水线阶段上的一次前向或反向 |
| All-to-all 派发 | "把 token 发给专家" | 把 token 路由给指定 MoE 专家的跨节点通信 |
| All-to-all 合并 | "把专家输出收回来" | MLP 之后收集专家输出的跨节点通信 |
| 专家并行(EP) | "专家摊到各 GPU" | 把 MoE 专家分片到不同 rank,不同 GPU 持有不同专家 |
| 流水线并行(PP) | "层摊到各 GPU" | 把模型层分片到不同 rank;DualPipe 调度的那个维度 |
| 气泡占比(Bubble fraction) | "浪费的 GPU 时间" | 气泡时间 / 总时间;DualPipe 把它压向零的那个分数 |

## 延伸阅读

- [DeepSeek-AI — DeepSeek-V3 Technical Report (arXiv:2412.19437), Section 3.3.2 and Figure 5](https://arxiv.org/abs/2412.19437) ——DualPipe 的第一手参考
- [DeepSeek — DualPipe GitHub repository](https://github.com/deepseek-ai/DualPipe) ——开源参考实现,含 DualPipeV(Cut-in-half)模式
- [Qi et al. — Zero Bubble Pipeline Parallelism (arXiv:2401.10241, Sea AI Lab 2023)](https://arxiv.org/abs/2401.10241) ——前身 Zero Bubble
- [Sea AI Lab — DualPipe could be better without the Dual](https://sail.sea.com/blog/articles/63) ——启发了 DeepSeek"EP 关闭"模式的 DualPipeV 分析
- [Narayanan et al. — PipeDream / 1F1B (arXiv:1806.03377, 2018-2021)](https://arxiv.org/abs/1806.03377) ——DualPipe 所对比的 1F1B 调度
- [Huang et al. — GPipe (arXiv:1811.06965, 2018)](https://arxiv.org/abs/1811.06965) ——流水线并行的原始论文与气泡问题
