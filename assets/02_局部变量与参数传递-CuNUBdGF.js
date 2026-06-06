import{A as e,E as t,d as n,f as r,l as i,p as a,s as o}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as s}from"./app-D7E9GCrC.js";var c=JSON.parse(`{"path":"/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%AD%A6%E7%A7%91/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80/03_%E8%BF%87%E7%A8%8B%E4%B8%8E%E6%A0%88/02_%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F%E4%B8%8E%E5%8F%82%E6%95%B0%E4%BC%A0%E9%80%92.html","title":"局部变量与参数传递","lang":"zh-CN","frontmatter":{"title":"局部变量与参数传递","icon":"fa6-solid:arrow-right-arrow-left","order":2,"category":["计算机学科","汇编语言"],"tag":["栈"]},"git":{"createdTime":1780564101000,"updatedTime":1780564101000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":6.87,"words":2060},"filePathRelative":"计算机学科/汇编语言/03_过程与栈/02_局部变量与参数传递.md"}`),l={name:`02_局部变量与参数传递.md`};function u(s,c,l,u,d,f){let p=e(`Mermaid`);return t(),i(`div`,null,[c[0]||=o(`h1`,{id:`局部变量与参数传递`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#局部变量与参数传递`},[o(`span`,null,`局部变量与参数传递`)])],-1),c[1]||=o(`h2`,{id:`局部变量-栈上的临时工坊`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#局部变量-栈上的临时工坊`},[o(`span`,null,`局部变量：栈上的临时工坊`)])],-1),c[2]||=o(`p`,null,[r(`C 语言中，函数内声明的局部变量在函数返回后就消失了——因为它们住在`),o(`strong`,null,`栈`),r(`上，函数返回时栈帧被销毁，变量也随之消亡。理解局部变量在栈上的布局，是理解程序内存行为的关键。`)],-1),a(p,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggyFZws6nu5YDhYDgZTMotTkksz8PAWnELhgQLTS0/6mZ1M3PO3ZpRDt6hSg7RerFAuXDopWerF/ytPZ857O2fB0bgNEhQmyiuBopSf75z5dO+P5rBagJFgFsrwP0IKNDS+bVzztn/GyvR9mjS6KNSFAQ3ZseTZ92/OVu15O36LgGhzwqG0SVEFqXgqqv55Pmf904t6nE1c8mzMfYY+Crq6dQo3S0/a9QN9AHA008OWUhmfrG5VqFCKA7mhrBboTJD5lG5LZAIwUfvQ=`}),c[3]||=n(`<h2 id="局部变量的分配与访问" tabindex="-1"><a class="header-anchor" href="#局部变量的分配与访问"><span>局部变量的分配与访问</span></a></h2><h3 id="在栈上分配局部变量" tabindex="-1"><a class="header-anchor" href="#在栈上分配局部变量"><span>在栈上分配局部变量</span></a></h3><p>在函数序言中，通过 <code>SUB ESP, N</code> 在栈上预留空间：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>my_function:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span>    sub esp, 12              ; 分配 3 个 int 大小的局部变量</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 局部变量布局：</span></span>
<span class="line"><span>    ; [ebp-4]  = 第1个局部变量</span></span>
<span class="line"><span>    ; [ebp-8]  = 第2个局部变量</span></span>
<span class="line"><span>    ; [ebp-12] = 第3个局部变量</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 使用局部变量</span></span>
<span class="line"><span>    mov dword [ebp-4], 10    ; var1 = 10</span></span>
<span class="line"><span>    mov dword [ebp-8], 20    ; var2 = 20</span></span>
<span class="line"><span>    mov dword [ebp-12], 30   ; var3 = 30</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 计算 sum = var1 + var2 + var3</span></span>
<span class="line"><span>    mov eax, [ebp-4]</span></span>
<span class="line"><span>    add eax, [ebp-8]</span></span>
<span class="line"><span>    add eax, [ebp-12]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 结语</span></span>
<span class="line"><span>    mov esp, ebp             ; 释放局部变量</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="局部变量-vs-全局变量" tabindex="-1"><a class="header-anchor" href="#局部变量-vs-全局变量"><span>局部变量 vs 全局变量</span></a></h3><table><thead><tr><th>特性</th><th>局部变量（栈上）</th><th>全局变量（.data/.bss）</th></tr></thead><tbody><tr><td>位置</td><td><code>[EBP-N]</code></td><td>固定地址（标号）</td></tr><tr><td>生命周期</td><td>函数调用期间</td><td>程序运行期间</td></tr><tr><td>初始化</td><td>必须手动赋值</td><td>可在 .data 中指定</td></tr><tr><td>线程安全</td><td>是（每个线程独立栈）</td><td>否（共享内存）</td></tr><tr><td>速度</td><td>稍慢（需偏移计算）</td><td>稍快（绝对地址）</td></tr></tbody></table><div class="hint-container tip"><p class="hint-container-title">未初始化的局部变量是垃圾值</p><p>栈上的局部变量不会自动清零！它的初始值是之前使用该内存位置的残留数据。这就是 C 语言中&quot;未初始化的局部变量值不确定&quot;的底层原因。</p></div><h2 id="参数传递机制" tabindex="-1"><a class="header-anchor" href="#参数传递机制"><span>参数传递机制</span></a></h2><h3 id="通过栈传参-32-位-cdecl" tabindex="-1"><a class="header-anchor" href="#通过栈传参-32-位-cdecl"><span>通过栈传参（32 位 cdecl）</span></a></h3><p>这是 32 位 x86 最基本的参数传递方式：</p><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// C 代码</span></span>
<span class="line"><span style="color:#C678DD;">int</span><span style="color:#61AFEF;"> add</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">int</span><span style="color:#E06C75;font-style:italic;"> a</span><span style="color:#ABB2BF;">,</span><span style="color:#C678DD;"> int</span><span style="color:#E06C75;font-style:italic;"> b</span><span style="color:#ABB2BF;">,</span><span style="color:#C678DD;"> int</span><span style="color:#E06C75;font-style:italic;"> c</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#ABB2BF;"> a </span><span style="color:#C678DD;">+</span><span style="color:#ABB2BF;"> b </span><span style="color:#C678DD;">+</span><span style="color:#ABB2BF;"> c;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">// 调用: add(1, 2, 3)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 调用者</span></span>
<span class="line"><span>push dword 3              ; 第3个参数（最右先压）</span></span>
<span class="line"><span>push dword 2              ; 第2个参数</span></span>
<span class="line"><span>push dword 1              ; 第1个参数</span></span>
<span class="line"><span>call add</span></span>
<span class="line"><span>add esp, 12               ; 清理 3 × 4 = 12 字节</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 被调用者</span></span>
<span class="line"><span>add:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov eax, [ebp+8]      ; a = 1</span></span>
<span class="line"><span>    add eax, [ebp+12]     ; + b = 2</span></span>
<span class="line"><span>    add eax, [ebp+16]     ; + c = 3</span></span>
<span class="line"><span>    ; EAX = 6</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,12),a(p,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggyFFxuan09ZkZiS8nRC3/NZLc8WdDzdsRysBARSMotSk0sy8/MUnELggs7RSk/7m55N3ZBsa6wQ7eoUoG1oFqsUC5d3gskn2RpB5Y2Q5R1h8om2hhB5C2TpIKD8i/1Tns6e93TOhqdzGyBKTJCVAAWilZ7sn/t07Qygm4E8sBqYitS8FC4AhVNS1w==`}),c[4]||=n(`<h3 id="通过寄存器传参-64-位-system-v-abi" tabindex="-1"><a class="header-anchor" href="#通过寄存器传参-64-位-system-v-abi"><span>通过寄存器传参（64 位 System V ABI）</span></a></h3><p>64 位模式下，前 6 个整数参数通过寄存器传递，极大减少了内存访问：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 64 位调用 add(1, 2, 3)</span></span>
<span class="line"><span>mov edi, 1                ; 第1个参数</span></span>
<span class="line"><span>mov esi, 2                ; 第2个参数</span></span>
<span class="line"><span>mov edx, 3                ; 第3个参数</span></span>
<span class="line"><span>call add</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 64 位 add 函数</span></span>
<span class="line"><span>add:</span></span>
<span class="line"><span>    mov eax, edi           ; a</span></span>
<span class="line"><span>    add eax, esi           ; + b</span></span>
<span class="line"><span>    add eax, edx           ; + c</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>参数序号</th><th>寄存器</th><th>浮点参数寄存器</th></tr></thead><tbody><tr><td>1</td><td>RDI</td><td>XMM0</td></tr><tr><td>2</td><td>RSI</td><td>XMM1</td></tr><tr><td>3</td><td>RDX</td><td>XMM2</td></tr><tr><td>4</td><td>RCX</td><td>XMM3</td></tr><tr><td>5</td><td>R8</td><td>XMM4</td></tr><tr><td>6</td><td>R9</td><td>XMM5</td></tr><tr><td>7+</td><td>栈</td><td>栈</td></tr></tbody></table><h2 id="返回值传递" tabindex="-1"><a class="header-anchor" href="#返回值传递"><span>返回值传递</span></a></h2><h3 id="单个返回值" tabindex="-1"><a class="header-anchor" href="#单个返回值"><span>单个返回值</span></a></h3><p>整数和指针返回值存入 EAX/RAX：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 返回 42</span></span>
<span class="line"><span>mov eax, 42</span></span>
<span class="line"><span>; ... leave/ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_64-位返回值" tabindex="-1"><a class="header-anchor" href="#_64-位返回值"><span>64 位返回值</span></a></h3><p>存入 EDX:EAX（32 位）或 RAX（64 位）：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 返回 64 位值（32 位模式）</span></span>
<span class="line"><span>mov eax, 0x12345678       ; 低 32 位</span></span>
<span class="line"><span>mov edx, 0x9ABCDEF0       ; 高 32 位</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="结构体返回值" tabindex="-1"><a class="header-anchor" href="#结构体返回值"><span>结构体返回值</span></a></h3><p>较大的结构体通过<strong>隐藏指针参数</strong>返回——调用者在栈上分配空间，将地址作为额外参数传入：</p><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// C 代码</span></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> Point { </span><span style="color:#C678DD;">int</span><span style="color:#ABB2BF;"> x; </span><span style="color:#C678DD;">int</span><span style="color:#ABB2BF;"> y; };</span></span>
<span class="line"><span style="color:#C678DD;">struct</span><span style="color:#ABB2BF;"> Point </span><span style="color:#61AFEF;">create_point</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">int</span><span style="color:#E06C75;font-style:italic;"> x</span><span style="color:#ABB2BF;">,</span><span style="color:#C678DD;"> int</span><span style="color:#E06C75;font-style:italic;"> y</span><span style="color:#ABB2BF;">);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 调用者</span></span>
<span class="line"><span>sub esp, 8                ; 为 Point 结构体分配空间</span></span>
<span class="line"><span>push dword 10             ; y</span></span>
<span class="line"><span>push dword 20             ; x</span></span>
<span class="line"><span>push esp                  ; 隐藏参数：结构体地址（简化示例）</span></span>
<span class="line"><span>call create_point</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 被调用者通过隐藏指针写入结构体</span></span>
<span class="line"><span>create_point:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span>    ; [ebp+8]  = 隐藏指针（结构体地址）</span></span>
<span class="line"><span>    ; [ebp+12] = x</span></span>
<span class="line"><span>    ; [ebp+16] = y</span></span>
<span class="line"><span>    mov ecx, [ebp+8]      ; 结构体地址</span></span>
<span class="line"><span>    mov eax, [ebp+12]     ; x</span></span>
<span class="line"><span>    mov [ecx], eax        ; point.x = x</span></span>
<span class="line"><span>    mov eax, [ebp+16]     ; y</span></span>
<span class="line"><span>    mov [ecx+4], eax      ; point.y = y</span></span>
<span class="line"><span>    mov eax, [ebp+8]      ; 返回结构体地址</span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret 12                 ; stdcall: 清理 3 个参数</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="栈对齐" tabindex="-1"><a class="header-anchor" href="#栈对齐"><span>栈对齐</span></a></h2><h3 id="_64-位的-16-字节对齐要求" tabindex="-1"><a class="header-anchor" href="#_64-位的-16-字节对齐要求"><span>64 位的 16 字节对齐要求</span></a></h3><p>System V AMD64 ABI 要求在执行 CALL 指令时，栈必须 <strong>16 字节对齐</strong>：</p>`,18),a(p,{code:`eJxLy8kvT85ILCpR8AniUgACx2glZ0cfH4Wnnb0KQcEBCqoKhmYKtrYKBkqxCrq6dgpOMPm+7qetS1/sn/J09rynczY8ndugFAs2wAmszDlaCVm3BVTSGSzpEq0UEBrsoRDkFAAVdwGLu6JqAlrJBQBtCCyY`}),c[5]||=n(`<div class="hint-container warning"><p class="hint-container-title">对齐错误会导致段错误</p><p>如果调用 SSE/AVX 指令（如 printf 内部使用）时栈未 16 字节对齐，CPU 会触发<strong>通用保护异常</strong>，程序崩溃。这是 64 位汇编最常见的坑之一。</p><p>修正方法：在序言中多减 8 字节：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>push rbp</span></span>
<span class="line"><span>mov rbp, rsp</span></span>
<span class="line"><span>sub rsp, 24              ; 而非 16，确保 16 字节对齐</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div><h2 id="实战-可变参数函数" tabindex="-1"><a class="header-anchor" href="#实战-可变参数函数"><span>实战：可变参数函数</span></a></h2><p>可变参数函数（如 <code>printf</code>）无法通过寄存器知道参数个数，必须依赖栈布局：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; vararg.asm - 简单的可变参数求和</span></span>
<span class="line"><span>; 编译: nasm -f elf32 vararg.asm -o vararg.o</span></span>
<span class="line"><span>; 链接: gcc -m32 vararg.o -o vararg -nostdlib</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    fmt db &#39;Sum = %d&#39;, 0xA, 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    extern printf</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    ; 调用 sum_varargs(3, 10, 20, 30)</span></span>
<span class="line"><span>    ; 第一个参数是后续参数的个数</span></span>
<span class="line"><span>    push dword 30</span></span>
<span class="line"><span>    push dword 20</span></span>
<span class="line"><span>    push dword 10</span></span>
<span class="line"><span>    push dword 3           ; count = 3</span></span>
<span class="line"><span>    call sum_varargs</span></span>
<span class="line"><span>    add esp, 16</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 用 printf 输出结果</span></span>
<span class="line"><span>    push eax</span></span>
<span class="line"><span>    push fmt</span></span>
<span class="line"><span>    call printf</span></span>
<span class="line"><span>    add esp, 8</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 退出</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    xor ebx, ebx</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; sum_varargs - 可变参数求和</span></span>
<span class="line"><span>; 输入: [ebp+8] = count, [ebp+12..] = values</span></span>
<span class="line"><span>; 输出: EAX = sum</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>sum_varargs:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span>    push esi                ; 保存 callee-saved</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov ecx, [ebp+8]       ; count</span></span>
<span class="line"><span>    xor eax, eax            ; sum = 0</span></span>
<span class="line"><span>    lea esi, [ebp+12]      ; 第一个值的地址</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.sum_loop:</span></span>
<span class="line"><span>    test ecx, ecx</span></span>
<span class="line"><span>    jz .sum_done</span></span>
<span class="line"><span>    add eax, [esi]          ; sum += *ptr</span></span>
<span class="line"><span>    add esi, 4              ; ptr++</span></span>
<span class="line"><span>    dec ecx</span></span>
<span class="line"><span>    jmp .sum_loop</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.sum_done:</span></span>
<span class="line"><span>    pop esi</span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实战-交换两个变量的值" tabindex="-1"><a class="header-anchor" href="#实战-交换两个变量的值"><span>实战：交换两个变量的值</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; swap.asm - 通过指针参数交换两个变量</span></span>
<span class="line"><span>; 演示&quot;传址&quot;参数传递</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    x dd 100</span></span>
<span class="line"><span>    y dd 200</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    ; 调用 swap(&amp;x, &amp;y)</span></span>
<span class="line"><span>    push dword y            ; &amp;y</span></span>
<span class="line"><span>    push dword x            ; &amp;x</span></span>
<span class="line"><span>    call swap</span></span>
<span class="line"><span>    add esp, 8</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 现在 x=200, y=100</span></span>
<span class="line"><span>    mov ebx, [x]            ; EBX = 200</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; swap - 交换两个整数</span></span>
<span class="line"><span>; 输入: [ebp+8] = &amp;a, [ebp+12] = &amp;b</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>swap:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov eax, [ebp+8]       ; eax = &amp;a</span></span>
<span class="line"><span>    mov ecx, [ebp+12]      ; ecx = &amp;b</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov edx, [eax]          ; edx = *a</span></span>
<span class="line"><span>    xchg edx, [ecx]         ; edx ↔ *b</span></span>
<span class="line"><span>    mov [eax], edx          ; *a = 原 *b</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实战-gcd-最大公约数" tabindex="-1"><a class="header-anchor" href="#实战-gcd-最大公约数"><span>实战：GCD 最大公约数</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; gcd.asm - 欧几里得算法求最大公约数</span></span>
<span class="line"><span>; 编译: nasm -f elf32 gcd.asm -o gcd.o</span></span>
<span class="line"><span>; 链接: gcc -m32 gcd.o -o gcd -nostdlib</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    a dd 48</span></span>
<span class="line"><span>    b dd 18</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    push dword [b]</span></span>
<span class="line"><span>    push dword [a]</span></span>
<span class="line"><span>    call gcd</span></span>
<span class="line"><span>    add esp, 8</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; EAX = GCD(48, 18) = 6</span></span>
<span class="line"><span>    mov ebx, eax</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; gcd - 欧几里得算法（迭代）</span></span>
<span class="line"><span>; 输入: [ebp+8] = a, [ebp+12] = b</span></span>
<span class="line"><span>; 输出: EAX = gcd(a, b)</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>gcd:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov eax, [ebp+8]       ; a</span></span>
<span class="line"><span>    mov ecx, [ebp+12]      ; b</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.gcd_loop:</span></span>
<span class="line"><span>    test ecx, ecx</span></span>
<span class="line"><span>    jz .gcd_done           ; b == 0 → 返回 a</span></span>
<span class="line"><span>    xor edx, edx</span></span>
<span class="line"><span>    div ecx                 ; EAX = a/b, EDX = a%b</span></span>
<span class="line"><span>    mov eax, ecx            ; a = b</span></span>
<span class="line"><span>    mov ecx, edx            ; b = a%b</span></span>
<span class="line"><span>    jmp .gcd_loop</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.gcd_done:</span></span>
<span class="line"><span>    ; EAX 已经是 GCD</span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>验证：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">./gcd</span><span style="color:#ABB2BF;">; </span><span style="color:#56B6C2;">echo</span><span style="color:#E5C07B;"> $?</span><span style="color:#7F848E;font-style:italic;">    # 输出 6 (GCD(48,18)=6)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2>`,11),a(p,{code:`eJxNkMtOwlAQhvc8xSwh0RAvIboEYeGGkBITtiZuXCDG+ADlIq0VKAGUgrXpShsSWowLQVv7Mp1Dz1t4aA/RxWzm+yfzzVQvry6q59cJgJta7TaZxHeRNi1UNSqpwbKHaoM8LlIpxgH+s6gBQEw5WCoot+ldF8pnOSiUSztFDqk4DX0JCrnSbhFC26djezumz1B+wbcH7DwRzUGjifoPii7HKHlsa+iP8NkIpRkqFh2JxKnHFpFS4JpUHPD8wX7gdSMX12SYRT5QXuDnK+eZww1Hp4VzDScWTwn507RQZpWvpIUTVkdp4ZhPxLuZERSyjGQrUX99vyK2gvoXmTg8uP4eEqMVeMN4Aui0H45V0pHoQN5eozrsZ7H2RpLWu9hr/z0QnRX1+rCXwfk4VBqJX2oJxaY=`}),c[6]||=n(`<div class="hint-container tip"><p class="hint-container-title">面试要点</p><ul><li>局部变量在栈上分配，通过 [EBP-N] 访问，函数返回时自动释放</li><li>32 位 cdecl 参数从右到左压栈，调用者清理；64 位前 6 参数通过寄存器传递</li><li>未初始化的局部变量值不确定（栈上残留数据）</li><li>64 位函数调用要求栈 16 字节对齐，否则 SSE 指令会崩溃</li><li>结构体返回值通过隐藏指针参数实现</li><li>传值无法修改实参，传址（指针）才能修改——汇编中通过传递地址实现</li></ul></div><div class="hint-container info"><p class="hint-container-title">原著参考</p><p>本章内容参考自《汇编语言：基于Linux环境（第3版）》Jeff Duntemann 第10章&quot;Decking Out the Procedures&quot;及第11章&quot;Strings and Things&quot;。书中深入讲解了局部变量管理和参数传递的各种技巧。</p></div>`,2)])}var d=s(l,[[`render`,u]]);export{c as _pageData,d as default};