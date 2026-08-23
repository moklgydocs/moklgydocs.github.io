# 动作预算、迭代上限与成本总督

> 一个中型电商智能体的月度 LLM 账单,在团队启用"订单跟踪"技能后,从 $1,200 跳到 $4,800。这不是定价 bug——是智能体找到了一个新循环,然后在里面不停地花钱。微软的 Agent Governance Toolkit(2026 年 4 月 2 日)把对这一类问题的防御写成了条文:每请求 `max_tokens`、每任务的 token 与美元预算、每日/每月上限、迭代上限、分级模型路由、prompt 缓存、上下文窗口化、昂贵动作上的人审检查点、预算破线时的急停开关。Anthropic 的 Claude Code Agent SDK 以不同名字提供了同一套原语。财务速率限制——比如"10 分钟内花超 $50 就断权限"——比月度上限更快抓住循环。

**类型:** 学习
**编程语言:** Python(标准库,分层成本总督模拟器)
**前置要求:** 第 15 阶段 · 10(权限模式),第 15 阶段 · 12(持久化执行)
**预计耗时:** 约 60 分钟

## 问题

自治智能体每一轮都在花真钱。聊天机器人的坏输出是一条坏回复;智能体的坏循环是一张账单。业界记录了这个失败模式的正式名称:"Denial of Wallet"(钱包拒绝服务)——智能体一直在推理、一直在调工具、一直在计费,没有任何东西让它停,因为没有任何东西被设计来让它停。

修法不是一个数字,而是一叠不同时间尺度、不同粒度的限制:每请求、每任务、每小时、每天、每月。设计良好的这一套,能在几分钟内抓住失控循环,几小时内抓住慢漏,一天内抓住坏发布。也正是这一套,让长程自治智能体的预算得以存在。

这是工程课:数学很平凡,纪律才是团队翻车的地方。下面的限制清单,每一条都出自微软 Agent Governance Toolkit 或 Anthropic Claude Code Agent SDK 的文档。

## 概念

### 成本总督栈

1. **每请求 `max_tokens`。** 简单。防止任何一次调用产出无界补全。
2. **每任务 token 预算。** 整个运行不超过 N 个 token,触顶硬停。
3. **每任务美元预算。** 同上,只是换成货币。Claude Code 里的 `max_budget_usd`。
4. **按工具调用上限。** `WebFetch` 不超过 N 次,`shell_exec` 不超过 N 次,等等。
5. **迭代上限(`max_turns`)。** 智能体循环总迭代数;防止无限推理循环。
6. **每分钟 / 每小时 / 每天 / 每月上限。** 滚动窗口,在不同时间尺度抓漏。
7. **财务速率限制。** 例如"10 分钟花超 $50 即断权限"。在月度上限触发之前,先抓住循环式燃烧。
8. **分级模型路由。** 默认小模型;只有当分类器判定任务值得时,才升级大模型。
9. **Prompt 缓存。** 系统提示词和稳定上下文存进提供方缓存;重发的 token 成本接近零。
10. **上下文窗口化。** 压缩/摘要,把活跃上下文压在阈值以下;直接降 token 成本。
11. **昂贵动作上的人审检查点。** 执行已知昂贵的动作前(长工具调用、大下载、升级贵模型),需要人点一下。
12. **预算破线急停。** 任何上限触发,会话中止。触发被记录;重新启用要走单独路径。

### 为什么是一叠,不是一个上限

单一个月度上限,只能在钱包见底之后抓住失控智能体。单个每请求上限,在会话层面什么都抓不住。不同的失败模式需要不同的时间尺度:

- **失控循环**(智能体卡在 5 秒一次的重试里):速率限制抓。
- **慢漏**(智能体每任务做着约 2 倍于预期的活):每日上限抓。
- **坏发布**(新版本用了 5 倍 token):每周 / 每月上限抓。
- **合理的激增**(真实需求,不是 bug):小时 / 日上限抓,日志要清楚。

### Harness 的预算接口

