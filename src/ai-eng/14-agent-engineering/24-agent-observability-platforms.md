# 智能体可观测性:Langfuse、Phoenix、Opik

> 2026 年,三个开源智能体可观测性平台三足鼎立:Langfuse(MIT)——月装机量 600 万+,链路追踪 + 提示词管理 + 评估 + 会话回放;Arize Phoenix(Elastic 2.0)——深度的智能体专属评估、RAG 相关性、OpenInference 自动埋点;Comet Opik(Apache 2.0)——自动化提示词优化、护栏、LLM 裁判幻觉检测。

**类型:** 学习
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 23(OTel GenAI)
**预计耗时:** 约 45 分钟

## 学习目标

- 说出三个顶级开源智能体可观测性平台及其许可证
- 区分各自的最强项:Langfuse(提示词管理 + 会话)、Phoenix(RAG + 自动埋点)、Opik(优化 + 护栏)
- 解释为什么到 2026 年 89% 的组织报告已部署智能体可观测性
- 用标准库实现一条"链路 → 仪表盘"流水线,带 LLM 裁判评估

## 问题

OTel GenAI(第 23 课)给了你 schema。你仍然需要一个平台来摄取 span、跑评估、存提示词版本、暴露回归。三个竞争者各自强调生命周期的不同部分。

## 概念

### Langfuse(MIT)

- 月 SDK 装机量 600 万+,GitHub 星标 19k+。
- 功能:链路追踪、带版本管理和 Playground 的提示词管理、评估(LLM 裁判、用户反馈、自定义)、会话回放。
- 2025 年 6 月:原先的商业模块(LLM-as-a-judge、标注队列、提示词实验、Playground)以 MIT 许可证开源。
- 最强项:端到端可观测性,与提示词管理闭环结合紧密。

### Arize Phoenix(Elastic License 2.0)

- 更深的智能体专属评估:链路聚类、异常检测、RAG 检索相关性。
- 原生 OpenInference 自动埋点。
- 生产上搭配托管版 Arize AX。
- 没有提示词版本管理——定位是广义平台旁的漂移/行为回归工具。
- 最强项:RAG 相关性、行为漂移、异常检测。

### Comet Opik(Apache 2.0)

- 通过 A/B 实验做自动化提示词优化。
- 护栏(PII 脱敏、话题约束)。
- LLM 裁判幻觉检测。
- Comet 自测基准:Opik 日志 + 评估 23.44 秒 vs Langfuse 327.15 秒(约 14 倍差距)——厂商基准只当方向性参考。
- 最强项:优化闭环、自动化实验、护栏执行。

### 行业数据

Maxim 2026 年实地分析:89% 的组织已部署智能体可观测性;质量问题是头号生产障碍(32% 受访者提及)。

### 怎么选

| 需求 | 选择 |
|------|------|
| 带提示词管理的一站式 | Langfuse |
| 深度 RAG 评估 + 漂移 | Phoenix |
| 自动化优化 + 护栏 | Opik |
| 许可证开放,不要 ELv2 | Langfuse(MIT)或 Opik(Apache 2.0) |
| Datadog / New Relic 集成 | 任意——它们都导出 OTel |

### 这个模式在哪里会走歪

- **没有评估策略。** 只追踪不评估,就是昂贵的日志。
- **自造不接地的 LLM 裁判。** CRITIC 模式(第 05 课)适用——裁判需要外部工具做事实核验。
- **提示词版本不挂链路。** 生产出回归时,你无法二分定位是哪版提示词惹的祸。

```figure
wb-trace-ingest
```

## 动手构建

`code/main.py` 用标准库实现了一个链路收集器 + LLM 裁判评估器:

- 摄取 GenAI 形状的 span。
- 按会话分组,标记失败运行(护栏触发、低置信评估)。
- 一个脚本化的 LLM 裁判,按评分细则给智能体回答打分。
- 仪表盘式摘要:失败率、Top 失败原因、评估分数分布。

运行:

```
python3 code/main.py
```

输出:逐会话评估分数与失败分类,与 Langfuse/Phoenix/Opik 会展示的相当。

## 投入使用

- **Langfuse**:自托管或云,经 OTel 或其 SDK 接入。
- **Arize Phoenix**:自托管;OpenInference 自动埋点。
- **Comet Opik**:自托管或云;自动化优化闭环。
- **Datadog LLM Observability**:已在用 Datadog 的混合 ops+ML 团队。

## 交付

`outputs/skill-obs-platform-wiring.md` 选定一个平台,把链路、评估和提示词版本接进一个现有智能体。

## 练习

1. 把一周的 OTel 链路导出到 Langfuse 云(免费档)。哪些会话失败了?为什么?
2. 为你的领域写一份 LLM 裁判评分细则(事实正确性、语气、范围遵守)。在 50 条链路上测试。
3. 对比 Langfuse 的提示词版本管理与 Phoenix 的链路聚类:哪个能更快告诉你什么坏了?
4. 读 Opik 的护栏文档,给你的一个智能体运行接上 PII 脱敏护栏。
5. 在你自己的语料上基准测试三者。别看厂商公布的数字,自己测。

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|----------------|------------------------|
| 链路追踪(Tracing) | "span 收集器" | 摄取 OTel / SDK span,按会话索引 |
| 提示词管理(Prompt management) | "提示词 CMS" | 与链路绑定的版本化提示词 |
| LLM 裁判(LLM-as-judge) | "自动化评估" | 独立的 LLM 按评分细则给智能体输出打分 |
| 会话回放(Session replay) | "链路播放" | 逐步重走过去的运行,用于调试 |
| RAG 相关性(RAG relevancy) | "检索质量" | 检索到的上下文与查询是否匹配 |
| 链路聚类(Trace clustering) | "行为分组" | 把相似运行聚类,用于漂移检测 |
| 护栏执行(Guardrail enforcement) | "记录时做政策检查" | 对记录内容做 PII/毒性/范围检查 |

## 延伸阅读

- [Langfuse docs](https://langfuse.com/)——链路、评估、提示词管理
- [Arize Phoenix docs](https://docs.arize.com/phoenix)——自动埋点、漂移
- [Comet Opik](https://www.comet.com/site/products/opik/)——优化 + 护栏
- [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)——三者都消费的 schema
