# 边缘推理 —— Apple Neural Engine、Qualcomm Hexagon、WebGPU/WebLLM、Jetson

> 边缘推理的核心约束是显存带宽,不是算力。移动端 DRAM 只有 50-90 GB/s,数据中心 HBM3 超过 2-3 TB/s——30-50 倍差距。解码是带宽瓶颈,所以这个差距是决定性的。2026 年的格局四分天下:Apple M4/A18 Neural Engine 峰值 38 TOPS,统一内存(CPU↔NPU 零拷贝);Qualcomm Snapdragon X Elite / 8 Gen 4 的 Hexagon 达 45 TOPS;WebGPU + WebLLM 在 M3 Max 上跑 Llama 3.1 8B(Q4)约 41 tok/s(约为原生的 70-80%),GitHub 17.6k 星,OpenAI 兼容 API,移动端覆盖约 70-75%;NVIDIA Jetson Orin Nano Super(8GB)装得下 Llama 3.2 3B / Phi-3,AGX Orin 通过 vLLM 跑 gpt-oss-20b 约 40 tok/s,Jetson T4000(JetPack 7.1)是 AGX Orin 的 2 倍。TensorRT Edge-LLM 支持 EAGLE-3、NVFP4、chunked prefill——Bosch、ThunderSoft、MediaTek 已在 CES 2026 展出。

**类型:** 学习
**编程语言:** Python(标准库,玩具级带宽瓶颈解码模拟器)
**前置要求:** 第 17 阶段 · 04(推理引擎内部机制)、第 17 阶段 · 09(生产量化)
**预计耗时:** 约 60 分钟

## 学习目标

- 解释为什么移动端 LLM 推理是显存带宽瓶颈,算力反而次要。
- 列举四类边缘目标(Apple ANE、Qualcomm Hexagon、WebGPU/WebLLM、NVIDIA Jetson),各自匹配到场景。
- 说出 2026 年 WebGPU 的覆盖缺口(Firefox Android 仍在追赶)和 Safari iOS 26 的落地。
- 按目标选量化格式(ANE 用 Core ML INT4 + FP16,Hexagon 用 QNN INT8/INT4,浏览器用 WebGPU Q4,Jetson Thor 用 NVFP4)。

## 问题

客户想要端侧聊天机器人:语音优先、默认隐私、离线可用。MacBook Pro M3 Max 上 Llama 3.1 8B Q4 跑约 55 tok/s——可以。iPhone 16 Pro 上同一模型 3 tok/s——不行。中端 Android(Snapdragon 8 Gen 3)7 tok/s。浏览器里走 WebGPU、Chrome Android v121+,视设备 4-8 tok/s。

吞吐差异不是移植问题,而是带宽差距 × 量化格式 × NPU 能否从用户态访问的乘积。2026 年的边缘推理是四个不同的问题,配四套不同的解法。

## 概念

### 带宽才是真正的天花板

解码每产出一个 token 都要把全部权重读一遍。7B 模型 Q4 是 3.5 GB。以 50 GB/s 读 3.5 GB 要 70 ms——理论上限约 14 tok/s。带宽到 90 GB/s(高端移动 DRAM),上限挪到约 25 tok/s。低于这个数,再多算力也没用。

数据中心 HBM3 有 3 TB/s,读完同样的 3.5 GB 只要 1.2 ms——上限 830 tok/s。同样的模型,同样的权重,差的是内存子系统。

### Apple Neural Engine(M4 / A18)

- 最高 38 TOPS。统一内存(CPU 和 ANE 共享同一池)——没有拷贝开销。
- 通过 Core ML + 编译后的 `.mlmodel` 访问,或经 PyTorch 走 Metal Performance Shaders(MPS)。
- Llama.cpp 的 Metal 后端用的是 MPS,不是直接用 ANE;要用原生 ANE 必须做 Core ML 转换。
- 2026 年 iOS 应用的最实用路径:Core ML,INT4 权重 + FP16 激活。

### Qualcomm Hexagon(Snapdragon X Elite / 8 Gen 4)

- 最高 45 TOPS。与 CPU、GPU 集成在同一 SoC,但内存域独立。
- QNN(Qualcomm Neural Network)SDK 和 AI Hub 提供 PyTorch/ONNX 转换。
- 聊天模板、Llama 3.2、Phi-3 在 AI Hub 上都是一等制品。

### Intel / AMD NPU(Lunar Lake、Ryzen AI 300)

- 40-50 TOPS。软件栈落后 Apple/Qualcomm;OpenVINO 在改进但仍小众。
- 最适合 Windows ARM  copilot 类应用;AMD/Intel 桌面上的本地优先场景可原生用。

### WebGPU + WebLLM

- 浏览器里经 WebGPU compute shader 跑模型,零安装。
- M3 Max 上 Llama 3.1 8B Q4 约 41 tok/s——同一后端下约为原生的 70-80%。
- WebLLM GitHub 17.6k 星;OpenAI 兼容 JS API;Apache 2.0。
- 2026 覆盖:Chrome Android v121+、Safari iOS 26 正式版,Firefox Android 仍在追赶。总体移动覆盖约 70-75%。

### NVIDIA Jetson 家族

- Orin Nano Super(8GB):装得下 Llama 3.2 3B、Phi-3,tok/s 表现不错。
- AGX Orin:vLLM 跑 gpt-oss-20b 约 40 tok/s。
- Thor / T4000(JetPack 7.1):性能 2 倍于 AGX Orin,支持 EAGLE-3 和 NVFP4。
- TensorRT Edge-LLM(2026)支持 EAGLE-3 投机解码、NVFP4 权重、chunked prefill——数据中心那套优化移植到了边缘。

