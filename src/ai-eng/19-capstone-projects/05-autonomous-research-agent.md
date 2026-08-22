# 终局项目 05 —— 自治科研智能体(AI-Scientist 级别)

> Sakana 的 AI-Scientist-v2 发表了完整论文,Agent Laboratory 跑通了实验,Allen AI 公开了 trace。2026 年的形态是:在实验树上做"规划—执行—验证"树搜索,成本有预算,代码执行有沙箱,LaTeX 写作器带视觉反馈,评审团是自动化的 NeurIPS 风格阵容。本终局项目是造一个出来,端到端跑通,每篇论文成本控制在 30 美元以内,并且扛住 Sakana 记录在案的沙箱逃逸红队测试。

**类型:** 终局项目
**编程语言:** Python(智能体 + 沙箱),LaTeX(产出)
**前置要求:** 第 2 阶段(机器学习)、第 3 阶段(深度学习)、第 7 阶段(Transformer)、第 10 阶段(从零构建 LLM)、第 14 阶段(智能体)、第 15 阶段(自治系统)、第 16 阶段(多智能体)、第 18 阶段(安全)
**涉及阶段:** P0 · P2 · P3 · P7 · P10 · P14 · P15 · P16 · P18
**预计耗时:** 40 小时

## 问题

自治科研智能体在 2026 年跨过了一道门槛。Sakana AI 的 AI-Scientist-v2 登上 Nature,生成的论文通过了研讨会同行评审。ShinkaEvolve(ICLR 2026)把这条线扩展到假设演化。AMD 的 Agent Laboratory 发布了可复现的 trace。这些智能体并不神奇——它们只是在候选实验树上跑"规划—执行—验证"循环,配上成本上限、种子绑定的沙箱和自动化评审。手艺全在循环、预算和安全设计里。

你通过在一个窄领域(比如 100M 参数 Transformer 上的注意力稀疏消融)里实现这个循环来学会它。价值不在第一次跑就发现新东西,而在基础设施:树搜索、实验沙箱、写作—评审循环、红队报告。Sakana 团队记录过沙箱逃逸失败案例;你的智能体必须通过同样的红队测试。

## 概念

智能体是一个最佳优先树搜索。节点是实验规格:(假设、配置、代码、预期结果)。expand 步骤以小改动提出子节点(换优化器、调批大小、消融某个组件)。每个子节点在全新沙箱里跑,资源有硬上限。结果回流到打分函数,按(新颖度 × 质量 × 剩余预算)给节点排序。树长到预算耗尽为止,然后把最优分支写成论文。

写作器是多模态的。它生成 LaTeX 初稿、编译、渲染图表,再把渲染好的 PDF 喂回 Claude Opus 4.7 的视觉模式,就排版、图表可读性、论断与证据对齐度接受批评。评审团由五个 LLM 评委组成,按 NeurIPS 风格打分(新颖度、严谨度、清晰度、可复现性、影响力);平均分低于阈值,论文连同评审意见打回给写作器。

安全是承重墙。每个实验跑在 E2B 或 Daytona 沙箱里:无网络出口、墙钟时间有界、资源限额钉死。智能体的代码生成步骤要过策略层,拦截可能逃逸沙箱的系统调用。红队报告复现 Sakana 记录过的攻击面(fork 炸弹、文件系统逃逸、LLM 写出的网络调用)。

## 架构

```
seed idea + domain
      |
      v
  literature search (Semantic Scholar + OpenAlex + FAISS cache)
      |
      v
  LangGraph plan-execute-verify tree
      |
      v
  +--- expand node ----+      per-node sandbox
  |                    |      (E2B / Daytona)
  v                    v      resource caps
  child_1           child_k   no network egress
  |                    |      deterministic seeds
  v                    v
  run experiment       run experiment
  |                    |
  v                    v
  score nodes by (novelty, quality, budget)
      |
      v
  best branch -> LaTeX writer
      |
      v
  compile + vision critique (Opus 4.7 vision)
      |
      v
  reviewer ensemble (5 LLM judges, NeurIPS rubric)
      |
      v
  paper.pdf + review.md + trace.json
```

## 技术栈

- 编排:LangGraph,带检查点与人工审批门
- 树搜索:在实验节点上自定义最佳优先搜索(Sakana v2 的 AB-MCTS 风格)
- 沙箱:每实验一个 E2B,Docker-in-Docker 兜底;cgroups 卡资源上限
- 文献:Semantic Scholar Graph API + OpenAlex + 本地 FAISS 摘要缓存
- 写作器:LaTeX 模板 + Claude Opus 4.7(视觉模式)做图表批评与排版
- 评审团:5 个评委(Opus 4.7、GPT-5.4、Gemini 3 Pro、DeepSeek R1、Qwen3-Max)加权聚合
- 实验框架:PyTorch 2.5 跑物理实验,W&B 记日志
- 可观测:Langfuse 记智能体 trace,每篇论文 30 美元硬预算

```figure
ce-experiment-tree
```

## 动手构建

1. **种子与领域界定。** 拿到一个种子想法(如"研究 sub-1B Transformer 注意力图中的稀疏模式")。定义搜索空间:模型、数据集、算力预算。

2. **文献检索。** 查 Semantic Scholar + OpenAlex,取 50 篇最相关的高引论文;摘要本地缓存;生成一页领域综述。

3. **树脚手架。** 用种子假设初始化根节点。实现 `expand(node) -> children`,以小改动提子节点(每个子节点只改一处配置)。实现 `score(node)`,即新颖度 × 质量 × 预算的加权项。

