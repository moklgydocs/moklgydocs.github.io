# 语音智能体:Pipecat 与 LiveKit

> 语音智能体是 2026 年一等的生产品类。Pipecat 给你 Python 的帧式流水线(VAD → STT → LLM → TTS → 传输);LiveKit Agents 把 AI 模型经 WebRTC 桥到用户。生产延迟目标:高端栈端到端 450–600ms。

**类型:** 学习
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 01(智能体循环)、第 14 阶段 · 12(工作流模式)
**预计耗时:** 约 60 分钟

## 学习目标

- 描述 Pipecat 的帧式流水线:DOWNSTREAM(源 → 汇)与 UPSTREAM(控制)。
- 说出 经典 语音流水线的各阶段,以及 Pipecat 支持的传输。
- 解释 LiveKit Agents 的两个语音智能体类(MultimodalAgent、VoicePipelineAgent)及各自适用场景。
- 总结 2026 年生产延迟预期,以及它们如何驱动架构选择。

## 问题

语音智能体不是"文本循环加个 TTS"。延迟预算残酷(约 600ms),部分音频是默认,轮次检测是一个模型,传输从电话 SIP 到 WebRTC 不等。要么你建帧式流水线(Pipecat),要么靠平台(LiveKit)。

## 概念

### Pipecat(pipecat-ai/pipecat)

- Python 帧式流水线框架。
- `Frame` → `FrameProcessor` 链。
- 两个流向:
  - **DOWNSTREAM** —— 源 → 汇(音频进,语音出)。
  - **UPSTREAM** —— 反馈与控制(取消、指标、barge-in 打断)。
- `PipelineTask` 管理生命周期,带事件(`on_pipeline_started`、`on_pipeline_finished`、`on_idle_timeout`)和指标/追踪/RTVI 观察器。

典型流水线:

```
VAD (Silero) → STT → LLM (context alternates user/assistant) → TTS → transport
```

传输:Daily、LiveKit、SmallWebRTCTransport、FastAPI WebSocket、WhatsApp。

Pipecat Flows 加结构化对话(状态机)。Pipecat Cloud 是托管运行时。

### LiveKit Agents(livekit/agents)

- 把 AI 模型经 WebRTC 桥到用户。
- 关键概念:`Agent`、`AgentSession`、`entrypoint`、`AgentServer`。
- 两个语音智能体类:
  - **MultimodalAgent** —— 直接音频,走 OpenAI Realtime 或同类。
  - **VoicePipelineAgent** —— STT → LLM → TTS 级联;有文本级控制。
- 基于 Transformer 模型的语义轮次检测。
- 原生 MCP 集成。
- SIP 电话接入。
- LiveKit Inference 免 API key 提供 50+ 模型;插件再提供 200+。

### 商业平台

Vapi(优化高端栈约 450–600ms)和 Retell(180 个测试通话端到端约 600ms)建在这些之上。想要托管语音栈而没有 WebRTC 团队时,选平台。

### 这个模式在哪里出错

- **没有 barge-in 处理。** 用户打断了,智能体还在讲。Pipecat 里要 UPSTREAM 取消帧,LiveKit 里要等价物。
- **忽视 STT 置信度。** 低置信转写当作金科玉律喂给 LLM。按置信度设闸,或请求确认。
- **TTS 句中被截断。** 流水线在话语中途取消时,TTS 需要知情或切断音频。
- **忽视延迟预算。** 每个组件加 50–200ms。上线前把整条链加起来。

### 2026 年典型延迟

- VAD:20–60ms
- STT 部分结果:100–250ms
- LLM 首 token:150–400ms
- TTS 首音频:100–200ms
- 传输 RTT:30–80ms

端到端 450–600ms 是高端;800–1200ms 常见;超过 1500ms 就会让人觉得坏了。

```figure
voice-pipeline
```

## 动手构建

`code/main.py` 是一个帧式玩具流水线:

- `Frame` 类型(audio、transcript、text、tts_audio、control)。
- `Processor` 接口,含 `process(frame)`。
- 五阶段流水线(VAD → STT → LLM → TTS → 传输),处理器为脚本化。
- 一个 UPSTREAM 取消帧,演示 barge-in。

运行:

```
python3 code/main.py
```

轨迹展示正常流程,以及一次 barge-in 取消让 TTS 话语中途停下。

## 投入使用

- **Pipecat** 要完全控制时 —— 自定义处理器、Python 优先、提供商可插拔。
- **LiveKit Agents** WebRTC 优先部署和电话接入时。
- **Vapi / Retell** 想要托管语音智能体而没有 WebRTC 团队时。
- **OpenAI Realtime / Gemini Live** 直接音频进/音频出时(MultimodalAgent)。

## 交付

`outputs/skill-voice-pipeline.md`:搭一个 Pipecat 形状的语音流水线,VAD + STT + LLM + TTS + 传输,外加 barge-in 处理。

## 练习

1. 给玩具流水线加一个指标观察器:数每阶段每秒帧数。延迟在哪积累?
2. 实现置信度门控 STT:低于阈值时请求"能再说一遍吗?"
3. 加语义轮次检测:简单规则——转写以"?"结尾即轮次结束。
4. 读 Pipecat 传输文档。把标准库传输换成 SmallWebRTCTransport 配置(桩)。
5. 在同一查询上测 OpenAI Realtime vs STT+LLM+TTS 级联。文本级控制的延迟成本是多少?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| Frame | "事件" | 流水线中带类型的数据单元(音频、转写、文本、控制) |
| Processor | "流水线阶段" | 带 process(frame) 的处理器 |
| DOWNSTREAM | "正向流" | 源到汇:音频进,语音出 |
| UPSTREAM | "反馈流" | 控制:取消、指标、barge-in |
| VAD | "语音活动检测" | 检测用户何时在说话 |
| 语义轮次检测 | "智能话尾判定" | 基于模型判断用户说完了 |
| MultimodalAgent | "直接音频智能体" | 音频进音频出;中间无文本 |
| VoicePipelineAgent | "级联智能体" | STT + LLM + TTS;文本级控制 |

## 延伸阅读

- [Pipecat 文档](https://docs.pipecat.ai/getting-started/introduction) —— 帧式流水线、处理器、传输
- [LiveKit Agents 文档](https://docs.livekit.io/agents/) —— WebRTC + 语音原语
- [Vapi](https://vapi.ai/) —— 托管语音平台
- [Retell AI](https://www.retellai.com/) —— 托管语音,带延迟基准
