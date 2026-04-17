---
title: Autofac IOC 容器替换
order: 8
category:
  - ABP框架
tag:
  - MokFramework
  - Autofac
  - IOC容器
---

# 07 - Autofac IOC 容器替换

本章讲解如何实现 DI 容器的可替换性——让用户一行代码就能从默认的 MS DI 切换到 Autofac。

## 为什么要替换 DI 容器？

Microsoft.Extensions.DependencyInjection 功能够用，但有些限制：

| 特性 | MS DI | Autofac |
|------|-------|---------|
| 构造函数注入 | ✅ | ✅ |
| 属性注入 | ❌ | ✅ |
| 方法注入 | ❌ | ✅ |
| AOP 拦截器 | ❌ | ✅ |
| 命名/键控注册 | ✅ (.NET 8+) | ✅ |
| 动态代理 | ❌ | ✅ |
| 模块化注册 | ❌ | ✅ (Autofac Module) |
| 装饰器模式 | ❌ | ✅ |

如果你的项目需要 AOP、属性注入或其他高级功能，Autofac 是最佳选择。

## .NET 的容器替换机制

ASP.NET Core 通过 `IServiceProviderFactory<TContainerBuilder>` 支持第三方 DI 容器：

```csharp
public interface IServiceProviderFactory<TContainerBuilder>
{
    // Host 调用：将 IServiceCollection 中的注册导入到第三方容器
    TContainerBuilder CreateBuilder(IServiceCollection services);

    // Host 调用：构建第三方容器，返回 IServiceProvider
    IServiceProvider CreateServiceProvider(TContainerBuilder containerBuilder);
}
```

**替换流程：**

```
Host.Build()
│
├── 1. CreateBuilder(services)
│   └── 将 MS DI 的 ServiceDescriptor 转化为第三方容器的注册
│
└── 2. CreateServiceProvider(containerBuilder)
    └── 构建第三方容器，包装为 IServiceProvider
```

## 实现步骤

### 第一步：包装 Autofac 的工厂

```csharp
// 文件：MokFramework.Autofac/MokFrameworkAutofacServiceProviderFactory.cs

public class MokFrameworkAutofacServiceProviderFactory
    : IServiceProviderFactory<ContainerBuilder>
{
    private readonly ContainerBuilder _builder;
    private IContainer? _container;

    public MokFrameworkAutofacServiceProviderFactory(ContainerBuilder builder)
    {
        _builder = builder;
    }

    public ContainerBuilder CreateBuilder(IServiceCollection services)
    {
        // Populate = Autofac.Extensions.DependencyInjection 提供的桥接方法
        // 将 IServiceCollection 中的 ServiceDescriptor 逐一转化为 Autofac 注册
        _builder.Populate(services);
        return _builder;
    }

    public IServiceProvider CreateServiceProvider(ContainerBuilder containerBuilder)
    {
        _container = containerBuilder.Build();
        // AutofacServiceProvider 将 IContainer 包装为 IServiceProvider
        return new AutofacServiceProvider(_container);
    }
}
```

**`_builder.Populate(services)` 做了什么？**

遍历 `IServiceCollection` 中的每个 `ServiceDescriptor`，转化为 Autofac 的等价注册：

```
ServiceDescriptor(typeof(IFoo), typeof(Foo), Scoped)
  → builder.RegisterType<Foo>().As<IFoo>().InstancePerLifetimeScope()

ServiceDescriptor(typeof(IBar), barInstance)
  → builder.RegisterInstance(barInstance).As<IBar>()

ServiceDescriptor(typeof(IBaz), sp => new Baz(sp), Transient)
  → builder.Register(ctx => new Baz(ctx.Resolve<...>())).As<IBaz>()
```

### 第二步：提供扩展方法

```csharp
// 文件：MokFramework.Autofac/AutofacHostBuilderExtensions.cs
// 命名空间：Microsoft.Extensions.Hosting

public static class MokFrameworkAutofacHostBuilderExtensions
{
    public static IHostBuilder UseAutofac(this IHostBuilder hostBuilder)
    {
        var containerBuilder = new ContainerBuilder();

        return hostBuilder
            .ConfigureServices((_, services) =>
            {
                // 1. 将 ContainerBuilder 注册到 ObjectAccessor
                services.AddObjectAccessor(containerBuilder);
            })
            .UseServiceProviderFactory(
                // 2. 告诉 Host 使用 Autofac 工厂
                new MokFrameworkAutofacServiceProviderFactory(containerBuilder));
    }
}
```

**两件事的作用：**

