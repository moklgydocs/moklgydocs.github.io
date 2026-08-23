# 终局项目 08 —— 面向受监管行业的生产级 RAG 聊天机器人

> Harvey、Glean、Mendable、LlamaCloud 在 2026 年跑的都是同一套生产形态:用 docling 或 Unstructured 摄入,ColPali 处理视觉内容,混合检索,bge-reranker-v2-gemma 重排,Claude Sonnet 4.7 配 prompt 缓存做合成(命中率 60–80%),Llama Guard 4 加 NeMo Guardrails 把守,Langfuse 加 Phoenix 监控,RAGAS 在 200 题黄金集上打分。在受监管领域(法律、临床、保险)造一个出来——通过黄金集、红队和漂移看板,就是本终局项目。

**类型:** 终局项目
**编程语言:** Python(流水线 + API),TypeScript(聊天 UI)
**前置要求:** 第 5 阶段(NLP)、第 7 阶段(Transformer)、第 11 阶段(LLM 工程)、第 12 阶段(多模态)、第 17 阶段(基础设施)、第 18 阶段(安全)
**涉及阶段:** P5 · P7 · P11 · P12 · P17 · P18
**预计耗时:** 30 小时

## 问题

受监管领域的 RAG(法律合同、临床试验方案、保险条款)是 2026 年出货最多的生产形态,因为 ROI 明摆着,风险也具体。Harvey(Allen & Overy)为法律行业造了它,Mendable 做的是开发者文档口味,Glean 覆盖企业搜索。这套模式是:高保真摄入、混合检索加重排、带引用强制与 prompt 缓存的合成、多层安全防护,以及持续的漂移监控。

难点不在模型,而在:司法辖区感知的合规(HIPAA、GDPR、SOC2)、引用级可审计性、成本控制(prompt 缓存命中率高时省 60–90%)、用 RAGAS 忠实度做幻觉检测,以及源文档更新了索引却没跟上时的漂移检测。本终局项目要求你把这些全部交付,配一个 200 题黄金集和一套红队测试。

## 概念

流水线分两侧。**摄入侧**:docling 或 Unstructured 解析结构化文档;ColPali 处理视觉富文档;切块带上摘要、标签与角色访问标记。向量进 pgvector + pgvectorscale(5000 万向量以下)或 Qdrant Cloud;稀疏 BM25 并行。**对话侧**:LangGraph 管记忆与多轮;每次查询跑混合检索,bge-reranker-v2-gemma-2b 重排,Claude Sonnet 4.7(带 prompt 缓存)合成,输出过 Llama Guard 4 与 NeMo Guardrails,产出带引用锚点的回答。

评测栈有四层。**黄金集**(200 题带引用的标注问答)测正确性。**红队**(越狱、PII 提取尝试、超域问题)测安全。**RAGAS** 逐轮自动算忠实度 / 答案相关性 / 上下文精度。**漂移看板**(Arize Phoenix)每周盯检索质量与幻觉分。

Prompt 缓存是成本杠杆。Claude 4.5+ 与 GPT-5+ 支持缓存系统提示 + 检索上下文。命中率 60–80% 时,单次查询成本降 3–5 倍。流水线必须按"前缀稳定"来设计(系统提示 + 重排上下文放最前),才能拿到高命中率。

## 架构

```
documents (contracts, protocols, policies)
      |
      v
docling / Unstructured parse + ColPali for visuals
      |
      v
chunks + summaries + role-labels + jurisdiction tags
      |
      v
pgvector + pgvectorscale  +  BM25 (Tantivy)
      |
query + role + jurisdiction
      |
      v
LangGraph conversational agent
   +--- retrieve (hybrid)
   +--- filter by role + jurisdiction
   +--- rerank (bge-reranker-v2-gemma-2b or Voyage rerank-2)
   +--- synthesize (Claude Sonnet 4.7, prompt cached)
   +--- guard (Llama Guard 4 + NeMo Guardrails + Presidio output PII scrub)
   +--- cite + return
      |
      v
eval:
  RAGAS faithfulness / answer_relevance / context_precision (online)
  Langfuse annotation queue (sampled)
  Arize Phoenix drift (weekly)
  red team suite (pre-release)
```

## 技术栈

- 摄入:Unstructured.io 或 docling 处理结构化文档;ColPali 处理视觉富 PDF
- 向量库:5000 万向量以下用 pgvector + pgvectorscale;否则 Qdrant Cloud
- 稀疏:Tantivy BM25,分字段加权
- 编排:LlamaIndex Workflows(摄入)+ LangGraph(对话)
- 重排器:自托管 bge-reranker-v2-gemma-2b 或托管 Voyage rerank-2
- LLM:Claude Sonnet 4.7 配 prompt 缓存;自托管 Llama 3.3 70B 兜底
- 评测:RAGAS 0.2 在线评测,DeepEval 跑幻觉与越狱套件
- 可观测:自托管 Langfuse 带标注队列;Arize Phoenix 做漂移
- 护栏:Llama Guard 4 输入/输出分类器,NeMo Guardrails v0.12 策略,Presidio PII 清洗
- 合规:切块带角色访问标记;GDPR/HIPAA 司法辖区标签

```figure
canary-rollout
```

## 动手构建

