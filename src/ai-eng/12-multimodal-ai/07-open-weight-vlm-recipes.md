# 开放权重 VLM 配方:什么才真正重要

> 2024–2026 年的开放权重 VLM 文献,是一片消融表格的森林。Apple 的 MM1 测了 13 种 图像编码器、连接器、数据配比 的组合;Allen AI 的 Molmo 证明详细人工标注胜过 GPT-4V 蒸馏;Cambrian-1 跑了 20 多个编码器对比;Idefics2 把五轴设计空间形式化;Prismatic VLMs 在受控基准上比了 27 种训练配方。从所有这些噪声里,有一小组结论跨论文成立:图像编码器比连接器架构重要,数据配比又比前两者都重要,而详细人工标注胜过蒸馏合成数据。本课替你读完那些表格。

**类型:** 学习 + 实验
**编程语言:** Python(标准库,消融表解析器 + 配方挑选器)
**前置要求:** 第 12 阶段第 05 课(LLaVA 基线)
**预计耗时:** 约 180 分钟

## 学习目标

- 说出 VLM 的五轴设计空间:图像编码器、连接器、LLM、数据配比、分辨率调度。
- 读懂 MM1 / Idefics2 / Cambrian-1 的消融表,预判哪个旋钮能撬动哪个基准。
- 给定算力预算和任务组合,为新 VLM 挑一套配方(编码器、连接器、数据、分辨率)。
- 解释为什么同等 token 量下,详细人工标注胜过 GPT-4V 蒸馏。

## 问题

开放权重 VLM 数以百计。"好"与"SOTA"之间的差距,大多不在架构,而在数据、分辨率调度和编码器选择。模型表现不佳时知道先拧哪个旋钮,能替你避开一个 500 万 GPU 时的错误。

2023 年那波(LLaVA-1.5、InstructBLIP、MiniGPT-4)跑在 标注对预训练 + LLaVA-Instruct-150k 上,是不错的基线,MMMU 封顶约 35%。

2024 年那波(MM1、Idefics2、Molmo、Cambrian-1、Prismatic VLMs)做了穷举式消融,结果出人意料且实用。

## 概念

### 五轴设计空间

Idefics2(Laurençon et al., 2024)命名了这五根轴:

1. **图像编码器。** CLIP ViT-L/14、SigLIP SO400m/14、DINOv2 ViT-g/14、InternViT-6B。编码器在 patch 大小、分辨率和预训练目标上各不相同。
2. **连接器。** MLP(2–4 层)、Q-Former(32 查询 + 交叉注意力)、Perceiver Resampler(64 查询)、C-Abstractor(卷积 + 双线性池化)。
3. **语言模型。** Llama-3 8B / 70B、Mistral 7B、Phi-3、Gemma-2、Qwen2.5。LLM 规模是参数成本的大头。
4. **训练数据。** 标注对(CC3M、LAION)、交错(OBELICS、MMC4)、指令(LLaVA-Instruct、ShareGPT4V、PixMo、Cauldron)。
5. **分辨率调度。** 固定 224/336/448、AnyRes、原生动态。训练中爬坡或恒定。

每个生产 VLM 都在每根轴上做一个选择。MMMU 分数的方差,大部分由轴 1、4、5 解释——而不是你选了哪个连接器。

### 轴 1:编码器 > 连接器

MM1 第 3.2 节显示:从 CLIP ViT-L/14 换成 SigLIP SO400m/14,MMMU 涨 3+ 分;连接器从 MLP 换成 Perceiver Resampler,涨不到 1 分。Idefics2 复现:SigLIP > CLIP;同等 token 数下 Q-Former ≈ MLP ≈ Perceiver。

Cambrian-1 的"视觉编码器擂台"(Tong et al., 2024)在以视觉为中心的基准(CV-Bench)上跑了 20 多个编码器。榜首是 DINOv2 与 SigLIP 的混合;CLIP 居中;ImageBind 和 ViT-MAE 偏下。从 CLIP ViT-L 到 DINOv2 ViT-g/14,CV-Bench 上差约 5–7 分。