#### 1. ObjectAccessor 注册

将 `ContainerBuilder` 包装在 `ObjectAccessor<ContainerBuilder>` 中注册到 `IServiceCollection`。
这样模块在 `ConfigureServices` 阶段就能访问到 `ContainerBuilder`，做 Autofac 原生注册：

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    // 获取 Autofac 的 ContainerBuilder
    var containerBuilder = context.Services
        .GetSingletonInstance<ObjectAccessor<ContainerBuilder>>()
        .Value;

    // 使用 Autofac 原生 API 注册
    containerBuilder.RegisterType<MyService>()
        .As<IMyService>()
        .EnableInterfaceInterceptors()  // AOP！
        .InstancePerLifetimeScope();
}
```

#### 2. UseServiceProviderFactory

告诉 ASP.NET Core 的 Host：不要用默认的 MS DI 构建容器，用我的 Autofac 工厂。

```
builder.Build() 调用链：
│
├── UseServiceProviderFactory 设置的工厂
│   ├── CreateBuilder(builder.Services)
│   │   └── _builder.Populate(services)  ← 所有 MS DI 注册导入 Autofac
│   │
│   └── CreateServiceProvider(containerBuilder)
│       ├── containerBuilder.Build()     ← 构建 Autofac 容器
│       └── new AutofacServiceProvider() ← 包装为 IServiceProvider
│
└── 返回的 IServiceProvider 实际上是 AutofacServiceProvider
    └── 解析服务时走 Autofac 的容器
```

### 第三步：标记模块

```csharp
// 文件：MokFramework.Autofac/MokFrameworkAutofacModule.cs

public class MokFrameworkAutofacModule : MokFrameworkModule
{
    // 当前为空，未来可扩展
}
```

标记模块的作用：
- 让其他模块可以通过 `[DependsOn(typeof(MokFrameworkAutofacModule))]` 声明对 Autofac 的依赖
- 未来可以在这里注册 Autofac 特有的基础服务（如拦截器、属性注入支持等）

## NuGet 依赖

```xml
<!-- MokFramework.Autofac.csproj -->
<ItemGroup>
  <PackageReference Include="Autofac" Version="8.*" />
  <PackageReference Include="Autofac.Extensions.DependencyInjection" Version="10.*" />
  <PackageReference Include="Microsoft.Extensions.Hosting.Abstractions" Version="10.*" />
</ItemGroup>
```

- `Autofac` — Autofac 核心库
- `Autofac.Extensions.DependencyInjection` — 提供 `Populate()` 桥接方法和 `AutofacServiceProvider`
- `Microsoft.Extensions.Hosting.Abstractions` — 提供 `IHostBuilder` 接口

## 完整调用流程

```
var builder = WebApplication.CreateBuilder(args);

// ① UseAutofac()
builder.Host.UseAutofac();
// → 创建 ContainerBuilder
// → 注册 ObjectAccessor<ContainerBuilder> 到 builder.Services
// → UseServiceProviderFactory(new MokFrameworkAutofacServiceProviderFactory(...))

// ② AddApplicationAsync()
await builder.AddApplicationAsync<MyModule>();
// → 模块服务配置...
// → ConventionalRegistrar 注册到 builder.Services (MS DI 格式)
// → 模块可以通过 ObjectAccessor 访问 ContainerBuilder 做原生注册

// ③ builder.Build()
var app = builder.Build();
// Host 内部：
// → factory.CreateBuilder(builder.Services)
//   → _builder.Populate(services)    ← 所有 MS DI 注册 → Autofac 注册
// → factory.CreateServiceProvider(containerBuilder)
//   → containerBuilder.Build()       ← 构建 Autofac 容器
//   → new AutofacServiceProvider()   ← 包装为 IServiceProvider

// ④ 此后所有 GetRequiredService 都走 Autofac
await app.InitializeApplicationAsync();
// → 模块初始化...解析服务时走 Autofac 容器
```

## 透明切换

关键设计：**是否使用 Autofac 对模块代码几乎没有影响**。

不管底层是 MS DI 还是 Autofac，模块代码都一样：

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    // 这行代码不管底层容器是什么都能工作
    context.Services.AddScoped<IMyService, MyService>();
}

public override void OnApplicationInitialization(ApplicationInitializationContext context)
{
    // 这行代码不管底层容器是什么都能工作
    var service = context.ServiceProvider.GetRequiredService<IMyService>();
}
```

只有需要 Autofac 特有功能（AOP、属性注入）时，才需要直接操作 `ContainerBuilder`。
