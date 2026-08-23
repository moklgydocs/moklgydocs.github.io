# ASCII 艺术与视觉越狱

> Jiang、Xu、Niu、Xiang、Ramasubramanian、Li、Poovendran,《ArtPrompt: ASCII Art-based Jailbreak Attacks against Aligned LLMs》(ACL 2024,arXiv:2402.11753)。把有害请求里与安全相关的 token 遮住,换成同一批字母的 ASCII 艺术字形,再发送伪装后的提示。GPT-3.5、GPT-4、Gemini、Claude、Llama-2 全都无法稳健识别 ASCII 艺术 token。该攻击能绕过 PPL(困惑度过滤)、改写防御和重分词。相关工作:ViTC 基准测量模型对非语义视觉提示的识别;StructuralSleight 把这类攻击推广到"不常见文本编码结构"(树、图、嵌套 JSON),形成一整族编码攻击。

**类型:** 动手构建
**编程语言:** Python(标准库,ArtPrompt token 遮蔽测试台)
**前置要求:** 第 18 阶段 · 12(PAIR)、第 18 阶段 · 13(MSJ)
**预计耗时:** 约 60 分钟

## 学习目标

- 描述 ArtPrompt 攻击:词汇识别步骤、ASCII 艺术替换、最终伪装提示。
- 解释为什么标准防御(PPL、改写、重分词)对 ArtPrompt 失效。
- 定义 ViTC 并描述它测量什么。
- 描述 StructuralSleight 如何推广到任意不常见文本编码结构。

## 问题

改写与角色扮演攻击(第 12 课)和长上下文攻击(第 13 课)都作用在文本级模式上。ArtPrompt 作用在识别层面:模型解析不到那个违禁 token,它解析的是一幅用字符渲染的图像。安全过滤器看见的是无害的标点,模型看见的是一个词。

## 概念

### ArtPrompt 两步走

第 1 步,词汇识别。给定一个有害请求,攻击者用 LLM 识别与安全相关的词(例如 "how to make a bomb" 里的 "bomb")。

第 2 步,伪装提示生成。把每个识别出的词换成它的 ASCII 艺术字形(一块 7x5 或 7x7 的字符块,拼出字母形状)。模型收到的是一张标点和空格组成的网格——能力足够的模型能认出那个词,而安全过滤器只看见网格。

结果:GPT-4、Gemini、Claude、Llama-2、GPT-3.5 全部失守,在其基准子集上攻击成功率超过 75%。

### 为什么标准防御失效

- **PPL(困惑度过滤)。** ASCII 艺术困惑度高——但所有新奇输入困惑度都高。能拦住 ArtPrompt 的阈值也会拦下合法的结构化输入。
- **改写。** 改写提示会破坏 ASCII 艺术。但实践中,改写 LLM 常常会保留或重建这些字形。
- **重分词。** 换一种切分 token 的方式,改变不了"模型的视觉在识别字母形状"这一事实。

根本问题在于:安全过滤器工作在 token 级或语义级,而 ArtPrompt 工作在视觉识别级。

### ViTC 基准

测量模型对非语义视觉提示的识别能力——读 ASCII 艺术、wingdings 及其他非文本语义的视觉内容。ArtPrompt 的有效性与 ViTC 准确率相关:模型读视觉文字越强,ArtPrompt 对它越有效。这是一个能力-安全权衡。

### StructuralSleight

ArtPrompt 的推广:不常见文本编码结构(UTES)。树、图、嵌套 JSON、JSON 里套 CSV、diff 风格代码块。只要一种结构在安全训练数据中罕见、但模型能解析,它就能藏匿有害内容。

防御含义:安全必须泛化到模型能解析的所有结构化表示上。而这个集合很大,还在增长。

### 图像模态的对应物

视觉 LLM(GPT-5.2、Gemini 3 Pro、Claude Opus 4.5、Grok 4.1)扩展了攻击面。用真实图像做的 ArtPrompt 式攻击比 ASCII 艺术版更强,因为图像编码器提供更丰富的信号。

### 本课在第 18 阶段中的位置

第 12–14 课描述三个正交的攻击向量:迭代精炼(PAIR)、上下文长度(MSJ)、编码(ArtPrompt/StructuralSleight)。第 15 课从以模型为中心的攻击转向系统边界攻击(间接提示注入);第 16 课讲防御工具的应对。

```figure
al-ascii-cloak
```

## 投入使用

`code/main.py` 搭一个玩具 ArtPrompt。你可以把有害查询里的特定词伪装成 ASCII 艺术字形,验证伪装后的字符串能通过关键词过滤器,并(可选)用一个简单识别器把伪装字符串解码回去。

## 交付

本课产出 `outputs/skill-encoding-audit.md`。给定一份越狱防御报告,它枚举覆盖到的编码攻击家族(ASCII 艺术、base64、火星文 leet-speak、UTF-8 同形字、UTES),以及各自被哪一层防御捕获。

## 练习

1. 运行 `code/main.py`。验证伪装字符串能通过简单关键词过滤器。报告所需的字符级改动。

2. 对同一个目标词实现第二种编码:base64。比较它与 ArtPrompt 的绕过率和还原难度。

3. 读 Jiang 等人 2024 第 4.3 节(五模型结果)。提出一个理由,解释为什么同一基准上 Claude 对 ArtPrompt 的抵抗力高于 Gemini。

4. 设计一个生成前防御,检测提示中的 ASCII 艺术形状区域。测量它在合法代码、表格和数学记号上的误报率。

5. StructuralSleight 列了 10 种编码结构。草拟一个能处理全部 10 种的通用防御,并估算每条被防御提示的计算成本。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|-----------------|------------------------|
| ArtPrompt | "ASCII 艺术攻击" | 用 ASCII 艺术字形遮住安全词的两步越狱 |
| 伪装(Cloaking) | "把词藏起来" | 把违禁 token 换成模型能读、过滤器读不出的视觉表示 |
| UTES | "不常见结构" | 不常见文本编码结构——树、图、嵌套 JSON 等,用于走私内容 |
| ViTC | "视觉文字能力" | 测量模型读取非语义视觉编码能力的基准 |
| 困惑度过滤 | "PPL 防御" | 拒绝高困惑度提示;因合法结构化输入同样高分而失效 |
| 重分词 | "换分词器防御" | 用另一种分词器预处理提示;因识别发生在视觉层面而失效 |
| 同形字 | "撞脸字符" | 与拉丁字母看起来一样的 Unicode 字符;绕过子串检查 |

## 延伸阅读

- [Jiang et al. — ArtPrompt (ACL 2024, arXiv:2402.11753)](https://arxiv.org/abs/2402.11753) —— ASCII 艺术越狱论文
- [Li et al. — StructuralSleight (arXiv:2406.08754)](https://arxiv.org/abs/2406.08754) —— UTES 推广
- [Chao et al. — PAIR (第 12 课, arXiv:2310.08419)](https://arxiv.org/abs/2310.08419) —— 互补的迭代攻击
- [Anil et al. — Many-shot Jailbreaking (第 13 课)](https://www.anthropic.com/research/many-shot-jailbreaking) —— 互补的长度攻击
