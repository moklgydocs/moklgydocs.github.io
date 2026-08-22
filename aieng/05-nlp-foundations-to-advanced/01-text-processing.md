# 文本处理——分词、词干提取、词形还原

> 语言是连续的,模型是离散的。预处理是连接两者的桥。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 2 阶段 · 14(朴素贝叶斯)
**预计耗时:** 约 45 分钟

## 问题

模型读不懂"The cats were running."。它读的是整数。

每个 NLP 系统开篇都要回答同样三个问题:词从哪里开始切;词的词根是什么;"run""running""ran"什么时候该当成一回事,什么时候不该。

分词搞错,模型就从垃圾里学东西。如果你的分词器把 `don't` 当一个 token、`do n't` 当两个,训练分布就被劈开了。如果你的词干提取器把 `organization` 和 `organ` 压成同一个词干,主题建模就废了。如果你的词形还原器需要词性上下文而你没给,动词就会被当成名词处理。

本课从零构建这三步预处理,然后展示 NLTK 和 spaCy 如何做同样的工作,让你看清其中的取舍。

## 概念

三个操作,各有分工,也各有失效模式。

**分词(Tokenization)** 把字符串切成 token。"token" 这个词故意说得模糊,因为正确的粒度取决于任务:经典 NLP 用词级,Transformer 用子词(subword),没有空格的语言用字符级。

**词干提取(Stemming)** 按规则砍掉后缀。快、激进、不动脑子:`running -> run`,`organization -> organ`。后一个就是它的失效模式。

**词形还原(Lemmatization)** 利用语法知识把词归约到词典原形。更慢、更准,需要查表或形态分析器:`ran -> run`(得知道 "ran" 是 "run" 的过去式),`better -> good`(得知道比较级形式)。

经验法则:速度优先、能容忍噪声时用词干提取(搜索索引、粗分类);语义优先时用词形还原(问答、语义搜索,以及任何用户会读到的东西)。

```figure
edit-distance
```

## 动手构建

### 第 1 步:正则分词器

最简单的实用分词器按非字母数字字符切分,同时把标点保留为独立 token。不完美、不终极,但一行就能跑。

```python
import re

def tokenize(text):
    return re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)?|[0-9]+|[^\sA-Za-z0-9]", text)
```

三个模式按优先级排列:带可选内部撇号的单词(`don't`、`it's`);纯数字;任意单个非空白非字母数字字符作为独立 token(标点)。

```python
>>> tokenize("The cats weren't running at 3pm.")
['The', 'cats', "weren't", 'running', 'at', '3', 'pm', '.']
```

值得注意的失效模式:`3pm` 被切成 `['3', 'pm']`,因为我们在字母串和数字串之间做了交替。对大多数任务够用;URL、邮箱、话题标签全会切坏。上生产的话,把专门的模式加在通用模式之前。

### 第 2 步:Porter 词干提取器(仅 step 1a)

完整的 Porter 算法有五个阶段的规则。仅 step 1a 就覆盖了英语中最高频的后缀,足以教会你这套模式。

```python
def stem_step_1a(word):
    if word.endswith("sses"):
        return word[:-2]
    if word.endswith("ies"):
        return word[:-2]
    if word.endswith("ss"):
        return word
    if word.endswith("s") and len(word) > 1:
        return word[:-1]
    return word
```

```python
>>> [stem_step_1a(w) for w in ["caresses", "ponies", "caress", "cats"]]
['caress', 'poni', 'caress', 'cat']
```

规则从上往下读。`ies -> i` 这条规则解释了为什么是 `ponies -> poni` 而不是 `pony`——真正的 Porter 有 step 1b 会修正它。规则互相竞争,先写的规则赢:顺序比任何单条规则都重要。

### 第 3 步:基于查表的词形还原器

严格意义上的词形还原需要形态学知识。一个可教的版本用小型的原形表加兜底规则。

```python
LEMMA_TABLE = {
    ("running", "VERB"): "run",
    ("ran", "VERB"): "run",
    ("runs", "VERB"): "run",
    ("better", "ADJ"): "good",
    ("best", "ADJ"): "good",
    ("cats", "NOUN"): "cat",
    ("cat", "NOUN"): "cat",
    ("were", "VERB"): "be",
    ("was", "VERB"): "be",
    ("is", "VERB"): "be",
}

def lemmatize(word, pos):
    key = (word.lower(), pos)
    if key in LEMMA_TABLE:
        return LEMMA_TABLE[key]
    if pos == "VERB" and word.endswith("ing"):
        return word[:-3]
    if pos == "NOUN" and word.endswith("s"):
        return word[:-1]
    return word.lower()
```

```python
>>> lemmatize("running", "VERB")
'run'
>>> lemmatize("cats", "NOUN")
'cat'
>>> lemmatize("better", "ADJ")
'good'
>>> lemmatize("watched", "VERB")
'watched'
```

最后一个例子是最关键的教学点:`watched` 不在表里,而我们的兜底规则只处理 `ing`。真正的词形还原要覆盖 `ed`、不规则动词、比较级形容词、带音变的复数(`children -> child`)。这就是为什么生产系统用 WordNet、spaCy 的形态分析器或完整的形态分析工具。

### 第 4 步:串成流水线

```python
def preprocess(text, pos_tagger=None):
    tokens = tokenize(text)
    stems = [stem_step_1a(t.lower()) for t in tokens]
    tags = pos_tagger(tokens) if pos_tagger else [(t, "NOUN") for t in tokens]
    lemmas = [lemmatize(word, pos) for word, pos in tags]
    return {"tokens": tokens, "stems": stems, "lemmas": lemmas}
```

