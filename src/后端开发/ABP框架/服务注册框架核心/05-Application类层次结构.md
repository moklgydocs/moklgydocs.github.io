---
title: Application 类层次结构
order: 6
category:
  - ABP框架
tag:
  - MokFramework
  - Application
  - 宿主模式
---

# 05 - Application 类层次结构

本章讲解 MokFramework 的 Application 类设计——如何支持控制台应用和 ASP.NET Core 两种完全不同的宿主模式。

## 问题背景

.NET 应用有两种 DI 容器的管理方式：

### 模式 1：控制台应用（内部 ServiceProvider）

```csharp
// 应用自己创建 ServiceCollection，自己 Build
var services = new ServiceCollection();
services.AddTransient<IGreetingService, GreetingService>();
var serviceProvider = services.BuildServiceProvider();  // 自己构建
var greeting = serviceProvider.GetRequiredService<IGreetingService>();
```

### 模式 2：ASP.NET Core（外部 ServiceProvider）

```csharp
// WebApplicationBuilder 拥有 ServiceCollection
// Host 负责 Build ServiceProvider
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddTransient<IGreetingService, GreetingService>();
var app = builder.Build();  // Host 构建 ServiceProvider
// 应用只能使用 app.Services，不能自己 Build
```

两种模式的关键区别：

| | 控制台模式 | ASP.NET Core 模式 |
|---|---|---|
| ServiceCollection | 自己创建 | 外部提供 |
| BuildServiceProvider | 自己调用 | Host 调用 |
| ServiceProvider 生命周期 | 自己管理 | Host 管理 |
| Dispose | 自己释放 | Host 释放 |

## 设计方案

ABP 的做法（MokFramework 沿用）是将 Application 拆分为类层次结构：

```
IMokFrameworkApplication (接口)
    │
    ├── IMokFrameworkApplicationWithExternalServiceProvider (接口)
    │
    └── MokFrameworkApplicationBase (抽象基类)
            │
            ├── MokFrameworkApplicationWithInternalServiceProvider
            │   └── 控制台/后台服务模式
            │
            └── MokFrameworkApplicationWithExternalServiceProvider
                └── ASP.NET Core 模式

MokFrameworkApplication (静态工厂)
    └── Create<T>() / CreateForExternal<T>()
```

## 第一步：顶层接口

```csharp
// 文件：MokFramework.Core/IMokFrameworkApplication.cs

public interface IMokFrameworkApplication : IDisposable, IAsyncDisposable
{
    /// <summary>启动模块的类型</summary>
    Type StartupModuleType { get; }

    /// <summary>DI 服务集合（配置阶段使用）</summary>
    IServiceCollection Services { get; }

    /// <summary>DI 服务提供者（运行阶段使用）</summary>
    IServiceProvider ServiceProvider { get; }

    /// <summary>已加载的模块列表（拓扑排序后）</summary>
    IReadOnlyList<ModuleDescriptor> Modules { get; }

    void Initialize();
    Task InitializeAsync();
    void Shutdown();
    Task ShutdownAsync();
}
```

### 外部 ServiceProvider 的扩展接口

```csharp
// 文件：MokFramework.Core/IMokFrameworkApplicationWithExternalServiceProvider.cs

public interface IMokFrameworkApplicationWithExternalServiceProvider
    : IMokFrameworkApplication
{
    /// <summary>
    /// 设置外部提供的 ServiceProvider
    /// </summary>
    void SetServiceProvider(IServiceProvider serviceProvider);

    /// <summary>
    /// 使用外部 ServiceProvider 初始化
    /// </summary>
    void Initialize(IServiceProvider serviceProvider);
    Task InitializeAsync(IServiceProvider serviceProvider);
}
```

## 第二步：抽象基类

`MokFrameworkApplicationBase` 包含所有共享逻辑：

