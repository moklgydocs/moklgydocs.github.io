import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-DpHYttfJ.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/03_HTTP%E6%A0%B8%E5%BF%83%E4%B8%8E%E8%99%9A%E6%8B%9F%E4%B8%BB%E6%9C%BA/02_server%E5%9D%97%E4%B8%8E%E8%99%9A%E6%8B%9F%E4%B8%BB%E6%9C%BA.html","title":"server 块与虚拟主机","lang":"zh-CN","frontmatter":{"title":"server 块与虚拟主机","icon":"fa6-solid:server","order":2,"category":["Linux","Nginx"],"tag":["虚拟主机","server块","server_name","default_server","多站点"]},"git":{"createdTime":1780631738000,"updatedTime":1780632863000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":17.26,"words":5177},"filePathRelative":"Linux/07_Nginx/03_HTTP核心与虚拟主机/02_server块与虚拟主机.md"}`),s={name:`02_server块与虚拟主机.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="server-块与虚拟主机" tabindex="-1"><a class="header-anchor" href="#server-块与虚拟主机"><span>server 块与虚拟主机</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>在 Nginx 中，<code>server</code> 块是虚拟主机（Virtual Host）的核心配置单元。一个 <code>server</code> 块定义了一个虚拟服务器，它可以独立处理特定域名、IP 地址或端口的请求。通过在同一个 Nginx 实例中配置多个 <code>server</code> 块，可以在一台物理服务器上同时托管多个网站或服务，这就是虚拟主机技术的核心思想。</p><div class="hint-container important"><p class="hint-container-title">虚拟主机的价值</p><p>虚拟主机技术使得多个域名或服务可以共享同一台服务器的资源，大幅降低了运维成本。Nginx 的虚拟主机配置简洁高效，单台服务器可以轻松托管数千个站点。</p></div><h2 id="server-块配置基础" tabindex="-1"><a class="header-anchor" href="#server-块配置基础"><span>server 块配置基础</span></a></h2><h3 id="server-块的基本结构" tabindex="-1"><a class="header-anchor" href="#server-块的基本结构"><span>server 块的基本结构</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            root </span><span style="color:#ABB2BF;">/var/www/example;</span></span>
<span class="line"><span style="color:#C678DD;">            index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">another.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            root </span><span style="color:#ABB2BF;">/var/www/another;</span></span>
<span class="line"><span style="color:#C678DD;">            index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>每个 <code>server</code> 块必须包含至少一个 <code>listen</code> 指令，用于指定监听的地址和端口。<code>server_name</code> 指令则用于匹配请求的 Host 头，决定哪个 <code>server</code> 块处理该请求。</p><h3 id="server-块内的指令层次" tabindex="-1"><a class="header-anchor" href="#server-块内的指令层次"><span>server 块内的指令层次</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 监听配置</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 域名配置</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 全局指令（作用于整个 server 块）</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/example;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html index.htm;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 错误页面</span></span>
<span class="line"><span style="color:#C678DD;">    error_page </span><span style="color:#D19A66;">404</span><span style="color:#ABB2BF;"> /404.html;</span></span>
<span class="line"><span style="color:#C678DD;">    error_page </span><span style="color:#D19A66;">500</span><span style="color:#D19A66;"> 502</span><span style="color:#D19A66;"> 503</span><span style="color:#D19A66;"> 504</span><span style="color:#ABB2BF;"> /50x.html;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 访问日志</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/example_access.log;</span></span>
<span class="line"><span style="color:#C678DD;">    error_log </span><span style="color:#ABB2BF;">/var/log/nginx/example_error.log;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SSL 配置（如需要）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ssl_certificate /etc/nginx/ssl/example.crt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ssl_certificate_key /etc/nginx/ssl/example.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # location 块</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ </span><span style="color:#D19A66;">=404</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /static/ {</span></span>
<span class="line"><span style="color:#C678DD;">        alias </span><span style="color:#ABB2BF;">/var/www/example/static/;</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三种虚拟主机类型" tabindex="-1"><a class="header-anchor" href="#三种虚拟主机类型"><span>三种虚拟主机类型</span></a></h2><p>虚拟主机根据匹配依据的不同，分为三种类型：基于 IP、基于端口和基于域名。</p>`,12),i(d,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggyFp/N3PdnV5xkQrQRjPZ/V8mLmrGfd85/s2P1szi6lWLAGEHA0jFbyDLBSMLQ00jM0s9Az1DM0UIpV0NW1U3ACSj1fPfN5005HK4XijPwCvdSKxNyCnFS95PxcZCOM0I0wghsBlIIY4WSlkJSTn47FiNS8FC5s7n++ev3T/sUwP0B4uP3hDHRsQD4wMCxgdrsARTxCQgIg9iMrBToKqhShGCj2dE/D0/6Jz/vWP13UjKzcGKrcxMQYphooBDI6GMVsXB55On/+0wm9MI9AeLg94oolQqzg7nQzrPbILy55umTL044lz6atrYXrczMEKahBj6caBXdENCJZA1WOHidA5Ygow1SeWJCJphoYEhDVzhihUFKZkwpPiwppmTk5VsqphmmmaakY8pDYhapJS0szTjXAUAMJOJg5FmmmqZZcAOlPH4M=`}),o[1]||=n(`<h3 id="基于ip的虚拟主机" tabindex="-1"><a class="header-anchor" href="#基于ip的虚拟主机"><span>基于IP的虚拟主机</span></a></h3><p>每个虚拟主机绑定不同的 IP 地址。服务器需要配置多个网络接口或 IP 别名。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 站点A - 绑定到 192.168.1.10</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#ABB2BF;">192.168.1.10:80;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">shop.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/shop;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 站点B - 绑定到 192.168.1.20</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#ABB2BF;">192.168.1.20:80;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">blog.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/blog;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Linux 上添加 IP 别名：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 添加 IP 别名</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 192.168.1.10/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 192.168.1.20/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看所有 IP</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> eth0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container info"><p class="hint-container-title">基于 IP 的虚拟主机应用场景</p><p>基于 IP 的虚拟主机主要用于以下场景：</p><ol><li>需要为不同站点使用独立的 SSL 证书（在 SNI 出现之前）</li><li>不同站点需要绑定到不同的网络接口</li><li>合规要求某些服务必须使用独立 IP</li></ol><p>随着 SNI（Server Name Indication）的普及，基于 IP 的虚拟主机在实际应用中越来越少，基于域名的虚拟主机已成为主流。</p></div><h3 id="基于端口的虚拟主机" tabindex="-1"><a class="header-anchor" href="#基于端口的虚拟主机"><span>基于端口的虚拟主机</span></a></h3><p>不同的虚拟主机监听不同的端口。这种方式不需要多个 IP 地址。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境 - 端口 80</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/production;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 开发环境 - 端口 8080</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">8080</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/development;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># API 服务 - 端口 3000</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">3000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://127.0.0.1:3001;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">端口冲突</p><p>同一 IP 地址上的同一端口只能被一个 <code>server</code> 块监听。如果多个 <code>server</code> 块配置了相同的 <code>listen</code> 地址和端口，它们将通过 <code>server_name</code> 进行区分（基于域名的虚拟主机）。</p></div><h3 id="基于域名的虚拟主机" tabindex="-1"><a class="header-anchor" href="#基于域名的虚拟主机"><span>基于域名的虚拟主机</span></a></h3><p>这是最常用的虚拟主机类型。多个域名共享同一个 IP 地址和端口，Nginx 根据请求的 Host 头将请求路由到对应的 <code>server</code> 块。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 站点A - shop.example.com</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">shop.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/shop;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 站点B - blog.example.com</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">blog.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/blog;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 站点C - api.example.com</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://127.0.0.1:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="三种虚拟主机对比" tabindex="-1"><a class="header-anchor" href="#三种虚拟主机对比"><span>三种虚拟主机对比</span></a></h3><table><thead><tr><th>特性</th><th>基于IP</th><th>基于端口</th><th>基于域名</th></tr></thead><tbody><tr><td>IP 需求</td><td>每站点一个独立 IP</td><td>单 IP 即可</td><td>单 IP 即可</td></tr><tr><td>端口需求</td><td>可共用端口</td><td>每站点一个独立端口</td><td>可共用端口</td></tr><tr><td>客户端访问</td><td>直接使用 IP</td><td>需指定端口号</td><td>使用域名（标准端口）</td></tr><tr><td>配置复杂度</td><td>中（需配置多 IP）</td><td>低</td><td>低</td></tr><tr><td>SSL 支持</td><td>天然支持独立证书</td><td>天然支持独立证书</td><td>需 SNI 支持</td></tr><tr><td>适用场景</td><td>SSL/合规需求</td><td>开发/测试环境</td><td><strong>生产环境主流</strong></td></tr><tr><td>扩展性</td><td>受 IP 数量限制</td><td>受端口数量限制</td><td>几乎无限制</td></tr></tbody></table><h2 id="server-name-指令详解" tabindex="-1"><a class="header-anchor" href="#server-name-指令详解"><span>server_name 指令详解</span></a></h2><p><code>server_name</code> 是虚拟主机配置中最关键的指令之一，它决定了请求如何匹配到具体的 <code>server</code> 块。</p><h3 id="server-name-匹配规则" tabindex="-1"><a class="header-anchor" href="#server-name-匹配规则"><span>server_name 匹配规则</span></a></h3><p>Nginx 按照以下优先级顺序匹配 <code>server_name</code>：</p><ol><li><strong>精确匹配</strong>：<code>example.com</code></li><li><strong>前缀通配符</strong>：<code>*.example.com</code></li><li><strong>后缀通配符</strong>：<code>www.*</code></li><li><strong>正则表达式</strong>：<code>~^(www\\.)?(.+)$</code></li><li><strong>default_server</strong>：未匹配时的默认服务器</li></ol>`,20),i(d,{code:`eJxLy8kvT85ILCpRCHHhUgACx+gX67c/29j0tGPDi337YhV0de0UnKqfb9r3fOG6pz07X7b22teCFTqBpGqezVhfo+Ac/WTv/udTViCrej6rpTi1qCy1KBZJ9dMJy2oUXKqfdvY+39PwsmEWSN2aZSjGuiCMdYUa+2xOw8up+9E0IRsO0QM23K366YQ+nIa7IQx3RzUcVROy4RA9YMM9qp+tXfy0Y+aLhSuAYfN0Tz+K4R4Iwz1hAbJmzZMdDU92rIKHCcQAZPMh2sDme1WnpKYlluaUxEMUQA32QhjsDTUYVR3EIIgysEE+6PZD1D2dOz2WC6y2uKQyJ1XBWSEtMyfHSjnZItUs2RJJwhWXhDtUIikJ6IIkJAlPqERaWppxqgGShDdcIjklxQhJwgdVAgBS4CMm`}),o[2]||=n(`<h3 id="精确匹配" tabindex="-1"><a class="header-anchor" href="#精确匹配"><span>精确匹配</span></a></h3><p>最简单也最高优先级的匹配方式。<code>server_name</code> 与请求的 Host 头完全一致。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 只匹配 example.com</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 不匹配 www.example.com、api.example.com 等</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="通配符前缀匹配" tabindex="-1"><a class="header-anchor" href="#通配符前缀匹配"><span>通配符前缀匹配</span></a></h3><p>使用 <code>*</code> 开头的 <code>server_name</code>，匹配以指定后缀结尾的所有域名。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配 www.example.com、api.example.com、blog.example.com 等</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 不匹配 example.com（通配符不能匹配空标签）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 不匹配 www.sub.example.com（通配符只能在最左或最右侧）</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">通配符规则</p><ol><li><code>*.example.com</code> 可以匹配 <code>www.example.com</code>、<code>api.example.com</code>，但<strong>不能</strong>匹配 <code>example.com</code></li><li>通配符 <code>*</code> 只能出现在域名的最左侧或最右侧</li><li><code>*</code> 只能匹配一个标签层级（如 <code>*.example.com</code> 匹配 <code>www.example.com</code> 但不匹配 <code>a.b.example.com</code>）</li><li><code>www.*.example.com</code> 是无效的，通配符不能出现在中间</li></ol></div><h3 id="通配符后缀匹配" tabindex="-1"><a class="header-anchor" href="#通配符后缀匹配"><span>通配符后缀匹配</span></a></h3><p>使用 <code>*</code> 结尾的 <code>server_name</code>，匹配以指定前缀开头的所有域名。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">www.*;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配 www.example.com、www.another.com 等</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">后缀通配符不常用</p><p>后缀通配符在实际中使用较少，因为不同顶级域名的网站很少共享同一个 <code>server</code> 块。它主要用于特殊场景，如内网环境中多个域名共享相同前缀的情况。</p></div><h3 id="正则表达式匹配" tabindex="-1"><a class="header-anchor" href="#正则表达式匹配"><span>正则表达式匹配</span></a></h3><p>使用 <code>~</code> 前缀表示正则表达式匹配。正则匹配区分大小写；使用 <code>~*</code> 前缀不区分大小写。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 区分大小写的正则匹配</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(www\\.)?example\\.com$</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配 example.com 和 www.example.com</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 不区分大小写的正则匹配</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">~*</span><span style="color:#E06C75;">^api\\..+\\.example\\.com$</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配 api.v1.example.com、API.V2.EXAMPLE.COM 等</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 捕获组 - 可以在配置中引用</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(www\\.)?(?&lt;domain&gt;.+)$</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 使用捕获组 $domain</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/$</span><span style="color:#E06C75;">domain</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="正则表达式中的命名捕获" tabindex="-1"><a class="header-anchor" href="#正则表达式中的命名捕获"><span>正则表达式中的命名捕获</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 使用命名捕获</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(?&lt;subdomain&gt;.+)\\.example\\.com$</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 在配置中引用 $subdomain</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/sites/$</span><span style="color:#E06C75;">subdomain</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ /index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 使用数字捕获</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(.+)\\.example\\.com$</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 引用 $1</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">subdomain</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/sites/$</span><span style="color:#E06C75;">subdomain</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="匹配优先级完整示例" tabindex="-1"><a class="header-anchor" href="#匹配优先级完整示例"><span>匹配优先级完整示例</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 优先级 1：精确匹配</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 最高优先级，直接匹配</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优先级 2：前缀通配符（最长匹配优先）</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配 www.example.com, api.example.com 等</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优先级 3：后缀通配符（最长匹配优先）</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">www.*;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配 www.example.com, www.another.org 等</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优先级 4：正则表达式（按配置顺序，第一个匹配的生效）</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(www\\.)?example\\.com$</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 正则匹配，按出现顺序检查</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 兜底：default_server</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#D19A66;"> default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 所有未匹配的请求都到这里</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 444</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="default-server-指定与默认行为" tabindex="-1"><a class="header-anchor" href="#default-server-指定与默认行为"><span>default_server 指定与默认行为</span></a></h2><h3 id="default-server-的含义" tabindex="-1"><a class="header-anchor" href="#default-server-的含义"><span>default_server 的含义</span></a></h3><p>当一个请求的 Host 头不匹配任何 <code>server_name</code> 时，Nginx 将请求交给 <code>default_server</code> 处理。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 显式指定 default_server</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#D19A66;"> default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">_;  </span><span style="color:#7F848E;font-style:italic;"># _ 不是特殊值，只是习惯用法，任何不匹配的域名都可以</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 返回 444（Nginx 特殊状态码，直接关闭连接）</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 444</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="默认行为的规则" tabindex="-1"><a class="header-anchor" href="#默认行为的规则"><span>默认行为的规则</span></a></h3><ol><li>如果没有任何 <code>server</code> 块声明 <code>default_server</code>，Nginx 将使用<strong>第一个</strong>定义的 <code>server</code> 块作为默认服务器</li><li><code>default_server</code> 是 <code>listen</code> 指令的参数，不是独立指令</li><li>每个 <code>address:port</code> 组合可以有独立的 <code>default_server</code></li></ol><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 端口 80 的默认服务器</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#D19A66;"> default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 444</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 端口 443 的默认服务器</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl </span><span style="color:#D19A66;">default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/default.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/default.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 444</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">安全建议</p><p>始终显式配置 <code>default_server</code>，拒绝不匹配的请求。否则，未匹配的请求可能被第一个 <code>server</code> 块处理，导致意外行为或信息泄露。</p></div><h3 id="常见的-default-server-配置" tabindex="-1"><a class="header-anchor" href="#常见的-default-server-配置"><span>常见的 default_server 配置</span></a></h3><h4 id="_1-直接关闭连接" tabindex="-1"><a class="header-anchor" href="#_1-直接关闭连接"><span>1. 直接关闭连接</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#D19A66;"> default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 444</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># Nginx 特有，直接断开连接，不返回任何响应</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-返回-404" tabindex="-1"><a class="header-anchor" href="#_2-返回-404"><span>2. 返回 404</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#D19A66;"> default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 404</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-重定向到主站" tabindex="-1"><a class="header-anchor" href="#_3-重定向到主站"><span>3. 重定向到主站</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#D19A66;"> default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 301</span><span style="color:#ABB2BF;"> https://example.com$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-返回自定义页面" tabindex="-1"><a class="header-anchor" href="#_4-返回自定义页面"><span>4. 返回自定义页面</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#D19A66;"> default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/default;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ </span><span style="color:#D19A66;">=404</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="listen-指令详解" tabindex="-1"><a class="header-anchor" href="#listen-指令详解"><span>listen 指令详解</span></a></h2><p><code>listen</code> 指令定义了 server 块监听的地址和端口，是虚拟主机配置的基础。</p><h3 id="listen-指令语法" tabindex="-1"><a class="header-anchor" href="#listen-指令语法"><span>listen 指令语法</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>listen address[:port] [default_server] [ssl] [http2] [quic] [proxy_protocol] [backlog=number] [rcvbuf=size] [sndbuf=size] [deferred] [bind] [ipv6only=on|off] [reuseport] [so_keepalive=on|off|[keepidle]:[keepintvl]:[keepcnt]];</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="常见-listen-配置" tabindex="-1"><a class="header-anchor" href="#常见-listen-配置"><span>常见 listen 配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 监听所有接口的 80 端口</span></span>
<span class="line"><span style="color:#C678DD;">listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 等价于</span></span>
<span class="line"><span style="color:#C678DD;">listen </span><span style="color:#ABB2BF;">*:80;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 监听特定 IP 的 80 端口</span></span>
<span class="line"><span style="color:#C678DD;">listen </span><span style="color:#ABB2BF;">192.168.1.10:80;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 监听 IPv6 的 80 端口</span></span>
<span class="line"><span style="color:#C678DD;">listen </span><span style="color:#ABB2BF;">[::]:80;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 指定为默认服务器</span></span>
<span class="line"><span style="color:#C678DD;">listen </span><span style="color:#D19A66;">80</span><span style="color:#D19A66;"> default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTPS 配置</span></span>
<span class="line"><span style="color:#C678DD;">listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTPS + HTTP/2</span></span>
<span class="line"><span style="color:#C678DD;">listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTPS + HTTP/3 (QUIC)</span></span>
<span class="line"><span style="color:#C678DD;">listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> quic reuseport;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 同时支持 HTTP/2 和 HTTP/3</span></span>
<span class="line"><span style="color:#C678DD;">listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> quic reuseport;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 代理协议（当 Nginx 在 L4 负载均衡器之后时）</span></span>
<span class="line"><span style="color:#C678DD;">listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;"> proxy_protocol;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 完整配置</span></span>
<span class="line"><span style="color:#C678DD;">listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2 </span><span style="color:#D19A66;">default_server</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="listen-的关键参数" tabindex="-1"><a class="header-anchor" href="#listen-的关键参数"><span>listen 的关键参数</span></a></h3><table><thead><tr><th>参数</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td><code>default_server</code></td><td>将此 server 设为默认虚拟主机</td><td>第一个 server 块</td></tr><tr><td><code>ssl</code></td><td>启用 SSL/TLS</td><td>off</td></tr><tr><td><code>http2</code></td><td>启用 HTTP/2</td><td>off</td></tr><tr><td><code>quic</code></td><td>启用 HTTP/3 (QUIC)</td><td>off</td></tr><tr><td><code>proxy_protocol</code></td><td>启用 PROXY 协议</td><td>off</td></tr><tr><td><code>backlog</code></td><td>TCP 连接队列长度</td><td>-1（系统默认）</td></tr><tr><td><code>rcvbuf</code></td><td>接收缓冲区大小</td><td>系统默认</td></tr><tr><td><code>sndbuf</code></td><td>发送缓冲区大小</td><td>系统默认</td></tr><tr><td><code>deferred</code></td><td>延迟 accept()</td><td>off</td></tr><tr><td><code>bind</code></td><td>强制绑定到 address:port</td><td>自动决定</td></tr><tr><td><code>ipv6only</code></td><td>仅接受 IPv6 连接</td><td>系统默认</td></tr><tr><td><code>reuseport</code></td><td>允许多个 socket 绑定同一端口</td><td>off</td></tr><tr><td><code>so_keepalive</code></td><td>TCP keepalive 设置</td><td>off</td></tr></tbody></table><h3 id="listen-与-ipv6" tabindex="-1"><a class="header-anchor" href="#listen-与-ipv6"><span>listen 与 IPv6</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 同时监听 IPv4 和 IPv6</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#ABB2BF;">[::]:80;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 仅监听 IPv4</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#ABB2BF;">0.0.0.0:80;              </span><span style="color:#7F848E;font-style:italic;"># 明确绑定 IPv4 地址</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：在双栈系统上，listen 80; 会同时监听 IPv4 和 IPv6</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果需要仅监听 IPv4，必须使用 listen 0.0.0.0:80;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果需要同时监听 IPv4 和 IPv6，可显式写出：</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#ABB2BF;">[::]:80;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">reuseport 参数</p><p><code>reuseport</code> 参数允许 Nginx 的多个 worker 进程各自创建独立的监听 socket，内核将入站连接均匀分配给各 worker。这可以减少 worker 之间的锁竞争，显著提升高并发场景下的性能。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 启用 reuseport</span></span>
<span class="line"><span style="color:#C678DD;">listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;"> reuseport;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># QUIC 必须使用 reuseport</span></span>
<span class="line"><span style="color:#C678DD;">listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> quic reuseport;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：<code>reuseport</code> 只需在一个 <code>listen</code> 指令中指定，其他绑定相同 <code>address:port</code> 的 <code>listen</code> 指令会自动复用。</p></div><h3 id="http-2-和-http-3-配置" tabindex="-1"><a class="header-anchor" href="#http-2-和-http-3-配置"><span>HTTP/2 和 HTTP/3 配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># HTTP/2 配置（需要 SSL）</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.key;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTP/3 配置（需要 QUIC + reuseport）</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> quic reuseport;</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;  </span><span style="color:#7F848E;font-style:italic;"># 同时支持 HTTP/2 降级</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 通知浏览器支持 HTTP/3</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Alt-Svc </span><span style="color:#98C379;">&#39;h3=&quot;:443&quot;; ma=86400&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="多-server-块匹配算法" tabindex="-1"><a class="header-anchor" href="#多-server-块匹配算法"><span>多 server 块匹配算法</span></a></h2><p>当多个 <code>server</code> 块的 <code>listen</code> 指令可以匹配同一个请求时，Nginx 使用以下算法确定使用哪个 <code>server</code> 块：</p><h3 id="匹配算法流程" tabindex="-1"><a class="header-anchor" href="#匹配算法流程"><span>匹配算法流程</span></a></h3>`,51),i(d,{code:`eJxLy8kvT85ILCpRCHHhUgACx+gX67c/29j0tGPDi337YhV0de0UnKpzMotLUvMUnvbsfNnaWwtW6ASSqnm+ad/zhes8A6wC8otKahSco5/s3f98ygqIMET581ktEO2xSPpeNswCSkE0uUA1Pd2xLCU1LbE0pyS+OLWoLLUIqBNTD9wuV5hda9Y82dHwZMcquHWxXGBdzmDHu1VDDIvPS8xNRfGBC0QezHaFssEcNySvQTTUKLhj9xnEbIgrIdqedvY+39MAcevzNctqFDygOp/NaXg5dT9cAmIEss5naxc/7Zj5YuEKYMA/3dNfo+CJ04cQpSiapy+AOdULqg01MKGBUlxSmZOq4K6QlpmTY6WcbJFqlmyJJOEBlUhKAupOQpLwhEqkpaUZpxogSXjBJZJTUoy4ALsQDFE=`}),o[3]||=n(`<h3 id="详细匹配步骤" tabindex="-1"><a class="header-anchor" href="#详细匹配步骤"><span>详细匹配步骤</span></a></h3><h4 id="步骤-1-listen-匹配" tabindex="-1"><a class="header-anchor" href="#步骤-1-listen-匹配"><span>步骤 1：listen 匹配</span></a></h4><p>Nginx 首先根据 <code>listen</code> 指令筛选候选的 <code>server</code> 块：</p><ol><li>精确匹配 <code>address:port</code>（如 <code>192.168.1.10:80</code>）的 server 块优先</li><li>如果没有精确匹配，使用匹配 <code>*:port</code>（如 <code>listen 80</code>）的 server 块</li><li>如果都没有匹配，使用 <code>default_server</code></li></ol><h4 id="步骤-2-server-name-匹配" tabindex="-1"><a class="header-anchor" href="#步骤-2-server-name-匹配"><span>步骤 2：server_name 匹配</span></a></h4><p>在 <code>listen</code> 匹配的候选 server 块中，按以下优先级匹配 <code>server_name</code>：</p><ol><li>精确匹配</li><li>最长前缀通配符（如 <code>*.example.com</code>）</li><li>最长后缀通配符（如 <code>www.*</code>）</li><li>第一个匹配的正则表达式（按配置文件中的出现顺序）</li></ol><h4 id="步骤-3-兜底处理" tabindex="-1"><a class="header-anchor" href="#步骤-3-兜底处理"><span>步骤 3：兜底处理</span></a></h4><p>如果 <code>server_name</code> 也没有匹配，使用 <code>default_server</code>；如果没有显式定义 <code>default_server</code>，使用配置文件中第一个 <code>server</code> 块。</p><h3 id="匹配示例" tabindex="-1"><a class="header-anchor" href="#匹配示例"><span>匹配示例</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Server A</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Server B</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">*.example.com;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Server C</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^api\\..+\\.com$</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Server D</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#D19A66;"> default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>请求 Host</th><th>匹配结果</th><th>原因</th></tr></thead><tbody><tr><td><code>example.com</code></td><td>Server A</td><td>精确匹配优先级最高</td></tr><tr><td><code>www.example.com</code></td><td>Server B</td><td>前缀通配符匹配</td></tr><tr><td><code>api.example.com</code></td><td>Server B</td><td>前缀通配符优先于正则</td></tr><tr><td><code>api.another.com</code></td><td>Server C</td><td>正则匹配</td></tr><tr><td><code>unknown.com</code></td><td>Server D</td><td>无匹配，使用 default_server</td></tr><tr><td><code>sub.api.example.com</code></td><td>Server B</td><td>前缀通配符匹配（<code>*.example.com</code> 匹配多级子域名... 不对，只匹配一级）</td></tr></tbody></table><div class="hint-container warning"><p class="hint-container-title">通配符的标签匹配</p><p><code>*.example.com</code> 只匹配一级子域名（如 <code>www.example.com</code>），不匹配多级子域名（如 <code>sub.api.example.com</code>）。要匹配多级子域名，需要使用正则表达式。</p></div><h3 id="多个-server-name-的情况" tabindex="-1"><a class="header-anchor" href="#多个-server-name-的情况"><span>多个 server_name 的情况</span></a></h3><p>一个 <code>server</code> 块可以有多个 <code>server_name</code>：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 同时匹配两个域名</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>等价于：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">www.example.com;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ... 相同配置</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但推荐使用第一种方式，避免配置重复。</p><h2 id="实战-多站点配置示例" tabindex="-1"><a class="header-anchor" href="#实战-多站点配置示例"><span>实战：多站点配置示例</span></a></h2><h3 id="场景-一个-nginx-托管多个业务站点" tabindex="-1"><a class="header-anchor" href="#场景-一个-nginx-托管多个业务站点"><span>场景：一个 Nginx 托管多个业务站点</span></a></h3><p>假设需要在一台服务器上托管以下站点：</p><ul><li><code>www.example.com</code>：公司官网</li><li><code>shop.example.com</code>：电商平台</li><li><code>api.example.com</code>：API 服务</li><li><code>admin.example.com</code>：管理后台</li><li><code>cdn.example.com</code>：静态资源 CDN</li></ul><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 通用配置</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">      mime.types;</span></span>
<span class="line"><span style="color:#C678DD;">    default_type </span><span style="color:#ABB2BF;"> application/octet-stream;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 日志格式</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#D19A66;">main</span><span style="color:#98C379;"> &#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot;&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 限流区域</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=api_limit:10m rate=100r/s;</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=shop_limit:10m rate=50r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 上游服务定义</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> api_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 127.0.0.1:8080;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 127.0.0.1:8081;</span></span>
<span class="line"><span style="color:#C678DD;">        keepalive </span><span style="color:#D19A66;">32</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> shop_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 127.0.0.1:3000;</span></span>
<span class="line"><span style="color:#C678DD;">        keepalive </span><span style="color:#D19A66;">16</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> admin_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 127.0.0.1:9000;</span></span>
<span class="line"><span style="color:#C678DD;">        keepalive </span><span style="color:#D19A66;">8</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 默认服务器 - 拒绝不匹配的请求</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#D19A66;"> default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl </span><span style="color:#D19A66;">default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/default.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/default.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 444</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # HTTP → HTTPS 重定向</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">www.example.com shop.example.com api.example.com admin.example.com cdn.example.com;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 301</span><span style="color:#ABB2BF;"> https://$</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # www.example.com - 公司官网</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/www.example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/www.example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/official;</span></span>
<span class="line"><span style="color:#C678DD;">        index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ /index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /about/ {</span></span>
<span class="line"><span style="color:#C678DD;">            try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ /index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#ABB2BF;">/var/log/nginx/www_access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # shop.example.com - 电商平台</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">shop.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/shop.example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/shop.example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=shop_limit burst=20 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://shop_backend;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /static/ {</span></span>
<span class="line"><span style="color:#C678DD;">            alias </span><span style="color:#ABB2BF;">/var/www/shop/static/;</span></span>
<span class="line"><span style="color:#C678DD;">            expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, immutable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#ABB2BF;">/var/log/nginx/shop_access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # api.example.com - API 服务</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/api.example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/api.example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=api_limit burst=50 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # API 文档</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /docs/ {</span></span>
<span class="line"><span style="color:#C678DD;">            root </span><span style="color:#ABB2BF;">/var/www/api-docs;</span></span>
<span class="line"><span style="color:#C678DD;">            index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#ABB2BF;">/var/log/nginx/api_access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # admin.example.com - 管理后台</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">admin.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/admin.example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/admin.example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # IP 白名单</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">192.168.1.0/24;</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # Basic 认证</span></span>
<span class="line"><span style="color:#C678DD;">        auth_basic </span><span style="color:#98C379;">&quot;Admin Area&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        auth_basic_user_file </span><span style="color:#ABB2BF;">/etc/nginx/.htpasswd;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://admin_backend;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#ABB2BF;">/var/log/nginx/admin_access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # cdn.example.com - 静态资源 CDN</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">cdn.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/cdn.example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/cdn.example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 禁用日志以提升性能</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # access_log off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/cdn;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /images/ {</span></span>
<span class="line"><span style="color:#C678DD;">            expires </span><span style="color:#D19A66;">365d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, immutable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            add_header </span><span style="color:#ABB2BF;">Access-Control-Allow-Origin </span><span style="color:#98C379;">&quot;*&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /css/ {</span></span>
<span class="line"><span style="color:#C678DD;">            expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            add_header </span><span style="color:#ABB2BF;">Access-Control-Allow-Origin </span><span style="color:#98C379;">&quot;*&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /js/ {</span></span>
<span class="line"><span style="color:#C678DD;">            expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            add_header </span><span style="color:#ABB2BF;">Access-Control-Allow-Origin </span><span style="color:#98C379;">&quot;*&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /fonts/ {</span></span>
<span class="line"><span style="color:#C678DD;">            expires </span><span style="color:#D19A66;">365d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, immutable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            add_header </span><span style="color:#ABB2BF;">Access-Control-Allow-Origin </span><span style="color:#98C379;">&quot;*&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 开启 gzip</span></span>
<span class="line"><span style="color:#C678DD;">        gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        gzip_types </span><span style="color:#ABB2BF;">text/css application/javascript application/json image/svg+xml;</span></span>
<span class="line"><span style="color:#C678DD;">        gzip_min_length </span><span style="color:#D19A66;">1024</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#ABB2BF;">/var/log/nginx/cdn_access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用-include-简化配置" tabindex="-1"><a class="header-anchor" href="#使用-include-简化配置"><span>使用 include 简化配置</span></a></h3><p>当站点数量增多时，可以将每个 <code>server</code> 块放在单独的文件中：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>/etc/nginx/</span></span>
<span class="line"><span>├── nginx.conf</span></span>
<span class="line"><span>├── conf.d/</span></span>
<span class="line"><span>│   ├── default.conf</span></span>
<span class="line"><span>│   ├── www.example.com.conf</span></span>
<span class="line"><span>│   ├── shop.example.com.conf</span></span>
<span class="line"><span>│   ├── api.example.com.conf</span></span>
<span class="line"><span>│   ├── admin.example.com.conf</span></span>
<span class="line"><span>│   └── cdn.example.com.conf</span></span>
<span class="line"><span>├── snippets/</span></span>
<span class="line"><span>│   ├── ssl-params.conf</span></span>
<span class="line"><span>│   ├── proxy-params.conf</span></span>
<span class="line"><span>│   └── security-headers.conf</span></span>
<span class="line"><span>└── ssl/</span></span>
<span class="line"><span>    ├── www.example.com.crt</span></span>
<span class="line"><span>    ├── www.example.com.key</span></span>
<span class="line"><span>    └── ...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>主配置文件：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">      mime.types;</span></span>
<span class="line"><span style="color:#C678DD;">    default_type </span><span style="color:#ABB2BF;"> application/octet-stream;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#D19A66;">main</span><span style="color:#98C379;"> &#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot;&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 包含所有站点配置</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/conf.d/*.conf;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>共享配置片段：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/snippets/proxy-params.conf</span></span>
<span class="line"><span style="color:#C678DD;">proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>站点配置：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/conf.d/api.example.com.conf</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> api_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 127.0.0.1:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 127.0.0.1:8081;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive </span><span style="color:#D19A66;">32</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 301</span><span style="color:#ABB2BF;"> https://$</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/api.example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/api.example.com.key;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">snippets/ssl-params.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        include </span><span style="color:#ABB2BF;">snippets/proxy-params.conf;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="server-块配置优化" tabindex="-1"><a class="header-anchor" href="#server-块配置优化"><span>server 块配置优化</span></a></h2><h3 id="连接优化" tabindex="-1"><a class="header-anchor" href="#连接优化"><span>连接优化</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # TCP 优化</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;      </span><span style="color:#7F848E;font-style:italic;"># 禁用 Nagle 算法，减少延迟</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;       </span><span style="color:#7F848E;font-style:italic;"># 优化数据包发送</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # keepalive 优化</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_requests </span><span style="color:#D19A66;">5000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 发送超时</span></span>
<span class="line"><span style="color:#C678DD;">    send_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安全加固" tabindex="-1"><a class="header-anchor" href="#安全加固"><span>安全加固</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 隐藏 Nginx 版本</span></span>
<span class="line"><span style="color:#C678DD;">    server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 安全头</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-XSS-Protection </span><span style="color:#98C379;">&quot;1; mode=block&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Referrer-Policy </span><span style="color:#98C379;">&quot;strict-origin-when-cross-origin&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # HSTS</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Strict-Transport-Security </span><span style="color:#98C379;">&quot;max-age=31536000; includeSubDomains; preload&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SSL 配置</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_protocols </span><span style="color:#ABB2BF;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_ciphers </span><span style="color:#ABB2BF;">ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_prefer_server_ciphers </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_session_cache </span><span style="color:#ABB2BF;">shared:SSL:10m;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_session_timeout </span><span style="color:#D19A66;">1d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_session_tickets </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # OCSP Stapling</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_stapling </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_stapling_verify </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_trusted_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/ca-bundle.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    resolver </span><span style="color:#D19A66;">8.8.8.8</span><span style="color:#D19A66;"> 8.8.4.4</span><span style="color:#ABB2BF;"> valid=300s;</span></span>
<span class="line"><span style="color:#C678DD;">    resolver_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="性能监控" tabindex="-1"><a class="header-anchor" href="#性能监控"><span>性能监控</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">localhost;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Nginx 状态页面</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /nginx_status {</span></span>
<span class="line"><span style="color:#C678DD;">        stub_status</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#D19A66;">127.0.0.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>状态页面输出示例：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Active connections: 291</span></span>
<span class="line"><span>server accepts handled requests</span></span>
<span class="line"><span>  16630948 16630948 31070465</span></span>
<span class="line"><span>Reading: 6 Writing: 179 Waiting: 106</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>指标</th><th>说明</th></tr></thead><tbody><tr><td>Active connections</td><td>当前活跃的客户端连接数</td></tr><tr><td>accepts</td><td>已接受的连接总数</td></tr><tr><td>handled</td><td>已处理的连接总数（通常与 accepts 相同）</td></tr><tr><td>requests</td><td>客户端请求总数（含 keepalive 复用连接上的请求）</td></tr><tr><td>Reading</td><td>正在读取请求头的连接数</td></tr><tr><td>Writing</td><td>正在发送响应的连接数</td></tr><tr><td>Waiting</td><td>空闲 keepalive 连接数</td></tr></tbody></table><h2 id="server-块常见问题与排查" tabindex="-1"><a class="header-anchor" href="#server-块常见问题与排查"><span>server 块常见问题与排查</span></a></h2><h3 id="问题-1-server-name-不匹配" tabindex="-1"><a class="header-anchor" href="#问题-1-server-name-不匹配"><span>问题 1：server_name 不匹配</span></a></h3><p><strong>现象</strong>：请求被错误的 server 块处理</p><p><strong>排查</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 测试 Host 头</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -H</span><span style="color:#98C379;"> &quot;Host: example.com&quot;</span><span style="color:#98C379;"> http://192.168.1.10/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查 Nginx 配置中 server_name 的匹配</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -A5</span><span style="color:#98C379;"> &quot;server_name&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>常见原因</strong>：</p><ol><li><code>server_name</code> 拼写错误</li><li>通配符使用不当（<code>*.example.com</code> 不匹配 <code>example.com</code>）</li><li>正则表达式语法错误</li></ol><h3 id="问题-2-default-server-意外行为" tabindex="-1"><a class="header-anchor" href="#问题-2-default-server-意外行为"><span>问题 2：default_server 意外行为</span></a></h3><p><strong>现象</strong>：不认识的域名返回了某个站点的页面</p><p><strong>原因</strong>：未显式配置 <code>default_server</code>，第一个 server 块成为默认服务器</p><p><strong>解决</strong>：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 在所有站点之前配置 default_server</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#D19A66;"> default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl </span><span style="color:#D19A66;">default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/default.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/default.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 444</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 直接关闭连接</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="问题-3-端口冲突" tabindex="-1"><a class="header-anchor" href="#问题-3-端口冲突"><span>问题 3：端口冲突</span></a></h3><p><strong>现象</strong>：Nginx 启动失败，错误信息 <code>bind() to 0.0.0.0:80 failed (98: Address already in use)</code></p><p><strong>排查</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看占用端口的进程</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> lsof</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> :80</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ss</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> :80</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 Nginx 监听的端口</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> listen</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>解决</strong>：</p><ol><li>停止占用端口的进程</li><li>修改 Nginx 监听端口</li><li>使用 <code>SO_REUSEPORT</code> 选项</li></ol><h3 id="问题-4-server-name-正则表达式性能" tabindex="-1"><a class="header-anchor" href="#问题-4-server-name-正则表达式性能"><span>问题 4：server_name 正则表达式性能</span></a></h3><p><strong>现象</strong>：高并发时 CPU 使用率异常</p><p><strong>原因</strong>：复杂的 <code>server_name</code> 正则表达式在每次请求时都要执行</p><p><strong>优化</strong>：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 不推荐：复杂正则</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(www\\.)?(api|shop|admin)\\.(v[0-9]+\\.)?example\\.com$</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 推荐：使用精确匹配和通配符</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">www.example.com;</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">shop.example.com;</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">*.example.com;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">server_name 性能建议</p><ol><li>优先使用精确匹配，性能最好</li><li>其次使用通配符匹配，性能较好</li><li>尽量避免正则表达式，性能最差</li><li>如果必须使用正则，尽量简化模式</li><li>将高流量站点的 server 块放在配置文件前面</li></ol></div><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2><p>Nginx 的虚拟主机机制通过 <code>server</code> 块实现了在单台服务器上托管多个站点的能力。理解以下核心要点是正确配置虚拟主机的基础：</p><ol><li><strong>三种虚拟主机类型</strong>：基于 IP、基于端口、基于域名，其中基于域名是生产环境的主流</li><li><strong>server_name 匹配优先级</strong>：精确 &gt; 前缀通配符 &gt; 后缀通配符 &gt; 正则 &gt; default_server</li><li><strong>listen 指令</strong>：决定了 server 块监听的地址和端口，支持 SSL、HTTP/2、HTTP/3 等参数</li><li><strong>default_server</strong>：必须显式配置以防止意外行为</li><li><strong>配置组织</strong>：使用 <code>include</code> 和独立配置文件管理大量站点</li></ol><div class="hint-container tip"><p class="hint-container-title">进一步阅读</p><ul><li><a href="https://nginx.org/en/docs/http/ngx_http_core_module.html#server_name" target="_blank" rel="noopener noreferrer">ngx_http_core_module - server_name</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_core_module.html#listen" target="_blank" rel="noopener noreferrer">ngx_http_core_module - listen</a></li><li><a href="https://nginx.org/en/docs/http/server_names.html" target="_blank" rel="noopener noreferrer">Nginx Server Names</a></li></ul></div>`,71)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};