# 自治编程智能体版图(2026)

> SWE-bench Verified 在不到三年里从 4% 涨到 80.9%。同一个 Claude Sonnet 4.5,在 SWE-agent v1 上得 43.2%,在 Cline 自治脚手架上得 59.8%——模型外面的脚手架,已经和模型本身一样重要。OpenHands(前身 OpenDevin)是最活跃的 MIT 许可平台,它的 CodeAct 循环直接在沙箱里执行 Python 动作,而不是走 JSON 工具调用。头条数字还藏着一个方法论问题:SWE-bench Verified 的 500 个任务里,有 161 个只需改 1–2 行;而在 SWE-bench Pro(改 10 行以上的任务)上,同样的前沿模型只有 23–59%。

**类型:** 学习
**编程语言:** Python(标准库,CodeAct 与 JSON 工具调用对比)
**前置要求:** 第 14 阶段 · 07(工具使用),第 15 阶段 · 01(长程智能体)
**预计耗时:** 约 45 分钟

## 问题

"哪个编程智能体最强"是个错误的问题。正确的问题是:在与我的工作匹配的任务分布上、用我将在生产中运行的脚手架,端到端可靠度是多少?

2022 到 2026 年间,这个领域学到的是:脚手架——检索层、规划器、沙箱、编辑-验证循环、反馈格式——是承重的。Claude Sonnet 4.5 在 SWE-agent v1 上,SWE-bench Verified 得 43.2%;同一个模型装进 Cline 的自治脚手架,得 59.8%。16.6 个百分点的绝对差,权重一模一样。基座模型是组件,循环才是产品。

相伴的问题是:基准饱和掩盖了退步。SWE-bench Verified 已接近饱和,而简单任务尾巴(500 个任务中 161 个只需改 ≤2 行)把头部分数拉了上去。真实世界的质量,在 SWE-bench Pro(改 10 行以上)这样的分布上量更准——同样的领头羊,在那里仍然只有 23–59%。

## 概念

### 一段话讲清 SWE-bench

SWE-bench(Jimenez 等人)取真实的 GitHub issue 及其 ground-truth 补丁,让智能体产出一个能让测试套件通过的补丁。SWE-bench Verified(OpenAI,2024)是人工精选的 500 任务子集,剔除了含糊和坏掉的任务。SWE-bench Pro 是更难的继任者——只收需要改 10 行以上的任务,当前前沿智能体在那里是 23–59%。

### 2022 → 2026 的曲线实际展示了什么

- **2022**:研究型模型在原始 SWE-bench 上约 4%。
- **2024**:GPT-4 + Devin 式脚手架约 14%;SWE-agent 约 12%。
- **2025**:Claude 3.5/3.7 Sonnet 装进 Aider 和 SWE-agent,推进到 40–55% 区间。
- **2026**:Claude Sonnet 4.5 和前沿竞争者,在 SWE-bench Verified 上 70–80%+。Epoch AI 的榜单实时跟踪。

这条斜率来自三个复利来源:更好的基座模型、更好的脚手架(CodeAct、反思、验证器循环),以及更好的基准(Verified 去噪)。

### CodeAct vs JSON 工具调用

OpenHands(All-Hands-AI,arXiv:2407.16741,前身 OpenDevin)下了一个具体的架构赌注:不让模型发出由宿主解码执行的 JSON 工具调用,而是让模型直接发出 Python 代码,由 Jupyter 式 kernel 在沙箱中运行。智能体可以在一个动作里遍历文件、串接工具、自己接住异常。

权衡:

- **JSON 工具调用**:每个动作一轮;易审计;组合性有限;默认安全,因为每次调用都过显式校验器。
- **CodeAct**:一个动作可以是一整个程序;可组合;需要加固的沙箱(OpenHands 用 Docker 隔离);失败模式包括沙箱运行时允许的一切。

两种架构都在生产。CodeAct 主导开放平台(OpenHands、smolagents);JSON 工具调用主导托管服务(Anthropic Managed Agents、OpenAI Assistants)——那里由提供方控制执行器。

### 2026 年的脚手架版图

| 脚手架 | 许可 | 执行模型 | 特点 |
|---|---|---|---|
| OpenHands(OpenDevin) | MIT | Docker 中 CodeAct | 最活跃的开放平台;事件流可回放 |
| SWE-agent | MIT | Agent-Computer Interface(ACI) | 第一个端到端 SWE-bench 脚手架 |
| Aider | Apache-2 | 本地仓库 diff 编辑 | 极简脚手架,回归稳定性强 |
| Cline | Apache-2 | 带工具策略的 VS Code 智能体 | Sonnet 4.5 上分数最高的开源脚手架 |
| Devin(Cognition) | 专有 | 托管 VM + 规划器 | 第一个"AI 软件工程师"产品品类 |
| Claude Code | 专有 | 权限模式 + 例程 | 第 10 课详解其智能体循环 |

