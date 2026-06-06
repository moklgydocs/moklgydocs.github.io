---
title: PostgreSQL 迁移实战
order: 2
category:
  - 数据库
  - PostgreSQL
tag:
  - PostgreSQL
  - 实战
  - 迁移
  - MySQL
  - pgLoader
---

# PostgreSQL 迁移实战

从 MySQL / Oracle 迁移到 PostgreSQL 是许多团队面临的技术决策。PG 更强的标准 SQL 兼容性、丰富的类型体系、开源生态（[Supabase](https://github.com/supabase/supabase)、[PostgREST](https://github.com/PostgREST/postgrest)）让它成为关系型数据库迁移的热门目标。但迁移不只是数据搬运，还涉及数据类型映射、SQL 方言适配、应用代码改造。

## 一、迁移全流程

```mermaid
flowchart LR
    A[1. 评估与规划] --> B[2. Schema 迁移]
    B --> C[3. 数据迁移]
    C --> D[4. 应用代码适配]
    D --> E[5. 数据校验]
    E --> F[6. 灰度切换]
    F --> G[7. 监控与回滚]

    style A fill:#e1f5fe
    style G fill:#e8f5e9
```

| 阶段 | 关键任务 | 风险点 |
|------|---------|--------|
| 评估与规划 | 数据量估算、兼容性分析、停机窗口 | 低估复杂度 |
| Schema 迁移 | DDL 转换、数据类型映射、索引重建 | 类型映射错误 |
| 数据迁移 | 全量导出导入、增量同步 | 数据丢失/乱码 |
| 应用代码适配 | SQL 方言改写、ORM 配置、驱动替换 | 边界 case |
| 数据校验 | 行数、checksum、业务抽检 | 校验不充分 |
| 灰度切换 | 读写分离、双写、流量切换 | 切换故障 |
| 监控与回滚 | 性能监控、回滚预案 | 回滚不可用 |

## 二、MySQL → PostgreSQL 数据类型映射

MySQL 和 PostgreSQL 的类型体系差异较大，以下是核心映射表：

| MySQL 类型 | PostgreSQL 类型 | 注意事项 |
|-----------|----------------|---------|
| `INT` | `INTEGER` | 兼容，无需转换 |
| `TINYINT` | `SMALLINT` | PG 无 TINYINT，用 SMALLINT 替代 |
| `SMALLINT` | `SMALLINT` | 完全兼容 |
| `BIGINT` | `BIGINT` | 完全兼容 |
| `FLOAT` | `REAL` | 精度可能微差，金融场景用 `NUMERIC` |
| `DOUBLE` | `DOUBLE PRECISION` | 兼容 |
| `DECIMAL(M,N)` | `NUMERIC(M,N)` | 完全兼容 |
| `VARCHAR(N)` | `VARCHAR(N)` | 兼容 |
| `CHAR(N)` | `CHAR(N)` | 兼容 |
| `TEXT` | `TEXT` | 兼容 |
| `DATETIME` | `TIMESTAMP` | PG TIMESTAMP 更精确（微秒级） |
| `DATE` | `DATE` | 兼容 |
| `TIME` | `TIME` | 兼容 |
| `YEAR` | `SMALLINT` | PG 无 YEAR 类型 |
| `ENUM` | `ENUM` 或 `TEXT` + CHECK | PG 的 ENUM 需先 CREATE TYPE |
| `SET` | `TEXT[]` 或 `JSONB` | PG 无 SET，用数组替代 |
| `JSON` | `JSONB` | **强烈建议用 JSONB**，支持索引和查询 |
| `BLOB` | `BYTEA` | 二进制存储，接口不同 |
| `AUTO_INCREMENT` | `SERIAL` / `BIGSERIAL` / `IDENTITY` | 推荐用 IDENTITY（PG 10+） |
| `UNSIGNED` | 无直接对应 | 用 CHECK 约束或更大类型 |
| `BOOLEAN`（TINYINT(1)） | `BOOLEAN` | PG 原生布尔类型 |

::: important 关键差异
1. **AUTO_INCREMENT → IDENTITY**：`SERIAL` 是旧语法（PG 10 之前），新项目建议用 `GENERATED ALWAYS AS IDENTITY`，更符合 SQL 标准
2. **UNSIGNED 不存在**：PG 没有无符号整数，需要用 `CHECK (col >= 0)` 约束或升级到大一号的类型
3. **JSON → JSONB**：PG 的 `JSON` 只是文本存储，`JSONB` 才支持索引和高性能查询，务必用 JSONB
4. **ENUM 语义不同**：MySQL 的 ENUM 是列级定义，PG 需要 `CREATE TYPE` 先定义枚举类型
:::

### 2.1 AUTO_INCREMENT 迁移示例

```sql
-- MySQL
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

-- PostgreSQL（方式一：SERIAL，兼容旧习惯）
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

-- PostgreSQL（方式二：IDENTITY，推荐，PG 10+）
CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100)
);
```

### 2.2 ENUM 迁移示例

```sql
-- MySQL
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('pending', 'paid', 'shipped', 'cancelled')
);

-- PostgreSQL
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'cancelled');

CREATE TABLE orders (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    status order_status NOT NULL DEFAULT 'pending'
);

-- 后续新增枚举值
ALTER TYPE order_status ADD VALUE 'refunded' AFTER 'shipped';
```

### 2.3 UNSIGNED 迁移示例

```sql
-- MySQL
CREATE TABLE products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    price DECIMAL(10,2) UNSIGNED NOT NULL,
    stock INT UNSIGNED DEFAULT 0
);

-- PostgreSQL：用 CHECK 约束替代 UNSIGNED
CREATE TABLE products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0)
);
```

## 三、迁移工具

### 3.1 pgLoader —— 通用迁移利器

[pgLoader](https://github.com/dimitri/pgloader) 是最推荐的 PostgreSQL 迁移工具，支持 MySQL、SQLite、CSV、dBase 等多种数据源。

```ini
-- pgloader 配置文件：mysql_to_pg.load
LOAD DATABASE
    FROM mysql://root:password@192.168.1.10/mydb
    INTO postgresql://postgres:password@192.168.1.20/mydb

WITH
    include drop,        -- 导入前先 DROP 目标表
    create tables,       -- 自动创建表
    create indexes,      -- 自动创建索引
    reset sequences,     -- 重置序列值
    downcase identifiers -- 标识符转小写

SET
    maintenance_work_mem to '512MB',
    work_mem to '128MB'

CAST
    type datetime to timestamptz using zero-dates-to-null,
    type tinyint to smallint,
    type mediumint to integer,
    type double to double precision,
    type enum to text,
    type year to smallint

BEFORE LOAD DO
    $$ CREATE SCHEMA IF NOT EXISTS mydb; $$

AFTER LOAD DO
    $$ ALTER TABLE mydb.users ALTER COLUMN created_at SET DEFAULT now(); $$
;
```

```bash
# 执行迁移
pgloader mysql_to_pg.load

# 输出示例：
# 2026-06-04T10:00:00.000000+08 INFO Starting pgloader
# 2026-06-04T10:00:05.000000+08 INFO Cloning MySQL schema...
# 2026-06-04T10:00:30.000000+08 INFO Copying data...
#                    Table name       reads   written     time
#              mydb.users           50000     50000   2.345s
#             mydb.orders          200000    200000   8.123s
#           mydb.products            5000      5000   0.456s
# 2026-06-04T10:01:00.000000+08 INFO Finishing...
# 2026-06-04T10:01:01.000000+08 INFO Done in 61.000s
```

::: tip pgLoader CAST 规则
pgLoader 的 `CAST` 是迁移的核心配置，必须根据业务仔细调整：
- `datetime to timestamptz using zero-dates-to-null`：MySQL 的 `0000-00-00` 日期转为 NULL
- `enum to text`：先迁移为 TEXT，后续手动创建 ENUM 类型
- `tinyint to smallint`：PG 无 TINYINT
:::

### 3.2 AWS Schema Conversion Tool（SCT）

适用于大型企业迁移，特别是 Oracle → PostgreSQL 场景：

- 自动分析源库 Schema 并生成转换报告
- 评估迁移复杂度和兼容性
- 自动转换存储过程、触发器、视图
- 支持 Oracle、MySQL、SQL Server → PostgreSQL

### 3.3 ora2pg —— Oracle 迁移专用

[ora2pg](https://ora2pg.darold.net/) 是最成熟的 Oracle → PostgreSQL 迁移工具：

- 支持 Schema、数据、存储过程、触发器、视图的完整迁移
- 可导出为 SQL 文件或直接导入 PG
- PL/SQL → PL/pgSQL 的自动转换（不完美，需人工审查）

### 3.4 工具选择指南

| 场景 | 推荐工具 |
|------|---------|
| MySQL → PG | pgLoader |
| Oracle → PG | ora2pg + AWS SCT |
| SQLite → PG | pgLoader |
| CSV → PG | `COPY` 命令或 pgLoader |
| 自定义复杂迁移 | 自写脚本 + `COPY` |

## 四、常见陷阱

### 4.1 标识符大小写

```sql
-- MySQL：标识符不区分大小写
CREATE TABLE Users (Name VARCHAR(100));
SELECT name FROM users;  -- OK

-- PostgreSQL：未引用的标识符自动转为小写
CREATE TABLE Users (Name VARCHAR(100));
-- 实际创建的表名是 "users"，列名是 "name"
SELECT name FROM users;  -- OK

-- 但如果创建时用了双引号，大小写被保留
CREATE TABLE "Users" ("Name" VARCHAR(100));
SELECT name FROM users;  -- ERROR: relation "users" does not exist
SELECT "Name" FROM "Users";  -- OK，但以后每次都要加引号
```

::: warning 最佳实践
- **永远不要**用双引号创建标识符
- 迁移前将 MySQL 中的标识符统一转小写
- pgLoader 的 `downcase identifiers` 选项可自动处理
:::

### 4.2 保留字冲突

MySQL 和 PG 的保留字不同，迁移后可能出现语法冲突：

```sql
-- MySQL 中 "user" 不是保留字
CREATE TABLE user (id INT, name VARCHAR(100));  -- MySQL OK

-- PostgreSQL 中 "user" 是保留字
CREATE TABLE user (id INT, name VARCHAR(100));  -- PG ERROR!
-- 必须加引号或改名
CREATE TABLE "user" (id INT, name VARCHAR(100));  -- 不推荐
CREATE TABLE app_user (id INT, name VARCHAR(100));  -- 推荐
```

常见 PG 保留字（MySQL 可用但 PG 不行）：`user`、`order`、`group`、`table`、`index`、`type`、`check`、`default`、`primary`。

### 4.3 LIMIT without ORDER BY

```sql
-- MySQL：无 ORDER BY 的 LIMIT 结果"相对稳定"（InnoDB 按主键顺序）
SELECT * FROM users LIMIT 10;

-- PostgreSQL：无 ORDER BY 的 LIMIT 结果**不确定**
-- 每次执行可能返回不同的行！
SELECT * FROM users LIMIT 10;  -- 可能每次结果不同

-- 必须加 ORDER BY
SELECT * FROM users ORDER BY id LIMIT 10;
```

### 4.4 存储过程重写

MySQL 的存储过程语法与 PG 的 PL/pgSQL 差异较大：

```sql
-- MySQL 存储过程
DELIMITER //
CREATE PROCEDURE get_user_orders(IN p_user_id INT)
BEGIN
    SELECT * FROM orders WHERE user_id = p_user_id;
    SELECT COUNT(*) AS total FROM orders WHERE user_id = p_user_id;
END //
DELIMITER ;

-- PostgreSQL PL/pgSQL
CREATE OR REPLACE FUNCTION get_user_orders(p_user_id INTEGER)
RETURNS TABLE(order_id BIGINT, title TEXT, amount NUMERIC) AS $$
BEGIN
    RETURN QUERY
        SELECT id, title, amount FROM orders WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
```

关键差异：
- PG 用 `FUNCTION` 而非 `PROCEDURE`（PG 11+ 支持 PROCEDURE 但语义不同）
- PG 函数必须有 `RETURNS` 声明
- PG 用 `$$` 而非 `DELIMITER`
- PG 的流程控制语法不同（`IF ... THEN ... END IF`、`LOOP ... END LOOP`）

## 五、数据迁移执行

### 5.1 全量迁移

```bash
# 方法一：pgLoader（推荐，自动化程度高）
pgloader mysql_to_pg.load

# 方法二：手动导出导入（适合小数据量）
# 1. MySQL 导出 CSV
mysql -e "SELECT * FROM orders" -B mydb | \
    sed 's/\t/,/g; s/^/"/; s/$/"/; s/,/","/g' > orders.csv

# 2. PostgreSQL 导入
\copy orders FROM '/tmp/orders.csv' WITH (FORMAT csv, HEADER true);
```

### 5.2 增量同步（零停机迁移）

大型系统需要零停机迁移，核心是**全量 + 增量**两阶段：

```mermaid
flowchart LR
    A["1. 全量导出<br/>MySQL → PG"] --> B["2. 开启增量同步<br/>Binlog → PG"]
    B --> C["3. 追平延迟<br/>持续同步"]
    C --> D{延迟 < 1秒?}
    D -->|否| C
    D -->|是| E["4. 切换流量<br/>MySQL → PG"]
    E --> F["5. 验证确认<br/>关闭 MySQL"]
```

增量同步工具：
- **Debezium** + **Kafka**：捕获 MySQL Binlog，写入 PG
- **pg_chameleon**：MySQL 到 PG 的复制工具
- 自建脚本：解析 Binlog → 生成 PG SQL

## 六、数据校验

迁移后必须验证数据完整性，不能只看行数。

### 6.1 校验脚本

```sql
-- 1. 行数对比
-- MySQL:
SELECT 'users' AS tbl, COUNT(*) AS cnt FROM users
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'products', COUNT(*) FROM products;

-- PostgreSQL:
SELECT 'users' AS tbl, COUNT(*) AS cnt FROM users
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'products', COUNT(*) FROM products;

-- 2. 关键表 Checksum
-- PostgreSQL:
SELECT md5(string_agg(t::text, ',' ORDER BY id))
FROM (
    SELECT id, name, email, created_at
    FROM users
    ORDER BY id
) t;

-- 3. 数值范围校验
SELECT 'orders' AS tbl,
       COUNT(*) AS total,
       MIN(amount) AS min_amount,
       MAX(amount) AS max_amount,
       AVG(amount) AS avg_amount,
       SUM(amount) AS sum_amount
FROM orders;

-- 4. NULL 值分布
SELECT column_name, null_ratio
FROM (
    SELECT 'name' AS column_name,
           round(COUNT(*) FILTER (WHERE name IS NULL)::numeric / COUNT(*) * 100, 2) AS null_ratio
    FROM users
) sub;
```

### 6.2 业务抽检

```sql
-- 随机抽取 100 条订单，对比 MySQL 和 PG 的数据
SELECT * FROM orders WHERE id IN (
    SELECT id FROM orders ORDER BY random() LIMIT 100
);
```

::: important 校验清单
- [ ] 所有表行数一致
- [ ] 关键表 checksum 一致
- [ ] 数值范围（MIN/MAX/SUM）一致
- [ ] NULL 值分布一致
- [ ] 外键关系完整
- [ ] 索引和约束已创建
- [ ] 业务抽检通过
:::

## 开源参考

| 项目 | 说明 |
|------|------|
| [Supabase](https://github.com/supabase/supabase) | 迁移到 PG 后可直接用 Supabase 快速搭建 API 层 |
| [PostgREST](https://github.com/PostgREST/postgrest) | 迁移后用 PostgREST 自动暴露 REST API |

## 面试技巧

::: tip 面试高频问题
1. **MySQL 和 PG 的核心类型差异？** 重点回答三个：`TINYINT → SMALLINT`、`AUTO_INCREMENT → IDENTITY`、`JSON → JSONB`。能说清"为什么用 JSONB 而不是 JSON"（索引 + 查询性能）是加分项。

2. **迁移中最容易踩的坑？** 标识符大小写（PG 自动转小写）和 LIMIT without ORDER BY（PG 结果不确定）。这是"做过迁移"和"只看过文档"的分水岭。

3. **如何做到零停机迁移？** 全量导出 + 增量同步（Debezium/Kafka + Binlog 解析）+ 追平延迟后切换流量。关键是"增量同步"这个环节。

4. **pgLoader 的 CAST 规则怎么配？** 重点说 `datetime to timestamptz using zero-dates-to-null`（MySQL 的零日期问题）和 `enum to text`（先迁后改）。这两点是实操经验的体现。

5. **迁移后如何验证？** 不能只看行数，还要 checksum、数值范围、NULL 分布、外键关系、业务抽检。能说出"多层校验"说明有生产经验。
:::
