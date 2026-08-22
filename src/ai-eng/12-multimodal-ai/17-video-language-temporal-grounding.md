# 视频-语言模型:时间 token 与时间定位

> 视频不是一叠照片。一段 5 秒片段里有因果顺序、动作动词和事件时刻,这些都是图像模型表示不了的。Video-LLaMA(Zhang et al., 2023 年 6 月)交付了第一个带视听定位的开放视频-LLM;VideoChat 和 Video-LLaVA 把模式放大;到 2025 年,Qwen2.5-VL 的 TMRoPE 追上了前沿专有模型。每个系统对时间 token 的解法都不同——按片段的 Q-former、按帧的拼接池化、按 token 的 TMRoPE。本课精读这些模式,搭一个 均匀 vs 动态 的抽帧器,并在时间定位任务上评估。

**类型:** 动手构建
**编程语言:** Python(标准库,抽帧器 + 时间定位评估器)
**前置要求:** 第 12 阶段第 08 课(LLaVA-OneVision)
**预计耗时:** 约 180 分钟

## 学习目标

- 解释为什么时间位置编码能独立于视觉编码器,改变视频 VLM 的表现。
- 从 token/秒 与定位准确率,对比均匀、动态 FPS 和事件驱动三种抽帧。
- 描述 按片段 Q-former(Video-LLaMA)、按帧池化(Video-LLaVA)、按 token M-RoPE(Qwen2.5-VL)三种设计。
- 说出四个视频基准:VideoMME、TempCompass、EgoSchema、Video-MMMU。

## 问题

1 分钟 30 FPS 的视频是 1800 帧。每帧 196 个视觉 token(224 的 ViT-B),就是 35.2 万 token——超过任何 2024 年时代的 LLM 上下文。

三种缩减策略:

1. 抽帧(按内容 1–8 FPS)。
2. 激进池化每帧的 patch token(3x3 或 4x4 双线性池化)。
3. 用 Q-former 压缩:16 帧片段进,64 token 出。

每种取舍不同:抽帧丢时间细节,池化丢空间细节,Q-former 两头各丢一点但省 token。

时间位置编码是另一根轴:模型怎么知道第 5 帧在第 6 帧之前?选项有简单 1D 时间 RoPE(Video-LLaMA)、可学习时间嵌入(Video-LLaVA),以及 TMRoPE(Qwen2.5-VL,完整 3D)。

## 概念

### Video-LLaMA:按片段 Q-former + 音频分支

Video-LLaMA(2023)是第一个开放视频-LLM。架构:

- 2 FPS 的 16 帧片段(即 8 秒)。
- 逐帧 ViT 特征 → 对全部 16 帧做交叉注意力的 Video Q-former → 32 个学习查询 → LLM。
- 并行音频分支:波形 → ImageBind 音频编码器 → Audio Q-former → 32 个查询 → LLM。

强项:视听联合推理。弱项:片段长度固定,无法任意时间定位。

### VideoChat 与 Video-LLaVA

VideoChat 保留 Video-LLaMA 的思路,去掉音频、简化结构。Video-LLaVA(Lin et al., 2023)用同一个视觉编码器同时训练图像与视频帧("先对齐再投影"),得到统一表示。两者都是 冻结 CLIP 编码器 + MLP + LLM。

都处理不了长视频,都是 8–16 帧的系统。

### Qwen2.5-VL 与 TMRoPE

Qwen2.5-VL 引入 TMRoPE——时间-模态旋转位置嵌入。每个 patch token 携带 (t, h, w) 位置,其中 t 是真实时间戳(不是帧索引)。

与简单时间嵌入的关键区别:

- **绝对时间,不是索引。** 模型看到的是"4.2 秒处",不是"第 15 帧"。
- **按 token 旋转,不是按片段。** 每个视觉 token 按自己的时间戳独立旋转。
- **兼容动态 FPS。** 这里 2 FPS、那里 4 FPS 的不均匀间隔,TMRoPE 原生处理。

TMRoPE 让"猫在第几秒跳?"这类查询成为可能。模型能输出"4.2 秒处",而 Video-LLaMA 只会说"片段前段"。

### 抽帧策略

**均匀采样:** 按时长均匀取 N 帧。简单,丢运动峰值。

**动态 FPS:** 按运动强度自适应采样。光流或帧差挑出高运动段加密采样。Qwen2.5-VL 按此训练。

**事件驱动:** 跑一个轻量检测器,动作发生处多采。VideoAgent 在用。

