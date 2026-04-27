---
title: 02 · Pipelines：零拷贝内存模型
icon: fa6-solid:pipe-section
order: 2
category:
  - ASP.NET Core
tag:
  - 底层原理
  - System.IO.Pipelines
  - 零拷贝
  - MemoryPool
  - PipeReader
  - PipeWriter
---

# 02 · Pipelines：零拷贝内存模型

> **本模块回答：** 为什么 Kestrel 能处理那么多并发请求却保持低 GC 压力？`System.IO.Pipelines` 是如何做到既不复制字节、又不阻塞线程的？

---

## 一、传统 IO 与 Pipelines 的对比

### 1.1 传统 `byte[]` 方式（存在哪些问题）

```mermaid
graph TB
    subgraph TRAD[传统 NetworkStream 读取]
        S1["Socket.ReceiveAsync(byte[] buffer, ...)"]
        S2["new byte[4096]<br/>每次请求都分配新数组"]
        S3["处理部分：buffer[0..parsedLen]"]
        S4["剩余数据：buffer[parsedLen..receivedLen]<br/>需要手动 Array.Copy 到新请求的 buffer 头部"]
        S5["用完丢弃<br/>GC 回收，Gen0/Gen1 压力"]
        S1 --> S2 --> S3 --> S4 --> S5
    end

    subgraph PROB[三大问题]
        P1["问题1：每次都 new byte[]<br/>高 RPS 下 GC 频繁触发"]
        P2["问题2：处理分包/粘包<br/>要手动 Array.Copy 剩余数据<br/>额外一次内存复制"]
        P3["问题3：消费者要等 Producer 完成<br/>才能开始解析（两者耦合）"]
    end

    S5 --> P1
    S4 --> P2
    S1 --> P3

    style TRAD fill:#5e1a1a,color:#fff
    style PROB fill:#3d1010,color:#fff
```

### 1.2 Pipelines 方式（如何解决）

```mermaid
graph LR
    %% Writer 端
    subgraph WRITER[Writer 端｜Socket 读取线程]
        W1["PipeWriter.GetMemory(sizeHint)<br/>内存池租借内存块｜Memory&lt;byte&gt;"]
        W2["socket.ReceiveAsync(memory)<br/>数据直写租借内存｜无数组分配"]
        W3["PipeWriter.Advance(n)<br/>标记实际写入字节数"]
        W4["PipeWriter.FlushAsync()<br/>唤醒 Reader 可读"]
    end

    %% 内存段链表
    subgraph SEGMENT[内部 Segment 链表]
        SEG1["Segment 1<br/>✅ 已消费回收"]
        SEG2["Segment 2<br/>📥 正在写入/待消费"]
        SEG3["Segment 3<br/>📄 预留缓冲段"]
    end

    %% Reader 端
    subgraph READER[Reader 端｜HTTP 解析线程]
        R1["await PipeReader.ReadAsync()<br/>阻塞等待上游数据"]
        R2["ReadResult.Buffer<br/>ReadOnlySequence&lt;byte&gt;<br/>跨段连续视图"]
        R3["流式解析报文<br/>零拷贝直接操作内存"]
        R4["PipeReader.AdvanceTo()<br/>标记已消费/已检查位置"]
    end

    %% 内部循环
    W1 --> W2 --> W3 --> W4 --> W1
    SEG1 --> SEG2 --> SEG3
    R1 --> R2 --> R3 --> R4 --> R1

    %% 跨模块虚线关联
    W4 -.|事件唤醒|.-> R1
    W2 -.|内存写入|.-> SEG2
    SEG2 -.|多段拼接|.-> R2

    %% 配色美化
    style WRITER fill:#1a4731,color:#fff,rounded:false
    style SEGMENT fill:#3d2b00,color:#fff,rounded:false
    style READER fill:#1e3a5f,color:#fff,rounded:false
```

---

## 二、`PipeWriter.GetMemory()` — 零分配内存借用

```mermaid
sequenceDiagram
    participant WT as Socket 线程
    participant PW as PipeWriter
    participant POOL as MemoryPool
    participant SEG as 当前Segment

    WT->>PW: GetMemory(sizeHint:1024)
    PW->>SEG: 检查空闲空间

    alt 有空间
        SEG-->>PW: 返回剩余内存
        PW-->>WT: 返回内存片段
    else 空间不足
        PW->>POOL: Rent 4096
        POOL-->>PW: 返回内存块
        PW->>PW: 链入新Segment
        PW-->>WT: 返回新内存
    end

    WT->>WT: socket.ReceiveAsync
    WT->>PW: Advance 已接收字节
    PW->>PW: 更新写指针
```

