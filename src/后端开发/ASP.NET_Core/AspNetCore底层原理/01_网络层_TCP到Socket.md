---
title: 01 · 网络层：TCP 到 Socket
icon: fa6-solid:network-wired
order: 1
category:
  - ASP.NET Core
tag:
  - 底层原理
  - TCP
  - Socket
  - Kestrel
  - IOCP
  - epoll
---

# 01 · 网络层：TCP 到 Socket

> **本模块回答：** 一个 HTTP 请求在到达 Kestrel 进程之前，经历了什么？Kestrel 是如何用极少的线程处理成千上万个并发连接的？

---

## 一、从网卡到进程：物理路径

```mermaid
flowchart TD
    subgraph A[物理层与驱动]
        NIC["网卡 NIC<br/>以太网帧到达"]
        DMA["DMA 传输<br/>网卡直接写入内核内存<br/>不经过 CPU"]
        IRQ["硬件中断 IRQ<br/>通知 CPU 有数据了"]
    end

    subgraph B[OS 内核 TCP/IP 协议栈]
        ETH["以太网层<br/>校验 MAC 地址<br/>解包得到 IP 包"]
        IP["IP 层<br/>校验目标 IP<br/>处理分片重组"]
        TCP["TCP 层<br/>校验序号/校验和<br/>滑动窗口流量控制"]
        SKB["Socket 接收缓冲区<br/>sk_buff 链表<br/>SO_RCVBUF（默认~128KB）"]
    end

    subgraph C[Kestrel 进程 用户空间]
        EA["事件通知<br/>IOCP Windows<br/>epoll Linux<br/>kqueue macOS"]
        RA["Socket.ReceiveAsync()<br/>系统调用 recv()<br/>数据从内核复制到用户空间"]
        PW["PipeWriter<br/>写入 Pipelines<br/>进入 Kestrel 处理流程"]
    end

    NIC --> DMA --> IRQ --> ETH
    ETH --> IP --> TCP --> SKB
    SKB -->|内核通知用户空间| EA
    EA --> RA --> PW

    style A fill:#2d4a6b,color:#fff
    style B fill:#1a4731,color:#fff
    style C fill:#4a1942,color:#fff
```

> **那一次不可避免的内存复制**：从内核接收缓冲区（`sk_buff`）到用户空间（Kestrel 进程的 `MemoryPool`），这是整个请求生命周期中**唯一必须发生**的内存复制。Kestrel 的全部零拷贝优化都建立在"接受这一次复制"的基础上，此后的 HTTP 解析、路由、序列化等过程再也不额外复制。

---

## 二、TCP 三次握手——连接建立细节

```mermaid
sequenceDiagram
    participant C as 客户端<br/>浏览器 / curl
    participant OS_C as 客户端内核
    participant OS_S as 服务端内核
    participant KT as Kestrel 进程

    Note over C,KT: ── 第一次握手 ──
    C->>OS_C: connect("1.2.3.4:5000")
    OS_C->>OS_S: SYN（seq=x）
    Note right of OS_S: 分配 TCB（TCP Control Block）<br/>连接进入 SYN_RECEIVED 状态<br/>放入半连接队列（SYN Queue，长度 = tcp_max_syn_backlog）

    Note over C,KT: ── 第二次握手 ──
    OS_S-->>OS_C: SYN-ACK（seq=y, ack=x+1）
    Note left of OS_C: 连接进入 ESTABLISHED（客户端侧）

    Note over C,KT: ── 第三次握手 ──
    OS_C->>OS_S: ACK（ack=y+1）
    Note right of OS_S: 连接从半连接队列移入 Accept 队列<br/>（全连接队列，长度 = listen backlog）<br/>连接状态 ESTABLISHED（服务端侧）

    Note over C,KT: ── Kestrel 取走连接 ──
    KT->>OS_S: Socket.AcceptAsync()（注册 IOCP/epoll 回调）
    OS_S-->>KT: 回调触发，返回已连接 Socket
    Note right of KT: 连接交给 Kestrel 处理<br/>内核 Accept 队列清空一个槽位
```

**两个队列的关系（常见生产故障点）**：

```
SYN 队列（半连接队列）          Accept 队列（全连接队列）
┌────────────────────┐          ┌────────────────────┐
│ SYN_RECEIVED 连接  │──ACK──→ │ ESTABLISHED 连接   │
│                    │          │                    │
│ 上限: tcp_max_syn_backlog     │ 上限: min(backlog, somaxconn) │
│ 默认: 2048         │          │ 默认: 128          │
└────────────────────┘          └────────────────────┘
```

**Kestrel 的 backlog 配置**：

