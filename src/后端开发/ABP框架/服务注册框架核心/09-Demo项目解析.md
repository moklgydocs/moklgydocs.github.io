---
title: Demo 项目解析
order: 10
category:
  - ABP框架
tag:
  - MokFramework
  - Demo
  - 实战
---

# 09 - Demo 项目解析

本章逐行解析 `MokFramework.Demo` 项目，通过一个可运行的控制台应用验证框架的所有核心功能。

## Demo 演示了什么？

| 功能 | 验证点 |
|------|--------|
| 模块依赖 | AppModule → InfrastructureModule |
| 模块生命周期 | PreConfigure → Configure → PostConfigure → Init → Shutdown |
| 拓扑排序 | Infrastructure 先于 App 初始化，后于 App 关闭 |
| ITransientDependency | GreetingService — 每次解析新实例 |
| ISingletonDependency | CacheService — 全局一个实例 |
| [Dependency] 特性 | OrderService — Scoped 生命周期 |
| [ExposeServices] | OrderService — 精确控制暴露的服务类型 |
| I{ClassName} 约定 | IGreetingService、ICacheService 自动匹配 |
| 手动注册 | InfrastructureInfo — 在模块中手动 AddSingleton |
| Options 模式 | AppOptions — Configure + IOptions&lt;T&gt;> |
| async 生命周期 | CreateAsync / InitializeAsync / DisposeAsync |

## 模块结构

```
MokFramework.Demo/
├── Program.cs                    # 入口，演示完整生命周期
├── Modules/
│   ├── AppModule.cs              # 启动模块（依赖 InfrastructureModule）
│   └── InfrastructureModule.cs   # 基础设施模块（依赖链底层）
└── Services/
    ├── IGreetingService.cs       # 接口
    ├── GreetingService.cs        # Transient（标记接口）
    ├── IOrderService.cs          # 接口
    ├── OrderService.cs           # Scoped（[Dependency] 特性）
    ├── ICacheService.cs          # 接口
    └── CacheService.cs           # Singleton（标记接口）
```

## 入口：Program.cs 逐段解析

### 创建应用

```csharp
await using var app = await MokFrameworkApplication.CreateAsync<AppModule>(services =>
{
    services.AddLogging(builder =>
    {
        builder.AddConsole();
        builder.SetMinimumLevel(LogLevel.Information);
    });
});
```

**发生了什么？**

```
CreateAsync<AppModule>(configureServices)
│
├── new ServiceCollection()
├── configureServices(services)          ← 注册日志
│
├── new InternalServiceProvider(typeof(AppModule), services)
│   ├── ModuleLoader.LoadModules(services, typeof(AppModule))
│   │   ├── 发现 AppModule
│   │   ├── [DependsOn] → 发现 InfrastructureModule
│   │   ├── 拓扑排序：[InfrastructureModule, AppModule]
│   │   └── 返回排序后的 ModuleDescriptor 列表
│   │
│   └── RegisterCoreServices()
│       ├── services.AddSingleton<IMokFrameworkApplication>(this)
│       ├── services.AddSingleton(modules)
│       ├── services.AddSingleton<IModuleManager, ModuleManager>()
│       ├── services.AddSingleton(infrastructureModuleInstance)
│       └── services.AddSingleton(appModuleInstance)
│
└── ConfigureModuleServicesAsync()
    │
    ├── Phase 1: PreConfigureServices
    │   ├── InfrastructureModule.PreConfigureServicesAsync()
    │   │   └── Console: "[InfrastructureModule] PreConfigureServices"
    │   └── AppModule.PreConfigureServicesAsync()
    │       └── (空实现)
    │
    ├── Phase 2: ConfigureServices
    │   ├── ConventionalRegistrar.RegisterAssembly(InfrastructureModule.Assembly)
    │   │   └── 扫描... InfrastructureModule 和 Demo 在同一个程序集！
    │   │       ├── GreetingService (ITransientDependency)
    │   │       │   → services.AddTransient<IGreetingService, GreetingService>()
    │   │       │   → services.AddTransient<GreetingService>()
    │   │       ├── OrderService ([Dependency(Scoped)] + [ExposeServices])
    │   │       │   → services.AddScoped<IOrderService, OrderService>()
    │   │       │   → services.AddScoped<OrderService>()
    │   │       └── CacheService (ISingletonDependency)
    │   │           → services.AddSingleton<ICacheService, CacheService>()
    │   │           → services.AddSingleton<CacheService>()
    │   │
    │   ├── InfrastructureModule.ConfigureServicesAsync()
    │   │   ├── Console: "[InfrastructureModule] ConfigureServices"
    │   │   └── services.AddSingleton<InfrastructureInfo>()  ← 手动注册
    │   │
    │   ├── ConventionalRegistrar.RegisterAssembly(AppModule.Assembly)
    │   │   └── 同一个程序集，已注册的类型会被再次扫描
    │   │       但 ConventionalRegistrar 使用 Add（非 TryAdd），所以会产生重复注册
    │   │       （这是简化实现，生产框架应去重）
    │   │
    │   └── AppModule.ConfigureServicesAsync()
    │       ├── Console: "[AppModule] ConfigureServices"
    │       └── services.Configure<AppOptions>(...)
    │
    └── Phase 3: PostConfigureServices
        ├── InfrastructureModule.PostConfigureServicesAsync()
        └── AppModule.PostConfigureServicesAsync()
```

**注意**：由于 Demo 项目中的模块和服务在同一个程序集中，
`ConventionalRegistrar` 会扫描两次同一个程序集。在实际项目中，
不同模块通常在不同程序集中，这个问题不会出现。

### 初始化应用

```csharp
await app.InitializeAsync();
```

**发生了什么？**

