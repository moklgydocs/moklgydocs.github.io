import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-DzEYf-SQ.js";var o=JSON.parse(`{"path":"/%E5%90%8E%E7%AB%AF%E5%BC%80%E5%8F%91/CSharp/IL%E4%B8%AD%E9%97%B4%E8%AF%AD%E8%A8%80/02_%E5%B7%A5%E5%85%B7%E9%93%BE%E7%AF%87/03_%E7%BC%96%E5%86%99%E7%AC%AC%E4%B8%80%E4%B8%AAIL%E7%A8%8B%E5%BA%8F.html","title":"编写第一个 IL 程序","lang":"zh-CN","frontmatter":{"title":"编写第一个 IL 程序","order":3,"category":["CSharp"],"tag":["IL","ilasm","Hello World","手写IL"]},"git":{"createdTime":1780567888000,"updatedTime":1780567888000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":6.18,"words":1855},"filePathRelative":"后端开发/CSharp/IL中间语言/02_工具链篇/03_编写第一个IL程序.md"}`),s={name:`03_编写第一个IL程序.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="编写第一个-il-程序" tabindex="-1"><a class="header-anchor" href="#编写第一个-il-程序"><span>编写第一个 IL 程序</span></a></h1><div class="hint-container tip"><p class="hint-container-title">核心要点</p><p>手写一个 .il 文件并用 ilasm 编译，是理解 IL 程序集结构的最佳方式。本文带你从零构建一个完整的 IL 程序。</p></div><h2 id="一、il-程序集的结构" tabindex="-1"><a class="header-anchor" href="#一、il-程序集的结构"><span>一、IL 程序集的结构</span></a></h2><p>一个完整的 .il 文件包含以下部分：</p>`,4),i(d,{code:`eJxVjltLAkEcxd/9FIO+pnaHJARvq0GPvUkPq86mMO4usyvkW3RFxCxMjSIhLNoekqQLqPltnFn8Fk0zS03/hz9n5vzOmdnDqlkEO3EfYGNVcuK8tU07Z7PJpztp0d4x934mlvWTh878yHGdOhk357en5KvtXjmbORyOhlTLguUcqgK4b0Os+3d/c3GWm7ZIrfGX67/S6/P/OSmQyPqpc0/uumRwMxvVBFc2ChUEJSrJai+n5KLhPo/n3fewO5yQXl3AulqGlqnmIQiDUB6xN6RgitV3RvSt7RVDu2gUJF9hxS9dOvgQvlaCSLbTzB726MGTsE1smBDb8v8zjDh5JM2+ezgSENRtXDWNkm57GNQLPi5iIBiMgjjfCb6T/D7JdUrSiqTTXKe4zogiy64iyOq0EkKRwPLSxrqyspA3kIEjAU3TJCbjMauJmLK2KDPfCDK33g==`}),o[1]||=n(`<h2 id="二、hello-world-——-最简版本" tabindex="-1"><a class="header-anchor" href="#二、hello-world-——-最简版本"><span>二、Hello World —— 最简版本</span></a></h2><h3 id="_2-1-完整代码" tabindex="-1"><a class="header-anchor" href="#_2-1-完整代码"><span>2.1 完整代码</span></a></h3><div class="language-il line-numbers-mode" data-highlighter="shiki" data-ext="il" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-il"><span class="line"><span>// ============================================</span></span>
<span class="line"><span>// HelloWorld.il —— 最简单的 IL 程序</span></span>
<span class="line"><span>// ============================================</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 1. 引用外部程序集</span></span>
<span class="line"><span>.assembly extern mscorlib</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  .publickeytoken = (B7 7A 5C 56 19 34 E0 89 )  // mscorlib 的公钥标记</span></span>
<span class="line"><span>  .ver 4:0:0:0                                  // 版本号</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 2. 声明当前程序集</span></span>
<span class="line"><span>.assembly HelloWorld</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  .ver 1:0:0:0    // 版本 1.0.0.0</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 3. 定义模块</span></span>
<span class="line"><span>.module HelloWorld.exe</span></span>
<span class="line"><span>  // MVID 由 ilasm 自动生成</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 4. 定义入口方法</span></span>
<span class="line"><span>.method static void Main() cil managed</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  .entrypoint           // 标记为程序入口点</span></span>
<span class="line"><span>  .maxstack 1           // 求值栈最大深度为 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 方法体</span></span>
<span class="line"><span>  IL_0000: ldstr        &quot;Hello, IL World!&quot;   // 将字符串压入求值栈</span></span>
<span class="line"><span>  IL_0005: call         void [mscorlib]System.Console::WriteLine(string)  // 调用 Console.WriteLine</span></span>
<span class="line"><span>  IL_000a: ret                               // 返回</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-逐行解析" tabindex="-1"><a class="header-anchor" href="#_2-2-逐行解析"><span>2.2 逐行解析</span></a></h3><table><thead><tr><th>代码</th><th>说明</th></tr></thead><tbody><tr><td><code>.assembly extern mscorlib</code></td><td>引用 mscorlib 程序集（包含 <code>System.Console</code> 等基础类型）</td></tr><tr><td><code>.publickeytoken</code></td><td>mscorlib 的公钥标记，用于强名称验证</td></tr><tr><td><code>.ver 4:0:0:0</code></td><td>引用 mscorlib 的版本号</td></tr><tr><td><code>.assembly HelloWorld</code></td><td>声明当前程序集名为 <code>HelloWorld</code></td></tr><tr><td><code>.module HelloWorld.exe</code></td><td>定义模块名（通常与程序集同名）</td></tr><tr><td><code>.method static void Main()</code></td><td>定义静态方法 <code>Main</code>，返回 <code>void</code></td></tr><tr><td><code>.entrypoint</code></td><td>标记此方法为程序入口点（每个 .exe 只能有一个）</td></tr><tr><td><code>.maxstack 1</code></td><td>求值栈最多同时容纳 1 个值</td></tr><tr><td><code>ldstr &quot;Hello, IL World!&quot;</code></td><td>将字符串字面量压入求值栈</td></tr><tr><td><code>call Console::WriteLine(string)</code></td><td>调用 <code>Console.WriteLine</code>，从栈中弹出字符串参数</td></tr><tr><td><code>ret</code></td><td>方法返回</td></tr></tbody></table><h3 id="_2-3-编译与运行" tabindex="-1"><a class="header-anchor" href="#_2-3-编译与运行"><span>2.3 编译与运行</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 编译</span></span>
<span class="line"><span style="color:#61AFEF;">ilasm</span><span style="color:#98C379;"> HelloWorld.il</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 运行</span></span>
<span class="line"><span style="color:#61AFEF;">HelloWorld.exe</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出: Hello, IL World!</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">.entrypoint 是关键</p><p><code>.entrypoint</code> 标记告诉 CLR 从哪个方法开始执行。没有 <code>.entrypoint</code> 的 .exe 程序集无法运行。<code>.dll</code> 程序集不需要 <code>.entrypoint</code>。</p></div><h2 id="三、添加方法调用" tabindex="-1"><a class="header-anchor" href="#三、添加方法调用"><span>三、添加方法调用</span></a></h2><h3 id="_3-1-添加一个自定义方法" tabindex="-1"><a class="header-anchor" href="#_3-1-添加一个自定义方法"><span>3.1 添加一个自定义方法</span></a></h3><div class="language-il line-numbers-mode" data-highlighter="shiki" data-ext="il" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-il"><span class="line"><span>.assembly extern mscorlib</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  .publickeytoken = (B7 7A 5C 56 19 34 E0 89)</span></span>
<span class="line"><span>  .ver 4:0:0:0</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.assembly HelloWorld</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  .ver 1:0:0:0</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.module HelloWorld.exe</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ===== 自定义方法：计算两个整数之和 =====</span></span>
<span class="line"><span>.method static int32 Add(int32 a, int32 b) cil managed</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  .maxstack 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //                                  求值栈状态</span></span>
<span class="line"><span>  IL_0000: ldarg.0             //    [ a ]        ← 加载第 1 个参数</span></span>
<span class="line"><span>  IL_0001: ldarg.1             //    [ a, b ]     ← 加载第 2 个参数</span></span>
<span class="line"><span>  IL_0002: add                 //    [ a+b ]      ← 弹出两个值，压入和</span></span>
<span class="line"><span>  IL_0003: ret                 //    [ ]          ← 弹出返回值</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ===== 主方法 =====</span></span>
<span class="line"><span>.method static void Main() cil managed</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  .entrypoint</span></span>
<span class="line"><span>  .maxstack 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //                                  求值栈状态</span></span>
<span class="line"><span>  IL_0000: ldc.i4.s     10    //    [ 10 ]        ← 加载常量 10</span></span>
<span class="line"><span>  IL_0002: ldc.i4.s     20    //    [ 10, 20 ]    ← 加载常量 20</span></span>
<span class="line"><span>  IL_0004: call          int32 Add(int32, int32)  // 调用 Add 方法</span></span>
<span class="line"><span>                                    // [ 30 ]        ← 结果压栈</span></span>
<span class="line"><span>  IL_0009: call          void [mscorlib]System.Console::WriteLine(int32)</span></span>
<span class="line"><span>                                    // [ ]           ← 输出 30</span></span>
<span class="line"><span>  IL_000e: ret</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">静态方法的参数索引</p><p>静态方法中，<code>ldarg.0</code> 对应第一个参数（没有 <code>this</code>）。实例方法中，<code>ldarg.0</code> 是 <code>this</code> 引用，<code>ldarg.1</code> 才是第一个参数。</p></div><h3 id="_3-2-编译与运行" tabindex="-1"><a class="header-anchor" href="#_3-2-编译与运行"><span>3.2 编译与运行</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">ilasm</span><span style="color:#98C379;"> HelloWorld.il</span></span>
<span class="line"><span style="color:#61AFEF;">HelloWorld.exe</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出: 30</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、局部变量与分支" tabindex="-1"><a class="header-anchor" href="#四、局部变量与分支"><span>四、局部变量与分支</span></a></h2><h3 id="_4-1-带条件判断的示例" tabindex="-1"><a class="header-anchor" href="#_4-1-带条件判断的示例"><span>4.1 带条件判断的示例</span></a></h3><div class="language-il line-numbers-mode" data-highlighter="shiki" data-ext="il" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-il"><span class="line"><span>.assembly extern mscorlib</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  .publickeytoken = (B7 7A 5C 56 19 34 E0 89)</span></span>
<span class="line"><span>  .ver 4:0:0:0</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.assembly HelloWorld</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  .ver 1:0:0:0</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.module HelloWorld.exe</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ===== 判断奇偶 =====</span></span>
<span class="line"><span>.method static string CheckEvenOrOdd(int32 number) cil managed</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  .maxstack 2</span></span>
<span class="line"><span>  .locals init (</span></span>
<span class="line"><span>    int32 remainder   // V_0: 余数</span></span>
<span class="line"><span>  )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //                                        求值栈状态</span></span>
<span class="line"><span>  IL_0000: ldarg.0                    //    [ number ]</span></span>
<span class="line"><span>  IL_0001: ldc.i4.2                   //    [ number, 2 ]</span></span>
<span class="line"><span>  IL_0002: rem                        //    [ number % 2 ]    ← 取余</span></span>
<span class="line"><span>  IL_0003: stloc.0                    //    [ ]               ← 存入 V_0</span></span>
<span class="line"><span>  IL_0004: ldloc.0                    //    [ remainder ]</span></span>
<span class="line"><span>  IL_0005: ldc.i4.0                   //    [ remainder, 0 ]</span></span>
<span class="line"><span>  IL_0006: beq.s      IS_EVEN         //    [ ]               ← 如果相等，跳转</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 奇数路径</span></span>
<span class="line"><span>  IL_0008: ldstr       &quot;Odd&quot;          //    [ &quot;Odd&quot; ]</span></span>
<span class="line"><span>  IL_000d: ret                        //    [ ]               ← 返回 &quot;Odd&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 偶数路径</span></span>
<span class="line"><span>  IS_EVEN:</span></span>
<span class="line"><span>  IL_000f: ldstr       &quot;Even&quot;         //    [ &quot;Even&quot; ]</span></span>
<span class="line"><span>  IL_0014: ret                        //    [ ]               ← 返回 &quot;Even&quot;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ===== 主方法 =====</span></span>
<span class="line"><span>.method static void Main() cil managed</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  .entrypoint</span></span>
<span class="line"><span>  .maxstack 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  IL_0000: ldc.i4.s     42            //    [ 42 ]</span></span>
<span class="line"><span>  IL_0002: call          string CheckEvenOrOdd(int32)</span></span>
<span class="line"><span>                                       //    [ &quot;Even&quot; ]</span></span>
<span class="line"><span>  IL_0007: call          void [mscorlib]System.Console::WriteLine(string)</span></span>
<span class="line"><span>                                       //    [ ]</span></span>
<span class="line"><span>  IL_000c: ret</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-编译与运行" tabindex="-1"><a class="header-anchor" href="#_4-2-编译与运行"><span>4.2 编译与运行</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">ilasm</span><span style="color:#98C379;"> HelloWorld.il</span></span>
<span class="line"><span style="color:#61AFEF;">HelloWorld.exe</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出: Even</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、定义类与实例方法" tabindex="-1"><a class="header-anchor" href="#五、定义类与实例方法"><span>五、定义类与实例方法</span></a></h2><h3 id="_5-1-完整的类定义" tabindex="-1"><a class="header-anchor" href="#_5-1-完整的类定义"><span>5.1 完整的类定义</span></a></h3><div class="language-il line-numbers-mode" data-highlighter="shiki" data-ext="il" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-il"><span class="line"><span>.assembly extern mscorlib</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  .publickeytoken = (B7 7A 5C 56 19 34 E0 89)</span></span>
<span class="line"><span>  .ver 4:0:0:0</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.assembly GreeterApp</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  .ver 1:0:0:0</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.module GreeterApp.exe</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ===== 定义 Greeter 类 =====</span></span>
<span class="line"><span>.class public auto ansi beforefieldinit Greeter</span></span>
<span class="line"><span>       extends [mscorlib]System.Object</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  // 实例字段</span></span>
<span class="line"><span>  .field private string _name</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 构造函数</span></span>
<span class="line"><span>  .method public hidebysig instance void .ctor(string name) cil managed</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    .maxstack 8</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //                                        求值栈状态</span></span>
<span class="line"><span>    // 调用基类 Object 的构造函数</span></span>
<span class="line"><span>    IL_0000: ldarg.0                    //    [ this ]</span></span>
<span class="line"><span>    IL_0001: call        instance void [mscorlib]System.Object::.ctor()</span></span>
<span class="line"><span>                                         //    [ ]</span></span>
<span class="line"><span>    // 将 name 参数存入 _name 字段</span></span>
<span class="line"><span>    IL_0006: ldarg.0                    //    [ this ]</span></span>
<span class="line"><span>    IL_0007: ldarg.1                    //    [ this, name ]</span></span>
<span class="line"><span>    IL_0008: stfld       string Greeter::_name</span></span>
<span class="line"><span>                                         //    [ ]</span></span>
<span class="line"><span>    IL_000d: ret</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 实例方法：SayHello</span></span>
<span class="line"><span>  .method public hidebysig instance void SayHello() cil managed</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    .maxstack 8</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 构造输出字符串并打印</span></span>
<span class="line"><span>    IL_0000: ldstr       &quot;Hello, &quot;     //    [ &quot;Hello, &quot; ]</span></span>
<span class="line"><span>    IL_0005: ldarg.0                    //    [ &quot;Hello, &quot;, this ]</span></span>
<span class="line"><span>    IL_0006: ldfld       string Greeter::_name</span></span>
<span class="line"><span>                                         //    [ &quot;Hello, &quot;, name ]</span></span>
<span class="line"><span>    IL_000b: call        string [mscorlib]System.String::Concat(string, string)</span></span>
<span class="line"><span>                                         //    [ &quot;Hello, xxx&quot; ]</span></span>
<span class="line"><span>    IL_0010: call        void [mscorlib]System.Console::WriteLine(string)</span></span>
<span class="line"><span>                                         //    [ ]</span></span>
<span class="line"><span>    IL_0015: ret</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ===== 主方法 =====</span></span>
<span class="line"><span>.method static void Main() cil managed</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  .entrypoint</span></span>
<span class="line"><span>  .maxstack 1</span></span>
<span class="line"><span>  .locals init (</span></span>
<span class="line"><span>    class Greeter greeter   // V_0: Greeter 实例</span></span>
<span class="line"><span>  )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //                                        求值栈状态</span></span>
<span class="line"><span>  // 创建 Greeter 实例</span></span>
<span class="line"><span>  IL_0000: ldstr       &quot;IL Learner&quot;    //    [ &quot;IL Learner&quot; ]</span></span>
<span class="line"><span>  IL_0005: newobj      instance void Greeter::.ctor(string)</span></span>
<span class="line"><span>                                         //    [ greeter ]</span></span>
<span class="line"><span>  IL_000a: stloc.0                     //    [ ]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 调用 SayHello 方法</span></span>
<span class="line"><span>  IL_000b: ldloc.0                     //    [ greeter ]</span></span>
<span class="line"><span>  IL_000c: callvirt    instance void Greeter::SayHello()</span></span>
<span class="line"><span>                                         //    [ ]</span></span>
<span class="line"><span>  IL_0011: ret</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-编译与运行" tabindex="-1"><a class="header-anchor" href="#_5-2-编译与运行"><span>5.2 编译与运行</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">ilasm</span><span style="color:#98C379;"> GreeterApp.il</span></span>
<span class="line"><span style="color:#61AFEF;">GreeterApp.exe</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出: Hello, IL Learner</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、构建流程" tabindex="-1"><a class="header-anchor" href="#六、构建流程"><span>六、构建流程</span></a></h2>`,25),i(d,{code:`eJxLL0osyFDwCeJSAALHaKXne6Y9bZupoJeZo/BsWvuT3duUYhV0de0UnKKVMnMSi3MVgAperJ+oFAvW4ASWc64GaQOKPuuY8LRr/vs985VqwdLOIOmaZzPW1yi4AI2eMh+oQEEvtSJVQV9BLyUnB2oKRNnTCctqFFyjlZ7sX/d0Sa+Cp4/CyykzX6xfD1XkCrbKEcx2AbPdopVe7J/wYmEP0LSne6Y+n7ICqtQNLO0OdNXuyc/mzXm2dvHzhesQrnJHuMojWunpuh6gq6A6IVJgl3iCPJwC8vHT/l6I92ySivTtnq7f+Wz9lKcdbc/mwXR5Qp0G5hSXVOakKjgqpGXm5FgpGxlamrkZ6yTn5+QXWSmnpaUhqXGBqjFxdnQzNcCuxhWqxs3N1NzICLsaT7gaSwsDFHMAiY6tMQ==`}),o[2]||=n(`<h2 id="七、常见编译错误" tabindex="-1"><a class="header-anchor" href="#七、常见编译错误"><span>七、常见编译错误</span></a></h2><table><thead><tr><th>错误信息</th><th>原因</th><th>修复方式</th></tr></thead><tbody><tr><td><code>invalid .assembly directive</code></td><td>程序集声明语法错误</td><td>检查大括号和属性格式</td></tr><tr><td><code>Method does not have .maxstack</code></td><td>缺少 <code>.maxstack</code> 声明</td><td>添加 <code>.maxstack N</code></td></tr><tr><td><code>Invalid IL</code></td><td>IL 指令序列不合法（如栈下溢）</td><td>检查 push/pop 是否匹配</td></tr><tr><td><code>Failed to resolve type</code></td><td>引用的类型找不到</td><td>检查 <code>.assembly extern</code> 声明</td></tr><tr><td><code>Entry point not found</code></td><td>.exe 缺少 <code>.entrypoint</code></td><td>在 Main 方法中添加 <code>.entrypoint</code></td></tr></tbody></table><h2 id="八、参考资料" tabindex="-1"><a class="header-anchor" href="#八、参考资料"><span>八、参考资料</span></a></h2><ul><li><a href="https://learn.microsoft.com/en-us/dotnet/framework/tools/ilasm-exe-il-assembler" target="_blank" rel="noopener noreferrer">ilasm — Microsoft Learn</a> —— ilasm 官方文档</li><li><a href="https://ecma-international.org/publications-and-standards/standards/ecma-335/" target="_blank" rel="noopener noreferrer">ECMA-335 Partition II — Metadata Definition and Semantics</a> —— IL 语法的权威规范</li><li><a href="https://ecma-international.org/publications-and-standards/standards/ecma-335/" target="_blank" rel="noopener noreferrer">ECMA-335 Partition III — CIL Instruction Set</a> —— IL 指令参考</li></ul><hr><h2 id="面试技巧" tabindex="-1"><a class="header-anchor" href="#面试技巧"><span>面试技巧</span></a></h2><div class="hint-container tip"><p class="hint-container-title">面试常考</p><ol><li><strong>&quot;一个 .il 文件最少需要哪些部分才能编译运行？&quot;</strong> —— <code>.assembly extern mscorlib</code>（引用基础类库）、<code>.assembly</code>（声明程序集）、<code>.module</code>（定义模块）、带 <code>.entrypoint</code> 的 <code>.method</code>（入口方法）。</li><li><strong>&quot;.entrypoint 的作用是什么？&quot;</strong> —— 标记程序入口点方法。CLR 从此方法开始执行。每个 .exe 只能有一个，.dll 不需要。</li><li><strong>&quot;静态方法和实例方法中 ldarg 的索引有什么区别？&quot;</strong> —— 静态方法：<code>ldarg.0</code> = 第一个参数；实例方法：<code>ldarg.0</code> = <code>this</code>，<code>ldarg.1</code> = 第一个参数。</li><li><strong>&quot;.locals init 中的 init 关键字有什么作用？&quot;</strong> —— <code>init</code> 表示所有局部变量自动初始化为零/null。省略 <code>init</code> 则局部变量值不确定（但 CLR 验证可能不允许省略）。</li><li><strong>&quot;如何定义一个类并创建实例？&quot;</strong> —— 用 <code>.class</code> 定义类，<code>.method instance void .ctor()</code> 定义构造函数，用 <code>newobj</code> 指令创建实例。</li><li><strong>&quot;手写 IL 时如何调试？&quot;</strong> —— 用 ilasm 编译后运行，观察输出；用 ildasm 反编译对比；逐步构建，先写最简版本再添加功能。</li></ol></div>`,7)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};