### 按目标选量化

| 目标 | 格式 | 备注 |
|------|------|------|
| Apple ANE | INT4 权重 + FP16 激活 | Core ML 转换路径 |
| Qualcomm Hexagon | QNN INT8 / INT4 | AI Hub 转换器 |
| WebGPU / WebLLM | Q4 MLC(q4f16_1) | 用 `mlc_llm convert_weight` + 编译 `.wasm`;不支持 GGUF |
| Jetson Orin Nano | Q4 GGUF 或 TRT-LLM INT4 | 带宽瓶颈 |
| Jetson AGX / Thor | NVFP4 + FP8 KV | Edge-LLM 路径 |

### 边缘上的长上下文陷阱

Llama 3.1 的 128K 上下文是数据中心特性。8 GB 内存的手机上,4 GB 模型 + 32K token 的 2 GB KV 缓存 + OS 开销 = 直接 OOM。边缘部署把上下文压在 4K-8K,除非接受激进的 KV 量化(Q4 KV)。

### 语音是杀手级应用

语音助手对延迟敏感(首 token < 500 ms)。本地推理把网络延迟整个消掉。再配合语音转文字(Whisper Turbo 变体能在边缘跑),边缘推理就成了生产级语音回路。

### 该记住的数字

- Apple M4 / A18 ANE:38 TOPS。
- Qualcomm Hexagon SD X Elite:45 TOPS。
- WebLLM M3 Max:Llama 3.1 8B Q4 约 41 tok/s。
- AGX Orin:vLLM 跑 gpt-oss-20b 约 40 tok/s。
- 数据中心与边缘的带宽差距:30-50 倍。
- WebGPU 移动覆盖:约 70-75%(Firefox Android 落后)。

```figure
edge-bandwidth-pipe
```

## 投入使用

`code/main.py` 用带宽瓶颈公式计算各边缘目标的理论解码吞吐上限,与实测基准对比,标出瓶颈在带宽而非算力的位置。

## 交付

本课产出 `outputs/skill-edge-target-picker.md`。给定平台(iOS/Android/浏览器/Jetson)、模型、延迟与内存预算,选出量化格式和转换流水线。

## 练习

1. 运行 `code/main.py`。7B 模型 Q4 在 Snapdragon 8 Gen 3(约 77 GB/s 带宽)上,算出解码上限。与实测 6-8 tok/s 对比——运行时效率高吗?
2. Android 上 WebGPU 要求 Chrome v121+。为旧浏览器设计降级方案——通过同一个 OpenAI 兼容 API 走服务端。
3. 你的 iOS 应用需要 4K 上下文流式输出。哪种模型/格式组合能让你在 iPhone 16 上把活跃内存压在 4 GB 以内?
4. Jetson AGX Orin 跑 gpt-oss-20b 有 40 tok/s,Jetson Nano 只装得下 3B。如果产品两个都要支持,怎么统一推理栈?
5. 论证"WebLLM 在 2026 年是否生产就绪"。引用覆盖率、性能和 Firefox Android 缺口。

## 关键术语

| 术语 | 别人嘴里的说法 | 实际含义 |
|------|----------------|----------|
| ANE | "苹果神经引擎" | M 系列和 A 系列里的端侧 NPU;统一内存 |
| Hexagon | "高通 NPU" | Snapdragon 的 NPU;经 QNN SDK 访问 |
| WebGPU | "浏览器 GPU" | W3C 标准化的浏览器 GPU API;2026 年 Chrome/Safari 支持 |
| WebLLM | "浏览器 LLM 运行时" | MLC-LLM 项目;Apache 2.0;OpenAI 兼容 JS |
| Jetson | "NVIDIA 边缘" | Orin Nano / AGX / Thor / T4000 家族 |
| TRT Edge-LLM | "边缘 TensorRT" | 2026 年 TensorRT-LLM 的边缘移植;EAGLE-3 + NVFP4 |
| 统一内存 | "共享池" | CPU 和 NPU 看同一块 RAM;零拷贝 |
| 带宽瓶颈 | "内存受限" | 解码被读权重的字节/秒卡死 |
| Core ML | "苹果转换" | Apple 的 ANE 原生模型框架 |
| QNN | "高通栈" | Qualcomm Neural Network SDK |

## 延伸阅读

- [On-Device LLMs State of the Union 2026](https://v-chandra.github.io/on-device-llms/) —— 格局与基准。
- [NVIDIA Jetson Edge AI](https://developer.nvidia.com/blog/getting-started-with-edge-ai-on-nvidia-jetson-llms-vlms-and-foundation-models-for-robotics/) —— Orin / AGX / Thor。
- [NVIDIA TensorRT Edge-LLM](https://developer.nvidia.com/blog/accelerating-llm-and-vlm-inference-for-automotive-and-robotics-with-nvidia-tensorrt-edge-llm/) —— 2026 年边缘移植公告。
- [WebLLM (arXiv:2412.15803)](https://arxiv.org/html/2412.15803v2) —— 设计与基准。
- [Apple Core ML](https://developer.apple.com/documentation/coreml) —— ANE 原生转换。
- [Qualcomm AI Hub](https://aihub.qualcomm.com/) —— 为 Hexagon 预转换的模型。
