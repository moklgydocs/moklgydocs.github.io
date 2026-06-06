import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-B7SOiXO-.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/03_HTTP%E6%A0%B8%E5%BF%83%E4%B8%8E%E8%99%9A%E6%8B%9F%E4%B8%BB%E6%9C%BA/04_%E5%AD%90%E5%9F%9F%E5%90%8D%E8%A7%A3%E6%9E%90%E5%88%B0%E5%AF%B9%E5%BA%94%E6%9C%8D%E5%8A%A1.html","title":"子域名解析到对应服务","lang":"zh-CN","frontmatter":{"title":"子域名解析到对应服务","icon":"fa6-solid:network-wired","order":4,"category":["Linux","Nginx"],"tag":["子域名","泛域名","动态路由","server_name","map"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":15.98,"words":4795},"filePathRelative":"Linux/07_Nginx/03_HTTP核心与虚拟主机/04_子域名解析到对应服务.md"}`),s={name:`04_子域名解析到对应服务.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="子域名解析到对应服务" tabindex="-1"><a class="header-anchor" href="#子域名解析到对应服务"><span>子域名解析到对应服务</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>在现代 Web 架构中，子域名路由是一种常见的微服务入口模式。通过将不同的子域名映射到不同的后端服务，可以实现清晰的服务边界和独立的部署策略。例如：</p><ul><li><code>api.example.com</code> → API 网关服务</li><li><code>www.example.com</code> → 前端 Web 应用</li><li><code>admin.example.com</code> → 管理后台</li><li><code>cdn.example.com</code> → 静态资源 CDN</li><li><code>docs.example.com</code> → 文档站点</li></ul><p>Nginx 提供了多种机制来实现子域名到服务的映射，从简单的 <code>server_name</code> 通配符到基于 <code>map</code> 的动态路由，再到 Lua 模块的编程级路由。</p><div class="hint-container important"><p class="hint-container-title">子域名路由的优势</p><p>相比路径路由（如 <code>/api/</code>、<code>/admin/</code>），子域名路由具有以下优势：</p><ol><li><strong>独立部署</strong>：每个服务可以独立部署、扩缩容</li><li><strong>Cookie 隔离</strong>：子域名的 Cookie 互不干扰</li><li><strong>CORS 简化</strong>：跨域策略更清晰</li><li><strong>SSL 证书灵活</strong>：可以使用独立证书或泛域名证书</li></ol></div><h2 id="需求场景" tabindex="-1"><a class="header-anchor" href="#需求场景"><span>需求场景</span></a></h2><h3 id="典型的多服务架构" tabindex="-1"><a class="header-anchor" href="#典型的多服务架构"><span>典型的多服务架构</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>api.example.com      → API 网关 (Go/Java/Node.js)</span></span>
<span class="line"><span>www.example.com      → 前端 SPA (React/Vue)</span></span>
<span class="line"><span>admin.example.com    → 管理后台 (Angular/Vue)</span></span>
<span class="line"><span>docs.example.com     → 文档站点 (VuePress/Docusaurus)</span></span>
<span class="line"><span>cdn.example.com      → 静态资源 CDN</span></span>
<span class="line"><span>mail.example.com     → 邮件 Web 客户端</span></span>
<span class="line"><span>grafana.example.com  → 监控面板</span></span>
<span class="line"><span>jenkins.example.com  → CI/CD 平台</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="子域名路由的挑战" tabindex="-1"><a class="header-anchor" href="#子域名路由的挑战"><span>子域名路由的挑战</span></a></h3><ol><li><strong>DNS 配置</strong>：每个子域名都需要正确的 DNS 解析</li><li><strong>证书管理</strong>：HTTPS 需要为每个子域名配置证书</li><li><strong>动态扩展</strong>：新增子域名时需要更新 Nginx 配置并重载</li><li><strong>统一管理</strong>：多个子域名共享部分配置（如安全头、日志格式）</li></ol><h2 id="dns-解析与-nginx-配合" tabindex="-1"><a class="header-anchor" href="#dns-解析与-nginx-配合"><span>DNS 解析与 Nginx 配合</span></a></h2><h3 id="dns-解析流程" tabindex="-1"><a class="header-anchor" href="#dns-解析流程"><span>DNS 解析流程</span></a></h3>`,13),i(d,{code:`eJxlj1FLwlAUgN/9FQd79rY5BzZCUCcohEj5NkTWOLcGmxvbqAl7CoSIhIIgohKqh4IgiR6kh+jX3Gn/onXXYOB9vN/5zsehlnNsHOpeADu7BUheXWNvj/HpYvk6H0CpVItEAqvnp3h2obsmwVC3XQuJ4dgRNDS1uxffTdnZA7t5GXC9wZ1y4nxfsdtZp6dAWZCIQERRIqIQQT2t8DGJQLvf763mi/j9ZHvf26y1HT9QYK3U1IrdA3MU8pn8vmJabfJ1FQLs/PNnMvXRO0JvONJtjEDVknWQfrH761RQuSATcD0nHA9d3fcjaGnFeq+z/Lpkkw9eEoUklKSUqlD9S3HVD8YWJgdQ07KUDRSpTDEHGv+AUiqhkAPNzKhSGbdyQM0MCWUq50ArAwZW0Cj8AlBKjfk=`}),o[1]||=n(`<h3 id="dns-配置方式" tabindex="-1"><a class="header-anchor" href="#dns-配置方式"><span>DNS 配置方式</span></a></h3><h4 id="方式-1-a-记录-每个子域名单独配置" tabindex="-1"><a class="header-anchor" href="#方式-1-a-记录-每个子域名单独配置"><span>方式 1：A 记录（每个子域名单独配置）</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>; Zone file for example.com</span></span>
<span class="line"><span>www     IN  A       203.0.113.10</span></span>
<span class="line"><span>api     IN  A       203.0.113.10</span></span>
<span class="line"><span>admin   IN  A       203.0.113.10</span></span>
<span class="line"><span>docs    IN  A       203.0.113.10</span></span>
<span class="line"><span>cdn     IN  A       203.0.113.10</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方式-2-cname-记录-推荐-便于-ip-变更" tabindex="-1"><a class="header-anchor" href="#方式-2-cname-记录-推荐-便于-ip-变更"><span>方式 2：CNAME 记录（推荐，便于 IP 变更）</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>; Zone file for example.com</span></span>
<span class="line"><span>@       IN  A       203.0.113.10</span></span>
<span class="line"><span>www     IN  CNAME   example.com.</span></span>
<span class="line"><span>api     IN  CNAME   example.com.</span></span>
<span class="line"><span>admin   IN  CNAME   example.com.</span></span>
<span class="line"><span>docs    IN  CNAME   example.com.</span></span>
<span class="line"><span>cdn     IN  CNAME   cdn-provider.example.net.</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方式-3-泛域名-a-记录-推荐-减少-dns-配置" tabindex="-1"><a class="header-anchor" href="#方式-3-泛域名-a-记录-推荐-减少-dns-配置"><span>方式 3：泛域名 A 记录（推荐，减少 DNS 配置）</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>; Zone file for example.com</span></span>
<span class="line"><span>@       IN  A       203.0.113.10</span></span>
<span class="line"><span>*       IN  A       203.0.113.10    ; 所有子域名解析到同一IP</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">泛域名 DNS 记录</p><p>泛域名 A 记录 <code>*</code> 会将所有未明确配置的子域名解析到指定 IP。这意味着：</p><ol><li>无需为每个新子域名单独配置 DNS</li><li>新增子域名只需修改 Nginx 配置</li><li>但要注意 DNS 缓存可能导致新增子域名解析延迟</li></ol></div><h3 id="dns-与-nginx-的完整流程" tabindex="-1"><a class="header-anchor" href="#dns-与-nginx-的完整流程"><span>DNS 与 Nginx 的完整流程</span></a></h3>`,9),i(d,{code:`eJwrTi0sTc1LTnXJTEwvSszlUgCCgsSikszkzILEvBIFZ4XEYoWn6xY969j+fPV6DGkXkLSLXzCGhB9Iwi89M68CQyoUJPVkR9ezHTuezel92rWQC6zEWdfOzsVK4cXyxc/mTVBILMjUS61IzC3ISdVLzoe4ywWowtlKwcjAWM9Az9DQWM/QAK7Tz0rB3TVEQb+0OLWoWMEjJCRA31DP0CapSN/OI7+4xAqrgX75JakK+WWpRQpA7U97dr5s7VUA6gcKxOcl5qZi1wO0LJQcy0IhrjQyMFDw91bwCvb3g5sH9hRCGADp+4JJ`}),o[2]||=n(`<h2 id="server-name-通配符" tabindex="-1"><a class="header-anchor" href="#server-name-通配符"><span>server_name 通配符</span></a></h2><h3 id="前缀通配符-example-com" tabindex="-1"><a class="header-anchor" href="#前缀通配符-example-com"><span>前缀通配符：*.example.com</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配所有 example.com 的直接子域名</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # www.example.com ✓</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # api.example.com ✓</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # admin.example.com ✓</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # example.com ✗（通配符不匹配空标签）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # sub.api.example.com ✗（通配符只匹配一级）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="后缀通配符-www" tabindex="-1"><a class="header-anchor" href="#后缀通配符-www"><span>后缀通配符：www.*</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">www.*;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配以 www. 开头的所有域名</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # www.example.com ✓</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # www.another.org ✓</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # www.sub.example.com ✓</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="通配符的限制" tabindex="-1"><a class="header-anchor" href="#通配符的限制"><span>通配符的限制</span></a></h3><ol><li><code>*.example.com</code> 不匹配 <code>example.com</code> 本身</li><li><code>*.example.com</code> 不匹配 <code>sub.api.example.com</code>（多级子域名）</li><li>通配符只能在域名的最左侧或最右侧</li><li><code>www.*.example.com</code> 是无效语法</li></ol><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 无效语法</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">www.*.example.com;    </span><span style="color:#7F848E;font-style:italic;"># 错误：通配符不能在中间</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">*.*.example.com;      </span><span style="color:#7F848E;font-style:italic;"># 错误：不能有多个通配符</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 有效语法</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">*.example.com;        </span><span style="color:#7F848E;font-style:italic;"># 前缀通配符</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">www.*;                </span><span style="color:#7F848E;font-style:italic;"># 后缀通配符</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">通配符匹配的局限性</p><p>如果需要匹配多级子域名（如 <code>sub.api.example.com</code>），或者需要更灵活的匹配规则，应该使用正则表达式 <code>server_name</code>。</p></div><h2 id="正则-server-name-匹配子域名" tabindex="-1"><a class="header-anchor" href="#正则-server-name-匹配子域名"><span>正则 server_name 匹配子域名</span></a></h2><h3 id="基本正则匹配" tabindex="-1"><a class="header-anchor" href="#基本正则匹配"><span>基本正则匹配</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 匹配 example.com 的所有子域名（含多级）</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(?&lt;subdomain&gt;.+)\\.example\\.com$</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # www.example.com ✓ → subdomain=www</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # api.example.com ✓ → subdomain=api</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # sub.api.example.com ✓ → subdomain=sub.api</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # example.com ✗（正则要求有点号）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="命名捕获与动态路由" tabindex="-1"><a class="header-anchor" href="#命名捕获与动态路由"><span>命名捕获与动态路由</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用命名捕获组获取子域名</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(?&lt;sub&gt;.+)\\.example\\.com$</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 根据子域名动态路由</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">sub_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Subdomain $</span><span style="color:#E06C75;">sub</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="特定子域名的正则匹配" tabindex="-1"><a class="header-anchor" href="#特定子域名的正则匹配"><span>特定子域名的正则匹配</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 仅匹配 API 版本子域名：v1.api.example.com, v2.api.example.com</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(?&lt;version&gt;v[0-9]+)\\.api\\.example\\.com$</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-API-Version $</span><span style="color:#E06C75;">version</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 匹配租户子域名：tenant1.example.com, tenant2.example.com</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(?&lt;tenant&gt;[a-z0-9-]+)\\.example\\.com$</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://app_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Tenant-ID $</span><span style="color:#E06C75;">tenant</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 匹配环境子域名：dev.example.com, staging.example.com, prod.example.com</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(?&lt;env&gt;dev|staging|prod)\\.example\\.com$</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://app_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Environment $</span><span style="color:#E06C75;">env</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="正则匹配的注意事项" tabindex="-1"><a class="header-anchor" href="#正则匹配的注意事项"><span>正则匹配的注意事项</span></a></h3><ol><li>正则匹配的优先级低于精确匹配和通配符匹配</li><li>多个正则 <code>server_name</code> 按配置顺序匹配，第一个匹配的生效</li><li>正则匹配区分大小写（<code>~</code>），使用 <code>~*</code> 不区分大小写</li><li>命名捕获组名称必须合法（字母开头，只含字母数字下划线）</li></ol><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 区分大小写的正则</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^api\\.example\\.com$</span><span style="color:#ABB2BF;">;        </span><span style="color:#7F848E;font-style:italic;"># 只匹配小写 api</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">~*</span><span style="color:#E06C75;">^api\\.example\\.com$</span><span style="color:#ABB2BF;">;       </span><span style="color:#7F848E;font-style:italic;"># 匹配 API, api, Api 等</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 命名捕获组</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(?&lt;name&gt;[a-z0-9-]+)\\.example\\.com$</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 合法</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(?&lt;1name&gt;[a-z]+)\\.example\\.com$</span><span style="color:#ABB2BF;">;     </span><span style="color:#7F848E;font-style:italic;"># 非法：数字开头</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(?&lt;my-name&gt;[a-z]+)\\.example\\.com$</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 非法：含连字符</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="map-指令实现子域名到后端的动态映射" tabindex="-1"><a class="header-anchor" href="#map-指令实现子域名到后端的动态映射"><span>map 指令实现子域名到后端的动态映射</span></a></h2><p><code>map</code> 指令是 Nginx 中实现动态路由的最强大工具之一。它可以根据变量的值（如 <code>$host</code>）映射到不同的后端地址，比配置大量 <code>server</code> 块更简洁高效。</p><h3 id="map-基本语法" tabindex="-1"><a class="header-anchor" href="#map-基本语法"><span>map 基本语法</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">variable</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">new_variable</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    pattern1  value1;</span></span>
<span class="line"><span style="color:#ABB2BF;">    pattern2  value2;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">   default_value;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="子域名路由映射图" tabindex="-1"><a class="header-anchor" href="#子域名路由映射图"><span>子域名路由映射图</span></a></h3>`,24),i(d,{code:`eJx1kM9KAkEAh+8+xUC3QNtyDZUQ8r+euw0Su7MzJO26ohtbZFCR1CHTkxVYdqhbklFYIdjLOIO+Retq2+xCc/x93zcDQ1TdRDtSxQBbSR+wziacvHyw11N60Z+MRgXg98dAHLJmizbbWb1q0Mf3gi3GbZQ41KQyYDcPtH92ZO+J2V6TysUA3pe0sooDSNdqIAmtaVuW0C4uKdGwEBbm18x10zTdegqaWHb0oCC4dEnRiiV3kIb26CQRT6LoqOouMnC2OYHoCZDieSELWeeZdvrTu1t2fMLa5+PhgA+WeX1DrqzEaH0wHrZpr0W7Xdpq1EAOKphIe6rx70eMPxv08mtat+Q8FEUR0Prb9Lo3+b5nV08Fn21WjQMVgyQgRVWNLqEwXkcRDqQWQJatx2QOpBeAEBLEAgcyvyCIQyTEgewC4FUSIpgDub+rIkjkQN4BSFHWfD8LeNa8`}),o[3]||=n(`<h3 id="完整配置示例" tabindex="-1"><a class="header-anchor" href="#完整配置示例"><span>完整配置示例</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 定义上游服务</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> api_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.1:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.2:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive </span><span style="color:#D19A66;">32</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> web_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.3:3000;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive </span><span style="color:#D19A66;">16</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> admin_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.4:9000;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive </span><span style="color:#D19A66;">8</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> docs_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.5:4000;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive </span><span style="color:#D19A66;">8</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># map：子域名到上游服务映射</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">host</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">upstream_name</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    api.example.com      api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    www.example.com      web_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    admin.example.com    admin_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    docs.example.com     docs_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    cdn.example.com      cdn_local;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">              default_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># map：子域名到根目录映射（静态站点）</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">host</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">document_root</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    www.example.com    /var/www/web;</span></span>
<span class="line"><span style="color:#ABB2BF;">    docs.example.com   /var/www/docs;</span></span>
<span class="line"><span style="color:#ABB2BF;">    cdn.example.com    /var/www/cdn;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">            /var/www/default;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># map：是否需要认证</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">host</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">require_auth</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    admin.example.com    </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">              0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通用上游服务</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> default_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 127.0.0.1:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTP → HTTPS 重定向</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com example.com;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 301</span><span style="color:#ABB2BF;"> https://$</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTPS 主服务</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SSL 证书（泛域名证书）</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 通用安全头</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Strict-Transport-Security </span><span style="color:#98C379;">&quot;max-age=31536000; includeSubDomains&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # API 服务</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">upstream_name</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;cdn_local&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">            root </span><span style="color:#ABB2BF;">/var/www/cdn;</span></span>
<span class="line"><span style="color:#C678DD;">            break</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">upstream_name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 状态页面</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /nginx_status {</span></span>
<span class="line"><span style="color:#C678DD;">        stub_status</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#D19A66;">127.0.0.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/example_access.log;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="更精细的-map-路由配置" tabindex="-1"><a class="header-anchor" href="#更精细的-map-路由配置"><span>更精细的 map 路由配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用正则匹配的 map</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">host</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">backend_port</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^api\\.              8080;   # api.* → 8080</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^www\\.              3000;   # www.* → 3000</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^admin\\.            9000;   # admin.* → 9000</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^docs\\.             4000;   # docs.* → 4000</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^(?&lt;sub&gt;[a-z0-9-]+)\\.   8080;   # 其他子域名 → 8080</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">              80</span><span style="color:#ABB2BF;">;     </span><span style="color:#7F848E;font-style:italic;"># 无子域名 → 80</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基于子域名的环境区分</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">host</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">environment</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^dev\\.              development;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^staging\\.          staging;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^prod\\.             production;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">              production;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基于子域名的限流策略</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">host</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">rate_limit_zone</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    api.example.com      api_limit;</span></span>
<span class="line"><span style="color:#ABB2BF;">    www.example.com      web_limit;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">              default_limit;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 限流区域定义</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=api_limit:10m rate=100r/s;</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=web_limit:10m rate=50r/s;</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=default_limit:10m rate=20r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 应用限流</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 注意：limit_req 的 zone 参数不支持变量，不能写成 zone=$rate_limit_zone</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 以下是错误的写法：limit_req zone=$rate_limit_zone burst=20 nodelay;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 替代方案：使用多个 limit_req 指令或按子域名分别配置 server 块</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 方案一：在同一个 location 中叠加所有限流区域</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=api_limit burst=20 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=web_limit burst=20 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=default_limit burst=20 nodelay;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 方案二：按子域名配置独立的 server 块，每个 server 使用各自的 limit_req</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://127.0.0.1:$</span><span style="color:#E06C75;">backend_port</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Environment $</span><span style="color:#E06C75;">environment</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="map-的高级用法" tabindex="-1"><a class="header-anchor" href="#map-的高级用法"><span>map 的高级用法</span></a></h3><h4 id="多条件-map" tabindex="-1"><a class="header-anchor" href="#多条件-map"><span>多条件 map</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基于主机名和 URI 的复合映射</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">host</span><span style="color:#98C379;">:$</span><span style="color:#E06C75;">uri</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">special_handler</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;api.example.com:/health&quot;   health_check;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;admin.example.com:/login&quot;  sso_redirect;</span></span>
<span class="line"><span style="color:#C678DD;">    default</span><span style="color:#ABB2BF;">                     normal;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="map-与变量组合" tabindex="-1"><a class="header-anchor" href="#map-与变量组合"><span>map 与变量组合</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 从主机名提取子域名</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">host</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">subdomain</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~</span><span style="color:#E06C75;">^(?&lt;sub&gt;[a-z0-9-]+)\\.example\\.com$</span><span style="color:#ABB2BF;">  $</span><span style="color:#E06C75;">sub</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">                               www;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 子域名到上游服务端口</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">subdomain</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">service_port</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    api      </span><span style="color:#D19A66;">8080</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    admin    </span><span style="color:#D19A66;">9000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    docs     </span><span style="color:#D19A66;">4000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    www      </span><span style="color:#D19A66;">3000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">  8080</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://127.0.0.1:$</span><span style="color:#E06C75;">service_port</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Subdomain $</span><span style="color:#E06C75;">subdomain</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="泛域名证书与配置" tabindex="-1"><a class="header-anchor" href="#泛域名证书与配置"><span>泛域名证书与配置</span></a></h2><h3 id="泛域名-ssl-证书" tabindex="-1"><a class="header-anchor" href="#泛域名-ssl-证书"><span>泛域名 SSL 证书</span></a></h3><p>泛域名证书（Wildcard Certificate）可以保护一个域名及其所有一级子域名：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>*.example.com 证书覆盖：</span></span>
<span class="line"><span>✓ www.example.com</span></span>
<span class="line"><span>✓ api.example.com</span></span>
<span class="line"><span>✓ admin.example.com</span></span>
<span class="line"><span>✓ docs.example.com</span></span>
<span class="line"><span>✗ sub.api.example.com  （不覆盖二级子域名）</span></span>
<span class="line"><span>✗ example.com          （不覆盖裸域名，除非证书同时包含）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="let-s-encrypt-泛域名证书申请" tabindex="-1"><a class="header-anchor" href="#let-s-encrypt-泛域名证书申请"><span>Let&#39;s Encrypt 泛域名证书申请</span></a></h3><p>使用 certbot 通过 DNS 验证申请泛域名证书：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 certbot</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> certbot</span><span style="color:#98C379;"> python3-certbot-nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 DNS 验证申请泛域名证书</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> certbot</span><span style="color:#98C379;"> certonly</span><span style="color:#D19A66;"> --manual</span><span style="color:#D19A66;"> --preferred-challenges</span><span style="color:#98C379;"> dns</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -d</span><span style="color:#98C379;"> &quot;*.example.com&quot;</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> &quot;example.com&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --agree-tos</span><span style="color:#D19A66;"> --email</span><span style="color:#98C379;"> admin@example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># certbot 会要求添加 DNS TXT 记录进行验证</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># _acme-challenge.example.com TXT &quot;验证码&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证完成后，证书保存在</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/letsencrypt/live/example.com/fullchain.pem</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/letsencrypt/live/example.com/privkey.pem</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="自动续期配置" tabindex="-1"><a class="header-anchor" href="#自动续期配置"><span>自动续期配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 添加 cron 任务自动续期</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;0 0 1 * * certbot renew --quiet --deploy-hook &#39;systemctl reload nginx&#39;&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> /etc/cron.d/certbot</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nginx-泛域名证书配置" tabindex="-1"><a class="header-anchor" href="#nginx-泛域名证书配置"><span>Nginx 泛域名证书配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># HTTP → HTTPS 重定向</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Let&#39;s Encrypt 验证</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/.well-known/acme-challenge/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/certbot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 301</span><span style="color:#ABB2BF;"> https://$</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTPS 服务</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 泛域名证书</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/letsencrypt/live/example.com/fullchain.pem;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/letsencrypt/live/example.com/privkey.pem;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SSL 优化</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_protocols </span><span style="color:#ABB2BF;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_ciphers </span><span style="color:#ABB2BF;">ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_prefer_server_ciphers </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_session_cache </span><span style="color:#ABB2BF;">shared:SSL:10m;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_session_timeout </span><span style="color:#D19A66;">1d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_session_tickets </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # HSTS</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Strict-Transport-Security </span><span style="color:#98C379;">&quot;max-age=31536000; includeSubDomains; preload&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ... 其他配置</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">泛域名证书的局限性</p><ol><li>泛域名证书 <code>*.example.com</code> 不保护裸域名 <code>example.com</code>，需要单独添加</li><li>泛域名证书不支持二级子域名（如 <code>sub.api.example.com</code>）</li><li>Let&#39;s Encrypt 泛域名证书需要 DNS 验证，不支持 HTTP 验证</li><li>自动续期需要 DNS API 支持或手动操作</li></ol></div><h2 id="子域名路由完整实战" tabindex="-1"><a class="header-anchor" href="#子域名路由完整实战"><span>子域名路由完整实战</span></a></h2><h3 id="场景描述" tabindex="-1"><a class="header-anchor" href="#场景描述"><span>场景描述</span></a></h3><p>使用 Docker Compose 部署多个服务，通过 Nginx 实现子域名路由。</p><h3 id="docker-compose-配置" tabindex="-1"><a class="header-anchor" href="#docker-compose-配置"><span>Docker Compose 配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.yml</span></span>
<span class="line"><span style="color:#E06C75;">version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;3.8&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  nginx</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx:1.25</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;80:80&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;443:443&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/nginx.conf:/etc/nginx/nginx.conf:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/conf.d:/etc/nginx/conf.d:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/ssl:/etc/nginx/ssl:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/snippets:/etc/nginx/snippets:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">web-static:/var/www/web:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">docs-static:/var/www/docs:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">cdn-static:/var/www/cdn:ro</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">api-service</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">admin-service</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-network</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  api-service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    build</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./api</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">PORT=8080</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">NODE_ENV=production</span></span>
<span class="line"><span style="color:#E06C75;">    expose</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;8080&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-network</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  admin-service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    build</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./admin</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">PORT=9000</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">NODE_ENV=production</span></span>
<span class="line"><span style="color:#E06C75;">    expose</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;9000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-network</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  web-service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    build</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./web</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">PORT=3000</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">web-static:/app/dist</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-network</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  docs-service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    build</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./docs</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">docs-static:/app/dist</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-network</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app-network</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bridge</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  web-static</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  docs-static</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  cdn-static</span><span style="color:#ABB2BF;">:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nginx-主配置" tabindex="-1"><a class="header-anchor" href="#nginx-主配置"><span>Nginx 主配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;">nginx;</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">pid </span><span style="color:#ABB2BF;">/var/run/nginx.pid;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">2048</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">      mime.types;</span></span>
<span class="line"><span style="color:#C678DD;">    default_type </span><span style="color:#ABB2BF;"> application/octet-stream;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#D19A66;">main</span><span style="color:#98C379;"> &#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;host=$</span><span style="color:#E06C75;">host</span><span style="color:#98C379;"> upstream=$</span><span style="color:#E06C75;">upstream_addr</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;rt=$</span><span style="color:#E06C75;">request_time</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_requests </span><span style="color:#D19A66;">5000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_vary </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_min_length </span><span style="color:#D19A66;">1024</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_types </span><span style="color:#ABB2BF;">text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 包含站点配置</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/conf.d/*.conf;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nginx-站点配置" tabindex="-1"><a class="header-anchor" href="#nginx-站点配置"><span>Nginx 站点配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/conf.d/app.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 上游服务定义</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> api_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> api-service:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive </span><span style="color:#D19A66;">32</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> admin_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> admin-service:9000;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive </span><span style="color:#D19A66;">16</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 限流区域</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=api_limit:10m rate=100r/s;</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=web_limit:10m rate=50r/s;</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=admin_limit:10m rate=20r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认服务器 - 拒绝不匹配的请求</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#D19A66;"> default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl </span><span style="color:#D19A66;">default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/default.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/default.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 444</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTP → HTTPS 重定向</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Let&#39;s Encrypt 验证</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/.well-known/acme-challenge/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/certbot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 301</span><span style="color:#ABB2BF;"> https://$</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># api.example.com - API 网关</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">snippets/ssl-params.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=api_limit burst=50 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # CORS 配置</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Access-Control-Allow-Origin </span><span style="color:#98C379;">&quot;https://www.example.com&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Access-Control-Allow-Methods </span><span style="color:#98C379;">&quot;GET, POST, PUT, DELETE, OPTIONS&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Access-Control-Allow-Headers </span><span style="color:#98C379;">&quot;Authorization, Content-Type, X-API-Key&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Access-Control-Max-Age </span><span style="color:#D19A66;">3600</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # OPTIONS 预检请求</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">request_method</span><span style="color:#ABB2BF;"> = OPTIONS) {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 204</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/api_access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># www.example.com - 前端 Web 应用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">www.example.com example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">snippets/ssl-params.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=web_limit burst=20 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/web;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 精确匹配</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/favicon.ico </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        log_not_found </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 204</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/robots.txt </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        log_not_found </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        alias </span><span style="color:#ABB2BF;">/var/www/seo/robots.txt;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 静态资源</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/assets/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, immutable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SPA 兜底</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ /index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/www_access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># admin.example.com - 管理后台</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">admin.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">snippets/ssl-params.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=admin_limit burst=10 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # IP 白名单</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#ABB2BF;">192.168.1.0/24;</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">    deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Basic 认证</span></span>
<span class="line"><span style="color:#C678DD;">    auth_basic </span><span style="color:#98C379;">&quot;Admin Area&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    auth_basic_user_file </span><span style="color:#ABB2BF;">/etc/nginx/.htpasswd;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://admin_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/admin_access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># docs.example.com - 文档站点</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">docs.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">snippets/ssl-params.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/docs;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ /index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 禁用访问日志（静态站点）</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># cdn.example.com - 静态资源 CDN</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">cdn.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">snippets/ssl-params.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/cdn;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # CORS</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Access-Control-Allow-Origin </span><span style="color:#98C379;">&quot;https://www.example.com&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 图片</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /images/ {</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">365d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, immutable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # CSS/JS</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /assets/ {</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 字体</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /fonts/ {</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">365d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, immutable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 开启 gzip</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_types </span><span style="color:#ABB2BF;">text/css application/javascript application/json image/svg+xml;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ssl-参数片段" tabindex="-1"><a class="header-anchor" href="#ssl-参数片段"><span>SSL 参数片段</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/snippets/ssl-params.conf</span></span>
<span class="line"><span style="color:#C678DD;">ssl_protocols </span><span style="color:#ABB2BF;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_ciphers </span><span style="color:#ABB2BF;">ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_prefer_server_ciphers </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_session_cache </span><span style="color:#ABB2BF;">shared:SSL:10m;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_session_timeout </span><span style="color:#D19A66;">1d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_session_tickets </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">ssl_stapling </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_stapling_verify </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">resolver </span><span style="color:#D19A66;">8.8.8.8</span><span style="color:#D19A66;"> 8.8.4.4</span><span style="color:#ABB2BF;"> valid=300s;</span></span>
<span class="line"><span style="color:#C678DD;">resolver_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">Strict-Transport-Security </span><span style="color:#98C379;">&quot;max-age=31536000; includeSubDomains; preload&quot;</span><span style="color:#ABB2BF;"> always;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="子域名与路径路由混合方案" tabindex="-1"><a class="header-anchor" href="#子域名与路径路由混合方案"><span>子域名与路径路由混合方案</span></a></h2><p>在某些场景下，需要同时使用子域名路由和路径路由：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>api.example.com          → API 网关</span></span>
<span class="line"><span>api.example.com/v1/      → API v1</span></span>
<span class="line"><span>api.example.com/v2/      → API v2</span></span>
<span class="line"><span>www.example.com          → 前端应用</span></span>
<span class="line"><span>www.example.com/blog/    → 博客服务</span></span>
<span class="line"><span>www.example.com/docs/    → 文档服务</span></span>
<span class="line"><span>admin.example.com        → 管理后台</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="混合路由配置" tabindex="-1"><a class="header-anchor" href="#混合路由配置"><span>混合路由配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># API 网关 - 子域名 + 路径路由</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # CORS 配置</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Access-Control-Allow-Origin </span><span style="color:#98C379;">&quot;https://www.example.com&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Access-Control-Allow-Methods </span><span style="color:#98C379;">&quot;GET, POST, PUT, DELETE, OPTIONS&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Access-Control-Allow-Headers </span><span style="color:#98C379;">&quot;Authorization, Content-Type&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # API v1</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /v1/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://v1_backend/;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # API v2</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /v2/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://v2_backend/;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 默认 API（最新版）</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://v2_backend/;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Web 应用 - 子域名 + 路径路由</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/web;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 博客服务</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /blog/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://blog_backend/;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 文档服务</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /docs/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://docs_backend/;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SPA 兜底</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ /index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="动态子域名方案-lua-redis-动态路由" tabindex="-1"><a class="header-anchor" href="#动态子域名方案-lua-redis-动态路由"><span>动态子域名方案：Lua/Redis 动态路由</span></a></h2><p>对于需要运行时动态添加子域名路由的场景（如 SaaS 多租户平台），可以使用 Lua 模块或 Redis 实现动态路由。</p><h3 id="方案-1-基于-lua-的动态路由" tabindex="-1"><a class="header-anchor" href="#方案-1-基于-lua-的动态路由"><span>方案 1：基于 Lua 的动态路由</span></a></h3><h4 id="安装-openresty" tabindex="-1"><a class="header-anchor" href="#安装-openresty"><span>安装 OpenResty</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Ubuntu/Debian</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> openresty</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或使用 Docker</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> run</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --name</span><span style="color:#98C379;"> openresty</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -p</span><span style="color:#98C379;"> 80:80</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> 443:443</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -v</span><span style="color:#98C379;"> ./nginx.conf:/usr/local/openresty/nginx/conf/nginx.conf:ro</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    openresty/openresty</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="lua-动态路由配置" tabindex="-1"><a class="header-anchor" href="#lua-动态路由配置"><span>Lua 动态路由配置</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 定义共享字典（缓存路由信息）</span></span>
<span class="line"><span style="color:#C678DD;">lua_shared_dict</span><span style="color:#ABB2BF;"> route_cache </span><span style="color:#D19A66;">10m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 初始化：从数据库加载路由</span></span>
<span class="line"><span style="color:#C678DD;">init_worker_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> route_cache</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.route_cache</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    -- 模拟从数据库加载路由配置</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> routes</span><span style="color:#ABB2BF;"> = {</span></span>
<span class="line"><span style="color:#ABB2BF;">        [</span><span style="color:#98C379;">&quot;api&quot;</span><span style="color:#ABB2BF;">] = { </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;api_backend&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">port</span><span style="color:#ABB2BF;"> = </span><span style="color:#D19A66;">8080</span><span style="color:#ABB2BF;"> },</span></span>
<span class="line"><span style="color:#ABB2BF;">        [&quot;www&quot;] = { </span><span style="color:#C678DD;">host</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;web_backend&quot;</span><span style="color:#ABB2BF;">, port = </span><span style="color:#D19A66;">3000</span><span style="color:#ABB2BF;"> },</span></span>
<span class="line"><span style="color:#ABB2BF;">        [&quot;admin&quot;] = { </span><span style="color:#C678DD;">host</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;admin_backend&quot;</span><span style="color:#ABB2BF;">, port = </span><span style="color:#D19A66;">9000</span><span style="color:#ABB2BF;"> },</span></span>
<span class="line"><span style="color:#ABB2BF;">        [&quot;docs&quot;] = { </span><span style="color:#C678DD;">host</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;docs_backend&quot;</span><span style="color:#ABB2BF;">, port = </span><span style="color:#D19A66;">4000</span><span style="color:#ABB2BF;"> },</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    for</span><span style="color:#ABB2BF;"> subdomain, backend in pairs(routes) do</span></span>
<span class="line"><span style="color:#ABB2BF;">        route_cache:set(subdomain, backend.</span><span style="color:#C678DD;">host</span><span style="color:#ABB2BF;"> .. </span><span style="color:#98C379;">&quot;:&quot;</span><span style="color:#ABB2BF;"> .. backend.port)</span></span>
<span class="line"><span style="color:#C678DD;">    end</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Lua 动态路由</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        access_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> route_cache</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.route_cache</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> host</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.var.host</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> subdomain</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">host</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">match</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;^([a-z0-9-]+)%.example%.com$&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#E06C75;"> subdomain</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#C678DD;">                local</span><span style="color:#E06C75;"> backend</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">route_cache</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">subdomain</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">                if</span><span style="color:#E06C75;"> backend</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">                    ngx</span><span style="color:#ABB2BF;">.var.backend = </span><span style="color:#E06C75;">backend</span></span>
<span class="line"><span style="color:#C678DD;">                else</span></span>
<span class="line"><span style="color:#E06C75;">                    ngx</span><span style="color:#ABB2BF;">.var.backend = </span><span style="color:#98C379;">&quot;default_backend:8080&quot;</span></span>
<span class="line"><span style="color:#C678DD;">                end</span></span>
<span class="line"><span style="color:#C678DD;">            else</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.var.backend = </span><span style="color:#98C379;">&quot;default_backend:8080&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="lua-redis-动态路由" tabindex="-1"><a class="header-anchor" href="#lua-redis-动态路由"><span>Lua + Redis 动态路由</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">lua_shared_dict</span><span style="color:#ABB2BF;"> route_cache </span><span style="color:#D19A66;">10m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Redis 连接配置</span></span>
<span class="line"><span style="color:#C678DD;">lua_package_path</span><span style="color:#98C379;"> &quot;/usr/local/openresty/lualib/?.lua;;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">init_worker_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> redis</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">require</span><span style="color:#98C379;"> &quot;resty.redis&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> route_cache</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.route_cache</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    -- 从 Redis 加载路由</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> red</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">redis</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">new</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#E5C07B;">    red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">set_timeouts</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> ok</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">err</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">connect</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;redis-service&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">6379</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> not</span><span style="color:#E06C75;"> ok</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">        ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">log</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.ERR, </span><span style="color:#98C379;">&quot;failed to connect to redis: &quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">err</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        return</span></span>
<span class="line"><span style="color:#C678DD;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    -- 加载所有路由</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> routes</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">err</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">hgetall</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;nginx:routes&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#E06C75;"> routes</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#C678DD;">        for</span><span style="color:#E06C75;"> i</span><span style="color:#ABB2BF;"> = </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">, #</span><span style="color:#E06C75;">routes</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">2</span><span style="color:#C678DD;"> do</span></span>
<span class="line"><span style="color:#E5C07B;">            route_cache</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">set</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">routes</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">i</span><span style="color:#ABB2BF;">], </span><span style="color:#E06C75;">routes</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">i</span><span style="color:#ABB2BF;">+</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">])</span></span>
<span class="line"><span style="color:#C678DD;">        end</span></span>
<span class="line"><span style="color:#C678DD;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">    red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">close</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">backend</span><span style="color:#98C379;"> &quot;default_backend:8080&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        access_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> route_cache</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.route_cache</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> host</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.var.host</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> subdomain</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">host</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">match</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;^([a-z0-9-]+)%.example%.com$&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#E06C75;"> subdomain</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#C678DD;">                local</span><span style="color:#E06C75;"> backend</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">route_cache</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">subdomain</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">                if</span><span style="color:#E06C75;"> backend</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">                    ngx</span><span style="color:#ABB2BF;">.var.backend = </span><span style="color:#E06C75;">backend</span></span>
<span class="line"><span style="color:#C678DD;">                else</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                    -- 尝试从 Redis 获取</span></span>
<span class="line"><span style="color:#C678DD;">                    local</span><span style="color:#E06C75;"> redis</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">require</span><span style="color:#98C379;"> &quot;resty.redis&quot;</span></span>
<span class="line"><span style="color:#C678DD;">                    local</span><span style="color:#E06C75;"> red</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">redis</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">new</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#E5C07B;">                    red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">set_timeouts</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">100</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">100</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">100</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">                    local</span><span style="color:#E06C75;"> ok</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">err</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">connect</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;redis-service&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">6379</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">                    if</span><span style="color:#E06C75;"> ok</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#C678DD;">                        local</span><span style="color:#E06C75;"> res</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">err</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">hget</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;nginx:routes&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">subdomain</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">                        if</span><span style="color:#E06C75;"> res</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E5C07B;">                            route_cache</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">set</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">subdomain</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">res</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">300</span><span style="color:#ABB2BF;">)  </span><span style="color:#7F848E;font-style:italic;">-- 缓存5分钟</span></span>
<span class="line"><span style="color:#E06C75;">                            ngx</span><span style="color:#ABB2BF;">.var.backend = </span><span style="color:#E06C75;">res</span></span>
<span class="line"><span style="color:#C678DD;">                        end</span></span>
<span class="line"><span style="color:#E5C07B;">                        red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">close</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#C678DD;">                    end</span></span>
<span class="line"><span style="color:#C678DD;">                end</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="方案-2-基于-map-变量的轻量级动态路由" tabindex="-1"><a class="header-anchor" href="#方案-2-基于-map-变量的轻量级动态路由"><span>方案 2：基于 map + 变量的轻量级动态路由</span></a></h3><p>如果不需要运行时动态更新，使用 <code>map</code> 指令是最简洁的方案：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># map：子域名到上游服务</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">host</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~</span><span style="color:#E06C75;">^(?&lt;sub&gt;[a-z0-9-]+)\\.example\\.com$</span><span style="color:#ABB2BF;">  $</span><span style="color:#E06C75;">sub</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    example.com                           www;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">                               default</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># map：上游服务名到实际地址</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">backend</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">backend_addr</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    api       10.0.0.1:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">    www       10.0.0.2:3000;</span></span>
<span class="line"><span style="color:#ABB2BF;">    admin     10.0.0.3:9000;</span></span>
<span class="line"><span style="color:#ABB2BF;">    docs      10.0.0.4:4000;</span></span>
<span class="line"><span style="color:#ABB2BF;">    grafana   10.0.0.5:3000;</span></span>
<span class="line"><span style="color:#ABB2BF;">    jenkins   10.0.0.6:8080;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">   127.0.0.1:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># map：是否需要认证</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">backend</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">auth_required</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    admin     </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    grafana   </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    jenkins   </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">   0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># map：是否需要 IP 限制</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">backend</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">ip_restricted</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    admin     </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    jenkins   </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">   0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 基于 map 的认证</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        auth_request </span><span style="color:#ABB2BF;">/auth_check;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">backend_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Subdomain $</span><span style="color:#E06C75;">backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 认证检查</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/auth_check </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        internal</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://127.0.0.1:8888/auth?required=$</span><span style="color:#E06C75;">auth_required</span><span style="color:#ABB2BF;">&amp;ip_check=$</span><span style="color:#E06C75;">ip_restricted</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass_request_body </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Content-Length </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Original-URI $</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Original-Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="方案-3-基于-resolver-的-dns-动态路由" tabindex="-1"><a class="header-anchor" href="#方案-3-基于-resolver-的-dns-动态路由"><span>方案 3：基于 resolver 的 DNS 动态路由</span></a></h3><p>利用 Nginx 的 <code>resolver</code> 指令实现基于 DNS SRV 记录的动态路由：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # DNS 解析器</span></span>
<span class="line"><span style="color:#C678DD;">    resolver </span><span style="color:#D19A66;">10.0.0.1</span><span style="color:#ABB2BF;"> valid=30s;</span></span>
<span class="line"><span style="color:#C678DD;">    resolver_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">backend</span><span style="color:#98C379;"> &quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 从 host 头提取子域名</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#98C379;">&quot;^([a-z0-9-]+)\\.example\\.com$&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">            set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">subdomain</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 动态解析后端服务</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 假设内部 DNS 有 service-name.service.consul 的 SRV 记录</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">subdomain</span><span style="color:#ABB2BF;">.service.consul:8080;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">resolver 与变量 proxy_pass</p><p>当 <code>proxy_pass</code> 使用变量时，Nginx 不会在启动时解析域名，而是在每次请求时使用 <code>resolver</code> 指定的 DNS 服务器动态解析。这意味着：</p><ol><li>必须配置 <code>resolver</code> 指令</li><li>DNS 解析有性能开销（可通过 <code>valid</code> 参数缓存）</li><li>DNS 不可用时，请求将失败</li></ol></div><h2 id="子域名路由方案对比" tabindex="-1"><a class="header-anchor" href="#子域名路由方案对比"><span>子域名路由方案对比</span></a></h2><table><thead><tr><th>方案</th><th>动态性</th><th>性能</th><th>复杂度</th><th>适用场景</th></tr></thead><tbody><tr><td>多 server 块</td><td>静态（需重载）</td><td>最好</td><td>低</td><td>固定子域名</td></tr><tr><td>server_name 通配符</td><td>静态</td><td>好</td><td>低</td><td>子域名规则简单</td></tr><tr><td>正则 server_name</td><td>静态</td><td>中</td><td>中</td><td>子域名规则较复杂</td></tr><tr><td>map 指令</td><td>静态</td><td>好</td><td>中</td><td>子域名→后端映射</td></tr><tr><td>Lua + Redis</td><td>动态</td><td>中</td><td>高</td><td>SaaS 多租户</td></tr><tr><td>resolver DNS</td><td>动态</td><td>中</td><td>中</td><td>服务发现场景</td></tr></tbody></table><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2><p>子域名路由是 Nginx 虚拟主机配置的重要应用场景。根据不同的需求，可以选择不同的实现方案：</p><ol><li><strong>固定子域名</strong>：使用多个 <code>server</code> 块，每个子域名一个 <code>server</code> 块</li><li><strong>简单通配</strong>：使用 <code>server_name *.example.com</code> 匹配所有子域名</li><li><strong>复杂匹配</strong>：使用正则 <code>server_name</code> 实现灵活的子域名匹配</li><li><strong>映射路由</strong>：使用 <code>map</code> 指令实现子域名到后端的动态映射</li><li><strong>运行时动态</strong>：使用 Lua/Redis 实现运行时动态路由更新</li></ol><div class="hint-container tip"><p class="hint-container-title">进一步阅读</p><ul><li><a href="https://nginx.org/en/docs/http/ngx_http_core_module.html#server_name" target="_blank" rel="noopener noreferrer">ngx_http_core_module - server_name</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_map_module.html" target="_blank" rel="noopener noreferrer">ngx_http_map_module</a></li><li><a href="https://openresty.org/en/lua_module_api.html" target="_blank" rel="noopener noreferrer">OpenResty Lua API</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver" target="_blank" rel="noopener noreferrer">ngx_http_core_module - resolver</a></li></ul></div>`,59)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};