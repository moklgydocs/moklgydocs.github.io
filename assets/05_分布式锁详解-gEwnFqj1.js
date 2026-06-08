import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-CtmVft7R.js";var o=JSON.parse(`{"path":"/%E5%90%8E%E7%AB%AF%E5%BC%80%E5%8F%91/Redis/07_%E9%AB%98%E7%BA%A7%E7%89%B9%E6%80%A7/05_%E5%88%86%E5%B8%83%E5%BC%8F%E9%94%81%E8%AF%A6%E8%A7%A3.html","title":"分布式锁详解","lang":"zh-CN","frontmatter":{"title":"分布式锁详解","icon":"fa6-solid:lock","order":2,"category":["Redis"],"tag":["分布式锁","Redlock","Redisson","看门狗","可重入锁","读写锁","Zookeeper","CSharp"]},"git":{"createdTime":1780587023000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":20.03,"words":6010},"filePathRelative":"后端开发/Redis/07_高级特性/05_分布式锁详解.md"}`),s={name:`05_分布式锁详解.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="分布式锁详解" tabindex="-1"><a class="header-anchor" href="#分布式锁详解"><span>分布式锁详解</span></a></h1><blockquote><p>分布式锁是分布式系统中最常用的协调原语之一。从最简单的 SET NX EX 到 Redlock 多节点算法，从 Redisson 的看门狗续期到可重入锁的实现，分布式锁看似简单实则暗藏玄机。一个不正确的分布式锁实现可能导致数据丢失、重复执行、甚至死锁。本文将深入每一个细节，帮你写出生产级可用的分布式锁。</p></blockquote><h2 id="_1-单节点分布式锁" tabindex="-1"><a class="header-anchor" href="#_1-单节点分布式锁"><span>1. 单节点分布式锁</span></a></h2><h3 id="_1-1-基本实现-set-nx-ex" tabindex="-1"><a class="header-anchor" href="#_1-1-基本实现-set-nx-ex"><span>1.1 基本实现：SET NX EX</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>分布式锁的基本要求：</span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  1. 互斥性：同一时刻只有一个客户端持有锁                     │</span></span>
<span class="line"><span>│  2. 防死锁：锁必须能自动释放（超时机制）                     │</span></span>
<span class="line"><span>│  3. 防误删：只能删除自己持有的锁                             │</span></span>
<span class="line"><span>│  4. 高可用：锁服务尽可能可用                                 │</span></span>
<span class="line"><span>│  5. 可重入：同一线程可重复获取同一把锁                       │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>最简实现 —— SET NX EX：</span></span>
<span class="line"><span>  SET lock_key unique_value NX EX 30</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  参数说明：</span></span>
<span class="line"><span>  - NX：Key 不存在时才设置（Not eXists），保证互斥</span></span>
<span class="line"><span>  - EX 30：设置 30 秒过期时间，防止死锁</span></span>
<span class="line"><span>  - unique_value：唯一标识，防止误删别人的锁</span></span>
<span class="line"><span></span></span>
<span class="line"><span>加锁流程：</span></span>
<span class="line"><span>  ┌──────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  SET lock_key &quot;uuid-123&quot; NX EX 30        │</span></span>
<span class="line"><span>  │  ├── 返回 OK → 加锁成功                   │</span></span>
<span class="line"><span>  │  └── 返回 nil → Key已存在，加锁失败        │</span></span>
<span class="line"><span>  └──────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>解锁流程（必须用 Lua 脚本保证原子性）：</span></span>
<span class="line"><span>  ┌──────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  if GET(lock_key) == unique_value then   │</span></span>
<span class="line"><span>  │      DEL lock_key                        │</span></span>
<span class="line"><span>  │      return 1                            │</span></span>
<span class="line"><span>  │  else                                    │</span></span>
<span class="line"><span>  │      return 0                            │</span></span>
<span class="line"><span>  │  end                                     │</span></span>
<span class="line"><span>  └──────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-为什么解锁必须用-lua-脚本" tabindex="-1"><a class="header-anchor" href="#_1-2-为什么解锁必须用-lua-脚本"><span>1.2 为什么解锁必须用 Lua 脚本</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>非原子解锁的危险场景：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>时间线：</span></span>
<span class="line"><span>  ┌────────┐                     ┌──────────┐</span></span>
<span class="line"><span>  │ 客户端A │                     │  Redis    │</span></span>
<span class="line"><span>  └───┬────┘                     └────┬─────┘</span></span>
<span class="line"><span>      │  GET lock_key → &quot;uuid-A&quot;  │</span></span>
<span class="line"><span>      │◀──────────────────────────│</span></span>
<span class="line"><span>      │  判断：是我的锁 ✓          │</span></span>
<span class="line"><span>      │                            │</span></span>
<span class="line"><span>      │  ← 此时锁过期了！           │</span></span>
<span class="line"><span>      │  ← 客户端B 加锁成功         │</span></span>
<span class="line"><span>      │                            │</span></span>
<span class="line"><span>      │  DEL lock_key              │</span></span>
<span class="line"><span>      │──────────────────────────▶│  ← 删除了客户端B的锁！！！</span></span>
<span class="line"><span>      │                            │</span></span>
<span class="line"><span>      │  客户端B以为还持有锁        │</span></span>
<span class="line"><span>      │  客户端C也加锁成功          │</span></span>
<span class="line"><span>      │  → 两个客户端同时持有锁     │</span></span>
<span class="line"><span>      │  → 互斥性被破坏！           │</span></span>
<span class="line"><span></span></span>
<span class="line"><span>用 Lua 脚本解决：</span></span>
<span class="line"><span>  ┌──────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  整个&quot;判断+删除&quot;在 Lua 脚本中原子执行               │</span></span>
<span class="line"><span>  │  脚本执行期间不会被其他命令打断                      │</span></span>
<span class="line"><span>  │  不存在&quot;判断和删除之间锁过期&quot;的窗口                  │</span></span>
<span class="line"><span>  └──────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-c-基本实现" tabindex="-1"><a class="header-anchor" href="#_1-3-c-基本实现"><span>1.3 C# 基本实现</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 基于 StackExchange.Redis 的基本分布式锁</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> SimpleRedisLock</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IDatabase</span><span style="color:#E06C75;"> _db</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#C678DD;"> string</span><span style="color:#E06C75;"> _lockKey</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#C678DD;"> string</span><span style="color:#E06C75;"> _lockValue</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> TimeSpan</span><span style="color:#E06C75;"> _expiry</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 释放锁的 Lua 脚本</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> static</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#E06C75;"> _releaseScript</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Prepare</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">@&quot;</span></span>
<span class="line"><span style="color:#98C379;">        if redis.call(&#39;GET&#39;, KEYS[1]) == ARGV[1] then</span></span>
<span class="line"><span style="color:#98C379;">            return redis.call(&#39;DEL&#39;, KEYS[1])</span></span>
<span class="line"><span style="color:#98C379;">        else</span></span>
<span class="line"><span style="color:#98C379;">            return 0</span></span>
<span class="line"><span style="color:#98C379;">        end</span></span>
<span class="line"><span style="color:#98C379;">    &quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> SimpleRedisLock</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        IDatabase</span><span style="color:#E5C07B;"> db</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> lockKey</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">TimeSpan</span><span style="color:#E5C07B;"> expiry</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _db</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> db</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _lockKey</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> lockKey</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _lockValue</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> Guid</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">NewGuid</span><span style="color:#ABB2BF;">().</span><span style="color:#61AFEF;">ToString</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;N&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E06C75;">        _expiry</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> expiry</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 尝试获取锁</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">TryAcquireAsync</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">StringSetAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            _lockKey</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">_lockValue</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">_expiry</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">When</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">NotExists</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 尝试获取锁（带重试）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">TryAcquireAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#E5C07B;"> timeout</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">TimeSpan</span><span style="color:#E5C07B;"> retryInterval</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> deadline</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> DateTime</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">UtcNow</span><span style="color:#56B6C2;"> +</span><span style="color:#E06C75;"> timeout</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        while</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">DateTime</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">UtcNow</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> deadline</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (await </span><span style="color:#61AFEF;">TryAcquireAsync</span><span style="color:#ABB2BF;">())</span></span>
<span class="line"><span style="color:#C678DD;">                return</span><span style="color:#D19A66;"> true</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">Task</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Delay</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">retryInterval</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> false</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 释放锁（原子操作）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">ReleaseAsync</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ScriptEvaluateAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            _releaseScript</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">            new</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E06C75;">                KEYS</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisKey</span><span style="color:#ABB2BF;">[] { </span><span style="color:#E06C75;">_lockKey</span><span style="color:#ABB2BF;"> },</span></span>
<span class="line"><span style="color:#E06C75;">                ARGV</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisValue</span><span style="color:#ABB2BF;">[] { </span><span style="color:#E06C75;">_lockValue</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">            });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">long</span><span style="color:#ABB2BF;">)</span><span style="color:#E06C75;">result</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 使用示例</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> OrderService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IDatabase</span><span style="color:#E06C75;"> _db</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> ProcessOrderAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> orderId</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> lockKey</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> $&quot;order:lock:</span><span style="color:#ABB2BF;">{</span><span style="color:#E06C75;">orderId</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> redisLock</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">SimpleRedisLock</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">_db</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">lockKey</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">TimeSpan</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FromSeconds</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">30</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        try</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (await </span><span style="color:#E5C07B;">redisLock</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">TryAcquireAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">                TimeSpan</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FromSeconds</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">10</span><span style="color:#ABB2BF;">), </span><span style="color:#E5C07B;">TimeSpan</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FromMilliseconds</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">200</span><span style="color:#ABB2BF;">)))</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // 执行业务逻辑</span></span>
<span class="line"><span style="color:#ABB2BF;">                await </span><span style="color:#61AFEF;">DoProcessOrder</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">orderId</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#C678DD;">            else</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#C678DD;">                throw</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">InvalidOperationException</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#98C379;">                    $&quot;获取订单 </span><span style="color:#ABB2BF;">{</span><span style="color:#E06C75;">orderId</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;"> 的锁超时&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#C678DD;">        finally</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">redisLock</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ReleaseAsync</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> DoProcessOrder</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> orderId</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 实际业务逻辑</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">CompletedTask</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-redlock-算法" tabindex="-1"><a class="header-anchor" href="#_2-redlock-算法"><span>2. Redlock 算法</span></a></h2><h3 id="_2-1-为什么需要-redlock" tabindex="-1"><a class="header-anchor" href="#_2-1-为什么需要-redlock"><span>2.1 为什么需要 Redlock</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>单节点锁的故障场景：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景1：主节点宕机，锁数据丢失</span></span>
<span class="line"><span>  ┌─────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  客户端A 在 Master 加锁成功                    │</span></span>
<span class="line"><span>  │  Master 还未将锁数据同步到 Slave               │</span></span>
<span class="line"><span>  │  Master 宕机！                                 │</span></span>
<span class="line"><span>  │  Slave 升级为新 Master                         │</span></span>
<span class="line"><span>  │  客户端B 在新 Master 加锁成功                  │</span></span>
<span class="line"><span>  │  → 两个客户端同时持有锁！                      │</span></span>
<span class="line"><span>  └─────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  时间线：</span></span>
<span class="line"><span>  ┌──────┐      ┌───────┐      ┌───────┐</span></span>
<span class="line"><span>  │Client│      │Master │      │Slave  │</span></span>
<span class="line"><span>  │  A   │      │       │      │       │</span></span>
<span class="line"><span>  └──┬───┘      └───┬───┘      └───┬───┘</span></span>
<span class="line"><span>     │  SET NX OK   │              │</span></span>
<span class="line"><span>     │─────────────▶│              │</span></span>
<span class="line"><span>     │              │  ← 还没同步   │</span></span>
<span class="line"><span>     │              │  宕机！       │</span></span>
<span class="line"><span>     │              │──────────────▶│ 升级为Master</span></span>
<span class="line"><span>     │              │              │</span></span>
<span class="line"><span>  ┌──┴───┐         │              │</span></span>
<span class="line"><span>  │Client│         │              │</span></span>
<span class="line"><span>  │  B   │         │              │</span></span>
<span class="line"><span>  └──┬───┘         │              │</span></span>
<span class="line"><span>     │  SET NX OK  │              │</span></span>
<span class="line"><span>     │────────────────────────────▶│</span></span>
<span class="line"><span>     │              │              │  ← 加锁成功！</span></span>
<span class="line"><span>     │              │              │     两个客户端持锁</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Redlock 的解决方案：</span></span>
<span class="line"><span>  在多个独立的 Redis 实例上同时加锁</span></span>
<span class="line"><span>  只有获得多数派（N/2 + 1）锁才算成功</span></span>
<span class="line"><span>  即使一个节点故障，也不影响锁的安全性</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-redlock-加锁流程" tabindex="-1"><a class="header-anchor" href="#_2-2-redlock-加锁流程"><span>2.2 Redlock 加锁流程</span></a></h3>`,13),i(d,{code:`eJx9kU9LAkEYxu99ipe9hpieU/HPql081B6ExUN/KYgECzxosJ5yFXWllg2xTLKEiFVIKiq37xL7TjvfonHGw56a48zzPL/nfefguFjePdwunYGSWgF24ip+aThuYuOOXtUKEAhEIaF69hTnJs4vUW8R65VaM1BCBW5IcElSlVznhjwP0ehCDtz3J9jc3zs6BbRvXaeJnS7Vaus7pWB0S1Yglwc5D9idu58jScQkeUyqIpHrCRqPXvsNHQtHPWJOycxhVWLcja0X+NEfIBcMwyqEFiBBkM55TGoRU2UBVZBV1oXoGunr/hLe+J6lCbZAyxydVmmvQ/ofVNNo7RuNNr1oeRNTSNJcEvchWM0qZFTJs4e/tiW25WkWWw7vqYQhAifFMgTYopYjZnhItsKUrBMx66Q/YO9+L0RhLSYmyfom8V1w7oYqCRepG9gYcOIyUnxOBP6BsDp/y7TqLA==`}),o[1]||=n(`<h3 id="_2-3-redlock-释放流程" tabindex="-1"><a class="header-anchor" href="#_2-3-redlock-释放流程"><span>2.3 Redlock 释放流程</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Redlock 释放锁：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 向所有 N 个 Redis 实例发送释放锁命令</span></span>
<span class="line"><span>2. 不管是否成功，都要发送</span></span>
<span class="line"><span>3. 使用 Lua 脚本确保只删自己的锁</span></span>
<span class="line"><span>4. 不需要多数派确认释放</span></span>
<span class="line"><span></span></span>
<span class="line"><span>为什么释放要发到所有实例？</span></span>
<span class="line"><span>  因为加锁时可能部分实例加锁成功</span></span>
<span class="line"><span>  释放时必须清理所有实例上的锁</span></span>
<span class="line"><span>  否则会留下残留锁影响后续加锁</span></span>
<span class="line"><span></span></span>
<span class="line"><span>释放命令（Lua 脚本）：</span></span>
<span class="line"><span>  向实例1: if GET key == value then DEL key</span></span>
<span class="line"><span>  向实例2: if GET key == value then DEL key</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  向实例N: if GET key == value then DEL key</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-redlock-完整算法" tabindex="-1"><a class="header-anchor" href="#_2-4-redlock-完整算法"><span>2.4 Redlock 完整算法</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Redlock 算法步骤（5个Redis实例为例）：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 1: 获取当前时间</span></span>
<span class="line"><span>  T1 = 当前毫秒时间戳</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 2: 依次尝试在5个实例上加锁</span></span>
<span class="line"><span>  对每个实例执行：</span></span>
<span class="line"><span>    SET lock_name unique_value NX EX lock_timeout</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  使用非阻塞方式，设置合理的超时时间</span></span>
<span class="line"><span>  如果某个实例无响应，立即尝试下一个</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 3: 计算加锁结果</span></span>
<span class="line"><span>  T2 = 当前毫秒时间戳</span></span>
<span class="line"><span>  加锁耗时 = T2 - T1</span></span>
<span class="line"><span>  成功加锁的实例数 = count(成功响应)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  判定条件：</span></span>
<span class="line"><span>  a) 成功实例数 ≥ 3 (5/2 + 1 = 3，多数派)</span></span>
<span class="line"><span>  b) 加锁耗时 &lt; 锁有效期</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  同时满足 a 和 b → 加锁成功</span></span>
<span class="line"><span>  否则 → 加锁失败，向所有实例发送释放命令</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 4: 计算锁的实际有效时间</span></span>
<span class="line"><span>  有效时间 = 锁有效期 - 加锁耗时</span></span>
<span class="line"><span>  例如：锁有效期30秒，加锁耗时5秒 → 实际有效25秒</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Step 5: 释放锁</span></span>
<span class="line"><span>  向所有5个实例发送释放命令（Lua脚本）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-5-c-redlock-net-实现" tabindex="-1"><a class="header-anchor" href="#_2-5-c-redlock-net-实现"><span>2.5 C# <a href="http://RedLock.net" target="_blank" rel="noopener noreferrer">RedLock.net</a> 实现</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 使用 RedLock.net 库实现 Redlock</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// NuGet: Install-Package RedLock.net</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> RedLockService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> RedLockFactory</span><span style="color:#E06C75;"> _redLockFactory</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> RedLockService</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">IEnumerable</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">RedLockEndPoint</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">endpoints</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _redLockFactory</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> RedLockFactory</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Create</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">endpoints</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 执行带锁的操作</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">T</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">ExecuteWithLockAsync</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">T</span><span style="color:#ABB2BF;">&gt;(</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> resource</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#E5C07B;"> expiry</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#E5C07B;"> wait</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#E5C07B;"> retry</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        Func</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">T</span><span style="color:#ABB2BF;">&gt;&gt; </span><span style="color:#E5C07B;">action</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 等待获取分布式锁</span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#C678DD;">using</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> redLock</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_redLockFactory</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">CreateLockAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            resource</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">expiry</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">wait</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">retry</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#61AFEF;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#56B6C2;">!</span><span style="color:#E5C07B;">redLock</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IsAcquired</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#C678DD;">                throw</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">InvalidOperationException</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#98C379;">                    $&quot;无法获取资源 </span><span style="color:#ABB2BF;">{</span><span style="color:#E06C75;">resource</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;"> 的分布式锁&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 锁获取成功，执行业务逻辑</span></span>
<span class="line"><span style="color:#E06C75;">            return</span><span style="color:#ABB2BF;"> await </span><span style="color:#61AFEF;">action</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // using 结束时自动释放锁</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 可续期的分布式锁</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">T</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">ExecuteWithExtendableLockAsync</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">T</span><span style="color:#ABB2BF;">&gt;(</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> resource</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#E5C07B;"> expiry</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#E5C07B;"> wait</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#E5C07B;"> retry</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        Func</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">T</span><span style="color:#ABB2BF;">&gt;&gt; </span><span style="color:#E5C07B;">action</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#C678DD;">using</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">var</span><span style="color:#E06C75;"> redLock</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_redLockFactory</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">CreateLockAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            resource</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">expiry</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">wait</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">retry</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#61AFEF;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#56B6C2;">!</span><span style="color:#E5C07B;">redLock</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IsAcquired</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#C678DD;">                throw</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">InvalidOperationException</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#98C379;">                    $&quot;无法获取资源 </span><span style="color:#ABB2BF;">{</span><span style="color:#E06C75;">resource</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;"> 的分布式锁&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            // 自动续期（类似 Redisson 看门狗）</span></span>
<span class="line"><span style="color:#E06C75;">            var</span><span style="color:#E06C75;"> extendTask</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Run</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">async</span><span style="color:#ABB2BF;"> () =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#C678DD;">                while</span><span style="color:#ABB2BF;"> (</span><span style="color:#D19A66;">true</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">                {</span></span>
<span class="line"><span style="color:#ABB2BF;">                    await </span><span style="color:#E5C07B;">Task</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Delay</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">expiry</span><span style="color:#56B6C2;"> /</span><span style="color:#D19A66;"> 3</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">                    await </span><span style="color:#E5C07B;">redLock</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ExtendLockAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">expiry</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">                }</span></span>
<span class="line"><span style="color:#ABB2BF;">            });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">            try</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E06C75;">                return</span><span style="color:#ABB2BF;"> await </span><span style="color:#61AFEF;">action</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#E06C75;">            finally</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // 停止续期</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 依赖注入配置</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> static</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> RedLockExtensions</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> static</span><span style="color:#E5C07B;"> IServiceCollection</span><span style="color:#61AFEF;"> AddRedLock</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        this</span><span style="color:#E5C07B;"> IServiceCollection</span><span style="color:#E5C07B;"> services</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        IConfiguration</span><span style="color:#E5C07B;"> configuration</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> endpoints</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> configuration</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">GetSection</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;RedLock:Endpoints&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">GetChildren</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">Select</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">c</span><span style="color:#ABB2BF;"> =&gt; new </span><span style="color:#E5C07B;">RedLockEndPoint</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E06C75;">                EndPoint</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">DnsEndPoint</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">                    c</span><span style="color:#ABB2BF;">[</span><span style="color:#98C379;">&quot;Host&quot;</span><span style="color:#ABB2BF;">],</span></span>
<span class="line"><span style="color:#C678DD;">                    int</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Parse</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">c</span><span style="color:#ABB2BF;">[</span><span style="color:#98C379;">&quot;Port&quot;</span><span style="color:#ABB2BF;">])),</span></span>
<span class="line"><span style="color:#E06C75;">                Password</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> c</span><span style="color:#ABB2BF;">[</span><span style="color:#98C379;">&quot;Password&quot;</span><span style="color:#ABB2BF;">],</span></span>
<span class="line"><span style="color:#E06C75;">                Config</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedLockConfiguration</span></span>
<span class="line"><span style="color:#ABB2BF;">                {</span></span>
<span class="line"><span style="color:#E06C75;">                    LockTimeout</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> TimeSpan</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FromSeconds</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">30</span><span style="color:#ABB2BF;">),</span></span>
<span class="line"><span style="color:#E06C75;">                    WaitTimeout</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> TimeSpan</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FromSeconds</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">10</span><span style="color:#ABB2BF;">),</span></span>
<span class="line"><span style="color:#E06C75;">                    RetryDelay</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> TimeSpan</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FromMilliseconds</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">200</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">                }</span></span>
<span class="line"><span style="color:#ABB2BF;">            })</span></span>
<span class="line"><span style="color:#ABB2BF;">            .</span><span style="color:#61AFEF;">ToList</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">        services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddSingleton</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">RedLockFactory</span><span style="color:#ABB2BF;">&gt;(</span><span style="color:#E5C07B;">_</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#E5C07B;">            RedLockFactory</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Create</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">endpoints</span><span style="color:#ABB2BF;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">        services</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">AddSingleton</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">RedLockService</span><span style="color:#ABB2BF;">&gt;();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#E06C75;"> services</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-redlock-争议" tabindex="-1"><a class="header-anchor" href="#_3-redlock-争议"><span>3. Redlock 争议</span></a></h2><h3 id="_3-1-martin-kleppmann-的质疑" tabindex="-1"><a class="header-anchor" href="#_3-1-martin-kleppmann-的质疑"><span>3.1 Martin Kleppmann 的质疑</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Martin Kleppmann 在《How to do distributed locking》中的质疑：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>质疑1：时钟漂移问题</span></span>
<span class="line"><span>  ┌─────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  Redlock 依赖系统时钟来判断锁的有效性                   │</span></span>
<span class="line"><span>  │  如果某个 Redis 实例的系统时钟跳变：                     │</span></span>
<span class="line"><span>  │    - 锁提前过期 → 安全性被破坏                         │</span></span>
<span class="line"><span>  │    - NTP 同步可能导致时钟回拨                          │</span></span>
<span class="line"><span>  │    - 闰秒可能导致时钟跳跃                              │</span></span>
<span class="line"><span>  │                                                       │</span></span>
<span class="line"><span>  │  场景：                                                │</span></span>
<span class="line"><span>  │  客户端A 在5个实例上加锁，获得3个锁                     │</span></span>
<span class="line"><span>  │  实例1的时钟突然跳快5秒 → 锁提前过期                    │</span></span>
<span class="line"><span>  │  客户端B 在实例1加锁成功 → 安全性被破坏                 │</span></span>
<span class="line"><span>  └─────────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>质疑2：GC 暂停问题</span></span>
<span class="line"><span>  ┌─────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  客户端A 加锁成功，正在执行业务逻辑                      │</span></span>
<span class="line"><span>  │  此时客户端A 发生长时间 GC 暂停（STW）                  │</span></span>
<span class="line"><span>  │  锁过期后客户端B 加锁成功                               │</span></span>
<span class="line"><span>  │  GC 结束后客户端A 不知道锁已过期                         │</span></span>
<span class="line"><span>  │  → 两个客户端同时持有锁                                 │</span></span>
<span class="line"><span>  └─────────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>质疑3：进程暂停问题</span></span>
<span class="line"><span>  ┌─────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  类似 GC 暂停，还可能是：                              │</span></span>
<span class="line"><span>  │    - 操作系统调度延迟                                   │</span></span>
<span class="line"><span>  │    - 虚拟化环境中的 CPU 偷取                            │</span></span>
<span class="line"><span>  │    - NUMA 架构的内存访问延迟                            │</span></span>
<span class="line"><span>  └─────────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Martin 的结论：</span></span>
<span class="line"><span>  如果需要正确性保证，应使用 Zookeeper/etcd（基于租约 + fencing token）</span></span>
<span class="line"><span>  如果只需要效率（偶尔重复执行可接受），单节点 Redis 锁就够用</span></span>
<span class="line"><span>  Redlock 介于两者之间，既不够正确，也不够简单</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-antirez-的回应" tabindex="-1"><a class="header-anchor" href="#_3-2-antirez-的回应"><span>3.2 Antirez 的回应</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Antirez（Redis 作者）的回应：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>回应1：时钟漂移</span></span>
<span class="line"><span>  ┌─────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  实际环境中时钟跳变非常罕见                             │</span></span>
<span class="line"><span>  │  合理配置 NTP 可以将时钟偏差控制在毫秒级                │</span></span>
<span class="line"><span>  │  Redlock 的锁有效期通常为秒级                           │</span></span>
<span class="line"><span>  │  毫秒级时钟偏差不影响安全性                             │</span></span>
<span class="line"><span>  │  禁止大幅时钟回拨（运维规范）                           │</span></span>
<span class="line"><span>  └─────────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>回应2：GC 暂停</span></span>
<span class="line"><span>  ┌─────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  任何分布式系统都面临 GC/网络延迟问题                    │</span></span>
<span class="line"><span>  │  Zookeeper 也有类似问题                                │</span></span>
<span class="line"><span>  │  Martin 提出的 fencing token 方案可以与 Redlock 结合   │</span></span>
<span class="line"><span>  │  在业务层使用递增 token 保证操作顺序                    │</span></span>
<span class="line"><span>  └─────────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>回应3：Fencing Token</span></span>
<span class="line"><span>  ┌─────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  Antirez 认为 fencing token 是好主意                   │</span></span>
<span class="line"><span>  │  但不需要在锁服务层实现                                 │</span></span>
<span class="line"><span>  │  可以在应用层结合 Redlock 使用                          │</span></span>
<span class="line"><span>  │  锁本身 + fencing token = 更强的一致性保证              │</span></span>
<span class="line"><span>  └─────────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Antirez 的结论：</span></span>
<span class="line"><span>  Redlock 在合理运维条件下是安全的</span></span>
<span class="line"><span>  没有完美的分布式锁，只有适合场景的方案</span></span>
<span class="line"><span>  过度追求理论正确性可能导致过度工程化</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-实践建议" tabindex="-1"><a class="header-anchor" href="#_3-3-实践建议"><span>3.3 实践建议</span></a></h3><div class="hint-container important"><p class="hint-container-title">如何看待 Redlock 争议</p><ol><li><strong>理解权衡</strong>：没有完美的分布式锁，所有方案都有边界条件</li><li><strong>场景决定选择</strong>：大多数业务场景允许偶尔的锁失效（如缓存更新），少数场景需要严格互斥（如资金操作）</li><li><strong>防御性编程</strong>：即使使用分布式锁，也要在业务层做幂等性和一致性检查</li><li><strong>Fencing Token</strong>：如果需要更强的保证，在锁的基础上加递增 token</li><li><strong>运维保障</strong>：禁止时钟大幅回拨，监控 GC 暂停时间</li></ol></div><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Fencing Token 方案：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────┐    ┌──────────┐    ┌──────────┐</span></span>
<span class="line"><span>│ 客户端 A  │    │   Redis   │    │ 存储服务  │</span></span>
<span class="line"><span>└────┬─────┘    └────┬─────┘    └────┬─────┘</span></span>
<span class="line"><span>     │  加锁(token=5) │              │</span></span>
<span class="line"><span>     │───────────────▶│              │</span></span>
<span class="line"><span>     │◀── OK ────────│              │</span></span>
<span class="line"><span>     │                │              │</span></span>
<span class="line"><span>     │  GC暂停/网络延迟│              │</span></span>
<span class="line"><span>     │  ...锁过期...   │              │</span></span>
<span class="line"><span>     │                │              │</span></span>
<span class="line"><span>  ┌──┴─────┐         │              │</span></span>
<span class="line"><span>  │ 客户端 B│         │              │</span></span>
<span class="line"><span>  └──┬─────┘         │              │</span></span>
<span class="line"><span>     │  加锁(token=6) │              │</span></span>
<span class="line"><span>     │───────────────▶│              │</span></span>
<span class="line"><span>     │◀── OK ────────│              │</span></span>
<span class="line"><span>     │                │              │</span></span>
<span class="line"><span>     │  写入(token=6)  │              │</span></span>
<span class="line"><span>     │───────────────────────────────▶│</span></span>
<span class="line"><span>     │                │    存储: max_token=6</span></span>
<span class="line"><span>     │◀── OK ────────────────────────│</span></span>
<span class="line"><span>     │                │              │</span></span>
<span class="line"><span>     │  A恢复,写入(token=5)           │</span></span>
<span class="line"><span>     │───────────────────────────────▶│</span></span>
<span class="line"><span>     │                │    5 &lt; 6, 拒绝!</span></span>
<span class="line"><span>     │◀── REJECTED ──────────────────│</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-redisson-实现" tabindex="-1"><a class="header-anchor" href="#_4-redisson-实现"><span>4. Redisson 实现</span></a></h2><h3 id="_4-1-看门狗续期机制" tabindex="-1"><a class="header-anchor" href="#_4-1-看门狗续期机制"><span>4.1 看门狗续期机制</span></a></h3>`,16),i(d,{code:`eJxLy8kvT85ILCpRCHHhUgACx2ilp+sWPevY/nz1+qddC15OabRJKtK3C3YNUfCLUHCNUDA2KFaKVdDVtVNwqoYoeNYx4WnXfPtasH4nkFTNsxnraxScgUZNABqy4vmc7pfTVzzvng426um6Wc+mb3uye/fTroVKsUiank5YVqPgEv1i/5Sns+dBjH66ZOOLLUshipzBlrpGKz1b369gaFCs8Gxxw7P5S4Gqnndte9YAcWdOfnJ2eGJJckZKfnpIZm5qfmmJgr6CMdQeV7ARbtVAPU92975YtPpZT+OzOZ1Qp7shnO4e/Xz32mdz5lspBLhGBHgGuYK8DTHDHeIMJB1gd3tEw335tHHOs7WLIKrBhGc0PEifzdj3dE//y/auZ1P2AV0BCUivaIgWuAkQvV5gSQ8uMKe4pDInFRgGaZk5OVbKqRZppqmWSBLuqBIAXbTE+Q==`}),o[2]||=n(`<div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Redisson 看门狗原理：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>默认配置：</span></span>
<span class="line"><span>  - 锁持有时间（lockWatchdogTimeout）：30 秒</span></span>
<span class="line"><span>  - 续期间隔：30 / 3 = 10 秒</span></span>
<span class="line"><span>  - 每次续期重置为 30 秒</span></span>
<span class="line"><span></span></span>
<span class="line"><span>看门狗续期 Lua 脚本（Redisson 源码）：</span></span>
<span class="line"><span>  if redis.call(&#39;hexists&#39;, KEYS[1], ARGV[2]) == 1 then</span></span>
<span class="line"><span>      redis.call(&#39;pexpire&#39;, KEYS[1], ARGV[1])</span></span>
<span class="line"><span>      return 1</span></span>
<span class="line"><span>  end</span></span>
<span class="line"><span>  return 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  KEYS[1] = 锁名称</span></span>
<span class="line"><span>  ARGV[1] = 过期时间（毫秒）</span></span>
<span class="line"><span>  ARGV[2] = 客户端标识（groupId:threadId）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>关键特性：</span></span>
<span class="line"><span>  ✅ 自动续期 —— 只要客户端存活且未释放锁，锁不会过期</span></span>
<span class="line"><span>  ✅ 崩溃安全 —— 客户端崩溃后看门狗停止，锁自动过期</span></span>
<span class="line"><span>  ✅ 可配置 —— lockWatchdogTimeout 可自定义</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-redisson-可重入锁原理" tabindex="-1"><a class="header-anchor" href="#_4-2-redisson-可重入锁原理"><span>4.2 Redisson 可重入锁原理</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Redisson 可重入锁的数据结构：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Redis Hash 结构：</span></span>
<span class="line"><span>  Key:   lock_name</span></span>
<span class="line"><span>  Field: client_id:thread_id</span></span>
<span class="line"><span>  Value: 重入次数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例：</span></span>
<span class="line"><span>  HSET mylock &quot;client1:thread1&quot; 2   ← 重入2次</span></span>
<span class="line"><span></span></span>
<span class="line"><span>加锁 Lua 脚本（简化版 Redisson 源码）：</span></span>
<span class="line"><span>  -- 锁不存在，直接加锁</span></span>
<span class="line"><span>  if redis.call(&#39;exists&#39;, KEYS[1]) == 0 then</span></span>
<span class="line"><span>      redis.call(&#39;hset&#39;, KEYS[1], ARGV[2], 1)</span></span>
<span class="line"><span>      redis.call(&#39;pexpire&#39;, KEYS[1], ARGV[1])</span></span>
<span class="line"><span>      return nil</span></span>
<span class="line"><span>  end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  -- 锁被自己持有，重入计数+1</span></span>
<span class="line"><span>  if redis.call(&#39;hexists&#39;, KEYS[1], ARGV[2]) == 1 then</span></span>
<span class="line"><span>      redis.call(&#39;hincrby&#39;, KEYS[1], ARGV[2], 1)</span></span>
<span class="line"><span>      redis.call(&#39;pexpire&#39;, KEYS[1], ARGV[1])</span></span>
<span class="line"><span>      return nil</span></span>
<span class="line"><span>  end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  -- 锁被其他人持有，返回剩余时间</span></span>
<span class="line"><span>  return redis.call(&#39;pttl&#39;, KEYS[1])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>解锁 Lua 脚本：</span></span>
<span class="line"><span>  -- 不是自己的锁</span></span>
<span class="line"><span>  if redis.call(&#39;hexists&#39;, KEYS[1], ARGV[2]) == 0 then</span></span>
<span class="line"><span>      return nil</span></span>
<span class="line"><span>  end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  -- 重入计数-1</span></span>
<span class="line"><span>  local counter = redis.call(&#39;hincrby&#39;, KEYS[1], ARGV[2], -1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  -- 还有重入，续期</span></span>
<span class="line"><span>  if counter &gt; 0 then</span></span>
<span class="line"><span>      redis.call(&#39;pexpire&#39;, KEYS[1], ARGV[1])</span></span>
<span class="line"><span>      return 0</span></span>
<span class="line"><span>  end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  -- 重入为0，释放锁</span></span>
<span class="line"><span>  redis.call(&#39;del&#39;, KEYS[1])</span></span>
<span class="line"><span>  redis.call(&#39;publish&#39;, KEYS[2], ARGV[1])  -- 通知等待者</span></span>
<span class="line"><span>  return 1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-redisson-公平锁" tabindex="-1"><a class="header-anchor" href="#_4-3-redisson-公平锁"><span>4.3 Redisson 公平锁</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>公平锁原理 —— 按请求顺序获取锁：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>数据结构：</span></span>
<span class="line"><span>  1. Hash: lock_name → {clientId:threadId: count}  （锁持有信息）</span></span>
<span class="line"><span>  2. List: lock_name:queue → [thread1, thread2]    （等待队列）</span></span>
<span class="line"><span>  3. Hash: lock_name:timeout → {thread: timeout}    （超时时间）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>加锁流程：</span></span>
<span class="line"><span>  ┌─────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  1. 尝试直接加锁（同可重入锁）                        │</span></span>
<span class="line"><span>  │  2. 加锁失败 → 加入等待队列尾部                       │</span></span>
<span class="line"><span>  │  3. 订阅锁释放消息                                   │</span></span>
<span class="line"><span>  │  4. 收到释放消息 → 尝试获取锁                         │</span></span>
<span class="line"><span>  │  5. 队列中第一个等待者优先获取                        │</span></span>
<span class="line"><span>  │  6. 获取超时 → 从队列移除                            │</span></span>
<span class="line"><span>  └─────────────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>公平性保证：</span></span>
<span class="line"><span>  - 等待队列先进先出（FIFO）</span></span>
<span class="line"><span>  - 新请求排在队尾</span></span>
<span class="line"><span>  - 锁释放时队列头部优先获取</span></span>
<span class="line"><span>  - 避免锁饥饿问题</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-redisson-读写锁" tabindex="-1"><a class="header-anchor" href="#_4-4-redisson-读写锁"><span>4.4 Redisson 读写锁</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>读写锁原理 —— 读读共享，读写互斥：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>数据结构：</span></span>
<span class="line"><span>  Hash: lock_name → {</span></span>
<span class="line"><span>      mode: &quot;read&quot; / &quot;write&quot;,</span></span>
<span class="line"><span>      owner: clientId:threadId,</span></span>
<span class="line"><span>      readers: {thread1: 1, thread2: 1, ...}</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>锁兼容矩阵：</span></span>
<span class="line"><span>  ┌──────────┬──────────┬──────────┐</span></span>
<span class="line"><span>  │          │  读锁     │  写锁     │</span></span>
<span class="line"><span>  ├──────────┼──────────┼──────────┤</span></span>
<span class="line"><span>  │  读锁     │  ✅ 共享  │  ❌ 互斥  │</span></span>
<span class="line"><span>  │  写锁     │  ❌ 互斥  │  ❌ 互斥  │</span></span>
<span class="line"><span>  └──────────┴──────────┴──────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>适用场景：</span></span>
<span class="line"><span>  - 读多写少的缓存场景</span></span>
<span class="line"><span>  - 配置中心（读频繁，写偶尔）</span></span>
<span class="line"><span>  - 用户信息缓存（读多写少）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-分布式锁正确姿势" tabindex="-1"><a class="header-anchor" href="#_5-分布式锁正确姿势"><span>5. 分布式锁正确姿势</span></a></h2><h3 id="_5-1-防死锁" tabindex="-1"><a class="header-anchor" href="#_5-1-防死锁"><span>5.1 防死锁</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>死锁场景及防范：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景1：锁未设置过期时间</span></span>
<span class="line"><span>  SET lock_key value NX   ← 没有 EX！</span></span>
<span class="line"><span>  → 如果客户端崩溃，锁永远不会释放</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  防范：始终设置过期时间</span></span>
<span class="line"><span>  SET lock_key value NX EX 30</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景2：过期时间太短</span></span>
<span class="line"><span>  SET lock_key value NX EX 1   ← 1秒过期</span></span>
<span class="line"><span>  → 业务执行3秒，锁提前过期</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  防范：过期时间 = 预估最长执行时间 × 3</span></span>
<span class="line"><span>  或使用看门狗自动续期</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景3：客户端崩溃无法释放锁</span></span>
<span class="line"><span>  → 依赖过期时间兜底</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景4：解锁失败</span></span>
<span class="line"><span>  → 过期时间兜底，但可能导致等待时间过长</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  防范：解锁时捕获异常，不影响主流程</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-防误删" tabindex="-1"><a class="header-anchor" href="#_5-2-防误删"><span>5.2 防误删</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>误删场景及防范：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景1：解锁时删除了别人的锁</span></span>
<span class="line"><span>  → 使用 Lua 脚本：先判断 value 再删除</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景2：锁过期后被其他客户端获取，原客户端仍在执行</span></span>
<span class="line"><span>  → Fencing Token 方案</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景3：SET 和 EX 非原子操作（旧版本 Redis）</span></span>
<span class="line"><span>  → Redis 2.6.12+ 支持 SET NX EX 原子命令</span></span>
<span class="line"><span>  → 旧版本使用 Lua 脚本保证原子性</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-防续期失败" tabindex="-1"><a class="header-anchor" href="#_5-3-防续期失败"><span>5.3 防续期失败</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>续期失败场景及防范：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景1：看门狗续期时网络分区</span></span>
<span class="line"><span>  ┌──────────────────────────────────────────────┐</span></span>
<span class="line"><span>  │  客户端A 持有锁，看门狗尝试续期                  │</span></span>
<span class="line"><span>  │  网络分区 → 续期请求未到达 Redis                  │</span></span>
<span class="line"><span>  │  锁过期 → 客户端B 加锁成功                       │</span></span>
<span class="line"><span>  │  网络恢复 → 客户端A 仍在执行                      │</span></span>
<span class="line"><span>  │  → 两个客户端同时持有锁                           │</span></span>
<span class="line"><span>  └──────────────────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  防范：</span></span>
<span class="line"><span>  1. 续期失败时主动释放锁</span></span>
<span class="line"><span>  2. 业务执行前检查锁状态</span></span>
<span class="line"><span>  3. 使用 Fencing Token</span></span>
<span class="line"><span>  4. 业务层做幂等处理</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景2：看门狗线程被 GC 暂停</span></span>
<span class="line"><span>  → 类似 Redlock GC 问题</span></span>
<span class="line"><span>  → 合理设置 JVM 参数，减少 STW 时间</span></span>
<span class="line"><span></span></span>
<span class="line"><span>场景3：Redis 主从切换导致续期丢失</span></span>
<span class="line"><span>  → 使用 Redlock 多节点方案</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-完整的分布式锁检查清单" tabindex="-1"><a class="header-anchor" href="#_5-4-完整的分布式锁检查清单"><span>5.4 完整的分布式锁检查清单</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>┌──────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│               分布式锁生产级检查清单                         │</span></span>
<span class="line"><span>├──────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  加锁：                                                     │</span></span>
<span class="line"><span>│  ☑ 使用 SET NX EX 原子命令（或 Lua 脚本）                   │</span></span>
<span class="line"><span>│  ☑ 设置合理的过期时间（最长执行时间 × 3）                    │</span></span>
<span class="line"><span>│  ☑ 使用唯一值标识锁的持有者                                  │</span></span>
<span class="line"><span>│  ☑ 加锁失败时重试，设置最大重试次数                          │</span></span>
<span class="line"><span>│  ☑ 重试间隔加随机退避，避免惊群效应                          │</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  解锁：                                                     │</span></span>
<span class="line"><span>│  ☑ 使用 Lua 脚本原子解锁                                    │</span></span>
<span class="line"><span>│  ☑ 解锁时验证持有者身份                                     │</span></span>
<span class="line"><span>│  ☑ 解锁异常不影响主流程                                     │</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  续期：                                                     │</span></span>
<span class="line"><span>│  ☑ 长时间任务使用看门狗自动续期                              │</span></span>
<span class="line"><span>│  ☑ 续期失败时主动释放锁                                     │</span></span>
<span class="line"><span>│  ☑ 续期间隔 ≤ 过期时间 / 3                                  │</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>│  容错：                                                     │</span></span>
<span class="line"><span>│  ☑ 业务层做幂等处理                                         │</span></span>
<span class="line"><span>│  ☑ 考虑使用 Fencing Token                                   │</span></span>
<span class="line"><span>│  ☑ 监控锁的获取/释放/超时事件                                │</span></span>
<span class="line"><span>│  ☑ 设置告警：锁等待超时 / 锁持有超时                         │</span></span>
<span class="line"><span>│                                                            │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-c-完整实现" tabindex="-1"><a class="header-anchor" href="#_6-c-完整实现"><span>6. C# 完整实现</span></a></h2><h3 id="_6-1-基于-stackexchange-redis-的可重入锁" tabindex="-1"><a class="header-anchor" href="#_6-1-基于-stackexchange-redis-的可重入锁"><span>6.1 基于 StackExchange.Redis 的可重入锁</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// 可重入分布式锁完整实现</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> RedisReentrantLock</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> IDatabase</span><span style="color:#E06C75;"> _db</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#C678DD;"> string</span><span style="color:#E06C75;"> _lockKey</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#C678DD;"> string</span><span style="color:#E06C75;"> _lockValue</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> TimeSpan</span><span style="color:#E06C75;"> _expiry</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> int</span><span style="color:#E06C75;"> _reentryCount</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#E5C07B;"> Timer</span><span style="color:#ABB2BF;">? </span><span style="color:#E06C75;">_watchdog</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 加锁 Lua 脚本（可重入）</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> static</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#E06C75;"> _acquireScript</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Prepare</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">@&quot;</span></span>
<span class="line"><span style="color:#98C379;">        -- 锁不存在，直接加锁</span></span>
<span class="line"><span style="color:#98C379;">        if redis.call(&#39;exists&#39;, KEYS[1]) == 0 then</span></span>
<span class="line"><span style="color:#98C379;">            redis.call(&#39;hset&#39;, KEYS[1], ARGV[2], 1)</span></span>
<span class="line"><span style="color:#98C379;">            redis.call(&#39;pexpire&#39;, KEYS[1], ARGV[1])</span></span>
<span class="line"><span style="color:#98C379;">            return 1</span></span>
<span class="line"><span style="color:#98C379;">        end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">        -- 锁被自己持有，重入计数+1</span></span>
<span class="line"><span style="color:#98C379;">        if redis.call(&#39;hexists&#39;, KEYS[1], ARGV[2]) == 1 then</span></span>
<span class="line"><span style="color:#98C379;">            redis.call(&#39;hincrby&#39;, KEYS[1], ARGV[2], 1)</span></span>
<span class="line"><span style="color:#98C379;">            redis.call(&#39;pexpire&#39;, KEYS[1], ARGV[1])</span></span>
<span class="line"><span style="color:#98C379;">            return 1</span></span>
<span class="line"><span style="color:#98C379;">        end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">        -- 锁被其他人持有</span></span>
<span class="line"><span style="color:#98C379;">        return 0</span></span>
<span class="line"><span style="color:#98C379;">    &quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 解锁 Lua 脚本（可重入）</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> static</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#E06C75;"> _releaseScript</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Prepare</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">@&quot;</span></span>
<span class="line"><span style="color:#98C379;">        -- 不是自己的锁</span></span>
<span class="line"><span style="color:#98C379;">        if redis.call(&#39;hexists&#39;, KEYS[1], ARGV[2]) == 0 then</span></span>
<span class="line"><span style="color:#98C379;">            return 0</span></span>
<span class="line"><span style="color:#98C379;">        end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">        -- 重入计数-1</span></span>
<span class="line"><span style="color:#98C379;">        local counter = redis.call(&#39;hincrby&#39;, KEYS[1], ARGV[2], -1)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">        -- 还有重入</span></span>
<span class="line"><span style="color:#98C379;">        if counter &gt; 0 then</span></span>
<span class="line"><span style="color:#98C379;">            redis.call(&#39;pexpire&#39;, KEYS[1], ARGV[1])</span></span>
<span class="line"><span style="color:#98C379;">            return counter</span></span>
<span class="line"><span style="color:#98C379;">        end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">        -- 释放锁</span></span>
<span class="line"><span style="color:#98C379;">        redis.call(&#39;del&#39;, KEYS[1])</span></span>
<span class="line"><span style="color:#98C379;">        return 1</span></span>
<span class="line"><span style="color:#98C379;">    &quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 续期 Lua 脚本</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> static</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#E06C75;"> _renewScript</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> LuaScript</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Prepare</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">@&quot;</span></span>
<span class="line"><span style="color:#98C379;">        if redis.call(&#39;hexists&#39;, KEYS[1], ARGV[2]) == 1 then</span></span>
<span class="line"><span style="color:#98C379;">            redis.call(&#39;pexpire&#39;, KEYS[1], ARGV[1])</span></span>
<span class="line"><span style="color:#98C379;">            return 1</span></span>
<span class="line"><span style="color:#98C379;">        end</span></span>
<span class="line"><span style="color:#98C379;">        return 0</span></span>
<span class="line"><span style="color:#98C379;">    &quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> RedisReentrantLock</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        IDatabase</span><span style="color:#E5C07B;"> db</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> lockKey</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">TimeSpan</span><span style="color:#E5C07B;"> expiry</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _db</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> db</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _lockKey</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> lockKey</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _lockValue</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> $&quot;</span><span style="color:#ABB2BF;">{</span><span style="color:#E5C07B;">Environment</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">MachineName</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">:</span><span style="color:#ABB2BF;">{</span><span style="color:#E5C07B;">Thread</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">CurrentThread</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">ManagedThreadId</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">:</span><span style="color:#ABB2BF;">{</span><span style="color:#E5C07B;">Guid</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">NewGuid</span><span style="color:#ABB2BF;">():</span><span style="color:#E06C75;">N</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _expiry</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> expiry</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _reentryCount</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 获取锁</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#C678DD;">bool</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">AcquireAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#E5C07B;"> timeout</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">TimeSpan</span><span style="color:#E5C07B;"> retryInterval</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> deadline</span><span style="color:#56B6C2;"> =</span><span style="color:#E5C07B;"> DateTime</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">UtcNow</span><span style="color:#56B6C2;"> +</span><span style="color:#E06C75;"> timeout</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        while</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">DateTime</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">UtcNow</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> deadline</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            var</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ScriptEvaluateAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">                _acquireScript</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">                new</span></span>
<span class="line"><span style="color:#ABB2BF;">                {</span></span>
<span class="line"><span style="color:#E06C75;">                    KEYS</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisKey</span><span style="color:#ABB2BF;">[] { </span><span style="color:#E06C75;">_lockKey</span><span style="color:#ABB2BF;"> },</span></span>
<span class="line"><span style="color:#E06C75;">                    ARGV</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisValue</span><span style="color:#ABB2BF;">[]</span></span>
<span class="line"><span style="color:#ABB2BF;">                    {</span></span>
<span class="line"><span style="color:#ABB2BF;">                        (</span><span style="color:#C678DD;">long</span><span style="color:#ABB2BF;">)</span><span style="color:#E5C07B;">_expiry</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">TotalMilliseconds</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">                        _lockValue</span></span>
<span class="line"><span style="color:#ABB2BF;">                    }</span></span>
<span class="line"><span style="color:#ABB2BF;">                });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> ((</span><span style="color:#C678DD;">long</span><span style="color:#ABB2BF;">)</span><span style="color:#E06C75;">result</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E06C75;">                _reentryCount</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#61AFEF;">                StartWatchdog</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#C678DD;">                return</span><span style="color:#D19A66;"> true</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#E5C07B;">Task</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">Delay</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">retryInterval</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> false</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 释放锁</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> ReleaseAsync</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _reentryCount</span><span style="color:#56B6C2;">--</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ScriptEvaluateAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">            _releaseScript</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">            new</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E06C75;">                KEYS</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisKey</span><span style="color:#ABB2BF;">[] { </span><span style="color:#E06C75;">_lockKey</span><span style="color:#ABB2BF;"> },</span></span>
<span class="line"><span style="color:#E06C75;">                ARGV</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisValue</span><span style="color:#ABB2BF;">[]</span></span>
<span class="line"><span style="color:#ABB2BF;">                {</span></span>
<span class="line"><span style="color:#ABB2BF;">                    (</span><span style="color:#C678DD;">long</span><span style="color:#ABB2BF;">)</span><span style="color:#E5C07B;">_expiry</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">TotalMilliseconds</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">                    _lockValue</span></span>
<span class="line"><span style="color:#ABB2BF;">                }</span></span>
<span class="line"><span style="color:#ABB2BF;">            });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">_reentryCount</span><span style="color:#56B6C2;"> &lt;=</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#61AFEF;">            StopWatchdog</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 启动看门狗</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> void</span><span style="color:#61AFEF;"> StartWatchdog</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (</span><span style="color:#E06C75;">_watchdog</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">return</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        var</span><span style="color:#E06C75;"> interval</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">int</span><span style="color:#ABB2BF;">)(</span><span style="color:#E5C07B;">_expiry</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">TotalMilliseconds</span><span style="color:#56B6C2;"> /</span><span style="color:#D19A66;"> 3</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E06C75;">        _watchdog</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">Timer</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">async</span><span style="color:#E5C07B;"> _</span><span style="color:#ABB2BF;"> =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#C678DD;">            try</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#ABB2BF;">                await </span><span style="color:#E5C07B;">_db</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">ScriptEvaluateAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">                    _renewScript</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">                    new</span></span>
<span class="line"><span style="color:#ABB2BF;">                    {</span></span>
<span class="line"><span style="color:#E06C75;">                        KEYS</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisKey</span><span style="color:#ABB2BF;">[] { </span><span style="color:#E06C75;">_lockKey</span><span style="color:#ABB2BF;"> },</span></span>
<span class="line"><span style="color:#E06C75;">                        ARGV</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">RedisValue</span><span style="color:#ABB2BF;">[]</span></span>
<span class="line"><span style="color:#ABB2BF;">                        {</span></span>
<span class="line"><span style="color:#ABB2BF;">                            (</span><span style="color:#C678DD;">long</span><span style="color:#ABB2BF;">)</span><span style="color:#E5C07B;">_expiry</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">TotalMilliseconds</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">                            _lockValue</span></span>
<span class="line"><span style="color:#ABB2BF;">                        }</span></span>
<span class="line"><span style="color:#ABB2BF;">                    });</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#C678DD;">            catch</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // 续期失败，停止看门狗</span></span>
<span class="line"><span style="color:#61AFEF;">                StopWatchdog</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }, </span><span style="color:#D19A66;">null</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">interval</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">interval</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 停止看门狗</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> void</span><span style="color:#61AFEF;"> StopWatchdog</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        _watchdog</span><span style="color:#ABB2BF;">?.</span><span style="color:#61AFEF;">Dispose</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#E06C75;">        _watchdog</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-基于-redlock-net-的分布式锁" tabindex="-1"><a class="header-anchor" href="#_6-2-基于-redlock-net-的分布式锁"><span>6.2 基于 <a href="http://RedLock.net" target="_blank" rel="noopener noreferrer">RedLock.net</a> 的分布式锁</span></a></h3><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#7F848E;font-style:italic;">// RedLock.net 封装</span></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> DistributedLockService</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> RedLockFactory</span><span style="color:#E06C75;"> _redLockFactory</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    private</span><span style="color:#C678DD;"> readonly</span><span style="color:#E5C07B;"> ILogger</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">DistributedLockService</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E06C75;">_logger</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> DistributedLockService</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E5C07B;">        RedLockFactory</span><span style="color:#E5C07B;"> redLockFactory</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        ILogger</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">DistributedLockService</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">logger</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        _redLockFactory</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> redLockFactory</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#E06C75;">        _logger</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> logger</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 执行带锁的操作</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">T</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#61AFEF;">WithLockAsync</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">T</span><span style="color:#ABB2BF;">&gt;(</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> resource</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        Func</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">Task</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">T</span><span style="color:#ABB2BF;">&gt;&gt; </span><span style="color:#E5C07B;">action</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">expiry</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">wait</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">retry</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E06C75;">        expiry</span><span style="color:#C678DD;"> ??=</span><span style="color:#E5C07B;"> TimeSpan</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FromSeconds</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">30</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E06C75;">        wait</span><span style="color:#C678DD;"> ??=</span><span style="color:#E5C07B;"> TimeSpan</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FromSeconds</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">10</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#E06C75;">        retry</span><span style="color:#C678DD;"> ??=</span><span style="color:#E5C07B;"> TimeSpan</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">FromMilliseconds</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">200</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">        IRedLock</span><span style="color:#ABB2BF;">? </span><span style="color:#E06C75;">redLock</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        try</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E06C75;">            redLock</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> await </span><span style="color:#E5C07B;">_redLockFactory</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">CreateLockAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;">                resource</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">expiry</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Value</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">wait</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Value</span><span style="color:#ABB2BF;">, </span><span style="color:#E5C07B;">retry</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Value</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (</span><span style="color:#56B6C2;">!</span><span style="color:#E5C07B;">redLock</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">IsAcquired</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            {</span></span>
<span class="line"><span style="color:#E5C07B;">                _logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">LogWarning</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#98C379;">                    &quot;获取分布式锁失败: Resource={Resource}, &quot;</span><span style="color:#56B6C2;"> +</span></span>
<span class="line"><span style="color:#98C379;">                    &quot;Expiry={Expiry}, Wait={Wait}&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;">                    resource</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">expiry</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">wait</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">                throw</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">DistributedLockException</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#98C379;">                    $&quot;获取分布式锁超时: </span><span style="color:#ABB2BF;">{</span><span style="color:#E06C75;">resource</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">            _logger</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">LogDebug</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#98C379;">                &quot;获取分布式锁成功: Resource={Resource}, &quot;</span><span style="color:#56B6C2;"> +</span></span>
<span class="line"><span style="color:#98C379;">                &quot;Expiry={Expiry}&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">resource</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">expiry</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#ABB2BF;"> await </span><span style="color:#61AFEF;">action</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#C678DD;">        finally</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#E5C07B;">            redLock</span><span style="color:#ABB2BF;">?.</span><span style="color:#61AFEF;">Dispose</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// 执行带锁的操作（无返回值）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    /// </span><span style="color:#ABB2BF;font-style:italic;">&lt;/</span><span style="color:#E06C75;font-style:italic;">summary</span><span style="color:#ABB2BF;font-style:italic;">&gt;</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#C678DD;"> async</span><span style="color:#E5C07B;"> Task</span><span style="color:#61AFEF;"> WithLockAsync</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#C678DD;">        string</span><span style="color:#E5C07B;"> resource</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        Func</span><span style="color:#ABB2BF;">&lt;</span><span style="color:#E5C07B;">Task</span><span style="color:#ABB2BF;">&gt; </span><span style="color:#E5C07B;">action</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">expiry</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">wait</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E5C07B;">        TimeSpan</span><span style="color:#ABB2BF;">? </span><span style="color:#E5C07B;">retry</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#ABB2BF;">        await </span><span style="color:#61AFEF;">WithLockAsync</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">resource</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">async</span><span style="color:#ABB2BF;"> () =&gt;</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#ABB2BF;">            await </span><span style="color:#61AFEF;">action</span><span style="color:#ABB2BF;">();</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> true</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }, </span><span style="color:#E06C75;">expiry</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">wait</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">retry</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">public</span><span style="color:#C678DD;"> class</span><span style="color:#E5C07B;"> DistributedLockException</span><span style="color:#ABB2BF;"> : </span><span style="color:#E5C07B;">Exception</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    public</span><span style="color:#61AFEF;"> DistributedLockException</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">string</span><span style="color:#E5C07B;"> message</span><span style="color:#ABB2BF;">) : </span><span style="color:#E5C07B;">base</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">message</span><span style="color:#ABB2BF;">) { }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-zookeeper-锁对比" tabindex="-1"><a class="header-anchor" href="#_7-zookeeper-锁对比"><span>7. Zookeeper 锁对比</span></a></h2><h3 id="_7-1-实现原理对比" tabindex="-1"><a class="header-anchor" href="#_7-1-实现原理对比"><span>7.1 实现原理对比</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>┌──────────────────┬───────────────────┬───────────────────────┐</span></span>
<span class="line"><span>│  维度             │  Redis 锁          │  Zookeeper 锁           │</span></span>
<span class="line"><span>├──────────────────┼───────────────────┼───────────────────────┤</span></span>
<span class="line"><span>│  实现方式         │  SET NX EX        │  临时顺序节点            │</span></span>
<span class="line"><span>│  一致性协议       │  无 / Gossip      │  ZAB（强一致性）         │</span></span>
<span class="line"><span>│  锁过期           │  超时自动释放      │  会话断开自动删除         │</span></span>
<span class="line"><span>│  公平性           │  非公平（默认）    │  公平（顺序节点）         │</span></span>
<span class="line"><span>│  可重入           │  需自行实现        │  InterProcessMutex      │</span></span>
<span class="line"><span>│  性能             │  高（内存操作）    │  中（磁盘 + 网络）       │</span></span>
<span class="line"><span>│  延迟             │  微秒级           │  毫秒级                 │</span></span>
<span class="line"><span>│  吞吐量           │  10万+ QPS        │  1万+ QPS              │</span></span>
<span class="line"><span>│  运维复杂度       │  低               │  高                     │</span></span>
<span class="line"><span>│  依赖             │  Redis 集群       │  Zookeeper 集群          │</span></span>
<span class="line"><span>│  时钟依赖         │  是（过期时间）    │  否（基于租约）          │</span></span>
<span class="line"><span>│  GC 影响          │  可能导致锁失效    │  可能导致会话过期         │</span></span>
<span class="line"><span>│  社区生态         │  广泛             │  Hadoop 体系             │</span></span>
<span class="line"><span>└──────────────────┴───────────────────┴───────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-zookeeper-锁原理" tabindex="-1"><a class="header-anchor" href="#_7-2-zookeeper-锁原理"><span>7.2 Zookeeper 锁原理</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>Zookeeper 分布式锁原理（临时顺序节点）：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 创建锁节点</span></span>
<span class="line"><span>   /locks/resource-lock/</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 客户端创建临时顺序子节点</span></span>
<span class="line"><span>   /locks/resource-lock/lock-0000000001</span></span>
<span class="line"><span>   /locks/resource-lock/lock-0000000002</span></span>
<span class="line"><span>   /locks/resource-lock/lock-0000000003</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 判断是否获得锁</span></span>
<span class="line"><span>   - 获取所有子节点，排序</span></span>
<span class="line"><span>   - 如果自己是最小编号 → 获得锁</span></span>
<span class="line"><span>   - 否则 → Watch 前一个节点的删除事件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 释放锁</span></span>
<span class="line"><span>   - 删除自己的临时节点</span></span>
<span class="line"><span>   - 下一个节点收到 Watch 通知</span></span>
<span class="line"><span>   - 下一个节点成为新的锁持有者</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  /locks/resource-lock/                                │</span></span>
<span class="line"><span>│  ├── lock-0000000001  ← 持有锁的客户端                 │</span></span>
<span class="line"><span>│  ├── lock-0000000002  ← 等待 lock-1 删除              │</span></span>
<span class="line"><span>│  └── lock-0000000003  ← 等待 lock-2 删除              │</span></span>
<span class="line"><span>│                                                        │</span></span>
<span class="line"><span>│  公平性保证：                                           │</span></span>
<span class="line"><span>│  • 顺序节点保证 FIFO                                    │</span></span>
<span class="line"><span>│  • 每个客户端只 Watch 前一个节点（避免惊群效应）          │</span></span>
<span class="line"><span>│  • 客户端断开会话，临时节点自动删除                       │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-选型建议" tabindex="-1"><a class="header-anchor" href="#_7-3-选型建议"><span>7.3 选型建议</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>┌──────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                 锁方案选型建议                               │</span></span>
<span class="line"><span>├──────────────────────┬───────────────────────────────────┤</span></span>
<span class="line"><span>│  场景                 │  推荐方案                           │</span></span>
<span class="line"><span>├──────────────────────┼───────────────────────────────────┤</span></span>
<span class="line"><span>│  缓存更新/防重复      │  单节点 Redis 锁                    │</span></span>
<span class="line"><span>│  定时任务防重复执行    │  单节点 Redis 锁                    │</span></span>
<span class="line"><span>│  订单防重复支付       │  Redlock + Fencing Token            │</span></span>
<span class="line"><span>│  库存扣减            │  Redlock 或 数据库乐观锁             │</span></span>
<span class="line"><span>│  配置中心分布式锁     │  Zookeeper                          │</span></span>
<span class="line"><span>│  大数据任务调度       │  Zookeeper                          │</span></span>
<span class="line"><span>│  微服务选主           │  Zookeeper / etcd                   │</span></span>
<span class="line"><span>│  高性能短锁           │  Redis（单节点或 Redlock）           │</span></span>
<span class="line"><span>│  强一致性要求         │  Zookeeper / etcd                   │</span></span>
<span class="line"><span>└──────────────────────┴───────────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>选型核心原则：</span></span>
<span class="line"><span>  1. 大多数场景单节点 Redis 锁够用</span></span>
<span class="line"><span>  2. 需要更高安全性 → Redlock</span></span>
<span class="line"><span>  3. 需要强一致性 → Zookeeper/etcd</span></span>
<span class="line"><span>  4. 已有 Redis 基础设施 → 优先用 Redis 锁</span></span>
<span class="line"><span>  5. 已有 Zookeeper → 直接用 ZK 锁</span></span>
<span class="line"><span>  6. 不要过度设计，适合就好</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_8-生产级建议" tabindex="-1"><a class="header-anchor" href="#_8-生产级建议"><span>8. 生产级建议</span></a></h2><h3 id="_8-1-监控与告警" tabindex="-1"><a class="header-anchor" href="#_8-1-监控与告警"><span>8.1 监控与告警</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>分布式锁监控指标：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌──────────────────┬───────────────────────┬─────────────────┐</span></span>
<span class="line"><span>│  指标             │  告警阈值               │  说明             │</span></span>
<span class="line"><span>├──────────────────┼───────────────────────┼─────────────────┤</span></span>
<span class="line"><span>│  锁获取失败率     │  &gt; 5%                  │  锁竞争激烈       │</span></span>
<span class="line"><span>│  锁等待时间 P99   │  &gt; 5s                  │  业务执行过长     │</span></span>
<span class="line"><span>│  锁持有时间 P99   │  &gt; 30s                 │  可能未释放       │</span></span>
<span class="line"><span>│  锁续期失败率     │  &gt; 1%                  │  网络或 Redis 异常│</span></span>
<span class="line"><span>│  锁意外过期次数   │  &gt; 0                   │  需要排查         │</span></span>
<span class="line"><span>│  看门狗续期延迟   │  &gt; 过期时间/3           │  续期不及时       │</span></span>
<span class="line"><span>└──────────────────┴───────────────────────┴─────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Redis 监控命令：</span></span>
<span class="line"><span>  # 查看锁 Key 的 TTL</span></span>
<span class="line"><span>  TTL lock_key</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 查看锁的类型和编码</span></span>
<span class="line"><span>  TYPE lock_key</span></span>
<span class="line"><span>  OBJECT ENCODING lock_key</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 监控锁的获取和释放（开发环境）</span></span>
<span class="line"><span>  MONITOR  | grep &quot;lock_key&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-常见问题排查" tabindex="-1"><a class="header-anchor" href="#_8-2-常见问题排查"><span>8.2 常见问题排查</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>问题1：锁获取超时</span></span>
<span class="line"><span>  原因：</span></span>
<span class="line"><span>    - 业务执行时间超过锁过期时间</span></span>
<span class="line"><span>    - 锁竞争激烈</span></span>
<span class="line"><span>    - Redis 响应慢</span></span>
<span class="line"><span>  排查：</span></span>
<span class="line"><span>    - 检查锁持有时间分布</span></span>
<span class="line"><span>    - 检查业务是否有慢操作</span></span>
<span class="line"><span>    - 检查 Redis 慢查询日志</span></span>
<span class="line"><span></span></span>
<span class="line"><span>问题2：锁提前过期</span></span>
<span class="line"><span>  原因：</span></span>
<span class="line"><span>    - 过期时间设置过短</span></span>
<span class="line"><span>    - 看门狗续期失败</span></span>
<span class="line"><span>    - 时钟回拨</span></span>
<span class="line"><span>  排查：</span></span>
<span class="line"><span>    - 检查锁过期时间配置</span></span>
<span class="line"><span>    - 检查网络连通性</span></span>
<span class="line"><span>    - 检查 NTP 同步状态</span></span>
<span class="line"><span></span></span>
<span class="line"><span>问题3：死锁</span></span>
<span class="line"><span>  原因：</span></span>
<span class="line"><span>    - 忘记释放锁</span></span>
<span class="line"><span>    - 释放锁失败</span></span>
<span class="line"><span>    - 未设置过期时间</span></span>
<span class="line"><span>  排查：</span></span>
<span class="line"><span>    - 检查业务代码 finally 块</span></span>
<span class="line"><span>    - 检查锁 Key 是否存在且 TTL = -1</span></span>
<span class="line"><span>    - 临时方案：手动 DEL 锁 Key</span></span>
<span class="line"><span></span></span>
<span class="line"><span>问题4：锁竞争激烈</span></span>
<span class="line"><span>  原因：</span></span>
<span class="line"><span>    - 锁粒度太粗</span></span>
<span class="line"><span>    - 并发量过大</span></span>
<span class="line"><span>  排查：</span></span>
<span class="line"><span>    - 检查锁 Key 设计，是否可以细化</span></span>
<span class="line"><span>    - 考虑使用更细粒度的锁</span></span>
<span class="line"><span>    - 考虑使用乐观锁替代</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-最佳实践总结" tabindex="-1"><a class="header-anchor" href="#_8-3-最佳实践总结"><span>8.3 最佳实践总结</span></a></h3><div class="hint-container tip"><p class="hint-container-title">生产级分布式锁最佳实践</p><ol><li><strong>锁粒度尽可能细</strong>：按业务实体 ID 加锁，而不是全局锁</li><li><strong>过期时间是安全网</strong>：始终设置过期时间，即使有看门狗</li><li><strong>解锁用 Lua 脚本</strong>：永远不要用 GET + DEL 两步操作</li><li><strong>业务层幂等</strong>：分布式锁不是万能的，业务必须做幂等</li><li><strong>监控锁状态</strong>：记录锁获取/释放/超时事件</li><li><strong>控制锁持有时间</strong>：锁内不要做耗时操作（如 HTTP 调用）</li><li><strong>考虑降级方案</strong>：锁服务不可用时的兜底策略</li><li><strong>压测验证</strong>：上线前模拟高并发场景验证锁的正确性</li></ol></div><h2 id="_9-总结" tabindex="-1"><a class="header-anchor" href="#_9-总结"><span>9. 总结</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-text"><span class="line"><span>┌─────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                     分布式锁核心要点                            │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>│  基础实现：                                                    │</span></span>
<span class="line"><span>│  🔹 SET NX EX 加锁 + Lua 脚本解锁                              │</span></span>
<span class="line"><span>│  🔹 唯一值标识防止误删                                         │</span></span>
<span class="line"><span>│  🔹 过期时间是死锁的安全网                                     │</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>│  高级方案：                                                    │</span></span>
<span class="line"><span>│  🔹 Redlock —— 多节点多数派加锁，提高安全性                     │</span></span>
<span class="line"><span>│  🔹 看门狗 —— 自动续期，防止锁提前过期                          │</span></span>
<span class="line"><span>│  🔹 可重入锁 —— Hash 结构存储重入计数                           │</span></span>
<span class="line"><span>│  🔹 公平锁 —— 等待队列保证 FIFO                                │</span></span>
<span class="line"><span>│  🔹 读写锁 —— 读读共享，读写互斥                                │</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>│  争议与权衡：                                                  │</span></span>
<span class="line"><span>│  🔹 Redlock 有时钟漂移风险，但实际概率极低                      │</span></span>
<span class="line"><span>│  🔹 Fencing Token 可增强安全性                                 │</span></span>
<span class="line"><span>│  🔹 业务层幂等是最终的防线                                     │</span></span>
<span class="line"><span>│  🔹 没有完美方案，只有适合场景的选择                            │</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>│  选型原则：                                                    │</span></span>
<span class="line"><span>│  🔹 绝大多数场景：单节点 Redis 锁                               │</span></span>
<span class="line"><span>│  🔹 安全性要求高：Redlock                                      │</span></span>
<span class="line"><span>│  🔹 强一致性：Zookeeper / etcd                                 │</span></span>
<span class="line"><span>│  🔹 不过度设计，够用就好                                       │</span></span>
<span class="line"><span>│                                                               │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container info"><p class="hint-container-title">参考文献</p><ul><li><a href="https://redis.io/docs/manual/patterns/distributed-locks/" target="_blank" rel="noopener noreferrer">Redis 官方文档 - Distributed Locks</a></li><li><a href="https://redis.io/docs/manual/patterns/distributed-locks/#the-redlock-algorithm" target="_blank" rel="noopener noreferrer">Redlock 算法</a></li><li><a href="https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html" target="_blank" rel="noopener noreferrer">Martin Kleppmann - How to do distributed locking</a></li><li><a href="http://antirez.com/news/101" target="_blank" rel="noopener noreferrer">Antirez - Is Redlock safe?</a></li><li><a href="https://github.com/redisson/redisson" target="_blank" rel="noopener noreferrer">Redisson 源码</a></li><li>《Redis 设计与实现》- 黄健宏</li><li>《Redis 开发与运维》- 付磊、张益军</li></ul></div>`,38)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};