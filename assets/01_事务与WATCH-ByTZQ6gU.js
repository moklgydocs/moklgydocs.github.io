import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-D7E9GCrC.js";var o=JSON.parse(`{"path":"/%E5%90%8E%E7%AB%AF%E5%BC%80%E5%8F%91/Redis/07_%E9%AB%98%E7%BA%A7%E7%89%B9%E6%80%A7/01_%E4%BA%8B%E5%8A%A1%E4%B8%8EWATCH.html","title":"事务与 Lua 脚本","lang":"zh-CN","frontmatter":{"title":"事务与 Lua 脚本","icon":"fa6-solid:file-code","order":1,"category":["Redis"],"tag":["事务","MULTI","EXEC","WATCH","Lua","eval","evalsha","原子性","脚本"]},"git":{"createdTime":1780586585000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":19.94,"words":5983},"filePathRelative":"后端开发/Redis/07_高级特性/01_事务与WATCH.md"}`),s={name:`01_事务与WATCH.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="事务与-lua-脚本" tabindex="-1"><a class="header-anchor" href="#事务与-lua-脚本"><span>事务与 Lua 脚本</span></a></h1><blockquote><p>Redis 事务和 Lua 脚本是保证多条命令原子执行的两大机制。事务提供了命令打包执行的能力，但不支持回滚；Lua 脚本则在服务端执行自定义逻辑，天然具备原子性。理解它们的原理、差异和适用场景，是写出正确 Redis 程序的关键。</p></blockquote><h2 id="_1-redis-事务基础" tabindex="-1"><a class="header-anchor" href="#_1-redis-事务基础"><span>1. Redis 事务基础</span></a></h2><h3 id="_1-1-事务命令总览" tabindex="-1"><a class="header-anchor" href="#_1-1-事务命令总览"><span>1.1 事务命令总览</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Redis 事务相关命令：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────┬─────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  命令     │  作用                                        │</span></span>
<span class="line"><span>├──────────┼─────────────────────────────────────────────┤</span></span>
<span class="line"><span>│  MULTI   │  开启事务，后续命令入队                       │</span></span>
<span class="line"><span>│  EXEC    │  执行事务中所有命令                           │</span></span>
<span class="line"><span>│  DISCARD │  放弃事务，清空命令队列                       │</span></span>
<span class="line"><span>│  WATCH   │  监视 Key，若被修改则事务放弃                  │</span></span>
<span class="line"><span>│  UNWATCH │  取消所有 WATCH 监视                          │</span></span>
<span class="line"><span>└──────────┴─────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>事务生命周期：</span></span>
<span class="line"><span>  WATCH key [key ...]     ← 可选，乐观锁</span></span>
<span class="line"><span>  MULTI                   ← 开启事务</span></span>
<span class="line"><span>  command1                ← 命令入队（不执行）</span></span>
<span class="line"><span>  command2                ← 命令入队</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  EXEC / DISCARD          ← 提交 / 放弃</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-基本事务流程" tabindex="-1"><a class="header-anchor" href="#_1-2-基本事务流程"><span>1.2 基本事务流程</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>正常执行流程：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>客户端                        Redis Server</span></span>
<span class="line"><span>  │                               │</span></span>
<span class="line"><span>  │──── MULTI ───────────────────▶│  开启事务</span></span>
<span class="line"><span>  │                               │</span></span>
<span class="line"><span>  │──── SET key1 &quot;hello&quot; ────────▶│  命令入队，返回 QUEUED</span></span>
<span class="line"><span>  │◀─── QUEUED ──────────────────│</span></span>
<span class="line"><span>  │                               │</span></span>
<span class="line"><span>  │──── SET key2 &quot;world&quot; ────────▶│  命令入队，返回 QUEUED</span></span>
<span class="line"><span>  │◀─── QUEUED ──────────────────│</span></span>
<span class="line"><span>  │                               │</span></span>
<span class="line"><span>  │──── INCR counter ───────────▶│  命令入队，返回 QUEUED</span></span>
<span class="line"><span>  │◀─── QUEUED ──────────────────│</span></span>
<span class="line"><span>  │                               │</span></span>
<span class="line"><span>  │──── EXEC ────────────────────▶│  依次执行所有命令</span></span>
<span class="line"><span>  │◀─── [OK, OK, 1] ────────────│  返回所有结果</span></span>
<span class="line"><span>  │                               │</span></span>
<span class="line"><span></span></span>
<span class="line"><span>放弃事务流程：</span></span>
<span class="line"><span>  MULTI → SET key1 &quot;x&quot; → DISCARD → 事务清空，key1 不变</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-事务中的错误处理" tabindex="-1"><a class="header-anchor" href="#_1-3-事务中的错误处理"><span>1.3 事务中的错误处理</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Redis 事务错误分为两类：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>一、命令语法错误（入队时检测）：</span></span>
<span class="line"><span>  MULTI</span></span>
<span class="line"><span>  SET key1 &quot;hello&quot;</span></span>
<span class="line"><span>  INCR key1          ← 语法正确，入队成功</span></span>
<span class="line"><span>  INCRBY key2 &quot;abc&quot;  ← 语法正确，入队成功（类型错误运行时才发现）</span></span>
<span class="line"><span>  ZADD key3          ← 语法错误！入队失败</span></span>
<span class="line"><span>  EXEC</span></span>
<span class="line"><span>  → 返回：(error) EXECABORT Transaction discarded because of previous errors.</span></span>
<span class="line"><span>  → 所有命令都不执行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>二、运行时错误（EXEC 后检测）：</span></span>
<span class="line"><span>  MULTI</span></span>
<span class="line"><span>  SET key1 &quot;hello&quot;</span></span>
<span class="line"><span>  INCR key1          ← key1 是字符串，INCR 会失败</span></span>
<span class="line"><span>  SET key2 &quot;world&quot;</span></span>
<span class="line"><span>  EXEC</span></span>
<span class="line"><span>  → 返回：</span></span>
<span class="line"><span>    1) OK                    ← SET key1 成功</span></span>
<span class="line"><span>    2) (error) ERR value is not an integer or out of range  ← INCR 失败</span></span>
<span class="line"><span>    3) OK                    ← SET key2 成功！</span></span>
<span class="line"><span>  → 只有错误命令失败，其他命令照常执行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  重要特性：Redis 事务不支持回滚！                       │</span></span>
<span class="line"><span>│                                                       │</span></span>
<span class="line"><span>│  1. 语法错误 → 整个事务放弃（EXECABORT）                │</span></span>
<span class="line"><span>│  2. 运行时错误 → 仅错误命令失败，其他继续执行            │</span></span>
<span class="line"><span>│  3. 没有ROLLBACK命令                                  │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-4-事务不回滚的原因" tabindex="-1"><a class="header-anchor" href="#_1-4-事务不回滚的原因"><span>1.4 事务不回滚的原因</span></a></h3><div class="hint-container important"><p class="hint-container-title">为什么 Redis 不支持事务回滚？</p><p>Redis 官方给出的理由：</p><ol><li><strong>Redis 命令只会因语法错误或类型错误而失败</strong>：这本质上是编程错误，应该在开发阶段被发现，而不是依赖运行时回滚来兜底</li><li><strong>回滚需要额外的日志和状态管理</strong>：Redis 追求极简和性能，不支持回滚使事务实现更简单、更快速</li><li><strong>Redis 的设计哲学</strong>：错误应该在开发时修复，而不是运行时补救。这与传统数据库的设计哲学不同</li></ol><p>这种设计是有意为之的权衡 —— 牺牲回滚能力换取更简单、更快速的事务实现。</p></div><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>传统数据库 vs Redis 事务对比：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────┬──────────────────────┬──────────────────────┐</span></span>
<span class="line"><span>│  特性         │  传统数据库事务        │  Redis 事务            │</span></span>
<span class="line"><span>├──────────────┼──────────────────────┼──────────────────────┤</span></span>
<span class="line"><span>│  原子性       │  全部成功或全部回滚    │  仅&quot;不可打断&quot;，不回滚  │</span></span>
<span class="line"><span>│  一致性       │  ACID 保证           │  不保证（无回滚）      │</span></span>
<span class="line"><span>│  隔离性       │  多级隔离级别         │  无隔离级别            │</span></span>
<span class="line"><span>│  持久性       │  WAL 保证            │  依赖持久化配置        │</span></span>
<span class="line"><span>│  回滚         │  支持 ROLLBACK       │  不支持               │</span></span>
<span class="line"><span>│  冲突检测     │  锁 / MVCC           │  WATCH 乐观锁         │</span></span>
<span class="line"><span>│  适用范围     │  复杂业务逻辑        │  简单原子操作          │</span></span>
<span class="line"><span>└──────────────┴──────────────────────┴──────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-watch-乐观锁详解" tabindex="-1"><a class="header-anchor" href="#_2-watch-乐观锁详解"><span>2. WATCH 乐观锁详解</span></a></h2><h3 id="_2-1-watch-机制原理" tabindex="-1"><a class="header-anchor" href="#_2-1-watch-机制原理"><span>2.1 WATCH 机制原理</span></a></h3>`,14),i(d,{code:`eJwrTi0sTc1LTnXJTEwvSszlUgCCgsSikszkzILEvBIFZ0OFxGKFp+sWPevY/nz1ekMMBUEg+aDUlMxiTL1GKHqNuMAqnA117eyCrBTCHUOcPRSSEnMSgdaDZfzyS1IV8stSixSA0s8WtL9YtwEmr/B8Vsvzzo5nc9Y87d9ua2hggGKUb6hPiCeKSLBrCFwrULUB1GojTFlTqFkolsMkXyxa/WT/umdTdr7f04NsvSGqV1wjXJ2x+GBxw7Ot3U87kDwBMwLoJkOFR50LQG4DawzSBZrkbGiloJGXmaOp8GRX99Ouhc+m7Hu6p/n9nkY0s0Hqnuyd+XLR3GdzVj3tn/Fkxy6IJwFQ5aqs`}),o[1]||=n(`<h3 id="_2-2-watch-实现原理-cas" tabindex="-1"><a class="header-anchor" href="#_2-2-watch-实现原理-cas"><span>2.2 WATCH 实现原理（CAS）</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>WATCH 的底层实现 —— 乐观锁（Compare-And-Swap）：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. WATCH 阶段：</span></span>
<span class="line"><span>   ┌─────────────────────────────────────────────┐</span></span>
<span class="line"><span>   │  客户端调用 WATCH key                        │</span></span>
<span class="line"><span>   │  Redis 记录：                                │</span></span>
<span class="line"><span>   │    watched_keys[key] = [client1, client2]    │</span></span>
<span class="line"><span>   │    客户端记录：key 的当前版本（修改时间戳）     │</span></span>
<span class="line"><span>   └─────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 监视期间：</span></span>
<span class="line"><span>   ┌─────────────────────────────────────────────┐</span></span>
<span class="line"><span>   │  任何客户端修改 key                          │</span></span>
<span class="line"><span>   │  Redis 遍历 watched_keys[key]                │</span></span>
<span class="line"><span>   │  标记所有监视该 key 的客户端为 REDIS_DIRTY    │</span></span>
<span class="line"><span>   │  即：flags |= CLIENT_DIRTY_CAS               │</span></span>
<span class="line"><span>   └─────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. EXEC 检查：</span></span>
<span class="line"><span>   ┌─────────────────────────────────────────────┐</span></span>
<span class="line"><span>   │  EXEC 时检查客户端的 CLIENT_DIRTY_CAS 标志    │</span></span>
<span class="line"><span>   │  如果被设置 → 放弃事务，返回 nil              │</span></span>
<span class="line"><span>   │  如果未设置 → 执行事务，返回结果数组           │</span></span>
<span class="line"><span>   └─────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>源码关键（t_string.c / multi.c）：</span></span>
<span class="line"><span>  void watchForKey(client *c, robj *key) {</span></span>
<span class="line"><span>      list *clients = dictFetchValue(c-&gt;db-&gt;watched_keys, key);</span></span>
<span class="line"><span>      // 将客户端添加到 key 的监视列表</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void touchWatchedKey(redisDb *db, robj *key) {</span></span>
<span class="line"><span>      list *clients = dictFetchValue(db-&gt;watched_keys, key);</span></span>
<span class="line"><span>      listIter li; listNode *ln;</span></span>
<span class="line"><span>      listRewind(clients, &amp;li);</span></span>
<span class="line"><span>      while ((ln = listNext(&amp;li))) {</span></span>
<span class="line"><span>          client *c = listNodeValue(ln);</span></span>
<span class="line"><span>          c-&gt;flags |= CLIENT_DIRTY_CAS;  // 标记为脏</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-watch-实战-安全转账" tabindex="-1"><a class="header-anchor" href="#_2-3-watch-实战-安全转账"><span>2.3 WATCH 实战：安全转账</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// C# WATCH 实现安全转账</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> RedisTransferService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> ConnectionMultiplexer</span><span style="color:#E06C75;"> _connection</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IDatabase</span><span style="color:#E06C75;"> _db</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> RedisTransferService</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">ConnectionMultiplexer</span><span style="color:#E5C07B;"> connection</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _connection</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> connection</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _db</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> connection</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetDatabase</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 安全转账（使用 WATCH 乐观锁）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">TransferAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> fromAccount</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> toAccount</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#C678DD;">        decimal</span><span style="color:#E5C07B;"> amount</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#C678DD;">        int</span><span style="color:#E5C07B;"> maxRetries</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 10</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        for</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">int</span><span style="color:#E06C75;"> attempt</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">attempt</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> maxRetries</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">attempt</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // Step 1: WATCH 监视转出账户</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> tran</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">CreateTransaction</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#E5C07B;">            tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddCondition</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Condition</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">KeyNotExists</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">fromAccount</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">                .</span><span style="color:#61AFEF;">Or</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Condition</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringEqual</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">                    fromAccount</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">                    await </span><span style="color:#E5C07B;">_db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringGetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">fromAccount</span><span style="color:#ABB2BF;">))));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 这里用 Condition 模拟 WATCH</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // StackExchange.Redis 的 Condition 机制等价于 WATCH</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> fromValue</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringGetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">fromAccount</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> toValue</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringGetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">toAccount</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            decimal</span><span style="color:#E06C75;"> fromBalance</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">decimal</span><span style="color:#ABB2BF;">)(</span><span style="color:#C678DD;">double</span><span style="color:#ABB2BF;">)</span><span style="color:#E06C75;">fromValue</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            decimal</span><span style="color:#E06C75;"> toBalance</span><span style="color:#56B6C2;"> =</span><span style="color:#C678DD;"> string</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">IsNullOrEmpty</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">toValue</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">                ? </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;"> : (</span><span style="color:#C678DD;">decimal</span><span style="color:#ABB2BF;">)(</span><span style="color:#C678DD;">double</span><span style="color:#ABB2BF;">)</span><span style="color:#E06C75;">toValue</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // Step 2: 检查余额</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">fromBalance</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> amount</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">                return</span><span style="color:#D19A66;"> false</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // Step 3: 设置事务操作</span></span>
<span class="line"><span style="color:#C678DD;">            decimal</span><span style="color:#E06C75;"> newFromBalance</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> fromBalance</span><span style="color:#56B6C2;"> -</span><span style="color:#E06C75;"> amount</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            decimal</span><span style="color:#E06C75;"> newToBalance</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> toBalance</span><span style="color:#56B6C2;"> +</span><span style="color:#E06C75;"> amount</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">            tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringSetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">fromAccount</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">newFromBalance</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ToString</span><span style="color:#ABB2BF;">());</span></span>
<span class="line"><span style="color:#E5C07B;">            tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringSetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">toAccount</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">newToBalance</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ToString</span><span style="color:#ABB2BF;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // Step 4: 提交事务（如果 WATCH 的 Key 未被修改则成功）</span></span>
<span class="line"><span style="color:#C678DD;">            bool</span><span style="color:#E06C75;"> committed</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ExecuteAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">committed</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // 所有异步操作会在 Execute 成功后自动执行</span></span>
<span class="line"><span style="color:#ABB2BF;">                await </span><span style="color:#E5C07B;">tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringSetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">fromAccount</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">                    newFromBalance</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ToString</span><span style="color:#ABB2BF;">());</span></span>
<span class="line"><span style="color:#ABB2BF;">                await </span><span style="color:#E5C07B;">tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringSetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">toAccount</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">                    newToBalance</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ToString</span><span style="color:#ABB2BF;">());</span></span>
<span class="line"><span style="color:#C678DD;">                return</span><span style="color:#D19A66;"> true</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // WATCH 失败，重试</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">Task</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Delay</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">10</span><span style="color:#56B6C2;"> *</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">attempt</span><span style="color:#56B6C2;"> +</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> false</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-watch-注意事项" tabindex="-1"><a class="header-anchor" href="#_2-4-watch-注意事项"><span>2.4 WATCH 注意事项</span></a></h3><div class="hint-container warning"><p class="hint-container-title">WATCH 使用要点</p><ol><li><strong>WATCH 必须在 MULTI 之前调用</strong>：WATCH 在事务内部调用无效</li><li><strong>WATCH 是一次性的</strong>：EXEC 执行后（无论成功或失败），所有 WATCH 自动取消</li><li><strong>UNWATCH 主动取消</strong>：在 EXEC 之前可调用 UNWATCH 取消监视</li><li><strong>整个 Key 变更都会触发</strong>：对 WATCH 的 Key 执行任何修改命令（SET/DEL/INCR 等）都会使事务放弃</li><li><strong>不支持细粒度监视</strong>：无法监视 Key 的某个字段，只能监视整个 Key</li><li><strong>网络断开自动取消</strong>：客户端断开连接时，所有 WATCH 自动取消</li></ol></div><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>WATCH 失效场景汇总：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景1：其他客户端修改了被 WATCH 的 Key</span></span>
<span class="line"><span>  客户端A: WATCH key → MULTI → SET key &quot;new&quot; → EXEC → (nil) 事务放弃</span></span>
<span class="line"><span>  客户端B: SET key &quot;changed&quot; ← 在 A 的 MULTI 和 EXEC 之间执行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景2：DISCARD 后 WATCH 仍然存在</span></span>
<span class="line"><span>  WATCH key → MULTI → DISCARD → WATCH 仍然有效</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景3：EXEC 后 WATCH 自动清除</span></span>
<span class="line"><span>  WATCH key → MULTI → SET key &quot;new&quot; → EXEC → WATCH 已清除</span></span>
<span class="line"><span>  此时其他客户端可以修改 key，不影响当前客户端</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景4：WATCH 后 Key 被删除</span></span>
<span class="line"><span>  WATCH key → DEL key → MULTI → SET key &quot;new&quot; → EXEC → (nil) 事务放弃</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-redis-事务-vs-数据库事务" tabindex="-1"><a class="header-anchor" href="#_3-redis-事务-vs-数据库事务"><span>3. Redis 事务 vs 数据库事务</span></a></h2><h3 id="_3-1-acid-特性对比" tabindex="-1"><a class="header-anchor" href="#_3-1-acid-特性对比"><span>3.1 ACID 特性对比</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>┌──────────┬─────────────────────────────┬──────────────────────────────┐</span></span>
<span class="line"><span>│  ACID    │  Redis 事务                   │  关系型数据库事务               │</span></span>
<span class="line"><span>├──────────┼─────────────────────────────┼──────────────────────────────┤</span></span>
<span class="line"><span>│  A 原子性 │  部分：命令不可打断执行        │  完全：全部成功或全部回滚       │</span></span>
<span class="line"><span>│          │  但不支持回滚                  │                              │</span></span>
<span class="line"><span>├──────────┼─────────────────────────────┼──────────────────────────────┤</span></span>
<span class="line"><span>│  C 一致性 │  部分：取决于命令正确性        │  完全：约束、触发器保证        │</span></span>
<span class="line"><span>│          │  运行时错误不回滚              │                              │</span></span>
<span class="line"><span>├──────────┼─────────────────────────────┼──────────────────────────────┤</span></span>
<span class="line"><span>│  I 隔离性 │  无隔离级别                   │  多级隔离（RU/RC/RR/Serializable）│</span></span>
<span class="line"><span>│          │  EXEC 前命令不可见             │                              │</span></span>
<span class="line"><span>├──────────┼─────────────────────────────┼──────────────────────────────┤</span></span>
<span class="line"><span>│  D 持久性 │  依赖持久化配置               │  WAL + Commit Log 保证       │</span></span>
<span class="line"><span>│          │  AOF everysec 可丢 1s 数据    │                              │</span></span>
<span class="line"><span>└──────────┴─────────────────────────────┴──────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>结论：Redis 事务严格来说不满足 ACID 中的任何一条完整特性。</span></span>
<span class="line"><span>它的价值在于&quot;将多条命令打包，不被其他客户端命令打断&quot;。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-隔离性问题" tabindex="-1"><a class="header-anchor" href="#_3-2-隔离性问题"><span>3.2 隔离性问题</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Redis 事务没有隔离级别：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>事务开启后、EXEC 执行前：</span></span>
<span class="line"><span>  ┌──────────┐                    ┌──────────────┐</span></span>
<span class="line"><span>  │ 客户端 A  │                    │  Redis Server │</span></span>
<span class="line"><span>  └────┬─────┘                    └──────┬───────┘</span></span>
<span class="line"><span>       │  MULTI                          │</span></span>
<span class="line"><span>       │  SET key1 &quot;a&quot; ───── 入队 ──────▶│</span></span>
<span class="line"><span>       │  SET key2 &quot;b&quot; ───── 入队 ──────▶│</span></span>
<span class="line"><span>       │                                  │</span></span>
<span class="line"><span>  ┌────┴─────┐                            │</span></span>
<span class="line"><span>  │ 客户端 B  │                            │</span></span>
<span class="line"><span>  └────┬─────┘                            │</span></span>
<span class="line"><span>       │  GET key1 ──── 立即返回 &quot;old&quot; ──▶│  ← key1 还没被修改！</span></span>
<span class="line"><span>       │                                  │</span></span>
<span class="line"><span>  客户端 A 的命令还未执行，客户端 B 读到的是旧值</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ┌────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  Redis 事务的&quot;隔离&quot;仅保证：                      │</span></span>
<span class="line"><span>  │  EXEC 执行时，所有命令顺序执行，中间不插入其他命令  │</span></span>
<span class="line"><span>  │  但 EXEC 之前，其他客户端可以随意读写              │</span></span>
<span class="line"><span>  └────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-lua-脚本详解" tabindex="-1"><a class="header-anchor" href="#_4-lua-脚本详解"><span>4. Lua 脚本详解</span></a></h2><h3 id="_4-1-为什么需要-lua-脚本" tabindex="-1"><a class="header-anchor" href="#_4-1-为什么需要-lua-脚本"><span>4.1 为什么需要 Lua 脚本</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>事务 vs Lua 脚本：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌───────────────────┬──────────────────┬──────────────────┐</span></span>
<span class="line"><span>│  特性              │  事务 (MULTI)     │  Lua 脚本         │</span></span>
<span class="line"><span>├───────────────────┼──────────────────┼──────────────────┤</span></span>
<span class="line"><span>│  原子性           │  命令不可打断     │  整个脚本不可打断  │</span></span>
<span class="line"><span>│  条件逻辑         │  不支持           │  完全支持          │</span></span>
<span class="line"><span>│  读取中间结果     │  不支持           │  支持              │</span></span>
<span class="line"><span>│  循环             │  不支持           │  支持              │</span></span>
<span class="line"><span>│  错误处理         │  不支持回滚       │  pcall 异常捕获    │</span></span>
<span class="line"><span>│  复用性           │  无              │  evalsha 复用      │</span></span>
<span class="line"><span>│  网络开销         │  多次 RTT        │  一次 RTT          │</span></span>
<span class="line"><span>│  复杂业务         │  难以实现        │  完整编程能力       │</span></span>
<span class="line"><span>└───────────────────┴──────────────────┴──────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Lua 脚本核心优势：</span></span>
<span class="line"><span>  1. 原子性 —— 脚本执行期间，Redis 不会执行其他命令</span></span>
<span class="line"><span>  2. 减少网络开销 —— 复杂逻辑一次提交</span></span>
<span class="line"><span>  3. 可复用 —— evalsha 避免重复传输脚本</span></span>
<span class="line"><span>  4. 完整编程能力 —— 条件、循环、函数</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-eval-与-evalsha" tabindex="-1"><a class="header-anchor" href="#_4-2-eval-与-evalsha"><span>4.2 eval 与 evalsha</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>EVAL 命令语法：</span></span>
<span class="line"><span>  EVAL script numkeys key [key ...] arg [arg ...]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>参数说明：</span></span>
<span class="line"><span>  script   - Lua 脚本代码</span></span>
<span class="line"><span>  numkeys  - Key 的数量</span></span>
<span class="line"><span>  key      - Key 参数（通过 KEYS 数组访问）</span></span>
<span class="line"><span>  arg      - 附加参数（通过 ARGV 数组访问）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例：</span></span>
<span class="line"><span>  EVAL &quot;return redis.call(&#39;SET&#39;, KEYS[1], ARGV[1])&quot; 1 mykey myvalue</span></span>
<span class="line"><span>       │                                         │ │     │</span></span>
<span class="line"><span>       │  Lua 脚本代码                             │ │     └─ ARGV[1] = &quot;myvalue&quot;</span></span>
<span class="line"><span>       │                                          │ └─────── KEYS[1] = &quot;mykey&quot;</span></span>
<span class="line"><span>       │                                          └───────── numkeys = 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EVALSHA 命令语法：</span></span>
<span class="line"><span>  EVALSHA sha1 numkeys key [key ...] arg [arg ...]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  用脚本的 SHA1 校验和代替完整脚本，减少网络传输</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  步骤：</span></span>
<span class="line"><span>  1. 先 SCRIPT LOAD &quot;脚本&quot; → 返回 sha1</span></span>
<span class="line"><span>  2. 再 EVALSHA sha1 numkeys key arg</span></span>
<span class="line"><span>  3. 如果 sha1 不存在，返回 NOSCRIPT 错误，需重新 EVAL</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-lua-执行流程" tabindex="-1"><a class="header-anchor" href="#_4-3-lua-执行流程"><span>4.3 Lua 执行流程</span></a></h3>`,18),i(d,{code:`eJxdUE1LAlEU3fcrLu5F2kYYfjs6aTRqxODCgmgRBFK0cAKDLAv78IPRahBHoiLTaWXBKP2XmPfmzb9o5r0hrbd4HLjnnHvP2dnbP9reLRQPIBNeAPsFRDTq4+qHOdDQTd0qn0AkF+B9zifEA3nwev0QLJHTe6y8mZMmGnaMzyHuaOj2ycZIeVk5pj5Bhyk5siUwJzLR6kwjQUgkI9UctcH2WwTcU63XGmrU8v9k9lSCcImSbNvfXa5/mBLtxRJEREO/ZnN02SPTKdvEDBnPvk6CqEi+WuihC6m0EFrn1jJgte6IpjFilEaLzeJb51dYfp8rgfFilBeiOERxXGTLWaDvswbMHxChHE7EF89ErQF/WPgzjrMxxRzFCbddVioZV3B77IZOzMIk3TDM1tSbuKswR0aizfCix40czAqbbtzlraLPjypjQ5dRfWroj6Q/sDo6UrseZsDTM1ZFj6WUwW0qyfE84KpMxUI8mwmnN1JOkYFcxJb9AA3o/04=`}),o[2]||=n(`<h3 id="_4-4-lua-脚本中调用-redis" tabindex="-1"><a class="header-anchor" href="#_4-4-lua-脚本中调用-redis"><span>4.4 Lua 脚本中调用 Redis</span></a></h3><div class="language-lua line-numbers-mode" data-highlighter="shiki" data-ext="lua" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-lua"><span class="line"><span style="color:#7F848E;font-style:italic;">-- Lua 脚本中调用 Redis 命令的两种方式</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 方式1: redis.call —— 出错时直接抛出异常</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> value</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;GET&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">])</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 如果 GET 命令出错，脚本终止，返回错误</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 方式2: redis.pcall —— 出错时返回错误对象</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> result</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">pcall</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;GET&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">])</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 如果 GET 命令出错，result 是一个 error 对象</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 脚本继续执行，可以检查 result.err</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 判断 pcall 返回是否为错误</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#56B6C2;"> type</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">result</span><span style="color:#ABB2BF;">) == </span><span style="color:#98C379;">&#39;table&#39; </span><span style="color:#56B6C2;">and</span><span style="color:#E06C75;"> result</span><span style="color:#ABB2BF;">.err </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    -- 处理错误</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#E06C75;"> result</span><span style="color:#ABB2BF;">.err</span></span>
<span class="line"><span style="color:#C678DD;">end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 常用 Redis 调用示例</span></span>
<span class="line"><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;SET&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">], </span><span style="color:#E06C75;">ARGV</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">])           </span><span style="color:#7F848E;font-style:italic;">-- 设置值</span></span>
<span class="line"><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;EXPIRE&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">], </span><span style="color:#E06C75;">ARGV</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">])         </span><span style="color:#7F848E;font-style:italic;">-- 设置过期时间</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> exists</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;EXISTS&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">])   </span><span style="color:#7F848E;font-style:italic;">-- 判断存在</span></span>
<span class="line"><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;DEL&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">])                     </span><span style="color:#7F848E;font-style:italic;">-- 删除</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> len</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;LLEN&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">])        </span><span style="color:#7F848E;font-style:italic;">-- 列表长度</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-5-实战脚本示例" tabindex="-1"><a class="header-anchor" href="#_4-5-实战脚本示例"><span>4.5 实战脚本示例</span></a></h3><h4 id="_4-5-1-限流器" tabindex="-1"><a class="header-anchor" href="#_4-5-1-限流器"><span>4.5.1 限流器</span></a></h4><div class="language-lua line-numbers-mode" data-highlighter="shiki" data-ext="lua" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-lua"><span class="line"><span style="color:#7F848E;font-style:italic;">-- 滑动窗口限流器</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- KEYS[1] = 限流 Key</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ARGV[1] = 窗口大小（秒）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ARGV[2] = 最大请求数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ARGV[3] = 当前时间戳（毫秒）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 返回: 1=允许, 0=拒绝</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> key</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> window</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">tonumber</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ARGV</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">])</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> limit</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">tonumber</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ARGV</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">])</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> now</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">tonumber</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ARGV</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;">])</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> window_start</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">now</span><span style="color:#ABB2BF;"> - </span><span style="color:#E06C75;">window</span><span style="color:#ABB2BF;"> * </span><span style="color:#D19A66;">1000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 移除窗口外的旧记录</span></span>
<span class="line"><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;ZREMRANGEBYSCORE&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;-inf&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">window_start</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 统计当前窗口内的请求数</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> count</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;ZCARD&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#E06C75;"> count</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#E06C75;">limit</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    -- 未超限，添加当前请求</span></span>
<span class="line"><span style="color:#E06C75;">    redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;ZADD&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">now</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">now</span><span style="color:#ABB2BF;"> .. </span><span style="color:#98C379;">&#39;-&#39; </span><span style="color:#ABB2BF;">.. </span><span style="color:#56B6C2;">math.random</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">1000000</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#E06C75;">    redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;EXPIRE&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">window</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    -- 超限，拒绝</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">end</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-5-2-分布式锁释放" tabindex="-1"><a class="header-anchor" href="#_4-5-2-分布式锁释放"><span>4.5.2 分布式锁释放</span></a></h4><div class="language-lua line-numbers-mode" data-highlighter="shiki" data-ext="lua" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-lua"><span class="line"><span style="color:#7F848E;font-style:italic;">-- 安全释放分布式锁</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- KEYS[1] = 锁 Key</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ARGV[1] = 持有者的唯一标识</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 返回: 1=释放成功, 0=不是锁的持有者</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#E06C75;"> redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;GET&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">]) == </span><span style="color:#E06C75;">ARGV</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">] </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#E06C75;"> redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;DEL&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">])</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">end</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-5-3-库存扣减" tabindex="-1"><a class="header-anchor" href="#_4-5-3-库存扣减"><span>4.5.3 库存扣减</span></a></h4><div class="language-lua line-numbers-mode" data-highlighter="shiki" data-ext="lua" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-lua"><span class="line"><span style="color:#7F848E;font-style:italic;">-- 安全库存扣减</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- KEYS[1] = 库存 Key</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ARGV[1] = 扣减数量</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 返回: 剩余库存 / -1=库存不足 / -2=库存Key不存在</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> stock_key</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> decrement</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">tonumber</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ARGV</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 检查 Key 是否存在</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#E06C75;"> redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;EXISTS&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">stock_key</span><span style="color:#ABB2BF;">) == </span><span style="color:#D19A66;">0</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#ABB2BF;"> -</span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#C678DD;">end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 获取当前库存</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> current</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">tonumber</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;GET&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">stock_key</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#E06C75;"> current</span><span style="color:#ABB2BF;"> == </span><span style="color:#D19A66;">nil</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#ABB2BF;"> -</span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#C678DD;">end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 库存不足</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#E06C75;"> current</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#E06C75;">decrement</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#ABB2BF;"> -</span><span style="color:#D19A66;">1</span></span>
<span class="line"><span style="color:#C678DD;">end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 扣减库存</span></span>
<span class="line"><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;DECRBY&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">stock_key</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">decrement</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">return</span><span style="color:#E06C75;"> current</span><span style="color:#ABB2BF;"> - </span><span style="color:#E06C75;">decrement</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-5-4-列表去重添加" tabindex="-1"><a class="header-anchor" href="#_4-5-4-列表去重添加"><span>4.5.4 列表去重添加</span></a></h4><div class="language-lua line-numbers-mode" data-highlighter="shiki" data-ext="lua" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-lua"><span class="line"><span style="color:#7F848E;font-style:italic;">-- 有序列表去重添加</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- KEYS[1] = 列表 Key</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- KEYS[2] = 去重集合 Key</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ARGV[1] = 要添加的元素</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 返回: 1=添加成功, 0=已存在</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> list_key</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> set_key</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> element</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ARGV</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 检查是否已存在</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#E06C75;"> redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;SISMEMBER&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">set_key</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">element</span><span style="color:#ABB2BF;">) == </span><span style="color:#D19A66;">1</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 添加到列表和集合</span></span>
<span class="line"><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;RPUSH&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">list_key</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">element</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;SADD&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">set_key</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">element</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">return</span><span style="color:#D19A66;"> 1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-6-script-命令" tabindex="-1"><a class="header-anchor" href="#_4-6-script-命令"><span>4.6 SCRIPT 命令</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>SCRIPT 命令集：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────────────┬───────────────────────────────────┐</span></span>
<span class="line"><span>│  命令                 │  作用                              │</span></span>
<span class="line"><span>├──────────────────────┼───────────────────────────────────┤</span></span>
<span class="line"><span>│  SCRIPT LOAD script  │  加载脚本到缓存，返回 SHA1          │</span></span>
<span class="line"><span>│  SCRIPT EXISTS sha1  │  检查脚本是否在缓存中               │</span></span>
<span class="line"><span>│  SCRIPT FLUSH        │  清除所有脚本缓存                   │</span></span>
<span class="line"><span>│  SCRIPT KILL         │  终止当前正在执行的脚本              │</span></span>
<span class="line"><span>│  SCRIPT DEBUG YES    │  开启调试模式                      │</span></span>
<span class="line"><span>│  SCRIPT DEBUG NO     │  关闭调试模式                      │</span></span>
<span class="line"><span>│  SCRIPT DEBUG SYNC   │  同步调试模式                      │</span></span>
<span class="line"><span>└──────────────────────┴───────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>使用示例：</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 加载脚本</span></span>
<span class="line"><span>&gt; SCRIPT LOAD &quot;return redis.call(&#39;GET&#39;, KEYS[1])&quot;</span></span>
<span class="line"><span>&quot;4e6d8fc8bb01276eb62f5a6bb0520368a54c2b90&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 检查脚本是否存在</span></span>
<span class="line"><span>&gt; SCRIPT EXISTS 4e6d8fc8bb01276eb62f5a6bb0520368a54c2b90</span></span>
<span class="line"><span>1) (integer) 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 使用 EVALSHA 执行</span></span>
<span class="line"><span>&gt; EVALSHA 4e6d8fc8bb01276eb62f5a6bb0520368a54c2b90 1 mykey</span></span>
<span class="line"><span>&quot;hello&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 清除缓存</span></span>
<span class="line"><span>&gt; SCRIPT FLUSH</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 终止脚本（脚本执行超时时使用）</span></span>
<span class="line"><span>&gt; SCRIPT KILL</span></span>
<span class="line"><span>OK  -- 或 (error) NOTBUSY 没有脚本在执行</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">SCRIPT KILL 的限制</p><p>如果脚本已经执行过写操作，SCRIPT KILL 无法终止它，只能通过 <code>SHUTDOWN NOSAVE</code> 强制关闭 Redis。因此 Lua 脚本中必须避免死循环，建议所有循环都设置上限。</p></div><h2 id="_5-lua-脚本原子性" tabindex="-1"><a class="header-anchor" href="#_5-lua-脚本原子性"><span>5. Lua 脚本原子性</span></a></h2><h3 id="_5-1-原子性保证" tabindex="-1"><a class="header-anchor" href="#_5-1-原子性保证"><span>5.1 原子性保证</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Lua 脚本的原子性：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>执行 Lua 脚本时，Redis 的行为：</span></span>
<span class="line"><span>┌──────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                                                        │</span></span>
<span class="line"><span>│  ┌──────────────────────────────────────────────┐     │</span></span>
<span class="line"><span>│  │          Lua 脚本执行期间                       │     │</span></span>
<span class="line"><span>│  │                                                │     │</span></span>
<span class="line"><span>│  │  • Redis 阻塞所有其他客户端命令                 │     │</span></span>
<span class="line"><span>│  │  • 其他客户端的命令排队等待                     │     │</span></span>
<span class="line"><span>│  │  • 不会被其他命令插入                           │     │</span></span>
<span class="line"><span>│  │  • 整个脚本要么全部执行，要么都不执行（出错时）  │     │</span></span>
<span class="line"><span>│  │                                                │     │</span></span>
<span class="line"><span>│  └──────────────────────────────────────────────┘     │</span></span>
<span class="line"><span>│                                                        │</span></span>
<span class="line"><span>│  时间线：                                               │</span></span>
<span class="line"><span>│  ─────────────────────────────────────────────────▶   │</span></span>
<span class="line"><span>│  │ Lua脚本执行 │ 其他客户端等待 │ 命令依次执行 │       │</span></span>
<span class="line"><span>│  └────────────┘                                        │</span></span>
<span class="line"><span>│                                                        │</span></span>
<span class="line"><span>│  注意：                                                 │</span></span>
<span class="line"><span>│  • 原子性 ≠ 隔离性：脚本执行期间其他客户端被阻塞        │</span></span>
<span class="line"><span>│  • 原子性 ≠ 持久性：脚本执行完是否持久化取决于配置       │</span></span>
<span class="line"><span>│  • 原子性 ≠ 一致性：如果脚本中途出错，已执行的写操作不会回滚 │</span></span>
<span class="line"><span>│                                                        │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-原子性的边界" tabindex="-1"><a class="header-anchor" href="#_5-2-原子性的边界"><span>5.2 原子性的边界</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Lua 脚本原子性不保证的场景：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景1：脚本执行中 Redis 崩溃</span></span>
<span class="line"><span>  ┌────────────────────────────┐</span></span>
<span class="line"><span>  │  SET key1 &quot;a&quot;  ← 已执行    │</span></span>
<span class="line"><span>  │  SET key2 &quot;b&quot;  ← 已执行    │</span></span>
<span class="line"><span>  │  SET key3 &quot;c&quot;  ← Redis崩溃！│</span></span>
<span class="line"><span>  │  SET key4 &quot;d&quot;  ← 未执行    │</span></span>
<span class="line"><span>  └────────────────────────────┘</span></span>
<span class="line"><span>  结果：key1 和 key2 已写入，key3 和 key4 未写入</span></span>
<span class="line"><span>  AOF 可能只记录了部分命令（取决于 fsync 策略）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景2：AOF 重写期间</span></span>
<span class="line"><span>  AOF 重写是后台进程，可能与 Lua 脚本产生时间窗口</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景3：主从复制延迟</span></span>
<span class="line"><span>  主节点执行脚本后，从节点异步复制</span></span>
<span class="line"><span>  在复制完成前，主从数据不一致</span></span>
<span class="line"><span></span></span>
<span class="line"><span>结论：Lua 脚本保证了&quot;执行期间的原子性&quot;</span></span>
<span class="line"><span>     但不保证&quot;故障后的原子性&quot;和&quot;跨节点的原子性&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-redis-7-0-function" tabindex="-1"><a class="header-anchor" href="#_6-redis-7-0-function"><span>6. Redis 7.0 Function</span></a></h2><h3 id="_6-1-function-vs-script" tabindex="-1"><a class="header-anchor" href="#_6-1-function-vs-script"><span>6.1 Function vs Script</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Redis 7.0 引入的 Function 机制：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────┬──────────────────┬──────────────────────┐</span></span>
<span class="line"><span>│  特性         │  EVAL/EVALSHA    │  Function              │</span></span>
<span class="line"><span>├──────────────┼──────────────────┼──────────────────────┤</span></span>
<span class="line"><span>│  持久化       │  不持久化（重启丢失）│  持久化到 RDB/AOF     │</span></span>
<span class="line"><span>│  函数库       │  无               │  按库组织              │</span></span>
<span class="line"><span>│  复用性       │  手动管理 SHA1    │  函数名直接调用         │</span></span>
<span class="line"><span>│  主从复制     │  不复制脚本       │  自动复制到从节点       │</span></span>
<span class="line"><span>│  管理         │  SCRIPT FLUSH    │  FCALL / FFUNCTION     │</span></span>
<span class="line"><span>│  编程模型     │  内联脚本         │  注册函数               │</span></span>
<span class="line"><span>└──────────────┴──────────────────┴──────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-function-使用示例" tabindex="-1"><a class="header-anchor" href="#_6-2-function-使用示例"><span>6.2 Function 使用示例</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span># 注册 Function</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt; FUNCTION CREATE mylib LUA</span></span>
<span class="line"><span>  &quot;local function deduct_stock(key, amount)</span></span>
<span class="line"><span>       local stock = tonumber(redis.call(&#39;GET&#39;, key))</span></span>
<span class="line"><span>       if stock and stock &gt;= amount then</span></span>
<span class="line"><span>           redis.call(&#39;DECRBY&#39;, key, amount)</span></span>
<span class="line"><span>           return stock - amount</span></span>
<span class="line"><span>       end</span></span>
<span class="line"><span>       return -1</span></span>
<span class="line"><span>   end</span></span>
<span class="line"><span>   redis.register_function(&#39;deduct_stock&#39;, deduct_stock)&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 调用 Function</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt; FCALL mylib deduct_stock 1 product:1001 5</span></span>
<span class="line"><span>(integer) 95</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 列出所有 Function</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt; FUNCTION LIST</span></span>
<span class="line"><span>1) 1) &quot;mylib&quot;</span></span>
<span class="line"><span>   2) 1) 1) &quot;deduct_stock&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 删除 Function</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt; FUNCTION DELETE mylib</span></span>
<span class="line"><span>OK</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-function-持久化" tabindex="-1"><a class="header-anchor" href="#_6-3-function-持久化"><span>6.3 Function 持久化</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Function 持久化机制：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  Function 持久化流程                                  │</span></span>
<span class="line"><span>│                                                      │</span></span>
<span class="line"><span>│  1. FUNCTION CREATE 时：                              │</span></span>
<span class="line"><span>│     • 脚本代码保存到 Redis 内存中的函数注册表           │</span></span>
<span class="line"><span>│     • 同时写入 AOF 文件（如果开启 AOF）                │</span></span>
<span class="line"><span>│     • 标记为需要持久化到 RDB                          │</span></span>
<span class="line"><span>│                                                      │</span></span>
<span class="line"><span>│  2. RDB 快照时：                                     │</span></span>
<span class="line"><span>│     • 函数注册表序列化到 RDB 文件                      │</span></span>
<span class="line"><span>│     • 重启后自动恢复所有函数                           │</span></span>
<span class="line"><span>│                                                      │</span></span>
<span class="line"><span>│  3. AOF 重写时：                                     │</span></span>
<span class="line"><span>│     • 重写后的 AOF 包含 FUNCTION CREATE 命令           │</span></span>
<span class="line"><span>│     • 确保加载 AOF 后函数可用                          │</span></span>
<span class="line"><span>│                                                      │</span></span>
<span class="line"><span>│  对比 EVAL/EVALSHA：                                  │</span></span>
<span class="line"><span>│     • 脚本缓存不持久化，Redis 重启后需要重新 LOAD       │</span></span>
<span class="line"><span>│     • Function 自动持久化，重启后自动可用               │</span></span>
<span class="line"><span>└────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container info"><p class="hint-container-title">Function 的优势</p><p>Redis 7.0 的 Function 机制解决了 EVAL/EVALSHA 的最大痛点 —— 脚本不持久化。在 Cluster 环境中，Function 也会自动同步到所有节点，避免了 EVALSHA 的 NOSCRIPT 问题。如果你的 Redis 版本 &gt;= 7.0，推荐使用 Function 替代 EVAL/EVALSHA。</p></div><h2 id="_7-脚本安全-sandbox" tabindex="-1"><a class="header-anchor" href="#_7-脚本安全-sandbox"><span>7. 脚本安全（Sandbox）</span></a></h2><h3 id="_7-1-lua-沙箱限制" tabindex="-1"><a class="header-anchor" href="#_7-1-lua-沙箱限制"><span>7.1 Lua 沙箱限制</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Redis Lua 沙箱安全限制：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  被禁止的操作：                                           │</span></span>
<span class="line"><span>│                                                          │</span></span>
<span class="line"><span>│  ❌ 文件操作：io.open, io.read, io.write 等             │</span></span>
<span class="line"><span>│  ❌ 系统命令：os.execute, os.getenv                      │</span></span>
<span class="line"><span>│  ❌ 加载模块：require, dofile, loadfile                   │</span></span>
<span class="line"><span>│  ❌ 调试库：debug 库的大部分功能                           │</span></span>
<span class="line"><span>│  ❌ 网络操作：socket 等                                   │</span></span>
<span class="line"><span>│  ❌ 协程：coroutine 在某些版本中受限                      │</span></span>
<span class="line"><span>│                                                          │</span></span>
<span class="line"><span>│  允许的操作：                                             │</span></span>
<span class="line"><span>│  ✅ 字符串操作：string.find, string.sub 等               │</span></span>
<span class="line"><span>│  ✅ 数学运算：math.floor, math.random 等                 │</span></span>
<span class="line"><span>│  ✅ 表操作：table.insert, table.sort 等                  │</span></span>
<span class="line"><span>│  ✅ Redis 调用：redis.call, redis.pcall                  │</span></span>
<span class="line"><span>│  ✅ 日志输出：redis.log(redis.LOG_WARNING, &quot;msg&quot;)        │</span></span>
<span class="line"><span>│  ✅ JSON 操作：cjson.encode, cjson.decode               │</span></span>
<span class="line"><span>│  ✅ Base64：redis.base64_encode, redis.base64_decode     │</span></span>
<span class="line"><span>│  ✅ SHA1：redis.sha1hex                                   │</span></span>
<span class="line"><span>└────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-脚本超时与保护" tabindex="-1"><a class="header-anchor" href="#_7-2-脚本超时与保护"><span>7.2 脚本超时与保护</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Lua 脚本超时机制：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>默认超时：5 秒（lua-time-limit 配置）</span></span>
<span class="line"><span>  redis.conf: lua-time-limit 5000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>超时后的行为：</span></span>
<span class="line"><span>  ┌─────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  1. Redis 不会主动终止脚本（为了数据安全）          │</span></span>
<span class="line"><span>  │  2. 开始接受 SCRIPT KILL 命令                     │</span></span>
<span class="line"><span>  │  3. 其他客户端的命令返回 BUSY 错误                  │</span></span>
<span class="line"><span>  │     (error) BUSY Redis is busy running a script   │</span></span>
<span class="line"><span>  │  4. 只能 SCRIPT KILL（只读脚本）或 SHUTDOWN NOSAVE │</span></span>
<span class="line"><span>  └─────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>防范措施：</span></span>
<span class="line"><span>  1. 避免在 Lua 脚本中使用无限循环</span></span>
<span class="line"><span>  2. 所有循环设置上限</span></span>
<span class="line"><span>  3. 复杂计算尽量放在应用层</span></span>
<span class="line"><span>  4. 脚本先在测试环境验证性能</span></span>
<span class="line"><span>  5. 监控 Lua 脚本执行时间</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-脚本安全最佳实践" tabindex="-1"><a class="header-anchor" href="#_7-3-脚本安全最佳实践"><span>7.3 脚本安全最佳实践</span></a></h3><div class="language-lua line-numbers-mode" data-highlighter="shiki" data-ext="lua" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-lua"><span class="line"><span style="color:#7F848E;font-style:italic;">-- 安全的 Lua 脚本写法</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ❌ 错误：无限循环</span></span>
<span class="line"><span style="color:#C678DD;">while</span><span style="color:#D19A66;"> true</span><span style="color:#C678DD;"> do</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    -- 死循环！Redis 会被阻塞</span></span>
<span class="line"><span style="color:#C678DD;">end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ✅ 正确：设置循环上限</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> max_iterations</span><span style="color:#ABB2BF;"> = </span><span style="color:#D19A66;">1000</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> i</span><span style="color:#ABB2BF;"> = </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">max_iterations</span><span style="color:#C678DD;"> do</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    -- 有上限的循环</span></span>
<span class="line"><span style="color:#C678DD;">end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ❌ 错误：操作文件</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> f</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">io.open</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;/etc/passwd&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;r&quot;</span><span style="color:#ABB2BF;">)  </span><span style="color:#7F848E;font-style:italic;">-- 沙箱禁止！</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ✅ 正确：只使用 redis.call</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> value</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;GET&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ❌ 错误：执行系统命令</span></span>
<span class="line"><span style="color:#56B6C2;">os.execute</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;rm -rf /&quot;</span><span style="color:#ABB2BF;">)  </span><span style="color:#7F848E;font-style:italic;">-- 沙箱禁止！</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ✅ 正确：使用 redis.log 记录日志</span></span>
<span class="line"><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">log</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.LOG_WARNING, </span><span style="color:#98C379;">&quot;Processing key: &quot; </span><span style="color:#ABB2BF;">.. </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ❌ 错误：引用未传入的 Key（非确定性）</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> keys</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">redis</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">call</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;KEYS&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;*&#39;</span><span style="color:#ABB2BF;">)  </span><span style="color:#7F848E;font-style:italic;">-- 不安全！</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ✅ 正确：只使用 KEYS 参数传入的 Key</span></span>
<span class="line"><span style="color:#C678DD;">local</span><span style="color:#E06C75;"> key</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">KEYS</span><span style="color:#ABB2BF;">[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">确定性要求</p><p>Redis 要求 Lua 脚本在相同数据集上产生相同结果（确定性）。这影响主从复制 —— 如果脚本包含非确定性操作（如 <code>TIME</code>、<code>SRANDMEMBER</code>、随机数），Redis 会拒绝将脚本写入 AOF，并阻止从节点执行。使用 <code>redis.replicate_commands()</code> （Redis 3.2+）可解除此限制，让脚本效果通过命令传播而非脚本传播。</p></div><h2 id="_8-c-实战示例" tabindex="-1"><a class="header-anchor" href="#_8-c-实战示例"><span>8. C# 实战示例</span></a></h2><h3 id="_8-1-stackexchange-redis-事务" tabindex="-1"><a class="header-anchor" href="#_8-1-stackexchange-redis-事务"><span>8.1 StackExchange.Redis 事务</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// StackExchange.Redis 事务操作</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> RedisTransactionService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IDatabase</span><span style="color:#E06C75;"> _db</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> RedisTransactionService</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">IConnectionMultiplexer</span><span style="color:#E5C07B;"> connection</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _db</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> connection</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetDatabase</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 基本事务：批量设置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">[]&gt; </span><span style="color:#61AFEF;">BatchSetAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        Dictionary</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">keyValuePairs</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">expiry</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> tran</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">CreateTransaction</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> tasks</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">List</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt;&gt;();</span></span>
<span class="line"><span style="color:#C678DD;">        foreach</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> kvp</span><span style="color:#C678DD;"> in</span><span style="color:#E06C75;"> keyValuePairs</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            tasks</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Add</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringSetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">kvp</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Key</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">kvp</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Value</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">expiry</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        bool</span><span style="color:#E06C75;"> committed</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ExecuteAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#56B6C2;">!</span><span style="color:#E06C75;">committed</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#E5C07B;"> Array</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Empty</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#E5C07B;">Task</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WhenAll</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">tasks</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> tasks</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Select</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">t</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#E5C07B;">t</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Result</span><span style="color:#ABB2BF;">).</span><span style="color:#61AFEF;">ToArray</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 条件事务：WATCH 语义</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">ConditionalUpdateAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> key</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> newValue</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> expectedValue</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#C678DD;">        int</span><span style="color:#E5C07B;"> maxRetries</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 5</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        for</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">int</span><span style="color:#E06C75;"> i</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> maxRetries</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> tran</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">CreateTransaction</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 添加条件（等价于 WATCH + 检查）</span></span>
<span class="line"><span style="color:#E5C07B;">            tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddCondition</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Condition</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringEqual</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">expectedValue</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> setTask</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringSetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">newValue</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            bool</span><span style="color:#E06C75;"> committed</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ExecuteAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">committed</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#ABB2BF;">                await </span><span style="color:#E06C75;">setTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">                return</span><span style="color:#D19A66;"> true</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 条件不满足，重试</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">Task</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Delay</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">50</span><span style="color:#56B6C2;"> *</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;"> +</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> false</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 组合事务：多个 Key 同时操作</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">CompositeOperationAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> userKey</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> counterKey</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> userValue</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#C678DD;">        long</span><span style="color:#E5C07B;"> increment</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> tran</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">CreateTransaction</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> setTask</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringSetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">userKey</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">userValue</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> incrTask</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringIncrementAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">counterKey</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">increment</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        bool</span><span style="color:#E06C75;"> committed</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ExecuteAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">committed</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">Task</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WhenAll</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">setTask</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">incrTask</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> true</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> false</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-stackexchange-redis-lua-脚本" tabindex="-1"><a class="header-anchor" href="#_8-2-stackexchange-redis-lua-脚本"><span>8.2 StackExchange.Redis Lua 脚本</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// StackExchange.Redis Lua 脚本操作</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> RedisScriptService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IDatabase</span><span style="color:#E06C75;"> _db</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> RedisScriptService</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">IConnectionMultiplexer</span><span style="color:#E5C07B;"> connection</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _db</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> connection</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetDatabase</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 预定义脚本（推荐方式，避免每次传输脚本代码）</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> static</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#E06C75;"> _deductStockScript</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Prepare</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">@&quot;</span></span>
<span class="line"><span style="color:#98C379;">        local stock = tonumber(redis.call(&#39;GET&#39;, KEYS[1]))</span></span>
<span class="line"><span style="color:#98C379;">        if stock == nil then</span></span>
<span class="line"><span style="color:#98C379;">            return -2</span></span>
<span class="line"><span style="color:#98C379;">        end</span></span>
<span class="line"><span style="color:#98C379;">        local amount = tonumber(ARGV[1])</span></span>
<span class="line"><span style="color:#98C379;">        if stock &lt; amount then</span></span>
<span class="line"><span style="color:#98C379;">            return -1</span></span>
<span class="line"><span style="color:#98C379;">        end</span></span>
<span class="line"><span style="color:#98C379;">        redis.call(&#39;DECRBY&#39;, KEYS[1], amount)</span></span>
<span class="line"><span style="color:#98C379;">        return stock - amount</span></span>
<span class="line"><span style="color:#98C379;">    &quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> static</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#E06C75;"> _releaseLockScript</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Prepare</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">@&quot;</span></span>
<span class="line"><span style="color:#98C379;">        if redis.call(&#39;GET&#39;, KEYS[1]) == ARGV[1] then</span></span>
<span class="line"><span style="color:#98C379;">            return redis.call(&#39;DEL&#39;, KEYS[1])</span></span>
<span class="line"><span style="color:#98C379;">        else</span></span>
<span class="line"><span style="color:#98C379;">            return 0</span></span>
<span class="line"><span style="color:#98C379;">        end</span></span>
<span class="line"><span style="color:#98C379;">    &quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> static</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#E06C75;"> _rateLimitScript</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Prepare</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">@&quot;</span></span>
<span class="line"><span style="color:#98C379;">        local key = KEYS[1]</span></span>
<span class="line"><span style="color:#98C379;">        local limit = tonumber(ARGV[1])</span></span>
<span class="line"><span style="color:#98C379;">        local window = tonumber(ARGV[2])</span></span>
<span class="line"><span style="color:#98C379;">        local current = tonumber(redis.call(&#39;GET&#39;, key) or &#39;0&#39;)</span></span>
<span class="line"><span style="color:#98C379;">        if current &gt;= limit then</span></span>
<span class="line"><span style="color:#98C379;">            return 0</span></span>
<span class="line"><span style="color:#98C379;">        end</span></span>
<span class="line"><span style="color:#98C379;">        current = redis.call(&#39;INCR&#39;, key)</span></span>
<span class="line"><span style="color:#98C379;">        if current == 1 then</span></span>
<span class="line"><span style="color:#98C379;">            redis.call(&#39;EXPIRE&#39;, key, window)</span></span>
<span class="line"><span style="color:#98C379;">        end</span></span>
<span class="line"><span style="color:#98C379;">        return 1</span></span>
<span class="line"><span style="color:#98C379;">    &quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 库存扣减</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">long</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">DeductStockAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> stockKey</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">int</span><span style="color:#E5C07B;"> amount</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ScriptEvaluateAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            _deductStockScript</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">            new { </span><span style="color:#E06C75;">KEYS</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisKey</span><span style="color:#ABB2BF;">[] { </span><span style="color:#E06C75;">stockKey</span><span style="color:#ABB2BF;"> }, </span><span style="color:#E06C75;">ARGV</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisValue</span><span style="color:#ABB2BF;">[] { </span><span style="color:#E06C75;">amount</span><span style="color:#ABB2BF;"> } });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">long</span><span style="color:#ABB2BF;">)</span><span style="color:#E06C75;">result</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 释放分布式锁</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">ReleaseLockAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> lockKey</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> lockValue</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ScriptEvaluateAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            _releaseLockScript</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">            new { </span><span style="color:#E06C75;">KEYS</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisKey</span><span style="color:#ABB2BF;">[] { </span><span style="color:#E06C75;">lockKey</span><span style="color:#ABB2BF;"> }, </span><span style="color:#E06C75;">ARGV</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisValue</span><span style="color:#ABB2BF;">[] { </span><span style="color:#E06C75;">lockValue</span><span style="color:#ABB2BF;"> } });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">long</span><span style="color:#ABB2BF;">)</span><span style="color:#E06C75;">result</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 固定窗口限流</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">RateLimitAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> rateLimitKey</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">int</span><span style="color:#E5C07B;"> limit</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">int</span><span style="color:#E5C07B;"> windowSeconds</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ScriptEvaluateAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            _rateLimitScript</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">            new</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E06C75;">                KEYS</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisKey</span><span style="color:#ABB2BF;">[] { </span><span style="color:#E06C75;">rateLimitKey</span><span style="color:#ABB2BF;"> },</span></span>
<span class="line"><span style="color:#E06C75;">                ARGV</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisValue</span><span style="color:#ABB2BF;">[] { </span><span style="color:#E06C75;">limit</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">windowSeconds</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">            });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">long</span><span style="color:#ABB2BF;">)</span><span style="color:#E06C75;">result</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-完整业务示例-秒杀系统" tabindex="-1"><a class="header-anchor" href="#_8-3-完整业务示例-秒杀系统"><span>8.3 完整业务示例：秒杀系统</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 秒杀系统 —— 事务 + Lua 脚本综合实战</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> SeckillService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IDatabase</span><span style="color:#E06C75;"> _db</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> ConnectionMultiplexer</span><span style="color:#E06C75;"> _connection</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> SeckillService</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">ConnectionMultiplexer</span><span style="color:#E5C07B;"> connection</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _connection</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> connection</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _db</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> connection</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">GetDatabase</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 秒杀 Lua 脚本（原子操作）</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> static</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#E06C75;"> _seckillScript</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Prepare</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">@&quot;</span></span>
<span class="line"><span style="color:#98C379;">        -- 参数说明：</span></span>
<span class="line"><span style="color:#98C379;">        -- KEYS[1] = 库存Key    (seckill:stock:{activityId})</span></span>
<span class="line"><span style="color:#98C379;">        -- KEYS[2] = 已购集合   (seckill:bought:{activityId})</span></span>
<span class="line"><span style="color:#98C379;">        -- ARGV[1] = 用户ID</span></span>
<span class="line"><span style="color:#98C379;">        -- ARGV[2] = 购买数量</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">        -- 检查是否已购买</span></span>
<span class="line"><span style="color:#98C379;">        if redis.call(&#39;SISMEMBER&#39;, KEYS[2], ARGV[1]) == 1 then</span></span>
<span class="line"><span style="color:#98C379;">            return -1  -- 已购买</span></span>
<span class="line"><span style="color:#98C379;">        end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">        -- 检查库存</span></span>
<span class="line"><span style="color:#98C379;">        local stock = tonumber(redis.call(&#39;GET&#39;, KEYS[1]))</span></span>
<span class="line"><span style="color:#98C379;">        if stock == nil or stock &lt; tonumber(ARGV[2]) then</span></span>
<span class="line"><span style="color:#98C379;">            return -2  -- 库存不足</span></span>
<span class="line"><span style="color:#98C379;">        end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">        -- 扣减库存</span></span>
<span class="line"><span style="color:#98C379;">        redis.call(&#39;DECRBY&#39;, KEYS[1], tonumber(ARGV[2]))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">        -- 记录已购买</span></span>
<span class="line"><span style="color:#98C379;">        redis.call(&#39;SADD&#39;, KEYS[2], ARGV[1])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">        return 1  -- 秒杀成功</span></span>
<span class="line"><span style="color:#98C379;">    &quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 执行秒杀</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">SeckillResult</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">ExecuteSeckillAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        long</span><span style="color:#E5C07B;"> activityId</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">long</span><span style="color:#E5C07B;"> userId</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">int</span><span style="color:#E5C07B;"> quantity</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> stockKey</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> $&quot;seckill:stock:</span><span style="color:#ABB2BF;">{</span><span style="color:#E06C75;">activityId</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> boughtKey</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> $&quot;seckill:bought:</span><span style="color:#ABB2BF;">{</span><span style="color:#E06C75;">activityId</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ScriptEvaluateAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            _seckillScript</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">            new</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E06C75;">                KEYS</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisKey</span><span style="color:#ABB2BF;">[] { </span><span style="color:#E06C75;">stockKey</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">boughtKey</span><span style="color:#ABB2BF;"> },</span></span>
<span class="line"><span style="color:#E06C75;">                ARGV</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisValue</span><span style="color:#ABB2BF;">[] { </span><span style="color:#E06C75;">userId</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">quantity</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">            });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        long</span><span style="color:#E06C75;"> code</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">long</span><span style="color:#ABB2BF;">)</span><span style="color:#E06C75;">result</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> code</span><span style="color:#C678DD;"> switch</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#D19A66;">            1</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#E5C07B;">SeckillResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Success</span><span style="color:#ABB2BF;">(),</span></span>
<span class="line"><span style="color:#56B6C2;">            -</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#E5C07B;">SeckillResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Fail</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;已购买过该商品&quot;</span><span style="color:#ABB2BF;">),</span></span>
<span class="line"><span style="color:#56B6C2;">            -</span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#E5C07B;">SeckillResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Fail</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;库存不足&quot;</span><span style="color:#ABB2BF;">),</span></span>
<span class="line"><span style="color:#E5C07B;">            _</span><span style="color:#ABB2BF;"> =&gt; </span><span style="color:#E5C07B;">SeckillResult</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Fail</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;未知错误&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        };</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 初始化秒杀活动</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> InitActivityAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        long</span><span style="color:#E5C07B;"> activityId</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">int</span><span style="color:#E5C07B;"> totalStock</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">TimeSpan</span><span style="color:#E5C07B;"> duration</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> stockKey</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> $&quot;seckill:stock:</span><span style="color:#ABB2BF;">{</span><span style="color:#E06C75;">activityId</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> boughtKey</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> $&quot;seckill:bought:</span><span style="color:#ABB2BF;">{</span><span style="color:#E06C75;">activityId</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> tran</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> _db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">CreateTransaction</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> setStock</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringSetAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">stockKey</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">totalStock</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> setBought</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">KeyDeleteAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">boughtKey</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> setExpiry</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">KeyExpireAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">stockKey</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">duration</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (await </span><span style="color:#E5C07B;">tran</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ExecuteAsync</span><span style="color:#ABB2BF;">())</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">Task</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WhenAll</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">setStock</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">setBought</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">setExpiry</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> record</span><span style="color:#E5C07B;"> SeckillResult</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">bool</span><span style="color:#E5C07B;"> Success</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> Message</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> SeckillResult</span><span style="color:#61AFEF;"> Success</span><span style="color:#ABB2BF;">() =&gt; new(</span><span style="color:#D19A66;">true</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;秒杀成功&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> SeckillResult</span><span style="color:#61AFEF;"> Fail</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> msg</span><span style="color:#ABB2BF;">) =&gt; new(</span><span style="color:#D19A66;">false</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">msg</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-事务与-lua-脚本选型指南" tabindex="-1"><a class="header-anchor" href="#_9-事务与-lua-脚本选型指南"><span>9. 事务与 Lua 脚本选型指南</span></a></h2><h3 id="_9-1-选型决策" tabindex="-1"><a class="header-anchor" href="#_9-1-选型决策"><span>9.1 选型决策</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>┌─────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│               事务 vs Lua 脚本选型指南                      │</span></span>
<span class="line"><span>├─────────────────┬─────────────────┬─────────────────────┤</span></span>
<span class="line"><span>│  场景             │  推荐             │  原因               │</span></span>
<span class="line"><span>├─────────────────┼─────────────────┼─────────────────────┤</span></span>
<span class="line"><span>│  批量设置/删除    │  事务 MULTI       │  简单，无逻辑判断    │</span></span>
<span class="line"><span>│  条件更新         │  WATCH 事务       │  乐观锁足够          │</span></span>
<span class="line"><span>│  读取+判断+写入   │  Lua 脚本        │  事务无法读中间结果   │</span></span>
<span class="line"><span>│  限流器           │  Lua 脚本        │  需要条件判断         │</span></span>
<span class="line"><span>│  分布式锁         │  Lua 脚本        │  原子性要求高        │</span></span>
<span class="line"><span>│  库存扣减         │  Lua 脚本        │  读-判断-写需原子    │</span></span>
<span class="line"><span>│  简单转账         │  WATCH 事务       │  逻辑简单            │</span></span>
<span class="line"><span>│  复杂业务         │  Lua 脚本        │  需要完整编程能力     │</span></span>
<span class="line"><span>│  跨多个 Key 操作  │  Lua 脚本        │  事务无法读取中间值   │</span></span>
<span class="line"><span>│  批量 Key 过期    │  事务 MULTI       │  无需判断            │</span></span>
<span class="line"><span>└─────────────────┴─────────────────┴─────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-性能对比" tabindex="-1"><a class="header-anchor" href="#_9-2-性能对比"><span>9.2 性能对比</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>性能对比测试条件：</span></span>
<span class="line"><span>  - 硬件：8C 32GB SSD</span></span>
<span class="line"><span>  - 命令：10 次 SET 操作</span></span>
<span class="line"><span>  - 客户端：50 并发</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────────┬───────────────┬───────────────┐</span></span>
<span class="line"><span>│  方式              │  QPS          │  P99 延迟(ms)  │</span></span>
<span class="line"><span>├──────────────────┼───────────────┼───────────────┤</span></span>
<span class="line"><span>│  逐条执行          │  ~50,000      │  1.5          │</span></span>
<span class="line"><span>│  Pipeline         │  ~200,000     │  3.0          │</span></span>
<span class="line"><span>│  MULTI 事务       │  ~180,000     │  3.5          │</span></span>
<span class="line"><span>│  Lua 脚本         │  ~250,000     │  2.5          │</span></span>
<span class="line"><span>└──────────────────┴───────────────┴───────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>结论：</span></span>
<span class="line"><span>  1. Lua 脚本 &gt; Pipeline &gt; MULTI &gt; 逐条执行</span></span>
<span class="line"><span>  2. Lua 脚本最优：单次 RTT + 服务端执行</span></span>
<span class="line"><span>  3. Pipeline 次之：批量发送但多次 RTT</span></span>
<span class="line"><span>  4. MULTI 最差：事务开销 + 逐条返回</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-总结" tabindex="-1"><a class="header-anchor" href="#_10-总结"><span>10. 总结</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>┌─────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                     核心要点总结                                │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>│  事务 (MULTI/EXEC/WATCH)：                                     │</span></span>
<span class="line"><span>│  🔹 MULTI 开启事务，命令入队不执行                              │</span></span>
<span class="line"><span>│  🔹 EXEC 原子执行所有命令，中间不插入其他命令                    │</span></span>
<span class="line"><span>│  🔹 不支持回滚！运行时错误仅影响出错命令                        │</span></span>
<span class="line"><span>│  🔹 WATCH 提供乐观锁，基于 CAS 机制                            │</span></span>
<span class="line"><span>│  🔹 适合无逻辑判断的批量操作                                    │</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>│  Lua 脚本：                                                    │</span></span>
<span class="line"><span>│  🔹 EVAL/EVALSHA 执行，evalsha 避免重复传输                    │</span></span>
<span class="line"><span>│  🔹 脚本执行期间 Redis 阻塞，保证原子性                         │</span></span>
<span class="line"><span>│  🔹 支持条件逻辑、循环、函数等完整编程能力                       │</span></span>
<span class="line"><span>│  🔹 必须避免死循环，所有循环设上限                               │</span></span>
<span class="line"><span>│  🔹 沙箱限制：禁止文件/系统/网络操作                            │</span></span>
<span class="line"><span>│  🔹 Redis 7.0 Function 提供持久化和更好的管理                   │</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>│  选型原则：                                                     │</span></span>
<span class="line"><span>│  🔹 简单批量操作 → 事务 MULTI                                  │</span></span>
<span class="line"><span>│  🔹 条件更新 → WATCH 事务                                      │</span></span>
<span class="line"><span>│  🔹 读取+判断+写入 → Lua 脚本                                  │</span></span>
<span class="line"><span>│  🔹 Redis 7.0+ → 优先使用 Function                            │</span></span>
<span class="line"><span>│  🔹 脚本先测试，注意超时风险                                    │</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container info"><p class="hint-container-title">参考文献</p><ul><li><a href="https://redis.io/docs/interact/transactions/" target="_blank" rel="noopener noreferrer">Redis 官方文档 - Transactions</a></li><li><a href="https://redis.io/docs/interact/programmability/eval-intro/" target="_blank" rel="noopener noreferrer">Redis 官方文档 - Lua Scripts</a></li><li><a href="https://redis.io/docs/interact/programmability/functions/" target="_blank" rel="noopener noreferrer">Redis 官方文档 - Functions</a></li><li>《Redis 设计与实现》- 黄健宏 - 第19章 事务</li><li>Redis 源码 <code>multi.c</code> / <code>scripting.c</code></li><li>Martin Kleppmann 关于 Lua 脚本不确定性的讨论</li></ul></div>`,50)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};