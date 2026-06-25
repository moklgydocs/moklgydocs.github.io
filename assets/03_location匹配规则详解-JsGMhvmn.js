import{A as e,E as t,d as n,l as r,p as i,s as a}from"./runtime-core.esm-bundler-BVtXrkU4.js";import{t as o}from"./app-CzHWYZaW.js";var s=JSON.parse(`{"path":"/Linux/07_Nginx/03_HTTP%E6%A0%B8%E5%BF%83%E4%B8%8E%E8%99%9A%E6%8B%9F%E4%B8%BB%E6%9C%BA/03_location%E5%8C%B9%E9%85%8D%E8%A7%84%E5%88%99%E8%AF%A6%E8%A7%A3.html","title":"location 匹配规则详解","lang":"zh-CN","frontmatter":{"title":"location 匹配规则详解","icon":"fa6-solid:location-dot","order":3,"category":["Linux","Nginx"],"tag":["location","匹配规则","正则","前缀匹配","优先级"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":16.44,"words":4933},"filePathRelative":"Linux/07_Nginx/03_HTTP核心与虚拟主机/03_location匹配规则详解.md"}`),c={name:`03_location匹配规则详解.md`};function l(o,s,c,l,u,d){let f=e(`Mermaid`);return t(),r(`div`,null,[s[0]||=n(`<h1 id="location-匹配规则详解" tabindex="-1"><a class="header-anchor" href="#location-匹配规则详解"><span>location 匹配规则详解</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p><code>location</code> 是 Nginx HTTP 配置中最核心的指令之一，它定义了如何根据请求 URI 将请求路由到不同的处理逻辑。理解 <code>location</code> 的匹配规则、优先级和交互行为，是编写正确、高效 Nginx 配置的关键。</p><p>Nginx 的 <code>location</code> 匹配并非简单的&quot;先到先得&quot;，而是一套精心设计的优先级算法。错误的 <code>location</code> 配置可能导致请求被意外处理、安全策略绕过或性能下降。</p><div class="hint-container important"><p class="hint-container-title">核心要点</p><p>location 匹配是 Nginx 请求处理的 Find Config Phase 的核心逻辑。一个请求只能匹配一个 location（除内部重定向外），因此理解匹配优先级至关重要。</p></div><h2 id="location-语法" tabindex="-1"><a class="header-anchor" href="#location-语法"><span>location 语法</span></a></h2><h3 id="基本语法" tabindex="-1"><a class="header-anchor" href="#基本语法"><span>基本语法</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> [修饰符] 匹配模式 {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 配置指令</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="四种修饰符" tabindex="-1"><a class="header-anchor" href="#四种修饰符"><span>四种修饰符</span></a></h3><p>Nginx location 支持四种修饰符，决定了不同的匹配行为：</p><table><thead><tr><th>修饰符</th><th>类型</th><th>说明</th></tr></thead><tbody><tr><td><code>=</code></td><td>精确匹配</td><td>URI 必须与指定字符串完全一致</td></tr><tr><td><code>~</code></td><td>区分大小写的正则匹配</td><td>使用正则表达式匹配，区分大小写</td></tr><tr><td><code>~*</code></td><td>不区分大小写的正则匹配</td><td>使用正则表达式匹配，不区分大小写</td></tr><tr><td><code>^~</code></td><td>前缀匹配（优先）</td><td>前缀匹配，如果匹配则不再检查正则</td></tr><tr><td>（无）</td><td>普通前缀匹配</td><td>最长前缀匹配，但会被正则覆盖</td></tr></tbody></table>`,11),i(f,{code:`eJxLy8kvT85ILCpRCHHhUgACx+gX67c/29gUGuQZq6Cra6fgVG2r8HzTvucL1z3t2fmytde+FqzOCSRZ82zG+hoF52ilJ3v3P5+yAllZTn5yYklmfp5NUpG+3dPGOc/WLno2Yc7zLYuUYpH0P52wrEbBpTquTuFpZ+/zPQ0oVrhArJjT8HLq/rg6iFSNgivMNqAmQpZATZi+IK7uWce0l3PnQQyrUXCrfrFuw9O9UyH8ZzPXvWyYBXEBxGo3sNfdq5+tXfy0YyaKq9zBZj5fs+bJjoYnO1Yhq6hR8IiGuA0iCnMexDEQjUDHoGrxhGkBOwXiCIRGsM7iksqcVAVnhbTMnBwr5WSLVLNkSyQJV6hEUlJKaloSkoQHVCItLc041QBJwhMmYZxqmmbKBQDTDey6`}),s[1]||=a(`h2`,{id:`匹配优先级完整规则`,tabindex:`-1`},[a(`a`,{class:`header-anchor`,href:`#匹配优先级完整规则`},[a(`span`,null,`匹配优先级完整规则`)])],-1),s[2]||=a(`p`,null,`Nginx location 匹配的完整优先级规则如下：`,-1),i(f,{code:`eJxLy8kvT85ILCpR8AniUgACx2glQz2F55v2PV+47mnPzpetvTZJRfp2GraaSrEKurp2Ck7RSkZ6Ck87e5/vaUBWEFcHVAE2wgmszjlayVhP4dnaxU87ZiKrq1Oo04KpdAardIlWMgGqnLnuZcMsiLkQlc+mL3iyf93LpRuer1kG0gHWUlxSmZOq4KiQlpmTY6WcbJFqlmyJJOEElUhKSklNS0KScIZKpKWlGacaIEm4wCSMU03TTLkAtlthWQ==`}),s[3]||=n(`<h3 id="优先级从高到低" tabindex="-1"><a class="header-anchor" href="#优先级从高到低"><span>优先级从高到低</span></a></h3><ol><li><strong><code>=</code> 精确匹配</strong>：如果找到精确匹配，立即使用该 location，停止搜索</li><li><strong><code>^~</code> 前缀匹配</strong>：在所有前缀匹配中找到最长匹配，如果是 <code>^~</code> 修饰的，停止搜索</li><li><strong>正则匹配 <code>~</code> / <code>~*</code></strong>：按配置文件中的顺序依次检查正则表达式，使用第一个匹配的</li><li><strong>普通前缀匹配</strong>：如果正则没有匹配，使用最长普通前缀匹配的 location</li></ol><h3 id="详细匹配算法" tabindex="-1"><a class="header-anchor" href="#详细匹配算法"><span>详细匹配算法</span></a></h3>`,3),i(f,{code:`eJyFkN1KAkEcxe99ij92LQViVJSR3x+33S0F7rZDwpJgQoRb7I3gomJUgpYlIn0QpdJdZuvTzOzuW6QzY003OZdzzvnNOYO03IlymMkXYDfigenZkfDYwE8VXP1wS7U98PmCEJJIzyCdB2IapG3CFtjvlt3tcwuNhWZGnZgWLg/ZvQ5hyetMrvHtvWjXckqmkM0dbcr55SC7sj+vyF3H+wfUfmEsHSKSV3wdmzV7WpAGOaNEKq+wfw74skpafde4YZ4pkBIjdENUcvpD/NUgbcNtTEQKezdKXbGiqJPmYMbdPqOOGGvWHOgQny+byYsWsRy+eNQhIZGq6XZHeFTnm956uNxyus+OZeFxnTdO0C7JIvsC5mFgXiX5WyU1r8Jsi8qwJC2T/knSyeLX/UehmOPCqaZCGFBW0zaWlDV1VVkXhDgXZPlARbIgpLiAEPKrK4KQngt+NYACnm90DDfm`}),s[4]||=n(`<h3 id="精确匹配" tabindex="-1"><a class="header-anchor" href="#精确匹配"><span>精确匹配（=）</span></a></h3><p>精确匹配要求 URI 与指定字符串完全一致，包括前导斜杠。精确匹配的优先级最高，一旦匹配成功，Nginx 立即停止搜索。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 精确匹配 / 根路径</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 只匹配 /</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 不匹配 /index.html、/about 等</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/homepage;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 精确匹配 favicon.ico</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/favicon.ico </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    log_not_found </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 204</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 精确匹配 robots.txt</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/robots.txt </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    log_not_found </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    alias </span><span style="color:#ABB2BF;">/var/www/seo/robots.txt;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">精确匹配的性能优势</p><p>精确匹配使用哈希表查找，时间复杂度为 O(1)。对于高频访问的路径（如 <code>/</code>、<code>/favicon.ico</code>、<code>/robots.txt</code>），使用精确匹配可以避免不必要的正则匹配，显著提升性能。</p></div><h3 id="前缀匹配优先" tabindex="-1"><a class="header-anchor" href="#前缀匹配优先"><span>前缀匹配优先（^~）</span></a></h3><p><code>^~</code> 修饰符的前缀匹配在所有前缀匹配中具有特殊地位——如果最长前缀匹配是 <code>^~</code> 修饰的，Nginx 不会继续检查正则表达式。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># ^~ 前缀匹配</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/images/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配 /images/ 开头的所有 URI</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 即使后续有正则匹配，也不会被覆盖</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/static;</span></span>
<span class="line"><span style="color:#C678DD;">    expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 普通前缀匹配</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /images/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配 /images/ 开头的所有 URI</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 但可能被正则匹配覆盖</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/static;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 正则匹配</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(jpg|jpeg|png|gif|ico)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 如果上面是普通前缀，这个正则会优先</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 如果上面是 ^~，这个正则不会被执行</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/static;</span></span>
<span class="line"><span style="color:#C678DD;">    expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">^~ 的使用场景</p><p><code>^~</code> 主要用于以下场景：</p><ol><li>静态资源目录：避免对 <code>/images/</code>、<code>/css/</code>、<code>/js/</code> 等路径的请求被正则匹配捕获</li><li>安全防护：确保特定路径始终使用指定的安全策略</li><li>性能优化：避免对已知路径进行正则匹配</li></ol></div><h3 id="正则匹配-和" tabindex="-1"><a class="header-anchor" href="#正则匹配-和"><span>正则匹配（~ 和 ~*）</span></a></h3><p>正则匹配按配置文件中的顺序执行，使用第一个匹配的结果。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 区分大小写的正则匹配</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">\\.php$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 只匹配 .php（小写）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 不匹配 .PHP、.Php 等</span></span>
<span class="line"><span style="color:#C678DD;">    fastcgi_pass </span><span style="color:#ABB2BF;">unix:/run/php-fpm.sock;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 不区分大小写的正则匹配</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(jpg|jpeg|png|gif|ico|css|js)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配 .jpg、.JPG、.Jpg 等</span></span>
<span class="line"><span style="color:#C678DD;">    expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="正则匹配的顺序问题" tabindex="-1"><a class="header-anchor" href="#正则匹配的顺序问题"><span>正则匹配的顺序问题</span></a></h4><p>由于正则匹配按配置文件中的顺序执行，<strong>顺序很重要</strong>：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 错误示例：顺序不当</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">/api/.*\\.json$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 这个会匹配 /api/users.json</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://json_api;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">/api/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 这个也会匹配 /api/users.json，但永远不会被执行</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 因为上面的正则先匹配</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 正确示例：调整顺序</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">/api/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 通用 API 匹配</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">/api/.*\\.json$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 更具体的 JSON API 匹配</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 但这个永远不会被执行！因为上面的更通用</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://json_api;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 正确做法：更具体的正则放在前面</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">/api/.*\\.json$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://json_api;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">/api/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">正则匹配的顺序陷阱</p><p>正则匹配按照<strong>配置文件中的出现顺序</strong>执行，第一个匹配的正则将被使用。这意味着更具体的正则必须放在更通用的正则之前，否则永远不会被执行。</p></div><h3 id="普通前缀匹配-无修饰符" tabindex="-1"><a class="header-anchor" href="#普通前缀匹配-无修饰符"><span>普通前缀匹配（无修饰符）</span></a></h3><p>普通前缀匹配使用最长匹配原则，但优先级低于正则匹配。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /docs/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配 /docs/ 开头的 URI</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 如果有正则匹配，可能被覆盖</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/documentation;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /docs/api/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 比 /docs/ 更长的前缀匹配</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 优先使用此 location（在普通前缀范围内）</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/api-docs;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果以下正则存在，会覆盖上面的普通前缀匹配</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">/docs/.*\\.html$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/html-docs;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="前缀-location-与正则-location-的交互" tabindex="-1"><a class="header-anchor" href="#前缀-location-与正则-location-的交互"><span>前缀 location 与正则 location 的交互</span></a></h2><p>前缀 location 和正则 location 的交互是理解 location 匹配规则的核心。</p><h3 id="交互规则总结" tabindex="-1"><a class="header-anchor" href="#交互规则总结"><span>交互规则总结</span></a></h3><ol><li>Nginx 先检查所有前缀 location，记录最长匹配</li><li>如果最长匹配是 <code>=</code> 精确匹配，立即使用，搜索结束</li><li>如果最长匹配是 <code>^~</code>，立即使用，搜索结束</li><li>否则，按顺序检查正则 location</li><li>如果找到正则匹配，使用正则 location</li><li>如果没有正则匹配，使用最长前缀 location</li></ol><h3 id="完整示例" tabindex="-1"><a class="header-anchor" href="#完整示例"><span>完整示例</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 1. 精确匹配 - 最高优先级</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 匹配：/</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 不匹配：/index.html</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &quot;exact root&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 2. ^~ 前缀匹配 - 优先于正则</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/images/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 匹配：/images/logo.png, /images/icons/arrow.svg</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 即使有正则匹配 \\.png$，也不会被覆盖</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/static;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 3. 普通前缀匹配 - 可能被正则覆盖</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /docs/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 匹配：/docs/index.html</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 但 \\.html$ 正则会优先</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/documentation;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 4. 正则匹配 - 覆盖普通前缀</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(html|htm)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 匹配：/docs/index.html, /about.html</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/html;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 5. 正则匹配 - 图片处理</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(jpg|jpeg|png|gif|svg)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 匹配：/assets/photo.jpg</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 但 /images/ 下的图片由 ^~ 处理</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/assets;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 6. 普通前缀匹配 - 兜底</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 匹配所有未被上述 location 捕获的 URI</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="匹配结果对照表" tabindex="-1"><a class="header-anchor" href="#匹配结果对照表"><span>匹配结果对照表</span></a></h3><table><thead><tr><th>请求 URI</th><th>匹配结果</th><th>原因</th></tr></thead><tbody><tr><td><code>/</code></td><td><code>= /</code></td><td>精确匹配，最高优先级</td></tr><tr><td><code>/images/logo.png</code></td><td><code>^~ /images/</code></td><td>^~ 阻止正则匹配</td></tr><tr><td><code>/docs/index.html</code></td><td><code>~* \\.(html|htm)$</code></td><td>正则覆盖普通前缀</td></tr><tr><td><code>/docs/api/</code></td><td><code>/docs/</code></td><td>普通前缀，无正则匹配</td></tr><tr><td><code>/assets/photo.jpg</code></td><td><code>~* \\.(jpg|...)$</code></td><td>正则匹配</td></tr><tr><td><code>/about.html</code></td><td><code>~* \\.(html|htm)$</code></td><td>正则匹配</td></tr><tr><td><code>/api/users</code></td><td><code>/</code></td><td>普通前缀最长匹配</td></tr></tbody></table><h2 id="location-嵌套规则" tabindex="-1"><a class="header-anchor" href="#location-嵌套规则"><span>location 嵌套规则</span></a></h2><h3 id="嵌套限制" tabindex="-1"><a class="header-anchor" href="#嵌套限制"><span>嵌套限制</span></a></h3><p>Nginx 的 location 嵌套有严格限制：</p><ol><li><strong>普通前缀 location 可以嵌套普通前缀 location</strong></li><li><strong>正则 location 不能嵌套任何 location</strong></li><li><strong>精确匹配 location 不能嵌套任何 location</strong></li><li><strong>^~ location 可以嵌套普通前缀 location</strong></li></ol><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 允许：普通前缀嵌套普通前缀</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/v1/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://v1_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/v2/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://v2_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 禁止：正则 location 嵌套</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">\\.php$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">\\.php5$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 错误！正则 location 不能嵌套</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 禁止：精确匹配 location 嵌套</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /index {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 错误！精确匹配 location 不能嵌套</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">location 嵌套的性能影响</p><p>location 嵌套会增加匹配的复杂度。在深度嵌套的情况下，每个请求可能需要遍历多层 location 树。建议尽量使用扁平化的 location 结构，通过精确的匹配模式避免不必要的嵌套。</p></div><h3 id="嵌套的实际应用" tabindex="-1"><a class="header-anchor" href="#嵌套的实际应用"><span>嵌套的实际应用</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 公共配置</span></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=api_limit burst=20 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/public/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 公开 API - 无需认证</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://public_api;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/admin/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 管理 API - 需要 IP 白名单 + 认证</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">192.168.1.0/24;</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        auth_basic </span><span style="color:#98C379;">&quot;Admin API&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        auth_basic_user_file </span><span style="color:#ABB2BF;">/etc/nginx/.htpasswd;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://admin_api;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/internal/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 内部 API - 仅允许内网访问</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">        allow </span><span style="color:#ABB2BF;">172.16.0.0/12;</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://internal_api;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="命名-location-name-用法" tabindex="-1"><a class="header-anchor" href="#命名-location-name-用法"><span>命名 location：@name 用法</span></a></h2><p>命名 location 使用 <code>@</code> 前缀定义，不参与正常的 URI 匹配，只能通过内部重定向访问。</p><h3 id="语法" tabindex="-1"><a class="header-anchor" href="#语法"><span>语法</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> @name {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 配置指令</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用场景" tabindex="-1"><a class="header-anchor" href="#使用场景"><span>使用场景</span></a></h3><ol><li><strong>error_page 重定向</strong>：将错误响应重定向到专门的错误处理 location</li><li><strong>try_files 兜底</strong>：当文件不存在时的降级处理</li><li><strong>rewrite 目标</strong>：将 URI 重写到特定处理逻辑</li></ol><h3 id="命名-location-示例" tabindex="-1"><a class="header-anchor" href="#命名-location-示例"><span>命名 location 示例</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/html;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 主 location</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ @fallback;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 命名 location - 兜底处理</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> @fallback {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 命名 location - 错误处理</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> @error50x {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/error-pages;</span></span>
<span class="line"><span style="color:#C678DD;">        rewrite</span><span style="color:#ABB2BF;"> ^ /50x.html </span><span style="color:#C678DD;">break</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 错误页面指向命名 location</span></span>
<span class="line"><span style="color:#C678DD;">    error_page </span><span style="color:#D19A66;">500</span><span style="color:#D19A66;"> 502</span><span style="color:#D19A66;"> 503</span><span style="color:#D19A66;"> 504</span><span style="color:#ABB2BF;"> @error50x;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="命名-location-与内部重定向" tabindex="-1"><a class="header-anchor" href="#命名-location-与内部重定向"><span>命名 location 与内部重定向</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # API 路由</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 认证失败时跳转到错误处理</span></span>
<span class="line"><span style="color:#C678DD;">        auth_request </span><span style="color:#ABB2BF;">/auth;</span></span>
<span class="line"><span style="color:#C678DD;">        error_page </span><span style="color:#D19A66;">401</span><span style="color:#ABB2BF;"> = @auth_error;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 认证错误处理</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> @auth_error {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 401</span><span style="color:#98C379;"> &#39;{&quot;error&quot;: &quot;Authentication required&quot;, &quot;code&quot;: 401}&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Content-Type application/json always;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 速率限制错误处理</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> @rate_limit_error {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 429</span><span style="color:#98C379;"> &#39;{&quot;error&quot;: &quot;Too many requests&quot;, &quot;code&quot;: 429}&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Content-Type application/json always;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 认证子请求</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/auth </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        internal</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://auth_service/verify;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass_request_body </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Content-Length </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">命名 location 的特点</p><ol><li>命名 location 不参与 URI 匹配，外部无法直接访问</li><li>命名 location 只能通过 <code>error_page</code>、<code>try_files</code>、<code>rewrite</code> 等内部重定向机制访问</li><li>命名 location 不能嵌套其他 location</li><li>命名 location 不能使用 <code>= / ~ ~* ^~</code> 修饰符</li></ol></div><h2 id="location-与-if-的陷阱" tabindex="-1"><a class="header-anchor" href="#location-与-if-的陷阱"><span>location 与 if 的陷阱</span></a></h2><h3 id="if-is-evil-问题的根源" tabindex="-1"><a class="header-anchor" href="#if-is-evil-问题的根源"><span>&quot;if is evil&quot; 问题的根源</span></a></h3><p>Nginx 的 <code>if</code> 指令在 location 中有众所周知的问题，社区甚至有一篇著名的文章叫&quot;If is Evil&quot;。问题的根源在于 <code>if</code> 的执行机制与直觉不符。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 陷阱：if 中的配置可能不会按预期工作</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">    set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">backend</span><span style="color:#98C379;"> &quot;default&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">http_x_api_version</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;v2&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">        set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">backend</span><span style="color:#98C379;"> &quot;v2&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # proxy_pass 在 if 之外，$backend 可能在 if 中被修改</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="if-的执行机制" tabindex="-1"><a class="header-anchor" href="#if-的执行机制"><span>if 的执行机制</span></a></h3>`,50),i(f,{code:`eJxLy8kvT85ILCpRCHHhUgACx+gX+2c/bV2ak5+cWJKZnxeroKtrp+BU/Wzuwie7tz3tWPJs2tpasEonkEwNRPzJjl3P58yvUXCuzkx7Onf6kx1rn81Y/3TCsmdzOpPz80pS80oUMhLzUnJSi+yxan7a2F6j4BL9ZO/+51NWwKx+PqvlZWvv873rYsFanCFaMEysUXCFagTbDdSFpgBF+/QFGNrdomGOBup91tP+ZPeSpxM6nu4E+nYDPBjAZriBA8OFC8wpLqnMSVVwVUjLzMmxUk5LS05JMUKScINLpFkmmyBJuEAlki1SzZItuQDutaU1`}),s[5]||=n(`<h3 id="if-的安全用法" tabindex="-1"><a class="header-anchor" href="#if-的安全用法"><span>if 的安全用法</span></a></h3><p><code>if</code> 在以下场景中是安全的：</p><ol><li><strong>return</strong>：直接返回响应</li><li><strong>rewrite ... last/redirect/permanent</strong>：重写或重定向</li></ol><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安全用法 1：return</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;"> != </span><span style="color:#98C379;">&quot;https&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 301</span><span style="color:#ABB2BF;"> https://$</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安全用法 2：rewrite</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /old-api/ {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">http_x_api_version</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#98C379;">&quot;^1\\.&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">        rewrite</span><span style="color:#E06C75;"> ^/old-api/(.*)$</span><span style="color:#ABB2BF;"> /api/v1/$</span><span style="color:#E06C75;">1</span><span style="color:#C678DD;"> last</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="if-的危险用法" tabindex="-1"><a class="header-anchor" href="#if-的危险用法"><span>if 的危险用法</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 危险用法 1：if 中的 proxy_pass</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">http_x_feature_flag</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;new&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://new_backend;  </span><span style="color:#7F848E;font-style:italic;"># 可能不会按预期工作</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://default_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 危险用法 2：if 中的 root/alias</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /images/ {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">arg_size</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;thumb&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/thumbnails;  </span><span style="color:#7F848E;font-style:italic;"># 可能不会按预期工作</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/images;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 危险用法 3：if 中的 try_files</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">cookie_logged_in</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;1&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> /dashboard.html;  </span><span style="color:#7F848E;font-style:italic;"># 可能不会按预期工作</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ /index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="替代-if-的方案" tabindex="-1"><a class="header-anchor" href="#替代-if-的方案"><span>替代 if 的方案</span></a></h3><h4 id="使用-map-替代条件判断" tabindex="-1"><a class="header-anchor" href="#使用-map-替代条件判断"><span>使用 map 替代条件判断</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 map 替代 if</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_x_api_version</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">api_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#98C379;">    &quot;v2&quot;</span><span style="color:#ABB2BF;">     v2_backend;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;v1&quot;</span><span style="color:#ABB2BF;">     v1_backend;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">  default_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> v2_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.2:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> v1_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.1:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> default_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.0.1:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">api_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用多个-location-替代-if" tabindex="-1"><a class="header-anchor" href="#使用多个-location-替代-if"><span>使用多个 location 替代 if</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 不推荐：使用 if</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /images/ {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">arg_size</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;thumb&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/thumbnails;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/images;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 推荐：使用多个 location</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /images/thumb/ {</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/thumbnails;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /images/ {</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/images;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用-try-files-替代-if-文件存在判断" tabindex="-1"><a class="header-anchor" href="#使用-try-files-替代-if-文件存在判断"><span>使用 try_files 替代 if 文件存在判断</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 不推荐：使用 if 判断文件</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (-f $</span><span style="color:#E06C75;">request_filename</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">        break</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 推荐：使用 try_files</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">    try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> @backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> @backend {</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实战-典型-location-配置模式" tabindex="-1"><a class="header-anchor" href="#实战-典型-location-配置模式"><span>实战：典型 location 配置模式</span></a></h2><h3 id="模式-1-spa-应用" tabindex="-1"><a class="header-anchor" href="#模式-1-spa-应用"><span>模式 1：SPA 应用</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/spa;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.html;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 精确匹配静态资源</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/favicon.ico </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        log_not_found </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 204</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/robots.txt </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        log_not_found </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        alias </span><span style="color:#ABB2BF;">/var/www/seo/robots.txt;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 静态资源目录 - 避免正则匹配</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/static/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">365d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, immutable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/assets/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # API 请求代理到后端</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SPA 兜底 - 所有其他请求返回 index.html</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ /index.html;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="模式-2-动静分离" tabindex="-1"><a class="header-anchor" href="#模式-2-动静分离"><span>模式 2：动静分离</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 静态资源 - 本地处理</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/images/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/static;</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/css/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/static;</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">7d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/js/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/static;</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">7d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/fonts/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        root </span><span style="color:#ABB2BF;">/var/www/static;</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">365d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, immutable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Access-Control-Allow-Origin </span><span style="color:#98C379;">&quot;*&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 动态请求 - 代理到后端</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://app_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="模式-3-多版本-api" tabindex="-1"><a class="header-anchor" href="#模式-3-多版本-api"><span>模式 3：多版本 API</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # API v1</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /v1/ {</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=api_limit burst=20 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://v1_backend/;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-API-Version </span><span style="color:#98C379;">&quot;v1&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # API v2</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /v2/ {</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=api_limit burst=50 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://v2_backend/;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-API-Version </span><span style="color:#98C379;">&quot;v2&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 最新版 API（默认）</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=api_limit burst=50 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://v2_backend/;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-API-Version </span><span style="color:#98C379;">&quot;v2&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="模式-4-wordpress" tabindex="-1"><a class="header-anchor" href="#模式-4-wordpress"><span>模式 4：WordPress</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">blog.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/wordpress;</span></span>
<span class="line"><span style="color:#C678DD;">    index </span><span style="color:#ABB2BF;">index.php;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 精确匹配 favicon</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/favicon.ico </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        log_not_found </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 精确匹配 robots</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/robots.txt </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        log_not_found </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 静态资源</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/wp-content/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/wp-includes/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # PHP 文件处理</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">\\.php$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        fastcgi_pass </span><span style="color:#ABB2BF;">unix:/run/php-fpm.sock;</span></span>
<span class="line"><span style="color:#C678DD;">        fastcgi_param </span><span style="color:#ABB2BF;">SCRIPT_FILENAME $</span><span style="color:#E06C75;">document_root</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">fastcgi_script_name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        include </span><span style="color:#ABB2BF;">fastcgi_params;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # WordPress 固定链接</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">uri</span><span style="color:#ABB2BF;">/ /index.php?$</span><span style="color:#E06C75;">args</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 禁止访问隐藏文件</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">/\\. </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 禁止访问 WordPress 配置文件</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">/wp-config\\.php$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="模式-5-文件下载服务" tabindex="-1"><a class="header-anchor" href="#模式-5-文件下载服务"><span>模式 5：文件下载服务</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">download.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/downloads;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 大文件下载优化</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 直接下载（不预览）</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /force-download/ {</span></span>
<span class="line"><span style="color:#C678DD;">        alias </span><span style="color:#ABB2BF;">/var/www/downloads/;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Content-Disposition </span><span style="color:#98C379;">&quot;attachment&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 限速下载</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /limited/ {</span></span>
<span class="line"><span style="color:#C678DD;">        alias </span><span style="color:#ABB2BF;">/var/www/downloads/;</span></span>
<span class="line"><span style="color:#C678DD;">        limit_rate </span><span style="color:#D19A66;">500k</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 限速 500KB/s</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 自动索引</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /list/ {</span></span>
<span class="line"><span style="color:#C678DD;">        alias </span><span style="color:#ABB2BF;">/var/www/downloads/;</span></span>
<span class="line"><span style="color:#C678DD;">        autoindex </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        autoindex_exact_size </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        autoindex_localtime </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 默认处理</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        try_files </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">uri</span><span style="color:#D19A66;"> =404</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="性能考量-location-数量与匹配效率" tabindex="-1"><a class="header-anchor" href="#性能考量-location-数量与匹配效率"><span>性能考量：location 数量与匹配效率</span></a></h2><h3 id="匹配效率分析" tabindex="-1"><a class="header-anchor" href="#匹配效率分析"><span>匹配效率分析</span></a></h3><table><thead><tr><th>匹配类型</th><th>时间复杂度</th><th>说明</th></tr></thead><tbody><tr><td><code>=</code> 精确匹配</td><td>O(1)</td><td>哈希查找</td></tr><tr><td><code>^~</code> 前缀匹配</td><td>O(n)</td><td>遍历所有前缀，取最长</td></tr><tr><td>普通前缀匹配</td><td>O(n)</td><td>遍历所有前缀，取最长</td></tr><tr><td><code>~</code> / <code>~*</code> 正则匹配</td><td>O(n)</td><td>按顺序逐个匹配正则</td></tr></tbody></table><div class="hint-container important"><p class="hint-container-title">正则匹配的性能代价</p><p>正则匹配是最昂贵的操作，每个请求都需要按顺序尝试所有正则表达式，直到找到匹配。大量正则 location 会显著增加请求处理延迟，尤其是在高并发场景下。</p></div><h3 id="优化策略" tabindex="-1"><a class="header-anchor" href="#优化策略"><span>优化策略</span></a></h3><h4 id="_1-使用精确匹配替代正则" tabindex="-1"><a class="header-anchor" href="#_1-使用精确匹配替代正则"><span>1. 使用精确匹配替代正则</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 不推荐：正则匹配</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">^/favicon\\.ico$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    log_not_found </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 推荐：精确匹配</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/favicon.ico </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    log_not_found </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-使用-阻止正则匹配" tabindex="-1"><a class="header-anchor" href="#_2-使用-阻止正则匹配"><span>2. 使用 ^~ 阻止正则匹配</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 不推荐：静态资源路径被正则匹配</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /images/ {</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/static;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(jpg|png|gif)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/static;</span></span>
<span class="line"><span style="color:#C678DD;">    expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 推荐：使用 ^~ 避免正则匹配</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ^~ </span><span style="color:#E06C75;">/images/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    root </span><span style="color:#ABB2BF;">/var/www/static;</span></span>
<span class="line"><span style="color:#C678DD;">    expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-减少-location-数量" tabindex="-1"><a class="header-anchor" href="#_3-减少-location-数量"><span>3. 减少 location 数量</span></a></h4><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 不推荐：每个图片类型一个 location</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.jpg$ </span><span style="color:#ABB2BF;">{</span><span style="color:#C678DD;"> expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.jpeg$ </span><span style="color:#ABB2BF;">{</span><span style="color:#C678DD;"> expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.png$ </span><span style="color:#ABB2BF;">{</span><span style="color:#C678DD;"> expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.gif$ </span><span style="color:#ABB2BF;">{</span><span style="color:#C678DD;"> expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">; }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 推荐：合并正则</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">\\.(jpg|jpeg|png|gif)$ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-高频路径放在前面" tabindex="-1"><a class="header-anchor" href="#_4-高频路径放在前面"><span>4. 高频路径放在前面</span></a></h4><p>虽然前缀匹配和精确匹配的顺序不影响结果，但正则匹配是按配置顺序执行的。将高频请求的正则放在前面可以减少匹配次数。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 高频 API 路径的正则放在前面</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">^/api/users </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://user_service;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">^/api/orders </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://order_service;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 低频 API 路径的正则放在后面</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">^/api/reports </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://report_service;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="location-数量的性能影响" tabindex="-1"><a class="header-anchor" href="#location-数量的性能影响"><span>location 数量的性能影响</span></a></h3><table><thead><tr><th>location 数量</th><th>正则匹配数</th><th>平均匹配延迟</th><th>建议措施</th></tr></thead><tbody><tr><td>&lt; 20</td><td>&lt; 5</td><td>可忽略</td><td>无需优化</td></tr><tr><td>20-100</td><td>5-20</td><td>轻微</td><td>使用 ^~ 减少正则</td></tr><tr><td>100-500</td><td>20-50</td><td>明显</td><td>重构为多个 server 块</td></tr><tr><td>&gt; 500</td><td>&gt; 50</td><td>严重</td><td>考虑使用 map 或 Lua</td></tr></tbody></table><h3 id="使用-map-替代大量-location" tabindex="-1"><a class="header-anchor" href="#使用-map-替代大量-location"><span>使用 map 替代大量 location</span></a></h3><p>当有大量相似路径需要不同处理时，<code>map</code> 指令比大量 <code>location</code> 更高效：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 不推荐：大量 location</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /service-a/ {</span><span style="color:#C678DD;"> proxy_pass </span><span style="color:#ABB2BF;">http://service-a; }</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /service-b/ {</span><span style="color:#C678DD;"> proxy_pass </span><span style="color:#ABB2BF;">http://service-b; }</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /service-c/ {</span><span style="color:#C678DD;"> proxy_pass </span><span style="color:#ABB2BF;">http://service-c; }</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ... 50+ 个 location</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 推荐：使用 map</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">uri</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">service_port</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^/service-a/  </span><span style="color:#D19A66;">8001</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^/service-b/  </span><span style="color:#D19A66;">8002</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^/service-c/  </span><span style="color:#D19A66;">8003</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">        8000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://127.0.0.1:$</span><span style="color:#E06C75;">service_port</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="location-匹配常见问题" tabindex="-1"><a class="header-anchor" href="#location-匹配常见问题"><span>location 匹配常见问题</span></a></h2><h3 id="问题-1-location-顺序不影响匹配结果" tabindex="-1"><a class="header-anchor" href="#问题-1-location-顺序不影响匹配结果"><span>问题 1：location 顺序不影响匹配结果？</span></a></h3><p><strong>部分正确</strong>。前缀匹配（包括 <code>=</code> 和 <code>^~</code>）的顺序不影响结果，因为 Nginx 总是选择最长匹配。但正则匹配的顺序<strong>确实影响</strong>结果，Nginx 使用第一个匹配的正则。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 这两个 location 的顺序不影响前缀匹配结果</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/v1/ { ... }</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ { ... }</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /api/v1/users 一定会匹配 /api/v1/，无论谁在前面</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 但这两个正则的顺序会影响结果</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">^/api/users </span><span style="color:#ABB2BF;">{ ... }</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~ </span><span style="color:#E06C75;">^/api/ </span><span style="color:#ABB2BF;">{ ... }</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /api/users/123 会匹配先出现的那个</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="问题-2-location-能匹配查询参数吗" tabindex="-1"><a class="header-anchor" href="#问题-2-location-能匹配查询参数吗"><span>问题 2：location 能匹配查询参数吗？</span></a></h3><p><strong>不能</strong>。<code>location</code> 只匹配 URI 的路径部分，不包含查询参数。查询参数可以通过 <code>$args</code> 和 <code>$arg_*</code> 变量访问。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 错误：无法匹配查询参数</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api?key=secret {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 这个 location 永远不会匹配</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 正确：使用 if 判断查询参数</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">arg_key</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;secret&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://premium_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://default_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 更好的方式：使用 map</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">arg_key</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">api_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#98C379;">    &quot;secret&quot;</span><span style="color:#ABB2BF;">  premium_backend;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">   default_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api {</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">api_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="问题-3-location-中的斜杠" tabindex="-1"><a class="header-anchor" href="#问题-3-location-中的斜杠"><span>问题 3：location 中的斜杠</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 这两个是不同的</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配 /api、/api/、/api/users 等</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 匹配 /api/、/api/users 等</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 注意：不匹配 /api（前缀匹配要求 URI 以模式开头，</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # /api 不以 /api/ 开头，所以 location /api/ 不匹配 /api）</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">URI 末尾斜杠</p><p>在 location 前缀匹配中，<code>/api</code> 能匹配 <code>/api</code>、<code>/api/</code> 和 <code>/api/users</code>。但 <code>/api/</code> 只匹配以 <code>/api/</code> 开头的 URI（如 <code>/api/</code>、<code>/api/users</code>），不匹配 <code>/api</code>。精确匹配 <code>= /api</code> 和 <code>= /api/</code> 是不同的。</p></div><h3 id="问题-4-正则-location-中的捕获组" tabindex="-1"><a class="header-anchor" href="#问题-4-正则-location-中的捕获组"><span>问题 4：正则 location 中的捕获组</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 命名捕获组</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">^/api/(?&lt;version&gt;v[0-9]+)/(?&lt;resource&gt;[a-z-]+) </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">version_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-Resource $</span><span style="color:#E06C75;">resource</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 数字捕获组</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> ~* </span><span style="color:#E06C75;">^/api/(v[0-9]+)/([a-z-]+) </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">    set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">api_version</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">api_resource</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">2</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-API-Version $</span><span style="color:#E06C75;">api_version</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    proxy_set_header </span><span style="color:#ABB2BF;">X-Resource $</span><span style="color:#E06C75;">api_resource</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2><p>Nginx location 匹配规则是 HTTP 配置的核心，掌握以下要点至关重要：</p><ol><li><strong>四种修饰符</strong>：<code>=</code>（精确）、<code>^~</code>（前缀优先）、<code>~</code>/<code>~*</code>（正则）、无修饰符（普通前缀）</li><li><strong>优先级</strong>：精确 <code>=</code> &gt; 前缀优先 <code>^~</code> &gt; 正则 <code>~</code>/<code>~*</code> &gt; 普通前缀</li><li><strong>正则顺序</strong>：正则匹配按配置文件中的出现顺序执行，第一个匹配的生效</li><li><strong>命名 location</strong>：使用 <code>@</code> 前缀，不参与 URI 匹配，仅通过内部重定向访问</li><li><strong>if 的陷阱</strong>：<code>if</code> 在 location 中有已知问题，应优先使用 <code>map</code> 替代</li><li><strong>性能优化</strong>：使用 <code>=</code> 和 <code>^~</code> 减少正则匹配，合并相似正则，控制 location 数量</li></ol><div class="hint-container tip"><p class="hint-container-title">进一步阅读</p><ul><li><a href="https://nginx.org/en/docs/http/ngx_http_core_module.html#location" target="_blank" rel="noopener noreferrer">ngx_http_core_module - location</a></li><li><a href="https://nginx.org/en/docs/http/request_processing.html" target="_blank" rel="noopener noreferrer">Nginx Location Matching</a></li><li><a href="https://www.nginx.com/resources/wiki/start/topics/depth/ifisevil/" target="_blank" rel="noopener noreferrer">If Is Evil</a></li></ul></div>`,59)])}var u=o(c,[[`render`,l]]);export{s as _pageData,u as default};