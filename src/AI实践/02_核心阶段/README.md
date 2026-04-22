---
title: 第二阶段：核心
index: false
icon: fa6-solid:fire
order: 2
category:
  - AI实践
---

# 第二阶段：核心

**目标**：掌握 Agent 系统的核心机制，能独立设计并部署生产可用的 Agent。

**预计周期**：3-5 周

## 目录

- [LangGraph Agent 设计与实战](01.LangGraph_Agent设计.md) —— 状态机、循环、Human-in-the-loop
- [Function Calling 与工具集成](02.Function_Calling工具集成.md) —— 工具定义、并行调用、错误重试
- [MCP 协议开发实战](03.MCP协议实战.md) —— Resources / Tools / Prompts，自制 MCP Server
- [向量数据库深度实践](04.向量数据库深度实践.md) —— Chroma / Qdrant / Milvus 选型与调优
- [RAG 评估体系建设](05.RAG评估体系.md) —— Ragas 评估框架、召回率 / 精确率 / 忠实度

## 阶段验收标准

完成以下项目认为本阶段达标：
- [ ] 能用 LangGraph 实现一个带工具调用和人工确认节点的 Agent
- [ ] 能自制一个 MCP Server，暴露至少 3 个工具给 Claude
- [ ] 能用 Ragas 评估 RAG 系统的质量，并给出优化方向
