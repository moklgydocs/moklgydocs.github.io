# OCR 与文档理解

> OCR 是一条三段流水线——检测文本框、识别字符、还原版面。每个现代 OCR 系统,要么重排这三段,要么把它们合并掉。

**类型:** 学习 + 使用
**编程语言:** Python
**前置要求:** 第 4 阶段第 06 课(检测)、第 7 阶段第 02 课(自注意力)
**预计耗时:** 约 45 分钟

## 学习目标

- 讲清经典 OCR 流水线(检测 -> 识别 -> 版面)与现代端到端方案(Donut、Qwen-VL-OCR)
- 实现 CTC(连接时序分类)损失,用于序列到序列的 OCR 训练
- 不做训练,直接用 PaddleOCR 或 EasyOCR 做生产级文档解析
- 区分 OCR、版面解析与文档理解——按任务选对工具

## 问题

满是文字的图像无处不在:收据、发票、证件、扫描书、表单、白板、招牌、截图。从中提取结构化数据——不只是字符,而是"这是总金额"——是应用视觉中价值最高的问题之一。

这个领域分成三个技能层:

1. **OCR 本体**:把像素变成文字。
2. **版面解析**:把 OCR 输出聚成区域(标题、正文、表格、页眉)。
3. **文档理解**:从版面中提取结构化字段("invoice_total = $42.50")。

每一层都有经典与现代两条路线。而"我想从图里取文字"和"我要从这张收据里取总金额"之间的差距,比大多数团队以为的要大。

## 概念

### 经典流水线

```mermaid
flowchart LR
    IMG["Image"] --> DET["Text detection<br/>(DB, EAST, CRAFT)"]
    DET --> BOX["Word/line<br/>bounding boxes"]
    BOX --> CROP["Crop each region"]
    CROP --> REC["Recognition<br/>(CRNN + CTC)"]
    REC --> TXT["Text strings"]
    TXT --> LAY["Layout<br/>ordering"]
    LAY --> OUT["Reading-order text"]

    style DET fill:#dbeafe,stroke:#2563eb
    style REC fill:#fef3c7,stroke:#d97706
    style OUT fill:#dcfce7,stroke:#16a34a
```

- **文本检测**产出逐行或逐词的四边形。
- **识别**把每个区域裁到固定高度,过 CNN + BiLSTM + CTC,产出字符序列。
- **版面**重建阅读顺序(拉丁文字从上到下、从左到右;阿拉伯文、日文规则不同)。

### 一段话讲清 CTC

OCR 识别要从定长特征图产出变长序列。CTC(Graves et al., 2006)让你在没有字符级对齐标注的情况下训练它:模型在每个时间步输出一个(vocab + blank)上的分布,CTC 损失对所有"合并重复并删除 blank 后能归约到目标文本"的对齐方式求边缘。

```
raw output: "h h h _ _ e e l l _ l l o _ _"
after merge repeats and remove blanks: "hello"
```

CTC 是 CRNN 在 2015 年走得通的原因,也仍然在 2026 年训练着大多数生产 OCR 模型。

### 现代端到端模型

- **Donut**(Kim et al., 2022)— ViT 编码器 + 文本解码器;读图直接吐 JSON。没有文本检测器,没有版面模块。
- **TrOCR** — ViT + Transformer 解码器,做行级 OCR。
- **Qwen-VL-OCR / InternVL** — 为 OCR 任务微调的完整视觉语言模型;2026 年复杂文档上准确率最高。
- **PaddleOCR** — 经典 DB + CRNN 流水线的成熟生产封装;仍是开源主力军。

端到端模型需要更多数据和算力,但免掉了多级流水线的误差累积。

### 版面解析

结构化文档上,跑一个版面检测器(LayoutLMv3、DocLayNet),给每个区域打标签:标题、段落、图、表、脚注。阅读顺序就变成了"按版面顺序遍历区域并拼接"。

表单类文档,用**键值抽取**模型(图文混排的富文本文档用 Donut,纯扫描件用 LayoutLMv3)。输入是图像 + 检测到的文字 + 位置,输出结构化的键值对。

### 评估指标

