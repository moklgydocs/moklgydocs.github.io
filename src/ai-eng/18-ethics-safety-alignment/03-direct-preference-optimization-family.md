# 直接偏好优化家族

> Rafailov 等人(2023)证明:RLHF 的最优解相对偏好数据有闭式表达,因此可以跳过显式奖励模型,直接优化策略。这个洞见催生了一个家族——IPO、KTO、SimPO、ORPO、BPO——各自修复 DPO 的一种失效模式。到 2026 年,直接对齐算法在前沿后训练中的采用量已超过 PPO。但第 2 课那条过度优化曲线依然成立:直接对齐算法逃不过古德哈特,只是换了被咬的位置。

**类型:** 学习
**编程语言:** Python(标准库,六变体偏好损失比较器)
**前置要求:** 第 18 阶段 · 01(InstructGPT)、第 18 阶段 · 02(奖励黑客)、第 10 阶段 · 08(DPO 基础)
**预计耗时:** 约 75 分钟

## 学习目标

- 从带 KL 的 RLHF 最优解推出 DPO 的闭式表达。
- 说出 IPO、KTO、SimPO、ORPO、BPO 各自修复 DPO 的哪种失效模式。
- 区分"隐式奖励差距"与"偏好强度",并解释为什么 IPO 的恒等映射很关键。
- 解释为什么 Rafailov 等人(NeurIPS 2024)证明了直接对齐算法即便没有显式 RM 也会过度优化。

## 问题

RLHF 的目标(第 1 课):

```
max_pi E_{x,y~pi} [ r(x, y) ] - beta * KL(pi || pi_ref)
```

有一个已知的最优解:

```
pi*(y|x) = (1/Z(x)) * pi_ref(y|x) * exp(r(x, y) / beta)
```

于是奖励可以由最优策略与参考策略之比隐式定义:

```
r(x, y) = beta * log(pi*(y|x) / pi_ref(y|x)) + beta * log Z(x)
```

把它代入 Bradley-Terry 偏好似然,配分函数 `Z(x)` 因为只依赖 `x` 而约掉了。剩下的是一个只含策略参数的损失——不再需要奖励模型。这就是 DPO。

麻烦在于:这个推导假设最优解可达、偏好数据在分布内、参考策略是真正的模式锚点。这三条都不严格成立。家族里的每个成员,修的都是某一条被违反的假设。

## 概念

### DPO(Rafailov 等,2023)

```
L_DPO = -log sigmoid(
  beta * log(pi(y_w | x) / pi_ref(y_w | x))
  - beta * log(pi(y_l | x) / pi_ref(y_l | x))
)
```

可能出什么问题:

- 隐式奖励差距 `beta * (log(pi/pi_ref)_w - log(pi/pi_ref)_l)` 是无界的。再微弱的偏好也能产生任意大的差距。
- 损失把被选中和被拒绝的对数概率往相反方向推。只要被拒绝的那个掉得更快,被选中者的绝对对数概率也可能被压低。这就是"被选中回答退化"(Degraded Chosen Response)现象。
- 分布外的偏好(罕见的回答 vs 另一个罕见的回答)会产生任意的隐式奖励。

### IPO(Azar 等,2024)

恒等偏好优化(Identity Preference Optimization)把 log-sigmoid 换成对偏好概率的恒等映射。损失变成对一个有界目标的平方误差:

```
L_IPO = (log(pi(y_w | x) / pi_ref(y_w | x)) - log(pi(y_l | x) / pi_ref(y_l | x)) - 1/(2 beta))^2
```

差距被 `1/(2 beta)` 封顶。偏好强度与隐式奖励差距成正比,不会爆掉。

### KTO(Ethayarajh 等,2024)

Kahneman-Tversky 优化彻底抛弃了成对结构。给定单个带标注的输出和一个"好/坏"的二值信号,把它映射到前景理论的效用:

```
v(x, y) = sigma(beta * log(pi(y|x) / pi_ref(y|x)) - z_ref)
```

收益和损失用不同的权重(损失厌恶)。好处:可以用不成对的数据,而不成对的数据要多得多。

### SimPO(Meng 等,2024)

简单偏好优化(Simple Preference Optimization)让训练信号与生成的过程对齐。完全移除参考策略,并用长度对数似然做归一化:

```
L_SimPO = -log sigmoid(
  (beta / |y_w|) * log pi(y_w | x)
  - (beta / |y_l|) * log pi(y_l | x)
  - gamma
)
```

外加一个稳定用的边距 `gamma`。长度归一化消除了利用 DPO 长度偏置失效模式的动机(按构造,`y_w` 越长对数概率差距越大)。

### ORPO(Hong 等,2024)

优势比偏好优化(Odds-Ratio Preference Optimization)在标准 SFT 负对数似然上加一个偏好项:

```
L_ORPO = L_NLL(y_w) + lambda * L_OR
L_OR = -log sigmoid(log(odds(y_w) / odds(y_l)))
```

没有参考策略——SFT 项本身就是正则。从基座模型到对齐模型单阶段训练,不需要单独的 SFT 检查点。

### BPO(ICLR 2026 投稿,OpenReview id=b97EwMUWu7)

