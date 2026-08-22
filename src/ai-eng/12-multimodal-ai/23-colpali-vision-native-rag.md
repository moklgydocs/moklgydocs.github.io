# ColPali 与视觉原生文档 RAG

> 传统 RAG 把 PDF 解析成文本、切块、嵌入、存向量。每一步都在丢信号:OCR 丢掉图表数据,分块拆散表格行,文本嵌入无视图片。ColPali(Faysse 等,2024 年 7 月)问了一个更简单的问题:为什么非要抽文本?用 PaliGemma 直接嵌入页面图像,用 ColBERT 式迟交互做检索,把文档携带的版式、图、字体、格式信号全部留住。公开基准上:在视觉富文档上端到端准确率比文本 RAG 高 20–40%。ColQwen2、ColSmol、VisRAG 延续了这个模式。本课解读视觉原生 RAG 的论点,并构建一个迷你的类 ColPali 索引器。

**类型:** 动手构建
**编程语言:** Python(标准库,多向量索引器 + MaxSim 打分器)
**前置要求:** 第 11 阶段(LLM 工程 —— RAG 基础)、第 12 阶段 · 05(LLaVA)
**预计耗时:** 约 180 分钟

## 学习目标

- 解释双编码器检索(每文档一个向量)与迟交互检索(每文档多个向量)的区别。
- 描述 ColBERT 的 MaxSim 操作,以及 ColPali 如何把它从文本 token 推广到图像 patch。
- 构建一个迷你的类 ColPali 索引器:页面 → patch 嵌入 → 对查询词嵌入做 MaxSim → top-k 页面。
- 在发票/财报场景上,对比 ColPali + Qwen2.5-VL 生成器 vs 文本 RAG + GPT-4。

## 问题

对 PDF 做文本 RAG,扔掉了文档的大部分。财报的 Q3 营收增长通常在图表里;医疗报告的结论在带标注的影像里;法律合同的签名栏是一个版式事实,不是文本事实。

文本 RAG 流水线:

1. PDF → 文本(OCR / pdftotext)。
2. 文本 → 300–500 token 的块。
3. 块 → 双编码器嵌入(一个向量)。
4. 用户查询 → 嵌入 → 余弦相似度 → top-k 块。
5. 块 + 查询 → LLM。

五步,步步有损:图表没捕获,表格被切块打断,多栏版式被压平,图的标注消失。

ColPali 的修法:跳过 OCR,直接嵌入页面图像;用 ColBERT 式迟交互做检索,让模型在查询时能注意到细粒度 patch。

## 概念

### ColBERT(2020)

ColBERT(Khattab 与 Zaharia,arXiv:2004.12832)是一种文本检索方法。不是每文档一个向量,而是每 token 一个向量。查询时:

- 查询 token 各得嵌入(N_q 个向量)。
- 文档 token 各得嵌入(N_d 个向量,通常预先缓存)。
- 分数 = 对每个查询 token,取它与所有文档 token 余弦相似度的最大值,再求和:Σ_i max_j cos(q_i, d_j)。

这就是 MaxSim 操作:每个查询 token"选出"最匹配的文档 token,最终分数是总和。

优点:召回强,处理词级语义。缺点:每文档 N_d 个向量,存储贵。

### ColPali

ColPali(Faysse 等,arXiv:2407.01449)把 ColBERT 模式用到图像上。

- 每页由 PaliGemma(ViT + 语言)编码成 patch 嵌入:每页 N_p 个向量。
- 每个用户查询(文本)编码成查询 token 嵌入:N_q 个向量。
- 分数 = Σ_i max_j cos(q_i, p_j),即查询文本 token 与页面图像 patch 之间的 MaxSim。
- 按总分取 top-k 页面。

文档摄取时:用 PaliGemma 嵌入每一页,存下所有 patch 嵌入。查询时:嵌入查询 token,与所有已存页面嵌入算 MaxSim,返回 top-k 页面。

优点:视觉富文档上端到端比文本 RAG 好 20–40%;每个 patch 向量捕获局部版式与内容。

缺点:N_p 个 patch × 4 字节浮点 × D 维向量/页 = 存储涨得快。用 PQ / OPQ 量化缓解。

### ColQwen2 与 ColSmol

ColQwen2(illuin-tech,2024–2025)把 PaliGemma 换成 Qwen2-VL:基座编码器更强,检索更好。

ColSmol 是小规模变体,用于本地/边缘:~1B 参数的 ColSmol 检索器在消费级 GPU 上就能跑。

### VisRAG

VisRAG(Yu 等,arXiv:2410.10594)是另一种变体:不在 patch 上做 MaxSim,而是用 VLM 把每页池化成单个向量,再做双编码器检索。索引更快、存储更省,召回更弱。

