# 具身 VLA:RT-2、OpenVLA、π0、GR00T

> 第一次有模型从网站上读下一道菜谱、再在厨房机器人上把它做出来,是 RT-2(Google DeepMind, 2023 年 7 月)。RT-2 把动作离散化成文本 token,在 网络数据 + 机器人动作数据 上共同微调一个 VLM,证明了网络规模的视觉-语言知识能迁移到机器人控制。OpenVLA(2024 年 6 月)交付了开放的 7B 参考实现;Physical Intelligence 的 π0 系列(2024–2025)加上了 flow matching 动作专家;NVIDIA 的 GR00T N1(2025 年 3 月)为人形机器人交付了规模化的双系统(System 1 / System 2)控制。VLA 原语——vision-language-action,一个能看、能读、能行动的单一模型——正是本阶段理解模型与第 15 阶段自主系统之间的桥梁。

**类型:** 学习
**编程语言:** Python(标准库,动作分词器 + VLA 推理骨架)
**前置要求:** 第 12 阶段第 05 课(LLaVA)、第 15 阶段(自主系统,引用)
**预计耗时:** 约 180 分钟

## 学习目标

- 描述动作分词:离散分箱编码(RT-2)、FAST 高效动作 token、连续 flow matching 动作(π0)。
- 解释为什么在 网络 + 机器人 数据上共同微调,能把通用知识迁移保留到全新任务上。
- 在同一个机器人任务上对比 OpenVLA(开放 7B Llama+VLM)、π0(flow matching)和 GR00T N1(双系统)。
- 说出 Open X-Embodiment 数据集及其作为 RT-X 训练语料的角色。

## 问题

"按自然语言指令做家务的机器人"是 1970 年代就有的研究目标。2020 年代的答案是视觉-语言-动作(VLA)模型:与 VQA 同款的 VLM 架构,但输出是动作(关节力矩、末端执行器位姿、离散指令)而不是文本。

VLA 特有的挑战:

1. 动作空间是连续的(关节角、力)且高维(7 自由度机械臂 + 3 自由度夹爪 = 30 Hz 下 10 维)。
2. 机器人专属训练数据稀缺。Open X-Embodiment 约 100 万条轨迹;网络图文是 50 亿+。
3. 控制频率要紧。30 Hz 控制环意味着每个动作只有 33ms 预算。
4. 安全。一个错误动作,可能损坏硬件、伤人或毁物。

## 概念

### 动作分词(RT-2)

RT-2 的戏法:把每个关节目标表示成量化的文本 token。把归一化的 [-1, 1] 区间离散成 256 个 bin,每个 bin 映射到一个词表 ID。一个 10 自由度动作,每个控制步就是 10 个 token。

在混合数据上共同微调一个 PaLM-X VLM:

- 网络图文对(描述、VQA)。
- 机器人示教,动作以 token 表示。

模型看到 "pick up the red cube"(语言)→ 图像(视觉)→ 10 token 的动作序列(离散化关节目标)。网络预训练保住了通用知识迁移:RT-2 能执行"move towards the fast-moving object",尽管"fast-moving"不在训练数据里。

RT-2 论文中的推理速度是 3–5 Hz,受限于 VLM 自回归解码。

### OpenVLA —— 开放的 7B 参考

OpenVLA(Kim et al., 2024 年 6 月)是 RT-2 的开放权重等价物:7B Llama 骨干,DINOv2 + SigLIP 双视觉编码器,256 bin 动作分词。

在 Open X-Embodiment(22 种机器人的 97 万条轨迹)上训练,附带 LoRA 微调支持,可适配新机器人。

推理:A100 上量化后 4–5 Hz。慢速操作够用,高频控制不够。

### FAST 分词器 —— 更快的动作解码

Pertsch et al.(2024)证明离散分箱分词效率低——多数动作挤在 bin 空间的一小块区域。FAST(频域动作序列分词器)用 DCT 压缩动作序列,再量化系数。

30 步的动作轨迹变成约 10 个 FAST token,而不是 300 个离散分箱 token。推理提速 3–5 倍,质量无损。

### π0 与 flow matching 动作

Physical Intelligence 的 π0(Black et al., 2024 年 10 月)用 flow matching 动作专家取代离散动作 token:

- 一个小动作 Transformer 读取 VLM 的隐状态,经 rectified flow 输出连续的 50 步动作序列。
- 动作头用 flow matching 损失训练;VLM 预训练原样不动。
- 推理:约 5 步去噪吐出一整条动作序列,等效 50 Hz 控制。

π0 的主张:在一大批操作任务上击败 OpenVLA 和 Octo。连续动作形式保住了离散化毁掉的平滑性。

π0.5 和 π0-FAST 是渐进升级;π0-FAST 把 FAST 分词与 flow matching 结合。

### GR00T N1 —— 人形机器人的双系统

NVIDIA 的 GR00T N1(2025 年 3 月)为人形机器人(>30 自由度,全身)打造:

