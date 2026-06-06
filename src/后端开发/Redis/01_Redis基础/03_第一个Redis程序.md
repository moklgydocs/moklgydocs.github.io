---
title: 03 · 第一个 Redis 程序
order: 3
category:
  - Redis
  - 后端开发
tag:
  - Redis
  - redis-cli
  - 数据类型
  - RESP协议
  - 客户端工具
---

# 03 · 第一个 Redis 程序

## redis-cli 连接 Redis

`redis-cli`（Redis Command Line Interface）是 Redis 官方提供的命令行客户端，是与 Redis 交互最直接的工具。

### 基本连接

```bash
# 默认连接（localhost:6379）
redis-cli

# 指定主机和端口
redis-cli -h 192.168.1.100 -p 6379

# 带密码连接
redis-cli -h 192.168.1.100 -p 6379 -a your_password

# 使用环境变量传递密码（推荐，避免密码出现在命令历史）
export REDISCLI_AUTH=your_password
redis-cli -h 192.168.1.100 -p 6379

# TLS 连接
redis-cli --tls --cert /path/to/redis.crt --key /path/to/redis.key --cacert /path/to/ca.crt
```

### 交互模式

```bash
$ redis-cli
127.0.0.1:6379> PING
PONG

127.0.0.1:6379> SET name "Alice"
OK

127.0.0.1:6379> GET name
"Alice"

127.0.0.1:6379> DBSIZE
(integer) 1

127.0.0.1:6379> INFO server
# Server
redis_version:7.2.4
redis_mode:standalone
os:Linux 5.15.0-91-generic x86_64
...

# 退出
127.0.0.1:6379> QUIT
```

### 非交互模式（单次执行）

```bash
# 直接在命令行执行命令
redis-cli SET name "Alice"
redis-cli GET name
# "Alice"

# 执行带空格的值
redis-cli SET greeting "Hello, World!"

# 返回原始类型
redis-cli --raw GET greeting
# Hello, World! (不加引号)
```

### 管道模式

```bash
# 从标准输入读取命令
echo -e "SET key1 value1\nSET key2 value2\nGET key1" | redis-cli
# OK
# OK
# "value1"

# 从文件读取命令
cat commands.txt | redis-cli

# commands.txt 内容示例
# SET user:1:name Alice
# SET user:1:age 30
# HSET user:1 name Alice age 30
# INCR counter
```

### 连接参数一览

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `-h` | 服务器主机名 | 127.0.0.1 |
| `-p` | 服务器端口 | 6379 |
| `-a` | 密码 | 无 |
| `-n` | 数据库编号 | 0 |
| `-u` | URI 连接（redis://user:pass@host:port/db） | 无 |
| `--tls` | 启用 TLS | 否 |
| `--pipe` | 管道模式 | 否 |
| `--raw` | 原始输出 | 否 |
| `--no-auth-warning` | 抑制密码警告 | 否 |
| `-c` | 集群模式（自动重定向） | 否 |
| `--csv` | CSV 格式输出 | 否 |

::: tip URI 连接方式
```bash
# URI 格式: redis://[user:]password@host:port/db_number
redis-cli -u redis://admin:password@192.168.1.100:6379/0

# 带 TLS 的 URI
redis-cli -u rediss://admin:password@192.168.1.100:6380/0
```
`redis://` 是明文连接，`rediss://` 是 TLS 加密连接。
:::

## 客户端与服务端交互流程

当你在 redis-cli 中输入一条命令时，背后发生了什么？

```mermaid
sequenceDiagram
    participant CLI as redis-cli
    participant NET as 网络层
    participant EP as epoll 事件循环
    participant CMD as 命令执行器
    participant DATA as 数据存储

    CLI->>NET: 1. 建立 TCP 连接
    NET->>EP: 2. 注册可读事件
    EP-->>NET: 3. 连接建立成功

    CLI->>NET: 4. 发送 RESP 命令<br/>*2\r\n$3\r\nSET\r\n$3\r\nkey\r\n
    NET->>EP: 5. 触发可读事件
    EP->>CMD: 6. 读取并解析命令
    CMD->>CMD: 7. 查找命令表<br/>验证参数
    CMD->>DATA: 8. 执行 SET key value
    DATA-->>CMD: 9. 返回 OK
    CMD->>NET: 10. 封装 RESP 响应<br/>+OK\r\n
    NET-->>CLI: 11. 发送响应

    CLI->>NET: 12. 发送 GET key
    NET->>EP: 13. 触发可读事件
    EP->>CMD: 14. 读取并解析命令
    CMD->>DATA: 15. 执行 GET key
    DATA-->>CMD: 16. 返回 "value"
    CMD->>NET: 17. 封装 RESP 响应<br/>$5\r\nvalue\r\n
    NET-->>CLI: 18. 发送响应
```

### 交互过程的关键步骤

| 步骤 | 操作 | 说明 |
|------|------|------|
| 1. 建立连接 | TCP 三次握手 | 默认端口 6379 |
| 2. 认证 | AUTH 命令 | 如果设置了 requirepass |
| 3. 发送命令 | RESP 协议编码 | 序列化命令为 RESP 格式 |
| 4. 读取解析 | 命令解析器 | 解析命令名和参数 |
| 5. 查找命令 | 命令表 | 查找命令实现函数 |
| 6. 执行命令 | 执行引擎 | 单线程串行执行 |
| 7. 返回响应 | RESP 协议编码 | 序列化结果为 RESP 格式 |

## 基本数据操作

Redis 提供了丰富的数据类型，每种类型都有专属的命令集。本节以实战方式逐一演示五大基础类型。

### String — 字符串

String 是 Redis 最基础的数据类型，可以存储字符串、整数、浮点数，最大 512MB。

