---
title: Magentic 编排
icon: fa6-solid:wand-magic-sparkles
order: 10
category:
  - AI实践
  - Agent
  - .NET
---

# Magentic 编排 — 动态规划的复杂任务协作

第 9 篇讲了四种编排模式，都是"路径相对明确"的场景——顺序知道流程、并发各跑各的、群组聊天轮流发言、交接按规则路由。但有一类任务路径事先根本不知道，要走一步看一步，要边规划边执行边调整。这就是 Magentic 编排要解决的。

---

## 10.1 Magentic 是什么

Magentic 编排基于 AutoGen 团队发明的 Magentic-One 系统设计。核心思路是：一个强大的 Manager Agent 协调一个专家团队，根据任务进展实时决定下一步让谁干、怎么干。

和群组聊天看起来像——都是"一个 manager 协调多个 Agent"。区别在于 manager 的智能程度：

- **群组聊天的协调器**：只做"下一句谁说"这个简单决策，用轮循、内容匹配、或一个轻量 Agent 来选
- **Magentic 的 Manager**：会**做计划**——分析任务、拆解子任务、分配给合适的 Agent、跟踪进度、检测停滞、重新规划

打个比方，群组聊天的协调器像会议主持人，只管"下个谁发言"；Magentic 的 Manager 像项目经理，要拆任务、派活、盯进度、卡壳了要重新想办法。

## 10.2 适用场景

官方明确说，Magentic 适合"**方案路径事先未知的复杂开放式任务**"。这类任务有几个特征：

- 问题复杂，需要多轮推理、研究、计算
- 一开始没法写死流程，要边做边看
- 可能需要分解子任务、委托给不同专家
- 中途可能卡壳，要能自动调整方向

典型例子：让团队做一份"对比 ResNet-50、BERT-base、GPT-2 三个模型架构的训练和推理能耗，估算 CO2 排放，给出按任务类型的能效推荐"的报告。这种任务没法预先写死流程——要先研究找数据、再写代码算、可能算完发现数据不够要回去再研究、最后综合成报告。流程是动态的。

如果你能提前画清楚流程图，就别用 Magentic——用顺序或群组聊天更省事。Magentic 的复杂度是为"路径未知"换来的。

## 10.3 核心概念

### 10.3.1 Manager（管理器）

整个模式的中枢。一个完整的 Agent，有 instructions、能调工具、能监控对话。职责包括：

- 分析任务，创建初始计划
- 每轮选下一个发言者，给出指令
- 跟踪进度，判断任务是否完成
- 检测停滞，触发重新规划
- 最终把所有 Agent 的输出合成成最终结果

标准 Manager 基于 Magentic-One 论文的固定提示实现。想自定义有两种方式：通过构造函数传自己的提示，或继承 `MagenticManagerBase` 完全自己实现。

### 10.3.2 参与者 Agent

一组专门化的 Agent，每个有自己的职责。Manager 根据任务需要动态选择——可以按任意顺序、多次调用同一个 Agent。

原始 Magentic-One 设计有 4 个高度专业化的 Agent。框架里你可以自定义数量和职责，比如一个研究员 + 一个写代码的。

### 10.3.3 进度账本（Progress Ledger）

这是 Magentic 最核心的机制。每个协调轮，Manager 都会更新一个"进度账本"，包含：

- `IsRequestSatisfied`——请求是否已经满足
- `IsInLoop`——团队是不是在兜圈子
- `IsProgressBeingMade`——是不是在取得进展
- `NextSpeaker`——下一个该谁发言
- `InstructionOrQuestion`——给下一个 Agent 的指令

进度账本是 Manager 决策的依据，也是你观察工作流内部的窗口。每轮都会作为事件发出，你能实时看到 Manager 的判断。

### 10.3.4 停滞检测与重新规划

如果连续几轮 `IsProgressBeingMade` 都是 false（没进展），停滞计数器加 1。超过 `MaxStalls` 时触发自动重置和重新规划——Manager 重新分析任务、生成新计划。

这个机制让 Magentic 能从死胡同里走出来。群组聊天没有这个能力，一旦陷入循环只能靠硬上限终止。

## 10.4 怎么构建

