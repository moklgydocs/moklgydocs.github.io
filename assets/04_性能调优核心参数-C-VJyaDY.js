import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-C3QVrxQ1.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/07_%E7%BC%93%E5%AD%98%E4%B8%8E%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/04_%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E6%A0%B8%E5%BF%83%E5%8F%82%E6%95%B0.html","title":"性能调优核心参数","lang":"zh-CN","frontmatter":{"title":"性能调优核心参数","icon":"fa6-solid:gauge-high","order":4,"category":["Linux","Nginx"],"tag":["Nginx","性能调优","worker_processes","worker_connections","Buffer","超时","Benchmark"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":14.74,"words":4423},"filePathRelative":"Linux/07_Nginx/07_缓存与性能优化/04_性能调优核心参数.md"}`),s={name:`04_性能调优核心参数.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="性能调优核心参数" tabindex="-1"><a class="header-anchor" href="#性能调优核心参数"><span>性能调优核心参数</span></a></h1><p>Nginx 以高性能著称，但默认配置并非为所有场景最优。在高并发、大流量、特殊业务需求下，需要根据硬件资源和应用特征调优核心参数。本文从 Worker 进程模型、连接数、缓冲区、超时、限制等维度，系统讲解 Nginx 性能调优的每一个关键参数。</p><h2 id="_1-worker-processes-进程数配置" tabindex="-1"><a class="header-anchor" href="#_1-worker-processes-进程数配置"><span>1. worker_processes：进程数配置</span></a></h2><h3 id="_1-1-worker-进程模型" tabindex="-1"><a class="header-anchor" href="#_1-1-worker-进程模型"><span>1.1 Worker 进程模型</span></a></h3><p>Nginx 采用多进程架构，一个 Master 进程管理多个 Worker 进程：</p>`,5),i(d,{code:`eJxLy8kvT85ILCpRCHHhUgAC38TiktSiaCUIrfBi/+znK7ptkor07Z6vW/h8Qpv+k/0Ln/Zv13/Z2vt877qnXQte7N2rFKugq2unEG4YrRSeX5SdWqRrCNbhHBD6bMGOp/ubDZRikQyHKDaCKzZCVWyIRbExXLExqmIjLIpN4IpNUBUbAxWDVYcbglW6GkanFuTn5Cg82dX9ZPe2p/tWPe9bDzEv3Aiiwgi3CmOICmPcKkwgKkywqkB2iLNh9Iv98571LX22cQGK/c5GGBIQa52NMSQgtjmbIEuAZYpLKnNSYSGUlpmTY6WcaphmmpaKJAt0CEQm2SLVLNkSWcYIp4wxThkTVBkAi3njDQ==`}),o[1]||=n(`<div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># nginx.conf main 上下文</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># auto: 自动检测CPU核心数（推荐）</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 手动指定（某些场景需要）</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#D19A66;">4</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 与CPU核心数一致时性能最优</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看CPU核心数：nproc 或 lscpu</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-cpu-亲和性" tabindex="-1"><a class="header-anchor" href="#_1-2-cpu-亲和性"><span>1.2 CPU 亲和性</span></a></h3><p>CPU 亲和性（CPU Affinity）将 Worker 进程绑定到特定的 CPU 核心，减少上下文切换和缓存失效：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 手动绑定 Worker 到 CPU 核心</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4核CPU示例</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#D19A66;">4</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">worker_cpu_affinity </span><span style="color:#D19A66;">0001</span><span style="color:#D19A66;"> 0010</span><span style="color:#D19A66;"> 0100</span><span style="color:#D19A66;"> 1000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 8核CPU示例</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#D19A66;">8</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">worker_cpu_affinity </span><span style="color:#D19A66;">00000001</span><span style="color:#D19A66;"> 00000010</span><span style="color:#D19A66;"> 00000100</span><span style="color:#ABB2BF;"> 00001000</span></span>
<span class="line"><span style="color:#D19A66;">                     00010000</span><span style="color:#D19A66;"> 00100000</span><span style="color:#D19A66;"> 01000000</span><span style="color:#D19A66;"> 10000000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># auto: 自动绑定（Nginx 1.9.10+）</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_cpu_affinity </span><span style="color:#ABB2BF;">auto;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">何时使用 auto</p><p>在绝大多数场景下，<code>worker_processes auto;</code> + <code>worker_cpu_affinity auto;</code> 是最佳选择。Nginx 会自动将每个 Worker 绑定到独立的 CPU 核心。</p><p>手动绑定仅适用于特殊场景：</p><ul><li>NUMA 架构服务器，需要控制内存访问的 NUMA 节点</li><li>与其他服务共享服务器，需要隔离 CPU 资源</li><li>容器环境中 CPU 核心数不等于物理核心数</li></ul></div><h3 id="_1-3-worker-进程与-cpu-的关系" tabindex="-1"><a class="header-anchor" href="#_1-3-worker-进程与-cpu-的关系"><span>1.3 Worker 进程与 CPU 的关系</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 Worker 进程绑定的 CPU 核心</span></span>
<span class="line"><span style="color:#61AFEF;">ps</span><span style="color:#D19A66;"> -eo</span><span style="color:#98C379;"> pid,psr,comm</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出示例：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># PID  PSR COMMAND</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1234  0  nginx: worker process</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1235  1  nginx: worker process</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1236  2  nginx: worker process</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1237  3  nginx: worker process</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 CPU 核心数</span></span>
<span class="line"><span style="color:#61AFEF;">nproc</span><span style="color:#7F848E;font-style:italic;">          # 逻辑核心数</span></span>
<span class="line"><span style="color:#61AFEF;">lscpu</span><span style="color:#7F848E;font-style:italic;">          # 详细CPU信息</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看NUMA拓扑</span></span>
<span class="line"><span style="color:#61AFEF;">numactl</span><span style="color:#D19A66;"> --hardware</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-4-worker-进程调优决策" tabindex="-1"><a class="header-anchor" href="#_1-4-worker-进程调优决策"><span>1.4 Worker 进程调优决策</span></a></h3>`,8),i(d,{code:`eJxLy8kvT85ILCpRCHHhUgACx+jw/KLs1KIX+2c/X9H9bOqGl629z/eui1XQ1bVTcKp+Nqf3adfCpzNXPJux/umEZU92TH4+ZcWTXX1+6Zl5Ffa1YCOcQGprgApqFJyjy8GmxRcU5SenFhenFisklpbkxyKpA5qi8LR145Ndq+Fm1yi4VD9t3fZk9zSIkHNA6NPeBUCLoBa4gDU+2dunYGNsoAq0BUn05eoZCnZgUddoJQzL/WySivTt/Gyf9q8HGvdswY6n+5uBflSCOMgZ7Em3aojf/EJ9HZ/N2/ZsXgvUWleINJjthvCjO9ye5ILS+MS0tMy8zJJKsD/BtmkrgEx6vnvi03WzoBZBdAPtqFHwgIUQhmaIUnewpZ7RL1f1vFjfaKVQUKygm5qvUJCZolNQXKSTnJ+bq1CjkF6UWqCQB4oDiC4PiC4uMKe4pDInFei5tMycHCvlZItUs2RLJAlXqERaWpplsgkXACDuz0Y=`}),o[2]||=n(`<h2 id="_2-worker-connections-连接数调优" tabindex="-1"><a class="header-anchor" href="#_2-worker-connections-连接数调优"><span>2. worker_connections：连接数调优</span></a></h2><h3 id="_2-1-连接数计算" tabindex="-1"><a class="header-anchor" href="#_2-1-连接数计算"><span>2.1 连接数计算</span></a></h3><p><code>worker_connections</code> 设置单个 Worker 进程可以同时处理的最大连接数：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">512</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 默认值（实际默认为512，非1024）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 生产环境通常设置为 4096-65535</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最大并发连接数计算：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>最大连接数 = worker_processes × worker_connections</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 作为反向代理时（每个请求占用两个连接：客户端→Nginx→上游）</span></span>
<span class="line"><span>最大并发请求数 = worker_processes × worker_connections / 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 示例：</span></span>
<span class="line"><span># worker_processes = 8</span></span>
<span class="line"><span># worker_connections = 4096</span></span>
<span class="line"><span># 最大连接数 = 8 × 4096 = 32,768</span></span>
<span class="line"><span># 最大并发请求（反向代理） = 32,768 / 2 = 16,384</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-连接数与系统限制" tabindex="-1"><a class="header-anchor" href="#_2-2-连接数与系统限制"><span>2.2 连接数与系统限制</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 修改 worker_rlimit_nofile（Nginx层面）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 该值必须 &gt;= worker_connections</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 修改系统文件描述符限制（OS层面）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 临时修改</span></span>
<span class="line"><span style="color:#56B6C2;">ulimit</span><span style="color:#D19A66;"> -n</span><span style="color:#D19A66;"> 65535</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 永久修改：/etc/security/limits.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># * soft nofile 65535</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># * hard nofile 65535</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 修改 fs.file-max（内核层面）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/sysctl.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># fs.file-max = 2000000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看当前限制</span></span>
<span class="line"><span style="color:#56B6C2;">ulimit</span><span style="color:#D19A66;"> -n</span><span style="color:#7F848E;font-style:italic;">              # 用户级限制</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/sys/fs/file-max</span><span style="color:#7F848E;font-style:italic;">  # 内核级限制</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-连接数推荐值" tabindex="-1"><a class="header-anchor" href="#_2-3-连接数推荐值"><span>2.3 连接数推荐值</span></a></h3><table><thead><tr><th>场景</th><th>worker_connections</th><th>worker_rlimit_nofile</th><th>说明</th></tr></thead><tbody><tr><td>小型站点</td><td>1024</td><td>2048</td><td>日PV &lt; 10万</td></tr><tr><td>中型站点</td><td>4096</td><td>8192</td><td>日PV 10-100万</td></tr><tr><td>大型站点</td><td>65535</td><td>65535</td><td>日PV &gt; 100万</td></tr><tr><td>API网关</td><td>4096-65535</td><td>65535</td><td>长连接较多</td></tr></tbody></table><h3 id="_2-4-events-块完整配置" tabindex="-1"><a class="header-anchor" href="#_2-4-events-块完整配置"><span>2.4 events 块完整配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 单个Worker最大连接数</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 事件模型（Linux 默认 epoll）</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 允许一次性接受所有新连接</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 互斥锁：防止惊群效应</span></span>
<span class="line"><span style="color:#C678DD;">    accept_mutex </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 高并发下建议关闭（Nginx 1.11.3+ 默认关闭）</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">accept_mutex 与惊群效应</p><p>当新连接到来时，所有 Worker 进程都会被唤醒，但只有一个能接受连接，这就是惊群效应（Thundering Herd）。<code>accept_mutex</code> 通过加锁确保只有一个 Worker 被唤醒。</p><ul><li>低并发（&lt; 几百连接/秒）：<code>accept_mutex on</code> 减少不必要的唤醒</li><li>高并发（&gt; 几百连接/秒）：<code>accept_mutex off</code> 避免锁竞争成为瓶颈</li></ul><p>Nginx 1.11.3+ 默认 <code>accept_mutex off</code>，因为 Linux 内核已经通过 <code>EPOLLEXCLUSIVE</code> 解决了惊群问题。</p><p>注意：<code>EPOLLEXCLUSIVE</code> 在 Linux 4.5+ 中引入。如果运行在 Linux &lt; 4.5 的内核上，关闭 <code>accept_mutex</code> 可能导致惊群效应，此时建议显式开启 <code>accept_mutex on</code>。</p></div><h2 id="_3-worker-rlimit-nofile-文件描述符限制" tabindex="-1"><a class="header-anchor" href="#_3-worker-rlimit-nofile-文件描述符限制"><span>3. worker_rlimit_nofile：文件描述符限制</span></a></h2><h3 id="_3-1-文件描述符消耗" tabindex="-1"><a class="header-anchor" href="#_3-1-文件描述符消耗"><span>3.1 文件描述符消耗</span></a></h3><p>每个 Nginx 连接、日志文件、缓存文件、代理连接都需要文件描述符：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 文件描述符消耗估算</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 每个连接: 1个fd（客户端连接）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 反向代理: +1个fd（上游连接）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 日志文件: ~5个fd</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 缓存文件: 动态，取决于活跃缓存数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 推荐计算方式：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># worker_rlimit_nofile = worker_connections × 2 + 100（安全余量）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 例：worker_connections = 4096 → worker_rlimit_nofile = 8292</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 建议向上取整到 2 的幂或 65535</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-完整的限制体系" tabindex="-1"><a class="header-anchor" href="#_3-2-完整的限制体系"><span>3.2 完整的限制体系</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 三层限制必须全部放开</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 内核级限制</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/sys/fs/file-max</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改: sysctl -w fs.file-max=2000000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 用户级限制</span></span>
<span class="line"><span style="color:#56B6C2;">ulimit</span><span style="color:#D19A66;"> -n</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改: /etc/security/limits.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx soft nofile 65535</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx hard nofile 65535</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. Nginx 级限制</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx.conf: worker_rlimit_nofile 65535</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 关系：内核 ≥ 用户 ≥ Nginx</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果任何一层不够，都会报错：too many open files</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 诊断文件描述符问题</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看当前 Nginx 进程的 fd 使用情况</span></span>
<span class="line"><span style="color:#61AFEF;">ls</span><span style="color:#98C379;"> /proc/</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">pgrep</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;nginx: master&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span><span style="color:#ABB2BF;">)</span><span style="color:#98C379;">/fd</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看系统 fd 使用统计</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/sys/fs/file-nr</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出：已分配  未使用  最大值</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 例如：12345   0       2000000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 监控 fd 使用趋势</span></span>
<span class="line"><span style="color:#61AFEF;">watch</span><span style="color:#D19A66;"> -n</span><span style="color:#D19A66;"> 1</span><span style="color:#98C379;"> &#39;cat /proc/sys/fs/file-nr&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-buffer-大小调优" tabindex="-1"><a class="header-anchor" href="#_4-buffer-大小调优"><span>4. Buffer 大小调优</span></a></h2><p>Buffer 配置直接影响 Nginx 的内存使用和请求处理能力。过小的 Buffer 导致磁盘 I/O，过大的 Buffer 浪费内存。</p><h3 id="_4-1-客户端请求-buffer" tabindex="-1"><a class="header-anchor" href="#_4-1-客户端请求-buffer"><span>4.1 客户端请求 Buffer</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 客户端请求头缓冲区</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 默认 1k，通常足够</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 如果请求头很大（很多Cookie、自定义头），需要调大</span></span>
<span class="line"><span style="color:#C678DD;">    client_header_buffer_size </span><span style="color:#D19A66;">1k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 大请求头的备用缓冲区</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 默认 4k × 8 = 32k</span></span>
<span class="line"><span style="color:#C678DD;">    large_client_header_buffers </span><span style="color:#D19A66;">4</span><span style="color:#D19A66;"> 8k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 客户端请求体缓冲区</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 请求体超过此值会写入临时文件</span></span>
<span class="line"><span style="color:#C678DD;">    client_body_buffer_size </span><span style="color:#D19A66;">16k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 客户端请求体最大大小</span></span>
<span class="line"><span style="color:#C678DD;">    client_max_body_size </span><span style="color:#D19A66;">10m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 文件上传场景</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /upload/ {</span></span>
<span class="line"><span style="color:#C678DD;">            client_max_body_size </span><span style="color:#D19A66;">100m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            client_body_buffer_size </span><span style="color:#D19A66;">1m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # API 场景</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">            client_max_body_size </span><span style="color:#D19A66;">1m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            client_body_buffer_size </span><span style="color:#D19A66;">64k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-代理-buffer" tabindex="-1"><a class="header-anchor" href="#_4-2-代理-buffer"><span>4.2 代理 Buffer</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # proxy_buffer_size: 读取上游响应头的缓冲区</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 默认 4k/8k（取决于平台）</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_buffer_size </span><span style="color:#D19A66;">4k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # proxy_buffers: 读取上游响应体的缓冲区</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 格式：数量 大小</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_buffers </span><span style="color:#D19A66;">8</span><span style="color:#D19A66;"> 4k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # proxy_busy_buffers_size: 忙时缓冲区大小</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 响应尚未完全读取就向客户端发送时的缓冲区</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_busy_buffers_size </span><span style="color:#D19A66;">8k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 大响应场景（如大数据API）</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/reports/ {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_buffer_size </span><span style="color:#D19A66;">8k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_buffers </span><span style="color:#D19A66;">16</span><span style="color:#D19A66;"> 16k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_busy_buffers_size </span><span style="color:#D19A66;">32k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 流式响应场景（SSE/WebSocket）</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/stream/ {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_buffering </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 关闭代理缓冲，实时转发</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-buffer-调优原则" tabindex="-1"><a class="header-anchor" href="#_4-3-buffer-调优原则"><span>4.3 Buffer 调优原则</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 原则1：proxy_buffer_size &gt;= 上游响应头大小</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查上游响应头大小</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># curl -sI https://api.example.com/ | wc -c</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：如果上游响应头超过 proxy_buffer_size 的大小，</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 会返回 502 Bad Gateway 错误</span></span>
<span class="line"><span style="color:#C678DD;">proxy_buffer_size </span><span style="color:#D19A66;">8k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 原则2：proxy_buffers 总大小 &gt;= 典型响应体大小</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 总大小 = 数量 × 单个大小</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 8 × 4k = 32k（适合小响应）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 16 × 16k = 256k（适合中等响应）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 8 × 32k = 256k（适合大响应）</span></span>
<span class="line"><span style="color:#C678DD;">proxy_buffers </span><span style="color:#D19A66;">8</span><span style="color:#D19A66;"> 16k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 原则3：proxy_busy_buffers_size &lt;= proxy_buffers 总大小 / 2</span></span>
<span class="line"><span style="color:#C678DD;">proxy_busy_buffers_size </span><span style="color:#D19A66;">16k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 原则4：大响应优先调 proxy_buffers，小响应调 proxy_buffer_size</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">Buffer 与内存</p><p>每个请求的 Buffer 是独立分配的。如果 <code>proxy_buffers 16 16k</code>，则每个代理请求最多使用 256KB 内存。在 1000 并发请求时，仅 Buffer 就需要 250MB 内存。</p><p>计算公式：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>总内存 ≈ worker_connections × (client_buffer + proxy_buffer)</span></span>
<span class="line"><span>       = 4096 × (16k + 256k)</span></span>
<span class="line"><span>       = 4096 × 272k</span></span>
<span class="line"><span>       ≈ 1.06 GB</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>确保服务器有足够的物理内存。</p></div><h2 id="_5-超时参数调优" tabindex="-1"><a class="header-anchor" href="#_5-超时参数调优"><span>5. 超时参数调优</span></a></h2><h3 id="_5-1-客户端超时" tabindex="-1"><a class="header-anchor" href="#_5-1-客户端超时"><span>5.1 客户端超时</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # keepalive 超时</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 长连接保持时间，0表示关闭长连接</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 长连接最大请求数</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_requests </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 客户端请求头超时</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 客户端发送请求头的最大时间</span></span>
<span class="line"><span style="color:#C678DD;">    client_header_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 客户端请求体超时</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 客户端发送请求体的最大间隔时间</span></span>
<span class="line"><span style="color:#C678DD;">    client_body_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 发送响应超时</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 向客户端写入响应的超时</span></span>
<span class="line"><span style="color:#C678DD;">    send_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-代理超时" tabindex="-1"><a class="header-anchor" href="#_5-2-代理超时"><span>5.2 代理超时</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 与上游建立连接的超时</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_connect_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 从上游读取响应的超时</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 两次成功读取之间的间隔</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_read_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 向上游发送请求的超时</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 两次成功写入之间的间隔</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_send_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 快速API</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/fast/ {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_read_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_send_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 慢API（报表生成等）</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/reports/ {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_connect_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_read_timeout </span><span style="color:#D19A66;">300s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_send_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # SSE/长轮询</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/events/ {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_read_timeout </span><span style="color:#D19A66;">3600s</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 1小时</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_send_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_buffering </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-超时参数对照表" tabindex="-1"><a class="header-anchor" href="#_5-3-超时参数对照表"><span>5.3 超时参数对照表</span></a></h3><table><thead><tr><th>参数</th><th>默认值</th><th>作用</th><th>推荐值</th></tr></thead><tbody><tr><td>keepalive_timeout</td><td>75s</td><td>长连接保持时间</td><td>60-120s</td></tr><tr><td>keepalive_requests</td><td>100 (&lt; 1.19.10) / 1000 (≥ 1.19.10)</td><td>长连接最大请求数</td><td>1000+</td></tr><tr><td>client_header_timeout</td><td>60s</td><td>客户端请求头超时</td><td>30-60s</td></tr><tr><td>client_body_timeout</td><td>60s</td><td>客户端请求体超时</td><td>30-60s</td></tr><tr><td>send_timeout</td><td>60s</td><td>发送响应超时</td><td>30-60s</td></tr><tr><td>proxy_connect_timeout</td><td>60s</td><td>上游连接超时</td><td>5-30s</td></tr><tr><td>proxy_read_timeout</td><td>60s</td><td>上游读取超时</td><td>30-300s</td></tr><tr><td>proxy_send_timeout</td><td>60s</td><td>上游发送超时</td><td>5-30s</td></tr><tr><td>proxy_next_upstream_timeout</td><td>0</td><td>尝试下一个上游超时</td><td>10-30s</td></tr></tbody></table><h2 id="_6-请求体大小-client-max-body-size" tabindex="-1"><a class="header-anchor" href="#_6-请求体大小-client-max-body-size"><span>6. 请求体大小：client_max_body_size</span></a></h2><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 全局默认：1MB</span></span>
<span class="line"><span style="color:#C678DD;">    client_max_body_size </span><span style="color:#D19A66;">1m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 文件上传</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /upload/ {</span></span>
<span class="line"><span style="color:#C678DD;">            client_max_body_size </span><span style="color:#D19A66;">100m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 超过此值的请求返回 413 Request Entity Too Large</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 图片上传</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/avatar/ {</span></span>
<span class="line"><span style="color:#C678DD;">            client_max_body_size </span><span style="color:#D19A66;">5m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # JSON API</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">            client_max_body_size </span><span style="color:#D19A66;">1m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">413 错误排查</p><p><code>413 Request Entity Too Large</code> 是文件上传场景最常见的错误。需要检查：</p><ol><li><code>client_max_body_size</code> — Nginx 限制</li><li>上游应用服务器的限制（如 Spring 的 <code>spring.servlet.multipart.max-file-size</code>）</li><li>前端的请求头 <code>Content-Length</code> 是否正确</li></ol><p>注意：<code>client_max_body_size</code> 可以出现在 http/server/location 三级，就近原则。</p></div><h2 id="_7-输出压缩与传输优化" tabindex="-1"><a class="header-anchor" href="#_7-输出压缩与传输优化"><span>7. 输出压缩与传输优化</span></a></h2><h3 id="_7-1-压缩与传输的完整配置" tabindex="-1"><a class="header-anchor" href="#_7-1-压缩与传输的完整配置"><span>7.1 压缩与传输的完整配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 零拷贝传输</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Gzip 压缩</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_comp_level </span><span style="color:#D19A66;">5</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_min_length </span><span style="color:#D19A66;">1024</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_types </span><span style="color:#ABB2BF;">text/plain text/css application/javascript application/json image/svg+xml;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_vary </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_proxied </span><span style="color:#ABB2BF;">any;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_buffers </span><span style="color:#D19A66;">16</span><span style="color:#D19A66;"> 8k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 响应体切片（大文件分段发送）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # slice 1m;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # proxy_set_header Range $slice_range;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_8-性能调优检查清单" tabindex="-1"><a class="header-anchor" href="#_8-性能调优检查清单"><span>8. 性能调优检查清单</span></a></h2><h3 id="_8-1-调优决策树" tabindex="-1"><a class="header-anchor" href="#_8-1-调优决策树"><span>8.1 调优决策树</span></a></h3>`,45),i(d,{code:`eJx1k99v0lAUx9/3V5zMR7MQHzRq3Mx+uc2xH8qMD81CWNdujYwupWSb1ISMIMQJwzAGKhkLMkCNG0bTNALy4L/CvS3/hdd72wEu69vNOd9zvp9zTkW/vMNv+hQVVqaGgHzj3OKGFNgFHKla0ZZVj3aa+VUYGRmDibCZ0bulBCrUUObLw1c0feJfSJtcfgadVts8qpmpePdrXoNJDn+K4OIZPJeVF4ICVvujWTvA2foqlU3SilPhHRr1bisyLwSDQhBGgdTCpwZqR0my3WSKNkHpigbTHLGEsz/hitIXUmVWnKXj/IUGj7hh5oO8iB4ls1b7BKfOsJ6wIjnSymrHUfnDgzXFNYYq+x6P24VSB2bzs8sd8g2vDvUx2sJsvWMkUbmowYyNeBnovk+jhM48zFDAWQeQlwMBgVclORAES/9B9DbabA9tjkOlE1SuOmh9GlaT5VKuxw4XiOvA+lIGW6r4pS1J9QZkUfIL4IIQfQ/yoNcx9C1PYIgfDeadfU2ERJHsqxtLmq1z1neesrjDdoiNkg6ualO4e84WOBQ/RPVDpxBJIi9WiKVR2EUH4HJ68CdnayjJKLnABvPYLUTw9/3/3Dd0q12kp7bk7EGP4ZzeMVJm653ZKLCWS9T7crhjvMGGgTJJ9OsIx0q27+We7yccOXT09pgl4sSxvQxyYLt7XkXwrXtVaUuQQyorzKSU5eng7JwL6jRPrd8ZZ5D93o0KOm+xn0kDD4eaEZS+YCq4CWYzQ6BZFw+1v8JtvJS2XWuKrPolksE88T5+U7ALB9U9suhxIPv2378h3BJvi0JfYNoO8HeFO/y9vsDcdYGF6wIrg4G/E8PeLQ==`}),o[3]||=n(`<h3 id="_8-2-生产级调优配置模板" tabindex="-1"><a class="header-anchor" href="#_8-2-生产级调优配置模板"><span>8.2 生产级调优配置模板</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;">nginx;</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_cpu_affinity </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">pid </span><span style="color:#ABB2BF;">/var/run/nginx.pid;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    accept_mutex </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/mime.types;</span></span>
<span class="line"><span style="color:#C678DD;">    default_type </span><span style="color:#ABB2BF;">application/octet-stream;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 传输优化 =====</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 连接优化 =====</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_requests </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 客户端限制 =====</span></span>
<span class="line"><span style="color:#C678DD;">    client_header_buffer_size </span><span style="color:#D19A66;">1k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    large_client_header_buffers </span><span style="color:#D19A66;">4</span><span style="color:#D19A66;"> 8k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    client_body_buffer_size </span><span style="color:#D19A66;">16k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    client_max_body_size </span><span style="color:#D19A66;">10m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    client_header_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    client_body_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    send_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 代理优化 =====</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_buffer_size </span><span style="color:#D19A66;">8k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_buffers </span><span style="color:#D19A66;">8</span><span style="color:#D19A66;"> 16k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_busy_buffers_size </span><span style="color:#D19A66;">16k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_connect_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_read_timeout </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_send_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 压缩 =====</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_comp_level </span><span style="color:#D19A66;">5</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_min_length </span><span style="color:#D19A66;">1024</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_types </span><span style="color:#ABB2BF;">text/plain text/css application/javascript application/json image/svg+xml;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_vary </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_proxied </span><span style="color:#ABB2BF;">any;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 文件缓存 =====</span></span>
<span class="line"><span style="color:#C678DD;">    open_file_cache </span><span style="color:#ABB2BF;">max=10000 inactive=30s;</span></span>
<span class="line"><span style="color:#C678DD;">    open_file_cache_valid </span><span style="color:#D19A66;">60s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    open_file_cache_min_uses </span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 安全 =====</span></span>
<span class="line"><span style="color:#C678DD;">    server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 上游长连接 =====</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.10:8080;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.11:8080;</span></span>
<span class="line"><span style="color:#C678DD;">        keepalive </span><span style="color:#D19A66;">32</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-benchmark-工具" tabindex="-1"><a class="header-anchor" href="#_9-benchmark-工具"><span>9. Benchmark 工具</span></a></h2><h3 id="_9-1-wrk" tabindex="-1"><a class="header-anchor" href="#_9-1-wrk"><span>9.1 wrk</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 wrk</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Ubuntu: apt install wrk</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CentOS: 编译安装</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> clone</span><span style="color:#98C379;"> https://github.com/wg/wrk.git</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> wrk</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">make</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> cp</span><span style="color:#98C379;"> wrk</span><span style="color:#98C379;"> /usr/local/bin/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基本测试</span></span>
<span class="line"><span style="color:#61AFEF;">wrk</span><span style="color:#D19A66;"> -t4</span><span style="color:#D19A66;"> -c100</span><span style="color:#D19A66;"> -d30s</span><span style="color:#98C379;"> http://example.com/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 参数说明：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -t4:     4个线程</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -c100:   100个连接</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -d30s:   持续30秒</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出解读：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Running 30s test @ http://example.com/</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   4 threads and 100 connections</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   Thread Stats   Avg      Stdev     Max   +/- Stdev</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     Latency    12.34ms   5.67ms  89.12ms   75.43%</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     Req/Sec     2.05k   201.34     3.12k    68.50%</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   Latency Distribution</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     50%   10.12ms</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     75%   14.56ms</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     90%   19.23ms</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     99%   35.67ms</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   245678 requests in 30.01s, 89.12MB read</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Requests/sec:   8186.23</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Transfer/sec:     2.97MB</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 带延迟详细分布</span></span>
<span class="line"><span style="color:#61AFEF;">wrk</span><span style="color:#D19A66;"> -t4</span><span style="color:#D19A66;"> -c100</span><span style="color:#D19A66;"> -d30s</span><span style="color:#D19A66;"> --latency</span><span style="color:#98C379;"> http://example.com/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 测试特定API</span></span>
<span class="line"><span style="color:#61AFEF;">wrk</span><span style="color:#D19A66;"> -t4</span><span style="color:#D19A66;"> -c50</span><span style="color:#D19A66;"> -d10s</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> post.lua</span><span style="color:#98C379;"> http://api.example.com/api/data</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># post.lua 脚本</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">post.lua</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">wrk.method = &quot;POST&quot;</span></span>
<span class="line"><span style="color:#98C379;">wrk.body   = &#39;{&quot;key&quot;:&quot;value&quot;}&#39;</span></span>
<span class="line"><span style="color:#98C379;">wrk.headers[&quot;Content-Type&quot;] = &quot;application/json&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-ab-apache-benchmark" tabindex="-1"><a class="header-anchor" href="#_9-2-ab-apache-benchmark"><span>9.2 ab (Apache Benchmark)</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Ubuntu: apt install apache2-utils</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CentOS: yum install httpd-tools</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基本测试</span></span>
<span class="line"><span style="color:#61AFEF;">ab</span><span style="color:#D19A66;"> -n</span><span style="color:#D19A66;"> 10000</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 100</span><span style="color:#98C379;"> http://example.com/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 参数说明：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -n 10000: 总请求数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -c 100:  并发数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 带Keep-Alive测试</span></span>
<span class="line"><span style="color:#61AFEF;">ab</span><span style="color:#D19A66;"> -n</span><span style="color:#D19A66;"> 10000</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 100</span><span style="color:#D19A66;"> -k</span><span style="color:#98C379;"> http://example.com/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># POST请求测试</span></span>
<span class="line"><span style="color:#61AFEF;">ab</span><span style="color:#D19A66;"> -n</span><span style="color:#D19A66;"> 1000</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 50</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> post.data</span><span style="color:#D19A66;"> -T</span><span style="color:#98C379;"> &quot;application/json&quot;</span><span style="color:#98C379;"> http://api.example.com/api/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出关键指标：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Requests per second:    8186.23 [#/sec] (mean)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Time per request:       12.216 [ms] (mean)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Time per request:       0.122 [ms] (mean, across all concurrent requests)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Transfer rate:          3044.23 [Kbytes/sec] received</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-hey" tabindex="-1"><a class="header-anchor" href="#_9-3-hey"><span>9.3 hey</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># go install github.com/rakyll/hey@latest</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或下载二进制</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基本测试</span></span>
<span class="line"><span style="color:#61AFEF;">hey</span><span style="color:#D19A66;"> -n</span><span style="color:#D19A66;"> 10000</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 100</span><span style="color:#98C379;"> http://example.com/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 参数与 wrk 类似</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -n: 总请求数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -c: 并发数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -z: 持续时间</span></span>
<span class="line"><span style="color:#61AFEF;">hey</span><span style="color:#D19A66;"> -z</span><span style="color:#98C379;"> 30s</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 100</span><span style="color:#98C379;"> http://example.com/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># POST请求</span></span>
<span class="line"><span style="color:#61AFEF;">hey</span><span style="color:#D19A66;"> -n</span><span style="color:#D19A66;"> 1000</span><span style="color:#D19A66;"> -c</span><span style="color:#D19A66;"> 50</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> POST</span><span style="color:#D19A66;"> -H</span><span style="color:#98C379;"> &quot;Content-Type: application/json&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -d</span><span style="color:#98C379;"> &#39;{&quot;key&quot;:&quot;value&quot;}&#39;</span><span style="color:#98C379;"> http://api.example.com/api/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出包含更详细的延迟分布和直方图</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-4-压测方法与注意事项" tabindex="-1"><a class="header-anchor" href="#_9-4-压测方法与注意事项"><span>9.4 压测方法与注意事项</span></a></h3><div class="hint-container warning"><p class="hint-container-title">压测注意事项</p><ol><li><strong>不要在生产环境压测</strong>：使用独立的测试环境</li><li><strong>预热后再采集数据</strong>：前几秒的数据不稳定</li><li><strong>多次测试取平均</strong>：单次结果可能有偏差</li><li><strong>逐步增加并发</strong>：从小并发开始，逐步加到目标值</li><li><strong>注意客户端瓶颈</strong>：压测机本身可能成为瓶颈</li><li><strong>监控服务端资源</strong>：压测时同步监控CPU/内存/网络/磁盘</li><li><strong>关闭日志</strong>：压测时 <code>access_log off</code> 减少磁盘影响</li><li><strong>Keep-Alive</strong>：测试时开启 Keep-Alive 更贴近真实场景</li></ol></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 完整的压测流程</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 预热</span></span>
<span class="line"><span style="color:#61AFEF;">wrk</span><span style="color:#D19A66;"> -t2</span><span style="color:#D19A66;"> -c10</span><span style="color:#D19A66;"> -d5s</span><span style="color:#98C379;"> http://example.com/</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> 2&gt;&amp;1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 逐步加压</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> c</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> 50</span><span style="color:#98C379;"> 100</span><span style="color:#98C379;"> 200</span><span style="color:#98C379;"> 500</span><span style="color:#98C379;"> 1000</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;=== 并发数: </span><span style="color:#E06C75;">$c</span><span style="color:#98C379;"> ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    wrk</span><span style="color:#D19A66;"> -t4</span><span style="color:#D19A66;"> -c</span><span style="color:#E06C75;">$c</span><span style="color:#D19A66;"> -d30s</span><span style="color:#D19A66;"> --latency</span><span style="color:#98C379;"> http://example.com/</span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 5</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 监控服务端</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 另一个终端</span></span>
<span class="line"><span style="color:#61AFEF;">watch</span><span style="color:#D19A66;"> -n</span><span style="color:#D19A66;"> 1</span><span style="color:#98C379;"> &#39;echo &quot;=== CPU ===&quot; &amp;&amp; mpstat 1 1 &amp;&amp; echo &quot;=== 内存 ===&quot; &amp;&amp; free -h &amp;&amp; echo &quot;=== 连接 ===&quot; &amp;&amp; ss -s&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-性能监控与瓶颈定位" tabindex="-1"><a class="header-anchor" href="#_10-性能监控与瓶颈定位"><span>10. 性能监控与瓶颈定位</span></a></h2><h3 id="_10-1-nginx-内置状态页" tabindex="-1"><a class="header-anchor" href="#_10-1-nginx-内置状态页"><span>10.1 Nginx 内置状态页</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 编译时需要 --with-http_stub_status_module</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">localhost;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /nginx_status {</span></span>
<span class="line"><span style="color:#C678DD;">        stub_status</span><span style="color:#ABB2BF;"> on;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#D19A66;">127.0.0.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 访问状态页</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#98C379;"> http://127.0.0.1/nginx_status</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Active connections: 291</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># server accepts handled requests</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#  16630948 16630948 31070465</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Reading: 6 Writing: 179 Waiting: 106</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Active connections: 当前活跃连接数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># accepts: 累计接受的连接数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># handled: 累计处理的连接数（应与accepts相同）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># requests: 累计请求数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Reading: 正在读取请求头的连接数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Writing: 正在写入响应的连接数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Waiting: Keep-Alive空闲连接数</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-系统级监控" tabindex="-1"><a class="header-anchor" href="#_10-2-系统级监控"><span>10.2 系统级监控</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># CPU 使用率</span></span>
<span class="line"><span style="color:#61AFEF;">top</span><span style="color:#D19A66;"> -bn1</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 内存使用</span></span>
<span class="line"><span style="color:#61AFEF;">ps</span><span style="color:#D19A66;"> -eo</span><span style="color:#98C379;"> pid,rss,vsz,comm</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 网络连接统计</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -s</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tn</span><span style="color:#98C379;"> state</span><span style="color:#98C379;"> established</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 文件描述符使用</span></span>
<span class="line"><span style="color:#61AFEF;">ls</span><span style="color:#98C379;"> /proc/</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">pgrep</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;nginx: master&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span><span style="color:#ABB2BF;">)</span><span style="color:#98C379;">/fd</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 系统负载</span></span>
<span class="line"><span style="color:#61AFEF;">uptime</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># I/O 统计</span></span>
<span class="line"><span style="color:#61AFEF;">iostat</span><span style="color:#D19A66;"> -x</span><span style="color:#D19A66;"> 1</span><span style="color:#D19A66;"> 5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-nginx-性能指标监控脚本" tabindex="-1"><a class="header-anchor" href="#_10-3-nginx-性能指标监控脚本"><span>10.3 Nginx 性能指标监控脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx_monitor.sh - Nginx 性能监控</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">while</span><span style="color:#56B6C2;"> true</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#E06C75;">    STATUS</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> http://127.0.0.1/nginx_status</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    ACTIVE</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$STATUS</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;/Active/ {print $3}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    READING</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$STATUS</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;/Reading/ {print $2}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    WRITING</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$STATUS</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;/Writing/ {print $4}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    WAITING</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$STATUS</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;/Waiting/ {print $6}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">    CONNECTIONS</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tn</span><span style="color:#98C379;"> state</span><span style="color:#98C379;"> established</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    FD_COUNT</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">ls</span><span style="color:#98C379;"> /proc/</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">pgrep</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;nginx: master&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span><span style="color:#ABB2BF;">)</span><span style="color:#98C379;">/fd</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;) | Active: </span><span style="color:#E06C75;">$ACTIVE</span><span style="color:#98C379;"> | Reading: </span><span style="color:#E06C75;">$READING</span><span style="color:#98C379;"> | Writing: </span><span style="color:#E06C75;">$WRITING</span><span style="color:#98C379;"> | Waiting: </span><span style="color:#E06C75;">$WAITING</span><span style="color:#98C379;"> | Estab: </span><span style="color:#E06C75;">$CONNECTIONS</span><span style="color:#98C379;"> | FD: </span><span style="color:#E06C75;">$FD_COUNT</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 5</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-4-瓶颈定位方法" tabindex="-1"><a class="header-anchor" href="#_10-4-瓶颈定位方法"><span>10.4 瓶颈定位方法</span></a></h3>`,21),i(d,{code:`eJxVkmFL20AYx9/3UxyMvSyzrR06hmNtao2VbdCNvQhllJgwWddAW3EjGXRsalGskzqSTdFR7eJwOl8MCdrQL9PLJd/Cy12id3kXfv+75/c8z6k1bUV+W220wEshAfD3VPLatv/FDczzoG9VQDI5A3J6/sUrMHZHaPcEddeffCLJXMiM4NQCM1MT9w2Ql8IU6l0G/U6FJPLkdD4leUdt73AAyuUFALcc33U5no447G6i4R90ZcPOKRfIxBcsLFeB//Wnt/+X45MS7B/AjV/gtdZ4pzSAP9pDJ5uVBKM5ds5AdiJJRAUdrq3CM4s2FHUjxN0YoCBRzrZSIJUKKQmub8OLbZBbVlVcCR7b+I+LpGlkxx8deN2B9/2Co3EraNjDFeLjjAEWNcCsjtwddL0PxAfPI7/ZO7+iBJ3f8Nxl/Yrk+iL2G7bht390lBzCXgTRyhzKSHQUIC88i2RoOSIzp6Ojz2jPYmTm7mREiVJWRiTXilgGr+XYjobFsXRcslwWOJCJxueZAzgy4doPuDrgN+l2weNsuMd5nc44sA5hx4zU5kkI2eEIDFCSaIS1K5FCpVu7pva++kHW6nUO43FRvELe1JswoMitJa3e5HLxQsfOhuc4sLcFr3Y98zIw/0fWzdbHmoJfqrpUqz26p6ry4mKaAYVboE7LkwwoRkBJqVlVYYAYn8goWTXLgFIE5CnloTyduAHCNozK`}),o[4]||=n(`<h2 id="_11-特殊场景调优" tabindex="-1"><a class="header-anchor" href="#_11-特殊场景调优"><span>11. 特殊场景调优</span></a></h2><h3 id="_11-1-高并发短连接" tabindex="-1"><a class="header-anchor" href="#_11-1-高并发短连接"><span>11.1 高并发短连接</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 适合：API 网关、短连接场景</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">100000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    accept_mutex </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;     </span><span style="color:#7F848E;font-style:italic;"># 短超时释放连接</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_requests </span><span style="color:#D19A66;">500</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 减少单连接请求数</span></span>
<span class="line"><span style="color:#C678DD;">    reset_timedout_connection </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 超时立即关闭</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 减少不必要的日志</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 或采样日志</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-2-大文件传输" tabindex="-1"><a class="header-anchor" href="#_11-2-大文件传输"><span>11.2 大文件传输</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 适合：文件下载、视频流</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    aio </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    directio </span><span style="color:#D19A66;">5m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 大 Buffer</span></span>
<span class="line"><span style="color:#C678DD;">    output_buffers </span><span style="color:#D19A66;">2</span><span style="color:#D19A66;"> 1m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_buffer_size </span><span style="color:#D19A66;">16k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_buffers </span><span style="color:#D19A66;">16</span><span style="color:#D19A66;"> 64k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 长超时</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_read_timeout </span><span style="color:#D19A66;">300s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    send_timeout </span><span style="color:#D19A66;">300s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-3-ssl-tls-密集场景" tabindex="-1"><a class="header-anchor" href="#_11-3-ssl-tls-密集场景"><span>11.3 SSL/TLS 密集场景</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 适合：HTTPS 高并发</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SSL Session 缓存</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_session_cache </span><span style="color:#ABB2BF;">shared:SSL:10m;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_session_timeout </span><span style="color:#D19A66;">1d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_session_tickets </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # OCSP Stapling</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_stapling </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_stapling_verify </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 优先使用服务端加密套件</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_prefer_server_ciphers </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 优化加密套件（性能优先）</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_ciphers </span><span style="color:#98C379;">&#39;ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-4-websocket-长连接" tabindex="-1"><a class="header-anchor" href="#_11-4-websocket-长连接"><span>11.4 WebSocket 长连接</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 适合：实时通信、WebSocket</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 长超时</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_read_timeout </span><span style="color:#D19A66;">3600s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_send_timeout </span><span style="color:#D19A66;">3600s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 关闭缓冲</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_buffering </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # WebSocket 升级</span></span>
<span class="line"><span style="color:#C678DD;">    map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_upgrade</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">connection_upgrade</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">        default</span><span style="color:#ABB2BF;"> upgrade;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&#39;</span><span style="color:#ABB2BF;"> close;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /ws/ {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Upgrade $</span><span style="color:#E06C75;">http_upgrade</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Connection $</span><span style="color:#E06C75;">connection_upgrade</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_12-参考文档" tabindex="-1"><a class="header-anchor" href="#_12-参考文档"><span>12. 参考文档</span></a></h2><ul><li><a href="https://nginx.org/en/docs/ngx_core_module.html#worker_processes" target="_blank" rel="noopener noreferrer">Nginx Core Functionality: worker_processes</a></li><li><a href="https://nginx.org/en/docs/ngx_core_module.html#worker_connections" target="_blank" rel="noopener noreferrer">Nginx Core Functionality: worker_connections</a></li><li><a href="https://nginx.org/en/docs/ngx_core_module.html#worker_rlimit_nofile" target="_blank" rel="noopener noreferrer">Nginx Core Functionality: worker_rlimit_nofile</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffers" target="_blank" rel="noopener noreferrer">Nginx ngx_http_proxy_module: proxy_buffers</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_connect_timeout" target="_blank" rel="noopener noreferrer">Nginx ngx_http_proxy_module: proxy_connect_timeout</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size" target="_blank" rel="noopener noreferrer">Nginx ngx_http_core_module: client_max_body_size</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_core_module.html#keepalive_timeout" target="_blank" rel="noopener noreferrer">Nginx ngx_http_core_module: keepalive_timeout</a></li><li><a href="https://github.com/wg/wrk" target="_blank" rel="noopener noreferrer">wrk - HTTP benchmarking tool</a></li><li><a href="https://github.com/rakyll/hey" target="_blank" rel="noopener noreferrer">hey - HTTP load generator</a></li></ul>`,11)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};