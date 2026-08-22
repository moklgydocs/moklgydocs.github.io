# FIPA-ACL 与言语行为理论的传承

> 在 MCP 之前,在 A2A 之前,先有 FIPA-ACL。2000 年,IEEE 智能物理体基金会(FIPA)批准了一种智能体通信语言:二十个施为语(performatives)、两种内容语言,以及一组交互协议——合同网、订阅/通知、request-when。它从工业界淡出,是因为本体开销对 Web 来说太重;但 LLM 复兴的多智能体系统,正在悄悄重新实现同样的想法,只是不要形式语义:JSON 契约顶替了施为语,自然语言顶替了本体。本课认真读一遍 FIPA-ACL,好让你看清:2026 年的哪些协议决策是重新发明,哪些是真正的新意,以及眼下这波浪潮将在何处重新发现 2000 年代早已解决的问题。

**类型:** 学习
**编程语言:** Python(标准库)
**前置要求:** 第 16 阶段 · 01(为什么要多智能体)
**预计耗时:** 约 60 分钟

## 问题

2026 年的智能体协议版图很热闹:MCP 管工具,A2A 管智能体,ACP 管企业审计,ANP 管去中心化信任,NLIP 管自然语言内容,外加 CA-MCP 和二十多个研究提案。每份规范都自称奠基之作。

诚实的读法是:它们大多在重新发现一棵非常具体的二十年前的决策树。Austin(1962)和 Searle(1969)的言语行为理论告诉我们"话语即行动";KQML(1993)把它变成了线上协议;FIPA-ACL(2000 年批准)产出了参考标准化:二十个施为语、内容语言 SL0/SL1、合同网与订阅-通知的交互协议。JADE 和 JACK 是 Java 参考平台。这场努力在 2010 年前后消退,因为本体开销太重,而 Web 赢了。

当你看 MCP 的 `tools/call`、A2A 的任务生命周期或 CA-MCP 的共享上下文存储时,你看到的就是 FIPA 决策的 JSON 原生温和翻版。了解这段传承告诉你两件事:哪些新"创新"其实是重新发明,以及新规范将重新发现哪些旧的失败模式。

## 概念

### 言语行为,一段话讲完

Austin 注意到,有些句子不描述世界——它们改变世界。"我承诺。""我请求。""我宣布。"他把这叫做施为话语。Searle 形式化为五类:断言式、指令式、承诺式、表达式、宣告式。KQML(Finin 等,1993)让它对软件智能体可操作:一条消息 = 一个施为语(动作)+ 内容(动作所关于的东西)。FIPA-ACL 补上了 KQML 的缺口,围绕二十个施为语做了标准化。

### 二十个 FIPA 施为语(部分)

| 施为语 | 意图 |
|---|---|
| `inform` | "我告诉你 P 为真" |
| `request` | "我请你做 X" |
| `query-if` | "P 为真吗?" |
| `query-ref` | "X 的值是什么?" |
| `propose` | "我提议我们做 X" |
| `accept-proposal` | "我接受该提议" |
| `reject-proposal` | "我拒绝该提议" |
| `agree` | "我同意做 X" |
| `refuse` | "我拒绝做 X" |
| `confirm` | "我确认 P 为真" |
| `disconfirm` | "我否认 P" |
| `not-understood` | "你的消息无法解析" |
| `cfp` | "就 X 征集提案" |
| `subscribe` | "X 变化时通知我" |
| `cancel` | "取消进行中的 X" |
| `failure` | "我尝试 X 但失败了" |

完整清单在 `fipa00037.pdf`(FIPA ACL 消息结构)里。要点不是背下来——要点是:这里面每一个,都对应一个 LLM 协议迟早会重新加回来的原语。

### 标准 FIPA-ACL 消息

```
(inform
  :sender       agent1@platform
  :receiver     agent2@platform
  :content      "((price IBM 83))"
  :language     SL0
  :ontology     finance
  :protocol     fipa-request
  :conversation-id   conv-42
  :reply-with   msg-17
)
```

七个字段承载协议信封,一个字段(`content`)承载载荷。其余字段,正是你每次往 JSON 协议上嫁接重试、会话串和本体时重新发明的东西。

### 两个 legacy 平台

**JADE**(Java Agent DEvelopment framework,1999–2020 年代)是用得最多的 FIPA 兼容运行时。智能体继承一个基类,交换 ACL 消息,跑在容器里,用"行为"(behaviors)做协调。交互协议库自带合同网、订阅-通知、request-when 和 propose-accept。

**JACK**(Agent Oriented Software,商业)强调在 FIPA 消息之上做 BDI(信念-愿望-意图)推理。更形式化,采用更少。

