---
title: 多 Agent 编排模式
icon: fa6-solid:sitemap
order: 9
category:
  - AI实践
  - Agent
  - .NET
---

# 多 Agent 编排模式 — 顺序、并发、群组聊天、交接

第 7、8 篇讲了 Agent 内部和工作流内部的机制。这一篇把它们串起来——多个 Agent 怎么协作。框架提供了四种现成的编排模式，每种针对一类典型场景。理解这四种模式的边界，碰到需求能快速选对。

---

## 9.1 四种模式速览

先给个全局认知，后面再展开每种。

**顺序编排（Sequential）**——Agent 排成流水线，前一个的输出是后一个的输入。适合阶段性处理，比如"写手→审稿→编辑"。

**并发编排（Concurrent）**——多个 Agent 同时处理同一个输入，各自独立工作，最后汇总结果。适合多视角分析，比如"研究、营销、法务三个专家同时看一个产品方案"。

**群组聊天（Group Chat）**——多个 Agent 围绕一个话题迭代对话，由协调器决定谁来说下一句。适合迭代优化，比如"写手提方案，审稿提意见，写手改，审稿再提"。

**交接编排（Handoff）**——Agent 之间直接转移控制权，没有中央协调器。适合路由分发，比如"分诊 Agent 判断问题类型，交给对应专家 Agent 处理"。

选型原则记一句话：**要固定流程用顺序，要并行多视角用并发，要迭代协作用群组聊天，要动态路由用交接**。

## 9.2 顺序编排 — 流水线

### 9.2.1 模式特征

Agent 按 `participants` 列表的顺序依次执行，每个 Agent 在上一个 Agent 输出的基础上构建。输出从第一个流向最后一个，形成流水线。

默认情况下，每个 Agent 能看到上一个 Agent 的完整会话——包括输入消息和响应消息。这点要注意，长流水线会让上下文越积越多，可以用 `chain_only_agent_responses=True`（Python）让每个 Agent 只看上一个 Agent 的响应，不看输入，避免上下文膨胀。

### 9.2.2 怎么构建

C# 用 `AgentWorkflowBuilder.BuildSequential`：

```csharp
// 创建三个翻译 Agent：法→西、西→英、最终输出
static ChatClientAgent GetTranslationAgent(string targetLanguage, IChatClient chatClient) =>
    new(chatClient,
        $"You are a translation assistant who only responds in {targetLanguage}. " +
        $"Output the input language and translate to {targetLanguage}.");

var translationAgents = (from lang in (string[])["French", "Spanish", "English"]
                         select GetTranslationAgent(lang, client));

var workflow = AgentWorkflowBuilder.BuildSequential(translationAgents);
```

运行和普通工作流一样，监听 `AgentResponseUpdateEvent` 看每个 Agent 的流式输出：

```csharp
var messages = new List<ChatMessage> { new(ChatRole.User, "Hello, world!") };

await using StreamingRun run = await InProcessExecution.RunStreamingAsync(workflow, messages);
await run.TrySendMessageAsync(new TurnToken(emitEvents: true));

string? lastExecutorId = null;
await foreach (WorkflowEvent evt in run.WatchStreamAsync())
{
    if (evt is AgentResponseUpdateEvent e)
    {
        if (e.ExecutorId != lastExecutorId)
        {
            lastExecutorId = e.ExecutorId;
            Console.WriteLine();
            Console.Write($"{e.ExecutorId}: ");
        }
        Console.Write(e.Update.Text);
    }
    else if (evt is WorkflowOutputEvent outputEvt)
    {
        break;
    }
}
```

输入 `"Hello, world!"`，第一个 Agent 翻成法语、第二个翻成西班牙语、第三个翻成英语，每个 Agent 都能看到上一个的输出。

### 9.2.3 中间输出

默认只有最后一个 Agent 的输出是工作流最终输出。如果你想拿到中间 Agent 的输出（比如想看写手写的内容，不只是最后编辑过的），用 `intermediate_output_from` 指定：

```python
workflow = SequentialBuilder(
    participants=[writer, reviewer, editor],
    intermediate_output_from=[writer, reviewer],
).build()
```

这样写手和审稿的输出会作为 `"intermediate"` 事件发出，编辑的输出还是 `"output"` 事件。这两个事件的区别在第 5 篇讲过——`final_output_from` 决定哪个是终值，`intermediate_output_from` 决定哪些算中间观察值。

### 9.2.4 配合人机循环

顺序编排内置支持两种 HITL。

**工具审批**——用 `ApprovalRequiredAIFunction` 包装敏感工具。Agent 调用这个工具时，工作流自动暂停发 `RequestInfoEvent`：

