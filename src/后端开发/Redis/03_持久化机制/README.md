---
title: 03 · 持久化机制
icon: fa6-solid:hard-drive
order: 3
category:
  - Redis
tag:
  - RDB
  - AOF
  - 持久化
---

# 03 · 持久化机制

Redis 是内存数据库，但数据不能仅存于内存 —— 持久化机制决定了 Redis 重启后的数据命运。

## 本章内容

- [01 · RDB 快照原理](01_RDB快照原理.md) — fork与COW、bgsave流程、RDB文件格式
- [02 · AOF 日志机制](02_AOF日志机制.md) — 写后日志、AOF重写、fsync策略
- [03 · 混合持久化与选型](03_混合持久化与选型.md) — RDB+AOF混合、生产选型策略
