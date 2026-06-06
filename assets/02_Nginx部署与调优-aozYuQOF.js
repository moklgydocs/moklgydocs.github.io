import{A as e,E as t,d as n,l as r,p as i,s as a}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as o}from"./app-B7SOiXO-.js";var s=JSON.parse(`{"path":"/Linux/05_%E7%94%9F%E4%BA%A7%E7%BA%A7%E5%AE%9E%E6%88%98/02_Nginx%E9%83%A8%E7%BD%B2%E4%B8%8E%E8%B0%83%E4%BC%98.html","title":"Nginx 部署与调优","lang":"zh-CN","frontmatter":{"title":"Nginx 部署与调优","icon":"fa6-solid:bolt","order":2,"category":["Linux","生产级实战"],"tag":["Nginx","反向代理","负载均衡","HTTPS","性能调优"]},"git":{"createdTime":1780586585000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":17.32,"words":5195},"filePathRelative":"Linux/05_生产级实战/02_Nginx部署与调优.md"}`),c={name:`02_Nginx部署与调优.md`};function l(o,s,c,l,u,d){let f=e(`Mermaid`);return t(),r(`div`,null,[s[0]||=a(`h1`,{id:`nginx-部署与调优`,tabindex:`-1`},[a(`a`,{class:`header-anchor`,href:`#nginx-部署与调优`},[a(`span`,null,`Nginx 部署与调优`)])],-1),s[1]||=a(`blockquote`,null,[a(`p`,null,`Nginx 是互联网的"交通警察"——全球超过 34% 的网站由它负责路由、加速和保护。掌握 Nginx 的部署与调优，是运维工程师的必修课。`)],-1),s[2]||=a(`h2`,{id:`nginx-请求处理总览`,tabindex:`-1`},[a(`a`,{class:`header-anchor`,href:`#nginx-请求处理总览`},[a(`span`,null,`Nginx 请求处理总览`)])],-1),s[3]||=a(`p`,null,`理解 Nginx 的请求处理流程，是所有配置和调优的基础：`,-1),i(f,{code:`eJxtkW1LIlEUx9/7KS7ta5GF3WVblpbSfKg0YRd6cZHFppmKLGNmoiIDC7JsKpUsCEmoiIxKK0qp6eHLdB/8Fl3PncKg++re+zvn/M/5Hy2RnFXG4rqJ/vlcSJxuTKqHdK3Bzmq81qBXyzHkdnehHhwZHZ+aQ+G4Yao64s8lVrFikNEDAV48lNQn3hGKK4o6bYpXmW4dy0AvBPoWZF12ZZOy9WfRBczXYqnm/h5NL9Hd1Re7nkK9uIOVbkQ6r9kktyu/fw/rni5DnRrRxhMqapbq1Grwm/0OKdELEn7Mn4ukVCbbm+S+GGtXILlNki+82Ecsn0mhAG6ms9Q6RTPThqmr8UlZJQBVgpjY9+zMIvmtlhltgwSBhzB/PCe5gmMTkBCQPixCabEuM9+6aPE+4P2YPWyTzLWH3i6Rh5zT7JvtH/tdrwhHSGaFVO9gdL9YgDcQYhfZFBrA0WDU7Y+GkQfNDP0NhKTIAIiEMc2e8IMNoc2KlWba5k8FycPAI5+Z5Ac0iHn1kjzuwBIN438iOSoz+yWGe8S5w8Mw58U2upFYSuLXF/Wr9l1T28CgA5Sf6g+lsw34HKBpWqfyzfUKkr0S/g==`}),s[4]||=n(`<h2 id="一、nginx-安装" tabindex="-1"><a class="header-anchor" href="#一、nginx-安装"><span>一、Nginx 安装</span></a></h2><h3 id="_1-1-包管理器安装-推荐大多数场景" tabindex="-1"><a class="header-anchor" href="#_1-1-包管理器安装-推荐大多数场景"><span>1.1 包管理器安装（推荐大多数场景）</span></a></h3><p><strong>Ubuntu/Debian</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装最新稳定版</span></span>
<span class="line"><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> update</span></span>
<span class="line"><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -v</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx version: nginx/1.24.0 (Ubuntu)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证运行状态</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -I</span><span style="color:#98C379;"> http://localhost</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>CentOS/Rocky/AlmaLinux</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 添加官方仓库（获取最新版本）</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/yum.repos.d/nginx.repo</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">[nginx-stable]</span></span>
<span class="line"><span style="color:#98C379;">name=nginx stable repo</span></span>
<span class="line"><span style="color:#98C379;">baseurl=http://nginx.org/packages/centos/$releasever/$basearch/</span></span>
<span class="line"><span style="color:#98C379;">gpgcheck=1</span></span>
<span class="line"><span style="color:#98C379;">enabled=1</span></span>
<span class="line"><span style="color:#98C379;">gpgkey=https://nginx.org/keys/nginx_signing.key</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装</span></span>
<span class="line"><span style="color:#61AFEF;">dnf</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> nginx</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-源码编译安装-需要自定义模块时" tabindex="-1"><a class="header-anchor" href="#_1-2-源码编译安装-需要自定义模块时"><span>1.2 源码编译安装（需要自定义模块时）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装编译依赖</span></span>
<span class="line"><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> build-essential</span><span style="color:#98C379;"> libpcre3-dev</span><span style="color:#98C379;"> zlib1g-dev</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    libssl-dev</span><span style="color:#98C379;"> libgd-dev</span><span style="color:#98C379;"> libgeoip-dev</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 下载源码</span></span>
<span class="line"><span style="color:#E06C75;">NGINX_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1.26.2</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -O</span><span style="color:#98C379;"> https://nginx.org/download/nginx-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">NGINX_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">.tar.gz</span></span>
<span class="line"><span style="color:#61AFEF;">tar</span><span style="color:#98C379;"> xzf</span><span style="color:#98C379;"> nginx-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">NGINX_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">.tar.gz</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> nginx-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">NGINX_VERSION</span><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置编译选项</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --prefix=/etc/nginx</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --sbin-path=/usr/sbin/nginx</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --modules-path=/usr/lib64/nginx/modules</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --conf-path=/etc/nginx/nginx.conf</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --error-log-path=/var/log/nginx/error.log</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --http-log-path=/var/log/nginx/access.log</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --pid-path=/var/run/nginx.pid</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --lock-path=/var/run/nginx.lock</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --user=nginx</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --group=nginx</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-http_ssl_module</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-http_v2_module</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-http_v3_module</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-http_realip_module</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-http_gzip_static_module</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-http_stub_status_module</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-stream</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-stream_ssl_module</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-compat</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 编译安装</span></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#D19A66;"> -j$(</span><span style="color:#61AFEF;">nproc</span><span style="color:#D19A66;">)</span></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#98C379;"> install</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建 systemd 服务文件</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/systemd/system/nginx.service</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">[Unit]</span></span>
<span class="line"><span style="color:#98C379;">Description=nginx - high performance web server</span></span>
<span class="line"><span style="color:#98C379;">After=network-online.target remote-fs.target nss-lookup.target</span></span>
<span class="line"><span style="color:#98C379;">Wants=network-online.target</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">[Service]</span></span>
<span class="line"><span style="color:#98C379;">Type=forking</span></span>
<span class="line"><span style="color:#98C379;">PIDFile=/var/run/nginx.pid</span></span>
<span class="line"><span style="color:#98C379;">ExecStartPre=/usr/sbin/nginx -t -c /etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#98C379;">ExecStart=/usr/sbin/nginx -c /etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#98C379;">ExecReload=/bin/kill -s HUP $MAINPID</span></span>
<span class="line"><span style="color:#98C379;">ExecStop=/bin/kill -s TERM $MAINPID</span></span>
<span class="line"><span style="color:#98C379;">LimitNOFILE=1048576</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">[Install]</span></span>
<span class="line"><span style="color:#98C379;">WantedBy=multi-user.target</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> daemon-reload</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> nginx</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">何时需要源码编译？</p><ul><li>需要 HTTP/3（QUIC）支持时</li><li>需要第三方模块（如 Brotli、GeoIP2）</li><li>需要特定的 OpenSSL 版本</li><li>其他情况，包管理器安装更易维护</li></ul></div><h3 id="_1-3-验证安装" tabindex="-1"><a class="header-anchor" href="#_1-3-验证安装"><span>1.3 验证安装</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 版本与编译参数</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -V</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置语法检查</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -t</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看监听端口</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认欢迎页</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#98C379;"> http://localhost</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、核心配置详解" tabindex="-1"><a class="header-anchor" href="#二、核心配置详解"><span>二、核心配置详解</span></a></h2><h3 id="_2-1-配置文件结构" tabindex="-1"><a class="header-anchor" href="#_2-1-配置文件结构"><span>2.1 配置文件结构</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">/etc/nginx/</span></span>
<span class="line"><span style="color:#61AFEF;">├──</span><span style="color:#98C379;"> nginx.conf</span><span style="color:#7F848E;font-style:italic;">              # 主配置文件</span></span>
<span class="line"><span style="color:#61AFEF;">├──</span><span style="color:#98C379;"> conf.d/</span><span style="color:#7F848E;font-style:italic;">                 # 自定义配置（推荐在此添加）</span></span>
<span class="line"><span style="color:#61AFEF;">│</span><span style="color:#98C379;">   ├──</span><span style="color:#98C379;"> app1.conf</span></span>
<span class="line"><span style="color:#61AFEF;">│</span><span style="color:#98C379;">   └──</span><span style="color:#98C379;"> app2.conf</span></span>
<span class="line"><span style="color:#61AFEF;">├──</span><span style="color:#98C379;"> sites-available/</span><span style="color:#7F848E;font-style:italic;">        # 可用站点（Ubuntu 风格）</span></span>
<span class="line"><span style="color:#61AFEF;">│</span><span style="color:#98C379;">   └──</span><span style="color:#98C379;"> default</span></span>
<span class="line"><span style="color:#61AFEF;">├──</span><span style="color:#98C379;"> sites-enabled/</span><span style="color:#7F848E;font-style:italic;">          # 已启用站点（符号链接）</span></span>
<span class="line"><span style="color:#61AFEF;">│</span><span style="color:#98C379;">   └──</span><span style="color:#98C379;"> default</span><span style="color:#ABB2BF;"> -&gt; </span><span style="color:#98C379;">/etc/nginx/sites-available/default</span></span>
<span class="line"><span style="color:#61AFEF;">├──</span><span style="color:#98C379;"> snippets/</span><span style="color:#7F848E;font-style:italic;">               # 配置片段</span></span>
<span class="line"><span style="color:#61AFEF;">│</span><span style="color:#98C379;">   ├──</span><span style="color:#98C379;"> ssl-params.conf</span></span>
<span class="line"><span style="color:#61AFEF;">│</span><span style="color:#98C379;">   └──</span><span style="color:#98C379;"> proxy-params.conf</span></span>
<span class="line"><span style="color:#61AFEF;">└──</span><span style="color:#98C379;"> modules-enabled/</span><span style="color:#7F848E;font-style:italic;">        # 动态模块</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-主配置文件" tabindex="-1"><a class="header-anchor" href="#_2-2-主配置文件"><span>2.2 主配置文件</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/nginx.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 运行用户 =====</span></span>
<span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;">nginx;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== Worker 进程 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># auto = CPU 核心数</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误日志</span></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># PID 文件</span></span>
<span class="line"><span style="color:#C678DD;">pid </span><span style="color:#ABB2BF;">/var/run/nginx.pid;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Worker 进程的文件描述符上限</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">1048576</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 事件模块 =====</span></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 每个 worker 的最大并发连接数</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 多个 worker 间均衡接受新连接</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Linux 专用高效事件模型</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== HTTP 模块 =====</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 基础配置</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">      mime.types;</span></span>
<span class="line"><span style="color:#C678DD;">    default_type </span><span style="color:#ABB2BF;"> application/octet-stream;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 日志格式</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#D19A66;">main</span><span style="color:#98C379;"> &#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">upstream_addr</span><span style="color:#98C379;">&quot; rt=$</span><span style="color:#E06C75;">request_time</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 性能优化</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">       on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">     on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">    on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;"> 65</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    types_hash_max_size </span><span style="color:#D19A66;">2048</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 隐藏版本号</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Gzip 压缩</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_vary </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_proxied </span><span style="color:#ABB2BF;">any;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_comp_level </span><span style="color:#D19A66;">4</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_min_length </span><span style="color:#D19A66;">256</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_types</span></span>
<span class="line"><span style="color:#ABB2BF;">        application/json</span></span>
<span class="line"><span style="color:#ABB2BF;">        application/javascript</span></span>
<span class="line"><span style="color:#ABB2BF;">        text/css</span></span>
<span class="line"><span style="color:#ABB2BF;">        text/plain</span></span>
<span class="line"><span style="color:#ABB2BF;">        text/xml;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 包含其他配置</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/conf.d/*.conf;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/sites-enabled/*;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-关键参数解读" tabindex="-1"><a class="header-anchor" href="#_2-3-关键参数解读"><span>2.3 关键参数解读</span></a></h3>`,17),i(f,{code:`eJxLy8kvT85ILCpR8AniUgACx+gX67c/29j0Yv/sp61LYxV0de0UnKLD84uyU4sUgILPV3THghU6gaWcq8vBUvHJ+Xl5qcklmfl5xbVgeWewvEv0i/3znvUtfbZxAUSbC1jYtfrpkpbnE9ogdkE0uIJl3KKfTu59umvKi/1Tns6eF8sFliouTUovSizIUHi6c9vT/okvmvc+7Zr9Yt3C5+umg+VBwD362ZyGp0uWQ5Qo2CpAHVZQlJ+cWlycWqxweDpMDMmxEFel5qVAbSqpzElVcFdIy8zJsVJONUwzTUvlAgBKl3bz`}),s[5]||=n(`<table><thead><tr><th>参数</th><th>默认值</th><th>生产建议</th><th>说明</th></tr></thead><tbody><tr><td><code>worker_processes</code></td><td>1</td><td><code>auto</code></td><td>匹配 CPU 核心数</td></tr><tr><td><code>worker_connections</code></td><td>512</td><td>4096-65535</td><td>单个 worker 并发连接数</td></tr><tr><td><code>worker_rlimit_nofile</code></td><td>系统默认</td><td>1048576</td><td>worker 进程文件描述符上限</td></tr><tr><td><code>multi_accept</code></td><td>off</td><td>on</td><td>一次接受所有新连接</td></tr><tr><td><code>sendfile</code></td><td>off</td><td>on</td><td>零拷贝传输文件</td></tr><tr><td><code>tcp_nopush</code></td><td>off</td><td>on</td><td>优化数据包发送</td></tr><tr><td><code>keepalive_timeout</code></td><td>75</td><td>65</td><td>长连接超时时间</td></tr><tr><td><code>server_tokens</code></td><td>on</td><td>off</td><td>隐藏版本号</td></tr></tbody></table><div class="hint-container important"><p class="hint-container-title">并发连接数计算</p><p>Nginx 的最大并发连接数 = <code>worker_processes</code> × <code>worker_connections</code>。</p><p>如果作为反向代理，每个请求占用两个连接（客户端→Nginx，Nginx→后端），所以实际并发数要除以 2。例如 <code>4 × 4096 = 16384</code>，作为反向代理最大并发约 8192。</p></div><h2 id="三、server-块与-location-匹配" tabindex="-1"><a class="header-anchor" href="#三、server-块与-location-匹配"><span>三、Server 块与 Location 匹配</span></a></h2><h3 id="_3-1-server-块配置" tabindex="-1"><a class="header-anchor" href="#_3-1-server-块配置"><span>3.1 Server 块配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># HTTP → HTTPS 重定向</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Let&#39;s Encrypt 验证</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /.well-known/acme-challenge/ {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/certbot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 其余请求重定向到 HTTPS</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 301</span><span style="color:#ABB2BF;"> https://$</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTPS 主站</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SSL 证书</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">    /etc/letsencrypt/live/example.com/fullchain.pem;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/letsencrypt/live/example.com/privkey.pem;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SSL 参数</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">snippets/ssl-params.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 文档根目录</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/example.com;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html index.htm;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 日志</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/example.com.access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    error_log </span><span style="color:#ABB2BF;"> /var/log/nginx/example.com.error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 默认 location</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ </span><span style="color:#D19A66;">=404</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 静态资源缓存</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, immutable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 安全头</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-XSS-Protection </span><span style="color:#98C379;">&quot;1; mode=block&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Referrer-Policy </span><span style="color:#98C379;">&quot;strict-origin-when-cross-origin&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-location-匹配规则" tabindex="-1"><a class="header-anchor" href="#_3-2-location-匹配规则"><span>3.2 Location 匹配规则</span></a></h3><p>Location 的匹配优先级是 Nginx 配置中最容易搞错的部分：</p>`,7),i(f,{code:`eJx1kN1KAkEcxe99ij/TXSDdRGSUkd/eRl0tBrnsUrAQmBCxq1hoKCh6Y2kIpZVC+VUEmVi+zM5M+xbpzKgL0VwNnPM758yo2smZfHQYi8OezwGTsyP99D7I6yXs74Yj4HS6waPTt29a7+L8p5UpbCeYzTOVDFLpGeCV0BbgXIGOUpvR2Iqb1FLWS8UcVXAmS4ctFLEBuNQ0wKcjbueJc6g8FhUo4WCMj/X79YOkyBfl/kV5QEJTdRGEL2qk0yCdB5ytklKNvjfEAA6xAUEdcYPo4wvyucmdfnWt+hAPi7MNQY4xowEhCSWBZK9hGfBjC/eL+KpKykWSvmMZtN02Bylz8Mz99DbNe8QEnmUOCrO4sITEw//8x829Oe5aT33abk5ohp/GzzUFvKAea9rGkryurMkumxD4TwgJQVVVl7xqE8JzQYkqiuMXV3/o1g==`}),s[6]||=n(`<p><strong>优先级从高到低：</strong></p><table><thead><tr><th>修饰符</th><th>说明</th><th>示例</th></tr></thead><tbody><tr><td><code>=</code></td><td>精确匹配，最高优先级</td><td><code>location = /exact/path</code></td></tr><tr><td><code>^~</code></td><td>前缀匹配，匹配后不再检查正则</td><td><code>location ^~ /static/</code></td></tr><tr><td><code>~</code></td><td>区分大小写的正则</td><td><code>location ~ \\.php$</code></td></tr><tr><td><code>~*</code></td><td>不区分大小写的正则</td><td>\`location ~* .(jpg</td></tr><tr><td>无</td><td>普通前缀匹配</td><td><code>location /api/</code></td></tr></tbody></table><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Location 匹配示例</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 精确匹配 - 处理 /health 端点</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/health </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &#39;OK&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Content-Type text/plain;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 优先前缀匹配 - 静态文件不走正则</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/static/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    alias </span><span style="color:#ABB2BF;">/var/www/static/;</span></span>
<span class="line"><span style="color:#C678DD;">    expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 正则匹配 - PHP 文件交给 FastCGI</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">\\.php$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    fastcgi_pass </span><span style="color:#ABB2BF;">unix:/run/php/php-fpm.sock;</span></span>
<span class="line"><span style="color:#C678DD;">    fastcgi_param </span><span style="color:#ABB2BF;">SCRIPT_FILENAME $</span><span style="color:#E06C75;">document_root</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">fastcgi_script_name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">fastcgi_params;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 不区分大小写正则 - 图片文件</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(jpg|jpeg|png|gif|ico|svg|webp)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    expires </span><span style="color:#D19A66;">7d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 前缀匹配 - API 反向代理</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://backend/;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">Location 匹配陷阱</p><ol><li><strong>多个正则 location 时，第一个匹配的生效</strong>——不是最长的，而是配置文件中从上到下最先匹配的</li><li><strong><code>proxy_pass</code> 末尾的 <code>/</code></strong>：<code>location /api/</code> + <code>proxy_pass http://backend/</code> 会去掉 <code>/api/</code> 前缀；<code>proxy_pass http://backend</code> 则保留</li><li><strong><code>alias</code> vs <code>root</code></strong>：<code>alias</code> 替换 location 路径，<code>root</code> 追加 location 路径</li></ol></div><h2 id="四、https-配置" tabindex="-1"><a class="header-anchor" href="#四、https-配置"><span>四、HTTPS 配置</span></a></h2><h3 id="_4-1-let-s-encrypt-certbot" tabindex="-1"><a class="header-anchor" href="#_4-1-let-s-encrypt-certbot"><span>4.1 Let&#39;s Encrypt + Certbot</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 Certbot</span></span>
<span class="line"><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> certbot</span><span style="color:#98C379;"> python3-certbot-nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取证书（自动修改 nginx 配置）</span></span>
<span class="line"><span style="color:#61AFEF;">certbot</span><span style="color:#D19A66;"> --nginx</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> example.com</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> www.example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或者仅获取证书（手动配置 nginx）</span></span>
<span class="line"><span style="color:#61AFEF;">certbot</span><span style="color:#98C379;"> certonly</span><span style="color:#D19A66;"> --webroot</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -w</span><span style="color:#98C379;"> /var/www/certbot</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -d</span><span style="color:#98C379;"> example.com</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -d</span><span style="color:#98C379;"> www.example.com</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --email</span><span style="color:#98C379;"> admin@example.com</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --agree-tos</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --non-interactive</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 证书文件位置</span></span>
<span class="line"><span style="color:#61AFEF;">ls</span><span style="color:#98C379;"> /etc/letsencrypt/live/example.com/</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># cert.pem       - 服务器证书</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># chain.pem      - 中间证书</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># fullchain.pem  - 完整证书链（nginx 使用这个）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># privkey.pem    - 私钥</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 自动续期（Certbot 已自动配置定时任务）</span></span>
<span class="line"><span style="color:#61AFEF;">certbot</span><span style="color:#98C379;"> renew</span><span style="color:#D19A66;"> --dry-run</span><span style="color:#7F848E;font-style:italic;">    # 测试续期</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看定时任务</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> list-timers</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> certbot</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-ssl-tls-安全配置" tabindex="-1"><a class="header-anchor" href="#_4-2-ssl-tls-安全配置"><span>4.2 SSL/TLS 安全配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/snippets/ssl-params.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SSL 安全参数 - 遵循 Mozilla Intermediate 指南</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 协议版本</span></span>
<span class="line"><span style="color:#C678DD;">ssl_protocols </span><span style="color:#ABB2BF;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 加密套件</span></span>
<span class="line"><span style="color:#C678DD;">ssl_ciphers </span><span style="color:#ABB2BF;">ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优先使用服务器端加密套件</span></span>
<span class="line"><span style="color:#C678DD;">ssl_prefer_server_ciphers </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SSL 会话缓存（减少重复握手）</span></span>
<span class="line"><span style="color:#C678DD;">ssl_session_cache </span><span style="color:#ABB2BF;">shared:SSL:10m;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_session_timeout </span><span style="color:#D19A66;">1d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 会话票据（减少全握手开销）</span></span>
<span class="line"><span style="color:#C678DD;">ssl_session_tickets </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># OCSP Stapling（客户端不需要单独查询 OCSP）</span></span>
<span class="line"><span style="color:#C678DD;">ssl_stapling </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">ssl_stapling_verify </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">resolver </span><span style="color:#D19A66;">8.8.8.8</span><span style="color:#D19A66;"> 8.8.4.4</span><span style="color:#ABB2BF;"> valid=300s;</span></span>
<span class="line"><span style="color:#C678DD;">resolver_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DH 参数（增强密钥交换安全性）</span></span>
<span class="line"><span style="color:#C678DD;">ssl_dhparam </span><span style="color:#ABB2BF;">/etc/nginx/dhparam.pem;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HSTS（强制浏览器使用 HTTPS）</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">Strict-Transport-Security </span><span style="color:#98C379;">&quot;max-age=63072000; includeSubDomains; preload&quot;</span><span style="color:#ABB2BF;"> always;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 生成 DH 参数（2048位，约需几分钟）</span></span>
<span class="line"><span style="color:#61AFEF;">openssl</span><span style="color:#98C379;"> dhparam</span><span style="color:#D19A66;"> -out</span><span style="color:#98C379;"> /etc/nginx/dhparam.pem</span><span style="color:#D19A66;"> 2048</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证 SSL 配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在线工具: https://www.ssllabs.com/ssltest/</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -I</span><span style="color:#98C379;"> https://example.com</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">TLS 1.3 的优势</p><p>TLS 1.3 将握手从 2-RTT 减少到 1-RTT，支持 0-RTT 恢复。加密套件大幅简化，移除了所有不安全的算法。开启 TLS 1.3 后，SSL Labs 评分会有明显提升。</p></div><h2 id="五、反向代理与负载均衡" tabindex="-1"><a class="header-anchor" href="#五、反向代理与负载均衡"><span>五、反向代理与负载均衡</span></a></h2><h3 id="_5-1-反向代理基础配置" tabindex="-1"><a class="header-anchor" href="#_5-1-反向代理基础配置"><span>5.1 反向代理基础配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 反向代理 - 将请求转发到后端应用</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://127.0.0.1:8080;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 传递客户端真实信息</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # WebSocket 支持</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Upgrade $</span><span style="color:#E06C75;">http_upgrade</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;upgrade&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 超时配置</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_send_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_read_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 缓冲配置</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_buffering </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_buffer_size </span><span style="color:#D19A66;">4k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_buffers </span><span style="color:#D19A66;">8</span><span style="color:#D19A66;"> 4k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_busy_buffers_size </span><span style="color:#D19A66;">8k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-负载均衡架构" tabindex="-1"><a class="header-anchor" href="#_5-2-负载均衡架构"><span>5.2 负载均衡架构</span></a></h3>`,15),i(f,{code:`eJx9kE1LAkEAhu/+isHOkhqFSQj5rUGnboOH3I8Sll3YDAsNbKksD6GQkVKYXyGFWhC4SftvmtnZf9E2O4c9hHN6h+fhnZcRJaXEHe6rRbAX9wD7bEM07ePrufk2ywGfLwKicPegIJ8A8tklhoGeaqTXQ+1xjtpRqsTKbmhO7s3W6Izy2B+vqMqxzPtUJV+QKyAOUePWbg+EQ/6Q36n5R0swLbhcSzJtjWnUi9NVqTI6H6HFHA+quMv2JBxCc5JleknRajwZIF2vgDR0EhpemI0rMpvjD82Z4HjoW6NeBnrxc41M33/0BeCVkryVV1cj6ObOag+JMSWzvpdNytDHspDUXlF9jJsPtoFbl1bnkdQ1U/ty2rPU2oGoWSeTF6vaMbsjVnBUPJUE+7/FgiSFV4SAuC4KLpBhQBQ5ng+6QJoBLiRscJueXyKLyAg=`}),s[7]||=n(`<h3 id="_5-3-upstream-配置" tabindex="-1"><a class="header-anchor" href="#_5-3-upstream-配置"><span>5.3 Upstream 配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 定义后端服务器组</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 负载均衡策略（默认 round-robin）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 加权轮询（weight 越大，分配的请求越多）</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.101:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    server 192.168.1.102:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    server 192.168.1.103:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 备用服务器（仅在所有主服务器不可用时启用）</span></span>
<span class="line"><span style="color:#ABB2BF;">    server 192.168.1.104:8080 backup;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 保持与后端的长连接（减少 TCP 握手）</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive </span><span style="color:#D19A66;">32</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 慢启动（逐渐增加新服务器流量）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # server 192.168.1.105:8080 slow_start=30s;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># IP Hash（会话保持，同一 IP 始终路由到同一后端）</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend_iphash {</span></span>
<span class="line"><span style="color:#C678DD;">    ip_hash</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.101:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.102:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Least Connections（最少连接数优先）</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend_least_conn {</span></span>
<span class="line"><span style="color:#C678DD;">    least_conn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.101:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.102:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 一致性 Hash（适合缓存场景）</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend_hash {</span></span>
<span class="line"><span style="color:#C678DD;">    hash </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;"> consistent;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.101:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.102:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-健康检查" tabindex="-1"><a class="header-anchor" href="#_5-4-健康检查"><span>5.4 健康检查</span></a></h3><p><strong>被动健康检查（Nginx 开源版）</strong></p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.101:8080 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.102:8080 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.103:8080 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># max_fails: 在 fail_timeout 时间内失败次数达到此值，标记为不可用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># fail_timeout: 服务器被标记为不可用的持续时间</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>主动健康检查（Nginx Plus 或开源替代）</strong></p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 nginx_upstream_check_module（需源码编译补丁）</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.101:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.102:8080;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    check</span><span style="color:#ABB2BF;"> interval=3000 rise=2 fall=3 timeout=1000 type=http;</span></span>
<span class="line"><span style="color:#C678DD;">    check_http_send</span><span style="color:#98C379;"> &quot;HEAD /health HTTP/1.0\\r</span><span style="color:#56B6C2;">\\n</span><span style="color:#98C379;">\\r</span><span style="color:#56B6C2;">\\n</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    check_http_expect_alive</span><span style="color:#ABB2BF;"> http_2xx http_3xx;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>应用层健康检查端点</strong></p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 在后端应用上暴露 /health 端点</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 通过代理路径访问</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">lb.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 负载均衡器状态页</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /nginx_status {</span></span>
<span class="line"><span style="color:#C678DD;">        stub_status</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-5-负载均衡策略对比" tabindex="-1"><a class="header-anchor" href="#_5-5-负载均衡策略对比"><span>5.5 负载均衡策略对比</span></a></h3><table><thead><tr><th>策略</th><th>模块</th><th>适用场景</th><th>特点</th></tr></thead><tbody><tr><td>Round Robin</td><td>默认</td><td>后端性能一致</td><td>均匀分配</td></tr><tr><td>Weighted</td><td>默认</td><td>后端性能不均</td><td>按权重分配</td></tr><tr><td>IP Hash</td><td><code>ip_hash</code></td><td>需要会话保持</td><td>同 IP 同后端</td></tr><tr><td>Least Conn</td><td><code>least_conn</code></td><td>长连接/请求耗时不均</td><td>优先分配给最空闲的</td></tr><tr><td>Hash</td><td><code>hash</code></td><td>缓存命中优化</td><td>同 key 同后端</td></tr><tr><td>Random</td><td><code>random</code></td><td>简单场景</td><td>随机分配</td></tr></tbody></table><div class="hint-container tip"><p class="hint-container-title">会话保持的替代方案</p><p><code>ip_hash</code> 简单但不精确（NAT 后多用户共享 IP）。更好的方案是：应用层使用 Redis 存储 Session，Nginx 侧不需要会话保持，任何后端都能处理任何用户的请求。</p></div><h2 id="六、静态文件与缓存策略" tabindex="-1"><a class="header-anchor" href="#六、静态文件与缓存策略"><span>六、静态文件与缓存策略</span></a></h2><h3 id="_6-1-静态文件服务" tabindex="-1"><a class="header-anchor" href="#_6-1-静态文件服务"><span>6.1 静态文件服务</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">static.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/static;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 静态文件缓存</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(jpg|jpeg|png|gif|ico|svg|webp)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, immutable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Vary </span><span style="color:#98C379;">&quot;Accept-Encoding&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 静态文件不打访问日志</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(css|js)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">7d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(woff|woff2|ttf|otf|eot)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">180d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, immutable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Access-Control-Allow-Origin </span><span style="color:#98C379;">&quot;*&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 禁止访问隐藏文件</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">/\\. </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        log_not_found </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 禁止访问源文件</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">\\.(bak|swp|old|orig|log|sql)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-代理缓存" tabindex="-1"><a class="header-anchor" href="#_6-2-代理缓存"><span>6.2 代理缓存</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># http 块中的缓存配置</span></span>
<span class="line"><span style="color:#C678DD;">proxy_cache_path </span><span style="color:#ABB2BF;">/var/cache/nginx/proxy</span></span>
<span class="line"><span style="color:#ABB2BF;">    levels=1:2</span></span>
<span class="line"><span style="color:#ABB2BF;">    keys_zone=api_cache:10m</span></span>
<span class="line"><span style="color:#ABB2BF;">    max_size=10g</span></span>
<span class="line"><span style="color:#ABB2BF;">    inactive=60m</span></span>
<span class="line"><span style="color:#ABB2BF;">    use_temp_path=off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/data/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_cache </span><span style="color:#ABB2BF;">api_cache;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 缓存键</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_cache_key </span><span style="color:#98C379;">&quot;$</span><span style="color:#E06C75;">scheme</span><span style="color:#98C379;">$</span><span style="color:#E06C75;">request_method</span><span style="color:#98C379;">$</span><span style="color:#E06C75;">host</span><span style="color:#98C379;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 缓存有效时间</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_cache_valid </span><span style="color:#D19A66;">200</span><span style="color:#D19A66;"> 10m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_cache_valid </span><span style="color:#D19A66;">404</span><span style="color:#D19A66;"> 1m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_cache_valid </span><span style="color:#ABB2BF;">any </span><span style="color:#D19A66;">1m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 缓存状态头（调试用）</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-Cache-Status $</span><span style="color:#E06C75;">upstream_cache_status</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 缓存锁（防止缓存击穿）</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_cache_lock </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_cache_lock_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 陈旧缓存（后端故障时使用过期缓存）</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_cache_use_stale </span><span style="color:#D19A66;">error</span><span style="color:#ABB2BF;"> timeout updating http_500 http_502 http_503;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 手动清除缓存</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /purge/ {</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_cache_purge </span><span style="color:#ABB2BF;">api_cache </span><span style="color:#98C379;">&quot;$</span><span style="color:#E06C75;">scheme</span><span style="color:#98C379;">$</span><span style="color:#E06C75;">request_method</span><span style="color:#98C379;">$</span><span style="color:#E06C75;">host</span><span style="color:#98C379;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">缓存策略选择</p><ul><li><strong>浏览器缓存</strong>（<code>expires</code>/<code>Cache-Control</code>）：客户端缓存，减少请求</li><li><strong>代理缓存</strong>（<code>proxy_cache</code>）：Nginx 端缓存，减少后端压力</li><li><strong>不缓存</strong>：个性化内容、实时数据、POST 请求</li><li><strong>短缓存</strong>：频繁变化的数据（1-5 分钟）</li><li><strong>长缓存</strong>：静态资源、API 版本化响应（7-30 天 + immutable）</li></ul></div><h2 id="七、gzip-压缩" tabindex="-1"><a class="header-anchor" href="#七、gzip-压缩"><span>七、Gzip 压缩</span></a></h2><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># http 块中配置</span></span>
<span class="line"><span style="color:#C678DD;">gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">gzip_vary </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;                    </span><span style="color:#7F848E;font-style:italic;"># 添加 Vary: Accept-Encoding 头</span></span>
<span class="line"><span style="color:#C678DD;">gzip_proxied </span><span style="color:#ABB2BF;">any;                </span><span style="color:#7F848E;font-style:italic;"># 对代理请求也压缩</span></span>
<span class="line"><span style="color:#C678DD;">gzip_comp_level </span><span style="color:#D19A66;">4</span><span style="color:#ABB2BF;">;               </span><span style="color:#7F848E;font-style:italic;"># 压缩级别（1-9，4 是性价比最高）</span></span>
<span class="line"><span style="color:#C678DD;">gzip_min_length </span><span style="color:#D19A66;">256</span><span style="color:#ABB2BF;">;             </span><span style="color:#7F848E;font-style:italic;"># 小于 256 字节不压缩</span></span>
<span class="line"><span style="color:#C678DD;">gzip_buffers </span><span style="color:#D19A66;">16</span><span style="color:#D19A66;"> 8k</span><span style="color:#ABB2BF;">;              </span><span style="color:#7F848E;font-style:italic;"># 压缩缓冲区</span></span>
<span class="line"><span style="color:#C678DD;">gzip_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;           </span><span style="color:#7F848E;font-style:italic;"># 最低 HTTP 版本</span></span>
<span class="line"><span style="color:#C678DD;">gzip_types</span></span>
<span class="line"><span style="color:#ABB2BF;">    application/atom+xml</span></span>
<span class="line"><span style="color:#ABB2BF;">    application/geo+json</span></span>
<span class="line"><span style="color:#ABB2BF;">    application/javascript</span></span>
<span class="line"><span style="color:#ABB2BF;">    application/x-javascript</span></span>
<span class="line"><span style="color:#ABB2BF;">    application/json</span></span>
<span class="line"><span style="color:#ABB2BF;">    application/ld+json</span></span>
<span class="line"><span style="color:#ABB2BF;">    application/manifest+json</span></span>
<span class="line"><span style="color:#ABB2BF;">    application/rdf+xml</span></span>
<span class="line"><span style="color:#ABB2BF;">    application/rss+xml</span></span>
<span class="line"><span style="color:#ABB2BF;">    application/xhtml+xml</span></span>
<span class="line"><span style="color:#ABB2BF;">    application/xml</span></span>
<span class="line"><span style="color:#ABB2BF;">    font/eot</span></span>
<span class="line"><span style="color:#ABB2BF;">    font/otf</span></span>
<span class="line"><span style="color:#ABB2BF;">    font/ttf</span></span>
<span class="line"><span style="color:#ABB2BF;">    font/woff</span></span>
<span class="line"><span style="color:#ABB2BF;">    image/svg+xml</span></span>
<span class="line"><span style="color:#ABB2BF;">    text/css</span></span>
<span class="line"><span style="color:#ABB2BF;">    text/javascript</span></span>
<span class="line"><span style="color:#ABB2BF;">    text/plain</span></span>
<span class="line"><span style="color:#ABB2BF;">    text/xml;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">Gzip 注意事项</p><ol><li><strong>不要压缩图片</strong>——JPEG/PNG 等已经是压缩格式，二次压缩反而增大体积</li><li><strong>不要压缩视频</strong>——同上</li><li><strong><code>gzip_comp_level</code> 不是越高越好</strong>——级别 4-5 是 CPU 和压缩率的最佳平衡点，9 级 CPU 开销大但收益微乎其微</li><li><strong>对小文件压缩无意义</strong>——小于 256 字节的文件压缩后可能更大</li></ol></div><h3 id="_7-1-brotli-压缩-更先进的替代方案" tabindex="-1"><a class="header-anchor" href="#_7-1-brotli-压缩-更先进的替代方案"><span>7.1 Brotli 压缩（更先进的替代方案）</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 需要安装 ngx_brotli 模块</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 编译时添加: --add-module=/path/to/ngx_brotli</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">brotli</span><span style="color:#D19A66;"> on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">brotli_comp_level</span><span style="color:#D19A66;"> 6</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">brotli_types</span></span>
<span class="line"><span style="color:#D19A66;">    application/javascript</span></span>
<span class="line"><span style="color:#ABB2BF;">    application/json</span></span>
<span class="line"><span style="color:#ABB2BF;">    application/xml</span></span>
<span class="line"><span style="color:#ABB2BF;">    text/css</span></span>
<span class="line"><span style="color:#ABB2BF;">    text/javascript</span></span>
<span class="line"><span style="color:#ABB2BF;">    text/plain</span></span>
<span class="line"><span style="color:#ABB2BF;">    text/xml;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 同时支持 gzip 和 brotli</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 会根据客户端 Accept-Encoding 自动选择</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="八、安全头配置" tabindex="-1"><a class="header-anchor" href="#八、安全头配置"><span>八、安全头配置</span></a></h2><p>HTTP 安全头是防御 XSS、点击劫持、MIME 嗅探等攻击的重要防线：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/snippets/security-headers.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 防止点击劫持</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 防止 MIME 嗅探</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># XSS 过滤（旧浏览器兼容）</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">X-XSS-Protection </span><span style="color:#98C379;">&quot;1; mode=block&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 引用策略</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">Referrer-Policy </span><span style="color:#98C379;">&quot;strict-origin-when-cross-origin&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HSTS（必须先确认 HTTPS 完全可用再开启）</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">Strict-Transport-Security </span><span style="color:#98C379;">&quot;max-age=63072000; includeSubDomains; preload&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 权限策略（限制浏览器 API 使用）</span></span>
<span class="line"><span style="color:#C678DD;">add_header </span><span style="color:#ABB2BF;">Permissions-Policy </span><span style="color:#98C379;">&quot;camera=(), microphone=(), geolocation=()&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Content Security Policy（根据业务定制）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># add_header Content-Security-Policy &quot;default-src &#39;self&#39;; script-src &#39;self&#39; &#39;unsafe-inline&#39;; style-src &#39;self&#39; &#39;unsafe-inline&#39;;&quot; always;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title"><code>always</code> 关键字</p><p><code>add_header</code> 指令默认只在响应码为 200、201、204、206、301、302、303、304、307、308 时添加。加上 <code>always</code> 参数后，所有响应码（包括 4xx、5xx）都会添加安全头，防止错误页面泄露信息。</p></div><h2 id="九、性能优化" tabindex="-1"><a class="header-anchor" href="#九、性能优化"><span>九、性能优化</span></a></h2><h3 id="_9-1-网络层优化" tabindex="-1"><a class="header-anchor" href="#_9-1-网络层优化"><span>9.1 网络层优化</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># http 块</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 零拷贝传输（跳过用户空间缓冲）</span></span>
<span class="line"><span style="color:#C678DD;">sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配合 sendfile 使用，在包中积累足够数据再发送</span></span>
<span class="line"><span style="color:#C678DD;">tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 禁用 Nagle 算法，立即发送数据（降低延迟）</span></span>
<span class="line"><span style="color:#C678DD;">tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 长连接超时</span></span>
<span class="line"><span style="color:#C678DD;">keepalive_timeout </span><span style="color:#D19A66;">65</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 长连接请求数上限</span></span>
<span class="line"><span style="color:#C678DD;">keepalive_requests </span><span style="color:#D19A66;">100</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 减少 TIME_WAIT</span></span>
<span class="line"><span style="color:#C678DD;">reset_timedout_connection </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,30),i(f,{code:`eJxLy8kvT85ILCpR8AniUgACx+jnixufz57xbFr7k93bYhV0de1qnuxZ8Hz3fIWi1MQU/fKizJLUGgWn6Kdtrc8W7Hi+Z/LTtk1Pe3bFgnU7gdQrOEc/n7LiWcf25yt3vZy+BU2JM1iJC1T/06XTn/Utfbp2OpoqF7Aq1+jneyc+3z0nlgviNrBrilPzUtIyc4COcMPuCDewsueztwBNBjr9xb7JNQouEBOKSypzUoHmAPXnWCmnGqaZpqUiSbhCJZItUs2SLbkAPhV86g==`}),s[8]||=n(`<h3 id="_9-2-缓冲区优化" tabindex="-1"><a class="header-anchor" href="#_9-2-缓冲区优化"><span>9.2 缓冲区优化</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># http 块</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 请求体缓冲区</span></span>
<span class="line"><span style="color:#C678DD;">client_body_buffer_size </span><span style="color:#D19A66;">16k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">client_max_body_size </span><span style="color:#D19A66;">50m</span><span style="color:#ABB2BF;">;         </span><span style="color:#7F848E;font-style:italic;"># 最大上传大小</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 请求头缓冲区</span></span>
<span class="line"><span style="color:#C678DD;">client_header_buffer_size </span><span style="color:#D19A66;">1k</span><span style="color:#ABB2BF;">;      </span><span style="color:#7F848E;font-style:italic;"># 默认请求头缓冲</span></span>
<span class="line"><span style="color:#C678DD;">large_client_header_buffers </span><span style="color:#D19A66;">4</span><span style="color:#D19A66;"> 8k</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 大请求头缓冲</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 响应缓冲区（反向代理）</span></span>
<span class="line"><span style="color:#C678DD;">proxy_buffer_size </span><span style="color:#D19A66;">4k</span><span style="color:#ABB2BF;">;              </span><span style="color:#7F848E;font-style:italic;"># 响应头缓冲</span></span>
<span class="line"><span style="color:#C678DD;">proxy_buffers </span><span style="color:#D19A66;">8</span><span style="color:#D19A66;"> 4k</span><span style="color:#ABB2BF;">;                </span><span style="color:#7F848E;font-style:italic;"># 响应体缓冲</span></span>
<span class="line"><span style="color:#C678DD;">proxy_busy_buffers_size </span><span style="color:#D19A66;">8k</span><span style="color:#ABB2BF;">;        </span><span style="color:#7F848E;font-style:italic;"># 忙时缓冲</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-连接优化" tabindex="-1"><a class="header-anchor" href="#_9-3-连接优化"><span>9.3 连接优化</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 与后端保持长连接</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 127.0.0.1:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive </span><span style="color:#D19A66;">32</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 每个 worker 的空闲长连接数</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 必须配置 HTTP/1.1 + Connection 才能启用长连接</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 其他 proxy 配置...</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-4-静态文件预加载" tabindex="-1"><a class="header-anchor" href="#_9-4-静态文件预加载"><span>9.4 静态文件预加载</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 开启文件 AIO（异步 I/O）</span></span>
<span class="line"><span style="color:#C678DD;">aio </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 大文件直接传输，不经过 Nginx 缓冲</span></span>
<span class="line"><span style="color:#C678DD;">directio </span><span style="color:#D19A66;">5m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出过滤（最小化 HTML）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 需要模块: ngx_http_sub_module</span></span>
<span class="line"><span style="color:#C678DD;">sub_filter </span><span style="color:#98C379;">&#39;&lt;/head&gt;&#39;</span><span style="color:#98C379;"> &#39;&lt;link rel=&quot;preconnect&quot; href=&quot;https://cdn.example.com&quot;&gt;&lt;/head&gt;&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">sub_filter_once </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">sub_filter_types </span><span style="color:#ABB2BF;">text/html;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-5-open-file-cache" tabindex="-1"><a class="header-anchor" href="#_9-5-open-file-cache"><span>9.5 Open File Cache</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># http 块</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 打开文件缓存（减少磁盘 stat 和 open 调用）</span></span>
<span class="line"><span style="color:#C678DD;">open_file_cache </span><span style="color:#ABB2BF;">max=10000 inactive=30s;</span></span>
<span class="line"><span style="color:#C678DD;">open_file_cache_valid </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">open_file_cache_min_uses </span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">open_file_cache_errors </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-6-性能优化速查表" tabindex="-1"><a class="header-anchor" href="#_9-6-性能优化速查表"><span>9.6 性能优化速查表</span></a></h3><table><thead><tr><th>优化项</th><th>配置</th><th>效果</th></tr></thead><tbody><tr><td>零拷贝</td><td><code>sendfile on</code></td><td>减少内核-用户空间数据拷贝</td></tr><tr><td>批量发送</td><td><code>tcp_nopush on</code></td><td>减少小包数量</td></tr><tr><td>低延迟</td><td><code>tcp_nodelay on</code></td><td>立即发送，不等待</td></tr><tr><td>长连接</td><td><code>keepalive_timeout 65</code></td><td>减少连接建立开销</td></tr><tr><td>Gzip</td><td><code>gzip on</code></td><td>传输体积减少 60-80%</td></tr><tr><td>缓存</td><td><code>proxy_cache</code></td><td>减少后端请求</td></tr><tr><td>文件缓存</td><td><code>open_file_cache</code></td><td>减少磁盘 I/O</td></tr><tr><td>缓冲区</td><td><code>proxy_buffers</code></td><td>平滑后端慢响应</td></tr><tr><td>版本隐藏</td><td><code>server_tokens off</code></td><td>减少信息泄露</td></tr><tr><td>连接复用</td><td><code>upstream keepalive</code></td><td>减少与后端的 TCP 握手</td></tr></tbody></table><h2 id="十、日志配置与切割" tabindex="-1"><a class="header-anchor" href="#十、日志配置与切割"><span>十、日志配置与切割</span></a></h2><h3 id="_10-1-日志格式" tabindex="-1"><a class="header-anchor" href="#_10-1-日志格式"><span>10.1 日志格式</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># http 块中定义日志格式</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 标准格式</span></span>
<span class="line"><span style="color:#C678DD;">log_format </span><span style="color:#D19A66;">main</span><span style="color:#98C379;"> &#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                &#39;&quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot;&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 带上游响应时间的格式（反向代理必备）</span></span>
<span class="line"><span style="color:#C678DD;">log_format </span><span style="color:#ABB2BF;">detailed </span><span style="color:#98C379;">&#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;upstream=$</span><span style="color:#E06C75;">upstream_addr</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;upstream_status=$</span><span style="color:#E06C75;">upstream_status</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;upstream_time=$</span><span style="color:#E06C75;">upstream_response_time</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;request_time=$</span><span style="color:#E06C75;">request_time</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># JSON 格式（方便日志采集系统解析）</span></span>
<span class="line"><span style="color:#C678DD;">log_format </span><span style="color:#ABB2BF;">json_combined escape=json</span></span>
<span class="line"><span style="color:#98C379;">    &#39;{&#39;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&quot;time&quot;:&quot;$</span><span style="color:#E06C75;">time_iso8601</span><span style="color:#98C379;">&quot;,&#39;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&quot;remote_addr&quot;:&quot;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;">&quot;,&#39;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&quot;remote_user&quot;:&quot;$</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;">&quot;,&#39;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&quot;request&quot;:&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot;,&#39;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&quot;status&quot;:$</span><span style="color:#E06C75;">status</span><span style="color:#98C379;">,&#39;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&quot;body_bytes_sent&quot;:$</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;">,&#39;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&quot;request_time&quot;:$</span><span style="color:#E06C75;">request_time</span><span style="color:#98C379;">,&#39;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&quot;http_referer&quot;:&quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot;,&#39;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&quot;http_user_agent&quot;:&quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot;,&#39;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&quot;upstream_addr&quot;:&quot;$</span><span style="color:#E06C75;">upstream_addr</span><span style="color:#98C379;">&quot;,&#39;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&quot;upstream_status&quot;:&quot;$</span><span style="color:#E06C75;">upstream_status</span><span style="color:#98C379;">&quot;,&#39;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&quot;upstream_response_time&quot;:&quot;$</span><span style="color:#E06C75;">upstream_response_time</span><span style="color:#98C379;">&quot;&#39;</span></span>
<span class="line"><span style="color:#98C379;">    &#39;}&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用格式</span></span>
<span class="line"><span style="color:#C678DD;">access_log </span><span style="color:#ABB2BF;">/var/log/nginx/access.log detailed;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或 JSON 格式</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># access_log /var/log/nginx/access.json.log json_combined;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-条件日志" tabindex="-1"><a class="header-anchor" href="#_10-2-条件日志"><span>10.2 条件日志</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 不记录健康检查日志</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">request</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">loggable</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^/health </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">access_log </span><span style="color:#ABB2BF;">/var/log/nginx/access.log detailed if=$</span><span style="color:#E06C75;">loggable</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 不记录静态文件日志</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(css|js|png|jpg|jpeg|gif|ico|svg|woff2)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-日志切割" tabindex="-1"><a class="header-anchor" href="#_10-3-日志切割"><span>10.3 日志切割</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/logrotate.d/nginx</span></span>
<span class="line"><span style="color:#61AFEF;">/var/log/nginx/*.log</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    daily</span></span>
<span class="line"><span style="color:#61AFEF;">    missingok</span></span>
<span class="line"><span style="color:#61AFEF;">    rotate</span><span style="color:#D19A66;"> 30</span></span>
<span class="line"><span style="color:#61AFEF;">    compress</span></span>
<span class="line"><span style="color:#61AFEF;">    delaycompress</span></span>
<span class="line"><span style="color:#61AFEF;">    notifempty</span></span>
<span class="line"><span style="color:#61AFEF;">    create</span><span style="color:#D19A66;"> 0640</span><span style="color:#98C379;"> nginx</span><span style="color:#98C379;"> adm</span></span>
<span class="line"><span style="color:#61AFEF;">    sharedscripts</span></span>
<span class="line"><span style="color:#61AFEF;">    prerotate</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 切割前可以执行的操作</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#56B6C2;">-d</span><span style="color:#ABB2BF;"> /etc/logrotate.d/httpd-prerotate ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            run-parts</span><span style="color:#98C379;"> /etc/logrotate.d/httpd-prerotate</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#61AFEF;">    endscript</span></span>
<span class="line"><span style="color:#61AFEF;">    postrotate</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 通知 Nginx 重新打开日志文件</span></span>
<span class="line"><span style="color:#ABB2BF;">        [ </span><span style="color:#56B6C2;">-f</span><span style="color:#ABB2BF;"> /var/run/nginx.pid ] &amp;&amp; </span><span style="color:#56B6C2;">kill</span><span style="color:#D19A66;"> -USR1</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /var/run/nginx.pid</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">    endscript</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 手动触发日志切割</span></span>
<span class="line"><span style="color:#61AFEF;">logrotate</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> /etc/logrotate.d/nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查切割状态</span></span>
<span class="line"><span style="color:#61AFEF;">ls</span><span style="color:#D19A66;"> -la</span><span style="color:#98C379;"> /var/log/nginx/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-4-日志分析" tabindex="-1"><a class="header-anchor" href="#_10-4-日志分析"><span>10.4 日志分析</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Top 20 访问量最大的 IP</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $1}&#39;</span><span style="color:#98C379;"> /var/log/nginx/access.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Top 20 访问量最大的 URL</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $7}&#39;</span><span style="color:#98C379;"> /var/log/nginx/access.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 统计各状态码数量</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $9}&#39;</span><span style="color:#98C379;"> /var/log/nginx/access.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 找出响应时间最慢的 20 个请求</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $NF, $7}&#39;</span><span style="color:#98C379;"> /var/log/nginx/access.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 统计每秒请求数（QPS）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $4}&#39;</span><span style="color:#98C379;"> /var/log/nginx/access.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">cut</span><span style="color:#D19A66;"> -d:</span><span style="color:#D19A66;"> -f1-2</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 找出 5xx 错误</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;$9 &gt;= 500&#39;</span><span style="color:#98C379;"> /var/log/nginx/access.log</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 统计上游响应时间</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $NF}&#39;</span><span style="color:#98C379;"> /var/log/nginx/access.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    awk</span><span style="color:#98C379;"> &#39;{sum+=$1; count++} END {print &quot;avg:&quot;, sum/count, &quot;total:&quot;, count}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十一、nginx-完整生产配置模板" tabindex="-1"><a class="header-anchor" href="#十一、nginx-完整生产配置模板"><span>十一、Nginx 完整生产配置模板</span></a></h2><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/nginx.conf - 生产级完整配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;">nginx;</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">1048576</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">pid </span><span style="color:#ABB2BF;">/var/run/nginx.pid;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">      mime.types;</span></span>
<span class="line"><span style="color:#C678DD;">    default_type </span><span style="color:#ABB2BF;"> application/octet-stream;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 日志格式</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#ABB2BF;">detailed </span><span style="color:#98C379;">&#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;&quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;&quot;$</span><span style="color:#E06C75;">upstream_addr</span><span style="color:#98C379;">&quot; rt=$</span><span style="color:#E06C75;">request_time</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                        &#39;upstream_rt=$</span><span style="color:#E06C75;">upstream_response_time</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/access.log detailed;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 基础优化</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">       on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">     on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">    on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;"> 65</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    types_hash_max_size </span><span style="color:#D19A66;">2048</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 文件缓存</span></span>
<span class="line"><span style="color:#C678DD;">    open_file_cache </span><span style="color:#ABB2BF;">max=10000 inactive=30s;</span></span>
<span class="line"><span style="color:#C678DD;">    open_file_cache_valid </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    open_file_cache_min_uses </span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    open_file_cache_errors </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Gzip</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_vary </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_proxied </span><span style="color:#ABB2BF;">any;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_comp_level </span><span style="color:#D19A66;">4</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_min_length </span><span style="color:#D19A66;">256</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_types </span><span style="color:#ABB2BF;">application/json application/javascript</span></span>
<span class="line"><span style="color:#ABB2BF;">               text/css text/plain text/xml;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 代理缓冲</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_buffer_size </span><span style="color:#D19A66;">4k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_buffers </span><span style="color:#D19A66;">8</span><span style="color:#D19A66;"> 4k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_busy_buffers_size </span><span style="color:#D19A66;">8k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 安全头</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-XSS-Protection </span><span style="color:#98C379;">&quot;1; mode=block&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 包含站点配置</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/conf.d/*.conf;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/conf.d/example.com.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 后端服务器组</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> app_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.101:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> max_fails=3 </span><span style="color:#E06C75;font-style:italic;">fail_timeout</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    server 192.168.1.102:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;"> max_fails=3 </span><span style="color:#E06C75;font-style:italic;">fail_timeout</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    server 192.168.1.103:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;"> max_fails=3 </span><span style="color:#E06C75;font-style:italic;">fail_timeout</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    keepalive </span><span style="color:#D19A66;">32</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTP → HTTPS 重定向</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /.well-known/acme-challenge/ {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/certbot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 301</span><span style="color:#ABB2BF;"> https://$</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTPS 主站</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SSL</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">    /etc/letsencrypt/live/example.com/fullchain.pem;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/letsencrypt/live/example.com/privkey.pem;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">snippets/ssl-params.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 安全头</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Strict-Transport-Security </span><span style="color:#98C379;">&quot;max-age=63072000; includeSubDomains; preload&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # API 反向代理</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://app_backend/;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_send_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_read_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 静态文件</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /static/ {</span></span>
<span class="line"><span style="color:#C678DD;">        alias </span><span style="color:#ABB2BF;">/var/www/example.com/static/;</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, immutable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 前端 SPA</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/example.com/dist;</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ /index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 健康检查</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/health </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &#39;OK&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Content-Type text/plain;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Nginx 状态</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /nginx_status {</span></span>
<span class="line"><span style="color:#C678DD;">        stub_status</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十二、nginx-运维命令速查" tabindex="-1"><a class="header-anchor" href="#十二、nginx-运维命令速查"><span>十二、Nginx 运维命令速查</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 配置测试</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#7F848E;font-style:italic;">                       # 测试配置语法</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#7F848E;font-style:italic;">                       # 测试并输出完整配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重载配置（不中断服务）</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> reload</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启停</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> stop</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> nginx</span><span style="color:#7F848E;font-style:italic;">       # 重启（短暂中断）</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 版本信息</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -v</span><span style="color:#7F848E;font-style:italic;">                       # 版本</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -V</span><span style="color:#7F848E;font-style:italic;">                       # 版本 + 编译参数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 日志</span></span>
<span class="line"><span style="color:#61AFEF;">tail</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> /var/log/nginx/access.log</span></span>
<span class="line"><span style="color:#61AFEF;">tail</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> /var/log/nginx/error.log</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 连接状态</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nginx</span><span style="color:#7F848E;font-style:italic;">          # 监听端口</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tnp</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nginx</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#7F848E;font-style:italic;">   # 当前连接数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 实时监控</span></span>
<span class="line"><span style="color:#61AFEF;">watch</span><span style="color:#D19A66;"> -n</span><span style="color:#D19A66;"> 1</span><span style="color:#98C379;"> &#39;ss -tnp | grep nginx | wc -l&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">reload vs restart</p><ul><li><strong><code>nginx -s reload</code></strong>：启动新 Worker 处理新请求，旧 Worker 处理完当前请求后退出——<strong>零中断</strong></li><li><strong><code>systemctl restart nginx</code></strong>：先停止再启动——<strong>有短暂中断</strong></li></ul><p>修改配置后始终优先使用 <code>reload</code>。只有修改了 <code>worker_processes</code> 等需要重启的参数时才用 <code>restart</code>。</p></div><h2 id="参考资源" tabindex="-1"><a class="header-anchor" href="#参考资源"><span>参考资源</span></a></h2><ul><li><a href="https://nginx.org/en/docs/" target="_blank" rel="noopener noreferrer">Nginx 官方文档</a> - 最权威的参考</li><li><a href="https://ssl-config.mozilla.org/" target="_blank" rel="noopener noreferrer">Mozilla SSL Configuration Generator</a> - SSL 配置生成</li><li><a href="https://www.digitalocean.com/community/tools/nginx" target="_blank" rel="noopener noreferrer">DigitalOcean Nginx Config Tool</a> - 可视化配置生成</li><li><a href="https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/" target="_blank" rel="noopener noreferrer">Nginx Load Balancing</a> - 负载均衡指南</li><li><a href="https://www.ssllabs.com/ssltest/" target="_blank" rel="noopener noreferrer">SSL Labs Test</a> - HTTPS 安全性检测</li></ul>`,28)])}var u=o(c,[[`render`,l]]);export{s as _pageData,u as default};