**`sizeHint` 的含义**：这是**建议**大小，Pipe 不保证一定给你这么多。实际分配取决于当前 Segment 的剩余空间。

---

## 三、`AdvanceTo` 精解 — 最容易理解错的 API

`AdvanceTo(consumed, examined)` 有两个参数，很多人只知道第一个。

```mermaid
graph LR
    subgraph Buffer 内容示意
        B1["[已解析的 Header]\nconsumed 指针在这"]
        B2["[部分 Body]\n已看过但未确认消费"]
        B3["[还没收到的数据]\nexamined 指针在 B3 之前"]
        B1 --> B2 --> B3
    end

    subgraph consumed 的作用
        C1["consumed 之前的字节\n可以释放回内存池\n下次 ReadAsync 不会再包含它们"]
    end

    subgraph examined 的作用
        E1["examined 之前的字节\n已被检查过了\n若 buffer.End == examined\n且没有新数据到达\nReadAsync 会 真正挂起等待\n而不是立即返回"]
        E2["examined < buffer.End\n说明还有未检查数据\nReadAsync 立即返回\n让你继续检查"]
    end
```

**四种实际场景的正确写法**：

```csharp
var result = await reader.ReadAsync();
var buffer = result.Buffer;

// ────────────────────────────────────────────────────────────────────
// 场景1：成功解析完整 HTTP 请求
// ────────────────────────────────────────────────────────────────────
if (TryParseRequest(buffer, out var request, out var consumed))
{
    // consumed 是请求结束的位置
    reader.AdvanceTo(
        consumed: consumed,  // 已消费：请求字节释放回池
        examined: consumed   // 已检查：和 consumed 一样
    );
    // 下次 ReadAsync 从 consumed 之后开始（可能是下一个请求的起始）
}

// ────────────────────────────────────────────────────────────────────
// 场景2：数据不够，Headers 还没结束
// ────────────────────────────────────────────────────────────────────
else
{
    reader.AdvanceTo(
        consumed: buffer.Start,  // 一个字节都不消费！保留所有数据
        examined: buffer.End     // 但已经看过所有字节了
    );
    // ⚠️ 这一行至关重要：
    // 若 examined < buffer.End，Pipe 以为还有未检查的字节
    // ReadAsync 会立即返回（即使没有新数据）→ CPU 100% 空转！
    // 设置 examined = buffer.End 告知 Pipe："新数据来了再叫我"
}

// ────────────────────────────────────────────────────────────────────
// 场景3：有粘包——一次性收到两个完整请求
// ────────────────────────────────────────────────────────────────────
while (TryParseRequest(buffer, out var req, out var end))
{
    ProcessRequest(req);
    buffer = buffer.Slice(end); // 切掉已处理的部分
}
// 处理完第二个请求后，buffer 可能仍有第三个请求的起始字节
reader.AdvanceTo(
    consumed: buffer.Start, // 只消费了两个完整请求
    examined: buffer.End    // 剩余字节已看过（不够一个完整请求）
);

// ────────────────────────────────────────────────────────────────────
// 场景4：遇到超大 Header（必须拒绝，防止内存耗尽）
// ────────────────────────────────────────────────────────────────────
if (buffer.Length > MaxHeaderBytes)
{
    reader.AdvanceTo(
        consumed: buffer.End, // 丢弃所有数据
        examined: buffer.End
    );
    // 返回 431 状态码，关闭连接
    throw new HeadersTooLargeException();
}
```

---

## 四、`ReadOnlySequence<byte>` — 跨 Segment 的连续视图

这是 Pipelines 的数据载体，和 `byte[]` 的最大区别是它可以"跨越"多个不连续的内存块。

```mermaid
graph LR
    subgraph 物理内存布局
        SA["Segment A\n内存地址: 0x1000\n[H T T P / 1 . 1]"]
        SB["Segment B\n内存地址: 0x5000\n[ G E T  / a p i]"]
        SC["Segment C\n内存地址: 0x9000\n[ / u s e r s\\r\\n]"]
    end

    subgraph ReadOnlySequence&lt;byte&gt; 逻辑视图
        SEQ["逻辑连续视图\n'HTTP/1.1 GET /api/users\\r\\n'\n实际是三段不连续内存的链表\n没有任何内存复制！"]
    end

    SA & SB & SC --> SEQ

    style 物理内存布局 fill:#3d2b00,color:#fff
    style ReadOnlySequence 逻辑视图 fill:#1a4731,color:#fff
```

