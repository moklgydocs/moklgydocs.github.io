---
title: 04 · IFeatureCollection：接口壁垒
icon: fa6-solid:layer-group
order: 4
category:
  - ASP.NET Core
tag:
  - 底层原理
  - IFeatureCollection
  - 接口设计
  - 解耦
---

# 04 · IFeatureCollection：接口壁垒

> **本模块回答：** Kestrel 解析完 HTTP 请求后，为什么不直接创建 `HttpContext`？这个奇特的"特性集合"设计解决了什么问题？它在性能上有何特别之处？

---

## 一、为什么需要这层抽象

```mermaid
graph TB
    subgraph PROB[问题：Kestrel 直接依赖 HttpContext]
        K1["Kestrel<br/>Microsoft.AspNetCore.Server.Kestrel"]
        HC["HttpContext<br/>Microsoft.AspNetCore.Http"]
        MVC["Microsoft.AspNetCore.Mvc<br/>整个 ASP.NET Core 框架"]
        TIP["问题：Kestrel 无法单独使用<br/>无法替换框架<br/>gRPC/SignalR 无法独立部署<br/>循环依赖风险"]
        
        K1 -->|"直接依赖"| HC
        HC -->|"进而需要"| MVC
        MVC --> TIP
    end

    subgraph SOLVE[解决方案：IFeatureCollection 解耦]
        K2["Kestrel"]
        IFC["IFeatureCollection<br/>仅接口定义，极小依赖"]
        HA["HostingApplication<br/>ASP.NET Core 层"]
        HC2["DefaultHttpContext<br/>业务代码使用"]
        
        K2 -->|"只填充"| IFC
        IFC -->|"传递"| HA
        HA -->|"包装成"| HC2
    end

    style PROB fill:#5e1a1a,color:#fff
    style SOLVE fill:#1a4731,color:#fff
```

---

## 二、关键特性接口一览

```mermaid
graph LR
    subgraph Kestrel 填充的 Features
        F1["IHttpRequestFeature\nMethod / Path / QueryString\nHeaders / Protocol / Body(Stream)"]
        F2["IHttpResponseFeature\nStatusCode / ReasonPhrase / Headers"]
        F3["IHttpResponseBodyFeature\nStream / PipeWriter\nSendFileAsync / StartAsync / CompleteAsync"]
        F4["IConnectionFeature\nLocalIpAddress / LocalPort\nRemoteIpAddress / RemotePort"]
        F5["ITlsConnectionFeature\nClientCertificate\nGetClientCertificateAsync()"]
        F6["IRequestBodyPipeFeature\nReader (PipeReader)\n≈ IHttpRequestFeature.Body 的 Pipe 版本"]
        F7["IHttpUpgradeFeature\nIsUpgradableRequest\nUpgradeAsync() → 返回原始 Stream\n（WebSocket 升级用）"]
        F8["IConnectionIdFeature\nConnectionId (string)\n每条 TCP 连接唯一 ID"]
    end

    subgraph ASP.NET Core 叠加的 Features
        A1["ISessionFeature\nISession Session"]
        A2["IAuthenticationFeature\nPrincipal / Properties"]
        A3["IEndpointFeature\nEndpoint (路由设置)"]
        A4["IRouteValuesFeature\nRouteValues 字典"]
        A5["IServiceProvidersFeature\nRequestServices (Scoped DI)"]
    end

    IFC["IFeatureCollection"]
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 --> IFC
    IFC -->A1 & A2 & A3 & A4 & A5
```

---

## 三、高性能实现——数组，而非字典

`IFeatureCollection` 看起来是个接口，但其底层实现是精心优化的数组，而不是常规的 `Dictionary<Type, object>`。

```mermaid
graph TB
    subgraph Http1Connection 同时实现多个 Feature 接口
        H1C["Http1Connection : IFeatureCollection\n                   IHttpRequestFeature\n                   IHttpResponseFeature\n                   IHttpResponseBodyFeature\n                   IRequestBodyPipeFeature\n                   IHttpUpgradeFeature\n                   IConnectionIdFeature\n                   ...（约15个接口）"]
        NOTE["关键：Http1Connection 自己就是这些接口的实现\n通过 this 引用返回，不 new 新对象！"]
    end

    subgraph 索引实现 编译器生成
        IMPL["object? IFeatureCollection.this[Type key]\n{\n    get {\n        // 40个已知 Feature 用 if-else 直接返回\n        if (key == typeof(IHttpRequestFeature))  return this;\n        if (key == typeof(IHttpResponseFeature)) return this;\n        ...\n        return ExtraFeatureGet(key); // 慢路径（不常见 Feature）\n    }\n}"]
    end

    style Http1Connection fill:#1e3a5f,color:#fff
    style 索引实现 fill:#1a4731,color:#fff
```

