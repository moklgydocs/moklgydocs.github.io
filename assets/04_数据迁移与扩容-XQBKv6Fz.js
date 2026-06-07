import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-CK-XCtbm.js";var o=JSON.parse(`{"path":"/%E5%90%8E%E7%AB%AF%E5%BC%80%E5%8F%91/Redis/09_%E7%94%9F%E4%BA%A7%E7%BA%A7%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1/04_%E6%95%B0%E6%8D%AE%E8%BF%81%E7%A7%BB%E4%B8%8E%E6%89%A9%E5%AE%B9.html","title":"数据迁移与扩容","lang":"zh-CN","frontmatter":{"title":"数据迁移与扩容","icon":"fa6-solid:arrows-left-right","order":2,"category":["Redis"],"tag":["扩容","迁移","槽迁移","redis-shake","双写","预分片","缩容"]},"git":{"createdTime":1780588404000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":17.17,"words":5151},"filePathRelative":"后端开发/Redis/09_生产级架构设计/04_数据迁移与扩容.md"}`),s={name:`04_数据迁移与扩容.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="数据迁移与扩容" tabindex="-1"><a class="header-anchor" href="#数据迁移与扩容"><span>数据迁移与扩容</span></a></h1><blockquote><p>Redis 扩容和迁移是生产环境中最具挑战性的运维操作之一。内存不足、QPS 瓶颈、业务增长都要求 Redis 具备在线扩容能力，但扩容过程中的数据一致性、服务可用性和回滚预案都需要精心设计。本文将从扩容场景分析出发，深入各种扩容方案、迁移工具和最佳实践。</p></blockquote><h2 id="_1-扩容场景分析" tabindex="-1"><a class="header-anchor" href="#_1-扩容场景分析"><span>1. 扩容场景分析</span></a></h2><h3 id="_1-1-何时需要扩容" tabindex="-1"><a class="header-anchor" href="#_1-1-何时需要扩容"><span>1.1 何时需要扩容</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Redis 扩容触发条件：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  1. 内存不足                                               │</span></span>
<span class="line"><span>│     • used_memory &gt; maxmemory 的 70%                      │</span></span>
<span class="line"><span>│     • RDB 持久化 fork 失败（内存不够创建子进程）            │</span></span>
<span class="line"><span>│     • 频繁触发淘汰策略                                      │</span></span>
<span class="line"><span>│     • AOF 重写占用大量内存                                  │</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  2. QPS 不足                                               │</span></span>
<span class="line"><span>│     • 写入 QPS 接近单主上限（~10万）                       │</span></span>
<span class="line"><span>│     • 读取 QPS 超过主从能力                                 │</span></span>
<span class="line"><span>│     • 延迟 P99 持续升高                                    │</span></span>
<span class="line"><span>│     • 命令排队时间增长                                      │</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  3. 网络带宽不足                                            │</span></span>
<span class="line"><span>│     • 出入流量接近网卡上限                                   │</span></span>
<span class="line"><span>│     • 大 Value 导致带宽成为瓶颈                              │</span></span>
<span class="line"><span>│     • 大量小命令导致协议开销大                               │</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  4. 业务需求变化                                            │</span></span>
<span class="line"><span>│     • 新业务上线需要独立 Redis                               │</span></span>
<span class="line"><span>│     • 业务拆分需要数据隔离                                  │</span></span>
<span class="line"><span>│     • 合规要求需要物理隔离                                  │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-扩容量化指标" tabindex="-1"><a class="header-anchor" href="#_1-2-扩容量化指标"><span>1.2 扩容量化指标</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>┌──────────────────┬──────────────┬──────────────────────────┐</span></span>
<span class="line"><span>│  监控指标          │  告警阈值     │  扩容建议                  │</span></span>
<span class="line"><span>├──────────────────┼──────────────┼──────────────────────────┤</span></span>
<span class="line"><span>│  内存使用率       │  &gt; 70%       │  垂直扩容或迁移到 Cluster  │</span></span>
<span class="line"><span>│  内存碎片率       │  &lt; 1.0       │  重启或开启 activedefrag  │</span></span>
<span class="line"><span>│  写入 QPS         │  &gt; 8万       │  Cluster 水平扩展          │</span></span>
<span class="line"><span>│  读取 QPS         │  &gt; 30万      │  增加从节点               │</span></span>
<span class="line"><span>│  延迟 P99         │  &gt; 5ms       │  检查慢查询，考虑扩容      │</span></span>
<span class="line"><span>│  fork 耗时        │  &gt; 1s        │  减少实例内存或垂直扩容    │</span></span>
<span class="line"><span>│  网络出入流量     │  &gt; 网卡 80%  │  垂直扩容或数据分片        │</span></span>
<span class="line"><span>│  连接数           │  &gt; 50000     │  检查连接泄漏             │</span></span>
<span class="line"><span>│  淘汰 Key 数/秒   │  &gt; 0         │  扩容内存                 │</span></span>
<span class="line"><span>└──────────────────┴──────────────┴──────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>获取指标命令：</span></span>
<span class="line"><span>  INFO memory     → 内存使用</span></span>
<span class="line"><span>  INFO stats      → QPS、淘汰数</span></span>
<span class="line"><span>  INFO clients    → 连接数</span></span>
<span class="line"><span>  INFO persistence → fork 耗时</span></span>
<span class="line"><span>  SLOWLOG GET 10  → 慢查询</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-垂直扩容-vs-水平扩容" tabindex="-1"><a class="header-anchor" href="#_2-垂直扩容-vs-水平扩容"><span>2. 垂直扩容 vs 水平扩容</span></a></h2><h3 id="_2-1-扩容方式对比" tabindex="-1"><a class="header-anchor" href="#_2-1-扩容方式对比"><span>2.1 扩容方式对比</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>┌──────────────────┬──────────────────┬───────────────────────┐</span></span>
<span class="line"><span>│  维度              │  垂直扩容          │  水平扩容               │</span></span>
<span class="line"><span>│                    │  (Scale Up)       │  (Scale Out)           │</span></span>
<span class="line"><span>├──────────────────┼──────────────────┼───────────────────────┤</span></span>
<span class="line"><span>│  方式              │  升级机器配置      │  增加节点数量            │</span></span>
<span class="line"><span>│  上限              │  机器硬件上限      │  理论无上限              │</span></span>
<span class="line"><span>│  停机时间          │  需要短暂停机      │  在线扩容               │</span></span>
<span class="line"><span>│  数据迁移          │  不需要           │  需要                   │</span></span>
<span class="line"><span>│  复杂度            │  低               │  高                     │</span></span>
<span class="line"><span>│  成本              │  高（高级机器）    │  低（普通机器）          │</span></span>
<span class="line"><span>│  适用场景          │  临时缓解         │  长期方案               │</span></span>
<span class="line"><span>│  扩容速度          │  快（分钟级）      │  慢（小时级）            │</span></span>
<span class="line"><span>│  缩容              │  降配（简单）      │  需要数据迁移            │</span></span>
<span class="line"><span>└──────────────────┴──────────────────┴───────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-垂直扩容方案" tabindex="-1"><a class="header-anchor" href="#_2-2-垂直扩容方案"><span>2.2 垂直扩容方案</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>垂直扩容流程：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>方案1：停机升级（简单可靠）</span></span>
<span class="line"><span>┌───────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  1. 通知相关方维护窗口                               │</span></span>
<span class="line"><span>│  2. 应用层停止写入（或切换到只读模式）                │</span></span>
<span class="line"><span>│  3. 等待 Redis 写入完成（bgsave / aof fsync）       │</span></span>
<span class="line"><span>│  4. 关闭 Redis 服务                                 │</span></span>
<span class="line"><span>│  5. 升级机器配置（CPU/内存/磁盘）                    │</span></span>
<span class="line"><span>│  6. 启动 Redis 服务                                 │</span></span>
<span class="line"><span>│  7. 验证数据完整性                                   │</span></span>
<span class="line"><span>│  8. 恢复应用写入                                     │</span></span>
<span class="line"><span>│  停机时间：5-15 分钟                                 │</span></span>
<span class="line"><span>└───────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>方案2：主从切换升级（零停机）</span></span>
<span class="line"><span>┌───────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  1. 部署高配新机器                                   │</span></span>
<span class="line"><span>│  2. 将新机器配置为当前主节点的从节点                   │</span></span>
<span class="line"><span>│  3. 等待数据全量同步完成                              │</span></span>
<span class="line"><span>│  4. 执行故障转移（手动或 Sentinel）                   │</span></span>
<span class="line"><span>│  5. 新主节点（高配机器）开始服务                      │</span></span>
<span class="line"><span>│  6. 下线旧主节点                                     │</span></span>
<span class="line"><span>│  停机时间：~0（切换期间 &lt; 30秒）                     │</span></span>
<span class="line"><span>└───────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>方案3：在线扩容（云环境）</span></span>
<span class="line"><span>┌───────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  1. 云控制台调整实例规格                              │</span></span>
<span class="line"><span>│  2. 云平台自动执行迁移                               │</span></span>
<span class="line"><span>│  3. 迁移期间可能短暂不可用（秒级）                    │</span></span>
<span class="line"><span>│  4. 迁移完成验证                                     │</span></span>
<span class="line"><span>│  停机时间：0-30秒（取决于云厂商）                    │</span></span>
<span class="line"><span>└───────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-水平扩容方案" tabindex="-1"><a class="header-anchor" href="#_2-3-水平扩容方案"><span>2.3 水平扩容方案</span></a></h3>`,13),i(d,{code:`eJxLy8kvT85ILCpRCHHhUgACx+iXcxpeLGt8tmHL052bn3WufLpuZ6yCrq6dglP1072Tn3b2Ppu37dm8FvtasHInkFTN096pT9fNe7Kvu0bBOfpl84rnezc92bH7ye6+p0t6n3ZsiwUrdQab4gKVVwhOzSvJzEvNgUhCzIFo0oZJ1Si4Vj+bsf7phGVQN03d8Kx33dOOtued7VD7XSH2T1hWo+AWrfR00bynXQuARrzoanretNMmqUjf7mn/qhfrd4M8snGqEsQyiCagyTUK7tEv9jc+X777accGBeec0uKS1CJkB0GFahQ8op9t3w0ye8duiNnaEH3Plu+FqPcA+84zWgmqDsUNL1fPeNq//vmUFUAHAAArtrPP`}),o[1]||=n(`<h2 id="_3-主从迁移" tabindex="-1"><a class="header-anchor" href="#_3-主从迁移"><span>3. 主从迁移</span></a></h2><h3 id="_3-1-主从-→-sentinel-迁移" tabindex="-1"><a class="header-anchor" href="#_3-1-主从-→-sentinel-迁移"><span>3.1 主从 → Sentinel 迁移</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>主从 → Sentinel 迁移步骤：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 1: 部署 Sentinel 集群</span></span>
<span class="line"><span>┌─────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  当前架构：                                    │</span></span>
<span class="line"><span>│  Master(10.0.0.1) → Slave(10.0.0.2)         │</span></span>
<span class="line"><span>│                                                │</span></span>
<span class="line"><span>│  部署 Sentinel：                               │</span></span>
<span class="line"><span>│  Sentinel1(10.0.0.10:26379)                   │</span></span>
<span class="line"><span>│  Sentinel2(10.0.0.11:26379)                   │</span></span>
<span class="line"><span>│  Sentinel3(10.0.0.12:26379)                   │</span></span>
<span class="line"><span>│                                                │</span></span>
<span class="line"><span>│  配置 sentinel.conf：                          │</span></span>
<span class="line"><span>│  sentinel monitor mymaster 10.0.0.1 6379 2   │</span></span>
<span class="line"><span>│  sentinel down-after-milliseconds mymaster 30000│</span></span>
<span class="line"><span>│  sentinel failover-timeout mymaster 180000    │</span></span>
<span class="line"><span>│  sentinel parallel-syncs mymaster 1           │</span></span>
<span class="line"><span>└─────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 2: 验证 Sentinel 监控</span></span>
<span class="line"><span>┌─────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  # 检查 Sentinel 状态                         │</span></span>
<span class="line"><span>│  redis-cli -p 26379 SENTINEL masters         │</span></span>
<span class="line"><span>│  redis-cli -p 26379 SENTINEL slaves mymaster │</span></span>
<span class="line"><span>│  redis-cli -p 26379 SENTINEL sentinels mymaster│</span></span>
<span class="line"><span>└─────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 3: 客户端切换</span></span>
<span class="line"><span>┌─────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  将客户端从直连 Master 切换为通过 Sentinel     │</span></span>
<span class="line"><span>│  获取主节点地址：                              │</span></span>
<span class="line"><span>│  SENTINEL get-master-addr-by-name mymaster   │</span></span>
<span class="line"><span>│                                                │</span></span>
<span class="line"><span>│  灰度切换：1% → 10% → 50% → 100%             │</span></span>
<span class="line"><span>└─────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 4: 验证故障转移</span></span>
<span class="line"><span>┌─────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  模拟主节点故障：                              │</span></span>
<span class="line"><span>│  redis-cli -h 10.0.0.1 DEBUG SLEEP 60       │</span></span>
<span class="line"><span>│                                                │</span></span>
<span class="line"><span>│  观察 Sentinel 是否自动切换                    │</span></span>
<span class="line"><span>│  确认客户端是否自动重连到新主节点              │</span></span>
<span class="line"><span>└─────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-sentinel-→-cluster-迁移" tabindex="-1"><a class="header-anchor" href="#_3-2-sentinel-→-cluster-迁移"><span>3.2 Sentinel → Cluster 迁移</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Sentinel → Cluster 迁移（最复杂的迁移路径）：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Phase 1: 准备（1-2周）</span></span>
<span class="line"><span>┌───────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  1. 评估多 Key 操作                                │</span></span>
<span class="line"><span>│     • 搜索代码中所有 MGET/MSET/DEL 多 Key 操作     │</span></span>
<span class="line"><span>│     • 搜索代码中所有 Lua 脚本                      │</span></span>
<span class="line"><span>│     • 搜索代码中所有事务                            │</span></span>
<span class="line"><span>│     • 将关联 Key 改为 Hash Tag：user:{id} → {user:id}│</span></span>
<span class="line"><span>│                                                      │</span></span>
<span class="line"><span>│  2. 准备 Cluster 节点                               │</span></span>
<span class="line"><span>│     • 部署 6+ 节点（3主3从）                        │</span></span>
<span class="line"><span>│     • 创建 Cluster                                  │</span></span>
<span class="line"><span>│     • 分配初始槽位                                   │</span></span>
<span class="line"><span>│                                                      │</span></span>
<span class="line"><span>│  3. 客户端改造                                      │</span></span>
<span class="line"><span>│     • 支持 MOVED/ASK 重定向                          │</span></span>
<span class="line"><span>│     • 替换不支持 Cluster 的操作                      │</span></span>
<span class="line"><span>│     • 测试环境验证                                   │</span></span>
<span class="line"><span>└───────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Phase 2: 数据迁移（1-3天）</span></span>
<span class="line"><span>┌───────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  选择迁移工具：                                      │</span></span>
<span class="line"><span>│                                                      │</span></span>
<span class="line"><span>│  方案A：redis-shake（推荐）                           │</span></span>
<span class="line"><span>│    • 支持全量+增量同步                                │</span></span>
<span class="line"><span>│    • 支持断点续传                                     │</span></span>
<span class="line"><span>│    • 数据校验                                        │</span></span>
<span class="line"><span>│                                                      │</span></span>
<span class="line"><span>│  方案B：redis-cli --cluster import                  │</span></span>
<span class="line"><span>│    • Redis 官方工具                                  │</span></span>
<span class="line"><span>│    • 操作简单                                       │</span></span>
<span class="line"><span>│    • 不支持增量同步                                   │</span></span>
<span class="line"><span>│                                                      │</span></span>
<span class="line"><span>│  方案C：双写方案                                     │</span></span>
<span class="line"><span>│    • 应用层同时写 Sentinel 和 Cluster                │</span></span>
<span class="line"><span>│    • 全量迁移历史数据                                 │</span></span>
<span class="line"><span>│    • 数据校验                                       │</span></span>
<span class="line"><span>│    • 切读 → 停写                                     │</span></span>
<span class="line"><span>└───────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Phase 3: 切换验证（1-3天）</span></span>
<span class="line"><span>┌───────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  1. 灰度切 1% 流量到 Cluster                        │</span></span>
<span class="line"><span>│  2. 监控延迟、错误率、数据一致性                      │</span></span>
<span class="line"><span>│  3. 逐步扩大流量（1% → 10% → 50% → 100%）           │</span></span>
<span class="line"><span>│  4. 全量切换完成后保留 Sentinel 7 天                  │</span></span>
<span class="line"><span>│  5. 确认无回滚需求后下线 Sentinel                    │</span></span>
<span class="line"><span>└───────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-redis-cluster-扩容" tabindex="-1"><a class="header-anchor" href="#_4-redis-cluster-扩容"><span>4. Redis Cluster 扩容</span></a></h2><h3 id="_4-1-添加节点" tabindex="-1"><a class="header-anchor" href="#_4-1-添加节点"><span>4.1 添加节点</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Redis Cluster 添加主节点：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 1: 启动新节点</span></span>
<span class="line"><span>  # 新节点配置</span></span>
<span class="line"><span>  port 6380</span></span>
<span class="line"><span>  cluster-enabled yes</span></span>
<span class="line"><span>  cluster-config-file nodes-6380.conf</span></span>
<span class="line"><span>  cluster-node-timeout 15000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 2: 加入集群</span></span>
<span class="line"><span>  redis-cli --cluster add-node \\</span></span>
<span class="line"><span>    10.0.1.4:6380 \\         ← 新节点</span></span>
<span class="line"><span>    10.0.1.1:6379            ← 集群中任一节点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 3: 查看节点状态</span></span>
<span class="line"><span>  redis-cli cluster nodes</span></span>
<span class="line"><span>  # 新节点已加入，但还没有分配槽位</span></span>
<span class="line"><span></span></span>
<span class="line"><span>扩容前：</span></span>
<span class="line"><span>┌──────────┐ ┌──────────┐ ┌──────────┐</span></span>
<span class="line"><span>│ Master-1 │ │ Master-2 │ │ Master-3 │</span></span>
<span class="line"><span>│ 0-5460   │ │5461-10922│ │10923-16383│</span></span>
<span class="line"><span>└──────────┘ └──────────┘ └──────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>扩容后（添加 Master-4，但未迁移槽）：</span></span>
<span class="line"><span>┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐</span></span>
<span class="line"><span>│ Master-1 │ │ Master-2 │ │ Master-3 │ │ Master-4 │</span></span>
<span class="line"><span>│ 0-5460   │ │5461-10922│ │10923-16383│ │  无槽位   │</span></span>
<span class="line"><span>└──────────┘ └──────────┘ └──────────┘ └──────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-迁移槽位" tabindex="-1"><a class="header-anchor" href="#_4-2-迁移槽位"><span>4.2 迁移槽位</span></a></h3>`,9),i(d,{code:`eJxtkctqwkAUhvc+RcheStVlsXhNpaQt4m5w4SWtgrQlUUqpBW80XgKmQlvRjUKp1kXMQopVxJdxJslbdDIjJdDOZmbO+c75/zlzWbi5y+RSYpFJhF0MXgHAGmMNagNzWzUma1Mbw2bvKC0e+PHR0N7QvLtbzsx2zah9G4OGMdTQSEaTjanU4XDBJhm3288EAWpNzLFix0mbJOkdJMkQEIVsXnJnCnl8zxRKUlEQGVGQsI0sBUMEDAOr0kKdT7RSqR7sKVSPXikbJmxkz1I5bAxLoxfdkruUihAqCkx5BttT6s5pLUry3AONof4cqh9QU1BTPX4kAGcDZRwtM1FHAJNl5gRYM8WcV7EmbD7BZT3pIohUSl+Jqdscs5/lVjamHZKxF38I2N+n2Y/SdNxgt1yRafMxLh5IxM44o/2FKlWW2iR1HvxFjjH8KY3xF+fx/0u9gLUqKv7AU+GemnKIReDzZrd+d/I+gIYL9KrvlfBM+yOoNxzEIRkc76Gbl24+kheus64fyYAXOA==`}),o[2]||=n(`<div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>槽迁移详细流程：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 执行 reshard 命令</span></span>
<span class="line"><span>   redis-cli --cluster reshard 10.0.1.1:6379</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   交互式输入：</span></span>
<span class="line"><span>   • 迁移多少槽？ → 4096（总槽/节点数）</span></span>
<span class="line"><span>   • 目标节点 ID → Master-4 的 Node ID</span></span>
<span class="line"><span>   • 源节点 ID  → all（从所有节点均匀迁移）</span></span>
<span class="line"><span>   • 是否继续？ → yes</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 底层执行步骤：</span></span>
<span class="line"><span>   ┌──────────────────────────────────────────────────┐</span></span>
<span class="line"><span>   │  对每个要迁移的槽：                                 │</span></span>
<span class="line"><span>   │                                                    │</span></span>
<span class="line"><span>   │  a) 源节点：CLUSTER SETSLOT &lt;slot&gt; MIGRATING &lt;target&gt;│</span></span>
<span class="line"><span>   │     标记槽为&quot;迁出中&quot;                                │</span></span>
<span class="line"><span>   │                                                    │</span></span>
<span class="line"><span>   │  b) 目标节点：CLUSTER SETSLOT &lt;slot&gt; IMPORTING &lt;source&gt;│</span></span>
<span class="line"><span>   │     标记槽为&quot;迁入中&quot;                                │</span></span>
<span class="line"><span>   │                                                    │</span></span>
<span class="line"><span>   │  c) 获取源节点该槽的所有 Key：                       │</span></span>
<span class="line"><span>   │     CLUSTER GETKEYSINSLOT &lt;slot&gt; &lt;count&gt;            │</span></span>
<span class="line"><span>   │                                                    │</span></span>
<span class="line"><span>   │  d) 逐个迁移 Key：                                  │</span></span>
<span class="line"><span>   │     MIGRATE &lt;target&gt; &lt;port&gt; &lt;key&gt; 0 &lt;timeout&gt;      │</span></span>
<span class="line"><span>   │     原子操作：在源节点DEL + 在目标节点RESTORE         │</span></span>
<span class="line"><span>   │                                                    │</span></span>
<span class="line"><span>   │  e) 迁移完成后：                                    │</span></span>
<span class="line"><span>   │     CLUSTER SETSLOT &lt;slot&gt; NODE &lt;target-id&gt;         │</span></span>
<span class="line"><span>   │     通知所有节点更新槽映射                           │</span></span>
<span class="line"><span>   └──────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 迁移期间的请求路由</span></span>
<span class="line"><span>   ┌──────────────────────────────────────────────────┐</span></span>
<span class="line"><span>   │  客户端请求迁移中的槽：                              │</span></span>
<span class="line"><span>   │                                                    │</span></span>
<span class="line"><span>   │  Key 在源节点：                                     │</span></span>
<span class="line"><span>   │    → 源节点正常响应                                  │</span></span>
<span class="line"><span>   │                                                    │</span></span>
<span class="line"><span>   │  Key 已迁移到目标节点：                              │</span></span>
<span class="line"><span>   │    → 源节点返回 ASK 重定向                           │</span></span>
<span class="line"><span>   │    → 客户端发送 ASKING 后重定向到目标节点             │</span></span>
<span class="line"><span>   │    → 目标节点执行一次请求                            │</span></span>
<span class="line"><span>   │                                                    │</span></span>
<span class="line"><span>   │  迁移完成后：                                       │</span></span>
<span class="line"><span>   │    → 返回 MOVED 重定向（永久重定向）                 │</span></span>
<span class="line"><span>   └──────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-添加从节点" tabindex="-1"><a class="header-anchor" href="#_4-3-添加从节点"><span>4.3 添加从节点</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>添加从节点：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 1: 启动新从节点</span></span>
<span class="line"><span>  port 6381</span></span>
<span class="line"><span>  cluster-enabled yes</span></span>
<span class="line"><span>  cluster-config-file nodes-6381.conf</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 2: 加入集群并指定主节点</span></span>
<span class="line"><span>  redis-cli --cluster add-node \\</span></span>
<span class="line"><span>    10.0.1.5:6381 \\           ← 新从节点</span></span>
<span class="line"><span>    10.0.1.1:6379 \\           ← 集群中任一节点</span></span>
<span class="line"><span>    --cluster-slave \\         ← 指定为从节点</span></span>
<span class="line"><span>    --cluster-master-id &lt;master-node-id&gt;  ← 指定主节点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 3: 验证</span></span>
<span class="line"><span>  redis-cli cluster nodes | grep slave</span></span>
<span class="line"><span></span></span>
<span class="line"><span>完整的 3主→4主 扩容后：</span></span>
<span class="line"><span>┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐</span></span>
<span class="line"><span>│ Master-1 │ │ Master-2 │ │ Master-3 │ │ Master-4 │</span></span>
<span class="line"><span>│ 0-4095   │ │5461-9210 │ │10923-15000│ │4096-5460 │</span></span>
<span class="line"><span>└──┬───────┘ └──┬───────┘ └──┬───────┘ │9211-10922│</span></span>
<span class="line"><span>   │            │            │         │15001-16383│</span></span>
<span class="line"><span>┌──▼───────┐ ┌──▼───────┐ ┌──▼───────┐ └──┬───────┘</span></span>
<span class="line"><span>│ Replica1 │ │ Replica2 │ │ Replica3 │    │</span></span>
<span class="line"><span>└──────────┘ └──────────┘ └──────────┘ ┌──▼───────┐</span></span>
<span class="line"><span>                                        │ Replica4 │</span></span>
<span class="line"><span>                                        └──────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-缩容流程" tabindex="-1"><a class="header-anchor" href="#_5-缩容流程"><span>5. 缩容流程</span></a></h2><h3 id="_5-1-缩容步骤" tabindex="-1"><a class="header-anchor" href="#_5-1-缩容步骤"><span>5.1 缩容步骤</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Redis Cluster 缩容步骤：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 1: 迁移槽位</span></span>
<span class="line"><span>  将要下线节点的槽位迁移到其他节点</span></span>
<span class="line"><span>  redis-cli --cluster reshard 10.0.1.1:6379</span></span>
<span class="line"><span>  • 源节点：要下线的节点</span></span>
<span class="line"><span>  • 目标节点：接收槽位的节点</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 2: 删除从节点</span></span>
<span class="line"><span>  redis-cli --cluster del-node \\</span></span>
<span class="line"><span>    10.0.1.1:6379 \\</span></span>
<span class="line"><span>    &lt;slave-node-id&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 3: 删除主节点</span></span>
<span class="line"><span>  redis-cli --cluster del-node \\</span></span>
<span class="line"><span>    10.0.1.1:6379 \\</span></span>
<span class="line"><span>    &lt;master-node-id&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 4: 验证</span></span>
<span class="line"><span>  redis-cli cluster nodes</span></span>
<span class="line"><span>  redis-cli cluster slots</span></span>
<span class="line"><span></span></span>
<span class="line"><span>缩容注意事项：</span></span>
<span class="line"><span>  ┌──────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  ⚠️ 缩容前确认：                                   │</span></span>
<span class="line"><span>  │  • 目标节点有足够内存容纳迁移数据                     │</span></span>
<span class="line"><span>  │  • 迁移期间不影响服务                                │</span></span>
<span class="line"><span>  │  • 保留足够的从节点保证高可用                         │</span></span>
<span class="line"><span>  │  • 3主节点是最小配置，不能再缩                        │</span></span>
<span class="line"><span>  └──────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-缩容风险评估" tabindex="-1"><a class="header-anchor" href="#_5-2-缩容风险评估"><span>5.2 缩容风险评估</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>┌──────────────────┬──────────┬────────────────────────────┐</span></span>
<span class="line"><span>│  风险              │  影响程度  │  缓解措施                    │</span></span>
<span class="line"><span>├──────────────────┼──────────┼────────────────────────────┤</span></span>
<span class="line"><span>│ 目标节点内存不足   │  高       │  提前评估内存需求             │</span></span>
<span class="line"><span>│ 迁移期间延迟升高   │  中       │  低峰期执行                  │</span></span>
<span class="line"><span>│ 迁移失败数据丢失   │  极高     │  先备份，再迁移              │</span></span>
<span class="line"><span>│ 剩余节点负载过高   │  高       │  监控 QPS 和内存             │</span></span>
<span class="line"><span>│ 从节点不足         │  中       │  确保每主至少1从             │</span></span>
<span class="line"><span>│ 客户端缓存过期     │  低       │  MOVED重定向自动处理         │</span></span>
<span class="line"><span>└──────────────────┴──────────┴────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-预分片策略" tabindex="-1"><a class="header-anchor" href="#_6-预分片策略"><span>6. 预分片策略</span></a></h2><h3 id="_6-1-预分片原理" tabindex="-1"><a class="header-anchor" href="#_6-1-预分片原理"><span>6.1 预分片原理</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>预分片策略（Pre-sharding）：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>核心思想：在项目初期就按最大规模规划分片数，</span></span>
<span class="line"><span>         后续扩容只需迁移整个分片，无需重新分配槽。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  传统方式：                                               │</span></span>
<span class="line"><span>│  初期：3 主节点 → 槽 0-16383 均分                         │</span></span>
<span class="line"><span>│  扩容：4 主节点 → 重新分配所有槽（大量数据迁移）           │</span></span>
<span class="line"><span>│  再扩：5 主节点 → 再次重新分配所有槽                       │</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  每次扩容都要迁移大量数据，风险高、耗时长                   │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  预分片方式：                                              │</span></span>
<span class="line"><span>│  初期规划32个逻辑分片（最大预期规模）                       │</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  初期部署：4 物理节点，每节点 8 逻辑分片                    │</span></span>
<span class="line"><span>│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │</span></span>
<span class="line"><span>│  │ Node-1  │ │ Node-2  │ │ Node-3  │ │ Node-4  │       │</span></span>
<span class="line"><span>│  │ S0-S7   │ │ S8-S15  │ │ S16-S23 │ │ S24-S31 │       │</span></span>
<span class="line"><span>│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  扩容到 8 节点：每节点 4 逻辑分片                           │</span></span>
<span class="line"><span>│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐│</span></span>
<span class="line"><span>│  │S0-3│ │S4-7│ │S8-11│ │S12│ │S16│ │S20│ │S24│ │S28│ │</span></span>
<span class="line"><span>│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘│</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  只需迁移整个逻辑分片，不需要重新计算槽映射                 │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-预分片实施建议" tabindex="-1"><a class="header-anchor" href="#_6-2-预分片实施建议"><span>6.2 预分片实施建议</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>预分片实施建议：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 逻辑分片数量选择</span></span>
<span class="line"><span>   ┌──────────────────────────────────────────┐</span></span>
<span class="line"><span>   │  • 32分片：适合中小型业务（最终4-8物理节点）│</span></span>
<span class="line"><span>   │  • 64分片：适合大型业务（最终8-16物理节点）│</span></span>
<span class="line"><span>   │  • 128分片：适合超大型业务                  │</span></span>
<span class="line"><span>   │  • 过多分片增加管理复杂度，不推荐 &gt; 128     │</span></span>
<span class="line"><span>   └──────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. Key 路由设计</span></span>
<span class="line"><span>   • 使用 Hash Tag 保证关联 Key 在同一分片</span></span>
<span class="line"><span>   • Key 设计包含分片标识：user:{shard_id}:{uid}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 扩容流程简化</span></span>
<span class="line"><span>   • 新节点启动 → 迁移整个逻辑分片 → 更新路由</span></span>
<span class="line"><span>   • 整分片迁移比逐槽迁移更高效</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 注意事项</span></span>
<span class="line"><span>   • 预分片数确定后不可更改</span></span>
<span class="line"><span>   • 初始部署时可以多逻辑分片部署在同一物理节点</span></span>
<span class="line"><span>   • 后续扩容是物理节点级别的迁移</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-数据迁移工具" tabindex="-1"><a class="header-anchor" href="#_7-数据迁移工具"><span>7. 数据迁移工具</span></a></h2><h3 id="_7-1-redis-shake" tabindex="-1"><a class="header-anchor" href="#_7-1-redis-shake"><span>7.1 redis-shake</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>redis-shake —— 阿里云开源的 Redis 数据迁移工具</span></span>
<span class="line"><span></span></span>
<span class="line"><span>功能特性：</span></span>
<span class="line"><span>┌──────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  ✅ 全量数据同步                                          │</span></span>
<span class="line"><span>│  ✅ 增量数据同步（实时同步）                               │</span></span>
<span class="line"><span>│  ✅ 断点续传                                              │</span></span>
<span class="line"><span>│  ✅ 数据校验                                              │</span></span>
<span class="line"><span>│  ✅ 支持多种源和目标                                      │</span></span>
<span class="line"><span>│  ✅ 支持过滤和转换                                        │</span></span>
<span class="line"><span>│  ✅ 并行迁移                                              │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>支持场景：</span></span>
<span class="line"><span>  单机 → 单机</span></span>
<span class="line"><span>  单机 → Cluster</span></span>
<span class="line"><span>  Sentinel → Cluster</span></span>
<span class="line"><span>  Cluster → Cluster</span></span>
<span class="line"><span>  跨版本迁移</span></span>
<span class="line"><span>  跨云迁移</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-toml line-numbers-mode" data-highlighter="shiki" data-ext="toml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-toml"><span class="line"><span style="color:#7F848E;font-style:italic;"># redis-shake 配置文件（shake.toml）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 源端配置</span></span>
<span class="line"><span style="color:#ABB2BF;">[</span><span style="color:#61AFEF;">source</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;standalone&quot;</span><span style="color:#7F848E;font-style:italic;">     # standalone / sentinel / cluster</span></span>
<span class="line"><span style="color:#E06C75;">address</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;10.0.0.1:6379&quot;</span></span>
<span class="line"><span style="color:#E06C75;">password</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;source_password&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 目标端配置</span></span>
<span class="line"><span style="color:#ABB2BF;">[</span><span style="color:#61AFEF;">target</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;cluster&quot;</span></span>
<span class="line"><span style="color:#E06C75;">address</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;10.0.1.1:6379&quot;</span><span style="color:#7F848E;font-style:italic;">   # Cluster 任一节点</span></span>
<span class="line"><span style="color:#E06C75;">password</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;target_password&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 迁移配置</span></span>
<span class="line"><span style="color:#ABB2BF;">[</span><span style="color:#61AFEF;">advance</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 并发数</span></span>
<span class="line"><span style="color:#E06C75;">parallel</span><span style="color:#ABB2BF;"> = </span><span style="color:#D19A66;">32</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 每批大小</span></span>
<span class="line"><span style="color:#E06C75;">batch_size</span><span style="color:#ABB2BF;"> = </span><span style="color:#D19A66;">256</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 是否全量同步</span></span>
<span class="line"><span style="color:#E06C75;">rdb_parallel</span><span style="color:#ABB2BF;"> = </span><span style="color:#D19A66;">32</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 增量同步</span></span>
<span class="line"><span style="color:#E06C75;">aof_mode</span><span style="color:#ABB2BF;"> = </span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 过滤规则</span></span>
<span class="line"><span style="color:#ABB2BF;">[</span><span style="color:#61AFEF;">filter</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 只迁移匹配前缀的 Key</span></span>
<span class="line"><span style="color:#E06C75;">allow_key_prefix</span><span style="color:#ABB2BF;"> = [</span><span style="color:#98C379;">&quot;user:&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;order:&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;product:&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 排除的 Key</span></span>
<span class="line"><span style="color:#E06C75;">block_key_prefix</span><span style="color:#ABB2BF;"> = [</span><span style="color:#98C379;">&quot;temp:&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;cache:&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 数据校验</span></span>
<span class="line"><span style="color:#ABB2BF;">[</span><span style="color:#61AFEF;">check</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">enabled</span><span style="color:#ABB2BF;"> = </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">sample_rate</span><span style="color:#ABB2BF;"> = </span><span style="color:#D19A66;">0.1</span><span style="color:#7F848E;font-style:italic;">   # 10% 采样校验</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>redis-shake 执行流程：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 全量同步阶段</span></span>
<span class="line"><span>   ┌──────────────────────────────────────────────┐</span></span>
<span class="line"><span>   │  源端执行 BGSAVE → 生成 RDB 文件              │</span></span>
<span class="line"><span>   │  redis-shake 解析 RDB → 写入目标端            │</span></span>
<span class="line"><span>   │  支持并行解析和写入                             │</span></span>
<span class="line"><span>   │  全量数据量：取决于数据大小                      │</span></span>
<span class="line"><span>   │  速度：~50万 Key/秒                            │</span></span>
<span class="line"><span>   └──────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 增量同步阶段</span></span>
<span class="line"><span>   ┌──────────────────────────────────────────────┐</span></span>
<span class="line"><span>   │  全量同步完成后，自动进入增量同步               │</span></span>
<span class="line"><span>   │  源端发送 PSYNC 命令 → 接收增量数据            │</span></span>
<span class="line"><span>   │  实时同步源端的写操作到目标端                    │</span></span>
<span class="line"><span>   │  延迟：通常 &lt; 1秒                               │</span></span>
<span class="line"><span>   └──────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 数据校验</span></span>
<span class="line"><span>   ┌──────────────────────────────────────────────┐</span></span>
<span class="line"><span>   │  采样校验：随机选取 Key 对比源端和目标端        │</span></span>
<span class="line"><span>   │  校验内容：Key 存在性、Value 一致性、TTL       │</span></span>
<span class="line"><span>   │  校验比例：可配置采样率                        │</span></span>
<span class="line"><span>   └──────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-redis-migrate-tool" tabindex="-1"><a class="header-anchor" href="#_7-2-redis-migrate-tool"><span>7.2 redis-migrate-tool</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>redis-migrate-tool —— 唯品会开源的 Redis 迁移工具</span></span>
<span class="line"><span></span></span>
<span class="line"><span>特点：</span></span>
<span class="line"><span>  • 基于 Redis 协议代理</span></span>
<span class="line"><span>  • 实时迁移（源端作为代理，透传到目标端）</span></span>
<span class="line"><span>  • 支持多源到单目标</span></span>
<span class="line"><span>  • 性能较好</span></span>
<span class="line"><span></span></span>
<span class="line"><span>与 redis-shake 对比：</span></span>
<span class="line"><span>┌──────────────────┬──────────────────┬──────────────────────┐</span></span>
<span class="line"><span>│  特性              │  redis-shake      │  redis-migrate-tool   │</span></span>
<span class="line"><span>├──────────────────┼──────────────────┼──────────────────────┤</span></span>
<span class="line"><span>│  开发方           │  阿里云           │  唯品会               │</span></span>
<span class="line"><span>│  全量迁移         │  ✅               │  ✅                    │</span></span>
<span class="line"><span>│  增量迁移         │  ✅               │  ✅                    │</span></span>
<span class="line"><span>│  数据校验         │  ✅               │  ⚠️ 有限               │</span></span>
<span class="line"><span>│  断点续传         │  ✅               │  ❌                    │</span></span>
<span class="line"><span>│  代理模式         │  ❌               │  ✅                    │</span></span>
<span class="line"><span>│  跨版本           │  ✅               │  ⚠️ 部分支持           │</span></span>
<span class="line"><span>│  维护状态         │  活跃             │  较少更新              │</span></span>
<span class="line"><span>│  推荐度           │  ⭐⭐⭐             │  ⭐⭐                   │</span></span>
<span class="line"><span>└──────────────────┴──────────────────┴──────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-redis-cli-cluster-import" tabindex="-1"><a class="header-anchor" href="#_7-3-redis-cli-cluster-import"><span>7.3 redis-cli --cluster import</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>redis-cli --cluster import 官方迁移工具：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>使用方法：</span></span>
<span class="line"><span>  redis-cli --cluster import \\</span></span>
<span class="line"><span>    10.0.1.1:6379 \\           ← 目标 Cluster 节点</span></span>
<span class="line"><span>    --cluster-from 10.0.0.1:6379 \\  ← 源节点</span></span>
<span class="line"><span>    --cluster-copy              ← 复制模式（不删除源数据）</span></span>
<span class="line"><span>    --cluster-replace           ← 覆盖目标已有 Key</span></span>
<span class="line"><span></span></span>
<span class="line"><span>特点：</span></span>
<span class="line"><span>  ✅ Redis 官方工具，稳定可靠</span></span>
<span class="line"><span>  ✅ 使用 SCAN + DUMP/RESTORE 迁移数据</span></span>
<span class="line"><span>  ✅ 自动处理 Cluster 路由</span></span>
<span class="line"><span></span></span>
<span class="line"><span>限制：</span></span>
<span class="line"><span>  ❌ 只支持全量迁移，不支持增量</span></span>
<span class="line"><span>  ❌ 迁移期间新写入的数据可能丢失</span></span>
<span class="line"><span>  ❌ 大数据量迁移速度较慢</span></span>
<span class="line"><span>  ❌ 没有数据校验功能</span></span>
<span class="line"><span></span></span>
<span class="line"><span>适用场景：</span></span>
<span class="line"><span>  • 数据量较小（&lt; 1GB）</span></span>
<span class="line"><span>  • 可接受短暂停机</span></span>
<span class="line"><span>  • 快速验证 Cluster 兼容性</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_8-迁移期间一致性" tabindex="-1"><a class="header-anchor" href="#_8-迁移期间一致性"><span>8. 迁移期间一致性</span></a></h2><h3 id="_8-1-一致性挑战" tabindex="-1"><a class="header-anchor" href="#_8-1-一致性挑战"><span>8.1 一致性挑战</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>迁移期间的数据一致性问题：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>问题1：迁移期间新写入数据丢失</span></span>
<span class="line"><span>  ┌──────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  全量迁移完成后，增量数据可能未同步                 │</span></span>
<span class="line"><span>  │  如果直接切换到目标端，源端的新写入会丢失           │</span></span>
<span class="line"><span>  └──────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>问题2：双写不一致</span></span>
<span class="line"><span>  ┌──────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  同时写源端和目标端                               │</span></span>
<span class="line"><span>  │  如果源端写成功、目标端写失败                       │</span></span>
<span class="line"><span>  │  → 两端数据不一致                                │</span></span>
<span class="line"><span>  └──────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>问题3：迁移过程中 Key 被修改</span></span>
<span class="line"><span>  ┌──────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  迁移某个 Key 到目标端后                           │</span></span>
<span class="line"><span>  │  源端又被修改了                                   │</span></span>
<span class="line"><span>  │  → 目标端数据是旧的                               │</span></span>
<span class="line"><span>  └──────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>问题4：TTL 不一致</span></span>
<span class="line"><span>  ┌──────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  迁移时 Key 的剩余 TTL 在目标端可能不同             │</span></span>
<span class="line"><span>  │  DUMP/RESTORE 会保留原始过期时间戳                  │</span></span>
<span class="line"><span>  │  但迁移耗时可能导致部分 Key 已过期                  │</span></span>
<span class="line"><span>  └──────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-一致性保障策略" tabindex="-1"><a class="header-anchor" href="#_8-2-一致性保障策略"><span>8.2 一致性保障策略</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>一致性保障策略：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>策略1：维护窗口 + 停写迁移</span></span>
<span class="line"><span>  ┌──────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  1. 通知业务方停写                                │</span></span>
<span class="line"><span>  │  2. 等待源端写入完成                              │</span></span>
<span class="line"><span>  │  3. 执行全量迁移                                  │</span></span>
<span class="line"><span>  │  4. 校验数据一致性                                │</span></span>
<span class="line"><span>  │  5. 切换到目标端                                  │</span></span>
<span class="line"><span>  │  6. 恢复写入                                     │</span></span>
<span class="line"><span>  │                                                    │</span></span>
<span class="line"><span>  │  优点：一致性有保证                                │</span></span>
<span class="line"><span>  │  缺点：需要停写，影响业务                          │</span></span>
<span class="line"><span>  └──────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>策略2：增量同步 + 切换</span></span>
<span class="line"><span>  ┌──────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  1. 全量同步（期间正常写入）                        │</span></span>
<span class="line"><span>  │  2. 增量同步（实时追平源端）                        │</span></span>
<span class="line"><span>  │  3. 短暂停写（&lt; 5秒）                              │</span></span>
<span class="line"><span>  │  4. 等待增量同步追平                               │</span></span>
<span class="line"><span>  │  5. 切换到目标端                                   │</span></span>
<span class="line"><span>  │  6. 恢复写入                                      │</span></span>
<span class="line"><span>  │                                                    │</span></span>
<span class="line"><span>  │  优点：停写时间极短                                │</span></span>
<span class="line"><span>  │  缺点：需要增量同步工具                            │</span></span>
<span class="line"><span>  └──────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>策略3：双写 + 对比</span></span>
<span class="line"><span>  ┌──────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  1. 应用层同时写源端和目标端                        │</span></span>
<span class="line"><span>  │  2. 全量迁移历史数据                               │</span></span>
<span class="line"><span>  │  3. 异步对比两端数据                                │</span></span>
<span class="line"><span>  │  4. 修复不一致数据                                 │</span></span>
<span class="line"><span>  │  5. 切换读取到目标端                                │</span></span>
<span class="line"><span>  │  6. 停止写源端                                     │</span></span>
<span class="line"><span>  │                                                    │</span></span>
<span class="line"><span>  │  优点：零停机                                     │</span></span>
<span class="line"><span>  │  缺点：实现复杂，双写有短暂不一致                   │</span></span>
<span class="line"><span>  └──────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-双写方案" tabindex="-1"><a class="header-anchor" href="#_9-双写方案"><span>9. 双写方案</span></a></h2><h3 id="_9-1-双写架构" tabindex="-1"><a class="header-anchor" href="#_9-1-双写架构"><span>9.1 双写架构</span></a></h3>`,29),i(d,{code:`eJxNkN1KAlEQx+99ioP34guEkR99aN1Edwcv+jAKhECNLtwgDNJEUXLFSvEjNEJpV0Fw08SX2Zld36KzZ0w8nIszM7/zn5n/Zfzm7vzqNJFiJ0EXE2eHg/aBuYk10G19gqNMlHk8PubnMFUt9QtEQnJ+mQ5weHrDaVnQ7Dh2cZ3cLAadolXXsJ116oH4bTIVSxARkEQobRpd0+g7IpWiOW9Yswo2G9v3kgkSI98h560sH+eYK0O+pbBdbi9UqDcpJlGCxDiU9FJv6I7scU9he9xta0OYV2GiwW8Gaz1Y1LbOEl6fE333zIUG3aJ7U0r0+/+9v+pHcdQlqQOO1SEWNdB/UFfN2QzyHfIrLGx8x0YLnwdYKpFD8FJYu0FdwpKNpEnFNB7s7Hi1fEQOAOVPhR1yGs00xHUQwkmCOHzVFXbEaT9sd5b9AlkZdf0B93zwKA==`}),o[3]||=n(`<h3 id="_9-2-c-双写实现" tabindex="-1"><a class="header-anchor" href="#_9-2-c-双写实现"><span>9.2 C# 双写实现</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 双写中间件</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> DualWriteRedisService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IDatabase</span><span style="color:#E06C75;"> _sourceDb</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IDatabase</span><span style="color:#E06C75;"> _targetDb</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> ILogger</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">DualWriteRedisService</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E06C75;">_logger</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> DualWriteRedisService</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        ConnectionMultiplexer</span><span style="color:#E5C07B;"> sourceConnection</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        ConnectionMultiplexer</span><span style="color:#E5C07B;"> targetConnection</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        ILogger</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">DualWriteRedisService</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">logger</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _sourceDb</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> sourceConnection</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetDatabase</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#E06C75;">        _targetDb</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> targetConnection</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetDatabase</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#E06C75;">        _logger</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> logger</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 双写 SET 操作</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">SetAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> key</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> value</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">TimeSpan</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">expiry</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 先写源端（主）</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> sourceResult</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_sourceDb</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringSetAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            key</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">value</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">expiry</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 再写目标端（从）</span></span>
<span class="line"><span style="color:#C678DD;">        try</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> targetResult</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_targetDb</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringSetAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">                key</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">value</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">expiry</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#56B6C2;">!</span><span style="color:#E06C75;">targetResult</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E5C07B;">                _logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">LogWarning</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#98C379;">                    &quot;目标端写入失败: Key={Key}&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#C678DD;">        catch</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">Exception</span><span style="color:#E06C75;"> ex</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 目标端写入失败不影响主流程</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 记录差异日志，异步修复</span></span>
<span class="line"><span style="color:#E5C07B;">            _logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">LogError</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ex</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">                &quot;目标端写入异常: Key={Key}&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> sourceResult</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 读取（优先从源端读取）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">?&gt; </span><span style="color:#61AFEF;">GetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> key</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_sourceDb</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringGetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 删除（双删）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">DeleteAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> key</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> sourceResult</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_sourceDb</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">KeyDeleteAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        try</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">_targetDb</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">KeyDeleteAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#C678DD;">        catch</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">Exception</span><span style="color:#E06C75;"> ex</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            _logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">LogError</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ex</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">                &quot;目标端删除异常: Key={Key}&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> sourceResult</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-数据校验工具" tabindex="-1"><a class="header-anchor" href="#_9-3-数据校验工具"><span>9.3 数据校验工具</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 数据一致性校验工具</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> DataConsistencyChecker</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IDatabase</span><span style="color:#E06C75;"> _sourceDb</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IDatabase</span><span style="color:#E06C75;"> _targetDb</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> ILogger</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">DataConsistencyChecker</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E06C75;">_logger</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> DataConsistencyChecker</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        ConnectionMultiplexer</span><span style="color:#E5C07B;"> sourceConnection</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        ConnectionMultiplexer</span><span style="color:#E5C07B;"> targetConnection</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        ILogger</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">DataConsistencyChecker</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">logger</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _sourceDb</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> sourceConnection</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetDatabase</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#E06C75;">        _targetDb</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> targetConnection</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetDatabase</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#E06C75;">        _logger</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> logger</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 校验指定 Key 的数据一致性</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">ConsistencyReport</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">CheckAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">keys</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> report</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">ConsistencyReport</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> keyList</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> keys</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ToList</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        foreach</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> key</span><span style="color:#C678DD;"> in</span><span style="color:#E06C75;"> keyList</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> sourceValue</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_sourceDb</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringGetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> targetValue</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_targetDb</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringGetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">sourceValue</span><span style="color:#56B6C2;"> !=</span><span style="color:#E06C75;"> targetValue</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E5C07B;">                report</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Inconsistencies</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Add</span><span style="color:#ABB2BF;">(new </span><span style="color:#E5C07B;">Inconsistency</span></span>
<span class="line"><span style="color:#ABB2BF;">                {</span></span>
<span class="line"><span style="color:#E06C75;">                    Key</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> key</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">                    SourceValue</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> sourceValue</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ToString</span><span style="color:#ABB2BF;">(),</span></span>
<span class="line"><span style="color:#E06C75;">                    TargetValue</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> targetValue</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ToString</span><span style="color:#ABB2BF;">(),</span></span>
<span class="line"><span style="color:#E06C75;">                    Type</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> sourceValue</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IsNullOrEmpty</span></span>
<span class="line"><span style="color:#ABB2BF;">                        ? </span><span style="color:#E5C07B;">InconsistencyType</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">SourceMissing</span></span>
<span class="line"><span style="color:#ABB2BF;">                        : </span><span style="color:#E5C07B;">targetValue</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IsNullOrEmpty</span></span>
<span class="line"><span style="color:#ABB2BF;">                            ? </span><span style="color:#E5C07B;">InconsistencyType</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">TargetMissing</span></span>
<span class="line"><span style="color:#ABB2BF;">                            : </span><span style="color:#E5C07B;">InconsistencyType</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ValueMismatch</span></span>
<span class="line"><span style="color:#ABB2BF;">                });</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#C678DD;">            else</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E5C07B;">                report</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ConsistentCount</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">        report</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">TotalChecked</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> keyList</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Count</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E5C07B;">        _logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">LogInformation</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#98C379;">            &quot;数据校验完成: 总计 {Total}, 一致 {Consistent}, 不一致 {Inconsistent}&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">            report</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">TotalChecked</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">report</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ConsistentCount</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">            report</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Inconsistencies</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Count</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> report</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> ConsistencyReport</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> int</span><span style="color:#ABB2BF;"> TotalChecked { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> int</span><span style="color:#ABB2BF;"> ConsistentCount { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> List</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">Inconsistency</span><span style="color:#ABB2BF;">&gt; Inconsistencies { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; } </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> new();</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> Inconsistency</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;"> Key { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; } </span><span style="color:#56B6C2;">=</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Empty</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;">? SourceValue { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;">? TargetValue { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#E5C07B;"> InconsistencyType</span><span style="color:#ABB2BF;"> Type { </span><span style="color:#C678DD;">get</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">set</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> enum</span><span style="color:#E5C07B;"> InconsistencyType</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#ABB2BF;">    ValueMismatch,</span></span>
<span class="line"><span style="color:#ABB2BF;">    SourceMissing,</span></span>
<span class="line"><span style="color:#ABB2BF;">    TargetMissing</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-回滚预案" tabindex="-1"><a class="header-anchor" href="#_10-回滚预案"><span>10. 回滚预案</span></a></h2><h3 id="_10-1-回滚策略" tabindex="-1"><a class="header-anchor" href="#_10-1-回滚策略"><span>10.1 回滚策略</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>┌──────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                    回滚预案设计                             │</span></span>
<span class="line"><span>├──────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  回滚级别1：迁移工具回滚                                    │</span></span>
<span class="line"><span>│  ┌──────────────────────────────────────────────────┐    │</span></span>
<span class="line"><span>│  │  触发条件：迁移过程中工具报错                       │    │</span></span>
<span class="line"><span>│  │  操作：停止迁移工具，清理目标端已迁移数据           │    │</span></span>
<span class="line"><span>│  │  恢复时间：&lt; 5 分钟                                │    │</span></span>
<span class="line"><span>│  └──────────────────────────────────────────────────┘    │</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  回滚级别2：切换前回滚                                      │</span></span>
<span class="line"><span>│  ┌──────────────────────────────────────────────────┐    │</span></span>
<span class="line"><span>│  │  触发条件：数据校验不一致率 &gt; 阈值                  │    │</span></span>
<span class="line"><span>│  │  操作：停止双写，继续使用源端                       │    │</span></span>
<span class="line"><span>│  │  恢复时间：&lt; 10 分钟                               │    │</span></span>
<span class="line"><span>│  └──────────────────────────────────────────────────┘    │</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  回滚级别3：切换后回滚                                      │</span></span>
<span class="line"><span>│  ┌──────────────────────────────────────────────────┐    │</span></span>
<span class="line"><span>│  │  触发条件：切换后发现严重问题                       │    │</span></span>
<span class="line"><span>│  │  操作：                                           │    │</span></span>
<span class="line"><span>│  │  1. 保留源端 7 天，期间可随时回切                  │    │</span></span>
<span class="line"><span>│  │  2. 将目标端新数据同步回源端                       │    │</span></span>
<span class="line"><span>│  │  3. 切换回源端                                    │    │</span></span>
<span class="line"><span>│  │  恢复时间：30分钟 - 2小时                          │    │</span></span>
<span class="line"><span>│  └──────────────────────────────────────────────────┘    │</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  回滚级别4：灾难级回滚                                      │</span></span>
<span class="line"><span>│  ┌──────────────────────────────────────────────────┐    │</span></span>
<span class="line"><span>│  │  触发条件：源端和目标端都不可用                     │    │</span></span>
<span class="line"><span>│  │  操作：                                           │    │</span></span>
<span class="line"><span>│  │  1. 从 RDB/AOF 备份恢复                           │    │</span></span>
<span class="line"><span>│  │  2. 重建 Redis 实例                               │    │</span></span>
<span class="line"><span>│  │  3. 恢复业务                                      │    │</span></span>
<span class="line"><span>│  │  恢复时间：1-4 小时                                │    │</span></span>
<span class="line"><span>│  └──────────────────────────────────────────────────┘    │</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-回滚检查清单" tabindex="-1"><a class="header-anchor" href="#_10-2-回滚检查清单"><span>10.2 回滚检查清单</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>回滚前检查清单：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>☐ 确认源端 Redis 仍在运行且数据完整</span></span>
<span class="line"><span>☐ 确认源端连接配置未删除</span></span>
<span class="line"><span>☐ 确认应用配置文件中有源端配置的备份</span></span>
<span class="line"><span>☐ 评估目标端新增数据量（需反向同步的数据量）</span></span>
<span class="line"><span>☐ 通知相关团队即将回滚</span></span>
<span class="line"><span>☐ 准备回滚操作脚本</span></span>
<span class="line"><span>☐ 准备回滚后的验证脚本</span></span>
<span class="line"><span>☐ 确认回滚窗口时间</span></span>
<span class="line"><span></span></span>
<span class="line"><span>回滚后验证：</span></span>
<span class="line"><span>☐ 验证源端连接正常</span></span>
<span class="line"><span>☐ 验证读写操作正常</span></span>
<span class="line"><span>☐ 验证数据完整性</span></span>
<span class="line"><span>☐ 监控错误率和延迟</span></span>
<span class="line"><span>☐ 通知相关团队回滚完成</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_11-总结" tabindex="-1"><a class="header-anchor" href="#_11-总结"><span>11. 总结</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>┌─────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                  数据迁移与扩容核心要点                         │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>│  扩容策略：                                                    │</span></span>
<span class="line"><span>│  🔹 内存不足 → 垂直扩容（主从切换）或 Cluster 水平扩展         │</span></span>
<span class="line"><span>│  🔹 QPS 不足 → Cluster 水平扩展                               │</span></span>
<span class="line"><span>│  🔹 读 QPS 不足 → 增加从节点                                  │</span></span>
<span class="line"><span>│  🔹 长期方案 → 预分片 + Cluster                               │</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>│  迁移工具：                                                    │</span></span>
<span class="line"><span>│  🔹 redis-shake（推荐）：全量+增量、校验、断点续传              │</span></span>
<span class="line"><span>│  🔹 redis-cli --cluster import：小数据量快速迁移               │</span></span>
<span class="line"><span>│  🔹 双写方案：零停机、实现复杂                                 │</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>│  一致性保障：                                                  │</span></span>
<span class="line"><span>│  🔹 停写迁移：一致性最强、有停机时间                           │</span></span>
<span class="line"><span>│  🔹 增量同步+切换：停写极短、需要工具支持                       │</span></span>
<span class="line"><span>│  🔹 双写+对比：零停机、实现复杂                               │</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>│  回滚预案：                                                    │</span></span>
<span class="line"><span>│  🔹 保留源端 7 天                                             │</span></span>
<span class="line"><span>│  🔹 分级回滚策略                                              │</span></span>
<span class="line"><span>│  🔹 回滚检查清单                                              │</span></span>
<span class="line"><span>│  🔹 提前演练                                                  │</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>│  关键原则：                                                    │</span></span>
<span class="line"><span>│  🔹 提前规划，避免被动扩容                                    │</span></span>
<span class="line"><span>│  🔹 低峰期执行迁移                                            │</span></span>
<span class="line"><span>│  🔹 灰度切换，不要一步到位                                    │</span></span>
<span class="line"><span>│  🔹 数据校验是必须的                                          │</span></span>
<span class="line"><span>│  🔹 始终有回滚方案                                            │</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container info"><p class="hint-container-title">参考文献</p><ul><li><a href="https://redis.io/docs/management/scaling/#resharding-the-cluster" target="_blank" rel="noopener noreferrer">Redis 官方文档 - Cluster Resharding</a></li><li><a href="https://github.com/tair-opensource/RedisShake" target="_blank" rel="noopener noreferrer">redis-shake GitHub</a></li><li><a href="https://github.com/vipshop/redis-migrate-tool" target="_blank" rel="noopener noreferrer">redis-migrate-tool GitHub</a></li><li>《Redis 开发与运维》- 付磊、张益军 - 第10章 集群扩容与缩容</li><li>《Redis 设计与实现》- 黄健宏</li></ul></div>`,12)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};