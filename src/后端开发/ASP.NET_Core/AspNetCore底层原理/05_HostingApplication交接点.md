---
title: 05 · HostingApplication：交接点
icon: fa6-solid:right-left
order: 5
category:
  - ASP.NET Core
tag:
  - 底层原理
  - HostingApplication
  - HttpContext
  - 对象池
  - 生命周期
---

# 05 · HostingApplication：交接点

> **本模块回答：** `HostingApplication` 是整个框架最关键的一个类——它是 Kestrel 和 ASP.NET Core 握手的地方。`DefaultHttpContext` 是怎么从对象池里出来的？一个请求结束后，这个对象怎么被"清洗干净"归还？

---

## 一、`HostingApplication` 在整体架构中的位置

```mermaid
graph LR
    subgraph KESTREL[Kestrel 的世界 只认 IHttpApplication]
        KC["Http1Connection<br/>= IFeatureCollection"]
        APP["IHttpApplication<TContext><br/>CreateContext<br/>ProcessRequestAsync<br/>DisposeContext"]
    end

    subgraph BRIDGE[HostingApplication 交接桥梁]
        HA["HostingApplication<br/>实现 IHttpApplication"]
        CTX["HostingApplication.Context<br/>包含 HttpContext<br/>包含 Trace/LoggerScope"]
    end

    subgraph ASPNET[ASP.NET Core 的世界 只认 HttpContext]
        RD["RequestDelegate<br/>中间件委托链"]
        MW["所有中间件<br/>Routing / Auth / MVC"]
    end

    KC --> APP
    APP --> HA
    HA --> RD
    RD --> MW

    style KESTREL fill:#1a4731,color:#fff
    style BRIDGE fill:#7b2d00,color:#fff,stroke:#ff6b00,stroke-width:2px
    style ASPNET fill:#1e3a5f,color:#fff
```

---

## 二、`IHttpApplication<TContext>` 接口精读

```csharp
// src/Http/Http.Abstractions/src/IHttpApplication.cs
// 这个接口是 Kestrel 和上层框架的"唯一合同"
// Kestrel 只通过这3个方法与上层交互，不知道 HttpContext 是什么

public interface IHttpApplication<TContext> where TContext : notnull
{
    // ① 请求解析完毕，创建应用上下文
    // features 就是 Http1Connection（同时实现 IFeatureCollection）
    TContext CreateContext(IFeatureCollection contextFeatures);

    // ② 应用处理请求（进入中间件管道）
    Task ProcessRequestAsync(TContext context);

    // ③ 请求结束（成功或异常），清理资源
    void DisposeContext(TContext context, Exception? exception);
}
```

---

## 三、完整生命周期时序（最详细版本）

```mermaid
sequenceDiagram
    participant K as Http1Connection
    participant HA as HostingApplication
    participant CTXP as Context对象池
    participant HCFP as HttpContext池
    participant HC as DefaultHttpContext
    participant OTel as OpenTelemetry
    participant LOG as 日志Scope
    participant RD as RequestDelegate

    Note over K,RD: ========= 请求开始 =========

    K->>HA: CreateContext(IFeatureCollection)
    HA->>CTXP: Get()
    CTXP-->>HA: 返回Context外壳

    HA->>HCFP: 创建HttpContext
    HCFP->>HCFP: 从池获取实例
    HCFP->>HC: Initialize(features)
    HCFP-->>HA: 返回DefaultHttpContext

    HA->>OTel: 启动Activity追踪
    HA->>LOG: 创建请求日志Scope
    HA-->>K: 返回完整Context

    Note over K,RD: ========= 请求处理 =========

    K->>HA: ProcessRequestAsync
    HA->>RD: 执行中间件链
    RD-->>HA: 处理完成

    Note over K,RD: ========= 请求结束 =========

    K->>HA: DisposeContext

    alt 响应未完成
        HA->>HC: 确保Response完成发送
    end

    HA->>HA: 记录请求日志
    HA->>OTel: 停止并上报Trace
    HA->>HC: 重置清空所有字段

    HCFP->>HCFP: 归还HttpContext到池
    HA->>CTXP: 归还Context外壳到池
```

---

## 四、`DefaultHttpContext` 对象池机制