- **字符错误率(CER)** — 编辑距离 / 参考长度。越低越好。干净扫描件的生产目标:< 2%。
- **词错误率(WER)** — 词级别同上。
- **结构化字段 F1** — 用于键值任务;度量 `{invoice_total: 42.50}` 这类字段是否被正确抽出。
- **JSON 编辑距离** — 用于端到端文档解析;Donut 论文提出了归一化树编辑距离。

```figure
cv3-ctc-collapse
```

## 动手构建

### 第 1 步:CTC 损失 + 贪心解码器

```python
import torch
import torch.nn as nn
import torch.nn.functional as F


def ctc_loss(log_probs, targets, input_lengths, target_lengths, blank=0):
    """
    log_probs:      (T, N, C) log-softmax over vocab including blank at index 0
    targets:        (N, S) int targets (no blanks)
    input_lengths:  (N,) per-sample time steps used
    target_lengths: (N,) per-sample target length
    """
    return F.ctc_loss(log_probs, targets, input_lengths, target_lengths,
                      blank=blank, reduction="mean", zero_infinity=True)


def greedy_ctc_decode(log_probs, blank=0):
    """
    log_probs: (T, N, C) log-softmax
    returns: list of index sequences (blanks removed, repeats merged)
    """
    preds = log_probs.argmax(dim=-1).transpose(0, 1).cpu().tolist()
    out = []
    for seq in preds:
        decoded = []
        prev = None
        for idx in seq:
            if idx != prev and idx != blank:
                decoded.append(idx)
            prev = idx
        out.append(decoded)
    return out
```

`F.ctc_loss` 在可用时会走高效的 CuDNN 实现。贪心解码器比束搜索简单,CER 通常只比它差 1% 以内。

### 第 2 步:迷你 CRNN 识别器

最小 CNN + BiLSTM,做行级 OCR。

```python
class TinyCRNN(nn.Module):
    def __init__(self, vocab_size=40, hidden=128, feat=32):
        super().__init__()
        self.cnn = nn.Sequential(
            nn.Conv2d(1, feat, 3, 1, 1), nn.BatchNorm2d(feat), nn.ReLU(inplace=True),
            nn.MaxPool2d(2),
            nn.Conv2d(feat, feat * 2, 3, 1, 1), nn.BatchNorm2d(feat * 2), nn.ReLU(inplace=True),
            nn.MaxPool2d(2),
            nn.Conv2d(feat * 2, feat * 4, 3, 1, 1), nn.BatchNorm2d(feat * 4), nn.ReLU(inplace=True),
            nn.MaxPool2d((2, 1)),
            nn.Conv2d(feat * 4, feat * 4, 3, 1, 1), nn.BatchNorm2d(feat * 4), nn.ReLU(inplace=True),
            nn.MaxPool2d((2, 1)),
        )
        self.rnn = nn.LSTM(feat * 4, hidden, bidirectional=True, batch_first=True)
        self.head = nn.Linear(hidden * 2, vocab_size)

    def forward(self, x):
        # x: (N, 1, H, W)
        f = self.cnn(x)                # (N, C, H', W')
        f = f.mean(dim=2).transpose(1, 2)  # (N, W', C)
        h, _ = self.rnn(f)
        return F.log_softmax(self.head(h).transpose(0, 1), dim=-1)  # (W', N, vocab)
```

输入固定高度(CNN 把高度池化到 1),宽度就是 CTC 的时间维。

### 第 3 步:合成 OCR 数据

生成白底黑字的数字串,做端到端冒烟测试。

```python
import numpy as np

def synthetic_line(text, height=32, char_width=16):
    W = char_width * len(text)
    img = np.ones((height, W), dtype=np.float32)
    for i, c in enumerate(text):
        x = i * char_width
        shade = 0.0 if c.isalnum() else 0.5
        img[6:height - 6, x + 2:x + char_width - 2] = shade
    return img


def build_batch(strings, vocab):
    H = 32
    W = 16 * max(len(s) for s in strings)
    imgs = np.ones((len(strings), 1, H, W), dtype=np.float32)
    target_lengths = []
    targets = []
    for i, s in enumerate(strings):
        imgs[i, 0, :, :16 * len(s)] = synthetic_line(s)
        ids = [vocab.index(c) for c in s]
        targets.extend(ids)
        target_lengths.append(len(ids))
    return torch.from_numpy(imgs), torch.tensor(targets), torch.tensor(target_lengths)


vocab = ["_"] + list("0123456789abcdefghijklmnopqrstuvwxyz")
imgs, targets, lengths = build_batch(["hello", "world"], vocab)
print(f"images: {imgs.shape}   targets: {targets.shape}   lengths: {lengths.tolist()}")
```