```csharp
ChatClientAgent deployAgent = new(
    client,
    "You are a DevOps engineer. Check staging status, then deploy to production.",
    "DeployAgent",
    "Handles deployments",
    [
        AIFunctionFactory.Create(CheckStagingStatus),
        new ApprovalRequiredAIFunction(AIFunctionFactory.Create(DeployToProduction))
    ]);

var workflow = AgentWorkflowBuilder.BuildSequential([deployAgent, verifyAgent]);

await foreach (WorkflowEvent evt in run.WatchStreamAsync())
{
    if (evt is RequestInfoEvent e &&
        e.Request.TryGetDataAs(out ToolApprovalRequestContent? approvalRequest))
    {
        // 人审后批准
        await run.SendResponseAsync(
            e.Request.CreateResponse(approvalRequest.CreateResponse(approved: true)));
    }
}
```

这是第 8 篇工具审批在编排里的现成应用，不用自己搭 RequestPort。

**请求信息**——在特定 Agent 后暂停，让外部（人）介入提供反馈，再让下一个 Agent 继续。Python 用 `.with_request_info(agents=["editor"])` 指定哪些 Agent 后面要暂停。

### 9.2.5 混合自定义执行器

顺序编排不只能放 Agent，还能混入自定义执行器。比如最后一步让普通代码做总结，不让 LLM 做。但有个合约要遵守——作为最后一个参与者的自定义执行器**必须**调 `ctx.yield_output(AgentResponse(...))`，否则工作流没有终值输出。

### 9.2.6 适用场景和限制

适合：文档审阅流水线、数据处理管道、多阶段推理、翻译链、写作-审阅-编辑流程、部署审批。

限制：严格顺序，不能并行（要并行用并发编排）；默认上下文消耗大，长流水线要用 `chain_only_agent_responses` 控制；终止器合约要遵守。

## 9.3 并发编排 — 多视角并行

### 9.3.1 模式特征

多个 Agent 同时处理同一个输入，各自独立工作，互不干扰，最后汇总结果。每个 Agent 带来不同的专业视角，适合需要多种观点或方案的场景——头脑风暴、集体推理、投票。

和顺序编排的根本区别：顺序是"接力跑"，并发是"同时起跑各跑各的"。

### 9.3.2 怎么构建

C# 用 `AgentWorkflowBuilder.BuildConcurrent`：

```csharp
static ChatClientAgent GetTranslationAgent(string targetLanguage, IChatClient chatClient) =>
    new(chatClient,
        $"You are a translation assistant who only responds in {targetLanguage}.");

var translationAgents = (from lang in (string[])["French", "Spanish", "English"]
                         select GetTranslationAgent(lang, client));

var workflow = AgentWorkflowBuilder.BuildConcurrent(translationAgents);
```

运行也是监听事件流。每个 Agent 完成后会发 `AgentResponseUpdateEvent`，所有 Agent 都完成后发 `WorkflowOutputEvent`：

```csharp
var messages = new List<ChatMessage> { new(ChatRole.User, "Hello, world!") };

await using StreamingRun run = await InProcessExecution.RunStreamingAsync(workflow, messages);
await run.TrySendMessageAsync(new TurnToken(emitEvents: true));

List<ChatMessage> result = new();
await foreach (WorkflowEvent evt in run.WatchStreamAsync())
{
    if (evt is AgentResponseUpdateEvent e)
        Console.WriteLine($"{e.ExecutorId}: {e.Update.Text}");
    else if (evt is WorkflowOutputEvent outputEvt)
    {
        result = outputEvt.As<List<ChatMessage>>()!;
        break;
    }
}
```

三个 Agent 同时翻译同一句话，输出三个不同语言的翻译。

### 9.3.3 默认聚合 vs 自定义聚合

默认聚合器把所有 Agent 的响应合并成一个 `AgentResponse`，每个参与者一条助手消息。简单场景够用。

但很多时候你要的不是"把三个回答拼一起"，而是"让另一个 Agent 把三个回答综合成一份报告"。这时用自定义聚合器：

```python
summarizer_agent = chat_client.as_agent(
    instructions="You consolidate multiple domain expert outputs into one cohesive summary.",
    name="summarizer",
)

async def summarize_results(results: list[AgentExecutorResponse]) -> str:
    expert_sections = []
    for r in results:
        messages = getattr(r.agent_response, "messages", [])
        final_text = messages[-1].text if messages else "(no content)"
        expert_sections.append(f"{r.executor_id}:\n{final_text}")

    prompt = "\n\n".join(expert_sections)
    response = await summarizer_agent.run(prompt)
    return response.messages[-1].text if response.messages else ""

workflow = (
    ConcurrentBuilder(participants=[researcher, marketer, legal])
    .with_aggregator(summarize_results)
    .build()
)
```

