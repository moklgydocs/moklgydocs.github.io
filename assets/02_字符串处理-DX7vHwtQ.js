import{A as e,E as t,d as n,f as r,l as i,p as a,s as o}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as s}from"./app-C3QVrxQ1.js";var c=JSON.parse(`{"path":"/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%AD%A6%E7%A7%91/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80/04_%E4%BD%8D%E6%93%8D%E4%BD%9C%E4%B8%8E%E9%AB%98%E7%BA%A7%E8%BF%90%E7%AE%97/02_%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%A4%84%E7%90%86.html","title":"字符串处理","lang":"zh-CN","frontmatter":{"title":"字符串处理","icon":"fa6-solid:font","order":2,"category":["计算机学科","汇编语言"],"tag":["字符串"]},"git":{"createdTime":1780564101000,"updatedTime":1780564101000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":5.82,"words":1747},"filePathRelative":"计算机学科/汇编语言/04_位操作与高级运算/02_字符串处理.md"}`),l={name:`02_字符串处理.md`};function u(s,c,l,u,d,f){let p=e(`Mermaid`);return t(),i(`div`,null,[c[0]||=o(`h1`,{id:`字符串处理`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#字符串处理`},[o(`span`,null,`字符串处理`)])],-1),c[1]||=o(`h2`,{id:`x86-字符串指令-硬件加速的数据搬运`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#x86-字符串指令-硬件加速的数据搬运`},[o(`span`,null,`x86 字符串指令：硬件加速的数据搬运`)])],-1),c[2]||=o(`p`,null,[r(`x86 架构有一组专门的"字符串指令"，它们能自动递增/递减地址指针，配合 REP 前缀可以用一条指令完成整块数据的操作。这里的"字符串"不仅指文本——本质上它是`),o(`strong`,null,`内存块操作指令`),r(`。`)],-1),a(p,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggyFp2unP1+z7MmOTc962p/sXvJsej9YHgR8/cOCo5VApMLz5bufdq1QioXLOfsGAOVApMKz9VNe7GtGkgt2dgTKgUiFZ52rn/X3I8uF+IPkgCTQ5hlPm5DN9PF3AcqBSIWnXQte7N0LlUvNS0F187NpO59OmPisb/nTjm0IF/m4AB3k46IAlHra2avgGuyp7+riqa2NYjtQDZAAq5nQB1Ojq4vLppftvU+X9AKNe76nAW5KkGtAtBKQgMq6Okc8W7MQyRaglCtYgas+kIhSeD57x/O1nc+mb4OoR1XpB1HqB1brF6XwZEcvFsUghwEAFzihgw==`}),c[3]||=n(`<h2 id="方向标志-df" tabindex="-1"><a class="header-anchor" href="#方向标志-df"><span>方向标志 DF</span></a></h2><p>字符串指令的操作方向由 DF（Direction Flag）控制：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>cld                    ; DF=0, ESI/EDI 递增（向前，默认推荐）</span></span>
<span class="line"><span>std                    ; DF=1, ESI/EDI 递减（向后）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div>`,3),a(p,{code:`eJxLy8kvT85ILCpR8AniUgCC4tKk9KLEggwFZx8XhacTJj7t7H22YuHTPf1gWRBIySxKTS7JzM+DaQEBR8NoJddgT21tpVgFXV07BUejaKUnu/ue7O172rHh5eoZSrFgpal5Kai2BIdAbJnQh9OWIB+4oBPEFl1dqC1OEFuA5gNtAdqFZAsAK7tLNQ==`}),c[4]||=n(`<div class="hint-container important"><p class="hint-container-title">始终先设置 DF</p><p>DF 的值可能被之前的代码修改，使用字符串指令前<strong>务必</strong>先 <code>CLD</code> 或 <code>STD</code>。大多数情况用 <code>CLD</code>（向前）。</p></div><h2 id="lods-加载字符串" tabindex="-1"><a class="header-anchor" href="#lods-加载字符串"><span>LODS - 加载字符串</span></a></h2><p>从 ESI 指向的内存加载到累加器：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>lodsb                  ; AL = [ESI], ESI += 1 (或 -= 1)</span></span>
<span class="line"><span>lodsw                  ; AX = [ESI], ESI += 2</span></span>
<span class="line"><span>lodsd                  ; EAX = [ESI], ESI += 4</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),a(p,{code:`eJxLy8kvT85ILCpR8AniUgACX1ffaKWnba1P185QiHYN9oxVilXQ1bVTqPHxdwl2qlFw9IlWcvRRigUrBspHKwEJmBqlF+2rnnatUDi00VCpBiRrBJZWByoHAO3pIMw=`}),c[5]||=n(`<p>典型用途：逐字符处理字符串。</p><h2 id="stos-存储字符串" tabindex="-1"><a class="header-anchor" href="#stos-存储字符串"><span>STOS - 存储字符串</span></a></h2><p>将累加器的值存入 EDI 指向的内存：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>stosb                  ; [EDI] = AL, EDI += 1</span></span>
<span class="line"><span>stosw                  ; [EDI] = AX, EDI += 2</span></span>
<span class="line"><span>stosd                  ; [EDI] = EAX, EDI += 4</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配合 REP 前缀可以快速填充内存：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 将 buffer 的 256 字节全部填充为 0xAA</span></span>
<span class="line"><span>mov edi, buffer</span></span>
<span class="line"><span>mov al, 0xAA</span></span>
<span class="line"><span>mov ecx, 256</span></span>
<span class="line"><span>cld</span></span>
<span class="line"><span>rep stosb</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">REP STOSB 是最快的内存填充</p><p><code>REP STOSB</code> 在现代 CPU 上会被优化为内部微操作，填充大块内存比手写循环快得多。</p></div><h2 id="movs-移动字符串" tabindex="-1"><a class="header-anchor" href="#movs-移动字符串"><span>MOVS - 移动字符串</span></a></h2><p>从 ESI 指向的内存复制到 EDI 指向的内存：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>movsb                  ; [EDI] = [ESI], ESI += 1, EDI += 1</span></span>
<span class="line"><span>movsw                  ; 2 字节复制</span></span>
<span class="line"><span>movsd                  ; 4 字节复制</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10),a(p,{code:`eJwrTi0sTc1LTnXJTEwvSszlUgCCgsSikszkzILEvBIF12BPhcRiEKXxbNcETUx5F4i8i6fG89nrni1ohyjxyy9JVcgvSy0C6dQBylop+PqHBTuBJYFCunZ2YMGnS3qfdmwzfLp2+ouuJkydViBCWxtdAqQTSAAlACFtPek=`}),c[6]||=n(`<h3 id="批量复制" tabindex="-1"><a class="header-anchor" href="#批量复制"><span>批量复制</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 复制 1024 字节从 src 到 dst</span></span>
<span class="line"><span>mov esi, src</span></span>
<span class="line"><span>mov edi, dst</span></span>
<span class="line"><span>mov ecx, 1024 / 4         ; 以 4 字节为单位</span></span>
<span class="line"><span>cld</span></span>
<span class="line"><span>rep movsd                  ; 32 位复制，比 movsb 快 4 倍</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">优化：用 MOVSD 替代 MOVSB</p><p>尽可能用 <code>MOVSD</code>（4 字节）或 <code>MOVSQ</code>（8 字节，64 位模式）替代 <code>MOVSB</code>，减少循环次数。剩余字节再用 <code>MOVSB</code> 处理。</p></div><h3 id="处理重叠区域" tabindex="-1"><a class="header-anchor" href="#处理重叠区域"><span>处理重叠区域</span></a></h3><p>当源和目标内存区域重叠时，需要从高地址开始复制：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 将内存区域向前移动（dst &lt; src，有重叠）</span></span>
<span class="line"><span>mov esi, src + count - 1   ; 从末尾开始</span></span>
<span class="line"><span>mov edi, dst + count - 1</span></span>
<span class="line"><span>mov ecx, count</span></span>
<span class="line"><span>std                         ; 向后方向</span></span>
<span class="line"><span>rep movsb</span></span>
<span class="line"><span>cld                         ; 恢复向前方向</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这等价于 C 语言中的 <code>memmove</code>。</p><h2 id="cmps-比较字符串" tabindex="-1"><a class="header-anchor" href="#cmps-比较字符串"><span>CMPS - 比较字符串</span></a></h2><p>比较 ESI 和 EDI 指向的内存：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>cmpsb                  ; 比较 [ESI] 和 [EDI], 设置标志位</span></span>
<span class="line"><span>cmpsw                  ; 2 字节比较</span></span>
<span class="line"><span>cmpsd                  ; 4 字节比较</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配合 REPE/REPNE 前缀：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 比较两个字符串是否相等</span></span>
<span class="line"><span>mov esi, str1</span></span>
<span class="line"><span>mov edi, str2</span></span>
<span class="line"><span>mov ecx, max_len</span></span>
<span class="line"><span>cld</span></span>
<span class="line"><span>repe cmpsb              ; 相等时继续比较</span></span>
<span class="line"><span>; ZF=1 表示相等，ZF=0 表示不等</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="scas-扫描字符串" tabindex="-1"><a class="header-anchor" href="#scas-扫描字符串"><span>SCAS - 扫描字符串</span></a></h2><p>将累加器与 EDI 指向的内存比较：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>scasb                  ; 比较 AL 和 [EDI], 设置标志位, EDI += 1</span></span>
<span class="line"><span>scasw                  ; 2 字节扫描</span></span>
<span class="line"><span>scasd                  ; 4 字节扫描</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="字符串长度计算-strlen" tabindex="-1"><a class="header-anchor" href="#字符串长度计算-strlen"><span>字符串长度计算（strlen）</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 计算 ESI 指向字符串的长度</span></span>
<span class="line"><span>strlen:</span></span>
<span class="line"><span>    mov edi, esi           ; 目标地址</span></span>
<span class="line"><span>    xor al, al             ; 搜索 &#39;\\0&#39;</span></span>
<span class="line"><span>    mov ecx, -1            ; 最大搜索次数（几乎无限）</span></span>
<span class="line"><span>    cld</span></span>
<span class="line"><span>    repne scasb            ; 不等于 AL 时继续扫描</span></span>
<span class="line"><span>    ; ECX = -(长度+2) → 长度 = -ECX - 2</span></span>
<span class="line"><span>    not ecx</span></span>
<span class="line"><span>    dec ecx</span></span>
<span class="line"><span>    mov eax, ecx           ; 返回长度</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,17),a(p,{code:`eJxLy8kvT85ILCpR8AniUgACx2glVxdPhUdtkxTUPdSVYhV0de0UapSCnR2DnaxAQo86Fxgo1Sg4IalLBaoDa3ZCU50KU+2MpDoHptoZTXUOTLULNtUuuFS7IqnOh6l2RVOdD1PthqQ6JsYApt4NTT1IyhaioEbBPVopys3WUEfhaeOcZ2sXAbUAAFKiV5I=`}),c[7]||=n(`<h2 id="字符串指令速查表" tabindex="-1"><a class="header-anchor" href="#字符串指令速查表"><span>字符串指令速查表</span></a></h2><table><thead><tr><th>指令</th><th>操作</th><th>源</th><th>目标</th><th>自动调整</th></tr></thead><tbody><tr><td>LODSB</td><td>加载</td><td>[ESI]</td><td>AL</td><td>ESI ±1</td></tr><tr><td>STOSB</td><td>存储</td><td>AL</td><td>[EDI]</td><td>EDI ±1</td></tr><tr><td>MOVSB</td><td>复制</td><td>[ESI]</td><td>[EDI]</td><td>ESI/EDI ±1</td></tr><tr><td>CMPSB</td><td>比较</td><td>[ESI]</td><td>[EDI]</td><td>ESI/EDI ±1</td></tr><tr><td>SCASB</td><td>扫描</td><td>AL</td><td>[EDI]</td><td>EDI ±1</td></tr></tbody></table><p>每个指令都有 B/W/D 后缀变体（1/2/4 字节）。</p><h2 id="rep-前缀速查" tabindex="-1"><a class="header-anchor" href="#rep-前缀速查"><span>REP 前缀速查</span></a></h2><table><thead><tr><th>前缀</th><th>条件</th><th>用途</th></tr></thead><tbody><tr><td><code>REP</code></td><td>ECX ≠ 0</td><td>MOVS/STOS 批量操作</td></tr><tr><td><code>REPE</code> / <code>REPZ</code></td><td>ECX ≠ 0 且 ZF=1</td><td>CMPS/SCAS 找不等</td></tr><tr><td><code>REPNE</code> / <code>REPNZ</code></td><td>ECX ≠ 0 且 ZF=0</td><td>CMPS/SCAS 找相等</td></tr></tbody></table><h2 id="实战-字符串函数库" tabindex="-1"><a class="header-anchor" href="#实战-字符串函数库"><span>实战：字符串函数库</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; string_lib.asm - 常用字符串操作函数</span></span>
<span class="line"><span>; 编译: nasm -f elf32 string_lib.asm -o string_lib.o</span></span>
<span class="line"><span>; 链接: gcc -m32 string_lib.o -o string_lib -nostdlib</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    hello db &#39;Hello, World!&#39;, 0</span></span>
<span class="line"><span>    world db &#39;World&#39;, 0</span></span>
<span class="line"><span>    buffer times 64 db 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    ; 测试 strlen</span></span>
<span class="line"><span>    mov esi, hello</span></span>
<span class="line"><span>    call my_strlen</span></span>
<span class="line"><span>    ; EAX = 13</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 测试 strcpy</span></span>
<span class="line"><span>    mov esi, hello</span></span>
<span class="line"><span>    mov edi, buffer</span></span>
<span class="line"><span>    call my_strcpy</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 测试 strchr - 查找字符</span></span>
<span class="line"><span>    mov esi, hello</span></span>
<span class="line"><span>    mov al, &#39;,&#39;</span></span>
<span class="line"><span>    call my_strchr</span></span>
<span class="line"><span>    ; EAX = 指向 &#39;,&#39; 的指针（或 NULL）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 用退出码返回字符串长度</span></span>
<span class="line"><span>    mov ebx, 13            ; 期望 13</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; my_strlen - 计算字符串长度</span></span>
<span class="line"><span>; 输入: ESI = 字符串地址</span></span>
<span class="line"><span>; 输出: EAX = 长度</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>my_strlen:</span></span>
<span class="line"><span>    push edi</span></span>
<span class="line"><span>    push ecx</span></span>
<span class="line"><span>    mov edi, esi</span></span>
<span class="line"><span>    xor al, al</span></span>
<span class="line"><span>    mov ecx, -1</span></span>
<span class="line"><span>    cld</span></span>
<span class="line"><span>    repne scasb</span></span>
<span class="line"><span>    not ecx</span></span>
<span class="line"><span>    dec ecx</span></span>
<span class="line"><span>    mov eax, ecx</span></span>
<span class="line"><span>    pop ecx</span></span>
<span class="line"><span>    pop edi</span></span>
<span class="line"><span>    ret</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; my_strcpy - 字符串复制</span></span>
<span class="line"><span>; 输入: ESI = 源, EDI = 目标</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>my_strcpy:</span></span>
<span class="line"><span>    push eax</span></span>
<span class="line"><span>    cld</span></span>
<span class="line"><span>.copy_loop:</span></span>
<span class="line"><span>    lodsb                   ; AL = [ESI++]</span></span>
<span class="line"><span>    stosb                   ; [EDI++] = AL</span></span>
<span class="line"><span>    test al, al             ; 是否到达 &#39;\\0&#39;?</span></span>
<span class="line"><span>    jnz .copy_loop</span></span>
<span class="line"><span>    pop eax</span></span>
<span class="line"><span>    ret</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; my_strchr - 查找字符</span></span>
<span class="line"><span>; 输入: ESI = 字符串, AL = 目标字符</span></span>
<span class="line"><span>; 输出: EAX = 找到的地址（或 0）</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>my_strchr:</span></span>
<span class="line"><span>    push edi</span></span>
<span class="line"><span>    push ecx</span></span>
<span class="line"><span>    mov edi, esi</span></span>
<span class="line"><span>    mov ecx, -1</span></span>
<span class="line"><span>    cld</span></span>
<span class="line"><span>    repne scasb</span></span>
<span class="line"><span>    jnz .not_found</span></span>
<span class="line"><span>    lea eax, [edi - 1]     ; 指向找到的字符</span></span>
<span class="line"><span>    jmp .strchr_done</span></span>
<span class="line"><span>.not_found:</span></span>
<span class="line"><span>    xor eax, eax</span></span>
<span class="line"><span>.strchr_done:</span></span>
<span class="line"><span>    pop ecx</span></span>
<span class="line"><span>    pop edi</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实战-大小写转换" tabindex="-1"><a class="header-anchor" href="#实战-大小写转换"><span>实战：大小写转换</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; case_convert.asm - 字符串大小写转换</span></span>
<span class="line"><span>; 演示 LODSB/STOSB 与位操作的结合</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    lower db &#39;hello world&#39;, 0</span></span>
<span class="line"><span>    upper times 12 db 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    ; 小写转大写</span></span>
<span class="line"><span>    mov esi, lower</span></span>
<span class="line"><span>    mov edi, upper</span></span>
<span class="line"><span>    cld</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.to_upper_loop:</span></span>
<span class="line"><span>    lodsb                   ; AL = [ESI++]</span></span>
<span class="line"><span>    test al, al</span></span>
<span class="line"><span>    jz .to_upper_done</span></span>
<span class="line"><span>    cmp al, &#39;a&#39;</span></span>
<span class="line"><span>    jb .not_lower</span></span>
<span class="line"><span>    cmp al, &#39;z&#39;</span></span>
<span class="line"><span>    ja .not_lower</span></span>
<span class="line"><span>    and al, 0xDF            ; 清除第5位 → 大写</span></span>
<span class="line"><span>.not_lower:</span></span>
<span class="line"><span>    stosb                   ; [EDI++] = AL</span></span>
<span class="line"><span>    jmp .to_upper_loop</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.to_upper_done:</span></span>
<span class="line"><span>    stosb                   ; 复制 null 终止符</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 退出</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    xor ebx, ebx</span></span>
<span class="line"><span>    int 0x80</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2>`,10),a(p,{code:`eJzLzcxLyU0s4FJQKMrPL9HQeLp2+vM1y57s2PR0ScvzCW2amkAZBYVnPe1Pdi95Nr0fzFNQ8PF3CVZ42rXgxd69Tzs2PN+yHsh+OnMFVDY4xD9YAS74dO2Mp61Ln7a1AhlQBb7+YUDtYBGgdihjSe/Tjm1QBc6+ATAFz9ZPebGvGWaysyOSyc86Vz/rhzjpZXsvyIDO3ud7GqBqg1wDFF6sW/hs6gaIJELYVR9IRCk8n73j+dpOdEk/sKxflMKTHb2o0s+m7Xw6YeKzvuVI7vRxUQCKAe192TDp6aJ58ACACE/oAwm3Q5z4dN28Zx0znu6a8nwKLKCKS4pyUvPAvnJCCCUXVIID2EkbFJAwidzU3OLUErCv0IRB6kHCoFB14QIA6/PIOQ==`}),c[8]||=n(`<div class="hint-container tip"><p class="hint-container-title">面试要点</p><ul><li>字符串指令自动递增/递减 ESI 和 EDI，方向由 DF 控制</li><li>使用字符串指令前务必 <code>CLD</code>（清除方向标志）</li><li>REP 前缀配合 MOVS/STOS 做批量操作，配合 CMPS/SCAS 做条件搜索</li><li><code>REPNE SCASB</code> 实现 strlen：搜索 &#39;\\0&#39; 字符</li><li>重叠内存复制用 STD + 从末尾开始（类似 memmove）</li><li>尽量用 MOVSD 替代 MOVSB，减少循环次数</li></ul></div><div class="hint-container info"><p class="hint-container-title">原著参考</p><p>本章内容参考自《汇编语言：基于Linux环境（第3版）》Jeff Duntemann 第11章&quot;Strings and Things&quot;。书中将字符串指令比作&quot;自动扶梯&quot;——你只需站上去，它自动前进。</p></div>`,2)])}var d=s(l,[[`render`,u]]);export{c as _pageData,d as default};