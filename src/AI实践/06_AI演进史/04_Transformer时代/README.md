---
title: Transformer 时代（2017–2020）
icon: fa6-solid:wand-magic-sparkles
order: 4
category:
  - AI历史
tag:
  - Transformer
  - 注意力机制
  - BERT
  - GPT
  - 预训练
---

# Transformer 时代（2017–2020）

## 背景：序列模型的瓶颈

到 2016 年，NLP 的标准解法是 LSTM + Attention。但这套方案有一个根本缺陷：

**LSTM 必须逐步处理序列**——要处理第 100 个词，必须先处理前 99 个。无法并行。

这意味着：
- 长序列训练极慢（600 万参数的 LSTM 训练一周）
- GPU 的并行能力被严重浪费
- 序列越长，早期信息越容易被遗忘

2017 年，Google 的一篇论文改变了这一切。

---

## 2017 — "Attention Is All You Need"

**人物**：Ashish Vaswani、Noam Shazeer、Niki Parmar 等，Google Brain / Google Research

**论文**：《Attention Is All You Need》，2017 年 NIPS（现 NeurIPS）

**核心主张**：扔掉 RNN 和 CNN，只用注意力机制（Attention）就能处理序列，而且可以**完全并行**。

### 为什么叫"注意力"

想象你在读一句话："那只**猫**坐在垫子上，**它**很舒服。"

理解"它"指的是"猫"，你的大脑在读"它"的时候，注意力会自动集中到"猫"这个词。

Attention 机制就是让模型学会：**处理每个词时，该把多少注意力分配给其他词。**

### Self-Attention 的计算

```
输入：词向量序列 X = [x₁, x₂, ..., xₙ]

对每个词，生成三个向量：
  Query (Q) = X × W_Q   ← "我想要找什么"
  Key   (K) = X × W_K   ← "我能提供什么"
  Value (V) = X × W_V   ← "提供的实际内容"

计算注意力分数（词 i 对词 j 的关注度）：
  score(i,j) = Q_i · K_j / √d_k    ← 点积，再缩放

归一化（Softmax）：
  attention(i,j) = softmax(score(i,:))

加权聚合：
  output_i = Σ_j attention(i,j) × V_j
```

**直觉理解**：
- Q（Query）：每个词问"有没有和我相关的词？"
- K（Key）：每个词说"我的'相关性标签'是什么"
- V（Value）：找到相关词后，取它们的实际内容加权混合

### Multi-Head Attention

不只用一组 Q/K/V，而是用 8 组（8 个"头"）并行计算，每个头学习不同类型的关系：

```
头 1：可能学习"主谓关系"（主语和动词的注意力）
头 2：可能学习"修饰关系"（形容词和名词的注意力）
头 3：可能学习"代词指代"（代词和先行词的注意力）
...
头 8：可能学习"时态一致"...

8 个头的输出拼接后，再投影到输出空间
```

### Transformer 完整架构

```
                    输出（生成下一个词）
                        ↑
             ┌─────────────────────┐
             │   线性层 + Softmax   │
             └─────────────────────┘
                        ↑
             ┌─────────────────────┐      Decoder 堆叠 N 层
             │  前馈网络 + Add&Norm │
             │  交叉注意力 +Add&Norm│◄── 编码器输出（K, V）
             │  自注意力 + Add&Norm │
             └─────────────────────┘
                                           ↑
             ┌─────────────────────┐      Encoder 的输出
             │  前馈网络 + Add&Norm │
             │  自注意力 + Add&Norm │      Encoder 堆叠 N 层
             └─────────────────────┘
                        ↑
             位置编码（Positional Encoding）
                        ↑
                    输入词嵌入
```

**为什么有位置编码**：
- 纯注意力机制不知道词的顺序（"我爱你"和"你爱我"的词相同但意思不同）
- 位置编码用正弦/余弦函数给每个位置注入位置信息

**Add & Norm（残差+层归一化）**：
- 继承 ResNet 的残差连接，防止梯度消失
- Layer Normalization 稳定训练

### 并行化为什么重要

```
RNN 处理 100 个词：
步骤 1 → 步骤 2 → ... → 步骤 100（串行，等待）

Transformer 处理 100 个词：
所有 100 个词同时计算注意力（并行，充分利用 GPU）
```

训练速度提升了一个数量级。这使得训练更大的模型成为可能。

---

## 2018 — BERT：双向预训练的突破

**人物**：Jacob Devlin 等，Google AI Language

**全称**：Bidirectional Encoder Representations from Transformers

**BERT 之前：ELMo（2018 年初）**

ELMo（Embeddings from Language Models）用双向 LSTM 生成上下文相关的词向量，把 6 个 NLP Benchmark 的 SOTA 全部刷新，引发轰动。

