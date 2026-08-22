# Reflexion:语言化强化学习

> 基于梯度的 RL 修一个失败模式,要几千次试验和一个 GPU 集群。Reflexion(Shinn 等,NeurIPS 2023)用自然语言做到:每次试验失败后,智能体写一段反思,存进情景记忆,下一次试验以这段记忆为条件。这就是 Letta 睡眠时计算、Claude Code 的 CLAUDE.md 学习记录和 pro-workflow 的 learn-rule 背后的模式。

**类型:** 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 01(智能体循环)、第 14 阶段 · 02(ReWOO)
**预计耗时:** 约 60 分钟

## 学习目标

- 说出 Reflexion 的三个组件(Actor、Evaluator、Self-Reflector)和情景记忆的作用。
- 用纯标准库实现 Reflexion 循环:二元评估器、反思缓冲区、全新重试。
- 针对给定任务,在标量、启发式和自评反馈源之间做选择。
- 解释为什么语言化强化能抓住梯度 RL 需要数千次试验才能修掉的错误。

## 问题

智能体任务失败了。标准 RL 的做法是再跑几千次试验、算梯度、更新权重。昂贵、缓慢,而且大多数生产智能体没有为每次失败训练的预算。

Reflexion(Shinn 等,arXiv:2303.11366)问的是另一个问题:如果智能体只是想一想*为什么*失败,然后带着这个想法再试一次呢?不更新权重,不算梯度,只是在两次试验之间存一段自然语言。

结果:ALFWorld 上击败 ReAct 和其他非微调基线;HotpotQA 上优于 ReAct;代码生成(HumanEval/MBPP)上创下当时 SOTA。全程没有一步梯度。

## 概念

### 三个组件

```
Actor         : generates a trajectory (ReAct-style loop)
Evaluator     : scores the trajectory — binary, heuristic, or self-eval
Self-Reflector: writes a natural-language reflection on the failure
```

外加一个数据结构:

```
Episodic memory: list of prior reflections, prepended to the next trial's prompt
```

一次试验由 Actor 跑轨迹,Evaluator 打分。分数低,Self-Reflector 就写一段反思("我选错了工具,因为我把问题误读成问 X,其实它问的是 Y")。反思进情景记忆。下一次试验从头开始,但能看到这段反思。

### 三种评估器

1. **标量** —— 外部二元信号。ALFWorld 成功或失败,HumanEval 测试通过或不通过。最简单,信号最强。
2. **启发式** —— 预定义的失败特征。"智能体连续两次产出相同动作,判为卡住。""轨迹超过 50 步,判为低效。"
3. **自评** —— LLM 给自己的轨迹打分。没有 ground truth 可用时的选择。信号较弱;与工具落地验证(第 05 课 CRITIC)搭配效果好。

2026 年的默认是混合:有标量用标量,没有用自评,启发式当安全栏。

### 为什么它能推广

Reflexion 与其说是新算法,不如说是一个被命名的模式。几乎每个生产级"自愈"智能体都在跑某种变体:

- Letta 的睡眠时计算(第 08 课):一个独立智能体反思过去的对话,写入记忆块。
- Claude Code 的 `CLAUDE.md` / "save memory" 模式:反思作为学习记录被捕获,prepend 到未来的会话。
- pro-workflow 的 `/learn-rule` 命令:纠正被捕获为显式规则。
- LangGraph 的反思节点:给输出打分、必要时路由去改进的节点。

全都源于同一个洞察:自然语言是足够丰富的媒介,能把"我从失败中学到了什么"跨运行携带。

### 何时有效,何时无效

Reflexion 有效的条件:

- 有清晰的失败信号(测试失败、工具报错、答案错误)。
- 任务类别可复现(同类问题会再次出现)。
- 反思有改进轨迹的空间(动作预算足够)。

Reflexion 无效的情形:

- 智能体第一次就成功了。
- 失败是外部的(网络断了、工具坏了)——对"网络断了"的反思帮不了未来的运行。
- 反思变成迷信——把一次偶发抖动的运行存成了叙事。