```csharp
// 文件：MokFramework.Core/MokFrameworkApplicationBase.cs

public abstract class MokFrameworkApplicationBase : IMokFrameworkApplication
{
    public Type StartupModuleType { get; }
    public IServiceCollection Services { get; }
    public IServiceProvider ServiceProvider { get; protected set; }
    public IReadOnlyList<ModuleDescriptor> Modules { get; }

    internal IModuleManager? ModuleManager { get; set; }

    // ============================================================
    // 构造函数：加载模块 + 注册核心服务
    // ============================================================
    protected MokFrameworkApplicationBase(
        Type startupModuleType,
        IServiceCollection services)
    {
        StartupModuleType = startupModuleType;
        Services = services;

        // 使用 ModuleLoader 递归发现并拓扑排序所有模块
        var moduleLoader = new ModuleLoader();
        var modules = moduleLoader.LoadModules(services, startupModuleType);
        Modules = modules.AsReadOnly();

        // 注册框架核心服务
        RegisterCoreServices();
    }

    private void RegisterCoreServices()
    {
        // 注册应用自身
        Services.AddSingleton<IMokFrameworkApplication>(this);

        // 注册模块列表（ModuleManager 需要注入）
        Services.AddSingleton(Modules.ToList());

        // 注册模块管理器
        Services.AddSingleton<IModuleManager, ModuleManager>();
        Services.AddSingleton<IModuleLoader, ModuleLoader>();

        // 每个模块实例注册为单例（允许通过 DI 解析模块实例）
        foreach (var module in Modules)
        {
            Services.AddSingleton(module.Instance.GetType(), module.Instance);
        }
    }
```

### 三阶段服务配置

```csharp
    // ============================================================
    // 服务配置阶段
    // ============================================================
    internal async Task ConfigureModuleServicesAsync()
    {
        var context = new ServiceConfigurationContext(Services);

        // 将上下文设置到每个模块
        foreach (var module in Modules)
        {
            module.Instance.ServiceConfigurationContext = context;
        }

        // === Phase 1: PreConfigureServices ===
        foreach (var module in Modules)
        {
            await module.Instance.PreConfigureServicesAsync(context);
        }

        // === Phase 2: ConfigureServices ===
        var registrar = new ConventionalRegistrar();
        foreach (var module in Modules)
        {
            // 先扫描模块程序集（约定注册）
            registrar.RegisterAssembly(module.ModuleType.Assembly, Services);
            // 再调用模块的 ConfigureServices（可覆盖约定注册）
            await module.Instance.ConfigureServicesAsync(context);
        }

        // === Phase 3: PostConfigureServices ===
        foreach (var module in Modules)
        {
            await module.Instance.PostConfigureServicesAsync(context);
        }

        // 清除上下文引用
        foreach (var module in Modules)
        {
            module.Instance.ServiceConfigurationContext = null;
        }
    }
```

### 模块初始化和关闭

```csharp
    // ============================================================
    // 应用运行阶段
    // ============================================================
    protected async Task InitializeModulesAsync()
    {
        ModuleManager = ServiceProvider.GetRequiredService<IModuleManager>();
        var context = new ApplicationInitializationContext(ServiceProvider);
        await ModuleManager.InitializeModulesAsync(context);
    }

    public async Task ShutdownAsync()
    {
        if (ModuleManager != null)
        {
            var context = new ApplicationShutdownContext(ServiceProvider);
            await ModuleManager.ShutdownModulesAsync(context);
        }
    }

    // Initialize 由子类实现（因为 ServiceProvider 的来源不同）
    public abstract void Initialize();
    public abstract Task InitializeAsync();
```

### 资源释放

```csharp
    // ============================================================
    // Dispose
    // ============================================================
    public virtual void Dispose()
    {
        Shutdown();
        if (ServiceProvider is IDisposable disposable)
            disposable.Dispose();
    }

    public virtual async ValueTask DisposeAsync()
    {
        await ShutdownAsync();
        if (ServiceProvider is IAsyncDisposable asyncDisposable)
            await asyncDisposable.DisposeAsync();
        else if (ServiceProvider is IDisposable disposable)
            disposable.Dispose();
    }
}
```

## 第三步：内部 ServiceProvider 版本（控制台应用）