### 为什么脚手架是主导变量

一次编程运行是一条长程轨迹(第 1 课),可靠度逐步复利。脚手架能买分的三个地方:

1. **检索**:找到该读的文件,是无声的瓶颈。SWE-agent 的 ACI、OpenHands 的文件索引、Aider 的 repo-map,都在攻这个点。
2. **验证器循环**:跑测试、读堆栈、重试,在 SWE-bench 上值 10+ 个点。
3. **失败遏制**:出错即回滚的沙箱,防止损失复利。同一个模型,有和没有验证器循环,看起来像两个产品。

### 基准饱和与真实分布

OpenHands 的作者和 Epoch AI 都指出:SWE-bench Verified 有一条简单尾巴——500 个任务中 161 个只需改 1–2 行。高分数部分由这条尾巴驱动。SWE-bench Pro 只收 10 行以上改动,前沿系统的分数回落到 23–59%。你的生产分布,几乎肯定更接近 Pro 而不是 Verified。

对选型的启示:用你自己的 bug 积压,跑一个 Pro 式子集。要紧的分数,是在"代表你交付物"的任务上的分数。

```figure
a5-scaffold-delta
```

## 投入使用

`code/main.py` 在固定的迷你任务分布上对比两种玩具智能体脚手架:

1. **JSON 工具调用**脚手架,每轮一个动作。
2. **CodeAct** 脚手架,每个动作可以发一小段 Python。

两者都用桩"模型"(确定性规则),这样对比就把脚手架与模型质量隔离开。输出显示:CodeAct 用更少轮次解决更多任务,代价是每个动作的爆炸半径更大。

## 交付

`outputs/skill-scaffold-audit.md` 帮你在采用一个编程智能体脚手架之前做审计:检索质量、验证器有无、沙箱隔离、基准与分布的匹配度。

## 练习

1. 运行 `code/main.py`。两种脚手架在同一任务集上各花多少轮?各自的单动作爆炸半径多大?

2. 读 OpenHands 论文(arXiv:2407.16741)。论文论证 CodeAct 在复杂任务上胜过 JSON 工具调用。找出一个论文承认的失败模式,用一句话说明它在生产中何时会占主导。

3. 从你的 bug 积压里挑一个需要跨两个文件改 10 行以上的任务。估计前沿模型在 (a) JSON 工具调用和 (b) CodeAct 下的端到端成功概率,并说明差距的理由。

4. SWE-bench Verified 有 161 个单文件、1–2 行的任务。构造一个剔除它们的分数。榜单会怎么洗牌?

5. 读《Introducing SWE-bench Verified》(OpenAI)。解释剔除含糊任务所用的具体方法,并说出一类筛选会漏掉的任务。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|---|---|---|
| SWE-bench | "编程基准" | 真实 GitHub issue,带 ground-truth 补丁和测试套件 |
| SWE-bench Verified | "精选子集" | 500 个人工精选任务,含简单尾巴 |
| SWE-bench Pro | "更难的子集" | 改 10 行以上;前沿仅 23–59% |
| CodeAct | "代码即动作" | 智能体发 Python;Jupyter 式 kernel 在沙箱中执行 |
| JSON 工具调用 | "函数调用" | 每个动作是执行前经校验的结构化 JSON 载荷 |
| 脚手架(Scaffold) | "智能体框架" | 基座模型外围的检索 + 规划器 + 执行器 + 验证器循环 |
| ACI(Agent-Computer Interface) | "SWE-agent 的格式" | 为 LLM 人体工学而非人类 shell 设计的命令集 |
| 验证器循环(Verifier loop) | "测试再重试" | 跑测试、读输出、改补丁;模型之外最大的可靠性增益 |

## 延伸阅读

- [Jimenez et al. — SWE-bench](https://www.swebench.com/) ——原始基准与方法论
- [OpenAI — Introducing SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/) ——精选子集如何构建
- [Wang et al. — OpenHands: An Open Platform for AI Software Developers](https://arxiv.org/abs/2407.16741) ——CodeAct 架构与事件流设计
- [Epoch AI — SWE-bench leaderboard](https://epoch.ai/benchmarks) ——实时跟踪的分数
- [Anthropic — Measuring agent autonomy](https://www.anthropic.com/research/measuring-agent-autonomy) ——长程编程智能体可靠性框架