注意 Magentic 用的不是 `AgentWorkflowBuilder`，是专门的 `MagenticWorkflowBuilder`（C#）或 `MagenticBuilder`（Python）。

先定义 Agent——一个 Manager + 多个参与者：

```csharp
#pragma warning disable MAAIW001  // Magentic types are experimental
#pragma warning disable OPENAI001 // HostedCodeInterpreterTool is experimental

using Azure.AI.Projects;
using Azure.Identity;
using Microsoft.Agents.AI;
using Microsoft.Agents.AI.Workflows;
using Microsoft.Agents.AI.Workflows.Specialized.Magentic;
using Microsoft.Extensions.AI;

string endpoint = Environment.GetEnvironmentVariable("AZURE_AI_PROJECT_ENDPOINT")
    ?? throw new InvalidOperationException("AZURE_AI_PROJECT_ENDPOINT is not set.");
string deploymentName = Environment.GetEnvironmentVariable("AZURE_AI_MODEL_DEPLOYMENT_NAME") ?? "gpt-5.4-mini";

AIProjectClient projectClient = new(new Uri(endpoint), new DefaultAzureCredential());

AIAgent researcherAgent = projectClient.AsAIAgent(
    deploymentName,
    name: "ResearcherAgent",
    description: "Specialist in research and information gathering.",
    instructions: "You are a researcher. Find relevant information without doing computation.");

AIAgent coderAgent = projectClient.AsAIAgent(
    deploymentName,
    name: "CoderAgent",
    description: "A helpful assistant that writes and executes code to analyze data.",
    instructions: "You solve quantitative questions by writing and running code.",
    tools: [new HostedCodeInterpreterTool()]);

AIAgent managerAgent = projectClient.AsAIAgent(
    deploymentName,
    name: "MagenticManager",
    description: "Orchestrator that coordinates the research and coding workflow.",
    instructions: "You coordinate the team to complete complex tasks efficiently.");
```

注意文件顶部的 `#pragma warning disable`——Magentic 类型标记为实验性，要显式禁用警告。

构建工作流：

```csharp
Workflow workflow = new MagenticWorkflowBuilder(managerAgent)
    .AddParticipants([researcherAgent, coderAgent])
    .WithName("Magentic Orchestration Workflow")
    .WithDescription("Coordinates a researcher and coder to solve a complex analytical task.")
    .RequirePlanSignoff(false)
    .WithMaxRounds(10)
    .WithMaxStalls(3)
    .WithMaxResets(2)
    .Build();
```

构建器方法含义：

| 方法 | 作用 |
|------|------|
| `AddParticipants([...])` | 添加参与 Agent 列表 |
| `WithName` / `WithDescription` | 工作流元信息 |
| `RequirePlanSignoff(bool)` | 是否要人审计划，默认 true |
| `WithMaxRounds(int)` | 最大协调轮次 |
| `WithMaxStalls(int)` | 重新规划前允许的最大连续停滞次数 |
| `WithMaxResets(int)` | 最大计划重置次数 |

三个上限参数是安全网——防止 Manager 永远转下去烧 token。

## 10.5 执行模式

Magentic 的执行是个迭代循环：

```
1. 规划阶段        → Manager 分析任务，创建初始计划
2. 可选计划评审     → 人审阅和批准/修改计划（RequirePlanSignoff 控制）
3. 代理选择        → Manager 为每个子任务选最合适的 Agent
4. 执行           → 选中的 Agent 执行任务
5. 进度评估        → Manager 评估进度，更新进度账本
6. 停滞检测        → 没进展就重新规划（可选人审）
7. 迭代           → 步骤 3-6 重复，直到完成或达上限
8. 最终合成        → Manager 把所有 Agent 输出合成成最终结果
```

这个循环体现了"动态规划"——不是一开始定死计划，而是边执行边调整。

## 10.6 三个里程碑事件

Magentic 比 其他编排多三种事件，让你观察 Manager 的"思考过程"：

| 事件 | 说明 |
|------|------|
| `MagenticPlanCreatedEvent` | Manager 生成初始计划 |
| `MagenticReplannedEvent` | 检测到停滞或人审修改后，重新规划 |
| `MagenticProgressLedgerUpdatedEvent` | 每轮发出，承载当前进度账本 |

