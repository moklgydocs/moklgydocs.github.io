# 异步与 Hogwild! 推理

> 投机解码(第 10 阶段 · 15)在单条序列内部并行 token;多智能体框架在整条序列之间并行,但要显式协调(投票、子任务拆分)。Hogwild! 推理(Rodionov 等人,arXiv:2504.06261)走的是另一条路:让同一个 LLM 的 N 个实例并行跑,共享同一份 KV 缓存。每个 worker 即时看到其他所有 worker 生成的 token。现代推理模型——QwQ、DeepSeek-R1——能通过这份共享缓存自我协调,无需任何微调。这条路子目前仍是实验性的,但它打开了一条与投机解码正交的、全新的推理并行轴。本课用标准库 Python 实现一个双 worker 的 Hogwild! 模拟器,并解释这种共享缓存协作为什么能从模型已有的推理能力中涌现。

**类型:** 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 10 阶段 · 12(推理优化),第 10 阶段 · 15(投机解码)
**预计耗时:** 约 60 分钟

## 学习目标

- 描述三种常见的并行 LLM 拓扑(投票、子任务、Hogwild!),说出各自瞄准的问题
- 陈述 Hogwild! 的核心设定:多个 worker、一份共享 KV 缓存、通过自提示涌现协调
- 以 worker 数 `N`、任务级并行度 `p`、协调开销 `c` 为参数,计算 Hogwild! 的墙钟加速比
- 在玩具问题上实现双 worker Hogwild! 模拟器,观察涌现的任务分工

## 问题

现代 LLM 靠产出长推理链解决难题——5,000 token 的逐步推演是家常便饭,深数学问题上几万 token 也不稀奇。70B 模型 decode 每秒 35 个 token,50k token 就是 24 分钟。跟"交互式"三个字不沾边。

投机解码(第 10 阶段 · 15)通过序列内并行给你 3–5 倍加速。再往上,自回归解码的串行依赖就是硬天花板:每个新 token 都依赖之前所有 token。

自然要问:能不能跨序列并行?让同一个模型的多个副本跑同一个问题,让它们协作、分工?

已有的工作:投票集成(跑 N 个模型,取多数答案)、思维树(分出多条推理路径再合并)、多智能体框架(每个智能体领一个子任务,配协调器)。这些在特定任务领域都有用,但也都要引入显式的协调机器——投票规则、分支剪枝逻辑、智能体间消息协议。

Hogwild! 推理的做法不同。N 个 worker 共享一份 KV 缓存。每个 worker 即时看到其他 worker 生成的 token,就像那些 token 是自己的上下文一样。worker 们——不经任何训练或微调——自己琢磨出怎么分工。现代推理模型(QwQ、DeepSeek-R1、Claude 系推理模式)能读共享缓存,说出"我看到 2 号 worker 已经处理了基础情形,那我来做归纳步骤"这种话。

截至 2026 年 4 月,加速比取决于负载,且仍是实验性的。但这个想法值得了解,因为它打开了一条推理并行的新轴。

## 概念

### 设定

初始化 N 个 worker 进程,都跑同一个 LLM。不用每 worker 一份 KV 缓存,而是维护一份共享缓存。worker `i` 生成 token `t_j` 时,token 写进共享缓存的下一个位置。worker `k` 走下一步时,读到的是缓存的当前状态——包含所有 N 个 worker 迄今为止生成的一切。

每一步,worker 们抢着写 token。没有按 worker 分的位置索引——缓存就是一条不断增长的序列,顺序由写入到达时间决定。

### 协调为什么能涌现

worker 们共享一个 prompt,大意是:"你是共同处理这个问题的 N 个实例之一。每个实例都能读共享内存,看到其他实例写了什么。避免重复劳动。"prompt 加共享缓存,就够了。推理模型读缓存,注意到问题的哪些部分已经有人试过,然后(常常,但不总是)转向没人碰过的部分。

Hogwild! 论文(Rodionov 等人,2025)报告的观察包括:

- worker 会制定计划,并通过缓存传达给其他 worker。
- worker 会注意到其他 worker 推理中的错误,并指出来。
- 计划失败时,worker 会调整并提出替代方案。
- 被要求检查冗余时,worker 能发现冗余并转向。

这些都不需要微调。涌现行为来自模型已有的推理能力。

### 名字的由来

论文名字是在向 Hogwild! SGD(Recht 等人,2011)致敬——一种异步更新的优化器。类比很直白:Hogwild! SGD 的异步 worker 都往共享参数向量上写;Hogwild! 推理的 worker 都往共享 KV 缓存上写。两者都靠经验收敛,而不是同步保证。

### RoPE 让这一切可行

