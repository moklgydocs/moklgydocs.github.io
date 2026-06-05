---
title: 02 · 对象与类型原理
icon: fa6-solid:layer-group
order: 2
category:
  - CLR
tag:
  - 对象布局
  - 字段存储
  - 方法表
  - 常量
---

# 02 · 对象与类型原理

深入理解对象在内存中的真实形态 —— 字段、方法表与同步块。

## 本章内容

- [01 · 对象内存布局与同步块](01_对象内存布局与同步块.md) — 对象头、SyncBlock、TypeHandle、字段排列
- [02 · 常量与字段](02_常量与字段.md) — const vs readonly、字段存储、内存对齐、volatile语义
- [03 · 方法表与虚方法表](03_方法表与虚方法表.md) — MethodTable结构、VTable、方法槽、接口映射表
- [04 · 属性与索引器原理](04_属性与索引器原理.md) — 属性编译为方法、自动属性字段、索引器IL
