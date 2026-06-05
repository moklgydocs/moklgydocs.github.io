---
title: 05 · 内存管理与垃圾回收
icon: fa6-solid:memory
order: 5
category:
  - CLR
tag:
  - GC
  - 堆与栈
  - 大对象堆
  - 终结器
---

# 05 · 内存管理与垃圾回收

理解 .NET 内存管理的每一个细节 —— 从分配到回收的完整生命周期。

## 本章内容

- [01 · 堆与栈的内存模型](01_堆与栈的内存模型.md) — 栈帧结构、托管堆分配、GC堆段、分配上下文
- [02 · GC 代模型与回收算法](02_GC代模型与回收算法.md) — 3代模型、标记-清除-压缩、临时段、后台GC
- [03 · 大对象堆与固定对象](03_大对象堆与固定对象.md) — LOH阈值、pinning原理、LOH压缩、ArrayPool
- [04 · 终结器与SafeHandle](04_终结器与SafeHandle.md) — 终结器队列、CriticalFinalizer、SafeHandle、IDisposable模式