缺的那块是词性标注器,第 5 阶段 · 07(词性标注)会构建一个。现在先把一切默认成 `NOUN`,承认这个局限。

## 投入使用

NLTK 和 spaCy 提供了生产级实现,各几行代码。

### NLTK

```python
import nltk
nltk.download("punkt_tab")
nltk.download("wordnet")
nltk.download("averaged_perceptron_tagger_eng")

from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
from nltk import pos_tag

text = "The cats were running."
tokens = word_tokenize(text)
stems = [PorterStemmer().stem(t) for t in tokens]
lemmatizer = WordNetLemmatizer()
tagged = pos_tag(tokens)


def nltk_pos_to_wordnet(tag):
    if tag.startswith("V"):
        return "v"
    if tag.startswith("J"):
        return "a"
    if tag.startswith("R"):
        return "r"
    return "n"


lemmas = [lemmatizer.lemmatize(t, nltk_pos_to_wordnet(tag)) for t, tag in tagged]
```

`word_tokenize` 处理缩略形式、Unicode 和你的正则漏掉的边缘情况;`PorterStemmer` 跑全部五个阶段;`WordNetLemmatizer` 需要把 NLTK 的 Penn Treebank 标签体系翻译成 WordNet 的缩写集。上面那段翻译接线,正是大多数教程会略过的部分。

### spaCy

```python
import spacy

nlp = spacy.load("en_core_web_sm")
doc = nlp("The cats were running.")

for token in doc:
    print(token.text, token.lemma_, token.pos_)
```

```
The      the     DET
cats     cat     NOUN
were     be      AUX
running  run     VERB
.        .       PUNCT
```

spaCy 把整条流水线藏在 `nlp(text)` 后面:分词、词性标注、词形还原一次跑完。大规模下比 NLTK 快,开箱即用也更准。代价是你没法方便地单独替换某个组件。

### 什么场景选哪个

| 场景 | 选择 |
|-----------|------|
| 教学、研究、需要替换组件 | NLTK |
| 生产、多语言、速度优先 | spaCy |
| Transformer 流水线(反正要用模型自带的分词器) | 用 `tokenizers` / `transformers`,跳过经典预处理 |

### 两个没人提醒你的失效模式

大多数教程教完算法就停了。真实的预处理流水线会被两件事咬到,而它们几乎从不被提及。

**可复现性漂移。** NLTK 和 spaCy 会在版本之间改变分词和词形还原的行为:spaCy 2.x 产出 `['do', "n't"]` 的输入,到了 3.x 可能产出 `["don't"]`。你的模型在一个分布上训练,推理却跑在另一个分布上,准确率悄悄下滑,没人知道为什么。在 `requirements.txt` 里钉死库版本;写一个预处理回归测试,冻结 20 个例句的预期分词结果;每次升级都跑一遍。

**训练/推理不一致。** 训练时做了激进预处理(小写化、去停用词、词干提取),部署时直接吃用户原始输入,然后眼看性能崩盘。这是生产 NLP 最常见的失败,没有之一。训练时用了预处理,推理时就必须跑一模一样的函数。把预处理作为函数打进模型包里交付,而不是留在 notebook 单元格里让服务端团队重写。

## 交付

一个可复用的提示词,帮工程师不读三本教科书也能选定预处理方案。

保存为 `outputs/prompt-preprocessing-advisor.md`:

```markdown
---
name: preprocessing-advisor
description: Recommends a tokenization, stemming, and lemmatization setup for an NLP task.
phase: 5
lesson: 01
---

You advise on classical NLP preprocessing. Given a task description, you output:

1. Tokenization choice (regex, NLTK word_tokenize, spaCy, or transformer tokenizer). Explain why.
2. Whether to stem, lemmatize, both, or neither. Explain why.
3. Specific library calls. Name the functions. Quote the POS-tag translation if NLTK is involved.
4. One failure mode the user should test for.

Refuse to recommend stemming for user-visible text. Refuse to recommend lemmatization without POS tags. Flag non-English input as needing a different pipeline.
```

## 练习

1. **简单。** 扩展 `tokenize`,让 URL 保持为单个 token。测试:`tokenize("Visit https://example.com today.")` 应产出一个 URL token。
2. **中等。** 实现 Porter step 1b:如果单词含元音且以 `ed` 或 `ing` 结尾,去掉该后缀。处理双辅音规则(`hopping -> hop`,而不是 `hopp`)。
3. **困难。** 构建一个词形还原器:以 WordNet 为查表来源,WordNet 查不到时回退到你的 Porter 词干提取器。在带标注的语料上测量准确率,与纯 WordNet、纯 Porter 对比。

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|-----------------|-----------------------|
| token | 一个词 | 模型消费的任意单位,可以是词、子词、字符或字节 |
| 词干(Stem) | 词的词根 | 规则化砍掉后缀的结果,不一定是真实存在的词 |
| 词元(Lemma) | 词典原形 | 你查词典时会查的那个形式,需要语法上下文才能正确算出 |
| 词性标签(POS tag) | 词性 | NOUN、VERB、ADJ 这样的类别,准确做词形还原所必需 |
| 形态学(Morphology) | 词形变化规则 | 词如何随时态、数、格改变形式,词形还原依赖它 |

## 延伸阅读

- [Porter, M. F. (1980). An algorithm for suffix stripping](https://tartarus.org/martin/PorterStemmer/def.txt)——原始论文,只有五页,至今仍是最清晰的讲解
- [spaCy 101 — linguistic features](https://spacy.io/usage/linguistic-features)——真实流水线是如何接线的
- [NLTK book, chapter 3](https://www.nltk.org/book/ch03.html)——你还没想到的分词边缘情况
