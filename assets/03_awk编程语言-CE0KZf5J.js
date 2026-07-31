import{M as e,O as t,c as n,d as r,h as i,m as a,p as o}from"./runtime-core.esm-bundler-jC72uHyJ.js";import{t as s}from"./app-sCRHfVEK.js";var c=JSON.parse(`{"path":"/Linux/04_%E4%B8%89%E5%89%91%E5%AE%A2/03_awk%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80.html","title":"awk 编程语言","lang":"zh-CN","frontmatter":{"title":"awk 编程语言","icon":"fa6-solid:code","order":3,"category":["Linux三剑客"],"tag":["awk","文本处理","编程语言","报表生成","数据ETL"]},"git":{"createdTime":1780586585000,"updatedTime":1780587023000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":21.37,"words":6411},"filePathRelative":"Linux/04_三剑客/03_awk编程语言.md"}`),l={name:`03_awk编程语言.md`};function u(s,c,l,u,d,f){let p=e(`Mermaid`);return t(),r(`div`,null,[c[0]||=o(`<h1 id="awk-编程语言" tabindex="-1"><a class="header-anchor" href="#awk-编程语言"><span>awk 编程语言</span></a></h1><p>awk 不仅是文本处理工具，更是一门完整的编程语言——它由 Aho、Weinberger、Kernighan 三位 Unix 先驱于 1977 年设计，名字即取自三人首字母。awk 拥有变量、数组、函数、流程控制，能完成从简单字段提取到复杂数据报表的一切任务。本文从 awk 执行模型出发，逐步深入到高级编程特性。</p><h2 id="_1-awk-工作原理" tabindex="-1"><a class="header-anchor" href="#_1-awk-工作原理"><span>1. awk 工作原理</span></a></h2><h3 id="_1-1-执行模型" tabindex="-1"><a class="header-anchor" href="#_1-1-执行模型"><span>1.1 执行模型</span></a></h3><p>awk 程序的执行分为三个阶段：</p>`,5),i(p,{code:`eJxLy8kvT85ILCpRCHHhUgACx2glJ1d3Tz+Fp3Onx+S939PxtGPu0+XdT3umvd/TqRSroKtrp+AUrfSyYcKLhT1Pl7Q8n9AGVvZkx+6n+1Y971sPVgY2ygms2Lla6cX+Gc/mdL7YN/lp61KgLnulWrC8M0i+5tmM9TUKLtFKL9bvfto/7cmOBqCKF+s2PN07FWqMC9gY12ilpx1tTzs3Pdmx6+na6c/WbY3JUzHUUVAx0lHQ09MDMvzcoBpcwRrcqpWe9ux82dr7bMXCp3v6YZa6ISx1j1Z61rkc5I2uFU/2zoHqhih4OmFZjYIH0FXbN7/Y3w6Vcod4CMz2QGJDPALW4hmt5OrnAg+8Z1O2Pd2w79nG9mcNuyEBA9ZQXFKZk6rgqJCWmZNjpZxqmGaalook4YlLwh0qkWyRapZsiSThApVIS0szTjXgAgC+rLqe`}),c[1]||=o(`<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># awk 程序结构</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN{ 初始化 } /模式/{ 动作 } END{ 收尾 }&#39;</span><span style="color:#98C379;"> 文件</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 三段式示例</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">BEGIN {</span></span>
<span class="line"><span style="color:#98C379;">    print &quot;=== 报表开始 ===&quot;</span></span>
<span class="line"><span style="color:#98C379;">    total = 0</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    total += $3        # 累加第3列</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">END {</span></span>
<span class="line"><span style="color:#98C379;">    print &quot;总计:&quot;, total</span></span>
<span class="line"><span style="color:#98C379;">    print &quot;=== 报表结束 ===&quot;</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-awk-版本" tabindex="-1"><a class="header-anchor" href="#_1-2-awk-版本"><span>1.2 awk 版本</span></a></h3><table><thead><tr><th>版本</th><th>说明</th><th>常见系统</th></tr></thead><tbody><tr><td>awk</td><td>原始版（1977）</td><td>几乎所有 Unix</td></tr><tr><td>nawk</td><td>新版 awk（1985）</td><td>Solaris 等</td></tr><tr><td>gawk</td><td>GNU awk</td><td>Linux 默认</td></tr><tr><td>mawk</td><td>轻量快速 awk</td><td>Ubuntu 默认</td></tr></tbody></table><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看当前 awk 版本</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> --version</span><span style="color:#7F848E;font-style:italic;">          # gawk: GNU Awk 5.2.2</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -W</span><span style="color:#98C379;"> version</span><span style="color:#7F848E;font-style:italic;">         # mawk: mawk 1.3.4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：Ubuntu 默认的 mawk 不支持某些 gawk 扩展</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 可切换为 gawk</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> update-alternatives</span><span style="color:#D19A66;"> --config</span><span style="color:#98C379;"> awk</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">gawk vs mawk</p><ul><li><strong>mawk</strong>：速度快，适合大数据量简单处理</li><li><strong>gawk</strong>：功能全，支持 <code>strftime</code>、<code>FPAT</code>、<code>BEGINFILE/ENDFILE</code> 等扩展</li><li>生产脚本建议指定 <code>gawk</code> 或 <code>awk</code> 并测试兼容性</li></ul></div><h3 id="_1-3-命令行语法" tabindex="-1"><a class="header-anchor" href="#_1-3-命令行语法"><span>1.3 命令行语法</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基本语法</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;模式{动作}&#39;</span><span style="color:#98C379;"> 文件</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从脚本文件执行</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> script.awk</span><span style="color:#98C379;"> 文件</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 指定字段分隔符</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;{print $1}&#39;</span><span style="color:#98C379;"> data.csv</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;\\t&#39;</span><span style="color:#98C379;"> &#39;{print $1}&#39;</span><span style="color:#98C379;"> data.tsv</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置变量</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> var=value</span><span style="color:#98C379;"> &#39;{print var, $1}&#39;</span><span style="color:#98C379;"> file</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 多文件处理</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print FILENAME, NR, $0}&#39;</span><span style="color:#98C379;"> file1</span><span style="color:#98C379;"> file2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从管道读取</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> file</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $1}&#39;</span></span>
<span class="line"><span style="color:#61AFEF;">ps</span><span style="color:#98C379;"> aux</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;$3 &gt; 5.0 {print $11}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-字段与记录" tabindex="-1"><a class="header-anchor" href="#_2-字段与记录"><span>2. 字段与记录</span></a></h2><h3 id="_2-1-内建变量一览" tabindex="-1"><a class="header-anchor" href="#_2-1-内建变量一览"><span>2.1 内建变量一览</span></a></h3><table><thead><tr><th>变量</th><th>含义</th><th>默认值</th></tr></thead><tbody><tr><td><code>$0</code></td><td>当前整行记录</td><td>-</td></tr><tr><td><code>$1</code>~<code>$n</code></td><td>第 n 个字段</td><td>-</td></tr><tr><td><code>NR</code></td><td>已读取的总行号（Number of Records）</td><td>-</td></tr><tr><td><code>NF</code></td><td>当前行的字段数（Number of Fields）</td><td>-</td></tr><tr><td><code>FNR</code></td><td>当前文件的行号</td><td>-</td></tr><tr><td><code>FS</code></td><td>输入字段分隔符</td><td>空格/Tab</td></tr><tr><td><code>RS</code></td><td>输入记录分隔符</td><td>换行符</td></tr><tr><td><code>OFS</code></td><td>输出字段分隔符</td><td>空格</td></tr><tr><td><code>ORS</code></td><td>输出记录分隔符</td><td>换行符</td></tr><tr><td><code>FILENAME</code></td><td>当前文件名</td><td>-</td></tr><tr><td><code>ARGC</code></td><td>命令行参数个数</td><td>-</td></tr><tr><td><code>ARGV</code></td><td>命令行参数数组</td><td>-</td></tr><tr><td><code>SUBSEP</code></td><td>数组下标分隔符</td><td><code>\\034</code></td></tr><tr><td><code>RSTART</code></td><td>match() 匹配的起始位置</td><td>-</td></tr><tr><td><code>RLENGTH</code></td><td>match() 匹配的长度</td><td>-</td></tr><tr><td><code>ENVIRON</code></td><td>环境变量关联数组</td><td>-</td></tr><tr><td><code>CONVFMT</code></td><td>数字转换格式</td><td><code>%.6g</code></td></tr><tr><td><code>OFMT</code></td><td>数字输出格式</td><td><code>%.6g</code></td></tr></tbody></table><h3 id="_2-2-字段操作" tabindex="-1"><a class="header-anchor" href="#_2-2-字段操作"><span>2.2 字段操作</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 打印指定字段</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;Alice 85 90 78&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $1, $2}&#39;</span><span style="color:#7F848E;font-style:italic;">      # Alice 85</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;Alice 85 90 78&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $1, $NF}&#39;</span><span style="color:#7F848E;font-style:italic;">      # Alice 78（第一个和最后一个）</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;Alice 85 90 78&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $(NF-1)}&#39;</span><span style="color:#7F848E;font-style:italic;">      # 90（倒数第二个）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改字段会重建 $0</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;a b c&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{$2 = &quot;X&quot;; print $0}&#39;</span><span style="color:#7F848E;font-style:italic;">          # a X c</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;a b c&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{$2 = &quot;X&quot;; print}&#39;</span><span style="color:#7F848E;font-style:italic;">             # a X c（print 等同 print $0）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加字段</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;a b c&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{$4 = &quot;d&quot;; print}&#39;</span><span style="color:#7F848E;font-style:italic;">             # a b c d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 字段求和</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &#39;Alice 85\\nBob 92\\nCarol 78&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{sum += $2} END {print sum}&#39;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 255</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 打印字段数量</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;a b c d e&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print NF}&#39;</span><span style="color:#7F848E;font-style:italic;">                # 5</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 遍历所有字段</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;a b c d e&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{for(i=1;i&lt;=NF;i++) print i, $i}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-自定义分隔符" tabindex="-1"><a class="header-anchor" href="#_2-3-自定义分隔符"><span>2.3 自定义分隔符</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># -F 指定字段分隔符</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;a,b,c&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;{print $2}&#39;</span><span style="color:#7F848E;font-style:italic;">              # b</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;a:b:c&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;:&#39;</span><span style="color:#98C379;"> &#39;{print $2}&#39;</span><span style="color:#7F848E;font-style:italic;">              # b</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;a	b	c&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;\\t&#39;</span><span style="color:#98C379;"> &#39;{print $2}&#39;</span><span style="color:#7F848E;font-style:italic;">        # b</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 BEGIN 中设置 FS（更灵活）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN{FS=&quot;,&quot;} {print $2}&#39;</span><span style="color:#98C379;"> data.csv</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 多字符分隔符</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;a::b::c&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;::&#39;</span><span style="color:#98C379;"> &#39;{print $2}&#39;</span><span style="color:#7F848E;font-style:italic;">           # b</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 正则分隔符</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;a1b2c3d&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;[0-9]+&#39;</span><span style="color:#98C379;"> &#39;{print $2}&#39;</span><span style="color:#7F848E;font-style:italic;">       # b</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出分隔符 OFS</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;a,b,c&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> OFS=&#39;|&#39;</span><span style="color:#98C379;"> &#39;{$1=$1; print}&#39;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># a|b|c</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：$1=$1 触发 $0 重建，OFS 才会生效</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 同时设置输入和输出分隔符</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> OFS=&#39;,&#39;</span><span style="color:#98C379;"> &#39;{print $3, $1, $2}&#39;</span><span style="color:#98C379;"> data.csv</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">OFS 不生效的陷阱</p><p>直接 <code>print $1, $2</code> 用逗号分隔时，输出使用 OFS；但 <code>print $1 &quot; &quot; $2</code> 用字符串连接时，OFS 不起作用。另外，仅修改字段不触发 <code>$0</code> 重建时，OFS 也不会反映。解决方法：<code>$1=$1</code> 或 <code>{$1=$1; print}</code>。</p></div><h3 id="_2-4-记录分隔符" tabindex="-1"><a class="header-anchor" href="#_2-4-记录分隔符"><span>2.4 记录分隔符</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># RS ——记录分隔符（默认换行符）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 处理多行记录（如段落）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 段落模式：空行分隔的记录</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN{RS=&quot;&quot;; FS=&quot;\\n&quot;} {print &quot;段落:&quot;, NR, &quot;第一行:&quot;, $1}&#39;</span><span style="color:#98C379;"> paragraphs.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 多字符 RS（gawk 扩展）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN{RS=&quot;&lt;/record&gt;\\n&quot;} {print}&#39;</span><span style="color:#98C379;"> data.xml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># RT 变量（gawk 扩展）：记录匹配 RS 的实际文本</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN{RS=&quot;[0-9]+&quot;} {print RT}&#39;</span><span style="color:#98C379;"> file</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-5-fpat-字段定义-gawk" tabindex="-1"><a class="header-anchor" href="#_2-5-fpat-字段定义-gawk"><span>2.5 FPAT 字段定义（gawk）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 传统 FS 是&quot;字段间的分隔符&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># FPAT 是&quot;字段本身的正则&quot;——处理 CSV 中含逗号的引号字段</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 标准 CSV 解析（字段用引号包裹时内部逗号不分割）</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &#39;&quot;Smith, John&quot;,25,&quot;New York, NY&quot;&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">  awk</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> FPAT=&#39;[^,]*|&quot;[^&quot;]*&quot;&#39;</span><span style="color:#98C379;"> &#39;{print $1, $2, $3}&#39;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Smith, John 25 New York, NY</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 更完善的 CSV FPAT</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> FPAT=&#39;([^,]*)|(&quot;[^&quot;]*&quot;)&#39;</span><span style="color:#98C379;"> &#39;{...}&#39;</span><span style="color:#98C379;"> data.csv</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-模式匹配" tabindex="-1"><a class="header-anchor" href="#_3-模式匹配"><span>3. 模式匹配</span></a></h2><h3 id="_3-1-模式类型" tabindex="-1"><a class="header-anchor" href="#_3-1-模式类型"><span>3.1 模式类型</span></a></h3><table><thead><tr><th>模式类型</th><th>语法</th><th>说明</th></tr></thead><tbody><tr><td>无模式</td><td><code>{动作}</code></td><td>每行都执行</td></tr><tr><td>正则</td><td><code>/正则/</code></td><td>匹配正则的行</td></tr><tr><td>表达式</td><td><code>表达式</code></td><td>表达式为真的行</td></tr><tr><td>范围</td><td><code>/pat1/,/pat2/</code></td><td>从匹配 pat1 到匹配 pat2</td></tr><tr><td>BEGIN</td><td><code>BEGIN</code></td><td>处理前执行一次</td></tr><tr><td>END</td><td><code>END</code></td><td>处理后执行一次</td></tr></tbody></table><h3 id="_3-2-正则模式" tabindex="-1"><a class="header-anchor" href="#_3-2-正则模式"><span>3.2 正则模式</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 匹配包含 error 的行</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;/error/&#39;</span><span style="color:#98C379;"> file</span><span style="color:#7F848E;font-style:italic;">                       # 等同于 grep &#39;error&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 匹配后执行动作</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;/error/{print NR, $0}&#39;</span><span style="color:#98C379;"> file</span><span style="color:#7F848E;font-style:italic;">         # 打印行号和内容</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 字段级正则匹配</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;$1 ~ /^root/&#39;</span><span style="color:#98C379;"> /etc/passwd</span><span style="color:#7F848E;font-style:italic;">           # 第1个字段匹配 root 开头</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;$7 !~ /bash$/&#39;</span><span style="color:#98C379;"> /etc/passwd</span><span style="color:#7F848E;font-style:italic;">          # 第7个字段不匹配 bash 结尾</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 忽略大小写</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN{IGNORECASE=1} /error/&#39;</span><span style="color:#98C379;"> file</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> IGNORECASE=</span><span style="color:#D19A66;">1</span><span style="color:#98C379;"> &#39;/error/&#39;</span><span style="color:#98C379;"> file</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 动态正则（从变量构建）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> pat=&quot;</span><span style="color:#E06C75;">$USER</span><span style="color:#98C379;">&quot;</span><span style="color:#98C379;"> &#39;$0 ~ pat&#39;</span><span style="color:#98C379;"> /etc/passwd</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-表达式模式" tabindex="-1"><a class="header-anchor" href="#_3-3-表达式模式"><span>3.3 表达式模式</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 行号为 5 的行</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NR == 5&#39;</span><span style="color:#98C379;"> file</span><span style="color:#7F848E;font-style:italic;">                       # 等同于 sed -n &#39;5p&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 奇数行</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NR % 2 == 1&#39;</span><span style="color:#98C379;"> file</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第3列大于 100 的行</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;$3 &gt; 100&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第3列在 50 到 100 之间</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;$3 &gt;= 50 &amp;&amp; $3 &lt;= 100&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 组合条件</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;$3 &gt; 100 &amp;&amp; $5 == &quot;active&quot;&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;$3 &gt; 100 || $5 == &quot;active&quot;&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 空行</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NF == 0&#39;</span><span style="color:#98C379;"> file</span><span style="color:#7F848E;font-style:italic;">                       # 字段数为0即空行</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;!NF&#39;</span><span style="color:#98C379;"> file</span><span style="color:#7F848E;font-style:italic;">                           # 同上（更简洁）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 非空行</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NF &gt; 0&#39;</span><span style="color:#98C379;"> file</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NF&#39;</span><span style="color:#98C379;"> file</span><span style="color:#7F848E;font-style:italic;">                            # 同上</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-范围模式" tabindex="-1"><a class="header-anchor" href="#_3-4-范围模式"><span>3.4 范围模式</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 打印从 START 到 END 之间的行</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;/START/,/END/&#39;</span><span style="color:#98C379;"> file</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 打印第 5 到 10 行</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NR&gt;=5 &amp;&amp; NR&lt;=10&#39;</span><span style="color:#98C379;"> file</span><span style="color:#7F848E;font-style:italic;">               # 比 sed &#39;5,10p&#39; 更灵活</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 打印第一个匹配及其后 3 行</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;/pattern/{found=1; count=0} found &amp;&amp; count&lt;=3{print; count++}&#39;</span><span style="color:#98C379;"> file</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 范围模式 + 动作</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;/BEGIN_TABLE/,/END_TABLE/{print $2, $3}&#39;</span><span style="color:#98C379;"> data.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-流程控制" tabindex="-1"><a class="header-anchor" href="#_4-流程控制"><span>4. 流程控制</span></a></h2><h3 id="_4-1-if-else" tabindex="-1"><a class="header-anchor" href="#_4-1-if-else"><span>4.1 if-else</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基本 if</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{if ($3 &gt; 90) print $1, &quot;优秀&quot;}&#39;</span><span style="color:#98C379;"> grades.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># if-else</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    if ($3 &gt;= 90) grade = &quot;A&quot;</span></span>
<span class="line"><span style="color:#98C379;">    else if ($3 &gt;= 80) grade = &quot;B&quot;</span></span>
<span class="line"><span style="color:#98C379;">    else if ($3 &gt;= 70) grade = &quot;C&quot;</span></span>
<span class="line"><span style="color:#98C379;">    else if ($3 &gt;= 60) grade = &quot;D&quot;</span></span>
<span class="line"><span style="color:#98C379;">    else grade = &quot;F&quot;</span></span>
<span class="line"><span style="color:#98C379;">    print $1, grade</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> grades.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 单行条件表达式（三元运算符）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $1, ($3 &gt;= 60 ? &quot;PASS&quot; : &quot;FAIL&quot;)}&#39;</span><span style="color:#98C379;"> grades.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># if 在动作块中的位置</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    if ($3 &gt; 90) {</span></span>
<span class="line"><span style="color:#98C379;">        count++</span></span>
<span class="line"><span style="color:#98C379;">        print $1, &quot;优秀&quot;</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    print &quot;优秀人数:&quot;, count</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> grades.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-for-循环" tabindex="-1"><a class="header-anchor" href="#_4-2-for-循环"><span>4.2 for 循环</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># C 风格 for 循环</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= NF; i++) {</span></span>
<span class="line"><span style="color:#98C379;">        sum[i] += $i</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= length(sum); i++) {</span></span>
<span class="line"><span style="color:#98C379;">        print &quot;字段&quot; i &quot;总和:&quot;, sum[i]</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 遍历数组（for-in）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    count[$1]++</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    for (key in count) {</span></span>
<span class="line"><span style="color:#98C379;">        print key, count[key]</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 嵌套循环</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= NF; i++) {</span></span>
<span class="line"><span style="color:#98C379;">        for (j = i + 1; j &lt;= NF; j++) {</span></span>
<span class="line"><span style="color:#98C379;">            if ($i == $j) print &quot;重复:&quot;, $i</span></span>
<span class="line"><span style="color:#98C379;">        }</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 循环控制：break 和 continue</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= NF; i++) {</span></span>
<span class="line"><span style="color:#98C379;">        if ($i == &quot;&quot;) continue       # 跳过空字段</span></span>
<span class="line"><span style="color:#98C379;">        if ($i == &quot;STOP&quot;) break      # 遇到 STOP 停止</span></span>
<span class="line"><span style="color:#98C379;">        print $i</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-while-与-do-while" tabindex="-1"><a class="header-anchor" href="#_4-3-while-与-do-while"><span>4.3 while 与 do-while</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># while 循环</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    i = 1</span></span>
<span class="line"><span style="color:#98C379;">    while (i &lt;= NF) {</span></span>
<span class="line"><span style="color:#98C379;">        if ($i ~ /^[0-9]+$/) sum += $i</span></span>
<span class="line"><span style="color:#98C379;">        i++</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    print &quot;数字总和:&quot;, sum</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># do-while 循环（至少执行一次）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    i = 1</span></span>
<span class="line"><span style="color:#98C379;">    do {</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%s &quot;, $i</span></span>
<span class="line"><span style="color:#98C379;">        i++</span></span>
<span class="line"><span style="color:#98C379;">    } while (i &lt;= NF)</span></span>
<span class="line"><span style="color:#98C379;">    print &quot;&quot;</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 实用案例：逐字符处理</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    i = 1</span></span>
<span class="line"><span style="color:#98C379;">    while (i &lt;= length($0)) {</span></span>
<span class="line"><span style="color:#98C379;">        c = substr($0, i, 1)</span></span>
<span class="line"><span style="color:#98C379;">        if (c ~ /[a-zA-Z]/) letters++</span></span>
<span class="line"><span style="color:#98C379;">        else if (c ~ /[0-9]/) digits++</span></span>
<span class="line"><span style="color:#98C379;">        i++</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    print &quot;字母:&quot;, letters, &quot;数字:&quot;, digits</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> file</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-next-与-exit" tabindex="-1"><a class="header-anchor" href="#_4-4-next-与-exit"><span>4.4 next 与 exit</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># next ——跳过当前行，处理下一行</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    if ($0 ~ /^#/) next         # 跳过注释行</span></span>
<span class="line"><span style="color:#98C379;">    if (NF == 0) next           # 跳过空行</span></span>
<span class="line"><span style="color:#98C379;">    # 处理有效数据...</span></span>
<span class="line"><span style="color:#98C379;">    print $0</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> config.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># exit ——终止 awk 程序</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    if ($3 &gt; 1000) {</span></span>
<span class="line"><span style="color:#98C379;">        print &quot;发现异常值:&quot;, $0</span></span>
<span class="line"><span style="color:#98C379;">        exit 1                   # 退出码 1</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    print &quot;检查完成，无异常&quot;</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># exit 在 END 块中的行为</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># exit N 在主循环中：立即进入 END 块，END 块执行完后以 N 退出</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># exit N 在 END 块中：立即以 N 退出</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-数组" tabindex="-1"><a class="header-anchor" href="#_5-数组"><span>5. 数组</span></a></h2><h3 id="_5-1-关联数组" tabindex="-1"><a class="header-anchor" href="#_5-1-关联数组"><span>5.1 关联数组</span></a></h3><p>awk 的数组是关联数组（类似 Python 的 dict、JavaScript 的 object），下标可以是任意字符串。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基本用法</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    count[$1]++        # 以第1列为 key 计数</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    for (key in count) {</span></span>
<span class="line"><span style="color:#98C379;">        print key, count[key]</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 统计单词频次</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= NF; i++) {</span></span>
<span class="line"><span style="color:#98C379;">        words[$i]++</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    for (w in words) {</span></span>
<span class="line"><span style="color:#98C379;">        print words[w], w</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> text.txt</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 统计 HTTP 状态码分布</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    status[$9]++</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    for (s in status) {</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%5d %s\\n&quot;, status[s], s</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> access.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 去重</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;!seen[$1]++&#39;</span><span style="color:#98C379;"> data.txt</span><span style="color:#7F848E;font-style:italic;">      # 只输出第1列首次出现的行</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 分组求和</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    sum[$1] += $3                # 按 $1 分组，累加 $3</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    for (key in sum) {</span></span>
<span class="line"><span style="color:#98C379;">        print key, sum[key]</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-多维数组" tabindex="-1"><a class="header-anchor" href="#_5-2-多维数组"><span>5.2 多维数组</span></a></h3><p>awk 没有真正的多维数组，但可以用 <code>SUBSEP</code>（默认 <code>\\034</code>）拼接下标来模拟。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 模拟二维数组</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    matrix[$1, $2] = $3          # 等价于 matrix[$1 SUBSEP $2] = $3</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    for (key in matrix) {</span></span>
<span class="line"><span style="color:#98C379;">        split(key, parts, SUBSEP)</span></span>
<span class="line"><span style="color:#98C379;">        print parts[1], parts[2], matrix[key]</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 实战：统计每种状态码各 IP 的出现次数</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    count[$1, $9]++              # IP + 状态码 二维计数</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    for (key in count) {</span></span>
<span class="line"><span style="color:#98C379;">        split(key, parts, SUBSEP)</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;IP: %-15s Status: %s Count: %d\\n&quot;, parts[1], parts[2], count[key]</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> access.log</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 实战：交叉表（行列汇总）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    row[$1] = 1</span></span>
<span class="line"><span style="color:#98C379;">    col[$2] = 1</span></span>
<span class="line"><span style="color:#98C379;">    data[$1, $2] = $3</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">END {</span></span>
<span class="line"><span style="color:#98C379;">    # 打印表头</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-10s&quot;, &quot;&quot;</span></span>
<span class="line"><span style="color:#98C379;">    for (c in col) printf &quot;%10s&quot;, c</span></span>
<span class="line"><span style="color:#98C379;">    print &quot;&quot;</span></span>
<span class="line"><span style="color:#98C379;">    # 打印每行</span></span>
<span class="line"><span style="color:#98C379;">    for (r in row) {</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%-10s&quot;, r</span></span>
<span class="line"><span style="color:#98C379;">        for (c in col) {</span></span>
<span class="line"><span style="color:#98C379;">            printf &quot;%10d&quot;, data[r, c] + 0</span></span>
<span class="line"><span style="color:#98C379;">        }</span></span>
<span class="line"><span style="color:#98C379;">        print &quot;&quot;</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> sales.csv</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-数组函数" tabindex="-1"><a class="header-anchor" href="#_5-3-数组函数"><span>5.3 数组函数</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># delete ——删除数组元素</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    arr[$1] = $2</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    delete arr[&quot;tmp&quot;]          # 删除指定元素</span></span>
<span class="line"><span style="color:#98C379;">    for (k in arr) print k, arr[k]</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># length ——数组长度（gawk）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{arr[$1]++} END {print length(arr)}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># asort ——按值排序（gawk）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{arr[$1] = $2} END {</span></span>
<span class="line"><span style="color:#98C379;">    n = asort(arr, sorted)     # 按值排序，存入 sorted</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= n; i++) print i, sorted[i]</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># asorti ——按下标排序（gawk）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{arr[$1] = $2} END {</span></span>
<span class="line"><span style="color:#98C379;">    n = asorti(arr, sorted)    # 按下标排序</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= n; i++) print sorted[i], arr[sorted[i]]</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-数组高级技巧" tabindex="-1"><a class="header-anchor" href="#_5-4-数组高级技巧"><span>5.4 数组高级技巧</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 集合操作（利用数组 key 的唯一性）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 并集</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{set[$1] = 1} END {for (k in set) print k}&#39;</span><span style="color:#98C379;"> file1</span><span style="color:#98C379;"> file2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 交集</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NR == FNR {set[$1] = 1; next} $1 in set {print $1}&#39;</span><span style="color:#98C379;"> file1</span><span style="color:#98C379;"> file2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 差集（file1 有但 file2 没有）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NR == FNR {set[$1] = 1; next} !($1 in set) {print $1}&#39;</span><span style="color:#98C379;"> file2</span><span style="color:#98C379;"> file1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 对称差集</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{set[$1]++} END {for (k in set) if (set[k] == 1) print k}&#39;</span><span style="color:#98C379;"> file1</span><span style="color:#98C379;"> file2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 数组切片与分组</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    group = int($2 / 10) * 10    # 按区间分组（0-9, 10-19, ...）</span></span>
<span class="line"><span style="color:#98C379;">    bucket[group]++</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    for (g in bucket) {</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%3d-%3d: %d\\n&quot;, g, g+9, bucket[g]</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> scores.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-内置函数" tabindex="-1"><a class="header-anchor" href="#_6-内置函数"><span>6. 内置函数</span></a></h2><h3 id="_6-1-字符串函数" tabindex="-1"><a class="header-anchor" href="#_6-1-字符串函数"><span>6.1 字符串函数</span></a></h3><table><thead><tr><th>函数</th><th>语法</th><th>说明</th></tr></thead><tbody><tr><td><code>length</code></td><td><code>length(s)</code></td><td>返回字符串长度</td></tr><tr><td><code>substr</code></td><td><code>substr(s, start[, len])</code></td><td>截取子串（start 从 1 开始）</td></tr><tr><td><code>split</code></td><td><code>split(s, arr[, sep])</code></td><td>分割字符串到数组</td></tr><tr><td><code>index</code></td><td><code>index(s, t)</code></td><td>返回 t 在 s 中的位置（0=未找到）</td></tr><tr><td><code>match</code></td><td><code>match(s, /正则/)</code></td><td>正则匹配，设置 RSTART 和 RLENGTH</td></tr><tr><td><code>sub</code></td><td><code>sub(/正则/, repl[, target])</code></td><td>替换第一个匹配</td></tr><tr><td><code>gsub</code></td><td><code>gsub(/正则/, repl[, target])</code></td><td>替换所有匹配</td></tr><tr><td><code>gensub</code></td><td><code>gensub(/正则/, repl, how[, target])</code></td><td>灵活替换（gawk）</td></tr><tr><td><code>sprintf</code></td><td><code>sprintf(&quot;fmt&quot;, args...)</code></td><td>格式化字符串</td></tr><tr><td><code>tolower</code></td><td><code>tolower(s)</code></td><td>转小写</td></tr><tr><td><code>toupper</code></td><td><code>toupper(s)</code></td><td>转大写</td></tr></tbody></table><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># length ——字符串长度</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;hello&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print length($0)}&#39;</span><span style="color:#7F848E;font-style:italic;">          # 5</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print NR, length($0)}&#39;</span><span style="color:#98C379;"> file</span><span style="color:#7F848E;font-style:italic;">                 # 每行的行号和长度</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># substr ——截取子串</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Hello World&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print substr($0, 7)}&#39;</span><span style="color:#7F848E;font-style:italic;">     # World（从第7字符到末尾）</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Hello World&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print substr($0, 1, 5)}&#39;</span><span style="color:#7F848E;font-style:italic;">  # Hello（前5个字符）</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;20240115&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print substr($0,1,4)&quot;-&quot;substr($0,5,2)&quot;-&quot;substr($0,7,2)}&#39;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2024-01-15</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># split ——分割字符串</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    n = split($0, parts, &quot;,&quot;)</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= n; i++) print i, parts[i]</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#ABB2BF;"> &lt;&lt;&lt; </span><span style="color:#98C379;">&quot;a,b,c,d&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># index ——查找子串位置</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Hello World&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print index($0, &quot;World&quot;)}&#39;</span><span style="color:#7F848E;font-style:italic;">   # 7</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Hello World&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{if (index($0, &quot;World&quot;) &gt; 0) print &quot;found&quot;}&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># tolower / toupper ——大小写转换</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Hello World&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print tolower($0)}&#39;</span><span style="color:#7F848E;font-style:italic;">   # hello world</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Hello World&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print toupper($0)}&#39;</span><span style="color:#7F848E;font-style:italic;">   # HELLO WORLD</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-正则替换函数" tabindex="-1"><a class="header-anchor" href="#_6-2-正则替换函数"><span>6.2 正则替换函数</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># sub ——替换第一个匹配</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;hello world hello&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{sub(/hello/, &quot;HI&quot;); print}&#39;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HI world hello</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># sub 修改指定字段</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;hello world&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{sub(/hello/, &quot;HI&quot;, $1); print}&#39;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HI world</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># gsub ——替换所有匹配</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;hello world hello&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{gsub(/hello/, &quot;HI&quot;); print}&#39;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HI world HI</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># gsub 删除匹配</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;price: </span><span style="color:#E06C75;">$100</span><span style="color:#98C379;">, tax: </span><span style="color:#E06C75;">$20</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{gsub(/\\$/, &quot;&quot;); print}&#39;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># price: 100, tax: 20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># gensub ——灵活替换（gawk）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第三个参数：g=全局, 数字=第几个, 字符串=从第几个开始</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;a1b2c3&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print gensub(/[0-9]/, &quot;X&quot;, &quot;g&quot;)}&#39;</span><span style="color:#7F848E;font-style:italic;">       # aXbXcX</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;a1b2c3&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print gensub(/[0-9]/, &quot;X&quot;, 2)}&#39;</span><span style="color:#7F848E;font-style:italic;">         # a1bXc3</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;a1b2c3&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print gensub(/[0-9]/, &quot;X&quot;, 1)}&#39;</span><span style="color:#7F848E;font-style:italic;">         # aXb2c3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># gensub 支持反向引用 \\n</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;hello world&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print gensub(/(\\w+)/, &quot;[\\\\1]&quot;, &quot;g&quot;)}&#39;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># [hello] [world]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># match ——正则匹配并获取位置</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;2024-01-15&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    if (match($0, /[0-9]{4}/)) {</span></span>
<span class="line"><span style="color:#98C379;">        print &quot;年份:&quot;, substr($0, RSTART, RLENGTH)</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 年份: 2024</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># match 与动态正则</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    pat = &quot;[0-9]+\\\\.[0-9]+&quot;</span></span>
<span class="line"><span style="color:#98C379;">    if (match($0, pat)) {</span></span>
<span class="line"><span style="color:#98C379;">        print substr($0, RSTART, RLENGTH)</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-数值函数" tabindex="-1"><a class="header-anchor" href="#_6-3-数值函数"><span>6.3 数值函数</span></a></h3><table><thead><tr><th>函数</th><th>说明</th><th>示例</th></tr></thead><tbody><tr><td><code>int(x)</code></td><td>取整（截断，向零取整）</td><td><code>int(3.9)</code> → 3，<code>int(-3.7)</code> → -3</td></tr><tr><td><code>sqrt(x)</code></td><td>平方根</td><td><code>sqrt(16)</code> → 4</td></tr><tr><td><code>rand()</code></td><td>随机数 [0,1)</td><td><code>int(rand()*100)</code></td></tr><tr><td><code>srand([seed])</code></td><td>设置随机种子</td><td><code>srand()</code></td></tr><tr><td><code>sin(x)</code> / <code>cos(x)</code></td><td>三角函数（弧度）</td><td><code>sin(0)</code> → 0</td></tr><tr><td><code>atan2(y, x)</code></td><td>反正切</td><td><code>atan2(1,1)*180/3.14159</code> → 45</td></tr><tr><td><code>exp(x)</code></td><td>e^x</td><td><code>exp(1)</code> → 2.71828</td></tr><tr><td><code>log(x)</code></td><td>自然对数</td><td><code>log(2.71828)</code> → 1</td></tr></tbody></table><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 生成随机数</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN{srand(); for(i=0;i&lt;5;i++) print int(rand()*100)}&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 求绝对值（awk 没有内置 abs）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print ($1 &lt; 0 ? -$1 : $1)}&#39;</span><span style="color:#ABB2BF;"> &lt;&lt;&lt; </span><span style="color:#98C379;">&quot;-5&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># gawk 内置 abs</span></span>
<span class="line"><span style="color:#61AFEF;">gawk</span><span style="color:#98C379;"> &#39;{print abs($1)}&#39;</span><span style="color:#ABB2BF;"> &lt;&lt;&lt; </span><span style="color:#98C379;">&quot;-5&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 计算标准差</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    vals[NR] = $1</span></span>
<span class="line"><span style="color:#98C379;">    sum += $1</span></span>
<span class="line"><span style="color:#98C379;">    n = NR</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    mean = sum / n</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= n; i++) {</span></span>
<span class="line"><span style="color:#98C379;">        diff = vals[i] - mean</span></span>
<span class="line"><span style="color:#98C379;">        var += diff * diff</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">    std = sqrt(var / n)</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;均值: %.2f, 标准差: %.2f\\n&quot;, mean, std</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> numbers.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-4-时间函数-gawk" tabindex="-1"><a class="header-anchor" href="#_6-4-时间函数-gawk"><span>6.4 时间函数（gawk）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># systime ——当前时间戳</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN{print systime()}&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># strftime ——格式化时间</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN{print strftime(&quot;%Y-%m-%d %H:%M:%S&quot;)}&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># mktime ——从时间组件生成时间戳</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN{ts = mktime(&quot;2024 01 15 09 30 00&quot;); print strftime(&quot;%Y-%m-%d %H:%M:%S&quot;, ts)}&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 日志时间转换</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    # 将 Apache 日志时间 [15/Jan/2024:09:30:00 +0800] 转为时间戳</span></span>
<span class="line"><span style="color:#98C379;">    match($0, /\\[([0-9]{2})\\/([A-Za-z]{3})\\/([0-9]{4}):([0-9]{2}):([0-9]{2}):([0-9]{2})/, arr)</span></span>
<span class="line"><span style="color:#98C379;">    # gawk 的 match 数组捕获</span></span>
<span class="line"><span style="color:#98C379;">}1&#39;</span><span style="color:#98C379;"> access.log</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 计算时间差</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN{</span></span>
<span class="line"><span style="color:#98C379;">    start = mktime(&quot;2024 01 15 09 00 00&quot;)</span></span>
<span class="line"><span style="color:#98C379;">    end = mktime(&quot;2024 01 15 18 00 00&quot;)</span></span>
<span class="line"><span style="color:#98C379;">    hours = (end - start) / 3600</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;工时: %.1f 小时\\n&quot;, hours</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-自定义函数" tabindex="-1"><a class="header-anchor" href="#_7-自定义函数"><span>7. 自定义函数</span></a></h2><h3 id="_7-1-函数定义与调用" tabindex="-1"><a class="header-anchor" href="#_7-1-函数定义与调用"><span>7.1 函数定义与调用</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基本函数定义</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">function max(a, b) {</span></span>
<span class="line"><span style="color:#98C379;">    return (a &gt; b ? a : b)</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">function min(a, b) {</span></span>
<span class="line"><span style="color:#98C379;">    return (a &lt; b ? a : b)</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    print max($1, $2), min($1, $2)</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 函数中的局部变量</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># awk 函数的额外参数自动成为局部变量</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">function trim(s,    result) {       # result 是局部变量</span></span>
<span class="line"><span style="color:#98C379;">    gsub(/^[[:space:]]+/, &quot;&quot;, s)</span></span>
<span class="line"><span style="color:#98C379;">    gsub(/[[:space:]]+$/, &quot;&quot;, s)</span></span>
<span class="line"><span style="color:#98C379;">    return s</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    print &quot;[&quot; trim($0) &quot;]&quot;</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 递归函数</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">function factorial(n) {</span></span>
<span class="line"><span style="color:#98C379;">    if (n &lt;= 1) return 1</span></span>
<span class="line"><span style="color:#98C379;">    return n * factorial(n - 1)</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">BEGIN {</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= 10; i++) {</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%2d! = %d\\n&quot;, i, factorial(i)</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">awk 函数的局部变量</p><p>awk 函数没有专门的局部变量声明语法。约定：在参数列表末尾添加额外参数作为局部变量，调用时不传入。这些参数名前加空格以区分。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 惯例：局部变量前多加空格</span></span>
<span class="line"><span style="color:#C678DD;">function</span><span style="color:#61AFEF;"> myfunc</span><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">param1,</span><span style="color:#98C379;"> param2,</span><span style="color:#98C379;">    local1,</span><span style="color:#98C379;"> local2</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # param1, param2 是参数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # local1, local2 是局部变量</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div><h3 id="_7-2-实用函数库" tabindex="-1"><a class="header-anchor" href="#_7-2-实用函数库"><span>7.2 实用函数库</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 通用工具函数</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;"># 绝对值</span></span>
<span class="line"><span style="color:#98C379;">function abs(x) {</span></span>
<span class="line"><span style="color:#98C379;">    return (x &lt; 0 ? -x : x)</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 判断是否为数字</span></span>
<span class="line"><span style="color:#98C379;">function isnum(s) {</span></span>
<span class="line"><span style="color:#98C379;">    return s ~ /^-?[0-9]+\\.?[0-9]*$/</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 字符串重复</span></span>
<span class="line"><span style="color:#98C379;">function repeat(s, n,    result) {</span></span>
<span class="line"><span style="color:#98C379;">    result = &quot;&quot;</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 0; i &lt; n; i++) result = result s</span></span>
<span class="line"><span style="color:#98C379;">    return result</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 左填充</span></span>
<span class="line"><span style="color:#98C379;">function lpad(s, width,    pad) {</span></span>
<span class="line"><span style="color:#98C379;">    pad = width - length(s)</span></span>
<span class="line"><span style="color:#98C379;">    if (pad &gt; 0) return repeat(&quot; &quot;, pad) s</span></span>
<span class="line"><span style="color:#98C379;">    return s</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 右填充</span></span>
<span class="line"><span style="color:#98C379;">function rpad(s, width,    pad) {</span></span>
<span class="line"><span style="color:#98C379;">    pad = width - length(s)</span></span>
<span class="line"><span style="color:#98C379;">    if (pad &gt; 0) return s repeat(&quot; &quot;, pad)</span></span>
<span class="line"><span style="color:#98C379;">    return s</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># JSON 转义</span></span>
<span class="line"><span style="color:#98C379;">function json_escape(s) {</span></span>
<span class="line"><span style="color:#98C379;">    gsub(/\\\\/, &quot;\\\\\\\\&quot;, s)</span></span>
<span class="line"><span style="color:#98C379;">    gsub(/&quot;/, &quot;\\\\\\&quot;&quot;, s)</span></span>
<span class="line"><span style="color:#98C379;">    gsub(/\\t/, &quot;\\\\t&quot;, s)</span></span>
<span class="line"><span style="color:#98C379;">    gsub(/\\n/, &quot;\\\\n&quot;, s)</span></span>
<span class="line"><span style="color:#98C379;">    return s</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 测试</span></span>
<span class="line"><span style="color:#98C379;">BEGIN {</span></span>
<span class="line"><span style="color:#98C379;">    print abs(-42)</span></span>
<span class="line"><span style="color:#98C379;">    print isnum(&quot;3.14&quot;), isnum(&quot;abc&quot;)</span></span>
<span class="line"><span style="color:#98C379;">    print &quot;[&quot; lpad(&quot;hello&quot;, 10) &quot;]&quot;</span></span>
<span class="line"><span style="color:#98C379;">    print &quot;[&quot; rpad(&quot;hello&quot;, 10) &quot;]&quot;</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-函数库文件" tabindex="-1"><a class="header-anchor" href="#_7-3-函数库文件"><span>7.3 函数库文件</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 创建函数库文件 utils.awk</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/tmp/utils.awk</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;AWKLIB&#39;</span></span>
<span class="line"><span style="color:#98C379;">function abs(x) { return (x &lt; 0 ? -x : x) }</span></span>
<span class="line"><span style="color:#98C379;">function trim(s) { gsub(/^[[:space:]]+/, &quot;&quot;, s); gsub(/[[:space:]]+$/, &quot;&quot;, s); return s }</span></span>
<span class="line"><span style="color:#98C379;">function lpad(s, w,    p) { p = w - length(s); return (p &gt; 0 ? sprintf(&quot;%&quot;p&quot;s&quot;, &quot;&quot;) s : s) }</span></span>
<span class="line"><span style="color:#98C379;">function rpad(s, w,    p) { p = w - length(s); return (p &gt; 0 ? s sprintf(&quot;%&quot;p&quot;s&quot;, &quot;&quot;) : s) }</span></span>
<span class="line"><span style="color:#98C379;">function isnum(s) { return s ~ /^-?[0-9]+\\.?[0-9]*$/ }</span></span>
<span class="line"><span style="color:#ABB2BF;">AWKLIB</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用函数库</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> /tmp/utils.awk</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &#39;{print lpad($1, 15), rpad($2, 10), $3}&#39;</span><span style="color:#98C379;"> data.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_8-awk-与管道" tabindex="-1"><a class="header-anchor" href="#_8-awk-与管道"><span>8. awk 与管道</span></a></h2><h3 id="_8-1-输出到外部命令" tabindex="-1"><a class="header-anchor" href="#_8-1-输出到外部命令"><span>8.1 输出到外部命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 将 awk 输出传递给外部命令</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $1 | &quot;sort -u&quot;}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 多个管道分别处理</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    if ($3 &gt; 90) print $0 | &quot;mail -s &#39;优秀学生&#39; teacher@example.com&quot;</span></span>
<span class="line"><span style="color:#98C379;">    else print $0 | &quot;cat &gt; average.txt&quot;</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> grades.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 写入多个文件</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    if ($3 &gt; 90) print &gt; &quot;excellent.txt&quot;</span></span>
<span class="line"><span style="color:#98C379;">    else if ($3 &gt; 60) print &gt; &quot;pass.txt&quot;</span></span>
<span class="line"><span style="color:#98C379;">    else print &gt; &quot;fail.txt&quot;</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> grades.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-从外部命令读取" tabindex="-1"><a class="header-anchor" href="#_8-2-从外部命令读取"><span>8.2 从外部命令读取</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 读取命令输出</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN {</span></span>
<span class="line"><span style="color:#98C379;">    while ((&quot;ls -la&quot; | getline line) &gt; 0) {</span></span>
<span class="line"><span style="color:#98C379;">        print line</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">    close(&quot;ls -la&quot;)</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 读取系统信息</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN {</span></span>
<span class="line"><span style="color:#98C379;">    while ((&quot;df -h&quot; | getline) &gt; 0) {</span></span>
<span class="line"><span style="color:#98C379;">        if (NR &gt; 1 &amp;&amp; int($5) &gt; 80) {</span></span>
<span class="line"><span style="color:#98C379;">            print &quot;磁盘告警:&quot;, $1, $5, &quot;已使用&quot;</span></span>
<span class="line"><span style="color:#98C379;">        }</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">    close(&quot;df -h&quot;)</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 两遍读取文件（先统计再处理）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    vals[NR] = $0</span></span>
<span class="line"><span style="color:#98C379;">    sum += $1</span></span>
<span class="line"><span style="color:#98C379;">    n = NR</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    mean = sum / n</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= n; i++) {</span></span>
<span class="line"><span style="color:#98C379;">        if (vals[i] + 0 &gt; mean * 2) {</span></span>
<span class="line"><span style="color:#98C379;">            print &quot;异常值:&quot;, vals[i], &quot;(均值:&quot;, mean, &quot;)&quot;</span></span>
<span class="line"><span style="color:#98C379;">        }</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-getline-详解" tabindex="-1"><a class="header-anchor" href="#_8-3-getline-详解"><span>8.3 getline 详解</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># getline 从文件读取</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    print $0</span></span>
<span class="line"><span style="color:#98C379;">    while ((getline line &lt; &quot;extra.txt&quot;) &gt; 0) {</span></span>
<span class="line"><span style="color:#98C379;">        print &quot;EXTRA:&quot;, line</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">    close(&quot;extra.txt&quot;)</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> main.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># getline 从管道读取</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    cmd = &quot;date +%s&quot;</span></span>
<span class="line"><span style="color:#98C379;">    cmd | getline timestamp</span></span>
<span class="line"><span style="color:#98C379;">    close(cmd)</span></span>
<span class="line"><span style="color:#98C379;">    print timestamp, $0</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># getline 赋值给变量</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;/pattern/{</span></span>
<span class="line"><span style="color:#98C379;">    getline nextline</span></span>
<span class="line"><span style="color:#98C379;">    print $0, nextline</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> file</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># getline 的返回值</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#  &gt; 0 : 成功读取</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#  = 0 : 到达文件末尾</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#  &lt; 0 : 错误</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    while ((getline line &lt; &quot;data.txt&quot;) &gt; 0) {</span></span>
<span class="line"><span style="color:#98C379;">        print line</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">    close(&quot;data.txt&quot;)</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">getline 的陷阱</p><ol><li><code>getline</code> 修改 <code>NR</code> 和 <code>FNR</code></li><li><code>getline var</code> 不会修改 <code>$0</code>、<code>$1</code> 等</li><li>无参 <code>getline</code> 会覆盖 <code>$0</code> 并重新分割字段</li><li>必须用 <code>close()</code> 关闭管道/文件，否则会泄露文件描述符</li><li>循环中使用 getline 时，务必检查返回值</li></ol></div><h2 id="_9-格式化输出" tabindex="-1"><a class="header-anchor" href="#_9-格式化输出"><span>9. 格式化输出</span></a></h2><h3 id="_9-1-printf-详解" tabindex="-1"><a class="header-anchor" href="#_9-1-printf-详解"><span>9.1 printf 详解</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># printf 格式符</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># %d  - 整数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># %f  - 浮点数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># %s  - 字符串</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># %x  - 十六进制</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># %o  - 八进制</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># %c  - 字符</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># %e  - 科学计数法</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># %g  - 自动选择 %f 或 %e</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 宽度与对齐</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-20s %5d %8.2f\\n&quot;, $1, $2, $3</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 左对齐20字符  右对齐5位  右对齐8位2位小数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 美化表格输出</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN {</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-20s %-10s %10s %10s\\n&quot;, &quot;名称&quot;, &quot;类型&quot;, &quot;大小&quot;, &quot;占比&quot;</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-20s %-10s %10s %10s\\n&quot;, &quot;----&quot;, &quot;----&quot;, &quot;----&quot;, &quot;----&quot;</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-20s %-10s %10d %9.1f%%\\n&quot;, $1, $2, $3, $4</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> filelist.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 数字格式化</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;BEGIN {</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;整数: %d\\n&quot;, 3.14159       # 3</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;浮点: %.2f\\n&quot;, 3.14159     # 3.14</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;科学: %e\\n&quot;, 3.14159       # 3.141590e+00</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;自动: %g\\n&quot;, 3.14159       # 3.14159</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;十六进制: 0x%x\\n&quot;, 255     # 0xff</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;八进制: 0%o\\n&quot;, 255        # 0377</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;千分位: %&#39;</span><span style="color:#56B6C2;">\\n</span><span style="color:#98C379;">&quot;, 1234567     # 1,234,567（locale相关）</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-报表生成实战" tabindex="-1"><a class="header-anchor" href="#_9-2-报表生成实战"><span>9.2 报表生成实战</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 生成学生成绩报表</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">BEGIN {</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;\\n%-10s %-8s %6s %6s %6s %6s %6s\\n&quot;, \\</span></span>
<span class="line"><span style="color:#98C379;">        &quot;学号&quot;, &quot;姓名&quot;, &quot;语文&quot;, &quot;数学&quot;, &quot;英语&quot;, &quot;总分&quot;, &quot;平均&quot;</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-10s %-8s %6s %6s %6s %6s %6s\\n&quot;, \\</span></span>
<span class="line"><span style="color:#98C379;">        &quot;--------&quot;, &quot;------&quot;, &quot;----&quot;, &quot;----&quot;, &quot;----&quot;, &quot;----&quot;, &quot;----&quot;</span></span>
<span class="line"><span style="color:#98C379;">    total_all = 0</span></span>
<span class="line"><span style="color:#98C379;">    count = 0</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    total = $3 + $4 + $5</span></span>
<span class="line"><span style="color:#98C379;">    avg = total / 3</span></span>
<span class="line"><span style="color:#98C379;">    total_all += total</span></span>
<span class="line"><span style="color:#98C379;">    count++</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-10s %-8s %6d %6d %6d %6d %6.1f\\n&quot;, \\</span></span>
<span class="line"><span style="color:#98C379;">        $1, $2, $3, $4, $5, total, avg</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">END {</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-10s %-8s %6s %6s %6s %6s %6s\\n&quot;, \\</span></span>
<span class="line"><span style="color:#98C379;">        &quot;--------&quot;, &quot;------&quot;, &quot;----&quot;, &quot;----&quot;, &quot;----&quot;, &quot;----&quot;, &quot;----&quot;</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-10s %-8s %6s %6s %6s %6d %6.1f\\n&quot;, \\</span></span>
<span class="line"><span style="color:#98C379;">        &quot;&quot;, &quot;合计&quot;, &quot;&quot;, &quot;&quot;, &quot;&quot;, total_all, total_all/(count*3)</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> grades.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-实战案例" tabindex="-1"><a class="header-anchor" href="#_10-实战案例"><span>10. 实战案例</span></a></h2><h3 id="_10-1-统计分析" tabindex="-1"><a class="header-anchor" href="#_10-1-统计分析"><span>10.1 统计分析</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 案例1：计算平均值、最大值、最小值</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    if (NR == 1) {min = max = $1}</span></span>
<span class="line"><span style="color:#98C379;">    if ($1 &lt; min) min = $1</span></span>
<span class="line"><span style="color:#98C379;">    if ($1 &gt; max) max = $1</span></span>
<span class="line"><span style="color:#98C379;">    sum += $1</span></span>
<span class="line"><span style="color:#98C379;">    count++</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;数量: %d\\n均值: %.2f\\n最小: %.2f\\n最大: %.2f\\n&quot;, \\</span></span>
<span class="line"><span style="color:#98C379;">        count, sum/count, min, max</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> numbers.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 案例2：计算中位数</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    vals[NR] = $1</span></span>
<span class="line"><span style="color:#98C379;">    n = NR</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    # 简单排序（冒泡排序，小数据量可用）</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= n; i++)</span></span>
<span class="line"><span style="color:#98C379;">        for (j = i + 1; j &lt;= n; j++)</span></span>
<span class="line"><span style="color:#98C379;">            if (vals[i] &gt; vals[j]) {</span></span>
<span class="line"><span style="color:#98C379;">                tmp = vals[i]; vals[i] = vals[j]; vals[j] = tmp</span></span>
<span class="line"><span style="color:#98C379;">            }</span></span>
<span class="line"><span style="color:#98C379;">    if (n % 2 == 1)</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;中位数: %.2f\\n&quot;, vals[int(n/2)+1]</span></span>
<span class="line"><span style="color:#98C379;">    else</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;中位数: %.2f\\n&quot;, (vals[n/2] + vals[n/2+1]) / 2</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> numbers.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 案例3：计算百分位数</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    vals[NR] = $1</span></span>
<span class="line"><span style="color:#98C379;">    n = NR</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    # 排序</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= n; i++)</span></span>
<span class="line"><span style="color:#98C379;">        for (j = i + 1; j &lt;= n; j++)</span></span>
<span class="line"><span style="color:#98C379;">            if (vals[i] &gt; vals[j]) {</span></span>
<span class="line"><span style="color:#98C379;">                tmp = vals[i]; vals[i] = vals[j]; vals[j] = tmp</span></span>
<span class="line"><span style="color:#98C379;">            }</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;P50: %.2f\\n&quot;, vals[int(n*0.5)]</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;P90: %.2f\\n&quot;, vals[int(n*0.9)]</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;P95: %.2f\\n&quot;, vals[int(n*0.95)]</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;P99: %.2f\\n&quot;, vals[int(n*0.99)]</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> response_times.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-数据报表" tabindex="-1"><a class="header-anchor" href="#_10-2-数据报表"><span>10.2 数据报表</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 案例1：销售月报</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">BEGIN {</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-10s %10s %10s %10s\\n&quot;, &quot;月份&quot;, &quot;订单数&quot;, &quot;总金额&quot;, &quot;均价&quot;</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-10s %10s %10s %10s\\n&quot;, &quot;------&quot;, &quot;------&quot;, &quot;------&quot;, &quot;------&quot;</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    month = substr($1, 1, 7)       # YYYY-MM</span></span>
<span class="line"><span style="color:#98C379;">    orders[month]++</span></span>
<span class="line"><span style="color:#98C379;">    revenue[month] += $3</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">END {</span></span>
<span class="line"><span style="color:#98C379;">    for (m in orders) {</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%-10s %10d %10.2f %10.2f\\n&quot;, m, orders[m], revenue[m], revenue[m]/orders[m]</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> sales.csv</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 案例2：Nginx 访问日志 TOP URL</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    url[$7]++</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    for (u in url) {</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%6d %s\\n&quot;, url[u], u</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> access.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 案例3：Nginx 访问日志流量统计</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    ip[$1]++</span></span>
<span class="line"><span style="color:#98C379;">    traffic[$1] += $10</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-18s %10s %15s\\n&quot;, &quot;IP&quot;, &quot;请求数&quot;, &quot;流量(B)&quot;</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-18s %10s %15s\\n&quot;, &quot;----&quot;, &quot;------&quot;, &quot;--------&quot;</span></span>
<span class="line"><span style="color:#98C379;">    for (i in ip) {</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%-18s %10d %15d\\n&quot;, i, ip[i], traffic[i]</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> access.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -k2</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-数据-etl" tabindex="-1"><a class="header-anchor" href="#_10-3-数据-etl"><span>10.3 数据 ETL</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 案例1：CSV → JSON 转换</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">BEGIN {</span></span>
<span class="line"><span style="color:#98C379;">    print &quot;[&quot;</span></span>
<span class="line"><span style="color:#98C379;">    first = 1</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">NR == 1 {</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= NF; i++) headers[i] = $i</span></span>
<span class="line"><span style="color:#98C379;">    next</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    if (!first) print &quot;,&quot;</span></span>
<span class="line"><span style="color:#98C379;">    first = 0</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;  {&quot;</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= NF; i++) {</span></span>
<span class="line"><span style="color:#98C379;">        if (i &gt; 1) printf &quot;,&quot;</span></span>
<span class="line"><span style="color:#98C379;">        gsub(/&quot;/, &quot;\\\\\\&quot;&quot;, $i)</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;\\&quot;%s\\&quot;: \\&quot;%s\\&quot;&quot;, headers[i], $i</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;}&quot;</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">END {</span></span>
<span class="line"><span style="color:#98C379;">    print &quot;\\n]&quot;</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.csv</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 案例2：日志 → 结构化数据</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    # Apache 日志格式：IP - - [时间] &quot;方法 URL 协议&quot; 状态码 大小</span></span>
<span class="line"><span style="color:#98C379;">    match($0, /^([0-9.]+) .* \\[([^\\]]+)\\] &quot;([A-Z]+) ([^ ]+) [^&quot;]*&quot; ([0-9]+) ([0-9-]+)/, arr)</span></span>
<span class="line"><span style="color:#98C379;">    if (RSTART &gt; 0) {</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%s|%s|%s|%s|%s|%s\\n&quot;, arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> access.log</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 案例3：宽表 → 长表转换</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">NR == 1 {</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 2; i &lt;= NF; i++) headers[i] = $i</span></span>
<span class="line"><span style="color:#98C379;">    next</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 2; i &lt;= NF; i++) {</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%s,%s,%s\\n&quot;, $1, headers[i], $i</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> wide_table.csv</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 案例4：数据清洗管道</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;|&#39;</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">BEGIN { OFS = &quot;|&quot; }</span></span>
<span class="line"><span style="color:#98C379;">$3 == &quot;&quot; { next }                   # 跳过第3列为空的行</span></span>
<span class="line"><span style="color:#98C379;">$5 &lt; 0 { $5 = 0 }                   # 负值修正为 0</span></span>
<span class="line"><span style="color:#98C379;">/[^[:print:]]/ { next }             # 跳过含不可打印字符的行</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    gsub(/[[:space:]]+/, &quot; &quot;, $2)   # 标准化空格</span></span>
<span class="line"><span style="color:#98C379;">    $4 = toupper($4)                # 统一大写</span></span>
<span class="line"><span style="color:#98C379;">    print</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> raw_data.txt</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">clean_data.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-4-系统运维" tabindex="-1"><a class="header-anchor" href="#_10-4-系统运维"><span>10.4 系统运维</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 案例1：分析进程内存使用</span></span>
<span class="line"><span style="color:#61AFEF;">ps</span><span style="color:#98C379;"> aux</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">NR == 1 {print; next}</span></span>
<span class="line"><span style="color:#98C379;">{mem[$11] += $6; count[$11]++}</span></span>
<span class="line"><span style="color:#98C379;">END {</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-30s %10s %10s\\n&quot;, &quot;进程&quot;, &quot;实例数&quot;, &quot;内存(KB)&quot;</span></span>
<span class="line"><span style="color:#98C379;">    for (p in mem) {</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%-30s %10d %10d\\n&quot;, p, count[p], mem[p]</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -k3</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 案例2：分析 /var/log/auth.log 暴力破解</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;/Failed password/{</span></span>
<span class="line"><span style="color:#98C379;">    ip = $0</span></span>
<span class="line"><span style="color:#98C379;">    sub(/.*from /, &quot;&quot;, ip)</span></span>
<span class="line"><span style="color:#98C379;">    sub(/ port.*/, &quot;&quot;, ip)</span></span>
<span class="line"><span style="color:#98C379;">    fail[ip]++</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-18s %10s\\n&quot;, &quot;IP&quot;, &quot;失败次数&quot;</span></span>
<span class="line"><span style="color:#98C379;">    for (i in fail) {</span></span>
<span class="line"><span style="color:#98C379;">        if (fail[i] &gt; 10)</span></span>
<span class="line"><span style="color:#98C379;">            printf &quot;%-18s %10d ⚠️\\n&quot;, i, fail[i]</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> /var/log/auth.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -k2</span><span style="color:#D19A66;"> -rn</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 案例3：磁盘使用率报表</span></span>
<span class="line"><span style="color:#61AFEF;">df</span><span style="color:#D19A66;"> -h</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">NR == 1 {print; next}</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    usage = int($5)</span></span>
<span class="line"><span style="color:#98C379;">    status = (usage &gt; 90 ? &quot;CRITICAL&quot; : usage &gt; 80 ? &quot;WARNING&quot; : &quot;OK&quot;)</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-20s %6s %6s %6s %6s %-10s %s\\n&quot;, $1, $2, $3, $4, $5, status, $6</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 案例4：连接数统计</span></span>
<span class="line"><span style="color:#61AFEF;">ss</span><span style="color:#D19A66;"> -tn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">NR &gt; 1 {</span></span>
<span class="line"><span style="color:#98C379;">    split($4, addr, &quot;:&quot;)</span></span>
<span class="line"><span style="color:#98C379;">    count[addr[1]]++</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">END {</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-18s %10s\\n&quot;, &quot;IP&quot;, &quot;连接数&quot;</span></span>
<span class="line"><span style="color:#98C379;">    for (ip in count) {</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%-18s %10d\\n&quot;, ip, count[ip]</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -k2</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -20</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_11-awk-高级技巧" tabindex="-1"><a class="header-anchor" href="#_11-awk-高级技巧"><span>11. awk 高级技巧</span></a></h2><h3 id="_11-1-多文件处理" tabindex="-1"><a class="header-anchor" href="#_11-1-多文件处理"><span>11.1 多文件处理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># NR vs FNR</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># NR ——全局行号（跨文件累计）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># FNR ——当前文件行号（每个文件从1开始）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 取两个文件的交集</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NR == FNR {set[$1] = 1; next} $1 in set&#39;</span><span style="color:#98C379;"> file1</span><span style="color:#98C379;"> file2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 合并两个文件（按 key 关联）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NR == FNR {data[$1] = $2; next} {</span></span>
<span class="line"><span style="color:#98C379;">    print $0, data[$1]    # 从 file1 取数据关联到 file2</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> file1</span><span style="color:#98C379;"> file2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 多文件分别统计</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    count[FILENAME]++</span></span>
<span class="line"><span style="color:#98C379;">    size[FILENAME] += length($0)</span></span>
<span class="line"><span style="color:#98C379;">} END {</span></span>
<span class="line"><span style="color:#98C379;">    for (f in count) {</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%-30s %8d 行 %10d 字节\\n&quot;, f, count[f], size[f]</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#E5C07B;"> *</span><span style="color:#98C379;">.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-2-二维数据透视" tabindex="-1"><a class="header-anchor" href="#_11-2-二维数据透视"><span>11.2 二维数据透视</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 透视表：行=产品，列=月份，值=销售额</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">NR == 1 {next}                       # 跳过表头</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    product = $1</span></span>
<span class="line"><span style="color:#98C379;">    month = substr($2, 6, 2)         # 取月份</span></span>
<span class="line"><span style="color:#98C379;">    sales[product, month] += $3</span></span>
<span class="line"><span style="color:#98C379;">    products[product] = 1</span></span>
<span class="line"><span style="color:#98C379;">    months[month] = 1</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">END {</span></span>
<span class="line"><span style="color:#98C379;">    # 表头</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%-15s&quot;, &quot;产品&quot;</span></span>
<span class="line"><span style="color:#98C379;">    for (m in months) printf &quot;%8s&quot;, m</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%8s\\n&quot;, &quot;合计&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">    # 每行</span></span>
<span class="line"><span style="color:#98C379;">    for (p in products) {</span></span>
<span class="line"><span style="color:#98C379;">        total = 0</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%-15s&quot;, p</span></span>
<span class="line"><span style="color:#98C379;">        for (m in months) {</span></span>
<span class="line"><span style="color:#98C379;">            val = sales[p, m] + 0</span></span>
<span class="line"><span style="color:#98C379;">            total += val</span></span>
<span class="line"><span style="color:#98C379;">            printf &quot;%8d&quot;, val</span></span>
<span class="line"><span style="color:#98C379;">        }</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%8d\\n&quot;, total</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> sales.csv</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-3-处理-json-数据" tabindex="-1"><a class="header-anchor" href="#_11-3-处理-json-数据"><span>11.3 处理 JSON 数据</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 简单 JSON 字段提取（无 jq 时）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 提取 &quot;key&quot;: &quot;value&quot; 格式</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;&quot;&#39;</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">/&quot;name&quot;/ {name = $4}</span></span>
<span class="line"><span style="color:#98C379;">/&quot;age&quot;/ {age = $4}</span></span>
<span class="line"><span style="color:#98C379;">/&quot;city&quot;/ {city = $4}</span></span>
<span class="line"><span style="color:#98C379;">/^\\}/ &amp;&amp; name {</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%s|%s|%s\\n&quot;, name, age, city</span></span>
<span class="line"><span style="color:#98C379;">    name = age = city = &quot;&quot;</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> data.json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 gawk 的 JSON 解析（需要扩展库）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 推荐：复杂 JSON 用 jq</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-4-awk-性能优化" tabindex="-1"><a class="header-anchor" href="#_11-4-awk-性能优化"><span>11.4 awk 性能优化</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 减少 I/O：用 -v 传参而非 getline</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 慢</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{while ((&quot;echo &quot; $1 | getline r) &gt; 0) print r; close(&quot;echo &quot; $1)}&#39;</span><span style="color:#98C379;"> file</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 快</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> ts=&quot;$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%s)&quot;</span><span style="color:#98C379;"> &#39;{print ts, $0}&#39;</span><span style="color:#98C379;"> file</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 避免不必要的字符串操作</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 慢：每行都转大写再比较</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{if (toupper($1) == &quot;ERROR&quot;) print}&#39;</span><span style="color:#98C379;"> log</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 快：设置 IGNORECASE</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> IGNORECASE=</span><span style="color:#D19A66;">1</span><span style="color:#98C379;"> &#39;$1 == &quot;ERROR&quot;&#39;</span><span style="color:#98C379;"> log</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 尽早 next 跳过无关行</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">/^#/ {next}</span></span>
<span class="line"><span style="color:#98C379;">/^$/ {next}</span></span>
<span class="line"><span style="color:#98C379;">$3 &lt; 100 {next}</span></span>
<span class="line"><span style="color:#98C379;">{print $0}</span></span>
<span class="line"><span style="color:#98C379;">&#39;</span><span style="color:#98C379;"> data.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 用 mawk 处理大数据（速度是 gawk 的 2-5 倍）</span></span>
<span class="line"><span style="color:#61AFEF;">mawk</span><span style="color:#98C379;"> &#39;{sum += $3} END {print sum}&#39;</span><span style="color:#98C379;"> huge_data.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_12-awk-程序示例" tabindex="-1"><a class="header-anchor" href="#_12-awk-程序示例"><span>12. awk 程序示例</span></a></h2><h3 id="_12-1-词频统计" tabindex="-1"><a class="header-anchor" href="#_12-1-词频统计"><span>12.1 词频统计</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 统计文本中每个单词的出现频率</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    gsub(/[^a-zA-Z0-9]/, &quot; &quot;)        # 非字母数字替换为空格</span></span>
<span class="line"><span style="color:#98C379;">    for (i = 1; i &lt;= NF; i++) {</span></span>
<span class="line"><span style="color:#98C379;">        word = tolower($i)</span></span>
<span class="line"><span style="color:#98C379;">        if (word != &quot;&quot;) freq[word]++</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">END {</span></span>
<span class="line"><span style="color:#98C379;">    for (w in freq) {</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%6d %s\\n&quot;, freq[w], w</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> text.txt</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -50</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_12-2-日志时间线分析" tabindex="-1"><a class="header-anchor" href="#_12-2-日志时间线分析"><span>12.2 日志时间线分析</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 分析请求量随时间变化（按小时）</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">{</span></span>
<span class="line"><span style="color:#98C379;">    # 提取小时部分</span></span>
<span class="line"><span style="color:#98C379;">    match($0, /[0-9]{2}\\/[A-Za-z]{3}\\/[0-9]{4}:([0-9]{2}):/, arr)</span></span>
<span class="line"><span style="color:#98C379;">    if (RSTART &gt; 0) {</span></span>
<span class="line"><span style="color:#98C379;">        hour[arr[1]]++</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">END {</span></span>
<span class="line"><span style="color:#98C379;">    for (h = 0; h &lt; 24; h++) {</span></span>
<span class="line"><span style="color:#98C379;">        hh = sprintf(&quot;%02d&quot;, h)</span></span>
<span class="line"><span style="color:#98C379;">        bar = &quot;&quot;</span></span>
<span class="line"><span style="color:#98C379;">        count = hour[hh] + 0</span></span>
<span class="line"><span style="color:#98C379;">        scale = count / 100</span></span>
<span class="line"><span style="color:#98C379;">        for (i = 0; i &lt; scale; i++) bar = bar &quot;#&quot;</span></span>
<span class="line"><span style="color:#98C379;">        printf &quot;%s: %5d %s\\n&quot;, hh, count, bar</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> access.log</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_12-3-csv-列提取与转换" tabindex="-1"><a class="header-anchor" href="#_12-3-csv-列提取与转换"><span>12.3 CSV 列提取与转换</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 提取指定列并重新排序</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> OFS=&#39;,&#39;</span><span style="color:#98C379;"> &#39;{print $3, $1, $5}&#39;</span><span style="color:#98C379;"> data.csv</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 条件过滤并提取</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;$3 &gt; 100 {print $1, $2, $3}&#39;</span><span style="color:#98C379;"> data.csv</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加计算列</span></span>
<span class="line"><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;{</span></span>
<span class="line"><span style="color:#98C379;">    total = $3 + $4 + $5</span></span>
<span class="line"><span style="color:#98C379;">    avg = total / 3</span></span>
<span class="line"><span style="color:#98C379;">    printf &quot;%s,%s,%d,%d,%d,%d,%.1f\\n&quot;, $1, $2, $3, $4, $5, total, avg</span></span>
<span class="line"><span style="color:#98C379;">}&#39;</span><span style="color:#98C379;"> grades.csv</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2>`,106),i(p,{code:`eJxVkuFO2lAUx7/7FPejfiB9hi2DZclCFvUFulGkGbSu7aL7VoOUOkCaCKLoWMicNMuodSJRCuxlOPe2b+Ftexvtl5t7fv//OT0991REqVDhd9cQUmRZW1/n9z4jMj8ldsO/Gfu2vrFBJYTw0cgfNrE9hEEjAgi9zr59l0dg/oBRA5qnjAa6RY1wdUgsg6Fs/g3CnSm4S3xbx7oXYRj3sHO/ejj2HRcWXWYFowbeDNpnQb2N8ptcPsfltrjNLSb79T/g9FePR2AaQb9D/l4zIffh1TYrGRvipmm78zY0H4Naixnx+BeY57GQFB3a/nJJ4zRtVuFi8gLh+wM6FHw8AnPKPGIxI5RVgUVFWUFceGZEiaG9klgWKCzImejKsCTsa5QK+6IWl+66xDtMRlC78w86aXTVJ94khYILAywTn7RWi0uGeFVWNC46xXjERo0sHKgvaGZSadyjQ1s9/ENlQdrRSpz69aOqKZy6W2a9JCNCVOF2wqPCa59KidZ1QZ8jUdI49Qv9msJLhUTqTYPeBKnfVE2sCBytWgwvkfr8bqlmoiAWwkVwq6RjJ9qtHlTteBHI7Jqa0kmzk/gXnQE2z+Byhs9vmIF4P31nSBcED6znrnHLwd9/06dOoez2+yTrzgsT/1t00GtPH1tkDg==`}),c[2]||=n(`blockquote`,null,[n(`p`,null,[n(`strong`,null,`参考书目`)]),n(`ul`,null,[n(`li`,null,`《AWK程序设计语言》—— Alfred V. Aho, Brian W. Kernighan, Peter J. Weinberger`),n(`li`,null,`《sed & awk 101 Hacks》—— Ramesh Natarajan`),n(`li`,null,`《Linux命令行与Shell脚本编程大全》（第4版）—— Richard Blum, Christine Bresnahan`),n(`li`,null,[a(`GNU Awk 用户指南：`),n(`a`,{href:`https://www.gnu.org/software/gawk/manual/`,target:`_blank`,rel:`noopener noreferrer`},`https://www.gnu.org/software/gawk/manual/`)])])],-1)])}var d=s(l,[[`render`,u]]);export{c as _pageData,d as default};