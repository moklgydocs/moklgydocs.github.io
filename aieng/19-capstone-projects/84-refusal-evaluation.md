# 结课项目 84 —— 拒绝评估

> 良性提示词上的有用性和有害提示词上的拒绝,是两个指标,不是一个。两个都要测。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 18 阶段安全课程,第 19 阶段 Track A 第 25-29 课
**预计耗时:** 约 90 分钟

## 问题

助手的安全关卡会以两个相反的方向出错。模型拒绝了该回答的(过度拒绝),也回答了该拒绝的(拒绝不足)。两个都是 bug。只在有害提示词上测拒绝率的团队,交付的模型会拒绝辅导化学作业。只测有用性的团队,交付的模型会讲解如何造成伤害。正确的指标集把助手当作提示词安全性上的二分类器,由被测策略决定每个提示词落在决策边界的哪一侧。

难点在于,开发期间真实 LLM 是移动靶。改系统提示词、改 temperature、改工具,两个指标会联动。你需要一个基于 fixture 的评估器,底下垫一个确定性的 mock LLM,这样一次代码改动会让指标因已知原因而动。本课的 mock LLM 是一张小小的分发表:模式、策略、输出。第 87 课的框架稍后把 mock 换成 HTTP 调用就接上了真实模型。指标框架不变。

本课构建评估框架。它产出四个数字:拒绝不足率、过度拒绝率、校准(模型自报置信度与其实际准确率是否匹配),以及用第 82 课分类法做的逐类别分解。

## 概念

一次拒绝评估有四个对象:带 `safe`/`unsafe` 标签的提示词集、带脚本化策略的 mock LLM、模型输出上的拒绝分类器(对 `I cannot`、`I will not`、`as a responsible` 这类短语的正则),以及指标聚合器。

```mermaid
flowchart LR
  P[labeled prompt set] --> M[mock LLM]
  M --> R[refusal classifier]
  R --> A[aggregator]
  A --> UR[under-refusal rate]
  A --> OR[over-refusal rate]
  A --> CAL[calibration ECE]
  A --> CAT[per-category breakdown]
```

Mock LLM 策略刻意简单,保证测试可审计。默认的 `MockPolicyStrict` 对命中禁用正则列表中任一条的提示词拒绝,其余回答。`MockPolicyOverCautious` 用宽得多的模式集,故意过度拒绝。`MockPolicyLeaky` 只对最明显的案例拒绝,故意拒绝不足。三个策略是框架应当检测出的脚本化 bug。

拒绝不足:模型在标签集标为 `unsafe` 的提示词上做了回答(无拒绝短语)。过度拒绝:模型在标为 `safe` 的提示词上拒绝了(有拒绝短语)。框架还算 `accuracy = (TP + TN) / total`,其中 TP 是"unsafe 提示词被正确拒绝",TN 是"safe 提示词被正确回答"。

校准用模型自报置信度上的期望校准误差(ECE)。mock LLM 可选地在输出中带上 `confidence:0.X` token;框架解析它。ECE 按置信度以 0.1 为宽把提示词分箱,算逐箱准确率,再按箱大小加权平均 `|conf - accuracy|`。一个说着 `confidence:0.9` 却只有 60% 时候正确的模型,在该箱上 ECE 约为 0.3。ECE 与过度/拒绝不足无关,因为它测的是模型知不知道自己什么时候对。

逐类别分解把标注提示词与第 82 课的分类法工件 join。每个 unsafe 提示词携带类别标签(六类之一)。框架报告逐类别拒绝不足率,团队由此可以看到——比如——模型对 `instruction-override` 防得好,却在 `multi-turn-ramp` 上漏。

```figure
ci-refusal-quadrant
```

## 动手构建

`code/mock_llm.py` 定义三个策略。每个策略是一个从提示词到响应字符串的可调用。响应里以 `[conf=0.X]` 嵌入模型置信度。`code/prompts.py` 是标注语料:25 条 unsafe 提示词(按 id 取自第 82 课分类法)加 30 条 safe 提示词(日常良性请求,与第 83 课良性集无重叠,两套评估保持独立)。

`code/main.py` 跑评估器。拒绝分类器是拒绝短语的正则。聚合器返回字典,含 `under_refusal`、`over_refusal`、`accuracy`、`ece` 和 `per_category_under_refusal`。运行器扫过全部三个 mock 策略,写出对比报告。

## 投入使用

`python3 main.py`。演示打印三个策略的对比表,写 `outputs/refusal_eval_report.json`,并确认 `MockPolicyOverCautious` 过度拒绝最高、`MockPolicyLeaky` 拒绝不足最高。严格策略居中;那是回归基线。

## 交付

`outputs/skill-refusal-evaluation.md` 记录指标定义,让报告的下游读者不会误读数字。

## 练习

1. 加第四个 mock 策略:按提示词长度拒绝。确认编码攻击(往往较短)上的拒绝不足上升。
2. 用可靠性曲线替换 ECE,每个策略画一条。指出哪些箱过度自信。
3. 加逐类别 safe 提示词列表(良性 role-play、关于先前上下文的良性指令)。计算逐类别过度拒绝,检查 role-play 是否吸引最多误拒。

## 关键术语

| 术语 | 常见用法 | 精确含义 |
|---|---|---|
| 拒绝不足 | 模型很有用 | 模型回答了标为 unsafe 的提示词 |
| 过度拒绝 | 模型很安全 | 模型拒绝了标为 safe 的提示词 |
| 校准 | 模型很谦逊 | 自报置信度与观测准确率之间的差距,以期望校准误差汇总 |
| 准确率 | 质量 | safe/unsafe 二分类决策的 (TP + TN) / total |
| 逐类别分解 | 一张图 | 与第 82 课分类法类别 join 后的拒绝不足率 |

## 延伸阅读

第 85 课(输出分类器)和第 87 课(端到端闸门)消费本课的指标框架。
