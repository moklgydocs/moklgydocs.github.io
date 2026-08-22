# 命名实体识别

> 把名字抽出来。听起来容易,直到你碰上模糊的边界、嵌套的实体和领域黑话。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 5 阶段 · 02(词袋 + TF-IDF),第 5 阶段 · 03(词嵌入)
**预计耗时:** 约 75 分钟

## 问题

"Apple sued Google over its iPhone search deal in the US." 五个实体:Apple(组织 ORG)、Google(ORG)、iPhone(产品 PRODUCT)、search deal(存疑)、US(地缘政治实体 GPE)。好的 NER 系统全部抽出并标对类型;差的漏掉 iPhone,把水果 Apple 和公司 Apple 搞混,还把 "US" 标成 PERSON。

NER 是每一条结构化抽取流水线底下的老黄牛:简历解析、合规日志扫描、病历脱敏、搜索查询理解、聊天机器人回答的事实接地、法律合同抽取。你几乎看不见它,却永远依赖它。

本课走一遍从经典路线(规则、HMM、CRF)到现代路线(BiLSTM-CRF,再到 Transformer)的演进。每一步都解决了前一步的某个具体局限——这个演进规律本身就是本课。

## 概念

**BIO 标注**(或 BILOU)把实体抽取变成序列标注问题:给每个 token 打上 `B-TYPE`(实体开头)、`I-TYPE`(实体内部)或 `O`(不属于任何实体)。

```
Apple    B-ORG
sued     O
Google   B-ORG
over     O
its      O
iPhone   B-PRODUCT
search   O
deal     O
in       O
the      O
US       B-GPE
.        O
```

多 token 实体串成链:`New B-GPE`、`York I-GPE`、`City I-GPE`。理解 BIO 的模型可以抽取任意长度的片段。

架构的演进:

- **规则法。** 正则 + 词表(gazetteer)查询。对已知实体精确率高,对新实体覆盖为零。
- **HMM。** 隐马尔可夫模型:给定标签时 token 的发射概率,标签到标签的转移概率,Viterbi 解码,在标注数据上训练。
- **CRF。** 条件随机场:与 HMM 类似但是判别式,因此可以混入任意特征(词形、大小写、相邻词)。2026 年,它仍是低资源部署中的经典生产主力。
- **BiLSTM-CRF。** 用神经特征代替手工特征:LSTM 双向读句子,顶上压一个 CRF 层,强制标签序列一致。
- **基于 Transformer。** 给 BERT 加 token 分类头做微调。准确率最高,算力消耗也最大。

```figure
ner-bio-tagging
```

## 动手构建

### 第 1 步:BIO 标注辅助函数

```python
def spans_to_bio(tokens, spans):
    labels = ["O"] * len(tokens)
    for start, end, label in spans:
        labels[start] = f"B-{label}"
        for i in range(start + 1, end):
            labels[i] = f"I-{label}"
    return labels


def bio_to_spans(tokens, labels):
    spans = []
    current = None
    for i, label in enumerate(labels):
        if label.startswith("B-"):
            if current:
                spans.append(current)
            current = (i, i + 1, label[2:])
        elif label.startswith("I-") and current and current[2] == label[2:]:
            current = (current[0], i + 1, current[2])
        else:
            if current:
                spans.append(current)
                current = None
    if current:
        spans.append(current)
    return spans
```

```python
>>> tokens = ["Apple", "sued", "Google", "over", "iPhone", "sales", "."]
>>> labels = ["B-ORG", "O", "B-ORG", "O", "B-PRODUCT", "O", "O"]
>>> bio_to_spans(tokens, labels)
[(0, 1, 'ORG'), (2, 3, 'ORG'), (4, 5, 'PRODUCT')]
```

### 第 2 步:手工特征

对经典(非神经)NER,特征就是全部战场。好用的特征:

```python
def token_features(token, prev_token, next_token):
    return {
        "lower": token.lower(),
        "is_upper": token.isupper(),
        "is_title": token.istitle(),
        "has_digit": any(c.isdigit() for c in token),
        "suffix_3": token[-3:].lower(),
        "shape": word_shape(token),
        "prev_lower": prev_token.lower() if prev_token else "<BOS>",
        "next_lower": next_token.lower() if next_token else "<EOS>",
    }


def word_shape(word):
    out = []
    for c in word:
        if c.isupper():
            out.append("X")
        elif c.islower():
            out.append("x")
        elif c.isdigit():
            out.append("d")
        else:
            out.append(c)
    return "".join(out)
```

`word_shape("iPhone")` 得到 `xXxxxx`,`word_shape("USA-2024")` 得到 `XXX-dddd`。大小写模式对专有名词是高信号特征。

### 第 3 步:规则 + 词典基线

