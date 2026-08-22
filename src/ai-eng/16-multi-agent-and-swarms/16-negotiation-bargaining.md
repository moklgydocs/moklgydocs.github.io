# 谈判与讨价还价

> 智能体要就资源、价格、任务分配和条款进行谈判。2026 年的基准测试组合已经很清楚了:NegotiationArena(arXiv:2402.05863)显示 LLM 可以通过人设操纵("我很急")把收益提高约 20%;"Measuring Bargaining Abilities"(arXiv:2402.15813)显示买方比卖方难当,而且堆规模无济于事——他们的 **OG-Narrator**(确定性出价生成器 + LLM 叙述者)把成交率从 26.67% 推到 88.88%;大规模自主谈判竞赛(arXiv:2503.06416)跑了约 18 万次谈判,发现**隐藏思维链**的智能体靠对对手掩盖推理而获胜;Bhattacharya et al. 2025 在哈佛谈判项目指标上的排名是:Llama-3 最有效、Claude-3 最好斗、GPT-4 最公平。本课实现 Contract Net Protocol(FIPA 的祖先,见第 02 课),接一个 LLM 风格的买方/卖方,跑一个 OG-Narrator 式的分解,并测量每种结构性选择对成交率的影响。

**类型:** 学习 + 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 16 阶段 · 02(FIPA-ACL 遗产)、第 16 阶段 · 09(并行蜂群网络)
**预计耗时:** 约 75 分钟

## 问题

两个智能体需要就一个价格达成一致。如果只给它们纯语言提示词放任自流,2024-2026 年的 LLM 成交率低得惊人(arXiv:2402.15813 中参数卡得很紧的讨价还价场景约 27%)。堆规模解决不了:GPT-4 在讨价还价上并不比 GPT-3.5 有结构性优势;它只是更擅长讨价还价的*语言*。

根源在于 LLM 把两份工作混在了一起——决定出价和叙述出价。OG-Narrator 把这两者拆开:确定性的出价生成器计算数字动作;LLM 只负责叙述。成交率跳到约 89%。

这呼应了经典多智能体研究的一个发现:把机制与通信层解耦就能赢。Contract Net Protocol(FIPA,1996;Smith,1980)是任务市场的参考机制。把一个 LLM 插进叙述槽位,你就得到了一个现代的 LLM 驱动任务市场。

## 概念

### Contract Net,一段话讲完

Smith 1980 年的 Contract Net Protocol:**manager** 广播 **call for proposals(cfp)**;**bidder** 用包含出价的 **propose** 消息回应;manager 选出中标者,给赢家发 **accept-proposal**,给输家发 **reject-proposal**。赢家执行工作。可选消息:**refuse**(bidder 拒绝出价)。FIPA 把它标准化为 `fipa-contract-net` 交互协议。

### 为什么 OG-Narrator 能赢

"Measuring Bargaining Abilities of Language Models"(arXiv:2402.15813)观察到:

- LLM 经常破坏讨价还价规则(报出莫名其妙的价格、无视对方的 ZOPA)。
- 锚定得很差(接受糟糕的首次报价;还价还的是象征性数字而非战略性数字)。
- 单靠堆规模修不好这些。更大的模型写出更可信的语言,战略性错误却差不多。

OG-Narrator 的分解:

```
           ┌──────────────────┐        ┌──────────────────┐
  state  → │ offer generator  │ price → │  LLM narrator    │ → message
           │  (deterministic) │        │  (writes the     │
           │                  │        │   human-style    │
           └──────────────────┘        │   accompaniment) │
                                       └──────────────────┘
```

出价生成器是经典谈判策略:Rubinstein 讨价还价模型、Zeuthen 策略,或简单的价格上一报还一报。LLM 负责叙述。消息里既有确定性的价格,也有自然语言的包装。

成交率之所以跳升,是因为:

- 价格始终落在讨价还价区间内。
- 锚点是战略性的,不是情绪性的。
- LLM 在做它擅长的事:写作。

### NegotiationArena 的发现

arXiv:2402.05863 是权威基准。头条发现:

