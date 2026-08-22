# 自托管推理引擎选型——按硬件与规模匹配引擎

> 选引擎是硬件、规模和生态的函数——不是看跑分榜。2026 年自托管推理由四个引擎主导:llama.cpp、Ollama、vLLM、SGLang,TGI 已进入维护模式,掉队了。**llama.cpp** 在 CPU 上最快——模型支持面最广,量化和线程完全可控。**Ollama** 是开发笔记本上的一条命令装机,比 llama.cpp 慢约 15-30%(Go + CGo + HTTP 序列化的开销),生产级负载下吞吐差 3 倍。**TGI 于 2025 年 12 月 11 日进入维护模式**——只修 bug,原始吞吐比 vLLM 慢约 10%,但历史上它的可观测性和 HF 生态集成是顶级的。维护状态让它成为有风险的长期赌注——新项目更安全的默认选择是 SGLang 或 vLLM。**vLLM** 是通用生产的默认项——v0.15.1(2026 年 2 月)新增 PyTorch 2.10、RTX Blackwell SM120、H200 优化。**SGLang** 是智能体多轮 / 重前缀场景的专家——生产环境 400,000+ 张 GPU(xAI、LinkedIn、Cursor、Oracle、GCP、Azure、AWS)。硬件约束:CPU 优先 → llama.cpp。AMD / 非 NVIDIA → vLLM 是支持最强的路径(TRT-LLM 锁死 NVIDIA)。2026 年的流水线模式:开发用 Ollama,预发用 llama.cpp,生产用 vLLM 或 SGLang。各引擎吃的权重格式不同——llama.cpp 家族用 GGUF,GPU 引擎用 HF safetensors——所以阶段之间可能要夹一道格式转换。

**类型:** 学习
**编程语言:** Python(标准库,引擎决策树遍历器)
**前置要求:** 第 17 阶段所有讲引擎的课程(04、06、07、09、18)
**预计耗时:** 约 45 分钟

## 学习目标

- 给定硬件(CPU / AMD / NVIDIA Hopper / Blackwell)、规模(1 用户 / 100 / 10,000)和负载(通用聊天 / 智能体 / 长上下文),选出引擎。
- 说出 2026 年 TGI 维护模式状态(2025 年 12 月 11 日),以及它为什么让新项目偏向 vLLM 或 SGLang。
- 描述开发/预发/生产流水线,包括 GGUF 转 safetensors 的格式转换夹在哪两个阶段之间。
- 解释为什么"CPU 优先"指向 llama.cpp,而"AMD"排除了 TRT-LLM。

## 问题

你的团队启动一个自托管 LLM 新项目。一个工程师说 Ollama,另一个说 vLLM,第三个说"TGI 不是开箱即用吗?"三个人在各自的语境下都对。但没有一个对所有语境都对。

2026 年,这棵树的选择顺序很重要:硬件第一,规模第二,负载第三。还有 2025 年的一件具体事件——TGI 于 12 月 11 日进入维护模式——改变了新项目的默认答案。

## 概念

### 五个引擎

| 引擎 | 最擅长 | 备注 |
|--------|----------|-------|
| **llama.cpp** | CPU / 边缘 / 极简依赖 / 最广模型支持 | CPU 上最快,完全可控 |
| **Ollama** | 开发笔记本、单用户、一条命令装机 | 比 llama.cpp 慢 15-30%;生产吞吐差 3 倍 |
| **TGI** | HF 生态、受监管行业 | **2025 年 12 月 11 日进入维护模式** |
| **vLLM** | 通用生产、100+ 用户 | 广泛的生产默认项;v0.15.1,2026 年 2 月 |
| **SGLang** | 智能体多轮、重前缀负载 | 生产环境 400,000+ 张 GPU |

### 硬件优先决策

**CPU 优先** → llama.cpp。Ollama 也行但更慢。其他引擎在 CPU 上都没有竞争力。

**AMD GPU** → vLLM 是支持最强的路径(AMD ROCm 支持)。SGLang 也行。TRT-LLM 锁死 NVIDIA,出局。

**NVIDIA Hopper(H100 / H200)** → vLLM、SGLang 或 TRT-LLM。三个都是顶级。

**NVIDIA Blackwell(B200 / GB200)** → TRT-LLM 是吞吐王(第 17 阶段 · 07)。vLLM 和 SGLang 紧随其后。

**Apple Silicon(M 系列)** → llama.cpp(Metal)。Ollama 就是对它的封装。

### 规模次之决策

**1 用户 / 本地开发** → Ollama。一条命令,几秒内出第一个 token。

**10-100 用户 / 小团队** → vLLM 单卡。

**100-10k 用户 / 生产** → vLLM production-stack(第 17 阶段 · 18)或 SGLang。

**10k+ 用户 / 企业级** → vLLM production-stack + 分离式部署(第 17 阶段 · 17)+ LMCache(第 17 阶段 · 18)。

