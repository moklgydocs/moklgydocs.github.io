import{A as e,E as t,d as n,l as r,p as i,s as a}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as o}from"./app-CVKw_sbS.js";var s=JSON.parse(`{"path":"/Linux/02_Linux%E8%BF%9B%E9%98%B6/03_%E7%BD%91%E7%BB%9C%E9%85%8D%E7%BD%AE%E4%B8%8E%E6%9C%8D%E5%8A%A1.html","title":"网络配置与服务","lang":"zh-CN","frontmatter":{"title":"网络配置与服务","icon":"fa6-solid:network-wired","order":3,"category":["Linux","Linux进阶"],"tag":["网络配置","路由","DNS","防火墙","抓包"]},"git":{"createdTime":1780586585000,"updatedTime":1780586585000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":17.39,"words":5218},"filePathRelative":"Linux/02_Linux进阶/03_网络配置与服务.md"}`),c={name:`03_网络配置与服务.md`};function l(o,s,c,l,u,d){let f=e(`Mermaid`);return t(),r(`div`,null,[s[0]||=n(`<h1 id="网络配置与服务" tabindex="-1"><a class="header-anchor" href="#网络配置与服务"><span>网络配置与服务</span></a></h1><blockquote><p>网络是连接世界的桥梁——掌握 Linux 网络配置，就是掌握了系统与外部通信的命脉。</p><p>本章参考：《鸟哥的 Linux 私房菜》（第四版）第五章与第六章、《TCP/IP 详解》卷一。</p></blockquote><h2 id="一、linux-网络协议栈概览" tabindex="-1"><a class="header-anchor" href="#一、linux-网络协议栈概览"><span>一、Linux 网络协议栈概览</span></a></h2><h3 id="_1-1-数据流向" tabindex="-1"><a class="header-anchor" href="#_1-1-数据流向"><span>1.1 数据流向</span></a></h3><p>Linux 网络协议栈是一个分层处理系统，数据从应用程序发出，经过各层协议处理后到达网卡，反之亦然：</p>`,5),i(f,{code:`eJx9ks1K60AYhvdeRYgbhSPp0fNXFwdq2khQa7RRF9VFjRMbDElJRkVwo+Af4i+iLgQtulBQURCVFvVmmqTehV9mkpqqdRbJTL5n3pl5Mqpuzir5nIUZOdnEQLOnxyetXCHPeHvn7uqDd1F6PbjLstERO0ZIvyUkKcs6pT0oe+frTmlr1GixTWUK4daAQsZEU32ws7zknjyGwdFRJHhCs5CCNdNg5K7ax0w/35OSs2yGrMA4t4uwnMxL3FBS4gYTI+GafhPTPuk/A06UOJHvg0d3nxQFgRDEXjk1mGXTCKuajpHFjRpaAefGdWRzhko79VOSqWGQ8rTjlY+q18/O2QpdBFs5VdUURjENbJl6Ywle8bJSvocI8obJ0XiRJ9nORhEiEc7HOGQUYnbHpzjQz7S1/Z9nbfjU0srOB4pIkXZpPZDk3CxUT5cA870QiAgiiPherSkhSG1EuerLils+49IJmZJgIsSgS5kBM8O5m7uvh8c+I/IUEHla9dYuvO3lykvR2XqgGaFKOF+Y9TX6MaryeOXuXzXayHcH+aygkTu4iDPELdgO/iKe01EkDi6N3tksCPF/sdgPxdRNq7NZVdUIG+RR8BefEH43AMlmKNb+M/5H6Pga8wVQKs63/+2qC3sDOvJJzw==`}),s[1]||=n(`<h3 id="_1-2-网络接口命名" tabindex="-1"><a class="header-anchor" href="#_1-2-网络接口命名"><span>1.2 网络接口命名</span></a></h3><p>传统命名（eth0、eth1）已被 systemd/udev 的可预测命名规则替代：</p><table><thead><tr><th>命名规则</th><th>格式</th><th>示例</th></tr></thead><tbody><tr><td>基于 BIOS</td><td>eno[编号]</td><td>eno1</td></tr><tr><td>基于 PCI 插槽</td><td>enp[插槽]s[编号]</td><td>enp0s3</td></tr><tr><td>基于 MAC</td><td>enx[MAC地址]</td><td>enx001122334455</td></tr><tr><td>传统命名</td><td>eth[编号]</td><td>eth0</td></tr></tbody></table><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看所有网络接口</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> show</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出示例：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 65536 ...</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2: enp0s3: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 ...</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3: docker0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 恢复传统命名（如需）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 /etc/default/grub 中添加：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># GRUB_CMDLINE_LINUX=&quot;net.ifnames=0 biosdevname=0&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> update-grub</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、网络接口管理" tabindex="-1"><a class="header-anchor" href="#二、网络接口管理"><span>二、网络接口管理</span></a></h2><h3 id="_2-1-ip-命令-推荐替代-ifconfig" tabindex="-1"><a class="header-anchor" href="#_2-1-ip-命令-推荐替代-ifconfig"><span>2.1 ip 命令（推荐替代 ifconfig）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 链路层管理（ip link）==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看所有接口</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> show</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看指定接口</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启用/禁用接口</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> up</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> down</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改 MTU</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> mtu</span><span style="color:#D19A66;"> 9000</span><span style="color:#7F848E;font-style:italic;">    # 开启 Jumbo Frame</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改 MAC 地址</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> down</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> address</span><span style="color:#98C379;"> 00:11:22:33:44:55</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> up</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改接口名称</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> name</span><span style="color:#98C379;"> eth0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== IP 地址管理（ip addr）==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看所有地址</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> show</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> a</span><span style="color:#7F848E;font-style:italic;">    # 简写</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看指定接口的地址</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加 IP 地址</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 192.168.1.100/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加辅助 IP（同一接口多个 IP）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 192.168.1.101/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除 IP 地址</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> del</span><span style="color:#98C379;"> 192.168.1.100/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 清空接口所有 IP</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> flush</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 路由管理（ip route）==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看路由表</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> show</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#7F848E;font-style:italic;">    # 简写</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看默认路由</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> default</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加默认路由</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> via</span><span style="color:#D19A66;"> 192.168.1.1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加静态路由</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 10.0.0.0/8</span><span style="color:#98C379;"> via</span><span style="color:#D19A66;"> 192.168.1.254</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 172.16.0.0/12</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除路由</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> del</span><span style="color:#98C379;"> 10.0.0.0/8</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通过指定接口路由</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 192.168.100.0/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> src</span><span style="color:#D19A66;"> 192.168.1.100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 邻居表（ip neigh）==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 ARP 缓存</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> neigh</span><span style="color:#98C379;"> show</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加静态 ARP 条目</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> neigh</span><span style="color:#98C379;"> add</span><span style="color:#D19A66;"> 192.168.1.1</span><span style="color:#98C379;"> lladdr</span><span style="color:#98C379;"> 00:11:22:33:44:55</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除 ARP 条目</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> neigh</span><span style="color:#98C379;"> del</span><span style="color:#D19A66;"> 192.168.1.1</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 清空 ARP 缓存</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> neigh</span><span style="color:#98C379;"> flush</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> enp0s3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-netplan-ubuntu-18-04" tabindex="-1"><a class="header-anchor" href="#_2-2-netplan-ubuntu-18-04"><span>2.2 Netplan（Ubuntu 18.04+）</span></a></h3><p>Ubuntu 从 18.04 开始使用 Netplan 作为默认网络配置工具：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/netplan/01-netcfg.yaml</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 静态 IP 配置</span></span>
<span class="line"><span style="color:#E06C75;">network</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  version</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#E06C75;">  renderer</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networkd</span></span>
<span class="line"><span style="color:#E06C75;">  ethernets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    enp0s3</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      dhcp4</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">no</span></span>
<span class="line"><span style="color:#E06C75;">      addresses</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">192.168.1.100/24</span></span>
<span class="line"><span style="color:#E06C75;">      routes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">          via</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">192.168.1.1</span></span>
<span class="line"><span style="color:#E06C75;">      nameservers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        addresses</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#D19A66;">223.5.5.5</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#D19A66;">119.29.29.29</span></span>
<span class="line"><span style="color:#E06C75;">        search</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">example.com</span></span>
<span class="line"><span style="color:#E06C75;">      mtu</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1500</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/netplan/02-dhcp.yaml</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DHCP 配置</span></span>
<span class="line"><span style="color:#E06C75;">network</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  version</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#E06C75;">  renderer</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networkd</span></span>
<span class="line"><span style="color:#E06C75;">  ethernets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    enp0s3</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      dhcp4</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">      dhcp4-overrides</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        use-dns</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">false</span><span style="color:#7F848E;font-style:italic;">    # 不使用 DHCP 提供的 DNS</span></span>
<span class="line"><span style="color:#E06C75;">      nameservers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        addresses</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#D19A66;">223.5.5.5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/netplan/03-bond-vlan.yaml</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Bond + VLAN 配置</span></span>
<span class="line"><span style="color:#E06C75;">network</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  version</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#E06C75;">  renderer</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networkd</span></span>
<span class="line"><span style="color:#E06C75;">  bonds</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    bond0</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      interfaces</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">enp0s3</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">enp0s8</span></span>
<span class="line"><span style="color:#E06C75;">      parameters</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">active-backup</span></span>
<span class="line"><span style="color:#E06C75;">        primary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">enp0s3</span></span>
<span class="line"><span style="color:#E06C75;">        mii-monitor-interval</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span></span>
<span class="line"><span style="color:#E06C75;">      addresses</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">192.168.1.100/24</span></span>
<span class="line"><span style="color:#E06C75;">      routes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">default</span></span>
<span class="line"><span style="color:#E06C75;">          via</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">192.168.1.1</span></span>
<span class="line"><span style="color:#E06C75;">  vlans</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    bond0.100</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      id</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span></span>
<span class="line"><span style="color:#E06C75;">      link</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bond0</span></span>
<span class="line"><span style="color:#E06C75;">      addresses</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">10.100.0.1/24</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 应用 Netplan 配置</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> netplan</span><span style="color:#98C379;"> apply</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 测试配置（不会真正应用，超时后回滚）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> netplan</span><span style="color:#98C379;"> try</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成后端配置（调试用）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> netplan</span><span style="color:#98C379;"> generate</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-network-scripts-centos-rhel-7-8" tabindex="-1"><a class="header-anchor" href="#_2-3-network-scripts-centos-rhel-7-8"><span>2.3 network-scripts（CentOS/RHEL 7/8）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/sysconfig/network-scripts/ifcfg-enp0s3</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 静态 IP 配置</span></span>
<span class="line"><span style="color:#E06C75;">TYPE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">Ethernet</span></span>
<span class="line"><span style="color:#E06C75;">BOOTPROTO</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">static</span></span>
<span class="line"><span style="color:#E06C75;">NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">enp0s3</span></span>
<span class="line"><span style="color:#E06C75;">DEVICE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">enp0s3</span></span>
<span class="line"><span style="color:#E06C75;">ONBOOT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">yes</span></span>
<span class="line"><span style="color:#E06C75;">IPADDR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">192.168.1.100</span></span>
<span class="line"><span style="color:#E06C75;">PREFIX</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">24</span></span>
<span class="line"><span style="color:#E06C75;">GATEWAY</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">192.168.1.1</span></span>
<span class="line"><span style="color:#E06C75;">DNS1</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">223.5.5.5</span></span>
<span class="line"><span style="color:#E06C75;">DNS2</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">119.29.29.29</span></span>
<span class="line"><span style="color:#E06C75;">MTU</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1500</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== DHCP 配置 ==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TYPE=Ethernet</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># BOOTPROTO=dhcp</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># NAME=enp0s3</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DEVICE=enp0s3</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ONBOOT=yes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 应用配置 ==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CentOS 7</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> network</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CentOS 8+（使用 NetworkManager）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> up</span><span style="color:#98C379;"> enp0s3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-networkmanager-nmcli" tabindex="-1"><a class="header-anchor" href="#_2-4-networkmanager-nmcli"><span>2.4 NetworkManager（nmcli）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 查看连接 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">nmcli</span><span style="color:#98C379;"> device</span><span style="color:#98C379;"> status</span></span>
<span class="line"><span style="color:#61AFEF;">nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> show</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 创建静态 IP 连接 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> add</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    con-name</span><span style="color:#98C379;"> static-eth0</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    type</span><span style="color:#98C379;"> ethernet</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ifname</span><span style="color:#98C379;"> enp0s3</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ipv4.method</span><span style="color:#98C379;"> manual</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ipv4.addresses</span><span style="color:#98C379;"> 192.168.1.100/24</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ipv4.gateway</span><span style="color:#D19A66;"> 192.168.1.1</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ipv4.dns</span><span style="color:#98C379;"> &quot;223.5.5.5 119.29.29.29&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 创建 DHCP 连接 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> add</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    con-name</span><span style="color:#98C379;"> dhcp-eth0</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    type</span><span style="color:#98C379;"> ethernet</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ifname</span><span style="color:#98C379;"> enp0s3</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ipv4.method</span><span style="color:#98C379;"> auto</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 修改连接 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> modify</span><span style="color:#98C379;"> static-eth0</span><span style="color:#98C379;"> ipv4.addresses</span><span style="color:#98C379;"> 192.168.1.200/24</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> modify</span><span style="color:#98C379;"> static-eth0</span><span style="color:#98C379;"> +ipv4.dns</span><span style="color:#D19A66;"> 8.8.8.8</span><span style="color:#7F848E;font-style:italic;">   # 追加 DNS</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> modify</span><span style="color:#98C379;"> static-eth0</span><span style="color:#D19A66;"> -ipv4.dns</span><span style="color:#D19A66;"> 8.8.8.8</span><span style="color:#7F848E;font-style:italic;">   # 删除 DNS</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 启用/禁用连接 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> up</span><span style="color:#98C379;"> static-eth0</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> down</span><span style="color:#98C379;"> static-eth0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 删除连接 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> delete</span><span style="color:#98C379;"> static-eth0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 查看详细信息 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> static-eth0</span></span>
<span class="line"><span style="color:#61AFEF;">nmcli</span><span style="color:#98C379;"> device</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 交互式编辑 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">nmtui</span><span style="color:#7F848E;font-style:italic;">    # 文本 UI 编辑器</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、路由配置" tabindex="-1"><a class="header-anchor" href="#三、路由配置"><span>三、路由配置</span></a></h2><h3 id="_3-1-静态路由" tabindex="-1"><a class="header-anchor" href="#_3-1-静态路由"><span>3.1 静态路由</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 基本路由操作 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看路由表</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> show</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># default via 192.168.1.1 dev enp0s3</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 192.168.1.0/24 dev enp0s3 proto kernel scope link src 192.168.1.100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加主机路由</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 10.10.10.5/32</span><span style="color:#98C379;"> via</span><span style="color:#D19A66;"> 192.168.1.254</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加网络路由</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 10.10.0.0/16</span><span style="color:#98C379;"> via</span><span style="color:#D19A66;"> 192.168.1.254</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加默认路由</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> via</span><span style="color:#D19A66;"> 192.168.1.1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改默认路由</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> replace</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> via</span><span style="color:#D19A66;"> 192.168.1.2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除路由</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> del</span><span style="color:#98C379;"> 10.10.0.0/16</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 持久化路由配置 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Ubuntu (Netplan)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 netplan 配置文件中添加 routes:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># routes:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   - to: 10.0.0.0/8</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     via: 192.168.1.254</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   - to: 172.16.0.0/12</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     via: 192.168.1.254</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CentOS (network-scripts)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/sysconfig/network-scripts/route-enp0s3</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 10.0.0.0/8 via 192.168.1.254 dev enp0s3</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 172.16.0.0/12 via 192.168.1.254 dev enp0s3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-策略路由" tabindex="-1"><a class="header-anchor" href="#_3-2-策略路由"><span>3.2 策略路由</span></a></h3><p>策略路由允许根据源地址、接口等条件选择不同的路由表：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 策略路由配置 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 创建自定义路由表</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;100 custom_table&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> /etc/iproute2/rt_tables</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 在自定义路由表中添加路由</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> via</span><span style="color:#D19A66;"> 10.0.0.1</span><span style="color:#98C379;"> table</span><span style="color:#98C379;"> custom_table</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 10.0.0.0/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> enp0s8</span><span style="color:#98C379;"> table</span><span style="color:#98C379;"> custom_table</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 添加策略规则</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 按源地址选择路由表</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> rule</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> from</span><span style="color:#98C379;"> 192.168.2.0/24</span><span style="color:#98C379;"> table</span><span style="color:#98C379;"> custom_table</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 按入接口选择路由表</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> rule</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> iif</span><span style="color:#98C379;"> enp0s8</span><span style="color:#98C379;"> table</span><span style="color:#98C379;"> custom_table</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 按标记选择路由表</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> rule</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> fwmark</span><span style="color:#D19A66;"> 0x1</span><span style="color:#98C379;"> table</span><span style="color:#98C379;"> custom_table</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 查看策略路由 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看所有规则</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> rule</span><span style="color:#98C379;"> show</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 0:      from all lookup local</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 32766:  from all lookup main</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 32767:  from all lookup default</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 100:    from 192.168.2.0/24 lookup custom_table</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看自定义路由表</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> table</span><span style="color:#98C379;"> custom_table</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 双网卡双网关场景 ==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 场景：服务器有两个网卡，分别连接不同的网络</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主路由表（网卡1：公网）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> via</span><span style="color:#D19A66;"> 202.1.1.1</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 自定义路由表（网卡2：内网）</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;200 inner&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> /etc/iproute2/rt_tables</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> default</span><span style="color:#98C379;"> via</span><span style="color:#D19A66;"> 10.0.0.1</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> enp0s8</span><span style="color:#98C379;"> table</span><span style="color:#98C379;"> inner</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> rule</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> from</span><span style="color:#D19A66;"> 10.0.0.100</span><span style="color:#98C379;"> table</span><span style="color:#98C379;"> inner</span><span style="color:#7F848E;font-style:italic;">    # 网卡2 的 IP 走内网网关</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 持久化策略路由 ==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Ubuntu: 在 Netplan 中使用 routing-policy</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CentOS: /etc/sysconfig/network-scripts/rule-enp0s8</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># from 10.0.0.0/24 table inner</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、桥接、vlan-与-bonding" tabindex="-1"><a class="header-anchor" href="#四、桥接、vlan-与-bonding"><span>四、桥接、VLAN 与 Bonding</span></a></h2><h3 id="_4-1-网桥-bridge" tabindex="-1"><a class="header-anchor" href="#_4-1-网桥-bridge"><span>4.1 网桥（Bridge）</span></a></h3><p>网桥工作在数据链路层，用于连接多个网络段，常用于虚拟化和容器网络：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 创建网桥 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ip 命令方式</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> name</span><span style="color:#98C379;"> br0</span><span style="color:#98C379;"> type</span><span style="color:#98C379;"> bridge</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> br0</span><span style="color:#98C379;"> up</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 将物理接口加入网桥</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> master</span><span style="color:#98C379;"> br0</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 192.168.1.100/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> br0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从网桥移除接口</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> nomaster</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除网桥</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> delete</span><span style="color:#98C379;"> br0</span><span style="color:#98C379;"> type</span><span style="color:#98C379;"> bridge</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== Netplan 配置网桥 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">network:</span></span>
<span class="line"><span style="color:#61AFEF;">  version:</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#61AFEF;">  renderer:</span><span style="color:#98C379;"> networkd</span></span>
<span class="line"><span style="color:#61AFEF;">  bridges:</span></span>
<span class="line"><span style="color:#61AFEF;">    br0:</span></span>
<span class="line"><span style="color:#61AFEF;">      interfaces:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"><span style="color:#61AFEF;">      addresses:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> 192.168.1.100/24</span></span>
<span class="line"><span style="color:#61AFEF;">      routes:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> to:</span><span style="color:#98C379;"> default</span></span>
<span class="line"><span style="color:#61AFEF;">          via:</span><span style="color:#D19A66;"> 192.168.1.1</span></span>
<span class="line"><span style="color:#61AFEF;">      nameservers:</span></span>
<span class="line"><span style="color:#61AFEF;">        addresses:</span></span>
<span class="line"><span style="color:#61AFEF;">          -</span><span style="color:#D19A66;"> 223.5.5.5</span></span>
<span class="line"><span style="color:#61AFEF;">      parameters:</span></span>
<span class="line"><span style="color:#61AFEF;">        stp:</span><span style="color:#D19A66;"> true</span></span>
<span class="line"><span style="color:#61AFEF;">        forward-delay:</span><span style="color:#D19A66;"> 15</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== nmcli 配置网桥 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> type</span><span style="color:#98C379;"> bridge</span><span style="color:#98C379;"> con-name</span><span style="color:#98C379;"> br0</span><span style="color:#98C379;"> ifname</span><span style="color:#98C379;"> br0</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ipv4.method</span><span style="color:#98C379;"> manual</span><span style="color:#98C379;"> ipv4.addresses</span><span style="color:#98C379;"> 192.168.1.100/24</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ipv4.gateway</span><span style="color:#D19A66;"> 192.168.1.1</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> type</span><span style="color:#98C379;"> bridge-slave</span><span style="color:#98C379;"> con-name</span><span style="color:#98C379;"> br0-port0</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ifname</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> master</span><span style="color:#98C379;"> br0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 查看网桥信息 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">bridge</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> show</span></span>
<span class="line"><span style="color:#61AFEF;">bridge</span><span style="color:#98C379;"> fdb</span><span style="color:#98C379;"> show</span><span style="color:#7F848E;font-style:italic;">    # MAC 转发表</span></span>
<span class="line"><span style="color:#61AFEF;">brctl</span><span style="color:#98C379;"> show</span><span style="color:#7F848E;font-style:italic;">         # 旧命令（需安装 bridge-utils）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-vlan" tabindex="-1"><a class="header-anchor" href="#_4-2-vlan"><span>4.2 VLAN</span></a></h3><p>VLAN（Virtual LAN）在数据链路层对网络进行逻辑隔离：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 创建 VLAN 接口 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ip 命令方式</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> name</span><span style="color:#98C379;"> enp0s3.100</span><span style="color:#98C379;"> type</span><span style="color:#98C379;"> vlan</span><span style="color:#98C379;"> id</span><span style="color:#D19A66;"> 100</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> enp0s3.100</span><span style="color:#98C379;"> up</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 10.100.0.1/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> enp0s3.100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除 VLAN</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> delete</span><span style="color:#98C379;"> enp0s3.100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== Netplan 配置 VLAN ==========</span></span>
<span class="line"><span style="color:#61AFEF;">network:</span></span>
<span class="line"><span style="color:#61AFEF;">  version:</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#61AFEF;">  renderer:</span><span style="color:#98C379;"> networkd</span></span>
<span class="line"><span style="color:#61AFEF;">  ethernets:</span></span>
<span class="line"><span style="color:#61AFEF;">    enp0s3:</span></span>
<span class="line"><span style="color:#61AFEF;">      dhcp4:</span><span style="color:#D19A66;"> false</span></span>
<span class="line"><span style="color:#61AFEF;">  vlans:</span></span>
<span class="line"><span style="color:#61AFEF;">    enp0s3.100:</span></span>
<span class="line"><span style="color:#61AFEF;">      id:</span><span style="color:#D19A66;"> 100</span></span>
<span class="line"><span style="color:#61AFEF;">      link:</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"><span style="color:#61AFEF;">      addresses:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> 10.100.0.1/24</span></span>
<span class="line"><span style="color:#61AFEF;">    enp0s3.200:</span></span>
<span class="line"><span style="color:#61AFEF;">      id:</span><span style="color:#D19A66;"> 200</span></span>
<span class="line"><span style="color:#61AFEF;">      link:</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"><span style="color:#61AFEF;">      addresses:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> 10.200.0.1/24</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== nmcli 配置 VLAN ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nmcli</span><span style="color:#98C379;"> connection</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> type</span><span style="color:#98C379;"> vlan</span><span style="color:#98C379;"> con-name</span><span style="color:#98C379;"> vlan100</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    dev</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> id</span><span style="color:#D19A66;"> 100</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    ipv4.method</span><span style="color:#98C379;"> manual</span><span style="color:#98C379;"> ipv4.addresses</span><span style="color:#98C379;"> 10.100.0.1/24</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 查看_VLAN 信息 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> enp0s3.100</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># vlan protocol 802.1Q id 100</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-bonding-链路聚合" tabindex="-1"><a class="header-anchor" href="#_4-3-bonding-链路聚合"><span>4.3 Bonding（链路聚合）</span></a></h3><p>Bonding 将多个物理网卡绑定为一个逻辑接口，提供冗余和/或负载均衡：</p><table><thead><tr><th>模式</th><th>名称</th><th>需要交换机支持</th><th>特点</th></tr></thead><tbody><tr><td>0</td><td>balance-rr</td><td>是</td><td>轮转，性能最好但无容错</td></tr><tr><td>1</td><td>active-backup</td><td>否</td><td>主备切换，高可用</td></tr><tr><td>2</td><td>balance-xor</td><td>是</td><td>基于 MAC 的 XOR</td></tr><tr><td>3</td><td>broadcast</td><td>是</td><td>所有包从所有接口发送</td></tr><tr><td>4</td><td>802.3ad</td><td>是(LACP)</td><td>动态链路聚合，需要交换机配置</td></tr><tr><td>5</td><td>balance-tlb</td><td>否</td><td>发送负载均衡</td></tr><tr><td>6</td><td>balance-alb</td><td>否</td><td>发送+接收负载均衡</td></tr></tbody></table><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== ip 命令方式创建 Bond ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> bond0</span><span style="color:#98C379;"> type</span><span style="color:#98C379;"> bond</span><span style="color:#98C379;"> mode</span><span style="color:#98C379;"> active-backup</span><span style="color:#98C379;"> miimon</span><span style="color:#D19A66;"> 100</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> down</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> enp0s8</span><span style="color:#98C379;"> down</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> master</span><span style="color:#98C379;"> bond0</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> enp0s8</span><span style="color:#98C379;"> master</span><span style="color:#98C379;"> bond0</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> bond0</span><span style="color:#98C379;"> up</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> 192.168.1.100/24</span><span style="color:#98C379;"> dev</span><span style="color:#98C379;"> bond0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== Netplan 配置 Bond ==========</span></span>
<span class="line"><span style="color:#61AFEF;">network:</span></span>
<span class="line"><span style="color:#61AFEF;">  version:</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#61AFEF;">  renderer:</span><span style="color:#98C379;"> networkd</span></span>
<span class="line"><span style="color:#61AFEF;">  bonds:</span></span>
<span class="line"><span style="color:#61AFEF;">    bond0:</span></span>
<span class="line"><span style="color:#61AFEF;">      interfaces:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> enp0s8</span></span>
<span class="line"><span style="color:#61AFEF;">      parameters:</span></span>
<span class="line"><span style="color:#61AFEF;">        mode:</span><span style="color:#98C379;"> active-backup</span></span>
<span class="line"><span style="color:#61AFEF;">        primary:</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"><span style="color:#61AFEF;">        mii-monitor-interval:</span><span style="color:#D19A66;"> 100</span></span>
<span class="line"><span style="color:#61AFEF;">      addresses:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> 192.168.1.100/24</span></span>
<span class="line"><span style="color:#61AFEF;">      routes:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> to:</span><span style="color:#98C379;"> default</span></span>
<span class="line"><span style="color:#61AFEF;">          via:</span><span style="color:#D19A66;"> 192.168.1.1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== LACP (802.3ad) 配置 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">network:</span></span>
<span class="line"><span style="color:#61AFEF;">  version:</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#61AFEF;">  bonds:</span></span>
<span class="line"><span style="color:#61AFEF;">    bond0:</span></span>
<span class="line"><span style="color:#61AFEF;">      interfaces:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> enp0s8</span></span>
<span class="line"><span style="color:#61AFEF;">      parameters:</span></span>
<span class="line"><span style="color:#61AFEF;">        mode:</span><span style="color:#98C379;"> 802.3ad</span></span>
<span class="line"><span style="color:#61AFEF;">        lacp-rate:</span><span style="color:#98C379;"> fast</span></span>
<span class="line"><span style="color:#61AFEF;">        mii-monitor-interval:</span><span style="color:#D19A66;"> 100</span></span>
<span class="line"><span style="color:#61AFEF;">        transmit-hash-policy:</span><span style="color:#98C379;"> layer2+3</span></span>
<span class="line"><span style="color:#61AFEF;">      addresses:</span></span>
<span class="line"><span style="color:#61AFEF;">        -</span><span style="color:#98C379;"> 192.168.1.100/24</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 查看 Bond 状态 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/net/bonding/bond0</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Ethernet Channel Bonding Driver: v3.7.1</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Bonding Mode: fault-tolerance (active-backup)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Primary Slave: enp0s3</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Currently Active Slave: enp0s3</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># MII Status: up</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Slave Interface: enp0s3</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># MII Status: up</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Slave Interface: enp0s8</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># MII Status: up</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、dns-服务" tabindex="-1"><a class="header-anchor" href="#五、dns-服务"><span>五、DNS 服务</span></a></h2><h3 id="_5-1-dns-解析配置" tabindex="-1"><a class="header-anchor" href="#_5-1-dns-解析配置"><span>5.1 DNS 解析配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== /etc/resolv.conf ==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 传统方式（可能被覆盖）</span></span>
<span class="line"><span style="color:#61AFEF;">nameserver</span><span style="color:#D19A66;"> 223.5.5.5</span></span>
<span class="line"><span style="color:#61AFEF;">nameserver</span><span style="color:#D19A66;"> 119.29.29.29</span></span>
<span class="line"><span style="color:#61AFEF;">search</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"><span style="color:#61AFEF;">options</span><span style="color:#98C379;"> timeout:2</span><span style="color:#98C379;"> attempts:3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== systemd-resolved（Ubuntu 18.04+）==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看状态</span></span>
<span class="line"><span style="color:#61AFEF;">resolvectl</span><span style="color:#98C379;"> status</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置 DNS</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> resolvectl</span><span style="color:#98C379;"> dns</span><span style="color:#98C379;"> enp0s3</span><span style="color:#D19A66;"> 223.5.5.5</span><span style="color:#D19A66;"> 119.29.29.29</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置搜索域</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> resolvectl</span><span style="color:#98C379;"> domain</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 刷新 DNS 缓存</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> resolvectl</span><span style="color:#98C379;"> flush-caches</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 防止 resolv.conf 被覆盖 ==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法1：使用 chattr 不可变属性</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chattr</span><span style="color:#98C379;"> +i</span><span style="color:#98C379;"> /etc/resolv.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法2：配置 systemd-resolved</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /etc/systemd/resolved.conf.d</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/systemd/resolved.conf.d/dns.conf</span></span>
<span class="line"><span style="color:#98C379;">[Resolve]</span></span>
<span class="line"><span style="color:#98C379;">DNS=223.5.5.5 119.29.29.29</span></span>
<span class="line"><span style="color:#98C379;">FallbackDNS=8.8.8.8</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> systemd-resolved</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-dns-查询工具" tabindex="-1"><a class="header-anchor" href="#_5-2-dns-查询工具"><span>5.2 DNS 查询工具</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== dig ==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基本查询</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 指定 DNS 服务器</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> @223.5.5.5</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 指定记录类型</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> A</span><span style="color:#7F848E;font-style:italic;">        # IPv4</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> AAAA</span><span style="color:#7F848E;font-style:italic;">     # IPv6</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> MX</span><span style="color:#7F848E;font-style:italic;">       # 邮件</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> NS</span><span style="color:#7F848E;font-style:italic;">       # 域名服务器</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> TXT</span><span style="color:#7F848E;font-style:italic;">      # 文本记录</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> CNAME</span><span style="color:#7F848E;font-style:italic;">    # 别名</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> SOA</span><span style="color:#7F848E;font-style:italic;">      # 起始授权</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 反向解析</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#D19A66;"> -x</span><span style="color:#D19A66;"> 8.8.8.8</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 跟踪解析过程</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> +trace</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 简洁输出</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> +short</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== nslookup ==========</span></span>
<span class="line"><span style="color:#61AFEF;">nslookup</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"><span style="color:#61AFEF;">nslookup</span><span style="color:#98C379;"> example.com</span><span style="color:#D19A66;"> 223.5.5.5</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== host ==========</span></span>
<span class="line"><span style="color:#61AFEF;">host</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"><span style="color:#61AFEF;">host</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> MX</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"><span style="color:#61AFEF;">host</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> NS</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== DNS 排障实战 ==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 能否解析？</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> +short</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 指定 DNS 能否解析？</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> @223.5.5.5</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> +short</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 跟踪解析路径</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> +trace</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 检查本地 DNS 缓存</span></span>
<span class="line"><span style="color:#61AFEF;">resolvectl</span><span style="color:#98C379;"> query</span><span style="color:#98C379;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 检查 /etc/hosts</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> example.com</span><span style="color:#98C379;"> /etc/hosts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 检查 nsswitch.conf 解析顺序</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> hosts</span><span style="color:#98C379;"> /etc/nsswitch.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># hosts: files resolve [!UNAVAIL=return] dns</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># files = /etc/hosts, dns = /etc/resolv.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-搭建-dns-缓存服务器-dnsmasq" tabindex="-1"><a class="header-anchor" href="#_5-3-搭建-dns-缓存服务器-dnsmasq"><span>5.3 搭建 DNS 缓存服务器（dnsmasq）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 dnsmasq</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> dnsmasq</span><span style="color:#7F848E;font-style:italic;">      # Ubuntu/Debian</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> yum</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> dnsmasq</span><span style="color:#7F848E;font-style:italic;">      # CentOS/RHEL</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置 /etc/dnsmasq.conf</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/dnsmasq.conf</span></span>
<span class="line"><span style="color:#98C379;"># 监听地址</span></span>
<span class="line"><span style="color:#98C379;">listen-address=127.0.0.1,192.168.1.100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 上游 DNS</span></span>
<span class="line"><span style="color:#98C379;">server=223.5.5.5</span></span>
<span class="line"><span style="color:#98C379;">server=119.29.29.29</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 缓存大小</span></span>
<span class="line"><span style="color:#98C379;">cache-size=10000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 本地域名解析</span></span>
<span class="line"><span style="color:#98C379;">address=/myapp.local/192.168.1.50</span></span>
<span class="line"><span style="color:#98C379;">address=/db.local/192.168.1.51</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 泛域名解析</span></span>
<span class="line"><span style="color:#98C379;">address=/dev.local/192.168.1.100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 指定域名使用特定 DNS</span></span>
<span class="line"><span style="color:#98C379;">server=/example.com/8.8.8.8</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重启服务</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> dnsmasq</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#98C379;"> dnsmasq</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 测试</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> @127.0.0.1</span><span style="color:#98C379;"> myapp.local</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> @127.0.0.1</span><span style="color:#98C379;"> google.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 将系统 DNS 指向 dnsmasq</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;nameserver 127.0.0.1&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/resolv.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、dhcp-服务" tabindex="-1"><a class="header-anchor" href="#六、dhcp-服务"><span>六、DHCP 服务</span></a></h2><h3 id="_6-1-dhcp-客户端" tabindex="-1"><a class="header-anchor" href="#_6-1-dhcp-客户端"><span>6.1 DHCP 客户端</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 获取 DHCP 租约</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> dhclient</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 释放租约</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> dhclient</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看租约信息</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /var/lib/dhcp/dhclient.leases</span><span style="color:#7F848E;font-style:italic;">    # Ubuntu</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /var/lib/dhclient/dhclient.leases</span><span style="color:#7F848E;font-style:italic;"> # CentOS</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 DHCP 交互过程</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> dhclient</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DHCPDISCOVER on enp0s3 to 255.255.255.255 port 67</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DHCPOFFER from 192.168.1.1</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DHCPREQUEST on enp0s3 to 255.255.255.255 port 67</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DHCPACK from 192.168.1.1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-搭建-dhcp-服务器" tabindex="-1"><a class="header-anchor" href="#_6-2-搭建-dhcp-服务器"><span>6.2 搭建 DHCP 服务器</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 DHCP 服务器</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> isc-dhcp-server</span><span style="color:#7F848E;font-style:italic;">     # Ubuntu/Debian</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> yum</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> dhcp-server</span><span style="color:#7F848E;font-style:italic;">         # CentOS/RHEL</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置 /etc/dhcp/dhcpd.conf</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/dhcp/dhcpd.conf</span></span>
<span class="line"><span style="color:#98C379;"># 全局配置</span></span>
<span class="line"><span style="color:#98C379;">default-lease-time 600;</span></span>
<span class="line"><span style="color:#98C379;">max-lease-time 7200;</span></span>
<span class="line"><span style="color:#98C379;">authoritative;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 子网配置</span></span>
<span class="line"><span style="color:#98C379;">subnet 192.168.1.0 netmask 255.255.255.0 {</span></span>
<span class="line"><span style="color:#98C379;">    range 192.168.1.100 192.168.1.200;</span></span>
<span class="line"><span style="color:#98C379;">    option routers 192.168.1.1;</span></span>
<span class="line"><span style="color:#98C379;">    option subnet-mask 255.255.255.0;</span></span>
<span class="line"><span style="color:#98C379;">    option domain-name-servers 223.5.5.5, 119.29.29.29;</span></span>
<span class="line"><span style="color:#98C379;">    option domain-name &quot;example.com&quot;;</span></span>
<span class="line"><span style="color:#98C379;">    option broadcast-address 192.168.1.255;</span></span>
<span class="line"><span style="color:#98C379;">    default-lease-time 600;</span></span>
<span class="line"><span style="color:#98C379;">    max-lease-time 7200;</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 固定 IP（MAC 绑定）</span></span>
<span class="line"><span style="color:#98C379;">host server1 {</span></span>
<span class="line"><span style="color:#98C379;">    hardware ethernet 00:11:22:33:44:55;</span></span>
<span class="line"><span style="color:#98C379;">    fixed-address 192.168.1.10;</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">host server2 {</span></span>
<span class="line"><span style="color:#98C379;">    hardware ethernet 00:11:22:33:44:66;</span></span>
<span class="line"><span style="color:#98C379;">    fixed-address 192.168.1.11;</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 指定监听接口</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;INTERFACESv4=</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">enp0s3</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/default/isc-dhcp-server</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动服务</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> isc-dhcp-server</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#98C379;"> isc-dhcp-server</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看租约</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /var/lib/dhcp/dhcpd.leases</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="七、nat-与端口转发" tabindex="-1"><a class="header-anchor" href="#七、nat-与端口转发"><span>七、NAT 与端口转发</span></a></h2><h3 id="_7-1-nat-原理" tabindex="-1"><a class="header-anchor" href="#_7-1-nat-原理"><span>7.1 NAT 原理</span></a></h3><p>NAT（Network Address Translation）将私有 IP 地址转换为公网 IP 地址，解决 IPv4 地址不足问题：</p>`,49),i(f,{code:`eJwrTi0sTc1LTnXJTEwvSszlUgCCgsSikszkzILEvBKFp22tz/dOfLJj97M5uxQSi1H4NklFdoaWRnqGZhZ6hnqGBgYYuv0cQ4Cqn7ZuBmkFchQgPJDGp61rgBwrBSMDoAEgiGn1kmlAFc/m9D7tWvh05gqw7ahCIHMs9MCQC6wd2XW6dnZw660Unu2aYIXiVitDI2MTU5AJz2evez6rxQpqkJUFxBt++SWpCvllqUUIT1gpBAPZQLNm73/Wuwho4tM5G57ObcAIBoVHbZMQ/gJJv1i34eneqc9mLHi6oeXFwhUQC2DGAh2K5i+Ic+Em4HMqxNuo2jF9jtCAZAqa+bh97QL29Yv9M572zYfoRXgcbgjY05ipAcWXSLGDx11YookLAEqPGgU=`}),s[2]||=n(`<h3 id="_7-2-iptables-实现-nat" tabindex="-1"><a class="header-anchor" href="#_7-2-iptables-实现-nat"><span>7.2 iptables 实现 NAT</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 开启 IP 转发 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sysctl</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> net.ipv4.ip_forward=</span><span style="color:#D19A66;">1</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;net.ipv4.ip_forward=1&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> /etc/sysctl.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== SNAT（源地址转换）==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 内网主机通过 NAT 网关访问外网</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 场景：内网 192.168.1.0/24 通过 202.1.1.1 上网</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> nat</span><span style="color:#D19A66;"> -A</span><span style="color:#98C379;"> POSTROUTING</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -s</span><span style="color:#98C379;"> 192.168.1.0/24</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -o</span><span style="color:#98C379;"> enp0s3</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -j</span><span style="color:#98C379;"> SNAT</span><span style="color:#D19A66;"> --to-source</span><span style="color:#D19A66;"> 202.1.1.1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果公网 IP 是动态的，使用 MASQUERADE</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> nat</span><span style="color:#D19A66;"> -A</span><span style="color:#98C379;"> POSTROUTING</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -s</span><span style="color:#98C379;"> 192.168.1.0/24</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -o</span><span style="color:#98C379;"> enp0s3</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -j</span><span style="color:#98C379;"> MASQUERADE</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== DNAT（目的地址转换/端口转发）==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 将公网 IP 的某个端口转发到内网主机</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 场景：将公网 202.1.1.1:8080 转发到内网 192.168.1.50:80</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> nat</span><span style="color:#D19A66;"> -A</span><span style="color:#98C379;"> PREROUTING</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -d</span><span style="color:#D19A66;"> 202.1.1.1</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -p</span><span style="color:#98C379;"> tcp</span><span style="color:#D19A66;"> --dport</span><span style="color:#D19A66;"> 8080</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -j</span><span style="color:#98C379;"> DNAT</span><span style="color:#D19A66;"> --to-destination</span><span style="color:#98C379;"> 192.168.1.50:80</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 本地端口转发</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> nat</span><span style="color:#D19A66;"> -A</span><span style="color:#98C379;"> OUTPUT</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -d</span><span style="color:#D19A66;"> 127.0.0.1</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -p</span><span style="color:#98C379;"> tcp</span><span style="color:#D19A66;"> --dport</span><span style="color:#D19A66;"> 8080</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -j</span><span style="color:#98C379;"> DNAT</span><span style="color:#D19A66;"> --to-destination</span><span style="color:#98C379;"> 192.168.1.50:80</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 查看 NAT 规则 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> nat</span><span style="color:#D19A66;"> -L</span><span style="color:#D19A66;"> -n</span><span style="color:#D19A66;"> -v</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 保存规则 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables-save</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/iptables/rules.v4</span><span style="color:#7F848E;font-style:italic;">   # Ubuntu</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> service</span><span style="color:#98C379;"> iptables</span><span style="color:#98C379;"> save</span><span style="color:#7F848E;font-style:italic;">                               # CentOS</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-nftables-实现-nat" tabindex="-1"><a class="header-anchor" href="#_7-3-nftables-实现-nat"><span>7.3 nftables 实现 NAT</span></a></h3><p>nftables 是 iptables 的继任者，语法更简洁：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 创建 nftables NAT 规则 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nft</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> table</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> nat</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nft</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> chain</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> nat</span><span style="color:#98C379;"> prerouting</span><span style="color:#98C379;"> {</span><span style="color:#98C379;"> type</span><span style="color:#98C379;"> nat</span><span style="color:#98C379;"> hook</span><span style="color:#98C379;"> prerouting</span><span style="color:#98C379;"> priority</span><span style="color:#D19A66;"> -100</span><span style="color:#56B6C2;"> \\;</span><span style="color:#98C379;"> }</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nft</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> chain</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> nat</span><span style="color:#98C379;"> postrouting</span><span style="color:#98C379;"> {</span><span style="color:#98C379;"> type</span><span style="color:#98C379;"> nat</span><span style="color:#98C379;"> hook</span><span style="color:#98C379;"> postrouting</span><span style="color:#98C379;"> priority</span><span style="color:#D19A66;"> 100</span><span style="color:#56B6C2;"> \\;</span><span style="color:#98C379;"> }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># SNAT/MASQUERADE</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nft</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> rule</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> nat</span><span style="color:#98C379;"> postrouting</span><span style="color:#98C379;"> oifname</span><span style="color:#98C379;"> &quot;enp0s3&quot;</span><span style="color:#98C379;"> masquerade</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># DNAT/端口转发</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nft</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> rule</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> nat</span><span style="color:#98C379;"> prerouting</span><span style="color:#98C379;"> iifname</span><span style="color:#98C379;"> &quot;enp0s3&quot;</span><span style="color:#98C379;"> tcp</span><span style="color:#98C379;"> dport</span><span style="color:#D19A66;"> 8080</span><span style="color:#98C379;"> dnat</span><span style="color:#98C379;"> to</span><span style="color:#98C379;"> 192.168.1.50:80</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看规则</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nft</span><span style="color:#98C379;"> list</span><span style="color:#98C379;"> ruleset</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 持久化 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nft</span><span style="color:#98C379;"> list</span><span style="color:#98C379;"> ruleset</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/nftables.conf</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#98C379;"> nftables</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="八、tcpdump-抓包" tabindex="-1"><a class="header-anchor" href="#八、tcpdump-抓包"><span>八、tcpdump 抓包</span></a></h2><h3 id="_8-1-tcpdump-基本用法" tabindex="-1"><a class="header-anchor" href="#_8-1-tcpdump-基本用法"><span>8.1 tcpdump 基本用法</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 基本抓包 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 抓取所有包（默认监听第一个接口）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 指定接口</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 抓取指定数量的包</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 100</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 过滤表达式 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 按主机过滤</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> host</span><span style="color:#D19A66;"> 192.168.1.1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 按源/目的地址</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> src</span><span style="color:#98C379;"> host</span><span style="color:#D19A66;"> 192.168.1.100</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> dst</span><span style="color:#98C379;"> host</span><span style="color:#D19A66;"> 8.8.8.8</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 按端口过滤</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 80</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> src</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 8080</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> dst</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 443</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 按协议过滤</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> icmp</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> tcp</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> udp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 组合过滤</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> host</span><span style="color:#D19A66;"> 192.168.1.1</span><span style="color:#98C379;"> and</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 80</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> host</span><span style="color:#D19A66;"> 192.168.1.1</span><span style="color:#98C379;"> and</span><span style="color:#98C379;"> not</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 22</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> tcp</span><span style="color:#98C379;"> and</span><span style="color:#56B6C2;"> \\(</span><span style="color:#98C379;">port</span><span style="color:#D19A66;"> 80</span><span style="color:#98C379;"> or</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 443</span><span style="color:#56B6C2;">\\)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 按网段过滤</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#98C379;"> net</span><span style="color:#98C379;"> 192.168.1.0/24</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 输出格式控制 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 显示详细输出</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -v</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 更详细的输出（包含应用层数据）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -vv</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 最详细输出</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -vvv</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 显示数据包内容（十六进制+ASCII）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -X</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 80</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 只显示 ASCII 内容</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -A</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 80</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 显示链路层信息（MAC 地址）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -e</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 不解析主机名和端口名（显示数字）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -nn</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 保存到文件 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 保存为 pcap 格式（可用 Wireshark 分析）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> /tmp/capture.pcap</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 保存指定大小和数量</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> /tmp/capture.pcap</span><span style="color:#D19A66;"> -C</span><span style="color:#D19A66;"> 10</span><span style="color:#D19A66;"> -W</span><span style="color:#D19A66;"> 5</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -C 10: 每个文件最大 10MB</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -W 5: 最多 5 个文件（循环覆盖）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 读取 pcap 文件</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> /tmp/capture.pcap</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-实战抓包场景" tabindex="-1"><a class="header-anchor" href="#_8-2-实战抓包场景"><span>8.2 实战抓包场景</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 场景1：排查 HTTP 请求 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span><span style="color:#D19A66;"> -A</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> 0</span><span style="color:#98C379;"> &#39;tcp port 80 and (((ip[2:2] - ((ip[0]&amp;0xf)&lt;&lt;2)) - ((tcp[12]&amp;0xf0)&gt;&gt;2)) != 0)&#39;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -s 0: 抓取完整数据包</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 过滤出包含 HTTP 数据的包</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 场景2：排查 DNS 解析问题 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span><span style="color:#D19A66;"> -nn</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 53</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 场景3：排查 TCP 连接问题（三次握手/四次挥手）==========</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span><span style="color:#D19A66;"> -nn</span><span style="color:#98C379;"> &#39;tcp and (tcp[tcpflags] &amp; (tcp-syn|tcp-fin|tcp-rst) != 0)&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 场景4：抓取特定 TCP 流 ==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 先找到连接的序号</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span><span style="color:#D19A66;"> -nn</span><span style="color:#98C379;"> &#39;tcp and host 192.168.1.1 and port 443&#39;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 然后用序号跟踪完整流</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span><span style="color:#D19A66;"> -nn</span><span style="color:#98C379;"> &#39;tcp[20:4] = 0x12345678 or tcp[24:4] = 0x12345678&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 场景5：排查网络延迟 ==========</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 测量 TCP 握手时间</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span><span style="color:#D19A66;"> -nn</span><span style="color:#98C379;"> &#39;tcp and host 8.8.8.8 and tcp[tcpflags] &amp; (tcp-syn|tcp-ack) != 0&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -tt</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $1}&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">paste</span><span style="color:#98C379;"> -</span><span style="color:#98C379;"> -</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print &quot;RTT: &quot; ($2 - $1)*1000 &quot; ms&quot;}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="九、ethtool-网卡工具" tabindex="-1"><a class="header-anchor" href="#九、ethtool-网卡工具"><span>九、ethtool 网卡工具</span></a></h2><h3 id="_9-1-查看网卡信息" tabindex="-1"><a class="header-anchor" href="#_9-1-查看网卡信息"><span>9.1 查看网卡信息</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看网卡基本信息</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出关键信息：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Speed: 1000Mb/s          # 速度</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Duplex: Full             # 双工模式</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Port: Twisted Pair       # 端口类型</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Link detected: yes       # 链路状态</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看驱动信息</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># driver: e1000</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># version: 7.3.21-k8-NAPI</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># firmware-version: 0.0-3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看链路状态</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#98C379;"> enp0s3</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;Link detected&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看支持的速度和双工模式</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#98C379;"> enp0s3</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -A5</span><span style="color:#98C379;"> &quot;Supported link modes&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看统计信息</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#D19A66;"> -S</span><span style="color:#98C379;"> enp0s3</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -30</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># rx_packets: 123456</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># tx_packets: 654321</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># rx_bytes: 987654321</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># tx_bytes: 123456789</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># rx_errors: 0</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># tx_errors: 0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-调整网卡参数" tabindex="-1"><a class="header-anchor" href="#_9-2-调整网卡参数"><span>9.2 调整网卡参数</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 速度和双工模式 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置网卡速度和双工</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ethtool</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> speed</span><span style="color:#D19A66;"> 1000</span><span style="color:#98C379;"> duplex</span><span style="color:#98C379;"> full</span><span style="color:#98C379;"> autoneg</span><span style="color:#98C379;"> off</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== Wake-on-LAN ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看当前 WoL 设置</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#98C379;"> enp0s3</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;Wake-on&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启用 WoL</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ethtool</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> wol</span><span style="color:#98C379;"> g</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># g = magic packet</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== RSS（接收端缩放）==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 RSS 队列数</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#D19A66;"> -l</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置 RSS 队列数</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ethtool</span><span style="color:#D19A66;"> -L</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> combined</span><span style="color:#D19A66;"> 4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== Ring Buffer ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 Ring Buffer 大小</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#D19A66;"> -g</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置 Ring Buffer</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ethtool</span><span style="color:#D19A66;"> -G</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> rx</span><span style="color:#D19A66;"> 4096</span><span style="color:#98C379;"> tx</span><span style="color:#D19A66;"> 4096</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 卸载功能 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看卸载功能</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#D19A66;"> -k</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 开启/关闭 TSO（TCP Segmentation Offload）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ethtool</span><span style="color:#D19A66;"> -K</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> tso</span><span style="color:#98C379;"> on</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ethtool</span><span style="color:#D19A66;"> -K</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> tso</span><span style="color:#98C379;"> off</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 开启/关闭 GSO（Generic Segmentation Offload）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ethtool</span><span style="color:#D19A66;"> -K</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> gso</span><span style="color:#98C379;"> on</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 开启/关闭 GRO（Generic Receive Offload）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ethtool</span><span style="color:#D19A66;"> -K</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> gro</span><span style="color:#98C379;"> on</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 中断合并 ==========</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看中断合并设置</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> enp0s3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置中断合并（减少中断频率，提升吞吐量）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ethtool</span><span style="color:#D19A66;"> -C</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> rx-usecs</span><span style="color:#D19A66;"> 100</span><span style="color:#98C379;"> tx-usecs</span><span style="color:#D19A66;"> 100</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十、网络排障实战" tabindex="-1"><a class="header-anchor" href="#十、网络排障实战"><span>十、网络排障实战</span></a></h2><h3 id="_10-1-网络排障流程" tabindex="-1"><a class="header-anchor" href="#_10-1-网络排障流程"><span>10.1 网络排障流程</span></a></h3>`,17),i(f,{code:`eJyNk11v0lAYx+/9FCfHW0kHLUa9MEEX4hJcjBBjsu4CaAuN9ZS0xcUwEzCy7EUdCASZ6MRlitlinca3uZcvw2nLlV/BU3rKtsASetVznv/z/H/5n3MkRV1IZ5OaARLTFwD54onI3cQctA+r9t+21Sj3N9pwHgQC10EsWID2yme7soT3nvaLG7jS/HewCZ8M2mJBV7MIe79fkBJcBNGZ+8E5aG0Vrc1td9j+MYPLK1a3g982eSQaWUNVFeAW22v92pHzy7RXf1rF0kktEPfL9ZZjms6XjtX4CufP2HlesVABejPGkYVGyUI+Gbgducnci0VmeZTSZCEjAklIUVvncBevV51Ol0dUfENFAvAwfQ46nHKwJKFBcOM42FEOdsgxc4dxI6jv8SgnowwgY3D5O4/kHNDUvCECPasuuEsjmVJEnUGS9wOcT8/wcsvHoR4UhyvA3sF756g2DocbxeGGB7Zj4vUtpv/6m13awR9aPNKJpWjoRtKg6dhvqriyyyNDVEiBQWlg/VhzzIbXSvbTOSH/MAes1Rp+XsbLS9a7ik9JrSlluADxft2ud8dRhkcpw8PQpmfjzK1EgkRnlnp/PvJIkDMM0hVVfZAnzi9fURGP0nmNXKhHlBG4Tf6pWs1tfNwkaAND3XisiN4jAJKsKNcuShzHspcvpVVF1chKkk7p3EtOZdHo1StTU+fKQpPJ2Mlk3GSy8Lmy//6/tA8=`}),s[3]||=n(`<h3 id="_10-2-网络排障命令速查" tabindex="-1"><a class="header-anchor" href="#_10-2-网络排障命令速查"><span>10.2 网络排障命令速查</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 第一层：物理层 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#98C379;"> enp0s3</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;Link detected&quot;</span><span style="color:#7F848E;font-style:italic;">    # 链路状态</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#D19A66;"> -S</span><span style="color:#98C379;"> enp0s3</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> error</span><span style="color:#7F848E;font-style:italic;">        # 错误计数</span></span>
<span class="line"><span style="color:#61AFEF;">dmesg</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;link\\|speed\\|duplex&quot;</span><span style="color:#7F848E;font-style:italic;">    # 内核日志</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 第二层：链路层 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> show</span><span style="color:#7F848E;font-style:italic;">                              # 接口状态</span></span>
<span class="line"><span style="color:#61AFEF;">bridge</span><span style="color:#98C379;"> fdb</span><span style="color:#98C379;"> show</span><span style="color:#7F848E;font-style:italic;">                           # MAC 转发表</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/net/bonding/bond0</span><span style="color:#7F848E;font-style:italic;">              # Bond 状态</span></span>
<span class="line"><span style="color:#61AFEF;">arp</span><span style="color:#D19A66;"> -an</span><span style="color:#7F848E;font-style:italic;">                                   # ARP 表</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 第三层：网络层 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">ping</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 4</span><span style="color:#D19A66;"> 192.168.1.1</span><span style="color:#7F848E;font-style:italic;">                    # 测试连通性</span></span>
<span class="line"><span style="color:#61AFEF;">ping</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 4</span><span style="color:#D19A66;"> -I</span><span style="color:#98C379;"> enp0s3</span><span style="color:#D19A66;"> 192.168.1.1</span><span style="color:#7F848E;font-style:italic;">          # 指定接口</span></span>
<span class="line"><span style="color:#61AFEF;">traceroute</span><span style="color:#D19A66;"> 8.8.8.8</span><span style="color:#7F848E;font-style:italic;">                       # 路由跟踪</span></span>
<span class="line"><span style="color:#61AFEF;">mtr</span><span style="color:#D19A66;"> --report</span><span style="color:#D19A66;"> 8.8.8.8</span><span style="color:#7F848E;font-style:italic;">                     # 持续路由跟踪</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> get</span><span style="color:#D19A66;"> 8.8.8.8</span><span style="color:#7F848E;font-style:italic;">                     # 查看路由决策</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> rule</span><span style="color:#98C379;"> show</span><span style="color:#7F848E;font-style:italic;">                             # 策略路由</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 第四层：传输层 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#7F848E;font-style:italic;">                                 # TCP 监听端口</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -ulnp</span><span style="color:#7F848E;font-style:italic;">                                 # UDP 监听端口</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tnp</span><span style="color:#7F848E;font-style:italic;">                                  # TCP 连接</span></span>
<span class="line"><span style="color:#61AFEF;">nc</span><span style="color:#D19A66;"> -zv</span><span style="color:#D19A66;"> 192.168.1.1</span><span style="color:#D19A66;"> 80</span><span style="color:#7F848E;font-style:italic;">                    # 测试端口连通性</span></span>
<span class="line"><span style="color:#61AFEF;">tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> enp0s3</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 80</span><span style="color:#7F848E;font-style:italic;">                # 抓包</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 第五层：应用层 ==========</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> example.com</span><span style="color:#7F848E;font-style:italic;">                           # DNS 解析</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> https://example.com</span><span style="color:#7F848E;font-style:italic;">              # HTTP 请求</span></span>
<span class="line"><span style="color:#61AFEF;">openssl</span><span style="color:#98C379;"> s_client</span><span style="color:#D19A66;"> -connect</span><span style="color:#98C379;"> example.com:443</span><span style="color:#7F848E;font-style:italic;"> # TLS 连接</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-网络监控脚本" tabindex="-1"><a class="header-anchor" href="#_10-3-网络监控脚本"><span>10.3 网络监控脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 网络状态监控脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">INTERFACE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${1</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;">enp0s3</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#E06C75;">LOG_FILE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/network_monitor.log&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">log</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;[$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)] </span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$LOG_FILE</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;============================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;  网络状态检查 - $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;============================================&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 接口状态</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 接口状态 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#D19A66;"> -br</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> show</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 链路状态</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 链路状态 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ethtool</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$INTERFACE</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -E</span><span style="color:#98C379;"> &quot;Speed|Duplex|Link detected&quot;</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;无法获取 </span><span style="color:#E06C75;">$INTERFACE</span><span style="color:#98C379;"> 链路信息&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. IP 和路由</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- IP 地址 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> addr</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$INTERFACE</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> inet</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 默认路由 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> default</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 连通性测试</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 连通性测试 ---&quot;</span></span>
<span class="line"><span style="color:#E06C75;">GATEWAY</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">ip</span><span style="color:#98C379;"> route</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> default</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $3}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-n</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$GATEWAY</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> ping</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 2</span><span style="color:#D19A66;"> -W</span><span style="color:#D19A66;"> 2</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$GATEWAY</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✅ 网关 </span><span style="color:#E06C75;">$GATEWAY</span><span style="color:#98C379;"> 可达&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;❌ 网关 </span><span style="color:#E06C75;">$GATEWAY</span><span style="color:#98C379;"> 不可达！&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> ping</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 2</span><span style="color:#D19A66;"> -W</span><span style="color:#D19A66;"> 2</span><span style="color:#D19A66;"> 8.8.8.8</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✅ 外网 8.8.8.8 可达&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;❌ 外网 8.8.8.8 不可达&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. DNS 测试</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- DNS 测试 ---&quot;</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> dig</span><span style="color:#98C379;"> +short</span><span style="color:#98C379;"> google.com</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✅ DNS 解析正常&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;❌ DNS 解析失败&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 连接统计</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 连接统计 ---&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;TCP 连接数: $(</span><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tn</span><span style="color:#ABB2BF;"> |</span><span style="color:#61AFEF;"> tail</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> +2 </span><span style="color:#ABB2BF;">|</span><span style="color:#61AFEF;"> wc</span><span style="color:#D19A66;"> -l</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;TCP TIME_WAIT: $(</span><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tn</span><span style="color:#98C379;"> state time-wait </span><span style="color:#ABB2BF;">|</span><span style="color:#61AFEF;"> wc</span><span style="color:#D19A66;"> -l</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;TCP ESTABLISHED: $(</span><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tn</span><span style="color:#98C379;"> state established </span><span style="color:#ABB2BF;">|</span><span style="color:#61AFEF;"> wc</span><span style="color:#D19A66;"> -l</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;UDP 连接数: $(</span><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -un</span><span style="color:#ABB2BF;"> |</span><span style="color:#61AFEF;"> tail</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> +2 </span><span style="color:#ABB2BF;">|</span><span style="color:#61AFEF;"> wc</span><span style="color:#D19A66;"> -l</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 7. 监听端口</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 监听端口 TOP 10 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tail</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> +2</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $4, $6}&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 8. 网络错误</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 网络错误统计 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ip</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> link</span><span style="color:#98C379;"> show</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$INTERFACE</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -A3</span><span style="color:#98C379;"> &quot;RX:\\|TX:&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;===== 检查完成 =====&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2>`,5),i(f,{code:`eJxtUstO20AU3fMVs4RF1W+gsOiiTSul7d5gN7WajF3bUbcJJW0E5NWQKjEGywErkSAvsUjlPPiZ3JnxXzCxxzwkdjPnnJk5557JqVjOSfoGQoamWZubdNGgMycsVehiuPpfJU4FjrytLc4jFHOk6kPtMgIQUnUEjcVqdiX2KcXSsxJGn/fy2MoLECvWT834/srcN1TdMtGOgq0P6ccTa/K9hKWMYkQgm47o6ST2IFTheYcUijEhIDr4R1v+MwhqJ9wjVDyxKN1GRHjdpkEvdi+UbwxVziiIeD6PI7Av77ZTiHVscuzCpACuy08kcg3LKs6gsLnkD7KiDfVyRO2m0iiekVCy3iW5qD/zTlyfjbow9aE0FZCMzZxk/kB03oRBO77p7c7HJMawS8pTej1KLogegE6f1AcwCyI0tf0J8X64iJfBFjdQS7ym1xQJ6uCM4bzAKVLpCmp3TdGzIbUPX2B5N9JeVjFf46/xIsLJURNOSlD+zWMJobWvy/kcb94NiHNDT/vktpXEv/tDZlfM67PlEua1h0AXpNwGJyCdOJNo6elIFOubpWlZtLrzSHHEZ0ad44daD0hrzMa/VvN4VslH/BvaSaHcIEwOOMRPJlD0McOC+wjRswap9tihzX1v3AN7GWEO`}),s[4]||=a(`div`,{class:`hint-container info`},[a(`p`,{class:`hint-container-title`},`参考书籍`),a(`ul`,null,[a(`li`,null,`《鸟哥的 Linux 私房菜》（第四版）第五章：Linux 常用网络命令、第六章：Linux 网络排错`),a(`li`,null,`《TCP/IP 详解》卷一：协议`),a(`li`,null,`《Linux 网络编程》`),a(`li`,null,`Red Hat 官方文档：Networking Guide`)])],-1)])}var u=o(c,[[`render`,l]]);export{s as _pageData,u as default};