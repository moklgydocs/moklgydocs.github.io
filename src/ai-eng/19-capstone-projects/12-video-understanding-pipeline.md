# 终局项目 12 —— 视频理解流水线(场景、问答、搜索)

> Twelve Labs 把 Marengo + Pegasus 产品化了,VideoDB 发布了"视频版 CRUD"API,AI2 的 Molmo 2 放出了开源 VLM 权重,Gemini 长上下文原生能吃数小时的视频,TimeLens-100K 定义了规模化时间定位。2026 年的流水线已经定型:场景切分、逐场景字幕 + 嵌入、转写对齐、多向量索引,以及一个用 (start, end) 时间戳加帧预览作答的查询。本终局项目是摄入 100 小时视频,打中公开基准,并度量计数类与动作类问题上的幻觉。

**类型:** 终局项目
**编程语言:** Python(流水线),TypeScript(UI)
**前置要求:** 第 4 阶段(计算机视觉)、第 6 阶段(语音)、第 7 阶段(Transformer)、第 11 阶段(LLM 工程)、第 12 阶段(多模态)、第 17 阶段(基础设施)
**涉及阶段:** P4 · P6 · P7 · P11 · P12 · P17
**预计耗时:** 30 小时

## 问题

长视频问答是 2026 年规模下最吃带宽的多模态问题。Gemini 2.5 Pro 能原生读 2 小时视频,但把 100 小时视频灌成可查询语料,仍需场景级索引。生产形态是几样组合:场景切分(TransNetV2 或 PySceneDetect)、用 VLM 逐场景写字幕(Gemini 2.5、Qwen3-VL-Max 或 Molmo 2)、转写对齐(带词级时间戳的 Whisper-v3-turbo),以及一个字幕、帧嵌入、转写并排存放的多向量索引。查询流水线用 (start, end) 时间戳加帧预览作答。

基准是公开的(ActivityNet-QA、NeXT-GQA),再加你自己标注的 100 题。计数类与动作类问题上的幻觉是公认的硬失败类别,本终局项目明确要求度量它。

## 概念

摄入时三条流水线并行。**场景切分**把视频切成场景。**VLM 字幕**为每个场景生成字幕,并从关键帧抽帧嵌入。**ASR 对齐**产出词级时间戳。三条流按 (scene_id, 时间区间) 汇合。每个场景在多向量索引(Qdrant)里存三种向量:字幕嵌入、关键帧嵌入、转写嵌入。

查询时,自然语言问题同时打向三种向量;结果用 RRF 合并;一个时间定位适配器(TimeLens 风格)在 top 场景内细化 (start, end) 窗口。VLM 合成器(Gemini 2.5 Pro 或 Qwen3-VL-Max)吃进查询 + top 场景 + 裁出的帧,带引用时间戳和帧预览作答。

幻觉度量很重要。计数("有几个人走进房间?")与动作类("厨师是先倒后搅吗?")问题出了名地不可靠。准确率要与描述类问题分开报告。

## 架构

```
video file / URL
      |
      v
PySceneDetect / TransNetV2  (scene segmentation)
      |
      +--- per-scene keyframe --- VLM caption + frame embedding
      |                            (Gemini 2.5 Pro / Qwen3-VL-Max / Molmo 2)
      |
      +--- audio channel --- Whisper-v3-turbo ASR + word timestamps
      |
      v
multi-vector Qdrant: {caption_emb, keyframe_emb, transcript_emb}
      |
query:
  dense queries against all three -> RRF merge -> top-k scenes
      |
      v
TimeLens / VideoITG temporal grounding (refine start/end within scene)
      |
      v
VLM synth: query + top scenes + frame previews
      |
      v
answer + (start, end) timestamps + frame thumbs + citations
```

## 技术栈

- 场景切分:TransNetV2(2024–26 SOTA)或 PySceneDetect
- ASR:faster-whisper 跑 Whisper-v3-turbo,带词级时间戳
- VLM 字幕 + 答题:Gemini 2.5 Pro 或 Qwen3-VL-Max 或 Molmo 2
- 时间定位:TimeLens-100K 训练的适配器或 VideoITG
- 索引:Qdrant 多向量(字幕 / 帧 / 转写)
- UI:Next.js 15,HTML5 播放器加场景缩略图
- 评测:ActivityNet-QA、NeXT-GQA、自建 100 题手工标注集
- 幻觉基准:计数类与动作类子集,人工标注

```figure
cf-scene-index
```

## 动手构建

1. **摄入遍历器。** 接受 YouTube URL 或本地 MP4,必要时降到 720p,持久化 `{video_id, file_path}`。

