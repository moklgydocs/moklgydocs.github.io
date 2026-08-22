# 结构化输出与约束解码

> 让 LLM 返回 JSON,它大多数时候会给你 JSON。在生产环境,"大多数"就是问题。约束解码在采样前改写 logits,把"大多数"变成"永远"。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 5 阶段 · 17(聊天机器人),第 5 阶段 · 19(子词分词)
**预计耗时:** 约 60 分钟

## 问题

一个分类器提示 LLM:"从 {positive, negative, neutral} 里返回一个。"模型返回:"The sentiment is positive — this review is overwhelmingly favorable because the customer explicitly states that they ..." 你的解析器崩了,分类器的 F1 是 0.0。

自由生成不是契约,只是建议。生产系统要的是契约。

2026 年有三层方案。

1. **提示词。** 好好说话:"只返回 JSON 对象。"前沿模型上约 80% 有效,小模型更低。
2. **原生结构化输出 API。** OpenAI 的 `response_format`、Anthropic 的工具调用、Gemini 的 JSON 模式。对受支持的 schema 很可靠,但被厂商锁定。
3. **约束解码。** 在生成的每一步改写 logits,让模型*根本不可能*输出非法 token。从构造上保证 100% 合法,任何本地模型都能用。

本课建立对三者的直觉,并讲清什么场景用哪个。

## 概念

![约束解码在每一步屏蔽非法 token](assets/constrained-decoding.svg)

**约束解码的原理。** 生成的每一步,LLM 在整个词表(约 10 万 token)上产出一个 logit 向量。*logit 处理器*坐在模型和采样器之间:它根据当前在目标文法(JSON Schema、正则表达式、上下文无关文法)中的位置,算出哪些 token 合法,然后把所有非法 token 的 logit 设为负无穷。对剩下的 logit 做 softmax,概率质量就全落在合法续写上。

2026 年的实现:

- **Outlines。** 把 JSON Schema 或正则编译成有限状态机(FSM),每个 token 都能 O(1) 查到"下一步合法 token"。基于 FSM,所以递归 schema 需要拍平。
- **XGrammar / llguidance。** 上下文无关文法(CFG)引擎,能处理递归 JSON Schema,解码开销接近零。OpenAI 在 2025 年的结构化输出实现中致谢了 llguidance。
- **vLLM guided decoding。** 内置 `guided_json`、`guided_regex`、`guided_choice`、`guided_grammar`,后端可选 Outlines、XGrammar 或 lm-format-enforcer。
- **Instructor。** 基于 Pydantic 的封装,适配任何 LLM,校验失败就重试。跨厂商,但它不改 logits——靠的是重试加"结构化输出感知"的提示词。

### 反直觉的结果

约束解码常常比自由生成*更快*。两个原因:第一,它缩小了下一 token 的搜索空间;第二,精巧的实现会整个跳过那些"被迫" token 的生成(比如 `{"name": "` 这样的脚手架,每个字节都是注定的)。

### 让你出血的坑

字段顺序很重要。把 `answer` 放在 `reasoning` 前面,模型还没思考就先提交了答案。JSON 是合法的,答案是错的,任何校验都抓不出来。

```json
// BAD
{"answer": "yes", "reasoning": "because ..."}

// GOOD
{"reasoning": "... therefore ...", "answer": "yes"}
```

Schema 的字段顺序是逻辑,不是排版。

```figure
constrained-decoder
```

## 动手构建

### 第 1 步:从零实现正则约束生成

完整的独立 FSM 实现见 `code/main.py`。核心思想 30 行:

```python
def mask_logits(logits, valid_token_ids):
    mask = [float("-inf")] * len(logits)
    for tid in valid_token_ids:
        mask[tid] = logits[tid]
    return mask


def generate_constrained(model, tokenizer, prompt, fsm):
    ids = tokenizer.encode(prompt)
    state = fsm.initial_state
    while not fsm.is_accept(state):
        logits = model.next_token_logits(ids)
        valid = fsm.valid_tokens(state, tokenizer)
        logits = mask_logits(logits, valid)
        tok = sample(logits)
        ids.append(tok)
        state = fsm.transition(state, tok)
    return tokenizer.decode(ids)
```

FSM 跟踪文法中我们已经满足的部分。`valid_tokens(state, tokenizer)` 算出词表里哪些 token 能让 FSM 前进而不脱离可接受路径。

### 第 2 步:用 Outlines 跑 JSON Schema

```python
from pydantic import BaseModel
from typing import Literal
import outlines


class Review(BaseModel):
    sentiment: Literal["positive", "negative", "neutral"]
    confidence: float
    evidence_span: str


model = outlines.models.transformers("meta-llama/Llama-3.2-3B-Instruct")
generator = outlines.generate.json(model, Review)

result = generator("Classify: 'The wait staff was attentive and the food arrived hot.'")
print(result)
# Review(sentiment='positive', confidence=0.93, evidence_span='attentive ... hot')
```

零校验错误。永远。FSM 让非法输出从路径上消失。

### 第 3 步:用 Instructor 做跨厂商 Pydantic

```python
import instructor
from anthropic import Anthropic
from pydantic import BaseModel, Field


class Invoice(BaseModel):
    vendor: str
    total_usd: float = Field(ge=0)
    line_items: list[str]


client = instructor.from_anthropic(Anthropic())
invoice = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=1024,
    response_model=Invoice,
    messages=[{"role": "user", "content": "Extract from: 'Acme Corp $420. Widget, Gizmo.'"}],
)
```

