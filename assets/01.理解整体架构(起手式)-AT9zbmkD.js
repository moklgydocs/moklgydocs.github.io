import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-Xe9WRGmJ.js";var i=JSON.parse(`{"path":"/%E5%90%8E%E7%AB%AF%E5%BC%80%E5%8F%91/ASP.NET_Core/%E6%8F%90%E9%97%AE%E5%BC%8F%E5%AD%A6%E4%B9%A0asp.netcore/01.%E7%90%86%E8%A7%A3%E6%95%B4%E4%BD%93%E6%9E%B6%E6%9E%84(%E8%B5%B7%E6%89%8B%E5%BC%8F).html","title":"理解整体架构","lang":"zh-CN","frontmatter":{"title":"理解整体架构","date":"2025-04-09T00:00:00.000Z","category":["ASP.NET_Core"],"tag":["asp.netcore","架构"],"author":"Moklgy","order":1},"git":{"createdTime":1776074807000,"updatedTime":1776074807000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":7.27,"words":2182},"filePathRelative":"后端开发/ASP.NET_Core/提问式学习asp.netcore/01.理解整体架构(起手式).md"}`),a={name:`01.理解整体架构(起手式).md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="asp-net-core-宏观全景-彻底理解整体架构" tabindex="-1"><a class="header-anchor" href="#asp-net-core-宏观全景-彻底理解整体架构"><span><a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core 宏观全景：彻底理解整体架构</span></a></h1><hr><h2 id="一、先记住一句话-核心设计理念" tabindex="-1"><a class="header-anchor" href="#一、先记住一句话-核心设计理念"><span>一、先记住一句话（核心设计理念）</span></a></h2><blockquote><p><strong><a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core 本质上就是一个&quot;把 HTTP 请求变成 HTTP 响应的管道机器&quot;，其他一切都是围绕这条管道的扩展。</strong></p></blockquote><p>记住这句话，后面所有的东西都能串起来。</p><hr><h2 id="二、整体架构分层图" tabindex="-1"><a class="header-anchor" href="#二、整体架构分层图"><span>二、整体架构分层图</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌─────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                      你的应用代码                            │</span></span>
<span class="line"><span>│         Controllers / Razor Pages / Minimal APIs            │</span></span>
<span class="line"><span>│         SignalR / gRPC / Blazor Server                      │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                   应用框架层 (App Framework)                 │</span></span>
<span class="line"><span>│              MVC / Routing / Model Binding                  │</span></span>
<span class="line"><span>│              Authentication / Authorization                 │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                   中间件管道层 (Middleware Pipeline)         │</span></span>
<span class="line"><span>│     HttpContext → Middleware1 → Middleware2 → ... → Response│</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                   宿主层 (Hosting)                          │</span></span>
<span class="line"><span>│          WebApplication / Host / Lifetime管理               │</span></span>
<span class="line"><span>│          DI容器 / Configuration / Logging                   │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                   服务器层 (Server)                          │</span></span>
<span class="line"><span>│              Kestrel / HTTP.sys / IIS                       │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                   .NET Runtime                              │</span></span>
<span class="line"><span>│              CLR / BCL / 线程池 / GC                         │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们从底向上看，每一层做什么：</p><hr><h2 id="三、逐层深入讲解" tabindex="-1"><a class="header-anchor" href="#三、逐层深入讲解"><span>三、逐层深入讲解</span></a></h2><h3 id="🔹-第1层-服务器层-server-——-负责网络通信" tabindex="-1"><a class="header-anchor" href="#🔹-第1层-服务器层-server-——-负责网络通信"><span>🔹 第1层：服务器层（Server）—— 负责网络通信</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>职责：监听端口、接收TCP连接、解析HTTP协议、生成原始请求数据</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>Kestrel</strong> 是 <a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core 默认的跨平台 HTTP 服务器。</p><p>关键理解：</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// Kestrel 实现了这个接口</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 源码位置: src/Servers/Kestrel/Core/src/KestrelServer.cs</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> KestrelServer</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IServer</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 这是核心方法 —— 接收到请求后，交给上层处理</span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#61AFEF;"> StartAsync</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TContext</span><span style="color:#ABB2BF;">&gt;(</span></span>
<span class="line"><span style="color:#E5C07B;">        IHttpApplication</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TContext</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">application</span><span style="color:#ABB2BF;">,  </span><span style="color:#7F848E;font-style:italic;">// 👈 上层应用</span></span>
<span class="line"><span style="color:#E5C07B;">        CancellationToken</span><span style="color:#E5C07B;"> cancellationToken</span></span>
<span class="line"><span style="color:#ABB2BF;">    );</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>关键接口：<code>IServer</code></strong></p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 源码位置: src/Hosting/Abstractions/src/IServer.cs</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> IServer</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IDisposable</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    IFeatureCollection</span><span style="color:#ABB2BF;"> Features { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#61AFEF;"> StartAsync</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TContext</span><span style="color:#ABB2BF;">&gt;(</span></span>
<span class="line"><span style="color:#E5C07B;">        IHttpApplication</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TContext</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">application</span><span style="color:#ABB2BF;">, </span></span>
<span class="line"><span style="color:#E5C07B;">        CancellationToken</span><span style="color:#E5C07B;"> cancellationToken</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#61AFEF;"> StopAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">CancellationToken</span><span style="color:#E5C07B;"> cancellationToken</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>设计思想</strong>：服务器层只管&quot;收发数据&quot;，不管&quot;业务逻辑&quot;。通过 <code>IServer</code> 接口解耦，你可以换成 HTTP.sys、甚至自己写一个 Server。</p></blockquote><hr><h3 id="🔹-第2层-宿主层-hosting-——-负责组装一切" tabindex="-1"><a class="header-anchor" href="#🔹-第2层-宿主层-hosting-——-负责组装一切"><span>🔹 第2层：宿主层（Hosting）—— 负责组装一切</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>职责：创建DI容器、加载配置、注册服务、构建中间件管道、管理应用生命周期</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>这是<strong>整个框架的&quot;总调度中心&quot;</strong>。</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 你每天写的代码：</span></span>
<span class="line"><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> builder</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> WebApplication</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">CreateBuilder</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">args</span><span style="color:#ABB2BF;">);  </span><span style="color:#7F848E;font-style:italic;">// 👈 准备阶段</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ... 注册服务</span></span>
<span class="line"><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> app</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> builder</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Build</span><span style="color:#ABB2BF;">();  </span><span style="color:#7F848E;font-style:italic;">// 👈 构建阶段</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ... 配置管道</span></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Run</span><span style="color:#ABB2BF;">();  </span><span style="color:#7F848E;font-style:italic;">// 👈 运行阶段</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这三行代码背后，宿主层做了<strong>极其多的事情</strong>：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>CreateBuilder(args)</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── 创建 IConfiguration（加载 appsettings.json、环境变量、命令行参数）</span></span>
<span class="line"><span>    ├── 创建 IServiceCollection（DI 容器的&quot;注册表&quot;）</span></span>
<span class="line"><span>    ├── 注册框架核心服务（Kestrel、Routing、Logging...）</span></span>
<span class="line"><span>    ├── 配置 Kestrel 服务器</span></span>
<span class="line"><span>    └── 配置默认中间件</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>Build()</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── 将 IServiceCollection 编译成 IServiceProvider（DI容器&quot;冻结&quot;）</span></span>
<span class="line"><span>    ├── 创建 IHost 实例</span></span>
<span class="line"><span>    └── 创建中间件管道（RequestDelegate 链）</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>Run()</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── 启动 IHostedService（后台服务）</span></span>
<span class="line"><span>    ├── 启动 Kestrel 监听端口</span></span>
<span class="line"><span>    └── 阻塞主线程，等待关闭信号</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>核心源码文件：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>📁 src/DefaultBuilder/src/</span></span>
<span class="line"><span>    ├── WebApplication.cs          // WebApplication 类</span></span>
<span class="line"><span>    ├── WebApplicationBuilder.cs   // Builder 类</span></span>
<span class="line"><span>    └── WebHost.cs                 // 静态辅助类</span></span>
<span class="line"><span></span></span>
<span class="line"><span>📁 src/Hosting/Hosting/src/</span></span>
<span class="line"><span>    ├── GenericHost/</span></span>
<span class="line"><span>    │   └── GenericWebHostService.cs  // 真正启动Server的地方</span></span>
<span class="line"><span>    ├── WebHostBuilder.cs</span></span>
<span class="line"><span>    └── Internal/</span></span>
<span class="line"><span>        └── WebHost.cs</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>设计思想</strong>：Builder 模式。先收集所有配置和服务注册（可变阶段），然后一次性 Build 成不可变的运行时对象。这保证了运行时的性能和线程安全。</p></blockquote><hr><h3 id="🔹-第3层-中间件管道层-middleware-pipeline-——-框架的灵魂" tabindex="-1"><a class="header-anchor" href="#🔹-第3层-中间件管道层-middleware-pipeline-——-框架的灵魂"><span>🔹 第3层：中间件管道层（Middleware Pipeline）—— 框架的灵魂</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>职责：按顺序处理HTTP请求，每个中间件可以决定是否继续传递</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong><a href="http://xn--ASP-i68dr87hb6ag65q.NET" target="_blank" rel="noopener noreferrer">这是整个ASP.NET</a> Core最核心的设计，没有之一。</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>         请求进入</span></span>
<span class="line"><span>            │</span></span>
<span class="line"><span>            ▼</span></span>
<span class="line"><span>┌──────────────────────┐</span></span>
<span class="line"><span>│  ExceptionHandler    │──── 异常处理</span></span>
<span class="line"><span>│  Middleware          │</span></span>
<span class="line"><span>├──────────────────────┤</span></span>
<span class="line"><span>│  HTTPS Redirection   │──── HTTPS 重定向</span></span>
<span class="line"><span>│  Middleware          │</span></span>
<span class="line"><span>├──────────────────────┤</span></span>
<span class="line"><span>│  Static Files        │──── 静态文件（命中则直接返回）</span></span>
<span class="line"><span>│  Middleware          │</span></span>
<span class="line"><span>├──────────────────────┤</span></span>
<span class="line"><span>│  Authentication      │──── 认证（解析Token/Cookie → ClaimsPrincipal）</span></span>
<span class="line"><span>│  Middleware          │</span></span>
<span class="line"><span>├──────────────────────┤</span></span>
<span class="line"><span>│  Authorization       │──── 授权（检查权限）</span></span>
<span class="line"><span>│  Middleware          │</span></span>
<span class="line"><span>├──────────────────────┤</span></span>
<span class="line"><span>│  Routing             │──── 路由匹配 + 执行Endpoint</span></span>
<span class="line"><span>│  Middleware          │</span></span>
<span class="line"><span>├──────────────────────┤</span></span>
<span class="line"><span>│  Endpoint Execution  │──── 你的Controller/MinimalAPI</span></span>
<span class="line"><span>│  (MVC/Razor/etc)     │</span></span>
<span class="line"><span>└──────────────────────┘</span></span>
<span class="line"><span>            │</span></span>
<span class="line"><span>            ▼</span></span>
<span class="line"><span>         响应返回（原路返回，经过每一层的&quot;后处理&quot;）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>本质上，中间件就是一个函数：</strong></p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 中间件的本质 —— 它就是一个委托</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> delegate</span><span style="color:#E5C07B;"> Task</span><span style="color:#E5C07B;"> RequestDelegate</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 每个中间件长这样（伪代码）：</span></span>
<span class="line"><span style="color:#C678DD;">async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> MyMiddleware</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">RequestDelegate</span><span style="color:#E5C07B;"> next</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 👈 前处理（请求进来时执行）</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    await </span><span style="color:#61AFEF;">next</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">);  </span><span style="color:#7F848E;font-style:italic;">// 调用下一个中间件</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 👈 后处理（响应返回时执行）</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>管道是怎么串起来的？看源码：</strong></p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 源码位置: src/Http/Http/src/Builder/ApplicationBuilder.cs</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> ApplicationBuilder</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IApplicationBuilder</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> List</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">Func</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">RequestDelegate</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">RequestDelegate</span><span style="color:#ABB2BF;">&gt;&gt; </span><span style="color:#E06C75;">_components</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new();</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // app.Use() 就是往列表里加一个函数</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> IApplicationBuilder</span><span style="color:#61AFEF;"> Use</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Func</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">RequestDelegate</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">RequestDelegate</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">middleware</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        _components</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Add</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">middleware</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> this</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // Build() 把所有中间件倒序串成一条链</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> RequestDelegate</span><span style="color:#61AFEF;"> Build</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 管道最末端：如果没人处理，返回404</span></span>
<span class="line"><span style="color:#E5C07B;">        RequestDelegate</span><span style="color:#E06C75;"> app</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Response</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StatusCode</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 404</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">CompletedTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 关键！从后往前遍历，每个中间件包裹前一个</span></span>
<span class="line"><span style="color:#C678DD;">        for</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> c</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _components</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Count</span><span style="color:#56B6C2;"> -</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">c</span><span style="color:#56B6C2;"> &gt;=</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">c</span><span style="color:#56B6C2;">--</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E06C75;">            app</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _components</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">c</span><span style="color:#ABB2BF;">](</span><span style="color:#E06C75;">app</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> app</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>这段代码极其重要！</strong> 它揭示了管道的本质：<strong>俄罗斯套娃</strong>。每个中间件接收&quot;下一个中间件&quot;作为参数，返回一个&quot;新的处理函数&quot;。Build() 从后往前把它们套在一起。</p></blockquote><p>我用一个极简例子帮你彻底理解：</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 假设注册了3个中间件：A → B → C</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// Build过程（从后往前）：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 初始: app = 404处理</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 第1轮(C): app = C(404处理)     → C中间件包裹了404</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 第2轮(B): app = B(C(404处理))  → B中间件包裹了C</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 第3轮(A): app = A(B(C(404处理))) → A中间件包裹了B</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 最终的 RequestDelegate 就是:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// A( B( C( 404 ) ) )</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 请求进来时的执行顺序：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// A前处理 → B前处理 → C前处理 → 404 → C后处理 → B后处理 → A后处理</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="🔹-第4层-应用框架层-app-frameworks" tabindex="-1"><a class="header-anchor" href="#🔹-第4层-应用框架层-app-frameworks"><span>🔹 第4层：应用框架层（App Frameworks）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>职责：提供具体的编程模型（MVC、Razor Pages、Minimal APIs等）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>这一层本质上就是<strong>一组特殊的中间件和Endpoint</strong>：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌─────────────────────────────────────────────┐</span></span>
<span class="line"><span>│              应用框架（本质都是Endpoint）     │</span></span>
<span class="line"><span>│                                             │</span></span>
<span class="line"><span>│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │</span></span>
<span class="line"><span>│  │   MVC   │ │  Razor   │ │ Minimal APIs │  │</span></span>
<span class="line"><span>│  │         │ │  Pages   │ │  app.MapGet  │  │</span></span>
<span class="line"><span>│  └────┬────┘ └────┬─────┘ └──────┬───────┘  │</span></span>
<span class="line"><span>│       │           │               │         │</span></span>
<span class="line"><span>│       └───────────┴───────────────┘         │</span></span>
<span class="line"><span>│                    │                        │</span></span>
<span class="line"><span>│            Endpoint Routing                 │</span></span>
<span class="line"><span>│       (统一的路由匹配和执行机制)              │</span></span>
<span class="line"><span>└─────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>关键理解</strong>：MVC 不是&quot;特殊的存在&quot;，它只是注册了一堆 Endpoint 而已。</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// MVC 的本质：</span></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">UseRouting</span><span style="color:#ABB2BF;">();      </span><span style="color:#7F848E;font-style:italic;">// 中间件：匹配URL到Endpoint</span></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">UseEndpoints</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">e</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    e</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">MapControllers</span><span style="color:#ABB2BF;">();  </span><span style="color:#7F848E;font-style:italic;">// 把Controller的Action注册为Endpoint</span></span>
<span class="line"><span style="color:#ABB2BF;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// Minimal API 的本质：</span></span>
<span class="line"><span style="color:#E5C07B;">app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">MapGet</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;/hello&quot;</span><span style="color:#ABB2BF;">, () =&gt; </span><span style="color:#98C379;">&quot;Hello World&quot;</span><span style="color:#ABB2BF;">);  </span><span style="color:#7F848E;font-style:italic;">// 直接注册一个Endpoint</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 两者在路由系统眼里，地位完全一样，都是 Endpoint</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="🔹-第5层-你的应用代码" tabindex="-1"><a class="header-anchor" href="#🔹-第5层-你的应用代码"><span>🔹 第5层：你的应用代码</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>你写的Controller、Service、Repository等</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><hr><h2 id="四、与传统-asp-net-framework-的本质区别" tabindex="-1"><a class="header-anchor" href="#四、与传统-asp-net-framework-的本质区别"><span>四、与传统 <a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a>（Framework）的本质区别</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────────┬──────────────────────┬──────────────────────┐</span></span>
<span class="line"><span>│                  │  传统 ASP.NET         │  ASP.NET Core         │</span></span>
<span class="line"><span>├──────────────────┼──────────────────────┼──────────────────────┤</span></span>
<span class="line"><span>│  依赖            │  System.Web.dll      │  无（模块化NuGet包）    │</span></span>
<span class="line"><span>│                  │  (巨型单体)           │                       │</span></span>
<span class="line"><span>├──────────────────┼──────────────────────┼──────────────────────┤</span></span>
<span class="line"><span>│  服务器          │  必须IIS              │  Kestrel（跨平台）     │</span></span>
<span class="line"><span>├──────────────────┼──────────────────────┼──────────────────────┤</span></span>
<span class="line"><span>│  管道模型        │  HttpModule +         │  Middleware            │</span></span>
<span class="line"><span>│                  │  HttpHandler          │  (更简单、更灵活)      │</span></span>
<span class="line"><span>├──────────────────┼──────────────────────┼──────────────────────┤</span></span>
<span class="line"><span>│  DI              │  无内置               │  内置DI容器            │</span></span>
<span class="line"><span>├──────────────────┼──────────────────────┼──────────────────────┤</span></span>
<span class="line"><span>│  设计理念        │  大而全，紧耦合        │  小而美，可插拔         │</span></span>
<span class="line"><span>├──────────────────┼──────────────────────┼──────────────────────┤</span></span>
<span class="line"><span>│  性能            │  慢                   │  极快（TechEmpower      │</span></span>
<span class="line"><span>│                  │                      │  排名前列）             │</span></span>
<span class="line"><span>├──────────────────┼──────────────────────┼──────────────────────┤</span></span>
<span class="line"><span>│  本质区别        │  &quot;框架控制你&quot;          │  &quot;你控制框架&quot;           │</span></span>
<span class="line"><span>│                  │  Convention over      │  Explicit              │</span></span>
<span class="line"><span>│                  │  everything           │  configuration         │</span></span>
<span class="line"><span>└──────────────────┴──────────────────────┴──────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、三个关键的-万物互联-接口" tabindex="-1"><a class="header-anchor" href="#五、三个关键的-万物互联-接口"><span>五、三个关键的&quot;万物互联&quot;接口</span></a></h2><p>整个框架有三个接口把所有东西串起来：</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 1️⃣ HttpContext —— 一次请求的&quot;全部信息&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//    所有中间件、所有框架代码，都围绕这个对象工作</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> abstract</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> HttpContext</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> abstract</span><span style="color:#E5C07B;"> HttpRequest</span><span style="color:#ABB2BF;"> Request { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> abstract</span><span style="color:#E5C07B;"> HttpResponse</span><span style="color:#ABB2BF;"> Response { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> abstract</span><span style="color:#E5C07B;"> ClaimsPrincipal</span><span style="color:#ABB2BF;"> User { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; }  </span><span style="color:#7F848E;font-style:italic;">// 👈 认证结果</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> abstract</span><span style="color:#E5C07B;"> IServiceProvider</span><span style="color:#ABB2BF;"> RequestServices { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; } </span><span style="color:#7F848E;font-style:italic;">// 👈 DI(Scoped)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ...</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 2️⃣ IServiceProvider —— DI容器，获取任何已注册的服务</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//    贯穿整个应用的生命周期</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 3️⃣ RequestDelegate —— 中间件管道的执行链</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//    一个请求的完整处理逻辑</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> delegate</span><span style="color:#E5C07B;"> Task</span><span style="color:#E5C07B;"> RequestDelegate</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>三者的关系：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>                    IServiceProvider</span></span>
<span class="line"><span>                    (管理所有服务的生死)</span></span>
<span class="line"><span>                         │</span></span>
<span class="line"><span>                         │ 每个请求创建一个 Scope</span></span>
<span class="line"><span>                         ▼</span></span>
<span class="line"><span>  RequestDelegate ──► HttpContext ──► 你的代码</span></span>
<span class="line"><span>  (管道处理链)        (请求上下文)      (Controller等)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、整体运行流程-一图胜千言" tabindex="-1"><a class="header-anchor" href="#六、整体运行流程-一图胜千言"><span>六、整体运行流程（一图胜千言）</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>                    用户发送HTTP请求</span></span>
<span class="line"><span>                         │</span></span>
<span class="line"><span>                         ▼</span></span>
<span class="line"><span>              ┌─────────────────────┐</span></span>
<span class="line"><span>              │    操作系统 TCP栈     │</span></span>
<span class="line"><span>              └──────────┬──────────┘</span></span>
<span class="line"><span>                         │</span></span>
<span class="line"><span>                         ▼</span></span>
<span class="line"><span>              ┌─────────────────────┐</span></span>
<span class="line"><span>              │  Kestrel (IServer)   │  解析HTTP协议</span></span>
<span class="line"><span>              │  创建 HttpContext     │  ← 核心！每个请求一个</span></span>
<span class="line"><span>              └──────────┬──────────┘</span></span>
<span class="line"><span>                         │</span></span>
<span class="line"><span>                         ▼</span></span>
<span class="line"><span>              ┌─────────────────────┐</span></span>
<span class="line"><span>              │  HostingApplication  │  创建 Scope (DI)</span></span>
<span class="line"><span>              │  开始计时/日志        │  创建 Activity (诊断)</span></span>
<span class="line"><span>              └──────────┬──────────┘</span></span>
<span class="line"><span>                         │</span></span>
<span class="line"><span>                         ▼</span></span>
<span class="line"><span>              ┌─────────────────────┐</span></span>
<span class="line"><span>              │                     │</span></span>
<span class="line"><span>              │  RequestDelegate     │  中间件管道开始执行</span></span>
<span class="line"><span>              │  (中间件链)          │</span></span>
<span class="line"><span>              │                     │</span></span>
<span class="line"><span>              │  ExceptionHandler   │</span></span>
<span class="line"><span>              │       ↓             │</span></span>
<span class="line"><span>              │  Authentication     │  → 解析出 User (ClaimsPrincipal)</span></span>
<span class="line"><span>              │       ↓             │</span></span>
<span class="line"><span>              │  Authorization      │  → 检查权限</span></span>
<span class="line"><span>              │       ↓             │</span></span>
<span class="line"><span>              │  Routing            │  → 匹配 Endpoint</span></span>
<span class="line"><span>              │       ↓             │</span></span>
<span class="line"><span>              │  Endpoint Execute   │  → 执行你的 Controller Action</span></span>
<span class="line"><span>              │                     │</span></span>
<span class="line"><span>              └──────────┬──────────┘</span></span>
<span class="line"><span>                         │</span></span>
<span class="line"><span>                         ▼</span></span>
<span class="line"><span>              ┌─────────────────────┐</span></span>
<span class="line"><span>              │  写入 Response       │  </span></span>
<span class="line"><span>              │  释放 Scope          │  Scoped 服务在这里被释放</span></span>
<span class="line"><span>              │  Kestrel 发送响应    │</span></span>
<span class="line"><span>              └─────────────────────┘</span></span>
<span class="line"><span>                         │</span></span>
<span class="line"><span>                         ▼</span></span>
<span class="line"><span>                  用户收到HTTP响应</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、对你sso项目的启示" tabindex="-1"><a class="header-anchor" href="#七、对你sso项目的启示"><span>七、对你SSO项目的启示</span></a></h2><p>理解了全景图后，你的 OpenIddict SSO 项目在架构中的位置就清晰了：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌─────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  你的SSO应用代码                              │</span></span>
<span class="line"><span>│  ├── 登录页面Controller                      │</span></span>
<span class="line"><span>│  ├── Token端点                               │</span></span>
<span class="line"><span>│  └── 用户管理                                │</span></span>
<span class="line"><span>├─────────────────────────────────────────────┤</span></span>
<span class="line"><span>│  OpenIddict (应用框架层)                      │</span></span>
<span class="line"><span>│  ├── 注册了认证Handler (IAuthenticationHandler)│  ← 利用认证系统</span></span>
<span class="line"><span>│  ├── 注册了授权端点 (Endpoint)                 │  ← 利用路由系统</span></span>
<span class="line"><span>│  └── 注册了一堆服务 (DI)                       │  ← 利用DI系统</span></span>
<span class="line"><span>├─────────────────────────────────────────────┤</span></span>
<span class="line"><span>│  ASP.NET Core 中间件管道                      │</span></span>
<span class="line"><span>│  Authentication Middleware 会调用              │</span></span>
<span class="line"><span>│  OpenIddict 注册的 Handler                    │</span></span>
<span class="line"><span>├─────────────────────────────────────────────┤</span></span>
<span class="line"><span>│  宿主层 + Kestrel                            │</span></span>
<span class="line"><span>└─────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>OpenIddict 不是&quot;<a href="http://xn--ASP-xi9dn67np4j.NET" target="_blank" rel="noopener noreferrer">独立于ASP.NET</a> Core&quot;的东西，它是<strong><a href="http://xn--ASP-0v1e475ck2b888b.NET" target="_blank" rel="noopener noreferrer">深度嵌入ASP.NET</a> Core扩展点</strong>的框架。<a href="http://xn--ASP-0h9d972oro1a.NET" target="_blank" rel="noopener noreferrer">理解了ASP.NET</a> Core的架构，你才能理解OpenIddict为什么那样设计。</p></blockquote><hr><h2 id="八、检验你的理解" tabindex="-1"><a class="header-anchor" href="#八、检验你的理解"><span>八、检验你的理解</span></a></h2><p>试着回答这几个问题，如果都能答上来，说明全景图你已经掌握了：</p><ol><li><strong>一个HTTP请求，从网卡到你的Controller Action，经过了哪些层？</strong></li><li><strong>中间件管道的本质数据结构是什么？</strong>（答案：<code>Func&lt;RequestDelegate, RequestDelegate&gt;</code> 的列表，Build后变成嵌套的 <code>RequestDelegate</code>）</li><li><strong>为什么 <code>UseAuthentication()</code> 必须写在 <code>UseAuthorization()</code> 前面？</strong></li><li><strong>MVC Controller 和 <code>app.MapGet()</code> 在路由系统眼里有什么区别？</strong>（答案：没区别，都是Endpoint）</li><li><strong>HttpContext.RequestServices 获取的服务是哪个生命周期的DI Scope？</strong></li></ol><hr>`,73)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};