监听这些事件能实时看到 Manager 在想什么——计划是什么、判断进度如何、下一步让谁干。这是调试 Magentic 工作流的关键手段。

完整的事件处理代码：

```csharp
const string TaskPrompt = "...";  // 你的复杂任务

await using StreamingRun run = await InProcessExecution.RunStreamingAsync(
    workflow,
    new List<ChatMessage> { new(ChatRole.User, TaskPrompt) });

await run.TrySendMessageAsync(new TurnToken(emitEvents: true));

string? lastResponseId = null;
WorkflowOutputEvent? finalOutput = null;

await foreach (WorkflowEvent workflowEvent in run.WatchStreamAsync())
{
    switch (workflowEvent)
    {
        case AgentResponseUpdateEvent updateEvent:
            string responseId = updateEvent.Update.ResponseId
                ?? updateEvent.Update.MessageId
                ?? updateEvent.ExecutorId;
            if (!string.Equals(responseId, lastResponseId, StringComparison.Ordinal))
            {
                if (lastResponseId is not null) Console.WriteLine();
                Console.Write($"- {updateEvent.ExecutorId}: ");
                lastResponseId = responseId;
            }
            Console.Write(updateEvent.Update.Text);
            break;

        case MagenticPlanCreatedEvent planCreated:
            Console.WriteLine($"\n[初始计划]\n{planCreated.FullTaskLedger.Text}");
            break;

        case MagenticReplannedEvent replanned:
            Console.WriteLine($"\n[重新规划]\n{replanned.FullTaskLedger.Text}");
            break;

        case MagenticProgressLedgerUpdatedEvent progressUpdated:
            MagenticProgressLedger ledger = progressUpdated.ProgressLedger;
            Console.WriteLine(
                $"\n[进度账本] 已满足={ledger.IsRequestSatisfied}, " +
                $"循环中={ledger.IsInLoop}, 有进展={ledger.IsProgressBeingMade}, " +
                $"下一发言者={ledger.NextSpeaker}, 指令={ledger.InstructionOrQuestion}");
            break;

        case WorkflowOutputEvent outputEvent when outputEvent.Is<List<ChatMessage>>():
            finalOutput = outputEvent;
            break;
    }
}

if (finalOutput?.As<List<ChatMessage>>() is { } transcript)
{
    Console.WriteLine("\n=== 最终对话记录 ===\n");
    foreach (ChatMessage message in transcript)
        Console.WriteLine($"{message.AuthorName ?? message.Role.ToString()}: {message.Text}");
}
```

这段代码把每个 Agent 的流式输出、Manager 的计划、进度账本、最终结果都打出来。实际跑起来你能看到 Manager 是怎么一步步拆任务、派活、调整的。

## 10.7 人机循环：计划评审

`RequirePlanSignoff(true)` 开启后，Manager 生成计划后会暂停，发出 `RequestInfoEvent`，等人审阅。人可以批准或要求修改。

这个机制比第 8 篇的通用 HITL 更进一步——不是审批单个工具调用，而是审批整个计划。复杂任务里，让 Manager 先列计划、人确认后再执行，能避免跑偏。

完整的人审流程涉及检查点和恢复：

