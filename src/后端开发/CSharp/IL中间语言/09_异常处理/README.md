---
title: 异常处理
index: false
icon: fa6-solid:triangle-exclamation
order: 9
category:
  - CSharp
tag:
  - IL
  - 异常
  - try-catch
---

# 异常处理

> IL 层的异常处理远比 C# 的 try/catch 复杂。filter 子句、fault 块、Leave 跳转——理解这些才能读懂反编译后的异常逻辑。

| 文章 | 内容 |
|------|------|
| [01 · try/catch/finally](01_try_catch_finally.md) | IL 异常块结构，Leave/Endfinally 指令 |
| [02 · filter 与 fault](02_filter与fault.md) | 异常过滤器、fault 块，throw/rethrow |