```mermaid
flowchart TB
    subgraph String类型
        STR[字符串<br/>"Hello, Redis!"]
        INT["整数<br/>42"]
        FLOAT["浮点数<br/>3.14"]
        BIN["二进制数据<br/>图片/序列化对象"]
    end

    STR --> SET[SET/GET]
    INT --> INCR[INCR/INCRBY/DECR]
    FLOAT --> INCRBYFLOAT
    BIN --> MSET[MSET/MGET]

    style STR fill:#DC382D,color:#fff
    style INT fill:#4CAF50,color:#fff
    style FLOAT fill:#2196F3,color:#fff
    style BIN fill:#FF9800,color:#fff
```

#### 基本操作

```bash
# SET: 设置值
SET name "Alice"

# GET: 获取值
GET name  # "Alice"

# SETNX: 仅当 key 不存在时设置（分布式锁常用）
SETNX lock:order 1  # (integer) 1 — 设置成功
SETNX lock:order 1  # (integer) 0 — key 已存在，设置失败

# SET with options（原子操作，推荐）
SET lock:order 1 NX EX 30  # 不存在时设置，30秒过期

# SETEX: 设置值并指定过期时间（秒）
SETEX session:token 1800 "user_1001"

# PSETEX: 设置值并指定过期时间（毫秒）
PSETEX cache:key 5000 "temp_value"

# GETSET: 设置新值并返回旧值
GETSET counter 0  # 返回旧值，并设置新值为 0

# DEL: 删除 key
DEL name  # (integer) 1

# EXISTS: 判断 key 是否存在
EXISTS name  # (integer) 0 — 已被删除
```

#### 数值操作

```bash
# 初始化计数器
SET page:views 0

# INCR: 自增 1
INCR page:views  # (integer) 1
INCR page:views  # (integer) 2

# INCRBY: 自增指定值
INCRBY page:views 10  # (integer) 12

# DECR: 自减 1
DECR page:views  # (integer) 11

# DECRBY: 自减指定值
DECRBY page:views 5  # (integer) 6

# INCRBYFLOAT: 自增浮点数
SET temperature 36.5
INCRBYFLOAT temperature 0.3  # "36.8"
```

::: important INCR 是原子操作
`INCR` 命令是原子的——读取当前值、加 1、写回——三步操作在单线程中不可中断。这就是为什么 Redis 的计数器在高并发场景下依然准确可靠，而数据库的 `UPDATE SET count = count + 1` 在并发时可能出错。
:::

#### 字符串操作

```bash
# APPEND: 追加字符串
SET greeting "Hello"
APPEND greeting ", World!"  # (integer) 13
GET greeting  # "Hello, World!"

# STRLEN: 获取字符串长度
STRLEN greeting  # (integer) 13

# GETRANGE: 获取子串
GETRANGE greeting 0 4  # "Hello"

# SETRANGE: 替换子串
SETRANGE greeting 7 "Redis!"  # (integer) 13
GET greeting  # "Hello, Redis!"

# MSET: 批量设置
MSET key1 "value1" key2 "value2" key3 "value3"

# MGET: 批量获取
MGET key1 key2 key3
# 1) "value1"
# 2) "value2"
# 3) "value3"
```

#### String 编码优化

```mermaid
flowchart LR
    subgraph String编码选择
        INT["int 编码<br/>整数值<br/>8字节长整"]
        EMBSTR["embstr 编码<br/>字符串 ≤ 44 字节<br/>一次内存分配"]
        RAW["raw 编码<br/>字符串 > 44 字节<br/>SDS 实现"]
    end

    INT --> |非整数或超长| EMBSTR
    EMBSTR --> |超过44字节| RAW

    style INT fill:#4CAF50,color:#fff
    style EMBSTR fill:#FF9800,color:#fff
    style RAW fill:#DC382D,color:#fff
```

| 编码 | 条件 | 内存分配次数 | 特点 |
|------|------|-------------|------|
| **int** | 值为整数且 ≤ LONG_MAX | 0 | 直接存储在结构体中 |
| **embstr** | 字符串 ≤ 44 字节 | 1 | RedisObject 和 SDS 一次分配 |
| **raw** | 字符串 > 44 字节 | 2 | RedisObject 和 SDS 分开分配 |

::: tip 44 字节的分界线
embstr 将 RedisObject（16 字节）和 SDS（3 字节头 + 内容 + 1 字节 \0）放在一块连续内存中，总共不超过 64 字节（CPU 缓存行大小）。所以内容长度 = 64 - 16 - 3 - 1 = 44 字节。超过 44 字节就会使用 raw 编码，两次内存分配，且数据不在同一缓存行。
:::

### Hash — 哈希

Hash 是键值对的集合，适合存储对象。可以理解为"嵌套的字典"。

```mermaid
flowchart TB
    subgraph Hash结构
        KEY["user:1001<br/>(Hash Key)"]
        KEY --> F1["name → Alice"]
        KEY --> F2["age → 30"]
        KEY --> F3["email → alice@example.com"]
        KEY --> F4["role → admin"]
    end

    subgraph 与String对比
        STR_KEY["user:1001<br/>(String Key)"]
        STR_KEY --> VAL["JSON字符串<br/>{\"name\":\"Alice\",\"age\":30,...}"]
    end

    style KEY fill:#DC382D,color:#fff
    style STR_KEY fill:#FF9800,color:#fff
```

#### 基本操作

```bash
# HSET: 设置字段（Redis 4.0+ 支持多字段）
HSET user:1001 name "Alice" age 30 email "alice@example.com"

# HGET: 获取单个字段
HGET user:1001 name  # "Alice"

# HMGET: 获取多个字段
HMGET user:1001 name age email
# 1) "Alice"
# 2) "30"
# 3) "alice@example.com"

# HGETALL: 获取所有字段和值
HGETALL user:1001
# 1) "name"
# 2) "Alice"
# 3) "age"
# 4) "30"
# 5) "email"
# 6) "alice@example.com"

# HSET: 更新单个字段
HSET user:1001 age 31

# HDEL: 删除字段
HDEL user:1001 email  # (integer) 1

# HEXISTS: 判断字段是否存在
HEXISTS user:1001 name  # (integer) 1
HEXISTS user:1001 email  # (integer) 0 — 已删除
```