真实 OCR 数据集还会加字体、噪声、旋转、模糊和颜色。上面的流水线一模一样。

### 第 4 步:训练梗概

```python
model = TinyCRNN(vocab_size=len(vocab))
opt = torch.optim.Adam(model.parameters(), lr=1e-3)

for step in range(200):
    strings = ["abc" + str(step % 10)] * 4 + ["xyz" + str((step + 1) % 10)] * 4
    imgs, targets, target_lens = build_batch(strings, vocab)
    log_probs = model(imgs)  # (W', 8, vocab)
    input_lens = torch.full((8,), log_probs.size(0), dtype=torch.long)
    loss = ctc_loss(log_probs, targets, input_lens, target_lens, blank=0)
    opt.zero_grad(); loss.backward(); opt.step()
```

在这份 trivial 合成数据上,200 步内损失应从约 3 降到约 0.2。

## 投入使用

三条生产路径:

- **PaddleOCR** — 成熟、快、多语言。一行用法:`paddleocr.PaddleOCR(lang="en").ocr(image_path)`。
- **EasyOCR** — Python 原生、多语言、PyTorch 骨干。
- **Tesseract** — 经典方案;模型搞不定的老扫描件上仍然有用。

端到端文档解析用 Donut 或 VLM:

```python
from transformers import DonutProcessor, VisionEncoderDecoderModel

processor = DonutProcessor.from_pretrained("naver-clova-ix/donut-base-finetuned-cord-v2")
model = VisionEncoderDecoderModel.from_pretrained("naver-clova-ix/donut-base-finetuned-cord-v2")
```

收据、发票、表单这类结构可复现的文档,微调 Donut;任意文档或需要推理的 OCR,当前默认是 Qwen-VL-OCR 这类 VLM。

## 交付

本课产出:

- `outputs/prompt-ocr-stack-picker.md` — 一个提示词:按文档类型、语言和结构,在 Tesseract / PaddleOCR / Donut / VLM-OCR 中做选择。
- `outputs/skill-ctc-decoder.md` — 一个技能:从零写出贪心与束搜索 CTC 解码器,含长度归一化。

## 练习

1. **(易)** 用 5 位随机数字串训练 TinyCRNN 500 步。在留出集上报告 CER。
2. **(中)** 把贪心解码换成束搜索(beam_width=5)。报告 CER 变化。在哪些输入上束搜索更优?
3. **(难)** 用 PaddleOCR 处理 20 张收据,抽取行项目,对手工标注真值计算 {item_name, price} 对的 F1。

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|----------------|----------------------|
| OCR | "从像素取文字" | 把图像区域变成字符序列 |
| CTC | "免对齐损失" | 不需要逐时间步标签就能训练序列模型的损失;对所有对齐求边缘 |
| CRNN | "经典 OCR 模型" | 卷积特征提取器 + BiLSTM + CTC;2015 年的基线,至今仍在生产中使用 |
| Donut | "端到端 OCR" | ViT 编码器 + 文本解码器;从图像直接吐 JSON |
| 版面解析 | "找区域" | 检测并标注文档中的标题/表格/图/段落区域 |
| 阅读顺序 | "文字序列" | 把识别出的区域排成句子的顺序;拉丁文很简单,混排版面并不简单 |
| CER / WER | "错误率" | 字符或词粒度上的 编辑距离 / 参考长度 |
| VLM-OCR | "会读字的 LLM" | 为 OCR 任务训练或提示的视觉语言模型;复杂文档上的当前 SOTA |

## 延伸阅读

- [CRNN (Shi et al., 2015)](https://arxiv.org/abs/1507.05717) — 最早的 CNN+RNN+CTC 架构
- [CTC (Graves et al., 2006)](https://www.cs.toronto.edu/~graves/icml_2006.pdf) — CTC 原始论文;算法思想密度极高
- [Donut (Kim et al., 2022)](https://arxiv.org/abs/2111.15664) — 无 OCR 的文档理解 Transformer
- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) — 开源生产级 OCR 技术栈
