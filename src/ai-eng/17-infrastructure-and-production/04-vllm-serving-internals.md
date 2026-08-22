# Serving 引擎内幕 —— PagedAttention、连续批处理、分块 prefill

> 现代 serving 引擎的吞吐,靠的是三个相互成就的默认项,而不是某个单点技巧。PagedAttention 永远开着;连续批处理在 decode 迭代之间把新请求注入活跃批次;分块 prefill 把长提示词切片,让 decode token 永不挨饿。三者全开,一块 H100 SXM5 上的 FP8 Llama 3.3 70B,在 128 并发下能推 2,200–2,400 tok/s——约比 vLLM 自己的默认高 25%,是朴素 PyTorch 循环的 3–4 倍。本课把 vLLM——三项技术的参考引擎——的调度器和注意力内核读到你能画出来的程度,结尾用 `code/main.py` 里的玩具连续批处理器,按 vLLM 的方式调度 prefill 与 decode。

**类型:** 学习
**编程语言:** Python(标准库,玩具连续批处理调度器)
**前置要求:** 第 17 阶段 · 01(模型 serving)、第 11 阶段(LLM 工程)
**预计耗时:** 约 75 分钟

## 学习目标

- 把 PagedAttention 解释为 KV 缓存分配器:块、块表,以及为什么生产负载下碎片率低于 4%。
- 在迭代层面画清连续批处理:完成的序列如何离开批次、新序列如何不放空地加入。
- 一句话说清分块 prefill,并说出它保护的是哪个延迟指标(提示:是 TTFT 尾部,不是平均吞吐)。
- 说出 2026 年 vLLM v0.18.0 那个坑——把所有优化一次全开的团队会被它咬。

## 问题

朴素的 PyTorch serving 循环一次跑一个请求:tokenize、prefill、decode 到 EOS、返回。一个用户时没问题;一百个用户时,就是一排耐心排队的人。显然的修法——静态批处理——把每个请求 padding 到窗口内最长提示词,把每轮 decode padding 到最长预期输出,整个批次被最慢的序列拖住。你为用不到的 padding 付钱,快请求等慢请求。

vLLM 一次解决三个问题:PagedAttention 阻止 KV 缓存碎片像经典连续分配那样吃掉 60–80% 显存;连续批处理让请求在每次 decode 迭代之间进出批次,批次里永远装满真活;分块 prefill 把 32k token 提示词切成约 512 token 的片,与 decode 交错,长提示词不再冻结 GPU 上所有 decode token。

2026 年生产默认是三个全开。你需要懂每个干什么,因为失败模式全在调度器上,不在模型上。

## 概念

### PagedAttention 作为虚拟内存系统

KV 缓存每条序列占 `num_layers × 2 × num_heads × head_dim × seq_len × bytes_per_element`。Llama 3.3 70B 在 8192 token 时,BF16 约每序列 1.25 GB。如果你为每个请求预留 8192 个槽位,而平均请求只用 1500 token,你浪费了预留 HBM 的约 82%。经典批处理就付这份浪费。

PagedAttention 借来 OS 虚拟内存的思想:KV 缓存不按序列连续存放,而是按固定大小的块分配(默认 16 token)。每条序列有一张块表,把逻辑 token 位置映射到物理块 ID。序列长过已分配块时,加一块;结束时,块回池。

碎片率从 60–80%(经典)降到 4% 以下(PagedAttention)。PagedAttention 没有开关——它是 vLLM 唯一的分配器。旋钮是 `--gpu-memory-utilization`(默认 0.9),告诉 vLLM 加载权重和激活后,给 KV 块预留多少 HBM。

### 迭代层面的连续批处理

老式"动态批处理"等一个窗口(比如 10ms)攒满一批,然后跑 prefill + decode + decode……直到所有序列结束。快序列早早完成,干坐着等 GPU 跑完慢的。

连续批处理在每个 decode 步之间操作。把运行中的序列集合叫 `RUNNING` 列表。每次迭代:

1. `RUNNING` 中刚碰到 EOS 或 max_tokens 的序列被移除。
2. 调度器看等待队列:有空闲 KV 块,就接纳新序列(prefill 或恢复的)。
3. 前向传播在当前 `RUNNING` 上跑,每条序列产出一个新 token。

批次大小从不 padding 到固定数;输出进度不同的序列共享一次融合前向。2026 年 vLLM 里这叫 `V1 scheduler`。关键不变量:调度器每次 decode 迭代跑一次,不是每请求一次。

### 分块 prefill 保护 TTFT 尾部

Prefill 是计算受限的。32k token 提示词在单块 H100 上跑 Llama 3.3 70B,纯 prefill 约 800ms。prefill 运行时,批次里其他所有序列的 decode token 都在等。在 serving 循环里,一个长提示词的首 token 延迟(TTFT),会变成几十个其他用户的 token 间延迟(ITL)毛刺。

分块 prefill 把 prefill 切成固定大小的块(默认 512 token),每块作为一个调度单元。块与块之间,调度器可以让 decode 序列前进一个 token。代价是 prefill 绝对延迟略增(每块几 ms),换来 decode 抖动大降。已发表基准中,混合负载下 P99 ITL 从约 50ms 降到约 15ms。

### 三个默认项相互作用

三个特性互为前提。PagedAttention 给调度器一个细粒度 KV 资源可做交易;连续批处理需要这份细粒度,接纳新序列才不用全局重排;分块 prefill 是调度器在同一个 `RUNNING` 列表上做的决定——它只是又一条调度策略,不是独立系统。

你不需要记住每个 flag。你需要知道调度器在优化什么:KV 块预算约束下的 goodput,加分块 prefill 切片。

