---
title: 02 · 数据类型与结构
icon: fa6-solid:layer-group
order: 2
category:
  - Redis
tag:
  - 数据类型
  - 数据结构
---

# 02 · 数据类型与结构

Redis 的灵魂在于其丰富的数据类型 —— 从基础五大型到扩展类型，每种类型背后都有精心设计的底层数据结构。

## 本章内容

- [01 · String 与内部编码](01_String与内部编码.md) — SDS、编码转换、应用场景
- [02 · Hash 与压缩列表](02_Hash与压缩列表.md) — ziplist/hashtable、渐进式rehash
- [03 · List 与快速列表](03_List与快速列表.md) — quicklist、阻塞操作、消息队列
- [04 · Set 与整数集合](04_Set与整数集合.md) — intset/hashtable、交并差运算
- [05 · ZSet 与跳表](05_ZSet与跳表.md) — skiplist、范围查询、排行榜
- [06 · 扩展类型](06_扩展类型.md) — Stream/Bitmap/HyperLogLog/GEO/Bitfields
