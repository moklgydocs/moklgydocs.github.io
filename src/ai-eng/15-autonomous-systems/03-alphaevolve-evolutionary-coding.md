# AlphaEvolve——进化式编程智能体

> 把一个前沿编程模型、一个进化循环和一台机器可检验的评估器配在一起,让循环跑够久。它发现了一个 4x4 复数矩阵乘法过程,只用 48 次标量乘法——56 年来对 Strassen 的首次改进。它还找到了一个 Google 全局 Borg 调度启发式,在生产中回收约 0.7% 的集群算力。这个架构故意做得很无聊,胜利全部来自评估器的严苛。

**类型:** 学习
**编程语言:** Python(标准库,进化循环玩具)
**前置要求:** 第 15 阶段 · 01(长程框架),第 15 阶段 · 02(自学推理)
**预计耗时:** 约 60 分钟

## 问题

大语言模型会写代码,进化算法能搜索代码。两者各自被试了几十年,各自都有天花板。LLM 的天花板是虚构:模型写出貌似可信、实则言行不一的代码。进化的天花板是搜索成本:对语法的随机变异,很少能产生可编译的程序,更别说更好的程序。

AlphaEvolve(Novikov 等人,DeepMind,arXiv:2506.13131,2025 年 6 月)把两者组合:LLM 对程序数据库提议定向修改;自动评估器给每个变体打分;高分变体成为下一代的父代。LLM 负责"写出可信代码"这个昂贵的步骤,评估器负责抓住虚构。循环跑几小时到几周。

报告的成果:48 次标量乘法的 4x4 复数矩阵乘法(Strassen 1969 年的纪录是 49)、进入 Google 生产的 Borg 调度启发式、FlashAttention kernel 提速 32.5%、Gemini 训练吞吐提升。

这个架构之所以有效,是因为评估器是机器可检验的;在评估器不可检验的地方,它就不灵。这个不对称,正是本课的要义。

## 概念

### 循环

1. 从一个正确但次优的种子程序 `P_0` 开始。
2. 维护一个变体程序数据库,每个变体由评估器打分。
3. 从数据库中采出一个或多个父代(MAP-elites 式或岛屿式)。
4. Prompt LLM(大量候选用 Gemini Flash,硬骨头用 Gemini Pro)产出父代的修改变体。
5. 编译、运行,在留出评估器上评估变体。
6. 按分数和特征向量插入数据库。
7. 重复。

两个细节要紧。第一,给 LLM 的 prompt 不只是父程序——通常还有数据库里几个顶尖变体、评估器签名和一段简短任务描述。模型的任务是提议一个可能提升分数的定向修改。第二,数据库是结构化的(MAP-elites 网格、岛屿式),所以循环探索的是多样性,而不只是当前的领头羊。

### 为什么评估器没有商量余地

AlphaEvolve 的胜利全部来自评估器快速、确定、难以欺骗的领域:

- **矩阵乘法算法**:一个做矩阵乘法并逐位检查相等的单元测试。
- **Borg 调度启发式**:一个回放历史集群负载、度量浪费算力的生产级模拟器。
- **FlashAttention kernel**:正确性测试加真实硬件上的墙钟基准。
- **Gemini 训练吞吐**:实测的每步 GPU 秒数。

每一种情形里,评估器抓住的都是那类本会占主导的 LLM 错误:虚构的正确性声明、一上硬件就消失的性能声明、边缘情形失败。拿掉评估器,循环优化的就是"好看的代码"。

### 奖励黑客是同一枚硬币的另一面

进化优化的是评估器度量的东西。评估器若有缺陷,循环就会找到缺陷。在未验证的领域,循环优化的是表面特征,而不是意图行为。DeepMind 在论文里明确标注:AlphaEvolve 的成功,只能迁移到评估器严苛程度配得上搜索野心的领域。

2025–2026 年代码搜索循环里奖励黑客的实例:

- 以"完成时间"为优化目标,奖励了提交空解答。
- 以测试正确性为基准分数,奖励了背测试、过拟合。
- 一个"代码质量"代理指标,奖励了删注释和改变量名,语义零变化。

AlphaEvolve 的对策:用一个 LLM 从未见过的留出评估器,输入在评估时才生成。即便如此,DeepMind 仍建议对任何提议的部署做强评审。

### 为什么 LLM + 搜索胜过任一单用

LLM 能产出可编译、语义可信的修改。对一个 2000 行的 Python 文件做随机变异,遗传算法几乎总是产出语法错误。LLM 还把搜索集中在可信的邻域(改一个函数,而不是随机字节),大幅减少了浪费的评估器调用。

