---
title: Redo Log 与 Undo Log
icon: fa6-brands:mysql
order: 4
category:
  - 数据库
  - MySQL
tag:
  - MySQL
  - Redo Log
  - Undo Log
  - WAL
  - InnoDB
---

# Redo Log 与 Undo Log

Redo Log 保证持久性，Undo Log 保证原子性——两条日志是 InnoDB 事务的基石。理解 WAL 原则、Redo Log 的循环写入机制、以及 Undo Log 的版本链，才能深入掌握 InnoDB 的崩溃恢复和数据一致性。

## 1. WAL 原则（Write-Ahead Logging）

WAL 是 InnoDB 最核心的设计原则：**先写日志，再写数据**。

```mermaid
flowchart LR
    A["事务修改数据"] --> B["1. 写 Redo Log<br/>（顺序 IO，极快）"]
    B --> C["2. 写 Undo Log<br/>（记录反向操作）"]
    C --> D["3. 修改 Buffer Pool<br/>中的数据页<br/>（标记为脏页）"]
    D --> E["4. 返回客户端<br/>（已提交）"]
    E --> F["5. 后台线程<br/>异步刷脏页到磁盘<br/>（随机 IO，较慢）"]
```

::: important 为什么先写日志再写数据？
- **Redo Log 是顺序 IO**：追加写入，无需寻道，速度接近内存
- **数据页刷盘是随机 IO**：需要找到对应页位置，速度慢一个数量级
- 如果先写数据再写日志，崩溃时可能数据已写但日志未写 → 数据不一致
- WAL 保证了：只要日志写了，数据一定能恢复
:::

## 2. Redo Log

### 2.1 Redo Log 的作用

保证事务**持久性**：崩溃后通过 Redo Log 重放已提交事务的修改。

```sql
-- Redo Log 记录的是"物理修改"：
-- "对表空间 X 的页 Y 的偏移 Z 处，写入值 V"
-- 不是 SQL 语句，而是页级别的物理变更

-- 示例：
-- UPDATE employees SET name = '李四' WHERE id = 1;
-- Redo Log 记录：
-- [表空间ID, 页号, 偏移量, 修改前的值, 修改后的值]
```

### 2.2 循环写入结构

Redo Log 采用**固定大小、循环写入**的方式，不需要无限增长。

```mermaid
flowchart TD
    subgraph RedoLogFiles["Redo Log 文件组<br/>ib_logfile0, ib_logfile1"]
        direction LR
        F0["ib_logfile0<br/>4 个 Block"] --> F1["ib_logfile1<br/>4 个 Block"]
        F1 -->|"循环"| F0
    end

    subgraph Pointers["三个关键指针"]
        WP["write pos<br/>当前写入位置"]
        CP["checkpoint<br/>当前擦除位置"]
        TAIL["已写入但未<br/>checkpoint 的区域"]
    end

    WP -->|"写到哪里了"| F0
    CP -->|"可以擦到哪里"| F0
```

```mermaid
flowchart LR
    subgraph Circular["Redo Log 循环缓冲（展开视图）"]
        direction LR
        A["Block 1"] --> B["Block 2"] --> C["Block 3"] --> D["Block 4"]
        D -->|"循环"| A
    end

    subgraph State["状态"]
        S1["write pos → C<br/>写入位置"]
        S2["checkpoint → A<br/>擦除位置"]
        S3["A→C: 已写入待刷盘<br/>C→A(绕回): 空闲空间"]
    end

    State -.-> Circular
```

```sql
-- 查看 Redo Log 配置
SHOW VARIABLES LIKE 'innodb_log_file_size';
-- +---------------------------+------------+
-- | Variable_name             | Value      |
-- +---------------------------+------------+
-- | innodb_log_file_size      | 50331648  |  -- 48MB（默认）
-- +---------------------------+------------+

SHOW VARIABLES LIKE 'innodb_log_files_in_group';
-- +---------------------------+-------+
-- | Variable_name             | Value |
-- +---------------------------+-------+
-- | innodb_log_files_in_group | 2     |  -- 2 个文件
-- +---------------------------+-------+

-- 总 Redo Log 空间 = innodb_log_file_size × innodb_log_files_in_group
-- = 48MB × 2 = 96MB

-- 查看 Redo Log 产能
SHOW ENGINE INNODB STATUS\G
-- 搜索 "LOG" 部分
-- Log sequence number (LSN): 当前已写入的 LSN
-- Log flushed up to: 已刷盘的 LSN
-- Pages flushed up to: 脏页刷盘对应的 LSN
-- Last checkpoint at: checkpoint 位置
```

::: warning Redo Log 空间不足的后果
当 write pos 追上 checkpoint 时，Redo Log 空间用尽，InnoDB 必须**暂停写入**，强制刷脏页推进 checkpoint。这会导致性能急剧下降。生产环境建议 Redo Log 总空间至少能容纳 1 小时的写入量。
:::

