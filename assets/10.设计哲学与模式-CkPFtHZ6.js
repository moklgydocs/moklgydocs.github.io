import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-UOI3jH6P.js";var i=JSON.parse(`{"path":"/%E5%90%8E%E7%AB%AF%E5%BC%80%E5%8F%91/ASP.NET_Core/%E6%8F%90%E9%97%AE%E5%BC%8F%E5%AD%A6%E4%B9%A0asp.netcore/10.%E8%AE%BE%E8%AE%A1%E5%93%B2%E5%AD%A6%E4%B8%8E%E6%A8%A1%E5%BC%8F.html","title":"设计哲学与模式","lang":"zh-CN","frontmatter":{"title":"设计哲学与模式","date":"2025-04-09T00:00:00.000Z","category":["ASP.NET_Core"],"tag":["asp.netcore","设计模式","设计哲学"],"author":"Moklgy","order":10},"git":{"createdTime":1776074807000,"updatedTime":1776074807000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":38.84,"words":11653},"filePathRelative":"后端开发/ASP.NET_Core/提问式学习asp.netcore/10.设计哲学与模式.md","excerpt":"\\n<hr>\\n<h2>一、核心设计哲学</h2>\\n<blockquote>\\n<p><strong><a href=\\"http://ASP.NET\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">ASP.NET</a> Core 的整个框架就是围绕一个核心理念构建的：</strong><br>\\n<strong>\\"一切皆服务，一切皆可替换，一切皆可组合\\"</strong></p>\\n</blockquote>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"\\" style=\\"background-color:#282c34;color:#abb2bf\\"><pre class=\\"shiki one-dark-pro vp-code\\"><code class=\\"language-\\"><span class=\\"line\\"><span>┌──────────────────────────────────────────────────────────────────────────┐</span></span>\\n<span class=\\"line\\"><span>│                                                                          │</span></span>\\n<span class=\\"line\\"><span>│                    ASP.NET Core 四大设计哲学                               │</span></span>\\n<span class=\\"line\\"><span>│                                                                          │</span></span>\\n<span class=\\"line\\"><span>│  ┌─────────────────────────────────────────────────────────────────────┐ │</span></span>\\n<span class=\\"line\\"><span>│  │                                                                     │ │</span></span>\\n<span class=\\"line\\"><span>│  │  1. 依赖倒置（Dependency Inversion）                                 │ │</span></span>\\n<span class=\\"line\\"><span>│  │     \\"高层模块不依赖低层模块，都依赖抽象\\"                               │ │</span></span>\\n<span class=\\"line\\"><span>│  │                                                                     │ │</span></span>\\n<span class=\\"line\\"><span>│  │     Controller 不依赖 EF Core                                       │ │</span></span>\\n<span class=\\"line\\"><span>│  │     Controller 依赖 IUserRepository                                 │ │</span></span>\\n<span class=\\"line\\"><span>│  │     EF Core 实现 IUserRepository                                    │ │</span></span>\\n<span class=\\"line\\"><span>│  │     → 可以随时替换为 Dapper、MongoDB、Mock                           │ │</span></span>\\n<span class=\\"line\\"><span>│  │                                                                     │ │</span></span>\\n<span class=\\"line\\"><span>│  │  2. 组合优于继承（Composition over Inheritance）                      │ │</span></span>\\n<span class=\\"line\\"><span>│  │     \\"不要通过继承扩展功能，而是通过组合\\"                                │ │</span></span>\\n<span class=\\"line\\"><span>│  │                                                                     │ │</span></span>\\n<span class=\\"line\\"><span>│  │     中间件管道 = 组合一系列独立的中间件                                │ │</span></span>\\n<span class=\\"line\\"><span>│  │     不是一个巨大的 HttpHandler 基类                                   │ │</span></span>\\n<span class=\\"line\\"><span>│  │     每个中间件只关心自己的职责                                         │ │</span></span>\\n<span class=\\"line\\"><span>│  │                                                                     │ │</span></span>\\n<span class=\\"line\\"><span>│  │  3. 约定优于配置（Convention over Configuration）                     │ │</span></span>\\n<span class=\\"line\\"><span>│  │     \\"合理的默认值，减少样板代码\\"                                       │ │</span></span>\\n<span class=\\"line\\"><span>│  │                                                                     │ │</span></span>\\n<span class=\\"line\\"><span>│  │     Controller 名称自动去掉 \\"Controller\\" 后缀作为路由                  │ │</span></span>\\n<span class=\\"line\\"><span>│  │     appsettings.json 自动加载                                        │ │</span></span>\\n<span class=\\"line\\"><span>│  │     [ApiController] 自动开启模型验证                                  │ │</span></span>\\n<span class=\\"line\\"><span>│  │                                                                     │ │</span></span>\\n<span class=\\"line\\"><span>│  │  4. 显式优于隐式（Explicit over Implicit）                            │ │</span></span>\\n<span class=\\"line\\"><span>│  │     \\"你必须明确注册服务、明确添加中间件\\"                                │ │</span></span>\\n<span class=\\"line\\"><span>│  │                                                                     │ │</span></span>\\n<span class=\\"line\\"><span>│  │     services.AddAuthentication()  → 显式注册                         │ │</span></span>\\n<span class=\\"line\\"><span>│  │     app.UseAuthentication()       → 显式启用                         │ │</span></span>\\n<span class=\\"line\\"><span>│  │     不注册就没有 → 不会有\\"魔法\\"行为                                   │ │</span></span>\\n<span class=\\"line\\"><span>│  │                                                                     │ │</span></span>\\n<span class=\\"line\\"><span>│  └─────────────────────────────────────────────────────────────────────┘ │</span></span>\\n<span class=\\"line\\"><span>│                                                                          │</span></span>\\n<span class=\\"line\\"><span>└──────────────────────────────────────────────────────────────────────────┘</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>"}`),a={name:`10.设计哲学与模式.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="asp-net-core-设计哲学与模式" tabindex="-1"><a class="header-anchor" href="#asp-net-core-设计哲学与模式"><span><a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core 设计哲学与模式</span></a></h1><hr><h2 id="一、核心设计哲学" tabindex="-1"><a class="header-anchor" href="#一、核心设计哲学"><span>一、核心设计哲学</span></a></h2><blockquote><p><strong><a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core 的整个框架就是围绕一个核心理念构建的：</strong><br><strong>&quot;一切皆服务，一切皆可替换，一切皆可组合&quot;</strong></p></blockquote><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│                    ASP.NET Core 四大设计哲学                               │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  ┌─────────────────────────────────────────────────────────────────────┐ │</span></span>
<span class="line"><span>│  │                                                                     │ │</span></span>
<span class="line"><span>│  │  1. 依赖倒置（Dependency Inversion）                                 │ │</span></span>
<span class="line"><span>│  │     &quot;高层模块不依赖低层模块，都依赖抽象&quot;                               │ │</span></span>
<span class="line"><span>│  │                                                                     │ │</span></span>
<span class="line"><span>│  │     Controller 不依赖 EF Core                                       │ │</span></span>
<span class="line"><span>│  │     Controller 依赖 IUserRepository                                 │ │</span></span>
<span class="line"><span>│  │     EF Core 实现 IUserRepository                                    │ │</span></span>
<span class="line"><span>│  │     → 可以随时替换为 Dapper、MongoDB、Mock                           │ │</span></span>
<span class="line"><span>│  │                                                                     │ │</span></span>
<span class="line"><span>│  │  2. 组合优于继承（Composition over Inheritance）                      │ │</span></span>
<span class="line"><span>│  │     &quot;不要通过继承扩展功能，而是通过组合&quot;                                │ │</span></span>
<span class="line"><span>│  │                                                                     │ │</span></span>
<span class="line"><span>│  │     中间件管道 = 组合一系列独立的中间件                                │ │</span></span>
<span class="line"><span>│  │     不是一个巨大的 HttpHandler 基类                                   │ │</span></span>
<span class="line"><span>│  │     每个中间件只关心自己的职责                                         │ │</span></span>
<span class="line"><span>│  │                                                                     │ │</span></span>
<span class="line"><span>│  │  3. 约定优于配置（Convention over Configuration）                     │ │</span></span>
<span class="line"><span>│  │     &quot;合理的默认值，减少样板代码&quot;                                       │ │</span></span>
<span class="line"><span>│  │                                                                     │ │</span></span>
<span class="line"><span>│  │     Controller 名称自动去掉 &quot;Controller&quot; 后缀作为路由                  │ │</span></span>
<span class="line"><span>│  │     appsettings.json 自动加载                                        │ │</span></span>
<span class="line"><span>│  │     [ApiController] 自动开启模型验证                                  │ │</span></span>
<span class="line"><span>│  │                                                                     │ │</span></span>
<span class="line"><span>│  │  4. 显式优于隐式（Explicit over Implicit）                            │ │</span></span>
<span class="line"><span>│  │     &quot;你必须明确注册服务、明确添加中间件&quot;                                │ │</span></span>
<span class="line"><span>│  │                                                                     │ │</span></span>
<span class="line"><span>│  │     services.AddAuthentication()  → 显式注册                         │ │</span></span>
<span class="line"><span>│  │     app.UseAuthentication()       → 显式启用                         │ │</span></span>
<span class="line"><span>│  │     不注册就没有 → 不会有&quot;魔法&quot;行为                                   │ │</span></span>
<span class="line"><span>│  │                                                                     │ │</span></span>
<span class="line"><span>│  └─────────────────────────────────────────────────────────────────────┘ │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="二、builder-模式-——-贯穿整个框架的核心模式" tabindex="-1"><a class="header-anchor" href="#二、builder-模式-——-贯穿整个框架的核心模式"><span>二、Builder 模式 —— 贯穿整个框架的核心模式</span></a></h2><h3 id="_2-1-builder-模式的本质" tabindex="-1"><a class="header-anchor" href="#_2-1-builder-模式的本质"><span>2.1 Builder 模式的本质</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Builder模式的目的：</span></span>
<span class="line"><span>  将一个复杂对象的&quot;配置过程&quot;和&quot;构建结果&quot;分离</span></span>
<span class="line"><span>  配置阶段可以灵活修改，构建后不可变</span></span>
<span class="line"><span></span></span>
<span class="line"><span>在ASP.NET Core中的体现：</span></span>
<span class="line"><span>  &quot;配置阶段&quot; = 你在 Program.cs 中写的所有代码</span></span>
<span class="line"><span>  &quot;构建结果&quot; = Build() 之后生成的不可变运行时对象</span></span>
<span class="line"><span>  &quot;冻结点&quot;   = Build() 方法调用的那一刻</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-所有-builder-模式的统一结构" tabindex="-1"><a class="header-anchor" href="#_2-2-所有-builder-模式的统一结构"><span>2.2 所有 Builder 模式的统一结构</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│           Builder 模式在 ASP.NET Core 中的全面应用                        │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  ┌──────────────────────────────────────────────────────────────────┐    │</span></span>
<span class="line"><span>│  │                                                                  │    │</span></span>
<span class="line"><span>│  │  WebApplicationBuilder                                           │    │</span></span>
<span class="line"><span>│  │  ├── 可变阶段: builder.Services.Add(), builder.Configuration     │    │</span></span>
<span class="line"><span>│  │  ├── Build()  → WebApplication (不可变)                          │    │</span></span>
<span class="line"><span>│  │  └── 冻结: DI容器密封，配置固化                                    │    │</span></span>
<span class="line"><span>│  │                                                                  │    │</span></span>
<span class="line"><span>│  │  ApplicationBuilder (中间件管道)                                  │    │</span></span>
<span class="line"><span>│  │  ├── 可变阶段: app.Use(), app.Map()                              │    │</span></span>
<span class="line"><span>│  │  ├── Build()  → RequestDelegate (不可变函数链)                    │    │</span></span>
<span class="line"><span>│  │  └── 冻结: 中间件顺序固定                                         │    │</span></span>
<span class="line"><span>│  │                                                                  │    │</span></span>
<span class="line"><span>│  │  AuthorizationPolicyBuilder                                      │    │</span></span>
<span class="line"><span>│  │  ├── 可变阶段: .RequireRole(), .RequireClaim()                   │    │</span></span>
<span class="line"><span>│  │  ├── Build()  → AuthorizationPolicy (不可变)                     │    │</span></span>
<span class="line"><span>│  │  └── 冻结: Requirements列表固定                                   │    │</span></span>
<span class="line"><span>│  │                                                                  │    │</span></span>
<span class="line"><span>│  │  AuthenticationBuilder                                           │    │</span></span>
<span class="line"><span>│  │  ├── 可变阶段: .AddJwtBearer(), .AddCookie()                     │    │</span></span>
<span class="line"><span>│  │  ├── 隐式Build (注册到DI)                                        │    │</span></span>
<span class="line"><span>│  │  └── 冻结: 认证方案列表固定                                       │    │</span></span>
<span class="line"><span>│  │                                                                  │    │</span></span>
<span class="line"><span>│  │  OpenIddictBuilder                                               │    │</span></span>
<span class="line"><span>│  │  ├── 可变阶段: .AddServer(), .AddValidation()                    │    │</span></span>
<span class="line"><span>│  │  ├── 隐式Build (注册到DI)                                        │    │</span></span>
<span class="line"><span>│  │  └── 冻结: 端点/密钥/客户端配置固定                                │    │</span></span>
<span class="line"><span>│  │                                                                  │    │</span></span>
<span class="line"><span>│  │  HostBuilder                                                     │    │</span></span>
<span class="line"><span>│  │  ├── 可变阶段: .ConfigureServices(), .ConfigureLogging()         │    │</span></span>
<span class="line"><span>│  │  ├── Build()  → IHost (不可变)                                   │    │</span></span>
<span class="line"><span>│  │  └── 冻结: 所有宿主配置固定                                       │    │</span></span>
<span class="line"><span>│  │                                                                  │    │</span></span>
<span class="line"><span>│  │  ConfigurationBuilder                                            │    │</span></span>
<span class="line"><span>│  │  ├── 可变阶段: .AddJsonFile(), .AddEnvironmentVariables()        │    │</span></span>
<span class="line"><span>│  │  ├── Build()  → IConfigurationRoot (不可变快照)                   │    │</span></span>
<span class="line"><span>│  │  └── 冻结: 配置源列表固定                                         │    │</span></span>
<span class="line"><span>│  │                                                                  │    │</span></span>
<span class="line"><span>│  │  ServiceCollection (也是Builder)                                 │    │</span></span>
<span class="line"><span>│  │  ├── 可变阶段: .AddSingleton(), .AddScoped()                     │    │</span></span>
<span class="line"><span>│  │  ├── BuildServiceProvider() → ServiceProvider (不可变)            │    │</span></span>
<span class="line"><span>│  │  └── 冻结: 服务注册表固定                                         │    │</span></span>
<span class="line"><span>│  │                                                                  │    │</span></span>
<span class="line"><span>│  └──────────────────────────────────────────────────────────────────┘    │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  统一模式：                                                              │</span></span>
<span class="line"><span>│  1. 创建 Builder (可变容器)                                               │</span></span>
<span class="line"><span>│  2. 通过方法链配置 Builder                                                │</span></span>
<span class="line"><span>│  3. 调用 Build() 生成不可变产品                                           │</span></span>
<span class="line"><span>│  4. 产品一旦生成，配置不可修改                                             │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-实现一个简化版-builder-来理解本质" tabindex="-1"><a class="header-anchor" href="#_2-3-实现一个简化版-builder-来理解本质"><span>2.3 实现一个简化版 Builder 来理解本质</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// ========== 极简 Builder 模式 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 可变配置阶段</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> PipelineBuilder</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 可变列表 — 构建阶段可以随意增删</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> List</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">Func</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">RequestDelegate</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">RequestDelegate</span><span style="color:#ABB2BF;">&gt;&gt; </span><span style="color:#E06C75;">_middlewares</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new();</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 配置方法（返回自身，支持链式调用）</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> PipelineBuilder</span><span style="color:#61AFEF;"> Use</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Func</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">RequestDelegate</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">RequestDelegate</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">middleware</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        _middlewares</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Add</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">middleware</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> this</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 Build() — 冻结点</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> RequestDelegate</span><span style="color:#61AFEF;"> Build</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 末端：404</span></span>
<span class="line"><span style="color:#E5C07B;">        RequestDelegate</span><span style="color:#E06C75;"> pipeline</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Response</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StatusCode</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 404</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">CompletedTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 倒序套娃 → 生成不可变的函数链</span></span>
<span class="line"><span style="color:#C678DD;">        for</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">int</span><span style="color:#E06C75;"> i</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _middlewares</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Count</span><span style="color:#56B6C2;"> -</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;"> &gt;=</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;">--</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E06C75;">            pipeline</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _middlewares</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">i</span><span style="color:#ABB2BF;">](</span><span style="color:#E06C75;">pipeline</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 返回的 RequestDelegate 是不可变的</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 你无法再修改中间件的顺序或增删中间件</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> pipeline</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 使用：</span></span>
<span class="line"><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> builder</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">PipelineBuilder</span><span style="color:#ABB2BF;">();         </span><span style="color:#7F848E;font-style:italic;">// 创建Builder</span></span>
<span class="line"><span style="color:#E5C07B;">builder</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Use</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">next</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#C678DD;">async</span><span style="color:#E5C07B;"> ctx</span><span style="color:#ABB2BF;"> =&gt; {           </span><span style="color:#7F848E;font-style:italic;">// 配置</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Before A&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    await </span><span style="color:#61AFEF;">next</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ctx</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;After A&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">});</span></span>
<span class="line"><span style="color:#E5C07B;">builder</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Use</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">next</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#C678DD;">async</span><span style="color:#E5C07B;"> ctx</span><span style="color:#ABB2BF;"> =&gt; {           </span><span style="color:#7F848E;font-style:italic;">// 配置</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Before B&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    await </span><span style="color:#61AFEF;">next</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ctx</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;After B&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">});</span></span>
<span class="line"><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> pipeline</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> builder</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Build</span><span style="color:#ABB2BF;">();              </span><span style="color:#7F848E;font-style:italic;">// Build → 冻结</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// pipeline 是一个固定的函数：A(B(404))</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 无法再改变</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ❌ 以下操作不可能：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// pipeline.InsertMiddleware(...)  → 没有这个方法</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// pipeline.RemoveMiddleware(...)  → 没有这个方法</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-为什么要冻结" tabindex="-1"><a class="header-anchor" href="#_2-4-为什么要冻结"><span>2.4 为什么要冻结？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>为什么 Build() 之后要变成不可变？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 线程安全</span></span>
<span class="line"><span>   Build之后，管道在多线程中被并发调用</span></span>
<span class="line"><span>   如果可变 → 需要加锁 → 性能灾难</span></span>
<span class="line"><span>   不可变 → 无需加锁 → 极高性能</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 可预测性</span></span>
<span class="line"><span>   管道的行为在 Build 时就完全确定了</span></span>
<span class="line"><span>   运行时不会有&quot;突然插入一个中间件&quot;的意外</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 优化机会</span></span>
<span class="line"><span>   DI容器冻结后可以预计算依赖图</span></span>
<span class="line"><span>   路由系统冻结后可以构建DFA</span></span>
<span class="line"><span>   不可变才能做这些优化</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 调试友好</span></span>
<span class="line"><span>   出问题时，管道结构是固定的</span></span>
<span class="line"><span>   不存在&quot;某个时刻中间件顺序变了&quot;的问题</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SSO项目中的体现：</span></span>
<span class="line"><span>  OpenIddict 的配置在 Build() 后冻结</span></span>
<span class="line"><span>  → 端点URI、签名密钥、客户端配置都固定了</span></span>
<span class="line"><span>  → 运行时不能动态添加新的OAuth端点</span></span>
<span class="line"><span>  → 如果需要修改，必须重启应用（或使用热更新机制）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、责任链模式-chain-of-responsibility-——-中间件管道" tabindex="-1"><a class="header-anchor" href="#三、责任链模式-chain-of-responsibility-——-中间件管道"><span>三、责任链模式（Chain of Responsibility）—— 中间件管道</span></a></h2><h3 id="_3-1-模式识别" tabindex="-1"><a class="header-anchor" href="#_3-1-模式识别"><span>3.1 模式识别</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>经典责任链模式：</span></span>
<span class="line"><span>  请求沿着处理者链传递</span></span>
<span class="line"><span>  每个处理者决定是处理请求还是传递给下一个</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ASP.NET Core 中间件 = 责任链模式的完美实现</span></span>
<span class="line"><span></span></span>
<span class="line"><span>每个中间件有三个选择：</span></span>
<span class="line"><span>  1. 处理并传递 → await next(context)</span></span>
<span class="line"><span>  2. 短路         → 不调用 next</span></span>
<span class="line"><span>  3. 修改并传递   → 修改 context 后调用 next</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-两层责任链" tabindex="-1"><a class="header-anchor" href="#_3-2-两层责任链"><span>3.2 两层责任链</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  ASP.NET Core 中有两层责任链                                              │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  ═══════════════════════════════════════════════════════                  │</span></span>
<span class="line"><span>│  第一层：请求中间件管道（每个HTTP请求经过）                                │</span></span>
<span class="line"><span>│  ═══════════════════════════════════════════════════════                  │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  ForwardedHeaders → ExceptionHandler → Routing → Auth → AuthZ → Endpoint│</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  每个中间件：                                                             │</span></span>
<span class="line"><span>│  async Task Invoke(HttpContext context)                                   │</span></span>
<span class="line"><span>│  {                                                                       │</span></span>
<span class="line"><span>│      // 前处理                                                            │</span></span>
<span class="line"><span>│      await _next(context);  // 传递给下一个                               │</span></span>
<span class="line"><span>│      // 后处理                                                            │</span></span>
<span class="line"><span>│  }                                                                       │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  ═══════════════════════════════════════════════════════                  │</span></span>
<span class="line"><span>│  第二层：认证Handler链（认证中间件内部）                                   │</span></span>
<span class="line"><span>│  ═══════════════════════════════════════════════════════                  │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  OpenIddictHandler → [其他RequestHandler] → 默认认证                     │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  每个 IAuthenticationRequestHandler：                                     │</span></span>
<span class="line"><span>│  async Task&lt;bool&gt; HandleRequestAsync()                                   │</span></span>
<span class="line"><span>│  {                                                                       │</span></span>
<span class="line"><span>│      if (能处理) { 处理; return true; }   // 短路                         │</span></span>
<span class="line"><span>│      return false;                        // 传递给下一个                  │</span></span>
<span class="line"><span>│  }                                                                       │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  ═══════════════════════════════════════════════════════                  │</span></span>
<span class="line"><span>│  还有第三层：授权Handler链（授权系统内部）                                 │</span></span>
<span class="line"><span>│  ═══════════════════════════════════════════════════════                  │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  PassThroughHandler → ScopeHandler → PermissionHandler → ...             │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  每个 IAuthorizationHandler：                                             │</span></span>
<span class="line"><span>│  async Task HandleAsync(AuthorizationHandlerContext context)              │</span></span>
<span class="line"><span>│  {                                                                       │</span></span>
<span class="line"><span>│      foreach (var req in context.Requirements.OfType&lt;MyRequirement&gt;())   │</span></span>
<span class="line"><span>│          if (满足条件) context.Succeed(req);                              │</span></span>
<span class="line"><span>│  }                                                                       │</span></span>
<span class="line"><span>│  → 和前两层不同：不是短路模式，是&quot;投票&quot;模式                               │</span></span>
<span class="line"><span>│  → 所有Handler都执行，每个可以Succeed某个Requirement                      │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-责任链的变体——asp-net-core-中间件-vs-经典责任链" tabindex="-1"><a class="header-anchor" href="#_3-3-责任链的变体——asp-net-core-中间件-vs-经典责任链"><span>3.3 责任链的变体——<a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core 中间件 vs 经典责任链</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// ============ 经典责任链 ============</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 每个处理者有一个 next 指针</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 处理者决定是否传递给 next</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">abstract</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> Handler</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#E5C07B;"> Handler</span><span style="color:#ABB2BF;">? </span><span style="color:#E06C75;">_next</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> void</span><span style="color:#61AFEF;"> SetNext</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Handler</span><span style="color:#E5C07B;"> next</span><span style="color:#ABB2BF;">) =&gt; </span><span style="color:#E06C75;">_next</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> next</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> virtual</span><span style="color:#C678DD;"> void</span><span style="color:#61AFEF;"> Handle</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Request</span><span style="color:#E5C07B;"> request</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        _next</span><span style="color:#ABB2BF;">?.</span><span style="color:#61AFEF;">Handle</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">request</span><span style="color:#ABB2BF;">);  </span><span style="color:#7F848E;font-style:italic;">// 默认传递</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ============ ASP.NET Core 中间件的独特之处 ============</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 不是继承，而是函数组合</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// next 不是指针，而是闭包中捕获的委托</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 🔥 关键区别：ASP.NET Core 的责任链是&quot;双向&quot;的</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 经典责任链：请求单向传递</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ASP.NET Core：请求传递下去，响应冒泡回来</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Use</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">async</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">context</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">next</span><span style="color:#ABB2BF;">) =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ===== 请求方向（Request 阶段）=====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 请求从上往下流</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;A: 请求进入&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    await </span><span style="color:#61AFEF;">next</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">);  </span><span style="color:#7F848E;font-style:italic;">// 传递给下一个</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ===== 响应方向（Response 阶段）=====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 响应从下往上冒泡</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;A: 响应返回&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Use</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">async</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">context</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">next</span><span style="color:#ABB2BF;">) =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;B: 请求进入&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    await </span><span style="color:#61AFEF;">next</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;B: 响应返回&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 执行顺序：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// A: 请求进入  ↓</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// B: 请求进入  ↓</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// (Endpoint执行)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// B: 响应返回  ↑</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// A: 响应返回  ↑</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 这和经典责任链完全不同</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 这更像是&quot;洋葱模型&quot;或&quot;俄罗斯套娃&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>中间件的洋葱模型：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请求 ─►  ┌─────────────────────────────────────────────┐</span></span>
<span class="line"><span>         │ ForwardedHeaders                              │</span></span>
<span class="line"><span>         │   ┌─────────────────────────────────────────┐ │</span></span>
<span class="line"><span>         │   │ ExceptionHandler                        │ │</span></span>
<span class="line"><span>         │   │   ┌─────────────────────────────────┐   │ │</span></span>
<span class="line"><span>         │   │   │ Routing                         │   │ │</span></span>
<span class="line"><span>         │   │   │   ┌─────────────────────────┐   │   │ │</span></span>
<span class="line"><span>         │   │   │   │ Authentication           │   │   │ │</span></span>
<span class="line"><span>         │   │   │   │   ┌─────────────────┐   │   │   │ │</span></span>
<span class="line"><span>         │   │   │   │   │ Authorization   │   │   │   │ │</span></span>
<span class="line"><span>         │   │   │   │   │   ┌─────────┐   │   │   │   │ │</span></span>
<span class="line"><span>         │   │   │   │   │   │Endpoint │   │   │   │   │ │</span></span>
<span class="line"><span>         │   │   │   │   │   │(核心)    │   │   │   │   │ │</span></span>
<span class="line"><span>         │   │   │   │   │   └─────────┘   │   │   │   │ │</span></span>
<span class="line"><span>         │   │   │   │   └─────────────────┘   │   │   │ │</span></span>
<span class="line"><span>         │   │   │   └─────────────────────────┘   │   │ │</span></span>
<span class="line"><span>         │   │   └─────────────────────────────────┘   │ │</span></span>
<span class="line"><span>         │   └─────────────────────────────────────────┘ │</span></span>
<span class="line"><span>         └─────────────────────────────────────────────────┘ ─► 响应</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ExceptionHandler 利用了&quot;后处理&quot;阶段：</span></span>
<span class="line"><span>  try </span></span>
<span class="line"><span>  { </span></span>
<span class="line"><span>      await next(context);    // 让内层执行</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (Exception ex)        // 内层抛异常时捕获</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>      // 处理异常 → 返回500页面</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>如果没有洋葱模型（单向责任链），</span></span>
<span class="line"><span>ExceptionHandler 就无法捕获后续中间件的异常！</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、策略模式-strategy-——-运行时可替换行为" tabindex="-1"><a class="header-anchor" href="#四、策略模式-strategy-——-运行时可替换行为"><span>四、策略模式（Strategy）—— 运行时可替换行为</span></a></h2><h3 id="_4-1-认证系统中的策略模式" tabindex="-1"><a class="header-anchor" href="#_4-1-认证系统中的策略模式"><span>4.1 认证系统中的策略模式</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 认证系统是策略模式的经典应用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// IAuthenticationHandler 定义了策略接口</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 不同的认证方案是不同的策略实现</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ┌─────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │                    策略接口                               │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │                                                         │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  IAuthenticationHandler                                  │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  ├── AuthenticateAsync()  → 验证身份                     │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  ├── ChallengeAsync()     → 质询（要求认证）              │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  └── ForbidAsync()        → 拒绝（已认证但无权限）        │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │                                                         │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ├─────────────── 策略实现 ─────────────────────────────────┤</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │                                                         │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  CookieAuthenticationHandler (Cookie策略)                │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  ├── Authenticate: 读Cookie → 解密 → ClaimsPrincipal    │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  ├── Challenge: 302 → 登录页                             │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  └── Forbid: 302 → 拒绝页                               │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │                                                         │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  JwtBearerHandler (JWT策略)                              │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  ├── Authenticate: 读Header → 验签 → ClaimsPrincipal    │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  ├── Challenge: 401 + WWW-Authenticate                   │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  └── Forbid: 403                                        │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │                                                         │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  OpenIddictServerHandler (OpenIddict策略)                │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  ├── Authenticate: 验证OAuth请求参数                      │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  ├── Challenge: OAuth错误响应                             │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │  └── Forbid: OAuth拒绝响应                               │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// │                                                         │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// └─────────────────────────────────────────────────────────┘</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 运行时选择哪个策略？由 Scheme 名称决定：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// [Authorize(AuthenticationSchemes = &quot;Bearer&quot;)]  → 使用JWT策略</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// [Authorize(AuthenticationSchemes = &quot;Cookies&quot;)] → 使用Cookie策略</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// [Authorize]                                    → 使用默认策略</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 应用代码不知道也不关心具体用哪种认证方式</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 可以随时替换，不影响Controller代码</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-策略模式在框架中的广泛应用" tabindex="-1"><a class="header-anchor" href="#_4-2-策略模式在框架中的广泛应用"><span>4.2 策略模式在框架中的广泛应用</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                                                                      │</span></span>
<span class="line"><span>│  策略模式在 ASP.NET Core 中的应用（不完全列表）                        │</span></span>
<span class="line"><span>│                                                                      │</span></span>
<span class="line"><span>│  ┌──────────────────────┬──────────────────────────────────────────┐ │</span></span>
<span class="line"><span>│  │ 策略接口              │ 可替换的实现                              │ │</span></span>
<span class="line"><span>│  ├──────────────────────┼──────────────────────────────────────────┤ │</span></span>
<span class="line"><span>│  │ IServer               │ KestrelServer, IISServer, TestServer    │ │</span></span>
<span class="line"><span>│  │ IAuthenticationHandler│ Cookie, JWT, OpenIddict, OAuth, OIDC    │ │</span></span>
<span class="line"><span>│  │ IAuthorizationHandler │ RoleHandler, ScopeHandler, 自定义       │ │</span></span>
<span class="line"><span>│  │ IAuthorizationPolicy  │ DefaultProvider, 自定义Provider          │ │</span></span>
<span class="line"><span>│  │   Provider            │                                        │ │</span></span>
<span class="line"><span>│  │ ILoggerProvider       │ Console, Debug, File, Serilog           │ │</span></span>
<span class="line"><span>│  │ IDistributedCache     │ Memory, Redis, SQL Server               │ │</span></span>
<span class="line"><span>│  │ IDataProtectionProv   │ File, Registry, Azure, Redis            │ │</span></span>
<span class="line"><span>│  │ IConnectionListener   │ SocketTransport, LibuvTransport         │ │</span></span>
<span class="line"><span>│  │   Factory             │                                        │ │</span></span>
<span class="line"><span>│  │ IConfigurationProvider│ JSON, XML, Env, CommandLine, 自定义     │ │</span></span>
<span class="line"><span>│  │ IHostedService        │ BackgroundService, 定时任务, 消息消费    │ │</span></span>
<span class="line"><span>│  │ IOutputFormatter      │ JSON, XML, CSV, 自定义                  │ │</span></span>
<span class="line"><span>│  │ IModelBinder          │ 各种参数绑定策略                         │ │</span></span>
<span class="line"><span>│  │ IRouteConstraint      │ int, guid, regex, 自定义                │ │</span></span>
<span class="line"><span>│  │ ITicketStore          │ Memory, Distributed(Cookie会话存储)     │ │</span></span>
<span class="line"><span>│  │                       │                                        │ │</span></span>
<span class="line"><span>│  │ 📌 SSO项目中：                                                  │ │</span></span>
<span class="line"><span>│  │ IOpenIddictApplication│ EFCore, 自定义存储                      │ │</span></span>
<span class="line"><span>│  │   Store               │                                        │ │</span></span>
<span class="line"><span>│  │ IOpenIddictToken      │ EFCore, 自定义存储                      │ │</span></span>
<span class="line"><span>│  │   Store               │                                        │ │</span></span>
<span class="line"><span>│  └──────────────────────┴──────────────────────────────────────────┘ │</span></span>
<span class="line"><span>│                                                                      │</span></span>
<span class="line"><span>│  替换策略只需要修改DI注册，不需要修改业务代码                          │</span></span>
<span class="line"><span>│                                                                      │</span></span>
<span class="line"><span>│  // 替换缓存实现：Memory → Redis                                      │</span></span>
<span class="line"><span>│  // services.AddDistributedMemoryCache();       // 内存                │</span></span>
<span class="line"><span>│  services.AddStackExchangeRedisCache(options =&gt;  // Redis              │</span></span>
<span class="line"><span>│  {                                                                    │</span></span>
<span class="line"><span>│      options.Configuration = &quot;localhost:6379&quot;;                         │</span></span>
<span class="line"><span>│  });                                                                  │</span></span>
<span class="line"><span>│  // IDistributedCache 的消费者完全不需要改                              │</span></span>
<span class="line"><span>│                                                                      │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-策略模式-工厂模式-scheme-系统" tabindex="-1"><a class="header-anchor" href="#_4-3-策略模式-工厂模式-scheme-系统"><span>4.3 策略模式 + 工厂模式 = Scheme 系统</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 认证系统中，策略模式和工厂模式结合：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// Scheme = 策略名称 → 通过工厂创建对应的Handler实例</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Core/src/AuthenticationScheme.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthenticationScheme</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;"> Name { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }              </span><span style="color:#7F848E;font-style:italic;">// &quot;Bearer&quot;, &quot;Cookies&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;">? DisplayName { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }       </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> Type</span><span style="color:#ABB2BF;"> HandlerType { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }          </span><span style="color:#7F848E;font-style:italic;">// typeof(JwtBearerHandler)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    //         ^^^^^^^^^^^</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    //         这就是策略的类型</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Core/src/AuthenticationHandlerProvider.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthenticationHandlerProvider</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IAuthenticationHandlerProvider</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAuthenticationHandler</span><span style="color:#ABB2BF;">?&gt; </span><span style="color:#61AFEF;">GetHandlerAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> authenticationScheme</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 1. 根据Scheme名称找到Scheme定义</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> scheme</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_schemes</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetSchemeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">authenticationScheme</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // scheme.HandlerType = typeof(JwtBearerHandler)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 2. 🔥 从DI容器创建Handler实例（工厂模式）</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> handler</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RequestServices</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">GetService</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">HandlerType</span><span style="color:#ABB2BF;">) as </span><span style="color:#E5C07B;">IAuthenticationHandler</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 等价于 new JwtBearerHandler(options, logger, encoder)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 3. 初始化Handler</span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#E5C07B;">handler</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">InitializeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> handler</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 策略模式 + 工厂模式的组合：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 策略接口: IAuthenticationHandler</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 策略实现: JwtBearerHandler, CookieAuthHandler, ...</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 策略名称: &quot;Bearer&quot;, &quot;Cookies&quot;, ...</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 工厂:     DI容器 + AuthenticationHandlerProvider</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 选择策略: 由 Scheme 名称在运行时决定</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、options-模式-——-框架级的配置管理" tabindex="-1"><a class="header-anchor" href="#五、options-模式-——-框架级的配置管理"><span>五、Options 模式 —— 框架级的配置管理</span></a></h2><h3 id="_5-1-为什么需要-options-模式" tabindex="-1"><a class="header-anchor" href="#_5-1-为什么需要-options-模式"><span>5.1 为什么需要 Options 模式？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>❌ 直接读取配置的问题：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class TokenService</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    public TokenService(IConfiguration config)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        var issuer = config[&quot;Jwt:Issuer&quot;];          // 字符串键名，容易拼错</span></span>
<span class="line"><span>        var audience = config[&quot;Jwt:Audience&quot;];       // 没有类型安全</span></span>
<span class="line"><span>        var expiry = config[&quot;Jwt:ExpiryMinutes&quot;];    // 需要手动转换类型</span></span>
<span class="line"><span>        var key = config[&quot;Jwt:SigningKey&quot;];           // 没有验证</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>✅ Options 模式：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class JwtOptions</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    public string Issuer { get; set; } = &quot;&quot;;</span></span>
<span class="line"><span>    public string Audience { get; set; } = &quot;&quot;;</span></span>
<span class="line"><span>    public int ExpiryMinutes { get; set; } = 60;</span></span>
<span class="line"><span>    public string SigningKey { get; set; } = &quot;&quot;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class TokenService</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    public TokenService(IOptions&lt;JwtOptions&gt; options)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        var config = options.Value;</span></span>
<span class="line"><span>        //          ^^^^^^^^^^^^</span></span>
<span class="line"><span>        // 强类型、有智能提示、编译检查</span></span>
<span class="line"><span>        // 自动绑定配置文件</span></span>
<span class="line"><span>        // 支持验证</span></span>
<span class="line"><span>        // 支持热更新</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-options-的三种形态" tabindex="-1"><a class="header-anchor" href="#_5-2-options-的三种形态"><span>5.2 Options 的三种形态</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Libraries/Microsoft.Extensions.Options/src/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ============ 1. IOptions&lt;T&gt; — 单例，不更新 ============</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> IOptions</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">out</span><span style="color:#E5C07B;"> TOptions</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#C678DD;">where</span><span style="color:#E5C07B;"> TOptions</span><span style="color:#ABB2BF;"> : </span><span style="color:#C678DD;">class</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    TOptions</span><span style="color:#ABB2BF;"> Value { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 Singleton 生命周期</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 应用启动时读取配置，之后永不更新</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 适合：不需要热更新的配置</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ============ 2. IOptionsSnapshot&lt;T&gt; — 每请求更新 ============</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> IOptionsSnapshot</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">out</span><span style="color:#E5C07B;"> TOptions</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#C678DD;">where</span><span style="color:#E5C07B;"> TOptions</span><span style="color:#ABB2BF;"> : </span><span style="color:#C678DD;">class</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    TOptions</span><span style="color:#ABB2BF;"> Value { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#E5C07B;">    TOptions</span><span style="color:#61AFEF;"> Get</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> name</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 Scoped 生命周期</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 每个HTTP请求开始时读取最新配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 同一个请求内配置一致</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 适合：需要热更新且频率不高的配置</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ============ 3. IOptionsMonitor&lt;T&gt; — 实时更新 + 变更通知 ============</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> IOptionsMonitor</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">out</span><span style="color:#E5C07B;"> TOptions</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#C678DD;">where</span><span style="color:#E5C07B;"> TOptions</span><span style="color:#ABB2BF;"> : </span><span style="color:#C678DD;">class</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    TOptions</span><span style="color:#ABB2BF;"> CurrentValue { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#E5C07B;">    TOptions</span><span style="color:#61AFEF;"> Get</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> name</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">    IDisposable</span><span style="color:#61AFEF;"> OnChange</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Action</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">listener</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 Singleton 生命周期</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 实时反映最新配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 可以注册变更回调</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 适合：需要实时响应配置变化的场景</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>三种 Options 的选择指南：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌─────────────────────────┬───────────┬──────────────────┬─────────────────┐</span></span>
<span class="line"><span>│                         │ IOptions  │ IOptionsSnapshot │ IOptionsMonitor │</span></span>
<span class="line"><span>├─────────────────────────┼───────────┼──────────────────┼─────────────────┤</span></span>
<span class="line"><span>│ 生命周期                 │ Singleton │ Scoped           │ Singleton       │</span></span>
<span class="line"><span>│ 热更新                   │ ❌        │ ✅ 每请求         │ ✅ 实时          │</span></span>
<span class="line"><span>│ 变更通知                 │ ❌        │ ❌               │ ✅ OnChange      │</span></span>
<span class="line"><span>│ 命名Options              │ ❌        │ ✅ Get(name)     │ ✅ Get(name)     │</span></span>
<span class="line"><span>│ 适用场景                 │ 固定配置   │ 业务配置         │ 框架/基础设施    │</span></span>
<span class="line"><span>│                         │           │                  │                 │</span></span>
<span class="line"><span>│ SSO项目中：              │           │                  │                 │</span></span>
<span class="line"><span>│ JWT签名密钥              │ ✅        │                  │                 │</span></span>
<span class="line"><span>│ OpenIddict Server配置    │ ✅        │                  │                 │</span></span>
<span class="line"><span>│ 客户端限流配置           │           │ ✅               │                 │</span></span>
<span class="line"><span>│ Token过期时间            │           │                  │ ✅ 可动态调整    │</span></span>
<span class="line"><span>│ 日志级别                 │           │                  │ ✅ 实时生效      │</span></span>
<span class="line"><span>└─────────────────────────┴───────────┴──────────────────┴─────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-options-模式的内部实现" tabindex="-1"><a class="header-anchor" href="#_5-3-options-模式的内部实现"><span>5.3 Options 模式的内部实现</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 简化版源码</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 第1步：注册配置绑定</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Configure</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">JwtOptions</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E5C07B;">configuration</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetSection</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Jwt&quot;</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 内部做了什么？</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddSingleton</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IConfigureOptions</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">JwtOptions</span><span style="color:#ABB2BF;">&gt;&gt;(</span></span>
<span class="line"><span style="color:#ABB2BF;">    new </span><span style="color:#E5C07B;">NamedConfigureFromConfigurationOptions</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">JwtOptions</span><span style="color:#ABB2BF;">&gt;(</span></span>
<span class="line"><span style="color:#E5C07B;">        Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">DefaultName</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        configuration</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetSection</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Jwt&quot;</span><span style="color:#ABB2BF;">)));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 第2步：解析 IOptions&lt;JwtOptions&gt; 时</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> OptionsFactory</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt; : </span><span style="color:#E5C07B;">IOptionsFactory</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IConfigureOptions</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt;&gt; </span><span style="color:#E06C75;">_setups</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IPostConfigureOptions</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt;&gt; </span><span style="color:#E06C75;">_postSetups</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IValidateOptions</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt;&gt; </span><span style="color:#E06C75;">_validations</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> TOptions</span><span style="color:#61AFEF;"> Create</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> name</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 创建新实例</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> options</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> Activator</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">CreateInstance</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 按顺序执行所有配置</span></span>
<span class="line"><span style="color:#C678DD;">        foreach</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> setup</span><span style="color:#C678DD;"> in</span><span style="color:#E06C75;"> _setups</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">setup</span><span style="color:#ABB2BF;"> is </span><span style="color:#E5C07B;">IConfigureNamedOptions</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E06C75;">namedSetup</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E5C07B;">                namedSetup</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Configure</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">options</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#C678DD;">            else</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E5C07B;">                setup</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Configure</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">options</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 此时 options 已经被配置文件填充</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // options.Issuer = &quot;https://sso.example.com&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // options.ExpiryMinutes = 60</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 执行后配置（可以覆盖或补充）</span></span>
<span class="line"><span style="color:#C678DD;">        foreach</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> post</span><span style="color:#C678DD;"> in</span><span style="color:#E06C75;"> _postSetups</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            post</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">PostConfigure</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">options</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 验证</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> failures</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">List</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#C678DD;">        foreach</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> validate</span><span style="color:#C678DD;"> in</span><span style="color:#E06C75;"> _validations</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> validate</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Validate</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">options</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">result</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Failed</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E5C07B;">                failures</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddRange</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">result</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Failures</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">failures</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Count</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            throw</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">OptionsValidationException</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">typeof</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">), </span><span style="color:#E06C75;">failures</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> options</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-options-的配置层叠" tabindex="-1"><a class="header-anchor" href="#_5-4-options-的配置层叠"><span>5.4 Options 的配置层叠</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 🔥 核心概念：多个配置源可以叠加</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 配置文件提供基础值</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Configure</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">JwtOptions</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E5C07B;">config</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetSection</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Jwt&quot;</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 代码补充或覆盖</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Configure</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">JwtOptions</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E5C07B;">options</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">SigningKey</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> GetKeyFromVault</span><span style="color:#ABB2BF;">();  </span><span style="color:#7F848E;font-style:italic;">// 从密钥库获取</span></span>
<span class="line"><span style="color:#ABB2BF;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// PostConfigure 在所有 Configure 之后执行</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">PostConfigure</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">JwtOptions</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E5C07B;">options</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 确保某些必填项</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">IsNullOrEmpty</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Issuer</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Issuer</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;https://default-issuer.com&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 验证</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddOptions</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">JwtOptions</span><span style="color:#ABB2BF;">&gt;()</span></span>
<span class="line"><span style="color:#ABB2BF;">    .</span><span style="color:#61AFEF;">ValidateDataAnnotations</span><span style="color:#ABB2BF;">()    </span><span style="color:#7F848E;font-style:italic;">// 检查 [Required] 等</span></span>
<span class="line"><span style="color:#ABB2BF;">    .</span><span style="color:#61AFEF;">Validate</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">options</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ExpiryMinutes</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 0</span><span style="color:#56B6C2;"> &amp;&amp;</span><span style="color:#E5C07B;"> options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ExpiryMinutes</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#D19A66;"> 1440</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }, </span><span style="color:#98C379;">&quot;ExpiryMinutes must be between 1 and 1440&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 执行顺序：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 1. Configure (配置文件) → 设置基础值</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 2. Configure (代码)     → 覆盖或补充</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 3. PostConfigure         → 最终调整</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 4. Validate              → 验证</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-5-命名-options" tabindex="-1"><a class="header-anchor" href="#_5-5-命名-options"><span>5.5 命名 Options</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 🔥 同一个类型可以有多个命名实例</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// OpenIddict 和认证系统大量使用这个特性</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 认证系统中：每个 Scheme 有自己的 Options</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddAuthentication</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    .</span><span style="color:#61AFEF;">AddJwtBearer</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Bearer&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">options</span><span style="color:#ABB2BF;"> =&gt;          </span><span style="color:#7F848E;font-style:italic;">// 命名为 &quot;Bearer&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Authority</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;https://sso.example.com&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    })</span></span>
<span class="line"><span style="color:#ABB2BF;">    .</span><span style="color:#61AFEF;">AddJwtBearer</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;InternalApi&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">options</span><span style="color:#ABB2BF;"> =&gt;      </span><span style="color:#7F848E;font-style:italic;">// 命名为 &quot;InternalApi&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Authority</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;https://internal-sso.example.com&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    })</span></span>
<span class="line"><span style="color:#ABB2BF;">    .</span><span style="color:#61AFEF;">AddCookie</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Cookies&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">options</span><span style="color:#ABB2BF;"> =&gt;             </span><span style="color:#7F848E;font-style:italic;">// 命名为 &quot;Cookies&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">LoginPath</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;/Account/Login&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 内部实现：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AddJwtBearer(&quot;Bearer&quot;, ...) 注册了：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// services.Configure&lt;JwtBearerOptions&gt;(&quot;Bearer&quot;, configureAction);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//                                       ^^^^^^^^ 命名</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 当认证系统需要 &quot;Bearer&quot; 方案的配置时：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// optionsSnapshot.Get(&quot;Bearer&quot;)  → 返回 Bearer 方案的 JwtBearerOptions</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// optionsSnapshot.Get(&quot;InternalApi&quot;) → 返回 InternalApi 方案的 JwtBearerOptions</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、观察者模式-observer-——-变更通知" tabindex="-1"><a class="header-anchor" href="#六、观察者模式-observer-——-变更通知"><span>六、观察者模式（Observer）—— 变更通知</span></a></h2><h3 id="_6-1-ioptionsmonitor-ichangetoken" tabindex="-1"><a class="header-anchor" href="#_6-1-ioptionsmonitor-ichangetoken"><span>6.1 IOptionsMonitor + IChangeToken</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// Options 系统的热更新就是观察者模式</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Libraries/Microsoft.Extensions.Options/src/OptionsMonitor.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> OptionsMonitor</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt; : </span><span style="color:#E5C07B;">IOptionsMonitor</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt;, </span><span style="color:#E5C07B;">IDisposable</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IOptionsFactory</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E06C75;">_factory</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> List</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IDisposable</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E06C75;">_registrations</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new();</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> event</span><span style="color:#E5C07B;"> Action</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">&gt;? _onChange;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> OptionsMonitor</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        IOptionsFactory</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">factory</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IOptionsChangeTokenSource</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt;&gt; </span><span style="color:#E5C07B;">sources</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        IOptionsMonitorCache</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">cache</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _factory</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> factory</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _cache</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> cache</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 订阅所有变更源</span></span>
<span class="line"><span style="color:#C678DD;">        foreach</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> source</span><span style="color:#C678DD;"> in</span><span style="color:#E06C75;"> sources</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> registration</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> ChangeToken</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">OnChange</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#ABB2BF;">                () =&gt; </span><span style="color:#E5C07B;">source</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetChangeToken</span><span style="color:#ABB2BF;">(),  </span><span style="color:#7F848E;font-style:italic;">// 获取变更令牌</span></span>
<span class="line"><span style="color:#ABB2BF;">                (</span><span style="color:#E5C07B;">name</span><span style="color:#ABB2BF;">) =&gt;                       </span><span style="color:#7F848E;font-style:italic;">// 变更回调</span></span>
<span class="line"><span style="color:#ABB2BF;">                {</span></span>
<span class="line"><span style="color:#E5C07B;">                    _cache</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">TryRemove</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">);     </span><span style="color:#7F848E;font-style:italic;">// 清除缓存</span></span>
<span class="line"><span style="color:#C678DD;">                    var</span><span style="color:#E06C75;"> options</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> Get</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">);     </span><span style="color:#7F848E;font-style:italic;">// 重新创建</span></span>
<span class="line"><span style="color:#61AFEF;">                    InvokeChanged</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">options</span><span style="color:#ABB2BF;">);</span><span style="color:#7F848E;font-style:italic;">// 通知订阅者</span></span>
<span class="line"><span style="color:#ABB2BF;">                },</span></span>
<span class="line"><span style="color:#E5C07B;">                source</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">            _registrations</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Add</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">registration</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> TOptions</span><span style="color:#ABB2BF;"> CurrentValue =&gt; </span><span style="color:#61AFEF;">Get</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">DefaultName</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> TOptions</span><span style="color:#61AFEF;"> Get</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">name</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        name</span><span style="color:#C678DD;"> ??=</span><span style="color:#E5C07B;"> Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">DefaultName</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 从缓存获取，没有则创建</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> _cache</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetOrAdd</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">, () =&gt; </span><span style="color:#E5C07B;">_factory</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Create</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 外部订阅变更</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> IDisposable</span><span style="color:#61AFEF;"> OnChange</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Action</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">listener</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> disposable</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">ChangeTrackerDisposable</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">this</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">listener</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E06C75;">        _onChange</span><span style="color:#C678DD;"> +=</span><span style="color:#E06C75;"> listener</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> disposable</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> void</span><span style="color:#61AFEF;"> InvokeChanged</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> name</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">TOptions</span><span style="color:#E5C07B;"> options</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        _onChange</span><span style="color:#ABB2BF;">?.</span><span style="color:#61AFEF;">Invoke</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">options</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 使用场景：配置文件热更新</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// appsettings.json 中：</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#98C379;">    &quot;RateLimit&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#98C379;">        &quot;MaxRequests&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;WindowSeconds&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">60</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 注册：</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Configure</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">RateLimitOptions</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E5C07B;">config</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetSection</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;RateLimit&quot;</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 使用（在中间件或服务中）：</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> RateLimitMiddleware</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IOptionsMonitor</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">RateLimitOptions</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E06C75;">_options</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> RateLimitMiddleware</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        RequestDelegate</span><span style="color:#E5C07B;"> next</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        IOptionsMonitor</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">RateLimitOptions</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">options</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _next</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> next</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _options</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> options</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 监听配置变化</span></span>
<span class="line"><span style="color:#E5C07B;">        _options</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">OnChange</span><span style="color:#ABB2BF;">((</span><span style="color:#E5C07B;">newOptions</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">name</span><span style="color:#ABB2BF;">) =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">$&quot;限流配置已更新: MaxRequests=</span><span style="color:#ABB2BF;">{</span><span style="color:#E5C07B;">newOptions</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">MaxRequests</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 实时生效，不需要重启！</span></span>
<span class="line"><span style="color:#ABB2BF;">        });</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> Invoke</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 每次都读取最新配置</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> options</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">CurrentValue</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#61AFEF;">GetRequestCount</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">) </span><span style="color:#56B6C2;">&gt;</span><span style="color:#E5C07B;"> options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">MaxRequests</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Response</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StatusCode</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 429</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#61AFEF;">_next</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-changetoken-模式" tabindex="-1"><a class="header-anchor" href="#_6-2-changetoken-模式"><span>6.2 ChangeToken 模式</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// ChangeToken 是 ASP.NET Core 中观察者模式的基础设施</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Libraries/Microsoft.Extensions.Primitives/src/ChangeToken.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> static</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> ChangeToken</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 核心方法：监听变更</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> IDisposable</span><span style="color:#61AFEF;"> OnChange</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        Func</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IChangeToken</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">changeTokenProducer</span><span style="color:#ABB2BF;">,  </span><span style="color:#7F848E;font-style:italic;">// 产生变更令牌的工厂</span></span>
<span class="line"><span style="color:#E5C07B;">        Action</span><span style="color:#E5C07B;"> changeTokenConsumer</span><span style="color:#ABB2BF;">)              </span><span style="color:#7F848E;font-style:italic;">// 变更时的回调</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 内部实现：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 1. 调用 changeTokenProducer() 获取当前令牌</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 2. 在令牌上注册回调</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 3. 回调触发时：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        //    a. 执行 changeTokenConsumer</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        //    b. 重新调用 changeTokenProducer() 获取新令牌</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        //    c. 在新令牌上注册回调</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        //    → 循环监听</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">ChangeTokenRegistration</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">object</span><span style="color:#ABB2BF;">&gt;(</span></span>
<span class="line"><span style="color:#E06C75;">            changeTokenProducer</span><span style="color:#ABB2BF;">, </span></span>
<span class="line"><span style="color:#ABB2BF;">            (</span><span style="color:#E5C07B;">s</span><span style="color:#ABB2BF;">) =&gt; </span><span style="color:#61AFEF;">changeTokenConsumer</span><span style="color:#ABB2BF;">(), </span></span>
<span class="line"><span style="color:#D19A66;">            null</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// IChangeToken 接口</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> IChangeToken</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    bool</span><span style="color:#ABB2BF;"> HasChanged { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }           </span><span style="color:#7F848E;font-style:italic;">// 是否已变更</span></span>
<span class="line"><span style="color:#C678DD;">    bool</span><span style="color:#ABB2BF;"> ActiveChangeCallbacks { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; } </span><span style="color:#7F848E;font-style:italic;">// 是否支持主动回调</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#E5C07B;">    IDisposable</span><span style="color:#61AFEF;"> RegisterChangeCallback</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        Action</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">object</span><span style="color:#ABB2BF;">?&gt; </span><span style="color:#E5C07B;">callback</span><span style="color:#ABB2BF;">,       </span><span style="color:#7F848E;font-style:italic;">// 变更时调用</span></span>
<span class="line"><span style="color:#C678DD;">        object</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">state</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ChangeToken 在框架中的应用：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 配置文件热更新</span></span>
<span class="line"><span>   FileConfigurationProvider 监视文件变化</span></span>
<span class="line"><span>   → 文件修改 → FileSystemWatcher → ChangeToken 触发</span></span>
<span class="line"><span>   → IOptionsMonitor 清缓存 → 下次读取获取新值</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 路由更新（动态路由）</span></span>
<span class="line"><span>   EndpointDataSource.GetChangeToken()</span></span>
<span class="line"><span>   → 路由表变化 → 通知 DfaMatcher 重建</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. Razor 视图编译</span></span>
<span class="line"><span>   RazorViewEngine 监视 .cshtml 文件变化</span></span>
<span class="line"><span>   → 文件修改 → 重新编译视图</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 缓存失效</span></span>
<span class="line"><span>   MemoryCache 支持 ChangeToken 作为失效触发器</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、适配器模式-adapter-——-桥接不同的api" tabindex="-1"><a class="header-anchor" href="#七、适配器模式-adapter-——-桥接不同的api"><span>七、适配器模式（Adapter）—— 桥接不同的API</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// HttpContext 的 Feature 系统就是适配器模式</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// Kestrel 的原始 API（底层）：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// PipeReader、PipeWriter、字节级操作</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 开发者期望的 API（高层）：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// HttpRequest.Path、HttpResponse.StatusCode、string 级操作</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// DefaultHttpRequest 就是适配器：</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> DefaultHttpRequest</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">HttpRequest</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 将底层的 Feature 适配为高层的 HttpRequest API</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#E5C07B;"> IHttpRequestFeature</span><span style="color:#ABB2BF;"> HttpRequestFeature </span></span>
<span class="line"><span style="color:#ABB2BF;">        =&gt; </span><span style="color:#E5C07B;">_features</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Fetch</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">ref</span><span style="color:#E5C07B;"> _features</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Cache</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Request</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 高层API                         底层Feature</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> override</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;"> Method   =&gt; </span><span style="color:#E5C07B;">HttpRequestFeature</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Method</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> override</span><span style="color:#E5C07B;"> PathString</span><span style="color:#ABB2BF;"> Path =&gt; new </span><span style="color:#E5C07B;">PathString</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">HttpRequestFeature</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Path</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> override</span><span style="color:#E5C07B;"> Stream</span><span style="color:#ABB2BF;"> Body     =&gt; </span><span style="color:#E5C07B;">HttpRequestFeature</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Body</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 开发者用 request.Path 就能获取路径</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 不需要知道底层是 Kestrel 的 IHttpRequestFeature</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 也不需要知道这些数据来自 HTTP 请求行的字节解析</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 另一个适配器：DefaultHttpResponse</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> DefaultHttpResponse</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">HttpResponse</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 将高层的写入操作适配为底层的 PipeWriter</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> override</span><span style="color:#C678DD;"> int</span><span style="color:#ABB2BF;"> StatusCode</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        get</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#E5C07B;">HttpResponseFeature</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StatusCode</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        set</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#E5C07B;">HttpResponseFeature</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StatusCode</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> value</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> override</span><span style="color:#E5C07B;"> Stream</span><span style="color:#ABB2BF;"> Body</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        get</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#E5C07B;">HttpResponseBodyFeature</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Stream</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // Stream 内部写入 PipeWriter → OutputPipe → Socket</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>适配器模式在框架中的更多体现：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌───────────────────┬────────────────────────┬──────────────────────┐</span></span>
<span class="line"><span>│ 高层API            │ 适配器                  │ 底层实现              │</span></span>
<span class="line"><span>├───────────────────┼────────────────────────┼──────────────────────┤</span></span>
<span class="line"><span>│ HttpContext        │ DefaultHttpContext      │ Feature集合          │</span></span>
<span class="line"><span>│ HttpRequest        │ DefaultHttpRequest      │ IHttpRequestFeature  │</span></span>
<span class="line"><span>│ HttpResponse       │ DefaultHttpResponse     │ IHttpResponseFeature │</span></span>
<span class="line"><span>│ IConfiguration     │ ConfigurationRoot       │ 多个Provider         │</span></span>
<span class="line"><span>│ ClaimsPrincipal    │                         │ 多个ClaimsIdentity   │</span></span>
<span class="line"><span>│ ILogger            │ Logger&lt;T&gt;               │ 多个ILoggerProvider  │</span></span>
<span class="line"><span>│ Stream             │ HttpResponseStream      │ PipeWriter           │</span></span>
<span class="line"><span>│ IDistributedCache  │ RedisCache              │ StackExchange.Redis  │</span></span>
<span class="line"><span>│                   │ MemoryDistributedCache   │ IMemoryCache         │</span></span>
<span class="line"><span>└───────────────────┴────────────────────────┴──────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="八、装饰器模式-decorator-——-透明增强" tabindex="-1"><a class="header-anchor" href="#八、装饰器模式-decorator-——-透明增强"><span>八、装饰器模式（Decorator）—— 透明增强</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 装饰器：在不修改原有实现的情况下添加新功能</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ============ 日志装饰器 ============</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 原始服务</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> IUserService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">User</span><span style="color:#ABB2BF;">?&gt; </span><span style="color:#61AFEF;">GetByIdAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> id</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> UserService</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IUserService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">User</span><span style="color:#ABB2BF;">?&gt; </span><span style="color:#61AFEF;">GetByIdAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> id</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_dbContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Users</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FindAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">id</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 装饰器：为 IUserService 添加日志</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> LoggingUserService</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IUserService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IUserService</span><span style="color:#E06C75;"> _inner</span><span style="color:#ABB2BF;">;     </span><span style="color:#7F848E;font-style:italic;">// 被装饰的原始服务</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> ILogger</span><span style="color:#E06C75;"> _logger</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> LoggingUserService</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">IUserService</span><span style="color:#E5C07B;"> inner</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">ILogger</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">LoggingUserService</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">logger</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _inner</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> inner</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _logger</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> logger</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">User</span><span style="color:#ABB2BF;">?&gt; </span><span style="color:#61AFEF;">GetByIdAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> id</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        _logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">LogInformation</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Getting user {Id}&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">id</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> sw</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> Stopwatch</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StartNew</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> user</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_inner</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetByIdAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">id</span><span style="color:#ABB2BF;">);  </span><span style="color:#7F848E;font-style:italic;">// 调用原始实现</span></span>
<span class="line"><span style="color:#E5C07B;">        sw</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Stop</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#E5C07B;">        _logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">LogInformation</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Got user {Id} in {Elapsed}ms. Found: {Found}&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">            id</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">sw</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ElapsedMilliseconds</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">user</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> user</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// DI注册装饰器</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddScoped</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">UserService</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddScoped</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IUserService</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E5C07B;">sp</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> inner</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> sp</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">UserService</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> logger</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> sp</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">ILogger</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">LoggingUserService</span><span style="color:#ABB2BF;">&gt;&gt;();</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">LoggingUserService</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">inner</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">logger</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 🔥 消费者完全不知道被装饰了</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// IUserService service = ...;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// service.GetByIdAsync(&quot;123&quot;);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 自动带日志，对调用者透明</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// ============ 缓存装饰器 ============</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> CachedUserService</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IUserService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IUserService</span><span style="color:#E06C75;"> _inner</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IDistributedCache</span><span style="color:#E06C75;"> _cache</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">User</span><span style="color:#ABB2BF;">?&gt; </span><span style="color:#61AFEF;">GetByIdAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> id</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> cacheKey</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> $&quot;user:</span><span style="color:#ABB2BF;">{</span><span style="color:#E06C75;">id</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 先查缓存</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> cached</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_cache</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetStringAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">cacheKey</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">cached</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> JsonSerializer</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Deserialize</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">User</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E06C75;">cached</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 缓存未命中，调用原始服务</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> user</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_inner</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetByIdAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">id</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 存入缓存</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">user</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">_cache</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">SetStringAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">cacheKey</span><span style="color:#ABB2BF;">, </span></span>
<span class="line"><span style="color:#E5C07B;">                JsonSerializer</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Serialize</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">user</span><span style="color:#ABB2BF;">),</span></span>
<span class="line"><span style="color:#ABB2BF;">                new </span><span style="color:#E5C07B;">DistributedCacheEntryOptions</span></span>
<span class="line"><span style="color:#ABB2BF;">                {</span></span>
<span class="line"><span style="color:#E06C75;">                    AbsoluteExpirationRelativeToNow</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> TimeSpan</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FromMinutes</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">5</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">                });</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> user</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 可以叠加多个装饰器：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// IUserService → CachedUserService → LoggingUserService → UserService</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddScoped</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IUserService</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E5C07B;">sp</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> real</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">UserService</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">sp</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AppDbContext</span><span style="color:#ABB2BF;">&gt;());</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> logged</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">LoggingUserService</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">real</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">sp</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">ILogger</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">LoggingUserService</span><span style="color:#ABB2BF;">&gt;&gt;());</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> cached</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">CachedUserService</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">logged</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">sp</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IDistributedCache</span><span style="color:#ABB2BF;">&gt;());</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#E06C75;"> cached</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 调用 service.GetByIdAsync(&quot;123&quot;) 的执行链：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// CachedUserService</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//   → 检查缓存 → 未命中</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//     → LoggingUserService</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//       → 记录日志 &quot;Getting user 123&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//         → UserService</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//           → 查数据库</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//         ← 返回 user</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//       → 记录日志 &quot;Got user 123 in 5ms&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//     ← 返回 user</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//   → 存入缓存</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ← 返回 user</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="asp-net-core-框架中的装饰器" tabindex="-1"><a class="header-anchor" href="#asp-net-core-框架中的装饰器"><span><a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core 框架中的装饰器</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>框架自身的装饰器应用：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. AuthenticationService</span></span>
<span class="line"><span>   ├── 原始: DefaultAuthenticationService</span></span>
<span class="line"><span>   └── 可以用自定义实现包装</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. Middleware 本身就是管道级的装饰器</span></span>
<span class="line"><span>   每个中间件都在&quot;装饰&quot;内层的行为</span></span>
<span class="line"><span>   ExceptionHandler 装饰了整个管道 → 添加了异常处理能力</span></span>
<span class="line"><span>   ResponseCompression 装饰了响应 → 添加了压缩能力</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. HttpClientFactory 中的 DelegatingHandler</span></span>
<span class="line"><span>   LoggingHandler → RetryHandler → HttpClientHandler</span></span>
<span class="line"><span>   每一层都装饰了下一层</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. OpenIddict 中的事件处理器链</span></span>
<span class="line"><span>   ValidateTokenRequestHandler → HandleTokenRequestHandler → ...</span></span>
<span class="line"><span>   每个处理器装饰了请求处理管道</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="九、模板方法模式-template-method-——-authenticationhandler-基类" tabindex="-1"><a class="header-anchor" href="#九、模板方法模式-template-method-——-authenticationhandler-基类"><span>九、模板方法模式（Template Method）—— AuthenticationHandler 基类</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Core/src/AuthenticationHandler.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AuthenticationHandler 定义了认证的&quot;模板流程&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 子类只需要实现关键步骤</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> abstract</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthenticationHandler</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt; : </span><span style="color:#E5C07B;">IAuthenticationHandler</span></span>
<span class="line"><span style="color:#C678DD;">    where</span><span style="color:#E5C07B;"> TOptions</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">AuthenticationSchemeOptions</span><span style="color:#ABB2BF;">, new()</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 模板方法：定义了整个认证流程的骨架</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">AuthenticateAsync</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 第1步：检查是否应该跳过（固定步骤）</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> target</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> ResolveTarget</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ForwardAuthenticate</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">target</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">Context</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AuthenticateAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">target</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 第2步：确保已初始化（固定步骤）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 创建Events实例等</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#61AFEF;">HandleAuthenticateOnceAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 第3步：记录结果（固定步骤）</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">result</span><span style="color:#ABB2BF;">?.</span><span style="color:#E5C07B;">Failure</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            Logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AuthenticationSchemeNotAuthenticatedWithFailure</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">                Scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">result</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Failure</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Message</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#C678DD;">        else</span><span style="color:#C678DD;"> if</span><span style="color:#ABB2BF;"> (</span><span style="color:#56B6C2;">!</span><span style="color:#E5C07B;">result</span><span style="color:#ABB2BF;">?.</span><span style="color:#E5C07B;">Succeeded</span><span style="color:#ABB2BF;"> ?? </span><span style="color:#D19A66;">true</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            Logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AuthenticationSchemeNotAuthenticated</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            Logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AuthenticationSchemeAuthenticated</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> result</span><span style="color:#ABB2BF;"> ?? </span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">NoResult</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">HandleAuthenticateOnceAsync</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">_authenticateTask</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">return</span><span style="color:#E06C75;"> _authenticateTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥🔥🔥 调用子类实现的抽象方法</span></span>
<span class="line"><span style="color:#E06C75;">        _authenticateTask</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> HandleAuthenticateAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> _authenticateTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 子类必须实现的方法 —— 这就是&quot;可变步骤&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> abstract</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">HandleAuthenticateAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // Challenge 的模板方法</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> ChallengeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">properties</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 固定步骤</span></span>
<span class="line"><span style="color:#E06C75;">        properties</span><span style="color:#C678DD;"> ??=</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 触发事件（可选扩展点）</span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#E5C07B;">Events</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">OnChallenge</span><span style="color:#ABB2BF;">(new </span><span style="color:#E5C07B;">ChallengeContext</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">Context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Options</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">properties</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 调用子类实现</span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#61AFEF;">HandleChallengeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">properties</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 子类可以覆盖</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> virtual</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> HandleChallengeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#E5C07B;"> properties</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        Response</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StatusCode</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 401</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">CompletedTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> virtual</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> HandleForbiddenAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#E5C07B;"> properties</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        Response</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StatusCode</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 403</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">CompletedTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// CookieAuthenticationHandler 的实现</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> CookieAuthenticationHandler</span><span style="color:#ABB2BF;"> : </span></span>
<span class="line"><span style="color:#E5C07B;">    AuthenticationHandler</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">CookieAuthenticationOptions</span><span style="color:#ABB2BF;">&gt;,</span></span>
<span class="line"><span style="color:#E5C07B;">    IAuthenticationSignInHandler</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">    IAuthenticationSignOutHandler</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 实现模板中的&quot;可变步骤&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> override</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">HandleAuthenticateAsync</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // Cookie认证的具体逻辑</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> cookie</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> Request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Cookies</span><span style="color:#ABB2BF;">[</span><span style="color:#E5C07B;">Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Cookie</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">];</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">cookie</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">NoResult</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> ticket</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">TicketDataFormat</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Unprotect</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">cookie</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">ticket</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Fail</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Unprotect ticket failed&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Success</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ticket</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 覆盖 Challenge 行为</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> override</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> HandleChallengeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#E5C07B;"> properties</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // Cookie的Challenge = 重定向到登录页</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> redirectUri</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> BuildRedirectUri</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">LoginPath</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">        Response</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Redirect</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">redirectUri</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 而不是默认的 401</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// JwtBearerHandler 的实现</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> JwtBearerHandler</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">AuthenticationHandler</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">JwtBearerOptions</span><span style="color:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> override</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">HandleAuthenticateAsync</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // JWT认证的具体逻辑</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> authorization</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> Request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Headers</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Authorization</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ToString</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#56B6C2;">!</span><span style="color:#E5C07B;">authorization</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StartsWith</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Bearer &quot;</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">NoResult</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> token</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> authorization</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Substring</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Bearer &quot;</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Length</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> principal</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> ValidateToken</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Success</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#ABB2BF;">            new </span><span style="color:#E5C07B;">AuthenticationTicket</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">principal</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">Scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 Challenge 用默认行为（401）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 不需要覆盖 HandleChallengeAsync</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 但添加了 WWW-Authenticate 头</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> override</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> HandleChallengeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#E5C07B;"> properties</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        Response</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StatusCode</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 401</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E5C07B;">        Response</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Headers</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">WWWAuthenticate</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> $&quot;Bearer error=</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">invalid_token</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">CompletedTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>模板方法模式的核心思想：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>基类定义算法骨架（不可变的步骤顺序）：</span></span>
<span class="line"><span>  1. 检查转发 (固定)</span></span>
<span class="line"><span>  2. 确保初始化 (固定)</span></span>
<span class="line"><span>  3. 🔥 执行认证 (可变 → 子类实现)</span></span>
<span class="line"><span>  4. 记录日志 (固定)</span></span>
<span class="line"><span>  5. 返回结果 (固定)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>子类只需要关注&quot;怎么认证&quot;这一步：</span></span>
<span class="line"><span>  Cookie → 读Cookie、解密</span></span>
<span class="line"><span>  JWT    → 读Header、验签</span></span>
<span class="line"><span>  OAuth  → 重定向到授权服务器</span></span>
<span class="line"><span></span></span>
<span class="line"><span>好处：</span></span>
<span class="line"><span>  - 所有认证Handler的日志记录行为一致</span></span>
<span class="line"><span>  - 所有Handler的初始化流程一致</span></span>
<span class="line"><span>  - 新增认证方式只需实现一个方法</span></span>
<span class="line"><span>  - 不会遗漏必要步骤</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十、工厂模式-factory-——-对象创建的集中管理" tabindex="-1"><a class="header-anchor" href="#十、工厂模式-factory-——-对象创建的集中管理"><span>十、工厂模式（Factory）—— 对象创建的集中管理</span></a></h2><h3 id="_10-1-di-容器本身就是终极工厂" tabindex="-1"><a class="header-anchor" href="#_10-1-di-容器本身就是终极工厂"><span>10.1 DI 容器本身就是终极工厂</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// DI容器 = 超级工厂</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 它知道如何创建任何已注册服务的实例</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 注册（教工厂怎么创建）</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddScoped</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IUserService</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">UserService</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddSingleton</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">ITokenService</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E5C07B;">sp</span><span style="color:#ABB2BF;"> =&gt;        </span><span style="color:#7F848E;font-style:italic;">// 带工厂委托</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> config</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> sp</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IOptions</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">JwtOptions</span><span style="color:#ABB2BF;">&gt;&gt;();</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> keys</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> sp</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">ISigningKeyService</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">TokenService</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">config</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">keys</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 使用（让工厂创建）</span></span>
<span class="line"><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> service</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> serviceProvider</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IUserService</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// DI容器自动：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 1. 查找 IUserService 的注册 → UserService</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 2. 分析 UserService 的构造函数参数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 3. 递归解析每个参数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 4. 调用构造函数创建实例</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 5. 根据生命周期决定缓存策略</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-httpcontextfactory" tabindex="-1"><a class="header-anchor" href="#_10-2-httpcontextfactory"><span>10.2 HttpContextFactory</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// HttpContext 的创建使用工厂模式 + 对象池</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> IHttpContextFactory</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    HttpContext</span><span style="color:#61AFEF;"> Create</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">IFeatureCollection</span><span style="color:#E5C07B;"> featureCollection</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">    void</span><span style="color:#61AFEF;"> Dispose</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">HttpContext</span><span style="color:#E5C07B;"> httpContext</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> DefaultHttpContextFactory</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IHttpContextFactory</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> ObjectPool</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">DefaultHttpContext</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E06C75;">_pool</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> HttpContext</span><span style="color:#61AFEF;"> Create</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">IFeatureCollection</span><span style="color:#E5C07B;"> featureCollection</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 从对象池获取（而不是 new）</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> context</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _pool</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Get</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#E5C07B;">        context</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Initialize</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">featureCollection</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> context</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> void</span><span style="color:#61AFEF;"> Dispose</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">HttpContext</span><span style="color:#E5C07B;"> httpContext</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 归还对象池（而不是扔掉）</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> defaultContext</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">DefaultHttpContext</span><span style="color:#ABB2BF;">)</span><span style="color:#E06C75;">httpContext</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E5C07B;">        defaultContext</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Uninitialize</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#E5C07B;">        _pool</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Return</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">defaultContext</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 为什么不直接 new？</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 1. 对象池减少GC压力</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 2. 工厂封装了初始化逻辑</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 3. 可以替换工厂实现（测试时使用MockHttpContext）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-requestdelegatefactory-minimal-api" tabindex="-1"><a class="header-anchor" href="#_10-3-requestdelegatefactory-minimal-api"><span>10.3 RequestDelegateFactory（Minimal API）</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 🔥 Minimal API 的参数绑定代码是工厂模式生成的</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">MapGet</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;/api/users/{id}&quot;</span><span style="color:#ABB2BF;">, </span></span>
<span class="line"><span style="color:#C678DD;">    async</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">int</span><span style="color:#E5C07B;"> id</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">IUserService</span><span style="color:#E5C07B;"> service</span><span style="color:#ABB2BF;">) =&gt; await </span><span style="color:#E5C07B;">service</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetByIdAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">id</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// RequestDelegateFactory 分析 lambda 签名后生成：</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">RequestDelegate</span><span style="color:#E06C75;"> factory_generated</span><span style="color:#56B6C2;"> =</span><span style="color:#C678DD;"> async</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">) =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 自动生成的绑定代码</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (</span><span style="color:#56B6C2;">!</span><span style="color:#C678DD;">int</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">TryParse</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RouteValues</span><span style="color:#ABB2BF;">[</span><span style="color:#98C379;">&quot;id&quot;</span><span style="color:#ABB2BF;">]?.</span><span style="color:#61AFEF;">ToString</span><span style="color:#ABB2BF;">(), </span><span style="color:#C678DD;">out</span><span style="color:#C678DD;"> var</span><span style="color:#E06C75;"> id</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Response</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StatusCode</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 400</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> service</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RequestServices</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IUserService</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#61AFEF;">handler</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">id</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">service</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    await </span><span style="color:#61AFEF;">WriteJsonResponse</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">result</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 工厂的核心价值：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 将&quot;运行时的反射&quot;变成&quot;注册时的代码生成&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 每个请求执行的是预编译好的委托，不是反射调用</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十一、依赖倒置原则-dip-——-框架的灵魂" tabindex="-1"><a class="header-anchor" href="#十一、依赖倒置原则-dip-——-框架的灵魂"><span>十一、依赖倒置原则（DIP）—— 框架的灵魂</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>依赖倒置原则是 ASP.NET Core 最核心的设计原则</span></span>
<span class="line"><span>它使得框架的每个组件都可以被替换</span></span>
<span class="line"><span></span></span>
<span class="line"><span>传统方式（依赖具体）：                    ASP.NET Core（依赖抽象）：</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>Controller                              Controller</span></span>
<span class="line"><span>    │                                       │</span></span>
<span class="line"><span>    └── new UserService()                   └── IUserService (接口)</span></span>
<span class="line"><span>            │                                       ▲</span></span>
<span class="line"><span>            └── new SqlConnection()                 │</span></span>
<span class="line"><span>                                            UserService : IUserService</span></span>
<span class="line"><span>                                                │</span></span>
<span class="line"><span>                                                └── DbContext (也是抽象)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>问题：                                   优势：</span></span>
<span class="line"><span>- 无法替换                               - 可以替换为 MockService</span></span>
<span class="line"><span>- 无法测试                               - 可以替换为 MongoService  </span></span>
<span class="line"><span>- 紧耦合                                 - 松耦合</span></span>
<span class="line"><span>                                         - 可测试</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-1-在-sso-项目中的应用" tabindex="-1"><a class="header-anchor" href="#_11-1-在-sso-项目中的应用"><span>11.1 在 SSO 项目中的应用</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// ========== 定义抽象 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> IUserRepository</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AppUser</span><span style="color:#ABB2BF;">?&gt; </span><span style="color:#61AFEF;">FindByIdAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> id</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AppUser</span><span style="color:#ABB2BF;">?&gt; </span><span style="color:#61AFEF;">FindByEmailAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> email</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">ValidatePasswordAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AppUser</span><span style="color:#E5C07B;"> user</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> password</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> ITokenService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    ClaimsPrincipal</span><span style="color:#61AFEF;"> CreatePrincipal</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AppUser</span><span style="color:#E5C07B;"> user</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">scopes</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> IConsentService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">HasConsentAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> userId</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> clientId</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">scopes</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#61AFEF;"> GrantConsentAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> userId</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> clientId</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">scopes</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ========== 实现 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> EfUserRepository</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IUserRepository</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> AppDbContext</span><span style="color:#E06C75;"> _db</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AppUser</span><span style="color:#ABB2BF;">?&gt; </span><span style="color:#61AFEF;">FindByIdAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> id</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        =&gt; await </span><span style="color:#E5C07B;">_db</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Users</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FindAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">id</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AppUser</span><span style="color:#ABB2BF;">?&gt; </span><span style="color:#61AFEF;">FindByEmailAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> email</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        =&gt; await </span><span style="color:#E5C07B;">_db</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Users</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FirstOrDefaultAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">u</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#E5C07B;">u</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Email</span><span style="color:#56B6C2;"> ==</span><span style="color:#E06C75;"> email</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">ValidatePasswordAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AppUser</span><span style="color:#E5C07B;"> user</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> password</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        =&gt; </span><span style="color:#E5C07B;">BCrypt</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Verify</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">password</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">user</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">PasswordHash</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ========== 注册 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddScoped</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IUserRepository</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">EfUserRepository</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddScoped</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">ITokenService</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">DefaultTokenService</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddScoped</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IConsentService</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">DbConsentService</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ========== 使用 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">[</span><span style="color:#E5C07B;">Route</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;connect&quot;</span><span style="color:#ABB2BF;">)]</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthorizationController</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">Controller</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IUserRepository</span><span style="color:#E06C75;"> _userRepo</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> ITokenService</span><span style="color:#E06C75;"> _tokenService</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IConsentService</span><span style="color:#E06C75;"> _consentService</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> AuthorizationController</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        IUserRepository</span><span style="color:#E5C07B;"> userRepo</span><span style="color:#ABB2BF;">,       </span><span style="color:#7F848E;font-style:italic;">// 不知道是EF还是Dapper</span></span>
<span class="line"><span style="color:#E5C07B;">        ITokenService</span><span style="color:#E5C07B;"> tokenService</span><span style="color:#ABB2BF;">,     </span><span style="color:#7F848E;font-style:italic;">// 不知道是JWT还是其他</span></span>
<span class="line"><span style="color:#E5C07B;">        IConsentService</span><span style="color:#E5C07B;"> consentService</span><span style="color:#ABB2BF;">) </span><span style="color:#7F848E;font-style:italic;">// 不知道存在数据库还是Redis</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _userRepo</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> userRepo</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _tokenService</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> tokenService</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _consentService</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> consentService</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    [</span><span style="color:#E5C07B;">HttpPost</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;authorize&quot;</span><span style="color:#ABB2BF;">)]</span></span>
<span class="line"><span style="color:#ABB2BF;">    [</span><span style="color:#E5C07B;">Authorize</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IActionResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">Authorize</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> request</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> HttpContext</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetOpenIddictServerRequest</span><span style="color:#ABB2BF;">()</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> userId</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> User</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FindFirst</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;sub&quot;</span><span style="color:#ABB2BF;">)</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Value</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 通过接口调用，不依赖具体实现</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> user</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_userRepo</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FindByIdAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">userId</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> hasConsent</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_consentService</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">HasConsentAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            userId</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ClientId</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">request</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetScopes</span><span style="color:#ABB2BF;">());</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#56B6C2;">!</span><span style="color:#E06C75;">hasConsent</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#61AFEF;"> View</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Consent&quot;</span><span style="color:#ABB2BF;">, new </span><span style="color:#E5C07B;">ConsentViewModel</span><span style="color:#ABB2BF;"> { </span><span style="color:#7F848E;font-style:italic;">/* ... */</span><span style="color:#ABB2BF;"> });</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> principal</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _tokenService</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">CreatePrincipal</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">user</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">request</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetScopes</span><span style="color:#ABB2BF;">());</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#61AFEF;"> SignIn</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">principal</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">OpenIddictServerAspNetCoreDefaults</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">AuthenticationScheme</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ========== 测试时可以轻松替换 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">[</span><span style="color:#E5C07B;">Fact</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> Authorize_WithConsent_ReturnsSignIn</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> mockUserRepo</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">Mock</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IUserRepository</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#E5C07B;">    mockUserRepo</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Setup</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">r</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#E5C07B;">r</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FindByIdAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;user-1&quot;</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        .</span><span style="color:#61AFEF;">ReturnsAsync</span><span style="color:#ABB2BF;">(new </span><span style="color:#E5C07B;">AppUser</span><span style="color:#ABB2BF;"> { </span><span style="color:#E06C75;">Id</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;user-1&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Name</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;Test&quot;</span><span style="color:#ABB2BF;"> });</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> mockConsent</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">Mock</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IConsentService</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#E5C07B;">    mockConsent</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Setup</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">c</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#E5C07B;">c</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">HasConsentAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;user-1&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;web-app&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">It</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">IsAny</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">&gt;&gt;()))</span></span>
<span class="line"><span style="color:#ABB2BF;">        .</span><span style="color:#61AFEF;">ReturnsAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">true</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> controller</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">AuthorizationController</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        mockUserRepo</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Object</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">        new </span><span style="color:#E5C07B;">DefaultTokenService</span><span style="color:#ABB2BF;">(),</span></span>
<span class="line"><span style="color:#E5C07B;">        mockConsent</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Object</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 测试不需要真实数据库</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十二、开闭原则-ocp-——-对扩展开放-对修改关闭" tabindex="-1"><a class="header-anchor" href="#十二、开闭原则-ocp-——-对扩展开放-对修改关闭"><span>十二、开闭原则（OCP）—— 对扩展开放，对修改关闭</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ASP.NET Core 通过以下机制实现开闭原则：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 中间件管道 → 添加新中间件不需要修改现有中间件</span></span>
<span class="line"><span>2. DI注册     → 添加新服务不需要修改现有服务</span></span>
<span class="line"><span>3. Options    → 添加新配置不需要修改框架代码</span></span>
<span class="line"><span>4. 策略模式   → 添加新认证方案不需要修改认证框架</span></span>
<span class="line"><span>5. IEndpointFilter → 给Minimal API添加行为不修改Handler</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 例子：给所有API添加审计日志，不修改任何Controller代码</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ========== 新增一个中间件 ==========</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuditMiddleware</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> RequestDelegate</span><span style="color:#E06C75;"> _next</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> ILogger</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuditMiddleware</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E06C75;">_logger</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> Invoke</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> sw</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> Stopwatch</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StartNew</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 记录请求</span></span>
<span class="line"><span style="color:#E5C07B;">        _logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">LogInformation</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Request: {Method} {Path} from {IP}&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">            context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Method</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">            context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Path</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">            context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Connection</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RemoteIpAddress</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#61AFEF;">_next</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">        sw</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Stop</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 记录响应</span></span>
<span class="line"><span style="color:#E5C07B;">        _logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">LogInformation</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Response: {StatusCode} in {Elapsed}ms&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">            context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Response</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StatusCode</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">            sw</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ElapsedMilliseconds</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 只需要在 Program.cs 中添加一行：</span></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">UseMiddleware</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuditMiddleware</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ✅ 没有修改任何 Controller</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ✅ 没有修改任何现有中间件</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ✅ 所有请求都被审计了</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 这就是开闭原则</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ========== 新增一个授权需求，不修改框架代码 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> IpWhitelistRequirement</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IAuthorizationRequirement</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> List</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">&gt; AllowedIps { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> IpWhitelistHandler</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">AuthorizationHandler</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IpWhitelistRequirement</span><span style="color:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> override</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> HandleRequirementAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        AuthorizationHandlerContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        IpWhitelistRequirement</span><span style="color:#E5C07B;"> requirement</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> httpContext</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Resource</span><span style="color:#ABB2BF;"> as </span><span style="color:#E5C07B;">HttpContext</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            ?? </span><span style="color:#C678DD;">throw</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">InvalidOperationException</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> ip</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> httpContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Connection</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RemoteIpAddress</span><span style="color:#ABB2BF;">?.</span><span style="color:#61AFEF;">ToString</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">ip</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#56B6C2;"> &amp;&amp;</span><span style="color:#E5C07B;"> requirement</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">AllowedIps</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Contains</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ip</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            context</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Succeed</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">requirement</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">CompletedTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 注册：</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddSingleton</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAuthorizationHandler</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">IpWhitelistHandler</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddAuthorization</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">options</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    options</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddPolicy</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;InternalOnly&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">policy</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#E5C07B;">        policy</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Requirements</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Add</span><span style="color:#ABB2BF;">(new </span><span style="color:#E5C07B;">IpWhitelistRequirement</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E06C75;">            AllowedIps</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> { </span><span style="color:#98C379;">&quot;10.0.0.1&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;10.0.0.2&quot;</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }));</span></span>
<span class="line"><span style="color:#ABB2BF;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ✅ 没有修改 DefaultAuthorizationService</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ✅ 没有修改 AuthorizationMiddleware</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ✅ 只是&quot;扩展&quot;了授权系统的能力</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十三、接口隔离原则-isp" tabindex="-1"><a class="header-anchor" href="#十三、接口隔离原则-isp"><span>十三、接口隔离原则（ISP）</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ASP.NET Core 的接口设计遵循&quot;接口小而专&quot;的原则</span></span>
<span class="line"><span></span></span>
<span class="line"><span>❌ 大接口：</span></span>
<span class="line"><span>public interface IAuthenticationHandler</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    Task Authenticate();</span></span>
<span class="line"><span>    Task Challenge();</span></span>
<span class="line"><span>    Task Forbid();</span></span>
<span class="line"><span>    Task SignIn();      // 不是所有Handler都支持</span></span>
<span class="line"><span>    Task SignOut();     // 不是所有Handler都支持</span></span>
<span class="line"><span>    Task HandleRequest(); // 不是所有Handler都需要</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>✅ 小接口（实际设计）：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface IAuthenticationHandler           // 基础认证</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    Task&lt;AuthenticateResult&gt; AuthenticateAsync();</span></span>
<span class="line"><span>    Task ChallengeAsync(AuthenticationProperties? properties);</span></span>
<span class="line"><span>    Task ForbidAsync(AuthenticationProperties? properties);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface IAuthenticationSignInHandler     // 支持登录</span></span>
<span class="line"><span>    : IAuthenticationHandler</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    Task SignInAsync(ClaimsPrincipal user, AuthenticationProperties? properties);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface IAuthenticationSignOutHandler    // 支持登出</span></span>
<span class="line"><span>    : IAuthenticationHandler</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    Task SignOutAsync(AuthenticationProperties? properties);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface IAuthenticationRequestHandler    // 支持请求拦截</span></span>
<span class="line"><span>    : IAuthenticationHandler</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    Task&lt;bool&gt; HandleRequestAsync();</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>接口实现对照：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CookieAuthenticationHandler</span></span>
<span class="line"><span>  实现: IAuthenticationHandler       ✅ 认证</span></span>
<span class="line"><span>        IAuthenticationSignInHandler  ✅ 登录（写Cookie）</span></span>
<span class="line"><span>        IAuthenticationSignOutHandler ✅ 登出（删Cookie）</span></span>
<span class="line"><span>  不实现: IAuthenticationRequestHandler ❌ 不拦截请求</span></span>
<span class="line"><span></span></span>
<span class="line"><span>JwtBearerHandler</span></span>
<span class="line"><span>  实现: IAuthenticationHandler        ✅ 认证</span></span>
<span class="line"><span>  不实现: IAuthenticationSignInHandler  ❌ JWT无状态，不能SignIn</span></span>
<span class="line"><span>          IAuthenticationSignOutHandler ❌ JWT无状态，不能SignOut</span></span>
<span class="line"><span>          IAuthenticationRequestHandler ❌ 不拦截请求</span></span>
<span class="line"><span></span></span>
<span class="line"><span>OpenIddictServerHandler</span></span>
<span class="line"><span>  实现: IAuthenticationHandler        ✅ 认证</span></span>
<span class="line"><span>        IAuthenticationRequestHandler  ✅ 拦截OAuth端点请求</span></span>
<span class="line"><span>  不实现: IAuthenticationSignInHandler  ❌</span></span>
<span class="line"><span>          IAuthenticationSignOutHandler ❌</span></span>
<span class="line"><span></span></span>
<span class="line"><span>每个Handler只实现自己需要的接口</span></span>
<span class="line"><span>不会被迫实现不需要的方法</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十四、单一职责原则-srp-——-中间件的精髓" tabindex="-1"><a class="header-anchor" href="#十四、单一职责原则-srp-——-中间件的精髓"><span>十四、单一职责原则（SRP）—— 中间件的精髓</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>每个中间件只做一件事：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ForwardedHeadersMiddleware  → 只处理转发头</span></span>
<span class="line"><span>ExceptionHandlerMiddleware  → 只处理异常</span></span>
<span class="line"><span>RoutingMiddleware           → 只匹配路由</span></span>
<span class="line"><span>AuthenticationMiddleware    → 只认证身份</span></span>
<span class="line"><span>AuthorizationMiddleware     → 只检查权限</span></span>
<span class="line"><span>CorsMiddleware              → 只处理跨域</span></span>
<span class="line"><span>ResponseCachingMiddleware   → 只处理缓存</span></span>
<span class="line"><span>ResponseCompressionMiddleware → 只压缩响应</span></span>
<span class="line"><span>StaticFileMiddleware        → 只处理静态文件</span></span>
<span class="line"><span>EndpointMiddleware          → 只执行端点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>不会有一个 &quot;SuperMiddleware&quot; 做所有事情</span></span>
<span class="line"><span></span></span>
<span class="line"><span>好处：</span></span>
<span class="line"><span>1. 每个中间件可以独立测试</span></span>
<span class="line"><span>2. 可以灵活组合（不需要CORS就不加）</span></span>
<span class="line"><span>3. 每个中间件的代码量小，容易理解</span></span>
<span class="line"><span>4. 出问题时容易定位（某个中间件的责任明确）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>违反SRP的反例：</span></span>
<span class="line"><span>// ❌ 一个中间件做了太多事</span></span>
<span class="line"><span>public class DoEverythingMiddleware</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    public async Task Invoke(HttpContext context)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // 处理CORS</span></span>
<span class="line"><span>        // 处理认证</span></span>
<span class="line"><span>        // 处理授权</span></span>
<span class="line"><span>        // 压缩响应</span></span>
<span class="line"><span>        // 记录日志</span></span>
<span class="line"><span>        // 处理异常</span></span>
<span class="line"><span>        await _next(context);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 这样的代码难以测试、难以维护、难以复用</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十五、设计模式汇总表" tabindex="-1"><a class="header-anchor" href="#十五、设计模式汇总表"><span>十五、设计模式汇总表</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌────────────────────────┬────────────────────────────┬──────────────────────────┐</span></span>
<span class="line"><span>│ 设计模式                │ ASP.NET Core 中的体现       │ SSO 项目中的体现          │</span></span>
<span class="line"><span>├────────────────────────┼────────────────────────────┼──────────────────────────┤</span></span>
<span class="line"><span>│ Builder                │ WebApplicationBuilder      │ OpenIddictBuilder        │</span></span>
<span class="line"><span>│                        │ ApplicationBuilder         │ PolicyBuilder            │</span></span>
<span class="line"><span>│                        │ ConfigurationBuilder       │                          │</span></span>
<span class="line"><span>│                        │ AuthorizationPolicyBuilder │                          │</span></span>
<span class="line"><span>│                        │                            │                          │</span></span>
<span class="line"><span>│ 责任链                  │ 中间件管道                  │ OpenIddict Handler链     │</span></span>
<span class="line"><span>│ (Chain of              │ 认证Handler链               │ 授权Handler链            │</span></span>
<span class="line"><span>│  Responsibility)       │ MVC Filter管道              │                          │</span></span>
<span class="line"><span>│                        │                            │                          │</span></span>
<span class="line"><span>│ 策略                    │ IAuthenticationHandler     │ Cookie vs JWT 认证       │</span></span>
<span class="line"><span>│ (Strategy)             │ IAuthorizationHandler      │ Scope vs Role 授权       │</span></span>
<span class="line"><span>│                        │ IServer                    │ EFCore vs 自定义存储     │</span></span>
<span class="line"><span>│                        │ ILoggerProvider            │                          │</span></span>
<span class="line"><span>│                        │                            │                          │</span></span>
<span class="line"><span>│ 工厂                    │ DI容器                     │ HttpContextFactory       │</span></span>
<span class="line"><span>│ (Factory)              │ RequestDelegateFactory     │ OptionsFactory           │</span></span>
<span class="line"><span>│                        │ AuthHandlerProvider        │                          │</span></span>
<span class="line"><span>│                        │                            │                          │</span></span>
<span class="line"><span>│ 模板方法                │ AuthenticationHandler&lt;T&gt;   │ 自定义认证Handler        │</span></span>
<span class="line"><span>│ (Template Method)      │ AuthorizationHandler&lt;T&gt;    │ 自定义授权Handler        │</span></span>
<span class="line"><span>│                        │                            │                          │</span></span>
<span class="line"><span>│ 观察者                  │ IOptionsMonitor + OnChange │ 配置热更新                │</span></span>
<span class="line"><span>│ (Observer)             │ ChangeToken                │ DataSource变更通知        │</span></span>
<span class="line"><span>│                        │ IHostApplicationLifetime   │                          │</span></span>
<span class="line"><span>│                        │                            │                          │</span></span>
<span class="line"><span>│ 适配器                  │ DefaultHttpContext←Feature │ OpenIddict←AspNetCore    │</span></span>
<span class="line"><span>│ (Adapter)              │ DefaultHttpRequest         │ 适配层                    │</span></span>
<span class="line"><span>│                        │ DefaultHttpResponse        │                          │</span></span>
<span class="line"><span>│                        │                            │                          │</span></span>
<span class="line"><span>│ 装饰器                  │ 中间件（管道级装饰）        │ 日志/缓存/重试           │</span></span>
<span class="line"><span>│ (Decorator)            │ DelegatingHandler          │ 装饰业务服务              │</span></span>
<span class="line"><span>│                        │                            │                          │</span></span>
<span class="line"><span>│ 单例                    │ Singleton服务              │ 签名密钥管理              │</span></span>
<span class="line"><span>│ (Singleton)            │ DFA路由图                   │ OpenIddict Server配置    │</span></span>
<span class="line"><span>│                        │                            │                          │</span></span>
<span class="line"><span>│ 组合                    │ 中间件组合                  │ Policy = 多个Requirement │</span></span>
<span class="line"><span>│ (Composite)            │ CompositeEndpointDataSource│ 多个认证方案组合          │</span></span>
<span class="line"><span>│                        │ CompositeChangeToken       │                          │</span></span>
<span class="line"><span>│                        │                            │                          │</span></span>
<span class="line"><span>│ 代理                    │ LazyInitializer            │ Scope生命周期代理         │</span></span>
<span class="line"><span>│ (Proxy)                │ Scoped服务代理              │                          │</span></span>
<span class="line"><span>│                        │                            │                          │</span></span>
<span class="line"><span>│ 选项/配置对象            │ Options&lt;T&gt; 模式            │ OpenIddictServerOptions  │</span></span>
<span class="line"><span>│ (Options)              │ IOptions/IOptionsSnapshot   │ JwtBearerOptions         │</span></span>
<span class="line"><span>│                        │ IOptionsMonitor             │ CookieAuthOptions        │</span></span>
<span class="line"><span>└────────────────────────┴────────────────────────────┴──────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十六、asp-net-core-特有的设计模式" tabindex="-1"><a class="header-anchor" href="#十六、asp-net-core-特有的设计模式"><span>十六、<a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core 特有的设计模式</span></a></h2><h3 id="_16-1-use-add-模式" tabindex="-1"><a class="header-anchor" href="#_16-1-use-add-模式"><span>16.1 &quot;Use + Add&quot; 模式</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// ASP.NET Core 的一个标志性设计：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// &quot;Add&quot; 注册服务，&quot;Use&quot; 启用中间件</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 注册阶段（DI配置）</span></span>
<span class="line"><span style="color:#E5C07B;">builder</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddAuthentication</span><span style="color:#ABB2BF;">()      </span><span style="color:#7F848E;font-style:italic;">// 注册认证服务到DI</span></span>
<span class="line"><span style="color:#ABB2BF;">    .</span><span style="color:#61AFEF;">AddJwtBearer</span><span style="color:#ABB2BF;">()                       </span><span style="color:#7F848E;font-style:italic;">// 注册JWT认证Handler</span></span>
<span class="line"><span style="color:#ABB2BF;">    .</span><span style="color:#61AFEF;">AddCookie</span><span style="color:#ABB2BF;">();                         </span><span style="color:#7F848E;font-style:italic;">// 注册Cookie认证Handler</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">builder</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddAuthorization</span><span style="color:#ABB2BF;">();      </span><span style="color:#7F848E;font-style:italic;">// 注册授权服务到DI</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">builder</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddOpenIddict</span><span style="color:#ABB2BF;">()          </span><span style="color:#7F848E;font-style:italic;">// 注册OpenIddict服务到DI</span></span>
<span class="line"><span style="color:#ABB2BF;">    .</span><span style="color:#61AFEF;">AddCore</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    .</span><span style="color:#61AFEF;">AddServer</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    .</span><span style="color:#61AFEF;">AddValidation</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 启用阶段（中间件管道）</span></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">UseAuthentication</span><span style="color:#ABB2BF;">();                  </span><span style="color:#7F848E;font-style:italic;">// 启用认证中间件</span></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">UseAuthorization</span><span style="color:#ABB2BF;">();                   </span><span style="color:#7F848E;font-style:italic;">// 启用授权中间件</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 🔥 为什么要分成两步？</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 原因1：分离关注点</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//   Add = &quot;我有什么能力&quot;（注册到DI）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//   Use = &quot;我在什么时候用&quot;（插入管道的哪个位置）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 原因2：灵活性</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//   可以 Add 但不 Use（注册了服务但手动调用，不走中间件）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//   可以调整 Use 的顺序（认证在授权前面）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//   Add 的顺序无所谓，Use 的顺序至关重要</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 原因3：可测试性</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//   单元测试只需要 Add（注册服务），不需要 Use（不走管道）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//   集成测试才需要两者都配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ============ 常见的 Add/Use 对 ============</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// builder.Services.AddXxx()          app.UseXxx()</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ─────────────────────────────      ──────────────────────</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AddRouting()                       UseRouting()</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AddAuthentication()                UseAuthentication()</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AddAuthorization()                 UseAuthorization()</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AddCors()                          UseCors()</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AddResponseCompression()           UseResponseCompression()</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AddResponseCaching()               UseResponseCaching()</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AddSession()                       UseSession()</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AddHealthChecks()                  UseHealthChecks() / MapHealthChecks()</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AddRateLimiter()                   UseRateLimiter()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ============ 只有 Add 没有 Use 的 ============</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AddHttpClient()                    → 不是中间件，是服务</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AddDbContext()                     → 不是中间件，是服务</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AddOpenIddict()                    → 通过认证中间件生效</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AddIdentity()                      → 通过认证中间件生效</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ============ 只有 Use 没有 Add 的 ============</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// UseStaticFiles()                   → 内部自动注册</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// UseHttpsRedirection()              → 内部自动注册</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// UseForwardedHeaders()              → 需要Configure&lt;ForwardedHeadersOptions&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_16-2-feature-模式-——-能力协商" tabindex="-1"><a class="header-anchor" href="#_16-2-feature-模式-——-能力协商"><span>16.2 Feature 模式 —— 能力协商</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// ASP.NET Core 独创的设计模式</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 通过 Feature 集合暴露服务器能力</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 比传统的接口继承更灵活</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ❌ 传统方式：大接口</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> IHttpContext</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    string</span><span style="color:#ABB2BF;"> Method { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#C678DD;">    string</span><span style="color:#ABB2BF;"> Path { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#E5C07B;">    Stream</span><span style="color:#ABB2BF;"> Body { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#C678DD;">    int</span><span style="color:#ABB2BF;"> StatusCode { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#E5C07B;">    WebSocket</span><span style="color:#61AFEF;"> AcceptWebSocket</span><span style="color:#ABB2BF;">();        </span><span style="color:#7F848E;font-style:italic;">// 不是所有服务器都支持</span></span>
<span class="line"><span style="color:#ABB2BF;">    X509Certificate ClientCertificate;  </span><span style="color:#7F848E;font-style:italic;">// 不是所有连接都有</span></span>
<span class="line"><span style="color:#ABB2BF;">    int Http2StreamId;                  </span><span style="color:#7F848E;font-style:italic;">// 只有HTTP/2才有</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ... 接口越来越大</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ✅ ASP.NET Core 方式：Feature 集合</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> HttpContext</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> IFeatureCollection</span><span style="color:#ABB2BF;"> Features { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 需要什么能力，就查询什么Feature</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 使用时：动态查询能力</span></span>
<span class="line"><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> webSocketFeature</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Features</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Get</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IHttpWebSocketFeature</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">webSocketFeature</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 当前服务器支持WebSocket</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> socket</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">webSocketFeature</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AcceptAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">null</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 当前服务器不支持WebSocket</span></span>
<span class="line"><span style="color:#E5C07B;">    context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Response</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StatusCode</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 426</span><span style="color:#ABB2BF;">; </span><span style="color:#7F848E;font-style:italic;">// Upgrade Required</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> tlsFeature</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Features</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Get</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">ITlsConnectionFeature</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">tlsFeature</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 当前连接使用了TLS</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> clientCert</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">tlsFeature</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetClientCertificateAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">CancellationToken</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">None</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // mTLS 客户端证书验证</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> http2Feature</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Features</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Get</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IHttp2StreamIdFeature</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">http2Feature</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> streamId</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> http2Feature</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StreamId</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // HTTP/2 流信息</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Feature 模式 vs 接口继承：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>接口继承问题：</span></span>
<span class="line"><span>  IServer : IBasicServer, IWebSocketServer, ITlsServer, IHttp2Server...</span></span>
<span class="line"><span>  → 接口爆炸</span></span>
<span class="line"><span>  → 新功能需要修改接口（破坏性变更）</span></span>
<span class="line"><span>  → 实现类必须实现所有接口（即使不支持）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Feature集合优势：</span></span>
<span class="line"><span>  features.Get&lt;IXxxFeature&gt;()</span></span>
<span class="line"><span>  → 能力可选（Get返回null就是不支持）</span></span>
<span class="line"><span>  → 新功能只需新增Feature接口（不影响现有代码）</span></span>
<span class="line"><span>  → 服务器按需实现（Kestrel实现很多Feature，TestServer实现少量）</span></span>
<span class="line"><span>  → 运行时可以动态添加/替换Feature</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 🔥 中间件可以&quot;增强&quot;Feature</span></span>
<span class="line"><span>  // 例如：ResponseCompressionMiddleware 替换了 IHttpResponseBodyFeature</span></span>
<span class="line"><span>  // 让后续中间件写入的响应自动被压缩</span></span>
<span class="line"><span>  context.Features.Set&lt;IHttpResponseBodyFeature&gt;(</span></span>
<span class="line"><span>      new CompressionBodyFeature(originalFeature));</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_16-3-endpoint-metadata-模式" tabindex="-1"><a class="header-anchor" href="#_16-3-endpoint-metadata-模式"><span>16.3 Endpoint Metadata 模式</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// ASP.NET Core 独创的设计模式：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 将&quot;关于端点的信息&quot;作为元数据附加到Endpoint上</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 而不是由框架代码硬编码判断</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ❌ 传统方式：框架硬编码</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthorizationMiddleware</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> Invoke</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 硬编码：检查URL是否需要认证</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Path</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StartsWith</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;/api/&quot;</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 需要认证</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#C678DD;">        else</span><span style="color:#C678DD;"> if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Path</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StartsWith</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;/public/&quot;</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 不需要认证</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 💀 每新增一个路径都要修改这里</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ✅ ASP.NET Core 方式：Metadata驱动</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// Controller上标注元数据</span></span>
<span class="line"><span style="color:#ABB2BF;">[</span><span style="color:#E5C07B;">Authorize</span><span style="color:#ABB2BF;">(Policy </span><span style="color:#56B6C2;">=</span><span style="color:#98C379;"> &quot;admin&quot;</span><span style="color:#ABB2BF;">)]       </span><span style="color:#7F848E;font-style:italic;">// 元数据</span></span>
<span class="line"><span style="color:#ABB2BF;">[</span><span style="color:#E5C07B;">Route</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;api/[controller]&quot;</span><span style="color:#ABB2BF;">)]</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> UsersController</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">ControllerBase</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#ABB2BF;">    [</span><span style="color:#E5C07B;">AllowAnonymous</span><span style="color:#ABB2BF;">]                </span><span style="color:#7F848E;font-style:italic;">// 元数据</span></span>
<span class="line"><span style="color:#ABB2BF;">    [</span><span style="color:#E5C07B;">HttpGet</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;public&quot;</span><span style="color:#ABB2BF;">)]</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> IActionResult</span><span style="color:#61AFEF;"> PublicAction</span><span style="color:#ABB2BF;">() =&gt; </span><span style="color:#61AFEF;">Ok</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    [</span><span style="color:#E5C07B;">Authorize</span><span style="color:#ABB2BF;">(Roles </span><span style="color:#56B6C2;">=</span><span style="color:#98C379;"> &quot;admin&quot;</span><span style="color:#ABB2BF;">)]    </span><span style="color:#7F848E;font-style:italic;">// 元数据</span></span>
<span class="line"><span style="color:#ABB2BF;">    [</span><span style="color:#E5C07B;">HttpDelete</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;{id}&quot;</span><span style="color:#ABB2BF;">)]</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> IActionResult</span><span style="color:#61AFEF;"> DeleteUser</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">int</span><span style="color:#E5C07B;"> id</span><span style="color:#ABB2BF;">) =&gt; </span><span style="color:#61AFEF;">Ok</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// AuthorizationMiddleware 读取元数据做决策</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthorizationMiddleware</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> Invoke</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> endpoint</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetEndpoint</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">endpoint</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#61AFEF;">_next</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 从 Endpoint 的 Metadata 中读取授权信息</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> authorizeData</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> endpoint</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Metadata</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">GetOrderedMetadata</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAuthorizeData</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> allowAnonymous</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> endpoint</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Metadata</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">GetMetadata</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAllowAnonymous</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">allowAnonymous</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#61AFEF;">_next</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">);  </span><span style="color:#7F848E;font-style:italic;">// 匿名访问</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">authorizeData</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Count</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 需要授权 → 构建策略 → 检查</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> policy</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#61AFEF;">CombinePolicy</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">authorizeData</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_authService</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AuthorizeAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">                context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">User</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">policy</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // ...</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#61AFEF;">_next</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 🔥 任何中间件都可以读取Metadata，不仅限于授权</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// CORS中间件读取 [EnableCors] Metadata</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 缓存中间件读取 [ResponseCache] Metadata</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// Rate Limiting读取 [EnableRateLimiting] Metadata</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 你的自定义中间件可以读取你自定义的 Attribute</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Metadata 模式的核心价值：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 声明式编程</span></span>
<span class="line"><span>   → 在Controller上标注Attribute声明&quot;要什么&quot;</span></span>
<span class="line"><span>   → 框架自动执行，不需要命令式代码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 关注点分离</span></span>
<span class="line"><span>   → Controller只关心业务逻辑</span></span>
<span class="line"><span>   → 安全/缓存/CORS等由中间件根据Metadata自动处理</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 可扩展性</span></span>
<span class="line"><span>   → 新的Metadata类型不需要修改现有中间件</span></span>
<span class="line"><span>   → 新的中间件可以读取现有Metadata</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 可发现性</span></span>
<span class="line"><span>   → 所有元数据都在一个集合中</span></span>
<span class="line"><span>   → Swagger/OpenAPI可以从Metadata生成文档</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十七、反模式与陷阱" tabindex="-1"><a class="header-anchor" href="#十七、反模式与陷阱"><span>十七、反模式与陷阱</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// ============ 反模式1：Service Locator ============</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ❌ 反模式：在代码中直接解析服务</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> BadService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IServiceProvider</span><span style="color:#E06C75;"> _provider</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> BadService</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">IServiceProvider</span><span style="color:#E5C07B;"> provider</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _provider</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> provider</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> void</span><span style="color:#61AFEF;"> DoSomething</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 💀 Service Locator 反模式</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> userService</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _provider</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IUserService</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> logger</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _provider</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">ILogger</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">BadService</span><span style="color:#ABB2BF;">&gt;&gt;();</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ✅ 正确：通过构造函数注入</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> GoodService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IUserService</span><span style="color:#E06C75;"> _userService</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> ILogger</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">GoodService</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E06C75;">_logger</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> GoodService</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">IUserService</span><span style="color:#E5C07B;"> userService</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">ILogger</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">GoodService</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">logger</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _userService</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> userService</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _logger</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> logger</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 什么时候可以用 IServiceProvider？</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 1. 框架代码（中间件构造函数中解析是合理的）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 2. 工厂模式（需要根据条件创建不同实例）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 3. 延迟解析（Lazy&lt;T&gt;的替代方案）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 4. 开放泛型场景</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// ============ 反模式2：Captive Dependency（俘获依赖）============</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 💀 Singleton 捕获了 Scoped 服务 → 内存泄漏 + 线程不安全</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ❌ 错误</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddScoped</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AppDbContext</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddSingleton</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">UserCacheService</span><span style="color:#ABB2BF;">&gt;();  </span><span style="color:#7F848E;font-style:italic;">// Singleton</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> UserCacheService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> AppDbContext</span><span style="color:#E06C75;"> _db</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;">// 💀 Scoped 被 Singleton 捕获！</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> UserCacheService</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AppDbContext</span><span style="color:#E5C07B;"> db</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _db</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> db</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 这个 DbContext 永远不会被释放</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 它的连接一直占用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 多个请求共享同一个 DbContext → 线程不安全</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ✅ 正确：使用 IServiceScopeFactory</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddSingleton</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">UserCacheService</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> UserCacheService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IServiceScopeFactory</span><span style="color:#E06C75;"> _scopeFactory</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> UserCacheService</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">IServiceScopeFactory</span><span style="color:#E5C07B;"> scopeFactory</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _scopeFactory</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> scopeFactory</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">User</span><span style="color:#ABB2BF;">?&gt; </span><span style="color:#61AFEF;">GetUserAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> id</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 每次需要时创建新的Scope</span></span>
<span class="line"><span style="color:#C678DD;">        using</span><span style="color:#C678DD;"> var</span><span style="color:#E06C75;"> scope</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _scopeFactory</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">CreateScope</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> db</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> scope</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ServiceProvider</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AppDbContext</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">db</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Users</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FindAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">id</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // scope 结束时 DbContext 被释放</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ✅ 或者直接改成 Scoped</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddScoped</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">UserCacheService</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 但要注意：Scoped服务只在请求范围内有效</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 如果你需要跨请求缓存，就必须用Singleton+ScopeFactory</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// ============ 反模式3：中间件顺序错误 ============</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ❌ 错误顺序：</span></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">UseAuthorization</span><span style="color:#ABB2BF;">();    </span><span style="color:#7F848E;font-style:italic;">// 💀 在 UseAuthentication 之前！</span></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">UseAuthentication</span><span style="color:#ABB2BF;">();   </span><span style="color:#7F848E;font-style:italic;">// 太晚了！</span></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">UseRouting</span><span style="color:#ABB2BF;">();          </span><span style="color:#7F848E;font-style:italic;">// 💀 在 UseAuthorization 之后！</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 授权检查时 User 还没有被设置（因为认证还没执行）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 路由匹配时已经错过了授权检查</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ✅ 正确顺序：</span></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">UseRouting</span><span style="color:#ABB2BF;">();          </span><span style="color:#7F848E;font-style:italic;">// 1. 匹配路由</span></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">UseAuthentication</span><span style="color:#ABB2BF;">();   </span><span style="color:#7F848E;font-style:italic;">// 2. 认证身份</span></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">UseAuthorization</span><span style="color:#ABB2BF;">();    </span><span style="color:#7F848E;font-style:italic;">// 3. 检查权限</span></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">MapControllers</span><span style="color:#ABB2BF;">();      </span><span style="color:#7F848E;font-style:italic;">// 4. 执行端点</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// ============ 反模式4：在 Middleware 构造函数中使用 Scoped 服务 ============</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ❌ 错误</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> BadMiddleware</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> AppDbContext</span><span style="color:#E06C75;"> _db</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;">// 💀 中间件是Singleton！</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> BadMiddleware</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">RequestDelegate</span><span style="color:#E5C07B;"> next</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">AppDbContext</span><span style="color:#E5C07B;"> db</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 构造函数只在应用启动时调用一次</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // _db 是根Scope的实例，永远不释放</span></span>
<span class="line"><span style="color:#E06C75;">        _next</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> next</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _db</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> db</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ✅ 正确：Scoped 服务放在 Invoke 方法的参数中</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> GoodMiddleware</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> RequestDelegate</span><span style="color:#E06C75;"> _next</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> GoodMiddleware</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">RequestDelegate</span><span style="color:#E5C07B;"> next</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _next</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> next</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 构造函数只注入 Singleton 服务</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> Invoke</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">AppDbContext</span><span style="color:#E5C07B;"> db</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        //                                        ^^^^^^^^^^^^</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 Scoped 服务通过 Invoke 方法参数注入</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 每个请求都会从当前 Scope 解析新实例</span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#E5C07B;">db</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">AuditLogs</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddAsync</span><span style="color:#ABB2BF;">(new </span><span style="color:#E5C07B;">AuditLog</span><span style="color:#ABB2BF;"> { </span><span style="color:#7F848E;font-style:italic;">/* ... */</span><span style="color:#ABB2BF;"> });</span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#61AFEF;">_next</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// ============ 反模式5：在异步代码中阻塞 ============</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ❌ 错误：同步等待异步方法</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> BadController</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">ControllerBase</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#ABB2BF;">    [</span><span style="color:#E5C07B;">HttpGet</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> IActionResult</span><span style="color:#61AFEF;"> Get</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 💀 .Result 会阻塞线程</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> users</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _userService</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetAllAsync</span><span style="color:#ABB2BF;">().</span><span style="color:#E5C07B;">Result</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 💀 .Wait() 也会阻塞</span></span>
<span class="line"><span style="color:#E5C07B;">        _userService</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">SaveAsync</span><span style="color:#ABB2BF;">().</span><span style="color:#61AFEF;">Wait</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 💀 .GetAwaiter().GetResult() 同样阻塞</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> user</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _userService</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetByIdAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;1&quot;</span><span style="color:#ABB2BF;">).</span><span style="color:#61AFEF;">GetAwaiter</span><span style="color:#ABB2BF;">().</span><span style="color:#61AFEF;">GetResult</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#61AFEF;"> Ok</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">users</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 在 ASP.NET Core 中阻塞异步调用可能导致：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 1. 线程池耗尽（Thread Pool Starvation）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 2. 死锁（在某些SynchronizationContext下）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 3. 性能严重下降</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ✅ 正确：一路 async/await</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> GoodController</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">ControllerBase</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#ABB2BF;">    [</span><span style="color:#E5C07B;">HttpGet</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IActionResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">Get</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> users</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_userService</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetAllAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#61AFEF;"> Ok</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">users</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十八、openiddict-中运用的设计模式" tabindex="-1"><a class="header-anchor" href="#十八、openiddict-中运用的设计模式"><span>十八、OpenIddict 中运用的设计模式</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│           OpenIddict 框架中的设计模式运用                                  │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  1. Builder 模式                                                         │</span></span>
<span class="line"><span>│  ═══════════                                                             │</span></span>
<span class="line"><span>│  services.AddOpenIddict()                        // OpenIddictBuilder    │</span></span>
<span class="line"><span>│      .AddCore(options =&gt; { })                    // CoreBuilder          │</span></span>
<span class="line"><span>│      .AddServer(options =&gt; { })                  // ServerBuilder        │</span></span>
<span class="line"><span>│      .AddValidation(options =&gt; { })              // ValidationBuilder    │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  每个Builder注册不同层级的服务到DI                                        │</span></span>
<span class="line"><span>│  Core: 数据访问（Application, Authorization, Token, Scope 管理器）       │</span></span>
<span class="line"><span>│  Server: OAuth/OIDC 协议处理                                             │</span></span>
<span class="line"><span>│  Validation: Token 验证                                                  │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  2. 事件驱动 + 责任链                                                    │</span></span>
<span class="line"><span>│  ════════════════════                                                    │</span></span>
<span class="line"><span>│  OpenIddict 的核心就是一个事件处理管道                                    │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  请求到达 → 产生事件 → 事件处理器链逐个处理                               │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  Token请求的事件链：                                                      │</span></span>
<span class="line"><span>│  ┌───────────────────────────────────────────────────────────────────┐   │</span></span>
<span class="line"><span>│  │ ExtractTokenRequest                                               │   │</span></span>
<span class="line"><span>│  │   → 从HTTP请求中提取Token请求参数                                   │   │</span></span>
<span class="line"><span>│  │                                                                   │   │</span></span>
<span class="line"><span>│  │ ValidateTokenRequest                                              │   │</span></span>
<span class="line"><span>│  │   → ValidateClientId          验证client_id                       │   │</span></span>
<span class="line"><span>│  │   → ValidateClientSecret      验证client_secret                   │   │</span></span>
<span class="line"><span>│  │   → ValidateGrantType         验证grant_type                      │   │</span></span>
<span class="line"><span>│  │   → ValidateRedirectUri       验证redirect_uri                    │   │</span></span>
<span class="line"><span>│  │   → ValidateAuthorizationCode 验证授权码                           │   │</span></span>
<span class="line"><span>│  │   → ValidateRefreshToken      验证刷新令牌                         │   │</span></span>
<span class="line"><span>│  │   → ...                                                           │   │</span></span>
<span class="line"><span>│  │                                                                   │   │</span></span>
<span class="line"><span>│  │ HandleTokenRequest                                                │   │</span></span>
<span class="line"><span>│  │   → 签发 AccessToken                                               │   │</span></span>
<span class="line"><span>│  │   → 签发 IdToken                                                   │   │</span></span>
<span class="line"><span>│  │   → 签发 RefreshToken                                              │   │</span></span>
<span class="line"><span>│  │                                                                   │   │</span></span>
<span class="line"><span>│  │ ApplyTokenResponse                                                │   │</span></span>
<span class="line"><span>│  │   → 将Token响应写入HTTP响应                                        │   │</span></span>
<span class="line"><span>│  └───────────────────────────────────────────────────────────────────┘   │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  每个事件可以有多个Handler                                                │</span></span>
<span class="line"><span>│  Handler按顺序执行（责任链）                                              │</span></span>
<span class="line"><span>│  任何Handler可以：                                                       │</span></span>
<span class="line"><span>│    context.Reject()  → 拒绝请求，终止链                                  │</span></span>
<span class="line"><span>│    context.SkipRequest() → 跳过（Passthrough到Controller）               │</span></span>
<span class="line"><span>│    context.HandleRequest() → 处理完毕，终止链                             │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  3. 策略模式                                                             │</span></span>
<span class="line"><span>│  ═══════════                                                             │</span></span>
<span class="line"><span>│  IOpenIddictApplicationStore&lt;T&gt;  → EFCore实现 / 自定义实现               │</span></span>
<span class="line"><span>│  IOpenIddictTokenStore&lt;T&gt;        → EFCore实现 / 自定义实现               │</span></span>
<span class="line"><span>│  IOpenIddictAuthorizationStore&lt;T&gt;→ EFCore实现 / 自定义实现               │</span></span>
<span class="line"><span>│  IOpenIddictScopeStore&lt;T&gt;        → EFCore实现 / 自定义实现               │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  替换存储实现不需要修改任何协议处理逻辑                                    │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  4. 适配器模式                                                           │</span></span>
<span class="line"><span>│  ═══════════                                                             │</span></span>
<span class="line"><span>│  OpenIddict.Server.AspNetCore 是适配器                                   │</span></span>
<span class="line"><span>│  将 OpenIddict 的协议处理适配到 ASP.NET Core 的认证系统                    │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  OpenIddict Server（协议层）                                              │</span></span>
<span class="line"><span>│      ↕ OpenIddict.Server.AspNetCore（适配层）                             │</span></span>
<span class="line"><span>│  ASP.NET Core Authentication（框架层）                                    │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  5. Options 模式                                                         │</span></span>
<span class="line"><span>│  ═══════════                                                             │</span></span>
<span class="line"><span>│  OpenIddictServerOptions                                                 │</span></span>
<span class="line"><span>│  ├── AuthorizationEndpointUris                                          │</span></span>
<span class="line"><span>│  ├── TokenEndpointUris                                                  │</span></span>
<span class="line"><span>│  ├── EncryptionCredentials                                              │</span></span>
<span class="line"><span>│  ├── SigningCredentials                                                 │</span></span>
<span class="line"><span>│  ├── DisableAccessTokenEncryption                                       │</span></span>
<span class="line"><span>│  └── GrantTypes                                                         │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  所有配置通过 Options 模式统一管理                                        │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="openiddict-事件处理器源码" tabindex="-1"><a class="header-anchor" href="#openiddict-事件处理器源码"><span>OpenIddict 事件处理器源码</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// OpenIddict 事件处理的核心循环</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: openiddict-core/src/OpenIddict.Server/OpenIddictServerDispatcher.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> sealed</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> OpenIddictServerDispatcher</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IOpenIddictServerDispatcher</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IServiceProvider</span><span style="color:#E06C75;"> _provider</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> ValueTask</span><span style="color:#61AFEF;"> DispatchAsync</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TContext</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E5C07B;">TContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        where</span><span style="color:#E5C07B;"> TContext</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">BaseContext</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 从DI获取所有处理此事件的Handler</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> handlers</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> _provider</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">GetServices</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IOpenIddictServerHandler</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TContext</span><span style="color:#ABB2BF;">&gt;&gt;()</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">OrderBy</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">h</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#E5C07B;">h</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Order</span><span style="color:#ABB2BF;">);  </span><span style="color:#7F848E;font-style:italic;">// 按优先级排序</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 责任链：逐个执行</span></span>
<span class="line"><span style="color:#C678DD;">        foreach</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> handler</span><span style="color:#C678DD;"> in</span><span style="color:#E06C75;"> handlers</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">handler</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">HandleAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 检查Handler的处理结果</span></span>
<span class="line"><span style="color:#C678DD;">            switch</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // 🔥 请求被拒绝 → 终止链</span></span>
<span class="line"><span style="color:#C678DD;">                case</span><span style="color:#E5C07B;"> BaseRequestContext</span><span style="color:#ABB2BF;"> { </span><span style="color:#E5C07B;">IsRejected</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#ABB2BF;"> }:</span></span>
<span class="line"><span style="color:#C678DD;">                    return</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // 🔥 请求已处理 → 终止链</span></span>
<span class="line"><span style="color:#C678DD;">                case</span><span style="color:#E5C07B;"> BaseRequestContext</span><span style="color:#ABB2BF;"> { </span><span style="color:#E5C07B;">IsRequestHandled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#ABB2BF;"> }:</span></span>
<span class="line"><span style="color:#C678DD;">                    return</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // 🔥 请求被跳过（Passthrough）→ 终止链</span></span>
<span class="line"><span style="color:#C678DD;">                case</span><span style="color:#E5C07B;"> BaseRequestContext</span><span style="color:#ABB2BF;"> { </span><span style="color:#E5C07B;">IsRequestSkipped</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#ABB2BF;"> }:</span></span>
<span class="line"><span style="color:#C678DD;">                    return</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 继续下一个Handler</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 自定义 OpenIddict 事件处理器</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 🔥 这就是你扩展OpenIddict行为的主要方式</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> MyCustomTokenHandler</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IOpenIddictServerHandler</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">ValidateTokenRequestContext</span><span style="color:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> OpenIddictServerHandlerDescriptor</span><span style="color:#ABB2BF;"> Descriptor { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#56B6C2;">        =</span><span style="color:#E5C07B;"> OpenIddictServerHandlerDescriptor</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">CreateBuilder</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">ValidateTokenRequestContext</span><span style="color:#ABB2BF;">&gt;()</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">UseScopedHandler</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">MyCustomTokenHandler</span><span style="color:#ABB2BF;">&gt;()</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">SetOrder</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">ValidateClientId</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Descriptor</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Order</span><span style="color:#56B6C2;"> +</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">)  </span><span style="color:#7F848E;font-style:italic;">// 在客户端验证之后</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">Build</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> ValueTask</span><span style="color:#61AFEF;"> HandleAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">ValidateTokenRequestContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 自定义验证逻辑</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ClientId</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;blocked-client&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            context</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Reject</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">                error</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;access_denied&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">                description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;This client has been blocked.&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 🔥 链终止，后续Handler不执行</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 不做任何操作 → 继续链中的下一个Handler</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 注册自定义Handler</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddOpenIddict</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    .</span><span style="color:#61AFEF;">AddServer</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">options</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        options</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddEventHandler</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">MyCustomTokenHandler</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Descriptor</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    });</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十九、设计模式之间的协作关系" tabindex="-1"><a class="header-anchor" href="#十九、设计模式之间的协作关系"><span>十九、设计模式之间的协作关系</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>在一个SSO Token请求中，所有设计模式如何协作：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>POST /connect/token</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>│ 🏗️ Builder模式</span></span>
<span class="line"><span>│ 应用启动时，WebApplicationBuilder 构建了整个应用</span></span>
<span class="line"><span>│ OpenIddictBuilder 注册了所有OAuth服务</span></span>
<span class="line"><span>│ ApplicationBuilder 构建了中间件管道</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>▼</span></span>
<span class="line"><span>Kestrel 接收请求</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>│ 🔌 适配器模式</span></span>
<span class="line"><span>│ Kestrel Feature → DefaultHttpContext</span></span>
<span class="line"><span>│ 底层字节流 → 高层HttpRequest/HttpResponse</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>▼</span></span>
<span class="line"><span>中间件管道执行</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>│ ⛓️ 责任链模式（管道级）</span></span>
<span class="line"><span>│ ForwardedHeaders → ExceptionHandler → Routing → Authentication → ...</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>│ 🧅 洋葱模型（装饰器的变体）</span></span>
<span class="line"><span>│ ExceptionHandler try { await next() } catch { }</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>▼</span></span>
<span class="line"><span>AuthenticationMiddleware</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>│ ⛓️ 责任链模式（Handler级）</span></span>
<span class="line"><span>│ OpenIddictServerHandler.HandleRequestAsync()</span></span>
<span class="line"><span>│   → 路径匹配 &quot;/connect/token&quot; ✅</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>│ 🎯 策略模式</span></span>
<span class="line"><span>│ 根据 Scheme 名称选择 Handler</span></span>
<span class="line"><span>│ &quot;OpenIddict.Server&quot; → OpenIddictServerAspNetCoreHandler</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>│ 📋 模板方法模式</span></span>
<span class="line"><span>│ AuthenticationHandler.AuthenticateAsync()</span></span>
<span class="line"><span>│   → 固定步骤：检查转发 → 初始化 → HandleAuthenticateAsync() → 记录日志</span></span>
<span class="line"><span>│                                      ^^^^^^^^^^^^^^^^^^^^^^^^</span></span>
<span class="line"><span>│                                      子类实现的可变步骤</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>▼</span></span>
<span class="line"><span>OpenIddict 事件处理</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>│ ⛓️ 责任链模式（事件级）</span></span>
<span class="line"><span>│ ExtractTokenRequest handlers...</span></span>
<span class="line"><span>│ ValidateTokenRequest handlers...</span></span>
<span class="line"><span>│ HandleTokenRequest handlers...</span></span>
<span class="line"><span>│ ApplyTokenResponse handlers...</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>│ 📦 策略模式（存储层）</span></span>
<span class="line"><span>│ IOpenIddictApplicationStore → EfCoreApplicationStore</span></span>
<span class="line"><span>│ IOpenIddictTokenStore → EfCoreTokenStore</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>│ 🏭 工厂模式（DI容器）</span></span>
<span class="line"><span>│ serviceProvider.GetRequiredService&lt;IOpenIddictApplicationManager&gt;()</span></span>
<span class="line"><span>│ → 创建Manager实例（带有所有依赖注入）</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>│ ⚙️ Options模式</span></span>
<span class="line"><span>│ IOptions&lt;OpenIddictServerOptions&gt;</span></span>
<span class="line"><span>│   → TokenEndpointUris, SigningCredentials, GrantTypes...</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>│ 🔄 依赖倒置</span></span>
<span class="line"><span>│ Handler → IOpenIddictApplicationManager (接口)</span></span>
<span class="line"><span>│                     ↓</span></span>
<span class="line"><span>│           OpenIddictApplicationManager (实现)</span></span>
<span class="line"><span>│                     ↓</span></span>
<span class="line"><span>│           IOpenIddictApplicationStore (接口)</span></span>
<span class="line"><span>│                     ↓</span></span>
<span class="line"><span>│           EfCoreApplicationStore (实现)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>▼</span></span>
<span class="line"><span>Token签发完成 → 写入HTTP响应</span></span>
<span class="line"><span></span></span>
<span class="line"><span>│ 👀 观察者模式</span></span>
<span class="line"><span>│ DiagnosticSource 通知请求完成</span></span>
<span class="line"><span>│ Activity 记录分布式追踪信息</span></span>
<span class="line"><span>│ ILogger 记录日志（多个Provider同时接收）</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>▼</span></span>
<span class="line"><span>HostingApplication.DisposeContext</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>│ 🔄 生命周期管理</span></span>
<span class="line"><span>│ DI Scope 释放 → 所有 Scoped 服务被释放</span></span>
<span class="line"><span>│ HttpContext 归还对象池 → 工厂模式（回收）</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>▼</span></span>
<span class="line"><span>响应发送回客户端</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="二十、检验你的理解" tabindex="-1"><a class="header-anchor" href="#二十、检验你的理解"><span>二十、检验你的理解</span></a></h2><p><strong>1. 为什么 <a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core 选择 &quot;Add+Use&quot; 分离模式？如果合并成一步会有什么问题？</strong></p><p>（答案：分离模式把&quot;能力注册&quot;和&quot;行为启用&quot;解耦。如果合并成一步：① 无法控制中间件顺序——<code>AddAuthentication()</code> 和 <code>AddAuthorization()</code> 的注册顺序不代表执行顺序，但 <code>UseAuthentication()</code> 和 <code>UseAuthorization()</code> 的顺序决定了执行顺序。② 无法只注册不启用——有些场景你需要注册认证服务但手动调用（比如在Controller中手动 <code>HttpContext.AuthenticateAsync()</code>），不需要全局中间件。③ 无法在测试中灵活配置——单元测试只需要DI注册，不需要中间件管道。）</p><p><strong>2. Builder 模式中 Build() 后&quot;冻结&quot;的设计意味着什么？举一个冻结后尝试修改导致问题的例子。</strong></p><p>（答案：冻结意味着构建完成后的对象是不可变的。典型例子：<code>builder.Build()</code> 之后尝试 <code>builder.Services.AddSingleton&lt;IMyService, MyService&gt;()</code> 会抛出异常——因为 <code>IServiceCollection</code> 已经被编译成 <code>IServiceProvider</code>，无法再添加服务。DI容器冻结后可以做很多优化（预计算依赖图、生成IL代码等），如果允许运行时修改就无法做这些优化。路由系统也是——DFA图在第一个请求时构建完成后不再改变，保证了O(段数)的匹配性能。）</p><p><strong>3. 中间件管道既是责任链又是装饰器，这两个模式的边界在哪里？</strong></p><p>（答案：从请求传递的角度看，是责任链——请求依次经过每个中间件，每个中间件决定是否传递给下一个。从功能增强的角度看，是装饰器——ExceptionHandler&quot;装饰&quot;了整个内层管道，添加了异常处理能力；ResponseCompression&quot;装饰&quot;了响应写入，添加了压缩能力。关键区别：责任链强调的是&quot;谁来处理&quot;（请求可能在任何一个环节被终止），装饰器强调的是&quot;透明增强&quot;（对内层和外层都透明，不改变核心行为）。<a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core 的中间件同时具备这两个特征。）</p><p><strong>4. Options 的三种形态（IOptions、IOptionsSnapshot、IOptionsMonitor），在 SSO 项目中各自适合什么场景？</strong></p><p>（答案：<code>IOptions&lt;T&gt;</code>（Singleton，不更新）：适合 OpenIddict Server 配置、JWT签名密钥——这些配置一旦设定就不应该在运行时改变，改了可能导致正在使用旧密钥的Token失效。<code>IOptionsSnapshot&lt;T&gt;</code>（Scoped，每请求更新）：适合客户端限流配置、密码策略配置——修改后下一个请求就生效，但同一个请求内一致。<code>IOptionsMonitor&lt;T&gt;</code>（Singleton，实时更新+通知）：适合日志级别、动态功能开关——需要立即生效并且需要知道&quot;配置变了&quot;来做额外操作（如清缓存）。）</p><p><strong>5. Captive Dependency（俘获依赖）问题的本质是什么？在 SSO 项目中可能出现在什么地方？</strong></p><p>（答案：本质是长生命周期的服务持有了短生命周期服务的引用，导致短生命周期服务无法正常释放。在SSO项目中：如果你写了一个Singleton的TokenCacheService注入了Scoped的AppDbContext——DbContext被Singleton捕获，永远不释放，连接池泄漏，多线程共用同一个DbContext导致数据竞争。解决方案：Singleton服务注入 <code>IServiceScopeFactory</code>，在需要时创建Scope手动解析Scoped服务。<a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core DI 默认在 Debug 模式会检测这个问题——<code>ValidateScopes = true</code>。）</p><p><strong>6. OpenIddict 的事件处理器链和 <a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core 的中间件管道有什么异同？</strong></p><p>（答案：相同点：都是责任链模式；都可以在任一环节终止（中间件不调用next，OpenIddict Handler调用Reject/HandleRequest）；都按注册顺序执行。不同点：① 中间件是&quot;洋葱模型&quot;（双向，有请求阶段和响应阶段），OpenIddict Handler是单向的（处理完就完了）。② 中间件通过 <code>next</code> 委托串联（编译时确定），OpenIddict Handler通过 <code>IServiceProvider.GetServices&lt;&gt;()</code> 获取（运行时解析，可以动态添加）。③ 中间件处理的是HTTP请求级别的横切关注点，OpenIddict Handler处理的是OAuth协议级别的业务逻辑步骤。④ 中间件的终止方式是&quot;不调用next&quot;，OpenIddict Handler的终止方式是设置context状态（Reject/HandleRequest/SkipRequest）。）</p><hr><p><strong>第5层学习完成！</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>学习进度：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>✅ 第1层：宏观全景（整体架构）</span></span>
<span class="line"><span>✅ 第2层：启动流程（CreateBuilder → Build → Run）</span></span>
<span class="line"><span>✅ 第3层：中间件管道（核心）</span></span>
<span class="line"><span>✅ 第4层：六大子系统（DI / 配置 / 认证 / 授权 / 路由 / Kestrel）</span></span>
<span class="line"><span>✅ 第5层：设计哲学与模式</span></span>
<span class="line"><span></span></span>
<span class="line"><span>剩余：</span></span>
<span class="line"><span>⬜ 第6层：源码阅读与调试指南</span></span>
<span class="line"><span>⬜ 第7层：OpenIddict SSO 完整实战</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>接下来你想进入哪一层？</strong></p><ul><li><strong>第6层：源码阅读与调试指南</strong> —— 如何高效阅读 <a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core / OpenIddict 源码，如何用调试器追踪框架内部执行流程</li><li><strong>第7层：OpenIddict SSO 完整实战</strong> —— 从零搭建完整的 SSO 系统（授权服务器 + 客户端 + API资源服务器）</li></ul>`,139)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};