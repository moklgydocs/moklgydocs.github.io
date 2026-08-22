# 指令遵循作为对齐信号

> 之后对 RLHF 的每一种批评,矛头都对准这条流水线。在研究优化压力如何扭曲一个代理指标之前,你得先看见这个代理指标。InstructGPT(Ouyang 等人,2022)定义了参考架构:在指令-回答对上做监督微调,在成对偏好排序上训练奖励模型,再以对 SFT 策略的 KL 惩罚,对照奖励模型跑 PPO。一个 13 亿的 InstructGPT,在人类偏好上胜过了 1750 亿的 GPT-3。正是这一个结果,让 2026 年的每个前沿实验室仍在交付 RLHF 形状的后训练流水线。

**类型:** 学习
**编程语言:** Python(标准库,玩具三阶段流水线)
**前置要求:** 第 10 阶段 · 06(SFT),第 10 阶段 · 07(RLHF),第 10 阶段 · 08(DPO)
**预计耗时:** 约 45 分钟

## 学习目标

- 说出 InstructGPT 流水线的三个阶段,以及各阶段使用的损失
- 解释为什么 13 亿的指令微调模型在人类偏好评估上击败了原生的 1750 亿 GPT-3
- 说明第 3 阶段的 KL 惩罚在防什么,以及去掉它为什么会塌缩成模式搜寻行为
- 描述对齐税,以及 Ouyang 等人用来对付它的 PPO-ptx 缓解手段

## 问题

预训练语言模型做的是续写文本,不是回答问题。问 GPT-3"写一个反转列表的 Python 函数",你常常得到的是另一个提示词——因为训练分布的主体是网页文本,而网页文本的自然延续是更多网页文本。模型在尽职地工作,只是那份工作是错的。

每个正经实验室用来修这个问题的代理指标,是人类偏好:两个补全交给评分员,评分员挑更好的一个,奖励模型学习这个评分员。然后一个 RL 循环把策略推向奖励模型打高分的输出。三句话,这就是 InstructGPT 的全部论点——论文剩下的部分都是工程。

## 概念

### 第 1 阶段:监督微调(SFT)

收集提示-回答对,其中的回答是善意人类会写出的那种。Ouyang 等人用了来自标注员和 OpenAI API 的 13,000 个提示,用标准交叉熵损失在数据上微调基座模型。

SFT 给你的是:模型现在会回答问题,而不是续写问题。它给不了你的是:当多个回答都说得通时,评分员偏好哪一个的信号。

### 第 2 阶段:奖励模型(RM)

对每个提示,从 SFT 模型采样 K 个补全,标注员给它们排序。训练一个奖励模型,给任意提示-回答对打分,使得当 `y_w` 优于 `y_l` 时:

```
L_RM = -log sigmoid(r(x, y_w) - r(x, y_l))
```

这就是 Bradley-Terry 成对偏好损失。RM 通常从 SFT 模型初始化,把 LM 头换成标量头。

奖励模型很小:175B 的 InstructGPT,6B 的 RM 就够。它们也很脆弱——论文第 5 节大部分在讲小规模下就出现的奖励破解行为。

### 第 3 阶段:带 KL 惩罚的 PPO

定义目标:

```
J(pi) = E_{x~D, y~pi(.|x)} [ r(x, y) ] - beta * KL(pi(.|x) || pi_SFT(.|x))
```

用 PPO 最大化。KL 项防止 `pi` 漂离 SFT 策略太远。没有它,优化器会找到对抗样本——在 RM 上得高分的字符串,不是因为人类真的偏好它们,而是因为 RM 从没见过它们。

KL 系数 `beta` 是 RLHF 里最重要的单一超参数:太低,奖励破解;太高,相对 SFT 毫无改进。

### 对齐税

RLHF 之后,模型更受人类偏好,却在标准基准(SQuAD、HellaSwag、DROP)上退步。Ouyang 等人称之为对齐税(alignment tax),并用 PPO-ptx 修复:把预训练梯度混进 RL 目标,让模型不忘记如何做那些它从未被奖励过的下游任务。

```
J_ptx(pi) = J(pi) + gamma * E_{x~D_pretrain} [ log pi(x) ]
```

PPO-ptx 成了标准。Anthropic、DeepMind 和 Meta 都在用某种变体。

### 结果

一个 1.3B 的 InstructGPT(SFT + RM + PPO-ptx),被标注员偏好于 175B 基座 GPT-3 的比例约 70%,在来自生产流量的隐藏测试提示上差距更大。从这个数字里要读出两件事:

