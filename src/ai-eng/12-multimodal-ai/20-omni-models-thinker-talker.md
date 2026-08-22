# Omni 模型:Qwen2.5-Omni 与 Thinker-Talker 分工

> GPT-4o 在 2024 年 5 月的产品演示之所以震撼,不是底层模型,而是产品形态——一个语音界面:你说话,模型看见摄像头看见的东西,然后在 250ms 内开口回答。开放生态用 2024 剩下的时间和整个 2025 年追赶这个产品表面。Qwen2.5-Omni(2025 年 3 月)是参考性的开放设计:一个 Thinker(大型文本生成 Transformer)加一个 Talker(并行语音生成 Transformer),用流式语音 token 连接。Mini-Omni 把它简化,Moshi 追平了它的延迟,GLM-4-Voice 把它扩展到中文。本课精读 Thinker-Talker 架构,以及让流式实时对话成立的那份延迟预算。

**类型:** 动手构建
**编程语言:** Python(标准库,流式流水线延迟模拟器 + VAD 循环)
**前置要求:** 第 12 阶段第 19 课(音频-LLM)、第 12 阶段第 16 课(任意到任意)
**预计耗时:** 约 180 分钟

## 学习目标

- 把推理流水线拆成 Thinker(文本推理)与 Talker(语音合成),解释为什么并行流式可行。
- 逐组件计算一次对话交互的首个音频字节时间(TTFAB)预算。
- 描述 Thinker 内部 TMRoPE 跨视觉、音频、文本的时间对齐位置编码。
- 说出三种实时对话模式:半双工、轮替、全双工。

## 问题

实时语音助手要快速做完很多事:

1. **听用户。** 实时语音分词,语音活动检测(VAD)判断用户说完了没。
2. **可选地看。** 2–4 FPS 的摄像头输入,与音频一起流入 Thinker。
3. **想。** 以对话历史为条件,组织回答。
4. **说。** 合成音频 token,解码成波形,流到用户的扬声器。

每一步都加延迟。要有对话感,总往返必须 <500ms——低于这个数,用户就感觉不到滞后。GPT-4o 宣称约 250ms,Moshi 约 160ms,Qwen2.5-Omni 约 350–500ms。

每个组件都必须流式。没有任何一环可以"全攒齐再解码"。

## 概念

### Thinker 与 Talker

Qwen2.5-Omni 的拆分:

- **Thinker:** 7B–80B 的文本生成 Transformer。消费交错的 文本 + 图像 + 音频 token,输出表示"要说什么"的文本 token。
- **Talker:** 较小的语音生成 Transformer(2 亿–10 亿)。消费 Thinker 的文本输出 token 加最近的语音上下文 token,输出离散语音 token(残差 VQ 索引)。
- **语音解码器:** 流式波形解码器(SNAC、MoVQGAN 家族),实时把语音 token 转成音频采样。

拆分很要紧。Thinker 必须大,推理才够好;Talker 可以小,因为它的活是局部的——把文本变成语音 token。Talker 更大不会更有表现力,只会更慢。

两者并行运行:

1. Thinker 吐出文本 token t_i。
2. Talker(经流式)消费 t_i,吐出语音 token s_i, s_{i+1}, ..., s_{i+k}。
3. 语音解码器边收语音 token 边吐音频采样。
4. 当 Thinker 进行到文本 token t_{i+3} 时,Talker 已经把 t_0..t_{i+2} 的音频流完了。

### TMRoPE —— 时间对齐的多模态位置

Thinker 要整合:图像帧(比如 4 FPS 到达)、音频帧(每秒 50 帧到达),以及对话历史中的文本。朴素的序列顺序(先全部图像、再全部音频、再文本)会丢掉时间对齐。

TMRoPE 给每个 token 分配绝对时间戳:视觉 token 在 t=2.3s,音频 token 在 t=2.32s,用户的文本 token "stop" 在 t=2.35s。RoPE 按时间戳旋转注意力,模型把它们视为同一时刻并发。

这正是"他一边挥手一边打招呼"能成立的基础设施——模型在同一个概念时刻,同时看到视频帧和音频。

### 流式语音合成

语音 token 必须流式。Mini-Omni(Xie & Wu, 2024)提出"语言模型可以边听边说、边想边流":Thinker 的输出 token 与 Talker 的输出 token 在同一序列中交错。Thinker 一提交下一个文本 token,Talker 立刻开火。没有批次边界。

