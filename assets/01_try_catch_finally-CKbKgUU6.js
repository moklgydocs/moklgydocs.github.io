import{A as e,E as t,d as n,l as r,p as i,s as a}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as o}from"./app-X6fsa0X9.js";var s=JSON.parse(`{"path":"/%E5%90%8E%E7%AB%AF%E5%BC%80%E5%8F%91/CSharp/IL%E4%B8%AD%E9%97%B4%E8%AF%AD%E8%A8%80/09_%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86/01_try_catch_finally.html","title":"try/catch/finally","lang":"zh-CN","frontmatter":{"title":"try/catch/finally","order":1,"category":["CSharp"],"tag":["IL","try","catch","finally","异常处理","Leave"]},"git":{"createdTime":1780567888000,"updatedTime":1780567888000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":5.81,"words":1743},"filePathRelative":"后端开发/CSharp/IL中间语言/09_异常处理/01_try_catch_finally.md"}`),c={name:`01_try_catch_finally.md`};function l(o,s,c,l,u,d){let f=e(`Mermaid`);return t(),r(`div`,null,[s[0]||=a(`h1`,{id:`try-catch-finally-——-il-异常块结构`,tabindex:`-1`},[a(`a`,{class:`header-anchor`,href:`#try-catch-finally-——-il-异常块结构`},[a(`span`,null,`try/catch/finally —— IL 异常块结构`)])],-1),s[1]||=a(`blockquote`,null,[a(`p`,null,`C# 的 try/catch/finally 在 IL 中变成了 EH 表（异常处理表）+ Leave/Endfinally 指令。理解 IL 的异常结构，是读懂反编译代码和调试异常问题的关键。`)],-1),i(f,{code:`eJxLL0osyFAIceFSAALHaCVnZYWne5qe7tjxdEnL8wltSrEKurp2Ck7RSnolRZUKT+dOV4oFK3UCiztHKyUnliRnYEi4RCulZeYl5uRg6nEFSeWUpBZhyLgBZRJLc0qgEmAZ92ilp62bX05Z96yn/cnuJVD3eEQr+aQmlqUqPGqYAkQKLxsanrbvUgA6UR/sHqix7mDFntFKrnkpMOeg6oCKoqj3ilYqySjKL4cpfdY1G6gUEiooCr2jlYpSUZS+bO99Nm0DRAPMB8UllTmpQB8CPZ1jpexq7GbkBgltiIQ7VMLNzc3Y1YALAF9BkBY=`}),s[2]||=n(`<h2 id="一、il-异常处理结构概览" tabindex="-1"><a class="header-anchor" href="#一、il-异常处理结构概览"><span>一、IL 异常处理结构概览</span></a></h2><p>IL 不使用 C# 风格的大括号嵌套，而是通过<strong>EH 表</strong>（Exception Handler Table）声明受保护区域和处理程序：</p><div class="language-il line-numbers-mode" data-highlighter="shiki" data-ext="il" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-il"><span class="line"><span>.method private static void Demo() cil managed</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    .try</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // 受保护代码</span></span>
<span class="line"><span>        leave.s IL_AFTER_TRY     // 退出 try 块</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch [mscorlib]System.Exception</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // 异常处理代码</span></span>
<span class="line"><span>        leave.s IL_AFTER_CATCH   // 退出 catch 块</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    IL_AFTER_TRY:</span></span>
<span class="line"><span>    IL_AFTER_CATCH:</span></span>
<span class="line"><span>    // 后续代码</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3),i(f,{code:`eJxLL0osyFAIceJSAILi0iQIX8nVQ+HFwhXPd09+Nq9FCSwHAo7RSiFFlQrBJYlFJVYKnj7xBkCgFKugq2un4ASRc81LgckkKsXCdTpHK3kk5qXkpBah6gaqAet2QcgjTDAEmg03wRWhIqSyINVKIbiyuCQ1V8+1Ijm1oCQzPw+qNjUvhQvNM54+Cs86l79Y2PNsayPCM27RSnolQBc/2b34+YJGiDtqlJ6tXfx0xw6IcqUaBfdopZzUxLJUhUdtkxRebN/8tGODAkjT0wl9SG5zg+h9uqcJqPdp/8TnU+YD9XpEKyUnliRnwG2Aq/eAql/S8nxC29N1Pc86JgDVe2KxC2IAwjaE70oqc1IVHBXSMnNyrJRdjd2M3FyQJJyhEm5urk6urlwABZ6mcw==`}),s[3]||=n(`<h2 id="二、leave-指令-——-退出-try-catch-块" tabindex="-1"><a class="header-anchor" href="#二、leave-指令-——-退出-try-catch-块"><span>二、Leave 指令 —— 退出 try/catch 块</span></a></h2><h3 id="_2-1-为什么不能用-br" tabindex="-1"><a class="header-anchor" href="#_2-1-为什么不能用-br"><span>2.1 为什么不能用 br？</span></a></h3><div class="hint-container important"><p class="hint-container-title">EH 边界限制</p><p><code>br</code>（分支指令）<strong>不能跨越 EH 边界</strong>。从 try 块或 catch 块跳出到外部代码，必须使用 <code>leave</code> 或 <code>leave.s</code>。<code>leave</code> 会执行以下操作：</p><ol><li>弹出当前 EH 区域内的所有局部变量</li><li>通知 CLR 退出当前受保护区域</li><li>如果有 finally 块，确保 finally 先执行</li></ol></div><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#C678DD;">try</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;In try&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 正常退出 → leave</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#C678DD;">catch</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">Exception</span><span style="color:#E06C75;"> ex</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;In catch&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // 处理完 → leave</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#E5C07B;">Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;After try/catch&quot;</span><span style="color:#ABB2BF;">);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-il line-numbers-mode" data-highlighter="shiki" data-ext="il" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-il"><span class="line"><span>.method private static void Demo() cil managed</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    .try</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        ldstr &quot;In try&quot;</span></span>
<span class="line"><span>        call void [mscorlib]System.Console::WriteLine(string)</span></span>
<span class="line"><span>        leave.s IL_AFTER_CATCH    // 退出 try，跳到 catch 后面</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch [mscorlib]System.Exception</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // CLR 自动将异常对象推入栈顶</span></span>
<span class="line"><span>        callvirt instance string [mscorlib]System.Exception::get_Message()</span></span>
<span class="line"><span>        call void [mscorlib]System.Console::WriteLine(string)</span></span>
<span class="line"><span>        leave.s IL_AFTER_CATCH    // 退出 catch，跳到 catch 后面</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    IL_AFTER_CATCH:</span></span>
<span class="line"><span>    ldstr &quot;After try/catch&quot;</span></span>
<span class="line"><span>    call void [mscorlib]System.Console::WriteLine(string)</span></span>
<span class="line"><span>    ret</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、异常对象在-catch-中的传递" tabindex="-1"><a class="header-anchor" href="#三、异常对象在-catch-中的传递"><span>三、异常对象在 catch 中的传递</span></a></h2><p>进入 catch 块时，CLR <strong>自动将异常对象引用推入栈顶</strong>，无需显式加载：</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#C678DD;">try</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    throw</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">InvalidOperationException</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;error&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#C678DD;">catch</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">InvalidOperationException</span><span style="color:#E06C75;"> ex</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">ex</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Message</span><span style="color:#ABB2BF;">);  </span><span style="color:#7F848E;font-style:italic;">// ex 由 CLR 自动推入栈</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-il line-numbers-mode" data-highlighter="shiki" data-ext="il" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-il"><span class="line"><span>.try</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ldstr &quot;error&quot;</span></span>
<span class="line"><span>    newobj instance void [mscorlib]System.InvalidOperationException::.ctor(string)</span></span>
<span class="line"><span>    throw                           // 抛出异常</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>catch [mscorlib]System.InvalidOperationException</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 栈顶已经是异常对象（CLR 自动推入）</span></span>
<span class="line"><span>    callvirt instance string [mscorlib]System.Exception::get_Message()</span></span>
<span class="line"><span>    call void [mscorlib]System.Console::WriteLine(string)</span></span>
<span class="line"><span>    leave.s IL_END</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>IL_END:</span></span>
<span class="line"><span>ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">catch 块中异常对象是隐式参数</p><p>C# 的 <code>catch (Exception ex)</code> 中 <code>ex</code> 不是方法参数，而是 CLR 在进入 catch 块时自动推入栈的。如果你在 catch 中不使用异常对象（如 <code>catch { ... }</code>），IL 中仍然会推入异常引用，只是用 <code>pop</code> 丢弃。</p></div><h2 id="四、finally-块-——-endfinally" tabindex="-1"><a class="header-anchor" href="#四、finally-块-——-endfinally"><span>四、finally 块 —— Endfinally</span></a></h2><p>finally 块使用 <code>endfinally</code> 指令退出：</p><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#C678DD;">try</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;In try&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#C678DD;">finally</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;In finally&quot;</span><span style="color:#ABB2BF;">);  </span><span style="color:#7F848E;font-style:italic;">// 无论如何都会执行</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-il line-numbers-mode" data-highlighter="shiki" data-ext="il" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-il"><span class="line"><span>.try</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ldstr &quot;In try&quot;</span></span>
<span class="line"><span>    call void [mscorlib]System.Console::WriteLine(string)</span></span>
<span class="line"><span>    leave.s IL_AFTER_FINALLY     // 退出 try → 触发 finally</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>finally</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ldstr &quot;In finally&quot;</span></span>
<span class="line"><span>    call void [mscorlib]System.Console::WriteLine(string)</span></span>
<span class="line"><span>    endfinally                    // 退出 finally</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>IL_AFTER_FINALLY:</span></span>
<span class="line"><span>ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,14),i(f,{code:`eJwrTi0sTc1LTnXJTEwvSszlUgCCgsSikszkzILEvBIF5/yUVIXEYoVnnctfLOx5trURQ0VIUSVIQQmQejp3Ooa0W2ZeYk4OWEkalIlNmWNaSWoRSNHTCX3Pd699snvx8wWNXGBlICfo2tkB7bFSeLF/9tPWpSDLwFKJOSUKz9YufrpjB8R9YEEQACoGaoHabaWQk5pYlqrwqG2Swovly572T4Q5Ba4eqhKoB+wQK4XUvBSYc0Hanu9eDnQVkiWpOcWpCs+6Zj9t3/V0TxPQAbishsgStBauHs1iiHaI9U/2LHg2aS3E+rwULgD0/rUi`}),s[4]||=n(`<div class="hint-container warning"><p class="hint-container-title">finally 块的异常传播</p><p><code>endfinally</code> 不是简单地&quot;返回&quot;。如果 finally 是因为异常而触发的，<code>endfinally</code> 会继续传播该异常。如果 finally 中抛出新异常，原异常会被替换。</p></div><h2 id="五、try-catch-finally-组合" tabindex="-1"><a class="header-anchor" href="#五、try-catch-finally-组合"><span>五、try/catch/finally 组合</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#C678DD;">try</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;In try&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#C678DD;">catch</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">InvalidOperationException</span><span style="color:#E06C75;"> ex</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;In catch: &quot;</span><span style="color:#56B6C2;"> +</span><span style="color:#E5C07B;"> ex</span><span style="color:#ABB2BF;">.</span><span style="color:#E5C07B;">Message</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#C678DD;">finally</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;In finally&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-il line-numbers-mode" data-highlighter="shiki" data-ext="il" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-il"><span class="line"><span>.method private static void FullDemo() cil managed</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    .try</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        .try</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            ldstr &quot;In try&quot;</span></span>
<span class="line"><span>            call void [mscorlib]System.Console::WriteLine(string)</span></span>
<span class="line"><span>            leave.s IL_BEFORE_FINALLY</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        catch [mscorlib]System.InvalidOperationException</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            ldstr &quot;In catch: &quot;</span></span>
<span class="line"><span>            ldloc.0                   // ex（CLR 自动推入）</span></span>
<span class="line"><span>            callvirt instance string [mscorlib]System.Exception::get_Message()</span></span>
<span class="line"><span>            call string [mscorlib]System.String::Concat(string, string)</span></span>
<span class="line"><span>            call void [mscorlib]System.Console::WriteLine(string)</span></span>
<span class="line"><span>            leave.s IL_BEFORE_FINALLY</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        IL_BEFORE_FINALLY:</span></span>
<span class="line"><span>        leave.s IL_AFTER_ALL</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    finally</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        ldstr &quot;In finally&quot;</span></span>
<span class="line"><span>        call void [mscorlib]System.Console::WriteLine(string)</span></span>
<span class="line"><span>        endfinally</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    IL_AFTER_ALL:</span></span>
<span class="line"><span>    ret</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">try/catch/finally 的 IL 嵌套结构</p><p>C# 的 <code>try/catch/finally</code> 在 IL 中编译为<strong>嵌套的两层 .try</strong>：</p><ul><li>外层：<code>.try { ... } finally { ... }</code></li><li>内层：<code>.try { ... } catch { ... }</code></li></ul><p>这是因为 IL 规范要求 catch 和 finally 不能在同一个 .try 块中并列。理解这个嵌套关系，是读懂反编译代码的关键。</p></div><h2 id="六、嵌套-try-块" tabindex="-1"><a class="header-anchor" href="#六、嵌套-try-块"><span>六、嵌套 try 块</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#C678DD;">try</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    try</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#C678DD;">        throw</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">InvalidOperationException</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;inner&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    catch</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">InvalidOperationException</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#E5C07B;">        Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Inner catch&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#C678DD;">catch</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">Exception</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#E5C07B;">    Console</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">WriteLine</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Outer catch&quot;</span><span style="color:#ABB2BF;">);</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-il line-numbers-mode" data-highlighter="shiki" data-ext="il" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-il"><span class="line"><span>.method private static void NestedTry() cil managed</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    .try</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        .try</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            ldstr &quot;inner&quot;</span></span>
<span class="line"><span>            newobj instance void [mscorlib]System.InvalidOperationException::.ctor(string)</span></span>
<span class="line"><span>            throw</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        catch [mscorlib]System.InvalidOperationException</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            pop                               // 丢弃异常对象</span></span>
<span class="line"><span>            ldstr &quot;Inner catch&quot;</span></span>
<span class="line"><span>            call void [mscorlib]System.Console::WriteLine(string)</span></span>
<span class="line"><span>            leave.s IL_INNER_END</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        IL_INNER_END:</span></span>
<span class="line"><span>        leave.s IL_OUTER_END</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch [mscorlib]System.Exception</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        pop</span></span>
<span class="line"><span>        ldstr &quot;Outer catch&quot;</span></span>
<span class="line"><span>        call void [mscorlib]System.Console::WriteLine(string)</span></span>
<span class="line"><span>        leave.s IL_OUTER_END</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    IL_OUTER_END:</span></span>
<span class="line"><span>    ret</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),i(f,{code:`eJxLL0osyFAIceFSAILi0iQIX+npkmlPNzYplBRVKoFlQMAxWqkkoyi/XMEzrywxJzPFvyC1KLEkMz/PtSI5tQDEUIpV0NW1q1F62rPzZWuvUo2CU7TS07ZWkEnJiSXJGVb4tMLtcYIYkpOaWJYKNMMZaAbcNQrPd09+Nnc+kmpHiOonO3rhtrrAdUBtRbclNS+FC+LhksqcVKCFaZk5OVbKzhauZs6WSBIuUAk3N1dnJ2MuANpMaS0=`}),s[5]||=n(`<h2 id="七、throw-vs-rethrow" tabindex="-1"><a class="header-anchor" href="#七、throw-vs-rethrow"><span>七、throw vs rethrow</span></a></h2><div class="language-csharp line-numbers-mode" data-highlighter="shiki" data-ext="csharp" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-csharp"><span class="line"><span style="color:#C678DD;">try</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    throw</span><span style="color:#ABB2BF;"> new </span><span style="color:#E5C07B;">InvalidOperationException</span><span style="color:#ABB2BF;">();  </span><span style="color:#7F848E;font-style:italic;">// throw：抛出新异常</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#C678DD;">catch</span><span style="color:#ABB2BF;"> (</span><span style="color:#E5C07B;">Exception</span><span style="color:#E06C75;"> ex</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    throw</span><span style="color:#ABB2BF;">;     </span><span style="color:#7F848E;font-style:italic;">// rethrow：重新抛出当前异常，保留原始栈跟踪</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    // throw ex;  // throw：重置栈跟踪！</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-il line-numbers-mode" data-highlighter="shiki" data-ext="il" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-il"><span class="line"><span>.try</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    newobj instance void [mscorlib]System.InvalidOperationException::.ctor()</span></span>
<span class="line"><span>    throw                   // throw：抛出栈顶的异常对象</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>catch [mscorlib]System.Exception</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // throw; 的 IL：</span></span>
<span class="line"><span>    rethrow                 // 重新抛出当前异常，保留堆栈</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // throw ex; 的 IL：</span></span>
<span class="line"><span>    // ldloc.0</span></span>
<span class="line"><span>    // throw               // 抛出 ex 变量，重置堆栈</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">throw vs rethrow 的关键区别</p><ul><li><code>throw</code>：抛出栈顶异常对象，<strong>重置堆栈跟踪</strong>的起点</li><li><code>rethrow</code>：重新抛出当前正在处理的异常，<strong>保留原始堆栈跟踪</strong></li></ul><p>在 catch 块中，<code>throw;</code> 编译为 <code>rethrow</code>，<code>throw ex;</code> 编译为 <code>ldloc + throw</code>。调试时务必使用 <code>throw;</code> 保留完整堆栈。</p></div><h2 id="八、指令速查表" tabindex="-1"><a class="header-anchor" href="#八、指令速查表"><span>八、指令速查表</span></a></h2><table><thead><tr><th>指令</th><th>作用</th><th>使用场景</th></tr></thead><tbody><tr><td><code>leave &lt;target&gt;</code></td><td>退出 try/catch 并跳转</td><td>try 或 catch 块的正常退出</td></tr><tr><td><code>leave.s &lt;target&gt;</code></td><td>退出 try/catch（短跳转）</td><td>跳转偏移量 &lt; 256</td></tr><tr><td><code>endfinally</code></td><td>退出 finally 块</td><td>finally 块的结尾</td></tr><tr><td><code>throw</code></td><td>抛出栈顶异常对象</td><td>主动抛出异常</td></tr><tr><td><code>rethrow</code></td><td>重新抛出当前异常</td><td>catch 中保留堆栈的重新抛出</td></tr></tbody></table><table><thead><tr><th>IL 结构</th><th>说明</th></tr></thead><tbody><tr><td><code>.try { ... } catch &lt;type&gt; { ... }</code></td><td>catch 块</td></tr><tr><td><code>.try { ... } finally { ... }</code></td><td>finally 块</td></tr><tr><td>EH 表</td><td>方法的元数据，记录受保护区域和处理程序映射</td></tr></tbody></table><blockquote><p><strong>参考文档</strong>：<a href="https://learn.microsoft.com/en-us/dotnet/api/system.reflection.emit.opcodes.leave" target="_blank" rel="noopener noreferrer">OpCodes.Leave</a> | <a href="https://learn.microsoft.com/en-us/dotnet/api/system.reflection.emit.opcodes.endfinally" target="_blank" rel="noopener noreferrer">OpCodes.Endfinally</a> | <a href="https://learn.microsoft.com/en-us/dotnet/api/system.reflection.emit.opcodes.throw" target="_blank" rel="noopener noreferrer">OpCodes.Throw</a> | <a href="https://learn.microsoft.com/en-us/dotnet/api/system.reflection.emit.opcodes.rethrow" target="_blank" rel="noopener noreferrer">OpCodes.Rethrow</a></p></blockquote><hr><h2 id="面试技巧" tabindex="-1"><a class="header-anchor" href="#面试技巧"><span>面试技巧</span></a></h2><ol><li><p><strong>IL 中 try/catch/finally 为什么是嵌套结构？</strong> —— IL 规范不允许 catch 和 finally 并列在同一个 .try 中。<code>try/catch/finally</code> 编译为外层 <code>.try + finally</code>，内层 <code>.try + catch</code>。</p></li><li><p><strong>Leave 和 br 的区别？</strong> —— <code>br</code> 不能跨越 EH 边界。<code>leave</code> 会正确通知 CLR 退出当前 EH 区域，并确保 finally 块先执行。</p></li><li><p><strong>catch 块中异常对象从哪来？</strong> —— CLR 进入 catch 块时自动将异常引用推入栈顶。这不是方法参数，是 EH 机制的隐式行为。</p></li><li><p><strong>throw 和 rethrow 的 IL 区别？</strong> —— <code>throw</code> 抛出栈顶对象，重置堆栈跟踪起点；<code>rethrow</code> 重新抛出当前异常，保留原始堆栈。C# 的 <code>throw;</code> 编译为 <code>rethrow</code>，<code>throw ex;</code> 编译为 <code>ldloc + throw</code>。</p></li><li><p><strong>finally 块中的 endfinally 做了什么？</strong> —— 如果 finally 因异常触发，<code>endfinally</code> 继续传播异常；如果正常触发，继续执行 leave 后的代码。finally 中抛出新异常会替换原异常。</p></li></ol>`,11)])}var u=o(c,[[`render`,l]]);export{s as _pageData,u as default};