# LLM 路由层 —— LiteLLM、OpenRouter、Portkey

> 厂商锁定是昂贵的。不同的工具调用负载适合不同的模型。路由网关给你一个统一的 API 表面、重试、故障转移、成本追踪和护栏。2026 年三种原型占主导:LiteLLM(开源自托管)、OpenRouter(托管 SaaS)、Portkey(生产级,2026 年 3 月开源)。本课点名决策标准,并走完一个标准库路由网关。

**类型:** 学习
**编程语言:** Python(标准库,路由 + 故障转移 + 成本追踪)
**前置要求:** 第 13 阶段 · 02(函数调用)、第 13 阶段 · 17(网关)
**预计耗时:** 约 45 分钟

## 学习目标

- 区分自托管、托管和生产级路由选项。
- 实现一个按定义好的优先级顺序在厂商故障时重试的回退链。
- 跨厂商追踪每请求的成本与 token 用量。
- 针对给定的生产约束,在 LiteLLM、OpenRouter 和 Portkey 之间做选择。

## 问题

厂商路由真正要紧的场景:

1. **成本。** Claude Sonnet 的价格是 Haiku 的 3 倍。分诊类任务,Haiku 就够;综合类任务,Sonnet 才值。按请求路由。

2. **故障转移。** OpenAI 抽风一小时,每个请求都失败。你希望自动回退到 Anthropic,不用重新部署。

3. **延迟。** 实时聊天 UI 需要快的首 token 时间,批量摘要器不需要。按延迟 SLA 路由。

4. **合规。** 欧盟用户必须留在欧盟区域。按区域路由。

5. **实验。** 同一负载上 A/B 两个模型。按测试桶路由。

为每个集成手写这些全是重复劳动。路由网关给你一个 OpenAI 兼容的 API,其余全包。

## 概念

### OpenAI 兼容代理形态

大家都说 OpenAI 的形状。路由网关暴露 `/v1/chat/completions`,接受 OpenAI schema,内部代理到 Anthropic / Gemini / Cohere / Ollama / 任何东西。客户端无感。

### 模型别名

代码里不钉死快照 id,而是写 `our_smart_model`。网关把别名映射到真实模型。厂商发布新一代模型时,你在服务端改别名,代码一行不动。

### 回退链

```
primary: openai/gpt-4o
on 5xx: anthropic/claude-3-5-sonnet
on 5xx: google/gemini-1.5-pro
on 5xx: refuse
```

网关在配置里定义这个。重试计入预算,防止回退级联把成本打爆。

### 语义缓存

相同或近似的提示词命中缓存,不走厂商。在重复的智能体循环上,节省可达 30-60%。键基于嵌入;近似提示词共享同一个缓存槽。

### 护栏

网关级:

- **PII 脱敏。** 发送提示词前,做正则或 ML 过滤。
- **策略违规。** 拒绝含违禁内容的提示词。
- **输出过滤。** 清洗补全内容中的泄漏。

Portkey 和 Kong 都自带成品护栏,LiteLLM 把它留为可选。

### 按密钥限速

一个 API 密钥 = 一个团队。按密钥的预算防止某个团队吃掉共享配额。多数网关支持。

### 自托管 vs 托管的取舍

| 因素 | LiteLLM(自托管) | OpenRouter(托管) | Portkey(生产级) |
|--------|----------------------|----------------------|----------------------|
| 代码 | 开源,Python | 托管 SaaS | 开源(2026 年 3 月)+ 托管 |
| 部署 | 部署一个代理 | 注册即用 | 都行 |
| 厂商数 | 100+ | 300+ | 100+ |
| 计费 | 你自己的密钥 | OpenRouter 点数 | 你自己的密钥 |
| 可观测 | OpenTelemetry | 仪表盘 | 完整 OTel + PII 脱敏 |
| 最适合 | 要完全掌控的团队 | 快速原型 | 有合规要求的生产 |

有 SRE 团队、要数据主权,选 LiteLLM;要单一订阅、零基础设施,选 OpenRouter;要开箱即用的护栏与合规,选 Portkey。

