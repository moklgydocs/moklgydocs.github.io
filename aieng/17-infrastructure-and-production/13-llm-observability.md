# LLM 可观测性技术栈选型

> 2026 年的可观测性市场分两类。开发平台(LangSmith、Langfuse、Comet Opik)把监控和评测、提示词管理、会话回放打包在一起;网关/埋点工具(Helicone、SigNoz、OpenLLMetry、Phoenix)专注遥测。Langfuse 核心 MIT 许可,开源与商业平衡得好(云免费额度每月 5 万事件)。Phoenix 是 OpenTelemetry 原生,Elastic License 2.0——漂移/RAG 可视化出色,但不是持久的生产后端。Arize AX 用零拷贝 Iceberg/Parquet 集成,宣称比单体可观测性便宜 100 倍。LangSmith 在 LangChain/LangGraph 栈上领先,每用户每月 39 美元,仅企业版可自托管。Helicone 走代理模式,15-30 分钟接入,每月 10 万请求免费,但智能体链路深度不足。常见生产组合:网关(Helicone/Portkey)+ 评测平台(Phoenix/TruLens),用 OpenTelemetry 粘合。

**类型:** 学习
**编程语言:** Python(标准库,玩具级链路采样模拟器)
**前置要求:** 第 17 阶段 · 08(推理指标)、第 14 阶段(智能体工程)
**预计耗时:** 约 60 分钟

## 学习目标

- 区分开发平台(打包评测 + 提示词 + 会话)与网关/遥测工具(只做链路 + 指标)。
- 把六个主流工具(Langfuse、LangSmith、Phoenix、Arize AX、Helicone、Opik)对应到各自的许可、定价和最适用场景。
- 解释 OpenTelemetry 粘合模式:如何让网关工具与独立评测平台组合使用。
- 说出 2026 年的成本差异点(Arize AX 零拷贝 vs 单体摄取)和约 100 倍的倍数关系。

## 问题

你上线了一个 LLM 功能,能跑。但提示词失败、工具死循环、延迟回退、成本尖峰、提示词缓存命中率——你一概看不见。搜"LLM 可观测性",出来八个工具,都声称解决同一个问题,价位却分三档。

它们解决的并不是同一个问题。LangSmith 回答"这次 LangGraph 运行为何失败";Phoenix 回答"我的 RAG 流水线漂移了吗";Helicone 回答"哪个应用在烧 token";Langfuse 回答"整个东西能不能自托管"。工具不同,受众不同。

选型看四个轴:技术栈(LangChain?裸 SDK?多厂商?)、许可容忍度(只接受 MIT?Elastic 可以?商业也行?)、预算(免费档?每月 100 美元?1000 美元?)、自托管(必须?加分项?绝不?)。

## 概念

### 两大类别

**开发平台**:把可观测性和评测、提示词管理、数据集版本、会话回放打包。你跑实验、看哪个提示词有效、拿新提示词对旧赢家做数据集回归。代表:LangSmith、Langfuse、Comet Opik。

**网关/遥测工具**:给推理调用做埋点——提示词、响应、token、延迟、模型、成本。代表:Helicone、SigNoz、OpenLLMetry、Phoenix。极简,可以经 OpenTelemetry 与独立评测工具组合。

### Langfuse —— 开源平衡派

- 核心 Apache / MIT 许可;Docker 自托管。
- 云免费档:每月 5 万事件。付费:团队版每月 29 美元。
- 评测、提示词管理、链路、数据集,四个开发平台特性覆盖均衡。
- 适用:想要 LangSmith 级功能,但必须自托管或留在开源许可内。

### Phoenix(Arize)—— 遥测优先,OpenTelemetry 原生

- Elastic License 2.0;自托管极简单。
- RAG 和漂移可视化出色,嵌入空间散点图是一等公民。
- 并非按持久生产后端设计——主要面向开发期可观测性。
- 适用:RAG 流水线开发、漂移调试,生产侧另配网关。

### Arize AX —— 规模派

- 商业。经 Iceberg/Parquet 做零拷贝数据湖集成。
- 宣称规模化下比单体可观测性(Datadog 级)便宜约 100 倍。账是这么算的:链路数据存你自己 S3 上的 Parquet,Arize 直接读。
- 适用:每天千万级以上链路、已有数据湖、想要 LLM 专属看板又不想付 Datadog 的价。

### LangSmith —— LangChain/LangGraph 优先

- 商业,每用户每月 39 美元。仅企业版可自托管。
- LangChain 和 LangGraph 栈上最强。不用这两家,吸引力就打折。
- 适用:团队认准 LangChain,愿意付费。

### Helicone —— 代理模式的最低可行方案

