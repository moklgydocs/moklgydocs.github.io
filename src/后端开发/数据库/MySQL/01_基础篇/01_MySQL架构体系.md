---
title: MySQL 架构体系
icon: fa6-brands:mysql
order: 1
category:
  - 数据库
  - MySQL
tag:
  - MySQL
  - InnoDB
  - 存储引擎
  - 架构
---

# MySQL 架构体系

一条 SQL 从客户端发出到结果返回，经历了哪些环节？为什么 MySQL 能同时支持 InnoDB 和 MyISAM？理解 MySQL 的分层架构，是掌握数据库内核的第一步。

## 1. MySQL C/S 架构概览

MySQL 采用经典的 **Client/Server** 架构，客户端与服务器通过 TCP/IP 或 Unix Socket 通信。

```mermaid
flowchart TB
    subgraph Client["客户端"]
        C1[mysql CLI]
        C2[DBeaver]
        C3[JDBC/ADO.NET]
        C4[Navicat]
    end

    subgraph Server["MySQL Server"]
        direction TB
        SL[连接层 Connection Pool]
        SQL_LAYER[SQL 层]
        SE_LAYER[存储引擎层]
    end

    subgraph Storage["磁盘存储"]
        D1[(InnoDB 数据文件)]
        D2[(MyISAM 数据文件)]
        D3[(其他引擎文件)]
    end

    Client -->|TCP/IP<br/>Unix Socket| SL
    SL --> SQL_LAYER
    SQL_LAYER --> SE_LAYER
    SE_LAYER --> Storage
```

