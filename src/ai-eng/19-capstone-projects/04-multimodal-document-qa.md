# 终局项目 04 —— 多模态文档问答(视觉优先的 PDF、表格与图表)

> 2026 年的文档问答前沿,已经从"先 OCR 再按文本处理"转向"视觉优先的延迟交互"。ColPali、ColQwen2.5、ColQwen3-omni 把每个 PDF 页面当作图像,用多向量延迟交互来嵌入,让查询直接对图像块(patch)做注意力。在财报 10-K、科学论文、手写笔记上,这条路线大幅领先 OCR 优先路线。本终局项目要求你在 1 万页文档上端到端搭出这条流水线,并发布与"OCR 后按文本处理"方案的正面对比。

**类型:** 终局项目
**编程语言:** Python(流水线),TypeScript(查看器 UI)
**前置要求:** 第 4 阶段(计算机视觉)、第 5 阶段(NLP)、第 7 阶段(Transformer)、第 11 阶段(LLM 工程)、第 12 阶段(多模态)、第 17 阶段(基础设施)
**涉及阶段:** P4 · P5 · P7 · P11 · P12 · P17
**预计耗时:** 30 小时

## 问题

企业手里压着一堆会被 OCR 流水线毁掉的 PDF:表格横过来的扫描版 10-K、公式密集的科学论文、只有当成图像才读得懂的图表、手写批注。把这些按"文本优先"处理,等于丢掉一半信号。2026 年的答案是:在原始页面图像上做延迟交互的多向量检索。ColPali(Illuin Tech)开创了这条路;ColQwen2.5-v0.2 与 ColQwen3-omni 把精度又推高了一截。在 ViDoRe v3 上,视觉优先检索明显优于 OCR 后按文本处理——而且在图表、表格、手写内容上差距拉得更大。

代价是存储与延迟。一个 ColQwen 嵌入是每页约 2048 个 patch 向量,而不是一根 1024 维单向量,原始存储量会暴涨。DocPruner(2026)能在精度无可感知损失的前提下剪掉 50%。你要索引 1 万页,测 ViDoRe v3 的 nDCG@5,把答案响应压到 2 秒内,并与 OCR 后按文本处理的基线正面交锋。

## 概念

延迟交互(late interaction)指的是:每个查询 token 与每个页面 patch token 独立打分,然后对每个查询 token 取最大分并求和。不需要池化成单向量,也能得到细粒度匹配。多向量索引(Vespa、Qdrant 多向量或 AstraDB)存储逐 patch 嵌入,检索时跑 MaxSim。

答题器是一个视觉语言模型,输入查询加上 top-k 检索页图像,产出带证据区域(边界框或页码引用)的答案。Qwen3-VL-30B、Gemini 2.5 Pro、InternVL3 是 2026 年的前沿选项。对于公式与科学符号,可选地拼接一路 OCR 兜底(Nougat、dots.ocr)作为额外的文本通道。

评测是一个二维矩阵。一个轴是内容类型(纯文本段落、密集表格、柱状/折线图、手写笔记、公式),另一个轴是检索路线(视觉优先延迟交互 vs OCR 后按文本处理 vs 混合)。每格填 nDCG@5 与答题准确率。这份报告就是交付物。

## 架构

```
PDFs -> page renderer (PyMuPDF, 180 DPI)
           |
           v
  ColQwen2.5-v0.2 embed (multi-vector per page, ~2048 patches)
           |
           +------> DocPruner 50% compression
           |
           v
   multi-vector index (Vespa or Qdrant multi-vector)
           |
query ----+----> retrieve top-k pages (MaxSim)
           |
           v
  VLM answerer: Qwen3-VL-30B | Gemini 2.5 Pro | InternVL3
    inputs: query + top-k page images + optional OCR text
           |
           v
  answer with cited page numbers + evidence regions
           |
           v
  Streamlit / Next.js viewer: highlighted boxes on source page
```

## 技术栈

- 页面渲染:PyMuPDF(fitz),180 DPI,统一竖版方向
- 延迟交互模型:ColQwen2.5-v0.2 或 ColQwen3-omni(Hugging Face 上 vidore 团队发布)
- 索引:Vespa 多向量字段,或 Qdrant 多向量,或支持 MaxSim 的 AstraDB
- 剪枝:DocPruner 2026 策略(保留高方差 patch,压缩 50%,精度损失 < 0.5%)
- OCR 兜底(公式/密集表格):dots.ocr 或 Nougat
- VLM 答题器:自托管 Qwen3-VL-30B 或托管 Gemini 2.5 Pro;InternVL3 兜底
- 评测:ViDoRe v3 基准,多页推理用 M3DocVQA
- 查看器 UI:Next.js 15,canvas 叠加层展示证据区域

```figure
ce-late-interaction
```

## 动手构建

1. **摄入。** 遍历 1 万页 PDF 语料,覆盖 10-K、科学论文与扫描文档。每页渲染成 1536x2048 PNG,持久化 `{doc_id, page_num, image_path}`。

2. **嵌入。** 对每页图像跑 ColQwen2.5-v0.2,输出约 2048 个 128 维 patch 嵌入。用 DocPruner 保留信号最强的一半。写入 Vespa 多向量字段或 Qdrant 多向量。