- **System 2:** 大 VLM 读 场景 + 指令,以约 1 Hz 产出高层子目标。
- **System 1:** 小动作头 Transformer,以子目标为条件,产出 50–100 Hz 的低层关节指令。

这个拆分对应卡尼曼的"快思慢想":System 2 负责计划,System 1 负责行动。好处:慢速的 VLM 级计划不会阻塞快速控制;System 1 保持小巧保延迟。

GR00T N1.7(2025 年末)改进了数据规模化;GR00T 用 Omniverse 的 sim-to-real 数据微调。

### Open X-Embodiment

训练数据。RT-X(2023 年 10 月)汇集了 22 个数据集、22 种机器人的 100 万条轨迹。Open X-Embodiment 是人人都在用的语料:

- ALOHA / Bridge V2 / Droid / RT-2 Kitchen / Language Table。
- 每个样本:(机器人状态, 相机视角, 指令, 动作序列)。
- 训练卫生:统一动作空间、归一化关节范围、缩放相机画面。

OpenVLA 和 π0 都在 Open X-Embodiment 上训练。到具体机器人的域差,靠 100–1000 条任务特定示教做 LoRA 微调来弥合。

### 共同微调 vs 只训机器人

共同微调把网络 VQA 数据与机器人轨迹混合。比例要紧:VQA 太多,模型忘记动作;机器人数据太多,模型丢掉通用知识。

RT-2 的比例约 1:1;OpenVLA 约 0.5:1(网络:机器人);π0 相近。精确比例是按数据集规模调的超参数。

只训机器人,产出的是在分布外指令上失败的任务特定模型。共同微调,就是 "pick up the red cube(示教原话)" 与 "pick up the third largest object from the left(全新措辞)" 之间的差别。

### 安全与动作限制

每个生产 VLA 都附带:

- 硬关节限制(力矩不超规格)。
- 速度限制(软钳制)。
- 工作空间边界(末端执行器不出桌沿)。
- 新任务的人工在环批准。

这些都作为控制层检查,位于 VLA 之外。VLA 的输出是建议,不是命令。

```figure
mm-action-tokens
```

## 投入使用

`code/main.py`:

- 实现 256 bin 动作分词与反分词。
- 勾画基于 DCT + 量化的 FAST 分词器。
- 对比每个动作步的 token 数:离散分箱 vs FAST vs 连续 flow。
- 打印 RT-2 → OpenVLA → π0 → GR00T 的谱系摘要。

## 交付

本课产出 `outputs/skill-vla-action-format-picker.md`。给定机器人任务(操作、导航、人形全身),在 离散分箱 + RT-2、FAST + OpenVLA、flow matching + π0、双系统 + GR00T 中做选择。

## 练习

1. 10 自由度机械臂,30 Hz 控制频率。256 bin 离散分词每秒吐多少 token?7B VLM 跟得上吗?

2. FAST 分词把 30 步轨迹压到约 10 token。如果轨迹有高频运动(比如打鼓),用户会失去什么?

3. π0 的 flow matching 头约 5 步去噪。与 OpenVLA 4–5 Hz 的自回归解码对比吞吐。

4. GR00T 的 System 1 / System 2 拆分对应卡尼曼。提出另一种拆分(System 3?),可能有助于双足行走。

5. 读 Open X-Embodiment 第 4 节数据策展。说出防止域泄漏的三条策展规则。

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|-----------------|------------------------|
| VLA | "视觉-语言-动作" | 输入 图像 + 指令、输出动作指令的模型 |
| 动作分词 | "离散分箱" | 把连续关节目标按维度量化成 256 个 bin,每个 bin 一个词表 ID |
| FAST 分词器 | "频域动作 token" | DCT + 量化,把 30 步轨迹压成约 10 个 token |
| 共同微调 | "网络 + 机器人混训" | 网络 VQA 数据与机器人示教一起训练,保住通用知识 |
| Flow matching 动作头 | "π0 连续输出" | 经 rectified flow 输出 50 步动作序列的小 Transformer |
| System 1 / System 2 | "双系统控制" | 大 VLM 慢计划,小动作头快执行;GR00T 模式 |
| Open X-Embodiment | "RT-X 数据集" | 跨机器人的 100 万轨迹数据集;训练语料 |

## 延伸阅读

- [Brohan et al. — RT-2 (arXiv:2307.15818)](https://arxiv.org/abs/2307.15818)
- [Kim et al. — OpenVLA (arXiv:2406.09246)](https://arxiv.org/abs/2406.09246)
- [Black et al. — π0 (arXiv:2410.24164)](https://arxiv.org/abs/2410.24164)
- [NVIDIA — GR00T N1 (arXiv:2503.14734)](https://arxiv.org/abs/2503.14734)
- [Open X-Embodiment Collab — RT-X (arXiv:2310.08864)](https://arxiv.org/abs/2310.08864)
