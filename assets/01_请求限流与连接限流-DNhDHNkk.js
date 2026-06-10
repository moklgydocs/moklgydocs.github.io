import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-DgnfxEif.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/06_%E9%99%90%E6%B5%81%E4%B8%8E%E8%AE%BF%E9%97%AE%E6%8E%A7%E5%88%B6/01_%E8%AF%B7%E6%B1%82%E9%99%90%E6%B5%81%E4%B8%8E%E8%BF%9E%E6%8E%A5%E9%99%90%E6%B5%81.html","title":"请求限流与连接限流","lang":"zh-CN","frontmatter":{"title":"请求限流与连接限流","icon":"fa6-solid:gauge","order":1,"category":["Linux","Nginx"],"tag":["限流","限速","limit_req","limit_conn","令牌桶"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":13.28,"words":3984},"filePathRelative":"Linux/07_Nginx/06_限流与访问控制/01_请求限流与连接限流.md"}`),s={name:`01_请求限流与连接限流.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="请求限流与连接限流" tabindex="-1"><a class="header-anchor" href="#请求限流与连接限流"><span>请求限流与连接限流</span></a></h1><h2 id="为什么需要限流" tabindex="-1"><a class="header-anchor" href="#为什么需要限流"><span>为什么需要限流</span></a></h2><p>在高并发场景下，如果不做限流，服务器可能面临以下问题：</p><ul><li><strong>资源耗尽</strong>：大量请求耗尽服务器 CPU、内存、连接数等资源</li><li><strong>雪崩效应</strong>：后端服务过载导致级联故障</li><li><strong>DDoS 攻击</strong>：恶意请求淹没正常服务</li><li><strong>成本失控</strong>：按量计费的 API 被滥用导致费用暴涨</li></ul><p>限流的核心目标是在系统可承受的范围内，合理分配访问资源，确保服务稳定性。</p><hr><h2 id="限流算法原理" tabindex="-1"><a class="header-anchor" href="#限流算法原理"><span>限流算法原理</span></a></h2><h3 id="漏桶算法-leaky-bucket" tabindex="-1"><a class="header-anchor" href="#漏桶算法-leaky-bucket"><span>漏桶算法（Leaky Bucket）</span></a></h3><p>漏桶算法将请求处理比作水从漏桶中流出，无论注入速度多快，流出速度恒定：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>请求流入 → [漏桶] → 恒速流出处理</span></span>
<span class="line"><span>           ↑</span></span>
<span class="line"><span>     桶满时溢出（丢弃请求）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>特性：</span></span>
<span class="line"><span>- 流出速率恒定（平滑输出）</span></span>
<span class="line"><span>- 桶满时新请求被丢弃</span></span>
<span class="line"><span>- 适合流量整形（Traffic Shaping）</span></span>
<span class="line"><span>- 不允许突发流量</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="令牌桶算法-token-bucket" tabindex="-1"><a class="header-anchor" href="#令牌桶算法-token-bucket"><span>令牌桶算法（Token Bucket）</span></a></h3><p>令牌桶算法以恒定速率向桶中放入令牌，请求需要获取令牌才能处理：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>令牌生成器 ──→ [令牌桶] ←── 请求获取令牌</span></span>
<span class="line"><span>               ↑        │</span></span>
<span class="line"><span>         桶满时丢弃      └──→ 有令牌：处理请求</span></span>
<span class="line"><span>         多余令牌            无令牌：拒绝/等待</span></span>
<span class="line"><span>         </span></span>
<span class="line"><span>特性：</span></span>
<span class="line"><span>- 允许突发流量（桶中有累积令牌时）</span></span>
<span class="line"><span>- 平均速率受令牌生成速率控制</span></span>
<span class="line"><span>- 适合流量控制（Traffic Policing）</span></span>
<span class="line"><span>- Nginx limit_req 的 burst 参数基于此原理</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="两种算法对比" tabindex="-1"><a class="header-anchor" href="#两种算法对比"><span>两种算法对比</span></a></h3>`,14),i(d,{code:`eJxtkctOwkAYhfc8xYQ9Ei66MpiwZmW6m7AArJJAwHCJMdaEotjihVaU4I0gBMWYCDEoIEWepjMtb+G0I1KCs5z5/vOfc2Y7ntyLREOpDGD8NkBOOhveSYV2oyDAhmL70I7HEm70tU4V9yr0DvizkRibsQdN3jgBF9S7A/yex588KjwFgcPhAwE3pLMWzm28cJgvT3N1gxVGHAh4IGoda/IJlVimG32sNPCoSWkvVIdNND6y0mxiy7ZonknG2AS0q0pLK57P/ZvXy/4Z1wzVrutYlNHty3o45fT9Gh0o6PTRTlMxbvgnahHw/FMA4z3AD0VKbxzOWS+NddPlALNKCu6Leq5KMXOrtQ2rSTqH5GcytwbxWVlTak7trYgmBQtFSlsx5CVZndxTVcJ7F3ui/2iC+uSKFEuSos6duV4dXqACr3eG2iuPpEsObLLpbDzjgtNcHskiSTgVJFz5QN9NupaWaopZB2mWrx6qCaRErSQgqYtL7Zmee1Gv1EYiKfQHkM4r6g==`}),o[1]||=n(`<table><thead><tr><th>特性</th><th>漏桶算法</th><th>令牌桶算法</th></tr></thead><tbody><tr><td>输出速率</td><td>恒定</td><td>允许突发</td></tr><tr><td>突发流量</td><td>不允许</td><td>允许（桶中有令牌时）</td></tr><tr><td>实现复杂度</td><td>简单</td><td>稍复杂</td></tr><tr><td>Nginx 实现</td><td>limit_conn</td><td>limit_req (burst)</td></tr><tr><td>适用场景</td><td>严格控制速率</td><td>允许合理突发</td></tr></tbody></table><hr><h2 id="limit-req-zone-与-limit-req" tabindex="-1"><a class="header-anchor" href="#limit-req-zone-与-limit-req"><span>limit_req_zone 与 limit_req</span></a></h2><h3 id="基本语法" tabindex="-1"><a class="header-anchor" href="#基本语法"><span>基本语法</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_limit_req_module.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 http 块中定义限流区域</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 语法：limit_req_zone key zone=name:size rate=rate;</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=mylimit:10m rate=10r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># key：限流维度（如 IP、URI、参数等）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># zone：共享内存区域名称和大小</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># rate：请求速率（r/s 每秒请求数 或 r/m 每分钟请求数）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 location 中应用限流</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 语法：limit_req zone=name [burst=number] [nodelay | delay=number];</span></span>
<span class="line"><span style="color:#C678DD;">limit_req </span><span style="color:#ABB2BF;">zone=mylimit burst=20 nodelay;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="key-参数详解" tabindex="-1"><a class="header-anchor" href="#key-参数详解"><span>key 参数详解</span></a></h3><p>key 决定了限流的维度，可以使用 Nginx 变量组合：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基于 IP 限流（最常用）</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=ip_limit:10m rate=10r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基于 URI 限流</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> zone=uri_limit:10m rate=5r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基于参数限流（如限流特定 API）</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">arg_apikey</span><span style="color:#ABB2BF;"> zone=apikey_limit:10m rate=100r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基于 IP + URI 组合限流</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> zone=ip_uri_limit:10m rate=5r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基于 HTTP 头限流</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">http_x_forwarded_for</span><span style="color:#ABB2BF;"> zone=xff_limit:10m rate=10r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基于自定义变量组合</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">arg_id</span><span style="color:#ABB2BF;"> zone=complex_limit:10m rate=2r/s;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">使用 $binary_remote_addr 而非 $remote_addr</p><ul><li><code>$remote_addr</code>：IPv4 最长 15 字节（如 192.168.1.100），IPv6 最长 45 字节</li><li><code>$binary_remote_addr</code>：IPv4 固定 4 字节，IPv6 固定 16 字节</li><li>使用二进制格式可节省大量共享内存（约 1/3 到 1/5）</li><li>10m 共享内存约可存储 160,000 个 IP（$binary_remote_addr）</li></ul></div><h3 id="zone-参数详解" tabindex="-1"><a class="header-anchor" href="#zone-参数详解"><span>zone 参数详解</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># zone=name:size</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># name：共享内存区域名称（跨 worker 共享）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># size：共享内存大小</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 小型站点</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=small:1m rate=10r/s;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1m ≈ 16,000 个 IP</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 中型站点</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=medium:10m rate=10r/s;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 10m ≈ 160,000 个 IP</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 大型站点</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=large:100m rate=10r/s;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 100m ≈ 1,600,000 个 IP</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="rate-参数详解" tabindex="-1"><a class="header-anchor" href="#rate-参数详解"><span>rate 参数详解</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 每秒请求数</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=per_sec:10m rate=10r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 每分钟请求数</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=per_min:10m rate=300r/m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 低速率（如登录接口）</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=login:10m rate=5r/m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 高速率（如静态资源）</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=static:10m rate=100r/s;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="burst-参数" tabindex="-1"><a class="header-anchor" href="#burst-参数"><span>burst 参数</span></a></h3><p>burst 允许超出 rate 的突发请求数量，实现令牌桶效果：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># rate=10r/s，burst=20</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 表示：平均每秒 10 个请求，允许突发 20 个额外请求</span></span>
<span class="line"><span style="color:#C678DD;">limit_req </span><span style="color:#ABB2BF;">zone=mylimit burst=20;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 工作原理：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 每秒向桶中放入 10 个令牌（rate=10r/s）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 桶最大容量为 20（burst=20）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 请求消耗令牌</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 桶空时，新请求返回 503</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 桶中有令牌时，请求被延迟处理（等待令牌生成）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 无 burst（严格限流）</span></span>
<span class="line"><span style="color:#C678DD;">limit_req </span><span style="color:#ABB2BF;">zone=mylimit;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 超出 rate 的请求立即返回 503</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># burst=20（允许突发，但超出部分被延迟）</span></span>
<span class="line"><span style="color:#C678DD;">limit_req </span><span style="color:#ABB2BF;">zone=mylimit burst=20;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 20 个以内的突发请求被延迟处理</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 超出 20 的请求返回 503</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nodelay-与-delay-参数" tabindex="-1"><a class="header-anchor" href="#nodelay-与-delay-参数"><span>nodelay 与 delay 参数</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># nodelay：突发请求不延迟，立即处理</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 但仍受 burst 数量限制</span></span>
<span class="line"><span style="color:#C678DD;">limit_req </span><span style="color:#ABB2BF;">zone=mylimit burst=20 nodelay;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 突发请求立即处理，不等待令牌</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 超出 burst 的请求返回 503</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># delay=number：前 number 个突发请求不延迟，之后的突发请求被延迟</span></span>
<span class="line"><span style="color:#C678DD;">limit_req </span><span style="color:#ABB2BF;">zone=mylimit burst=20 delay=5;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 前 5 个突发请求立即处理（不延迟）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第 6-20 个突发请求被延迟处理</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 超出 20 的请求返回 503</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 完整示例</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=api_limit:10m rate=10r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 平均 10r/s，允许 20 个突发，突发请求不延迟</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=api_limit burst=20 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="limit-req-status" tabindex="-1"><a class="header-anchor" href="#limit-req-status"><span>limit_req_status</span></a></h3><p>自定义限流响应码：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_limit_req_module.html#limit_req_status</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认返回 503 Service Unavailable</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 可以修改为 429 Too Many Requests（更符合 HTTP 语义）</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_status </span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=api_limit burst=20 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req_status </span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 自定义 429 响应内容</span></span>
<span class="line"><span style="color:#C678DD;">    error_page </span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;"> = @rate_limited;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> @rate_limited {</span></span>
<span class="line"><span style="color:#C678DD;">    default_type </span><span style="color:#ABB2BF;">application/json;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 429</span><span style="color:#98C379;"> &#39;{&quot;error&quot;: &quot;Too Many Requests&quot;, &quot;retry_after&quot;: 1}&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="limit-req-日志" tabindex="-1"><a class="header-anchor" href="#limit-req-日志"><span>limit_req 日志</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 限流日志级别</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 语法：limit_req_log_level info | notice | warn | error;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认：error</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_log_level </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 被限流的请求会记录在错误日志中</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 格式：limiting requests, excess: 0.500 by zone &quot;mylimit&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="limit-conn-zone-与-limit-conn" tabindex="-1"><a class="header-anchor" href="#limit-conn-zone-与-limit-conn"><span>limit_conn_zone 与 limit_conn</span></a></h2><h3 id="基本语法-1" tabindex="-1"><a class="header-anchor" href="#基本语法-1"><span>基本语法</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 http 块中定义连接限制区域</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 语法：limit_conn_zone key zone=name:size;</span></span>
<span class="line"><span style="color:#C678DD;">limit_conn_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=conn_limit:10m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 location 中应用连接限制</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 语法：limit_conn zone number;</span></span>
<span class="line"><span style="color:#C678DD;">limit_conn </span><span style="color:#ABB2BF;">conn_limit </span><span style="color:#D19A66;">100</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="请求限流-vs-连接限流" tabindex="-1"><a class="header-anchor" href="#请求限流-vs-连接限流"><span>请求限流 vs 连接限流</span></a></h3><table><thead><tr><th>特性</th><th>limit_req（请求限流）</th><th>limit_conn（连接限流）</th></tr></thead><tbody><tr><td>限制对象</td><td>请求速率</td><td>并发连接数</td></tr><tr><td>计数方式</td><td>每秒/每分钟请求数</td><td>同时活跃的连接数</td></tr><tr><td>适用场景</td><td>API 限流、防刷</td><td>下载限速、防并发滥用</td></tr><tr><td>算法</td><td>令牌桶</td><td>计数器</td></tr><tr><td>精细度</td><td>高（支持 burst/delay）</td><td>低（硬限制）</td></tr></tbody></table><h3 id="连接限流配置示例" tabindex="-1"><a class="header-anchor" href="#连接限流配置示例"><span>连接限流配置示例</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 限制每个 IP 最多 100 个并发连接</span></span>
<span class="line"><span style="color:#C678DD;">limit_conn_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=conn_limit:10m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 全局连接限制</span></span>
<span class="line"><span style="color:#C678DD;">    limit_conn </span><span style="color:#ABB2BF;">conn_limit </span><span style="color:#D19A66;">100</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 下载目录更严格的限制</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /download/ {</span></span>
<span class="line"><span style="color:#C678DD;">        limit_conn </span><span style="color:#ABB2BF;">conn_limit </span><span style="color:#D19A66;">10</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/download;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基于虚拟主机的连接限制</span></span>
<span class="line"><span style="color:#C678DD;">limit_conn_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">server_name</span><span style="color:#ABB2BF;"> zone=server_conn:10m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 每个虚拟主机最多 1000 个并发连接</span></span>
<span class="line"><span style="color:#C678DD;">    limit_conn </span><span style="color:#ABB2BF;">server_conn </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="limit-conn-status-与日志" tabindex="-1"><a class="header-anchor" href="#limit-conn-status-与日志"><span>limit_conn_status 与日志</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 自定义连接限制响应码</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认 503，可改为 429</span></span>
<span class="line"><span style="color:#C678DD;">limit_conn_status </span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 连接限制日志级别</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认 error</span></span>
<span class="line"><span style="color:#C678DD;">limit_conn_log_level </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="基于请求特征的精细化限流" tabindex="-1"><a class="header-anchor" href="#基于请求特征的精细化限流"><span>基于请求特征的精细化限流</span></a></h2><h3 id="基于-uri-的差异化限流" tabindex="-1"><a class="header-anchor" href="#基于-uri-的差异化限流"><span>基于 URI 的差异化限流</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_limit_req_module.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 不同接口不同限流策略</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=global:10m rate=30r/s;</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=api_limit:10m rate=10r/s;</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=login_limit:10m rate=5r/m;</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=upload_limit:10m rate=2r/m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 全局限流</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=global burst=50 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # API 接口限流</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=api_limit burst=20 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 登录接口严格限流</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /login {</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=login_limit burst=3 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://auth_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 上传接口严格限流</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /upload {</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=upload_limit burst=2 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://upload_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 静态资源不限流</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /static/ {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/html;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="基于参数的限流" tabindex="-1"><a class="header-anchor" href="#基于参数的限流"><span>基于参数的限流</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基于 API Key 限流</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">arg_apikey</span><span style="color:#ABB2BF;"> zone=apikey_limit:10m rate=100r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=apikey_limit burst=200 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基于用户 ID 限流（从 Cookie 中提取）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 需要使用 map 提取用户标识</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">cookie_session</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">limit_key</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#98C379;">    &quot;&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 未登录用户用 IP</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">cookie_session</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 登录用户用 session</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">limit_key</span><span style="color:#ABB2BF;"> zone=user_limit:10m rate=20r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=user_limit burst=40 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="基于白名单的限流" tabindex="-1"><a class="header-anchor" href="#基于白名单的限流"><span>基于白名单的限流</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 map 构建白名单</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">remote_addr</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">limit_key</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    10.0.0.0/8        </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;          </span><span style="color:#7F848E;font-style:italic;"># 内网不限流</span></span>
<span class="line"><span style="color:#ABB2BF;">    172.16.0.0/12     </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;          </span><span style="color:#7F848E;font-style:italic;"># 内网不限流</span></span>
<span class="line"><span style="color:#ABB2BF;">    192.168.0.0/16    </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;          </span><span style="color:#7F848E;font-style:italic;"># 内网不限流</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">           $</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 其他 IP 限流</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># key 为空字符串时不参与限流</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">limit_key</span><span style="color:#ABB2BF;"> zone=whitelist_limit:10m rate=10r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=whitelist_limit burst=20 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="基于-http-方法的限流" tabindex="-1"><a class="header-anchor" href="#基于-http-方法的限流"><span>基于 HTTP 方法的限流</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 仅对写操作限流</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">request_method</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">write_limit_key</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    POST    $</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    PUT     $</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    DELETE  $</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#98C379;"> &quot;&quot;</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># GET/HEAD 等不限流</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">write_limit_key</span><span style="color:#ABB2BF;"> zone=write_limit:10m rate=5r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=write_limit burst=10 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="分布式限流-redis-lua-方案" tabindex="-1"><a class="header-anchor" href="#分布式限流-redis-lua-方案"><span>分布式限流：Redis + Lua 方案</span></a></h2><h3 id="为什么需要分布式限流" tabindex="-1"><a class="header-anchor" href="#为什么需要分布式限流"><span>为什么需要分布式限流</span></a></h3><p>Nginx 的 <code>limit_req</code> 和 <code>limit_conn</code> 是单机限流，在多节点部署时存在问题：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>单机限流问题：</span></span>
<span class="line"><span>- 假设限流 100r/s，3 台服务器实际允许 300r/s</span></span>
<span class="line"><span>- 客户端请求可能分布不均，某台服务器过载</span></span>
<span class="line"><span>- 无法实现全局限量（如 API 每天调用 10000 次）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>分布式限流方案：</span></span>
<span class="line"><span>- 使用 Redis 作为共享计数器</span></span>
<span class="line"><span>- 所有 Nginx 节点访问同一个 Redis</span></span>
<span class="line"><span>- 实现精确的全局限流</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="redis-lua-限流实现" tabindex="-1"><a class="header-anchor" href="#redis-lua-限流实现"><span>Redis + Lua 限流实现</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_lua_module.html</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 需要安装 lua-nginx-module 和 lua-resty-redis</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 OpenResty（推荐）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># OpenResty 内置 lua-nginx-module</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">lua_shared_dict</span><span style="color:#ABB2BF;"> limit_store </span><span style="color:#D19A66;">10m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        access_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> redis</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">require</span><span style="color:#98C379;"> &quot;resty.redis&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> red</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">redis</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">new</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">            red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">set_timeouts</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> ok</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">err</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">connect</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;127.0.0.1&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">6379</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#56B6C2;"> not</span><span style="color:#E06C75;"> ok</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">log</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.ERR, </span><span style="color:#98C379;">&quot;failed to connect to redis: &quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">err</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">                return</span><span style="color:#7F848E;font-style:italic;">  -- Redis 连接失败，放行请求</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 滑动窗口限流</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> key</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;rate_limit:&quot; </span><span style="color:#ABB2BF;">.. </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.var.binary_remote_addr</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> now</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">now</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> window</span><span style="color:#ABB2BF;"> = </span><span style="color:#D19A66;">1</span><span style="color:#7F848E;font-style:italic;">  -- 1 秒窗口</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- Lua 脚本实现原子操作</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> script</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">[[</span></span>
<span class="line"><span style="color:#98C379;">                local key = KEYS[1]</span></span>
<span class="line"><span style="color:#98C379;">                local now = tonumber(ARGV[1])</span></span>
<span class="line"><span style="color:#98C379;">                local window = tonumber(ARGV[2])</span></span>
<span class="line"><span style="color:#98C379;">                local limit = tonumber(ARGV[3])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">                -- 移除过期记录</span></span>
<span class="line"><span style="color:#98C379;">                redis.call(&#39;zremrangebyscore&#39;, key, &#39;-inf&#39;, now - window)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">                -- 获取当前窗口内的请求数</span></span>
<span class="line"><span style="color:#98C379;">                local count = redis.call(&#39;zcard&#39;, key)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">                if count &lt; limit then</span></span>
<span class="line"><span style="color:#98C379;">                    -- 添加当前请求</span></span>
<span class="line"><span style="color:#98C379;">                    redis.call(&#39;zadd&#39;, key, now, now .. &#39;:&#39; .. math.random())</span></span>
<span class="line"><span style="color:#98C379;">                    redis.call(&#39;expire&#39;, key, window)</span></span>
<span class="line"><span style="color:#98C379;">                    return 0  -- 允许</span></span>
<span class="line"><span style="color:#98C379;">                else</span></span>
<span class="line"><span style="color:#98C379;">                    return 1  -- 拒绝</span></span>
<span class="line"><span style="color:#98C379;">                end</span></span>
<span class="line"><span style="color:#98C379;">            ]]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> res</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">err</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">eval</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">script</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">now</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">window</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">10</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#E06C75;"> res</span><span style="color:#ABB2BF;"> == </span><span style="color:#D19A66;">1</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.status = </span><span style="color:#D19A66;">429</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.header[</span><span style="color:#98C379;">&quot;Content-Type&quot;</span><span style="color:#ABB2BF;">] = </span><span style="color:#98C379;">&quot;application/json&quot;</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;{&quot;error&quot;: &quot;Too Many Requests&quot;}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">            red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">close</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="令牌桶-lua-实现" tabindex="-1"><a class="header-anchor" href="#令牌桶-lua-实现"><span>令牌桶 Lua 实现</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 令牌桶算法的 Redis + Lua 实现</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        access_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> redis</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">require</span><span style="color:#98C379;"> &quot;resty.redis&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> red</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">redis</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">new</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#E5C07B;">            red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">set_timeouts</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> ok</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">err</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">connect</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;127.0.0.1&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">6379</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#56B6C2;"> not</span><span style="color:#E06C75;"> ok</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">log</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.ERR, </span><span style="color:#98C379;">&quot;redis connect failed: &quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">err</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">                return</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 令牌桶 Lua 脚本</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> script</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">[[</span></span>
<span class="line"><span style="color:#98C379;">                local key = KEYS[1]</span></span>
<span class="line"><span style="color:#98C379;">                local now = tonumber(ARGV[1])</span></span>
<span class="line"><span style="color:#98C379;">                local rate = tonumber(ARGV[2])</span></span>
<span class="line"><span style="color:#98C379;">                local capacity = tonumber(ARGV[3])</span></span>
<span class="line"><span style="color:#98C379;">                local requested = tonumber(ARGV[4])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">                -- 获取当前令牌数和上次更新时间</span></span>
<span class="line"><span style="color:#98C379;">                local data = redis.call(&#39;hmget&#39;, key, &#39;tokens&#39;, &#39;last_time&#39;)</span></span>
<span class="line"><span style="color:#98C379;">                local tokens = tonumber(data[1])</span></span>
<span class="line"><span style="color:#98C379;">                local last_time = tonumber(data[2])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">                if tokens == nil then</span></span>
<span class="line"><span style="color:#98C379;">                    tokens = capacity</span></span>
<span class="line"><span style="color:#98C379;">                    last_time = now</span></span>
<span class="line"><span style="color:#98C379;">                end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">                -- 计算新增令牌</span></span>
<span class="line"><span style="color:#98C379;">                local elapsed = now - last_time</span></span>
<span class="line"><span style="color:#98C379;">                local new_tokens = elapsed * rate</span></span>
<span class="line"><span style="color:#98C379;">                tokens = math.min(capacity, tokens + new_tokens)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">                -- 尝试消耗令牌</span></span>
<span class="line"><span style="color:#98C379;">                if tokens &gt;= requested then</span></span>
<span class="line"><span style="color:#98C379;">                    tokens = tokens - requested</span></span>
<span class="line"><span style="color:#98C379;">                    redis.call(&#39;hmset&#39;, key, &#39;tokens&#39;, tokens, &#39;last_time&#39;, now)</span></span>
<span class="line"><span style="color:#98C379;">                    redis.call(&#39;expire&#39;, key, math.ceil(capacity / rate) + 1)</span></span>
<span class="line"><span style="color:#98C379;">                    return 0  -- 允许</span></span>
<span class="line"><span style="color:#98C379;">                else</span></span>
<span class="line"><span style="color:#98C379;">                    redis.call(&#39;hmset&#39;, key, &#39;tokens&#39;, tokens, &#39;last_time&#39;, now)</span></span>
<span class="line"><span style="color:#98C379;">                    redis.call(&#39;expire&#39;, key, math.ceil(capacity / rate) + 1)</span></span>
<span class="line"><span style="color:#98C379;">                    return 1  -- 拒绝</span></span>
<span class="line"><span style="color:#98C379;">                end</span></span>
<span class="line"><span style="color:#98C379;">            ]]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> key</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;token_bucket:&quot; </span><span style="color:#ABB2BF;">.. </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.var.binary_remote_addr</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> now</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">now</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> rate</span><span style="color:#ABB2BF;"> = </span><span style="color:#D19A66;">10</span><span style="color:#7F848E;font-style:italic;">       -- 每秒生成 10 个令牌</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> capacity</span><span style="color:#ABB2BF;"> = </span><span style="color:#D19A66;">20</span><span style="color:#7F848E;font-style:italic;">   -- 桶容量 20</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> requested</span><span style="color:#ABB2BF;"> = </span><span style="color:#D19A66;">1</span><span style="color:#7F848E;font-style:italic;">   -- 每次请求消耗 1 个令牌</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> res</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">err</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">eval</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">script</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">now</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">rate</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">capacity</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">requested</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#E06C75;"> res</span><span style="color:#ABB2BF;"> == </span><span style="color:#D19A66;">1</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.status = </span><span style="color:#D19A66;">429</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.header[</span><span style="color:#98C379;">&quot;Content-Type&quot;</span><span style="color:#ABB2BF;">] = </span><span style="color:#98C379;">&quot;application/json&quot;</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.header[</span><span style="color:#98C379;">&quot;Retry-After&quot;</span><span style="color:#ABB2BF;">] = </span><span style="color:#98C379;">&quot;1&quot;</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;{&quot;error&quot;: &quot;Too Many Requests&quot;, &quot;retry_after&quot;: 1}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">            red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">close</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="限流与-cdn-配合" tabindex="-1"><a class="header-anchor" href="#限流与-cdn-配合"><span>限流与 CDN 配合</span></a></h2><h3 id="cdn-场景下的限流挑战" tabindex="-1"><a class="header-anchor" href="#cdn-场景下的限流挑战"><span>CDN 场景下的限流挑战</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>问题：</span></span>
<span class="line"><span>1. CDN 缓存命中时，请求不会到达源站，限流不准确</span></span>
<span class="line"><span>2. CDN 节点 IP 被当作客户端 IP，所有用户共享限流额度</span></span>
<span class="line"><span>3. CDN 的动态加速可能改变请求路径</span></span>
<span class="line"><span></span></span>
<span class="line"><span>解决：</span></span>
<span class="line"><span>1. 使用真实客户端 IP（X-Forwarded-For / CF-Connecting-IP）</span></span>
<span class="line"><span>2. 配置 CDN 侧限流（如 Cloudflare Rate Limiting）</span></span>
<span class="line"><span>3. 源站限流作为最后防线</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="获取真实客户端-ip" tabindex="-1"><a class="header-anchor" href="#获取真实客户端-ip"><span>获取真实客户端 IP</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_realip_module.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置可信代理 IP</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">103.21.244.0/22;   </span><span style="color:#7F848E;font-style:italic;"># Cloudflare</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">103.22.200.0/22;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">103.31.4.0/22;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">104.16.0.0/13;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">104.24.0.0/14;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">108.162.192.0/18;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">131.0.72.0/22;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">141.101.64.0/18;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">162.158.0.0/15;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">172.64.0.0/13;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">173.245.48.0/20;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">188.114.96.0/20;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">190.93.240.0/20;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">197.234.240.0/22;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">198.41.128.0/17;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用哪个头部获取真实 IP</span></span>
<span class="line"><span style="color:#C678DD;">real_ip_header </span><span style="color:#ABB2BF;">CF-Connecting-IP;     </span><span style="color:#7F848E;font-style:italic;"># Cloudflare</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># real_ip_header X-Forwarded-For;    # 通用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># real_ip_header X-Real-IP;          # Nginx 代理</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 递归搜索（从最后一个非可信 IP 开始）</span></span>
<span class="line"><span style="color:#C678DD;">real_ip_recursive </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 限流使用 $binary_remote_addr（已被替换为真实 IP）</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=cdn_limit:10m rate=10r/s;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="多层限流策略" tabindex="-1"><a class="header-anchor" href="#多层限流策略"><span>多层限流策略</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 第一层：CDN 限流（如 Cloudflare Rate Limiting）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 CDN 控制面板配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第二层：Nginx 全局限流</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=global:10m rate=50r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第三层：接口级限流</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=api:10m rate=10r/s;</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=login:10m rate=5r/m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 全局限流</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=global burst=100 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=api burst=20 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /login {</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=login burst=3 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://auth_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="限流监控与动态调整" tabindex="-1"><a class="header-anchor" href="#限流监控与动态调整"><span>限流监控与动态调整</span></a></h2><h3 id="限流指标监控" tabindex="-1"><a class="header-anchor" href="#限流指标监控"><span>限流指标监控</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 通过自定义日志记录限流信息</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">log_format </span><span style="color:#ABB2BF;">limit_log </span><span style="color:#98C379;">&#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                     &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                     &#39;limit_req_status=$</span><span style="color:#E06C75;">limit_req_status</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                     &#39;upstream_response_time=$</span><span style="color:#E06C75;">upstream_response_time</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：$limit_req_status 变量需要较新版本的 Nginx</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 替代方案：通过错误日志统计限流</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">access_log </span><span style="color:#ABB2BF;">/var/log/nginx/access.log limit_log;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="限流统计脚本" tabindex="-1"><a class="header-anchor" href="#限流统计脚本"><span>限流统计脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># rate_limit_stats.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">LOG_FILE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/nginx/error.log&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== Rate Limit Statistics ===&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 统计限流次数</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Total limited requests:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;limiting requests&quot;</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$LOG_FILE</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;0&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 按区域统计</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Limited by zone:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;limiting requests&quot;</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$LOG_FILE</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    grep</span><span style="color:#D19A66;"> -oP</span><span style="color:#98C379;"> &#39;zone &quot;\\K[^&quot;]+&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 被限流最多的 IP</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Top 10 limited IPs:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;limiting requests&quot;</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$LOG_FILE</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    grep</span><span style="color:#D19A66;"> -oP</span><span style="color:#98C379;"> &#39;client: \\K[^,]+&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 限流趋势（按小时）</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Rate limit trend (hourly):&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;limiting requests&quot;</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$LOG_FILE</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    grep</span><span style="color:#D19A66;"> -oP</span><span style="color:#98C379;"> &#39;\\d{2}/\\w{3}/\\d{4}:\\d{2}&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动态限流调整" tabindex="-1"><a class="header-anchor" href="#动态限流调整"><span>动态限流调整</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 map + 变量实现动态限流</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 根据时间段调整限流阈值</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">time_hour</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">rate_limit</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;"> 10r/s;       </span><span style="color:#7F848E;font-style:italic;"># 默认 10r/s</span></span>
<span class="line"><span style="color:#D19A66;">    0</span><span style="color:#ABB2BF;">     5r/s;          </span><span style="color:#7F848E;font-style:italic;"># 凌晨 5r/s</span></span>
<span class="line"><span style="color:#D19A66;">    1</span><span style="color:#ABB2BF;">     5r/s;</span></span>
<span class="line"><span style="color:#D19A66;">    2</span><span style="color:#ABB2BF;">     5r/s;</span></span>
<span class="line"><span style="color:#D19A66;">    3</span><span style="color:#ABB2BF;">     5r/s;</span></span>
<span class="line"><span style="color:#D19A66;">    4</span><span style="color:#ABB2BF;">     5r/s;</span></span>
<span class="line"><span style="color:#D19A66;">    5</span><span style="color:#ABB2BF;">     5r/s;</span></span>
<span class="line"><span style="color:#D19A66;">    8</span><span style="color:#ABB2BF;">     20r/s;         </span><span style="color:#7F848E;font-style:italic;"># 早高峰 20r/s</span></span>
<span class="line"><span style="color:#D19A66;">    9</span><span style="color:#ABB2BF;">     20r/s;</span></span>
<span class="line"><span style="color:#D19A66;">    12</span><span style="color:#ABB2BF;">    30r/s;         </span><span style="color:#7F848E;font-style:italic;"># 午高峰 30r/s</span></span>
<span class="line"><span style="color:#D19A66;">    18</span><span style="color:#ABB2BF;">    30r/s;         </span><span style="color:#7F848E;font-style:italic;"># 晚高峰 30r/s</span></span>
<span class="line"><span style="color:#D19A66;">    22</span><span style="color:#ABB2BF;">    15r/s;         </span><span style="color:#7F848E;font-style:italic;"># 晚间 15r/s</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：limit_req_zone 的 rate 不支持变量</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 替代方案：使用 Lua 实现动态限流</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或者使用多个 limit_req_zone，通过条件选择</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=low:10m rate=5r/s;</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=normal:10m rate=10r/s;</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=high:10m rate=30r/s;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="基于-nginx-lua-的动态限流" tabindex="-1"><a class="header-anchor" href="#基于-nginx-lua-的动态限流"><span>基于 Nginx + Lua 的动态限流</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 Lua 实现从 Redis 读取限流配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">lua_shared_dict</span><span style="color:#ABB2BF;"> rate_config </span><span style="color:#D19A66;">1m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 定时更新限流配置</span></span>
<span class="line"><span style="color:#C678DD;">init_worker_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> ngx_timer</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.timer</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> dict</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.rate_config</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#C678DD;"> function</span><span style="color:#61AFEF;"> update_config</span><span style="color:#ABB2BF;">(</span><span style="color:#ABB2BF;font-style:italic;">premature</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#E06C75;"> premature</span><span style="color:#C678DD;"> then</span><span style="color:#C678DD;"> return</span><span style="color:#C678DD;"> end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> redis</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">require</span><span style="color:#98C379;"> &quot;resty.redis&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> red</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">redis</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">new</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> ok</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">err</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">connect</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;127.0.0.1&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">6379</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#E06C75;"> ok</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> rate</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;rate_limit:global_rate&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#E06C75;"> rate</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#E5C07B;">                dict</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">set</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;global_rate&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#56B6C2;">tonumber</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">rate</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"><span style="color:#E5C07B;">            red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">close</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#C678DD;">        end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        -- 每 10 秒更新一次</span></span>
<span class="line"><span style="color:#E06C75;">        ngx_timer</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">at</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">10</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">update_config</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">    ngx_timer</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">at</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">update_config</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        access_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> dict</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.rate_config</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> rate</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">dict</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;global_rate&quot;</span><span style="color:#ABB2BF;">) </span><span style="color:#56B6C2;">or</span><span style="color:#D19A66;"> 10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 使用当前速率进行限流</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 这里需要使用自定义限流逻辑</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 因为 limit_req 不支持动态 rate</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="限流最佳实践" tabindex="-1"><a class="header-anchor" href="#限流最佳实践"><span>限流最佳实践</span></a></h2><h3 id="限流配置原则" tabindex="-1"><a class="header-anchor" href="#限流配置原则"><span>限流配置原则</span></a></h3><ol><li><strong>分层次限流</strong>：全局 → 接口级 → 用户级</li><li><strong>白名单机制</strong>：内网、爬虫白名单不限流</li><li><strong>合理的 burst 值</strong>：允许正常的请求波动</li><li><strong>友好的错误响应</strong>：返回 429 + Retry-After</li><li><strong>监控与告警</strong>：及时发现异常流量</li><li><strong>动态调整</strong>：根据系统负载调整限流阈值</li></ol><h3 id="完整限流配置示例" tabindex="-1"><a class="header-anchor" href="#完整限流配置示例"><span>完整限流配置示例</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_limit_req_module.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 限流区域定义 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 白名单 map</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">remote_addr</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">limit_key</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    10.0.0.0/8        </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    172.16.0.0/12     </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    192.168.0.0/16    </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">           $</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 全局限流</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">limit_key</span><span style="color:#ABB2BF;"> zone=global:20m rate=50r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># API 限流</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">limit_key</span><span style="color:#ABB2BF;"> zone=api:10m rate=10r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 登录限流</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">limit_key</span><span style="color:#ABB2BF;"> zone=login:5m rate=5r/m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 搜索限流</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">limit_key</span><span style="color:#ABB2BF;"> zone=search:5m rate=2r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 连接限流</span></span>
<span class="line"><span style="color:#C678DD;">limit_conn_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">limit_key</span><span style="color:#ABB2BF;"> zone=conn_limit:10m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 限流响应码</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_status </span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">limit_conn_status </span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 限流日志级别</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_log_level </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">limit_conn_log_level </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 全局限流</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=global burst=100 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 连接限流</span></span>
<span class="line"><span style="color:#C678DD;">    limit_conn </span><span style="color:#ABB2BF;">conn_limit </span><span style="color:#D19A66;">200</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # API 接口</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=api burst=30 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 登录接口</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/auth/login {</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=login burst=5 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://auth_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 搜索接口</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/search {</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=search burst=10 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://search_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 健康检查（不限流）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 注意：子 location 不会继承父级的 limit_req，</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 因此不需要此 location 时只需不写 limit_req 即可</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /health {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &quot;OK&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 429 错误处理</span></span>
<span class="line"><span style="color:#C678DD;">    error_page </span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;"> = @rate_limited;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> @rate_limited {</span></span>
<span class="line"><span style="color:#C678DD;">    default_type </span><span style="color:#ABB2BF;">application/json;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Retry-After </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 429</span><span style="color:#98C379;"> &#39;{&quot;error&quot;: &quot;Too Many Requests&quot;, &quot;message&quot;: &quot;Rate limit exceeded. Please try again later.&quot;}&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="延伸阅读" tabindex="-1"><a class="header-anchor" href="#延伸阅读"><span>延伸阅读</span></a></h2><ul><li><a href="https://nginx.org/en/docs/http/ngx_http_limit_req_module.html" target="_blank" rel="noopener noreferrer">Nginx limit_req Module 官方文档</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html" target="_blank" rel="noopener noreferrer">Nginx limit_conn Module 官方文档</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_realip_module.html" target="_blank" rel="noopener noreferrer">Nginx Real IP Module 官方文档</a></li><li><a href="https://openresty.org/en/lua_module/" target="_blank" rel="noopener noreferrer">OpenResty Lua 官方文档</a></li><li><a href="https://redis.io/documentation" target="_blank" rel="noopener noreferrer">Redis 官方文档</a></li><li><a href="https://tools.ietf.org/html/rfc6585" target="_blank" rel="noopener noreferrer">RFC 6585 - 429 Status Code</a></li></ul>`,79)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};