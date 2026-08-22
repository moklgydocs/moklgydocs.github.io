# 终局项目 02 —— 代码库 RAG(跨仓库语义搜索)

> 2026 年,每个像样的工程组织都在跑一套懂"意思"而不仅是懂"字符串"的内部代码搜索。Sourcegraph Amp、Cursor 的代码库问答、Augment 的企业级图谱、Aider 的 repomap、Pinterest 的内部 MCP——同一个模子。摄入多个仓库,用 tree-sitter 解析,按函数级和类级切块嵌入,混合检索,重排序,带引用作答。本终局项目要求你造一个能扛住 10 个仓库 200 万行代码的系统,并且在每次 git push 后完成增量重索引。

**类型:** 终局项目
**编程语言:** Python(数据摄入),TypeScript(API + UI)
**前置要求:** 第 5 阶段(NLP 基础)、第 7 阶段(Transformer)、第 11 阶段(LLM 工程)、第 13 阶段(工具)、第 17 阶段(基础设施)
**涉及阶段:** P5 · P7 · P11 · P13 · P17
**预计耗时:** 30 小时

## 问题

到 2026 年,每个前沿编程智能体都自带代码库检索层,因为光靠上下文窗口解决不了跨仓库问题。Claude 的 1M token 上下文有帮助,但并不能取代排序检索。对原始切块做朴素的余弦搜索,会被生成代码、monorepo 重复代码,以及少有人 import 的长尾符号毒化结果。生产级答案是:在 AST 感知的切块上做混合检索(稠密 + BM25),配一个重排序器,背后再撑一张符号引用图。

你得靠索引一支真实的代码舰队来学会这些——而不是一个教学仓库——并度量 MRR@10、引用忠实度和增量新鲜度。失败模式都是基础设施层面的:一个 10 万文件的 monorepo、一次改了一半文件的 push、一个必须横跨四个仓库才能答对的问题。

## 概念

AST 感知的摄入流水线用 tree-sitter 解析每个文件,抽出函数和类节点,沿节点边界切块,而不是按固定 token 窗口切。每个切块有三份表示:一个稠密嵌入(Voyage-code-3 或 nomic-embed-code)、稀疏的 BM25 词条,以及一段简短的自然语言摘要。摘要提供了第三种可检索模态——用户问"X 是怎么做授权的",摘要里提到了"authz",哪怕代码里只有 `check_permission`。

检索是混合式的。一次查询同时打出稠密和 BM25 两路搜索,合并 top-k,把并集交给交叉编码器重排序(Cohere rerank-3 或 bge-reranker-v2-gemma-2b)。重排后的列表进入长上下文合成器(带 prompt 缓存的 Claude Sonnet 4.7,或自托管的 Llama 3.3 70B),指令要求每个论断都按文件和行号区间标注引用。没有引用的回答会被后置过滤器拒掉。

增量新鲜度是基础设施难题。git push 触发一次 diff:哪些文件变了、哪些符号变了。只有受影响的切块重新嵌入。受影响的跨文件符号边(import、方法调用)重新计算。索引保持一致,而不必每次提交都重处理 200 万行。

## 架构

```
git push --> webhook --> ingest worker (LlamaIndex Workflow)
                           |
                           v
             tree-sitter parse + AST chunk
                           |
            +--------------+----------------+
            v              v                v
          dense        BM25 index       summary (LLM)
        (Voyage / bge)  (Tantivy)        (Haiku 4.5)
            |              |                |
            +------> Qdrant / pgvector <----+
                            |
                            v
                      symbol graph (Neo4j / kuzu)
                            |
  query --> LangGraph agent (retrieve -> rerank -> synth)
                            |
                            v
                 Claude Sonnet 4.7 1M context
                            |
                            v
                 answer + file:line citations
```

## 技术栈

- 解析:tree-sitter,17 种语言语法(Python、TS、Rust、Go、Java、C++ 等)
- 稠密嵌入:Voyage-code-3(托管)或 nomic-embed-code-v1.5(自托管),bge-code-v1 兜底
- 稀疏索引:Tantivy(Rust)BM25F,符号名与符号体分字段加权
- 向量库:Qdrant 1.12 混合搜索;向量量低于 5000 万的团队可用 pgvector + pgvectorscale
- 切块摘要模型:Claude Haiku 4.5 或 Gemini 2.5 Flash,启用 prompt 缓存
- 重排序器:Cohere rerank-3 或自托管 bge-reranker-v2-gemma-2b
- 编排:LlamaIndex Workflows 负责摄入,LangGraph 负责查询智能体
- 合成器:Claude Sonnet 4.7(1M 上下文),启用 prompt 缓存
- 符号图:Neo4j(托管)或 kuzu(嵌入式),存 import 与调用边
- 可观测:Langfuse,每次检索与合成步骤各记一个 span

```figure
ce-hybrid-retrieval
```

## 动手构建

1. **摄入遍历器。** 在每次 push 钩子上遍历 git 历史,收集变更文件。对每个文件用 tree-sitter 解析,连同完整源码区间抽出函数和类节点。产出切块记录 `{repo, path, start_line, end_line, symbol, body}`。

2. **切块摘要器。** 把切块攒批发给 Haiku 4.5,系统前缀开 prompt 缓存。提示词:"用一句话概括这个函数,点明它的公开契约与副作用。"摘要与切块一并存储。

