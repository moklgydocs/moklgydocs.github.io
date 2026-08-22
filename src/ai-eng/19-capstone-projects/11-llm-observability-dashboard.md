# 终局项目 11 —— LLM 可观测与评测看板

> Langfuse 走了开放核心路线,Arize Phoenix 发布了 2026 年 GenAI 语义约定映射,Helicone 和 Braintrust 都在按用户成本归因上加码,Traceloop 的 OpenLLMetry 成了事实上的 SDK 埋点标准。生产形态已定:trace 存 ClickHouse,元数据存 Postgres,UI 用 Next.js,外加一小队评测任务(DeepEval、RAGAS、LLM 裁判)跑在抽样 trace 上。本终局项目是自托管搭一套,接入至少四个 SDK 家族,并演示在五分钟内抓住一次注入的回归。

**类型:** 终局项目
**编程语言:** TypeScript(UI),Python / TypeScript(摄入 + 评测),SQL(ClickHouse)
**前置要求:** 第 11 阶段(LLM 工程)、第 13 阶段(工具)、第 17 阶段(基础设施)、第 18 阶段(安全)
**涉及阶段:** P11 · P13 · P17 · P18
**预计耗时:** 25 小时

## 问题

2026 年,每个跑生产流量的 AI 团队都在模型旁边架一个可观测平面:成本归因、幻觉检测、漂移监控、越狱信号、SLO 看板、PII 泄漏告警。开源参考——Langfuse、Phoenix、OpenLLMetry——已经收敛到 OpenTelemetry GenAI 语义约定作为摄入 schema。现在你可以用一个 SDK 给 OpenAI、Anthropic、Google、LangChain、LlamaIndex、vLLM 埋点,发出互相兼容的 span。

你要搭一个自托管看板:接入至少四个 SDK 家族,在抽样 trace 上跑一组评测任务,检测漂移并告警。度量标准是:故意注入一个回归(一个开始产出 PII 的提示词)后,看板能在五分钟内抓到并触发告警。

## 概念

摄入走 OTLP HTTP。SDK 产出 GenAI 语义约定的 span:`gen_ai.system`、`gen_ai.request.model`、`gen_ai.usage.input_tokens`、`gen_ai.response.id`、`llm.prompts`、`llm.completions`。span 落 ClickHouse 做列式分析;元数据(用户、会话、应用)落 Postgres。

评测以批任务形式跑在抽样 trace 上。DeepEval 打忠实度、毒性、答案相关性分;trace 带检索上下文时 RAGAS 打检索指标分;自定义 LLM 裁判跑领域专项检查(PII 泄漏、违反政策的回应)。评测结果作为评测 span 写回同一个 ClickHouse,链到父 trace 上。

漂移检测盯嵌入空间分布随时间的变化(提示词嵌入的 PSI 或 KL 散度)加评测分数趋势。告警走 Prometheus Alertmanager,再到 Slack / PagerDuty。UI 是 Next.js 15 配 Recharts。

## 架构

```
production apps:
  OpenAI SDK  +  Anthropic SDK  +  Google GenAI SDK
  LangChain + LlamaIndex + vLLM
       |
       v
  OpenTelemetry SDK with GenAI semconv
       |
       v  OTLP HTTP
  collector (ingest, sample, fan-out)
       |
       +-------------+-----------+
       v             v           v
   ClickHouse    Postgres    S3 archive
   (spans)       (metadata)  (raw events)
       |
       +---> eval jobs (DeepEval, RAGAS, LLM-judge)
       |     sampled or all-trace
       |     write eval spans back
       |
       +---> drift detector (PSI / KL on prompt embeddings)
       |
       +---> Prometheus metrics -> Alertmanager -> Slack / PagerDuty
       |
       v
   Next.js 15 dashboard (Recharts)
```

## 技术栈

- 摄入:OpenTelemetry SDK + GenAI 语义约定;OTLP HTTP 传输
- 收集器:OpenTelemetry Collector 配尾部采样处理器(控成本)
- 存储:span 存 ClickHouse,元数据存 Postgres,原始事件归档 S3
- 评测:DeepEval、RAGAS 0.2、Arize Phoenix 评估器包、自定义 LLM 裁判
- 漂移:每周对池化提示词嵌入(sentence-transformers)算 PSI / KL
- 告警:Prometheus Alertmanager → Slack / PagerDuty
- UI:Next.js 15 App Router + Recharts + server actions
- 开箱支持的 SDK:OpenAI、Anthropic、Google GenAI、LangChain、LlamaIndex、vLLM

```figure
ce-otel-drift
```

## 动手构建

1. **收集器配置。** OpenTelemetry Collector:OTLP HTTP 接收器,尾部采样器保留 100% 出错 trace 和 10% 成功 trace,导出到 ClickHouse 与 S3。

