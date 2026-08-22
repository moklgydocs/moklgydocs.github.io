# LLM API 压测 —— 为什么 k6 和 Locust 会说谎

> 传统压测工具不是为流式响应、变长输出、token 级指标和 GPU 饱和设计的。两个坑最常咬人。GIL 陷阱:Locust 的 token 级测量在 Python GIL 下做分词,高并发时分词和请求生成互相抢;分词积压迫使上报的 token 间延迟虚高——瓶颈在你的客户端,不在服务端。提示词同一性陷阱:循环里发同样的提示词,只测了 token 分布的一个点;真实流量长度多变、前缀命中各异。LLMPerf 用 `--mean-input-tokens` + `--stddev-input-tokens` 修这个。2026 年工具地图:LLM 专用(GenAI-Perf、LLMPerf、LLM-Locust、guidellm)保 token 级精度;**k6 v2026.1.0** + **k6 Operator 1.0 GA(2025 年 9 月)** —— 感知流式,经 TestRun/PrivateLoadZone CRD 做 Kubernetes 原生分布式,最适合 CI/CD 门禁;Vegeta 适合 Go 恒定速率打满;Locust 2.43.3 只有配 LLM-Locust 扩展才支持流式。负载模式四种:稳态、爬坡、突刺(测自动扩缩)、浸泡(测内存泄漏)。

**类型:** 动手构建
**编程语言:** Python(标准库,玩具级真实提示词生成器 + 延迟采集器)
**前置要求:** 第 17 阶段 · 08(推理指标)、第 17 阶段 · 03(GPU 自动扩缩)
**预计耗时:** 约 75 分钟

## 学习目标

- 解释让通用压测工具对 LLM API 说谎的两个反模式(GIL 陷阱、提示词同一性陷阱)。
- 按用途选工具:LLMPerf(基准跑分)、k6 + 流式扩展(CI 门禁)、guidellm(大规模合成)、GenAI-Perf(NVIDIA 参考)。
- 设计四种负载模式(稳态、爬坡、突刺、浸泡),说出各自抓什么故障。
- 用输入 token 的均值 + 标准差构建真实提示词分布,而不是固定长度。

## 问题

你用 k6 在 500 并发用户下压了 LLM 端点,扛住了,于是上线。生产上 200 个真实用户就把服务打垮——P99 TTFT 爆掉,GPU 钉死。

两件事发生了。第一,k6 发了 500 个一模一样的提示词——请求合并和前缀缓存让你以为在扛 500 路并发解码,实际只有一路。第二,k6 不按人眼体验的方式跟踪流式响应的 token 间延迟;它看到的是一条 HTTP 连接,不是 500 个间隔不一到达的 token。

LLM 压测是一门独立的手艺。

## 概念

### GIL 陷阱(Locust)

Locust 用 Python,分词跑在客户端 GIL 之下。高并发时分词器排在请求生成后面。上报的 token 间延迟包含了客户端分词积压。你以为服务端慢,其实是测试架子慢。

解法:LLM-Locust 扩展把分词挪到独立进程,或换编译型语言的架子(k6,或用 tokenizers.rs 的 LLMPerf)。

### 提示词同一性陷阱

所有主流压测工具都只让你配一个提示词。一万次循环迭代,每次发的是逐字相同的提示词。服务端每次看到的都是同一前缀——前缀缓存命中率逼近 100%,吞吐漂亮得不像话。

解法:从提示词分布里采样。LLMPerf 用 `--mean-input-tokens 500 --stddev-input-tokens 150`——长度多样,内容多样。

### 四种负载模式

1. **稳态** —— 恒定 RPS 跑 30-60 分钟。抓:基线性能回退。
2. **爬坡** —— 15 分钟内 RPS 从 0 线性升到目标。抓:容量拐点、预热异常。
3. **突刺** —— 突然 3-10 倍 RPS 持续 2 分钟再回落。抓:自动扩缩延迟、队列饱和、冷启动冲击。
4. **浸泡** —— 稳态跑 4-8 小时。抓:内存泄漏、连接池漂移、可观测性溢出。

### 2026 工具地图

**LLMPerf**(Anyscale)—— Python 外壳,Rust 分词。均值/标准差提示词。感知流式。性能跑分的默认选择。

**NVIDIA GenAI-Perf** —— NVIDIA 参考工具,走 Triton 客户端,指标覆盖全面。注意它的 ITL 不含 TTFT;LLMPerf 含。同一台服务器,两个工具给出不同的 TPOT。

