import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-BnvjiS9D.js";var i=JSON.parse(`{"path":"/%E5%90%8E%E7%AB%AF%E5%BC%80%E5%8F%91/ASP.NET_Core/%E6%8F%90%E9%97%AE%E5%BC%8F%E5%AD%A6%E4%B9%A0asp.netcore/06.%E8%AE%A4%E8%AF%81%E7%B3%BB%E7%BB%9F(Authentication).html","title":"认证系统(Authentication)","lang":"zh-CN","frontmatter":{"title":"认证系统(Authentication)","date":"2025-04-09T00:00:00.000Z","category":["ASP.NET_Core"],"tag":["asp.netcore","认证","Authentication","源码分析"],"author":"Moklgy","order":6},"git":{"createdTime":1776074807000,"updatedTime":1776074807000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":22.75,"words":6825},"filePathRelative":"后端开发/ASP.NET_Core/提问式学习asp.netcore/06.认证系统(Authentication).md"}`),a={name:`06.认证系统(Authentication).md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="asp-net-core-认证系统-authentication-源码级深入" tabindex="-1"><a class="header-anchor" href="#asp-net-core-认证系统-authentication-源码级深入"><span><a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core 认证系统（Authentication）：源码级深入</span></a></h1><hr><h2 id="一、核心认知" tabindex="-1"><a class="header-anchor" href="#一、核心认知"><span>一、核心认知</span></a></h2><blockquote><p><strong>认证系统的本质就是回答一个问题：&quot;这个请求是谁发的？&quot;</strong></p><p>它不关心&quot;这个人能不能做某件事&quot;（那是授权的事），它只负责从请求中提取身份信息，变成一个 <code>ClaimsPrincipal</code> 对象。</p></blockquote><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>HTTP请求（原始字节流）</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    │  Cookie: .AspNetCore.Identity.Application=CfDJ8...</span></span>
<span class="line"><span>    │  或</span></span>
<span class="line"><span>    │  Authorization: Bearer eyJhbGciOiJSUzI1NiIs...</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ▼</span></span>
<span class="line"><span>认证系统</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    │  解析、验证、解密</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ▼</span></span>
<span class="line"><span>ClaimsPrincipal（结构化的身份信息）</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    │  Name: &quot;zhangsan&quot;</span></span>
<span class="line"><span>    │  Role: &quot;Admin&quot;</span></span>
<span class="line"><span>    │  Email: &quot;zhangsan@example.com&quot;</span></span>
<span class="line"><span>    │  sub: &quot;user-guid-123&quot;</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ▼</span></span>
<span class="line"><span>context.User = claimsPrincipal;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="二、认证系统的整体架构" tabindex="-1"><a class="header-anchor" href="#二、认证系统的整体架构"><span>二、认证系统的整体架构</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                          认证系统全景                                      │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  ┌─────────────────────────────────────────────────────────────────────┐ │</span></span>
<span class="line"><span>│  │                    注册阶段 (DI)                                     │ │</span></span>
<span class="line"><span>│  │                                                                     │ │</span></span>
<span class="line"><span>│  │  services.AddAuthentication(defaultScheme)                          │ │</span></span>
<span class="line"><span>│  │      .AddCookie(&quot;Cookies&quot;, options =&gt; {...})                        │ │</span></span>
<span class="line"><span>│  │      .AddJwtBearer(&quot;Bearer&quot;, options =&gt; {...})                      │ │</span></span>
<span class="line"><span>│  │      .AddOpenIdConnect(&quot;oidc&quot;, options =&gt; {...})                    │ │</span></span>
<span class="line"><span>│  │                                                                     │ │</span></span>
<span class="line"><span>│  │  注册了：                                                            │ │</span></span>
<span class="line"><span>│  │    AuthenticationScheme(&quot;Cookies&quot;, typeof(CookieAuthHandler))       │ │</span></span>
<span class="line"><span>│  │    AuthenticationScheme(&quot;Bearer&quot;, typeof(JwtBearerHandler))         │ │</span></span>
<span class="line"><span>│  │    AuthenticationScheme(&quot;oidc&quot;, typeof(OpenIdConnectHandler))       │ │</span></span>
<span class="line"><span>│  │                                                                     │ │</span></span>
<span class="line"><span>│  │  存储在 IAuthenticationSchemeProvider 中                              │ │</span></span>
<span class="line"><span>│  └─────────────────────────────────────────────────────────────────────┘ │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  ┌─────────────────────────────────────────────────────────────────────┐ │</span></span>
<span class="line"><span>│  │                    运行阶段 (中间件管道)                               │ │</span></span>
<span class="line"><span>│  │                                                                     │ │</span></span>
<span class="line"><span>│  │  app.UseAuthentication()                                            │ │</span></span>
<span class="line"><span>│  │      │                                                              │ │</span></span>
<span class="line"><span>│  │      ├── 遍历所有 IAuthenticationRequestHandler                      │ │</span></span>
<span class="line"><span>│  │      │   → OpenIddict Server Handler                                │ │</span></span>
<span class="line"><span>│  │      │   → 如果匹配 /connect/token → HandleRequestAsync() → 短路    │ │</span></span>
<span class="line"><span>│  │      │                                                              │ │</span></span>
<span class="line"><span>│  │      └── 执行默认认证方案                                             │ │</span></span>
<span class="line"><span>│  │          → context.AuthenticateAsync(&quot;Cookies&quot;)                     │ │</span></span>
<span class="line"><span>│  │          → 解析Cookie → 生成 ClaimsPrincipal                         │ │</span></span>
<span class="line"><span>│  │          → context.User = principal                                 │ │</span></span>
<span class="line"><span>│  │                                                                     │ │</span></span>
<span class="line"><span>│  │  app.UseAuthorization()                                             │ │</span></span>
<span class="line"><span>│  │      │                                                              │ │</span></span>
<span class="line"><span>│  │      └── 检查 context.User 是否满足 [Authorize] 要求                 │ │</span></span>
<span class="line"><span>│  │          → 不满足 → Challenge() 或 Forbid()                          │ │</span></span>
<span class="line"><span>│  └─────────────────────────────────────────────────────────────────────┘ │</span></span>
<span class="line"><span>│                                                                          │</span></span>
<span class="line"><span>│  📁 源码仓库: dotnet/aspnetcore                                          │</span></span>
<span class="line"><span>│  📁 路径: src/Security/Authentication/                                   │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、核心接口和类型关系" tabindex="-1"><a class="header-anchor" href="#三、核心接口和类型关系"><span>三、核心接口和类型关系</span></a></h2><h3 id="_3-1-身份模型-claimsprincipal" tabindex="-1"><a class="header-anchor" href="#_3-1-身份模型-claimsprincipal"><span>3.1 身份模型：ClaimsPrincipal</span></a></h3><p>这是整个认证系统的<strong>输出产物</strong>，先理解它：</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: dotnet/runtime</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// src/libraries/System.Security.Claims/src/System/Security/Claims/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ========== Claim（声明）==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 一条身份信息：&quot;我叫张三&quot;、&quot;我的角色是Admin&quot;</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> Claim</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;"> Type { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }    </span><span style="color:#7F848E;font-style:italic;">// 声明类型：&quot;name&quot;、&quot;role&quot;、&quot;email&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;"> Value { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }   </span><span style="color:#7F848E;font-style:italic;">// 声明值：&quot;张三&quot;、&quot;Admin&quot;、&quot;zs@example.com&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;"> Issuer { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }  </span><span style="color:#7F848E;font-style:italic;">// 谁签发的：&quot;LOCAL AUTHORITY&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ========== ClaimsIdentity（身份）==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 一组声明的集合，代表一个身份</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 类比：一张身份证（上面有姓名、出生日期、地址等多条信息）</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> ClaimsIdentity</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IIdentity</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;">? AuthenticationType { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }  </span><span style="color:#7F848E;font-style:italic;">// 认证方式：&quot;Cookies&quot;、&quot;Bearer&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> bool</span><span style="color:#ABB2BF;"> IsAuthenticated { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }        </span><span style="color:#7F848E;font-style:italic;">// 是否已认证（AuthenticationType非空就是true）</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;">? Name { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }                </span><span style="color:#7F848E;font-style:italic;">// 快捷属性：从Claims中找Name类型的</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">Claim</span><span style="color:#ABB2BF;">&gt; Claims { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }   </span><span style="color:#7F848E;font-style:italic;">// 所有声明</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> bool</span><span style="color:#61AFEF;"> HasClaim</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> type</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> value</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> Claim</span><span style="color:#ABB2BF;">? </span><span style="color:#61AFEF;">FindFirst</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> type</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">Claim</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">FindAll</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> type</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ========== ClaimsPrincipal（主体）==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 一个用户可以有多个身份</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 类比：一个人可以有身份证 + 驾照 + 护照</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> ClaimsPrincipal</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IPrincipal</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">ClaimsIdentity</span><span style="color:#ABB2BF;">&gt; Identities { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }  </span><span style="color:#7F848E;font-style:italic;">// 多个身份</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> ClaimsIdentity</span><span style="color:#ABB2BF;">? Identity { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }                 </span><span style="color:#7F848E;font-style:italic;">// 主要身份</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">Claim</span><span style="color:#ABB2BF;">&gt; Claims { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }                </span><span style="color:#7F848E;font-style:italic;">// 所有身份的所有声明</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> bool</span><span style="color:#61AFEF;"> IsInRole</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> role</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> Claim</span><span style="color:#ABB2BF;">? </span><span style="color:#61AFEF;">FindFirst</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> type</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> bool</span><span style="color:#61AFEF;"> HasClaim</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> type</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> value</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>用图表示关系：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ClaimsPrincipal（用户主体）</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── ClaimsIdentity #1 (AuthenticationType: &quot;Cookies&quot;)</span></span>
<span class="line"><span>│   ├── Claim { Type: &quot;sub&quot;,   Value: &quot;user-guid-123&quot; }</span></span>
<span class="line"><span>│   ├── Claim { Type: &quot;name&quot;,  Value: &quot;张三&quot; }</span></span>
<span class="line"><span>│   ├── Claim { Type: &quot;email&quot;, Value: &quot;zs@example.com&quot; }</span></span>
<span class="line"><span>│   └── Claim { Type: &quot;role&quot;,  Value: &quot;Admin&quot; }</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>└── ClaimsIdentity #2 (AuthenticationType: &quot;Bearer&quot;)</span></span>
<span class="line"><span>    ├── Claim { Type: &quot;sub&quot;,    Value: &quot;user-guid-123&quot; }</span></span>
<span class="line"><span>    ├── Claim { Type: &quot;scope&quot;,  Value: &quot;openid profile&quot; }</span></span>
<span class="line"><span>    └── Claim { Type: &quot;client_id&quot;, Value: &quot;web-app&quot; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>一个用户可以同时通过Cookie和JWT两种方式认证</span></span>
<span class="line"><span>每种方式产生一个 ClaimsIdentity</span></span>
<span class="line"><span>合在一起就是一个 ClaimsPrincipal</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-认证方案-authenticationscheme" tabindex="-1"><a class="header-anchor" href="#_3-2-认证方案-authenticationscheme"><span>3.2 认证方案：AuthenticationScheme</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Core/src/AuthenticationScheme.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthenticationScheme</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;"> Name { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }               </span><span style="color:#7F848E;font-style:italic;">// 方案名称：&quot;Cookies&quot;、&quot;Bearer&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;">? DisplayName { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }       </span><span style="color:#7F848E;font-style:italic;">// 显示名称</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> Type</span><span style="color:#ABB2BF;"> HandlerType { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }          </span><span style="color:#7F848E;font-style:italic;">// 处理器类型：typeof(CookieAuthHandler)</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>你注册的方案：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>services.AddAuthentication(&quot;Cookies&quot;)       // 默认方案</span></span>
<span class="line"><span>    .AddCookie(&quot;Cookies&quot;, ...)              // 方案1: Name=&quot;Cookies&quot;, Handler=CookieAuthHandler</span></span>
<span class="line"><span>    .AddJwtBearer(&quot;Bearer&quot;, ...)            // 方案2: Name=&quot;Bearer&quot;, Handler=JwtBearerHandler</span></span>
<span class="line"><span>    .AddOpenIdConnect(&quot;oidc&quot;, ...);         // 方案3: Name=&quot;oidc&quot;, Handler=OpenIdConnectHandler</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    ↓ 存储在 ↓</span></span>
<span class="line"><span></span></span>
<span class="line"><span>IAuthenticationSchemeProvider</span></span>
<span class="line"><span>    .GetAllSchemesAsync()  → [Cookies, Bearer, oidc]</span></span>
<span class="line"><span>    .GetDefaultAuthenticateSchemeAsync() → Cookies</span></span>
<span class="line"><span>    .GetSchemeAsync(&quot;Bearer&quot;) → AuthenticationScheme { Name=&quot;Bearer&quot;, Handler=JwtBearerHandler }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-认证处理器接口层次" tabindex="-1"><a class="header-anchor" href="#_3-3-认证处理器接口层次"><span>3.3 认证处理器接口层次</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Core/src/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ========== 最基础的接口 ==========</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> IAuthenticationHandler</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#61AFEF;"> InitializeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationScheme</span><span style="color:#E5C07B;"> scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">AuthenticateAsync</span><span style="color:#ABB2BF;">();         </span><span style="color:#7F848E;font-style:italic;">// 认证</span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#61AFEF;"> ChallengeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">properties</span><span style="color:#ABB2BF;">);  </span><span style="color:#7F848E;font-style:italic;">// 质询（要求登录）</span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#61AFEF;"> ForbidAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">properties</span><span style="color:#ABB2BF;">);     </span><span style="color:#7F848E;font-style:italic;">// 禁止</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ========== 支持登入登出 ==========</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> IAuthenticationSignInHandler</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IAuthenticationSignOutHandler</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#61AFEF;"> SignInAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">ClaimsPrincipal</span><span style="color:#E5C07B;"> user</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">properties</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> IAuthenticationSignOutHandler</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IAuthenticationHandler</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#61AFEF;"> SignOutAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">properties</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// ========== 请求处理器（最重要！OpenIddict用这个）==========</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> interface</span><span style="color:#E5C07B;"> IAuthenticationRequestHandler</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IAuthenticationHandler</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 在认证中间件中被调用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 返回 true → 短路管道，请求已被处理</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 返回 false → 继续执行管道</span></span>
<span class="line"><span style="color:#E5C07B;">    Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">HandleRequestAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>接口继承关系图：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>IAuthenticationHandler</span></span>
<span class="line"><span>│   AuthenticateAsync()    —— 解析身份</span></span>
<span class="line"><span>│   ChallengeAsync()       —— 质询（重定向到登录页/返回401）</span></span>
<span class="line"><span>│   ForbidAsync()          —— 禁止（返回403）</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── IAuthenticationRequestHandler</span></span>
<span class="line"><span>│   │   HandleRequestAsync()  —— 处理特殊请求（OAuth回调等）</span></span>
<span class="line"><span>│   │</span></span>
<span class="line"><span>│   ├── OpenIddictServerAspNetCoreHandler  ⭐ SSO服务端</span></span>
<span class="line"><span>│   └── OpenIdConnectHandler                  OIDC客户端</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── IAuthenticationSignOutHandler</span></span>
<span class="line"><span>│   │   SignOutAsync()  —— 登出</span></span>
<span class="line"><span>│   │</span></span>
<span class="line"><span>│   └── IAuthenticationSignInHandler</span></span>
<span class="line"><span>│       │   SignInAsync()  —— 登入</span></span>
<span class="line"><span>│       │</span></span>
<span class="line"><span>│       └── CookieAuthenticationHandler  ⭐ Cookie认证</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>└── JwtBearerHandler  ⭐ JWT认证</span></span>
<span class="line"><span>    (只实现了基础接口，不支持SignIn/SignOut</span></span>
<span class="line"><span>     因为JWT是无状态的)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、addauthentication-的注册过程" tabindex="-1"><a class="header-anchor" href="#四、addauthentication-的注册过程"><span>四、AddAuthentication() 的注册过程</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 你写的代码：</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddAuthentication</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">options</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">DefaultScheme</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;Cookies&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E5C07B;">    options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">DefaultChallengeScheme</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;oidc&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">})</span></span>
<span class="line"><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddCookie</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Cookies&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddJwtBearer</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Bearer&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddOpenIdConnect</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;oidc&quot;</span><span style="color:#ABB2BF;">);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="addauthentication-源码" tabindex="-1"><a class="header-anchor" href="#addauthentication-源码"><span>AddAuthentication() 源码</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Core/src/</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">//              AuthenticationServiceCollectionExtensions.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> AuthenticationBuilder</span><span style="color:#61AFEF;"> AddAuthentication</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">    this</span><span style="color:#E5C07B;"> IServiceCollection</span><span style="color:#E5C07B;"> services</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">    Action</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticationOptions</span><span style="color:#ABB2BF;">&gt;? </span><span style="color:#E5C07B;">configureOptions</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 注册核心服务</span></span>
<span class="line"><span style="color:#E5C07B;">    services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">TryAddSingleton</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">ISystemClock</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">SystemClock</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 核心：注册方案提供者</span></span>
<span class="line"><span style="color:#E5C07B;">    services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">TryAddSingleton</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAuthenticationSchemeProvider</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">AuthenticationSchemeProvider</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 核心：注册处理器提供者</span></span>
<span class="line"><span style="color:#E5C07B;">    services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">TryAddSingleton</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAuthenticationHandlerProvider</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">AuthenticationHandlerProvider</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 核心：注册认证服务</span></span>
<span class="line"><span style="color:#E5C07B;">    services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">TryAddScoped</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAuthenticationService</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">AuthenticationService</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 注册 HttpContext 扩展方法用到的内部服务</span></span>
<span class="line"><span style="color:#E5C07B;">    services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">TryAddScoped</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IClaimsTransformation</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">NoopClaimsTransformation</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 配置 Options</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">configureOptions</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Configure</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">configureOptions</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">AuthenticationBuilder</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="authenticationoptions-——-默认方案配置" tabindex="-1"><a class="header-anchor" href="#authenticationoptions-——-默认方案配置"><span>AuthenticationOptions —— 默认方案配置</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Core/src/AuthenticationOptions.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthenticationOptions</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 所有已注册的方案</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticationSchemeBuilder</span><span style="color:#ABB2BF;">&gt; Schemes { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 默认方案 —— 不同操作可以有不同的默认方案</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;">? DefaultScheme { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; }                </span><span style="color:#7F848E;font-style:italic;">// 总默认方案</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;">? DefaultAuthenticateScheme { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; }    </span><span style="color:#7F848E;font-style:italic;">// 认证默认</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;">? DefaultChallengeScheme { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; }       </span><span style="color:#7F848E;font-style:italic;">// 质询默认</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;">? DefaultSignInScheme { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; }          </span><span style="color:#7F848E;font-style:italic;">// 登入默认</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;">? DefaultSignOutScheme { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; }         </span><span style="color:#7F848E;font-style:italic;">// 登出默认</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;">? DefaultForbidScheme { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; }          </span><span style="color:#7F848E;font-style:italic;">// 禁止默认</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 添加方案</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> void</span><span style="color:#61AFEF;"> AddScheme</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> name</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">Action</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticationSchemeBuilder</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">configureBuilder</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> builder</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">AuthenticationSchemeBuilder</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#61AFEF;">        configureBuilder</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">builder</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">        _schemes</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Add</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">builder</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 添加方案（泛型版本）</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> void</span><span style="color:#61AFEF;"> AddScheme</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">THandler</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> name</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">displayName</span><span style="color:#ABB2BF;">) </span></span>
<span class="line"><span style="color:#C678DD;">        where</span><span style="color:#E5C07B;"> THandler</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IAuthenticationHandler</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#61AFEF;">        AddScheme</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">b</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            b</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">DisplayName</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> displayName</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E5C07B;">            b</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">HandlerType</span><span style="color:#56B6C2;"> =</span><span style="color:#C678DD;"> typeof</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">THandler</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        });</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>默认方案的回退逻辑：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>当你调用 context.AuthenticateAsync() （不指定方案名）时：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 先找 DefaultAuthenticateScheme</span></span>
<span class="line"><span>2. 没有 → 回退到 DefaultScheme</span></span>
<span class="line"><span>3. 都没有 → 抛异常</span></span>
<span class="line"><span></span></span>
<span class="line"><span>当授权失败需要 Challenge 时：</span></span>
<span class="line"><span>1. 先找 DefaultChallengeScheme</span></span>
<span class="line"><span>2. 没有 → 回退到 DefaultScheme</span></span>
<span class="line"><span>3. 都没有 → 抛异常</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  典型的SSO项目配置：                                          │</span></span>
<span class="line"><span>│                                                              │</span></span>
<span class="line"><span>│  DefaultScheme = &quot;Cookies&quot;                                   │</span></span>
<span class="line"><span>│    → 普通请求用Cookie认证（检查是否已登录）                     │</span></span>
<span class="line"><span>│                                                              │</span></span>
<span class="line"><span>│  DefaultChallengeScheme = &quot;OpenIddict.Server&quot;                │</span></span>
<span class="line"><span>│    → 未登录时重定向到SSO登录页                                 │</span></span>
<span class="line"><span>│                                                              │</span></span>
<span class="line"><span>│  API项目：                                                    │</span></span>
<span class="line"><span>│  DefaultScheme = &quot;Bearer&quot;                                    │</span></span>
<span class="line"><span>│    → API请求用JWT认证（检查Authorization头）                   │</span></span>
<span class="line"><span>│                                                              │</span></span>
<span class="line"><span>│  DefaultChallengeScheme = &quot;Bearer&quot;                           │</span></span>
<span class="line"><span>│    → JWT无效时返回401 WWW-Authenticate: Bearer               │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="addcookie-做了什么" tabindex="-1"><a class="header-anchor" href="#addcookie-做了什么"><span>AddCookie() 做了什么</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Cookies/src/CookieExtensions.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> AuthenticationBuilder</span><span style="color:#61AFEF;"> AddCookie</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">    this</span><span style="color:#E5C07B;"> AuthenticationBuilder</span><span style="color:#E5C07B;"> builder</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#C678DD;">    string</span><span style="color:#E5C07B;"> authenticationScheme</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">    Action</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">CookieAuthenticationOptions</span><span style="color:#ABB2BF;">&gt;? </span><span style="color:#E5C07B;">configureOptions</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    builder</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">TryAddEnumerable</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        ServiceDescriptor</span><span style="color:#ABB2BF;">.</span><span style="color:#E06C75;">Singleton</span><span style="color:#56B6C2;">&lt;</span><span style="color:#E06C75;">IPostConfigureOptions</span><span style="color:#56B6C2;">&lt;</span><span style="color:#E06C75;">CookieAuthenticationOptions</span><span style="color:#56B6C2;">&gt;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">            PostConfigureCookieAuthenticationOptions</span><span style="color:#56B6C2;">&gt;</span><span style="color:#ABB2BF;">());</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 核心：注册方案，绑定 Handler 类型</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#E5C07B;"> builder</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddScheme</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">CookieAuthenticationOptions</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">CookieAuthenticationHandler</span><span style="color:#ABB2BF;">&gt;(</span></span>
<span class="line"><span style="color:#E06C75;">        authenticationScheme</span><span style="color:#ABB2BF;">, </span></span>
<span class="line"><span style="color:#E5C07B;">        displayName</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">null</span><span style="color:#ABB2BF;">, </span></span>
<span class="line"><span style="color:#E5C07B;">        configureOptions</span><span style="color:#ABB2BF;">: </span><span style="color:#E06C75;">configureOptions</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// AddScheme 的实现</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Core/src/AuthenticationBuilder.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthenticationBuilder</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> virtual</span><span style="color:#E5C07B;"> AuthenticationBuilder</span><span style="color:#61AFEF;"> AddScheme</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">THandler</span><span style="color:#ABB2BF;">&gt;(</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> authenticationScheme</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">displayName</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        Action</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt;? </span><span style="color:#E5C07B;">configureOptions</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        where</span><span style="color:#E5C07B;"> TOptions</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">AuthenticationSchemeOptions</span><span style="color:#ABB2BF;">, new()</span></span>
<span class="line"><span style="color:#C678DD;">        where</span><span style="color:#E5C07B;"> THandler</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">AuthenticationHandler</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 注册 Options</span></span>
<span class="line"><span style="color:#E5C07B;">        Services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Configure</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E06C75;">authenticationScheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">o</span><span style="color:#ABB2BF;"> =&gt; { });</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">configureOptions</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            Services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Configure</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E06C75;">authenticationScheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">configureOptions</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 把方案信息添加到 AuthenticationOptions 中</span></span>
<span class="line"><span style="color:#E5C07B;">        Services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Configure</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticationOptions</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E5C07B;">o</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            o</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddScheme</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">authenticationScheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">scheme</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E5C07B;">                scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">HandlerType</span><span style="color:#56B6C2;"> =</span><span style="color:#C678DD;"> typeof</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">THandler</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">                scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">DisplayName</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> displayName</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">            });</span></span>
<span class="line"><span style="color:#ABB2BF;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 注册 Handler 到 DI（Transient）</span></span>
<span class="line"><span style="color:#E5C07B;">        Services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddTransient</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">THandler</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> this</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、authenticationservice-——-认证操作的总调度器" tabindex="-1"><a class="header-anchor" href="#五、authenticationservice-——-认证操作的总调度器"><span>五、AuthenticationService —— 认证操作的总调度器</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Core/src/AuthenticationService.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthenticationService</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IAuthenticationService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IAuthenticationSchemeProvider</span><span style="color:#E06C75;"> _schemes</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IAuthenticationHandlerProvider</span><span style="color:#E06C75;"> _handlers</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IClaimsTransformation</span><span style="color:#E06C75;"> _transform</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IOptions</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticationOptions</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E06C75;">_options</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =============================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 AuthenticateAsync —— 认证核心方法</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =============================================</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">AuthenticateAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">scheme</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 第1步：确定使用哪个方案</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">scheme</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> defaultScheme</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_schemes</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetDefaultAuthenticateSchemeAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#E06C75;">            scheme</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> defaultScheme</span><span style="color:#ABB2BF;">?.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">scheme</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#C678DD;">                throw</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">InvalidOperationException</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#98C379;">                    &quot;No authenticationScheme was specified, &quot;</span><span style="color:#56B6C2;"> +</span></span>
<span class="line"><span style="color:#98C379;">                    &quot;and there was no DefaultAuthenticateScheme found.&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 第2步：获取对应的 Handler</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> handler</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_handlers</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetHandlerAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">handler</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            throw</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">InvalidOperationException</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#98C379;">                $&quot;No authentication handler is registered for the scheme &#39;</span><span style="color:#ABB2BF;">{</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">&#39;.&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 第3步：调用 Handler 的 AuthenticateAsync()</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">handler</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AuthenticateAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // CookieHandler → 解析Cookie → 解密 → 反序列化 → ClaimsPrincipal</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // JwtBearerHandler → 解析Authorization头 → 验证JWT → ClaimsPrincipal</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 第4步：Claims 转换（可以在这里添加额外的Claims）</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">result</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Succeeded</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> principal</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> result</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Principal</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> transformed</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_transform</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">TransformAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">principal</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Success</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#ABB2BF;">                new </span><span style="color:#E5C07B;">AuthenticationTicket</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">transformed</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">result</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Properties</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> result</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =============================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 ChallengeAsync —— 质询（要求登录）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =============================================</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> ChallengeAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">properties</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">scheme</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> defaultScheme</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_schemes</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetDefaultChallengeSchemeAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#E06C75;">            scheme</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> defaultScheme</span><span style="color:#ABB2BF;">?.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> handler</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_handlers</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetHandlerAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 调用 Handler 的 ChallengeAsync()</span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#E5C07B;">handler</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ChallengeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">properties</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // CookieHandler → 302 重定向到 LoginPath</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // JwtBearerHandler → 401 + WWW-Authenticate: Bearer</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // OpenIdConnectHandler → 302 重定向到 OIDC Provider</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =============================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 SignInAsync —— 登入</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =============================================</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> SignInAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">scheme</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        ClaimsPrincipal</span><span style="color:#E5C07B;"> principal</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">properties</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">scheme</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> defaultScheme</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_schemes</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetDefaultSignInSchemeAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#E06C75;">            scheme</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> defaultScheme</span><span style="color:#ABB2BF;">?.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> handler</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_handlers</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetHandlerAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">handler</span><span style="color:#ABB2BF;"> is </span><span style="color:#E5C07B;">IAuthenticationSignInHandler</span><span style="color:#E06C75;"> signInHandler</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 🔥 调用 Handler 的 SignInAsync()</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">signInHandler</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">SignInAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">principal</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">properties</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // CookieHandler → 序列化Principal → 加密 → 写入Cookie</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            throw</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">InvalidOperationException</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#98C379;">                $&quot;The authentication handler &#39;</span><span style="color:#ABB2BF;">{</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">&#39; does not support sign in.&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // SignOutAsync 类似...</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="authenticationhandlerprovider-——-handler-的获取方式" tabindex="-1"><a class="header-anchor" href="#authenticationhandlerprovider-——-handler-的获取方式"><span>AuthenticationHandlerProvider —— Handler 的获取方式</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Core/src/AuthenticationHandlerProvider.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthenticationHandlerProvider</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">IAuthenticationHandlerProvider</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IAuthenticationSchemeProvider</span><span style="color:#E06C75;"> _schemes</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 每个请求缓存已创建的Handler</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> Dictionary</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">IAuthenticationHandler</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E06C75;">_handlerMap</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAuthenticationHandler</span><span style="color:#ABB2BF;">?&gt; </span><span style="color:#61AFEF;">GetHandlerAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> authenticationScheme</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 先检查缓存</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">_handlerMap</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">TryGetValue</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">authenticationScheme</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">out</span><span style="color:#C678DD;"> var</span><span style="color:#E06C75;"> cachedHandler</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E06C75;"> cachedHandler</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 获取方案定义</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> scheme</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_schemes</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetSchemeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">authenticationScheme</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">scheme</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">return</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 从 DI 容器中解析 Handler</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> handler</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RequestServices</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetService</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">HandlerType</span><span style="color:#ABB2BF;">) </span></span>
<span class="line"><span style="color:#ABB2BF;">            ?? </span><span style="color:#E5C07B;">ActivatorUtilities</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">CreateInstance</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RequestServices</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">HandlerType</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">            as </span><span style="color:#E5C07B;">IAuthenticationHandler</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">handler</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 🔥 初始化 Handler（传入方案和HttpContext）</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">handler</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">InitializeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 缓存</span></span>
<span class="line"><span style="color:#E5C07B;">            _handlerMap</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">authenticationScheme</span><span style="color:#ABB2BF;">] </span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;"> handler</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> handler</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注意：Handler 是从 <code>context.RequestServices</code>（请求级 Scope）中解析的，所以每个请求都会创建新的 Handler 实例。</strong></p><hr><h2 id="六、authenticationhandler-t-——-handler-的基类" tabindex="-1"><a class="header-anchor" href="#六、authenticationhandler-t-——-handler-的基类"><span>六、AuthenticationHandler&lt;T&gt; —— Handler 的基类</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Core/src/AuthenticationHandler.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> abstract</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthenticationHandler</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">TOptions</span><span style="color:#ABB2BF;">&gt; : </span><span style="color:#E5C07B;">IAuthenticationHandler</span></span>
<span class="line"><span style="color:#C678DD;">    where</span><span style="color:#E5C07B;"> TOptions</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">AuthenticationSchemeOptions</span><span style="color:#ABB2BF;">, new()</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 由 InitializeAsync 设置</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#E5C07B;"> HttpContext</span><span style="color:#ABB2BF;"> Context { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">private</span><span style="color:#C678DD;"> set</span><span style="color:#ABB2BF;">; } </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> default</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#E5C07B;"> HttpRequest</span><span style="color:#ABB2BF;"> Request =&gt; </span><span style="color:#E5C07B;">Context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Request</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#E5C07B;"> HttpResponse</span><span style="color:#ABB2BF;"> Response =&gt; </span><span style="color:#E5C07B;">Context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Response</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#E5C07B;"> AuthenticationScheme</span><span style="color:#ABB2BF;"> Scheme { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">private</span><span style="color:#C678DD;"> set</span><span style="color:#ABB2BF;">; } </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> default</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#E5C07B;"> TOptions</span><span style="color:#ABB2BF;"> Options { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">private</span><span style="color:#C678DD;"> set</span><span style="color:#ABB2BF;">; } </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> default</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#E5C07B;"> ILogger</span><span style="color:#ABB2BF;"> Logger { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =============================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 初始化</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =============================================</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> InitializeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationScheme</span><span style="color:#E5C07B;"> scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        Scheme</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        Context</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> context</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 获取该方案的Options（命名Options！）</span></span>
<span class="line"><span style="color:#E06C75;">        Options</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _optionsMonitor</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Get</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 比如 &quot;Cookies&quot; 方案有自己的 CookieAuthenticationOptions</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // &quot;Bearer&quot; 方案有自己的 JwtBearerOptions</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =============================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 AuthenticateAsync 的模板方法模式</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =============================================</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">AuthenticateAsync</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 缓存机制：同一请求中多次调用只执行一次</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#61AFEF;">HandleAuthenticateOnceAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">result</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Failure</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 触发认证成功/失败事件</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> ticket</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> result</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Ticket</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">ticket</span><span style="color:#ABB2BF;">?.</span><span style="color:#E5C07B;">Principal</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E5C07B;">                Logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AuthenticationSchemeAuthenticated</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> result</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt;? </span><span style="color:#E06C75;">_authenticateTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">HandleAuthenticateOnceAsync</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 确保只执行一次</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">_authenticateTask</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E06C75;">            _authenticateTask</span><span style="color:#56B6C2;"> =</span><span style="color:#61AFEF;"> HandleAuthenticateAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> _authenticateTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥🔥🔥 子类必须实现这个方法</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> abstract</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">HandleAuthenticateAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    //</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // CookieAuthenticationHandler: 解析Cookie → 解密 → 反序列化</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // JwtBearerHandler: 解析Authorization头 → 验证JWT签名和有效期</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // OpenIddictServerHandler: 验证OpenIddict的Token</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =============================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ChallengeAsync 的模板方法模式</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =============================================</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> ChallengeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">properties</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 留给子类处理</span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#61AFEF;">HandleChallengeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">properties</span><span style="color:#ABB2BF;"> ?? new </span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#ABB2BF;">());</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 子类重写这个方法来自定义质询行为</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> virtual</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> HandleChallengeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#E5C07B;"> properties</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        Response</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StatusCode</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 401</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;">// 默认返回401</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">CompletedTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ForbidAsync 类似...</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> virtual</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> HandleForbiddenAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#E5C07B;"> properties</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        Response</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StatusCode</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 403</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;">// 默认返回403</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">CompletedTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、cookieauthenticationhandler-——-cookie认证的完整实现" tabindex="-1"><a class="header-anchor" href="#七、cookieauthenticationhandler-——-cookie认证的完整实现"><span>七、CookieAuthenticationHandler —— Cookie认证的完整实现</span></a></h2><p>这是SSO项目中<strong>授权服务器本身</strong>用来识别已登录用户的关键组件。</p><h3 id="_7-1-handleauthenticateasync-——-解析cookie" tabindex="-1"><a class="header-anchor" href="#_7-1-handleauthenticateasync-——-解析cookie"><span>7.1 HandleAuthenticateAsync —— 解析Cookie</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Cookies/src/CookieAuthenticationHandler.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> CookieAuthenticationHandler</span><span style="color:#ABB2BF;"> :</span></span>
<span class="line"><span style="color:#E5C07B;">    SignInAuthenticationHandler</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">CookieAuthenticationOptions</span><span style="color:#ABB2BF;">&gt;,</span></span>
<span class="line"><span style="color:#E5C07B;">    IAuthenticationRequestHandler</span><span style="color:#7F848E;font-style:italic;">  // 👈 也是RequestHandler，能处理登出路径</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> override</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">HandleAuthenticateAsync</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 第1步：从请求中读取Cookie</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> cookie</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">CookieManager</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetRequestCookie</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            Context</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Cookie</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // Cookie.Name 默认是 &quot;.AspNetCore.Cookies&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">IsNullOrEmpty</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">cookie</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">NoResult</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 没有Cookie → 未认证（但不是失败，只是没有身份信息）</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 第2步：解密Cookie（使用Data Protection API）</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> ticket</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">TicketDataFormat</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Unprotect</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">cookie</span><span style="color:#ABB2BF;">, </span><span style="color:#61AFEF;">GetTlsTokenBinding</span><span style="color:#ABB2BF;">());</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">ticket</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Fail</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Unprotect ticket failed&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // Cookie被篡改或密钥不匹配 → 认证失败</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 第3步：验证Cookie的有效期</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> currentUtc</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> DateTimeOffset</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">UtcNow</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> expiresUtc</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> ticket</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Properties</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ExpiresUtc</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">expiresUtc</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">HasValue</span><span style="color:#56B6C2;"> &amp;&amp;</span><span style="color:#E5C07B;"> expiresUtc</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Value</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> currentUtc</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Fail</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Ticket expired&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // Cookie已过期 → 认证失败</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 第4步：触发事件（可以在这里自定义验证逻辑）</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> context</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">CookieValidatePrincipalContext</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            Context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Options</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">ticket</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#E5C07B;">Events</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ValidatePrincipal</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Principal</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Fail</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Principal was null after validation&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 第5步：检查是否需要滑动过期（续期）</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">SlidingExpiration</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 如果Cookie已经过了一半的有效期，自动续期</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> timeElapsed</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> currentUtc</span><span style="color:#56B6C2;"> -</span><span style="color:#E5C07B;"> ticket</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Properties</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IssuedUtc</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> timeRemaining</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> expiresUtc</span><span style="color:#56B6C2;"> -</span><span style="color:#E06C75;"> currentUtc</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">timeRemaining</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> timeElapsed</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // 需要续期 → 在响应中写入新的Cookie</span></span>
<span class="line"><span style="color:#ABB2BF;">                await </span><span style="color:#61AFEF;">_shouldRenew</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 返回成功，包含 ClaimsPrincipal</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Success</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ticket</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-handlesigninasync-——-写入cookie" tabindex="-1"><a class="header-anchor" href="#_7-2-handlesigninasync-——-写入cookie"><span>7.2 HandleSignInAsync —— 写入Cookie</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#C678DD;">protected</span><span style="color:#C678DD;"> override</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> HandleSignInAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">    ClaimsPrincipal</span><span style="color:#E5C07B;"> user</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">properties</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E06C75;">    properties</span><span style="color:#C678DD;"> ??=</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 第1步：触发登入事件</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> signInContext</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">CookieSigningInContext</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">        Context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Options</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">user</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">properties</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">_cookieOptions</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    await </span><span style="color:#E5C07B;">Events</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">SigningIn</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">signInContext</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 第2步：设置过期时间</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (</span><span style="color:#56B6C2;">!</span><span style="color:#E5C07B;">properties</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ExpiresUtc</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">HasValue</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        properties</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ExpiresUtc</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> DateTimeOffset</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">UtcNow</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Add</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ExpireTimeSpan</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 默认14天</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#E5C07B;">    properties</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IssuedUtc</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> DateTimeOffset</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">UtcNow</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 第3步：创建 AuthenticationTicket</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> ticket</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">AuthenticationTicket</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">user</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">properties</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">Scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 第4步：序列化并加密</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> cookieValue</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">TicketDataFormat</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Protect</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ticket</span><span style="color:#ABB2BF;">, </span><span style="color:#61AFEF;">GetTlsTokenBinding</span><span style="color:#ABB2BF;">());</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // TicketDataFormat 内部使用 Data Protection API</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ClaimsPrincipal → 序列化为二进制 → AES加密 → Base64编码</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 第5步：如果Cookie太大（&gt;4096字节），使用SessionStore</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">SessionStore</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // Cookie中只存SessionId，实际数据存在服务端（Redis/内存等）</span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#E5C07B;">Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">SessionStore</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StoreAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ticket</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E06C75;">        cookieValue</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">TicketDataFormat</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Protect</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">sessionTicket</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 第6步：写入响应Cookie</span></span>
<span class="line"><span style="color:#E5C07B;">    Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">CookieManager</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AppendResponseCookie</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">        Context</span><span style="color:#ABB2BF;">, </span></span>
<span class="line"><span style="color:#E5C07B;">        Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Cookie</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">,     </span><span style="color:#7F848E;font-style:italic;">// &quot;.AspNetCore.Cookies&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        cookieValue</span><span style="color:#ABB2BF;">,              </span><span style="color:#7F848E;font-style:italic;">// 加密后的字符串</span></span>
<span class="line"><span style="color:#E06C75;">        _cookieOptions</span><span style="color:#ABB2BF;">);          </span><span style="color:#7F848E;font-style:italic;">// HttpOnly, Secure, SameSite等</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 第7步：触发登入完成事件</span></span>
<span class="line"><span style="color:#ABB2BF;">    await </span><span style="color:#E5C07B;">Events</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">SignedIn</span><span style="color:#ABB2BF;">(new </span><span style="color:#E5C07B;">CookieSignedInContext</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">        Context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">user</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">properties</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Options</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#E5C07B;">    Logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">SignedIn</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-handlechallengeasync-——-cookie的质询行为" tabindex="-1"><a class="header-anchor" href="#_7-3-handlechallengeasync-——-cookie的质询行为"><span>7.3 HandleChallengeAsync —— Cookie的质询行为</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#C678DD;">protected</span><span style="color:#C678DD;"> override</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> HandleChallengeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#E5C07B;"> properties</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> redirectUri</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> properties</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RedirectUri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">IsNullOrEmpty</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">redirectUri</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        redirectUri</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> OriginalPathBase</span><span style="color:#56B6C2;"> +</span><span style="color:#E06C75;"> OriginalPath</span><span style="color:#56B6C2;"> +</span><span style="color:#E5C07B;"> Request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">QueryString</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 构建登录页URL</span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> loginUri</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">LoginPath</span><span style="color:#56B6C2;"> +</span><span style="color:#E5C07B;"> QueryString</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Create</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ReturnUrlParameter</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">redirectUri</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 默认: /Account/Login?ReturnUrl=/original-path</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    var</span><span style="color:#E06C75;"> redirectContext</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedirectContext</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">CookieAuthenticationOptions</span><span style="color:#ABB2BF;">&gt;(</span></span>
<span class="line"><span style="color:#E06C75;">        Context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Options</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">properties</span><span style="color:#ABB2BF;">, </span><span style="color:#61AFEF;">BuildRedirectUri</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">loginUri</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    await </span><span style="color:#E5C07B;">Events</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">RedirectToLogin</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">redirectContext</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (</span><span style="color:#56B6C2;">!</span><span style="color:#E5C07B;">redirectContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Handled</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 302 重定向到登录页</span></span>
<span class="line"><span style="color:#E5C07B;">        Response</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Redirect</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">redirectContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RedirectUri</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Cookie 认证的完整流程图：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>首次访问（未登录）：</span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│ GET /dashboard                                                      │</span></span>
<span class="line"><span>│ (没有Cookie)                                                        │</span></span>
<span class="line"><span>│     │                                                               │</span></span>
<span class="line"><span>│     ▼                                                               │</span></span>
<span class="line"><span>│ AuthenticationMiddleware                                             │</span></span>
<span class="line"><span>│     │ AuthenticateAsync(&quot;Cookies&quot;)                                  │</span></span>
<span class="line"><span>│     │ → CookieHandler.HandleAuthenticateAsync()                     │</span></span>
<span class="line"><span>│     │ → 没有Cookie → AuthenticateResult.NoResult()                  │</span></span>
<span class="line"><span>│     │ → context.User = 匿名用户                                     │</span></span>
<span class="line"><span>│     ▼                                                               │</span></span>
<span class="line"><span>│ AuthorizationMiddleware                                             │</span></span>
<span class="line"><span>│     │ [Authorize] → 需要认证的用户                                   │</span></span>
<span class="line"><span>│     │ → context.User 未认证                                         │</span></span>
<span class="line"><span>│     │ → ChallengeAsync(&quot;Cookies&quot;)                                   │</span></span>
<span class="line"><span>│     │ → CookieHandler.HandleChallengeAsync()                        │</span></span>
<span class="line"><span>│     │ → 302 Redirect to /Account/Login?ReturnUrl=/dashboard         │</span></span>
<span class="line"><span>│     ▼                                                               │</span></span>
<span class="line"><span>│ 浏览器重定向到登录页                                                  │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>登录成功：</span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│ POST /Account/Login (username=zhangsan, password=****)               │</span></span>
<span class="line"><span>│     │                                                               │</span></span>
<span class="line"><span>│     ▼                                                               │</span></span>
<span class="line"><span>│ AccountController.Login()                                           │</span></span>
<span class="line"><span>│     │ 验证用户名密码（Identity）                                     │</span></span>
<span class="line"><span>│     │ 创建 ClaimsPrincipal                                          │</span></span>
<span class="line"><span>│     │                                                               │</span></span>
<span class="line"><span>│     │ await HttpContext.SignInAsync(&quot;Cookies&quot;, principal, props);    │</span></span>
<span class="line"><span>│     │     │                                                         │</span></span>
<span class="line"><span>│     │     ▼                                                         │</span></span>
<span class="line"><span>│     │ CookieHandler.HandleSignInAsync()                             │</span></span>
<span class="line"><span>│     │     │ 序列化 ClaimsPrincipal                                  │</span></span>
<span class="line"><span>│     │     │ Data Protection 加密                                    │</span></span>
<span class="line"><span>│     │     │ 写入 Set-Cookie 响应头                                  │</span></span>
<span class="line"><span>│     │     ▼                                                         │</span></span>
<span class="line"><span>│     │ Set-Cookie: .AspNetCore.Cookies=CfDJ8N2xF...; HttpOnly;      │</span></span>
<span class="line"><span>│     │            Secure; SameSite=Lax; Path=/; Expires=...          │</span></span>
<span class="line"><span>│     │                                                               │</span></span>
<span class="line"><span>│     │ 302 Redirect to /dashboard (ReturnUrl)                        │</span></span>
<span class="line"><span>│     ▼                                                               │</span></span>
<span class="line"><span>│ 浏览器保存Cookie，重定向到 /dashboard                                 │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>后续访问（已登录）：</span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│ GET /dashboard                                                      │</span></span>
<span class="line"><span>│ Cookie: .AspNetCore.Cookies=CfDJ8N2xF...                           │</span></span>
<span class="line"><span>│     │                                                               │</span></span>
<span class="line"><span>│     ▼                                                               │</span></span>
<span class="line"><span>│ AuthenticationMiddleware                                             │</span></span>
<span class="line"><span>│     │ AuthenticateAsync(&quot;Cookies&quot;)                                  │</span></span>
<span class="line"><span>│     │ → CookieHandler.HandleAuthenticateAsync()                     │</span></span>
<span class="line"><span>│     │ → 读取Cookie → Data Protection 解密                           │</span></span>
<span class="line"><span>│     │ → 反序列化 → ClaimsPrincipal                                  │</span></span>
<span class="line"><span>│     │ → 检查过期时间 ✅                                              │</span></span>
<span class="line"><span>│     │ → AuthenticateResult.Success(ticket)                          │</span></span>
<span class="line"><span>│     │ → context.User = ClaimsPrincipal { Name=&quot;zhangsan&quot; }          │</span></span>
<span class="line"><span>│     ▼                                                               │</span></span>
<span class="line"><span>│ AuthorizationMiddleware                                             │</span></span>
<span class="line"><span>│     │ [Authorize] → context.User.IsAuthenticated = true ✅          │</span></span>
<span class="line"><span>│     ▼                                                               │</span></span>
<span class="line"><span>│ Endpoint Execution                                                  │</span></span>
<span class="line"><span>│     │ DashboardController.Index()                                   │</span></span>
<span class="line"><span>│     │ → 正常返回页面                                                 │</span></span>
<span class="line"><span>│     ▼                                                               │</span></span>
<span class="line"><span>│ 200 OK                                                              │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="八、jwtbearerhandler-——-jwt认证的完整实现" tabindex="-1"><a class="header-anchor" href="#八、jwtbearerhandler-——-jwt认证的完整实现"><span>八、JwtBearerHandler —— JWT认证的完整实现</span></a></h2><p>这是SSO项目中<strong>资源服务器（API）</strong>验证Access Token的关键组件。</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/JwtBearer/src/JwtBearerHandler.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> JwtBearerHandler</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">AuthenticationHandler</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">JwtBearerOptions</span><span style="color:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> override</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">HandleAuthenticateAsync</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#ABB2BF;">? </span><span style="color:#E06C75;">token</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 第1步：从请求中提取Token</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 优先从 Authorization 头获取</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E06C75;"> authorization</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> Request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Headers</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Authorization</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ToString</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">IsNullOrEmpty</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">authorization</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">NoResult</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">authorization</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StartsWith</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Bearer &quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">StringComparison</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">OrdinalIgnoreCase</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E06C75;">            token</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> authorization</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Substring</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Bearer &quot;</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Length</span><span style="color:#ABB2BF;">).</span><span style="color:#61AFEF;">Trim</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">IsNullOrEmpty</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">NoResult</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 第2步：触发 MessageReceived 事件</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 允许从其他地方获取Token（如QueryString）</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> messageReceivedContext</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">MessageReceivedContext</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            Context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Options</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">        messageReceivedContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Token</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> token</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#E5C07B;">Events</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">MessageReceived</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">messageReceivedContext</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">messageReceivedContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Result</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> messageReceivedContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Result</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#E06C75;">        token</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> messageReceivedContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Token</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 第3步：验证 JWT Token</span></span>
<span class="line"><span style="color:#E5C07B;">        List</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">Exception</span><span style="color:#ABB2BF;">&gt;? </span><span style="color:#E06C75;">validationFailures</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E5C07B;">        SecurityToken</span><span style="color:#ABB2BF;">? </span><span style="color:#E06C75;">validatedToken</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E5C07B;">        ClaimsPrincipal</span><span style="color:#ABB2BF;">? </span><span style="color:#E06C75;">principal</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        foreach</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> validator</span><span style="color:#C678DD;"> in</span><span style="color:#E5C07B;"> Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">SecurityTokenValidators</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 或者 .NET 8+: Options.TokenHandlers</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            try</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // 🔥🔥🔥 核心验证逻辑</span></span>
<span class="line"><span style="color:#E06C75;">                principal</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> validator</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ValidateToken</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">                    token</span><span style="color:#ABB2BF;">, </span></span>
<span class="line"><span style="color:#E5C07B;">                    Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">TokenValidationParameters</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#C678DD;">                    out</span><span style="color:#E06C75;"> validatedToken</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">                </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // 验证参数包括：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // - ValidateIssuer: 验证签发者</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // - ValidateAudience: 验证受众</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // - ValidateLifetime: 验证有效期</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // - ValidateIssuerSigningKey: 验证签名</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // - IssuerSigningKey: 签名公钥</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // - ValidIssuers: 有效的签发者列表</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // - ValidAudiences: 有效的受众列表</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // - ClockSkew: 时钟偏差容忍度（默认5分钟）</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#C678DD;">            catch</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">Exception</span><span style="color:#E06C75;"> ex</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E06C75;">                validationFailures</span><span style="color:#C678DD;"> ??=</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">List</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">Exception</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"><span style="color:#E5C07B;">                validationFailures</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Add</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ex</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">principal</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#56B6C2;"> ||</span><span style="color:#E06C75;"> validatedToken</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 所有验证器都失败了</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> authenticationFailedContext</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">AuthenticationFailedContext</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">                Context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Options</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">            authenticationFailedContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Exception</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> </span></span>
<span class="line"><span style="color:#E06C75;">                validationFailures</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Count</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;"> </span></span>
<span class="line"><span style="color:#ABB2BF;">                    ? </span><span style="color:#E5C07B;">validationFailures</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">] </span></span>
<span class="line"><span style="color:#ABB2BF;">                    : new </span><span style="color:#E5C07B;">AggregateException</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">validationFailures</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">Events</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AuthenticationFailed</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">authenticationFailedContext</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> authenticationFailedContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Result</span><span style="color:#ABB2BF;"> </span></span>
<span class="line"><span style="color:#ABB2BF;">                ?? </span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Fail</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">authenticationFailedContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Exception</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 第4步：验证成功后的处理</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> tokenValidatedContext</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">TokenValidatedContext</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            Context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Options</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">        tokenValidatedContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Principal</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> principal</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E5C07B;">        tokenValidatedContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">SecurityToken</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> validatedToken</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#E5C07B;">Events</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">TokenValidated</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">tokenValidatedContext</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 第5步：创建认证票据</span></span>
<span class="line"><span style="color:#E5C07B;">        tokenValidatedContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Properties</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ExpiresUtc</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> </span></span>
<span class="line"><span style="color:#61AFEF;">            GetSafeDateTime</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">validatedToken</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ValidTo</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">        tokenValidatedContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Properties</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IssuedUtc</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> </span></span>
<span class="line"><span style="color:#61AFEF;">            GetSafeDateTime</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">validatedToken</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ValidFrom</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Success</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#ABB2BF;">            new </span><span style="color:#E5C07B;">AuthenticationTicket</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">                tokenValidatedContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Principal</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">, </span></span>
<span class="line"><span style="color:#E5C07B;">                tokenValidatedContext</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Properties</span><span style="color:#ABB2BF;">, </span></span>
<span class="line"><span style="color:#E5C07B;">                Scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 JWT的Challenge = 返回401</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> override</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> HandleChallengeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#E5C07B;"> properties</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        Response</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">StatusCode</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 401</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 设置 WWW-Authenticate 头</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> wwwAuthenticate</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">StringBuilder</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Bearer&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Challenge</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            wwwAuthenticate</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Append</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">$&quot; realm=</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#ABB2BF;">{</span><span style="color:#E5C07B;">Options</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Challenge</span><span style="color:#ABB2BF;">}</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 如果有错误信息，也加上</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">_authFailedError</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            wwwAuthenticate</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Append</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">$&quot;, error=</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#ABB2BF;">{</span><span style="color:#E06C75;">_authFailedError</span><span style="color:#ABB2BF;">}</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E5C07B;">            wwwAuthenticate</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Append</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">$&quot;, error_description=</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#ABB2BF;">{</span><span style="color:#E06C75;">_authFailedErrorDescription</span><span style="color:#ABB2BF;">}</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#E5C07B;">        Response</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Headers</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Append</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">            HeaderNames</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">WWWAuthenticate</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">wwwAuthenticate</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ToString</span><span style="color:#ABB2BF;">());</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">CompletedTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>JWT Token 内部结构（Base64解码后）：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.    ← Header (Base64)</span></span>
<span class="line"><span>eyJzdWIiOiJ1c2VyLWd1aWQtMTIzIiwibmFtZS   ← Payload (Base64)</span></span>
<span class="line"><span>I6IuW8oOS4iSIsImVtYWlsIjoienNAZXhhbXBsZ</span></span>
<span class="line"><span>S5jb20iLCJyb2xlIjoiQWRtaW4iLCJpc3MiOiJo</span></span>
<span class="line"><span>dHRwczovL3Nzby5leGFtcGxlLmNvbSIsImF1ZCI</span></span>
<span class="line"><span>6IndlYi1hcHAiLCJleHAiOjE3MDAwMDAwMDAsIm</span></span>
<span class="line"><span>lhdCI6MTY5OTk5NjQwMH0.                     </span></span>
<span class="line"><span>kF7nQ...                                    ← Signature (RSA/HMAC)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Header: { &quot;alg&quot;: &quot;RS256&quot;, &quot;typ&quot;: &quot;JWT&quot; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Payload: {</span></span>
<span class="line"><span>    &quot;sub&quot;: &quot;user-guid-123&quot;,          ← Subject（用户ID）</span></span>
<span class="line"><span>    &quot;name&quot;: &quot;张三&quot;,                   ← 用户名</span></span>
<span class="line"><span>    &quot;email&quot;: &quot;zs@example.com&quot;,       ← 邮箱</span></span>
<span class="line"><span>    &quot;role&quot;: &quot;Admin&quot;,                 ← 角色</span></span>
<span class="line"><span>    &quot;iss&quot;: &quot;https://sso.example.com&quot;, ← Issuer（签发者 = 你的SSO服务器）</span></span>
<span class="line"><span>    &quot;aud&quot;: &quot;web-app&quot;,                ← Audience（受众 = 客户端应用）</span></span>
<span class="line"><span>    &quot;exp&quot;: 1700000000,               ← Expiration（过期时间）</span></span>
<span class="line"><span>    &quot;iat&quot;: 1699996400,               ← Issued At（签发时间）</span></span>
<span class="line"><span>    &quot;scope&quot;: &quot;openid profile email&quot;  ← 授权范围</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Signature: RSA-SHA256(</span></span>
<span class="line"><span>    base64(header) + &quot;.&quot; + base64(payload),</span></span>
<span class="line"><span>    privateKey                        ← SSO服务器的私钥签名</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>验证过程：</span></span>
<span class="line"><span>1. Base64解码 Header → 得知算法是 RS256</span></span>
<span class="line"><span>2. Base64解码 Payload → 得到Claims</span></span>
<span class="line"><span>3. 用SSO服务器的公钥验证 Signature → 确认未被篡改</span></span>
<span class="line"><span>4. 检查 exp → 确认未过期</span></span>
<span class="line"><span>5. 检查 iss → 确认是受信任的签发者</span></span>
<span class="line"><span>6. 检查 aud → 确认是发给自己的</span></span>
<span class="line"><span>7. 所有检查通过 → 构建 ClaimsPrincipal</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="九、authenticationmiddleware-完整源码再看-结合上面的知识" tabindex="-1"><a class="header-anchor" href="#九、authenticationmiddleware-完整源码再看-结合上面的知识"><span>九、AuthenticationMiddleware 完整源码再看（结合上面的知识）</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Core/src/AuthenticationMiddleware.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthenticationMiddleware</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> RequestDelegate</span><span style="color:#E06C75;"> _next</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> AuthenticationMiddleware</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">RequestDelegate</span><span style="color:#E5C07B;"> next</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">IAuthenticationSchemeProvider</span><span style="color:#E5C07B;"> schemes</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _next</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> next</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        Schemes</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> schemes</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> IAuthenticationSchemeProvider</span><span style="color:#ABB2BF;"> Schemes { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> Invoke</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 设置原始路径信息</span></span>
<span class="line"><span style="color:#E5C07B;">        context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Features</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Set</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAuthenticationFeature</span><span style="color:#ABB2BF;">&gt;(new </span><span style="color:#E5C07B;">AuthenticationFeature</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E06C75;">            OriginalPath</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Path</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">            OriginalPathBase</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">PathBase</span></span>
<span class="line"><span style="color:#ABB2BF;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 获取 Handler 提供者</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> handlers</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RequestServices</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAuthenticationHandlerProvider</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // =====================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥🔥🔥 第一阶段：遍历 RequestHandler</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 这就是 OpenIddict Server Handler 工作的地方！</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // =====================================================</span></span>
<span class="line"><span style="color:#C678DD;">        foreach</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> scheme</span><span style="color:#C678DD;"> in</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">Schemes</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetRequestHandlerSchemesAsync</span><span style="color:#ABB2BF;">())</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> handler</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">handlers</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetHandlerAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">                as </span><span style="color:#E5C07B;">IAuthenticationRequestHandler</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">handler</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#56B6C2;"> &amp;&amp;</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">handler</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">HandleRequestAsync</span><span style="color:#ABB2BF;">())</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // Handler 处理了请求 → 短路！</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // OpenIddict 场景：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                //   请求: POST /connect/token</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                //   OpenIddictServerAspNetCoreHandler.HandleRequestAsync()</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                //     → 验证client_id/client_secret</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                //     → 验证授权码</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                //     → 生成 access_token + id_token</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                //     → 写入响应</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                //     → return true (短路)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                //</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // 请求: GET /connect/authorize</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                //   如果没开Passthrough → 直接处理</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                //   如果开了Passthrough → return false → 继续到Controller</span></span>
<span class="line"><span style="color:#ABB2BF;">                </span></span>
<span class="line"><span style="color:#C678DD;">                return</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;">// 不调用 _next，管道到此结束</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // =====================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥🔥🔥 第二阶段：执行默认认证方案</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 设置 context.User</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // =====================================================</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> defaultAuthenticate</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">Schemes</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetDefaultAuthenticateSchemeAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">defaultAuthenticate</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">context</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AuthenticateAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">defaultAuthenticate</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">result</span><span style="color:#ABB2BF;">?.</span><span style="color:#E5C07B;">Principal</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E5C07B;">                context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">User</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> result</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Principal</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // 从这里开始，后续所有中间件和Controller</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // 都能通过 context.User 或 User属性访问到当前用户</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // =====================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 继续管道</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // =====================================================</span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#61AFEF;">_next</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十、openiddict-如何嵌入认证系统" tabindex="-1"><a class="header-anchor" href="#十、openiddict-如何嵌入认证系统"><span>十、OpenIddict 如何嵌入认证系统</span></a></h2><h3 id="_10-1-openiddict-注册的-handler" tabindex="-1"><a class="header-anchor" href="#_10-1-openiddict-注册的-handler"><span>10.1 OpenIddict 注册的 Handler</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 当你调用 AddOpenIddict().AddServer().UseAspNetCore() 时</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 内部注册了：</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 OpenIddict 源码</span></span>
<span class="line"><span style="color:#E5C07B;">services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Configure</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticationOptions</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E5C07B;">options</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 注册 OpenIddict Server 方案</span></span>
<span class="line"><span style="color:#E5C07B;">    options</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddScheme</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">OpenIddictServerAspNetCoreHandler</span><span style="color:#ABB2BF;">&gt;(</span></span>
<span class="line"><span style="color:#E5C07B;">        OpenIddictServerAspNetCoreDefaults</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">AuthenticationScheme</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // Name = &quot;OpenIddict.Server.AspNetCore&quot;</span></span>
<span class="line"><span style="color:#E5C07B;">        displayName</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">null</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// OpenIddictServerAspNetCoreHandler 实现了 IAuthenticationRequestHandler</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 所以它会在 AuthenticationMiddleware 的第一阶段被遍历到</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-openiddictserveraspnetcorehandler-的工作方式" tabindex="-1"><a class="header-anchor" href="#_10-2-openiddictserveraspnetcorehandler-的工作方式"><span>10.2 OpenIddictServerAspNetCoreHandler 的工作方式</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 简化版的 OpenIddict Server Handler 逻辑</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> OpenIddictServerAspNetCoreHandler</span><span style="color:#ABB2BF;"> : </span></span>
<span class="line"><span style="color:#E5C07B;">    AuthenticationHandler</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">OpenIddictServerAspNetCoreOptions</span><span style="color:#ABB2BF;">&gt;,</span></span>
<span class="line"><span style="color:#E5C07B;">    IAuthenticationRequestHandler</span><span style="color:#7F848E;font-style:italic;">  // 👈 关键接口</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =====================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // HandleRequestAsync —— 处理 OAuth/OIDC 端点请求</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =====================================================</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">HandleRequestAsync</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 第1步：检查当前请求是否匹配 OpenIddict 端点</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> notification</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">ProcessRequestContext</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">Context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 检查路径</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#61AFEF;">IsAuthorizationEndpoint</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Path</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // /connect/authorize</span></span>
<span class="line"><span style="color:#E5C07B;">            notification</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">EndpointType</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> OpenIddictServerEndpointType</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Authorization</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#C678DD;">        else</span><span style="color:#C678DD;"> if</span><span style="color:#ABB2BF;"> (</span><span style="color:#61AFEF;">IsTokenEndpoint</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Path</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // /connect/token</span></span>
<span class="line"><span style="color:#E5C07B;">            notification</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">EndpointType</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> OpenIddictServerEndpointType</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Token</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#C678DD;">        else</span><span style="color:#C678DD;"> if</span><span style="color:#ABB2BF;"> (</span><span style="color:#61AFEF;">IsLogoutEndpoint</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Request</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Path</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // /connect/logout</span></span>
<span class="line"><span style="color:#E5C07B;">            notification</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">EndpointType</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> OpenIddictServerEndpointType</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Logout</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 不是 OpenIddict 的端点 → 不处理</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> false</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;">// 返回 false，认证中间件继续</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 第2步：执行 OpenIddict 的 Handler 管道</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // OpenIddict 内部也有一套类似中间件的 Handler 链</span></span>
<span class="line"><span style="color:#C678DD;">        foreach</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> handler</span><span style="color:#C678DD;"> in</span><span style="color:#E06C75;"> _handlers</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">handler</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">HandleAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">notification</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">notification</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IsRequestHandled</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">                break</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">notification</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IsRequestSkipped</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">                break</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">notification</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IsRejected</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">                break</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 🔥 第3步：根据处理结果决定是否短路</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">notification</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IsRequestHandled</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // OpenIddict 完全处理了请求（如Token端点）</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> true</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;">// 短路</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">notification</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IsRequestSkipped</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 开启了 Passthrough → 让请求继续到 Controller</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 但已经将解析后的请求信息存到了 HttpContext 中</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // context.Features.Set&lt;OpenIddictServerAspNetCoreFeature&gt;(...)</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> false</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;">// 不短路</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">notification</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IsRejected</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 请求格式错误 → 返回错误响应</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#61AFEF;">WriteErrorResponse</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">notification</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> true</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;">// 短路</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> false</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =====================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // HandleAuthenticateAsync —— 验证 OpenIddict Token</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // =====================================================</span></span>
<span class="line"><span style="color:#C678DD;">    protected</span><span style="color:#C678DD;"> override</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">HandleAuthenticateAsync</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 这个方法在验证 Access Token 时被调用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // （当资源服务器使用 OpenIddict Validation 时）</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> notification</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">ProcessAuthenticationContext</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">Context</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 执行验证 Handler 链</span></span>
<span class="line"><span style="color:#C678DD;">        foreach</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> handler</span><span style="color:#C678DD;"> in</span><span style="color:#E06C75;"> _handlers</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">handler</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">HandleAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">notification</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">notification</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IsRequestHandled</span><span style="color:#56B6C2;"> ||</span><span style="color:#E5C07B;"> notification</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IsRequestSkipped</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">NoResult</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">notification</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IsRejected</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Fail</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">notification</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Error</span><span style="color:#ABB2BF;"> ?? </span><span style="color:#98C379;">&quot;Authentication failed&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 验证成功 → 返回 ClaimsPrincipal</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> identity</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> notification</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Principal</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Identity</span><span style="color:#ABB2BF;"> as </span><span style="color:#E5C07B;">ClaimsIdentity</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> ticket</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">AuthenticationTicket</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#ABB2BF;">            new </span><span style="color:#E5C07B;">ClaimsPrincipal</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">identity</span><span style="color:#56B6C2;">!</span><span style="color:#ABB2BF;">),</span></span>
<span class="line"><span style="color:#ABB2BF;">            new </span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#ABB2BF;">(),</span></span>
<span class="line"><span style="color:#E5C07B;">            Scheme</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Name</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Success</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ticket</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-passthrough-机制详解" tabindex="-1"><a class="header-anchor" href="#_10-3-passthrough-机制详解"><span>10.3 Passthrough 机制详解</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>当你配置了 EnableAuthorizationEndpointPassthrough() 时：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请求: GET /connect/authorize?client_id=web-app&amp;response_type=code&amp;scope=openid</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│ AuthenticationMiddleware                                             │</span></span>
<span class="line"><span>│   │                                                                  │</span></span>
<span class="line"><span>│   │  遍历 IAuthenticationRequestHandler                              │</span></span>
<span class="line"><span>│   │     │                                                            │</span></span>
<span class="line"><span>│   │     ▼                                                            │</span></span>
<span class="line"><span>│   │  OpenIddictServerAspNetCoreHandler.HandleRequestAsync()          │</span></span>
<span class="line"><span>│   │     │                                                            │</span></span>
<span class="line"><span>│   │     │  1. 识别：这是 Authorization 端点                           │</span></span>
<span class="line"><span>│   │     │  2. 验证请求参数：                                          │</span></span>
<span class="line"><span>│   │     │     ✅ client_id = &quot;web-app&quot; → 数据库中存在                 │</span></span>
<span class="line"><span>│   │     │     ✅ response_type = &quot;code&quot; → 客户端允许此类型             │</span></span>
<span class="line"><span>│   │     │     ✅ scope = &quot;openid&quot; → 客户端允许此scope                 │</span></span>
<span class="line"><span>│   │     │     ✅ redirect_uri → 匹配注册的回调地址                    │</span></span>
<span class="line"><span>│   │     │                                                            │</span></span>
<span class="line"><span>│   │     │  3. 因为开启了 Passthrough：                                │</span></span>
<span class="line"><span>│   │     │     → 把解析后的请求信息存到 HttpContext                     │</span></span>
<span class="line"><span>│   │     │     context.Features.Set(new OpenIddictServerAspNetCoreFeature │</span></span>
<span class="line"><span>│   │     │     {                                                      │</span></span>
<span class="line"><span>│   │     │         Transaction = { Request = openiddictRequest }      │</span></span>
<span class="line"><span>│   │     │     });                                                    │</span></span>
<span class="line"><span>│   │     │     → return false（不短路）                                │</span></span>
<span class="line"><span>│   │     │                                                            │</span></span>
<span class="line"><span>│   │     ▼                                                            │</span></span>
<span class="line"><span>│   │  继续管道...                                                      │</span></span>
<span class="line"><span>│   │                                                                  │</span></span>
<span class="line"><span>├──────────────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│ AuthorizationMiddleware                                              │</span></span>
<span class="line"><span>│   │  正常授权检查                                                     │</span></span>
<span class="line"><span>├──────────────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│ Endpoint Execution                                                   │</span></span>
<span class="line"><span>│   │                                                                  │</span></span>
<span class="line"><span>│   ▼                                                                  │</span></span>
<span class="line"><span>│ AuthorizationController.Authorize() ← 你写的Controller               │</span></span>
<span class="line"><span>│   │                                                                  │</span></span>
<span class="line"><span>│   │  // 🔥 从 HttpContext 获取 OpenIddict 解析后的请求                 │</span></span>
<span class="line"><span>│   │  var request = HttpContext.GetOpenIddictServerRequest()!;        │</span></span>
<span class="line"><span>│   │  // request.ClientId = &quot;web-app&quot;                                 │</span></span>
<span class="line"><span>│   │  // request.Scope = &quot;openid&quot;                                     │</span></span>
<span class="line"><span>│   │                                                                  │</span></span>
<span class="line"><span>│   │  // 检查用户是否已登录                                            │</span></span>
<span class="line"><span>│   │  if (User.Identity?.IsAuthenticated != true)                     │</span></span>
<span class="line"><span>│   │  {                                                               │</span></span>
<span class="line"><span>│   │      // 未登录 → 重定向到登录页                                    │</span></span>
<span class="line"><span>│   │      return Challenge();                                         │</span></span>
<span class="line"><span>│   │  }                                                               │</span></span>
<span class="line"><span>│   │                                                                  │</span></span>
<span class="line"><span>│   │  // 已登录 → 检查是否需要用户同意                                  │</span></span>
<span class="line"><span>│   │  if (需要同意 &amp;&amp; 还没同意)                                        │</span></span>
<span class="line"><span>│   │  {                                                               │</span></span>
<span class="line"><span>│   │      // 展示同意页面                                              │</span></span>
<span class="line"><span>│   │      return View(&quot;Consent&quot;, consentModel);                       │</span></span>
<span class="line"><span>│   │  }                                                               │</span></span>
<span class="line"><span>│   │                                                                  │</span></span>
<span class="line"><span>│   │  // 已同意 → 签发授权码                                           │</span></span>
<span class="line"><span>│   │  var identity = new ClaimsIdentity(                               │</span></span>
<span class="line"><span>│   │      OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);    │</span></span>
<span class="line"><span>│   │  identity.AddClaim(Claims.Subject, user.Id);                     │</span></span>
<span class="line"><span>│   │  identity.AddClaim(Claims.Name, user.UserName);                  │</span></span>
<span class="line"><span>│   │                                                                  │</span></span>
<span class="line"><span>│   │  var principal = new ClaimsPrincipal(identity);                   │</span></span>
<span class="line"><span>│   │  principal.SetScopes(request.GetScopes());                       │</span></span>
<span class="line"><span>│   │                                                                  │</span></span>
<span class="line"><span>│   │  // 🔥 让 OpenIddict 生成授权码                                   │</span></span>
<span class="line"><span>│   │  return SignIn(principal,                                         │</span></span>
<span class="line"><span>│   │      OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);    │</span></span>
<span class="line"><span>│   │  // ↑ 这会调用 OpenIddictServerHandler 的 SignInAsync            │</span></span>
<span class="line"><span>│   │  // → 生成 authorization_code                                    │</span></span>
<span class="line"><span>│   │  // → 302 重定向到 redirect_uri?code=xxx                         │</span></span>
<span class="line"><span>│   │                                                                  │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十一、完整的-sso-认证流程——authorization-code-flow" tabindex="-1"><a class="header-anchor" href="#十一、完整的-sso-认证流程——authorization-code-flow"><span>十一、完整的 SSO 认证流程——Authorization Code Flow</span></a></h2><p>把所有知识串起来，看一个完整的SSO登录过程：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>参与方：</span></span>
<span class="line"><span>  - 用户浏览器</span></span>
<span class="line"><span>  - 客户端应用 (web-app, https://webapp.example.com)</span></span>
<span class="line"><span>  - SSO 授权服务器 (https://sso.example.com) ← 你要搭建的</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>授权码流程（Authorization Code Flow）：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>步骤1：用户访问客户端应用的受保护页面</span></span>
<span class="line"><span>════════════════════════════════════════════════════════════════</span></span>
<span class="line"><span></span></span>
<span class="line"><span>浏览器 → GET https://webapp.example.com/profile</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ▼</span></span>
<span class="line"><span>    客户端应用检查：用户未登录</span></span>
<span class="line"><span>    需要认证 → Challenge(&quot;oidc&quot;)</span></span>
<span class="line"><span>    OpenIdConnectHandler.HandleChallengeAsync()</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ▼</span></span>
<span class="line"><span>    302 Redirect to:</span></span>
<span class="line"><span>    https://sso.example.com/connect/authorize?</span></span>
<span class="line"><span>        client_id=web-app</span></span>
<span class="line"><span>        &amp;response_type=code</span></span>
<span class="line"><span>        &amp;scope=openid profile email</span></span>
<span class="line"><span>        &amp;redirect_uri=https://webapp.example.com/callback</span></span>
<span class="line"><span>        &amp;state=random-state-value</span></span>
<span class="line"><span>        &amp;code_challenge=S256-hash     (PKCE)</span></span>
<span class="line"><span>        &amp;code_challenge_method=S256</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>步骤2：SSO服务器处理授权请求</span></span>
<span class="line"><span>════════════════════════════════════════════════════════════════</span></span>
<span class="line"><span></span></span>
<span class="line"><span>浏览器 → GET https://sso.example.com/connect/authorize?...</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ▼</span></span>
<span class="line"><span>    SSO服务器的中间件管道：</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── AuthenticationMiddleware</span></span>
<span class="line"><span>    │   │</span></span>
<span class="line"><span>    │   ├── OpenIddictServerHandler.HandleRequestAsync()</span></span>
<span class="line"><span>    │   │   → 识别：Authorization端点</span></span>
<span class="line"><span>    │   │   → 验证参数：client_id, redirect_uri, scope ✅</span></span>
<span class="line"><span>    │   │   → Passthrough → return false</span></span>
<span class="line"><span>    │   │</span></span>
<span class="line"><span>    │   └── 默认认证(Cookies)</span></span>
<span class="line"><span>    │       → 没有Cookie → context.User = 匿名</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── AuthorizationMiddleware → 通过（Controller自己处理）</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    └── AuthorizationController.Authorize()</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        │ User.Identity.IsAuthenticated == false</span></span>
<span class="line"><span>        │ → return Challenge(&quot;Cookies&quot;)</span></span>
<span class="line"><span>        │ → 302 Redirect to /Account/Login?ReturnUrl=/connect/authorize?...</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span></span></span>
<span class="line"><span>步骤3：用户在SSO服务器上登录</span></span>
<span class="line"><span>════════════════════════════════════════════════════════════════</span></span>
<span class="line"><span></span></span>
<span class="line"><span>浏览器 → GET https://sso.example.com/Account/Login?ReturnUrl=...</span></span>
<span class="line"><span>         （展示登录页面）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>浏览器 → POST https://sso.example.com/Account/Login</span></span>
<span class="line"><span>         (username=zhangsan, password=****)</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ▼</span></span>
<span class="line"><span>    AccountController.Login()</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── Identity.CheckPasswordSignInAsync() → 验证密码 ✅</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── HttpContext.SignInAsync(&quot;Cookies&quot;, principal)</span></span>
<span class="line"><span>    │   → CookieHandler.SignInAsync()</span></span>
<span class="line"><span>    │   → 写入Cookie: Set-Cookie: .AspNetCore.Identity.Application=...</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    └── 302 Redirect to /connect/authorize?... (ReturnUrl)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>步骤4：回到授权端点（现在用户已登录）</span></span>
<span class="line"><span>════════════════════════════════════════════════════════════════</span></span>
<span class="line"><span></span></span>
<span class="line"><span>浏览器 → GET https://sso.example.com/connect/authorize?...</span></span>
<span class="line"><span>         Cookie: .AspNetCore.Identity.Application=...</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ▼</span></span>
<span class="line"><span>    SSO服务器的中间件管道：</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── AuthenticationMiddleware</span></span>
<span class="line"><span>    │   │</span></span>
<span class="line"><span>    │   ├── OpenIddictServerHandler → Passthrough → 继续</span></span>
<span class="line"><span>    │   │</span></span>
<span class="line"><span>    │   └── 默认认证(Cookies)</span></span>
<span class="line"><span>    │       → 有Cookie → 解密 → ClaimsPrincipal</span></span>
<span class="line"><span>    │       → context.User = { Name=&quot;zhangsan&quot;, sub=&quot;user-guid-123&quot; } ✅</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    └── AuthorizationController.Authorize()</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        │ User.Identity.IsAuthenticated == true ✅</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        │ // 创建用于签发Token的Principal</span></span>
<span class="line"><span>        │ var identity = new ClaimsIdentity(&quot;OpenIddict.Server.AspNetCore&quot;);</span></span>
<span class="line"><span>        │ identity.AddClaim(Claims.Subject, user.Id);</span></span>
<span class="line"><span>        │ identity.AddClaim(Claims.Name, user.UserName);</span></span>
<span class="line"><span>        │ identity.AddClaim(Claims.Email, user.Email);</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        │ var principal = new ClaimsPrincipal(identity);</span></span>
<span class="line"><span>        │ principal.SetScopes(request.GetScopes());</span></span>
<span class="line"><span>        │ principal.SetResources(&quot;web-app&quot;);</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        │ return SignIn(principal, &quot;OpenIddict.Server.AspNetCore&quot;);</span></span>
<span class="line"><span>        │   │</span></span>
<span class="line"><span>        │   ▼</span></span>
<span class="line"><span>        │ OpenIddictServerHandler.SignInAsync()</span></span>
<span class="line"><span>        │   → 生成 authorization_code（随机字符串，存入数据库）</span></span>
<span class="line"><span>        │   → 302 Redirect to:</span></span>
<span class="line"><span>        │     https://webapp.example.com/callback?</span></span>
<span class="line"><span>        │       code=abc123</span></span>
<span class="line"><span>        │       &amp;state=random-state-value</span></span>
<span class="line"><span>        │</span></span>
<span class="line"><span>        ▼</span></span>
<span class="line"><span></span></span>
<span class="line"><span>步骤5：客户端应用用授权码换取Token</span></span>
<span class="line"><span>════════════════════════════════════════════════════════════════</span></span>
<span class="line"><span></span></span>
<span class="line"><span>浏览器 → GET https://webapp.example.com/callback?code=abc123&amp;state=...</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ▼</span></span>
<span class="line"><span>    客户端应用的 OpenIdConnectHandler 自动处理回调：</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    │ // 服务端到服务端的HTTP请求（不经过浏览器）</span></span>
<span class="line"><span>    │ POST https://sso.example.com/connect/token</span></span>
<span class="line"><span>    │ Content-Type: application/x-www-form-urlencoded</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    │ grant_type=authorization_code</span></span>
<span class="line"><span>    │ &amp;code=abc123</span></span>
<span class="line"><span>    │ &amp;redirect_uri=https://webapp.example.com/callback</span></span>
<span class="line"><span>    │ &amp;client_id=web-app</span></span>
<span class="line"><span>    │ &amp;client_secret=web-app-secret</span></span>
<span class="line"><span>    │ &amp;code_verifier=pkce-verifier    (PKCE)</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ▼</span></span>
<span class="line"><span></span></span>
<span class="line"><span>步骤6：SSO服务器处理Token请求</span></span>
<span class="line"><span>════════════════════════════════════════════════════════════════</span></span>
<span class="line"><span></span></span>
<span class="line"><span>POST https://sso.example.com/connect/token</span></span>
<span class="line"><span>         │</span></span>
<span class="line"><span>         ▼</span></span>
<span class="line"><span>    SSO服务器的中间件管道：</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── AuthenticationMiddleware</span></span>
<span class="line"><span>    │   │</span></span>
<span class="line"><span>    │   └── OpenIddictServerHandler.HandleRequestAsync()</span></span>
<span class="line"><span>    │       → 识别：Token端点</span></span>
<span class="line"><span>    │       → 验证 client_id + client_secret ✅</span></span>
<span class="line"><span>    │       → 验证 authorization_code ✅（数据库中存在且未使用）</span></span>
<span class="line"><span>    │       → 验证 code_verifier (PKCE) ✅</span></span>
<span class="line"><span>    │       → 验证 redirect_uri ✅（匹配）</span></span>
<span class="line"><span>    │       │</span></span>
<span class="line"><span>    │       → 生成 access_token (JWT，用私钥签名)</span></span>
<span class="line"><span>    │       → 生成 id_token (JWT，包含用户信息)</span></span>
<span class="line"><span>    │       → 可选：生成 refresh_token</span></span>
<span class="line"><span>    │       │</span></span>
<span class="line"><span>    │       → 写入响应：</span></span>
<span class="line"><span>    │         {</span></span>
<span class="line"><span>    │           &quot;access_token&quot;: &quot;eyJhbG...&quot;,</span></span>
<span class="line"><span>    │           &quot;token_type&quot;: &quot;Bearer&quot;,</span></span>
<span class="line"><span>    │           &quot;expires_in&quot;: 3600,</span></span>
<span class="line"><span>    │           &quot;id_token&quot;: &quot;eyJhbG...&quot;,</span></span>
<span class="line"><span>    │           &quot;refresh_token&quot;: &quot;rt_abc...&quot;</span></span>
<span class="line"><span>    │         }</span></span>
<span class="line"><span>    │       │</span></span>
<span class="line"><span>    │       → return true (短路！)</span></span>
<span class="line"><span>    │       │ 后续中间件（Authorization, Routing等）全部跳过</span></span>
<span class="line"><span>    │       │ 因为Token端点是纯API，不需要MVC</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ▼</span></span>
<span class="line"><span></span></span>
<span class="line"><span>步骤7：客户端应用处理Token响应</span></span>
<span class="line"><span>════════════════════════════════════════════════════════════════</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    客户端应用的 OpenIdConnectHandler：</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├── 验证 id_token 签名（用SSO服务器的公钥）</span></span>
<span class="line"><span>    ├── 从 id_token 提取用户信息 → ClaimsPrincipal</span></span>
<span class="line"><span>    ├── 调用 HttpContext.SignInAsync(&quot;Cookies&quot;, principal)</span></span>
<span class="line"><span>    │   → 将用户信息写入客户端的Cookie</span></span>
<span class="line"><span>    ├── 保存 access_token（用于调用API）</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    └── 302 Redirect to /profile (原始请求的页面)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    浏览器 → GET https://webapp.example.com/profile</span></span>
<span class="line"><span>             Cookie: .AspNetCore.Cookies=...</span></span>
<span class="line"><span>             │</span></span>
<span class="line"><span>             ▼</span></span>
<span class="line"><span>        客户端应用认证通过 ✅</span></span>
<span class="line"><span>        展示个人资料页面</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十二、httpcontext-上的认证扩展方法" tabindex="-1"><a class="header-anchor" href="#十二、httpcontext-上的认证扩展方法"><span>十二、HttpContext 上的认证扩展方法</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Core/src/AuthenticationHttpContextExtensions.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 你在Controller中用到的方法，都是 HttpContext 的扩展方法</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> static</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthenticationHttpContextExtensions</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 认证</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">AuthenticateResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">AuthenticateAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        this</span><span style="color:#E5C07B;"> HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">scheme</span><span style="color:#ABB2BF;">) =&gt;</span></span>
<span class="line"><span style="color:#E5C07B;">        context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RequestServices</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAuthenticationService</span><span style="color:#ABB2BF;">&gt;()</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">AuthenticateAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 质询（要求登录）</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> ChallengeAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        this</span><span style="color:#E5C07B;"> HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">scheme</span><span style="color:#ABB2BF;">, </span></span>
<span class="line"><span style="color:#E5C07B;">        AuthenticationProperties</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">properties</span><span style="color:#ABB2BF;">) =&gt;</span></span>
<span class="line"><span style="color:#E5C07B;">        context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RequestServices</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAuthenticationService</span><span style="color:#ABB2BF;">&gt;()</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">ChallengeAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">properties</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 登入</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> SignInAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        this</span><span style="color:#E5C07B;"> HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">scheme</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        ClaimsPrincipal</span><span style="color:#E5C07B;"> principal</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">AuthenticationProperties</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">properties</span><span style="color:#ABB2BF;">) =&gt;</span></span>
<span class="line"><span style="color:#E5C07B;">        context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RequestServices</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAuthenticationService</span><span style="color:#ABB2BF;">&gt;()</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">SignInAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">principal</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">properties</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 登出</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> SignOutAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        this</span><span style="color:#E5C07B;"> HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">scheme</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        AuthenticationProperties</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">properties</span><span style="color:#ABB2BF;">) =&gt;</span></span>
<span class="line"><span style="color:#E5C07B;">        context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RequestServices</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAuthenticationService</span><span style="color:#ABB2BF;">&gt;()</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">SignOutAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">properties</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 🔥 禁止</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> ForbidAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        this</span><span style="color:#E5C07B;"> HttpContext</span><span style="color:#E5C07B;"> context</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">scheme</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        AuthenticationProperties</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">properties</span><span style="color:#ABB2BF;">) =&gt;</span></span>
<span class="line"><span style="color:#E5C07B;">        context</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">RequestServices</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">GetRequiredService</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">IAuthenticationService</span><span style="color:#ABB2BF;">&gt;()</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">ForbidAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">context</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">properties</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// Controller 中的快捷方法最终都调用到这里：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// return Challenge() → HttpContext.ChallengeAsync(...)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// return SignIn(principal, scheme) → HttpContext.SignInAsync(...)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// return SignOut(scheme) → HttpContext.SignOutAsync(...)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十三、authenticateresult-的三种状态" tabindex="-1"><a class="header-anchor" href="#十三、authenticateresult-的三种状态"><span>十三、AuthenticateResult 的三种状态</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 📁 源码位置: src/Security/Authentication/Core/src/AuthenticateResult.cs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> AuthenticateResult</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> bool</span><span style="color:#ABB2BF;"> Succeeded { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> AuthenticationTicket</span><span style="color:#ABB2BF;">? Ticket { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> ClaimsPrincipal</span><span style="color:#ABB2BF;">? Principal =&gt; </span><span style="color:#E5C07B;">Ticket</span><span style="color:#ABB2BF;">?.</span><span style="color:#E5C07B;">Principal</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> AuthenticationProperties</span><span style="color:#ABB2BF;">? Properties =&gt; </span><span style="color:#E5C07B;">Ticket</span><span style="color:#ABB2BF;">?.</span><span style="color:#E5C07B;">Properties</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> Exception</span><span style="color:#ABB2BF;">? Failure { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> bool</span><span style="color:#ABB2BF;"> None { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; }  </span><span style="color:#7F848E;font-style:italic;">// 👈 第三种状态</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ✅ 成功：有身份信息</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#61AFEF;"> Success</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">AuthenticationTicket</span><span style="color:#E5C07B;"> ticket</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        =&gt; new() { </span><span style="color:#E06C75;">Ticket</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> ticket</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Succeeded</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> true</span><span style="color:#ABB2BF;"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ❌ 失败：尝试了但失败了（如Token无效/过期）</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#61AFEF;"> Fail</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Exception</span><span style="color:#E5C07B;"> failure</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        =&gt; new() { </span><span style="color:#E06C75;">Failure</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> failure</span><span style="color:#ABB2BF;"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // ➖ 无结果：没有尝试（如没有Cookie/没有Authorization头）</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> AuthenticateResult</span><span style="color:#61AFEF;"> NoResult</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">        =&gt; new() { </span><span style="color:#E06C75;">None</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> true</span><span style="color:#ABB2BF;"> };</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>三种状态的区别：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Success:  请求中有凭证，验证通过</span></span>
<span class="line"><span>          → context.User = principal</span></span>
<span class="line"><span>          → 后续授权检查可以进行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Fail:     请求中有凭证，但验证失败</span></span>
<span class="line"><span>          → context.User = 匿名</span></span>
<span class="line"><span>          → 日志记录失败原因</span></span>
<span class="line"><span>          → 授权中间件可能Challenge</span></span>
<span class="line"><span></span></span>
<span class="line"><span>NoResult: 请求中没有凭证</span></span>
<span class="line"><span>          → context.User = 匿名</span></span>
<span class="line"><span>          → 不是错误，只是没有身份信息</span></span>
<span class="line"><span>          → 如果有多个方案，尝试下一个</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│ 例子：一个API同时支持Cookie和JWT                          │</span></span>
<span class="line"><span>│                                                         │</span></span>
<span class="line"><span>│ 请求没有Cookie也没有JWT:                                  │</span></span>
<span class="line"><span>│   CookieHandler → NoResult                              │</span></span>
<span class="line"><span>│   JwtBearerHandler → NoResult                           │</span></span>
<span class="line"><span>│   最终：匿名用户                                         │</span></span>
<span class="line"><span>│                                                         │</span></span>
<span class="line"><span>│ 请求有过期的JWT:                                         │</span></span>
<span class="line"><span>│   JwtBearerHandler → Fail(&quot;Token expired&quot;)              │</span></span>
<span class="line"><span>│   最终：认证失败                                         │</span></span>
<span class="line"><span>│                                                         │</span></span>
<span class="line"><span>│ 请求有有效的Cookie:                                      │</span></span>
<span class="line"><span>│   CookieHandler → Success(principal)                    │</span></span>
<span class="line"><span>│   最终：context.User = zhangsan                         │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十四、data-protection-——-cookie加密的底层" tabindex="-1"><a class="header-anchor" href="#十四、data-protection-——-cookie加密的底层"><span>十四、Data Protection —— Cookie加密的底层</span></a></h2><p>Cookie 的加密和解密使用了 <a href="http://ASP.NET" target="_blank" rel="noopener noreferrer">ASP.NET</a> Core 的 Data Protection 系统：</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// Cookie 加解密流程</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 加密（SignIn时）：</span></span>
<span class="line"><span style="color:#E06C75;">ClaimsPrincipal</span></span>
<span class="line"><span style="color:#ABB2BF;">    │</span></span>
<span class="line"><span style="color:#ABB2BF;">    ▼</span></span>
<span class="line"><span style="color:#E06C75;">AuthenticationTicket</span><span style="color:#ABB2BF;"> { </span><span style="color:#E06C75;">Principal</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Properties</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">Scheme</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">    │</span></span>
<span class="line"><span style="color:#ABB2BF;">    ▼ </span><span style="color:#E5C07B;">TicketSerializer</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Serialize</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    │</span></span>
<span class="line"><span style="color:#C678DD;">byte</span><span style="color:#ABB2BF;">[]（</span><span style="color:#E06C75;">二进制序列化</span><span style="color:#ABB2BF;">）</span></span>
<span class="line"><span style="color:#ABB2BF;">    │</span></span>
<span class="line"><span style="color:#ABB2BF;">    ▼ </span><span style="color:#E5C07B;">DataProtector</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Protect</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    │   </span><span style="color:#E06C75;">内部</span><span style="color:#ABB2BF;">：</span><span style="color:#E06C75;">AES</span><span style="color:#56B6C2;">-</span><span style="color:#D19A66;">256</span><span style="color:#56B6C2;">-</span><span style="color:#E06C75;">CBC</span><span style="color:#E06C75;"> 加密</span><span style="color:#56B6C2;"> +</span><span style="color:#E06C75;"> HMAC</span><span style="color:#56B6C2;">-</span><span style="color:#E06C75;">SHA256</span><span style="color:#E06C75;"> 签名</span></span>
<span class="line"><span style="color:#ABB2BF;">    │   </span><span style="color:#E06C75;">密钥来自</span><span style="color:#E06C75;"> Data</span><span style="color:#E06C75;"> Protection</span><span style="color:#E06C75;"> Key</span><span style="color:#E06C75;"> Ring</span></span>
<span class="line"><span style="color:#ABB2BF;">    │</span></span>
<span class="line"><span style="color:#E06C75;">Base64</span><span style="color:#E06C75;"> 字符串</span></span>
<span class="line"><span style="color:#ABB2BF;">    │</span></span>
<span class="line"><span style="color:#ABB2BF;">    ▼ </span><span style="color:#E06C75;">写入</span><span style="color:#E06C75;"> Set</span><span style="color:#56B6C2;">-</span><span style="color:#E06C75;">Cookie</span><span style="color:#E06C75;"> 头</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#98C379;">&quot;CfDJ8N2xF5vQ3rM1kLn9P4ZSu...&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 解密（AuthenticateAsync时）：</span></span>
<span class="line"><span style="color:#E06C75;">Cookie字符串</span><span style="color:#98C379;"> &quot;CfDJ8N2xF5vQ3rM1kLn9P4ZSu...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    │</span></span>
<span class="line"><span style="color:#ABB2BF;">    ▼ </span><span style="color:#E5C07B;">DataProtector</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Unprotect</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    │   </span><span style="color:#E06C75;">内部</span><span style="color:#ABB2BF;">：</span><span style="color:#E06C75;">验证</span><span style="color:#E06C75;"> HMAC</span><span style="color:#ABB2BF;"> → </span><span style="color:#E06C75;">AES解密</span></span>
<span class="line"><span style="color:#ABB2BF;">    │   </span><span style="color:#E06C75;">如果被篡改</span><span style="color:#ABB2BF;"> → </span><span style="color:#E06C75;">抛异常</span><span style="color:#ABB2BF;"> → </span><span style="color:#E06C75;">认证失败</span></span>
<span class="line"><span style="color:#ABB2BF;">    │</span></span>
<span class="line"><span style="color:#C678DD;">byte</span><span style="color:#ABB2BF;">[]</span></span>
<span class="line"><span style="color:#ABB2BF;">    │</span></span>
<span class="line"><span style="color:#ABB2BF;">    ▼ </span><span style="color:#E5C07B;">TicketSerializer</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Deserialize</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    │</span></span>
<span class="line"><span style="color:#E06C75;">AuthenticationTicket</span></span>
<span class="line"><span style="color:#ABB2BF;">    │</span></span>
<span class="line"><span style="color:#ABB2BF;">    ▼</span></span>
<span class="line"><span style="color:#E06C75;">ClaimsPrincipal</span><span style="color:#ABB2BF;">（</span><span style="color:#E06C75;">恢复完整的用户身份信息</span><span style="color:#ABB2BF;">）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>对SSO项目的重要影响：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>⚠️ 如果你的SSO服务器部署多实例（负载均衡），</span></span>
<span class="line"><span>   Data Protection 的密钥必须共享！</span></span>
<span class="line"><span></span></span>
<span class="line"><span>否则：</span></span>
<span class="line"><span>  实例A加密的Cookie → 实例B无法解密 → 用户被要求重新登录</span></span>
<span class="line"><span></span></span>
<span class="line"><span>解决方案：</span></span>
<span class="line"><span>  // 将密钥存储在共享位置</span></span>
<span class="line"><span>  builder.Services.AddDataProtection()</span></span>
<span class="line"><span>      .PersistKeysToDbColumn(...)          // 数据库</span></span>
<span class="line"><span>      // 或</span></span>
<span class="line"><span>      .PersistKeysToStackExchangeRedis(...)  // Redis</span></span>
<span class="line"><span>      // 或</span></span>
<span class="line"><span>      .PersistKeysToFileSystem(...)          // 共享文件系统</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      // 可选：用证书加密密钥本身</span></span>
<span class="line"><span>      .ProtectKeysWithCertificate(cert);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十五、检验你的理解" tabindex="-1"><a class="header-anchor" href="#十五、检验你的理解"><span>十五、检验你的理解</span></a></h2><ol><li><p><strong>ClaimsPrincipal、ClaimsIdentity、Claim 三者的关系是什么？用现实类比。</strong><br> （答案：ClaimsPrincipal = 一个人。ClaimsIdentity = 一张证件（身份证/驾照/护照）。Claim = 证件上的一条信息（姓名/出生日期/地址）。一个人可以有多张证件，每张证件有多条信息。）</p></li><li><p><strong>认证中间件的两个阶段分别做什么？OpenIddict 工作在哪个阶段？</strong><br> （答案：第一阶段遍历所有 IAuthenticationRequestHandler，处理特殊请求（OAuth端点等），可能短路。第二阶段执行默认认证方案，设置 context.User。OpenIddict Server Handler 工作在第一阶段，作为 IAuthenticationRequestHandler 处理 /connect/token 等端点。）</p></li><li><p><strong>为什么认证失败了，认证中间件还要继续执行管道？</strong><br> （答案：因为有些端点允许匿名访问 [AllowAnonymous]。认证中间件只负责&quot;识别身份&quot;，不负责&quot;拒绝访问&quot;。拒绝是授权中间件的职责。如果认证就拒绝，那匿名可访问的端点也会被误拦截。）</p></li><li><p><strong>Cookie认证和JWT认证的本质区别是什么？为什么JWT Handler不支持 SignIn/SignOut？</strong><br> （答案：Cookie认证是有状态的——服务器通过Cookie维护会话状态（加密的Principal存在Cookie中）。JWT是无状态的——Token自包含所有信息，服务器不存储状态。SignIn是&quot;写入状态&quot;的操作，SignOut是&quot;清除状态&quot;的操作，JWT没有状态可写/清，所以不支持。JWT的签发由Token端点（OpenIddict）负责，<a href="http://xn--ASP-628dt110a.NET" target="_blank" rel="noopener noreferrer">不走ASP.NET</a> Core的SignIn流程。）</p></li><li><p><strong>OpenIddict 的 Passthrough 机制是什么？什么时候该用，什么时候不该用？</strong><br> （答案：Passthrough 让 OpenIddict 在验证请求格式后不直接处理，而是将解析结果存到 HttpContext 中，让请求继续到你的Controller。Authorization端点通常开启Passthrough（因为你需要展示登录页/同意页）。Token端点可以不开启（OpenIddict直接处理就行，除非你需要自定义Token签发逻辑）。）</p></li><li><p><strong>在一个多实例部署的SSO项目中，如果不配置共享Data Protection密钥会发生什么？</strong><br> （答案：用户在实例A上登录，Cookie被实例A的密钥加密。下次请求被负载均衡到实例B，实例B用自己的密钥无法解密Cookie → 认证失败 → 用户被要求重新登录 → 又到了实例A → 能解密了。用户体验极差，而且可能造成无限登录循环。）</p></li></ol><hr>`,92)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};