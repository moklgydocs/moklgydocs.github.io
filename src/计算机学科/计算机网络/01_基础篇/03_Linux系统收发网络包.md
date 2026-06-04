---
title: "Linux 系统是如何收发网络包的？"
icon: fa6-brands:linux
order: 3
category:
  - 计算机学科
  - 计算机网络
tag:
  - Linux
  - 网络协议栈
---

# Linux 系统是如何收发网络包的？

> 前面我们讲了 TCP/IP 分层模型和一次网页请求的全流程，但数据包在 Linux 内核里到底是怎么走的？
> 这一节钻进内核，看看网络协议栈的真面目。

## 一、Linux 网络协议栈全景

Linux 内核的网络子系统是一个**分层处理**的架构，从上到下贯穿了整个 TCP/IP 模型：

```mermaid
graph TB
    subgraph "用户空间"
        APP["应用程序<br/>socket()/send()/recv()"]
    end

    subgraph "内核空间 — 网络协议栈"
        SOCKET["套接字层<br/>Socket API 系统调用接口"]
        TCP["传输层<br/>TCP / UDP 协议处理"]
        IP["网络层<br/>IP / ICMP / 路由查找"]
        DRV["网络接口层<br/>netfilter / 流量控制 / 驱动"]
    end

    subgraph "硬件"
        NIC["网卡<br/>收发数据帧"]
    end

    APP -->|"系统调用"| SOCKET
    SOCKET --> TCP
    TCP --> IP
    IP --> DRV
    DRV --> NIC

    NIC -->|"硬中断"| DRV
    DRV --> IP
    IP --> TCP
    TCP --> SOCKET
    SOCKET -->|"数据拷贝"| APP

    style APP fill:#4CAF50,stroke:#333,color:#fff
    style SOCKET fill:#2196F3,stroke:#333,color:#fff
    style TCP fill:#FF9800,stroke:#333,color:#333
    style IP fill:#9C27B0,stroke:#333,color:#fff
    style DRV fill:#f26d6d,stroke:#333,color:#fff
    style NIC fill:#333,stroke:#333,color:#fff
```

---

## 二、发送网络包的流程

当应用程序调用 `send()` 发送数据时，整个内核处理流程如下：

```mermaid
graph TB
    A["1️⃣ 应用调用 send()"] --> B["2️⃣ 套接字层<br/>将数据从用户态拷贝到内核态<br/>放入 Socket 发送缓冲区"]
    B --> C["3️⃣ 传输层<br/>加 TCP 头、计算校验和<br/>执行流量控制/拥塞控制"]
    C --> D["4️⃣ 网络层<br/>加 IP 头、路由查找<br/>执行 netfilter 钩子"]
    D --> E["5️⃣ 网络接口层<br/>加 MAC 头<br/>通过 qdisc 排队"]
    E --> F["6️⃣ 网卡驱动<br/>将 skb 映射到 DMA 缓冲区"]
    F --> G["7️⃣ 网卡硬件<br/>将帧转为电信号发送"]

    style A fill:#4CAF50,stroke:#333,color:#fff
    style B fill:#2196F3,stroke:#333,color:#fff
    style C fill:#FF9800,stroke:#333,color:#333
    style D fill:#9C27B0,stroke:#333,color:#fff
    style E fill:#f26d6d,stroke:#333,color:#fff
    style F fill:#333,stroke:#333,color:#fff
    style G fill:#333,stroke:#333,color:#fff
```

### 关键数据结构：sk_buff

Linux 内核用 **`sk_buff`**（简称 skb）作为网络数据包的统一表示，贯穿整个协议栈：

```c
// 简化的 sk_buff 结构
struct sk_buff {
    struct net_device *dev;      // 关联的网络设备
    unsigned int len;            // 数据总长度
    __u16 protocol;              // 上层协议类型
    unsigned char *head;         // 缓冲区起始
    unsigned char *data;         // 数据起始
    unsigned char *tail;         // 数据结束
    unsigned char *end;          // 缓冲区结束

    // TCP/UDP 头部指针
    union {
        struct tcphdr *th;
        struct udphdr *uh;
    };
    // IP 头部指针
    struct iphdr *ipih;
};
```

