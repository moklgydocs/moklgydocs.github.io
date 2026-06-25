import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-BVtXrkU4.js";import{t as r}from"./app-DvxCNKUe.js";var i=JSON.parse(`{"path":"/%E8%BF%90%E7%BB%B4%E4%B8%8E%E9%83%A8%E7%BD%B2/Linux%E5%9F%BA%E7%A1%80/03.systemd%E6%9C%8D%E5%8A%A1%E7%AE%A1%E7%90%86.html","title":"systemd 服务管理","lang":"zh-CN","frontmatter":{"title":"systemd 服务管理","date":"2025-04-14T00:00:00.000Z","category":["Linux基础"],"tag":["Linux","systemd","服务管理",".NET部署"],"order":3},"git":{"createdTime":1776135420000,"updatedTime":1776135420000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":2.76,"words":829},"filePathRelative":"运维与部署/Linux基础/03.systemd服务管理.md"}`),a={name:`03.systemd服务管理.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="systemd-服务管理" tabindex="-1"><a class="header-anchor" href="#systemd-服务管理"><span>systemd 服务管理</span></a></h1><p>不用 Docker 的时候，.NET 应用怎么在服务器上「像服务一样」跑起来？答案是 systemd。开机自启、崩溃自动重启、日志统一管理，全靠它。</p><hr><h2 id="核心命令" tabindex="-1"><a class="header-anchor" href="#核心命令"><span>核心命令</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 启动/停止/重启</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> stop</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看状态（最常用）</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 会显示：运行状态、PID、最近几行日志、内存占用</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 开机自启</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#98C379;"> erp-api</span><span style="color:#7F848E;font-style:italic;">     # 开启</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> disable</span><span style="color:#98C379;"> erp-api</span><span style="color:#7F848E;font-style:italic;">    # 关闭</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> is-enabled</span><span style="color:#98C379;"> erp-api</span><span style="color:#7F848E;font-style:italic;"> # 查看</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重新加载配置（改了 .service 文件后）</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> daemon-reload</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看所有运行中的服务</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> list-units</span><span style="color:#D19A66;"> --type=service</span><span style="color:#D19A66;"> --state=running</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="把-net-应用注册为服务" tabindex="-1"><a class="header-anchor" href="#把-net-应用注册为服务"><span>把 .NET 应用注册为服务</span></a></h2><h3 id="创建-service-文件" tabindex="-1"><a class="header-anchor" href="#创建-service-文件"><span>创建 service 文件</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> vim</span><span style="color:#98C379;"> /etc/systemd/system/erp-api.service</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language-ini line-numbers-mode" data-highlighter="shiki" data-ext="ini" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-ini"><span class="line"><span style="color:#61AFEF;">[Unit]</span></span>
<span class="line"><span style="color:#C678DD;">Description</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">ERP API Service</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 等网络就绪后再启动</span></span>
<span class="line"><span style="color:#C678DD;">After</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">network.target</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[Service]</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 服务类型：notify 表示应用会通知 systemd 已就绪</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 普通 .NET 应用用 simple 就行</span></span>
<span class="line"><span style="color:#C678DD;">Type</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">simple</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 运行用户（不要用 root）</span></span>
<span class="line"><span style="color:#C678DD;">User</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">deploy</span></span>
<span class="line"><span style="color:#C678DD;">Group</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">deploy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 工作目录</span></span>
<span class="line"><span style="color:#C678DD;">WorkingDirectory</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/opt/apps/erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动命令</span></span>
<span class="line"><span style="color:#C678DD;">ExecStart</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/usr/bin/dotnet /opt/apps/erp-api/ERP.Host.dll</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 环境变量</span></span>
<span class="line"><span style="color:#C678DD;">Environment</span><span style="color:#ABB2BF;">=</span><span style="color:#C678DD;">ASPNETCORE_ENVIRONMENT</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">Production</span></span>
<span class="line"><span style="color:#C678DD;">Environment</span><span style="color:#ABB2BF;">=</span><span style="color:#C678DD;">ASPNETCORE_URLS</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">http://0.0.0.0:5000</span></span>
<span class="line"><span style="color:#C678DD;">Environment</span><span style="color:#ABB2BF;">=</span><span style="color:#C678DD;">DOTNET_ROOT</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/usr/share/dotnet</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 崩溃自动重启</span></span>
<span class="line"><span style="color:#C678DD;">Restart</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">always</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重启间隔（秒）</span></span>
<span class="line"><span style="color:#C678DD;">RestartSec</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">5</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 日志输出到 journald</span></span>
<span class="line"><span style="color:#C678DD;">StandardOutput</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">journal</span></span>
<span class="line"><span style="color:#C678DD;">StandardError</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">journal</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 日志标识（方便 journalctl 过滤）</span></span>
<span class="line"><span style="color:#C678DD;">SyslogIdentifier</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 资源限制（可选）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># LimitNOFILE=65536</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># MemoryMax=1G</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 超时设置</span></span>
<span class="line"><span style="color:#C678DD;">TimeoutStartSec</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">30</span></span>
<span class="line"><span style="color:#C678DD;">TimeoutStopSec</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优雅关闭：先发 SIGTERM，超时后发 SIGKILL</span></span>
<span class="line"><span style="color:#C678DD;">KillMode</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">mixed</span></span>
<span class="line"><span style="color:#C678DD;">KillSignal</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">SIGTERM</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[Install]</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在多用户模式下自启</span></span>
<span class="line"><span style="color:#C678DD;">WantedBy</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">multi-user.target</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="启用服务" tabindex="-1"><a class="header-anchor" href="#启用服务"><span>启用服务</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 重载配置</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> daemon-reload</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看状态</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 开机自启</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#98C379;"> erp-api</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="用-journalctl-看日志" tabindex="-1"><a class="header-anchor" href="#用-journalctl-看日志"><span>用 journalctl 看日志</span></a></h2><p>systemd 服务的日志都走 journald，用 journalctl 查看。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 看某个服务的日志</span></span>
<span class="line"><span style="color:#61AFEF;">journalctl</span><span style="color:#D19A66;"> -u</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 实时追踪（等价于 tail -f）</span></span>
<span class="line"><span style="color:#61AFEF;">journalctl</span><span style="color:#D19A66;"> -u</span><span style="color:#98C379;"> erp-api</span><span style="color:#D19A66;"> -f</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 最近 100 行</span></span>
<span class="line"><span style="color:#61AFEF;">journalctl</span><span style="color:#D19A66;"> -u</span><span style="color:#98C379;"> erp-api</span><span style="color:#D19A66;"> -n</span><span style="color:#D19A66;"> 100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 今天的日志</span></span>
<span class="line"><span style="color:#61AFEF;">journalctl</span><span style="color:#D19A66;"> -u</span><span style="color:#98C379;"> erp-api</span><span style="color:#D19A66;"> --since</span><span style="color:#98C379;"> today</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 某个时间段</span></span>
<span class="line"><span style="color:#61AFEF;">journalctl</span><span style="color:#D19A66;"> -u</span><span style="color:#98C379;"> erp-api</span><span style="color:#D19A66;"> --since</span><span style="color:#98C379;"> &quot;2024-04-14 10:00&quot;</span><span style="color:#D19A66;"> --until</span><span style="color:#98C379;"> &quot;2024-04-14 12:00&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 只看错误</span></span>
<span class="line"><span style="color:#61AFEF;">journalctl</span><span style="color:#D19A66;"> -u</span><span style="color:#98C379;"> erp-api</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> err</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看磁盘上日志占了多少空间</span></span>
<span class="line"><span style="color:#61AFEF;">journalctl</span><span style="color:#D19A66;"> --disk-usage</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 清理旧日志（只保留最近7天）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> journalctl</span><span style="color:#D19A66;"> --vacuum-time=7d</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="多应用管理" tabindex="-1"><a class="header-anchor" href="#多应用管理"><span>多应用管理</span></a></h2><p>一台服务器跑多个 .NET 应用时，注意命名规范：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">/etc/systemd/system/</span></span>
<span class="line"><span style="color:#61AFEF;">├──</span><span style="color:#98C379;"> erp-api.service</span></span>
<span class="line"><span style="color:#61AFEF;">├──</span><span style="color:#98C379;"> sso-server.service</span></span>
<span class="line"><span style="color:#61AFEF;">└──</span><span style="color:#98C379;"> auth-center.service</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 批量操作</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> erp-api</span><span style="color:#98C379;"> sso-server</span><span style="color:#98C379;"> auth-center</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> erp-api</span><span style="color:#98C379;"> sso-server</span><span style="color:#98C379;"> auth-center</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="部署脚本-配合-systemd" tabindex="-1"><a class="header-anchor" href="#部署脚本-配合-systemd"><span>部署脚本（配合 systemd）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># deploy-erp.sh - 部署 ERP API</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">APP_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;erp-api&quot;</span></span>
<span class="line"><span style="color:#E06C75;">APP_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/opt/apps/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">PUBLISH_FILE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$PUBLISH_FILE</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;用法: ./deploy-erp.sh publish.tar.gz&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 停止服务&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> stop</span><span style="color:#E06C75;"> $APP_NAME</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 备份当前版本&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">cp</span><span style="color:#D19A66;"> -r</span><span style="color:#E06C75;"> $APP_DIR</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_DIR</span><span style="color:#98C379;">}.bak.$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d%H%M%S)&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 部署新版本&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">tar</span><span style="color:#D19A66;"> -xzf</span><span style="color:#E06C75;"> $PUBLISH_FILE</span><span style="color:#D19A66;"> -C</span><span style="color:#E06C75;"> $APP_DIR</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 修复权限&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">chown</span><span style="color:#D19A66;"> -R</span><span style="color:#98C379;"> deploy:deploy</span><span style="color:#E06C75;"> $APP_DIR</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 启动服务&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> start</span><span style="color:#E06C75;"> $APP_NAME</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 等待 3 秒检查状态&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">sleep</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> status</span><span style="color:#E06C75;"> $APP_NAME</span><span style="color:#D19A66;"> --no-pager</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; 部署完成&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="排错" tabindex="-1"><a class="header-anchor" href="#排错"><span>排错</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>服务启不来？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 1: systemctl status erp-api -l  → 看状态和最近日志</span></span>
<span class="line"><span>Step 2: journalctl -u erp-api -n 50  → 看详细日志</span></span>
<span class="line"><span>Step 3: 手动跑试试 → sudo -u deploy dotnet /opt/apps/erp-api/ERP.Host.dll</span></span>
<span class="line"><span>  → 如果手动能跑、服务跑不了 → 通常是路径/权限/环境变量问题</span></span>
<span class="line"><span></span></span>
<span class="line"><span>常见原因：</span></span>
<span class="line"><span>  ❌ WorkingDirectory 路径不对</span></span>
<span class="line"><span>  ❌ User 没有文件读取权限</span></span>
<span class="line"><span>  ❌ 没装 .NET Runtime（或 PATH 不对）</span></span>
<span class="line"><span>  ❌ 端口被占用（netstat -tlnp | grep 5000）</span></span>
<span class="line"><span>  ❌ appsettings.json 里数据库连不上</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,25)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};