#### 数值操作

```bash
# HINCRBY: 字段值自增
HINCRBY user:1001 age 1  # (integer) 32

# HINCRBYFLOAT: 字段值自增浮点数
HSET product:2001 price 99.9
HINCRBYFLOAT product:2001 price 0.1  # "100"
```

#### 其他常用操作

```bash
# HKEYS: 获取所有字段名
HKEYS user:1001  # 1) "name" 2) "age"

# HVALS: 获取所有字段值
HVALS user:1001  # 1) "Alice" 2) "32"

# HLEN: 获取字段数量
HLEN user:1001  # (integer) 2

# HSETNX: 仅当字段不存在时设置
HSETNX user:1001 name "Bob"  # (integer) 0 — name 已存在
HSETNX user:1001 phone "13800138000"  # (integer) 1 — 设置成功

# HRANDFIELD: 随机获取字段（6.2+）
HRANDFIELD user:1001 1  # 随机返回1个字段名
HRANDFIELD user:1001 2 WITHVALUES  # 随机返回2个字段名和值
```

#### Hash vs String 存储对象

| 维度 | Hash（HSET） | String（JSON） |
|------|-------------|----------------|
| **部分读写** | 原生支持（HGET/HSET） | 需要读取整个 JSON |
| **内存占用** | 小对象用 listpack 更省 | 可能更浪费 |
| **过期** | 不能对单个字段设置过期 | 只能对整个 Key 设置 |
| **复杂嵌套** | 不支持（仅一层） | 支持（嵌套 JSON） |
| **查询** | 不支持范围查询 | 不支持 |

::: tip 什么时候用 Hash，什么时候用 String JSON？
- 字段固定、需要单独访问 → **Hash**（如用户基本信息）
- 结构复杂、嵌套层级多 → **String + JSON**（如完整订单信息）
- 字段需要独立过期 → **String**（Hash 不支持字段级过期）
- 仅需要整体读写 → **String + JSON** 更简单
:::

### List — 列表

List 是有序的字符串列表，按插入顺序排序，支持从两端推入和弹出元素。

```mermaid
flowchart LR
    subgraph List结构
        LPUSH --> E5["E5"] --> E4["E4"] --> E3["E3"] --> E2["E2"] --> E1["E1"] --> RPUSH
    end

    subgraph 常用操作
        LPOP["LPOP<br/>左端弹出"]
        RPOP["RPOP<br/>右端弹出"]
        LRANGE["LRANGE<br/>范围查询"]
        LINDEX["LINDEX<br/>按索引查询"]
    end

    LPOP --> E5
    RPOP --> E1

    style LPUSH fill:#4CAF50,color:#fff
    style RPUSH fill:#FF9800,color:#fff
    style LPOP fill:#2196F3,color:#fff
    style RPOP fill:#9C27B0,color:#fff
```

#### 基本操作

```bash
# LPUSH: 从左端推入元素
LPUSH tasks "task3"  # (integer) 1
LPUSH tasks "task2"  # (integer) 2
LPUSH tasks "task1"  # (integer) 3
# 列表: ["task1", "task2", "task3"]

# RPUSH: 从右端推入元素
RPUSH tasks "task4"  # (integer) 4
RPUSH tasks "task5"  # (integer) 5
# 列表: ["task1", "task2", "task3", "task4", "task5"]

# LRANGE: 获取指定范围的元素（0为起始，-1为末尾）
LRANGE tasks 0 -1
# 1) "task1"  2) "task2"  3) "task3"  4) "task4"  5) "task5"

LRANGE tasks 0 2
# 1) "task1"  2) "task2"  3) "task3"

# LLEN: 获取列表长度
LLEN tasks  # (integer) 5
```

#### 弹出操作

```bash
# LPOP: 从左端弹出
LPOP tasks  # "task1"

# RPOP: 从右端弹出
RPOP tasks  # "task5"

# LPOP count: 弹出多个元素（6.2+）
LPUSH queue a b c d e
LPOP queue 3
# 1) "e"  2) "d"  3) "c"

# 阻塞弹出（超时0表示无限等待）
BLPOP queue 30  # 左端阻塞弹出，最多等30秒
BRPOP queue 30  # 右端阻塞弹出，最多等30秒
```

#### 修改操作

```bash
# LSET: 修改指定索引的元素
LSET tasks 0 "task2_updated"

# LINSERT: 在指定元素前后插入
LINSERT tasks BEFORE "task3" "task2.5"
LINSERT tasks AFTER "task3" "task3.5"

# LREM: 移除指定元素
LREM tasks 1 "task2.5"  # 从左端移除1个 "task2.5"

# LTRIM: 保留指定范围的元素（裁剪列表）
LPUSH logs "log1" "log2" "log3" "log4" "log5"
LTRIM logs 0 2  # 只保留前3个元素
LRANGE logs 0 -1  # 1) "log5"  2) "log4"  3) "log3"
```

#### List 的典型应用

```mermaid
flowchart TB
    subgraph 消息队列
        PRODUCER["生产者<br/>LPUSH"] --> QUEUE["Queue<br/>List"]
        QUEUE --> CONSUMER["消费者<br/>BRPOP"]
    end

    subgraph 最新列表
        NEW[新文章/动态] --> LPUSH2[LPUSH timeline]
        LPUSH2 --> LTRIM2["LTRIM 0 99<br/>保留最新100条"]
        LTRIM2 --> READ["LRANGE 0 -1<br/>读取时间线"]
    end

    subgraph 栈结构
        PUSH[LPUSH] --> STACK[Stack]
        STACK --> POP[LPOP]
    end

    style QUEUE fill:#DC382D,color:#fff
    style STACK fill:#4CAF50,color:#fff
```