**在 Sequence 上安全操作的技巧**：

```csharp
// 在 ReadOnlySequence 上查找 \r\n，不 ToArray()，不复制
private static bool TryFindCRLF(
    ReadOnlySequence<byte> buffer,
    out SequencePosition position)
{
    // SequenceReader 是操作 ReadOnlySequence 的高级游标
    var reader = new SequenceReader<byte>(buffer);
    
    // TryReadTo 在不复制的情况下找到分隔符
    if (reader.TryReadTo(out ReadOnlySpan<byte> line, "\r\n"u8))
    {
        position = reader.Position;
        return true;
    }
    
    position = default;
    return false;
}

// 处理跨 Segment 的数据时，若必须要 ToString()
// 只在确实需要时才转换，且只转换那一小段
if (header.Length <= 256) // 短 header 用栈分配
{
    Span<byte> stackBuf = stackalloc byte[header.Length];
    header.CopyTo(stackBuf);
    return Encoding.ASCII.GetString(stackBuf);
}
else
{
    // 超过栈大小才 heap 分配
    return Encoding.ASCII.GetString(header.ToArray());
}
```

---

## 五、`PinnedBlockMemoryPool` — 固定内存池

```mermaid
graph TB
    subgraph PinnedBlockMemoryPool 进程级单例
        QUEUE["ConcurrentQueue&lt;MemoryPoolBlock&gt;\n可复用的内存块队列"]
        
        subgraph Rent
            R1["TryDequeue() → 有则直接返回"]
            R2["没有则 new MemoryPoolBlock()\n分配新块\n并 GCHandle.Alloc(Pinned)\n固定在内存中不被 GC 移动"]
        end
        
        subgraph Return
            RT1["Enqueue(block)\n归还队列\n等待下次复用"]
        end
    end

    subgraph MemoryPoolBlock 4096 字节
        MEM["byte[4096]\n固定 Pinned 地址\nSocket DMA 可直接写入\n不需要额外 Pin/Unpin"]
        GCH["GCHandle\n防止 GC 移动此对象\n生命周期 = 整个进程"]
    end

    QUEUE --> R1 & R2
    R2 --> MEM & GCH

    style PinnedBlockMemoryPool fill:#1e3a5f,color:#fff
    style MemoryPoolBlock fill:#1a4731,color:#fff
```

**为什么要 Pin（固定内存）？**

```csharp
// 通常情况下，GC 可以随时移动托管对象到内存中的其他位置
// 这会导致一个问题：
// 
// 你把 buffer 地址告诉 OS（传给 SocketAsyncEventArgs）
// GC 突然把 buffer 移走了
// OS 的 DMA 把数据写到了旧地址 → 内存损坏！
//
// GCHandle.Alloc(array, GCHandleType.Pinned) 告诉 GC：
// "这块内存不要动，地址永久固定"
//
// 代价：这块内存永远不会被 GC 整理（不影响 GC 频率，但增加碎片）
// Kestrel 统一管理固定内存块，避免到处 Pin/Unpin 的性能损耗

internal sealed class MemoryPoolBlock : IMemoryOwner<byte>
{
    private readonly PinnedBlockMemoryPool _pool;
    private readonly GCHandle _gcHandle; // 永久固定

    public MemoryPoolBlock(PinnedBlockMemoryPool pool, int length)
    {
        var array = new byte[length];
        _gcHandle = GCHandle.Alloc(array, GCHandleType.Pinned); // ← Pin
        Memory = MemoryMarshal.CreateFromPinnedArray(array, 0, array.Length);
        _pool = pool;
    }

    public Memory<byte> Memory { get; }

    public void Dispose()
    {
        // 不释放内存！归还给对象池等待复用
        _pool.Return(this);
    }
}
```

---

## 六、背压（Backpressure）机制详解

背压是 Pipelines 最重要的流控机制，防止快生产者把内存撑爆。

