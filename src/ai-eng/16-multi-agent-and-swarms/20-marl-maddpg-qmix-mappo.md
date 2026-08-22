# MARL —— MADDPG、QMIX、MAPPO

> 多智能体协调的强化学习血统,到 2026 年仍然滋养着 LLM 智能体系统。**MADDPG**(Lowe et al.,NeurIPS 2017,arXiv:1706.02275)提出了集中训练、分布执行(CTDE):训练时每个 critic 能看到所有智能体的状态和动作;测试时只跑本地的 actor。合作、竞争、混合场景都适用。**QMIX**(Rashid et al.,ICML 2018,arXiv:1803.11485)是带单调混合网络的价值分解;各智能体的 Q 组合成联合 Q,使 `argmax` 可以干净地分配到各智能体——在星际争霸多智能体挑战(SMAC)上长期占主导。**MAPPO**(Yu et al.,NeurIPS 2022,arXiv:2103.01955)是带集中式价值函数的 PPO;在粒子世界、SMAC、Google Research Football、Hanabi 上几乎不用调参就"出人意料地有效"。这些算法支撑着"必须分布式行动的智能体团队"的策略训练。MAPPO 是 **2026 年合作型 MARL 的默认基线**。本课用一个小型网格世界玩具把三个算法各搭一遍,在接触 LLM 智能体训练之前,先把这三个想法练成肌肉记忆。

**类型:** 学习
**编程语言:** Python(标准库,无 NumPy 的小实现)
**前置要求:** 第 09 阶段(强化学习)、第 16 阶段 · 09(并行蜂群网络)
**预计耗时:** 约 90 分钟

## 问题

LLM 智能体系统越来越多地要训练智能体间协调的策略:什么时候退让、什么时候行动、呼叫哪个同伴。告诉你怎么训练这类策略的文献叫多智能体强化学习(MARL),它比 LLM 浪潮更早,有一套小而精的主导算法。

没有模式词汇表就去读 MARL 论文是很痛苦的。集中训练分布执行(CTDE)、价值分解、集中式 critic 不是 buzzword——它们是针对具体问题的具体答案:

- 独立 RL(每个智能体各学各的)从每个智能体的视角看都是非平稳的。糟糕。
- 集中式 RL(一个智能体控制全部)无法扩展,而且违反执行约束。
- CTDE 两头的好处都要:训练时用全局信息,部署时用本地策略。

## 概念

### 论文常用的三个环境

- **粒子世界(multi-agent particle env)。** 简单 2D 物理,有合作/竞争任务。MADDPG 的原始试验场。
- **星际争霸多智能体挑战(SMAC)。** 合作型微操,部分可观测。QMIX 的试验场。离散动作、连续状态。
- **Google Research Football、Hanabi、MPE。** MAPPO 的基线。

不同环境的动作/观测类型不同。算法依此选型。

### MADDPG(2017)—— CTDE 模式

每个智能体 `i` 有一个 actor `mu_i(o_i)`,把自己的观测映射为动作。每个智能体还有一个 critic `Q_i(x, a_1, ..., a_n)`,训练时能看到所有观测和所有动作。actor 依据 critic 的评估做策略梯度更新。

```
actor update:    grad_theta_i J = E[grad_theta mu_i(o_i) * grad_a_i Q_i(x, a_1..n) at a_i=mu_i(o_i)]
critic update:   TD on Q_i(x, a_1..n) given next-state joint estimate
```

为什么用 CTDE:训练时我们知道所有人的动作,用它来降低每个 critic 的方差。部署时,每个智能体只看到 `o_i`,调用 `mu_i(o_i)`。

失败模式:critic 随智能体数 N 增长(输入包含所有动作)。不做近似的话,扩展到约 10 个智能体以上就不行了。

### QMIX(2018)—— 价值分解

仅用于合作场景。全局奖励是各智能体 Q 值的单调函数之和:

```
Q_tot(tau, a) = f(Q_1(tau_1, a_1), ..., Q_n(tau_n, a_n)),   df/dQ_i >= 0
```