::: warning List 作为消息队列的局限
- **消息丢失**：消费者崩溃后未处理的消息丢失
- **不支持消费组**：一条消息只能被一个消费者消费
- **不支持消息回溯**：已消费的消息无法重新消费
- **推荐替代**：使用 Redis Stream（支持消费组、ACK、持久化）
:::

### Set — 集合

Set 是无序的字符串集合，元素不重复，支持交集、并集、差集等集合运算。

```mermaid
flowchart TB
    subgraph Set运算
        A["Set A<br/>{1,2,3,4}"]
        B["Set B<br/>{3,4,5,6}"]
    end

    subgraph 运算结果
        INTER["交集 A∩B<br/>{3,4}<br/>SINTER"]
        UNION["并集 A∪B<br/>{1,2,3,4,5,6}<br/>SUNION"]
        DIFF["差集 A-B<br/>{1,2}<br/>SDIFF"]
    end

    A --> INTER
    B --> INTER
    A --> UNION
    B --> UNION
    A --> DIFF

    style INTER fill:#4CAF50,color:#fff
    style UNION fill:#2196F3,color:#fff
    style DIFF fill:#FF9800,color:#fff
```

#### 基本操作

```bash
# SADD: 添加元素
SADD tags:article:1 "redis" "database" "nosql"  # (integer) 3
SADD tags:article:2 "redis" "cache" "performance"  # (integer) 3

# SMEMBERS: 获取所有元素
SMEMBERS tags:article:1
# 1) "redis"  2) "database"  3) "nosql"

# SISMEMBER: 判断元素是否存在
SISMEMBER tags:article:1 "redis"  # (integer) 1
SISMEMBER tags:article:1 "mysql"  # (integer) 0

# SCARD: 获取元素数量
SCARD tags:article:1  # (integer) 3

# SREM: 移除元素
SREM tags:article:1 "nosql"  # (integer) 1

# SPOP: 随机弹出元素
SPOP tags:article:1  # 随机弹出一个元素

# SRANDMEMBER: 随机获取元素（不弹出）
SRANDMEMBER tags:article:2 2  # 随机返回2个元素
```

#### 集合运算

```bash
# SINTER: 交集
SINTER tags:article:1 tags:article:2
# 1) "redis"  — 两个文章共有的标签

# SUNION: 并集
SUNION tags:article:1 tags:article:2
# 1) "redis"  2) "database"  3) "cache"  4) "performance"

# SDIFF: 差集（在第一个集合但不在第二个集合）
SDIFF tags:article:1 tags:article:2
# 1) "database"  — article:1 独有的标签

# SINTERSTORE: 交集并存储
SINTERSTORE common:tags tags:article:1 tags:article:2

# SUNIONSTORE: 并集并存储
SUNIONSTORE all:tags tags:article:1 tags:article:2

# SDIFFSTORE: 差集并存储
SDIFFSTORE unique:tags tags:article:1 tags:article:2
```

#### Set 的典型应用

| 应用 | 命令 | 说明 |
|------|------|------|
| **标签系统** | SADD / SINTER | 文章标签、用户兴趣 |
| **共同好友** | SINTER | 两个用户的好友交集 |
| **唯一计数** | SADD / SCARD | 独立 IP、独立访客 |
| **抽奖系统** | SRANDMEMBER / SPOP | 随机抽取 |
| **黑白名单** | SISMEMBER | 快速判断是否在名单中 |

```bash
# 抽奖系统示例
SADD lottery:2024 "user1" "user2" "user3" "user4" "user5"

# 抽1个一等奖（不移除）
SRANDMEMBER lottery:2024 1  # 随机返回1人

# 抽3个幸运奖（移除，不可重复中奖）
SPOP lottery:2024 3
```

### ZSet（Sorted Set）— 有序集合

ZSet 是有序的字符串集合，每个元素关联一个分数（score），按分数排序。兼具 Set 的不重复和 List 的有序性。

```mermaid
flowchart TB
    subgraph ZSet结构
        ZKEY["game:ranking"]
        ZKEY --> M1["Alice → 9500"]
        ZKEY --> M2["Carol → 9200"]
        ZKEY --> M3["Bob → 8800"]
        ZKEY --> M4["Dave → 8500"]
        ZKEY --> M5["Eve → 8200"]
    end

    subgraph 双重编码
        HT["Hashtable<br/>O(1) 查找分数"]
        SL["Skiplist<br/>O(logN) 范围查询"]
    end

    M1 --> HT
    M1 --> SL

    style ZKEY fill:#DC382D,color:#fff
    style HT fill:#4CAF50,color:#fff
    style SL fill:#2196F3,color:#fff
```

#### 基本操作

```bash
# ZADD: 添加元素（支持多个）
ZADD game:ranking 9500 "Alice" 8800 "Bob" 9200 "Carol"

# ZSCORE: 获取分数
ZSCORE game:ranking "Alice"  # "9500"

# ZRANK: 获取排名（升序，从0开始）
ZRANK game:ranking "Alice"  # (integer) 2 — 第3名（升序）

# ZREVRANK: 获取排名（降序，从0开始）
ZREVRANK game:ranking "Alice"  # (integer) 0 — 第1名（降序）

# ZCARD: 获取元素数量
ZCARD game:ranking  # (integer) 3

# ZCOUNT: 统计分数范围内的元素数
ZCOUNT game:ranking 9000 10000  # (integer) 2

# ZINCRBY: 增加分数
ZINCRBY game:ranking 100 "Bob"  # "8900"

# ZREM: 移除元素
ZADD game:ranking 8000 "Dave"
ZREM game:ranking "Dave"  # (integer) 1
```

