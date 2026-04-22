---
title: 第一阶段：基础
index: false
icon: fa6-solid:seedling
order: 1
category:
  - AI实践
---

# 第一阶段：基础

**目标**：打通 LLM 开发的完整基础链路，能独立搭建一个可对外提供服务的 RAG 问答系统。

**预计周期**：2-4 周

## 目录

- [Python 异步编程与 FastAPI](01.Python异步与FastAPI.md) —— asyncio、httpx、流式输出基础
- [LLM API 调用实践](02.LLM_API调用实践.md) —— OpenAI / 通义 / DeepSeek 多厂商接入
- [Prompt Engineering 系统指南](03.Prompt_Engineering.md) —— CoT、Few-Shot、Structured Output
- [基础 RAG 系统从零搭建](04.基础RAG系统搭建.md) —— 文档加载、分块、Embedding、检索
- [LangChain 入门实战](05.LangChain入门实战.md) —— Chain、Memory、LCEL 完整示例

## 阶段验收标准

完成以下项目认为本阶段达标：
- [ ] 能用 FastAPI 封装一个支持流式输出的 LLM 对话接口
- [ ] 能把一份 PDF 文档变成可查询的 RAG 知识库
- [ ] 能写出结构稳定输出 JSON 的 Prompt
