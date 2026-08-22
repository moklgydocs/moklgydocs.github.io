# 推理平台经济学 —— Fireworks、Together、Baseten、Modal、Replicate、Anyscale

> 2026 年的推理市场早已不是出租 GPU 时间。它分化为三支:定制芯片(Groq、Cerebras、SambaNova)、GPU 平台(Baseten、Together、Fireworks、Modal)、API 优先集市(Replicate、DeepInfra)。Fireworks 2026 年 5 月 1 日把 GPU 租金上调 $1/小时,而 $4B 估值配每日 10T+ token,说明走量模式成立;Baseten 2026 年 1 月以 $5B 估值完成 $3 亿 E 轮。竞争定位规则很简单:Fireworks 优化延迟,Together 优化目录广度,Baseten 优化企业质感,Modal 优化 Python 原生 DX,Replicate 优化多模态覆盖,Anyscale 优化分布式 Python。本课给你一张可以直接递给创始人的矩阵。

**类型:** 学习
**编程语言:** Python(标准库,玩具单次调用经济学比较器)
**前置要求:** 第 17 阶段 · 01(托管 LLM 平台)、第 17 阶段 · 04(serving 引擎内幕)
**预计耗时:** 约 60 分钟

## 学习目标

- 说出三个市场板块(定制芯片、GPU 平台、API 优先),并把每个厂商归位。
- 解释为什么"按 token"的 API 定价向 serving 引擎的成本曲线压缩,而非硬件的。
- 在至少三家厂商间计算单次请求的有效成本,并解释何时按分钟(Baseten、Modal)胜过按 token。
- 识别哪种负载该默认选哪个平台(serverless 突发、稳定高吞吐、微调变体、多模态)。

## 问题

你评估过托管云厂平台,决定要更窄更快的提供商——要延迟选 Fireworks,要广度选 Together,微调自定义模型选 Baseten。现在有六个真实选项,而定价页对不上:Fireworks 标 $/M token,Baseten 标 $/分钟,Modal 标 $/秒,Replicate 标 $/次预测。不建模负载,没法正面对比。

更麻烦的是,每张定价页背后的商业模式不同:Fireworks 在共享 GPU 上跑自研引擎(FireAttention),按 token 费率反映的是它们的利用率曲线;Baseten 给你 Truss + 专属 GPU,按分钟反映的是排他性;Modal 是真 Python serverless——按秒计费、亚秒冷启动。同样的输出(一个 LLM 响应),三种成本函数。

本课为六家建模,告诉你各自何时胜出。

## 概念

### 三个板块

**定制芯片** —— Groq(LPU)、Cerebras(WSE)、SambaNova(RDU)。同模型上解码通常比 GPU 集群快 5–10 倍。按 token 更贵(Groq 2025 年末 Llama-70B 约 $0.99/M),但延迟敏感场景无敌。Groq 是语音智能体和实时翻译的生产选择。

**GPU 平台** —— Baseten、Together、Fireworks、Modal、Anyscale。跑 NVIDIA(2026 年是 H100、H200、B200)或偶尔的 AMD。位于"裸 GPU 出租"(RunPod、Lambda)与"云厂托管服务"(Bedrock)之间的经济层。

**API 优先集市** —— Replicate、DeepInfra、OpenRouter、Fal。目录广,按预测或按秒付费,强调首次调用的时间。

### Fireworks —— 优化延迟的 GPU 平台

- FireAttention 自研引擎;宣传同配置下延迟比 vLLM 低 4 倍。
- 批处理档约为 serverless 价格的 50%,给非交互负载。
- 微调模型按基座模型同价 serving——相对那些对你的 LoRA 加价的提供商,这是真差异化。
- 2026 年中:按需 GPU 租金 2026 年 5 月 1 日起上调 $1/小时。大规模可谈量价。
- 财务信号:$4B 估值,日处理 10T+ token。

### Together —— 优化广度

- 200+ 模型,上游发布几天内即收录开源新作。
- 同档 LLM 比 Replicate 便宜 50–70%——"AI 原生云"的定位就是走量和目录。
- 推理 + 微调 + 训练,一个 API。

### Baseten —— 优化企业质感

- Truss 框架:模型打包清单一站式——依赖、密钥、serving 配置。
- GPU 从 T4 到 B200。按分钟计费,冷启动缓解合理。
- SOC 2 Type II、HIPAA 就绪。金融科技和医疗的常见选择。
- $5B 估值,2026 年 1 月 E 轮($3 亿,CapitalG、IVP、NVIDIA)。

### Modal —— 优化 Python 原生

- 纯 Python 的基础设施即代码:给函数加 `@modal.function(gpu="A100")` 装饰器,一条命令部署。
- 按秒计费。预热后冷启动 2–4 秒;小模型 <1 秒。
- $1.1B 估值($87M B 轮,2025)。独立调查中开发者体验得分最高。