#### 范围查询

```bash
# 添加更多数据
ZADD game:ranking 9800 "Frank" 7500 "Grace" 6000 "Henry"

# ZRANGE: 按排名范围查询（升序）
ZRANGE game:ranking 0 2 WITHSCORES
# 1) "Henry"  2) "6000"  3) "Grace"  4) "7500"  5) "Bob"  6) "8900"

# ZREVRANGE: 按排名范围查询（降序）— 排行榜常用
ZREVRANGE game:ranking 0 2 WITHSCORES
# 1) "Frank"  2) "9800"  3) "Alice"  4) "9500"  5) "Carol"  6) "9200"

# ZRANGEBYSCORE: 按分数范围查询
ZRANGEBYSCORE game:ranking 8000 9500 WITHSCORES
# 1) "Bob"  2) "8900"  3) "Carol"  4) "9200"  5) "Alice"  6) "9500"

# ZRANGEBYSCORE 带分页
ZRANGEBYSCORE game:ranking -inf +inf WITHSCORES LIMIT 0 3
# 1) "Henry"  2) "6000"  3) "Grace"  4) "7500"  5) "Bob"  6) "8900"

# ZREVRANGEBYSCORE: 按分数范围查询（降序）
ZREVRANGEBYSCORE game:ranking 9500 8000 WITHSCORES
# 1) "Alice"  2) "9500"  3) "Carol"  4) "9200"  5) "Bob"  6) "8900"
```

::: important ZRANGE 的进化
Redis 6.2 统一了范围查询命令，`ZRANGE` 现在可以通过选项替代多个旧命令：

```bash
# 新语法（6.2+）
ZRANGE game:ranking 0 2 REV WITHSCORES     # 替代 ZREVRANGE
ZRANGE game:ranking 8000 9500 BYSCORE WITHSCORES  # 替代 ZRANGEBYSCORE
ZRANGE game:ranking 8000 9500 BYSCORE REV WITHSCORES  # 替代 ZREVRANGEBYSCORE
ZRANGE game:ranking 0 2 BYLEX WITHSCORES    # 按字典序

# 旧命令仍然可用，但推荐使用新语法
```
:::

#### 集合运算

```bash
# ZUNIONSTORE: 并集
ZADD math:score 90 "Alice" 85 "Bob" 95 "Carol"
ZADD english:score 88 "Alice" 92 "Bob" 80 "Carol"

# 计算总分（默认 SUM）
ZUNIONSTORE total:score 2 math:score english:score
ZRANGE total:score 0 -1 WITHSCORES
# 1) "Carol"  2) "175"  3) "Bob"  4) "177"  5) "Alice"  6) "178"

# 加权计算
ZUNIONSTORE weighted:score 2 math:score english:score WEIGHTS 0.6 0.4
ZRANGE weighted:score 0 -1 WITHSCORES

# ZINTERSTORE: 交集
ZINTERSTORE both:score 2 math:score english:score
ZRANGE both:score 0 -1 WITHSCORES
```

#### ZSet 的典型应用

| 应用 | 实现方式 | 命令 |
|------|---------|------|
| **排行榜** | 分数 = 积分/得分 | ZADD + ZREVRANGE |
| **延迟队列** | 分数 = 时间戳 | ZADD + ZRANGEBYSCORE |
| **滑动窗口限流** | 分数 = 时间戳 | ZADD + ZREMRANGEBYSCORE + ZCARD |
| **带权重的标签** | 分数 = 权重 | ZADD + ZRANGEBYSCORE |
| **时间线** | 分数 = 时间戳 | ZADD + ZREVRANGE |

```bash
# 滑动窗口限流器示例
# 限制：每分钟最多100次请求
SET rate_limit:lua ""
EVAL "
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local limit = tonumber(ARGV[3])
  redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
  local count = redis.call('ZCARD', key)
  if count < limit then
    redis.call('ZADD', key, now, now .. '-' .. math.random(1000000))
    redis.call('EXPIRE', key, window / 1000)
    return 1
  else
    return 0
  end
" 1 rate_limit:user:1001 1706745600000 60000 100
```

## KEY 管理

KEY 是 Redis 中最基本的管理单元，掌握 KEY 管理命令是使用 Redis 的基本功。

### KEY 操作命令

```bash
# EXISTS: 判断 Key 是否存在（可判断多个）
EXISTS name        # (integer) 1
EXISTS name age    # (integer) 2 — 返回存在的 Key 数量

# TYPE: 获取 Key 的类型
TYPE user:1001     # hash
TYPE page:views    # string
TYPE tags:1        # set

# RENAME: 重命名 Key
RENAME old_key new_key

# RENAMENX: 仅当新 Key 不存在时重命名
RENAMENX old_key new_key  # (integer) 1

# COPY: 复制 Key（6.2+）
COPY source_key dest_key

# SWAPDB: 交换两个数据库（4.0+）
SWAPDB 0 1  # 交换 db0 和 db1 的所有数据
```

### 过期时间管理

```bash
# EXPIRE: 设置过期时间（秒）
EXPIRE session:token 1800  # 30分钟后过期

# PEXPIRE: 设置过期时间（毫秒）
PEXPIRE cache:key 5000  # 5秒后过期

# EXPIREAT: 设置过期时间点（Unix 时间戳）
EXPIREAT promo:code 1706745600  # 在指定时间戳过期

# PEXPIREAT: 设置过期时间点（毫秒级时间戳）
PEXPIREAT cache:key 1706745600000

# TTL: 查看剩余过期时间（秒）
TTL session:token  # (integer) 1795

# PTTL: 查看剩余过期时间（毫秒）
PTTL session:token  # (integer) 1795000

# PERSIST: 移除过期时间（变为永久 Key）
PERSIST session:token  # (integer) 1
```

