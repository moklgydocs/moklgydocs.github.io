# 音频-语言模型:从 Whisper 到 Audio Flamingo 3 的演进弧线

> Whisper(Radford et al., 2022 年 12 月)终结了语音识别:68 万小时弱监督多语言语音、一个朴素的 encoder-decoder Transformer、以及一个让此后每个 ASR 发布都必须引用的基准。但识别不等于推理。"这段录音里有什么乐器?""说话人是什么情绪?""第 3 分钟发生了什么?"这些问题要的是音频理解,不是转写。Qwen-Audio、SALMONN、LTU 和 NVIDIA 的 Audio Flamingo 3(AF3,2025 年 7 月)逐步搭起了这套栈:保留 Whisper 级编码器,接上 Q-former,在音频-文本指令数据上训练,再加思维链推理。本课走完这条弧线。

**类型:** 动手构建
**编程语言:** Python(标准库,log-Mel 频谱图 + 音频 Q-former 骨架)
**前置要求:** 第 6 阶段(语音与音频)、第 12 阶段第 03 课(Q-Former)
**预计耗时:** 约 180 分钟

## 学习目标

- 从波形计算 log-Mel 频谱图:加窗、FFT、滤波器组、对数变换。
- 对比编码器选项:Whisper 编码器、BEATs、AF-Whisper 混合。各自何时胜出。
- 搭一个音频 Q-former:N 个可学习查询对频谱图 patch 做交叉注意力。
- 解释级联(Whisper 转写再接 LLM)与端到端音频-LLM 训练:为什么推理任务上端到端扩展性更好。

## 问题

Whisper 解决了语音识别,"音频版 OCR"已是日用品。但"日用品"止步于转写。如果模型不能对所听内容做推理—— timing、说话人、情绪、音乐结构、环境声——单靠转写撑不起产品功能。

三条显然的路线:

1. **级联:** Whisper 转写,LLM 对转录文本推理。纯语音场景能跑通;音乐、环境音、多人重叠说话、情绪上失败。
2. **端到端音频-LLM:** 音频编码器把音频 token 直接喂给 LLM,跳过转写。保住声学信息(情绪、说话人、环境)。需要新的训练数据。
3. **混合:** 音频编码器 + 既能转写又能推理的文本解码器。Qwen-Audio 和 Audio Flamingo 走这条。

## 概念

### Log-Mel 频谱图:输入特征

每个音频编码器都从同一个特征开始:log-Mel 频谱图。

1. 重采样到 16 kHz。
2. 短时傅里叶变换:25ms 窗,10ms 步移。
3. 取 FFT 结果的幅度。
4. 施加 Mel 滤波器组(典型 80 个,0–8000 Hz 对数间隔),弯到感知频率。
5. 对数压缩(log(1 + x))收窄动态范围。

结果:形状为 (T, 80) 的 2D 数组,T 是时间帧数。30 秒片段、100 Hz 帧率:(3000, 80)。

### Whisper 的编码器

Whisper 的编码器是一个 12 层 ViT 式 Transformer,把 log-Mel 频谱图当时间帧序列处理。输出:每个时间帧一个隐状态向量。

做 ASR 时,Whisper 的解码器是一个交叉注意力 Transformer,以编码器输出为条件生成文本 token。标准 encoder-decoder。

做 ALM(音频-LLM)时,你要把编码器输出喂给另一个 LLM。模式:Whisper 编码器冻结,Q-former 可训练,LLM 冻结或微调。

### BEATs 与音频专用编码器

Whisper 在语音主导的数据上训练,音乐和环境音较弱。

BEATs(Chen et al., 2022)是在 AudioSet 上训练的自监督 Transformer,同参数量下对音乐和环境声的捕捉好于 Whisper。

AF-Whisper(Audio Flamingo 3 的混合):把 Whisper + BEATs 特征拼接作为音频输入。Whisper 带语言信号,BEATs 带声学信号。

### 音频 Q-former

与 BLIP-2 的视觉 Q-former 同一模式。固定数量的可学习查询(常用 32 或 64)对音频编码器的输出帧做交叉注意力,查询变成喂给 LLM 的音频 token。

对齐训练阶段:只训 Q-former,在音频-文本对(AudioCaps、Clotho)上用 对比 + 描述 损失。指令阶段:端到端,解冻 LLM,在指令数据上训练。

### 这条弧线 —— SALMONN、Qwen-Audio、AF3

SALMONN(Tang et al., 2023):Whisper + BEATs + Q-former + LLaMA。第一个有像样推理能力的开放音频-LLM。MMAU 综合分约 0.55。

Qwen-Audio(Chu et al., 2023):架构相似,数据更丰富,为多轮对话调优。MMAU 约 0.60。

LTU —— Listen, Think, Understand(Gong et al., 2023):显式推理数据,主打音频片段上的思维链。更小但更专注。