1. **摄入。** 用 Unstructured 或 docling 解析语料(认真做要 1000–10000 篇文档)。扫描件/视觉重页面走 ColPali。产出带摘要、角色标记、辖区标签的切块。

2. **索引。** 稠密嵌入(Voyage-3 或 Nomic-embed-v2)进 pgvector + pgvectorscale。Tantivy 建 BM25 侧索引。角色与辖区过滤器放进 payload。

3. **混合检索。** 先按角色+辖区过滤;再并行稠密 + BM25;RRF 融合;top-20 进重排器;top-5 进合成。

4. **带 prompt 缓存的合成。** 系统提示 + 静态策略放缓存头;重排上下文作为缓存延伸;用户问题作不缓存的后缀。稳态目标命中率 60–80%。

5. **护栏。** 输入过 Llama Guard 4;NeMo Guardrails 拦截超域问题或政策禁止话题;Presidio 清洗输出中的意外 PII;引用强制后置过滤。

6. **黄金集。** 领域专家标注 200 对问答(答案 + 引用)。按引用精确匹配、答案正确性、忠实度(RAGAS)给智能体打分。

7. **红队。** 50 条对抗提示:越狱(PAIR、TAP)、PII 外泄尝试、超域、跨辖区泄漏。按通过/失败与严重度记分。

8. **漂移看板。** Arize Phoenix 每周跟踪检索质量(nDCG、引用忠实度)。跌 5% 告警。

9. **成本报告。** Langfuse:prompt 缓存命中率、每查询 token 数、分阶段的 $/query 拆解。

## 投入使用

```
$ chat --role=analyst --jurisdiction=GDPR
> what is the data-retention obligation for EU user profiles under our contract?
[retrieve]  hybrid top-20 filtered to GDPR + analyst-role
[rerank]    top-5 kept
[synth]     claude-sonnet-4.7, cache hit 74%, 0.8s
answer:
  The contract (Section 12.4, Master Services Agreement dated 2024-03-11)
  obligates EU user profile deletion within 30 days of termination per GDPR
  Article 17. The DPA amendment (DPA-v2.1, Section 5) extends this to 14 days
  for "restricted" category data.
  citations: [MSA-2024-03-11 s12.4, DPA-v2.1 s5]
```

## 交付

`outputs/skill-production-rag.md` 描述交付物:一个部署在受监管领域的聊天机器人,带合规标签,通过评分细则,挂上实时漂移监控。

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | RAGAS 忠实度 + 答案相关性 | 黄金集(200 问答)上的在线得分 |
| 20 | 引用正确性 | 带可验证源锚点的答案占比 |
| 20 | 护栏覆盖率 | Llama Guard 4 通过率 + 越狱套件结果 |
| 20 | 成本/延迟工程 | prompt 缓存命中率、p95 延迟、$/query |
| 15 | 漂移监控看板 | Phoenix 实时看板,带周度检索质量趋势 |
| **100** | | |

## 练习

1. 建第二个不同辖区的语料切片(如 HIPAA 与 GDPR 并列)。用 20 题跨辖区探针,演示角色+辖区过滤如何阻止交叉泄漏。

2. 度量一周生产流量下的 prompt 缓存命中率。找出哪些查询破坏了缓存前缀,重构之。

3. 加多轮记忆,用 10k token 摘要缓冲。度量对话变长时忠实度是否下降。

4. 把 Claude Sonnet 4.7 换成自托管 Llama 3.3 70B。度量 $/query 与忠实度差值。

5. 加"不确定"模式:重排最高分低于阈值时,智能体说"我没有可信的引用"而不是硬答。度量虚假置信度的下降。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| Prompt 缓存 | "缓存系统提示+上下文" | Claude/OpenAI 特性:缓存前缀 token 命中时省 60–90% |
| RAGAS | "RAG 评测器" | 自动评分忠实度、答案相关性、上下文精度 |
| 黄金集 | "标注评测集" | 200+ 题专家标注问答带引用;即 ground truth |
| 辖区标签 | "合规标签" | 挂在切块上的 GDPR/HIPAA/SOC2 范围;由检索过滤强制执行 |
| 引用忠实度 | "有据可依的回答率" | 有可检索源片段支撑的论断占比 |
| 漂移 | "检索质量衰减" | nDCG 或引用分的周度变化;告警阈值 5% |
| 红队 | "对抗评测" | 发布前的越狱、PII 提取、超域探针 |

## 延伸阅读

- [Harvey AI](https://www.harvey.ai) —— 法律生产栈参考
- [Glean enterprise search](https://www.glean.com) —— 企业级规模 RAG 参考
- [Mendable documentation](https://mendable.ai) —— 开发者文档 RAG 参考
- [LlamaCloud Parse + Index](https://docs.cloud.llamaindex.ai/llamaparse/getting_started) —— 托管摄入
- [Anthropic prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) —— 成本杠杆参考
- [RAGAS 0.2 documentation](https://docs.ragas.io/) —— 权威 RAG 评测框架
- [Arize Phoenix](https://github.com/Arize-ai/phoenix) —— 漂移可观测参考
- [Llama Guard 4](https://www.llama.com/docs/model-cards-and-prompt-formats/llama-guard-4/) —— 2026 安全分类器
- [NeMo Guardrails v0.12](https://docs.nvidia.com/nemo-guardrails/) —— 策略护栏框架
