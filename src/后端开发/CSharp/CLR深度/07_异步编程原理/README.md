---
title: 07 · 异步编程原理
icon: fa6-solid:rotate
order: 7
category:
  - CLR
tag:
  - async/await
  - 状态机
  - Task
  - SynchronizationContext
---

# 07 · 异步编程原理

揭开 async/await 的编译器魔法 —— 从状态机到 SynchronizationContext 的完整链路。

## 本章内容

- [01 · async/await 状态机原理](01_async_await状态机原理.md) — AsyncStateMachine、MoveNext、TaskAwaiter、异常传播
- [02 · Task 深度解析](02_Task深度解析.md) — Task对象模型、Promise风格、TaskCompletionSource、配置选项
- [03 · SynchronizationContext 与 ValueTask](03_SynchronizationContext与ValueTask.md) — 同步上下文、ConfigureAwait、ValueTask结构、IValueTaskSource