Audio Flamingo 3(Goel et al., 2025 年 7 月):当前开放 SOTA。8B LLM 骨干(Qwen2 7B),Whisper-large 编码器拼接 BEATs,64 查询 Q-former,在 100 万+ 音频-文本指令对上训练。MMAU 0.72,部分子任务追平专有前沿。

AF3 还引入了按需思维链(on-demand chain-of-thought):模型可以选择在最终答案前先吐思考 token("let me identify the instruments first: ...")。开启思考后,复杂推理任务准确率提升 3–5 分。

### 级联 vs 端到端

级联流水线:

1. Whisper 把音频转写成文本。
2. LLM 对文本推理。

"总结这期播客"完美胜任。以下场景失败:

- "这首歌什么情绪?"——情绪在声音里,不在词里。
- "说话的是 Alice 还是 Bob?"——需要说话人识别。
- "爆炸发生在第几秒?"——时间定位在转写中丢失。
- "这是真实音频还是生成的?"——深伪检测需要声学特征。

端到端保住声学信号。Qwen-Audio 和 AF3 原生处理音乐、环境音和情绪。

### 2026 年生产配方

新的音频理解产品:

- 目标是转写、不涉及音乐、不做情绪推断:选级联。
- 涉及音乐、情绪、多说话人或复杂音频推理:选 AF3 / Qwen-Audio 家族。

级联更便宜更简单,端到端更能干。

### MMAU —— 音频推理基准

MMAU(Massive Multimodal Audio Understanding)是 2024–2025 年的音频推理基准:

- 1 万条音频-文本问答,覆盖语音、音乐、环境声。
- 涵盖分类、时间推理、因果推理、开放式问答。
- 专测级联流水线系统性漏掉的东西。

开放 SOTA(AF3)0.72;专有前沿约 0.78(Gemini 2.5 Pro、Claude Opus 4.7)。差距比 VideoMME 的开放-闭源差小,说明音频-LLM 正在成熟。

```figure
audio-text-ctc
```

## 投入使用

`code/main.py`:

- 用标准库实现 log-Mel 频谱图计算:加窗、朴素 DFT、Mel 滤波器组。
- 音频 Q-former 骨架:给定编码器输出帧,计算 Q、K、V、注意力,吐出 N 个 token。
- 在玩具任务上对比级联与端到端。

## 交付

本课产出 `outputs/skill-audio-llm-pipeline-picker.md`。给定音频任务(转写、音乐打标、情绪推断、多说话人分离、环境声分类),在级联、端到端 AF3、混合方案中做选择。

## 练习

1. 计算 30 秒片段的 log-Mel 频谱图维度:16kHz、25ms 窗、10ms 步移、80 个 Mel bin。48kHz 时会怎样变化?

2. 为什么 Whisper 在音乐上表现差?BEATs 捕获了哪些 Whisper 没有的音频特征?

3. 音频 Q-former 用 64 查询 vs 32 查询:任务复杂到什么程度时 64 才划算?32 在什么时候省算力?

4. 读 AF3 第 4 节按需思考。提出三个思维链帮助最大的音频任务。

5. 用 AF3 的输出实现一个最小的说话人分离(diarization)流水线。怎么标记说话人切换?

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|-----------------|------------------------|
| Log-Mel 频谱图 | "Mel 特征" | Mel 滤波器组之后,对数幅度值构成的 (时间, 频率) 2D 数组 |
| 音频 Q-former | "音频 Perceiver" | 从音频编码器输出到定长查询的交叉注意力瓶颈,查询喂给 LLM |
| 级联 | "ASR 再接 LLM" | Whisper 转写、文本 LLM 推理的流水线;丢失声学信息 |
| 端到端 | "音频-LLM" | 音频特征经 Q-former 直接进 LLM;保住声学信号 |
| BEATs | "AudioSet 音频编码器" | 在 AudioSet 上训练的 SSL Transformer;强于音乐 + 环境声 |
| MMAU | "音频推理基准" | 覆盖语音、音乐、环境声的 1 万条问答;2024 年评估标准 |
| 按需思考 | "音频 CoT" | 模型可选地在最终答案前输出推理 token,准确率提升 3–5 分 |

## 延伸阅读

- [Radford et al. — Whisper (arXiv:2212.04356)](https://arxiv.org/abs/2212.04356)
- [Chu et al. — Qwen-Audio (arXiv:2311.07919)](https://arxiv.org/abs/2311.07919)
- [Goel et al. — Audio Flamingo 3 (arXiv:2507.08128)](https://arxiv.org/abs/2507.08128)
- [Tang et al. — SALMONN (arXiv:2310.13289)](https://arxiv.org/abs/2310.13289)
- [Gong et al. — LTU (arXiv:2305.10790)](https://arxiv.org/abs/2305.10790)
