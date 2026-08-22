# 词性标注与句法分析

> 语法曾经过气了一阵子。后来每条 LLM 流水线都需要校验结构化抽取结果,它又回来了。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 5 阶段 · 01(文本处理),第 2 阶段 · 14(朴素贝叶斯)
**预计耗时:** 约 45 分钟

## 问题

第 01 课承诺过:词形还原需要词性标签。不知道 `running` 是动词,词形还原器就无法把它归约成 `run`;不知道 `better` 是形容词,就无法归约成 `good`。

这个承诺背后藏着一整个子领域:词性标注分派语法类别,句法分析还原句子的树结构——哪个词修饰哪个词,哪个动词支配哪些论元。经典 NLP 花了二十年打磨这两者,然后深度学习把它们塌缩成预训练 Transformer 之上的一个 token 分类任务,研究界转身离开。

应用界没有离开。每一条结构化抽取流水线至今仍在底层使用词性和依存树:LLM 生成的 JSON 要拿语法约束来校验,问答系统用依存分析拆解查询,机器翻译质量评估器比对句法树的对齐。

值得了解。本课介绍标签集、基线方法,以及你应该停下手、改为调 spaCy 的那个点。

## 概念

**词性标注**给每个 token 标上语法类别。**Penn Treebank(PTB)** 标签集是英语默认:36 个标签,细分到普通读者觉得较真的程度——`NN` 单数名词、`NNS` 复数名词、`NNP` 单数专有名词、`VBD` 动词过去式、`VBZ` 动词第三人称单数现在时,等等。**Universal Dependencies(UD)** 标签集更粗(17 个标签)且跨语言,成了跨语言工作的默认。

```
The/DET cats/NOUN were/AUX running/VERB at/ADP 3pm/NOUN ./PUNCT
```

**句法分析**产出一棵树。两大流派:

- **成分句法分析(Constituency parsing)。** 名词短语、动词短语、介词短语层层嵌套,输出是以非终结符类别(NP、VP、PP)为内部节点、词为叶子的树。
- **依存句法分析(Dependency parsing)。** 每个词有唯一的中心词(head),边上标注语法关系。输出是一棵树,每条边是一个(中心词, 从属词, 关系)三元组。

依存分析在 2010 年代胜出,因为它能干净地泛化到各种语言,尤其是语序自由的语言。

```
running is ROOT
cats is nsubj of running
were is aux of running
at is prep of running
3pm is pobj of at
```

```figure
pos-tagger
```

```figure
dependency-arcs
```

## 动手构建

### 第 1 步:最高频标签基线

能用的最笨词性标注器:对每个词,预测它在训练中最常出现的标签。

```python
from collections import Counter, defaultdict


def train_mft(train_examples):
    word_tag_counts = defaultdict(Counter)
    all_tags = Counter()
    for tokens, tags in train_examples:
        for token, tag in zip(tokens, tags):
            word_tag_counts[token.lower()][tag] += 1
            all_tags[tag] += 1
    word_best = {w: c.most_common(1)[0][0] for w, c in word_tag_counts.items()}
    default_tag = all_tags.most_common(1)[0][0]
    return word_best, default_tag


def predict_mft(tokens, word_best, default_tag):
    return [word_best.get(t.lower(), default_tag) for t in tokens]
```

在 Brown 语料上,这个基线能到约 85% 准确率。不算好,但它是底线——任何正经模型都不该比它低。

### 第 2 步:二元 HMM 标注器

对序列的联合概率建模:

```
P(tags, words) = prod P(tag_i | tag_{i-1}) * P(word_i | tag_i)
```

两张表:转移概率(给定前一个标签时的标签)、发射概率(给定标签时的词)。都用计数加拉普拉斯平滑估计,用 Viterbi 解码(在标签格子上做动态规划)。

