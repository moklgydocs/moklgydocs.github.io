---
title: .NET 部署
index: false
icon: microsoft
category:
  - 运维与部署
---

# .NET 部署

写完代码只是开始，怎么发到服务器上稳定跑起来，才是完整的交付。

## 目录

- [01. 发布模式详解](01.发布模式详解.md) —— FDD vs SCD vs SingleFile vs ReadyToRun
- [02. Kestrel 与反向代理架构](02.Kestrel与反向代理架构.md) —— 为什么不能直接暴露 Kestrel、Nginx 配置
- [03. 多环境配置管理](03.多环境配置管理.md) —— appsettings 多环境、环境变量覆盖、User Secrets
- [04. 健康检查端点](04.健康检查端点.md) —— /health、/ready，Docker 和负载均衡的对接
- [05. 日志收集方案](05.日志收集方案.md) —— Serilog 配置、结构化日志、Seq 部署
- [06. .NET 应用 Docker 化](06.dotNET应用Docker化.md) —— Dockerfile 编写、多阶段构建、CI/CD 构建流程