```mermaid
flowchart LR
    subgraph 过期时间设置
        EXPIRE["EXPIRE key 秒"]
        PEXPIRE["PEXPIRE key 毫秒"]
        EXPIREAT["EXPIREAT key 时间戳"]
        SET_EX["SET key val EX 秒"]
        SETEX["SETEX key 秒 val"]
    end

    subgraph 过期时间查询
        TTL["TTL key → 剩余秒数"]
        PTTL["PTTL key → 剩余毫秒"]
    end

    subgraph 过期时间移除
        PERSIST["PERSIST key"]
    end

    style SET_EX fill:#4CAF50,color:#fff
    style TTL fill:#2196F3,color:#fff
```

::: important 过期 Key 的删除策略
Redis 使用两种策略配合删除过期 Key：

1. **惰性删除**：访问 Key 时检查是否过期，过期则删除
2. **定期删除**：每 100ms 随机抽取一批设置了过期时间的 Key，检查并删除过期的

两种策略配合使用，在性能和内存之间取得平衡。但仍有少量 Key 可能长期未被访问也未被定期抽取到，造成内存浪费。这就是 `maxmemory-policy` 存在的原因。
:::

### 遍历 Key

```bash
# KEYS: 匹配所有 Key（阻塞，生产环境禁用！）
KEYS *                # 所有 Key
KEYS user:*           # 匹配 user: 开头的 Key
KEYS session:*:token  # 匹配 session:任意:token 模式

# SCAN: 增量遍历 Key（推荐）
SCAN 0 MATCH user:* COUNT 100
# 返回: 1) "17" (游标)  2) 1) "user:1001"  2) "user:1002"

# 继续遍历
SCAN 17 MATCH user:* COUNT 100
# 返回: 1) "0" (游标为0表示遍历结束)  2) 1) "user:1003"

# 类型专用 SCAN
HSCAN user:1001 0 MATCH name* COUNT 100    # Hash
SSCAN tags:1 0 MATCH redis* COUNT 100      # Set
ZSCAN game:ranking 0 MATCH A* COUNT 100    # ZSet
```

::: warning 为什么生产环境禁止 KEYS？
`KEYS *` 的时间复杂度是 O(N)，N 为数据库中 Key 的总数。在百万级 Key 的数据库上执行 `KEYS *` 会导致 Redis 阻塞数秒，期间所有客户端请求都无法处理，相当于一次小型的服务中断。

替代方案：
- **SCAN**：增量遍历，不阻塞
- **Redis Scan** 系列命令：HSCAN/SSCAN/ZSCAN
- **业务层维护 Key 集合**：使用 Set 记录相关 Key
:::

### Key 命名规范

```bash
# 推荐命名规范
# 格式: 业务:实体:ID[:属性]
user:1001                    # 用户对象
user:1001:profile            # 用户资料
order:20240201:1001          # 订单
cache:product:detail:2001    # 商品缓存
lock:order:1001              # 分布式锁
queue:email:send             # 消息队列
rate_limit:api:/order:1001   # 限流器

# 分隔符建议
# - 使用冒号 : 分隔层级（最常见）
# - 使用点 . 分隔模块（部分团队偏好）
# - 避免使用特殊字符和空格
```

| 规范 | 示例 | 说明 |
|------|------|------|
| **冒号分隔** | `user:1001:profile` | 层级清晰 |
| **业务前缀** | `order:xxx` | 避免不同业务 Key 冲突 |
| **ID 置后** | `user:1001` | 方便 SCAN 按前缀查找 |
| **长度适中** | `u:1001` vs `user_information:1001` | 过短不清晰，过长浪费内存 |
| **统一小写** | `user:1001` | 避免大小写混淆 |

## 数据库切换

Redis 默认提供 16 个数据库（编号 0-15），通过 `databases` 配置项可以修改。

```bash
# 默认连接 db0
redis-cli
127.0.0.1:6379> SELECT 0

# 切换到 db1
127.0.0.1:6379> SELECT 1
OK
127.0.0.1:6379[1]>

# 切换到 db15
127.0.0.1:6379[1]> SELECT 15
OK
127.0.0.1:6379[15]>

# 命令行直接指定数据库
redis-cli -n 1

# 查看当前数据库 Key 数量
DBSIZE

# 清空当前数据库
FLUSHDB

# 清空所有数据库（危险！）
FLUSHALL
```

```mermaid
flowchart TB
    subgraph Redis实例
        DB0["db0<br/>默认数据库<br/>生产数据"]
        DB1["db1<br/>测试数据"]
        DB2["db2<br/>临时缓存"]
        DB3["db3<br/>..."]
        DB15["db15"]
    end

    CLIENT[客户端] -->|"SELECT 0"| DB0
    CLIENT -->|"SELECT 1"| DB1
    CLIENT -->|"SELECT 2"| DB2

    style DB0 fill:#DC382D,color:#fff
    style DB1 fill:#4CAF50,color:#fff
    style DB2 fill:#2196F3,color:#fff
```

::: warning 多数据库的使用建议
- **不推荐**在生产环境使用多数据库，原因：
  1. 所有数据库共享同一个 Redis 实例的内存和 CPU
  2. `FLUSHALL` 会清空所有数据库
  3. 不利于资源隔离和监控
  4. Redis Cluster 模式只使用 db0
- **推荐做法**：不同业务使用不同的 Redis 实例，而非不同数据库
- **合理使用**：开发/测试环境可以用不同数据库隔离数据
:::

## 客户端工具

除了 redis-cli，还有多种可视化客户端工具可以提升 Redis 使用体验。

### RedisInsight

RedisInsight 是 Redis 官方出品的可视化工具，功能最全面：

```bash
# Docker 启动
docker run -d --name redis-insight \
  -p 8001:8001 \
  -v redisinsight_data:/db \
  redis/redisinsight:latest
```

