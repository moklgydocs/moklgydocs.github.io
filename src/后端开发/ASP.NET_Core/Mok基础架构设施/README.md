---
title: Mok 基础架构设施
index: false
icon: server
category:
  - ASP.NET_Core
---

# 【Mok 基础架构设施】全自动数据库驱动配置与 Options 绑定系统

本专栏完整记录了 `Mok.SqlFactory` 基础类库中"数据库驱动配置系统"的设计与实现过程。从原理分析到生产级代码，覆盖了自定义 `ConfigurationProvider`、树形配置表解析、容错降级、热重载机制、以及基于反射的全自动 Options 批量注册。

## 目录

- [第一章（原理篇）](01.原理篇.md) —— 突破 IConfiguration 生命周期，为什么不能用中间件读配置？
- [第二章（基建篇）](02.基建篇.md) —— 手写 EFConfigurationProvider，让配置表支持树形结构与冒号路径解析
- [第三章（容错篇）](03.容错篇.md) —— 防止数据库连不上导致系统启动崩溃的优雅降级方案
- [第四章（性能篇）](04.性能篇.md) —— 推拉结合：IHostedService 定时轮询与 API 瞬间热重载
- [第五章（进阶篇）](05.进阶篇.md) —— C# 泛型反射：基于 `[AppOption]` 特性的全自动批量服务注册

## 技术栈

- ASP.NET Core 8+
- Entity Framework Core
- PostgreSQL / SQL Server / MySQL
- IConfiguration / IOptions / IOptionsMonitor
- BackgroundService / IHostedService