Web 技术栈吃掉多智能体用例之后,两者都衰落了。MCP 和 A2A 就是 2026 年的运行时"容器"。

### FIPA 为什么消退

- **本体开销。** FIPA 要求共享本体才能解析 `content`。在本体上达成一致是个以年计的标准化过程。Web 直接用 HTTP + JSON。
- **没人用的形式语义。** SL(语义语言)给出严格的真值条件,但大多数生产系统用自由形式的内容,无视形式化。
- **工具链锁定。** JADE 只限 Java;JACK 是商业软件。多语言团队绕道而行。
- **互联网赢下了技术栈。** REST,然后 JSON-RPC,然后 gRPC,取代了 ACL 的传输层。

### LLM 复兴就是 FIPA 精简版

把 FIPA 的 `request` 和 MCP 的 `tools/call` 放一起比:

```
(request                                {
  :sender  agent1                         "jsonrpc": "2.0",
  :receiver tool-server                   "method":  "tools/call",
  :content "(lookup stock IBM)"           "params":  {"name":"lookup_stock",
  :ontology finance                                   "arguments":{"symbol":"IBM"}},
  :conversation-id c42                    "id": 42
)                                        }
```

同一个信封,不同的语法。两者都携带:谁、对谁、意图、载荷、关联 id。谁也不比谁更革命——它们是同一设计上的不同取舍。

Liu 等人 2025 年的综述("A Survey of Agent Interoperability Protocols: MCP, ACP, A2A, ANP",arXiv:2505.02279)把这条谱系讲得很明白:MCP 对应工具使用言语行为,A2A 对应智能体对等言语行为,ACP 对应审计追踪言语行为,ANP 对应去中心化身份扩展。新规范就是 ACL 的后裔,语法换成 JSON,语义更松。

### 取舍,说白了

**FIPA 给你、现代规范丢掉的:**

- 形式语义——你可以证明 `inform` 蕴含发送者相信其内容。
- 一份权威的施为语目录——你不必再争论"我们要不要一个 `cancel`?"。
- 数十年的交互协议模式——合同网、订阅-通知、propose-accept——正确性性质已知。

**现代规范给你、FIPA 没有的:**

- 与一切现代工具兼容的 JSON 原生载荷。
- LLM 无需手写本体就能理解的自然语言内容。
- Web 技术栈传输(HTTP、SSE、WebSocket)。
- 经自描述文档的能力发现(MCP `listTools`、A2A Agent Card)。

用更松的意图语义,换更容易的实现。这就是那笔交易,不多不少。

### 值得移植的交互协议

FIPA 交付了约 15 个交互协议。三个值得带进 LLM 多智能体系统:

1. **合同网协议(CNP)。** 管理者发出 `cfp`(征集提案);投标者以 `propose` 回应;管理者接受或拒绝。这是经典的任务市场模式(第 16 阶段 · 16 协商)。
2. **订阅/通知。** 订阅者发 `subscribe`;发布者在主题变化时发 `inform`。这就是 2026 年每一个事件总线。
3. **Request-When。** "当条件 Y 成立时做 X。"带前置条件的延迟动作。2026 年的对应物是持久化工作流引擎里的延迟任务(第 16 阶段 · 22 生产扩展)。

每一个都能干净地映射到现代消息队列、HTTP + 轮询或 SSE 流。

### 丢掉本体会出什么错

没有共享本体,智能体就得从自然语言内容里推断含义。2026 年记录在案的失败模式是**语义漂移**:两个智能体用同一个词(`"customer"`)指 subtly 不同的概念,接收方智能体按错误的解释行动,而 schema 校验器抓不到。FIPA 的本体要求,本会在解析时就拒掉这条消息。

不全上本体的缓解办法:

- `content` 上加 JSON Schema —— 在线上拒绝结构错误。
- 带类型的工件(A2A)—— 拒绝错误的模态。
- 信封里显式的施为语 —— 即使内容是自然语言,意图也毫不含糊。

### 2026 年规范,映射到言语行为传承

| 现代规范 | FIPA 对应 | 保留了什么 | 丢掉了什么 |
|---|---|---|---|
| MCP `tools/call` | `request` | 显式意图、关联 id | 形式语义、本体 |
| MCP `resources/read` | `query-ref` | 显式意图、关联 id | 形式语义 |
| A2A Task 生命周期 | 合同网 + request-when | 异步生命周期、状态迁移 | 形式化的完备性保证 |
| A2A 流式事件 | 订阅/通知 | 异步推送 | 带类型谓词的订阅 |
| CA-MCP 共享上下文 | 黑板(Hayes-Roth 1985) | 多写者共享内存 | 逻辑一致性模型 |
| NLIP | 自然语言内容 | LLM 原生 | schema |

