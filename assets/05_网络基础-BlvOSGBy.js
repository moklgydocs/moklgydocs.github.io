import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-C6qeRBA8.js";var o=JSON.parse(`{"path":"/Linux/01_Linux%E5%9F%BA%E7%A1%80/05_%E7%BD%91%E7%BB%9C%E5%9F%BA%E7%A1%80.html","title":"网络基础","lang":"zh-CN","frontmatter":{"title":"网络基础","icon":"fa6-solid:network-wired","order":5,"category":["Linux基础"],"tag":["网络","IP配置","路由","DNS","防火墙","SSH","网络诊断"]},"git":{"createdTime":1780586585000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":22.51,"words":6754},"filePathRelative":"Linux/01_Linux基础/05_网络基础.md"}`),s={name:`05_网络基础.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="网络基础" tabindex="-1"><a class="header-anchor" href="#网络基础"><span>网络基础</span></a></h1><p>Linux 天生为网络而生——从最初的 TCP/IP 协议栈实现到如今承载全球互联网基础设施，网络能力是 Linux 最核心的竞争力之一。本文从网络接口配置到路由转发，从 DNS 解析到防火墙策略，从 SSH 安全远程到网络诊断工具链，构建完整的 Linux 网络知识体系。</p><h2 id="_1-网络接口配置" tabindex="-1"><a class="header-anchor" href="#_1-网络接口配置"><span>1. 网络接口配置</span></a></h2><h3 id="_1-1-网络接口命名" tabindex="-1"><a class="header-anchor" href="#_1-1-网络接口命名"><span>1.1 网络接口命名</span></a></h3><p>Linux 网络接口的命名经历了从传统命名到一致性命名的演变：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 传统命名（内核自动分配）</span></span>
<span class="line"><span style="color:#61AFEF;">eth0</span><span style="color:#7F848E;font-style:italic;">        # 第一块以太网卡</span></span>
<span class="line"><span style="color:#61AFEF;">eth1</span><span style="color:#7F848E;font-style:italic;">        # 第二块以太网卡</span></span>
<span class="line"><span style="color:#61AFEF;">wlan0</span><span style="color:#7F848E;font-style:italic;">       # 第一块无线网卡</span></span>
<span class="line"><span style="color:#61AFEF;">lo</span><span style="color:#7F848E;font-style:italic;">          # 回环接口</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 一致性命名（systemd/udev，CentOS 7+/Ubuntu 16.04+）</span></span>
<span class="line"><span style="color:#61AFEF;">enp3s0</span><span style="color:#7F848E;font-style:italic;">      # en=以太网, p3=PCI总线3, s0=插槽0</span></span>
<span class="line"><span style="color:#61AFEF;">ens33</span><span style="color:#7F848E;font-style:italic;">       # en=以太网, s33=热插拔插槽33</span></span>
<span class="line"><span style="color:#61AFEF;">enx001122334455</span><span style="color:#7F848E;font-style:italic;">  # en=以太网, x=MAC地址</span></span>
<span class="line"><span style="color:#61AFEF;">wlp2s0</span><span style="color:#7F848E;font-style:italic;">      # wl=无线, p2=PCI总线2, s0=插槽0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 命名规则</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 前缀：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   en - 以太网 (Ethernet)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   wl - 无线局域网 (WLAN)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   ww - 无线广域网 (WWAN)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 后缀：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   pXsY - PCI 总线/插槽</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   sY   - 热插拔插槽</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   xMAC - MAC 地址</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   oN   - 板载设备索引</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">恢复传统命名</p><p>如果你更喜欢 eth0 这种命名方式：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 编辑 GRUB 配置</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> vim</span><span style="color:#98C379;"> /etc/default/grub</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 GRUB_CMDLINE_LINUX 中添加：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># net.ifnames=0 biosdevname=0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> update-grub</span><span style="color:#7F848E;font-style:italic;">    # Ubuntu</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> grub2-mkconfig</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> /boot/grub2/grub.cfg</span><span style="color:#7F848E;font-style:italic;">   # CentOS</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> reboot</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div><h3 id="_1-2-ip-命令-现代工具" tabindex="-1"><a class="header-anchor" href="#_1-2-ip-命令-现代工具"><span>1.2 ip 命令（现代工具）</span></a></h3><p><code>ip</code> 命令来自 iproute2 包，是 <code>ifconfig</code> 的现代替代品：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 查看接口 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 列出所有接口</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> show</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> eth0</span><span style="color:#7F848E;font-style:italic;">            # 查看指定接口</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 列出 IP 地址</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> show</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#D19A66;"> -4</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> show</span><span style="color:#7F848E;font-style:italic;">              # 只看 IPv4</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#D19A66;"> -6</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> show</span><span style="color:#7F848E;font-style:italic;">              # 只看 IPv6</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 简写形式</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> a</span><span style="color:#7F848E;font-style:italic;">                         # = ip addr show</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> l</span><span style="color:#7F848E;font-style:italic;">                         # = ip link show</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 配置 IP =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加 IP 地址（临时，重启失效）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 192.168.1.100/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加多个 IP（别名）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 192.168.1.101/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除 IP 地址</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> del</span><span style="color:#98C379;"> 192.168.1.100/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 启用/禁用接口 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> eth0</span><span style="color:#98C379;"> up</span><span style="color:#7F848E;font-style:italic;">      # 启用</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> eth0</span><span style="color:#98C379;"> down</span><span style="color:#7F848E;font-style:italic;">    # 禁用</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 修改 MTU =====</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> eth0</span><span style="color:#98C379;"> mtu</span><span style="color:#D19A66;"> 9000</span><span style="color:#7F848E;font-style:italic;">   # 设置巨型帧（Jumbo Frame）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 修改 MAC 地址 =====</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> eth0</span><span style="color:#98C379;"> down</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> eth0</span><span style="color:#98C379;"> address</span><span style="color:#98C379;"> 00:11:22:33:44:55</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> eth0</span><span style="color:#98C379;"> up</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-ifconfig-传统工具" tabindex="-1"><a class="header-anchor" href="#_1-3-ifconfig-传统工具"><span>1.3 ifconfig（传统工具）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ifconfig 已被 ip 替代，但仍在广泛使用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装（如果未安装）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> net-tools</span><span style="color:#7F848E;font-style:italic;">    # Debian/Ubuntu</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看接口</span></span>
<span class="line"><span style="color:#61AFEF;">ifconfig</span></span>
<span class="line"><span style="color:#61AFEF;">ifconfig</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置 IP</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ifconfig</span><span style="color:#98C379;"> eth0</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#98C379;"> netmask</span><span style="color:#D19A66;"> 255.255.255.0</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ifconfig</span><span style="color:#98C379;"> eth0</span><span style="color:#98C379;"> 192.168.1.100/24</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启用/禁用</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ifconfig</span><span style="color:#98C379;"> eth0</span><span style="color:#98C379;"> up</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ifconfig</span><span style="color:#98C379;"> eth0</span><span style="color:#98C379;"> down</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改 MTU</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ifconfig</span><span style="color:#98C379;"> eth0</span><span style="color:#98C379;"> mtu</span><span style="color:#D19A66;"> 9000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看所有接口（包括禁用的）</span></span>
<span class="line"><span style="color:#61AFEF;">ifconfig</span><span style="color:#D19A66;"> -a</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-4-永久配置-ip" tabindex="-1"><a class="header-anchor" href="#_1-4-永久配置-ip"><span>1.4 永久配置 IP</span></a></h3><h4 id="ubuntu-netplan" tabindex="-1"><a class="header-anchor" href="#ubuntu-netplan"><span>Ubuntu（Netplan）</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/netplan/01-netcfg.yaml</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Netplan 是 Ubuntu 18.04+ 的默认网络配置工具</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DHCP 配置</span></span>
<span class="line"><span style="color:#61AFEF;">network:</span></span>
<span class="line"><span style="color:#61AFEF;">  version:</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#61AFEF;">  ethernets:</span></span>
<span class="line"><span style="color:#61AFEF;">    eth0:</span></span>
<span class="line"><span style="color:#61AFEF;">      dhcp4:</span><span style="color:#D19A66;"> true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 静态 IP 配置</span></span>
<span class="line"><span style="color:#61AFEF;">network:</span></span>
<span class="line"><span style="color:#61AFEF;">  version:</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#61AFEF;">  ethernets:</span></span>
<span class="line"><span style="color:#61AFEF;">    eth0:</span></span>
<span class="line"><span style="color:#61AFEF;">      addresses:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> 192.168.1.100/24</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> 2001:db8::100/64</span><span style="color:#7F848E;font-style:italic;">    # IPv6（可选）</span></span>
<span class="line"><span style="color:#61AFEF;">      routes:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> to:</span><span style="color:#98C379;"> default</span></span>
<span class="line"><span style="color:#61AFEF;">          via:</span><span style="color:#D19A66;"> 192.168.1.1</span></span>
<span class="line"><span style="color:#61AFEF;">      nameservers:</span></span>
<span class="line"><span style="color:#61AFEF;">        addresses:</span></span>
<span class="line"><span style="color:#61AFEF;">          -</span><span style="color:#D19A66;"> 8.8.8.8</span></span>
<span class="line"><span style="color:#61AFEF;">          -</span><span style="color:#D19A66;"> 8.8.4.4</span></span>
<span class="line"><span style="color:#61AFEF;">        search:</span></span>
<span class="line"><span style="color:#61AFEF;">          -</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"><span style="color:#61AFEF;">      mtu:</span><span style="color:#D19A66;"> 1500</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 双网卡配置</span></span>
<span class="line"><span style="color:#61AFEF;">network:</span></span>
<span class="line"><span style="color:#61AFEF;">  version:</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#61AFEF;">  ethernets:</span></span>
<span class="line"><span style="color:#61AFEF;">    eth0:</span><span style="color:#7F848E;font-style:italic;">                      # 外网</span></span>
<span class="line"><span style="color:#61AFEF;">      addresses:</span><span style="color:#ABB2BF;"> [203.0.113.10/24]</span></span>
<span class="line"><span style="color:#61AFEF;">      routes:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> to:</span><span style="color:#98C379;"> default</span></span>
<span class="line"><span style="color:#61AFEF;">          via:</span><span style="color:#D19A66;"> 203.0.113.1</span></span>
<span class="line"><span style="color:#61AFEF;">    eth1:</span><span style="color:#7F848E;font-style:italic;">                      # 内网</span></span>
<span class="line"><span style="color:#61AFEF;">      addresses:</span><span style="color:#ABB2BF;"> [10.0.0.1/24]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 应用配置</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> netplan</span><span style="color:#98C379;"> apply</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> netplan</span><span style="color:#98C379;"> try</span><span style="color:#7F848E;font-style:italic;">              # 试应用（自动回滚）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">Netplan 语法严格</p><p>YAML 对缩进敏感！使用空格而非 Tab。建议修改后先用 <code>sudo netplan try</code> 测试，确认网络正常后再正式应用，否则可能 SSH 断连。</p></div><h4 id="centos-networkmanager-nmcli" tabindex="-1"><a class="header-anchor" href="#centos-networkmanager-nmcli"><span>CentOS（NetworkManager / nmcli）</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># nmcli - NetworkManager 命令行接口</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看连接</span></span>
<span class="line"><span style="color:#61AFEF;">nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> show</span></span>
<span class="line"><span style="color:#61AFEF;">nmcli</span><span style="color:#98C379;"> device</span><span style="color:#98C379;"> status</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建静态 IP 连接</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> add</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    con-name</span><span style="color:#98C379;"> static-eth0</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ifname</span><span style="color:#98C379;"> eth0</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    type</span><span style="color:#98C379;"> ethernet</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ip4</span><span style="color:#98C379;"> 192.168.1.100/24</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    gw4</span><span style="color:#D19A66;"> 192.168.1.1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置 DNS</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> modify</span><span style="color:#98C379;"> static-eth0</span><span style="color:#98C379;"> ipv4.dns</span><span style="color:#98C379;"> &quot;8.8.8.8 8.8.4.4&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建 DHCP 连接</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> add</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    con-name</span><span style="color:#98C379;"> dhcp-eth0</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ifname</span><span style="color:#98C379;"> eth0</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    type</span><span style="color:#98C379;"> ethernet</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ipv4.method</span><span style="color:#98C379;"> auto</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启用/禁用连接</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> up</span><span style="color:#98C379;"> static-eth0</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> down</span><span style="color:#98C379;"> static-eth0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改 IP</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> modify</span><span style="color:#98C379;"> static-eth0</span><span style="color:#98C379;"> ipv4.addresses</span><span style="color:#98C379;"> 192.168.1.200/24</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看详细信息</span></span>
<span class="line"><span style="color:#61AFEF;">nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> static-eth0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或者直接编辑配置文件</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/sysconfig/network-scripts/ifcfg-eth0</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TYPE=Ethernet</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># BOOTPROTO=static</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># NAME=eth0</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DEVICE=eth0</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># IPADDR=192.168.1.100</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># NETMASK=255.255.255.0</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># GATEWAY=192.168.1.1</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DNS1=8.8.8.8</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DNS2=8.8.4.4</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ONBOOT=yes</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-5-dhcp-vs-静态-ip" tabindex="-1"><a class="header-anchor" href="#_1-5-dhcp-vs-静态-ip"><span>1.5 DHCP vs 静态 IP</span></a></h3><table><thead><tr><th>方式</th><th>优点</th><th>缺点</th><th>适用场景</th></tr></thead><tbody><tr><td><strong>DHCP</strong></td><td>自动配置、避免冲突</td><td>IP 可能变化、依赖 DHCP 服务器</td><td>桌面、开发机</td></tr><tr><td><strong>静态 IP</strong></td><td>地址固定、方便管理</td><td>需手动配置、需协调避免冲突</td><td>服务器、网络设备</td></tr></tbody></table><div class="hint-container important"><p class="hint-container-title">服务器必须用静态 IP</p><p>生产服务器使用 DHCP 是运维大忌——IP 变化会导致 DNS 解析失败、防火墙规则失效、集群通信中断。服务器必须配置静态 IP，并将 MAC 与 IP 绑定。</p></div><h2 id="_2-路由表" tabindex="-1"><a class="header-anchor" href="#_2-路由表"><span>2. 路由表</span></a></h2><h3 id="_2-1-路由基础" tabindex="-1"><a class="header-anchor" href="#_2-1-路由基础"><span>2.1 路由基础</span></a></h3><p>路由表决定了数据包从哪个接口、经过哪个网关发送出去。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看路由表</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> show</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># default via 192.168.1.1 dev eth0           # 默认路由</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100  # 直连路由</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 10.0.0.0/8 via 10.0.0.1 dev eth1           # 静态路由</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 旧方式（已弃用）</span></span>
<span class="line"><span style="color:#61AFEF;">route</span><span style="color:#D19A66;"> -n</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Kernel IP routing table</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Destination     Gateway         Genmask         Flags Metric Ref    Use Iface</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 0.0.0.0         192.168.1.1     0.0.0.0         UG    100    0        0 eth0</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 eth0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加路由</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 10.10.0.0/16</span><span style="color:#98C379;"> via</span><span style="color:#D19A66;"> 192.168.1.2</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth0</span><span style="color:#7F848E;font-style:italic;">    # 静态路由</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> via</span><span style="color:#D19A66;"> 192.168.1.1</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth0</span><span style="color:#7F848E;font-style:italic;">          # 默认网关</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除路由</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> del</span><span style="color:#98C379;"> 10.10.0.0/16</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改默认网关</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> replace</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> via</span><span style="color:#D19A66;"> 192.168.1.1</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看到某个目的地的路由</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> get</span><span style="color:#D19A66;"> 8.8.8.8</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 8.8.8.8 via 192.168.1.1 dev eth0 src 192.168.1.100 uid 1000</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     cache</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-路由匹配规则" tabindex="-1"><a class="header-anchor" href="#_2-2-路由匹配规则"><span>2.2 路由匹配规则</span></a></h3>`,26),i(d,{code:`eJyNksFLwlAcx+/9FY/XNXV7mxESnuwUmCw7iQeVjaLRYAkSLjBEUtgqQUnIUCK8pUaH1Cn9L7G3uVP/QtueyuySv9M7fD/f7+/73hNEqZA7zch5kIxtAWcSh8kUNJtDU+tjtbKflUNR66lvdm8jgKaCiAoyVJClYBoEAlHA0UWI1bFd0YyRbrYn88+B1Xj/mXY8zqcPMQhee/4c7ZKK2Roo4PggHqNTEN/X7dINrg7xYIwnDWtWx5UPmPbL8UNPARxapjkSS2+vp5lqDdc0a1qym1940jP0O/dQHVqdNyeamCHPbLUXFUIs2QL9s4UfdDl6l3DMphzB9gjFbkTZ5Zkx0khhpzxThLbemvdf12svralVSYZccLtGwsK+MGKwHraQP3YVEOOOEin4/awCY/SCp2UvIM7nC5J8Dk4uZD7jfJWsyDuox17mr0SevCIQzkQxso1QLhzmd3KSKMmRbUEQ/ujQBjp3i4WMF1hn/LJfCMQbNw==`}),o[1]||=n(`<p>路由匹配遵循<strong>最长前缀匹配</strong>原则：掩码越长（越具体）的路由优先级越高。</p><h3 id="_2-3-多网卡路由策略" tabindex="-1"><a class="header-anchor" href="#_2-3-多网卡路由策略"><span>2.3 多网卡路由策略</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 场景：双网卡服务器</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># eth0: 203.0.113.10/24 (外网，默认路由)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># eth1: 10.0.0.1/24 (内网)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 问题：从内网来的请求，回复从外网网卡出去（源地址不匹配）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 解决：策略路由</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 创建路由表</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;200 internal&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> /etc/iproute2/rt_tables</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 添加策略路由规则</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 10.0.0.0/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth1</span><span style="color:#98C379;"> src</span><span style="color:#D19A66;"> 10.0.0.1</span><span style="color:#98C379;"> table</span><span style="color:#98C379;"> internal</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> via</span><span style="color:#D19A66;"> 10.0.0.254</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> eth1</span><span style="color:#98C379;"> table</span><span style="color:#98C379;"> internal</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> rule</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> from</span><span style="color:#D19A66;"> 10.0.0.1</span><span style="color:#98C379;"> table</span><span style="color:#98C379;"> internal</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 验证</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> rule</span><span style="color:#98C379;"> show</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> table</span><span style="color:#98C379;"> internal</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 持久化（Netplan）</span></span>
<span class="line"><span style="color:#61AFEF;">network:</span></span>
<span class="line"><span style="color:#61AFEF;">  version:</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#61AFEF;">  ethernets:</span></span>
<span class="line"><span style="color:#61AFEF;">    eth0:</span></span>
<span class="line"><span style="color:#61AFEF;">      addresses:</span><span style="color:#ABB2BF;"> [203.0.113.10/24]</span></span>
<span class="line"><span style="color:#61AFEF;">      routes:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> to:</span><span style="color:#98C379;"> default</span></span>
<span class="line"><span style="color:#61AFEF;">          via:</span><span style="color:#D19A66;"> 203.0.113.1</span></span>
<span class="line"><span style="color:#61AFEF;">    eth1:</span></span>
<span class="line"><span style="color:#61AFEF;">      addresses:</span><span style="color:#ABB2BF;"> [10.0.0.1/24]</span></span>
<span class="line"><span style="color:#61AFEF;">      routes:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> to:</span><span style="color:#98C379;"> 0.0.0.0/0</span></span>
<span class="line"><span style="color:#61AFEF;">          via:</span><span style="color:#D19A66;"> 10.0.0.254</span></span>
<span class="line"><span style="color:#61AFEF;">          table:</span><span style="color:#D19A66;"> 200</span></span>
<span class="line"><span style="color:#61AFEF;">      routing-policy:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> from:</span><span style="color:#D19A66;"> 10.0.0.1</span></span>
<span class="line"><span style="color:#61AFEF;">          table:</span><span style="color:#D19A66;"> 200</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-ip-转发" tabindex="-1"><a class="header-anchor" href="#_2-4-ip-转发"><span>2.4 IP 转发</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Linux 默认不转发数据包（非路由器模式）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启用 IP 转发</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 临时启用</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.ipv4.ip_forward=</span><span style="color:#D19A66;">1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 永久启用</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;net.ipv4.ip_forward = 1&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> /etc/sysctl.d/99-ipforward.conf</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /etc/sysctl.d/99-ipforward.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证</span></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#98C379;"> net.ipv4.ip_forward</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># net.ipv4.ip_forward = 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/sys/net/ipv4/ip_forward</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># IPv6 转发</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.ipv6.conf.all.forwarding=</span><span style="color:#D19A66;">1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-dns-解析" tabindex="-1"><a class="header-anchor" href="#_3-dns-解析"><span>3. DNS 解析</span></a></h2><h3 id="_3-1-dns-解析流程" tabindex="-1"><a class="header-anchor" href="#_3-1-dns-解析流程"><span>3.1 DNS 解析流程</span></a></h3>`,7),i(d,{code:`eJxtkctOwkAYhfc+xYSVLihBiFEWJEQWmhBj1BcY2gGaQFvbIrrDuNG4QJEYjVy8xNAYCayMoujLOG15C2emtlba7jrn+8+cOb+GdqtI4lFWhEUVVuYA+RSo6iIvKlDSQUZRANQAHreslmEZp3jcCDA5MU+ZYlnM88DuP5jdM3xtBLBVyJcQBSWNF2LagaajihBVkSaX95AQwNdkTdcoHkM6HyvRvwCT3dj2CMeI42WpEEwo87BMSbP9jNsjOhdgtmRZZ8jtW6i+k8tSeXr3Yo37uNcLhTJVvcRMOkfYOGQIY0iN0XSaFJUCRaRDQVBFqSDPR2q1Gof2YUUpI5K8EllgNOEIzfpKAbP3aA/vrY8LPLhiKjuPunZm+wmfT75fB75JVp07OdsfE/3j5sknPh75xknqFLCH77hxGV6tg7FSU2Bab+JJ8/eumfc4NOUITwv2QnkqPWVpHDf7q4VvukxmjZNt4U79nw859mxm7yJawOxvF2FudGOeXVh8Cvg8VxJcfDnJLcaXuETS5+QWGqKTtuhFiuI9b33TjfIDYtBNSw==`}),o[2]||=n(`<h3 id="_3-2-etc-hosts-——-静态解析" tabindex="-1"><a class="header-anchor" href="#_3-2-etc-hosts-——-静态解析"><span>3.2 /etc/hosts —— 静态解析</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/hosts 格式</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># IP地址    主机名    别名</span></span>
<span class="line"><span style="color:#61AFEF;">127.0.0.1</span><span style="color:#98C379;">       localhost</span></span>
<span class="line"><span style="color:#56B6C2;">:</span><span style="color:#98C379;">:1</span><span style="color:#98C379;">             localhost</span><span style="color:#98C379;"> ip6-localhost</span></span>
<span class="line"><span style="color:#61AFEF;">192.168.1.100</span><span style="color:#98C379;">   webserver.example.com</span><span style="color:#98C379;"> webserver</span></span>
<span class="line"><span style="color:#61AFEF;">10.0.0.1</span><span style="color:#98C379;">        db1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改 hosts 立即生效（无需重启）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优先级高于 DNS（由 /etc/nsswitch.conf 控制）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 nsswitch.conf 中的解析顺序</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> hosts</span><span style="color:#98C379;"> /etc/nsswitch.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># hosts: files dns myhostname</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># files = /etc/hosts</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># dns = DNS 查询</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># myhostname = systemd 的本地主机名解析</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-etc-resolv-conf-——-dns-服务器配置" tabindex="-1"><a class="header-anchor" href="#_3-3-etc-resolv-conf-——-dns-服务器配置"><span>3.3 /etc/resolv.conf —— DNS 服务器配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/resolv.conf 格式</span></span>
<span class="line"><span style="color:#61AFEF;">nameserver</span><span style="color:#D19A66;"> 8.8.8.8</span></span>
<span class="line"><span style="color:#61AFEF;">nameserver</span><span style="color:#D19A66;"> 8.8.4.4</span></span>
<span class="line"><span style="color:#61AFEF;">search</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"><span style="color:#61AFEF;">domain</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"><span style="color:#61AFEF;">options</span><span style="color:#98C379;"> timeout:2</span><span style="color:#98C379;"> attempts:3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 常见 DNS 服务器</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Google:     8.8.8.8, 8.8.4.4</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Cloudflare: 1.1.1.1, 1.0.0.1</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 阿里:        223.5.5.5, 223.6.6.6</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 腾讯:        119.29.29.29</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：/etc/resolv.conf 可能被自动覆盖</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># systemd-resolved</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># NetworkManager</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># dhclient</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 防止覆盖的方法</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法1：使用 chattr 不可变属性</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chattr</span><span style="color:#98C379;"> +i</span><span style="color:#98C379;"> /etc/resolv.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法2：配置 systemd-resolved</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ln</span><span style="color:#D19A66;"> -sf</span><span style="color:#98C379;"> /run/systemd/resolve/resolv.conf</span><span style="color:#98C379;"> /etc/resolv.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法3：在 Netplan/DHCP 配置中指定 DNS</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-dns-查询工具" tabindex="-1"><a class="header-anchor" href="#_3-4-dns-查询工具"><span>3.4 DNS 查询工具</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># dig - 最专业的 DNS 查询工具</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#7F848E;font-style:italic;">                # 查询 A 记录</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> A</span><span style="color:#7F848E;font-style:italic;">              # 明确指定 A 记录</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> AAAA</span><span style="color:#7F848E;font-style:italic;">           # IPv6 地址</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> MX</span><span style="color:#7F848E;font-style:italic;">             # 邮件记录</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> NS</span><span style="color:#7F848E;font-style:italic;">             # 名称服务器</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> CNAME</span><span style="color:#7F848E;font-style:italic;">          # 别名</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> TXT</span><span style="color:#7F848E;font-style:italic;">            # 文本记录</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> ANY</span><span style="color:#7F848E;font-style:italic;">            # 所有记录</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 指定 DNS 服务器</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> @8.8.8.8</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 反向解析</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#D19A66;"> -x</span><span style="color:#D19A66;"> 93.184.216.34</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 跟踪解析过程</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> +trace</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 简洁输出</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> +short</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 93.184.216.34</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nslookup - 简单查询（Windows 也有）</span></span>
<span class="line"><span style="color:#61AFEF;">nslookup</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"><span style="color:#61AFEF;">nslookup</span><span style="color:#98C379;"> example.com</span><span style="color:#D19A66;"> 8.8.8.8</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># host - 简洁输出</span></span>
<span class="line"><span style="color:#61AFEF;">host</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"><span style="color:#61AFEF;">host</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> MX</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"><span style="color:#61AFEF;">host</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> NS</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改 /etc/hosts 测试</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 临时将域名指向特定 IP（开发调试常用）</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;127.0.0.1  api.example.com&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> /etc/hosts</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#98C379;"> api.example.com</span><span style="color:#7F848E;font-style:italic;">            # 访问本地服务</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 测试完毕后删除</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> vim</span><span style="color:#98C379;"> /etc/hosts</span><span style="color:#7F848E;font-style:italic;">             # 删除添加的行</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-5-systemd-resolved" tabindex="-1"><a class="header-anchor" href="#_3-5-systemd-resolved"><span>3.5 systemd-resolved</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Ubuntu 18.04+ 默认使用 systemd-resolved</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 它充当本地 DNS 缓存和存根解析器</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看状态</span></span>
<span class="line"><span style="color:#61AFEF;">systemd-resolve</span><span style="color:#D19A66;"> --status</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或新版</span></span>
<span class="line"><span style="color:#61AFEF;">resolvectl</span><span style="color:#98C379;"> status</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看缓存统计</span></span>
<span class="line"><span style="color:#61AFEF;">resolvectl</span><span style="color:#98C379;"> statistics</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 清除缓存</span></span>
<span class="line"><span style="color:#61AFEF;">resolvectl</span><span style="color:#98C379;"> flush-caches</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查询</span></span>
<span class="line"><span style="color:#61AFEF;">resolvectl</span><span style="color:#98C379;"> query</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/systemd/resolved.conf</span></span>
<span class="line"><span style="color:#ABB2BF;">[Resolve]</span></span>
<span class="line"><span style="color:#E06C75;">DNS</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">8.8.8.8</span><span style="color:#61AFEF;"> 8.8.4.4</span></span>
<span class="line"><span style="color:#E06C75;">FallbackDNS</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1.1.1.1</span></span>
<span class="line"><span style="color:#E06C75;">Domains</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">example.com</span></span>
<span class="line"><span style="color:#E06C75;">DNSStubListener</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">yes</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-防火墙" tabindex="-1"><a class="header-anchor" href="#_4-防火墙"><span>4. 防火墙</span></a></h2><h3 id="_4-1-linux-防火墙体系" tabindex="-1"><a class="header-anchor" href="#_4-1-linux-防火墙体系"><span>4.1 Linux 防火墙体系</span></a></h3>`,10),i(d,{code:`eJx9k9Fr00Acx9/3V4Tbq2MsbaoOGVSauGBIQpbSh2MPTZdzhdCOLKWIE/rSqrg5B7U+WHQikwlzThQ72k3/mV5u/hde75KYsW73+Pt9Ppfv/e6CvHqzsl72A8EuzAh0qToE5HyPjPrhm5Nw5xhvt8GqMDe3JOiyraiaLVsQ6G6Aql7g+vccf34Jd9rh/mn4sRO+/wVWZ9g2CczUZcN4uACBacmWUbRV/QHzLgbfSPc7frFDpYnDqIQXn4AI6PwgX3vgacKIE2YL7+7h362wfxT2h1usnoFA1c2izTf/8w63D3g7tT93L86PqM6tLASKYZXyVoF7rJUyMixR3jQhwMMu6R6Sw5d4uBsRtJ4kliCgp4sD8E9PUj5LB5ASPEcHYqzYUyby+lVKyP4XklqO1ahI7+rzCJ9FY4iHv9lwHvnljXWBpg2fD8iX4d+3P/HgALcHrM/u2bTz9zV5BYLqRlB2PHeTJRif7ZPRB85GIdh1KjFdQyk67J2MT1vj0acrQlEpQdBATYYVnUYtaAjkuIW3e1dQRbXkUl7TChCgqu82y563xjRrWdamSW5tjZ8zPsPl58nfXxR4SotGY9XYZsUkxKXWfLxNNNfgseemnjb9B7zFWRdl6bpVqXt1f3EWIZRi+QPiXMa5I6Lc9Vw24tDd25mFGzgp4kSxIklumvsHtaZYmw==`}),o[3]||=n(`<h3 id="_4-2-iptables" tabindex="-1"><a class="header-anchor" href="#_4-2-iptables"><span>4.2 iptables</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看规则</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -L</span><span style="color:#7F848E;font-style:italic;">                    # 列出所有规则</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -L</span><span style="color:#D19A66;"> -n</span><span style="color:#7F848E;font-style:italic;">                 # 不解析域名（更快）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -L</span><span style="color:#D19A66;"> -v</span><span style="color:#7F848E;font-style:italic;">                 # 显示计数器</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -L</span><span style="color:#D19A66;"> -n</span><span style="color:#D19A66;"> --line-numbers</span><span style="color:#7F848E;font-style:italic;">  # 显示行号</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> nat</span><span style="color:#D19A66;"> -L</span><span style="color:#D19A66;"> -n</span><span style="color:#7F848E;font-style:italic;">          # 查看 NAT 表</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 五链四表</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 链：PREROUTING, INPUT, FORWARD, OUTPUT, POSTROUTING</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 表：filter（默认）, nat, mangle, raw</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基本操作</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -A 追加, -I 插入, -D 删除, -F 清空</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -s 源地址, -d 目标地址</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -p 协议, --dport 目标端口</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -j 动作: ACCEPT, DROP, REJECT, LOG</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 允许 SSH</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -A</span><span style="color:#98C379;"> INPUT</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> tcp</span><span style="color:#D19A66;"> --dport</span><span style="color:#D19A66;"> 22</span><span style="color:#D19A66;"> -j</span><span style="color:#98C379;"> ACCEPT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 允许已建立的连接</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -A</span><span style="color:#98C379;"> INPUT</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> state</span><span style="color:#D19A66;"> --state</span><span style="color:#98C379;"> ESTABLISHED,RELATED</span><span style="color:#D19A66;"> -j</span><span style="color:#98C379;"> ACCEPT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 允许本地回环</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -A</span><span style="color:#98C379;"> INPUT</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> lo</span><span style="color:#D19A66;"> -j</span><span style="color:#98C379;"> ACCEPT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 允许 HTTP/HTTPS</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -A</span><span style="color:#98C379;"> INPUT</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> tcp</span><span style="color:#D19A66;"> --dport</span><span style="color:#D19A66;"> 80</span><span style="color:#D19A66;"> -j</span><span style="color:#98C379;"> ACCEPT</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -A</span><span style="color:#98C379;"> INPUT</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> tcp</span><span style="color:#D19A66;"> --dport</span><span style="color:#D19A66;"> 443</span><span style="color:#D19A66;"> -j</span><span style="color:#98C379;"> ACCEPT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认策略：拒绝入站</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -P</span><span style="color:#98C379;"> INPUT</span><span style="color:#98C379;"> DROP</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -P</span><span style="color:#98C379;"> FORWARD</span><span style="color:#98C379;"> DROP</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -P</span><span style="color:#98C379;"> OUTPUT</span><span style="color:#98C379;"> ACCEPT</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除规则</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -D</span><span style="color:#98C379;"> INPUT</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> tcp</span><span style="color:#D19A66;"> --dport</span><span style="color:#D19A66;"> 22</span><span style="color:#D19A66;"> -j</span><span style="color:#98C379;"> ACCEPT</span><span style="color:#7F848E;font-style:italic;">      # 按规则内容删除</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -D</span><span style="color:#98C379;"> INPUT</span><span style="color:#D19A66;"> 3</span><span style="color:#7F848E;font-style:italic;">                                   # 按行号删除</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 保存规则</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> iptables-persistent</span><span style="color:#7F848E;font-style:italic;">      # Debian/Ubuntu</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> netfilter-persistent</span><span style="color:#98C379;"> save</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables-save</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/iptables/rules.v4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables-save</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/sysconfig/iptables</span><span style="color:#7F848E;font-style:italic;">   # CentOS 6</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-ufw-ubuntu-简化防火墙" tabindex="-1"><a class="header-anchor" href="#_4-3-ufw-ubuntu-简化防火墙"><span>4.3 ufw（Ubuntu 简化防火墙）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ufw = Uncomplicated Firewall，Ubuntu 默认防火墙工具</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启用/禁用</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> enable</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> disable</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看状态</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> status</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> verbose</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> numbered</span><span style="color:#7F848E;font-style:italic;">          # 带编号</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 允许/拒绝端口</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#D19A66;"> 22</span><span style="color:#7F848E;font-style:italic;">                 # 允许 SSH</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> 80/tcp</span><span style="color:#7F848E;font-style:italic;">             # 允许 HTTP</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> 443/tcp</span><span style="color:#7F848E;font-style:italic;">            # 允许 HTTPS</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> 3000:4000/tcp</span><span style="color:#7F848E;font-style:italic;">      # 允许端口范围</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> deny</span><span style="color:#D19A66;"> 3306</span><span style="color:#7F848E;font-style:italic;">                # 拒绝 MySQL</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 允许/拒绝特定 IP</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> from</span><span style="color:#98C379;"> 192.168.1.0/24</span><span style="color:#7F848E;font-style:italic;">           # 允许网段</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> from</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">            # 允许 IP</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> from</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#98C379;"> to</span><span style="color:#98C379;"> any</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 22</span><span style="color:#7F848E;font-style:italic;">  # IP + 端口</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 按服务名</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> ssh</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> http</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> https</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除规则</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> delete</span><span style="color:#98C379;"> allow</span><span style="color:#D19A66;"> 80</span><span style="color:#7F848E;font-style:italic;">          # 按规则内容</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> uufw</span><span style="color:#98C379;"> delete</span><span style="color:#D19A66;"> 3</span><span style="color:#7F848E;font-style:italic;">                # 按编号</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 拒绝出站</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> reject</span><span style="color:#98C379;"> out</span><span style="color:#D19A66;"> 25</span><span style="color:#7F848E;font-style:italic;">            # 拒绝 SMTP 出站</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 日志</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> logging</span><span style="color:#98C379;"> on</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> logging</span><span style="color:#98C379;"> medium</span><span style="color:#7F848E;font-style:italic;">           # 级别：off/low/medium/high/full</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重置</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> reset</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-firewalld-rhel-centos-防火墙" tabindex="-1"><a class="header-anchor" href="#_4-4-firewalld-rhel-centos-防火墙"><span>4.4 firewalld（RHEL/CentOS 防火墙）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># firewalld 使用&quot;区域&quot;概念管理防火墙规则</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看状态</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> firewalld</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --state</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看当前区域</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --get-default-zone</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --get-active-zones</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看区域规则</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --list-all</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --zone=public</span><span style="color:#D19A66;"> --list-all</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加服务/端口</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --add-service=http</span><span style="color:#7F848E;font-style:italic;">               # 临时</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --add-service=http</span><span style="color:#D19A66;"> --permanent</span><span style="color:#7F848E;font-style:italic;">    # 永久</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --add-port=8080/tcp</span><span style="color:#7F848E;font-style:italic;">               # 临时</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --add-port=8080/tcp</span><span style="color:#D19A66;"> --permanent</span><span style="color:#7F848E;font-style:italic;">   # 永久</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 常用服务</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --add-service=ssh</span><span style="color:#D19A66;"> --permanent</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --add-service=https</span><span style="color:#D19A66;"> --permanent</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --add-service=mysql</span><span style="color:#D19A66;"> --permanent</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重载配置（修改 --permanent 后必须重载）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --reload</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 允许特定 IP</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --add-source=192.168.1.0/24</span><span style="color:#D19A66;"> --zone=trusted</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --add-rich-rule=</span><span style="color:#98C379;">&#39;rule family=&quot;ipv4&quot; source address=&quot;192.168.1.100&quot; port port=&quot;3306&quot; protocol=&quot;tcp&quot; accept&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 端口转发</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --add-forward-port=port=80:proto=tcp:toport=8080</span><span style="color:#D19A66;"> --permanent</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 区域</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --set-default-zone=dmz</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --zone=internal</span><span style="color:#D19A66;"> --change-interface=eth1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看可用服务</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --get-services</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">临时 vs 永久规则</p><ul><li>不加 <code>--permanent</code>：临时规则，重启/重载后丢失</li><li>加 <code>--permanent</code>：永久规则，需要 <code>--reload</code> 才生效</li><li>推荐工作流：先临时测试，确认无误后改为永久</li></ul><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 推荐流程</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --add-port=8080/tcp</span><span style="color:#7F848E;font-style:italic;">            # 临时测试</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#98C379;"> http://server:8080</span><span style="color:#7F848E;font-style:italic;">                            # 验证</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --add-port=8080/tcp</span><span style="color:#D19A66;"> --permanent</span><span style="color:#7F848E;font-style:italic;"> # 确认后永久化</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --reload</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div><h3 id="_4-5-防火墙选型建议" tabindex="-1"><a class="header-anchor" href="#_4-5-防火墙选型建议"><span>4.5 防火墙选型建议</span></a></h3><table><thead><tr><th>工具</th><th>适用系统</th><th>复杂度</th><th>灵活性</th></tr></thead><tbody><tr><td><strong>iptables</strong></td><td>所有 Linux</td><td>高</td><td>最高</td></tr><tr><td><strong>nftables</strong></td><td>新版 Linux</td><td>中</td><td>高</td></tr><tr><td><strong>ufw</strong></td><td>Ubuntu/Debian</td><td>低</td><td>中</td></tr><tr><td><strong>firewalld</strong></td><td>RHEL/CentOS/Fedora</td><td>中</td><td>高</td></tr></tbody></table><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 各系统默认防火墙</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Ubuntu: ufw（底层 iptables/nftables）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CentOS 7: firewalld（底层 iptables）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CentOS 8+: firewalld（底层 nftables）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Debian: 可选 ufw 或 nftables</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-ssh-远程管理" tabindex="-1"><a class="header-anchor" href="#_5-ssh-远程管理"><span>5. SSH 远程管理</span></a></h2><h3 id="_5-1-ssh-基础" tabindex="-1"><a class="header-anchor" href="#_5-1-ssh-基础"><span>5.1 SSH 基础</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基本连接</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> user@hostname</span><span style="color:#7F848E;font-style:italic;">                # 使用默认端口 22</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> user@192.168.1.100</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#D19A66;"> -p</span><span style="color:#D19A66;"> 2222</span><span style="color:#98C379;"> user@host</span><span style="color:#7F848E;font-style:italic;">            # 指定端口</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 首次连接会验证主机指纹</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># The authenticity of host &#39;192.168.1.100&#39; can&#39;t be established.</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ED25519 key fingerprint is SHA256:xxxxxx.</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Are you sure you want to continue connecting (yes/no)?</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主机指纹存储在 ~/.ssh/known_hosts</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果主机重装系统，指纹变化会导致连接失败</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 解决：删除旧指纹</span></span>
<span class="line"><span style="color:#61AFEF;">ssh-keygen</span><span style="color:#D19A66;"> -R</span><span style="color:#D19A66;"> 192.168.1.100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 执行远程命令</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> user@host</span><span style="color:#98C379;"> &quot;uname -a&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> user@host</span><span style="color:#98C379;"> &quot;df -h&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> user@host</span><span style="color:#98C379;"> &#39;sudo apt update&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用特定密钥</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> ~/.ssh/mykey</span><span style="color:#98C379;"> user@host</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启用详细输出（调试连接问题）</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> user@host</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#D19A66;"> -vvv</span><span style="color:#98C379;"> user@host</span><span style="color:#7F848E;font-style:italic;">              # 最详细</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-密钥认证" tabindex="-1"><a class="header-anchor" href="#_5-2-密钥认证"><span>5.2 密钥认证</span></a></h3>`,14),i(d,{code:`eJwrTi0sTc1LTnXJTEwvSszlUgCCgsSikszkzILEvBIF55zMVCCVWKwQHOyh8HTdomcd25+vXo+hLji1qCy1CKbu2Zzep10Ln85cwQVW6JdfkqqQD5KHGKcDUW2l8HR928tJS1+sW/JifeOzrY3PV3RDNECU6drZwRS+WL/92camF/vnPetbClYBkQCqgCgFGtU/8WVD48tZ/c/m7HrWM/FZxwxUk2Dqnk9Z8Xx5I9DW52v3PZ3Qi00p3HVgIyHqUC2FqQAappBYWpKRX5RZlZoSn51aWazwZMfa57NanrauAdrxclUP0GeYJiC559GcVgVoAHRMeNo1n3CIPV/QiBxi7/d0PNnR+6xvxYveCe/3dJIdgBAVEPPxhQeSCozwgPgXUwWqf/Ufze2B+vn57snP5s3hAgCOACOi`}),o[4]||=n(`<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 生成密钥对</span></span>
<span class="line"><span style="color:#61AFEF;">ssh-keygen</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> ed25519</span><span style="color:#D19A66;"> -C</span><span style="color:#98C379;"> &quot;alice@workstation&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 推荐算法：ed25519（更快更安全）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 替代：ssh-keygen -t rsa -b 4096（兼容性更好）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成过程</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Generating public/private ed25519 key pair.</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Enter file in which to save the key (/home/alice/.ssh/id_ed25519):</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Enter passphrase (empty for no passphrase):    # 建议设置密码短语</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Enter same passphrase again:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 密钥文件</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ~/.ssh/id_ed25519       # 私钥（绝不能泄露！）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ~/.ssh/id_ed25519.pub   # 公钥（可以公开）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 将公钥上传到服务器</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法一：ssh-copy-id（最简单）</span></span>
<span class="line"><span style="color:#61AFEF;">ssh-copy-id</span><span style="color:#98C379;"> user@host</span></span>
<span class="line"><span style="color:#61AFEF;">ssh-copy-id</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> ~/.ssh/id_ed25519.pub</span><span style="color:#98C379;"> user@host</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法二：手动复制</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> ~/.ssh/id_ed25519.pub</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> user@host</span><span style="color:#98C379;"> &quot;mkdir -p ~/.ssh &amp;&amp; cat &gt;&gt; ~/.ssh/authorized_keys&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法三：直接复制文件内容</span></span>
<span class="line"><span style="color:#61AFEF;">scp</span><span style="color:#98C379;"> ~/.ssh/id_ed25519.pub</span><span style="color:#98C379;"> user@host:~/.ssh/authorized_keys</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 服务器端设置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ~/.ssh/authorized_keys 权限必须正确</span></span>
<span class="line"><span style="color:#61AFEF;">chmod</span><span style="color:#D19A66;"> 700</span><span style="color:#98C379;"> ~/.ssh</span></span>
<span class="line"><span style="color:#61AFEF;">chmod</span><span style="color:#D19A66;"> 600</span><span style="color:#98C379;"> ~/.ssh/authorized_keys</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 测试</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> user@host</span><span style="color:#7F848E;font-style:italic;">    # 应该无需密码直接登录</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-ssh-客户端配置-ssh-config" tabindex="-1"><a class="header-anchor" href="#_5-3-ssh-客户端配置-ssh-config"><span>5.3 SSH 客户端配置 ~/.ssh/config</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ~/.ssh/config 示例</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基本配置</span></span>
<span class="line"><span style="color:#61AFEF;">Host</span><span style="color:#98C379;"> myserver</span></span>
<span class="line"><span style="color:#61AFEF;">    HostName</span><span style="color:#D19A66;"> 192.168.1.100</span></span>
<span class="line"><span style="color:#61AFEF;">    User</span><span style="color:#98C379;"> alice</span></span>
<span class="line"><span style="color:#61AFEF;">    Port</span><span style="color:#D19A66;"> 22</span></span>
<span class="line"><span style="color:#61AFEF;">    IdentityFile</span><span style="color:#98C379;"> ~/.ssh/id_ed25519</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用别名连接</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ssh myserver  等价于  ssh -i ~/.ssh/id_ed25519 alice@192.168.1.100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 跳板机配置</span></span>
<span class="line"><span style="color:#61AFEF;">Host</span><span style="color:#98C379;"> jump</span></span>
<span class="line"><span style="color:#61AFEF;">    HostName</span><span style="color:#98C379;"> jump.example.com</span></span>
<span class="line"><span style="color:#61AFEF;">    User</span><span style="color:#98C379;"> admin</span></span>
<span class="line"><span style="color:#61AFEF;">    IdentityFile</span><span style="color:#98C379;"> ~/.ssh/jump_key</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">Host</span><span style="color:#98C379;"> prod</span></span>
<span class="line"><span style="color:#61AFEF;">    HostName</span><span style="color:#D19A66;"> 10.0.0.50</span></span>
<span class="line"><span style="color:#61AFEF;">    User</span><span style="color:#98C379;"> deploy</span></span>
<span class="line"><span style="color:#61AFEF;">    IdentityFile</span><span style="color:#98C379;"> ~/.ssh/prod_key</span></span>
<span class="line"><span style="color:#61AFEF;">    ProxyJump</span><span style="color:#98C379;"> jump</span><span style="color:#7F848E;font-style:italic;">                  # 通过跳板机连接</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 或使用旧语法</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ProxyCommand ssh -W %h:%p jump</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 多跳配置</span></span>
<span class="line"><span style="color:#61AFEF;">Host</span><span style="color:#98C379;"> bastion</span></span>
<span class="line"><span style="color:#61AFEF;">    HostName</span><span style="color:#98C379;"> bastion.example.com</span></span>
<span class="line"><span style="color:#61AFEF;">    User</span><span style="color:#98C379;"> admin</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">Host</span><span style="color:#98C379;"> internal</span></span>
<span class="line"><span style="color:#61AFEF;">    HostName</span><span style="color:#D19A66;"> 192.168.10.5</span></span>
<span class="line"><span style="color:#61AFEF;">    ProxyJump</span><span style="color:#98C379;"> bastion</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">Host</span><span style="color:#98C379;"> db</span></span>
<span class="line"><span style="color:#61AFEF;">    HostName</span><span style="color:#D19A66;"> 10.0.0.100</span></span>
<span class="line"><span style="color:#61AFEF;">    ProxyJump</span><span style="color:#98C379;"> bastion,internal</span><span style="color:#7F848E;font-style:italic;">      # 多级跳板</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通用配置</span></span>
<span class="line"><span style="color:#61AFEF;">Host</span><span style="color:#E5C07B;"> *</span></span>
<span class="line"><span style="color:#61AFEF;">    ServerAliveInterval</span><span style="color:#D19A66;"> 60</span><span style="color:#7F848E;font-style:italic;">          # 每 60 秒发送心跳</span></span>
<span class="line"><span style="color:#61AFEF;">    ServerAliveCountMax</span><span style="color:#D19A66;"> 3</span><span style="color:#7F848E;font-style:italic;">           # 3 次无响应断开</span></span>
<span class="line"><span style="color:#61AFEF;">    ConnectTimeout</span><span style="color:#D19A66;"> 10</span><span style="color:#7F848E;font-style:italic;">               # 连接超时 10 秒</span></span>
<span class="line"><span style="color:#61AFEF;">    AddKeysToAgent</span><span style="color:#98C379;"> yes</span><span style="color:#7F848E;font-style:italic;">              # 自动添加到 ssh-agent</span></span>
<span class="line"><span style="color:#61AFEF;">    UseKeychain</span><span style="color:#98C379;"> yes</span><span style="color:#7F848E;font-style:italic;">                 # macOS Keychain</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 保持连接（防止断开）</span></span>
<span class="line"><span style="color:#61AFEF;">Host</span><span style="color:#E5C07B;"> *</span></span>
<span class="line"><span style="color:#61AFEF;">    TCPKeepAlive</span><span style="color:#98C379;"> yes</span></span>
<span class="line"><span style="color:#61AFEF;">    ServerAliveInterval</span><span style="color:#D19A66;"> 30</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 连接复用（加速重复连接）</span></span>
<span class="line"><span style="color:#61AFEF;">Host</span><span style="color:#E5C07B;"> *</span></span>
<span class="line"><span style="color:#61AFEF;">    ControlMaster</span><span style="color:#98C379;"> auto</span></span>
<span class="line"><span style="color:#61AFEF;">    ControlPath</span><span style="color:#98C379;"> ~/.ssh/sockets/%r@%h-%p</span></span>
<span class="line"><span style="color:#61AFEF;">    ControlPersist</span><span style="color:#D19A66;"> 600</span><span style="color:#7F848E;font-style:italic;">              # 保持 10 分钟</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建 socket 目录</span></span>
<span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> ~/.ssh/sockets</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-ssh-服务端安全加固" tabindex="-1"><a class="header-anchor" href="#_5-4-ssh-服务端安全加固"><span>5.4 SSH 服务端安全加固</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/ssh/sshd_config 关键配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 禁止 root 登录</span></span>
<span class="line"><span style="color:#61AFEF;">PermitRootLogin</span><span style="color:#98C379;"> no</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 禁止密码认证（只用密钥）</span></span>
<span class="line"><span style="color:#61AFEF;">PasswordAuthentication</span><span style="color:#98C379;"> no</span></span>
<span class="line"><span style="color:#61AFEF;">PubkeyAuthentication</span><span style="color:#98C379;"> yes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 限制可登录用户</span></span>
<span class="line"><span style="color:#61AFEF;">AllowUsers</span><span style="color:#98C379;"> alice</span><span style="color:#98C379;"> bob</span><span style="color:#98C379;"> deploy</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或</span></span>
<span class="line"><span style="color:#61AFEF;">AllowGroups</span><span style="color:#98C379;"> ssh-users</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 修改默认端口（减小被扫描概率）</span></span>
<span class="line"><span style="color:#61AFEF;">Port</span><span style="color:#D19A66;"> 2222</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 禁用空密码</span></span>
<span class="line"><span style="color:#61AFEF;">PermitEmptyPasswords</span><span style="color:#98C379;"> no</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 限制认证尝试</span></span>
<span class="line"><span style="color:#61AFEF;">MaxAuthTries</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 7. 设置登录超时</span></span>
<span class="line"><span style="color:#61AFEF;">LoginGraceTime</span><span style="color:#D19A66;"> 30</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 8. 禁用不必要的认证方式</span></span>
<span class="line"><span style="color:#61AFEF;">ChallengeResponseAuthentication</span><span style="color:#98C379;"> no</span></span>
<span class="line"><span style="color:#61AFEF;">KbdInteractiveAuthentication</span><span style="color:#98C379;"> no</span></span>
<span class="line"><span style="color:#61AFEF;">UsePAM</span><span style="color:#98C379;"> no</span><span style="color:#7F848E;font-style:italic;">                          # 谨慎，可能影响其他功能</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 9. 限制会话</span></span>
<span class="line"><span style="color:#61AFEF;">MaxSessions</span><span style="color:#D19A66;"> 5</span></span>
<span class="line"><span style="color:#61AFEF;">MaxStartups</span><span style="color:#98C379;"> 10:30:100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 10. 日志</span></span>
<span class="line"><span style="color:#61AFEF;">SyslogFacility</span><span style="color:#98C379;"> AUTH</span></span>
<span class="line"><span style="color:#61AFEF;">LogLevel</span><span style="color:#98C379;"> VERBOSE</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重启 SSH（不要断开当前连接！验证后再断开）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> sshd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证配置语法</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sshd</span><span style="color:#D19A66;"> -t</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">修改 SSH 配置的正确姿势</p><ol><li>保持当前 SSH 会话不关闭</li><li>修改 sshd_config</li><li>用 <code>sudo sshd -t</code> 检查语法</li><li>重启 sshd</li><li>开一个新终端测试连接</li><li>确认能连接后再关闭旧会话</li></ol><p>如果配置错误导致无法连接，旧会话仍然可以用来修复！</p></div><h3 id="_5-5-ssh-agent-与密钥管理" tabindex="-1"><a class="header-anchor" href="#_5-5-ssh-agent-与密钥管理"><span>5.5 ssh-agent 与密钥管理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 启动 ssh-agent</span></span>
<span class="line"><span style="color:#56B6C2;">eval</span><span style="color:#98C379;"> &quot;$(</span><span style="color:#61AFEF;">ssh-agent</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加密钥</span></span>
<span class="line"><span style="color:#61AFEF;">ssh-add</span><span style="color:#98C379;"> ~/.ssh/id_ed25519</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Enter passphrase for ~/.ssh/id_ed25519:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看已添加的密钥</span></span>
<span class="line"><span style="color:#61AFEF;">ssh-add</span><span style="color:#D19A66;"> -l</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除所有密钥</span></span>
<span class="line"><span style="color:#61AFEF;">ssh-add</span><span style="color:#D19A66;"> -D</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除指定密钥</span></span>
<span class="line"><span style="color:#61AFEF;">ssh-add</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> ~/.ssh/id_ed25519</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 锁定/解锁 agent</span></span>
<span class="line"><span style="color:#61AFEF;">ssh-add</span><span style="color:#D19A66;"> -x</span><span style="color:#7F848E;font-style:italic;">          # 锁定（需要密码解锁）</span></span>
<span class="line"><span style="color:#61AFEF;">ssh-add</span><span style="color:#D19A66;"> -X</span><span style="color:#7F848E;font-style:italic;">          # 解锁</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 自动启动 ssh-agent（写入 ~/.bashrc）</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$SSH_AUTH_SOCK</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    eval</span><span style="color:#98C379;"> &quot;$(</span><span style="color:#61AFEF;">ssh-agent</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    ssh-add</span><span style="color:#98C379;"> ~/.ssh/id_ed25519</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># systemd 用户服务方式（更优雅）</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#D19A66;"> --user</span><span style="color:#98C379;"> enable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> ssh-agent</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 ~/.bashrc 中添加：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># export SSH_AUTH_SOCK=&quot;$XDG_RUNTIME_DIR/ssh-agent.socket&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-网络诊断工具" tabindex="-1"><a class="header-anchor" href="#_6-网络诊断工具"><span>6. 网络诊断工具</span></a></h2><h3 id="_6-1-linux-网络数据包流向" tabindex="-1"><a class="header-anchor" href="#_6-1-linux-网络数据包流向"><span>6.1 Linux 网络数据包流向</span></a></h3>`,10),i(d,{code:`eJx1k21v0lAUx9/vUzR3b11QlvlAzJIGqiHhyVKiSWMMsHaQMCClRI0zcVE2xlRcRKIZWaayhMhmfYhjgSFfZve2e7WvsNt7O3rHsvumtz2/8z//e8+pmis8TWeSms5JgSkOr1I5taglixkOtpsnrzvmcNMctEjEXsIjSQY0cnw4QK0+eExiSn5h6mI6au3hsAxC2Xz5GUdl0E7V4e0VCfplgAPw3VdO0TPXcYiNcTMz81xMFMRoQgpG7svA3d9NaZ75QISXPFbPMBu/YbWNmvuMtIsSFXsvvAAOvPrX3G+Cl24xErbBZWBu/UQ7az5qHixzwUgsgU9MHqTqyec/5koXfvtijdbQoM3UvKwCKwfHgyZWuRcVH/JiQAbOhihZwz1Y3xzLjHVILWI7FPXzIRlgM7D1yxptmZ0Nknl6VIX9htno4A+wXz89WmdskCSSjv0Q8/R5hftxHqXopUfjknvr7guRiNvXHubjDxKCyAcEprJzuEkJtynuN8LgHj/Br5MzcGGcHIbwePYmZswyarjvsLcLKz23DLFdzOYXid+gPxzj0L8Ny/jEeJVE3i/IQNeSaUUrlHWFtqRnwP9vrNHQOvzBDqogxSUeGy2VPHlFL+lJneKjbfR+16wdoFcrrLY/FkiEY1g9XVwoLxUJi2of4dsKrK6i7Q+sdJjHYH4pSSmza8D6d7TeRfX6pT9Lf55TnOlQs7mcb3o2ddur3ryWLuQKmm9aVVWGO28GJdU7t2ZvXEE6jaeg15uem1NY8AwuNXzS`}),o[5]||=n(`<h3 id="_6-2-ping-——-连通性测试" tabindex="-1"><a class="header-anchor" href="#_6-2-ping-——-连通性测试"><span>6.2 ping —— 连通性测试</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基本用法</span></span>
<span class="line"><span style="color:#61AFEF;">ping</span><span style="color:#D19A66;"> 8.8.8.8</span></span>
<span class="line"><span style="color:#61AFEF;">ping</span><span style="color:#98C379;"> google.com</span></span>
<span class="line"><span style="color:#61AFEF;">ping</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 4</span><span style="color:#98C379;"> google.com</span><span style="color:#7F848E;font-style:italic;">            # 发送 4 个包后停止</span></span>
<span class="line"><span style="color:#61AFEF;">ping</span><span style="color:#D19A66;"> -i</span><span style="color:#D19A66;"> 0.5</span><span style="color:#98C379;"> google.com</span><span style="color:#7F848E;font-style:italic;">          # 每 0.5 秒发送一次</span></span>
<span class="line"><span style="color:#61AFEF;">ping</span><span style="color:#D19A66;"> -W</span><span style="color:#D19A66;"> 2</span><span style="color:#98C379;"> google.com</span><span style="color:#7F848E;font-style:italic;">            # 超时 2 秒</span></span>
<span class="line"><span style="color:#61AFEF;">ping</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> 1400</span><span style="color:#98C379;"> google.com</span><span style="color:#7F848E;font-style:italic;">         # 指定包大小（MTU 测试）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出解读</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 64 bytes from 8.8.8.8: icmp_seq=1 ttl=116 time=1.23 ms</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#                     │          │         │</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#                     │          │         └── 往返延迟</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#                     │          └── TTL（每经过一个路由器减 1）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#                     └── 响应字节</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 统计信息</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># --- google.com ping statistics ---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4 packets transmitted, 4 received, 0% packet loss, time 3002ms</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># rtt min/avg/max/mdev = 1.123/1.456/2.001/0.321 ms</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#                   最小/平均/最大/偏差</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ping 不通的可能原因</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 对方不在线</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 防火墙拦截 ICMP</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. DNS 解析失败（ping 域名时）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 本机网络配置错误</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：ping 不通不代表服务不可用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 很多服务器禁用了 ICMP（安全考虑）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 应该用 curl/telnet 测试具体端口</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-traceroute-——-路径追踪" tabindex="-1"><a class="header-anchor" href="#_6-3-traceroute-——-路径追踪"><span>6.3 traceroute —— 路径追踪</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 追踪到目标的网络路径</span></span>
<span class="line"><span style="color:#61AFEF;">traceroute</span><span style="color:#98C379;"> google.com</span></span>
<span class="line"><span style="color:#61AFEF;">traceroute</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> google.com</span><span style="color:#7F848E;font-style:italic;">           # 不解析域名（更快）</span></span>
<span class="line"><span style="color:#61AFEF;">traceroute</span><span style="color:#D19A66;"> -I</span><span style="color:#98C379;"> google.com</span><span style="color:#7F848E;font-style:italic;">           # 使用 ICMP（某些网络更有效）</span></span>
<span class="line"><span style="color:#61AFEF;">traceroute</span><span style="color:#D19A66;"> -T</span><span style="color:#D19A66;"> -p</span><span style="color:#D19A66;"> 443</span><span style="color:#98C379;"> google.com</span><span style="color:#7F848E;font-style:italic;">    # 使用 TCP 443（绕过 ICMP 过滤）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出解读</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># traceroute to google.com (142.250.80.46), 30 hops max, 60 byte packets</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#  1  gateway (192.168.1.1)  0.523 ms  0.412 ms  0.398 ms</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#  2  10.0.0.1 (10.0.0.1)    1.234 ms  1.123 ms  1.098 ms</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#  3  * * *                           # 这一跳不响应</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#  4  isp-router (203.0.113.1) 5.432 ms 5.321 ms 5.210 ms</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#  ...</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#  8  google.com (142.250.80.46) 10.123 ms 10.012 ms 9.987 ms</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># * * * 表示该路由器不响应 ICMP 或被防火墙过滤</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 延迟突然增大可能表示网络拥塞或链路差</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># mtr - 更好的 traceroute（持续监测）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> mtr</span><span style="color:#7F848E;font-style:italic;">      # Debian/Ubuntu</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> dnf</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> mtr</span><span style="color:#7F848E;font-style:italic;">      # RHEL/CentOS</span></span>
<span class="line"><span style="color:#61AFEF;">mtr</span><span style="color:#98C379;"> google.com</span><span style="color:#7F848E;font-style:italic;">            # 交互式</span></span>
<span class="line"><span style="color:#61AFEF;">mtr</span><span style="color:#D19A66;"> --report</span><span style="color:#98C379;"> google.com</span><span style="color:#7F848E;font-style:italic;">   # 报告模式</span></span>
<span class="line"><span style="color:#61AFEF;">mtr</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> google.com</span><span style="color:#7F848E;font-style:italic;">         # 不解析域名</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-4-ss-netstat-——-连接状态" tabindex="-1"><a class="header-anchor" href="#_6-4-ss-netstat-——-连接状态"><span>6.4 ss / netstat —— 连接状态</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ss - 现代工具（推荐）</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -t</span><span style="color:#7F848E;font-style:italic;">           # TCP 连接</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -u</span><span style="color:#7F848E;font-style:italic;">           # UDP 连接</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -l</span><span style="color:#7F848E;font-style:italic;">           # 监听端口</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tln</span><span style="color:#7F848E;font-style:italic;">         # TCP 监听端口（不解析域名）</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#7F848E;font-style:italic;">        # 显示进程信息</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -s</span><span style="color:#7F848E;font-style:italic;">           # 统计摘要</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 常用组合</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#7F848E;font-style:italic;">        # 查看所有 TCP 监听端口及进程</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tnp</span><span style="color:#7F848E;font-style:italic;">         # 查看所有 TCP 已建立连接</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tn</span><span style="color:#98C379;"> state</span><span style="color:#98C379;"> established</span><span style="color:#7F848E;font-style:italic;">  # 只看已建立连接</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tln</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> :80</span><span style="color:#7F848E;font-style:italic;">        # 查看谁在监听 80 端口</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出示例</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># LISTEN  0       128     0.0.0.0:22          0.0.0.0:*          users:((&quot;sshd&quot;,pid=1234,fd=3))</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ESTAB   0       0       192.168.1.100:22    10.0.0.1:54321     users:((&quot;sshd&quot;,pid=5678,fd=4))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># netstat - 传统工具</span></span>
<span class="line"><span style="color:#61AFEF;">netstat</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#7F848E;font-style:italic;">   # TCP 监听端口</span></span>
<span class="line"><span style="color:#61AFEF;">netstat</span><span style="color:#D19A66;"> -unlp</span><span style="color:#7F848E;font-style:italic;">   # UDP 监听端口</span></span>
<span class="line"><span style="color:#61AFEF;">netstat</span><span style="color:#D19A66;"> -tnp</span><span style="color:#7F848E;font-style:italic;">    # TCP 已建立连接</span></span>
<span class="line"><span style="color:#61AFEF;">netstat</span><span style="color:#D19A66;"> -anp</span><span style="color:#7F848E;font-style:italic;">    # 所有连接</span></span>
<span class="line"><span style="color:#61AFEF;">netstat</span><span style="color:#D19A66;"> -rn</span><span style="color:#7F848E;font-style:italic;">     # 路由表</span></span>
<span class="line"><span style="color:#61AFEF;">netstat</span><span style="color:#D19A66;"> -i</span><span style="color:#7F848E;font-style:italic;">      # 网卡统计</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看特定端口</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ss</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> :8080</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> lsof</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> :8080</span><span style="color:#7F848E;font-style:italic;">              # 另一个方法</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> fuser</span><span style="color:#98C379;"> 8080/tcp</span><span style="color:#7F848E;font-style:italic;">             # 又一个方法</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-5-tcpdump-——-抓包分析" tabindex="-1"><a class="header-anchor" href="#_6-5-tcpdump-——-抓包分析"><span>6.5 tcpdump —— 抓包分析</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基本抓包</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#7F848E;font-style:italic;">                     # 抓所有包</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> eth0</span><span style="color:#7F848E;font-style:italic;">             # 指定接口</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 100</span><span style="color:#7F848E;font-style:italic;">              # 只抓 100 个包</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> capture.pcap</span><span style="color:#7F848E;font-style:italic;">     # 保存到文件（Wireshark 分析）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 过滤</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> host</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">              # 指定主机</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 80</span><span style="color:#7F848E;font-style:italic;">                         # 指定端口</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 443</span><span style="color:#7F848E;font-style:italic;">                        # HTTPS</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> src</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">               # 源地址</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> dst</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">               # 目标地址</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> tcp</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 22</span><span style="color:#7F848E;font-style:italic;">                     # SSH 流量</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 组合过滤</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> &#39;host 192.168.1.100 and port 80&#39;</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> &#39;tcp[tcpflags] &amp; tcp-syn != 0&#39;</span><span style="color:#7F848E;font-style:italic;">  # 只抓 SYN 包</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> &#39;port 53&#39;</span><span style="color:#7F848E;font-style:italic;">                        # DNS 查询</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 显示选项</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -n</span><span style="color:#7F848E;font-style:italic;">                  # 不解析域名</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -nn</span><span style="color:#7F848E;font-style:italic;">                 # 不解析域名和端口</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -v</span><span style="color:#7F848E;font-style:italic;">                  # 详细输出</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -vv</span><span style="color:#7F848E;font-style:italic;">                 # 更详细</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -X</span><span style="color:#7F848E;font-style:italic;">                  # 显示包内容（十六进制+ASCII）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 读取抓包文件</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> capture.pcap</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 推荐用 Wireshark 打开 .pcap 文件进行可视化分析</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 实用示例</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 抓 HTTP 请求（快速查看）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> eth0</span><span style="color:#D19A66;"> -A</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> 0</span><span style="color:#98C379;"> &#39;tcp port 80 and (((ip[2:2] - ((ip[0]&amp;0xf)&lt;&lt;2)) - ((tcp[12]&amp;0xf0)&gt;&gt;2)) != 0)&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 抓 TCP 三次握手</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> eth0</span><span style="color:#98C379;"> &#39;tcp[tcpflags] &amp; (tcp-syn|tcp-ack) != 0&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 统计流量</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> eth0</span><span style="color:#D19A66;"> -q</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> 0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-6-nmap-——-端口扫描" tabindex="-1"><a class="header-anchor" href="#_6-6-nmap-——-端口扫描"><span>6.6 nmap —— 端口扫描</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> nmap</span><span style="color:#7F848E;font-style:italic;">     # Debian/Ubuntu</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> dnf</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> nmap</span><span style="color:#7F848E;font-style:italic;">     # RHEL/CentOS</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基本扫描</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">                    # 扫描常见端口</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> 80,443,8080</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">    # 指定端口</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> 1-65535</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">        # 全端口扫描</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -sU</span><span style="color:#D19A66;"> -p</span><span style="color:#D19A66;"> 53</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">         # UDP 扫描</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 扫描类型</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -sS</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">    # SYN 扫描（半开扫描，默认）</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -sT</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">    # TCP 全连接扫描</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -sU</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">    # UDP 扫描</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -sA</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">    # ACK 扫描（防火墙探测）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 服务版本探测</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -sV</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">    # 探测服务版本</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -sV</span><span style="color:#D19A66;"> -p</span><span style="color:#D19A66;"> 80</span><span style="color:#D19A66;"> 192.168.1.100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 操作系统探测</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -O</span><span style="color:#D19A66;"> 192.168.1.100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 综合扫描</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -A</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">     # -A = -sV + -O + 脚本 + traceroute</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 子网扫描</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#98C379;"> 192.168.1.0/24</span><span style="color:#7F848E;font-style:italic;">       # 扫描整个 C 类网段</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -sn</span><span style="color:#98C379;"> 192.168.1.0/24</span><span style="color:#7F848E;font-style:italic;">   # 只做主机发现（不扫端口）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出格式</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -oN</span><span style="color:#98C379;"> scan.txt</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">       # 普通文本</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -oX</span><span style="color:#98C379;"> scan.xml</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">       # XML</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -oG</span><span style="color:#98C379;"> scan.gnmap</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">     # Grepable</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 常用组合</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -sS</span><span style="color:#D19A66;"> -sV</span><span style="color:#D19A66;"> -O</span><span style="color:#D19A66;"> -p-</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">     # 全面扫描（较慢）</span></span>
<span class="line"><span style="color:#61AFEF;">nmap</span><span style="color:#D19A66;"> -T4</span><span style="color:#D19A66;"> -F</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">             # 快速扫描（常用端口）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">nmap 法律风险</p><p>nmap 是强大的网络侦察工具，但<strong>仅应在自己拥有或获得授权的系统上使用</strong>。未经授权扫描他人网络在大多数国家属于违法行为。</p></div><h3 id="_6-7-其他诊断工具" tabindex="-1"><a class="header-anchor" href="#_6-7-其他诊断工具"><span>6.7 其他诊断工具</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># curl - HTTP 请求</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> https://example.com</span><span style="color:#7F848E;font-style:italic;">          # 详细输出</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -I</span><span style="color:#98C379;"> https://example.com</span><span style="color:#7F848E;font-style:italic;">          # 只看响应头</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> /dev/null</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> &quot;%{http_code}\\n&quot;</span><span style="color:#98C379;"> https://example.com</span><span style="color:#7F848E;font-style:italic;">  # 只看状态码</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> --connect-timeout</span><span style="color:#D19A66;"> 5</span><span style="color:#98C379;"> https://example.com</span><span style="color:#7F848E;font-style:italic;">  # 超时 5 秒</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -x</span><span style="color:#98C379;"> socks5://proxy:1080</span><span style="color:#98C379;"> https://example.com</span><span style="color:#7F848E;font-style:italic;">  # 代理</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># wget - 下载</span></span>
<span class="line"><span style="color:#61AFEF;">wget</span><span style="color:#98C379;"> https://example.com/file.zip</span></span>
<span class="line"><span style="color:#61AFEF;">wget</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> https://example.com/file.zip</span><span style="color:#7F848E;font-style:italic;">    # 断点续传</span></span>
<span class="line"><span style="color:#61AFEF;">wget</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> https://example.com/file.zip</span><span style="color:#7F848E;font-style:italic;">    # 安静模式</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nc (netcat) - 网络瑞士军刀</span></span>
<span class="line"><span style="color:#61AFEF;">nc</span><span style="color:#D19A66;"> -zv</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#D19A66;"> 80</span><span style="color:#7F848E;font-style:italic;">              # 测试端口连通性</span></span>
<span class="line"><span style="color:#61AFEF;">nc</span><span style="color:#D19A66;"> -l</span><span style="color:#D19A66;"> 8080</span><span style="color:#7F848E;font-style:italic;">                           # 监听端口（服务端）</span></span>
<span class="line"><span style="color:#61AFEF;">nc</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#D19A66;"> 8080</span><span style="color:#7F848E;font-style:italic;">                # 连接端口（客户端）</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;hello&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">nc</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#D19A66;"> 8080</span><span style="color:#7F848E;font-style:italic;"> # 发送数据</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># mtr - 持续 traceroute</span></span>
<span class="line"><span style="color:#61AFEF;">mtr</span><span style="color:#D19A66;"> -n</span><span style="color:#D19A66;"> --report</span><span style="color:#98C379;"> google.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># dig - DNS 查询</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> +short</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nslookup - DNS 查询</span></span>
<span class="line"><span style="color:#61AFEF;">nslookup</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># arp - ARP 表</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> neigh</span><span style="color:#98C379;"> show</span><span style="color:#7F848E;font-style:italic;">                        # 现代</span></span>
<span class="line"><span style="color:#61AFEF;">arp</span><span style="color:#D19A66;"> -a</span><span style="color:#7F848E;font-style:italic;">                               # 传统</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ethtool - 网卡信息</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ethtool</span><span style="color:#98C379;"> eth0</span><span style="color:#7F848E;font-style:italic;">                    # 网卡详细信息</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ethtool</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> eth0</span><span style="color:#7F848E;font-style:italic;">                 # 驱动信息</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ethtool</span><span style="color:#D19A66;"> -S</span><span style="color:#98C379;"> eth0</span><span style="color:#7F848E;font-style:italic;">                 # 统计信息</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ethtool</span><span style="color:#D19A66;"> -k</span><span style="color:#98C379;"> eth0</span><span style="color:#7F848E;font-style:italic;">                 # 卸载特性</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># iperf3 - 带宽测试</span></span>
<span class="line"><span style="color:#61AFEF;">iperf3</span><span style="color:#D19A66;"> -s</span><span style="color:#7F848E;font-style:italic;">                            # 服务端</span></span>
<span class="line"><span style="color:#61AFEF;">iperf3</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#7F848E;font-style:italic;">              # 客户端</span></span>
<span class="line"><span style="color:#61AFEF;">iperf3</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#D19A66;"> -u</span><span style="color:#D19A66;"> -b</span><span style="color:#98C379;"> 1G</span><span style="color:#7F848E;font-style:italic;">    # UDP 测试，目标 1Gbps</span></span>
<span class="line"><span style="color:#61AFEF;">iperf3</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#D19A66;"> -R</span><span style="color:#7F848E;font-style:italic;">          # 反向测试</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-8-网络故障排查流程" tabindex="-1"><a class="header-anchor" href="#_6-8-网络故障排查流程"><span>6.8 网络故障排查流程</span></a></h3>`,14),i(d,{code:`eJx10sFr01AcB/C7f8Uju9pmSZq0GzIQh1AGrnU9CGWHNM2bwZiUJHPIKsxDsRvEVRCZMxhnNy/ThqlgnR3+L+JL2lP/BV/zkhDLklxy+L7v5/fyHlT1HemhaFigtnoD4Gejdvt+rU4FV6+CX87foT3ZO6Y2QS63AqrMLtVStC3AsMX8In6ZWw2DXvGdz75zid69D15605FLPQtrqsxsTRudXoy/n7XB3fIDpk75/T3fPQO1OxW6XAHIPhwPBv6HblgzeWGjnkdY37HRwQm1mW7yuz104LZBlY2mIC4oV1IoO4+yMYqLkX0y6djB1SD0lBZQFe0RoAH+EptNI+ZIR8JxETcr6HxLWdy8xaWs4PI3Pf7hBa8vYszQty0Za6LRiiXSkEiFSEKnb3AD3li4dDrqlvLhOx3tp/jCPF+IeeLSk6OvwfNz9PFtNIElNlTZxBNsw514AlKSTMDHE7gu6tkpjJ/H+OQwV+9thAAtWxJtyKauPslLugYx1FS2YogUJJCwSwX7P9HgODj30GGfXLOUJ5D4kRdiQowlW6LJDQlh0wQ5S9VaGNQei8nPJRWo96kN1tfq1B+nMzvC2eX60kfDIY6FOdN6qsrh9QRQUdXlBRkW8HNT0lXdWF6AEP4fY6MYXCpyjJAZ4+IYvyQvNjJjhSgmlngeFjNjfBTjGiUWZqNCFGNZiefl62Pra5mhf1QVnCA=`}),o[6]||=n(`<h2 id="_7-实战案例" tabindex="-1"><a class="header-anchor" href="#_7-实战案例"><span>7. 实战案例</span></a></h2><h3 id="_7-1-服务器网络初始化脚本" tabindex="-1"><a class="header-anchor" href="#_7-1-服务器网络初始化脚本"><span>7.1 服务器网络初始化脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Ubuntu Server 网络初始化</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 配置静态 IP（Netplan）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/netplan/01-static.yaml</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">network:</span></span>
<span class="line"><span style="color:#98C379;">  version: 2</span></span>
<span class="line"><span style="color:#98C379;">  ethernets:</span></span>
<span class="line"><span style="color:#98C379;">    eth0:</span></span>
<span class="line"><span style="color:#98C379;">      addresses: [192.168.1.100/24]</span></span>
<span class="line"><span style="color:#98C379;">      routes:</span></span>
<span class="line"><span style="color:#98C379;">        - to: default</span></span>
<span class="line"><span style="color:#98C379;">          via: 192.168.1.1</span></span>
<span class="line"><span style="color:#98C379;">      nameservers:</span></span>
<span class="line"><span style="color:#98C379;">        addresses: [8.8.8.8, 223.5.5.5]</span></span>
<span class="line"><span style="color:#98C379;">      dhcp4: false</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> netplan</span><span style="color:#98C379;"> apply</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 配置防火墙</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> deny</span><span style="color:#98C379;"> incoming</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> outgoing</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> ssh</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> http</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> https</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#D19A66;"> --force</span><span style="color:#98C379;"> enable</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 配置 SSH</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/^#*PermitRootLogin.*/PermitRootLogin no/&#39;</span><span style="color:#98C379;"> /etc/ssh/sshd_config</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/^#*PasswordAuthentication.*/PasswordAuthentication no/&#39;</span><span style="color:#98C379;"> /etc/ssh/sshd_config</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> sshd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 启用 IP 转发（如果需要）</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;net.ipv4.ip_forward = 1&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/sysctl.d/99-ipforward.conf</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /etc/sysctl.d/99-ipforward.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 验证</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== IP 地址 ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#D19A66;"> -4</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 路由 ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> show</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== DNS ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /etc/resolv.conf</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 防火墙 ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> status</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== SSH ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sshd</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -E</span><span style="color:#98C379;"> &#39;permitrootlogin|passwordauthentication&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-网络性能调优" tabindex="-1"><a class="header-anchor" href="#_7-2-网络性能调优"><span>7.2 网络性能调优</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 调整 TCP 缓冲区</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.core.rmem_max=</span><span style="color:#D19A66;">16777216</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.core.wmem_max=</span><span style="color:#D19A66;">16777216</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.ipv4.tcp_rmem=&#39;4096 87380 16777216&#39;</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.ipv4.tcp_wmem=&#39;4096 65536 16777216&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 启用 TCP Fast Open</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.ipv4.tcp_fastopen=</span><span style="color:#D19A66;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 调整连接队列</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.core.somaxconn=</span><span style="color:#D19A66;">65535</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.ipv4.tcp_max_syn_backlog=</span><span style="color:#D19A66;">65535</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 减少 TIME_WAIT</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.ipv4.tcp_fin_timeout=</span><span style="color:#D19A66;">15</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.ipv4.tcp_tw_reuse=</span><span style="color:#D19A66;">1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 启用 BBR 拥塞控制（Linux 4.9+）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.core.default_qdisc=fq</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.ipv4.tcp_congestion_control=bbr</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证</span></span>
<span class="line"><span style="color:#61AFEF;">sysctl</span><span style="color:#98C379;"> net.ipv4.tcp_congestion_control</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># net.ipv4.tcp_congestion_control = bbr</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 持久化</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/sysctl.d/99-network-tuning.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">net.core.rmem_max = 16777216</span></span>
<span class="line"><span style="color:#98C379;">net.core.wmem_max = 16777216</span></span>
<span class="line"><span style="color:#98C379;">net.ipv4.tcp_rmem = 4096 87380 16777216</span></span>
<span class="line"><span style="color:#98C379;">net.ipv4.tcp_wmem = 4096 65536 16777216</span></span>
<span class="line"><span style="color:#98C379;">net.core.somaxconn = 65535</span></span>
<span class="line"><span style="color:#98C379;">net.ipv4.tcp_max_syn_backlog = 65535</span></span>
<span class="line"><span style="color:#98C379;">net.ipv4.tcp_fin_timeout = 15</span></span>
<span class="line"><span style="color:#98C379;">net.ipv4.tcp_tw_reuse = 1</span></span>
<span class="line"><span style="color:#98C379;">net.core.default_qdisc = fq</span></span>
<span class="line"><span style="color:#98C379;">net.ipv4.tcp_congestion_control = bbr</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-ssh-跳板机配置" tabindex="-1"><a class="header-anchor" href="#_7-3-ssh-跳板机配置"><span>7.3 SSH 跳板机配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 场景：通过跳板机访问生产服务器</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ~/.ssh/config</span></span>
<span class="line"><span style="color:#61AFEF;">Host</span><span style="color:#98C379;"> bastion</span></span>
<span class="line"><span style="color:#61AFEF;">    HostName</span><span style="color:#98C379;"> bastion.example.com</span></span>
<span class="line"><span style="color:#61AFEF;">    User</span><span style="color:#98C379;"> admin</span></span>
<span class="line"><span style="color:#61AFEF;">    Port</span><span style="color:#D19A66;"> 22</span></span>
<span class="line"><span style="color:#61AFEF;">    IdentityFile</span><span style="color:#98C379;"> ~/.ssh/bastion_key</span></span>
<span class="line"><span style="color:#61AFEF;">    ServerAliveInterval</span><span style="color:#D19A66;"> 60</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">Host</span><span style="color:#98C379;"> prod-web-01</span></span>
<span class="line"><span style="color:#61AFEF;">    HostName</span><span style="color:#D19A66;"> 10.0.1.10</span></span>
<span class="line"><span style="color:#61AFEF;">    User</span><span style="color:#98C379;"> deploy</span></span>
<span class="line"><span style="color:#61AFEF;">    IdentityFile</span><span style="color:#98C379;"> ~/.ssh/prod_key</span></span>
<span class="line"><span style="color:#61AFEF;">    ProxyJump</span><span style="color:#98C379;"> bastion</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">Host</span><span style="color:#98C379;"> prod-db-01</span></span>
<span class="line"><span style="color:#61AFEF;">    HostName</span><span style="color:#D19A66;"> 10.0.2.10</span></span>
<span class="line"><span style="color:#61AFEF;">    User</span><span style="color:#98C379;"> deploy</span></span>
<span class="line"><span style="color:#61AFEF;">    IdentityFile</span><span style="color:#98C379;"> ~/.ssh/prod_key</span></span>
<span class="line"><span style="color:#61AFEF;">    ProxyJump</span><span style="color:#98C379;"> bastion</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">Host</span><span style="color:#98C379;"> prod-</span><span style="color:#E5C07B;">*</span></span>
<span class="line"><span style="color:#61AFEF;">    User</span><span style="color:#98C379;"> deploy</span></span>
<span class="line"><span style="color:#61AFEF;">    IdentityFile</span><span style="color:#98C379;"> ~/.ssh/prod_key</span></span>
<span class="line"><span style="color:#61AFEF;">    ProxyJump</span><span style="color:#98C379;"> bastion</span></span>
<span class="line"><span style="color:#61AFEF;">    ServerAliveInterval</span><span style="color:#D19A66;"> 30</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> prod-web-01</span><span style="color:#7F848E;font-style:italic;">         # 自动通过跳板机连接</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> prod-db-01</span><span style="color:#7F848E;font-style:italic;">          # 同上</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SCP 通过跳板机</span></span>
<span class="line"><span style="color:#61AFEF;">scp</span><span style="color:#98C379;"> file.txt</span><span style="color:#98C379;"> prod-web-01:/tmp/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 端口转发</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#D19A66;"> -L</span><span style="color:#98C379;"> 3306:10.0.2.10:3306</span><span style="color:#98C379;"> bastion</span><span style="color:#7F848E;font-style:italic;">   # 本地 3306 → 生产 MySQL</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#D19A66;"> -D</span><span style="color:#D19A66;"> 1080</span><span style="color:#98C379;"> bastion</span><span style="color:#7F848E;font-style:italic;">                   # SOCKS 代理</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SSH VPN（需要 root）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ssh</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> 0:1</span><span style="color:#98C379;"> bastion</span><span style="color:#7F848E;font-style:italic;">               # 创建 tun 设备</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_8-总结" tabindex="-1"><a class="header-anchor" href="#_8-总结"><span>8. 总结</span></a></h2><table><thead><tr><th>知识点</th><th>关键内容</th></tr></thead><tbody><tr><td>网络接口</td><td>ip 命令替代 ifconfig，Netplan/nmcli 永久配置</td></tr><tr><td>静态 IP vs DHCP</td><td>服务器必须静态，桌面可用 DHCP</td></tr><tr><td>路由表</td><td>ip route，最长前缀匹配，策略路由</td></tr><tr><td>IP 转发</td><td>net.ipv4.ip_forward，路由器/NAT 需要</td></tr><tr><td>DNS 解析</td><td>/etc/hosts → /etc/resolv.conf → DNS 服务器</td></tr><tr><td>防火墙</td><td>iptables（底层）→ ufw/firewalld（前端）</td></tr><tr><td>SSH</td><td>密钥认证优于密码，~/.ssh/config 简化连接</td></tr><tr><td>网络诊断</td><td>ping → traceroute → ss → tcpdump → nmap</td></tr></tbody></table><p>Linux 网络是运维和开发人员的核心技能。从配置 IP 到排查网络故障，从防火墙策略到 SSH 安全加固，每一项都直接影响系统的可用性和安全性。正如鸟哥在《Linux 私房菜》中所说：&quot;网络是 Linux 的灵魂，掌握网络就掌握了 Linux 的一半。&quot;</p>`,10)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};