```python
ORG_GAZETTEER = {"Apple", "Google", "Microsoft", "OpenAI", "Meta", "Amazon", "Netflix"}
GPE_GAZETTEER = {"US", "USA", "UK", "India", "Germany", "France"}
PRODUCT_GAZETTEER = {"iPhone", "Android", "Windows", "ChatGPT", "Claude"}


def rule_based_ner(tokens):
    labels = []
    for token in tokens:
        if token in ORG_GAZETTEER:
            labels.append("B-ORG")
        elif token in GPE_GAZETTEER:
            labels.append("B-GPE")
        elif token in PRODUCT_GAZETTEER:
            labels.append("B-PRODUCT")
        else:
            labels.append("O")
    return labels
```

生产级词表有从 Wikipedia 和 DBpedia 抓来的上百万条目:覆盖不错,消歧糟糕(`Apple` 是公司还是水果)。这就是统计模型胜出的原因。

### 第 4 步:CRF(示意,非完整实现)

50 行从零写出完整 CRF,在没有概率论基础时并没有教学价值。直接用 `sklearn-crfsuite`:

```python
import sklearn_crfsuite

def to_features(tokens):
    out = []
    for i, tok in enumerate(tokens):
        prev = tokens[i - 1] if i > 0 else ""
        nxt = tokens[i + 1] if i + 1 < len(tokens) else ""
        out.append({
            "word.lower()": tok.lower(),
            "word.isupper()": tok.isupper(),
            "word.istitle()": tok.istitle(),
            "word.isdigit()": tok.isdigit(),
            "word.suffix3": tok[-3:].lower(),
            "word.shape": word_shape(tok),
            "prev.word.lower()": prev.lower(),
            "next.word.lower()": nxt.lower(),
            "BOS": i == 0,
            "EOS": i == len(tokens) - 1,
        })
    return out


crf = sklearn_crfsuite.CRF(algorithm="lbfgs", c1=0.1, c2=0.1, max_iterations=100, all_possible_transitions=True)
X_train = [to_features(s) for s in sentences_tokenized]
crf.fit(X_train, bio_labels_train)
```

`c1` 和 `c2` 是 L1、L2 正则。`all_possible_transitions=True` 让模型学到非法序列(如 `O` 之后接 `I-ORG`)概率很低——CRF 正是靠这个强制 BIO 一致性,而不需要你手写约束。

### 第 5 步:BiLSTM-CRF 多出了什么

特征变成学出来的。输入:token 嵌入(GloVe 或 fastText);LSTM 从左到右、从右到左各读一遍;拼接的隐藏状态过一个 CRF 输出层。CRF 仍负责标签序列一致性,LSTM 则把手工特征换成学习特征。

```python
import torch
import torch.nn as nn


class BiLSTM_CRF_Head(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, n_labels):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, bidirectional=True, batch_first=True)
        self.fc = nn.Linear(hidden_dim * 2, n_labels)

    def forward(self, token_ids):
        e = self.embed(token_ids)
        h, _ = self.lstm(e)
        emissions = self.fc(h)
        return emissions
```

CRF 层用 `torchcrf.CRF`(pip install pytorch-crf)。相对手工 CRF 的提升实实在在,但比你想的小——除非你有几万条标注句子。

## 投入使用

spaCy 开箱即是生产级 NER。

```python
import spacy

nlp = spacy.load("en_core_web_sm")
doc = nlp("Apple sued Google over its iPhone search deal in the US.")
for ent in doc.ents:
    print(f"{ent.text:20s} {ent.label_}")
```

```
Apple                ORG
Google               ORG
iPhone               ORG
US                   GPE
```

注意 `iPhone` 被标成 `ORG` 而不是 `PRODUCT`——spaCy 的小模型对产品类实体覆盖较弱。大模型(`en_core_web_lg`)更好,Transformer 模型(`en_core_web_trf`)还要更好。

Hugging Face 的 BERT 系 NER:

```python
from transformers import pipeline

ner = pipeline("ner", model="dslim/bert-base-NER", aggregation_strategy="simple")
print(ner("Apple sued Google over its iPhone in the US."))
```

```
[{'entity_group': 'ORG', 'word': 'Apple', ...},
 {'entity_group': 'ORG', 'word': 'Google', ...},
 {'entity_group': 'MISC', 'word': 'iPhone', ...},
 {'entity_group': 'LOC', 'word': 'US', ...}]
```

`aggregation_strategy="simple"` 把连续的 B-X、I-X token 合并成片段;不加它,你拿到的是 token 级标签,得自己合并。

### 基于 LLM 的 NER(2026 年的选项)

零样本和少样本 LLM NER 如今在许多领域已能与微调模型竞争,在标注数据稀缺时更是显著更强。

