---
title: CLR 深度
icon: fa6-solid:microchip
order: 2
category:
  - CSharp
  - CLR
tag:
  - CLR
  - 底层原理
  - C#高级
  - 内存管理
  - 类型系统
---

# CLR 深度 —— C# 高级用法与底层原理

参考 Jeffrey Richter《CLR via C#》第4版，结合 .NET 官方文档与源码，从运行时底层出发，理解 C# 每一个特性的本质。

## 专栏导航

### 原理篇

- [01 · CLR 基础与类型系统](01_CLR基础与类型系统/) — CLR执行模型、类型对象、基元类型、值类型与引用类型
- [02 · 对象与类型原理](02_对象与类型原理/) — 对象布局、字段存储、常量与字段、方法表
- [03 · 方法与委托原理](03_方法与委托原理/) — 方法调用机制、虚方法表、委托本质、事件原理
- [04 · 接口与泛型原理](04_接口与泛型原理/) — 接口映射、泛型实例化、开放/封闭类型、约束
- [05 · 内存管理与垃圾回收](05_内存管理与垃圾回收/) — 堆与栈、GC代模型、大对象堆、终结器、SafeHandle
- [06 · 异常处理与线程](06_异常处理与线程/) — SEH机制、异常过滤、线程池、同步机制、锁原理
- [07 · 异步编程原理](07_异步编程原理/) — 状态机生成、Task本质、SynchronizationContext、ValueTask

### 高级篇

- [08 · 高级类型与模式](08_高级类型与模式/) — ref结构、Span/Memory、模式匹配、记录类型
- [09 · 性能与诊断](09_性能与诊断/) — 内存诊断、性能分析、Span优化、管道IO
- [10 · 实战篇](10_实战篇/) — 高性能队列、对象池、零拷贝序列化、CLR宿主

## 参考资料

- 《CLR via C#》第4版 — Jeffrey Richter
- .NET Runtime 源码 (dotnet/runtime)
- ECMA-335 CLI 标准
- 《Pro .NET Memory Management》— Konrad Kokosa
- .NET 官方文档
