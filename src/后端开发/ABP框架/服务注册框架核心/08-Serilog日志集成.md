---
title: Serilog 日志集成
order: 9
category:
  - ABP框架
tag:
  - MokFramework
  - Serilog
  - 日志
---

# 08 - Serilog 日志集成

本章讲解 `MokFramework.Serilog` 项目——最简单的一个集成包，但体现了框架的可扩展设计。

## 为什么集成 Serilog？

ASP.NET Core 自带的日志系统（`Microsoft.Extensions.Logging`）已经很好用，
但 Serilog 提供了更强大的功能：

| 特性 | MS Logging | Serilog |
|------|-----------|---------|
| 结构化日志 | 基础支持 | 完整支持 |
| 日志目标 (Sinks) | Console, Debug, EventLog | 100+ Sinks |
| 日志充实 (Enrichment) | 有限 | 强大 |
| 请求日志中间件 | 需手动实现 | `UseSerilogRequestLogging()` |
| 配置文件支持 | 有限 | `ReadFrom.Configuration()` |
| 日志过滤 | 基础 | 灵活的 Filter 表达式 |
| 全局静态 Logger | ❌ | `Log.Logger` |

## 设计思路

Serilog 已经提供了 `Serilog.AspNetCore` 包，其中包含：

```csharp
// Serilog 原生扩展方法
builder.Host.UseSerilog((context, config) =>
{
    config.ReadFrom.Configuration(context.Configuration);
});
```

MokFramework 的 Serilog 集成只需要做一个**薄包装**：

1. 保留 Serilog 原生的全部灵活性
2. 提供 MokFramework 风格的命名约定
3. 处理"有配置回调"和"无配置回调"两种场景

## 实现

### 扩展方法

```csharp
// 文件：MokFramework.Serilog/SerilogHostBuilderExtensions.cs
// 命名空间：Microsoft.Extensions.Hosting

public static class MokFrameworkSerilogHostBuilderExtensions
{
    public static IHostBuilder UseMokSerilog(
        this IHostBuilder hostBuilder,
        Action<HostBuilderContext, LoggerConfiguration>? configureLogger = null,
        bool preserveStaticLogger = false,
        bool writeToProviders = false)
    {
        if (configureLogger != null)
        {
            // 有配置回调：委托给 Serilog 的 4 参数重载
            return SerilogHostBuilderExtensions.UseSerilog(
                hostBuilder, configureLogger, preserveStaticLogger, writeToProviders);
        }

        // 无配置回调：使用已配置好的 Log.Logger 静态实例
        return SerilogHostBuilderExtensions.UseSerilog(
            hostBuilder, dispose: true);
    }
}
```

**方法名为什么叫 `UseMokSerilog` 而不是 `UseSerilog`？**

因为 Serilog.AspNetCore 已经在 `Microsoft.Extensions.Hosting` 命名空间中
定义了 `UseSerilog` 扩展方法。如果我们也叫 `UseSerilog`，编译器会报歧义错误。

加上 `Mok` 前缀既避免了冲突，又表明这是框架的集成包装。

### 两种使用方式

#### 方式 1：回调配置（推荐）

```csharp
builder.Host.UseMokSerilog((context, config) =>
{
    config
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .WriteTo.Console(
            outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}");
});
```

这种方式可以访问 `HostBuilderContext`，从而读取 `IConfiguration`。

**内部调用**：`SerilogHostBuilderExtensions.UseSerilog(hostBuilder, configureLogger, false, false)`

该重载做了什么：
1. 创建 `LoggerConfiguration`
2. 调用用户的配置回调
3. 从配置创建 `ILogger`
4. 设置为 `Log.Logger`（全局静态 Logger）
5. 注册 `SerilogLoggerFactory` 替换 MS 的 `ILoggerFactory`

#### 方式 2：静态 Logger

```csharp
// 在 Host 构建之前配置好 Log.Logger
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseMokSerilog();  // 无参数
```

**内部调用**：`SerilogHostBuilderExtensions.UseSerilog(hostBuilder, dispose: true)`

该重载做了什么：
1. 使用已配置的 `Log.Logger` 静态实例
2. `dispose: true` 表示 Host 释放时自动调用 `Log.CloseAndFlush()`

### 标记模块

```csharp
// 文件：MokFramework.Serilog/MokFrameworkSerilogModule.cs

public class MokFrameworkSerilogModule : MokFrameworkModule
{
    // 空实现
}
```

**为什么模块是空的？**

Serilog 的配置通过 `builder.Host.UseMokSerilog()` 在 Host 层面完成，
不需要在模块的 `ConfigureServices` 中做任何事情。

模块存在的意义是：
1. 让其他模块可以声明 `[DependsOn(typeof(MokFrameworkSerilogModule))]`
2. 未来可以在这里添加：
   - 自动从 `IConfiguration` 读取 Serilog 配置
   - 注册结构化日志的 Enricher
   - 注册审计日志服务

## NuGet 依赖

```xml
<!-- MokFramework.Serilog.csproj -->
<ItemGroup>
  <PackageReference Include="Serilog.AspNetCore" Version="9.*" />
</ItemGroup>
```

只需一个包：`Serilog.AspNetCore` 包含了 Serilog 核心、Console Sink、
ASP.NET Core 集成（`UseSerilog`、`UseSerilogRequestLogging`）等所有必需品。

## 配合 appsettings.json 使用

```json
// appsettings.json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "Microsoft.Hosting.Lifetime": "Information",
        "System": "Warning"
      }
    },
    "WriteTo": [
      {
        "Name": "Console",
        "Args": {
          "outputTemplate": "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}"
        }
      },
      {
        "Name": "File",
        "Args": {
          "path": "logs/app-.log",
          "rollingInterval": "Day"
        }
      }
    ],
    "Enrich": ["FromLogContext", "WithMachineName", "WithThreadId"]
  }
}
```

```csharp
builder.Host.UseMokSerilog((context, config) =>
{
    config.ReadFrom.Configuration(context.Configuration);
});
```

## 完整示例

```csharp
var builder = WebApplication.CreateBuilder(args);

// 1. 加载 secrets 配置
builder.Host.AddAppSettingsSecretsJson();

// 2. 使用 Autofac 作为 DI 容器
builder.Host.UseAutofac();

// 3. 使用 Serilog 作为日志框架
builder.Host.UseMokSerilog((context, config) =>
{
    config.ReadFrom.Configuration(context.Configuration);
});

// 4. 注册 MokFramework 模块化应用
await builder.AddApplicationAsync<AppModule>();

var app = builder.Build();

// 5. Serilog 请求日志（可选）
app.UseSerilogRequestLogging();

// 6. 初始化模块
await app.InitializeApplicationAsync();

await app.RunAsync();
```

注意 `app.UseSerilogRequestLogging()` 是 Serilog 原生的中间件，
不是 MokFramework 的——我们不包装已经好用的东西。
