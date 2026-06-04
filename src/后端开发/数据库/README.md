---
title: 数据库
index: false
icon: fa6-solid:database
order: 2
category:
  - 数据库
tag:
  - 数据库
  - PostgreSQL
  - MySQL
  - SQLServer
---

# 数据库

> 三大主流数据库一网打尽。从 SQL 基础到引擎内核，从运维调优到生产实战——用开源数据库做案例，让每一条 SQL 都跑在生产级标准上。

## 学习路线

```mermaid
graph TB
    subgraph MySQL
        M1[01 基础篇] --> M2[02 进阶篇]
        M2 --> M3[03 引擎篇]
        M3 --> M4[04 运维篇]
        M4 --> M5[05 实战篇]
    end
    subgraph PostgreSQL
        P1[01 基础篇] --> P2[02 进阶篇]
        P2 --> P3[03 运维篇]
        P3 --> P4[04 实战篇]
    end
    subgraph SQLServer
        S1[01 基础篇] --> S2[02 进阶篇]
        S2 --> S3[03 运维篇]
        S3 --> S4[04 实战篇]
    end

    style M1 fill:#4479A1,color:#fff
    style M5 fill:#4479A1,color:#fff
    style P1 fill:#336791,color:#fff
    style P4 fill:#336791,color:#fff
    style S1 fill:#CC2927,color:#fff
    style S4 fill:#CC2927,color:#fff
```

## 专栏导航

| 数据库 | 文章数 | 开源案例 | 核心特色 |
|--------|--------|----------|----------|
| [MySQL](MySQL/) | 19 | **dbeaver** / **ncnn** | InnoDB 引擎深度、MVCC、主从复制 |
| [PostgreSQL](PostgreSQL/) | 15 | **Supabase** / **PostgREST** | MVCC 多版本、扩展生态、JSONB |
| [SQL Server](SQLServer/) | 17+7 | **Orchard Core** / **ABP** | 执行计划、窗口函数、企业级运维 |
