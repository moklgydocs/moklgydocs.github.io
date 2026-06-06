---
title: 01 · RabbitMQ 简介与安装
order: 1
category:
  - RabbitMQ
  - 消息队列
tag:
  - RabbitMQ
  - 消息队列
  - 安装
  - Docker
  - Erlang
---

# 01 · RabbitMQ 简介与安装

## 消息队列的演进

在分布式系统中，进程间通信经历了从简单到复杂的演进：

```mermaid
flowchart LR
    A["IPC<br/>进程间通信"] --> B["RPC<br/>远程过程调用"]
    B --> C["Message Queue<br/>消息队列"]
    C --> D["Stream<br/>事件流"]

    style A fill:#FFE0B2,color:#333
    style B fill:#FFCC80,color:#333
    style C fill:#FF9800,color:#fff
    style D fill:#F57C00,color:#fff
```

| 阶段 | 特点 | 局限 |
|------|------|------|
| **IPC** | 同机进程通信，共享内存/管道 | 无法跨机器 |
| **RPC** | 跨网络调用，像本地函数一样 | 同步阻塞、强耦合 |
| **Message Queue** | 异步解耦，缓冲削峰 | 顺序性、一致性挑战 |
| **Stream** | 持久化日志，可重放 | 架构复杂度高 |

## 为什么需要消息队列

### 1. 解耦

```mermaid
flowchart TB
    subgraph 无消息队列
        A1[订单服务] --> B1[库存服务]
        A1 --> C1[支付服务]
        A1 --> D1[通知服务]
        A1 --> E1[积分服务]
    end

    subgraph 有消息队列
        A2[订单服务] --> Q[消息队列]
        Q --> B2[库存服务]
        Q --> C2[支付服务]
        Q --> D2[通知服务]
        Q --> E2[积分服务]
    end

    style Q fill:#FF9800,color:#fff
```

没有消息队列时，订单服务需要知道所有下游服务的地址和接口。新增一个服务（如大数据分析），就要修改订单服务代码。引入消息队列后，订单服务只需发消息，下游服务按需订阅，互不干扰。

### 2. 异步

```mermaid
sequenceDiagram
    participant 用户
    participant 订单服务
    participant MQ
    participant 库存服务
    participant 通知服务

    rect rgb(255, 152, 0, 0.1)
        Note over 用户,通知服务: 异步模式 — 总耗时 ≈ 50ms
        用户->>订单服务: 下单请求
        订单服务->>MQ: 发布订单消息
        MQ-->>订单服务: 确认
        订单服务-->>用户: 下单成功 (50ms)
        MQ->>库存服务: 扣减库存 (异步)
        MQ->>通知服务: 发送通知 (异步)
    end
```

同步调用时，用户需要等待所有下游服务处理完毕才能收到响应（可能 500ms+）。异步模式只需等待消息入队即可返回，用户体验大幅提升。

### 3. 削峰

```mermaid
flowchart LR
    subgraph 流量洪峰
        R1[请求1] --> MQ["消息队列<br/>缓冲区"]
        R2[请求2] --> MQ
        R3[请求3] --> MQ
        R4[请求4] --> MQ
        R5[请求5] --> MQ
    end

    MQ --> C1["消费者<br/>按自身速率处理"]
    MQ --> C2["消费者<br/>按自身速率处理"]

    style MQ fill:#FF9800,color:#fff
```

秒杀场景下，瞬间涌入的请求可以先写入消息队列缓冲，消费者按照数据库能承受的速率平稳消费，避免系统崩溃。

### 4. 分布式

消息队列天然支持跨系统、跨语言通信。生产者只需将消息投递到 Broker，消费者可以在不同机房、不同语言环境中消费。

## 消息队列对比

