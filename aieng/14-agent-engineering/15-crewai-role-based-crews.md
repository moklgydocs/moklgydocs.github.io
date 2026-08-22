# 基于角色的智能体团队 —— 角色、任务、流程

> 四个原语:Agent、Task、Crew、Process。两种顶层形态:Crews(自主的、基于角色的协作)和 Flows(事件驱动的、确定性的)。CrewAI 是 2026 年的参考实现,它的文档说得很直白:"任何要进生产的应用,从 Flow 开始。"

**类型:** 学习 + 动手构建
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 12(工作流模式)、第 14 阶段 · 14(Actor 模型)
**预计耗时:** 约 75 分钟

## 学习目标

- 说出 CrewAI 的四个原语(Agent、Task、Crew、Process)及各自管什么。
- 区分 Sequential、Hierarchical 和规划中的 Consensus 流程;按负载各选一个。
- 区分 Crews(自主、基于角色)与 Flows(事件驱动、确定性),并解释文档的生产建议。
- 用 `@tool` 装饰器和 `BaseTool` 子类接工具;权衡结构化输出 vs 自由文本。
- 说出 CrewAI 四种记忆类型及各自何时划算。
- 用纯标准库实现三智能体 crew(研究员、写手、编辑),产出一份简报。
- 识别 CrewAI 的三个失败模式:提示词膨胀、manager-LLM 税、脆弱的交接。

## 问题

采用多智能体框架的团队会撞上同一堵墙。"自主协作"在 demo 里很美。然后客户报了个 bug,你需要确定性重放;或者财务问一次 LLM 路由的 crew 每跑一轮多少钱;或者值班的人需要知道凌晨 3 点是哪个智能体卡住了。

自由形态的 LLM 路由 crew,一个都答不干净。纯 DAG 全都能答,但丢了头脑风暴智能体需要的探索形态。

CrewAI 的切分对这个取舍很诚实:Crews 给协作式、角色化、探索性的工作;Flows 给事件驱动、代码掌控、可审计的生产。同一个框架,两种形态,按表面各选。

## 概念

### 四个原语

CrewAI 的表面很小。记住这个,其余都是配置。

- **Agent。** `role + goal + backstory + tools +(可选)llm`。backstory 是关键所在:它塑造语气、判断和智能体何时收手。tools 是智能体可调用的函数(详见下文)。
- **Task。** `description + expected_output + agent +(可选)context +(可选)output_pydantic`。可复用的工作单元。`expected_output` 是契约;`context` 列出其输出会被传入的上游任务;`output_pydantic` 强制结构化形状。
- **Crew。** 容器。持有 `agents` 列表、`tasks` 列表、`process`,以及可选的 `memory` + `verbose` + `manager_llm` 设置。
- **Process。** 执行策略:Sequential、Hierarchical、Consensus(规划中)。决定运行的形状。

Agent 之间不直接可见;Task 引用 Agent;Crew 给 Task 排序;Process 决定谁挑下一个 Task。这就是全部心智模型。