- **零样本提示。** 给 LLM 一份实体类型清单和一个输出格式示例,要求输出 JSON。开箱即用;在新领域上准确率中等。
- **ZeroTuneBio 式提示。** 把任务拆成候选抽取 → 含义解释 → 判断 → 复查的多阶段提示(而非一次性提示),能显著提升生物医学 NER 的准确率。同样的模式适用于法律、金融和科学领域。
- **RAG 动态提示。** 每次推理时,从小规模标注种子集里检索最相似的已标注样本,现场组装少样本提示。2026 年的基准上,这比静态提示把 GPT-4 的生物医学 NER F1 提高了 11–12%。
- **按实体类型拆分。** 长文档一次调用抽取所有实体类型,召回率会随长度下降。每种实体类型单独跑一遍:推理成本更高,准确率显著提升。这是临床病历与法律合同的标准做法。

2026 年的生产建议:在收集训练数据之前,先用 LLM 零样本做基线。很多时候 F1 已经够用,永远不需要微调。

### 经典 NER 仍胜出的地方

即便有 LLM 可用,经典 NER 仍在以下场景胜出:

- 延迟预算低于 50ms。
- 你有数千条标注样本,需要 98%+ 的 F1。
- 领域本体稳定,预训练的 CRF 或 BiLSTM 迁移效果好。
- 监管约束要求本地部署的非生成式模型。

### 它崩盘的地方

- **领域偏移。** CoNLL 上训练的 NER 用在法律合同上,表现还不如词表法。在你的领域上微调。
- **嵌套实体。** "Bank of America Tower" 同时是 ORG 和设施(FACILITY)。标准 BIO 无法表示重叠片段,需要嵌套 NER(多趟或片段式模型)。
- **长实体。** "United States Federal Deposit Insurance Corporation." token 级模型有时会把它切碎。用 `aggregation_strategy` 或后处理。
- **稀疏类型。** 医疗 NER 的标签如 DRUG_BRAND、ADVERSE_EVENT、DOSE,通用模型完全不懂。Scispacy 和 BioBERT 是那里的起点。

## 交付

保存为 `outputs/skill-ner-picker.md`:

```markdown
---
name: ner-picker
description: Pick the right NER approach for a given extraction task.
version: 1.0.0
phase: 5
lesson: 06
tags: [nlp, ner, extraction]
---

Given a task description (domain, label set, language, latency, data volume), output:

1. Approach. Rule-based + gazetteer, CRF, BiLSTM-CRF, or transformer fine-tune.
2. Starting model. Name it (spaCy model ID, Hugging Face checkpoint ID, or "custom, trained from scratch").
3. Labeling strategy. BIO, BILOU, or span-based. Justify in one sentence.
4. Evaluation. Use `seqeval`. Always report entity-level F1 (not token-level).

Refuse to recommend fine-tuning a transformer for under 500 labeled examples unless the user already has a pretrained domain model. Flag nested entities as needing span-based or multi-pass models. Require a gazetteer audit if the user mentions "production scale" and labels are unchanged from CoNLL-2003.
```

## 练习

1. **简单。** 实现 `bio_to_spans`(`spans_to_bio` 的逆操作),在 10 个句子上验证往返一致性。
2. **中等。** 在 CoNLL-2003 英文 NER 数据集上训练上面的 sklearn-crfsuite CRF,用 `seqeval` 报告逐实体 F1。典型结果约 84 F1。
3. **困难。** 在领域特定 NER 数据集(医疗、法律或金融)上微调 `distilbert-base-cased`,与 spaCy 小模型对比。记录数据泄漏检查过程,写下让你意外的发现。

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|-----------------|-----------------------|
| NER | 抽取名字 | 给 token 片段标注类型(PERSON、ORG、GPE、DATE 等) |
| BIO | 标注方案 | `B-X` 开始,`I-X` 延续,`O` 在外 |
| BILOU | 更好的 BIO | 增加 `L-X`(结尾)、`U-X`(单 token),边界更干净 |
| CRF | 结构化分类器 | 对标签之间的转移建模,而不只是发射,能强制序列合法 |
| 嵌套 NER(Nested NER) | 重叠的实体 | 一个片段与其子片段是不同类型的实体,BIO 表达不了 |
| 实体级 F1(Entity-level F1) | NER 的正确指标 | 预测片段必须与真实片段完全一致才算对;token 级 F1 会高估 |

## 延伸阅读

- [Lample et al. (2016). Neural Architectures for Named Entity Recognition](https://arxiv.org/abs/1603.01360)——BiLSTM-CRF 论文,经典必读
- [Devlin et al. (2018). BERT: Pre-training of Deep Bidirectional Transformers](https://arxiv.org/abs/1810.04805)——引入了后来成为标准的 token 分类范式
- [spaCy linguistic features — named entities](https://spacy.io/usage/linguistic-features#named-entities)——`Doc.ents` 与 `Span` 上每个属性的实用参考
- [seqeval](https://github.com/chakki-works/seqeval)——正确的指标库,永远用它