2026 年的坑:记忆腐化(memory rot)。反思不断累积,有的已过时或是错的;情景缓冲区越大,重跑越慢。缓解:定期压缩(第 06 课)、给反思设 TTL,或让一个独立的睡眠时清理智能体处理(Letta)。

```figure
react-trace
```

## 动手构建

`code/main.py` 在一个玩具谜题上实现 Reflexion:产出一个和为目标值的 3 元素列表。Actor 给出候选列表;Evaluator 校验和;Self-Reflector 写一行问题出在哪。反思进入情景记忆,供下次试验使用。

组件:

- `Actor` —— 一个脚本化策略,看到反思会改进。
- `Evaluator.binary()` —— 目标和的通过/不通过。
- `SelfReflector` —— 生成一行失败诊断。
- `EpisodicMemory` —— 带 TTL 语义的有界列表。

运行:

```
python3 code/main.py
```

轨迹展示三次试验:第 1 次失败,存入反思;第 2 次看到反思、有改进但仍失败;第 3 次成功。对比基线运行(无反思)——它会一直卡在第 1 次的答案上。

## 投入使用

LangGraph 把反思做成节点模式。Claude Code 的 `/memory` 命令和 pro-workflow 的 `/learn-rule` 把情景缓冲区外置成 markdown 文件。Letta 的睡眠时计算在空闲期跑 Self-Reflector,主智能体保持低延迟。OpenAI Agents SDK 没有直接内置 Reflexion;你自己拼:用一个按分数拒绝轨迹的自定义 Guardrail,加一个跨运行存活的记忆 `Session`。

## 交付

`outputs/skill-reflexion-buffer.md`:创建并维护一个情景缓冲区,带反思捕获、TTL 和去重。给定任务类别和一次失败,它产出一段真正能帮助下次试验的反思(而不是泛泛的"下次仔细点")。

## 练习

1. 把二元评估器换成返回距离指标(离目标多远)的标量评估器。收敛更快吗?
2. 给反思加 10 次试验的 TTL。超过之后,旧反思是有害还是有益?
3. 实现启发式评估器:同一动作重复就判为卡住。它与 Self-Reflector 如何相互作用?
4. 用一个无视反思的对抗性 Actor 跑 Reflexion。强迫 Actor 注意到反思,最少需要怎样的反思提示词工程?
5. 读 Reflexion 论文第 4 节 ALFWorld 部分。概念上复现 130% 的成功率提升:相对朴素 ReAct 的关键差异是什么?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| Reflexion | "自我纠正" | Shinn 等 2023 —— Actor、Evaluator、Self-Reflector 加情景记忆 |
| 语言化强化 | "无梯度学习" | 把自然语言反思 prepend 到下次试验的提示词 |
| 情景记忆 | "逐任务的反思" | 一个任务类别的有界反思缓冲区 |
| 标量评估器 | "二元成功信号" | 来自 ground truth 的通过/不通过或数值分数 |
| 启发式评估器 | "基于模式的检测器" | 预定义失败特征(如循环卡住、步数过多) |
| 自评评估器 | "自己当裁判的 LLM" | 无 ground truth 时的低信号兜底——与工具落地验证搭配 |
| 记忆腐化 | "陈旧反思" | 情景缓冲区塞满过时条目;用压缩/TTL 修 |
| 睡眠时反思 | "异步自我反思" | Self-Reflector 离开热路径运行,主智能体保持快速 |

## 延伸阅读

- [Shinn 等,《Reflexion:用语言化强化学习的语言智能体》(arXiv:2303.11366)](https://arxiv.org/abs/2303.11366) —— 经典论文
- [Letta,《睡眠时计算》](https://www.letta.com/blog/sleep-time-compute) —— 生产中的异步反思
- [Anthropic,《AI 智能体的高效上下文工程》](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) —— 把情景缓冲区当上下文的一部分管理
- [LangGraph 概览](https://docs.langchain.com/oss/python/langgraph/overview) —— 反思节点模式
