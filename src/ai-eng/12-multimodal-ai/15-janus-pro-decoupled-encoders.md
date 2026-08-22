# Janus-Pro:为统一多模态模型解耦编码器

> 统一多模态模型有一个无法回避的张力。理解要语义特征——SigLIP 或 DINOv2 的输出向量,富含概念级信息;生成要利于重建的编码——能拼回清晰像素的 VQ token。这两个目标,单个编码器兼容不了。Janus(DeepSeek, 2024 年 10 月)和 Janus-Pro(DeepSeek, 2025 年 1 月)主张:解法就是别再试了——把两个编码器解耦。任务间共享 Transformer 主体,但理解走 SigLIP,生成走 VQ 分词器。70 亿参数下,Janus-Pro 在 GenEval 上击败 DALL-E 3,MMMU 上追平 LLaVA。本课精读:为什么两个编码器能成,一个不行。

**类型:** 动手构建
**编程语言:** Python(标准库,双编码器路由 + 共享主体信号)
**前置要求:** 第 12 阶段第 13 课(Transfusion)、第 12 阶段第 14 课(Show-o)
**预计耗时:** 约 120 分钟

## 学习目标

- 解释为什么单个共享编码器,必然在理解或生成质量上有所妥协。
- 描述 Janus-Pro 的路由:理解方向输入侧用 SigLIP 特征,生成方向输入输出都用 VQ token。
- 追踪让 Janus-Pro 成功而 Janus 未成的数据规模放大。
- 对比解耦(Janus-Pro)、耦合连续(Transfusion)、耦合离散(Show-o)三种架构。

## 问题

统一模型在理解与生成之间共享一个 Transformer 主体。此前的尝试(Chameleon、Show-o、Transfusion)两个方向都用同一个视觉分词器,而分词器就是个妥协品:

- 为重建优化(生成):VQ-VAE 抓住细粒度像素细节,但产出的 token 语义连贯性弱。
- 为语义优化(理解):SigLIP 嵌入把"猫"图聚到"猫"文本附近,但重建不出好像素。

Show-o 和 Transfusion 为此在其中一个方向上付了明显的质量税。Janus-Pro 问:两个任务需求不同,为什么非得共用一个分词器?

## 概念

### 解耦视觉编码

Janus-Pro 的架构把两个编码器分开:

- **理解路径。** 输入图像 → SigLIP-SO400m → 2 层 MLP → Transformer 主体。
- **生成路径。** 输入图像(若以既有图像为条件)→ VQ 分词器 → token ID → Transformer 主体。
- **输出生成。** Transformer 预测的图像 token → VQ 解码器 → 像素。

Transformer 主体共享。主体上游和下游的一切,按任务专属。

输入按提示格式区分:`<understand>` 标签走 SigLIP,`<generate>` 走 VQ。或者路由按任务隐式确定。

### 为什么这样可行

理解损失拿到 SigLIP 特征——CLIP 式预训练本就为语义相似度调过。模型的感知基准因此好于 Show-o / Transfusion,因为输入特征更适合这个任务。

生成损失拿到 VQ token——分词器本就为重建调过。图像质量好于 Show-o,因为 VQ 码能干净地拼回像素。

共享 Transformer 主体看到两种输入分布(SigLIP 和 VQ),学着与两者共事。主张是:数据够多、参数够大,主体能把切换吸收掉。

### 数据放大 —— Janus vs Janus-Pro

Janus(原版,arXiv 2410.13848)提出了解耦,但规模小(13 亿参数,数据有限)。Janus-Pro(arXiv 2501.17811)放大:

- 70 亿参数(原 13 亿)。
- 第 1 阶段(对齐)9000 万图文对(原 7200 万)。
- 第 2 阶段(统一)7200 万(原 2600 万)。
- 第 3 阶段新增 20 万条图像生成指令样本。

结果:Janus-Pro-7B 在 MMMU 上追平 LLaVA(60.3 对约 58),GenEval 上击败 DALL-E 3(0.80 对 0.67)。一个开放模型,在统一光谱的两端都有竞争力。

### JanusFlow —— rectified flow 变体

JanusFlow(arXiv 2411.07975)把 VQ 生成路径换成 rectified flow 生成路径(连续)。分工变成:理解用 SigLIP + 生成用 rectified flow。质量天花板进一步抬高。架构仍是 解耦编码器 + 共享主体。

### 共享主体的职责

