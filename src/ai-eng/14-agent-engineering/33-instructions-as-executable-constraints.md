# 智能体指令即**可执行约束**

> 写成散文的指令是愿望,写成约束的指令是测试。工作台把每条规则变成智能体运行时能检查、评审者事后能核验的东西。

**类型:** 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 32(最小工作台)
**预计耗时:** 约 50 分钟

## 学习目标

- 把路由性散文与操作性规则分开
- 把启动规则、禁止动作、完成定义、不确定性处理和批准边界,表达为机器可查的约束
- 实现一个对照规则集给一次运行打分的规则检查器
- 让规则集对 diff 友好,评审能看清改了什么

## 问题

典型的 `AGENTS.md` 读起来像入职文档:告诉智能体"要小心""要充分测试""拿不准就问"。三天后,智能体交付了一个没有测试的改动,写进了禁止的目录,而且从头到尾没问——因为它根本不知道线在哪。

指令写成可操作时有力量,写成许愿时没力量。修法是:写出工作台能解释、评审者能打分的规则。

## 概念

规则属于 `docs/agent-rules.md`,与短的根路由分开。每条规则有名字、类别和检查。

```mermaid
flowchart LR
  Router[AGENTS.md] --> Rules[docs/agent-rules.md]
  Rules --> Checker[rule_checker.py]
  Checker --> Report[rule_report.json]
  Report --> Reviewer[Reviewer]
```

### 覆盖大多数规则的五个类别

| 类别 | 规则回答的问题 | 例子 |
|----------|---------------------------|---------|
| 启动(Startup) | 开工前什么必须为真? | "状态文件存在且新鲜" |
| 禁止(Forbidden) | 什么绝不能发生? | "不得编辑 `scripts/release.sh`" |
| 完成定义(Definition of done) | 什么证明任务完成? | "pytest 退出码 0 且验收行通过" |
| 不确定性(Uncertainty) | 拿不准时智能体做什么? | "开一条疑问记录,而不是瞎猜" |
| 批准(Approval) | 什么需要人类批准? | "任何新依赖、任何生产写入" |

一条塞不进这五个类别的规则,通常是想当两条规则。强制拆开。

### 规则是机器可读的

每条规则有一个 slug、一个类别、一行描述,以及一个指向 `rule_checker.py` 中函数的 `check` 字段。加规则就是加检查;检查器随工作台一起成长。

### 规则对 diff 友好

规则在一个 markdown 文件里,每条占一个标题。改名在 diff 里可见;新规则放在所属类别顶部;过期规则直接删除而不是注释掉——工作台才是事实来源,不是上个季度团队心情的聊天记录。

### 规则 vs 框架护栏

框架护栏(OpenAI Agents SDK guardrails、LangGraph interrupts)在运行时层强制规则;本课的规则集,是那些护栏所实现的人类可读、可评审的契约。两个都需要:运行时在轮次内抓住违规,规则集证明运行在做正确的事。

### 渐进披露:给地图,不给百科全书

`AGENTS.md` 不断长胖的原因:每次事故加一条规则,却没有事故删掉一条。一年后文件两千行,智能体读完第一屏就用完了注意力预算,只按它被告知内容的一小部分行动。巨型指令文件失败的原因,和四十页入职文档失败的原因一样:读者浏览一遍,就再也不会回到重要的那部分。

修法不是更短的文件,而是分层的文件。根路由小到每个会话都能读完,只放指针;深度住在按主题分的文档里,任务碰到才加载。给智能体一张地图,别给整本百科全书,让它自己走到需要的那一页。

```
AGENTS.md                  # router, < 50 lines: what this repo is, where to look, the 5 hard rules
docs/
  agent-rules.md           # the full rule set (this lesson)
  architecture.md          # loaded when the task touches module boundaries
  testing.md               # loaded when the task writes or runs tests
  deploy.md                # loaded only for release work, gated behind an approval rule
feature_list.json          # the backlog (Phase 14 · 36)
```

| 层级 | 位置 | 何时读 | 体量预算 |
|------|----------|-----------|-------------|
| 路由 | `AGENTS.md` | 每个会话,必读 | 约 50 行以内 |
| 规则 | `docs/agent-rules.md` | 每个会话,启动时 | 每类别一屏 |
| 主题文档 | `docs/<topic>.md` | 仅当任务触及该主题 | 需要多深就多深 |

两个测试守住分层的诚实。可达性测试:从路由出发,任何规则最多两跳必达——所以路由必须用路径链接每个主题文档,而不是用散文描述它们。新鲜度测试:路由短到评审者每个 PR 都会重读它,这是阻止它悄悄长回百科全书的唯一办法。一个解析不了的指针比缺一条规则更糟,所以路由里的死链本身就是一条启动检查违规。

```figure
wb-rule-checkoff
```

## 动手构建

`code/main.py` 提供:

