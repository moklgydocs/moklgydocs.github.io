import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-CtmVft7R.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/06_%E9%99%90%E6%B5%81%E4%B8%8E%E8%AE%BF%E9%97%AE%E6%8E%A7%E5%88%B6/05_%E7%81%B0%E5%BA%A6%E5%8F%91%E5%B8%83%E4%B8%8EAB%E6%B5%8B%E8%AF%95.html","title":"灰度发布与 AB 测试","lang":"zh-CN","frontmatter":{"title":"灰度发布与 AB 测试","icon":"fa6-solid:flask-vial","order":5,"category":["Linux","Nginx"],"tag":["灰度发布","金丝雀发布","AB测试","split_clients","蓝绿部署","流量染色"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":22.63,"words":6789},"filePathRelative":"Linux/07_Nginx/06_限流与访问控制/05_灰度发布与AB测试.md"}`),s={name:`05_灰度发布与AB测试.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="灰度发布与-ab-测试" tabindex="-1"><a class="header-anchor" href="#灰度发布与-ab-测试"><span>灰度发布与 AB 测试</span></a></h1><p>灰度发布（又称金丝雀发布）和 AB 测试是现代软件交付中降低发布风险、验证功能效果的核心手段。Nginx 作为流量网关，能够基于请求特征将流量按比例路由到不同版本的后端服务，实现从 1% 到 100% 的渐进式发布。本文系统讲解 Nginx 灰度发布的完整方案，从基础的比例分流到全链路灰度，再到生产级灰度系统搭建。</p><hr><h2 id="_1-灰度发布概念与策略" tabindex="-1"><a class="header-anchor" href="#_1-灰度发布概念与策略"><span>1. 灰度发布概念与策略</span></a></h2><h3 id="_1-1-发布策略对比" tabindex="-1"><a class="header-anchor" href="#_1-1-发布策略对比"><span>1.1 发布策略对比</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>常见发布策略：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 全量发布（Big Bang / Rolling Update）</span></span>
<span class="line"><span>   ┌─────────┐                    ┌─────────┐</span></span>
<span class="line"><span>   │ v1 100% │  ─── 一键切换 ───→ │ v2 100% │</span></span>
<span class="line"><span>   └─────────┘                    └─────────┘</span></span>
<span class="line"><span>   风险：高（无法逐步验证，回滚慢）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 蓝绿部署（Blue-Green Deployment）</span></span>
<span class="line"><span>   ┌─────────┐                    ┌─────────┐</span></span>
<span class="line"><span>   │ Blue v1 │  ─── 切换流量 ───→ │ Green v2│</span></span>
<span class="line"><span>   │  100%   │                    │  100%   │</span></span>
<span class="line"><span>   └─────────┘                    └─────────┘</span></span>
<span class="line"><span>   风险：中（瞬间切换，但可快速回切）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 金丝雀发布（Canary Release）</span></span>
<span class="line"><span>   ┌─────────┐      ┌─────────┐</span></span>
<span class="line"><span>   │ v1 95%  │      │ v2 5%   │ ← 先小流量验证</span></span>
<span class="line"><span>   └─────────┘      └─────────┘</span></span>
<span class="line"><span>        ↓ 逐步放量</span></span>
<span class="line"><span>   ┌─────────┐      ┌─────────┐</span></span>
<span class="line"><span>   │ v1 50%  │      │ v2 50%  │ ← 扩大验证范围</span></span>
<span class="line"><span>   └─────────┘      └─────────┘</span></span>
<span class="line"><span>        ↓ 继续放量</span></span>
<span class="line"><span>   ┌─────────┐      ┌─────────┐</span></span>
<span class="line"><span>   │ v1 0%   │      │ v2 100% │ ← 全量发布</span></span>
<span class="line"><span>   └─────────┘      └─────────┘</span></span>
<span class="line"><span>   风险：低（渐进式，可随时回滚）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 灰度发布（Gray Release / 渐进式发布）</span></span>
<span class="line"><span>   与金丝雀发布类似，但更强调按维度分流：</span></span>
<span class="line"><span>   · 按用户维度（VIP 用户先体验）</span></span>
<span class="line"><span>   · 按地域维度（特定城市先发布）</span></span>
<span class="line"><span>   · 按设备维度（iOS 先于 Android）</span></span>
<span class="line"><span>   · 按流量百分比（1% → 10% → 50% → 100%）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-灰度发布-vs-ab-测试" tabindex="-1"><a class="header-anchor" href="#_1-2-灰度发布-vs-ab-测试"><span>1.2 灰度发布 vs AB 测试</span></a></h3>`,7),i(d,{code:`eJyFUttu2kAQfc9XrOhzitKUl6qKBHxC+2ZVlQN2g+QAMo6qSFEFoam5hYvEnSQUhRRICwYRCNgh+RnveP3UX+hiiOJWlTIPq9XumTkz5wwvhD779lhRQu89G4hG5GD3k8iG95CXDbLiIeMwYkOs/nCackGfnZuNKM4V8Czu+GChl+EPiJxPCoSCjyWW4d1ijMYAvsu/7+pm7VRfZFd55mXWrPWekr2vGAc+GcO4S4HGWDO0ptEd40Edop23u6JzxyzWiKIYWdmJtSl5aDrJ5CuoeRu/d5uBytSs3NAKkIkZWh9KQzzM0ccvy1vbTveagUnMlHMWNglKUb9Pm9E89K8g2cPtjg3qop19Gxv9MsXqqopvr5xEvsapLk60ody3ujO0DuVbjYZCIsKNC9Dq6+a4oH/jb03dHsbh9iCYpIlSek5Ct13C6wxRYjjVJPEFlBJwcfaU7LZLqM/qONWCjEzzrA7J4hfOlJf6GcdzLGvWrVTD/aqN3/1fCds9S79C1wa06Ycb6tInS0I8n5JWhjzk6WlD2yWkzpJBC6r3pFCh5sJllA61sjiahHQPGjf6XRXKc2gl/hVwtYto8+XmDjrCJyNd/YnVEh4dw5mKE9Mj9I6uMOdnHJGwEJA++oQAF5QiVvF9NoxwrkpbJreKURxZjwfhiCRy7D6C87gpn67pqDPPMaz9lA4Fjq444gOC8OYFt8W7eM7243784bc5F+/a+APb+aUP`}),o[1]||=n(`<table><thead><tr><th>维度</th><th>灰度发布</th><th>AB 测试</th></tr></thead><tbody><tr><td>目标</td><td>降低发布风险</td><td>验证功能效果</td></tr><tr><td>关注指标</td><td>错误率、延迟、资源</td><td>转化率、点击率、留存</td></tr><tr><td>持续时间</td><td>数小时至数天</td><td>数天至数周</td></tr><tr><td>流量策略</td><td>渐进式扩大</td><td>固定比例并行</td></tr><tr><td>决策方式</td><td>人工/自动</td><td>统计显著性检验</td></tr><tr><td>回滚</td><td>随时</td><td>实验结束后切换</td></tr><tr><td>共享机制</td><td>split_clients / map 变量路由 / upstream 权重</td><td></td></tr></tbody></table><hr><h2 id="_2-split-clients-比例分流" tabindex="-1"><a class="header-anchor" href="#_2-split-clients-比例分流"><span>2. split_clients 比例分流</span></a></h2><h3 id="_2-1-split-clients-基础" tabindex="-1"><a class="header-anchor" href="#_2-1-split-clients-基础"><span>2.1 split_clients 基础</span></a></h3><p><code>split_clients</code> 是 Nginx 内置的比例分流指令，基于请求特征（如 IP、Cookie、URI）计算哈希值，按配置比例将请求分配到不同变量值。</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># split_clients 语法</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># split_clients &quot;\${string}&quot; \${variable}</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     percentage%  value1</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     percentage%  value2</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     *            default_value;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># string:  用于哈希的字符串（决定分组的键）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># variable: 分流结果存入的变量名</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># percentage: 百分比（支持小数）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># *: 剩余流量（百分比对不齐时的兜底）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：percentage 总和应 &lt;= 100%</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 哈希函数：MurmurHash2（分布均匀、确定性）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-基于比例的灰度发布" tabindex="-1"><a class="header-anchor" href="#_2-2-基于比例的灰度发布"><span>2.2 基于比例的灰度发布</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基础灰度：5% 流量到新版本</span></span>
<span class="line"><span style="color:#C678DD;">split_clients </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">backend_version</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    5%    canary;     </span><span style="color:#7F848E;font-style:italic;"># 5% 流量走金丝雀版本</span></span>
<span class="line"><span style="color:#ABB2BF;">    *     stable;     </span><span style="color:#7F848E;font-style:italic;"># 95% 流量走稳定版本</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 定义上游服务</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> stable {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.10:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.11:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> canary {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.20:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 根据 $backend_version 选择上游</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">backend_version</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 添加灰度标识头（方便后端识别）</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-Backend-Version $</span><span style="color:#E06C75;">backend_version</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 传递给后端（用于日志）</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Canary $</span><span style="color:#E06C75;">backend_version</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-基于-cookie-的灰度-用户一致性" tabindex="-1"><a class="header-anchor" href="#_2-3-基于-cookie-的灰度-用户一致性"><span>2.3 基于 Cookie 的灰度（用户一致性）</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基于 Cookie 实现用户固定路由到同一版本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 避免同一用户看到不同版本导致体验不一致</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">cookie_canary</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">backend_version</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">     $</span><span style="color:#E06C75;">split_version</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;canary&quot;</span><span style="color:#ABB2BF;">    canary;       </span><span style="color:#7F848E;font-style:italic;"># Cookie 明确指定金丝雀</span></span>
<span class="line"><span style="color:#98C379;">    &quot;stable&quot;</span><span style="color:#ABB2BF;">    stable;       </span><span style="color:#7F848E;font-style:italic;"># Cookie 明确指定稳定版</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">split_clients </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;">}UA:\${</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">split_version</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    10%    canary;</span></span>
<span class="line"><span style="color:#ABB2BF;">    *      stable;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> stable {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.10:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.11:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> canary {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.20:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">backend_version</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Canary $</span><span style="color:#E06C75;">backend_version</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-灰度比例动态调整" tabindex="-1"><a class="header-anchor" href="#_2-4-灰度比例动态调整"><span>2.4 灰度比例动态调整</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 通过文件引入实现灰度比例热更新</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 不需要修改主配置文件，只需修改灰度比例文件</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/canary-ratio.conf — 灰度比例配置文件</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改此文件后 nginx -s reload 即可生效</span></span>
<span class="line"><span style="color:#C678DD;">split_clients </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">canary_weight</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    10%    canary;     </span><span style="color:#7F848E;font-style:italic;"># 修改此处调整灰度比例</span></span>
<span class="line"><span style="color:#ABB2BF;">    *      stable;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主配置引入</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/canary-ratio.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> stable {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 192.168.1.10:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> canary {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 192.168.1.20:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">canary_weight</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 灰度比例调整脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/canary-adjust.sh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用法: canary-adjust.sh &lt;percentage&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">RATIO</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;font-style:italic;">$1</span></span>
<span class="line"><span style="color:#E06C75;">CONF_FILE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/nginx/canary-ratio.conf&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$RATIO</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =~</span><span style="color:#ABB2BF;"> ^[0-9]+$ ]] || [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$RATIO</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> -lt</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ] || [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$RATIO</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> -gt</span><span style="color:#D19A66;"> 100</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Usage: </span><span style="color:#E06C75;font-style:italic;">$0</span><span style="color:#98C379;"> &lt;0-100&gt;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成新配置</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$CONF_FILE</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#98C379;">split_clients &quot;</span><span style="color:#56B6C2;">\\$</span><span style="color:#98C379;">{remote_addr}&quot; </span><span style="color:#56B6C2;">\\$</span><span style="color:#98C379;">canary_weight {</span></span>
<span class="line"><span style="color:#98C379;">    \${</span><span style="color:#E06C75;">RATIO</span><span style="color:#98C379;">}%    canary;</span></span>
<span class="line"><span style="color:#98C379;">    *            stable;</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证并重载</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Canary ratio updated to \${</span><span style="color:#E06C75;">RATIO</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;ERROR: nginx config test failed&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_3-map-变量路由" tabindex="-1"><a class="header-anchor" href="#_3-map-变量路由"><span>3. map + 变量路由</span></a></h2><h3 id="_3-1-map-指令灰度路由" tabindex="-1"><a class="header-anchor" href="#_3-1-map-指令灰度路由"><span>3.1 map 指令灰度路由</span></a></h3><p><code>map</code> 指令比 <code>split_clients</code> 更灵活，可以根据请求的多个维度组合判断灰度路由。</p>`,17),i(d,{code:`eJx1kVtLAkEYhu/7FcN2LVFQVJRi3uhV4gECkVi32VxctHY3QnYFDUSjpIQOVEbRCemgRZaW2K/Zmc1/0TazG5q4FzvMvM/7znzfx4upTS7OSgoILYwA8wvA9Yg3FPKD73oTv2xFgcPhBJ445BIqvs7ii1sj94w+74x2w/xnRoiHyBRMpRICVBm6zsWkMSfHJlkpPe9iMpQlCoE1S1KkDagBD9lEuoWy3jrvnmWN7SKuPEaHmXhWlE1XUGFjIhyPGNVXVDsd5sHHl3SrAZ9f9fkBLQLtl1Dp0GVVYR4TGFWqxkmHanrryX5ZH6O3Sr2YBryQXYGSytCuoZsGqX3JQb2/xRM/xWiGLc6C3gYMYObbNRB2q0xYhpLDvQqTCslGux/dfOkvOeymuLAYBKh2hYtN46HeF2oTKP+ut480EGAVIaUy+C3XLezh+oH+tUOC5TVRUJY5UTBvku14Alv+csdsCzX0XdDD4Mo9xewJTfybEDHISlqEVgLgBVGcHeWm4RQ306NaA7ZkOM5P8nBAnuiXfwBYmyEm`}),o[2]||=n(`<h3 id="_3-2-多维度灰度路由配置" tabindex="-1"><a class="header-anchor" href="#_3-2-多维度灰度路由配置"><span>3.2 多维度灰度路由配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 多维度灰度路由：Cookie &gt; IP &gt; Header &gt; UA &gt; 比例</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 1. IP 灰度名单 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：map 不支持 CIDR，需要使用 geo</span></span>
<span class="line"><span style="color:#C678DD;">geo </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">ip_canary</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">         0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    10.0.1.</span><span style="color:#C678DD;">100</span><span style="color:#D19A66;">      1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    10.0.1.</span><span style="color:#C678DD;">101</span><span style="color:#D19A66;">      1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    192.168.10.0/</span><span style="color:#C678DD;">24</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    172.16.0.0/</span><span style="color:#C678DD;">16</span><span style="color:#D19A66;">   1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 2. UA 灰度规则 =====</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_user_agent</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">ua_canary</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">         0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*MyApp/3\\.0     1;    # 3.0 版本客户端走金丝雀</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*iOS           </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;     </span><span style="color:#7F848E;font-style:italic;"># iOS 客户端先发</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 3. 比例分流 =====</span></span>
<span class="line"><span style="color:#C678DD;">split_clients </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">ratio_canary</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    5%    </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    *     0;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 4. 综合路由决策 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优先级：Cookie &gt; IP &gt; Header &gt; UA &gt; 比例</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">cookie_canary</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">cookie_decision</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#98C379;">     &quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;true&quot;</span><span style="color:#98C379;">      &quot;canary&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;false&quot;</span><span style="color:#98C379;">     &quot;stable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;1&quot;</span><span style="color:#98C379;">         &quot;canary&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;0&quot;</span><span style="color:#98C379;">         &quot;stable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_x_canary</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">header_decision</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#98C379;">     &quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;true&quot;</span><span style="color:#98C379;">      &quot;canary&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;1&quot;</span><span style="color:#98C379;">         &quot;canary&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 最终决策：组合所有条件</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">cookie_decision</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">ip_canary</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">header_decision</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">ua_canary</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">ratio_canary</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">backend_version</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    default</span><span style="color:#ABB2BF;">                     stable;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Cookie 最高优先级（使用正则匹配，因为 map 不支持 * 通配符）</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^canary\\|                  canary;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^stable\\|                  stable;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # IP 灰度名单</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^\\|1\\|                     canary;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Header 灰度</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^\\|0\\|</span><span style="color:#C678DD;">canary</span><span style="color:#ABB2BF;">               canary;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # UA 灰度</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^\\|0\\|\\|1\\|                canary;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 比例灰度</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~^\\|0\\|\\|0\\|1$              canary;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> stable {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.10:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.11:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> canary {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.20:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">backend_version</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Canary $</span><span style="color:#E06C75;">backend_version</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-基于用户-id-的灰度" tabindex="-1"><a class="header-anchor" href="#_3-3-基于用户-id-的灰度"><span>3.3 基于用户 ID 的灰度</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基于用户 ID 尾号进行灰度</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 适用于需要按用户维度精确控制的场景</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从 Cookie 中提取用户 ID</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">cookie_user_id</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">user_id_suffix</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#98C379;">     &quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*(\\d)$     $1;     # 取最后一位数字</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 根据用户 ID 尾号决定版本</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">user_id_suffix</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">user_version</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">     stable;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;0&quot;</span><span style="color:#ABB2BF;">         canary;     </span><span style="color:#7F848E;font-style:italic;"># 尾号 0 的用户走金丝雀</span></span>
<span class="line"><span style="color:#98C379;">    &quot;1&quot;</span><span style="color:#ABB2BF;">         canary;     </span><span style="color:#7F848E;font-style:italic;"># 尾号 1 的用户走金丝雀</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 10% 的流量（尾号 0-9 中的 2 个 → 20%）</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或者基于用户 ID 的哈希值</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">cookie_user_id</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">hash_version</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">     stable;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 使用哈希取模实现精确比例</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 更精确的方式：使用 Lua 计算</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 见 OpenResty 章节</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-基于地理位置的灰度" tabindex="-1"><a class="header-anchor" href="#_3-4-基于地理位置的灰度"><span>3.4 基于地理位置的灰度</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基于地理位置的灰度发布</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 先在特定城市验证，再逐步扩大范围</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">geoip2</span><span style="color:#ABB2BF;"> /usr/share/GeoIP/GeoLite2-City.mmdb {</span></span>
<span class="line"><span style="color:#ABB2BF;">    $</span><span style="color:#C678DD;">geoip2_city_name</span><span style="color:#ABB2BF;"> city names en;</span></span>
<span class="line"><span style="color:#ABB2BF;">    $</span><span style="color:#C678DD;">geoip2_region_name</span><span style="color:#ABB2BF;"> subdivisions </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;"> names en;</span></span>
<span class="line"><span style="color:#ABB2BF;">    $</span><span style="color:#C678DD;">geoip2_country_code</span><span style="color:#ABB2BF;"> country iso_code;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 城市灰度规则</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">geoip2_city_name</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">geo_version</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">         stable;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Shanghai&quot;</span><span style="color:#ABB2BF;">      canary;     </span><span style="color:#7F848E;font-style:italic;"># 上海先发</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Beijing&quot;</span><span style="color:#ABB2BF;">       canary;     </span><span style="color:#7F848E;font-style:italic;"># 北京先发</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Shenzhen&quot;</span><span style="color:#ABB2BF;">      canary;     </span><span style="color:#7F848E;font-style:italic;"># 深圳先发</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 省份灰度规则</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">geoip2_region_name</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">region_version</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">         stable;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Guangdong&quot;</span><span style="color:#ABB2BF;">     canary;     </span><span style="color:#7F848E;font-style:italic;"># 广东省先发</span></span>
<span class="line"><span style="color:#98C379;">    &quot;Zhejiang&quot;</span><span style="color:#ABB2BF;">      canary;     </span><span style="color:#7F848E;font-style:italic;"># 浙江省先发</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 综合决策</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">geo_version</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">region_version</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">geo_canary</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    default</span><span style="color:#ABB2BF;">         stable;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;canary|*&quot;      canary;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;*|canary&quot;      canary;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> stable {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.10:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> canary {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.20:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">geo_canary</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_4-权重灰度与蓝绿部署" tabindex="-1"><a class="header-anchor" href="#_4-权重灰度与蓝绿部署"><span>4. 权重灰度与蓝绿部署</span></a></h2><h3 id="_4-1-upstream-权重灰度" tabindex="-1"><a class="header-anchor" href="#_4-1-upstream-权重灰度"><span>4.1 upstream 权重灰度</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 方式一：通过 upstream 权重实现灰度</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优点：配置简单，Nginx 原生支持</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 缺点：粒度粗，只能按连接数比例分配</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 稳定版：90% 权重</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.10:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">90</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    server 192.168.1.11:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">90</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 金丝雀版：10% 权重</span></span>
<span class="line"><span style="color:#ABB2BF;">    server 192.168.1.20:8080 </span><span style="color:#E06C75;font-style:italic;">weight</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">10</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">server {</span></span>
<span class="line"><span style="color:#ABB2BF;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://backend;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 通过响应头标识后端版本（方便调试）</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">X-Server-Port $</span><span style="color:#E06C75;">upstream_addr</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>upstream 权重灰度流量分配：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>权重配置：</span></span>
<span class="line"><span>  stable-1:  weight=90  ─┐</span></span>
<span class="line"><span>  stable-2:  weight=90  ─┤─→ 180/200 = 90% 流量</span></span>
<span class="line"><span>                          │</span></span>
<span class="line"><span>  canary-1:  weight=10  ─┘─→  10/200 =  5% 流量</span></span>
<span class="line"><span>  canary-2:  weight=10  ─┘─→  10/200 =  5% 流量</span></span>
<span class="line"><span></span></span>
<span class="line"><span>逐步放量过程：</span></span>
<span class="line"><span>  第 1 步：weight=95 / weight=5    → 5% 灰度</span></span>
<span class="line"><span>  第 2 步：weight=90 / weight=10   → 10% 灰度</span></span>
<span class="line"><span>  第 3 步：weight=80 / weight=20   → 20% 灰度</span></span>
<span class="line"><span>  第 4 步：weight=50 / weight=50   → 50% 灰度</span></span>
<span class="line"><span>  第 5 步：weight=0  / weight=100  → 100% 发布</span></span>
<span class="line"><span></span></span>
<span class="line"><span>注意：权重基于请求数的分配比例，在 round-robin 中按权重比例分配请求</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-蓝绿部署" tabindex="-1"><a class="header-anchor" href="#_4-2-蓝绿部署"><span>4.2 蓝绿部署</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 蓝绿部署：两套完整环境，通过 upstream 切换</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 蓝色环境（当前生产版本）</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> blue {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.10:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.11:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.12:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 绿色环境（新版本）</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> green {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.20:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.21:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.22:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 当前活跃环境（通过变量控制）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改 $active_env 即可切换蓝绿</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">host</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">active_env</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;"> blue;    </span><span style="color:#7F848E;font-style:italic;"># 当前指向蓝色环境</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 切换时改为 green</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">active_env</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Deploy-Env $</span><span style="color:#E06C75;">active_env</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 蓝绿切换脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/blue-green-switch.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">CURRENT</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &#39;default&#39;</span><span style="color:#98C379;"> /etc/nginx/deploy-env.conf</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $2}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">CONF_FILE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/nginx/deploy-env.conf&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$CURRENT</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;blue&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">    NEW_ENV</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;green&quot;</span></span>
<span class="line"><span style="color:#C678DD;">elif</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$CURRENT</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;green&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">    NEW_ENV</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;blue&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Unknown current environment: </span><span style="color:#E06C75;">$CURRENT</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Switching from </span><span style="color:#E06C75;">$CURRENT</span><span style="color:#98C379;"> to </span><span style="color:#E06C75;">$NEW_ENV</span><span style="color:#98C379;">...&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 更新配置</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$CONF_FILE</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#98C379;">map </span><span style="color:#56B6C2;">\\$</span><span style="color:#98C379;">host </span><span style="color:#56B6C2;">\\$</span><span style="color:#98C379;">active_env {</span></span>
<span class="line"><span style="color:#98C379;">    default \${</span><span style="color:#E06C75;">NEW_ENV</span><span style="color:#98C379;">};</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证配置</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">    nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Switched to </span><span style="color:#E06C75;">$NEW_ENV</span><span style="color:#98C379;"> environment successfully&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;ERROR: Config test failed, rolling back&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$CONF_FILE</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#98C379;">map </span><span style="color:#56B6C2;">\\$</span><span style="color:#98C379;">host </span><span style="color:#56B6C2;">\\$</span><span style="color:#98C379;">active_env {</span></span>
<span class="line"><span style="color:#98C379;">    default \${</span><span style="color:#E06C75;">CURRENT</span><span style="color:#98C379;">};</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-蓝绿部署健康检查" tabindex="-1"><a class="header-anchor" href="#_4-3-蓝绿部署健康检查"><span>4.3 蓝绿部署健康检查</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 蓝绿部署必须确保新环境健康后才能切换</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 绿色环境健康检查</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> green {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.20:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.21:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.22:8080;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 主动健康检查</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 需要 nginx-plus 或第三方模块</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用被动健康检查</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> green {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.20:8080 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.21:8080 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.22:8080 </span><span style="color:#E06C75;font-style:italic;">max_fails</span><span style="color:#ABB2BF;">=</span><span style="color:#D19A66;">3</span><span style="color:#ABB2BF;"> fail_timeout=30s;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 切换前手动验证脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/health-check-green.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">GREEN_SERVERS=(&quot;192.168.1.20:8080&quot; &quot;192.168.1.21:8080&quot; &quot;192.168.1.22:8080&quot;)</span></span>
<span class="line"><span style="color:#ABB2BF;">HEALTH_PATH=&quot;/health&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">all_healthy=</span><span style="color:#C678DD;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#ABB2BF;"> server in </span><span style="color:#98C379;">&quot;\${GREEN_SERVERS[@]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">    status</span><span style="color:#ABB2BF;">=$(curl -s -o /dev/null -w &quot;%{http_code}&quot; &quot;http://\${server}\${HEALTH_PATH}&quot;)</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;$</span><span style="color:#E06C75;">status</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> != </span><span style="color:#98C379;">&quot;200&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        echo</span><span style="color:#98C379;"> &quot;UNHEALTHY: $</span><span style="color:#E06C75;">server</span><span style="color:#98C379;"> returned $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        all_healthy=</span><span style="color:#C678DD;">false</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#C678DD;">        echo</span><span style="color:#98C379;"> &quot;HEALTHY: $</span><span style="color:#E06C75;">server</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">all_healthy</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">    echo</span><span style="color:#98C379;"> &quot;All green servers are healthy. Safe to switch.&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    exit</span><span style="color:#ABB2BF;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#C678DD;">    echo</span><span style="color:#98C379;"> &quot;Some green servers are unhealthy. DO NOT switch.&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    exit</span><span style="color:#ABB2BF;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_5-全链路灰度" tabindex="-1"><a class="header-anchor" href="#_5-全链路灰度"><span>5. 全链路灰度</span></a></h2><h3 id="_5-1-全链路灰度问题" tabindex="-1"><a class="header-anchor" href="#_5-1-全链路灰度问题"><span>5.1 全链路灰度问题</span></a></h3>`,19),i(d,{code:`eJxLy8kvT85ILCpR8AniUgCC4tKk9KLEggyFgKL8pJzU3Gill9PXvVw04/2eWc/3Tnzauvl544anu5YpPOpcoPC0dcXLyftebF8PEVOKBZsAAu7h0UoQ5TZJRfp2EHmQwikblWIVdHXtFGogYs+2Nr5s769RCA5zjneMLzOKfjan92nXQgVHhTIjZOMgep6tXfx0xw40PYZIegxjueCaYEZCtL7Y0Px8ygqIJieQJiWoLiegLrAjH83tUXg2ZxWGX2DWYDcH1T6QCKY6Z2T7nPHZl5qXAjEQHg3B+TmlJZn5eUD903Y+W9gBjAd4sEMC4tn8yS86N6EEvhFJoQ9WFKHrXpRYaaVQUlSaCg1aIzzxAQ1VLBEC1IU3RkCmQjQ/2bPgZcMkBYjN0BAF24kUNUaQoJrTqoA9XkC2QZ0yfQGGUdhiGWgUxNVAo1DjDq/LnFFcBoxEAi4DW4/dZSCjsKUHZJehJoaSypxUWIZUSMvMybFSTktLTkkxQpKGJRSofLJFqlmyJRcADIuOZQ==`}),o[3]||=n(`<h3 id="_5-2-流量染色方案" tabindex="-1"><a class="header-anchor" href="#_5-2-流量染色方案"><span>5.2 流量染色方案</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 全链路灰度 - 网关层流量染色</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 灰度规则判断</span></span>
<span class="line"><span style="color:#C678DD;">split_clients </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">is_canary</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    10%    </span><span style="color:#98C379;">&quot;true&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    *      &quot;false&quot;;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 综合灰度判断（Cookie 优先）</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">cookie_gray</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">is_canary</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">gray_flag</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    default</span><span style="color:#98C379;">         &quot;false&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;true|*&quot;        &quot;true&quot;;     </span><span style="color:#7F848E;font-style:italic;"># Cookie 明确指定</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;1|*&quot;           &quot;true&quot;;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;*|true&quot;        &quot;true&quot;;     </span><span style="color:#7F848E;font-style:italic;"># 比例命中</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 根据灰度标记选择上游</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">gray_flag</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">gray_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#98C379;">    &quot;true&quot;</span><span style="color:#ABB2BF;">    canary;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;false&quot;</span><span style="color:#ABB2BF;">   stable;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> stable {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.10:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> canary {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.20:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 根据灰度标记路由</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">gray_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 关键：传递灰度标记给后端</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Gray-Tag $</span><span style="color:#E06C75;">gray_flag</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 后端服务需要读取此头，并在后续调用中继续传递</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 形成全链路灰度</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-后端服务灰度标记传递" tabindex="-1"><a class="header-anchor" href="#_5-3-后端服务灰度标记传递"><span>5.3 后端服务灰度标记传递</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 后端服务（服务 B）的 Nginx 配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 读取上游传递的灰度标记，继续传递并路由</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从请求头读取灰度标记</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_x_gray_tag</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">service_b_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">     stable_b;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;true&quot;</span><span style="color:#ABB2BF;">      canary_b;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> stable_b {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.2.10:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> canary_b {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.2.20:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">8080</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">service_b_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 继续传递灰度标记</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Gray-Tag $</span><span style="color:#E06C75;">http_x_gray_tag</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 传递给服务 C 时也带上</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 后端代码也需要在调用下游时传递此头</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>全链路灰度标记传递流程：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>客户端请求</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ▼</span></span>
<span class="line"><span>┌─────────────┐</span></span>
<span class="line"><span>│   Nginx GW  │ ← 判断灰度规则，设置 X-Gray-Tag</span></span>
<span class="line"><span>│   (网关)     │</span></span>
<span class="line"><span>└──────┬──────┘</span></span>
<span class="line"><span>       │ X-Gray-Tag: true</span></span>
<span class="line"><span>       ▼</span></span>
<span class="line"><span>┌─────────────┐</span></span>
<span class="line"><span>│  服务 A v2  │ ← 读取 X-Gray-Tag，选择 v2 版本</span></span>
<span class="line"><span>│  (灰度)     │</span></span>
<span class="line"><span>└──────┬──────┘</span></span>
<span class="line"><span>       │ X-Gray-Tag: true（代码中继续传递）</span></span>
<span class="line"><span>       ▼</span></span>
<span class="line"><span>┌─────────────┐</span></span>
<span class="line"><span>│  服务 B v2  │ ← 读取 X-Gray-Tag，选择 v2 版本</span></span>
<span class="line"><span>│  (灰度)     │</span></span>
<span class="line"><span>└──────┬──────┘</span></span>
<span class="line"><span>       │ X-Gray-Tag: true</span></span>
<span class="line"><span>       ▼</span></span>
<span class="line"><span>┌─────────────┐</span></span>
<span class="line"><span>│  服务 C v2  │ ← 读取 X-Gray-Tag，选择 v2 版本</span></span>
<span class="line"><span>│  (灰度)     │</span></span>
<span class="line"><span>└─────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>注意事项：</span></span>
<span class="line"><span>1. 每个服务的网关都需要配置灰度路由规则</span></span>
<span class="line"><span>2. 后端代码必须在调用下游服务时传递 X-Gray-Tag</span></span>
<span class="line"><span>3. 数据库/缓存等共享资源需要考虑隔离</span></span>
<span class="line"><span>4. 异步消息队列也需要传递灰度标记</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-全链路灰度数据隔离" tabindex="-1"><a class="header-anchor" href="#_5-4-全链路灰度数据隔离"><span>5.4 全链路灰度数据隔离</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 全链路灰度数据隔离方案</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方案一：不同环境使用不同数据库</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通过 X-Gray-Tag 路由到不同的数据库代理</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 稳定版数据库</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> db_stable {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.10.10:3306;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 灰度版数据库</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> db_canary {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.10.20:3306;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方案二：同一数据库使用不同 Schema/前缀</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通过应用层隔离</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方案三：Redis 使用不同 DB 号</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 稳定版使用 db0，灰度版使用 db1</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在后端应用配置中根据 X-Gray-Tag 选择</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方案四：使用 Nginx Stream 代理不同 Redis</span></span>
<span class="line"><span style="color:#C678DD;">stream</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> redis_stable {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 192.168.10.10:6379;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> redis_canary {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> 192.168.10.20:6379;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 根据来源 IP（灰度服务 IP）路由</span></span>
<span class="line"><span style="color:#C678DD;">    map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">remote_addr</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">redis_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">        default</span><span style="color:#ABB2BF;">         redis_stable;</span></span>
<span class="line"><span style="color:#D19A66;">        192.168.1.20</span><span style="color:#ABB2BF;">    redis_canary;    </span><span style="color:#7F848E;font-style:italic;"># 灰度服务 IP</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">6379</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">redis_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_6-ab-测试实现" tabindex="-1"><a class="header-anchor" href="#_6-ab-测试实现"><span>6. AB 测试实现</span></a></h2><h3 id="_6-1-ab-测试架构" tabindex="-1"><a class="header-anchor" href="#_6-1-ab-测试架构"><span>6.1 AB 测试架构</span></a></h3>`,10),i(d,{code:`eJyNkV9LwlAYh+/7FIcF3UkUQRQlbLPbrqwbkZiy2Whtsi1SMhDRGJaZVGo3LisxupiGFzbEPo07m98iPfvjCoV2MQ7nvM/zvr9zGE44jx9TogzCxBKYfAcSLUbMh3eo9K1OH37moiAQCIL9BMunIugPzGHFKPSiqNzemVbspZK0yJ7SvHyBGVpj/HEzLpTMobYTE1eDUG1ZnRd722rnDeUJu0T8jEKSjF2CZ8AhJbIULx/hEcwo10fDe4Ajk3GrwqoOmwpmDzBfQMwEhCcg7FGq3X8IyJmA9ATkb8H6AgOsPduSDCAFXhYFbmLo6GahbQ7ySDEe1C3tzRsDWbzASBIWqfgJCq9emzl99FWExRZiE6JwltzFnd5eSh81TTyfIv5QpI+axpxPkQ7lhPExoYVM3K51wzlxwIo7orcivVUIiXGe4tISK0Uw+NiFJc1QrmDjztB7RrmL/OZAtbQmrH9blRrMtuFrdnLTbh9JTnO0/0EYluO2l+m1GE1v+ircLs45wzBb8Y2lH+brSjE=`}),o[4]||=n(`<h3 id="_6-2-nginx-ab-测试配置" tabindex="-1"><a class="header-anchor" href="#_6-2-nginx-ab-测试配置"><span>6.2 Nginx AB 测试配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># AB 测试：多个变体并行</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 实验规则：通过外部文件管理</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/ab-experiments.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 实验 1：首页布局测试（3 个变体）</span></span>
<span class="line"><span style="color:#C678DD;">split_clients </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;">}URI:\${</span><span style="color:#E06C75;">request_uri</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">home_experiment</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    33%    variant_a;       </span><span style="color:#7F848E;font-style:italic;"># 变体 A</span></span>
<span class="line"><span style="color:#ABB2BF;">    33%    variant_b;       </span><span style="color:#7F848E;font-style:italic;"># 变体 B</span></span>
<span class="line"><span style="color:#ABB2BF;">    *      control;         </span><span style="color:#7F848E;font-style:italic;"># 对照组</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 实验 2：购买按钮颜色测试</span></span>
<span class="line"><span style="color:#C678DD;">split_clients </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">cookie_user_id</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">button_experiment</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    50%    red_button;</span></span>
<span class="line"><span style="color:#ABB2BF;">    *      green_button;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># upstream 定义</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> variant_a {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.10:8080;   </span><span style="color:#7F848E;font-style:italic;"># 首页布局 A</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> variant_b {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.11:8080;   </span><span style="color:#7F848E;font-style:italic;"># 首页布局 B</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> control {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.12:8080;   </span><span style="color:#7F848E;font-style:italic;"># 对照组</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 首页 AB 测试</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">home_experiment</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Experiment-Group $</span><span style="color:#E06C75;">home_experiment</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 设置 Cookie 确保用户看到一致版本</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Set-Cookie </span><span style="color:#98C379;">&quot;home_exp=$</span><span style="color:#E06C75;">home_experiment</span><span style="color:#98C379;">; Path=/; Max-Age=86400&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 商品页面 AB 测试</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /products/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 根据 Cookie 确定分组（保持一致性）</span></span>
<span class="line"><span style="color:#C678DD;">        set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">product_backend</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">cookie_product_exp</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ($</span><span style="color:#E06C75;">product_backend</span><span style="color:#ABB2BF;"> = </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#C678DD;">            set </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">product_backend</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">home_experiment</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">product_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Experiment-Group $</span><span style="color:#E06C75;">product_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-复杂-ab-测试-基于用户特征分层" tabindex="-1"><a class="header-anchor" href="#_6-3-复杂-ab-测试-基于用户特征分层"><span>6.3 复杂 AB 测试：基于用户特征分层</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 高级 AB 测试：根据用户特征分层抽样</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 确保实验组和对照组的用户特征分布均衡</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 用户分层</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">cookie_vip_level</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">user_segment</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#98C379;">     &quot;normal&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;1&quot;</span><span style="color:#98C379;">         &quot;silver&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;2&quot;</span><span style="color:#98C379;">         &quot;gold&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;3&quot;</span><span style="color:#98C379;">         &quot;platinum&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 在每个分层内按比例分流</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 Lua 实现更精细的控制</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 这里用 map 模拟</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 普通用户：50/50</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">user_segment</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">cookie_user_id</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">ab_group_normal</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    default</span><span style="color:#ABB2BF;">     control;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;~*normal(.+)1$&quot;   experiment;    </span><span style="color:#7F848E;font-style:italic;"># 以 1 结尾 → 实验组</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;~*normal(.+)3$&quot;   experiment;    </span><span style="color:#7F848E;font-style:italic;"># 以 3 结尾 → 实验组</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;~*normal(.+)5$&quot;   experiment;    </span><span style="color:#7F848E;font-style:italic;"># 以 5 结尾 → 实验组</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;~*normal(.+)7$&quot;   experiment;    </span><span style="color:#7F848E;font-style:italic;"># 以 7 结尾 → 实验组</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;~*normal(.+)9$&quot;   experiment;    </span><span style="color:#7F848E;font-style:italic;"># 以 9 结尾 → 实验组</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># VIP 用户：20/80（VIP 用户较少，实验比例也较低）</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">user_segment</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">cookie_user_id</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">ab_group_vip</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    default</span><span style="color:#ABB2BF;">     control;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;~*silver(.+)5$&quot;   experiment;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;~*gold(.+)5$&quot;     experiment;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 合并结果</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">user_segment</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">ab_group_normal</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">ab_group_vip</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">final_ab_group</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    default</span><span style="color:#ABB2BF;">             control;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;normal|experiment|&quot;  experiment;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;|experiment&quot;        experiment;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> control {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.10:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> experiment {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.20:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">final_ab_group</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-AB-Group $</span><span style="color:#E06C75;">final_ab_group</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-User-Segment $</span><span style="color:#E06C75;">user_segment</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_7-回滚机制" tabindex="-1"><a class="header-anchor" href="#_7-回滚机制"><span>7. 回滚机制</span></a></h2><h3 id="_7-1-灰度回滚策略" tabindex="-1"><a class="header-anchor" href="#_7-1-灰度回滚策略"><span>7.1 灰度回滚策略</span></a></h3>`,7),i(d,{code:`eJxtkc1O20AUhfd5ilGqLlEDbRdUFYuqXXSBlKrdWSyMM1atOnHlGKoII7mkjaOkDg1Kq0JKwr+RIBgpG4sEeBlfj/0WjGYwWIFZzjnnu2fuyKr2Tfos6gb69CaD6HmLv6paRSDfz+HiCNbb4FdhbIHbXEBTU3NoXisphqavkG47bLnhLzvcsVdZ8FZhLjMc7IPvm+h9SdKxWMYC7PWgscOpodcJrpoLLJUY0vDMQx6M1xjvI17GumJUVvhF4B/GtkOOm5S6ymOJg+fyOcQ9rxf1Z3Phfwcau4HvwLpHOse0XrGIC4poYCFLTprgDKHbC0dbzJx7imK7HfjbcdfK8rIT7GkUXVVT+LizGXkeadmB3wDHNtGHJUX6ImTh+iS2+in0S6jX4o0+1H5C3ab3j+NnaHUrqp/y6pYbVS/Jn8N40zHRu2VRXWK1I+9HMD6H2pAM/jLj89w9vDaEsy0KZ/Qkw+lk5JLRIHLXwOubd4t/6OMM3t1EeVUslXCBjj3bhfpG6km0VnDZ4j+bTLzbLkPltbIxr+kGLgpw4JDuP9oz7P3mT2ebmrAx4XbipMS0slFRcWqKrKjqqyeyLBUKMykDZyeiuDg7nRITfiLLs9KLzA0yul7D`}),o[5]||=n(`<h3 id="_7-2-灰度回滚配置" tabindex="-1"><a class="header-anchor" href="#_7-2-灰度回滚配置"><span>7.2 灰度回滚配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 灰度回滚：将金丝雀比例降为 0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式一：修改 split_clients 比例</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/canary-ratio.conf</span></span>
<span class="line"><span style="color:#C678DD;">split_clients </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">canary_weight</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    0%     canary;     </span><span style="color:#7F848E;font-style:italic;"># 回滚：0% 灰度</span></span>
<span class="line"><span style="color:#ABB2BF;">    *      stable;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式二：通过变量开关立即切换</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/canary-switch.conf</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">host</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">canary_enabled</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">;     </span><span style="color:#7F848E;font-style:italic;"># 0=关闭灰度，1=开启灰度</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在主配置中使用</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">canary_enabled</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">canary_weight</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">final_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    default</span><span style="color:#ABB2BF;">         stable;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;1|canary&quot;      canary;     </span><span style="color:#7F848E;font-style:italic;"># 开关开启且命中比例</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;0|*&quot;           stable;     </span><span style="color:#7F848E;font-style:italic;"># 开关关闭，全部走稳定版</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;1|stable&quot;      stable;     </span><span style="color:#7F848E;font-style:italic;"># 开关开启但未命中比例</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式三：紧急回滚 - 直接修改 upstream</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.10:8080;    </span><span style="color:#7F848E;font-style:italic;"># 稳定版</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.11:8080;    </span><span style="color:#7F848E;font-style:italic;"># 稳定版</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # server 192.168.1.20:8080;  # 金丝雀版（注释掉 = 回滚）</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-自动化灰度回滚" tabindex="-1"><a class="header-anchor" href="#_7-3-自动化灰度回滚"><span>7.3 自动化灰度回滚</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/canary-rollback.sh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 基于监控指标的自动回滚</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">PROMETHEUS_URL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;http://localhost:9090&quot;</span></span>
<span class="line"><span style="color:#E06C75;">CANARY_CONF</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/nginx/canary-ratio.conf&quot;</span></span>
<span class="line"><span style="color:#E06C75;">CURRENT_RATIO</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -oP</span><span style="color:#98C379;"> &#39;\\d+(?=%\\s+canary)&#39;</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$CANARY_CONF</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查询金丝雀版本错误率</span></span>
<span class="line"><span style="color:#E06C75;">canary_error_rate</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">PROMETHEUS_URL</span><span style="color:#98C379;">}/api/v1/query&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --data-urlencode</span><span style="color:#98C379;"> &#39;query=sum(rate(http_requests_total{version=&quot;canary&quot;,status=~&quot;5..&quot;}[5m])) / sum(rate(http_requests_total{version=&quot;canary&quot;}[5m])) * 100&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    | </span><span style="color:#61AFEF;">jq</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> &#39;.data.result[0].value[1] // &quot;0&quot;&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查询稳定版错误率</span></span>
<span class="line"><span style="color:#E06C75;">stable_error_rate</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">PROMETHEUS_URL</span><span style="color:#98C379;">}/api/v1/query&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --data-urlencode</span><span style="color:#98C379;"> &#39;query=sum(rate(http_requests_total{version=&quot;stable&quot;,status=~&quot;5..&quot;}[5m])) / sum(rate(http_requests_total{version=&quot;stable&quot;}[5m])) * 100&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    | </span><span style="color:#61AFEF;">jq</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> &#39;.data.result[0].value[1] // &quot;0&quot;&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Canary error rate: \${</span><span style="color:#E06C75;">canary_error_rate</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Stable error rate: \${</span><span style="color:#E06C75;">stable_error_rate</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Current canary ratio: \${</span><span style="color:#E06C75;">CURRENT_RATIO</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 回滚条件：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 金丝雀错误率 &gt; 5%</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 金丝雀错误率 &gt; 稳定版 3 倍以上</span></span>
<span class="line"><span style="color:#E06C75;">THRESHOLD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">5</span></span>
<span class="line"><span style="color:#E06C75;">MULTIPLE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">should_rollback</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> (( $(</span><span style="color:#E06C75;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$canary_error_rate</span><span style="color:#98C379;"> &gt; </span><span style="color:#E06C75;">$THRESHOLD</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> |</span><span style="color:#E06C75;"> bc</span><span style="color:#56B6C2;"> -</span><span style="color:#E06C75;">l</span><span style="color:#ABB2BF;">) )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;ALERT: Canary error rate exceeds threshold (\${</span><span style="color:#E06C75;">THRESHOLD</span><span style="color:#98C379;">}%)&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    should_rollback</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">true</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> (( $(</span><span style="color:#E06C75;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$canary_error_rate</span><span style="color:#98C379;"> &gt; </span><span style="color:#E06C75;">$stable_error_rate</span><span style="color:#98C379;"> * </span><span style="color:#E06C75;">$MULTIPLE</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> |</span><span style="color:#E06C75;"> bc</span><span style="color:#56B6C2;"> -</span><span style="color:#E06C75;">l</span><span style="color:#ABB2BF;">) )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;ALERT: Canary error rate is \${</span><span style="color:#E06C75;">MULTIPLE</span><span style="color:#98C379;">}x higher than stable&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    should_rollback</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">true</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#E06C75;"> $should_rollback</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;ROLLING BACK: Setting canary ratio to 0%&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">    cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$CANARY_CONF</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#98C379;">split_clients &quot;</span><span style="color:#56B6C2;">\\$</span><span style="color:#98C379;">{remote_addr}&quot; </span><span style="color:#56B6C2;">\\$</span><span style="color:#98C379;">canary_weight {</span></span>
<span class="line"><span style="color:#98C379;">    0%     canary;</span></span>
<span class="line"><span style="color:#98C379;">    *      stable;</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Rollback completed successfully&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 发送告警</span></span>
<span class="line"><span style="color:#61AFEF;">        curl</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> -X</span><span style="color:#98C379;"> POST</span><span style="color:#98C379;"> &quot;https://hooks.slack.com/services/YOUR/WEBHOOK/URL&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">            -H</span><span style="color:#98C379;"> &quot;Content-Type: application/json&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">            -d</span><span style="color:#98C379;"> &quot;{</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">text</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">:</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">:rotating_light: Canary rollback triggered!</span><span style="color:#56B6C2;">\\\\</span><span style="color:#98C379;">nCanary error: \${</span><span style="color:#E06C75;">canary_error_rate</span><span style="color:#98C379;">}%</span><span style="color:#56B6C2;">\\\\</span><span style="color:#98C379;">nStable error: \${</span><span style="color:#E06C75;">stable_error_rate</span><span style="color:#98C379;">}%</span><span style="color:#56B6C2;">\\\\</span><span style="color:#98C379;">nPrevious ratio: \${</span><span style="color:#E06C75;">CURRENT_RATIO</span><span style="color:#98C379;">}%</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;ERROR: Nginx config test failed after rollback&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;All metrics within acceptable range. No rollback needed.&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_8-完整灰度系统" tabindex="-1"><a class="header-anchor" href="#_8-完整灰度系统"><span>8. 完整灰度系统</span></a></h2><h3 id="_8-1-灰度管理后台设计" tabindex="-1"><a class="header-anchor" href="#_8-1-灰度管理后台设计"><span>8.1 灰度管理后台设计</span></a></h3>`,7),i(d,{code:`eJyFVMFO20AQvfMVVir1hqxAWxVUIZUUUQ6kKZBT1MPGWccWxo5sR4VbUloSCg3QBqRgKJQCQVWb5IAoIhR+hl3bf9H1rqFLSsQeEs++mTczb8aWNeOtpADTFqaGewRyrHw6a4KcIiTHUhG32EJnh27jm7u6gFYraKUVeUO9gvMCWEraAGYmhVbW0Om8u7WEty//4RN5DY5nZ+xUxKu/R+Uao3mWNsUhVHZQ+0x0zze8izURlXf92j7LxVy5LAnTyJrQshgTy+RdOsSVMnmtebx+jJvVq4slEW++Q8Ut0W3X3fYvjmPc0FXbMBNAhxppylnDlbq/vUeqpRx+teY1m26lJKL2iXe5I75OTHLRE4ampYE0PWzrpADnK25v4uVF/3ODBl+dFvxqg12HQVDP9NzW8nmiQ8zghksRMyGwIfVKvJqcEkSQU0UJ6MCc4/TqolAyl7kJTt6KFQfVDI3HzjHeaN2jcDcGMRc6cIKzCdwh0p09UBYz9GAs9cNglLxqwZm0gZ1nhYyOdGll58Br7rkfT3Ch2FXvET2r6vBacnS+jr9UeLkNXVazo5DM0//wyf3TcKs7uLyKakc0BbOEOOGYFZjDf8GJvKVcR+PKkV8o0tAg76zQawkm1AyQ4cJeQqDZSkyB0jTZouIBOvuNvxdIN2wFfyx7zWIwo8Uy3vrJ7y60TVWyYkQ9KJElTkXwcgnvlvxSyXfY23TVrgRDnIG2AvOWgJcW0cpGV21oWzEtb9mQkIVNOgvuxT6XNR5NMSRuZKAQ5YA+HujjgH4e6O/InhwTenuHgq2nJvmnNpsTvWKP9PZmPBS4sTgsUJ8DA5Oi8ajwkJQY/PRTnFP9VgGdqlKQ/0yEotlzGgyKl1VNG3wAo/JjmZXLkLBohkpP4RNpgEN5pUMfWZYHpEc9fwEnnyE7`}),o[6]||=n(`<h3 id="_8-2-灰度规则配置模板" tabindex="-1"><a class="header-anchor" href="#_8-2-灰度规则配置模板"><span>8.2 灰度规则配置模板</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/canary/rules.d/api-v2.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 灰度规则文件：每个灰度发布一个文件</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 灰度规则元信息 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 规则 ID: CANARY-2026-001</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 功能名称: API v2 新版接口</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建时间: 2026-06-05</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建人: zhangsan</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 目标: 验证 API v2 的性能和兼容性</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 灰度策略 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 白名单优先</span></span>
<span class="line"><span style="color:#C678DD;">geo </span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">wl_canary_001</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#D19A66;">         0</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    10.0.1.</span><span style="color:#C678DD;">100</span><span style="color:#D19A66;">      1</span><span style="color:#ABB2BF;">;     </span><span style="color:#7F848E;font-style:italic;"># 开发者测试 IP</span></span>
<span class="line"><span style="color:#ABB2BF;">    10.0.1.</span><span style="color:#C678DD;">101</span><span style="color:#D19A66;">      1</span><span style="color:#ABB2BF;">;     </span><span style="color:#7F848E;font-style:italic;"># QA 测试 IP</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. Cookie 覆盖</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">cookie_canary_001</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">cookie_canary_001</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#98C379;">     &quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;true&quot;</span><span style="color:#98C379;">      &quot;canary&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;false&quot;</span><span style="color:#98C379;">     &quot;stable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 比例分流</span></span>
<span class="line"><span style="color:#C678DD;">split_clients </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">ratio_canary_001</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    5%     canary;     </span><span style="color:#7F848E;font-style:italic;"># 当前灰度比例</span></span>
<span class="line"><span style="color:#ABB2BF;">    *      stable;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 综合决策</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">cookie_canary_001</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">wl_canary_001</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">ratio_canary_001</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">canary_001_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    default</span><span style="color:#ABB2BF;">         stable;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Cookie 最高优先级</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;canary|*&quot;      canary;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;stable|*&quot;      stable;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 白名单</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;|1|*&quot;          canary;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 比例</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;|0|canary&quot;     canary;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;|0|stable&quot;     stable;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 路由配置 =====</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> stable_api_v2 {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.10:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.11:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> canary_api_v2 {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 192.168.1.20:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 server 块中引入</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># location /api/v2/ {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     proxy_pass http://$canary_001_backend;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     proxy_set_header X-Canary-Id &quot;CANARY-2026-001&quot;;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     proxy_set_header X-Canary-Group $canary_001_backend;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-灰度进度自动推进" tabindex="-1"><a class="header-anchor" href="#_8-3-灰度进度自动推进"><span>8.3 灰度进度自动推进</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /usr/local/bin/canary-progress.sh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 灰度进度自动推进脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">CANARY_ID</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;font-style:italic;">$1</span></span>
<span class="line"><span style="color:#E06C75;">CANARY_CONF</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/nginx/canary/rules.d/\${</span><span style="color:#E06C75;">CANARY_ID</span><span style="color:#98C379;">}.conf&quot;</span></span>
<span class="line"><span style="color:#E06C75;">PROMETHEUS_URL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;http://localhost:9090&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 灰度进度阶梯</span></span>
<span class="line"><span style="color:#E06C75;">STEPS</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">1</span><span style="color:#D19A66;"> 5</span><span style="color:#D19A66;"> 10</span><span style="color:#D19A66;"> 20</span><span style="color:#D19A66;"> 50</span><span style="color:#D19A66;"> 100</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">CURRENT_RATIO</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -oP</span><span style="color:#98C379;"> &#39;\\d+(?=%\\s+canary)&#39;</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$CANARY_CONF</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查找当前步骤索引</span></span>
<span class="line"><span style="color:#E06C75;">current_step</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">0</span></span>
<span class="line"><span style="color:#C678DD;">for</span><span style="color:#E06C75;"> i</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#ABB2BF;">!</span><span style="color:#E06C75;">STEPS</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">STEPS</span><span style="color:#98C379;">[</span><span style="color:#E06C75;">$i</span><span style="color:#98C379;">]}&quot;</span><span style="color:#56B6C2;"> -eq</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$CURRENT_RATIO</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">        current_step</span><span style="color:#56B6C2;">=</span><span style="color:#E06C75;">$i</span></span>
<span class="line"><span style="color:#C678DD;">        break</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查是否已经是 100%</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$CURRENT_RATIO</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> -eq</span><span style="color:#D19A66;"> 100</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Already at 100%. Canary release completed.&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查金丝雀版本健康状态</span></span>
<span class="line"><span style="color:#E06C75;">canary_error_rate</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">PROMETHEUS_URL</span><span style="color:#98C379;">}/api/v1/query&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --data-urlencode</span><span style="color:#98C379;"> &quot;query=sum(rate(http_requests_total{canary_id=</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">\${</span><span style="color:#E06C75;">CANARY_ID</span><span style="color:#98C379;">}</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">,version=</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">canary</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">,status=~</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">5..</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">}[5m])) / sum(rate(http_requests_total{canary_id=</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">\${</span><span style="color:#E06C75;">CANARY_ID</span><span style="color:#98C379;">}</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">,version=</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">canary</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">}[5m])) * 100&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    | </span><span style="color:#61AFEF;">jq</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> &#39;.data.result[0].value[1] // &quot;0&quot;&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">canary_p99</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">PROMETHEUS_URL</span><span style="color:#98C379;">}/api/v1/query&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --data-urlencode</span><span style="color:#98C379;"> &quot;query=histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{canary_id=</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">\${</span><span style="color:#E06C75;">CANARY_ID</span><span style="color:#98C379;">}</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">,version=</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">canary</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">}[5m])) by (le))&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    | </span><span style="color:#61AFEF;">jq</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> &#39;.data.result[0].value[1] // &quot;0&quot;&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Current ratio: \${</span><span style="color:#E06C75;">CURRENT_RATIO</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Canary error rate: \${</span><span style="color:#E06C75;">canary_error_rate</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Canary P99 latency: \${</span><span style="color:#E06C75;">canary_p99</span><span style="color:#98C379;">}s&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 健康检查阈值</span></span>
<span class="line"><span style="color:#E06C75;">ERROR_THRESHOLD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1.0</span><span style="color:#7F848E;font-style:italic;">       # 错误率阈值 1%</span></span>
<span class="line"><span style="color:#E06C75;">LATENCY_THRESHOLD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">2.0</span><span style="color:#7F848E;font-style:italic;">     # P99 延迟阈值 2s</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">should_progress</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> (( $(</span><span style="color:#E06C75;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$canary_error_rate</span><span style="color:#98C379;"> &gt; </span><span style="color:#E06C75;">$ERROR_THRESHOLD</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> |</span><span style="color:#E06C75;"> bc</span><span style="color:#56B6C2;"> -</span><span style="color:#E06C75;">l</span><span style="color:#ABB2BF;">) )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;ERROR: Canary error rate (\${</span><span style="color:#E06C75;">canary_error_rate</span><span style="color:#98C379;">}%) exceeds threshold (\${</span><span style="color:#E06C75;">ERROR_THRESHOLD</span><span style="color:#98C379;">}%)&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    should_progress</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">false</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> (( $(</span><span style="color:#E06C75;">echo</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$canary_p99</span><span style="color:#98C379;"> &gt; </span><span style="color:#E06C75;">$LATENCY_THRESHOLD</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> |</span><span style="color:#E06C75;"> bc</span><span style="color:#56B6C2;"> -</span><span style="color:#E06C75;">l</span><span style="color:#ABB2BF;">) )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;ERROR: Canary P99 latency (\${</span><span style="color:#E06C75;">canary_p99</span><span style="color:#98C379;">}s) exceeds threshold (\${</span><span style="color:#E06C75;">LATENCY_THRESHOLD</span><span style="color:#98C379;">}s)&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    should_progress</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">false</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#E06C75;"> $should_progress</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">    next_step</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$((</span><span style="color:#61AFEF;">current_step</span><span style="color:#98C379;"> +</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#E06C75;">    next_ratio</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">STEPS</span><span style="color:#ABB2BF;">[</span><span style="color:#E06C75;">$next_step</span><span style="color:#ABB2BF;">]}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Progressing canary from \${</span><span style="color:#E06C75;">CURRENT_RATIO</span><span style="color:#98C379;">}% to \${</span><span style="color:#E06C75;">next_ratio</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 更新配置</span></span>
<span class="line"><span style="color:#61AFEF;">    sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;s/\${</span><span style="color:#E06C75;">CURRENT_RATIO</span><span style="color:#98C379;">}%\\s*canary/\${</span><span style="color:#E06C75;">next_ratio</span><span style="color:#98C379;">}%    canary/&quot;</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$CANARY_CONF</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 验证并重载</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Canary progressed to \${</span><span style="color:#E06C75;">next_ratio</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;ERROR: Config test failed, reverting&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;s/\${</span><span style="color:#E06C75;">next_ratio</span><span style="color:#98C379;">}%\\s*canary/\${</span><span style="color:#E06C75;">CURRENT_RATIO</span><span style="color:#98C379;">}%    canary/&quot;</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$CANARY_CONF</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Cannot progress: metrics not healthy&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-4-灰度发布仪表盘-nginx-配置" tabindex="-1"><a class="header-anchor" href="#_8-4-灰度发布仪表盘-nginx-配置"><span>8.4 灰度发布仪表盘 Nginx 配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 为灰度发布提供详细的监控指标</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通过自定义日志格式记录灰度信息</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">log_format </span><span style="color:#ABB2BF;">canary_log </span><span style="color:#98C379;">&#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &#39;</span></span>
<span class="line"><span style="color:#98C379;">                      &#39;&quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; $</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                      &#39;&quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                      &#39;rt=$</span><span style="color:#E06C75;">request_time</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                      &#39;upstream=$</span><span style="color:#E06C75;">upstream_addr</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                      &#39;canary_id=$</span><span style="color:#E06C75;">http_x_canary_id</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                      &#39;canary_group=$</span><span style="color:#E06C75;">http_x_canary_group</span><span style="color:#98C379;"> &#39;</span></span>
<span class="line"><span style="color:#98C379;">                      &#39;canary_version=$</span><span style="color:#E06C75;">canary_001_backend</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 指标暴露端点（配合 Prometheus）</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">9145</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">localhost;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /metrics {</span></span>
<span class="line"><span style="color:#C678DD;">        content_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            -- 从共享字典读取灰度指标</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> shared</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.canary_stats</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> keys</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">shared</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get_keys</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            for</span><span style="color:#E06C75;"> _</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">key</span><span style="color:#C678DD;"> in</span><span style="color:#56B6C2;"> ipairs</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">keys</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">                local</span><span style="color:#E06C75;"> value</span><span style="color:#ABB2BF;"> = </span><span style="color:#E5C07B;">shared</span><span style="color:#ABB2BF;">:</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">                ngx</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">say</span><span style="color:#ABB2BF;">(</span><span style="color:#56B6C2;">string.format</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;canary_%s %s&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">key</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;">value</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /status {</span></span>
<span class="line"><span style="color:#C678DD;">        default_type </span><span style="color:#ABB2BF;">application/json;</span></span>
<span class="line"><span style="color:#C678DD;">        content_by_lua_block</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> cjson</span><span style="color:#ABB2BF;"> = </span><span style="color:#56B6C2;">require</span><span style="color:#98C379;"> &quot;cjson&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> shared</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">ngx</span><span style="color:#ABB2BF;">.shared.canary_stats</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> status</span><span style="color:#ABB2BF;"> = {}</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#ABB2BF;"> keys = shared:get_keys(0)</span></span>
<span class="line"><span style="color:#C678DD;">            for</span><span style="color:#ABB2BF;"> _, key in ipairs(keys) do</span></span>
<span class="line"><span style="color:#C678DD;">                status</span><span style="color:#ABB2BF;">[key] = shared:get(key)</span></span>
<span class="line"><span style="color:#C678DD;">            end</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">            ngx.say(cjson.encode({</span></span>
<span class="line"><span style="color:#C678DD;">                timestamp</span><span style="color:#ABB2BF;"> = ngx.now(),</span></span>
<span class="line"><span style="color:#C678DD;">                canary_stats</span><span style="color:#ABB2BF;"> = status</span></span>
<span class="line"><span style="color:#ABB2BF;">            }))</span></span>
<span class="line"><span style="color:#C678DD;">        end</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_9-实战案例" tabindex="-1"><a class="header-anchor" href="#_9-实战案例"><span>9. 实战案例</span></a></h2><h3 id="_9-1-案例-电商首页改版灰度" tabindex="-1"><a class="header-anchor" href="#_9-1-案例-电商首页改版灰度"><span>9.1 案例：电商首页改版灰度</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 电商首页改版灰度发布</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 灰度规则</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第一阶段：内部用户 100% → 第二阶段：5% 用户 → 第三阶段：20% → 第四阶段：50% → 第五阶段：100%</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 灰度维度优先级</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Cookie &gt; VIP等级 &gt; 比例</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># VIP 用户优先体验</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">cookie_vip_level</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">vip_canary</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#98C379;">     &quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;3&quot;</span><span style="color:#98C379;">         &quot;canary&quot;</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 铂金会员优先</span></span>
<span class="line"><span style="color:#98C379;">    &quot;2&quot;</span><span style="color:#98C379;">         &quot;canary&quot;</span><span style="color:#ABB2BF;">;   </span><span style="color:#7F848E;font-style:italic;"># 黄金会员优先</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 比例分流</span></span>
<span class="line"><span style="color:#C678DD;">split_clients </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;">}UA:\${</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">home_ratio</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#ABB2BF;">    5%     canary;       </span><span style="color:#7F848E;font-style:italic;"># 5% 灰度</span></span>
<span class="line"><span style="color:#ABB2BF;">    *      stable;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 综合</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">cookie_home_canary</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">vip_canary</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">home_ratio</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">home_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    default</span><span style="color:#ABB2BF;">         stable;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;canary|*&quot;      canary;     </span><span style="color:#7F848E;font-style:italic;"># Cookie 指定</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;|canary|*&quot;     canary;     </span><span style="color:#7F848E;font-style:italic;"># VIP 用户</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;|0|canary&quot;     canary;     </span><span style="color:#7F848E;font-style:italic;"># 比例命中</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> stable {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.1.10:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.1.11:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> canary {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.2.10:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">shop.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 首页</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/ </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">home_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Canary-Group $</span><span style="color:#E06C75;">home_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 设置 Cookie 确保一致性</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Set-Cookie </span><span style="color:#98C379;">&quot;home_canary=$</span><span style="color:#E06C75;">home_backend</span><span style="color:#98C379;">; Path=/; Max-Age=86400&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # API（所有版本共用）</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Canary-Group $</span><span style="color:#E06C75;">home_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-案例-api-版本灰度切换" tabindex="-1"><a class="header-anchor" href="#_9-2-案例-api-版本灰度切换"><span>9.2 案例：API 版本灰度切换</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># API 版本从 v1 切换到 v2 的灰度发布</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># v1 和 v2 使用不同的 URL 前缀</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 灰度期间 v1 和 v2 并行运行</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 灰度策略：通过 Header 指定版本</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_x_api_version</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">api_version</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;">     $</span><span style="color:#E06C75;">default_api_version</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;1&quot;</span><span style="color:#ABB2BF;">         v1;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;2&quot;</span><span style="color:#ABB2BF;">         v2;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 默认版本（通过配置文件控制）</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">host</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">default_api_version</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#ABB2BF;"> v1;    </span><span style="color:#7F848E;font-style:italic;"># 当前默认版本</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> v1 {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.1.10:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.1.11:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> v2 {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.2.10:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.2.11:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">api.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 统一入口，根据版本路由</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">api_version</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-API-Version $</span><span style="color:#E06C75;">api_version</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 版本发现端点</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> = </span><span style="color:#E06C75;">/api/version </span><span style="color:#ABB2BF;">{</span></span>
<span class="line"><span style="color:#C678DD;">        default_type </span><span style="color:#ABB2BF;">application/json;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &#39;{&quot;default&quot;:&quot;v1&quot;,&quot;available&quot;:[&quot;v1&quot;,&quot;v2&quot;]}&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-案例-移动端灰度发布" tabindex="-1"><a class="header-anchor" href="#_9-3-案例-移动端灰度发布"><span>9.3 案例：移动端灰度发布</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 移动端 App 灰度发布</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 区分 iOS 和 Android，分渠道灰度</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从 User-Agent 提取平台</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_user_agent</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">mobile_platform</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#98C379;">             &quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*iPhone|iPad       </span><span style="color:#98C379;">&quot;ios&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*Android           </span><span style="color:#98C379;">&quot;android&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从自定义 Header 提取 App 版本</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_x_app_version</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">app_version</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#98C379;">     &quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    ~*(\\d+)\\.(\\d+)  </span><span style="color:#98C379;">&quot;$</span><span style="color:#E06C75;">1</span><span style="color:#98C379;">.$</span><span style="color:#E06C75;">2</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从自定义 Header 提取渠道</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;font-style:italic;">http_x_channel</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">channel</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#D19A66;">    default</span><span style="color:#98C379;">     &quot;official&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;huawei&quot;</span><span style="color:#98C379;">    &quot;huawei&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;xiaomi&quot;</span><span style="color:#98C379;">    &quot;xiaomi&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;oppo&quot;</span><span style="color:#98C379;">      &quot;oppo&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#98C379;">    &quot;vivo&quot;</span><span style="color:#98C379;">      &quot;vivo&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 灰度规则：iOS 先发，特定渠道先发</span></span>
<span class="line"><span style="color:#C678DD;">map</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">mobile_platform</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">channel</span><span style="color:#98C379;">|$</span><span style="color:#E06C75;">cookie_canary_app</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> $</span><span style="color:#E06C75;">app_backend</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    default</span><span style="color:#ABB2BF;">                     stable;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Cookie 明确指定</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;| |canary&quot;                  canary;</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;| | |canary&quot;                canary;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # iOS 官方渠道先发</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;ios|official|&quot;              canary;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Android 华为渠道灰度</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;android|huawei|&quot;            canary;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 内部测试</span></span>
<span class="line"><span style="color:#ABB2BF;">    &quot;ios|xiaomi|&quot;               canary;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> stable {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.1.10:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> canary {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> 10.0.2.10:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">app.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://$</span><span style="color:#E06C75;">app_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Canary $</span><span style="color:#E06C75;">app_backend</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Platform $</span><span style="color:#E06C75;">mobile_platform</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-App-Version $</span><span style="color:#E06C75;">http_x_app_version</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">X-Channel $</span><span style="color:#E06C75;">channel</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="_10-最佳实践与注意事项" tabindex="-1"><a class="header-anchor" href="#_10-最佳实践与注意事项"><span>10. 最佳实践与注意事项</span></a></h2><h3 id="_10-1-灰度发布最佳实践" tabindex="-1"><a class="header-anchor" href="#_10-1-灰度发布最佳实践"><span>10.1 灰度发布最佳实践</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>灰度发布最佳实践清单：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 灰度前准备</span></span>
<span class="line"><span>   □ 确认回滚方案（配置文件/脚本就绪）</span></span>
<span class="line"><span>   □ 配置监控告警（错误率/延迟/资源）</span></span>
<span class="line"><span>   □ 准备数据隔离方案</span></span>
<span class="line"><span>   □ 确保日志可区分版本</span></span>
<span class="line"><span>   □ 灰度比例文件独立管理</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 灰度策略</span></span>
<span class="line"><span>   □ 从 1% 或 5% 开始</span></span>
<span class="line"><span>   □ 每个阶段观察至少 30 分钟</span></span>
<span class="line"><span>   □ 逐步扩大：1% → 5% → 10% → 20% → 50% → 100%</span></span>
<span class="line"><span>   □ 优先使用 Cookie 确保用户一致性</span></span>
<span class="line"><span>   □ 白名单先行（内部用户先验证）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 灰度监控</span></span>
<span class="line"><span>   □ 金丝雀 vs 稳定版错误率对比</span></span>
<span class="line"><span>   □ 金丝雀 P99/P95 延迟监控</span></span>
<span class="line"><span>   □ 业务指标监控（转化率、下单率）</span></span>
<span class="line"><span>   □ 资源使用率监控（CPU、内存、连接数）</span></span>
<span class="line"><span>   □ 自动化告警和自动回滚</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 灰度后验证</span></span>
<span class="line"><span>   □ 全量发布后持续监控 24 小时</span></span>
<span class="line"><span>   □ 保留回滚能力至少 48 小时</span></span>
<span class="line"><span>   □ 更新灰度规则归档</span></span>
<span class="line"><span>   □ 复盘总结</span></span>
<span class="line"><span></span></span>
<span class="line"><span>5. 安全注意事项</span></span>
<span class="line"><span>   □ 灰度标记不可被外部伪造（校验签名）</span></span>
<span class="line"><span>   □ 灰度接口权限与生产一致</span></span>
<span class="line"><span>   □ 灰度数据不泄露到生产</span></span>
<span class="line"><span>   □ 灰度版本的安全补丁与生产同步</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-灰度发布常见问题" tabindex="-1"><a class="header-anchor" href="#_10-2-灰度发布常见问题"><span>10.2 灰度发布常见问题</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>常见问题与解决方案：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Q1: 同一用户刷新页面看到不同版本？</span></span>
<span class="line"><span>A: 使用 Cookie 或用户 ID 固定灰度分组。</span></span>
<span class="line"><span>   split_clients 基于 remote_addr 虽然稳定，</span></span>
<span class="line"><span>   但 CDN/代理可能导致 IP 变化。</span></span>
<span class="line"><span>   推荐基于 cookie_user_id 做哈希。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Q2: 灰度流量不均匀？</span></span>
<span class="line"><span>A: split_clients 使用 MurmurHash2，分布均匀。</span></span>
<span class="line"><span>   如果不均匀，检查哈希键是否有规律。</span></span>
<span class="line"><span>   可以加入随机因素：\${remote_addr}URI:\${request_uri}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Q3: 灰度期间数据不一致？</span></span>
<span class="line"><span>A: 全链路灰度需要数据隔离。</span></span>
<span class="line"><span>   数据库使用双写或独立 Schema。</span></span>
<span class="line"><span>   缓存使用不同前缀或不同 DB。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Q4: 灰度回滚后用户报错？</span></span>
<span class="line"><span>A: 回滚时确保：</span></span>
<span class="line"><span>   - 清除灰度版本设置的 Cookie</span></span>
<span class="line"><span>   - 长连接优雅断开</span></span>
<span class="line"><span>   - 异步任务能处理版本回退</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Q5: 多个灰度同时进行？</span></span>
<span class="line"><span>A: 每个灰度使用独立的规则 ID 和变量。</span></span>
<span class="line"><span>   注意灰度之间不能互相影响。</span></span>
<span class="line"><span>   使用独立的配置文件管理。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Q6: 灰度比例调整时请求中断？</span></span>
<span class="line"><span>A: nginx -s reload 是优雅重载。</span></span>
<span class="line"><span>   旧 worker 处理完当前请求后退出。</span></span>
<span class="line"><span>   新 worker 使用新配置。</span></span>
<span class="line"><span>   不会中断已建立的连接。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="参考资源" tabindex="-1"><a class="header-anchor" href="#参考资源"><span>参考资源</span></a></h2><ul><li><a href="https://nginx.org/en/docs/http/ngx_http_split_clients_module.html" target="_blank" rel="noopener noreferrer">Nginx split_clients 官方文档</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_map_module.html" target="_blank" rel="noopener noreferrer">Nginx map 官方文档</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html" target="_blank" rel="noopener noreferrer">Nginx upstream 官方文档</a></li><li><a href="https://martinfowler.com/bliki/BlueGreenDeployment.html" target="_blank" rel="noopener noreferrer">蓝绿部署 - Martin Fowler</a></li><li><a href="https://martinfowler.com/bliki/CanaryRelease.html" target="_blank" rel="noopener noreferrer">金丝雀发布 - Martin Fowler</a></li><li><a href="https://www.nginx.com/blog/deploying-nginx-plus-as-an-api-gateway-part-2/" target="_blank" rel="noopener noreferrer">Nginx 灰度发布方案</a></li><li><a href="https://martinfowler.com/articles/feature-toggles.html" target="_blank" rel="noopener noreferrer">Feature Flags 与灰度发布</a></li><li><a href="https://openresty.org/en/" target="_blank" rel="noopener noreferrer">OpenResty 动态路由</a></li></ul>`,23)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};