### 2.3 Redo Log 写入流程

```mermaid
sequenceDiagram
    participant TX as 事务
    participant MTR as Mini-Transaction
    participant BPL as Redo Log Buffer
    participant F1 as ib_logfile0
    participant F2 as ib_logfile1

    TX->>MTR: 1. 修改数据页
    MTR->>MTR: 2. 生成 Redo Record
    MTR->>BPL: 3. 写入 Log Buffer
    Note over BPL: 内存中，速度极快

    TX->>BPL: 4. 事务 COMMIT
    BPL->>F1: 5. 刷盘（innodb_flush_log_at_trx_commit=1）
    Note over F1: 保证持久性

    rect rgb(255, 230, 230)
        Note over BPL,F1: 其他刷盘时机（非 COMMIT 触发）
        BPL->>F1: Log Buffer 满（>50%）
        BPL->>F1: 后台线程每秒刷盘
        BPL->>F1: 脏页刷盘前（WAL 保证）
    end
```

```sql
-- innodb_flush_log_at_trx_commit 配置
SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit';
-- +--------------------------------+-------+
-- | Variable_name                  | Value |
-- +--------------------------------+-------+
-- | innodb_flush_log_at_trx_commit | 1     |
-- +--------------------------------+-------+

-- 值说明：
-- 0: 每秒刷盘（崩溃可能丢 1 秒数据）
-- 1: 每次 COMMIT 刷盘（最安全，默认）
-- 2: 每次 COMMIT 写 OS 缓存 + 每秒 fsync（OS 崩溃可能丢数据）
```

::: important 生产必须设为 1
`innodb_flush_log_at_trx_commit = 1` 是 ACID 持久性的保证。设为 0 或 2 在 MySQL 进程崩溃时可能丢失已提交的数据。只有在明确接受数据丢失风险（如日志表）时才能降低。
:::

### 2.4 Group Commit

多个事务同时提交时，只需一次 fsync 即可将多个事务的 Redo Log 刹盘。

```mermaid
flowchart LR
    A["事务 T1 COMMIT"] --> D["Redo Log Buffer"]
    B["事务 T2 COMMIT"] --> D
    C["事务 T3 COMMIT"] --> D
    D -->|"一次 fsync"| E["ib_logfile"]

    F["Group Commit 三阶段"] --> G["1. Flush Stage<br/>写入 Log Buffer"]
    G --> H["2. Sync Stage<br/>一次 fsync"]
    H --> I["3. Commit Stage<br/>标记事务完成"]
```

```sql
-- Group Commit 效果
-- 10 个事务并发提交，只需 1 次 fsync
-- 而非 10 次 fsync → TPS 提升 10 倍

-- binlog_group_commit 相关参数
SHOW VARIABLES LIKE 'binlog_group_commit_sync_delay';
-- 延迟多少微秒再 fsync，让更多事务凑一批
-- 默认 0（不延迟），可设为 1000-10000 微秒
```

## 3. Undo Log

### 3.1 Undo Log 的两个作用

| 作用 | 说明 |
|------|------|
| 事务回滚 | 逆序执行 Undo Log 中的反向操作，恢复到事务开始前 |
| MVCC 版本链 | 为快照读提供历史版本数据 |

```sql
-- Undo Log 记录的是"逻辑反向操作"：
-- INSERT → Undo Log 记录 DELETE
-- DELETE → Undo Log 记录 INSERT
-- UPDATE name='李四' → Undo Log 记录 UPDATE name='张三'

-- 插入操作
INSERT INTO employees (id, name) VALUES (1, '张三');
-- Undo Log: <DELETE, id=1>

-- 更新操作
UPDATE employees SET name = '李四' WHERE id = 1;
-- Undo Log: <UPDATE, id=1, name='张三'>

-- 删除操作
DELETE FROM employees WHERE id = 1;
-- Undo Log: <INSERT, id=1, name='李四'>
```

### 3.2 Undo Log 与 MVCC

```mermaid
flowchart LR
    subgraph CurrentRow["当前数据行"]
        R["id=1, name='李四'<br/>trx_id=300, roll_ptr=→"]
    end

    subgraph UndoV2["Undo Log 版本 2"]
        U2["id=1, name='张三'<br/>trx_id=200, roll_ptr=→"]
    end

    subgraph UndoV1["Undo Log 版本 1"]
        U1["id=1, name='王五'<br/>trx_id=100, roll_ptr=NULL"]
    end

    R -->|"roll_pointer"| U2
    U2 -->|"roll_pointer"| U1

    subgraph ReadView["Read View 判断可见性"]
        direction TB
        V1["trx_id=300 ∈ m_ids → ❌ 不可见"]
        V2["trx_id=200 < min_trx_id → ✅ 可见"]
    end
```