但 ELMo 的问题：仍然是 LSTM，串行，慢。

**BERT 的创新**：用 Transformer Encoder 做双向预训练。

### BERT 的两个预训练任务

**任务 1：Masked Language Model（MLM）**

```
输入："The [MASK] sat on the mat."
目标：预测 [MASK] = "cat"
```

随机遮住 15% 的词，让模型预测缺失的词。
强迫模型同时看左边和右边的上下文。

**任务 2：Next Sentence Prediction（NSP）**

```
句子 A："The man went to the store."
句子 B："He bought a gallon of milk."
标签：IsNext（是下文）

句子 A："He bought a gallon of milk."
句子 B："Penguins are flightless birds."
标签：NotNext（不是下文）
```

**为什么是"双向"**：

GPT 是单向的——处理每个词时只能看左边：

```
GPT：处理 "sat" 时，只能看 "The cat"，看不到 "on the mat"
BERT：处理 "sat" 时，同时看 "The cat" 和 "on the mat"
```

双向性让 BERT 在理解任务（分类、问答、NER）上远强于单向 GPT。

### BERT 的规格

| 版本 | 层数 | 隐藏维度 | 注意力头 | 参数量 |
|------|------|---------|---------|-------|
| BERT-Base | 12 | 768 | 12 | 1.1 亿 |
| BERT-Large | 24 | 1024 | 16 | 3.4 亿 |

**训练数据**：
- BooksCorpus（8 亿词）
- Wikipedia 英文（25 亿词）
- 共 33 亿词，在 64 个 TPU 上训练 4 天

**效果**：
- 在 GLUE Benchmark（11 个 NLP 任务）上刷新所有 SOTA
- Question Answering（SQuAD）超越人类水平
- 一篇论文让 NLP 领域 10 年的工作黯然失色

### BERT 的使用范式

```python
# 下游任务微调（Fine-tuning）
# 只需在 BERT 上加一个分类层，用少量标注数据微调

from transformers import BertForSequenceClassification, BertTokenizer

tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
model = BertForSequenceClassification.from_pretrained(
    "bert-base-uncased",
    num_labels=2   # 二分类（正面/负面情绪）
)

# BERT 做情绪分析
inputs = tokenizer("This movie is great!", return_tensors="pt")
outputs = model(**inputs)
prediction = outputs.logits.argmax(-1)  # 正面：1
```

**Fine-tune 的效率**：
- 以前：每个任务从头训练，需要大量标注数据
- 现在：BERT 预训练 + 少量标注数据微调（几百到几千样本）
- 结果比从头训练更好

---

## 2018 — GPT-1：另一个方向的起点

**人物**：Alec Radford、Karthik Narasimhan、Tim Salimans、Ilya Sutskever，OpenAI

**全称**：Generative Pre-trained Transformer

**与 BERT 的对比**：

| | GPT | BERT |
|--|-----|------|
| 方向 | 单向（只看左边）| 双向（看两边）|
| 预训练任务 | 语言建模（预测下一个词）| MLM + NSP |
| 擅长任务 | 文本生成 | 文本理解（分类、问答）|
| 架构 | Transformer Decoder | Transformer Encoder |

**GPT-1 的参数**：1.17 亿，训练数据 BookCorpus（7000 本书）

**意义**：证明了"自回归语言模型 + 预训练"的可行性。这个方向最终通向了 GPT-4 和 ChatGPT。

---

## 2019 — GPT-2：语言模型开始"危险"

**规格**：15 亿参数（GPT-1 的 10 倍），训练数据 40GB 网页文本（WebText）

**OpenAI 做了一个震惊业界的决定：拒绝公开完整模型**

原因（他们声明的）：GPT-2 生成的文字过于逼真，可能被用于大规模生成虚假新闻、网络钓鱼内容。

这是 AI 研究机构第一次因为"模型太危险"而推迟发布。

**GPT-2 的生成能力演示**：

```
提示（Prompt）：
"In a shocking finding, scientists discovered a herd of unicorns 
living in a remote valley in the Andes mountains."

GPT-2 续写：
"Scientists named the population, after their distinctive horn, 
Ovid's Unicorn. These four-horned, silver-white unicorns were 
previously unknown to science..."
```

文章连贯、有细节、有虚假的"学术可信度"——阅读者很难判断这不是真实新闻。

**GPT-2 的技术特点**：
- Zero-shot 能力出现：不需要微调，直接用文本提示完成任务
- 语言建模 = 通用智能的初步体现

---

## 2019–2020 — BERT 变体军团

BERT 引发了 NLP 领域最密集的"刷榜"竞争：