- LLM 可以通过扮演人设("我周五前必须把这东西卖出去")把收益提高约 20%——人设操纵是真实有效的战术。
- 公平/合作型智能体会被对抗型智能体剥削;防御需要明确的对抗姿态。
- 对称配对在基准约 40% 的场景里收敛到不公平的结果。

这不是"LLM 不擅长谈判",而是"LLM 谈判起来太像人了,包括那些可被剥削的部分"。

### 思维链隐藏

大规模自主谈判竞赛(arXiv:2503.06416)在多种 LLM 策略之间跑了约 18 万次谈判。赢家都对对手隐藏了自己的推理:

- 如果一个智能体在公开可见的草稿板上打出"我最多出到 $75;我的保留价是 $70",对手就会读到。
- 赢家私下计算策略;输出通道里只有出价和最低限度的必要叙述。

这是 2026 年对经典博弈论(Aumann 1976 关于理性与信息)的一次回响:暴露你的私人估值会损失收益。LLM 对此没有直觉,它们会开心地把保留价打在推理轨迹里,而这些轨迹对对手可见。

工程要点:把私有草稿板上下文和公开消息上下文分开。这不是可选项。

### Bhattacharya et al. 2025 —— 模型排名

在哈佛谈判项目指标上(原则性谈判、尊重 BATNA、利益互惠):

- **Llama-3** 达成交易最有效(成交率 + 收益)。
- **Claude-3** 是最好斗的谈判者(高锚点、晚让步)。
- **GPT-4** 最公平(各配对间收益方差最小)。

这是 2025 年的快照。重点不是 2026 年 4 月哪个模型赢——而是不同基座模型有持续稳定的谈判风格。异构集成(第 15 课)把这当作一种多样性来源。

### 用 Contract Net + LLM 做任务分配

Contract Net 在 LLM 多智能体中的现代复用:

1. Manager 智能体把任务分解成若干单元。
2. 向 worker 智能体广播带任务描述的 `cfp`。
3. 每个 worker 返回一个报价:`(price, eta, confidence)`,其中 price 可以是 token、算力单元或美元。
4. Manager 选出中标者(单个或多个,取决于任务)并授予任务。
5. 落选的 worker 可以自由去竞标其他任务。

这套机制可以扩展到 100 个以上的 worker,因为协调方式是"广播-响应",而不是同步聊天。生产中有使用:Microsoft Agent Framework 的编排模式、一些 LangGraph 实现。

### LLM-Stakeholders 交互式谈判