```csharp
// 文件：MokFramework.Core/MokFrameworkApplicationWithInternalServiceProvider.cs

public class MokFrameworkApplicationWithInternalServiceProvider
    : MokFrameworkApplicationBase
{
    public MokFrameworkApplicationWithInternalServiceProvider(
        Type startupModuleType, IServiceCollection services)
        : base(startupModuleType, services) { }

    public override void Initialize()
    {
        // 自己构建 ServiceProvider
        ServiceProvider = Services.BuildServiceProvider();
        InitializeModules();
    }

    public override async Task InitializeAsync()
    {
        ServiceProvider = Services.BuildServiceProvider();
        await InitializeModulesAsync();
    }
}
```

**关键**：`Services.BuildServiceProvider()` 在这里调用——应用完全控制 DI 容器的创建。

## 第四步：外部 ServiceProvider 版本（ASP.NET Core）

```csharp
// 文件：MokFramework.Core/MokFrameworkApplicationWithExternalServiceProvider.cs

public class MokFrameworkApplicationWithExternalServiceProvider
    : MokFrameworkApplicationBase, IMokFrameworkApplicationWithExternalServiceProvider
{
    public MokFrameworkApplicationWithExternalServiceProvider(
        Type startupModuleType, IServiceCollection services)
        : base(startupModuleType, services) { }

    public void SetServiceProvider(IServiceProvider serviceProvider)
    {
        ServiceProvider = serviceProvider;
    }

    // 带参数版本：接收外部 ServiceProvider
    public void Initialize(IServiceProvider serviceProvider)
    {
        SetServiceProvider(serviceProvider);
        InitializeModules();
    }

    public async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        SetServiceProvider(serviceProvider);
        await InitializeModulesAsync();
    }

    // 无参数版本：抛异常（必须传入外部 ServiceProvider）
    public override void Initialize()
    {
        throw new InvalidOperationException(
            "External ServiceProvider mode requires Initialize(IServiceProvider).");
    }

    public override Task InitializeAsync()
    {
        throw new InvalidOperationException(
            "External ServiceProvider mode requires InitializeAsync(IServiceProvider).");
    }

    // 不释放 ServiceProvider（Host 负责释放）
    public override void Dispose()
    {
        Shutdown();
        // 注意：不调用 ServiceProvider.Dispose()
    }

    public override async ValueTask DisposeAsync()
    {
        await ShutdownAsync();
        // 注意：不调用 ServiceProvider.DisposeAsync()
    }
}
```

**三个关键区别：**

1. `Initialize()` 需要传入 `IServiceProvider`（来自 Host）
2. 无参 `Initialize()` 抛异常，防止误用
3. `Dispose` 不释放 `ServiceProvider`——它属于 Host

## 第五步：静态工厂

```csharp
// 文件：MokFramework.Core/MokFrameworkApplication.cs

public static class MokFrameworkApplication
{
    // ========================================
    // 公开 API — 控制台应用使用
    // ========================================

    public static MokFrameworkApplicationWithInternalServiceProvider Create<TStartupModule>(
        Action<IServiceCollection>? configureServices = null)
        where TStartupModule : MokFrameworkModule
    {
        var services = new ServiceCollection();
        configureServices?.Invoke(services);

        var app = new MokFrameworkApplicationWithInternalServiceProvider(
            typeof(TStartupModule), services);
        app.ConfigureModuleServices();
        return app;
    }

    public static async Task<MokFrameworkApplicationWithInternalServiceProvider>
        CreateAsync<TStartupModule>(
            Action<IServiceCollection>? configureServices = null)
        where TStartupModule : MokFrameworkModule
    {
        var services = new ServiceCollection();
        configureServices?.Invoke(services);

        var app = new MokFrameworkApplicationWithInternalServiceProvider(
            typeof(TStartupModule), services);
        await app.ConfigureModuleServicesAsync();
        return app;
    }

    // ========================================
    // 内部 API — ASP.NET Core 扩展方法使用
    // ========================================

    internal static MokFrameworkApplicationWithExternalServiceProvider
        CreateForExternal<TStartupModule>(IServiceCollection services)
        where TStartupModule : MokFrameworkModule
    {
        var app = new MokFrameworkApplicationWithExternalServiceProvider(
            typeof(TStartupModule), services);

        // 注册自身到 DI（ASP.NET Core 需要在 Build 后解析）
        services.AddSingleton<IMokFrameworkApplicationWithExternalServiceProvider>(app);

        app.ConfigureModuleServices();
        return app;
    }

    // ... CreateForExternalAsync<T> 类似
}
```

