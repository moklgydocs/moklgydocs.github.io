# 终局项目 07 —— 端到端微调流水线(数据 → SFT → DPO → 上线服务)

> 一个 8B 模型,在你自己的数据上训练,用你自己的偏好数据做 DPO 对齐,量化,投机解码,以可度量的 $/1M token 成本对外服务。2026 年的开源栈是:Axolotl v0.8、TRL 0.15、Unsloth 做快速迭代、GPTQ/AWQ/GGUF 做量化、vLLM 0.7 配 EAGLE-3 做服务。本终局项目是把整条流水线可复现地跑通——YAML 进、服务端点出——并按 2026 模型开放框架(MOF)发布一份模型卡。

**类型:** 终局项目
**编程语言:** Python(流水线),YAML(配置),Bash(脚本)
**前置要求:** 第 2 阶段(机器学习)、第 3 阶段(深度学习)、第 7 阶段(Transformer)、第 10 阶段(从零构建 LLM)、第 11 阶段(LLM 工程)、第 17 阶段(基础设施)、第 18 阶段(安全)
**涉及阶段:** P2 · P3 · P7 · P10 · P11 · P17 · P18
**预计耗时:** 35 小时

## 问题

2026 年,每个正经 AI 团队都常备一条微调流水线。不是因为要发布前沿基座模型,而是因为下游适配——领域 SFT、用标注偏好做 DPO、为投机解码蒸馏草稿模型、用 EAGLE-3 上线服务——才是可度量收益的所在。Axolotl v0.8 管多卡 SFT 配置,TRL 0.15 管 DPO 与 GRPO,Unsloth 让你单卡快速迭代,vLLM 0.7 配 EAGLE-3 把解码吞吐拉高一倍甚至两倍且不损质量。工具都现成,手艺在 YAML、数据卫生和评测纪律里。

你要把一个 8B 基座(Llama 3.3、Qwen3 或 Gemma 3)在任务数据上先 SFT 再 DPO,量化后上线服务,用 lm-evaluation-harness、RewardBench-2、MT-Bench-v2、MMLU-Pro 度量增益,并按 2026 MOF 产出模型卡。重点是可复现——一条命令把整条流水线从头重跑。

## 概念

流水线分五段。**数据**:去重(MinHash / Datatrove)、质量过滤(Nemotron-CC 风格分类器)、PII 清洗、对照公开基准做污染检查。**SFT**:Axolotl YAML,8xH100 上 ZeRO-3,cosine 调度,序列打包,2–3 个 epoch。**DPO 或 GRPO**:TRL 配置,1 个 epoch,偏好对来自人工标注或模型评判,扫 beta。**量化**:GPTQ + AWQ + GGUF 三种,方便不同部署。**服务**:vLLM 0.7 配 EAGLE-3 投机头(或 SGLang 配 SpecForge),K8s 部署,按队列等待做 HPA。

消融实验是交付物:在三个任务基准上对比 SFT-only、SFT+DPO、SFT+GRPO。服务指标:batch 1 / 8 / 32 的 tokens/s、EAGLE-3 接受率、$/1M token。安全评测:Llama Guard 4 通过率。模型卡:偏差评测、可复现种子、数据许可。

## 架构

```
raw data (HF datasets + internal)
    |
    v
Datatrove dedup + Nemotron-CC quality filter + PII scrub
    |
    v
split hygiene (MMLU-Pro contamination check)
    |
    v
Axolotl SFT config (YAML)  ---> 8xH100, ZeRO-3
    |
    v
TRL DPO / GRPO config       ---> 4xH100, 1 epoch
    |
    v
GPTQ + AWQ + GGUF quantize
    |
    v
vLLM 0.7 + EAGLE-3 speculative decoding
    |
    v
K8s deployment, HPA on queue-wait
    |
    v
lm-eval-harness + RewardBench-2 + MT-Bench-v2 + MMLU-Pro
    |
    v
model card (2026 MOF) + safety eval (Llama Guard 4)
```

## 技术栈

- 数据:Datatrove 去重,Nemotron-CC 分类器做质量,Presidio 清洗 PII
- 基座:Llama 3.3 8B、Qwen3 14B 或 Gemma 3 12B
- SFT:Axolotl v0.8,ZeRO-3,Flash Attention 3,序列打包
- 偏好微调:TRL 0.15 做 DPO 或 GRPO;Unsloth 做单卡迭代
- 量化:GPTQ(Marlin)、AWQ、经 llama.cpp 出 GGUF
- 服务:vLLM 0.7 配 EAGLE-3 投机解码(或 SGLang 0.4 + SpecForge)
- 评测:lm-evaluation-harness、RewardBench-2、MT-Bench-v2、MMLU-Pro
- 安全评测:Llama Guard 4、ShieldGemma-2
- 基础设施:Kubernetes + NVIDIA device plugin,按队列等待指标做 HPA
- 可观测:W&B 管训练,Langfuse 管推理

```figure
ce-finetune-stages
```

## 动手构建

1. **数据流水线。** 原始语料跑 Datatrove 去重。过 Nemotron-CC 风格质量分类器。Presidio 清洗 PII。带显式种子写出 train/val 切分。

