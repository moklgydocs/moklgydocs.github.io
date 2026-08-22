# 提示词缓存与上下文缓存

> 你的系统提示 4,000 token,RAG 上下文 20,000 token,每个请求都原样发送,也原样付费——每次都是。提示词缓存让提供方把这段前缀在他们那边保温,复用时只按正常价 10% 收你。用对了,它能把推理成本砍掉 50–90%,首 token 延迟砍掉 40–85%。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 11 阶段 · 01(提示词工程),第 11 阶段 · 05(上下文工程),第 11 阶段 · 11(缓存与成本)
**预计耗时:** 约 60 分钟

## 问题

一个编程智能体在对话的每一轮,都把同一份 15,000 token 的系统提示发给 Claude。20 轮、输入 $3/百万 token,仅输入成本就是 $0.90——还没算用户消息的一个字。乘上每天一万场对话,为这段从不变化的文本,账单到了每天 $9,000。

压缩提示词会伤质量,不发又不行——模型每一轮都需要它。唯一的出路是:别再为提供方已经见过的前缀付全价。

这个出路就是提示词缓存。Anthropic 在 2024 年 8 月发布(2025 年又出了 1 小时延长 TTL 变体),OpenAI 同年晚些时候做了自动化,Google 随 Gemini 1.5 发布了显式上下文缓存——如今三家都把它作为 frontier 模型的一等公民功能。

## 概念

![提示词缓存:写一次,读便宜](assets/prompt-caching.svg)

**机理。** 当某个请求的前缀与近期请求匹配时,提供方直接端出上次运行留下的 KV 缓存,而不是重新编码这些 token。第一次付一笔小小的写入溢价,之后每次享受大大的读取折扣。

**2026 年三家提供方的口味。**

| 提供方 | API 风格 | 命中折扣 | 写入溢价 | 默认 TTL | 最小可缓存 |
|---------|-----------|--------------|---------------|-------------|---------------|
| Anthropic | 内容块上显式 `cache_control` 标记 | 输入 1 折 | 加收 25% | 5 分钟(可延至 1 小时) | 1,024 token(Sonnet/Opus),2,048(Haiku) |
| OpenAI | 自动前缀检测 | 输入 5 折 | 无 | 最长 1 小时(尽力而为) | 1,024 token |
| Google(Gemini) | 显式 `CachedContent` API | 按存储计费;读取约为正常价 25% | 按 token·小时收存储费 | 用户设定(默认 1 小时) | 4,096 token(Flash),32,768(Pro) |

**铁律。** 三家都只缓存前缀:只要有一个 token 不同,第一个不同 token 之后的全部内容都算未命中。把*稳定*的部分放上面,*可变*的部分放下面。

### 缓存友好的布局

```
[system prompt]          <-- cache this
[tool definitions]       <-- cache this
[few-shot examples]      <-- cache this
[retrieved documents]    <-- cache if reused, else don't
[conversation history]   <-- cache up to last turn
[current user message]   <-- never cache (different every time)
```

违反这个顺序——把用户消息放在系统提示之上、在 few-shot 之间插入动态检索——缓存就永远命中不了。

### 盈亏平衡计算

Anthropic 收 25% 写入溢价,意味着一个缓存块至少要被读两次才净省钱:1 次写 + 1 次读,平均每请求成本 0.675 倍(省 32%);1 次写 + 10 次读,平均 0.205 倍(省 80%)。经验法则:预计在 TTL 内复用至少 3 次的内容,就缓存。

```figure
prompt-cache-hit
```

## 动手构建

### 第 1 步:带显式标记的 Anthropic 提示词缓存

```python
import anthropic

client = anthropic.Anthropic()

SYSTEM = [
    {
        "type": "text",
        "text": "You are a senior Python reviewer. Follow the rubric exactly.\n\n" + RUBRIC_15K_TOKENS,
        "cache_control": {"type": "ephemeral"},
    }
]

def review(code: str):
    return client.messages.create(
        model="claude-opus-4-7",
        max_tokens=1024,
        system=SYSTEM,
        messages=[{"role": "user", "content": code}],
    )
```

`cache_control` 标记告诉 Anthropic 把这个块存 5 分钟:窗口内复用即命中,过期后再次写入。

**响应的 usage 字段:**

```python
response = review(code_a)
response.usage
# InputTokensUsage(
#     input_tokens=120,
#     cache_creation_input_tokens=15023,   # paid at 1.25x
#     cache_read_input_tokens=0,
#     output_tokens=340,
# )

response_b = review(code_b)
response_b.usage
# cache_creation_input_tokens=0
# cache_read_input_tokens=15023           # paid at 0.1x
```

