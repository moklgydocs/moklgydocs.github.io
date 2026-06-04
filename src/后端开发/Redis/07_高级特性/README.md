---
title: 07 · 高级特性
icon: fa6-solid:star
order: 7
category:
  - Redis
tag:
  - 事务
  - Lua
  - 发布订阅
  - 模块
  - 分布式锁
---

# 07 · 高级特性

超越基础操作 —— 事务保证原子性、Lua脚本扩展能力、分布式锁解决协调问题。

## 本章内容

- [01 · 事务与 WATCH](01_事务与WATCH.md) — MULTI/EXEC/DISCARD、WATCH乐观锁、ACID分析
- [02 · Lua 脚本详解](02_Lua脚本详解.md) — EVAL/EVALSHA、脚本缓存、Redis Function
- [03 · 发布订阅与 Stream](03_发布订阅与Stream.md) — Pub/Sub模式、消费者组、消息队列选型
- [04 · 模块与扩展](04_模块与扩展.md) — RediSearch、RedisJSON、RedisBloom、RedisTimeSeries
- [05 · 分布式锁详解](05_分布式锁详解.md) — Redlock算法、Redisson看门狗、可重入锁
