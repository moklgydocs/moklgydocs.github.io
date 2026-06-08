import{A as e,E as t,d as n,f as r,l as i,p as a,s as o}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as s}from"./app-DzSRHLA0.js";var c=JSON.parse(`{"path":"/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%AD%A6%E7%A7%91/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80/03_%E8%BF%87%E7%A8%8B%E4%B8%8E%E6%A0%88/03_%E9%80%92%E5%BD%92.html","title":"递归","lang":"zh-CN","frontmatter":{"title":"递归","icon":"fa6-solid:rotate","order":3,"category":["计算机学科","汇编语言"],"tag":["递归"]},"git":{"createdTime":1780564101000,"updatedTime":1780564101000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":7.17,"words":2150},"filePathRelative":"计算机学科/汇编语言/03_过程与栈/03_递归.md"}`),l={name:`03_递归.md`};function u(s,c,l,u,d,f){let p=e(`Mermaid`);return t(),i(`div`,null,[c[0]||=o(`h1`,{id:`递归`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#递归`},[o(`span`,null,`递归`)])],-1),c[1]||=o(`h2`,{id:`递归的底层机制-栈的叠加`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#递归的底层机制-栈的叠加`},[o(`span`,null,`递归的底层机制：栈的叠加`)])],-1),c[2]||=o(`p`,null,[r(`递归在高级语言中看似优雅——函数调用自身。但在底层，每次递归调用都创建一个`),o(`strong`,null,`全新的栈帧`),r(`，层层叠加，直到基准条件触发后逐层返回。`)],-1),c[3]||=o(`p`,null,`如果把递归比作俄罗斯套娃，栈帧就是一层层的娃娃壳——最外层打开后里面还有一个，直到最小的那个（基准条件），然后一层层合上返回。`,-1),a(p,{code:`eJxLy8kvT85ILCpRCHHiUgACx2iltMTkkvyizMQcDVNNpVgFXV07BSdkUROgKFitE1jOGVnOGCbnDJZzQZYzgsm5gOVckeUMYXKuYDm3aKUX+6c8nT1PwRAq7gYWd49WMjw83cjWCCrqDhb1iFYyOjzd2NYMKuoBFvWMVjI7PN3E1sgEKuwJFvYCKjY5PN3U1tDIACgBABqdQwk=`}),c[4]||=o(`h2`,{id:`递归的栈帧变化`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#递归的栈帧变化`},[o(`span`,null,`递归的栈帧变化`)])],-1),c[5]||=o(`p`,null,[r(`调用 `),o(`code`,null,`factorial(5)`),r(` 时栈帧的生长和收缩：`)],-1),a(p,{code:`eJwrTi0sTc1LTnXJTEwvSszlUgCCgsSikszkzILEvBKFYIXEYoVnCzrAEn75JakK+WWpRQrBVgppickl+UWZiTkappoKT/u6CSgyIUaRMTGKjIhRZEikohf7pzydPU/B8P2enqd7dhK2GareiCj1QO9A1ZsRpR4YRjDzTYjSAAx5mAeMDBA6AGxZt3E=`}),c[6]||=n(`<div class="hint-container important"><p class="hint-container-title">递归的内存代价</p><p>每次递归调用至少消耗 8 字节（EBP + 返回地址），加上参数和局部变量。如果递归深度为 N，栈消耗至少 O(N)。<strong>栈溢出</strong>是递归最常见的问题——Linux 默认栈大小约 8MB，深度过大会导致栈溢出崩溃。</p></div><h2 id="经典递归-阶乘" tabindex="-1"><a class="header-anchor" href="#经典递归-阶乘"><span>经典递归：阶乘</span></a></h2><h3 id="递归实现" tabindex="-1"><a class="header-anchor" href="#递归实现"><span>递归实现</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; factorial_rec.asm - 递归版阶乘</span></span>
<span class="line"><span>; 编译: nasm -f elf32 factorial_rec.asm -o factorial_rec.o</span></span>
<span class="line"><span>; 链接: gcc -m32 factorial_rec.o -o factorial_rec -nostdlib</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    n dd 5                      ; 计算 5!</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    push dword [n]              ; 参数 n</span></span>
<span class="line"><span>    call factorial</span></span>
<span class="line"><span>    add esp, 4                  ; 清理参数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; EAX = 120 (5!)</span></span>
<span class="line"><span>    mov ebx, eax</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; factorial - 递归计算阶乘</span></span>
<span class="line"><span>; 输入: [ebp+8] = n</span></span>
<span class="line"><span>; 输出: EAX = n!</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>factorial:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov eax, [ebp+8]           ; n</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 基准条件: n &lt;= 1</span></span>
<span class="line"><span>    cmp eax, 1</span></span>
<span class="line"><span>    jle .base_case</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 递归: factorial(n-1)</span></span>
<span class="line"><span>    dec eax</span></span>
<span class="line"><span>    push eax                   ; 参数 n-1</span></span>
<span class="line"><span>    call factorial</span></span>
<span class="line"><span>    add esp, 4                 ; 清理参数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 乘以 n: result = n * factorial(n-1)</span></span>
<span class="line"><span>    imul eax, [ebp+8]         ; EAX = factorial(n-1) * n</span></span>
<span class="line"><span>    jmp .fact_done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.base_case:</span></span>
<span class="line"><span>    mov eax, 1                 ; 0! = 1! = 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.fact_done:</span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="栈帧详解-factorial-3" tabindex="-1"><a class="header-anchor" href="#栈帧详解-factorial-3"><span>栈帧详解：factorial(3)</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>调用 factorial(3) 时的栈帧叠加：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>┌────────────────────┐ ← 高地址</span></span>
<span class="line"><span>│  参数 n=3          │</span></span>
<span class="line"><span>│  返回地址 → _start │</span></span>
<span class="line"><span>│  保存的 EBP        │</span></span>
<span class="line"><span>│  参数 n=2          │</span></span>
<span class="line"><span>│  返回地址 → fact   │</span></span>
<span class="line"><span>│  保存的 EBP        │</span></span>
<span class="line"><span>│  参数 n=1          │</span></span>
<span class="line"><span>│  返回地址 → fact   │</span></span>
<span class="line"><span>│  保存的 EBP ← EBP  │</span></span>
<span class="line"><span>└────────────────────┘ ← 低地址 (ESP)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="经典递归-斐波那契数列" tabindex="-1"><a class="header-anchor" href="#经典递归-斐波那契数列"><span>经典递归：斐波那契数列</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; fib_rec.asm - 递归版斐波那契</span></span>
<span class="line"><span>; 注意：递归版效率极低，仅作教学演示</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    n dd 8                      ; 计算 F(8) = 21</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    push dword [n]</span></span>
<span class="line"><span>    call fib</span></span>
<span class="line"><span>    add esp, 4</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov ebx, eax</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; fib - 递归计算斐波那契数</span></span>
<span class="line"><span>; 输入: [ebp+8] = n</span></span>
<span class="line"><span>; 输出: EAX = F(n)</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>fib:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov ecx, [ebp+8]           ; n</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 基准条件</span></span>
<span class="line"><span>    cmp ecx, 0</span></span>
<span class="line"><span>    je .fib_zero</span></span>
<span class="line"><span>    cmp ecx, 1</span></span>
<span class="line"><span>    je .fib_one</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; fib(n-1)</span></span>
<span class="line"><span>    lea eax, [ecx-1]</span></span>
<span class="line"><span>    push eax</span></span>
<span class="line"><span>    call fib</span></span>
<span class="line"><span>    add esp, 4</span></span>
<span class="line"><span>    push eax                   ; 保存 fib(n-1) 的结果</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; fib(n-2)</span></span>
<span class="line"><span>    lea eax, [ecx-2]</span></span>
<span class="line"><span>    push eax</span></span>
<span class="line"><span>    call fib</span></span>
<span class="line"><span>    add esp, 4</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; EAX = fib(n-2), 栈顶 = fib(n-1)</span></span>
<span class="line"><span>    pop edx                    ; EDX = fib(n-1)</span></span>
<span class="line"><span>    add eax, edx               ; EAX = fib(n-1) + fib(n-2)</span></span>
<span class="line"><span>    jmp .fib_done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.fib_zero:</span></span>
<span class="line"><span>    xor eax, eax               ; F(0) = 0</span></span>
<span class="line"><span>    jmp .fib_done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.fib_one:</span></span>
<span class="line"><span>    mov eax, 1                 ; F(1) = 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.fib_done:</span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">递归斐波那契的指数级复杂度</p><p>递归版斐波那契的时间复杂度是 O(2^n)！F(5) 会计算 F(4) 和 F(3)，F(4) 又计算 F(3) 和 F(2)……大量重复计算。这是递归的经典反面教材——<strong>能用迭代就用迭代</strong>。</p></div><h2 id="递归-vs-迭代的栈对比" tabindex="-1"><a class="header-anchor" href="#递归-vs-迭代的栈对比"><span>递归 vs 迭代的栈对比</span></a></h2>`,10),a(p,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggyFlw2Tnu6d9Lyz4+WMbU92zgBLgkCQYbRSWmJySX5RZmKOhqmmwtO+7mcLOpRiESqMkFWYYFNhjKzCGJsKE2QVRthUmCKrMNRUeLF/ytPZ85BVmEUrvWyY8HRj09M9O4Gagb54tnkqVEFqXgqqf1/sX/tk92JM/3oC/VuUWlyaU2JriGS4J9CTT/etet633vTZmoUoRoOlgT58uq7nWccENPuCDBV0de2AYQShjCGUCYQyhVBmYJWeEJWeEJWexlwAKJ+RhA==`}),c[7]||=n(`<table><thead><tr><th>特性</th><th>递归</th><th>迭代</th></tr></thead><tbody><tr><td>栈空间</td><td>O(N)</td><td>O(1)</td></tr><tr><td>时间复杂度</td><td>可能含重复计算</td><td>通常更优</td></tr><tr><td>代码可读性</td><td>对数学定义直观</td><td>需要手动管理状态</td></tr><tr><td>栈溢出风险</td><td>高</td><td>低</td></tr><tr><td>性能</td><td>函数调用开销大</td><td>循环开销小</td></tr></tbody></table><h2 id="尾递归优化" tabindex="-1"><a class="header-anchor" href="#尾递归优化"><span>尾递归优化</span></a></h2><p><strong>尾递归</strong>（Tail Recursion）是指递归调用是函数的最后一个操作，返回值直接是递归调用的结果。编译器可以将尾递归优化为循环，避免栈增长。</p><h3 id="普通递归-vs-尾递归" tabindex="-1"><a class="header-anchor" href="#普通递归-vs-尾递归"><span>普通递归 vs 尾递归</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 普通递归（非尾递归）: factorial(n)</span></span>
<span class="line"><span>; 返回前还需要做乘法，不是最后一个操作</span></span>
<span class="line"><span>factorial:</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    push eax</span></span>
<span class="line"><span>    call factorial             ; 递归调用</span></span>
<span class="line"><span>    add esp, 4</span></span>
<span class="line"><span>    imul eax, [ebp+8]         ; ← 递归调用后还有操作！不是尾递归</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 尾递归版: factorial(n, accumulator)</span></span>
<span class="line"><span>; 递归调用是最后操作，无需返回后再计算</span></span>
<span class="line"><span>factorial_tail:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov eax, [ebp+8]          ; n</span></span>
<span class="line"><span>    mov ecx, [ebp+12]         ; acc</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    cmp eax, 1</span></span>
<span class="line"><span>    jle .tail_base</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 递归调用: factorial_tail(n-1, n*acc)</span></span>
<span class="line"><span>    imul ecx, eax             ; acc = n * acc</span></span>
<span class="line"><span>    dec eax                   ; n = n - 1</span></span>
<span class="line"><span>    push ecx                  ; 新 acc</span></span>
<span class="line"><span>    push eax                  ; 新 n</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov esp, ebp              ; ← 关键：复用当前栈帧！</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ; 直接跳转而非调用，不压入新返回地址</span></span>
<span class="line"><span>    jmp factorial_tail        ; 尾调用优化</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.tail_base:</span></span>
<span class="line"><span>    mov eax, ecx              ; 返回 acc</span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),a(p,{code:`eJxd0D0OgjAYxvHdUzRMmtRECrppovJpnFyJA6LIYNQgxpUzsBg9hPECungWTLiF9G2rrR3/vw7tE292pygJ0wxNZw1Un8NxsU7DfYLel1uVX6u8KB8FCD3DQIvDKGt2W9octdsDNOLBrMP31ghozMmQaQxkcSIyWUA2J10mG8gJNF2KDkQ30F5nImUXskezIWUPsk+zKWUf8oTmbl8nHU6r7VJdo7w//6cgYgtM38rWEM3EdKHfIIQtItjApKOswtwSTnBPcYu5LVzH9VOVgdgFp76gfuIDDWZyUw==`}),c[8]||=n(`<div class="hint-container tip"><p class="hint-container-title">尾递归优化的本质</p><p>尾递归优化将递归调用 <code>call + ret</code> 替换为 <code>jmp</code>，不压入新的返回地址，复用当前栈帧。这样栈深度始终为 O(1)，与迭代等价。</p><p>注意：NASM 本身不做尾递归优化——需要程序员手动将 <code>call</code> 改为 <code>jmp</code> 并复用栈帧。GCC 等编译器在 <code>-O2</code> 以上会自动做此优化。</p></div><h2 id="经典递归-汉诺塔" tabindex="-1"><a class="header-anchor" href="#经典递归-汉诺塔"><span>经典递归：汉诺塔</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; hanoi.asm - 汉诺塔递归解法</span></span>
<span class="line"><span>; 编译: nasm -f elf32 hanoi.asm -o hanoi.o</span></span>
<span class="line"><span>; 链接: gcc -m32 hanoi.o -o hanoi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    fmt db &#39;Move disk from %d to %d&#39;, 0xA, 0</span></span>
<span class="line"><span>    n    dd 3                      ; 3 个盘子</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    extern printf</span></span>
<span class="line"><span>    global main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>main:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; hanoi(3, 1, 3, 2) — 从柱1移到柱3，借助柱2</span></span>
<span class="line"><span>    push dword 2               ; auxiliary</span></span>
<span class="line"><span>    push dword 3               ; to</span></span>
<span class="line"><span>    push dword 1               ; from</span></span>
<span class="line"><span>    push dword [n]             ; n</span></span>
<span class="line"><span>    call hanoi</span></span>
<span class="line"><span>    add esp, 16</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    xor eax, eax</span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; hanoi - 汉诺塔递归</span></span>
<span class="line"><span>; 输入: [ebp+8]=n, [ebp+12]=from, [ebp+16]=to, [ebp+20]=aux</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>hanoi:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span>    push ebx                   ; 保存 callee-saved</span></span>
<span class="line"><span>    push esi</span></span>
<span class="line"><span>    push edi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov eax, [ebp+8]          ; n</span></span>
<span class="line"><span>    cmp eax, 1</span></span>
<span class="line"><span>    je .hanoi_base</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; hanoi(n-1, from, aux, to)</span></span>
<span class="line"><span>    mov ecx, [ebp+16]         ; to → 作为 aux</span></span>
<span class="line"><span>    push ecx</span></span>
<span class="line"><span>    mov ecx, [ebp+20]         ; aux → 作为 to</span></span>
<span class="line"><span>    push ecx</span></span>
<span class="line"><span>    mov ecx, [ebp+12]         ; from</span></span>
<span class="line"><span>    push ecx</span></span>
<span class="line"><span>    dec eax</span></span>
<span class="line"><span>    push eax</span></span>
<span class="line"><span>    call hanoi</span></span>
<span class="line"><span>    add esp, 16</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 移动最底下的盘子: from → to</span></span>
<span class="line"><span>    push dword [ebp+16]       ; to</span></span>
<span class="line"><span>    push dword [ebp+12]       ; from</span></span>
<span class="line"><span>    push fmt</span></span>
<span class="line"><span>    call printf</span></span>
<span class="line"><span>    add esp, 12</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; hanoi(n-1, aux, to, from)</span></span>
<span class="line"><span>    mov ecx, [ebp+12]         ; from → 作为 aux</span></span>
<span class="line"><span>    push ecx</span></span>
<span class="line"><span>    mov ecx, [ebp+16]         ; to</span></span>
<span class="line"><span>    push ecx</span></span>
<span class="line"><span>    mov ecx, [ebp+20]         ; aux → 作为 from</span></span>
<span class="line"><span>    push ecx</span></span>
<span class="line"><span>    mov eax, [ebp+8]</span></span>
<span class="line"><span>    dec eax</span></span>
<span class="line"><span>    push eax</span></span>
<span class="line"><span>    call hanoi</span></span>
<span class="line"><span>    add esp, 16</span></span>
<span class="line"><span>    jmp .hanoi_done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.hanoi_base:</span></span>
<span class="line"><span>    ; 只有一个盘子，直接移动</span></span>
<span class="line"><span>    push dword [ebp+16]       ; to</span></span>
<span class="line"><span>    push dword [ebp+12]       ; from</span></span>
<span class="line"><span>    push fmt</span></span>
<span class="line"><span>    call printf</span></span>
<span class="line"><span>    add esp, 12</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.hanoi_done:</span></span>
<span class="line"><span>    pop edi</span></span>
<span class="line"><span>    pop esi</span></span>
<span class="line"><span>    pop ebx</span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实战-用-gdb-跟踪递归" tabindex="-1"><a class="header-anchor" href="#实战-用-gdb-跟踪递归"><span>实战：用 GDB 跟踪递归</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">gdb</span><span style="color:#98C379;"> ./factorial_rec</span></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">gdb</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">break</span><span style="color:#98C379;"> factorial</span></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">gdb</span><span style="color:#ABB2BF;">) </span><span style="color:#61AFEF;">run</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第1次命中: factorial(5)</span></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">gdb</span><span style="color:#ABB2BF;">) </span><span style="color:#56B6C2;">print</span><span style="color:#E5C07B;"> *</span><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">int*</span><span style="color:#ABB2BF;">)(</span><span style="color:#E06C75;">$ebp</span><span style="color:#ABB2BF;">+8)</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#ABB2BF;"> = 5</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">gdb</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">continue</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第2次命中: factorial(4)</span></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">gdb</span><span style="color:#ABB2BF;">) </span><span style="color:#56B6C2;">print</span><span style="color:#E5C07B;"> *</span><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">int*</span><span style="color:#ABB2BF;">)(</span><span style="color:#E06C75;">$ebp</span><span style="color:#ABB2BF;">+8)</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#ABB2BF;"> = 4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看调用栈</span></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">gdb</span><span style="color:#ABB2BF;">) </span><span style="color:#61AFEF;">backtrace</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#0  factorial at factorial_rec.asm:20</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#1  0x08048356 in factorial at factorial_rec.asm:28</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#2  0x08048356 in factorial at factorial_rec.asm:28</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#3  0x08048356 in factorial at factorial_rec.asm:28</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#4  0x08048356 in factorial at factorial_rec.asm:28</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#5  0x080483d0 in _start at factorial_rec.asm:12</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看每一层的参数</span></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">gdb</span><span style="color:#ABB2BF;">) </span><span style="color:#61AFEF;">frame</span><span style="color:#D19A66;"> 4</span></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">gdb</span><span style="color:#ABB2BF;">) </span><span style="color:#56B6C2;">print</span><span style="color:#E5C07B;"> *</span><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">int*</span><span style="color:#ABB2BF;">)(</span><span style="color:#E06C75;">$ebp</span><span style="color:#ABB2BF;">+8)</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">$3</span><span style="color:#ABB2BF;"> = 5    </span><span style="color:#7F848E;font-style:italic;"># 最外层 factorial(5)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2>`,6),a(p,{code:`eJxFj09OwlAQxvec4i3brTcw7gxGT2Bi4sYFYIwHQIgUFag22NaIsX8kaGJLiaapr1buYt5M+27Bo/SFZBYz85tvZr7GWfO0cXJeI+Si1bpUFN42IDNUVTQIwQmFflymopjr+OkWUTcfv6MZQUrR6UMyk7gsYNFZh+7ArVMBeKWg9fDFZWkMVxMMvM2NEuepDtcJt0Lu2dU8t2P2Y5NDpamKnXK7eY9fHu/4MH0gONDwMUIr5ta35IubYk7BHQvdzrFQBtOSsF8bBqb8JPrbnCb/PYMUy4ClfoWEp/2DI3xeitbebr0uFW/DtdutT+6P+NPH1jJSDzQqP9eGQlCEbh5acqQ9K7oZy0YsuautAP+Rs1g=`}),c[9]||=n(`<div class="hint-container tip"><p class="hint-container-title">面试要点</p><ul><li>递归在底层通过栈帧叠加实现，每次调用消耗 O(1) 栈空间，总深度 O(N)</li><li>递归必须有基准条件（Base Case），否则无限递归导致栈溢出</li><li>尾递归优化：将 <code>call</code> 改为 <code>jmp</code> + 复用栈帧，使栈深度降为 O(1)</li><li>递归版斐波那契时间复杂度 O(2^n)，实际应用中应使用迭代或记忆化</li><li>Linux 默认栈大小约 8MB，可用 <code>ulimit -s</code> 查看/修改</li></ul></div><div class="hint-container info"><p class="hint-container-title">原著参考</p><p>本章内容参考自《汇编语言：基于Linux环境（第3版）》Jeff Duntemann 第10章&quot;Decking Out the Procedures&quot;。书中对过程调用的深入讲解为理解递归的栈帧机制奠定了基础。</p></div>`,2)])}var d=s(l,[[`render`,u]]);export{c as _pageData,d as default};