Moshi(Défossez et al., 2024 年 10 月)是最快的开放实现:单张 A100 上 160ms TTFAB。架构:一个 7B Transformer,在交错位置上输出文本与语音 token,用"内心独白"(inner monologue)把思考流与说话流分开。这实际上是把 Thinker + Talker 融进一个模型,靠精细训练实现。

### VAD 与轮替

语音活动检测(VAD)跑在输入侧。两种模式:

- **半双工:** 用户说,模型听;模型说,用户听。靠 VAD 静音检测(约 200ms)完成清晰交接。
- **全双工:** 双方可同时说话。模型能插话附和("uh-huh")或打断。难得多。Moshi 支持。

Qwen2.5-Omni 默认半双工,靠静音阈值轮替。全双工需要应用层处理。

### Qwen3-Omni(2025 年 11 月)

继任者。Qwen3-80B Thinker,更大的 Talker,改进的 TMRoPE-v2。延迟逼近 GPT-4o 的 250ms,开放权重。OmniBench 基准上与 Gemini 2.0 Live 有竞争力。

### 生产延迟预算

一次典型流式交互:

- 麦克风 → 音频 token:40–80ms。
- Prefill(提示 + 历史):7B 时 100–200ms,70B 时多得多。
- 首个 Thinker 文本 token:40ms。
- Talker 处理首个文本 token:20ms。
- 首批语音 token 提交:40ms。
- 残差 VQ 解码:30ms。
- 语音波形解码:50–80ms。

总 TTFAB:7B 时 320–510ms,70B 时 600–900ms。前沿质量通常意味着 70B+——这就是前沿延迟差的原因。

### Token 速率的账

16kHz 语音、50 Hz 基础语音 token,意味着每秒输出要 50 个语音 token。Talker 必须每秒吐 ≥50 token 才跟得上。H100 上典型 LLM 吞吐 30–80 token/s,小的(2–3 亿)Talker 够快;7B 的 Talker 会掉队。

这就是为什么存在专门的小 Talker,而不是"直接用主模型"。

```figure
l5-thinker-talker
```

## 投入使用

`code/main.py`:

- 用模拟 token 产出速率,模拟一条 Thinker-Talker 流水线。
- 按可配置的模型规模与麦克风采样率,计算 TTFAB。
- 演示带 VAD 静音阈值的半双工轮替。

## 交付

本课产出 `outputs/skill-omni-streaming-budget.md`。给定实时语音产品的目标 TTFAB 与特性集(视觉输入、双语、全双工),在 Qwen2.5-Omni、Qwen3-Omni、Moshi、Mini-Omni 中做选择,并确定 Thinker/Talker 的规格。

## 练习

1. 你的目标 TTFAB 是 300ms。在 7B Thinker + 3 亿 Talker 上,写出每个组件的延迟。

2. Qwen2.5-Omni 用 TMRoPE。描述这样一个提示下模型看到什么:用户 t=1s 开始说话,摄像头 t=1.2s 捕捉到一个手势。

3. 全双工要求模型边听边说。提出一种能教会这一点的训练数据格式。

4. 读 Moshi 论文第 4 节。描述"内心独白"分离,以及它为什么能避开 Thinker-Talker 拆分。

5. 算吞吐预算:16kHz 语音、每秒 50 个基础层 token,Talker 必须以多快的速度吐 token 才跟得上?

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|-----------------|------------------------|
| Thinker | "推理大脑" | 产出"要说什么"的大型文本生成 Transformer |
| Talker | "语音嘴巴" | 把 Thinker 的文本变成离散语音 token 的小 Transformer |
| TTFAB | "延迟预算" | 首个音频字节时间:从用户说完到首个音频采样输出 |
| TMRoPE | "时间对齐 RoPE" | 跨视觉、音频、文本使用绝对时间戳的位置编码 |
| 半双工 | "轮替" | 用户与模型交替;VAD 静音检测用户说完 |
| 全双工 | "同时" | 模型可同时说与听;能插话附和 |
| 内心独白 | "Moshi 式分离" | 思考流与说话流在单模型内交错的单模型设计 |

## 延伸阅读

- [Xu et al. — Qwen2.5-Omni (arXiv:2503.20215)](https://arxiv.org/abs/2503.20215)
- [Qwen Team — Qwen3-Omni (arXiv:2509.17765)](https://arxiv.org/html/2509.17765v1)
- [Xie & Wu — Mini-Omni (arXiv:2408.16725)](https://arxiv.org/abs/2408.16725)
- [Défossez et al. — Moshi (arXiv:2410.00037)](https://arxiv.org/abs/2410.00037)
- [Zeng et al. — GLM-4-Voice (arXiv:2412.02612)](https://arxiv.org/abs/2412.02612)