```python
import math


def train_hmm(train_examples, alpha=0.01):
    transitions = defaultdict(Counter)
    emissions = defaultdict(Counter)
    tags = set()
    vocab = set()

    for tokens, ts in train_examples:
        prev = "<BOS>"
        for token, tag in zip(tokens, ts):
            transitions[prev][tag] += 1
            emissions[tag][token.lower()] += 1
            tags.add(tag)
            vocab.add(token.lower())
            prev = tag
        transitions[prev]["<EOS>"] += 1

    return transitions, emissions, tags, vocab


def log_prob(table, given, key, smooth_denom, alpha):
    return math.log((table[given].get(key, 0) + alpha) / smooth_denom)


def viterbi(tokens, transitions, emissions, tags, vocab, alpha=0.01):
    tags_list = list(tags)
    n = len(tokens)
    V = [[0.0] * len(tags_list) for _ in range(n)]
    back = [[0] * len(tags_list) for _ in range(n)]

    for j, tag in enumerate(tags_list):
        em_denom = sum(emissions[tag].values()) + alpha * (len(vocab) + 1)
        tr_denom = sum(transitions["<BOS>"].values()) + alpha * (len(tags_list) + 1)
        tr = log_prob(transitions, "<BOS>", tag, tr_denom, alpha)
        em = log_prob(emissions, tag, tokens[0].lower(), em_denom, alpha)
        V[0][j] = tr + em
        back[0][j] = 0

    for i in range(1, n):
        for j, tag in enumerate(tags_list):
            em_denom = sum(emissions[tag].values()) + alpha * (len(vocab) + 1)
            em = log_prob(emissions, tag, tokens[i].lower(), em_denom, alpha)
            best_prev = 0
            best_score = -1e30
            for k, prev_tag in enumerate(tags_list):
                tr_denom = sum(transitions[prev_tag].values()) + alpha * (len(tags_list) + 1)
                tr = log_prob(transitions, prev_tag, tag, tr_denom, alpha)
                score = V[i - 1][k] + tr + em
                if score > best_score:
                    best_score = score
                    best_prev = k
            V[i][j] = best_score
            back[i][j] = best_prev

    last_best = max(range(len(tags_list)), key=lambda j: V[n - 1][j])
    path = [last_best]
    for i in range(n - 1, 0, -1):
        path.append(back[i][path[-1]])
    return [tags_list[j] for j in reversed(path)]
```

二元 HMM 在 Brown 上能到约 93%。从 85% 到 93% 的跃升主要来自转移概率——模型学到了 `DET NOUN` 常见而 `NOUN DET` 罕见。

### 第 3 步:现代标注器为什么更强

转移加发射概率是局部的:它们捕捉不到 `saw` 在 "I bought a saw" 里是名词、在 "I saw the movie" 里是动词。带任意特征(后缀、词形、前后词、词本身)的 CRF 能到约 97%,BiLSTM-CRF 或 Transformer 能到 98%+。

这个任务的天花板由标注员分歧决定:人类标注员在 Penn Treebank 上的一致率约 97%。超过 98% 的模型多半是在过拟合测试集。

### 第 4 步:依存句法分析速写

从零完整实现依存分析超出本课范围——经典的教科书讲解在 Jurafsky 和 Martin 的书里。有两个经典家族需要知道:

- **基于转移(transition-based)的分析器**(arc-eager、arc-standard)行为类似移进-归约分析器:读入 token,压栈,应用归约动作生成弧。贪心解码很快;经典实现是 MaltParser;现代神经版本是 Chen 和 Manning 的基于转移的分析器。
- **基于图(graph-based)的分析器**(Eisner 算法、Dozat-Manning 双仿射)给每个可能的中心词-从属词边打分,选最大生成树。更慢但更准。

大多数应用工作,直接调 spaCy:

```python
import spacy

nlp = spacy.load("en_core_web_sm")
doc = nlp("The cats were running at 3pm.")
for token in doc:
    print(f"{token.text:10s} tag={token.tag_:5s} pos={token.pos_:6s} dep={token.dep_:10s} head={token.head.text}")
```

```
The        tag=DT    pos=DET    dep=det        head=cats
cats       tag=NNS   pos=NOUN   dep=nsubj      head=running
were       tag=VBD   pos=AUX    dep=aux        head=running
running    tag=VBG   pos=VERB   dep=ROOT       head=running
at         tag=IN    pos=ADP    dep=prep       head=running
3pm        tag=NN    pos=NOUN   dep=pobj       head=at
.          tag=.     pos=PUNCT  dep=punct      head=running
```

从下往上读 `dep` 列,句子的语法结构自然浮现。

## 投入使用