### 成本追踪

每个请求都带 `provider`、`model`、`input_tokens`、`output_tokens`。乘以每模型每 token 的单价(网关维护的价格表)。按用户 / 团队 / 项目聚合。

### MCP 加路由

网关可以同时路由 LLM 调用和 MCP 采样请求。当采样请求的 modelPreferences 偏好某个模型时,网关把它翻译到正确的后端。第 13 阶段 · 17(MCP 网关)和本课的路由网关,有时会在这里合并成一个服务。

### 路由策略

- **静态优先级。** 列表第一个;出错回退。
- **负载均衡。** 轮询或加权。
- **成本感知。** 选满足延迟/质量的最便宜模型。
- **延迟感知。** 选最近 N 分钟最快的模型。
- **任务感知。** 提示词分类器把编程路由到一个模型,摘要路由到另一个。

```figure
tp-router-failover
```

## 投入使用

`code/main.py` 用约 150 行实现一个路由网关:接受 OpenAI 形状的请求,翻译到各厂商桩,跑优先级回退链,追踪每请求成本,并在输入上做 PII 脱敏。三个场景:正常请求、主厂商宕机触发回退、PII 泄漏被脱敏拦截。

重点看:

- `ROUTES` 字典:别名 → 按优先级排序的具体厂商列表。
- 回退循环在 5xx 上重试。
- 成本追踪器把 token 用量乘以每模型费率。
- PII 脱敏器在转发前 scrub 掉 SSN 形状的模式。

## 交付

本课产出 `outputs/skill-routing-config-designer.md`。给定负载画像(延迟、成本、合规),该技能选定 LiteLLM / OpenRouter / Portkey 并产出路由配置。

## 练习

1. 运行 `code/main.py`。触发宕机场景;确认回退落到第二个厂商,且成本归属正确。

2. 加语义缓存:提示词的 SHA256 作为查找键,缓存命中立即返回。测量重复调用的成本节省。

3. 加一个提示词分类器:把 "code ..." 提示词路由到偏智能的别名,把 "summarize ..." 路由到偏速度的别名。

4. 设计按团队预算:每个团队有月度花费上限;超支后网关拒绝请求。选一个执行粒度(按请求或按窗口)。

5. 并排读 LiteLLM、OpenRouter 和 Portkey 的文档。说出每家各有一个、另外两家没有的特性。

## 关键术语

| 术语 | 大家口头的说法 | 实际含义 |
|------|----------------|------------------------|
| 路由网关 | "LLM 代理" | 挡在众多厂商前面的统一 API 表面层 |
| OpenAI 兼容 | "说 OpenAI schema" | 接受 `/v1/chat/completions` 形状,翻译到任何后端 |
| 模型别名 | "our_smart_model" | 代码里的名字,网关映射到具体模型 |
| 回退链 | "重试列表" | 失败时按序尝试的厂商列表 |
| 语义缓存 | "提示词嵌入缓存" | 键是提示词的嵌入;近似重复共享缓存命中 |
| 护栏 | "输入/输出过滤" | PII 脱敏,拒绝策略违规 |
| 按密钥限速 | "团队预算" | 按 API 密钥划定的配额 |
| 成本追踪 | "每请求花费" | 聚合 token 用量 × 每模型单价 |
| LiteLLM | "开源代理" | 可自托管的 OSS 路由网关 |
| OpenRouter | "托管 SaaS" | 点数计费的托管网关 |
| Portkey | "生产选项" | 开源 + 托管,护栏内置 |

## 延伸阅读

- [LiteLLM — docs](https://docs.litellm.ai/) — 自托管路由网关
- [OpenRouter — quickstart](https://openrouter.ai/docs/quickstart) — 托管路由 SaaS
- [Portkey — docs](https://portkey.ai/docs) — 带护栏的生产级路由
- [TrueFoundry — LiteLLM vs OpenRouter](https://www.truefoundry.com/blog/litellm-vs-openrouter) — 决策指南
- [Relayplane — LLM gateway comparison 2026](https://relayplane.com/blog/llm-gateway-comparison-2026) — 厂商综述
