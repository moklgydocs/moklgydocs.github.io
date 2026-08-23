# 从零构建分词器

> 第 01 课给了你一件玩具，这一课给你一件武器。

**类型：** Build
**编程语言：** Python
**前置要求：** 第 10 阶段 第 01 课（分词器：BPE、WordPiece、SentencePiece)
**预计耗时：** 约 90 分钟

## 学习目标

- 构建生产级 BPE 分词器，能处理 Unicode、空白归一化和特殊 token
- 实现字节级回退，让分词器能编码任何输入（emoji、中日韩文字、代码）而不产生未知 token
- 添加预分词正则模式，在应用 BPE 合并之前按词边界切分文本
- 在语料上训练自定义分词器，并在多语言文本上与 tiktoken 对比压缩率

## 问题

你在第 01 课写的 BPE 分词器能处理英文文本。现在扔给它日语、emoji，或者 Tab 和空格混用的 Python 代码。

它崩了。

不是 BPE 的错——是实现不完整。一个生产级分词器要能处理任何编码的原始字节、切分前先做 Unicode 归一化、管理永不参与合并的特殊 token、把预分词和子词切分串成链——而且这一切要快到不会拖住一条处理 15 万亿 token 的训练流水线。

GPT-2 的分词器有 50,257 个 token,Llama 3 有 128,256,GPT-4 大约 100,000。这些不是玩具数字。那些词表背后的合并表是在几百 GB 文本上训练的，而外围的整套机器——归一化、预分词、特殊 token 注入、对话模板格式化——才是"能处理 hello world"和"能处理整个互联网"的分水岭。

你要亲手造出这套机器。

## 概念

### 完整流水线

生产级分词器不是一个算法，而是五级流水线，每级解决一个不同的问题。

```mermaid
graph LR
    A[Raw Text] --> B[Normalize]
    B --> C[Pre-Tokenize]
    C --> D[BPE Merge]
    D --> E[Special Tokens]
    E --> F[Token IDs]

    style A fill:#1a1a2e,stroke:#e94560,color:#fff
    style B fill:#1a1a2e,stroke:#e94560,color:#fff
    style C fill:#1a1a2e,stroke:#e94560,color:#fff
    style D fill:#1a1a2e,stroke:#e94560,color:#fff
    style E fill:#1a1a2e,stroke:#e94560,color:#fff
    style F fill:#1a1a2e,stroke:#e94560,color:#fff
```

每一级的职责：

| 阶段 | 做什么 | 为什么重要 |
|-------|-------------|----------------|
| 归一化 | NFKC Unicode，可选小写化，可选去重音 | "fi" 连字（U+FB01）变成两个字符 "fi"。不做这步，同一个词会得到不同的 token |
| 预分词 | 在 BPE 之前把文本切成块 | 防止 BPE 跨词边界合并。"the cat" 绝不该产生 "e c" 这样的 token |
| BPE 合并 | 对字节序列应用学到的合并规则 | 核心压缩，把原始字节变成子词 token |
| 特殊 token | 注入 [BOS]、[EOS]、[PAD]、对话模板标记 | 这些 token 有固定 ID，永不参与 BPE 合并，模型靠它们获得结构 |
| ID 映射 | 把 token 字符串转成整数 ID | 模型看到的是整数，不是字符串 |

### 字节级 BPE

第 01 课的分词器作用在 UTF-8 字节上，方向是对的。但我们跳过了一个重要问题：当这些字节不是合法 UTF-8 时怎么办？

字节级 BPE 的解法是把每个可能的字节值（0-255）都当作合法 token。基础词表恰好 256 项。任何文件——文本、二进制、损坏的——都能被分词，绝不产生未知 token。

GPT-2 还加了一个技巧：把每个字节映射到一个可打印的 Unicode 字符，让词表保持人类可读。字节 0x20（空格）在他们的映射里变成字符 "G"。这纯粹是装饰，算法根本不在乎。

真正的威力在于：字节级 BPE 能处理地球上的任何语言。一个汉字是 3 个 UTF-8 字节，日文可以是 3-4 字节，阿拉伯文、天城文、emoji——统统只是字节序列。BPE 算法在这些字节序列里找模式的方式，和在英文 ASCII 字节里找模式一模一样。

### 预分词

在 BPE 碰你的文本之前，要先把它切成块，防止合并算法造出横跨词边界的 token。

GPT-2 用一个正则模式切分文本：

```
'(?:[sdmt]|ll|ve|re)| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+
```

这个模式处理缩约词（"don't" 变成 "don" + "'t")、带可选前导空格的词、数字、标点和空白。前导空格留在词上——所以 "the cat" 变成 [" the", " cat"]，而不是 ["the", " ", "cat"]。

