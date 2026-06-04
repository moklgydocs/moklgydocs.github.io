---
title: 09 · 生产级架构设计
icon: fa6-solid:building
order: 9
category:
  - Redis
tag:
  - 架构设计
  - 分布式锁
  - 缓存架构
  - 数据一致性
  - 多级缓存
---

# 09 · 生产级架构设计

从单机到集群，从缓存到架构 —— Redis 在企业级系统中的核心设计模式。

## 本章内容

- [01 · 缓存架构设计模式](01_缓存架构设计模式.md) — Cache Aside/Read Through/Write Through/Write Behind
- [02 · 分布式锁与限流](02_分布式锁与限流.md) — Redlock、令牌桶/漏桶、滑动窗口
- [03 · 数据一致性保障](03_数据一致性保障.md) — 延时双删、Canal同步、最终一致性
- [04 · 数据迁移与扩容](04_数据迁移与扩容.md) — 集群扩缩容、redis-shake、双写迁移
- [05 · 多级缓存架构](05_多级缓存架构.md) — L1本地+L2 Redis、缓存穿透/击穿/雪崩防护
