# 生产智能体运行时 —— 快速实例化与带类型工作流

> 生产智能体运行时优化的,是原型框架忽视的东西:实例化成本、带类型的工作流表面、可直接 serving 的后端。2026 年的这一对:Agno(Python)瞄准微秒级智能体实例化和无状态 FastAPI 后端;Mastra 在 Vercel AI SDK 基底上交付智能体、工具、工作流、统一模型路由和组合存储。

**类型:** 学习
**编程语言:** Python、TypeScript
**前置要求:** 第 14 阶段 · 01(智能体循环)、第 14 阶段 · 13(LangGraph)
**预计耗时:** 约 45 分钟

## 学习目标

- 识别 Agno 的性能目标及它们何时要紧。
- 说出 Mastra 的三个原语——Agents、Tools、Workflows——及支持的服务器适配器。
- 解释为什么无状态的会话作用域 FastAPI 后端是 Agno 推荐的生产路径。
- 针对给定技术栈(Python 优先 vs TypeScript 优先)在 Agno 与 Mastra 之间做选择。

## 问题

LangGraph、AutoGen、CrewAI 都是重框架。想要"就要智能体循环,要快,在我的运行时里"的团队,会选 Agno(Python)或 Mastra(TypeScript)。两者都拿一部分框架自有原语,换原始速度和与周边技术栈更紧的贴合。

## 概念

### Agno

- Python 运行时,前身 Phi-data。
- "没有图、没有链、没有绕弯的模式——就是纯 Python。"
- 文档中的性能目标:约 2μs 智能体实例化、每智能体约 3.75 KiB 内存、约 23 个模型提供商。
- 生产路径:无状态、会话作用域的 FastAPI 后端。每个请求起一个全新智能体;会话状态存数据库。
- 原生多模态(文本、图像、音频、视频、文件)和智能体 RAG。

当你每秒有数千个短命智能体(聊天扇入、评估流水线)时,速度目标才要紧;一个智能体跑 10 分钟时,就没那么要紧。

### Mastra

- TypeScript,建在 Vercel AI SDK 上。
- 三个原语:**Agents**、**Tools**(Zod 带类型)、**Workflows**。
- 统一模型路由器——94 家提供商 3,300+ 模型(2026 年 3 月)。
- 组合存储:记忆、工作流、可观测性各存不同后端;大规模可观测性推荐 ClickHouse。
- Apache 2.0,`ee/` 目录为源码可见的企业许可。
- 服务器适配器:Express、Hono、Fastify、Koa;一等的 Next.js 和 Astro 集成。
- 附带 Mastra Studio(localhost:4111)调试。
- 1.0(2026 年 1 月)时 22k+ GitHub star、每周 npm 下载 30 万+。

### 定位

两者都不想做 LangGraph。竞争点在:

- **语言契合。** Python 优先团队选 Agno;TypeScript 优先选 Mastra。
- **运行时人体工学。** Agno = 近零开销;Mastra = 与 Vercel 生态集成。
- **可观测性。** 两者都集成 Langfuse/Phoenix/Opik(第 24 课),但 Mastra Studio 是一方的。

### 何时选哪个

- **Agno** —— Python 后端、大量短命智能体、强性能要求、FastAPI 技术栈。
- **Mastra** —— TypeScript 后端、Next.js / Vercel 部署、统一多提供商模型路由、Zod 带类型工具。
- **LangGraph**(第 13 课)—— 当持久状态和显式图推理比原始速度更要紧。
- **OpenAI / Claude Agent SDK** —— 当你想要提供商产品化的形态(第 16–17 课)。

### 这个模式在哪里出错

- **为快而快。** 负载明明是每请求一次慢智能体调用,却因为"2μs"好听选 Agno。开销根本不是瓶颈。
- **生态锁定。** Mastra 的 Vercel 味集成,在 Vercel 上是加分,在别处是减分。
- **企业许可混淆。** Mastra 的 `ee/` 目录是源码可见,不是 Apache 2.0。打算 fork 前先读许可证。

```figure
wb-runtime-spawn
```

## 动手构建

本课主要是对比——没有哪一份代码能同时公道地展示两个框架。见 `code/main.py` 的并排玩具:同一个"跑智能体、流式输出、持久会话"流程实现两遍(一遍 Agno 形态,一遍 Mastra 形态)。

运行:

```
python3 code/main.py
```

两条结构不同但功能等价的轨迹。

## 投入使用

- **Agno** —— 需要速度和 FastAPI 形态的 Python 后端。
- **Mastra** —— 多提供商、带工作流原语的 TypeScript 后端。
- 两者都提供一方可观测性钩子,都集成 Langfuse。

## 交付

`outputs/skill-runtime-picker.md`:根据技术栈、延迟预算和运行形态,在 Agno、Mastra、LangGraph 或提供商 SDK 之间做选择。

## 练习

1. 读 Agno 文档。把第 01 课的标准库 ReAct 循环移植到 Agno。什么消失了?什么留下了?
2. 读 Mastra 文档。把同一个循环移植到 Mastra。工具类型(Zod vs 没有)有什么变化?
3. 基准测试:在你的技术栈上测量智能体实例化延迟。Agno 的 2μs 对你的负载要紧吗?
4. 设计一次迁移:如果你一直在 Python 里跑 CrewAI,迁到 Agno 会坏掉什么?
5. 读 Mastra 的 `ee/` 许可条款。哪些限制会影响开源 fork?

## 关键术语

| 术语 | 人们常说的 | 实际含义 |
|------|----------------|------------------------|
| Agno | "快的 Python 智能体" | 无状态、会话作用域的智能体运行时 |
| Mastra | "Vercel AI SDK 上的 TS 智能体" | Agents + Tools + Workflows + 模型路由器 |
| 统一模型路由器 | "多提供商接入" | 一个客户端,94 家提供商 3,300+ 模型 |
| 组合存储 | "多后端" | 记忆/工作流/可观测性各存不同存储 |
| Mastra Studio | "本地调试器" | localhost:4111 的智能体内省 UI |
| 源码可见 | "不是 OSS" | 许可证允许读源码但限制商用 |

## 延伸阅读

- [Agno Agent Framework 文档](https://www.agno.com/agent-framework) —— 性能目标、FastAPI 集成
- [Mastra 文档](https://mastra.ai/docs) —— 原语、服务器适配器、模型路由器
- [LangGraph 概览](https://docs.langchain.com/oss/python/langgraph/overview) —— 有状态图替代
- [Comet Opik](https://www.comet.com/site/products/opik/) —— Mastra 集成引用的可观测性对比
