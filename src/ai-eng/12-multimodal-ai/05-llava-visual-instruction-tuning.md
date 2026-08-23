# LLaVA 与视觉指令微调

> LLaVA(2023 年 4 月)是这个星球上被抄得最多的多模态架构。它把 BLIP-2 的 Q-Former 换成一个 2 层 MLP,把 Flamingo 的门控交叉注意力换成朴素的 token 拼接,训练数据是 15.8 万轮由 GPT-4 从纯文本标注生成的视觉指令。2023 到 2026 年间,凡是搭过 VLM 的从业者,搭的都是 LLaVA 的某个变体。LLaVA-1.5 加了 AnyRes,LLaVA-NeXT 提了分辨率,LLaVA-OneVision 用一套配方统一了单图、多图和视频。本课精读这套配方,实现投影器,并解释为什么"更简单的赢了"。

**类型:** 动手构建
**编程语言:** Python(标准库,投影器 + 指令模板构造器)
**前置要求:** 第 12 阶段第 02 课(CLIP)、第 11 阶段(LLM 工程——指令微调)
**预计耗时:** 约 180 分钟

## 学习目标

- 搭一个 2 层 MLP 投影器,把 ViT patch 嵌入(1024 维)映射到 LLM 嵌入维度(4096 维)。
- 走通 LLaVA 两阶段配方:(1) 在 55.8 万图文对上对齐投影器;(2) 在 15.8 万 GPT-4 生成指令轮上做视觉指令微调。
- 构造 LLaVA 格式提示:图像 token 占位符、系统提示、user/assistant 轮次。
- 解释为什么社区从 Q-Former 转向 MLP——尽管 Q-Former 在 token 预算上占优。

## 问题

BLIP-2 的 Q-Former(第 12.03 课)把一张图压成 32 个 token。干净、高效、刷榜好用。但它有两个问题。

第一,Q-Former 可训练,但它的损失不是最终任务。第 1 阶段训 ITC+ITM+ITG,第 2 阶段训 LM 损失。查询学到的是某种中间表示,LLM 还得再去解码它。信息在瓶颈里丢了。

第二,Q-Former 有 1.88 亿参数,而且在 LLaVA 所处的 2023 年规模下,你得让它与目标 LLM 共同设计。换 LLM,重训 Q-Former;换视觉编码器,重训。每种组合都是一个独立的研发项目。

LLaVA 的答案简单到让人不好意思:把 ViT 的 576 个 patch token 逐个过一个 2 层 MLP(`1024 → 4096 → 4096`),全部 576 个直接倒进 LLM 的输入序列。没有瓶颈,没有第 1 阶段那些奇怪目标的预训练,就是直接在 LM 损失上训 MLP。

数据从哪来?LLaVA 的第二个洞察:用 GPT-4(纯文本)生成指令数据。把一张图的 COCO 标注和边界框数据喂给 GPT-4,让它产出对话、详细描述和复杂推理问题。15.8 万轮指令-回答,零成本,零人工标注。

结果:一个 8 张 A100 跑一天的 VLM,在 MMMU 上击败 Flamingo,还交付了社区可以扩展的开放检查点。到 2023 年底,它已衍生出 50 多个 fork。

## 概念

### 架构

13B 的 LLaVA-1.5:

- 视觉编码器:CLIP ViT-L/14 @ 336(第 1 阶段冻结,第 2 阶段可选解冻)。
- 投影器:2 层 MLP,GELU 激活,`1024 → 4096 → 4096`。
- LLM:Vicuna-13B(后来换 Llama-3.1-8B)。

图像 + 文本提示的前向:

```
img -> ViT -> 576 patches of dim 1024
patches -> MLP -> 576 tokens of dim 4096
prompt: system + "<image>" placeholder + user question
replace <image> token with the 576 projected tokens
feed the full sequence to the LLM
decode response
```

图像占 LLM 上下文的 576 个 token。2048 上下文时,文本还剩 1472 个 token;3.2 万上下文时,这只是个零头。

### 第 1 阶段:投影器对齐