```csharp
// Program.cs
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000, listenOptions =>
    {
        // 这个 backlog 参数传递给 Socket.Listen(backlog)
        // 控制 Accept 队列长度
        // 高并发场景（如 10K RPS）应设为 1024+
        listenOptions.Backlog = 512; // 默认值
    });
});

// 对应 Linux 内核参数优化（运维层面）
// sysctl -w net.core.somaxconn=65535
// sysctl -w net.ipv4.tcp_max_syn_backlog=65535
```

---

## 三、IOCP / epoll——如何用少量线程处理海量连接

这是 Kestrel 高并发的根本原因，必须深刻理解。

### 3.1 传统阻塞模型（为什么不能用）

```mermaid
graph TB
    subgraph 传统阻塞模型 一连接一线程
        T1["线程1\n阻塞在 Read()"] 
        T2["线程2\n阻塞在 Read()"]
        T3["线程3\n阻塞在 Read()"]
        TN["线程N...\n大多数时间睡觉"]
        
        C1["连接1"] --> T1
        C2["连接2"] --> T2
        C3["连接3"] --> T3
        CN["连接N"] --> TN
    end

    subgraph 问题
        P1["1万连接 = 1万线程"]
        P2["每个线程默认栈 1MB\n→ 10GB 内存只用来存线程栈"]
        P3["线程切换 Context Switch\nCPU 时间浪费在调度上"]
    end

    style 传统阻塞模型 fill:#5e1a1a,color:#fff
    style 问题 fill:#3d1010,color:#fff
```

### 3.2 epoll 事件驱动模型（Linux）

```mermaid
sequenceDiagram
    participant K as Kestrel 工作线程（少量）
    participant EP as epoll fd<br/>（内核事件通知）
    participant OS as OS 内核
    participant C1 as 连接1（等待数据）
    participant C2 as 连接2（数据到了）
    participant C3 as 连接3（等待数据）

    K->>EP: epoll_create() 创建事件表
    K->>EP: epoll_ctl(ADD, fd1, EPOLLIN) 注册连接1
    K->>EP: epoll_ctl(ADD, fd2, EPOLLIN) 注册连接2
    K->>EP: epoll_ctl(ADD, fd3, EPOLLIN) 注册连接3
    
    K->>EP: epoll_wait()（单线程监听所有连接）
    Note right of K: 这里挂起，不占 CPU

    OS->>C2: 数据包到达
    OS-->>EP: 标记 fd2 可读
    EP-->>K: 返回就绪列表 [fd2]（只有这一个！）

    K->>OS: recv(fd2, buffer) 读取数据
    K->>K: 处理连接2的请求
    
    K->>EP: epoll_wait() 继续等待
    Note right of K: 连接1和3仍在注册\n下次有数据再通知
```

**关键差异**：`epoll` 永远只返回**就绪**的连接，而不是轮询所有连接。1 万个连接同时注册，有数据的只有 50 个，`epoll_wait` 就返回这 50 个。

### 3.3 IOCP 模型（Windows）

```mermaid
sequenceDiagram
    participant K as Kestrel 线程池
    participant IOCP as IOCP 完成端口<br/>（内核队列）
    participant OS as OS 内核

    K->>IOCP: CreateIoCompletionPort()
    K->>OS: ReceiveAsync(buffer, overlapped)
    Note right of K: 立即返回，不等待数据<br/>当前线程可以做其他事

    OS->>OS: 数据到达，DMA 写入 buffer
    OS->>IOCP: 投递完成通知（携带 bytes_transferred）
    
    IOCP-->>K: GetQueuedCompletionStatus()\n线程池线程取走通知
    K->>K: 处理读完的数据
    K->>OS: 再次投递下一次 ReceiveAsync
```

### 3.4 Kestrel 的 IO 线程模型

```mermaid
graph TB
    subgraph TP[ThreadPool 工作线程 少量全局共享]
        direction LR
        W1["工作线程 1"]
        W2["工作线程 2"]
        W3["工作线程 3"]
        WN["...（CPU核心数×2）"]
    end

    subgraph AC[Accept 循环 每端口一个]
        AL["ConnectionDispatcher<br/>单独 Task<br/>调用 AcceptAsync()"]
    end

    subgraph CON[连接处理 每连接一个 Task]
        P1["Http1Connection Task A<br/>处理连接1的所有请求"]
        P2["Http1Connection Task B<br/>处理连接2的所有请求"]
        PN["Http1Connection Task N"]
    end

    subgraph WT[等待期间 线程归还]
        WAIT["await PipeReader.ReadAsync()<br/>挂起 Task，释放线程<br/>线程去处理其他 Task"]
    end

    AC --> P1 & P2 & PN
    P1 & P2 & PN --> WT
    WT --> TP

    style TP fill:#1e3a5f,color:#fff
    style AC fill:#1a4731,color:#fff
    style CON fill:#4a1942,color:#fff
    style WT fill:#3d2b00,color:#fff
```

