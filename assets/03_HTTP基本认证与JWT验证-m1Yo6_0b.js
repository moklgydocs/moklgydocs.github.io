import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-CyjyvRPH.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/06_%E9%99%90%E6%B5%81%E4%B8%8E%E8%AE%BF%E9%97%AE%E6%8E%A7%E5%88%B6/03_HTTP%E5%9F%BA%E6%9C%AC%E8%AE%A4%E8%AF%81%E4%B8%8EJWT%E9%AA%8C%E8%AF%81.html","title":"HTTP 基本认证与 JWT 验证","lang":"zh-CN","frontmatter":{"title":"HTTP 基本认证与 JWT 验证","icon":"fa6-solid:key","order":3,"category":["Linux","Nginx"],"tag":["认证","JWT","auth_basic","auth_request","OAuth2"]},"git":{"createdTime":1780631738000,"updatedTime":1780632863000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":12.2,"words":3661},"filePathRelative":"Linux/07_Nginx/06_限流与访问控制/03_HTTP基本认证与JWT验证.md"}`),s={name:`03_HTTP基本认证与JWT验证.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="http-基本认证与-jwt-验证" tabindex="-1"><a class="header-anchor" href="#http-基本认证与-jwt-验证"><span>HTTP 基本认证与 JWT 验证</span></a></h1><h2 id="认证与授权概述" tabindex="-1"><a class="header-anchor" href="#认证与授权概述"><span>认证与授权概述</span></a></h2><p>在 Web 应用中，认证（Authentication）验证用户身份，授权（Authorization）决定用户可以访问哪些资源。Nginx 可以在网关层实现多种认证机制，将认证逻辑前置，减少后端压力。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>认证方式对比：</span></span>
<span class="line"><span>┌──────────────┬────────────┬────────────┬──────────────┐</span></span>
<span class="line"><span>│ 认证方式      │ 复杂度     │ 安全性     │ 适用场景      │</span></span>
<span class="line"><span>├──────────────┼────────────┼────────────┼──────────────┤</span></span>
<span class="line"><span>│ HTTP Basic   │ 低         │ 低         │ 简单保护      │</span></span>
<span class="line"><span>│ auth_request │ 中         │ 高         │ 统一认证网关  │</span></span>
<span class="line"><span>│ JWT          │ 中         │ 中高       │ API 认证      │</span></span>
<span class="line"><span>│ OAuth2 代理   │ 高         │ 高         │ SSO/第三方登录│</span></span>
<span class="line"><span>└──────────────┴────────────┴────────────┴──────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="http-basic-认证" tabindex="-1"><a class="header-anchor" href="#http-basic-认证"><span>HTTP Basic 认证</span></a></h2><h3 id="http-basic-认证原理" tabindex="-1"><a class="header-anchor" href="#http-basic-认证原理"><span>HTTP Basic 认证原理</span></a></h3><p>HTTP Basic 认证是最简单的认证方式，客户端在请求头中发送 Base64 编码的用户名和密码：</p>`,8),i(d,{code:`eJx9kU9LAkEYxu9+ipdORYQW0WEpIS06BBtEYR2n3UknbHebHSu6FWQRWYZSlyANhahwESTT/nwaZ92+RbO7aqXQHud5f+/vmR0T76SwpuA5guIUbQdAfAaijCjEQBqDKCATeOXePq23n6yBWHZjOU60/YEo4pHZC4HZtxl+Vgx4I9GxcFiWYGF+BYIG1RlWGFaDMGzfFJxKybEOeak24k3KYjIqwWRoHFY1lGIJnZIDrE5v0GA4FouNzYojrAkfYliCCDKJAhSj5PbM0DI2GSXu5iHfKgsR6LuYgtjI3xv8pNnOP4hL8WwmyK10u3DofOb4cdkupv/r6cldsdsFMaJrXbO6JieVLWNvfU0++FFSEk8w0DddrZjDU5PDKRNTyUCmOeIt+83BDPTSTm+/xdfjufgzvcZ+YQ9vvV5AgrnAngr29Unr7cW28txq+DxKsg5sn2b52Z132F0ckcD5eOaXV45Vt6tHvSziS3kuw5v5P4S4xUQoBEuLMAo8fcwrDS/GSRN3NLxUdWrlfqj/DX1KUwPfOwX0mw==`}),o[1]||=n(`<h3 id="创建-htpasswd-文件" tabindex="-1"><a class="header-anchor" href="#创建-htpasswd-文件"><span>创建 htpasswd 文件</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 htpasswd 命令创建密码文件</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 apache2-utils（提供 htpasswd 命令）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Ubuntu/Debian</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> apache2-utils</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CentOS/RHEL</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> yum</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> httpd-tools</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建新文件并添加用户（-c 创建新文件）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> htpasswd</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> /etc/nginx/.htpasswd</span><span style="color:#98C379;"> admin</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输入密码：******</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加更多用户（不加 -c，否则会覆盖文件）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> htpasswd</span><span style="color:#98C379;"> /etc/nginx/.htpasswd</span><span style="color:#98C379;"> user1</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> htpasswd</span><span style="color:#98C379;"> /etc/nginx/.htpasswd</span><span style="color:#98C379;"> user2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 MD5 加密（默认）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> htpasswd</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> /etc/nginx/.htpasswd</span><span style="color:#98C379;"> user3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 bcrypt 加密（推荐，更安全）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> htpasswd</span><span style="color:#D19A66;"> -B</span><span style="color:#98C379;"> /etc/nginx/.htpasswd</span><span style="color:#98C379;"> user4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 SHA 加密</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> htpasswd</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> /etc/nginx/.htpasswd</span><span style="color:#98C379;"> user5</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看密码文件</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /etc/nginx/.htpasswd</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># admin:$apr1$xxxxx$xxxxx</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># user1:$apr1$xxxxx$xxxxx</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># user4:$2y$05$xxxxx（bcrypt）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">密码加密方式选择</p><ul><li><strong>bcrypt</strong>（推荐）：计算成本可调，抗暴力破解</li><li><strong>apr1</strong>（MD5-based）：Nginx 默认，兼容性好</li><li><strong>SHA</strong>：不推荐，安全性较低</li><li><strong>crypt</strong>：不推荐，仅支持 8 位密码</li></ul></div><h3 id="auth-basic-配置" tabindex="-1"><a class="header-anchor" href="#auth-basic-配置"><span>auth_basic 配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 语法</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># auth_basic string | off;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># auth_basic_user_file file;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 全局认证</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 启用认证</span></span>
<span class="line"><span style="color:#C678DD;">    auth_basic </span><span style="color:#98C379;">&quot;Restricted Area&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 指定密码文件</span></span>
<span class="line"><span style="color:#C678DD;">    auth_basic_user_file </span><span style="color:#ABB2BF;">/etc/nginx/.htpasswd;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/html;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="按路径差异化认证" tabindex="-1"><a class="header-anchor" href="#按路径差异化认证"><span>按路径差异化认证</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 全局认证</span></span>
<span class="line"><span style="color:#C678DD;">    auth_basic </span><span style="color:#98C379;">&quot;Restricted Area&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    auth_basic_user_file </span><span style="color:#ABB2BF;">/etc/nginx/.htpasswd;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 公开路径（关闭认证）</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /public/ {</span></span>
<span class="line"><span style="color:#C678DD;">        auth_basic </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/html;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 管理后台（使用不同的密码文件）</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /admin/ {</span></span>
<span class="line"><span style="color:#C678DD;">        auth_basic </span><span style="color:#98C379;">&quot;Admin Area&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        auth_basic_user_file </span><span style="color:#ABB2BF;">/etc/nginx/.htpasswd_admin;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://admin_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # API（关闭 Basic 认证，使用 JWT）</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        auth_basic </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/html;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="认证变量与日志" tabindex="-1"><a class="header-anchor" href="#认证变量与日志"><span>认证变量与日志</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 认证成功后，$remote_user 变量包含用户名</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">log_format </span><span style="color:#ABB2BF;">auth_log </span><span style="color:#98C379;">&#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    auth_basic </span><span style="color:#98C379;">&quot;Restricted&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    auth_basic_user_file </span><span style="color:#ABB2BF;">/etc/nginx/.htpasswd;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/auth_access.log auth_log;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/html;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">HTTP Basic 的安全局限</p><ul><li>密码以 Base64 编码传输（非加密），必须配合 HTTPS 使用</li><li>无法实现会话管理（每次请求都发送密码）</li><li>无法实现注销（浏览器缓存凭据）</li><li>不适合复杂的认证需求</li><li>Base64 可以被轻易解码，仅相当于明文传输</li></ul></div><hr><h2 id="auth-request-子请求认证" tabindex="-1"><a class="header-anchor" href="#auth-request-子请求认证"><span>auth_request 子请求认证</span></a></h2><h3 id="auth-request-原理" tabindex="-1"><a class="header-anchor" href="#auth-request-原理"><span>auth_request 原理</span></a></h3><p><code>auth_request</code> 模块通过发送子请求到认证服务来实现认证，将认证逻辑与业务逻辑完全解耦：</p>`,14),i(d,{code:`eJx9UU1LAkEYvvsr3qMRsuvHSULYtYgItktCt5jcUYds12bHsG51MkvZS7dACqtDpAmCEf6d2fbmX2hmVyPbpTkN7/PxPs+Mg0+b2CrjTYKqFJ0kQJwGooyUSQNZDIqAHODDR689/XodRWBDwkaVWK0IpEnIHw780aV33+WdhwhDD7zdnjBeMAJKMVUoGHnY3toHBTWIYiKGNo6oUtCarGZTcoEYsa086BhRTIHZx9gKlYZQakulICtnmJLKeSCez9r8zfVHU298NZ/deu4n/3jmvT5/uQmHfDCZz65DH5thoKRaY2BXQGSRZodUPpXDVqzDvajOlk3bLu/0IZlptdYCSB4tLJRRVdjbDcIcpEoOpqkdMw9NcUlnsj9k2UGPa/+PRv+9ANbBu3v3usMVy2I8jOsOXkTng7E/eYJkTk0rOTUbiS/mULJkd/kH2PxrH4tjy0x8A9hA13g=`}),o[2]||=n(`<h3 id="auth-request-配置" tabindex="-1"><a class="header-anchor" href="#auth-request-配置"><span>auth_request 配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_auth_request_module.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 认证子请求</span></span>
<span class="line"><span style="color:#C678DD;">    auth_request </span><span style="color:#ABB2BF;">/auth/verify;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 将认证服务返回的头传递给后端</span></span>
<span class="line"><span style="color:#C678DD;">    auth_request_set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">user_id</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">upstream_http_x_user_id</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    auth_request_set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">user_role</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">upstream_http_x_user_role</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 认证服务地址</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/auth/verify </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        internal</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 仅接受内部子请求</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://auth-service:8080/verify;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass_request_body </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 不转发请求体</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Content-Length </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Original-URI $</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Original-Method $</span><span style="color:#E06C75;">request_method</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Authorization $</span><span style="color:#E06C75;">http_authorization</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 业务接口</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-User-Id $</span><span style="color:#E06C75;">user_id</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-User-Role $</span><span style="color:#E06C75;">user_role</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="auth-request-set-详解" tabindex="-1"><a class="header-anchor" href="#auth-request-set-详解"><span>auth_request_set 详解</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># auth_request_set 将子请求响应头映射到变量</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 语法：auth_request_set $variable value;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    auth_request </span><span style="color:#ABB2BF;">/auth/verify;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 从认证服务响应头提取用户信息</span></span>
<span class="line"><span style="color:#C678DD;">    auth_request_set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">user_id</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">upstream_http_x_user_id</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    auth_request_set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">user_role</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">upstream_http_x_user_role</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    auth_request_set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">user_email</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">upstream_http_x_user_email</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/auth/verify </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        internal</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://auth-service:8080/verify;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass_request_body </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Content-Length </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 将用户信息传递给后端</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-User-Id $</span><span style="color:#E06C75;">user_id</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-User-Role $</span><span style="color:#E06C75;">user_role</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-User-Email $</span><span style="color:#E06C75;">user_email</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="认证服务实现示例" tabindex="-1"><a class="header-anchor" href="#认证服务实现示例"><span>认证服务实现示例</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="shiki" data-ext="python" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-python"><span class="line"><span style="color:#7F848E;font-style:italic;"># Flask 认证服务示例</span></span>
<span class="line"><span style="color:#C678DD;">from</span><span style="color:#ABB2BF;"> flask </span><span style="color:#C678DD;">import</span><span style="color:#ABB2BF;"> Flask, request, jsonify</span></span>
<span class="line"><span style="color:#C678DD;">import</span><span style="color:#ABB2BF;"> jwt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">app </span><span style="color:#56B6C2;">=</span><span style="color:#61AFEF;"> Flask</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">__name__</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#D19A66;">SECRET_KEY</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;your-secret-key&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">@app</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">route</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;/verify&#39;</span><span style="color:#ABB2BF;">,</span><span style="color:#E06C75;font-style:italic;"> methods</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">[</span><span style="color:#98C379;">&#39;GET&#39;</span><span style="color:#ABB2BF;">])</span></span>
<span class="line"><span style="color:#C678DD;">def</span><span style="color:#61AFEF;"> verify</span><span style="color:#ABB2BF;">():</span></span>
<span class="line"><span style="color:#ABB2BF;">    auth_header </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> request.headers.</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Authorization&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#C678DD;"> not</span><span style="color:#ABB2BF;"> auth_header.</span><span style="color:#61AFEF;">startswith</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Bearer &#39;</span><span style="color:#ABB2BF;">):</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#98C379;"> &#39;&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">401</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    token </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> auth_header[</span><span style="color:#D19A66;">7</span><span style="color:#ABB2BF;">:]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    try</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        payload </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> jwt.</span><span style="color:#61AFEF;">decode</span><span style="color:#ABB2BF;">(token, </span><span style="color:#D19A66;">SECRET_KEY</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;font-style:italic;">algorithms</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">[</span><span style="color:#98C379;">&#39;HS256&#39;</span><span style="color:#ABB2BF;">])</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 认证成功，返回用户信息头</span></span>
<span class="line"><span style="color:#ABB2BF;">        response </span><span style="color:#56B6C2;">=</span><span style="color:#61AFEF;"> jsonify</span><span style="color:#ABB2BF;">({})</span></span>
<span class="line"><span style="color:#ABB2BF;">        response.headers[</span><span style="color:#98C379;">&#39;X-User-Id&#39;</span><span style="color:#ABB2BF;">] </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> payload.</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;user_id&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        response.headers[</span><span style="color:#98C379;">&#39;X-User-Role&#39;</span><span style="color:#ABB2BF;">] </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> payload.</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;role&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        response.headers[</span><span style="color:#98C379;">&#39;X-User-Email&#39;</span><span style="color:#ABB2BF;">] </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> payload.</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;email&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;"> response, </span><span style="color:#D19A66;">200</span></span>
<span class="line"><span style="color:#C678DD;">    except</span><span style="color:#ABB2BF;"> jwt.ExpiredSignatureError:</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#98C379;"> &#39;&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">401</span></span>
<span class="line"><span style="color:#C678DD;">    except</span><span style="color:#ABB2BF;"> jwt.InvalidTokenError:</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#98C379;"> &#39;&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">401</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#E06C75;"> __name__</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &#39;__main__&#39;</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    app.</span><span style="color:#61AFEF;">run</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;font-style:italic;">host</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&#39;0.0.0.0&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;font-style:italic;">port</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">8080</span><span style="color:#ABB2BF;">)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="认证错误页面" tabindex="-1"><a class="header-anchor" href="#认证错误页面"><span>认证错误页面</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    auth_request </span><span style="color:#ABB2BF;">/auth/verify;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 自定义 401 错误页面</span></span>
<span class="line"><span style="color:#C678DD;">    error_page </span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;"> = @login;</span></span>
<span class="line"><span style="color:#C678DD;">    error_page </span><span style="color:#D19A66;">403</span><span style="color:#ABB2BF;"> = @forbidden;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/auth/verify </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        internal</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://auth-service:8080/verify;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass_request_body </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Content-Length </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> @login {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 302</span><span style="color:#ABB2BF;"> https://auth.example.com/login?redirect=$</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">://$</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> @forbidden {</span></span>
<span class="line"><span style="color:#C678DD;">        default_type </span><span style="color:#ABB2BF;">application/json;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 403</span><span style="color:#98C379;"> &#39;{&quot;error&quot;: &quot;Forbidden&quot;, &quot;message&quot;: &quot;You do not have permission to access this resource.&quot;}&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="jwt-验证" tabindex="-1"><a class="header-anchor" href="#jwt-验证"><span>JWT 验证</span></a></h2><h3 id="jwt-原理" tabindex="-1"><a class="header-anchor" href="#jwt-原理"><span>JWT 原理</span></a></h3><p>JWT（JSON Web Token）是一种开放标准（RFC 7519），用于在各方之间安全地传输信息：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>JWT 结构：header.payload.signature</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Header:  {&quot;alg&quot;: &quot;HS256&quot;, &quot;typ&quot;: &quot;JWT&quot;}</span></span>
<span class="line"><span>Payload: {&quot;sub&quot;: &quot;user123&quot;, &quot;name&quot;: &quot;John&quot;, &quot;role&quot;: &quot;admin&quot;, &quot;exp&quot;: 1700000000}</span></span>
<span class="line"><span>Signature: HMACSHA256(base64UrlEncode(header) + &quot;.&quot; + base64UrlEncode(payload), secret)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例 Token:</span></span>
<span class="line"><span>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6IkpvaG4iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDAwMDAwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nginx-lua-jwt-验证" tabindex="-1"><a class="header-anchor" href="#nginx-lua-jwt-验证"><span>Nginx Lua JWT 验证</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_lua_module.html</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 需要安装 lua-resty-jwt 库</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        access_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> jwt</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">require</span><span style="color:#98C379;"> &quot;resty.jwt&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> cjson</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">require</span><span style="color:#98C379;"> &quot;cjson&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 获取 Authorization 头</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> auth_header</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.var.http_authorization</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#56B6C2;"> not</span><span style="color:#E06C75;"> auth_header</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.status = </span><span style="color:#D19A66;">401</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.header[</span><span style="color:#98C379;">&quot;WWW-Authenticate&quot;</span><span style="color:#ABB2BF;">] = </span><span style="color:#98C379;">&#39;Bearer realm=&quot;API&quot;&#39;</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;{&quot;error&quot;: &quot;Missing authorization header&quot;}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 提取 Token</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> _</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">_</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">string.find</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">auth_header</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;Bearer%s+(.+)&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#56B6C2;"> not</span><span style="color:#E06C75;"> token</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.status = </span><span style="color:#D19A66;">401</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;{&quot;error&quot;: &quot;Invalid authorization header format&quot;}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 验证 JWT</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> jwt_obj</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">jwt</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">verify</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;your-secret-key&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#56B6C2;"> not</span><span style="color:#E06C75;"> jwt_obj</span><span style="color:#ABB2BF;">.verified </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.status = </span><span style="color:#D19A66;">401</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;{&quot;error&quot;: &quot;Invalid token: &#39; </span><span style="color:#ABB2BF;">.. (</span><span style="color:#E06C75;">jwt_obj</span><span style="color:#ABB2BF;">.reason </span><span style="color:#56B6C2;">or</span><span style="color:#98C379;"> &quot;unknown&quot;</span><span style="color:#ABB2BF;">) .. </span><span style="color:#98C379;">&#39;&quot;}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 检查过期时间</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> exp</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">jwt_obj</span><span style="color:#ABB2BF;">.payload </span><span style="color:#56B6C2;">and</span><span style="color:#E06C75;"> jwt_obj</span><span style="color:#ABB2BF;">.payload.exp</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#E06C75;"> exp</span><span style="color:#56B6C2;"> and</span><span style="color:#E06C75;"> exp</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">time</span><span style="color:#ABB2BF;">() </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.status = </span><span style="color:#D19A66;">401</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;{&quot;error&quot;: &quot;Token expired&quot;}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 将用户信息传递给后端</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.req.</span><span style="color:#61AFEF;">set_header</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;X-User-Id&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">jwt_obj</span><span style="color:#ABB2BF;">.payload.sub </span><span style="color:#56B6C2;">or</span><span style="color:#98C379;"> &quot;&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.req.</span><span style="color:#61AFEF;">set_header</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;X-User-Role&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">jwt_obj</span><span style="color:#ABB2BF;">.payload.role </span><span style="color:#56B6C2;">or</span><span style="color:#98C379;"> &quot;&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="jwt-验证-nginx-jwt-module" tabindex="-1"><a class="header-anchor" href="#jwt-验证-nginx-jwt-module"><span>JWT 验证（nginx-jwt-module）</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用第三方 nginx-jwt-module</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># https://github.com/TeslaGov/nginx-jwt-module</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：以下配置为概念示意。nginx-jwt-module 实际主指令为 auth_jwt，</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 支持 on/off 控制启用与关闭，以及 auth_jwt_key / auth_jwt_key_file</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置 HMAC 密钥或 RSA 公钥。其他指令如 auth_jwt_claim 为示意用法，</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 实际 claim 传递需通过 $jwt_claim_* 变量在 proxy_set_header 中完成。</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # JWT 验证配置</span></span>
<span class="line"><span style="color:#C678DD;">    auth_jwt_key</span><span style="color:#98C379;"> &quot;your-secret-key&quot;</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># HMAC 密钥</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # auth_jwt_key_file /etc/nginx/jwt-key.pem;  # RSA 公钥文件</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        auth_jwt </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 将 JWT claim 传递给后端</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-User-Id $</span><span style="color:#E06C75;">jwt_claim_sub</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-User-Role $</span><span style="color:#E06C75;">jwt_claim_role</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 登录接口不需要 JWT</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/auth/login {</span></span>
<span class="line"><span style="color:#C678DD;">        auth_jwt </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://auth_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="rsa-公钥验证-jwt" tabindex="-1"><a class="header-anchor" href="#rsa-公钥验证-jwt"><span>RSA 公钥验证 JWT</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 RSA 非对称签名时，Nginx 只需要公钥验证</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        access_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> jwt</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">require</span><span style="color:#98C379;"> &quot;resty.jwt&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> auth_header</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.var.http_authorization</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#56B6C2;"> not</span><span style="color:#E06C75;"> auth_header</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> _</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">_</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">string.find</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">auth_header</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;Bearer%s+(.+)&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 使用 RSA 公钥验证</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> public_key</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">io.open</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;/etc/nginx/keys/public.pem&quot;</span><span style="color:#ABB2BF;">):</span><span style="color:#61AFEF;">read</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;*a&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> jwt_obj</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">jwt</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">verify</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">public_key</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;">, {</span></span>
<span class="line"><span style="color:#E06C75;">                claim_specs</span><span style="color:#ABB2BF;"> = {</span></span>
<span class="line"><span style="color:#E06C75;">                    exp</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">jwt</span><span style="color:#ABB2BF;">.claims.exp.required</span></span>
<span class="line"><span style="color:#ABB2BF;">                }</span></span>
<span class="line"><span style="color:#ABB2BF;">            })</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> not jwt_obj.verified then</span></span>
<span class="line"><span style="color:#ABB2BF;">                ngx.</span><span style="color:#C678DD;">status</span><span style="color:#ABB2BF;"> = 401</span></span>
<span class="line"><span style="color:#ABB2BF;">                ngx.say(&#39;{&quot;error&quot;: &quot;</span><span style="color:#C678DD;">Invalid</span><span style="color:#ABB2BF;"> token</span><span style="color:#98C379;">&quot;}&#39;)</span></span>
<span class="line"><span style="color:#98C379;">                ngx.exit(401)</span></span>
<span class="line"><span style="color:#98C379;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">            ngx.req.set_header(&quot;</span><span style="color:#ABB2BF;">X-User-Id</span><span style="color:#98C379;">&quot;, jwt_obj.payload.sub)</span></span>
<span class="line"><span style="color:#98C379;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">        proxy_pass http://api_backend;</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="基于-cookie-的路由" tabindex="-1"><a class="header-anchor" href="#基于-cookie-的路由"><span>基于 Cookie 的路由</span></a></h2><h3 id="cookie-路由原理" tabindex="-1"><a class="header-anchor" href="#cookie-路由原理"><span>Cookie 路由原理</span></a></h3><p>通过检查 Cookie 值来决定请求路由，常用于 A/B 测试、灰度发布、已登录/未登录用户分流：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 map 基于 Cookie 值选择后端</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">cookie_version</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">backend_name</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">  main_backend;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;v2&quot;</span><span style="color:#ABB2BF;">     v2_backend;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;beta&quot;</span><span style="color:#ABB2BF;">   beta_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> main_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.1:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> v2_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.2:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> beta_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.3:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">backend_name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="基于-cookie-的认证路由" tabindex="-1"><a class="header-anchor" href="#基于-cookie-的认证路由"><span>基于 Cookie 的认证路由</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 已登录/未登录用户路由到不同服务</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">cookie_session</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">auth_status</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#98C379;">  &quot;unauthenticated&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;&quot;</span><span style="color:#98C379;">       &quot;unauthenticated&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~.+&quot;</span><span style="color:#98C379;">    &quot;authenticated&quot;</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 非空 Cookie = 已登录</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 认证用户</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">auth_status</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;unauthenticated&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 401</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Auth-Status $</span><span style="color:#E06C75;">auth_status</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 登录页面</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /login {</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">auth_status</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;authenticated&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 302</span><span style="color:#ABB2BF;"> /dashboard;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://auth_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置认证-cookie" tabindex="-1"><a class="header-anchor" href="#设置认证-cookie"><span>设置认证 Cookie</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 登录成功后设置 Cookie</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /auth/login {</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://auth_backend;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 认证成功后设置 Cookie</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Set-Cookie </span><span style="color:#98C379;">&quot;session=$</span><span style="color:#E06C75;">cookie_value</span><span style="color:#98C379;">; Path=/; HttpOnly; Secure; SameSite=Strict&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="oauth2-代理-oauth2-proxy-集成" tabindex="-1"><a class="header-anchor" href="#oauth2-代理-oauth2-proxy-集成"><span>OAuth2 代理：oauth2-proxy 集成</span></a></h2><h3 id="oauth2-proxy-简介" tabindex="-1"><a class="header-anchor" href="#oauth2-proxy-简介"><span>oauth2-proxy 简介</span></a></h3><p>oauth2-proxy 是一个反向代理，为没有原生 OAuth2 支持的应用提供认证：</p>`,32),i(d,{code:`eJxtkF1LwmAcxe/9FP9LI0SxOwlBKwwCtwv9AHMNG9a2thl2aZKMaL6UXUgvZElJhTOoTMX6LuGzrW/Rs5dMXLs853d2zvOXmN08w9HMKktlRWrHB/gTKFFmaVagOBnSQElgNDq60tdfq+a9gpodD5S0oGSW5Qoei7AsnsrLW+GAIPKFfQ9BWgQRswggRX6P3WTE5YwYjPoTrLyezwQTPJ/dZhY8wbgVRLWK8ajpFyo6avlsJB2IRpMRSKylIEgJQtAWk1gkIoCqKqrVJ6Nbo1ZGSs87jMBcOgJLoTB8lU/mZ4HRHKHx2V8PGXElNHjTK4p+WbIt0m07vzJ7JVgExzKui9MOHJwM27p6Ayk+x3CzqRhNM5Lk6Djr3H7y2dKL2uxEs/thjLuwwvM5lsHc72Tnzf9eAvzo/c5NOOd0z/L9cGxqRdeZlsRxyfgJVeum1tefD+a2oPaLTcbdt56qaNiYZnHtjGLV4MnhUAiIDfwfVD5E3YHvB7te8PM=`}),o[3]||=n(`<h3 id="oauth2-proxy-安装" tabindex="-1"><a class="header-anchor" href="#oauth2-proxy-安装"><span>oauth2-proxy 安装</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 下载 oauth2-proxy</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># https://github.com/oauth2-proxy/oauth2-proxy/releases</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">wget</span><span style="color:#98C379;"> https://github.com/oauth2-proxy/oauth2-proxy/releases/download/v7.5.1/oauth2-proxy-v7.5.1.linux-amd64.tar.gz</span></span>
<span class="line"><span style="color:#61AFEF;">tar</span><span style="color:#98C379;"> xzf</span><span style="color:#98C379;"> oauth2-proxy-v7.5.1.linux-amd64.tar.gz</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> mv</span><span style="color:#98C379;"> oauth2-proxy</span><span style="color:#98C379;"> /usr/local/bin/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或使用 Docker</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> pull</span><span style="color:#98C379;"> quay.io/oauth2-proxy/oauth2-proxy:v7.5.1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="oauth2-proxy-配置" tabindex="-1"><a class="header-anchor" href="#oauth2-proxy-配置"><span>oauth2-proxy 配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/oauth2-proxy/config</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Provider 配置（以 GitHub 为例）</span></span>
<span class="line"><span style="color:#E06C75;">--provider</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">github</span></span>
<span class="line"><span style="color:#E06C75;">--client-id</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">your-github-client-id</span></span>
<span class="line"><span style="color:#E06C75;">--client-secret</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">your-github-client-secret</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 回调 URL</span></span>
<span class="line"><span style="color:#E06C75;">--redirect-url</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">https://example.com/oauth2/callback</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Cookie 配置</span></span>
<span class="line"><span style="color:#E06C75;">--cookie-domain</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">example.com</span></span>
<span class="line"><span style="color:#E06C75;">--cookie-secret</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">openssl</span><span style="color:#98C379;"> rand</span><span style="color:#D19A66;"> -base64</span><span style="color:#D19A66;"> 32</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 32</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">--cookie-secure</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">true</span></span>
<span class="line"><span style="color:#E06C75;">--cookie-httponly</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">true</span></span>
<span class="line"><span style="color:#E06C75;">--cookie-samesite</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">lax</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 监听地址</span></span>
<span class="line"><span style="color:#E06C75;">--http-address</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">127.0.0.1:4180</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 邮箱域限制</span></span>
<span class="line"><span style="color:#E06C75;">--email-domain</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 跳过认证的路径</span></span>
<span class="line"><span style="color:#E06C75;">--skip-provider-button</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 后端签名</span></span>
<span class="line"><span style="color:#E06C75;">--set-xauthrequest</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">true</span></span>
<span class="line"><span style="color:#E06C75;">--set-authorization-header</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nginx-oauth2-proxy-配置" tabindex="-1"><a class="header-anchor" href="#nginx-oauth2-proxy-配置"><span>Nginx + oauth2-proxy 配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># oauth2-proxy 认证网关</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">app.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">    /etc/nginx/ssl/app.example.com.pem;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/app.example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 应用路径 - 通过 oauth2-proxy 认证</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://127.0.0.1:4180;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # OAuth2 回调路径</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /oauth2/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://127.0.0.1:4180;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="auth-request-oauth2-proxy" tabindex="-1"><a class="header-anchor" href="#auth-request-oauth2-proxy"><span>auth_request + oauth2-proxy</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 auth_request 模式集成 oauth2-proxy</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 后端服务直接暴露，认证由 Nginx 子请求完成</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">app.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 认证子请求</span></span>
<span class="line"><span style="color:#C678DD;">    auth_request </span><span style="color:#ABB2BF;">/oauth2/auth;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 将认证信息传递给后端</span></span>
<span class="line"><span style="color:#C678DD;">    auth_request_set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">user</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">upstream_http_x_auth_request_user</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    auth_request_set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">email</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">upstream_http_x_auth_request_email</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    auth_request_set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">groups</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">upstream_http_x_auth_request_groups</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 认证失败重定向到登录</span></span>
<span class="line"><span style="color:#C678DD;">    error_page </span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;"> = /oauth2/sign_in;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # oauth2-proxy 认证端点</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/oauth2/auth </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        internal</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://127.0.0.1:4180/oauth2/auth;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass_request_body </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Content-Length </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Original-URL $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">://$</span><span style="color:#E06C75;">http_host</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # oauth2-proxy 登录/回调</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /oauth2/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://127.0.0.1:4180;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 后端服务</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://app_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-User $</span><span style="color:#E06C75;">user</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Email $</span><span style="color:#E06C75;">email</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Groups $</span><span style="color:#E06C75;">groups</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="认证缓存与性能" tabindex="-1"><a class="header-anchor" href="#认证缓存与性能"><span>认证缓存与性能</span></a></h2><h3 id="认证性能问题" tabindex="-1"><a class="header-anchor" href="#认证性能问题"><span>认证性能问题</span></a></h3><p>每次请求都进行认证会带来性能开销：</p><ul><li>HTTP Basic：每次请求读取 htpasswd 文件</li><li>auth_request：每次请求发送子请求</li><li>JWT：每次请求验证签名</li></ul><h3 id="auth-basic-缓存" tabindex="-1"><a class="header-anchor" href="#auth-basic-缓存"><span>auth_basic 缓存</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># auth_basic 本身不提供缓存</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 但 htpasswd 文件在启动时加载到内存</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 文件修改后需要 reload 才生效</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 对于大量用户的场景，考虑使用 auth_request 替代</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="auth-request-缓存" tabindex="-1"><a class="header-anchor" href="#auth-request-缓存"><span>auth_request 缓存</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 proxy_cache 缓存认证结果</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 定义认证缓存</span></span>
<span class="line"><span style="color:#C678DD;">proxy_cache_path </span><span style="color:#ABB2BF;">/var/cache/nginx/auth levels=1:2</span></span>
<span class="line"><span style="color:#ABB2BF;">                 keys_zone=auth_cache:10m max_size=100m</span></span>
<span class="line"><span style="color:#ABB2BF;">                 inactive=5m use_temp_path=off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    auth_request </span><span style="color:#ABB2BF;">/auth/verify;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 缓存认证结果</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/auth/verify </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        internal</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 基于认证头生成缓存 key</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_cache </span><span style="color:#ABB2BF;">auth_cache;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_cache_key </span><span style="color:#98C379;">&quot;$</span><span style="color:#E06C75;">http_authorization</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_cache_valid </span><span style="color:#D19A66;">200</span><span style="color:#D19A66;"> 5m</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 认证成功缓存 5 分钟</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_cache_valid </span><span style="color:#D19A66;">401</span><span style="color:#D19A66;"> 1m</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 认证失败缓存 1 分钟</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://auth-service:8080/verify;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass_request_body </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Content-Length </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Authorization $</span><span style="color:#E06C75;">http_authorization</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">认证缓存的风险</p><ul><li>用户权限变更后，缓存可能导致旧权限仍然生效</li><li>Token 撤销后，缓存可能导致已撤销的 Token 仍被接受</li><li>建议缓存时间不超过 5 分钟</li><li>高安全场景不建议缓存</li></ul></div><h3 id="jwt-性能优化" tabindex="-1"><a class="header-anchor" href="#jwt-性能优化"><span>JWT 性能优化</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># JWT 验证本身很快（纯计算，无网络请求）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优化点：</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 使用 HMAC (HS256) 而非 RSA (RS256) 提高验证速度</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HMAC: 微秒级</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># RSA: 毫秒级</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 在 Lua 中缓存 JWT 验证结果</span></span>
<span class="line"><span style="color:#C678DD;">lua_shared_dict</span><span style="color:#ABB2BF;"> jwt_cache </span><span style="color:#D19A66;">1m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        access_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> cache</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.jwt_cache</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> auth_header</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.var.http_authorization</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#56B6C2;"> not</span><span style="color:#E06C75;"> auth_header</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> _</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">_</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">string.find</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">auth_header</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;Bearer%s+(.+)&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 检查缓存</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> cached</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">cache</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#E06C75;"> cached</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.req.</span><span style="color:#61AFEF;">set_header</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;X-User-Id&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">cached</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">                return</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- JWT 验证</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> jwt</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">require</span><span style="color:#98C379;"> &quot;resty.jwt&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> jwt_obj</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">jwt</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">verify</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;secret&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#E06C75;"> jwt_obj</span><span style="color:#ABB2BF;">.verified </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">                local</span><span style="color:#E06C75;"> user_id</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">jwt_obj</span><span style="color:#ABB2BF;">.payload.sub</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                -- 缓存 60 秒</span></span>
<span class="line"><span style="color:#E5C07B;">                cache</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">set</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">user_id</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">60</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.req.</span><span style="color:#61AFEF;">set_header</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;X-User-Id&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">user_id</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            else</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"><span style="color:#C678DD;">        end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">        proxy_pass</span><span style="color:#E5C07B;"> http</span><span style="color:#ABB2BF;">://</span><span style="color:#E06C75;">api_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="多因素认证方案" tabindex="-1"><a class="header-anchor" href="#多因素认证方案"><span>多因素认证方案</span></a></h2><h3 id="双因素认证架构" tabindex="-1"><a class="header-anchor" href="#双因素认证架构"><span>双因素认证架构</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>认证层次：</span></span>
<span class="line"><span>第一层：用户名 + 密码（知识因素）</span></span>
<span class="line"><span>第二层：OTP/短信/TOTP（持有因素）</span></span>
<span class="line"><span>第三层：证书/生物特征（固有因素）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nginx-实现多因素认证" tabindex="-1"><a class="header-anchor" href="#nginx-实现多因素认证"><span>Nginx 实现多因素认证</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 结合 HTTP Basic + auth_request 实现双因素认证</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">secure.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 第一层：HTTP Basic 认证</span></span>
<span class="line"><span style="color:#C678DD;">    auth_basic </span><span style="color:#98C379;">&quot;First Factor&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    auth_basic_user_file </span><span style="color:#ABB2BF;">/etc/nginx/.htpasswd;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 第二层：auth_request 验证 OTP</span></span>
<span class="line"><span style="color:#C678DD;">    auth_request </span><span style="color:#ABB2BF;">/auth/otp-verify;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    auth_request_set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">otp_status</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">upstream_http_x_otp_status</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/auth/otp-verify </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        internal</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://auth-service:8080/otp/verify;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass_request_body </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Content-Length </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-User $</span><span style="color:#E06C75;">remote_user</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-OTP $</span><span style="color:#E06C75;">http_x_otp</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://secure_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-User $</span><span style="color:#E06C75;">remote_user</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-OTP-Status $</span><span style="color:#E06C75;">otp_status</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="客户端证书认证" tabindex="-1"><a class="header-anchor" href="#客户端证书认证"><span>客户端证书认证</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_ssl_module.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">secure.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">    /etc/nginx/ssl/server.pem;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/server.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 客户端证书认证</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_client_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/ca.pem;  </span><span style="color:#7F848E;font-style:italic;"># CA 证书</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_verify_client </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;                           </span><span style="color:#7F848E;font-style:italic;"># 要求客户端证书</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_verify_depth </span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">;                             </span><span style="color:#7F848E;font-style:italic;"># 证书链深度</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 客户端证书信息变量</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # $ssl_client_fingerprint  证书指纹</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # $ssl_client_s_dn         证书主题 DN</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # $ssl_client_i_dn         证书签发者 DN</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # $ssl_client_v_end        证书过期时间</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # $ssl_client_v_start      证书生效时间</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # $ssl_client_serial       证书序列号</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 将客户端证书信息传递给后端</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Client-DN $</span><span style="color:#E06C75;">ssl_client_s_dn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Client-Verify $</span><span style="color:#E06C75;">ssl_client_verify</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Client-Fingerprint $</span><span style="color:#E06C75;">ssl_client_fingerprint</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="可选客户端证书" tabindex="-1"><a class="header-anchor" href="#可选客户端证书"><span>可选客户端证书</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 允许有证书和无证书的客户端同时访问</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">    /etc/nginx/ssl/server.pem;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/server.key;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_client_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/ca.pem;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # optional：请求证书但非必需</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_verify_client </span><span style="color:#ABB2BF;">optional;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 使用 map 基于证书验证结果选择后端</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 避免在 if 中使用 proxy_pass 的反模式</span></span>
<span class="line"><span style="color:#C678DD;">    map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">ssl_client_verify</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">cert_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">        default</span><span style="color:#ABB2BF;">      basic_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        SUCCESS      premium_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">cert_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="完整认证网关配置" tabindex="-1"><a class="header-anchor" href="#完整认证网关配置"><span>完整认证网关配置</span></a></h2><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># https://nginx.org/en/docs/http/ngx_http_auth_request_module.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 统一认证网关配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># JWT 黑名单共享内存</span></span>
<span class="line"><span style="color:#C678DD;">lua_shared_dict</span><span style="color:#ABB2BF;"> jwt_blacklist </span><span style="color:#D19A66;">1m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">lua_shared_dict</span><span style="color:#ABB2BF;"> jwt_cache </span><span style="color:#D19A66;">5m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl;</span></span>
<span class="line"><span style="color:#C678DD;">    http2 </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">    /etc/nginx/ssl/api.example.com-fullchain.pem;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/api.example.com.key;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_protocols </span><span style="color:#ABB2BF;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 公开接口（不需要认证）=====</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/api/auth/login </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://auth_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/api/auth/register </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://auth_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/health </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &quot;OK&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 受保护接口（JWT 认证）=====</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        access_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> jwt</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">require</span><span style="color:#98C379;"> &quot;resty.jwt&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> cache</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.jwt_cache</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> blacklist</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.jwt_blacklist</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> auth_header</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.var.http_authorization</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#56B6C2;"> not</span><span style="color:#E06C75;"> auth_header</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.status = </span><span style="color:#D19A66;">401</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.header[</span><span style="color:#98C379;">&quot;WWW-Authenticate&quot;</span><span style="color:#ABB2BF;">] = </span><span style="color:#98C379;">&#39;Bearer realm=&quot;API&quot;&#39;</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;{&quot;error&quot;: &quot;Missing authorization header&quot;}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> _</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">_</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">string.find</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">auth_header</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;Bearer%s+(.+)&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#56B6C2;"> not</span><span style="color:#E06C75;"> token</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.status = </span><span style="color:#D19A66;">401</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;{&quot;error&quot;: &quot;Invalid authorization format&quot;}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 检查黑名单</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#E5C07B;"> blacklist</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.status = </span><span style="color:#D19A66;">401</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;{&quot;error&quot;: &quot;Token revoked&quot;}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 检查缓存</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> cached_user</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">cache</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#E06C75;"> cached_user</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.req.</span><span style="color:#61AFEF;">set_header</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;X-User-Id&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">cached_user</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">                return</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 验证 JWT</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> jwt_obj</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">jwt</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">verify</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;your-secret-key&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#56B6C2;"> not</span><span style="color:#E06C75;"> jwt_obj</span><span style="color:#ABB2BF;">.verified </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.status = </span><span style="color:#D19A66;">401</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;{&quot;error&quot;: &quot;Invalid token&quot;}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 检查过期</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#E06C75;"> jwt_obj</span><span style="color:#ABB2BF;">.payload.exp </span><span style="color:#56B6C2;">and</span><span style="color:#E06C75;"> jwt_obj</span><span style="color:#ABB2BF;">.payload.exp &lt; </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">time</span><span style="color:#ABB2BF;">() </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.status = </span><span style="color:#D19A66;">401</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;{&quot;error&quot;: &quot;Token expired&quot;}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 缓存验证结果</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> user_id</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">jwt_obj</span><span style="color:#ABB2BF;">.payload.sub </span><span style="color:#56B6C2;">or</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#E5C07B;">            cache</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">set</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">token</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">user_id</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">60</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.req.</span><span style="color:#61AFEF;">set_header</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;X-User-Id&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">user_id</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.req.</span><span style="color:#61AFEF;">set_header</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;X-User-Role&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">jwt_obj</span><span style="color:#ABB2BF;">.payload.role </span><span style="color:#56B6C2;">or</span><span style="color:#98C379;"> &quot;&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 管理接口（Basic 认证 + IP 白名单）=====</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /admin/ {</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">192.168.0.0/16;</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        auth_basic </span><span style="color:#98C379;">&quot;Admin Area&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        auth_basic_user_file </span><span style="color:#ABB2BF;">/etc/nginx/.htpasswd_admin;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://admin_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-User $</span><span style="color:#E06C75;">remote_user</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 内部工具（客户端证书认证）=====</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /internal/ {</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_verify_client </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://internal_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Client-DN $</span><span style="color:#E06C75;">ssl_client_s_dn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="延伸阅读" tabindex="-1"><a class="header-anchor" href="#延伸阅读"><span>延伸阅读</span></a></h2><ul><li><a href="https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html" target="_blank" rel="noopener noreferrer">Nginx Auth Basic Module 官方文档</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_auth_request_module.html" target="_blank" rel="noopener noreferrer">Nginx Auth Request Module 官方文档</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_ssl_module.html" target="_blank" rel="noopener noreferrer">Nginx SSL Module 官方文档</a></li><li><a href="https://tools.ietf.org/html/rfc7519" target="_blank" rel="noopener noreferrer">RFC 7519 - JSON Web Token</a></li><li><a href="https://tools.ietf.org/html/rfc6750" target="_blank" rel="noopener noreferrer">RFC 6750 - OAuth 2.0 Bearer Token</a></li><li><a href="https://oauth2-proxy.github.io/oauth2-proxy/" target="_blank" rel="noopener noreferrer">oauth2-proxy 官方文档</a></li><li><a href="https://github.com/jkeys089/lua-resty-hmac" target="_blank" rel="noopener noreferrer">OpenResty Lua JWT</a></li></ul>`,36)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};