- 把 `OPENAI_API_BASE` 换成 Helicone 代理,15-30 分钟接完。
- MIT 许可;每月 10 万请求免费,付费 20 美元/月起。
- 自带故障切换、缓存、限流——顺带当了网关。
- 智能体/多步链路深度不足。
- 适用:快速起步、单一栈应用,网关 + 可观测性合一。

### Opik(Comet)—— 开源开发平台

- Apache 2.0,全开源。
- 功能集与 Langfuse 相近,出身 Comet。
- 适用:已在用 Comet 的 ML 团队,想在同一面板里看 LLM 可观测性。

### SigNoz —— OpenTelemetry 优先的全栈 APM

- Apache 2.0。通用 APM + 经 OpenTelemetry 接 LLM。
- 适用:想把服务与 LLM 调用统一在一套可观测性里。

### 粘合层:OpenTelemetry + GenAI 语义约定

OpenTelemetry 在 2025 年底发布了 GenAI 语义约定(`gen_ai.system`、`gen_ai.request.model`、`gen_ai.usage.input_tokens`)。消费 OTel 的工具之间可以互通。正在成形的生产模式:

1. 每次 LLM 调用都按 GenAI 约定发 OTel 数据。
2. 日常流量进网关(Helicone / Portkey)。
3. 同时双发一份到评测平台(Phoenix / Langfuse)做回归。
4. 归档进数据湖(Iceberg),用 Arize AX 或 DuckDB 做长期分析。

### 陷阱:埋点埋错了层

在智能体框架内部埋点(比如加 LangSmith 链路)就把你和框架绑死了。在 HTTP/OpenAI SDK 层埋点(经 OpenLLMetry 或网关)则可移植。

### 采样 —— 不可能全留

每天百万请求以上,全量链路留存的成本会超过 LLM 调用本身。按规则采样:错误 100%、高成本 100%、成功 5%。聚合指标永远全留,原始链路只留长尾。

### 该记住的数字

- Langfuse 云免费档:每月 5 万事件。
- LangSmith:每用户每月 39 美元。
- Helicone 免费档:每月 10 万请求。
- Arize AX 宣称:规模化下比单体便宜约 100 倍。
- OpenTelemetry GenAI 约定:2025 年发布,2026 年广泛采用。

```figure
i4-otel-glue
```

## 投入使用

`code/main.py` 模拟一天 100 万条链路在三种留存策略下的表现(100% 摄取、采样、采样 + 错误全留)。报告每种策略的存储成本和损失内容。

## 交付

本课产出 `outputs/skill-observability-stack.md`。给定技术栈、规模、预算和许可立场,选出工具(组合)。

## 练习

1. 团队在用 LangChain,想要可自托管的开源可观测性。在 Langfuse 和 Opik 里选一个并论证。
2. 每天 500 万条链路,Datadog 报价每月 15 万美元,算 Arize AX 的盈亏平衡点。
3. 设计一套 OpenTelemetry GenAI 属性集,作为你们组织对每个 LLM 调用的强制规范。
4. 论证 Phoenix 单独用于生产是否足够。什么情况下不够?
5. Helicone 代理有 20 ms 开销。P99 TTFT 300 ms 时可接受吗?SLA 是 100 ms 呢?

## 关键术语

| 术语 | 别人嘴里的说法 | 实际含义 |
|------|----------------|----------|
| OpenLLMetry | "LLM 版 OTel" | LLM 的开源 OpenTelemetry 埋点 |
| GenAI 约定 | "OTel 属性" | LLM 调用的标准 OTel 属性名 |
| LangSmith | "LangChain 可观测性" | 与 LangChain 生态打包的商业平台 |
| Langfuse | "开源 LangSmith" | MIT 开源,功能集相近 |
| Phoenix | "Arize 开发工具" | OpenTelemetry 原生的开发/评测平台 |
| Arize AX | "规模化可观测性" | 商业零拷贝 Iceberg/Parquet 可观测性 |
| Helicone | "代理可观测性" | 收集 LLM 遥测的 HTTP 代理 + 网关功能 |
| Opik | "Comet 的 LLM" | Comet 出的 Apache 2.0 开源开发平台 |
| 会话回放 | "链路重放" | 带工具调用完整重放一次智能体会话 |
| 评测 | "离线测试" | 拿候选模型/提示词跑标注数据集 |

## 延伸阅读

- [SigNoz — Top LLM Observability Tools 2026](https://signoz.io/comparisons/llm-observability-tools/)
- [Langfuse — Arize AX Alternative analysis](https://langfuse.com/faq/all/best-phoenix-arize-alternatives)
- [PremAI — Setting Up Langfuse, LangSmith, Helicone, Phoenix](https://blog.premai.io/llm-observability-setting-up-langfuse-langsmith-helicone-phoenix/)
- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Arize Phoenix docs](https://docs.arize.com/phoenix)
- [Helicone docs](https://docs.helicone.ai/)
