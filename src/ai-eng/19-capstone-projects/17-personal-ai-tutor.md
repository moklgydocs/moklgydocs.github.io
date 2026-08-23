# 终局项目 17 —— 个人 AI 导师(自适应、多模态、带记忆)

> Khanmigo(可汗学院)、Duolingo Max、Google LearnLM / Gemini 教育版、Quizlet Q-Chat、Synthesis Tutor,都在 2026 年把自适应多模态辅导做成了规模化产品。共同形态是:苏格拉底式策略(绝不直接倒答案)、每次互动后更新的学习者模型(贝叶斯知识追踪风格)、语音 + 文本 + 拍照算式输入、课程图谱检索、间隔重复调度,以及面向适龄内容的硬性安全过滤。本终局项目是交付一个学科专属导师(K-12 代数或 Python 入门),与 10 名学习者做两周功效研究,并通过内容安全审计。

**类型:** 终局项目
**编程语言:** Python(后端、学习者模型),TypeScript(Web 应用),SQL(课程图谱,Postgres + Neo4j)
**前置要求:** 第 5 阶段(NLP)、第 6 阶段(语音)、第 11 阶段(LLM 工程)、第 12 阶段(多模态)、第 14 阶段(智能体)、第 17 阶段(基础设施)、第 18 阶段(安全)
**涉及阶段:** P5 · P6 · P11 · P12 · P14 · P17 · P18
**预计耗时:** 30 小时

## 问题

自适应辅导曾是教育技术里的研究小角落,到 2026 年已是消费级产品。Khanmigo 铺进了美国大多数学区,Duolingo Max 月活数千万,Google LearnLM / Gemini 教育版在 Google Classroom 里做辅导,Quizlet Q-Chat 挨着单词卡,Synthesis Tutor 靠"好奇心儿童导师"出了圈。共同要素:多模态输入(打字、说话、拍算式)、苏格拉底式教学(先问后讲)、每次互动后更新的学习者模型,以及严格的适龄安全。

你要为特定人群造一个这样的导师。度量门槛是一次真正的功效研究:10 名学习者,两周,前测后测。语音回路必须自然(复用终局项目 03 的子栈)。记忆必须尊重隐私。安全过滤必须通过面向 K-12 的 COPPA 感知红队测试。

## 概念

四个组件。**导师策略**是苏格拉底循环:学习者要答案时,策略反问一个引导性问题;答对了,推进到下一个概念;卡住了,给一个搭梯子的提示。**学习者模型**是贝叶斯知识追踪(或简单变体),每次互动后更新每个课程节点的掌握概率。**课程图谱**是带前置依赖边的概念 Neo4j 图;策略沿图走,挑下一个概念。**记忆**是情景 + 语义存储(agentmemory 风格),保存历史互动、错误与偏好。

UX 是多模态的。文本输入收打字答案;语音输入走 LiveKit + Whisper(复用终局项目 03);拍照输入用 dots.ocr 或 PaliGemma 2 识算式;语音输出用 Cartesia Sonic-2。安全用 Llama Guard 4 加适龄过滤器(拦截成人内容、暴力、自残),记忆保留策略感知 COPPA。

功效研究是交付物。10 名学习者,前测 + 后测,两周。报告学习增益差值与置信区间。对照组是非自适应基线(同样内容线性交付,不带导师策略)。

## 架构

```
learner device
  |
  +-- text         -> web app
  +-- voice        -> LiveKit Agents (ASR + TTS)
  +-- photo math   -> dots.ocr / PaliGemma 2
       |
       v
  tutor policy (LangGraph)
       - Socratic decision head
       - next-concept chooser (curriculum graph walk)
       - hint scaffolder
       - mastery update
       |
       v
  learner model (BKT / item-response theory)
       - per-concept mastery probability
       - spaced-repetition scheduler (SM-2 or FSRS)
       |
       v
  memory (agentmemory-style)
       - episodic: every interaction
       - semantic: learned mistakes, preferences
       - retention policy: COPPA / GDPR aware
       |
       v
  curriculum graph (Neo4j)
       - prerequisite edges
       - OER content attached
       |
       v
  safety:
    Llama Guard 4 + age-appropriate filter
    memory access guarded by learner ID scope
```

## 技术栈

- 学科选择:K-12 代数或 Python 入门(选一个做深)
- 导师策略:LangGraph,底层 Claude Sonnet 4.7(带 prompt 缓存)
- 学习者模型:贝叶斯知识追踪(经典)或 FSRS 做间隔调度
- 课程图谱:Neo4j 概念图 + 前置依赖边 + OER 内容
- 记忆:agentmemory 风格的持久向量 + 情景 + 语义存储
- 语音:LiveKit Agents 1.0 + Cartesia Sonic-2(复用终局项目 03 子栈)
- 拍照算式:dots.ocr 或 PaliGemma 2 做算式识别
- 安全:Llama Guard 4 + 自定义适龄过滤器
- 评测:布鲁姆层级问题生成、前后测装置、功效研究工具

```figure
cf-tutor-loop
```

## 动手构建