**性能对比**：

```csharp
// 方式1：Dictionary<Type, object>（普通字典）
// 时间复杂度：O(1) 均摊，但有哈希计算开销
var feature = (IHttpRequestFeature)dictionary[typeof(IHttpRequestFeature)];
// 代价：计算 Type 哈希值、查字典、装箱/拆箱

// 方式2：IFeatureCollection 的 if-else 链（Kestrel 实现）
var feature = (IHttpRequestFeature)features[typeof(IHttpRequestFeature)];
// 实际执行：if (key == typeof(IHttpRequestFeature)) return this;
// 代价：单次引用比较（Type 对象按引用比较，O(1)）
// 比 Dictionary 快约 3-5 倍（省去哈希+冲突处理）

// 方式3：强类型扩展方法（最快，推荐写法）
var feature = features.Get<IHttpRequestFeature>();
// 等同于：(IHttpRequestFeature?)features[typeof(IHttpRequestFeature)]
// 加了泛型缓存，一次性取出不需要重复转型
```

---

## 四、`DefaultHttpContext` 如何绑定到 Feature

```mermaid
sequenceDiagram
    participant HA as HostingApplication
    participant POOL as DefaultHttpContext 对象池
    participant CTX as DefaultHttpContext
    participant FEAT as IFeatureCollection

    HA->>POOL: Get() 从对象池获取
    POOL-->>HA: 返回空壳上下文
    
    HA->>CTX: Initialize(features)
    CTX->>CTX: 绑定 Feature 引用
    
    note right of CTX: FeatureReferences 结构体<br/>缓存各类 Feature 指针
    
    note over CTX: Request/Response 懒加载<br/>绑定到 Features
    
    HA->>HA: 执行业务代码
    note right of HA: Request.Method 直接读取<br/>IHttpRequestFeature 字段
```

**`DefaultHttpContext` 的懒加载绑定**：

```csharp
// src/Http/Http/src/DefaultHttpContext.cs 关键片段

public override HttpRequest Request
{
    get
    {
        // Request 对象不是每次都 new 的！
        // DefaultHttpContext 持有 DefaultHttpRequest 成员字段（不是属性）
        // DefaultHttpRequest 本身是一个极轻的包装，只持有对 features 的引用
        return _request; // 直接返回成员字段
    }
}

// DefaultHttpRequest 内部实现
public override string Method
{
    get => HttpRequestFeature.Method;      // 透传到 Feature
    set => HttpRequestFeature.Method = value;
}

// IHttpRequestFeature 来自 FeatureReferences 的缓存
private IHttpRequestFeature HttpRequestFeature =>
    _features.Fetch(ref _request, Features) // 启动后缓存，下次直接用
    ?? EmptyRequestFeature; // 极少情况：Feature 不存在时的Fallback
```

---

## 五、Feature 的动态添加（中间件的扩展点）

`IFeatureCollection` 是可扩展的，中间件可以在请求处理过程中动态添加新 Feature：

```mermaid
sequenceDiagram
    participant RTM as UseRouting() 路由中间件
    participant HC as HttpContext.Features
    participant EF as IEndpointFeature
    participant AZM as UseAuthorization() 授权中间件

    RTM->>RTM: DFA 匹配路由
    RTM->>EF: new EndpointFeature
    RTM->>HC: 存入 IEndpointFeature

    note over HC: IEndpointFeature 已存入<br/>后续中间件可读取
    AZM->>HC: 获取 IEndpointFeature
    HC-->>AZM: 返回匹配的 Endpoint
    AZM->>AZM: 检查 [Authorize] 元数据
```

**自定义 Feature 示例**：

```csharp
// 定义自定义 Feature 接口
public interface IRequestTimingFeature
{
    DateTime RequestStartedAt { get; }
    TimeSpan Elapsed { get; }
}

// 在中间件中注入此 Feature
public class RequestTimingMiddleware
{
    private readonly RequestDelegate _next;

    public async Task InvokeAsync(HttpContext context)
    {
        var feature = new RequestTimingFeature(DateTime.UtcNow);
        
        // 向 Features 集合动态添加新 Feature
        context.Features.Set<IRequestTimingFeature>(feature);
        
        await _next(context);
        
        // 后置处理
        var elapsed = feature.Elapsed;
        context.Response.Headers["X-Request-Duration"] = elapsed.TotalMilliseconds.ToString("F2");
    }
}

// 在 Controller 中使用（通过 HttpContext 获取）
public IActionResult GetSomething()
{
    var timing = HttpContext.Features.Get<IRequestTimingFeature>();
    _logger.LogInformation("Request processing took {Ms}ms", timing?.Elapsed.TotalMilliseconds);
    // ...
}
```