### 负载最后决策

**通用聊天 / 问答** → vLLM 凭广泛默认性胜出。

**智能体多轮(工具、规划、记忆)** → SGLang 的 RadixAttention(第 17 阶段 · 06)碾压。

**重前缀复用的 RAG** → SGLang。

**代码生成** → vLLM 没问题;SGLang 在缓存上略优。

**长上下文(128K+)** → vLLM + 分块 prefill;SGLang + 分层 KV。

### TGI 维护模式陷阱

Hugging Face TGI 于 2025 年 12 月 11 日进入维护模式——之后只修 bug。历史上它可观测性顶级,HF 生态集成(模型卡、安全工具)一流,原始吞吐略逊 vLLM。

对 2026 年的新项目:默认别选 TGI。已有的 TGI 部署可以继续跑,但最终应该迁移。SGLang 和 vLLM 是更稳的默认项。

### 流水线模式

开发(Ollama)→ 预发(llama.cpp)→ 生产(vLLM)。各引擎吃的权重格式不同——llama.cpp 家族用 GGUF,GPU 引擎用 HF safetensors——所以阶段之间可能要夹一道格式转换。工程师在笔记本上快速迭代;预发对齐生产的量化方案;生产是服务目标。

### Ollama 注意事项

Ollama 很适合开发。它不适合共享生产环境:Go 的 HTTP 序列化有额外开销,并发管理比 vLLM 简单,OpenTelemetry 支持滞后。让 Ollama 在它擅长的场景发光——单用户、一条命令——共享场景换 vLLM。

### 自托管 vs 托管是另一个决策

第 17 阶段 · 01(托管大云平台)、· 02(推理平台)讲的是托管。本课假定你已经决定自托管。自托管的理由:数据驻留、定制微调、规模化后的总拥有成本、托管平台没有的领域模型。

### 需要记住的数字

- TGI 维护模式:2025 年 12 月 11 日。
- vLLM v0.15.1:2026 年 2 月;PyTorch 2.10;Blackwell SM120 支持。
- SGLang 生产规模:400,000+ 张 GPU。
- Ollama 相对 llama.cpp 的吞吐差距:慢 15-30%;生产负载下差 3 倍。

```figure
data-parallel
```

## 投入使用

`code/main.py` 是一个决策树遍历器:给定硬件 + 规模 + 负载,选出引擎并解释原因。

## 交付

本课产出 `outputs/skill-engine-picker.md`。给定约束条件,选出引擎并写出迁移计划。

## 练习

1. 用你的硬件 / 规模 / 负载跑 `code/main.py`。输出和你的直觉一致吗?
2. 你的基础设施是 12 张 H100 加 8 张 AMD MI300X。选什么引擎?为什么 TRT-LLM 不在考虑范围?
3. 一个团队 2026 年还想用 TGI,理由是"我们就熟这个"。论证迁移的理由。
4. 从 Ollama 开发到 vLLM 生产:量化、配置和可观测性上有什么变化?
5. 一个 RAG 产品,P99 前缀长度 8K,跨租户高复用。选一个引擎,并叠加第 17 阶段 · 11 和 · 18 的技术。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|----------|
| llama.cpp | "CPU 那个" | 模型支持最广,CPU 上最快 |
| Ollama | "笔记本那个" | 一条命令装机,开发级吞吐 |
| TGI | "HF 家的服务" | 2025 年 12 月起进入维护模式 |
| vLLM | "默认那个" | 2026 年广泛的生产基线 |
| SGLang | "智能体那个" | 重前缀、RadixAttention |
| TRT-LLM | "锁死 NVIDIA" | Blackwell 吞吐王,仅限 NVIDIA |
| GGUF | "llama.cpp 格式" | 打包好的 K-quant 变体 |
| Production-stack | "vLLM K8s" | 第 17 阶段 · 18 的参考部署 |
| 流水线模式 | "开发→预发→生产" | Ollama → llama.cpp → vLLM;各引擎权重格式不同 |

## 延伸阅读

- [AI Made Tools — vLLM vs Ollama vs llama.cpp vs TGI 2026](https://www.aimadetools.com/blog/vllm-vs-ollama-vs-llamacpp-vs-tgi/)
- [Morph — llama.cpp vs Ollama 2026](https://www.morphllm.com/comparisons/llama-cpp-vs-ollama)
- [n1n.ai — Comprehensive LLM Inference Engine Comparison](https://explore.n1n.ai/blog/llm-inference-engine-comparison-vllm-tgi-tensorrt-sglang-2026-03-13)
- [PremAI — 10 Best vLLM Alternatives 2026](https://blog.premai.io/10-best-vllm-alternatives-for-llm-inference-in-production-2026/)
- [TGI maintenance announcement](https://github.com/huggingface/text-generation-inference)——release notes。
- [vLLM v0.15.1 release notes](https://github.com/vllm-project/vllm/releases)
