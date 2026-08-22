# Emu3:用 Next-Token 预测做图像与视频生成

> BAAI 的 Emu3(Wang et al., 2024 年 9 月)是那个本该终结"扩散 vs 自回归"之争的 2024 年结果:一个 Llama 式 decoder-only Transformer,只在 next-token 预测目标上训练,跨 文本 + VQ 图像 token + 3D VQ 视频 token 的统一词表,图像生成击败 SDXL,感知击败 LLaVA-1.6。没有 CLIP 损失,没有扩散调度。推理时用 classifier-free guidance 提质量,但核心训练目标就是 teacher forcing 的 next-token 预测。发表于 Nature。本课精读 Emu3 的主张——更好的分词器加上规模就是你所需要的一切——并与扩散路线对照。

**类型:** 学习
**编程语言:** Python(标准库,3D 视频分词数学 + 自回归采样器骨架)
**前置要求:** 第 12 阶段第 11 课(Chameleon)
**预计耗时:** 约 120 分钟

## 学习目标

- 解释为什么 Emu3 的单一 next-token 损失能成立——尽管"图像质量必须靠扩散"是长期共识。
- 描述 3D 视频分词器:时空 VQ 码本长什么样,为什么 patch 要跨时间。
- 从(训练算力、推理成本、质量天花板)对比 Emu3 与 Stable Diffusion XL。
- 说出同一个 Emu3 模型扮演的三个角色:Emu3-Gen(图像生成)、Emu3-Chat(感知)、Emu3-Stage2(视频生成)。

## 问题

直到 2024 年的传统智慧:图像生成需要扩散。论据是:离散图像 token 丢失太多信息,重建不出细节;自回归采样会在数千 token 上累积误差。Stable Diffusion、DALL-E 3、Imagen、Midjourney 全都用某种扩散。Chameleon(第 12.11 课)在小规模上部分反驳了这点,但质量没追上 SDXL。

Emu3 正面硬刚这个论据。主张:更好的视觉分词器 + 足够的规模 + next-token 损失 = 在同一个也能做感知的模型里,拿到击败扩散的图像生成。

发表时这个赌注很有争议。两年过去,开源统一生成家族(Emu3、Show-o、Janus-Pro、Transfusion)已是研究的默认路径;前沿生产模型似乎也在用某种变体。

## 概念

### Emu3 分词器

关键原料是视觉分词器。Emu3 训练了一个定制的 IBQ 级分词器(逆瓶颈量化器,SBER-MoVQGAN 家族),每个 token 做 8x8 分辨率缩减。512x512 的图变成 64x64 = 4096 个 token,码本大小 32768。

token 数比 Chameleon 的(每 512x512 1024 token、K=8192)多,但每 token 更便宜(码本查找更小、编解码更简单)。关键指标:重建 PSNR 30.5 dB,逼近 Stable Diffusion 连续潜在空间的 32 dB。

视频用 3D VQ 分词器:把一个时空 patch(4x4x4 像素)编码成一个整数。8 FPS 的 4 秒片段有 32 帧;256x256 下按 4 倍空间、4 倍时间缩减,token 数是 (256/4) * (256/4) * (32/4) = 64 * 64 * 8 = 32,768 个。

分词器质量就是天花板。Emu3 的贡献,有一部分就是"我们训了一个非常好的分词器"。

### 单损失训练

Emu3 只用一个目标:共享词表上的 next-token 预测,跨 文本 token、2D 图像 token、3D 视频 token。训练时按模态特定系数加权以平衡贡献,但损失函数完全相同。

训练数据混合:

- 图像生成:`<text caption> <image> image_tokens </image>`
- 图像感知:`<image> image_tokens </image> <question> text_tokens`
- 视频生成:`<text caption> <video> video_tokens </video>`
- 视频感知:同理。
- 纯文本:标准 NTP。

模型从数据分布中学会何时该吐图像 token、何时该吐文本 token。生成能力,就涌现于模型在 `<image>` 标签后预测图像 token。

### Classifier-free guidance 与温度

自回归图像生成,推理时配 classifier-free guidance(CFG)效果会好得多。Emu3 用了:生成两次,一次带完整标注,一次空标注,按引导权重(典型 3.0–7.0)混合 logits。这正是扩散用的那个 CFG 戏法,被借到了自回归场景。

温度要紧:太高出伪影,太低模式崩塌。Emu3 推荐:感知 1.0,图像生成 0.8。

### 三个角色,一个模型

Emu3 以三个功能不同的 API 交付,底下是同一套权重:

- **Emu3-Gen。** 图像生成。输入文本,输出图像 token。
- **Emu3-Chat。** VQA 与图像描述。输入图像(token),输出文本。
- **Emu3-Stage2。** 视频生成与视频问答。输入文本或视频,输出文本或视频。

没有任务特定头,只是不同的提示模板,同一个检查点。

