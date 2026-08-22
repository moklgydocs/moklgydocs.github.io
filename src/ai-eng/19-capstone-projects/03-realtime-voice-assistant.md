# 终局项目 03 —— 实时语音助手(ASR → LLM → TTS)

> 一个"感觉对"的语音智能体,端到端延迟在 800ms 以内,知道你说完了,扛得住插话,调工具时音频不断流。Retell、Vapi、LiveKit Agents、Pipecat 在 2026 年都过了这条线,靠的都是同一个结构:流式 ASR、话轮检测器、流式 LLM、流式 TTS,全部走 WebRTC,每一跳都卡着激进的延迟预算。造一个出来,测 WER、MOS 和误截断率,在丢包网络下跑。

**类型:** 终局项目
**编程语言:** Python(智能体 + 流水线),TypeScript(Web 客户端)
**前置要求:** 第 6 阶段(语音与音频)、第 7 阶段(Transformer)、第 11 阶段(LLM 工程)、第 13 阶段(工具)、第 14 阶段(智能体)、第 17 阶段(基础设施)
**涉及阶段:** P6 · P7 · P11 · P13 · P14 · P17
**预计耗时:** 30 小时

## 问题

语音是 2025–2026 年进展最快的 AI 交互品类,技术天花板每个季度都在降。OpenAI Realtime API、Gemini 2.5 Live、Cartesia Sonic-2、ElevenLabs Flash v3、LiveKit Agents 1.0、Pipecat 0.0.70,都把"首音频输出低于 800ms"拉进了可及范围。但门槛不只是延迟,而是交互手感:不掐断用户、不被掐断后回不来、话说到一半被打断能恢复、对话中途调工具音频不停、在抖动的移动网络下也能活。

把三个 REST 调用缝在一起是到不了的——架构必须是端到端的流水线式流处理。只有造出来,失败模式才会显形:按电话音质调的 VAD 被背景电视声触发;话轮检测器苦等一个永远不会来的标点;TTS 先攒 400ms 才肯出声。本终局项目就是在负载下把这些问题一个个修掉,并发布一份延迟与质量报告。

## 概念

流水线有五个流式阶段:**音频输入**(浏览器 WebRTC 或 PSTN)、**ASR**(Deepgram Nova-3 或 faster-whisper 流式输出部分转写)、**话轮检测**(VAD 加一个小型话轮检测模型,读部分转写判断说完没有)、**LLM**(判定话轮完成后立刻流式出 token)、**TTS**(首个 LLM token 后约 200ms 内流式出声)。

三个横切关注点。**插话(Barge-in)**:智能体说话时用户开口,TTS 立即取消,ASR 马上接管。**工具调用**:对话中途的函数调用(天气、日历)必须走旁路通道,不卡音频;若延迟超 300ms,智能体先垫一句承接语("稍等……")。**背压**:丢包时,部分转写先挂起,VAD 提高语音门限,智能体避免在对方消息未确认时自顾自说下去。

度量标准是量化的:Hamming VAD 基准上 15 dB 信噪比下 WER 低于 8%;100 次实测通话首音频输出 p50 低于 800ms;误截断率低于 3%;TTS 的 MOS 高于 4.2;单台 g5.xlarge 扛 50 路并发通话。这些数字本身就是交付物。

## 架构

```
browser / Twilio PSTN
        |
        v
   WebRTC / SIP edge
        |
        v
  LiveKit Agents 1.0  (or Pipecat 0.0.70)
        |
   +----+--------------+--------------+-----------------+
   |                   |              |                 |
   v                   v              v                 v
  ASR              VAD v5         turn-detector     side-channel
(Deepgram         (Silero)          (LiveKit)        tools
 Nova-3 /         speech-gate    completion score    (weather,
 Whisper-v3)      per 20ms        on partials        calendar)
   |                   |              |
   +--------+----------+--------------+
            v
        LLM (streaming)
     GPT-4o-realtime / Gemini 2.5 Flash /
     cascaded Claude Haiku 4.5
            |
            v
        TTS streaming
     Cartesia Sonic-2 / ElevenLabs Flash v3
            |
            v
     audio back to caller
            |
            v
   OpenTelemetry voice traces -> Langfuse
```

## 技术栈

- 传输:LiveKit Agents 1.0(WebRTC)加 Twilio PSTN 网关;备选框架 Pipecat 0.0.70
- ASR:Deepgram Nova-3(流式,首个部分转写低于 300ms)或自托管 faster-whisper Whisper-v3-turbo
- VAD:Silero VAD v5 加 LiveKit 话轮检测器(读部分转写的小型 Transformer)
- LLM:OpenAI GPT-4o-realtime(集成最紧)、Gemini 2.5 Flash Live,或级联方案 Claude Haiku 4.5(流式补全,音频单独走一路)
- TTS:Cartesia Sonic-2(首字节最快)、ElevenLabs Flash v3,或自托管开源 Orpheus
- 工具:FastMCP 旁路通道接天气/日历/预约;工具耗时超 300ms 时智能体先垫承接语
- 可观测:OpenTelemetry 语音 span,Langfuse 语音 trace 带音频回放
- 部署:单台 g5.xlarge(24GB 显存)跑自托管 Whisper + Orpheus;追求最低延迟用托管 API

```figure
ce-voice-latency
```

## 动手构建

1. **WebRTC 会话。** 搭一个 LiveKit 房间和一个流式发送麦克风音频的 Web 客户端。服务端挂一个 agent worker 加入房间。