### 2026 年 v0.18.0 的坑

vLLM v0.18.0 中,`--enable-chunked-prefill` 不能与草稿模型投机解码(`--speculative-model`)同开。文档记载的例外是 V1 调度器里的 N-gram GPU 投机解码。不看发布说明就把 flag 全开的团队,启动时直接吃运行时错误,不是软退化。如果你当初为了投机收益想开分块 prefill,重新考虑——2026 年的正确答案常常是不带分块 prefill 的 EAGLE-3,而不是一个编译不过的"草稿模型 + 分块 prefill"。

### 该记住的数字

- Llama 3.3 70B FP8,H100 SXM5,128 并发,三个全开:2,200–2,400 tok/s。
- 同模型,vLLM 默认(无分块 prefill):约 1,800 tok/s。
- 同模型,朴素 PyTorch 前向循环:约 600 tok/s。
- 生产负载下 PagedAttention 的 KV 碎片浪费:<4%。
- 混合负载 P99 ITL:分块 prefill 约 15ms,无则约 50ms。

### 调度器长什么样

```
while True:
    finished = [s for s in RUNNING if s.is_done()]
    for s in finished: release_blocks(s); RUNNING.remove(s)

    while WAITING and have_free_blocks_for(WAITING[0]):
        s = WAITING.pop(0)
        allocate_initial_blocks(s)
        RUNNING.append(s)

    # schedule prefill chunks + decode in one batch
    batch = []
    for s in RUNNING:
        if s.in_prefill:
            batch.append(next_prefill_chunk(s))   # e.g. 512 tokens
        else:
            batch.append(decode_one_token(s))     # 1 token

    run_forward(batch)                            # one fused GPU call
```

`code/main.py` 就是这个循环的纯标准库 Python 版,用假的 token 数和假的前向延迟。运行它,看分块 prefill 如何在长 prefill 期间保住 decode 序列。

```figure
tensor-parallel
```

## 投入使用

`code/main.py` 模拟一个特性可开关的 vLLM 式调度器。运行它看:

- `NAIVE` 模式:一次一个请求,无批处理。
- `STATIC` 模式:padding 加等待,经典批处理。
- `CONTINUOUS` 模式:迭代级接纳与释放。
- `CONTINUOUS + CHUNKED` 模式:prefill 切片与 decode 交错。

输出显示总吞吐(每虚拟秒 token 数)、TTFT 均值和 P99 ITL。混合流量下 `CONTINUOUS + CHUNKED` 一行应该碾压。

## 交付

本课产出 `outputs/skill-vllm-scheduler-reader.md`。给定 serving 配置(批大小、KV 内存利用率、分块 prefill 大小、投机配置),产出调度器诊断:三个默认项中哪个在卡脖子,该调什么。

## 练习

1. 运行 `code/main.py`。在长短请求混合的负载上对比 `STATIC` 与 `CONTINUOUS`。吞吐差距来自哪——prefill 效率、decode 效率,还是尾延迟?
2. 改造玩具调度器,加 `--max-num-batched-tokens`。H100 跑 FP8 Llama 3.3 70B 时合适的值是多少?(提示:它是 KV 块大小和空闲块数的函数,不是裸 HBM。)
3. 重读 vLLM v0.18.0 发布说明。哪些 flag 组合互斥?列出来。
4. 对 1,000 个请求的轨迹(输出 token 均值 1,500、标准差 600),计算两种分配下的 KV 缓存碎片浪费:(a) 按请求连续分配、上限 8192;(b) PagedAttention、16 token 块。
5. 用一段话解释:为什么分块 prefill 单独看改善 P99 ITL 而不改善吞吐。实践中的吞吐收益来自哪?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| PagedAttention | "KV 技巧" | KV 缓存的固定块分配器;碎片 <4% |
| 块表 | "页表" | 每条序列从逻辑 token 位置到物理 KV 块的映射 |
| 连续批处理 | "动态批处理,但做对了" | 每次 decode 迭代做接纳/释放决策 |
| 分块 prefill | "prefill 切片" | 把长 prefill 切成 512 token 片,与 decode 交错 |
| TTFT | "首 token 时间" | prefill + 排队 + 网络;长提示词时由 prefill 主导 |
| ITL | "token 间延迟" | 相邻 decode token 之间的时间;由批大小主导 |
| Goodput | "满足 SLO 的吞吐" | 每个请求都达到 TTFT 和 ITL 目标时的 token/s |
| V1 scheduler | "新调度器" | vLLM 2026 调度器;N-gram 投机解码是分块 prefill 兼容的路径 |
| `--gpu-memory-utilization` | "显存旋钮" | 权重和激活之后,预留给 KV 块的 HBM 比例 |

## 延伸阅读

- [vLLM 文档 —— 投机解码](https://docs.vllm.ai/en/latest/features/spec_decode/) —— 分块 prefill 与投机解码兼容性的官方来源。
- [vLLM 发布说明(NVIDIA)](https://docs.nvidia.com/deeplearning/frameworks/vllm-release-notes/index.html) —— 2026 发布节奏与版本特定行为。
- [vLLM 博客 —— PagedAttention](https://blog.vllm.ai/2023/06/20/vllm.html) —— 至今仍定义着该如何理解这个分配器的原始文章。
- [PagedAttention 论文(arXiv:2309.06180)](https://arxiv.org/abs/2309.06180) —— 碎片分析与调度器设计。
- [Aleksa Gordic —— Inside vLLM](https://www.aleksagordic.com/blog/vllm) —— 带火焰图的 V1 调度器详细 walkthrough。
