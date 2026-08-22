# 结构化输出 —— JSON Schema、Pydantic、Zod、约束解码

> "好好求模型返回 JSON"，即便在前沿模型上也有 5-15% 的失败率。结构化输出用约束解码补上这个缺口：模型在字面上被阻止发出任何会违反 schema 的 token。OpenAI 的严格模式、Anthropic 的 schema 类型化工具调用、Gemini 的 `responseSchema`、Pydantic AI 的 `output_type`、Zod 的 `.parse`——同一个思想的五种表面形态。本课构建 schema 校验器和严格模式契约，这是你在每条生产抽取流水线里都会用到的东西。

**类型：** Build
**编程语言：** Python（标准库，JSON Schema 2020-12 子集）
**前置要求：** 第 13 阶段 · 02（函数调用深潜）
**预计耗时：** 约 75 分钟

## 学习目标

- 为抽取目标写出带正确约束的 JSON Schema 2020-12(enum、min/max、required、pattern)
- 解释严格模式和约束解码与"生成后再校验"在担保上的本质不同
- 区分三种失败模式：解析错误、schema 违规、模型拒绝
- 交付一条带类型化修复和类型化拒绝处理的抽取流水线

## 问题

一个读采购订单邮件的智能体，要把自由文本变成 `{customer, line_items, total_usd}`。三条路线。

**路线一：提示要 JSON。** "用 JSON 回复，字段为 customer、line_items、total_usd。" 前沿模型上 85-95% 有效。六种死法：缺括号、尾随逗号、类型错误、幻觉字段、撞到 token 上限被截断、漏出 "Here is your JSON:" 这样的散文。

**路线二：生成后校验。** 自由生成、解析、按 schema 校验、失败重试。可靠但贵——每次重试都要花钱，截断 bug 每出现一次就多花一轮。

**路线三：约束解码。** 厂商在解码时强制 schema。非法 token 被从采样分布里屏蔽掉。输出保证能解析、保证能过校验。失败塌缩成一种模式：拒绝（模型判断输入塞不进 schema)。

2026 年，每家前沿厂商都提供某种形式的路线三。

- **OpenAI。** `response_format: {type: "json_schema", strict: true}`；模型拒绝时响应里有 `refusal` 字段。
- **Anthropic。** 对 `tool_use` 的输入做 schema 强制；没有 `stop_reason: "refusal"` 这种东西，但"没有工具调用就 `end_turn`"就是那个信号。
- **Gemini。** 请求级的 `responseSchema`;2026 年 Gemini 对选定类型提供 token 级文法约束。
- **Pydantic AI。** `output_type=InvoiceModel`，产出类型为 `InvoiceModel` 的结构化 `RunResult`。
- **Zod(TypeScript)。** 运行时解析器，按 Zod schema 校验厂商输出；与 OpenAI 的 `beta.chat.completions.parse` 搭配。

共同的线索：schema 声明一次，端到端强制。

## 概念

### JSON Schema 2020-12 —— 通用语言

每家厂商都接受 JSON Schema 2020-12。你最常用的构造：

- `type`:`object`、`array`、`string`、`number`、`integer`、`boolean`、`null` 之一。
- `properties`：字段名到子 schema 的映射。
- `required`：必须出现的字段名列表。
- `enum`：允许值的封闭集合。
- `minimum` / `maximum`（数字）,`minLength` / `maxLength` / `pattern`（字符串）。
- `items`：应用到数组每个元素上的子 schema。
- `additionalProperties`:`false` 禁止额外字段（默认值随模式而变）。

OpenAI 严格模式再加三条要求：每个属性都必须列在 `required` 里、处处 `additionalProperties: false`、不能有未解析的 `$ref`。违反这些，API 在请求时直接返回 400。

### Pydantic,Python 绑定

Pydantic v2 通过 `model_json_schema()` 从 dataclass 形状的模型生成 JSON Schema。Pydantic AI 把它包起来，你只写：

```python
class Invoice(BaseModel):
    customer: str
    line_items: list[LineItem]
    total_usd: Decimal
```

智能体框架在边缘处把 schema 翻译成 OpenAI 严格模式、Anthropic `input_schema` 或 Gemini `responseSchema`。模型的输出以类型化的 `Invoice` 实例返回。校验错误抛出带类型化错误路径的 `ValidationError`。

### Zod,TypeScript 绑定

Zod(`z.object({customer: z.string(), ...})`）是 TS 的对应物。OpenAI 的 Node SDK 暴露 `zodResponseFormat(Invoice)`，翻译成 API 的 JSON Schema 载荷。

### 拒绝（Refusal)

严格模式没法强迫模型回答。如果输入塞不进 schema("这封邮件是一首诗，不是发票")，模型会发出一个带原因的 `refusal` 字段。你的代码必须把它当作一类正式结果来处理，而不是失败。拒绝也是有用的安全信号：让模型从受保护内容的邮件里抽取信用卡号时，模型返回带着安全原因的拒绝。

### 公开的约束解码

开源权重的实现用三种技术。

1. **基于文法的解码**(`outlines`、`guidance`、`lm-format-enforcer`)：从 schema 构建确定性有限自动机（FSM)；每一步，屏蔽掉会违反 FSM 的 token 的 logits。
2. **与 JSON 解析器联动的 logit 屏蔽**：让流式 JSON 解析器与模型同步走；每一步，算出合法的下一 token 集合。
3. **带验证器的投机解码**：便宜的草稿模型提 token，验证器强制 schema。

