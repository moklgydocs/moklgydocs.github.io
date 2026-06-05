---
title: 09 · 性能与诊断
icon: fa6-solid:gauge-high
order: 9
category:
  - CLR
tag:
  - 性能优化
  - 内存诊断
  - Span优化
  - 管道IO
---

# 09 · 性能与诊断

从原理到实践 —— 用 CLR 知识驱动生产级性能优化。

## 本章内容

- [01 · 内存诊断与调优](01_内存诊断与调优.md) — dotnet-dump/dotnet-gcdump/SOS命令、LOH分析、GC统计、内存泄漏定位
- [02 · 性能分析与基准测试](02_性能分析与基准测试.md) — BenchmarkDotNet、dotnet-trace/ETW、JIT优化、PGO
- [03 · 高性能IO与管道](03_高性能IO与管道.md) — Pipe/Stream对比、System.IO.Pipelines、IOUring、零拷贝