3. **嵌入池。** 两条并行队列:稠密(Voyage-code-3,批 128)与摘要(同一模型,输入换成摘要串)。向量写入 Qdrant,payload 为 `{repo, path, start_line, end_line, symbol, kind}`。

4. **BM25 索引。** Tantivy 分字段加权:符号名权重 4,符号体权重 1,摘要权重 2。这样"找名字叫 X 的函数"和"找做 X 这件事的函数"都能查。

5. **符号图。** 为每个切块记录边:import(本文件用到仓库 Z 的符号 Y)、调用(本函数调用类 C 的方法 M)、继承。存入 kuzu。查询时用它把检索扩展到仓库边界之外。

6. **查询智能体。** LangGraph 三个节点。`retrieve` 并行发稠密 + BM25,按 (repo, path, symbol) 去重。`rerank` 对 top-50 跑交叉编码器,留 top-10。`synth` 把重排后的切块放进上下文调 Claude Sonnet 4.7,缓存系统提示,要求 file:line 引用。

7. **引用强制。** 解析模型输出;任何没有 `(repo/path:start-end)` 锚点的论断,要么标记重问,要么丢弃。返回给用户的回答只留有引用的部分。

8. **增量重索引。** 每次 webhook 到达,计算符号级 diff。只重新嵌入文本变了的切块;import 变了的切块重算符号边。度量标准:2M 行代码舰队上,一次 50 文件的 push 在 60 秒内完成重索引。

9. **评测。** 标注 100 道跨仓库问题,给出黄金 file:line 答案。度量 MRR@10、nDCG@10、引用忠实度(带可验证锚点的论断占比),以及 p50/p99 延迟。

## 投入使用

```
$ code-rag ask "how is S3 multipart abort wired into our retry budget?"
[retrieve]  12 chunks dense + 7 chunks bm25, 16 unique after dedup
[rerank]    top-5 kept (cohere rerank-3)
[synth]     claude-sonnet-4.7, cache hit rate 68%, 2.1s
answer:
  Multipart aborts are triggered by `AbortMultipartOnFail` in
  services/uploader/retry.go:122-148, which decrements the per-bucket
  retry budget defined in config/budgets.yaml:34-51 ...
  citations: [services/uploader/retry.go:122-148, config/budgets.yaml:34-51,
              libs/s3client/multipart.ts:44-61]
```

## 交付

交付技能 `outputs/skill-codebase-rag.md`。给定一组仓库,它搭起摄入流水线、混合索引与查询智能体,对任意跨仓库问题返回带引用的答案。评分细则:

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | 检索质量 | 100 题保留集上的 MRR@10 与 nDCG@10 |
| 20 | 引用忠实度 | 带可验证 file:line 锚点的论断占比 |
| 20 | 延迟与规模 | 索引语料规模下 10k QPS 的 p95 查询延迟 |
| 20 | 增量索引正确性 | 50 文件提交从 git push 到可搜索的耗时 |
| 15 | 交互与答案排版 | 引用可点击、片段预览、追问引导 |
| **100** | | |

## 练习

1. 把 Voyage-code-3 换成自托管的 nomic-embed-code。度量 MRR@10 差值,报告启用重排序后差距是否收窄。

2. 往语料里注入 20% 生成代码(LLM 产的样板代码),重新评测。观察检索毒化。给 payload 加"generated"标记,下调这些命中的权重。

3. 在你的语料规模上基准对比 Qdrant 混合搜索与 pgvector + pgvectorscale。报告批大小为 1 时的 p99。

4. 加一个基于抽样的漂移检查:每周重跑 100 题评测,MRR@10 下跌超过 5% 时告警。

5. 扩展到跨语言符号解析:一个 Python 函数通过 gRPC 调一个 Go 服务。用符号图把它们连起来。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| AST 感知切块 | "函数级切分" | 沿 tree-sitter 节点边界切代码,而不是按固定 token 窗口 |
| 混合检索 | "稠密 + 稀疏" | BM25 与向量搜索并行跑,合并 top-k,再重排 |
| 交叉编码器重排 | "二阶段排序" | 把 (query, 候选) 成对打分的模型,比余弦更准 |
| Prompt 缓存 | "缓存系统提示" | 2026 年 Claude / OpenAI 的特性,重复前缀 token 最高省 90% |
| 符号图 | "代码图" | 跨文件、跨仓库的 import、调用、继承边 |
| 引用忠实度 | "有据可依的回答率" | 用户能点锚点、读引用区间亲自验证的论断占比 |
| 增量重索引 | "push 到可搜索的耗时" | 从 git push 到变更符号可查询的墙钟时间 |

## 延伸阅读

- [Sourcegraph Amp](https://ampcode.com) —— 生产级跨仓库代码智能
- [Sourcegraph Cody RAG architecture](https://sourcegraph.com/blog/how-cody-understands-your-codebase) —— 本项目的参考深挖文
- [Aider repo-map](https://aider.chat/docs/repomap.html) —— 基于 tree-sitter 的仓库排序视图
- [Augment Code enterprise graph](https://www.augmentcode.com) —— 商业化符号图 RAG
- [Qdrant hybrid search docs](https://qdrant.tech/documentation/concepts/hybrid-queries/) —— 参考实现
- [Voyage AI code embeddings](https://docs.voyageai.com/docs/embeddings) —— Voyage-code-3 细节
- [Cohere rerank-3](https://docs.cohere.com/reference/rerank) —— 交叉编码器参考
- [Pinterest MCP internal search](https://medium.com/pinterest-engineering) —— 内部平台参考
