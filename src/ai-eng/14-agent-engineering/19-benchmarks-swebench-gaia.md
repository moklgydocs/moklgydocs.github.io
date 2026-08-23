# 基准:SWE-bench、GAIA、AgentBench

> 2026 年,三个基准锚定了智能体评估:SWE-bench 测代码打补丁,GAIA 测通用工具使用,AgentBench 测多环境推理。引用任何数字之前,先懂它们的构成、污染史,以及它们测不到什么。

**类型:** 学习
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 06(工具使用)
**预计耗时:** 约 60 分钟

## 学习目标

- 说出 SWE-bench 的测试机制(FAIL_TO_PASS),解释它为什么以单元测试为闸门。
- 解释 SWE-bench Verified(OpenAI,500 任务)为何存在、它去掉了什么。
- 描述 GAIA 的设计:对人类简单,对 AI 难;三个难度等级。
- 说出 AgentBench 的八个环境,以及开源 LLM 的主要瓶颈。
- 总结 SWE-bench+ 的污染发现及其含义。

## 问题

排行榜告诉你在某个基准上哪个模型赢。它不告诉你:

- 基准是否被污染(答案在训练数据里、测试泄漏)。
- 基准测的是不是你关心的(代码 vs 浏览 vs 通用)。
- 评估器是否健壮(AST 匹配、状态检查、人工评审)。

引用数字之前,先懂这三个锚定基准和它们的失败模式。

## 概念

### SWE-bench(Jimenez 等,ICLR 2024 oral)

- 来自 12 个流行 Python 仓库的 2,294 个真实 GitHub issue。
- 智能体拿到:修复前提交的代码库 + 自然语言 issue 描述。
- 智能体产出:一个补丁。
- 评估器:应用补丁,跑仓库的测试套件。补丁必须翻转 FAIL_TO_PASS 测试(之前失败、现在通过),且不弄坏 PASS_TO_PASS 测试。

SWE-agent(Yang 等,2024)发布时达到 12.5%,靠的是强调智能体-计算机接口(文件编辑器命令、模型看得懂的搜索语法)。

### SWE-bench Verified

OpenAI,2024 年 8 月。人工策展的 500 任务子集。去掉模糊 issue、不可靠测试和修复方法说不清的任务。"你的智能体能不能交付真补丁"的首选基准。

### 污染

- 超过 94% 的 SWE-bench issue 早于大多数模型的训练截止日。
- **SWE-bench+** 发现:成功补丁中 32.67% 存在解决方案泄漏(模型在 issue 文本里就看到了修法),31.08% 因测试覆盖薄弱而可疑。
- Verified 更干净,但并非无污染。

实践含义:SWE-bench 得 50% 的模型,在 SWE-bench+ 上可能只有 35%。声称 SWE-bench 成绩时,永远两个都报。

### GAIA(Mialon 等,2023 年 11 月)

- 466 题;私有排行榜(huggingface.co/gaia-benchmark)保留 300 题。
- 设计哲学:"概念上对人类简单(92%),对 AI 难(带插件的 GPT-4:15%)"。
- 测推理、多模态、网页、工具使用。
- 三个难度等级;Level 3 需要跨模态的长工具链。

GAIA 是用来测"通用能力"的。别和代码专项基准搞混。

### AgentBench(Liu 等,ICLR 2024)

- 8 个环境,横跨代码(Bash、DB、KG)、游戏(Alfworld、LTP)、网页(WebShop、Mind2Web)和开放式生成。
- 多轮,每个 split 约 4k–13k 轮。
- 主要发现:长程推理、决策和指令遵循,是开源 LLM 追赶商业模型的瓶颈。

### 这些测不到什么

- 真实运行成本(token、墙钟时间)。
- 对抗条件下的安全行为。
- 在你的领域上的表现(用你自己的评估,第 30 课)。
- 尾部失败(基准看平均;生产运维关心最差的 1%)。

### 基准测试在哪里出错

- **单一数字执念。** SWE-bench 50% 告诉你的,不如 P50/P75/P95 成本 + 步数分布多。
- **带污染的声明。** 报 SWE-bench 而不提 Verified 或 SWE-bench+,是误导。
- **把基准当开发目标。** 为基准优化,会与生产 usefulness 分道扬镳。

```figure
ae-swebench-gate
```

## 动手构建

`code/main.py` 实现一个玩具 SWE-bench 式框架:

- 合成修 bug 任务(3 个)。
- 一个提议补丁的脚本化"智能体"。
- 测试运行器:检查 FAIL_TO_PASS(bug 已修)和 PASS_TO_PASS(没有弄坏)。
- 一个按问题分解深度分类的 GAIA 式难度分类器。

运行:

```
python3 code/main.py
```

输出展示逐任务、逐难度的解决率,让评估器规则变得具体。

## 投入使用

- **SWE-bench Verified** 给代码智能体。永远报 Verified 分数。
- **GAIA** 给通用智能体。用私有排行榜 split。
- **AgentBench** 做多环境对比。
- **自定义评估**(第 30 课)对应你产品的真实形状。

## 交付

`outputs/skill-benchmark-harness.md`:为任何"代码库-任务"对构建 SWE-bench 式框架,带 FAIL_TO_PASS / PASS_TO_PASS 闸门。

## 练习

1. 把玩具框架移植到真实仓库(挑一个你自己的)上跑。为已知 bug 写 3 个 FAIL_TO_PASS 测试。
2. 加步数指标。在你的 3 个任务上,每次解决要多少智能体步?
3. 读 SWE-bench+ 论文。实现一个解决方案泄漏检查(把 issue 文本与 diff 做模式匹配)。
4. 从公开 split 下载一道 GAIA 题。推演一个 GPT-4 级智能体会怎么做,它需要哪些工具?
5. 读 AgentBench 的逐环境分解。哪个环境最像你的产品表面?那里的"SOTA"长什么样?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| SWE-bench | "代码智能体基准" | 2,294 个 GitHub issue;补丁必须翻转 FAIL_TO_PASS 测试 |
| SWE-bench Verified | "干净的 SWE-bench" | 500 个人工策展任务,OpenAI |
| FAIL_TO_PASS | "修复闸门" | 之前失败、补丁后必须通过的测试 |
| PASS_TO_PASS | "无回归闸门" | 之前通过、必须仍然通过的测试 |
| GAIA | "通用基准" | 466 道人易机难的多工具问题 |
| AgentBench | "多环境基准" | 8 个环境;长程多轮 |
| 污染 | "训练集泄漏" | 基准任务出现在模型训练中 |
| SWE-bench+ | "污染审计" | 在 SWE-bench 成功补丁中发现 32.67% 的解决方案泄漏 |

## 延伸阅读

- [Jimenez 等,《SWE-bench》(arXiv:2310.06770)](https://arxiv.org/abs/2310.06770) —— 原始基准
- [OpenAI,SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/) —— 策展子集
- [Mialon 等,《GAIA》(arXiv:2311.12983)](https://arxiv.org/abs/2311.12983) —— 通用基准
- [Liu 等,《AgentBench》(arXiv:2308.03688)](https://arxiv.org/abs/2308.03688) —— 多环境套件