3. **查询。** 每个进入的查询用查询塔嵌入(token 级嵌入)。对索引跑 MaxSim:对每个查询 token,取它与该页所有 patch 嵌入点积的最大值,再求和。返回 top-k 页面。

4. **合成。** 把查询与 top-5 页图像发给 Qwen3-VL-30B。提示词:"只依据所提供的页面作答。每条论断按 (doc_id, page) 引用,并指明区域(图、表、段落)。"

5. **证据区域。** 后处理答案,抽出引用区域。若 VLM 输出边界框(Qwen3-VL 支持),在查看器中渲染为叠加层。

6. **OCR 兜底。** 对被判定为公式密集的页面(基于图像方差的启发式),跑 Nougat 或 dots.ocr,把 OCR 文本作为图像之外的额外通道传入。

7. **评测。** 跑 ViDoRe v3(检索 nDCG@5)与 M3DocVQA(多页问答准确率)。同时在同一语料、同一合成器上跑 OCR 后按文本处理的流水线。产出"内容类型 × 路线"矩阵。

8. **UI。** 先做 Streamlit 原型;生产查看器用 Next.js 15,逐页叠加证据区域。

## 投入使用

```
$ doc-qa ask "what was the 2024 operating margin change for segment EMEA?"
[retrieve]   top-5 pages in 320ms (ColQwen2.5, MaxSim, Vespa)
[synth]      qwen3-vl-30b, 1.4s, cited (form-10k-2024, p. 88) + (..., p. 92)
answer:
  EMEA operating margin moved from 18.2% to 16.8%, a 140bp decline.
  cited: 10-K-2024.pdf p.88 (Table 4, Segment Operating Margin)
         10-K-2024.pdf p.92 (MD&A, Operating Performance)
[viewer]     open with highlighted bounding boxes overlaid on p.88 Table 4
```

## 交付

`outputs/skill-doc-qa.md` 描述交付物:一个针对特定语料调优的视觉优先多模态文档问答系统,并在 ViDoRe v3 上与 OCR 后按文本处理的基线对测。

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | ViDoRe v3 / M3DocVQA 准确率 | 基准分数对比 OCR 文本基线与公开榜单 |
| 20 | 证据区域落点 | 引用区域真正包含答案片段的比例 |
| 20 | 存储与延迟工程 | DocPruner 压缩率、索引 p95、答题 p95 |
| 20 | 多页推理 | 手工标注 100 题多页数据集上的准确率 |
| 15 | 原文查验体验 | 查看器清晰度、叠加层保真度、并排对比工具 |
| **100** | | |

## 练习

1. 在同一语料上对比 ColQwen2.5-v0.2 与 ColQwen3-omni。哪些页面一个对一个错?给索引加"content class"标签,按类型路由。

2. 激进剪枝嵌入(75%、90%)。找到压缩悬崖:ViDoRe nDCG@5 跌破 OCR 基线的那个点。

3. 搭混合方案:OCR 后按文本处理与 ColQwen 并行,用 RRF 融合,再用交叉编码器重排。混合方案是否胜过任一单方案?在哪些内容上帮助最大?

4. 把 Qwen3-VL-30B 换成更小的 VLM(Qwen2.5-VL-7B)。画出"准确率—美元成本"曲线。

5. 增加手写笔记支持。渲染手写语料,用 ColQwen 嵌入,测检索效果,并与手写 OCR 流水线对比。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| 延迟交互 | "ColPali 式检索" | 查询 token 与页面 patch 独立打分,MaxSim 聚合 |
| 多向量 | "逐 patch 嵌入" | 每个文档有多根向量,而不是一根池化向量 |
| MaxSim | "延迟交互打分" | 对每个查询 token 取其与文档向量的最大相似度,再求和 |
| DocPruner | "patch 压缩" | 2026 年的剪枝方法,保留 50% patch,精度损失可忽略 |
| ViDoRe v3 | "文档检索基准" | 2026 年衡量视觉文档检索的标准基准 |
| 证据区域 | "引用边界框" | 源页面上定位答案片段的边界框 |
| OCR 兜底 | "公式通道" | 与视觉通道并行、用于公式/表格密集页面的文本流水线 |

## 延伸阅读

- [ColPali (Illuin Tech) repository](https://github.com/illuin-tech/colpali) —— 延迟交互文档检索参考实现
- [ColPali paper (arXiv:2407.01449)](https://arxiv.org/abs/2407.01449) —— 奠基性方法论文
- [ColQwen family on Hugging Face](https://huggingface.co/vidore) —— 生产可用的模型权重
- [M3DocRAG (Adobe)](https://arxiv.org/abs/2411.04952) —— 多页多模态 RAG 基线
- [Vespa multi-vector tutorial](https://docs.vespa.ai/en/colpali.html) —— 参考服务栈
- [Qdrant multi-vector support](https://qdrant.tech/documentation/concepts/vectors/#multivectors) —— 备选索引
- [AstraDB multi-vector](https://docs.datastax.com/en/astra-db-serverless/databases/vector-search.html) —— 备选托管索引
- [Nougat OCR](https://github.com/facebookresearch/nougat) —— 支持公式的 OCR 兜底