### Replicate —— 多模态广度

- 按预测付费。图像、视频、音频模型的默认平台。
- 集成生态(Zapier、Vercel、CMS 插件)。
- LLM 按 token 费率不占优,赢在多模态丰富度。

### Anyscale —— Ray 原生

- 建在 Ray 上;RayTurbo 是 Anyscale 专有推理引擎(与 vLLM 竞争)。
- 最适合"推理只是大图一个节点"的分布式 Python 负载。
- 托管 Ray 集群;与 Ray AIR、Ray Serve 深度集成。

### 按 token vs 按分钟 —— 各自何时胜出

负载对延迟不敏感且突发时,按 token 合理——用多少付多少。利用率高且可预测时,按分钟合理——GPU 跑满后就胜过按 token。

粗略规则:持续利用率超过专属 GPU 的约 30%,按分钟(Baseten、Modal)开始胜过按 token(Fireworks、Together)。低于此,按 token 赢,因为你不用为空转付费。

### 自研引擎才是真护城河

vLLM 和 SGLang 之上,每个平台都宣称有自研引擎:FireAttention、RayTurbo、Baseten 推理栈。自研引擎的说法有营销水分——诚实的说法是:vLLM + SGLang 约占生产开源推理的 80%,平台层的差异化在 DX、归因和 SLA。

### 该记住的数字

- Fireworks GPU 租金:2026 年 5 月 1 日起上调 $1/小时。
- Fireworks 宣称:同配置延迟比 vLLM 低 4 倍。
- Together:LLM 上比 Replicate 便宜 50–70%。
- Baseten 估值:$5B(E 轮,2026 年 1 月,$3 亿轮次)。
- Modal 估值:$1.1B(B 轮,2025)。
- 持续利用率约 30% 以上,按分钟胜过按 token。

```figure
cost-per-token
```

## 投入使用

`code/main.py` 在合成负载上跨定价模型对比六家厂商,报告 $/天和有效 $/M token。运行它,找出按 token 与按分钟的盈亏平衡点。

## 交付

本课产出 `outputs/skill-inference-platform-picker.md`。给定负载画像、SLA 和预算,选出主推理平台并点名备选。

## 练习

1. 运行 `code/main.py`。一块 H100 上的 70B 模型,持续利用率多少时 Baseten(按分钟)胜过 Fireworks(按 token)?自己推导交叉点,与经验法则对比。
2. 你的产品同时 serving 图像生成、聊天和语音转文字。为每种模态选平台,并说出统一它们的网关模式。
3. Fireworks 把你的主模型涨价 $1/小时。若 40% 流量迁到批处理档(5 折),建模混合成本影响。
4. 受监管客户要求 SOC 2 Type II + HIPAA + 专属 GPU。哪三个平台可行?谁在 FinOps 上胜出?
5. 对比 Llama 3.1 70B 在 Fireworks serverless、Together 按需、Baseten 专属、Replicate API 上的每千次预测成本。每天 10 次预测时谁最便宜?每天 10,000 次呢?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| 定制芯片 | "非 GPU 芯片" | Groq LPU、Cerebras WSE、SambaNova RDU——为解码优化 |
| FireAttention | "Fireworks 引擎" | 自研注意力内核;宣传延迟比 vLLM 低 4 倍 |
| Truss | "Baseten 的格式" | 模型打包清单;依赖 + 密钥 + serving 配置 |
| 按 token | "API 定价" | 按消耗的 token 计费;不为空闲付费 |
| 按分钟 | "专属定价" | 按墙钟 GPU 时间计费;高利用率时胜出 |
| 按预测 | "Replicate 定价" | 按模型调用次数计费;图像/视频常见 |
| RayTurbo | "Anyscale 引擎" | Ray 上的专有推理;在 Ray 集群上与 vLLM 竞争 |
| 批处理档 | "五折" | 非交互队列,费率降低;Fireworks、OpenAI 常见 |
| 微调按基座价 | "Fireworks LoRA" | LoRA 请求按基座模型费率计(差异化卖点) |

## 延伸阅读

- [Fireworks 定价](https://fireworks.ai/pricing) —— 按 token 费率、批处理档、GPU 租金。
- [Baseten 定价](https://www.baseten.co/pricing/) —— 按分钟费率、承诺容量、企业档。
- [Modal 定价](https://modal.com/pricing) —— 按秒 GPU 费率与免费额度。
- [Together AI 定价](https://www.together.ai/pricing) —— 模型目录与按 token 费率。
- [Anyscale 定价](https://www.anyscale.com/pricing) —— RayTurbo 与托管 Ray 定价。
- [Northflank —— Fireworks AI 替代品](https://northflank.com/blog/7-best-fireworks-ai-alternatives-for-inference) —— 对比评估。
- [Infrabase —— 2026 AI 推理 API 提供商](https://infrabase.ai/blog/ai-inference-api-providers-compared) —— 厂商版图。