每个生产级 NLP 库都把词性和依存分析器作为标准流水线的一部分发布。

- **spaCy**(`en_core_web_sm` / `md` / `lg` / `trf`)。快、准,与分词、NER、词形还原集成。`token.tag_`(Penn)、`token.pos_`(UD)、`token.dep_`(依存关系)。
- **Stanford NLP(stanza)**。斯坦福 CoreNLP 的继任者,60 多种语言上达到 SOTA。
- **trankit**。基于 Transformer,UD 准确率高。
- **NLTK**。`pos_tag`,能用但慢、老,适合教学。

### 2026 年它仍然重要的地方

- **词形还原。** 第 01 课永远需要词性才能正确还原。
- **校验 LLM 输出的结构化抽取。** 验证生成的句子是否满足语法约束(如主谓一致、必要的修饰成分)。
- **方面级情感分析。** 依存分析告诉你哪个形容词修饰哪个名词。
- **查询理解。** "movies directed by Wes Anderson starring Bill Murray" 可以通过句法分析拆成结构化约束。
- **跨语言迁移。** UD 标签和依存关系是语言中立的,能对新语言做零样本结构化分析。
- **低算力流水线。** 如果上不了 Transformer,词性 + 依存分析 + 词表的组合能走得远得出乎你意料。

## 交付

保存为 `outputs/skill-grammar-pipeline.md`:

```markdown
---
name: grammar-pipeline
description: Design a classical POS + dependency pipeline for a downstream NLP task.
version: 1.0.0
phase: 5
lesson: 07
tags: [nlp, pos, parsing]
---

Given a downstream task (information extraction, rewrite validation, query decomposition, lemmatization), you output:

1. Tagset to use. Penn Treebank for English-only legacy pipelines, Universal Dependencies for multilingual or cross-lingual.
2. Library. spaCy for most production, stanza for academic-grade multilingual, trankit for highest UD accuracy. Name the specific model ID.
3. Integration pattern. Show the 3-5 lines that call the library and consume the needed attributes (`.pos_`, `.dep_`, `.head`).
4. Failure mode to test. Noun-verb ambiguity (`saw`, `book`, `can`) and PP-attachment ambiguity are the classical traps. Sample 20 outputs and eyeball.

Refuse to recommend rolling your own parser. Building parsers from scratch is a research project, not an application task. Flag any pipeline that consumes POS tags without handling lowercase/uppercase variants as fragile.
```

## 练习

1. **简单。** 在一个小的带标注语料上(如 NLTK 的 Brown 子集)跑最高频标签基线,在留出句子上测准确率,验证约 85% 的结果。
2. **中等。** 训练上面的二元 HMM,报告逐标签的精确率/召回率。HMM 最容易混淆哪些标签?
3. **困难。** 用 spaCy 的依存分析从 1000 个句子中抽取主谓宾三元组,在 50 条人工标注的三元组上评估。记录抽取失败的地方(通常是被动句、并列结构和省略主语)。

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|-----------------|-----------------------|
| 词性标签(POS tag) | 词的类型 | 语法类别:PTB 有 36 个,UD 有 17 个 |
| Penn Treebank | 标准标签集 | 英语专用,动词时态与名词单复数划分精细 |
| Universal Dependencies | 多语言标签集 | 比 PTB 粗,语言中立,跨语言工作的默认 |
| 依存分析(Dependency parse) | 句子树 | 每个词有一个中心词,每条边带一种语法关系 |
| Viterbi | 动态规划 | 给定发射与转移概率,求概率最高的标签序列 |

## 延伸阅读

- [Jurafsky and Martin — Speech and Language Processing, chapters 8 and 18](https://web.stanford.edu/~jurafsky/slp3/)——词性与句法分析的 经典 教科书讲解
- [Universal Dependencies project](https://universaldependencies.org/)——每个多语言分析器都在用的跨语言标签集与树库
- [spaCy linguistic features guide](https://spacy.io/usage/linguistic-features)——`Token` 上暴露的每个属性的实用参考
- [Chen and Manning (2014). A Fast and Accurate Dependency Parser using Neural Networks](https://nlp.stanford.edu/pubs/emnlp2014-depparser.pdf)——把神经句法分析器带入主流的论文