Claude Code Agent SDK 暴露的(公开文档):

- `max_turns` ——迭代上限。
- `max_budget_usd` ——美元上限;破线即中止会话。
- `allowed_tools` / `disallowed_tools` ——工具白名单与黑名单。
- 工具使用前的 hook 点,接自定义成本记账。

与权限模式阶梯(第 10 课)组合。一个不设 `max_budget_usd` 的 `autoMode` 会话,就是没有总督的自治。Anthropic 明确把 Auto 模式定位为必须配预算控制;分类器与成本是两回事。

### 欧盟 AI 法案、OWASP 智能体 Top 10

微软的 Agent Governance Toolkit 覆盖 OWASP Agentic Top 10 和欧盟 AI 法案第 14 条(人类监督)的要求。在欧盟生产环境,日志与上限强制不是可选项。

### 实测的 $1,200 → $4,800 案例

微软文档里的真实案例:一个电商智能体在新增一个工具后,月成本翻了三倍。那个工具让智能体在每个会话里轮询订单状态。没有循环检测,没有按工具上限,没有周环比告警。修法是按工具上限加每日增长告警。这是模板:每一个新的工具面都是一个新的潜在循环;每个新工具都需要自己的上限和自己的告警。

```figure
cost-governor-stack
```

## 投入使用

`code/main.py` 模拟带与不带分层成本总督栈的智能体运行。模拟的智能体在若干轮后 drift 进一个轮询循环;分层栈在速率窗口内就抓住它,而单一个月度上限要几天后才触发。

## 交付

`outputs/skill-agent-budget-audit.md` 审计一个智能体部署提案的成本总督栈,标出缺失的层。

## 练习

1. 运行 `code/main.py`。确认在轮询循环轨迹上,速率限制先于迭代上限触发。然后关掉速率限制,测量在迭代上限抓住它之前,智能体"花掉"了多少。

2. 为一个浏览器智能体(第 11 课)设计按工具上限组。哪个工具需要最紧的上限?哪个工具可以无风险地不设限?

3. 读微软 Agent Governance Toolkit 文档。列出它点名的每一种上限类型,并各自映射到一种失败模式(失控循环、慢漏、坏发布、激增)。

4. 为一个真实任务(如"分拣仓库里 50 个 issue")的通宵无人值守运行估价。把 `max_budget_usd` 设为点估计的 2 倍,说明 2 倍的理由。

5. Claude Code 的 `max_budget_usd` 按会话累计成本触发。设计一个你会在外部强制的补充速率限制:什么触发断供,重新启用长什么样?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|---|---|---|
| Denial of Wallet | "失控账单" | 智能体循环不断产生花费,没有上限让它停 |
| max_tokens | "每请求上限" | 单次补全大小的天花板 |
| max_turns | "迭代上限" | 一个会话中智能体循环迭代数的天花板 |
| max_budget_usd | "美元急停" | 会话成本上限;破线即中止 |
| 速率限制(Velocity limit) | "速率上限" | 短窗口内的花费限制(如 $50 / 10 分钟) |
| 分级路由(Tiered routing) | "先小模型" | 默认便宜模型;分类器认为值得时才升级 |
| Prompt 缓存 | "缓存系统提示词" | 提供方侧缓存,把重发的 token 成本降到接近零 |
| 人审检查点(HITL checkpoint) | "人类批准闸" | 昂贵动作前必须有人点一下 |

## 延伸阅读

- [Anthropic Claude Code Agent SDK — agent loop and budgets](https://code.claude.com/docs/en/agent-sdk/agent-loop) ——`max_turns`、`max_budget_usd`、工具白名单
- [Microsoft Agent Framework — human-in-the-loop and governance](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop) ——成本总督检查点
- [Anthropic — Claude Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview) ——提供方侧的成本控制
- [Anthropic — Prompt caching (Claude API docs)](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) ——缓存机制
- [Anthropic — Measuring agent autonomy in practice](https://www.anthropic.com/research/measuring-agent-autonomy) ——长程智能体的成本画像
