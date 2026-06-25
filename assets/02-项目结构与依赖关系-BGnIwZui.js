import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-BVtXrkU4.js";import{t as r}from"./app-fnFKaiE5.js";var i=JSON.parse(`{"path":"/%E5%90%8E%E7%AB%AF%E5%BC%80%E5%8F%91/ABP%E6%A1%86%E6%9E%B6/%E6%9C%8D%E5%8A%A1%E6%B3%A8%E5%86%8C%E6%A1%86%E6%9E%B6%E6%A0%B8%E5%BF%83/02-%E9%A1%B9%E7%9B%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E4%BE%9D%E8%B5%96%E5%85%B3%E7%B3%BB.html","title":"项目结构与依赖关系","lang":"zh-CN","frontmatter":{"title":"项目结构与依赖关系","order":3,"category":["ABP框架"],"tag":["MokFramework","项目结构"]},"git":{"createdTime":1776411377000,"updatedTime":1776411377000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":2.49,"words":747},"filePathRelative":"后端开发/ABP框架/服务注册框架核心/02-项目结构与依赖关系.md"}`),a={name:`02-项目结构与依赖关系.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="_02-项目结构与依赖关系" tabindex="-1"><a class="header-anchor" href="#_02-项目结构与依赖关系"><span>02 - 项目结构与依赖关系</span></a></h1><h2 id="解决方案结构" tabindex="-1"><a class="header-anchor" href="#解决方案结构"><span>解决方案结构</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>MokFrameworkPlatform.Core/</span></span>
<span class="line"><span>├── MokFramework.slnx                 # 解决方案文件 (slnx 格式)</span></span>
<span class="line"><span>├── MokFramework.Core/                # 核心框架（无外部依赖）</span></span>
<span class="line"><span>│   ├── MokFramework.Core.csproj</span></span>
<span class="line"><span>│   ├── IMokFrameworkApplication.cs</span></span>
<span class="line"><span>│   ├── IMokFrameworkApplicationWithExternalServiceProvider.cs</span></span>
<span class="line"><span>│   ├── MokFrameworkApplication.cs</span></span>
<span class="line"><span>│   ├── MokFrameworkApplicationBase.cs</span></span>
<span class="line"><span>│   ├── MokFrameworkApplicationCreationOptions.cs</span></span>
<span class="line"><span>│   ├── MokFrameworkApplicationWithExternalServiceProvider.cs</span></span>
<span class="line"><span>│   ├── MokFrameworkApplicationWithInternalServiceProvider.cs</span></span>
<span class="line"><span>│   ├── ObjectAccessor.cs</span></span>
<span class="line"><span>│   ├── Modularity/</span></span>
<span class="line"><span>│   │   ├── IMokFrameworkModule.cs</span></span>
<span class="line"><span>│   │   ├── MokFrameworkModule.cs</span></span>
<span class="line"><span>│   │   ├── DependsOnAttribute.cs</span></span>
<span class="line"><span>│   │   ├── ModuleDescriptor.cs</span></span>
<span class="line"><span>│   │   ├── IModuleLoader.cs</span></span>
<span class="line"><span>│   │   ├── ModuleLoader.cs</span></span>
<span class="line"><span>│   │   ├── IModuleManager.cs</span></span>
<span class="line"><span>│   │   ├── ModuleManager.cs</span></span>
<span class="line"><span>│   │   ├── ApplicationInitializationContext.cs</span></span>
<span class="line"><span>│   │   └── ServiceConfigurationContext.cs</span></span>
<span class="line"><span>│   └── DependencyInjection/</span></span>
<span class="line"><span>│       ├── ITransientDependency.cs</span></span>
<span class="line"><span>│       ├── ISingletonDependency.cs</span></span>
<span class="line"><span>│       ├── IScopedDependency.cs</span></span>
<span class="line"><span>│       ├── DependencyAttribute.cs</span></span>
<span class="line"><span>│       ├── ExposeServicesAttribute.cs</span></span>
<span class="line"><span>│       ├── ConventionalRegistrar.cs</span></span>
<span class="line"><span>│       ├── ServiceCollectionApplicationExtensions.cs</span></span>
<span class="line"><span>│       └── ObjectAccessorExtensions.cs</span></span>
<span class="line"><span>├── MokFramework.AspNetCore/          # ASP.NET Core 集成</span></span>
<span class="line"><span>│   ├── MokFramework.AspNetCore.csproj</span></span>
<span class="line"><span>│   ├── MokFrameworkAspNetCoreModule.cs</span></span>
<span class="line"><span>│   ├── WebApplicationBuilderExtensions.cs</span></span>
<span class="line"><span>│   ├── ApplicationBuilderExtensions.cs</span></span>
<span class="line"><span>│   └── HostBuilderExtensions.cs</span></span>
<span class="line"><span>├── MokFramework.Autofac/             # Autofac IOC 容器集成</span></span>
<span class="line"><span>│   ├── MokFramework.Autofac.csproj</span></span>
<span class="line"><span>│   ├── MokFrameworkAutofacModule.cs</span></span>
<span class="line"><span>│   ├── MokFrameworkAutofacServiceProviderFactory.cs</span></span>
<span class="line"><span>│   └── AutofacHostBuilderExtensions.cs</span></span>
<span class="line"><span>├── MokFramework.Serilog/             # Serilog 日志集成</span></span>
<span class="line"><span>│   ├── MokFramework.Serilog.csproj</span></span>
<span class="line"><span>│   ├── MokFrameworkSerilogModule.cs</span></span>
<span class="line"><span>│   └── SerilogHostBuilderExtensions.cs</span></span>
<span class="line"><span>├── MokFramework.Demo/                # 演示控制台应用</span></span>
<span class="line"><span>│   ├── MokFramework.Demo.csproj</span></span>
<span class="line"><span>│   ├── Program.cs</span></span>
<span class="line"><span>│   ├── Modules/</span></span>
<span class="line"><span>│   │   ├── AppModule.cs</span></span>
<span class="line"><span>│   │   └── InfrastructureModule.cs</span></span>
<span class="line"><span>│   └── Services/</span></span>
<span class="line"><span>│       ├── IGreetingService.cs / GreetingService.cs</span></span>
<span class="line"><span>│       ├── IOrderService.cs / OrderService.cs</span></span>
<span class="line"><span>│       └── ICacheService.cs / CacheService.cs</span></span>
<span class="line"><span>└── docs/                              # 本文档库</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="项目依赖关系" tabindex="-1"><a class="header-anchor" href="#项目依赖关系"><span>项目依赖关系</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>MokFramework.Demo</span></span>
<span class="line"><span>    └── MokFramework.Core</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MokFramework.AspNetCore</span></span>
<span class="line"><span>    └── MokFramework.Core</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MokFramework.Autofac</span></span>
<span class="line"><span>    └── MokFramework.Core (隐式，通过共享类型)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MokFramework.Serilog</span></span>
<span class="line"><span>    └── MokFramework.Core (隐式，通过共享类型)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="依赖关系图" tabindex="-1"><a class="header-anchor" href="#依赖关系图"><span>依赖关系图</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐</span></span>
<span class="line"><span>│ MokFramework     │     │ MokFramework     │     │ MokFramework     │</span></span>
<span class="line"><span>│ .AspNetCore      │     │ .Autofac         │     │ .Serilog         │</span></span>
<span class="line"><span>└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘</span></span>
<span class="line"><span>         │                        │                         │</span></span>
<span class="line"><span>         │   ProjectReference     │  (独立 NuGet 依赖)       │  (独立 NuGet 依赖)</span></span>
<span class="line"><span>         │                        │                         │</span></span>
<span class="line"><span>         ▼                        ▼                         ▼</span></span>
<span class="line"><span>┌──────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                      MokFramework.Core                               │</span></span>
<span class="line"><span>│  (Microsoft.Extensions.DependencyInjection.Abstractions)             │</span></span>
<span class="line"><span>│  (Microsoft.Extensions.Logging.Abstractions)                         │</span></span>
<span class="line"><span>│  (Microsoft.Extensions.Options)                                      │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="每个项目的职责" tabindex="-1"><a class="header-anchor" href="#每个项目的职责"><span>每个项目的职责</span></a></h2><h3 id="mokframework-core-—-核心框架" tabindex="-1"><a class="header-anchor" href="#mokframework-core-—-核心框架"><span>MokFramework.Core — 核心框架</span></a></h3><p><strong>NuGet 依赖</strong>：仅 Microsoft.Extensions.* 抽象包<br><strong>职责</strong>：</p><ul><li>模块系统：模块发现、依赖解析、生命周期管理</li><li>约定式 DI 注册：标记接口、特性、程序集扫描</li><li>Application 类层次：内部/外部 ServiceProvider 两种模式</li><li>ObjectAccessor 模式：延迟对象可用性</li></ul><p><strong>设计关键</strong>：Core 不依赖 <a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core，可以在控制台应用中独立使用。</p><h3 id="mokframework-aspnetcore-—-asp-net-core-集成" tabindex="-1"><a class="header-anchor" href="#mokframework-aspnetcore-—-asp-net-core-集成"><span>MokFramework.AspNetCore — <a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core 集成</span></a></h3><p><strong>NuGet 依赖</strong>：<code>&lt;FrameworkReference Include=&quot;Microsoft.AspNetCore.App&quot; /&gt;</code><br><strong>职责</strong>：</p><ul><li><code>builder.AddApplicationAsync&lt;T&gt;()</code> — 在 WebApplicationBuilder 上注册模块化应用</li><li><code>app.InitializeApplicationAsync()</code> — 初始化模块并注册关闭钩子</li><li><code>builder.Host.AddAppSettingsSecretsJson()</code> — 加载敏感配置文件</li><li><code>MokFrameworkAspNetCoreModule</code> — 注册 IHttpContextAccessor 等基础服务</li></ul><p><strong>设计关键</strong>：使用 FrameworkReference 而非 PackageReference，避免版本冲突。</p><h3 id="mokframework-autofac-—-autofac-容器替换" tabindex="-1"><a class="header-anchor" href="#mokframework-autofac-—-autofac-容器替换"><span>MokFramework.Autofac — Autofac 容器替换</span></a></h3><p><strong>NuGet 依赖</strong>：Autofac 8.x, Autofac.Extensions.DependencyInjection 10.x<br><strong>职责</strong>：</p><ul><li><code>builder.Host.UseAutofac()</code> — 一行代码切换到 Autofac 容器</li><li><code>MokFrameworkAutofacServiceProviderFactory</code> — 桥接 MS DI 和 Autofac</li><li><code>MokFrameworkAutofacModule</code> — 标记模块</li></ul><p><strong>设计关键</strong>：通过 <code>IServiceProviderFactory&lt;ContainerBuilder&gt;</code> 标准接口集成，不侵入 Core。</p><h3 id="mokframework-serilog-—-serilog-日志集成" tabindex="-1"><a class="header-anchor" href="#mokframework-serilog-—-serilog-日志集成"><span>MokFramework.Serilog — Serilog 日志集成</span></a></h3><p><strong>NuGet 依赖</strong>：Serilog.AspNetCore 9.x<br><strong>职责</strong>：</p><ul><li><code>builder.Host.UseMokSerilog()</code> — 一行代码切换到 Serilog</li><li><code>MokFrameworkSerilogModule</code> — 标记模块</li></ul><p><strong>设计关键</strong>：薄包装层，保留 Serilog 原生的配置灵活性。</p><h3 id="mokframework-demo-—-演示应用" tabindex="-1"><a class="header-anchor" href="#mokframework-demo-—-演示应用"><span>MokFramework.Demo — 演示应用</span></a></h3><p><strong>项目引用</strong>：仅引用 MokFramework.Core<br><strong>职责</strong>：</p><ul><li>演示控制台应用的完整生命周期</li><li>演示三种 DI 注册方式（标记接口 / [Dependency] 特性 / 手动注册）</li><li>演示模块依赖和 Options 模式</li></ul><h2 id="slnx-解决方案文件" tabindex="-1"><a class="header-anchor" href="#slnx-解决方案文件"><span>slnx 解决方案文件</span></a></h2><p>MokFramework 使用 .NET 的新 slnx 格式（XML-based），比传统的 .sln 更简洁：</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-xml"><span class="line"><span style="color:#ABB2BF;">&lt;</span><span style="color:#E06C75;">Solution</span><span style="color:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">  &lt;</span><span style="color:#E06C75;">Project</span><span style="color:#D19A66;"> Path</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">&quot;MokFramework.Core/MokFramework.Core.csproj&quot;</span><span style="color:#ABB2BF;"> /&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">  &lt;</span><span style="color:#E06C75;">Project</span><span style="color:#D19A66;"> Path</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">&quot;MokFramework.AspNetCore/MokFramework.AspNetCore.csproj&quot;</span><span style="color:#ABB2BF;"> /&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">  &lt;</span><span style="color:#E06C75;">Project</span><span style="color:#D19A66;"> Path</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">&quot;MokFramework.Autofac/MokFramework.Autofac.csproj&quot;</span><span style="color:#ABB2BF;"> /&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">  &lt;</span><span style="color:#E06C75;">Project</span><span style="color:#D19A66;"> Path</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">&quot;MokFramework.Serilog/MokFramework.Serilog.csproj&quot;</span><span style="color:#ABB2BF;"> /&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">  &lt;</span><span style="color:#E06C75;">Project</span><span style="color:#D19A66;"> Path</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">&quot;MokFramework.Demo/MokFramework.Demo.csproj&quot;</span><span style="color:#ABB2BF;"> /&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">&lt;/</span><span style="color:#E06C75;">Solution</span><span style="color:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="搭建步骤概览" tabindex="-1"><a class="header-anchor" href="#搭建步骤概览"><span>搭建步骤概览</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Step 1: 创建 MokFramework.Core 项目</span></span>
<span class="line"><span>        ├── 定义模块接口 (IMokFrameworkModule)</span></span>
<span class="line"><span>        ├── 实现模块基类 (MokFrameworkModule)</span></span>
<span class="line"><span>        ├── 实现模块加载器 (ModuleLoader) — 递归发现 + 拓扑排序</span></span>
<span class="line"><span>        ├── 实现模块管理器 (ModuleManager) — 生命周期管理</span></span>
<span class="line"><span>        ├── 定义标记接口 (ITransientDependency 等)</span></span>
<span class="line"><span>        ├── 定义 DI 特性 ([Dependency], [ExposeServices])</span></span>
<span class="line"><span>        └── 实现约定注册器 (ConventionalRegistrar) — 程序集扫描</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 2: 实现 Application 类层次</span></span>
<span class="line"><span>        ├── IMokFrameworkApplication — 顶层接口</span></span>
<span class="line"><span>        ├── MokFrameworkApplicationBase — 抽象基类</span></span>
<span class="line"><span>        ├── MokFrameworkApplicationWithInternalServiceProvider — 控制台模式</span></span>
<span class="line"><span>        ├── MokFrameworkApplicationWithExternalServiceProvider — ASP.NET Core 模式</span></span>
<span class="line"><span>        └── MokFrameworkApplication — 静态工厂</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 3: 创建 MokFramework.AspNetCore 项目</span></span>
<span class="line"><span>        ├── WebApplicationBuilderExtensions</span></span>
<span class="line"><span>        ├── ApplicationBuilderExtensions</span></span>
<span class="line"><span>        ├── HostBuilderExtensions</span></span>
<span class="line"><span>        └── MokFrameworkAspNetCoreModule</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 4: 创建 MokFramework.Autofac 项目</span></span>
<span class="line"><span>        ├── MokFrameworkAutofacServiceProviderFactory</span></span>
<span class="line"><span>        ├── AutofacHostBuilderExtensions</span></span>
<span class="line"><span>        └── MokFrameworkAutofacModule</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 5: 创建 MokFramework.Serilog 项目</span></span>
<span class="line"><span>        ├── SerilogHostBuilderExtensions</span></span>
<span class="line"><span>        └── MokFrameworkSerilogModule</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 6: 创建 MokFramework.Demo 验证</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,32)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};