旋转位置编码(RoPE,Su 等人 2021)通过 Q 和 K 向量的旋转来编码位置。因为位置是旋转而不是烤死的偏移,token 的位置可以平移,而无需重算 KV 缓存项。worker `i` 在位置 `p` 写入共享缓存时,其他 worker 读这个位置可以直接用缓存项——不需要重新旋转。

在学习位置或绝对位置编码的模型上,Hogwild! 每次并发写入都得作废缓存。RoPE 让缓存保持稳定。

### 墙钟的账

设 `T_serial` 为单 worker 独自解题的时间,`p` 为任务级可并行比例,`c` 为每步协调开销(读变长的缓存、决定写什么)。

单 worker 时间:`T_serial`。
N worker Hogwild! 时间(协调免费时):`T_serial * ((1 - p) + p / N)`。经典 Amdahl 定律。
带协调开销:`T_serial * ((1 - p) + p / N) + c * steps_per_worker`。

worker 要有产出,`c` 必须相对单步 decode 时间足够小。推理模型要产 5k+ token 时,worker 负担得起几百 token 的协调开销仍然有赚。短聊天任务上,协调开销占主导,Hogwild! 不如串行。

### 具体例子

推理问题:10k token 思维链。设问题有 `p = 0.7` 的可并行内容(不同证明策略、不同情形分析),`c = 200` token 的每 worker 协调开销。`N = 4` 个 worker:

- 串行时间:10,000 个 decode 步。
- Hogwild! 时间:10000 * (0.3 + 0.7 / 4) + 200 * 4 = 10000 * 0.475 + 800 = 5,550 个 decode 步。
- 加速比:10000 / 5550 = 1.8 倍。

不算惊人。但在更长的推理问题(50k token)上,协调开销被摊薄,加速比能推到 2.5–3 倍。Hogwild! 就是推理界的线程级并行——在一门让多线程代码写起来很自然的语言里。

### 什么时候用 Hogwild!

- 长推理问题(数千 token),任务能拆成相互独立的子目标。
- 训练过逐步思考的推理模型。非推理模型自我协调得不好。
- 单节点部署,显存够装共享缓存加 N 个 worker 进程。缓存是共享的,但每个 worker 有自己的激活显存。

### 什么时候不用

- 短交互聊天。协调开销占主导。
- 无法并行的任务(单一线性证明、单次编译)。N=1 是上限。
- 非推理模型。协调涌现不出来。
- 多节点部署。共享缓存需要极快的跨 worker 同步。节点内没问题,跨节点是延迟灾难。

### 实验性现状

截至 2026 年 4 月,Hogwild! 是一个有开源 PyTorch 实现的研究方法,尚未被生产采用。三个拦路虎:

1. 跨并发进程的共享 KV 缓存管理,工程上并不平凡。
2. 涌现的协调效果因任务而异;基准还在建。
3. 加速比相比投机解码已有的水平不算大;两者可以组合,但组合工程又是新的一层。

值得知道,值得试,还不值得把产品押上去。

```figure
continuous-batching
```

## 动手构建

`code/main.py` 实现一个玩具 Hogwild! 模拟器:

- 两个 worker 进程,各为一个确定性的"LLM",按已知概率产出几类 token 之一(work-token、observe-token、coordinate-token)。
- 一份共享缓存(就是一个 token 列表),两个 worker 都读都写。
- 一个简单的协调逻辑:当 worker 看到对方在某类别下已经产出够多 work token,就换去别的类别。

模拟器跑固定的步数预算,报告:

- 产出的 work-token 总数。
- 总墙钟(worker 步数)。
- 相对单 worker 的有效加速比。
- 每个 token 是哪个 worker 写的追踪记录。

### 第 1 步:共享缓存

一个两个 worker 都往里追加的列表。真实实现里加锁(Python `threading.Lock`);我们用计数器模拟。

### 第 2 步:worker 循环

每个 worker 每一步:

- 读当前共享缓存。
- 根据已有内容决定写哪类 token。
- 写入一个 token。

### 第 3 步:协调启发式

如果类别 X 在缓存里已有 K 个 token,而 worker 本来想写 X,就换成类别 Y。这是推理模型"注意到这已经有人做了,换件事做"行为的玩具替身。

### 第 4 步:测量加速比

同样的总步数预算,分别跑 N=1 和 N=2。数产出的 work-token。由于协调驱动的任务分工,N=2 应大致多产 1.5–1.8 倍。

### 第 5 步:给协调施压

调低协调启发式的灵敏度,再跑。观察:协调不好时,N=2 会重复产出相同的 token,加速比跌破 1。这与论文的观察一致:只有 worker 具备自我协调的推理能力,这个把戏才奏效。

## 投入使用