Llama 用 SentencePiece，完全跳过正则：把原始字节流当作一个长序列，让 BPE 算法自己去找边界。更简单，但也给了 BPE 造跨词 token 的自由。

这个选择有讲究。GPT-2 的正则防止分词器学到"上一个词结尾的 the"和"下一个词开头的 the"应该合并；SentencePiece 允许这种合并，有时压缩效率更高，但 token 的可解释性更差。

### 特殊 token

每个生产分词器都会为结构标记保留 token ID:

| Token | 用途 | 使用者 |
|-------|---------|---------|
| `[BOS]` / `<s>` | 序列开始 | Llama 3、GPT |
| `[EOS]` / `</s>` | 序列结束 | 所有模型 |
| `[PAD]` | 批对齐填充 | BERT、T5 |
| `[UNK]` | 未知 token（字节级 BPE 已消灭它） | BERT、WordPiece |
| `<\|im_start\|>` | 对话消息边界开始 | ChatGPT、Qwen |
| `<\|im_end\|>` | 对话消息边界结束 | ChatGPT、Qwen |
| `<\|user\|>` | 用户轮次标记 | Llama 3 |
| `<\|assistant\|>` | 助手轮次标记 | Llama 3 |

特殊 token 永不被 BPE 切分。它们在合并算法运行前被精确匹配，替换成固定 ID，周围文本则正常分词。

### 对话模板

这是最多人犯迷糊、也最多实现翻车的地方。

你给对话模型发消息时，API 接受一个消息列表：

```
[
  {"role": "system", "content": "You are helpful."},
  {"role": "user", "content": "Hello"},
  {"role": "assistant", "content": "Hi there!"}
]
```

模型看到的不是 JSON，而是一个扁平的 token 序列。对话模板负责用特殊 token 把消息转成那个扁平序列。每个模型的做法都不一样：

```
Llama 3:
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are helpful.<|eot_id|><|start_header_id|>user<|end_header_id|>

Hello<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Hi there!<|eot_id|>

ChatGPT:
<|im_start|>system
You are helpful.<|im_end|>
<|im_start|>user
Hello<|im_end|>
<|im_start|>assistant
Hi there!<|im_end|>
```

模板搞错，模型就输出垃圾。它只在一种精确格式上训练过。任何偏差——少一个换行、token 调换、多一个空格——都会让输入落到训练分布之外。

### 速度

纯 Python 跑生产级分词太慢。