| 模型 | 来源 | 创新 |
|------|------|------|
| **RoBERTa** | Facebook | 去掉 NSP，更多数据，更长训练 —— BERT 训练不够充分 |
| **XLNet** | CMU + Google | 排列语言模型，结合自回归和双向 |
| **ALBERT** | Google | 参数共享，减少参数量，效果不降 |
| **DistilBERT** | HuggingFace | BERT 师生蒸馏，参数减少 40%，速度提升 60%，效果保留 97% |
| **SpanBERT** | Facebook | 针对跨度预测任务（NER、问答）专项优化 |
| **Chinese BERT** | Google + HIT | 中文预训练，字符级 |

**HuggingFace 的崛起**：
- 2018 年发布 `transformers` 库
- 简洁的 API 让所有人都能用 BERT/GPT
- 成为 NLP 界的"GitHub"，模型托管中心
- 2021 年融资 4 亿美元，估值 20 亿

---

## 2019 — T5：统一框架的终极尝试

**人物**：Colin Raffel 等，Google Brain

**全称**：Text-to-Text Transfer Transformer

**核心思想**：把所有 NLP 任务都统一成"文本输入 → 文本输出"的格式：

```
翻译：
  输入："translate English to French: That is good."
  输出："C'est bon."

情绪分析：
  输入："sentiment: This movie is terrible."
  输出："negative"

问答：
  输入："question: Where was Lincoln born? context: Lincoln was born in Hodgenville, Kentucky..."
  输出："Hodgenville, Kentucky"

摘要：
  输入："summarize: In recent years, scientists have discovered..."
  输出："Scientists found..."

机器翻译（法→英）：
  输入："translate French to English: Il fait beau."
  输出："The weather is nice."
```

**意义**：
- 一个模型，统一处理所有 NLP 任务
- 规模实验：T5 系统性地测试了各种超参数、数据集大小、预训练目标
- 发现"规模定律"的初步证据：更大的模型 = 更好的效果，而且是可预测的幂律关系

**规格**：T5-11B，110 亿参数，当时最大的 NLP 模型

---

## 2020 — 规模定律（Scaling Laws）

**论文**：《Scaling Laws for Neural Language Models》（Kaplan 等，OpenAI，2020）

这是一篇影响了 GPT-3 和之后所有大模型路线的论文。

**核心发现**：语言模型的性能遵循幂律（Power Law）：

$$\text{Loss} \propto N^{-0.076} \cdot D^{-0.095} \cdot C^{-0.050}$$

其中：
- N = 参数量（Parameters）
- D = 训练数据量（Dataset size）  
- C = 计算量（Compute，FLOPs）

**关键结论**：

1. **规模可预测**：用小模型的结果，可以外推预测大模型的性能
2. **三者需要均衡**：参数量、数据量、算力要同步提升，单提高一个边际收益递减
3. **最优配比**：给定算力预算 C，最优参数量 ≈ C^0.73（不要把所有预算都用来加参数）

**这个发现改变了什么**：
- OpenAI 有信心：花足够多的钱训练足够大的模型，性能会按预期提升
- 为 GPT-3 的 1750 亿参数提供了理论依据
- "大力出奇迹"有了严格的数学支撑

---

## 这个时代的技术遗产

```
Transformer (2017)
    ├── BERT (2018) ──→ RoBERTa / ALBERT / DistilBERT
    │         └──→ 中文 BERT / 多语言 mBERT
    │
    ├── GPT-1 (2018) ──→ GPT-2 (2019) ──→ GPT-3 (2020) ──→ ChatGPT
    │
    ├── T5 (2019) ──→ Flan-T5 ──→ UL2
    │
    └── XLNet (2019) ──→ DeBERTa
```

### 范式的确立

这个时代确立了今天 AI 的基本范式：

1. **Pre-train on large corpus**  
   在大规模无标注文本上做自监督学习

2. **Fine-tune on downstream task**  
   用少量标注数据做任务适配

3. **Prompt-based learning**（GPT-2 开始出现）  
   通过文本提示引导模型输出

这三步构成了今天所有大语言模型的核心逻辑。

### 注意力机制：最重要的一块拼图

Self-Attention 解决了 LSTM 的两个核心问题：
- 并行化：所有位置同时计算，充分利用 GPU
- 长距离依赖：任意两个位置的注意力直接相连，距离为 O(1)

但 Attention 的计算量是 O(n²)——序列越长，计算量平方增长。这个问题促使了后续长上下文（Long Context）研究的大量涌现。

---

## 历史的转折点

2017-2020 这三年，是 AI 历史上知识积累最密集的时期之一。

Transformer 统一了 CV 和 NLP 两个领域（ViT，2021）。BERT 证明了双向预训练的力量。GPT-2 暗示了规模的上限可能比所有人想象的都高。

舞台已经搭好。下一幕，是 GPT-3 的出场——它将让整个世界意识到，语言模型正在发生一些我们还没完全理解的事情。
