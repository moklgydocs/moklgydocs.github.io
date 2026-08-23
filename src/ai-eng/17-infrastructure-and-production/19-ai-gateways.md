# AI 网关 —— LiteLLM、Portkey、Kong AI Gateway、Bifrost

> 网关架在你的应用和模型供应商之间。核心能力是:供应商路由、故障切换、重试、限流、密钥引用、可观测性、护栏。2026 年市场格局:**LiteLLM** 是 MIT 开源,接 100+ 供应商,OpenAI 兼容,但约 2000 RPS 就崩(8 GB 内存占用,公开基准里出现级联失败);适合 Python、<500 RPS、开发/原型。**Portkey** 定位控制面(护栏、PII 脱敏、越狱检测、审计追踪),2026 年 3 月起 Apache 2.0 开源,延迟开销 20-40 ms,生产档每月 49 美元。**Kong AI Gateway** 建在 Kong Gateway 之上——Kong 自家基准(同为 12 CPU):比 Portkey 快 228%,比 LiteLLM 快 859%;定价每模型每月 100 美元(Plus 档最多 5 个);已在用 Kong 的企业最合适。**Bifrost**(Maxim AI)——可配置退避的自动重试,OpenAI 429 时切换到 Anthropic。**Cloudflare / Vercel AI Gateway** —— 托管、零运维、基础重试。数据驻留要求是自托管决策的硬约束;Portkey 和 Kong 居中,开源 + 可选托管。

**类型:** 学习
**编程语言:** Python(标准库,玩具级网关路由模拟器)
**前置要求:** 第 17 阶段 · 01(托管 LLM 平台)、第 17 阶段 · 16(模型路由)
**预计耗时:** 约 60 分钟

## 学习目标

- 列举网关的核心能力(路由、故障切换、重试、限流、密钥、可观测性、护栏)。
- 把 2026 年四个网关(LiteLLM、Portkey、Kong AI、Bifrost)对应到规模天花板和适用场景。
- 引用 Kong 基准(比 Portkey 快 228%、比 LiteLLM 快 859%),解释它对 >500 RPS 场景的意义。
- 按数据驻留和运维预算,在自托管与托管之间做选择。

## 问题

你的产品要调 OpenAI、Anthropic 和一个自托管 Llama。每家供应商的 SDK、错误模型、限流、认证方式都不一样。你想要故障切换(OpenAI 429 就换 Anthropic)、统一的凭证存储、统一可观测性、按租户限流。

在应用层重造这套,等于让每个服务和每个供应商两两耦合。网关层把它收进一个进程:一个 API(通常 OpenAI 兼容),向后扇出到各供应商。

## 概念

### 核心能力

1. **供应商路由** —— OpenAI、Anthropic、Gemini、自托管等,统一切到一个 API 后面。
2. **故障切换** —— 遇到 429、5xx 或质量失败,换一家重试。
3. **重试** —— 指数退避,次数有上限。
4. **限流** —— 按租户、按密钥、按模型。
5. **密钥引用** —— 运行时从 vault 取凭证(永不下放到应用)。
6. **可观测性** —— OTel + GenAI 属性(第 17 阶段 · 13)+ 成本归因。
7. **护栏** —— PII 脱敏、越狱检测、话题白名单过滤。

### LiteLLM —— MIT 开源,Python

- 100+ 供应商,OpenAI 兼容,路由器配置,故障切换,基础可观测性。
- Kong 的基准里约 2000 RPS 即崩;8 GB 内存占用,持续高压下级联失败。
- 适合:Python 应用、<500 RPS、开发/预发网关、实验性路由。
- 成本:开源免费;云有免费档。

### Portkey —— 控制面定位

- 2026 年 3 月起 Apache 2.0 开源。护栏、PII 脱敏、越狱检测、审计追踪。
- 每请求延迟开销 20-40 ms。
- 生产档每月 49 美元,含留存 + SLA。
- 适合:需要护栏 + 可观测性打包的受监管行业。

### Kong AI Gateway —— 规模派

- 建在 Kong Gateway(成熟 API 网关产品,lua + OpenResty)之上。
- Kong 自家 12 CPU 等效基准:比 Portkey 快 228%,比 LiteLLM 快 859%。
- 定价:每模型每月 100 美元,Plus 档最多 5 个模型。
- 适合:已在用 Kong;>1000 RPS;愿意付费授权。

### Bifrost(Maxim AI)

- 可配置退避的自动重试。
- "OpenAI 429 切 Anthropic"是它的经典配方。
- 较新的玩家;商业产品。

### Cloudflare AI Gateway / Vercel AI Gateway

