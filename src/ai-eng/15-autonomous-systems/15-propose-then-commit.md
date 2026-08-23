# 人在环中:先提议,后提交

> 2026 年关于人审(HITL)的共识是具体的。它不是"智能体问一句,用户点个 Approve",而是先提议后提交(propose-then-commit):提议的动作带着幂等键持久化到 durable 存储;连同意图、数据血缘、触及的权限、爆炸半径和回滚计划一起呈给评审人;只有在明确确认之后才提交;执行之后再验证副作用确实发生。LangGraph 的 `interrupt()` 加 PostgreSQL 检查点、Microsoft Agent Framework 的 `RequestInfoEvent`、Cloudflare 的 `waitForApproval()`,实现的都是同一个形状。最典型的失败模式是橡皮图章式审批:"Approve?" 不经审查就被点掉。有记录的缓解办法,是带显式检查清单的问答式确认。

**类型:** 学习
**编程语言:** Python(标准库,带幂等的先提议后提交状态机)
**前置要求:** 第 15 阶段 · 12(持久化执行),第 15 阶段 · 14(绊线)
**预计耗时:** 约 60 分钟

## 问题

智能体要做一个动作,用户必须决定:批,还是不批。如果这个决定是瞬间做出的,那它多半不是审查;如果它是结构化的,那它慢,但可信。工程问题是:如何让结构化审查成为阻力最小的那条路。

2023 年时代的 HITL 模式是一个同步 prompt:"智能体要给 X 发邮件,正文 Y——批准?"用户点了 Approve,所有人都觉得系统安全了。实践中,这个界面被重度橡皮图章化:用户批得飞快,审批几乎预测不了什么;等智能体出了事,审计轨迹上是一长串用户根本不记得批过的记录。

2026 年的模式——先提议后提交——把 HITL 搬到持久基座上,挂上结构化元数据,并要求明确的提交。每一个托管智能体 SDK 都有一个版本:LangGraph `interrupt()`、Microsoft Agent Framework `RequestInfoEvent`、Cloudflare `waitForApproval()`。API 名字不同,形状相同。

## 概念

### 先提议后提交的状态机

1. **提议(Propose)。** 智能体产出一个提议动作,持久化到 durable 存储(PostgreSQL、Redis、Durable Object)。内容包括:
   - 意图(智能体为什么做这件事)
   - 数据血缘(是哪份来源内容引出了这个提议)
   - 触及的权限(哪些作用域 / 文件 / 端点)
   - 爆炸半径(最坏情况是什么)
   - 回滚计划(提交之后,怎么撤销)
   - 幂等键(每个提议唯一;重复提交返回同一条记录)
2. **呈递(Surface)。** 评审人看到带全部元数据的提议。评审人是人(不是智能体审自己)。
3. **提交(Commit)。** 明确确认,动作执行。
4. **验证(Verify)。** 执行之后,把副作用读回来确认。验证失败,系统进入已知的坏状态,告警介入。

### 幂等键

没有幂等键,瞬时故障后的重试可能让已批准的动作执行两次。具体例子:用户批准了"从 A 转 $100 到 B",网络抖了一下,工作流重试——用户只批了一次,转账却执行了两次。幂等键把批准绑定到唯一的副作用上;第二次执行是空操作。

这与 Stripe 和 AWS API 使用的幂等模式相同。Microsoft Agent Framework 的文档明确把它复用于智能体审批。

### 持久化:为什么审批要比进程活得久

审批等候室是一块不归属智能体的状态。工作流是暂停的(第 12 课),批准到达时,工作流从那个点精确恢复。这就是为什么 LangGraph 把 `interrupt()` 与 PostgreSQL 检查点配对,而不是只用内存状态——两天后才来的批准,照样能找到完好无损的工作流。

### 橡皮图章审批与问答式确认

HITL 的默认 UI("Approve" / "Reject" 按钮)产出的是没有真审查的快审批。有记录的缓解:一个问答式检查清单,在 Approve 按钮可用之前,评审人必须对具体问题给出肯定回答。具体形状:

- "你理解这个动作触及什么资源吗?[ ]"
- "你确认爆炸半径可以接受吗?[ ]"
- "失败时你有回滚计划吗?[ ]"

