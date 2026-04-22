---
title: ABAC 细粒度控制
index: false
icon: fa6-solid:filter
order: 3
category:
  - 权限设计
  - ABAC
---

# ABAC 细粒度控制

ABAC（Attribute-Based Access Control）通过动态计算属性表达式来做鉴权决策，是解决 RBAC 角色爆炸、实现数据行级权限的核心工具。

## 目录

- [ABAC 核心概念](01.ABAC核心概念.md) —— 四维属性模型详解
- [属性设计与策略表达式](02.属性设计与策略表达式.md) —— 如何建模属性和编写策略
- [ABAC 的痛点](03.ABAC的痛点.md) —— 性能与管理黑盒的本质
- [ASP.NET Core ABAC 实战](04.ASPNETCore_ABAC实战.md) —— IAuthorizationHandler + 规则引擎