### 3.3 Undo Log 存储

```sql
-- MySQL 8.0 Undo 表空间
SHOW VARIABLES LIKE 'innodb_undo_tablespaces';
-- +---------------------------+-------+
-- | Variable_name             | Value |
-- +---------------------------+-------+
-- | innodb_undo_tablespaces   | 2     |
-- +---------------------------+-------+

-- Undo 表空间文件
-- undo_001, undo_002

-- 自动截断（8.0+）
SHOW VARIABLES LIKE 'innodb_undo_log_truncate';
-- +--------------------------+-------+
-- | Variable_name            | Value |
-- +--------------------------+-------+
-- | innodb_undo_log_truncate | ON    |
-- +--------------------------+-------+

-- 当 Undo 表空间超过阈值时自动截断
SHOW VARIABLES LIKE 'innodb_max_undo_log_size';
-- +--------------------------+------------+
-- | Variable_name            | Value      |
-- +--------------------------+------------+
-- | innodb_max_undo_log_size | 1073741824 |  -- 1GB
-- +--------------------------+------------+
```

## 4. Buffer Pool、Redo Log 与磁盘的交互

```mermaid
sequenceDiagram
    participant Client as 客户端
    participant BP as Buffer Pool<br/>（内存）
    participant RLB as Redo Log Buffer<br/>（内存）
    participant RL as Redo Log File<br/>（磁盘）
    participant Disk as 数据文件<br/>（磁盘）

    Client->>BP: 1. 读取数据页（若不在 BP 则从 Disk 加载）
    BP->>BP: 2. 修改数据页（标记为脏页）
    BP->>RLB: 3. 生成 Redo Record 写入 Log Buffer
    Note over RLB: WAL 原则：先写日志

    Client->>RL: 4. COMMIT → fsync Redo Log
    Note over RL: 持久性保证

    Note over BP,Disk: 后台异步刷脏页
    BP->>Disk: 5. 脏页写入数据文件
    Note over Disk: checkpoint 推进
    Note over RL: Redo Log 对应空间可复用
```

::: tip 核心交互原则
1. **WAL**：修改数据页前，先写 Redo Log
2. **刷脏页前**：必须确保对应的 Redo Log 已刷盘（否则崩溃无法恢复）
3. **COMMIT 时**：只保证 Redo Log 刷盘，不保证数据页刷盘
4. **崩溃恢复**：从 checkpoint 的 LSN 开始，重放 Redo Log 中已提交事务的修改
:::

## 5. Doublewrite Buffer（双写缓冲）

### 5.1 部分写问题

InnoDB 页大小 16KB，而操作系统 IO 通常是 4KB。如果在写页的过程中崩溃，可能只写了一部分（partial page write/torn page），导致数据页损坏。

```mermaid
flowchart LR
    A["16KB 数据页"] --> B["OS 写入<br/>4 次 × 4KB"]
    B --> C{"崩溃?"}
    C -->|完整写入| D["✅ 页完整"]
    C -->|写入 2 次后崩溃| E["❌ 页损坏<br/>8KB 新数据 + 8KB 旧数据"]
```

### 5.2 Doublewrite 机制

```mermaid
flowchart TD
    A["脏页刷盘"] --> B["1. 先写入 Doublewrite Buffer<br/>（共享表空间中连续 2MB 空间）"]
    B --> C["2. 再写入数据文件<br/>（实际位置）"]

    D{"崩溃恢复"} --> E["数据页校验失败?"]
    E -->|是| F["从 Doublewrite Buffer<br/>恢复完整页"]
    E -->|否| G["正常恢复"]

    F --> H["再用 Redo Log<br/>重放该页的修改"]
```

```sql
-- 查看 Doublewrite 状态
SHOW VARIABLES LIKE 'innodb_doublewrite';
-- +-------------------+-------+
-- | Variable_name     | Value |
-- +-------------------+-------+
-- | innodb_doublewrite| ON    |
-- +-------------------+-------+

-- SHOW ENGINE INNODB STATUS 中的 Doublewrite 信息
-- BUFFER POOL AND MEMORY
-- ...
-- Doublewrite buffer: 2MB, 128 pages
```

::: important Doublewrite 的代价
Doublewrite 每个脏页写两次（一次到双写缓冲，一次到实际位置），增加约 5-10% 的 IO 开销。但这是保证数据完整性的必要代价。MySQL 8.0.20+ 支持对特定表空间禁用双写。
:::

## 6. LSN（Log Sequence Number）

LSN 是 Redo Log 的**全局单调递增**序号，贯穿 InnoDB 的整个恢复体系。

