import{D as e,f as t,u as n}from"./runtime-core.esm-bundler-D3eD_xTR.js";import{t as r}from"./app-C_mnsEHS.js";var i=JSON.parse(`{"path":"/%E8%BF%90%E7%BB%B4%E4%B8%8E%E9%83%A8%E7%BD%B2/Linux%E5%9F%BA%E7%A1%80/06.%E6%80%A7%E8%83%BD%E7%9B%91%E6%8E%A7%E4%B8%8E%E6%8E%92%E6%9F%A5.html","title":"性能监控与排查","lang":"zh-CN","frontmatter":{"title":"性能监控与排查","date":"2025-04-14T00:00:00.000Z","category":["Linux基础"],"tag":["Linux","性能监控","排查","top"],"order":6},"git":{"createdTime":1776135420000,"updatedTime":1776135420000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":3.44,"words":1033},"filePathRelative":"运维与部署/Linux基础/06.性能监控与排查.md"}`),a={name:`06.性能监控与排查.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="性能监控与排查" tabindex="-1"><a class="header-anchor" href="#性能监控与排查"><span>性能监控与排查</span></a></h1><p>生产环境接口慢了、进程挂了、服务器卡了，怎么查？这篇把 CPU、内存、磁盘、网络的排查命令全过一遍。</p><hr><h2 id="top-htop-系统全貌" tabindex="-1"><a class="header-anchor" href="#top-htop-系统全貌"><span>top / htop：系统全貌</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># top（自带）</span></span>
<span class="line"><span style="color:#61AFEF;">top</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出解读：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># load average: 0.15, 0.10, 0.08  → 1/5/15分钟平均负载</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   → 单核 CPU 超过 1.0 就算高，4核超过 4.0 算高</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># %Cpu(s):  5.3 us,  2.1 sy,  0.0 ni, 92.1 id</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   → us=用户态, sy=内核态, id=空闲, wa=IO等待</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   → wa 高 = 磁盘慢  |  us 高 = 应用在算</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># MiB Mem:  7976.4 total, 1024.0 free, 5120.3 used, 1832.1 buff/cache</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   → buff/cache 是可回收的，free+buff/cache 才是真正可用的</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># top 常用操作：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># P → 按 CPU 排序</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># M → 按内存排序</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1 → 显示每个 CPU 核心</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># q → 退出</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># htop（更好看，需要安装）</span></span>
<span class="line"><span style="color:#61AFEF;">yum</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> htop</span><span style="color:#7F848E;font-style:italic;">    # CentOS</span></span>
<span class="line"><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> htop</span><span style="color:#7F848E;font-style:italic;">    # Ubuntu</span></span>
<span class="line"><span style="color:#61AFEF;">htop</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="cpu-排查" tabindex="-1"><a class="header-anchor" href="#cpu-排查"><span>CPU 排查</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 看某个 .NET 进程的 CPU 使用</span></span>
<span class="line"><span style="color:#61AFEF;">ps</span><span style="color:#98C379;"> aux</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> dotnet</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># USER       PID %CPU %MEM    VSZ   RSS TTY  STAT START   TIME COMMAND</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># deploy   12345 85.0  3.2 123456 65432 ?    Sl   10:00  15:30 dotnet ERP.Host.dll</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CPU 使用率持续很高？</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 确认是不是你的 .NET 进程</span></span>
<span class="line"><span style="color:#61AFEF;">top</span><span style="color:#D19A66;"> -p</span><span style="color:#D19A66;"> 12345</span><span style="color:#7F848E;font-style:italic;">        # 只看这个进程</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 看进程的线程情况</span></span>
<span class="line"><span style="color:#61AFEF;">top</span><span style="color:#D19A66;"> -H</span><span style="color:#D19A66;"> -p</span><span style="color:#D19A66;"> 12345</span><span style="color:#7F848E;font-style:italic;">     # 看线程级别</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 查看进程详情</span></span>
<span class="line"><span style="color:#61AFEF;">ls</span><span style="color:#D19A66;"> -la</span><span style="color:#98C379;"> /proc/12345/fd</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#7F848E;font-style:italic;">    # 打开的文件描述符数量</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/12345/status</span><span style="color:#7F848E;font-style:italic;">           # 进程状态详情</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># mpstat：每个 CPU 核心使用率</span></span>
<span class="line"><span style="color:#61AFEF;">mpstat</span><span style="color:#D19A66;"> -P</span><span style="color:#98C379;"> ALL</span><span style="color:#D19A66;"> 1</span><span style="color:#D19A66;"> 5</span><span style="color:#7F848E;font-style:italic;">   # 每秒刷新，共5次</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="内存排查" tabindex="-1"><a class="header-anchor" href="#内存排查"><span>内存排查</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看内存使用</span></span>
<span class="line"><span style="color:#61AFEF;">free</span><span style="color:#D19A66;"> -h</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#               total   used   free   shared  buff/cache  available</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Mem:          7.8Gi   5.0Gi  1.0Gi  256Mi   1.8Gi       2.3Gi</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Swap:         2.0Gi   0.5Gi  1.5Gi</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ⚠️ 看 available 列，不是 free 列</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ⚠️ Swap 在用 = 内存可能不够了</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 内存使用最多的进程</span></span>
<span class="line"><span style="color:#61AFEF;">ps</span><span style="color:#98C379;"> aux</span><span style="color:#D19A66;"> --sort=-%mem</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 看某个 .NET 进程的内存</span></span>
<span class="line"><span style="color:#61AFEF;">ps</span><span style="color:#D19A66;"> -p</span><span style="color:#D19A66;"> 12345</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pid,rss,vsz,comm</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># RSS = 实际物理内存（看这个）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># VSZ = 虚拟内存（.NET 进程这个值会很大，别慌）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /proc/meminfo 更详细</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/meminfo</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .NET 应用内存持续增长？</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 可能是内存泄漏，需要在应用层面排查：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - dotnet-dump collect 抓内存快照</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - dotnet-counters monitor 实时看 GC 指标</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="磁盘-i-o-排查" tabindex="-1"><a class="header-anchor" href="#磁盘-i-o-排查"><span>磁盘 I/O 排查</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># iostat：磁盘读写速率</span></span>
<span class="line"><span style="color:#61AFEF;">iostat</span><span style="color:#D19A66;"> -xdh</span><span style="color:#D19A66;"> 1</span><span style="color:#D19A66;"> 5</span><span style="color:#7F848E;font-style:italic;">    # 每秒刷新，共5次</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Device     r/s     w/s    rkB/s    wkB/s  %util</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># sda       10.00   50.00   40.0    2000.0   85%</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># %util 接近 100% = 磁盘忙不过来</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># await 高 = IO 延迟大</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># iotop：看哪个进程在读写磁盘（需要安装）</span></span>
<span class="line"><span style="color:#61AFEF;">yum</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> iotop</span></span>
<span class="line"><span style="color:#61AFEF;">iotop</span><span style="color:#D19A66;"> -o</span><span style="color:#7F848E;font-style:italic;">            # 只显示有 IO 的进程</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看某个目录的磁盘读写</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通常日志写入太频繁是元凶</span></span>
<span class="line"><span style="color:#61AFEF;">lsof</span><span style="color:#98C379;"> +D</span><span style="color:#98C379;"> /opt/apps/erp-api/logs/</span><span style="color:#7F848E;font-style:italic;">    # 谁在操作这个目录</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="网络排查" tabindex="-1"><a class="header-anchor" href="#网络排查"><span>网络排查</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看网络连接</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tnp</span><span style="color:#7F848E;font-style:italic;">                # 所有 TCP 连接</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tnp</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> 5000</span><span style="color:#7F848E;font-style:italic;">    # 看连到 5000 端口的</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -s</span><span style="color:#7F848E;font-style:italic;">                  # 连接统计</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 网络流量</span></span>
<span class="line"><span style="color:#61AFEF;">iftop</span><span style="color:#7F848E;font-style:italic;">                  # 实时网络流量（需安装）</span></span>
<span class="line"><span style="color:#61AFEF;">nethogs</span><span style="color:#7F848E;font-style:italic;">                # 按进程看网络流量（需安装）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 看连接数</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tn</span><span style="color:#98C379;"> state</span><span style="color:#98C379;"> established</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#7F848E;font-style:italic;">         # 已建立连接数</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tn</span><span style="color:#98C379;"> state</span><span style="color:#98C379;"> time-wait</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#7F848E;font-style:italic;">           # TIME_WAIT 数量</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TIME_WAIT 太多 = 短连接太频繁，考虑连接池</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 抓包（排查网络问题终极武器）</span></span>
<span class="line"><span style="color:#61AFEF;">tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> any</span><span style="color:#98C379;"> port</span><span style="color:#D19A66;"> 5000</span><span style="color:#D19A66;"> -nn</span><span style="color:#7F848E;font-style:italic;">            # 抓 5000 端口的包</span></span>
<span class="line"><span style="color:#61AFEF;">tcpdump</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> any</span><span style="color:#98C379;"> host</span><span style="color:#D19A66;"> 192.168.1.100</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> capture.pcap</span><span style="color:#7F848E;font-style:italic;">  # 抓包保存到文件</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 下载 .pcap 文件用 Wireshark 分析</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="net-专用诊断工具" tabindex="-1"><a class="header-anchor" href="#net-专用诊断工具"><span>.NET 专用诊断工具</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 .NET 诊断工具</span></span>
<span class="line"><span style="color:#61AFEF;">dotnet</span><span style="color:#98C379;"> tool</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -g</span><span style="color:#98C379;"> dotnet-counters</span></span>
<span class="line"><span style="color:#61AFEF;">dotnet</span><span style="color:#98C379;"> tool</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -g</span><span style="color:#98C379;"> dotnet-dump</span></span>
<span class="line"><span style="color:#61AFEF;">dotnet</span><span style="color:#98C379;"> tool</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -g</span><span style="color:#98C379;"> dotnet-trace</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 实时看 .NET 应用指标</span></span>
<span class="line"><span style="color:#61AFEF;">dotnet-counters</span><span style="color:#98C379;"> monitor</span><span style="color:#D19A66;"> -p</span><span style="color:#D19A66;"> 12345</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># GC Heap Size, Gen 0/1/2 GC Count, Exception Count</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ThreadPool Thread Count, HTTP Request Rate...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 抓内存快照（排查内存泄漏）</span></span>
<span class="line"><span style="color:#61AFEF;">dotnet-dump</span><span style="color:#98C379;"> collect</span><span style="color:#D19A66;"> -p</span><span style="color:#D19A66;"> 12345</span></span>
<span class="line"><span style="color:#61AFEF;">dotnet-dump</span><span style="color:#98C379;"> analyze</span><span style="color:#98C379;"> core_20240414_120000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 抓性能 trace（排查慢请求）</span></span>
<span class="line"><span style="color:#61AFEF;">dotnet-trace</span><span style="color:#98C379;"> collect</span><span style="color:#D19A66;"> -p</span><span style="color:#D19A66;"> 12345</span><span style="color:#D19A66;"> --duration</span><span style="color:#98C379;"> 00:00:30</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成的 .nettrace 文件用 VS 或 PerfView 打开</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="快速排查流水线" tabindex="-1"><a class="header-anchor" href="#快速排查流水线"><span>快速排查流水线</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>接口慢了 / 服务器卡了：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. top → 看 CPU 和内存的整体情况</span></span>
<span class="line"><span>2. load average 高？</span></span>
<span class="line"><span>   → us 高 → 应用层面（代码/数据库查询）</span></span>
<span class="line"><span>   → wa 高 → 磁盘IO（日志写入/数据库）</span></span>
<span class="line"><span>   → sy 高 → 系统调用多（网络连接数太多）</span></span>
<span class="line"><span>3. 内存告急？</span></span>
<span class="line"><span>   → free -h → 看 available</span></span>
<span class="line"><span>   → ps aux --sort=-%mem | head → 谁在吃内存</span></span>
<span class="line"><span>4. 磁盘问题？</span></span>
<span class="line"><span>   → df -h → 空间满了吗</span></span>
<span class="line"><span>   → iostat -x → IO 打满了吗</span></span>
<span class="line"><span>5. 网络问题？</span></span>
<span class="line"><span>   → ss -s → 连接数正常吗</span></span>
<span class="line"><span>   → curl 本机接口 → 本机正常说明是外部网络问题</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,23)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};