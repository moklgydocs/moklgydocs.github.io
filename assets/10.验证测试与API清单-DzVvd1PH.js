import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-DpHYttfJ.js";var i=JSON.parse(`{"path":"/%E5%90%8E%E7%AB%AF%E5%BC%80%E5%8F%91/ASP.NET_Core/%E5%8D%95%E7%82%B9%E7%99%BB%E5%BD%95/10.%E9%AA%8C%E8%AF%81%E6%B5%8B%E8%AF%95%E4%B8%8EAPI%E6%B8%85%E5%8D%95.html","title":"验证测试与 API 清单","lang":"zh-CN","frontmatter":{"title":"验证测试与 API 清单","date":"2025-04-09T00:00:00.000Z","category":["ASP.NET_Core"],"tag":["asp.netcore","SSO","OpenIddict"],"author":"Moklgy","order":10},"git":{"createdTime":1775720301000,"updatedTime":1775720301000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":2.06,"words":617},"filePathRelative":"后端开发/ASP.NET_Core/单点登录/10.验证测试与API清单.md"}`),a={name:`10.验证测试与API清单.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="验证测试与-api-清单" tabindex="-1"><a class="header-anchor" href="#验证测试与-api-清单"><span>验证测试与 API 清单</span></a></h1><h2 id="第十步-验证测试" tabindex="-1"><a class="header-anchor" href="#第十步-验证测试"><span>第十步：验证测试</span></a></h2><h3 id="_10-1-启动后通过-api-创建一个测试客户端" tabindex="-1"><a class="header-anchor" href="#_10-1-启动后通过-api-创建一个测试客户端"><span>10.1 启动后通过 API 创建一个测试客户端</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 先登录管理员</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -X</span><span style="color:#98C379;"> POST</span><span style="color:#98C379;"> https://localhost:5001/api/account/login</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -H</span><span style="color:#98C379;"> &quot;Content-Type: application/json&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -d</span><span style="color:#98C379;"> &#39;{&quot;username&quot;:&quot;admin&quot;,&quot;password&quot;:&quot;Admin@123456&quot;}&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -c</span><span style="color:#98C379;"> cookies.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 创建一个 React SPA 客户端（public 类型）</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -X</span><span style="color:#98C379;"> POST</span><span style="color:#98C379;"> https://localhost:5001/api/manage/clients</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -H</span><span style="color:#98C379;"> &quot;Content-Type: application/json&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -b</span><span style="color:#98C379;"> cookies.txt</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -d</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    &quot;clientId&quot;: &quot;react-app&quot;,</span></span>
<span class="line"><span style="color:#98C379;">    &quot;displayName&quot;: &quot;React 前端应用&quot;,</span></span>
<span class="line"><span style="color:#98C379;">    &quot;type&quot;: &quot;public&quot;,</span></span>
<span class="line"><span style="color:#98C379;">    &quot;redirectUris&quot;: [&quot;http://localhost:3000/callback&quot;],</span></span>
<span class="line"><span style="color:#98C379;">    &quot;postLogoutRedirectUris&quot;: [&quot;http://localhost:3000&quot;],</span></span>
<span class="line"><span style="color:#98C379;">    &quot;grantTypes&quot;: [&quot;authorization_code&quot;, &quot;refresh_token&quot;],</span></span>
<span class="line"><span style="color:#98C379;">    &quot;scopes&quot;: [&quot;openid&quot;, &quot;profile&quot;, &quot;email&quot;, &quot;api&quot;]</span></span>
<span class="line"><span style="color:#98C379;">  }&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 创建一个后端服务客户端（confidential 类型）</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -X</span><span style="color:#98C379;"> POST</span><span style="color:#98C379;"> https://localhost:5001/api/manage/clients</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -H</span><span style="color:#98C379;"> &quot;Content-Type: application/json&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -b</span><span style="color:#98C379;"> cookies.txt</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -d</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    &quot;clientId&quot;: &quot;backend-service&quot;,</span></span>
<span class="line"><span style="color:#98C379;">    &quot;clientSecret&quot;: &quot;backend-secret-123&quot;,</span></span>
<span class="line"><span style="color:#98C379;">    &quot;displayName&quot;: &quot;后端微服务&quot;,</span></span>
<span class="line"><span style="color:#98C379;">    &quot;type&quot;: &quot;confidential&quot;,</span></span>
<span class="line"><span style="color:#98C379;">    &quot;redirectUris&quot;: [],</span></span>
<span class="line"><span style="color:#98C379;">    &quot;postLogoutRedirectUris&quot;: [],</span></span>
<span class="line"><span style="color:#98C379;">    &quot;grantTypes&quot;: [&quot;client_credentials&quot;],</span></span>
<span class="line"><span style="color:#98C379;">    &quot;scopes&quot;: [&quot;api&quot;]</span></span>
<span class="line"><span style="color:#98C379;">  }&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-测试密码模式" tabindex="-1"><a class="header-anchor" href="#_10-2-测试密码模式"><span>10.2 测试密码模式</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -X</span><span style="color:#98C379;"> POST</span><span style="color:#98C379;"> https://localhost:5001/connect/token</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -d</span><span style="color:#98C379;"> &quot;grant_type=password&amp;username=admin&amp;password=Admin@123456&amp;scope=openid profile email api&amp;client_id=react-app&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-测试客户端凭证模式" tabindex="-1"><a class="header-anchor" href="#_10-3-测试客户端凭证模式"><span>10.3 测试客户端凭证模式</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -X</span><span style="color:#98C379;"> POST</span><span style="color:#98C379;"> https://localhost:5001/connect/token</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  -d</span><span style="color:#98C379;"> &quot;grant_type=client_credentials&amp;client_id=backend-service&amp;client_secret=backend-secret-123&amp;scope=api&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="完整-api-接口清单" tabindex="-1"><a class="header-anchor" href="#完整-api-接口清单"><span>完整 API 接口清单</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>OAuth2/OIDC 标准端点:</span></span>
<span class="line"><span>  GET/POST  /connect/authorize        # 授权端点</span></span>
<span class="line"><span>  POST      /connect/token            # 令牌端点</span></span>
<span class="line"><span>  GET/POST  /connect/userinfo         # 用户信息端点</span></span>
<span class="line"><span>  GET/POST  /connect/logout           # 登出端点</span></span>
<span class="line"><span>  POST      /connect/introspect       # Token 内省</span></span>
<span class="line"><span>  POST      /connect/revoke           # Token 撤销</span></span>
<span class="line"><span>  GET       /.well-known/openid-configuration  # 发现端点(自动)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>账户管理:</span></span>
<span class="line"><span>  POST      /api/account/login           # 登录</span></span>
<span class="line"><span>  POST      /api/account/logout          # 登出</span></span>
<span class="line"><span>  GET       /api/account/current         # 当前用户</span></span>
<span class="line"><span>  POST      /api/account/change-password # 修改密码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>管理后台 (需要 admin 角色):</span></span>
<span class="line"><span>  GET       /api/manage/clients          # 客户端列表</span></span>
<span class="line"><span>  GET       /api/manage/clients/{id}     # 客户端详情</span></span>
<span class="line"><span>  POST      /api/manage/clients          # 创建客户端</span></span>
<span class="line"><span>  PUT       /api/manage/clients/{id}     # 更新客户端</span></span>
<span class="line"><span>  DELETE    /api/manage/clients/{id}     # 删除客户端</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  GET       /api/manage/users            # 用户列表(分页)</span></span>
<span class="line"><span>  GET       /api/manage/users/{id}       # 用户详情</span></span>
<span class="line"><span>  POST      /api/manage/users            # 创建用户</span></span>
<span class="line"><span>  PUT       /api/manage/users/{id}       # 更新用户</span></span>
<span class="line"><span>  POST      /api/manage/users/{id}/reset-password  # 重置密码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  GET       /api/manage/scopes           # Scope 列表</span></span>
<span class="line"><span>  POST      /api/manage/scopes           # 创建 Scope</span></span>
<span class="line"><span>  DELETE    /api/manage/scopes/{name}    # 删除 Scope</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="后续扩展方向" tabindex="-1"><a class="header-anchor" href="#后续扩展方向"><span>后续扩展方向</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>可扩展架构 - 只需要在对应层添加代码:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>├── 多租户      → Domain 加 TenantId 过滤, 中间件提取租户</span></span>
<span class="line"><span>├── 外部登录    → Infrastructure 加 Google/GitHub 等 Provider  </span></span>
<span class="line"><span>├── 双因素认证  → AccountController 加 2FA 流程</span></span>
<span class="line"><span>├── 审计日志    → 领域事件 + EF SaveChanges 拦截</span></span>
<span class="line"><span>├── Rate Limit  → ASP.NET Core 内置 RateLimiter</span></span>
<span class="line"><span>├── 权限细粒度  → 扩展 Permission Claim, 管理API加权限管理</span></span>
<span class="line"><span>├── 集群部署    → Redis 做分布式缓存/Session, 证书统一配置</span></span>
<span class="line"><span>└── 监控告警    → HealthCheck + OpenTelemetry</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个架构的核心优势是：<strong>OpenIddict 处理所有 OAuth2/OIDC 协议细节，只需要关注业务逻辑</strong>。所有管理功能通过 API 暴露，React 前端直接调用即可。需要我继续展开某个部分（比如资源服务器如何接入、React 端的对接方式）吗？</p>`,15)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};