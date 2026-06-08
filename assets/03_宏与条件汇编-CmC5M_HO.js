import{A as e,E as t,d as n,f as r,l as i,p as a,s as o}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as s}from"./app-BiXPjlmt.js";var c=JSON.parse(`{"path":"/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%AD%A6%E7%A7%91/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80/04_%E4%BD%8D%E6%93%8D%E4%BD%9C%E4%B8%8E%E9%AB%98%E7%BA%A7%E8%BF%90%E7%AE%97/03_%E5%AE%8F%E4%B8%8E%E6%9D%A1%E4%BB%B6%E6%B1%87%E7%BC%96.html","title":"宏与条件汇编","lang":"zh-CN","frontmatter":{"title":"宏与条件汇编","icon":"fa6-solid:wand-magic-sparkles","order":3,"category":["计算机学科","汇编语言"],"tag":["宏"]},"git":{"createdTime":1780564101000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":6.59,"words":1976},"filePathRelative":"计算机学科/汇编语言/04_位操作与高级运算/03_宏与条件汇编.md"}`),l={name:`03_宏与条件汇编.md`};function u(s,c,l,u,d,f){let p=e(`Mermaid`);return t(),i(`div`,null,[c[0]||=o(`h1`,{id:`宏与条件汇编`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#宏与条件汇编`},[o(`span`,null,`宏与条件汇编`)])],-1),c[1]||=o(`h2`,{id:`为什么要用宏`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#为什么要用宏`},[o(`span`,null,`为什么要用宏？`)])],-1),c[2]||=o(`p`,null,[r(`写过一段时间汇编后，你会发现某些代码片段反复出现——函数序言/结语、系统调用序列、常用常量定义。复制粘贴不仅累，还容易出错。`),o(`strong`,null,`宏`),r(`（Macro）就是汇编的"代码模板"——定义一次，到处使用。`)],-1),c[3]||=o(`p`,null,[r(`如果函数是运行时的代码复用，宏就是`),o(`strong`,null,`编译时的代码复用`),r(`。宏在汇编阶段被展开，没有函数调用的开销。`)],-1),a(p,{code:`eJxLy8kvT85ILCpR8AniUgCC4tKk9KLEggyFp+v6n26c+nRPw4v97c9XdIMlQcAxWunZrgnPFzQ+2bH2+awWoLIXG5qfT1mhFKugq2un4BSt9HJRy9MlLc8ntD2duQJihFIsXLsTWJVztBJE5umEPqAhzza2P98z7cnuxUBjkdQ6g9W6AC0Ey4OMA5sLVZKal4Lm5Pa9z6ZugDgHzdWu0UrOjj4+Cs962p/sXgJ1q1u00ov9E14s7Hk2fduL7Ztf7F2DZLkbWIl7tFKQa4jCi/1Tns6eh25vSWVOKtBDaZk5OVbKqYZppmmpSBJuUIm0tDTjVAMuAEI4lg0=`}),c[4]||=n(`<h2 id="nasm-宏基础" tabindex="-1"><a class="header-anchor" href="#nasm-宏基础"><span>NASM 宏基础</span></a></h2><h3 id="单行宏-define" tabindex="-1"><a class="header-anchor" href="#单行宏-define"><span>单行宏：%define</span></a></h3><p><code>%define</code> 类似 C 语言的 <code>#define</code>，做简单的文本替换：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>%define EXIT_OK    0</span></span>
<span class="line"><span>%define SYS_WRITE  4</span></span>
<span class="line"><span>%define SYS_EXIT   1</span></span>
<span class="line"><span>%define STDOUT     1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 使用</span></span>
<span class="line"><span>mov eax, SYS_EXIT</span></span>
<span class="line"><span>mov ebx, EXIT_OK</span></span>
<span class="line"><span>int 0x80</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 带参数的单行宏</span></span>
<span class="line"><span>%define add1(x)  (x + 1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mov eax, add1(10)     ; 展开为: mov eax, (10 + 1)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">%define vs %xdefine</p><ul><li><code>%define</code> 是惰性展开——每次使用时重新求值</li><li><code>%xdefine</code> 在定义时展开一次——类似 C 的宏行为</li><li>大多数情况用 <code>%define</code> 即可</li></ul></div><h3 id="多行宏-macro-endmacro" tabindex="-1"><a class="header-anchor" href="#多行宏-macro-endmacro"><span>多行宏：%macro / %endmacro</span></a></h3><p>多行宏是 NASM 宏系统的核心，可以包含任意多条指令：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 定义函数序言宏</span></span>
<span class="line"><span>%macro PROLOGUE 0</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 定义函数结语宏</span></span>
<span class="line"><span>%macro EPILOGUE 0</span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 使用</span></span>
<span class="line"><span>my_function:</span></span>
<span class="line"><span>    PROLOGUE</span></span>
<span class="line"><span>    ; ... 函数体 ...</span></span>
<span class="line"><span>    EPILOGUE</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="带参数的宏" tabindex="-1"><a class="header-anchor" href="#带参数的宏"><span>带参数的宏</span></a></h3><p>宏可以接受参数，通过 <code>%1</code>、<code>%2</code> 等引用：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 系统调用宏</span></span>
<span class="line"><span>; 参数: %1=系统调用号, %2=参数个数</span></span>
<span class="line"><span>%macro SYSCALL 2</span></span>
<span class="line"><span>    mov eax, %1</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 但这不够灵活，让我们写一个更好的版本</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 通用系统调用宏（最多3个参数）</span></span>
<span class="line"><span>; %1=调用号, %2=arg1, %3=arg2, %4=arg3</span></span>
<span class="line"><span>%macro DO_SYSCALL 1-4</span></span>
<span class="line"><span>    mov eax, %1</span></span>
<span class="line"><span>    %if %0 &gt;= 2</span></span>
<span class="line"><span>    mov ebx, %2</span></span>
<span class="line"><span>    %endif</span></span>
<span class="line"><span>    %if %0 &gt;= 3</span></span>
<span class="line"><span>    mov ecx, %3</span></span>
<span class="line"><span>    %endif</span></span>
<span class="line"><span>    %if %0 &gt;= 4</span></span>
<span class="line"><span>    mov edx, %4</span></span>
<span class="line"><span>    %endif</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 使用</span></span>
<span class="line"><span>DO_SYSCALL 1, 0              ; exit(0)</span></span>
<span class="line"><span>DO_SYSCALL 4, 1, msg, len   ; write(1, msg, len)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>%0</code> 表示实际传入的参数个数。<code>1-4</code> 表示最少 1 个、最多 4 个参数。</p><h3 id="局部标号" tabindex="-1"><a class="header-anchor" href="#局部标号"><span>局部标号</span></a></h3><p>宏内的标号如果重复展开会冲突。用 <code>%%</code> 前缀创建<strong>宏局部标号</strong>：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 绝对值宏</span></span>
<span class="line"><span>%macro ABS 1</span></span>
<span class="line"><span>    mov eax, %1</span></span>
<span class="line"><span>    cmp eax, 0</span></span>
<span class="line"><span>    jge %%done</span></span>
<span class="line"><span>    neg eax</span></span>
<span class="line"><span>%%done:</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 多次调用不会冲突</span></span>
<span class="line"><span>ABS [x]        ; 生成 %%done → ??0001.done</span></span>
<span class="line"><span>ABS [y]        ; 生成 %%done → ??0002.done</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,16),a(p,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggyF52vWPNnR8GzNwqcbpz7d0wCWBAFHw2il3PwyhdTECh2F6IpYpVi4lBNQKjm3ACJlgCThDJTISk9VsLc3MDAw1EvJz0tFknUByualpoO0IYm6AkWR1FtBpVLzUjDduasHizuNkN1ZieJOoBR2dwIl4O40wnAnUBaLO4GiSOqR3QkAqAFhzw==`}),c[5]||=n(`<div class="hint-container important"><p class="hint-container-title">宏局部标号必须用 %%</p><p>如果宏内有跳转标号，必须用 <code>%%</code> 前缀。否则宏展开两次后会产生重复标号，汇编报错。</p></div><h2 id="条件汇编" tabindex="-1"><a class="header-anchor" href="#条件汇编"><span>条件汇编</span></a></h2><p>条件汇编允许根据编译时条件选择性地包含代码——类似 C 的 <code>#ifdef</code>。</p><h3 id="ifdef-ifndef-else-endif" tabindex="-1"><a class="header-anchor" href="#ifdef-ifndef-else-endif"><span>%ifdef / %ifndef / %else / %endif</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 调试模式开关</span></span>
<span class="line"><span>%define DEBUG</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%ifdef DEBUG</span></span>
<span class="line"><span>    ; 调试版本：打印调试信息</span></span>
<span class="line"><span>    %macro DPRINT 1</span></span>
<span class="line"><span>        push eax</span></span>
<span class="line"><span>        push ebx</span></span>
<span class="line"><span>        push ecx</span></span>
<span class="line"><span>        push edx</span></span>
<span class="line"><span>        mov eax, 4</span></span>
<span class="line"><span>        mov ebx, 1</span></span>
<span class="line"><span>        mov ecx, %1</span></span>
<span class="line"><span>        mov edx, %1_len</span></span>
<span class="line"><span>        int 0x80</span></span>
<span class="line"><span>        pop edx</span></span>
<span class="line"><span>        pop ecx</span></span>
<span class="line"><span>        pop ebx</span></span>
<span class="line"><span>        pop eax</span></span>
<span class="line"><span>    %endmacro</span></span>
<span class="line"><span>%else</span></span>
<span class="line"><span>    ; 发布版本：DPRINT 什么都不做</span></span>
<span class="line"><span>    %macro DPRINT 1</span></span>
<span class="line"><span>    %endmacro</span></span>
<span class="line"><span>%endif</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="if-elif-else" tabindex="-1"><a class="header-anchor" href="#if-elif-else"><span>%if / %elif / %else</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 根据目标平台选择代码</span></span>
<span class="line"><span>%ifidn __OUTPUT_FORMAT__, elf32</span></span>
<span class="line"><span>    ; 32 位 Linux</span></span>
<span class="line"><span>    %define SYSCALL_INT 0x80</span></span>
<span class="line"><span>%elifidn __OUTPUT_FORMAT__, elf64</span></span>
<span class="line"><span>    ; 64 位 Linux</span></span>
<span class="line"><span>    %define SYSCALL_INST syscall</span></span>
<span class="line"><span>%elifidn __OUTPUT_FORMAT__, win32</span></span>
<span class="line"><span>    ; 32 位 Windows</span></span>
<span class="line"><span>    %define SYSCALL_INT 0x2E</span></span>
<span class="line"><span>%endif</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="条件汇编指令一览" tabindex="-1"><a class="header-anchor" href="#条件汇编指令一览"><span>条件汇编指令一览</span></a></h3><table><thead><tr><th>指令</th><th>条件</th></tr></thead><tbody><tr><td><code>%ifdef SYMBOL</code></td><td>SYMBOL 已定义</td></tr><tr><td><code>%ifndef SYMBOL</code></td><td>SYMBOL 未定义</td></tr><tr><td><code>%ifexpr EXPR</code></td><td>表达式为真</td></tr><tr><td><code>%ifidn A, B</code></td><td>A 和 B 完全相同（区分大小写）</td></tr><tr><td><code>%ifidni A, B</code></td><td>A 和 B 相同（不区分大小写）</td></tr><tr><td><code>%ifid TOKEN</code></td><td>TOKEN 是标识符</td></tr><tr><td><code>%ifnum TOKEN</code></td><td>TOKEN 是数字</td></tr><tr><td><code>%ifstr TOKEN</code></td><td>TOKEN 是字符串</td></tr></tbody></table><h2 id="实用宏库" tabindex="-1"><a class="header-anchor" href="#实用宏库"><span>实用宏库</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; macros.inc - 通用宏库</span></span>
<span class="line"><span>; 使用: %include &quot;macros.inc&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; 函数序言/结语</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>%macro PROLOGUE 0-1 0       ; 可选参数：局部变量字节数</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span>    %if %1 &gt; 0</span></span>
<span class="line"><span>    sub esp, %1</span></span>
<span class="line"><span>    %endif</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%macro EPILOGUE 0-1 0       ; 可选参数：ret N 中的 N</span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    %if %1 = 0</span></span>
<span class="line"><span>    ret</span></span>
<span class="line"><span>    %else</span></span>
<span class="line"><span>    ret %1</span></span>
<span class="line"><span>    %endif</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; 系统调用宏</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>%macro sys_exit 1</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    mov ebx, %1</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%macro sys_write 3</span></span>
<span class="line"><span>    mov eax, 4</span></span>
<span class="line"><span>    mov ebx, %1              ; fd</span></span>
<span class="line"><span>    mov ecx, %2              ; buf</span></span>
<span class="line"><span>    mov edx, %3              ; len</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%macro sys_read 3</span></span>
<span class="line"><span>    mov eax, 3</span></span>
<span class="line"><span>    mov ebx, %1              ; fd</span></span>
<span class="line"><span>    mov ecx, %2              ; buf</span></span>
<span class="line"><span>    mov edx, %3              ; len</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; 断言宏（调试用）</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>%macro ASSERT 2</span></span>
<span class="line"><span>    %ifidn __OUTPUT_FORMAT__, elf32</span></span>
<span class="line"><span>        cmp %1, %2</span></span>
<span class="line"><span>        je %%ok</span></span>
<span class="line"><span>        ; 断言失败 - 调用 abort</span></span>
<span class="line"><span>        mov eax, 1</span></span>
<span class="line"><span>        mov ebx, 99</span></span>
<span class="line"><span>        int 0x80</span></span>
<span class="line"><span>    %%ok:</span></span>
<span class="line"><span>    %endif</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; 字符串长度计算</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>%macro STRLEN 1</span></span>
<span class="line"><span>    %assign %%len 0</span></span>
<span class="line"><span>    %strlen %%len %1</span></span>
<span class="line"><span>%%len</span></span>
<span class="line"><span>%endmacro</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实战-使用宏的-hello-world" tabindex="-1"><a class="header-anchor" href="#实战-使用宏的-hello-world"><span>实战：使用宏的 Hello World</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; hello_macro.asm - 使用宏重写的 Hello World</span></span>
<span class="line"><span>; 编译: nasm -f elf32 hello_macro.asm -o hello_macro.o</span></span>
<span class="line"><span>; 链接: ld -m elf_i386 hello_macro.o -o hello_macro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%include &quot;macros.inc&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    msg db &#39;Hello from Macros!&#39;, 0xA</span></span>
<span class="line"><span>    msg_len equ $ - msg</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    sys_write STDOUT, msg, msg_len</span></span>
<span class="line"><span>    sys_exit 0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实战-泛型数组操作宏" tabindex="-1"><a class="header-anchor" href="#实战-泛型数组操作宏"><span>实战：泛型数组操作宏</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; array_macros.asm - 泛型数组操作</span></span>
<span class="line"><span>; 编译: nasm -f elf32 array_macros.asm -o array_macros.o</span></span>
<span class="line"><span>; 链接: gcc -m32 array_macros.o -o array_macros -nostdlib</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 数组遍历宏</span></span>
<span class="line"><span>; %1=数组名, %2=元素个数, %3=元素大小, %4=处理代码</span></span>
<span class="line"><span>%macro ARRAY_FOREACH 4</span></span>
<span class="line"><span>    push esi</span></span>
<span class="line"><span>    push ecx</span></span>
<span class="line"><span>    mov esi, %1</span></span>
<span class="line"><span>    mov ecx, %2</span></span>
<span class="line"><span>%%loop:</span></span>
<span class="line"><span>    %4                        ; 用户代码，ESI 指向当前元素</span></span>
<span class="line"><span>    add esi, %3               ; 移动到下一个元素</span></span>
<span class="line"><span>    dec ecx</span></span>
<span class="line"><span>    jnz %%loop</span></span>
<span class="line"><span>    pop ecx</span></span>
<span class="line"><span>    pop esi</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 数组求和宏</span></span>
<span class="line"><span>; %1=数组名, %2=元素个数</span></span>
<span class="line"><span>%macro ARRAY_SUM 2</span></span>
<span class="line"><span>    push esi</span></span>
<span class="line"><span>    push ecx</span></span>
<span class="line"><span>    push ebx</span></span>
<span class="line"><span>    xor eax, eax</span></span>
<span class="line"><span>    mov esi, %1</span></span>
<span class="line"><span>    mov ecx, %2</span></span>
<span class="line"><span>%%sum_loop:</span></span>
<span class="line"><span>    add eax, [esi]</span></span>
<span class="line"><span>    add esi, 4</span></span>
<span class="line"><span>    dec ecx</span></span>
<span class="line"><span>    jnz %%sum_loop</span></span>
<span class="line"><span>    pop ebx</span></span>
<span class="line"><span>    pop ecx</span></span>
<span class="line"><span>    pop esi</span></span>
<span class="line"><span>%endmacro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    numbers dd 10, 20, 30, 40, 50</span></span>
<span class="line"><span>    count   equ 5</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    ; 求和</span></span>
<span class="line"><span>    ARRAY_SUM numbers, count</span></span>
<span class="line"><span>    ; EAX = 150</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov ebx, eax</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    int 0x80</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="宏-vs-函数-何时用哪个" tabindex="-1"><a class="header-anchor" href="#宏-vs-函数-何时用哪个"><span>宏 vs 函数：何时用哪个？</span></a></h2>`,16),a(p,{code:`eJxLy8kvT85ILCpRCHHiUgCCwOqXcxpeLGt8snvx8wWNT5f0Pp+ywr4WIqWgq2unUPNsxvoahUCjaiWIkpft/U839NskFenbvdjQDFT9ctHE5zsb7ZWgmozguhSeruuvUfCNVgLSYPXPpi+AaHm6p+HllAaw2NNF8552LYDZvhxotFIsikFPJyxTeNq+99nUDTUKbkCzwEyw1ic7Gp6tWQjRCjF/Tiey+TCDqpUgXny+Z9qL9ROfTd8GUTwXqHXby4bOZ90r4Y5H8rFztBJEybON7UCdYD3KmWkpqWkKLxf3PVuwB2g8ADKPpOg=`}),c[6]||=n(`<table><thead><tr><th>特性</th><th>宏</th><th>函数</th></tr></thead><tbody><tr><td>展开时机</td><td>编译时</td><td>运行时</td></tr><tr><td>调用开销</td><td>无</td><td>有（PUSH/CALL/RET）</td></tr><tr><td>代码大小</td><td>每次使用都展开，更大</td><td>只有一份，更小</td></tr><tr><td>调试</td><td>展开后难以调试</td><td>可设断点</td></tr><tr><td>参数检查</td><td>无（纯文本替换）</td><td>有类型（高级语言）</td></tr><tr><td>适用场景</td><td>短小频繁的代码片段</td><td>较大的逻辑块</td></tr></tbody></table><div class="hint-container warning"><p class="hint-container-title">宏的陷阱</p><ul><li><strong>无类型检查</strong>：宏参数是纯文本，拼写错误不会报编译错误</li><li><strong>代码膨胀</strong>：频繁使用大宏会显著增加代码体积</li><li><strong>调试困难</strong>：GDB 中看到的是展开后的代码，不是宏调用</li><li><strong>副作用</strong>：<code>%define square(x) ((x)*(x))</code>，<code>square(i++)</code> 会递增两次</li></ul><p>原则：<strong>短且频繁的代码用宏，长且少用的代码用函数</strong>。</p></div><h2 id="重复汇编-rep-endrep" tabindex="-1"><a class="header-anchor" href="#重复汇编-rep-endrep"><span>重复汇编：%rep / %endrep</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 生成查找表</span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    squares:</span></span>
<span class="line"><span>    %assign i 0</span></span>
<span class="line"><span>    %rep 10</span></span>
<span class="line"><span>        dd i*i</span></span>
<span class="line"><span>    %assign i i+1</span></span>
<span class="line"><span>    %endrep</span></span>
<span class="line"><span>    ; 生成: 0, 1, 4, 9, 16, 25, 36, 49, 64, 81</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2>`,5),a(p,{code:`eJxVUMFKw0AQvfcr5rLQClbqHwWTyIJJSqLiMVpwEYyxYFrRCqkW7EFag1KFVvoz2U3yF043WWtOO/vezJs3z6K2bmndBoDrOMfNJp+F6feNeBqny4VIWLYatFpIAvAgysfXSMsfANENk9oGiAETozfxuBbBs6LOKo4HH2K44EnEV34pMnmoi1jagevAHhBjYwPriuDhhYjegXSA7LfbbYUmftGbipjx8AsI+eud8/C+mujs7kj4/wVqGTXR12YZNW2strA0cKRez9gyVLfLAapXgyeWZAsW8ElQ13eNbnUKVgrUPI8e2uX1sxBOPeDsB50q84ihRD7vY1IghjFGVdz5kC5fsvg8v5zmvTI6bJVzkK9vMUPZPbqqdWefr5z1G7+/mcPX`}),c[7]||=n(`<div class="hint-container tip"><p class="hint-container-title">面试要点</p><ul><li>宏在编译时展开，函数在运行时调用——宏无调用开销但增加代码体积</li><li>NASM 宏参数用 <code>%1</code>、<code>%2</code> 引用，<code>%0</code> 获取参数个数</li><li>宏内标号必须用 <code>%%</code> 前缀，避免重复展开冲突</li><li>条件汇编用 <code>%ifdef</code>/<code>%if</code> 等，实现跨平台代码和调试开关</li><li><code>1-*</code> 语法定义可变参数宏，<code>%0</code> 获取实际参数个数</li></ul></div><div class="hint-container info"><p class="hint-container-title">原著参考</p><p>本章内容参考自《汇编语言：基于Linux环境（第3版）》Jeff Duntemann 第12章&quot;Coder&#39;s Introduction to the Cosmos&quot;。书中讲解了 NASM 宏系统的完整语法和最佳实践。</p></div>`,2)])}var d=s(l,[[`render`,u]]);export{c as _pageData,d as default};