### 基准

Emu3 论文(2024 年 9 月):

- 图像生成:MJHQ-30K FID 击败 SDXL(5.4 对 5.6),GenEval 总分持平(0.54 对 0.55——统计打平),Deep-Eval 综合分相当。
- 图像感知:VQAv2 击败 LLaVA-1.6(75.1 对 72.4),MMMU 大致持平。
- 视频生成:4 秒片段质量,与 Sora 时代公开基准模型相比 FVD 有竞争力。

数字不是全胜——这里丢一分那里挣一分——但"next-token 预测就是你所需要的一切"这个主张,跨模态都站得住。

### 算力成本

Emu3 在约 3000 亿多模态 token 上训练,模型 70 亿参数。GPU 时大致与 Llama-2-7B 预训练相当(A100 级硬件上 2000–4000 GPU·年)。Stable Diffusion 3 这类扩散模型的训练预算相近,但需要单独的文本编码器和更复杂的流水线。

推理上,Emu3 比 SDXL 慢:4096 个图像 token、30 token/s,一张 512x512 图约 2 分钟;SDXL 只要 2–5 秒。投机解码和 KV-cache 优化能缩小差距,但抹不平。自回归图像生成算力重——这是长期的取舍。

### 为什么重要

Emu3 的深层贡献是观念上的:如果 next-token 预测能规模化到在图像生成上追平扩散,那么统一模型路线(一个损失、一个骨干、任意模态)就是可行的。未来的模型不需要单独的文本编码器、单独的扩散调度器、单独的 VAE。一个 Transformer、每模态一个分词器,然后上规模。

Show-o、Janus-Pro、InternVL-U 都建立在这个主张之上或向其发起挑战。到 2025 年,中国实验室(BAAI、DeepSeek)在这个方向上比美国实验室发表得更激进。

```figure
l5-emu3-next-token
```

## 投入使用

`code/main.py` 搭两个玩具部件:

- 2D vs 3D VQ 分词数量计算器:给定(分辨率, patch, 片段时长, FPS),算图像与视频的 token 数。
- 带温度与 classifier-free guidance 的自回归图像 token 采样器。

CFG 实现与 Emu3 配方一致——按引导权重混合条件与无条件 logits。

## 交付

本课产出 `outputs/skill-token-gen-cost-analyzer.md`。给定生成产品规格(图像或视频、目标分辨率、质量档、延迟预算),计算 token 数、推理成本,并在 Emu3 家族与扩散之间做选择。

## 练习

1. Emu3 每 512x512 图产 4096 token(8x8 缩减)。计算 1024x1024 和 2048x2048 的对应值。推理延迟会怎样变化?

2. 读 Emu3 第 3.3 节视频分词器。描述 3D VQ patch 的形状,以及为什么是 4x4x4 而不是 8x8x1。

3. CFG 权重 5.0 vs 3.0:视觉效果有何不同?在 `code/main.py` 里追一遍数学。

4. 计算 Emu3-7B 在 3000 亿 token 上的训练 FLOPs,与 Stable Diffusion 3 对比。哪个训练更贵?

5. Emu3 在 FID 上击败 SDXL,但 VQAv2 上不如专门的 VLM。解释为什么统一损失路线在不同基准上,相对专家模型呈现不同的强弱。

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|-----------------|------------------------|
| Next-token 预测 | "NTP" | 标准自回归损失:给定 token[0..i] 预测 token[i+1];分词后适用于一切模态 |
| IBQ 分词器 | "逆瓶颈量化器" | 一类 VQ-VAE,码本更大(32768+),重建比 Chameleon 的更好 |
| 3D VQ | "时空量化器" | 按(时间, 行, 列)索引的码本;一个 token 覆盖 4x4x4 像素立方体 |
| Classifier-free guidance | "CFG" | 按权重 gamma 混合条件与无条件 logits;推理时提升图像质量 |
| 统一词表 | "共享 token" | 文本 + 图像 + 视频都从同一个整数空间取;模型预测下一个来临的模态 |
| MJHQ-30K | "图像生成基准" | Midjourney 质量基准,3 万提示词;Emu3 在此报 FID |

## 延伸阅读

- [Wang et al. — Emu3: Next-Token Prediction is All You Need (arXiv:2409.18869)](https://arxiv.org/abs/2409.18869)
- [Sun et al. — Emu: Generative Pretraining in Multimodality (arXiv:2307.05222)](https://arxiv.org/abs/2307.05222)
- [Liu et al. — LWM (arXiv:2402.08268)](https://arxiv.org/abs/2402.08268)
- [Yu et al. — MAGVIT-v2 (arXiv:2310.05737)](https://arxiv.org/abs/2310.05737)
- [Tian et al. — VAR (arXiv:2404.02905)](https://arxiv.org/abs/2404.02905)
