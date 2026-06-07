import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-C3QVrxQ1.js";var i=JSON.parse(`{"path":"/%E5%90%8E%E7%AB%AF%E5%BC%80%E5%8F%91/ASP.NET_Core/SQL%20Server%E8%BF%9B%E9%98%B6/03.%E9%94%81%E4%B8%8E%E4%BA%8B%E5%8A%A1%E6%B7%B1%E5%85%A5.html","title":"锁与事务深入","lang":"zh-CN","frontmatter":{"title":"锁与事务深入","date":"2025-04-13T00:00:00.000Z","category":["SQL Server进阶"],"tag":["SQL Server","事务","锁","并发控制","死锁"],"author":"Moklgy","order":3},"git":{"createdTime":1776079919000,"updatedTime":1776079919000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":5.18,"words":1554},"filePathRelative":"后端开发/ASP.NET_Core/SQL Server进阶/03.锁与事务深入.md"}`),a={name:`03.锁与事务深入.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="第三章-锁与事务深入" tabindex="-1"><a class="header-anchor" href="#第三章-锁与事务深入"><span>第三章：锁与事务深入</span></a></h1><blockquote><p><strong>不理解锁和事务的人，写出来的系统迟早会&quot;卡住&quot;。</strong> 并发是后端工程师必须面对的核心挑战。</p></blockquote><hr><h2 id="一、事务的-acid-属性" tabindex="-1"><a class="header-anchor" href="#一、事务的-acid-属性"><span>一、事务的 ACID 属性</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>A - Atomicity（原子性）</span></span>
<span class="line"><span>  → 一组操作要么全部成功，要么全部失败回滚</span></span>
<span class="line"><span>  → 不存在&quot;执行了一半&quot;的状态</span></span>
<span class="line"><span></span></span>
<span class="line"><span>C - Consistency（一致性）</span></span>
<span class="line"><span>  → 事务前后，数据从一个合法状态变到另一个合法状态</span></span>
<span class="line"><span>  → 约束、触发器保证</span></span>
<span class="line"><span></span></span>
<span class="line"><span>I - Isolation（隔离性）</span></span>
<span class="line"><span>  → 并发事务之间互不干扰</span></span>
<span class="line"><span>  → 隔离级别决定干扰程度</span></span>
<span class="line"><span></span></span>
<span class="line"><span>D - Durability（持久性）</span></span>
<span class="line"><span>  → 事务一旦提交，数据永久保存</span></span>
<span class="line"><span>  → 即使断电也不丢失（WAL日志保证）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="二、事务隔离级别-——-核心中的核心" tabindex="-1"><a class="header-anchor" href="#二、事务隔离级别-——-核心中的核心"><span>二、事务隔离级别 —— 核心中的核心</span></a></h2><h3 id="_2-1-并发问题" tabindex="-1"><a class="header-anchor" href="#_2-1-并发问题"><span>2.1 并发问题</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌────────────────┬────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│ 问题            │ 描述                                           │</span></span>
<span class="line"><span>├────────────────┼────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│ 脏读           │ 读到别人还没提交的数据（可能会回滚）              │</span></span>
<span class="line"><span>│ (Dirty Read)   │ → 最危险：基于错误数据做决策                     │</span></span>
<span class="line"><span>├────────────────┼────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│ 不可重复读     │ 同一事务内两次读同一行，结果不同                  │</span></span>
<span class="line"><span>│ (Non-Repeatable│ → 因为别人在中间修改并提交了                     │</span></span>
<span class="line"><span>│  Read)         │                                                 │</span></span>
<span class="line"><span>├────────────────┼────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│ 幻读           │ 同一事务内两次查询，结果集行数不同                │</span></span>
<span class="line"><span>│ (Phantom Read) │ → 因为别人在中间插入/删除并提交了                 │</span></span>
<span class="line"><span>└────────────────┴────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-四种标准隔离级别" tabindex="-1"><a class="header-anchor" href="#_2-2-四种标准隔离级别"><span>2.2 四种标准隔离级别</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌──────────────────────┬──────┬──────────┬──────┬──────────────┐</span></span>
<span class="line"><span>│ 隔离级别              │ 脏读 │ 不可重复读│ 幻读 │ 并发性能      │</span></span>
<span class="line"><span>├──────────────────────┼──────┼──────────┼──────┼──────────────┤</span></span>
<span class="line"><span>│ READ UNCOMMITTED     │ ✅   │ ✅       │ ✅   │ ⭐⭐⭐⭐⭐ 最高│</span></span>
<span class="line"><span>│ READ COMMITTED(默认)  │ ❌   │ ✅       │ ✅   │ ⭐⭐⭐⭐      │</span></span>
<span class="line"><span>│ REPEATABLE READ      │ ❌   │ ❌       │ ✅   │ ⭐⭐⭐        │</span></span>
<span class="line"><span>│ SERIALIZABLE         │ ❌   │ ❌       │ ❌   │ ⭐ 最低       │</span></span>
<span class="line"><span>├──────────────────────┼──────┼──────────┼──────┼──────────────┤</span></span>
<span class="line"><span>│ SNAPSHOT(SQL Server)  │ ❌   │ ❌       │ ❌   │ ⭐⭐⭐⭐ 高   │</span></span>
<span class="line"><span>│ READ COMMITTED       │ ❌   │ ✅       │ ✅   │ ⭐⭐⭐⭐ 高   │</span></span>
<span class="line"><span>│ SNAPSHOT(RCSI)       │      │          │      │              │</span></span>
<span class="line"><span>└──────────────────────┴──────┴──────────┴──────┴──────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-sql line-numbers-mode" data-highlighter="shiki" data-ext="sql" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-sql"><span class="line"><span style="color:#7F848E;font-style:italic;">-- 设置隔离级别</span></span>
<span class="line"><span style="color:#C678DD;">SET</span><span style="color:#C678DD;"> TRANSACTION</span><span style="color:#C678DD;"> ISOLATION</span><span style="color:#C678DD;"> LEVEL</span><span style="color:#C678DD;"> READ</span><span style="color:#C678DD;"> COMMITTED</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 查看当前会话隔离级别</span></span>
<span class="line"><span style="color:#ABB2BF;">DBCC </span><span style="color:#C678DD;">USEROPTIONS</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 启用数据库级别的 SNAPSHOT</span></span>
<span class="line"><span style="color:#C678DD;">ALTER</span><span style="color:#C678DD;"> DATABASE</span><span style="color:#ABB2BF;"> YourDB </span><span style="color:#C678DD;">SET</span><span style="color:#C678DD;"> ALLOW_SNAPSHOT_ISOLATION</span><span style="color:#C678DD;"> ON</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 启用 RCSI（推荐）</span></span>
<span class="line"><span style="color:#C678DD;">ALTER</span><span style="color:#C678DD;"> DATABASE</span><span style="color:#ABB2BF;"> YourDB </span><span style="color:#C678DD;">SET</span><span style="color:#C678DD;"> READ_COMMITTED_SNAPSHOT</span><span style="color:#C678DD;"> ON</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-snapshot-隔离-——-最佳实践" tabindex="-1"><a class="header-anchor" href="#_2-3-snapshot-隔离-——-最佳实践"><span>2.3 SNAPSHOT 隔离 —— 最佳实践</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>传统锁模式：</span></span>
<span class="line"><span>  读操作加共享锁 → 阻塞写操作</span></span>
<span class="line"><span>  写操作加排他锁 → 阻塞读操作</span></span>
<span class="line"><span>  → 读写互相阻塞！</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SNAPSHOT/RCSI 模式：</span></span>
<span class="line"><span>  写操作写入新版本，旧版本存入 TempDB</span></span>
<span class="line"><span>  读操作读取事务开始时的快照版本</span></span>
<span class="line"><span>  → 读不阻塞写，写不阻塞读 ✅</span></span>
<span class="line"><span>  → 代价：TempDB 需要更多空间</span></span>
<span class="line"><span></span></span>
<span class="line"><span>推荐：</span></span>
<span class="line"><span>  大多数 .NET 项目开启 RCSI（Read Committed Snapshot Isolation）</span></span>
<span class="line"><span>  → SqlConnection 默认隔离级别是 READ COMMITTED</span></span>
<span class="line"><span>  → 开启 RCSI 后，READ COMMITTED 自动变为快照语义</span></span>
<span class="line"><span>  → 不需要改任何代码 ✅</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、sql-server-锁类型" tabindex="-1"><a class="header-anchor" href="#三、sql-server-锁类型"><span>三、SQL Server 锁类型</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌────────────────┬──────────────────────────────────┬──────────────┐</span></span>
<span class="line"><span>│ 锁类型          │ 说明                              │ 兼容性       │</span></span>
<span class="line"><span>├────────────────┼──────────────────────────────────┼──────────────┤</span></span>
<span class="line"><span>│ S (共享锁)      │ SELECT 时加的锁                    │ S和S兼容      │</span></span>
<span class="line"><span>│                │ 读完即释放(READ COMMITTED下)        │ S和X不兼容    │</span></span>
<span class="line"><span>├────────────────┼──────────────────────────────────┼──────────────┤</span></span>
<span class="line"><span>│ X (排他锁)      │ INSERT/UPDATE/DELETE 时加的锁      │ 与所有不兼容  │</span></span>
<span class="line"><span>│                │ 事务结束才释放                      │              │</span></span>
<span class="line"><span>├────────────────┼──────────────────────────────────┼──────────────┤</span></span>
<span class="line"><span>│ U (更新锁)      │ UPDATE 时先加U锁再转X锁            │ U和S兼容      │</span></span>
<span class="line"><span>│                │ 防止&quot;转换死锁&quot;                      │ U和U不兼容    │</span></span>
<span class="line"><span>├────────────────┼──────────────────────────────────┼──────────────┤</span></span>
<span class="line"><span>│ IS/IX/SIX      │ 意向锁（标记子资源有对应锁）         │ 层级标记      │</span></span>
<span class="line"><span>│ (意向锁)        │                                    │              │</span></span>
<span class="line"><span>├────────────────┼──────────────────────────────────┼──────────────┤</span></span>
<span class="line"><span>│ Sch-M/Sch-S    │ 架构锁（DDL操作）                   │ DDL阻塞      │</span></span>
<span class="line"><span>│ (架构锁)        │                                    │              │</span></span>
<span class="line"><span>└────────────────┴──────────────────────────────────┴──────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="锁粒度" tabindex="-1"><a class="header-anchor" href="#锁粒度"><span>锁粒度</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>行锁（Row Lock）→ 页锁（Page Lock）→ 表锁（Table Lock）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>粒度越细    → 并发越高，但锁管理开销越大</span></span>
<span class="line"><span>粒度越粗    → 并发越低，但锁管理开销越小</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SQL Server 自动选择锁粒度</span></span>
<span class="line"><span>当行锁数量太多时 → 锁升级（Lock Escalation）→ 变成表锁</span></span>
<span class="line"><span>阈值约 5000 个行锁 → 升级为表锁</span></span>
<span class="line"><span></span></span>
<span class="line"><span>强制行级别（慎用）：</span></span>
<span class="line"><span>SELECT * FROM Orders WITH(ROWLOCK) WHERE ...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、死锁分析与解决" tabindex="-1"><a class="header-anchor" href="#四、死锁分析与解决"><span>四、死锁分析与解决</span></a></h2><h3 id="_4-1-死锁产生条件" tabindex="-1"><a class="header-anchor" href="#_4-1-死锁产生条件"><span>4.1 死锁产生条件</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>经典死锁场景：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>事务A                          事务B</span></span>
<span class="line"><span>────────                       ────────</span></span>
<span class="line"><span>BEGIN TRAN                     BEGIN TRAN</span></span>
<span class="line"><span>UPDATE Orders SET ...          UPDATE Products SET ...</span></span>
<span class="line"><span>  WHERE OrderId = 1              WHERE ProductId = 100</span></span>
<span class="line"><span>  → 持有 Orders 行X锁            → 持有 Products 行X锁</span></span>
<span class="line"><span></span></span>
<span class="line"><span>UPDATE Products SET ...        UPDATE Orders SET ...</span></span>
<span class="line"><span>  WHERE ProductId = 100          WHERE OrderId = 1</span></span>
<span class="line"><span>  → 等待 Products 行X锁         → 等待 Orders 行X锁</span></span>
<span class="line"><span>  → 被B阻塞！                   → 被A阻塞！</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ☠️ 死锁！SQL Server 选择一个牺牲品回滚</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-查看死锁信息" tabindex="-1"><a class="header-anchor" href="#_4-2-查看死锁信息"><span>4.2 查看死锁信息</span></a></h3><div class="language-sql line-numbers-mode" data-highlighter="shiki" data-ext="sql" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-sql"><span class="line"><span style="color:#7F848E;font-style:italic;">-- 开启死锁跟踪</span></span>
<span class="line"><span style="color:#ABB2BF;">DBCC TRACEON(</span><span style="color:#D19A66;">1204</span><span style="color:#ABB2BF;">, -</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">);  </span><span style="color:#7F848E;font-style:italic;">-- 详细死锁信息</span></span>
<span class="line"><span style="color:#ABB2BF;">DBCC TRACEON(</span><span style="color:#D19A66;">1222</span><span style="color:#ABB2BF;">, -</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">);  </span><span style="color:#7F848E;font-style:italic;">-- XML格式死锁信息</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 使用扩展事件（推荐）</span></span>
<span class="line"><span style="color:#C678DD;">CREATE</span><span style="color:#C678DD;"> EVENT</span><span style="color:#C678DD;"> SESSION</span><span style="color:#E06C75;"> [DeadlockMonitor]</span><span style="color:#C678DD;"> ON</span><span style="color:#C678DD;"> SERVER</span></span>
<span class="line"><span style="color:#C678DD;">ADD</span><span style="color:#C678DD;"> EVENT</span><span style="color:#D19A66;"> sqlserver</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">xml_deadlock_report</span></span>
<span class="line"><span style="color:#C678DD;">ADD</span><span style="color:#C678DD;"> TARGET</span><span style="color:#D19A66;"> package0</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">event_file</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">SET</span><span style="color:#C678DD;"> filename</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">N&#39;Deadlocks&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">WITH</span><span style="color:#ABB2BF;"> (MAX_MEMORY</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;"> KB, STARTUP_STATE</span><span style="color:#56B6C2;">=</span><span style="color:#C678DD;">ON</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 查看当前阻塞</span></span>
<span class="line"><span style="color:#C678DD;">SELECT</span><span style="color:#ABB2BF;"> </span></span>
<span class="line"><span style="color:#D19A66;">    blocking</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">session_id</span><span style="color:#C678DD;"> AS</span><span style="color:#ABB2BF;"> BlockingSession,</span></span>
<span class="line"><span style="color:#D19A66;">    blocked</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">session_id</span><span style="color:#C678DD;"> AS</span><span style="color:#ABB2BF;"> BlockedSession,</span></span>
<span class="line"><span style="color:#D19A66;">    blocked</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">wait_type</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#D19A66;">    blocked</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">wait_time</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#D19A66;">    blocked_text</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">text</span><span style="color:#C678DD;"> AS</span><span style="color:#ABB2BF;"> BlockedQuery,</span></span>
<span class="line"><span style="color:#D19A66;">    blocking_text</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">text</span><span style="color:#C678DD;"> AS</span><span style="color:#ABB2BF;"> BlockingQuery</span></span>
<span class="line"><span style="color:#C678DD;">FROM</span><span style="color:#D19A66;"> sys</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">dm_exec_requests</span><span style="color:#ABB2BF;"> blocked</span></span>
<span class="line"><span style="color:#C678DD;">INNER JOIN</span><span style="color:#D19A66;"> sys</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">dm_exec_sessions</span><span style="color:#ABB2BF;"> blocking </span></span>
<span class="line"><span style="color:#C678DD;">    ON</span><span style="color:#D19A66;"> blocked</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">blocking_session_id</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> blocking</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">session_id</span></span>
<span class="line"><span style="color:#C678DD;">CROSS</span><span style="color:#C678DD;"> APPLY</span><span style="color:#D19A66;"> sys</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">dm_exec_sql_text</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">blocked</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">sql_handle</span><span style="color:#ABB2BF;">) blocked_text</span></span>
<span class="line"><span style="color:#C678DD;">CROSS</span><span style="color:#C678DD;"> APPLY</span><span style="color:#D19A66;"> sys</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">dm_exec_sql_text</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">blocking</span><span style="color:#ABB2BF;">.</span><span style="color:#D19A66;">most_recent_sql_handle</span><span style="color:#ABB2BF;">) blocking_text;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-避免死锁的策略" tabindex="-1"><a class="header-anchor" href="#_4-3-避免死锁的策略"><span>4.3 避免死锁的策略</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>1. 固定访问顺序</span></span>
<span class="line"><span>   所有事务按相同顺序访问表：Orders → Products → OrderItems</span></span>
<span class="line"><span>   不要出现：事务A先Orders后Products，事务B先Products后Orders</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 缩短事务时间</span></span>
<span class="line"><span>   事务内不要做网络请求、文件操作等耗时操作</span></span>
<span class="line"><span>   获取数据 → 处理 → 一次性写入</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 使用合适的索引</span></span>
<span class="line"><span>   减少锁的范围：Index Seek 只锁需要的行</span></span>
<span class="line"><span>   避免 Table Scan：会锁整个表</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 使用 RCSI</span></span>
<span class="line"><span>   开启 READ_COMMITTED_SNAPSHOT → 读不阻塞写</span></span>
<span class="line"><span>   大幅减少死锁概率</span></span>
<span class="line"><span></span></span>
<span class="line"><span>5. 使用 NOLOCK（慎用）</span></span>
<span class="line"><span>   SELECT * FROM Orders WITH(NOLOCK) WHERE ...</span></span>
<span class="line"><span>   等价于 READ UNCOMMITTED → 可能读到脏数据</span></span>
<span class="line"><span>   适用于：统计报表等对精确度要求不高的场景</span></span>
<span class="line"><span></span></span>
<span class="line"><span>6. 设置锁超时</span></span>
<span class="line"><span>   SET LOCK_TIMEOUT 5000;  -- 5秒超时</span></span>
<span class="line"><span>   避免无限等待</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、实战-高并发扣库存方案" tabindex="-1"><a class="header-anchor" href="#五、实战-高并发扣库存方案"><span>五、实战：高并发扣库存方案</span></a></h2><div class="language-sql line-numbers-mode" data-highlighter="shiki" data-ext="sql" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-sql"><span class="line"><span style="color:#7F848E;font-style:italic;">-- ❌ 方案1：先查后改（经典错误）</span></span>
<span class="line"><span style="color:#C678DD;">DECLARE</span><span style="color:#E06C75;"> @Stock</span><span style="color:#C678DD;"> INT</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">SELECT</span><span style="color:#E06C75;"> @Stock</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> Stock </span><span style="color:#C678DD;">FROM</span><span style="color:#ABB2BF;"> Products </span><span style="color:#C678DD;">WHERE</span><span style="color:#ABB2BF;"> ProductId </span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">IF</span><span style="color:#E06C75;"> @Stock</span><span style="color:#56B6C2;"> &gt;=</span><span style="color:#D19A66;"> 10</span></span>
<span class="line"><span style="color:#C678DD;">    UPDATE</span><span style="color:#ABB2BF;"> Products </span><span style="color:#C678DD;">SET</span><span style="color:#ABB2BF;"> Stock </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> Stock - </span><span style="color:#D19A66;">10</span><span style="color:#C678DD;"> WHERE</span><span style="color:#ABB2BF;"> ProductId </span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 并发下可能超卖！两个事务同时读到 Stock=10</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ✅ 方案2：原子更新</span></span>
<span class="line"><span style="color:#C678DD;">UPDATE</span><span style="color:#ABB2BF;"> Products </span></span>
<span class="line"><span style="color:#C678DD;">SET</span><span style="color:#ABB2BF;"> Stock </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> Stock - </span><span style="color:#D19A66;">10</span><span style="color:#ABB2BF;"> </span></span>
<span class="line"><span style="color:#C678DD;">WHERE</span><span style="color:#ABB2BF;"> ProductId </span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;"> 1</span><span style="color:#C678DD;"> AND</span><span style="color:#ABB2BF;"> Stock </span><span style="color:#56B6C2;">&gt;=</span><span style="color:#D19A66;"> 10</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- 一条语句原子操作，不会超卖</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">IF</span><span style="color:#ABB2BF;"> @@ROWCOUNT </span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    RAISERROR</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;库存不足&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">16</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ✅ 方案3：乐观锁（适合读多写少）</span></span>
<span class="line"><span style="color:#C678DD;">DECLARE</span><span style="color:#E06C75;"> @Version</span><span style="color:#C678DD;"> INT</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">SELECT</span><span style="color:#E06C75;"> @Version</span><span style="color:#56B6C2;"> =</span><span style="color:#C678DD;"> Version</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">@Stock</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> Stock </span></span>
<span class="line"><span style="color:#C678DD;">FROM</span><span style="color:#ABB2BF;"> Products </span><span style="color:#C678DD;">WHERE</span><span style="color:#ABB2BF;"> ProductId </span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">IF</span><span style="color:#E06C75;"> @Stock</span><span style="color:#56B6C2;"> &gt;=</span><span style="color:#D19A66;"> 10</span></span>
<span class="line"><span style="color:#C678DD;">BEGIN</span></span>
<span class="line"><span style="color:#C678DD;">    UPDATE</span><span style="color:#ABB2BF;"> Products </span></span>
<span class="line"><span style="color:#C678DD;">    SET</span><span style="color:#ABB2BF;"> Stock </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> Stock - </span><span style="color:#D19A66;">10</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">Version</span><span style="color:#56B6C2;"> =</span><span style="color:#C678DD;"> Version</span><span style="color:#ABB2BF;"> + </span><span style="color:#D19A66;">1</span></span>
<span class="line"><span style="color:#C678DD;">    WHERE</span><span style="color:#ABB2BF;"> ProductId </span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;"> 1</span><span style="color:#C678DD;"> AND</span><span style="color:#C678DD;"> Version</span><span style="color:#56B6C2;"> =</span><span style="color:#E06C75;"> @Version</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    IF</span><span style="color:#ABB2BF;"> @@ROWCOUNT </span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">        RAISERROR</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;并发冲突，请重试&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">16</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#C678DD;">END</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ✅ 方案4：悲观锁（适合写多的场景）</span></span>
<span class="line"><span style="color:#C678DD;">BEGIN</span><span style="color:#C678DD;"> TRAN</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">SELECT</span><span style="color:#ABB2BF;"> Stock </span><span style="color:#C678DD;">FROM</span><span style="color:#ABB2BF;"> Products </span><span style="color:#C678DD;">WITH</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">UPDLOCK</span><span style="color:#ABB2BF;">, </span><span style="color:#C678DD;">ROWLOCK</span><span style="color:#ABB2BF;">) </span></span>
<span class="line"><span style="color:#C678DD;">WHERE</span><span style="color:#ABB2BF;"> ProductId </span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- UPDLOCK：加更新锁，阻塞其他更新但允许读取</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">-- ROWLOCK：强制行锁，避免锁升级</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">IF</span><span style="color:#E06C75;"> @Stock</span><span style="color:#56B6C2;"> &gt;=</span><span style="color:#D19A66;"> 10</span></span>
<span class="line"><span style="color:#C678DD;">    UPDATE</span><span style="color:#ABB2BF;"> Products </span><span style="color:#C678DD;">SET</span><span style="color:#ABB2BF;"> Stock </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> Stock - </span><span style="color:#D19A66;">10</span><span style="color:#C678DD;"> WHERE</span><span style="color:#ABB2BF;"> ProductId </span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">COMMIT</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、检验你的理解" tabindex="-1"><a class="header-anchor" href="#六、检验你的理解"><span>六、检验你的理解</span></a></h2><ol><li><p><strong>READ COMMITTED 和 READ COMMITTED SNAPSHOT 有什么区别？RCSI 为什么更好？</strong></p></li><li><p><strong>什么是锁升级？它会带来什么问题？怎么避免？</strong></p></li><li><p><strong>为什么&quot;先查后改&quot;的库存扣减会导致超卖？怎么用一条SQL解决？</strong></p></li><li><p><strong>死锁的四个必要条件是什么？最实用的避免死锁策略是什么？</strong></p></li><li><p><strong>WITH(NOLOCK) 在什么场景下适合使用？它的风险是什么？</strong></p></li></ol>`,33)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};