| 维度 | RabbitMQ | Kafka | RocketMQ | ActiveMQ |
|------|----------|-------|----------|----------|
| **开发语言** | Erlang | Scala + Java | Java | Java |
| **协议支持** | AMQP、STOMP、MQTT | 自定义协议 | 自定义协议 | OpenWire、STOMP、AMQP、MQTT |
| **单机吞吐量** | 万级 (1~2w/s) | 百万级 (10~100w/s) | 十万级 (10w/s) | 万级 |
| **消息延迟** | 微秒级 | 毫秒级 | 毫秒级 | 毫秒级 |
| **持久化** | 支持（内存/磁盘） | 支持（磁盘顺序写） | 支持 | 支持 |
| **消息顺序性** | 队列内有序 | 分区内有序 | 队列内有序 | 不保证 |
| **集群支持** | 支持 | 支持 | 支持 | 支持 |
| **事务消息** | 不支持（TX 非分布式） | 不支持 | 支持 | 支持 |
| **消息回溯** | 不支持 | 支持（按 Offset） | 支持（按时间戳） | 不支持 |
| **消息过滤** | 不支持服务端过滤 | 不支持 | 支持（Tag/SQL92） | 不支持 |
| **死信队列** | 内置支持 | 不支持 | 支持 | 支持 |
| **延迟消息** | 插件支持 | 不支持 | 支持（18 个等级） | 支持 |
| **管理界面** | 内置 | 第三方 | 内置 | 内置 |
| **社区活跃度** | 高 | 极高 | 高 | 低 |
| **适用场景** | 业务消息、路由复杂 | 大数据、日志流 | 电商、金融 | 遗留系统 |

::: tip 如何选择？
- **RabbitMQ**：业务系统间消息路由，复杂路由规则，低延迟，中小吞吐
- **Kafka**：大数据管道、日志收集、流处理，高吞吐，消息回溯
- **RocketMQ**：电商/金融场景，事务消息，延迟消息，顺序消息
- **ActiveMQ**：已有遗留系统，协议兼容需求
:::

## RabbitMQ 的前世今生

```mermaid
timeline
    title RabbitMQ 发展历程
    2007 : RabbitMQ 项目启动<br/>由 Rabbit Technologies Ltd 开发
    2007 : 基于 Erlang/OTP 实现<br/>选择 Erlang 的原因：高并发、软实时、热升级
    2010 : 被 SpringSource（后 Pivotal）收购
    2013 : AMQP 0-9-1 成为稳定协议版本
    2015 : 3.5.x 版本引入插件机制
    2019 : Pivotal 被 VMware 收购<br/>RabbitMQ 随之归属 VMware
    2021 : 3.9.x 版本引入仲裁队列（Quorum Queue）
    2023 : VMware 被 Broadcom 收购<br/>RabbitMQ 归属 Broadcom
    2023 : 3.12 版本重大性能提升<br/>镜像队列标记废弃
    2024 : 3.13 版本<br/>镜像队列正式废弃
```

### 为什么选择 Erlang？

- **轻量级进程**：Erlang 的 Actor 模型，每个连接一个进程，百万级并发
- **OTP 平台**：内置监督树、热代码升级、分布式通信
- **软实时**：垃圾回收不会 Stop-The-World
- **模式匹配**：消息路由的自然表达

## Docker 安装 RabbitMQ

### 快速启动

```bash
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3.13-management
```

| 端口 | 用途 |
|------|------|
| `5672` | AMQP 协议端口，客户端连接用 |
| `15672` | Management 管理界面 HTTP 端口 |

### 带持久化的完整配置

```bash
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -p 25672:25672 \
  -p 61613:61613 \
  -v rabbitmq_data:/var/lib/rabbitmq \
  -v rabbitmq_log:/var/log/rabbitmq \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=admin123 \
  -e RABBITMQ_DEFAULT_VHOST=/ \
  rabbitmq:3.13-management
```

| 端口 | 用途 |
|------|------|
| `25672` | 集群节点间通信（Erlang 分布式） |
| `61613` | STOMP 协议端口 |

### 常用 Docker 命令

```bash
# 查看日志
docker logs -f rabbitmq

# 进入容器
docker exec -it rabbitmq bash

# 重启
docker restart rabbitmq

# 停止并删除
docker stop rabbitmq && docker rm rabbitmq
```

## Erlang Cookie 机制

RabbitMQ 集群节点间通信依赖 Erlang 的分布式机制，而 **Erlang Cookie** 就是节点间的"握手密钥"。

```mermaid
sequenceDiagram
    participant NodeA as 节点 A
    participant NodeB as 节点 B

    Note over NodeA,NodeB: Cookie 必须一致才能通信
    NodeA->>NodeB: 握手请求 (携带 Cookie)
    NodeB->>NodeB: 校验 Cookie
    alt Cookie 一致
        NodeB-->>NodeA: 握手成功
    else Cookie 不一致
        NodeB-->>NodeA: 拒绝连接
    end
```