冻结 ViT,冻结 LLM,只训 2 层 MLP。数据:55.8 万图文对(LAION-CC-SBU)。损失:以投影后的图像 token 为条件,对标注文本做语言建模。

批次 128 训一个 epoch,几小时完事。投影器学会把 ViT 空间映射到 LLM 空间,没有任何任务特定监督。

### 第 2 阶段:视觉指令微调

解冻投影器(保持可训练),解冻 LLM(通常全量,有时 LoRA)。在 15.8 万视觉指令轮上训练。

指令数据是戏法所在。Liu et al. 这样生成它:

1. 取一张 COCO 图像。
2. 抽出文本描述(5 条人工标注 + 边界框列表)。
3. 用三种提示模板发给 GPT-4:
   - 对话:"围绕这张图,生成一段用户与助手之间的来回对话。"
   - 详细描述:"给出这张图丰富、详细的描述。"
   - 复杂推理:"提出一个需要对这张图推理的问题,并回答它。"
4. 把 GPT-4 的输出解析成(指令, 回答)对。

整个过程不直接碰图像——只碰文本描述。GPT-4 会幻觉出看似合理的图像内容,有噪声,但管用:15.8 万轮,足以解锁对话能力。

### 为什么社区抄它

- 没有第 1 阶段专属损失要调。全程 LM 损失。
- 投影器几小时训完,不是几天。
- LLM 可换(LLaVA-Llama2、LLaVA-Mistral、LLaVA-Llama3),只需重训投影器。
- 视觉指令数据流水线用 GPT-4,换新领域时重新生成很便宜。

### LLaVA-1.5 与 LLaVA-NeXT

LLaVA-1.5(2023 年 10 月)新增:

- 学术任务数据(VQA、OKVQA、RefCOCO)混入指令微调。
- 更好的系统提示。
- 上下文 2048 → 3.2 万。

LLaVA-NeXT(2024 年 1 月)新增:

- AnyRes:把高分辨率图切成 2x2 或 1x3 的 336x336 切块网格,外加一张全局低清缩略图。每块 576 token,每张图共约 2880 个视觉 token。OCR 和图表任务大涨。
- 更好的指令数据配比,加入 ShareGPT4V(GPT-4V 生成的高质量标注)。
- 更强的基座 LLM(Mistral-7B、Yi-34B)。

### LLaVA-OneVision

第 12.08 课会深入讲 OneVision。简版:同一个投影器,但用覆盖单图、多图和视频的课程式训练,在一个模型里共享视觉 token 预算。

### 与 Q-Former 对比

| | Q-Former(BLIP-2) | MLP(LLaVA) |
|---|---|---|
| 每图视觉 token | 32 | 576(基础)或 2880(AnyRes) |
| 可训练参数 | 1.88 亿 + LM | 4000 万 + LM |
| 第 1 阶段损失 | ITC+ITM+ITG | 仅 LM |
| 更换 LLM | 需要重训 | 少量重训即可换 |
| 多图 | 别扭 | 自然(拼接) |
| 视频 | 别扭 | 自然(逐帧拼接) |
| token 预算 | 小 | 大 |

MLP 赢在简单与 token 灵活性,Q-Former 赢在 token 预算。到 2023 年底,token 预算不再是约束(LLM 上下文涨到 3.2 万–12.8 万+),简单性胜出。

### 提示格式

```
A chat between a curious human and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the human's questions. USER: <image> Describe this image in detail. ASSISTANT: The image shows ...
```

`<image>` 是占位 token。分词前,它被替换成 576 个视觉 token(AnyRes 下 2880 个)。分词器看到的序列比训练时略长,但 LLM 能处理这种新输入——第 1 阶段已经教过它了。

### 参数经济

LLaVA-1.5-7B 的拆解:

- CLIP ViT-L/14 @ 336:3.03 亿(第 1 阶段冻结,第 2 阶段常解冻)。
- 投影器(2 个线性层):约 2200 万可训练。
- Llama-7B:70 亿。
- 合计:73 亿参数。第 2 阶段可训练:全部 70 亿 + 2200 万投影器。