::: tip 客户端工具推荐
[DBeaver](https://github.com/dbeaver/dbeaver) 是一款开源的通用数据库管理工具，支持 MySQL、PostgreSQL、SQLite 等多种数据库。它底层通过 JDBC 驱动连接 MySQL，是理解 MySQL C/S 架构的优秀实践案例。
:::

## 2. Server 层：SQL 处理的核心

Server 层是 MySQL 的"大脑"，负责连接管理、SQL 解析、查询优化和执行调度。**所有跨存储引擎的功能都在这一层实现**，包括解析器、优化器、执行器等。

### 2.1 一条 SQL 的完整旅程

```mermaid
flowchart LR
    A[客户端] -->|发送 SQL| B[连接器<br/>Connector]
    B --> C{查询缓存<br/>Query Cache}
    C -->|命中| D[直接返回结果]
    C -->|未命中| E[解析器<br/>Parser]
    E --> F[优化器<br/>Optimizer]
    F --> G[执行器<br/>Executor]
    G -->|调用存储引擎 API| H[存储引擎<br/>Storage Engine]
    H -->|返回行数据| G
    G -->|结果集| A

    style C fill:#ffcccc,stroke:#cc0000
    style D fill:#ccffcc,stroke:#00cc00
```

::: warning 查询缓存已在 MySQL 8.0 中移除
Query Cache 在高并发场景下成为性能瓶颈——任何对表的修改都会导致该表所有缓存失效。MySQL 8.0 彻底移除了该功能，相关参数 `query_cache_type` 也不再存在。生产环境请勿依赖查询缓存，应通过合理的索引设计和 Buffer Pool 调优来提升查询性能。
:::

### 2.2 连接器（Connector）

连接器负责与客户端建立连接、管理连接和权限验证。

```sql
-- 查看当前连接信息
SHOW PROCESSLIST;

-- 输出示例
-- +----+------+-----------------+------+---------+------+-------+------------------+
-- | Id | User | Host            | db   | Command | Time | State | Info             |
-- +----+------+-----------------+------+---------+------+-------+------------------+
-- |  5 | root | localhost:56712 | test | Query   |    0 | NULL  | SHOW PROCESSLIST |
-- |  8 | app  | 192.168.1.10    | prod | Sleep   |   30 | NULL  | NULL             |
-- +----+------+-----------------+------+---------+------+-------+------------------+
```

**连接生命周期关键点：**

| 阶段 | 说明 |
|------|------|
| 建立连接 | 三次握手 + 权限验证（用户名/密码/Host） |
| 执行查询 | 读取该用户权限表，缓存在连接对象中 |
| 空闲状态 | `SHOW PROCESSLIST` 中 Command 列为 Sleep |
| 连接断开 | 客户端主动断开或 `wait_timeout` 超时（默认 8 小时） |

```sql
-- 修改空闲连接超时时间（单位：秒）
SET GLOBAL wait_timeout = 28800;
SET GLOBAL interactive_timeout = 28800;
```

::: important 长连接内存问题
MySQL 执行过程中使用的内存在连接对象中管理，长连接积累可能导致 OOM。解决方案：
1. 定期断开长连接重连
2. MySQL 5.7+ 执行 `mysql_reset_connection` 重置连接资源
:::

### 2.3 解析器（Parser）

解析器将 SQL 文本转换为 MySQL 能理解的数据结构，分为**词法分析**和**语法分析**两步。

```mermaid
flowchart LR
    A["SELECT * FROM users WHERE id = 1"] --> B[词法分析]
    B --> C["识别关键字：<br/>SELECT, FROM, WHERE<br/>识别表名：users<br/>识别列名：id"]
    C --> D[语法分析]
    D --> E[生成语法树<br/>AST]
    E --> F[预处理器<br/>检查表/列是否存在<br/>权限验证]
```

```sql
-- 语法错误示例
SELECT * FORM users;
-- ERROR 1064 (42000): You have an error in your SQL syntax;
-- check the manual near 'FORM users' at line 1

-- 语义错误示例（表不存在）
SELECT * FROM non_exist_table;
-- ERROR 1146 (42S02): Table 'test.non_exist_table' doesn't exist
```

### 2.4 优化器（Optimizer）

优化器决定 SQL 的执行方案——选择哪个索引、多表 Join 的连接顺序等。

```sql
-- 同一条 SQL，优化器可能选择不同的执行计划
EXPLAIN SELECT * FROM orders WHERE user_id = 100 AND status = 'PAID';

-- 可能走 user_id 索引，也可能走 status 索引
-- 优化器基于统计信息计算代价，选择代价最小的方案
```

::: tip 优化器不是万能的
优化器基于统计信息做决策，当统计信息过时或不准确时，可能选错执行计划。生产中遇到慢查询，可使用 `ANALYZE TABLE` 更新统计信息，或使用 `FORCE INDEX` 强制指定索引。
:::

### 2.5 执行器（Executor）

执行器根据执行计划调用存储引擎接口，逐行获取数据并返回结果集。

```sql
-- 执行器的工作流程（以全表扫描为例）：
-- 1. 调用存储引擎接口，获取第一行
-- 2. 判断是否满足 WHERE 条件
-- 3. 满足则存入结果集，不满足则跳过
-- 4. 获取下一行，重复步骤 2-3，直到最后一行
-- 5. 返回结果集给客户端

-- 有索引的情况：
-- 1. 调用存储引擎接口，定位到满足条件的第一行
-- 2. 判断是否满足 WHERE 的其他条件
-- 3. 重复获取下一行，直到条件不满足
-- 4. 返回结果集
```

**执行器与存储引擎的交互接口：**

| 接口 | 说明 |
|------|------|
| `handler::rnd_next()` | 全表扫描，逐行读取 |
| `handler::index_read()` | 索引等值查询 |
| `handler::index_next()` | 索引范围扫描，读取下一行 |
| `handler::index_first()` | 读取索引第一条记录 |
| `handler::write_row()` | 插入一行 |
| `handler::update_row()` | 更新一行 |
| `handler::delete_row()` | 删除一行 |

## 3. 存储引擎层：插件式架构

MySQL 最独特的设计是**插件式存储引擎架构**——Server 层统一处理 SQL，存储引擎层负责数据的实际存取。这意味着你可以根据业务需求选择不同的引擎。

### 3.1 插件式架构示意

```mermaid
flowchart TB
    subgraph ServerLayer["Server 层"]
        Executor[执行器]
    end

    subgraph EngineLayer["存储引擎层（插件式）"]
        E1[InnoDB]
        E2[MyISAM]
        E3[Memory]
        E4[Archive]
        E5[CSV]
        E6[NDB Cluster]
    end

    subgraph FileSystem["文件系统"]
        FS[(磁盘文件)]
    end

    Executor -->|统一 API| E1
    Executor -->|统一 API| E2
    Executor -->|统一 API| E3
    Executor -->|统一 API| E4
    Executor -->|统一 API| E5
    E1 --> FS
    E2 --> FS
    E3 -->|仅内存| E3
    E4 --> FS
    E5 --> FS
```

```sql
-- 查看当前 MySQL 支持的存储引擎
SHOW ENGINES;

-- 关键输出字段
-- +--------------------+---------+------------------------------------------------------------+
-- | Engine             | Support | Comment                                                    |
-- +--------------------+---------+------------------------------------------------------------+
-- | InnoDB             | DEFAULT | Supports transactions, row-level locking, and foreign keys  |
-- | MyISAM             | YES     | MyISAM storage engine                                      |
-- | MEMORY             | YES     | Hash based, stored in memory, useful for temporary tables  |
-- | ARCHIVE            | YES     | Archive storage engine                                     |
-- | CSV                | YES     | CSV storage engine                                         |
-- +--------------------+---------+------------------------------------------------------------+

-- 指定表的存储引擎
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(64) NOT NULL,
    email VARCHAR(128)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- 修改表的存储引擎
ALTER TABLE users ENGINE = InnoDB;
```

### 3.2 InnoDB vs MyISAM 详细对比

| 特性 | InnoDB | MyISAM |
|------|--------|--------|
| 事务支持 | 支持（ACID） | 不支持 |
| 锁粒度 | 行级锁 | 表级锁 |
| 外键 | 支持 | 不支持 |
| MVCC | 支持 | 不支持 |
| 崩溃恢复 | Redo Log + Undo Log | 依赖操作系统 |
| 全文索引 | 支持（5.6+） | 支持 |
| 聚簇索引 | 主键即聚簇索引 | 非聚簇，索引和数据分离 |
| 存储文件 | `.ibd`（数据+索引） | `.MYD`（数据）+ `.MYI`（索引） |
| COUNT(*) | 需遍历索引 | 有专门变量，极快 |
| AUTO_INCREMENT | 支持事务级自增 | 表级，INSERT 后立即提交 |
| 适用场景 | OLTP、高并发读写 | 只读或低并发读、日志表 |

```sql
-- InnoDB 表：行级锁演示
-- 会话 A
BEGIN;
UPDATE users SET name = 'Alice' WHERE id = 1;  -- 锁定 id=1 这一行
-- 不提交，会话 B 尝试更新 id=2 的行不会阻塞

-- 会话 B
UPDATE users SET name = 'Bob' WHERE id = 2;  -- ✅ 不阻塞（不同行）
UPDATE users SET name = 'Charlie' WHERE id = 1;  -- ❌ 阻塞等待（同一行）

-- MyISAM 表：表级锁
-- 会话 A 对 myisam_table 加写锁
LOCK TABLES myisam_table WRITE;
-- 会话 B 对 myisam_table 的任何操作都会阻塞
-- 即使操作不同行也会阻塞
UNLOCK TABLES;
```

::: warning 不要在新项目中使用 MyISAM
MyISAM 不支持事务和行级锁，在并发场景下性能和安全性都无法保障。MySQL 5.5 起默认引擎已改为 InnoDB，MySQL 8.0 中系统表也全部迁移至 InnoDB。MyISAM 仅在极少数只读归档场景下尚有价值。
:::

## 4. 物理文件结构

### 4.1 InnoDB 存储文件

```mermaid
flowchart TB
    subgraph InnoDBFiles["InnoDB 物理文件"]
        IBD["*.ibd<br/>独立表空间<br/>（数据 + 索引）"]
        IBU["ibdata1<br/>系统表空间<br/>（数据字典/双写缓冲等）"]
        RDL["ib_logfile0 / ib_logfile1<br/>Redo Log 文件"]
        ULG["mysql.ibd<br/>MySQL 系统表"]
        UND["undo_001 / undo_002<br/>Undo 表空间（8.0+）"]
    end
```

```sql
-- 查看数据文件位置
SHOW VARIABLES LIKE 'datadir';
-- +---------------+------------------------+
-- | Variable_name | Value                  |
-- +---------------+------------------------+
-- | datadir       | /var/lib/mysql/        |
-- +---------------+------------------------+

-- 查看独立表空间配置
SHOW VARIABLES LIKE 'innodb_file_per_table';
-- +---------------------------+-------+
-- | Variable_name             | Value |
-- +---------------------------+-------+
-- | innodb_file_per_table     | ON    |
-- +---------------------------+-------+

-- 查看表的物理文件
SELECT
    TABLE_SCHEMA AS db,
    TABLE_NAME AS table_name,
    ENGINE,
    TABLE_ROWS,
    DATA_LENGTH / 1024 / 1024 AS data_mb,
    INDEX_LENGTH / 1024 / 1024 AS index_mb
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 'users';
```

### 4.2 MyISAM 存储文件

| 文件 | 用途 |
|------|------|
| `.MYD` | MyISAM Data，存储表数据 |
| `.MYI` | MyISAM Index，存储索引数据 |
| `.frm` | 表结构定义文件（8.0 已移除，元数据存于数据字典） |

## 5. 从 DBeaver 看客户端与服务器的交互

[DBeaver](https://github.com/dbeaver/dbeaver) 作为开源数据库管理工具，其与 MySQL 的交互过程是理解 C/S 架构的绝佳案例：

```mermaid
sequenceDiagram
    participant App as DBeaver 客户端
    participant Driver as JDBC 驱动<br/>(mysql-connector-java)
    participant Server as MySQL Server
    participant Engine as InnoDB 引擎

    App->>Driver: 1. 创建连接<br/>jdbc:mysql://host:3306/db
    Driver->>Server: 2. TCP 三次握手 + 认证握手
    Server->>Driver: 3. 认证成功，返回连接 ID
    Driver->>App: 4. 连接对象就绪

    App->>Driver: 5. 执行 SELECT 查询
    Driver->>Server: 6. 发送 SQL 文本（文本协议）
    Server->>Server: 7. 解析 → 优化 → 执行
    Server->>Engine: 8. 调用存储引擎 API
    Engine-->>Server: 9. 返回行数据
    Server-->>Driver: 10. 分批返回结果集
    Driver-->>App: 11. ResultSet 对象

    App->>Driver: 12. 关闭连接
    Driver->>Server: 13. 发送 COM_QUIT 命令
```

::: tip DBeaver 中的实用功能
- **ER 图**：Database → ER Diagram，可视化表关系
- **执行计划**：右键 SQL → Explain Execution Plan
- **会话管理**：Database → Active Connections，查看当前连接
- **数据导出**：右键表 → Export Data，支持 CSV/SQL/JSON 等格式
:::

## 6. 总结：架构分层与职责

```mermaid
flowchart TB
    subgraph Client["客户端层"]
        direction LR
        C1[CLI / JDBC / ODBC]
        C2[DBeaver / Navicat]
    end

    subgraph ServerLayer["Server 层（跨引擎通用）"]
        direction TB
        S1[连接器 - 连接管理/权限验证]
        S2[解析器 - 词法/语法分析]
        S3[优化器 - 执行计划选择]
        S4[执行器 - 调用引擎接口]
        S1 --> S2 --> S3 --> S4
    end

    subgraph EngineLayer["存储引擎层（可插拔替换）"]
        direction LR
        E1[InnoDB - 事务/行锁]
        E2[MyISAM - 全文索引]
        E3[Memory - 内存临时表]
    end

    subgraph FS["文件系统"]
        direction LR
        F1[(.ibd / .MYD / .MYI)]
        F2[(ib_logfile)]
    end

    Client -->|TCP/IP| ServerLayer
    S4 -->|Handler API| EngineLayer
    EngineLayer --> FS
```

| 层次 | 核心职责 | 关键组件 |
|------|---------|---------|
| 客户端层 | 发送 SQL、接收结果 | mysql CLI、DBeaver、JDBC 驱动 |
| 连接层 | 连接管理、权限验证 | 连接池、线程管理 |
| SQL 层 | 解析、优化、执行 | 解析器、优化器、执行器 |
| 存储引擎层 | 数据存取 | InnoDB、MyISAM、Memory |
| 文件系统 | 持久化存储 | .ibd、.MYD、Redo Log |

## 面试技巧

::: important 高频考点
1. **MySQL 分层架构**：Server 层 + 存储引擎层，Server 层处理 SQL 逻辑，存储引擎层负责数据存取。这是理解所有后续内容的基础。
2. **一条 SQL 的执行流程**：连接器 → 解析器 → 优化器 → 执行器 → 存储引擎。能清晰画出这个流程图是面试加分项。
3. **查询缓存为什么被移除**：高并发下缓存失效风暴（一次写操作导致整表缓存失效），收益远低于维护成本。
4. **InnoDB vs MyISAM**：事务支持、锁粒度、崩溃恢复是核心区别。面试中通常以"为什么选 InnoDB"的形式出现。
5. **存储引擎插件式架构的意义**：同一套 SQL 层代码，不同引擎有不同的存储和检索实现。理解这一点才能理解 InnoDB 为什么有聚簇索引而 MyISAM 没有。
6. **连接器权限缓存的坑**：连接建立后权限修改不会立即生效，需要重新连接。
:::

::: tip 参考资源
- [小林coding - MySQL 架构](https://xiaolincoding.com/mysql/)：图解 MySQL 架构体系，适合面试速查
- [MySQL 8.0 官方文档 - Architecture](https://dev.mysql.com/doc/refman/8.0/en/pluggable-storage-engine-overview.html)：存储引擎插件架构说明
- [DBeaver 源码](https://github.com/dbeaver/dbeaver)：开源数据库客户端，理解 C/S 交互
:::