2. **场景切分。** 跑 TransNetV2 或 PySceneDetect,产出 `[{scene_id, start_ms, end_ms, keyframe_path}]`。目标 100 小时:约 6000–8000 个场景。

3. **ASR 过一遍。** 音频跑 Whisper-v3-turbo;导出词级时间戳;切成逐场景转写切片。

4. **VLM 字幕。** 每个场景,把关键帧配一段简短字幕模板发给 Gemini 2.5 Pro(或 Qwen3-VL-Max),产出字幕 + 帧嵌入。

5. **多向量索引。** Qdrant 集合,三个命名向量。payload:`{video_id, scene_id, start_ms, end_ms, keyframe_url}`。

6. **查询。** 自然语言问题发三路稠密查询;RRF 合并;取 top-k=5 场景。

7. **时间定位。** 在 top 场景上跑 TimeLens 风格适配器,细化场景内的 (start, end) 窗口。

8. **VLM 合成。** 查询 + top-3 场景片段(图像或短 clip)+ 转写,发给 Gemini 2.5 Pro。要求 `(video_id, start_ms, end_ms)` 引用。

9. **评测。** 跑 ActivityNet-QA 与 NeXT-GQA。自建 100 题集。报告总准确率 + 分类明细(计数、动作、描述)。

## 投入使用

```
$ video-qa ask --url=https://youtube.com/watch?v=X "how many cars pass the intersection in the first minute?"
[scene]    23 scenes detected
[asr]      transcript complete, 4m12s
[index]    69 vectors written (23 scenes x 3)
[query]    top scene: scene 3 [01:32-01:54], confidence 0.84
[ground]   refined window: [00:12-00:58]
[synth]    gemini 2.5 pro, 1.4s
answer:    5 cars pass the intersection between 00:12 and 00:58.
citations: [scene 3: 00:12-00:58]
          [frame preview at 00:14, 00:27, 00:44, 00:51, 00:57]
```

## 交付

`outputs/skill-video-qa.md` 是交付物。给定 YouTube URL 或上传的视频,流水线索引场景,并用带时间戳的引用回答问题。

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | 时间定位 IoU | 保留定位集上的交并比 |
| 20 | 问答准确率 | NeXT-GQA 与自建 100 题 |
| 20 | 摄入吞吐 | 每美元摄入的视频小时数 |
| 20 | UI 与引用体验 | 时间戳链接、缩略图条、跳转到帧 |
| 15 | 幻觉率 | 计数类与动作类准确率单独报告 |
| **100** | | |

## 练习

1. 字幕环节把 Gemini 2.5 Pro 换成 Qwen3-VL-Max。在 50 个场景的人工评分样本上报告字幕质量差值。

2. 把每场景帧嵌入从多向量改成单根池化向量。度量检索回退。

3. 造"严格计数"模式:合成器把每个数到的实例连同时间戳列出来,用户点击核验。度量用户核验是否降低幻觉。

4. 基准摄入成本:三个 VLM 选项各自的"每美元视频小时数"。找出甜点。

5. 加说话人分离转写:音频跑 pyannote 说话人分离,按说话人嵌入转写。演示"Alice 关于 X 说了什么?"这类查询。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| 场景切分 | "镜头检测" | 沿镜头边界把视频切成场景 |
| 多向量索引 | "字幕 + 帧 + 转写" | Qdrant 集合,每种表示一个命名向量 |
| 时间定位 | "到底什么时候发生的" | 为查询答案细化 (start, end) 窗口 |
| 帧嵌入 | "视觉表示" | 关键帧的向量嵌入;用于场景视觉相似度 |
| RRF 融合 | "倒数排名融合" | 跨多个排序列表的合并策略;经典混合检索技巧 |
| 计数幻觉 | "数错" | VLM 在"有多少个 X"问题上的已知失败模式 |
| ActivityNet-QA | "视频问答基准" | 长视频问答准确率基准 |

## 延伸阅读

- [AI2 Molmo 2](https://allenai.org/blog/molmo2) —— 开源 VLM 权重
- [TimeLens (CVPR 2026)](https://github.com/TencentARC/TimeLens) —— 规模化时间定位
- [Gemini Video long-context](https://deepmind.google/technologies/gemini) —— 托管参考
- [VideoDB](https://videodb.io) —— 视频版 CRUD API 参考
- [Twelve Labs Marengo + Pegasus](https://www.twelvelabs.io) —— 商业参考
- [TransNetV2](https://github.com/soCzech/TransNetV2) —— 场景切分模型
- [PySceneDetect](https://github.com/Breakthrough/PySceneDetect) —— 经典开源替代
- [ActivityNet-QA](https://arxiv.org/abs/1906.02467) —— 参考评测基准