| 功能 | 说明 |
|------|------|
| **Browser** | 可视化浏览和管理 Key |
| **CLI** | 内置命令行，支持语法高亮 |
| **Profiler** | 实时分析命令执行 |
| **Memory Analysis** | 内存使用分析 |
| **Pub/Sub** | 可视化发布订阅 |
| **Workbench** | 可视化操作 RediSearch、RedisJSON 等 |
| **CLI Auto-Complete** | 命令自动补全 |

### Another Redis Desktop Manager

开源免费的跨平台 Redis 可视化管理工具：

| 特点 | 说明 |
|------|------|
| **跨平台** | Windows / macOS / Linux |
| **轻量级** | 基于 Electron，资源占用少 |
| **SSH Tunnel** | 支持 SSH 隧道连接 |
| **多语言** | 支持中文界面 |
| **树形视图** | 以冒号分隔符展示 Key 层级 |

```bash
# 安装（macOS）
brew install --cask another-redis-desktop-manager

# Windows 下载安装包
# https://github.com/qishibo/AnotherRedisDesktopManager/releases
```

### 命令行工具对比

| 工具 | 类型 | 优势 | 不足 |
|------|------|------|------|
| **redis-cli** | 命令行 | 官方支持、全功能 | 无可视化 |
| **RedisInsight** | Web GUI | 官方出品、功能最全 | 较重、需要浏览器 |
| **Another Redis Desktop Manager** | 桌面 GUI | 轻量、开源、中文支持 | 功能不如 RedisInsight 全 |
| **Tiny RDM** | 桌面 GUI | 现代UI、Go 编写 | 较新，功能在完善中 |

## RESP 协议简介

RESP（**R**edis **S**erialization **P**rotocol）是 Redis 客户端与服务端之间的通信协议。理解 RESP 有助于深入理解 Redis 的通信机制。

### RESP 数据类型

```mermaid
flowchart TB
    RESP[RESP 协议数据类型]

    RESP --> SIMPLE["简单字符串<br/>+OK\r\n"]
    RESP --> ERROR["错误<br/>-ERR unknown command\r\n"]
    RESP --> INTEGER["整数<br/>:1\r\n"]
    RESP --> BULK["批量字符串<br/>$5\r\nhello\r\n"]
    RESP --> ARRAY["数组<br/>*2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n"]

    style SIMPLE fill:#4CAF50,color:#fff
    style ERROR fill:#FF5252,color:#fff
    style INTEGER fill:#2196F3,color:#fff
    style BULK fill:#FF9800,color:#fff
    style ARRAY fill:#9C27B0,color:#fff
```

| 类型 | 前缀 | 示例 | 说明 |
|------|------|------|------|
| **简单字符串** | `+` | `+OK\r\n` | 状态回复（如 SET 成功） |
| **错误** | `-` | `-ERR unknown command 'foo'\r\n` | 错误回复 |
| **整数** | `:` | `:1\r\n` | 整数回复（如 INCR 结果） |
| **批量字符串** | `$` | `$5\r\nhello\r\n` | 二进制安全字符串 |
| **数组** | `*` | `*2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n` | 多值回复 |

### RESP 编码示例

```
# 客户端发送命令: SET name Alice
# 编码为 RESP 数组:
*3\r\n
$3\r\n
SET\r\n
$4\r\n
name\r\n
$5\r\n
Alice\r\n

# 服务端返回: OK
+OK\r\n

# 客户端发送命令: GET name
*2\r\n
$3\r\n
GET\r\n
$4\r\n
name\r\n

# 服务端返回: "Alice"
$5\r\n
Alice\r\n

# 客户端发送命令: INCR counter
*2\r\n
$4\r\n
INCR\r\n
$7\r\n
counter\r\n

# 服务端返回: 1
:1\r\n

# 客户端发送命令: GET nonexistent_key
*2\r\n
$3\r\n
GET\r\n
$16\r\n
nonexistent_key\r\n

# 服务端返回: nil
$-1\r\n
```

::: tip RESP 的设计哲学
1. **简单**：人类可读，易于调试
2. **二进制安全**：可以传输任意二进制数据
3. **高效**：前缀 + 长度，解析速度快
4. **可嵌套**：数组中可以包含数组，支持复杂结构

RESP 协议之所以高效，是因为：
- 使用长度前缀而非分隔符，不需要转义
- 解析器实现简单，CPU 消耗少
- 批量字符串支持管道（Pipeline），减少网络往返
:::

### 抓包观察 RESP

```bash
# 使用 nc 手动发送 RESP 命令
nc localhost 6379

# 输入 RESP 编码的 PING 命令
*1
$4
PING

# 返回
+PONG

# 输入 RESP 编码的 SET 命令
*3
$3
SET
$4
name
$5
Alice

# 返回
+OK

# 输入 RESP 编码的 GET 命令
*2
$3
GET
$4
name

# 返回
$5
Alice
```

## 完整实战演练

以下是一个模拟电商场景的综合实战：