- 托管、零运维。基础重试和可观测性。
- 适合:跑在 Cloudflare/Vercel 上的边缘 JavaScript 应用。
- 护栏和限流上不如 Kong/Portkey。

### 自托管 vs 托管

数据驻留是决定性约束。医疗、金融默认自托管(LiteLLM 或 Portkey 开源版或 Kong);消费产品默认托管(Cloudflare AI Gateway)或中间档(Portkey 托管)。混合:受监管租户自托管,其余托管。

### 延迟预算

- LiteLLM:典型开销 5-15 ms。
- Portkey:开销 20-40 ms。
- Kong:开销 3-8 ms。
- Cloudflare/Vercel:开销 1-3 ms(边缘优势)。

网关延迟直接加进 TTFT。SLA 要求 TTFT P99 < 100 ms,选 Kong 或 Cloudflare;P99 < 500 ms,随意。

### 限流语义很重要

简单令牌桶扛到中等规模没问题。多租户需要滑动窗口 + 突发配额 + 按租户分档。LiteLLM 是令牌桶;Kong 是滑动窗口;Portkey 是分档式。

### 网关 + 可观测性 + 路由是组合拳

第 17 阶段 · 13(可观测性)+ 16(模型路由)+ 19(网关)在生产里是同一层。选一个三家全包的工具,或者仔细接线:2026 年多数部署把 Helicone(可观测性)或 Portkey(护栏)与 Kong(规模)组合分工。

### 该记住的数字

- LiteLLM:约 2000 RPS 崩溃,8 GB 内存。
- Portkey:开销 20-40 ms;2026 年 3 月起 Apache 2.0。
- Kong:比 Portkey 快 228%,比 LiteLLM 快 859%。
- Kong 定价:每模型每月 100 美元,Plus 档最多 5 个。
- Cloudflare/Vercel:边缘开销 1-3 ms。

```figure
mx-gateway-fallback
```

## 投入使用

`code/main.py` 模拟在注入 429/5xx 故障时,网关跨 3 家供应商的路由与切换。报告延迟、重试率和切换命中率。

## 交付

本课产出 `outputs/skill-gateway-picker.md`。给定规模、运维姿态、合规要求和延迟预算,选出网关。

## 练习

1. 运行 `code/main.py`。配置 OpenAI→Anthropic→自托管的切换链。供应商错误率 5% 时预期命中率是多少?
2. 你的 SLA 是在 300 ms 基线上 TTFT P99 < 200 ms。哪些网关还在预算内?
3. 医疗客户要求自托管 + PII 脱敏 + 审计。选 Portkey 开源版还是 Kong?
4. 对比 LiteLLM vs Kong:到哪个 RPS 天花板团队就该迁移?
5. 为多租户 SaaS 设计限流策略:免费档、试用档、付费档。令牌桶还是滑动窗口?

## 关键术语

| 术语 | 别人嘴里的说法 | 实际含义 |
|------|----------------|----------|
| 网关 | "API 代理" | 架在应用与供应商之间的进程 |
| LiteLLM | "MIT 那个" | Python 开源,100+ 供应商,2K RPS 崩溃 |
| Portkey | "护栏网关" | 控制面 + 可观测性,Apache 2.0 |
| Kong AI Gateway | "规模那个" | 建在 Kong Gateway 上,基准领先 |
| Bifrost | "Maxim 的网关" | 重试 + Anthropic 切换配方 |
| Cloudflare AI Gateway | "边缘托管" | 边缘部署的托管网关,零运维 |
| PII 脱敏 | "数据擦洗" | 发给模型前用正则 + NER 打码 |
| 越狱检测 | "提示注入守卫" | 对用户输入跑的分类器 |
| 审计追踪 | "合规日志" | 每次 LLM 调用的不可变记录 |
| 令牌桶 | "简单限流" | 按补充速率限流 |
| 滑动窗口 | "精确限流" | 时间窗口限流;公平性更好 |

## 延伸阅读

- [Kong AI Gateway Benchmark](https://konghq.com/blog/engineering/ai-gateway-benchmark-kong-ai-gateway-portkey-litellm)
- [TrueFoundry — AI Gateways 2026 Comparison](https://www.truefoundry.com/blog/a-definitive-guide-to-ai-gateways-in-2026-competitive-landscape-comparison)
- [Techsy — Top LLM Gateway Tools 2026](https://techsy.io/en/blog/best-llm-gateway-tools)
- [LiteLLM GitHub](https://github.com/BerriAI/litellm)
- [Portkey GitHub](https://github.com/Portkey-AI/gateway)
- [Kong AI Gateway docs](https://docs.konghq.com/gateway/latest/ai-gateway/)
