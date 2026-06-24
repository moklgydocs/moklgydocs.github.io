import{A as e,E as t,d as n,l as r,p as i,s as a}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as o}from"./app-SUir7cUu.js";var s=JSON.parse(`{"path":"/Linux/05_%E7%94%9F%E4%BA%A7%E7%BA%A7%E5%AE%9E%E6%88%98/01_%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%88%9D%E5%A7%8B%E5%8C%96%E4%B8%8E%E5%8A%A0%E5%9B%BA.html","title":"服务器初始化与加固","lang":"zh-CN","frontmatter":{"title":"服务器初始化与加固","icon":"fa6-solid:shield-halved","order":1,"category":["Linux","生产级实战"],"tag":["服务器安全","SSH加固","防火墙","内核调优","Ansible"]},"git":{"createdTime":1780586585000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":25.85,"words":7756},"filePathRelative":"Linux/05_生产级实战/01_服务器初始化与加固.md"}`),c={name:`01_服务器初始化与加固.md`};function l(o,s,c,l,u,d){let f=e(`Mermaid`);return t(),r(`div`,null,[s[0]||=a(`h1`,{id:`服务器初始化与加固`,tabindex:`-1`},[a(`a`,{class:`header-anchor`,href:`#服务器初始化与加固`},[a(`span`,null,`服务器初始化与加固`)])],-1),s[1]||=a(`blockquote`,null,[a(`p`,null,`一台裸机从上架到可以承载生产流量，中间隔着一套严密的初始化与加固流程。省略任何一步，都可能成为日后安全事件的突破口。`)],-1),s[2]||=a(`h2`,{id:`服务器初始化-sop-总览`,tabindex:`-1`},[a(`a`,{class:`header-anchor`,href:`#服务器初始化-sop-总览`},[a(`span`,null,`服务器初始化 SOP 总览`)])],-1),s[3]||=a(`p`,null,`在深入每个环节之前，先看完整的服务器初始化标准操作流程：`,-1),i(f,{code:`eJxNkFFv0lAUx9/5FA0+LzcaNc6YmW1sgzGICb7d8ICllZlKTSkhREyKBlDcBpgNmOCYMhhxWhpdJinOfpnee9tvYbltlt6nk/s7v/85ObwgFthMSpKZp6EA47xVaA1nuK8DU28h9cT899HUz8x5N8ksLa0waxD3FaQ10F4bqR+sYSVJpTUK12GQXLfIvG9X9sm1+uiZBFbsL8dYKUeegIyYk7OplxwIxRNB11qnVsixDif4/R9zdpBIhFH9FPV06pJxWRJFGaBp1f40AuRiihpDkMunRS8gRAM2YNDu/iLlC/Tt2Dc5zxcAvytxhZQgpD1hgwqbMIg7V3bnEjX38M8R7WYzkpgtgqz8ymvdpK1bMIiqFXw6Q423+EiztHfm3y4VcsUcKwsAt2vm/Ao3GpahkR9jT96ichhate+oPnEuhSoT3LvEbc3lYcojiz1GyOj4tpacXEF8Dl6IeSmbulk8QoVt6EahgU50Aw8VPBi5fJvy6Gv3z1Y+W0bt8RuKogtUwt1pidmBRP+NKiPSa+GDc+fe7mCifiXNqhvkdqPmuMTEIOqd2IpiGio623dxzN2D1ju0jkNcP1pkHg5M/TwZoCgnFwWOWWX4XUF4eIu7zd/jOR+Ie4B9wN1nl30g6gGe55fZuz4QuwFsOn0n8B+QfSsw`}),s[4]||=n(`<div class="hint-container important"><p class="hint-container-title">核心原则</p><p><strong>最小权限原则</strong>贯穿整个初始化流程——只安装必要的软件包，只开放必要的端口，只授予必要的权限。每一项配置都应该是&quot;默认拒绝，按需放行&quot;。</p></div><h2 id="一、最小化安装原则" tabindex="-1"><a class="header-anchor" href="#一、最小化安装原则"><span>一、最小化安装原则</span></a></h2><h3 id="_1-1-为什么选择最小化安装" tabindex="-1"><a class="header-anchor" href="#_1-1-为什么选择最小化安装"><span>1.1 为什么选择最小化安装</span></a></h3><p>生产服务器不是桌面系统，每一个多余的软件包都是潜在的攻击面。最小化安装的核心逻辑：</p><ul><li><strong>减少攻击面</strong>：安装的软件越少，可被利用的漏洞越少</li><li><strong>降低维护成本</strong>：更少的包意味着更少的更新、更少的兼容性问题</li><li><strong>节约资源</strong>：磁盘空间、内存、CPU 周期不被无用服务占用</li><li><strong>缩短启动时间</strong>：更少的服务自启动，系统更快进入可用状态</li></ul><h3 id="_1-2-主流发行版的最小化安装" tabindex="-1"><a class="header-anchor" href="#_1-2-主流发行版的最小化安装"><span>1.2 主流发行版的最小化安装</span></a></h3><p><strong>Ubuntu Server（cloud-image / minimal）</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 cloud-image 启动，这是 AWS/GCP/Azure 上 Ubuntu 的默认方式</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 本地安装时选择 &quot;Minimal installation&quot; 选项</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装后检查已安装包的数量</span></span>
<span class="line"><span style="color:#61AFEF;">dpkg</span><span style="color:#D19A66;"> --get-selections</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 对比：完整安装约 1800+ 包，最小化安装约 400-600 包</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>CentOS / Rocky / AlmaLinux（Minimal ISO）</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 下载 Minimal ISO 而非 DVD ISO</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Rocky Linux: Rocky-x.x-x-minimal-x86_64.iso</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装后检查</span></span>
<span class="line"><span style="color:#61AFEF;">rpm</span><span style="color:#D19A66;"> -qa</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 最小化安装通常在 300-500 个包</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-安装后的包清理" tabindex="-1"><a class="header-anchor" href="#_1-3-安装后的包清理"><span>1.3 安装后的包清理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># cleanup_packages.sh - 最小化安装后的包清理脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -euo</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 清理不必要的软件包 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Ubuntu/Debian</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> apt</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 移除游戏、办公等非服务器软件</span></span>
<span class="line"><span style="color:#61AFEF;">    apt</span><span style="color:#98C379;"> remove</span><span style="color:#D19A66;"> -y</span><span style="color:#D19A66;"> --purge</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        nano</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        popularity-contest</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        ubuntu-advantage-tools</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">        2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 自动移除不再需要的依赖</span></span>
<span class="line"><span style="color:#61AFEF;">    apt</span><span style="color:#98C379;"> autoremove</span><span style="color:#D19A66;"> -y</span><span style="color:#D19A66;"> --purge</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 清理 apt 缓存</span></span>
<span class="line"><span style="color:#61AFEF;">    apt</span><span style="color:#98C379;"> clean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Ubuntu/Debian 清理完成&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CentOS/Rocky/AlmaLinux</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> dnf</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 移除非必要组件</span></span>
<span class="line"><span style="color:#61AFEF;">    dnf</span><span style="color:#98C379;"> remove</span><span style="color:#D19A66;"> -y</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        nano</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        postfix</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">        2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 自动移除孤立包</span></span>
<span class="line"><span style="color:#61AFEF;">    dnf</span><span style="color:#98C379;"> autoremove</span><span style="color:#D19A66;"> -y</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 清理 dnf 缓存</span></span>
<span class="line"><span style="color:#61AFEF;">    dnf</span><span style="color:#98C379;"> clean</span><span style="color:#98C379;"> all</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;RHEL系 清理完成&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 清理完毕 ===&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">注意</p><p>清理包时务必确认不会影响业务依赖。建议在移除前先用 <code>apt remove --dry-run</code> 或 <code>dnn remove --dry-run</code> 模拟操作，确认无误后再执行。</p></div><h3 id="_1-4-必装基础工具" tabindex="-1"><a class="header-anchor" href="#_1-4-必装基础工具"><span>1.4 必装基础工具</span></a></h3><p>最小化安装后，以下工具是运维的&quot;吃饭家伙&quot;，需要手动补装：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Ubuntu/Debian</span></span>
<span class="line"><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    curl</span><span style="color:#98C379;"> wget</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    vim</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    htop</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    net-tools</span><span style="color:#98C379;"> dnsutils</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    tmux</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    tree</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    jq</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    rsync</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    unzip</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    logrotate</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ca-certificates</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CentOS/Rocky/AlmaLinux</span></span>
<span class="line"><span style="color:#61AFEF;">dnf</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    curl</span><span style="color:#98C379;"> wget</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    vim-minimal</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    htop</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    net-tools</span><span style="color:#98C379;"> bind-utils</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    tmux</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    tree</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    jq</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    rsync</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    unzip</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    logrotate</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ca-certificates</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、网络配置" tabindex="-1"><a class="header-anchor" href="#二、网络配置"><span>二、网络配置</span></a></h2><h3 id="_2-1-配置静态-ip" tabindex="-1"><a class="header-anchor" href="#_2-1-配置静态-ip"><span>2.1 配置静态 IP</span></a></h3><p>生产服务器的 IP 地址不能靠 DHCP 随机分配——每次重启 IP 变了，上游的 DNS、负载均衡、防火墙规则全部失效。</p><p><strong>Ubuntu（Netplan）</strong></p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/netplan/01-static.yaml</span></span>
<span class="line"><span style="color:#E06C75;">network</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  version</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#E06C75;">  renderer</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networkd</span></span>
<span class="line"><span style="color:#E06C75;">  ethernets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    eth0</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      dhcp4</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">no</span></span>
<span class="line"><span style="color:#E06C75;">      addresses</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">192.168.1.100/24</span></span>
<span class="line"><span style="color:#E06C75;">      routes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">          via</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">192.168.1.1</span></span>
<span class="line"><span style="color:#E06C75;">      nameservers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        addresses</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#D19A66;">8.8.8.8</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#D19A66;">8.8.4.4</span></span>
<span class="line"><span style="color:#E06C75;">        search</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">internal.example.com</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 应用配置</span></span>
<span class="line"><span style="color:#61AFEF;">netplan</span><span style="color:#98C379;"> apply</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> show</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>CentOS/Rocky（nmcli / 配置文件）</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 nmcli 配置静态 IP</span></span>
<span class="line"><span style="color:#61AFEF;">nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> modify</span><span style="color:#98C379;"> eth0</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ipv4.method</span><span style="color:#98C379;"> manual</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ipv4.addresses</span><span style="color:#98C379;"> 192.168.1.100/24</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ipv4.gateway</span><span style="color:#D19A66;"> 192.168.1.1</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ipv4.dns</span><span style="color:#98C379;"> &quot;8.8.8.8 8.8.4.4&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> up</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或者直接编辑配置文件</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/sysconfig/network-scripts/ifcfg-eth0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-ini line-numbers-mode" data-highlighter="shiki" data-ext="ini" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-ini"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/sysconfig/network-scripts/ifcfg-eth0</span></span>
<span class="line"><span style="color:#C678DD;">TYPE</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">Ethernet</span></span>
<span class="line"><span style="color:#C678DD;">BOOTPROTO</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">static</span></span>
<span class="line"><span style="color:#C678DD;">NAME</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">eth0</span></span>
<span class="line"><span style="color:#C678DD;">DEVICE</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">eth0</span></span>
<span class="line"><span style="color:#C678DD;">ONBOOT</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">yes</span></span>
<span class="line"><span style="color:#C678DD;">IPADDR</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">192.168.1.100</span></span>
<span class="line"><span style="color:#C678DD;">PREFIX</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">24</span></span>
<span class="line"><span style="color:#C678DD;">GATEWAY</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">192.168.1.1</span></span>
<span class="line"><span style="color:#C678DD;">DNS1</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">8.8.8.8</span></span>
<span class="line"><span style="color:#C678DD;">DNS2</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">8.8.4.4</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-配置主机名" tabindex="-1"><a class="header-anchor" href="#_2-2-配置主机名"><span>2.2 配置主机名</span></a></h3><p>主机名是服务器在集群中的身份标识，在日志排查、证书验证、分布式协调中至关重要。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 设置主机名（立即生效 + 重启持久化）</span></span>
<span class="line"><span style="color:#61AFEF;">hostnamectl</span><span style="color:#98C379;"> set-hostname</span><span style="color:#98C379;"> web-prod-01</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证</span></span>
<span class="line"><span style="color:#61AFEF;">hostnamectl</span><span style="color:#98C379;"> status</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置 /etc/hosts（确保本机解析正确）</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">/etc/hosts</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">127.0.0.1   localhost</span></span>
<span class="line"><span style="color:#98C379;">192.168.1.100  web-prod-01.internal.example.com  web-prod-01</span></span>
<span class="line"><span style="color:#98C379;">192.168.1.101  web-prod-02.internal.example.com  web-prod-02</span></span>
<span class="line"><span style="color:#98C379;">192.168.1.200  db-master-01.internal.example.com db-master-01</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">主机名命名规范</p><p>推荐格式：<code>{角色}-{环境}-{编号}</code>，如 <code>web-prod-01</code>、<code>db-staging-02</code>、<code>cache-prod-03</code>。避免使用模糊名称如 <code>server1</code> 或 <code>test</code>。</p></div><h3 id="_2-3-dns-配置与验证" tabindex="-1"><a class="header-anchor" href="#_2-3-dns-配置与验证"><span>2.3 DNS 配置与验证</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 DNS 解析顺序</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nsswitch.conf 中的 hosts 行决定了解析顺序</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> ^hosts</span><span style="color:#98C379;"> /etc/nsswitch.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 典型输出: hosts: files dns</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/resolv.conf 配置</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/resolv.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">nameserver 8.8.8.8</span></span>
<span class="line"><span style="color:#98C379;">nameserver 8.8.4.4</span></span>
<span class="line"><span style="color:#98C379;">search internal.example.com example.com</span></span>
<span class="line"><span style="color:#98C379;">options timeout:2 attempts:3 rotate</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 防止 resolv.conf 被 DHCP 覆盖（Ubuntu + systemd-resolved）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法1: 使用 netplan 的 nameservers 字段</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法2: 禁用 systemd-resolved 的 DNS stub</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> disable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> systemd-resolved</span></span>
<span class="line"><span style="color:#61AFEF;">rm</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> /etc/resolv.conf</span><span style="color:#7F848E;font-style:italic;">  # 删除符号链接</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 然后手动写入 /etc/resolv.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DNS 验证</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> @8.8.8.8</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"><span style="color:#61AFEF;">nslookup</span><span style="color:#98C379;"> web-prod-01.internal.example.com</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-网络连通性验证脚本" tabindex="-1"><a class="header-anchor" href="#_2-4-网络连通性验证脚本"><span>2.4 网络连通性验证脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># network_check.sh - 网络配置验证脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -euo</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">PASS</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"><span style="color:#E06C75;">FAIL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> desc</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> cmd</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> eval</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$cmd</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  [PASS] </span><span style="color:#E06C75;">$desc</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">PASS</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  [FAIL] </span><span style="color:#E06C75;">$desc</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">FAIL</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 网络配置验证 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;默认网关可达&quot;</span><span style="color:#98C379;">    &quot;ping -c 1 -W 2 192.168.1.1&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;外网连通&quot;</span><span style="color:#98C379;">        &quot;ping -c 1 -W 2 8.8.8.8&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;DNS 解析&quot;</span><span style="color:#98C379;">        &quot;dig +short example.com | grep -q .&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;主机名正确&quot;</span><span style="color:#98C379;">      &quot;hostnamectl | grep web-prod-01&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> &quot;静态 IP 配置&quot;</span><span style="color:#98C379;">    &quot;ip addr show eth0 | grep 192.168.1.100&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;结果: </span><span style="color:#E06C75;">$PASS</span><span style="color:#98C379;"> 通过, </span><span style="color:#E06C75;">$FAIL</span><span style="color:#98C379;"> 失败&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、用户与-ssh-加固" tabindex="-1"><a class="header-anchor" href="#三、用户与-ssh-加固"><span>三、用户与 SSH 加固</span></a></h2><p>SSH 是 Linux 服务器最重要的远程管理通道，也是最常被暴力破解的入口。加固 SSH 是服务器安全的第一道防线。</p><h3 id="_3-1-创建管理用户" tabindex="-1"><a class="header-anchor" href="#_3-1-创建管理用户"><span>3.1 创建管理用户</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 创建管理员用户（禁止登录 shell 以外的所有方式）</span></span>
<span class="line"><span style="color:#61AFEF;">useradd</span><span style="color:#D19A66;"> -m</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> /bin/bash</span><span style="color:#D19A66;"> -G</span><span style="color:#98C379;"> sudo</span><span style="color:#98C379;"> deployadmin</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置强密码（作为密钥登录失败时的备用方式）</span></span>
<span class="line"><span style="color:#61AFEF;">passwd</span><span style="color:#98C379;"> deployadmin</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置 sudo 免密（仅限受控环境，生产建议需要密码）</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/sudoers.d/deployadmin</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">deployadmin ALL=(ALL) NOPASSWD: ALL</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#61AFEF;">chmod</span><span style="color:#D19A66;"> 440</span><span style="color:#98C379;"> /etc/sudoers.d/deployadmin</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证 sudo 权限</span></span>
<span class="line"><span style="color:#61AFEF;">su</span><span style="color:#98C379;"> -</span><span style="color:#98C379;"> deployadmin</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;sudo whoami&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 预期输出: root</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">sudo 最佳实践</p><ol><li><strong>生产环境不建议 NOPASSWD</strong>——sudo 密码是一次确认机制，防止误操作</li><li>使用 <code>/etc/sudoers.d/</code> 目录管理规则，不要直接修改 <code>/etc/sudoers</code></li><li>遵循最小权限：只授予必要的命令，而非 ALL</li><li>定期审计 sudo 使用记录：<code>/var/log/auth.log</code>（Ubuntu）或 <code>/var/log/secure</code>（CentOS）</li></ol></div><h3 id="_3-2-ssh-密钥认证配置" tabindex="-1"><a class="header-anchor" href="#_3-2-ssh-密钥认证配置"><span>3.2 SSH 密钥认证配置</span></a></h3>`,39),i(f,{code:`eJxlkMtKw0AUhvd5ilkqGItCF3bRTVy7yQPIkAxtEJOYpEJdiBFaQm1tqxGMllbFYPDS4EKKt/ZlnJnkLZykpYR2tv93/vOdMdFBBakS2lZgyYD7HGBPh4alSIoOVQsIAJoADx+IM6Iv4VIsJjHptXDjHnsBl+Y7moWAdogMIBQAdQfE6eCwHl/4OPxMAYEvFllkmmV+D1VLSAW8BZC8mc9vbM0BsQBw7ZVN/f3cReNLsJLgkqZXeUVeTSlxRtU9XPPBcW6dETlYscqaoRwheZd1m0tGa2yCet/49yoaPkahTT5sGpxlt0bhiLyfRpM+Offne5gubnfjEzu+aZPeF2l2iXOdPYa6AX2ymS59G+NOawFIaicuvu1P06w+G5zeGT83mc8CwJpnnuwTGwPuH8xBua4=`}),s[5]||=n(`<p><strong>客户端：生成密钥对</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 推荐使用 ed25519（更安全、更短、更快）</span></span>
<span class="line"><span style="color:#61AFEF;">ssh-keygen</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> ed25519</span><span style="color:#D19A66;"> -C</span><span style="color:#98C379;"> &quot;deployadmin@web-prod-01&quot;</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> ~/.ssh/web-prod-01</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果需要兼容老旧系统，使用 RSA（至少 4096 位）</span></span>
<span class="line"><span style="color:#61AFEF;">ssh-keygen</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> rsa</span><span style="color:#D19A66;"> -b</span><span style="color:#D19A66;"> 4096</span><span style="color:#D19A66;"> -C</span><span style="color:#98C379;"> &quot;deployadmin@web-prod-01&quot;</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> ~/.ssh/web-prod-01-rsa</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成后检查</span></span>
<span class="line"><span style="color:#61AFEF;">ls</span><span style="color:#D19A66;"> -la</span><span style="color:#98C379;"> ~/.ssh/</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -rw-------  web-prod-01      (私钥，必须 600)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -rw-r--r--  web-prod-01.pub  (公钥)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置 SSH 客户端</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">~/.ssh/config</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">Host web-prod-01</span></span>
<span class="line"><span style="color:#98C379;">    HostName 192.168.1.100</span></span>
<span class="line"><span style="color:#98C379;">    Port 2222</span></span>
<span class="line"><span style="color:#98C379;">    User deployadmin</span></span>
<span class="line"><span style="color:#98C379;">    IdentityFile ~/.ssh/web-prod-01</span></span>
<span class="line"><span style="color:#98C379;">    ServerAliveInterval 60</span></span>
<span class="line"><span style="color:#98C379;">    ServerAliveCountMax 3</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>服务器端：配置密钥</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 方法1：使用 ssh-copy-id（推荐）</span></span>
<span class="line"><span style="color:#61AFEF;">ssh-copy-id</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> ~/.ssh/web-prod-01.pub</span><span style="color:#D19A66;"> -p</span><span style="color:#D19A66;"> 22</span><span style="color:#98C379;"> deployadmin@192.168.1.100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法2：手动复制</span></span>
<span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /home/deployadmin/.ssh</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">/home/deployadmin/.ssh/authorized_keys</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">ssh-ed25519 AAAAC3NzaC1lZDI1NTE5... deployadmin@web-prod-01</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#61AFEF;">chown</span><span style="color:#D19A66;"> -R</span><span style="color:#98C379;"> deployadmin:deployadmin</span><span style="color:#98C379;"> /home/deployadmin/.ssh</span></span>
<span class="line"><span style="color:#61AFEF;">chmod</span><span style="color:#D19A66;"> 700</span><span style="color:#98C379;"> /home/deployadmin/.ssh</span></span>
<span class="line"><span style="color:#61AFEF;">chmod</span><span style="color:#D19A66;"> 600</span><span style="color:#98C379;"> /home/deployadmin/.ssh/authorized_keys</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-ssh-服务端加固" tabindex="-1"><a class="header-anchor" href="#_3-3-ssh-服务端加固"><span>3.3 SSH 服务端加固</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 备份原始配置</span></span>
<span class="line"><span style="color:#61AFEF;">cp</span><span style="color:#98C379;"> /etc/ssh/sshd_config</span><span style="color:#98C379;"> /etc/ssh/sshd_config.bak.</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d</span><span style="color:#ABB2BF;">)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/ssh/sshd_config - 生产级加固配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 监听配置 =====</span></span>
<span class="line"><span style="color:#61AFEF;">Port</span><span style="color:#D19A66;"> 2222</span><span style="color:#7F848E;font-style:italic;">                          # 修改默认端口（减少99%的扫描噪音）</span></span>
<span class="line"><span style="color:#61AFEF;">AddressFamily</span><span style="color:#98C379;"> inet</span><span style="color:#7F848E;font-style:italic;">                  # 仅 IPv4（如不需要 IPv6）</span></span>
<span class="line"><span style="color:#61AFEF;">ListenAddress</span><span style="color:#D19A66;"> 0.0.0.0</span><span style="color:#7F848E;font-style:italic;">              # 限制监听地址（可指定具体IP）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 认证配置 =====</span></span>
<span class="line"><span style="color:#61AFEF;">PermitRootLogin</span><span style="color:#98C379;"> no</span><span style="color:#7F848E;font-style:italic;">                  # 禁止 root 直接登录</span></span>
<span class="line"><span style="color:#61AFEF;">PubkeyAuthentication</span><span style="color:#98C379;"> yes</span><span style="color:#7F848E;font-style:italic;">            # 启用密钥认证</span></span>
<span class="line"><span style="color:#61AFEF;">AuthorizedKeysFile</span><span style="color:#98C379;"> .ssh/authorized_keys</span></span>
<span class="line"><span style="color:#61AFEF;">PasswordAuthentication</span><span style="color:#98C379;"> no</span><span style="color:#7F848E;font-style:italic;">           # 禁用密码认证（密钥登录后启用）</span></span>
<span class="line"><span style="color:#61AFEF;">PermitEmptyPasswords</span><span style="color:#98C379;"> no</span><span style="color:#7F848E;font-style:italic;">             # 禁止空密码</span></span>
<span class="line"><span style="color:#61AFEF;">ChallengeResponseAuthentication</span><span style="color:#98C379;"> no</span><span style="color:#7F848E;font-style:italic;">  # 禁用挑战响应认证</span></span>
<span class="line"><span style="color:#61AFEF;">KbdInteractiveAuthentication</span><span style="color:#98C379;"> no</span><span style="color:#7F848E;font-style:italic;">     # 禁用键盘交互认证</span></span>
<span class="line"><span style="color:#61AFEF;">UsePAM</span><span style="color:#98C379;"> no</span><span style="color:#7F848E;font-style:italic;">                           # 禁用 PAM（纯密钥认证时）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 加密算法 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 只允许安全算法，移除弱算法</span></span>
<span class="line"><span style="color:#61AFEF;">KexAlgorithms</span><span style="color:#98C379;"> curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512</span></span>
<span class="line"><span style="color:#61AFEF;">Ciphers</span><span style="color:#98C379;"> chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com</span></span>
<span class="line"><span style="color:#61AFEF;">MACs</span><span style="color:#98C379;"> hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com</span></span>
<span class="line"><span style="color:#61AFEF;">HostKeyAlgorithms</span><span style="color:#98C379;"> ssh-ed25519,rsa-sha2-512,rsa-sha2-256</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 会话配置 =====</span></span>
<span class="line"><span style="color:#61AFEF;">MaxAuthTries</span><span style="color:#D19A66;"> 3</span><span style="color:#7F848E;font-style:italic;">                      # 最大认证尝试次数</span></span>
<span class="line"><span style="color:#61AFEF;">LoginGraceTime</span><span style="color:#D19A66;"> 30</span><span style="color:#7F848E;font-style:italic;">                   # 登录超时30秒</span></span>
<span class="line"><span style="color:#61AFEF;">MaxSessions</span><span style="color:#D19A66;"> 3</span><span style="color:#7F848E;font-style:italic;">                       # 最大并发会话数</span></span>
<span class="line"><span style="color:#61AFEF;">MaxStartups</span><span style="color:#98C379;"> 10:30:100</span><span style="color:#7F848E;font-style:italic;">              # 未认证连接限制</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 保持连接 =====</span></span>
<span class="line"><span style="color:#61AFEF;">ClientAliveInterval</span><span style="color:#D19A66;"> 300</span><span style="color:#7F848E;font-style:italic;">             # 5分钟无操作发送心跳</span></span>
<span class="line"><span style="color:#61AFEF;">ClientAliveCountMax</span><span style="color:#D19A66;"> 2</span><span style="color:#7F848E;font-style:italic;">               # 2次无响应断开</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 日志 =====</span></span>
<span class="line"><span style="color:#61AFEF;">SyslogFacility</span><span style="color:#98C379;"> AUTH</span></span>
<span class="line"><span style="color:#61AFEF;">LogLevel</span><span style="color:#98C379;"> VERBOSE</span><span style="color:#7F848E;font-style:italic;">                    # 详细日志（记录密钥指纹）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 其他安全选项 =====</span></span>
<span class="line"><span style="color:#61AFEF;">X11Forwarding</span><span style="color:#98C379;"> no</span><span style="color:#7F848E;font-style:italic;">                    # 禁用 X11 转发</span></span>
<span class="line"><span style="color:#61AFEF;">AllowTcpForwarding</span><span style="color:#98C379;"> no</span><span style="color:#7F848E;font-style:italic;">               # 禁用 TCP 转发（按需开启）</span></span>
<span class="line"><span style="color:#61AFEF;">AllowAgentForwarding</span><span style="color:#98C379;"> no</span><span style="color:#7F848E;font-style:italic;">             # 禁用 Agent 转发</span></span>
<span class="line"><span style="color:#61AFEF;">PermitTunnel</span><span style="color:#98C379;"> no</span><span style="color:#7F848E;font-style:italic;">                     # 禁用隧道</span></span>
<span class="line"><span style="color:#61AFEF;">PrintMotd</span><span style="color:#98C379;"> no</span><span style="color:#7F848E;font-style:italic;">                        # 不打印 MOTD（减少信息泄露）</span></span>
<span class="line"><span style="color:#61AFEF;">Banner</span><span style="color:#98C379;"> /etc/ssh/banner</span><span style="color:#7F848E;font-style:italic;">              # 登录前警告横幅</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 访问控制 =====</span></span>
<span class="line"><span style="color:#61AFEF;">AllowUsers</span><span style="color:#98C379;"> deployadmin</span><span style="color:#7F848E;font-style:italic;">              # 仅允许指定用户登录</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DenyUsers root                    # 或用 DenyUsers 排除</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>创建登录横幅</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/ssh/banner</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">*******************************************************************</span></span>
<span class="line"><span style="color:#98C379;">*  WARNING: Unauthorized access to this system is prohibited.    *</span></span>
<span class="line"><span style="color:#98C379;">*  All connections are monitored and recorded.                    *</span></span>
<span class="line"><span style="color:#98C379;">*  Disconnect IMMEDIATELY if you are not an authorized user.      *</span></span>
<span class="line"><span style="color:#98C379;">*******************************************************************</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>验证并重启 SSH</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 验证配置语法（必须！防止配置错误导致无法登录）</span></span>
<span class="line"><span style="color:#61AFEF;">sshd</span><span style="color:#D19A66;"> -t</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果返回无输出，说明配置正确</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果报错，检查行号和参数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重启 SSH 服务</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> sshd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ⚠️ 关键：不要关闭当前 SSH 会话！</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 另开一个终端，用新配置测试登录</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#D19A66;"> -p</span><span style="color:#D19A66;"> 2222</span><span style="color:#98C379;"> deployadmin@192.168.1.100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 确认新会话能登录后，再关闭旧会话</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">SSH 加固黄金法则</p><p><strong>在禁用密码认证和修改端口之前，务必先确认密钥登录可用。</strong> 无数运维人员因为&quot;先关了密码，发现密钥没配上&quot;而被迫去机房。永远保持一个已连接的会话作为&quot;安全绳&quot;。</p></div><h3 id="_3-4-fail2ban-防暴力破解" tabindex="-1"><a class="header-anchor" href="#_3-4-fail2ban-防暴力破解"><span>3.4 Fail2Ban 防暴力破解</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装</span></span>
<span class="line"><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> fail2ban</span><span style="color:#7F848E;font-style:italic;">    # Ubuntu</span></span>
<span class="line"><span style="color:#61AFEF;">dnf</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> fail2ban</span><span style="color:#7F848E;font-style:italic;">    # CentOS/Rocky</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/fail2ban/jail.local</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">[DEFAULT]</span></span>
<span class="line"><span style="color:#98C379;">bantime = 3600</span></span>
<span class="line"><span style="color:#98C379;">findtime = 600</span></span>
<span class="line"><span style="color:#98C379;">maxretry = 3</span></span>
<span class="line"><span style="color:#98C379;">banaction = iptables-multiport</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">[sshd]</span></span>
<span class="line"><span style="color:#98C379;">enabled = true</span></span>
<span class="line"><span style="color:#98C379;">port = 2222</span></span>
<span class="line"><span style="color:#98C379;">filter = sshd</span></span>
<span class="line"><span style="color:#98C379;">logpath = /var/log/auth.log</span></span>
<span class="line"><span style="color:#98C379;">maxretry = 3</span></span>
<span class="line"><span style="color:#98C379;">bantime = 7200</span></span>
<span class="line"><span style="color:#98C379;">findtime = 300</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> fail2ban</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看封禁状态</span></span>
<span class="line"><span style="color:#61AFEF;">fail2ban-client</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> sshd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 手动解封</span></span>
<span class="line"><span style="color:#61AFEF;">fail2ban-client</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> sshd</span><span style="color:#98C379;"> unbanip</span><span style="color:#D19A66;"> 1.2.3.4</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-5-禁用-root-登录的完整方案" tabindex="-1"><a class="header-anchor" href="#_3-5-禁用-root-登录的完整方案"><span>3.5 禁用 root 登录的完整方案</span></a></h3>`,15),i(f,{code:`eJx10E1LwzAYB/D7PkXA8y5DxHlQ3Pvrad7CDqNbcVAsbBORTdgQpYzJimxiW6sDdYhC601cHfsyTdJ+C2NStZf1mN8/T59/REk+EQ5rrQ44SEUA/fYhUgzkLLBm+X2dTF6w8lEF0eguSED/4oosLdA+rssAm+e+plbZnQTzZODIvvSvnz3rybMH3JPMU9B/HdEz7kRz0HLKPcU83Q0LVlQ0fNg7Y4H0T6CH1HkPJEMH+NbugQwk8wHdE7RkuQMqlRwIj86w0dkgQ39AZoPwalnmOeiuLDz55NffbDR+5JxjnP9tnqk1pViidsQxz7AA8V2fOAovx6XApNjFN+/ul+7ZJhrbfKugUPG/UAnSxdyVSaZakDXusaPzQTzHepYhGs6QsUDWiL5NNcK83TmVGvQ1xKYk7WyIohgXNkNQXAelPxDq9VgIygEI240tIR75Bmlh5h8=`}),s[6]||=n(`<h2 id="四、防火墙配置" tabindex="-1"><a class="header-anchor" href="#四、防火墙配置"><span>四、防火墙配置</span></a></h2><p>防火墙是网络层面的访问控制，配合 SSH 加固形成纵深防御。</p><h3 id="_4-1-ufw-ubuntu-debian" tabindex="-1"><a class="header-anchor" href="#_4-1-ufw-ubuntu-debian"><span>4.1 UFW（Ubuntu/Debian）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装（通常已预装）</span></span>
<span class="line"><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> ufw</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重置规则（全新配置前）</span></span>
<span class="line"><span style="color:#61AFEF;">ufw</span><span style="color:#D19A66;"> --force</span><span style="color:#98C379;"> reset</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认策略：拒绝所有入站，允许所有出站</span></span>
<span class="line"><span style="color:#61AFEF;">ufw</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> deny</span><span style="color:#98C379;"> incoming</span></span>
<span class="line"><span style="color:#61AFEF;">ufw</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> outgoing</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 允许必要端口</span></span>
<span class="line"><span style="color:#61AFEF;">ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> 2222/tcp</span><span style="color:#98C379;"> comment</span><span style="color:#98C379;"> &#39;SSH custom port&#39;</span></span>
<span class="line"><span style="color:#61AFEF;">ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> 80/tcp</span><span style="color:#98C379;"> comment</span><span style="color:#98C379;"> &#39;HTTP&#39;</span></span>
<span class="line"><span style="color:#61AFEF;">ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> 443/tcp</span><span style="color:#98C379;"> comment</span><span style="color:#98C379;"> &#39;HTTPS&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 限制来源 IP 的规则（管理端口仅允许办公网段）</span></span>
<span class="line"><span style="color:#61AFEF;">ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> from</span><span style="color:#98C379;"> 10.0.0.0/8</span><span style="color:#98C379;"> to</span><span style="color:#98C379;"> any</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 2222</span><span style="color:#98C379;"> proto</span><span style="color:#98C379;"> tcp</span><span style="color:#98C379;"> comment</span><span style="color:#98C379;"> &#39;SSH from office&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看规则（带编号）</span></span>
<span class="line"><span style="color:#61AFEF;">ufw</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> numbered</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启用防火墙</span></span>
<span class="line"><span style="color:#61AFEF;">ufw</span><span style="color:#D19A66;"> --force</span><span style="color:#98C379;"> enable</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证</span></span>
<span class="line"><span style="color:#61AFEF;">ufw</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> verbose</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Status: active</span></span>
<span class="line"><span>Logging: on (low)</span></span>
<span class="line"><span>Default: deny (incoming), allow (outgoing), disabled (routed)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>To                         Action      From</span></span>
<span class="line"><span>--                         ------      ----</span></span>
<span class="line"><span>2222/tcp                   ALLOW IN    10.0.0.0/8             (SSH from office)</span></span>
<span class="line"><span>80/tcp                     ALLOW IN    Anywhere               (HTTP)</span></span>
<span class="line"><span>443/tcp                    ALLOW IN    Anywhere               (HTTPS)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">UFW 规则顺序</p><p>UFW 按规则从上到下匹配，<strong>第一条匹配的规则生效</strong>。更具体的规则（如限制来源 IP）应该放在更前面。使用 <code>ufw status numbered</code> 查看编号，用 <code>ufw insert 1 ...</code> 在指定位置插入规则。</p></div><h3 id="_4-2-firewalld-centos-rocky-almalinux" tabindex="-1"><a class="header-anchor" href="#_4-2-firewalld-centos-rocky-almalinux"><span>4.2 Firewalld（CentOS/Rocky/AlmaLinux）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装并启动</span></span>
<span class="line"><span style="color:#61AFEF;">dnf</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> firewalld</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> firewalld</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看默认区域</span></span>
<span class="line"><span style="color:#61AFEF;">firewall-cmd</span><span style="color:#D19A66;"> --get-default-zone</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># public</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看当前区域规则</span></span>
<span class="line"><span style="color:#61AFEF;">firewall-cmd</span><span style="color:#D19A66;"> --list-all</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加服务/端口</span></span>
<span class="line"><span style="color:#61AFEF;">firewall-cmd</span><span style="color:#D19A66;"> --permanent</span><span style="color:#D19A66;"> --add-service=http</span></span>
<span class="line"><span style="color:#61AFEF;">firewall-cmd</span><span style="color:#D19A66;"> --permanent</span><span style="color:#D19A66;"> --add-service=https</span></span>
<span class="line"><span style="color:#61AFEF;">firewall-cmd</span><span style="color:#D19A66;"> --permanent</span><span style="color:#D19A66;"> --add-port=2222/tcp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 限制来源 IP（富规则）</span></span>
<span class="line"><span style="color:#61AFEF;">firewall-cmd</span><span style="color:#D19A66;"> --permanent</span><span style="color:#D19A66;"> --add-rich-rule=</span><span style="color:#98C379;">&#39;</span></span>
<span class="line"><span style="color:#98C379;">    rule family=&quot;ipv4&quot;</span></span>
<span class="line"><span style="color:#98C379;">    source address=&quot;10.0.0.0/8&quot;</span></span>
<span class="line"><span style="color:#98C379;">    port port=&quot;2222&quot; protocol=&quot;tcp&quot;</span></span>
<span class="line"><span style="color:#98C379;">    accept&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重载配置</span></span>
<span class="line"><span style="color:#61AFEF;">firewall-cmd</span><span style="color:#D19A66;"> --reload</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证</span></span>
<span class="line"><span style="color:#61AFEF;">firewall-cmd</span><span style="color:#D19A66;"> --list-all</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>public (active)</span></span>
<span class="line"><span>  target: default</span></span>
<span class="line"><span>  icmp-block-inversion: no</span></span>
<span class="line"><span>  interfaces: eth0</span></span>
<span class="line"><span>  services: http https</span></span>
<span class="line"><span>  ports: 2222/tcp</span></span>
<span class="line"><span>  rich rules:</span></span>
<span class="line"><span>    rule family=&quot;ipv4&quot; source address=&quot;10.0.0.0/8&quot; port port=&quot;2222&quot; protocol=&quot;tcp&quot; accept</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-防火墙规则设计原则" tabindex="-1"><a class="header-anchor" href="#_4-3-防火墙规则设计原则"><span>4.3 防火墙规则设计原则</span></a></h3>`,10),i(f,{code:`eJxLy8kvT85ILCpR8AniUgACx+inrUufr575Yv32ZxubYhV0de0UnKpfztj0vHH100UzXyxvedox82nPzpetvbVgDU4gJTUQEQVHHx//8BoF5+hnU/a9WNgTi6nCxdUvskbBJfpZ96Tnu+fqP9mx6OmeZmR1z6YvgCiFWFWj4Br9cveMF+uWPF877fnUpVZgE2K5wDqKSypzUhVcFdIyc3KslNPSklNSjJAknKESyRapZsmWSBIucB2pSampXAAu4m1f`}),s[7]||=n(`<table><thead><tr><th>原则</th><th>说明</th><th>示例</th></tr></thead><tbody><tr><td>默认拒绝</td><td>所有未明确允许的流量一律拒绝</td><td><code>ufw default deny incoming</code></td></tr><tr><td>最小开放</td><td>只开放业务必需的端口</td><td>只开 80/443，不开 3306</td></tr><tr><td>限制来源</td><td>管理端口限制来源 IP</td><td>SSH 仅允许办公网段</td></tr><tr><td>规则注释</td><td>每条规则加注释说明用途</td><td><code>comment &#39;API gateway&#39;</code></td></tr><tr><td>定期审计</td><td>每季度审查规则，移除不再需要的</td><td><code>ufw status numbered</code></td></tr></tbody></table><h2 id="五、时间同步" tabindex="-1"><a class="header-anchor" href="#五、时间同步"><span>五、时间同步</span></a></h2><p>时间看起来不起眼，但在分布式系统中，时间不一致会导致：</p><ul><li>TLS 证书验证失败</li><li>日志无法对齐排查</li><li>分布式锁失效</li><li>数据库复制中断</li></ul><h3 id="_5-1-chrony-配置-推荐" tabindex="-1"><a class="header-anchor" href="#_5-1-chrony-配置-推荐"><span>5.1 Chrony 配置（推荐）</span></a></h3><p>Chrony 是 NTP 的现代替代，启动更快、同步更准、对网络中断更健壮。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装</span></span>
<span class="line"><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> chrony</span><span style="color:#7F848E;font-style:italic;">       # Ubuntu</span></span>
<span class="line"><span style="color:#61AFEF;">dnf</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> chrony</span><span style="color:#7F848E;font-style:italic;">       # CentOS/Rocky</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/chrony/chrony.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;"># 使用国内 NTP 源（阿里云）</span></span>
<span class="line"><span style="color:#98C379;">server ntp1.aliyun.com iburst</span></span>
<span class="line"><span style="color:#98C379;">server ntp2.aliyun.com iburst</span></span>
<span class="line"><span style="color:#98C379;">server ntp3.aliyun.com iburst</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 允许本地作为 NTP 服务器（局域网内其他机器同步）</span></span>
<span class="line"><span style="color:#98C379;"># allow 192.168.1.0/24</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 漂移文件</span></span>
<span class="line"><span style="color:#98C379;">driftfile /var/lib/chrony/drift</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 日志</span></span>
<span class="line"><span style="color:#98C379;">logdir /var/log/chrony</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 同步频率</span></span>
<span class="line"><span style="color:#98C379;">makestep 1.0 3</span></span>
<span class="line"><span style="color:#98C379;">rtcsync</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> chronyd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证同步状态</span></span>
<span class="line"><span style="color:#61AFEF;">chronyc</span><span style="color:#98C379;"> tracking</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Reference ID    : A817A817 (ntp1.aliyun.com)</span></span>
<span class="line"><span>Stratum         : 3</span></span>
<span class="line"><span>Ref time (UTC)  : Thu Jun 04 08:30:00 2026</span></span>
<span class="line"><span>System time     : 0.000001234 seconds fast of NTP time</span></span>
<span class="line"><span>Last offset     : +0.000012345 seconds</span></span>
<span class="line"><span>RMS offset      : 0.000023456 seconds</span></span>
<span class="line"><span>Frequency       : 1.234 ppm fast</span></span>
<span class="line"><span>Residual freq   : +0.001 ppm</span></span>
<span class="line"><span>Skew            : 0.123 ppm</span></span>
<span class="line"><span>Root delay      : 0.012345 seconds</span></span>
<span class="line"><span>Root dispersion : 0.001234 seconds</span></span>
<span class="line"><span>Update interval : 1032.0 seconds</span></span>
<span class="line"><span>Leap status     : Normal</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 NTP 源状态</span></span>
<span class="line"><span style="color:#61AFEF;">chronyc</span><span style="color:#98C379;"> sources</span><span style="color:#D19A66;"> -v</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 立即同步</span></span>
<span class="line"><span style="color:#61AFEF;">chronyc</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> makestep</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查硬件时钟</span></span>
<span class="line"><span style="color:#61AFEF;">timedatectl</span><span style="color:#98C379;"> status</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-时区配置" tabindex="-1"><a class="header-anchor" href="#_5-2-时区配置"><span>5.2 时区配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 设置时区为东八区</span></span>
<span class="line"><span style="color:#61AFEF;">timedatectl</span><span style="color:#98C379;"> set-timezone</span><span style="color:#98C379;"> Asia/Shanghai</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证</span></span>
<span class="line"><span style="color:#61AFEF;">timedatectl</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>               Local time: Thu 2026-06-04 16:30:00 CST</span></span>
<span class="line"><span>           Universal time: Thu 2026-06-04 08:30:00 UTC</span></span>
<span class="line"><span>                 RTC time: Thu 2026-06-04 08:30:00</span></span>
<span class="line"><span>                Time zone: Asia/Shanghai (CST, +0800)</span></span>
<span class="line"><span>System clock synchronized: yes</span></span>
<span class="line"><span>              NTP service: active</span></span>
<span class="line"><span>          RTC in local TZ: no</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">时区一致性</p><p><strong>集群内所有服务器的时区必须一致。</strong> 推荐统一使用 <code>UTC</code>（日志用 UTC 时间戳，显示层做时区转换），或统一使用 <code>Asia/Shanghai</code>。混用时区是排查时间相关问题的噩梦。</p></div><h2 id="六、内核参数调优" tabindex="-1"><a class="header-anchor" href="#六、内核参数调优"><span>六、内核参数调优</span></a></h2><p>内核参数直接决定系统的网络性能、文件处理能力、内存管理策略。生产环境必须根据业务场景调优。</p><h3 id="_6-1-sysctl-调优配置" tabindex="-1"><a class="header-anchor" href="#_6-1-sysctl-调优配置"><span>6.1 sysctl 调优配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 备份原始配置</span></span>
<span class="line"><span style="color:#61AFEF;">cp</span><span style="color:#98C379;"> /etc/sysctl.conf</span><span style="color:#98C379;"> /etc/sysctl.conf.bak.</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d</span><span style="color:#ABB2BF;">)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/sysctl.d/99-production.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产级内核参数调优</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 网络优化 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TCP 连接队列</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.somaxconn</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 65535</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TCP 接收/发送缓冲区</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.rmem_max</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 16777216</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.wmem_max</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 16777216</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.rmem_default</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 262144</span></span>
<span class="line"><span style="color:#61AFEF;">net.core.wmem_default</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 262144</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_rmem</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 4096</span><span style="color:#D19A66;"> 87380</span><span style="color:#D19A66;"> 16777216</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_wmem</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 4096</span><span style="color:#D19A66;"> 65536</span><span style="color:#D19A66;"> 16777216</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TCP 连接保持</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_keepalive_time</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 600</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_keepalive_intvl</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 30</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_keepalive_probes</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TCP 快速回收与复用</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_tw_reuse</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_fin_timeout</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 15</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SYN 队列（防范 SYN Flood）</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_max_syn_backlog</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 65535</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.tcp_syncookies</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 本地端口范围（出站连接）</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.ip_local_port_range</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1024</span><span style="color:#D19A66;"> 65535</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 安全加固 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 禁用 ICMP 重定向</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.conf.all.accept_redirects</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.conf.default.accept_redirects</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.conf.all.send_redirects</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.conf.default.send_redirects</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 禁用源路由</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.conf.all.accept_source_route</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.conf.default.accept_source_route</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 记录可疑包</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.conf.all.log_martians</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv4.conf.default.log_martians</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 禁用 IPv6（如不需要）</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv6.conf.all.disable_ipv6</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#61AFEF;">net.ipv6.conf.default.disable_ipv6</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 内存管理 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 共享内存</span></span>
<span class="line"><span style="color:#61AFEF;">kernel.shmmax</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 68719476736</span></span>
<span class="line"><span style="color:#61AFEF;">kernel.shmall</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 4294967296</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># overcommit 策略（数据库服务器建议 2）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 0 = 启发式（默认）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1 = 总是允许</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2 = 不允许超过 swap + vm.overcommit_ratio * RAM</span></span>
<span class="line"><span style="color:#61AFEF;">vm.overcommit_memory</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#61AFEF;">vm.overcommit_ratio</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 50</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># swappiness（越低越少用 swap，生产建议 1-10）</span></span>
<span class="line"><span style="color:#61AFEF;">vm.swappiness</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 文件系统 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 最大文件句柄数</span></span>
<span class="line"><span style="color:#61AFEF;">fs.file-max</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1048576</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># inotify 上限（日志采集/文件监控场景）</span></span>
<span class="line"><span style="color:#61AFEF;">fs.inotify.max_user_watches</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 524288</span></span>
<span class="line"><span style="color:#61AFEF;">fs.inotify.max_user_instances</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 512</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 内核安全 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 禁用 SysRq</span></span>
<span class="line"><span style="color:#61AFEF;">kernel.sysrq</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 核心转储</span></span>
<span class="line"><span style="color:#61AFEF;">kernel.core_uses_pid</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ASLR（地址空间随机化，2 = 完全随机化）</span></span>
<span class="line"><span style="color:#61AFEF;">kernel.randomize_va_space</span><span style="color:#98C379;"> =</span><span style="color:#D19A66;"> 2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 应用配置</span></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /etc/sysctl.d/99-production.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证关键参数</span></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#98C379;"> net.core.somaxconn</span></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#98C379;"> vm.swappiness</span></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#98C379;"> fs.file-max</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-文件描述符限制" tabindex="-1"><a class="header-anchor" href="#_6-2-文件描述符限制"><span>6.2 文件描述符限制</span></a></h3><p>Linux 默认的文件描述符上限（1024）对生产环境远远不够——每个网络连接、每个打开的文件、每个日志写入都消耗一个文件描述符。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看当前限制</span></span>
<span class="line"><span style="color:#56B6C2;">ulimit</span><span style="color:#D19A66;"> -n</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认: 1024</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看系统级上限</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/sys/fs/file-max</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1048576</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/security/limits.d/99-nofile.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 软限制和硬限制</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 全局默认</span></span>
<span class="line"><span style="color:#ABB2BF;">* soft nofile 65535</span></span>
<span class="line"><span style="color:#ABB2BF;">* hard nofile 65535</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># root 用户</span></span>
<span class="line"><span style="color:#61AFEF;">root</span><span style="color:#98C379;"> soft</span><span style="color:#98C379;"> nofile</span><span style="color:#D19A66;"> 1048576</span></span>
<span class="line"><span style="color:#61AFEF;">root</span><span style="color:#98C379;"> hard</span><span style="color:#98C379;"> nofile</span><span style="color:#D19A66;"> 1048576</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 特定服务用户</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#98C379;"> soft</span><span style="color:#98C379;"> nofile</span><span style="color:#D19A66;"> 1048576</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#98C379;"> hard</span><span style="color:#98C379;"> nofile</span><span style="color:#D19A66;"> 1048576</span></span>
<span class="line"><span style="color:#61AFEF;">mysql</span><span style="color:#98C379;"> soft</span><span style="color:#98C379;"> nofile</span><span style="color:#D19A66;"> 1048576</span></span>
<span class="line"><span style="color:#61AFEF;">mysql</span><span style="color:#98C379;"> hard</span><span style="color:#98C379;"> nofile</span><span style="color:#D19A66;"> 1048576</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 对于 systemd 管理的服务，还需要在 service 文件中配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/systemd/system/nginx.service</span></span>
<span class="line"><span style="color:#ABB2BF;">[Service]</span></span>
<span class="line"><span style="color:#E06C75;">LimitNOFILE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1048576</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或者全局配置</span></span>
<span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /etc/systemd/system.service.d</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/systemd/system.service.d/limits.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">[Service]</span></span>
<span class="line"><span style="color:#98C379;">LimitNOFILE=1048576</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重载 systemd</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> daemon-reload</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">文件描述符的三层限制</p><p>文件描述符受三层限制约束，必须全部配置才能生效：</p><ol><li><strong>系统级</strong>：<code>fs.file-max</code>（sysctl）—— 全局上限</li><li><strong>用户级</strong>：<code>/etc/security/limits.conf</code> —— 用户/进程上限</li><li><strong>进程级</strong>：<code>LimitNOFILE</code>（systemd）—— 服务进程上限</li></ol><p>任何一层未配置，其他层的配置都可能不生效。</p></div><h3 id="_6-3-内核参数调优决策树" tabindex="-1"><a class="header-anchor" href="#_6-3-内核参数调优决策树"><span>6.3 内核参数调优决策树</span></a></h3>`,26),i(f,{code:`eJxtktFr00Acx9/3VwR8bkbbvShM2dquq08+CD6EEmK82GCSC8nZWhbBKbXTrlqRSifVOtFtCGsrTjcSW/+Z3CX9L7xcAktheQnJ5/P93e93d4oGG3JNshB3t7jC0WdDCA7H4fibf/ERvz7EQ5ccTKpcJnOT29zxL7zwaDc8G4WzWfDTw587t56y0GYkOPfA/dWNOxWODLtR9ODE4QqCPz9etLvB7F3gDfHb56Q/raYi9JN0x9h9n8oUkwx+2cKngysyH9q+9ycVKCWBGAS/vMAbXRE7P8e9vbh5h9sScOtk8elrOH3h/x1UV5hYYHMWsoIBEC9DC/A21KUnMjSMuFIi5JigmvU1HsmmiBqiBR7bYMnJXzqqKWpQljTRhBYSLcl4SFXmFplbzAp1nbcbkmmqBrDt9WxcKaG5iMI6sGSo6yoSdaBDq7meW5LywiNgGUDj7ZpOW16lL0nTkmVKzCllBcXmFVUDGWrE6YTkIqIaEKlKk6dQpNNYYkNCcg3YS2Y+auaBaqEmHQSpMFlhi9GyQPZf0e3Erb3APV4865HT73SDSf8srlFm1raA33TI787ix3442Y3JNiOVnXA+J1/aya2qsHPDvSOHK6d+kMHE4W4L4XiKZ308cgP3X9KFjZoaoMdNZ9RuXFMU5bq8lgKVZfAfolg1SA==`}),s[8]||=n(`<h2 id="七、自动安全更新" tabindex="-1"><a class="header-anchor" href="#七、自动安全更新"><span>七、自动安全更新</span></a></h2><h3 id="_7-1-ubuntu-unattended-upgrades" tabindex="-1"><a class="header-anchor" href="#_7-1-ubuntu-unattended-upgrades"><span>7.1 Ubuntu：unattended-upgrades</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装</span></span>
<span class="line"><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> unattended-upgrades</span><span style="color:#98C379;"> apt-listchanges</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 自动配置</span></span>
<span class="line"><span style="color:#61AFEF;">dpkg-reconfigure</span><span style="color:#D19A66;"> -plow</span><span style="color:#98C379;"> unattended-upgrades</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 手动配置</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/apt/apt.conf.d/50unattended-upgrades</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">// 自动更新配置</span></span>
<span class="line"><span style="color:#98C379;">Unattended-Upgrade::Allowed-Origins {</span></span>
<span class="line"><span style="color:#98C379;">    &quot;\${distro_id}:\${distro_codename}-security&quot;;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;\${distro_id}ESMApps:\${distro_codename}-apps-security&quot;;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;\${distro_id}ESM:\${distro_codename}-infra-security&quot;;</span></span>
<span class="line"><span style="color:#98C379;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">// 不自动更新的包（内核、数据库等需要验证后手动更新）</span></span>
<span class="line"><span style="color:#98C379;">Unattended-Upgrade::Package-Blacklist {</span></span>
<span class="line"><span style="color:#98C379;">    &quot;linux-image-*&quot;;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;mysql-server-*&quot;;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;postgresql-*&quot;;</span></span>
<span class="line"><span style="color:#98C379;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">// 自动清理旧内核</span></span>
<span class="line"><span style="color:#98C379;">Unattended-Upgrade::Remove-Unused-Kernel-Packages &quot;true&quot;;</span></span>
<span class="line"><span style="color:#98C379;">Unattended-Upgrade::Remove-New-Unused-Dependencies &quot;true&quot;;</span></span>
<span class="line"><span style="color:#98C379;">Unattended-Upgrade::Remove-Unused-Dependencies &quot;true&quot;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">// 自动重启（如果需要）</span></span>
<span class="line"><span style="color:#98C379;">Unattended-Upgrade::Automatic-Reboot &quot;false&quot;;</span></span>
<span class="line"><span style="color:#98C379;">// 如果启用重启，设定时间</span></span>
<span class="line"><span style="color:#98C379;">// Unattended-Upgrade::Automatic-Reboot-Time &quot;03:00&quot;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">// 邮件通知（可选）</span></span>
<span class="line"><span style="color:#98C379;">// Unattended-Upgrade::Mail &quot;admin@example.com&quot;;</span></span>
<span class="line"><span style="color:#98C379;">// Unattended-Upgrade::MailOnlyOnError &quot;true&quot;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">// 日志</span></span>
<span class="line"><span style="color:#98C379;">Unattended-Upgrade::SyslogEnable &quot;true&quot;;</span></span>
<span class="line"><span style="color:#98C379;">Unattended-Upgrade::SyslogFacility &quot;daemon&quot;;</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启用自动更新</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/apt/apt.conf.d/20auto-upgrades</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">APT::Periodic::Update-Package-Lists &quot;1&quot;;</span></span>
<span class="line"><span style="color:#98C379;">APT::Periodic::Unattended-Upgrade &quot;1&quot;;</span></span>
<span class="line"><span style="color:#98C379;">APT::Periodic::Download-Upgradeable-Packages &quot;1&quot;;</span></span>
<span class="line"><span style="color:#98C379;">APT::Periodic::AutocleanInterval &quot;7&quot;;</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证配置</span></span>
<span class="line"><span style="color:#61AFEF;">unattended-upgrade</span><span style="color:#D19A66;"> --dry-run</span><span style="color:#D19A66;"> --debug</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-centos-rocky-dnf-automatic" tabindex="-1"><a class="header-anchor" href="#_7-2-centos-rocky-dnf-automatic"><span>7.2 CentOS/Rocky：dnf-automatic</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装</span></span>
<span class="line"><span style="color:#61AFEF;">dnf</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> dnf-automatic</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/dnf/automatic.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">[commands]</span></span>
<span class="line"><span style="color:#98C379;">upgrade_type = security</span></span>
<span class="line"><span style="color:#98C379;">download_updates = yes</span></span>
<span class="line"><span style="color:#98C379;">apply_updates = yes</span></span>
<span class="line"><span style="color:#98C379;">reboot = never</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">[emitters]</span></span>
<span class="line"><span style="color:#98C379;">emit_via = stdio</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">[email]</span></span>
<span class="line"><span style="color:#98C379;">email_from = root@example.com</span></span>
<span class="line"><span style="color:#98C379;">email_to = admin@example.com</span></span>
<span class="line"><span style="color:#98C379;">email_host = localhost</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">[base]</span></span>
<span class="line"><span style="color:#98C379;">debuglevel = 1</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启用定时器</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> dnf-automatic.timer</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证定时器状态</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> list-timers</span><span style="color:#98C379;"> dnf-automatic.timer</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container info"><p class="hint-container-title">安全更新策略</p><ul><li><strong>安全补丁</strong>：自动安装（通常无破坏性变更）</li><li><strong>功能更新</strong>：测试环境验证后再手动安装</li><li><strong>大版本升级</strong>：必须有完整的回滚方案</li><li><strong>内核更新</strong>：需要重启，在维护窗口操作</li></ul></div><h2 id="八、日志配置" tabindex="-1"><a class="header-anchor" href="#八、日志配置"><span>八、日志配置</span></a></h2><p>日志是排查问题的&quot;黑匣子&quot;，配置得当可以在故障发生时提供关键线索。</p><h3 id="_8-1-rsyslog-配置" tabindex="-1"><a class="header-anchor" href="#_8-1-rsyslog-配置"><span>8.1 rsyslog 配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装（通常已预装）</span></span>
<span class="line"><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> rsyslog</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置远程日志转发（将日志集中到日志服务器）</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/rsyslog.d/50-forward.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;"># 转发所有日志到远程日志服务器</span></span>
<span class="line"><span style="color:#98C379;">*.* @@log-server.internal.example.com:514;RSYSLOG_TraditionalFileFormat</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 本地也保留一份</span></span>
<span class="line"><span style="color:#98C379;">$ActionQueueType LinkedList</span></span>
<span class="line"><span style="color:#98C379;">$ActionQueueFileName fwdqueue</span></span>
<span class="line"><span style="color:#98C379;">$ActionResumeRetryCount -1    # 无限重试</span></span>
<span class="line"><span style="color:#98C379;">$ActionQueueSaveOnShutdown on  # 关机时保存队列</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 自定义日志分类</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/rsyslog.d/40-app.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;"># 应用日志单独存储</span></span>
<span class="line"><span style="color:#98C379;">if $programname startswith &#39;nginx&#39; then /var/log/nginx/nginx.log</span></span>
<span class="line"><span style="color:#98C379;">&amp; stop</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">if $programname startswith &#39;myapp&#39; then /var/log/myapp/myapp.log</span></span>
<span class="line"><span style="color:#98C379;">&amp; stop</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重启</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> rsyslog</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-journald-配置" tabindex="-1"><a class="header-anchor" href="#_8-2-journald-配置"><span>8.2 journald 配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 配置</span></span>
<span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /etc/systemd/journald.conf.d</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/systemd/journald.conf.d/99-production.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">[Journal]</span></span>
<span class="line"><span style="color:#98C379;"># 日志存储方式：persistent（持久化）、volatile（内存）、auto</span></span>
<span class="line"><span style="color:#98C379;">Storage=persistent</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 日志文件最大占用空间</span></span>
<span class="line"><span style="color:#98C379;">SystemMaxUse=2G</span></span>
<span class="line"><span style="color:#98C379;">SystemMaxFileSize=100M</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 日志保留天数</span></span>
<span class="line"><span style="color:#98C379;">MaxRetentionSec=30day</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 转发到 syslog</span></span>
<span class="line"><span style="color:#98C379;">ForwardToSyslog=yes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 转发到终端</span></span>
<span class="line"><span style="color:#98C379;">ForwardToConsole=no</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 日志级别</span></span>
<span class="line"><span style="color:#98C379;">MaxLevelStore=info</span></span>
<span class="line"><span style="color:#98C379;">MaxLevelSyslog=info</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重启</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> systemd-journald</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 常用查询命令</span></span>
<span class="line"><span style="color:#61AFEF;">journalctl</span><span style="color:#D19A66;"> --since</span><span style="color:#98C379;"> &quot;1 hour ago&quot;</span><span style="color:#7F848E;font-style:italic;">              # 最近1小时</span></span>
<span class="line"><span style="color:#61AFEF;">journalctl</span><span style="color:#D19A66;"> -u</span><span style="color:#98C379;"> nginx.service</span><span style="color:#D19A66;"> --since</span><span style="color:#98C379;"> today</span><span style="color:#7F848E;font-style:italic;">    # nginx服务今日日志</span></span>
<span class="line"><span style="color:#61AFEF;">journalctl</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> err</span><span style="color:#7F848E;font-style:italic;">                             # 仅错误级别</span></span>
<span class="line"><span style="color:#61AFEF;">journalctl</span><span style="color:#D19A66;"> -f</span><span style="color:#7F848E;font-style:italic;">                                 # 实时跟踪</span></span>
<span class="line"><span style="color:#61AFEF;">journalctl</span><span style="color:#D19A66;"> --disk-usage</span><span style="color:#7F848E;font-style:italic;">                       # 日志占用空间</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-日志轮转配置" tabindex="-1"><a class="header-anchor" href="#_8-3-日志轮转配置"><span>8.3 日志轮转配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/logrotate.d/nginx</span></span>
<span class="line"><span style="color:#61AFEF;">/var/log/nginx/*.log</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    daily</span></span>
<span class="line"><span style="color:#61AFEF;">    missingok</span></span>
<span class="line"><span style="color:#61AFEF;">    rotate</span><span style="color:#D19A66;"> 30</span></span>
<span class="line"><span style="color:#61AFEF;">    compress</span></span>
<span class="line"><span style="color:#61AFEF;">    delaycompress</span></span>
<span class="line"><span style="color:#61AFEF;">    notifempty</span></span>
<span class="line"><span style="color:#61AFEF;">    create</span><span style="color:#D19A66;"> 0640</span><span style="color:#98C379;"> nginx</span><span style="color:#98C379;"> adm</span></span>
<span class="line"><span style="color:#61AFEF;">    sharedscripts</span></span>
<span class="line"><span style="color:#61AFEF;">    postrotate</span></span>
<span class="line"><span style="color:#ABB2BF;">        [ </span><span style="color:#56B6C2;">-f</span><span style="color:#ABB2BF;"> /var/run/nginx.pid ] &amp;&amp; </span><span style="color:#56B6C2;">kill</span><span style="color:#D19A66;"> -USR1</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /var/run/nginx.pid</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">    endscript</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/logrotate.d/myapp</span></span>
<span class="line"><span style="color:#61AFEF;">/var/log/myapp/*.log</span><span style="color:#98C379;"> {</span></span>
<span class="line"><span style="color:#61AFEF;">    daily</span></span>
<span class="line"><span style="color:#61AFEF;">    missingok</span></span>
<span class="line"><span style="color:#61AFEF;">    rotate</span><span style="color:#D19A66;"> 14</span></span>
<span class="line"><span style="color:#61AFEF;">    compress</span></span>
<span class="line"><span style="color:#61AFEF;">    delaycompress</span></span>
<span class="line"><span style="color:#61AFEF;">    notifempty</span></span>
<span class="line"><span style="color:#61AFEF;">    copytruncate</span><span style="color:#7F848E;font-style:italic;">       # 不需要重启服务</span></span>
<span class="line"><span style="color:#61AFEF;">    size</span><span style="color:#98C379;"> 100M</span><span style="color:#7F848E;font-style:italic;">           # 超过100M也轮转</span></span>
<span class="line"><span style="color:#61AFEF;">    dateext</span><span style="color:#7F848E;font-style:italic;">             # 用日期做后缀</span></span>
<span class="line"><span style="color:#61AFEF;">    dateformat</span><span style="color:#D19A66;"> -%Y%m%d</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 手动测试轮转配置</span></span>
<span class="line"><span style="color:#61AFEF;">logrotate</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> /etc/logrotate.d/nginx</span><span style="color:#7F848E;font-style:italic;">    # 调试模式（不实际执行）</span></span>
<span class="line"><span style="color:#61AFEF;">logrotate</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> /etc/logrotate.d/nginx</span><span style="color:#7F848E;font-style:italic;">    # 强制执行</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="九、安全基线检查" tabindex="-1"><a class="header-anchor" href="#九、安全基线检查"><span>九、安全基线检查</span></a></h2><p>初始化完成后，执行一次完整的安全基线检查：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># security_baseline_check.sh - 安全基线检查脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -euo</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">RED</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&#39;\\033[0;31m&#39;</span></span>
<span class="line"><span style="color:#E06C75;">GREEN</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&#39;\\033[0;32m&#39;</span></span>
<span class="line"><span style="color:#E06C75;">YELLOW</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&#39;\\033[1;33m&#39;</span></span>
<span class="line"><span style="color:#E06C75;">NC</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&#39;\\033[0m&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">PASS</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"><span style="color:#E06C75;">FAIL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"><span style="color:#E06C75;">WARN</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> level</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> desc</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> cmd</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$3</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> eval</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$cmd</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;  \${</span><span style="color:#E06C75;">GREEN</span><span style="color:#98C379;">}[PASS]\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">} </span><span style="color:#E06C75;">$desc</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">PASS</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#C678DD;">        case</span><span style="color:#E06C75;"> $level</span><span style="color:#C678DD;"> in</span></span>
<span class="line"><span style="color:#E06C75;">            critical</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;  \${</span><span style="color:#E06C75;">RED</span><span style="color:#98C379;">}[FAIL]\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">} </span><span style="color:#E06C75;">$desc</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">                ((</span><span style="color:#E06C75;">FAIL</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">                ;;</span></span>
<span class="line"><span style="color:#E06C75;">            warning</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;  \${</span><span style="color:#E06C75;">YELLOW</span><span style="color:#98C379;">}[WARN]\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">} </span><span style="color:#E06C75;">$desc</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">                ((</span><span style="color:#E06C75;">WARN</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">                ;;</span></span>
<span class="line"><span style="color:#C678DD;">        esac</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;========================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  服务器安全基线检查&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  主机: $(</span><span style="color:#61AFEF;">hostname</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;========================================&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- SSH 配置 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> critical</span><span style="color:#98C379;"> &quot;Root SSH 登录已禁用&quot;</span><span style="color:#98C379;"> &quot;grep -q &#39;^PermitRootLogin no&#39; /etc/ssh/sshd_config&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> critical</span><span style="color:#98C379;"> &quot;密码认证已禁用&quot;</span><span style="color:#98C379;"> &quot;grep -q &#39;^PasswordAuthentication no&#39; /etc/ssh/sshd_config&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> critical</span><span style="color:#98C379;"> &quot;密钥认证已启用&quot;</span><span style="color:#98C379;"> &quot;grep -q &#39;^PubkeyAuthentication yes&#39; /etc/ssh/sshd_config&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> warning</span><span style="color:#98C379;">  &quot;SSH 端口已修改&quot;</span><span style="color:#98C379;"> &quot;! grep -q &#39;^Port 22&#39; /etc/ssh/sshd_config&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 防火墙 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> critical</span><span style="color:#98C379;"> &quot;UFW/Firewalld 已启用&quot;</span><span style="color:#98C379;"> &quot;ufw status | grep -q &#39;Status: active&#39; || firewall-cmd --state | grep -q running&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 用户与权限 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> critical</span><span style="color:#98C379;"> &quot;root 密码已锁定&quot;</span><span style="color:#98C379;"> &quot;passwd -S root | grep -q &#39;L&#39;&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> warning</span><span style="color:#98C379;">  &quot;sudo 用户存在&quot;</span><span style="color:#98C379;"> &quot;getent group sudo | grep -q . || getent group wheel | grep -q .&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 时间同步 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> critical</span><span style="color:#98C379;"> &quot;NTP 同步已启用&quot;</span><span style="color:#98C379;"> &quot;timedatectl | grep -q &#39;NTP synchronized: yes&#39; || chronyc tracking | grep -q &#39;Leap status.*Normal&#39;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 内核参数 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> warning</span><span style="color:#98C379;">  &quot;somaxconn &gt;= 65535&quot;</span><span style="color:#98C379;"> &quot;[ $(</span><span style="color:#61AFEF;">sysctl</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> net.core.somaxconn) -ge 65535 ]&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> warning</span><span style="color:#98C379;">  &quot;swappiness &lt;= 10&quot;</span><span style="color:#98C379;"> &quot;[ $(</span><span style="color:#61AFEF;">sysctl</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> vm.swappiness) -le 10 ]&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> warning</span><span style="color:#98C379;">  &quot;file-max &gt;= 1048576&quot;</span><span style="color:#98C379;"> &quot;[ $(</span><span style="color:#61AFEF;">sysctl</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> fs.file-max) -ge 1048576 ]&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 文件描述符 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> warning</span><span style="color:#98C379;">  &quot;nofile &gt;= 65535&quot;</span><span style="color:#98C379;"> &quot;[ $(</span><span style="color:#56B6C2;">ulimit</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;">) -ge 65535 ]&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 自动更新 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> warning</span><span style="color:#98C379;">  &quot;自动安全更新已启用&quot;</span><span style="color:#98C379;"> &quot;test -f /etc/apt/apt.conf.d/20auto-upgrades || systemctl is-active dnf-automatic.timer&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 日志 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> critical</span><span style="color:#98C379;"> &quot;rsyslog 已运行&quot;</span><span style="color:#98C379;"> &quot;systemctl is-active rsyslog&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">check</span><span style="color:#98C379;"> critical</span><span style="color:#98C379;"> &quot;journald 已运行&quot;</span><span style="color:#98C379;"> &quot;systemctl is-active systemd-journald&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;========================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;  \${</span><span style="color:#E06C75;">GREEN</span><span style="color:#98C379;">}PASS: </span><span style="color:#E06C75;">$PASS</span><span style="color:#98C379;">\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">}  \${</span><span style="color:#E06C75;">RED</span><span style="color:#98C379;">}FAIL: </span><span style="color:#E06C75;">$FAIL</span><span style="color:#98C379;">\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">}  \${</span><span style="color:#E06C75;">YELLOW</span><span style="color:#98C379;">}WARN: </span><span style="color:#E06C75;">$WARN</span><span style="color:#98C379;">\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;========================================&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$FAIL</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> -gt</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;  \${</span><span style="color:#E06C75;">RED</span><span style="color:#98C379;">}存在严重安全问题，请立即修复！\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十、自动化初始化脚本" tabindex="-1"><a class="header-anchor" href="#十、自动化初始化脚本"><span>十、自动化初始化脚本</span></a></h2><h3 id="_10-1-shell-一键初始化脚本" tabindex="-1"><a class="header-anchor" href="#_10-1-shell-一键初始化脚本"><span>10.1 Shell 一键初始化脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># server_init.sh - 服务器一键初始化脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用法: sudo bash server_init.sh --hostname web-prod-01 --ip 192.168.1.100 --user deployadmin</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 适用: Ubuntu 22.04/24.04, CentOS/Rocky 8/9</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -euo</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 参数解析 =====</span></span>
<span class="line"><span style="color:#E06C75;">HOSTNAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E06C75;">IP_ADDR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E06C75;">ADMIN_USER</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;deployadmin&quot;</span></span>
<span class="line"><span style="color:#E06C75;">SSH_PORT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">2222</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">while</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#E5C07B;">$#</span><span style="color:#56B6C2;"> -gt</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">    case</span><span style="color:#E06C75;font-style:italic;"> $1</span><span style="color:#C678DD;"> in</span></span>
<span class="line"><span style="color:#E06C75;">        --hostname</span><span style="color:#ABB2BF;">) </span><span style="color:#E06C75;">HOSTNAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#56B6C2;">shift</span><span style="color:#D19A66;"> 2</span><span style="color:#ABB2BF;"> ;;</span></span>
<span class="line"><span style="color:#E06C75;">        --ip</span><span style="color:#ABB2BF;">) </span><span style="color:#E06C75;">IP_ADDR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#56B6C2;">shift</span><span style="color:#D19A66;"> 2</span><span style="color:#ABB2BF;"> ;;</span></span>
<span class="line"><span style="color:#E06C75;">        --user</span><span style="color:#ABB2BF;">) </span><span style="color:#E06C75;">ADMIN_USER</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#56B6C2;">shift</span><span style="color:#D19A66;"> 2</span><span style="color:#ABB2BF;"> ;;</span></span>
<span class="line"><span style="color:#E06C75;">        --ssh-port</span><span style="color:#ABB2BF;">) </span><span style="color:#E06C75;">SSH_PORT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#56B6C2;">shift</span><span style="color:#D19A66;"> 2</span><span style="color:#ABB2BF;"> ;;</span></span>
<span class="line"><span style="color:#ABB2BF;">        *) </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;未知参数: </span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#56B6C2;">exit</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;"> ;;</span></span>
<span class="line"><span style="color:#C678DD;">    esac</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$HOSTNAME</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ] || [ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$IP_ADDR</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;用法: </span><span style="color:#E06C75;font-style:italic;">$0</span><span style="color:#98C379;"> --hostname &lt;主机名&gt; --ip &lt;IP地址&gt; [--user &lt;用户名&gt;] [--ssh-port &lt;端口&gt;]&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;==========================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  服务器初始化&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  主机名: </span><span style="color:#E06C75;">$HOSTNAME</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  IP: </span><span style="color:#E06C75;">$IP_ADDR</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  管理用户: </span><span style="color:#E06C75;">$ADMIN_USER</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  SSH端口: </span><span style="color:#E06C75;">$SSH_PORT</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;==========================================&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 1. 系统更新 =====</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; [1/9] 系统更新...&quot;</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> apt</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    apt</span><span style="color:#98C379;"> update</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> upgrade</span><span style="color:#D19A66;"> -y</span></span>
<span class="line"><span style="color:#61AFEF;">    apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> curl</span><span style="color:#98C379;"> wget</span><span style="color:#98C379;"> vim</span><span style="color:#98C379;"> htop</span><span style="color:#98C379;"> net-tools</span><span style="color:#98C379;"> tmux</span><span style="color:#98C379;"> tree</span><span style="color:#98C379;"> jq</span><span style="color:#98C379;"> rsync</span><span style="color:#98C379;"> unzip</span><span style="color:#98C379;"> ca-certificates</span></span>
<span class="line"><span style="color:#C678DD;">elif</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> dnf</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    dnf</span><span style="color:#98C379;"> update</span><span style="color:#D19A66;"> -y</span></span>
<span class="line"><span style="color:#61AFEF;">    dnf</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> curl</span><span style="color:#98C379;"> wget</span><span style="color:#98C379;"> vim</span><span style="color:#98C379;"> htop</span><span style="color:#98C379;"> net-tools</span><span style="color:#98C379;"> tmux</span><span style="color:#98C379;"> tree</span><span style="color:#98C379;"> jq</span><span style="color:#98C379;"> rsync</span><span style="color:#98C379;"> unzip</span><span style="color:#98C379;"> ca-certificates</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 2. 主机名 =====</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; [2/9] 设置主机名...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">hostnamectl</span><span style="color:#98C379;"> set-hostname</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$HOSTNAME</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 3. 用户创建 =====</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; [3/9] 创建管理用户...&quot;</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#61AFEF;">id</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$ADMIN_USER</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    useradd</span><span style="color:#D19A66;"> -m</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> /bin/bash</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$ADMIN_USER</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 设置随机密码</span></span>
<span class="line"><span style="color:#E06C75;">    RANDOM_PASS</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">openssl</span><span style="color:#98C379;"> rand</span><span style="color:#D19A66;"> -base64</span><span style="color:#D19A66;"> 16</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$ADMIN_USER</span><span style="color:#98C379;">:</span><span style="color:#E06C75;">$RANDOM_PASS</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">chpasswd</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;管理用户密码: </span><span style="color:#E06C75;">$RANDOM_PASS</span><span style="color:#98C379;">（请妥善保管后删除此记录）&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># sudo 权限</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> apt</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    usermod</span><span style="color:#D19A66;"> -aG</span><span style="color:#98C379;"> sudo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$ADMIN_USER</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">elif</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> dnf</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    usermod</span><span style="color:#D19A66;"> -aG</span><span style="color:#98C379;"> wheel</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$ADMIN_USER</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 4. SSH 加固 =====</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; [4/9] SSH 加固...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">cp</span><span style="color:#98C379;"> /etc/ssh/sshd_config</span><span style="color:#98C379;"> /etc/ssh/sshd_config.bak.</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改 SSH 配置</span></span>
<span class="line"><span style="color:#61AFEF;">sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;s/^#*Port .*/Port </span><span style="color:#E06C75;">$SSH_PORT</span><span style="color:#98C379;">/&quot;</span><span style="color:#98C379;"> /etc/ssh/sshd_config</span></span>
<span class="line"><span style="color:#61AFEF;">sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/^#*PermitRootLogin .*/PermitRootLogin no/&#39;</span><span style="color:#98C379;"> /etc/ssh/sshd_config</span></span>
<span class="line"><span style="color:#61AFEF;">sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/^#*PasswordAuthentication .*/PasswordAuthentication no/&#39;</span><span style="color:#98C379;"> /etc/ssh/sshd_config</span></span>
<span class="line"><span style="color:#61AFEF;">sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/^#*PubkeyAuthentication .*/PubkeyAuthentication yes/&#39;</span><span style="color:#98C379;"> /etc/ssh/sshd_config</span></span>
<span class="line"><span style="color:#61AFEF;">sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/^#*MaxAuthTries .*/MaxAuthTries 3/&#39;</span><span style="color:#98C379;"> /etc/ssh/sshd_config</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 5. 防火墙 =====</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; [5/9] 防火墙配置...&quot;</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> ufw</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    ufw</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> deny</span><span style="color:#98C379;"> incoming</span></span>
<span class="line"><span style="color:#61AFEF;">    ufw</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> outgoing</span></span>
<span class="line"><span style="color:#61AFEF;">    ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$SSH_PORT</span><span style="color:#98C379;">&quot;/tcp</span><span style="color:#98C379;"> comment</span><span style="color:#98C379;"> &#39;SSH&#39;</span></span>
<span class="line"><span style="color:#61AFEF;">    ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> 80/tcp</span><span style="color:#98C379;"> comment</span><span style="color:#98C379;"> &#39;HTTP&#39;</span></span>
<span class="line"><span style="color:#61AFEF;">    ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> 443/tcp</span><span style="color:#98C379;"> comment</span><span style="color:#98C379;"> &#39;HTTPS&#39;</span></span>
<span class="line"><span style="color:#61AFEF;">    ufw</span><span style="color:#D19A66;"> --force</span><span style="color:#98C379;"> enable</span></span>
<span class="line"><span style="color:#C678DD;">elif</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> firewalld</span></span>
<span class="line"><span style="color:#61AFEF;">    firewall-cmd</span><span style="color:#D19A66;"> --permanent</span><span style="color:#D19A66;"> --add-port=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$SSH_PORT</span><span style="color:#98C379;">&quot;</span><span style="color:#D19A66;">/tcp</span></span>
<span class="line"><span style="color:#61AFEF;">    firewall-cmd</span><span style="color:#D19A66;"> --permanent</span><span style="color:#D19A66;"> --add-service=http</span></span>
<span class="line"><span style="color:#61AFEF;">    firewall-cmd</span><span style="color:#D19A66;"> --permanent</span><span style="color:#D19A66;"> --add-service=https</span></span>
<span class="line"><span style="color:#61AFEF;">    firewall-cmd</span><span style="color:#D19A66;"> --reload</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 6. 时间同步 =====</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; [6/9] 时间同步...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">timedatectl</span><span style="color:#98C379;"> set-timezone</span><span style="color:#98C379;"> Asia/Shanghai</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> apt</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> chrony</span></span>
<span class="line"><span style="color:#C678DD;">elif</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> dnf</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    dnf</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> chrony</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> chronyd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 7. 内核调优 =====</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; [7/9] 内核参数调优...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/sysctl.d/99-production.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;SYSCTL&#39;</span></span>
<span class="line"><span style="color:#98C379;">net.core.somaxconn = 65535</span></span>
<span class="line"><span style="color:#98C379;">net.ipv4.tcp_tw_reuse = 1</span></span>
<span class="line"><span style="color:#98C379;">net.ipv4.tcp_fin_timeout = 15</span></span>
<span class="line"><span style="color:#98C379;">net.ipv4.tcp_keepalive_time = 600</span></span>
<span class="line"><span style="color:#98C379;">net.ipv4.tcp_max_syn_backlog = 65535</span></span>
<span class="line"><span style="color:#98C379;">net.ipv4.tcp_syncookies = 1</span></span>
<span class="line"><span style="color:#98C379;">net.ipv4.ip_local_port_range = 1024 65535</span></span>
<span class="line"><span style="color:#98C379;">vm.swappiness = 1</span></span>
<span class="line"><span style="color:#98C379;">fs.file-max = 1048576</span></span>
<span class="line"><span style="color:#98C379;">kernel.sysrq = 0</span></span>
<span class="line"><span style="color:#98C379;">kernel.randomize_va_space = 2</span></span>
<span class="line"><span style="color:#ABB2BF;">SYSCTL</span></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /etc/sysctl.d/99-production.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 文件描述符</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/security/limits.d/99-nofile.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">* soft nofile 65535</span></span>
<span class="line"><span style="color:#98C379;">* hard nofile 65535</span></span>
<span class="line"><span style="color:#98C379;">root soft nofile 1048576</span></span>
<span class="line"><span style="color:#98C379;">root hard nofile 1048576</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 8. 自动安全更新 =====</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; [8/9] 自动安全更新...&quot;</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> apt</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> unattended-upgrades</span></span>
<span class="line"><span style="color:#61AFEF;">    cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/apt/apt.conf.d/20auto-upgrades</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">APT::Periodic::Update-Package-Lists &quot;1&quot;;</span></span>
<span class="line"><span style="color:#98C379;">APT::Periodic::Unattended-Upgrade &quot;1&quot;;</span></span>
<span class="line"><span style="color:#98C379;">APT::Periodic::Download-Upgradeable-Packages &quot;1&quot;;</span></span>
<span class="line"><span style="color:#98C379;">APT::Periodic::AutocleanInterval &quot;7&quot;;</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#C678DD;">elif</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> dnf</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    dnf</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> dnf-automatic</span></span>
<span class="line"><span style="color:#61AFEF;">    sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/^upgrade_type.*/upgrade_type = security/&#39;</span><span style="color:#98C379;"> /etc/dnf/automatic.conf</span></span>
<span class="line"><span style="color:#61AFEF;">    sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/^apply_updates.*/apply_updates = yes/&#39;</span><span style="color:#98C379;"> /etc/dnf/automatic.conf</span></span>
<span class="line"><span style="color:#61AFEF;">    systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> dnf-automatic.timer</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 9. 日志配置 =====</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&gt;&gt;&gt; [9/9] 日志配置...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /etc/systemd/journald.conf.d</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/systemd/journald.conf.d/99-production.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">[Journal]</span></span>
<span class="line"><span style="color:#98C379;">Storage=persistent</span></span>
<span class="line"><span style="color:#98C379;">SystemMaxUse=2G</span></span>
<span class="line"><span style="color:#98C379;">MaxRetentionSec=30day</span></span>
<span class="line"><span style="color:#98C379;">ForwardToSyslog=yes</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> systemd-journald</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;==========================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  初始化完成！&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;==========================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  ⚠️  下一步操作：&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  1. 将你的 SSH 公钥添加到 /home/</span><span style="color:#E06C75;">$ADMIN_USER</span><span style="color:#98C379;">/.ssh/authorized_keys&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  2. 测试密钥登录: ssh -p </span><span style="color:#E06C75;">$SSH_PORT</span><span style="color:#E06C75;"> $ADMIN_USER</span><span style="color:#98C379;">@</span><span style="color:#E06C75;">$IP_ADDR</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  3. 确认密钥登录成功后，重启 SSH 服务: systemctl restart sshd&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  4. 运行安全基线检查脚本验证&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  ⚠️  请勿关闭当前会话，直到确认新 SSH 登录可用！&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-ansible-自动化初始化" tabindex="-1"><a class="header-anchor" href="#_10-2-ansible-自动化初始化"><span>10.2 Ansible 自动化初始化</span></a></h3><p>Shell 脚本适合单机，管理多台服务器需要 Ansible 这样的配置管理工具。</p><p><strong>项目结构</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ansible-server-init/</span></span>
<span class="line"><span>├── inventory/</span></span>
<span class="line"><span>│   ├── production.yml</span></span>
<span class="line"><span>│   └── staging.yml</span></span>
<span class="line"><span>├── group_vars/</span></span>
<span class="line"><span>│   ├── all.yml</span></span>
<span class="line"><span>│   └── web_servers.yml</span></span>
<span class="line"><span>├── playbooks/</span></span>
<span class="line"><span>│   └── init.yml</span></span>
<span class="line"><span>├── roles/</span></span>
<span class="line"><span>│   ├── base/</span></span>
<span class="line"><span>│   ├── ssh/</span></span>
<span class="line"><span>│   ├── firewall/</span></span>
<span class="line"><span>│   ├── chrony/</span></span>
<span class="line"><span>│   ├── sysctl/</span></span>
<span class="line"><span>│   └── logging/</span></span>
<span class="line"><span>└── ansible.cfg</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>主 Playbook</strong></p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># playbooks/init.yml</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">服务器初始化与加固</span></span>
<span class="line"><span style="color:#E06C75;">  hosts</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">all</span></span>
<span class="line"><span style="color:#E06C75;">  become</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  serial</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span><span style="color:#7F848E;font-style:italic;">  # 滚动执行，每次2台</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  pre_tasks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">检查是否为受支持的系统</span></span>
<span class="line"><span style="color:#E06C75;">      assert</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        that</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">ansible_os_family in [&#39;Debian&#39;, &#39;RedHat&#39;]</span></span>
<span class="line"><span style="color:#E06C75;">        fail_msg</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;不支持的操作系统: {{ ansible_os_family }}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">收集系统信息</span></span>
<span class="line"><span style="color:#E06C75;">      setup</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  roles</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">role</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">base</span></span>
<span class="line"><span style="color:#E06C75;">      tags</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">base</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">role</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ssh</span></span>
<span class="line"><span style="color:#E06C75;">      tags</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">ssh</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">role</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">firewall</span></span>
<span class="line"><span style="color:#E06C75;">      tags</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">firewall</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">role</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">chrony</span></span>
<span class="line"><span style="color:#E06C75;">      tags</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">chrony</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">role</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">sysctl</span></span>
<span class="line"><span style="color:#E06C75;">      tags</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">sysctl</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">role</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">logging</span></span>
<span class="line"><span style="color:#E06C75;">      tags</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">logging</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  post_tasks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">初始化完成通知</span></span>
<span class="line"><span style="color:#E06C75;">      debug</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        msg</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;服务器 {{ inventory_hostname }} 初始化完成&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>SSH 加固 Role</strong></p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># roles/ssh/defaults/main.yml</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#E06C75;">ssh_port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2222</span></span>
<span class="line"><span style="color:#E06C75;">ssh_permit_root_login</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;no&quot;</span></span>
<span class="line"><span style="color:#E06C75;">ssh_password_authentication</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;no&quot;</span></span>
<span class="line"><span style="color:#E06C75;">ssh_pubkey_authentication</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;yes&quot;</span></span>
<span class="line"><span style="color:#E06C75;">ssh_max_auth_tries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">ssh_client_alive_interval</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">300</span></span>
<span class="line"><span style="color:#E06C75;">ssh_client_alive_count_max</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#E06C75;">ssh_admin_user</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;deployadmin&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># roles/ssh/tasks/main.yml</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">创建管理用户</span></span>
<span class="line"><span style="color:#E06C75;">  ansible.builtin.user</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ ssh_admin_user }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    shell</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/bin/bash</span></span>
<span class="line"><span style="color:#E06C75;">    groups</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ &#39;sudo&#39; if ansible_os_family == &#39;Debian&#39; else &#39;wheel&#39; }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    append</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">部署 SSH 公钥</span></span>
<span class="line"><span style="color:#E06C75;">  ansible.posix.authorized_key</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    user</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ ssh_admin_user }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    key</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ lookup(&#39;file&#39;, item) }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  loop</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ ssh_authorized_keys }}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">部署 sshd 配置</span></span>
<span class="line"><span style="color:#E06C75;">  ansible.builtin.template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    src</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">sshd_config.j2</span></span>
<span class="line"><span style="color:#E06C75;">    dest</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/etc/ssh/sshd_config</span></span>
<span class="line"><span style="color:#E06C75;">    owner</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">root</span></span>
<span class="line"><span style="color:#E06C75;">    group</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">root</span></span>
<span class="line"><span style="color:#E06C75;">    mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;0600&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    validate</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;/usr/sbin/sshd -t -f %s&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    backup</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  notify</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Restart sshd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">确保 sshd 服务已启用</span></span>
<span class="line"><span style="color:#E06C75;">  ansible.builtin.service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">sshd</span></span>
<span class="line"><span style="color:#E06C75;">    state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">started</span></span>
<span class="line"><span style="color:#E06C75;">    enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-jinja2 line-numbers-mode" data-highlighter="shiki" data-ext="jinja2" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-jinja2"><span class="line"><span>{# roles/ssh/templates/sshd_config.j2 #}</span></span>
<span class="line"><span># 由 Ansible 管理，请勿手动修改</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Port {{ ssh_port }}</span></span>
<span class="line"><span>AddressFamily inet</span></span>
<span class="line"><span>PermitRootLogin {{ ssh_permit_root_login }}</span></span>
<span class="line"><span>PubkeyAuthentication {{ ssh_pubkey_authentication }}</span></span>
<span class="line"><span>PasswordAuthentication {{ ssh_password_authentication }}</span></span>
<span class="line"><span>PermitEmptyPasswords no</span></span>
<span class="line"><span>MaxAuthTries {{ ssh_max_auth_tries }}</span></span>
<span class="line"><span>ClientAliveInterval {{ ssh_client_alive_interval }}</span></span>
<span class="line"><span>ClientAliveCountMax {{ ssh_client_alive_count_max }}</span></span>
<span class="line"><span>X11Forwarding no</span></span>
<span class="line"><span>AllowUsers {{ ssh_admin_user }}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># roles/ssh/handlers/main.yml</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Restart sshd</span></span>
<span class="line"><span style="color:#E06C75;">  ansible.builtin.service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">sshd</span></span>
<span class="line"><span style="color:#E06C75;">    state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">restarted</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>sysctl Role</strong></p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># roles/sysctl/defaults/main.yml</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#E06C75;">sysctl_config</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  net.core.somaxconn</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">65535</span></span>
<span class="line"><span style="color:#E06C75;">  net.ipv4.tcp_tw_reuse</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1</span></span>
<span class="line"><span style="color:#E06C75;">  net.ipv4.tcp_fin_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">15</span></span>
<span class="line"><span style="color:#E06C75;">  net.ipv4.tcp_keepalive_time</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">600</span></span>
<span class="line"><span style="color:#E06C75;">  net.ipv4.tcp_max_syn_backlog</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">65535</span></span>
<span class="line"><span style="color:#E06C75;">  net.ipv4.tcp_syncookies</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1</span></span>
<span class="line"><span style="color:#E06C75;">  net.ipv4.ip_local_port_range</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1024 65535&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  net.ipv4.conf.all.accept_redirects</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#E06C75;">  net.ipv4.conf.default.accept_redirects</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#E06C75;">  vm.swappiness</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1</span></span>
<span class="line"><span style="color:#E06C75;">  fs.file-max</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1048576</span></span>
<span class="line"><span style="color:#E06C75;">  kernel.sysrq</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#E06C75;">  kernel.randomize_va_space</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># roles/sysctl/tasks/main.yml</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">部署 sysctl 配置</span></span>
<span class="line"><span style="color:#E06C75;">  ansible.posix.sysctl</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ item.key }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ item.value }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    sysctl_set</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">present</span></span>
<span class="line"><span style="color:#E06C75;">    reload</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  loop</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ sysctl_config | dict2items }}&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>执行 Ansible</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 检查模式（dry-run）</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> inventory/production.yml</span><span style="color:#98C379;"> playbooks/init.yml</span><span style="color:#D19A66;"> --check</span><span style="color:#D19A66;"> --diff</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 执行（限速，防止同时修改所有服务器）</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> inventory/production.yml</span><span style="color:#98C379;"> playbooks/init.yml</span><span style="color:#D19A66;"> --forks</span><span style="color:#D19A66;"> 5</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 仅执行 SSH 角色</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> inventory/production.yml</span><span style="color:#98C379;"> playbooks/init.yml</span><span style="color:#D19A66;"> --tags</span><span style="color:#98C379;"> ssh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 限制目标主机</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> inventory/production.yml</span><span style="color:#98C379;"> playbooks/init.yml</span><span style="color:#D19A66;"> --limit</span><span style="color:#98C379;"> web-prod-01</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">Ansible 最佳实践</p><ol><li><strong>始终使用 <code>--check --diff</code> 先预检</strong>——看到变更内容再执行</li><li><strong><code>serial</code> 控制滚动批次</strong>——避免同时修改所有服务器</li><li><strong><code>validate</code> 指令</strong>——在修改配置前验证语法（如 sshd -t）</li><li><strong><code>backup: true</code></strong>——自动备份被修改的文件</li><li><strong>使用角色（Role）组织</strong>——每个功能模块独立，可单独执行</li></ol></div><h3 id="_10-3-ansible-vs-shell-初始化对比" tabindex="-1"><a class="header-anchor" href="#_10-3-ansible-vs-shell-初始化对比"><span>10.3 Ansible vs Shell 初始化对比</span></a></h3><table><thead><tr><th>特性</th><th>Shell 脚本</th><th>Ansible</th></tr></thead><tbody><tr><td>适用场景</td><td>单机初始化</td><td>批量管理</td></tr><tr><td>幂等性</td><td>需要自己实现</td><td>内置保证</td></tr><tr><td>可维护性</td><td>大脚本难维护</td><td>角色化、模块化</td></tr><tr><td>报告</td><td>echo 输出</td><td>结构化输出</td></tr><tr><td>回滚</td><td>需要手动处理</td><td>可用 <code>--diff</code> 预检</td></tr><tr><td>学习成本</td><td>低</td><td>中</td></tr><tr><td>依赖</td><td>仅需 bash</td><td>需要 Python + Ansible</td></tr></tbody></table>`,40),i(f,{code:`eJxLy8kvT85ILCpRCHHhUgACx+hnc3qfdi18OnPFs6kbXrb3xyro6topOFXb2Jo+7d9gXwtW5QQSrHk2Y32NgnN0cEZqTo7Ci5ZZz+asebFt89Ml82ORFD2dsKxGwQWo3cgAod8Fod8Vql9b4fm6hqe9UxWcfSHaIWrA2t2iHfOKM5NyUvUDSgsKUkv0gxNzSmK5wMqcwe5zj362ecWzlv6nO5uer+181rAcYoYrWNIj+mXDhGdrl77Y3/h8+e6nHRsUoMZBFLmBFXlGP21d8XLuopetvc/3rnu+buHzCW1QK4pLKnNSgd5Jy8zJsVJOS0uzTDZBknBBlQAAkp2Eow==`}),s[9]||=n(`<h2 id="十一、初始化后的验证清单" tabindex="-1"><a class="header-anchor" href="#十一、初始化后的验证清单"><span>十一、初始化后的验证清单</span></a></h2><p>所有配置完成后，使用以下清单逐项验证：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># post_init_verify.sh - 初始化后验证清单</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;========== 服务器初始化验证 ==========&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;主机: $(</span><span style="color:#61AFEF;">hostname</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 系统信息</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 系统信息 ---&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;OS: $(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /etc/os-release </span><span style="color:#ABB2BF;">|</span><span style="color:#61AFEF;"> grep</span><span style="color:#98C379;"> PRETTY_NAME </span><span style="color:#ABB2BF;">|</span><span style="color:#61AFEF;"> cut</span><span style="color:#D19A66;"> -d=</span><span style="color:#D19A66;"> -f2</span><span style="color:#ABB2BF;"> |</span><span style="color:#61AFEF;"> tr</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> &#39;\\&quot;&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;内核: $(</span><span style="color:#61AFEF;">uname</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;运行时间: $(</span><span style="color:#61AFEF;">uptime</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 网络</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 网络 ---&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;IP: $(</span><span style="color:#61AFEF;">hostname</span><span style="color:#D19A66;"> -I</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;网关: $(</span><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route </span><span style="color:#ABB2BF;">|</span><span style="color:#61AFEF;"> grep</span><span style="color:#98C379;"> default </span><span style="color:#ABB2BF;">|</span><span style="color:#61AFEF;"> awk</span><span style="color:#98C379;"> &#39;{print $3}&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;DNS: $(</span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nameserver /etc/resolv.conf </span><span style="color:#ABB2BF;">|</span><span style="color:#61AFEF;"> head</span><span style="color:#D19A66;"> -2</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. SSH</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- SSH ---&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;监听端口: $(</span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> ^Port /etc/ssh/sshd_config)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Root登录: $(</span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> ^PermitRootLogin /etc/ssh/sshd_config)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;密码认证: $(</span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> ^PasswordAuthentication /etc/ssh/sshd_config)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;管理用户: $(</span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> ^AllowUsers /etc/ssh/sshd_config)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 防火墙</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 防火墙 ---&quot;</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> ufw</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    ufw</span><span style="color:#98C379;"> status</span></span>
<span class="line"><span style="color:#C678DD;">elif</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    firewall-cmd</span><span style="color:#D19A66;"> --state</span></span>
<span class="line"><span style="color:#61AFEF;">    firewall-cmd</span><span style="color:#D19A66;"> --list-all</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 时间</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 时间同步 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">timedatectl</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -E</span><span style="color:#98C379;"> &quot;Time zone|NTP synchronized|Local time&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">chronyc</span><span style="color:#98C379;"> tracking</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -E</span><span style="color:#98C379;"> &quot;Reference ID|Stratum|Last offset&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 资源限制</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 资源限制 ---&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;文件描述符(软): $(</span><span style="color:#56B6C2;">ulimit</span><span style="color:#D19A66;"> -Sn</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;文件描述符(硬): $(</span><span style="color:#56B6C2;">ulimit</span><span style="color:#D19A66;"> -Hn</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;系统文件句柄上限: $(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/sys/fs/file-max)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;当前使用文件句柄: $(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/sys/fs/file-nr </span><span style="color:#ABB2BF;">|</span><span style="color:#61AFEF;"> awk</span><span style="color:#98C379;"> &#39;{print $1}&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 7. 内核参数</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 关键内核参数 ---&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;somaxconn: $(</span><span style="color:#61AFEF;">sysctl</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> net.core.somaxconn)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;swappiness: $(</span><span style="color:#61AFEF;">sysctl</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> vm.swappiness)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;tcp_tw_reuse: $(</span><span style="color:#61AFEF;">sysctl</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> net.ipv4.tcp_tw_reuse)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 8. 服务状态</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 关键服务状态 ---&quot;</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> svc</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> sshd</span><span style="color:#98C379;"> chronyd</span><span style="color:#98C379;"> rsyslog</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> systemctl</span><span style="color:#98C379;"> is-active</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$svc</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> &amp;&gt;/dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  </span><span style="color:#E06C75;">$svc</span><span style="color:#98C379;">: running&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  </span><span style="color:#E06C75;">$svc</span><span style="color:#98C379;">: STOPPED&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;========== 验证完毕 ==========&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十二、持续安全维护" tabindex="-1"><a class="header-anchor" href="#十二、持续安全维护"><span>十二、持续安全维护</span></a></h2><p>初始化只是起点，服务器安全需要持续维护：</p><table><thead><tr><th>频率</th><th>任务</th><th>说明</th></tr></thead><tbody><tr><td>每日</td><td>检查安全更新</td><td>unattended-upgrades 日志</td></tr><tr><td>每周</td><td>审查登录日志</td><td><code>last</code>, <code>lastb</code>, <code>journalctl -u sshd</code></td></tr><tr><td>每周</td><td>检查监听端口</td><td><code>ss -tlnp</code> 确认无异常端口</td></tr><tr><td>每月</td><td>审计 sudo 使用</td><td>检查 <code>/var/log/auth.log</code></td></tr><tr><td>每月</td><td>防火墙规则审查</td><td>确认无冗余规则</td></tr><tr><td>每季度</td><td>安全基线复查</td><td>运行基线检查脚本</td></tr><tr><td>每季度</td><td>SSH 密钥审计</td><td>移除离职人员的公钥</td></tr><tr><td>每半年</td><td>灾备演练</td><td>验证备份可恢复</td></tr></tbody></table><div class="hint-container important"><p class="hint-container-title">安全是过程，不是状态</p><p>服务器安全没有&quot;完成&quot;的一天。新的漏洞每天都在被发现，新的攻击手法层出不穷。初始化建立了安全基线，持续的维护和审计才能保持安全水位。</p></div><h2 id="参考资源" tabindex="-1"><a class="header-anchor" href="#参考资源"><span>参考资源</span></a></h2><ul><li><a href="https://www.cisecurity.org/cis-benchmarks/" target="_blank" rel="noopener noreferrer">CIS Benchmarks</a> - 系统安全基线标准</li><li><a href="https://infosec.mozilla.org/guidelines/openssh" target="_blank" rel="noopener noreferrer">Mozilla InfoSec SSH Guidelines</a> - SSH 加固参考</li><li><a href="https://ubuntu.com/security" target="_blank" rel="noopener noreferrer">Ubuntu Security Guide</a> - Ubuntu 安全指南</li><li><a href="https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/security_hardening" target="_blank" rel="noopener noreferrer">Red Hat Security Guide</a> - RHEL 安全加固</li><li><a href="https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html" target="_blank" rel="noopener noreferrer">Ansible Best Practices</a> - Ansible 最佳实践</li><li><a href="https://chrony-project.org/faq.html" target="_blank" rel="noopener noreferrer">Chrony FAQ</a> - 时间同步常见问题</li></ul>`,9)])}var u=o(c,[[`render`,l]]);export{s as _pageData,u as default};