第 2 阶段训练成本:8 张 A100 约 20 小时。这是关键数字——一天、一个节点、可复现。这就是 LLaVA 席卷的原因。

```figure
mm-llava-projector
```

## 投入使用

`code/main.py` 实现:

1. 纯 Python 的 2 层 MLP 投影器(玩具规模,16 → 32 → 32 维)。
2. 提示构建流水线:系统提示 + `<image>` 替换为 N 个投影 token + user 轮 + assistant 生成占位。
3. 一个可视化:576 token 的视觉块在 LLM 上下文里长什么样(占 2k / 3.2 万 / 12.8 万上下文的百分比)。

## 交付

本课产出 `outputs/skill-llava-vibes-eval.md`。给定一个 LLaVA 家族检查点,跑一套 10 题的感觉评估(3 描述、3 VQA、2 推理、2 拒答),输出人类可读的成绩单。不是基准,是冒烟测试——确认投影器与 LLM 接通良好。

## 练习

1. 计算 `1024 → 4096 → 4096` 的 2 层 MLP 投影器的可训练参数量。含 GELU 和 bias,占 LLaVA-13B 的几分之几?

2. 构造一个"拒答"场景的 LLaVA 提示——图中含有隐私个人。写出期望的助手回答。LLaVA 为什么应该零样本拒答,需要什么训练数据来强化拒答?

3. 读 LLaVA-NeXT 博客的 AnyRes 一节。计算 1344x672 图像在 AnyRes 下的视觉 token 数,与 336x336 下的基础 576 token 对比。

4. LLaVA 第 1 阶段用标注文本上的 LM 损失训练投影器。如果跳过第 1 阶段直接进第 2 阶段(视觉指令微调)会怎样?引 Prismatic VLMs 的消融(arXiv:2402.07865)给出答案。

5. LLaVA-Instruct-150k 用 GPT-4 + COCO 标注生成指令。换一个新领域(医疗 X 光、卫星影像),描述生成领域指令的四步数据流水线。每一步可能出什么错?

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|----------------|------------------------|
| 投影器 | "MLP 桥" | 带 GELU 的 2 层 MLP,把 ViT 维度映射到 LLM 维度 |
| 图像 token | "&lt;image&gt; 占位符" | 推理前被替换成 N 个投影视觉 token 的提示标记 |
| 视觉指令微调 | "LLaVA 第 2 阶段" | 在 GPT-4 生成的(图像, 指令, 回答)三元组上训练 |
| 第 1 阶段对齐 | "投影器预训练" | 冻结 ViT 与 LLM,用标注文本上的 LM 损失训投影器 |
| AnyRes | "多切块平铺" | 把高分辨率图切成切块网格,拼接每块的视觉 token |
| LLaVA-Instruct | "GPT-4 生成" | 由 COCO 标注 + GPT-4 合成的 15.8 万指令-回答对 |
| 视觉编码器冻结 | "骨干锁定" | 第 1 阶段 CLIP 权重不更新,第 2 阶段有时也不更新 |
| ShareGPT4V | "更好的标注" | GPT-4V 生成的 100 万条稠密标注,用于更高质量的对齐 |
| VQA | "视觉问答" | 回答关于图像的自由形式问题的任务 |
| Prismatic VLMs | "设计空间论文" | Karamcheti 2024 的消融,系统测试投影器与数据选择 |

## 延伸阅读

- [Liu et al. — Visual Instruction Tuning (arXiv:2304.08485)](https://arxiv.org/abs/2304.08485) — LLaVA 论文。
- [Liu et al. — Improved Baselines with Visual Instruction Tuning (arXiv:2310.03744)](https://arxiv.org/abs/2310.03744) — LLaVA-1.5。
- [Chen et al. — ShareGPT4V (arXiv:2311.12793)](https://arxiv.org/abs/2311.12793) — 稠密标注数据集。
- [Karamcheti et al. — Prismatic VLMs (arXiv:2402.07865)](https://arxiv.org/abs/2402.07865) — 设计空间消融。
- [Li et al. — LLaVA-OneVision (arXiv:2408.03326)](https://arxiv.org/abs/2408.03326) — 单图、多图、视频统一。