单调性保证了 `argmax_a Q_tot` 可以通过每个智能体独立选择 `argmax_{a_i} Q_i` 来计算。这正是你需要的**分布式执行性质**。训练时,一个混合网络从各智能体的 Q 生成 `Q_tot`。

QMIX 为什么在 SMAC 上能赢:合作型星际争霸微操有着同构智能体、局部观测、全局奖励——简直是为价值分解量身定做的。

失败模式:单调性约束很苛刻;有些任务的奖励结构无法单调分解(比如某个智能体为团队牺牲)。扩展工作(QTRAN、QPLEX)放松了这一点。

### MAPPO(2022)—— 被低估的默认选项

多智能体 PPO:带集中式价值函数的 PPO。每个智能体有自己的策略;所有智能体共享(或各自拥有)能看到完整状态的价值函数。Yu et al. 2022 在五个基准上把 MAPPO 与 MADDPG、QMIX 及其扩展对比,发现:

- MAPPO 在粒子世界、SMAC、Google Research Football、Hanabi、MPE 上追平或击败了 off-policy MARL 方法。
- 几乎不需要调超参。
- 训练稳定;跨随机种子可复现。

在这篇论文之前,社区一直低估 on-policy MARL。到 2026 年,MAPPO 是合作型 MARL 的默认基线;任何新方法都必须先赢过它。

### 为什么 LLM 智能体工程师应该关心

三个直接用途:

1. **路由器训练。** 一个元智能体决定哪个子智能体处理任务。这是一个 MARL 问题:N 个分布式的子智能体加一个集中式路由器。MAPPO 正合适。
2. **角色涌现。** 在生成式智能体模拟中,训练智能体随时间形成互补角色,是一个伪装起来的 MARL 问题。QMIX 式价值分解从构造上强制了互补性。
3. **多智能体工具使用。** 当智能体共享工具并竞争预算时,用 CTDE 训练能产出尊重资源约束的可部署本地策略。

实务上的提醒:2026 年,大多数生产级 LLM 智能体系统用提示词而非训练来得到策略。只有当你同时具备 (a) 大量交互数据、(b) 明确的奖励信号、(c) 投入训练基础设施的意愿时,MARL 才登场。

### CTDE 作为 RL 之外的设计模式

即使不做训练,CTDE 也是一个有用的架构模式:

- *设计*时,假设团队完全可见。
- *运行*时,强制分布式执行:每个智能体只看到 `o_i`。

这个模式逼你把每个智能体的状态显式化,并提前思考部分可观测性。很多生产多智能体系统默默地假设处处共享状态——CTDE 纪律可以防止这一点。

### 非平稳性问题

多个智能体同时学习时,每个智能体的环境(其中包含其他智能体的策略)是非平稳的。经典单智能体 RL 的证明全部失效。本课的 MARL 算法都在解决这个问题:

- MADDPG:全局 critic 看到所有动作,所以它的价值估计是平稳的。
- QMIX:价值分解把学习搬到联合 Q 空间,在那里最优性有良好定义。
- MAPPO:集中式价值函数抑制了他人策略变化带来的方差。

在 LLM 智能体系统里,非平稳性表现为"我的智能体上个月还好好的,上游那个智能体一改,我的就开始行为异常"。用 CTDE 训练 MARL 是治本的修法;提示词层面的修补更快,但不持久。

### 本课不覆盖什么

训练真实网络是 第 09 阶段 的话题。本课构建的是脚本化策略版本,在没有梯度更新的情况下演示 CTDE、价值分解和集中式价值这三个模式。目标是先内化这些模式,再去上手完整的 MARL 库(PyMARL、MARLlib、RLlib multi-agent)。

```figure
sw-ctde
```

## 动手构建

`code/main.py` 在一个迷你 2 智能体合作网格世界上实现了三个模式演示:

- 环境:4x4 网格上 2 个智能体、一颗奖励豆。任一智能体到达奖励豆,奖励 = 1,任务结束。
- `IndependentAgents` —— 每个智能体把其他智能体当作环境。基线。
- `MADDPGStyle` —— 集中式 critic 计算联合价值;actor 策略据此更新。脚本化策略改进。
- `QMIXStyle` —— 带单调混合器的价值分解。
- `MAPPOStyle` —— 集中式价值函数;策略对着共享基线更新。

