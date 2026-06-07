import{A as e,E as t,d as n,f as r,l as i,p as a,s as o}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as s}from"./app-C3QVrxQ1.js";var c=JSON.parse(`{"path":"/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%AD%A6%E7%A7%91/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80/04_%E4%BD%8D%E6%93%8D%E4%BD%9C%E4%B8%8E%E9%AB%98%E7%BA%A7%E8%BF%90%E7%AE%97/01_%E4%BD%8D%E6%93%8D%E4%BD%9C%E6%8C%87%E4%BB%A4.html","title":"位操作指令","lang":"zh-CN","frontmatter":{"title":"位操作指令","icon":"fa6-solid:binary","order":1,"category":["计算机学科","汇编语言"],"tag":["位运算"]},"git":{"createdTime":1780564101000,"updatedTime":1780564101000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":6.82,"words":2047},"filePathRelative":"计算机学科/汇编语言/04_位操作与高级运算/01_位操作指令.md"}`),l={name:`01_位操作指令.md`};function u(s,c,l,u,d,f){let p=e(`Mermaid`);return t(),i(`div`,null,[c[0]||=o(`h1`,{id:`位操作指令`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#位操作指令`},[o(`span`,null,`位操作指令`)])],-1),c[1]||=o(`h2`,{id:`为什么位操作如此重要`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#为什么位操作如此重要`},[o(`span`,null,`为什么位操作如此重要？`)])],-1),c[2]||=o(`p`,null,[r(`位操作是汇编语言的超能力——高级语言也能做位运算，但汇编让你`),o(`strong`,null,`精确到每一个比特`),r(`。操作系统内核、加密算法、硬件驱动、网络协议，这些底层代码都大量依赖位操作。`)],-1),c[3]||=o(`p`,null,[r(`如果说 MOV 是搬运工，算术指令是计算器，那么位操作指令就是一把`),o(`strong`,null,`手术刀`),r(`——精确、高效，能对数据的每一个比特做手术。`)],-1),a(p,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggyFJ3t7n03ufbJ3ztNdU55PWQGWBAHH6Gdzm1/OnPCsb+XzBY2xcHGnaKCOp/PnP+uf8LR/GkLcOfrp/tUvG+Y/2Tnj5cwlCHGX6KeTO57u6HmxbuHzddMR4q7RzxeuebJ729P1LU/Xzng6cwVCyi36adeCp+vbgOqfbZ4KEU/NSwHTTp4h0UpwNz/raX+ye4lSrIKurp2Co4KaghMQOwOxCxC7ArEbFwBPJmgG`}),c[4]||=n(`<h2 id="移位指令" tabindex="-1"><a class="header-anchor" href="#移位指令"><span>移位指令</span></a></h2><h3 id="shl-shr-逻辑移位" tabindex="-1"><a class="header-anchor" href="#shl-shr-逻辑移位"><span>SHL / SHR - 逻辑移位</span></a></h3><p>逻辑移位在空出的位上填 0：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>shl eax, 1            ; 逻辑左移1位 = 乘以2</span></span>
<span class="line"><span>shr eax, 1            ; 逻辑右移1位 = 无符号除以2</span></span>
<span class="line"><span>shl eax, 4            ; 左移4位 = 乘以16</span></span>
<span class="line"><span>shr eax, 3            ; 右移3位 = 除以8</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>SHL 示例: EAX = 0x00000005 (5)</span></span>
<span class="line"><span>         0000 0000 0000 0000 0000 0000 0000 0101</span></span>
<span class="line"><span>    SHL 1→ 0000 0000 0000 0000 0000 0000 0000 1010  = 0x0A (10)</span></span>
<span class="line"><span>    SHL 4→ 0000 0000 0000 0000 0000 0000 0101 0000  = 0x50 (80)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SHR 示例: EAX = 0x00000005 (5)</span></span>
<span class="line"><span>         0000 0000 0000 0000 0000 0000 0000 0101</span></span>
<span class="line"><span>    SHR 1→ 0000 0000 0000 0000 0000 0000 0000 0010  = 0x02 (2)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">移位 = 快速乘除</p><p>移位比乘除指令快得多：</p><ul><li><code>shl eax, 1</code> = <code>eax * 2</code>（1 个时钟周期）</li><li><code>imul eax, 2</code> = <code>eax * 2</code>（3+ 个时钟周期）</li><li>编译器会自动将 <code>x * 2^n</code> 优化为 <code>shl x, n</code></li></ul></div><h3 id="sal-sar-算术移位" tabindex="-1"><a class="header-anchor" href="#sal-sar-算术移位"><span>SAL / SAR - 算术移位</span></a></h3><p>算术移位保留符号位——左移与 SHL 相同，右移时高位填符号位：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>sar eax, 1            ; 算术右移1位 = 有符号除以2（向负无穷取整）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>SAR 示例: EAX = 0xFFFFFFFB (-5)</span></span>
<span class="line"><span>         1111 1111 1111 1111 1111 1111 1111 1011</span></span>
<span class="line"><span>   SAR 1→ 1111 1111 1111 1111 1111 1111 1111 1101  = -3 (正确：-5/2=-3)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SHR 示例: EAX = 0xFFFFFFFB (-5) — 如果误用 SHR</span></span>
<span class="line"><span>         1111 1111 1111 1111 1111 1111 1111 1011</span></span>
<span class="line"><span>   SHR 1→ 0111 1111 1111 1111 1111 1111 1111 1101  = 2147483645 (错误！)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">SAR vs SHR 的选择</p><ul><li><strong>有符号数</strong>除以 2 的幂：用 <code>SAR</code>（保留符号位）</li><li><strong>无符号数</strong>除以 2 的幂：用 <code>SHR</code>（高位填 0）</li><li>混淆两者会导致负数运算完全错误</li></ul></div><h3 id="移位量超过-1" tabindex="-1"><a class="header-anchor" href="#移位量超过-1"><span>移位量超过 1</span></a></h3><p>移位量可以是立即数或 CL 寄存器：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>shl eax, 4            ; 左移 4 位（立即数）</span></span>
<span class="line"><span>mov cl, 8</span></span>
<span class="line"><span>shr eax, cl           ; 右移 CL 位（CL=8）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">移位量的限制</p><p>x86 只使用移位量的低 5 位（0-31），64 位模式使用低 6 位（0-63）。<code>shl eax, 32</code> 等于不移位（32 的低 5 位是 0）。</p></div><h2 id="循环移位指令" tabindex="-1"><a class="header-anchor" href="#循环移位指令"><span>循环移位指令</span></a></h2><h3 id="rol-ror-循环移位" tabindex="-1"><a class="header-anchor" href="#rol-ror-循环移位"><span>ROL / ROR - 循环移位</span></a></h3><p>移出的位回到另一端，不像 SHL/SHR 那样丢弃：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>rol eax, 4            ; 循环左移4位</span></span>
<span class="line"><span>ror eax, 8            ; 循环右移8位</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>ROL 示例: EAX = 0x12345678</span></span>
<span class="line"><span>         0001 0010 0011 0100 0101 0110 0111 1000</span></span>
<span class="line"><span>   ROL 4→ 0010 0011 0100 0101 0110 0111 1000 0001  = 0x23456781</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,20),a(p,{code:`eJxLy8kvT85ILCpR8AniUgCC4tKk9KLEggyFIH8fhaf7Vj3vW/90+7Lny3eDZUHAMVrp5eoZT/b2Ptu16Gn7LqVYBV1dO4Uapaez5z3t2PBkbx9QSqlGwSla6eneRc86JkAMUYoFG5Cal4JuTRDMmv7NyNY4RytBzMJqDcQFQGtccFoDANcSY64=`}),c[5]||=n(`<h3 id="rcl-rcr-带进位循环移位" tabindex="-1"><a class="header-anchor" href="#rcl-rcr-带进位循环移位"><span>RCL / RCR - 带进位循环移位</span></a></h3><p>将 CF 标志位作为第 33 位参与循环：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>rcl eax, 1            ; 带进位循环左移1位</span></span>
<span class="line"><span>rcr eax, 1            ; 带进位循环右移1位</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="位测试与操作指令" tabindex="-1"><a class="header-anchor" href="#位测试与操作指令"><span>位测试与操作指令</span></a></h2><h3 id="bt-bts-btr-btc" tabindex="-1"><a class="header-anchor" href="#bt-bts-btr-btc"><span>BT / BTS / BTR / BTC</span></a></h3><table><thead><tr><th>指令</th><th>功能</th><th>助记</th></tr></thead><tbody><tr><td><code>BT</code></td><td>测试指定位（将位值送入 CF）</td><td><strong>B</strong>it <strong>T</strong>est</td></tr><tr><td><code>BTS</code></td><td>测试并设置指定位为 1</td><td><strong>B</strong>it <strong>T</strong>est and <strong>S</strong>et</td></tr><tr><td><code>BTR</code></td><td>测试并清除指定位为 0</td><td><strong>B</strong>it <strong>T</strong>est and <strong>R</strong>eset</td></tr><tr><td><code>BTC</code></td><td>测试并取反指定位</td><td><strong>B</strong>it <strong>T</strong>est and <strong>C</strong>omplement</td></tr></tbody></table><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 测试 EAX 的第 3 位</span></span>
<span class="line"><span>bt eax, 3              ; CF = EAX 的 bit3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 设置 EBX 的第 5 位为 1</span></span>
<span class="line"><span>bts ebx, 5             ; bit5 = 1, CF = 原bit5</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 清除 ECX 的第 7 位</span></span>
<span class="line"><span>btr ecx, 7             ; bit7 = 0, CF = 原bit7</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 取反 EDX 的第 0 位</span></span>
<span class="line"><span>btc edx, 0             ; bit0 = ~bit0, CF = 原bit0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">BTS/BTR 的原子性</p><p>在多处理器系统中，<code>BTS</code> 和 <code>BTR</code> 配合 <code>LOCK</code> 前缀可以实现<strong>原子位操作</strong>——这是内核自旋锁的实现基础：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>lock bts [lock_var], 0    ; 原子地测试并设置 bit0</span></span>
<span class="line"><span>jc spin_wait              ; 如果原来为1（已锁），等待</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></div><h3 id="bsf-bsr-位扫描" tabindex="-1"><a class="header-anchor" href="#bsf-bsr-位扫描"><span>BSF / BSR - 位扫描</span></a></h3><p>从低/高端扫描第一个为 1 的位：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>bsf eax, ebx           ; 找 EBX 中最低的1位，位号存入EAX</span></span>
<span class="line"><span>bsr eax, ebx           ; 找 EBX 中最高的1位，位号存入EAX</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>EBX = 0x00001000 (bit12 为1)</span></span>
<span class="line"><span>BSF EAX, EBX → EAX = 12</span></span>
<span class="line"><span>BSR EAX, EBX → EAX = 12</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EBX = 0x00000000 (全0)</span></span>
<span class="line"><span>BSF EAX, EBX → ZF=1, EAX 未定义</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>应用场景：快速计算 log2、找最低位 1 的位置。</p><h2 id="位操作经典技巧" tabindex="-1"><a class="header-anchor" href="#位操作经典技巧"><span>位操作经典技巧</span></a></h2><h3 id="掩码操作" tabindex="-1"><a class="header-anchor" href="#掩码操作"><span>掩码操作</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 提取低 N 位</span></span>
<span class="line"><span>and eax, 0xFF          ; 提取低 8 位</span></span>
<span class="line"><span>and eax, 0x0F          ; 提取低 4 位</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 设置某些位</span></span>
<span class="line"><span>or eax, 0x80           ; 设置最高位</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 翻转某些位</span></span>
<span class="line"><span>xor eax, 0x55          ; 翻转奇数位</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 清除某些位</span></span>
<span class="line"><span>and eax, ~0x0F         ; 清除低 4 位（NASM中需写为 0xFFFFFFF0）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="位域提取与插入" tabindex="-1"><a class="header-anchor" href="#位域提取与插入"><span>位域提取与插入</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 提取 bit8-bit15（8位宽的位域）</span></span>
<span class="line"><span>mov ecx, eax</span></span>
<span class="line"><span>shr ecx, 8             ; 右移8位，使目标位域对齐到最低位</span></span>
<span class="line"><span>and ecx, 0xFF          ; 屏蔽其他位</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 插入值到 bit8-bit15</span></span>
<span class="line"><span>and eax, 0xFFFF00FF    ; 清除 bit8-15</span></span>
<span class="line"><span>or  eax, [value_shl_8] ; 或运算插入新值</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="判断奇偶" tabindex="-1"><a class="header-anchor" href="#判断奇偶"><span>判断奇偶</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>test al, 1              ; 测试最低位</span></span>
<span class="line"><span>jnz is_odd              ; 1 = 奇数</span></span>
<span class="line"><span>; 否则是偶数</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="快速取模-2的幂" tabindex="-1"><a class="header-anchor" href="#快速取模-2的幂"><span>快速取模（2的幂）</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; x % 8 等价于 x &amp; 7</span></span>
<span class="line"><span>and eax, 7              ; EAX = EAX % 8</span></span>
<span class="line"><span>; x % 256 等价于 x &amp; 0xFF</span></span>
<span class="line"><span>and eax, 0xFF           ; EAX = EAX % 256</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="交换高低字节" tabindex="-1"><a class="header-anchor" href="#交换高低字节"><span>交换高低字节</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 交换 AX 中的高低字节</span></span>
<span class="line"><span>rol ax, 8               ; 等价于 xchg al, ah</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实战-位图操作" tabindex="-1"><a class="header-anchor" href="#实战-位图操作"><span>实战：位图操作</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; bitmap.asm - 位图操作示例</span></span>
<span class="line"><span>; 演示位图（Bitmap）的设置、清除和测试操作</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    bitmap dd 0                     ; 32位位图（可管理32个标志）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    ; 设置 bit 3</span></span>
<span class="line"><span>    bts [bitmap], 3</span></span>
<span class="line"><span>    ; 设置 bit 7</span></span>
<span class="line"><span>    bts [bitmap], 7</span></span>
<span class="line"><span>    ; 设置 bit 15</span></span>
<span class="line"><span>    bts [bitmap], 15</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 测试 bit 7</span></span>
<span class="line"><span>    bt [bitmap], 7</span></span>
<span class="line"><span>    jc bit7_set              ; CF=1 表示已设置</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bit7_set:</span></span>
<span class="line"><span>    ; 清除 bit 3</span></span>
<span class="line"><span>    btr [bitmap], 3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 统计位图中 1 的个数（Population Count）</span></span>
<span class="line"><span>    mov eax, [bitmap]</span></span>
<span class="line"><span>    call popcount</span></span>
<span class="line"><span>    ; EAX = 1 的个数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov ebx, eax</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; popcount - 统计 EAX 中 1 的个数</span></span>
<span class="line"><span>; 输入: EAX = 待统计值</span></span>
<span class="line"><span>; 输出: ECX = 1 的个数</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>popcount:</span></span>
<span class="line"><span>    mov ecx, 0               ; count = 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.pc_loop:</span></span>
<span class="line"><span>    test eax, eax</span></span>
<span class="line"><span>    jz .pc_done</span></span>
<span class="line"><span>    bsf edx, eax             ; 找最低的1位</span></span>
<span class="line"><span>    btr eax, edx             ; 清除该位</span></span>
<span class="line"><span>    inc ecx                  ; count++</span></span>
<span class="line"><span>    jmp .pc_loop</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.pc_done:</span></span>
<span class="line"><span>    mov eax, ecx</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实战-简易加密-xor-加密" tabindex="-1"><a class="header-anchor" href="#实战-简易加密-xor-加密"><span>实战：简易加密（XOR 加密）</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; xor_cipher.asm - XOR 加密/解密演示</span></span>
<span class="line"><span>; 编译: nasm -f elf32 xor_cipher.asm -o xor_cipher.o</span></span>
<span class="line"><span>; 链接: gcc -m32 xor_cipher.o -o xor_cipher -nostdlib</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    key     db 0x5A, 0xA5, 0xFF, 0x00     ; 4字节密钥</span></span>
<span class="line"><span>    key_len equ $ - key</span></span>
<span class="line"><span>    message db &#39;Hello, Assembly World!&#39;</span></span>
<span class="line"><span>    msg_len equ $ - message</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .bss</span></span>
<span class="line"><span>    encrypted resb 64</span></span>
<span class="line"><span>    decrypted resb 64</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    ; 加密</span></span>
<span class="line"><span>    mov esi, message</span></span>
<span class="line"><span>    mov edi, encrypted</span></span>
<span class="line"><span>    mov ecx, msg_len</span></span>
<span class="line"><span>    call xor_encrypt</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 解密（再次 XOR 同一密钥）</span></span>
<span class="line"><span>    mov esi, encrypted</span></span>
<span class="line"><span>    mov edi, decrypted</span></span>
<span class="line"><span>    mov ecx, msg_len</span></span>
<span class="line"><span>    call xor_encrypt</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 验证解密结果</span></span>
<span class="line"><span>    ; decrypted 应与 message 相同</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov ebx, 0</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; xor_encrypt - XOR 加密/解密</span></span>
<span class="line"><span>; 输入: ESI=源, EDI=目标, ECX=长度</span></span>
<span class="line"><span>; 使用 key 作为循环密钥</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>xor_encrypt:</span></span>
<span class="line"><span>    push ebx</span></span>
<span class="line"><span>    xor ebx, ebx            ; 密钥索引 = 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.enc_loop:</span></span>
<span class="line"><span>    test ecx, ecx</span></span>
<span class="line"><span>    jz .enc_done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 读取明文字节</span></span>
<span class="line"><span>    mov al, [esi]</span></span>
<span class="line"><span>    ; 与密钥字节 XOR</span></span>
<span class="line"><span>    xor al, [key + ebx]</span></span>
<span class="line"><span>    ; 写入密文字节</span></span>
<span class="line"><span>    mov [edi], al</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    inc esi</span></span>
<span class="line"><span>    inc edi</span></span>
<span class="line"><span>    inc ebx</span></span>
<span class="line"><span>    and ebx, key_len - 1    ; 密钥索引循环 (key_len必须是2的幂)</span></span>
<span class="line"><span>    dec ecx</span></span>
<span class="line"><span>    jmp .enc_loop</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.enc_done:</span></span>
<span class="line"><span>    pop ebx</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2><table><thead><tr><th>指令</th><th>功能</th><th>典型用途</th></tr></thead><tbody><tr><td>SHL/SHR</td><td>逻辑移位</td><td>快速乘除 2 的幂</td></tr><tr><td>SAL/SAR</td><td>算术移位</td><td>有符号除法</td></tr><tr><td>ROL/ROR</td><td>循环移位</td><td>数据旋转</td></tr><tr><td>BT/BTS/BTR/BTC</td><td>位测试/设置/清除/取反</td><td>位图操作、锁</td></tr><tr><td>BSF/BSR</td><td>位扫描</td><td>找最低/最高位</td></tr><tr><td>AND/OR/XOR</td><td>逻辑运算</td><td>掩码、设置、翻转</td></tr></tbody></table><div class="hint-container tip"><p class="hint-container-title">面试要点</p><ul><li>SHL 1 位 = 乘以 2，SHR 1 位 = 无符号除以 2，SAR 1 位 = 有符号除以 2</li><li>SAR 保留符号位，SHR 高位填 0——处理负数时必须用 SAR</li><li>BTS/BTR 配合 LOCK 前缀可实现多处理器原子位操作（自旋锁基础）</li><li>XOR 加密的特性：同一密钥 XOR 两次恢复原文</li><li>取模 2^n 可用 AND (2^n - 1) 替代，比 DIV 快得多</li><li>BSF/BSR 找最低/最高位 1 的位置，全 0 时 ZF=1</li></ul></div><div class="hint-container info"><p class="hint-container-title">原著参考</p><p>本章内容参考自《汇编语言：基于Linux环境（第3版）》Jeff Duntemann 第9章&quot;Bits, Flags, Branches, and Tables&quot;。书中用&quot;灯泡开关&quot;比喻位操作，并详细讲解了移位和位操作指令的应用。</p></div>`,32)])}var d=s(l,[[`render`,u]]);export{c as _pageData,d as default};