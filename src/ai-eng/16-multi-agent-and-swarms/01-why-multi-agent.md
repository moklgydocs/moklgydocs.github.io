# 为什么要多智能体?

> 单个智能体总会撞墙。聪明的做法不是把智能体做得更大,而是让更多智能体一起上。

**类型:** 学习
**编程语言:** TypeScript
**前置要求:** 第 14 阶段(智能体工程)
**预计耗时:** 约 60 分钟

## 学习目标

- 识别单智能体天花板(上下文溢出、专长混杂、串行瓶颈),并解释何时拆成多智能体才是正确选择
- 比较编排模式(流水线、并行扇出、监督者、层级),为给定任务结构选出合适的一种
- 设计一个有清晰角色边界、共享状态和通信契约的多智能体系统
- 分析多智能体复杂度(延迟、成本、调试难度)与单智能体简洁性之间的取舍

## 问题

你在第 14 阶段搭了一个单智能体。它能用:读文件、跑命令、调 API、对结果做推理。然后你把它指向一个真实代码库:200 个文件、三种语言、依赖基础设施的测试,还要求写代码前先调研外部 API。

智能体噎住了。不是 LLM 笨,而是任务超出了单个智能体循环能扛的范围。上下文窗口被文件内容填满;智能体忘了 40 次工具调用前读过什么;它想同时当研究员、程序员和评审,结果三个都干得很平庸。

这就是单智能体天花板。每当任务需要以下任何一条,你都会撞上它:

- **上下文超出一个窗口的容量** —— 读 50 个文件就冲破 20 万 token
- **不同阶段需要不同专长** —— 调研和代码生成需要的提示词完全不同
- **可以并行的工作** —— 能同时读三个文件,为什么要一个一个读?

## 概念

### 单智能体天花板

单智能体就是一个循环、一个上下文窗口、一份系统提示词。想象一下:

```
┌─────────────────────────────────────────┐
│            SINGLE AGENT                 │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │         Context Window            │  │
│  │                                   │  │
│  │  research notes                   │  │
│  │  + code files                     │  │
│  │  + test output                    │  │
│  │  + review feedback                │  │
│  │  + API docs                       │  │
│  │  + ...                            │  │
│  │                                   │  │
│  │  ██████████████████████ FULL ███  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  One system prompt tries to cover       │
│  research + coding + review + testing   │
│                                         │
│  Result: mediocre at everything         │
└─────────────────────────────────────────┘
```

三样东西会崩:

1. **上下文饱和** —— 工具结果不断堆积。到第 30 轮,智能体已经吃掉 15 万 token 的文件内容、命令输出和先前的推理。第 5 轮的关键细节丢了。

2. **角色混乱** —— 系统提示词写着"你是研究员、程序员、评审和测试",产出的智能体调研做一半、代码写一半,评审永远做不完。

3. **串行瓶颈** —— 智能体读完文件 A 再读文件 B,再读文件 C。三次串行 LLM 调用,三次串行工具执行。没有并行。

### 多智能体解法

把活拆开。每个智能体一份差事、一个上下文窗口、一份为该差事调优的系统提示词:

```
┌──────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                          │
│                                                          │
│  "Build a REST API for user management"                  │
│                                                          │
│         ┌──────────┬──────────┬──────────┐               │
│         │          │          │          │               │
│         ▼          ▼          ▼          ▼               │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│   │RESEARCHER│ │  CODER   │ │ REVIEWER │ │  TESTER  │  │
│   │          │ │          │ │          │ │          │  │
│   │ Reads    │ │ Writes   │ │ Checks   │ │ Runs     │  │
│   │ docs,    │ │ code     │ │ code     │ │ tests,   │  │
│   │ finds    │ │ based on │ │ quality, │ │ reports  │  │
│   │ patterns │ │ research │ │ finds    │ │ results  │  │
│   │          │ │ + spec   │ │ bugs     │ │          │  │
│   └─────┬────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│         │           │            │             │         │
│         └───────────┴────────────┴─────────────┘         │
│                          │                               │
│                     Merge results                        │
└──────────────────────────────────────────────────────────┘
```

每个智能体有:
- 一份聚焦的系统提示词("你是代码评审。你唯一的工作是找 bug。")
- 自己的上下文窗口(不被其他智能体的工作污染)
- 明确的输入/输出契约(接收调研笔记,产出代码)

