import{A as e,E as t,d as n,f as r,l as i,p as a,s as o}from"./runtime-core.esm-bundler-BVtXrkU4.js";import{t as s}from"./app-DixIL8sc.js";var c=JSON.parse(`{"path":"/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%AD%A6%E7%A7%91/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80/05_%E7%B3%BB%E7%BB%9F%E8%B0%83%E7%94%A8%E4%B8%8EIO/03_%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86.html","title":"内存管理","lang":"zh-CN","frontmatter":{"title":"内存管理","icon":"fa6-solid:memory","order":3,"category":["计算机学科","汇编语言"],"tag":["内存"]},"git":{"createdTime":1780564101000,"updatedTime":1780564101000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":6.97,"words":2092},"filePathRelative":"计算机学科/汇编语言/05_系统调用与IO/03_内存管理.md"}`),l={name:`03_内存管理.md`};function u(s,c,l,u,d,f){let p=e(`Mermaid`);return t(),i(`div`,null,[c[0]||=o(`h1`,{id:`内存管理`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#内存管理`},[o(`span`,null,`内存管理`)])],-1),c[1]||=o(`h2`,{id:`从程序视角看内存`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#从程序视角看内存`},[o(`span`,null,`从程序视角看内存`)])],-1),c[2]||=o(`p`,null,[r(`在汇编层面，你直接面对的是`),o(`strong`,null,`虚拟地址空间`),r(`——操作系统给每个进程营造的"独占内存"幻觉。理解进程的内存布局，是理解变量存储、动态分配、栈溢出等问题的前提。`)],-1),a(p,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggyFF/tnP1/R/WLmrGfd85/O2fB0bsPzlbteTt+iYGz0ZG8vWC0IpGQWpSaXZObnKTiFwAW9o5UMKpwNIEDhaVvrswU7ILptkor07d7v6Xg+ZcWzju1PdvQ+7V//Yt3+l9PXvd/TqRQLNyHYKFrp2YKOpz27FB61TVB4OmHik719EGc8XTTv5dT9SGp9gWqBdjxdO+PZjAVPN7SANOXmJhYgKfEAqljQBjFtEsi0l6tn4DDNKVrJKTj42bqtCs/mrHraMffp8u6nPdOeTd3wrHcdkjIXoPvAYiCVT7dvwq0yJFrpye7Fzxc0glX2r3qxfjfQ0886l79Y2IOkLAgUZgYWBiYWoDADBv3TXf0vtm4HGgpVlJqXwgUAjSPHVA==`}),c[3]||=n(`<h2 id="进程内存布局详解" tabindex="-1"><a class="header-anchor" href="#进程内存布局详解"><span>进程内存布局详解</span></a></h2><h3 id="代码段-text" tabindex="-1"><a class="header-anchor" href="#代码段-text"><span>代码段（.text）</span></a></h3><p>存放机器指令，权限为<strong>可读可执行</strong>（r-x）。尝试写入会触发段错误。</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    ; 这里的指令存储在代码段</span></span>
<span class="line"><span>    ; 地址通常从 0x08048000 开始（32位）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="数据段-data" tabindex="-1"><a class="header-anchor" href="#数据段-data"><span>数据段（.data）</span></a></h3><p>存放已初始化的全局变量和静态变量，权限为<strong>可读可写</strong>（rw-）。</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>section .data</span></span>
<span class="line"><span>    counter dd 0              ; 已初始化全局变量</span></span>
<span class="line"><span>    message db &#39;Hello&#39;, 0     ; 已初始化字符串</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="bss-段-bss" tabindex="-1"><a class="header-anchor" href="#bss-段-bss"><span>BSS 段（.bss）</span></a></h3><p>存放未初始化的全局变量，运行时由内核清零。<strong>不占可执行文件空间</strong>。</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>section .bss</span></span>
<span class="line"><span>    buffer resb 1024          ; 未初始化缓冲区</span></span>
<span class="line"><span>    array  resd 100           ; 未初始化数组</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="堆-heap" tabindex="-1"><a class="header-anchor" href="#堆-heap"><span>堆（Heap）</span></a></h3><p>动态分配的内存区域，通过 <code>brk</code>/<code>sbrk</code> 或 <code>mmap</code> 系统调用扩展：</p>`,12),a(p,{code:`eJxLy8kvT85ILCpR8AniUgCC4tKk9KLEggyFpwvans9qebpo3sup+8EyIJCSWZSaXJKZnwdTDgKO0UpJRdkKT/dOftrZ+2Rv7/O965RiFXR17RRqlIqBMhrafppKNQpO0UrPpm1QAAooxcL1Oino6oEVAqWedrS9bO31e7p2+ouuJqAG52ilp/3rn09ZAXLKyl0vp2+BakzNS+ECADy6SGU=`}),c[4]||=n(`<h3 id="栈-stack" tabindex="-1"><a class="header-anchor" href="#栈-stack"><span>栈（Stack）</span></a></h3><p>函数调用、局部变量、返回地址的存储区域，向低地址增长：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 栈的增长方向</span></span>
<span class="line"><span>push eax    ; ESP -= 4, [ESP] = EAX  （向低地址）</span></span>
<span class="line"><span>pop eax     ; EAX = [ESP], ESP += 4  （向高地址）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">栈与堆的碰撞</p><p>如果栈和堆向对方增长到重叠，就会导致内存耗尽。Linux 会在栈溢出时发送 SIGSEGV 信号，杀死进程。可用 <code>ulimit -s</code> 查看栈大小限制。</p></div><h2 id="brk-sbrk-堆内存分配" tabindex="-1"><a class="header-anchor" href="#brk-sbrk-堆内存分配"><span>brk / sbrk - 堆内存分配</span></a></h2><p><code>brk</code> 系统调用改变进程数据段的末尾地址（即&quot;program break&quot;），是最基础的堆内存管理方式。</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; int brk(void *addr)</span></span>
<span class="line"><span>; 设置新的 program break</span></span>
<span class="line"><span>mov eax, 45             ; sys_brk (32位)</span></span>
<span class="line"><span>mov ebx, new_addr       ; 新的断点地址</span></span>
<span class="line"><span>int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 获取当前 program break</span></span>
<span class="line"><span>mov eax, 45</span></span>
<span class="line"><span>xor ebx, ebx            ; 0 = 查询当前值</span></span>
<span class="line"><span>int 0x80</span></span>
<span class="line"><span>; EAX = 当前 program break 地址</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实现-malloc-的核心逻辑" tabindex="-1"><a class="header-anchor" href="#实现-malloc-的核心逻辑"><span>实现 malloc 的核心逻辑</span></a></h3><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; simple_malloc.asm - 简易 malloc/free 实现</span></span>
<span class="line"><span>; 编译: nasm -f elf32 simple_malloc.asm -o simple_malloc.o</span></span>
<span class="line"><span>; 链接: gcc -m32 simple_malloc.o -o simple_malloc -nostdlib</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .bss</span></span>
<span class="line"><span>    current_brk resd 1        ; 当前 program break</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    test_ptr dd 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    ; 初始化：获取当前 brk</span></span>
<span class="line"><span>    call init_brk</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 分配 1024 字节</span></span>
<span class="line"><span>    push dword 1024</span></span>
<span class="line"><span>    call my_malloc</span></span>
<span class="line"><span>    add esp, 4</span></span>
<span class="line"><span>    mov [test_ptr], eax       ; 保存分配的指针</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 向分配的内存写入数据</span></span>
<span class="line"><span>    mov ecx, 256</span></span>
<span class="line"><span>    mov edi, [test_ptr]</span></span>
<span class="line"><span>    mov al, 0xAA</span></span>
<span class="line"><span>    cld</span></span>
<span class="line"><span>    rep stosb                 ; 填充 0xAA</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 使用完毕，退出</span></span>
<span class="line"><span>    mov ebx, 0</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; init_brk - 初始化堆</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>init_brk:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span>    mov eax, 45              ; sys_brk</span></span>
<span class="line"><span>    xor ebx, ebx             ; 查询当前值</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span>    mov [current_brk], eax</span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>; my_malloc - 简易内存分配</span></span>
<span class="line"><span>; 输入: [ebp+8] = 字节数</span></span>
<span class="line"><span>; 输出: EAX = 分配的内存地址（或 0 失败）</span></span>
<span class="line"><span>; ============================================</span></span>
<span class="line"><span>my_malloc:</span></span>
<span class="line"><span>    push ebp</span></span>
<span class="line"><span>    mov ebp, esp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 对齐到 4 字节</span></span>
<span class="line"><span>    mov eax, [ebp+8]</span></span>
<span class="line"><span>    add eax, 3</span></span>
<span class="line"><span>    and eax, ~3              ; 向上对齐</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 保存大小（简单实现：在分配的内存前4字节存储大小）</span></span>
<span class="line"><span>    add eax, 4               ; 额外 4 字节存 header</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 扩展 brk</span></span>
<span class="line"><span>    mov ecx, [current_brk]   ; 当前 brk</span></span>
<span class="line"><span>    add ecx, eax             ; 新 brk</span></span>
<span class="line"><span>    push ecx</span></span>
<span class="line"><span>    mov eax, 45              ; sys_brk</span></span>
<span class="line"><span>    mov ebx, ecx             ; 新 brk 地址</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span>    pop ecx</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    cmp eax, 0</span></span>
<span class="line"><span>    jl .malloc_fail</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 返回分配的内存地址（跳过 header）</span></span>
<span class="line"><span>    mov eax, [current_brk]</span></span>
<span class="line"><span>    mov edx, [ebp+8]         ; 原始请求大小</span></span>
<span class="line"><span>    add edx, 3</span></span>
<span class="line"><span>    and edx, ~3</span></span>
<span class="line"><span>    mov [eax], edx            ; 存储大小到 header</span></span>
<span class="line"><span>    add eax, 4               ; 跳过 header</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 更新 current_brk</span></span>
<span class="line"><span>    mov [current_brk], ecx</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    jmp .malloc_done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.malloc_fail:</span></span>
<span class="line"><span>    xor eax, eax              ; 返回 NULL</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.malloc_done:</span></span>
<span class="line"><span>    mov esp, ebp</span></span>
<span class="line"><span>    pop ebp</span></span>
<span class="line"><span>    ret</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="mmap-内存映射" tabindex="-1"><a class="header-anchor" href="#mmap-内存映射"><span>mmap - 内存映射</span></a></h2><p><code>mmap</code> 比 <code>brk</code> 更灵活，可以映射文件到内存、分配匿名内存：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; void *mmap(void *addr, size_t length, int prot,</span></span>
<span class="line"><span>;             int flags, int fd, off_t offset)</span></span>
<span class="line"><span>mov eax, 90             ; sys_mmap (32位)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 参数压栈（从右到左）</span></span>
<span class="line"><span>push dword 0            ; offset = 0</span></span>
<span class="line"><span>push dword -1           ; fd = -1 (匿名映射)</span></span>
<span class="line"><span>push dword 0x22         ; flags = MAP_PRIVATE | MAP_ANONYMOUS</span></span>
<span class="line"><span>push dword 3            ; prot = PROT_READ | PROT_WRITE</span></span>
<span class="line"><span>push dword 4096         ; length = 4096 字节</span></span>
<span class="line"><span>push dword 0            ; addr = NULL (内核选择地址)</span></span>
<span class="line"><span>call mmap</span></span>
<span class="line"><span>add esp, 24</span></span>
<span class="line"><span>; EAX = 映射的内存地址</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="mmap-保护标志" tabindex="-1"><a class="header-anchor" href="#mmap-保护标志"><span>mmap 保护标志</span></a></h3><table><thead><tr><th>标志</th><th>值</th><th>含义</th></tr></thead><tbody><tr><td>PROT_READ</td><td>1</td><td>可读</td></tr><tr><td>PROT_WRITE</td><td>2</td><td>可写</td></tr><tr><td>PROT_EXEC</td><td>4</td><td>可执行</td></tr></tbody></table><h3 id="mmap-映射标志" tabindex="-1"><a class="header-anchor" href="#mmap-映射标志"><span>mmap 映射标志</span></a></h3><table><thead><tr><th>标志</th><th>值</th><th>含义</th></tr></thead><tbody><tr><td>MAP_SHARED</td><td>1</td><td>共享映射</td></tr><tr><td>MAP_PRIVATE</td><td>2</td><td>私有映射</td></tr><tr><td>MAP_ANONYMOUS</td><td>0x20</td><td>匿名映射（不关联文件）</td></tr></tbody></table>`,16),a(p,{code:`eJxLy8kvT85ILCpRCHHiUgCC4tKk9KLEggyF3NzEAoXnU1a8bJgClgABx2ilpz37n07ofTZjwdMNLQqP2iYp5Cbm5OQnK8XCFTlFKz2b1v5k9zYkRRABT38kZc5As1o3Ptm1+mlb69O1M8DKPAOcoSpS81K4AC/bP30=`}),c[5]||=n(`<h2 id="munmap-释放映射" tabindex="-1"><a class="header-anchor" href="#munmap-释放映射"><span>munmap - 释放映射</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; int munmap(void *addr, size_t length)</span></span>
<span class="line"><span>mov eax, 91             ; sys_munmap</span></span>
<span class="line"><span>mov ebx, mapped_addr</span></span>
<span class="line"><span>mov ecx, mapped_length</span></span>
<span class="line"><span>int 0x80</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实战-用-mmap-分配可执行内存" tabindex="-1"><a class="header-anchor" href="#实战-用-mmap-分配可执行内存"><span>实战：用 mmap 分配可执行内存</span></a></h2><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; exec_mem.asm - 分配可执行内存并运行动态生成的代码</span></span>
<span class="line"><span>; 编译: nasm -f elf32 exec_mem.asm -o exec_mem.o</span></span>
<span class="line"><span>; 链接: ld -m elf_i386 exec_mem.o -o exec_mem</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .data</span></span>
<span class="line"><span>    success_msg db &#39;Dynamic code executed! Result: &#39;, 0</span></span>
<span class="line"><span>    success_len equ $ - success_msg</span></span>
<span class="line"><span>    newline db 0xA</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .bss</span></span>
<span class="line"><span>    result resd 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>section .text</span></span>
<span class="line"><span>    global _start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>_start:</span></span>
<span class="line"><span>    ; mmap 分配可读可写可执行的内存</span></span>
<span class="line"><span>    mov eax, 90           ; sys_mmap</span></span>
<span class="line"><span>    xor ebx, ebx          ; addr = NULL</span></span>
<span class="line"><span>    mov ecx, 4096         ; length</span></span>
<span class="line"><span>    mov edx, 7            ; prot = PROT_READ|PROT_WRITE|PROT_EXEC</span></span>
<span class="line"><span>    mov esi, 0x22         ; flags = MAP_PRIVATE|MAP_ANONYMOUS</span></span>
<span class="line"><span>    mov edi, -1           ; fd = -1</span></span>
<span class="line"><span>    xor ebp, ebp          ; offset = 0</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; EAX = 映射的内存地址</span></span>
<span class="line"><span>    cmp eax, 0</span></span>
<span class="line"><span>    jl .mmap_fail</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 在映射内存中生成代码：mov eax, 42; ret</span></span>
<span class="line"><span>    mov ecx, eax          ; 保存基地址</span></span>
<span class="line"><span>    mov byte [eax], 0xB8  ; mov eax, imm32</span></span>
<span class="line"><span>    mov dword [eax+1], 42</span></span>
<span class="line"><span>    mov byte [eax+5], 0xC3 ; ret</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 执行动态生成的代码</span></span>
<span class="line"><span>    call ecx</span></span>
<span class="line"><span>    ; EAX = 42</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mov [result], eax</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 释放映射</span></span>
<span class="line"><span>    mov eax, 91           ; sys_munmap</span></span>
<span class="line"><span>    mov ebx, ecx          ; 地址</span></span>
<span class="line"><span>    mov ecx, 4096         ; 大小</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ; 用退出码返回结果</span></span>
<span class="line"><span>    mov ebx, [result]</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    int 0x80</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.mmap_fail:</span></span>
<span class="line"><span>    mov eax, 1</span></span>
<span class="line"><span>    mov ebx, 1</span></span>
<span class="line"><span>    int 0x80</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">可执行内存与安全</p><p>分配 RWX（可读可写可执行）内存在安全上是危险的——攻击者可以写入恶意代码并执行。现代操作系统通过 NX bit（No-eXecute）和 W^X（Write XOR Execute）策略限制此类操作。上面的例子仅作教学，生产环境应避免 RWX 映射。</p></div><h2 id="内存保护-mprotect" tabindex="-1"><a class="header-anchor" href="#内存保护-mprotect"><span>内存保护：mprotect</span></a></h2><p>可以在运行时修改内存区域的权限：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; int mprotect(void *addr, size_t len, int prot)</span></span>
<span class="line"><span>mov eax, 125            ; sys_mprotect (32位)</span></span>
<span class="line"><span>mov ebx, page_addr      ; 必须页对齐</span></span>
<span class="line"><span>mov ecx, page_size      ; 必须是页大小的倍数</span></span>
<span class="line"><span>mov edx, prot           ; 新权限</span></span>
<span class="line"><span>int 0x80</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>常见模式：先 RW 写入代码，再改为 RX 执行：</p><div class="language-nasm line-numbers-mode" data-highlighter="shiki" data-ext="nasm" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nasm"><span class="line"><span>; 1. 分配 RW 内存</span></span>
<span class="line"><span>; mmap(..., PROT_READ|PROT_WRITE, ...)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 2. 写入代码到该内存</span></span>
<span class="line"><span>; mov [code_page], ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 3. 改为 RX 执行</span></span>
<span class="line"><span>; mprotect(code_page, 4096, PROT_READ|PROT_EXEC)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>; 4. 调用代码</span></span>
<span class="line"><span>; call code_page</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="虚拟内存与物理内存" tabindex="-1"><a class="header-anchor" href="#虚拟内存与物理内存"><span>虚拟内存与物理内存</span></a></h2>`,11),a(p,{code:`eJxLy8kvT85ILCpR8AniUgCC4tKk9KLEggyFFzNnPeue/3TOhqdzG8AyIBDmGK1kUGFgYWBiYWBgYJNUpG/3Yv/s5yu6n8/pftqxQSkWrDI1LwXVrJcLt75YuAJuSkBItBJQ6PnsdU/3TlV41DYJqgDGfLawDZdJzztXPp/Q9rSt9enaGQjzwK4yNDI2MYW56um6eS9ntj7Z2/t87zo0s8IcFXR17YCOgFCOXABM8GNM`}),c[6]||=o(`ul`,null,[o(`li`,null,`每个进程有独立的页表，虚拟地址映射到不同的物理地址`),o(`li`,null,`未访问的页不占物理内存（按需分配）`),o(`li`,null,[r(`访问未映射的页触发`),o(`strong`,null,`缺页中断`),r(`（Page Fault），内核负责分配物理页`)])],-1),c[7]||=o(`div`,{class:`hint-container tip`},[o(`p`,{class:`hint-container-title`},`页大小`),o(`p`,null,`x86 默认页大小 4KB，x86-64 支持 2MB/1GB 大页（Huge Pages）。内存相关系统调用的参数必须是页对齐的。`)],-1),c[8]||=o(`h2`,{id:`小结`,tabindex:`-1`},[o(`a`,{class:`header-anchor`,href:`#小结`},[o(`span`,null,`小结`)])],-1),a(p,{code:`eJxVkM9OwkAQh+88xRzhgF58Aq4mXrh4BeFADH/SrsoRrC0Ug+mhGDAS2piYcmgtIU2KFXmZzm77FpZ2iXDZ7Hzf5JeZaTZatWalkwMQ2m2Sz6Mioz1ljsk0pVBIMECG0Jdw1UsBQBh8MKNPHQ/OSL1LQCh2uaETl46d1NQqpALCQ5GbUrmc4qooHlE0FMCRRXt9HCqxPD7EGEPAwTZJi1yJ6VaK2TpgweIIAFSF23MxefY5VF3iasJFM1mKT06nBrpPB37X2pt4MKL676npCG1SvyEQ7hyqb+hcimdadgB5HesO/XzEncebo9kbfV7gu4vzHtyLwNRlcrCs5i2x6UWmFfov7Oc7+Ye+TV/tf4dfm3irwcVlibOra6g2CKCjomzl/gDmnbxe`}),c[9]||=n(`<div class="hint-container tip"><p class="hint-container-title">面试要点</p><ul><li>进程内存布局：代码段→数据段→BSS→堆→ mmap→栈→内核空间</li><li><code>brk</code> 扩展堆，<code>mmap</code> 分配映射内存——两者是 malloc 的底层实现</li><li>BSS 段不占可执行文件空间，运行时由内核清零</li><li>栈向低地址增长，堆向高地址增长，碰头则内存耗尽</li><li>mmap 分配匿名内存是最灵活的分配方式，支持自定义权限</li><li>mprotect 可修改内存权限，实现&quot;先写后执行&quot;（W^X）安全策略</li><li>内存操作必须页对齐（4KB），否则系统调用会失败</li></ul></div><div class="hint-container info"><p class="hint-container-title">原著参考</p><p>本章内容参考自《汇编语言：基于Linux环境（第3版）》Jeff Duntemann 第13章&quot;Heading for 64-bit&quot;及第12章中关于内存管理的讨论。书中从程序员视角详细讲解了 Linux 内存管理接口。</p></div>`,2)])}var d=s(l,[[`render`,u]]);export{c as _pageData,d as default};