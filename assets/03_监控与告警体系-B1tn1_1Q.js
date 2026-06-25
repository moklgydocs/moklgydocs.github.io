import{A as e,E as t,d as n,l as r,p as i,s as a}from"./runtime-core.esm-bundler-BVtXrkU4.js";import{t as o}from"./app-DvxCNKUe.js";var s=JSON.parse(`{"path":"/Linux/05_%E7%94%9F%E4%BA%A7%E7%BA%A7%E5%AE%9E%E6%88%98/03_%E7%9B%91%E6%8E%A7%E4%B8%8E%E5%91%8A%E8%AD%A6%E4%BD%93%E7%B3%BB.html","title":"监控与告警体系","lang":"zh-CN","frontmatter":{"title":"监控与告警体系","icon":"fa6-solid:chart-line","order":3,"category":["Linux","生产级实战"],"tag":["Prometheus","Grafana","Alertmanager","ELK","监控","告警"]},"git":{"createdTime":1780586585000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":17.68,"words":5303},"filePathRelative":"Linux/05_生产级实战/03_监控与告警体系.md"}`),c={name:`03_监控与告警体系.md`};function l(o,s,c,l,u,d){let f=e(`Mermaid`);return t(),r(`div`,null,[s[0]||=a(`h1`,{id:`监控与告警体系`,tabindex:`-1`},[a(`a`,{class:`header-anchor`,href:`#监控与告警体系`},[a(`span`,null,`监控与告警体系`)])],-1),s[1]||=a(`blockquote`,null,[a(`p`,null,`没有监控的生产环境如同蒙眼走钢丝——你不知道系统正在经历什么，直到用户投诉电话打爆。监控不是奢侈品，而是生产环境的生命线。`)],-1),s[2]||=a(`h2`,{id:`监控告警体系架构总览`,tabindex:`-1`},[a(`a`,{class:`header-anchor`,href:`#监控告警体系架构总览`},[a(`span`,null,`监控告警体系架构总览`)])],-1),i(f,{code:`eJx1UF1PE0EUfe+vmIzPpDFRI8aQFLrbTxKivk2M2W5naePSku026hs0pCsEFLUIKWqpWm2IbSUKFErgz+zM7P4LyuzSTvmYzMOZOeeee+7V9PwrNaMYJngWDoD+KRRTs4YynwF04y9da7uW5W6XyV6JkxcnhGAun8Yv8Ov5vGFi43HKCE6wfz3Wq9FVi+5Y8PlAO4kgOa6wShNIotruVslK/Zp6CkE5q+MUVsygrBdxzkxzOd1skLNNL4kgDyPoWLukXbWPlsFMsZDhYmepSr/8GfHGuXRgdDbS2iKlpt19R34usfWR8SQEZ4z8HDYzuFjw2nOvQQmtNZzOdyGHjKCUTICnpqK+FPIOC34ssP+XBTdked9xfpfJ6ueLOB9WnNYvMU4EwYihaEpO8TbX23XqTba9JfSPIhjSsWHO9UWz/oY9I+ewwyp7gjSGYCKbujTzc74t02/rt8ZzF6qs1qDdHXfx08AnjtyPy/0btE8WyWl72CCB3FLb7h0Mf5KI1Vr2WT3IKvtO5+uQmEbx2JMQIIcNsrZxpXsIjI1NAInjSQGHBTzFsewVSPwREXCUY5njmCeK8kdcwAkBJwU87S/BfKPjvp+W1fVHd/Bd7b6GBSLqE5qmjav3BCLiE+pD/EAdD5wDylY+Yg==`}),s[3]||=n(`<h2 id="一、监控体系设计" tabindex="-1"><a class="header-anchor" href="#一、监控体系设计"><span>一、监控体系设计</span></a></h2><h3 id="_1-1-监控的三大支柱" tabindex="-1"><a class="header-anchor" href="#_1-1-监控的三大支柱"><span>1.1 监控的三大支柱</span></a></h3><table><thead><tr><th>支柱</th><th>关注点</th><th>工具</th><th>数据特征</th></tr></thead><tbody><tr><td><strong>指标（Metrics）</strong></td><td>系统状态、性能趋势</td><td>Prometheus</td><td>时序数据，结构化</td></tr><tr><td><strong>日志（Logs）</strong></td><td>事件记录、故障详情</td><td>ELK / Loki</td><td>非结构化/半结构化</td></tr><tr><td><strong>链路（Traces）</strong></td><td>请求路径、跨服务调用</td><td>Jaeger / Tempo</td><td>有向无环图</td></tr></tbody></table><div class="hint-container important"><p class="hint-container-title">监控黄金信号（Google SRE）</p><ol><li><strong>延迟（Latency）</strong>：请求响应时间，区分成功与失败的延迟</li><li><strong>流量（Traffic）</strong>：请求量、并发数、带宽</li><li><strong>错误（Errors）</strong>：错误率、失败请求数</li><li><strong>饱和度（Saturation）</strong>：资源使用率，接近满载的程度</li></ol><p>这四个信号覆盖了系统健康的关键维度。任何监控方案都应围绕这四个信号构建。</p></div><h3 id="_1-2-监控层次模型" tabindex="-1"><a class="header-anchor" href="#_1-2-监控层次模型"><span>1.2 监控层次模型</span></a></h3>`,5),i(f,{code:`eJxLy8kvT85ILCpRcArhUgACx2ilp/N3PV/Y8GLdvmfT9j7d2GSTVKRv5xwQqv+0rfXp2hn6zxc3Pp8NpPZOfL57jlKsgq6unYITUNfOzU/7N8DUP5u64Vnvuqe7Jus/3zMZpOvZto5njetfzpj/tGO6UizYKiewVmeg1l1Tnk9ZAdMaGBCs/3T3thf75+u/nDLzxfr1z/vaoTqcwTpcopWe7Jj1tGshTMeLdYue9k592d6v/2zK+ie7ZzzrmPC0az5Qmz7Q2Gcd259t2f1iezPQDLAhxSWVOakKjgppmTk5VsppackpKUZIEk5wiVSDJGQJZ7hEmmWyCZKEC1Qi2SLVLNmSCwAmnpc0`}),s[4]||=n(`<p>每一层依赖下层正常运行。排查问题时从业务层逐层下钻，直到定位根因。</p><h3 id="_1-3-监控设计原则" tabindex="-1"><a class="header-anchor" href="#_1-3-监控设计原则"><span>1.3 监控设计原则</span></a></h3><ol><li><strong>端到端视角</strong>：从用户角度监控，而非仅从服务器角度</li><li><strong>基线驱动</strong>：建立正常状态的基线，异常由基线对比发现</li><li><strong>可操作性</strong>：每条告警都应该有明确的处理动作</li><li><strong>分级告警</strong>：P1/P2/P3/P4，不同级别不同响应方式</li><li><strong>收敛降噪</strong>：合并相关告警，避免告警风暴</li></ol><h2 id="二、node-exporter-部署" tabindex="-1"><a class="header-anchor" href="#二、node-exporter-部署"><span>二、Node Exporter 部署</span></a></h2><p>Node Exporter 是 Prometheus 生态中最基础的采集器，暴露 Linux 系统指标。</p><h3 id="_2-1-安装-node-exporter" tabindex="-1"><a class="header-anchor" href="#_2-1-安装-node-exporter"><span>2.1 安装 Node Exporter</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 下载</span></span>
<span class="line"><span style="color:#E06C75;">NODE_EXPORTER_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1.8.0</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -LO</span><span style="color:#98C379;"> https://github.com/prometheus/node_exporter/releases/download/v</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">NODE_EXPORTER_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">/node_exporter-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">NODE_EXPORTER_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">.linux-amd64.tar.gz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 解压</span></span>
<span class="line"><span style="color:#61AFEF;">tar</span><span style="color:#98C379;"> xzf</span><span style="color:#98C379;"> node_exporter-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">NODE_EXPORTER_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">.linux-amd64.tar.gz</span></span>
<span class="line"><span style="color:#61AFEF;">mv</span><span style="color:#98C379;"> node_exporter-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">NODE_EXPORTER_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">.linux-amd64/node_exporter</span><span style="color:#98C379;"> /usr/local/bin/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证</span></span>
<span class="line"><span style="color:#61AFEF;">node_exporter</span><span style="color:#D19A66;"> --version</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-创建-systemd-服务" tabindex="-1"><a class="header-anchor" href="#_2-2-创建-systemd-服务"><span>2.2 创建 Systemd 服务</span></a></h3><div class="language-ini line-numbers-mode" data-highlighter="shiki" data-ext="ini" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-ini"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/systemd/system/node_exporter.service</span></span>
<span class="line"><span style="color:#61AFEF;">[Unit]</span></span>
<span class="line"><span style="color:#C678DD;">Description</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">Node Exporter</span></span>
<span class="line"><span style="color:#C678DD;">After</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">network.target</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[Service]</span></span>
<span class="line"><span style="color:#C678DD;">Type</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">simple</span></span>
<span class="line"><span style="color:#C678DD;">User</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">node_exporter</span></span>
<span class="line"><span style="color:#C678DD;">Group</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">node_exporter</span></span>
<span class="line"><span style="color:#C678DD;">ExecStart</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/usr/local/bin/node_exporter \\</span></span>
<span class="line"><span style="color:#98C379;">    --</span><span style="color:#C678DD;">web.listen-address</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">:9100 \\</span></span>
<span class="line"><span style="color:#98C379;">    --</span><span style="color:#C678DD;">collector.filesystem.mount-points-exclude</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">^/(sys|proc|dev|host|etc)($$|/) \\</span></span>
<span class="line"><span style="color:#98C379;">    --</span><span style="color:#C678DD;">collector.filesystem.fs-types-exclude</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">^(autofs|binfmt_misc|cgroup|configfs|debugfs|devpts|devtmpfs|fusectl|hugetlbfs|mqueue|proc|procfs|pstore|rpc_pipefs|securityfs|sysfs|tracefs)$$</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">Restart</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">on-failure</span></span>
<span class="line"><span style="color:#C678DD;">RestartSec</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">5</span></span>
<span class="line"><span style="color:#C678DD;">LimitNOFILE</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">65536</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[Install]</span></span>
<span class="line"><span style="color:#C678DD;">WantedBy</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">multi-user.target</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 创建用户</span></span>
<span class="line"><span style="color:#61AFEF;">useradd</span><span style="color:#D19A66;"> --no-create-home</span><span style="color:#D19A66;"> --shell</span><span style="color:#98C379;"> /bin/</span><span style="color:#D19A66;">false</span><span style="color:#98C379;"> node_exporter</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> daemon-reload</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> node_exporter</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> http://localhost:9100/metrics</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-关键指标解读" tabindex="-1"><a class="header-anchor" href="#_2-3-关键指标解读"><span>2.3 关键指标解读</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># CPU 使用率（所有核心平均）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 100 - (rate(node_cpu_seconds_total{mode=&quot;idle&quot;}[5m]) * 100)</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> http://localhost:9100/metrics</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> ^node_cpu_seconds_total</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 内存使用率</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> http://localhost:9100/metrics</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> ^node_memory_Mem</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 磁盘使用率</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># (1 - node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> http://localhost:9100/metrics</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> ^node_filesystem</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 磁盘 I/O</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># rate(node_disk_read_bytes_total[5m])</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> http://localhost:9100/metrics</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> ^node_disk_</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 网络流量</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># rate(node_network_receive_bytes_total[5m])</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> http://localhost:9100/metrics</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> ^node_network_</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">Node Exporter 采集器控制</p><p>Node Exporter 默认启用大部分采集器。对于不需要的采集器，用 <code>--no-collector.&lt;name&gt;</code> 禁用，减少不必要的指标和开销。例如：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">--no-collector.wifi</span><span style="color:#7F848E;font-style:italic;">     # 服务器通常没有 WiFi</span></span>
<span class="line"><span style="color:#61AFEF;">--no-collector.arp</span><span style="color:#7F848E;font-style:italic;">      # ARP 表通常不需要监控</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></div><h2 id="三、prometheus-配置" tabindex="-1"><a class="header-anchor" href="#三、prometheus-配置"><span>三、Prometheus 配置</span></a></h2><h3 id="_3-1-安装-prometheus" tabindex="-1"><a class="header-anchor" href="#_3-1-安装-prometheus"><span>3.1 安装 Prometheus</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 下载</span></span>
<span class="line"><span style="color:#E06C75;">PROM_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">2.53.0</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -LO</span><span style="color:#98C379;"> https://github.com/prometheus/prometheus/releases/download/v</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">PROM_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">/prometheus-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">PROM_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">.linux-amd64.tar.gz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 解压</span></span>
<span class="line"><span style="color:#61AFEF;">tar</span><span style="color:#98C379;"> xzf</span><span style="color:#98C379;"> prometheus-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">PROM_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">.linux-amd64.tar.gz</span></span>
<span class="line"><span style="color:#61AFEF;">mv</span><span style="color:#98C379;"> prometheus-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">PROM_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">.linux-amd64/prometheus</span><span style="color:#98C379;"> /usr/local/bin/</span></span>
<span class="line"><span style="color:#61AFEF;">mv</span><span style="color:#98C379;"> prometheus-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">PROM_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">.linux-amd64/promtool</span><span style="color:#98C379;"> /usr/local/bin/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建配置目录</span></span>
<span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /etc/prometheus</span><span style="color:#98C379;"> /var/lib/prometheus</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建用户</span></span>
<span class="line"><span style="color:#61AFEF;">useradd</span><span style="color:#D19A66;"> --no-create-home</span><span style="color:#D19A66;"> --shell</span><span style="color:#98C379;"> /bin/</span><span style="color:#D19A66;">false</span><span style="color:#98C379;"> prometheus</span></span>
<span class="line"><span style="color:#61AFEF;">chown</span><span style="color:#D19A66;"> -R</span><span style="color:#98C379;"> prometheus:prometheus</span><span style="color:#98C379;"> /etc/prometheus</span><span style="color:#98C379;"> /var/lib/prometheus</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-prometheus-主配置" tabindex="-1"><a class="header-anchor" href="#_3-2-prometheus-主配置"><span>3.2 Prometheus 主配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/prometheus/prometheus.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">global</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  scrape_interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">15s</span><span style="color:#7F848E;font-style:italic;">          # 默认采集间隔</span></span>
<span class="line"><span style="color:#E06C75;">  evaluation_interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">15s</span><span style="color:#7F848E;font-style:italic;">      # 规则评估间隔</span></span>
<span class="line"><span style="color:#E06C75;">  scrape_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span><span style="color:#7F848E;font-style:italic;">           # 采集超时</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 外部标签（用于联邦查询和远程写入）</span></span>
<span class="line"><span style="color:#E06C75;">  external_labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    cluster</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;production&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    env</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;prod&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 告警规则文件</span></span>
<span class="line"><span style="color:#E06C75;">rule_files</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">/etc/prometheus/rules/*.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Alertmanager 配置</span></span>
<span class="line"><span style="color:#E06C75;">alerting</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  alertmanagers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">static_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">targets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#98C379;">alertmanager:9093</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 采集目标</span></span>
<span class="line"><span style="color:#E06C75;">scrape_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Prometheus 自身</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">job_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;prometheus&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    static_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">targets</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&#39;localhost:9090&#39;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Node Exporter（静态配置）</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">job_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;node&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    scrape_interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">15s</span></span>
<span class="line"><span style="color:#E06C75;">    static_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">targets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">&#39;192.168.1.100:9100&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">&#39;192.168.1.101:9100&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">&#39;192.168.1.102:9100&#39;</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          env</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;production&#39;</span></span>
<span class="line"><span style="color:#E06C75;">          team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;infra&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Node Exporter（服务发现 - Consul）</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">job_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;node_consul&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    consul_sd_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">server</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;consul.internal.example.com:8500&#39;</span></span>
<span class="line"><span style="color:#E06C75;">        services</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&#39;node-exporter&#39;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">    relabel_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">source_labels</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">__meta_consul_dc</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">        target_label</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">dc</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">source_labels</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">__meta_consul_service</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">        target_label</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Nginx Exporter</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">job_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;nginx&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    static_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">targets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">&#39;192.168.1.100:9113&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">&#39;192.168.1.101:9113&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # MySQL Exporter</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">job_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;mysql&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    static_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">targets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">&#39;192.168.1.200:9104&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Blackbox Exporter（探针）</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">job_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;blackbox_http&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    metrics_path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/probe</span></span>
<span class="line"><span style="color:#E06C75;">    params</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      module</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">http_2xx</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">    static_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">targets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">https://example.com</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#98C379;">https://api.example.com/health</span></span>
<span class="line"><span style="color:#E06C75;">    relabel_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">source_labels</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">__address__</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">        target_label</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">__param_target</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">source_labels</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">__param_target</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">        target_label</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">instance</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">target_label</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">__address__</span></span>
<span class="line"><span style="color:#E06C75;">        replacement</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">blackbox-exporter:9115</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-prometheus-systemd-服务" tabindex="-1"><a class="header-anchor" href="#_3-3-prometheus-systemd-服务"><span>3.3 Prometheus Systemd 服务</span></a></h3><div class="language-ini line-numbers-mode" data-highlighter="shiki" data-ext="ini" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-ini"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/systemd/system/prometheus.service</span></span>
<span class="line"><span style="color:#61AFEF;">[Unit]</span></span>
<span class="line"><span style="color:#C678DD;">Description</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">Prometheus</span></span>
<span class="line"><span style="color:#C678DD;">After</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">network.target</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[Service]</span></span>
<span class="line"><span style="color:#C678DD;">Type</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">simple</span></span>
<span class="line"><span style="color:#C678DD;">User</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">prometheus</span></span>
<span class="line"><span style="color:#C678DD;">ExecStart</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/usr/local/bin/prometheus \\</span></span>
<span class="line"><span style="color:#98C379;">    --</span><span style="color:#C678DD;">config.file</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/etc/prometheus/prometheus.yml \\</span></span>
<span class="line"><span style="color:#98C379;">    --</span><span style="color:#C678DD;">storage.tsdb.path</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/var/lib/prometheus \\</span></span>
<span class="line"><span style="color:#98C379;">    --</span><span style="color:#C678DD;">storage.tsdb.retention.time</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">30d \\</span></span>
<span class="line"><span style="color:#98C379;">    --</span><span style="color:#C678DD;">storage.tsdb.retention.size</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">40GB \\</span></span>
<span class="line"><span style="color:#98C379;">    --</span><span style="color:#C678DD;">web.console.templates</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/etc/prometheus/consoles \\</span></span>
<span class="line"><span style="color:#98C379;">    --</span><span style="color:#C678DD;">web.console.libraries</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">/etc/prometheus/console_libraries \\</span></span>
<span class="line"><span style="color:#98C379;">    --</span><span style="color:#C678DD;">web.listen-address</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">:9090 \\</span></span>
<span class="line"><span style="color:#98C379;">    --web.enable-lifecycle</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">Restart</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">on-failure</span></span>
<span class="line"><span style="color:#C678DD;">LimitNOFILE</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">65536</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[Install]</span></span>
<span class="line"><span style="color:#C678DD;">WantedBy</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">multi-user.target</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> daemon-reload</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> prometheus</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> http://localhost:9090/api/v1/targets</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">jq</span><span style="color:#98C379;"> &#39;.data.activeTargets[].health&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-数据保留与存储规划" tabindex="-1"><a class="header-anchor" href="#_3-4-数据保留与存储规划"><span>3.4 数据保留与存储规划</span></a></h3><table><thead><tr><th>规模</th><th>指标数</th><th>采集间隔</th><th>日增量</th><th>30 天总量</th><th>推荐磁盘</th></tr></thead><tbody><tr><td>小型</td><td>5 万</td><td>15s</td><td>~2 GB</td><td>~60 GB</td><td>100 GB SSD</td></tr><tr><td>中型</td><td>50 万</td><td>15s</td><td>~20 GB</td><td>~600 GB</td><td>1 TB SSD</td></tr><tr><td>大型</td><td>500 万</td><td>15s</td><td>~200 GB</td><td>~6 TB</td><td>10 TB SSD/NVMe</td></tr></tbody></table><div class="hint-container warning"><p class="hint-container-title">Prometheus 存储不是数据库</p><p>Prometheus 的本地存储不是长期存储方案。对于需要长期保留的场景，使用远程写入（Remote Write）到 Thanos、Cortex 或 VictoriaMetrics 等长期存储方案。</p></div><h2 id="四、告警规则配置" tabindex="-1"><a class="header-anchor" href="#四、告警规则配置"><span>四、告警规则配置</span></a></h2><h3 id="_4-1-告警规则文件" tabindex="-1"><a class="header-anchor" href="#_4-1-告警规则文件"><span>4.1 告警规则文件</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/prometheus/rules/node_alerts.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">groups</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">node_alerts</span></span>
<span class="line"><span style="color:#E06C75;">    rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # ===== CPU 告警 =====</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NodeCPUHigh</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          100 - (avg by (instance) (rate(node_cpu_seconds_total{mode=&quot;idle&quot;}[5m])) * 100) &gt; 85</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">          team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infra</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;节点 CPU 使用率过高&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ $labels.instance }} CPU 使用率 {{ $value | printf \\&quot;%.1f\\&quot; }}%，持续 5 分钟&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NodeCPUCritical</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          100 - (avg by (instance) (rate(node_cpu_seconds_total{mode=&quot;idle&quot;}[5m])) * 100) &gt; 95</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">2m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">critical</span></span>
<span class="line"><span style="color:#E06C75;">          team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infra</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;节点 CPU 使用率严重过高&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ $labels.instance }} CPU 使用率 {{ $value | printf \\&quot;%.1f\\&quot; }}%，持续 2 分钟&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # ===== 内存告警 =====</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NodeMemoryHigh</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 &gt; 85</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">          team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infra</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;节点内存使用率过高&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ $labels.instance }} 内存使用率 {{ $value | printf \\&quot;%.1f\\&quot; }}%，可用内存不足&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NodeMemoryCritical</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 &gt; 95</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">2m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">critical</span></span>
<span class="line"><span style="color:#E06C75;">          team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infra</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;节点内存使用率严重过高&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ $labels.instance }} 内存使用率 {{ $value | printf \\&quot;%.1f\\&quot; }}%，即将 OOM&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # ===== 磁盘告警 =====</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NodeDiskSpaceWarning</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          (1 - node_filesystem_avail_bytes{fstype!~&quot;tmpfs|fuse.*&quot;}</span></span>
<span class="line"><span style="color:#98C379;">            / node_filesystem_size_bytes{fstype!~&quot;tmpfs|fuse.*&quot;}) * 100 &gt; 80</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">          team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infra</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;磁盘空间不足&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ $labels.instance }} {{ $labels.mountpoint }} 使用率 {{ $value | printf \\&quot;%.1f\\&quot; }}%&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NodeDiskSpaceCritical</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          (1 - node_filesystem_avail_bytes{fstype!~&quot;tmpfs|fuse.*&quot;}</span></span>
<span class="line"><span style="color:#98C379;">            / node_filesystem_size_bytes{fstype!~&quot;tmpfs|fuse.*&quot;}) * 100 &gt; 90</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">critical</span></span>
<span class="line"><span style="color:#E06C75;">          team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infra</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;磁盘空间严重不足&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ $labels.instance }} {{ $labels.mountpoint }} 使用率 {{ $value | printf \\&quot;%.1f\\&quot; }}%，请立即清理&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # ===== 磁盘 I/O 告警 =====</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NodeDiskIOHigh</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          rate(node_disk_io_time_seconds_total[5m]) &gt; 0.5</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">          team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infra</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;磁盘 I/O 延迟过高&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ $labels.instance }} {{ $labels.device }} I/O 延迟 {{ $value | printf \\&quot;%.2f\\&quot; }}秒&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # ===== 网络告警 =====</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NodeNetworkReceiveHigh</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          rate(node_network_receive_bytes_total{device=~&quot;eth.*|en.*&quot;}[5m]) &gt; 100 * 1024 * 1024</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">          team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infra</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;网络入流量异常&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ $labels.instance }} {{ $labels.device }} 入流量 {{ $value | printf \\&quot;%.0f\\&quot; }} bytes/s&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NodeNetworkTransmitErrors</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          rate(node_network_transmit_errs_total[5m]) &gt; 0</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">          team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infra</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;网络发送错误&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ $labels.instance }} {{ $labels.device }} 发送错误率 {{ $value }}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # ===== 系统状态告警 =====</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NodeUp</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">up{job=&quot;node&quot;} == 0</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">1m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">critical</span></span>
<span class="line"><span style="color:#E06C75;">          team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infra</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;节点离线&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ $labels.instance }} 已离线超过 1 分钟&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NodeLoadHigh</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          node_load15 / count(node_cpu_seconds_total{mode=&quot;idle&quot;}) without (cpu, mode) &gt; 2</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">          team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infra</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;系统负载过高&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ $labels.instance }} 15分钟负载超过 CPU 核心数 2 倍&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NodeFileDescriptorHigh</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          (node_filefd_allocated / node_filefd_maximum) * 100 &gt; 80</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">          team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infra</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;文件描述符使用率过高&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ $labels.instance }} 文件描述符使用率 {{ $value | printf \\&quot;%.1f\\&quot; }}%&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # ===== 时间同步告警 =====</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NodeClockSkew</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          abs(node_timex_offset_seconds) &gt; 0.05</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">          team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infra</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;时钟偏移&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ $labels.instance }} 时钟偏移 {{ $value }}秒&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-告警规则设计原则" tabindex="-1"><a class="header-anchor" href="#_4-2-告警规则设计原则"><span>4.2 告警规则设计原则</span></a></h3>`,28),i(f,{code:`eJxLy8kvT85ILCpRCHHhUgACx+in62Y92dn5rKf92YL2WAVdXTsFp+gX6/YBhV/O6HjasCcWrM4JLOMMlXnW0/h899pn07e9nL5FIS2/CKLGGazGBaZmQfvztfue7Oh7tnnFi+WLIUpcwEpcq59O7HqxdtnT/vXPJvc+2TvHvhYs6wqSrXk6YVmNglv0y/beZ9M2AM16sW7hs45pTzsWvJy5BGIKRN2zGetrFNyjn+zoer5r/4vlTU/Xz4dIu4Mt8ah+sX79s66lz/vaocZ7gLXZGRqo1ih4Rr/Y0Pxs6haIH/WBflCAeAdiBESpDVipV/TzXZufti59tnbx0z39EJfHcoGVFZdU5qQCnZOWmZNjpZyWlmaZbIIk4YEqAQBVoamJ`}),s[5]||=n(`<div class="hint-container important"><p class="hint-container-title">告警设计三原则</p><ol><li><strong>每条告警必须可操作</strong>——如果收到告警不知道该做什么，这条告警就是噪音</li><li><strong><code>for</code> 时间必须合理</strong>——太短产生误报，太长延迟响应。短期波动用 <code>for: 5m</code>，持续问题用 <code>for: 10m</code></li><li><strong>分级清晰</strong>——<code>warning</code> 是需要关注的趋势，<code>critical</code> 是需要立即行动的紧急问题</li></ol></div><h2 id="五、grafana-仪表盘" tabindex="-1"><a class="header-anchor" href="#五、grafana-仪表盘"><span>五、Grafana 仪表盘</span></a></h2><h3 id="_5-1-安装-grafana" tabindex="-1"><a class="header-anchor" href="#_5-1-安装-grafana"><span>5.1 安装 Grafana</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Ubuntu/Debian</span></span>
<span class="line"><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> apt-transport-https</span><span style="color:#98C379;"> software-properties-common</span></span>
<span class="line"><span style="color:#61AFEF;">wget</span><span style="color:#D19A66;"> -q</span><span style="color:#D19A66;"> -O</span><span style="color:#98C379;"> /usr/share/keyrings/grafana.key</span><span style="color:#98C379;"> https://apt.grafana.com/gpg.key</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;deb [signed-by=/usr/share/keyrings/grafana.key] https://apt.grafana.com stable main&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    tee</span><span style="color:#98C379;"> /etc/apt/sources.list.d/grafana.list</span></span>
<span class="line"><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> update</span></span>
<span class="line"><span style="color:#61AFEF;">apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> grafana</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CentOS/Rocky</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/yum.repos.d/grafana.repo</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">[grafana]</span></span>
<span class="line"><span style="color:#98C379;">name=grafana</span></span>
<span class="line"><span style="color:#98C379;">baseurl=https://rpm.grafana.com</span></span>
<span class="line"><span style="color:#98C379;">repo_gpgcheck=1</span></span>
<span class="line"><span style="color:#98C379;">enabled=1</span></span>
<span class="line"><span style="color:#98C379;">gpgcheck=1</span></span>
<span class="line"><span style="color:#98C379;">gpgkey=https://rpm.grafana.com/gpg.key</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#61AFEF;">dnf</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> grafana</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动</span></span>
<span class="line"><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#D19A66;"> --now</span><span style="color:#98C379;"> grafana-server</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认端口 3000，默认账号 admin/admin</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-添加-prometheus-数据源" tabindex="-1"><a class="header-anchor" href="#_5-2-添加-prometheus-数据源"><span>5.2 添加 Prometheus 数据源</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 通过 API 添加（首次配置后建议改用界面）</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -X</span><span style="color:#98C379;"> POST</span><span style="color:#98C379;"> http://admin:admin@localhost:3000/api/datasources</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -H</span><span style="color:#98C379;"> &quot;Content-Type: application/json&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -d</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">        &quot;name&quot;: &quot;Prometheus&quot;,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;type&quot;: &quot;prometheus&quot;,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;url&quot;: &quot;http://localhost:9090&quot;,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;access&quot;: &quot;proxy&quot;,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;isDefault&quot;: true</span></span>
<span class="line"><span style="color:#98C379;">    }&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-系统-overview-仪表盘关键面板" tabindex="-1"><a class="header-anchor" href="#_5-3-系统-overview-仪表盘关键面板"><span>5.3 系统 Overview 仪表盘关键面板</span></a></h3><p>以下为仪表盘的核心 PromQL 查询语句，可导入 Grafana 使用：</p><p><strong>CPU 面板</strong></p><div class="language-promql line-numbers-mode" data-highlighter="shiki" data-ext="promql" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-promql"><span class="line"><span># CPU 总使用率</span></span>
<span class="line"><span>100 - (avg by (instance) (rate(node_cpu_seconds_total{mode=&quot;idle&quot;}[5m])) * 100)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 各模式 CPU 使用率（堆叠面积图）</span></span>
<span class="line"><span>avg by (instance, mode) (rate(node_cpu_seconds_total[5m])) * 100</span></span>
<span class="line"><span></span></span>
<span class="line"><span># CPU 核心数</span></span>
<span class="line"><span>count(node_cpu_seconds_total{mode=&quot;idle&quot;}) by (instance)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>内存面板</strong></p><div class="language-promql line-numbers-mode" data-highlighter="shiki" data-ext="promql" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-promql"><span class="line"><span># 内存使用率</span></span>
<span class="line"><span>(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 内存各区域（堆叠图）</span></span>
<span class="line"><span>node_memory_MemTotal_bytes</span></span>
<span class="line"><span>node_memory_MemFree_bytes</span></span>
<span class="line"><span>node_memory_Buffers_bytes</span></span>
<span class="line"><span>node_memory_Cached_bytes</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Swap 使用率</span></span>
<span class="line"><span>(1 - node_memory_SwapFree_bytes / node_memory_SwapTotal_bytes) * 100</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>磁盘面板</strong></p><div class="language-promql line-numbers-mode" data-highlighter="shiki" data-ext="promql" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-promql"><span class="line"><span># 磁盘使用率</span></span>
<span class="line"><span>(1 - node_filesystem_avail_bytes{fstype!~&quot;tmpfs|fuse.*&quot;}</span></span>
<span class="line"><span>  / node_filesystem_size_bytes{fstype!~&quot;tmpfs|fuse.*&quot;}) * 100</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 磁盘读写速率</span></span>
<span class="line"><span>rate(node_disk_read_bytes_total[5m])</span></span>
<span class="line"><span>rate(node_disk_written_bytes_total[5m])</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 磁盘 I/O 延迟</span></span>
<span class="line"><span>rate(node_disk_io_time_seconds_total[5m])</span></span>
<span class="line"><span></span></span>
<span class="line"><span># inode 使用率</span></span>
<span class="line"><span>(1 - node_filesystem_files_free{fstype!~&quot;tmpfs|fuse.*&quot;}</span></span>
<span class="line"><span>  / node_filesystem_files{fstype!~&quot;tmpfs|fuse.*&quot;}) * 100</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>网络面板</strong></p><div class="language-promql line-numbers-mode" data-highlighter="shiki" data-ext="promql" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-promql"><span class="line"><span># 网络收发流量</span></span>
<span class="line"><span>rate(node_network_receive_bytes_total{device=~&quot;eth.*|en.*&quot;}[5m])</span></span>
<span class="line"><span>rate(node_network_transmit_bytes_total{device=~&quot;eth.*|en.*&quot;}[5m])</span></span>
<span class="line"><span></span></span>
<span class="line"><span># TCP 连接数</span></span>
<span class="line"><span>node_netstat_Tcp_CurrEstab</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 连接状态分布</span></span>
<span class="line"><span>node_netstat_Tcp_TimeWait</span></span>
<span class="line"><span>node_netstat_Tcp_CloseWait</span></span>
<span class="line"><span>node_netstat_Tcp_Established</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>系统面板</strong></p><div class="language-promql line-numbers-mode" data-highlighter="shiki" data-ext="promql" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-promql"><span class="line"><span># 系统负载</span></span>
<span class="line"><span>node_load1</span></span>
<span class="line"><span>node_load5</span></span>
<span class="line"><span>node_load15</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 进程数</span></span>
<span class="line"><span>node_procs_running</span></span>
<span class="line"><span>node_procs_blocked</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 文件描述符使用率</span></span>
<span class="line"><span>(node_filefd_allocated / node_filefd_maximum) * 100</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 系统启动时间</span></span>
<span class="line"><span>time() - node_boot_time_seconds</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-推荐的社区仪表盘" tabindex="-1"><a class="header-anchor" href="#_5-4-推荐的社区仪表盘"><span>5.4 推荐的社区仪表盘</span></a></h3><table><thead><tr><th>ID</th><th>名称</th><th>说明</th></tr></thead><tbody><tr><td>1860</td><td>Node Exporter Full</td><td>最全面的 Node Exporter 仪表盘</td></tr><tr><td>8919</td><td>Node Exporter for Prometheus</td><td>简洁版系统监控</td></tr><tr><td>12470</td><td>1 Node Exporter for Prometheus</td><td>中文版</td></tr><tr><td>15172</td><td>Node Exporter Quickstart</td><td>快速上手</td></tr></tbody></table><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 通过 API 导入仪表盘</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -X</span><span style="color:#98C379;"> POST</span><span style="color:#98C379;"> http://admin:admin@localhost:3000/api/dashboards/import</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -H</span><span style="color:#98C379;"> &quot;Content-Type: application/json&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -d</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">        &quot;pluginId&quot;: &quot;prometheus&quot;,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;version&quot;: &quot;1&quot;,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;dashboard&quot;: {</span></span>
<span class="line"><span style="color:#98C379;">            &quot;id&quot;: null,</span></span>
<span class="line"><span style="color:#98C379;">            &quot;uid&quot;: null,</span></span>
<span class="line"><span style="color:#98C379;">            &quot;title&quot;: &quot;Node Exporter Full&quot;,</span></span>
<span class="line"><span style="color:#98C379;">            &quot;gnetId&quot;: 1860,</span></span>
<span class="line"><span style="color:#98C379;">            &quot;revision&quot;: 30</span></span>
<span class="line"><span style="color:#98C379;">        },</span></span>
<span class="line"><span style="color:#98C379;">        &quot;inputs&quot;: [</span></span>
<span class="line"><span style="color:#98C379;">            {</span></span>
<span class="line"><span style="color:#98C379;">                &quot;name&quot;: &quot;DS_PROMETHEUS&quot;,</span></span>
<span class="line"><span style="color:#98C379;">                &quot;type&quot;: &quot;datasource&quot;,</span></span>
<span class="line"><span style="color:#98C379;">                &quot;pluginId&quot;: &quot;prometheus&quot;,</span></span>
<span class="line"><span style="color:#98C379;">                &quot;value&quot;: &quot;Prometheus&quot;</span></span>
<span class="line"><span style="color:#98C379;">            }</span></span>
<span class="line"><span style="color:#98C379;">        ],</span></span>
<span class="line"><span style="color:#98C379;">        &quot;overwrite&quot;: true</span></span>
<span class="line"><span style="color:#98C379;">    }&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、alertmanager-告警路由与静默" tabindex="-1"><a class="header-anchor" href="#六、alertmanager-告警路由与静默"><span>六、Alertmanager 告警路由与静默</span></a></h2><h3 id="_6-1-安装-alertmanager" tabindex="-1"><a class="header-anchor" href="#_6-1-安装-alertmanager"><span>6.1 安装 Alertmanager</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#E06C75;">AM_VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0.27.0</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -LO</span><span style="color:#98C379;"> https://github.com/prometheus/alertmanager/releases/download/v</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">AM_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">/alertmanager-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">AM_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">.linux-amd64.tar.gz</span></span>
<span class="line"><span style="color:#61AFEF;">tar</span><span style="color:#98C379;"> xzf</span><span style="color:#98C379;"> alertmanager-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">AM_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">.linux-amd64.tar.gz</span></span>
<span class="line"><span style="color:#61AFEF;">mv</span><span style="color:#98C379;"> alertmanager-</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">AM_VERSION</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">.linux-amd64/alertmanager</span><span style="color:#98C379;"> /usr/local/bin/</span></span>
<span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /etc/alertmanager</span><span style="color:#98C379;"> /var/lib/alertmanager</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-alertmanager-配置" tabindex="-1"><a class="header-anchor" href="#_6-2-alertmanager-配置"><span>6.2 Alertmanager 配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/alertmanager/alertmanager.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">global</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  resolve_timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # SMTP 配置（邮件通知）</span></span>
<span class="line"><span style="color:#E06C75;">  smtp_smarthost</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;smtp.example.com:587&#39;</span></span>
<span class="line"><span style="color:#E06C75;">  smtp_from</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;alertmanager@example.com&#39;</span></span>
<span class="line"><span style="color:#E06C75;">  smtp_auth_username</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;alertmanager@example.com&#39;</span></span>
<span class="line"><span style="color:#E06C75;">  smtp_auth_password</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;password&#39;</span></span>
<span class="line"><span style="color:#E06C75;">  smtp_require_tls</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 钉钉 Webhook</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 需要部署 webhook-adapter</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 告警模板</span></span>
<span class="line"><span style="color:#E06C75;">templates</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">/etc/alertmanager/templates/*.tmpl</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 路由树</span></span>
<span class="line"><span style="color:#E06C75;">route</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  receiver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;default&#39;</span></span>
<span class="line"><span style="color:#E06C75;">  group_by</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&#39;alertname&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;cluster&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;namespace&#39;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">  group_wait</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span><span style="color:#7F848E;font-style:italic;">          # 等待 30s 收集同组告警</span></span>
<span class="line"><span style="color:#E06C75;">  group_interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span><span style="color:#7F848E;font-style:italic;">       # 同组新告警间隔</span></span>
<span class="line"><span style="color:#E06C75;">  repeat_interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">4h</span><span style="color:#7F848E;font-style:italic;">      # 重复通知间隔</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  routes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Critical 级别 → 电话 + 钉钉</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">match</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">critical</span></span>
<span class="line"><span style="color:#E06C75;">      receiver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;critical-team&#39;</span></span>
<span class="line"><span style="color:#E06C75;">      group_wait</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"><span style="color:#E06C75;">      group_interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">1m</span></span>
<span class="line"><span style="color:#E06C75;">      repeat_interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30m</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 数据库相关 → DBA 团队</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">match_re</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        alertname</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">MySQL.*</span></span>
<span class="line"><span style="color:#E06C75;">      receiver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;dba-team&#39;</span></span>
<span class="line"><span style="color:#E06C75;">      group_by</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&#39;alertname&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;instance&#39;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 业务告警 → 业务团队</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">match</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">business</span></span>
<span class="line"><span style="color:#E06C75;">      receiver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;business-team&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Infra 告警 → 运维团队</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">match</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        team</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">infra</span></span>
<span class="line"><span style="color:#E06C75;">      receiver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;infra-team&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 静默规则</span></span>
<span class="line"><span style="color:#E06C75;">inhibit_rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 节点离线时，抑制该节点上的所有告警</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">source_match</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">critical</span></span>
<span class="line"><span style="color:#E06C75;">      alertname</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NodeUp</span></span>
<span class="line"><span style="color:#E06C75;">    target_match</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">    equal</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&#39;instance&#39;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Critical 告警抑制 Warning 告警</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">source_match</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">critical</span></span>
<span class="line"><span style="color:#E06C75;">    target_match</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">    equal</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&#39;alertname&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;instance&#39;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 接收者配置</span></span>
<span class="line"><span style="color:#E06C75;">receivers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;default&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    webhook_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;http://webhook-adapter:8060/dingtalk/webhook1/send&#39;</span></span>
<span class="line"><span style="color:#E06C75;">        send_resolved</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;critical-team&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    webhook_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;http://webhook-adapter:8060/dingtalk/webhook1/send&#39;</span></span>
<span class="line"><span style="color:#E06C75;">        send_resolved</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    email_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;oncall@example.com&#39;</span></span>
<span class="line"><span style="color:#E06C75;">        send_resolved</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 电话通知（需集成语音告警平台）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # webhook_configs:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    #   - url: &#39;http://voice-alert:8080/call&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;dba-team&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    email_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;dba@example.com&#39;</span></span>
<span class="line"><span style="color:#E06C75;">        send_resolved</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;infra-team&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    webhook_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;http://webhook-adapter:8060/dingtalk/webhook2/send&#39;</span></span>
<span class="line"><span style="color:#E06C75;">        send_resolved</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    email_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;infra@example.com&#39;</span></span>
<span class="line"><span style="color:#E06C75;">        send_resolved</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;business-team&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    webhook_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;http://webhook-adapter:8060/dingtalk/webhook3/send&#39;</span></span>
<span class="line"><span style="color:#E06C75;">        send_resolved</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-告警路由决策流程" tabindex="-1"><a class="header-anchor" href="#_6-3-告警路由决策流程"><span>6.3 告警路由决策流程</span></a></h3>`,27),i(f,{code:`eJxLy8kvT85ILCpRCHHhUgACx+inE7terF32Yvmyp/0TYxV0de0UnKqLU8tSizJLKu1rwYqcQMI1yUCRzOTEnBoF52glGEe3JDUx1yapSN/u+ZStL9bP1X45qROItF82rXuye5tSLJL+8sSivMy89BoFl2qQJhSzM/PS8msUXKOf7G59sW7D071TY7nAsi4w2aLEGgW3aCUwC2EnNssgWlKSgBrco5WANJJyTHVJpcWZeanFxTUKHtFKMA66BUAdYC3O4ODxrH7WNfFpx7ZnixuezV8K8YUbRAbMdkdie0DZYI4n2MYXXU3Pm3Y+X7b7+a79NQpe0RDDnk7ogUg8bd32ZPc0SKRAHArR9mz6AojKGgXvaGBUvWxofNkw6/n8pciKnm7f9HLuzJe7Z9Qo+EQ/2dELUQd1fXFJZU4qMLzTMnNyrJTT0tIsk02QJDxxSXjBJVKTUlORJLyhEskWqWbJllwAEIrn9A==`}),s[6]||=n(`<h3 id="_6-4-静默-silence-管理" tabindex="-1"><a class="header-anchor" href="#_6-4-静默-silence-管理"><span>6.4 静默（Silence）管理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看当前静默</span></span>
<span class="line"><span style="color:#61AFEF;">amtool</span><span style="color:#98C379;"> silence</span><span style="color:#98C379;"> query</span><span style="color:#D19A66;"> --alertmanager.url</span><span style="color:#98C379;"> http://localhost:9093</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建静默（维护窗口期间）</span></span>
<span class="line"><span style="color:#61AFEF;">amtool</span><span style="color:#98C379;"> silence</span><span style="color:#98C379;"> add</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --alertmanager.url</span><span style="color:#98C379;"> http://localhost:9093</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --author</span><span style="color:#98C379;"> &quot;ops@example.com&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --comment</span><span style="color:#98C379;"> &quot;计划维护：数据库升级，预计2小时&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --duration</span><span style="color:#98C379;"> 2h</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    instance=</span><span style="color:#D19A66;">192.168.1.200</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 按告警名静默</span></span>
<span class="line"><span style="color:#61AFEF;">amtool</span><span style="color:#98C379;"> silence</span><span style="color:#98C379;"> add</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --alertmanager.url</span><span style="color:#98C379;"> http://localhost:9093</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --author</span><span style="color:#98C379;"> &quot;ops@example.com&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --comment</span><span style="color:#98C379;"> &quot;已知问题，正在处理&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --duration</span><span style="color:#98C379;"> 24h</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    alertname=NodeDiskSpaceWarning</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看静默详情</span></span>
<span class="line"><span style="color:#61AFEF;">amtool</span><span style="color:#98C379;"> silence</span><span style="color:#98C379;"> query</span><span style="color:#D19A66;"> --alertmanager.url</span><span style="color:#98C379;"> http://localhost:9093</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --output</span><span style="color:#98C379;"> extended</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除静默</span></span>
<span class="line"><span style="color:#61AFEF;">amtool</span><span style="color:#98C379;"> silence</span><span style="color:#98C379;"> expire</span><span style="color:#ABB2BF;"> &lt;</span><span style="color:#98C379;">silence-i</span><span style="color:#ABB2BF;">d&gt; </span><span style="color:#D19A66;">--alertmanager.url</span><span style="color:#98C379;"> http://localhost:9093</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">静默纪律</p><ol><li><strong>必须填写 comment</strong>——说明静默原因和预计恢复时间</li><li><strong>必须设置过期时间</strong>——避免永久静默导致真正告警被吞</li><li><strong>定期审查</strong>——每周检查是否有遗忘的静默</li><li><strong>关联工单</strong>——每条静默应有对应的工单号</li></ol></div><h2 id="七、日志采集体系" tabindex="-1"><a class="header-anchor" href="#七、日志采集体系"><span>七、日志采集体系</span></a></h2><h3 id="_7-1-filebeat-→-elk-架构" tabindex="-1"><a class="header-anchor" href="#_7-1-filebeat-→-elk-架构"><span>7.1 Filebeat → ELK 架构</span></a></h3>`,5),i(f,{code:`eJxLy8kvT85ILCpR8AniUgACx+inu6Y8n7Li2Zzep10Ln85cEaugq2tX45aZk5qUmlhSo+AUreSTn15cklicYZNUpG/3Yn/7s91L9F8sX/xs3gSlWLAhTiA9Cs7RSq45icUlmcnFqYlFyRDlT9fOeNq0Qv/5lkVP90yFKncGK3eJVvLOTErMS4So61//Ynnb055pQDVgRa7RfumZeRUKuB0GVuYW/Wzqhme9657umoxHJVhpcUllTirQ8rTMnBwr5VTDNNO0VCQJF6hEskWqWbIlFwBTtHTg`}),s[7]||=n(`<h3 id="_7-2-filebeat-配置" tabindex="-1"><a class="header-anchor" href="#_7-2-filebeat-配置"><span>7.2 Filebeat 配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/filebeat/filebeat.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">filebeat.inputs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Nginx 访问日志</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">log</span></span>
<span class="line"><span style="color:#E06C75;">    enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/var/log/nginx/access.log</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/var/log/nginx/access.json.log</span></span>
<span class="line"><span style="color:#E06C75;">    fields</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      log_type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx_access</span></span>
<span class="line"><span style="color:#E06C75;">      env</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">    fields_under_root</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Nginx 错误日志</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">log</span></span>
<span class="line"><span style="color:#E06C75;">    enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/var/log/nginx/error.log</span></span>
<span class="line"><span style="color:#E06C75;">    fields</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      log_type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx_error</span></span>
<span class="line"><span style="color:#E06C75;">      env</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">    fields_under_root</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 应用日志</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">log</span></span>
<span class="line"><span style="color:#E06C75;">    enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/var/log/myapp/*.log</span></span>
<span class="line"><span style="color:#E06C75;">    fields</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      log_type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">application</span></span>
<span class="line"><span style="color:#E06C75;">      env</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">    fields_under_root</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    multiline</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      pattern</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;^\\d{4}-\\d{2}-\\d{2}&#39;</span></span>
<span class="line"><span style="color:#E06C75;">      negate</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">      match</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">after</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 系统日志</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">log</span></span>
<span class="line"><span style="color:#E06C75;">    enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/var/log/syslog</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/var/log/auth.log</span></span>
<span class="line"><span style="color:#E06C75;">    fields</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      log_type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">system</span></span>
<span class="line"><span style="color:#E06C75;">      env</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">    fields_under_root</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出到 Logstash</span></span>
<span class="line"><span style="color:#E06C75;">output.logstash</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  hosts</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;logstash.internal.example.com:5044&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">  loadbalance</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">  worker</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 备用：直接输出到 Elasticsearch</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># output.elasticsearch:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   hosts: [&quot;es-node1:9200&quot;, &quot;es-node2:9200&quot;, &quot;es-node3:9200&quot;]</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   index: &quot;filebeat-%{[agent.version]}-%{+yyyy.MM.dd}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 日志级别</span></span>
<span class="line"><span style="color:#E06C75;">logging.level</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">info</span></span>
<span class="line"><span style="color:#E06C75;">logging.to_files</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">logging.files</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/var/log/filebeat</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">filebeat</span></span>
<span class="line"><span style="color:#E06C75;">  keepfiles</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">7</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-logstash-配置" tabindex="-1"><a class="header-anchor" href="#_7-3-logstash-配置"><span>7.3 Logstash 配置</span></a></h3><div class="language-ruby line-numbers-mode" data-highlighter="shiki" data-ext="ruby" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-ruby"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/logstash/conf.d/01-beats-to-es.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">input {</span></span>
<span class="line"><span style="color:#ABB2BF;">  beats {</span></span>
<span class="line"><span style="color:#ABB2BF;">    port =&gt; </span><span style="color:#D19A66;">5044</span></span>
<span class="line"><span style="color:#ABB2BF;">  }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">filter {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Nginx 访问日志解析</span></span>
<span class="line"><span style="color:#C678DD;">  if</span><span style="color:#ABB2BF;"> [log_type] </span><span style="color:#56B6C2;">==</span><span style="color:#98C379;"> &quot;nginx_access&quot;</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    grok {</span></span>
<span class="line"><span style="color:#ABB2BF;">      match =&gt; {</span></span>
<span class="line"><span style="color:#98C379;">        &quot;message&quot;</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#98C379;">&#39;%{IP:client_ip} - %{USERNAME:remote_user} \\[%{HTTPDATE:timestamp}\\] &quot;%{WORD:http_method} %{URIPATHPARAM:request_uri} HTTP/%{NUMBER:http_version}&quot; %{NUMBER:http_status} %{NUMBER:bytes_sent} &quot;%{GREEDYDATA:http_referer}&quot; &quot;%{GREEDYDATA:http_user_agent}&quot;&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">      }</span></span>
<span class="line"><span style="color:#ABB2BF;">      overwrite =&gt; [</span><span style="color:#98C379;">&quot;message&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 解析 JSON 格式日志</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [message] </span><span style="color:#56B6C2;">=~</span><span style="color:#56B6C2;"> /^</span><span style="color:#ABB2BF;">\\{</span><span style="color:#56B6C2;">/</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">      json {</span></span>
<span class="line"><span style="color:#ABB2BF;">        source =&gt; </span><span style="color:#98C379;">&quot;message&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        target =&gt; </span><span style="color:#98C379;">&quot;json&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # GeoIP 解析</span></span>
<span class="line"><span style="color:#ABB2BF;">    geoip {</span></span>
<span class="line"><span style="color:#ABB2BF;">      source =&gt; </span><span style="color:#98C379;">&quot;client_ip&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Nginx 错误日志解析</span></span>
<span class="line"><span style="color:#C678DD;">  if</span><span style="color:#ABB2BF;"> [log_type] </span><span style="color:#56B6C2;">==</span><span style="color:#98C379;"> &quot;nginx_error&quot;</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    grok {</span></span>
<span class="line"><span style="color:#ABB2BF;">      match =&gt; {</span></span>
<span class="line"><span style="color:#98C379;">        &quot;message&quot;</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#98C379;">&#39;%{DATA:timestamp} \\[%{LOGLEVEL:level}\\] %{NUMBER:pid}#%{NUMBER:tid}: \\*%{NUMBER:connection_id} %{GREEDYDATA:error_message}&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">      }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 应用日志</span></span>
<span class="line"><span style="color:#C678DD;">  if</span><span style="color:#ABB2BF;"> [log_type] </span><span style="color:#56B6C2;">==</span><span style="color:#98C379;"> &quot;application&quot;</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    json {</span></span>
<span class="line"><span style="color:#ABB2BF;">      source =&gt; </span><span style="color:#98C379;">&quot;message&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      target =&gt; </span><span style="color:#98C379;">&quot;app&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 提取日志级别</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [app][level] {</span></span>
<span class="line"><span style="color:#ABB2BF;">      mutate {</span></span>
<span class="line"><span style="color:#ABB2BF;">        uppercase =&gt; [</span><span style="color:#98C379;">&quot;[app][level]&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#ABB2BF;">      }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 通用处理</span></span>
<span class="line"><span style="color:#ABB2BF;">  mutate {</span></span>
<span class="line"><span style="color:#ABB2BF;">    remove_field =&gt; [</span><span style="color:#98C379;">&quot;@version&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;agent&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ecs&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;input&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;log&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#ABB2BF;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 添加时间戳</span></span>
<span class="line"><span style="color:#ABB2BF;">  date {</span></span>
<span class="line"><span style="color:#ABB2BF;">    match =&gt; [</span><span style="color:#98C379;">&quot;timestamp&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;dd/MMM/yyyy:HH:mm:ss Z&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#ABB2BF;">    target =&gt; </span><span style="color:#98C379;">&quot;@timestamp&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">  }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">output {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 按日志类型分索引</span></span>
<span class="line"><span style="color:#C678DD;">  if</span><span style="color:#ABB2BF;"> [log_type] </span><span style="color:#56B6C2;">==</span><span style="color:#98C379;"> &quot;nginx_access&quot;</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    elasticsearch {</span></span>
<span class="line"><span style="color:#ABB2BF;">      hosts =&gt; [</span><span style="color:#98C379;">&quot;http://es-node1:9200&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://es-node2:9200&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://es-node3:9200&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#ABB2BF;">      index =&gt; </span><span style="color:#98C379;">&quot;nginx-access-%{+YYYY.MM.dd}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">  } </span><span style="color:#FFFFFF;">else if</span><span style="color:#ABB2BF;"> [log_type] </span><span style="color:#56B6C2;">==</span><span style="color:#98C379;"> &quot;nginx_error&quot;</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    elasticsearch {</span></span>
<span class="line"><span style="color:#ABB2BF;">      hosts =&gt; [</span><span style="color:#98C379;">&quot;http://es-node1:9200&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://es-node2:9200&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://es-node3:9200&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#ABB2BF;">      index =&gt; </span><span style="color:#98C379;">&quot;nginx-error-%{+YYYY.MM.dd}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">  } </span><span style="color:#FFFFFF;">else if</span><span style="color:#ABB2BF;"> [log_type] </span><span style="color:#56B6C2;">==</span><span style="color:#98C379;"> &quot;application&quot;</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    elasticsearch {</span></span>
<span class="line"><span style="color:#ABB2BF;">      hosts =&gt; [</span><span style="color:#98C379;">&quot;http://es-node1:9200&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://es-node2:9200&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://es-node3:9200&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#ABB2BF;">      index =&gt; </span><span style="color:#98C379;">&quot;app-%{+YYYY.MM.dd}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">  } </span><span style="color:#C678DD;">else</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    elasticsearch {</span></span>
<span class="line"><span style="color:#ABB2BF;">      hosts =&gt; [</span><span style="color:#98C379;">&quot;http://es-node1:9200&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://es-node2:9200&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://es-node3:9200&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#ABB2BF;">      index =&gt; </span><span style="color:#98C379;">&quot;other-%{+YYYY.MM.dd}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">  }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-4-fluentd-替代方案" tabindex="-1"><a class="header-anchor" href="#_7-4-fluentd-替代方案"><span>7.4 Fluentd 替代方案</span></a></h3><p>对于资源敏感的场景，Fluentd/Fluent Bit 是更轻量的选择：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/fluent/fluent.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">&lt;source&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">  @</span><span style="color:#98C379;">type tail</span></span>
<span class="line"><span style="color:#98C379;">  path /var/log/nginx/access.log</span></span>
<span class="line"><span style="color:#98C379;">  pos_file /var/log/fluent/nginx-access.pos</span></span>
<span class="line"><span style="color:#98C379;">  tag nginx.access</span></span>
<span class="line"><span style="color:#98C379;">  format json</span></span>
<span class="line"><span style="color:#98C379;">  read_from_head true</span></span>
<span class="line"><span style="color:#98C379;">&lt;/source&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">&lt;source&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">  @</span><span style="color:#98C379;">type tail</span></span>
<span class="line"><span style="color:#98C379;">  path /var/log/myapp/*.log</span></span>
<span class="line"><span style="color:#98C379;">  pos_file /var/log/fluent/myapp.pos</span></span>
<span class="line"><span style="color:#98C379;">  tag app.production</span></span>
<span class="line"><span style="color:#98C379;">  format json</span></span>
<span class="line"><span style="color:#98C379;">  read_from_head true</span></span>
<span class="line"><span style="color:#98C379;">&lt;/source&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">&lt;match nginx.**&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">  @</span><span style="color:#98C379;">type elasticsearch</span></span>
<span class="line"><span style="color:#98C379;">  host es-node1.internal.example.com</span></span>
<span class="line"><span style="color:#98C379;">  port 9200</span></span>
<span class="line"><span style="color:#98C379;">  logstash_format true</span></span>
<span class="line"><span style="color:#98C379;">  logstash_prefix nginx</span></span>
<span class="line"><span style="color:#98C379;">  flush_interval 5s</span></span>
<span class="line"><span style="color:#98C379;">&lt;/match&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">&lt;match app.**&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">  @</span><span style="color:#98C379;">type elasticsearch</span></span>
<span class="line"><span style="color:#98C379;">  host es-node1.internal.example.com</span></span>
<span class="line"><span style="color:#98C379;">  port 9200</span></span>
<span class="line"><span style="color:#98C379;">  logstash_format true</span></span>
<span class="line"><span style="color:#98C379;">  logstash_prefix app</span></span>
<span class="line"><span style="color:#98C379;">  flush_interval 5s</span></span>
<span class="line"><span style="color:#98C379;">&lt;/match&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-5-日志采集方案对比" tabindex="-1"><a class="header-anchor" href="#_7-5-日志采集方案对比"><span>7.5 日志采集方案对比</span></a></h3><table><thead><tr><th>特性</th><th>Filebeat</th><th>Fluentd</th><th>Fluent Bit</th></tr></thead><tbody><tr><td>语言</td><td>Go</td><td>Ruby/C</td><td>C</td></tr><tr><td>内存占用</td><td>~10MB</td><td>~100MB+</td><td>~5MB</td></tr><tr><td>吞吐量</td><td>高</td><td>中</td><td>高</td></tr><tr><td>插件生态</td><td>Elastic 生态</td><td>非常丰富</td><td>增长中</td></tr><tr><td>适用场景</td><td>Elastic 栈</td><td>通用日志</td><td>边缘/容器</td></tr></tbody></table><h2 id="八、告警分级与升级机制" tabindex="-1"><a class="header-anchor" href="#八、告警分级与升级机制"><span>八、告警分级与升级机制</span></a></h2><h3 id="_8-1-告警分级标准" tabindex="-1"><a class="header-anchor" href="#_8-1-告警分级标准"><span>8.1 告警分级标准</span></a></h3><table><thead><tr><th>级别</th><th>名称</th><th>含义</th><th>响应时间</th><th>通知方式</th><th>示例</th></tr></thead><tbody><tr><td>P1</td><td>紧急</td><td>服务不可用，影响全部用户</td><td>5 分钟</td><td>电话+钉钉+邮件</td><td>节点离线、核心接口全挂</td></tr><tr><td>P2</td><td>严重</td><td>服务降级，影响部分用户</td><td>15 分钟</td><td>钉钉+邮件</td><td>CPU &gt;95%、磁盘 &gt;90%</td></tr><tr><td>P3</td><td>警告</td><td>潜在风险，暂不影响用户</td><td>1 小时</td><td>邮件+钉钉</td><td>CPU &gt;80%、磁盘 &gt;80%</td></tr><tr><td>P4</td><td>提示</td><td>需要关注的趋势</td><td>次日处理</td><td>邮件</td><td>磁盘使用率 &gt;70%</td></tr></tbody></table><h3 id="_8-2-告警升级流程" tabindex="-1"><a class="header-anchor" href="#_8-2-告警升级流程"><span>8.2 告警升级流程</span></a></h3>`,13),i(f,{code:`eJwrTi0sTc1LTnXJTEwvSszlUgCCgsSikszkzILEvBIFR4XEYgXHnNSiktzEvMT01CIMFf4gFU8b9jzvX/t0+9LnK7qf7ujAUBQCVjR70csZ8xV8UhNTsJjjC1LyfN3C5xPanm5s4gLL++WXpCrkl6UWKThaKQQYKjyd2PVi7bIXy5c97Z8IVuCoa2fnb6XwfMrWF+vnKmgrvJzUCUINs57PX4puBFCdqcLTjraXk+Y/bWt9NmfV84XrXqxbAlblrws0CGgHUPTp5N6nu6bATQ+xUnja2/5813LshgKlDXGaGoLTVF+gm2FexelaiElPd257uqQFqBTqULCJkIBAsgpkKEi8cc6ztYsgDuYCAEQ9y2o=`}),s[8]||=n(`<h3 id="_8-3-告警疲劳治理" tabindex="-1"><a class="header-anchor" href="#_8-3-告警疲劳治理"><span>8.3 告警疲劳治理</span></a></h3><p>告警疲劳是运维团队的头号敌人——当告警过多时，工程师会忽视所有告警，包括真正重要的。</p><p><strong>治理策略：</strong></p><ol><li><strong>消除不可操作的告警</strong>——如果收到告警后不需要做任何事，就删掉它</li><li><strong>合并相关告警</strong>——同节点的 CPU/内存/磁盘告警合并为一条</li><li><strong>提高 <code>for</code> 时间</strong>——短时波动不是问题，等几分钟再告警</li><li><strong>分级收件</strong>——P1 电话，P2 钉钉，P3/P4 邮件</li><li><strong>定期回顾</strong>——每月统计告警数量和处理情况，删除持续误报的规则</li></ol><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看告警统计</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通过 Alertmanager API</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> http://localhost:9093/api/v2/alerts</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    jq</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> &#39;.[] | .labels.alertname&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通过 Prometheus API 查看活跃告警</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> &#39;http://localhost:9090/api/v1/alerts&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    jq</span><span style="color:#98C379;"> &#39;.data.alerts[] | select(.state==&quot;firing&quot;) | .labels.alertname&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="九、runbook-文档" tabindex="-1"><a class="header-anchor" href="#九、runbook-文档"><span>九、Runbook 文档</span></a></h2><p>Runbook 是告警的操作手册——收到告警后按照 Runbook 步骤执行即可。</p><h3 id="_9-1-runbook-模板" tabindex="-1"><a class="header-anchor" href="#_9-1-runbook-模板"><span>9.1 Runbook 模板</span></a></h3><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-markdown"><span class="line"><span style="color:#E06C75;"># [</span><span style="color:#61AFEF;">告警名称</span><span style="color:#E06C75;">] Runbook</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 告警信息</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#D19A66;"> **告警名称**</span><span style="color:#ABB2BF;">：NodeCPUHigh</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#D19A66;"> **严重级别**</span><span style="color:#ABB2BF;">：warning / critical</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#D19A66;"> **告警条件**</span><span style="color:#ABB2BF;">：CPU 使用率 &gt; 85%（warning）/ &gt; 95%（critical），持续 5 分钟</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#D19A66;"> **影响范围**</span><span style="color:#ABB2BF;">：该节点上所有服务</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 快速诊断</span></span>
<span class="line"><span style="color:#E5C07B;">1.</span><span style="color:#ABB2BF;"> 登录服务器：</span><span style="color:#E5C07B;">\`</span><span style="color:#98C379;">ssh &lt;instance&gt;</span><span style="color:#E5C07B;">\`</span></span>
<span class="line"><span style="color:#E5C07B;">2.</span><span style="color:#ABB2BF;"> 查看当前 CPU 占用：</span><span style="color:#E5C07B;">\`</span><span style="color:#98C379;">top -c</span><span style="color:#E5C07B;">\`</span><span style="color:#ABB2BF;"> 或 </span><span style="color:#E5C07B;">\`</span><span style="color:#98C379;">htop</span><span style="color:#E5C07B;">\`</span></span>
<span class="line"><span style="color:#E5C07B;">3.</span><span style="color:#ABB2BF;"> 查看历史趋势：Grafana → Node Dashboard → CPU 面板</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 常见原因与处理</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 原因1：进程异常</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 排查：</span><span style="color:#E5C07B;">\`</span><span style="color:#98C379;">ps aux --sort=-%cpu | head -10</span><span style="color:#E5C07B;">\`</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 处理：确认是否为正常业务流量。如果是异常进程，评估是否需要 kill</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 原因2：业务高峰</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 排查：检查 QPS 是否突增</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 处理：评估是否需要扩容</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 原因3：定时任务</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 排查：检查 crontab 和正在执行的批处理任务</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 处理：如果是预期内的任务，添加静默</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 升级条件</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 处理超过 30 分钟未恢复 → 升级到团队 Leader</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 导致服务不可用 → 升级为 P1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 相关链接</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> Grafana 仪表盘：http://grafana.example.com/d/node</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 告警规则：/etc/prometheus/rules/node_alerts.yml</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 历史故障：JIRA 项目 OPS</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-nodecpuhigh-runbook-示例" tabindex="-1"><a class="header-anchor" href="#_9-2-nodecpuhigh-runbook-示例"><span>9.2 NodeCPUHigh Runbook 示例</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># runbook_cpu_high.sh - CPU 飙高快速排查脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用法: bash runbook_cpu_high.sh &lt;instance&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">INSTANCE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${1</span><span style="color:#ABB2BF;">:?</span><span style="color:#98C379;">用法</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;font-style:italic;"> $0</span><span style="color:#98C379;"> &lt;</span><span style="color:#E06C75;">instance</span><span style="color:#98C379;">&gt;</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== CPU 飙高排查: </span><span style="color:#E06C75;">$INSTANCE</span><span style="color:#98C379;"> ===&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- TOP 10 CPU 进程 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$INSTANCE</span><span style="color:#98C379;">&quot;</span><span style="color:#98C379;"> &quot;ps aux --sort=-%cpu | head -11&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- CPU 使用率（各核心）---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$INSTANCE</span><span style="color:#98C379;">&quot;</span><span style="color:#98C379;"> &quot;mpstat -P ALL 1 3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 负载 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$INSTANCE</span><span style="color:#98C379;">&quot;</span><span style="color:#98C379;"> &quot;uptime&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 最近 5 分钟的上下文切换 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$INSTANCE</span><span style="color:#98C379;">&quot;</span><span style="color:#98C379;"> &quot;vmstat 1 5&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 进程树（按 CPU 排序）---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$INSTANCE</span><span style="color:#98C379;">&quot;</span><span style="color:#98C379;"> &quot;ps -eo pid,ppid,cmd,%cpu,%mem --sort=-%cpu | head -20&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;--- 定时任务 ---&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$INSTANCE</span><span style="color:#98C379;">&quot;</span><span style="color:#98C379;"> &quot;crontab -l 2&gt;/dev/null; ls /etc/cron.d/&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 排查完毕 ===&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;根据以上信息判断原因，参考 Runbook 处理&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="十、监控体系运维" tabindex="-1"><a class="header-anchor" href="#十、监控体系运维"><span>十、监控体系运维</span></a></h2><h3 id="_10-1-监控系统自身监控" tabindex="-1"><a class="header-anchor" href="#_10-1-监控系统自身监控"><span>10.1 监控系统自身监控</span></a></h3><p>监控系统本身也需要被监控——如果 Prometheus 挂了，所有告警都会失效。</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/prometheus/rules/meta_monitoring.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">groups</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">meta_monitoring</span></span>
<span class="line"><span style="color:#E06C75;">    rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">PrometheusDown</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">up{job=&quot;prometheus&quot;} == 0</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">1m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">critical</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Prometheus 自身离线&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Prometheus 实例 {{ $labels.instance }} 离线&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">PrometheusConfigReloadFailed</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">prometheus_config_last_reload_successful == 0</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Prometheus 配置重载失败&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">PrometheusTargetScrapingSlow</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">prometheus_target_interval_length_seconds{quantile=&quot;0.9&quot;} &gt; 15</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Prometheus 采集延迟过高&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">PrometheusTSDBCompactionsFailing</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">rate(prometheus_tsdb_compactions_failed_total[5m]) &gt; 0</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Prometheus TSDB 压缩失败&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">PrometheusNotConnectedToAlertmanager</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">prometheus_notifications_alertmanagers_discovered &lt; 1</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">critical</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Prometheus 未连接到 Alertmanager&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">AlertmanagerConfigReloadFailed</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">alertmanager_config_last_reload_successful == 0</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Alertmanager 配置重载失败&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">元监控策略</p><ol><li><strong>双 Prometheus</strong>——两个实例互相监控，互为备份</li><li><strong>外部探测</strong>——从集群外部用 Blackbox Exporter 探测 Prometheus 是否可达</li><li><strong>Dead Man&#39;s Switch</strong>——配置一条始终触发的告警，如果它停止触发，说明告警链路断了</li></ol></div><h3 id="_10-2-监控系统容量规划" tabindex="-1"><a class="header-anchor" href="#_10-2-监控系统容量规划"><span>10.2 监控系统容量规划</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Prometheus 存储使用</span></span>
<span class="line"><span style="color:#61AFEF;">du</span><span style="color:#D19A66;"> -sh</span><span style="color:#98C379;"> /var/lib/prometheus/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 指标基数（cardinality）</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> http://localhost:9090/api/v1/label/__name__/values</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    jq</span><span style="color:#98C379;"> &#39;.data | length&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Top 20 高基数指标</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> &#39;http://localhost:9090/api/v1/query?query=topk(20,count_by(%7B__name__%3D~&quot;.*&quot;%7D))&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">    jq</span><span style="color:#98C379;"> &#39;.data.result[] | .metric.__name__ + &quot;: &quot; + .value[1]&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># TSDB 统计</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> http://localhost:9090/api/v1/status/tsdb</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">jq</span><span style="color:#98C379;"> &#39;.data&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-监控配置变更流程" tabindex="-1"><a class="header-anchor" href="#_10-3-监控配置变更流程"><span>10.3 监控配置变更流程</span></a></h3>`,19),i(f,{code:`eJxLy8kvT85ILCpRCHHhUgACx+gn+9c9m7Lz6cSuF2uXvVje8rRjZqyCrq6dglP0szlrns7Z8HJVz4v1jS/Wr322eWosWI8TWN45+ln/hCe7ligEBEGEncHCLtHO+SmpCkGpZZmp5RAJF7CEa/XTdQufde582TDrxf52+1qwlCtIqubphGU1Co5IAs9mrK9RcIt+OqHj6c5tTzs2KOQmZuZBDHMDG+Ye7eyp8KJ91dOuFQpFqTn5iSkQWXewrEf0i+VNT9fPVzAyyYCIe4DFPatfrF//rGvp8z6Y/Z5g6+wMDVRrFLyiX2xofjZ1CzQQkORtwPLe0c93bX7auvTZ2sVP9/TDVIGVFZdU5qQC3Z6WmZNjpZyWlmaZbIIk4YkqAQCUS5bl`}),s[9]||=n(`<h2 id="参考资源" tabindex="-1"><a class="header-anchor" href="#参考资源"><span>参考资源</span></a></h2><ul><li><a href="https://prometheus.io/docs/" target="_blank" rel="noopener noreferrer">Prometheus 官方文档</a> - Prometheus 权威指南</li><li><a href="https://grafana.com/docs/" target="_blank" rel="noopener noreferrer">Grafana 官方文档</a> - Grafana 使用手册</li><li><a href="https://prometheus.io/docs/alerting/latest/configuration/" target="_blank" rel="noopener noreferrer">Alertmanager 配置指南</a> - 告警路由配置</li><li><a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener noreferrer">Google SRE 监控章节</a> - 监控设计哲学</li><li><a href="https://github.com/prometheus/node_exporter" target="_blank" rel="noopener noreferrer">Node Exporter 指标列表</a> - 系统指标参考</li><li><a href="https://github.com/samber/awesome-prometheus-alerts" target="_blank" rel="noopener noreferrer">Awesome Prometheus Alerts</a> - 告警规则合集</li></ul>`,2)])}var u=o(c,[[`render`,l]]);export{s as _pageData,u as default};