它指出了"被选中回答退化"问题:DPO 保住了排序 `y_w > y_l`,但 `y_w` 的绝对对数概率可能下降。BPO 加了一行修正,惩罚被选中回答的向下移动。报告称在数学推理上,Llama-3.1-8B-Instruct 相比 DPO 提升了 +10.1% 的准确率。

### 普适结果:直接对齐算法照样过度优化

Rafailov 等人的《Scaling Laws for Reward Model Overoptimization in Direct Alignment Algorithms》(NeurIPS 2024)用 DPO、IPO、SLiC 在多个数据集、多个 KL 预算下训练策略。黄金奖励对 KL 的曲线,呈现出与 Gao 等人相同的"先登顶后崩塌"形状。训练中隐式奖励会查询分布外样本;KL 正则并不能稳住它。

直接对齐算法逃不出古德哈特。它只是把被咬的表面从"奖励模型被过度优化"换成了"参考策略比值被过度优化"。通用的解法——更好的数据、集成、早停——对两者都适用。

### 2026 年怎么选

- 有大规模成对偏好数据:用保守 beta 的 DPO;长度偏置明显就用 SimPO。
- 只有不成对的二值反馈:KTO。
- 想从基座模型单阶段一把跑完:ORPO。
- DPO 日志里看到被选中回答的对数概率在退化:BPO。
- 偏好强度差异很大、DPO 出现饱和:IPO。

每家实验室都会把五种方法放在同一组基准上全跑一遍,按任务挑胜者。没道理认为数学推理和安全任务的最优解是同一个。

```figure
dpo-margin
```

## 投入使用

`code/main.py` 在一个玩具偏好数据集上比较六种损失(DPO、IPO、KTO、SimPO、ORPO、BPO),其中真实的偏好强度因对而异。每种损失都在同一个 500 对样本上、用一个小型 softmax 策略优化。绘图展示每种方法的最终胜率、被选中对数概率漂移和隐式奖励分布宽度。

## 交付

本课产出 `outputs/skill-preference-loss-selector.md`。给定数据集统计特征(成对 vs 不成对、偏好强度均匀 vs 参差、长度分布)和目标(单阶段,还是先 SFT 再偏好),推荐一种偏好损失,并报告它防的是哪种失效模式。

## 练习

1. 运行 `code/main.py`。报告 DPO 和 BPO 最终的被选中对数概率下降幅度。BPO 应保留更高的被选中绝对概率——验证这一点。

2. 修改偏好数据,让所有对的强度相等。六种方法里谁最稳健?谁退化了?解释 IPO 在此处的优势。

3. 让被拒绝的回答平均比被选中的长 2 倍。其他什么都不动,用数值展示 DPO 的长度利用行为,以及 SimPO 的修复效果。

4. Rafailov 等人(NeurIPS 2024)声称直接对齐算法会过度优化。复现一个单点版本:画出"被选中减去被拒绝"的 KL 散度,观察大 beta 下 DPO 的过度优化。

5. 读 BPO 论文摘要(OpenReview b97EwMUWu7)。写下 BPO 加到 DPO 上的那一行修正,并对照 `code/main.py` 里的实现确认。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|-----------------|------------------------|
| DPO | "不要奖励模型的 RLHF" | 从 RLHF 最优解的闭式表达推出的损失;只含策略参数 |
| 隐式奖励 | "对数比" | `beta * log(pi(y\|x) / pi_ref(y\|x))` —— DPO 隐含的奖励 |
| IPO | "有界 DPO" | 用恒等映射替换 log-sigmoid;隐式奖励差距被 `1/(2 beta)` 封顶 |
| KTO | "不成对 DPO" | 在单标签上做带损失厌恶的前景理论效用 |
| SimPO | "无参考 DPO" | 长度归一化对数似然 + 边距;无参考策略 |
| ORPO | "单阶段 DPO" | NLL + 优势比偏好项;从基座模型一次训完 |
| BPO | "保护被选中者的 DPO" | DPO 加一个惩罚项,防止被选中回答的绝对对数概率下降 |
| 被选中者退化 | "chosen 往下掉" | 只要被拒绝者掉得更快,DPO 就会压低被选中者的对数概率 |
| DAA | "直接对齐算法" | 任何跳过显式 RM 的偏好损失方法 |

## 延伸阅读

- [Rafailov et al. — Direct Preference Optimization (NeurIPS 2023, arXiv:2305.18290)](https://arxiv.org/abs/2305.18290)
- [Azar et al. — A General Theoretical Paradigm to Understand Learning from Human Preferences (AISTATS 2024, arXiv:2310.12036)](https://arxiv.org/abs/2310.12036) —— IPO
- [Ethayarajh et al. — KTO: Model Alignment as Prospect Theoretic Optimization (arXiv:2402.01306)](https://arxiv.org/abs/2402.01306)
- [Meng, Xia, Chen — SimPO (NeurIPS 2024, arXiv:2405.14734)](https://arxiv.org/abs/2405.14734)
- [Hong, Lee, Thorne — ORPO (EMNLP 2024, arXiv:2403.07691)](https://arxiv.org/abs/2403.07691)
- [BPO — Behavior Preservation Optimization (ICLR 2026 OpenReview b97EwMUWu7)](https://openreview.net/forum?id=b97EwMUWu7)
- [Rafailov et al. — Scaling Laws for RM Overoptimization in DAAs (NeurIPS 2024, arXiv:2406.02900)](https://arxiv.org/abs/2406.02900)
