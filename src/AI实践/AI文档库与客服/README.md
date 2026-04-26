---
title: AI 文档知识库与客服
index: false
icon: fa6-solid:book-open-reader
order: 1
category:
  - AI工程实战
---

# AI文档知识库与客服

> **10 关，从 LLM 调用入门到多 Agent 生产化落地。** 以「Zuru 企业AI平台」为主线项目贯穿全程，每关在上一关基础上迭代，最终产出可一键 Docker Compose 部署的企业级系统。

---

## 关卡地图

### 初级阶段：RAG 工程师（L1–L5）

| 关卡 | 主题 | 核心技术 |
|------|------|---------|
| [L1](./L1_LLM统一客户端.md) | LLM 统一客户端 | FastAPI · httpx · pydantic-settings · SSE |
| [L2](./L2_Prompt工程与对话系统.md) | Prompt 工程 + 多轮对话 | Few-Shot · CoT · Redis 会话 · 结构化输出 |
| [L3](./L3_文档解析与向量存储.md) | 文档解析 + 向量流水线 | pymupdf · Qdrant · Celery · Embedding |
| [L4](./L4_RAG检索问答.md) | RAG 检索问答 | BM25 + 向量混合 · RRF · Rerank · 置信度阈值 |
| [L5](./L5_RAG生产化.md) | RAG 生产化（初级通关）| RAGAS · OpenTelemetry · Prometheus · Grafana |

### 中级阶段：Agent 工程师（L6–L10）

| 关卡 | 主题 | 核心技术 |
|------|------|---------|
| [L6](./L6_工具调用.md) | 工具设计 + Function Calling | Tool Registry · 审计日志 · 二次确认 |
| [L7](./L7_LangGraph有状态Agent.md) | LangGraph 有状态 Agent | StateGraph · Checkpoint · interrupt() |
| [L8](./L8_人工干预与多Agent协作.md) | 人工干预 + 多 Agent 协作 | Supervisor · asyncio.gather · 5分钟倒计时 |
| [L9](./L9_Agent生产化.md) | Agent 生产化（成本 + 可靠性）| Circuit Breaker · ModelRouter · Locust 压测 |
| [L10](./L10_系统集成与架构设计.md) | 系统集成（中级通关）| Gateway · 钉钉Bot · Docker Compose 全栈 |

---

## 项目背景

**公司**：Zuru，500+ 人中型制造企业  
**痛点**：客服每天处理 200+ 重复问题，80% 可从文档找到答案；数据分析师每月花半天拉报表

**最终产出**：
- 员工可用自然语言问任何业务问题，系统从知识库检索后回答
- 客服机器人接入钉钉，自动处理常见问题，复杂问题转人工
- 数据分析 Agent 自然语言生成报表