**关键帧 + 上下文:** 在镜头边界采样,加少量相邻帧。适合影视内容。

### 按帧池化

1 FPS、每帧 576 token,5 分钟片段就是 172,800 token。Qwen2.5-VL-72B 的 12.8 万上下文装得下,但贵。

3x3 双线性池化降到每帧 64 token → 5 分钟 19,200 token。多数任务的甜点位。

智能体工作流可以池化更狠(6x6 → 每帧 16 token),那里空间细节不那么要紧。

### 四个视频基准

- **VideoMME:** 综合视频理解,短/中/长。
- **TempCompass:** 细粒度时间推理,"之前"/"之后"问题。
- **EgoSchema:** 长程第一人称视频。
- **Video-MMMU:** 多学科多模态视频问题。

完整的视频 VLM 评估四个全跑。它们压不同的轴——TempCompass 全考顺序,EgoSchema 考 3 分钟以上推理,VideoMME 跨时长。

### 时间定位的输出格式

- **自由文本:** "The cat jumps around the 4-second mark." 好解析但不精确。
- **结构化 JSON:** `{"event": "jump", "start": 4.1, "end": 4.3}`。Qwen2.5-VL 按此训练。
- **token 式:** 答案中交错特殊 `<time>4.1</time>` token。Qwen2.5-VL 的内部格式。

token 式对下游使用最精确;Qwen2.5-VL 的 JSON 输出可直接解析。

### 2026 年最佳实践

视频 VLM 的 2026 年配置:

- 编码器:SigLIP 2 配 M-RoPE 或 TMRoPE(Qwen2.5-VL)。
- 抽帧:动态 FPS(按运动 1–4),带最大帧数上限。
- 按帧池化:3x3 双线性。
- 输出:带 时间 + 事件 字段的结构化 JSON。
- 基准:通用用 VideoMME + TempCompass;长程用 EgoSchema。

```figure
video-temporal-patches
```

## 投入使用

`code/main.py` 包含:

- 均匀与动态 FPS 抽帧器。
- 玩具时间定位评估器:给定发生在时刻 T 的"真值"事件和模型输出,带容差打分。
- 三者对比:Video-LLaMA(16 帧,Q-former)、Video-LLaVA(8 帧,MLP)、Qwen2.5-VL(动态 FPS + TMRoPE)。

## 交付

本课产出 `outputs/skill-video-vlm-frame-planner.md`。给定视频任务(监控、动作识别、时间定位、摘要),选出抽帧器、池化倍数、输出格式和预期准确率档位。

## 练习

1. 一段 3 分钟烹饪演示,选均匀还是动态 FPS?用 token 数论证。

2. TMRoPE 具体多出了什么,是简单时间嵌入表做不到的?

3. 写一个 VLM 能学会输出的时间定位 JSON schema,包含错误情形。

4. 读 Video-LLaVA 第 3 节"先对齐再投影"。为什么这比分别训练图像编码器和视频编码器更好?

5. 查看 VideoMME 排行榜:2026 年,最强开放模型与最强专有模型差距多大?其中多少可归因于时间编码,多少归于基座 LLM 规模?

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|-----------------|------------------------|
| 时间定位 | "时间到点的回答" | VLM 为事件发生时刻输出具体时间戳区间 |
| TMRoPE | "时间-多模态 RoPE" | 带绝对时间戳的 3D 旋转位置,Qwen2.5-VL 在用 |
| 动态 FPS | "运动感知采样" | 高运动段多抽帧,静止段少抽帧 |
| 按帧池化 | "逐帧空间压缩" | 进 LLM 前用双线性插值减少每帧 patch 数 |
| Video Q-former | "片段压缩器" | 把 N 帧映射到 K 个学习查询的交叉注意力瓶颈 |
| VideoMME | "视频基准" | 覆盖短/中/长的综合视频基准,2500+ 样本 |

## 延伸阅读

- [Zhang et al. — Video-LLaMA (arXiv:2306.02858)](https://arxiv.org/abs/2306.02858)
- [Li et al. — VideoChat (arXiv:2305.06355)](https://arxiv.org/abs/2305.06355)
- [Lin et al. — Video-LLaVA (arXiv:2311.10122)](https://arxiv.org/abs/2311.10122)
- [Qwen Team — Qwen2.5-VL (arXiv:2502.13923)](https://arxiv.org/abs/2502.13923)
- [Lin et al. — VILA-1.5 (arXiv:2312.07533)](https://arxiv.org/abs/2312.07533)