1. 对齐是与能力不同的轴。175B 模型能力更强,1.3B 模型对齐更好,而标注员偏好对齐的那个。
2. 能力地板由基座模型决定。你无法用 RLHF 让基座模型学会它从未见过的事实。

### 为什么这是第 18 阶段的参照点

后面每一课的批评——奖励破解(第 2 课)、DPO(第 3 课)、谄媚(第 4 课)、CAI(第 5 课)、潜伏智能体(第 7 课)、对齐伪装(第 9 课)——都在攻击这条流水线的某一段:奖励破解攻击第 2 阶段;DPO 把第 2、3 阶段合并;CAI 换掉人类标注员;谄媚证明标注员是有偏的信号;对齐伪装证明策略可以完全绕过第 3 阶段。脑子里不先装着这条流水线,这些批评一个也跟不上。

```figure
al-instruct-pipeline
```

## 投入使用

`code/main.py` 在玩具偏好数据上模拟三个阶段:基座"策略"是动作 {A, B, C} 上的偏置硬币。第 1 阶段 SFT 在 200 个提示上模仿标注员动作;第 2 阶段从 500 个成对排序拟合 Bradley-Terry 奖励模型;第 3 阶段跑带对 SFT 策略 KL 惩罚的简化 PPO 更新。你能看着奖励爬升、KL 散度增长、策略漂移——也能关掉 KL 项,看奖励破解在 50 个更新步内出现。

观察点:

- `beta = 0.1` 与 `beta = 0.0` 下的奖励轨迹。
- 训练步数上的 KL(pi || pi_SFT)。
- 最终动作分布与标注员偏好的对比。

## 交付

本课产出 `outputs/skill-instructgpt-explainer.md`。给它一段 RLHF 流水线描述或论文摘要,它能识别哪一阶段被修改了、各阶段用的什么损失、是否存在 KL 惩罚或等效正则。

## 练习

1. 跑 `code/main.py`。设 `beta = 0.0`,报告 200 个 PPO 步后的动作分布,用一段话解释模式搜寻行为。

2. 把奖励模型改成对动作 B 有 +0.5 偏置(模拟奖励 bug),以 `beta = 0.1` 跑 PPO。KL 惩罚能阻止策略利用这个偏置吗?`beta` 低到多少时,利用行为变得可见?

3. 读 Ouyang 等人(arXiv:2203.02155)图 1。分别跑 1、5、20、100 步 PPO 并测量对 SFT 模型的偏好,复现标注员偏好曲线。

4. 论文第 4.3 节报告 1.3B InstructGPT 约 70% 的情况下胜过 175B GPT-3。为什么在隐藏的生产提示上,这个比例会比在标注员自己的提示上更高?

5. 在同样的偏好数据上,把 PPO 损失换成 DPO(第 10 阶段 · 08)。比较最终策略漂移(对 SFT 的 KL)与最终奖励:在奖励相同时,哪种方法漂得更远?

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|-----------------|------------------------|
| SFT | "指令微调" | 第 1 阶段:在提示-回答对上做交叉熵微调 |
| 奖励模型(Reward model) | "那个 RM" | 在成对标注上用 Bradley-Terry 训练的、(prompt, response) 上的标量回归器 |
| Bradley-Terry | "成对偏好损失" | -log sigmoid(r_w - r_l);把成对排序归约为二分类 |
| KL 惩罚(KL penalty) | "那个正则" | `beta * KL(pi \|\| pi_SFT)`——把 RL 策略拴在 SFT 锚点附近 |
| PPO-ptx | "混预训练的 PPO" | 往 PPO 目标里加一份预训练对数似然,抵消对齐税 |
| 对齐税(Alignment tax) | "RLHF 的退步" | RLHF 之后在 RLHF 未针对的标准基准上的下降 |
| 标注员偏好(Labeler preference) | "那个 ground truth" | 人类排序的样本;RM 是它的统计代理,不是"人类价值观"的代理 |

## 延伸阅读

- [Ouyang et al. — Training language models to follow instructions with human feedback (arXiv:2203.02155)](https://arxiv.org/abs/2203.02155)——InstructGPT 论文,此后一切 RLHF 流水线的基础
- [Stiennon et al. — Learning to summarize from human feedback (arXiv:2009.01325)](https://arxiv.org/abs/2009.01325)——RLHF 用于摘要的前身
- [Christiano et al. — Deep reinforcement learning from human preferences (arXiv:1706.03741)](https://arxiv.org/abs/1706.03741)——基于偏好的 RL 原始表述
- [Bai et al. — Training a Helpful and Harmless Assistant with RLHF (arXiv:2204.05862)](https://arxiv.org/abs/2204.05862)——Anthropic 对 InstructGPT 流水线的 HH 扩展
