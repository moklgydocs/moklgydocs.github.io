# 提示词缓存与语义缓存的经济学

> **定价快照截至 2026-04。** 下文数字取自本课发布时各厂商费率表;下游引用前请对照链接文档核实。

> 缓存发生在两层。L2(供应商侧)提示词/前缀缓存复用重复前缀的注意力 KV——Anthropic 的提示词缓存文档宣称长提示词最高可省 90% 成本、85% 延迟;以 Claude 3.5 Sonnet 为例,缓存读 0.30 美元/M token,新输入 3.00 美元/M,5 分钟 TTL,选 1 小时 TTL 则写入按 2 倍计费(docs.anthropic.com,2026-04)。OpenAI 提示词缓存对 ≥1024 token 的提示词自动生效,缓存输入约打一折(platform.openai.com,2026-04);具体每模型的缓存费率以实时费率表为准。L1(应用层)语义缓存在嵌入相似度命中时完全跳过 LLM。厂商宣称的"95% 准确率"指匹配正确率,不是命中率——社区报告的生产命中率从 10%(开放聊天)到 70%(结构化 FAQ)不等;两家供应商都没公布官方基线,把这些当社区遥测看,别当承诺。生产陷阱有两个:并行化会毁掉缓存(第一次缓存写入完成前发出的 N 个并行请求能让账单翻好几倍);前缀里混入动态内容则让命中率直接归零。ProjectDiscovery 报告(2025-11)通过把动态文本移出可缓存前缀,把命中率从 7% 提到 74%。

**类型:** 学习
**编程语言:** Python(标准库,玩具级双层缓存模拟器)
**前置要求:** 第 17 阶段 · 04(推理引擎内部机制)、第 17 阶段 · 06(SGLang RadixAttention)
**预计耗时:** 约 60 分钟

## 学习目标

- 区分 L2 提示词/前缀缓存(供应商侧 KV 复用)与 L1 语义缓存(相似提示词直接绕过 LLM)。
- 解释 Anthropic 的 `cache_control` 显式标记,以及两档 TTL(5 分钟 vs 1 小时)各自的价格倍率。
- 给定命中率、提示词/响应结构和 token 单价,计算预期月度节省。
- 说出能把账单放大 5-10 倍的并行化反模式,以及让命中率崩塌的动态内容反模式。

## 问题

你给 RAG 服务加了提示词缓存,账单纹丝不动。一测命中率:7%。提示词看着是静态的,其实不是——系统提示词里拼了精确到分钟的当前时间、一个请求 ID,还有为多样性随机重排的示例。每个请求都在写新缓存项,读到的次数是零。

另一边,你的智能体每个用户问题发十个并行工具调用。十个请求在第一次缓存写入完成前全部到达供应商。十次写入,零次读取。账单是"有缓存"预期成本的 5-10 倍。

缓存是一套协议,不是一个开关。两层缓存,两种坏法。

## 概念

### L2 —— 供应商提示词/前缀缓存

供应商为可缓存前缀存下注意力 KV,下一个命中同前缀的请求直接复用。写入费付一次,读取几乎免费。

**Anthropic(Claude 3.5 / 3.7 / 4 系列)**:请求里显式打 `cache_control` 标记,标注哪些块可缓存。TTL 两档:5 分钟(写入按基准价 1.25 倍)或 1 小时(写入 2 倍)。缓存读:Claude 3.5 Sonnet 0.30 美元/M,新输入 3.00 美元/M——便宜 10 倍(docs.anthropic.com,截至 2026-04)。各模型费率不同(Opus/Haiku 单独公布);务必对照实时定价页。

**OpenAI**:≥1024 token 的提示词自动缓存(platform.openai.com,2026-04),无需显式开关。按当前 gpt-4o/gpt-5 费率表,缓存输入约为新输入的一折。官方文档和发布说明都没公布官方命中率基线;社区报告集中在 30-60%,前提是提示词设计讲究。用 `usage.cached_tokens` 监测自己的数据。

**Google(Gemini)**:经显式 API 做上下文缓存;100 万 token 上下文意味着缓存更值钱。

**自托管(vLLM、SGLang)**:第 17 阶段 · 06 讲过的 RadixAttention——同一模式跑在你自己的算力上。

### L1 —— 应用层语义缓存

调 LLM 之前,先给提示词做哈希、算嵌入,找相似的历史请求(余弦相似度过阈值,通常 0.95+)。命中就直接返回缓存响应;未命中才调 LLM,然后缓存结果。

开源:Redis Vector Similarity、GPTCache、Qdrant。商业:Portkey Cache、Helicone Cache。

厂商的准确率宣称指的是返回的缓存响应语义上恰当的比例——不是命中率。生产命中率:

- 开放聊天:10-15%。
- 结构化 FAQ / 客服:40-70%。
- 代码问题:20-30%(微小变体就能毁命中)。
- 重复提示词的语音助手:50-80%(语音归一化后是固定集合)。

