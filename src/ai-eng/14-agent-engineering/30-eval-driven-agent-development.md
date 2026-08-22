# 评估驱动的智能体开发

> Anthropic 的忠告:"从简单的提示词开始,用全面的评估去优化它们,只在确有需要时才加多步智能体系统。"评估不是最后一步——它是驱动第 14 阶段一切其他选择的外层循环。

**类型:** 学习 + 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段全部课程
**预计耗时:** 约 60 分钟

## 学习目标

- 说出三层评估——静态基准、自定义离线、在线生产——及各自的用途
- 解释 evaluator-optimizer 紧密循环
- 描述 2026 年最佳实践:eval 与代码同仓、CI 中运行、为 PR 设闸
- 把第 14 阶段的每一课连接到它产生的 eval 用例

## 问题

智能体能通过 demo,却在生产里以 demo 无法预测的方式失败。基准回答的是"这个模型能力面广吗",而不是"这个智能体为我的产品交付的补丁对吗"。答案是:三层评估持续运行,每道护栏和每条学到的规则都映射到一个 eval 用例。

## 概念

### 三层评估

1. **静态基准**——代码用 SWE-bench Verified(第 19 课),浏览/桌面用 WebArena/OSWorld(第 20 课),通用能力用 GAIA(第 19 课),工具调用用 BFCL V4(第 06 课)。用于跨模型比较和回归设闸。污染是真实存在的:SWE-bench+ 发现 32.67% 的解法泄漏。永远报告 Verified 或经 +-audited 审计的分数。

2. **自定义离线 eval**——你产品的形状:
   - LLM 裁判(Langfuse、Phoenix、Opik——第 24 课)。
   - 执行式(跑补丁,看测试过不过)。
   - 轨迹式(与黄金轨迹对比动作序列;OSWorld-Human 显示顶级智能体的步数是黄金轨迹的 1.4–2.7 倍)。

3. **在线 eval**——生产中:
   - 会话回放(Langfuse)。
   - 护栏触发的告警(第 16、21 课)。
   - 逐步成本/延迟追踪(第 23 课 OTel span)。

### Evaluator-optimizer(Anthropic)

紧密循环:

1. 提议者生成输出。
2. 评估者评判。
3. 改进,直到评估者通过。

这是 Self-Refine(第 05 课)的一般化。你在乎的任何智能体流程,都可以包进 evaluator-optimizer 里换取可靠性。

### 2026 年最佳实践

- eval 与代码同仓存放。
- 每个 PR 都在 CI 里跑。
- 按 eval 分数给合并设闸(如"相对 main 不允许 >5% 的回归")。
- 每道护栏映射到一个 eval 用例。
- 每条学到的规则(Reflexion、pro-workflow learn-rule)映射到一个失败用例。

### 把第 14 阶段串起来

第 14 阶段的每一课都会产生 eval 用例:

| 课 | 它产生的 eval 用例 |
|--------|------------------------|
| 01 智能体循环 | 预算耗尽、死循环防护 |
| 02 ReWOO | 工具失败时规划器正确重规划 |
| 03 Reflexion | 学到的反思在重试时生效 |
| 05 Self-Refine/CRITIC | 改进后的输出通过裁判 |
| 06 工具调用 | 参数强转有效;未知工具被拒 |
| 07-10 记忆 | 检索引用与来源一致;过期事实失效 |
| 12 工作流模式 | 每种模式产出正确输出 |
| 13 LangGraph | 恢复后状态精确重现 |
| 14 AutoGen Actors | DLQ 接住崩溃的处理器 |
| 16 OpenAI Agents SDK | 护栏在正确的输入上触发 |
| 17 Claude Agent SDK | 子智能体结果回到编排器 |
| 19-20 基准 | SWE-bench Verified 分数、WebArena 成功率、OSWorld 效率 |
| 21 Computer Use | 逐步安全检查抓住注入的 DOM |
| 23 OTel | span 发出必需属性 |
| 26 失效模式 | 检测器标记已知失效 |
| 27 提示词注入 | PVE 拒绝被投毒的检索 |
| 28 编排 | Supervisor 路由到正确的专家 |
| 29 运行时形态 | DLQ 处理 N% 失败 |

如果你的 eval 套件覆盖以上每一条,你就覆盖了第 14 阶段。

### 评估驱动开发在哪里会失败

- **没有基线。** 没有"最近已知良好"的 eval 无法解读。存基线。
- **LLM 裁判不接地。** 裁判也会幻觉。CRITIC 模式(第 05 课)——裁判要接地到外部工具。
- **对 eval 过拟合。** 为 eval 优化会偏离生产用途。轮换用例。
- **eval 不稳定。** 不确定的用例造成误报。钉住种子、快照状态。

```figure
ae-eval-three-layers
```

## 动手构建

`code/main.py` 是标准库 eval 框架:

- 按类别(基准、自定义、在线)注册的用例表。
- 一个被测的脚本化智能体。
- evaluator-optimizer 循环:提议、评判、改进,直到通过或达到最大轮数。
- CI 闸门:聚合通过率 + 相对基线的回归。

运行:

```
python3 code/main.py
```

输出:逐用例通过/失败、回归标记、CI 闸门裁决。

## 投入使用

- eval 用例与智能体代码同仓编写。
- 每个 PR 经 CI 运行。
- 回归就让构建失败。
- 跨时间追踪通过率。
- 把每一次生产失败都变成一个新用例。

## 交付

`outputs/skill-eval-suite.md` 为一个智能体产品构建三层 eval 套件,带 CI 闸门与回归追踪。

## 练习

1. 取你的一次生产失败,写一个能复现它的 eval 用例。你的智能体现在能过吗?
2. 为你的领域写一份三维 LLM 裁判评分细则(事实、语气、范围),给 50 个会话打分。
3. 把 eval 套件接进 CI:>=5% 回归就让构建失败。
4. 加轨迹效率指标:智能体用的步数 vs 黄金轨迹是多少?
5. 把第 14 阶段每一课映射到你套件里的一个 eval 用例。有缺的吗?那就是要补的缺口。

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|----------------|------------------------|
| 静态基准(Static benchmark) | "现成 eval" | SWE-bench、GAIA、AgentBench、WebArena、OSWorld |
| 自定义离线 eval(Custom offline eval) | "领域 eval" | 在你产品形状上的 LLM 裁判 / 执行式 / 轨迹式 |
| 在线 eval(Online eval) | "生产 eval" | 会话回放、护栏告警、成本/延迟追踪 |
| Evaluator-optimizer | "提议-评判-改进" | 迭代到裁判通过为止 |
| CI 闸门(CI gate) | "合并拦截器" | eval 回归就让构建失败 |
| 基线(Baseline) | "最近已知良好" | 用于检测回归的参照分数 |
| 轨迹效率(Trajectory efficiency) | "相对黄金超几步" | 智能体步数除以人类专家的最小步数 |

## 延伸阅读

- [Anthropic, Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)——"从简单开始,用 eval 优化"
- [OpenAI, SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)——精选版基准
- [Berkeley Function Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html)——工具调用基准
- [Langfuse docs](https://langfuse.com/)——实践中的 eval + 会话回放
