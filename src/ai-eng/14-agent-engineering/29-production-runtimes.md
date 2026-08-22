# 生产运行时:队列、事件、定时任务

> 生产智能体跑在六种运行时形态上:请求-响应、流式、持久执行、队列后台、事件驱动、定时调度。先选形态,再选框架。可观测性在每种形态下都是承重墙。

**类型:** 学习
**编程语言:** Python(标准库)
**前置要求:** 第 14 阶段 · 13(LangGraph),第 14 阶段 · 22(语音)
**预计耗时:** 约 60 分钟

## 学习目标

- 说出六种生产运行时形态,并把每种对到相应的框架/产品模式
- 解释持久执行(LangGraph)对长程任务为什么重要
- 描述事件驱动运行时,以及 Claude Managed Agents 何时适用
- 解释"可观测性即承重"这一主张对多步智能体的含义

## 问题

生产智能体的死法,是 Jupyter notebook 里见不到的:第 37 步网络超时、用户语音通话中途挂断、机器重启后 cron 任务没了、后台 worker 内存耗尽。运行时形态,决定哪些失败是可以生还的。

## 概念

### 请求-响应

- 同步 HTTP,用户等它跑完。
- 只适用于短任务(<30 秒)。
- 技术栈:Agno(Python + FastAPI),Mastra(TypeScript + Express/Hono/Fastify/Koa)。
- 可观测性:标准 HTTP 访问日志 + OTel span。

### 流式

- SSE 或 WebSocket 渐进输出。
- LiveKit 把它扩展到 WebRTC,用于语音/视频(第 22 课)。
- 技术栈:任何支持流式的框架 + 能处理 SSE/WS 的前端。
- 可观测性:逐块计时、首 token 延迟、尾延迟。

### 持久执行

- 每一步之后状态都进检查点;失败自动恢复。
- AutoGen v0.4 的 actor 模型把故障隔离到单个智能体(第 14 课)。
- LangGraph 的核心差异化能力(第 13 课)。
- 当步数未知且重跑代价高时,必不可少。

### 队列 / 后台

- 任务进队列,worker 领取,结果经 webhook 或 pub/sub 回流。
- 长程智能体必备(按 Anthropic 的 computer use 发布文,每任务几十到几百步)。
- 技术栈:Celery(Python)、BullMQ(Node)、SQS + Lambda(AWS)、自研。
- 可观测性:队列深度、逐任务延迟分布、DLQ 大小。

### 事件驱动

- 智能体订阅触发器:新邮件、PR 打开、cron 触发。
- Claude Managed Agents 开箱覆盖这种形态(第 17 课)。
- CrewAI Flows(第 15 课)组织事件驱动的确定性工作流。
- 可观测性:触发来源、事件到启动的延迟、智能体延迟。

### 定时调度

- 周期性运行的 cron 形智能体。
- 与持久执行组合,让失败的夜间任务在下个周期接着跑。
- 技术栈:Kubernetes CronJob + 持久化框架;托管方案(Render cron、Vercel cron)。

### 2026 年的部署模式

- **CrewAI Flows**:事件驱动生产。
- **Agno**:Python 微服务的无状态 FastAPI。
- **Mastra**:嵌入式服务器适配器(Express、Hono、Fastify、Koa)。
- **Pipecat Cloud / LiveKit Cloud**:托管语音(第 22 课)。
- **Claude Managed Agents**:托管的长时异步。

### 可观测性是承重墙

没有 OpenTelemetry GenAI span(第 23 课)加 Langfuse/Phoenix/Opik 后端(第 24 课),一个死在第 40 步的多步智能体你根本没法调试。这对生产不是可选项——它是"我们 debug 很快"和"我们只能加更多日志从头重放"之间的差别。

### 生产运行时在哪里会失败

- **形态选错。** 给 5 分钟的任务选请求-响应:用户挂断,worker 堆积,重试雪上加霜。
- **没有 DLQ。** 队列 worker 不配死信队列,失败任务凭空消失。
- **后台工作不透明。** 后台智能体运行不导出链路,失败要等用户报告才看得见。
- **跳过持久状态。** 任何跑超过 30 秒、又承担不起重跑的运行,都需要持久执行。

```figure
wb-runtime-shapes
```

## 动手构建

`code/main.py` 是标准库的多形态演示:

- 请求-响应端点(普通函数)。
- 流式处理器(生成器)。
- 带 DLQ 的队列 worker。
- 事件触发注册表。
- cron 形调度器。

运行:

```bash
python3 code/main.py
```

输出:五条链路,展示同一任务在每种形态下的行为。同样的智能体逻辑,不同的外壳。第六种形态(持久执行)有意留给第 13 课的 LangGraph 检查点讲。

## 投入使用

- **请求-响应**:聊天式 UX。
- **流式**:渐进响应。
- **持久执行**:长程任务。
- **队列**:批量 / 异步 / 长时运行。
- **事件**:智能体反应式触发。
- **定时**:日常维护(记忆固化、评估、成本报告)。

## 交付

`outputs/skill-runtime-shape.md` 为一个任务选定运行时形态,并接好可观测性要求。

## 练习

1. 把你第 01 课的 ReAct 循环移植到你的技术栈里全部六种形态。哪种形态配哪种产品表面?
2. 给队列演示加 DLQ:模拟 10% 任务失败,暴露 DLQ 大小。
3. 写一个 cron 触发的评估智能体,每晚对当天 Top 20 链路跑评估。
4. 实现带背压(backpressure)的流式:客户端慢就暂停智能体。它与轮次预算如何交互?
5. 读 Claude Managed Agents 文档。什么时候你会把自托管的长程智能体迁到托管?

## 关键术语

| 术语 | 别人的说法 | 实际含义 |
|------|----------------|------------------------|
| 请求-响应(Request-response) | "同步" | 用户等待;仅限短任务 |
| 流式(Streaming) | "SSE / WS" | 渐进输出;UX 更好;延迟可按块观测 |
| 持久执行(Durable execution) | "从失败恢复" | 状态进检查点,从最后一步重启 |
| 队列(Queue-based) | "后台任务" | 生产者 / worker 池 / DLQ |
| 事件驱动(Event-driven) | "触发式" | 智能体对外部事件作出反应 |
| DLQ | "死信队列" | 失败任务的停车场 |
| Claude Managed Agents | "托管骨架" | Anthropic 托管的长时异步,带缓存与压缩 |

## 延伸阅读

- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)——持久执行细节
- [Claude Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview)——托管长时异步
- [Anthropic, Introducing computer use](https://www.anthropic.com/news/3-5-models-and-computer-use)——"每任务几十到几百步"
- [AutoGen v0.4 (Microsoft Research)](https://www.microsoft.com/en-us/research/articles/autogen-v0-4-reimagining-the-foundation-of-agentic-ai-for-scale-extensibility-and-robustness/)——actor 模型故障隔离