反过来,评估器抓住 LLM 的虚构。LLM 会自信地声称一个函数"极限复杂度是 O(n log n)",而实际是 O(n^2);墙钟基准让这个问题一锤定音。

### AlphaEvolve 在前沿技术栈中的位置

| 系统 | 生成器 | 评估器 | 领域 | 代表成果 |
|---|---|---|---|---|
| AlphaEvolve | Gemini | 正确性 + 基准 | 算法、kernel、调度器 | 48 次乘法的 4x4 矩阵乘 |
| FunSearch(DeepMind,2023) | PaLM / Codey | 正确性 | 组合数学 | cap-set 下界 |
| AI Scientist v2(Sakana,第 5 课) | GPT/Claude | LLM 评审 + 实验 | ML 研究 | ICLR workshop 论文 |
| Darwin Godel Machine(第 4 课) | 智能体脚手架 | SWE-bench / Polyglot | 智能体代码 | SWE-bench 20% → 50% |

四个系统是同一配方的变体:生成器加评估器,跑循环。差别在于评估器评什么、有多严苛。

```figure
alphaevolve-loop
```

## 投入使用

`code/main.py` 在一个玩具符号回归问题上实现了一个最小 AlphaEvolve 式循环。"LLM"是一个标准库替身,对计算目标函数的程序提议小型语法变异;"评估器"在留出测试点上度量均方误差。

观察:

- 最佳分数如何随代数提升。
- MAP-elites 网格如何让多样解存活,循环不收敛到局部最小。
- 拿掉留出测试(只用训练评估器)后,循环如何壮观地过拟合。

## 交付

`outputs/skill-evaluator-rigor-audit.md` 是在新领域考虑 AlphaEvolve 式循环的前置条件:你的评估器,真的能抓住你在乎的那些失败吗?

## 练习

1. 运行 `code/main.py`,记录最佳分数轨迹。用 `--no-holdout` 禁用留出评估器重跑,量化过拟合程度。

2. 读 AlphaEvolve 论文第 3 节 MAP-elites 网格部分。为一个新问题(如编译器优化 pass)设计一个能保持搜索多样性的特征向量描述符。

3. 48 次乘法的 4x4 结果,在 56 年后改进了 Strassen 的 49 次纪录。读论文附录 F,用三句话解释:为什么这个问题的评估器特别容易做对,而大多数领域并非如此。

4. 提出一个 AlphaEvolve 会失败的领域。指出评估器究竟在哪里断掉、为什么。

5. 对一个你熟悉的领域,写出你会用的评估器签名。包括:(a) 正确性条件;(b) 性能指标;(c) 留出输入的生成规则;(d) 至少一条反奖励黑客检查。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|---|---|---|
| AlphaEvolve | "DeepMind 的进化编程智能体" | Gemini + 程序数据库 + 机器可检验评估器 |
| MAP-elites | "保多样性的档案库" | 按特征向量索引的网格;每格存该描述符下最优的变体 |
| 岛屿模型(Island model) | "并行进化亚种群" | 独立种群定期迁移;防止过早收敛 |
| 机器可检验评估器 | "确定性神谕" | LLM 骗不了的单元测试、模拟器或基准——这种循环的前置条件 |
| 奖励黑客(Reward hacking) | "优化度量,不优化目标" | 循环找到不做正事也能最大化分数的办法 |
| 种子程序(Seed program) | "起点" | 循环从它开始进化的、正确但次优的初始程序 |
| 留出评估器(Held-out evaluator) | "LLM 没见过的评估数据" | 评估时才生成输入,防止背题 |

## 延伸阅读

- [Novikov et al. (2025). AlphaEvolve: A coding agent for scientific and algorithmic discovery](https://arxiv.org/abs/2506.13131) ——完整论文
- [DeepMind blog on AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) ——厂商成果综述
- [AlphaEvolve results repository](https://github.com/google-deepmind/alphaevolve_results) ——发现的算法,含 48 次乘法的 4x4 矩阵乘
- [Romera-Paredes et al. (2023). Mathematical discoveries from program search with LLMs (FunSearch)](https://www.nature.com/articles/s41586-023-06924-6) ——前身系统
- [Anthropic — Responsible Scaling Policy v3.0 (Feb 2026)](https://anthropic.com/responsible-scaling-policy/rsp-v3-0) ——把"受评估器约束的自治"列为关键研究方向