**精髓**：skb 不是每次复制数据，而是通过移动 `data` 指针来"添加/剥离"头部，这就是所谓的**零拷贝**设计。

```mermaid
graph LR
    subgraph "发送时：data 指针前移，腾出空间加头部"
        S1["MAC 头<br/>已加"] --> S2["IP 头<br/>已加"] --> S3["TCP 头<br/>已加"] --> S4["应用数据"]
    end

    subgraph "接收时：data 指针后移，逐层剥掉头部"
        R1["MAC 头<br/>已剥"] --> R2["IP 头<br/>已剥"] --> R3["TCP 头<br/>已剥"] --> R4["应用数据"]
    end
```

---

## 三、接收网络包的流程

网卡收到一个数据帧后，内核的处理更加复杂，涉及中断、软中断、多队列等机制：

```mermaid
graph TB
    A["1️⃣ 网卡收到帧<br/>DMA 写入内存"] --> B["2️⃣ 网卡发起硬中断<br/>通知 CPU"]
    B --> C["3️⃣ 硬中断处理程序<br/>NAPI 轮询机制<br/>只做最轻的工作"]
    C --> D["4️⃣ 触发软中断 NET_RX_SOFTIRQ<br/>延迟处理网络包"]
    D --> E["5️⃣ netif_receive_skb()<br/>进入协议栈"]
    E --> F["6️⃣ 网络接口层<br/>解析 MAC 头<br/>确定上层协议"]
    F --> G["7️⃣ 网络层<br/>解析 IP 头<br/>路由查找"]
    G --> H["8️⃣ 传输层<br/>解析 TCP/UDP 头<br/>找到对应 Socket"]
    H --> I["9️⃣ 数据放入 Socket 接收缓冲区"]
    I --> J["🔟 应用调用 recv()<br/>数据从内核态拷贝到用户态"]

    style A fill:#333,stroke:#333,color:#fff
    style B fill:#f26d6d,stroke:#333,color:#fff
    style C fill:#FF9800,stroke:#333,color:#333
    style D fill:#9C27B0,stroke:#333,color:#fff
    style E fill:#2196F3,stroke:#333,color:#fff
    style J fill:#4CAF50,stroke:#333,color:#fff
```

### 3.1 NAPI 机制——中断与轮询的混合

传统的纯中断模式：每个包一次中断 → 高流量时 CPU 被中断淹没。

**NAPI（New API）** 的做法：

1. 第一个包到来时触发**硬中断**
2. 硬中断处理程序**关闭中断**，启动**轮询**
3. 轮询不断从网卡取包，直到队列为空
4. 队列空了 → 重新开启中断，等待下一个包

```mermaid
graph LR
    A["包到达"] --> B["硬中断触发"]
    B --> C["关闭中断"]
    C --> D["轮询取包"]
    D -->|"还有包"| D
    D -->|"队列为空"| E["重新开启中断"]

    style A fill:#f26d6d,stroke:#333,color:#fff
    style B fill:#FF9800,stroke:#333,color:#333
    style D fill:#2196F3,stroke:#333,color:#fff
    style E fill:#4CAF50,stroke:#333,color:#fff
```

### 3.2 多队列网卡（RSS）

现代网卡支持多个接收队列，每个队列绑定不同的 CPU 核心，避免单核瓶颈：

```mermaid
graph TB
    NIC["网卡"] --> Q1["队列 0 → CPU 0"]
    NIC --> Q2["队列 1 → CPU 1"]
    NIC --> Q3["队列 2 → CPU 2"]
    NIC --> Q4["队列 3 → CPU 3"]

    style NIC fill:#333,stroke:#333,color:#fff
    style Q1 fill:#2196F3,stroke:#333,color:#fff
    style Q2 fill:#4CAF50,stroke:#333,color:#fff
    style Q3 fill:#FF9800,stroke:#333,color:#333
    style Q4 fill:#9C27B0,stroke:#333,color:#fff
```

队列分配依据：对源/目的 IP、端口的哈希值取模。

---

## 四、网络性能优化全景

Linux 提供了大量参数来调优网络性能：

### 4.1 Socket 缓冲区调优

