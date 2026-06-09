import{A as e,E as t,d as n,f as r,l as i,p as a,s as o}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as s}from"./app-DCZUiBeJ.js";var c=JSON.parse(`{"path":"/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%AD%A6%E7%A7%91/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80/03_%E8%BF%87%E7%A8%8B%E4%B8%8E%E6%A0%88/01_%E6%A0%88%E5%B8%A7%E4%B8%8E%E8%BF%87%E7%A8%8B%E8%B0%83%E7%94%A8.html","title":"栈帧与过程调用","lang":"zh-CN","frontmatter":{"title":"栈帧与过程调用","icon":"fa6-solid:layer-group","order":1,"category":["计算机学科","汇编语言"],"tag":["栈"]},"git":{"createdTime":1780564101000,"updatedTime":1780564101000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":6.65,"words":1994},"filePathRelative":"计算机学科/汇编语言/03_过程与栈/01_栈帧与过程调用.md"}`),l={name:`01_栈帧与过程调用.md`};function u(s,c,l,u,d,f){let p=e(`Mermaid`);return t(),i(`div`,null,[c[0]||=n(`<h1 id="栈帧与过程调用" tabindex="-1"><a class="header-anchor" href="#栈帧与过程调用"><span>栈帧与过程调用</span></a></h1><h2 id="函数调用的底层真相" tabindex="-1"><a class="header-anchor" href="#函数调用的底层真相"><span>函数调用的底层真相</span></a></h2><p>在 C 语言中写 <code>result = add(3, 5)</code> 只是一行代码，但在 CPU 层面，这行代码引发了一连串精密的操作：保存当前执行位置、传递参数、跳转、执行、返回结果、恢复现场。这一切都依赖<strong>栈</strong>和<strong>栈帧</strong>机制。</p><p>如果把函数调用比作寄信，栈帧就是信封——上面写着寄信人地址（返回地址）、信件内容（参数和局部变量），确保信件能准确送达和回复。</p>`,4),a(p,{code:`eJx1kE1Kw1AUheddxV1A3UAHBasBB9UGY50/QpBgLTWJ82iJSe1PQKMWtKJFTaEIEQeKbe1mcl+TUbdgfhBpm7zRG3zn45wrC8cnQpUXNkVyIJGjDASvRiRF5MUaqSrAk0pFkIDI4Dn1mTXwVG2FkRXCH4YIfTSSBUIk6A8XHbF7LZ+PBDlgy9wWoHlGr5352HBHHTQ/0HDw83U+biQmNtaLRcBOE7UXb2rh3QPeO9hT/1lhyc4UWHCnPXzr0lsbv2za0v3LuPQyv13aD/EsMBwLOPqeDZv0xgkmBrHEAFcuhGwWdgCNc19r47vq1wdodn3dXEzEnxzQhu09tVCfBJPdyVV6j1Abdvf1C2r9pIv/tpbYCKenfXxup0+N75mDXWYP4gNmfgFcNOKq`}),c[1]||=o(`h2`,{id:`栈的工作原理`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#栈的工作原理`},[o(`span`,null,`栈的工作原理`)])],-1),c[2]||=o(`h3`,{id:`栈的生长方向`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#栈的生长方向`},[o(`span`,null,`栈的生长方向`)])],-1),c[3]||=o(`p`,null,[r(`x86 的栈向`),o(`strong`,null,`低地址方向增长`),r(`：`)],-1),a(p,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggyFZws6nra1Pl07AywMAimZRanJJZn5eQpOIXBBj2ill6tnPJ2z4encBgWDCjcg0AMCpVi4Csdopaf9Tc+mbjBCEnSCCRoiCTpHK73YP+Xp7HkQ45BkXKKVnuyfC3TM81ktCq5OAQqP2iaA6Wc97U8nTHyxf+bL9h4k9a5A4zc2vGxe8bR/xsv2fmRL3FCljCBGBeM0ygdo9d4+FBel5qVwAQD5HXf2`}),c[4]||=n(`<div class="hint-container important"><p class="hint-container-title">栈的双指针</p><ul><li><strong>ESP（栈指针）</strong>：始终指向栈顶（最后压入的数据），随 PUSH/POP 自动移动</li><li><strong>EBP（帧指针）</strong>：指向当前栈帧的固定基准点，函数执行期间不变</li></ul></div><h3 id="为什么需要-ebp" tabindex="-1"><a class="header-anchor" href="#为什么需要-ebp"><span>为什么需要 EBP？</span></a></h3><p>ESP 在函数执行过程中会不断变化（PUSH/POP），而参数和局部变量需要稳定的访问基准。EBP 就是这个&quot;锚点&quot;：</p><ul><li>参数通过 <code>[EBP + 8]</code>、<code>[EBP + 12]</code> 等正偏移访问</li><li>局部变量通过 <code>[EBP - 4]</code>、<code>[EBP - 8]</code> 等负偏移访问</li></ul><h2 id="call-和-ret-指令" tabindex="-1"><a class="header-anchor" href="#call-和-ret-指令"><span>CALL 和 RET 指令</span></a></h2><h3 id="call-调用函数" tabindex="-1"><a class="header-anchor" href="#call-调用函数"><span>CALL - 调用函数</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>call my_function     ; 等价于: push eip_next; jmp my_function</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>CALL 做两件事：</p><ol><li>将下一条指令的地址（返回地址）压入栈中</li><li>跳转到目标函数</li></ol><h3 id="ret-返回调用者" tabindex="-1"><a class="header-anchor" href="#ret-返回调用者"><span>RET - 返回调用者</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>ret                  ; 等价于: pop eip; jmp eip</span></span>
<span class="line"><span>ret 8                ; 返回并清理 8 字节参数（stdcall 约定）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>RET 从栈顶弹出返回地址，跳转回去。</p><h2 id="函数调用的标准流程" tabindex="-1"><a class="header-anchor" href="#函数调用的标准流程"><span>函数调用的标准流程</span></a></h2><h3 id="调用者-caller-的职责" tabindex="-1"><a class="header-anchor" href="#调用者-caller-的职责"><span>调用者（Caller）的职责</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 1. 保存调用者保存的寄存器（如果需要）</span></span>
<span class="line"><span>push eax             ; 可选：保存 EAX</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 2. 压入参数（从右到左，cdecl 约定）</span></span>
<span class="line"><span>push dword 5         ; 第二个参数</span></span>
<span class="line"><span>push dword 3         ; 第一个参数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 3. 调用函数</span></span>
<span class="line"><span>call add_numbers</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 4. 清理参数（cdecl 由调用者清理）</span></span>
<span class="line"><span>add esp, 8           ; 2 个参数 × 4 字节 = 8</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 5. 使用返回值（EAX 中）</span></span>
<span class="line"><span>; EAX = add_numbers 的返回值</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 6. 恢复调用者保存的寄存器</span></span>
<span class="line"><span>pop eax              ; 可选：恢复 EAX</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="被调用者-callee-的职责" tabindex="-1"><a class="header-anchor" href="#被调用者-callee-的职责"><span>被调用者（Callee）的职责</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>add_numbers:</span></span>
<span class="line"><span>    ; =========== 序言 (Prologue) ===========</span></span>
<span class="line"><span>    push ebp                ; 保存调用者的帧指针</span></span>
<span class="line"><span>    mov ebp, esp            ; 建立新栈帧</span></span>
<span class="line"><span>    sub esp, 8              ; 分配局部变量空间（2个4字节变量）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; =========== 函数体 ===========</span></span>
<span class="line"><span>    ; 访问参数: [ebp+8] = 第1个参数, [ebp+12] = 第2个参数</span></span>
<span class="line"><span>    mov eax, [ebp+8]        ; 取出参数1</span></span>
<span class="line"><span>    add eax, [ebp+12]       ; 加上参数2</span></span>
<span class="line"><span>    ; EAX 现在是返回值</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; =========== 结语 (Epilogue) ===========</span></span>
<span class="line"><span>    mov esp, ebp            ; 释放局部变量</span></span>
<span class="line"><span>    pop ebp                 ; 恢复调用者的帧指针</span></span>
<span class="line"><span>    ret                     ; 返回</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="栈帧布局详解" tabindex="-1"><a class="header-anchor" href="#栈帧布局详解"><span>栈帧布局详解</span></a></h2><p>调用 <code>add_numbers(3, 5)</code> 后的栈帧：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>高地址</span></span>
<span class="line"><span>┌──────────────────┐</span></span>
<span class="line"><span>│    参数2: 5       │ [EBP + 12]</span></span>
<span class="line"><span>├──────────────────┤</span></span>
<span class="line"><span>│    参数1: 3       │ [EBP + 8]</span></span>
<span class="line"><span>├──────────────────┤</span></span>
<span class="line"><span>│    返回地址       │ [EBP + 4]</span></span>
<span class="line"><span>├──────────────────┤</span></span>
<span class="line"><span>│    保存的 EBP     │ [EBP] ← EBP 指向这里</span></span>
<span class="line"><span>├──────────────────┤</span></span>
<span class="line"><span>│  局部变量1        │ [EBP - 4]</span></span>
<span class="line"><span>├──────────────────┤</span></span>
<span class="line"><span>│  局部变量2        │ [EBP - 8] ← ESP 指向这里</span></span>
<span class="line"><span>└──────────────────┘</span></span>
<span class="line"><span>低地址</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,20),a(p,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggyFZws6nu5Y/nRH89ONDWAZEEjJLEpNLsnMz1NwCoELBhhFKz3tb3o2dYORlYKpQrSrU4C2oVGsUixChSFMhaGVgjFEhQWygiDHaKUX+6c8nT3v6ZwNT+c2QJSYICsJdo1WerJ/7tO1M57PagHKgpUgK/AJA9myseFl84qn/TNetvcbgpXoopjiEwZyLJIiI4giuGtS81LANFAwWglkzaO2SUqxCrq6dkAXQGSCQTLByDJAU7kAqTFsvg==`}),c[5]||=n(`<div class="hint-container tip"><p class="hint-container-title">偏移量速记</p><ul><li>返回地址在 <code>[EBP + 4]</code>（EBP 上方第一个位置）</li><li>第一个参数在 <code>[EBP + 8]</code>（跳过 EBP 和返回地址）</li><li>局部变量在 <code>[EBP - N]</code>（EBP 下方）</li></ul></div><h2 id="调用约定" tabindex="-1"><a class="header-anchor" href="#调用约定"><span>调用约定</span></a></h2><h3 id="cdecl-c-默认调用约定" tabindex="-1"><a class="header-anchor" href="#cdecl-c-默认调用约定"><span>cdecl（C 默认调用约定）</span></a></h3><table><thead><tr><th>规则</th><th>说明</th></tr></thead><tbody><tr><td>参数传递</td><td>从右到左压栈</td></tr><tr><td>栈清理</td><td><strong>调用者</strong>负责（<code>add esp, N</code>）</td></tr><tr><td>返回值</td><td>存入 EAX</td></tr><tr><td>调用者保存</td><td>EAX, ECX, EDX</td></tr><tr><td>被调用者保存</td><td>EBX, ESI, EDI, EBP</td></tr></tbody></table><h3 id="stdcall-windows-api-使用" tabindex="-1"><a class="header-anchor" href="#stdcall-windows-api-使用"><span>stdcall（Windows API 使用）</span></a></h3><table><thead><tr><th>规则</th><th>说明</th></tr></thead><tbody><tr><td>参数传递</td><td>从右到左压栈</td></tr><tr><td>栈清理</td><td><strong>被调用者</strong>负责（<code>ret N</code>）</td></tr><tr><td>返回值</td><td>存入 EAX</td></tr></tbody></table><div class="hint-container warning"><p class="hint-container-title">调用约定不匹配的后果</p><p>如果调用者期望自己清理栈（cdecl），但被调用者用 <code>ret 8</code> 清理了（stdcall），栈指针会偏移 8 字节，导致程序崩溃。混合编程时务必统一调用约定。</p></div><h2 id="寄存器保存规则" tabindex="-1"><a class="header-anchor" href="#寄存器保存规则"><span>寄存器保存规则</span></a></h2>`,8),a(p,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggyFFxuan09Z8aKh9cn+uU/XzlBwTszJSS3SLU4sS00BqwQBV8eIaCUgoaCr8LR//YvmvS8WrQYhhN51z6bsVIpFaHAGaXAmQYMLSIMLcRpS8yBOQ3gCRSXCH6no/nAC2eIEtmV/68uFu581Lnq6pPdp3/ynDXuQXRPsCVQX7ElQnQtInQthdU4BIHsD8KkDeQoAvym7Mg==`}),c[6]||=n(`<p><strong>规则</strong>：</p><ul><li>如果调用者需要保留 EAX/ECX/EDX 的值，调用前自己 PUSH 保存</li><li>被调用者如果使用 EBX/ESI/EDI，必须在使用前 PUSH，返回前 POP 恢复</li></ul><h2 id="实战-完整函数调用示例" tabindex="-1"><a class="header-anchor" href="#实战-完整函数调用示例"><span>实战：完整函数调用示例</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; func_call.asm - 完整的函数调用演示</span></span>
<span class="line"><span>; 编译: nasm -f elf32 func_call.asm -o func_call.o</span></span>
<span class="line"><span>; 链接: gcc -m32 func_call.o -o func_call -nostdlib</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    result dd 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    ; 调用 max(42, 17)</span></span>
<span class="line"><span>    push dword 17            ; 第二个参数（从右到左）</span></span>
<span class="line"><span>    push dword 42            ; 第一个参数</span></span>
<span class="line"><span>    call max</span></span>
<span class="line"><span>    add esp, 8               ; cdecl: 调用者清理参数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov [result], eax        ; 保存返回值（EAX = 42）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 调用 factorial(5)</span></span>
<span class="line"><span>    push dword 5</span></span>
<span class="line"><span>    call factorial</span></span>
<span class="line"><span>    add esp, 4               ; 清理 1 个参数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; EAX = 120 (5!)</span></span>
<span class="line"><span>    mov ebx, eax</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; max - 返回两个整数中的较大值</span></span>
<span class="line"><span>; 输入: [ebp+8] = a, [ebp+12] = b</span></span>
<span class="line"><span>; 输出: EAX = max(a, b)</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>max:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov eax, [ebp+8]         ; a</span></span>
<span class="line"><span>    cmp eax, [ebp+12]        ; a vs b</span></span>
<span class="line"><span>    jge .max_done</span></span>
<span class="line"><span>    mov eax, [ebp+12]        ; b 更大，返回 b</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.max_done:</span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; factorial - 计算阶乘（迭代版）</span></span>
<span class="line"><span>; 输入: [ebp+8] = n</span></span>
<span class="line"><span>; 输出: EAX = n!</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>factorial:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span>    push ebx                 ; 保存 callee-saved 寄存器</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov ecx, [ebp+8]         ; n</span></span>
<span class="line"><span>    mov eax, 1               ; result = 1</span></span>
<span class="line"><span>    mov ebx, 1               ; i = 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.fact_loop:</span></span>
<span class="line"><span>    cmp ebx, ecx</span></span>
<span class="line"><span>    jg .fact_done            ; i &gt; n 结束</span></span>
<span class="line"><span>    imul eax, ebx            ; result *= i</span></span>
<span class="line"><span>    inc ebx                  ; i++</span></span>
<span class="line"><span>    jmp .fact_loop</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.fact_done:</span></span>
<span class="line"><span>    pop ebx                  ; 恢复 EBX</span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实战-用-gdb-检查栈帧" tabindex="-1"><a class="header-anchor" href="#实战-用-gdb-检查栈帧"><span>实战：用 GDB 检查栈帧</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">gdb</span><span style="color:#98C379;"> ./func_call</span></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">gdb</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">break</span><span style="color:#98C379;"> max</span></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">gdb</span><span style="color:#ABB2BF;">) </span><span style="color:#61AFEF;">run</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 max 函数入口处停下</span></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">gdb</span><span style="color:#ABB2BF;">) </span><span style="color:#61AFEF;">info</span><span style="color:#98C379;"> registers</span><span style="color:#98C379;"> ebp</span><span style="color:#98C379;"> esp</span></span>
<span class="line"><span style="color:#61AFEF;">ebp</span><span style="color:#D19A66;">            0xffffd008</span><span style="color:#98C379;">    Esp</span><span style="color:#98C379;"> 指向栈顶</span></span>
<span class="line"><span style="color:#61AFEF;">esp</span><span style="color:#D19A66;">            0xffffd000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看栈帧内容</span></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">gdb</span><span style="color:#ABB2BF;">) </span><span style="color:#61AFEF;">x/4xw</span><span style="color:#E06C75;"> $ebp</span></span>
<span class="line"><span style="color:#61AFEF;">0xffffd008:</span><span style="color:#D19A66;">  0xffffd018</span><span style="color:#D19A66;">  0x08048356</span><span style="color:#D19A66;">  0x0000002a</span><span style="color:#D19A66;">  0x00000011</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#            保存的EBP    返回地址     参数a=42     参数b=17</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证参数</span></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">gdb</span><span style="color:#ABB2BF;">) </span><span style="color:#61AFEF;">print/x</span><span style="color:#E5C07B;"> *</span><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">int*</span><span style="color:#ABB2BF;">)(</span><span style="color:#E06C75;">$ebp</span><span style="color:#ABB2BF;">+8)</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#ABB2BF;"> = 0x2a     </span><span style="color:#7F848E;font-style:italic;"># 42</span></span>
<span class="line"><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">gdb</span><span style="color:#ABB2BF;">) </span><span style="color:#61AFEF;">print/x</span><span style="color:#E5C07B;"> *</span><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">int*</span><span style="color:#ABB2BF;">)(</span><span style="color:#E06C75;">$ebp</span><span style="color:#ABB2BF;">+12)</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#ABB2BF;"> = 0x11     </span><span style="color:#7F848E;font-style:italic;"># 17</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="leave-指令" tabindex="-1"><a class="header-anchor" href="#leave-指令"><span>LEAVE 指令</span></a></h2><p><code>LEAVE</code> 是序言/结语的快捷指令：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 这两行：</span></span>
<span class="line"><span>mov esp, ebp</span></span>
<span class="line"><span>pop ebp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 等价于：</span></span>
<span class="line"><span>leave</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以函数结语可以简化为：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>    leave</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>同理，ENTER 指令可以替代序言，但现代编译器不使用 ENTER（太慢），通常用 <code>push ebp / mov ebp, esp / sub esp, N</code>。</p><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2>`,13),a(p,{code:`eJzLzcxLyU0s4FJQKMrPL9HQeLag4+mO5U929L3Y0Px8ygpNTaCMggKE82xr4/MV3WABmNCLhtanfd1P+5ueTd0AlXB29PEBir3YP+Xp7HlP52x4OrcBpmXRaoSu3bsgVmGRg2hFt+fZjlYkeyCan+5ofroRZjxEVsHVKUDbD6YZyRFgCROoxJP9c5+unfF8VgtQECQBM2Jjw8vmFU/7Z7xs7wcJ60IMgrjh+a5lT9fNgqpMTklNzkFxHNBFULnikpTkxBygLJKfkBQ8Xd8CtPvpzBWwAAOqTS3SLU4sS01RcHWM0Hd1BmKXCGTpVJi0E1Aq2BMoDcRAZwMAg9rKsQ==`}),c[7]||=n(`<div class="hint-container tip"><p class="hint-container-title">面试要点</p><ul><li>函数调用标准流程：序言（push ebp / mov ebp,esp / sub esp,N）→ 函数体 → 结语（leave / ret）</li><li>参数通过 [EBP+8]、[EBP+12] 访问，局部变量通过 [EBP-N] 访问</li><li>cdecl 由调用者清理栈（add esp,N），stdcall 由被调用者清理（ret N）</li><li>CALL = PUSH 返回地址 + JMP，RET = POP 返回地址 + JMP</li><li>调用者保存 EAX/ECX/EDX，被调用者保存 EBX/ESI/EDI/EBP</li><li>LEAVE = MOV ESP,EBP + POP EBP</li></ul></div><div class="hint-container info"><p class="hint-container-title">原著参考</p><p>本章内容参考自《汇编语言：基于Linux环境（第3版）》Jeff Duntemann 第10章&quot;Decking Out the Procedures&quot;。书中详细讲解了过程调用的完整流程和栈帧管理技术。</p></div>`,2)])}var d=s(l,[[`render`,u]]);export{c as _pageData,d as default};