```csharp
Workflow workflow = new MagenticWorkflowBuilder(managerAgent)
    .AddParticipants([researcherAgent, coderAgent])
    .RequirePlanSignoff(true)  // 开启计划评审
    .WithMaxRounds(10)
    .WithMaxStalls(1)
    .WithMaxResets(2)
    .Build();

CheckpointManager checkpointManager = CheckpointManager.CreateInMemory();
InProcessExecutionEnvironment environment = ExecutionEnvironment.InProcess_Lockstep
    .ToWorkflowExecutionEnvironment()
    .WithCheckpointing(checkpointManager);

await using StreamingRun run = await environment.OpenStreamingAsync(workflow);
await run.TrySendMessageAsync(new List<ChatMessage> { new(ChatRole.User, TaskPrompt) });
await run.TrySendMessageAsync(new TurnToken(emitEvents: true));

ExternalRequest? pendingRequest = null;
CheckpointInfo? lastCheckpoint = null;
WorkflowOutputEvent? finalOutput = null;

async Task<WorkflowOutputEvent?> DrainAsync(StreamingRun activeRun)
{
    WorkflowOutputEvent? output = null;
    await foreach (WorkflowEvent evt in activeRun.WatchStreamAsync(blockOnPendingRequest: false))
    {
        switch (evt)
        {
            case AgentResponseUpdateEvent updateEvent:
                Console.Write(updateEvent.Update.Text);
                break;
            case RequestInfoEvent requestInfo
                when requestInfo.Request.Data.As<MagenticPlanReviewRequest>() is not null:
                pendingRequest = requestInfo.Request;
                break;
            case SuperStepCompletedEvent stepCompleted:
                lastCheckpoint = stepCompleted.CompletionInfo?.Checkpoint ?? lastCheckpoint;
                break;
            case WorkflowOutputEvent outputEvent when outputEvent.Is<List<ChatMessage>>():
                output = outputEvent;
                break;
        }
    }
    return output;
}

finalOutput = await DrainAsync(run);

// 循环处理计划评审，直到工作流完成
while (finalOutput is null && pendingRequest is not null)
{
    MagenticPlanReviewRequest reviewRequest = pendingRequest.Data.As<MagenticPlanReviewRequest>()!;

    Console.WriteLine("\n[计划评审请求]");
    if (reviewRequest.CurrentProgress is { } progress)
    {
        Console.WriteLine(
            $"当前进度: 已满足={progress.IsRequestSatisfied}, " +
            $"循环中={progress.IsInLoop}, 有进展={progress.IsProgressBeingMade}");
    }
    Console.WriteLine($"提议的计划:\n{reviewRequest.Plan.Text}\n");
    Console.Write("按 Enter 批准，或输入反馈要求修改: ");

    string reply = Console.ReadLine() ?? string.Empty;
    MagenticPlanReviewResponse reviewResponse = string.IsNullOrWhiteSpace(reply)
        ? reviewRequest.Approve()
        : reviewRequest.Revise(reply);

    ExternalResponse response = pendingRequest.CreateResponse(reviewResponse);
    pendingRequest = null;

    // 从最近的检查点恢复，继续执行
    await using StreamingRun resumed = await environment.ResumeStreamingAsync(workflow, lastCheckpoint!);
    await resumed.SendResponseAsync(response);
    finalOutput = await DrainAsync(resumed);
}
```

几个关键点：

- 用 `ExecutionEnvironment` + `CheckpointManager` 开启检查点——人审期间工作流暂停，要能恢复
- `WatchStreamAsync(blockOnPendingRequest: false)`——遇到 `RequestInfoEvent` 不阻塞，让你能拿到请求去处理
- `MagenticPlanReviewRequest` 是计划评审的请求类型，里面有 Manager 提议的计划
- 人回复 `Approve()` 批准，或 `Revise(feedback)` 要求修改
- 从 `lastCheckpoint` 恢复继续执行

这段代码把第 8 篇的检查点、HITL 机制都用上了。Magentic 的计划评审是这些机制的高级应用。

## 10.8 终止机制

Magentic 有多重终止保险：

| 机制 | 说明 |
|------|------|
| `MaxRounds` | 最大协调轮次，到了就停 |
| `MaxStalls` | 连续停滞超过这个值触发重新规划 |
| `MaxResets` | 计划重置超过这个值就停 |
| `IsRequestSatisfied` | Manager 判断任务完成，正常终止 |

实战中这四个都要设。前三个是硬上限防止失控，最后一个是正常终止。光靠 `IsRequestSatisfied` 有风险——如果 Manager 判断失误一直说没满足，会无限跑下去。

## 10.9 和其他编排的对比

把 Magentic 放到第 9 篇的四种模式里对比：

| 维度 | 顺序 | 并发 | 群组聊天 | 交接 | Magentic |
|------|------|------|---------|------|---------|
| **路径确定性** | 完全确定 | 各自独立 | 协调器决定 | Agent 决定 | **Manager 动态规划** |
| **协调智能** | 无 | 无 | 低（选发言者） | 中（按规则交接） | **高（做计划、跟踪、重规划）** |
| **适合任务** | 固定流水线 | 多视角并行 | 迭代对话 | 路由分发 | **开放式复杂任务** |
| **token 消耗** | 中 | 低 | 高 | 中 | **最高** |
| **复杂度** | 低 | 低 | 中 | 中 | **最高** |