4. **沙箱封装。** 每个实验以 `docker run --network=none --memory=8g --cpus=2 --pids-limit=256 --read-only`(或等价的 E2B 策略)运行。种子写入沙箱;输出以只读方式挂载出来。

5. **规划—执行—验证循环。** `plan` 提子节点;`execute` 跑沙箱,收集日志与指标;`verify` 对指标做单元检查(loss 降了吗?消融是否隔离出了该因素的影响?)。失败节点把失败原因存到树上。

6. **写作器。** 预算用完后,选出最优分支。用 matplotlib 渲染图表。把分支 trace 放进上下文,用 Claude Opus 4.7 生成 LaTeX 初稿,编译,把编译好的 PDF 喂回 Opus 4.7 视觉模式求批评,迭代。

7. **评审团。** 五个评委按 NeurIPS 风格细则给初稿打分(新颖度、严谨度、清晰度、可复现性、影响力)。均值 < 4.0/5 则连同批评意见打回写作器。最多重写 3 次,硬停止。

8. **红队。** 构建或集成一组针对沙箱的对抗任务:fork 炸弹、网络外泄尝试、文件系统逃逸、LLM 写出的 shell 元字符。确认全部被拦截,写出报告。

9. **可复现性。** 每篇论文附带:树搜索 trace JSON、种子、W&B 运行链接、沙箱配置,以及一份能端到端复现的 README。

## 投入使用

```
$ ai-scientist run --seed "attention sparsity in sub-1B transformers" --budget 30
[lit]    50 papers, digest in 12s
[tree]   expanded 8 nodes, budget 12/30
[exec]   node #3 sparsity=top-8, loss=2.83 (best so far)
[exec]   node #6 sparsity=top-4, loss=3.12 (worse)
[exec]   ...
[tree]   chose branch rooted at node #3 (novelty 0.62, quality 0.81)
[write]  LaTeX draft v1 complete
[vision] critique: figure 2 legend too small, claim-evidence ok
[write]  draft v2 after 3 edits
[review] mean 4.2/5 (novelty 3.9, rigor 4.3, clarity 4.1, repro 4.5, impact 4.2)
[done]   paper.pdf + review.md + trace.json     $28.40 spent
```

## 交付

`outputs/skill-ai-scientist.md` 是交付物。给定种子想法 + 领域 + 30 美元预算,它跑完整条流水线,产出一篇可评审的论文和一份可复现包。

| 权重 | 评分项 | 衡量方式 |
|:-:|---|---|
| 25 | 论文质量 | 对照已发表研讨会论文做盲审评分 |
| 20 | 实验严谨度 | 基线、种子、消融齐全;每条论断都有结果表中的单元格支撑 |
| 20 | 成本与算力纪律 | 每篇 30 美元上限严格执行,Langfuse 全程 trace |
| 20 | 安全 | 沙箱红队测试通过;网络策略与熔断开关经过验证 |
| 15 | 可复现性 | 一条命令、相同种子可复现论文 |
| **100** | | |

## 练习

1. 在同一领域用三个不同种子想法跑流水线。对比树搜索哪些部分重叠,找出重复的浪费算力。

2. 在预计花费超 5 美元的节点执行前加一道人工审批门。度量总成本下降多少。

3. 把评审团换成单个评委。在已知劣质论文的保留集上度量误收率。

4. 引入网络外泄红队测试:智能体写出试图 `curl` 外部地址的代码。确认 `--network=none` 策略拦截成功,记录该尝试。

5. 拿你的树搜索与扁平随机基线对比(同预算、无扩展策略)。报告新颖度 × 质量的增益。

## 关键术语

| 术语 | 人们常说的是 | 实际含义 |
|------|-----------------|------------------------|
| 树搜索 | "AB-MCTS 式扩展" | 在实验节点上做最佳优先探索,打分=新颖度×质量×预算 |
| 沙箱 | "实验隔离" | 无网络、CPU/内存有界、种子钉死、输入只读的容器 |
| 视觉批评 | "渲染后再读" | 论文编译成 PDF,喂回 VLM 批评排版与论断-证据对齐 |
| 评审团 | "自动化同行评审" | 多个 LLM 评委按 NeurIPS 细则打分;加权聚合决定流水线是否放行 |
| 新颖度分 | "这够新吗?" | 对过于接近 50 篇文献缓存的做法扣分的启发式 |
| 成本上限 | "美元预算" | 每篇论文总花费硬顶;Langfuse 计数器 + 运行前预估 |
| 红队 | "沙箱逃逸审计" | 策略有误时就能逃出沙箱的对抗任务 |

## 延伸阅读

- [Sakana AI-Scientist-v2 repository](https://github.com/SakanaAI/AI-Scientist-v2) —— 生产级科研智能体参考实现
- [Sakana AI-Scientist-v1 paper (arXiv:2408.06292)](https://arxiv.org/abs/2408.06292) —— 最初的方法论
- [ShinkaEvolve (Sakana ICLR 2026)](https://sakana.ai) —— 演化式扩展
- [Agent Laboratory (AMD)](https://github.com/SamuelSchmidgall/AgentLaboratory) —— 多角色科研实验室框架
- [LangGraph documentation](https://langchain-ai.github.io/langgraph/) —— 参考编排层
- [Semantic Scholar Graph API](https://api.semanticscholar.org/) —— 文献检索
- [E2B sandboxes](https://e2b.dev) —— 实验隔离参考
- [NeurIPS reviewer guidelines](https://neurips.cc/Conferences/2026/Reviewer-Guidelines) —— 评审团所编码的评分细则