### 并行化反模式

你的智能体并行发 10 个工具调用,都带着同一段 4K token 系统提示词。Anthropic 的缓存写入按请求计;第一次缓存写入大约在供应商看到提示词 300 ms 后完成。第 2-10 个请求落在同一毫秒窗口内,各自看到的都是缓存未命中。你付了 10 次写入溢价,0 次读取折扣。

解法:改"先串行一发"的批量模式——先发请求 1,等它的缓存就位后再并发 2-10。第一个工具调用多等 300 ms;账单省 5-10 倍。

### 动态内容反模式

你的系统提示词长这样:

```
You are a helpful assistant. The current time is 14:32:17.
User ID: abc123. Today is Tuesday...
```

每个请求都独一无二,每个请求都在写,命中为零。

解法:把真正静态的内容全部放进可缓存前缀,动态内容追加到缓存边界之后:

```
[cacheable]
You are a helpful assistant. [rules, examples, instructions]
[/cacheable]
[dynamic, not cached]
Current time: 14:32:17. User: abc123.
```

ProjectDiscovery 就是这样把命中率从 7% 做到 74% 的,还公开了完整拆解。

### 夜间负载叠加批处理 + 缓存

批处理 API(第 17 阶段 · 15)给 5 折,24 小时内返回。再叠缓存输入,又是约 10 倍。夜间分类、打标、报表生成这类负载,叠起来能压到同步无缓存成本的约 10%。

### 该记住的数字

定价取自 2026-04 的链接厂商文档,每隔几个月就会漂移——依赖前先复核。

- Anthropic 缓存读:Claude 3.5 Sonnet 0.30 美元/M,约为新输入的 1/10(docs.anthropic.com)。
- Anthropic 缓存写溢价:1.25 倍(5 分钟 TTL)或 2 倍(1 小时 TTL)。
- OpenAI 自动缓存:≥1024 token 提示词生效;缓存输入约为新输入的 10%(platform.openai.com)。
- 语义缓存命中率(社区报告):开放聊天约 10%;结构化 FAQ 最高约 70%。非厂商文档基线。
- ProjectDiscovery:把动态内容移出前缀,命中率 7% → 74%(项目博客,2025-11)。
- 并行化反模式:N 个并行请求错过首次缓存写入时,账单普遍膨胀 5-10 倍。

```figure
semantic-cache-hit
```

## 投入使用

`code/main.py` 在混合负载上模拟 L1 + L2 缓存。报告命中率、账单,并演示并行化代价。

## 交付

本课产出 `outputs/skill-cache-auditor.md`。给定提示词模板和流量,审计可缓存性并给出重构建议。

## 练习

1. 运行 `code/main.py`。切换并行化开关,账单变化多少?
2. 你的系统提示词里有日期。把它移出去,给出前后命中率的账。
3. 按你的请求到达速率,算 1 小时 TTL(2 倍写)与 5 分钟 TTL(1.25 倍写)的盈亏平衡点。
4. 语义缓存阈值 0.95 时命中 20%;降到 0.85 命中 50%,但开始出现不恰当的缓存响应。选对阈值并论证。
5. 你每个用户问题批量发 10 个并行子查询。在不增加端到端延迟的前提下,改写成对缓存友好的形态。

## 关键术语

| 术语 | 别人嘴里的说法 | 实际含义 |
|------|----------------|----------|
| L2 提示词缓存 | "前缀缓存" | 供应商为重复前缀存 KV |
| `cache_control` | "Anthropic 缓存标记" | 显式标注可缓存块的属性 |
| 缓存写溢价 | "写入税" | 首次未命中写入的额外成本(1.25 或 2 倍) |
| L1 语义缓存 | "嵌入缓存" | 调 LLM 前的应用层哈希加嵌入 |
| GPTCache | "LLM 缓存库" | 流行的开源 L1 缓存库 |
| 缓存命中率 | "命中/总数" | 由缓存服务的请求占比 |
| 并行化反模式 | "N 写陷阱" | N 个并行请求各自错过缓存 N 次 |
| 动态内容陷阱 | "提示词带时间陷阱" | 前缀里的动态字节杀死命中率 |
| RadixAttention | "副本内缓存" | SGLang 的前缀缓存实现 |

## 延伸阅读

- [Anthropic Prompt Caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) —— 官方 `cache_control` 语义与 TTL。
- [OpenAI Prompt Caching](https://platform.openai.com/docs/guides/prompt-caching) —— 自动缓存行为与生效条件。
- [TianPan — Semantic Caching for LLMs Production](https://tianpan.co/blog/2026-04-10-semantic-caching-llm-production)
- [ProjectDiscovery — Cut LLM Costs 59% With Prompt Caching](https://projectdiscovery.io/blog/how-we-cut-llm-cost-with-prompt-caching)
- [DigitalOcean / Anthropic — Prompt Caching](https://www.digitalocean.com/blog/prompt-caching-with-digital-ocean)