商业厂商幕后选其中一种。2026 年的最高水平是：短结构化输出上比普通生成还快，长输出上速度大致持平。

### 三种失败模式

1. **解析错误。** 输出不是合法 JSON。严格模式下不可能发生；非严格厂商仍可能发生。
2. **Schema 违规。** 输出能解析但违反 schema。严格模式下不可能发生；之外很常见。
3. **拒绝。** 模型婉拒。必须作为类型化结果处理。

### 重试策略

在严格模式之外时（Anthropic 工具调用、非严格 OpenAI、旧版 Gemini)，恢复模式是：

```
generate -> parse -> validate -> if fail, inject error and retry, max 3x
```

通常一次重试就够。三次重试能接住弱模型的抽风。超过三次，说明 schema 有问题：某些输入下模型就是满足不了它，该修的是提示词或 schema。

### 小模型支持

约束解码对小模型也有效。一个带文法强制的 3B 开源模型，在结构化任务上能跑赢裸提示的 70B 模型。这是结构化输出对生产环境重要的主因：它把可靠性和模型尺寸解耦了。

```figure
constrained-decoding
```

## 投入使用

`code/main.py` 交付一个用标准库写的 JSON Schema 2020-12 最小校验器（类型、required、enum、min/max、pattern、items、additionalProperties)。它包装一个 `Invoice` schema，把一段假 LLM 输出跑过校验器，演示解析错误、schema 违规和拒绝三条路径。生产环境把假输出换成任意厂商的真实响应即可。

要看的地方：

- 校验器返回带路径和消息的类型化 `[ValidationError]` 列表。这就是你想暴露给重试提示词的形状。
- 拒绝分支不重试。它记录日志并返回类型化的拒绝。第 14 阶段 · 09 会把拒绝当作安全信号使用。
- `additionalProperties: false` 检查在对抗测试输入上触发，展示了严格模式如何堵死幻觉字段的门。

## 交付

本课产出 `outputs/skill-structured-output-designer.md`。给它一个自由文本抽取目标（发票、客服工单、简历等），这个 skill 产出一份兼容严格模式的 JSON Schema 2020-12 和与之镜像的 Pydantic 模型，并预置类型化拒绝与重试处理的桩代码。

## 练习

1. 跑 `code/main.py`。加第四个测试用例：`total_usd` 是负数。确认校验器按 `minimum` 约束路径拒绝它。

2. 扩展校验器，支持带判别字段的 `oneOf`。常见情况：`line_item` 是产品或服务，用 `kind` 标签区分。严格模式在这里有微妙规则，查 OpenAI 的结构化输出指南。

3. 把同一个 Invoice schema 写成 Pydantic BaseModel，对比 `model_json_schema()` 的输出和你手写的 schema。找出 Pydantic 默认设置而手写版漏掉的那一个字段。

4. 测量拒绝率。构造十个不该能抽取的输入（一段歌词、一个数学证明、一封空邮件），在真实厂商的严格模式下跑。数拒绝数和幻觉输出数。这就是你做拒绝感知重试的地面真值。

5. 把 OpenAI 的结构化输出指南从头读到尾。找出它在严格模式下明确禁止、但普通 JSON Schema 允许的一个构造。然后设计一个非必要地使用了该违禁构造的 schema，并把它重构成严格兼容的。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|------------------------|
| JSON Schema 2020-12 | "那个 schema 规范" | 每个现代厂商都讲的 IETF 草案 schema 方言 |
| 严格模式 | "保证 schema" | OpenAI 的开关，用约束解码强制 schema |
| 约束解码 | "logit 屏蔽" | 解码时强制，屏蔽非法的下一 token |
| 拒绝（Refusal) | "模型婉拒" | 输入塞不进 schema 时的类型化结果 |
| 解析错误 | "非法 JSON" | 输出解析不成 JSON；严格模式下不可能 |
| Schema 违规 | "形状不对" | 能解析但违反了类型 / required / enum / 范围 |
| `additionalProperties: false` | "不许加戏" | 禁止未知字段；OpenAI 严格模式的硬性要求 |
| Pydantic BaseModel | "类型化输出" | 能发出和校验 JSON Schema 的 Python 类 |
| Zod schema | "TS 的输出类型" | 校验厂商输出的 TS 运行时 schema |
| 文法强制 | "开源权重的约束解码" | 基于 FSM 的 logit 屏蔽，如 outlines / guidance |

## 延伸阅读

- [OpenAI —— 结构化输出](https://platform.openai.com/docs/guides/structured-outputs) —— 严格模式、拒绝与 schema 要求
- [OpenAI —— Introducing structured outputs](https://openai.com/index/introducing-structured-outputs-in-the-api/) —— 2024 年 8 月发布文章，解释解码担保
- [Pydantic AI —— Output](https://ai.pydantic.dev/output/) —— 序列化到各家厂商的类型化 output_type 绑定
- [JSON Schema —— 2020-12 发布说明](https://json-schema.org/draft/2020-12/release-notes) —— 权威规范
- [Microsoft —— Azure OpenAI 中的结构化输出](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/structured-outputs) —— 企业部署说明与严格模式注意事项