三个专家并发分析，最后让总结 Agent 综合成一份报告。这是并发编排最常见的实战模式——**并发执行 + 智能聚合**。

### 9.3.4 适用场景

适合：多视角分析（研究/营销/法务同时看一个方案）、头脑风暴（多个 Agent 各提方案）、集体推理、投票系统、多模型对比（同一个问题让不同模型回答对比）。

不适合：需要严格顺序的流程（用顺序编排）、Agent 之间要迭代互动（用群组聊天）。

## 9.4 群组聊天 — 迭代协作

### 9.4.1 模式特征

多个 Agent 围绕一个话题进行多轮对话，由协调器（manager/orchestrator）决定每一轮谁来发言。所有 Agent 看到完整的对话历史，能互相借鉴反馈进行改进。

和并发的区别：并发是"各跑各的，最后汇总"，群组聊天是"轮流发言，互相参考"。
和顺序的区别：顺序是"写死的流水线"，群组聊天是"协调器动态决定下一步谁说"。

拓扑结构是星形——中间一个协调器，周围是参与者。协调器负责选下一发言者，参与者负责实际发言。

### 9.4.2 说话人选择策略

协调器怎么决定下一发言者？有几种策略：

**轮循（Round-Robin）**——按参与者列表顺序轮流。最简单，C# 用内置的 `RoundRobinGroupChatManager`：

```csharp
var workflow = AgentWorkflowBuilder
    .CreateGroupChatBuilderWith(agents =>
        new RoundRobinGroupChatManager(agents)
        {
            MaximumIterationCount = 5  // 最多 5 轮
        })
    .AddParticipants(writer, reviewer)
    .Build();
```

`MaximumIterationCount` 是硬上限，防止无限循环。即使协调器不主动终止，到这个数也会停。

**基于内容的选择**——Python 写个 `selection_func`，根据对话状态决定下一发言者：

```python
def smart_selector(state: GroupChatState) -> str:
    last_message = state.conversation[-1] if state.conversation else None
    if not last_message:
        return "Researcher"
    last_text = last_message.text.lower()
    if "i have finished" in last_text and last_message.author_name == "Researcher":
        return "Writer"
    return "Researcher"

workflow = GroupChatBuilder(
    participants=[researcher, writer],
    termination_condition=lambda conversation: len(conversation) >= 4,
    selection_func=smart_selector,
).build()
```

这种能根据对话内容做智能路由——研究员说"我搞完了"就切到写手，否则继续让研究员干。

**Agent 作为协调器**——让一个完整的 Agent 当协调器，它有 instructions、能调工具、能监控对话，最灵活。但成本也最高，每一轮选发言者都要调一次 LLM。

### 9.4.3 终止条件

群组聊天必须有终止条件，否则会一直转。两种方式：

- `termination_condition`——一个 lambda，接收对话历史返回 bool。比如"超过 4 条消息就停"
- 自定义 manager 重写 `ShouldTerminateAsync`——根据内容判断，比如"审稿说了 approve 就停"

```csharp
public class ApprovalBasedManager : RoundRobinGroupChatManager
{
    private readonly string _approverName;
    public ApprovalBasedManager(IReadOnlyList<AIAgent> agents, string approverName)
        : base(agents) => _approverName = approverName;

    protected override ValueTask<bool> ShouldTerminateAsync(
        IReadOnlyList<ChatMessage> history, CancellationToken ct = default)
    {
        var last = history.LastOrDefault();
        bool shouldTerminate = last?.AuthorName == _approverName &&
            last.Text?.Contains("approve", StringComparison.OrdinalIgnoreCase) == true;
        return ValueTask.FromResult(shouldTerminate);
    }
}
```

实战中通常两个一起用——内容条件 + 硬上限，防止内容条件永远不满足时无限循环。

### 9.4.4 上下文同步

群组聊天里所有 Agent 看到完整的对话历史。但**它们不共享同一个 `AgentSession` 实例**——因为不同 Agent 类型可能有不同的 `AgentSession` 实现，共享会出问题。

协调器在每个 Agent 发言后，把响应广播给所有其他 Agent 的 session，确保下一轮每个人手上的上下文都是最新的。然后协调器选下一发言者，给那个 Agent 发请求，那个 Agent 带着完整历史生成响应。