```sql
-- 查看 LSN
SHOW ENGINE INNODB STATUS\G
-- Log sequence number: 4567890123    ← 当前已写入的 LSN
-- Log flushed up to:     4567890000  ← 已刷盘的 LSN
-- Pages flushed up to:   4567880000  ← 脏页刷盘对应的 LSN
-- Last checkpoint at:    4567870000  ← checkpoint 位置的 LSN
```

```mermaid
flowchart LR
    subgraph LSN["LSN 进度"]
        direction LR
        CKP["Last Checkpoint<br/>4567870000"] --> PFU["Pages Flushed<br/>4567880000"] --> LFU["Log Flushed<br/>4567890000"] --> LSN_CUR["Log Sequence<br/>4567890123"]
    end

    subgraph Meaning["含义"]
        M1["checkpoint 之前的<br/>Redo Log 可覆盖"]
        M2["脏页已刷盘到此处<br/>对应 Redo Log 可覆盖"]
        M3["Redo Log 已刷盘<br/>崩溃不丢失"]
        M4["Redo Log 已写入<br/>可能还在 Buffer"]
    end
```

**LSN 与崩溃恢复的关系：**

1. 崩溃后从 `Last checkpoint LSN` 开始扫描 Redo Log
2. 重放所有 LSN > checkpoint 的 Redo Record → 恢复已提交事务
3. 对未提交事务，通过 Undo Log 回滚 → 保证原子性

## 7. 崩溃恢复流程

```mermaid
flowchart TD
    A["MySQL 崩溃重启"] --> B["1. 从 Last Checkpoint LSN<br/>开始扫描 Redo Log"]
    B --> C["2. 重放 Redo Log<br/>（Redo Phase）"]
    C --> D["3. 所有数据页恢复到<br/>崩溃前的最新状态"]
    D --> E["4. 检查 Undo Log<br/>找到未提交的事务"]
    E --> F["5. 回滚未提交事务<br/>（Undo Phase）"]
    F --> G["6. 数据库恢复一致状态<br/>可以提供服务"]
```

```sql
-- 崩溃恢复相关配置
SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit';
-- = 1: 保证已提交事务不丢失

SHOW VARIABLES LIKE 'innodb_doublewrite';
-- = ON: 防止部分写问题

SHOW VARIABLES LIKE 'innodb_fast_shutdown';
-- +----------------------+-------+
-- | Variable_name        | Value |
-- +----------------------+-------+
-- | innodb_fast_shutdown | 1     |
-- +----------------------+-------+
-- 0: 慢关闭（刷所有脏页再关）
-- 1: 快速关闭（刷部分，崩溃恢复快）
-- 2: 最快（几乎不刷，崩溃恢复慢）
```

## 8. Redo Log vs Undo Log 对比

| 特性 | Redo Log | Undo Log |
|------|----------|----------|
| 作用 | 保证持久性 | 保证原子性 + MVCC |
| 记录内容 | 物理修改（页级变更） | 逻辑反向操作 |
| 写入方式 | 顺序追加（循环） | 随机写入（回滚段） |
| 空间管理 | 固定大小，循环覆写 | 需 Purge 线程清理 |
| 崩溃恢复 | 重放已提交事务 | 回滚未提交事务 |
| 与 WAL 关系 | 先写 Redo Log 再写数据页 | 修改前先写 Undo Log |
| 存储文件 | ib_logfile0/1 | undo_001/002 |
| 组提交 | 支持 Group Commit | 不支持 |

## 面试技巧

::: important 高频考点
1. **WAL 原则**：先写日志再写数据，Redo Log 顺序 IO 比数据页随机 IO 快一个数量级。面试最基础的题。
2. **Redo Log 循环写入**：write pos 追上 checkpoint 时性能急剧下降。要理解三个指针的含义。
3. **innodb_flush_log_at_trx_commit**：0/1/2 三个值的含义，生产必须为 1。
4. **Doublewrite**：解决部分写问题，16KB 页可能只写了一半。先写双写缓冲再写数据文件。
5. **LSN**：全局递增序号，贯穿 Redo Log、脏页刷盘、checkpoint。理解四个 LSN 的进度关系。
6. **Undo Log 双重作用**：事务回滚 + MVCC 版本链。面试必问。
7. **崩溃恢复流程**：Redo Phase（重放）→ Undo Phase（回滚）。必须能完整描述。
8. **Redo Log vs Undo Log**：物理 vs 逻辑、顺序 vs 随机、持久性 vs 原子性。对比题。
:::

::: tip 参考资源
- [小林coding - Redo Log 与 Undo Log](https://xiaolincoding.com/mysql/)：图解 WAL 与循环写入
- [MySQL 8.0 官方文档 - InnoDB Redo Log](https://dev.mysql.com/doc/refman/8.0/en/innodb-redo-log.html)：Redo Log 官方说明
- [DBeaver](https://github.com/dbeaver/dbeaver)：通过 InnoDB Status 查看日志状态
:::