选型建议：

- 路径明确 → 顺序
- 多视角独立分析 → 并发
- 多轮迭代改进 → 群组聊天
- 动态路由 → 交接
- **路径未知、要边规划边执行 → Magentic**

## 10.10 限制和注意事项

**性能未经验证**。官方明确说："在原始 Magentic-One 设计之外，Magentic 编排的性能尚未经过测试。"原始论文用 4 个高度专业化的 Agent 做特定任务，你自定义的团队效果可能不一样。生产环境用要做好测试。

**实验性类型**。Magentic 标记为实验性，代码要禁用 `MAAIW001` 警告。API 可能在未来版本变动，别用在不能接受变动的地方。

**中间输出 C# 不支持**。`intermediate_output_from` 目前只支持 Python，C# 暂时拿不到中间 Agent 的输出。

**计划评审默认值跨语言不一致**。Python 默认关闭（`enable_plan_review=False`），.NET 默认开启（`RequirePlanSignoff` 默认 true）。跨语言迁移时要注意。

**token 消耗高**。Manager 每轮都要做规划决策，每次都是完整的 LLM 调用。加上参与者的调用，token 消耗比其他模式都高。复杂任务跑一轮可能烧掉几十万 token。预算敏感场景慎用。

**复杂度最高**。Magentic 是五种编排里最复杂的。如果你的任务能用更简单的模式解决，就别上 Magentic——它带来的复杂度和成本不值得。官方原话："如果你的方案需要更简单的协调而不进行复杂的规划，请考虑改用群聊模式。"

## 10.11 几个注意事项

**用 Magentic 解决简单问题**。这是最大的问题。Magentic 的复杂度和成本是为复杂开放式任务准备的，简单任务用它是杀鸡用牛刀。能用顺序就用顺序，能用群组聊天就用群组聊天。

**不设上限参数**。`MaxRounds`、`MaxStalls`、`MaxResets` 三个都要设。不设的话 Manager 可能无限循环，token 烧到爆。

**Manager 的 instructions 写得不好**。Manager 是整个模式的中枢，它的 instructions 决定了规划质量。写得太笼统，Manager 不知道怎么拆任务、怎么选人。要明确告诉 Manager 任务的性质、有哪些专家、怎么协作。

**参与者 Agent 的 description 不清晰**。Manager 靠 description 决定让谁干。description 含糊，Manager 会选错人。每个参与者的 description 要明确说"我擅长什么、不擅长什么"。

**计划评审流程忘记处理**。`RequirePlanSignoff(true)` 开启后要监听 `RequestInfoEvent` 并响应，否则工作流会一直暂停。完整的处理代码见 10.7 节，涉及检查点和恢复。

**忽视进度账本事件**。`MagenticProgressLedgerUpdatedEvent` 是调试 Magentic 的金矿——能看到 Manager 每轮的判断。不监听它，出了问题只能靠猜。

**期望它和原始 Magentic-One 一样强**。官方明确说性能未经验证。原始论文的 4 个 Agent 是专门设计的，你自定义的团队效果可能差很多。生产用要充分测试。

## 10.12 自测题

1. Magentic 和群组聊天的根本区别是什么？什么场景该用 Magentic 而不是群组聊天？
2. Manager 的职责有哪些？它和参与者的关系是什么？
3. 进度账本（Progress Ledger）包含哪些字段？为什么说它是 Manager 决策的依据？
4. 停滞检测是怎么工作的？触发后会做什么？
5. 三个里程碑事件分别是什么？分别什么时候发出？
6. `RequirePlanSignoff(true)` 开启后，完整的处理流程是怎样的？涉及哪些机制？
7. 三个上限参数（MaxRounds、MaxStalls、MaxResets）分别防什么？不设会怎样？
8. Magentic 的主要限制有哪些？为什么官方说性能未经验证？
9. Magentic 和"Agent 作为工具"（第 2 篇）有什么本质区别？
10. 什么情况下绝对不要用 Magentic？

---

五种编排模式（顺序、并发、群组聊天、交接、Magentic）全部讲完。配合前几篇的 Agent 内部机制、工作流高级模式，框架的核心能力地图已经完整。下一步可以结合官方 samples 动手实践，把概念落到代码上。
