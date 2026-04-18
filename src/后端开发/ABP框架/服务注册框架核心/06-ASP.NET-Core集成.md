---
title: ASP.NET Core 集成
order: 7
category:
  - ABP框架
tag:
  - MokFramework
  - ASP.NET Core
  - 集成
---

# 06 - ASP.NET Core 集成

本章讲解 `MokFramework.AspNetCore` 项目——如何让框架无缝融入 ASP.NET Core 的编程模型。

## 设计目标

让用户的 `Program.cs` 看起来像这样（对标 ABP）：

```csharp
var builder = WebApplication.CreateBuilder(args);

// 框架集成
builder.Host.AddAppSettingsSecretsJson()
    .UseAutofac()
    .UseMokSerilog();
await builder.AddApplicationAsync<MyWebModule>();

var app = builder.Build();
await app.InitializeApplicationAsync();
await app.RunAsync();
```

每一行扩展方法都在 `MokFramework.AspNetCore` 中提供。

## 项目配置

```xml
<!-- MokFramework.AspNetCore.csproj -->
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
  </PropertyGroup>

  <!-- 使用 FrameworkReference 而非 PackageReference -->
  <ItemGroup>
    <FrameworkReference Include="Microsoft.AspNetCore.App" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\MokFramework.Core\MokFramework.Core.csproj" />
  </ItemGroup>
</Project>
```

**为什么用 `FrameworkReference`？**

ASP.NET Core 的类型（`WebApplication`、`WebApplicationBuilder`、`IApplicationBuilder`）
都在 `Microsoft.AspNetCore.App` 共享框架中。使用 `FrameworkReference` 而非 `PackageReference` 可以：

1. 避免版本冲突——共享框架版本由运行时决定
2. 不会产生额外的 NuGet 依赖
3. 这是 ASP.NET Core 类库的推荐做法

## 扩展方法一：AddApplicationAsync

```csharp
// 文件：MokFramework.AspNetCore/WebApplicationBuilderExtensions.cs
// 命名空间：Microsoft.AspNetCore.Builder（免 using！）

public static class MokFrameworkWebApplicationBuilderExtensions
{
    public static async Task AddApplicationAsync<TStartupModule>(
        this WebApplicationBuilder builder,
        Action<MokFrameworkApplicationCreationOptions>? optionsAction = null)
        where TStartupModule : MokFrameworkModule
    {
        await builder.Services.AddApplicationAsync<TStartupModule>(optionsAction);
    }
}
```

**这只是一个薄包装**。实际工作委托给 Core 中的 `ServiceCollectionApplicationExtensions`：

```csharp
// 文件：MokFramework.Core/DependencyInjection/ServiceCollectionApplicationExtensions.cs
// 命名空间：Microsoft.Extensions.DependencyInjection

public static class ServiceCollectionApplicationExtensions
{
    public static async Task<IMokFrameworkApplication> AddApplicationAsync<TStartupModule>(
        this IServiceCollection services,
        Action<MokFrameworkApplicationCreationOptions>? optionsAction = null)
        where TStartupModule : MokFrameworkModule
    {
        return await MokFrameworkApplication.CreateForExternalAsync<TStartupModule>(
            services, optionsAction);
    }
}
```

**调用链：**

```
builder.AddApplicationAsync<MyModule>()
  → builder.Services.AddApplicationAsync<MyModule>()     [Core 中的扩展方法]
    → MokFrameworkApplication.CreateForExternalAsync()   [静态工厂，internal]
      → new ExternalServiceProvider(typeof(MyModule), services)
      → ConfigureModuleServicesAsync()                   [三阶段服务配置]
      → services.AddSingleton<IMokFrameworkApplicationWithExternalServiceProvider>(app)
```

**为什么要两层包装？**

1. `ServiceCollectionApplicationExtensions` 在 Core 中，不依赖 ASP.NET Core
   - 纯 DI 场景（如 Generic Host）也能用
2. `WebApplicationBuilderExtensions` 在 AspNetCore 中，提供更友好的 API
   - `builder.AddApplicationAsync` 比 `builder.Services.AddApplicationAsync` 更简洁

## 扩展方法二：InitializeApplicationAsync

```csharp
// 文件：MokFramework.AspNetCore/ApplicationBuilderExtensions.cs
// 命名空间：Microsoft.AspNetCore.Builder

public static class MokFrameworkApplicationBuilderExtensions
{
    public static async Task InitializeApplicationAsync(this WebApplication app)
    {
        // 1. 从 DI 解析框架应用实例
        var mokApp = app.Services
            .GetRequiredService<IMokFrameworkApplicationWithExternalServiceProvider>();

        // 2. 注册关闭钩子
        var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();
        lifetime.ApplicationStopping.Register(() =>
        {
            mokApp.ShutdownAsync().GetAwaiter().GetResult();
        });

        // 3. 传入外部 ServiceProvider，执行模块初始化
        await mokApp.InitializeAsync(app.Services);
    }
}
```

**详细步骤解析：**