```bash
# ==================== 用户信息（Hash） ====================
HSET user:1001 name "Alice" level "VIP" points 9500
HSET user:1002 name "Bob" level "Normal" points 3200

# ==================== 商品库存（String + 数值操作） ====================
SET stock:iPhone15 1000
SET stock:MacBookPro 500

# ==================== 购物车（Hash） ====================
HSET cart:1001 iPhone15 1 MacBookPro 2

# ==================== 商品标签（Set） ====================
SADD product:tags:iPhone15 "手机" "苹果" "旗舰" "5G"
SADD product:tags:MacBookPro "电脑" "苹果" "专业" "M3"

# 找到同时有"苹果"和"旗舰"标签的商品
SINTER product:tags:iPhone15 product:tags:MacBookPro
# 1) "苹果"

# ==================== 销量排行榜（ZSet） ====================
ZADD sales:ranking 9500 "iPhone15" 7200 "MacBookPro" 5800 "AirPods"

# Top 3 畅销商品
ZREVRANGE sales:ranking 0 2 WITHSCORES
# 1) "iPhone15"  2) "9500"  3) "MacBookPro"  4) "7200"  5) "AirPods"  6) "5800"

# iPhone15 卖出10台
ZINCRBY sales:ranking 10 "iPhone15"  # "9510"
DECRBY stock:iPhone15 10  # (integer) 990

# ==================== 浏览历史（List） ====================
LPUSH history:1001 "product:MacBookPro" "product:iPhone15" "product:AirPods"
LTRIM history:1001 0 9  # 保留最近10条

# ==================== 实时统计（String + HyperLogLog） ====================
INCR page:views:20240201  # 页面浏览量
PFADD uv:20240201 user:1001  # 独立访客

# ==================== 会话管理（String + 过期） ====================
SET session:token_abc123 "user:1001" EX 1800  # 30分钟过期

# ==================== 分布式锁（String + NX） ====================
SET lock:order:2001 "uuid-xxxx" NX EX 30
```

### 数据关系全景图

```mermaid
flowchart TB
    subgraph 电商Redis数据模型
        USER["user:1001<br/>(Hash)<br/>name/Alice level/VIP"]
        CART["cart:1001<br/>(Hash)<br/>iPhone15/1 MacBookPro/2"]
        STOCK_i["stock:iPhone15<br/>(String)<br/>990"]
        STOCK_m["stock:MacBookPro<br/>(String)<br/>500"]
        TAGS_i["product:tags:iPhone15<br/>(Set)<br/>手机/苹果/旗舰/5G"]
        RANKING["sales:ranking<br/>(ZSet)<br/>iPhone15:9510"]
        HISTORY["history:1001<br/>(List)<br/>最近浏览10条"]
        SESSION["session:token_abc123<br/>(String, TTL)<br/>user:1001"]
        LOCK["lock:order:2001<br/>(String, NX)<br/>uuid-xxxx"]
        UV["uv:20240201<br/>(HyperLogLog)"]
    end

    USER --> CART
    USER --> HISTORY
    USER --> SESSION
    CART --> STOCK_i
    CART --> STOCK_m
    STOCK_i --> RANKING
    TAGS_i --> RANKING
    LOCK --> STOCK_i

    style USER fill:#DC382D,color:#fff
    style RANKING fill:#FF9800,color:#fff
    style SESSION fill:#4CAF50,color:#fff
    style LOCK fill:#9C27B0,color:#fff
```

## 小结

| 主题 | 核心要点 |
|------|---------|
| **redis-cli** | 官方命令行客户端，支持交互/非交互/管道模式 |
| **String** | 最基础类型，支持数值操作，三大编码（int/embstr/raw） |
| **Hash** | 对象存储，部分读写，字段不支持独立过期 |
| **List** | 有序列表，两端操作，适合队列和栈 |
| **Set** | 无序集合，支持交并差运算，元素不重复 |
| **ZSet** | 有序集合，分数排序，排行榜利器 |
| **KEY 管理** | 过期时间、SCAN 遍历、命名规范 |
| **数据库** | 默认 16 个，SELECT 切换，生产环境不推荐多数据库 |
| **RESP 协议** | Redis 通信协议，5 种数据类型，简单高效 |
| **客户端工具** | RedisInsight（官方）、Another Redis Desktop Manager（轻量） |

## 参考资料

- [Redis 官方文档 - Commands](https://redis.io/commands/)
- [Redis 官方文档 - RESP Protocol](https://redis.io/docs/latest/develop/reference/protocol-spec/)
- 《Redis 设计与实现》第 2 部分 — 黄健宏
- 《Redis 深度历险》第 1~3 章 — 钱文品
- 《Redis 开发与运维》第 3 章 — 付磊、张益军
- [RedisInsight 官方文档](https://redis.io/docs/latest/develop/tools/insight/)

## 面试技巧

::: tip 高频面试问题
1. **Redis 有哪些数据类型？分别适合什么场景？**
   - 回答要点：5 种基础类型——String（缓存/计数器）、Hash（对象/用户信息）、List（队列/时间线）、Set（标签/去重/交集）、ZSet（排行榜/延迟队列）。3 种扩展类型——Stream（消息队列）、Bitmap（位运算）、HyperLogLog（基数统计）。

2. **KEYS 和 SCAN 有什么区别？**
   - 回答要点：KEYS 阻塞遍历所有 Key（O(N)），生产环境禁用。SCAN 增量遍历，不阻塞服务，但可能返回重复元素需要去重。SCAN 返回游标，游标为 0 表示遍历结束。

3. **String 的三种编码什么时候切换？**
   - 回答要点：int → 整数值直接存储；embstr → 字符串 ≤ 44 字节，一次分配；raw → 字符串 > 44 字节，两次分配。int/embstr 在修改后会转为 raw。

4. **Redis 为什么用单线程还这么快？**
   - 回答要点：内存操作本身就是纳秒级，瓶颈不在 CPU。单线程避免了锁竞争、上下文切换、死锁等开销。I/O 多路复用（epoll）处理高并发连接。6.0 多线程仅用于网络 I/O，命令执行仍单线程。

5. **RESP 协议有什么特点？**
   - 回答要点：简单易读、二进制安全、长度前缀高效解析、支持嵌套。客户端发送命令用数组格式，服务端根据结果类型返回不同前缀（+/-/:/$/*）。

6. **Hash 和 String JSON 存对象怎么选？**
   - 回答要点：需要部分读写用 Hash（省带宽/省内存）；结构复杂/嵌套/需要整体读写用 String JSON；字段需独立过期只能用 String。大部分用户信息场景推荐 Hash。
:::
