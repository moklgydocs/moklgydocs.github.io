import{O as e,d as t,p as n}from"./runtime-core.esm-bundler-jC72uHyJ.js";import{t as r}from"./app-DCPmwgWY.js";var i=JSON.parse(`{"path":"/%E8%BF%90%E7%BB%B4%E4%B8%8E%E9%83%A8%E7%BD%B2/Nginx/04.%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E4%B8%8E%E5%AE%89%E5%85%A8%E5%8A%A0%E5%9B%BA.html","title":"性能优化与安全加固","lang":"zh-CN","frontmatter":{"title":"性能优化与安全加固","date":"2025-04-14T00:00:00.000Z","category":["Nginx"],"tag":["Nginx","性能优化","安全","限流"],"order":4},"git":{"createdTime":1776135420000,"updatedTime":1776135420000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":2.7,"words":811},"filePathRelative":"运维与部署/Nginx/04.性能优化与安全加固.md"}`),a={name:`04.性能优化与安全加固.md`};function o(r,i,a,o,s,c){return e(),t(`div`,null,[...i[0]||=[n(`<h1 id="性能优化与安全加固" tabindex="-1"><a class="header-anchor" href="#性能优化与安全加固"><span>性能优化与安全加固</span></a></h1><p>Nginx 默认配置就能用，但生产环境需要调优。压缩、缓存、限流、安全头，每个都能让你的服务更快更安全。</p><hr><h2 id="gzip-压缩" tabindex="-1"><a class="header-anchor" href="#gzip-压缩"><span>Gzip 压缩</span></a></h2><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_vary </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_proxied </span><span style="color:#ABB2BF;">any;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_comp_level </span><span style="color:#D19A66;">6</span><span style="color:#ABB2BF;">;           </span><span style="color:#7F848E;font-style:italic;"># 压缩级别 1-9，6 是性价比最高的</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_min_length </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">;        </span><span style="color:#7F848E;font-style:italic;"># 小于 1KB 不压缩</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_types</span></span>
<span class="line"><span style="color:#ABB2BF;">        text/plain</span></span>
<span class="line"><span style="color:#ABB2BF;">        text/css</span></span>
<span class="line"><span style="color:#ABB2BF;">        text/xml</span></span>
<span class="line"><span style="color:#ABB2BF;">        text/javascript</span></span>
<span class="line"><span style="color:#ABB2BF;">        application/json</span></span>
<span class="line"><span style="color:#ABB2BF;">        application/javascript</span></span>
<span class="line"><span style="color:#ABB2BF;">        application/xml</span></span>
<span class="line"><span style="color:#ABB2BF;">        application/rss+xml</span></span>
<span class="line"><span style="color:#ABB2BF;">        image/svg+xml;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>效果：JSON 响应体积减少 60-80%，页面加载快很多。</p><hr><h2 id="静态文件缓存" tabindex="-1"><a class="header-anchor" href="#静态文件缓存"><span>静态文件缓存</span></a></h2><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 图片、字体、CSS、JS 设长缓存</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(jpg|jpeg|png|gif|ico|svg|woff2|woff|ttf|css|js)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, immutable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;     </span><span style="color:#7F848E;font-style:italic;"># 静态文件不记日志</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTML 不缓存（SPA 入口文件）</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.html$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    expires </span><span style="color:#ABB2BF;">-1;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;no-cache, no-store, must-revalidate&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="连接优化" tabindex="-1"><a class="header-anchor" href="#连接优化"><span>连接优化</span></a></h2><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Keep-alive</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_requests </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 与后端的 Keep-alive</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> erp_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 127.0.0.1:5000;</span></span>
<span class="line"><span style="color:#C678DD;">        keepalive </span><span style="color:#D19A66;">32</span><span style="color:#ABB2BF;">;            </span><span style="color:#7F848E;font-style:italic;"># 保持 32 个空闲长连接</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://erp_backend;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 清空 Connection 头，启用 keepalive</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 文件传输</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 缓冲区</span></span>
<span class="line"><span style="color:#C678DD;">    client_body_buffer_size </span><span style="color:#D19A66;">16k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    client_header_buffer_size </span><span style="color:#D19A66;">1k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    large_client_header_buffers </span><span style="color:#D19A66;">4</span><span style="color:#D19A66;"> 8k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 超时</span></span>
<span class="line"><span style="color:#C678DD;">    client_body_timeout </span><span style="color:#D19A66;">12</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    client_header_timeout </span><span style="color:#D19A66;">12</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    send_timeout </span><span style="color:#D19A66;">10</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="worker-调优" tabindex="-1"><a class="header-anchor" href="#worker-调优"><span>Worker 调优</span></a></h2><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 全局</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;         </span><span style="color:#7F848E;font-style:italic;"># 自动检测 CPU 核心数</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 最大打开文件数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 每个 worker 最大并发连接</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;           </span><span style="color:#7F848E;font-style:italic;"># 一次接受多个连接</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;                 </span><span style="color:#7F848E;font-style:italic;"># Linux 高性能事件模型</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="请求限流" tabindex="-1"><a class="header-anchor" href="#请求限流"><span>请求限流</span></a></h2><h3 id="限制请求频率" tabindex="-1"><a class="header-anchor" href="#限制请求频率"><span>限制请求频率</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 定义限流区域：按 IP，每秒 10 个请求</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=api_limit:10m rate=10r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # burst=20：允许突发 20 个</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # nodelay：突发请求不排队立即处理</span></span>
<span class="line"><span style="color:#C678DD;">            limit_req </span><span style="color:#ABB2BF;">zone=api_limit burst=20 nodelay;</span></span>
<span class="line"><span style="color:#C678DD;">            limit_req_status </span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://127.0.0.1:5000;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="限制并发连接" tabindex="-1"><a class="header-anchor" href="#限制并发连接"><span>限制并发连接</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    limit_conn_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=conn_limit:10m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 每个 IP 最多 50 个并发连接</span></span>
<span class="line"><span style="color:#C678DD;">        limit_conn </span><span style="color:#ABB2BF;">conn_limit </span><span style="color:#D19A66;">50</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        limit_conn_status </span><span style="color:#D19A66;">429</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="限制上传大小" tabindex="-1"><a class="header-anchor" href="#限制上传大小"><span>限制上传大小</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    client_max_body_size </span><span style="color:#D19A66;">50m</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 最大上传 50MB</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 针对特定路径</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/upload {</span></span>
<span class="line"><span style="color:#C678DD;">        client_max_body_size </span><span style="color:#D19A66;">200m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="安全-header" tabindex="-1"><a class="header-anchor" href="#安全-header"><span>安全 Header</span></a></h2><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 防止 MIME 类型嗅探</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 防止点击劫持</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # XSS 保护</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-XSS-Protection </span><span style="color:#98C379;">&quot;1; mode=block&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # HSTS</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Strict-Transport-Security </span><span style="color:#98C379;">&quot;max-age=31536000; includeSubDomains&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 隐藏 Nginx 版本号</span></span>
<span class="line"><span style="color:#C678DD;">    server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 禁止 .git 等敏感目录访问</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">/\\. </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        log_not_found </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="ip-黑白名单" tabindex="-1"><a class="header-anchor" href="#ip-黑白名单"><span>IP 黑白名单</span></a></h2><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 只允许内网访问管理后台</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /admin/ {</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#ABB2BF;">192.168.1.0/24;</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">    deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://127.0.0.1:5000;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 屏蔽恶意 IP</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/conf.d/blocklist.conf</span></span>
<span class="line"><span style="color:#C678DD;">deny </span><span style="color:#D19A66;">1.2.3.4</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">deny </span><span style="color:#ABB2BF;">5.6.7.0/24;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 http 或 server 块里 include</span></span>
<span class="line"><span style="color:#C678DD;">include </span><span style="color:#ABB2BF;">/etc/nginx/conf.d/blocklist.conf;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="日志优化" tabindex="-1"><a class="header-anchor" href="#日志优化"><span>日志优化</span></a></h2><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 自定义日志格式（含响应时间）</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#ABB2BF;">detailed </span><span style="color:#98C379;">&#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;rt=$</span><span style="color:#E06C75;">request_time</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;&quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot;&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 按站点分日志</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#ABB2BF;">/var/log/nginx/erp-access.log detailed;</span></span>
<span class="line"><span style="color:#C678DD;">        error_log </span><span style="color:#ABB2BF;">/var/log/nginx/erp-error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 静态文件不记日志</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(js|css|png|jpg|gif|ico)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 健康检查不记日志</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/health </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &#39;OK&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="日志轮转" tabindex="-1"><a class="header-anchor" href="#日志轮转"><span>日志轮转</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/logrotate.d/nginx</span></span>
<span class="line"><span style="color:#61AFEF;">/var/log/nginx/*.log</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    daily</span></span>
<span class="line"><span style="color:#61AFEF;">    missingok</span></span>
<span class="line"><span style="color:#61AFEF;">    rotate</span><span style="color:#D19A66;"> 30</span></span>
<span class="line"><span style="color:#61AFEF;">    compress</span></span>
<span class="line"><span style="color:#61AFEF;">    delaycompress</span></span>
<span class="line"><span style="color:#61AFEF;">    notifempty</span></span>
<span class="line"><span style="color:#61AFEF;">    sharedscripts</span></span>
<span class="line"><span style="color:#61AFEF;">    postrotate</span></span>
<span class="line"><span style="color:#ABB2BF;">        [ </span><span style="color:#56B6C2;">-f</span><span style="color:#ABB2BF;"> /run/nginx.pid ] &amp;&amp; </span><span style="color:#56B6C2;">kill</span><span style="color:#D19A66;"> -USR1</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /run/nginx.pid</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">    endscript</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="生产环境完整配置模板" tabindex="-1"><a class="header-anchor" href="#生产环境完整配置模板"><span>生产环境完整配置模板</span></a></h2><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;">nginx;</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">pid </span><span style="color:#ABB2BF;">/run/nginx.pid;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/mime.types;</span></span>
<span class="line"><span style="color:#C678DD;">    default_type </span><span style="color:#ABB2BF;">application/octet-stream;</span></span>
<span class="line"><span style="color:#C678DD;">    server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 日志</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#D19A66;">main</span><span style="color:#98C379;"> &#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;$</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> rt=$</span><span style="color:#E06C75;">request_time</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 性能</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_requests </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Gzip</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_vary </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_comp_level </span><span style="color:#D19A66;">6</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_min_length </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_types </span><span style="color:#ABB2BF;">text/plain text/css application/json application/javascript text/xml image/svg+xml;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 限流</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=api:10m rate=20r/s;</span></span>
<span class="line"><span style="color:#C678DD;">    limit_conn_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=conn:10m;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 安全</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 站点</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/conf.d/*.conf;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,37)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};