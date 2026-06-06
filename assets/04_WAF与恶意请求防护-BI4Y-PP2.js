import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-BAWMMEAF.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/06_%E9%99%90%E6%B5%81%E4%B8%8E%E8%AE%BF%E9%97%AE%E6%8E%A7%E5%88%B6/04_WAF%E4%B8%8E%E6%81%B6%E6%84%8F%E8%AF%B7%E6%B1%82%E9%98%B2%E6%8A%A4.html","title":"WAF 与恶意请求防护","lang":"zh-CN","frontmatter":{"title":"WAF 与恶意请求防护","icon":"fa6-solid:shield-virus","order":4,"category":["Linux","Nginx"],"tag":["WAF","ModSecurity","OWASP","SQL注入","XSS","DDoS","Bot检测"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":29.79,"words":8937},"filePathRelative":"Linux/07_Nginx/06_限流与访问控制/04_WAF与恶意请求防护.md"}`),s={name:`04_WAF与恶意请求防护.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="waf-与恶意请求防护" tabindex="-1"><a class="header-anchor" href="#waf-与恶意请求防护"><span>WAF 与恶意请求防护</span></a></h1><p>Web 应用防火墙（WAF）是 Nginx 安全体系的核心组件。与网络层防火墙不同，WAF 工作在应用层（OSI 第 7 层），能够深入解析 HTTP 请求内容，识别并拦截 SQL 注入、XSS 跨站脚本、文件包含、路径遍历等攻击。本文从 WAF 原理出发，系统讲解 ModSecurity 集成、OWASP CRS 规则集、常见攻击防护以及自定义规则编写。</p><hr><h2 id="_1-waf-原理与架构" tabindex="-1"><a class="header-anchor" href="#_1-waf-原理与架构"><span>1. WAF 原理与架构</span></a></h2><h3 id="_1-1-waf-在安全体系中的位置" tabindex="-1"><a class="header-anchor" href="#_1-1-waf-在安全体系中的位置"><span>1.1 WAF 在安全体系中的位置</span></a></h3>`,5),i(d,{code:`eJxlUV1LG0EUfc+vGFboU8NCFBtDEbKmgYBIIC15GPqQ7M42wZDIZsT61rRNTQParxQVFPzIgxBNVERDgvhnnNn1X3hnJppRB+bjcO695865bqmyYhdyHkXvrRCCVV3Of/JySwWUKlPilQnFxu3gb1Br+dd/jI8yRKwPVeJhfnLI+n2/dcQbV2MqTmnOXhR0a8jWhsGX+pizKhTz2iX//stvHAfbHcWQshN6Kp4h9rJXpKvYYN2frH50t3XuD240/cRCBhtwIGB4s/0275mzADPv5pApSN6v84tNLWEusYBhCzZRySDFj+lkFhvwQ3+4I6RqHXawLWvOT5rzUyi4WePDtlYtG09iAw4V8waxQQtsYGdfVTtaZDydhk88pWVW0G0HvZrJNxp895vJmnus92OU99IPSzhadqDS7w2/0+M766y5r/dD8hj2qA9dPYVhI5Wg2Wdh/v+Ur3fZ4N8zTTFZ9OpxivCEoaFweFbYKiOE7QKDnRILWwVOZiVMZiUCdySEW2IwQmK4FQ/tgkw6paIekFKyRv+nqyUiK7jFUik24bq240ReV6lXWSSxCXs6Eo1ERzC8UnRoITa59FlLhV4eMt0Ze0pjRBuKsqNk2p4J3QOU0hGa`}),o[1]||=n(`<h3 id="_1-2-waf-工作模式" tabindex="-1"><a class="header-anchor" href="#_1-2-waf-工作模式"><span>1.2 WAF 工作模式</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>WAF 三种工作模式：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 检测模式（Detection Only）</span></span>
<span class="line"><span>   ┌──────┐     ┌──────┐     ┌──────┐</span></span>
<span class="line"><span>   │ 请求 │────→│ WAF  │────→│ 后端 │</span></span>
<span class="line"><span>   └──────┘     │ 检测 │     └──────┘</span></span>
<span class="line"><span>                │ 记录 │</span></span>
<span class="line"><span>                └──┬───┘</span></span>
<span class="line"><span>                   ↓</span></span>
<span class="line"><span>              [告警日志]</span></span>
<span class="line"><span>   特点：只记录不拦截，用于规则调优</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 阻断模式（Prevention）</span></span>
<span class="line"><span>   ┌──────┐     ┌──────┐     ┌──────┐</span></span>
<span class="line"><span>   │ 请求 │────→│ WAF  │     │ 后端 │</span></span>
<span class="line"><span>   └──────┘     │ 检测 │     └──────┘</span></span>
<span class="line"><span>                │ 拦截 │──×──→</span></span>
<span class="line"><span>                └──┬───┘</span></span>
<span class="line"><span>                   ↓</span></span>
<span class="line"><span>            [403 拦截页面]</span></span>
<span class="line"><span>   特点：检测并拦截恶意请求</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 重定向模式（Redirect）</span></span>
<span class="line"><span>   ┌──────┐     ┌──────┐     ┌──────┐</span></span>
<span class="line"><span>   │ 请求 │────→│ WAF  │     │ 后端 │</span></span>
<span class="line"><span>   └──────┘     │ 检测 │     └──────┘</span></span>
<span class="line"><span>                │ 重定向│──×──→</span></span>
<span class="line"><span>                └──┬───┘</span></span>
<span class="line"><span>                   ↓</span></span>
<span class="line"><span>         [重定向到警告页]</span></span>
<span class="line"><span>   特点：将恶意请求重定向到清洗页面</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-waf-检测机制" tabindex="-1"><a class="header-anchor" href="#_1-3-waf-检测机制"><span>1.3 WAF 检测机制</span></a></h3>`,3),i(d,{code:`eJx1kstKw0AUhvc+xYDgzoUiiC5ceAEXRUpVXAwuYjppB2MHm3qPoKJt0FYr2oIuvFBvCK1KxVttn6YzjW/hZCaNpcRAmOGc7z//OYfRdLKiRpV4AgRCHYB/IbQIx6emgsB+emcvO7Ogu3sIBJW4gaCM2PcFdpGdFbCIC2I6FID8B/7ZcaSEUdwtQG9e/alhEl5zmXr1xJ8ZIWQeIygPz01Ajn2Xa8UvTjV+uKSjnSDxBUXH6wiy3DPLlNhViqaSNJ2XJl5awKElHY3FIjjG577fpdYZ/c6xk0Oa/vzZy7iOf4yQmKxYcECBmHyTEbQKZUyWkD7tqkaxRrOZpmoSRyA7rdBURcb9NfZ1uv7xRa0kH98EwyiqLGPCFyzC7OGaXhz8Y3ZWdcwyORPMRHECQS/AClvs8rY5mdM73x7vxlmlW59fhUiUGkUqNjCJbVDrhpbOabLcKOY3hbqZkpY0a7Ey9wsqhsFHq/EmZW9t2NFTI39sggCJQLv0TKs5erxvF+/8WLb9xnaP+OA6UechO7hj1qP7XmX/RmJNR63Da1jXBztRzxxC/S2EV1bmNU0bUPta8sLAS6rhcG/HL+d+WUU=`}),o[2]||=n(`<hr><h2 id="_2-modsecurity-集成" tabindex="-1"><a class="header-anchor" href="#_2-modsecurity-集成"><span>2. ModSecurity 集成</span></a></h2><h3 id="_2-1-modsecurity-简介" tabindex="-1"><a class="header-anchor" href="#_2-1-modsecurity-简介"><span>2.1 ModSecurity 简介</span></a></h3><p>ModSecurity 是最成熟的开源 WAF 引擎，由 Trustwave 维护，目前作为 OWASP 项目继续发展。它以 Nginx 动态模块形式运行，提供完整的规则引擎和丰富的生态。</p><div class="hint-container warning"><p class="hint-container-title">ModSecurity v3 已归档</p><p>SpiderLabs/ModSecurity（即 ModSecurity v3）已于 2024 年归档，不再积极维护。对于新项目，推荐使用 <a href="https://github.com/corazawaf/coraza" target="_blank" rel="noopener noreferrer">Coraza WAF</a> 作为替代。Coraza 是 ModSecurity v3 的 Go 语言重写，兼容 SecRule 语法和 OWASP CRS，且仍在活跃开发中。</p></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ModSecurity 核心能力：</span></span>
<span class="line"><span>┌─────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  ModSecurity 核心引擎                        │</span></span>
<span class="line"><span>├─────────────────────────────────────────────┤</span></span>
<span class="line"><span>│  · 完整的 HTTP 请求/响应检查                  │</span></span>
<span class="line"><span>│  · 规则语言（SecRule）支持正则匹配            │</span></span>
<span class="line"><span>│  · 请求体解析（multipart / JSON / XML）       │</span></span>
<span class="line"><span>│  · 响应体检查（信息泄露防护）                 │</span></span>
<span class="line"><span>│  · 审计日志与实时监控                        │</span></span>
<span class="line"><span>│  · 与 OWASP CRS 深度集成                     │</span></span>
<span class="line"><span>│  · 地理位置感知（GeoIP）                     │</span></span>
<span class="line"><span>│  · 异常评分机制                              │</span></span>
<span class="line"><span>└─────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-编译安装-modsecurity" tabindex="-1"><a class="header-anchor" href="#_2-2-编译安装-modsecurity"><span>2.2 编译安装 ModSecurity</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 方式一：动态模块编译 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 安装编译依赖</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> update</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> git</span><span style="color:#98C379;"> build-essential</span><span style="color:#98C379;"> libpcre3-dev</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    libssl-dev</span><span style="color:#98C379;"> libxml2-dev</span><span style="color:#98C379;"> libyajl-dev</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    libcurl4-openssl-dev</span><span style="color:#98C379;"> pkg-config</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    geoip-bin</span><span style="color:#98C379;"> libgeoip-dev</span><span style="color:#98C379;"> liblua5.3-dev</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    zlib1g-dev</span><span style="color:#98C379;"> doxygen</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 下载 ModSecurity 源码</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> /usr/local/src</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> clone</span><span style="color:#D19A66;"> --depth</span><span style="color:#D19A66;"> 1</span><span style="color:#D19A66;"> -b</span><span style="color:#98C379;"> v3/master</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    https://github.com/SpiderLabs/ModSecurity.git</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> ModSecurity</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> submodule</span><span style="color:#98C379;"> init</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> submodule</span><span style="color:#98C379;"> update</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 编译 ModSecurity 库</span></span>
<span class="line"><span style="color:#61AFEF;">./build.sh</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#D19A66;"> --with-lua=/usr</span></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#D19A66;"> -j$(</span><span style="color:#61AFEF;">nproc</span><span style="color:#D19A66;">)</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> make</span><span style="color:#98C379;"> install</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 下载 ModSecurity-nginx 连接器</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> /usr/local/src</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> clone</span><span style="color:#D19A66;"> --depth</span><span style="color:#D19A66;"> 1</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    https://github.com/SpiderLabs/ModSecurity-nginx.git</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 编译 Nginx 动态模块（需要与 Nginx 版本一致）</span></span>
<span class="line"><span style="color:#E06C75;">NGINX_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1.26.2</span></span>
<span class="line"><span style="color:#61AFEF;">wget</span><span style="color:#98C379;"> https://nginx.org/download/nginx-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">NGINX_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">.tar.gz</span></span>
<span class="line"><span style="color:#61AFEF;">tar</span><span style="color:#98C379;"> xzf</span><span style="color:#98C379;"> nginx-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">NGINX_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">.tar.gz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> nginx-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">NGINX_VERSION</span><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#D19A66;"> --with-compat</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --add-dynamic-module=../ModSecurity-nginx</span></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#98C379;"> modules</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 复制模块到 Nginx 模块目录</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> cp</span><span style="color:#98C379;"> objs/ngx_http_modsecurity_module.so</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    /etc/nginx/modules/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 方式二：使用预编译包（Ubuntu 22.04+）=====</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> libmodsecurity3</span><span style="color:#98C379;"> libmodsecurity-dev</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> modsecurity-crs</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-nginx-加载-modsecurity" tabindex="-1"><a class="header-anchor" href="#_2-3-nginx-加载-modsecurity"><span>2.3 Nginx 加载 ModSecurity</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/nginx.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 加载 ModSecurity 动态模块</span></span>
<span class="line"><span style="color:#C678DD;">load_module </span><span style="color:#ABB2BF;">modules/ngx_http_modsecurity_module.so;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 全局 ModSecurity 配置</span></span>
<span class="line"><span style="color:#C678DD;">    modsecurity</span><span style="color:#D19A66;"> on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    modsecurity_rules_file</span><span style="color:#ABB2BF;"> /etc/nginx/modsecurity.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 可在 server/location 级别单独控制</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">            modsecurity</span><span style="color:#D19A66;"> on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            modsecurity_rules_file</span><span style="color:#ABB2BF;"> /etc/nginx/modsecurity_api.conf;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 对静态资源关闭 WAF（节省性能）</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /static/ {</span></span>
<span class="line"><span style="color:#C678DD;">            modsecurity</span><span style="color:#D19A66;"> off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-modsecurity-核心配置文件" tabindex="-1"><a class="header-anchor" href="#_2-4-modsecurity-核心配置文件"><span>2.4 ModSecurity 核心配置文件</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/modsecurity.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 基本设置 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># WAF 引擎开关：DetectionOnly / On</span></span>
<span class="line"><span style="color:#61AFEF;">SecRuleEngine</span><span style="color:#98C379;"> DetectionOnly</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 请求体处理</span></span>
<span class="line"><span style="color:#61AFEF;">SecRequestBodyAccess</span><span style="color:#98C379;"> On</span></span>
<span class="line"><span style="color:#61AFEF;">SecRequestBodyLimit</span><span style="color:#D19A66;"> 13107200</span><span style="color:#7F848E;font-style:italic;">              # 12.5MB 最大请求体</span></span>
<span class="line"><span style="color:#61AFEF;">SecRequestBodyNoFilesLimit</span><span style="color:#D19A66;"> 1048576</span><span style="color:#7F848E;font-style:italic;">         # 1MB 非文件部分</span></span>
<span class="line"><span style="color:#61AFEF;">SecRequestBodyInMemoryLimit</span><span style="color:#D19A66;"> 131072</span><span style="color:#7F848E;font-style:italic;">        # 128KB 内存缓存</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 响应体处理</span></span>
<span class="line"><span style="color:#61AFEF;">SecResponseBodyAccess</span><span style="color:#98C379;"> Off</span><span style="color:#7F848E;font-style:italic;">                  # 生产环境通常关闭</span></span>
<span class="line"><span style="color:#61AFEF;">SecResponseBodyLimit</span><span style="color:#D19A66;"> 524288</span><span style="color:#7F848E;font-style:italic;">                # 512KB 响应体检查上限</span></span>
<span class="line"><span style="color:#61AFEF;">SecResponseBodyMimeType</span><span style="color:#98C379;"> text/plain</span><span style="color:#98C379;"> text/html</span><span style="color:#98C379;"> application/json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 日志配置 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 审计日志</span></span>
<span class="line"><span style="color:#61AFEF;">SecAuditEngine</span><span style="color:#98C379;"> RelevantOnly</span></span>
<span class="line"><span style="color:#61AFEF;">SecAuditLog</span><span style="color:#98C379;"> /var/log/modsecurity/audit.log</span></span>
<span class="line"><span style="color:#61AFEF;">SecAuditLogParts</span><span style="color:#98C379;"> ABIJDE</span><span style="color:#7F848E;font-style:italic;">                    # 记录部分</span></span>
<span class="line"><span style="color:#61AFEF;">SecAuditLogType</span><span style="color:#98C379;"> Serial</span><span style="color:#7F848E;font-style:italic;">                     # 串行写入</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 调试日志（生产环境关闭）</span></span>
<span class="line"><span style="color:#61AFEF;">SecDebugLog</span><span style="color:#98C379;"> /var/log/modsecurity/debug.log</span></span>
<span class="line"><span style="color:#61AFEF;">SecDebugLogLevel</span><span style="color:#D19A66;"> 0</span><span style="color:#7F848E;font-style:italic;">                         # 0=关闭，9=最详细</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 默认动作 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认拒绝动作</span></span>
<span class="line"><span style="color:#61AFEF;">SecDefaultAction</span><span style="color:#98C379;"> &quot;phase:1,log,auditlog,pass&quot;</span><span style="color:#7F848E;font-style:italic;">  # 检测模式</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SecDefaultAction &quot;phase:1,deny,log,auditlog,status:403&quot;  # 阻断模式</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 规则去重 =====</span></span>
<span class="line"><span style="color:#61AFEF;">SecRuleRemoveById</span><span style="color:#D19A66;"> 911100</span><span style="color:#7F848E;font-style:italic;">                   # 移除误报规则</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_3-owasp-核心规则集-crs" tabindex="-1"><a class="header-anchor" href="#_3-owasp-核心规则集-crs"><span>3. OWASP 核心规则集（CRS）</span></a></h2><h3 id="_3-1-crs-架构与规则分类" tabindex="-1"><a class="header-anchor" href="#_3-1-crs-架构与规则分类"><span>3.1 CRS 架构与规则分类</span></a></h3><p>OWASP ModSecurity Core Rule Set（CRS）是业界最广泛使用的 WAF 规则集，覆盖 OWASP Top 10 全部攻击类型。</p>`,16),i(d,{code:`eJyNU+Fr00Ac/d6/4ohfdFBc2hSJyGCbFQoFZ6MoFD9kaeKqIYlJpvhtk9V1tqWCtdCtw5UhLUwbdTilreyfyV3S/8K7XDq3NoPdhyTcvcd7794viqq/ltZE0wYPl2IAL2t99ZkpGmtgOSfkmfuPF4UV8gleccDvbsFya7z3jnkaQC/Al0RLzjPw88DrbFAguM7Pz8/dOAcmK6MVbYwr78NuBVab41LN+9u/s2reXMBovOL4xfP8FEuQRE2TzTyDdo5QvQ5bPXS4gX5VKJFNsoTIJmeJaU3RTYk4Gw1g+cT71vQ+fZnIBaxpOVkrxGbj5eSX67KFnfvOb/TjLVXHCdk5EAc8NxNzxdRtXdJVLFyr+/0+lafCCZozEZEzdy+DJU7bXq+Cmtvu8ARWS/DDEeUlKS8ZwcsSHmp/he3vETyck/DYCL3l9ETPHR56B5top+t3qiGPGMW8REQfsmUVdS3PuKNd39mHewPY3w1ZxCZmRZSR0Z7Lkh3whAdZdNyDpbALjkpxEVJPBDyH+IEaQ7g9DOE0EReR6JGh6mIBX0ZwDe6f9+7oIDTGUWPc1fq2DF0LRvpjDQ4aZ4WngsJvzRR+V7TFrCy+wFdy2kGbDjreGrd/UuUULS4VUdyiYaRNU8eTjUW8Rm/caPmOE9JoytRUSmL4gnHy64F4fGEypMFm+B3u0zAUbtlvVPl/F0Apqurta4oiFQqJcwB85Zcd4am57Ggy92fnCi9xsX9fmXQ7`}),o[3]||=n(`<h3 id="_3-2-安装-owasp-crs" tabindex="-1"><a class="header-anchor" href="#_3-2-安装-owasp-crs"><span>3.2 安装 OWASP CRS</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 下载 CRS</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> /etc/nginx</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> git</span><span style="color:#98C379;"> clone</span><span style="color:#D19A66;"> --depth</span><span style="color:#D19A66;"> 1</span><span style="color:#D19A66;"> -b</span><span style="color:#98C379;"> v4.0/master</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    https://github.com/coreruleset/coreruleset.git</span><span style="color:#98C379;"> /etc/nginx/crs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 准备配置文件</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> /etc/nginx/crs</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> cp</span><span style="color:#98C379;"> crs-setup.conf.example</span><span style="color:#98C379;"> crs-setup.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改 ModSecurity 配置，引入 CRS</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/nginx/modsecurity_crs.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;"># 引入 CRS 基础配置</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/crs-setup.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 引入 CRS 规则</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-901-INITIALIZATION.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-903.9001-DRUPAL-EXCLUSION-RULES.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-903.9002-WORDPRESS-EXCLUSION-RULES.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-903.9003-NEXTCLOUD-EXCLUSION-RULES.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-903.9004-DOKUWIKI-EXCLUSION-RULES.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-903.9005-CPANEL-EXCLUSION-RULES.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-903.9006-XENFORO-EXCLUSION-RULES.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-905-COMMON-EXCEPTIONS.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-911-METHOD-ENFORCEMENT.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-913-SCANNER-DETECTION.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-920-PROTOCOL-ENFORCEMENT.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-921-PROTOCOL-ATTACK.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-922-MULTIPART-ATTACK.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-930-APPLICATION-ATTACK-LFI.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-931-APPLICATION-ATTACK-RFI.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-932-APPLICATION-ATTACK-RCE.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-933-APPLICATION-ATTACK-PHP.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-934-APPLICATION-ATTACK-GENERIC.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-941-APPLICATION-ATTACK-XSS.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-942-APPLICATION-ATTACK-SQLI.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-943-APPLICATION-ATTACK-SESSION-FIXATION.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-944-APPLICATION-ATTACK-JAVA.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-949-BLOCKING-EVALUATION.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/RESPONSE-950-DATA-LEAKAGES.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/RESPONSE-951-DATA-LEAKAGES-SQL.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/RESPONSE-952-DATA-LEAKAGES-JAVA.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/RESPONSE-953-DATA-LEAKAGES-PHP.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/RESPONSE-954-DATA-LEAKAGES-IIS.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/RESPONSE-955-WEB-SHELLS.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/RESPONSE-959-BLOCKING-EVALUATION.conf</span></span>
<span class="line"><span style="color:#98C379;">Include /etc/nginx/crs/rules/REQUEST-980-EXCLUSION-RULES-AFTER-CRS.conf</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 更新 ModSecurity 主配置引入 CRS</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Include /etc/nginx/modsecurity_crs.conf&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    sudo</span><span style="color:#98C379;"> tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> /etc/nginx/modsecurity.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-crs-异常评分模式" tabindex="-1"><a class="header-anchor" href="#_3-3-crs-异常评分模式"><span>3.3 CRS 异常评分模式</span></a></h3><p>CRS 默认使用<strong>异常评分模式</strong>（Anomaly Scoring Mode），每个匹配的规则增加分数，最终由总分数决定是否拦截：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>异常评分工作流程：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Phase 1: 请求头检测</span></span>
<span class="line"><span>┌───────────────────────────┐</span></span>
<span class="line"><span>│ 请求头规则匹配             │</span></span>
<span class="line"><span>│ · 协议违规    → +5 分     │</span></span>
<span class="line"><span>│ · 恶意 UA     → +5 分     │</span></span>
<span class="line"><span>│ · 扫描器特征  → +5 分     │</span></span>
<span class="line"><span>└───────────┬───────────────┘</span></span>
<span class="line"><span>            ↓</span></span>
<span class="line"><span>Phase 2: 请求体检测</span></span>
<span class="line"><span>┌───────────────────────────┐</span></span>
<span class="line"><span>│ 请求体规则匹配             │</span></span>
<span class="line"><span>│ · SQL 注入    → +5 分     │</span></span>
<span class="line"><span>│ · XSS 攻击    → +5 分     │</span></span>
<span class="line"><span>│ · RCE 尝试    → +5 分     │</span></span>
<span class="line"><span>│ · LFI/RFI     → +5 分     │</span></span>
<span class="line"><span>└───────────┬───────────────┘</span></span>
<span class="line"><span>            ↓</span></span>
<span class="line"><span>Phase 3: 累积评分判定</span></span>
<span class="line"><span>┌───────────────────────────┐</span></span>
<span class="line"><span>│ inbound_anomaly_score      │</span></span>
<span class="line"><span>│ ─────────────────────────  │</span></span>
<span class="line"><span>│ ≥ 阈值(默认5) → 拦截      │</span></span>
<span class="line"><span>│ &lt; 阈值       → 放行       │</span></span>
<span class="line"><span>│                           │</span></span>
<span class="line"><span>│ 阈值可调：                 │</span></span>
<span class="line"><span>│ · 严格：3 分               │</span></span>
<span class="line"><span>│ · 默认：5 分               │</span></span>
<span class="line"><span>│ · 宽松：10 分              │</span></span>
<span class="line"><span>│ · 仅检测：999999           │</span></span>
<span class="line"><span>└───────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-crs-关键配置项" tabindex="-1"><a class="header-anchor" href="#_3-4-crs-关键配置项"><span>3.4 CRS 关键配置项</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/crs/crs-setup.conf 关键配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 异常评分阈值 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 入站请求评分阈值（超过即拦截）</span></span>
<span class="line"><span style="color:#61AFEF;">SecAction</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:900110,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:1,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     pass,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     t:none,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     nolog,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:tx.inbound_anomaly_score_threshold=5&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 出站响应评分阈值</span></span>
<span class="line"><span style="color:#61AFEF;">SecAction</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:900120,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:1,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     pass,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     t:none,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     nolog,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:tx.outbound_anomaly_score_threshold=4&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 请求体检查策略 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 允许的 Content-Type</span></span>
<span class="line"><span style="color:#61AFEF;">SecAction</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">   id:900220,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">    phase:1,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">    pass,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">    t:none,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">    nolog,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">    setvar:&#39;tx.allowed_request_content_type=|application/x-www-form-urlencoded| |multipart/form-data| |text/xml| |application/xml| |application/soap+xml| |application/json|&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 拒绝响应页面 =====</span></span>
<span class="line"><span style="color:#61AFEF;">SecAction</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:900500,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:1,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     pass,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     t:none,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     nolog,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:tx.blocking_anomaly_score=5&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 自定义拦截页面</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SecAction \\</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     &quot;id:900600,\\</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#      phase:1,\\</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#      pass,\\</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#      t:none,\\</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#      nolog,\\</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#      setvar:tx.blocking_error_page=/waf-blocked.html&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 解码配置 =====</span></span>
<span class="line"><span style="color:#61AFEF;">SecAction</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:900950,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:1,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     pass,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     t:none,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     nolog,</span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:tx.crs_setup_version=400&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_4-sql-注入防护" tabindex="-1"><a class="header-anchor" href="#_4-sql-注入防护"><span>4. SQL 注入防护</span></a></h2><h3 id="_4-1-sql-注入攻击类型与检测" tabindex="-1"><a class="header-anchor" href="#_4-1-sql-注入攻击类型与检测"><span>4.1 SQL 注入攻击类型与检测</span></a></h3>`,10),i(d,{code:`eJx1Ul1r01AYvu+vOGQXhUE4RPDCjw3aJsNibGuSXhWRNDl1wSwZ6akfd1aoHZvaCu02GWhVOnth58dwiJn0z3iS9F94krRyJnggIeR9nvd5z/M+Ddt9aGzqHgZaPgPoabbq9zx9exOot2WrxtE3CE4npDMOBj7p+uFXn7zZ4+4k2PgUbL3ZtIwaF/o90vmRYq/XPbguZEFZAVkhu5YVGELVsVynxkXtAenvBG/H0ef3DKlaKpZLQJVkqaAxpLxtOSbVOPpGscvuuZIIVFmSKuAyzzNgyfNcr8YFu+P54DXTGz3Cnm7gB7rdQgxcxbpxH9HuZPSM9EbpSAnhGhCVcgVoubwssQRkuPE0v38+nx+eMQJkekieTkj/ZfTxmPReLSjIMTMXrRURRgaucQVFBcGHJ8H3vXC6Hw7HjEZFxxh51Kd4AaRzOh+ckOlBMHlHznuJVmoRLJZUSdFgtSLmNAmK9KfGjlreRp6OYzfiPtGsH54chJ+Okw50OcKaAGDiI/1iaBstx8DJmhL57q9g+CVVje2GealUuHErp9yEcjkn3t0oXrCn4G5tIYdejzoz7+4u5XieSq3QB66uQnZbjuGaiO72fD8ctUN/GM26qSlpIBQ5rUAanBgJyYs26Uyj2RHZOfvX4ji0gOfXFxYvfMePbbQMKmhYtn11pdEwTPMSU05i+b9iEr+/Rb1+Rcj8ASblMhQ=`}),o[4]||=n(`<h3 id="_4-2-crs-sql-注入规则详解" tabindex="-1"><a class="header-anchor" href="#_4-2-crs-sql-注入规则详解"><span>4.2 CRS SQL 注入规则详解</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>CRS SQL 注入规则组 (942*):</span></span>
<span class="line"><span></span></span>
<span class="line"><span>942100  SQL 注入攻击，通过 libinjection 检测</span></span>
<span class="line"><span>942110  SQL 注入：常见注入模式测试</span></span>
<span class="line"><span>942120  SQL 注入：SQL 运算符测试</span></span>
<span class="line"><span>942130  SQL 注入：SQL 图灵结构测试</span></span>
<span class="line"><span>942140  SQL 注入：常见 DB 名称测试</span></span>
<span class="line"><span>942150  SQL 注入：常见 DB 函数测试</span></span>
<span class="line"><span>942160  SQL 注入：盲注测试</span></span>
<span class="line"><span>942170  SQL 注入：注入关键词测试</span></span>
<span class="line"><span>942180  SQL 注入：UNION 查询测试</span></span>
<span class="line"><span>942190  SQL 注入：堆叠查询测试</span></span>
<span class="line"><span>942200  SQL 注入：MySQL 注释测试</span></span>
<span class="line"><span>942210  SQL 注入：编码绕过尝试</span></span>
<span class="line"><span>942220  SQL 注入：整数溢出尝试</span></span>
<span class="line"><span>942230  SQL 注入：条件语句测试</span></span>
<span class="line"><span>942240  SQL 注入：MySQL 特征测试</span></span>
<span class="line"><span>942250  SQL 注入：ORDER BY 测试</span></span>
<span class="line"><span>942260  SQL 注入：HAVING 测试</span></span>
<span class="line"><span>942270  SQL 注入：UNION ALL 测试</span></span>
<span class="line"><span>942280  SQL 注入：MySQL 系统变量测试</span></span>
<span class="line"><span>942290  SQL 注入：绕过尝试测试</span></span>
<span class="line"><span>942300  SQL 注入：MySQL 注释/条件测试</span></span>
<span class="line"><span>942310  SQL 注入：链式 SQL 命令测试</span></span>
<span class="line"><span>942320  SQL 注入：PostgreSQL 特征测试</span></span>
<span class="line"><span>942330  SQL 注入：Oracle 特征测试</span></span>
<span class="line"><span>942340  SQL 注入：MS SQL 特征测试</span></span>
<span class="line"><span>942350  SQL 注入：SQLite 特征测试</span></span>
<span class="line"><span>942360  SQL 注入：嵌套注入测试</span></span>
<span class="line"><span>942370  SQL 注入：布尔表达式测试</span></span>
<span class="line"><span>942380  SQL 注入：MongoDB 特征测试</span></span>
<span class="line"><span>942390  SQL 注入：JSON/NoSQL 测试</span></span>
<span class="line"><span>942400  SQL 注入：存储过程测试</span></span>
<span class="line"><span>942410  SQL 注入：时间延迟测试</span></span>
<span class="line"><span>942420  SQL 注入：异常测试</span></span>
<span class="line"><span>942430  SQL 注入：绕过尝试（高级）</span></span>
<span class="line"><span>942440  SQL 注入：注释序列测试</span></span>
<span class="line"><span>942450  SQL 注入：Hex 编码测试</span></span>
<span class="line"><span>942460  SQL 注入：元数据查询测试</span></span>
<span class="line"><span>942470  SQL 注入：命名空间注入测试</span></span>
<span class="line"><span>942480  SQL 注入：请求方法限制测试</span></span>
<span class="line"><span>942490  SQL 注入：HTTP 头注入测试</span></span>
<span class="line"><span>942500  SQL 注入：SQL 关键字频率测试</span></span>
<span class="line"><span>942510  SQL 注入：SQL 语法检测</span></span>
<span class="line"><span>942520  SQL 注入：替代编码测试</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-sql-注入检测实战" tabindex="-1"><a class="header-anchor" href="#_4-3-sql-注入检测实战"><span>4.3 SQL 注入检测实战</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 测试 SQL 注入检测（检测模式）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 以下请求将被 CRS 规则拦截</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 经典注入</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># GET /search?q=1&#39; OR &#39;1&#39;=&#39;1</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 匹配规则：942100 (libinjection) + 942110 (常见模式)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. UNION 注入</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># GET /user?id=1 UNION SELECT username,password FROM users--</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 匹配规则：942190 (堆叠查询) + 942270 (UNION ALL)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 盲注</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># GET /item?id=1 AND SLEEP(5)--</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 匹配规则：942160 (盲注) + 942410 (时间延迟)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 报错注入</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># GET /test?id=1 AND extractvalue(1,concat(0x7e,version()))</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 匹配规则：942150 (DB 函数) + 942130 (图灵结构)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-sql-注入防护增强配置" tabindex="-1"><a class="header-anchor" href="#_4-4-sql-注入防护增强配置"><span>4.4 SQL 注入防护增强配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/modsecurity_sql_hardening.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 针对数据库关键字的高强度检测</span></span>
<span class="line"><span style="color:#C678DD;">SecRule</span><span style="color:#ABB2BF;"> ARGS|ARGS_NAMES|REQUEST_COOKIES|REQUEST_COOKIES_NAMES|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        REQUEST_FILENAME|REQUEST_HEADERS:Referer|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        REQUEST_HEADERS:User-</span><span style="color:#C678DD;">Agent</span><span style="color:#ABB2BF;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;@</span><span style="color:#C678DD;">rx</span><span style="color:#ABB2BF;"> (?i)\\b(?:select\\s+.*\\bfrom\\b|insert\\s+into|update\\s+\\w+\\s+set|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        delete\\s+from|drop\\s+table|truncate\\s+table|alter\\s+table|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        exec(?:ute)?\\s+|union\\s+(?:all\\s+)?select|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        into\\s+(?:out|dump)file|load_file\\s*\\(|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        benchmark\\s*\\(|sleep\\s*\\(|waitfor\\s+delay|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        information_schema|mysql\\.(?:user|db)|pg_catalog)\\b&quot; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;id:991001,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     phase:2,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     block,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     capture,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     t:none,t:utf8toUnicode,t:urlDecodeUni,t:htmlEntityDecode,t:jsDecode,t:cssDecode,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     msg:&#39;</span><span style="color:#C678DD;">Enhanced</span><span style="color:#ABB2BF;"> SQL Injection Detection</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">Matched Data: %{TX.0} found within %{MATCHED_VAR_NAME}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">attack-sqli</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">CRITICAL</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:&#39;</span><span style="color:#ABB2BF;">tx.sql_injection_score=+%{tx.critical_anomaly_score}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:&#39;</span><span style="color:#ABB2BF;">tx.inbound_anomaly_score=+%{tx.critical_anomaly_score}</span><span style="color:#98C379;">&#39;&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_5-xss-跨站脚本防护" tabindex="-1"><a class="header-anchor" href="#_5-xss-跨站脚本防护"><span>5. XSS 跨站脚本防护</span></a></h2><h3 id="_5-1-xss-攻击类型" tabindex="-1"><a class="header-anchor" href="#_5-1-xss-攻击类型"><span>5.1 XSS 攻击类型</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>XSS 攻击三种类型：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 反射型 XSS（Reflected）</span></span>
<span class="line"><span>   攻击者构造恶意 URL → 受害者点击 → 脚本在页面中执行</span></span>
<span class="line"><span>   示例：https://example.com/search?q=&lt;script&gt;alert(1)&lt;/script&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 存储型 XSS（Stored）</span></span>
<span class="line"><span>   攻击者提交恶意内容 → 存入数据库 → 其他用户浏览时执行</span></span>
<span class="line"><span>   示例：评论框输入 &lt;img src=x onerror=alert(1)&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. DOM 型 XSS（DOM-based）</span></span>
<span class="line"><span>   恶意数据通过 DOM 操作注入页面，不经过服务端</span></span>
<span class="line"><span>   示例：document.getElementById(&#39;output&#39;).innerHTML = location.hash</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-crs-xss-规则组" tabindex="-1"><a class="header-anchor" href="#_5-2-crs-xss-规则组"><span>5.2 CRS XSS 规则组</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>CRS XSS 规则组 (941*):</span></span>
<span class="line"><span></span></span>
<span class="line"><span>941100  XSS 攻击，通过 libinjection 检测</span></span>
<span class="line"><span>941110  XSS 过滤器：类别 1 - 脚本标签</span></span>
<span class="line"><span>941120  XSS 过滤器：类别 2 - 事件处理器</span></span>
<span class="line"><span>941130  XSS 过滤器：类别 3 - 属性注入</span></span>
<span class="line"><span>941140  XSS 过滤器：类别 4 - JavaScript URL</span></span>
<span class="line"><span>941150  XSS 过滤器：类别 5 - 不允许的 HTML 属性</span></span>
<span class="line"><span>941160  XSS 过滤器：类别 6 - HTML 注入</span></span>
<span class="line"><span>941170  XSS 过滤器：类别 7 - SVG/MathML 标签</span></span>
<span class="line"><span>941180  XSS 过滤器：类别 8 - CSS 表达式</span></span>
<span class="line"><span>941190  XSS 过滤器：类别 9 - 数据 URL</span></span>
<span class="line"><span>941200  XSS 过滤器：类别 10 - Base64 编码</span></span>
<span class="line"><span>941210  XSS 过滤器：类别 11 - 模板字面量注入</span></span>
<span class="line"><span>941220  XSS 过滤器：类别 12 - JS 变量注入</span></span>
<span class="line"><span>941230  XSS 过滤器：类别 13 - 事件处理器变体</span></span>
<span class="line"><span>941240  XSS 过滤器：类别 14 - DOM 属性注入</span></span>
<span class="line"><span>941250  XSS 过滤器：类别 15 - SVG 动画属性</span></span>
<span class="line"><span>941260  XSS 过滤器：类别 16 - CSS 导入</span></span>
<span class="line"><span>941270  XSS 过滤器：类别 17 - HTML 实体编码</span></span>
<span class="line"><span>941280  XSS 过滤器：类别 18 - 编码绕过</span></span>
<span class="line"><span>941290  XSS 过滤器：类别 19 - JavaScript 关键字</span></span>
<span class="line"><span>941300  XSS 过滤器：类别 20 - 嵌入对象</span></span>
<span class="line"><span>941310  XSS 过滤器：US-ASCII 编码滥用</span></span>
<span class="line"><span>941320  XSS 过滤器：UTF-7 编码滥用</span></span>
<span class="line"><span>941330  XSS 过滤器：IE 过滤器</span></span>
<span class="line"><span>941340  XSS 过滤器：HTML5 标签</span></span>
<span class="line"><span>941350  XSS 过滤器：HTML5 属性</span></span>
<span class="line"><span>941360  XSS 过滤器：JavaScript 变量声明</span></span>
<span class="line"><span>941370  XSS 过滤器：JSON 注入</span></span>
<span class="line"><span>941380  XSS 过滤器：Angular 模板注入</span></span>
<span class="line"><span>941390  XSS 过滤器：Vue 模板注入</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-nginx-层面-xss-防护头" tabindex="-1"><a class="header-anchor" href="#_5-3-nginx-层面-xss-防护头"><span>5.3 Nginx 层面 XSS 防护头</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># XSS 防护 HTTP 响应头</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 内容安全策略（CSP）- 最强防线</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Content-Security-Policy \\</span></span>
<span class="line"><span style="color:#98C379;">        &quot;default-src &#39;self&#39;; \\</span></span>
<span class="line"><span style="color:#98C379;">         script-src &#39;self&#39; &#39;unsafe-inline&#39; &#39;unsafe-eval&#39; https://cdn.example.com; \\</span></span>
<span class="line"><span style="color:#98C379;">         style-src &#39;self&#39; &#39;unsafe-inline&#39; https://cdn.example.com; \\</span></span>
<span class="line"><span style="color:#98C379;">         img-src &#39;self&#39; data: https:; \\</span></span>
<span class="line"><span style="color:#98C379;">         font-src &#39;self&#39; https://cdn.example.com; \\</span></span>
<span class="line"><span style="color:#98C379;">         connect-src &#39;self&#39; https://api.example.com; \\</span></span>
<span class="line"><span style="color:#98C379;">         frame-ancestors &#39;none&#39;; \\</span></span>
<span class="line"><span style="color:#98C379;">         base-uri &#39;self&#39;; \\</span></span>
<span class="line"><span style="color:#98C379;">         form-action &#39;self&#39;&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # XSS 保护（IE/旧浏览器）</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-XSS-Protection </span><span style="color:#98C379;">&quot;1; mode=block&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 禁止 MIME 嗅探</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 禁止嵌入 iframe（防点击劫持）</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Referrer 策略</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Referrer-Policy </span><span style="color:#98C379;">&quot;strict-origin-when-cross-origin&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-自定义-xss-检测规则" tabindex="-1"><a class="header-anchor" href="#_5-4-自定义-xss-检测规则"><span>5.4 自定义 XSS 检测规则</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/modsecurity_xss_custom.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检测 HTML 事件处理器注入</span></span>
<span class="line"><span style="color:#C678DD;">SecRule</span><span style="color:#ABB2BF;"> ARGS|ARGS_NAMES|REQUEST_COOKIES \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;@</span><span style="color:#C678DD;">rx</span><span style="color:#ABB2BF;"> (?i)\\bon(?:error|load|click|mouseover|focus|blur|submit|change|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        input|keydown|keyup|keypress|abort|resize|scroll|unload)\\s*=&quot; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;id:992001,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     phase:2,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     block,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     capture,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     t:none,t:utf8toUnicode,t:urlDecodeUni,t:htmlEntityDecode,t:jsDecode,t:cssDecode,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     msg:&#39;</span><span style="color:#C678DD;">XSS</span><span style="color:#ABB2BF;"> Event Handler Injection Detected</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">Matched Data: %{TX.0} found within %{MATCHED_VAR_NAME}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">attack-xss</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">CRITICAL</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:&#39;</span><span style="color:#ABB2BF;">tx.xss_score=+%{tx.critical_anomaly_score}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:&#39;</span><span style="color:#ABB2BF;">tx.inbound_anomaly_score=+%{tx.critical_anomaly_score}</span><span style="color:#98C379;">&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 检测 JavaScript 伪协议</span></span>
<span class="line"><span style="color:#98C379;">SecRule ARGS|ARGS_NAMES \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;@rx (?i)(?:javascript|vbscript|data)\\s*:&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:992002,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:2,\\</span></span>
<span class="line"><span style="color:#98C379;">     block,\\</span></span>
<span class="line"><span style="color:#98C379;">     capture,\\</span></span>
<span class="line"><span style="color:#98C379;">     t:none,t:utf8toUnicode,t:urlDecodeUni,t:htmlEntityDecode,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;</span><span style="color:#ABB2BF;">XSS JavaScript URI Scheme Detected</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">Matched Data: %{TX.0} found within %{MATCHED_VAR_NAME}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">attack-xss</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">CRITICAL</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:&#39;</span><span style="color:#ABB2BF;">tx.xss_score=+%{tx.critical_anomaly_score}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:&#39;</span><span style="color:#ABB2BF;">tx.inbound_anomaly_score=+%{tx.critical_anomaly_score}</span><span style="color:#98C379;">&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 检测 SVG/MathML 注入</span></span>
<span class="line"><span style="color:#98C379;">SecRule ARGS \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;@rx (?i)&lt;(?:svg|math|animate|set|use|image|foreignobject|\\</span></span>
<span class="line"><span style="color:#98C379;">        annotation-xml|desc|title|metadata)\\b&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:992003,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:2,\\</span></span>
<span class="line"><span style="color:#98C379;">     block,\\</span></span>
<span class="line"><span style="color:#98C379;">     capture,\\</span></span>
<span class="line"><span style="color:#98C379;">     t:none,t:utf8toUnicode,t:urlDecodeUni,t:htmlEntityDecode,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;</span><span style="color:#ABB2BF;">XSS SVG/MathML Injection Detected</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">Matched Data: %{TX.0} found within %{MATCHED_VAR_NAME}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">attack-xss</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">CRITICAL</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:&#39;</span><span style="color:#ABB2BF;">tx.xss_score=+%{tx.critical_anomaly_score}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:&#39;</span><span style="color:#ABB2BF;">tx.inbound_anomaly_score=+%{tx.critical_anomaly_score}</span><span style="color:#98C379;">&#39;&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_6-文件上传与路径遍历防护" tabindex="-1"><a class="header-anchor" href="#_6-文件上传与路径遍历防护"><span>6. 文件上传与路径遍历防护</span></a></h2><h3 id="_6-1-文件上传攻击防护" tabindex="-1"><a class="header-anchor" href="#_6-1-文件上传攻击防护"><span>6.1 文件上传攻击防护</span></a></h3>`,19),i(d,{code:`eJyFkstOwkAYhfc8xaSuwYiXqDEuNG7doHFBWGAZBG1oUxoVxQSMKKiEbjDiBTXeQANCTPCCxpdhBvoWTqdTwk3sokl7er5z/r/jFcQN3ueWFbAwYwHkWpQE0e1x4pODWrVSez+sfV03Xt5wedcFrNZpsBCS4KwP8mvb3KwYUGBAseqvppblwWl8G8FX99wO5TQ/pLYwUuP4NV0vV1H2KAzmNhUGMXJwIo/KaaQm/+Vol9kWzowg8mtDTnz0gONPLgs1mOzW3CY/DBz+LXMAIxvdPaJSqju4g5Msa5l8C4dG252ckU3tNsknDdpWg+QmheqFBOfqBUodd1KG2yhBHxQEHWVblVYIgjKarRmEdiazNR73woD9iPap9mOo+NE9VQeoUYlpGZX1GGnrYXAaPwckzKzRmsSa0BxUTKBYjixXEWXo5IxHVDhFuznK0s5S+OKTNVOTbDE9aOozjlbwXqpWva1fR1mv0bZeS3DZoa+ouRo9k9odUHLLbkUvQKNRvGSkX2YBcYH6eRF9p1m4+TFzyuvEpkXOyLxgfsUf2GTODI5E2Rm9SKLDGzM1qIQEyM4f8PoFYXLA6+U9Hnunau+rDvdVR/qqo3+pxkYMkR+HY/yE5RcCy6nK`}),o[5]||=n(`<h3 id="_6-2-nginx-文件上传安全配置" tabindex="-1"><a class="header-anchor" href="#_6-2-nginx-文件上传安全配置"><span>6.2 Nginx 文件上传安全配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">upload.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 限制上传请求体大小</span></span>
<span class="line"><span style="color:#C678DD;">    client_max_body_size </span><span style="color:#D19A66;">10m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 上传接口</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/upload {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 仅允许 POST 方法</span></span>
<span class="line"><span style="color:#C678DD;">        limit_except</span><span style="color:#ABB2BF;"> POST {</span></span>
<span class="line"><span style="color:#C678DD;">            deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # ModSecurity 文件上传检查</span></span>
<span class="line"><span style="color:#C678DD;">        modsecurity</span><span style="color:#D19A66;"> on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        modsecurity_rules_file</span><span style="color:#ABB2BF;"> /etc/nginx/modsecurity.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://upload_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 上传文件存储目录 - 禁止执行</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /uploads/ {</span></span>
<span class="line"><span style="color:#C678DD;">        alias </span><span style="color:#ABB2BF;">/data/uploads/;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 禁止执行任何脚本</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">/uploads/.*\\.(php|php5|phtml|jsp|py|pl|cgi|sh|bash)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">            deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 强制 Content-Type</span></span>
<span class="line"><span style="color:#C678DD;">        types</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">            image/jpeg</span><span style="color:#ABB2BF;"> jpg jpeg;</span></span>
<span class="line"><span style="color:#D19A66;">            image/png</span><span style="color:#ABB2BF;"> png;</span></span>
<span class="line"><span style="color:#D19A66;">            image/gif</span><span style="color:#ABB2BF;"> gif;</span></span>
<span class="line"><span style="color:#D19A66;">            application/pdf</span><span style="color:#ABB2BF;"> pdf;</span></span>
<span class="line"><span style="color:#D19A66;">            text/plain</span><span style="color:#ABB2BF;"> txt;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 禁止未识别类型的默认处理</span></span>
<span class="line"><span style="color:#C678DD;">        default_type </span><span style="color:#ABB2BF;">application/octet-stream;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 禁止访问隐藏文件</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">/uploads/.*\\.(htaccess|git|env)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">            deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-文件上传-modsecurity-规则" tabindex="-1"><a class="header-anchor" href="#_6-3-文件上传-modsecurity-规则"><span>6.3 文件上传 ModSecurity 规则</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 限制允许的上传文件类型</span></span>
<span class="line"><span style="color:#C678DD;">SecRule</span><span style="color:#ABB2BF;"> FILES_NAMES|FILES \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;@</span><span style="color:#C678DD;">rx</span><span style="color:#ABB2BF;"> \\.(?:php[3457]?|phtml|pht|phps|shtml|jsp|jspx|jspf|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        asp|aspx|asa|cer|cdx|ashx|asmx|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        py|rb|pl|pm|cgi|sh|bash|bat|cmd|com|exe|dll|msi|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        war|jar|class|svg|htaccess|htpasswd)$&quot; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;id:993001,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     phase:2,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     deny,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     log,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     msg:&#39;</span><span style="color:#C678DD;">Dangerous</span><span style="color:#ABB2BF;"> File Upload Type Detected</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">File: %{FILES_NAMES}, Type: %{TX.0}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">attack-upload</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">CRITICAL</span><span style="color:#98C379;">&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 检测双扩展名攻击（如 shell.php.jpg）</span></span>
<span class="line"><span style="color:#98C379;">SecRule FILES_NAMES \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;@rx \\.(?:php[3457]?|phtml|pht|jsp|aspx?)\\.\\w{1,5}$&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:993002,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:2,\\</span></span>
<span class="line"><span style="color:#98C379;">     deny,\\</span></span>
<span class="line"><span style="color:#98C379;">     log,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;</span><span style="color:#ABB2BF;">Double Extension Upload Attack Detected</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">File: %{TX.0}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">attack-upload</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">CRITICAL</span><span style="color:#98C379;">&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 检测 WebShell 特征</span></span>
<span class="line"><span style="color:#98C379;">SecRule FILES \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;@rx (?:eval\\s*\\(|base64_decode\\s*\\(|system\\s*\\(|exec\\s*\\(|\\</span></span>
<span class="line"><span style="color:#98C379;">        passthru\\s*\\(|shell_exec\\s*\\(|popen\\s*\\(|proc_open\\s*\\(|\\</span></span>
<span class="line"><span style="color:#98C379;">        assert\\s*\\(|preg_replace\\s*\\(.*/e|create_function\\s*\\(|\\</span></span>
<span class="line"><span style="color:#98C379;">        call_user_func\\s*\\(|call_user_func_array\\s*\\(|\\</span></span>
<span class="line"><span style="color:#98C379;">        \\$</span><span style="color:#E06C75;">_</span><span style="color:#98C379;">(?:GET|POST|REQUEST|COOKIE|SERVER)\\s*\\[)&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:993003,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:2,\\</span></span>
<span class="line"><span style="color:#98C379;">     deny,\\</span></span>
<span class="line"><span style="color:#98C379;">     log,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;</span><span style="color:#ABB2BF;">WebShell Pattern Detected in Uploaded File</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">File: %{FILES_NAMES}, Match: %{TX.0}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">attack-upload</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">attack-webshell</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">CRITICAL</span><span style="color:#98C379;">&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 限制上传文件名长度</span></span>
<span class="line"><span style="color:#98C379;"># 注意：FILES_NAMES 是字符串变量，@gt 会将非数字字符串转为 0，</span></span>
<span class="line"><span style="color:#98C379;"># 因此 @gt 无法正确判断字符串长度。应使用 @rx 正则匹配长度。</span></span>
<span class="line"><span style="color:#98C379;">SecRule FILES_NAMES \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;@rx ^.{256,}&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:993004,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:2,\\</span></span>
<span class="line"><span style="color:#98C379;">     deny,\\</span></span>
<span class="line"><span style="color:#98C379;">     log,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;</span><span style="color:#ABB2BF;">Upload Filename Too Long</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">Filename: %{TX.0}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">attack-upload</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">WARNING</span><span style="color:#98C379;">&#39;&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-4-路径遍历防护" tabindex="-1"><a class="header-anchor" href="#_6-4-路径遍历防护"><span>6.4 路径遍历防护</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 路径遍历攻击示例：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># GET /../../etc/passwd</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># GET /%2e%2e/%2e%2e/etc/passwd</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># GET /....//....//etc/passwd</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># GET /%252e%252e/%252e%252e/etc/passwd (双重编码)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 层面路径遍历防护</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 如果 URI 中包含路径遍历特征，直接拒绝</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Nginx 本身会解码 URI 并规范化路径，所以 ../ 会被处理</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 但仍需防御编码绕过</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /files/ {</span></span>
<span class="line"><span style="color:#C678DD;">        alias </span><span style="color:#ABB2BF;">/data/files/;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 禁止访问上层目录</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # Nginx alias 本身有路径遍历防护（较新版本）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 额外防护：确保 URI 解码后不包含 ..</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> ~* \\.\\.) {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 403</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ModSecurity 路径遍历规则</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CRS 已有规则 930100-930110 检测路径遍历</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 增强规则：</span></span>
<span class="line"><span style="color:#C678DD;">SecRule</span><span style="color:#ABB2BF;"> REQUEST_URI|REQUEST_FILENAME \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;@</span><span style="color:#C678DD;">rx</span><span style="color:#ABB2BF;"> (?:\\.\\.(?:/|\\\\|\\%2f|\\%5c)|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        \\.(?:\\%2e|\\%252e)(?:/|\\\\|\\%2f|\\%5c)|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        /</span><span style="color:#D19A66;">etc/passwd</span><span style="color:#ABB2BF;">|/etc/shadow|/proc/self|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        \\\\\\./\\.\\./|/\\.\\\\\\.\\\\)&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:993100,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:1,\\</span></span>
<span class="line"><span style="color:#98C379;">     deny,\\</span></span>
<span class="line"><span style="color:#98C379;">     log,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;Path Traversal Attack Detected&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;Matched Data: %{TX.0} found within %{MATCHED_VAR_NAME}&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;attack-lfi&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;custom/1.0&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;CRITICAL&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:&#39;tx.lfi_score=+%{tx.critical_anomaly_score}&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:&#39;tx.inbound_anomaly_score=+%{tx.critical_anomaly_score}&#39;&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_7-bot-检测与爬虫管理" tabindex="-1"><a class="header-anchor" href="#_7-bot-检测与爬虫管理"><span>7. Bot 检测与爬虫管理</span></a></h2><h3 id="_7-1-bot-分类与管理策略" tabindex="-1"><a class="header-anchor" href="#_7-1-bot-分类与管理策略"><span>7.1 Bot 分类与管理策略</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Bot 分类：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 好爬虫（Good Bots）</span></span>
<span class="line"><span>   ┌───────────────────────────────────┐</span></span>
<span class="line"><span>   │ · Googlebot       → SEO 收录      │</span></span>
<span class="line"><span>   │ · Bingbot         → SEO 收录      │</span></span>
<span class="line"><span>   │ · Baiduspider     → SEO 收录      │</span></span>
<span class="line"><span>   │ · Slackbot        → 链接预览      │</span></span>
<span class="line"><span>   │ · Discordbot      → 链接预览      │</span></span>
<span class="line"><span>   │ 策略：允许 + 限速              │</span></span>
<span class="line"><span>   └───────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 坏爬虫（Bad Bots）</span></span>
<span class="line"><span>   ┌───────────────────────────────────┐</span></span>
<span class="line"><span>   │ · 爬取邮箱         → 垃圾邮件     │</span></span>
<span class="line"><span>   │ · 内容抓取         → 抄袭         │</span></span>
<span class="line"><span>   │ · 漏洞扫描         → 攻击前探     │</span></span>
<span class="line"><span>   │ · 竞争对手抓取     → 商业间谍     │</span></span>
<span class="line"><span>   │ 策略：识别 + 拦截              │</span></span>
<span class="line"><span>   └───────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 灰色爬虫（Grey Bots）</span></span>
<span class="line"><span>   ┌───────────────────────────────────┐</span></span>
<span class="line"><span>   │ · 监控服务         → 可能有价值   │</span></span>
<span class="line"><span>   │ · SEO 工具         → 数据采集     │</span></span>
<span class="line"><span>   │ · AI 训练爬虫      → 版权争议     │</span></span>
<span class="line"><span>   │ 策略：按需控制              │</span></span>
<span class="line"><span>   └───────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-nginx-bot-管理配置" tabindex="-1"><a class="header-anchor" href="#_7-2-nginx-bot-管理配置"><span>7.2 Nginx Bot 管理配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基于 User-Agent 的爬虫管理</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_user_agent</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">bot_category</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#98C379;">                                         &quot;human&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 好爬虫 - 允许但限速</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*Googlebot                                      </span><span style="color:#98C379;">&quot;good&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*bingbot                                        </span><span style="color:#98C379;">&quot;good&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*Baiduspider                                    </span><span style="color:#98C379;">&quot;good&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*YandexBot                                      </span><span style="color:#98C379;">&quot;good&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*DuckDuckBot                                    </span><span style="color:#98C379;">&quot;good&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*Slackbot                                       </span><span style="color:#98C379;">&quot;good&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*Discordbot                                     </span><span style="color:#98C379;">&quot;good&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*Twitterbot                                     </span><span style="color:#98C379;">&quot;good&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*facebookexternalhit                            </span><span style="color:#98C379;">&quot;good&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 坏爬虫 - 直接拦截</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*SemrushBot                                     </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*AhrefsBot                                      </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*MJ12bot                                        </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*DotBot                                         </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*rogerbot                                       </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*ScanBot                                        </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*Nmap                                           </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*nikto                                          </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*sqlmap                                         </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*w3af                                           </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*ZmEu                                           </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*dirbuster                                      </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*gobuster                                       </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # AI 爬虫</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*GPTBot                                         </span><span style="color:#98C379;">&quot;ai&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*ChatGPT-User                                   </span><span style="color:#98C379;">&quot;ai&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*CCBot                                          </span><span style="color:#98C379;">&quot;ai&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*Google-Extended                                </span><span style="color:#98C379;">&quot;ai&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*Amazonbot                                      </span><span style="color:#98C379;">&quot;ai&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*Bytespider                                     </span><span style="color:#98C379;">&quot;ai&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*ClaudeBot                                      </span><span style="color:#98C379;">&quot;ai&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 空白或可疑 UA</span></span>
<span class="line"><span style="color:#98C379;">    &quot;&quot;</span><span style="color:#98C379;">                                               &quot;suspicious&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*</span><span style="color:#E06C75;">^$</span><span style="color:#98C379;">                                             &quot;suspicious&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*</span><span style="color:#E06C75;">^Mozilla/\\d\\.\\d\\s*$</span><span style="color:#98C379;">                            &quot;suspicious&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 为不同类别设置不同限速</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">bot_category</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">bot_limit_rate</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#98C379;">    &quot;human&quot;</span><span style="color:#D19A66;">       0</span><span style="color:#ABB2BF;">;          </span><span style="color:#7F848E;font-style:italic;"># 不限速</span></span>
<span class="line"><span style="color:#98C379;">    &quot;good&quot;</span><span style="color:#ABB2BF;">        10r/s;      </span><span style="color:#7F848E;font-style:italic;"># 允许但限速</span></span>
<span class="line"><span style="color:#98C379;">    &quot;bad&quot;</span><span style="color:#ABB2BF;">         1r/m;       </span><span style="color:#7F848E;font-style:italic;"># 极低速率（等效拦截）</span></span>
<span class="line"><span style="color:#98C379;">    &quot;ai&quot;</span><span style="color:#ABB2BF;">          5r/m;       </span><span style="color:#7F848E;font-style:italic;"># 低速率</span></span>
<span class="line"><span style="color:#98C379;">    &quot;suspicious&quot;</span><span style="color:#ABB2BF;">  1r/m;       </span><span style="color:#7F848E;font-style:italic;"># 极低速率</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 拦截坏爬虫和可疑 UA</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">bot_category</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 403</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">bot_category</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;suspicious&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 403</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 好爬虫限速</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">bot_category</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;good&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">            set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">limit_rate</span><span style="color:#D19A66;"> 10k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # AI 爬虫返回简化内容</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">bot_category</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;ai&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &quot;This content is not available for AI training.&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # robots.txt 配置</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/robots.txt </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        default_type </span><span style="color:#ABB2BF;">text/plain;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &#39;User-agent: *</span></span>
<span class="line"><span style="color:#98C379;">Disallow: /admin/</span></span>
<span class="line"><span style="color:#98C379;">Disallow: /api/</span></span>
<span class="line"><span style="color:#98C379;">Disallow: /private/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">User-agent: GPTBot</span></span>
<span class="line"><span style="color:#98C379;">Disallow: /</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">User-agent: ChatGPT-User</span></span>
<span class="line"><span style="color:#98C379;">Disallow: /</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">User-agent: CCBot</span></span>
<span class="line"><span style="color:#98C379;">Disallow: /</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">User-agent: ClaudeBot</span></span>
<span class="line"><span style="color:#98C379;">Disallow: /</span></span>
<span class="line"><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-modsecurity-bot-检测规则" tabindex="-1"><a class="header-anchor" href="#_7-3-modsecurity-bot-检测规则"><span>7.3 ModSecurity Bot 检测规则</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 检测自动化工具特征</span></span>
<span class="line"><span style="color:#C678DD;">SecRule</span><span style="color:#ABB2BF;"> REQUEST_HEADERS:User-Agent \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;@</span><span style="color:#C678DD;">rx</span><span style="color:#ABB2BF;"> (?:sqlmap|nikto|nmap|masscan|dirbuster|gobuster|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        wfuzz|burpsuite|zap|arachni|w3af|acunetix|nessus|\\</span></span>
<span class="line"><span style="color:#ABB2BF;">        openvas|metasploit|havij|pangolin|commix)&quot; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;id:994001,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     phase:1,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     deny,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     log,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     msg:&#39;</span><span style="color:#C678DD;">Security</span><span style="color:#ABB2BF;"> Scanner User-Agent Detected</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">UA: %{TX.0}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">attack-bot</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">CRITICAL</span><span style="color:#98C379;">&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 检测无 User-Agent 或异常短 UA</span></span>
<span class="line"><span style="color:#98C379;">SecRule &amp;REQUEST_HEADERS:User-Agent &quot;@eq 0&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:994002,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:1,\\</span></span>
<span class="line"><span style="color:#98C379;">     deny,\\</span></span>
<span class="line"><span style="color:#98C379;">     log,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;</span><span style="color:#ABB2BF;">Missing User-Agent Header</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">attack-bot</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">WARNING</span><span style="color:#98C379;">&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 检测异常请求频率（Nginx limit_req 与 ModSecurity 联动）</span></span>
<span class="line"><span style="color:#98C379;">SecAction \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:994100,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:1,\\</span></span>
<span class="line"><span style="color:#98C379;">     pass,\\</span></span>
<span class="line"><span style="color:#98C379;">     nolog,\\</span></span>
<span class="line"><span style="color:#98C379;">     initcol:ip=%{remote_addr},\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:ip.request_count=+1&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">SecRule IP:REQUEST_COUNT &quot;@gt 100&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:994101,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:1,\\</span></span>
<span class="line"><span style="color:#98C379;">     deny,\\</span></span>
<span class="line"><span style="color:#98C379;">     log,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;</span><span style="color:#ABB2BF;">Excessive Requests from Single IP</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">Count: %{IP.REQUEST_COUNT}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">attack-bot</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">WARNING</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     expirevar:ip.request_count=60&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-4-验证码与-js-challenge" tabindex="-1"><a class="header-anchor" href="#_7-4-验证码与-js-challenge"><span>7.4 验证码与 JS Challenge</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基于 cookie 的 JS Challenge 机制</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 原理：浏览器执行 JS 设置 cookie，纯 HTTP 客户端无法通过</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # JS Challenge 页面</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/challenge.js </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        default_type </span><span style="color:#ABB2BF;">application/javascript;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">            document.cookie = &quot;__js_challenge=passed; path=/; max-age=3600&quot;;</span></span>
<span class="line"><span style="color:#98C379;">            window.location.reload();</span></span>
<span class="line"><span style="color:#98C379;">        &#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 需要验证的路径</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 检查是否通过 JS Challenge</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">cookie___js_challenge</span><span style="color:#ABB2BF;"> != </span><span style="color:#98C379;">&quot;passed&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &#39;&lt;html&gt;&lt;body&gt;&lt;script src=&quot;/challenge.js&quot;&gt;&lt;/script&gt;&lt;/body&gt;&lt;/html&gt;&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_8-ddos-防护" tabindex="-1"><a class="header-anchor" href="#_8-ddos-防护"><span>8. DDoS 防护</span></a></h2><h3 id="_8-1-nginx-层面-ddos-防护架构" tabindex="-1"><a class="header-anchor" href="#_8-1-nginx-层面-ddos-防护架构"><span>8.1 Nginx 层面 DDoS 防护架构</span></a></h3>`,19),i(d,{code:`eJx1k29r00Acx5/vVRwn+ETGYA4KIoMtxX90o6z1gQQpl+TahqW5rs2081EnaMfUdrLOdTCmD5QWBdc5VnG17s00l/RdeM2lWa9L8yTH/b6f+32/v1zSBnmpZlHBAsnlGcCe4qaSKaB8FixZFlLXZRiNkgSg9a5d6TpnXfvkHXzuCYdP7K4Mnd5Hp3tsn73mmvtKYW4x8WwVPDAI0cAceBqN8/U4tyDD/t8v7r99kUtKceBendDqN7d8aLd740gEydC+rDv1lsg8SiZDGkSUcHWC5TVIQS8KYjVcLEl+cF+MTW1GHFIUp7FZxDJczehmCQwav+ju135v3zkfMYI8thAAPCbrx5kxtWdJz+mWRExThsZwmVLZ2vPEOXrQHhzt2TudCS6p5zDZtGSoGjo2rZRCtK2UxTc53nlDDzu02hTZIJloNxLYDcYz3e4a3hi5LeAN3u30N2VI+bNTrYT69cBlZjJwnEMl7rqov8Jjh7ChTj9hBVtZohVH7XFJxXmel376Q88PbpDheZe0F8hUsSbDwY+Gc9kMzfoQk8dxGXqvea+Hfdx29t72ex+c3k/3qkK7k4hEyLrOhvgkAaQsMgxsZng0elFzmzv2UWvw/b17uj2BrSELr6C8DHMof8euNQaVGu+326LlbZaJXowjw0xCttgCmJ1dvL5L4PbofvByBF3X2cfzNxVv0xcyJMD9uipATMDT+T+GtWVg7+S0bhj3bqXTqqbNCyVlekkVS/8BSXC/xQ==`}),o[6]||=n(`<h3 id="_8-2-http-flood-防护" tabindex="-1"><a class="header-anchor" href="#_8-2-http-flood-防护"><span>8.2 HTTP Flood 防护</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># HTTP Flood 防护配置</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 定义请求限流区域（基于 IP + URI）</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=flood:100m rate=30r/s;</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;"> zone=uri_flood:200m rate=10r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 定义连接限流区域</span></span>
<span class="line"><span style="color:#C678DD;">    limit_conn_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=conn_limit:100m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 定义请求方法限流</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=login_limit:10m rate=5r/m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 全局限流</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=flood burst=50 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=uri_flood burst=20 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">        limit_conn </span><span style="color:#ABB2BF;">conn_limit </span><span style="color:#D19A66;">50</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 登录接口单独限流</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/login {</span></span>
<span class="line"><span style="color:#C678DD;">            limit_req </span><span style="color:#ABB2BF;">zone=login_limit burst=3 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">            limit_req_status </span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 限流后的自定义错误页面</span></span>
<span class="line"><span style="color:#C678DD;">        error_page </span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;"> @rate_limited;</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> @rate_limited {</span></span>
<span class="line"><span style="color:#C678DD;">            default_type </span><span style="color:#ABB2BF;">application/json;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 429</span><span style="color:#98C379;"> &#39;{&quot;error&quot;:&quot;Too Many Requests&quot;,&quot;retry_after&quot;:60}&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 慢速攻击防护</span></span>
<span class="line"><span style="color:#C678DD;">        client_body_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        client_header_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        send_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        keepalive_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 限制请求行和请求头大小</span></span>
<span class="line"><span style="color:#C678DD;">        client_header_buffer_size </span><span style="color:#D19A66;">1k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        large_client_header_buffers </span><span style="color:#D19A66;">4</span><span style="color:#D19A66;"> 8k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-slowloris-攻击防护" tabindex="-1"><a class="header-anchor" href="#_8-3-slowloris-攻击防护"><span>8.3 Slowloris 攻击防护</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Slowloris 攻击原理：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 攻击者发送不完整的 HTTP 请求头，占用连接资源</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 每隔一段时间发送一个头部行，保持连接不超时</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 逐渐耗尽 Nginx 的 worker_connections</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 防护配置</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 关键超时设置</span></span>
<span class="line"><span style="color:#C678DD;">    client_header_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 请求头超时（默认60s，调短）</span></span>
<span class="line"><span style="color:#C678DD;">    client_body_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;      </span><span style="color:#7F848E;font-style:italic;"># 请求体超时</span></span>
<span class="line"><span style="color:#C678DD;">    send_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;             </span><span style="color:#7F848E;font-style:italic;"># 响应发送超时</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 限制请求头大小（防止超大头部攻击）</span></span>
<span class="line"><span style="color:#C678DD;">    client_header_buffer_size </span><span style="color:#D19A66;">1k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    large_client_header_buffers </span><span style="color:#D19A66;">4</span><span style="color:#D19A66;"> 4k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 关闭不需要的连接</span></span>
<span class="line"><span style="color:#C678DD;">    reset_timedout_connection </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 超时后发送 RST</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 限制 keepalive 请求次数</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_requests </span><span style="color:#D19A66;">100</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 代理超时设置</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_read_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_send_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-4-基于-geoip-的-ddos-流量清洗" tabindex="-1"><a class="header-anchor" href="#_8-4-基于-geoip-的-ddos-流量清洗"><span>8.4 基于 GeoIP 的 DDoS 流量清洗</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 当 DDoS 攻击来自特定国家/地区时，可以快速阻断</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 加载 GeoIP2 模块</span></span>
<span class="line"><span style="color:#C678DD;">    geoip2</span><span style="color:#ABB2BF;"> /usr/share/GeoIP/GeoLite2-Country.mmdb {</span></span>
<span class="line"><span style="color:#C678DD;">        auto_reload</span><span style="color:#D19A66;"> 5m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        $</span><span style="color:#C678DD;">geoip2_data_country_code</span><span style="color:#ABB2BF;"> country iso_code;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 定义允许的国家/地区</span></span>
<span class="line"><span style="color:#C678DD;">    map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">geoip2_data_country_code</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">allowed_country</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">        default</span><span style="color:#D19A66;">         0</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 默认不允许</span></span>
<span class="line"><span style="color:#ABB2BF;">        CN              </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 中国</span></span>
<span class="line"><span style="color:#ABB2BF;">        HK              </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 香港</span></span>
<span class="line"><span style="color:#ABB2BF;">        TW              </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 台湾</span></span>
<span class="line"><span style="color:#ABB2BF;">        MO              </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 澳门</span></span>
<span class="line"><span style="color:#ABB2BF;">        US              </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 美国</span></span>
<span class="line"><span style="color:#ABB2BF;">        JP              </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 日本</span></span>
<span class="line"><span style="color:#ABB2BF;">        SG              </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 新加坡</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # DDoS 紧急模式开关（通过变量控制）</span></span>
<span class="line"><span style="color:#C678DD;">        set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">ddos_mode</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 0=正常，1=紧急</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 紧急模式下仅允许特定国家</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">ddos_mode</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">            set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">country_check</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">allowed_country</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 非紧急模式允许所有</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (!$</span><span style="color:#E06C75;">ddos_mode</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">            set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">country_check</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">country_check</span><span style="color:#ABB2BF;"> = 0) {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 403</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_9-自定义-waf-规则编写" tabindex="-1"><a class="header-anchor" href="#_9-自定义-waf-规则编写"><span>9. 自定义 WAF 规则编写</span></a></h2><h3 id="_9-1-secrule-语法详解" tabindex="-1"><a class="header-anchor" href="#_9-1-secrule-语法详解"><span>9.1 SecRule 语法详解</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>SecRule 语法：</span></span>
<span class="line"><span>SecRule VARIABLES OPERATOR [ACTIONS]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│ VARIABLES（检测变量）                                    │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│ ARGS              所有请求参数（GET+POST）              │</span></span>
<span class="line"><span>│ ARGS_NAMES        请求参数名                            │</span></span>
<span class="line"><span>│ ARGS_GET          URL 查询参数                          │</span></span>
<span class="line"><span>│ ARGS_GET_NAMES    URL 查询参数名                        │</span></span>
<span class="line"><span>│ ARGS_POST         POST 请求体参数                      │</span></span>
<span class="line"><span>│ ARGS_POST_NAMES   POST 请求体参数名                    │</span></span>
<span class="line"><span>│ REQUEST_URI       完整请求 URI                          │</span></span>
<span class="line"><span>│ REQUEST_FILENAME  请求文件名（不含查询字符串）          │</span></span>
<span class="line"><span>│ REQUEST_HEADERS   请求头                               │</span></span>
<span class="line"><span>│ REQUEST_METHOD    请求方法                              │</span></span>
<span class="line"><span>│ REQUEST_COOKIES   请求 Cookie                          │</span></span>
<span class="line"><span>│ REQUEST_BODY      完整请求体                           │</span></span>
<span class="line"><span>│ FILES             上传文件内容                          │</span></span>
<span class="line"><span>│ FILES_NAMES       上传文件名                            │</span></span>
<span class="line"><span>│ FILES_SIZES       上传文件大小                          │</span></span>
<span class="line"><span>│ REMOTE_ADDR       客户端 IP                             │</span></span>
<span class="line"><span>│ REMOTE_PORT       客户端端口                            │</span></span>
<span class="line"><span>│ TX                事务变量                              │</span></span>
<span class="line"><span>│ IP                IP 集合变量                           │</span></span>
<span class="line"><span>│ SESSION           会话变量                              │</span></span>
<span class="line"><span>│ GEO               地理位置变量                          │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│ OPERATOR（匹配操作符）                                   │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│ @rx               正则表达式匹配                        │</span></span>
<span class="line"><span>│ @eq               等于                                 │</span></span>
<span class="line"><span>│ @gt               大于                                 │</span></span>
<span class="line"><span>│ @lt               小于                                 │</span></span>
<span class="line"><span>│ @ge               大于等于                              │</span></span>
<span class="line"><span>│ @le               小于等于                              │</span></span>
<span class="line"><span>│ @contains         包含                                 │</span></span>
<span class="line"><span>│ @startsWith       以...开头                             │</span></span>
<span class="line"><span>│ @endsWith         以...结尾                             │</span></span>
<span class="line"><span>│ @within           在...范围内                          │</span></span>
<span class="line"><span>│ @ipMatch          IP 匹配（支持 CIDR）                 │</span></span>
<span class="line"><span>│ @ipMatchF         IP 匹配（从文件读取）                 │</span></span>
<span class="line"><span>│ @pm               并行匹配（多个字符串）                │</span></span>
<span class="line"><span>│ @pmf              并行匹配（从文件读取）                │</span></span>
<span class="line"><span>│ @detectSQLi       SQL 注入检测（libinjection）          │</span></span>
<span class="line"><span>│ @detectXSS        XSS 检测（libinjection）             │</span></span>
<span class="line"><span>│ @validateUrl      URL 格式验证                          │</span></span>
<span class="line"><span>│ @validateDTD      DTD 验证                              │</span></span>
<span class="line"><span>│ @validateSchema   Schema 验证                          │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│ ACTIONS（执行动作）                                      │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│ pass              放行                                 │</span></span>
<span class="line"><span>│ deny / block      拦截                                 │</span></span>
<span class="line"><span>│ drop              断开连接                              │</span></span>
<span class="line"><span>│ redirect          重定向                                │</span></span>
<span class="line"><span>│ log               记录日志                              │</span></span>
<span class="line"><span>│ auditlog          记录审计日志                          │</span></span>
<span class="line"><span>│ nolog             不记录日志                            │</span></span>
<span class="line"><span>│ status            设置响应状态码                        │</span></span>
<span class="line"><span>│ capture           捕获匹配内容                         │</span></span>
<span class="line"><span>│ setvar            设置变量                              │</span></span>
<span class="line"><span>│ expirevar         设置过期变量                          │</span></span>
<span class="line"><span>│ tag               设置标签                              │</span></span>
<span class="line"><span>│ msg               设置消息                              │</span></span>
<span class="line"><span>│ severity          设置严重级别                          │</span></span>
<span class="line"><span>│ id                规则 ID                               │</span></span>
<span class="line"><span>│ phase             处理阶段（1-5）                       │</span></span>
<span class="line"><span>│ t:xxx             数据转换                              │</span></span>
<span class="line"><span>│ skip / skipAfter  跳过规则                              │</span></span>
<span class="line"><span>│ ctl               控制指令                              │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│ TRANSFORMATION（数据转换）                               │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│ t:none            不转换                               │</span></span>
<span class="line"><span>│ t:lowercase       转小写                               │</span></span>
<span class="line"><span>│ t:urlDecode       URL 解码                              │</span></span>
<span class="line"><span>│ t:urlDecodeUni    URL Unicode 解码                      │</span></span>
<span class="line"><span>│ t:htmlEntityDecode HTML 实体解码                       │</span></span>
<span class="line"><span>│ t:jsDecode        JS 解码                              │</span></span>
<span class="line"><span>│ t:cssDecode       CSS 解码                             │</span></span>
<span class="line"><span>│ t:normalizePath   路径规范化                           │</span></span>
<span class="line"><span>│ t:removeNulls     移除空字节                           │</span></span>
<span class="line"><span>│ t:removeWhitespace 移除空白                            │</span></span>
<span class="line"><span>│ t:replaceNulls    替换空字节                            │</span></span>
<span class="line"><span>│ t:compressWhitespace 压缩空白                           │</span></span>
<span class="line"><span>│ t:utf8toUnicode   UTF-8 转 Unicode                    │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-处理阶段-phase" tabindex="-1"><a class="header-anchor" href="#_9-2-处理阶段-phase"><span>9.2 处理阶段（Phase）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ModSecurity 5 个处理阶段：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Phase 1: 请求头阶段（Request Headers）</span></span>
<span class="line"><span>┌─────────────────────────────────────┐</span></span>
<span class="line"><span>│ 时机：读取请求头之后                  │</span></span>
<span class="line"><span>│ 可用：REQUEST_HEADERS, REMOTE_ADDR  │</span></span>
<span class="line"><span>│       REQUEST_METHOD, REQUEST_URI   │</span></span>
<span class="line"><span>│ 不可用：请求体（尚未读取）           │</span></span>
<span class="line"><span>│ 用途：IP 黑名单、方法过滤、头部检查  │</span></span>
<span class="line"><span>│ 性能：开销最小，最早拦截             │</span></span>
<span class="line"><span>└─────────────────────────────────────┘</span></span>
<span class="line"><span>          ↓</span></span>
<span class="line"><span>Phase 2: 请求体阶段（Request Body）</span></span>
<span class="line"><span>┌─────────────────────────────────────┐</span></span>
<span class="line"><span>│ 时机：读取请求体之后                  │</span></span>
<span class="line"><span>│ 可用：ARGS, REQUEST_BODY, FILES     │</span></span>
<span class="line"><span>│ 用途：SQL注入、XSS、文件上传检查     │</span></span>
<span class="line"><span>│ 性能：开销较大（需要解析请求体）     │</span></span>
<span class="line"><span>└─────────────────────────────────────┘</span></span>
<span class="line"><span>          ↓</span></span>
<span class="line"><span>Phase 3: 响应头阶段（Response Headers）</span></span>
<span class="line"><span>┌─────────────────────────────────────┐</span></span>
<span class="line"><span>│ 时机：收到后端响应头之后              │</span></span>
<span class="line"><span>│ 可用：RESPONSE_HEADERS, STATUS      │</span></span>
<span class="line"><span>│ 用途：响应头检查、状态码过滤         │</span></span>
<span class="line"><span>└─────────────────────────────────────┘</span></span>
<span class="line"><span>          ↓</span></span>
<span class="line"><span>Phase 4: 响应体阶段（Response Body）</span></span>
<span class="line"><span>┌─────────────────────────────────────┐</span></span>
<span class="line"><span>│ 时机：收到后端响应体之后              │</span></span>
<span class="line"><span>│ 可用：RESPONSE_BODY                 │</span></span>
<span class="line"><span>│ 用途：信息泄露检测、响应体过滤       │</span></span>
<span class="line"><span>│ 性能：开销最大                       │</span></span>
<span class="line"><span>└─────────────────────────────────────┘</span></span>
<span class="line"><span>          ↓</span></span>
<span class="line"><span>Phase 5: 日志阶段（Logging）</span></span>
<span class="line"><span>┌─────────────────────────────────────┐</span></span>
<span class="line"><span>│ 时机：请求处理完成后                  │</span></span>
<span class="line"><span>│ 可用：所有变量                       │</span></span>
<span class="line"><span>│ 用途：审计日志、统计记录             │</span></span>
<span class="line"><span>│ 注意：此阶段无法拦截请求             │</span></span>
<span class="line"><span>└─────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-自定义规则实战" tabindex="-1"><a class="header-anchor" href="#_9-3-自定义规则实战"><span>9.3 自定义规则实战</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 规则 1：IP 黑名单 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从文件加载 IP 黑名单</span></span>
<span class="line"><span style="color:#C678DD;">SecRule</span><span style="color:#ABB2BF;"> REMOTE_ADDR </span><span style="color:#98C379;">&quot;@ipMatchF /etc/nginx/waf/ip_blacklist.txt&quot;</span><span style="color:#ABB2BF;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;id:995001,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     phase:1,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     deny,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     log,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     msg:&#39;</span><span style="color:#C678DD;">IP</span><span style="color:#ABB2BF;"> Blacklisted</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">IP: %{REMOTE_ADDR}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">access-control</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">CRITICAL</span><span style="color:#98C379;">&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># ip_blacklist.txt 示例内容：</span></span>
<span class="line"><span style="color:#98C379;"># 192.168.1.100</span></span>
<span class="line"><span style="color:#98C379;"># 10.0.0.0/8</span></span>
<span class="line"><span style="color:#98C379;"># 203.0.113.0/24</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># ===== 规则 2：URL 白名单 =====</span></span>
<span class="line"><span style="color:#98C379;"># 对特定 URL 跳过 WAF 检查</span></span>
<span class="line"><span style="color:#98C379;">SecRule REQUEST_FILENAME &quot;@streq /api/health&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:995010,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:1,\\</span></span>
<span class="line"><span style="color:#98C379;">     pass,\\</span></span>
<span class="line"><span style="color:#98C379;">     nolog,\\</span></span>
<span class="line"><span style="color:#98C379;">     ctl:ruleRemoveById=941000-942999,\\</span></span>
<span class="line"><span style="color:#98C379;">     ctl:ruleRemoveById=930000-933999&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># ===== 规则 3：敏感信息泄露检测 =====</span></span>
<span class="line"><span style="color:#98C379;"># 检测响应体中的敏感信息</span></span>
<span class="line"><span style="color:#98C379;">SecRule RESPONSE_BODY \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;@rx (?:password\\s*[:=]\\s*\\S+|api[_-]?key\\s*[:=]\\s*\\S+|\\</span></span>
<span class="line"><span style="color:#98C379;">        secret\\s*[:=]\\s*\\S+|token\\s*[:=]\\s*eyJ[a-zA-Z0-9])&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:995020,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:4,\\</span></span>
<span class="line"><span style="color:#98C379;">     deny,\\</span></span>
<span class="line"><span style="color:#98C379;">     log,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;</span><span style="color:#ABB2BF;">Sensitive Information Leak Detected</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">Matched Data: %{TX.0}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">data-leak</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">CRITICAL</span><span style="color:#98C379;">&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># ===== 规则 4：异常请求方法检测 =====</span></span>
<span class="line"><span style="color:#98C379;"># 仅允许常见 HTTP 方法</span></span>
<span class="line"><span style="color:#98C379;">SecRule REQUEST_METHOD &quot;!@pm GET HEAD POST PUT DELETE PATCH OPTIONS&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:995030,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:1,\\</span></span>
<span class="line"><span style="color:#98C379;">     deny,\\</span></span>
<span class="line"><span style="color:#98C379;">     log,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;</span><span style="color:#ABB2BF;">Unusual HTTP Method Detected</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">Method: %{REQUEST_METHOD}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">protocol-violation</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">WARNING</span><span style="color:#98C379;">&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># ===== 规则 5：请求参数长度限制 =====</span></span>
<span class="line"><span style="color:#98C379;"># 防止超长参数攻击（缓冲区溢出尝试）</span></span>
<span class="line"><span style="color:#98C379;"># 注意：ARGS_NAMES 是字符串变量，@gt 会将非数字字符串转为 0，</span></span>
<span class="line"><span style="color:#98C379;"># 应使用 @rx 正则匹配长度</span></span>
<span class="line"><span style="color:#98C379;">SecRule ARGS_NAMES \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;@rx ^.{101,}&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:995040,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:2,\\</span></span>
<span class="line"><span style="color:#98C379;">     deny,\\</span></span>
<span class="line"><span style="color:#98C379;">     log,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;</span><span style="color:#ABB2BF;">Parameter Name Too Long</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">Name: %{TX.0}, Length: %{TX.0_length}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">protocol-violation</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">WARNING</span><span style="color:#98C379;">&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">SecRule ARGS \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;@rx ^.{65536,}&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:995041,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:2,\\</span></span>
<span class="line"><span style="color:#98C379;">     deny,\\</span></span>
<span class="line"><span style="color:#98C379;">     log,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;</span><span style="color:#ABB2BF;">Parameter Value Too Long</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">Name: %{MATCHED_VAR_NAME}, Length: %{TX.0_length}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">protocol-violation</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">WARNING</span><span style="color:#98C379;">&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># ===== 规则 6：异常 Content-Type 检测 =====</span></span>
<span class="line"><span style="color:#98C379;">SecRule REQUEST_HEADERS:Content-Type \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;!@rx ^(?:application/x-www-form-urlencoded|multipart/form-data|\\</span></span>
<span class="line"><span style="color:#98C379;">        text/plain|application/json|application/xml|text/xml|\\</span></span>
<span class="line"><span style="color:#98C379;">        application/soap+xml|application/octet-stream)&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:995050,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:1,\\</span></span>
<span class="line"><span style="color:#98C379;">     deny,\\</span></span>
<span class="line"><span style="color:#98C379;">     log,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;</span><span style="color:#ABB2BF;">Unusual Content-Type Detected</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">Content-Type: %{TX.0}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">protocol-violation</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">WARNING</span><span style="color:#98C379;">&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># ===== 规则 7：地理位置限制 =====</span></span>
<span class="line"><span style="color:#98C379;"># 仅允许中国 IP 访问</span></span>
<span class="line"><span style="color:#98C379;">SecRule GEO:COUNTRY_CODE &quot;!@streq CN&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:995060,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:1,\\</span></span>
<span class="line"><span style="color:#98C379;">     deny,\\</span></span>
<span class="line"><span style="color:#98C379;">     log,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;</span><span style="color:#ABB2BF;">Access Denied - Country Not Allowed</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">Country: %{GEO:COUNTRY_CODE}, IP: %{REMOTE_ADDR}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">geo-restriction</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">NOTICE</span><span style="color:#98C379;">&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># ===== 规则 8：会话异常检测 =====</span></span>
<span class="line"><span style="color:#98C379;"># 同一 IP 在短时间内访问过多不同 URL</span></span>
<span class="line"><span style="color:#98C379;">SecAction \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:995070,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:1,\\</span></span>
<span class="line"><span style="color:#98C379;">     pass,\\</span></span>
<span class="line"><span style="color:#98C379;">     nolog,\\</span></span>
<span class="line"><span style="color:#98C379;">     initcol:ip=%{remote_addr},\\</span></span>
<span class="line"><span style="color:#98C379;">     setvar:ip.url_count=+1&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">SecRule IP:URL_COUNT &quot;@gt 500&quot; \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;id:995071,\\</span></span>
<span class="line"><span style="color:#98C379;">     phase:1,\\</span></span>
<span class="line"><span style="color:#98C379;">     deny,\\</span></span>
<span class="line"><span style="color:#98C379;">     log,\\</span></span>
<span class="line"><span style="color:#98C379;">     msg:&#39;</span><span style="color:#ABB2BF;">Excessive URL Scanning Detected</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     logdata:&#39;</span><span style="color:#ABB2BF;">IP: %{REMOTE_ADDR}, URL Count: %{IP.URL_COUNT}</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     tag:&#39;</span><span style="color:#ABB2BF;">attack-scanning</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     ver:&#39;</span><span style="color:#ABB2BF;">custom/1.0</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     severity:&#39;</span><span style="color:#ABB2BF;">CRITICAL</span><span style="color:#98C379;">&#39;,\\</span></span>
<span class="line"><span style="color:#98C379;">     expirevar:ip.url_count=300&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_10-waf-运维与调优" tabindex="-1"><a class="header-anchor" href="#_10-waf-运维与调优"><span>10. WAF 运维与调优</span></a></h2><h3 id="_10-1-误报处理流程" tabindex="-1"><a class="header-anchor" href="#_10-1-误报处理流程"><span>10.1 误报处理流程</span></a></h3>`,17),i(d,{code:`eJx1k11v0lAYx+/3KU7q9SADZpwxM2yEhMQLsmC8ONkFlCLExhlgW4yYgGMMWHiZAQNsoWxCxZhRYmYcb+7L8Jy238LS02mL8Vz2+T3/5+X/NMLvHbLRYDyJAlsrSHtunosn8Qu3F8FZUbkWd9Hq6ibajnLsq3ekIUFVVCSJFHtP3+u4HtCRlBZNIW+QT3D+vUQsGTvgMEWhm5Wrud1lXpNKoUB8/y8uXwgwaJPaBE4m90l6VmI/9DIefBNdkmfM+uRHRu6fMrTM4nn9a5hZsyFlMIRZnaKKJJKj4yehuH1T+ZKFfNPnsT/feWaHygdSH1qSHZhx2BDkc6RdNeqUBTjv6Mnz2xYUL9X0RPl1pl6kFTFjp3rK3cl8XJ7f9khnapFzYqcNqekCOf1q9PtpBNOKBQlixm1D5OcEih25OYNqCUp1vZ76MQ/SSC6MYND6T7/OEGa2tGmHR6R+Q5uhrd4NSG1Erj9rH+xqIw/ppcZYzGzbkCxm5FrflEeL+TxWOIwZj9Zipap+ayiSBueoJO2yWZrPyqReIVkBxqKRyb0OL7loMZ3513VTyYBm4h8PKUM9NCMOvHBqmNFmoAjy+c1xY/ctWejBoADHfTi/UhuCGXFhlw1pq4JuiUwr5KZtDq7jdU3/qg3Tsdr4Topduqal8Sy3qZ/4DncQ4w4xo+2RLIa8JEKP3h49Rl3FGNa8E1OysbnkW54z/p1IjOcfP4hEIhusyxS0VqcQ+4h7yG6YIEuReyE2HHas/AYGNMTt`}),o[7]||=n(`<h3 id="_10-2-误报排除规则" tabindex="-1"><a class="header-anchor" href="#_10-2-误报排除规则"><span>10.2 误报排除规则</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/waf/exclusions.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 全局排除 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 对特定 URL 完全跳过 WAF</span></span>
<span class="line"><span style="color:#C678DD;">SecRule</span><span style="color:#ABB2BF;"> REQUEST_FILENAME </span><span style="color:#98C379;">&quot;@beginsWith /api/internal/&quot;</span><span style="color:#ABB2BF;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;id:996001,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     phase:1,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     pass,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     nolog,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     ctl:ruleRemoveById=1-999999&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 部分排除 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 对搜索接口排除 SQL 注入规则（业务需要搜索特殊字符）</span></span>
<span class="line"><span style="color:#C678DD;">SecRule</span><span style="color:#ABB2BF;"> REQUEST_FILENAME </span><span style="color:#98C379;">&quot;@streq /api/search&quot;</span><span style="color:#ABB2BF;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;id:996010,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     phase:1,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     pass,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     nolog,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     ctl:ruleRemoveById=942100-942490&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 对 Markdown 编辑器排除 XSS 规则（需要保存 HTML 内容）</span></span>
<span class="line"><span style="color:#C678DD;">SecRule</span><span style="color:#ABB2BF;"> REQUEST_FILENAME </span><span style="color:#98C379;">&quot;@streq /api/content&quot;</span><span style="color:#ABB2BF;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;id:996011,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     phase:1,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     pass,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     nolog,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     ctl:ruleRemoveById=941100-941390&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 参数级排除 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 对特定参数排除特定规则</span></span>
<span class="line"><span style="color:#C678DD;">SecRule</span><span style="color:#ABB2BF;"> ARGS_NAMES </span><span style="color:#98C379;">&quot;@streq html_content&quot;</span><span style="color:#ABB2BF;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;id:996020,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     phase:1,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     pass,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     nolog,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     ctl:ruleRemoveById=941100-941390,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     ctl:ruleRemoveById=942100-942490&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== IP 白名单 =====</span></span>
<span class="line"><span style="color:#C678DD;">SecRule</span><span style="color:#ABB2BF;"> REMOTE_ADDR </span><span style="color:#98C379;">&quot;@ipMatch 10.0.0.0/8,172.16.0.0/12,192.168.0.0/16&quot;</span><span style="color:#ABB2BF;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;id:996030,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     phase:1,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     pass,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     nolog,\\</span></span>
<span class="line"><span style="color:#ABB2BF;">     ctl:ruleRemoveById=1-999999&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-waf-日志分析" tabindex="-1"><a class="header-anchor" href="#_10-3-waf-日志分析"><span>10.3 WAF 日志分析</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== ModSecurity 日志分析 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看今日 WAF 拦截统计</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%d/%b/%Y)&quot;</span><span style="color:#98C379;"> /var/log/modsecurity/audit.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    grep</span><span style="color:#D19A66;"> -oP</span><span style="color:#98C379;"> &#39;msg:\\x27[^\\x27]+\\x27&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看被拦截最多的 IP</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;403&quot;</span><span style="color:#98C379;"> /var/log/nginx/access.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    awk</span><span style="color:#98C379;"> &#39;{print $1}&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看特定规则的触发情况</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;id </span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">942100</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">&quot;</span><span style="color:#98C379;"> /var/log/modsecurity/audit.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    grep</span><span style="color:#D19A66;"> -oP</span><span style="color:#98C379;"> &#39;unique_id &quot;\\K[^&quot;]+&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 导出最近 1 小时的 SQL 注入告警</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> start=&quot;$(</span><span style="color:#61AFEF;">date</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> &#39;1 hour ago&#39; &#39;+%d/%b/%Y:%H:%M&#39;)&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -v</span><span style="color:#98C379;"> end=&quot;$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%d/%b/%Y:%H:%M&#39;)&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &#39;$0 &gt;= start &amp;&amp; $0 &lt;= end&#39;</span><span style="color:#98C379;"> /var/log/modsecurity/audit.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    grep</span><span style="color:#98C379;"> &quot;942&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 自动化误报检测 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查找频繁触发的规则（可能是误报）</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -oP</span><span style="color:#98C379;"> &#39;id &quot;\\K\\d+&#39;</span><span style="color:#98C379;"> /var/log/modsecurity/audit.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看特定规则匹配的内容</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;942100&quot;</span><span style="color:#98C379;"> /var/log/modsecurity/audit.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    grep</span><span style="color:#D19A66;"> -oP</span><span style="color:#98C379;"> &#39;Matched Data: \\K[^ ]+&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-4-waf-性能优化" tabindex="-1"><a class="header-anchor" href="#_10-4-waf-性能优化"><span>10.4 WAF 性能优化</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/modsecurity_performance.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 性能优化策略 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 静态资源跳过 WAF</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    modsecurity</span><span style="color:#D19A66;"> off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, no-transform&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 健康检查跳过 WAF</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/health </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    modsecurity</span><span style="color:#D19A66;"> off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &quot;OK&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 减少不必要的响应体检查</span></span>
<span class="line"><span style="color:#C678DD;">SecResponseBodyAccess</span><span style="color:#ABB2BF;"> Off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 限制响应体检查大小</span></span>
<span class="line"><span style="color:#C678DD;">SecResponseBodyLimit</span><span style="color:#D19A66;"> 524288</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 限制请求体大小</span></span>
<span class="line"><span style="color:#C678DD;">SecRequestBodyLimit</span><span style="color:#D19A66;"> 10485760</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 关闭调试日志</span></span>
<span class="line"><span style="color:#C678DD;">SecDebugLogLevel</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 7. 优化日志写入</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用缓冲减少磁盘 I/O</span></span>
<span class="line"><span style="color:#C678DD;">SecAuditLogType</span><span style="color:#ABB2BF;"> Concurrent</span></span>
<span class="line"><span style="color:#C678DD;">SecAuditLogStorageDir</span><span style="color:#ABB2BF;"> /var/log/modsecurity/audit/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 8. 使用更高效的日志格式</span></span>
<span class="line"><span style="color:#C678DD;">SecAuditLogParts</span><span style="color:#ABB2BF;"> AB</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 9. 规则优化：先执行快速规则</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Phase 1 规则应在 Phase 2 之前做尽可能多的过滤</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># IP 黑名单放在 Phase 1，减少后续处理开销</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 10. 规则优化：合并相似规则</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 @pm 代替多个 @rx</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 @ipMatchF 代替多个 @ipMatch</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-5-waf-规则热更新" tabindex="-1"><a class="header-anchor" href="#_10-5-waf-规则热更新"><span>10.5 WAF 规则热更新</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ModSecurity 规则热更新（无需重启 Nginx）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 更新规则文件</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> vim</span><span style="color:#98C379;"> /etc/nginx/waf/custom_rules.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 验证配置语法</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 重新加载 Nginx（优雅重载）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 自动化规则更新脚本 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/waf-update.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -euo</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">CRS_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/nginx/crs&quot;</span></span>
<span class="line"><span style="color:#E06C75;">WAF_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/nginx/waf&quot;</span></span>
<span class="line"><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/backups/waf&quot;</span></span>
<span class="line"><span style="color:#E06C75;">LOG_FILE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/waf-update.log&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;) - Starting WAF update&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$LOG_FILE</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 备份当前规则</span></span>
<span class="line"><span style="color:#E06C75;">backup_name</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;waf-rules-$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d%H%M%S).tar.gz&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">tar</span><span style="color:#D19A66;"> -czf</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">backup_name</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -C</span><span style="color:#98C379;"> /etc/nginx</span><span style="color:#98C379;"> crs</span><span style="color:#98C379;"> waf</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Backup created: \${</span><span style="color:#E06C75;">backup_name</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$LOG_FILE</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 更新 CRS</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$CRS_DIR</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> pull</span><span style="color:#98C379;"> origin</span><span style="color:#98C379;"> v4.0/master</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 &gt;&gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$LOG_FILE</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证配置</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 &gt;&gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$LOG_FILE</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;) - WAF update completed successfully&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$LOG_FILE</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;) - ERROR: Config test failed, rolling back&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$LOG_FILE</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 回滚</span></span>
<span class="line"><span style="color:#61AFEF;">    tar</span><span style="color:#D19A66;"> -xzf</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">backup_name</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -C</span><span style="color:#98C379;"> /etc/nginx</span></span>
<span class="line"><span style="color:#61AFEF;">    sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;) - Rollback completed&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$LOG_FILE</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 清理旧备份（保留最近 10 个）</span></span>
<span class="line"><span style="color:#61AFEF;">ls</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#98C379;">}&quot;/waf-rules-</span><span style="color:#E5C07B;">*</span><span style="color:#98C379;">.tar.gz</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tail</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> +11</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">xargs</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> rm</span><span style="color:#D19A66;"> --</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_11-waf-监控与告警" tabindex="-1"><a class="header-anchor" href="#_11-waf-监控与告警"><span>11. WAF 监控与告警</span></a></h2><h3 id="_11-1-waf-指标监控" tabindex="-1"><a class="header-anchor" href="#_11-1-waf-指标监控"><span>11.1 WAF 指标监控</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 在 Nginx 日志中增加 WAF 相关信息</span></span>
<span class="line"><span style="color:#C678DD;">log_format </span><span style="color:#ABB2BF;">waf </span><span style="color:#98C379;">&#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">               &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">               &#39;&quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">               &#39;upstream=$</span><span style="color:#E06C75;">upstream_addr</span><span style="color:#98C379;"> rt=$</span><span style="color:#E06C75;">request_time</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">               &#39;waf_action=$</span><span style="color:#E06C75;">upstream_http_x_waf_action</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">               &#39;waf_score=$</span><span style="color:#E06C75;">upstream_http_x_waf_score</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">               &#39;waf_rule=$</span><span style="color:#E06C75;">upstream_http_x_waf_rule_id</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">access_log </span><span style="color:#ABB2BF;">/var/log/nginx/waf_access.log waf;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-2-waf-告警脚本" tabindex="-1"><a class="header-anchor" href="#_11-2-waf-告警脚本"><span>11.2 WAF 告警脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/waf-alert.sh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 定期检查 WAF 日志，发送告警</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">THRESHOLD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">100</span><span style="color:#7F848E;font-style:italic;">    # 每分钟拦截阈值</span></span>
<span class="line"><span style="color:#E06C75;">WINDOW</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">60</span><span style="color:#7F848E;font-style:italic;">       # 统计时间窗口（秒）</span></span>
<span class="line"><span style="color:#E06C75;">ALERT_EMAIL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;security@example.com&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">while</span><span style="color:#56B6C2;"> true</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 统计最近 WINDOW 秒的拦截次数</span></span>
<span class="line"><span style="color:#E06C75;">    count</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> start=&quot;$(</span><span style="color:#61AFEF;">date</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">WINDOW</span><span style="color:#98C379;">} seconds ago&quot; &#39;+%d/%b/%Y:%H:%M&#39;)&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        &#39;$0 &gt;= start&#39;</span><span style="color:#98C379;"> /var/log/nginx/access.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">        grep</span><span style="color:#98C379;"> &quot; 403 &quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$count</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> -gt</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$THRESHOLD</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 获取 Top 攻击 IP</span></span>
<span class="line"><span style="color:#E06C75;">        top_ips</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> start=&quot;$(</span><span style="color:#61AFEF;">date</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">WINDOW</span><span style="color:#98C379;">} seconds ago&quot; &#39;+%d/%b/%Y:%H:%M&#39;)&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">            &#39;$0 &gt;= start&#39;</span><span style="color:#98C379;"> /var/log/nginx/access.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">            grep</span><span style="color:#98C379;"> &quot; 403 &quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $1}&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -10</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 获取 Top 触发规则</span></span>
<span class="line"><span style="color:#E06C75;">        top_rules</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%d/%b/%Y&#39;)&quot;</span><span style="color:#98C379;"> /var/log/modsecurity/audit.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">            grep</span><span style="color:#D19A66;"> -oP</span><span style="color:#98C379;"> &#39;id &quot;\\K\\d+&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -10</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 发送告警邮件</span></span>
<span class="line"><span style="color:#61AFEF;">        mail</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> &quot;[WAF ALERT] High block rate: \${</span><span style="color:#E06C75;">count</span><span style="color:#98C379;">} blocks in \${</span><span style="color:#E06C75;">WINDOW</span><span style="color:#98C379;">}s&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">            &quot;</span><span style="color:#E06C75;">$ALERT_EMAIL</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#98C379;">WAF 告警：拦截率异常</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">时间窗口：最近 \${</span><span style="color:#E06C75;">WINDOW</span><span style="color:#98C379;">} 秒</span></span>
<span class="line"><span style="color:#98C379;">拦截次数：\${</span><span style="color:#E06C75;">count</span><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">阈值：\${</span><span style="color:#E06C75;">THRESHOLD</span><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">Top 攻击 IP：</span></span>
<span class="line"><span style="color:#98C379;">\${</span><span style="color:#E06C75;">top_ips</span><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">Top 触发规则：</span></span>
<span class="line"><span style="color:#98C379;">\${</span><span style="color:#E06C75;">top_rules</span><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">请检查是否遭受攻击或存在规则误报。</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$WINDOW</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_12-完整-waf-部署配置" tabindex="-1"><a class="header-anchor" href="#_12-完整-waf-部署配置"><span>12. 完整 WAF 部署配置</span></a></h2><h3 id="_12-1-生产环境-waf-配置模板" tabindex="-1"><a class="header-anchor" href="#_12-1-生产环境-waf-配置模板"><span>12.1 生产环境 WAF 配置模板</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/nginx.conf - 生产环境 WAF 完整配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">load_module </span><span style="color:#ABB2BF;">modules/ngx_http_modsecurity_module.so;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ModSecurity 全局设置</span></span>
<span class="line"><span style="color:#C678DD;">    modsecurity</span><span style="color:#D19A66;"> on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    modsecurity_rules_file</span><span style="color:#ABB2BF;"> /etc/nginx/modsecurity.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 限流配置</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=global:100m rate=50r/s;</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=api:50m rate=20r/s;</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=login:10m rate=5r/m;</span></span>
<span class="line"><span style="color:#C678DD;">    limit_conn_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=per_ip:50m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Bot 管理</span></span>
<span class="line"><span style="color:#C678DD;">    map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_user_agent</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">bot_type</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">        default</span><span style="color:#98C379;">                 &quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ~*Googlebot             </span><span style="color:#98C379;">&quot;good&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ~*bingbot               </span><span style="color:#98C379;">&quot;good&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ~*Baiduspider           </span><span style="color:#98C379;">&quot;good&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ~*sqlmap                </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ~*nikto                 </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ~*nmap                  </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ~*GPTBot                </span><span style="color:#98C379;">&quot;ai&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ~*ChatGPT-User          </span><span style="color:#98C379;">&quot;ai&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ~*CCBot                 </span><span style="color:#98C379;">&quot;ai&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ~*ClaudeBot             </span><span style="color:#98C379;">&quot;ai&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 全局限流</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=global burst=100 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">        limit_conn </span><span style="color:#ABB2BF;">per_ip </span><span style="color:#D19A66;">100</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 超时设置</span></span>
<span class="line"><span style="color:#C678DD;">        client_header_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        client_body_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        send_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        keepalive_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 请求大小限制</span></span>
<span class="line"><span style="color:#C678DD;">        client_max_body_size </span><span style="color:#D19A66;">10m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        client_header_buffer_size </span><span style="color:#D19A66;">1k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        large_client_header_buffers </span><span style="color:#D19A66;">4</span><span style="color:#D19A66;"> 8k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 安全头</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-XSS-Protection </span><span style="color:#98C379;">&quot;1; mode=block&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Referrer-Policy </span><span style="color:#98C379;">&quot;strict-origin-when-cross-origin&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 拦截坏爬虫</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">bot_type</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;bad&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 403</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 静态资源</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(jpg|jpeg|png|gif|ico|css|js|svg|woff2?|ttf|eot)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">            modsecurity</span><span style="color:#D19A66;"> off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#D19A66;"> =404</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 健康检查</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/health </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">            modsecurity</span><span style="color:#D19A66;"> off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &quot;OK&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # API 限流</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">            limit_req </span><span style="color:#ABB2BF;">zone=api burst=30 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">            modsecurity</span><span style="color:#D19A66;"> on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            modsecurity_rules_file</span><span style="color:#ABB2BF;"> /etc/nginx/modsecurity.conf;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 登录严格限流</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/login {</span></span>
<span class="line"><span style="color:#C678DD;">            limit_req </span><span style="color:#ABB2BF;">zone=login burst=3 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">            limit_req_status </span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            modsecurity</span><span style="color:#D19A66;"> on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            modsecurity_rules_file</span><span style="color:#ABB2BF;"> /etc/nginx/modsecurity.conf;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 上传接口</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/upload {</span></span>
<span class="line"><span style="color:#C678DD;">            client_max_body_size </span><span style="color:#D19A66;">20m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            modsecurity</span><span style="color:#D19A66;"> on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            modsecurity_rules_file</span><span style="color:#ABB2BF;"> /etc/nginx/modsecurity.conf;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 限流错误页面</span></span>
<span class="line"><span style="color:#C678DD;">        error_page </span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;"> @rate_limited;</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> @rate_limited {</span></span>
<span class="line"><span style="color:#C678DD;">            default_type </span><span style="color:#ABB2BF;">application/json;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 429</span><span style="color:#98C379;"> &#39;{&quot;error&quot;:&quot;Too Many Requests&quot;,&quot;retry_after&quot;:60}&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # WAF 拦截错误页面</span></span>
<span class="line"><span style="color:#C678DD;">        error_page </span><span style="color:#D19A66;">403</span><span style="color:#ABB2BF;"> @waf_blocked;</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> @waf_blocked {</span></span>
<span class="line"><span style="color:#C678DD;">            default_type </span><span style="color:#ABB2BF;">text/html;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 403</span><span style="color:#98C379;"> &#39;&lt;!DOCTYPE html&gt;&lt;html&gt;&lt;head&gt;&lt;meta charset=&quot;utf-8&quot;&gt;&lt;title&gt;Access Denied&lt;/title&gt;&lt;/head&gt;&lt;body&gt;&lt;h1&gt;Access Denied&lt;/h1&gt;&lt;p&gt;Your request has been blocked by our security system.&lt;/p&gt;&lt;/body&gt;&lt;/html&gt;&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_12-2-waf-部署检查清单" tabindex="-1"><a class="header-anchor" href="#_12-2-waf-部署检查清单"><span>12.2 WAF 部署检查清单</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>WAF 部署检查清单：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>□ 1. 基础安装</span></span>
<span class="line"><span>  □ ModSecurity 模块编译/安装</span></span>
<span class="line"><span>  □ OWASP CRS 规则集安装</span></span>
<span class="line"><span>  □ 基础配置文件创建</span></span>
<span class="line"><span></span></span>
<span class="line"><span>□ 2. 规则调优</span></span>
<span class="line"><span>  □ 先以 DetectionOnly 模式运行</span></span>
<span class="line"><span>  □ 分析误报日志</span></span>
<span class="line"><span>  □ 添加排除规则</span></span>
<span class="line"><span>  □ 调整异常评分阈值</span></span>
<span class="line"><span>  □ 切换到阻断模式</span></span>
<span class="line"><span></span></span>
<span class="line"><span>□ 3. 自定义规则</span></span>
<span class="line"><span>  □ IP 黑名单/白名单</span></span>
<span class="line"><span>  □ URL 白名单</span></span>
<span class="line"><span>  □ 业务特定规则</span></span>
<span class="line"><span>  □ Bot 管理规则</span></span>
<span class="line"><span></span></span>
<span class="line"><span>□ 4. 性能优化</span></span>
<span class="line"><span>  □ 静态资源跳过 WAF</span></span>
<span class="line"><span>  □ 关闭响应体检查</span></span>
<span class="line"><span>  □ 优化日志配置</span></span>
<span class="line"><span>  □ 性能基准测试</span></span>
<span class="line"><span></span></span>
<span class="line"><span>□ 5. 监控告警</span></span>
<span class="line"><span>  □ WAF 日志采集</span></span>
<span class="line"><span>  □ 告警规则配置</span></span>
<span class="line"><span>  □ 定期报告</span></span>
<span class="line"><span>  □ 规则自动更新</span></span>
<span class="line"><span></span></span>
<span class="line"><span>□ 6. 应急预案</span></span>
<span class="line"><span>  □ WAF 故障降级方案</span></span>
<span class="line"><span>  □ 误杀紧急恢复流程</span></span>
<span class="line"><span>  □ 攻击事件响应流程</span></span>
<span class="line"><span>  □ 规则回滚方案</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="参考资源" tabindex="-1"><a class="header-anchor" href="#参考资源"><span>参考资源</span></a></h2><ul><li><a href="https://github.com/SpiderLabs/ModSecurity/wiki" target="_blank" rel="noopener noreferrer">ModSecurity 官方文档</a></li><li><a href="https://coreruleset.org/" target="_blank" rel="noopener noreferrer">OWASP ModSecurity Core Rule Set</a></li><li><a href="https://coreruleset.org/docs/" target="_blank" rel="noopener noreferrer">CRS 规则文档</a></li><li><a href="https://github.com/SpiderLabs/ModSecurity/wiki/Reference-Manual-(v2.x)" target="_blank" rel="noopener noreferrer">ModSecurity SecRule 语法参考</a></li><li><a href="https://github.com/SpiderLabs/ModSecurity-nginx" target="_blank" rel="noopener noreferrer">Nginx ModSecurity 连接器</a></li><li><a href="https://github.com/libinjection/libinjection" target="_blank" rel="noopener noreferrer">libinjection - SQL/XSS 注入检测库</a></li><li><a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener noreferrer">OWASP Top 10</a></li><li><a href="https://nginx.org/en/docs/http/configuring_https_servers.html" target="_blank" rel="noopener noreferrer">Nginx 安全配置指南</a></li></ul>`,23)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};