tiktoken(OpenAI）是 Rust 编写、Python 绑定；HuggingFace tokenizers 也是 Rust;SentencePiece 是 C++。它们比纯 Python 快 10-100 倍。

感受一下量级：为 Llama 3 预训练分词 15 万亿 token，按每秒 100 万 token（很快的 Python）要跑 174 天；按每秒 1 亿 token(Rust）只要 1.7 天。

你用 Python 写是为了理解算法。生产环境里，你会用编译好的实现，只碰 Python 包装层。

```figure
weight-tying
```

## 动手构建

### 第 1 步：字节级编码

地基。把任何字符串变成字节序列，把每个字节映射到可打印字符以便显示，再能逆回来。

```python
def bytes_to_tokens(text):
    return list(text.encode("utf-8"))

def tokens_to_text(token_bytes):
    return bytes(token_bytes).decode("utf-8", errors="replace")
```

在多语言文本上测试，看字节数：

```python
texts = [
    ("English", "hello"),
    ("Chinese", "你好"),
    ("Emoji", "🔥"),
    ("Mixed", "hello你好🔥"),
]

for label, text in texts:
    b = bytes_to_tokens(text)
    print(f"{label}: {len(text)} chars -> {len(b)} bytes -> {b}")
```

"hello" 是 5 字节，"你好" 是 6 字节（每字 3 字节），火焰 emoji 是 4 字节。字节级分词器不在乎是什么语言：字节就是字节。

### 第 2 步：正则预分词器

用 GPT-2 的正则模式把文本切成块，每块交给 BPE 独立分词。

```python
import re

try:
    import regex
    GPT2_PATTERN = regex.compile(
        r"""'(?:[sdmt]|ll|ve|re)| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+"""
    )
except ImportError:
    GPT2_PATTERN = re.compile(
        r"""'(?:[sdmt]|ll|ve|re)| ?[a-zA-Z]+| ?[0-9]+| ?[^\s\w]+|\s+(?!\S)|\s+"""
    )

def pre_tokenize(text):
    return [match.group() for match in GPT2_PATTERN.finditer(text)]
```

`regex` 模块支持 Unicode 属性转义（`\p{L}` 是字母，`\p{N}` 是数字），标准库 `re` 不支持，所以回退到 ASCII 字符类。生产级多语言分词器，请安装 `regex`。

试一下：

```python
print(pre_tokenize("Hello, world! Don't stop."))
# [' Hello', ',', ' world', '!', " Don", "'t", ' stop', '.']
```

前导空格留在词上，缩约词在撇号处断开，标点自成一块。BPE 永远不会跨这些边界合并。

### 第 3 步：字节序列上的 BPE

第 01 课的核心算法，但现在对预分词后的块独立执行。

```python
from collections import Counter

def get_byte_pairs(chunks):
    pairs = Counter()
    for chunk in chunks:
        byte_seq = list(chunk.encode("utf-8"))
        for i in range(len(byte_seq) - 1):
            pairs[(byte_seq[i], byte_seq[i + 1])] += 1
    return pairs

def apply_merge(byte_seq, pair, new_id):
    merged = []
    i = 0
    while i < len(byte_seq):
        if i < len(byte_seq) - 1 and byte_seq[i] == pair[0] and byte_seq[i + 1] == pair[1]:
            merged.append(new_id)
            i += 2
        else:
            merged.append(byte_seq[i])
            i += 1
    return merged
```

### 第 4 步：特殊 token 处理

特殊 token 需要精确匹配和固定 ID，完全绕开 BPE。

```python
class SpecialTokenHandler:
    def __init__(self):
        self.special_tokens = {}
        self.pattern = None

    def add_token(self, token_str, token_id):
        self.special_tokens[token_str] = token_id
        escaped = [re.escape(t) for t in sorted(self.special_tokens.keys(), key=len, reverse=True)]
        self.pattern = re.compile("|".join(escaped))

    def split_with_specials(self, text):
        if not self.pattern:
            return [(text, False)]
        parts = []
        last_end = 0
        for match in self.pattern.finditer(text):
            if match.start() > last_end:
                parts.append((text[last_end:match.start()], False))
            parts.append((match.group(), True))
            last_end = match.end()
        if last_end < len(text):
            parts.append((text[last_end:], False))
        return parts
```

### 第 5 步：完整的分词器类

把全部环节串起来：归一化 → 按特殊 token 切 → 预分词 → BPE 合并 → 映射到 ID。

```python
import unicodedata

class ProductionTokenizer:
    def __init__(self):
        self.merges = {}
        self.vocab = {i: bytes([i]) for i in range(256)}
        self.special_handler = SpecialTokenHandler()
        self.next_id = 256

    def normalize(self, text):
        return unicodedata.normalize("NFKC", text)

    def train(self, text, num_merges):
        text = self.normalize(text)
        chunks = pre_tokenize(text)
        chunk_bytes = [list(chunk.encode("utf-8")) for chunk in chunks]

        for i in range(num_merges):
            pairs = Counter()
            for seq in chunk_bytes:
                for j in range(len(seq) - 1):
                    pairs[(seq[j], seq[j + 1])] += 1
            if not pairs:
                break
            best = max(pairs, key=pairs.get)
            new_id = self.next_id
            self.next_id += 1
            self.merges[best] = new_id
            self.vocab[new_id] = self.vocab[best[0]] + self.vocab[best[1]]
            chunk_bytes = [apply_merge(seq, best, new_id) for seq in chunk_bytes]

    def add_special_token(self, token_str):
        token_id = self.next_id
        self.next_id += 1
        self.special_handler.add_token(token_str, token_id)
        self.vocab[token_id] = token_str.encode("utf-8")
        return token_id

    def encode(self, text):
        text = self.normalize(text)
        parts = self.special_handler.split_with_specials(text)
        all_ids = []
        for part_text, is_special in parts:
            if is_special:
                all_ids.append(self.special_handler.special_tokens[part_text])
            else:
                for chunk in pre_tokenize(part_text):
                    byte_seq = list(chunk.encode("utf-8"))
                    for pair, new_id in self.merges.items():
                        byte_seq = apply_merge(byte_seq, pair, new_id)
                    all_ids.extend(byte_seq)
        return all_ids

    def decode(self, ids):
        byte_parts = []
        for token_id in ids:
            if token_id in self.vocab:
                byte_parts.append(self.vocab[token_id])
        return b"".join(byte_parts).decode("utf-8", errors="replace")

    def vocab_size(self):
        return len(self.vocab)
```

### 第 6 步：多语言测试

真正的考验。扔给它英文、中文、emoji 和代码。

```python
corpus = (
    "The quick brown fox jumps over the lazy dog. "
    "The quick brown fox runs through the forest. "
    "Machine learning models process natural language. "
    "Deep learning transforms how we build software. "
    "def train(model, data): return model.fit(data) "
    "def predict(model, x): return model(x) "
)

tok = ProductionTokenizer()
tok.train(corpus, num_merges=50)

bos = tok.add_special_token("<|begin|>")
eos = tok.add_special_token("<|end|>")

test_texts = [
    "The quick brown fox.",
    "你好世界",
    "Hello 🌍 World",
    "def foo(x): return x + 1",
    f"<|begin|>Hello<|end|>",
]

for text in test_texts:
    ids = tok.encode(text)
    decoded = tok.decode(ids)
    print(f"Input:   {text}")
    print(f"Tokens:  {len(ids)} ids")
    print(f"Decoded: {decoded}")
    print()
```

汉字每字 3 字节，emoji 4 字节。没有一个让分词器崩溃，没有一个产生未知 token。这就是字节级 BPE 的威力。

## 投入使用

### 对比真实的分词器

加载 Llama 3、GPT-4、Mistral 的真实分词器，看它们如何处理同一段多语言文字。

```python
import tiktoken

gpt4_enc = tiktoken.get_encoding("cl100k_base")

test_paragraph = "Machine learning is powerful. 机器学习很强大。 L'apprentissage automatique est puissant. 🤖💪"

tokens = gpt4_enc.encode(test_paragraph)
pieces = [gpt4_enc.decode([t]) for t in tokens]
print(f"GPT-4 ({len(tokens)} tokens): {pieces}")
```

```python
from transformers import AutoTokenizer

llama_tok = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3-8B")
mistral_tok = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-v0.1")

for name, tok in [("Llama 3", llama_tok), ("Mistral", mistral_tok)]:
    tokens = tok.encode(test_paragraph)
    pieces = tok.convert_ids_to_tokens(tokens)
    print(f"{name} ({len(tokens)} tokens): {pieces[:20]}...")
```

同一段文本，你会看到不同的 token 数。128K 词表的 Llama 3 合并常见模式最激进；100K 的 GPT-4 居中；32K 的 Mistral 产出的 token 更多，但嵌入层更小。

权衡永远一样：词表越大，序列越短，参数越多。

## 交付

本课产出一条用于构建和调试生产级分词器的提示词，见 `outputs/prompt-tokenizer-builder.md`。

## 练习

1. **入门：** 添加 `get_token_bytes(id)` 方法，展示任意 token ID 的原始字节。用它检查你最常见的合并 token 到底代表什么。
2. **进阶：** 实现 Llama 风格的预分词器：按空白和数字切分，但保留前导空格。在同一语料上对比它和 GPT-2 正则方案产出的词表。
3. **挑战：** 添加一个对话模板方法，接受 `[{"role": ..., "content": ...}]` 消息列表，产出符合 Llama 3 对话格式的 token 序列。和 HuggingFace 的实现对比测试。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|----------------------|
| 字节级 BPE | "在字节上跑的分词器" | 基础词表为 256 个字节值的 BPE——任何输入都能处理，没有未知 token |
| 预分词 | "BPE 之前先切一刀" | 基于正则或规则的切分，防止 BPE 跨词边界合并 |
| NFKC 归一化 | "Unicode 大扫除" | 先做规范分解再做相容合成——"fi" 连字变 "fi"，全角 "A" 变 "A" |
| 对话模板 | "消息怎么变 token" | 把 role/content 消息列表转成扁平 token 序列的精确格式——模型专属，必须与训练格式一致 |
| 特殊 token | "控制 token" | 保留的 token ID，绕开 BPE——[BOS]、[EOS]、[PAD]、对话标记——在合并前精确匹配 |
| 繁殖率（Fertility) | "每词 token 数" | 输出 token 数与输入词数之比——GPT-4 英文约 1.3，韩文 2-3，越高越浪费上下文 |
| tiktoken | "OpenAI 的分词器" | Rust 编写、Python 绑定的 BPE 实现——比纯 Python 快 10-100 倍 |
| 合并表 | "那个词表" | 训练中学到的有序字节对合并列表——这就是分词器学到的全部知识 |

## 延伸阅读

- [OpenAI tiktoken 源码](https://github.com/openai/tiktoken) —— GPT-3.5/4 在用的 Rust BPE 实现
- [HuggingFace tokenizers](https://github.com/huggingface/tokenizers) —— 支持 BPE、WordPiece、Unigram 的 Rust 分词库
- [Llama 3 论文（Meta, 2024)](https://arxiv.org/abs/2407.21783) —— 128K 词表与分词器训练细节
- [SentencePiece(Kudo & Richardson, 2018)](https://arxiv.org/abs/1808.06226) —— 语言无关分词
- [GPT-2 分词器源码](https://github.com/openai/gpt-2/blob/master/src/encoder.py) —— 最初的字节到 Unicode 映射
