# 托管 LLM 平台 —— Bedrock、Vertex AI、Azure OpenAI

> 三大云厂,三种截然不同的策略。AWS Bedrock 是模型集市——Claude、Llama、Titan、Stability、Cohere 都在一个 API 后面;Azure OpenAI 是 OpenAI 独家合作,外加 Provisioned Throughput Units(PTU)提供专属容量;Vertex AI 是 Gemini 优先,长上下文和多模态的故事讲得最好。2026 年 Artificial Analysis 测得:在 Llama 3.1 405B 等价部署上,Azure OpenAI 中位延迟约 50 ms,Bedrock 约 75 ms——差距由 PTU 解释,因为专属容量胜过共享按需。决策规则不是"谁最快",而是"谁的模型目录和 FinOps 表面匹配我的产品"。本课教你把权衡写下来再选,而不是凭感觉。

**类型:** 学习
**编程语言:** Python(标准库,玩具成本-延迟比较器)
**前置要求:** 第 11 阶段(LLM 工程)、第 13 阶段(工具与协议)
**预计耗时:** 约 60 分钟

## 学习目标

- 说出三种平台策略(集市 vs 独家 vs Gemini 优先),并把每种匹配到产品场景。
- 解释 Azure OpenAI 的 PTU 买到什么,以及为什么 405B 规模上按需 Bedrock 通常慢约 25 ms。
- 画出每个平台的 FinOps 归因表面(Bedrock Application Inference Profiles vs Vertex 每团队一项目 vs Azure 作用域 + PTU 预留)。
- 写下"至少双提供商"政策,并解释为什么 2026 年单一厂商锁定是昂贵的错误。

## 问题

你为产品选了 Claude 3.7 Sonnet,现在要 serving。可以直接调 Anthropic API,可以走 AWS Bedrock,也可以走网关。直接 API 最简单;Bedrock 多了 BAA、VPC 端点、IAM 和 CloudWatch 归因;网关多的是跨提供商的故障转移、统一账单和限流。

更深的问题是目录。如果同一个产品里既要 Claude 又要 Llama 还要 Gemini,没有任何一处能买全——除非同时用 Bedrock + Vertex + Azure OpenAI。三大云厂不可互换:各自对"谁拥有模型层"下了不同的注。

本课把三个赌注、延迟差距、FinOps 差距和锁定风险画出来。

## 概念

### 三种策略

**AWS Bedrock** —— 集市。Claude(Anthropic)、Llama(Meta)、Titan(AWS 自研)、Stability(图像)、Cohere(嵌入)、Mistral,外加图像和嵌入子目录。一个 API、一套 IAM 面、一个 CloudWatch 导出。Bedrock 的赌注是:客户要可选择性,胜过要单一模型。

**Azure OpenAI** —— 独家合作。你在 Azure 数据中心拿到 GPT-4 / 4o / 5 / o 系列、DALL·E、Whisper 和 OpenAI 模型的微调。"Azure OpenAI Service"目录里没有非 OpenAI 模型——那些归 Azure AI Foundry(独立产品)。Azure 的赌注是:OpenAI 持续站在前沿,客户想要的是这段特定关系上的企业级管控。

**Vertex AI** —— Gemini 优先,其余靠后。Gemini 1.5 / 2.0 / 2.5 Flash 与 Pro,外加 Model Garden(第三方)。Vertex 的赌注是多模态长上下文——1M token 的 Gemini 上下文是差异化武器。

### 规模化的延迟差距

Artificial Analysis 持续跑基准。在等价的 Llama 3.1 405B 部署(共享按需)上,Azure OpenAI 的首 token 中位延迟约 50 ms,Bedrock 约 75 ms。差距不是 AWS 的失败,而是容量模式的差异:Azure 卖 PTU(Provisioned Throughput Unit),为你的租户预留 GPU 容量;Bedrock 的对应物(Provisioned Throughput)存在,但每单元约 $21/小时起,大多数客户留在共享按需上。

按需共享容量要和其他所有客户的流量竞争,专属容量不用。如果你的产品 SLA 是 P99 TTFT < 100 ms,你要么在 Azure 买 PTU,要么买 Bedrock Provisioned Throughput,要么接受默认波动。

### 预留容量的经济学

Azure PTU:预留的一块推理算力。可预测负载下比按需最多省约 70%。无论流量如何,每小时费用固定——空闲也照付。盈亏平衡点通常在 40–60% 持续利用率。

Bedrock Provisioned Throughput:每单元 $21–$50/小时,因模型和区域而异。账类似——盈亏平衡约在峰值利用率的一半。要求月度承诺。

Vertex 的预留容量按 Gemini SKU 售卖,价格随模型和区域变化,公开宣传较少。

### FinOps 表面 —— 真正的差异化

**Bedrock Application Inference Profiles** 是集市区最干净的归因。给 profile 打上 `team`、`product`、`feature` 标签,所有模型调用走它,CloudWatch 直接按 profile 拆成本,无需后处理。2025 年推出,至今是云厂原生里最细粒度的。

**Vertex** 归因是"每团队一项目 + 处处打标签":每个团队建模成一个 GCP 项目,每个资源打标签,用 BigQuery Billing Export + DataStudio 汇总。活儿更多,但 BigQuery 让你对成本数据跑任意 SQL。

**Azure** 依赖订阅/资源组作用域加标签,PTU 预留是一等成本对象。标签从资源组继承而非按请求,所以逐请求归因需要 Application Insights 自定义指标,或一个在响应头里盖戳的网关。