2. **污染检查。** 对每个验证集,与 MMLU-Pro、MT-Bench-v2、RewardBench-2 测试集算 MinHash,有重叠即拒绝。

3. **Axolotl SFT。** YAML 配 ZeRO-3、FA3、序列打包。8xH100 上 2–3 个 epoch。日志进 W&B。

4. **TRL DPO / GRPO。** 拿 SFT 检查点,在偏好对上跑一个 epoch 的 DPO(或在数学/代码上用可验证奖励跑 GRPO)。扫 beta。

5. **量化。** 出三份:GPTQ-INT4-Marlin、AWQ-INT4、给 llama.cpp 的 GGUF-Q4_K_M。记录体积与标称吞吐。

6. **投机解码上线。** vLLM 0.7 配置,草稿头用 Red Hat Speculators 训练的 EAGLE-3。度量接受率与 batch 1 / 8 / 32 的尾延迟。在同一评测上报告对比 Anthropic / OpenAI 的 $/1M token。

7. **评测矩阵。** 对 base、SFT-only、SFT+DPO、SFT+GRPO 分别跑 lm-eval-harness、RewardBench-2、MT-Bench-v2、MMLU-Pro,出一张表。

8. **安全评测。** dev 集上 Llama Guard 4 通过率。ShieldGemma-2 输出过滤。

9. **模型卡。** MOF 2026 模板:数据、训练、评测、安全、许可,附 YAML 与 commit SHA 的可复现性章节。

## 投入使用

```
$ ./pipeline.sh config/llama3.3-8b-domainX.yaml
[data]    300k deduped, 12k filtered, 280k accepted (seed=7)
[SFT]     3 epochs, 8xH100, 6h12m, val loss 1.42 -> 1.03
[DPO]     1 epoch, beta=0.08, 4xH100, 1h40m
[quant]   GPTQ-INT4 4.6 GB, AWQ-INT4 4.8 GB, GGUF-Q4_K_M 5.1 GB
[serve]   vLLM 0.7, EAGLE-3 acceptance 0.74, p99 126ms @ bs=8
[eval]    MMLU-Pro +3.2, MT-Bench-v2 +0.41, RewardBench-2 +0.08
[card]    model-card.md generated under 2026 MOF
```

## 交付

`outputs/skill-finetuning-pipeline.md` 描述交付物。一条命令跑完数据→SFT→DPO→量化→服务→评测,产出模型卡与服务端点。

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | 相对基座的评测增量 | 目标任务上的实测增益(MMLU-Pro、MT-Bench-v2、任务专项) |
| 20 | 流水线可复现性 | 一条命令、相同种子端到端重跑 |
| 20 | 数据卫生 | 去重率、PII 清洗覆盖率、污染检查全绿 |
| 20 | 服务效率 | bs=1/8/32 的 tokens/s、EAGLE-3 接受率、$/1M token |
| 15 | 模型卡 + 安全评测 | 2026 MOF 完整度 + Llama Guard 4 通过率 |
| **100** | | |

## 练习

1. 在同一任务基准上对比 SFT-only、SFT+DPO、SFT+GRPO。报告哪种偏好方法胜出、赢多少。

2. 把 Llama 3.3 8B 换成 Qwen3 14B。在同等质量下度量 $/1M token。

3. 度量 EAGLE-3 在领域数据与通用 ShareGPT 上的接受率。报告差值及其对延迟预算的含义。

4. 注入 1% 污染(把 MMLU-Pro 答案泄进训练数据),重跑评测,看 MMLU-Pro 准确率不真实地上跳。造一个能抓住它的污染检查 CI 门。

5. 加 LoRA SFT 作为全量微调的替代。度量显存降 10 倍时的质量差距。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| Axolotl | "SFT 训练器" | YAML 驱动的统一训练器,支持 SFT、DPO 与蒸馏 |
| TRL | "偏好调优库" | Hugging Face 的 DPO、GRPO、PPO 库 |
| GRPO | "组相对策略优化" | DeepSeek R1 的 RL 配方,用可验证奖励 |
| EAGLE-3 | "投机解码草稿" | 一次预测 N 个 token 的草稿头;vLLM 用目标模型验证 |
| MOF | "模型开放框架" | 2026 年按数据、代码、许可给模型发布分级的标准 |
| 污染检查 | "切分卫生" | 基于 MinHash 检测测试集泄漏进训练集 |
| 接受率 | "EAGLE / MTP 指标" | 草稿 token 被目标模型接受的比例 |

## 延伸阅读

- [Axolotl documentation](https://axolotl-ai-cloud.github.io/axolotl/) —— SFT / DPO 训练器参考
- [TRL documentation](https://huggingface.co/docs/trl) —— DPO 与 GRPO 参考实现
- [Unsloth](https://github.com/unslothai/unsloth) —— 单卡迭代参考
- [DeepSeek R1 paper (arXiv:2501.12948)](https://arxiv.org/abs/2501.12948) —— GRPO 方法论
- [vLLM + EAGLE-3 documentation](https://docs.vllm.ai) —— 参考服务栈
- [SGLang SpecForge](https://github.com/sgl-project/SpecForge) —— 另一个投机解码训练器
- [Model Openness Framework 2026](https://isocpp.org/) —— 开放发布分级标准
- [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) —— 权威评测运行器
