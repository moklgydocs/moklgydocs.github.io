import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-BVtXrkU4.js";import{t as r}from"./app-DvxCNKUe.js";var i=JSON.parse(`{"path":"/Linux/Shell/%E5%9F%BA%E7%A1%80.html","title":"Shell语法基础","lang":"zh-CN","frontmatter":{"icon":"codicon:terminal-cmd","category":["Shell","基础"],"tag":["shell"],"order":1},"git":{"createdTime":1775200579000,"updatedTime":1776135420000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":30.18,"words":9054},"filePathRelative":"Linux/Shell/基础.md"}`),a={name:`基础.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="shell语法基础" tabindex="-1"><a class="header-anchor" href="#shell语法基础"><span>Shell语法基础</span></a></h1><h2 id="第一章-shell脚本的本质与执行机制" tabindex="-1"><a class="header-anchor" href="#第一章-shell脚本的本质与执行机制"><span>第一章 Shell脚本的本质与执行机制</span></a></h2><h3 id="理解shell脚本的基本结构" tabindex="-1"><a class="header-anchor" href="#理解shell脚本的基本结构"><span>理解Shell脚本的基本结构</span></a></h3><p>Shell脚本本质上是一个文本文件，其中包含一系列shell命令。当你执行脚本时，Shell解释器会逐行读取这些命令并执行。理解这个基本概念对于正确编写和调试脚本至关重要。</p><p>每个Shell脚本都以一行特殊的注释开始，称为&quot;Shebang&quot;或&quot;magic number&quot;。这一行指定了用来执行脚本的解释器。虽然这一行以<code>#</code>开头看起来像注释，但它具有特殊的含义。当你使用<code>./script.sh</code>方式直接执行脚本时，操作系统会读取第一行，根据其中指定的路径来选择合适的解释器。这意味着如果你通过<code>bash script.sh</code>或<code>sh script.sh</code>方式执行脚本，系统会忽略第一行，直接使用指定的解释器。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 这个Shebang行是关键</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用env命令查找bash解释器，这比直接写#!/bin/bash更具可移植性</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 因为不同系统上bash的路径可能不同（如/bin/bash或/usr/bin/bash）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第二行开始是实际的脚本代码</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;这个脚本将由bash解释执行&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注释行以#开头</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注释可以占据整行，也可以在代码后面出现</span></span>
<span class="line"><span style="color:#61AFEF;">some_command</span><span style="color:#7F848E;font-style:italic;">  # 这也是一个有效的注释</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为什么要使用<code>#!/usr/bin/env bash</code>而不是直接写<code>#!/bin/bash</code>？原因在于可移植性。在某些系统上（如macOS或某些BSD系统），bash可能安装在不同的位置。使用<code>env</code>命令会自动在系统的PATH中搜索bash，这使得脚本在不同系统上都能正常工作。这是专业脚本编写中的最佳实践。</p><h3 id="脚本执行的三种主要方式" tabindex="-1"><a class="header-anchor" href="#脚本执行的三种主要方式"><span>脚本执行的三种主要方式</span></a></h3><p>在Linux中有三种主要的方式来执行Shell脚本，理解它们之间的区别对于正确使用脚本至关重要。</p><p>第一种方式是作为可执行程序直接运行。这种方式需要脚本文件具有可执行权限，通过<code>chmod +x script.sh</code>来设置，然后使用<code>./script.sh</code>或完整路径如<code>/path/to/script.sh</code>来执行。需要注意的是，不能直接写<code>script.sh</code>而必须写<code>./script.sh</code>，因为当前目录通常不在PATH环境变量中。</p><p>第二种方式是将解释器作为命令的参数。使用<code>bash script.sh</code>、<code>sh script.sh</code>或<code>/bin/bash script.sh</code>来执行脚本。这种方式不需要脚本具有可执行权限，也不会读取脚本的第一行（Shebang行），而是直接使用指定的解释器。</p><p>第三种方式是使用<code>source</code>命令或<code>.</code>命令来执行脚本。例如<code>source script.sh</code>或<code>. script.sh</code>。这种方式会在当前shell进程中执行脚本，而不是创建新的子shell。这意味着脚本中定义的变量和函数在脚本执行完毕后仍然存在于当前shell中，这在加载配置文件或函数库时非常有用。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 演示脚本执行方式的区别</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 这些变量会在不同的执行方式下有不同的作用域</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">export_var</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;这是一个导出变量&quot;</span></span>
<span class="line"><span style="color:#E06C75;">local_var</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;这是一个本地变量&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果这个脚本被直接执行或通过bash运行，会创建子shell</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 子shell中的变量不会影响父shell</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果这个脚本被source执行，则在当前shell中运行</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 所有变量都会保留在当前shell中</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第二章-变量系统与参数扩展" tabindex="-1"><a class="header-anchor" href="#第二章-变量系统与参数扩展"><span>第二章 变量系统与参数扩展</span></a></h2><h3 id="变量的定义与使用基础" tabindex="-1"><a class="header-anchor" href="#变量的定义与使用基础"><span>变量的定义与使用基础</span></a></h3><p>在Shell中定义变量的语法非常简单，但却容易出错。变量定义的基本格式是<code>variable_name=value</code>，其中等号两边都不能有空格。这一点初学者经常犯错，导致脚本无法正常执行。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ✅ 正确的变量定义</span></span>
<span class="line"><span style="color:#E06C75;">name</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;张三&quot;</span></span>
<span class="line"><span style="color:#E06C75;">age</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">28</span></span>
<span class="line"><span style="color:#E06C75;">path</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/home/user/documents&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ❌ 错误的定义方式（会导致命令未找到的错误）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># name = &quot;张三&quot;      # 等号两边有空格</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># age= 28            # 等号后面有空格</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># path =             # 等号前面有空格</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 访问变量的值使用$前缀</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;我的名字是 </span><span style="color:#E06C75;">$name</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;我的年龄是 </span><span style="color:#E06C75;">$age</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 推荐做法：使用\${}来明确变量的作用范围</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;我的名字是 \${</span><span style="color:#E06C75;">name</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 这在变量名后紧跟其他字符时特别重要</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果没有{}，Shell可能会混淆变量名的边界</span></span>
<span class="line"><span style="color:#E06C75;">filename</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;report&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 这会尝试访问变量$filename_txt（不存在）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># echo &quot;生成的文件: $filename_txt&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用{}可以正确访问</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;生成的文件: \${</span><span style="color:#E06C75;">filename</span><span style="color:#98C379;">}_txt&quot;</span><span style="color:#7F848E;font-style:italic;">  # 输出: 生成的文件: report_txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Shell中有三类变量：自定义变量（仅在当前shell中有效）、环境变量（可以传递给子进程）和Shell变量（由Shell程序自身设置的特殊变量）。自定义变量只在定义它们的shell进程中有效，不会自动传递给子进程。如果需要让子进程也能访问这个变量，必须使用<code>export</code>命令将其声明为环境变量。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 定义一个自定义变量</span></span>
<span class="line"><span style="color:#E06C75;">my_variable</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;仅在当前shell中有效&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 定义并导出一个环境变量</span></span>
<span class="line"><span style="color:#C678DD;">export</span><span style="color:#E06C75;"> MY_ENV_VAR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;可以传递给子进程&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果先定义后导出</span></span>
<span class="line"><span style="color:#E06C75;">config_value</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;配置值&quot;</span></span>
<span class="line"><span style="color:#C678DD;">export</span><span style="color:#E06C75;"> config_value</span><span style="color:#7F848E;font-style:italic;">  # 现在它可以被子进程访问</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用env命令查看所有环境变量</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># env | grep MY_ENV_VAR</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 常用的环境变量</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;用户主目录: </span><span style="color:#E06C75;">$HOME</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;当前用户: </span><span style="color:#E06C75;">$USER</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;当前工作目录: </span><span style="color:#E06C75;">$PWD</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Shell类型: </span><span style="color:#E06C75;">$SHELL</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;PATH: </span><span style="color:#E06C75;">$PATH</span><span style="color:#98C379;">&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="特殊参数变量与命令行参数处理" tabindex="-1"><a class="header-anchor" href="#特殊参数变量与命令行参数处理"><span>特殊参数变量与命令行参数处理</span></a></h3><p>Shell提供了多个特殊的参数变量来处理脚本的输入和执行状态。这些变量在编写灵活的脚本时至关重要。</p><p><code>$0</code>代表脚本本身的名称或被调用的命令名。在直接执行时是完整路径或相对路径，使用<code>bash script.sh</code>执行时只是脚本名。<code>$1</code>、<code>$2</code>等代表传递给脚本的第一个、第二个参数，这些被称为位置参数。<code>$#</code>代表传递给脚本的参数总数。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 演示特殊参数变量</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;脚本名: </span><span style="color:#E06C75;font-style:italic;">$0</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;参数个数: </span><span style="color:#E5C07B;">$#</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;第一个参数: </span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;第二个参数: </span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 当参数超过9个时，必须使用大括号</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;第十个参数: </span><span style="color:#E06C75;font-style:italic;">\${10}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;第十一个参数: </span><span style="color:#E06C75;font-style:italic;">\${11}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># $@和$*都代表所有参数，但在引用时有重要区别</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;所有参数（</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">）: </span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;所有参数（</span><span style="color:#E5C07B;">$*</span><span style="color:#98C379;">）: </span><span style="color:#E5C07B;">$*</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 这两者在被双引号包围时有不同的行为</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># &quot;$@&quot;会将每个参数作为单独的字符串</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># &quot;$*&quot;会将所有参数作为一个单一字符串</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通过这个生产级案例来理解区别：</span></span>
<span class="line"><span style="color:#61AFEF;">process_arguments</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;使用 </span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;"> 进行遍历：&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    for</span><span style="color:#E06C75;"> arg</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span><span style="color:#7F848E;font-style:italic;">  # 每个参数是独立的</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  处理参数: </span><span style="color:#E06C75;">$arg</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;使用 </span><span style="color:#E5C07B;">$*</span><span style="color:#98C379;"> 进行遍历：&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    for</span><span style="color:#E06C75;"> arg</span><span style="color:#C678DD;"> in</span><span style="color:#E5C07B;"> $*</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span><span style="color:#7F848E;font-style:italic;">    # 所有参数作为一个字符串</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  处理参数: </span><span style="color:#E06C75;">$arg</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果执行: ./script.sh &quot;第一个&quot; &quot;第二个&quot; &quot;第三个&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用&quot;$@&quot;会输出三行（分别是&quot;第一个&quot;、&quot;第二个&quot;、&quot;第三个&quot;）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用$*会输出三行（如果参数中有空格，会被分解）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>$$</code>代表当前shell进程的进程ID（PID），这在需要创建唯一临时文件或标识进程时很有用。<code>$?</code>代表上一个命令的退出状态码，0表示成功，非0表示失败。这是编写错误处理逻辑的关键。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用$创建唯一的临时文件</span></span>
<span class="line"><span style="color:#E06C75;">temp_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/tmp/backup_$.tmp&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 执行一个命令并检查其返回状态</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> grep</span><span style="color:#98C379;"> &quot;error&quot;</span><span style="color:#98C379;"> /var/log/syslog</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;找到错误&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;命令退出状态: </span><span style="color:#E5C07B;">$?</span><span style="color:#98C379;">&quot;</span><span style="color:#7F848E;font-style:italic;">  # 这会显示1（grep没有找到）</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 完整的参数处理示例</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;脚本被调用为: </span><span style="color:#E06C75;font-style:italic;">$0</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;当前进程ID: $&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;参数个数: </span><span style="color:#E5C07B;">$#</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 列出所有参数</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#E5C07B;">$#</span><span style="color:#56B6C2;"> -gt</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;接收到的参数:&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    for</span><span style="color:#ABB2BF;"> ((</span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;">&lt;=\\$</span><span style="color:#ABB2BF;">#; </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">)); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 使用间接引用访问参数</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  参数 </span><span style="color:#E06C75;">$i</span><span style="color:#98C379;">: \${</span><span style="color:#ABB2BF;">!</span><span style="color:#E06C75;">i</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="参数扩展的高级用法" tabindex="-1"><a class="header-anchor" href="#参数扩展的高级用法"><span>参数扩展的高级用法</span></a></h3><p>参数扩展是Shell语言中最强大的特性之一，允许对变量值进行复杂的操作，而无需调用外部命令。这可以显著提高脚本的执行效率。</p><p>最基本的参数扩展是提供默认值。<code>\${variable:-default}</code>的意思是如果变量未定义或为空，使用提供的默认值。<code>\${variable:=default}</code>类似，但会同时设置变量的值。这两种方式都很常见，但它们的区别很重要。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 演示参数扩展的各种用法</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 提供默认值</span></span>
<span class="line"><span style="color:#E06C75;">port</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">PORT</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;">8080</span><span style="color:#98C379;">}&quot;</span><span style="color:#7F848E;font-style:italic;">              # 如果PORT未定义，使用8080</span></span>
<span class="line"><span style="color:#E06C75;">timeout</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">TIMEOUT</span><span style="color:#ABB2BF;">:=</span><span style="color:#E06C75;">30</span><span style="color:#98C379;">}&quot;</span><span style="color:#7F848E;font-style:italic;">           # 同时设置TIMEOUT变量为30</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;端口: </span><span style="color:#E06C75;">$port</span><span style="color:#98C379;">, 超时时间: </span><span style="color:#E06C75;">$timeout</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 检查变量是否存在</span></span>
<span class="line"><span style="color:#E06C75;">required_var</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REQUIRED</span><span style="color:#ABB2BF;">:?</span><span style="color:#98C379;">错误：REQUIRED变量必须被定义}&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果REQUIRED未定义，脚本会输出错误消息并退出</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 只在变量存在且非空时使用值</span></span>
<span class="line"><span style="color:#E06C75;">result</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">OPTIONAL</span><span style="color:#ABB2BF;">:</span><span style="color:#98C379;">+存在的值}&quot;</span><span style="color:#7F848E;font-style:italic;">     # 如果OPTIONAL存在且非空，使用&quot;存在的值&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 获取变量长度</span></span>
<span class="line"><span style="color:#E06C75;">string</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;Hello World&quot;</span></span>
<span class="line"><span style="color:#E06C75;">length</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#ABB2BF;">#</span><span style="color:#E06C75;">string</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;字符串长度: </span><span style="color:#E06C75;">$length</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 字符串截取</span></span>
<span class="line"><span style="color:#E06C75;">filename</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;archive_20240115_backup.tar.gz&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;完整文件名: </span><span style="color:#E06C75;">$filename</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;文件名长度: \${</span><span style="color:#ABB2BF;">#</span><span style="color:#E06C75;">filename</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;前5个字符: \${</span><span style="color:#E06C75;">filename</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;">0</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;">5</span><span style="color:#98C379;">}&quot;</span><span style="color:#7F848E;font-style:italic;">      # 从位置0开始，取5个字符</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;从位置12开始: \${</span><span style="color:#E06C75;">filename</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;">12</span><span style="color:#98C379;">}&quot;</span><span style="color:#7F848E;font-style:italic;">    # 从位置12到末尾</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;倒数5个字符: \${</span><span style="color:#E06C75;">filename</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;"> -5</span><span style="color:#98C379;">}&quot;</span><span style="color:#7F848E;font-style:italic;">    # 注意这里有空格！</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 删除字符串的前缀或后缀</span></span>
<span class="line"><span style="color:#E06C75;">path</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/home/user/documents/file.txt&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除最短匹配的前缀</span></span>
<span class="line"><span style="color:#E06C75;">directory</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">%/*</span><span style="color:#98C379;">}&quot;</span><span style="color:#7F848E;font-style:italic;">              # 输出: /home/user/documents</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除最长匹配的前缀</span></span>
<span class="line"><span style="color:#E06C75;">just_filename</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">##*/</span><span style="color:#98C379;">}&quot;</span><span style="color:#7F848E;font-style:italic;">         # 输出: file.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 7. 删除文件扩展名和其他后缀</span></span>
<span class="line"><span style="color:#E06C75;">name_without_ext</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">filename</span><span style="color:#ABB2BF;">%</span><span style="color:#98C379;">.</span><span style="color:#ABB2BF;">*</span><span style="color:#98C379;">}&quot;</span><span style="color:#7F848E;font-style:italic;">   # 删除最短匹配的后缀（.gz）</span></span>
<span class="line"><span style="color:#E06C75;">name_with_date</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">name_without_ext</span><span style="color:#ABB2BF;">%</span><span style="color:#E06C75;">_</span><span style="color:#ABB2BF;">*</span><span style="color:#98C379;">}&quot;</span><span style="color:#7F848E;font-style:italic;">  # 删除_及之后的内容</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 8. 字符串替换</span></span>
<span class="line"><span style="color:#E06C75;">text</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;数据库主机是localhost，应用主机也是localhost&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 替换第一个匹配</span></span>
<span class="line"><span style="color:#E06C75;">replaced_once</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">text</span><span style="color:#ABB2BF;">/</span><span style="color:#E06C75;">localhost</span><span style="color:#ABB2BF;">/</span><span style="color:#E06C75;">192</span><span style="color:#98C379;">.</span><span style="color:#E06C75;">168</span><span style="color:#98C379;">.</span><span style="color:#E06C75;">1</span><span style="color:#98C379;">.</span><span style="color:#E06C75;">1</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 替换所有匹配</span></span>
<span class="line"><span style="color:#E06C75;">replaced_all</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">text</span><span style="color:#ABB2BF;">//</span><span style="color:#E06C75;">localhost</span><span style="color:#ABB2BF;">/</span><span style="color:#E06C75;">192</span><span style="color:#98C379;">.</span><span style="color:#E06C75;">168</span><span style="color:#98C379;">.</span><span style="color:#E06C75;">1</span><span style="color:#98C379;">.</span><span style="color:#E06C75;">1</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;原文本: </span><span style="color:#E06C75;">$text</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;替换一次: </span><span style="color:#E06C75;">$replaced_once</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;替换全部: </span><span style="color:#E06C75;">$replaced_all</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 9. 生产级应用：配置文件路径处理</span></span>
<span class="line"><span style="color:#E06C75;">config_path</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">CONFIG_DIR</span><span style="color:#ABB2BF;">:-</span><span style="color:#98C379;">.}/app.conf&quot;</span><span style="color:#7F848E;font-style:italic;">  # 默认使用当前目录</span></span>
<span class="line"><span style="color:#E06C75;">log_dir</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">LOG_DIR</span><span style="color:#ABB2BF;">:-</span><span style="color:#98C379;">.}/logs&quot;</span></span>
<span class="line"><span style="color:#E06C75;">pid_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">PID_DIR</span><span style="color:#ABB2BF;">:-</span><span style="color:#98C379;">.}/\${</span><span style="color:#E06C75;">app_name</span><span style="color:#98C379;">}.pid&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;配置路径: </span><span style="color:#E06C75;">$config_path</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;日志目录: </span><span style="color:#E06C75;">$log_dir</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;PID文件: </span><span style="color:#E06C75;">$pid_file</span><span style="color:#98C379;">&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>参数扩展中最容易出错的地方是在使用负数索引时。<code>\${string: -5}</code>表示从末尾向前数5个字符，但必须注意冒号和负号之间有一个空格。如果写成<code>\${string:-5}</code>则会被解释为&quot;如果变量未定义则使用-5&quot;。</p><h2 id="第三章-条件判断与测试表达式" tabindex="-1"><a class="header-anchor" href="#第三章-条件判断与测试表达式"><span>第三章 条件判断与测试表达式</span></a></h2><h3 id="测试命令的三种语法形式" tabindex="-1"><a class="header-anchor" href="#测试命令的三种语法形式"><span>测试命令的三种语法形式</span></a></h3><p>Shell提供了三种测试条件的方式：<code>test</code>命令、方括号<code>[ ]</code>和双方括号<code>[[ ]]</code>。理解它们之间的区别和各自的适用场景至关重要。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 三种条件测试语法</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式1: test命令</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#56B6C2;"> test</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> /etc/hostname</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;hostname文件存在&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式2: 单方括号[ ]（POSIX兼容）</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#56B6C2;">-f</span><span style="color:#ABB2BF;"> /etc/hostname ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;hostname文件存在&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式3: 双方括号[[ ]]（仅Bash）</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#ABB2BF;"> /etc/hostname ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;hostname文件存在&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 关键区别演示</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用单方括号时容易出错</span></span>
<span class="line"><span style="color:#E06C75;">filename</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;my file.txt&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ❌ 错误：不加引号会导致word splitting</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># [ -f $filename ]  # 会被分解为两个文件</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ✅ 正确：必须加引号</span></span>
<span class="line"><span style="color:#ABB2BF;">[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$filename</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用双方括号则更安全</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ✅ 双方括号中可以不加引号（但为了代码一致性仍推荐加上）</span></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">-f</span><span style="color:#E06C75;"> $filename</span><span style="color:#ABB2BF;"> ]]</span></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$filename</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]  </span><span style="color:#7F848E;font-style:italic;"># 两种都可以</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 双方括号支持正则表达式</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#E06C75;">$filename</span><span style="color:#56B6C2;"> =~</span><span style="color:#56B6C2;"> \\.</span><span style="color:#ABB2BF;">txt$ ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;这是一个文本文件&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 双方括号支持通配符</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#E06C75;">$filename</span><span style="color:#56B6C2;"> ==</span><span style="color:#ABB2BF;"> *.txt ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;这是一个文本文件&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>双方括号<code>[[ ]]</code>是现代Bash编程中的首选，因为它更安全、功能更强大。它支持正则表达式匹配、通配符、逻辑操作符<code>&amp;&amp;</code>和<code>||</code>，且内部的变量引用不需要加引号。相比之下，单方括号<code>[ ]</code>会进行word splitting和filename expansion，这会导致许多隐藏的bug。</p><h3 id="文件测试运算符" tabindex="-1"><a class="header-anchor" href="#文件测试运算符"><span>文件测试运算符</span></a></h3><p>Shell提供了多个文件测试运算符来检查文件的属性。这些测试在脚本中非常常用，特别是在处理文件和目录时。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 文件测试运算符详解</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">test_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/passwd&quot;</span></span>
<span class="line"><span style="color:#E06C75;">test_dir</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/home&quot;</span></span>
<span class="line"><span style="color:#E06C75;">test_link</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/bin/sh&quot;</span><span style="color:#7F848E;font-style:italic;">  # 通常是一个符号链接</span></span>
<span class="line"><span style="color:#E06C75;">non_existent</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/path/that/does/not/exist&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基本存在性测试</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 文件存在性测试 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">-e</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_file</span><span style="color:#98C379;"> 存在&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -e</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$non_existent</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$non_existent</span><span style="color:#98C379;"> 不存在&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 文件类型测试</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 文件类型测试 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_file</span><span style="color:#98C379;"> 是普通文件&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">-d</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_dir</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_dir</span><span style="color:#98C379;"> 是目录&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">-L</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_link</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_link</span><span style="color:#98C379;"> 是符号链接&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 权限测试</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 权限测试 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">-r</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_file</span><span style="color:#98C379;"> 可读&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">-w</span><span style="color:#98C379;"> &quot;/tmp&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;/tmp 可写&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">-x</span><span style="color:#98C379;"> &quot;/bin/bash&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;/bin/bash 可执行&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 文件大小测试</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 文件大小测试 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">-s</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_file</span><span style="color:#98C379;"> 文件非空&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -s</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_file</span><span style="color:#98C379;"> 文件为空&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取文件大小的方法（虽然不是直接的文件测试）</span></span>
<span class="line"><span style="color:#E06C75;">file_size</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#56B6C2;">stat</span><span style="color:#D19A66;"> -f%z</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">stat</span><span style="color:#D19A66;"> -c%s</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$test_file</span><span style="color:#98C379;"> 的大小: </span><span style="color:#E06C75;">$file_size</span><span style="color:#98C379;"> 字节&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 文件的修改时间比较</span></span>
<span class="line"><span style="color:#E06C75;">file1</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/passwd&quot;</span></span>
<span class="line"><span style="color:#E06C75;">file2</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/shadow&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$file1</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> -nt</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$file2</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$file1</span><span style="color:#98C379;"> 比 </span><span style="color:#E06C75;">$file2</span><span style="color:#98C379;"> 更新&quot;</span></span>
<span class="line"><span style="color:#C678DD;">elif</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$file1</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> -ot</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$file2</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$file1</span><span style="color:#98C379;"> 比 </span><span style="color:#E06C75;">$file2</span><span style="color:#98C379;"> 更旧&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$file1</span><span style="color:#98C379;"> 和 </span><span style="color:#E06C75;">$file2</span><span style="color:#98C379;"> 修改时间相同&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 实用的文件检查函数</span></span>
<span class="line"><span style="color:#61AFEF;">check_file_readiness</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -e</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: 文件不存在: </span><span style="color:#E06C75;">$file</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -f</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: </span><span style="color:#E06C75;">$file</span><span style="color:#98C379;"> 不是普通文件&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -r</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: </span><span style="color:#E06C75;">$file</span><span style="color:#98C379;"> 不可读&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -s</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;警告: </span><span style="color:#E06C75;">$file</span><span style="color:#98C379;"> 文件为空&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;成功: </span><span style="color:#E06C75;">$file</span><span style="color:#98C379;"> 是一个有效的可读文件&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 测试函数</span></span>
<span class="line"><span style="color:#61AFEF;">check_file_readiness</span><span style="color:#98C379;"> &quot;/etc/passwd&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="字符串和数值比较" tabindex="-1"><a class="header-anchor" href="#字符串和数值比较"><span>字符串和数值比较</span></a></h3><p>字符串和数值的比较在条件判断中非常常见，但初学者经常混淆两者的用法。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 数值比较和字符串比较的区别</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">num1</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">10</span></span>
<span class="line"><span style="color:#E06C75;">num2</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">20</span></span>
<span class="line"><span style="color:#E06C75;">str1</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;10&quot;</span></span>
<span class="line"><span style="color:#E06C75;">str2</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;20&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 数值比较 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用(( ))进行数值比较（推荐）</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">num1</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> num2</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$num1</span><span style="color:#98C379;"> 小于 </span><span style="color:#E06C75;">$num2</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或者使用[ ]和-lt（less than）等运算符</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$num1</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> -lt</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$num2</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$num1</span><span style="color:#98C379;"> 小于 </span><span style="color:#E06C75;">$num2</span><span style="color:#98C379;"> (使用-lt)&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 常用的数值比较运算符</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -eq: 等于</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -ne: 不等于</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -lt: 小于</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -le: 小于或等于</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -gt: 大于</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -ge: 大于或等于</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 字符串比较 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 字符串相等</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$str1</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$str2</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;字符串相等&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：在[ ]中使用=，在[[ ]]中使用==</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$str1</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$str2</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;字符串相等（使用-比较）&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 字符串不相等</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$str1</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> !=</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$str2</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;字符串不相等&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 字符串大小比较（基于字典序）</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#98C379;">&quot;apple&quot;</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#98C379;"> &quot;banana&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&#39;apple&#39; 在 &#39;banana&#39; 之前&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#98C379;">&quot;zebra&quot;</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#98C379;"> &quot;apple&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&#39;zebra&#39; 在 &#39;apple&#39; 之后&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 字符串长度测试 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 测试字符串是否为空</span></span>
<span class="line"><span style="color:#E06C75;">empty_string</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;&quot;</span></span>
<span class="line"><span style="color:#E06C75;">non_empty</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;hello&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$empty_string</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;empty_string 是空字符串&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">-n</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$non_empty</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;non_empty 不是空字符串&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">[[ </span><span style="color:#56B6C2;">-n</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$empty_string</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]] || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;empty_string 是空字符串（使用||）&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 关键避坑点 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ❌ 错误：将字符串当作数值比较</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># if [ &quot;10&quot; &gt; &quot;20&quot; ]; then  # 这会进行字符串比较，&quot;1&quot;&gt;&quot;2&quot;是false</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     echo &quot;这不会执行&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ✅ 正确：使用(( ))进行数值比较</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#D19A66;">10</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 20</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;这不会执行&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ❌ 错误：不加引号的变量可能导致word splitting</span></span>
<span class="line"><span style="color:#E06C75;">var</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;hello world&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># if [ $var = &quot;hello world&quot; ]; then  # 会分解为多个参数导致错误</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     echo &quot;这会报错&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ✅ 正确：加上引号</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$var</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;hello world&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;字符串匹配成功&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="复杂的逻辑条件" tabindex="-1"><a class="header-anchor" href="#复杂的逻辑条件"><span>复杂的逻辑条件</span></a></h3><p>在实际的脚本中，往往需要组合多个条件进行判断。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 复杂的逻辑条件</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">port</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">8080</span></span>
<span class="line"><span style="color:#E06C75;">service_name</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;web&quot;</span></span>
<span class="line"><span style="color:#E06C75;">config_dir</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/app&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 逻辑与（&amp;&amp;）===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 两个条件都必须为真</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">port</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 1024</span><span style="color:#ABB2BF;"> )) &amp;&amp; (( </span><span style="color:#E06C75;">port</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#D19A66;"> 65536</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;端口号有效&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 也可以使用-a（在[ ]中）或&amp;&amp;（在[[ ]]中）</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-d</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$config_dir</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; [[ </span><span style="color:#56B6C2;">-r</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$config_dir</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;配置目录存在且可读&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 逻辑或（||）===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 至少有一个条件为真</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$service_name</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;web&quot;</span><span style="color:#ABB2BF;"> ]] || [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$service_name</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;app&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;服务名称有效&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 逻辑非（!）===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -f</span><span style="color:#98C379;"> &quot;/var/run/app.pid&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;PID文件不存在，应用未运行&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 复杂组合 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">username</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;admin&quot;</span></span>
<span class="line"><span style="color:#E06C75;">password_length</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">8</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查用户名是否为admin，且密码长度满足要求</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$username</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;admin&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; (( \${#</span><span style="color:#E06C75;">password_length</span><span style="color:#ABB2BF;">} </span><span style="color:#56B6C2;">&gt;=</span><span style="color:#D19A66;"> 8</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;用户验证通过&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查是否为管理员用户或系统用户</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$username</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;root&quot;</span><span style="color:#ABB2BF;"> ]] || [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$username</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;admin&quot;</span><span style="color:#ABB2BF;"> ]] || [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$username</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;system&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;这是一个特权用户&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 实用的组合条件示例</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 实用的系统检查函数 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">check_system_ready</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> error_count</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查关键服务是否运行</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#61AFEF;">systemctl</span><span style="color:#98C379;"> is-active</span><span style="color:#98C379;"> sshd</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: SSH服务未运行&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">error_count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查磁盘空间（示例）</span></span>
<span class="line"><span style="color:#E06C75;">    available_space</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">df</span><span style="color:#98C379;"> /</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NR==2 {print $4}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">available_space</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#D19A66;"> 1000000</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span><span style="color:#7F848E;font-style:italic;">  # 少于1GB</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;警告: 剩余磁盘空间不足&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">error_count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查必要的文件和权限</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -f</span><span style="color:#98C379;"> &quot;/etc/app/config.conf&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: 配置文件不存在&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">error_count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    elif</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -r</span><span style="color:#98C379;"> &quot;/etc/app/config.conf&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: 配置文件不可读&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">error_count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查用户权限</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#E06C75;">$EUID</span><span style="color:#56B6C2;"> -ne</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;提示: 此脚本需要以root身份运行&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">error_count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 总结检查结果</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">error_count</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;系统检查通过：所有条件满足&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;系统检查失败：发现 </span><span style="color:#E06C75;">$error_count</span><span style="color:#98C379;"> 个问题&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 调用检查函数（注意这里是示例，实际运行可能需要特定环境）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># check_system_ready</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第四章-循环结构的深度掌握" tabindex="-1"><a class="header-anchor" href="#第四章-循环结构的深度掌握"><span>第四章 循环结构的深度掌握</span></a></h2><h3 id="for循环的多种用法" tabindex="-1"><a class="header-anchor" href="#for循环的多种用法"><span>for循环的多种用法</span></a></h3><p><code>for</code>循环是Shell中最灵活的循环结构，支持多种不同的语法形式。理解这些不同的形式对于编写高效的脚本至关重要。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 循环遍历列表 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基本的for循环：遍历一个词列表</span></span>
<span class="line"><span style="color:#E06C75;">fruits</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;apple&quot;</span><span style="color:#98C379;"> &quot;banana&quot;</span><span style="color:#98C379;"> &quot;orange&quot;</span><span style="color:#98C379;"> &quot;grape&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> fruit</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">fruits</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;我喜欢: </span><span style="color:#E06C75;">$fruit</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 循环遍历数字范围 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用大括号序列扩展生成数字序列</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> i</span><span style="color:#C678DD;"> in</span><span style="color:#ABB2BF;"> {</span><span style="color:#61AFEF;">1..5}</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;计数: </span><span style="color:#E06C75;">$i</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 带步长的序列（仅在Bash 4+）</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> i</span><span style="color:#C678DD;"> in</span><span style="color:#ABB2BF;"> {</span><span style="color:#61AFEF;">1..10..2}</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;奇数: </span><span style="color:#E06C75;">$i</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 循环遍历带前缀的序列 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成带前缀的序列</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> day</span><span style="color:#C678DD;"> in</span><span style="color:#ABB2BF;"> {</span><span style="color:#61AFEF;">Mon..Fri}</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;工作日: </span><span style="color:#E06C75;">$day</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 使用seq命令 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># seq命令生成数字序列（当大括号扩展不可用时）</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> i</span><span style="color:#C678DD;"> in</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">seq</span><span style="color:#D19A66;"> 1</span><span style="color:#D19A66;"> 5</span><span style="color:#ABB2BF;">); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;使用seq: </span><span style="color:#E06C75;">$i</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># seq的高级用法：指定分隔符和步长</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> i</span><span style="color:#C678DD;"> in</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">seq</span><span style="color:#D19A66;"> 0</span><span style="color:#D19A66;"> 5</span><span style="color:#D19A66;"> 20</span><span style="color:#ABB2BF;">); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;步长为5的序列: </span><span style="color:#E06C75;">$i</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== C风格的for循环 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># C风格的for循环语法</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#ABB2BF;"> ((</span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#D19A66;"> 5</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">)); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;C风格循环: </span><span style="color:#E06C75;">$i</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 复杂的C风格循环</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#ABB2BF;"> ((</span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 10</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;">--</span><span style="color:#ABB2BF;">)); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;倒计时: </span><span style="color:#E06C75;">$i</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 多个变量的C风格循环</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#ABB2BF;"> ((</span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 1</span><span style="color:#56B6C2;">,</span><span style="color:#E06C75;"> j</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 10</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;"> &lt;=</span><span style="color:#D19A66;"> 5</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;">++,</span><span style="color:#E06C75;"> j</span><span style="color:#56B6C2;">--</span><span style="color:#ABB2BF;">)); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;i=</span><span style="color:#E06C75;">$i</span><span style="color:#98C379;">, j=</span><span style="color:#E06C75;">$j</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 循环遍历文件 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 为了避免subshell问题，使用process substitution</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 而不是 ls | while read，这样变量修改不会丢失</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;文本文件:&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：这里使用了process substitution &lt; &lt;(...)</span></span>
<span class="line"><span style="color:#C678DD;">while</span><span style="color:#E06C75;"> IFS</span><span style="color:#56B6C2;">=</span><span style="color:#56B6C2;"> read</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> line</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$line</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  - </span><span style="color:#E06C75;">$line</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#C678DD;">done</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#98C379;">&lt;(</span><span style="color:#61AFEF;">find</span><span style="color:#98C379;"> . </span><span style="color:#D19A66;">-maxdepth</span><span style="color:#D19A66;"> 1</span><span style="color:#D19A66;"> -name</span><span style="color:#98C379;"> &quot;*.txt&quot; </span><span style="color:#D19A66;">-type</span><span style="color:#98C379;"> f)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== break和continue ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> i</span><span style="color:#C678DD;"> in</span><span style="color:#ABB2BF;"> {</span><span style="color:#61AFEF;">1..10}</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 3</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;跳过3&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        continue</span><span style="color:#7F848E;font-style:italic;">  # 跳过当前迭代</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 7</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;在7处中断&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        break</span><span style="color:#7F848E;font-style:italic;">     # 完全退出循环</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;处理: </span><span style="color:#E06C75;">$i</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 嵌套循环 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> i</span><span style="color:#C678DD;"> in</span><span style="color:#ABB2BF;"> {</span><span style="color:#61AFEF;">1..3}</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">    for</span><span style="color:#E06C75;"> j</span><span style="color:#C678DD;"> in</span><span style="color:#ABB2BF;"> {</span><span style="color:#61AFEF;">1..3}</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;[</span><span style="color:#E06C75;">$i</span><span style="color:#98C379;">, </span><span style="color:#E06C75;">$j</span><span style="color:#98C379;">]&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 生产级案例：批量处理日志文件 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">process_log_files</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> log_dir</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${1</span><span style="color:#ABB2BF;">:-</span><span style="color:#98C379;">.</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> file_count</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> error_count</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 使用for循环遍历所有日志文件</span></span>
<span class="line"><span style="color:#C678DD;">    for</span><span style="color:#E06C75;"> log_file</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$log_dir</span><span style="color:#98C379;">&quot;/*.log</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 检查是否真的存在文件（防止*.log未匹配时）</span></span>
<span class="line"><span style="color:#ABB2BF;">        [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$log_file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]] || </span><span style="color:#C678DD;">continue</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">file_count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;处理: </span><span style="color:#E06C75;">$log_file</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 检查文件是否可读</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -r</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$log_file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;  警告: 文件不可读&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            continue</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 计算文件中的错误行数</span></span>
<span class="line"><span style="color:#E06C75;">        error_lines</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$log_file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;0&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">error_lines</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;  发现 </span><span style="color:#E06C75;">$error_lines</span><span style="color:#98C379;"> 行错误&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            ((</span><span style="color:#E06C75;">error_count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;处理完成: 共处理 </span><span style="color:#E06C75;">$file_count</span><span style="color:#98C379;"> 个文件，</span><span style="color:#E06C75;">$error_count</span><span style="color:#98C379;"> 个文件包含错误&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># process_log_files &quot;/var/log&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="while和until循环" tabindex="-1"><a class="header-anchor" href="#while和until循环"><span>while和until循环</span></a></h3><p><code>while</code>和<code>until</code>循环基于条件判断来控制执行，适合在事先不知道循环次数的场景。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== while循环基础 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基本的while循环</span></span>
<span class="line"><span style="color:#E06C75;">counter</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1</span></span>
<span class="line"><span style="color:#C678DD;">while</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">counter</span><span style="color:#56B6C2;"> &lt;=</span><span style="color:#D19A66;"> 5</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;while循环计数: </span><span style="color:#E06C75;">$counter</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ((</span><span style="color:#E06C75;">counter</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== until循环基础 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># until循环（与while相反，条件为真时停止）</span></span>
<span class="line"><span style="color:#E06C75;">counter</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1</span></span>
<span class="line"><span style="color:#C678DD;">until</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">counter</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 5</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;until循环计数: </span><span style="color:#E06C75;">$counter</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ((</span><span style="color:#E06C75;">counter</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 读取文件的while循环 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 最常用的模式：逐行读取文件</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;reading lines...&quot;</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/tmp/sample.txt</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;processing data...&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">/tmp/sample.txt</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;complete.&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">/tmp/sample.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">while</span><span style="color:#E06C75;"> IFS</span><span style="color:#56B6C2;">=</span><span style="color:#56B6C2;"> read</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> line</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;读取的行: </span><span style="color:#E06C75;">$line</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span><span style="color:#ABB2BF;"> &lt; /tmp/sample.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 读取命令输出的while循环 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 读取命令输出（使用process substitution避免subshell）</span></span>
<span class="line"><span style="color:#C678DD;">while</span><span style="color:#E06C75;"> IFS</span><span style="color:#56B6C2;">=</span><span style="color:#56B6C2;"> read</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> line</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( \${#</span><span style="color:#E06C75;">line</span><span style="color:#ABB2BF;">} </span><span style="color:#56B6C2;">&gt;</span><span style="color:#D19A66;"> 20</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;长行: \${</span><span style="color:#E06C75;">line</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;">0</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;">20</span><span style="color:#98C379;">}...&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;行: </span><span style="color:#E06C75;">$line</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#C678DD;">done</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#98C379;">&lt;(</span><span style="color:#61AFEF;">ls</span><span style="color:#D19A66;"> -la</span><span style="color:#98C379;"> /)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 交互式输入的while循环 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;输入&#39;quit&#39;退出（演示用，注释调用）：&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 下面的代码被注释了，因为会阻止脚本执行</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># while true; do</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     read -p &quot;输入命令: &quot; command</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     [[ &quot;$command&quot; == &quot;quit&quot; ]] &amp;&amp; break</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     echo &quot;你输入的是: $command&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 有条件的while循环与break/continue ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">counter</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"><span style="color:#C678DD;">while</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">counter</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#D19A66;"> 20</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#ABB2BF;">    ((</span><span style="color:#E06C75;">counter</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 跳过偶数</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">counter</span><span style="color:#56B6C2;"> %</span><span style="color:#D19A66;"> 2</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        continue</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 在10处停止</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">counter</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 10</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        break</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;奇数: </span><span style="color:#E06C75;">$counter</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 生产级案例：重试机制 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">retry_with_exponential_backoff</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> command</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> max_retries</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${2</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;font-style:italic;">5}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> initial_delay</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${3</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;font-style:italic;">1}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> retry_count</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> delay</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;">$initial_delay</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    while</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">retry_count</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> max_retries</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;[$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)] 尝试执行命令（第$((</span><span style="color:#61AFEF;">retry_count+1</span><span style="color:#98C379;">))/</span><span style="color:#E06C75;">$max_retries次</span><span style="color:#98C379;">）&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 执行命令</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#56B6C2;"> eval</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$command</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;命令执行成功&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 检查是否还有重试次数</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">retry_count</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> max_retries</span><span style="color:#56B6C2;"> -</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;命令失败，\${</span><span style="color:#E06C75;">delay</span><span style="color:#98C379;">}秒后重试...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            sleep</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$delay</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 指数退避：延迟时间呈指数增长</span></span>
<span class="line"><span style="color:#E06C75;">            delay</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$((</span><span style="color:#61AFEF;">delay</span><span style="color:#E5C07B;"> *</span><span style="color:#D19A66;"> 2</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">delay</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 60</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">                delay</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">60</span><span style="color:#7F848E;font-style:italic;">  # 限制最大延迟</span></span>
<span class="line"><span style="color:#C678DD;">            fi</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">retry_count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;达到最大重试次数，命令执行失败&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 示例：尝试连接到服务</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># retry_with_exponential_backoff &quot;curl -m 5 http://localhost:8080/health&quot; 5 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 生产级案例：守护循环（daemon loop）===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">daemon_loop_example</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> check_interval</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> max_failures</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> failure_count</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    while</span><span style="color:#56B6C2;"> true</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 执行某项健康检查</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#61AFEF;"> check_service_health</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">            failure_count</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;[健康检查通过] $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%H:%M:%S&#39;)&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#ABB2BF;">            ((</span><span style="color:#E06C75;">failure_count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;[健康检查失败 #</span><span style="color:#E06C75;">$failure_count</span><span style="color:#98C379;">] $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%H:%M:%S&#39;)&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 超过失败次数限制则采取行动</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">failure_count</span><span style="color:#56B6C2;"> &gt;=</span><span style="color:#E06C75;"> max_failures</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#98C379;"> &quot;服务不健康，执行恢复操作...&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                # restart_service</span></span>
<span class="line"><span style="color:#E06C75;">                failure_count</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"><span style="color:#C678DD;">            fi</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 等待下一次检查</span></span>
<span class="line"><span style="color:#61AFEF;">        sleep</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$check_interval</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 模拟健康检查函数（生产环境中应该是真实的检查）</span></span>
<span class="line"><span style="color:#61AFEF;">check_service_health</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 这里应该是真实的服务健康检查</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 例如：curl http://localhost:8080/health 或其他检查</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span><span style="color:#7F848E;font-style:italic;">  # 总是返回成功（演示用）</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># daemon_loop_example  # 注释以防无限循环</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第五章-函数的定义与使用" tabindex="-1"><a class="header-anchor" href="#第五章-函数的定义与使用"><span>第五章 函数的定义与使用</span></a></h2><h3 id="函数的基本结构" tabindex="-1"><a class="header-anchor" href="#函数的基本结构"><span>函数的基本结构</span></a></h3><p>函数是构建模块化脚本的基础。在Shell中，函数有两种定义方式。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 函数定义方式1：使用function关键字 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用function关键字定义函数</span></span>
<span class="line"><span style="color:#C678DD;">function</span><span style="color:#61AFEF;"> greet_user</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> name</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;你好，</span><span style="color:#E06C75;">$name</span><span style="color:#98C379;">！&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 调用函数</span></span>
<span class="line"><span style="color:#61AFEF;">greet_user</span><span style="color:#98C379;"> &quot;张三&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 函数定义方式2：不使用function关键字 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 这种方式更具可移植性（兼容POSIX shell）</span></span>
<span class="line"><span style="color:#61AFEF;">farewell</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> name</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;再见，</span><span style="color:#E06C75;">$name</span><span style="color:#98C379;">！&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">farewell</span><span style="color:#98C379;"> &quot;李四&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 函数参数的访问 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">calculate_sum</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # $1 第一个参数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # $2 第二个参数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # $# 参数个数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # $@ 所有参数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # $* 所有参数（作为单一字符串）</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E5C07B;">$#</span><span style="color:#56B6C2;"> !=</span><span style="color:#D19A66;"> 2</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误：需要恰好2个参数&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> num1</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;font-style:italic;">$1</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> num2</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;font-style:italic;">$2</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$((</span><span style="color:#61AFEF;">num1</span><span style="color:#98C379;"> +</span><span style="color:#98C379;"> num2</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$num1</span><span style="color:#98C379;"> + </span><span style="color:#E06C75;">$num2</span><span style="color:#98C379;"> = </span><span style="color:#E06C75;">$result</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">calculate_sum</span><span style="color:#D19A66;"> 10</span><span style="color:#D19A66;"> 20</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 函数的返回值 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 函数可以返回退出状态码（0-255）</span></span>
<span class="line"><span style="color:#61AFEF;">is_number</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> value</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 使用正则表达式检查是否为数字</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#E06C75;">$value</span><span style="color:#56B6C2;"> =~</span><span style="color:#ABB2BF;"> ^[0-9]+$ ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span><span style="color:#7F848E;font-style:italic;">  # 成功</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span><span style="color:#7F848E;font-style:italic;">  # 失败</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> is_number</span><span style="color:#98C379;"> &quot;123&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;123是一个数字&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;123不是数字&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> is_number</span><span style="color:#98C379;"> &quot;abc&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;abc是一个数字&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;abc不是数字&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 通过标准输出返回值 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">get_current_date</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 函数可以输出数据，调用者通过命令替换捕获</span></span>
<span class="line"><span style="color:#61AFEF;">    date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">current_time</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">get_current_date</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;当前时间: </span><span style="color:#E06C75;">$current_time</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 全局变量和局部变量 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">global_var</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;我是全局变量&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">demonstrate_scope</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> local_var</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;我是局部变量&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;在函数内访问全局变量: </span><span style="color:#E06C75;">$global_var</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;在函数内访问局部变量: </span><span style="color:#E06C75;">$local_var</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">demonstrate_scope</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;在函数外访问全局变量: </span><span style="color:#E06C75;">$global_var</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;在函数外访问局部变量（应该为空）: </span><span style="color:#E06C75;">$local_var</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 在函数中修改全局变量 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">counter</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">increment_counter</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#ABB2BF;">    ((</span><span style="color:#E06C75;">counter</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;初始计数: </span><span style="color:#E06C75;">$counter</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">increment_counter</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;递增后: </span><span style="color:#E06C75;">$counter</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">increment_counter</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;再次递增: </span><span style="color:#E06C75;">$counter</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 生产级案例：验证函数 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">validate_input</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> input</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> input_type</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${2</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;">string</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#7F848E;font-style:italic;">  # 默认为字符串验证</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    case</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$input_type</span><span style="color:#98C379;">&quot;</span><span style="color:#C678DD;"> in</span></span>
<span class="line"><span style="color:#E06C75;">        string</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$input</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#98C379;"> &quot;错误：输入不能为空&quot;</span></span>
<span class="line"><span style="color:#C678DD;">                return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">            fi</span></span>
<span class="line"><span style="color:#ABB2BF;">            ;;</span></span>
<span class="line"><span style="color:#E06C75;">        number</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> ! [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$input</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =~</span><span style="color:#ABB2BF;"> ^[0-9]+$ ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#98C379;"> &quot;错误：输入必须是数字&quot;</span></span>
<span class="line"><span style="color:#C678DD;">                return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">            fi</span></span>
<span class="line"><span style="color:#ABB2BF;">            ;;</span></span>
<span class="line"><span style="color:#E06C75;">        email</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> ! [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$input</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =~</span><span style="color:#ABB2BF;"> ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+</span><span style="color:#56B6C2;">\\.</span><span style="color:#ABB2BF;">[a-zA-Z]{2,}$ ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#98C379;"> &quot;错误：输入必须是有效的电子邮件&quot;</span></span>
<span class="line"><span style="color:#C678DD;">                return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">            fi</span></span>
<span class="line"><span style="color:#ABB2BF;">            ;;</span></span>
<span class="line"><span style="color:#E06C75;">        path</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> ! [[ </span><span style="color:#56B6C2;">-e</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$input</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#98C379;"> &quot;错误：路径不存在&quot;</span></span>
<span class="line"><span style="color:#C678DD;">                return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">            fi</span></span>
<span class="line"><span style="color:#ABB2BF;">            ;;</span></span>
<span class="line"><span style="color:#ABB2BF;">        *)</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;错误：未知的验证类型&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">            ;;</span></span>
<span class="line"><span style="color:#C678DD;">    esac</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 测试验证函数</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;验证字符串:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">validate_input</span><span style="color:#98C379;"> &quot;hello&quot;</span><span style="color:#98C379;"> string</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;验证成功&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;验证数字:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">validate_input</span><span style="color:#98C379;"> &quot;123&quot;</span><span style="color:#98C379;"> number</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;验证成功&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">validate_input</span><span style="color:#98C379;"> &quot;abc&quot;</span><span style="color:#98C379;"> number</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;验证失败&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;验证电子邮件:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">validate_input</span><span style="color:#98C379;"> &quot;user@example.com&quot;</span><span style="color:#98C379;"> email</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;验证成功&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">validate_input</span><span style="color:#98C379;"> &quot;invalid-email&quot;</span><span style="color:#98C379;"> email</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;验证失败&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;验证路径:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">validate_input</span><span style="color:#98C379;"> &quot;/etc&quot;</span><span style="color:#98C379;"> path</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;验证成功&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">validate_input</span><span style="color:#98C379;"> &quot;/nonexistent&quot;</span><span style="color:#98C379;"> path</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;验证失败&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="函数参数的处理与best-practices" tabindex="-1"><a class="header-anchor" href="#函数参数的处理与best-practices"><span>函数参数的处理与best practices</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 处理可变数量的参数 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">process_files</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查是否提供了参数</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#E5C07B;">$#</span><span style="color:#56B6C2;"> -eq</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误：必须提供至少一个文件&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 遍历所有参数</span></span>
<span class="line"><span style="color:#C678DD;">    for</span><span style="color:#E06C75;"> file</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;处理文件: </span><span style="color:#E06C75;">$file</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;跳过: </span><span style="color:#E06C75;">$file</span><span style="color:#98C379;">（不是文件）&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 使用shift处理参数 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># shift命令将参数左移（$2变成$1，$3变成$2，等等）</span></span>
<span class="line"><span style="color:#61AFEF;">process_options</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    while</span><span style="color:#98C379;"> [[</span><span style="color:#E5C07B;"> $#</span><span style="color:#D19A66;"> -gt</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">        case</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span><span style="color:#C678DD;"> in</span></span>
<span class="line"><span style="color:#E06C75;">            -v</span><span style="color:#ABB2BF;">|</span><span style="color:#E06C75;">--verbose</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#98C379;"> &quot;启用详细模式&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">                shift</span></span>
<span class="line"><span style="color:#ABB2BF;">                ;;</span></span>
<span class="line"><span style="color:#E06C75;">            -o</span><span style="color:#ABB2BF;">|</span><span style="color:#E06C75;">--output</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#98C379;"> &quot;输出文件: </span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">                shift</span><span style="color:#D19A66;"> 2</span><span style="color:#7F848E;font-style:italic;">  # 移动两个参数</span></span>
<span class="line"><span style="color:#ABB2BF;">                ;;</span></span>
<span class="line"><span style="color:#E06C75;">            -</span><span style="color:#ABB2BF;">*</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#98C379;"> &quot;未知选项: </span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">                return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">                ;;</span></span>
<span class="line"><span style="color:#ABB2BF;">            *)</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#98C379;"> &quot;处理文件: </span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">                shift</span></span>
<span class="line"><span style="color:#ABB2BF;">                ;;</span></span>
<span class="line"><span style="color:#C678DD;">        esac</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 函数的最佳实践 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 清晰的函数命名</span></span>
<span class="line"><span style="color:#61AFEF;">get_system_uptime</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    uptime</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 在函数顶部进行参数验证</span></span>
<span class="line"><span style="color:#61AFEF;">get_file_size</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 参数验证</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#E5C07B;">$#</span><span style="color:#56B6C2;"> -ne</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误：用法 get_file_size &lt;文件路径&gt;&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -f</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误：文件不存在: </span><span style="color:#E06C75;">$file</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 实现功能</span></span>
<span class="line"><span style="color:#56B6C2;">    stat</span><span style="color:#D19A66;"> -f%z</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">stat</span><span style="color:#D19A66;"> -c%s</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 使用local声明局部变量</span></span>
<span class="line"><span style="color:#61AFEF;">calculate_factorial</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> n</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;font-style:italic;">$1</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> result</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">1</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">n</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误：n必须是非负整数&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    for</span><span style="color:#ABB2BF;"> ((</span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;"> =</span><span style="color:#D19A66;"> 2</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;"> &lt;=</span><span style="color:#E06C75;"> n</span><span style="color:#ABB2BF;">; </span><span style="color:#E06C75;">i</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">)); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">result</span><span style="color:#56B6C2;"> *=</span><span style="color:#E06C75;"> i</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$result</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 提供清晰的错误消息和返回码</span></span>
<span class="line"><span style="color:#61AFEF;">safe_divide</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> dividend</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;font-style:italic;">$1</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> divisor</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;font-style:italic;">$2</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#E5C07B;">$#</span><span style="color:#56B6C2;"> -ne</span><span style="color:#D19A66;"> 2</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误：需要两个参数&quot;</span><span style="color:#ABB2BF;"> &gt;&amp;2</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$dividend</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =~</span><span style="color:#ABB2BF;"> ^[0-9]+$ ]] || ! [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$divisor</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =~</span><span style="color:#ABB2BF;"> ^[0-9]+$ ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误：参数必须是整数&quot;</span><span style="color:#ABB2BF;"> &gt;&amp;2</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">divisor</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误：除数不能为零&quot;</span><span style="color:#ABB2BF;"> &gt;&amp;2</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#ABB2BF;"> $((</span><span style="color:#61AFEF;">dividend</span><span style="color:#98C379;"> /</span><span style="color:#98C379;"> divisor</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 测试safe_divide</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;10 / 2 = $(</span><span style="color:#61AFEF;">safe_divide</span><span style="color:#D19A66;"> 10</span><span style="color:#D19A66;"> 2</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;10 / 0 的结果:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">safe_divide</span><span style="color:#D19A66;"> 10</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;返回码: </span><span style="color:#E5C07B;">$?</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 生产级案例：日志记录函数 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">log_message</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> level</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    shift</span><span style="color:#7F848E;font-style:italic;">  # 移除level参数</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> message</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E5C07B;">$*</span><span style="color:#98C379;">&quot;</span><span style="color:#7F848E;font-style:italic;">  # 剩余的所有参数作为消息</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> timestamp</span></span>
<span class="line"><span style="color:#E06C75;">    timestamp</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 输出格式：[时间] [级别] 消息</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;[</span><span style="color:#E06C75;">$timestamp</span><span style="color:#98C379;">] [</span><span style="color:#E06C75;">$level</span><span style="color:#98C379;">] </span><span style="color:#E06C75;">$message</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">log_info</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    log_message</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">log_error</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    log_message</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> &gt;&amp;2  </span><span style="color:#7F848E;font-style:italic;"># 错误信息输出到stderr</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">log_warn</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    log_message</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用日志函数</span></span>
<span class="line"><span style="color:#61AFEF;">log_info</span><span style="color:#98C379;"> &quot;应用程序启动&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">log_warn</span><span style="color:#98C379;"> &quot;这是一个警告信息&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">log_error</span><span style="color:#98C379;"> &quot;发生了一个错误&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第六章-数组与关联数组" tabindex="-1"><a class="header-anchor" href="#第六章-数组与关联数组"><span>第六章 数组与关联数组</span></a></h2><h3 id="索引数组的操作" tabindex="-1"><a class="header-anchor" href="#索引数组的操作"><span>索引数组的操作</span></a></h3><p>Bash支持一维数组，可以存储多个值。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 创建和访问数组 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法1：逐个赋值</span></span>
<span class="line"><span style="color:#E06C75;">colors</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;红&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">colors[[1](https://blog.csdn.net/m0_74907475/article/details/145231855</span><span style="color:#ABB2BF;">)]=</span><span style="color:#98C379;">&quot;绿&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">colors[[2](https://wxler.github.io/2021/02/10/111447/</span><span style="color:#ABB2BF;">)]=</span><span style="color:#98C379;">&quot;蓝&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法2：一次性赋值</span></span>
<span class="line"><span style="color:#E06C75;">fruits</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;苹果&quot;</span><span style="color:#98C379;"> &quot;香蕉&quot;</span><span style="color:#98C379;"> &quot;橙子&quot;</span><span style="color:#98C379;"> &quot;葡萄&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法3：使用declare声明</span></span>
<span class="line"><span style="color:#C678DD;">declare</span><span style="color:#D19A66;"> -a</span><span style="color:#E06C75;"> vegetables</span></span>
<span class="line"><span style="color:#E06C75;">vegetables</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">土豆</span><span style="color:#98C379;"> 番茄</span><span style="color:#98C379;"> 黄瓜</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 访问单个元素</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;第一个水果: \${</span><span style="color:#E06C75;">fruits</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;第四个水果: \${</span><span style="color:#E06C75;">fruits</span><span style="color:#98C379;">[[3](</span><span style="color:#E06C75;">https</span><span style="color:#ABB2BF;">://</span><span style="color:#E06C75;">blog</span><span style="color:#98C379;">.</span><span style="color:#E06C75;">csdn</span><span style="color:#98C379;">.</span><span style="color:#E06C75;">net</span><span style="color:#ABB2BF;">/</span><span style="color:#E06C75;">zhengnianli</span><span style="color:#ABB2BF;">/</span><span style="color:#E06C75;">article</span><span style="color:#ABB2BF;">/</span><span style="color:#E06C75;">details</span><span style="color:#ABB2BF;">/</span><span style="color:#E06C75;">131200939</span><span style="color:#98C379;">)]}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 访问所有元素</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;所有颜色: \${</span><span style="color:#E06C75;">colors</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;所有颜色（使用*）: \${</span><span style="color:#E06C75;">colors</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">*</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 数组长度 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取数组长度</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;颜色数量: \${</span><span style="color:#ABB2BF;">#</span><span style="color:#E06C75;">colors</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;水果数量: \${</span><span style="color:#ABB2BF;">#</span><span style="color:#E06C75;">fruits</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取数组最后一个元素的索引</span></span>
<span class="line"><span style="color:#E06C75;">last_index</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$((\${#</span><span style="color:#E06C75;">fruits</span><span style="color:#ABB2BF;">[@]} - 1))</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;最后一个水果: \${</span><span style="color:#E06C75;">fruits</span><span style="color:#98C379;">[</span><span style="color:#E06C75;">$last_index</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 添加和删除元素 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加元素</span></span>
<span class="line"><span style="color:#E06C75;">fruits</span><span style="color:#C678DD;">+=</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;梨&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;添加梨后: \${</span><span style="color:#E06C75;">fruits</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 删除元素</span></span>
<span class="line"><span style="color:#56B6C2;">unset</span><span style="color:#98C379;"> fruits[[1]</span><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">https://blog.csdn.net/m0_74907475/article/details/145231855</span><span style="color:#ABB2BF;">)</span><span style="color:#98C379;">]</span><span style="color:#7F848E;font-style:italic;">  # 删除索引1的元素</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;删除索引1后: \${</span><span style="color:#E06C75;">fruits</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：删除后，数组长度会改变，但索引保留</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;长度: \${</span><span style="color:#ABB2BF;">#</span><span style="color:#E06C75;">fruits</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;所有索引: \${</span><span style="color:#ABB2BF;">!</span><span style="color:#E06C75;">fruits</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 数组切片和遍历 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">numbers</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">1</span><span style="color:#D19A66;"> 2</span><span style="color:#D19A66;"> 3</span><span style="color:#D19A66;"> 4</span><span style="color:#D19A66;"> 5</span><span style="color:#D19A66;"> 6</span><span style="color:#D19A66;"> 7</span><span style="color:#D19A66;"> 8</span><span style="color:#D19A66;"> 9</span><span style="color:#D19A66;"> 10</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取数组的子集</span></span>
<span class="line"><span style="color:#E06C75;">subset</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">numbers</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;">2</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;">4</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">)  </span><span style="color:#7F848E;font-style:italic;"># 从索引2开始，取4个元素</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;子集: \${</span><span style="color:#E06C75;">subset</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 遍历数组</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;遍历所有数字:&quot;</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> num</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">numbers</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  </span><span style="color:#E06C75;">$num</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 遍历数组同时获取索引</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;带索引的遍历:&quot;</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> i</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#ABB2BF;">!</span><span style="color:#E06C75;">numbers</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  索引</span><span style="color:#E06C75;">$i</span><span style="color:#98C379;">: \${</span><span style="color:#E06C75;">numbers</span><span style="color:#98C379;">[</span><span style="color:#E06C75;">$i</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 数组操作的常见错误 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ❌ 错误：不加引号的数组引用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># echo &quot;\${colors}&quot;  # 只输出第一个元素</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ✅ 正确：使用[@]</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;正确的全数组引用: \${</span><span style="color:#E06C75;">colors</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ❌ 错误：在循环中不加引号</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># for color in \${colors[@]}; do  # 如果元素包含空格会分解</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ✅ 正确：加上引号</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> color</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">colors</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  颜色: </span><span style="color:#E06C75;">$color</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 数组的高级操作 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 数组求和</span></span>
<span class="line"><span style="color:#C678DD;">declare</span><span style="color:#D19A66;"> -a</span><span style="color:#E06C75;"> numbers</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">10</span><span style="color:#D19A66;"> 20</span><span style="color:#D19A66;"> 30</span><span style="color:#D19A66;"> 40</span><span style="color:#D19A66;"> 50</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">sum</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> num</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">numbers</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#ABB2BF;">    ((</span><span style="color:#E06C75;">sum</span><span style="color:#56B6C2;"> +=</span><span style="color:#E06C75;"> num</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;数组元素求和: </span><span style="color:#E06C75;">$sum</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 数组的最大值和最小值</span></span>
<span class="line"><span style="color:#E06C75;">max</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">numbers</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">min</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">numbers</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> num</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">numbers</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#ABB2BF;">    (( </span><span style="color:#E06C75;">num</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#E06C75;"> max</span><span style="color:#ABB2BF;"> )) &amp;&amp; </span><span style="color:#E06C75;">max</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;">$num</span></span>
<span class="line"><span style="color:#ABB2BF;">    (( </span><span style="color:#E06C75;">num</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> min</span><span style="color:#ABB2BF;"> )) &amp;&amp; </span><span style="color:#E06C75;">min</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;">$num</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;最大值: </span><span style="color:#E06C75;">$max</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;最小值: </span><span style="color:#E06C75;">$min</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 生产级案例：命令行参数到数组 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">collect_arguments_to_array</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#D19A66;"> -a</span><span style="color:#E06C75;"> args_array</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    while</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#E5C07B;">$#</span><span style="color:#56B6C2;"> -gt</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">        case</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span><span style="color:#C678DD;"> in</span></span>
<span class="line"><span style="color:#E06C75;">            -f</span><span style="color:#ABB2BF;">|</span><span style="color:#E06C75;">--files</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">                shift</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                # 收集所有跟在-f后面的非选项参数</span></span>
<span class="line"><span style="color:#C678DD;">                while</span><span style="color:#98C379;"> [[</span><span style="color:#E5C07B;"> $#</span><span style="color:#D19A66;"> -gt</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ]] &amp;&amp; [[ ! &quot;$1&quot; =~ ^- ]]; do</span></span>
<span class="line"><span style="color:#98C379;">                    args_array+=</span><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#61AFEF;">&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">                    shift</span></span>
<span class="line"><span style="color:#C678DD;">                done</span></span>
<span class="line"><span style="color:#ABB2BF;">                ;;</span></span>
<span class="line"><span style="color:#ABB2BF;">            *)</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#98C379;"> &quot;未知选项: </span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">                shift</span></span>
<span class="line"><span style="color:#ABB2BF;">                ;;</span></span>
<span class="line"><span style="color:#C678DD;">        esac</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;收集的文件:&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    for</span><span style="color:#E06C75;"> file</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">args_array</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  - </span><span style="color:#E06C75;">$file</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># collect_arguments_to_array -f file1.txt file2.txt file3.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="关联数组-字典" tabindex="-1"><a class="header-anchor" href="#关联数组-字典"><span>关联数组（字典）</span></a></h3><p>Bash 4.0+支持关联数组，允许使用字符串作为键。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 关联数组只在Bash 4.0+中支持</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查Bash版本</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">BASH_VERSINFO</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#D19A66;"> 4</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;需要Bash 4.0或更高版本来使用关联数组&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 创建和访问关联数组 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 必须使用declare -A声明关联数组</span></span>
<span class="line"><span style="color:#C678DD;">declare</span><span style="color:#D19A66;"> -A</span><span style="color:#E06C75;"> person</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 赋值</span></span>
<span class="line"><span style="color:#E06C75;">person</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">]</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;张三&quot;</span></span>
<span class="line"><span style="color:#E06C75;">person</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">age</span><span style="color:#ABB2BF;">]</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">30</span></span>
<span class="line"><span style="color:#E06C75;">person</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">city</span><span style="color:#ABB2BF;">]</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;北京&quot;</span></span>
<span class="line"><span style="color:#E06C75;">person</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">job</span><span style="color:#ABB2BF;">]</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;工程师&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 访问</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;姓名: \${</span><span style="color:#E06C75;">person</span><span style="color:#98C379;">[name]}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;年龄: \${</span><span style="color:#E06C75;">person</span><span style="color:#98C379;">[age]}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;城市: \${</span><span style="color:#E06C75;">person</span><span style="color:#98C379;">[city]}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;工作: \${</span><span style="color:#E06C75;">person</span><span style="color:#98C379;">[job]}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 关联数组的声明与初始化 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 同时声明和初始化</span></span>
<span class="line"><span style="color:#C678DD;">declare</span><span style="color:#D19A66;"> -A</span><span style="color:#E06C75;"> server_config</span></span>
<span class="line"><span style="color:#E06C75;">server_config</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">([</span><span style="color:#D19A66;">host</span><span style="color:#ABB2BF;">]=</span><span style="color:#98C379;">&quot;localhost&quot;</span><span style="color:#ABB2BF;"> [</span><span style="color:#D19A66;">port</span><span style="color:#ABB2BF;">]=</span><span style="color:#98C379;">&quot;8080&quot;</span><span style="color:#ABB2BF;"> [</span><span style="color:#D19A66;">debug</span><span style="color:#ABB2BF;">]=</span><span style="color:#98C379;">&quot;true&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;主机: \${</span><span style="color:#E06C75;">server_config</span><span style="color:#98C379;">[host]}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;端口: \${</span><span style="color:#E06C75;">server_config</span><span style="color:#98C379;">[port]}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;调试: \${</span><span style="color:#E06C75;">server_config</span><span style="color:#98C379;">[debug]}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 遍历关联数组 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 遍历所有的键</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;所有配置键:&quot;</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> key</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#ABB2BF;">!</span><span style="color:#E06C75;">server_config</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  </span><span style="color:#E06C75;">$key</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 遍历所有的值</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;所有配置值:&quot;</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> value</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">server_config</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  </span><span style="color:#E06C75;">$value</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 同时遍历键和值</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;键值对:&quot;</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> key</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#ABB2BF;">!</span><span style="color:#E06C75;">server_config</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  </span><span style="color:#E06C75;">$key</span><span style="color:#98C379;"> = \${</span><span style="color:#E06C75;">server_config</span><span style="color:#98C379;">[</span><span style="color:#E06C75;">$key</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 检查键是否存在 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查键是否存在</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ -v server_config[host] ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;host键存在&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ -v server_config[unknown] ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;unknown键存在&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;unknown键不存在&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 删除关联数组元素 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">declare</span><span style="color:#D19A66;"> -A</span><span style="color:#E06C75;"> settings</span></span>
<span class="line"><span style="color:#E06C75;">settings</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">theme</span><span style="color:#ABB2BF;">]</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;dark&quot;</span></span>
<span class="line"><span style="color:#E06C75;">settings</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">language</span><span style="color:#ABB2BF;">]</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;en&quot;</span></span>
<span class="line"><span style="color:#E06C75;">settings</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">timezone</span><span style="color:#ABB2BF;">]</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;UTC&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;原始设置: \${</span><span style="color:#ABB2BF;">!</span><span style="color:#E06C75;">settings</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">unset</span><span style="color:#98C379;"> settings[language]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;删除language后: \${</span><span style="color:#ABB2BF;">!</span><span style="color:#E06C75;">settings</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 生产级案例：配置管理 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">load_config</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> config_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -f</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$config_file</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误：配置文件不存在: </span><span style="color:#E06C75;">$config_file</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    declare</span><span style="color:#D19A66;"> -gA</span><span style="color:#E06C75;"> config</span><span style="color:#7F848E;font-style:italic;">  # 全局关联数组</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 读取配置文件</span></span>
<span class="line"><span style="color:#C678DD;">    while</span><span style="color:#E06C75;"> IFS</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&#39;=&#39;</span><span style="color:#56B6C2;"> read</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> key</span><span style="color:#98C379;"> value</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 跳过注释行和空行</span></span>
<span class="line"><span style="color:#ABB2BF;">        [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$key</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =~</span><span style="color:#ABB2BF;"> ^#.*$ ]] &amp;&amp; </span><span style="color:#C678DD;">continue</span></span>
<span class="line"><span style="color:#ABB2BF;">        [[ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$key</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]] &amp;&amp; </span><span style="color:#C678DD;">continue</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 移除前后的空格</span></span>
<span class="line"><span style="color:#E06C75;">        key</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$key</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">xargs</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">        value</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$value</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">xargs</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 移除可能的引号</span></span>
<span class="line"><span style="color:#E06C75;">        value</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">value</span><span style="color:#ABB2BF;">%</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        value</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">value</span><span style="color:#ABB2BF;">#</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#E06C75;">        config</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">$key</span><span style="color:#ABB2BF;">]</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$value</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    done</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$config_file</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">get_config</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> key</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> default</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${2</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ -v config[</span><span style="color:#E06C75;">$key</span><span style="color:#ABB2BF;">] ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">config</span><span style="color:#98C379;">[</span><span style="color:#E06C75;">$key</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$default</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建示例配置文件</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/tmp/app.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;"># 应用配置</span></span>
<span class="line"><span style="color:#98C379;">database_host=localhost</span></span>
<span class="line"><span style="color:#98C379;">database_port=5432</span></span>
<span class="line"><span style="color:#98C379;">database_name=myapp</span></span>
<span class="line"><span style="color:#98C379;">api_timeout=30</span></span>
<span class="line"><span style="color:#98C379;">debug_mode=false</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 加载配置</span></span>
<span class="line"><span style="color:#61AFEF;">load_config</span><span style="color:#98C379;"> &quot;/tmp/app.conf&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 访问配置</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;数据库主机: $(</span><span style="color:#61AFEF;">get_config</span><span style="color:#98C379;"> database_host)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;数据库端口: $(</span><span style="color:#61AFEF;">get_config</span><span style="color:#98C379;"> database_port)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;API超时: $(</span><span style="color:#61AFEF;">get_config</span><span style="color:#98C379;"> api_timeout </span><span style="color:#D19A66;">60</span><span style="color:#98C379;">)&quot;</span><span style="color:#7F848E;font-style:italic;">  # 使用默认值</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 列出所有配置</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;所有配置:&quot;</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> key</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#ABB2BF;">!</span><span style="color:#E06C75;">config</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  </span><span style="color:#E06C75;">$key</span><span style="color:#98C379;">=\${</span><span style="color:#E06C75;">config</span><span style="color:#98C379;">[</span><span style="color:#E06C75;">$key</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第七章-i-o重定向与管道" tabindex="-1"><a class="header-anchor" href="#第七章-i-o重定向与管道"><span>第七章 I/O重定向与管道</span></a></h2><h3 id="标准流的重定向" tabindex="-1"><a class="header-anchor" href="#标准流的重定向"><span>标准流的重定向</span></a></h3><p>在Shell中，每个进程都有三个标准流：标准输入（stdin，文件描述符0）、标准输出（stdout，文件描述符1）和标准错误（stderr，文件描述符2）。理解这些流的重定向是高效脚本编写的基础。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 输出重定向 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 将标准输出重定向到文件（覆盖）</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;这会被写入文件&quot;</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/tmp/output.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 将标准输出追加到文件</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;这会被追加到文件&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">/tmp/output.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看文件内容</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;文件内容:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /tmp/output.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 错误输出重定向 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 将标准错误重定向到文件</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /nonexistent/file.txt</span><span style="color:#ABB2BF;"> 2&gt; </span><span style="color:#98C379;">/tmp/error.txt</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 将标准错误追加到文件</span></span>
<span class="line"><span style="color:#61AFEF;">ls</span><span style="color:#98C379;"> /nonexistent</span><span style="color:#ABB2BF;"> 2&gt;&gt; </span><span style="color:#98C379;">/tmp/error.log</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果错误文件存在，显示其内容</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#ABB2BF;"> /tmp/error.txt ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;错误输出内容:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    cat</span><span style="color:#98C379;"> /tmp/error.txt</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 同时重定向标准输出和标准错误 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法1：分别重定向</span></span>
<span class="line"><span style="color:#56B6C2;">command</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/tmp/output.txt</span><span style="color:#ABB2BF;"> 2&gt; </span><span style="color:#98C379;">/tmp/error.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法2：将错误重定向到输出</span></span>
<span class="line"><span style="color:#56B6C2;">command</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/tmp/result.txt</span><span style="color:#ABB2BF;"> 2&gt;&amp;1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法3：将两者都重定向到同一文件</span></span>
<span class="line"><span style="color:#56B6C2;">command</span><span style="color:#ABB2BF;"> &amp;&gt; /tmp/combined.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法4：将输出重定向到错误（不常用）</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;这会被当作错误输出&quot;</span><span style="color:#ABB2BF;"> 1&gt;&amp;2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 输入重定向 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从文件读取作为输入</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># command &lt; /tmp/input.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Here Document：将多行文本作为输入</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#98C379;">这是第一行</span></span>
<span class="line"><span style="color:#98C379;">这是第二行</span></span>
<span class="line"><span style="color:#98C379;">这是第三行</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Here String：将字符串作为输入</span></span>
<span class="line"><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -w</span><span style="color:#ABB2BF;"> &lt;&lt;&lt; </span><span style="color:#98C379;">&quot;这是一个字符串&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 丢弃输出 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用/dev/null来丢弃不需要的输出</span></span>
<span class="line"><span style="color:#56B6C2;">command</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> 2&gt;&amp;1  </span><span style="color:#7F848E;font-style:italic;"># 丢弃所有输出</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 只查看错误，丢弃正常输出</span></span>
<span class="line"><span style="color:#56B6C2;">command</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 &gt; </span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 文件描述符操作 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 复制文件描述符：将stdout复制给一个新的FD</span></span>
<span class="line"><span style="color:#56B6C2;">exec</span><span style="color:#ABB2BF;"> 3&gt;&amp;1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用新的FD输出</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;这会输出到stdout（通过FD3）&quot;</span><span style="color:#ABB2BF;"> &gt;&amp;3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 关闭文件描述符</span></span>
<span class="line"><span style="color:#56B6C2;">exec</span><span style="color:#ABB2BF;"> 3&gt;&amp;</span><span style="color:#98C379;">-</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 生产级案例：日志记录与错误处理 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置日志文件</span></span>
<span class="line"><span style="color:#E06C75;">LOG_FILE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/tmp/script_$.log&quot;</span></span>
<span class="line"><span style="color:#E06C75;">ERROR_LOG</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/tmp/script_error_$.log&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重定向所有输出</span></span>
<span class="line"><span style="color:#56B6C2;">exec</span><span style="color:#ABB2BF;"> 1&gt;&gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$LOG_FILE</span><span style="color:#98C379;">&quot;</span><span style="color:#7F848E;font-style:italic;">       # 将stdout重定向到日志</span></span>
<span class="line"><span style="color:#56B6C2;">exec</span><span style="color:#ABB2BF;"> 2&gt;&gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$ERROR_LOG</span><span style="color:#98C379;">&quot;</span><span style="color:#7F848E;font-style:italic;">      # 将stderr重定向到错误日志</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;这是一条日志消息&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;这是一条错误消息&quot;</span><span style="color:#ABB2BF;"> &gt;&amp;2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 恢复标准输出用于显示消息</span></span>
<span class="line"><span style="color:#56B6C2;">exec</span><span style="color:#ABB2BF;"> 1&gt;&amp;2  </span><span style="color:#7F848E;font-style:italic;"># 将stdout恢复到stderr（在脚本最后）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;脚本执行完毕&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;日志文件: </span><span style="color:#E06C75;">$LOG_FILE</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;错误日志: </span><span style="color:#E06C75;">$ERROR_LOG</span><span style="color:#98C379;">&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="管道操作" tabindex="-1"><a class="header-anchor" href="#管道操作"><span>管道操作</span></a></h3><p>管道是一个强大的特性，允许一个命令的输出作为另一个命令的输入。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;=== 基本管道操作 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 列出所有用户，显示用户名</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /etc/passwd</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">cut</span><span style="color:#D19A66;"> -d:</span><span style="color:#D19A66;"> -f1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用管道链</span></span>
<span class="line"><span style="color:#61AFEF;">ps</span><span style="color:#98C379;"> aux</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;bash&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 管道中的命令执行 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在管道中，每个命令在一个子shell中运行</span></span>
<span class="line"><span style="color:#E06C75;">count</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;apple\\norange\\nbanana&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#C678DD;">while</span><span style="color:#56B6C2;"> read</span><span style="color:#98C379;"> fruit</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#ABB2BF;">    ((</span><span style="color:#E06C75;">count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;处理: </span><span style="color:#E06C75;">$fruit</span><span style="color:#98C379;"> (计数: </span><span style="color:#E06C75;">$count</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ❌ 注意：循环后count仍然为0（subshell中的修改不会保留）</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;循环外的计数: </span><span style="color:#E06C75;">$count</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 避免subshell问题的方法 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方法1：使用process substitution</span></span>
<span class="line"><span style="color:#E06C75;">count</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"><span style="color:#C678DD;">while</span><span style="color:#56B6C2;"> read</span><span style="color:#98C379;"> fruit</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#ABB2BF;">    ((</span><span style="color:#E06C75;">count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;处理: </span><span style="color:#E06C75;">$fruit</span><span style="color:#98C379;"> (计数: </span><span style="color:#E06C75;">$count</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#C678DD;">done</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#98C379;">&lt;(</span><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;apple\\norange\\nbanana&quot;)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;现在计数保留了: </span><span style="color:#E06C75;">$count</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== tee命令：同时输出和保存 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># tee命令将输入复制到stdout和指定的文件</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;行1\\n行2\\n行3&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tee</span><span style="color:#98C379;"> /tmp/tee_output.txt</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 追加模式</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;第四行&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> /tmp/tee_output.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 管道中的错误处理 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：管道中只有最后一个命令的返回值被$?捕获</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用set -o pipefail可以改变这个行为</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认行为</span></span>
<span class="line"><span style="color:#61AFEF;">nonexistent_command</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">cat</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;返回值（默认）: </span><span style="color:#E5C07B;">$?</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用pipefail</span></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pipefail</span><span style="color:#ABB2BF;">; </span><span style="color:#61AFEF;">nonexistent_command</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;返回值（pipefail）: </span><span style="color:#E5C07B;">$?</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n=== 生产级案例：日志分析管道 ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建示例日志文件</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/tmp/sample.log</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">2024-01-15 10:20:30 INFO 用户登录成功</span></span>
<span class="line"><span style="color:#98C379;">2024-01-15 10:20:45 ERROR 数据库连接失败</span></span>
<span class="line"><span style="color:#98C379;">2024-01-15 10:21:00 INFO 请求处理完成</span></span>
<span class="line"><span style="color:#98C379;">2024-01-15 10:21:15 WARN 磁盘空间不足</span></span>
<span class="line"><span style="color:#98C379;">2024-01-15 10:21:30 ERROR 文件未找到</span></span>
<span class="line"><span style="color:#98C379;">2024-01-15 10:21:45 INFO 备份开始</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;日志分析结果：&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 统计每个级别的日志条数</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;各级别日志统计:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> &quot;ERROR\\|WARN\\|INFO&quot;</span><span style="color:#98C379;"> /tmp/sample.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 提取所有错误</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n错误日志:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> /tmp/sample.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">cut</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;">&#39; &#39;</span><span style="color:#D19A66;"> -f4-</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 统计特定时间段的日志</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n10:21时段的日志:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;10:21&quot;</span><span style="color:#98C379;"> /tmp/sample.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">cut</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;">&#39; &#39;</span><span style="color:#D19A66;"> -f3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 复杂分析：找出最后的错误</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\\n最后发生的错误:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> /tmp/sample.log</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tail</span><span style="color:#D19A66;"> -1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,71)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};