机制不同。Instructor 不碰 logits:它把 schema 编进提示词,解析输出,校验失败就重试(默认 3 次)。任何厂商都能用,代价是重试带来的延迟和成本。卖点是跨厂商可移植。

### 第 4 步:厂商原生 API

```python
from openai import OpenAI

client = OpenAI()
response = client.responses.create(
    model="gpt-5",
    input=[{"role": "user", "content": "Classify: 'The food was cold.'"}],
    text={"format": {"type": "json_schema", "name": "sentiment",
          "schema": {"type": "object", "required": ["sentiment"],
                     "properties": {"sentiment": {"type": "string",
                                                  "enum": ["positive", "negative", "neutral"]}}}}},
)
print(response.output_parsed)
```

服务端约束解码。对受支持的 schema,可靠性和 Outlines 持平;不用自己管模型;代价是绑定厂商。

## 坑

- **递归 schema。** Outlines 会把递归拍平到固定深度。树形结构的输出(嵌套评论、AST)要用 XGrammar 或 llguidance(CFG 路线)。
- **巨型枚举。** 一万个选项的枚举编译很慢甚至超时。换成检索路线:先预测 top-k 候选,只对这些候选做约束。
- **文法太死。** 强制 `date: "YYYY-MM-DD"` 的正则,日期缺失时模型就没法输出 `"unknown"`,只能编一个日期交差。允许 `null` 或设哨兵值。
- **过早提交。** 见上面的字段顺序坑。永远把推理放前面。
- **不带 schema 的厂商 JSON 模式。** 纯 JSON 模式只保证是合法 JSON,不保证*符合你的用途*。永远给完整 schema。

## 投入使用

2026 年的技术栈:

| 场景 | 选择 |
|-----------|------|
| OpenAI/Anthropic/Google 模型,schema 简单 | 厂商原生结构化输出 |
| 任意厂商、Pydantic 工作流、能容忍重试 | Instructor |
| 本地模型、要 100% 合法、schema 扁平 | Outlines(FSM) |
| 本地模型、递归 schema | XGrammar 或 llguidance |
| 自托管推理服务 | vLLM guided decoding |
| 批处理、可接受重试 | Instructor + 最便宜的模型 |

## 交付

保存为 `outputs/skill-structured-output-picker.md`:

```markdown
---
name: structured-output-picker
description: Choose a structured output approach, schema design, and validation plan.
version: 1.0.0
phase: 5
lesson: 20
tags: [nlp, llm, structured-output]
---

Given a use case (provider, latency budget, schema complexity, failure tolerance), output:

1. Mechanism. Native vendor structured output, Instructor retries, Outlines FSM, or XGrammar CFG. One-sentence reason.
2. Schema design. Field order (reasoning first, answer last), nullable fields for "unknown", enum vs regex, required fields.
3. Failure strategy. Max retries, fallback model, graceful `null` handling, out-of-distribution refusal.
4. Validation plan. Schema compliance rate (target 100%), semantic validity (LLM-judge), field-coverage rate, latency p50/p99.

Refuse any design that puts `answer` or `decision` before reasoning fields. Refuse to use bare JSON mode without a schema. Flag recursive schemas behind an FSM-only library.
```

## 练习

1. **入门。** 用一个小型开源权重模型(如 Llama-3.2-3B),不用约束解码,直接提示它输出 `Review(sentiment, confidence, evidence_span)`。在 100 条评论上测能解析成合法 JSON 的比例。
2. **进阶。** 同一语料,改用 Outlines JSON 模式。对比合规率、延迟和语义准确率。
3. **挑战。** 从零实现一个针对电话号码(`\d{3}-\d{3}-\d{4}`)的正则约束解码器,验证 1000 个样本中非法输出为零。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|-----------------|-----------------------|
| 约束解码 | 强制输出合法 | 在生成的每一步屏蔽非法 token 的 logits |
| Logit 处理器 | "负责约束的那个" | 一个函数:`(logits, state) -> masked_logits` |
| FSM | 有限状态机 | 编译后的文法表示,O(1) 查询下一步合法 token |
| CFG | 上下文无关文法 | 能处理递归的文法,比 FSM 慢但表达力更强 |
| Schema 字段顺序 | "这也有讲究?" | 有——第一个字段就是先提交,永远推理在前、答案在后 |
| Guided decoding | vLLM 的叫法 | 同一个概念,集成进了推理服务器 |
| JSON 模式 | OpenAI 的早期版本 | 只保证 JSON 语法合法,不保证匹配你的 schema |

## 延伸阅读

- [Willard, Louf (2023). Efficient Guided Generation for LLMs](https://arxiv.org/abs/2307.09702) —— Outlines 论文
- [XGrammar 论文(2024)](https://arxiv.org/abs/2411.15100) —— 快速的 CFG 约束解码
- [vLLM — Structured Outputs](https://docs.vllm.ai/en/latest/features/structured_outputs.html) —— 推理服务器集成
- [OpenAI — Structured Outputs 指南](https://platform.openai.com/docs/guides/structured-outputs) —— API 参考与避坑
- [Instructor 库](https://python.useinstructor.com/) —— Pydantic + 重试,跨厂商
- [JSONSchemaBench(2025)](https://arxiv.org/abs/2501.10868) —— 六个约束解码框架的基准对比