> **校验基准** CrewAI 0.86(2026-05)。更新版本可能重命名或合并流程类型;依赖具体形态前查 [CrewAI Processes 文档](https://docs.crewai.com/concepts/processes)。

### Sequential vs Hierarchical vs Consensus

- **Sequential。** 任务按声明顺序运行。任务 N 的输出作为 `context` 传给任务 N+1。成本最低,最可预测。顺序固定时用它。
- **Hierarchical。** 一个 manager Agent(单独的 LLM 调用)在专家之间路由。CrewAI 用你的 `manager_llm` 配置或默认值生成 manager。manager 每轮挑下一个任务,可以拒绝或改派。有四位以上专家、且顺序真的取决于先前输出时用它。
- **Consensus。** 规划中,公开 API 尚未实现。文档把这个名字留给未来的投票式流程。今天别依赖它。

Hierarchical 在每个专家调用之上,每轮多加一次 LLM 调用(manager)。五步的运行,token 成本能翻三倍。只在需要路由时才付这笔钱。

### Crews vs Flows

这是 2026 年文档开篇就摆出来的框架。

- **Crew。** LLM 驱动的自主。框架在运行时决定形状。适合:研究、头脑风暴、初稿,以及任何"路径本身就是答案一部分"的地方。难重放、难测试、原型便宜。
- **Flow。** 你拥有的事件驱动图。`@start` 标记入口;`@listen(topic)` 标记在另一步发出该 topic 时触发的步骤。每步是纯 Python(内部可以调 Crew)。适合:生产。可观测、可测试、确定性。

文档的 2026 年生产建议:从 Flow 开始。当自主性配得上它的成本时,在 Flow 步骤内部以 `Crew.kickoff()` 调用的形式把 Crew 折进来。Flow 给你审计轨迹,Crew 给你探索。是组合,不是二选一。

### 工具集成

给 Agent 接工具有三种方式,选够用的最简单那个。

1. **`@tool` 装饰器。** 纯函数变工具。签名即 schema;docstring 即 LLM 看到的描述。最适合一次性辅助函数。

   ```python
   from crewai.tools import tool

   @tool("Search the web")
   def search(query: str) -> str:
       """Return top results for the query."""
       return run_search(query)
   ```

2. **`BaseTool` 子类。** 类形态工具:显式参数 schema、异步支持、重试。工具有状态(客户端、缓存)或需要结构化参数时用。

   ```python
   from crewai.tools import BaseTool
   from pydantic import BaseModel

   class SearchArgs(BaseModel):
       query: str
       limit: int = 10

   class SearchTool(BaseTool):
       name = "web_search"
       description = "Search the web and return top results."
       args_schema = SearchArgs

       def _run(self, query: str, limit: int = 10) -> str:
           return self.client.search(query, limit=limit)
   ```

3. **内置工具包。** CrewAI 自带一方适配器:`SerperDevTool`、`FileReadTool`、`DirectoryReadTool`、`CodeInterpreterTool`、`RagTool`、`WebsiteSearchTool`。一次 import 接好。

结构化输出用 Pydantic:在 Task 上传 `output_pydantic=MyModel`,CrewAI 对照模型校验 LLM 响应,矫正或重试。搭配一个写紧的 `expected_output` 字符串。自由文本输出适合草稿;结构化输出是下游 Flow 能消费的东西。

### 记忆钩子

CrewAI 开箱带四种记忆,可组合:一个 Crew 可以同时开四种。

> **校验基准** CrewAI 0.86(2026-05)。近期版本把一切都路由到一个包装这四种存储的统一 `Memory` 系统。下面的概念模型仍成立,但新版本的公开类表面可能坍缩成单一 `Memory` 入口;查 [CrewAI memory 文档](https://docs.crewai.com/concepts/memory) 获取当前 API。

- **短期。** 单次运行内的对话缓冲区。运行结束即清空。
- **长期。** 跨运行持久。存向量数据库(默认 Chroma,可换)。按与当前任务的相似度检索。
- **实体。** 逐实体事实。"客户 X 在企业版套餐上。"按实体键,不按相似度。跨运行存活。
- **上下文。** 组装时检索。在 Agent 需要的那一刻拉取相关记忆,而非预加载。

在 Crew 上用 `memory=True` 或逐类型配置开启。底层是你配置的嵌入提供商(默认 OpenAI,可换本地)。记忆是 CrewAI 相对更薄框架的立身之处之一;纯 LangGraph 里每一样都得自己接。

### 角色化团队何时合适

- 三到六个有命名角色的智能体,协作式工作流:起草、评审、规划、头脑风暴。
- "LLM 对下一步的判断本身就是价值"的路由(Hierarchical)。
- 任何团队读 `role + goal + backstory` 比读图定义更舒服的地方。

### 何时不合适

- 严格顺序的确定性 DAG。用 LangGraph(第 13 课)——图形状才是对的抽象,CrewAI 的角色框架是摩擦力。
- 亚秒级延迟预算。Hierarchical 增加往返;即使 Sequential 也会把含 backstory 和先前输出的提示词串行化。
- 单智能体循环。跳过框架;一个智能体循环(第 1 课)加工具注册表更短。

第 17 课(智能体框架权衡)用矩阵铺开这些。简版:CrewAI 坐在"协作角色化"那一角。

### 依赖形态

独立于 LangChain。Python 3.10 到 3.13,用 `uv`。star 数见 [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI)(2026-05 快照)。AWS Bedrock 集成有文档;厂商基准报告在 QA 负载上相对 LangGraph 有大幅提速,但方法(数据集、硬件、评估指标)未公开,所以厂商数字只当方向性参考。

### 这个模式在哪里出错

- **backstory 导致的提示词膨胀。** 每个智能体 2000 词 backstory、五个智能体的 crew,第一次工具调用前上下文预算就烧完了。backstory 控制在 200 词内;跨智能体复用措辞,别把同一段风格指南重复五遍。
- **manager-LLM 的 token 税。** Hierarchical 流程在每个专家调用前多一次 manager LLM 调用。五任务的 crew 就是六次 LLM 调用而非五次,而且 manager 调用要带上完整任务列表加先前输出。除非路由取决于输出,否则换 Sequential。
- **脆弱交接。** 任务 N 的 `expected_output` 是"一份大纲",任务 N+1 把它当 `context` 读、试图解析三节,LLM 产出了四节,下游 Agent 只能即兴发挥。修法:任务 N 上加 `output_pydantic`,让任务 N+1 读到的是带类型对象,不是自由文本。
- **Crew 直接上生产。** 自由形态 Crew 不包 Flow 就上线:输出波动大、无法重放、值班没法把坏运行和好运行做 diff。包一层 Flow。

```figure
ae-crew-vs-flow
```

## 动手构建

`code/main.py` 用纯标准库实现两种形态,外加一个三智能体 crew。

结构:

- `Agent`、`Task` dataclass,对应 CrewAI 的表面。
- `SequentialCrew.kickoff(inputs)` 按声明顺序跑任务,用 `context` 串输出。
- `HierarchicalCrew.kickoff(topic)` 加一个 manager Agent,每轮挑下一个专家,说到"done"停。
- `Flow` 带 `@start` 和 `@listen(topic)` 装饰器、一个小事件循环和轨迹。
- `tool(name)` 装饰器,对应 CrewAI 的 `@tool` 形状。
- `Memory` 带 `short_term`、`long_term`、`entity` 存储;相似度用 numpy 模拟。
- 模拟 LLM 响应是按"角色 + 输入前缀"键控的硬编码字符串。无网络,确定性。

具体演示:研究员、写手、编辑 crew,产出一份"2026 智能体工程"简报。研究员拉(模拟的)来源,写手写稿,编辑收紧。同一个 crew 再过一个 Flow,展示确定性形态。

运行:

```bash
python3 code/main.py
```

轨迹覆盖:sequential crew 用 `context` 串输出;hierarchical crew 的 manager 选择(研究员、写手、编辑,然后"done");flow 用显式 topic(`researched`、`drafted`、`edited`)跑同样三步;经 `@tool` 路由的工具调用;以及跨两次 kickoff 存活的长期记忆。

Crew 的轨迹是流动的——manager 原则上可以重排;Flow 的轨迹是固定的。这个选择就是本课。

## 投入使用

- **CrewAI Flow** 上生产。哪怕 Flow 只有一步、里面调 `Crew.kickoff()`。Flow 给出审计边界。
- **CrewAI Crew(Sequential)** 给顺序清晰的协作工作,尤其初稿和评审循环。
- **CrewAI Crew(Hierarchical)** 当路由取决于输出、且有四位以上专家时。
- **LangGraph**(第 13 课)要显式状态机、持久恢复、严格顺序时。
- **AutoGen v0.4**(第 14 课)要 actor 模型并发和故障隔离时。
- **OpenAI Agents SDK**(第 16 课)OpenAI 优先的产品,要 handoff 和护栏时。
- **Claude Agent SDK**(第 17 课)Claude 优先的产品,要子智能体和会话存储时。

## 交付

`outputs/skill-crew-or-flow.md`:为任务挑选 Crew 还是 Flow,并搭出最小实现。硬性拒绝:Crew 没有 backstory、Flow 没有显式 topic、Hierarchical 专家少于三位。

## 常见坑

- **把 backstory 当调味品。** 它塑造输出。每个智能体测三个变体;方差是真实的。挑一个,冻结。
- **跳过 `expected_output`。** 每个任务没有契约,下游任务就只能捡 LLM 产出的任何东西。Crew 能跑,审计挂掉。
- **记忆常开。** 长期记忆每轮都写,向量库膨胀,检索变噪。只在事实确实持久的任务上写。
- **manager 提示词漂移。** Hierarchical 的 manager 提示词是隐式的。路由变怪时,开 verbose 模式把它倒出来读。
- **Crew 里的工具副作用。** Crew 调用工具的次数可能超预期。POST、DELETE、支付属于 Flow 步骤,永远别放进 Crew 工具。

## 练习

1. 把 Sequential crew 改造成 Flow。数一遍可变性降低的触点,记下可读性在哪些地方下降了。
2. 给 crew 加实体记忆:关于客户的事实跨 kickoff 持久。验证检索拉到正确的实体。
3. 实现一个 Hierarchical 流程:writer 输出不足三段时,manager 拒绝路由给 editor。追踪这次重试。
4. 用 `BaseTool` 子类接一个(模拟的)网页搜索。对比它与 `@tool` 装饰器版本的轨迹形状。
5. 给 editor 任务加 `output_pydantic=Brief`,`Brief` 含 `title`、`summary`、`sections`。让 writer 任务产出一次格式错误的 JSON;在轨迹中验证 CrewAI 的重试行为。
6. 读 CrewAI 文档引言。把玩具移植到真实 `crewai` API。标准库版本跳过了哪些保证?
7. 给一次真实运行接上 AgentOps 或 Langfuse(第 24 课)。标准库版本漏了哪些轨迹?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| Agent | "人设" | 角色 + 目标 + backstory + 工具 |
| Task | "工作单元" | 描述 + 预期输出 + 执行者 + 可选结构化输出 |
| Crew | "智能体团队" | Agent + Task + Process 的容器 |
| Process | "执行策略" | Sequential / Hierarchical / Consensus(规划中) |
| Flow | "确定性工作流" | 事件驱动、代码掌控、可测试 |
| Backstory | "人设提示词" | Agent 的语气与判断塑造器 |
| `@tool` | "函数工具" | 把函数变成 Agent 可调用工具的装饰器 |
| `BaseTool` | "类工具" | 类形态工具:参数 schema、重试、异步支持 |
| 实体记忆 | "逐实体事实" | 按客户/账户/工单划界的记忆 |
| 长期记忆 | "跨运行记忆" | 向量支撑、跨 kickoff 存活的记忆 |
| 上下文记忆 | "即时检索" | 在 Agent 需要的当下拉取的记忆 |
| Manager LLM | "路由器智能体" | Hierarchical 流程中挑选下一个任务的额外 LLM |
| `expected_output` | "任务契约" | 告诉 Agent(和审计)该返回什么形状的字符串 |

## 延伸阅读

- [CrewAI 文档引言](https://docs.crewai.com/en/introduction):概念与推荐生产路径
- [CrewAI Flows 指南](https://docs.crewai.com/en/concepts/flows):事件驱动形态、`@start`、`@listen`
- [CrewAI 工具参考](https://docs.crewai.com/en/concepts/tools):`@tool`、`BaseTool`、内置工具包
- [CrewAI 记忆](https://docs.crewai.com/en/concepts/memory):短期、长期、实体、上下文
- [Anthropic,《构建高效智能体》](https://www.anthropic.com/research/building-effective-agents):多智能体何时有用、何时没用
- [LangGraph 概览](https://docs.langchain.com/oss/python/langgraph/overview):状态机替代方案
