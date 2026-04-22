---
title: 混合架构落地
index: false
icon: fa6-solid:layer-group
order: 5
category:
  - 权限设计
  - 混合架构
---

# 混合架构落地

现代企业权限系统的终极形态：**RBAC 做粗粒度兜底，ABAC 做细粒度过滤**。理解两种混合范式，掌握多租户权限隔离设计。

## 目录

- [混合架构设计理念](01.混合架构设计理念.md) —— 为什么混合，选型依据
- [范式一：RBAC粗过滤+ABAC精计算](02.范式一RBAC粗过滤+ABAC精计算.md) —— 最推荐的生产架构
- [范式二：Role作为ABAC属性](03.范式二Role作为ABAC属性.md) —— 统一底层引擎
- [多租户权限隔离设计](04.多租户权限隔离设计.md) —— TenantId 隔离与行级权限
