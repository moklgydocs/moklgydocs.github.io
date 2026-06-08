import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-Xe9WRGmJ.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/01_Nginx%E5%9F%BA%E7%A1%80%E4%B8%8E%E6%9E%B6%E6%9E%84/04_Nginx%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E4%BD%93%E7%B3%BB.html","title":"Nginx 配置文件体系","lang":"zh-CN","frontmatter":{"title":"Nginx 配置文件体系","icon":"fa6-solid:file-code","order":4,"category":["Linux","Nginx"],"tag":["Nginx","配置文件","include","目录组织","多环境配置"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":18.07,"words":5421},"filePathRelative":"Linux/07_Nginx/01_Nginx基础与架构/04_Nginx配置文件体系.md"}`),s={name:`04_Nginx配置文件体系.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="nginx-配置文件体系" tabindex="-1"><a class="header-anchor" href="#nginx-配置文件体系"><span>Nginx 配置文件体系</span></a></h1><h2 id="_1-nginx-conf-全局结构" tabindex="-1"><a class="header-anchor" href="#_1-nginx-conf-全局结构"><span>1. nginx.conf 全局结构</span></a></h2><h3 id="_1-1-配置文件层次结构" tabindex="-1"><a class="header-anchor" href="#_1-1-配置文件层次结构"><span>1.1 配置文件层次结构</span></a></h3><p>Nginx 的配置文件采用树形嵌套结构，由多个上下文块（Context Block）组成，每个块包含特定功能域的指令。</p>`,4),i(d,{code:`eJx1kk1PwkAQhu/+iqZcBbGICAeTQlpt0kIDlcQ0hDTNFppsPyyVBI2JF8WPuzeNR6/eOPBzgMQTf8Fll5YWlp6anWfemXlneoHh9xmtesCgT+Glus46hu0upy/zp5/57+Ns8jabvC8+xsvpK9thstlzRmgLda2ls2AI3HDA3OdyuQe2Ewtg5lLTVJ3th6FPj7e0psArOjsIA2A4dAb9yLgbGMcxsNLGwJUaydz6FKGYawnNttBExUAwBAGdUXjUr2Ok242j2rUqoInDkQ/SA29qqLKkoRI+tMOuCe0da2LyQmjobA949KgsKSsdaDtIJwA33TvPBcwRQx5Mz3XxS+QFGY1kNmq8JjXQAqFnGqHtuakKCVISdda20qZG2SljuY2z6CD+Pr8W3+P5+Bmfwm6WJCJ+W5cIpVQLe/aVQEmzSG5rZdGByAkKydGoQTiCgByTZUNYyYhiscRxh6YHvaCSsSwrgWH7CXZS48Vino6Ry1+D3HH5VCzQwfUoUeHyWX6PIp6FYOUaV6qmsH9dzwx0`}),o[1]||=n(`<h3 id="_1-2-完整配置文件结构" tabindex="-1"><a class="header-anchor" href="#_1-2-完整配置文件结构"><span>1.2 完整配置文件结构</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/nginx.conf - 完整结构示例</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== main 上下文（全局配置） =====</span></span>
<span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;">nginx;                          </span><span style="color:#7F848E;font-style:italic;"># Worker 进程运行用户</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;               </span><span style="color:#7F848E;font-style:italic;"># Worker 进程数</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;         </span><span style="color:#7F848E;font-style:italic;"># 文件描述符限制</span></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 错误日志</span></span>
<span class="line"><span style="color:#C678DD;">pid </span><span style="color:#ABB2BF;">/var/run/nginx.pid;              </span><span style="color:#7F848E;font-style:italic;"># PID 文件</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== events 上下文 =====</span></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;         </span><span style="color:#7F848E;font-style:italic;"># 每个 Worker 最大连接数</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;                  </span><span style="color:#7F848E;font-style:italic;"># 批量接受连接</span></span>
<span class="line"><span style="color:#C678DD;">    accept_mutex </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;                 </span><span style="color:#7F848E;font-style:italic;"># 关闭互斥锁</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;                        </span><span style="color:#7F848E;font-style:italic;"># 事件模型</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== http 上下文 =====</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- 基础指令 ----</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">mime.types;               </span><span style="color:#7F848E;font-style:italic;"># MIME 类型</span></span>
<span class="line"><span style="color:#C678DD;">    default_type </span><span style="color:#ABB2BF;">application/octet-stream;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- 日志格式 ----</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#D19A66;">main</span><span style="color:#98C379;"> &#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot;&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- 性能优化 ----</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    client_max_body_size </span><span style="color:#D19A66;">20m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- Gzip 压缩 ----</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_vary </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_types </span><span style="color:#ABB2BF;">text/plain text/css application/json;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- 全局安全头 ----</span></span>
<span class="line"><span style="color:#C678DD;">    server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options nosniff always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- 限流区域定义 ----</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=global:10m rate=100r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- map 定义 ----</span></span>
<span class="line"><span style="color:#C678DD;">    map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_upgrade</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">connection_upgrade</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">        default</span><span style="color:#ABB2BF;"> upgrade;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&#39;</span><span style="color:#ABB2BF;"> close;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- upstream 定义 ----</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.1:8080;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.2:8080;</span></span>
<span class="line"><span style="color:#C678DD;">        keepalive </span><span style="color:#D19A66;">32</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- 引入站点配置 ----</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/conf.d/*.conf;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # include /etc/nginx/sites-enabled/*;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- server 定义 ----</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # ...</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== stream 上下文（TCP/UDP 代理） =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># stream {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     upstream tcp_backend {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#         server 10.0.0.1:3306;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#         server 10.0.0.2:3306;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     }</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     server {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#         listen 3306;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#         proxy_pass tcp_backend;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     }</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== mail 上下文（邮件代理） =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># mail {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     server {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#         listen 25;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#         protocol smtp;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#         proxy on;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     }</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-上下文嵌套规则" tabindex="-1"><a class="header-anchor" href="#_1-3-上下文嵌套规则"><span>1.3 上下文嵌套规则</span></a></h3><p>上下文之间存在严格的嵌套关系，违反嵌套规则的配置会导致语法错误：</p><table><thead><tr><th>上下文</th><th>允许的子上下文</th><th>说明</th></tr></thead><tbody><tr><td>main</td><td>events, http, stream, mail</td><td>顶层上下文</td></tr><tr><td>events</td><td>无</td><td>事件模型配置</td></tr><tr><td>http</td><td>server, upstream, map, geo, split_clients, types, limit_req_zone, limit_conn_zone</td><td>HTTP 服务配置</td></tr><tr><td>server</td><td>location, if</td><td>虚拟主机配置</td></tr><tr><td>location</td><td>if, upstream(有限)</td><td>请求路由配置</td></tr><tr><td>upstream</td><td>无</td><td>后端服务器组</td></tr><tr><td>stream</td><td>server, upstream</td><td>TCP/UDP 代理</td></tr><tr><td>mail</td><td>server</td><td>邮件代理</td></tr></tbody></table><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 错误示例：嵌套关系不正确</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误1：server 不能放在 main 上下文</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># server { ... }  ← 必须放在 http 或 stream 中</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误2：location 不能放在 http 上下文</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># http {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     location / { ... }  ← 必须放在 server 中</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误3：upstream 不能放在 server 上下文</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># server {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     upstream backend { ... }  ← 必须放在 http 中</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-include-机制与目录组织" tabindex="-1"><a class="header-anchor" href="#_2-include-机制与目录组织"><span>2. include 机制与目录组织</span></a></h2><h3 id="_2-1-include-指令详解" tabindex="-1"><a class="header-anchor" href="#_2-1-include-指令详解"><span>2.1 include 指令详解</span></a></h3><p><code>include</code> 指令将指定文件的内容插入到当前位置，支持通配符：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 引入单个文件</span></span>
<span class="line"><span style="color:#C678DD;">include </span><span style="color:#ABB2BF;">/etc/nginx/mime.types;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 引入目录下所有 .conf 文件（按字母序加载）</span></span>
<span class="line"><span style="color:#C678DD;">include </span><span style="color:#ABB2BF;">/etc/nginx/conf.d/*.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 引入目录下所有文件</span></span>
<span class="line"><span style="color:#C678DD;">include </span><span style="color:#ABB2BF;">/etc/nginx/sites-enabled/*;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用相对路径（相对于 nginx.conf 所在目录）</span></span>
<span class="line"><span style="color:#C678DD;">include </span><span style="color:#ABB2BF;">conf.d/*.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用通配符</span></span>
<span class="line"><span style="color:#C678DD;">include </span><span style="color:#ABB2BF;">/etc/nginx/vhost.d/*.conf;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">include 加载顺序</p><p>使用通配符 <code>*.conf</code> 时，文件按<strong>字母顺序</strong>加载。如果配置之间有依赖关系，建议使用数字前缀控制加载顺序：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>00-default.conf</span></span>
<span class="line"><span>01-ssl.conf</span></span>
<span class="line"><span>02-proxy.conf</span></span>
<span class="line"><span>03-cache.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div><h3 id="_2-2-两种主流目录组织方案" tabindex="-1"><a class="header-anchor" href="#_2-2-两种主流目录组织方案"><span>2.2 两种主流目录组织方案</span></a></h3><h4 id="方案一-debian-ubuntu-风格-sites-available-sites-enabled" tabindex="-1"><a class="header-anchor" href="#方案一-debian-ubuntu-风格-sites-available-sites-enabled"><span>方案一：Debian/Ubuntu 风格（sites-available/sites-enabled）</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>/etc/nginx/</span></span>
<span class="line"><span>├── nginx.conf                          # 主配置文件</span></span>
<span class="line"><span>├── sites-available/                    # 可用站点配置</span></span>
<span class="line"><span>│   ├── default                         # 默认站点</span></span>
<span class="line"><span>│   ├── example.com.conf               # 站点配置文件</span></span>
<span class="line"><span>│   ├── api.example.com.conf           # API 站点</span></span>
<span class="line"><span>│   └── blog.example.com.conf          # 博客站点</span></span>
<span class="line"><span>├── sites-enabled/                      # 已启用站点（符号链接）</span></span>
<span class="line"><span>│   ├── default -&gt; ../sites-available/default</span></span>
<span class="line"><span>│   ├── example.com.conf -&gt; ../sites-available/example.com.conf</span></span>
<span class="line"><span>│   └── api.example.com.conf -&gt; ../sites-available/api.example.com.conf</span></span>
<span class="line"><span>├── snippets/                           # 配置片段</span></span>
<span class="line"><span>│   ├── ssl-params.conf                # SSL 参数片段</span></span>
<span class="line"><span>│   ├── proxy-params.conf              # 代理参数片段</span></span>
<span class="line"><span>│   └── security-headers.conf          # 安全头片段</span></span>
<span class="line"><span>├── conf.d/                             # 额外配置</span></span>
<span class="line"><span>│   └── gzip.conf                      # Gzip 配置</span></span>
<span class="line"><span>└── modules-enabled/                    # 动态模块</span></span>
<span class="line"><span>    └── *.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 启用站点</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ln</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> /etc/nginx/sites-available/example.com.conf</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">           /etc/nginx/sites-enabled/example.com.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 禁用站点</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> rm</span><span style="color:#98C379;"> /etc/nginx/sites-enabled/example.com.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 站点状态管理</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> reload</span><span style="color:#98C379;"> nginx</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方案二-rhel-centos-风格-conf-d" tabindex="-1"><a class="header-anchor" href="#方案二-rhel-centos-风格-conf-d"><span>方案二：RHEL/CentOS 风格（conf.d）</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>/etc/nginx/</span></span>
<span class="line"><span>├── nginx.conf                          # 主配置文件</span></span>
<span class="line"><span>├── conf.d/                             # 站点配置目录</span></span>
<span class="line"><span>│   ├── default.conf                    # 默认站点</span></span>
<span class="line"><span>│   ├── example.com.conf               # 站点配置</span></span>
<span class="line"><span>│   ├── api.example.com.conf           # API 站点</span></span>
<span class="line"><span>│   └── ssl.conf                       # SSL 全局配置</span></span>
<span class="line"><span>├── default.d/                          # 默认站点扩展</span></span>
<span class="line"><span>└── modules/                            # 动态模块</span></span>
<span class="line"><span>    └── *.so</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 禁用站点（重命名去掉 .conf 后缀）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> mv</span><span style="color:#98C379;"> /etc/nginx/conf.d/example.com.conf</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        /etc/nginx/conf.d/example.com.conf.disabled</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启用站点</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> mv</span><span style="color:#98C379;"> /etc/nginx/conf.d/example.com.conf.disabled</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        /etc/nginx/conf.d/example.com.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重新加载</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> reload</span><span style="color:#98C379;"> nginx</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-推荐的目录组织方案" tabindex="-1"><a class="header-anchor" href="#_2-3-推荐的目录组织方案"><span>2.3 推荐的目录组织方案</span></a></h3><p>结合两种风格的优点，推荐的目录组织方案：</p>`,20),i(d,{code:`eJyNU8tOwkAU3fMVTfdDAV0aEjSYmGglqayIi2k7lInTdtJpDRgWbtCF0YUL+QIT3ZC4MSb4+BfDQ//C25IIDi0yu/acc8+59844AeYt5Wg7p8ARkTn7VjUSWprnUK+tqQkUn4PKnt5Qk795y/eaW2aglUcvw+/e9fRtMLm7HA2f1ePcL39eLmbn7YVS8dk51HeLDbVQQA7zTczmNce9h/HT+dfgHcpCQVlUAlEROWeUL0hurqavj5mSjUQixIKJYez/47MJohJivgMdO3PhpH8//ugvqYhnp7UuaEgEwqeYMmwyIs3AqMAEbNLEEQsTBymGUYFmSRu7nBHA3XQOdIc5za/grQxHvDiZvB6jKkVTPi9uZetqSjyJl2XtUc5JKGRXHVx54Lc7iOMAuyK1Yx1sYZkrKTAUQawooGEHtQi2SZBBhDXjKGytObKIizAg2JVy12uQ28TWCcjSbOo1iBwvKcXlj1v8yBSEyl3qWSyySXf2TjIwuD8JAmOTgVICQK5l4Afg0ifQ`}),o[2]||=n(`<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>/etc/nginx/</span></span>
<span class="line"><span>├── nginx.conf                    # 主配置（精简，只做include）</span></span>
<span class="line"><span>├── conf.d/                       # 全局配置</span></span>
<span class="line"><span>│   ├── 00-global.conf           # 全局HTTP设置</span></span>
<span class="line"><span>│   ├── 01-gzip.conf             # Gzip压缩</span></span>
<span class="line"><span>│   ├── 01-ssl.conf              # SSL全局参数</span></span>
<span class="line"><span>│   └── 02-logging.conf          # 日志配置</span></span>
<span class="line"><span>├── sites-available/              # 可用站点</span></span>
<span class="line"><span>│   ├── 00-default.conf          # 默认虚拟主机</span></span>
<span class="line"><span>│   ├── example.com.conf         # 示例站点</span></span>
<span class="line"><span>│   └── api.example.com.conf     # API站点</span></span>
<span class="line"><span>├── sites-enabled/                # 已启用站点（符号链接）</span></span>
<span class="line"><span>│   ├── 00-default.conf → ../sites-available/00-default.conf</span></span>
<span class="line"><span>│   └── example.com.conf → ../sites-available/example.com.conf</span></span>
<span class="line"><span>├── snippets/                     # 可复用配置片段</span></span>
<span class="line"><span>│   ├── proxy-params.conf        # 代理通用参数</span></span>
<span class="line"><span>│   ├── ssl-params.conf          # SSL通用参数</span></span>
<span class="line"><span>│   ├── security-headers.conf    # 安全响应头</span></span>
<span class="line"><span>│   └── auth-basic.conf          # 基本认证</span></span>
<span class="line"><span>├── upstream/                     # 上游服务器组</span></span>
<span class="line"><span>│   ├── backend.conf             # 后端应用</span></span>
<span class="line"><span>│   └── api.conf                 # API服务</span></span>
<span class="line"><span>├── ssl/                          # SSL证书</span></span>
<span class="line"><span>│   ├── example.com.crt</span></span>
<span class="line"><span>│   └── example.com.key</span></span>
<span class="line"><span>└── lua/                          # Lua脚本（OpenResty）</span></span>
<span class="line"><span>    └── *.lua</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-精简的-nginx-conf" tabindex="-1"><a class="header-anchor" href="#_2-4-精简的-nginx-conf"><span>2.4 精简的 nginx.conf</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/nginx.conf - 精简主配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;">nginx;</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">pid </span><span style="color:#ABB2BF;">/var/run/nginx.pid;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    accept_mutex </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/conf.d/*.conf;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/upstream/*.conf;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/sites-enabled/*;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-配置文件加载顺序与优先级" tabindex="-1"><a class="header-anchor" href="#_3-配置文件加载顺序与优先级"><span>3. 配置文件加载顺序与优先级</span></a></h2><h3 id="_3-1-加载顺序" tabindex="-1"><a class="header-anchor" href="#_3-1-加载顺序"><span>3.1 加载顺序</span></a></h3><p>Nginx 配置的加载顺序决定了同名指令的覆盖关系：</p>`,6),i(d,{code:`eJyN0D1PAjEYwPGdT9Ecm5ECxzsxJLwV3N0ahuNs5ZLSI3cVdTUxCkLcxEETJ+NCXNHAt6FEJ76Cdz2iYNTQ9fn92/ShzD4xW4YjwEEpBLxTxHEI+JHFT6FpcwrahsXBfNKfT64Xt5cNEIkUQAnrG4Z0CRcukA+jRnCHUmWc2FAtITrfpqxMBWtJCPwxPIzuKLfXdKKFxaAnx6PFy1C+3cj+4/tspgVZRWVVrKUgOO64wiFGe6uwqkKEtTQEriWIGyHcaDLiPft/iFRYwxmvI06XOP4f5OD142IYgJoCdZyFgNmmISyb/yR1RfZxDgKL+sPl9Eo+ncvxnbx/Xk57jZBirjhjxNsetRjLhxFKZXR917SZ7eTDlNI1U/kyuWws9rtBK5MsF1HqD1NfGT2eS6PEuvkE7OTB8g==`}),o[3]||=n(`<h3 id="_3-2-指令优先级规则" tabindex="-1"><a class="header-anchor" href="#_3-2-指令优先级规则"><span>3.2 指令优先级规则</span></a></h3><h4 id="规则一-子上下文覆盖父上下文" tabindex="-1"><a class="header-anchor" href="#规则一-子上下文覆盖父上下文"><span>规则一：子上下文覆盖父上下文</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 父上下文定义</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;                   </span><span style="color:#7F848E;font-style:italic;"># 全局启用 Gzip</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 子上下文继承父上下文</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # gzip on 仍然有效</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 可以覆盖父上下文</span></span>
<span class="line"><span style="color:#C678DD;">            gzip </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;           </span><span style="color:#7F848E;font-style:italic;"># 此 location 禁用 Gzip</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="规则二-同级别后加载覆盖先加载" tabindex="-1"><a class="header-anchor" href="#规则二-同级别后加载覆盖先加载"><span>规则二：同级别后加载覆盖先加载</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 文件 conf.d/01-config.conf</span></span>
<span class="line"><span style="color:#C678DD;">server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 文件 conf.d/02-config.conf</span></span>
<span class="line"><span style="color:#C678DD;">server_tokens </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 后加载的覆盖先加载的</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 最终生效：server_tokens on</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="规则三-数组合并" tabindex="-1"><a class="header-anchor" href="#规则三-数组合并"><span>规则三：数组合并</span></a></h4><p>某些指令在子上下文中不会覆盖，而是追加：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 父上下文</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">mime.types;                    </span><span style="color:#7F848E;font-style:italic;"># 定义了多种 MIME 类型</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 子上下文的 types 会覆盖（不是追加）</span></span>
<span class="line"><span style="color:#C678DD;">        types</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">            application/json</span><span style="color:#ABB2BF;"> json;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 此时只有 json 类型生效，其他 MIME 类型丢失</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 正确做法：使用 include 保留父上下文</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">mime.types;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        include </span><span style="color:#ABB2BF;">mime.types;              </span><span style="color:#7F848E;font-style:italic;"># 保留原有类型</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 追加自定义类型</span></span>
<span class="line"><span style="color:#C678DD;">        types</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">            application/json</span><span style="color:#ABB2BF;"> json;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="规则四-add-header-指令的覆盖陷阱" tabindex="-1"><a class="header-anchor" href="#规则四-add-header-指令的覆盖陷阱"><span>规则四：add_header 指令的覆盖陷阱</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 父级定义的安全头</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 子级定义了 add_header</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 此时父级的 X-Frame-Options 会被完全丢弃！</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-Custom-Header </span><span style="color:#98C379;">&quot;value&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 必须重新声明所有需要的头</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-Custom-Header </span><span style="color:#98C379;">&quot;value&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">add_header 覆盖陷阱</p><p><code>add_header</code> 指令具有<strong>继承但覆盖</strong>的特性：如果子上下文（location）中定义了任何 <code>add_header</code>，则父上下文（server）中的 <code>add_header</code> 全部失效。这是 Nginx 配置中最常见的陷阱之一。</p><p>解决方案：</p><ol><li>在每个 location 中重复声明所有需要的头部</li><li>使用 <code>headers-more</code> 第三方模块的 <code>more_set_headers</code> 指令</li><li>使用 <code>include</code> 片段统一管理头部</li></ol><p>参考：<a href="https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header" target="_blank" rel="noopener noreferrer">https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header</a></p></div><h3 id="_3-3-server-块匹配优先级" tabindex="-1"><a class="header-anchor" href="#_3-3-server-块匹配优先级"><span>3.3 server 块匹配优先级</span></a></h3><p>当多个 server 块监听同一端口时，Nginx 按以下规则选择：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>1. 精确匹配 server_name</span></span>
<span class="line"><span>   → server_name example.com;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 前缀通配符（最长优先）</span></span>
<span class="line"><span>   → server_name *.example.com;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 后缀通配符（最长优先）</span></span>
<span class="line"><span>   → server_name example.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 正则匹配（按配置顺序，第一个匹配的生效）</span></span>
<span class="line"><span>   → server_name ~^(www\\.)?example\\.com$;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>5. 默认服务器（default_server）</span></span>
<span class="line"><span>   → listen 80 default_server;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>6. 第一个定义的 server 块</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># server 匹配优先级示例</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 优先级5：默认服务器</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#D19A66;"> default_server</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 444</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 优先级1：精确匹配</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # example.com 会匹配到这里</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 优先级2：前缀通配符</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">*.example.com;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # www.example.com, api.example.com 会匹配到这里</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 优先级3：后缀通配符</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">example.*;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # example.org, example.net 会匹配到这里</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 优先级4：正则匹配</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">~</span><span style="color:#E06C75;">^(www\\.)?(.+)$</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 正则匹配</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-location-块匹配优先级" tabindex="-1"><a class="header-anchor" href="#_3-4-location-块匹配优先级"><span>3.4 location 块匹配优先级</span></a></h3><p>location 的匹配规则更为复杂：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>1. 精确匹配 (=)：最高优先级，匹配后立即停止</span></span>
<span class="line"><span>2. 前缀匹配 (^~)：次高优先级，匹配后不检查正则</span></span>
<span class="line"><span>3. 正则匹配 (~ / ~*)：按配置顺序，第一个匹配的生效</span></span>
<span class="line"><span>4. 普通前缀匹配：最长匹配优先</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 优先级1：精确匹配</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 只匹配 /，不匹配 /index.html</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 优先级2：前缀匹配（阻止正则）</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/images/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # /images/ 下的所有请求，不检查正则</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 优先级3：区分大小写正则</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">\\.php$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 匹配所有 .php 结尾的请求</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 优先级3：不区分大小写正则</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(jpg|jpeg|png|gif|ico|css|js)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 匹配所有图片和静态资源</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 优先级4：普通前缀匹配</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 匹配所有请求（最长前缀匹配）</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # /api/ 前缀匹配</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/v2/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 比 /api/ 更长的前缀，优先级更高</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,20),i(d,{code:`eJxLy8kvT85ILCpRCHHiUgCCINfA6Bfrtz/b2BQa5BmroKtrp+Aa4egcUq30fNO+5wvXPe3Z+bK11yapSN/OVkG/ILEkQ8FeqRasFawOpKMGoqhGIcgw+sne/c+nrEDW+3xWS05+cmJJZn5eLJq+Jzt6YVoDglzdPCOqlZ529j7f04Bka1wdmrUQlaj2GkUrQSxG1o5kMdgkkG1tvc8WNzybv/TZ2sVPO2YqQRyEZCKSi4Jc3V2BDoKoRHIQ0D0KdVpw54CVobrGGBYKa9Y82dHwZMcquHsghqEGB8IAJMt9/P3cXYNDoAY9m9Pwcur+ZzPXvWyYhezDWC6wCcUllTmpwMBXSMvMybFSNnF2dDM10EnOz8kvslJOS0tDVmQEVWRkaGnmZoxDkTFUkZubpYUBDpOgLoSqtHQ2MndCUQkAqzwGBg==`}),o[4]||=n(`<h2 id="_4-默认配置文件解读" tabindex="-1"><a class="header-anchor" href="#_4-默认配置文件解读"><span>4. 默认配置文件解读</span></a></h2><h3 id="_4-1-nginx-官方包默认配置" tabindex="-1"><a class="header-anchor" href="#_4-1-nginx-官方包默认配置"><span>4.1 Nginx 官方包默认配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/nginx.conf（官方仓库安装后的默认配置）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;"> nginx;                    </span><span style="color:#7F848E;font-style:italic;"># Worker 进程以 nginx 用户运行</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;"> auto;         </span><span style="color:#7F848E;font-style:italic;"># 自动检测 CPU 核心数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;"> /var/log/nginx/error.log </span><span style="color:#D19A66;">notice</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 错误日志，级别 notice</span></span>
<span class="line"><span style="color:#C678DD;">pid </span><span style="color:#ABB2BF;">        /var/run/nginx.pid;               </span><span style="color:#7F848E;font-style:italic;"># PID 文件路径</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;"> 1024</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 每个 Worker 最大 1024 连接</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">      /etc/nginx/mime.types;       </span><span style="color:#7F848E;font-style:italic;"># 引入 MIME 类型定义</span></span>
<span class="line"><span style="color:#C678DD;">    default_type </span><span style="color:#ABB2BF;"> application/octet-stream;    </span><span style="color:#7F848E;font-style:italic;"># 默认 MIME 类型</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 日志格式定义</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#D19A66;"> main</span><span style="color:#98C379;">  &#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                      &#39;$</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                      &#39;&quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_x_forwarded_for</span><span style="color:#98C379;">&quot;&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;"> /var/log/nginx/access.log  </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 访问日志</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">       on</span><span style="color:#ABB2BF;">;       </span><span style="color:#7F848E;font-style:italic;"># 启用零拷贝</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    #tcp_nopush     on;       # TCP 优化（注释掉了）</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;"> 65</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># Keep-Alive 超时 65 秒</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    #gzip  on;                # Gzip 压缩（注释掉了）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/conf.d/*.conf;  </span><span style="color:#7F848E;font-style:italic;"># 引入站点配置</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-默认站点配置" tabindex="-1"><a class="header-anchor" href="#_4-2-默认站点配置"><span>4.2 默认站点配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/conf.d/default.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">      80</span><span style="color:#ABB2BF;">;                    </span><span style="color:#7F848E;font-style:italic;"># 监听 80 端口</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;"> localhost;             </span><span style="color:#7F848E;font-style:italic;"># 服务器名 localhost</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    #access_log  /var/log/nginx/host.access.log  main;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">  /usr/share/nginx/html;   </span><span style="color:#7F848E;font-style:italic;"># 站点根目录</span></span>
<span class="line"><span style="color:#C678DD;">        index </span><span style="color:#ABB2BF;"> index.html index.htm;    </span><span style="color:#7F848E;font-style:italic;"># 默认首页</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    #error_page  404              /404.html;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # redirect server error pages to the static page /50x.html</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    #</span></span>
<span class="line"><span style="color:#C678DD;">    error_page </span><span style="color:#D19A66;">  500</span><span style="color:#D19A66;"> 502</span><span style="color:#D19A66;"> 503</span><span style="color:#D19A66;"> 504</span><span style="color:#ABB2BF;">  /50x.html;</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/50x.html </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">  /usr/share/nginx/html;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-mime-types-文件" tabindex="-1"><a class="header-anchor" href="#_4-3-mime-types-文件"><span>4.3 mime.types 文件</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/mime.types（部分内容）</span></span>
<span class="line"><span style="color:#C678DD;">types</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    text/html</span><span style="color:#ABB2BF;">                             html htm shtml;</span></span>
<span class="line"><span style="color:#D19A66;">    text/css</span><span style="color:#ABB2BF;">                              css;</span></span>
<span class="line"><span style="color:#D19A66;">    text/xml</span><span style="color:#ABB2BF;">                              xml;</span></span>
<span class="line"><span style="color:#D19A66;">    application/javascript</span><span style="color:#ABB2BF;">                js;</span></span>
<span class="line"><span style="color:#D19A66;">    application/json</span><span style="color:#ABB2BF;">                      json;</span></span>
<span class="line"><span style="color:#D19A66;">    application/xml</span><span style="color:#ABB2BF;">                       rss atom;</span></span>
<span class="line"><span style="color:#D19A66;">    image/png</span><span style="color:#ABB2BF;">                             png;</span></span>
<span class="line"><span style="color:#D19A66;">    image/jpeg</span><span style="color:#ABB2BF;">                            jpeg jpg;</span></span>
<span class="line"><span style="color:#D19A66;">    image/gif</span><span style="color:#ABB2BF;">                             gif;</span></span>
<span class="line"><span style="color:#D19A66;">    image/svg+xml</span><span style="color:#ABB2BF;">                         svg svgz;</span></span>
<span class="line"><span style="color:#D19A66;">    image/x-icon</span><span style="color:#ABB2BF;">                          ico;</span></span>
<span class="line"><span style="color:#D19A66;">    font/woff</span><span style="color:#ABB2BF;">                             woff;</span></span>
<span class="line"><span style="color:#D19A66;">    font/woff2</span><span style="color:#ABB2BF;">                            woff2;</span></span>
<span class="line"><span style="color:#D19A66;">    application/font-ttf</span><span style="color:#ABB2BF;">                  ttf;</span></span>
<span class="line"><span style="color:#D19A66;">    application/vnd.ms-fontobject</span><span style="color:#ABB2BF;">         eot;</span></span>
<span class="line"><span style="color:#D19A66;">    video/mp4</span><span style="color:#ABB2BF;">                             mp4;</span></span>
<span class="line"><span style="color:#D19A66;">    video/webm</span><span style="color:#ABB2BF;">                            webm;</span></span>
<span class="line"><span style="color:#D19A66;">    application/octet-stream</span><span style="color:#ABB2BF;">             bin exe dll;</span></span>
<span class="line"><span style="color:#D19A66;">    application/zip</span><span style="color:#ABB2BF;">                       zip;</span></span>
<span class="line"><span style="color:#D19A66;">    application/pdf</span><span style="color:#ABB2BF;">                       pdf;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ... 更多 MIME 类型</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-配置文件备份与版本管理" tabindex="-1"><a class="header-anchor" href="#_5-配置文件备份与版本管理"><span>5. 配置文件备份与版本管理</span></a></h2><h3 id="_5-1-使用-git-管理配置" tabindex="-1"><a class="header-anchor" href="#_5-1-使用-git-管理配置"><span>5.1 使用 Git 管理配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 初始化 Git 仓库</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> /etc/nginx</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> git</span><span style="color:#98C379;"> init</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> git</span><span style="color:#98C379;"> add</span><span style="color:#D19A66;"> -A</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> git</span><span style="color:#98C379;"> commit</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> &quot;Initial nginx configuration&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 每次修改后提交</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> git</span><span style="color:#98C379;"> add</span><span style="color:#D19A66;"> -A</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> git</span><span style="color:#98C379;"> commit</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> &quot;Add SSL configuration for example.com&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看修改历史</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> git</span><span style="color:#98C379;"> log</span><span style="color:#D19A66;"> --oneline</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看某次修改的详细内容</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> git</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> HEAD</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 回滚到上一个版本</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> git</span><span style="color:#98C379;"> checkout</span><span style="color:#98C379;"> HEAD~1</span><span style="color:#D19A66;"> --</span><span style="color:#98C379;"> .</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> reload</span><span style="color:#98C379;"> nginx</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-使用-etckeeper" tabindex="-1"><a class="header-anchor" href="#_5-2-使用-etckeeper"><span>5.2 使用 etckeeper</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 etckeeper（自动跟踪 /etc 目录的变更）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> etckeeper</span><span style="color:#7F848E;font-style:italic;">   # Ubuntu</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># sudo dnf install etckeeper  # RHEL</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 初始化</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> etckeeper</span><span style="color:#98C379;"> init</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 自动在每次包管理操作前提交</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/etckeeper/etckeeper.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># VCS=&quot;git&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># AVOID_COMMIT_BEFORE_INSTALL=0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-备份策略" tabindex="-1"><a class="header-anchor" href="#_5-3-备份策略"><span>5.3 备份策略</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 定时备份脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/nginx-backup.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/backups/nginx&quot;</span></span>
<span class="line"><span style="color:#E06C75;">DATE</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#E06C75;"> $BACKUP_DIR</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 备份整个配置目录</span></span>
<span class="line"><span style="color:#61AFEF;">tar</span><span style="color:#D19A66;"> -czf</span><span style="color:#E06C75;"> $BACKUP_DIR</span><span style="color:#98C379;">/nginx_conf_</span><span style="color:#E06C75;">$DATE</span><span style="color:#98C379;">.tar.gz</span><span style="color:#98C379;"> /etc/nginx/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 保留最近30天的备份</span></span>
<span class="line"><span style="color:#61AFEF;">find</span><span style="color:#E06C75;"> $BACKUP_DIR</span><span style="color:#D19A66;"> -name</span><span style="color:#98C379;"> &quot;nginx_conf_*.tar.gz&quot;</span><span style="color:#D19A66;"> -mtime</span><span style="color:#98C379;"> +30</span><span style="color:#D19A66;"> -delete</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加到 crontab</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 0 2 * * * /usr/local/bin/nginx-backup.sh</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 异地备份</span></span>
<span class="line"><span style="color:#61AFEF;">rsync</span><span style="color:#D19A66;"> -avz</span><span style="color:#98C379;"> /etc/nginx/</span><span style="color:#98C379;"> backup-server:/backups/nginx/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-多环境配置管理" tabindex="-1"><a class="header-anchor" href="#_6-多环境配置管理"><span>6. 多环境配置管理</span></a></h2><h3 id="_6-1-方案一-环境变量-envsubst" tabindex="-1"><a class="header-anchor" href="#_6-1-方案一-环境变量-envsubst"><span>6.1 方案一：环境变量 + envsubst</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/templates/proxy.conf.template</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> \${APP_NAME} {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> \${</span><span style="color:#E06C75;">BACKEND_HOST</span><span style="color:#ABB2BF;">}:\${</span><span style="color:#E06C75;">BACKEND_PORT</span><span style="color:#ABB2BF;">};</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive </span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">KEEPALIVE_COUNT</span><span style="color:#ABB2BF;">};</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">LISTEN_PORT</span><span style="color:#ABB2BF;">};</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">SERVER_NAME</span><span style="color:#ABB2BF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#ABB2BF;">};</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 envsubst 生成实际配置</span></span>
<span class="line"><span style="color:#C678DD;">export</span><span style="color:#E06C75;"> APP_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;">backend</span></span>
<span class="line"><span style="color:#C678DD;">export</span><span style="color:#E06C75;"> BACKEND_HOST</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">10.0.0.1</span></span>
<span class="line"><span style="color:#C678DD;">export</span><span style="color:#E06C75;"> BACKEND_PORT</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">8080</span></span>
<span class="line"><span style="color:#C678DD;">export</span><span style="color:#E06C75;"> KEEPALIVE_COUNT</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">32</span></span>
<span class="line"><span style="color:#C678DD;">export</span><span style="color:#E06C75;"> LISTEN_PORT</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#C678DD;">export</span><span style="color:#E06C75;"> SERVER_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;">api</span><span style="color:#ABB2BF;">.</span><span style="color:#E06C75;">example</span><span style="color:#ABB2BF;">.</span><span style="color:#E06C75;">com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">envsubst</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#98C379;">/etc/nginx/templates/proxy.conf.template</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &gt; </span><span style="color:#98C379;">/etc/nginx/conf.d/proxy.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 Docker 中使用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.yml</span></span>
<span class="line"><span style="color:#61AFEF;">services:</span></span>
<span class="line"><span style="color:#61AFEF;">  nginx:</span></span>
<span class="line"><span style="color:#61AFEF;">    image:</span><span style="color:#98C379;"> nginx:1.26-alpine</span></span>
<span class="line"><span style="color:#61AFEF;">    environment:</span></span>
<span class="line"><span style="color:#61AFEF;">      -</span><span style="color:#98C379;"> APP_NAME=backend</span></span>
<span class="line"><span style="color:#61AFEF;">      -</span><span style="color:#98C379;"> BACKEND_HOST=app</span></span>
<span class="line"><span style="color:#61AFEF;">      -</span><span style="color:#98C379;"> BACKEND_PORT=</span><span style="color:#D19A66;">8080</span></span>
<span class="line"><span style="color:#61AFEF;">      -</span><span style="color:#98C379;"> KEEPALIVE_COUNT=</span><span style="color:#D19A66;">32</span></span>
<span class="line"><span style="color:#61AFEF;">      -</span><span style="color:#98C379;"> LISTEN_PORT=</span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#61AFEF;">      -</span><span style="color:#98C379;"> SERVER_NAME=api.example.com</span></span>
<span class="line"><span style="color:#56B6C2;">    command</span><span style="color:#98C379;">:</span><span style="color:#98C379;"> /bin/sh</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;envsubst &lt; /etc/nginx/templates/proxy.conf.template &gt; /etc/nginx/conf.d/proxy.conf &amp;&amp; nginx -g &#39;daemon off;&#39;&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">envsubst 与 Nginx 变量冲突</p><p><code>envsubst</code> 会替换所有 <code>$</code> 开头的变量，包括 Nginx 内置变量（如 <code>$host</code>、<code>$remote_addr</code>）。需要指定只替换特定变量：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 只替换指定的环境变量</span></span>
<span class="line"><span style="color:#61AFEF;">envsubst</span><span style="color:#98C379;"> &#39;\${APP_NAME} \${BACKEND_HOST} \${BACKEND_PORT}&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &lt; </span><span style="color:#98C379;">template.conf</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">actual.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div><h3 id="_6-2-方案二-include-条件加载" tabindex="-1"><a class="header-anchor" href="#_6-2-方案二-include-条件加载"><span>6.2 方案二：include 条件加载</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/nginx.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通过环境变量控制加载</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在启动脚本中：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># if [ &quot;$ENV&quot; = &quot;production&quot; ]; then</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   cp /etc/nginx/env/prod.conf /etc/nginx/conf.d/00-env.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># else</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   cp /etc/nginx/env/dev.conf /etc/nginx/conf.d/00-env.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 加载环境相关配置</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/conf.d/00-env.conf;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/conf.d/*.conf;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/env/prod.conf - 生产环境</span></span>
<span class="line"><span style="color:#C678DD;">gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">gzip_comp_level </span><span style="color:#D19A66;">6</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">keepalive_timeout </span><span style="color:#D19A66;">65</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">client_max_body_size </span><span style="color:#D19A66;">50m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/env/dev.conf - 开发环境</span></span>
<span class="line"><span style="color:#C678DD;">gzip </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">keepalive_timeout </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">client_max_body_size </span><span style="color:#D19A66;">100m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">server_tokens </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-方案三-docker-多阶段构建" tabindex="-1"><a class="header-anchor" href="#_6-3-方案三-docker-多阶段构建"><span>6.3 方案三：Docker 多阶段构建</span></a></h3><div class="language-dockerfile line-numbers-mode" data-highlighter="shiki" data-ext="dockerfile" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-dockerfile"><span class="line"><span style="color:#7F848E;font-style:italic;"># Dockerfile</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> nginx:1.26-alpine </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> base</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> nginx.conf /etc/nginx/nginx.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 开发环境</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> base </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> development</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> env/dev/ /etc/nginx/conf.d/</span></span>
<span class="line"><span style="color:#61AFEF;">EXPOSE</span><span style="color:#ABB2BF;"> 80</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 预发布环境</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> base </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> staging</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> env/staging/ /etc/nginx/conf.d/</span></span>
<span class="line"><span style="color:#61AFEF;">EXPOSE</span><span style="color:#ABB2BF;"> 80 443</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> base </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> production</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> env/prod/ /etc/nginx/conf.d/</span></span>
<span class="line"><span style="color:#61AFEF;">EXPOSE</span><span style="color:#ABB2BF;"> 80 443</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 构建不同环境的镜像</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> build</span><span style="color:#D19A66;"> --target</span><span style="color:#98C379;"> development</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> nginx:dev</span><span style="color:#98C379;"> .</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> build</span><span style="color:#D19A66;"> --target</span><span style="color:#98C379;"> staging</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> nginx:staging</span><span style="color:#98C379;"> .</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> build</span><span style="color:#D19A66;"> --target</span><span style="color:#98C379;"> production</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> nginx:prod</span><span style="color:#98C379;"> .</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-4-方案四-map-指令环境感知" tabindex="-1"><a class="header-anchor" href="#_6-4-方案四-map-指令环境感知"><span>6.4 方案四：map 指令环境感知</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基于 Host 头自动切换环境</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">host</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">backend_name</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">             backend_prod;</span></span>
<span class="line"><span style="color:#ABB2BF;">    dev.example.com     backend_dev;</span></span>
<span class="line"><span style="color:#ABB2BF;">    staging.example.com backend_staging;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^api\\.             backend_api;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend_prod {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.1.10:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.1.11:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend_dev {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 127.0.0.1:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend_staging {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.2.10:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend_api {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.3.10:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.3.11:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">backend_name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-配置文件格式化与语法检查工具" tabindex="-1"><a class="header-anchor" href="#_7-配置文件格式化与语法检查工具"><span>7. 配置文件格式化与语法检查工具</span></a></h2><h3 id="_7-1-nginx-t-语法检查" tabindex="-1"><a class="header-anchor" href="#_7-1-nginx-t-语法检查"><span>7.1 nginx -t 语法检查</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基本语法检查</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx: the configuration file /etc/nginx/nginx.conf syntax is ok</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx: configuration file /etc/nginx/nginx.conf test is successful</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出完整配置（包含所有 include 的文件内容）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出所有配置文件的合并结果</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 静默模式（只输出错误）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#D19A66;"> -q</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 无输出表示配置正确</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-nginx-t-输出完整配置" tabindex="-1"><a class="header-anchor" href="#_7-2-nginx-t-输出完整配置"><span>7.2 nginx -T 输出完整配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看运行时完整配置</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">less</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 搜索特定配置</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;server_name&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查某个模块是否加载</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;load_module&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 导出完整配置</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/tmp/nginx_full_config.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-配置格式化工具" tabindex="-1"><a class="header-anchor" href="#_7-3-配置格式化工具"><span>7.3 配置格式化工具</span></a></h3><h4 id="nginx-crossplane" tabindex="-1"><a class="header-anchor" href="#nginx-crossplane"><span>nginx-crossplane</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装</span></span>
<span class="line"><span style="color:#61AFEF;">pip</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> crossplane</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 格式化配置文件</span></span>
<span class="line"><span style="color:#61AFEF;">crossplane</span><span style="color:#98C379;"> format</span><span style="color:#98C379;"> /etc/nginx/nginx.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查配置</span></span>
<span class="line"><span style="color:#61AFEF;">crossplane</span><span style="color:#98C379;"> check</span><span style="color:#98C379;"> /etc/nginx/nginx.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 解析配置为 JSON</span></span>
<span class="line"><span style="color:#61AFEF;">crossplane</span><span style="color:#98C379;"> parse</span><span style="color:#98C379;"> /etc/nginx/nginx.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 构建配置（从 JSON 生成 Nginx 配置）</span></span>
<span class="line"><span style="color:#61AFEF;">crossplane</span><span style="color:#98C379;"> build</span><span style="color:#98C379;"> config.json</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> /etc/nginx/nginx.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="nginxbeautifier" tabindex="-1"><a class="header-anchor" href="#nginxbeautifier"><span>nginxbeautifier</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装</span></span>
<span class="line"><span style="color:#61AFEF;">npm</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -g</span><span style="color:#98C379;"> nginxbeautifier</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 格式化</span></span>
<span class="line"><span style="color:#61AFEF;">nginxbeautifier</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> /etc/nginx/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 选项</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -r : 递归处理目录</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -s NUM : 缩进空格数（默认4）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -t : 使用 Tab 缩进</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="nginxfmt" tabindex="-1"><a class="header-anchor" href="#nginxfmt"><span>nginxfmt</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Python 格式化工具</span></span>
<span class="line"><span style="color:#61AFEF;">pip</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> nginxfmt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 格式化单个文件</span></span>
<span class="line"><span style="color:#61AFEF;">nginxfmt</span><span style="color:#98C379;"> /etc/nginx/nginx.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 格式化目录</span></span>
<span class="line"><span style="color:#61AFEF;">nginxfmt</span><span style="color:#98C379;"> /etc/nginx/conf.d/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-4-配置语法高亮" tabindex="-1"><a class="header-anchor" href="#_7-4-配置语法高亮"><span>7.4 配置语法高亮</span></a></h3><h4 id="vim-语法高亮" tabindex="-1"><a class="header-anchor" href="#vim-语法高亮"><span>Vim 语法高亮</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 源码自带 Vim 语法文件</span></span>
<span class="line"><span style="color:#61AFEF;">cp</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> /usr/local/src/nginx-1.26.2/contrib/vim/</span><span style="color:#E5C07B;">*</span><span style="color:#98C379;"> ~/.vim/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或者手动安装</span></span>
<span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> ~/.vim/syntax</span></span>
<span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> ~/.vim/ftdetect</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> ~/.vim/syntax/nginx.vim</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    https://raw.githubusercontent.com/nginx/nginx/master/contrib/vim/syntax/nginx.vim</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;au BufRead,BufNewFile /etc/nginx/* set ft=nginx&quot;</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">~/.vim/ftdetect/nginx.vim</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="vs-code-扩展" tabindex="-1"><a class="header-anchor" href="#vs-code-扩展"><span>VS Code 扩展</span></a></h4><p>推荐安装以下 VS Code 扩展：</p><ul><li><strong>nginx.conf</strong> - Nginx 配置语法高亮和补全</li><li><strong>Nginx Configuration</strong> - 语法检查和智能提示</li></ul><h2 id="_8-配置文件最佳实践" tabindex="-1"><a class="header-anchor" href="#_8-配置文件最佳实践"><span>8. 配置文件最佳实践</span></a></h2><h3 id="_8-1-配置文件编写规范" tabindex="-1"><a class="header-anchor" href="#_8-1-配置文件编写规范"><span>8.1 配置文件编写规范</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 命名规范 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 文件命名使用小写字母 + 连字符</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 正确：api-proxy.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误：ApiProxy.conf, api_proxy.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 使用数字前缀控制加载顺序</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 00-default.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 01-ssl.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 02-api-proxy.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 站点配置以域名命名</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># example.com.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># api.example.com.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 缩进规范 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 4 个空格缩进（不使用 Tab）</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 注释规范 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 块注释：说明配置块的整体功能</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># API 反向代理配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 功能：将 /api/ 请求代理到后端应用服务器</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建时间：2024-01-15</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 最后修改：2024-06-01</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 负责人：运维团队</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 行注释：说明单条指令的作用</span></span>
<span class="line"><span style="color:#C678DD;">server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 隐藏 Nginx 版本号</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 指令分组 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- 监听与域名 ----</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- SSL 配置 ----</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ssl_certificate /etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ssl_certificate_key /etc/nginx/ssl/example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- 日志配置 ----</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/example.com.access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    error_log </span><span style="color:#ABB2BF;">/var/log/nginx/example.com.error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- 安全配置 ----</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # include /etc/nginx/snippets/security-headers.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ---- 路由配置 ----</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#C678DD;">        include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/proxy-params.conf;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-配置片段复用" tabindex="-1"><a class="header-anchor" href="#_8-2-配置片段复用"><span>8.2 配置片段复用</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/snippets/proxy-params.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 代理通用参数，可在多个 location 中 include</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Port $</span><span style="color:#E06C75;">server_port</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_send_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_read_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">proxy_buffering </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_buffer_size </span><span style="color:#D19A66;">4k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_buffers </span><span style="color:#D19A66;">8</span><span style="color:#D19A66;"> 4k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_busy_buffers_size </span><span style="color:#D19A66;">8k</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/snippets/ssl-params.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SSL 通用参数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">ssl_protocols </span><span style="color:#ABB2BF;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_ciphers </span><span style="color:#ABB2BF;">ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_prefer_server_ciphers </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_session_cache </span><span style="color:#ABB2BF;">shared:SSL:10m;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_session_timeout </span><span style="color:#D19A66;">1d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_session_tickets </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/snippets/security-headers.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安全响应头</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">Strict-Transport-Security </span><span style="color:#98C379;">&quot;max-age=63072000; includeSubDomains; preload&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">X-XSS-Protection </span><span style="color:#98C379;">&quot;1; mode=block&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">Referrer-Policy </span><span style="color:#98C379;">&quot;strict-origin-when-cross-origin&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">Content-Security-Policy </span><span style="color:#98C379;">&quot;default-src &#39;self&#39;&quot;</span><span style="color:#ABB2BF;"> always;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-使用-include-组织配置" tabindex="-1"><a class="header-anchor" href="#_8-3-使用-include-组织配置"><span>8.3 使用 include 组织配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/sites-available/example.com.conf</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 引入代理通用参数</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/proxy-params.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 覆盖特定参数</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_read_timeout </span><span style="color:#D19A66;">120s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-4-配置验证脚本" tabindex="-1"><a class="header-anchor" href="#_8-4-配置验证脚本"><span>8.4 配置验证脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/nginx-validate.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证 Nginx 配置</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;===== Nginx 配置验证 =====&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 语法检查</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> &quot;1. 语法检查: &quot;</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 通过&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✗ 失败&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 检查默认服务器配置</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> &quot;2. 默认服务器: &quot;</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> &quot;default_server&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 已配置&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;⚠ 未配置 default_server&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 检查 server_tokens</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> &quot;3. 版本隐藏: &quot;</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> &quot;server_tokens off&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 已隐藏&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;⚠ 未隐藏&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 检查 SSL 配置</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> &quot;4. SSL 配置: &quot;</span></span>
<span class="line"><span style="color:#E06C75;">SSL_COUNT</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;listen.*443 ssl&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$SSL_COUNT</span><span style="color:#98C379;"> 个 SSL 站点&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 检查重复 server_name</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> &quot;5. 重复域名: &quot;</span></span>
<span class="line"><span style="color:#E06C75;">DUPES</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;server_name&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -d</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$DUPES</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 无重复&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;⚠ 发现重复:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$DUPES</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 统计配置</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;6. 配置统计:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;   - Server 块: $(</span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx </span><span style="color:#D19A66;">-T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1</span><span style="color:#ABB2BF;"> |</span><span style="color:#61AFEF;"> grep</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &#39;server {&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;   - Location 块: $(</span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx </span><span style="color:#D19A66;">-T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1</span><span style="color:#ABB2BF;"> |</span><span style="color:#61AFEF;"> grep</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &#39;location &#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;   - Upstream 块: $(</span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx </span><span style="color:#D19A66;">-T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1</span><span style="color:#ABB2BF;"> |</span><span style="color:#61AFEF;"> grep</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &#39;upstream &#39;)&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;===== 验证完成 =====&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-配置文件安全" tabindex="-1"><a class="header-anchor" href="#_9-配置文件安全"><span>9. 配置文件安全</span></a></h2><h3 id="_9-1-文件权限控制" tabindex="-1"><a class="header-anchor" href="#_9-1-文件权限控制"><span>9.1 文件权限控制</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 配置文件权限设置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置文件</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chmod</span><span style="color:#D19A66;"> 640</span><span style="color:#98C379;"> /etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chmod</span><span style="color:#D19A66;"> 640</span><span style="color:#98C379;"> /etc/nginx/conf.d/</span><span style="color:#E5C07B;">*</span><span style="color:#98C379;">.conf</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chmod</span><span style="color:#D19A66;"> 640</span><span style="color:#98C379;"> /etc/nginx/sites-available/</span><span style="color:#E5C07B;">*</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chmod</span><span style="color:#D19A66;"> 640</span><span style="color:#98C379;"> /etc/nginx/snippets/</span><span style="color:#E5C07B;">*</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 目录权限</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chmod</span><span style="color:#D19A66;"> 750</span><span style="color:#98C379;"> /etc/nginx</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chmod</span><span style="color:#D19A66;"> 750</span><span style="color:#98C379;"> /etc/nginx/conf.d</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chmod</span><span style="color:#D19A66;"> 750</span><span style="color:#98C379;"> /etc/nginx/sites-available</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chmod</span><span style="color:#D19A66;"> 750</span><span style="color:#98C379;"> /etc/nginx/sites-enabled</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chmod</span><span style="color:#D19A66;"> 750</span><span style="color:#98C379;"> /etc/nginx/snippets</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 所有者</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chown</span><span style="color:#D19A66;"> -R</span><span style="color:#98C379;"> root:nginx</span><span style="color:#98C379;"> /etc/nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SSL 证书（更严格的权限）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chmod</span><span style="color:#D19A66;"> 600</span><span style="color:#98C379;"> /etc/nginx/ssl/</span><span style="color:#E5C07B;">*</span><span style="color:#98C379;">.key</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chmod</span><span style="color:#D19A66;"> 644</span><span style="color:#98C379;"> /etc/nginx/ssl/</span><span style="color:#E5C07B;">*</span><span style="color:#98C379;">.crt</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chown</span><span style="color:#98C379;"> root:nginx</span><span style="color:#98C379;"> /etc/nginx/ssl/</span><span style="color:#E5C07B;">*</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-敏感信息处理" tabindex="-1"><a class="header-anchor" href="#_9-2-敏感信息处理"><span>9.2 敏感信息处理</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 不要在配置文件中硬编码密码</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># proxy_pass http://user:password@backend:8080;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 正确：使用环境变量</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在启动脚本中：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># export DB_PASSWORD=$(cat /run/secrets/db_password)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或者使用单独的认证文件</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/.htpasswd（权限 640，属主 root:nginx）</span></span>
<span class="line"><span style="color:#C678DD;">auth_basic </span><span style="color:#98C379;">&quot;Restricted Area&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">auth_basic_user_file </span><span style="color:#ABB2BF;">/etc/nginx/.htpasswd;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 创建 .htpasswd 文件</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> apache2-utils</span><span style="color:#7F848E;font-style:italic;">  # 安装 htpasswd 工具</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> htpasswd</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> /etc/nginx/.htpasswd</span><span style="color:#98C379;"> admin</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chmod</span><span style="color:#D19A66;"> 640</span><span style="color:#98C379;"> /etc/nginx/.htpasswd</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chown</span><span style="color:#98C379;"> root:nginx</span><span style="color:#98C379;"> /etc/nginx/.htpasswd</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-配置文件审计" tabindex="-1"><a class="header-anchor" href="#_9-3-配置文件审计"><span>9.3 配置文件审计</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 检查配置文件中的敏感信息</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -rn</span><span style="color:#98C379;"> &quot;password\\|secret\\|token\\|api_key&quot;</span><span style="color:#98C379;"> /etc/nginx/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查过于宽松的权限</span></span>
<span class="line"><span style="color:#61AFEF;">find</span><span style="color:#98C379;"> /etc/nginx/</span><span style="color:#D19A66;"> -perm</span><span style="color:#98C379;"> /o=r</span><span style="color:#D19A66;"> -type</span><span style="color:#98C379;"> f</span></span>
<span class="line"><span style="color:#61AFEF;">find</span><span style="color:#98C379;"> /etc/nginx/</span><span style="color:#D19A66;"> -perm</span><span style="color:#98C379;"> /o=w</span><span style="color:#D19A66;"> -type</span><span style="color:#98C379;"> f</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查符号链接</span></span>
<span class="line"><span style="color:#61AFEF;">find</span><span style="color:#98C379;"> /etc/nginx/</span><span style="color:#D19A66;"> -type</span><span style="color:#98C379;"> l</span><span style="color:#D19A66;"> -ls</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查空配置</span></span>
<span class="line"><span style="color:#61AFEF;">find</span><span style="color:#98C379;"> /etc/nginx/</span><span style="color:#D19A66;"> -name</span><span style="color:#98C379;"> &quot;*.conf&quot;</span><span style="color:#D19A66;"> -empty</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-配置热加载机制" tabindex="-1"><a class="header-anchor" href="#_10-配置热加载机制"><span>10. 配置热加载机制</span></a></h2><h3 id="_10-1-reload-的工作原理" tabindex="-1"><a class="header-anchor" href="#_10-1-reload-的工作原理"><span>10.1 reload 的工作原理</span></a></h3>`,68),i(d,{code:`eJxtkU1LAlEUhvf9irOshRN9LiSEoEUtsoLE9aQ3GdLRZqaPpUZmkqLiZ1iQECiBThEkNNn8mfn8F92ZOw4TM3d1ufd5zznve3h0foHYBNph6BRHZxYAnxzNCUyCydGsANvJDMMCzYM+Gej1O7XR8yH7NC8gzmLIzQccpJNx61vrDuNZ7iyAiKIrQnTeHcJG7OahSITUDQObYthrCPHAoXSWTm6dcMuRRbXWMPMF2I0dgiIP1Np0iYiJyKNeocAQJbXWwV3MYlWfTbROSZG+gulVCsy3iiEWCGqIY+2zTSrTaQGcAk9lrX1vP/4rYvkJwxoFp9iN5QqILTDkvj56cAXRrIAge4k/iMJDKjNZb43cUf09rFTDsE6BWm/gZOc6J46j2N6xq7FQV7GBFa+31i4nFXXWVMtVQ5xqHzfB9CYFyk/P7BfNfF4tfdsQSvNoHkD3JTCAeYqK/KxVCng8J0W5bgwqftxedBiM3ybuYbYeDVHEu9QKYkBSZC6PY10a6tLYUxqxyYU/pJ8qcg==`}),o[5]||=n(`<h3 id="_10-2-reload-与-restart-的区别" tabindex="-1"><a class="header-anchor" href="#_10-2-reload-与-restart-的区别"><span>10.2 reload 与 restart 的区别</span></a></h3><table><thead><tr><th>操作</th><th>命令</th><th>影响</th><th>停机时间</th><th>适用场景</th></tr></thead><tbody><tr><td>reload</td><td><code>nginx -s reload</code></td><td>优雅替换 Worker</td><td>无</td><td>配置变更</td></tr><tr><td>restart</td><td><code>systemctl restart nginx</code></td><td>停止后重新启动</td><td>短暂</td><td>二进制升级</td></tr><tr><td>stop</td><td><code>nginx -s stop</code></td><td>立即终止</td><td>永久</td><td>紧急停止</td></tr><tr><td>quit</td><td><code>nginx -s quit</code></td><td>优雅关闭</td><td>永久</td><td>计划维护</td></tr></tbody></table><h3 id="_10-3-reload-注意事项" tabindex="-1"><a class="header-anchor" href="#_10-3-reload-注意事项"><span>10.3 reload 注意事项</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># reload 前必须检查语法</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> reload</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果不检查语法直接 reload</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置错误时：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - 旧 Worker 继续运行</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - 新 Worker 无法启动</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - 但不会中断服务</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 但是，某些配置变更需要注意：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. SSL 证书更新 - reload 即可</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. upstream 服务器变更 - reload 即可</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 新增 listen 端口 - 需要 restart</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 修改 worker_processes - reload 即可</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 修改 worker_connections - reload 即可</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">reload 的安全机制</p><p>Nginx 的 reload 机制非常安全：如果新配置有语法错误，Master 进程会拒绝加载新配置，旧 Worker 继续运行，不会中断服务。但仍建议在 reload 前先执行 <code>nginx -t</code> 检查，以及时发现和修复配置问题。参考：<a href="https://nginx.org/en/docs/control.html" target="_blank" rel="noopener noreferrer">https://nginx.org/en/docs/control.html</a></p></div><h2 id="_11-本章小结" tabindex="-1"><a class="header-anchor" href="#_11-本章小结"><span>11. 本章小结</span></a></h2><p>本章系统梳理了 Nginx 配置文件体系：</p><ol><li><strong>全局结构</strong>：main → events/http/stream/mail 的层次结构</li><li><strong>include 机制</strong>：通过 include 实现配置分离与模块化</li><li><strong>目录组织</strong>：sites-available/sites-enabled 和 conf.d 两种风格</li><li><strong>加载顺序</strong>：理解 include 的加载顺序和指令覆盖规则</li><li><strong>优先级</strong>：server 和 location 的匹配优先级规则</li><li><strong>默认配置</strong>：逐行理解官方默认配置的含义</li><li><strong>版本管理</strong>：使用 Git/etckeeper 管理配置变更</li><li><strong>多环境</strong>：envsubst、条件加载、Docker 多阶段构建等方案</li><li><strong>格式化工具</strong>：nginx -T、crossplane、nginxbeautifier 等</li><li><strong>安全加固</strong>：文件权限、敏感信息处理、配置审计</li></ol><p>下一章将进入核心配置指令的详细讲解。</p>`,9)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};