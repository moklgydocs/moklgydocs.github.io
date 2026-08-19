import{M as e,O as t,d as n,h as r,p as i}from"./runtime-core.esm-bundler-jC72uHyJ.js";import{t as a}from"./app-CQDU0Gm9.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/08_%E9%AB%98%E7%BA%A7%E7%89%B9%E6%80%A7%E4%B8%8E%E6%89%A9%E5%B1%95/02_Stream%E5%9B%9B%E5%B1%82%E4%BB%A3%E7%90%86%E4%B8%8E%E9%82%AE%E4%BB%B6%E4%BB%A3%E7%90%86.html","title":"Stream 四层代理与邮件代理","lang":"zh-CN","frontmatter":{"title":"Stream 四层代理与邮件代理","icon":"fa6-solid:water","order":2,"category":["Linux","Nginx"],"tag":["Nginx","Stream","TCP代理","UDP代理","四层代理","邮件代理","SNI路由"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":9.96,"words":2988},"filePathRelative":"Linux/07_Nginx/08_高级特性与扩展/02_Stream四层代理与邮件代理.md"}`),s={name:`02_Stream四层代理与邮件代理.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),n(`div`,null,[o[0]||=i(`<h1 id="stream-四层代理与邮件代理" tabindex="-1"><a class="header-anchor" href="#stream-四层代理与邮件代理"><span>Stream 四层代理与邮件代理</span></a></h1><p>Nginx 不仅是 HTTP 七层代理，还能在传输层（TCP/UDP）做四层代理。<code>ngx_stream_core_module</code> 让 Nginx 可以代理 MySQL、Redis、PostgreSQL、gRPC 等任何 TCP/UDP 协议，还可以做邮件代理。本文系统讲解 Stream 模块的配置、负载均衡、SSL/TLS 和实际应用场景。</p><h2 id="_1-stream-模块概述与配置" tabindex="-1"><a class="header-anchor" href="#_1-stream-模块概述与配置"><span>1. stream 模块概述与配置</span></a></h2><h3 id="_1-1-四层代理架构" tabindex="-1"><a class="header-anchor" href="#_1-1-四层代理架构"><span>1.1 四层代理架构</span></a></h3>`,4),r(d,{code:`eJx1kk9L8zAYwO9+isB7Hn23rlN78OJQD1OqqacgUrdsK9RW2ooOdpiCOgXnbkNF55ShIFTE/07xyyxZd/IrmGVDKtZAngR+vyd5eHiyhrWWzmu2C9TkEGBr3NCx6SLindPyU+f6ZgFEImNgJqeb64hHAF0ba8uAXjXISW2BJ/UBE4vquFIE0wU4m0I8yqL4PxEqzeGM7iAe5YQ4PBoqKZNIsRw3Z+PeW1JcjIVqEE4htuXYLzyfZDg5AxHbsiSGYlhwDCuH+ocsReMhfwgQpopgSlUViHgEpFrptWeIu87qUs7WVvKAHB+T281266JT3e7svtDSJee9NRFFZP/A9zxaOyNbd59vR713WQX977gSQ/593X9/Jyc7fqPBFNtaNTMR21rSTcHAmuMupi3TFPKakw+kiYhsNMnrE70o0XqTpfnn12TvSmg/t9gREOOsTSlBTUHQaZV5+d9IQv7HKa00u4fVbqnefq6wC33YCBgJ5Hsf3ZpHK5ek/NgH2MwMOuAWDDzoWVY3DPkfjmalLA5APhADmB7BifRoAPJB+Asqkz/JF9Tr/ZA=`}),o[1]||=i(`<h3 id="_1-2-stream-上下文" tabindex="-1"><a class="header-anchor" href="#_1-2-stream-上下文"><span>1.2 stream 上下文</span></a></h3><p><code>stream</code> 上下文与 <code>http</code> 上下文平级，在 <code>main</code> 上下文中定义：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># nginx.conf</span></span>
<span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;">nginx;</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTP 七层代理</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Stream 四层代理（与 http 平级）</span></span>
<span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # TCP 代理</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> mysql_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:3306;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.11:3306;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">3306</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">mysql_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # UDP 代理</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> dns_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.20:53;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.21:53;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">53</span><span style="color:#ABB2BF;"> udp;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">dns_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">stream 与 http 的区别</p><ul><li><code>stream</code> 在 OSI 第四层（传输层）工作，不解析应用层协议</li><li><code>http</code> 在 OSI 第七层（应用层）工作，解析 HTTP 协议</li><li><code>stream</code> 中没有 <code>location</code> 指令，只有 <code>server</code> 块</li><li><code>stream</code> 不能使用 HTTP 相关的变量和指令（如 <code>$http_*</code>）</li><li><code>stream</code> 模块需要编译时包含：<code>--with-stream</code></li></ul></div><h2 id="_2-tcp-代理配置" tabindex="-1"><a class="header-anchor" href="#_2-tcp-代理配置"><span>2. TCP 代理配置</span></a></h2><h3 id="_2-1-基础-tcp-代理" tabindex="-1"><a class="header-anchor" href="#_2-1-基础-tcp-代理"><span>2.1 基础 TCP 代理</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # MySQL 代理</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> mysql_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:3306 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.11:3306 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.12:3306 backup;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">3306</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">mysql_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">300s</span><span style="color:#ABB2BF;">;         </span><span style="color:#7F848E;font-style:italic;"># 空闲连接超时</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_socket_keepalive </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># TCP Keep-Alive</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-proxy-timeout-详解" tabindex="-1"><a class="header-anchor" href="#_2-2-proxy-timeout-详解"><span>2.2 proxy_timeout 详解</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">3306</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 与上游建立连接的超时</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 两个连续的读或写操作之间的超时</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 适用于客户端↔Nginx 和 Nginx↔上游</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">300s</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 默认 10m</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # TCP Keep-Alive</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_socket_keepalive </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 代理下载速率限制</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_download_rate </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 0 = 不限速</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_upload_rate </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 0 = 不限速</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">mysql_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-tcp-代理完整配置" tabindex="-1"><a class="header-anchor" href="#_2-3-tcp-代理完整配置"><span>2.3 TCP 代理完整配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ========== MySQL 代理 ==========</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> mysql_cluster {</span></span>
<span class="line"><span style="color:#C678DD;">        least_conn</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 最少连接数负载均衡</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:3306 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;"> fail_timeout=10s;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.11:3306 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;"> fail_timeout=10s;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.12:3306 backup;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">13306</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 对外暴露 13306 端口</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">mysql_cluster;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">3s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">600s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_socket_keepalive </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ========== PostgreSQL 代理 ==========</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> pg_cluster {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.20:5432;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.21:5432;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">15432</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">pg_cluster;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">3s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">600s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ========== SSH 代理 ==========</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">10022</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">10.0.0.30:22;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">3600s</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># SSH 长连接</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_socket_keepalive </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-udp-代理配置" tabindex="-1"><a class="header-anchor" href="#_3-udp-代理配置"><span>3. UDP 代理配置</span></a></h2><h3 id="_3-1-基础-udp-代理" tabindex="-1"><a class="header-anchor" href="#_3-1-基础-udp-代理"><span>3.1 基础 UDP 代理</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> dns_servers {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 8.8.8.8:53;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 8.8.4.4:53;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">53</span><span style="color:#ABB2BF;"> udp;  </span><span style="color:#7F848E;font-style:italic;"># 必须指定 udp</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">dns_servers;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_responses </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 期望上游返回的 UDP 数据报数</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-proxy-responses" tabindex="-1"><a class="header-anchor" href="#_3-2-proxy-responses"><span>3.2 proxy_responses</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># proxy_responses: 期望上游对单个客户端请求返回的 UDP 数据报数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认值：0（不限）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设为 1 表示只接收一个响应就关闭连接</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DNS 通常是 1，Syslog 可能是 0（只发送不接收）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DNS 代理</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">53</span><span style="color:#ABB2BF;"> udp;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">dns_servers;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_responses </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># DNS 一个请求一个响应</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Syslog 代理（只转发，不接收响应）</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">514</span><span style="color:#ABB2BF;"> udp;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">syslog_servers;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_responses </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 不期望响应</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-udp-代理完整配置" tabindex="-1"><a class="header-anchor" href="#_3-3-udp-代理完整配置"><span>3.3 UDP 代理完整配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # DNS 代理</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> dns_servers {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 8.8.8.8:53;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 1.1.1.1:53;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">53</span><span style="color:#ABB2BF;"> udp;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">dns_servers;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">3s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_responses </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Syslog 代理</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> syslog_servers {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.40:514;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.41:514;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">1514</span><span style="color:#ABB2BF;"> udp;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">syslog_servers;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">1s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_responses </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # NTP 代理</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> ntp_servers {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> time.google.com:123;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> time.cloudflare.com:123;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">123</span><span style="color:#ABB2BF;"> udp;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">ntp_servers;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">3s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_responses </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-mysql-redis-代理实战" tabindex="-1"><a class="header-anchor" href="#_4-mysql-redis-代理实战"><span>4. MySQL/Redis 代理实战</span></a></h2><h3 id="_4-1-mysql-代理实战" tabindex="-1"><a class="header-anchor" href="#_4-1-mysql-代理实战"><span>4.1 MySQL 代理实战</span></a></h3>`,20),r(d,{code:`eJwrTi0sTc1LTnXJTEwvSszlUgCCgsSikszkzILEvBIFx4IChcRihae7pjyfsuLZnN6nXQufzlyBocwPpMgvPTOvQiG4pCgVi0G+hiAlvpXBgT4KvonFJalFmEqMEEqCcxLLUrnASoBO0LWz87NSCHEOUHixf96zvqUKhsbGBmZgWT+I3MuGzmfdK5/s6Hq2Y4eCRk4q0Ib45Py8PE24Il9DK4Wnu3c9X90NMQMs4WuoC9EPEYPIQ7UAJYBWo0mB5YpSk0sUitKTNIyMjXQUjExMgYSxMcQqsN78klSF/LLUIpDbdUAWv2zofzaj78nuxc8ntL3f0wMJqSc7el8sX/xs3gSon5/29r9Ytw5sSmpeCprnIUqezV/6Yv0iFD+92Lvmaf9EJAkkP015Onve892Tn82bg+4nsCaoFAAoZ8gB`}),o[2]||=i(`<div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # MySQL 读写分离（需要应用层支持）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 写请求 → Master</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> mysql_write {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:3306;  </span><span style="color:#7F848E;font-style:italic;"># Master</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 读请求 → Slave</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> mysql_read {</span></span>
<span class="line"><span style="color:#C678DD;">        least_conn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.11:3306;  </span><span style="color:#7F848E;font-style:italic;"># Slave 1</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.12:3306;  </span><span style="color:#7F848E;font-style:italic;"># Slave 2</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 写端口</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">13306</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">mysql_write;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">3s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">600s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_socket_keepalive </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 读端口</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">23306</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">mysql_read;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">3s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">600s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_socket_keepalive </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 访问控制</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">13306</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">mysql_write;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 仅允许内网访问</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">172.16.0.0/12;</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">192.168.0.0/16;</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-redis-代理实战" tabindex="-1"><a class="header-anchor" href="#_4-2-redis-代理实战"><span>4.2 Redis 代理实战</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Redis Cluster 代理</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> redis_cluster {</span></span>
<span class="line"><span style="color:#C678DD;">        least_conn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.50:6379 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=10s;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.51:6379 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=10s;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.52:6379 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=10s;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">16379</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">redis_cluster;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">1s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">300s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_socket_keepalive </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 连接限速</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_download_rate </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_upload_rate </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Redis Sentinel 代理</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> redis_sentinel {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.50:26379;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.51:26379;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.52:26379;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">26379</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">redis_sentinel;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">1s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-连接流程图" tabindex="-1"><a class="header-anchor" href="#_4-3-连接流程图"><span>4.3 连接流程图</span></a></h3>`,4),r(d,{code:`eJyVUVtLAkEYffdXDPYcUVBURFFaZje6vS0itu6asKntbpS4gUEXyUyFxBBUrAzK8lKiiyL+l3Bmx3+Rzlhsj83TfHO+c75z5uMF7zG77xBlsGs2gN6ZZ2DxAYXqWqGE2xl0mwcbLrfnxAaGh2fBQgBGorhY1CpNmAnPnRLGQh9S1v07W2sKMDFGn+g98dt9DkkCB37pULCzwpEkc+LMnjgyK3AOSbazXo8H4GoWt1owfYVzOaNNJ7XNOd2SAsx/pMT+47+lNr2S7BI5Ym2R0cn5XD9aNgPpN5GASwF4loeNOnoMomye5lsiSt1gCrevFGBhYLOhFcIwVO6o10hVtdT5rmmT/hUdTQnwqYKreQUsM7CcxqVERw131GBHfaU02mohU62MEUZvYCyOEmUUKeLWG4zGScbfXXxd3lFeLx5hmqlfcl8c3ElhJcVKgDrSXhrd5AeuXaBkbbCvFWIP3ZcUsMrAi89u8l3vnsIw9qwAK1WUZL/AgXnAuwVheogb5cd5TgdYBgA7yU2wUzpgeQDwPOt0jhm+Ac+IA8M=`}),o[3]||=i(`<h2 id="_5-stream-ssl-tls-配置" tabindex="-1"><a class="header-anchor" href="#_5-stream-ssl-tls-配置"><span>5. stream SSL/TLS 配置</span></a></h2><h3 id="_5-1-ssl-终端" tabindex="-1"><a class="header-anchor" href="#_5-1-ssl-终端"><span>5.1 SSL 终端</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # MySQL SSL 代理</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">13306</span><span style="color:#ABB2BF;"> ssl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate </span><span style="color:#ABB2BF;">/etc/ssl/certs/mysql-proxy.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/ssl/private/mysql-proxy.key;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_protocols </span><span style="color:#ABB2BF;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_ciphers </span><span style="color:#ABB2BF;">HIGH:!aNULL:!MD5;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_session_cache </span><span style="color:#ABB2BF;">shared:SSL:10m;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_session_timeout </span><span style="color:#D19A66;">1d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 客户端 → Nginx: SSL</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # Nginx → 上游: 可以是明文或SSL</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">mysql_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 到上游不使用SSL</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-ssl-透传-上游也使用-ssl" tabindex="-1"><a class="header-anchor" href="#_5-2-ssl-透传-上游也使用-ssl"><span>5.2 SSL 透传（上游也使用 SSL）</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">16379</span><span style="color:#ABB2BF;"> ssl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate </span><span style="color:#ABB2BF;">/etc/ssl/certs/redis-proxy.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/ssl/private/redis-proxy.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # Nginx → 上游也使用 SSL</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_certificate </span><span style="color:#ABB2BF;">/etc/ssl/certs/redis-client.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/ssl/private/redis-client.key;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_trusted_certificate </span><span style="color:#ABB2BF;">/etc/ssl/certs/ca.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_verify </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_ssl_name </span><span style="color:#ABB2BF;">redis.internal;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">redis_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-ssl-会话恢复" tabindex="-1"><a class="header-anchor" href="#_5-3-ssl-会话恢复"><span>5.3 SSL 会话恢复</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate </span><span style="color:#ABB2BF;">/etc/ssl/certs/wildcard.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/ssl/private/wildcard.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 会话缓存</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_session_cache </span><span style="color:#ABB2BF;">shared:STREAM_SSL:10m;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_session_timeout </span><span style="color:#D19A66;">1d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 会话票据</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_session_tickets </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # OCSP Stapling</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_stapling </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_stapling_verify </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-stream-负载均衡" tabindex="-1"><a class="header-anchor" href="#_6-stream-负载均衡"><span>6. stream 负载均衡</span></a></h2><h3 id="_6-1-负载均衡算法" tabindex="-1"><a class="header-anchor" href="#_6-1-负载均衡算法"><span>6.1 负载均衡算法</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 1. 轮询（默认）</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> round_robin {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.1:3306;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.2:3306;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 2. 最少连接数</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> least_conn {</span></span>
<span class="line"><span style="color:#C678DD;">        least_conn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.1:3306;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.2:3306;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 3. 哈希（基于IP或自定义Key）</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> ip_hash {</span></span>
<span class="line"><span style="color:#C678DD;">        hash </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;"> consistent;  </span><span style="color:#7F848E;font-style:italic;"># 一致性哈希</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.1:3306;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.2:3306;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.3:3306;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 4. 基于自定义Key的哈希</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 适合需要会话保持的场景</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> custom_hash {</span></span>
<span class="line"><span style="color:#C678DD;">        hash </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> consistent;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.1:3306;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.2:3306;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-服务器权重与参数" tabindex="-1"><a class="header-anchor" href="#_6-2-服务器权重与参数"><span>6.2 服务器权重与参数</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> backend {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # weight: 权重（默认1）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # max_fails: 最大失败次数（默认1）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # fail_timeout: 失败超时时间（默认10s）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # backup: 备份服务器</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # down: 标记为不可用</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.1:3306 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">5</span><span style="color:#ABB2BF;"> max_fails=3 </span><span style="color:#E06C75;font-style:italic;">fail_timeout</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        server 10.0.0.2:3306 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> max_fails=3 </span><span style="color:#E06C75;font-style:italic;">fail_timeout</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        server 10.0.0.3:3306 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        server 10.0.0.4:3306 backup;  </span><span style="color:#7F848E;font-style:italic;"># 仅在其他都不可用时使用</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.5:3306 down;    </span><span style="color:#7F848E;font-style:italic;"># 维护中</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-慢启动" tabindex="-1"><a class="header-anchor" href="#_6-3-慢启动"><span>6.3 慢启动</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.1:3306 </span><span style="color:#E06C75;font-style:italic;">slow_start</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        server 10.0.0.2:3306 </span><span style="color:#E06C75;font-style:italic;">slow_start</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # slow_start: 服务器恢复后，在30秒内逐步增加权重</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 避免恢复的服务器瞬间被大量连接压垮</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # ⚠️ 注意：slow_start 是 NGINX Plus 专属功能！</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 开源版 Nginx 使用 slow_start 会导致配置错误：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # &quot;invalid parameter &#39;slow_start=30s&#39;&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 开源版替代方案：使用 max_fails + fail_timeout 进行被动恢复</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-邮件代理-ngx-mail-proxy-module" tabindex="-1"><a class="header-anchor" href="#_7-邮件代理-ngx-mail-proxy-module"><span>7. 邮件代理：ngx_mail_proxy_module</span></a></h2><h3 id="_7-1-邮件代理概述" tabindex="-1"><a class="header-anchor" href="#_7-1-邮件代理概述"><span>7.1 邮件代理概述</span></a></h3><p>Nginx 的邮件代理模块支持 IMAP、POP3、SMTP 协议的代理：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 需要编译 --with-mail 参数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">mail</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 认证服务器</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Nginx 邮件代理需要外部认证服务</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">110</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># POP3</span></span>
<span class="line"><span style="color:#C678DD;">        protocol </span><span style="color:#ABB2BF;">pop3;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">backend_mail;</span></span>
<span class="line"><span style="color:#C678DD;">        pop3_auth </span><span style="color:#ABB2BF;">plain apop cram-md5;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">143</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># IMAP</span></span>
<span class="line"><span style="color:#C678DD;">        protocol </span><span style="color:#ABB2BF;">imap;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">backend_mail;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">25</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># SMTP</span></span>
<span class="line"><span style="color:#C678DD;">        protocol </span><span style="color:#ABB2BF;">smtp;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">backend_smtp;</span></span>
<span class="line"><span style="color:#C678DD;">        smtp_auth </span><span style="color:#ABB2BF;">login plain;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-邮件认证服务" tabindex="-1"><a class="header-anchor" href="#_7-2-邮件认证服务"><span>7.2 邮件认证服务</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">mail</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 认证服务配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Nginx 将用户凭证发送到认证服务验证</span></span>
<span class="line"><span style="color:#C678DD;">    auth_http </span><span style="color:#ABB2BF;">http://auth-service:8080/auth;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 认证超时</span></span>
<span class="line"><span style="color:#C678DD;">    auth_http_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">993</span><span style="color:#ABB2BF;"> ssl;  </span><span style="color:#7F848E;font-style:italic;"># IMAPS</span></span>
<span class="line"><span style="color:#C678DD;">        protocol </span><span style="color:#ABB2BF;">imap;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate </span><span style="color:#ABB2BF;">/etc/ssl/certs/mail.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/ssl/private/mail.key;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">backend_imap;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">995</span><span style="color:#ABB2BF;"> ssl;  </span><span style="color:#7F848E;font-style:italic;"># POP3S</span></span>
<span class="line"><span style="color:#C678DD;">        protocol </span><span style="color:#ABB2BF;">pop3;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate </span><span style="color:#ABB2BF;">/etc/ssl/certs/mail.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/ssl/private/mail.key;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">backend_pop3;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">587</span><span style="color:#ABB2BF;"> ssl;  </span><span style="color:#7F848E;font-style:italic;"># SMTP Submission</span></span>
<span class="line"><span style="color:#C678DD;">        protocol </span><span style="color:#ABB2BF;">smtp;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate </span><span style="color:#ABB2BF;">/etc/ssl/certs/mail.crt;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/ssl/private/mail.key;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">backend_smtp;</span></span>
<span class="line"><span style="color:#C678DD;">        smtp_auth </span><span style="color:#ABB2BF;">login plain cram-md5;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">邮件代理需要认证服务</p><p>Nginx 邮件代理本身不存储用户数据，需要配置 <code>auth_http</code> 指向一个 HTTP 认证服务。当客户端连接时，Nginx 通过 HTTP 请求将用户凭证发送给认证服务，认证服务返回允许连接的后端地址。</p><p>认证服务需要实现 HTTP 接口，接收 Nginx 的认证请求并返回后端服务器地址。这使得邮件代理不太常用，但在大型邮件系统中可以实现灵活的认证和路由。</p></div><h2 id="_8-sni-路由-stream-层" tabindex="-1"><a class="header-anchor" href="#_8-sni-路由-stream-层"><span>8. SNI 路由（stream 层）</span></a></h2><h3 id="_8-1-sni-路由原理" tabindex="-1"><a class="header-anchor" href="#_8-1-sni-路由原理"><span>8.1 SNI 路由原理</span></a></h3><p>TLS 握手时，客户端在 ClientHello 中发送 Server Name Indication（SNI），Nginx 可以根据 SNI 值路由到不同的上游：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 根据 SNI 路由到不同的后端</span></span>
<span class="line"><span style="color:#C678DD;">    map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">ssl_preread_server_name</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">        mysql.example.com  mysql_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        redis.example.com  redis_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        pg.example.com     pg_backend;</span></span>
<span class="line"><span style="color:#D19A66;">        default</span><span style="color:#ABB2BF;">            default_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> mysql_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:3306;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> redis_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.20:6379;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> pg_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.30:5432;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> default_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.1:443;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_preread </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 读取 SNI 但不终止 SSL</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-ssl-preread-模块" tabindex="-1"><a class="header-anchor" href="#_8-2-ssl-preread-模块"><span>8.2 SSL Preread 模块</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># ssl_preread 模块需要在编译时包含</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># --with-stream_ssl_preread_module</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 读取 TLS ClientHello 中的 SNI</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 不解密流量，直接转发</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_preread </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">SNI 路由的价值</p><p>SNI 路由让 Nginx 可以在四层根据域名做流量分发，而不需要终止 TLS。这在以下场景特别有用：</p><ol><li>多个 HTTPS 服务共享同一 IP 和端口</li><li>不想在代理层解密流量（零信任架构）</li><li>需要将 TLS 流量透传到后端</li></ol></div><h3 id="_8-3-sni-路由实战-多数据库服务" tabindex="-1"><a class="header-anchor" href="#_8-3-sni-路由实战-多数据库服务"><span>8.3 SNI 路由实战：多数据库服务</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 数据库服务路由</span></span>
<span class="line"><span style="color:#C678DD;">    map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">ssl_preread_server_name</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">db_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">        db-mysql.prod.example.com  mysql_prod;</span></span>
<span class="line"><span style="color:#ABB2BF;">        db-mysql.stg.example.com   mysql_stg;</span></span>
<span class="line"><span style="color:#ABB2BF;">        db-redis.prod.example.com  redis_prod;</span></span>
<span class="line"><span style="color:#ABB2BF;">        db-pg.prod.example.com     pg_prod;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> mysql_prod {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.1.0.10:3306;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> mysql_stg {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.2.0.10:3306;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> redis_prod {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.1.0.20:6379;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> pg_prod {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.1.0.30:5432;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">13306</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_preread </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">db_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">600s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-stream-与-http-模块协同工作" tabindex="-1"><a class="header-anchor" href="#_9-stream-与-http-模块协同工作"><span>9. stream 与 HTTP 模块协同工作</span></a></h2><h3 id="_9-1-同时提供四层和七层代理" tabindex="-1"><a class="header-anchor" href="#_9-1-同时提供四层和七层代理"><span>9.1 同时提供四层和七层代理</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># nginx.conf 完整配置</span></span>
<span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;">nginx;</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 七层代理</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 四层代理</span></span>
<span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # MySQL 代理</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> mysql {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:3306;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">13306</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">mysql;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Redis 代理</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> redis {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.20:6379;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">16379</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">redis;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SNI 路由：根据域名分发 HTTPS 流量</span></span>
<span class="line"><span style="color:#C678DD;">    map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">ssl_preread_server_name</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">https_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">        api.example.com   api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ws.example.com    ws_backend;</span></span>
<span class="line"><span style="color:#D19A66;">        default</span><span style="color:#ABB2BF;">           default_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> api_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.100:443;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> ws_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.101:443;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> default_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.102:443;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_preread </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">https_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-stream-模块的日志" tabindex="-1"><a class="header-anchor" href="#_9-2-stream-模块的日志"><span>9.2 stream 模块的日志</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#ABB2BF;">stream_log </span><span style="color:#98C379;">&#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;$</span><span style="color:#E06C75;">protocol</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">bytes_sent</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">bytes_received</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;$</span><span style="color:#E06C75;">session_time</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">upstream_addr</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;&quot;$</span><span style="color:#E06C75;">upstream_bytes_sent</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">upstream_bytes_received</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;&quot;$</span><span style="color:#E06C75;">upstream_connect_time</span><span style="color:#98C379;">&quot;&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/stream_access.log stream_log buffer=32k flush=5s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">3306</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">mysql_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-stream-模块的变量" tabindex="-1"><a class="header-anchor" href="#_9-3-stream-模块的变量"><span>9.3 stream 模块的变量</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># stream 模块可用的变量</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $remote_addr        客户端IP</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $remote_port        客户端端口</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $server_addr        服务器IP</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $server_port        服务器端口</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $protocol           协议（TCP/UDP）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $status             连接状态码</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $bytes_sent         发送字节数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $bytes_received     接收字节数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $session_time       会话时间（秒）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $upstream_addr      上游地址</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $upstream_bytes_sent      发送到上游的字节数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $upstream_bytes_received  从上游接收的字节数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $upstream_connect_time    与上游建立连接的时间</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $ssl_preread_server_name  SNI 域名（需 ssl_preread on）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-stream-健康检查" tabindex="-1"><a class="header-anchor" href="#_10-stream-健康检查"><span>10. stream 健康检查</span></a></h2><h3 id="_10-1-被动健康检查" tabindex="-1"><a class="header-anchor" href="#_10-1-被动健康检查"><span>10.1 被动健康检查</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> mysql_backend {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 被动健康检查（内置）</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:3306 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.11:3306 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.12:3306 backup;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">3306</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">mysql_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">300s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-主动健康检查" tabindex="-1"><a class="header-anchor" href="#_10-2-主动健康检查"><span>10.2 主动健康检查</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 需要 nginx-plus 或第三方模块</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 开源版本可以使用 lua 实现</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> mysql_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:3306;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.11:3306;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">3306</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">mysql_backend;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 使用 Lua 做简单健康检查</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 周期性尝试连接上游</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 外部健康检查脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># mysql_healthcheck.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">UPSTREAMS</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;10.0.0.10:3306&quot;</span><span style="color:#98C379;"> &quot;10.0.0.11:3306&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> upstream</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">UPSTREAMS</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#E06C75;">    host</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#56B6C2;">echo</span><span style="color:#E06C75;"> $upstream</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">cut</span><span style="color:#D19A66;"> -d:</span><span style="color:#D19A66;"> -f1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    port</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#56B6C2;">echo</span><span style="color:#E06C75;"> $upstream</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">cut</span><span style="color:#D19A66;"> -d:</span><span style="color:#D19A66;"> -f2</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 尝试 TCP 连接</span></span>
<span class="line"><span style="color:#61AFEF;">    timeout</span><span style="color:#D19A66;"> 3</span><span style="color:#98C379;"> bash</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;echo &gt; /dev/tcp/</span><span style="color:#E06C75;">$host</span><span style="color:#98C379;">/</span><span style="color:#E06C75;">$port</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#E5C07B;">$?</span><span style="color:#56B6C2;"> -eq</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;OK: </span><span style="color:#E06C75;">$upstream</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;FAIL: </span><span style="color:#E06C75;">$upstream</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_11-完整生产级配置模板" tabindex="-1"><a class="header-anchor" href="#_11-完整生产级配置模板"><span>11. 完整生产级配置模板</span></a></h2><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;">nginx;</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 日志格式</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#ABB2BF;">stream_log </span><span style="color:#98C379;">&#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;$</span><span style="color:#E06C75;">protocol</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">bytes_sent</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">bytes_received</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;$</span><span style="color:#E06C75;">session_time</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">upstream_addr</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                          &#39;$</span><span style="color:#E06C75;">upstream_connect_time</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/stream.log stream_log buffer=32k flush=5s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ========== MySQL 代理 ==========</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> mysql_prod {</span></span>
<span class="line"><span style="color:#C678DD;">        least_conn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.1.0.10:3306 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.1.0.11:3306 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.1.0.12:3306 backup;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">13306</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">mysql_prod;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">600s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_socket_keepalive </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 访问控制</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">172.16.0.0/12;</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ========== Redis 代理 ==========</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> redis_prod {</span></span>
<span class="line"><span style="color:#C678DD;">        least_conn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.1.0.20:6379 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=10s;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.1.0.21:6379 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=10s;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">16379</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">redis_prod;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">3s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">300s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_socket_keepalive </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ========== SNI 路由 ==========</span></span>
<span class="line"><span style="color:#C678DD;">    map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">ssl_preread_server_name</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">sni_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">        api.example.com   api_https;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ws.example.com    ws_https;</span></span>
<span class="line"><span style="color:#D19A66;">        default</span><span style="color:#ABB2BF;">           default_https;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> api_https { </span><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> 10.1.0.100:443; }</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> ws_https  { </span><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> 10.1.0.101:443; }</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> default_https { </span><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> 10.1.0.102:443; }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        ssl_preread </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">sni_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_timeout </span><span style="color:#D19A66;">300s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_12-参考文档" tabindex="-1"><a class="header-anchor" href="#_12-参考文档"><span>12. 参考文档</span></a></h2><ul><li><a href="https://nginx.org/en/docs/stream/ngx_stream_core_module.html" target="_blank" rel="noopener noreferrer">Nginx ngx_stream_core_module</a></li><li><a href="https://nginx.org/en/docs/stream/ngx_stream_proxy_module.html" target="_blank" rel="noopener noreferrer">Nginx ngx_stream_proxy_module</a></li><li><a href="https://nginx.org/en/docs/stream/ngx_stream_ssl_module.html" target="_blank" rel="noopener noreferrer">Nginx ngx_stream_ssl_module</a></li><li><a href="https://nginx.org/en/docs/stream/ngx_stream_ssl_preread_module.html" target="_blank" rel="noopener noreferrer">Nginx ngx_stream_ssl_preread_module</a></li><li><a href="https://nginx.org/en/docs/mail/ngx_mail_proxy_module.html" target="_blank" rel="noopener noreferrer">Nginx ngx_mail_proxy_module</a></li><li><a href="https://nginx.org/en/docs/stream/ngx_stream_log_module.html" target="_blank" rel="noopener noreferrer">Nginx Stream Log Format</a></li></ul>`,47)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};