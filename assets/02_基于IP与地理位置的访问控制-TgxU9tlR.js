import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-DCZUiBeJ.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/06_%E9%99%90%E6%B5%81%E4%B8%8E%E8%AE%BF%E9%97%AE%E6%8E%A7%E5%88%B6/02_%E5%9F%BA%E4%BA%8EIP%E4%B8%8E%E5%9C%B0%E7%90%86%E4%BD%8D%E7%BD%AE%E7%9A%84%E8%AE%BF%E9%97%AE%E6%8E%A7%E5%88%B6.html","title":"基于 IP 与地理位置的访问控制","lang":"zh-CN","frontmatter":{"title":"基于 IP 与地理位置的访问控制","icon":"fa6-solid:earth-asia","order":2,"category":["Linux","Nginx"],"tag":["IP","GeoIP","访问控制","黑白名单","反爬虫"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":12.01,"words":3602},"filePathRelative":"Linux/07_Nginx/06_限流与访问控制/02_基于IP与地理位置的访问控制.md"}`),s={name:`02_基于IP与地理位置的访问控制.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="基于-ip-与地理位置的访问控制" tabindex="-1"><a class="header-anchor" href="#基于-ip-与地理位置的访问控制"><span>基于 IP 与地理位置的访问控制</span></a></h1><h2 id="访问控制概述" tabindex="-1"><a class="header-anchor" href="#访问控制概述"><span>访问控制概述</span></a></h2><p>IP 与地理位置的访问控制是网络安全的基础防线，常见应用场景：</p><ul><li><strong>区域限制</strong>：仅允许特定国家/地区访问内容</li><li><strong>合规要求</strong>：遵守地区法规（如 GDPR、数据本地化）</li><li><strong>安全防护</strong>：封禁恶意 IP、防御 DDoS 攻击</li><li><strong>内容分发</strong>：根据地理位置路由到最近的节点</li><li><strong>反爬虫</strong>：限制可疑 IP 的访问频率</li></ul><hr><h2 id="allow-deny-指令与-cidr-规则" tabindex="-1"><a class="header-anchor" href="#allow-deny-指令与-cidr-规则"><span>allow/deny 指令与 CIDR 规则</span></a></h2><h3 id="基本语法" tabindex="-1"><a class="header-anchor" href="#基本语法"><span>基本语法</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_access_module.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 语法</span></span>
<span class="line"><span style="color:#C678DD;">allow </span><span style="color:#ABB2BF;">address | CIDR | </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">deny </span><span style="color:#ABB2BF;"> address | CIDR | </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 作用域：http, server, location, limit_except</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="allow-deny-规则匹配" tabindex="-1"><a class="header-anchor" href="#allow-deny-规则匹配"><span>allow/deny 规则匹配</span></a></h3><p>Nginx 按照规则出现顺序依次匹配，首次匹配即生效：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 规则匹配顺序：从上到下，首次匹配生效</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 示例 1：白名单模式（推荐）</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /admin/ {</span></span>
<span class="line"><span style="color:#C678DD;">    deny </span><span style="color:#D19A66;"> all</span><span style="color:#ABB2BF;">;                    </span><span style="color:#7F848E;font-style:italic;"># 先拒绝所有</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#ABB2BF;">192.168.1.0/24;        </span><span style="color:#7F848E;font-style:italic;"># 允许内网</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#D19A66;">10.0.0.1</span><span style="color:#ABB2BF;">;              </span><span style="color:#7F848E;font-style:italic;"># 允许特定 IP</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 注意：deny all 在前，但 allow 优先级更高？</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 不！顺序匹配，192.168.1.x 和 10.0.0.1 先被 deny all 拦截</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 这是错误的写法！</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 正确的白名单模式</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /admin/ {</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#ABB2BF;">192.168.1.0/24;        </span><span style="color:#7F848E;font-style:italic;"># 先允许内网</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#D19A66;">10.0.0.1</span><span style="color:#ABB2BF;">;              </span><span style="color:#7F848E;font-style:italic;"># 允许特定 IP</span></span>
<span class="line"><span style="color:#C678DD;">    deny </span><span style="color:#D19A66;"> all</span><span style="color:#ABB2BF;">;                    </span><span style="color:#7F848E;font-style:italic;"># 最后拒绝其他所有</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">规则顺序至关重要</p><p>Nginx 的 allow/deny 按顺序匹配，首次命中即停止。白名单模式必须先 allow 再 deny all，黑名单模式必须先 deny 再 allow all。</p></div><h3 id="cidr-表示法" tabindex="-1"><a class="header-anchor" href="#cidr-表示法"><span>CIDR 表示法</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>CIDR（Classless Inter-Domain Routing）表示法：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>IP/CIDR       | 含义              | 匹配范围</span></span>
<span class="line"><span>-------------|-------------------|------------------</span></span>
<span class="line"><span>10.0.0.1/32  | 单个 IP           | 仅 10.0.0.1</span></span>
<span class="line"><span>10.0.0.0/24  | C 类网段          | 10.0.0.0 - 10.0.0.255</span></span>
<span class="line"><span>10.0.0.0/16  | B 类网段          | 10.0.0.0 - 10.0.255.255</span></span>
<span class="line"><span>10.0.0.0/8   | A 类网段          | 10.0.0.0 - 10.255.255.255</span></span>
<span class="line"><span>0.0.0.0/0    | 所有 IPv4         | 0.0.0.0 - 255.255.255.255</span></span>
<span class="line"><span>::1/128      | IPv6 本地回环     | 仅 ::1</span></span>
<span class="line"><span>2001:db8::/32 | IPv6 网段        | 2001:db8:0:0:0:0:0:0 - 2001:db8:ffff:ffff:...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="常见配置场景" tabindex="-1"><a class="header-anchor" href="#常见配置场景"><span>常见配置场景</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 场景 1：管理后台白名单</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /admin/ {</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#ABB2BF;">192.168.1.0/24;        </span><span style="color:#7F848E;font-style:italic;"># 公司内网</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#D19A66;">203.0.113.50</span><span style="color:#ABB2BF;">;          </span><span style="color:#7F848E;font-style:italic;"># 运维人员家庭 IP</span></span>
<span class="line"><span style="color:#C678DD;">    deny </span><span style="color:#D19A66;"> all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://admin_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 场景 2：API 黑名单</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">    deny </span><span style="color:#ABB2BF;"> 198.51.100.0/24;       </span><span style="color:#7F848E;font-style:italic;"># 已知恶意 IP 段</span></span>
<span class="line"><span style="color:#C678DD;">    deny </span><span style="color:#D19A66;"> 203.0.113.100</span><span style="color:#ABB2BF;">;         </span><span style="color:#7F848E;font-style:italic;"># 恶意 IP</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 场景 3：仅允许国内 IP（配合 GeoIP2）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 见后续 GeoIP2 章节</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 场景 4：限制特定 HTTP 方法</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#ABB2BF;">192.168.0.0/16;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    limit_except</span><span style="color:#ABB2BF;"> GET {</span></span>
<span class="line"><span style="color:#C678DD;">        deny </span><span style="color:#D19A66;"> all</span><span style="color:#ABB2BF;">;               </span><span style="color:#7F848E;font-style:italic;"># 非 GET 方法仅允许内网</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 场景 5：IPv4 + IPv6 白名单</span></span>
<span class="line"><span style="color:#C678DD;">location</span><span style="color:#ABB2BF;"> /internal/ {</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#ABB2BF;">172.16.0.0/12;</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#ABB2BF;">192.168.0.0/16;</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#ABB2BF;">::1;                    </span><span style="color:#7F848E;font-style:italic;"># IPv6 本地</span></span>
<span class="line"><span style="color:#C678DD;">    allow </span><span style="color:#ABB2BF;">fd00::/8;              </span><span style="color:#7F848E;font-style:italic;"># IPv6 ULA</span></span>
<span class="line"><span style="color:#C678DD;">    deny </span><span style="color:#D19A66;"> all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    proxy_pass </span><span style="color:#ABB2BF;">http://internal_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="基于-ip-的访问控制流程" tabindex="-1"><a class="header-anchor" href="#基于-ip-的访问控制流程"><span>基于 IP 的访问控制流程</span></a></h3>`,17),i(d,{code:`eJx1kU1LAkEYx+9+ioe9i6mdIoRICiFCotvgYdVRI3FrdyUigwoNoRcjqK1D9KZ0CNY6WUr4aWac/RbNzqMmpHvYYXd+/5d5Jlc09jIF3bRhMx4A+WzQ3TK1bMLcF17vDN7bot3hnycpCAZjsErtRJKIyw5r3I4BSCRTSqp2FbdcoJntpaL0PuCvR/yxBbr/EcrS0j6Ityqr3x8GlOaP9IUVdv7t1S6QroD6T1jtWLhfwu17jotB00W+eQXi8k342fWg94ASmJ+LTpVx5wmVWMiX5vRy0SZe7064TYxNYU3fVZ1szciHiSbcD/Zzg/7cabG+s5g2QzGZBCuGmd7Kyi4aho7zIGkaGWpZhDWrg6vT4ViH7ip4ksJYq5zOm/pOATQ5WKyJlb3nLus2NAWpWwsT3IbwwsSs0V4BkREQmQFER8D6f4CWstOuS8biEsElGvgFXaHv3w==`}),o[1]||=n(`<hr><h2 id="geoip2-模块安装与配置" tabindex="-1"><a class="header-anchor" href="#geoip2-模块安装与配置"><span>GeoIP2 模块安装与配置</span></a></h2><h3 id="geoip2-简介" tabindex="-1"><a class="header-anchor" href="#geoip2-简介"><span>GeoIP2 简介</span></a></h3><p>GeoIP2 是 MaxMind 提供的 IP 地理位置数据库，可以根据 IP 地址查询国家、城市、时区、ISP 等信息。Nginx 通过 <code>ngx_http_geoip2_module</code> 模块支持 GeoIP2。</p><h3 id="安装-geoip2-模块" tabindex="-1"><a class="header-anchor" href="#安装-geoip2-模块"><span>安装 GeoIP2 模块</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 下载 libmaxminddb 库</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> clone</span><span style="color:#D19A66;"> --recursive</span><span style="color:#98C379;"> https://github.com/maxmind/libmaxminddb</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> libmaxminddb</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span></span>
<span class="line"><span style="color:#61AFEF;">make</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> make</span><span style="color:#98C379;"> install</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ldconfig</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 下载 Nginx GeoIP2 模块</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> clone</span><span style="color:#98C379;"> https://github.com/leev/ngx_http_geoip2_module.git</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 编译 Nginx（添加 GeoIP2 模块）</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> nginx-1.25.x</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#D19A66;"> --add-module=/path/to/ngx_http_geoip2_module</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">            --with-http_ssl_module</span></span>
<span class="line"><span style="color:#61AFEF;">make</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> make</span><span style="color:#98C379;"> install</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 验证模块是否加载</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -V</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> geoip2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="获取-geoip2-数据库" tabindex="-1"><a class="header-anchor" href="#获取-geoip2-数据库"><span>获取 GeoIP2 数据库</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 注册 MaxMind 账号（免费）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># https://www.maxmind.com/en/geolite2/signup</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 下载 GeoLite2 数据库（需要 License Key）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 登录后获取 License Key</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 mmdb-bin 下载</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 mmdb-bin</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> mmdb-bin</span><span style="color:#7F848E;font-style:italic;">    # Ubuntu/Debian</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或使用 geoipupdate 工具</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> geoipupdate</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置 geoipupdate</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/GeoIP.conf</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">AccountID YOUR_ACCOUNT_ID</span></span>
<span class="line"><span style="color:#98C379;">LicenseKey YOUR_LICENSE_KEY</span></span>
<span class="line"><span style="color:#98C379;">EditionIDs GeoLite2-Country GeoLite2-City</span></span>
<span class="line"><span style="color:#98C379;">DatabaseDirectory /usr/share/GeoIP</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 下载数据库</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> geoipupdate</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证数据库</span></span>
<span class="line"><span style="color:#61AFEF;">mmdblookup</span><span style="color:#D19A66;"> --file</span><span style="color:#98C379;"> /usr/share/GeoIP/GeoLite2-Country.mmdb</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --ip</span><span style="color:#D19A66;"> 8.8.8.8</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nginx-geoip2-配置" tabindex="-1"><a class="header-anchor" href="#nginx-geoip2-配置"><span>Nginx GeoIP2 配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://github.com/leev/ngx_http_geoip2_module</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 http 块中加载 GeoIP2 数据库</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 加载国家数据库</span></span>
<span class="line"><span style="color:#C678DD;">    geoip2</span><span style="color:#ABB2BF;"> /usr/share/GeoIP/GeoLite2-Country.mmdb {</span></span>
<span class="line"><span style="color:#C678DD;">        auto_reload</span><span style="color:#D19A66;"> 5m</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 每 5 分钟检查数据库更新</span></span>
<span class="line"><span style="color:#ABB2BF;">        $</span><span style="color:#C678DD;">geoip2_metadata_country_build</span><span style="color:#ABB2BF;"> = metadata.build_epoch;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 国家代码（如 CN, US, JP）</span></span>
<span class="line"><span style="color:#ABB2BF;">        $</span><span style="color:#C678DD;">geoip2_data_country_code</span><span style="color:#ABB2BF;"> = country iso_code;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 国家名称</span></span>
<span class="line"><span style="color:#ABB2BF;">        $</span><span style="color:#C678DD;">geoip2_data_country_name</span><span style="color:#ABB2BF;"> = country names en;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 是否在欧洲</span></span>
<span class="line"><span style="color:#ABB2BF;">        $</span><span style="color:#C678DD;">geoip2_data_country_in_eu</span><span style="color:#ABB2BF;"> = country is_in_european_union;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 加载城市数据库</span></span>
<span class="line"><span style="color:#C678DD;">    geoip2</span><span style="color:#ABB2BF;"> /usr/share/GeoIP/GeoLite2-City.mmdb {</span></span>
<span class="line"><span style="color:#C678DD;">        auto_reload</span><span style="color:#D19A66;"> 5m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 城市名称</span></span>
<span class="line"><span style="color:#ABB2BF;">        $</span><span style="color:#C678DD;">geoip2_data_city_name</span><span style="color:#ABB2BF;"> = city names en;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 省份/州</span></span>
<span class="line"><span style="color:#ABB2BF;">        $</span><span style="color:#C678DD;">geoip2_data_region_name</span><span style="color:#ABB2BF;"> = subdivisions </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;"> names en;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 省份/州代码</span></span>
<span class="line"><span style="color:#ABB2BF;">        $</span><span style="color:#C678DD;">geoip2_data_region_code</span><span style="color:#ABB2BF;"> = subdivisions </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;"> iso_code;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 纬度</span></span>
<span class="line"><span style="color:#ABB2BF;">        $</span><span style="color:#C678DD;">geoip2_data_latitude</span><span style="color:#ABB2BF;"> = location latitude;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 经度</span></span>
<span class="line"><span style="color:#ABB2BF;">        $</span><span style="color:#C678DD;">geoip2_data_longitude</span><span style="color:#ABB2BF;"> = location longitude;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 时区</span></span>
<span class="line"><span style="color:#ABB2BF;">        $</span><span style="color:#C678DD;">geoip2_data_time_zone</span><span style="color:#ABB2BF;"> = location time_zone;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">auto_reload</p><p><code>auto_reload</code> 参数控制 Nginx 多久检查一次数据库文件是否更新。设置合理的值可以在更新数据库后自动生效，无需重启 Nginx。</p></div><hr><h2 id="基于国家-城市的路由" tabindex="-1"><a class="header-anchor" href="#基于国家-城市的路由"><span>基于国家/城市的路由</span></a></h2><h3 id="基于国家代码的路由" tabindex="-1"><a class="header-anchor" href="#基于国家代码的路由"><span>基于国家代码的路由</span></a></h3>`,14),i(d,{code:`eJxLy8kvT85ILCpRCHHhUgCCoNTC0tTikuin6xY969j+fPX6F+u3P9vYFKugq2un4J6a7xkQrQSmjBSezV/6Yv0im6QifTvPAIVHbZMUns7e+3Tdtie7Fz9f0KgUCzYPrBas2TexoDo3sUDhxfb1z6dsfNq2+fnaabVcYEVAKZCSGme/GgVnv2ilJzvWgoya0Ae0H2x+cp5uUmJydmpeCtRYmI7Q4BqF0OBopef7+lB1lBbj0OEVUKPgBfTEs+lLn81Zg6QjqwCHDtfQGgXXUKCONcufbdmEpCO1FIeOp63AQJhWo+CSmpZYmlMSrfRy94wX65YgaU2ByCDpBxvg7AcOqqDU4oL8vOLU6KeTe5/umgKPC4gtocEoisBiXpAwRhFzDcUUg7oIVQIAdXXMtg==`}),o[2]||=n(`<h3 id="国家路由配置" tabindex="-1"><a class="header-anchor" href="#国家路由配置"><span>国家路由配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 map 基于国家代码选择后端</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">geoip2_data_country_code</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">backend_name</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    CN  cn_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    HK  cn_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    TW  cn_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    US  us_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    CA  us_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    JP  jp_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    KR  jp_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    GB  eu_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    DE  eu_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    FR  eu_backend;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;"> default_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 定义各后端</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> cn_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> cn-api.example.com:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> us_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> us-api.example.com:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> jp_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> jp-api.example.com:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> eu_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> eu-api.example.com:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> default_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> api.example.com:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 根据 $backend_name 动态选择后端</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">backend_name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-GeoIP-Country $</span><span style="color:#E06C75;">geoip2_data_country_code</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-GeoIP-City $</span><span style="color:#E06C75;">geoip2_data_city_name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="地区限制访问" tabindex="-1"><a class="header-anchor" href="#地区限制访问"><span>地区限制访问</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 仅允许特定国家访问</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">geoip2_data_country_code</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">allowed_country</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;"> no;</span></span>
<span class="line"><span style="color:#ABB2BF;">    CN  yes;    </span><span style="color:#7F848E;font-style:italic;"># 中国</span></span>
<span class="line"><span style="color:#ABB2BF;">    HK  yes;    </span><span style="color:#7F848E;font-style:italic;"># 香港</span></span>
<span class="line"><span style="color:#ABB2BF;">    TW  yes;    </span><span style="color:#7F848E;font-style:italic;"># 台湾</span></span>
<span class="line"><span style="color:#ABB2BF;">    MO  yes;    </span><span style="color:#7F848E;font-style:italic;"># 澳门</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 拒绝不允许的国家</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">allowed_country</span><span style="color:#ABB2BF;"> = no) {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 403</span><span style="color:#98C379;"> &quot;Access denied from your country.&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 仅允许欧洲国家访问（GDPR 合规）</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">geoip2_data_country_in_eu</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">eu_only</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;"> no;</span></span>
<span class="line"><span style="color:#D19A66;">    1</span><span style="color:#ABB2BF;">      yes;  </span><span style="color:#7F848E;font-style:italic;"># is_in_european_union = 1</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">eu.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">eu_only</span><span style="color:#ABB2BF;"> = no) {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 403</span><span style="color:#98C379;"> &quot;This service is only available in the EU.&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://eu_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="基于城市的路由" tabindex="-1"><a class="header-anchor" href="#基于城市的路由"><span>基于城市的路由</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基于城市名称的路由</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">geoip2_data_city_name</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">city_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Shanghai&quot;</span><span style="color:#ABB2BF;">  sh_backend;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Beijing&quot;</span><span style="color:#ABB2BF;">   bj_backend;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Guangzhou&quot;</span><span style="color:#ABB2BF;"> gz_backend;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Shenzhen&quot;</span><span style="color:#ABB2BF;">  sz_backend;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">     default_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> sh_backend { </span><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> sh-node:8080; }</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> bj_backend { </span><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> bj-node:8080; }</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> gz_backend { </span><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> gz-node:8080; }</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> sz_backend { </span><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> sz-node:8080; }</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> default_backend { </span><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> default-node:8080; }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">city_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="地理位置路由完整示例" tabindex="-1"><a class="header-anchor" href="#地理位置路由完整示例"><span>地理位置路由完整示例</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 多级路由：国家 → 省份 → 城市</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第一级：国家</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">geoip2_data_country_code</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">country_route</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    CN  china;</span></span>
<span class="line"><span style="color:#ABB2BF;">    US  america;</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;"> international;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第二级：省份（仅中国）</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">geoip2_data_region_name</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">china_province_route</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">     cn_south;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Beijing&quot;</span><span style="color:#ABB2BF;">   cn_north;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Tianjin&quot;</span><span style="color:#ABB2BF;">   cn_north;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Hebei&quot;</span><span style="color:#ABB2BF;">     cn_north;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Shanghai&quot;</span><span style="color:#ABB2BF;">  cn_east;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Jiangsu&quot;</span><span style="color:#ABB2BF;">   cn_east;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Zhejiang&quot;</span><span style="color:#ABB2BF;">  cn_east;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Guangdong&quot;</span><span style="color:#ABB2BF;"> cn_south;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Fujian&quot;</span><span style="color:#ABB2BF;">    cn_south;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第三级：城市（仅广东省）</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">geoip2_data_city_name</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">guangdong_city_route</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">         gz_node;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Guangzhou&quot;</span><span style="color:#ABB2BF;">     gz_node;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Shenzhen&quot;</span><span style="color:#ABB2BF;">      sz_node;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Dongguan&quot;</span><span style="color:#ABB2BF;">      dg_node;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Foshan&quot;</span><span style="color:#ABB2BF;">        fs_node;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 组合路由</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">country_route</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">china_province_route</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">guangdong_city_route</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">final_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    default</span><span style="color:#ABB2BF;">             default_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^</span><span style="color:#C678DD;">china</span><span style="color:#ABB2BF;">             cn_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^</span><span style="color:#C678DD;">americ</span><span style="color:#ABB2BF;">            us_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^</span><span style="color:#C678DD;">international</span><span style="color:#ABB2BF;">     intl_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">final_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Country $</span><span style="color:#E06C75;">geoip2_data_country_code</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Region $</span><span style="color:#E06C75;">geoip2_data_region_name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-City $</span><span style="color:#E06C75;">geoip2_data_city_name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="geoip2-data-变量使用" tabindex="-1"><a class="header-anchor" href="#geoip2-data-变量使用"><span>$geoip2_data 变量使用</span></a></h2><h3 id="可用变量列表" tabindex="-1"><a class="header-anchor" href="#可用变量列表"><span>可用变量列表</span></a></h3><table><thead><tr><th>变量</th><th>数据库</th><th>说明</th><th>示例值</th></tr></thead><tbody><tr><td><code>$geoip2_data_country_code</code></td><td>Country</td><td>国家 ISO 代码</td><td>CN</td></tr><tr><td><code>$geoip2_data_country_name</code></td><td>Country</td><td>国家名称</td><td>China</td></tr><tr><td><code>$geoip2_data_country_in_eu</code></td><td>Country</td><td>是否在欧盟</td><td>0/1</td></tr><tr><td><code>$geoip2_data_city_name</code></td><td>City</td><td>城市名称</td><td>Shanghai</td></tr><tr><td><code>$geoip2_data_region_name</code></td><td>City</td><td>省份/州名称</td><td>Shanghai</td></tr><tr><td><code>$geoip2_data_region_code</code></td><td>City</td><td>省份/州代码</td><td>SH</td></tr><tr><td><code>$geoip2_data_latitude</code></td><td>City</td><td>纬度</td><td>31.0456</td></tr><tr><td><code>$geoip2_data_longitude</code></td><td>City</td><td>经度</td><td>121.3997</td></tr><tr><td><code>$geoip2_data_time_zone</code></td><td>City</td><td>时区</td><td>Asia/Shanghai</td></tr></tbody></table><h3 id="变量在日志中使用" tabindex="-1"><a class="header-anchor" href="#变量在日志中使用"><span>变量在日志中使用</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 自定义日志格式，记录地理位置</span></span>
<span class="line"><span style="color:#C678DD;">log_format </span><span style="color:#ABB2BF;">geo_log </span><span style="color:#98C379;">&#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                   &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                   &#39;country=$</span><span style="color:#E06C75;">geoip2_data_country_code</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                   &#39;region=$</span><span style="color:#E06C75;">geoip2_data_region_name</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                   &#39;city=$</span><span style="color:#E06C75;">geoip2_data_city_name</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">access_log </span><span style="color:#ABB2BF;">/var/log/nginx/geo_access.log geo_log;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="变量在响应头中使用" tabindex="-1"><a class="header-anchor" href="#变量在响应头中使用"><span>变量在响应头中使用</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 将地理位置信息传递给后端</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-GeoIP-Country $</span><span style="color:#E06C75;">geoip2_data_country_code</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-GeoIP-Region $</span><span style="color:#E06C75;">geoip2_data_region_name</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-GeoIP-City $</span><span style="color:#E06C75;">geoip2_data_city_name</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-GeoIP-Country $</span><span style="color:#E06C75;">geoip2_data_country_code</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-GeoIP-Region $</span><span style="color:#E06C75;">geoip2_data_region_name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-GeoIP-City $</span><span style="color:#E06C75;">geoip2_data_city_name</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-GeoIP-Timezone $</span><span style="color:#E06C75;">geoip2_data_time_zone</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="变量在条件判断中使用" tabindex="-1"><a class="header-anchor" href="#变量在条件判断中使用"><span>变量在条件判断中使用</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 根据时区设置语言</span></span>
<span class="line"><span style="color:#C678DD;">    map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">geoip2_data_time_zone</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">site_lang</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#98C379;">        &quot;Asia/Shanghai&quot;</span><span style="color:#ABB2BF;">    zh-CN;</span></span>
<span class="line"><span style="color:#98C379;">        &quot;Asia/Tokyo&quot;</span><span style="color:#ABB2BF;">       ja-JP;</span></span>
<span class="line"><span style="color:#98C379;">        &quot;America/New_York&quot;</span><span style="color:#ABB2BF;"> en-US;</span></span>
<span class="line"><span style="color:#98C379;">        &quot;Europe/London&quot;</span><span style="color:#ABB2BF;">    en-GB;</span></span>
<span class="line"><span style="color:#D19A66;">        default</span><span style="color:#ABB2BF;">            en-US;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 根据国家设置货币</span></span>
<span class="line"><span style="color:#C678DD;">    map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">geoip2_data_country_code</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">currency</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">        CN  CNY;</span></span>
<span class="line"><span style="color:#ABB2BF;">        US  USD;</span></span>
<span class="line"><span style="color:#ABB2BF;">        JP  JPY;</span></span>
<span class="line"><span style="color:#ABB2BF;">        GB  GBP;</span></span>
<span class="line"><span style="color:#ABB2BF;">        EU  EUR;</span></span>
<span class="line"><span style="color:#D19A66;">        default</span><span style="color:#ABB2BF;"> USD;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Accept-Language $</span><span style="color:#E06C75;">site_lang</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Currency $</span><span style="color:#E06C75;">currency</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="ip-黑白名单管理" tabindex="-1"><a class="header-anchor" href="#ip-黑白名单管理"><span>IP 黑白名单管理</span></a></h2><h3 id="静态黑白名单" tabindex="-1"><a class="header-anchor" href="#静态黑白名单"><span>静态黑白名单</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 白名单文件：/etc/nginx/whitelist.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 允许的 IP 列表</span></span>
<span class="line"><span style="color:#C678DD;">allow </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">allow </span><span style="color:#ABB2BF;">172.16.0.0/12;</span></span>
<span class="line"><span style="color:#C678DD;">allow </span><span style="color:#ABB2BF;">192.168.0.0/16;</span></span>
<span class="line"><span style="color:#C678DD;">allow </span><span style="color:#D19A66;">203.0.113.50</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">allow </span><span style="color:#ABB2BF;">198.51.100.0/24;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 黑名单文件：/etc/nginx/blacklist.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 禁止的 IP 列表</span></span>
<span class="line"><span style="color:#C678DD;">deny </span><span style="color:#D19A66;">198.51.100.100</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">deny </span><span style="color:#ABB2BF;">203.0.113.0/24;</span></span>
<span class="line"><span style="color:#C678DD;">deny </span><span style="color:#D19A66;">192.0.2.1</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 在 Nginx 中引用</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 白名单模式</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/whitelist.conf;</span></span>
<span class="line"><span style="color:#C678DD;">    deny </span><span style="color:#D19A66;">all</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 或者黑名单模式</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # include /etc/nginx/blacklist.conf;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # allow all;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用-geo-模块管理黑白名单" tabindex="-1"><a class="header-anchor" href="#使用-geo-模块管理黑白名单"><span>使用 geo 模块管理黑白名单</span></a></h3><div class="hint-container important"><p class="hint-container-title">map 与 geo 的区别</p><p><code>map</code> 不支持 CIDR 匹配，仅支持精确匹配和正则匹配。如需基于 IP 地址段（CIDR）做黑白名单，应使用 <code>geo</code> 指令。<code>geo</code> 专门为 IP 地址设计，原生支持 CIDR 表示法。</p></div><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 白名单 geo（geo 支持 CIDR）</span></span>
<span class="line"><span style="color:#C678DD;">geo </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">is_whitelisted</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">           0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    10.0.0.0/</span><span style="color:#C678DD;">8</span><span style="color:#D19A66;">        1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    172.16.0.0/</span><span style="color:#C678DD;">12</span><span style="color:#D19A66;">     1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    192.168.0.0/</span><span style="color:#C678DD;">16</span><span style="color:#D19A66;">    1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    203.0.113.</span><span style="color:#C678DD;">50</span><span style="color:#D19A66;">      1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 黑名单 geo</span></span>
<span class="line"><span style="color:#C678DD;">geo </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">is_blacklisted</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">           0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    198.51.100.</span><span style="color:#C678DD;">100</span><span style="color:#D19A66;">    1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    203.0.113.0/</span><span style="color:#C678DD;">24</span><span style="color:#D19A66;">    1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    192.0.2.</span><span style="color:#C678DD;">1</span><span style="color:#D19A66;">         1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 白名单模式</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">is_whitelisted</span><span style="color:#ABB2BF;"> = 0) {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 403</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 黑名单模式</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # if ($is_blacklisted = 1) {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    #     return 403;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用-geo-模块管理" tabindex="-1"><a class="header-anchor" href="#使用-geo-模块管理"><span>使用 geo 模块管理</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_geo_module.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 geo 指令（比 map 更适合 IP 范围匹配）</span></span>
<span class="line"><span style="color:#C678DD;">geo </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">is_allowed</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">        0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    10.0.0.0/</span><span style="color:#C678DD;">8</span><span style="color:#D19A66;">     1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    172.16.0.0/</span><span style="color:#C678DD;">12</span><span style="color:#D19A66;">  1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    192.168.0.0/</span><span style="color:#C678DD;">16</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    203.0.113.</span><span style="color:#C678DD;">50</span><span style="color:#D19A66;">   1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    198.51.100.0/</span><span style="color:#C678DD;">24</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从文件加载</span></span>
<span class="line"><span style="color:#C678DD;">geo </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">is_allowed</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/ip_whitelist.conf;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">is_allowed</span><span style="color:#ABB2BF;"> = 0) {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 403</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="黑白名单管理脚本" tabindex="-1"><a class="header-anchor" href="#黑白名单管理脚本"><span>黑白名单管理脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># manage_ip_list.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">WHITELIST</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/nginx/ip_whitelist.conf&quot;</span></span>
<span class="line"><span style="color:#E06C75;">BLACKLIST</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/nginx/ip_blacklist.conf&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">case</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span><span style="color:#C678DD;"> in</span></span>
<span class="line"><span style="color:#E06C75;">    whitelist-add</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;allow </span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">;&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$WHITELIST</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Added </span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;"> to whitelist&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#E06C75;">    whitelist-remove</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;/allow </span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">;/d&quot;</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$WHITELIST</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Removed </span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;"> from whitelist&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#E06C75;">    blacklist-add</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;deny </span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">;&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$BLACKLIST</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Added </span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;"> to blacklist&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#E06C75;">    blacklist-remove</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;/deny </span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">;/d&quot;</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$BLACKLIST</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Removed </span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;"> from blacklist&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#E06C75;">    list</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;=== Whitelist ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        cat</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$WHITELIST</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;=== Blacklist ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        cat</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$BLACKLIST</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#ABB2BF;">    *)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Usage: </span><span style="color:#E06C75;font-style:italic;">$0</span><span style="color:#98C379;"> {whitelist-add|whitelist-remove|blacklist-add|blacklist-remove|list} IP&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ;;</span></span>
<span class="line"><span style="color:#C678DD;">esac</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="动态-ip-列表-redis-lua-方案" tabindex="-1"><a class="header-anchor" href="#动态-ip-列表-redis-lua-方案"><span>动态 IP 列表：Redis/Lua 方案</span></a></h2><h3 id="为什么需要动态-ip-列表" tabindex="-1"><a class="header-anchor" href="#为什么需要动态-ip-列表"><span>为什么需要动态 IP 列表</span></a></h3><p>静态黑白名单需要修改配置文件并重载 Nginx，不适合频繁更新的场景：</p><ul><li>实时封禁攻击 IP</li><li>临时允许特定 IP 访问</li><li>根据业务规则动态调整名单</li></ul><h3 id="redis-lua-动态黑名单" tabindex="-1"><a class="header-anchor" href="#redis-lua-动态黑名单"><span>Redis + Lua 动态黑名单</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_lua_module.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">lua_shared_dict</span><span style="color:#ABB2BF;"> ip_blacklist </span><span style="color:#D19A66;">1m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 定时从 Redis 同步黑名单</span></span>
<span class="line"><span style="color:#C678DD;">init_worker_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> ngx_timer</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.timer</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> dict</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.ip_blacklist</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#C678DD;"> function</span><span style="color:#61AFEF;"> sync_blacklist</span><span style="color:#ABB2BF;">(</span><span style="color:#ABB2BF;font-style:italic;">premature</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#E06C75;"> premature</span><span style="color:#C678DD;"> then</span><span style="color:#C678DD;"> return</span><span style="color:#C678DD;"> end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> redis</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">require</span><span style="color:#98C379;"> &quot;resty.redis&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> red</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">redis</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">new</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> ok</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">err</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">connect</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;127.0.0.1&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">6379</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#E06C75;"> ok</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 获取所有黑名单 IP</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> ips</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">err</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">smembers</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;ip_blacklist&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#E06C75;"> ips</span><span style="color:#C678DD;"> then</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                -- 清空本地缓存</span></span>
<span class="line"><span style="color:#E5C07B;">                dict</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">flush_all</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                -- 写入新数据</span></span>
<span class="line"><span style="color:#C678DD;">                for</span><span style="color:#E06C75;"> _</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">ip</span><span style="color:#C678DD;"> in</span><span style="color:#56B6C2;"> ipairs</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ips</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#E5C07B;">                    dict</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">set</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ip</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">3600</span><span style="color:#ABB2BF;">)  </span><span style="color:#7F848E;font-style:italic;">-- 缓存 1 小时</span></span>
<span class="line"><span style="color:#C678DD;">                end</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">            red</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">close</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#C678DD;">        end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        -- 每 10 秒同步一次</span></span>
<span class="line"><span style="color:#E06C75;">        ngx_timer</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">at</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">10</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">sync_blacklist</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">    ngx_timer</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">at</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">sync_blacklist</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查黑名单</span></span>
<span class="line"><span style="color:#C678DD;">    access_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> dict</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.ip_blacklist</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> ip</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.var.remote_addr</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#E5C07B;"> dict</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">ip</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.status = </span><span style="color:#D19A66;">403</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;Access Denied&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">            ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">exit</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">403</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        end</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="redis-黑名单管理-api" tabindex="-1"><a class="header-anchor" href="#redis-黑名单管理-api"><span>Redis 黑名单管理 API</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 添加 IP 到黑名单</span></span>
<span class="line"><span style="color:#61AFEF;">redis-cli</span><span style="color:#98C379;"> sadd</span><span style="color:#98C379;"> ip_blacklist</span><span style="color:#98C379;"> &quot;198.51.100.100&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 批量添加</span></span>
<span class="line"><span style="color:#61AFEF;">redis-cli</span><span style="color:#98C379;"> sadd</span><span style="color:#98C379;"> ip_blacklist</span><span style="color:#98C379;"> &quot;198.51.100.100&quot;</span><span style="color:#98C379;"> &quot;203.0.113.50&quot;</span><span style="color:#98C379;"> &quot;192.0.2.1&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 移除 IP</span></span>
<span class="line"><span style="color:#61AFEF;">redis-cli</span><span style="color:#98C379;"> srem</span><span style="color:#98C379;"> ip_blacklist</span><span style="color:#98C379;"> &quot;198.51.100.100&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看黑名单</span></span>
<span class="line"><span style="color:#61AFEF;">redis-cli</span><span style="color:#98C379;"> smembers</span><span style="color:#98C379;"> ip_blacklist</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查 IP 是否在黑名单</span></span>
<span class="line"><span style="color:#61AFEF;">redis-cli</span><span style="color:#98C379;"> sismember</span><span style="color:#98C379;"> ip_blacklist</span><span style="color:#98C379;"> &quot;198.51.100.100&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 带过期时间的黑名单（使用 sorted set + 时间戳）</span></span>
<span class="line"><span style="color:#61AFEF;">redis-cli</span><span style="color:#98C379;"> zadd</span><span style="color:#98C379;"> ip_blacklist_ttl</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">date</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> &#39;+1 hour&#39;</span><span style="color:#98C379;"> +%s</span><span style="color:#ABB2BF;">) </span><span style="color:#98C379;">&quot;198.51.100.100&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="cdn-与真实-ip-获取" tabindex="-1"><a class="header-anchor" href="#cdn-与真实-ip-获取"><span>CDN 与真实 IP 获取</span></a></h2><h3 id="cdn-场景下的-ip-问题" tabindex="-1"><a class="header-anchor" href="#cdn-场景下的-ip-问题"><span>CDN 场景下的 IP 问题</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>客户端 → CDN → Nginx → 后端</span></span>
<span class="line"><span></span></span>
<span class="line"><span>问题：</span></span>
<span class="line"><span>- Nginx 看到 IP 是 CDN 节点 IP</span></span>
<span class="line"><span>- 所有用户共享 CDN 节点 IP 的限流额度</span></span>
<span class="line"><span>- GeoIP 查询结果为 CDN 节点位置</span></span>
<span class="line"><span>- allow/deny 规则基于 CDN 节点 IP，无效</span></span>
<span class="line"><span></span></span>
<span class="line"><span>解决：</span></span>
<span class="line"><span>- 使用 realip 模块还原真实客户端 IP</span></span>
<span class="line"><span>- 从 X-Forwarded-For / CF-Connecting-IP 获取</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="set-real-ip-from-配置" tabindex="-1"><a class="header-anchor" href="#set-real-ip-from-配置"><span>set_real_ip_from 配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 参考：https://nginx.org/en/docs/http/ngx_http_realip_module.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Cloudflare CDN 可信代理 IP</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">103.21.244.0/22;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">103.22.200.0/22;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">103.31.4.0/22;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">104.16.0.0/13;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">104.24.0.0/14;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">108.162.192.0/18;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">131.0.72.0/22;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">141.101.64.0/18;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">162.158.0.0/15;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">172.64.0.0/13;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">173.245.48.0/20;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">188.114.96.0/20;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">190.93.240.0/20;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">197.234.240.0/22;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">198.41.128.0/17;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 自建代理</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">10.0.0.0/8;</span></span>
<span class="line"><span style="color:#C678DD;">set_real_ip_from </span><span style="color:#ABB2BF;">172.16.0.0/12;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用哪个头部获取真实 IP</span></span>
<span class="line"><span style="color:#C678DD;">real_ip_header </span><span style="color:#ABB2BF;">CF-Connecting-IP;     </span><span style="color:#7F848E;font-style:italic;"># Cloudflare</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># real_ip_header X-Forwarded-For;    # 通用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># real_ip_header X-Real-IP;          # Nginx 代理</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 递归搜索真实 IP</span></span>
<span class="line"><span style="color:#C678DD;">real_ip_recursive </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="x-forwarded-for-详解" tabindex="-1"><a class="header-anchor" href="#x-forwarded-for-详解"><span>X-Forwarded-For 详解</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>X-Forwarded-For 头部格式：</span></span>
<span class="line"><span>X-Forwarded-For: client, proxy1, proxy2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例：</span></span>
<span class="line"><span>X-Forwarded-For: 203.0.113.50, 70.41.3.18, 150.172.238.178</span></span>
<span class="line"><span></span></span>
<span class="line"><span>含义：</span></span>
<span class="line"><span>- 203.0.113.50 = 原始客户端 IP</span></span>
<span class="line"><span>- 70.41.3.18 = 第一层代理</span></span>
<span class="line"><span>- 150.172.238.178 = 第二层代理（最接近 Nginx）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>real_ip_recursive on 的行为：</span></span>
<span class="line"><span>- 从右向左查找第一个非可信 IP</span></span>
<span class="line"><span>- 150.172.238.178 是可信代理 → 跳过</span></span>
<span class="line"><span>- 70.41.3.18 是可信代理 → 跳过</span></span>
<span class="line"><span>- 203.0.113.50 不是可信代理 → 这就是真实 IP</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">X-Forwarded-For 安全风险</p><p>X-Forwarded-For 可以被客户端伪造。如果未正确配置 <code>set_real_ip_from</code>，攻击者可以伪造 IP 绕过 IP 限制。必须确保只信任已知的代理服务器 IP。</p></div><h3 id="不同-cdn-的真实-ip-头部" tabindex="-1"><a class="header-anchor" href="#不同-cdn-的真实-ip-头部"><span>不同 CDN 的真实 IP 头部</span></a></h3><table><thead><tr><th>CDN</th><th>头部名称</th><th>说明</th></tr></thead><tbody><tr><td>Cloudflare</td><td><code>CF-Connecting-IP</code></td><td>Cloudflare 自动设置，不可伪造</td></tr><tr><td>Cloudflare</td><td><code>X-Forwarded-For</code></td><td>通用格式</td></tr><tr><td>AWS CloudFront</td><td><code>X-Forwarded-For</code></td><td>标准格式</td></tr><tr><td>Akamai</td><td><code>True-Client-IP</code></td><td>Akamai 专用头部</td></tr><tr><td>阿里云 CDN</td><td><code>X-Forwarded-For</code></td><td>标准格式</td></tr><tr><td>腾讯云 CDN</td><td><code>X-Forwarded-For</code></td><td>标准格式</td></tr></tbody></table><hr><h2 id="反爬虫与-ip-封禁策略" tabindex="-1"><a class="header-anchor" href="#反爬虫与-ip-封禁策略"><span>反爬虫与 IP 封禁策略</span></a></h2><h3 id="基于-user-agent-的反爬虫" tabindex="-1"><a class="header-anchor" href="#基于-user-agent-的反爬虫"><span>基于 User-Agent 的反爬虫</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 常见爬虫 User-Agent</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_user_agent</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">is_bot</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">           0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 搜索引擎（允许）</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*Googlebot&quot;</span><span style="color:#D19A66;">     0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*Bingbot&quot;</span><span style="color:#D19A66;">       0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*Baiduspider&quot;</span><span style="color:#D19A66;">   0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 恶意爬虫（禁止）</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*scrapy&quot;</span><span style="color:#D19A66;">        1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*curl&quot;</span><span style="color:#D19A66;">          1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*wget&quot;</span><span style="color:#D19A66;">          1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*python-requests&quot;</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*httpclient&quot;</span><span style="color:#D19A66;">    1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*Go-http-client&quot;</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*java/&quot;</span><span style="color:#D19A66;">         1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*masscan&quot;</span><span style="color:#D19A66;">       1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*nmap&quot;</span><span style="color:#D19A66;">          1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*nikto&quot;</span><span style="color:#D19A66;">         1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 空或异常 User-Agent</span></span>
<span class="line"><span style="color:#98C379;">    &quot;&quot;</span><span style="color:#D19A66;">                1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*^$&quot;</span><span style="color:#D19A66;">            1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">is_bot</span><span style="color:#ABB2BF;"> = 1) {</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 403</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="反爬虫综合策略" tabindex="-1"><a class="header-anchor" href="#反爬虫综合策略"><span>反爬虫综合策略</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 综合反爬虫策略</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 限流（限制爬虫速度）</span></span>
<span class="line"><span style="color:#C678DD;">limit_req_zone </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">binary_remote_addr</span><span style="color:#ABB2BF;"> zone=bot_limit:10m rate=5r/s;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 爬虫检测 map</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_user_agent</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">is_bot</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*Googlebot&quot;</span><span style="color:#D19A66;">     0</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 允许 Google</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*Bingbot&quot;</span><span style="color:#D19A66;">       0</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 允许 Bing</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*Baiduspider&quot;</span><span style="color:#D19A66;">   0</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 允许百度</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*scrapy&quot;</span><span style="color:#D19A66;">        1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*curl&quot;</span><span style="color:#D19A66;">          1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*wget&quot;</span><span style="color:#D19A66;">          1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*python&quot;</span><span style="color:#D19A66;">        1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;~*Go-http&quot;</span><span style="color:#D19A66;">       1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;&quot;</span><span style="color:#D19A66;">                1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 异常行为检测</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_referer</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">has_referer</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">       1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;&quot;</span><span style="color:#D19A66;">            0</span><span style="color:#ABB2BF;">;  </span><span style="color:#7F848E;font-style:italic;"># 无 referer</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 对疑似爬虫严格限流</span></span>
<span class="line"><span style="color:#C678DD;">    set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">bot_rate</span><span style="color:#98C379;"> &quot;10r/s&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">is_bot</span><span style="color:#ABB2BF;"> = 1) {</span></span>
<span class="line"><span style="color:#C678DD;">        set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">bot_rate</span><span style="color:#98C379;"> &quot;1r/m&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    limit_req </span><span style="color:#ABB2BF;">zone=bot_limit burst=5 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 验证搜索引擎爬虫（反向 DNS 验证）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 注意：Nginx 原生不支持反向 DNS 验证</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 需要使用 Lua 或外部脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 无 referer + 疑似爬虫 → 挑战</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">is_bot</span><span style="color:#ABB2BF;"> = 1) {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 403</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 敏感路径更严格</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=bot_limit burst=2 nodelay;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">has_referer</span><span style="color:#ABB2BF;"> = 0) {</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 403</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="fail2ban-nginx-自动封禁" tabindex="-1"><a class="header-anchor" href="#fail2ban-nginx-自动封禁"><span>fail2ban + Nginx 自动封禁</span></a></h3><div class="language-ini line-numbers-mode" data-highlighter="shiki" data-ext="ini" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-ini"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/fail2ban/filter.d/nginx-bot.conf</span></span>
<span class="line"><span style="color:#61AFEF;">[Definition]</span></span>
<span class="line"><span style="color:#C678DD;">failregex</span><span style="color:#ABB2BF;"> =</span><span style="color:#98C379;"> ^&lt;HOST&gt; .* </span><span style="color:#98C379;">&quot;(GET|POST|HEAD).*&quot;</span><span style="color:#98C379;"> (403|444) .*$</span></span>
<span class="line"><span style="color:#98C379;">            ^&lt;HOST&gt; .* </span><span style="color:#98C379;">&quot;(GET|POST|HEAD).*HTTP/1.1&quot;</span><span style="color:#98C379;"> 429 .*$</span></span>
<span class="line"><span style="color:#C678DD;">ignoreregex</span><span style="color:#ABB2BF;"> =</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-ini line-numbers-mode" data-highlighter="shiki" data-ext="ini" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-ini"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/fail2ban/jail.d/nginx-bot.conf</span></span>
<span class="line"><span style="color:#61AFEF;">[nginx-bot]</span></span>
<span class="line"><span style="color:#C678DD;">enabled</span><span style="color:#ABB2BF;"> =</span><span style="color:#98C379;"> true</span></span>
<span class="line"><span style="color:#C678DD;">filter</span><span style="color:#ABB2BF;"> =</span><span style="color:#98C379;"> nginx-bot</span></span>
<span class="line"><span style="color:#C678DD;">action</span><span style="color:#ABB2BF;"> =</span><span style="color:#98C379;"> iptables-multiport[</span><span style="color:#C678DD;">name</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">nginx-bot, </span><span style="color:#C678DD;">port</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">&quot;80,443&quot;</span><span style="color:#98C379;">, </span><span style="color:#C678DD;">protocol</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">tcp]</span></span>
<span class="line"><span style="color:#C678DD;">logpath</span><span style="color:#ABB2BF;"> =</span><span style="color:#98C379;"> /var/log/nginx/access.log</span></span>
<span class="line"><span style="color:#C678DD;">findtime</span><span style="color:#ABB2BF;"> =</span><span style="color:#98C379;"> 60</span></span>
<span class="line"><span style="color:#C678DD;">bantime</span><span style="color:#ABB2BF;"> =</span><span style="color:#98C379;"> 3600</span></span>
<span class="line"><span style="color:#C678DD;">maxretry</span><span style="color:#ABB2BF;"> =</span><span style="color:#98C379;"> 10</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 启动 fail2ban</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#98C379;"> fail2ban</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> fail2ban</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看封禁状态</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> fail2ban-client</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> nginx-bot</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 手动解封</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> fail2ban-client</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> nginx-bot</span><span style="color:#98C379;"> unbanip</span><span style="color:#D19A66;"> 198.51.100.100</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 手动封禁</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> fail2ban-client</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> nginx-bot</span><span style="color:#98C379;"> banip</span><span style="color:#D19A66;"> 198.51.100.100</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="验证搜索引擎爬虫" tabindex="-1"><a class="header-anchor" href="#验证搜索引擎爬虫"><span>验证搜索引擎爬虫</span></a></h3><p>真正的搜索引擎爬虫可以通过反向 DNS 验证：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Google 爬虫验证</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 获取爬虫 IP</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#D19A66;"> -x</span><span style="color:#D19A66;"> 66.249.66.1</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 应返回 *.googlebot.com 或 *.google.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 验证正向 DNS</span></span>
<span class="line"><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> crawl-66-249-66-1.googlebot.com</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 应返回 66.249.66.1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 脚本验证</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># verify_search_bot.sh</span></span>
<span class="line"><span style="color:#E06C75;">IP</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;font-style:italic;">$1</span></span>
<span class="line"><span style="color:#E06C75;">HOSTNAME</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">dig</span><span style="color:#D19A66;"> -x</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$IP</span><span style="color:#98C379;">&quot;</span><span style="color:#98C379;"> +short</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$HOSTNAME</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#ABB2BF;"> *</span><span style="color:#98C379;">&quot;googlebot.com&quot;</span><span style="color:#ABB2BF;">* ]] || [[ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$HOSTNAME</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#ABB2BF;"> *</span><span style="color:#98C379;">&quot;google.com&quot;</span><span style="color:#ABB2BF;">* ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">    VERIFY_IP</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">dig</span><span style="color:#98C379;"> +short</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$HOSTNAME</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$VERIFY_IP</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$IP</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Verified Google bot: </span><span style="color:#E06C75;">$IP</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;FAKE Google bot: </span><span style="color:#E06C75;">$IP</span><span style="color:#98C379;"> (forward DNS mismatch)&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Not a Google bot: </span><span style="color:#E06C75;">$IP</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="延伸阅读" tabindex="-1"><a class="header-anchor" href="#延伸阅读"><span>延伸阅读</span></a></h2><ul><li><a href="https://nginx.org/en/docs/http/ngx_http_access_module.html" target="_blank" rel="noopener noreferrer">Nginx Access Module 官方文档</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_geo_module.html" target="_blank" rel="noopener noreferrer">Nginx Geo Module 官方文档</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_realip_module.html" target="_blank" rel="noopener noreferrer">Nginx Real IP Module 官方文档</a></li><li><a href="https://github.com/leev/ngx_http_geoip2_module" target="_blank" rel="noopener noreferrer">GeoIP2 Module for Nginx</a></li><li><a href="https://dev.maxmind.com/geoip/geolite2-free-geolocation-data" target="_blank" rel="noopener noreferrer">MaxMind GeoLite2 数据库</a></li><li><a href="https://www.fail2ban.org/wiki/index.php/Main_Page" target="_blank" rel="noopener noreferrer">fail2ban 官方文档</a></li></ul>`,67)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};