2026 年开放 VLM 的默认编码器是 SigLIP 2 SO400m/14(语义 + 稠密特征);需要时与 DINOv2 ViT-g/14 特征拼接(Cambrian 的"空间视觉聚合器"就这么干)。

### 轴 2:连接器设计无关紧要

MM1、Idefics2、Prismatic 和 MM-Interleaved 得出同一结论:视觉 token 数固定时,连接器架构几乎无所谓。在相同 token 预算下,均值池化 patch 上的 2 层 MLP,与 32 查询 Q-Former 的差距在 1 分以内。

真正重要的是 token 数。视觉 token 越多 = LLM 算得越多 = 性能越好,直到收益递减。每图 64 token 对 OCR 太少;576–1024 token 是多数开放 VLM 的甜点位;2048+ 只对文档和图表有帮助。

Q-Former vs MLP 是成本问题,不是质量问题:Q-Former 不分图像分辨率,把 token 封顶在 32–64;MLP 吐出全部 patch token。高分辨率输入下 Q-Former 省 LLM 上下文;低分辨率下,差异是噪声。

### 轴 3:LLM 规模决定天花板

LLM 从 7B 翻倍到 13B,在每篇 VLM 论文里都可靠地带来 MMMU 2–4 分。到 70B,大多数基准饱和。VLM 的多模态推理天花板,就是 LLM 的文本推理天花板——视觉编码器只能喂料,不能替它推理。

这就是为什么 Qwen2.5-VL-72B 和 Claude Opus 4.7 在 MMMU-Pro 和 ScreenSpot-Pro 上碾压:语言大脑足够大。7B 的 VLM,无法靠巧妙的连接器设计顶替 70B 的 VLM。

### 轴 4:数据 —— 详细人工标注胜过蒸馏

Molmo + PixMo(Deitke et al., 2024)是 2024 年每个人都该读的结果。Allen AI 让标注员用 1–3 分钟的稠密口述描述图像,产出 71.2 万张稠密标注图。训练数据里没有任何 GPT-4V 蒸馏。

Molmo-72B 在 11 个基准上全部击败 Llama-3.2-90B-Vision。差距不在架构,在标注质量。详细人工标注每张图的信息量是短网络标注的 5–10 倍,而且锚定事实;GPT-4V 蒸馏则会幻觉。

ShareGPT4V(Chen et al., 2023)和 Cauldron(Idefics2)走的是同一 playbook,混合 人工 + GPT-4V 标注。趋势很清晰:面向 2026 前沿,标注密度 > 标注数量 > 蒸馏便利性。

### 轴 5:分辨率及其调度

Idefics2 的消融:384 → 448 涨 1–2 分;448 → 980 配图像切分(AnyRes),OCR 基准再涨 3–5 分。恒定分辨率训练在中等准确率处进入平台;分辨率爬坡(224 起步,448 或原生收官)训练更快、终点更高。

Cambrian-1 跑了 分辨率 vs token 的权衡:算力固定,你可以"更多 token、更低分辨率"或"更少 token、更高分辨率"。OCR 选高分辨率;通用场景理解选 低分辨率多 token。

2026 年生产配方:第 1 阶段固定 384 训练;OCR 重的任务,第 2 阶段用最高 1280 的动态分辨率。

### Prismatic 的受控对比

Prismatic VLMs(Karamcheti et al., 2024)是把所有轴都控住的那篇:同一个 13B LLM、同一份指令数据、同一套评估,一次只变一根轴。结果:

- 每图视觉 token 数解释约 60% 方差。
- 编码器选择解释约 20%。
- 连接器架构解释约 5%。
- 其余(数据配比、调度器、学习率)分剩下约 15%。

这是粗略分解,但它是文献中对"我该先消融什么"最干净的回答。

### 2026 年选型器

综合所有证据,2026 年新项目的开放 VLM 默认配方:

- **编码器:** 原生分辨率 NaFlex 的 SigLIP 2 SO400m/14;需要分割/定位时,拼接 DINOv2 ViT-g/14 的稠密特征。
- **连接器:** patch token 上的 2 层 MLP。除非 token 受限,别用 Q-Former。
- **LLM:** Qwen2.5 / Llama-3.1 / Gemma 2;要成本选 7B,要质量选 70B,按目标延迟定。
- **数据:** PixMo + ShareGPT4V + Cauldron,再补任务特定的指令数据。
- **分辨率:** 动态(长边最小 256、最大 1280 像素)。
- **调度:** 第 1 阶段对齐(只训投影器),第 2 阶段全量微调,第 3 阶段任务特定微调。

以上每个默认值,都能追溯到本课末尾所引论文中的某个实测消融。

```figure
l5-vlm-recipe-knobs
```

## 投入使用

`code/main.py` 是消融表解析器兼配方挑选器。它内置(精简版)MM1 和 Idefics2 消融表,支持查询:

- "给定预算 X、任务 Y,哪个配方赢?"
- "7B Llama 上把 SigLIP 换成 CLIP,MMMU 预期变化多少?"
- "想要 80% 置信度的答案,我该先消融哪根轴?"

输出是按预期基准变化排序的配方列表,附"先消融"建议。

## 交付

本课产出 `outputs/skill-vlm-recipe-picker.md`。给定目标任务组合、算力预算和延迟目标,产出完整配方(编码器、连接器、LLM、数据配比、分辨率调度),每个选择都引用支撑它的消融。防止工程师每开一个新 VLM 项目就把 Idefics2 消融表重造一遍。

## 练习

1. 读 MM1 第 3.2 节。固定 2B LLM、预算 5000 万图,哪个编码器赢?换成 13B LLM 答案会翻转吗?为什么?

2. Cambrian-1 发现:DINOv2 + SigLIP 拼接在视觉中心基准上胜过任一单用,但在 MMMU 上没有增量。预测哪些基准会涨、哪些持平。

3. 你的目标是 2B LLM 上的移动 UI 智能体。选出编码器、连接器、分辨率和数据配比,每个选择都用具体消融表论证。

4. Molmo 交付 4B 和 72B 两个模型。4B 能与闭源 7B VLM 竞争;72B 在 11/11 个基准上击败 Llama-3.2-90B-Vision。这对"LLM 规模平台期"假说意味着什么?

5. 设计一张消融表,在 7B VLM 上把 数据配比质量 与 编码器质量 隔离开。最少要多少次训练?给出四个轴的设定。

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|-----------------|------------------------|
| 消融 | "拧一个旋钮" | 跑多次训练,每次只在设计空间的一根轴上不同,其余全部恒定 |
| 连接器 | "桥"/"投影器" | 把视觉编码器输出映射到 LLM token 空间的可训练模块(MLP、Q-Former、Perceiver) |
| 详细人工标注 | "稠密标注" | 多句人写描述(通常 80–300 token),比网络 alt 文本信息量大得多 |
| 蒸馏 | "GPT-4V 标注" | 由更强的专有 VLM 生成的训练数据;方便,但会继承幻觉 |
| AnyRes / 动态分辨率 | "高分辨率路径" | 通过平铺或 M-RoPE,把大于编码器原生分辨率的图像喂进去的策略 |
| 分辨率爬坡 | "课程式" | 从低分辨率起步逐渐提高的训练调度,加速对齐学习 |
| 视觉中心基准 | "CV-Bench / BLINK" | 强调细粒度视觉感知而非语言重头推理的评估 |
| PixMo | "Molmo 的数据" | Allen AI 的 71.2 万稠密标注图像数据集;人工口述转写为稠密标注 |

## 延伸阅读

- [McKinzie et al. — MM1 (arXiv:2403.09611)](https://arxiv.org/abs/2403.09611)
- [Laurençon et al. — Idefics2 / What matters building VLMs (arXiv:2405.02246)](https://arxiv.org/abs/2405.02246)
- [Deitke et al. — Molmo and PixMo (arXiv:2409.17146)](https://arxiv.org/abs/2409.17146)
- [Tong et al. — Cambrian-1 (arXiv:2406.16860)](https://arxiv.org/abs/2406.16860)
- [Karamcheti et al. — Prismatic VLMs (arXiv:2402.07865)](https://arxiv.org/abs/2402.07865)