NeurIPS 2024(https://proceedings.neurips.cc/paper_files/paper/2024/file/984dd3db213db2d1454a163b65b84d08-Paper-Datasets_and_Benchmarks_Track.pdf)引入了带**秘密分数**和**最低接受阈值**的多方可评分博弈。每个利益相关者有私有效用;LLM 必须从消息中推断它们。这是把两方讨价还价推广到 N 方联盟形成。与 worker 能力异构的生产任务市场相关。

### 叙述 vs 机制法则

纵观 2024-2026 年所有谈判基准,一以贯之的工程法则是:

> 让 LLM 叙述。不要让 LLM 计算出价。

如果出价需要是一个数字(价格、ETA、数量),就用谈判状态确定性地算出来,让 LLM 生成包装话术。如果出价需要是一个提案结构(任务分解、角色分配),可以让 LLM 起草,但发出之前必须过 schema 校验和约束检查。

```figure
a5-og-narrator
```

## 动手构建

`code/main.py` 实现了:

- `ContractNetManager`、`ContractNetTask`、`Bid` —— manager + bidder,广播 cfp、收集提案、授予任务。
- `og_narrator_bargain(state, rng)` —— OG-Narrator 买方:确定性的 Zeuthen 式向中点让步。
- `seller_response(state, rng)` —— 确定性的卖方还价策略(两种风格共用的结构性基准)。
- `naive_llm_bargain(state, rng)` —— 模拟全 LLM 讨价还价者:出价方差大,经常落在 ZOPA 之外。
- 测量:1000 次试验的成交率,每次试验重新采样保留价。

运行:

```
python3 code/main.py
```

预期输出:naive-LLM 成交率约 65-75%;OG-Narrator 成交率约 85-95%;15-25 个点的差距就是把出价生成从叙述中分解出来的结构性优势。外加一个三个 bidder 一个任务的 Contract Net 任务市场分配示例。

## 投入使用

`outputs/skill-bargainer-designer.md` 设计一套讨价还价协议:谁生成出价(确定性还是 LLM)、谁叙述、私有草稿板如何与公开消息隔离、成交率如何监控。

## 交付

生产环境讨价还价检查清单:

- **隔离草稿板。** 私有状态永远不进入对手的上下文。这条没有商量余地。
- **确定性出价生成。** 价格、数量、ETA:算出来,不要靠提示词生成。
- **校验所有入站出价**,过 schema。在协议边界拒绝 ZOPA 之外的报价。
- **限制轮数。** 最多 3-5 轮;陷入僵局就升级给调解方。
- **持续测量成交率和收益方差。** 成交率下滑是一个症状——往往是提示词漂移或对手侧攻击。
- **记录所有被拒绝的提案**及其确定性理由。对 Contract Net 的 manager 来说,落选的 bidder 需要知道为什么。

## 练习

1. 运行 `code/main.py`。确认 OG-Narrator 在成交率上击败 naive-LLM。差多少?
2. 实现**基于人设的收益提升**(arXiv:2402.05863)——买方只在叙述中扮演"这周必须买到"的人设,出价生成器不变。成交率或收益会变化吗?
3. 实现思维链**隐藏**:维护一个不传给对手的私有草稿板字符串。如果你不小心泄漏了它(通过交换两个通道来模拟)会发生什么?
4. 把 Contract Net 扩展成带保留价的 N 方竞标。当所有出价都超过保留价时,manager 如何在最低价和最高质量之间抉择?你选哪种授予规则,为什么?
5. 阅读 Bhattacharya et al. 2025 关于哈佛谈判项目指标的论文。实现两个风格不同的讨价还价者(好斗 vs 公平)。在对称和非对称配对下测量收益方差。

## 关键术语

| 术语 | 大家嘴里的说法 | 实际含义 |
|------|----------------|----------|
| Contract Net | "任务市场" | Smith 1980,FIPA 1996。cfp + propose + accept/reject。任务市场的标准范式。 |
| ZOPA | "可能成交区间" | 买方上限与卖方下限的重叠区。落在区间外的报价不可能成交。 |
| BATNA | "谈判协议的最佳替代方案" | 这笔交易谈崩时你的退路。它决定你的保留价。 |
| OG-Narrator | "出价生成器 + 叙述者" | 一种分解:确定性出价,LLM 叙述。 |
| Zeuthen 策略 | "风险最小化让步" | 经典出价生成器,按风险限度让步。 |
| Rubinstein 讨价还价 | "交替出价均衡" | 带折现的无限期讨价还价的博弈论模型。 |
| CoT 隐藏 | "藏起你的推理" | arXiv:2503.06416 的赢家保留私有草稿板;公开通道只显示出价。 |
| 人设操纵 | "情绪化姿态" | arXiv:2402.05863:绝望/紧迫人设带来约 20% 的收益提升。 |

## 延伸阅读

- [NegotiationArena](https://arxiv.org/abs/2402.05863) —— 基准;人设操纵与剥削发现
- [Measuring Bargaining Abilities of Language Models](https://arxiv.org/abs/2402.15813) —— OG-Narrator 与"买方比卖方难"的结果
- [Large-Scale Autonomous Negotiation Competition](https://arxiv.org/abs/2503.06416) —— 约 18 万次谈判;思维链隐藏获胜
- [LLM-Stakeholders Interactive Negotiation (NeurIPS 2024)](https://proceedings.neurips.cc/paper_files/paper/2024/file/984dd3db213db2d1454a163b65b84d08-Paper-Datasets_and_Benchmarks_Track.pdf) —— 带秘密效用的多方可评分博弈
- [Smith 1980 —— The Contract Net Protocol](https://ieeexplore.ieee.org/document/1675516) —— 经典机制,IEEE Transactions on Computers