**LLM-Locust**(TrueFoundry)—— 修掉 GIL 陷阱的 Locust 扩展。熟悉的 Locust DSL + 流式指标。

**guidellm** —— 大规模合成基准。

**k6 v2026.1.0** + **k6 Operator 1.0 GA(2025 年 9 月)**:
- k6 本体(Go,编译型,无 GIL)新增流式感知指标。
- k6 Operator 用 TestRun / PrivateLoadZone CRD 做 Kubernetes 原生分布式压测。
- 最适合 CI/CD 门禁和 SLA 测试。

**Vegeta** —— Go,比 k6 简单。恒定速率 HTTP 打满。不懂 LLM,但测网关/限流好用。

**原版 Locust 2.43.3** —— 对 LLM 有 GIL 陷阱。只有配 LLM-Locust 扩展才行。

### CI 里的 SLA 门禁

在 PR 上跑 k6:

- 基线 RPS 下各跑 30-50 轮。
- 门禁:TTFT P50/P95、5xx < 5%、TPOT 低于阈值。
- 违约即打断构建。

### 真实提示词分布

有真实流量样本就用真实的;没有用公开分布(聊天用 ShareGPT 提示词,代码用 HumanEval)。把均值 + 标准差喂给 LLMPerf。不惜一切代价避免单提示词循环。

### 该记住的数字

- k6 Operator 1.0 GA:2025 年 9 月。
- k6 v2026.1.0:流式感知指标。
- 典型 LLMPerf 运行:并发 X 下 100-1000 个请求。
- 典型 CI 门禁:每 PR 30-50 轮。
- 四种模式:稳态、爬坡、突刺、浸泡。

```figure
load-pattern-waves
```

## 投入使用

`code/main.py` 用真实提示词分布模拟一次压测,测量有效 TPOT,并演示同一提示词陷阱。

## 交付

本课产出 `outputs/skill-load-test-plan.md`。给定负载和 SLA,选工具并设计四种负载模式。

## 练习

1. 运行 `code/main.py`。对比同一分布 vs 真实分布——差距在哪?
2. 写一个 CI 门禁的 k6 脚本:100 并发下 TTFT P95 < 800 ms,运行 5 分钟。
3. 浸泡测试显示内存每小时涨 50 MB。给出三个可能原因,以及区分它们所需的埋点。
4. 突刺测试从 10 RPS 冲到 100 RPS。有 Karpenter + vLLM production-stack(第 17 阶段 · 03 + 18)时,预期恢复时间多少?
5. 同一台服务器,GenAI-Perf 报 TPOT=6ms,LLMPerf 报 TPOT=11ms。解释。

## 关键术语

| 术语 | 别人嘴里的说法 | 实际含义 |
|------|----------------|----------|
| LLMPerf | "LLM 架子" | Anyscale 基准工具,感知流式 |
| GenAI-Perf | "NVIDIA 工具" | NVIDIA 参考架子 |
| LLM-Locust | "LLM 版 Locust" | 修掉 GIL 陷阱的 Locust 扩展 |
| guidellm | "合成基准" | 大规模合成工具 |
| k6 Operator | "K8s 版 k6" | 基于 CRD 的分布式 k6 |
| GIL 陷阱 | "Python 客户端开销" | 分词积压让上报延迟虚高 |
| 提示词同一性陷阱 | "单提示词谎言" | 循环同提示词全中缓存,吞吐虚高 |
| 稳态 | "恒定负载" | 平 RPS 跑 N 分钟 |
| 爬坡 | "线性上升" | 一段时间内 0 升到目标 |
| 突刺 | "爆发测试" | 突然加倍再回落 |
| 浸泡 | "长跑测试" | 数小时,抓泄漏 |

## 延伸阅读

- [TianPan — Load Testing LLM Applications](https://tianpan.co/blog/2026-03-19-load-testing-llm-applications)
- [PremAI — Load Testing LLMs 2026](https://blog.premai.io/load-testing-llms-tools-metrics-realistic-traffic-simulation-2026/)
- [NVIDIA NIM — Introduction to LLM Inference Benchmarking](https://docs.nvidia.com/nim/large-language-models/1.0.0/benchmarking.html)
- [TrueFoundry — LLM-Locust](https://www.truefoundry.com/blog/llm-locust-a-tool-for-benchmarking-llm-performance)
- [LLMPerf](https://github.com/ray-project/llmperf)
- [k6 Operator](https://github.com/grafana/k6-operator)
