import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as a}from"./app-CK-XCtbm.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/01_Nginx%E5%9F%BA%E7%A1%80%E4%B8%8E%E6%9E%B6%E6%9E%84/02_Nginx%E5%AE%89%E8%A3%85%E4%B8%8E%E7%89%88%E6%9C%AC%E9%80%89%E5%9E%8B.html","title":"Nginx 安装与版本选型","lang":"zh-CN","frontmatter":{"title":"Nginx 安装与版本选型","icon":"fa6-solid:download","order":2,"category":["Linux","Nginx"],"tag":["Nginx","安装","编译","Docker","版本选型"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":22.36,"words":6707},"filePathRelative":"Linux/07_Nginx/01_Nginx基础与架构/02_Nginx安装与版本选型.md"}`),s={name:`02_Nginx安装与版本选型.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="nginx-安装与版本选型" tabindex="-1"><a class="header-anchor" href="#nginx-安装与版本选型"><span>Nginx 安装与版本选型</span></a></h1><h2 id="_1-安装方式概览" tabindex="-1"><a class="header-anchor" href="#_1-安装方式概览"><span>1. 安装方式概览</span></a></h2><p>Nginx 提供多种安装方式，各有优劣，选择合适的方式是部署的第一步：</p><table><thead><tr><th>安装方式</th><th>优点</th><th>缺点</th><th>适用场景</th></tr></thead><tbody><tr><td>包管理器（apt/yum）</td><td>简单快捷、自动更新</td><td>版本滞后、模块有限</td><td>开发/测试</td></tr><tr><td>官方仓库（<a href="http://nginx.org" target="_blank" rel="noopener noreferrer">nginx.org</a>）</td><td>版本较新、官方维护</td><td>模块仍有限</td><td>生产通用</td></tr><tr><td>源码编译</td><td>最大灵活性、可定制模块</td><td>维护成本高、升级复杂</td><td>生产高性能</td></tr><tr><td>Docker</td><td>环境一致、快速部署</td><td>性能略损、调试不便</td><td>容器化部署</td></tr><tr><td>第三方仓库（Ondřej等）</td><td>模块丰富、版本最新</td><td>非官方、稳定性待验证</td><td>开发尝鲜</td></tr></tbody></table>`,4),i(d,{code:`eJx1kF9LwlAYxu/9FENvk3RapIRi04Vo+CfvhhclrqKBsboJFbQwXEUa2jIwygIzkOllmtGX2TlHv0Unz4Yb1Ll9f+f3Ps+7J+4c7VOpDQuF33YqkExxs5IEr96BIk1fK1AegUktTdntPirhzMPWANS7qPmkjt/QzQC8nPuL858J5y9SwMMClaA1Tv36Rs1eMJc5zIpmDs8x58pbCThrl6bdMur31Q8Jb4S9Dni8X98Vl32wKiNpBJVLNJGng1tQO4N3Q7+1aCE2emELxphIKMmRbSR82gjNo8Ujmxy4riClg+oX4KGncwR0LWxMbCsejoY4OK6j57K23CglLOnr1vqSGrBdgvIQSVXY7uPWBHcv1DGWDTPhQJQDSguXVT8bYNwwuQmsB6b/T3x8cipk9awUfyAIXpubCbArjqVMTsiJXhvP8waS3EgDaadnlXX9DeoZNZRlPWsOk/MHgZD3+A==`}),o[1]||=n(`<h2 id="_2-包管理器安装" tabindex="-1"><a class="header-anchor" href="#_2-包管理器安装"><span>2. 包管理器安装</span></a></h2><h3 id="_2-1-ubuntu-debian-系-apt" tabindex="-1"><a class="header-anchor" href="#_2-1-ubuntu-debian-系-apt"><span>2.1 Ubuntu/Debian 系（apt）</span></a></h3><h4 id="默认仓库安装" tabindex="-1"><a class="header-anchor" href="#默认仓库安装"><span>默认仓库安装</span></a></h4><p>Ubuntu 默认仓库中的 Nginx 版本通常较旧：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 更新包索引</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> update</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 Nginx</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -y</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看版本</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -v</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出示例：nginx version: nginx/1.18.0 (Ubuntu)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看编译参数</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -V</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">默认仓库版本过旧</p><p>Ubuntu 22.04 LTS 默认仓库中的 Nginx 版本为 1.18.0，该版本发布于 2020 年，缺少 HTTP/3、安全补丁等重要更新。生产环境强烈建议使用 Nginx 官方仓库。</p></div><h4 id="nginx-官方仓库安装" tabindex="-1"><a class="header-anchor" href="#nginx-官方仓库安装"><span>Nginx 官方仓库安装</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装必要依赖</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> curl</span><span style="color:#98C379;"> gnupg2</span><span style="color:#98C379;"> ca-certificates</span><span style="color:#98C379;"> lsb-release</span><span style="color:#98C379;"> ubuntu-keyring</span><span style="color:#D19A66;"> -y</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 导入 Nginx 官方签名密钥</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#98C379;"> https://nginx.org/keys/nginx_signing.key</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">gpg</span><span style="color:#D19A66;"> --dearmor</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /usr/share/keyrings/nginx-archive-keyring.gpg</span><span style="color:#ABB2BF;"> &gt;</span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证密钥指纹</span></span>
<span class="line"><span style="color:#61AFEF;">gpg</span><span style="color:#D19A66;"> --dry-run</span><span style="color:#D19A66;"> --no-keyring</span><span style="color:#D19A66;"> --no-default-keyring</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --keyring</span><span style="color:#98C379;"> /usr/share/keyrings/nginx-archive-keyring.gpg</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --verify</span><span style="color:#98C379;"> /usr/share/keyrings/nginx-archive-keyring.gpg</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加 Nginx 稳定版仓库</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">http://nginx.org/packages/ubuntu \`</span><span style="color:#61AFEF;">lsb_release</span><span style="color:#D19A66;"> -cs</span><span style="color:#98C379;">\` nginx&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/apt/sources.list.d/nginx.list</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果需要主线版，使用以下仓库</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># echo &quot;deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \\</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># http://nginx.org/packages/mainline/ubuntu \`lsb_release -cs\` nginx&quot; \\</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     | sudo tee /etc/apt/sources.list.d/nginx.list</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置仓库优先级（高于系统默认仓库）</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;Package: *\\nPin: origin nginx.org\\nPin-Priority: 900&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    | </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/apt/preferences.d/99nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 更新包索引并安装</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> update</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -y</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证版本</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -v</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输出示例：nginx version: nginx/1.26.2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-rhel-centos-rocky-alma-系-yum-dnf" tabindex="-1"><a class="header-anchor" href="#_2-2-rhel-centos-rocky-alma-系-yum-dnf"><span>2.2 RHEL/CentOS/Rocky/Alma 系（yum/dnf）</span></a></h3><h4 id="默认仓库安装-1" tabindex="-1"><a class="header-anchor" href="#默认仓库安装-1"><span>默认仓库安装</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># CentOS 7 / RHEL 7</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> yum</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> epel-release</span><span style="color:#D19A66;"> -y</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> yum</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -y</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CentOS 8+ / Rocky / Alma / RHEL 8+</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> dnf</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -y</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看版本</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -v</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="nginx-官方仓库安装-1" tabindex="-1"><a class="header-anchor" href="#nginx-官方仓库安装-1"><span>Nginx 官方仓库安装</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 EPEL 仓库（CentOS 7 需要）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> yum</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> epel-release</span><span style="color:#D19A66;"> -y</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建 Nginx 官方仓库配置</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/yum.repos.d/nginx.repo</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">[nginx-stable]</span></span>
<span class="line"><span style="color:#98C379;">name=nginx stable repo</span></span>
<span class="line"><span style="color:#98C379;">baseurl=http://nginx.org/packages/centos/$releasever/$basearch/</span></span>
<span class="line"><span style="color:#98C379;">gpgcheck=1</span></span>
<span class="line"><span style="color:#98C379;">enabled=1</span></span>
<span class="line"><span style="color:#98C379;">gpgkey=https://nginx.org/keys/nginx_signing.key</span></span>
<span class="line"><span style="color:#98C379;">module_hotfixes=true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">[nginx-mainline]</span></span>
<span class="line"><span style="color:#98C379;">name=nginx mainline repo</span></span>
<span class="line"><span style="color:#98C379;">baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/</span></span>
<span class="line"><span style="color:#98C379;">gpgcheck=1</span></span>
<span class="line"><span style="color:#98C379;">enabled=0</span></span>
<span class="line"><span style="color:#98C379;">gpgkey=https://nginx.org/keys/nginx_signing.key</span></span>
<span class="line"><span style="color:#98C379;">module_hotfixes=true</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果需要使用主线版</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># sudo yum-config-manager --enable nginx-mainline</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 Nginx</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> yum</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -y</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证版本</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -v</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-包管理器安装的-nginx-文件布局" tabindex="-1"><a class="header-anchor" href="#_2-3-包管理器安装的-nginx-文件布局"><span>2.3 包管理器安装的 Nginx 文件布局</span></a></h3><p>安装完成后，了解文件分布非常重要：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Ubuntu/Debian 文件布局：</span></span>
<span class="line"><span>/etc/nginx/</span></span>
<span class="line"><span>├── nginx.conf              # 主配置文件</span></span>
<span class="line"><span>├── sites-available/         # 可用站点配置</span></span>
<span class="line"><span>│   └── default</span></span>
<span class="line"><span>├── sites-enabled/           # 已启用站点（符号链接）</span></span>
<span class="line"><span>│   └── default -&gt; ../sites-available/default</span></span>
<span class="line"><span>├── conf.d/                  # 额外配置</span></span>
<span class="line"><span>├── snippets/                # 配置片段</span></span>
<span class="line"><span>│   ├── self-signed.conf</span></span>
<span class="line"><span>│   └── ssl-params.conf</span></span>
<span class="line"><span>├── modules-available/       # 可用动态模块</span></span>
<span class="line"><span>└── modules-enabled/         # 已启用动态模块</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RHEL/CentOS 文件布局：</span></span>
<span class="line"><span>/etc/nginx/</span></span>
<span class="line"><span>├── nginx.conf              # 主配置文件</span></span>
<span class="line"><span>├── conf.d/                 # 额外配置</span></span>
<span class="line"><span>│   └── default.conf</span></span>
<span class="line"><span>├── default.d/              # 默认配置片段</span></span>
<span class="line"><span>└── modules/                # 动态模块</span></span>
<span class="line"><span></span></span>
<span class="line"><span>通用路径：</span></span>
<span class="line"><span>/usr/share/nginx/html/      # 默认站点根目录</span></span>
<span class="line"><span>/var/log/nginx/              # 日志目录</span></span>
<span class="line"><span>/var/cache/nginx/            # 缓存目录</span></span>
<span class="line"><span>/usr/sbin/nginx              # 可执行文件</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">Ubuntu vs RHEL 配置风格差异</p><ul><li>Ubuntu/Debian 采用 <code>sites-available/sites-enabled</code> 模式，通过符号链接管理站点启用/禁用</li><li>RHEL/CentOS 采用 <code>conf.d/</code> 模式，所有 <code>.conf</code> 文件自动加载</li><li>Nginx 官方仓库的包统一使用 <code>conf.d/</code> 模式</li><li>两种风格可以混用，但建议统一选择一种</li></ul></div><h3 id="_2-4-包管理器安装的服务管理" tabindex="-1"><a class="header-anchor" href="#_2-4-包管理器安装的服务管理"><span>2.4 包管理器安装的服务管理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 启动 Nginx</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置开机自启</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 停止 Nginx</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> stop</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重启 Nginx</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重新加载配置（不中断服务）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> reload</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看状态</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看是否开机自启</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> is-enabled</span><span style="color:#98C379;"> nginx</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-源码编译安装" tabindex="-1"><a class="header-anchor" href="#_3-源码编译安装"><span>3. 源码编译安装</span></a></h2><h3 id="_3-1-编译安装完整流程" tabindex="-1"><a class="header-anchor" href="#_3-1-编译安装完整流程"><span>3.1 编译安装完整流程</span></a></h3>`,21),i(d,{code:`eJxLL0osyFAIceJSAALH6KftbU+XtD/fM+3F+onP+9Y/XdQcq6Cra6fgFP1kR/eLvXuf7ZrwfEFjLFi1E1jGOfrF8sVP+7qRZZzBMi7RSi9be5/vXQcx7ml/07OpG2ySivTt9PST8/PSMtNLi1KVIDpcwDpcqyEans1Y/3TCsmcdE552zbevBStwBSmoAYrWKLiBbWzb/GTf3Bdbp72cvu7lohkQU9wg9iJpAJpUo+AerQRxAtjy3MRsmK3uYPUe0UpP13W+WNwKl1bIzCsuSczJgSrzACvzjH7aMfvp7l3FlcUlqbkpz+b0Pu1aCFHgCVbgFf1yVc+L9Y0Qw2K5wFLFJZU5qQqOCmmZOTlWyibOjm6mBjrJ+Tn5RVbKaWlpSGq8oGqMDC3N3IyR1QAAR8epWw==`}),o[2]||=n(`<h3 id="_3-2-准备编译环境" tabindex="-1"><a class="header-anchor" href="#_3-2-准备编译环境"><span>3.2 准备编译环境</span></a></h3><h4 id="ubuntu-debian" tabindex="-1"><a class="header-anchor" href="#ubuntu-debian"><span>Ubuntu/Debian</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 更新系统</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> update</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> upgrade</span><span style="color:#D19A66;"> -y</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装编译工具链</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> build-essential</span><span style="color:#D19A66;"> -y</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 Nginx 编译依赖</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    libpcre3</span><span style="color:#98C379;"> libpcre3-dev</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">       # PCRE 正则库（必须）</span></span>
<span class="line"><span style="color:#61AFEF;">    zlib1g</span><span style="color:#98C379;"> zlib1g-dev</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">           # zlib 压缩库（必须）</span></span>
<span class="line"><span style="color:#61AFEF;">    libssl-dev</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                  # OpenSSL 库（SSL模块需要）</span></span>
<span class="line"><span style="color:#61AFEF;">    libgeoip-dev</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                # GeoIP 库</span></span>
<span class="line"><span style="color:#61AFEF;">    libgd-dev</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                   # GD 图形库</span></span>
<span class="line"><span style="color:#61AFEF;">    libxml2</span><span style="color:#98C379;"> libxml2-dev</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">         # XML 库</span></span>
<span class="line"><span style="color:#61AFEF;">    libxslt1-dev</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                # XSLT 库</span></span>
<span class="line"><span style="color:#61AFEF;">    libpam0g-dev</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                # PAM 认证库</span></span>
<span class="line"><span style="color:#61AFEF;">    uuid-dev</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                    # UUID 库</span></span>
<span class="line"><span style="color:#61AFEF;">    libgoogle-perftools-dev</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">     # Google PerfTools (tcmalloc)</span></span>
<span class="line"><span style="color:#61AFEF;">    pkg-config</span><span style="color:#7F848E;font-style:italic;">                     # 编译配置工具</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="rhel-centos-rocky" tabindex="-1"><a class="header-anchor" href="#rhel-centos-rocky"><span>RHEL/CentOS/Rocky</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装编译工具链</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> dnf</span><span style="color:#98C379;"> groupinstall</span><span style="color:#98C379;"> &quot;Development Tools&quot;</span><span style="color:#D19A66;"> -y</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装 Nginx 编译依赖</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> dnf</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    pcre</span><span style="color:#98C379;"> pcre-devel</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">             # PCRE 正则库</span></span>
<span class="line"><span style="color:#61AFEF;">    zlib</span><span style="color:#98C379;"> zlib-devel</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">             # zlib 压缩库</span></span>
<span class="line"><span style="color:#61AFEF;">    openssl</span><span style="color:#98C379;"> openssl-devel</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">       # OpenSSL 库</span></span>
<span class="line"><span style="color:#61AFEF;">    gd</span><span style="color:#98C379;"> gd-devel</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                 # GD 图形库</span></span>
<span class="line"><span style="color:#61AFEF;">    geoip-devel</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                 # GeoIP 库</span></span>
<span class="line"><span style="color:#61AFEF;">    libxml2</span><span style="color:#98C379;"> libxml2-devel</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">       # XML 库</span></span>
<span class="line"><span style="color:#61AFEF;">    libxslt</span><span style="color:#98C379;"> libxslt-devel</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">       # XSLT 库</span></span>
<span class="line"><span style="color:#61AFEF;">    perl-ExtUtils-Embed</span><span style="color:#7F848E;font-style:italic;">            # Perl 嵌入</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-下载与解压源码" tabindex="-1"><a class="header-anchor" href="#_3-3-下载与解压源码"><span>3.3 下载与解压源码</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 创建编译目录</span></span>
<span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /usr/local/src/nginx</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> /usr/local/src/nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 下载稳定版源码</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 访问 https://nginx.org/en/download.html 获取最新版本号</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -O</span><span style="color:#98C379;"> https://nginx.org/download/nginx-1.26.2.tar.gz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 下载签名文件（可选，用于验证）</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -O</span><span style="color:#98C379;"> https://nginx.org/download/nginx-1.26.2.tar.gz.asc</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证签名（需要导入 Nginx 签名密钥）</span></span>
<span class="line"><span style="color:#61AFEF;">gpg</span><span style="color:#D19A66;"> --verify</span><span style="color:#98C379;"> nginx-1.26.2.tar.gz.asc</span><span style="color:#98C379;"> nginx-1.26.2.tar.gz</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 解压</span></span>
<span class="line"><span style="color:#61AFEF;">tar</span><span style="color:#D19A66;"> -xzf</span><span style="color:#98C379;"> nginx-1.26.2.tar.gz</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> nginx-1.26.2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看目录结构</span></span>
<span class="line"><span style="color:#61AFEF;">ls</span><span style="color:#D19A66;"> -la</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>源码目录结构：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>nginx-1.26.2/</span></span>
<span class="line"><span>├── auto/           # 自动检测脚本</span></span>
<span class="line"><span>├── conf/           # 默认配置文件模板</span></span>
<span class="line"><span>├── contrib/        # 贡献工具（vim语法高亮等）</span></span>
<span class="line"><span>├── html/           # 默认HTML页面</span></span>
<span class="line"><span>├── man/            # 手册页</span></span>
<span class="line"><span>├── src/            # 源代码</span></span>
<span class="line"><span>│   ├── core/       # 核心代码</span></span>
<span class="line"><span>│   ├── event/      # 事件模块</span></span>
<span class="line"><span>│   ├── http/       # HTTP模块</span></span>
<span class="line"><span>│   ├── mail/       # 邮件模块</span></span>
<span class="line"><span>│   ├── stream/     # Stream模块</span></span>
<span class="line"><span>│   ├── os/         # 操作系统适配</span></span>
<span class="line"><span>│   └── misc/       # 其他</span></span>
<span class="line"><span>├── configure       # 配置脚本</span></span>
<span class="line"><span>└── CHANGES         # 变更日志</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-配置编译参数-configure" tabindex="-1"><a class="header-anchor" href="#_3-4-配置编译参数-configure"><span>3.4 配置编译参数（./configure）</span></a></h3><p>这是编译安装最关键的一步，决定了 Nginx 将包含哪些功能和模块：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 基础路径 =====</span></span>
<span class="line"><span style="color:#E06C75;">    --prefix</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">/etc/nginx</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                        # 安装前缀路径</span></span>
<span class="line"><span style="color:#E06C75;">    --sbin-path</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">/usr/sbin/nginx</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                # 可执行文件路径</span></span>
<span class="line"><span style="color:#E06C75;">    --modules-path</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">/usr/lib64/nginx/modules</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">    # 动态模块路径</span></span>
<span class="line"><span style="color:#E06C75;">    --conf-path</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">/etc/nginx/nginx.conf</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">          # 配置文件路径</span></span>
<span class="line"><span style="color:#E06C75;">    --error-log-path</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">/var/log/nginx/error.log</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">  # 错误日志路径</span></span>
<span class="line"><span style="color:#E06C75;">    --http-log-path</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">/var/log/nginx/access.log</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">  # 访问日志路径</span></span>
<span class="line"><span style="color:#E06C75;">    --pid-path</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">/var/run/nginx.pid</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">              # PID文件路径</span></span>
<span class="line"><span style="color:#E06C75;">    --lock-path</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">/var/run/nginx.lock</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">            # 锁文件路径</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 用户与进程 =====</span></span>
<span class="line"><span style="color:#E06C75;">    --user</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">nginx</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                               # Worker进程运行用户</span></span>
<span class="line"><span style="color:#E06C75;">    --group</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">nginx</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                              # Worker进程运行组</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 编译优化 =====</span></span>
<span class="line"><span style="color:#E06C75;">    --with-cc-opt</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;-O2 -g -pipe -Wall -Wp,-D_FORTIFY_SOURCE=2 -fexceptions -fstack-protector-strong --param=ssp-buffer-size=4 -grecord-gcc-switches -m64 -mtune=generic&quot;</span><span style="color:#61AFEF;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-ld-opt=</span><span style="color:#98C379;">&quot;-Wl,-z,relro -Wl,-z,now -pie&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 必要模块 =====</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-pcre</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                                # 使用PCRE库</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-pcre-jit</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                            # PCRE JIT编译优化</span></span>
<span class="line"><span style="color:#E06C75;">    --with-zlib</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">/usr/local/src/zlib</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">           # 指定zlib路径（如自定义编译）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== HTTP 核心模块 =====</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_ssl_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                     # SSL/TLS支持（生产必须）</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_v2_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                      # HTTP/2支持</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_v3_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                      # HTTP/3(QUIC)支持（1.25.0+）</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_realip_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                   # 真实IP获取</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_addition_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                # 响应内容追加</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_sub_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                     # 响应内容替换</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_dav_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                     # WebDAV支持</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_flv_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                     # FLV流媒体</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_mp4_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                     # MP4流媒体</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_gunzip_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                  # 解压响应</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_gzip_static_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">             # 预压缩文件</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_auth_request_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">             # 子请求认证</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_random_index_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">             # 随机首页</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_secure_link_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">             # 安全链接</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_slice_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                   # 大文件分片</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-http_stub_status_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">             # 状态监控</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== Mail 模块 =====</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-mail</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                                # 邮件代理</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-mail_ssl_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                     # 邮件SSL</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== Stream 模块 =====</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-stream</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                              # TCP/UDP代理</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-stream_ssl_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                   # Stream SSL</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-stream_realip_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                 # Stream 真实IP</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-stream_geoip_module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">                 # Stream GeoIP</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ===== 第三方模块 =====</span></span>
<span class="line"><span style="color:#E06C75;">    --add-module</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">/usr/local/src/headers-more-nginx-module</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">   # 静态编译</span></span>
<span class="line"><span style="color:#E06C75;">    --add-module</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">/usr/local/src/echo-nginx-module</span><span style="color:#61AFEF;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --add-dynamic-module=/usr/local/src/ngx_brotli</span><span style="color:#7F848E;font-style:italic;">             # 动态编译</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-5-编译参数详解" tabindex="-1"><a class="header-anchor" href="#_3-5-编译参数详解"><span>3.5 编译参数详解</span></a></h3><h4 id="路径类参数" tabindex="-1"><a class="header-anchor" href="#路径类参数"><span>路径类参数</span></a></h4><table><thead><tr><th>参数</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>--prefix</code></td><td><code>/usr/local/nginx</code></td><td>安装根路径，其他路径的默认基础</td></tr><tr><td><code>--sbin-path</code></td><td><code>prefix/sbin/nginx</code></td><td>可执行文件路径</td></tr><tr><td><code>--modules-path</code></td><td><code>prefix/modules</code></td><td>动态模块目录</td></tr><tr><td><code>--conf-path</code></td><td><code>prefix/conf/nginx.conf</code></td><td>主配置文件路径</td></tr><tr><td><code>--error-log-path</code></td><td><code>prefix/logs/error.log</code></td><td>错误日志路径</td></tr><tr><td><code>--http-log-path</code></td><td><code>prefix/logs/access.log</code></td><td>访问日志路径</td></tr><tr><td><code>--pid-path</code></td><td><code>prefix/logs/nginx.pid</code></td><td>PID文件路径</td></tr><tr><td><code>--lock-path</code></td><td><code>prefix/logs/nginx.lock</code></td><td>锁文件路径</td></tr><tr><td><code>--user</code></td><td>nobody</td><td>Worker进程运行用户</td></tr><tr><td><code>--group</code></td><td>nobody</td><td>Worker进程运行组</td></tr></tbody></table><h4 id="编译优化参数" tabindex="-1"><a class="header-anchor" href="#编译优化参数"><span>编译优化参数</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># --with-cc-opt: 传递给 C 编译器的额外选项</span></span>
<span class="line"><span style="color:#E06C75;">--with-cc-opt</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;-O2 -g -pipe -Wall -Wp,-D_FORTIFY_SOURCE=2 -fexceptions -fstack-protector-strong&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 常用编译优化选项：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -O2          : GCC优化等级2（平衡编译时间和运行性能）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -g           : 生成调试信息</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -pipe        : 使用管道代替临时文件加速编译</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -Wall        : 启用所有常见警告</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -D_FORTIFY_SOURCE=2 : 缓冲区溢出检测</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -fstack-protector-strong : 栈保护</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -m64         : 生成64位代码</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -mtune=generic : 优化为通用CPU</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># --with-ld-opt: 传递给链接器的额外选项</span></span>
<span class="line"><span style="color:#E06C75;">--with-ld-opt</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;-Wl,-z,relro -Wl,-z,now -pie&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 常用链接选项：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -Wl,-z,relro : 只读重定位（部分RELRO）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -Wl,-z,now   : 完整RELRO</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># -pie         : 位置无关可执行文件（ASLR增强）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">安全编译选项</p><p><code>-D_FORTIFY_SOURCE=2</code>、<code>-fstack-protector-strong</code>、<code>-Wl,-z,relro,-z,now</code> 和 <code>-pie</code> 都是重要的安全加固选项，能够有效防止缓冲区溢出、栈攻击和内存布局预测等攻击。生产环境的编译务必包含这些选项。参考：<a href="https://nginx.org/en/docs/configure.html" target="_blank" rel="noopener noreferrer">https://nginx.org/en/docs/configure.html</a></p></div><h3 id="_3-6-编译与安装" tabindex="-1"><a class="header-anchor" href="#_3-6-编译与安装"><span>3.6 编译与安装</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 编译（利用多核加速）</span></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#D19A66;"> -j$(</span><span style="color:#61AFEF;">nproc</span><span style="color:#D19A66;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> make</span><span style="color:#98C379;"> install</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证安装</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -v</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx version: nginx/1.26.2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看编译参数</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -V</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># built by gcc 11.4.0 (Ubuntu 11.4.0-1ubuntu1~22.04)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># configure arguments: --prefix=/etc/nginx ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查配置</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx: the configuration file /etc/nginx/nginx.conf syntax is ok</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx: configuration file /etc/nginx/nginx.conf test is successful</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-7-创建-systemd-服务文件" tabindex="-1"><a class="header-anchor" href="#_3-7-创建-systemd-服务文件"><span>3.7 创建 systemd 服务文件</span></a></h3><p>源码编译安装不会自动创建 systemd 服务，需要手动配置：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 创建 nginx 用户（如果不存在）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> useradd</span><span style="color:#D19A66;"> -r</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> /sbin/nologin</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建 systemd 服务文件</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tee</span><span style="color:#98C379;"> /etc/systemd/system/nginx.service</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">[Unit]</span></span>
<span class="line"><span style="color:#98C379;">Description=The nginx HTTP and reverse proxy server</span></span>
<span class="line"><span style="color:#98C379;">After=network.target remote-fs.target nss-lookup.target</span></span>
<span class="line"><span style="color:#98C379;">Wants=network-online.target</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">[Service]</span></span>
<span class="line"><span style="color:#98C379;">Type=forking</span></span>
<span class="line"><span style="color:#98C379;">PIDFile=/var/run/nginx.pid</span></span>
<span class="line"><span style="color:#98C379;">ExecStartPre=/usr/sbin/nginx -t -c /etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#98C379;">ExecStart=/usr/sbin/nginx -c /etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#98C379;">ExecReload=/bin/kill -s HUP $MAINPID</span></span>
<span class="line"><span style="color:#98C379;">ExecStop=/bin/kill -s QUIT $MAINPID</span></span>
<span class="line"><span style="color:#98C379;">PrivateTmp=true</span></span>
<span class="line"><span style="color:#98C379;">Restart=on-failure</span></span>
<span class="line"><span style="color:#98C379;">RestartSec=5s</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">[Install]</span></span>
<span class="line"><span style="color:#98C379;">WantedBy=multi-user.target</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重载 systemd 配置</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> daemon-reload</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动并设置开机自启</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查状态</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> nginx</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-8-编译后验证" tabindex="-1"><a class="header-anchor" href="#_3-8-编译后验证"><span>3.8 编译后验证</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 验证版本与编译参数</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -V</span><span style="color:#ABB2BF;"> 2&gt;&amp;1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证模块加载</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -V</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> &#39;with-http_[a-z_]*_module&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证配置语法</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动并测试</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -I</span><span style="color:#98C379;"> http://localhost/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 预期输出：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTP/1.1 200 OK</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Server: nginx/1.26.2</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Date: ...</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Content-Type: text/html</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-docker-安装" tabindex="-1"><a class="header-anchor" href="#_4-docker-安装"><span>4. Docker 安装</span></a></h2><h3 id="_4-1-官方-docker-镜像" tabindex="-1"><a class="header-anchor" href="#_4-1-官方-docker-镜像"><span>4.1 官方 Docker 镜像</span></a></h3><p>Nginx 在 Docker Hub 上提供了多个官方镜像标签：</p><table><thead><tr><th>镜像标签</th><th>基础镜像</th><th>说明</th></tr></thead><tbody><tr><td><code>nginx:latest</code></td><td>Debian Bookworm</td><td>最新稳定版</td></tr><tr><td><code>nginx:1.26</code></td><td>Debian Bookworm</td><td>指定大版本</td></tr><tr><td><code>nginx:1.26.2</code></td><td>Debian Bookworm</td><td>指定精确版本</td></tr><tr><td><code>nginx:1.26-alpine</code></td><td>Alpine 3.19</td><td>Alpine 小体积版</td></tr><tr><td><code>nginx:1.26-alpine-slim</code></td><td>Alpine 3.19</td><td>Alpine 极简版</td></tr><tr><td><code>nginx:mainline</code></td><td>Debian Bookworm</td><td>最新主线版</td></tr><tr><td><code>nginx:mainline-alpine</code></td><td>Alpine 3.19</td><td>主线版 Alpine</td></tr></tbody></table><div class="hint-container tip"><p class="hint-container-title">镜像选择建议</p><ul><li><strong>生产环境</strong>：使用精确版本标签（如 <code>nginx:1.26.2-alpine</code>），避免 <code>latest</code></li><li><strong>镜像体积</strong>：Alpine 版约 25MB，Debian 版约 140MB</li><li><strong>兼容性</strong>：Alpine 使用 musl libc，某些模块可能存在兼容问题</li><li><strong>稳定性</strong>：Debian 版更稳定，Alpine 版更轻量</li></ul></div><h3 id="_4-2-docker-基础运行" tabindex="-1"><a class="header-anchor" href="#_4-2-docker-基础运行"><span>4.2 Docker 基础运行</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 最简单的运行方式</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> run</span><span style="color:#D19A66;"> --name</span><span style="color:#98C379;"> my-nginx</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> 80:80</span><span style="color:#98C379;"> nginx:1.26</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 带配置文件和站点目录的运行</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> run</span><span style="color:#D19A66;"> --name</span><span style="color:#98C379;"> my-nginx</span><span style="color:#D19A66;"> -d</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -p</span><span style="color:#98C379;"> 80:80</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -p</span><span style="color:#98C379;"> 443:443</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -v</span><span style="color:#98C379;"> /etc/nginx/nginx.conf:/etc/nginx/nginx.conf:ro</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -v</span><span style="color:#98C379;"> /etc/nginx/conf.d:/etc/nginx/conf.d:ro</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -v</span><span style="color:#98C379;"> /var/www/html:/usr/share/nginx/html:ro</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -v</span><span style="color:#98C379;"> /var/log/nginx:/var/log/nginx</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -v</span><span style="color:#98C379;"> /etc/nginx/ssl:/etc/nginx/ssl:ro</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    nginx:1.26</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证运行状态</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> ps</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -I</span><span style="color:#98C379;"> http://localhost/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-docker-compose-部署" tabindex="-1"><a class="header-anchor" href="#_4-3-docker-compose-部署"><span>4.3 Docker Compose 部署</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.yml</span></span>
<span class="line"><span style="color:#E06C75;">version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;3.8&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  nginx</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx:1.26-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx-proxy</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;80:80&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;443:443&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/nginx.conf:/etc/nginx/nginx.conf:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/conf.d:/etc/nginx/conf.d:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/ssl:/etc/nginx/ssl:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./www:/usr/share/nginx/html:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">nginx-logs:/var/log/nginx</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">nginx-cache:/var/cache/nginx</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">TZ=Asia/Shanghai</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">frontend</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app1</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app2</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;wget&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;--quiet&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;--tries=1&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;--spider&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://localhost/&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  app1</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app1</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">frontend</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">APP_PORT=8080</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  app2</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:latest</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app2</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">frontend</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">APP_PORT=8080</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  nginx-logs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  nginx-cache</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  frontend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  backend</span><span style="color:#ABB2BF;">:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-自定义-docker-镜像" tabindex="-1"><a class="header-anchor" href="#_4-4-自定义-docker-镜像"><span>4.4 自定义 Docker 镜像</span></a></h3><div class="language-dockerfile line-numbers-mode" data-highlighter="shiki" data-ext="dockerfile" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-dockerfile"><span class="line"><span style="color:#7F848E;font-style:italic;"># Dockerfile - 基于官方镜像添加自定义模块</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> nginx:1.26 </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> builder</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装编译依赖</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> apt-get update &amp;&amp; apt-get install -y \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    build-essential \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    libpcre3-dev \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    zlib1g-dev \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    libssl-dev \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    wget \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; rm -rf /var/lib/apt/lists/*</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 下载并编译第三方模块</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> cd /tmp \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; wget https://github.com/openresty/headers-more-nginx-module/archive/refs/tags/v0.37.tar.gz \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; tar -xzf v0.37.tar.gz \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; wget https://github.com/google/ngx_brotli/archive/refs/heads/master.tar.gz \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; tar -xzf master.tar.gz \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; cd ngx_brotli-master &amp;&amp; git init || true &amp;&amp; git submodule update --init || true \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; cd /tmp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取 Nginx 源码并重新编译</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> nginx_ver=$(nginx -v 2&gt;&amp;1 | cut -d</span><span style="color:#98C379;">&#39;/&#39;</span><span style="color:#ABB2BF;"> -f2) \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; wget https://nginx.org/download/nginx-\${nginx_ver}.tar.gz \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; tar -xzf nginx-\${nginx_ver}.tar.gz \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; cd nginx-\${nginx_ver} \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; nginx -V 2&gt;&amp;1 | grep -o </span><span style="color:#98C379;">&#39;configure arguments:.*&#39;</span><span style="color:#ABB2BF;"> | cut -d: -f2- &gt; conf_args \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; cat conf_args \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; ./configure $(cat conf_args) \\</span></span>
<span class="line"><span style="color:#ABB2BF;">        --add-dynamic-module=/tmp/headers-more-nginx-module-0.37 \\</span></span>
<span class="line"><span style="color:#ABB2BF;">        --add-dynamic-module=/tmp/ngx_brotli-master \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; make -j$(nproc) \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    &amp;&amp; make install</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产镜像</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> nginx:1.26</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从构建阶段复制编译产物</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> --from=builder /etc/nginx/modules/ /etc/nginx/modules/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 复制自定义配置</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> nginx.conf /etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> conf.d/ /etc/nginx/conf.d/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 暴露端口</span></span>
<span class="line"><span style="color:#61AFEF;">EXPOSE</span><span style="color:#ABB2BF;"> 80 443</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">CMD</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;nginx&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-g&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;daemon off;&quot;</span><span style="color:#ABB2BF;">]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-5-docker-环境中的-nginx-注意事项" tabindex="-1"><a class="header-anchor" href="#_4-5-docker-环境中的-nginx-注意事项"><span>4.5 Docker 环境中的 Nginx 注意事项</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># Docker 环境下的特殊配置</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;  </span><span style="color:#7F848E;font-style:italic;"># 自动检测CPU核心数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Docker 容器中可能需要调整</span></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">1024</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 关闭 server_tokens，避免暴露版本</span></span>
<span class="line"><span style="color:#C678DD;">    server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Docker 网络优化</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    client_max_body_size </span><span style="color:#D19A66;">100m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 代理到 Docker 内部服务</span></span>
<span class="line"><span style="color:#C678DD;">    upstream</span><span style="color:#ABB2BF;"> docker_app {</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> app1:8080;</span></span>
<span class="line"><span style="color:#C678DD;">        server</span><span style="color:#ABB2BF;"> app2:8080;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">localhost;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_pass </span><span style="color:#ABB2BF;">http://docker_app;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">Host $</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Real-IP $</span><span style="color:#E06C75;">remote_addr</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-For $</span><span style="color:#E06C75;">proxy_add_x_forwarded_for</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">            proxy_set_header </span><span style="color:#ABB2BF;">X-Forwarded-Proto $</span><span style="color:#E06C75;">scheme</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-版本选型策略" tabindex="-1"><a class="header-anchor" href="#_5-版本选型策略"><span>5. 版本选型策略</span></a></h2><h3 id="_5-1-版本选型决策矩阵" tabindex="-1"><a class="header-anchor" href="#_5-1-版本选型决策矩阵"><span>5.1 版本选型决策矩阵</span></a></h3><table><thead><tr><th>因素</th><th>选择 Stable</th><th>选择 Mainline</th></tr></thead><tbody><tr><td>生产稳定性</td><td>优先</td><td>需评估</td></tr><tr><td>安全补丁</td><td>两边都有</td><td>两边都有</td></tr><tr><td>新功能需求</td><td>等待下一稳定版</td><td>立即可用</td></tr><tr><td>HTTP/3 支持</td><td>需 1.25.0+ 稳定版</td><td>更早可用</td></tr><tr><td>Bug 修复速度</td><td>关键修复</td><td>所有修复</td></tr><tr><td>社区验证</td><td>更充分</td><td>相对较少</td></tr><tr><td>长期维护</td><td>版本间更安全</td><td>需要跟进</td></tr></tbody></table><h3 id="_5-2-nginx-官方版本策略" tabindex="-1"><a class="header-anchor" href="#_5-2-nginx-官方版本策略"><span>5.2 Nginx 官方版本策略</span></a></h3>`,42),i(d,{code:`eJxLL0osyFDwCeJSAILi0iQI3y89M6/ieWfHszlrnk+Z/3Ti3qcTVzybMx+sCAR8fQyjlQz1jMz1DGySivTtfBMz83Iy81KVYhV0de2A0kbRYFnDWCQtRlA5Y4icEbKcMVTOBCJnjCxnApYLhthoAbUxuCQxKQdoH1xdsCFEmRFUmSFYmVNpuoJbZgWyOogzgo2h6owgxqUmlxZlllQiKU7NS+FCDZWnE3qeTd/2fPeWZ11L4Ob5+7iATTLTqwCb9Gz6cojbwLyn6zqftq54sn/d0yW9SI7wcw2HWg/VNG0Dkiago7WxaAQ5CAAdSIQJ`}),o[3]||=n(`<h3 id="_5-3-版本选型建议" tabindex="-1"><a class="header-anchor" href="#_5-3-版本选型建议"><span>5.3 版本选型建议</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看当前可用版本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 访问 https://nginx.org/en/download.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境推荐：使用最新稳定版</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 当前推荐版本：1.26.x</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 需要最新功能时：使用主线版</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 当前主线版本：1.27.x</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 版本锁定策略：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - 使用精确版本号，不要用 latest</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - 升级前在测试环境验证</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># - 制定版本升级窗口</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">版本升级风险</p><ul><li>Nginx 升级前务必检查变更日志（<a href="https://nginx.org/en/docs/changes.html" target="_blank" rel="noopener noreferrer">CHANGES</a>）</li><li>关注不兼容变更（Behavior Changes）</li><li>SSL/TLS 相关模块的升级需要特别关注安全影响</li><li>升级后必须执行 <code>nginx -t</code> 验证配置兼容性</li></ul></div><h2 id="_6-多版本共存方案" tabindex="-1"><a class="header-anchor" href="#_6-多版本共存方案"><span>6. 多版本共存方案</span></a></h2><h3 id="_6-1-不同端口运行多版本" tabindex="-1"><a class="header-anchor" href="#_6-1-不同端口运行多版本"><span>6.1 不同端口运行多版本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 已有系统 Nginx（1.18）运行在 80 端口</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 编译新版本运行在 8080 端口用于测试</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 编译时指定不同前缀</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --prefix=/etc/nginx-new</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --sbin-path=/usr/sbin/nginx-new</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --conf-path=/etc/nginx-new/nginx.conf</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --pid-path=/var/run/nginx-new.pid</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-http_ssl_module</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#D19A66;"> -j$(</span><span style="color:#61AFEF;">nproc</span><span style="color:#D19A66;">)</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> make</span><span style="color:#98C379;"> install</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置新版本监听不同端口</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/listen 80/listen 8080/&#39;</span><span style="color:#98C379;"> /etc/nginx-new/nginx.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动新版本</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> /usr/sbin/nginx-new</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> /etc/nginx-new/nginx.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-容器化多版本" tabindex="-1"><a class="header-anchor" href="#_6-2-容器化多版本"><span>6.2 容器化多版本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 运行多个 Nginx 版本容器</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> run</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --name</span><span style="color:#98C379;"> nginx-stable</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> 80:80</span><span style="color:#98C379;"> nginx:1.26-alpine</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> run</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --name</span><span style="color:#98C379;"> nginx-mainline</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> 8080:80</span><span style="color:#98C379;"> nginx:1.27-alpine</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> run</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --name</span><span style="color:#98C379;"> nginx-old</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> 8081:80</span><span style="color:#98C379;"> nginx:1.24-alpine</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 测试各版本</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -I</span><span style="color:#98C379;"> http://localhost/</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -I</span><span style="color:#98C379;"> http://localhost:8080/</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -I</span><span style="color:#98C379;"> http://localhost:8081/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-nginx-热升级流程" tabindex="-1"><a class="header-anchor" href="#_7-nginx-热升级流程"><span>7. Nginx 热升级流程</span></a></h2><p>热升级（平滑升级）是 Nginx 的重要特性，允许在不中断服务的情况下升级 Nginx 二进制文件。</p><h3 id="_7-1-热升级原理" tabindex="-1"><a class="header-anchor" href="#_7-1-热升级原理"><span>7.1 热升级原理</span></a></h3>`,11),i(d,{code:`eJwrTi0sTc1LTnXJTEwvSszlUgCCgsSikszkzILEvBIFx5TczDyFxGKF5+sWPp/Q9nTiDAwl/jkpIAXPpi/3TSwuSS3CpiAcqiI8vygbiwq/1HKwgmkbcBgBVAAxYtoGqBFgJWDX6drZAW2wUnjaP/FlQ6NCaHCQkcKT/Quf9m8HqwHKAVUADbBSSANqRVjyYv/s5yu6wWqAshA14QhFEHuQFeWXpCrkl6UWgT2kA1ENVAj31tMJPc+mb3uxf8KLhT243Rfu6efsgelAkJlWCk/2zHg5u/Vp6+aX09eiBheq7UCL4bYuaQFFzLqep3snP+3sfbF++7ONTU8n9L1saHjavgtNL9zREL3P+pYC4/VZZ8OzOZ1AwRf75wFFcDs9MNQzBNnlKG4COwkSslCrMe2GBtrT3vbnu5YDnfysYwIXAN0xDfk=`}),o[4]||=n(`<h3 id="_7-2-热升级详细步骤" tabindex="-1"><a class="header-anchor" href="#_7-2-热升级详细步骤"><span>7.2 热升级详细步骤</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 步骤 1：编译新版本 =====</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> /usr/local/src/nginx</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -O</span><span style="color:#98C379;"> https://nginx.org/download/nginx-1.26.2.tar.gz</span></span>
<span class="line"><span style="color:#61AFEF;">tar</span><span style="color:#D19A66;"> -xzf</span><span style="color:#98C379;"> nginx-1.26.2.tar.gz</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> nginx-1.26.2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用与旧版本相同的编译参数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取旧版本编译参数</span></span>
<span class="line"><span style="color:#E06C75;">OLD_ARGS</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -V</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &#39;configure arguments:&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sed</span><span style="color:#98C379;"> &#39;s/configure arguments: //&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#E06C75;"> $OLD_ARGS</span></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#D19A66;"> -j$(</span><span style="color:#61AFEF;">nproc</span><span style="color:#D19A66;">)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：不要执行 make install，我们先手动替换二进制</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 步骤 2：备份旧二进制 =====</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> cp</span><span style="color:#98C379;"> /usr/sbin/nginx</span><span style="color:#98C379;"> /usr/sbin/nginx.old</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 步骤 3：替换二进制文件 =====</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> cp</span><span style="color:#98C379;"> objs/nginx</span><span style="color:#98C379;"> /usr/sbin/nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 步骤 4：发送 USR2 信号（启动新 Master） =====</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> kill</span><span style="color:#D19A66;"> -USR2</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /var/run/nginx.pid</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 此时会生成新 PID 文件</span></span>
<span class="line"><span style="color:#61AFEF;">ls</span><span style="color:#D19A66;"> -la</span><span style="color:#98C379;"> /var/run/nginx.pid</span><span style="color:#E5C07B;">*</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /var/run/nginx.pid      ← 新 Master 的 PID</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># /var/run/nginx.pid.oldbin ← 旧 Master 的 PID</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 步骤 5：发送 WINCH 信号（优雅关闭旧 Worker） =====</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> kill</span><span style="color:#D19A66;"> -WINCH</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /var/run/nginx.pid.oldbin</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 观察旧 Worker 逐渐退出</span></span>
<span class="line"><span style="color:#61AFEF;">ps</span><span style="color:#98C379;"> aux</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 此时只有新 Worker 在处理请求</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 步骤 6：确认升级成功 =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 确认新版本正常运行</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -I</span><span style="color:#98C379;"> http://localhost/</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -v</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 步骤 7：关闭旧 Master =====</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> kill</span><span style="color:#D19A66;"> -QUIT</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /var/run/nginx.pid.oldbin</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 回滚操作（如果升级失败） =====</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 步骤 5 之后、步骤 7 之前，如果发现新版本有问题：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 恢复旧二进制</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> cp</span><span style="color:#98C379;"> /usr/sbin/nginx.old</span><span style="color:#98C379;"> /usr/sbin/nginx</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 发送 HUP 信号给旧 Master（重新拉起旧 Worker）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> kill</span><span style="color:#D19A66;"> -HUP</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /var/run/nginx.pid.oldbin</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 发送 QUIT 信号给新 Master（关闭新进程）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> kill</span><span style="color:#D19A66;"> -QUIT</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /var/run/nginx.pid</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 发送 KILL 信号给新 Worker（强制关闭）</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> kill</span><span style="color:#D19A66;"> -9</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">pgrep</span><span style="color:#D19A66;"> -P</span><span style="color:#ABB2BF;"> $(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /var/run/nginx.pid</span><span style="color:#ABB2BF;">) </span><span style="color:#98C379;">nginx</span><span style="color:#ABB2BF;">)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-热升级注意事项" tabindex="-1"><a class="header-anchor" href="#_7-3-热升级注意事项"><span>7.3 热升级注意事项</span></a></h3><div class="hint-container important"><p class="hint-container-title">热升级关键注意点</p><ol><li><strong>编译参数必须一致</strong>：新版本的编译参数应与旧版本相同，否则可能导致模块丢失</li><li><strong>共享内存兼容</strong>：如果使用了共享内存（如 <code>proxy_cache_path</code>），确保新版本兼容</li><li><strong>配置兼容性</strong>：升级前先检查新版本的变更日志，确认配置兼容</li><li><strong>监控验证</strong>：升级后密切监控错误日志和性能指标</li><li><strong>回滚准备</strong>：始终保留旧二进制文件，直到确认新版本稳定运行</li><li><strong>时间窗口</strong>：选择低流量时段执行升级</li><li><strong>不要使用 <code>make install</code></strong>：手动替换二进制更安全可控</li></ol></div><h2 id="_8-第三方模块编译" tabindex="-1"><a class="header-anchor" href="#_8-第三方模块编译"><span>8. 第三方模块编译</span></a></h2><h3 id="_8-1-静态编译-vs-动态编译" tabindex="-1"><a class="header-anchor" href="#_8-1-静态编译-vs-动态编译"><span>8.1 静态编译 vs 动态编译</span></a></h3>`,6),i(d,{code:`eJxLL0osyFAIceJSAILi0iQI/+Xcmc8aGp/vmfZi/USwDAgEG0Yr6ekn5+elZaaXFqXaJBXp2+nqJqak6Obmp5TmpCrFKujq2ikEG0XnJmanxiL0GUHEjaOVnq1Y+HTudIi5L/bPBhuRl56ZV/FkVw+Q/7RjmxKSPmOIPhOgvukLnm2e+rR36vPuNU97d7zYuxes9Wlv+/Ndy1/OaXjZ3vts2gaIuVATUvNSuFA99bRrBaanXHB6KqUyLzE3MxnVcy7onnOBeM7FOPr5lPnPOiboFec/m9b+ZPc2JCUQf7gA/ZGTn5gSDzHwadcCuDf61wP99Xx19/N1C59PaMPwQEllTiooNNIyc3KslN3cLC0MDHSS83Pyi6yU09LSkBQBrYIoMnF2dDNFUQQARc+3zA==`}),o[5]||=n(`<h3 id="_8-2-静态编译第三方模块" tabindex="-1"><a class="header-anchor" href="#_8-2-静态编译第三方模块"><span>8.2 静态编译第三方模块</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 下载第三方模块源码</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> /usr/local/src</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> clone</span><span style="color:#98C379;"> https://github.com/openresty/headers-more-nginx-module.git</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> clone</span><span style="color:#98C379;"> https://github.com/openresty/echo-nginx-module.git</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 编译时添加模块</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --prefix=/etc/nginx</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-http_ssl_module</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --add-module=/usr/local/src/headers-more-nginx-module</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --add-module=/usr/local/src/echo-nginx-module</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#D19A66;"> -j$(</span><span style="color:#61AFEF;">nproc</span><span style="color:#D19A66;">)</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> make</span><span style="color:#98C379;"> install</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-动态编译第三方模块" tabindex="-1"><a class="header-anchor" href="#_8-3-动态编译第三方模块"><span>8.3 动态编译第三方模块</span></a></h3><p>Nginx 1.9.11+ 支持动态模块，可以将模块编译为独立的 <code>.so</code> 文件：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 动态编译模块（需要先有 Nginx 源码且已 configure）</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> /usr/local/src/nginx-1.26.2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 下载 Brotli 模块</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> clone</span><span style="color:#98C379;"> https://github.com/google/ngx_brotli.git</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> ngx_brotli</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> submodule</span><span style="color:#98C379;"> update</span><span style="color:#D19A66;"> --init</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> ..</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 只编译动态模块（不重新编译整个 Nginx）</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --prefix=/etc/nginx</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-http_ssl_module</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --add-dynamic-module=/usr/local/src/nginx-1.26.2/ngx_brotli</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 只编译模块</span></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#98C379;"> modules</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 复制 .so 文件到模块目录</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> cp</span><span style="color:#98C379;"> objs/ngx_http_brotli_filter_module.so</span><span style="color:#98C379;"> /usr/lib64/nginx/modules/</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> cp</span><span style="color:#98C379;"> objs/ngx_http_brotli_static_module.so</span><span style="color:#98C379;"> /usr/lib64/nginx/modules/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code>nginx.conf</code> 中加载动态模块：</p><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># 在 main 上下文最顶部加载</span></span>
<span class="line"><span style="color:#C678DD;">load_module </span><span style="color:#ABB2BF;">modules/ngx_http_brotli_filter_module.so;</span></span>
<span class="line"><span style="color:#C678DD;">load_module </span><span style="color:#ABB2BF;">modules/ngx_http_brotli_static_module.so;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Brotli 压缩配置</span></span>
<span class="line"><span style="color:#C678DD;">    brotli</span><span style="color:#D19A66;"> on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    brotli_comp_level</span><span style="color:#D19A66;"> 6</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    brotli_types</span><span style="color:#ABB2BF;"> text/plain text/css application/javascript application/json;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # ...</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-4-常用第三方模块编译指南" tabindex="-1"><a class="header-anchor" href="#_8-4-常用第三方模块编译指南"><span>8.4 常用第三方模块编译指南</span></a></h3><h4 id="headers-more-nginx-module" tabindex="-1"><a class="header-anchor" href="#headers-more-nginx-module"><span>headers-more-nginx-module</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> clone</span><span style="color:#98C379;"> https://github.com/openresty/headers-more-nginx-module.git</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 编译</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#D19A66;"> --add-dynamic-module=/path/to/headers-more-nginx-module</span></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#98C379;"> modules</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置使用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># load_module modules/ngx_http_headers_more_filter_module.so;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="ngx-brotli" tabindex="-1"><a class="header-anchor" href="#ngx-brotli"><span>ngx_brotli</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> clone</span><span style="color:#98C379;"> https://github.com/google/ngx_brotli.git</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> ngx_brotli</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> submodule</span><span style="color:#98C379;"> update</span><span style="color:#D19A66;"> --init</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> ..</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 编译</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#D19A66;"> --add-dynamic-module=/path/to/ngx_brotli</span></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#98C379;"> modules</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置使用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># load_module modules/ngx_http_brotli_filter_module.so;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># load_module modules/ngx_http_brotli_static_module.so;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="geoip2-nginx-module" tabindex="-1"><a class="header-anchor" href="#geoip2-nginx-module"><span>geoip2-nginx-module</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 需要先安装 libmaxminddb</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> libmaxminddb-dev</span><span style="color:#7F848E;font-style:italic;">  # Ubuntu</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># sudo dnf install libmaxminddb-devel  # RHEL</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> clone</span><span style="color:#98C379;"> https://github.com/leev/ngx_http_geoip2_module.git</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 编译</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#D19A66;"> --add-dynamic-module=/path/to/ngx_http_geoip2_module</span></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#98C379;"> modules</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置使用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># load_module modules/ngx_http_geoip2_module.so;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-5-模块版本兼容性" tabindex="-1"><a class="header-anchor" href="#_8-5-模块版本兼容性"><span>8.5 模块版本兼容性</span></a></h3><div class="hint-container warning"><p class="hint-container-title">模块版本兼容</p><ul><li>第三方模块必须与 Nginx 版本兼容，不兼容的模块可能导致崩溃</li><li>Nginx 升级后需要重新编译第三方模块</li><li>动态模块的 ABI 可能在不同小版本间变化</li><li>编译前检查模块的兼容性说明</li><li>使用 <code>nginx -V</code> 确认模块是否成功编译</li></ul></div><h2 id="_9-编译优化" tabindex="-1"><a class="header-anchor" href="#_9-编译优化"><span>9. 编译优化</span></a></h2><h3 id="_9-1-性能优化编译选项" tabindex="-1"><a class="header-anchor" href="#_9-1-性能优化编译选项"><span>9.1 性能优化编译选项</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 使用 PCRE JIT 加速正则匹配</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-pcre-jit</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 线程池支持（用于非阻塞文件操作）</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-threads</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Google PerfTools (tcmalloc) 内存分配器</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 需要安装 libgoogle-perftools-dev</span></span>
<span class="line"><span style="color:#61AFEF;">    --with-google_perftools_module</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 编译优化</span></span>
<span class="line"><span style="color:#E06C75;">    --with-cc-opt</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;-O3 -march=native -mtune=native&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-openssl-版本选择" tabindex="-1"><a class="header-anchor" href="#_9-2-openssl-版本选择"><span>9.2 OpenSSL 版本选择</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 方式一：使用系统 OpenSSL</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> apt</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> libssl-dev</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#D19A66;"> --with-http_ssl_module</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式二：编译自定义 OpenSSL（获取最新安全修复）</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> /usr/local/src</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -O</span><span style="color:#98C379;"> https://www.openssl.org/source/openssl-3.3.2.tar.gz</span></span>
<span class="line"><span style="color:#61AFEF;">tar</span><span style="color:#D19A66;"> -xzf</span><span style="color:#98C379;"> openssl-3.3.2.tar.gz</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> openssl-3.3.2</span></span>
<span class="line"><span style="color:#61AFEF;">./config</span><span style="color:#D19A66;"> --prefix=/usr/local/openssl-3.3.2</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --openssldir=/usr/local/openssl-3.3.2</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    shared</span><span style="color:#98C379;"> zlib</span></span>
<span class="line"><span style="color:#61AFEF;">make</span><span style="color:#D19A66;"> -j$(</span><span style="color:#61AFEF;">nproc</span><span style="color:#D19A66;">)</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> make</span><span style="color:#98C379;"> install</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 编译 Nginx 时指定 OpenSSL 路径</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-http_ssl_module</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-openssl=/usr/local/src/openssl-3.3.2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式三：使用 BoringSSL（Google 维护的 OpenSSL 分支）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 需要先编译 BoringSSL</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> clone</span><span style="color:#98C379;"> https://boringssl.googlesource.com/boringssl</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> boringssl</span></span>
<span class="line"><span style="color:#61AFEF;">cmake</span><span style="color:#D19A66;"> -B</span><span style="color:#98C379;"> build</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">cmake</span><span style="color:#D19A66;"> --build</span><span style="color:#98C379;"> build</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 然后配置 Nginx 时使用</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-链接时优化-lto" tabindex="-1"><a class="header-anchor" href="#_9-3-链接时优化-lto"><span>9.3 链接时优化（LTO）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 启用 LTO（Link Time Optimization）</span></span>
<span class="line"><span style="color:#61AFEF;">./configure</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-cc-opt=</span><span style="color:#98C379;">&quot;-O3 -flto -march=native&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --with-ld-opt=</span><span style="color:#98C379;">&quot;-flto&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># LTO 可以进行跨模块优化，通常能提升 2-5% 性能</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 但会增加编译时间和内存消耗</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-4-针对特定-cpu-优化" tabindex="-1"><a class="header-anchor" href="#_9-4-针对特定-cpu-优化"><span>9.4 针对特定 CPU 优化</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看当前 CPU 支持的指令集</span></span>
<span class="line"><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/cpuinfo</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> flags</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 针对特定 CPU 架构优化</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Intel Xeon（服务器常见）</span></span>
<span class="line"><span style="color:#E06C75;">--with-cc-opt</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;-O3 -march=skylake-avx512&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># AMD EPYC</span></span>
<span class="line"><span style="color:#E06C75;">--with-cc-opt</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;-O3 -march=znver3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 通用优化（适合虚拟化环境）</span></span>
<span class="line"><span style="color:#E06C75;">--with-cc-opt</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;-O3 -march=x86-64-v2&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">编译优化注意事项</p><ul><li><code>-march=native</code> 只在编译和运行在同一台机器时有效</li><li>Docker 构建时注意基础镜像的 CPU 架构兼容性</li><li>生产环境建议使用 <code>-march=x86-64-v2</code> 或 <code>-march=haswell</code> 等通用选项</li><li>过度优化可能带来稳定性风险，务必充分测试</li></ul></div><h2 id="_10-安装验证与初始配置" tabindex="-1"><a class="header-anchor" href="#_10-安装验证与初始配置"><span>10. 安装验证与初始配置</span></a></h2><h3 id="_10-1-安装验证清单" tabindex="-1"><a class="header-anchor" href="#_10-1-安装验证清单"><span>10.1 安装验证清单</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 版本验证</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -v</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 编译参数验证</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -V</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">tee</span><span style="color:#98C379;"> /tmp/nginx_compile_info.txt</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 检查关键模块</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -V</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -E</span><span style="color:#98C379;"> &#39;ssl|v2|v3|stream|realip|gzip|stub_status&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 配置语法验证</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 检查端口监听</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ss</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 检查进程</span></span>
<span class="line"><span style="color:#61AFEF;">ps</span><span style="color:#98C379;"> aux</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 7. 测试访问</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -I</span><span style="color:#98C379;"> http://localhost/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 8. 检查日志</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> tail</span><span style="color:#98C379;"> /var/log/nginx/error.log</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 9. 检查 systemd 状态</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 10. 检查开机自启</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> is-enabled</span><span style="color:#98C379;"> nginx</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-2-初始安全配置" tabindex="-1"><a class="header-anchor" href="#_10-2-初始安全配置"><span>10.2 初始安全配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/nginx.conf - 安全基线配置</span></span>
<span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;">nginx;</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 隐藏版本号</span></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    server_tokens </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 安全相关头部</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Content-Type-Options </span><span style="color:#98C379;">&quot;nosniff&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"><span style="color:#C678DD;">    add_header </span><span style="color:#ABB2BF;">X-Frame-Options </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span><span style="color:#ABB2BF;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 禁用不需要的 HTTP 方法</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 在 server 块中配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # if ($request_method !~ ^(GET|HEAD|POST)$ ) {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    #     return 405;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">        listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        server_name </span><span style="color:#ABB2BF;">_;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 默认拒绝未匹配的域名</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 444</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-初始性能配置" tabindex="-1"><a class="header-anchor" href="#_10-3-初始性能配置"><span>10.3 初始性能配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/nginx/nginx.conf - 性能基线配置</span></span>
<span class="line"><span style="color:#C678DD;">user </span><span style="color:#ABB2BF;">nginx;</span></span>
<span class="line"><span style="color:#C678DD;">worker_processes </span><span style="color:#ABB2BF;">auto;</span></span>
<span class="line"><span style="color:#C678DD;">worker_rlimit_nofile </span><span style="color:#D19A66;">65535</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">events</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    worker_connections </span><span style="color:#D19A66;">4096</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    multi_accept </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    use </span><span style="color:#D19A66;">epoll</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">http</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 基础优化</span></span>
<span class="line"><span style="color:#C678DD;">    sendfile </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nopush </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    tcp_nodelay </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 连接保持</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_timeout </span><span style="color:#D19A66;">65</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive_requests </span><span style="color:#D19A66;">1000</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 客户端限制</span></span>
<span class="line"><span style="color:#C678DD;">    client_max_body_size </span><span style="color:#D19A66;">20m</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    client_body_buffer_size </span><span style="color:#D19A66;">128k</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Gzip 压缩</span></span>
<span class="line"><span style="color:#C678DD;">    gzip </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_vary </span><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_proxied </span><span style="color:#ABB2BF;">any;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_comp_level </span><span style="color:#D19A66;">4</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_min_length </span><span style="color:#D19A66;">256</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    gzip_types</span></span>
<span class="line"><span style="color:#ABB2BF;">        text/plain</span></span>
<span class="line"><span style="color:#ABB2BF;">        text/css</span></span>
<span class="line"><span style="color:#ABB2BF;">        application/json</span></span>
<span class="line"><span style="color:#ABB2BF;">        application/javascript</span></span>
<span class="line"><span style="color:#ABB2BF;">        text/xml</span></span>
<span class="line"><span style="color:#ABB2BF;">        application/xml</span></span>
<span class="line"><span style="color:#ABB2BF;">        application/xml+rss</span></span>
<span class="line"><span style="color:#ABB2BF;">        text/javascript;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 日志格式</span></span>
<span class="line"><span style="color:#C678DD;">    log_format </span><span style="color:#D19A66;">main</span><span style="color:#98C379;"> &#39;$</span><span style="color:#E06C75;">remote_addr</span><span style="color:#98C379;"> - $</span><span style="color:#E06C75;">remote_user</span><span style="color:#98C379;"> [$</span><span style="color:#E06C75;">time_local</span><span style="color:#98C379;">] &quot;$</span><span style="color:#E06C75;">request</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;$</span><span style="color:#E06C75;">status</span><span style="color:#98C379;"> $</span><span style="color:#E06C75;">body_bytes_sent</span><span style="color:#98C379;"> &quot;$</span><span style="color:#E06C75;">http_referer</span><span style="color:#98C379;">&quot; &#39;</span></span>
<span class="line"><span style="color:#98C379;">                    &#39;&quot;$</span><span style="color:#E06C75;">http_user_agent</span><span style="color:#98C379;">&quot; &quot;$</span><span style="color:#E06C75;">http_x_forwarded_for</span><span style="color:#98C379;">&quot;&#39;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    access_log </span><span style="color:#ABB2BF;">/var/log/nginx/access.log </span><span style="color:#D19A66;">main</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    error_log </span><span style="color:#ABB2BF;">/var/log/nginx/error.log </span><span style="color:#D19A66;">warn</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/conf.d/*.conf;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-4-防火墙配置" tabindex="-1"><a class="header-anchor" href="#_10-4-防火墙配置"><span>10.4 防火墙配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Ubuntu/Debian (ufw)</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> &#39;Nginx Full&#39;</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> allow</span><span style="color:#98C379;"> &#39;Nginx HTTPS&#39;</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ufw</span><span style="color:#98C379;"> status</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># RHEL/CentOS (firewalld)</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --permanent</span><span style="color:#D19A66;"> --add-service=http</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --permanent</span><span style="color:#D19A66;"> --add-service=https</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --reload</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> firewall-cmd</span><span style="color:#D19A66;"> --list-all</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># iptables</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -A</span><span style="color:#98C379;"> INPUT</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> tcp</span><span style="color:#D19A66;"> --dport</span><span style="color:#D19A66;"> 80</span><span style="color:#D19A66;"> -j</span><span style="color:#98C379;"> ACCEPT</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables</span><span style="color:#D19A66;"> -A</span><span style="color:#98C379;"> INPUT</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> tcp</span><span style="color:#D19A66;"> --dport</span><span style="color:#D19A66;"> 443</span><span style="color:#D19A66;"> -j</span><span style="color:#98C379;"> ACCEPT</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> iptables-save</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/etc/iptables/rules.v4</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-5-selinux-配置-rhel-centos" tabindex="-1"><a class="header-anchor" href="#_10-5-selinux-配置-rhel-centos"><span>10.5 SELinux 配置（RHEL/CentOS）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 SELinux 状态</span></span>
<span class="line"><span style="color:#61AFEF;">getenforce</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果 SELinux 为 Enforcing，需要配置策略</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 允许 Nginx 网络连接</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> setsebool</span><span style="color:#D19A66;"> -P</span><span style="color:#98C379;"> httpd_can_network_connect</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 允许 Nginx 连接数据库</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> setsebool</span><span style="color:#D19A66;"> -P</span><span style="color:#98C379;"> httpd_can_network_connect_db</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 允许 Nginx 读取用户目录</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> setsebool</span><span style="color:#D19A66;"> -P</span><span style="color:#98C379;"> httpd_enable_homedirs</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看所有 Nginx 相关布尔值</span></span>
<span class="line"><span style="color:#61AFEF;">getsebool</span><span style="color:#D19A66;"> -a</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> httpd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如果 Nginx 无法启动，查看 SELinux 拒绝日志</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ausearch</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> avc</span><span style="color:#D19A66;"> --start</span><span style="color:#98C379;"> recent</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> sealert</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> /var/log/audit/audit.log</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_11-常见安装问题排查" tabindex="-1"><a class="header-anchor" href="#_11-常见安装问题排查"><span>11. 常见安装问题排查</span></a></h2><h3 id="_11-1-编译阶段常见错误" tabindex="-1"><a class="header-anchor" href="#_11-1-编译阶段常见错误"><span>11.1 编译阶段常见错误</span></a></h3><table><thead><tr><th>错误信息</th><th>原因</th><th>解决方案</th></tr></thead><tbody><tr><td><code>./configure: error: C compiler cc is not found</code></td><td>未安装编译器</td><td><code>sudo apt install build-essential</code></td></tr><tr><td><code>./configure: error: the HTTP rewrite module requires the PCRE library</code></td><td>缺少 PCRE 开发库</td><td><code>sudo apt install libpcre3-dev</code></td></tr><tr><td><code>./configure: error: SSL modules require the OpenSSL library</code></td><td>缺少 OpenSSL 开发库</td><td><code>sudo apt install libssl-dev</code></td></tr><tr><td><code>./configure: error: the HTTP gzip module requires the zlib library</code></td><td>缺少 zlib 开发库</td><td><code>sudo apt install zlib1g-dev</code></td></tr><tr><td><code>./configure: error: the GeoIP module requires the GeoIP library</code></td><td>缺少 GeoIP 开发库</td><td><code>sudo apt install libgeoip-dev</code></td></tr><tr><td><code>make: *** [objs/Makefile:...] Error 1</code></td><td>编译错误</td><td>检查编译参数和源码版本兼容性</td></tr></tbody></table><h3 id="_11-2-运行阶段常见错误" tabindex="-1"><a class="header-anchor" href="#_11-2-运行阶段常见错误"><span>11.2 运行阶段常见错误</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 错误：nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 原因：80 端口被占用</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> lsof</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> :80</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> kill</span><span style="color:#D19A66;"> -9</span><span style="color:#ABB2BF;"> &lt;</span><span style="color:#98C379;">PI</span><span style="color:#ABB2BF;">D&gt;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或者修改监听端口</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误：nginx: [emerg] open() &quot;/etc/nginx/nginx.conf&quot; failed (13: Permission denied)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 原因：权限不足</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#7F848E;font-style:italic;">  # 需要使用 sudo</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误：nginx: [emerg] getpwnam(&quot;nginx&quot;) failed</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 原因：nginx 用户不存在</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> useradd</span><span style="color:#D19A66;"> -r</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> /sbin/nologin</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 错误：nginx: [emerg] mkdir() &quot;/var/cache/nginx&quot; failed (13: Permission denied)</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 原因：缓存目录权限问题</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> /var/cache/nginx</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> chown</span><span style="color:#98C379;"> nginx:nginx</span><span style="color:#98C379;"> /var/cache/nginx</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_11-3-安装验证脚本" tabindex="-1"><a class="header-anchor" href="#_11-3-安装验证脚本"><span>11.3 安装验证脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># nginx_install_verify.sh - Nginx 安装验证脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;===== Nginx 安装验证 =====&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 检查可执行文件</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> &quot;1. 可执行文件: &quot;</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> nginx</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ $(</span><span style="color:#56B6C2;">which</span><span style="color:#98C379;"> nginx)&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✗ 未找到 nginx&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 检查版本</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> &quot;2. 版本: &quot;</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -v</span><span style="color:#ABB2BF;"> 2&gt;&amp;1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 检查关键模块</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;3. 关键模块:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">nginx</span><span style="color:#D19A66;"> -V</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -oE</span><span style="color:#98C379;"> &#39;with-http_[a-z0-9_]+&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sed</span><span style="color:#98C379;"> &#39;s/^/   /&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 检查配置</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> &quot;4. 配置验证: &quot;</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> 2&gt;&amp;1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 检查进程</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> &quot;5. 进程状态: &quot;</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> pgrep</span><span style="color:#98C379;"> nginx</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 运行中&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    ps</span><span style="color:#98C379;"> aux</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nginx</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> grep</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✗ 未运行&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 检查端口</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;6. 端口监听:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> ss</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 7. 测试访问</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> &quot;7. HTTP 访问: &quot;</span></span>
<span class="line"><span style="color:#E06C75;">HTTP_CODE</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> /dev/null</span><span style="color:#D19A66;"> -w</span><span style="color:#98C379;"> &quot;%{http_code}&quot;</span><span style="color:#98C379;"> http://localhost/</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$HTTP_CODE</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;200&quot;</span><span style="color:#ABB2BF;"> ] || [ </span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;">$HTTP_CODE</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;301&quot;</span><span style="color:#ABB2BF;"> ]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ HTTP </span><span style="color:#E06C75;">$HTTP_CODE</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✗ HTTP </span><span style="color:#E06C75;">$HTTP_CODE</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 8. 检查 systemd</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> &quot;8. 开机自启: &quot;</span></span>
<span class="line"><span style="color:#61AFEF;">sudo</span><span style="color:#98C379;"> systemctl</span><span style="color:#98C379;"> is-enabled</span><span style="color:#98C379;"> nginx</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;未知&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;===== 验证完成 =====&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_12-本章小结" tabindex="-1"><a class="header-anchor" href="#_12-本章小结"><span>12. 本章小结</span></a></h2><p>本章详细介绍了 Nginx 的各种安装方式和版本选型策略：</p><ol><li><strong>包管理器安装</strong>：简单快捷但版本有限，适合快速部署和测试</li><li><strong>官方仓库安装</strong>：版本较新且官方维护，适合多数生产场景</li><li><strong>源码编译安装</strong>：最大灵活性和可定制性，适合高性能生产环境</li><li><strong>Docker 安装</strong>：环境一致且快速部署，适合容器化架构</li><li><strong>版本选型</strong>：Stable vs Mainline 的选择应基于稳定性需求</li><li><strong>热升级</strong>：利用 USR2 + WINCH + QUIT 信号实现零停机升级</li><li><strong>第三方模块</strong>：理解 <code>--add-module</code> 与 <code>--add-dynamic-module</code> 的区别</li><li><strong>编译优化</strong>：通过编译选项和链接优化提升性能</li><li><strong>安装验证</strong>：完整的验证清单确保安装正确</li></ol><p>下一章将深入 Nginx 的内部架构，理解 Master-Worker 进程模型和请求处理流程。</p>`,48)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};