这不是为了官僚而官僚——它是一个强制函数。勾不了这些框的评审人,要么要求澄清(升级),要么拒绝(安全默认)。Anthropic 的智能体安全研究明确把清单驱动的 HITL 列为对橡皮图章审批模式的缓解。

### 什么算"有后果"

不是每个动作都要先提议后提交。2026 年的指引:

- **有后果动作(永远人审)**:不可逆写入、金融交易、对外通信、生产数据库变更、破坏性文件系统操作。
- **可逆动作(有时人审)**:本地文件编辑、预发环境变更、回滚路径清晰的可逆写入。
- **读取与检查(永不人审)**:读文件、列资源、调只读 API。

### 动作后验证

"提交跑完了"不等于"副作用发生了"。网络分区和竞态可以造出一个"自以为成功"的工作流,而后端其实没有持久化。验证步骤在提交后重读目标资源来确认。这与数据库事务的 `RETURNING` 子句、AWS `PutObject` 之后再 `GetObject`,是同一个模式。

### 欧盟 AI 法案第 14 条

第 14 条要求欧盟境内高风险 AI 系统具备有效的人类监督。"有效"不是摆设——监管语言明确排除橡皮图章模式。在 Microsoft Agent Governance Toolkit 的合规文档里,带问答式确认的先提议后提交,是能扛住第 14 条审查的形状。

```figure
mx-propose-then-commit
```

## 投入使用

`code/main.py` 用标准库 Python 实现一个先提议后提交状态机。durable 存储是一个 JSON 文件,幂等键是 (thread_id, action_signature) 的哈希。驱动程序模拟三种情形:干净的批准流、瞬时故障后的重试(不得重复执行),以及橡皮图章默认流 vs 问答式确认流的对比。

## 交付

`outputs/skill-hitl-design.md` 评审一个 HITL 工作流提案是否符合先提议后提交的形状,并标出缺失的元数据、幂等、验证或问答式确认层。

## 练习

1. 运行 `code/main.py`。确认已批准提议的重试会命中持久记录而不重复执行。然后把时间戳加进幂等键,展示重试变成了重复执行。

2. 给提议记录加 `rollback` 字段。模拟一个验证步骤失败的执行,展示回滚自动触发。

3. 读 Microsoft Agent Framework 的 `RequestInfoEvent` 文档。找出 API 包含而玩具引擎缺的一个元数据字段。补上它,并解释它防的是什么。

4. 为一个具体动作(如"发到公开 Twitter 账号")设计问答式检查清单。评审人必须回答哪三个问题?为什么是这三个?

5. 挑一个同步 "Approve?" prompt 就够用的情形(不需要 durable 存储)。解释为什么,并说出你在接受哪一类风险。

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|---|---|---|
| 先提议后提交(Propose-then-commit) | "两阶段审批" | 持久化提议 + 明确提交 + 验证 |
| 幂等键(Idempotency key) | "重试安全的令牌" | 每个提议唯一;第二次执行是空操作 |
| 数据血缘(Data lineage) | "从哪来的" | 引出该提议的具体来源内容 |
| 爆炸半径(Blast radius) | "最坏情况" | 动作出错时的影响范围 |
| 橡皮图章(Rubber-stamp) | "秒批" | 不经真审查就点掉 "Approve" |
| 问答式确认(Challenge-and-response) | "强制清单" | 评审人必须对具体问题给出肯定回答 |
| RequestInfoEvent | "MS Agent Framework 原语" | 带结构化元数据的持久 HITL 请求 |
| `interrupt()` / `waitForApproval()` | "框架原语" | LangGraph / Cloudflare 的同款形状 |

## 延伸阅读

- [Microsoft Agent Framework — Human in the loop](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop) ——`RequestInfoEvent`、持久审批
- [Cloudflare Agents — Human in the loop](https://developers.cloudflare.com/agents/concepts/human-in-the-loop/) ——`waitForApproval()` 与 Durable Objects
- [Anthropic — Measuring agent autonomy in practice](https://www.anthropic.com/research/measuring-agent-autonomy) ——HITL 作为长程风险的缓解
- [EU AI Act — Article 14: Human oversight](https://artificialintelligenceact.eu/article/14/) ——高风险系统的监管基线
- [Anthropic — Claude's Constitution (January 2026)](https://www.anthropic.com/news/claudes-constitution) ——围绕监督的宪法框架
