import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-BVtXrkU4.js";import{t as a}from"./app-Dc59EzjI.js";var o=JSON.parse(`{"path":"/Linux/07_Nginx/09_%E7%94%9F%E4%BA%A7%E7%BA%A7%E5%AE%9E%E6%88%98/04_%E5%AE%B9%E5%99%A8%E5%8C%96%E9%83%A8%E7%BD%B2%E4%B8%8EKubernetes%20Ingress.html","title":"容器化部署与 Kubernetes Ingress","lang":"zh-CN","frontmatter":{"title":"容器化部署与 Kubernetes Ingress","icon":"fa6-brands:docker","order":4,"category":["Linux","Nginx"],"tag":["Nginx","Docker","Kubernetes","Ingress","容器化"]},"git":{"createdTime":1780631738000,"updatedTime":1780712648000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":3}]},"readingTime":{"minutes":15.27,"words":4581},"filePathRelative":"Linux/07_Nginx/09_生产级实战/04_容器化部署与Kubernetes Ingress.md"}`),s={name:`04_容器化部署与Kubernetes Ingress.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="容器化部署与-kubernetes-ingress" tabindex="-1"><a class="header-anchor" href="#容器化部署与-kubernetes-ingress"><span>容器化部署与 Kubernetes Ingress</span></a></h1><div class="hint-container important"><p class="hint-container-title">容器化是现代部署的基石</p><p>Nginx 在容器化环境中有着广泛的应用：从 Docker 单机部署到 Kubernetes Ingress Controller，Nginx 是云原生流量管理的事实标准。掌握 Nginx 的容器化部署是现代运维的必备技能。</p></div><h2 id="_1-nginx-docker-镜像选型与优化" tabindex="-1"><a class="header-anchor" href="#_1-nginx-docker-镜像选型与优化"><span>1 Nginx Docker 镜像选型与优化</span></a></h2><h3 id="_1-1-官方镜像对比" tabindex="-1"><a class="header-anchor" href="#_1-1-官方镜像对比"><span>1.1 官方镜像对比</span></a></h3><table><thead><tr><th>镜像</th><th>基础镜像</th><th>大小</th><th>适用场景</th></tr></thead><tbody><tr><td><code>nginx:1.25</code></td><td>Debian</td><td>~190MB</td><td>通用场景，含包管理器</td></tr><tr><td><code>nginx:1.25-alpine</code></td><td>Alpine</td><td>~40MB</td><td>生产环境首选，体积小</td></tr><tr><td><code>nginx:1.25-slim</code></td><td>Debian-slim</td><td>~90MB</td><td>平衡体积和兼容性</td></tr><tr><td><code>nginxinc/nginx-unprivileged</code></td><td>Alpine</td><td>~40MB</td><td>安全场景，非 root 运行</td></tr></tbody></table><div class="hint-container tip"><p class="hint-container-title">镜像选型建议</p><ul><li><strong>生产环境</strong>：推荐 <code>nginx:1.25-alpine</code>，体积小、攻击面小</li><li><strong>需要调试工具</strong>：使用 Debian 基础镜像，内置 bash/curl 等工具</li><li><strong>安全合规要求</strong>：使用 <code>nginx-unprivileged</code> 镜像，以非 root 用户运行</li><li><strong>始终指定版本号</strong>：避免使用 <code>latest</code> 标签，确保可重复构建</li></ul></div><h3 id="_1-2-容器部署架构图" tabindex="-1"><a class="header-anchor" href="#_1-2-容器部署架构图"><span>1.2 容器部署架构图</span></a></h3>`,7),i(d,{code:`eJx1ks9LwmAcxu/+FS92trlZYBKCTVNJpwfJw5CY+k6lucm7GQo7VBB1qFOSeegSBEJkt6If0j/Ttvov2rutsU19b+/7eR7e5/m+bwtxvTao7ISAueR+3d6npcYhRCAnyYoFfJBpdcQBoCVR4ToiRK4ALybLhm1e5GQFou06IpLlfBqQ4ZpPWN0j2aqE8C1kkFD/hPITJgsikSS2Lj+m3GMoNkOLwfclod+Fss9Ml5hdNkxApUGIOLcV+PfsypjP9Jvz74+XQO5CyWxIHHGIEKSWx6KPH7SvcUBMp+hcxpE3uEYbegzG57X2dBsw5CrFgqnvy4iQ2xxy9ERb6Qp2sLuJfnyyEMxXFzcCkfVIUtUvT3/mc9UckAvN+CuZlXYlxdGWQvdyupDPMBVWm93rF6/G43MNP4sajxIbGzFXbT+W2kPSYHjQ42RZBalymWTD2vvIGE212Zs2mQLSapuIR+NRp+ZyHxXwUa4P/zf7TytDAWI73xGExBqM85twy0OscTksxlN808PwtGzE83wMRkN/1EP47Q==`}),o[1]||=n(`<h3 id="_1-3-生产级-dockerfile" tabindex="-1"><a class="header-anchor" href="#_1-3-生产级-dockerfile"><span>1.3 生产级 Dockerfile</span></a></h3><div class="language-dockerfile line-numbers-mode" data-highlighter="shiki" data-ext="dockerfile" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-dockerfile"><span class="line"><span style="color:#7F848E;font-style:italic;"># Dockerfile - 生产级 Nginx 镜像</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 多阶段构建：构建阶段 + 运行阶段</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 阶段 1：构建阶段 =====</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> nginx:1.25-alpine </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> builder</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装构建依赖</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> apk add --no-cache \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    build-base \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    pcre-dev \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    zlib-dev \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    openssl-dev \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    linux-headers \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    curl \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    git</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 编译第三方模块（示例：ngx_brotli 压缩模块）</span></span>
<span class="line"><span style="color:#61AFEF;">ARG</span><span style="color:#ABB2BF;"> NGINX_VERSION=1.25.4</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> cd /usr/local/src &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    curl -fSL https://nginx.org/download/nginx-\${NGINX_VERSION}.tar.gz -o nginx.tar.gz &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    tar xzf nginx.tar.gz &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    git clone https://github.com/google/ngx_brotli.git &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    cd ngx_brotli &amp;&amp; git submodule update --init &amp;&amp; cd .. &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    cd nginx-\${NGINX_VERSION} &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    ./configure --with-compat \\</span></span>
<span class="line"><span style="color:#ABB2BF;">        --add-dynamic-module=/usr/local/src/ngx_brotli &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    make modules</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 阶段 2：运行阶段 =====</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> nginx:1.25-alpine </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装运行时依赖</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> apk add --no-cache \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    tzdata \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    curl \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    tini</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 设置时区</span></span>
<span class="line"><span style="color:#61AFEF;">ENV</span><span style="color:#ABB2BF;"> TZ=Asia/Shanghai</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> ln -sf /usr/share/zoneinfo/\${TZ} /etc/localtime &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    echo </span><span style="color:#98C379;">&quot;\${TZ}&quot;</span><span style="color:#ABB2BF;"> &gt; /etc/timezone</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 从构建阶段复制模块</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> --from=builder /usr/local/src/nginx-1.25.4/objs/ngx_http_brotli_filter_module.so /usr/lib/nginx/modules/</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> --from=builder /usr/local/src/nginx-1.25.4/objs/ngx_http_brotli_static_module.so /usr/lib/nginx/modules/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 复制配置文件</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> nginx.conf /etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> conf.d/ /etc/nginx/conf.d/</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> snippets/ /etc/nginx/snippets/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 复制静态文件</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> html/ /usr/share/nginx/html/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建必要目录并设置权限</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> mkdir -p /var/cache/nginx /var/log/nginx &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    chown -R nginx:nginx /var/cache/nginx /var/log/nginx &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    chmod -R 755 /usr/share/nginx/html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 健康检查</span></span>
<span class="line"><span style="color:#61AFEF;">HEALTHCHECK</span><span style="color:#ABB2BF;"> --interval=30s --timeout=3s --start-period=5s --retries=3 \\</span></span>
<span class="line"><span style="color:#61AFEF;">    CMD</span><span style="color:#ABB2BF;"> curl -f http://localhost/healthz || exit 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 tini 作为 PID 1，正确处理信号</span></span>
<span class="line"><span style="color:#61AFEF;">ENTRYPOINT</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;/sbin/tini&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;--&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">EXPOSE</span><span style="color:#ABB2BF;"> 80 443</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">CMD</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;nginx&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-g&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;daemon off;&quot;</span><span style="color:#ABB2BF;">]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-4-非-root-镜像" tabindex="-1"><a class="header-anchor" href="#_1-4-非-root-镜像"><span>1.4 非 root 镜像</span></a></h3><div class="language-dockerfile line-numbers-mode" data-highlighter="shiki" data-ext="dockerfile" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-dockerfile"><span class="line"><span style="color:#7F848E;font-style:italic;"># Dockerfile - 非 root 运行的 Nginx 镜像</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> nginx:1.25-alpine</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建非 root 用户</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> addgroup -S nginx-app &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    adduser -S -G nginx-app nginx-app &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    mkdir -p /var/cache/nginx /var/log/nginx /run &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    chown -R nginx-app:nginx-app /var/cache/nginx /var/log/nginx /run &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    chown -R nginx-app:nginx-app /etc/nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改配置使用非特权端口</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> sed -i </span><span style="color:#98C379;">&#39;s/listen 80/listen 8080/&#39;</span><span style="color:#ABB2BF;"> /etc/nginx/conf.d/default.conf &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    sed -i </span><span style="color:#98C379;">&#39;s/pid </span><span style="color:#D19A66;">\\/</span><span style="color:#98C379;">var</span><span style="color:#D19A66;">\\/</span><span style="color:#98C379;">run</span><span style="color:#D19A66;">\\/</span><span style="color:#98C379;">nginx.pid/pid </span><span style="color:#D19A66;">\\/</span><span style="color:#98C379;">run</span><span style="color:#D19A66;">\\/</span><span style="color:#98C379;">nginx.pid/&#39;</span><span style="color:#ABB2BF;"> /etc/nginx/nginx.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">USER</span><span style="color:#ABB2BF;"> nginx-app</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">EXPOSE</span><span style="color:#ABB2BF;"> 8080</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">CMD</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;nginx&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-g&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;daemon off;&quot;</span><span style="color:#ABB2BF;">]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-5-镜像优化技巧" tabindex="-1"><a class="header-anchor" href="#_1-5-镜像优化技巧"><span>1.5 镜像优化技巧</span></a></h3><div class="language-dockerfile line-numbers-mode" data-highlighter="shiki" data-ext="dockerfile" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-dockerfile"><span class="line"><span style="color:#7F848E;font-style:italic;"># 优化 1：减少镜像层数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 合并 RUN 指令</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> apk add --no-cache curl tzdata &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    echo </span><span style="color:#98C379;">&quot;Asia/Shanghai&quot;</span><span style="color:#ABB2BF;"> &gt; /etc/timezone &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    rm -rf /var/cache/apk/*</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优化 2：利用构建缓存</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 先复制依赖文件（不常变化），再复制代码（经常变化）</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> nginx.conf /etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> conf.d/ /etc/nginx/conf.d/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优化 3：.dockerignore 减少构建上下文</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .dockerignore</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .git</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .github</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># *.md</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose*.yml</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .env</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># node_modules</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优化 4：多阶段构建分离编译和运行</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># （见上面的 Dockerfile 示例）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优化 5：使用 --no-cache 清理缓存</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># docker build --no-cache -t nginx:prod .</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-docker-compose-多服务部署" tabindex="-1"><a class="header-anchor" href="#_2-docker-compose-多服务部署"><span>2 Docker Compose 多服务部署</span></a></h2><h3 id="_2-1-完整-docker-compose-yml" tabindex="-1"><a class="header-anchor" href="#_2-1-完整-docker-compose-yml"><span>2.1 完整 docker-compose.yml</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.yml</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx + 多应用服务的完整部署配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 注意：version 字段在 Docker Compose V2 中已废弃，此处不再指定</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 如需兼容旧版 Compose V1，可添加 version: &#39;3.8&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== Nginx 反向代理 =====</span></span>
<span class="line"><span style="color:#E06C75;">  nginx</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx:1.25-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx-proxy</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;80:80&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;443:443&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/nginx.conf:/etc/nginx/nginx.conf:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/conf.d:/etc/nginx/conf.d:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/snippets:/etc/nginx/snippets:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/ssl:/etc/nginx/ssl:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/html:/usr/share/nginx/html:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">nginx-logs:/var/log/nginx</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">nginx-cache:/var/cache/nginx</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      app-api</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">      app-web</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">frontend</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;curl&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-f&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://localhost/healthz&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">      start_period</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;2.0&#39;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512M</span></span>
<span class="line"><span style="color:#E06C75;">        reservations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;0.5&#39;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">128M</span></span>
<span class="line"><span style="color:#E06C75;">    logging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">json-file</span></span>
<span class="line"><span style="color:#E06C75;">      options</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        max-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;10m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        max-file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== API 服务 =====</span></span>
<span class="line"><span style="color:#E06C75;">  app-api</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-api:latest</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-api</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    expose</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;8080&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">NODE_ENV=production</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">DB_HOST=postgres</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">DB_PORT=5432</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">REDIS_HOST=redis</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">REDIS_PORT=6379</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      postgres</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">      redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;curl&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-f&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://localhost:8080/healthz&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">15s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">2</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;1.0&#39;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512M</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== Web 前端 =====</span></span>
<span class="line"><span style="color:#E06C75;">  app-web</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-web:latest</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-web</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    expose</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;3000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">NODE_ENV=production</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">API_URL=https://api.example.com</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;curl&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;-f&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://localhost:3000/healthz&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">15s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== PostgreSQL =====</span></span>
<span class="line"><span style="color:#E06C75;">  postgres</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres:16-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">POSTGRES_DB=myapp</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">POSTGRES_USER=myapp</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">POSTGRES_PASSWORD_FILE=/run/secrets/db_password</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">postgres-data:/var/lib/postgresql/data</span></span>
<span class="line"><span style="color:#E06C75;">    secrets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">db_password</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD-SHELL&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;pg_isready -U myapp&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # ===== Redis =====</span></span>
<span class="line"><span style="color:#E06C75;">  redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis:7-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    container_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    command</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis-server /usr/local/etc/redis/redis.conf</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./redis/redis.conf:/usr/local/etc/redis/redis.conf:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">redis-data:/data</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">backend</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;redis-cli&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ping&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 卷 =====</span></span>
<span class="line"><span style="color:#E06C75;">volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  nginx-logs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local</span></span>
<span class="line"><span style="color:#E06C75;">  nginx-cache</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local</span></span>
<span class="line"><span style="color:#E06C75;">  postgres-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local</span></span>
<span class="line"><span style="color:#E06C75;">  redis-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">local</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 网络 =====</span></span>
<span class="line"><span style="color:#E06C75;">networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  frontend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bridge</span></span>
<span class="line"><span style="color:#E06C75;">  backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bridge</span></span>
<span class="line"><span style="color:#E06C75;">    internal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#7F848E;font-style:italic;">    # 内部网络，不暴露到宿主机</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 密钥 =====</span></span>
<span class="line"><span style="color:#E06C75;">secrets</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  db_password</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./secrets/db_password.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-nginx-配置文件" tabindex="-1"><a class="header-anchor" href="#_2-2-nginx-配置文件"><span>2.2 Nginx 配置文件</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-nginx"><span class="line"><span style="color:#7F848E;font-style:italic;"># nginx/conf.d/app.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Docker Compose 环境下的 Nginx 配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 上游服务定义（使用 Docker Compose 服务名）</span></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> api_backend {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Docker Compose 内部 DNS 解析</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> app-api:8080;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive </span><span style="color:#D19A66;">32</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">upstream</span><span style="color:#ABB2BF;"> web_backend {</span></span>
<span class="line"><span style="color:#C678DD;">    server</span><span style="color:#ABB2BF;"> app-web:3000;</span></span>
<span class="line"><span style="color:#C678DD;">    keepalive </span><span style="color:#D19A66;">16</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTP → HTTPS 重定向</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">80</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com www.example.com;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 301</span><span style="color:#ABB2BF;"> https://$</span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">$</span><span style="color:#E06C75;">request_uri</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HTTPS 主服务</span></span>
<span class="line"><span style="color:#C678DD;">server</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#C678DD;">    listen </span><span style="color:#D19A66;">443</span><span style="color:#ABB2BF;"> ssl;</span></span>
<span class="line"><span style="color:#C678DD;">    server_name </span><span style="color:#ABB2BF;">example.com www.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SSL 配置</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#C678DD;">    ssl_certificate_key </span><span style="color:#ABB2BF;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/ssl-ciphers.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 安全头</span></span>
<span class="line"><span style="color:#C678DD;">    include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/security-headers.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 健康检查端点</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /healthz {</span></span>
<span class="line"><span style="color:#C678DD;">        access_log </span><span style="color:#D19A66;">off</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 200</span><span style="color:#98C379;"> &quot;ok&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # API 代理</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /api/ {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://api_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/proxy-headers.conf;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_http_version </span><span style="color:#D19A66;">1.1</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_set_header </span><span style="color:#ABB2BF;">Connection </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        proxy_connect_timeout </span><span style="color:#D19A66;">5s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_read_timeout </span><span style="color:#D19A66;">30s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_send_timeout </span><span style="color:#D19A66;">10s</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 限流</span></span>
<span class="line"><span style="color:#C678DD;">        limit_req </span><span style="color:#ABB2BF;">zone=api burst=20 nodelay;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Web 前端</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> / {</span></span>
<span class="line"><span style="color:#C678DD;">        proxy_pass </span><span style="color:#ABB2BF;">http://web_backend;</span></span>
<span class="line"><span style="color:#C678DD;">        include </span><span style="color:#ABB2BF;">/etc/nginx/snippets/proxy-headers.conf;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 静态资源缓存</span></span>
<span class="line"><span style="color:#C678DD;">    location</span><span style="color:#ABB2BF;"> /static/ {</span></span>
<span class="line"><span style="color:#C678DD;">        alias </span><span style="color:#ABB2BF;">/usr/share/nginx/html/static/;</span></span>
<span class="line"><span style="color:#C678DD;">        expires </span><span style="color:#D19A66;">30d</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#C678DD;">        add_header </span><span style="color:#ABB2BF;">Cache-Control </span><span style="color:#98C379;">&quot;public, immutable&quot;</span><span style="color:#ABB2BF;">;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-docker-compose-运维命令" tabindex="-1"><a class="header-anchor" href="#_2-3-docker-compose-运维命令"><span>2.3 Docker Compose 运维命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 启动所有服务</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看服务状态</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> ps</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 Nginx 日志</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重载 Nginx 配置</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> nginx</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> reload</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证配置</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> nginx</span><span style="color:#98C379;"> nginx</span><span style="color:#D19A66;"> -t</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 进入 Nginx 容器</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> nginx</span><span style="color:#98C379;"> sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 滚动重启</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --no-deps</span><span style="color:#D19A66;"> --build</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 扩容 API 服务</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --scale</span><span style="color:#98C379;"> app-api=</span><span style="color:#D19A66;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 停止所有服务</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> down</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 停止并清理卷</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> down</span><span style="color:#D19A66;"> -v</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-nginx-ingress-controller-部署" tabindex="-1"><a class="header-anchor" href="#_3-nginx-ingress-controller-部署"><span>3 Nginx Ingress Controller 部署</span></a></h2><h3 id="_3-1-ingress-架构图" tabindex="-1"><a class="header-anchor" href="#_3-1-ingress-架构图"><span>3.1 Ingress 架构图</span></a></h3>`,15),i(d,{code:`eJyNUk9LAkEUv/spBjuvlltQEh3UCGkxyeqyeBj1rS7Mzi6za+o9ymMdJSqswCCoSxAE9mlSt2/RzLiupkE+2MPO+/2b96bKsFNDR6kI4pXWsru5I33wcj9sv4+eX4tIUXZQJlfQ+Yf83sPw9rIokeJf9LSUHv36uPLf7vx+f3Bz4Xe7g87TdonFdzQbV1KYYFoGhgrATs0yRIsRSXfrpbHxfr0EjIIHLvq+Ph99Psq2KC0lDbK5PT2aq5q0ibK0ysB1UdqmHrMJASZ9MhgsmxbAQ3GUAYfYLQuoN3ESxTWkVuEkvaZHgyhJhB1HwY4pRdKk7nrAsnnO+4OWmKM1oLQMTZ13q1gmXSCGTJFPUvMHmTU9b1cEy1SavKbys6DEFNTi9QuUmIDUMYhHXlQKQetT0IKSOgFtBHbiFjNaQCtzW51syu+dDdqdUOvwWNvlC6jZridDx6CJLYdArGxbcioO9mpJFJ8ZpqDw4Y8pjUZjSQoffOAisv5DCvPLfEiJBU8lPONTCs4S4RkfSnCmBpf3WgTk8g2TkOQKbBobsDXT4g963DEMQ4XVyA9IyQqn`}),o[2]||=n(`<h3 id="_3-2-安装-nginx-ingress-controller" tabindex="-1"><a class="header-anchor" href="#_3-2-安装-nginx-ingress-controller"><span>3.2 安装 Nginx Ingress Controller</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 方式 1：使用 Helm 安装（推荐）</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> repo</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> ingress-nginx</span><span style="color:#98C379;"> https://kubernetes.github.io/ingress-nginx</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> repo</span><span style="color:#98C379;"> update</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> ingress-nginx</span><span style="color:#98C379;"> ingress-nginx/ingress-nginx</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --namespace</span><span style="color:#98C379;"> ingress-nginx</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --create-namespace</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.replicaCount=</span><span style="color:#D19A66;">2</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.resources.requests.cpu=200m</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.resources.requests.memory=256Mi</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.resources.limits.cpu=</span><span style="color:#D19A66;">1</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.resources.limits.memory=512Mi</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.service.type=LoadBalancer</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.config.proxy-body-size=50m</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.config.proxy-read-timeout=</span><span style="color:#D19A66;">60</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.config.use-forwarded-headers=</span><span style="color:#D19A66;">true</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.config.compute-full-forwarded-for=</span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 方式 2：使用 kubectl apply</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> apply</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证安装</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> pods</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> ingress-nginx</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> svc</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> ingress-nginx</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-ingress-controller-自定义配置" tabindex="-1"><a class="header-anchor" href="#_3-3-ingress-controller-自定义配置"><span>3.3 Ingress Controller 自定义配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># ConfigMap 自定义 Nginx 配置</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ConfigMap</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ingress-nginx-controller</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ingress-nginx</span></span>
<span class="line"><span style="color:#E06C75;">data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 代理配置</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-body-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;50m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-connect-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;5&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-read-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;60&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-send-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;60&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-buffer-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;8k&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-buffers-number</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # SSL 配置</span></span>
<span class="line"><span style="color:#E06C75;">  ssl-protocols</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;TLSv1.2 TLSv1.3&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  ssl-ciphers</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  ssl-prefer-server-ciphers</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;false&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  ssl-session-cache</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  ssl-session-cache-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;10m&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 安全头</span></span>
<span class="line"><span style="color:#E06C75;">  server-tokens</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;false&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  hide-headers</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;X-Powered-By&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  add-headers</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;ingress-nginx/custom-headers&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 性能优化</span></span>
<span class="line"><span style="color:#E06C75;">  keep-alive</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;75&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  keep-alive-requests</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  upstream-keepalive-connections</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;64&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  upstream-keepalive-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;60&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  worker-processes</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;auto&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  max-worker-connections</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;65535&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 日志格式</span></span>
<span class="line"><span style="color:#E06C75;">  log-format-upstream</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">&gt;-</span></span>
<span class="line"><span style="color:#98C379;">    $remote_addr - $remote_user [$time_local] &quot;$request&quot;</span></span>
<span class="line"><span style="color:#98C379;">    $status $body_bytes_sent &quot;$http_referer&quot; &quot;$http_user_agent&quot;</span></span>
<span class="line"><span style="color:#98C379;">    $request_length $request_time [$proxy_upstream_name]</span></span>
<span class="line"><span style="color:#98C379;">    $upstream_addr $upstream_response_length $upstream_response_time</span></span>
<span class="line"><span style="color:#98C379;">    $upstream_status $req_id</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 其他</span></span>
<span class="line"><span style="color:#E06C75;">  use-forwarded-headers</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  compute-full-forwarded-for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  use-proxy-protocol</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;false&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  enable-real-ip</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  forwarded-for-header</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;X-Forwarded-For&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 自定义安全头</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ConfigMap</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">custom-headers</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ingress-nginx</span></span>
<span class="line"><span style="color:#E06C75;">data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  X-Frame-Options</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;SAMEORIGIN&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  X-Content-Type-Options</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;nosniff&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  X-XSS-Protection</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1; mode=block&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  Referrer-Policy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;strict-origin-when-cross-origin&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  Content-Security-Policy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;default-src &#39;self&#39;; script-src &#39;self&#39; &#39;unsafe-inline&#39;&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-ingress-资源配置" tabindex="-1"><a class="header-anchor" href="#_4-ingress-资源配置"><span>4 Ingress 资源配置</span></a></h2><h3 id="_4-1-基础-ingress-配置" tabindex="-1"><a class="header-anchor" href="#_4-1-基础-ingress-配置"><span>4.1 基础 Ingress 配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基于主机名的路由</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ingress</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-ingress</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    cert-manager.io/cluster-issuer</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">letsencrypt-prod</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  ingressClassName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">  tls</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">api.example.com</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">www.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      secretName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">example-com-tls</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-api</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">www.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-web</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3000</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-基于路径的路由" tabindex="-1"><a class="header-anchor" href="#_4-2-基于路径的路由"><span>4.2 基于路径的路由</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 同一域名下基于路径的路由</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ingress</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">path-based-ingress</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/rewrite-target</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/$2</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/use-regex</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 注意：使用 use-regex: &quot;true&quot; 时，pathType 应设为 ImplementationSpecific</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 而非 Prefix。Prefix 要求精确的前缀匹配，与正则表达式矛盾</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  ingressClassName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">          # API 路径</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/api(/|$)(.*)</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ImplementationSpecific</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-api</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">          # 管理后台</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/admin(/|$)(.*)</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ImplementationSpecific</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-admin</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8081</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">          # 默认前端</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-web</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3000</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-tls-配置" tabindex="-1"><a class="header-anchor" href="#_4-3-tls-配置"><span>4.3 TLS 配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># TLS 证书配置</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ingress</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">tls-ingress</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    cert-manager.io/cluster-issuer</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">letsencrypt-prod</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/ssl-redirect</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/force-ssl-redirect</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/ssl-passthrough</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;false&quot;</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  tls</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">example.com</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">&#39;*.example.com&#39;</span></span>
<span class="line"><span style="color:#E06C75;">      secretName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">wildcard-example-com-tls</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">example.com</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-web</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3000</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-ingress-注解详解" tabindex="-1"><a class="header-anchor" href="#_5-ingress-注解详解"><span>5 Ingress 注解详解</span></a></h2><h3 id="_5-1-常用注解速查" tabindex="-1"><a class="header-anchor" href="#_5-1-常用注解速查"><span>5.1 常用注解速查</span></a></h3><table><thead><tr><th>注解</th><th>功能</th><th>示例值</th></tr></thead><tbody><tr><td><code>nginx.ingress.kubernetes.io/rewrite-target</code></td><td>重写目标路径</td><td><code>/$2</code></td></tr><tr><td><code>nginx.ingress.kubernetes.io/ssl-redirect</code></td><td>SSL 重定向</td><td><code>&quot;true&quot;</code></td></tr><tr><td><code>nginx.ingress.kubernetes.io/proxy-body-size</code></td><td>请求体大小限制</td><td><code>&quot;50m&quot;</code></td></tr><tr><td><code>nginx.ingress.kubernetes.io/proxy-read-timeout</code></td><td>代理读取超时</td><td><code>&quot;60&quot;</code></td></tr><tr><td><code>nginx.ingress.kubernetes.io/proxy-connect-timeout</code></td><td>代理连接超时</td><td><code>&quot;5&quot;</code></td></tr><tr><td><code>nginx.ingress.kubernetes.io/proxy-send-timeout</code></td><td>代理发送超时</td><td><code>&quot;60&quot;</code></td></tr><tr><td><code>nginx.ingress.kubernetes.io/proxy-buffering</code></td><td>代理缓冲</td><td><code>&quot;on&quot;</code></td></tr><tr><td><code>nginx.ingress.kubernetes.io/cors-allow-origin</code></td><td>CORS 允许源</td><td><code>&quot;https://example.com&quot;</code></td></tr><tr><td><code>nginx.ingress.kubernetes.io/limit-connections</code></td><td>连接数限制</td><td><code>&quot;100&quot;</code></td></tr><tr><td><code>nginx.ingress.kubernetes.io/limit-rps</code></td><td>每秒请求数限制</td><td><code>&quot;100&quot;</code></td></tr><tr><td><code>nginx.ingress.kubernetes.io/affinity</code></td><td>会话亲和性</td><td><code>&quot;cookie&quot;</code></td></tr><tr><td><code>nginx.ingress.kubernetes.io/canary</code></td><td>金丝雀发布</td><td><code>&quot;true&quot;</code></td></tr><tr><td><code>nginx.ingress.kubernetes.io/canary-weight</code></td><td>金丝雀权重</td><td><code>&quot;20&quot;</code></td></tr><tr><td><code>nginx.ingress.kubernetes.io/auth-type</code></td><td>认证类型</td><td><code>&quot;basic&quot;</code></td></tr><tr><td><code>nginx.ingress.kubernetes.io/configuration-snippet</code></td><td>自定义 Nginx 配置</td><td>见下文</td></tr><tr><td><code>nginx.ingress.kubernetes.io/server-snippet</code></td><td>Server 块自定义配置</td><td>见下文</td></tr></tbody></table><h3 id="_5-2-注解配置示例" tabindex="-1"><a class="header-anchor" href="#_5-2-注解配置示例"><span>5.2 注解配置示例</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 完整注解配置示例</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ingress</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">annotated-ingress</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 注意：kubernetes.io/ingress.class 注解自 Kubernetes 1.18 起已废弃</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 推荐使用 spec.ingressClassName 替代</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # SSL 重定向</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/ssl-redirect</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/force-ssl-redirect</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 代理配置</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/proxy-body-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;50m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/proxy-connect-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;5&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/proxy-read-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;60&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/proxy-send-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;60&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/proxy-buffering</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;on&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/proxy-buffer-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;8k&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # WebSocket 支持</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/websocket-services</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;app-api&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # CORS 配置</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/enable-cors</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/cors-allow-origin</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;https://www.example.com&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/cors-allow-methods</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;GET, POST, PUT, DELETE, OPTIONS&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/cors-allow-headers</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Authorization, Content-Type&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/cors-max-age</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;86400&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 限流</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/limit-connections</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;100&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/limit-rps</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;100&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/limit-burst</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;200&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 会话亲和性</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/affinity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;cookie&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/affinity-mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;balanced&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/session-cookie-name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;INGRESSCOOKIE&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/session-cookie-max-age</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3600&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 上游超时</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/upstream-fail-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;30&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/upstream-max-fails</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 自定义配置片段</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/configuration-snippet</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">      more_set_headers &quot;X-Custom-Header: production&quot;;</span></span>
<span class="line"><span style="color:#98C379;">      proxy_set_header X-Custom-Request-ID $req_id;</span></span>
<span class="line"><span style="color:#98C379;">      more_set_headers &quot;X-Request-ID: $req_id&quot;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/server-snippet</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">      location /healthz {</span></span>
<span class="line"><span style="color:#98C379;">        access_log off;</span></span>
<span class="line"><span style="color:#98C379;">        return 200 &quot;ok&quot;;</span></span>
<span class="line"><span style="color:#98C379;">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  ingressClassName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">  tls</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">api.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      secretName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api-example-com-tls</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">api.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-api</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-ingress-与-nginx-配置映射关系" tabindex="-1"><a class="header-anchor" href="#_6-ingress-与-nginx-配置映射关系"><span>6 Ingress 与 Nginx 配置映射关系</span></a></h2><h3 id="_6-1-映射对照表" tabindex="-1"><a class="header-anchor" href="#_6-1-映射对照表"><span>6.1 映射对照表</span></a></h3><table><thead><tr><th>Ingress 字段</th><th>Nginx 配置</th><th>说明</th></tr></thead><tbody><tr><td><code>spec.rules[].host</code></td><td><code>server_name</code></td><td>虚拟主机名</td></tr><tr><td><code>spec.rules[].http.paths[].path</code></td><td><code>location</code></td><td>路径匹配</td></tr><tr><td><code>spec.tls[].hosts[]</code></td><td><code>ssl_certificate</code></td><td>TLS 证书</td></tr><tr><td><code>spec.tls[].secretName</code></td><td>SSL Secret 引用</td><td>证书存储</td></tr><tr><td><code>backend.service.name</code></td><td><code>proxy_pass</code></td><td>上游服务</td></tr><tr><td><code>backend.service.port.number</code></td><td>upstream port</td><td>上游端口</td></tr><tr><td><code>annotation: proxy-body-size</code></td><td><code>client_max_body_size</code></td><td>请求体大小</td></tr><tr><td><code>annotation: proxy-read-timeout</code></td><td><code>proxy_read_timeout</code></td><td>读取超时</td></tr><tr><td><code>annotation: ssl-redirect</code></td><td><code>return 301 https://...</code></td><td>SSL 重定向</td></tr><tr><td><code>annotation: rewrite-target</code></td><td><code>rewrite</code></td><td>路径重写</td></tr><tr><td><code>annotation: cors-*</code></td><td><code>add_header Access-Control-*</code></td><td>CORS 头</td></tr><tr><td><code>annotation: limit-rps</code></td><td><code>limit_req</code></td><td>限流</td></tr><tr><td><code>annotation: affinity</code></td><td><code>ip_hash</code> / <code>sticky cookie</code></td><td>会话亲和</td></tr><tr><td><code>ConfigMap: proxy-buffer-size</code></td><td><code>proxy_buffer_size</code></td><td>代理缓冲</td></tr></tbody></table><h3 id="_6-2-配置生成过程" tabindex="-1"><a class="header-anchor" href="#_6-2-配置生成过程"><span>6.2 配置生成过程</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Ingress Resource → Ingress Controller → Nginx 配置模板 → nginx.conf</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. Ingress Controller 监听 Kubernetes API</span></span>
<span class="line"><span>2. 收到 Ingress 资源变更事件</span></span>
<span class="line"><span>3. 将 Ingress 规则 + 注解 + ConfigMap 合并</span></span>
<span class="line"><span>4. 使用 Go 模板生成 nginx.conf</span></span>
<span class="line"><span>5. 执行 nginx -t 验证</span></span>
<span class="line"><span>6. 执行 nginx -s reload 重载</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-查看生成的-nginx-配置" tabindex="-1"><a class="header-anchor" href="#_6-3-查看生成的-nginx-配置"><span>6.3 查看生成的 Nginx 配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看 Ingress Controller 生成的 Nginx 配置</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> exec</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> ingress-nginx</span><span style="color:#98C379;"> deploy/ingress-nginx-controller</span><span style="color:#D19A66;"> --</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    cat</span><span style="color:#98C379;"> /etc/nginx/nginx.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看特定站点的配置</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> exec</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> ingress-nginx</span><span style="color:#98C379;"> deploy/ingress-nginx-controller</span><span style="color:#D19A66;"> --</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    grep</span><span style="color:#D19A66;"> -A</span><span style="color:#D19A66;"> 50</span><span style="color:#98C379;"> &quot;server_name api.example.com&quot;</span><span style="color:#98C379;"> /etc/nginx/nginx.conf</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 导出完整配置到本地</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> exec</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> ingress-nginx</span><span style="color:#98C379;"> deploy/ingress-nginx-controller</span><span style="color:#D19A66;"> --</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    cat</span><span style="color:#98C379;"> /etc/nginx/nginx.conf</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/tmp/nginx-ingress.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-自定义-nginx-配置" tabindex="-1"><a class="header-anchor" href="#_7-自定义-nginx-配置"><span>7 自定义 Nginx 配置</span></a></h2><h3 id="_7-1-通过-configmap-配置" tabindex="-1"><a class="header-anchor" href="#_7-1-通过-configmap-配置"><span>7.1 通过 ConfigMap 配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 全局配置</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ConfigMap</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ingress-nginx-controller</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ingress-nginx</span></span>
<span class="line"><span style="color:#E06C75;">data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 全局代理配置</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-connect-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;5&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-read-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;60&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-send-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;60&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-body-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;50m&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # SSL 全局配置</span></span>
<span class="line"><span style="color:#E06C75;">  ssl-protocols</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;TLSv1.2 TLSv1.3&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  ssl-ciphers</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 全局安全配置</span></span>
<span class="line"><span style="color:#E06C75;">  server-tokens</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;false&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  hide-headers</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;X-Powered-By,Server&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 性能配置</span></span>
<span class="line"><span style="color:#E06C75;">  worker-processes</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;auto&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  max-worker-connections</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;65535&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  keep-alive</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;75&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  keep-alive-requests</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  upstream-keepalive-connections</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;64&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 自定义日志格式</span></span>
<span class="line"><span style="color:#E06C75;">  log-format-upstream</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">&gt;-</span></span>
<span class="line"><span style="color:#98C379;">    $remote_addr - $remote_user [$time_local] &quot;$request&quot;</span></span>
<span class="line"><span style="color:#98C379;">    $status $body_bytes_sent &quot;$http_referer&quot; &quot;$http_user_agent&quot;</span></span>
<span class="line"><span style="color:#98C379;">    rt=$request_time uct=$upstream_connect_time</span></span>
<span class="line"><span style="color:#98C379;">    uht=$upstream_header_time urt=$upstream_response_time</span></span>
<span class="line"><span style="color:#98C379;">    upstream=$proxy_upstream_name</span></span>
<span class="line"><span style="color:#98C379;">    status=$upstream_status</span></span>
<span class="line"><span style="color:#98C379;">    req_id=$req_id</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-通过-snippets-自定义" tabindex="-1"><a class="header-anchor" href="#_7-2-通过-snippets-自定义"><span>7.2 通过 Snippets 自定义</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Server Snippet: 整个 server 块级别的自定义</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ingress</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">custom-snippet-ingress</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Server 块级自定义（最高权限）</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/server-snippet</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">      # 自定义 location</span></span>
<span class="line"><span style="color:#98C379;">      location /nginx_status {</span></span>
<span class="line"><span style="color:#98C379;">          stub_status;</span></span>
<span class="line"><span style="color:#98C379;">          allow 10.0.0.0/8;</span></span>
<span class="line"><span style="color:#98C379;">          deny all;</span></span>
<span class="line"><span style="color:#98C379;">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">      # 自定义变量</span></span>
<span class="line"><span style="color:#98C379;">      set $custom_var &quot;production&quot;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">      # 自定义访问控制</span></span>
<span class="line"><span style="color:#98C379;">      deny 192.168.1.0/24;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # Location 块级自定义</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/configuration-snippet</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">      # 添加自定义头</span></span>
<span class="line"><span style="color:#98C379;">      more_set_headers &quot;X-Environment: production&quot;;</span></span>
<span class="line"><span style="color:#98C379;">      more_set_headers &quot;X-Request-ID: $req_id&quot;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">      # 自定义代理头</span></span>
<span class="line"><span style="color:#98C379;">      proxy_set_header X-Custom-Header $custom_var;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">      # 自定义日志</span></span>
<span class="line"><span style="color:#98C379;">      access_log /var/log/nginx/custom_access.log custom_format;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # HTTP Snippet: http 块级别（通过 ConfigMap）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 见上方 ConfigMap 示例</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-api</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-自定义模板" tabindex="-1"><a class="header-anchor" href="#_7-3-自定义模板"><span>7.3 自定义模板</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 下载默认模板</span></span>
<span class="line"><span style="color:#61AFEF;">wget</span><span style="color:#98C379;"> https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/rootfs/etc/nginx/template/nginx.tmpl</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改模板后通过 ConfigMap 挂载</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> create</span><span style="color:#98C379;"> configmap</span><span style="color:#98C379;"> nginx-template</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --from-file=nginx.tmpl=./nginx.tmpl</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -n</span><span style="color:#98C379;"> ingress-nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 Ingress Controller Deployment 中引用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># volumeMounts:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#   - name: nginx-template</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     mountPath: /etc/nginx/template</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#     readOnly: true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_8-ingress-性能调优" tabindex="-1"><a class="header-anchor" href="#_8-ingress-性能调优"><span>8 Ingress 性能调优</span></a></h2><h3 id="_8-1-关键调优参数" tabindex="-1"><a class="header-anchor" href="#_8-1-关键调优参数"><span>8.1 关键调优参数</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># ConfigMap 性能调优</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ConfigMap</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ingress-nginx-controller</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ingress-nginx</span></span>
<span class="line"><span style="color:#E06C75;">data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # Worker 配置</span></span>
<span class="line"><span style="color:#E06C75;">  worker-processes</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;auto&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  worker-cpu-affinity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;auto&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  max-worker-connections</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;65535&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  max-worker-open-files</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;100000&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 连接优化</span></span>
<span class="line"><span style="color:#E06C75;">  keep-alive</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;75&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  keep-alive-requests</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  upstream-keepalive-connections</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;128&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  upstream-keepalive-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;60&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  upstream-keepalive-requests</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1000&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 代理优化</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-buffer-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;8k&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-buffers-number</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;8&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-buffering</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;on&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-request-buffering</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;on&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 缓存配置</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-buffering</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;on&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 事件模型</span></span>
<span class="line"><span style="color:#E06C75;">  use-gzip</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  gzip-level</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;4&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  gzip-types</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;text/plain text/css application/json application/javascript text/xml application/xml&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 超时优化</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-connect-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;5&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-read-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;60&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  proxy-send-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;60&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">  # 客户端优化</span></span>
<span class="line"><span style="color:#E06C75;">  client-body-buffer-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;16k&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  client-header-buffer-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1k&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  client-body-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;60&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  client-header-timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;60&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-ingress-controller-资源配置" tabindex="-1"><a class="header-anchor" href="#_8-2-ingress-controller-资源配置"><span>8.2 Ingress Controller 资源配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Ingress Controller Deployment 资源配置</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">apps/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deployment</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ingress-nginx-controller</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ingress-nginx</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">controller</span></span>
<span class="line"><span style="color:#E06C75;">          resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            requests</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">200m</span></span>
<span class="line"><span style="color:#E06C75;">              memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">256Mi</span></span>
<span class="line"><span style="color:#E06C75;">            limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1&quot;</span></span>
<span class="line"><span style="color:#E06C75;">              memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512Mi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">          # 内核参数</span></span>
<span class="line"><span style="color:#E06C75;">          securityContext</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            capabilities</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              add</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">                - </span><span style="color:#98C379;">NET_BIND_SERVICE</span></span>
<span class="line"><span style="color:#E06C75;">              drop</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">                - </span><span style="color:#98C379;">ALL</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">          # 优雅关闭</span></span>
<span class="line"><span style="color:#E06C75;">          terminationGracePeriodSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">300</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">      # 亲和性部署</span></span>
<span class="line"><span style="color:#E06C75;">      affinity</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        podAntiAffinity</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          preferredDuringSchedulingIgnoredDuringExecution</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">weight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span></span>
<span class="line"><span style="color:#E06C75;">              podAffinityTerm</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                labelSelector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                    app.kubernetes.io/name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ingress-nginx</span></span>
<span class="line"><span style="color:#E06C75;">                topologyKey</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">kubernetes.io/hostname</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-3-内核参数优化" tabindex="-1"><a class="header-anchor" href="#_8-3-内核参数优化"><span>8.3 内核参数优化</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># Init Container 设置内核参数</span></span>
<span class="line"><span style="color:#E06C75;">initContainers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">sysctl</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">busybox</span></span>
<span class="line"><span style="color:#E06C75;">    securityContext</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      privileged</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">    command</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/bin/sh</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">-c</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">        sysctl -w net.core.somaxconn=65535</span></span>
<span class="line"><span style="color:#98C379;">        sysctl -w net.ipv4.tcp_max_syn_backlog=65535</span></span>
<span class="line"><span style="color:#98C379;">        sysctl -w net.ipv4.tcp_tw_reuse=1</span></span>
<span class="line"><span style="color:#98C379;">        sysctl -w net.ipv4.ip_local_port_range=&quot;1024 65535&quot;</span></span>
<span class="line"><span style="color:#98C379;">        sysctl -w fs.file-max=1000000</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-蓝绿部署与金丝雀发布" tabindex="-1"><a class="header-anchor" href="#_9-蓝绿部署与金丝雀发布"><span>9 蓝绿部署与金丝雀发布</span></a></h2><h3 id="_9-1-金丝雀发布-ingress-实现" tabindex="-1"><a class="header-anchor" href="#_9-1-金丝雀发布-ingress-实现"><span>9.1 金丝雀发布（Ingress 实现）</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 生产版本 Ingress</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ingress</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-production</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  ingressClassName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-production</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 金丝雀版本 Ingress</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ingress</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-canary</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/canary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 方式 1：按权重分流（20% 流量到金丝雀）</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/canary-weight</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;20&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 方式 2：按 Cookie 分流</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # nginx.ingress.kubernetes.io/canary-by-cookie: &quot;canary&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 方式 3：按 Header 分流</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # nginx.ingress.kubernetes.io/canary-by-header: &quot;X-Canary&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # nginx.ingress.kubernetes.io/canary-by-header-value: &quot;true&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 组合方式：Header 优先，然后权重</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # nginx.ingress.kubernetes.io/canary-by-header: &quot;X-Canary&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # nginx.ingress.kubernetes.io/canary-weight: &quot;10&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-canary</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-金丝雀发布流程" tabindex="-1"><a class="header-anchor" href="#_9-2-金丝雀发布流程"><span>9.2 金丝雀发布流程</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 步骤 1：部署金丝雀版本</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> apply</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> app-canary.yaml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 步骤 2：初始 5% 流量</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> annotate</span><span style="color:#98C379;"> ingress</span><span style="color:#98C379;"> app-canary</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    nginx.ingress.kubernetes.io/canary-weight=</span><span style="color:#D19A66;">5</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --overwrite</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 步骤 3：观察指标（5-10 分钟）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查错误率、延迟、业务指标</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 步骤 4：逐步增加流量</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> annotate</span><span style="color:#98C379;"> ingress</span><span style="color:#98C379;"> app-canary</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    nginx.ingress.kubernetes.io/canary-weight=</span><span style="color:#D19A66;">20</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --overwrite</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 步骤 5：继续观察</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> annotate</span><span style="color:#98C379;"> ingress</span><span style="color:#98C379;"> app-canary</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    nginx.ingress.kubernetes.io/canary-weight=</span><span style="color:#D19A66;">50</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --overwrite</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 步骤 6：全量切换</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 更新生产版本指向新服务</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> image</span><span style="color:#98C379;"> deployment/app-production</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    app=myapp:v2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 步骤 7：移除金丝雀</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> delete</span><span style="color:#98C379;"> ingress</span><span style="color:#98C379;"> app-canary</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 回滚：将权重设为 0</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> annotate</span><span style="color:#98C379;"> ingress</span><span style="color:#98C379;"> app-canary</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">    nginx.ingress.kubernetes.io/canary-weight=</span><span style="color:#D19A66;">0</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --overwrite</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-基于-header-的精准灰度" tabindex="-1"><a class="header-anchor" href="#_9-3-基于-header-的精准灰度"><span>9.3 基于 Header 的精准灰度</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 内部测试用户灰度</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ingress</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-canary-header</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/canary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/canary-by-header</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;X-Canary&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/canary-by-header-value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;v2&quot;</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-canary</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 测试：携带 Header 访问金丝雀版本</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -H</span><span style="color:#98C379;"> &quot;X-Canary: v2&quot;</span><span style="color:#98C379;"> https://app.example.com/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 正常用户访问生产版本</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#98C379;"> https://app.example.com/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-4-蓝绿部署" tabindex="-1"><a class="header-anchor" href="#_9-4-蓝绿部署"><span>9.4 蓝绿部署</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 蓝环境（当前生产）</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Service</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-blue</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">    version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">blue</span></span>
<span class="line"><span style="color:#E06C75;">  ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 绿环境（新版本）</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Service</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-green</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">    version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">green</span></span>
<span class="line"><span style="color:#E06C75;">  ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Ingress 指向蓝环境</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ingress</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-ingress</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  ingressClassName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-blue</span><span style="color:#7F848E;font-style:italic;">    # 切换时改为 app-green</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 切换到绿环境</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> patch</span><span style="color:#98C379;"> ingress</span><span style="color:#98C379;"> app-ingress</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> production</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -p</span><span style="color:#98C379;"> &#39;{&quot;spec&quot;:{&quot;rules&quot;:[{&quot;host&quot;:&quot;app.example.com&quot;,&quot;http&quot;:{&quot;paths&quot;:[{&quot;path&quot;:&quot;/&quot;,&quot;pathType&quot;:&quot;Prefix&quot;,&quot;backend&quot;:{&quot;service&quot;:{&quot;name&quot;:&quot;app-green&quot;,&quot;port&quot;:{&quot;number&quot;:8080}}}}]}}]}}&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 回滚到蓝环境</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> patch</span><span style="color:#98C379;"> ingress</span><span style="color:#98C379;"> app-ingress</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> production</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    -p</span><span style="color:#98C379;"> &#39;{&quot;spec&quot;:{&quot;rules&quot;:[{&quot;host&quot;:&quot;app.example.com&quot;,&quot;http&quot;:{&quot;paths&quot;:[{&quot;path&quot;:&quot;/&quot;,&quot;pathType&quot;:&quot;Prefix&quot;,&quot;backend&quot;:{&quot;service&quot;:{&quot;name&quot;:&quot;app-blue&quot;,&quot;port&quot;:{&quot;number&quot;:8080}}}}]}}]}}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-多-ingress-controller-共存方案" tabindex="-1"><a class="header-anchor" href="#_10-多-ingress-controller-共存方案"><span>10 多 Ingress Controller 共存方案</span></a></h2><h3 id="_10-1-场景说明" tabindex="-1"><a class="header-anchor" href="#_10-1-场景说明"><span>10.1 场景说明</span></a></h3><p>在大型集群中，可能需要多个 Ingress Controller：</p><ul><li><strong>内外分离</strong>：内网和外网使用不同的 Ingress Controller</li><li><strong>多团队</strong>：不同团队使用各自的 Ingress Controller</li><li><strong>多租户</strong>：不同租户的流量隔离</li></ul><h3 id="_10-2-部署多-ingress-controller" tabindex="-1"><a class="header-anchor" href="#_10-2-部署多-ingress-controller"><span>10.2 部署多 Ingress Controller</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装内网 Ingress Controller</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> ingress-nginx-internal</span><span style="color:#98C379;"> ingress-nginx/ingress-nginx</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --namespace</span><span style="color:#98C379;"> ingress-nginx-internal</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --create-namespace</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.ingressClassResource.name=nginx-internal</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.ingressClassResource.enabled=</span><span style="color:#D19A66;">true</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.ingressClassResource.default=</span><span style="color:#D19A66;">false</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.service.type=LoadBalancer</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.service.annotations.&quot;service\\.beta\\.kubernetes\\.io/azure-load-balancer-internal&quot;=</span><span style="color:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装外网 Ingress Controller</span></span>
<span class="line"><span style="color:#61AFEF;">helm</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> ingress-nginx-external</span><span style="color:#98C379;"> ingress-nginx/ingress-nginx</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --namespace</span><span style="color:#98C379;"> ingress-nginx-external</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --create-namespace</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.ingressClassResource.name=nginx-external</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.ingressClassResource.enabled=</span><span style="color:#D19A66;">true</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.ingressClassResource.default=</span><span style="color:#D19A66;">true</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --set</span><span style="color:#98C379;"> controller.service.type=LoadBalancer</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-ingressclass-资源" tabindex="-1"><a class="header-anchor" href="#_10-3-ingressclass-资源"><span>10.3 IngressClass 资源</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 内网 IngressClass</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">IngressClass</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx-internal</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    ingressclass.kubernetes.io/is-default-class</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;false&quot;</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  controller</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">k8s.io/ingress-nginx-internal</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 外网 IngressClass</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">IngressClass</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx-external</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    ingressclass.kubernetes.io/is-default-class</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  controller</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">k8s.io/ingress-nginx-external</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-4-ingress-指定-controller" tabindex="-1"><a class="header-anchor" href="#_10-4-ingress-指定-controller"><span>10.4 Ingress 指定 Controller</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># 内网服务 Ingress</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ingress</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">internal-app</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  ingressClassName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx-internal</span><span style="color:#7F848E;font-style:italic;">    # 指定内网 Controller</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">internal.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-internal</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8080</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 外网服务 Ingress</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ingress</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">external-app</span></span>
<span class="line"><span style="color:#E06C75;">  namespace</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  ingressClassName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx-external</span><span style="color:#7F848E;font-style:italic;">    # 指定外网 Controller</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">www.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-external</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3000</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip"><p class="hint-container-title">多 Controller 最佳实践</p><ol><li>使用 <code>IngressClass</code> 明确指定每个 Ingress 使用的 Controller</li><li>设置 <code>is-default-class</code> 控制默认行为</li><li>不同 Controller 使用不同的 namespace 隔离配置</li><li>监控各自独立，避免指标混叠</li><li>网络策略（NetworkPolicy）确保 Controller 间隔离</li></ol></div><h2 id="_11-参考资源" tabindex="-1"><a class="header-anchor" href="#_11-参考资源"><span>11 参考资源</span></a></h2><ul><li><a href="https://nginx.org/en/docs/install.html#docker" target="_blank" rel="noopener noreferrer">Nginx 官方文档 - Docker 镜像</a></li><li><a href="https://kubernetes.github.io/ingress-nginx/" target="_blank" rel="noopener noreferrer">Nginx Ingress Controller 官方文档</a></li><li><a href="https://kubernetes.io/docs/concepts/services-networking/ingress/" target="_blank" rel="noopener noreferrer">Kubernetes Ingress 文档</a></li><li><a href="https://kubernetes.io/docs/concepts/services-networking/ingress/#ingress-class" target="_blank" rel="noopener noreferrer">Kubernetes IngressClass 文档</a></li><li><a href="https://docs.docker.com/compose/" target="_blank" rel="noopener noreferrer">Docker Compose 文档</a></li><li><a href="https://artifacthub.io/packages/helm/ingress-nginx/ingress-nginx" target="_blank" rel="noopener noreferrer">Helm Chart - ingress-nginx</a></li></ul>`,62)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};