四组都跑相同的 episode,报告平均到达步数。CTDE 各变体收敛到比独立基线更短的路径。

运行:

```
python3 code/main.py
```

预期输出:独立智能体平均约 6 步;CTDE 各变体收敛到约 3.5 步(4x4 网格的最优是 3 步)。即使策略是脚本化的,模式差异也能显现出来。

## 投入使用

`outputs/skill-marl-picker.md` 是一个为给定多智能体任务挑选 MARL 算法的技能:合作 vs 竞争、同构 vs 异构、动作空间类型、规模、奖励信号。

## 交付

生产环境里的 MARL 很罕见。真要用的时候:

- **从 MAPPO 起步。** 2022 年的论文已把它确立为基线;先复现它,能省下数周追逐更花哨方法的时间。
- **记录每个智能体的观测流和动作流。** 没有逐智能体轨迹就去调试 MARL,是没指望的。
- **训练代码与执行代码分离。** CTDE 是一种纪律;让执行路径真的只看到 `o_i`。
- **奖励塑造警告。** MARL 对奖励设计极其敏感。奖励塑造里一个协调 bug,智能体就会学会钻空子。要跑对抗性测试。
- **对 LLM 智能体**,先考虑提示词级策略。只有当交互数据 + 奖励信号 + 基础设施三者齐备时,才值得投入 MARL 训练。

## 练习

1. 运行 `code/main.py`。测量独立智能体和 MAPPO 风格智能体在到达步数上的差距。换成 6x6 网格,差距会变大还是缩小?
2. 实现一个竞争变体:两个智能体、一颗奖励豆,只有先到的得奖励。哪种模式能干净地处理竞争?历史上是 MADDPG。
3. 阅读 MADDPG(arXiv:1706.02275)第 3 节。用你自己的话把 critic 更新规则用伪代码符号化地写出来。
4. 阅读 MAPPO(arXiv:2103.01955)。作者为什么论证集中式价值 + PPO 在他们的基准上胜过 off-policy MARL?列出最强的三条论据。
5. 把 CTDE 作为设计模式应用到一个假想的 LLM 智能体系统(例如 research agent + summarizer + coder)。设计时可用而运行时不可用的联合信息是什么?

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|----------|
| MARL | "多智能体 RL" | 面向多智能体系统的强化学习。 |
| CTDE | "集中训练、分布执行" | 训练用全局信息;部署用本地策略。 |
| MADDPG | "多智能体 DDPG" | CTDE,每个智能体的 critic 看到所有观测 + 动作。 |
| QMIX | "价值分解" | 各智能体 Q 的单调混合。仅合作。 |
| MAPPO | "多智能体 PPO" | 带集中式价值函数的 PPO。2026 年默认基线。 |
| 价值分解 | "个体 Q 之和" | 联合 Q 表示为各智能体 Q 的单调函数。 |
| 非平稳性 | "移动靶" | 他人学习时,每个智能体的环境都在变。MARL 的核心问题。 |
| On-policy / off-policy | "从当前策略学 / 从回放学" | PPO 是 on-policy(MAPPO);DDPG 和 Q-learning 是 off-policy。 |
| SMAC | "星际争霸多智能体挑战" | 合作微操基准;QMIX 的主场。 |

## 延伸阅读

- [Lowe et al. —— Multi-Agent Actor-Critic for Mixed Cooperative-Competitive Environments](https://arxiv.org/abs/1706.02275) —— MADDPG;NeurIPS 2017
- [Rashid et al. —— QMIX: Monotonic Value Function Factorisation for Deep Multi-Agent Reinforcement Learning](https://arxiv.org/abs/1803.11485) —— QMIX;ICML 2018
- [Yu et al. —— The Surprising Effectiveness of PPO in Cooperative Multi-Agent Games](https://arxiv.org/abs/2103.01955) —— MAPPO;NeurIPS 2022
- [BAIR 关于 MAPPO 的博客](https://bair.berkeley.edu/blog/2021/07/14/mappo/) —— MAPPO 结果的可读性阐述
- [SMAC 仓库](https://github.com/oxwhirl/smac) —— 星际争霸多智能体挑战