### 真实世界中的这类系统

**Claude Code 子智能体** —— Claude Code 用 `Task` 派生子智能体时,会创建一个带限定任务的子智能体。父智能体保持上下文干净,子智能体做聚焦的工作并返回摘要。

**Devin** —— 跑一个规划智能体、一个编码智能体和一个浏览器智能体。规划拆步骤,编码写代码,浏览器调研文档。各自有独立的上下文。

**多智能体编程团队(SWE-bench)** —— SWE-bench 上表现最好的系统,用一个读代码库的研究员、一个设计修复方案的规划师和一个实现修复的程序员。单智能体系统得分更低。

**ChatGPT Deep Research** —— 并行派出多个搜索智能体,各探一个角度,然后综合结果。

### 光谱

多智能体不是非黑即白,而是一条光谱:

```
SIMPLE ──────────────────────────────────────────── COMPLEX

 Single        Sub-         Pipeline      Team         Swarm
 Agent         agents

 ┌───┐       ┌───┐        ┌───┐───┐    ┌───┐───┐    ┌─┐┌─┐┌─┐
 │ A │       │ A │        │ A │ B │    │ A │ B │    │ ││ ││ │
 └───┘       └─┬─┘        └───┘─┬─┘    └─┬─┘─┬─┘    └┬┘└┬┘└┬┘
               │                │        │   │       ┌┴──┴──┴┐
             ┌─┴─┐          ┌───┘───┐    │   │       │shared │
             │ a │          │ C │ D │  ┌─┴───┴─┐    │ state │
             └───┘          └───┘───┘  │  msg   │    └───────┘
                                       │  bus   │
 1 loop      Parent +      Stage by    │       │    N peers,
 1 context   child tasks   stage       └───────┘    emergent
                                       Explicit      behavior
                                       roles
```

**单智能体** —— 一个循环,一份提示词。适合简单任务。

**子智能体** —— 父智能体为聚焦的子任务派生子智能体。父智能体维护计划,子智能体回报。这就是 Claude Code 的做法。

**流水线** —— 智能体按序执行。智能体 A 的输出成为智能体 B 的输入。适合分阶段工作流:调研 → 编码 → 评审 → 测试。

**团队** —— 智能体并行跑,共享一条消息总线。各有角色,由编排者协调。适合需要多种技能同时上场的场景。

**蜂群** —— 许多相同或近似的智能体,共享状态,没有固定的编排者。智能体从队列里领活。适合高吞吐的并行任务。

### 四种多智能体模式

#### 模式 1:流水线

```
Input ──▶ Agent A ──▶ Agent B ──▶ Agent C ──▶ Output
          (research)  (code)      (review)
```

每个智能体变换数据并向后传递。容易推理。一个阶段失败,后面全堵。

#### 模式 2:扇出 / 扇入

```
                ┌──▶ Agent A ──┐
                │              │
Input ──▶ Split ├──▶ Agent B ──├──▶ Merge ──▶ Output
                │              │
                └──▶ Agent C ──┘
```

把工作拆给并行的智能体,再合并结果。适合能分解成独立子任务的任务。

#### 模式 3:编排者-工人

```
                    ┌──────────┐
                    │  Orch.   │
                    └──┬───┬───┘
                  task │   │ task
                 ┌─────┘   └─────┐
                 ▼               ▼
           ┌──────────┐   ┌──────────┐
           │ Worker A │   │ Worker B │
           └──────────┘   └──────────┘
```

一个聪明的编排者决定做什么、委派给工人、综合结果。编排者本身也是一个智能体,它的工具包括派生工人。

#### 模式 4:对等蜂群

```
         ┌───┐ ◄──── msg ────▶ ┌───┐
         │ A │                  │ B │
         └─┬─┘                  └─┬─┘
           │                      │
      msg  │    ┌───────────┐     │ msg
           └───▶│  Shared   │◄────┘
                │  State    │
           ┌───▶│  / Queue  │◄────┐
           │    └───────────┘     │
      msg  │                      │ msg
         ┌─┴─┐                  ┌─┴─┐
         │ C │ ◄──── msg ────▶ │ D │
         └───┘                  └───┘
```

没有中央编排者。智能体点对点通信。决策从交互中涌现。更难调试,但能扩展到很多智能体。

### 什么时候不该用多智能体