::: warning Cookie 安全
- Cookie 文件路径：`/var/lib/rabbitmq/.erlang.cookie`
- 集群所有节点的 Cookie 值必须一致
- 单节点模式下无需关心
- **生产环境务必修改默认 Cookie**，否则任何知道 Cookie 的节点都能加入集群
:::

### Docker 集群中设置 Cookie

```bash
# 方式一：环境变量
docker run -d --name rabbitmq \
  -e RABBITMQ_ERLANG_COOKIE='my_secret_cookie' \
  rabbitmq:3.13-management

# 方式二：挂载 Cookie 文件
docker run -d --name rabbitmq \
  -v ./erlang.cookie:/var/lib/rabbitmq/.erlang.cookie \
  rabbitmq:3.13-management
```

## 第一个 .NET 连接测试

### 创建项目

```bash
dotnet new console -n RabbitMQQuickStart
cd RabbitMQQuickStart
dotnet add package RabbitMQ.Client
```

### 连接测试代码

```csharp
using RabbitMQ.Client;

// 1. 创建连接工厂
var factory = new ConnectionFactory
{
    HostName = "localhost",
    Port = 5672,
    UserName = "admin",
    Password = "admin123",
    VirtualHost = "/"
};

// 2. 创建连接
try
{
    using var connection = factory.CreateConnection();
    Console.WriteLine($"连接成功！");
    Console.WriteLine($"  服务器: {connection.Endpoint}");
    Console.WriteLine($"  本地端口: {connection.LocalPort}");
    Console.WriteLine($"  客户端属性: {connection.ClientProperties["product"]}");

    // 3. 创建通道
    using var channel = connection.CreateModel();
    Console.WriteLine($"通道创建成功，通道号: {channel.ChannelNumber}");
}
catch (Exception ex)
{
    Console.WriteLine($"连接失败: {ex.Message}");
}
```

::: important 连接参数说明
| 参数 | 默认值 | 说明 |
|------|--------|------|
| `HostName` | localhost | RabbitMQ 服务器地址 |
| `Port` | 5672 | AMQP 端口 |
| `UserName` | guest | 用户名 |
| `Password` | guest | 密码 |
| `VirtualHost` | / | 虚拟主机 |
| `RequestedHeartbeat` | 60s | 心跳间隔 |
| `AutomaticRecoveryEnabled` | false | 自动重连 |
:::

### 使用 URI 连接

```csharp
var factory = new ConnectionFactory
{
    Uri = new Uri("amqp://admin:admin123@localhost:5672/")
};
```

## 参考资料

- [RabbitMQ 官方文档 - 安装指南](https://www.rabbitmq.com/install.html)
- [RabbitMQ 官方文档 - Docker 镜像](https://www.rabbitmq.com/install-docker.html)
- [AMQP 0-9-1 规范](https://www.rabbitmq.com/resources/specs/amqp0-9-1.pdf)
- 《RabbitMQ 实战指南》第 1 章 — 朱忠华
- [RabbitMQ in Depth](https://www.manning.com/books/rabbitmq-in-depth) Chapter 1 — Alvaro Videla

## 面试技巧

::: tip 高频面试问题
1. **为什么选择 RabbitMQ 而不是 Kafka？**
   - 回答要点：不是"哪个更好"，而是"场景不同"。RabbitMQ 适合业务消息路由（复杂路由规则、低延迟、中小吞吐）；Kafka 适合大数据管道（高吞吐、消息回溯、流处理）。

2. **Erlang 语言给 RabbitMQ 带来了什么优势？**
   - 回答要点：轻量级进程（百万级并发）、OTP 监督树（高可用）、热代码升级（不停机更新）、软实时（GC 不阻塞）。但也意味着 JVM 生态的工具链无法直接使用。

3. **消息队列的三大核心作用是什么？**
   - 回答要点：解耦（生产者消费者互不依赖）、异步（非关键路径异步处理，降低响应时间）、削峰（缓冲瞬时流量，保护下游系统）。

4. **Docker 安装时为什么要用 management 标签？**
   - 回答要点：默认镜像不含管理插件，`rabbitmq:3.13-management` 预装了 `rabbitmq_management` 插件，提供 Web UI 和 HTTP API，方便运维管理。
:::