**核心理解**：10000 个并发连接，不是 10000 个线程，而是 10000 个 **Task（协程）**。大多数 Task 都在 `await` 挂起状态，它们不占用线程。只有真正有数据需要处理的 Task 才占用线程池的线程。

---

## 四、Kestrel 的 Accept 循环源码解析

```mermaid
flowchart TD
    START["KestrelServer.StartAsync()"] 
    BIND["Socket.Bind(endpoint)<br/>Socket.Listen(backlog)"]
    CD["ConnectionDispatcher<br/>StartAcceptingConnections()"]
    
    subgraph ACC[Accept 循环 死循环]
        AW["await _listener.AcceptAsync()<br/>等待下一个 TCP 连接"]
        TP["ThreadPool.UnsafeQueueUserWorkItem()<br/>把连接处理任务扔进线程池<br/>不阻塞 Accept 循环！"]
        BACK["立即回到 await<br/>继续接受下一个连接"]
    end

    subgraph CONN[连接处理 线程池中异步]
        PC["ProcessConnectionAsync()"]
        KC["new SocketConnection(socket)"]
        PT["创建 Transport Pipe<br/>InputPipe + OutputPipe"]
        RD["ReaderTask: 从 Socket 读 → 写 InputPipe"]
        WR["WriterTask: 从 OutputPipe 读 → 写 Socket"]
        AP["ApplicationTask: Http1Connection.ExecuteAsync()"]
    end

    START --> BIND --> CD --> AW
    AW --> TP --> BACK
    BACK --> AW

    TP --> PC --> KC --> PT
    PT --> RD
    PT --> WR
    PT --> AP

    style ACC fill:#1a4731,color:#fff
    style CONN fill:#4a1942,color:#fff
```

**关键源码（简化版）**：

```csharp
// src/Servers/Kestrel/Transport.Sockets/src/SocketConnectionListener.cs

// Accept 循环：每个端口只有这一个循环
internal async ValueTask<ConnectionContext?> AcceptAsync(CancellationToken ct = default)
{
    while (true)
    {
        try
        {
            // 阻塞等待单个连接（底层 epoll_wait/IOCP）
            // 在等待期间不占用线程（async/await 挂起）
            var acceptSocket = await _listenSocket.AcceptAsync(ct);
            
            // 为新连接配置 Socket 参数
            acceptSocket.NoDelay = true; // 关闭 Nagle 算法，减少延迟
            
            // 创建连接包装对象（不在此处理请求，立即返回继续 Accept）
            var connection = new SocketConnection(
                acceptSocket,
                _memoryPool,      // 共享内存池（进程级单例）
                _scheduler,       // IO 调度器
                _logger,
                _socketSenderPool // SocketSender 对象池
            );
            
            return connection; // 返回给 ConnectionDispatcher 去处理
        }
        catch (ObjectDisposedException)
        {
            return null; // 监听 Socket 关闭，退出循环
        }
    }
}
```

```csharp
// src/Servers/Kestrel/Core/src/Internal/ConnectionDispatcher.cs

private async Task StartAcceptingConnectionsAsync<T>(
    IConnectionListener<T> listener,
    Func<T, Task> connectionHandler)
{
    while (true)
    {
        var connection = await listener.AcceptAsync();
        if (connection == null) break;
        
        // ⭐ 关键：不 await！直接把连接处理任务扔线程池
        // Accept 循环立刻继续，不等待这个连接处理完
        // 这就是"高并发"的根本：Accept 和 Process 完全解耦
        _ = Task.Run(() => connectionHandler(connection));
    }
}
```

---

## 五、Socket 参数详解（影响性能）

```csharp
// src/Servers/Kestrel/Transport.Sockets/src/SocketConnectionListener.cs
private Socket CreateBoundListenSocket(EndPoint endpoint)
{
    var socket = new Socket(endpoint.AddressFamily, SocketType.Stream, ProtocolType.Tcp);
    
    // ── 关闭 Nagle 算法 ─────────────────────────────────────────────────
    // Nagle 算法会攒够 MSS（最大报文段，约 1460 字节）才发出
    // 对于 HTTP API，每条响应需要立即发出，不能等待攒包
    // NoDelay = true 让每次 WriteAsync 后立即发出报文
    socket.NoDelay = true;
    
    // ── 端口复用 ─────────────────────────────────────────────────────────
    // 允许多个进程绑定同一端口（k8s 多副本场景）
    // 也允许 TIME_WAIT 状态的端口立即复用（避免服务重启后等待 2MSL）
    socket.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
    
    // ── Linux 特有：SO_REUSEPORT ──────────────────────────────────────────
    // 多个进程绑定同一端口，内核负载均衡地分发新连接
    // 这比在用户空间做 Reverse Proxy 效率更高
    if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
    {
        socket.SetSocketOption(
            SocketOptionLevel.Socket,
            SocketOptionName.ReuseUnicastPort, // = SO_REUSEPORT
            true
        );
    }
    
    socket.Bind(endpoint);
    socket.Listen(backlog: 512);
    return socket;
}
```