规律:Bedrock 原生最干净,Vertex 经 BigQuery 最灵活,Azure 不自己插桩就最不透明。

### 锁定是 2026 年的风险

一个模型独大的年代,押注单一云厂没问题。2026 年,前沿按月移动——这个季度 Claude 3.7,下个季度 Gemini 2.5,再下个季度 GPT-5。锁定一个平台,就是把自己挡在三分之二的前沿之外。

务实团队采用的模式:任何产品关键的 LLM 调用,至少双提供商。Bedrock + Azure OpenAI 是常见组合——一家出 Claude,一家出 GPT,网关在前面,互为故障转移。成本增幅可忽略(网关按最优路由);而故障期的可用性提升是决定性的(想想 Azure OpenAI 2025 年 1 月事故、AWS us-east-1 宕机)。

### 数据驻留、BAA 与受监管行业

Bedrock:多数区域有 BAA;VPC 端点;护栏。金融科技常见默认。
Azure OpenAI:HIPAA、SOC 2、ISO 27001;欧盟数据驻留;受监管企业的默认。
Vertex:HIPAA、GDPR、按区域的数据驻留;Google Cloud 的合规栈。

三家都满足基本勾选框。差异在数据保留政策、日志处理方式,以及滥用监控是否读你的流量(大多数默认开启;企业可 opt-out)。

### 该记住的数字

- Azure OpenAI 在 Llama 3.1 405B 等价部署上的中位 TTFT:约 50 ms(带 PTU)。
- Bedrock 按需中位 TTFT:约 75 ms。
- Bedrock Provisioned Throughput:每单元 $21–$50/小时。
- Azure PTU 盈亏平衡:约 40–60% 持续利用率。
- 高利用率下 PTU 相对按需的节省:最高 70%。

```figure
i4-platform-lanes
```

## 投入使用

`code/main.py` 在一个合成负载上对比三个平台——建模按需 vs PTU 经济学、TTTFT 波动和成本归因保真度。运行它,看 PTU 在哪里回本,哪里集市的模型广度盖过 TTFT 差距。

## 交付

本课产出 `outputs/skill-managed-platform-picker.md`。给定负载画像(需要的模型、TTFT SLA、日调用量、合规要求),它推荐主平台、备选平台和一份 FinOps 插桩计划。

## 练习

1. 运行 `code/main.py`。70B 级模型上,持续利用率到多少时 Azure PTU 胜过按需?算出盈亏平衡点,与宣传的 40–60% 区间对比。
2. 你的产品同时需要 Claude 3.7 Sonnet 和 GPT-4o。设计双提供商部署——哪个放哪家云,前面架什么网关,故障转移策略是什么?
3. 一个受监管的医疗客户要求 BAA、美东数据驻留、P99 TTFT 低于 100ms。选一个平台,用三个具体特性论证。
4. 你发现本月 Bedrock 账单涨了 4 倍而流量没变。没有 Application Inference Profiles 时怎么找元凶?有了 profile,要多久?
5. 读 Azure OpenAI 和 Bedrock 定价页。每月 1 亿 token 的 Claude 负载,哪个更便宜——Anthropic 直连 API、Bedrock 按需,还是 Bedrock Provisioned Throughput?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| Bedrock | "AWS 的 LLM 服务" | 横跨 Claude、Llama、Titan、Mistral、Cohere 的模型集市 |
| Azure OpenAI | "Azure 的 ChatGPT" | Azure 数据中心里的独家 OpenAI 模型,带企业管控 |
| Vertex AI | "Google 的 LLM" | Gemini 优先平台,Model Garden 装第三方模型 |
| PTU | "专属容量" | Provisioned Throughput Unit——预留的推理 GPU,按小时计价 |
| Application Inference Profile | "Bedrock 打标签" | 逐产品的成本/用量 profile,带标签,CloudWatch 原生 |
| Model Garden | "Vertex 目录" | Vertex AI 的第三方模型区,与 Gemini 分开 |
| 至少双提供商 | "LLM 冗余" | 每条关键 LLM 路径跨 ≥2 家云厂的策略 |
| BAA | "HIPAA 文书" | 商业伙伴协议;PHI 必需;三家都提供 |
| 滥用监控 | "日志看守" | 提供商侧对提示/输出的安全扫描;企业可 opt-out |

## 延伸阅读

- [AWS Bedrock 定价](https://aws.amazon.com/bedrock/pricing/) —— 权威费率表与 Provisioned Throughput 定价。
- [Azure OpenAI Service 定价](https://azure.microsoft.com/en-us/pricing/details/azure-openai/) —— PTU 经济学与费率。
- [Vertex AI 生成式 AI 定价](https://cloud.google.com/vertex-ai/generative-ai/pricing) —— Gemini 档位与 Model Garden 加价。
- [Artificial Analysis LLM 排行榜](https://artificialanalysis.ai/) —— 跨提供商的持续延迟与吞吐基准。
- [The AI Journal —— AWS Bedrock vs Azure OpenAI CTO 指南 2026](https://theaijournal.co/2026/03/aws-bedrock-vs-azure-openai/) —— 企业决策框架。
- [Finout —— Bedrock vs Vertex vs Azure FinOps](https://www.finout.io/blog/bedrock-vs.-vertex-vs.-azure-cognitive-a-finops-comparison-for-ai-spend) —— 归因机制并排对比。