多智能体增加复杂度。智能体之间的每条消息都是一个潜在故障点。调试从"读一段对话"变成"跨五个智能体追消息"。

**保持单智能体的情形:**
- 任务装得进一个上下文窗口(工作数据约 10 万 token 以内)
- 不同阶段不需要不同的系统提示词
- 串行执行已经够快
- 任务简单到拆分的开销大于价值

**复杂度代价:**
- 每个智能体边界都是一次有损压缩:智能体 A 的完整上下文被浓缩成一条给智能体 B 的消息
- 协调逻辑(谁做什么、何时做、什么顺序)本身就是 bug 的来源
- 延迟上升:N 个智能体意味着最少 N 次串行 LLM 调用,来回对话还会更多
- 成本翻倍:每个智能体独立烧 token

经验法则:任务用不到 20 次工具调用、且装得进 10 万 token,就保持单智能体。

```figure
swarm-messages
```

## 动手构建

### 第 1 步:超载的单智能体

这是一个试图包办一切的单智能体。它有一份巨大的系统提示词,和一个同时装着调研、代码和评审的上下文窗口:

```typescript
type AgentResult = {
  content: string;
  tokensUsed: number;
  toolCalls: number;
};

async function singleAgentApproach(task: string): Promise<AgentResult> {
  const systemPrompt = `You are a full-stack developer. You must:
1. Research the requirements
2. Write the code
3. Review the code for bugs
4. Write tests
Do ALL of these in a single conversation.`;

  const contextWindow: string[] = [];
  let totalTokens = 0;
  let totalToolCalls = 0;

  const research = await fakeLLMCall(systemPrompt, `Research: ${task}`);
  contextWindow.push(research.output);
  totalTokens += research.tokens;
  totalToolCalls += research.calls;

  const code = await fakeLLMCall(
    systemPrompt,
    `Given this research:\n${contextWindow.join("\n")}\n\nNow write code for: ${task}`
  );
  contextWindow.push(code.output);
  totalTokens += code.tokens;
  totalToolCalls += code.calls;

  const review = await fakeLLMCall(
    systemPrompt,
    `Given all previous context:\n${contextWindow.join("\n")}\n\nReview the code.`
  );
  contextWindow.push(review.output);
  totalTokens += review.tokens;
  totalToolCalls += review.calls;

  return {
    content: contextWindow.join("\n---\n"),
    tokensUsed: totalTokens,
    toolCalls: totalToolCalls,
  };
}
```

这种做法的问题:
- 上下文窗口随每个阶段膨胀。到评审步,里面装着调研笔记、代码和先前的推理。
- 系统提示词是通用的,无法为每个阶段调优。
- 没有任何并行。

### 第 2 步:专家智能体

现在拆开。每个智能体一份差事:

```typescript
type SpecialistAgent = {
  name: string;
  systemPrompt: string;
  run: (input: string) => Promise<AgentResult>;
};

function createSpecialist(name: string, systemPrompt: string): SpecialistAgent {
  return {
    name,
    systemPrompt,
    run: async (input: string) => {
      const result = await fakeLLMCall(systemPrompt, input);
      return {
        content: result.output,
        tokensUsed: result.tokens,
        toolCalls: result.calls,
      };
    },
  };
}

const researcher = createSpecialist(
  "researcher",
  "You are a technical researcher. Read documentation, find patterns, and summarize findings. Output only the facts needed for implementation."
);

const coder = createSpecialist(
  "coder",
  "You are a senior TypeScript developer. Given requirements and research notes, write clean, tested code. Nothing else."
);

const reviewer = createSpecialist(
  "reviewer",
  "You are a code reviewer. Find bugs, security issues, and logic errors. Be specific. Cite line numbers."
);
```

每个专家都有聚焦的提示词,各自拿到一个只含所需输入的干净上下文窗口。

### 第 3 步:用消息协调

用显式的消息传递把专家们接起来:

```typescript
type AgentMessage = {
  from: string;
  to: string;
  content: string;
  timestamp: number;
};

async function multiAgentApproach(task: string): Promise<AgentResult> {
  const messages: AgentMessage[] = [];
  let totalTokens = 0;
  let totalToolCalls = 0;

  const researchResult = await researcher.run(task);
  messages.push({
    from: "researcher",
    to: "coder",
    content: researchResult.content,
    timestamp: Date.now(),
  });
  totalTokens += researchResult.tokensUsed;
  totalToolCalls += researchResult.toolCalls;

  const coderInput = messages
    .filter((m) => m.to === "coder")
    .map((m) => `[From ${m.from}]: ${m.content}`)
    .join("\n");

  const codeResult = await coder.run(coderInput);
  messages.push({
    from: "coder",
    to: "reviewer",
    content: codeResult.content,
    timestamp: Date.now(),
  });
  totalTokens += codeResult.tokensUsed;
  totalToolCalls += codeResult.toolCalls;

  const reviewerInput = messages
    .filter((m) => m.to === "reviewer")
    .map((m) => `[From ${m.from}]: ${m.content}`)
    .join("\n");

  const reviewResult = await reviewer.run(reviewerInput);
  messages.push({
    from: "reviewer",
    to: "orchestrator",
    content: reviewResult.content,
    timestamp: Date.now(),
  });
  totalTokens += reviewResult.tokensUsed;
  totalToolCalls += reviewResult.toolCalls;

  return {
    content: messages.map((m) => `[${m.from} -> ${m.to}]: ${m.content}`).join("\n\n"),
    tokensUsed: totalTokens,
    toolCalls: totalToolCalls,
  };
}
```

每个智能体只收到发给它的消息。没有上下文污染。研究员读文档烧掉的 5 万 token,永远不会进入评审的上下文。

### 第 4 步:对比

```typescript
async function compare() {
  const task = "Build a rate limiter middleware for an Express.js API";

  console.log("=== Single Agent ===");
  const single = await singleAgentApproach(task);
  console.log(`Tokens: ${single.tokensUsed}`);
  console.log(`Tool calls: ${single.toolCalls}`);

  console.log("\n=== Multi-Agent ===");
  const multi = await multiAgentApproach(task);
  console.log(`Tokens: ${multi.tokensUsed}`);
  console.log(`Tool calls: ${multi.toolCalls}`);
}
```

多智能体版本用的总 token 更多(三个智能体,三次独立 LLM 调用),但每个智能体的上下文保持干净。每个阶段的质量提升,因为系统提示词是专门的。

## 投入使用

本课产出一份决定何时上多智能体的可复用提示词,见 `outputs/prompt-multi-agent-decision.md`。

## 练习

1. 加第四位专家:一个"测试员"智能体,接收程序员的代码和评审的反馈,然后编写测试
2. 修改流水线,让评审可以把反馈发回程序员做修订循环(最多 2 轮)
3. 把串行流水线改成扇出:让研究员和一个"需求分析员"智能体并行跑,合并两者的输出后再传给程序员

## 关键术语

| 术语 | 大家口头的说法 | 实际含义 |
|------|----------------|----------------------|
| 蜂群(Swarm) | "AI 智能体的蜂巢心智" | 一组共享状态、没有固定领导的对等智能体。行为从局部交互中涌现。 |
| 编排者(Orchestrator) | "老板智能体" | 工具中包含派生和管理其他智能体的智能体。它规划和委派,但可能不亲自干活。 |
| 协调者(Coordinator) | "交警" | 一个非智能体组件(通常只是代码,不是 LLM),按规则在智能体之间路由消息。 |
| 共识(Consensus) | "智能体们达成一致" | 一种协议:多个智能体必须先达成一致才能继续。用于解决输出冲突。 |
| 涌现行为 | "智能体自己琢磨出来的" | 从智能体交互中产生、但未被显式编程的系统级模式。可能有用,也可能有害。 |
| 扇出 / 扇入 | "智能体界的 MapReduce" | 把任务拆给并行的智能体(扇出),再合并它们的结果(扇入)。 |
| 消息传递 | "智能体互相对话" | 智能体之间的通信机制:从一个智能体发往另一个的结构化数据,取代共享上下文窗口。 |

## 延伸阅读

- [The Landscape of Emerging AI Agent Architectures](https://arxiv.org/abs/2409.02977) - 多智能体模式综述
- [AutoGen: Enabling Next-Gen LLM Applications](https://arxiv.org/abs/2308.08155) - 微软的多智能体对话框架
- [Claude Code subagents documentation](https://docs.anthropic.com/en/docs/claude-code) - Claude Code 如何用 Task 委派
- [CrewAI documentation](https://docs.crewai.com/) - 基于角色的多智能体框架