---

## 六、SocketConnection：三个并行 Task

每个 TCP 连接建立后，Kestrel 会为它创建三个并行运行的 Task，这三个 Task 通过 `Pipe` 协作：

```mermaid
graph LR
    subgraph TASK[SocketConnection 的三个 Task]
        direction TB
        T1["ReceiverTask<br/>从 Socket 读字节<br/>写入 InputPipe.Writer"]
        T2["SenderTask<br/>从 OutputPipe.Reader 读<br/>写入 Socket"]
        T3["ApplicationTask<br/>Http1Connection.ExecuteAsync()<br/>消费 InputPipe.Reader<br/>写 OutputPipe.Writer"]
    end

    subgraph PIPE[Pipe 桥接]
        IP["InputPipe<br/>Writer←ReceiverTask<br/>Reader→ApplicationTask"]
        OP["OutputPipe<br/>Writer←ApplicationTask<br/>Reader→SenderTask"]
    end

    T1 -->|写| IP
    IP -->|读| T3
    T3 -->|写| OP
    OP -->|读| T2

    style TASK fill:#1e3a5f,color:#fff
    style PIPE fill:#1a4731,color:#fff
```

**为什么要分三个 Task？**

- **ReceiverTask 和 SenderTask** 专注 IO 操作，调度在 IOCP/epoll 友好的 IO 调度器上。
- **ApplicationTask** 运行在普通线程池，执行 HTTP 解析、路由、业务代码，可能被 `await` 挂起让出线程。
- 三者通过 `Pipe` 解耦，互不阻塞。当网络慢时，`OutputPipe` 会产生背压（backpressure），自动暂停 ApplicationTask 写入，避免内存堆积。

---

## 七、背压机制（Backpressure）

```mermaid
sequenceDiagram
    participant AT as ApplicationTask<br/>业务逻辑
    participant OP as OutputPipe
    participant ST as SenderTask<br/>发送到 Socket
    participant CLI as 客户端（网速慢）

    AT->>OP: WriteAsync(2MB 响应数据)
    OP->>OP: 缓冲区满（超过 PauseWriterThreshold）
    OP-->>AT: FlushAsync() 返回未完成的 ValueTask
    Note over AT: AT 被挂起！不再继续写
    Note over AT: 线程被释放，去处理其他连接

    loop 慢速发送
        ST->>OP: 从 OutputPipe 读数据
        ST->>CLI: send()（等待 ACK）
        CLI-->>ST: TCP ACK（很慢）
    end

    OP->>OP: 缓冲区降至 ResumeWriterThreshold 以下
    OP-->>AT: FlushAsync() 完成，唤醒 AT
    AT->>OP: 继续写剩余数据
```

**配置背压阈值**：

```csharp
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxResponseBufferSize = 64 * 1024; // 64KB 响应缓冲上限
    // 超过此值，FlushAsync() 会 backpressure
    // 防止慢客户端导致服务端缓存大量数据占用内存
});
```

---

## 八、本模块总结

| 知识点 | 核心结论 |
|--------|---------|
| 网卡 → 内核 | DMA 直写内核缓冲区，一次硬件中断通知 CPU |
| 三次握手 | 内核完成，Kestrel 只管 AcceptAsync() 从 Accept 队列取连接 |
| epoll/IOCP | 单线程监听万级连接，只有就绪连接才触发回调，彻底消除线程阻塞 |
| Accept 循环 | 接受连接和处理连接完全异步解耦，Accept 循环永不阻塞 |
| 三个 Task | ReceiverTask + ApplicationTask + SenderTask，Pipe 协作，背压自动流控 |
| Socket 配置 | NoDelay 消除 Nagle 延迟，ReusePort 支持内核级负载均衡 |

> **下一章**：连接建立后，字节流开始进入 `InputPipe`。`System.IO.Pipelines` 如何用零分配的方式管理这些字节？→ [02 · Pipelines：零拷贝内存模型](02_Pipelines零拷贝内存模型.md)