截至 2026 年 4 月,Hogwild! 的生产集成是研究级的。Yandex/HSE/IST 的参考实现基于 PyTorch,面向 DeepSeek-R1 和 QwQ 模型上的单节点多进程部署。

务实的采用路径:

1. 给你的推理任务负载画像:探索性 token(多种策略、情形分析、搜索)与线性 token 各占多少。
2. 探索性占主导,就跑一次双 worker Hogwild! 实验,测墙钟改善。
3. 改善不到 1.3 倍,说明你处在协调主导区,退回单 worker。
4. 改善超过 1.5 倍,推到 N=4 再测。收益递减通常在 N=4–8 出现。

与投机解码组合:每个 Hogwild! worker 可以各自独立用投机解码。两种加速(大致)相乘——3 倍投机解码乘 1.8 倍 Hogwild!,相对朴素单 worker 解码,有效加速 5.4 倍。

## 交付

本课会产出 `outputs/skill-parallel-inference-router.md`。给定推理负载画像(token 预算、任务并行画像、模型家族、部署目标),它在投票、思维树、多智能体、Hogwild! 和投机解码策略之间做路由。

## 练习

1. 用默认配置运行 `code/main.py`。确认相同墙钟内,N=2 的 Hogwild! 配置比 N=1 基线产出更多 work-token。

2. 调低协调启发式强度(设 `coordination_weight=0.1`),重跑。展示加速比崩塌。解释为什么:无法协调时,worker 做重复功。

3. 计算 50k token 推理任务(`p=0.8, c=500`、N=4)的期望 Hogwild! 加速比;再算 1k token 聊天任务(`p=0.3, c=200`、N=4)。为什么一个赚一个赔?

4. 读 Hogwild! 论文第 4 节(初步评估)。找出作者报告的两种失败模式,并描述更好的协调 prompt 如何分别缓解。

5. 在玩具里组合 Hogwild! 与投机解码:每个 worker 内部用 2 token 的投机解码。报告乘性加速比。当两个 worker 都想扩展同一段共享缓存前缀时,会出现什么记账问题?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| Hogwild! | "并行 worker,共享缓存" | 同一 LLM 的 N 个实例并发运行,共用一份 KV 缓存;通过自提示涌现协调 |
| 共享 KV 缓存 | "协调的媒介" | 一份所有 worker 都读都写的、不断增长的 KV 缓冲;让 token 跨 worker 即时可见 |
| 涌现协调(Emergent coordination) | "不用训练" | 有推理能力的 LLM 能读共享缓存并自行分工,无需微调或显式协议 |
| 协调开销(c) | "花在定向上的 token" | 每个 worker 读变长缓存并决定行动的成本;必须远小于总 decode 时间 |
| 可并行比例(p) | "能并行的部分" | 任务级并行度:总工作量中非本质串行的比例 |
| RoPE 成全 Hogwild! | "旋转位置是平移不变的" | 位置是旋转,写入共享缓存不需要重算之前的 token |
| 投票集成(Voting ensemble) | "跑 N 个取多数" | 最简单的并行推理拓扑;适合分类,不太适合长推理 |
| 思维树(Tree of thought) | "分支再剪枝" | 探索多条分支并剪枝的推理策略;带显式协调逻辑 |
| 多智能体框架 | "派子任务" | 每个智能体领角色,协调器统筹;协议开销重 |

## 延伸阅读

- [Rodionov et al. — Hogwild! Inference: Parallel LLM Generation via Concurrent Attention (arXiv:2504.06261)](https://arxiv.org/abs/2504.06261) ——Hogwild! 论文,在 QwQ 和 DeepSeek-R1 上的初步评估
- [Recht, Re, Wright, Niu — Hogwild!: A Lock-Free Approach to Parallelizing Stochastic Gradient Descent (arXiv:1106.5730, NeurIPS 2011)](https://arxiv.org/abs/1106.5730) ——最初的 Hogwild!,名字出处
- [Su et al. — RoFormer: Enhanced Transformer with Rotary Position Embedding (https://arxiv.org/abs/2104.09864)](https://arxiv.org/abs/2104.09864) ——RoPE,让共享缓存推理可行的那个性质
- [Yao et al. — Tree of Thoughts: Deliberate Problem Solving with Large Language Models (arXiv:2305.10601)](https://arxiv.org/abs/2305.10601) ——思维树推理策略,Hogwild! 与之正交
- [Leviathan et al. — Fast Inference from Transformers via Speculative Decoding (arXiv:2211.17192)](https://arxiv.org/abs/2211.17192) ——投机解码,Hogwild! 可与之组合的序列内并行
- [Hogwild! reference PyTorch implementation](https://github.com/eqimp/hogwild_llm) ——论文实验的唯一事实来源
