# 浏览器智能体与长程 Web 任务

> ChatGPT agent(2025 年 7 月)把 Operator 和 deep research 合并成一个浏览器/终端智能体,以 68.9% 创下 BrowseComp SOTA。OpenAI 在 2025 年 8 月 31 日关停了独立的 Operator——产品层的整合。Anthropic 收购 Vercept,把 Claude Sonnet 在 OSWorld 上从不到 15% 推到 72.5%。WebArena-Verified(ServiceNow,ICLR 2026)修掉了原版 WebArena 11.3 个百分点的假阴性率,并发货 258 题 Hard 子集。数字是真的,攻击面也是真的:OpenAI 防备部门负责人公开说过,针对浏览器智能体的间接 prompt 注入"不是一个能完全打补丁的 bug"。2025–2026 年有记录的攻击:Tainted Memories(Atlas CSRF)、HashJack(Cato Networks),以及 Perplexity Comet 的一键劫持。

**类型:** 学习
**编程语言:** Python(标准库,间接 prompt 注入攻击面模型)
**前置要求:** 第 15 阶段 · 10(权限模式),第 15 阶段 · 01(长程智能体)
**预计耗时:** 约 45 分钟

## 问题

浏览器智能体,是一种读不可信内容、做有后果动作的长程智能体。它访问的每个页面,都是用户没写过的输入;每个页面上的每个表单,都是潜在的命令通道。2025–2026 年的攻击语料说明这不是假想:Tainted Memories 让攻击者通过精心构造的页面,把恶意指令绑进智能体的记忆;HashJack 把命令藏在智能体访问的 URL 片段里;Perplexity Comet 的劫持,一次点击就中招。

防御的图景并不舒服。OpenAI 防备部门负责人把那句话公开说了:间接 prompt 注入"不是一个能完全打补丁的 bug"。原因在于,攻击住在智能体"读与做"的边界上,而这条边界在架构上是模糊的——模型读到的每个 token,原则上都可能被读成一条指令。

本课点名攻击面,点名基准格局(BrowseComp、OSWorld、WebArena-Verified),并建模一个最小的间接 prompt 注入场景,为你能在第 14 和 18 课推理真实防御打基础。

## 概念

### 2026 年格局,每个系统一段话

**ChatGPT agent(OpenAI)。** 2025 年 7 月发布,统一了 Operator(浏览)与 Deep Research(数小时研究)。2025 年 8 月 31 日关停独立 Operator。BrowseComp SOTA 68.9%;OSWorld 和 WebArena-Verified 上数字也很强。

**Claude Sonnet + Vercept(Anthropic)。** Anthropic 收购 Vercept,主攻计算机操作能力,把 Claude Sonnet 在 OSWorld 上从 <15% 推到 72.5%。Claude Computer Use 以工具 API 形式出货。

**Gemini 3 Pro with Browser Use(DeepMind)。** Browser Use 集成带来计算机操作控制;FSF v3(2026 年 4 月,第 20 课)专门跟踪 ML R&D 领域的自治度。

**WebArena-Verified(ServiceNow,ICLR 2026)。** 修掉一个有据可查的问题:原版 WebArena 有约 11.3% 的假阴性率(实际解决却被判失败的任务)。Verified 版用人工精选的成功标准重新评分,并加了 258 题的 Hard 子集(ICLR 2026 论文,openreview.net/forum?id=94tlGxmqkN)。

### BrowseComp vs OSWorld vs WebArena

| 基准 | 测什么 | 时程 |
|---|---|---|
| BrowseComp | 在时间压力下从开放 web 找特定事实 | 分钟级 |
| OSWorld | 智能体操作完整桌面(鼠标、键盘、shell) | 数十分钟 |
| WebArena-Verified | 模拟站点中的事务性 web 任务 | 分钟级 |
| Hard 子集 | 需要多页面状态转移的 WebArena-Verified 任务 | 数十分钟 |

轴线不同。BrowseComp 高分说明智能体会找事实,不代表它会订机票。OSWorld 分数更接近"在我的桌面上行不行",WebArena-Verified 更接近"能不能走完一个流程"。任何生产决策,都要选与任务分布匹配的那个基准。

### 攻击面,逐一点名

1. **间接 prompt 注入。** 不可信页面内容里藏着指令,智能体读到,然后执行。公开案例:2024 年 Kai Greshake 等人、2025 年 Tainted Memories 论文、2026 年 HashJack(Cato Networks)。
2. **URL 片段 / query 注入。** 被抓 URL 的 `#fragment` 或 query 串里藏命令。从不被可见渲染,但仍在智能体的上下文里。
3. **记忆绑定攻击。** 页面指示智能体写一条持久记忆(第 12 课讲持久状态)。下个会话,这条记忆在没有任何可见触发的情况下引爆载荷。
4. **对已认证会话的 CSRF 式攻击。** Tainted Memories 一类:智能体在某处登录着;攻击者的页面发出改状态的请求,智能体带着用户的 cookie 执行。
5. **一键劫持。** 一个看起来人畜无害的按钮,拖着智能体会跟随的载荷。Comet 一类。
6. **智能体宿主面上的 CSP 漏洞。** 渲染层和工具层本身也可能是攻击载体;"智能体里的浏览器"这个栈,面很宽。