2. **ClickHouse schema。** `spans` 表,列对齐 GenAI 语义约定:`gen_ai_system`、`gen_ai_request_model`、`input_tokens`、`output_tokens`、`latency_ms`、`prompt_hash`、`trace_id`、`parent_span_id`,外加一个 JSON 袋放长 payload。按 user_id 与 app_id 建二级索引。

3. **SDK 覆盖测试。** 用每个 SDK(OpenAI、Anthropic、Google、LangChain、LlamaIndex、vLLM)写一个小客户端,OpenLLMetry 自动埋点。验证各自产出的标准 GenAI span 都落进 ClickHouse。

4. **评测任务。** 定时任务读最近 15 分钟的抽样 trace,跑 DeepEval 忠实度、毒性、答案相关性。输出作为评测 span 链回父 trace。

5. **自定义 LLM 裁判。** PII 泄漏裁判:给定一条回应,调一个守卫 LLM 给 PII 泄漏可能性打分。高分回应进分诊队列。

6. **漂移检测。** 每周任务计算本周池化提示词嵌入与过去 4 周基线的 PSI。超阈值即告警。

7. **看板。** Next.js 15,页面:总览(span/s、成本/用户、p95 延迟)、traces(搜索 + 瀑布图)、评测(忠实度趋势、毒性)、漂移(PSI 随时间)、告警。

8. **告警链。** Prometheus exporter 读评测分聚合与延迟分位数;Alertmanager 把警告路由到 Slack,严重违规路由到 PagerDuty。

9. **回归探针。** 注入一个 bug:被评测的聊天机器人 1% 的概率泄漏假 SSN。度量 MTTR:从 bug 部署到 Slack 告警。

## 投入使用

```
$ curl -X POST https://my-otel-collector/v1/traces -d @trace.json
[collector]  accepted 1 trace, 3 spans
[clickhouse] inserted 3 spans (app=chat, user=u_42)
[eval]       DeepEval faithfulness 0.82, toxicity 0.03
[drift]      weekly PSI 0.08 (below 0.2 threshold)
[ui]         live at https://obs.example.com
```

## 交付

`outputs/skill-llm-observability.md` 是交付物。给定一个 LLM 应用,看板摄入其 trace、跑评测、漂移告警,并在 Next.js 里展示成本/用户拆解。

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | trace schema 覆盖 | 产出标准 GenAI span 的 SDK 家族数(目标:6+) |
| 20 | 评测正确性 | DeepEval / RAGAS 分数对比人工标注集 |
| 20 | 看板体验 | 注入回归的 MTTR(目标 5 分钟内) |
| 20 | 成本 / 规模 | 1k span/s 持续摄入不积压 |
| 15 | 告警 + 漂移检测 | Prometheus/Alertmanager 链路端到端打通 |
| **100** | | |

## 练习

1. 为 Haystack 框架加自定义埋点。验证带忠实 `gen_ai.*` 属性的标准 span 落进 ClickHouse。

2. 在同一批 trace 上把 DeepEval 换成 Phoenix 评估器。度量两套评测引擎之间的分数漂移。

3. 磨尖漂移检测器:按 app-id 而非全局算 PSI。展示按应用的漂移轨迹。

4. 加"用户影响"页:每用户成本与每用户失败率,带迷你趋势线。

5. 设计一个尾部采样策略:毒性 > 0.5 的 trace 全保留,其余按 10% 分层抽样。度量引入的抽样偏差。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| GenAI 语义约定 | "OTel LLM 属性" | 2025 年 OpenTelemetry 的 LLM span 属性规范(system、model、tokens) |
| 尾部采样 | "trace 完成后采样" | 收集器在 trace 完成后决定保留还是丢弃(可以偷看错误) |
| PSI | "群体稳定性指数" | 比较两个分布的漂移指标;> 0.2 通常意味着显著漂移 |
| LLM 裁判 | "用模型做评测" | 一个 LLM 按细则给另一个 LLM 的输出打分(忠实度、毒性、PII) |
| 尾部采样策略 | "保留规则" | 决定哪些 trace 持久化、哪些丢弃的规则;出错全留 + 按比例采样 |
| 评测 span | "链式评测 trace" | 挂在原始 LLM 调用 span 下、携带评分数值的子 span |
| 每用户成本 | "单位经济" | 一个时间窗内归因到 user_id 的美元成本;关键产品指标 |

## 延伸阅读

- [Langfuse](https://github.com/langfuse/langfuse) —— 开放核心可观测平台参考
- [Arize Phoenix](https://github.com/Arize-ai/phoenix) —— 漂移支持强的另一个参考
- [OpenLLMetry (Traceloop)](https://github.com/traceloop/openllmetry) —— 自动埋点 SDK 家族
- [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) —— 摄入 schema
- [Helicone](https://www.helicone.ai) —— 另一个托管可观测方案
- [Braintrust](https://www.braintrust.dev) —— 评测优先的另一个平台
- [ClickHouse documentation](https://clickhouse.com/docs) —— 列式 span 存储
- [DeepEval](https://github.com/confident-ai/deepeval) —— 评估器库