### Step 1: 解析框架应用实例

在 `AddApplicationAsync` 阶段，框架已经将自己注册到了 DI 容器：
```csharp
services.AddSingleton<IMokFrameworkApplicationWithExternalServiceProvider>(app);
```

现在 `builder.Build()` 已经完成，DI 容器已构建，可以解析这个实例。

### Step 2: 注册关闭钩子

ASP.NET Core 的 `IHostApplicationLifetime` 提供了应用生命周期事件。
当应用收到停止信号（Ctrl+C、SIGTERM）时，`ApplicationStopping` 会触发。

我们在这里注册回调，确保模块的 `OnApplicationShutdown` 被调用。

**为什么用 `.GetAwaiter().GetResult()` 而不是 `await`？**

`CancellationToken.Register()` 的回调必须是同步的（`Action`，不是 `Func<Task>`）。
在关闭场景中，同步等待是可接受的，因为应用即将退出。

### Step 3: 传入外部 ServiceProvider

`mokApp.InitializeAsync(app.Services)` 做了两件事：
1. `SetServiceProvider(app.Services)` — 将 Host 构建的 ServiceProvider 传给框架
2. `InitializeModulesAsync()` — 按拓扑序执行每个模块的初始化

## 扩展方法三：AddAppSettingsSecretsJson

```csharp
// 文件：MokFramework.AspNetCore/HostBuilderExtensions.cs
// 命名空间：Microsoft.Extensions.Hosting

public static class MokFrameworkHostBuilderExtensions
{
    public const string AppSettingsSecretJsonPath = "appsettings.secrets.json";

    public static IHostBuilder AddAppSettingsSecretsJson(
        this IHostBuilder hostBuilder,
        bool optional = true,
        bool reloadOnChange = true,
        string path = AppSettingsSecretJsonPath)
    {
        return hostBuilder.ConfigureAppConfiguration((_, builder) =>
        {
            builder.AddJsonFile(
                path: path,
                optional: optional,
                reloadOnChange: reloadOnChange);
        });
    }
}
```

**这是 ABP 的约定**：

- `appsettings.json` — 通用配置，提交到 Git
- `appsettings.{Environment}.json` — 环境相关配置
- `appsettings.secrets.json` — 敏感配置（连接字符串、API 密钥），**不提交到 Git**

默认 `optional = true`，所以没有这个文件也不会报错。

## MokFrameworkAspNetCoreModule

```csharp
// 文件：MokFramework.AspNetCore/MokFrameworkAspNetCoreModule.cs

public class MokFrameworkAspNetCoreModule : MokFrameworkModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddHttpContextAccessor();
    }
}
```

注册 `IHttpContextAccessor`，允许在非控制器类中访问当前 HTTP 请求的上下文。

使用方式：

```csharp
[DependsOn(typeof(MokFrameworkAspNetCoreModule))]
public class MyWebModule : MokFrameworkModule { }
```

## 命名空间设计

| 扩展方法类 | 命名空间 | 原因 |
|-----------|---------|------|
| WebApplicationBuilderExtensions | `Microsoft.AspNetCore.Builder` | `WebApplicationBuilder` 在此命名空间 |
| ApplicationBuilderExtensions | `Microsoft.AspNetCore.Builder` | `WebApplication` 在此命名空间 |
| HostBuilderExtensions | `Microsoft.Extensions.Hosting` | `IHostBuilder` 在此命名空间 |

**关键原则**：扩展方法放在目标类型的命名空间中，这样用户不需要额外 `using` 就能看到它们。

这是 .NET 生态的标准做法，ASP.NET Core 自己的扩展方法也是这样做的。

## 完整流程图

```
用户代码                              框架内部

var builder = ...
                                     
builder.Host                         
  .AddAppSettingsSecretsJson()  ──→  添加 appsettings.secrets.json 配置源
  .UseAutofac()                 ──→  (Autofac 包) 替换 DI 容器工厂
  .UseMokSerilog()              ──→  (Serilog 包) 替换日志提供者

await builder                        
  .AddApplicationAsync<T>()    ──→  创建 ExternalServiceProvider 应用实例
                                     ├── ModuleLoader 发现+排序模块
                                     ├── RegisterCoreServices
                                     ├── ConfigureModuleServicesAsync (3 阶段)
                                     └── 注册 app 到 DI

var app = builder.Build()       ──→  Host 构建 DI 容器
                                     (如果用了 Autofac，容器是 Autofac 的)

await app                            
  .InitializeApplicationAsync() ──→  从 DI 解析框架应用实例
                                     ├── 注册 ApplicationStopping 钩子
                                     └── InitializeAsync(app.Services)
                                         ├── SetServiceProvider
                                         └── ModuleManager.InitializeModulesAsync

await app.RunAsync()            ──→  应用运行...

(收到停止信号)                   ──→  ApplicationStopping 触发
                                     └── ShutdownAsync
                                         └── ModuleManager.ShutdownModulesAsync (逆序)
```