```mermaid
graph TB
    subgraph 对象池 进程级 无界
        POOL["DefaultObjectPool&lt;DefaultHttpContext&gt;\n内部：_fastItem + ConcurrentQueue&lt;&gt;\n_fastItem 是无锁快速路径（Interlocked.Exchange）"]
        FAST["_fastItem\n最近归还的那一个\n无锁 CAS 操作，极快"]
        QUEUE["ConcurrentQueue\n存放更多备用对象"]
    end

    subgraph 取出流程 Create
        G1["_fastItem != null ?\nInterlocked.Exchange(ref _fastItem, null)\n成功: 返回（无锁！）"]
        G2["_queue.TryDequeue(out item) ?\n成功: 返回"]
        G3["new DefaultHttpContext()\n池空了才真正 new"]
    end

    subgraph 归还流程 Return
        R1["ctx.Uninitialize() 清空状态"]
        R2["_fastItem == null ?\nInterlocked.CompareExchange(\n  ref _fastItem, item, null)\n成功: 存入快速路径"]
        R3["_queue.Enqueue(item)\n放入队列"]
    end

    POOL --> FAST & QUEUE
    G1 --> G2 --> G3
    R1 --> R2 --> R3

    style 对象池 fill:#1e3a5f,color:#fff
    style 取出流程 fill:#1a4731,color:#fff
    style 归还流程 fill:#4a1942,color:#fff
```

**`Uninitialize()` 必须清理的所有字段**：

```csharp
// src/Http/Http/src/DefaultHttpContext.cs
internal void Uninitialize()
{
    // 解除 Feature 绑定（最重要！防止持有对 Http1Connection 的引用）
    _features.Initalize(EmptyFeatures.Instance);

    // 清空请求级数据
    _items = null;

    // 清空 DI 相关（防止 Scoped 服务泄漏）
    _serviceProviderSet = false;
    _requestServices = null;

    // 清空安全相关（防止用户身份泄漏到下一个请求！）
    User = null;

    // 清空追踪 ID
    TraceIdentifier = default;

    // 清空 WebSocket 状态
    _websockets = null;

    // 注意：_request 和 _response 字段不清零
    // 因为它们是值类型（结构体引用），下次 Initialize 时会重新绑定
    // 这是性能优化：避免 null 检查
}
```

---

## 五、OpenTelemetry Activity 集成

```mermaid
sequenceDiagram
    participant HA as HostingApplication
    participant ACT as Activity<br/>（DiagnosticSource）
    participant EXT as 外部分布式系统<br/>（Zipkin/Jaeger/OTLP）

    HA->>ACT: ActivitySource.StartActivity(\n  "Microsoft.AspNetCore.Hosting.HttpRequestIn",\n  ActivityKind.Server)

    alt 请求携带 W3C traceparent Header
        Note over ACT: traceparent: 00-{traceId}-{spanId}-01
        ACT->>ACT: 解析 traceId/spanId\n作为 Parent 连接上游 Trace
    else 请求无追踪 Header（新 Trace 起点）
        ACT->>ACT: 生成新 TraceId + SpanId
    end

    HA->>ACT: activity.SetTag("http.request.method", "GET")
    HA->>ACT: activity.SetTag("url.path", "/api/users")
    HA->>ACT: activity.SetTag("server.address", "example.com")

    Note over HA: 业务代码执行期间\nActivity.Current 可访问当前 Span\n中间件可以给 Span 添加自定义 Tag

    HA->>ACT: activity.SetTag("http.response.status_code", 200)
    HA->>ACT: activity.Stop()
    ACT->>EXT: 上报 Span 数据（Exporter）
```

---

## 六、日志作用域（Log Scope）

```mermaid
graph TB
    subgraph SCOPE[每个请求 自动创建日志 Scope]
        direction TB
        SC["ILogger.BeginScope()<br/>RequestId + RequestPath"]
        LOG1["LogInformation: Processing..."]
        LOG2["LogDebug: DB query"]
        LOG3["LogError: 未知错误"]
        TIP["Scope 内所有日志<br/>自动携带 RequestId / Path<br/>无需手动传参"]
        
        SC --> LOG1
        SC --> LOG2
        SC --> LOG3
    end

    subgraph JSON[结构化日志输出]
        OUT["JSON 格式日志<br/>时间、消息、级别<br/>RequestId、RequestPath"]
    end

    LOG1 --> JSON
    LOG2 --> JSON
    LOG3 --> JSON

    style SCOPE fill:#1a4731,color:#fff
    style JSON fill:#1e3a5f,color:#fff
```

---

## 七、`HostingApplication.Context` 结构