```bash
# 查看当前 TCP 缓冲区大小（最小/默认/最大，单位字节）
cat /proc/sys/net/ipv4/tcp_rmem
# 输出示例：4096  87380  6291456

cat /proc/sys/net/ipv4/tcp_wmem
# 输出示例：4096  16384  4194304

# 调整最大接收缓冲区到 16MB
echo "4096 87380 16777216" > /proc/sys/net/ipv4/tcp_rmem
```

### 4.2 中断亲和性

```bash
# 查看网卡中断分配
cat /proc/interrupts | grep eth

# 设置中断亲和性（绑定到 CPU 0）
echo 1 > /proc/irq/32/smp_affinity
```

### 4.3 常用优化参数

| 参数 | 作用 | 推荐值 |
|------|------|--------|
| `net.core.somaxconn` | listen 全连接队列最大长度 | `65535` |
| `net.ipv4.tcp_max_syn_backlog` | SYN 半连接队列最大长度 | `65535` |
| `net.ipv4.tcp_tw_reuse` | 允许复用 TIME_WAIT 连接 | `1` |
| `net.ipv4.ip_local_port_range` | 临时端口范围 | `1024 65535` |
| `net.ipv4.tcp_fin_timeout` | FIN_WAIT_2 超时时间（秒） | `15` |

---

## 五、零拷贝技术

传统数据发送需要 **4 次拷贝 + 4 次上下文切换**：

```mermaid
graph LR
    A["磁盘"] -->|"DMA 拷贝"| B["内核缓冲区"]
    B -->|"CPU 拷贝"| C["Socket 缓冲区"]
    C -->|"CPU 拷贝"| D["网卡"]
    E["用户缓冲区"] -.->|"CPU 拷贝"| C
```

零拷贝技术（如 `sendfile`、`mmap`、`splice`）能减少甚至消除 CPU 参与的拷贝：

```c
// sendfile 零拷贝 — 直接从文件到网卡
// 传统：read() + send() = 4次拷贝
// sendfile：只需 2 次拷贝（DMA → 内核 → 网卡）
ssize_t sendfile(int out_fd, int in_fd, off_t *offset, size_t count);
```

```mermaid
graph LR
    A["磁盘"] -->|"DMA 拷贝"| B["内核页缓存"]
    B -->|"DMA 拷贝<br/>（带 SG-DMA）"| C["网卡"]
    style A fill:#4CAF50,stroke:#333,color:#fff
    style B fill:#2196F3,stroke:#333,color:#fff
    style C fill:#333,stroke:#333,color:#fff
```

---

## 六、总结

| 阶段 | 发送路径 | 接收路径 |
|------|---------|---------|
| 用户态 | `send()` 系统调用 | `recv()` 系统调用 |
| 套接字层 | 数据拷贝到内核缓冲区 | 数据拷贝到用户缓冲区 |
| 传输层 | 加 TCP 头、流控、拥控 | 解析 TCP 头、找到 Socket |
| 网络层 | 加 IP 头、路由查找 | 解析 IP 头、转发或上传 |
| 网络接口层 | 加 MAC 头、排队 | 解析 MAC 头、上传 |
| 硬件 | DMA → 网卡发送 | 网卡接收 → 硬中断 → 软中断 |

::: tip 面试速查
- **Q：为什么接收路径用软中断？**
  A：硬中断优先级高、执行快，不能长时间占用 CPU。软中断在合适的时机批量处理，避免中断风暴。

- **Q：sk_buff 为什么不用每次复制数据？**
  A：通过移动 data/tail 指针来"加头/剥头"，避免内存拷贝，提升性能。

- **Q：NAPI 解决了什么问题？**
  A：高流量时减少中断次数，用轮询替代连续中断，降低 CPU 开销。

- **Q：零拷贝有哪些实现方式？**
  A：`sendfile()`（文件→网络）、`mmap()`（文件映射到用户空间）、`splice()`（管道零拷贝）。
:::

---

::: info 原著参考
- 小林coding《图解网络》—— [Linux 系统是如何收发网络包的？](https://xiaolincoding.com/network/1_base/linux_send_receive.html)
:::