### 为什么"打不齐补丁"

攻击与能力是同构的。智能体必须读不可信内容才能干活;它读到的任何内容都可能含指令;它遵循的任何指令都可能与用户的真实请求失配。防御(信任边界、分类器、工具白名单、有后果动作上的人审)抬高攻击成本、缩小爆炸半径,但关不上这一整类。

这与 Lob 定理(第 8 课)是同一个推理模式:智能体无法证明下一个 token 是安全的;它能做的,是搭一个让不安全 token 更容易被检测到的系统。

### 真正能上线的防御姿态

- **读/写边界。** 读永远无后果。写(提交表单、发布内容、调有副作用的工具)时,如果发起内容来自信任边界之外,必须重新取得人类批准。
- **按任务配工具白名单。** 智能体可以浏览;除非任务显式启用了转账工具,否则它不能发起转账。第 13 课讲预算。
- **会话隔离。** 浏览器智能体会话只用限定范围的凭证。不接生产认证,不接个人邮箱。每个 HTTP 请求都留日志供审计。
- **内容消毒器。** 抓取的 HTML 在拼进模型上下文前,剥掉已知坏图案。(能挡住容易的攻击,挡不住精心构造的载荷。)
- **有后果动作上的人审。** 先提议后提交模式(第 15 课)。
- **记忆上的金丝雀 token。** 某条记忆被触发时,用户看得到(第 14 课)。

```figure
injection-boundary
```

## 投入使用

`code/main.py` 用三个合成页面建模一次微型浏览器智能体运行:一个良性页面、一个可见文本里有直接 prompt 注入块的页面、一个 URL 片段注入的页面(不可见,但在智能体上下文里)。脚本展示:(a) 朴素智能体会做什么;(b) 读/写边界抓住什么;(c) 消毒器抓住什么;(d) 两者都抓不住什么。

## 交付

`outputs/skill-browser-agent-trust-boundary.md` 为一个浏览器智能体部署提案划界:它触及哪些信任区、被授权写什么、首次运行前必须就位哪些防御。

## 练习

1. 运行 `code/main.py`。找出"消毒器抓得住而读/写边界抓不住"的攻击,以及"只有读/写边界抓得住"的攻击。

2. 扩展消毒器,检测一类 HashJack 式 URL 片段注入。在带合法片段的良性 URL 上测误报率。

3. 挑一个你熟悉的真实浏览器智能体工作流(如"订机票")。列出每一次读和每一次写,标出哪些写需要人审、为什么。

4. 读 WebArena-Verified 的 ICLR 2026 论文。指出一类原版 WebArena 评分不可靠的任务,并解释 Verified 子集如何解决。

5. 为浏览器智能体场景设计一个记忆金丝雀。存什么?存哪里?什么触发警报?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|---|---|---|
| 间接 prompt 注入 | "坏页面文字" | 智能体读到的不可信内容中含指令,智能体照做了 |
| Tainted Memories | "记忆攻击" | 智能体把攻击者提供的指令写进持久记忆;下个会话触发 |
| HashJack | "URL 片段攻击" | 藏在 URL 片段 / query 串里的载荷,在智能体上下文中但不可见渲染 |
| 一键劫持 | "坏按钮" | 可见的按钮拖着智能体会执行的后续载荷 |
| BrowseComp | "web 搜索基准" | 在开放 web 上找特定事实;分钟级时程 |
| OSWorld | "桌面基准" | 完整 OS 控制;多步 GUI 任务 |
| WebArena-Verified | "修复版 web 任务基准" | ServiceNow 重评分的 WebArena,带 Hard 子集 |
| 读/写边界 | "副作用闸门" | 读永远无后果;内容来自信任边界外时,写必须重新批准 |

## 延伸阅读

- [OpenAI — Introducing ChatGPT agent](https://openai.com/index/introducing-chatgpt-agent/) ——Operator 与 deep research 的合并;BrowseComp SOTA
- [OpenAI — Computer-Using Agent](https://openai.com/index/computer-using-agent/) ——Operator 谱系,以及演变成 ChatGPT agent 的架构
- [Zhou et al. — WebArena](https://webarena.dev/) ——原始基准
- [WebArena-Verified (OpenReview)](https://openreview.net/forum?id=94tlGxmqkN) ——ICLR 2026 修复子集论文
- [Anthropic — Measuring agent autonomy in practice](https://www.anthropic.com/research/measuring-agent-autonomy) ——含计算机操作智能体的攻击面讨论