```csharp
// src/Hosting/Hosting/src/Internal/HostingApplication.cs

internal sealed class HostingApplication : IHttpApplication<HostingApplication.Context>
{
    private readonly RequestDelegate _application;
    private readonly IHttpContextFactory? _httpContextFactory;
    private readonly DefaultHttpContextFactory? _defaultHttpContextFactory;
    private readonly HostingApplicationDiagnostics _diagnostics;

    // 请求上下文包装（注意是 class，放对象池）
    internal sealed class Context
    {
        public HttpContext? HttpContext { get; set; }
        public IDisposable? Scope { get; set; }       // 日志 Scope
        public Activity? Activity { get; set; }       // OpenTelemetry Activity
        public long StartTimestamp { get; set; }      // 用于计算请求耗时
        public bool HasDiagnosticListener { get; set; }
        public bool EventLogEnabled { get; set; }
    }

    public Context CreateContext(IFeatureCollection contextFeatures)
    {
        // 对象池取外壳
        Context? hostContext;
        if (_contextPool is DefaultObjectPool<Context> pool)
            hostContext = pool.Get();
        else
            hostContext = new Context();

        // 对象池取 HttpContext（或 new 一个）
        HttpContext httpContext;
        if (_defaultHttpContextFactory is not null)
        {
            var defaultHttpContext = _defaultHttpContextFactory.CreateContext(contextFeatures);
            httpContext = defaultHttpContext;
        }
        else
        {
            // 用户自定义了 IHttpContextFactory
            httpContext = _httpContextFactory!.Create(contextFeatures);
        }

        // 诊断：记录请求开始（触发 DiagnosticSource 事件、创建 Activity）
        _diagnostics.BeginRequest(httpContext, hostContext);

        hostContext.HttpContext = httpContext;
        return hostContext;
    }

    public Task ProcessRequestAsync(Context context)
    {
        return _application(context.HttpContext!); // 进入中间件链
    }

    public void DisposeContext(Context context, Exception? exception)
    {
        var httpContext = context.HttpContext!;

        // 诊断：记录请求结束（停止 Activity、记录日志、触发 DiagnosticSource）
        _diagnostics.RequestEnd(httpContext, exception, context);

        // 归还 HttpContext
        if (_defaultHttpContextFactory is not null)
            _defaultHttpContextFactory.Dispose((DefaultHttpContext)httpContext);
        else
            _httpContextFactory!.Dispose(httpContext);

        // 重置 Context 外壳字段
        context.HttpContext = null;
        context.Scope = null;
        context.Activity = null;
        context.StartTimestamp = 0;

        // 归还 Context 外壳
        _contextPool?.Return(context);
    }
}
```

---

## 八、同步 vs 异步异常的处理差异

```mermaid
flowchart TD
    PA["ProcessRequestAsync(context)"]
    
    subgraph 同步异常 Action 内部 throw
        EX1["throw new InvalidOperationException()"]
        CAT1["中间件 try-catch 捕获\n或到达 ExceptionHandlerMiddleware\n返回 500 Response"]
    end

    subgraph 异步异常 await 后抛出
        EX2["await task 抛出异常"]
        CAT2["Task.Exception 包装\nProcessRequestAsync 的 awaiter 重新抛出\n同样被 ExceptionHandlerMiddleware 捕获"]
    end

    subgraph DisposeContext exception 参数
        EX3["ProcessRequestAsync 返回 Faulted Task"]
        DC["DisposeContext(context, exception)"]
        LOG["记录 Error 日志\n附带异常详情和 Stack Trace"]
        STOP["activity.SetStatus(ActivityStatusCode.Error)\n在 Trace 中标记失败"]
    end

    PA --> EX1 & EX2
    EX1 --> CAT1
    EX2 --> CAT2
    CAT1 & CAT2 -->|"未处理异常 bubble up"| EX3
    EX3 --> DC --> LOG & STOP
```

---

## 九、本模块总结

| 知识点 | 核心结论 |
|--------|---------|
| `IHttpApplication<TContext>` | Kestrel 与上层框架的唯一接口合同，3 个方法，完整隔离 |
| `CreateContext()` | 从两个对象池（Context + DefaultHttpContext）取空壳，Initialize 绑定 Feature |
| `ProcessRequestAsync()` | 直接调用中间件委托链，就是 `_application(httpContext)` |
| `DisposeContext()` | Uninitialize 清洗，归还两层对象池，停止 Activity，结束日志 Scope |
| 对象池快速路径 | `_fastItem` 用 CAS 无锁操作，99% 的请求走此路径，性能极高 |
| OpenTelemetry 集成 | 自动创建 Span，传播 W3C traceparent，支持分布式追踪 |
| 安全清洗 | `HttpContext.User = null` 是必须的！防止前一请求的身份信息泄漏到下一请求 |

> **下一章**：`DefaultHttpContext` 已准备就绪，进入 `RequestDelegate`（中间件链）。`IApplicationBuilder.Build()` 如何把分散注册的中间件折叠成一条委托链？→ [06 · 中间件管道：洋葱圈](06_中间件管道洋葱圈.md)
