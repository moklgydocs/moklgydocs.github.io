import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-D7E9GCrC.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/09_%E7%94%9F%E4%BA%A7%E7%BA%A7%E5%AE%9E%E6%88%98/01_%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83%E9%83%A8%E7%BD%B2%E6%96%B9%E6%A1%88.html","title":"生产环境部署方案","lang":"zh-CN","frontmatter":{"title":"生产环境部署方案","icon":"fa6-solid:rocket","order":1,"category":["Linux","Nginx"],"tag":["Nginx","生产部署","高可用","自动化","Ansible","Keepalived"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":24.57,"words":7370},"filePathRelative":"Linux/07_Nginx/09_生产级实战/01_生产环境部署方案.md"}`),s={name:`01_生产环境部署方案.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="生产环境部署方案" tabindex="-1"><a class="header-anchor" href="#生产环境部署方案"><span>生产环境部署方案</span></a></h1><div class="hint-container important"><p class="hint-container-title">生产部署的核心原则</p><p>生产环境部署不仅仅是&quot;把配置文件放到服务器上&quot;，而是一套涵盖架构设计、自动化管理、滚动升级、高可用保障和应急预案的完整体系。本文将从零到一构建一套生产级 Nginx 部署方案。</p></div><h2 id="_1-生产环境架构设计" tabindex="-1"><a class="header-anchor" href="#_1-生产环境架构设计"><span>1 生产环境架构设计</span></a></h2><h3 id="_1-1-架构设计原则" tabindex="-1"><a class="header-anchor" href="#_1-1-架构设计原则"><span>1.1 架构设计原则</span></a></h3><p>生产环境 Nginx 架构设计应遵循以下核心原则：</p><ul><li><strong>高可用性</strong>：消除单点故障，确保服务持续可用</li><li><strong>可扩展性</strong>：支持水平扩展，应对流量增长</li><li><strong>可观测性</strong>：完善的监控与告警体系</li><li><strong>可维护性</strong>：自动化部署与配置管理</li><li><strong>安全性</strong>：纵深防御，最小权限</li></ul><h3 id="_1-2-整体部署架构" tabindex="-1"><a class="header-anchor" href="#_1-2-整体部署架构"><span>1.2 整体部署架构</span></a></h3>`,7),i(d,{code:`eJxLL0osyFAIceJSAALnnMzUvJLop+sWPevY/nz1+lgFXV07BRe/4GggVnixfPGzeRNiwSpBfJCcj5NhtNKLLfNf7N37dG77i4ULn85coeBjaJNUpG/n7OKnH+7opoSuw4hIHUCzwTr83IF2+KVn5lUovOhqet60UwGi2tDSSM/QzELPUM/QAEML0BIULUboWgzhWoxgtqDxjcB8oDiY7xgQAHTG011Tnk9Z8WxO79MusMMhLrGyMLCAOQFJPdAN6OohzgCph9mPpN4YU70xXL0RXD3EfSD3oAvAXAwXMOYCixSXJkHiGRwkL2e3Pd+3BCwBdQASG2JEal4Kmk6Iw9C0wt0A5UA0QznGaCaVVOakQlOYQlpmTo6VcqphmmlaKpIsKPogUmlpacapBihSRrikQCEINdAizTTVEkUKpgsqBQBQZehu`}),o[1]||=n(`<h3 id="_1-3-多层架构详解" tabindex="-1"><a class="header-anchor" href="#_1-3-多层架构详解"><span>1.3 多层架构详解</span></a></h3><p>典型的生产环境采用多层架构：</p><table><thead><tr><th>层级</th><th>组件</th><th>职责</th></tr></thead><tbody><tr><td>L1</td><td>CDN / 云负载均衡</td><td>DDoS 防护、SSL 卸载、全局负载均衡</td></tr><tr><td>L2</td><td>Nginx 集群</td><td>反向代理、负载均衡、缓存、限流</td></tr><tr><td>L3</td><td>应用集群</td><td>业务逻辑处理</td></tr><tr><td>L4</td><td>数据层</td><td>数据库、缓存、消息队列</td></tr></tbody></table><div class="hint-container tip"><p class="hint-container-title">架构选择建议</p><ul><li>小型项目（日 PV &lt; 100 万）：单 Nginx + Keepalived 即可</li><li>中型项目（日 PV 100 万-1000 万）：Nginx 集群 + 云 LB</li><li>大型项目（日 PV &gt; 1000 万）：CDN + 云 LB + Nginx 集群 + 多机房</li></ul></div><h3 id="_1-4-网络拓扑规划" tabindex="-1"><a class="header-anchor" href="#_1-4-网络拓扑规划"><span>1.4 网络拓扑规划</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/nginx.conf - 生产环境主配置骨架</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 全局配置</span></span>
<span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;">nginx;</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_cpu_affinity </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">100000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">pid </span><span style="color:#ABB2BF;">/var/run/nginx.pid;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 加载模块</span></span>
<span class="line"><span style="color:#C678DD;">load_module </span><span style="color:#ABB2BF;">modules/ngx_http_geoip2_module.so;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    accept_mutex </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/mime.types;</span></span>
<span class="line"><span style="color:#C678DD;">    default_type </span><span style="color:#ABB2BF;">application/octet-stream;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 日志格式</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#D19A66;">main</span><span style="color:#98C379;"> &#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;$</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_x_forwarded_for</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;rt=$</span><span style="color:#E06C75;">request_time</span><span style="color:#98C379;"> uct=$</span><span style="color:#E06C75;">upstream_connect_time</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;uht=$</span><span style="color:#E06C75;">upstream_header_time</span><span style="color:#98C379;"> urt=$</span><span style="color:#E06C75;">upstream_response_time</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;"> buffer=32k flush=5s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 性能优化</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_requests </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 包含站点配置</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/conf.d/*.conf;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/sites-enabled/*;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-多实例部署" tabindex="-1"><a class="header-anchor" href="#_2-多实例部署"><span>2 多实例部署</span></a></h2><h3 id="_2-1-systemd-服务管理" tabindex="-1"><a class="header-anchor" href="#_2-1-systemd-服务管理"><span>2.1 systemd 服务管理</span></a></h3><p>生产环境推荐使用 systemd 管理 Nginx 服务：</p><div class="language-ini line-numbers-mode" data-highlighter="shiki" data-ext="ini" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-ini"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/systemd/system/nginx.service</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[Unit]</span></span>
<span class="line"><span style="color:#C678DD;">Description</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">The NGINX HTTP and reverse proxy server</span></span>
<span class="line"><span style="color:#C678DD;">After</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">network-online.target remote-fs.target nss-lookup.target</span></span>
<span class="line"><span style="color:#C678DD;">Wants</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">network-online.target</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[Service]</span></span>
<span class="line"><span style="color:#C678DD;">Type</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">forking</span></span>
<span class="line"><span style="color:#C678DD;">PIDFile</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/var/run/nginx.pid</span></span>
<span class="line"><span style="color:#C678DD;">ExecStartPre</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/usr/sbin/nginx -t -c /etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#C678DD;">ExecStart</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/usr/sbin/nginx -c /etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#C678DD;">ExecReload</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/bin/kill -s HUP $MAINPID</span></span>
<span class="line"><span style="color:#C678DD;">ExecStop</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/bin/kill -s QUIT $MAINPID</span></span>
<span class="line"><span style="color:#C678DD;">Restart</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">on-failure</span></span>
<span class="line"><span style="color:#C678DD;">RestartSec</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#C678DD;">LimitNOFILE</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">100000</span></span>
<span class="line"><span style="color:#C678DD;">LimitNPROC</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">65535</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安全加固</span></span>
<span class="line"><span style="color:#C678DD;">PrivateTmp</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">true</span></span>
<span class="line"><span style="color:#C678DD;">ProtectSystem</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">full</span></span>
<span class="line"><span style="color:#C678DD;">NoNewPrivileges</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">true</span></span>
<span class="line"><span style="color:#C678DD;">ReadWritePaths</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/var/log/nginx /var/cache/nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[Install]</span></span>
<span class="line"><span style="color:#C678DD;">WantedBy</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">multi-user.target</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">systemd 安全选项说明</p><ul><li><code>PrivateTmp=true</code>：Nginx 使用独立的 /tmp 目录</li><li><code>ProtectSystem=full</code>：防止 Nginx 写入系统目录</li><li><code>ReadWritePaths</code>：显式声明可写路径</li><li>这些选项可能在某些第三方模块场景下需要调整</li></ul></div><h3 id="_2-2-多端口监听部署" tabindex="-1"><a class="header-anchor" href="#_2-2-多端口监听部署"><span>2.2 多端口监听部署</span></a></h3><p>在资源有限的情况下，可以通过多端口方式部署多个 Nginx 实例：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/nginx-multi.sh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 多端口 Nginx 实例管理脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">NGINX_BASE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/nginx&quot;</span></span>
<span class="line"><span style="color:#E06C75;">INSTANCES</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;8080&quot;</span><span style="color:#98C379;"> &quot;8081&quot;</span><span style="color:#98C379;"> &quot;8082&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">case</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span><span style="color:#C678DD;"> in</span></span>
<span class="line"><span style="color:#E06C75;">    start</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        for</span><span style="color:#E06C75;"> port</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">INSTANCES</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;Starting Nginx instance on port </span><span style="color:#E06C75;">$port</span><span style="color:#98C379;">...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            nginx</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_BASE</span><span style="color:#98C379;">}/nginx-\${</span><span style="color:#E06C75;">port</span><span style="color:#98C379;">}.conf&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        done</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#E06C75;">    stop</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        for</span><span style="color:#E06C75;"> port</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">INSTANCES</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;Stopping Nginx instance on port </span><span style="color:#E06C75;">$port</span><span style="color:#98C379;">...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            nginx</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_BASE</span><span style="color:#98C379;">}/nginx-\${</span><span style="color:#E06C75;">port</span><span style="color:#98C379;">}.conf&quot;</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> stop</span></span>
<span class="line"><span style="color:#C678DD;">        done</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#E06C75;">    reload</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        for</span><span style="color:#E06C75;"> port</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">INSTANCES</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;Reloading Nginx instance on port </span><span style="color:#E06C75;">$port</span><span style="color:#98C379;">...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            nginx</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_BASE</span><span style="color:#98C379;">}/nginx-\${</span><span style="color:#E06C75;">port</span><span style="color:#98C379;">}.conf&quot;</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#C678DD;">        done</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#E06C75;">    status</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        for</span><span style="color:#E06C75;"> port</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">INSTANCES</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#E06C75;">            pid</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">pgrep</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;nginx-\${</span><span style="color:#E06C75;">port</span><span style="color:#98C379;">}.conf&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#56B6C2;">-n</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$pid</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#98C379;"> &quot;Nginx on port </span><span style="color:#E06C75;">$port</span><span style="color:#98C379;">: RUNNING (PID: </span><span style="color:#E06C75;">$pid</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            else</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#98C379;"> &quot;Nginx on port </span><span style="color:#E06C75;">$port</span><span style="color:#98C379;">: STOPPED&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            fi</span></span>
<span class="line"><span style="color:#C678DD;">        done</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#ABB2BF;">    *)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Usage: </span><span style="color:#E06C75;font-style:italic;">$0</span><span style="color:#98C379;"> {start|stop|reload|status}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#C678DD;">esac</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-多实例-systemd-服务" tabindex="-1"><a class="header-anchor" href="#_2-3-多实例-systemd-服务"><span>2.3 多实例 systemd 服务</span></a></h3><div class="language-ini line-numbers-mode" data-highlighter="shiki" data-ext="ini" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-ini"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/systemd/system/nginx@.service</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 模板化服务文件，通过 nginx@8080.service 启动</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[Unit]</span></span>
<span class="line"><span style="color:#C678DD;">Description</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">Nginx Instance on Port %i</span></span>
<span class="line"><span style="color:#C678DD;">After</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">network-online.target</span></span>
<span class="line"><span style="color:#C678DD;">Wants</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">network-online.target</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[Service]</span></span>
<span class="line"><span style="color:#C678DD;">Type</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">forking</span></span>
<span class="line"><span style="color:#C678DD;">PIDFile</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/var/run/nginx-%i.pid</span></span>
<span class="line"><span style="color:#C678DD;">ExecStartPre</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/usr/sbin/nginx -t -c /etc/nginx/nginx-%i.conf</span></span>
<span class="line"><span style="color:#C678DD;">ExecStart</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/usr/sbin/nginx -c /etc/nginx/nginx-%i.conf</span></span>
<span class="line"><span style="color:#C678DD;">ExecReload</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/bin/kill -s HUP $MAINPID</span></span>
<span class="line"><span style="color:#C678DD;">ExecStop</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/bin/kill -s QUIT $MAINPID</span></span>
<span class="line"><span style="color:#C678DD;">Restart</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">on-failure</span></span>
<span class="line"><span style="color:#C678DD;">RestartSec</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#C678DD;">LimitNOFILE</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">100000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[Install]</span></span>
<span class="line"><span style="color:#C678DD;">WantedBy</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">multi-user.target</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 启动多实例</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> nginx@8080</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> nginx@8081</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> nginx@8082</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看状态</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> nginx@8080</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置开机自启</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#98C379;"> nginx@8080</span><span style="color:#98C379;"> nginx@8081</span><span style="color:#98C379;"> nginx@8082</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-配置管理-ansible-自动化部署" tabindex="-1"><a class="header-anchor" href="#_3-配置管理-ansible-自动化部署"><span>3 配置管理：Ansible 自动化部署</span></a></h2><h3 id="_3-1-自动化部署流程" tabindex="-1"><a class="header-anchor" href="#_3-1-自动化部署流程"><span>3.1 自动化部署流程</span></a></h3>`,19),i(d,{code:`eJxLL0osyFDwCeJSAALH6Kd7Gp72T3zWP+HJriUvW3uf710Xq6Cra6fgFO2eWaLwZPfkp7smx4LVOoHFnaOdPfWdXRReLF8G1AeRcQbLuFQ/71v/dFHz044lz6atrQXLuIBkalJSy2oUXKNfNq94vnfT044NEDshqiEmQNQVlySmZ+al1yi4IdS+XNSCVW1BUX5KjYJ79PPGDU93gZzydAdU3hXsGo/oF+2rnnateNoz7dnW7hfrp0Ik3cCSntEvZ7c965iALOMOlvGCGvhyVc+L9Y0QGS+wjHf009YVL9v7ka3yADvlZcOsF/vbga4Gi3miiLlzgQWLSypzUhUcFdIyc3KslFON04zSUpAknHBJOEMl0tLSjFMNkCS8YTos0kxTLbkASWO8Vw==`}),o[2]||=n(`<h3 id="_3-2-ansible-项目结构" tabindex="-1"><a class="header-anchor" href="#_3-2-ansible-项目结构"><span>3.2 Ansible 项目结构</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ansible-nginx/</span></span>
<span class="line"><span>├── inventory/</span></span>
<span class="line"><span>│   ├── dev.yml</span></span>
<span class="line"><span>│   ├── staging.yml</span></span>
<span class="line"><span>│   └── prod.yml</span></span>
<span class="line"><span>├── group_vars/</span></span>
<span class="line"><span>│   ├── dev.yml</span></span>
<span class="line"><span>│   ├── staging.yml</span></span>
<span class="line"><span>│   └── prod.yml</span></span>
<span class="line"><span>├── host_vars/</span></span>
<span class="line"><span>│   ├── nginx-prod-01.yml</span></span>
<span class="line"><span>│   └── nginx-prod-02.yml</span></span>
<span class="line"><span>├── roles/</span></span>
<span class="line"><span>│   └── nginx/</span></span>
<span class="line"><span>│       ├── defaults/</span></span>
<span class="line"><span>│       │   └── main.yml</span></span>
<span class="line"><span>│       ├── vars/</span></span>
<span class="line"><span>│       │   └── main.yml</span></span>
<span class="line"><span>│       ├── tasks/</span></span>
<span class="line"><span>│       │   ├── main.yml</span></span>
<span class="line"><span>│       │   ├── install.yml</span></span>
<span class="line"><span>│       │   ├── configure.yml</span></span>
<span class="line"><span>│       │   ├── ssl.yml</span></span>
<span class="line"><span>│       │   └── validate.yml</span></span>
<span class="line"><span>│       ├── templates/</span></span>
<span class="line"><span>│       │   ├── nginx.conf.j2</span></span>
<span class="line"><span>│       │   ├── default.conf.j2</span></span>
<span class="line"><span>│       │   └── upstream.conf.j2</span></span>
<span class="line"><span>│       ├── handlers/</span></span>
<span class="line"><span>│       │   └── main.yml</span></span>
<span class="line"><span>│       ├── files/</span></span>
<span class="line"><span>│       │   └── nginx.service</span></span>
<span class="line"><span>│       └── meta/</span></span>
<span class="line"><span>│           └── main.yml</span></span>
<span class="line"><span>├── playbooks/</span></span>
<span class="line"><span>│   ├── deploy.yml</span></span>
<span class="line"><span>│   ├── rollback.yml</span></span>
<span class="line"><span>│   └── upgrade.yml</span></span>
<span class="line"><span>└── ansible.cfg</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-完整-ansible-playbook" tabindex="-1"><a class="header-anchor" href="#_3-3-完整-ansible-playbook"><span>3.3 完整 Ansible Playbook</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># ansible-nginx/roles/nginx/defaults/main.yml</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认变量（可被 group_vars/host_vars 覆盖）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">nginx_version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1.25.4&quot;</span></span>
<span class="line"><span style="color:#E06C75;">nginx_worker_processes</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">auto</span></span>
<span class="line"><span style="color:#E06C75;">nginx_worker_connections</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">65535</span></span>
<span class="line"><span style="color:#E06C75;">nginx_worker_rlimit_nofile</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 日志配置</span></span>
<span class="line"><span style="color:#E06C75;">nginx_error_log_level</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;warn&quot;</span></span>
<span class="line"><span style="color:#E06C75;">nginx_access_log_format</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">&gt;-</span></span>
<span class="line"><span style="color:#98C379;">  &#39;$remote_addr - $remote_user [$time_local] &quot;$request&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">  &#39;$status $body_bytes_sent &quot;$http_referer&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">  &#39;&quot;$http_user_agent&quot; &quot;$http_x_forwarded_for&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">  &#39;rt=$request_time uct=$upstream_connect_time &#39;</span></span>
<span class="line"><span style="color:#98C379;">  &#39;uht=$upstream_header_time urt=$upstream_response_time&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 超时配置</span></span>
<span class="line"><span style="color:#E06C75;">nginx_keepalive_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">65</span></span>
<span class="line"><span style="color:#E06C75;">nginx_client_body_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">60</span></span>
<span class="line"><span style="color:#E06C75;">nginx_client_header_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">60</span></span>
<span class="line"><span style="color:#E06C75;">nginx_send_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">60</span></span>
<span class="line"><span style="color:#E06C75;">nginx_proxy_connect_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#E06C75;">nginx_proxy_read_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">60</span></span>
<span class="line"><span style="color:#E06C75;">nginx_proxy_send_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">60</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 缓冲配置</span></span>
<span class="line"><span style="color:#E06C75;">nginx_proxy_buffer_size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;8k&quot;</span></span>
<span class="line"><span style="color:#E06C75;">nginx_proxy_buffers</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;8 8k&quot;</span></span>
<span class="line"><span style="color:#E06C75;">nginx_proxy_busy_buffers_size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;16k&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Gzip 配置</span></span>
<span class="line"><span style="color:#E06C75;">nginx_gzip</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">nginx_gzip_types</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">text/plain</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">text/css</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">application/json</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">application/javascript</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">text/xml</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">application/xml</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">application/xml+rss</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">text/javascript</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 上游服务器</span></span>
<span class="line"><span style="color:#E06C75;">nginx_upstreams</span><span style="color:#ABB2BF;">: []</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 虚拟主机</span></span>
<span class="line"><span style="color:#E06C75;">nginx_vhosts</span><span style="color:#ABB2BF;">: []</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SSL 配置</span></span>
<span class="line"><span style="color:#E06C75;">nginx_ssl_enable</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"><span style="color:#E06C75;">nginx_ssl_cert_path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;/etc/nginx/ssl&quot;</span></span>
<span class="line"><span style="color:#E06C75;">nginx_ssl_protocols</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;TLSv1.2 TLSv1.3&quot;</span></span>
<span class="line"><span style="color:#E06C75;">nginx_ssl_ciphers</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">&gt;-</span></span>
<span class="line"><span style="color:#98C379;">  ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:</span></span>
<span class="line"><span style="color:#98C379;">  ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384</span></span>
<span class="line"><span style="color:#E06C75;">nginx_ssl_prefer_server_ciphers</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">nginx_ssl_session_cache</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;shared:SSL:10m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">nginx_ssl_session_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1d&quot;</span></span>
<span class="line"><span style="color:#E06C75;">nginx_ssl_session_tickets</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安全头</span></span>
<span class="line"><span style="color:#E06C75;">nginx_security_headers</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># ansible-nginx/roles/nginx/tasks/main.yml</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">检查操作系统版本</span></span>
<span class="line"><span style="color:#E06C75;">  assert</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    that</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">ansible_os_family == &quot;RedHat&quot; or ansible_os_family == &quot;Debian&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    fail_msg</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;此 Playbook 仅支持 RedHat/Debian 系操作系统&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">安装 Nginx 依赖</span></span>
<span class="line"><span style="color:#E06C75;">  package</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ nginx_dependencies }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">present</span></span>
<span class="line"><span style="color:#E06C75;">  vars</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    nginx_dependencies</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">openssl</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">pcre</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">zlib</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">geoip</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">创建 Nginx 用户</span></span>
<span class="line"><span style="color:#E06C75;">  user</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">    system</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    shell</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/sbin/nologin</span></span>
<span class="line"><span style="color:#E06C75;">    create_home</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">创建必要目录</span></span>
<span class="line"><span style="color:#E06C75;">  file</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ item }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">directory</span></span>
<span class="line"><span style="color:#E06C75;">    owner</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">    group</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">    mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;0755&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  loop</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">/etc/nginx/conf.d</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">/etc/nginx/sites-available</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">/etc/nginx/sites-enabled</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">/etc/nginx/ssl</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">/var/log/nginx</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">/var/cache/nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">配置 Nginx 主配置文件</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    src</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx.conf.j2</span></span>
<span class="line"><span style="color:#E06C75;">    dest</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#E06C75;">    owner</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">root</span></span>
<span class="line"><span style="color:#E06C75;">    group</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">root</span></span>
<span class="line"><span style="color:#E06C75;">    mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;0644&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  notify</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">validate and reload nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">配置上游服务器</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    src</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">upstream.conf.j2</span></span>
<span class="line"><span style="color:#E06C75;">    dest</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;/etc/nginx/conf.d/upstream-{{ item.name }}.conf&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    owner</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">root</span></span>
<span class="line"><span style="color:#E06C75;">    group</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">root</span></span>
<span class="line"><span style="color:#E06C75;">    mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;0644&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  loop</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ nginx_upstreams }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  notify</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">validate and reload nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">配置虚拟主机</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    src</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default.conf.j2</span></span>
<span class="line"><span style="color:#E06C75;">    dest</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;/etc/nginx/sites-available/{{ item.server_name | default(&#39;default&#39;) }}.conf&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    owner</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">root</span></span>
<span class="line"><span style="color:#E06C75;">    group</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">root</span></span>
<span class="line"><span style="color:#E06C75;">    mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;0644&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  loop</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ nginx_vhosts }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  notify</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">validate and reload nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">启用虚拟主机</span></span>
<span class="line"><span style="color:#E06C75;">  file</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    src</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;/etc/nginx/sites-available/{{ item.server_name | default(&#39;default&#39;) }}.conf&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    dest</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;/etc/nginx/sites-enabled/{{ item.server_name | default(&#39;default&#39;) }}.conf&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">link</span></span>
<span class="line"><span style="color:#E06C75;">  loop</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ nginx_vhosts }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  notify</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">validate and reload nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">配置 SSL 证书</span></span>
<span class="line"><span style="color:#E06C75;">  copy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    src</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ item.cert_src }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    dest</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ nginx_ssl_cert_path }}/{{ item.cert_dest }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    owner</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">root</span></span>
<span class="line"><span style="color:#E06C75;">    group</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">root</span></span>
<span class="line"><span style="color:#E06C75;">    mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;0600&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  loop</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ nginx_ssl_certs | default([]) }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  notify</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">validate and reload nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">安装 systemd 服务文件</span></span>
<span class="line"><span style="color:#E06C75;">  copy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    src</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx.service</span></span>
<span class="line"><span style="color:#E06C75;">    dest</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/etc/systemd/system/nginx.service</span></span>
<span class="line"><span style="color:#E06C75;">    owner</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">root</span></span>
<span class="line"><span style="color:#E06C75;">    group</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">root</span></span>
<span class="line"><span style="color:#E06C75;">    mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;0644&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  notify</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">reload systemd</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">restart nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">启动并启用 Nginx</span></span>
<span class="line"><span style="color:#E06C75;">  systemd</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">    state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">started</span></span>
<span class="line"><span style="color:#E06C75;">    enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># ansible-nginx/roles/nginx/handlers/main.yml</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">validate and reload nginx</span></span>
<span class="line"><span style="color:#E06C75;">  block</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">验证 Nginx 配置</span></span>
<span class="line"><span style="color:#E06C75;">      command</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx -t</span></span>
<span class="line"><span style="color:#E06C75;">      changed_when</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">重载 Nginx</span></span>
<span class="line"><span style="color:#E06C75;">      systemd</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">        state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">reloaded</span></span>
<span class="line"><span style="color:#E06C75;">  rescue</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">配置验证失败，回滚</span></span>
<span class="line"><span style="color:#E06C75;">      debug</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        msg</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;配置验证失败！请检查配置文件。Nginx 继续使用旧配置运行。&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">reload systemd</span></span>
<span class="line"><span style="color:#E06C75;">  systemd</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    daemon_reload</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">restart nginx</span></span>
<span class="line"><span style="color:#E06C75;">  systemd</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">    state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">restarted</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-nginx-主配置模板" tabindex="-1"><a class="header-anchor" href="#_3-4-nginx-主配置模板"><span>3.4 Nginx 主配置模板</span></a></h3><div class="language-jinja2 line-numbers-mode" data-highlighter="shiki" data-ext="jinja2" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-jinja2"><span class="line"><span>{# ansible-nginx/roles/nginx/templates/nginx.conf.j2 #}</span></span>
<span class="line"><span># 由 Ansible 自动生成，请勿手动修改</span></span>
<span class="line"><span># 生成时间: {{ ansible_date_time.iso8601 }}</span></span>
<span class="line"><span># 目标主机: {{ inventory_hostname }}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>user {{ nginx_user | default(&#39;nginx&#39;) }};</span></span>
<span class="line"><span>worker_processes {{ nginx_worker_processes }};</span></span>
<span class="line"><span>{% if nginx_worker_cpu_affinity is defined %}</span></span>
<span class="line"><span>worker_cpu_affinity {{ nginx_worker_cpu_affinity }};</span></span>
<span class="line"><span>{% endif %}</span></span>
<span class="line"><span>worker_rlimit_nofile {{ nginx_worker_rlimit_nofile }};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>error_log /var/log/nginx/error.log {{ nginx_error_log_level }};</span></span>
<span class="line"><span>pid /var/run/nginx.pid;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>events {</span></span>
<span class="line"><span>    worker_connections {{ nginx_worker_connections }};</span></span>
<span class="line"><span>    use epoll;</span></span>
<span class="line"><span>    multi_accept on;</span></span>
<span class="line"><span>    accept_mutex off;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>http {</span></span>
<span class="line"><span>    include /etc/nginx/mime.types;</span></span>
<span class="line"><span>    default_type application/octet-stream;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 日志格式</span></span>
<span class="line"><span>    log_format main &#39;{{ nginx_access_log_format }}&#39;;</span></span>
<span class="line"><span>    access_log /var/log/nginx/access.log main buffer=32k flush=5s;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 性能优化</span></span>
<span class="line"><span>    sendfile on;</span></span>
<span class="line"><span>    tcp_nopush on;</span></span>
<span class="line"><span>    tcp_nodelay on;</span></span>
<span class="line"><span>    keepalive_timeout {{ nginx_keepalive_timeout }};</span></span>
<span class="line"><span>    keepalive_requests 1000;</span></span>
<span class="line"><span>    reset_timedout_connection on;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 客户端超时</span></span>
<span class="line"><span>    client_body_timeout {{ nginx_client_body_timeout }};</span></span>
<span class="line"><span>    client_header_timeout {{ nginx_client_header_timeout }};</span></span>
<span class="line"><span>    send_timeout {{ nginx_send_timeout }};</span></span>
<span class="line"><span>    client_max_body_size {{ nginx_client_max_body_size | default(&#39;50m&#39;) }};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 代理超时</span></span>
<span class="line"><span>    proxy_connect_timeout {{ nginx_proxy_connect_timeout }};</span></span>
<span class="line"><span>    proxy_read_timeout {{ nginx_proxy_read_timeout }};</span></span>
<span class="line"><span>    proxy_send_timeout {{ nginx_proxy_send_timeout }};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 代理缓冲</span></span>
<span class="line"><span>    proxy_buffer_size {{ nginx_proxy_buffer_size }};</span></span>
<span class="line"><span>    proxy_buffers {{ nginx_proxy_buffers }};</span></span>
<span class="line"><span>    proxy_busy_buffers_size {{ nginx_proxy_busy_buffers_size }};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{% if nginx_gzip %}</span></span>
<span class="line"><span>    # Gzip 压缩</span></span>
<span class="line"><span>    gzip on;</span></span>
<span class="line"><span>    gzip_vary on;</span></span>
<span class="line"><span>    gzip_proxied any;</span></span>
<span class="line"><span>    gzip_comp_level 4;</span></span>
<span class="line"><span>    gzip_min_length 256;</span></span>
<span class="line"><span>    gzip_types {{ nginx_gzip_types | join(&#39; &#39;) }};</span></span>
<span class="line"><span>{% endif %}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{% if nginx_security_headers %}</span></span>
<span class="line"><span>    # 安全头</span></span>
<span class="line"><span>    add_header X-Frame-Options &quot;SAMEORIGIN&quot; always;</span></span>
<span class="line"><span>    add_header X-Content-Type-Options &quot;nosniff&quot; always;</span></span>
<span class="line"><span>    add_header X-XSS-Protection &quot;1; mode=block&quot; always;</span></span>
<span class="line"><span>    add_header Referrer-Policy &quot;strict-origin-when-cross-origin&quot; always;</span></span>
<span class="line"><span>{% endif %}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 包含配置</span></span>
<span class="line"><span>    include /etc/nginx/conf.d/*.conf;</span></span>
<span class="line"><span>    include /etc/nginx/sites-enabled/*;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-5-执行部署" tabindex="-1"><a class="header-anchor" href="#_3-5-执行部署"><span>3.5 执行部署</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 部署到开发环境</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> inventory/dev.yml</span><span style="color:#98C379;"> playbooks/deploy.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 部署到预发环境（带确认）</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> inventory/staging.yml</span><span style="color:#98C379;"> playbooks/deploy.yml</span><span style="color:#D19A66;"> --check</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> inventory/staging.yml</span><span style="color:#98C379;"> playbooks/deploy.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 部署到生产环境（限制并发，逐台发布）</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> inventory/prod.yml</span><span style="color:#98C379;"> playbooks/deploy.yml</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --serial</span><span style="color:#D19A66;"> 1</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --limit</span><span style="color:#98C379;"> &quot;nginx-prod-01&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 灰度验证后全量发布</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> inventory/prod.yml</span><span style="color:#98C379;"> playbooks/deploy.yml</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --serial</span><span style="color:#98C379;"> &quot;25%&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">Ansible 部署最佳实践</p><ol><li>始终先执行 <code>--check</code> 模拟运行</li><li>生产环境使用 <code>--serial</code> 逐台或分批发布</li><li>Handler 中先验证再重载，避免配置错误导致服务中断</li><li>使用 Git 管理所有 Playbook 和模板</li><li>部署前备份当前配置</li></ol></div><h2 id="_4-滚动升级-零停机升级-nginx-版本" tabindex="-1"><a class="header-anchor" href="#_4-滚动升级-零停机升级-nginx-版本"><span>4 滚动升级：零停机升级 Nginx 版本</span></a></h2><h3 id="_4-1-升级时序图" tabindex="-1"><a class="header-anchor" href="#_4-1-升级时序图"><span>4.1 升级时序图</span></a></h3>`,13),i(d,{code:`eJyNVF1v0lAYvt+vOFeLJmPgLonhZiwZERl+EC5NYR2pdC22xXgJxgnMsoEXsAiZ2WSyqIxNFyAww5/pOW3/hafn8FGgqL18z/O+z/M+75PK7Ks0K8RZP8ckJGZ/BeAvxUgKF+dSjKCAnTBgZGAMS/rgVuv3YflkERL0WxhUbYLHjKyw0sOY5PbdCwf8XvDA4/HcX+gIbUVJR+V6sWPDsSP66IWNJipKSVZyAtkmLwFtBgMWAl6do3xX/95eIYidsMvnwwxeoN9VjHYZD9ALeVT/QV5DosIC8TUrYdwaQa2746KwxyXSEgtWV8E+k2TJDlqviApN40wlJcAJssLw/DwHbOS0wW+8idZXjWEN5juogiudJWTxFHCnZcktxzjBLSQ44Q3hmquti/yujQg74QWoNkTF83+yECxmEWMv5eUEC1scl81MFkSePd0A2vAMHnfnJwf9dHSS43ngIkArEGT4NC4Altrw8HKahhFR0D9eYw+f0pYWHMeafvmBsm1FMYpeHkuaTKLXn0FOdFH0Gs0UNqlyPQ0VHqGiagcHHh9xInT81ninl97D7k9ULxjDU3R0scSTaCC0ub3clDEz9YWCJ8Zodydm7QAe/DKrLVvYyRja6MJsOMY4q4OmPmjNqGp30c1bJyx9gVcqypdg6cjMZGCub5cf9gLzm2q0s5PsUxNQ6wvs9SiS4RUAizm937SmHH4mRUcHnkQCz+0GLJgw3p4AnVIxUmg1srzMjnhh48a4vTDrGeNrFtZO0eDTrAYag//RMIqALaAEb/1/qJRp3uBHdRwBmyrHvbcj4b+uPXd7C+64fK6I+Wmc7X8yVthd+QOOkz+M`}),o[3]||=n(`<h3 id="_4-2-滚动升级脚本" tabindex="-1"><a class="header-anchor" href="#_4-2-滚动升级脚本"><span>4.2 滚动升级脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/nginx-upgrade.sh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 零停机升级脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -euo</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置</span></span>
<span class="line"><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${1</span><span style="color:#ABB2BF;">:?</span><span style="color:#98C379;">请指定新版本号，如</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;font-style:italic;"> 1</span><span style="color:#98C379;">.</span><span style="color:#E06C75;font-style:italic;">25</span><span style="color:#98C379;">.</span><span style="color:#E06C75;font-style:italic;">4}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#E06C75;">NGINX_PREFIX</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/usr/local/nginx&quot;</span></span>
<span class="line"><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/usr/sbin/nginx&quot;</span></span>
<span class="line"><span style="color:#E06C75;">CURRENT_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#ABB2BF;">} -v 2&gt;&amp;1 | </span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;/&#39;</span><span style="color:#98C379;"> &#39;{print $2}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/opt/nginx-backup&quot;</span></span>
<span class="line"><span style="color:#E06C75;">LOG_FILE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/nginx-upgrade-$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S).log&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 日志函数</span></span>
<span class="line"><span style="color:#61AFEF;">log</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;[$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)] </span><span style="color:#E5C07B;">$*</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查函数</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;检查失败: </span><span style="color:#E5C07B;">$*</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主流程</span></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;=========================================&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;开始 Nginx 升级: \${</span><span style="color:#E06C75;">CURRENT_VERSION</span><span style="color:#98C379;">} -&gt; \${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;=========================================&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 1. 健康检查</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;步骤 1: 升级前健康检查&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    check</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#98C379;">} -t&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;当前配置验证通过&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 2. 备份</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;步骤 2: 备份当前版本&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">CURRENT_VERSION</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    cp</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">CURRENT_VERSION</span><span style="color:#98C379;">}/nginx&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    cp</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> /etc/nginx</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">CURRENT_VERSION</span><span style="color:#98C379;">}/conf&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;备份完成: \${</span><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">CURRENT_VERSION</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 3. 编译新版本</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;步骤 3: 编译 Nginx \${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    cd</span><span style="color:#98C379;"> /usr/local/src</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -d</span><span style="color:#98C379;"> &quot;nginx-\${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        curl</span><span style="color:#D19A66;"> -fSL</span><span style="color:#98C379;"> &quot;https://nginx.org/download/nginx-\${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">}.tar.gz&quot;</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> &quot;nginx-\${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">}.tar.gz&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        tar</span><span style="color:#98C379;"> xzf</span><span style="color:#98C379;"> &quot;nginx-\${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">}.tar.gz&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#56B6C2;">    cd</span><span style="color:#98C379;"> &quot;nginx-\${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 获取当前编译参数</span></span>
<span class="line"><span style="color:#E06C75;">    OLD_CONFIGURE</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#ABB2BF;">} -V 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &#39;configure arguments&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sed</span><span style="color:#98C379;"> &#39;s/configure arguments: //&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;旧编译参数: \${</span><span style="color:#E06C75;">OLD_CONFIGURE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">    eval</span><span style="color:#98C379;"> ./configure</span><span style="color:#ABB2BF;"> \${</span><span style="color:#E06C75;">OLD_CONFIGURE</span><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#61AFEF;">    make</span><span style="color:#D19A66;"> -j$(</span><span style="color:#61AFEF;">nproc</span><span style="color:#D19A66;">)</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;编译完成&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 4. 执行热升级</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;步骤 4: 执行热升级&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    OLD_PID</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /var/run/nginx.pid</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;旧 Master PID: \${</span><span style="color:#E06C75;">OLD_PID</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 替换二进制文件</span></span>
<span class="line"><span style="color:#61AFEF;">    cp</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#98C379;">}.old&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    cp</span><span style="color:#98C379;"> objs/nginx</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 发送 USR2 信号：启动新 Master</span></span>
<span class="line"><span style="color:#56B6C2;">    kill</span><span style="color:#D19A66;"> -USR2</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">OLD_PID</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查新 Master 是否启动</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#56B6C2;">-f</span><span style="color:#ABB2BF;"> /var/run/nginx.pid.newbin ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">        NEW_PID</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /var/run/nginx.pid.newbin</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;新 Master PID: \${</span><span style="color:#E06C75;">NEW_PID</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;错误: 新 Master 未启动&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 回滚</span></span>
<span class="line"><span style="color:#61AFEF;">        cp</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#98C379;">}.old&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        kill</span><span style="color:#D19A66;"> -HUP</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">OLD_PID</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 发送 WINCH 信号：优雅关闭旧 Worker</span></span>
<span class="line"><span style="color:#56B6C2;">    kill</span><span style="color:#D19A66;"> -WINCH</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">OLD_PID</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 验证新 Worker 是否正常</span></span>
<span class="line"><span style="color:#E06C75;">    NEW_WORKERS</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">pgrep</span><span style="color:#D19A66;"> -P</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NEW_PID</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">NEW_WORKERS</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> -gt</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;新 Worker 正常运行，数量: \${</span><span style="color:#E06C75;">NEW_WORKERS</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;错误: 新 Worker 未启动，回滚&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        kill</span><span style="color:#D19A66;"> -QUIT</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NEW_PID</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        kill</span><span style="color:#D19A66;"> -HUP</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">OLD_PID</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        cp</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#98C379;">}.old&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 5. 验证</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;步骤 5: 验证新版本&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    NEW_RUNNING_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#ABB2BF;">} -v 2&gt;&amp;1 | </span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;/&#39;</span><span style="color:#98C379;"> &#39;{print $2}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">NEW_RUNNING_VERSION</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;版本验证通过: \${</span><span style="color:#E06C75;">NEW_RUNNING_VERSION</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;版本不匹配，回滚&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        kill</span><span style="color:#D19A66;"> -QUIT</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NEW_PID</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        kill</span><span style="color:#D19A66;"> -HUP</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">OLD_PID</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        cp</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#98C379;">}.old&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 6. 健康检查</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;步骤 6: 运行健康检查&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 5</span></span>
<span class="line"><span style="color:#E06C75;">    HTTP_CODE</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> /dev/null</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> &#39;%{http_code}&#39;</span><span style="color:#98C379;"> http://localhost/healthz</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;000&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">HTTP_CODE</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;200&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;健康检查通过&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;健康检查失败 (HTTP \${</span><span style="color:#E06C75;">HTTP_CODE</span><span style="color:#98C379;">})，回滚&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        kill</span><span style="color:#D19A66;"> -QUIT</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NEW_PID</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        kill</span><span style="color:#D19A66;"> -HUP</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">OLD_PID</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        cp</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#98C379;">}.old&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 7. 关闭旧 Master</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;步骤 7: 关闭旧 Master&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    kill</span><span style="color:#D19A66;"> -QUIT</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">OLD_PID</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;旧 Master 已退出&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 8. 清理</span></span>
<span class="line"><span style="color:#61AFEF;">    rm</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SBIN</span><span style="color:#98C379;">}.old&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;升级完成: \${</span><span style="color:#E06C75;">CURRENT_VERSION</span><span style="color:#98C379;">} -&gt; \${</span><span style="color:#E06C75;">NEW_VERSION</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">升级注意事项</p><ol><li><strong>必须保留旧编译参数</strong>：使用 <code>nginx -V</code> 获取当前编译参数，确保新版本使用相同参数</li><li><strong>信号顺序严格</strong>：USR2 → WINCH → (验证) → QUIT，顺序不可颠倒</li><li><strong>回滚时机</strong>：在发送 QUIT 关闭旧 Master 之前，随时可以回滚</li><li><strong>窗口期监控</strong>：升级期间密切监控错误日志和指标</li><li><strong>避免配置变更</strong>：升级期间不要同时修改配置文件</li></ol></div><h2 id="_5-配置变更发布流程" tabindex="-1"><a class="header-anchor" href="#_5-配置变更发布流程"><span>5 配置变更发布流程</span></a></h2><h3 id="_5-1-test-→-canary-→-rollout-三阶段发布" tabindex="-1"><a class="header-anchor" href="#_5-1-test-→-canary-→-rollout-三阶段发布"><span>5.1 test → canary → rollout 三阶段发布</span></a></h3>`,5),i(d,{code:`eJx1kltvElEUhd/9FSdjfDKEqtGoMTUCvdB7gT5N+oAUsAmhBkZjAyYQhMFymzYlqSV2tPaCjXaItkZBwp9xn5n5Fx73mbQHozyRvdba68s+E0+Fnz4hIc8Vwn6PZLtYM/un0NihrTPa0H51D5aJyzVKPLLXT+h5nnbOzO5gGd0eVLyyZBmf6dcm/ZCj+uGDxyn3aDK+mnxBXIrEjV40+mQJak0oFuh5xTKal0aXEk0racfrQ+9Yhpvs3K41UB++RGnsj5QF7ShLxmWJVrbM3ltobML3Au5iXlM/hJ85NnOW8QTdMbJkQpbsQtvsf4Fyh+826wbs86gv+twdYhBObAIZJmXY0K1C3z6pWkaeK5Oo+DN8NkTnF+iEAZZPCeX2/isGKJQHlTC7QtzpnsKGadlulWhZ46TkOoF6hf3nlmm0zGT4Jo7iQMz8DcEHCDErS2a+A90j4WbecDKcWic3Rq459bO4e45ZW5u0fkyrKn2ngvGDGtv8yNtvLMMw66obet+sge4GbQ80zUnPYXo+w3uGyOYvyRZkSz2BjTa09mhvlye5jJyL7G1ff4SDY75F5Lx9wbmITQEZSjX66b34RAFUgv96oqDAIAywNcS+zmLbVhvCdQJricTaM4Wd56I3hNuXmBltcFplr4RmfjBya4RAuWRv6SyAibSynoiScRJbTSTuX43FIisrNwVh4X9CyBEid6N3IvcEYWlY+A0JCpFS`}),o[4]||=n(`<h3 id="_5-2-配置变更发布脚本" tabindex="-1"><a class="header-anchor" href="#_5-2-配置变更发布脚本"><span>5.2 配置变更发布脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/nginx-deploy.sh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置变更三阶段发布脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -euo</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">ENV</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${1</span><span style="color:#ABB2BF;">:?</span><span style="color:#98C379;">用法</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;"> nginx-deploy</span><span style="color:#98C379;">.</span><span style="color:#E06C75;">sh</span><span style="color:#98C379;"> &lt;</span><span style="color:#E06C75;">env</span><span style="color:#98C379;">&gt; &lt;</span><span style="color:#E06C75;">config_dir</span><span style="color:#98C379;">&gt;&quot;</span></span>
<span class="line"><span style="color:#98C379;">CONFIG_DIR=&quot;</span><span style="color:#E06C75;font-style:italic;">\${2</span><span style="color:#ABB2BF;">:?</span><span style="color:#98C379;">请指定配置目录</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#98C379;">DEPLOY_DIR=&quot;</span><span style="color:#ABB2BF;">/</span><span style="color:#E06C75;">etc</span><span style="color:#ABB2BF;">/</span><span style="color:#E06C75;">nginx</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#98C379;">BACKUP_DIR=&quot;</span><span style="color:#ABB2BF;">/</span><span style="color:#E06C75;">opt</span><span style="color:#ABB2BF;">/</span><span style="color:#E06C75;">nginx-config-backup</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#98C379;">TIMESTAMP=$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 通知函数</span></span>
<span class="line"><span style="color:#98C379;">notify() {</span></span>
<span class="line"><span style="color:#98C379;">    local level=&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#98C379;">    local message=&quot;</span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#98C379;">    echo &quot;[\${</span><span style="color:#E06C75;">level</span><span style="color:#98C379;">}] [$(date &#39;+%H:%M:%S&#39;)] \${</span><span style="color:#E06C75;">message</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#98C379;">    # 可集成钉钉/飞书/Slack 通知</span></span>
<span class="line"><span style="color:#98C379;">    # curl -X POST &quot;</span><span style="color:#E06C75;">$WEBHOOK_URL</span><span style="color:#98C379;">&quot; -d &quot;{</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#E06C75;">text</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#ABB2BF;">:</span><span style="color:#56B6C2;"> \\&quot;</span><span style="color:#98C379;">[\${</span><span style="color:#E06C75;">level</span><span style="color:#98C379;">}] \${</span><span style="color:#E06C75;">message</span><span style="color:#98C379;">}</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 语法检查</span></span>
<span class="line"><span style="color:#61AFEF;">validate_config</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    notify</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;开始语法检查...&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DEPLOY_DIR</span><span style="color:#98C379;">}/nginx.conf&quot;</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        notify</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;语法检查通过&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        notify</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;语法检查失败&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 备份当前配置</span></span>
<span class="line"><span style="color:#61AFEF;">backup_config</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> backup_path</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">TIMESTAMP</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_path</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    cp</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DEPLOY_DIR</span><span style="color:#98C379;">}&quot;/</span><span style="color:#E5C07B;">*</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_path</span><span style="color:#98C379;">}/&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    notify</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;配置已备份到 \${</span><span style="color:#E06C75;">backup_path</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_path</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 回滚配置</span></span>
<span class="line"><span style="color:#61AFEF;">rollback_config</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> backup_path</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    notify</span><span style="color:#98C379;"> &quot;WARNING&quot;</span><span style="color:#98C379;"> &quot;开始回滚配置...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    rm</span><span style="color:#D19A66;"> -rf</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DEPLOY_DIR</span><span style="color:#ABB2BF;">:?</span><span style="color:#98C379;">}&quot;/</span><span style="color:#E5C07B;">*</span></span>
<span class="line"><span style="color:#61AFEF;">    cp</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_path</span><span style="color:#98C379;">}&quot;/</span><span style="color:#E5C07B;">*</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DEPLOY_DIR</span><span style="color:#98C379;">}/&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#61AFEF;">    notify</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;回滚完成&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 健康检查</span></span>
<span class="line"><span style="color:#61AFEF;">health_check</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> url</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${1</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;">http</span><span style="color:#ABB2BF;">://</span><span style="color:#E06C75;">localhost</span><span style="color:#ABB2BF;">/</span><span style="color:#E06C75;">healthz</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> max_retries</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> retry</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    while</span><span style="color:#ABB2BF;"> [ </span><span style="color:#E06C75;">$retry</span><span style="color:#56B6C2;"> -lt</span><span style="color:#E06C75;"> $max_retries</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> code</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> /dev/null</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> &#39;%{http_code}&#39;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">url</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;000&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">code</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;200&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            notify</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;健康检查通过 (HTTP \${</span><span style="color:#E06C75;">code</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#E06C75;">        retry</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$((</span><span style="color:#61AFEF;">retry</span><span style="color:#98C379;"> +</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#61AFEF;">        sleep</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">    notify</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;健康检查失败 (HTTP \${</span><span style="color:#E06C75;">code</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主发布流程</span></span>
<span class="line"><span style="color:#C678DD;">case</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">ENV</span><span style="color:#98C379;">}&quot;</span><span style="color:#C678DD;"> in</span></span>
<span class="line"><span style="color:#E06C75;">    test</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        notify</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;====== 开始 TEST 阶段发布 ======&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        backup_path</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">backup_config</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        rsync</span><span style="color:#D19A66;"> -av</span><span style="color:#D19A66;"> --delete</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">CONFIG_DIR</span><span style="color:#98C379;">}/&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DEPLOY_DIR</span><span style="color:#98C379;">}/&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#61AFEF;"> validate_config</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#61AFEF;"> health_check</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">                notify</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;TEST 阶段发布成功&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            else</span></span>
<span class="line"><span style="color:#61AFEF;">                rollback_config</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_path</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">                notify</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;TEST 阶段健康检查失败，已回滚&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">                exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">            fi</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#61AFEF;">            rollback_config</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_path</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            notify</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;TEST 阶段语法检查失败，已回滚&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">    canary</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        notify</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;====== 开始 CANARY 阶段发布 ======&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 灰度发布：先在部分节点部署</span></span>
<span class="line"><span style="color:#E06C75;">        backup_path</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">backup_config</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        rsync</span><span style="color:#D19A66;"> -av</span><span style="color:#D19A66;"> --delete</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">CONFIG_DIR</span><span style="color:#98C379;">}/&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DEPLOY_DIR</span><span style="color:#98C379;">}/&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#61AFEF;"> validate_config</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#61AFEF;">            notify</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;灰度节点已部署，等待 5 分钟观察...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            sleep</span><span style="color:#D19A66;"> 300</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#61AFEF;"> health_check</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                # 检查错误率是否上升</span></span>
<span class="line"><span style="color:#E06C75;">                error_rate</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">tail</span><span style="color:#D19A66;"> -1000</span><span style="color:#98C379;"> /var/log/nginx/access.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">                    awk</span><span style="color:#98C379;"> &#39;{print $9}&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &#39;^5[0-9][0-9]&#39;</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                total</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">tail</span><span style="color:#D19A66;"> -1000</span><span style="color:#98C379;"> /var/log/nginx/access.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                rate</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$((</span><span style="color:#61AFEF;">error_rate</span><span style="color:#E5C07B;"> *</span><span style="color:#D19A66;"> 100</span><span style="color:#98C379;"> /</span><span style="color:#98C379;"> total</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">                if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#E06C75;">$rate</span><span style="color:#56B6C2;"> -lt</span><span style="color:#D19A66;"> 5</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">                    notify</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;灰度验证通过，错误率 \${</span><span style="color:#E06C75;">rate</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#C678DD;">                else</span></span>
<span class="line"><span style="color:#61AFEF;">                    rollback_config</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_path</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">                    notify</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;灰度验证失败，错误率 \${</span><span style="color:#E06C75;">rate</span><span style="color:#98C379;">}% 过高，已回滚&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">                    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">                fi</span></span>
<span class="line"><span style="color:#C678DD;">            else</span></span>
<span class="line"><span style="color:#61AFEF;">                rollback_config</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_path</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">                notify</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;灰度健康检查失败，已回滚&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">                exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">            fi</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#61AFEF;">            rollback_config</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_path</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">    rollout</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        notify</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;====== 开始 ROLLOUT 全量发布 ======&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        backup_path</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">backup_config</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        rsync</span><span style="color:#D19A66;"> -av</span><span style="color:#D19A66;"> --delete</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">CONFIG_DIR</span><span style="color:#98C379;">}/&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DEPLOY_DIR</span><span style="color:#98C379;">}/&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#61AFEF;"> validate_config</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#61AFEF;"> health_check</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">                notify</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;全量发布成功&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            else</span></span>
<span class="line"><span style="color:#61AFEF;">                rollback_config</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_path</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">                notify</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;全量发布健康检查失败，已回滚&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">                exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">            fi</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#61AFEF;">            rollback_config</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_path</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    *)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;用法: </span><span style="color:#E06C75;font-style:italic;">$0</span><span style="color:#98C379;"> {test|canary|rollout} &lt;config_dir&gt;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#C678DD;">esac</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-高可用方案-keepalived-vip" tabindex="-1"><a class="header-anchor" href="#_6-高可用方案-keepalived-vip"><span>6 高可用方案：Keepalived VIP</span></a></h2><h3 id="_6-1-ha-架构图" tabindex="-1"><a class="header-anchor" href="#_6-1-ha-架构图"><span>6.1 HA 架构图</span></a></h3>`,4),i(d,{code:`eJxLL0osyFAIceJSAALnnMzUvJLop+sWPevY/nz1+lgFXV07hTDPgGilFzNnPeuer+AZYJNUpG9naGmkZ2hmoWeoZ2hgABYBKlKK5QKbUlyaBDHVOzW1IDEnsyw1ReHl7Lbn+5aApUEAqBpstK9jcIhrULSSX3pmXoWCb2JxSWoRhgVgAW9X1wBHH88wVxeF4BDHEFcrqF6gpeiGOjk6e4cCnQwx1CkxObu0AN1QQxyGQvRCDU3NS4H4CGIV2HDHgADD6Ke7pjyfsgLiJ4hSiD64CnRtNWFBQQEKT/c3v9i+uQaqGE0fqhKIVrTwfDa19eWsOU872p/1LoL7GmaJHtAISABC1aHYg2wXSOWzvqXP1y0EBVkNiED1bnFJZU4qODjTMnNyrJTT0tIsk02QpKB2QmSTLVLNki2RZKH2QGSTklJS05K4AAwQvpA=`}),o[5]||=n(`<h3 id="_6-2-keepalived-安装与配置" tabindex="-1"><a class="header-anchor" href="#_6-2-keepalived-安装与配置"><span>6.2 Keepalived 安装与配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 Keepalived</span></span>
<span class="line"><span style="color:#61AFEF;">yum</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> keepalived</span><span style="color:#7F848E;font-style:italic;">        # CentOS/RHEL</span></span>
<span class="line"><span style="color:#61AFEF;">apt-get</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> keepalived</span><span style="color:#7F848E;font-style:italic;">     # Ubuntu/Debian</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/keepalived/keepalived.conf - Master 节点配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">global_defs</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    router_id</span><span style="color:#98C379;"> NGINX_MASTER</span></span>
<span class="line"><span style="color:#61AFEF;">    script_user</span><span style="color:#98C379;"> root</span></span>
<span class="line"><span style="color:#61AFEF;">    enable_script_security</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 健康检查脚本</span></span>
<span class="line"><span style="color:#61AFEF;">vrrp_script</span><span style="color:#98C379;"> check_nginx</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    script</span><span style="color:#98C379;"> &quot;/etc/keepalived/scripts/check_nginx.sh&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    interval</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#61AFEF;">    weight</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"><span style="color:#61AFEF;">    fall</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"><span style="color:#61AFEF;">    rise</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># VRRP 实例</span></span>
<span class="line"><span style="color:#61AFEF;">vrrp_instance</span><span style="color:#98C379;"> VI_1</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    state</span><span style="color:#98C379;"> MASTER</span></span>
<span class="line"><span style="color:#61AFEF;">    interface</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"><span style="color:#61AFEF;">    virtual_router_id</span><span style="color:#D19A66;"> 51</span></span>
<span class="line"><span style="color:#61AFEF;">    priority</span><span style="color:#D19A66;"> 100</span></span>
<span class="line"><span style="color:#61AFEF;">    advert_int</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 认证</span></span>
<span class="line"><span style="color:#61AFEF;">    authentication</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">        auth_type</span><span style="color:#98C379;"> PASS</span></span>
<span class="line"><span style="color:#61AFEF;">        auth_pass</span><span style="color:#98C379;"> NginxHA@2024</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 虚拟 IP</span></span>
<span class="line"><span style="color:#61AFEF;">    virtual_ipaddress</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">        192.168.1.100/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth0</span><span style="color:#98C379;"> label</span><span style="color:#98C379;"> eth0:vip</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 关联健康检查</span></span>
<span class="line"><span style="color:#61AFEF;">    track_script</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">        check_nginx</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 状态变更通知</span></span>
<span class="line"><span style="color:#61AFEF;">    notify_master</span><span style="color:#98C379;"> &quot;/etc/keepalived/scripts/notify.sh MASTER&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    notify_backup</span><span style="color:#98C379;"> &quot;/etc/keepalived/scripts/notify.sh BACKUP&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    notify_fault</span><span style="color:#98C379;">  &quot;/etc/keepalived/scripts/notify.sh FAULT&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/keepalived/keepalived.conf - Backup 节点配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">global_defs</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    router_id</span><span style="color:#98C379;"> NGINX_BACKUP</span></span>
<span class="line"><span style="color:#61AFEF;">    script_user</span><span style="color:#98C379;"> root</span></span>
<span class="line"><span style="color:#61AFEF;">    enable_script_security</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">vrrp_script</span><span style="color:#98C379;"> check_nginx</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    script</span><span style="color:#98C379;"> &quot;/etc/keepalived/scripts/check_nginx.sh&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    interval</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#61AFEF;">    weight</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"><span style="color:#61AFEF;">    fall</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"><span style="color:#61AFEF;">    rise</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">vrrp_instance</span><span style="color:#98C379;"> VI_1</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    state</span><span style="color:#98C379;"> BACKUP</span></span>
<span class="line"><span style="color:#61AFEF;">    interface</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"><span style="color:#61AFEF;">    virtual_router_id</span><span style="color:#D19A66;"> 51</span></span>
<span class="line"><span style="color:#61AFEF;">    priority</span><span style="color:#D19A66;"> 90</span></span>
<span class="line"><span style="color:#61AFEF;">    advert_int</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">    authentication</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">        auth_type</span><span style="color:#98C379;"> PASS</span></span>
<span class="line"><span style="color:#61AFEF;">        auth_pass</span><span style="color:#98C379;"> NginxHA@2024</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">    virtual_ipaddress</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">        192.168.1.100/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth0</span><span style="color:#98C379;"> label</span><span style="color:#98C379;"> eth0:vip</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">    track_script</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">        check_nginx</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">    notify_master</span><span style="color:#98C379;"> &quot;/etc/keepalived/scripts/notify.sh MASTER&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    notify_backup</span><span style="color:#98C379;"> &quot;/etc/keepalived/scripts/notify.sh BACKUP&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    notify_fault</span><span style="color:#98C379;">  &quot;/etc/keepalived/scripts/notify.sh FAULT&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-健康检查脚本" tabindex="-1"><a class="header-anchor" href="#_6-3-健康检查脚本"><span>6.3 健康检查脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/keepalived/scripts/check_nginx.sh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 健康检查脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">NGINX_PID</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/run/nginx.pid&quot;</span></span>
<span class="line"><span style="color:#E06C75;">HEALTH_URL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;http://127.0.0.1:80/healthz&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查 PID 文件</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_PID</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    logger</span><span style="color:#98C379;"> &quot;Keepalived: Nginx PID 文件不存在&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查进程是否存活</span></span>
<span class="line"><span style="color:#E06C75;">PID</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_PID</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#56B6C2;">kill</span><span style="color:#D19A66;"> -0</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">PID</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    logger</span><span style="color:#98C379;"> &quot;Keepalived: Nginx 进程 (PID: \${</span><span style="color:#E06C75;">PID</span><span style="color:#98C379;">}) 不存在&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 尝试自动重启</span></span>
<span class="line"><span style="color:#61AFEF;">    systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#56B6C2;">kill</span><span style="color:#D19A66;"> -0</span><span style="color:#98C379;"> &quot;$(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> \${</span><span style="color:#E06C75;">NGINX_PID</span><span style="color:#98C379;">} </span><span style="color:#ABB2BF;">2&gt;</span><span style="color:#98C379;">/dev/null)&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        logger</span><span style="color:#98C379;"> &quot;Keepalived: Nginx 自动重启失败&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查 HTTP 健康端点</span></span>
<span class="line"><span style="color:#E06C75;">HTTP_CODE</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> /dev/null</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> &#39;%{http_code}&#39;</span><span style="color:#D19A66;"> --max-time</span><span style="color:#D19A66;"> 3</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">HEALTH_URL</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;000&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">HTTP_CODE</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> !=</span><span style="color:#98C379;"> &quot;200&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    logger</span><span style="color:#98C379;"> &quot;Keepalived: Nginx 健康检查失败 (HTTP \${</span><span style="color:#E06C75;">HTTP_CODE</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">exit</span><span style="color:#D19A66;"> 0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-4-状态变更通知脚本" tabindex="-1"><a class="header-anchor" href="#_6-4-状态变更通知脚本"><span>6.4 状态变更通知脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/keepalived/scripts/notify.sh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Keepalived 状态变更通知</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">STATE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#E06C75;">HOSTNAME</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">hostname</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">VIP</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;192.168.1.100&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">logger</span><span style="color:#98C379;"> &quot;Keepalived: 状态变更为 \${</span><span style="color:#E06C75;">STATE</span><span style="color:#98C379;">} (主机: \${</span><span style="color:#E06C75;">HOSTNAME</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">case</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">STATE</span><span style="color:#98C379;">}&quot;</span><span style="color:#C678DD;"> in</span></span>
<span class="line"><span style="color:#E06C75;">    MASTER</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 绑定 VIP</span></span>
<span class="line"><span style="color:#61AFEF;">        logger</span><span style="color:#98C379;"> &quot;Keepalived: 当前节点成为 MASTER，绑定 VIP \${</span><span style="color:#E06C75;">VIP</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 可选：发送通知</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # curl -X POST &quot;$WEBHOOK_URL&quot; -d &quot;{\\&quot;text\\&quot;: \\&quot;[ALERT] \${HOSTNAME} 成为 MASTER\\&quot;}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#E06C75;">    BACKUP</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 解绑 VIP</span></span>
<span class="line"><span style="color:#61AFEF;">        logger</span><span style="color:#98C379;"> &quot;Keepalived: 当前节点成为 BACKUP，释放 VIP&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#E06C75;">    FAULT</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 故障状态</span></span>
<span class="line"><span style="color:#61AFEF;">        logger</span><span style="color:#98C379;"> &quot;Keepalived: 当前节点进入 FAULT 状态&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # curl -X POST &quot;$WEBHOOK_URL&quot; -d &quot;{\\&quot;text\\&quot;: \\&quot;[CRITICAL] \${HOSTNAME} 进入 FAULT 状态\\&quot;}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#C678DD;">esac</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-5-双主模式配置" tabindex="-1"><a class="header-anchor" href="#_6-5-双主模式配置"><span>6.5 双主模式配置</span></a></h3><div class="hint-container tip"><p class="hint-container-title">双主模式</p><p>默认主备模式中，Backup 节点处于闲置状态。双主模式下两个节点分别承载不同的 VIP，互为主备，充分利用资源。</p></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Master1 节点配置（同时是 VIP2 的 Backup）</span></span>
<span class="line"><span style="color:#61AFEF;">vrrp_instance</span><span style="color:#98C379;"> VI_1</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    state</span><span style="color:#98C379;"> MASTER</span></span>
<span class="line"><span style="color:#61AFEF;">    interface</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"><span style="color:#61AFEF;">    virtual_router_id</span><span style="color:#D19A66;"> 51</span></span>
<span class="line"><span style="color:#61AFEF;">    priority</span><span style="color:#D19A66;"> 100</span></span>
<span class="line"><span style="color:#61AFEF;">    virtual_ipaddress</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">        192.168.1.100/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">vrrp_instance</span><span style="color:#98C379;"> VI_2</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    state</span><span style="color:#98C379;"> BACKUP</span></span>
<span class="line"><span style="color:#61AFEF;">    interface</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"><span style="color:#61AFEF;">    virtual_router_id</span><span style="color:#D19A66;"> 52</span></span>
<span class="line"><span style="color:#61AFEF;">    priority</span><span style="color:#D19A66;"> 90</span></span>
<span class="line"><span style="color:#61AFEF;">    virtual_ipaddress</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">        192.168.1.101/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Master2 节点配置（同时是 VIP1 的 Backup）</span></span>
<span class="line"><span style="color:#61AFEF;">vrrp_instance</span><span style="color:#98C379;"> VI_1</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    state</span><span style="color:#98C379;"> BACKUP</span></span>
<span class="line"><span style="color:#61AFEF;">    interface</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"><span style="color:#61AFEF;">    virtual_router_id</span><span style="color:#D19A66;"> 51</span></span>
<span class="line"><span style="color:#61AFEF;">    priority</span><span style="color:#D19A66;"> 90</span></span>
<span class="line"><span style="color:#61AFEF;">    virtual_ipaddress</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">        192.168.1.100/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">vrrp_instance</span><span style="color:#98C379;"> VI_2</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    state</span><span style="color:#98C379;"> MASTER</span></span>
<span class="line"><span style="color:#61AFEF;">    interface</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"><span style="color:#61AFEF;">    virtual_router_id</span><span style="color:#D19A66;"> 52</span></span>
<span class="line"><span style="color:#61AFEF;">    priority</span><span style="color:#D19A66;"> 100</span></span>
<span class="line"><span style="color:#61AFEF;">    virtual_ipaddress</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">        192.168.1.101/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>DNS 轮询配置两个 VIP：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>www.example.com  A  192.168.1.100</span></span>
<span class="line"><span>www.example.com  A  192.168.1.101</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-nginx-配置模板化与版本控制" tabindex="-1"><a class="header-anchor" href="#_7-nginx-配置模板化与版本控制"><span>7 Nginx 配置模板化与版本控制</span></a></h2><h3 id="_7-1-配置目录结构" tabindex="-1"><a class="header-anchor" href="#_7-1-配置目录结构"><span>7.1 配置目录结构</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>/etc/nginx/</span></span>
<span class="line"><span>├── nginx.conf                    # 主配置（由 Ansible 模板生成）</span></span>
<span class="line"><span>├── conf.d/</span></span>
<span class="line"><span>│   ├── upstream-app1.conf        # 上游配置</span></span>
<span class="line"><span>│   ├── upstream-app2.conf</span></span>
<span class="line"><span>│   ├── proxy-params.conf         # 代理参数片段</span></span>
<span class="line"><span>│   ├── ssl-params.conf           # SSL 参数片段</span></span>
<span class="line"><span>│   └── security-headers.conf     # 安全头片段</span></span>
<span class="line"><span>├── sites-available/</span></span>
<span class="line"><span>│   ├── app1.example.com.conf     # 站点配置</span></span>
<span class="line"><span>│   ├── app2.example.com.conf</span></span>
<span class="line"><span>│   └── default.conf</span></span>
<span class="line"><span>├── sites-enabled/                # 软链接到 sites-available</span></span>
<span class="line"><span>│   ├── app1.example.com.conf -&gt; ../sites-available/app1.example.com.conf</span></span>
<span class="line"><span>│   └── default.conf -&gt; ../sites-available/default.conf</span></span>
<span class="line"><span>├── snippets/                     # 可复用配置片段</span></span>
<span class="line"><span>│   ├── ssl-ciphers.conf</span></span>
<span class="line"><span>│   ├── proxy-headers.conf</span></span>
<span class="line"><span>│   ├── log-formats.conf</span></span>
<span class="line"><span>│   └── rate-limit.conf</span></span>
<span class="line"><span>└── ssl/</span></span>
<span class="line"><span>    ├── example.com.crt</span></span>
<span class="line"><span>    ├── example.com.key</span></span>
<span class="line"><span>    └── dhparam.pem</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-配置片段复用" tabindex="-1"><a class="header-anchor" href="#_7-2-配置片段复用"><span>7.2 配置片段复用</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/snippets/proxy-headers.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 代理头通用配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Port $</span><span style="color:#E06C75;">server_port</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/snippets/ssl-ciphers.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SSL 密码套件配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">ssl_protocols </span><span style="color:#ABB2BF;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_ciphers </span><span style="color:#ABB2BF;">ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_prefer_server_ciphers </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_session_cache </span><span style="color:#ABB2BF;">shared:SSL:10m;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_session_timeout </span><span style="color:#D19A66;">1d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_session_tickets </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_stapling </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_stapling_verify </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/snippets/security-headers.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安全响应头配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">X-XSS-Protection </span><span style="color:#98C379;">&quot;1; mode=block&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">Referrer-Policy </span><span style="color:#98C379;">&quot;strict-origin-when-cross-origin&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">Content-Security-Policy </span><span style="color:#98C379;">&quot;default-src &#39;self&#39;; script-src &#39;self&#39; &#39;unsafe-inline&#39;; style-src &#39;self&#39; &#39;unsafe-inline&#39;;&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">Permissions-Policy </span><span style="color:#98C379;">&quot;camera=(), microphone=(), geolocation=()&quot;</span><span style="color:#ABB2BF;"> always;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-git-管理配置" tabindex="-1"><a class="header-anchor" href="#_7-3-git-管理配置"><span>7.3 Git 管理配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 初始化配置仓库</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> /etc/nginx</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> init</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> add</span><span style="color:#D19A66;"> -A</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> commit</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> &quot;Initial commit: baseline configuration&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .gitignore</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">.gitignore</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">*.key</span></span>
<span class="line"><span style="color:#98C379;">*.pem</span></span>
<span class="line"><span style="color:#98C379;">*.crt</span></span>
<span class="line"><span style="color:#98C379;">ssl/</span></span>
<span class="line"><span style="color:#98C379;">*.log</span></span>
<span class="line"><span style="color:#98C379;">*.pid</span></span>
<span class="line"><span style="color:#98C379;">*.old</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置变更后提交</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> add</span><span style="color:#D19A66;"> -A</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> commit</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> &quot;Update: 增加限流配置 for /api/&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看变更历史</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> log</span><span style="color:#D19A66;"> --oneline</span><span style="color:#D19A66;"> --all</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 回滚到上一版本</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> diff</span><span style="color:#98C379;"> HEAD~1</span><span style="color:#98C379;"> HEAD</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> checkout</span><span style="color:#98C379;"> HEAD~1</span><span style="color:#D19A66;"> --</span><span style="color:#98C379;"> conf.d/upstream-app1.conf</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-4-git-hook-自动校验" tabindex="-1"><a class="header-anchor" href="#_7-4-git-hook-自动校验"><span>7.4 Git Hook 自动校验</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/.git/hooks/pre-commit</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 提交前自动校验 Nginx 配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;正在校验 Nginx 配置...&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 临时目录测试</span></span>
<span class="line"><span style="color:#E06C75;">TEMP_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">mktemp</span><span style="color:#D19A66;"> -d</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">cp</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> /etc/nginx/</span><span style="color:#E5C07B;">*</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">TEMP_DIR</span><span style="color:#98C379;">}/&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 将暂存区的文件复制到临时目录</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> diff</span><span style="color:#D19A66;"> --cached</span><span style="color:#D19A66;"> --name-only</span><span style="color:#ABB2BF;"> | </span><span style="color:#C678DD;">while</span><span style="color:#56B6C2;"> read</span><span style="color:#98C379;"> file</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#61AFEF;">    git</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> &quot;:\${</span><span style="color:#E06C75;">file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">TEMP_DIR</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在临时目录中测试配置</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">TEMP_DIR</span><span style="color:#98C379;">}/nginx.conf&quot;</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;配置校验通过&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    rm</span><span style="color:#D19A66;"> -rf</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">TEMP_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;配置校验失败！请修正后再提交。&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    rm</span><span style="color:#D19A66;"> -rf</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">TEMP_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_8-多环境管理" tabindex="-1"><a class="header-anchor" href="#_8-多环境管理"><span>8 多环境管理</span></a></h2><h3 id="_8-1-环境差异管理" tabindex="-1"><a class="header-anchor" href="#_8-1-环境差异管理"><span>8.1 环境差异管理</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># group_vars/dev.yml</span></span>
<span class="line"><span style="color:#E06C75;">nginx_env</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dev</span></span>
<span class="line"><span style="color:#E06C75;">nginx_error_log_level</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">info</span></span>
<span class="line"><span style="color:#E06C75;">nginx_worker_connections</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1024</span></span>
<span class="line"><span style="color:#E06C75;">nginx_proxy_read_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">300</span></span>
<span class="line"><span style="color:#E06C75;">nginx_rate_limit_enable</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"><span style="color:#E06C75;">nginx_debug_headers</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">nginx_ssl_enable</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># upstream 配置</span></span>
<span class="line"><span style="color:#E06C75;">nginx_upstreams</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app1</span></span>
<span class="line"><span style="color:#E06C75;">    servers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;127.0.0.1:8080 weight=1 max_fails=3 fail_timeout=30s&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># group_vars/staging.yml</span></span>
<span class="line"><span style="color:#E06C75;">nginx_env</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">staging</span></span>
<span class="line"><span style="color:#E06C75;">nginx_error_log_level</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warn</span></span>
<span class="line"><span style="color:#E06C75;">nginx_worker_connections</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10240</span></span>
<span class="line"><span style="color:#E06C75;">nginx_proxy_read_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">120</span></span>
<span class="line"><span style="color:#E06C75;">nginx_rate_limit_enable</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">nginx_rate_limit_req</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;10r/s&quot;</span></span>
<span class="line"><span style="color:#E06C75;">nginx_debug_headers</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"><span style="color:#E06C75;">nginx_ssl_enable</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">nginx_upstreams</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app1</span></span>
<span class="line"><span style="color:#E06C75;">    servers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;10.0.1.10:8080 weight=1 max_fails=3 fail_timeout=30s&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;10.0.1.11:8080 weight=1 max_fails=3 fail_timeout=30s&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># group_vars/prod.yml</span></span>
<span class="line"><span style="color:#E06C75;">nginx_env</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">prod</span></span>
<span class="line"><span style="color:#E06C75;">nginx_error_log_level</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warn</span></span>
<span class="line"><span style="color:#E06C75;">nginx_worker_connections</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">65535</span></span>
<span class="line"><span style="color:#E06C75;">nginx_proxy_read_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">60</span></span>
<span class="line"><span style="color:#E06C75;">nginx_rate_limit_enable</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">nginx_rate_limit_req</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;100r/s&quot;</span></span>
<span class="line"><span style="color:#E06C75;">nginx_debug_headers</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span></span>
<span class="line"><span style="color:#E06C75;">nginx_ssl_enable</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">nginx_security_headers</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">nginx_upstreams</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app1</span></span>
<span class="line"><span style="color:#E06C75;">    servers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;10.0.2.10:8080 weight=1 max_fails=2 fail_timeout=10s&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;10.0.2.11:8080 weight=1 max_fails=2 fail_timeout=10s&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;10.0.2.12:8080 weight=1 max_fails=2 fail_timeout=10s&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    keepalive</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">32</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-环境感知配置模板" tabindex="-1"><a class="header-anchor" href="#_8-2-环境感知配置模板"><span>8.2 环境感知配置模板</span></a></h3><div class="language-jinja2 line-numbers-mode" data-highlighter="shiki" data-ext="jinja2" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-jinja2"><span class="line"><span>{# 基于 Ansible 变量生成环境感知的配置 #}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 环境: {{ nginx_env | upper }}</span></span>
<span class="line"><span># 生成时间: {{ ansible_date_time.iso8601 }}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{% if nginx_env == &#39;dev&#39; %}</span></span>
<span class="line"><span># ===== 开发环境特殊配置 =====</span></span>
<span class="line"><span># 开启调试信息</span></span>
<span class="line"><span>add_header X-Debug-Env &quot;{{ nginx_env }}&quot; always;</span></span>
<span class="line"><span>add_header X-Debug-Server $hostname always;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 宽松的超时设置</span></span>
<span class="line"><span>proxy_read_timeout 300s;</span></span>
<span class="line"><span>proxy_connect_timeout 30s;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{% elif nginx_env == &#39;staging&#39; %}</span></span>
<span class="line"><span># ===== 预发环境配置 =====</span></span>
<span class="line"><span># 接近生产但保留调试能力</span></span>
<span class="line"><span>proxy_read_timeout 120s;</span></span>
<span class="line"><span>proxy_connect_timeout 10s;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{% elif nginx_env == &#39;prod&#39; %}</span></span>
<span class="line"><span># ===== 生产环境配置 =====</span></span>
<span class="line"><span># 严格超时</span></span>
<span class="line"><span>proxy_read_timeout 60s;</span></span>
<span class="line"><span>proxy_connect_timeout 5s;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 限流保护</span></span>
<span class="line"><span>{% if nginx_rate_limit_enable %}</span></span>
<span class="line"><span>limit_req_zone $binary_remote_addr zone=api:10m rate={{ nginx_rate_limit_req }};</span></span>
<span class="line"><span>limit_req zone=api burst=20 nodelay;</span></span>
<span class="line"><span>{% endif %}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{% endif %}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-环境切换脚本" tabindex="-1"><a class="header-anchor" href="#_8-3-环境切换脚本"><span>8.3 环境切换脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/nginx-switch-env.sh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 快速切换 Nginx 环境</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -euo</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">TARGET_ENV</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${1</span><span style="color:#ABB2BF;">:?</span><span style="color:#98C379;">用法</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;"> nginx-switch-env</span><span style="color:#98C379;">.</span><span style="color:#E06C75;">sh</span><span style="color:#98C379;"> &lt;</span><span style="color:#E06C75;">dev</span><span style="color:#98C379;">|</span><span style="color:#E06C75;">staging</span><span style="color:#98C379;">|</span><span style="color:#E06C75;">prod</span><span style="color:#98C379;">&gt;</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#E06C75;">ANSIBLE_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/opt/ansible-nginx&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">case</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">TARGET_ENV</span><span style="color:#98C379;">}&quot;</span><span style="color:#C678DD;"> in</span></span>
<span class="line"><span style="color:#E06C75;">    dev</span><span style="color:#ABB2BF;">|</span><span style="color:#E06C75;">staging</span><span style="color:#ABB2BF;">|</span><span style="color:#E06C75;">prod</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;切换到 \${</span><span style="color:#E06C75;">TARGET_ENV</span><span style="color:#98C379;">} 环境...&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        cd</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">ANSIBLE_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        ansible-playbook</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;inventory/\${</span><span style="color:#E06C75;">TARGET_ENV</span><span style="color:#98C379;">}.yml&quot;</span><span style="color:#98C379;"> playbooks/deploy.yml</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">            --tags</span><span style="color:#98C379;"> &quot;configure&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">            --diff</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;切换完成&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#ABB2BF;">    *)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;不支持的环境: \${</span><span style="color:#E06C75;">TARGET_ENV</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;支持: dev, staging, prod&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#C678DD;">esac</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-回滚策略与应急预案" tabindex="-1"><a class="header-anchor" href="#_9-回滚策略与应急预案"><span>9 回滚策略与应急预案</span></a></h2><h3 id="_9-1-回滚策略" tabindex="-1"><a class="header-anchor" href="#_9-1-回滚策略"><span>9.1 回滚策略</span></a></h3><table><thead><tr><th>回滚级别</th><th>触发条件</th><th>回滚方式</th><th>恢复时间</th></tr></thead><tbody><tr><td>L1 配置回滚</td><td>nginx -t 失败</td><td>自动：不执行 reload</td><td>&lt; 1 秒</td></tr><tr><td>L2 快速回滚</td><td>健康检查失败</td><td>备份目录覆盖</td><td>&lt; 30 秒</td></tr><tr><td>L3 Git 回滚</td><td>功能异常发现</td><td>git checkout</td><td>&lt; 2 分钟</td></tr><tr><td>L4 版本回滚</td><td>Nginx 版本问题</td><td>发送信号切换旧 Master</td><td>&lt; 5 分钟</td></tr><tr><td>L5 Ansible 回滚</td><td>全量回滚</td><td>执行 rollback Playbook</td><td>&lt; 10 分钟</td></tr></tbody></table><h3 id="_9-2-自动回滚脚本" tabindex="-1"><a class="header-anchor" href="#_9-2-自动回滚脚本"><span>9.2 自动回滚脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/nginx-rollback.sh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 配置自动回滚</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -euo</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/opt/nginx-config-backup&quot;</span></span>
<span class="line"><span style="color:#E06C75;">DEPLOY_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/nginx&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 列出可用备份</span></span>
<span class="line"><span style="color:#61AFEF;">list_backups</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;可用的备份版本：&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;----------------------------------------------------&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    ls</span><span style="color:#D19A66;"> -lt</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;----------------------------------------------------&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 回滚到指定版本</span></span>
<span class="line"><span style="color:#61AFEF;">rollback_to</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> target</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> backup_path</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">target</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -d</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_path</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: 备份 \${</span><span style="color:#E06C75;">target</span><span style="color:#98C379;">} 不存在&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        list_backups</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;回滚到版本: \${</span><span style="color:#E06C75;">target</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 备份当前（失败）配置</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> current_backup</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#98C379;">}/failed-$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S)&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">current_backup</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    cp</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DEPLOY_DIR</span><span style="color:#98C379;">}&quot;/</span><span style="color:#E5C07B;">*</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">current_backup</span><span style="color:#98C379;">}/&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;当前配置已保存到 \${</span><span style="color:#E06C75;">current_backup</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 恢复目标版本</span></span>
<span class="line"><span style="color:#61AFEF;">    rm</span><span style="color:#D19A66;"> -rf</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DEPLOY_DIR</span><span style="color:#ABB2BF;">:?</span><span style="color:#98C379;">}&quot;/</span><span style="color:#E5C07B;">*</span></span>
<span class="line"><span style="color:#61AFEF;">    cp</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_path</span><span style="color:#98C379;">}&quot;/</span><span style="color:#E5C07B;">*</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DEPLOY_DIR</span><span style="color:#98C379;">}/&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 验证并重载</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;回滚成功，配置已重载&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;回滚配置也验证失败，请手动修复&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 回滚到上一版本</span></span>
<span class="line"><span style="color:#61AFEF;">rollback_previous</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> previous</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">ls</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sed</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> &#39;2p&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">previous</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: 没有可用的历史备份&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#61AFEF;">    rollback_to</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">previous</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主逻辑</span></span>
<span class="line"><span style="color:#C678DD;">case</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">\${1</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;">help</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#C678DD;"> in</span></span>
<span class="line"><span style="color:#E06C75;">    list</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        list_backups</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#E06C75;">    to</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        rollback_to</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">\${2</span><span style="color:#ABB2BF;">:?</span><span style="color:#98C379;">请指定版本号</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#E06C75;">    prev</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        rollback_previous</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#E06C75;">    help</span><span style="color:#ABB2BF;">|*</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;用法: nginx-rollback.sh {list|to &lt;version&gt;|prev}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  list  - 列出可用备份&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  to    - 回滚到指定版本&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  prev  - 回滚到上一版本&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#C678DD;">esac</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-应急预案" tabindex="-1"><a class="header-anchor" href="#_9-3-应急预案"><span>9.3 应急预案</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/nginx-emergency.sh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 应急操作手册</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">case</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">\${1</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;">help</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#C678DD;"> in</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 紧急限流</span></span>
<span class="line"><span style="color:#E06C75;">    ratelimit</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;紧急限流：限制所有请求到 10r/s&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/nginx/conf.d/emergency-ratelimit.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">limit_req_zone $binary_remote_addr zone=emergency:100m rate=10r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">server {</span></span>
<span class="line"><span style="color:#98C379;">    listen 80;</span></span>
<span class="line"><span style="color:#98C379;">    limit_req zone=emergency burst=20 nodelay;</span></span>
<span class="line"><span style="color:#98C379;">    location / {</span></span>
<span class="line"><span style="color:#98C379;">        proxy_pass http://backend;</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#61AFEF;">        nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;紧急限流已启用&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 降级：返回静态页面</span></span>
<span class="line"><span style="color:#E06C75;">    degrade</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;降级：返回维护页面&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/nginx/conf.d/emergency-degrade.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">server {</span></span>
<span class="line"><span style="color:#98C379;">    listen 80 default_server;</span></span>
<span class="line"><span style="color:#98C379;">    root /var/www/maintenance;</span></span>
<span class="line"><span style="color:#98C379;">    try_files /index.html =503;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">    location / {</span></span>
<span class="line"><span style="color:#98C379;">        return 503;</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">    error_page 503 /index.html;</span></span>
<span class="line"><span style="color:#98C379;">    location = /index.html {</span></span>
<span class="line"><span style="color:#98C379;">        root /var/www/maintenance;</span></span>
<span class="line"><span style="color:#98C379;">        internal;</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#61AFEF;">        mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /var/www/maintenance</span></span>
<span class="line"><span style="color:#61AFEF;">        cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/var/www/maintenance/index.html</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;HTML&#39;</span></span>
<span class="line"><span style="color:#98C379;">&lt;!DOCTYPE html&gt;</span></span>
<span class="line"><span style="color:#98C379;">&lt;html&gt;</span></span>
<span class="line"><span style="color:#98C379;">&lt;head&gt;&lt;title&gt;系统维护中&lt;/title&gt;&lt;/head&gt;</span></span>
<span class="line"><span style="color:#98C379;">&lt;body&gt;&lt;h1&gt;系统维护中&lt;/h1&gt;&lt;p&gt;请稍后重试&lt;/p&gt;&lt;/body&gt;</span></span>
<span class="line"><span style="color:#98C379;">&lt;/html&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">HTML</span></span>
<span class="line"><span style="color:#61AFEF;">        nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;降级页面已启用&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 摘除节点：从 upstream 中移除</span></span>
<span class="line"><span style="color:#E06C75;">    drain</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">        SERVER</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${2</span><span style="color:#ABB2BF;">:?</span><span style="color:#98C379;">请指定服务器地址，如 </span><span style="color:#E06C75;font-style:italic;">10</span><span style="color:#98C379;">.</span><span style="color:#E06C75;font-style:italic;">0</span><span style="color:#98C379;">.</span><span style="color:#E06C75;font-style:italic;">1</span><span style="color:#98C379;">.</span><span style="color:#E06C75;font-style:italic;">10</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;font-style:italic;">8080}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;摘除节点: \${</span><span style="color:#E06C75;">SERVER</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 将目标服务器标记为 down</span></span>
<span class="line"><span style="color:#61AFEF;">        find</span><span style="color:#98C379;"> /etc/nginx</span><span style="color:#D19A66;"> -name</span><span style="color:#98C379;"> &quot;*.conf&quot;</span><span style="color:#D19A66;"> -exec</span><span style="color:#98C379;"> sed</span><span style="color:#D19A66;"> -i</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">            &quot;s/server \${</span><span style="color:#E06C75;">SERVER</span><span style="color:#98C379;">} weight/server \${</span><span style="color:#E06C75;">SERVER</span><span style="color:#98C379;">} down # DRAINED weight/g&quot;</span><span style="color:#98C379;"> {}</span><span style="color:#56B6C2;"> \\;</span></span>
<span class="line"><span style="color:#61AFEF;">        nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;节点 \${</span><span style="color:#E06C75;">SERVER</span><span style="color:#98C379;">} 已摘除&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 紧急扩容：添加上游服务器</span></span>
<span class="line"><span style="color:#E06C75;">    scale</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">        SERVER</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${2</span><span style="color:#ABB2BF;">:?</span><span style="color:#98C379;">请指定服务器地址，如 </span><span style="color:#E06C75;font-style:italic;">10</span><span style="color:#98C379;">.</span><span style="color:#E06C75;font-style:italic;">0</span><span style="color:#98C379;">.</span><span style="color:#E06C75;font-style:italic;">1</span><span style="color:#98C379;">.</span><span style="color:#E06C75;font-style:italic;">20</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;font-style:italic;">8080}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        UPSTREAM</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${3</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;">backend</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;紧急扩容: 添加 \${</span><span style="color:#E06C75;">SERVER</span><span style="color:#98C379;">} 到 \${</span><span style="color:#E06C75;">UPSTREAM</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;    server \${</span><span style="color:#E06C75;">SERVER</span><span style="color:#98C379;">} weight=1 max_fails=3 fail_timeout=30s;&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">            &gt;&gt; </span><span style="color:#98C379;">&quot;/etc/nginx/conf.d/upstream-\${</span><span style="color:#E06C75;">UPSTREAM</span><span style="color:#98C379;">}.conf&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;扩容完成&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 黑名单：封禁 IP</span></span>
<span class="line"><span style="color:#E06C75;">    blockip</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">        IP</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${2</span><span style="color:#ABB2BF;">:?</span><span style="color:#98C379;">请指定 </span><span style="color:#E06C75;">IP</span><span style="color:#98C379;"> 地址</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;封禁 IP: \${</span><span style="color:#E06C75;">IP</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;deny \${</span><span style="color:#E06C75;">IP</span><span style="color:#98C379;">};&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">/etc/nginx/conf.d/blacklist.conf</span></span>
<span class="line"><span style="color:#61AFEF;">        nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;IP \${</span><span style="color:#E06C75;">IP</span><span style="color:#98C379;">} 已封禁&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 全量重启</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;全量重启 Nginx&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Nginx 已重启&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">    help</span><span style="color:#ABB2BF;">|*</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;=========================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  Nginx 应急操作手册&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;=========================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  ratelimit           - 紧急限流&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  degrade             - 降级到维护页面&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  drain &lt;server&gt;      - 摘除上游节点&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  scale &lt;server&gt; [up] - 紧急扩容&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  blockip &lt;ip&gt;        - 封禁 IP&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  restart             - 全量重启&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#C678DD;">esac</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-生产环境检查清单" tabindex="-1"><a class="header-anchor" href="#_10-生产环境检查清单"><span>10 生产环境检查清单</span></a></h2><h3 id="_10-1-部署前检查" tabindex="-1"><a class="header-anchor" href="#_10-1-部署前检查"><span>10.1 部署前检查</span></a></h3><div class="hint-container important"><p class="hint-container-title">部署前必查项</p><p>在将 Nginx 部署到生产环境之前，务必逐项确认以下检查清单。</p></div><table><thead><tr><th>#</th><th>检查项</th><th>命令/方法</th><th>预期结果</th></tr></thead><tbody><tr><td>1</td><td>配置语法正确</td><td><code>nginx -t</code></td><td>syntax is ok / test is successful</td></tr><tr><td>2</td><td>监听端口正确</td><td><code>ss -tlnp | grep nginx</code></td><td>仅监听预期端口</td></tr><tr><td>3</td><td>SSL 证书有效</td><td><code>openssl x509 -enddate -noout</code></td><td>未过期</td></tr><tr><td>4</td><td>证书链完整</td><td><code>openssl verify -CAfile chain.pem cert.pem</code></td><td>OK</td></tr><tr><td>5</td><td>上游服务器可达</td><td><code>curl -s -o /dev/null -w &#39;%{http_code}&#39; backend:8080/healthz</code></td><td>200</td></tr><tr><td>6</td><td>日志目录可写</td><td><code>su -s /bin/bash nginx -c &#39;touch /var/log/nginx/test&#39;</code></td><td>成功</td></tr><tr><td>7</td><td>缓存目录可写</td><td><code>su -s /bin/bash nginx -c &#39;touch /var/cache/nginx/test&#39;</code></td><td>成功</td></tr><tr><td>8</td><td>文件描述符限制</td><td><code>cat /proc/$(cat /var/run/nginx.pid)/limits | grep &quot;open files&quot;</code></td><td>&gt;= worker_rlimit_nofile</td></tr><tr><td>9</td><td>worker 进程数</td><td><code>ps aux | grep &quot;worker process&quot; | wc -l</code></td><td>等于 CPU 核数（auto）</td></tr><tr><td>10</td><td>无敏感信息泄露</td><td><code>curl -I https://localhost/ | grep Server</code></td><td>不暴露版本号</td></tr></tbody></table><h3 id="_10-2-安全加固检查" tabindex="-1"><a class="header-anchor" href="#_10-2-安全加固检查"><span>10.2 安全加固检查</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安全加固配置汇总</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 隐藏版本号</span></span>
<span class="line"><span style="color:#C678DD;">server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 禁止不安全的 HTTP 方法</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">request_method</span><span style="color:#ABB2BF;"> !~ </span><span style="color:#E06C75;">^(GET|HEAD|POST|PUT|DELETE|PATCH|OPTIONS)$</span><span style="color:#ABB2BF;"> ) {</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 405</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 防止 MIME 类型嗅探</span></span>
<span class="line"><span style="color:#C678DD;">types</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    text/html</span><span style="color:#ABB2BF;"> html htm;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#C678DD;">default_type </span><span style="color:#ABB2BF;">application/octet-stream;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 点击劫持防护</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># XSS 防护</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">X-XSS-Protection </span><span style="color:#98C379;">&quot;1; mode=block&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 禁止 MIME 嗅探</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CSP 策略</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">Content-Security-Policy </span><span style="color:#98C379;">&quot;default-src &#39;self&#39;&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HSTS（仅 HTTPS）</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">Strict-Transport-Security </span><span style="color:#98C379;">&quot;max-age=31536000; includeSubDomains; preload&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 禁止目录列表</span></span>
<span class="line"><span style="color:#C678DD;">autoindex </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 限制客户端请求体大小</span></span>
<span class="line"><span style="color:#C678DD;">client_max_body_size </span><span style="color:#D19A66;">50m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 禁止访问隐藏文件</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">/\\. </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    log_not_found </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-性能优化检查" tabindex="-1"><a class="header-anchor" href="#_10-3-性能优化检查"><span>10.3 性能优化检查</span></a></h3><table><thead><tr><th>#</th><th>优化项</th><th>配置</th><th>说明</th></tr></thead><tbody><tr><td>1</td><td>worker_processes</td><td><code>auto</code></td><td>自动匹配 CPU 核数</td></tr><tr><td>2</td><td>worker_connections</td><td><code>65535</code></td><td>每个 Worker 最大连接数</td></tr><tr><td>3</td><td>worker_rlimit_nofile</td><td><code>100000</code></td><td>文件描述符限制</td></tr><tr><td>4</td><td>use epoll</td><td><code>use epoll</code></td><td>Linux 高效事件模型</td></tr><tr><td>5</td><td>sendfile</td><td><code>on</code></td><td>零拷贝发送文件</td></tr><tr><td>6</td><td>tcp_nopush</td><td><code>on</code></td><td>优化数据包发送</td></tr><tr><td>7</td><td>tcp_nodelay</td><td><code>on</code></td><td>禁用 Nagle 算法</td></tr><tr><td>8</td><td>keepalive_timeout</td><td><code>65</code></td><td>长连接超时</td></tr><tr><td>9</td><td>gzip</td><td><code>on</code></td><td>开启压缩</td></tr><tr><td>10</td><td>open_file_cache</td><td><code>max=10000 inactive=30s</code></td><td>文件缓存</td></tr><tr><td>11</td><td>proxy_buffering</td><td><code>on</code></td><td>代理缓冲</td></tr><tr><td>12</td><td>upstream keepalive</td><td><code>keepalive 32</code></td><td>上游长连接</td></tr></tbody></table><h3 id="_10-4-内核参数优化" tabindex="-1"><a class="header-anchor" href="#_10-4-内核参数优化"><span>10.4 内核参数优化</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/sysctl.d/99-nginx.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 内核参数优化</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TCP 连接队列</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.somaxconn</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 65535</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.netdev_max_backlog</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 65535</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TCP 读写缓冲区</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.rmem_max</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 16777216</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.wmem_max</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 16777216</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_rmem</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 4096</span><span style="color:#D19A66;"> 87380</span><span style="color:#D19A66;"> 16777216</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_wmem</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 4096</span><span style="color:#D19A66;"> 65536</span><span style="color:#D19A66;"> 16777216</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TCP 连接优化</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_max_syn_backlog</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 65535</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_max_tw_buckets</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 65535</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_tw_reuse</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_fin_timeout</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 15</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_keepalive_time</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 300</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_keepalive_intvl</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 15</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_keepalive_probes</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 5</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TIME_WAIT 优化</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_timestamps</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 本地端口范围</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.ip_local_port_range</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1024</span><span style="color:#D19A66;"> 65535</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 文件描述符</span></span>
<span class="line"><span style="color:#61AFEF;">fs.file-max</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1000000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 连接跟踪</span></span>
<span class="line"><span style="color:#61AFEF;">net.netfilter.nf_conntrack_max</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1048576</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SYN Flood 防护</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_syncookies</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_synack_retries</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 应用配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># sysctl -p /etc/sysctl.d/99-nginx.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/security/limits.d/nginx.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 用户资源限制</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#98C379;"> soft</span><span style="color:#98C379;"> nofile</span><span style="color:#D19A66;"> 100000</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#98C379;"> hard</span><span style="color:#98C379;"> nofile</span><span style="color:#D19A66;"> 100000</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#98C379;"> soft</span><span style="color:#98C379;"> nproc</span><span style="color:#D19A66;"> 65535</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#98C379;"> hard</span><span style="color:#98C379;"> nproc</span><span style="color:#D19A66;"> 65535</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-5-监控就绪检查" tabindex="-1"><a class="header-anchor" href="#_10-5-监控就绪检查"><span>10.5 监控就绪检查</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/nginx-pre-flight.sh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境部署前检查脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">PASS</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"><span style="color:#E06C75;">FAIL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> desc</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> cmd</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> expected</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$3</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">    result</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#56B6C2;">eval</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">cmd</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;CHECK_FAILED&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">result</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">expected</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ] || [ </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">expected</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;nonempty&quot;</span><span style="color:#56B6C2;"> -a</span><span style="color:#56B6C2;"> -n</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">result</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;[PASS] \${</span><span style="color:#E06C75;">desc</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        PASS</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$((</span><span style="color:#61AFEF;">PASS</span><span style="color:#98C379;"> +</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;[FAIL] \${</span><span style="color:#E06C75;">desc</span><span style="color:#98C379;">} (expected: \${</span><span style="color:#E06C75;">expected</span><span style="color:#98C379;">}, got: \${</span><span style="color:#E06C75;">result</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        FAIL</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$((</span><span style="color:#61AFEF;">FAIL</span><span style="color:#98C379;"> +</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=========================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  Nginx 生产环境部署前检查&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=========================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 配置检查</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 配置检查 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;Nginx 配置语法&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;nginx -t 2&gt;&amp;1 | grep -c &#39;syntax is ok&#39;&quot;</span><span style="color:#98C379;"> &quot;1&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;版本号已隐藏&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;grep -c &#39;server_tokens off&#39; /etc/nginx/nginx.conf&quot;</span><span style="color:#98C379;"> &quot;1&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 端口检查</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 端口检查 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;HTTP 端口监听&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;ss -tlnp | grep -c &#39;:80 &#39;&quot;</span><span style="color:#98C379;"> &quot;nonempty&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;HTTPS 端口监听&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;ss -tlnp | grep -c &#39;:443 &#39;&quot;</span><span style="color:#98C379;"> &quot;nonempty&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. SSL 检查</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- SSL 检查 ---&quot;</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> cert</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> /etc/nginx/ssl/*.crt</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">cert</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">        expiry</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">openssl</span><span style="color:#98C379;"> x509</span><span style="color:#D19A66;"> -enddate</span><span style="color:#D19A66;"> -noout</span><span style="color:#D19A66;"> -in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">cert</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">cut</span><span style="color:#D19A66;"> -d=</span><span style="color:#D19A66;"> -f2</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        check</span><span style="color:#98C379;"> &quot;证书有效期: $(</span><span style="color:#61AFEF;">basename</span><span style="color:#98C379;"> \${</span><span style="color:#E06C75;">cert</span><span style="color:#98C379;">})&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">            &quot;date -d </span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">\${</span><span style="color:#E06C75;">expiry</span><span style="color:#98C379;">}</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;"> +%s 2&gt;/dev/null &amp;&amp; echo ok || echo fail&quot;</span><span style="color:#98C379;"> &quot;nonempty&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 上游检查</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 上游健康检查 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;默认上游健康&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;curl -s -o /dev/null -w &#39;%{http_code}&#39; http://127.0.0.1/healthz&quot;</span><span style="color:#98C379;"> &quot;200&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 安全检查</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 安全检查 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;隐藏文件禁止访问&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        &quot;curl -s -o /dev/null -w &#39;%{http_code}&#39; http://127.0.0.1/.git&quot;</span><span style="color:#98C379;"> &quot;403&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;安全头 X-Frame-Options&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;curl -sI http://127.0.0.1/ | grep -c &#39;X-Frame-Options&#39;&quot;</span><span style="color:#98C379;"> &quot;1&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;安全头 X-Content-Type-Options&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;curl -sI http://127.0.0.1/ | grep -c &#39;X-Content-Type-Options&#39;&quot;</span><span style="color:#98C379;"> &quot;1&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 性能检查</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 性能检查 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;Worker 进程数&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;ps aux | grep &#39;worker process&#39; | grep -vc grep&quot;</span><span style="color:#98C379;"> &quot;$(</span><span style="color:#61AFEF;">nproc</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;文件描述符限制&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;cat /proc/</span><span style="color:#56B6C2;">\\$</span><span style="color:#98C379;">(cat /var/run/nginx.pid)/limits 2&gt;/dev/null | grep &#39;open files&#39; | awk &#39;{print </span><span style="color:#56B6C2;">\\$</span><span style="color:#98C379;">4}&#39;&quot;</span><span style="color:#98C379;"> &quot;100000&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 7. 日志检查</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 日志检查 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;错误日志可写&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;touch /var/log/nginx/.write_test &amp;&amp; rm /var/log/nginx/.write_test &amp;&amp; echo ok || echo fail&quot;</span><span style="color:#98C379;"> &quot;ok&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;访问日志格式包含 rt&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    &quot;grep -c &#39;request_time&#39; /etc/nginx/nginx.conf&quot;</span><span style="color:#98C379;"> &quot;1&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=========================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  检查结果: \${</span><span style="color:#E06C75;">PASS</span><span style="color:#98C379;">} 通过, \${</span><span style="color:#E06C75;">FAIL</span><span style="color:#98C379;">} 失败&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=========================================&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ \${</span><span style="color:#E06C75;">FAIL</span><span style="color:#ABB2BF;">} </span><span style="color:#56B6C2;">-gt</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;请修复失败项后再部署到生产环境&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;所有检查通过，可以部署&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_11-参考资源" tabindex="-1"><a class="header-anchor" href="#_11-参考资源"><span>11 参考资源</span></a></h2><ul><li><a href="https://nginx.org/en/docs/ngx_core_module.html" target="_blank" rel="noopener noreferrer">Nginx 官方文档 - 核心功能</a></li><li><a href="https://nginx.org/en/docs/control.html" target="_blank" rel="noopener noreferrer">Nginx 官方文档 - 控制信号</a></li><li><a href="https://nginx.org/en/docs/events.html" target="_blank" rel="noopener noreferrer">Nginx 官方文档 - 事件模块</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html" target="_blank" rel="noopener noreferrer">Nginx 官方文档 - HTTP 代理模块</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html" target="_blank" rel="noopener noreferrer">Nginx 官方文档 - upstream 模块</a></li><li><a href="https://nginx.org/en/docs/http/server_names.html" target="_blank" rel="noopener noreferrer">Nginx 官方文档 - 服务器名称</a></li><li><a href="https://www.keepalived.org/manpage.html" target="_blank" rel="noopener noreferrer">Keepalived 官方文档</a></li><li><a href="https://docs.ansible.com/ansible/latest/collections/ansible/builtin/index.html" target="_blank" rel="noopener noreferrer">Ansible 官方文档</a></li></ul>`,51)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};