**为什么 `CreateForExternal` 是 internal？**

- 用户不应该直接调用它
- 用户应该使用 `builder.AddApplicationAsync<T>()`（在 AspNetCore 包中）
- `CreateForExternal` 由 `ServiceCollectionApplicationExtensions.AddApplicationAsync<T>()` 调用

## 两种模式的对比

### 控制台应用流程

```csharp
// 用户代码
await using var app = await MokFrameworkApplication.CreateAsync<AppModule>(services =>
{
    services.AddLogging(b => b.AddConsole());
});
await app.InitializeAsync();
// 使用 app.ServiceProvider 解析服务...
// await using 结束时自动 Dispose

// 内部流程：
// 1. new ServiceCollection()
// 2. configureServices 回调
// 3. new InternalServiceProvider(typeof(AppModule), services)
//    → ModuleLoader → RegisterCoreServices
// 4. ConfigureModuleServicesAsync()
//    → Pre → ConventionalRegistrar + Configure → Post
// 5. InitializeAsync()
//    → services.BuildServiceProvider()  ← 在这里构建！
//    → ModuleManager.InitializeModulesAsync()
// 6. DisposeAsync()
//    → ShutdownAsync() → ServiceProvider.DisposeAsync()
```

### ASP.NET Core 流程

```csharp
// 用户代码
var builder = WebApplication.CreateBuilder(args);
builder.Host.UseAutofac().UseMokSerilog();
await builder.AddApplicationAsync<AppModule>();
var app = builder.Build();           // Host 构建 ServiceProvider
await app.InitializeApplicationAsync();
await app.RunAsync();

// 内部流程：
// 1. builder.Services 已存在
// 2. AddApplicationAsync<AppModule>()
//    → new ExternalServiceProvider(typeof(AppModule), builder.Services)
//    → ModuleLoader → RegisterCoreServices
//    → ConfigureModuleServicesAsync()
//    → 注册 IMokFrameworkApplicationWithExternalServiceProvider 到 DI
// 3. builder.Build()
//    → Host 构建 ServiceProvider（可能用 Autofac）
// 4. InitializeApplicationAsync()
//    → 从 DI 解析 IMokFrameworkApplicationWithExternalServiceProvider
//    → 注册 ApplicationStopping 钩子
//    → app.InitializeAsync(app.Services)  ← 传入外部 ServiceProvider
//      → SetServiceProvider() + InitializeModulesAsync()
// 5. Host 停止时
//    → ApplicationStopping 触发 → ShutdownAsync()
//    → Host 释放 ServiceProvider
```

## ObjectAccessor 模式

在 ASP.NET Core 模式中，有些对象（如 `ContainerBuilder`、`IApplicationBuilder`）
在 DI 容器构建之前就需要被访问。`ObjectAccessor<T>` 解决这个问题：

```csharp
// 文件：MokFramework.Core/ObjectAccessor.cs

public class ObjectAccessor<T> where T : class
{
    public T? Value { get; set; }
}
```

使用方式：

```csharp
// 在 ConfigureServices 阶段注册一个空的 Accessor
services.AddObjectAccessor<ContainerBuilder>();

// 稍后设置值
var accessor = services.GetSingletonInstance<ObjectAccessor<ContainerBuilder>>();
accessor.Value = new ContainerBuilder();

// 在模块的 ConfigureServices 中通过 IServiceCollection 访问
var containerBuilder = services
    .GetSingletonInstance<ObjectAccessor<ContainerBuilder>>()
    .Value;
```

扩展方法（在 `ObjectAccessorExtensions.cs` 中）：

```csharp
public static ObjectAccessor<T> AddObjectAccessor<T>(
    this IServiceCollection services, T obj)
    where T : class
{
    // 检查重复
    if (services.Any(s => s.ServiceType == typeof(ObjectAccessor<T>)))
        throw new InvalidOperationException(
            $"ObjectAccessor<{typeof(T).Name}> already registered.");

    var accessor = new ObjectAccessor<T>(obj);
    services.AddSingleton(accessor);
    return accessor;
}
```