```
InitializeAsync()
├── ServiceProvider = Services.BuildServiceProvider()
│   └── 构建 DI 容器
│
└── InitializeModulesAsync()
    └── ModuleManager.InitializeModulesAsync(context)
        ├── InfrastructureModule.OnApplicationInitializationAsync()
        │   ├── log: "[InfrastructureModule] OnApplicationInitialization - Infrastructure ready"
        │   └── log: "Infrastructure info: MokFramework Infrastructure v1.0 - In-memory cache ready"
        │
        └── AppModule.OnApplicationInitializationAsync()
            └── log: "[AppModule] OnApplicationInitialization - App module initialized"
```

### 使用服务

#### Transient 验证

```csharp
var greeting1 = app.ServiceProvider.GetRequiredService<IGreetingService>();
var greeting2 = app.ServiceProvider.GetRequiredService<IGreetingService>();
Console.WriteLine($"same instance = {ReferenceEquals(greeting1, greeting2)}");
// 输出：same instance = False  ✅ 每次新实例
```

#### Scoped 验证

```csharp
using (var scope = app.ServiceProvider.CreateScope())
{
    var order1 = scope.ServiceProvider.GetRequiredService<IOrderService>();
    var order2 = scope.ServiceProvider.GetRequiredService<IOrderService>();
    Console.WriteLine($"same instance in scope = {ReferenceEquals(order1, order2)}");
    // 输出：same instance in scope = True  ✅ 同一作用域同一实例
}
```

#### Singleton 验证

```csharp
var cache1 = app.ServiceProvider.GetRequiredService<ICacheService>();
var cache2 = app.ServiceProvider.GetRequiredService<ICacheService>();
Console.WriteLine($"same instance = {ReferenceEquals(cache1, cache2)}");
// 输出：same instance = True  ✅ 全局同一实例
```

### 关闭应用

`await using` 语句块结束时自动触发：

```
DisposeAsync()
├── ShutdownAsync()
│   └── ModuleManager.ShutdownModulesAsync(context)
│       ├── AppModule.OnApplicationShutdownAsync()        ← 依赖者先关闭
│       │   └── log: "[AppModule] OnApplicationShutdown - App module shutting down..."
│       │
│       └── InfrastructureModule.OnApplicationShutdownAsync()  ← 被依赖的后关闭
│           └── log: "[InfrastructureModule] OnApplicationShutdown - Releasing connections..."
│
└── ServiceProvider.DisposeAsync()
    └── 释放所有 IDisposable / IAsyncDisposable 单例服务
```

## 三种服务注册方式的对比

### 方式 1：标记接口（最简洁）

```csharp
public class GreetingService : IGreetingService, ITransientDependency
{
    public string Greet(string name) => $"Hello, {name}!";
}
```

- 实现 `ITransientDependency` → 自动注册为 Transient
- 实现 `IGreetingService` → 按 `I{ClassName}` 约定匹配为服务接口
- **零配置**，最适合大部分场景

### 方式 2：[Dependency] 特性（精确控制）

```csharp
[Dependency(ServiceLifetime.Scoped)]
[ExposeServices(typeof(IOrderService), IncludeSelf = true)]
public class OrderService : IOrderService
{
    public string CreateOrder(string productName, int quantity) { ... }
}
```

- `[Dependency(Scoped)]` → 注册为 Scoped
- `[ExposeServices(typeof(IOrderService), IncludeSelf = true)]` → 只暴露指定的类型
- 适合需要精确控制暴露类型的场景

### 方式 3：手动注册（完全控制）

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    context.Services.AddSingleton<InfrastructureInfo>();
}
```

- `InfrastructureInfo` 没有实现标记接口，也没有 `[Dependency]` 特性
- ConventionalRegistrar 不会发现它
- 必须在模块中手动注册
- 适合特殊的服务、第三方库注册等

## 运行输出

```
========================================
  MokFramework Modular Framework Demo
========================================

=== Step 1: Create Application ===

[InfrastructureModule] PreConfigureServices
[InfrastructureModule] ConfigureServices
[AppModule] ConfigureServices

Modules loaded: 2
  - InfrastructureModule
  - AppModule

=== Step 2: Initialize Application ===

info: MokFramework.Core.Modularity.ModuleManager[0]
      [InfrastructureModule] OnApplicationInitialization - Infrastructure ready
info: MokFramework.Core.Modularity.ModuleManager[0]
      Infrastructure info: MokFramework Infrastructure v1.0 - In-memory cache ready
info: MokFramework.Core.Modularity.ModuleManager[0]
      [AppModule] OnApplicationInitialization - App module initialized

=== Step 3: Use Services ===

--- IGreetingService (ITransientDependency) ---
Hello, Developer! Welcome to MokFramework!
  Transient: same instance = False (expected: False)

--- IOrderService ([Dependency] Scoped) ---
Order created! ID: ORD-000001, Product: Laptop, Qty: 1
Order created! ID: ORD-000002, Product: Keyboard, Qty: 2
  Scoped: same instance in scope = True (expected: True)

--- ICacheService (ISingletonDependency) ---
  Cache user:1001 = Alice
  Cache user:1002 = Bob
  Cache user:9999 = (not found)
  Singleton: same instance = True (expected: True)

--- InfrastructureInfo (manual registration) ---
  MokFramework Infrastructure v1.0 - In-memory cache ready

--- AppOptions (Options pattern) ---
  App Name: MokFramework Demo Application
  Version: 1.0.0

=== Step 4: Shutdown ===

Application shutting down (DisposeAsync via await using)...

info: ...[AppModule] OnApplicationShutdown - App module shutting down...
info: ...[InfrastructureModule] OnApplicationShutdown - Releasing connections...
```
