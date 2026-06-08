import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-CtmVft7R.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/02_%E6%A0%B8%E5%BF%83%E9%85%8D%E7%BD%AE%E6%8C%87%E4%BB%A4/01_%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E7%BB%93%E6%9E%84%E4%B8%8E%E6%8C%87%E4%BB%A4%E8%AF%AD%E6%B3%95.html","title":"配置文件结构与指令语法","lang":"zh-CN","frontmatter":{"title":"配置文件结构与指令语法","icon":"fa6-solid:code","order":1,"category":["Linux","Nginx"],"tag":["Nginx","配置语法","指令","上下文","继承"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":18.96,"words":5687},"filePathRelative":"Linux/07_Nginx/02_核心配置指令/01_配置文件结构与指令语法.md"}`),s={name:`01_配置文件结构与指令语法.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="配置文件结构与指令语法" tabindex="-1"><a class="header-anchor" href="#配置文件结构与指令语法"><span>配置文件结构与指令语法</span></a></h1><h2 id="_1-简单指令与块指令" tabindex="-1"><a class="header-anchor" href="#_1-简单指令与块指令"><span>1. 简单指令与块指令</span></a></h2><h3 id="_1-1-指令分类" tabindex="-1"><a class="header-anchor" href="#_1-1-指令分类"><span>1.1 指令分类</span></a></h3><p>Nginx 配置文件中的指令分为两大类：</p><table><thead><tr><th>类型</th><th>语法</th><th>示例</th><th>终止符</th></tr></thead><tbody><tr><td>简单指令</td><td><code>指令名 参数;</code></td><td><code>worker_processes auto;</code></td><td>分号 <code>;</code></td></tr><tr><td>块指令</td><td><code>指令名 参数 { ... }</code></td><td><code>http { ... }</code></td><td>右花括号 <code>}</code></td></tr></tbody></table><h3 id="_1-2-简单指令" tabindex="-1"><a class="header-anchor" href="#_1-2-简单指令"><span>1.2 简单指令</span></a></h3><p>简单指令由指令名、参数和分号组成：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基本格式：指令名 参数1 参数2 ... ;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 带参数指令（on/off 是参数，不是指令名的一部分）</span></span>
<span class="line"><span style="color:#C678DD;">sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 单参数指令</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">pid </span><span style="color:#ABB2BF;">/var/run/nginx.pid;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 多参数指令</span></span>
<span class="line"><span style="color:#C678DD;">gzip_types </span><span style="color:#ABB2BF;">text/plain text/css application/json;</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">example.com www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 带引号的参数（包含空格时）</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#98C379;">&quot;hello world.example.com&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 带单位的参数</span></span>
<span class="line"><span style="color:#C678DD;">client_max_body_size </span><span style="color:#D19A66;">20m</span><span style="color:#ABB2BF;">;        </span><span style="color:#7F848E;font-style:italic;"># 20 兆字节</span></span>
<span class="line"><span style="color:#C678DD;">keepalive_timeout </span><span style="color:#D19A66;">65s</span><span style="color:#ABB2BF;">;            </span><span style="color:#7F848E;font-style:italic;"># 65 秒</span></span>
<span class="line"><span style="color:#C678DD;">proxy_cache_path </span><span style="color:#ABB2BF;">/var/cache/nginx levels=1:2 keys_zone=my_cache:10m;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-块指令" tabindex="-1"><a class="header-anchor" href="#_1-3-块指令"><span>1.3 块指令</span></a></h3><p>块指令用花括号 <code>{}</code> 包含一组子指令：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基本格式：指令名 参数 { 子指令... }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 无参数块指令</span></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">1024</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 带参数块指令</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 带多个参数的块指令</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.1:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    server 10.0.0.2:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-4-语法树结构" tabindex="-1"><a class="header-anchor" href="#_1-4-语法树结构"><span>1.4 语法树结构</span></a></h3>`,12),i(d,{code:`eJyNkstO20AUhvc8xdGwLbbjOCShFVJJE3VRNVWw2IyqyHWOk1HHM9bM5IKqrnvb91lY8DiILa/AxJdgQ0B4Ydk+3/l/n//MXEXZAsKzA7DXZDwOKRFzJjZOLEXy7ptyT++uf6cRE3Bz9ffm6t/t/19313/I14NdAxwdncKHFiVLjQry5re23iz7lKyl+o5qmikZo9aoIVoa+ZRsU4JKSTXlcg7uKlKufXBzWTcvOPZ929bsG14MP4fntneFwmj4AT9L5aJQaAe7v7DTCYwNk0JDy/OD6j/qdIeSdMkNm0ZxjJkBKZ7afgzDL5QsjMlqltuPhcQxJUzEfDlDSFmKjrnMUFdeD1iXEo1iljCOdZcdcD6cXAwnNmKb8MqG/GBVVgqZHiWcaYMCel5l0gD6lcJURCkCbqI042hXne7DP40H1pLLONrmBG7Ndlsq9+5RoqQ0xarW67W7MCmv5GqclWJihhvI705F7RvUHpZnBvVLMUuUkwZBG7TeGTYxe5bq80YZcx7NnDdpc2mDz3dqV8BPDkejTtf338SSS3VymCRJDStPSAH6rf7xqL0fzIcqsGDwftTx9mNV4pVzv+e9SPqvIPPYC6w/8LtnDewesD0lhQ==`}),o[1]||=n(`<h3 id="_1-5-语法规则详解" tabindex="-1"><a class="header-anchor" href="#_1-5-语法规则详解"><span>1.5 语法规则详解</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 规则1：每条简单指令必须以分号结尾 =====</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;   </span><span style="color:#7F848E;font-style:italic;"># 正确</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># worker_processes auto   # 错误：缺少分号</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 规则2：块指令用花括号包裹，不需要分号 =====</span></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">1024</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 子指令需要分号</span></span>
<span class="line"><span style="color:#ABB2BF;">}   </span><span style="color:#7F848E;font-style:italic;"># 块指令以花括号结束，不需要分号</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 规则3：指令参数用空格分隔 =====</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#ABB2BF;">example.com www.example.com;   </span><span style="color:#7F848E;font-style:italic;"># 两个参数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 规则4：参数可以用引号包裹 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 单引号：不转义</span></span>
<span class="line"><span style="color:#C678DD;">server_name </span><span style="color:#98C379;">&#39;example.com&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 双引号：支持转义</span></span>
<span class="line"><span style="color:#C678DD;">log_format </span><span style="color:#D19A66;">main</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 规则5：注释以 # 开头 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 这是一行注释</span></span>
<span class="line"><span style="color:#C678DD;">sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 行尾注释</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 规则6：指令名区分大小写（必须全小写） =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 以下写法会报错</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Worker_Processes auto;  ← 错误！指令名区分大小写</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 规则7：参数可以包含正则表达式 =====</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">^/api/v[0-9]+/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ~ 区分大小写正则</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ~* 不区分大小写正则</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 规则8：特殊参数语法 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># key=value 参数</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> 10.0.0.1:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> max_fails=2 </span><span style="color:#E06C75;font-style:italic;">fail_timeout</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 路径参数</span></span>
<span class="line"><span style="color:#ABB2BF;">proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">配置文件编码</p><p>Nginx 配置文件必须使用 UTF-8 或 ASCII 编码，不支持其他编码。如果配置文件中包含中文字符（如中文域名或注释），务必确保文件保存为 UTF-8 编码。参考：<a href="https://nginx.org/en/docs/beginners_guide.html" target="_blank" rel="noopener noreferrer">https://nginx.org/en/docs/beginners_guide.html</a></p></div><h2 id="_2-指令上下文层级" tabindex="-1"><a class="header-anchor" href="#_2-指令上下文层级"><span>2. 指令上下文层级</span></a></h2><h3 id="_2-1-上下文类型与层级" tabindex="-1"><a class="header-anchor" href="#_2-1-上下文类型与层级"><span>2.1 上下文类型与层级</span></a></h3><p>Nginx 配置的指令必须在正确的上下文中使用，上下文决定了指令的作用域：</p>`,6),i(d,{code:`eJyFk19P01AYxu/5FEu5lYBTxBFDUmqrTdatboXENGapSwtNurZ2lQSvcJE/YSJcmIWZiRIx4UawF8pCY/wyPafsW3h6zlq7MrRXbfN7nvd9z/ucFUexV3PS4kQOPQLNl2Sqoejmg+fO9ALYPAXeRtDfDfpt2NnG/2BvA5x0gNeink0kmtzU1EKOXWZLUlWm1DXVdJsYDi7bgf9zsLkX/jpD/Aj+WJJEmVp1XRuj0Sfs7YHd4yxYlSosLchU03VUpYFhiRGnlx6Kgf8lPNjK8uiliIcwMDtonaEeEhSzUTHMLomx+0s75U8aAd3T0H8ztE8kVbayzFZQO6qzpjoYv+p+gO1PQd+HvcssLtBoyoZChgT7h4PtfXj4GXy/5vuILcvUimphkBfHQ1WxyEuotm3obq1u6MlJg50t+ON1FpeeiizaiLtuqwQTeIENPR8ctbNokRd4qVZhn8iUoTeQu6O+qL2yTJVMeH4Bvdage4CKgLfXhiRiplxC6SHqumWaKfnvI/jua1qO9eQoiUOZoSW+HOmtuuLqFkkgqXt1cR6+94ZFUyKeq6HpdI3s7OMx2jPYOYGdb3GB2DWmUS7+QZMojOQi8v9fMlIy0lskujkdcViLaUUU778KEtnkNmBF0103VBJyTTeM+UmOm53L52/VLcNy5ic1TUtheDEEu8vQ3OzMeIzc2CGYv124x90ZDw5HjAsX7s/c4IjnIliByc8tjmB/ADIXls8=`}),o[2]||=n(`<h3 id="_2-2-各上下文详解" tabindex="-1"><a class="header-anchor" href="#_2-2-各上下文详解"><span>2.2 各上下文详解</span></a></h3><h4 id="main-上下文-全局" tabindex="-1"><a class="header-anchor" href="#main-上下文-全局"><span>main 上下文（全局）</span></a></h4><p>main 上下文是配置文件的最外层，不包含在任何花括号内：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># main 上下文中的指令</span></span>
<span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;">nginx;                    </span><span style="color:#7F848E;font-style:italic;"># Worker 进程用户</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;         </span><span style="color:#7F848E;font-style:italic;"># Worker 进程数</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 文件描述符限制</span></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 错误日志</span></span>
<span class="line"><span style="color:#C678DD;">pid </span><span style="color:#ABB2BF;">/var/run/nginx.pid;        </span><span style="color:#7F848E;font-style:italic;"># PID 文件</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># main 上下文可包含的块指令</span></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> { ... }</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> { ... }</span></span>
<span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> { ... }</span></span>
<span class="line"><span style="color:#C678DD;">mail</span><span style="color:#ABB2BF;"> { ... }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>main 上下文常用指令：</p><table><thead><tr><th>指令</th><th>语法</th><th>说明</th></tr></thead><tbody><tr><td><code>user</code></td><td><code>user user [group];</code></td><td>Worker 进程运行用户</td></tr><tr><td><code>worker_processes</code></td><td><code>worker_processes number | auto;</code></td><td>Worker 进程数</td></tr><tr><td><code>worker_rlimit_nofile</code></td><td><code>worker_rlimit_nofile number;</code></td><td>文件描述符限制</td></tr><tr><td><code>worker_priority</code></td><td><code>worker_priority number;</code></td><td>Worker 进程优先级</td></tr><tr><td><code>worker_cpu_affinity</code></td><td><code>worker_cpu_affinity auto;</code></td><td>CPU 亲和绑定</td></tr><tr><td><code>error_log</code></td><td><code>error_log file [level];</code></td><td>错误日志</td></tr><tr><td><code>pid</code></td><td><code>pid file;</code></td><td>PID 文件路径</td></tr><tr><td><code>daemon</code></td><td><code>daemon on | off;</code></td><td>是否以守护进程运行</td></tr><tr><td><code>env</code></td><td><code>env variable[=value];</code></td><td>环境变量</td></tr><tr><td><code>load_module</code></td><td><code>load_module file;</code></td><td>加载动态模块</td></tr><tr><td><code>include</code></td><td><code>include file;</code></td><td>引入文件</td></tr></tbody></table><h4 id="events-上下文" tabindex="-1"><a class="header-anchor" href="#events-上下文"><span>events 上下文</span></a></h4><p>events 上下文配置 Nginx 的事件处理模型：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;     </span><span style="color:#7F848E;font-style:italic;"># 每个 Worker 最大连接数</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;              </span><span style="color:#7F848E;font-style:italic;"># 批量接受连接</span></span>
<span class="line"><span style="color:#C678DD;">    accept_mutex </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;             </span><span style="color:#7F848E;font-style:italic;"># 连接互斥锁</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;                    </span><span style="color:#7F848E;font-style:italic;"># 事件模型</span></span>
<span class="line"><span style="color:#C678DD;">    accept_mutex_delay </span><span style="color:#ABB2BF;">500ms;     </span><span style="color:#7F848E;font-style:italic;"># 获取锁的等待时间</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>events 上下文可用指令：</p><table><thead><tr><th>指令</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td><code>worker_connections</code></td><td>每个 Worker 的最大并发连接数</td><td>512</td></tr><tr><td><code>multi_accept</code></td><td>是否一次接受所有新连接</td><td>off</td></tr><tr><td><code>accept_mutex</code></td><td>是否启用连接互斥锁</td><td>off (1.11.3+)</td></tr><tr><td><code>use</code></td><td>事件模型</td><td>自动检测</td></tr><tr><td><code>accept_mutex_delay</code></td><td>获取互斥锁的等待时间</td><td>500ms</td></tr></tbody></table><h4 id="http-上下文" tabindex="-1"><a class="header-anchor" href="#http-上下文"><span>http 上下文</span></a></h4><p>http 上下文是 HTTP 服务的核心配置区域，包含绝大多数常用指令：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # MIME 类型</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">      mime.types;</span></span>
<span class="line"><span style="color:#C678DD;">    default_type </span><span style="color:#ABB2BF;"> application/octet-stream;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 日志</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#D19A66;">main</span><span style="color:#98C379;"> &#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;$</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot;&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 性能</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 压缩</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_types </span><span style="color:#ABB2BF;">text/plain text/css application/json;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 安全</span></span>
<span class="line"><span style="color:#C678DD;">    server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 限流区域</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=global:10m rate=100r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 变量映射</span></span>
<span class="line"><span style="color:#C678DD;">    map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_upgrade</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">connection_upgrade</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">        default</span><span style="color:#ABB2BF;"> upgrade;</span></span>
<span class="line"><span style="color:#98C379;">        &#39;&#39;</span><span style="color:#ABB2BF;">      close;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 上游服务器</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.1:8080;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.2:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 虚拟主机</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="server-上下文" tabindex="-1"><a class="header-anchor" href="#server-上下文"><span>server 上下文</span></a></h4><p>server 上下文定义虚拟主机（Virtual Host）：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 监听配置</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SSL 配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ssl_certificate /etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ssl_certificate_key /etc/nginx/ssl/example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 日志</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/example.com.access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    error_log </span><span style="color:#ABB2BF;">/var/log/nginx/example.com.error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 根目录</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/example.com;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html index.htm;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 路由</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ </span><span style="color:#D19A66;">=404</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 错误页面</span></span>
<span class="line"><span style="color:#C678DD;">    error_page </span><span style="color:#D19A66;">404</span><span style="color:#ABB2BF;"> /404.html;</span></span>
<span class="line"><span style="color:#C678DD;">    error_page </span><span style="color:#D19A66;">500</span><span style="color:#D19A66;"> 502</span><span style="color:#D19A66;"> 503</span><span style="color:#D19A66;"> 504</span><span style="color:#ABB2BF;"> /50x.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="location-上下文" tabindex="-1"><a class="header-anchor" href="#location-上下文"><span>location 上下文</span></a></h4><p>location 上下文定义请求路由规则：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 精确匹配</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 只匹配 /</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 前缀匹配（阻止正则）</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/static/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # /static/ 下的所有请求</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 正则匹配（区分大小写）</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">\\.php$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配 .php 结尾的请求</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 正则匹配（不区分大小写）</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(jpg|jpeg|png|gif|ico)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配图片请求</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 普通前缀匹配</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /images/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # /images/ 前缀</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 嵌套条件</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">http_x_api_key</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 401</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="upstream-上下文" tabindex="-1"><a class="header-anchor" href="#upstream-上下文"><span>upstream 上下文</span></a></h4><p>upstream 上下文定义后端服务器组：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 负载均衡算法</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 默认：轮询（Round Robin）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ip_hash;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # least_conn;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # hash $request_uri consistent;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 服务器列表</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.1:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> max_fails=3 </span><span style="color:#E06C75;font-style:italic;">fail_timeout</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    server 10.0.0.2:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;"> max_fails=3 </span><span style="color:#E06C75;font-style:italic;">fail_timeout</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    server 10.0.0.3:8080 backup;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Keep-Alive 连接池</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive </span><span style="color:#D19A66;">32</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 健康检查（NGINX Plus）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # health_check interval=5s fails=3 passes=2;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="map-上下文" tabindex="-1"><a class="header-anchor" href="#map-上下文"><span>map 上下文</span></a></h4><p>map 上下文定义变量映射规则：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基本语法：map 源变量 目标变量 { 映射规则 }</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_upgrade</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">connection_upgrade</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;"> upgrade;</span></span>
<span class="line"><span style="color:#98C379;">    &#39;&#39;</span><span style="color:#ABB2BF;">      close;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 复杂映射</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">backend_name</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">              backend_default;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^/api/v1/          backend_v1;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^/api/v2/          backend_v2;</span></span>
<span class="line"><span style="color:#ABB2BF;">    /health             backend_health;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># hostnames 标志（支持通配符）</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_host</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    hostnames;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">             backend_default;</span></span>
<span class="line"><span style="color:#ABB2BF;">    *.example.com       backend_example;</span></span>
<span class="line"><span style="color:#ABB2BF;">    api.example.com     backend_api;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="stream-上下文" tabindex="-1"><a class="header-anchor" href="#stream-上下文"><span>stream 上下文</span></a></h4><p>stream 上下文用于 TCP/UDP 代理配置：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> mysql_backend {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.1:3306;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 10.0.0.2:3306;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">3306</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">mysql_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">53</span><span style="color:#ABB2BF;"> udp;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">dns_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-上下文对应的指令模块" tabindex="-1"><a class="header-anchor" href="#_2-3-上下文对应的指令模块"><span>2.3 上下文对应的指令模块</span></a></h3><table><thead><tr><th>上下文</th><th>模块</th><th>说明</th></tr></thead><tbody><tr><td>main</td><td><code>ngx_core_module</code></td><td>核心全局指令</td></tr><tr><td>events</td><td><code>ngx_event_module</code></td><td>事件处理指令</td></tr><tr><td>http</td><td><code>ngx_http_module</code></td><td>HTTP 服务框架</td></tr><tr><td>server</td><td><code>ngx_http_core_module</code></td><td>HTTP 虚拟主机</td></tr><tr><td>location</td><td><code>ngx_http_core_module</code></td><td>HTTP 请求路由</td></tr><tr><td>upstream</td><td><code>ngx_http_upstream_module</code></td><td>负载均衡</td></tr><tr><td>stream</td><td><code>ngx_stream_module</code></td><td>TCP/UDP 代理</td></tr><tr><td>mail</td><td><code>ngx_mail_module</code></td><td>邮件代理</td></tr></tbody></table><h2 id="_3-指令继承规则" tabindex="-1"><a class="header-anchor" href="#_3-指令继承规则"><span>3. 指令继承规则</span></a></h2><h3 id="_3-1-继承模型" tabindex="-1"><a class="header-anchor" href="#_3-1-继承模型"><span>3.1 继承模型</span></a></h3><p>Nginx 的指令遵循<strong>子上下文继承父上下文</strong>的规则，但子上下文可以覆盖父上下文的值。</p>`,34),i(d,{code:`eJxLL0osyFAIceJSAILi0iQI//nu5c86979Y3vK0YyZYBgQ8QkICopUySkoKFKptkor07dKrMgsU8vOswZzs1NSCxJzMstT4kszc1PzSEgUzU2ulWC4U7Qq6unYKwa5BYa5B0UrFqUVlqUVQsyA2WilAzUQRw2Y0sskQA8Fm+/g7G0Yr5eQnJ5Zk5ucp6JNpei1u442QjU8syIRZ8WJZ2/PZ02BWpKVRYocxsh3FJUBGMiU+AVmQmpcCsa24pDInFRIZaZk5OVbKJs6ObqYGOsn5OflFVsppaWlIykD+hSpzczM1NzJCVgYAW0PEXQ==`}),o[3]||=n(`<h3 id="_3-2-继承规则详解" tabindex="-1"><a class="header-anchor" href="#_3-2-继承规则详解"><span>3.2 继承规则详解</span></a></h3><h4 id="规则一-子上下文自动继承父上下文的指令值" tabindex="-1"><a class="header-anchor" href="#规则一-子上下文自动继承父上下文的指令值"><span>规则一：子上下文自动继承父上下文的指令值</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;                    </span><span style="color:#7F848E;font-style:italic;"># 父上下文定义</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 自动继承 gzip on</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 自动继承 gzip on</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="规则二-子上下文可以覆盖父上下文的指令值" tabindex="-1"><a class="header-anchor" href="#规则二-子上下文可以覆盖父上下文的指令值"><span>规则二：子上下文可以覆盖父上下文的指令值</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;                    </span><span style="color:#7F848E;font-style:italic;"># 父上下文定义</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        gzip </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;               </span><span style="color:#7F848E;font-style:italic;"># 覆盖父上下文</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # gzip off 生效</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="规则三-不同类型的指令继承行为不同" tabindex="-1"><a class="header-anchor" href="#规则三-不同类型的指令继承行为不同"><span>规则三：不同类型的指令继承行为不同</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 数值型指令：子上下文覆盖父上下文 =====</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65</span><span style="color:#ABB2BF;">;       </span><span style="color:#7F848E;font-style:italic;"># 父上下文</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        keepalive_timeout </span><span style="color:#D19A66;">120</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 覆盖为 120</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">            keepalive_timeout </span><span style="color:#D19A66;">30</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 再次覆盖为 30</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 数组型指令：行为取决于具体指令 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># add_header：子上下文完全覆盖（不追加）</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Global </span><span style="color:#98C379;">&quot;yes&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-Server </span><span style="color:#98C379;">&quot;yes&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 只有 X-Server 生效，X-Global 被丢弃！</span></span>
<span class="line"><span style="color:#C678DD;">            add_header </span><span style="color:#ABB2BF;">X-Location </span><span style="color:#98C379;">&quot;yes&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># proxy_set_header：子上下文覆盖（不追加）</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # Host 头不再生效！</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 只有 X-Real-IP 生效</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># access_log：子上下文覆盖（可追加）</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 覆盖（不是追加）</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#ABB2BF;">/var/log/nginx/example.com.access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 可以再次覆盖</span></span>
<span class="line"><span style="color:#C678DD;">            access_log </span><span style="color:#ABB2BF;">/var/log/nginx/api.access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 也可以关闭</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # access_log off;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-继承陷阱与解决方案" tabindex="-1"><a class="header-anchor" href="#_3-3-继承陷阱与解决方案"><span>3.3 继承陷阱与解决方案</span></a></h3><h4 id="陷阱一-add-header-继承丢失" tabindex="-1"><a class="header-anchor" href="#陷阱一-add-header-继承丢失"><span>陷阱一：add_header 继承丢失</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 问题：server 级安全头在 location 中丢失</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # server 级安全头</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Strict-Transport-Security </span><span style="color:#98C379;">&quot;max-age=63072000&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/html;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 以上三个安全头全部生效</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 一旦在 location 中定义了 add_header</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # server 级的 add_header 全部失效！</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-API-Version </span><span style="color:#98C379;">&quot;2.0&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # Strict-Transport-Security、X-Frame-Options、</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # X-Content-Type-Options 全部丢失！</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 解决方案1：在每个 location 中重复所有头部</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 重复 server 级头部</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Strict-Transport-Security </span><span style="color:#98C379;">&quot;max-age=63072000&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 额外的头部</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-API-Version </span><span style="color:#98C379;">&quot;2.0&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 解决方案2：使用 include 片段</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/snippets/security-headers.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># add_header Strict-Transport-Security &quot;max-age=63072000&quot; always;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># add_header X-Frame-Options &quot;SAMEORIGIN&quot; always;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># add_header X-Content-Type-Options &quot;nosniff&quot; always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#C678DD;">        include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/security-headers.conf;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-API-Version </span><span style="color:#98C379;">&quot;2.0&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 解决方案3：使用 headers-more 模块</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># more_set_headers 支持真正的继承</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># more_set_headers &quot;X-Frame-Options: SAMEORIGIN&quot;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="陷阱二-proxy-set-header-继承丢失" tabindex="-1"><a class="header-anchor" href="#陷阱二-proxy-set-header-继承丢失"><span>陷阱二：proxy_set_header 继承丢失</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 问题：server 级 proxy_set_header 在 location 中丢失</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # server 级代理头</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 以上三个代理头全部生效</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /ws/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 一旦在此处定义了 proxy_set_header</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # server 级的 proxy_set_header 全部失效！</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Upgrade $</span><span style="color:#E06C75;">http_upgrade</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;upgrade&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # Host、X-Real-IP、X-Forwarded-For 全部丢失！</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 解决方案：使用 include 片段</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/snippets/proxy-params.conf</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#C678DD;">        include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/proxy-params.conf;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /ws/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/proxy-params.conf;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Upgrade $</span><span style="color:#E06C75;">http_upgrade</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;upgrade&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-指令类型与继承行为总结" tabindex="-1"><a class="header-anchor" href="#_3-4-指令类型与继承行为总结"><span>3.4 指令类型与继承行为总结</span></a></h3><table><thead><tr><th>指令</th><th>类型</th><th>子上下文行为</th><th>说明</th></tr></thead><tbody><tr><td><code>gzip</code></td><td>开关型</td><td>覆盖</td><td>子上下文可重新开关</td></tr><tr><td><code>keepalive_timeout</code></td><td>数值型</td><td>覆盖</td><td>子上下文可重新设值</td></tr><tr><td><code>client_max_body_size</code></td><td>数值型</td><td>覆盖</td><td>子上下文可重新设值</td></tr><tr><td><code>add_header</code></td><td>数组型</td><td><strong>完全覆盖</strong></td><td>子上下文定义则父级全部丢失</td></tr><tr><td><code>proxy_set_header</code></td><td>数组型</td><td><strong>完全覆盖</strong></td><td>子上下文定义则父级全部丢失</td></tr><tr><td><code>proxy_hide_header</code></td><td>数组型</td><td><strong>完全覆盖</strong></td><td>同上</td></tr><tr><td><code>access_log</code></td><td>数组型</td><td>覆盖</td><td>可设 off 关闭</td></tr><tr><td><code>error_log</code></td><td>数组型</td><td>覆盖</td><td>可设 off 关闭</td></tr><tr><td><code>root</code></td><td>路径型</td><td>覆盖</td><td>子上下文可重新设值</td></tr><tr><td><code>index</code></td><td>数组型</td><td>覆盖</td><td>子上下文可重新设值</td></tr><tr><td><code>try_files</code></td><td>数组型</td><td>覆盖</td><td>仅在 location 中有效</td></tr><tr><td><code>limit_req</code></td><td>数组型</td><td>追加</td><td>可叠加多个限流规则</td></tr><tr><td><code>limit_conn</code></td><td>数组型</td><td>追加</td><td>可叠加多个连接限制</td></tr></tbody></table><h2 id="_4-指令冲突与覆盖规则" tabindex="-1"><a class="header-anchor" href="#_4-指令冲突与覆盖规则"><span>4. 指令冲突与覆盖规则</span></a></h2><h3 id="_4-1-同一上下文中的指令冲突" tabindex="-1"><a class="header-anchor" href="#_4-1-同一上下文中的指令冲突"><span>4.1 同一上下文中的指令冲突</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 同一上下文中，相同指令多次出现</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 对于可重复指令：后者覆盖前者</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">120</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 生效：120</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 对于不可重复指令：后者覆盖前者，且产生警告</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">a.com;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">b.com;        </span><span style="color:#7F848E;font-style:italic;"># 生效：b.com</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 对于数组型指令：累积生效</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Header-A </span><span style="color:#98C379;">&quot;1&quot;</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 生效</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Header-B </span><span style="color:#98C379;">&quot;2&quot;</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 生效</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 两个头部都会添加到响应中</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-不同上下文中的指令覆盖" tabindex="-1"><a class="header-anchor" href="#_4-2-不同上下文中的指令覆盖"><span>4.2 不同上下文中的指令覆盖</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 全局设置</span></span>
<span class="line"><span style="color:#C678DD;">    client_max_body_size </span><span style="color:#D19A66;">20m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_comp_level </span><span style="color:#D19A66;">4</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # server 级覆盖</span></span>
<span class="line"><span style="color:#C678DD;">        client_max_body_size </span><span style="color:#D19A66;">50m</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 覆盖全局</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # gzip 和 gzip_comp_level 继承全局设置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /upload/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # location 级覆盖</span></span>
<span class="line"><span style="color:#C678DD;">            client_max_body_size </span><span style="color:#D19A66;">200m</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 覆盖 server 级</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # location 级覆盖</span></span>
<span class="line"><span style="color:#C678DD;">            gzip </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;                    </span><span style="color:#7F848E;font-style:italic;"># 覆盖全局设置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # client_max_body_size 继承 server 级：50m</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-指令覆盖规则总结" tabindex="-1"><a class="header-anchor" href="#_4-3-指令覆盖规则总结"><span>4.3 指令覆盖规则总结</span></a></h3>`,22),i(d,{code:`eJxLL0osyFAIceJSAILi0iQI/8Wytuezp71Y3vK0YyZYBgQco5UySkoKFKptkor07dKrMgsU8vOswZzknMzUvJL43MSK+KT8lMr44syqVAUjg9xapVguhH4FXV07BadopeLUorLUIqg5z3cvf9a530oBah6KGC5jwYogboRojE/Ozy2Iz0ktS81RMEOx1AlsqXO0Uk5+cmJJZn6egn6iPh6rYaZitdoUzUcQw12QDU+CGY7sPIX8tDSiPAYyHWRwal4KFwDEm5PE`}),o[4]||=n(`<h2 id="_5-常用全局指令详解" tabindex="-1"><a class="header-anchor" href="#_5-常用全局指令详解"><span>5. 常用全局指令详解</span></a></h2><h3 id="_5-1-worker-processes" tabindex="-1"><a class="header-anchor" href="#_5-1-worker-processes"><span>5.1 worker_processes</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Worker 进程数量</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># auto：自动检测 CPU 核心数（推荐）</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 手动指定</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># worker_processes 4;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 建议：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - CPU 密集型：等于 CPU 核心数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - I/O 密集型：可以适当增加（1.5~2倍核心数）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - 大多数场景：auto 即可</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-worker-connections" tabindex="-1"><a class="header-anchor" href="#_5-2-worker-connections"><span>5.2 worker_connections</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 每个 Worker 的最大并发连接数</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 计算公式：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 最大并发连接数 = worker_processes × worker_connections</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 例如：4 × 4096 = 16384</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 如果作为反向代理：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 最大并发数 = worker_processes × worker_connections / 2</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # （因为每个请求占用2个连接：客户端+后端）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 例如：4 × 4096 / 2 = 8192</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-worker-rlimit-nofile" tabindex="-1"><a class="header-anchor" href="#_5-3-worker-rlimit-nofile"><span>5.3 worker_rlimit_nofile</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Worker 进程可以打开的最大文件描述符数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 必须大于等于 worker_connections</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置建议：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># worker_rlimit_nofile &gt;= worker_connections × 2</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 反向代理场景：worker_rlimit_nofile &gt;= worker_connections × 4</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-error-log" tabindex="-1"><a class="header-anchor" href="#_5-4-error-log"><span>5.4 error_log</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 错误日志配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 格式：error_log 文件路径 [日志级别];</span></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 日志级别（从低到高）：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># debug   - 调试信息（需要编译时 --with-debug）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># info    - 信息</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># notice  - 通知</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># warn    - 警告（默认）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># error   - 错误</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># crit    - 严重</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># alert   - 警报</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># emerg   - 紧急</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 不同级别的日志量差异巨大：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># debug &gt; info &gt; notice &gt; warn &gt; error &gt; crit &gt; alert &gt; emerg</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境建议：warn 或 error</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 排查问题时临时开启：debug</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 可以在不同上下文设置不同级别</span></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log </span><span style="color:#D19A66;">error</span><span style="color:#ABB2BF;">;     </span><span style="color:#7F848E;font-style:italic;"># 全局</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    error_log </span><span style="color:#ABB2BF;">/var/log/nginx/http_error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># HTTP 级</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        error_log </span><span style="color:#ABB2BF;">/var/log/nginx/server_error.log info;  </span><span style="color:#7F848E;font-style:italic;"># Server 级</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 关闭错误日志（不推荐）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># error_log off;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># error_log /dev/null;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">debug 级别的性能影响</p><p><code>debug</code> 级别会产生大量日志输出，严重影响性能。使用前需要确认：</p><ol><li>编译时启用了 <code>--with-debug</code> 参数</li><li>仅在排查问题时临时开启</li><li>问题解决后立即恢复为 <code>warn</code> 或更高级别</li></ol><p>参考：<a href="https://nginx.org/en/docs/ngx_core_module.html#error_log" target="_blank" rel="noopener noreferrer">https://nginx.org/en/docs/ngx_core_module.html#error_log</a></p></div><h3 id="_5-5-pid" tabindex="-1"><a class="header-anchor" href="#_5-5-pid"><span>5.5 pid</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># PID 文件路径</span></span>
<span class="line"><span style="color:#C678DD;">pid </span><span style="color:#ABB2BF;">/var/run/nginx.pid;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># PID 文件的作用：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. nginx -s reload 通过 PID 发送 HUP 信号</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. nginx -s stop 通过 PID 发送 TERM 信号</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 热升级时引用旧 Master 的 PID</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 监控脚本通过 PID 检查进程状态</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-6-daemon" tabindex="-1"><a class="header-anchor" href="#_5-6-daemon"><span>5.6 daemon</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 是否以守护进程运行</span></span>
<span class="line"><span style="color:#C678DD;">daemon </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;     </span><span style="color:#7F848E;font-style:italic;"># 默认：后台运行</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># daemon off;  # 前台运行（Docker 环境需要）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Docker 中的配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CMD [&quot;nginx&quot;, &quot;-g&quot;, &quot;daemon off;&quot;]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-7-env" tabindex="-1"><a class="header-anchor" href="#_5-7-env"><span>5.7 env</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 环境变量配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认：Nginx 只保留 TZ 变量</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 env 指令保留或设置环境变量</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">env </span><span style="color:#ABB2BF;">HOSTNAME;                   </span><span style="color:#7F848E;font-style:italic;"># 保留系统环境变量</span></span>
<span class="line"><span style="color:#C678DD;">env </span><span style="color:#ABB2BF;">DATABASE_HOST=10.0.0.1;     </span><span style="color:#7F848E;font-style:italic;"># 设置自定义环境变量</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：env 指令只能在 main 上下文中使用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Worker 进程通过环境变量获取配置信息</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 常用于 OpenResty/Lua 中读取环境变量</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-events-块指令详解" tabindex="-1"><a class="header-anchor" href="#_6-events-块指令详解"><span>6. events 块指令详解</span></a></h2><h3 id="_6-1-use" tabindex="-1"><a class="header-anchor" href="#_6-1-use"><span>6.1 use</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 指定事件模型</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 通常不需要手动指定，Nginx 自动选择最优</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;       </span><span style="color:#7F848E;font-style:italic;"># Linux</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # use kqueue;    # BSD/macOS</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # use /dev/poll; # Solaris</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # use eventport; # Solaris 10+</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # use select;    # 所有平台（性能差）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # use poll;      # 所有平台（性能差）</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-worker-connections" tabindex="-1"><a class="header-anchor" href="#_6-2-worker-connections"><span>6.2 worker_connections</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 每个 Worker 进程的最大并发连接数</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 设置建议：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 小型站点：1024</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 中型站点：4096</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 大型站点：65535</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 必须确保：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # worker_rlimit_nofile &gt;= worker_connections</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 系统级：ulimit -n &gt;= worker_connections</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-multi-accept" tabindex="-1"><a class="header-anchor" href="#_6-3-multi-accept"><span>6.3 multi_accept</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 是否一次接受所有新连接</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;    </span><span style="color:#7F848E;font-style:italic;"># 推荐：一次接受所有等待的连接</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # multi_accept off; # 默认：一次只接受一个连接</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 建议开启，特别是在高并发场景</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-4-accept-mutex" tabindex="-1"><a class="header-anchor" href="#_6-4-accept-mutex"><span>6.4 accept_mutex</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 连接互斥锁</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 用于解决惊群问题</span></span>
<span class="line"><span style="color:#C678DD;">    accept_mutex </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 1.11.3+ 默认 off</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 开启：Worker 轮流获取锁，避免惊群</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 关闭：所有 Worker 竞争，但现代内核影响小</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 建议：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Linux 3.9+ 配合 reuseport 使用时关闭</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 低版本内核或低并发场景可以开启</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-5-完整-events-配置示例" tabindex="-1"><a class="header-anchor" href="#_6-5-完整-events-配置示例"><span>6.5 完整 events 配置示例</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境推荐配置</span></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    accept_mutex </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # use epoll;  # 自动检测，通常不需要指定</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 低配环境配置</span></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">1024</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    accept_mutex </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    accept_mutex_delay </span><span style="color:#ABB2BF;">500ms;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-配置注释规范与可读性" tabindex="-1"><a class="header-anchor" href="#_7-配置注释规范与可读性"><span>7. 配置注释规范与可读性</span></a></h2><h3 id="_7-1-注释风格" tabindex="-1"><a class="header-anchor" href="#_7-1-注释风格"><span>7.1 注释风格</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 单行注释 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 这是单行注释</span></span>
<span class="line"><span style="color:#C678DD;">sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 行尾注释</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 分隔注释 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTP 服务配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ----- 小节分隔 -----</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ---- SSL 配置 ----</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 配置块说明注释 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 格式：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置项名称</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 功能：简要说明</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 参数说明：解释关键参数含义</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：使用注意事项</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># client_max_body_size</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 功能：限制客户端请求体的最大大小</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 参数：20m = 20 兆字节</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：超过此大小的请求将返回 413 错误</span></span>
<span class="line"><span style="color:#C678DD;">client_max_body_size </span><span style="color:#D19A66;">20m</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-配置文件模板" tabindex="-1"><a class="header-anchor" href="#_7-2-配置文件模板"><span>7.2 配置文件模板</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 站点配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 域名：example.com</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 环境：production</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建：2024-01-15</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改：2024-06-01</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 负责人：运维团队</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ---- 上游服务器 ----</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> example_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.1:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    server 10.0.0.2:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">2</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    keepalive </span><span style="color:#D19A66;">32</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ---- HTTP → HTTPS 重定向 ----</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com www.example.com;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 301</span><span style="color:#ABB2BF;"> https://$</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ---- HTTPS 主站点 ----</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 监听与域名</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl http2;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SSL 证书</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">    /etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/ssl-params.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 日志</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/example.com.access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    error_log </span><span style="color:#ABB2BF;">/var/log/nginx/example.com.error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 安全头</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/security-headers.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 根目录</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/example.com;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 路由</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ </span><span style="color:#D19A66;">=404</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/proxy-params.conf;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://example_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 禁止访问隐藏文件</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">/\\. </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        log_not_found </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-配置文件可读性技巧" tabindex="-1"><a class="header-anchor" href="#_7-3-配置文件可读性技巧"><span>7.3 配置文件可读性技巧</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 技巧1：使用空行分隔逻辑组</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/html;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ </span><span style="color:#D19A66;">=404</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 技巧2：对齐参数</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">   example.com;</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">          /var/www/html;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">         index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 技巧3：使用有意义的变量名</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_x_device_type</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">backend_name</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">    mobile_backend;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;desktop&quot;</span><span style="color:#ABB2BF;">  desktop_backend;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;tablet&quot;</span><span style="color:#ABB2BF;">   tablet_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 技巧4：注释掉不使用的配置而不是删除</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># location /old-api/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     proxy_pass http://old_backend;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 技巧5：使用 include 简化配置</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/ssl-params.conf;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/security-headers.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#C678DD;">        include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/proxy-params.conf;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_8-指令参数类型详解" tabindex="-1"><a class="header-anchor" href="#_8-指令参数类型详解"><span>8. 指令参数类型详解</span></a></h2><h3 id="_8-1-数值参数" tabindex="-1"><a class="header-anchor" href="#_8-1-数值参数"><span>8.1 数值参数</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 整数</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#D19A66;">4</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 自动检测</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 带单位的数值</span></span>
<span class="line"><span style="color:#C678DD;">client_max_body_size </span><span style="color:#D19A66;">20m</span><span style="color:#ABB2BF;">;       </span><span style="color:#7F848E;font-style:italic;"># 20 MB</span></span>
<span class="line"><span style="color:#C678DD;">keepalive_timeout </span><span style="color:#D19A66;">65s</span><span style="color:#ABB2BF;">;          </span><span style="color:#7F848E;font-style:italic;"># 65 秒</span></span>
<span class="line"><span style="color:#C678DD;">keepalive_timeout </span><span style="color:#D19A66;">65</span><span style="color:#ABB2BF;">;           </span><span style="color:#7F848E;font-style:italic;"># 65 秒（单位可省略）</span></span>
<span class="line"><span style="color:#C678DD;">proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;       </span><span style="color:#7F848E;font-style:italic;"># 5 秒</span></span>
<span class="line"><span style="color:#C678DD;">client_body_buffer_size </span><span style="color:#D19A66;">128k</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 128 KB</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 时间单位</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ms - 毫秒</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># s  - 秒（默认）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># m  - 分钟</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># h  - 小时</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># d  - 天</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 大小单位</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># k/K - 千字节</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># m/M - 兆字节</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># g/G - 吉字节</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-路径参数" tabindex="-1"><a class="header-anchor" href="#_8-2-路径参数"><span>8.2 路径参数</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 绝对路径</span></span>
<span class="line"><span style="color:#C678DD;">root </span><span style="color:#ABB2BF;">/var/www/html;</span></span>
<span class="line"><span style="color:#C678DD;">error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 相对路径（相对于 --prefix 配置路径）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># root html;    # 相对于 /etc/nginx/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 路径中的变量</span></span>
<span class="line"><span style="color:#C678DD;">root </span><span style="color:#ABB2BF;">/var/www/$</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">access_log </span><span style="color:#ABB2BF;">/var/log/nginx/$</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">.access.log;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-正则表达式参数" tabindex="-1"><a class="header-anchor" href="#_8-3-正则表达式参数"><span>8.3 正则表达式参数</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 区分大小写正则</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">^/api/v[0-9]+/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 不区分大小写正则</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(jpg|jpeg|png|gif|ico)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># rewrite 中的正则和替换</span></span>
<span class="line"><span style="color:#C678DD;">rewrite</span><span style="color:#E06C75;"> ^/old/(.*)$</span><span style="color:#ABB2BF;"> /new/$</span><span style="color:#E06C75;">1</span><span style="color:#C678DD;"> permanent</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># if 中的正则</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#98C379;">&quot;bot|spider|crawler&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 403</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 正则语法：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ~   区分大小写</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ~*  不区分大小写</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># !~  区分大小写取反</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># !~* 不区分大小写取反</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 正则捕获组：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 rewrite 中使用 $1, $2, ... 引用</span></span>
<span class="line"><span style="color:#C678DD;">rewrite</span><span style="color:#E06C75;"> ^/article/([0-9]+)/([a-z-]+)$</span><span style="color:#ABB2BF;"> /blog/$</span><span style="color:#E06C75;">1</span><span style="color:#ABB2BF;">/$</span><span style="color:#E06C75;">2</span><span style="color:#C678DD;"> last</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-4-变量参数" tabindex="-1"><a class="header-anchor" href="#_8-4-变量参数"><span>8.4 变量参数</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用变量</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">root </span><span style="color:#ABB2BF;">/var/www/$</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 变量拼接</span></span>
<span class="line"><span style="color:#C678DD;">proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">backend_name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：变量中包含域名时需要使用 resolver</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># resolver 8.8.8.8;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-5-on-off-参数" tabindex="-1"><a class="header-anchor" href="#_8-5-on-off-参数"><span>8.5 on/off 参数</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 布尔值参数</span></span>
<span class="line"><span style="color:#C678DD;">sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">daemon </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-常见语法错误与排查" tabindex="-1"><a class="header-anchor" href="#_9-常见语法错误与排查"><span>9. 常见语法错误与排查</span></a></h2><h3 id="_9-1-常见语法错误" tabindex="-1"><a class="header-anchor" href="#_9-1-常见语法错误"><span>9.1 常见语法错误</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 错误1：遗漏分号</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto    </span><span style="color:#7F848E;font-style:italic;"># ← 缺少分号</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修正：worker_processes auto;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误2：花括号不匹配</span></span>
<span class="line"><span style="color:#ABB2BF;">http {</span></span>
<span class="line"><span style="color:#ABB2BF;">    server {</span></span>
<span class="line"><span style="color:#ABB2BF;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ← 缺少 server 的右花括号</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修正：确保每个 { 都有对应的 }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误3：指令放在错误的上下文</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># server_name 不能放在 http 上下文</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;   </span><span style="color:#7F848E;font-style:italic;"># ← 错误</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">example.com;   </span><span style="color:#7F848E;font-style:italic;"># ← 正确</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误4：参数格式错误</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># gzip_comp_level 取值 1-9</span></span>
<span class="line"><span style="color:#C678DD;">gzip_comp_level </span><span style="color:#D19A66;">10</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># ← 错误</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修正：gzip_comp_level 9;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误5：变量名拼写错误</span></span>
<span class="line"><span style="color:#C678DD;">proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remte_addr</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># ← 拼写错误</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修正：proxy_set_header X-Real-IP $remote_addr;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误6：字符串未加引号</span></span>
<span class="line"><span style="color:#C678DD;">log_format </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># ← 需要引号</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修正：log_format main &#39;$remote_addr - $remote_user&#39;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误7：include 文件不存在</span></span>
<span class="line"><span style="color:#C678DD;">include </span><span style="color:#ABB2BF;">/etc/nginx/nonexistent.conf;   </span><span style="color:#7F848E;font-style:italic;"># ← 文件不存在</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修正：确保 include 的文件存在</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误8：location 修饰符语法错误</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ ~ { }   </span><span style="color:#7F848E;font-style:italic;"># ← 修饰符位置错误</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修正：location ~ /api/ { }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-语法检查流程" tabindex="-1"><a class="header-anchor" href="#_9-2-语法检查流程"><span>9.2 语法检查流程</span></a></h3>`,49),i(d,{code:`eJxLy8kvT85ILCpRCHHiUgACVxfPkOjne6a92DfxZWvv873rnk1rf7J7W6yCrq6dgrOHq7N3dF56Zl6Fgm6Jwov1a59tnvpsccOz+UtjwbrBCsBKAxyDg6shUi8bZr3Y325fC1YBEgcpqHk2Y32NQpCrj7+jC8zEYoWi1Jz8xBSIWXCVTycsq1Fw84yIfrZg57PedS+nzHyxfv2T/QufNQLJdU+X9MZygTUAlSBcCRGCmA8WDXMN8nSLjH65qufF+sZnc3qfdi18tnbx0x07ILZBpMEq/b2rkeWhDvcH+wvibBd/P9fop+t6nnVMgOiGSoJdGuTv4+PkCAwnpaez5z3bPQsSjDZJRfp2aP5Ugjq8uKQyJxUadmmZOTlWyibOjm6mBjrJ+Tn5RVbKaWlpSOpg5kOVurmZmhsZISsFADJKtcg=`}),o[5]||=n(`<h3 id="_9-3-nginx-t-错误信息解读" tabindex="-1"><a class="header-anchor" href="#_9-3-nginx-t-错误信息解读"><span>9.3 nginx -t 错误信息解读</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 示例1：分号遗漏</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx: [emerg] unexpected &quot;}&quot; in /etc/nginx/conf.d/example.conf:15</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx: configuration file /etc/nginx/nginx.conf test failed</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 原因：第15行附近缺少分号</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 示例2：花括号不匹配</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx: [emerg] unexpected end of file, expecting &quot;}&quot; in /etc/nginx/conf.d/example.conf:25</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 原因：缺少右花括号</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 示例3：指令上下文错误</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx: [emerg] &quot;server_name&quot; directive is not allowed here in /etc/nginx/conf.d/example.conf:5</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 原因：server_name 放在了 http 上下文而非 server 上下文</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 示例4：未知指令</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx: [emerg] unknown directive &quot;proxy_passs&quot; in /etc/nginx/conf.d/example.conf:10</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 原因：指令名拼写错误（proxy_passs → proxy_pass）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 示例5：参数数量错误</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx: [emerg] invalid parameter &quot;xxxx&quot; in /etc/nginx/conf.d/example.conf:8</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 原因：参数格式或数量不正确</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-4-配置调试技巧" tabindex="-1"><a class="header-anchor" href="#_9-4-配置调试技巧"><span>9.4 配置调试技巧</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 查看完整运行时配置</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">less</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 查找特定指令的所有实例</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;server_name&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 查找特定 server 块</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -A</span><span style="color:#D19A66;"> 20</span><span style="color:#98C379;"> &quot;server_name example.com&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 检查所有监听端口</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;listen &quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 查找配置中的变量</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &#39;\\$&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 统计 server 块数量</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;server {&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 7. 查找可能的问题</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -T</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;warn\\|error\\|crit&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-本章小结" tabindex="-1"><a class="header-anchor" href="#_10-本章小结"><span>10. 本章小结</span></a></h2><p>本章详细讲解了 Nginx 配置文件的结构和指令语法：</p><ol><li><strong>指令分类</strong>：简单指令（分号结尾）与块指令（花括号包裹）</li><li><strong>语法树</strong>：main → events/http/stream/mail → server → location 的层次结构</li><li><strong>上下文类型</strong>：8 种上下文各有其允许的指令和子上下文</li><li><strong>继承规则</strong>：子上下文自动继承父上下文，但可以覆盖</li><li><strong>覆盖陷阱</strong>：<code>add_header</code> 和 <code>proxy_set_header</code> 等数组型指令的覆盖行为</li><li><strong>全局指令</strong>：worker_processes、worker_connections、error_log 等常用指令</li><li><strong>events 指令</strong>：use、worker_connections、multi_accept、accept_mutex</li><li><strong>参数类型</strong>：数值、路径、正则、变量、on/off 等参数格式</li><li><strong>语法错误排查</strong>：常见错误类型和 nginx -t 的使用</li></ol><p>理解配置语法是正确使用 Nginx 的基础，下一章将深入 Nginx 的变量体系。</p>`,8)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};