Transformer 主体处理统一序列,但面对两种输入分布。它的职责:

- 理解时:消费 SigLIP 特征 + 文本 token → 自回归输出文本。
- 生成时:消费文本 token +(可选的图像 VQ token)→ 自回归输出图像 VQ token。

主体没有按 block 分设的模态专属权重。它就是你在 Qwen 或 Llama 里会见到的那种文本式 Transformer,外加两个输入适配器。

有意思的是,这意味着 Janus-Pro 的主体可以从预训练 LLM 初始化——Janus-Pro 正是从 DeepSeek-MoE-7B 初始化的。这个选择很关键:LLM 贡献了推理能力,纯从零训练的统一模型很难达到。

### 与 InternVL-U 对比

InternVL-U(第 12.10 课)是 2026 年的续作,它组合了:

- 原生多模态预训练(InternVL3 骨干)。
- 解耦编码器路由(SigLIP 进,VQ + 扩散头出)。
- 统一的 理解 + 生成 + 编辑。

InternVL-U 把 Janus-Pro 的架构选择收编进一个更大的框架。解耦编码器的想法,如今是规模化统一模型的默认。

### 局限

解耦编码器增加了架构复杂度:两个分词器要训、两条输入路径要维护、两套失败模式。不需要生成的产品,用 Janus-Pro 是过度设计——选 LLaVA 家族的理解模型即可。

不需要理解的产品,Janus-Pro 是杀鸡用牛刀——选 Stable Diffusion 3 / Flux 即可。

两者都要的产品,Janus-Pro 就是当前的参考开放架构。

```figure
l5-janus-decouple
```

## 投入使用

`code/main.py` 模拟 Janus-Pro 路由:

- 两个模拟编码器:类 SigLIP(产 256 维语义向量)和类 VQ(产整数编码)。
- 一个提示路由器,按任务标签选编码器。
- 一个共享主体(替身),不管是哪个编码器产的,都处理 token 序列。
- 从第 1 阶段(对齐)到第 3 阶段(指令微调)的加权采样调度切换。

打印三个示例的路由路径:图像问答、文生图、图像编辑。

## 交付

本课产出 `outputs/skill-decoupled-encoder-picker.md`。给定一个想要接近前沿质量的 生成+理解 统一产品的需求,在 Janus-Pro、JanusFlow、InternVL-U 中做选择,并给出具体的数据规模建议。

## 练习

1. Janus-Pro-7B 在 GenEval 上击败 DALL-E 3。解释为什么 70 亿的开放模型能在生成上追平前沿专有模型,在理解上却不能。

2. 实现路由函数:给定提示文本,分类为 `understand` 或 `generate`。"describe and then sketch" 这类歧义提示怎么处理?

3. JanusFlow 把 VQ 路径换成 rectified flow。Transformer 主体现在输出什么,损失有何变化?

4. 为 Janus-Pro 架构提出第四个任务——只需再加一个解耦编码器。例如:图像分割(DINO 式)、深度估计(MiDaS 式)。

5. 读 Janus-Pro 第 4.2 节数据放大。相对 Janus,哪个数据阶段对文生图质量提升贡献最大?

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|-----------------|------------------------|
| 解耦编码 | "两个视觉编码器" | 按方向各配分词器/编码器:理解用语义型,生成用重建型 |
| 共享主体 | "一个 Transformer" | 单个 Transformer 处理任一编码器的输出;无模态专属权重 |
| 理解用 SigLIP | "语义特征" | CLIP 家族视觉塔,概念特征丰富但重建差 |
| 生成用 VQ | "重建编码" | 能干净解码回像素的向量量化 token |
| JanusFlow | "rectified-flow 变体" | 把 VQ 生成头换成连续 flow matching 生成头的 Janus-Pro |
| 路由标签 | "任务标签" | 挑选输入编码器的提示标记(`<understand>` / `<generate>`) |

## 延伸阅读

- [Wu et al. — Janus (arXiv:2410.13848)](https://arxiv.org/abs/2410.13848)
- [Chen et al. — Janus-Pro (arXiv:2501.17811)](https://arxiv.org/abs/2501.17811)
- [Ma et al. — JanusFlow (arXiv:2411.07975)](https://arxiv.org/abs/2411.07975)
- [InternVL-U (arXiv:2603.09877)](https://arxiv.org/abs/2603.09877)
- [Dong et al. — DreamLLM (arXiv:2309.11499)](https://arxiv.org/abs/2309.11499)
