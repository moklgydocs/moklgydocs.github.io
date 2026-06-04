---
title: RabbitMQ 生产级学习与实践指南
index: false
icon: fa6-solid:envelope
order: 5
category:
  - RabbitMQ
  - 消息队列
tag:
  - RabbitMQ
  - 消息队列
  - AMQP
  - .NET
  - 微服务
---

# RabbitMQ 生产级学习与实践指南

> 从一条消息的诞生到消费，深入 RabbitMQ 的每一个角落——用 .NET 技术栈打造生产级消息系统。

## 参考资料

| 资料 | 说明 |
|------|------|
| [RabbitMQ 官方文档](https://www.rabbitmq.com/documentation.html) | RabbitMQ Official Docs |
| [AMQP 0-9-1 规范](https://www.rabbitmq.com/resources/specs/amqp0-9-1.pdf) | AMQP 协议规范 |
| [RabbitMQ in Depth](https://www.manning.com/books/rabbitmq-in-depth) | Alvaro Videla 著 |
| 《RabbitMQ 实战指南》 | 朱忠华著 |
| [RabbitMQ .NET Client](https://github.com/rabbitmq/rabbitmq-dotnet-client) | 官方 .NET SDK |
| [MassTransit](https://github.com/MassTransit/MassTransit) | .NET 消息总线框架 |
| [EasyNetQ](https://github.com/EasyNetQ/EasyNetQ) | .NET RabbitMQ 高级 API |

## 学习路线

```mermaid
graph LR
    A[01 基础] --> B[02 核心概念]
    B --> C[03 交换机与路由]
    C --> D[04 消息可靠性]
    D --> E[05 高级特性]
    E --> F[06 集群与高可用]
    F --> G[07 性能调优]
    G --> H[08 .NET 实战]
    H --> I[09 生产级架构]
    I --> J[10 面试题]

    style A fill:#FF6600,color:#fff
    style J fill:#FF5722,color:#fff
```

## 章节导航

| 篇章 | 内容 | 文章数 |
|------|------|--------|
| [01 · RabbitMQ 基础](01_RabbitMQ基础/) | 安装、Hello World、管理界面 | 3 |
| [02 · 核心概念与架构](02_核心概念与架构/) | AMQP 协议、消息模型、一条消息的旅程 | 3 |
| [03 · 交换机与路由](03_交换机与路由/) | Direct/Fanout/Topic/Headers、死信交换机 | 3 |
| [04 · 消息可靠性](04_消息可靠性/) | 确认机制、持久化、归还机制、幂等性 | 4 |
| [05 · 高级特性](05_高级特性/) | 延迟消息、优先级、RPC、消费者限流 | 4 |
| [06 · 集群与高可用](06_集群与高可用/) | 集群架构、镜像队列、仲裁队列、联邦 | 4 |
| [07 · 性能调优](07_性能调优/) | 内存管理、流量控制、队列优化、监控 | 3 |
| [08 · .NET 实战](08_.NET实战/) | RabbitMQ.Client/MassTransit/EasyNetQ | 3 |
| [09 · 生产级架构设计](09_生产级架构设计/) | 微服务集成、事件溯源、最终一致性 | 3 |
| [10 · 面试题精选](10_面试题精选/) | 30 道高频面试题 | 1 |