理解这个机制能解释一个现象：群组聊天的 token 消耗比顺序编排高得多——每轮每个 Agent 都要同步完整历史，N 个 Agent 跑 M 轮，token 是 N×M 倍增长。所以群组聊天要严格控制 `MaximumIterationCount` 和参与者数量。

### 9.4.5 适用场景

适合：迭代优化（写手-审稿多轮）、协作解决问题、内容创建流程、多角度分析、自动审批流程。

不适合：严格顺序处理（用顺序）、Agent 完全独立工作（用并发）、Agent 间直接切换（用交接）、需要复杂动态规划（用 Magentic 编排，本书不展开）。

## 9.5 交接编排 — 动态路由

### 9.5.1 模式特征

Agent 之间直接转移控制权，没有中央协调器。每个 Agent 根据上下文或用户请求，决定把对话"交接"给哪个 Agent。接收方拿到完整对话历史，承担任务的完全所有权。

和群组聊天的根本区别：群组聊天有中央协调器决定谁说话，交接是 Agent 自己决定交给谁。拓扑结构是网状，不是星形。

和"Agent 作为工具"（第 2 篇的 `AsAIFunction`）的区别也要分清：

| 维度 | 交接 | Agent 作为工具 |
|------|------|--------------|
| 控制流 | Agent 间显式传递，无中央权威 | 主 Agent 委派子任务，控制权返回主 Agent |
| 任务所有权 | 接收方完全接管 | 主 Agent 始终负责整体 |
| 上下文 | 完整对话移交 | 主 Agent 管理，按需给工具 Agent |

### 9.5.2 交接机制

交接是通过"工具调用"实现的。框架内部用 `HandoffAgentExecutor` 包装每个 Agent，做三件事：

1. **注入交接工具**——根据配置的交接规则，给每个 Agent 注册"切换到 X"的工具
2. **检测交接调用**——检查 Agent 的响应，如果调用了交接工具，把控制权路由到目标 Agent
3. **过滤工具调用**——转发到下一个 Agent 之前，过滤掉交接工具的调用记录，避免混淆模型

也就是说，Agent 决定交接的方式是"调用一个特殊工具"。LLM 根据用户问题判断该交给谁，调对应工具，框架自动路由。

### 9.5.3 怎么配置

C# 用 `AgentWorkflowBuilder.CreateHandoffBuilderWith`：

```csharp
ChatClientAgent triageAgent = new(client,
    "You determine which agent to use based on the user's question. ALWAYS handoff to another agent.",
    "triage_agent",
    "Routes messages to the appropriate specialist");

ChatClientAgent mathTutor = new(client,
    "You help with math problems. Explain reasoning step by step.",
    "math_tutor",
    "Specialist for math");

ChatClientAgent historyTutor = new(client,
    "You help with historical queries. Explain events clearly.",
    "history_tutor",
    "Specialist for history");

var workflow = AgentWorkflowBuilder.CreateHandoffBuilderWith(triageAgent)
    .WithHandoffs(triageAgent, [mathTutor, historyTutor])  // 分诊能交给任一专家
    .WithHandoffs([mathTutor, historyTutor], triageAgent)  // 专家能交回分诊
    .Build();
```

`WithHandoffs(from, to)` 定义谁能交给谁。这里分诊 Agent 能交给数学或历史专家，专家能交回分诊。这是个典型的客服路由模式。

### 9.5.4 交互式特性

交接编排有个独特的地方——它是**交互式**的。Agent 不一定每轮都交接，如果不交接，工作流会暂停发 `RequestInfoEvent`，等用户输入才能继续。

这符合直觉——分诊 Agent 把问题交给数学专家，数学专家回答完了，用户可能还有 follow-up 问题。Agent 不交接就意味着"等用户说话"，工作流就暂停。

### 9.5.5 上下文同步

和群组聊天类似，所有参与者不共享同一个 session 实例，但参与者负责广播响应让其他人保持上下文同步。区别是：**交接工具调用本身不会传给其他 Agent**，只有用户消息和 Agent 消息同步。这是为了防止内部工作机制（工具调用记录）污染其他 Agent 的上下文。

### 9.5.6 适用场景

适合：客户支持（分诊→退款/订单/退货专家）、专家系统（按问题领域动态委派）、多轮对话中的动态路由、需要 HITL 的敏感操作场景。

不适合：固定流程（用顺序）、需要并行多视角（用并发）、需要迭代协作（用群组聊天）。

## 9.6 四种模式对比

把四种模式放一起对比，方便选型：

