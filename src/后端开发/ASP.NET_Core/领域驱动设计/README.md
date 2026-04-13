---
title: 领域驱动设计
index: false
icon: layer-group
category:
  - ASP.NET_Core
---

# 领域驱动设计（DDD）基础框架

本专栏记录了基于 ASP.NET Core 手写 DDD 基础框架的设计与实现过程。对标 ABP 框架的核心设计，但不依赖 ABP，纯手写实现实体、聚合根、审计、软删除、领域事件、仓储等核心模块，打造轻量、可复用的生产级基础设施。

## 目录

- [第一章（聚合根）](01.聚合根.md) —— MokFramework.Domain 实现：实体基类、聚合根、审计、软删除、领域事件、值对象
- [第二章（聚合根仓储）](02.聚合根仓储.md) —— MokFramework.EntityFrameworkCore 实现：EF Core 集成、审计拦截器、软删除过滤器、仓储、领域事件分发
- [第三章（平台通用方法）](03.平台通用方法.md) —— MokFramework.AspNetCore 实现：Web API 共享基础设施、统一响应、异常处理、当前用户

## 技术栈

- ASP.NET Core 9.0
- Entity Framework Core
- DDD（领域驱动设计）
