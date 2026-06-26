import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-BVtXrkU4.js";import{t as a}from"./app-Bk8M88M6.js";var o=JSON.parse(`{"path":"/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%AD%A6%E7%A7%91/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80/02_%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80%E5%9F%BA%E7%A1%80/04_%E6%8E%A7%E5%88%B6%E6%B5%81%E6%8C%87%E4%BB%A4.html","title":"控制流指令","lang":"zh-CN","frontmatter":{"title":"控制流指令","icon":"fa6-solid:code-branch","order":4,"category":["计算机学科","汇编语言"],"tag":["指令"]},"git":{"createdTime":1780564101000,"updatedTime":1780564101000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":6.39,"words":1918},"filePathRelative":"计算机学科/汇编语言/02_汇编语言基础/04_控制流指令.md"}`),s={name:`04_控制流指令.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="控制流指令" tabindex="-1"><a class="header-anchor" href="#控制流指令"><span>控制流指令</span></a></h1><h2 id="没有if的世界" tabindex="-1"><a class="header-anchor" href="#没有if的世界"><span>没有if的世界</span></a></h2><p>高级语言中，<code>if/else/for/while</code> 是控制程序流向的基本结构。但在汇编中，<strong>没有这些语法糖</strong>——一切控制流都由 <code>CMP</code>、标志位和<strong>跳转指令</strong>实现。</p><p>理解这一点就像从自动驾驶切换到手动挡：你不再说&quot;如果下雨就开雨刷&quot;，而是说&quot;检查雨量传感器，如果值 &gt; 阈值，跳转到开雨刷的代码&quot;。</p>`,4),i(d,{code:`eJxLy8kvT85ILCpRCHHiUgACx+iXq2c837X8xfq1L1Y0xCro6top1ChlpiloVCjYKRhoKtUoOEUrJecWKFToKBjYJBXp22XlpCqk5hSnxuckJqXmKMVCzDHCalBafpGCRqatgbVCpk0ekNDWBpnoHK2Um1+mkJoMNDMPbKZeTn5+gZVCSmoySBRiTV6VAlgYZoMxVhvKMzKB7tFIzs9LARntEq1UklpcogDiQ4wBmpIKZevp6UHEgN6BGQ0Aj/Nf0w==`}),o[1]||=n(`<h2 id="cmp-比较指令" tabindex="-1"><a class="header-anchor" href="#cmp-比较指令"><span>CMP - 比较指令</span></a></h2><p><code>CMP</code> 是所有条件跳转的前提——它做减法但不保存结果，只设置标志位：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>cmp eax, ebx         ; 计算 EAX - EBX，设置标志位</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><table><thead><tr><th>关系</th><th>EAX vs EBX</th><th>ZF</th><th>CF</th><th>SF</th><th>OF</th></tr></thead><tbody><tr><td>EAX = EBX</td><td>差为 0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr><tr><td>EAX &gt; EBX（无符号）</td><td>差 &gt; 0，无借位</td><td>0</td><td>0</td><td>-</td><td>-</td></tr><tr><td>EAX &lt; EBX（无符号）</td><td>差 &lt; 0，有借位</td><td>0</td><td>1</td><td>-</td><td>-</td></tr></tbody></table><div class="hint-container important"><p class="hint-container-title">CMP vs SUB</p><p><code>CMP</code> 和 <code>SUB</code> 做同样的减法运算，但 <code>CMP</code> 不保存结果到目的操作数。<code>CMP</code> 的作用纯粹是设置标志位。</p></div><h2 id="无条件跳转-jmp" tabindex="-1"><a class="header-anchor" href="#无条件跳转-jmp"><span>无条件跳转：JMP</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>jmp label            ; 直接跳转，无条件</span></span>
<span class="line"><span>jmp eax              ; 间接跳转，跳转到 EAX 中的地址</span></span>
<span class="line"><span>jmp [addr]           ; 间接跳转，跳转到内存中存储的地址</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>JMP</code> 是汇编版的 <code>goto</code>——它不做任何判断，直接改变 EIP（指令指针）。</p><h2 id="条件跳转-jcc-指令族" tabindex="-1"><a class="header-anchor" href="#条件跳转-jcc-指令族"><span>条件跳转：Jcc 指令族</span></a></h2><p>条件跳转根据 EFLAGS 的状态决定是否跳转。这是汇编实现分支逻辑的核心。</p><h3 id="无符号条件跳转" tabindex="-1"><a class="header-anchor" href="#无符号条件跳转"><span>无符号条件跳转</span></a></h3><table><thead><tr><th>指令</th><th>含义</th><th>判断条件</th><th>助记</th></tr></thead><tbody><tr><td><code>JA</code></td><td>Above（大于）</td><td>CF=0 且 ZF=0</td><td><strong>A</strong>bove</td></tr><tr><td><code>JAE</code></td><td>Above or Equal（大于等于）</td><td>CF=0</td><td><strong>A</strong>bove/<strong>E</strong>qual</td></tr><tr><td><code>JB</code></td><td>Below（小于）</td><td>CF=1</td><td><strong>B</strong>elow</td></tr><tr><td><code>JBE</code></td><td>Below or Equal（小于等于）</td><td>CF=1 或 ZF=1</td><td><strong>B</strong>elow/<strong>E</strong>qual</td></tr><tr><td><code>JE</code> / <code>JZ</code></td><td>Equal / Zero</td><td>ZF=1</td><td><strong>E</strong>qual / <strong>Z</strong>ero</td></tr><tr><td><code>JNE</code> / <code>JNZ</code></td><td>Not Equal / Not Zero</td><td>ZF=0</td><td><strong>N</strong>ot <strong>E</strong>qual</td></tr></tbody></table><h3 id="有符号条件跳转" tabindex="-1"><a class="header-anchor" href="#有符号条件跳转"><span>有符号条件跳转</span></a></h3><table><thead><tr><th>指令</th><th>含义</th><th>判断条件</th><th>助记</th></tr></thead><tbody><tr><td><code>JG</code></td><td>Greater（大于）</td><td>ZF=0 且 SF=OF</td><td><strong>G</strong>reater</td></tr><tr><td><code>JGE</code></td><td>Greater or Equal（大于等于）</td><td>SF=OF</td><td><strong>G</strong>reater/<strong>E</strong>qual</td></tr><tr><td><code>JL</code></td><td>Less（小于）</td><td>SF≠OF</td><td><strong>L</strong>ess</td></tr><tr><td><code>JLE</code></td><td>Less or Equal（小于等于）</td><td>ZF=1 或 SF≠OF</td><td><strong>L</strong>ess/<strong>E</strong>qual</td></tr></tbody></table>`,14),i(d,{code:`eJxLy8kvT85ILCpRCHHiUgACZ9+AaCUgoeCoo+CkFKugq2un4Obj6B5c/WLdvud71z1b0P50//Qne3trwcrBUmBFNc+mL3i+ZtnT/u3P1k95sa+5RiG0+sne/c+nrFDwctT3ctL3cnQFUq6Y+uZ0ouoLhutz1/fy0fdyB+rzwdT3fPaO52s7n3YseTZtbY2CK1wTULUfVHVxSWVOqkKoQlpmTo6VcqphmmlaKpJEMFQiLS3NONUAScIVpsMizTTVkgsASWJwrA==`}),o[2]||=n(`<div class="hint-container warning"><p class="hint-container-title">无符号 vs 有符号跳转——最常见的坑</p><p><code>JA/JB</code> 和 <code>JG/JL</code> 判断的标志位完全不同！用错会导致逻辑错误。</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>cmp eax, -1          ; EAX = 0xFFFFFFFF, -1 = 0xFFFFFFFF</span></span>
<span class="line"><span>ja  above_label      ; 无符号: 0xFFFFFFFF &gt; -1 → 跳转！（视作 4294967295 &gt; 4294967295 → 不跳转）</span></span>
<span class="line"><span>                    ; 实际上 0xFFFFFFFF 看作无符号是 4294967295，-1 也被看作 4294967295，相等</span></span>
<span class="line"><span>jg  greater_label    ; 有符号: -1 &gt; -1 → 不跳转（正确）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>铁律</strong>：比较无符号数用 JA/JB/JAE/JBE，比较有符号数用 JG/JL/JGE/JLE。</p></div><h2 id="单标志位跳转" tabindex="-1"><a class="header-anchor" href="#单标志位跳转"><span>单标志位跳转</span></a></h2><table><thead><tr><th>指令</th><th>条件</th><th>用途</th></tr></thead><tbody><tr><td><code>JC</code></td><td>CF=1</td><td>检测进位/借位</td></tr><tr><td><code>JNC</code></td><td>CF=0</td><td>检测无进位</td></tr><tr><td><code>JZ</code> / <code>JE</code></td><td>ZF=1</td><td>检测零/相等</td></tr><tr><td><code>JNZ</code> / <code>JNE</code></td><td>ZF=0</td><td>检测非零/不等</td></tr><tr><td><code>JS</code></td><td>SF=1</td><td>检测负数</td></tr><tr><td><code>JNS</code></td><td>SF=0</td><td>检测正数</td></tr><tr><td><code>JO</code></td><td>OF=1</td><td>检测有符号溢出</td></tr><tr><td><code>JNO</code></td><td>OF=0</td><td>检测无溢出</td></tr></tbody></table><h2 id="循环指令-loop" tabindex="-1"><a class="header-anchor" href="#循环指令-loop"><span>循环指令：LOOP</span></a></h2><p><code>LOOP</code> 是一个简化的循环控制指令，自动递减 ECX 并判断：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>mov ecx, 10          ; 循环 10 次</span></span>
<span class="line"><span>.loop:</span></span>
<span class="line"><span>    ; 循环体</span></span>
<span class="line"><span>    loop .loop       ; ECX--, 如果 ECX != 0 则跳转</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>等价于：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>.loop:</span></span>
<span class="line"><span>    ; 循环体</span></span>
<span class="line"><span>    dec ecx</span></span>
<span class="line"><span>    jnz .loop</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">LOOP 的局限</p><ul><li><code>LOOP</code> 固定使用 ECX，不够灵活</li><li><code>LOOP</code> 不影响标志位</li><li>在现代 CPU 上，<code>dec ecx + jnz</code> 可能比 <code>loop</code> 更快</li><li>如果循环体修改了 ECX，就不能用 LOOP</li></ul></div><h2 id="实现高级控制结构" tabindex="-1"><a class="header-anchor" href="#实现高级控制结构"><span>实现高级控制结构</span></a></h2><h3 id="if-else" tabindex="-1"><a class="header-anchor" href="#if-else"><span>if-else</span></a></h3><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// C 代码</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> (eax </span><span style="color:#C678DD;">&gt;=</span><span style="color:#D19A66;"> 100</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">    eax </span><span style="color:#C678DD;">=</span><span style="color:#ABB2BF;"> eax </span><span style="color:#C678DD;">-</span><span style="color:#D19A66;"> 100</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">} </span><span style="color:#C678DD;">else</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    eax </span><span style="color:#C678DD;">=</span><span style="color:#ABB2BF;"> eax </span><span style="color:#C678DD;">+</span><span style="color:#D19A66;"> 100</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 汇编实现</span></span>
<span class="line"><span>    cmp eax, 100</span></span>
<span class="line"><span>    jge .then_block</span></span>
<span class="line"><span>.else_block:</span></span>
<span class="line"><span>    add eax, 100</span></span>
<span class="line"><span>    jmp .end_if</span></span>
<span class="line"><span>.then_block:</span></span>
<span class="line"><span>    sub eax, 100</span></span>
<span class="line"><span>.end_if:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13),i(d,{code:`eJxLy8kvT85ILCpRCHHiUgACx2glZ98ABVfHCB0FQwMDpVgFXV07BadqJaCIgp0tSMxeqRas1AkkVfNsxnoFL3fXGgXnaKXgUCcknUiKnk5YVqPgEq3k6OKCrsAZbIFrtJKrn0u8pxtU1AUiygUAzRcmwA==`}),o[3]||=n(`<h3 id="for-循环" tabindex="-1"><a class="header-anchor" href="#for-循环"><span>for 循环</span></a></h3><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// C 代码</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#ABB2BF;"> (</span><span style="color:#C678DD;">int</span><span style="color:#ABB2BF;"> i </span><span style="color:#C678DD;">=</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">; i </span><span style="color:#C678DD;">&lt;</span><span style="color:#ABB2BF;"> n; i</span><span style="color:#C678DD;">++</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">    sum </span><span style="color:#C678DD;">+=</span><span style="color:#E06C75;"> array</span><span style="color:#ABB2BF;">[i];</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 汇编实现</span></span>
<span class="line"><span>    xor eax, eax               ; sum = 0</span></span>
<span class="line"><span>    xor ecx, ecx               ; i = 0</span></span>
<span class="line"><span>.for_loop:</span></span>
<span class="line"><span>    cmp ecx, [n]               ; i &lt; n ?</span></span>
<span class="line"><span>    jge .for_end</span></span>
<span class="line"><span>    add eax, [array + ecx*4]   ; sum += array[i]</span></span>
<span class="line"><span>    inc ecx                    ; i++</span></span>
<span class="line"><span>    jmp .for_loop</span></span>
<span class="line"><span>.for_end:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="while-循环" tabindex="-1"><a class="header-anchor" href="#while-循环"><span>while 循环</span></a></h3><div class="language-c line-numbers-mode" data-highlighter="shiki" data-ext="c" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-c"><span class="line"><span style="color:#7F848E;font-style:italic;">// C 代码</span></span>
<span class="line"><span style="color:#C678DD;">while</span><span style="color:#ABB2BF;"> (x </span><span style="color:#C678DD;">!=</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">    x </span><span style="color:#C678DD;">=</span><span style="color:#ABB2BF;"> x </span><span style="color:#C678DD;">/</span><span style="color:#D19A66;"> 2</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    count</span><span style="color:#C678DD;">++</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 汇编实现</span></span>
<span class="line"><span>    mov ecx, 0                 ; count = 0</span></span>
<span class="line"><span>.while_loop:</span></span>
<span class="line"><span>    cmp dword [x], 0</span></span>
<span class="line"><span>    je .while_end              ; x == 0 则退出</span></span>
<span class="line"><span>    shr dword [x], 1           ; x /= 2（算术右移）</span></span>
<span class="line"><span>    inc ecx                    ; count++</span></span>
<span class="line"><span>    jmp .while_loop</span></span>
<span class="line"><span>.while_end:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="switch-case-跳转表" tabindex="-1"><a class="header-anchor" href="#switch-case-跳转表"><span>switch-case（跳转表）</span></a></h3><p>对于多分支情况，跳转表比级联 if-else 更高效：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 跳转表实现 switch-case</span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    ; 跳转表：存储各 case 的地址</span></span>
<span class="line"><span>    jump_table dd case_0, case_1, case_2, case_3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    ; EAX = case 值 (0-3)</span></span>
<span class="line"><span>    cmp eax, 3</span></span>
<span class="line"><span>    ja default_case            ; 超出范围</span></span>
<span class="line"><span>    jmp [jump_table + eax*4]  ; 跳转到对应 case</span></span>
<span class="line"><span></span></span>
<span class="line"><span>case_0:</span></span>
<span class="line"><span>    ; 处理 case 0</span></span>
<span class="line"><span>    jmp switch_end</span></span>
<span class="line"><span>case_1:</span></span>
<span class="line"><span>    ; 处理 case 1</span></span>
<span class="line"><span>    jmp switch_end</span></span>
<span class="line"><span>case_2:</span></span>
<span class="line"><span>    ; 处理 case 2</span></span>
<span class="line"><span>    jmp switch_end</span></span>
<span class="line"><span>case_3:</span></span>
<span class="line"><span>    ; 处理 case 3</span></span>
<span class="line"><span>    jmp switch_end</span></span>
<span class="line"><span>default_case:</span></span>
<span class="line"><span>    ; 默认处理</span></span>
<span class="line"><span>switch_end:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9),i(d,{code:`eJxLy8kvT85ILCpRCHHiUgACx2glV8cIBVsFI6VYBV1dOwWnaCVn3wAFoKCOgrFSLFiRE0imRsnLUalGwSU6JTUtsTSnJD45sTgVRd7GFqijRsE5WskLaEJ0SWJSTqqCtoKRlkks1CBnsBWu0SCt8UaxXAA9niQV`}),o[4]||=n(`<h2 id="实战-二分查找" tabindex="-1"><a class="header-anchor" href="#实战-二分查找"><span>实战：二分查找</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; binary_search.asm - 二分查找</span></span>
<span class="line"><span>; 在已排序数组中查找目标值</span></span>
<span class="line"><span>; 输入: EAX = 目标值</span></span>
<span class="line"><span>; 输出: EAX = 索引（找到）或 -1（未找到）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    array dd 10, 20, 30, 40, 50, 60, 70, 80, 90, 100</span></span>
<span class="line"><span>    len   equ ($ - array) / 4</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    ; 查找 60</span></span>
<span class="line"><span>    mov eax, 60</span></span>
<span class="line"><span>    call binary_search</span></span>
<span class="line"><span>    ; EAX = 5（索引）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov ebx, eax</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>binary_search:</span></span>
<span class="line"><span>    ; 保存目标值</span></span>
<span class="line"><span>    push eax</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov ecx, 0                   ; low = 0</span></span>
<span class="line"><span>    mov edx, len - 1             ; high = len - 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.search_loop:</span></span>
<span class="line"><span>    cmp ecx, edx</span></span>
<span class="line"><span>    jg .not_found                ; low &gt; high → 未找到</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; mid = (low + high) / 2</span></span>
<span class="line"><span>    mov eax, ecx</span></span>
<span class="line"><span>    add eax, edx</span></span>
<span class="line"><span>    shr eax, 1                   ; EAX = mid</span></span>
<span class="line"><span>    mov esi, eax                 ; ESI = mid</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 比较 array[mid] 与目标</span></span>
<span class="line"><span>    mov edi, [array + esi*4]</span></span>
<span class="line"><span>    cmp edi, [esp]               ; 与栈上的目标值比较</span></span>
<span class="line"><span>    je .found                    ; 相等 → 找到</span></span>
<span class="line"><span>    jl .search_high              ; array[mid] &lt; target → 搜索右半</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; array[mid] &gt; target → 搜索左半</span></span>
<span class="line"><span>    lea edx, [esi - 1]           ; high = mid - 1</span></span>
<span class="line"><span>    jmp .search_loop</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.search_high:</span></span>
<span class="line"><span>    lea ecx, [esi + 1]           ; low = mid + 1</span></span>
<span class="line"><span>    jmp .search_loop</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.found:</span></span>
<span class="line"><span>    mov eax, esi                 ; 返回索引</span></span>
<span class="line"><span>    add esp, 4                   ; 清理栈</span></span>
<span class="line"><span>    ret</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.not_found:</span></span>
<span class="line"><span>    mov eax, -1                  ; 返回 -1</span></span>
<span class="line"><span>    add esp, 4</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实战-斐波那契数列" tabindex="-1"><a class="header-anchor" href="#实战-斐波那契数列"><span>实战：斐波那契数列</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; fibonacci.asm - 计算第 N 个斐波那契数</span></span>
<span class="line"><span>; 编译: nasm -f elf32 fibonacci.asm -o fibonacci.o</span></span>
<span class="line"><span>; 链接: gcc -m32 fibonacci.o -o fibonacci -nostdlib</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    n dd 10                      ; 计算第 10 个斐波那契数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    mov ecx, [n]                 ; N</span></span>
<span class="line"><span>    call fib</span></span>
<span class="line"><span>    ; EAX = F(10) = 55</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov ebx, eax</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; fib - 计算第 N 个斐波那契数（迭代法）</span></span>
<span class="line"><span>; 输入: ECX = N</span></span>
<span class="line"><span>; 输出: EAX = F(N)</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>fib:</span></span>
<span class="line"><span>    cmp ecx, 0</span></span>
<span class="line"><span>    je .fib_zero</span></span>
<span class="line"><span>    cmp ecx, 1</span></span>
<span class="line"><span>    je .fib_one</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov eax, 0                   ; a = F(0) = 0</span></span>
<span class="line"><span>    mov edx, 1                   ; b = F(1) = 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.fib_loop:</span></span>
<span class="line"><span>    mov ebx, eax</span></span>
<span class="line"><span>    add ebx, edx                 ; temp = a + b</span></span>
<span class="line"><span>    mov eax, edx                 ; a = b</span></span>
<span class="line"><span>    mov edx, ebx                 ; b = temp</span></span>
<span class="line"><span>    dec ecx</span></span>
<span class="line"><span>    cmp ecx, 1</span></span>
<span class="line"><span>    jg .fib_loop</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov eax, edx                 ; 返回 b</span></span>
<span class="line"><span>    ret</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.fib_zero:</span></span>
<span class="line"><span>    xor eax, eax                 ; F(0) = 0</span></span>
<span class="line"><span>    ret</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.fib_one:</span></span>
<span class="line"><span>    mov eax, 1                   ; F(1) = 1</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>验证：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">./fibonacci</span><span style="color:#ABB2BF;">; </span><span style="color:#56B6C2;">echo</span><span style="color:#E5C07B;"> $?</span><span style="color:#7F848E;font-style:italic;">    # 输出 55 (F(10)=55)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2>`,7),i(d,{code:`eJzLzcxLyU0s4FJQKMrPL9HQeNa3/GnHtmdbGzU1gWIKCs/WT3mxr/lZT/uT3UvAAgoKzr4BCi/W7Xu+d92zBe1P909/srcXKhPiGhyiAOQ+29r9Yv1UsOCL7Ztf7F2Dov/Z9AXP5i58snubgpdvAELs+ZplT/u3K3g56ns56Xs5ugIpV5jsnE6YrLu+l4++lztQ1gcm+3z2judrOxW8gGJ+ELGn+1Y971sPlfbx9w9QcHWOeNkw6Wl7P8zEzu6nXSsUXFydtb38osCCL1fPeL5r+fPdk5/Na4GqykzTTc0pTlV41DYJ5Gttr+RkqExafhFCFO6L4vLMkuQMsATE3y8WruACAOF+jzw=`}),o[5]||=n(`<div class="hint-container tip"><p class="hint-container-title">面试要点</p><ul><li>CMP 做减法设标志位，不保存结果；TEST 做 AND 设标志位，不保存结果</li><li>无符号比较用 JA/JB 系列，有符号比较用 JG/JL 系列——用错是经典 bug</li><li>LOOP 指令自动递减 ECX，但现代代码更常用 <code>dec + jnz</code></li><li>switch-case 可用跳转表实现，O(1) 时间复杂度</li><li>条件跳转是短距离跳转（-128~+127 字节），长距离需要反条件跳转+JMP 组合</li></ul></div><div class="hint-container info"><p class="hint-container-title">原著参考</p><p>本章内容参考自《汇编语言：基于Linux环境（第3版）》Jeff Duntemann 第9章&quot;Bits, Flags, Branches, and Tables&quot;。书中用&quot;记分牌&quot;比喻标志位，并详细讲解了跳转表的技术。</p></div>`,2)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};