1. **课程图谱。** 建一个 50–150 个概念节点的 Neo4j(如 K-12 代数,从"数轴"到"求根公式"),带前置依赖边。每个节点挂 OER 内容(Open Textbook、OpenStax)。

2. **学习者模型。** 初始化贝叶斯知识追踪,先验:猜对率、失误率、学习速率。每次互动后更新逐概念掌握度,按学习者持久化。

3. **导师策略。** LangGraph 节点:`read_signal`(学习者的答案是对/半对/卡住了?)、`select_concept`(沿课程图谱走,挑优先级最高的概念)、`scaffold`(苏格拉底式提示)、`update_mastery`。

4. **记忆。** 每次互动写入情景存储。错误与偏好提升到语义记忆。COPPA 感知保留策略:一年后自动删除,家长可查。

5. **语音通路。** LiveKit Agents worker 接到导师策略上。ASR 用 Whisper-v3-turbo,TTS 用 Cartesia Sonic-2。支持插话(复用终局项目 03 的机制)。

6. **拍照算式通路。** 上传或拍摄图像;跑 dots.ocr 或 PaliGemma 2 识别算式;作为结构化输入喂给导师。

7. **安全。** 每条模型输出过 Llama Guard 4 + 适龄过滤器(拦截自残、成人内容、暴力)。记忆访问按学习者 ID 收敛;家长有删除入口。

8. **功效研究。** 10 名学习者,前测(标准化 30 题基线),两周导师互动(每周 3 次),后测。对照组:10 名学习者用同样内容的非自适应基线。

9. **周报。** 按学习者自动生成 PDF 摘要:探索过的主题、掌握度轨迹、下一步建议。

## 投入使用

```
learner: "I don't understand why 3x + 6 = 12 means x = 2"
[signal]   stuck
[concept]  'isolating variables' (prerequisite: addition-subtraction-equality)
[scaffold] "what number would you subtract from both sides to start?"
learner: "6"
[signal]   correct
[mastery]  addition-subtraction-equality: 0.62 -> 0.77
[concept]  continue 'isolating variables'
[scaffold] "great. now what is 3x / 3 equal to?"
```

## 交付

`outputs/skill-ai-tutor.md` 是交付物:一个学科专属的自适应导师,带多模态输入、学习者模型、记忆、安全与实测功效。

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | 学习增益差值 | 10 名学习者两周研究的前后测差值 |
| 20 | 苏格拉底式保真度 | 转写抽样的细则评分 |
| 20 | 多模态体验 | 语音 + 拍照 + 文本端到端连贯 |
| 20 | 安全 + 隐私姿态 | Llama Guard 4 通过率 + COPPA 感知保留 |
| 15 | 课程广度与图质量 | 概念覆盖 + 前置图一致性 |
| **100** | | |

## 练习

1. 带与不带自适应学习者模型(随机概念顺序)各跑一次功效研究,报告差值。预期自适应会赢,但赢多少才是有意思的数字。

2. 加多模态探针:同一概念题分别以文本、语音、拍照呈现。度量学习者用偏好模态是否收敛更快。

3. 造家长看板:练过的主题、掌握度轨迹、即将学的概念、安全事件(护栏触发记录)。对齐 COPPA。

4. 加语言切换模式:导师接受西班牙语输入并用西班牙语教学。度量 X-Guard 覆盖。

5. 压测记忆隐私:验证学习者 A 即使通过语音片段重灌攻击也看不到学习者 B 的数据。记录未遂访问并告警。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| 苏格拉底式策略 | "问,而不是倒" | 导师反问引导性问题,而不是直接给答案 |
| 贝叶斯知识追踪 | "BKT" | 逐概念掌握概率的经典学习者模型方程 |
| FSRS | "自由间隔重复调度器" | 2024 年的间隔重复调度器,优于 SM-2 |
| 课程图谱 | "概念 DAG" | 带前置依赖边的概念 Neo4j 图 |
| 情景记忆 | "逐互动日志" | 每次互动都存下来供日后检索 |
| 语义记忆 | "习得模式库" | 从情景记忆压缩提升而来的错误与偏好 |
| COPPA | "儿童隐私法" | 美国限制收集 13 岁以下儿童数据的法律 |

## 延伸阅读

- [Khanmigo (Khan Academy)](https://www.khanmigo.ai) —— 消费级 K-12 导师参考
- [Duolingo Max](https://blog.duolingo.com/duolingo-max/) —— 语言学习导师参考
- [Google LearnLM / Gemini for Education](https://blog.google/technology/google-deepmind/learnlm) —— 托管参考模型
- [Quizlet Q-Chat](https://quizlet.com) —— 另一个参考
- [Synthesis Tutor](https://www.synthesis.com) —— 创业公司参考
- [FSRS algorithm](https://github.com/open-spaced-repetition/fsrs4anki) —— 间隔重复调度器
- [Bayesian Knowledge Tracing](https://en.wikipedia.org/wiki/Bayesian_knowledge_tracing) —— 学习者模型经典
- [LiveKit Agents](https://github.com/livekit/agents) —— 语音栈