---

## 六、Feature 替换——运行时行为修改

`IFeatureCollection` 的另一个强大用途：替换现有 Feature 改变基础行为。

```csharp
// 场景：需要记录所有 HTTP 响应 Body 的内容（审计日志）
public class ResponseBodyLoggingMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        // 取出原始的响应 Body Feature
        var originalBodyFeature = context.Features.Get<IHttpResponseBodyFeature>()!;
        
        // 用包装器替换（Decorator 模式）
        var loggingFeature = new LoggingResponseBodyFeature(originalBodyFeature, _logger);
        context.Features.Set<IHttpResponseBodyFeature>(loggingFeature);
        
        await _next(context);
        
        // 恢复原始 Feature
        context.Features.Set<IHttpResponseBodyFeature>(originalBodyFeature);
    }
}

// 包装器：截取写入的每个字节
internal sealed class LoggingResponseBodyFeature : IHttpResponseBodyFeature
{
    private readonly IHttpResponseBodyFeature _inner;
    private readonly MemoryStream _buffer = new();

    public Stream Stream => new TeeStream(_inner.Stream, _buffer); // 流复制
    public PipeWriter Writer => PipeWriter.Create(Stream);

    // 其他接口方法委托给 _inner
    public Task CompleteAsync() => _inner.CompleteAsync();
    public void DisableBuffering() => _inner.DisableBuffering();
}
```

---

## 七、`HttpContext` vs `IFeatureCollection` 的关系

```mermaid
graph LR
    subgraph IFeatureCollection 底层
        direction TB
        RF["IHttpRequestFeature\n原始 Method/Path/Headers/Body"]
        RESF["IHttpResponseFeature\n原始 StatusCode/ReasonPhrase/Headers"]
        RESBF["IHttpResponseBodyFeature\n原始 Stream/PipeWriter"]
        CF["IConnectionFeature\n原始 IP/Port"]
    end

    subgraph DefaultHttpContext 高层包装
        REQ["HttpRequest\n▶ Method (string)\n▶ Path (PathString)\n▶ Query (IQueryCollection)\n▶ Headers (IHeaderDictionary)\n▶ Body (Stream)\n▶ BodyReader (PipeReader)"]
        RES["HttpResponse\n▶ StatusCode (int)\n▶ Headers (IHeaderDictionary)\n▶ Body (Stream)\n▶ BodyWriter (PipeWriter)\n▶ Cookies\n▶ ContentType"]
        CONN["Connection\n▶ RemoteIpAddress\n▶ LocalPort\n▶ Id"]
        USR["User (ClaimsPrincipal)\n▶ Identity\n▶ Claims\n▶ IsInRole()"]
        ITEMS["Items (IDictionary)\n请求内共享数据\n类似 ThreadLocal"]
    end

    RF --> REQ
    RESF & RESBF --> RES
    CF --> CONN
    REQ & RES & CONN & USR & ITEMS --> CTX["HttpContext\n业务代码的唯一入口"]
```

---

## 八、本模块总结

| 知识点 | 核心结论 |
|--------|---------|
| 为什么设计 IFeatureCollection | 解耦 Kestrel 和 ASP.NET Core，二者只共享微小的 Features 抽象包 |
| 高性能 if-else 索引 | 40 个常见 Feature 用 if-else 链直接返回，比 Dictionary 快 3-5 倍 |
| Http1Connection 自己就是 Feature | 不需要 new 新对象，通过 `return this` 实现多接口，零分配 |
| 动态添加 Feature | 中间件可在请求处理过程中向 Features 写入新数据，实现扩展 |
| Feature 替换 | 可以用 Decorator 替换现有 Feature 改变底层 IO 行为（如响应体记录） |
| DefaultHttpContext 懒加载 | Request/Response 属性通过 FeatureReferences 延迟绑定，首次访问后缓存 |

> **下一章**：Feature 集合准备好了，`HostingApplication` 如何用它孵化出 `DefaultHttpContext`，正式进入 ASP.NET Core 的领地？→ [05 · HostingApplication：交接点](05_HostingApplication交接点.md)