| 维度 | 顺序 | 并发 | 群组聊天 | 交接 |
|------|------|------|---------|------|
| **拓扑** | 链式 | 扇出扇入 | 星形（有协调器） | 网状（无协调器） |
| **控制权** | 固定顺序 | 各自独立 | 协调器决定 | Agent 自己决定 |
| **Agent 互动** | 单向传下游 | 不互动 | 多轮互相参考 | 交接后接管 |
| **上下文** | 默认完整传递 | 各自独立 | 全员同步完整历史 | 完整移交 |
| **典型场景** | 写作-审阅-编辑 | 多视角分析 | 迭代优化 | 客服路由 |
| **token 消耗** | 中 | 低（并行但各跑各的） | 高（N×M 同步） | 中 |
| **终止** | 跑完最后一步 | 全部完成 | 终止条件 + 上限 | 交接或等用户 |

选型流程：

1. 流程是固定的、阶段性的？→ 顺序
2. 多个 Agent 各看各的、最后汇总？→ 并发
3. 需要 Agent 之间多轮互动改进？→ 群组聊天
4. 根据内容动态路由给不同专家？→ 交接

## 9.7 通用机制

这四种模式都用第 5、8 章讲过的工作流底层机制，不用重复学：

**运行方式**——都是 `InProcessExecution.RunStreamingAsync`，监听 `WatchStreamAsync()` 的事件流。事件类型也通用：`AgentResponseUpdateEvent`、`WorkflowOutputEvent`、`RequestInfoEvent` 等。

**中间输出**——都支持 `intermediate_output_from` 指定哪些参与者发 `"intermediate"` 事件。默认只有最终输出发 `"output"` 事件。

**人机循环**——都支持工具审批和请求信息两种 HITL。顺序编排内置 `ApprovalRequiredAIFunction`，其他模式也能用。

**检查点**——都支持检查点和恢复。长任务用 `CosmosCheckpointStorage` 持久化，崩了能续。

**自定义执行器混合**——都能在 Agent 之外混入自定义执行器，但要注意终止器合约（最后一个参与者必须 `yield_output`）。

## 9.8 几个注意事项

**顺序编排上下文膨胀**。默认每个 Agent 看到上一个的完整会话，长流水线会让后面的 Agent 上下文爆炸。用 `chain_only_agent_responses=True` 控制，或者用自定义执行器做中间裁剪。

**群组聊天不设终止条件**。没终止条件会无限循环烧 token。必须设 `termination_condition` 或 `MaximumIterationCount`，最好两个都设——内容条件 + 硬上限。
**群组聊天 token 爆炸**。N 个 Agent 跑 M 轮，每轮每个 Agent 都同步完整历史，token 是 N×M 倍增长。控制参与者数量和轮次上限，3-4 个 Agent、5-10 轮是合理范围。

**交接编排的交互式特性被忽略**。Agent 不交接时会暂停等用户输入。如果你的场景是"一次输入一次输出"，忘记处理这个暂停会让程序卡住。要监听 `RequestInfoEvent` 并响应。

**交接规则配置不全**。`WithHandoffs` 只配了"分诊→专家"但忘了配"专家→分诊"，专家处理完就卡死，没法交回。配置时要考虑完整的往返路径。

**自定义聚合器忘记返回值**。并发编排用自定义聚合器时，聚合函数必须返回结果。如果异步操作出错没返回，工作流会卡在等聚合结果。

**混合自定义执行器不调 `yield_output`**。作为最后一个参与者的自定义执行器必须 `ctx.yield_output(AgentResponse(...))`，否则工作流没有终值输出，一直等。这是官方反复强调的合约。

**并发编排里 Agent 间隐式依赖**。并发是"各跑各的"，如果你在 Agent 间设计了隐式依赖（A 的输出影响 B 的输入），那不是并发场景，应该用顺序或群组聊天。强行用并发会得到错误结果。

## 9.9 自测题

1. 四种编排模式分别适合什么场景？给一个判断流程。
2. 顺序编排默认每个 Agent 看到什么？怎么控制只看上一个的响应？
3. 并发编排的默认聚合器和自定义聚合器有什么区别？什么时候要用自定义？
4. 群组聊天的协调器有哪几种说话人选择策略？各自优缺点？
5. 群组聊天为什么 token 消耗高？怎么控制？
6. 交接编排和"Agent 作为工具"有什么本质区别？
7. 交接是怎么实现的？Agent 怎么"决定"交接？
8. 交接编排为什么是交互式的？Agent 不交接时会怎样？
9. 混合自定义执行器作为最后一个参与者时，必须做什么？
10. 四种模式在终止机制上各有什么不同？

---

下一篇讲 [Magentic 编排](10_Magentic编排.md)——动态规划的复杂任务协作，把多 Agent 编排推向更自主的场景。