从上往下读这张表,模式很清晰:保留结构原语,丢掉形式化,让 LLM 把歧义糊弄过去。

```figure
sw-contract-net
```

## 动手构建

`code/main.py` 实现了一个纯标准库的 FIPA-ACL 翻译器。它编解码标准的 ACL 信封,展示每种 MCP / A2A 消息形状如何归约为同样的七个字段。演示:

- 把五条 MCP 风格和 A2A 风格的消息编码为 FIPA-ACL。
- 把 FIPA-ACL 解码回现代等价物。
- 在一个管理者和三个投标者之间,用 `cfp`、`propose`、`accept-proposal`、`reject-proposal` 跑一场玩具合同网协商。

运行:

```
python3 code/main.py
```

输出是一份并排轨迹:每条现代消息同时以 2026 年 JSON 形式和 FIPA-ACL 形式展示,然后是一轮合同网投标的往返。同样的协议原语在往返后存活,只是语法不同。

## 投入使用

`outputs/skill-fipa-mapper.md` 是一个技能:读任何智能体协议规范,产出 FIPA-ACL 映射。在采用新协议之前用它回答:"这是真新,还是套了 JSON 语法的 `inform`?"

## 交付

别复活 FIPA-ACL。复活它的检查清单:

- 每条消息的意图原语(施为语)是什么?
- 请求-响应和取消有没有关联 id?
- 有没有显式的内容语言(JSON-RPC、纯文本、结构化带类型工件)?
- 交互协议是一等公民,还是你在从零重造合同网?
- 两个智能体对内容含义有分歧时(语义漂移)会怎样?

把新协议送进生产之前,先把这五个问题的答案写下来。

## 练习

1. 运行 `code/main.py`。观察往返编码。指出哪个 FIPA 施为语对应 `tools/call`、`resources/read` 和 A2A 任务创建。
2. 给合同网演示加一个 `cancel` 施为语,让管理者能在投标中途撤回任务。`cancel` 解决了什么光靠重试解决不了的失败情形?
3. 读 FIPA ACL 消息结构(http://www.fipa.org/specs/fipa00037/)4.1–4.3 节。挑一个本课未覆盖的施为语,描述它的现代 JSON-RPC 对应物。
4. 读 Liu 等人的 arXiv:2505.02279。对 MCP、A2A、ACP、ANP 每一个,列出它们保留和丢弃的 FIPA 施为语家族。
5. 为你自己系统的 `request` 施为语的 `content` 字段设计一个最小 JSON Schema。它比纯自然语言多给了你什么,代价又是什么?

## 关键术语

| 术语 | 大家口头的说法 | 实际含义 |
|------|----------------|------------------------|
| 言语行为(Speech act) | "能做事的话语" | Austin/Searle:话语即行动。ACL 的理论之父。 |
| FIPA | "那个老 XML 玩意儿" | IEEE 智能物理体基金会。2000 年将 ACL 标准化。 |
| ACL | "智能体通信语言" | FIPA 的信封格式:施为语 + 内容 + 元数据。 |
| 施为语(Performative) | "那个动词" | 消息的意图类别:`inform`、`request`、`propose`、`cfp` 等。 |
| KQML | "FIPA 的前身" | 知识查询与操纵语言(1993)。更简单,更窄。 |
| 本体(Ontology) | "共享词汇表" | 内容语言所谈论概念的形式化定义。 |
| SL0 / SL1 | "FIPA 内容语言" | 语义语言 0 级和 1 级——形式化内容语言家族。 |
| 合同网(Contract Net) | "任务市场" | 管理者发 cfp;投标者提案;管理者接受。经典交互协议。 |
| 交互协议 | "消息的模式" | 一串正确性已知的施为语序列:request-when、订阅-通知等。 |

## 延伸阅读

- [Liu et al. — A Survey of Agent Interoperability Protocols: MCP, ACP, A2A, ANP](https://arxiv.org/html/2505.02279v1) — 把现代规范与 FIPA 传承联系起来的权威 2025 综述
- [FIPA ACL Message Structure Specification (fipa00037)](http://www.fipa.org/specs/fipa00037/) — 2000 年批准的信封格式
- [FIPA Communicative Act Library Specification (fipa00037)](http://www.fipa.org/specs/fipa00037/) — 完整的施为语目录
- [MCP specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25) — `request`/`query-ref` 的现代工具使用等价物
- [A2A specification](https://a2a-protocol.org/latest/specification/) — 合同网与订阅-通知的现代智能体对等等价物