在 CI 里检查这两个字段——如果跨请求 `cache_read_input_tokens` 一直是零,说明你的缓存键在漂移。

### 第 2 步:1 小时延长 TTL

长时间运行的批处理任务,5 分钟默认 TTL 会在任务之间过期。设置 `ttl`:

```python
{"type": "text", "text": RUBRIC, "cache_control": {"type": "ephemeral", "ttl": "1h"}}
```

1 小时 TTL 的写入溢价翻倍(在基线上加收 50% 而不是 25%),但只要批次复用前缀超过 5 次,回本很快。

### 第 3 步:OpenAI 自动缓存

OpenAI 没什么可配置的:任何超过 1,024 token 的前缀,只要与近期请求匹配,自动打 5 折。

```python
from openai import OpenAI
client = OpenAI()

resp = client.chat.completions.create(
    model="gpt-5",
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},   # long and stable
        {"role": "user", "content": user_msg},
    ],
)
resp.usage.prompt_tokens_details.cached_tokens  # the discounted portion
```

同样的缓存友好布局规则适用。有两个会杀死 OpenAI 缓存、却杀不死 Anthropic 缓存的东西:改动 `user` 字段(它是缓存键的一部分)和重排工具顺序。

### 第 4 步:Gemini 显式上下文缓存

Gemini 把缓存当作你创建并命名的一等对象:

```python
from google import genai
from google.genai import types

client = genai.Client()

cache = client.caches.create(
    model="gemini-3-pro",
    config=types.CreateCachedContentConfig(
        display_name="rubric-v3",
        system_instruction=RUBRIC,
        contents=[FEW_SHOT_EXAMPLES],
        ttl="3600s",
    ),
)

resp = client.models.generate_content(
    model="gemini-3-pro",
    contents=["Review this code:\n" + code],
    config=types.GenerateContentConfig(cached_content=cache.name),
)
```

Gemini 在缓存存活期间按 token·小时收存储费,读取约为正常输入价的 25%。当你要在多天里、跨多个会话复用同一份巨型提示时,这是正确的形态。

### 第 5 步:在生产中测量命中率

`code/main.py` 里有一个模拟的三方记账器,追踪写/读/未命中计数,并计算每 1,000 请求的混合成本。给部署设一道命中率门槛——大多数生产 Anthropic 配置在预热后应看到 >80% 的读取占比。

## 2026 年仍在发货的坑

- **顶部放动态时间戳。** 系统提示开头写 `"Current time: 2026-04-22 15:30:02"`,每个请求都未命中。把时间戳挪到缓存断点之下。
- **工具重排。** 以稳定顺序序列化工具——两次部署之间 dict 顺序一变,全部命中归零。
- **自由文本的近似重复。** "You are helpful." 和 "You are a helpful assistant."——差一个字节就是完全未命中。
- **块太小。** Anthropic 强制 1,024 token 下限(Haiku 为 2,048)。更小的块静默地不缓存。
- **糊涂成本仪表盘。** 把"输入 token"拆成缓存与未缓存两部分。否则流量下降会被误读成缓存立功。

## 投入使用

2026 年的缓存栈:

| 场景 | 选择 |
|-----------|------|
| 系统提示稳定 1 万+ token、多轮对话的智能体 | Anthropic `cache_control`,5 分钟 TTL |
| 批处理任务复用前缀 30 分钟以上 | Anthropic 加 `ttl: "1h"` |
| GPT-5 上的 serverless 端点,无定制设施 | OpenAI 自动(只要让前缀稳定且够长) |
| 巨型代码/文档语料多天复用 | Gemini 显式 `CachedContent` |
| 跨提供方回退 | 让各家可缓存前缀布局保持一致,命中在哪边都有效 |

与语义缓存(第 11 阶段 · 11)组合使用,覆盖用户消息层:提示词缓存处理*逐 token 相同*的复用,语义缓存处理*意思相同*的复用。

## 交付

保存 `outputs/skill-prompt-caching-planner.md`:

```markdown
---
name: prompt-caching-planner
description: Design a cache-friendly prompt layout and pick the right provider caching mode.
version: 1.0.0
phase: 11
lesson: 15
tags: [llm-engineering, caching, cost]
---

Given a prompt (system + tools + few-shot + retrieval + history + user) and a usage profile (requests per hour, TTL needed, provider), output:

1. Layout. Reordered sections with a single cache breakpoint marked; explain which sections are stable, which are volatile.
2. Provider mode. Anthropic cache_control, OpenAI automatic, or Gemini CachedContent. Justify from TTL and reuse pattern.
3. Break-even. Expected reads per write within TTL; net cost vs no-cache with math.
4. Verification plan. CI assertion that cache_read_input_tokens > 0 on the second identical request; dashboard split by cached vs uncached tokens.
5. Failure modes. List the three most likely reasons the cache will miss in this setup (dynamic timestamp, tool reorder, near-duplicate text) and how you will prevent each.

Refuse to ship a cache plan that places a dynamic field above the breakpoint. Refuse to enable 1h TTL without a reuse count that makes the 2x write premium pay back.
```

## 练习

1. **简单。** 用 5,000 token 的系统提示对 Claude 做一场 10 轮对话,先不开 `cache_control` 跑一次,再开了跑一次,报告两种情况的输入 token 账单。
2. **中等。** 写一个测试工具:给定提示词模板和一份请求日志,计算各提供方(Anthropic 5 分钟、Anthropic 1 小时、OpenAI 自动、Gemini 显式)的预期命中率与每美元节省。
3. **困难。** 构建一个布局优化器:给定提示词和一份标了 `stable=True/False` 的字段清单,在不丢失信息的前提下重写提示词,把唯一的缓存断点放在缓存友好的最大位置。在真实的 Anthropic 端点上验证。

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|-----------------|-----------------------|
| 提示词缓存(Prompt caching) | "让长提示变便宜" | 复用提供方一侧为匹配前缀保留的 KV 缓存,重复输入 token 打 1–5 折 |
| `cache_control` | "Anthropic 的标记" | 声明"到这里为止都可缓存"的内容块属性:`{"type": "ephemeral"}` |
| 缓存写入(Cache write) | "付溢价" | 填充缓存的第一个请求:Anthropic 按约 1.25 倍输入价计费,OpenAI 免费 |
| 缓存读取(Cache read) | "那个折扣" | 后续匹配前缀的请求:按 10%(Anthropic)、50%(OpenAI)、约 25%(Gemini)计费 |
| TTL | "能活多久" | 缓存保温的秒数:Anthropic 默认 5 分钟(可延 1 小时),OpenAI 尽力最长 1 小时,Gemini 用户设定 |
| 延长 TTL(Extended TTL) | "1 小时的 Anthropic 缓存" | `{"type": "ephemeral", "ttl": "1h"}`:写入溢价 2 倍,但批量复用就值回 |
| 前缀匹配(Prefix match) | "我缓存为什么没中" | 只有从开头到断点的每个 token 都逐字节一致,缓存才命中 |
| 上下文缓存(Gemini Context caching) | "显式的那个" | Google 的命名式、按存储计费的缓存对象,最适合大型语料的多天复用 |

## 延伸阅读

- [Anthropic — Prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)——`cache_control`、1 小时 TTL、盈亏平衡表
- [OpenAI — Prompt caching](https://platform.openai.com/docs/guides/prompt-caching)——自动前缀匹配
- [Google — Context caching](https://ai.google.dev/gemini-api/docs/caching)——`CachedContent` API 与存储定价
- [Anthropic engineering — Prompt caching for long-context workloads](https://www.anthropic.com/news/prompt-caching)——原始发布文章,含延迟数字
- 第 11 阶段 · 05(上下文工程)——在哪里切分提示词,缓存才落得了地
- 第 11 阶段 · 11(缓存与成本)——把提示词缓存与用户消息上的语义缓存搭配使用
- [Pope et al., "Efficiently Scaling Transformer Inference" (2022)](https://arxiv.org/abs/2211.05102)——提示词缓存暴露给用户的 KV 缓存内存模型:解释了为什么重读缓存前缀比重算便宜约 10 倍
- [Agrawal et al., "SARATHI: Efficient LLM Inference by Piggybacking Decodes with Chunked Prefills" (2023)](https://arxiv.org/abs/2308.16369)——prefill 正是提示词缓存抄近道的阶段:本文解释了为什么缓存命中时 TTFT 大降而 TPOT 不变
- [Leviathan et al., "Fast Inference from Transformers via Speculative Decoding" (2023)](https://arxiv.org/abs/2211.17192)——提示词缓存与推测解码、Flash Attention、MQA/GQA 并列为压低推理成本曲线的杠杆;读这篇补齐另外三个