质量与成本的权衡:要质量选 ColPali,要规模选 VisRAG。

### M3DocRAG

M3DocRAG(Cho 等,arXiv:2411.04952)把多模态检索扩展到跨页跨文档推理:跨文档检索页面,为 VLM 拼出多页上下文。

### ViDoRe —— 基准

ColPali 的配套基准:视觉文档检索评估(Visual Document Retrieval Evaluation)。任务包括财报、学术论文、行政文书、病历、手册。指标:nDCG@5。

ColPali-v1 在 ViDoRe 上 nDCG@5 约 80%;同样文档上的文本 RAG 约 50–60%。

### 端到端 RAG 流水线

视觉原生 RAG:

1. 摄取:PDF → 页面图像 → PaliGemma 编码 → 存所有 patch 嵌入。
2. 查询:用户文本 → 查询 token 嵌入 → 与所有已索引页面做 MaxSim → top-k 页面。
3. 生成:top-k 页面图像 + 查询 → VLM(Qwen2.5-VL 或 Claude)→ 答案。

全程没有 OCR。图、表、字体、版式全部流进答案。

### 存储的账

一份 50 页财报,每页 729 个 patch,128 维嵌入:

- ColPali:50 × 729 × 128 × 4 字节 ≈ 18 MB 原始,PQ 后约 4 MB。
- 文本 RAG:50 块 × 768 维 × 4 字节 ≈ 150 kB。

ColPali 每文档存储约 30 倍。规模化后,OPQ / PQ 能压到约 5–10 倍,通常可接受。

### 文本 RAG 仍胜出的场景

- 没有版式信号的纯文本文档(wiki 文章、聊天记录):文本 RAG 更简单、存储更省。
- 数百万页级档案,存储主导成本。
- 严格监管要求检索同时给出可抽取的 OCR 文本。

2026 年除此之外的一切——财报、学术论文、法律合同、病历、UX 文档——视觉原生 RAG 胜出。

```figure
mm-maxsim
```

## 投入使用

`code/main.py`:

- 玩具 patch 编码器:把一个"页面"(小网格的特征向量)映射成 patch 嵌入数组。
- MaxSim 打分器:计算查询 token 嵌入集合与页面 patch 集合之间 ColBERT 式的分数。
- 索引 5 个玩具页面,跑 3 个查询,返回带分数的 top-k。

## 交付

本课产出 `outputs/skill-vision-rag-designer.md`。给定一个文档 RAG 项目,在 ColPali / ColQwen2 / VisRAG / 文本 RAG 之间做选择,并估算存储规模。

## 练习

1. 一份 200 页年报,每页 729 个 patch、128 维嵌入、4 字节浮点。计算原始存储和 PQ 压缩(8 倍)后的存储。

2. MaxSim 是 Σ_i max_j cos(q_i, p_j)。这个求和捕捉到了什么,是简单平均相似度捕捉不到的?

3. ColPali 以 patch 集合索引页面。如果改成按词索引(如 ColBERT)会怎样?权衡是什么?

4. 为一个 100 万页语料设计端到端流水线,延迟预算每查询 500ms。在 ColQwen2 / VisRAG 中选择并说明理由。

5. 读 M3DocRAG(arXiv:2411.04952)。描述它的多页注意力模式,以及它与单页 ColPali 检索的区别。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|-----------------|------------------------|
| 迟交互 | "ColBERT 那种" | 用逐 token 或逐 patch 嵌入 + MaxSim 的检索,而非单文档向量 |
| MaxSim | "对 patch 取 max" | 每个查询 token 选相似度最高的文档 token,再跨查询求和 |
| 双编码器 | "单向量" | 每文档一个向量;更快但丢失粒度 |
| 多向量 | "每文档多向量" | 每文档/每页存 N_p 个向量;存储成本涨但召回更好 |
| patch 嵌入 | "页面特征" | VLM 编码器为每个图像 patch 产出一个向量,按页缓存 |
| ViDoRe | "视觉文档基准" | ColPali 的视觉文档检索基准套件 |
| PQ 量化 | "乘积量化" | 在缩小存储约 8 倍的同时保持向量相似度的压缩方法 |

## 延伸阅读

- [Faysse 等 —— ColPali(arXiv:2407.01449)](https://arxiv.org/abs/2407.01449)
- [Khattab 与 Zaharia —— ColBERT(arXiv:2004.12832)](https://arxiv.org/abs/2004.12832)
- [Yu 等 —— VisRAG(arXiv:2410.10594)](https://arxiv.org/abs/2410.10594)
- [Cho 等 —— M3DocRAG(arXiv:2411.04952)](https://arxiv.org/abs/2411.04952)
- [illuin-tech/colpali GitHub](https://github.com/illuin-tech/colpali)