```mermaid
stateDiagram-v2
    [*] --> Normal: 初始状态

    Normal --> Paused: OutputPipe 缓冲区\n超过 PauseWriterThreshold（默认64KB）
    note right of Paused
        FlushAsync() 返回未完成 ValueTask
        ApplicationTask 被挂起
        不再生产数据
        线程释放给线程池
    end note

    Paused --> Normal: SenderTask 消费数据
    note right of Normal
        缓冲区降至 ResumeWriterThreshold（默认32KB）
        FlushAsync() ValueTask 完成
        ApplicationTask 被唤醒继续生产
    end note

    Normal --> [*]: 连接关闭 Complete()
```

**配置背压阈值**：

```csharp
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxResponseBufferSize = 64 * 1024; // 64KB
    // 内部对应 OutputPipe 的 PauseWriterThreshold

    options.Limits.MaxRequestBufferSize = 1 * 1024 * 1024; // 1MB
    // 读请求体时，若 1MB 未被消费，暂停从 Socket 读取
    // 对应发送 TCP Window Update=0，通知客户端暂停发送
});
```

---

## 七、Pipe 与 Channel 的对比

```mermaid
graph LR
    subgraph System.IO.Pipelines.Pipe
        PI["专为 IO 场景设计\n内置内存池集成\n内置背压\n内置 AdvanceTo 精确控制消费\n支持 ReadOnlySequence 跨 Segment"]
    end

    subgraph System.Threading.Channels.Channel&lt;T&gt;
        CH["通用 生产者-消费者 场景\n传递的是强类型对象 T\n不内置内存管理\n简单易用\n适合消息队列模式"]
    end

    PI -->|"IO 字节流"| USE1["HTTP 解析\nWebSocket 帧\nTLS 记录层"]
    CH -->|"对象消息"| USE2["请求任务分发\nSignalR Hub 消息\n背景任务队列"]
```

---

## 八、完整数据流追踪

以一个 `GET /api/users HTTP/1.1\r\nHost: example.com\r\n\r\n` 请求为例：

```mermaid
sequenceDiagram
    participant OS as OS 内核
    participant RT as ReceiverTask
    participant IP as InputPipe
    participant AT as ApplicationTask<br/>(Http1Connection)

    Note over OS,AT: ── 字节进入进程 ──
    OS->>RT: epoll 通知 fd 可读
    RT->>IP: writer = InputPipe.Writer
    RT->>IP: mem = writer.GetMemory(4096)
    RT->>OS: socket.ReceiveAsync(mem)
    OS-->>RT: 写入 72 字节到 mem，返回 72
    RT->>IP: writer.Advance(72)
    RT->>IP: await writer.FlushAsync()

    Note over OS,AT: ── 解析器消费字节 ──
    IP-->>AT: ReadAsync() 返回 buffer(72字节)
    AT->>AT: TryParseRequest(buffer)

    Note right of AT: "GET /api/users HTTP/1.1\r\n"\n= 请求行 25 字节

    AT->>AT: Method = "GET"（零分配）
    AT->>AT: Path   = "/api/users"（零分配）
    AT->>AT: Version = 1.1

    Note right of AT: "Host: example.com\r\n"\n= Header 20 字节

    AT->>AT: Headers["Host"] = "example.com"
    
    Note right of AT: "\r\n" = Headers 结束

    AT->>IP: AdvanceTo(consumed=72, examined=72)
    Note right of IP: 72字节全部消费\n内存归还池\n准备迎接下一个请求

    AT->>AT: 请求解析完成\n调用 IHttpApplication.CreateContext()
```

---

## 九、本模块总结

| 知识点 | 核心结论 |
|--------|---------|
| `GetMemory()` | 从内存池借内存，不 `new byte[]`，零 GC 压力 |
| `Advance()` | 告知写入量，更新写指针，不移动数据 |
| `ReadAsync()` | 无数据时真正挂起（不自旋），有数据立即唤醒 |
| `AdvanceTo(consumed, examined)` | consumed：可释放的范围；examined：已检查的范围，控制下次唤醒时机 |
| `ReadOnlySequence<byte>` | 逻辑连续的跨 Segment 视图，物理不连续，零额外拷贝 |
| `PinnedBlockMemoryPool` | 固定内存块生命周期 = 进程，DMA 安全，OS 可直接写入 |
| 背压 | 消费慢时自动挂起生产者，防止内存无限增长 |

> **下一章**：字节进入 `InputPipe` 后，`Http1Connection` 如何用零分配状态机把这些字节解析成 Method、Path、Headers？→ [03 · HTTP 协议解析：状态机](03_HTTP协议解析状态机.md)