- 把规则加载进 dataclass 的 `agent-rules.md` 解析器。
- `rule_checker.py` 风格的检查函数,每个 `check` 引用一个。
- 一个违反两条规则的演示智能体运行,以及抓住它们的检查过程。

运行:

```
python3 code/main.py
```

输出:解析出的规则集、运行链路、逐规则通过/失败,以及保存在脚本旁的 `rule_report.json`。

## 野外的生产模式

三个模式,把能撑一个季度的规则集和一周就腐烂的规则集分开。

**写的时候就标严重级。** 每条规则带 `severity`:`block`、`warn` 或 `info`。检查器三个都报;运行时只在 `block` 上拒绝。大多数团队早期高估严重级,然后在截止日期压力下悄悄放水——写的时候打标,把校准逼到前面。与验证闸门(第 14 阶段 · 38)配合:任何对 `block` 规则的 override,都要签名进 `overrides.jsonl` 审计日志。

**规则过期作为强制函数。** 每条规则带 `expires_at` 日期(默认撰写后 90 天)。一条未过期规则连续 60 天零违规时,检查器发出警告;下一次季度评审要么给出保留理由,要么降级为 `info`,要么删除。Cloudflare 的生产 AI Code Review 数据(2026 年 4 月,30 天内 5,169 个仓库、131,246 次评审运行)显示:带显式过期的规则集稳定在每仓库 30 条以内;不带的长到 80+,其中大多数从未触发过。

**Markdown 作源头,JSON 作缓存。** `agent-rules.md` 是撰写的文件;`agent-rules.lock.json` 是检查器在热路径上读的缓存,由 pre-commit hook 重新生成。Markdown 的 diff 可评审,JSON 解析不进任何轮次。与 `package.json` / `package-lock.json`、`Cargo.toml` / `Cargo.lock` 同形。

## 投入使用

生产中:

- Claude Code、Codex、Cursor 在会话开始时读规则,拒绝动作时引用它们。检查器在 CI 里重跑,抓住静默漂移。
- OpenAI Agents SDK 把同样的检查注册为输入输出护栏:markdown 是文档面,SDK 是运行时面。
- LangGraph 在运行中的节点违反规则时触发 interrupt:中断处理器读规则、问人类、恢复执行。

规则集在三者间可移植,因为它只是 markdown 加函数名。

## 交付

`outputs/skill-rule-set-builder.md` 访谈项目负责人,把他们现有的散文指令归入五个类别,产出一份带版本的 `agent-rules.md` 和一个检查器桩。

## 练习

1. 如果你的产品真的需要,加第六个类别。论证为什么它不能并入五个之一。
2. 扩展检查器:规则可携带严重级(`block`、`warn`、`info`),报告按级别聚合。
3. 把检查器接进 CI:最近一次智能体运行有 block 级规则失败,就让构建失败。
4. 给每条规则加"过期"字段:90 天无检查失败,该规则进入评审。
5. 找一份真实的 `AGENTS.md`,按五类规则重写。它有多少行是可操作的?多少行是许愿?

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|----------------|------------------------|
| 操作性规则(Operational rule) | "真指令" | 工作台运行时能检查的规则 |
| 许愿性规则(Aspirational rule) | "小心点" | 没有检查的规则:要么删掉,要么升级 |
| 完成定义(Definition of done) | "验收" | 证明任务完成的、客观的、以文件为凭的证据 |
| block 严重级(Block severity) | "硬规则" | 违规即中止运行;没有运维签字无法消音 |
| 规则过期(Rule expiry) | "陈旧规则清扫" | N 天无失败的规则进入退役评审 |

## 延伸阅读

- [OpenAI Agents SDK guardrails](https://openai.github.io/openai-agents-python/guardrails/)
- [LangGraph interrupts](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/breakpoints/)
- [Anthropic, Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
- [Rick Hightower, Agent RuleZ: A Deterministic Policy Engine](https://medium.com/@richardhightower/agent-rulez-a-deterministic-policy-engine-for-ai-coding-agents-9489e0561edf)——生产中的 block/warn/info 严重级
- [Cloudflare, Orchestrating AI Code Review at Scale](https://blog.cloudflare.com/ai-code-review/)——13.1 万次评审运行,规则组成的经验
- [microservices.io, GenAI development platform — part 1: guardrails](https://microservices.io/post/architecture/2026/03/09/genai-development-platform-part-1-development-guardrails.html)——规则与 CI 之间的纵深防御
- [Type-Checked Compliance: Deterministic Guardrails (arXiv 2604.01483)](https://arxiv.org/pdf/2604.01483)——Lean 4 作为"规则即检查"的上限
- [logi-cmd/agent-guardrails](https://github.com/logi-cmd/agent-guardrails)——合并闸门实现:范围、变异测试、违规预算
- 第 14 阶段 · 32——这套规则集落入的最小工作台
- 第 14 阶段 · 38——消费规则报告的验证闸门
- 第 14 阶段 · 39——给规则遵守情况打分的评审智能体
