---
title: 03 · 方法与委托原理
icon: fa6-solid:code
order: 3
category:
  - CLR
tag:
  - 方法调用
  - 虚方法
  - 委托
  - 事件
---

# 03 · 方法与委托原理

从 IL 到内存 —— 理解方法调用的完整机制与委托的本质。

## 本章内容

- [01 · 方法调用机制](01_方法调用机制.md) — call vs callvirt、虚方法调度、非虚方法优化、尾调用
- [02 · 委托本质与多播委托](02_委托本质与多播委托.md) — 委托IL结构、_target/_methodPtr、多播链表、委托闭包
- [03 · 事件原理](03_事件原理.md) — 事件编译为委托字段+add/remove方法、自定义事件访问器
- [04 · Lambda与闭包原理](04_Lambda与闭包原理.md) — 编译器生成闭包类、变量捕获、Display Class、内存泄漏