2. **ASR 流。** 把 20ms 的 PCM 帧喂给 Deepgram Nova-3(或 GPU 上的 faster-whisper)。订阅部分与最终转写,记录每个部分转写的延迟。

3. **VAD 与话轮检测。** 在帧流上跑 Silero VAD v5。语音结束事件触发时,用最新部分转写跑 LiveKit 话轮检测器。只有当 VAD 判定静音满 500ms 且话轮检测完成度得分 > 0.6 时,才确认"话轮完成"。

4. **LLM 流。** 话轮完成即发 LLM 调用,带上对话历史与最终转写,流式吐 token。首个 token 一到就交给 TTS。

5. **TTS 流。** Cartesia Sonic-2 流式回传音频块。首个音频块必须在首个 LLM token 之后 200ms 内离开发送端。音频块发到 LiveKit 房间,客户端经 WebRTC 抖动缓冲播放。

6. **插话。** TTS 播放中 VAD 检测到用户新语音时,立即取消 TTS 流,丢弃剩余 LLM 输出,重新武装 ASR。发布一个 `tts_canceled` span。

7. **工具旁路通道。** 把天气和日历注册为函数调用工具。调用触发时并发执行;若 300ms 内未返回,让 LLM 先垫一句"稍等,我查一下",工具返回后继续。

8. **评测装置。** 录制 100 通电话。计算 WER(对照保留转写)、误截断率(用户话说到一半 TTS 被取消)、首音频输出 p50、TTS 的 MOS(人工或 NISQA),以及抖动丢包测试(注入 3% 丢包)。

9. **压测。** 单台 g5.xlarge 上用合成呼叫方打 50 路并发,度量可持续的首音频输出 p95。

## 投入使用

```
caller: "what is the weather in tokyo tomorrow"
[asr  ] partial @280ms: "what is the"
[asr  ] partial @540ms: "what is the weather"
[turn ] completion score 0.82 at @820ms; commit
[llm  ] first token @960ms
[tool ] weather.tokyo tomorrow -> 68/52 partly cloudy @1140ms
[tts  ] first audio-out @1040ms: "Tokyo tomorrow will be partly cloudy..."
turn latency: 1040ms user-stop -> audio-out
```

## 交付

交付物为 `outputs/skill-voice-agent.md`。给定一个领域(客服、预约或自助终端),它搭起一个 LiveKit 智能体,ASR/VAD/LLM/TTS 流水线调到度量标准线。评分细则:

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | 端到端延迟 | 100 次录音通话首音频输出 p50 低于 800ms |
| 20 | 话轮交替质量 | Hamming VAD 基准上误截断率低于 3% |
| 20 | 工具调用正确性 | 对话中途的工具调用返回正确数据且不卡音频 |
| 20 | 丢包下可靠性 | 注入 3% 丢包时 WER 与话轮交替保持稳定 |
| 15 | 评测装置完备性 | 测量可复现,配置公开 |
| **100** | | |

## 练习

1. 把 Deepgram Nova-3 换成 g5.xlarge 上的 faster-whisper v3 turbo。度量延迟与 WER 差距,指出 CPU 与 GPU 的取舍点在哪些环节。

2. 加一条打断仲裁策略:工具调用进行中用户插话时,智能体怎么办?对比三种策略(硬取消、跑完工具再停、下一话轮排队)。

3. 做一次对抗性话轮检测测试:让用户在句中长时间停顿。调 VAD 静音阈值与话轮检测得分阈值,在不突破 900ms 的前提下把误截断率压到最低。

4. 把同一个智能体经 Twilio 部署到 PSTN。对比 PSTN 与 WebRTC 的首音频输出,解释抖动缓冲与编解码差异。

5. 为非英语语种(日语、西班牙语)加语音活动检测。度量 Silero VAD v5 的误触发率,并与语种专用微调版对比。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| 话轮检测 | "语句结束检测" | 结合 VAD 静音与部分转写,判定用户说完话的分类器 |
| 插话(Barge-in) | "打断处理" | VAD 检测到用户新语音时,播放中途取消 TTS |
| 首音频输出 | "延迟" | 从用户停止说话到首个音频包离开发送端的时间 |
| VAD | "语音门" | 把音频帧分类为语音/静音的模型;Silero VAD v5 是 2026 年默认选择 |
| 抖动缓冲 | "音频平滑" | 客户端短暂缓存数据包以吸收网络波动 |
| 承接语(Filler) | "确认语" | 工具慢时智能体垫的短句,避免冷场 |
| MOS | "平均意见分" | 感知语音质量评分;NISQA 是其自动化代理指标 |

## 延伸阅读

- [LiveKit Agents 1.0](https://github.com/livekit/agents) —— WebRTC 智能体参考框架
- [Pipecat](https://github.com/pipecat-ai/pipecat) —— 另一个 Python 优先的流式智能体框架
- [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime) —— 一体化语音模型参考
- [Deepgram Nova-3 documentation](https://developers.deepgram.com/docs) —— 流式 ASR 参考
- [Silero VAD v5](https://github.com/snakers4/silero-vad) —— VAD 参考模型
- [Cartesia Sonic-2](https://docs.cartesia.ai) —— 低延迟 TTS 参考
- [Retell AI architecture](https://docs.retellai.com) —— 生产级语音智能体架构
- [Vapi.ai production stack](https://docs.vapi.ai) —— 另一份生产参考
