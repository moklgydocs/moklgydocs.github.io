---
title: PBAC 策略引擎
index: false
icon: fa6-solid:gavel
order: 4
category:
  - 权限设计
  - PBAC
---

# PBAC 策略引擎

PBAC（Policy-Based Access Control）是 ABAC 的工程化落地形态，强调"策略即代码"——策略可版本化、可测试、可继承、可组合。

## 目录

- [PBAC 与 XACML 架构](01.PBAC与XACML架构.md) —— PEP / PDP / PIP / PAP 四大组件
- [策略即代码设计](02.策略即代码设计.md) —— Policy JSON 结构与版本管理
- [.NET 规则引擎集成](03.NET规则引擎集成.md) —— RulesEngine / NCalc 实现 PDP
