import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-D5IRkmio.js";var i=JSON.parse(`{"path":"/%E8%BF%90%E7%BB%B4%E4%B8%8E%E9%83%A8%E7%BD%B2/Docker/03.Dockerfile%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5.html","title":"Dockerfile 最佳实践","lang":"zh-CN","frontmatter":{"title":"Dockerfile 最佳实践","date":"2025-04-14T00:00:00.000Z","category":["Docker"],"tag":["Docker","Dockerfile","多阶段构建",".NET"],"order":3},"git":{"createdTime":1776135420000,"updatedTime":1776135420000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":3.21,"words":963},"filePathRelative":"运维与部署/Docker/03.Dockerfile最佳实践.md"}`),a={name:`03.Dockerfile最佳实践.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="dockerfile-最佳实践" tabindex="-1"><a class="header-anchor" href="#dockerfile-最佳实践"><span>Dockerfile 最佳实践</span></a></h1><p>Dockerfile 写得好不好，直接影响构建速度和镜像大小。一个 .NET 项目的镜像可以从 2GB 优化到 100MB 以内。</p><hr><h2 id="net-项目的标准-dockerfile" tabindex="-1"><a class="header-anchor" href="#net-项目的标准-dockerfile"><span>.NET 项目的标准 Dockerfile</span></a></h2><h3 id="多阶段构建-推荐" tabindex="-1"><a class="header-anchor" href="#多阶段构建-推荐"><span>多阶段构建（推荐）</span></a></h3><div class="language-dockerfile line-numbers-mode" data-highlighter="shiki" data-ext="dockerfile" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-dockerfile"><span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 第一阶段：构建 =====</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> mcr.microsoft.com/dotnet/sdk:8.0 </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> build</span></span>
<span class="line"><span style="color:#61AFEF;">WORKDIR</span><span style="color:#ABB2BF;"> /src</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 先复制 csproj，利用缓存还原 NuGet 包</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;ERP.Host/ERP.Host.csproj&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ERP.Host/&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;ERP.Application/ERP.Application.csproj&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ERP.Application/&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;ERP.Domain/ERP.Domain.csproj&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ERP.Domain/&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;ERP.Infrastructure/ERP.Infrastructure.csproj&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ERP.Infrastructure/&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> dotnet restore </span><span style="color:#98C379;">&quot;ERP.Host/ERP.Host.csproj&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 再复制全部源码，构建</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> . .</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> dotnet publish </span><span style="color:#98C379;">&quot;ERP.Host/ERP.Host.csproj&quot;</span><span style="color:#ABB2BF;"> \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    -c Release \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    -o /app/publish \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    --no-restore</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ===== 第二阶段：运行 =====</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> mcr.microsoft.com/dotnet/aspnet:8.0 </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> runtime</span></span>
<span class="line"><span style="color:#61AFEF;">WORKDIR</span><span style="color:#ABB2BF;"> /app</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 非 root 用户运行</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> groupadd -r appuser &amp;&amp; useradd -r -g appuser appuser</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> --from=build /app/publish .</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 暴露端口</span></span>
<span class="line"><span style="color:#61AFEF;">EXPOSE</span><span style="color:#ABB2BF;"> 5000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 环境变量</span></span>
<span class="line"><span style="color:#61AFEF;">ENV</span><span style="color:#ABB2BF;"> ASPNETCORE_URLS=http://+:5000</span></span>
<span class="line"><span style="color:#61AFEF;">ENV</span><span style="color:#ABB2BF;"> ASPNETCORE_ENVIRONMENT=Production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 健康检查</span></span>
<span class="line"><span style="color:#61AFEF;">HEALTHCHECK</span><span style="color:#ABB2BF;"> --interval=30s --timeout=5s --retries=3 \\</span></span>
<span class="line"><span style="color:#61AFEF;">    CMD</span><span style="color:#ABB2BF;"> curl -f http://localhost:5000/health || exit 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">USER</span><span style="color:#ABB2BF;"> appuser</span></span>
<span class="line"><span style="color:#61AFEF;">ENTRYPOINT</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;dotnet&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ERP.Host.dll&quot;</span><span style="color:#ABB2BF;">]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="为什么要多阶段" tabindex="-1"><a class="header-anchor" href="#为什么要多阶段"><span>为什么要多阶段？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>不用多阶段：</span></span>
<span class="line"><span>  SDK 镜像(~800MB) + 源码 + NuGet缓存 + 发布文件 = 镜像 ~2GB</span></span>
<span class="line"><span></span></span>
<span class="line"><span>多阶段：</span></span>
<span class="line"><span>  第一阶段用 SDK 构建，产物复制到第二阶段</span></span>
<span class="line"><span>  最终镜像只有 Runtime(~200MB) + 发布文件(~50MB) = 镜像 ~250MB</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="利用缓存加速构建" tabindex="-1"><a class="header-anchor" href="#利用缓存加速构建"><span>利用缓存加速构建</span></a></h2><p>Docker 每一条指令是一层，只要内容没变就用缓存。关键是<strong>把不常变的放前面</strong>。</p><div class="language-dockerfile line-numbers-mode" data-highlighter="shiki" data-ext="dockerfile" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-dockerfile"><span class="line"><span style="color:#7F848E;font-style:italic;"># ❌ 错误写法：任何文件改动都重新 restore</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> . .</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> dotnet restore</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> dotnet publish</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ✅ 正确写法：先复制 csproj → restore → 再复制源码 → publish</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;ERP.Host/ERP.Host.csproj&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ERP.Host/&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> dotnet restore </span><span style="color:#98C379;">&quot;ERP.Host/ERP.Host.csproj&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> . .</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> dotnet publish --no-restore</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>代码改了但 csproj 没变时：</span></span>
<span class="line"><span>  Step 1: COPY csproj → 缓存命中 ✓</span></span>
<span class="line"><span>  Step 2: dotnet restore → 缓存命中 ✓（省了几分钟）</span></span>
<span class="line"><span>  Step 3: COPY . .    → 变了，重新执行</span></span>
<span class="line"><span>  Step 4: dotnet publish → 重新执行</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="dockerignore" tabindex="-1"><a class="header-anchor" href="#dockerignore"><span>.dockerignore</span></a></h2><p>和 <code>.gitignore</code> 类似，排除不需要复制进镜像的文件：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span># .dockerignore</span></span>
<span class="line"><span>**/bin/</span></span>
<span class="line"><span>**/obj/</span></span>
<span class="line"><span>**/node_modules/</span></span>
<span class="line"><span>**/.git</span></span>
<span class="line"><span>**/.vs</span></span>
<span class="line"><span>**/.vscode</span></span>
<span class="line"><span>**/Dockerfile*</span></span>
<span class="line"><span>**/docker-compose*</span></span>
<span class="line"><span>**/*.md</span></span>
<span class="line"><span>**/tests/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>好处：</p><ul><li>减少构建上下文大小（加快 <code>docker build</code>）</li><li>避免本地 bin/obj 干扰构建</li><li>防止敏感文件进入镜像</li></ul><hr><h2 id="选择合适的基础镜像" tabindex="-1"><a class="header-anchor" href="#选择合适的基础镜像"><span>选择合适的基础镜像</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>镜像                                          大小      适用场景</span></span>
<span class="line"><span>──────────────────────────────────────────────────────────────</span></span>
<span class="line"><span>mcr.microsoft.com/dotnet/aspnet:8.0          ~220MB    标准，推荐</span></span>
<span class="line"><span>mcr.microsoft.com/dotnet/aspnet:8.0-alpine   ~110MB    体积小，但某些库不兼容</span></span>
<span class="line"><span>mcr.microsoft.com/dotnet/aspnet:8.0-jammy    ~220MB    基于 Ubuntu 22.04</span></span>
<span class="line"><span>mcr.microsoft.com/dotnet/aspnet:8.0-noble    ~220MB    基于 Ubuntu 24.04</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-dockerfile line-numbers-mode" data-highlighter="shiki" data-ext="dockerfile" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-dockerfile"><span class="line"><span style="color:#7F848E;font-style:italic;"># 如果没有特殊依赖，用 alpine 版最小</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> mcr.microsoft.com/dotnet/aspnet:8.0-alpine </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> runtime</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ⚠️ alpine 用 musl libc，部分 NuGet 包（如 SkiaSharp）不兼容</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 遇到兼容问题换回默认的 Debian 版</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="常用-dockerfile-指令" tabindex="-1"><a class="header-anchor" href="#常用-dockerfile-指令"><span>常用 Dockerfile 指令</span></a></h2><div class="language-dockerfile line-numbers-mode" data-highlighter="shiki" data-ext="dockerfile" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-dockerfile"><span class="line"><span style="color:#7F848E;font-style:italic;"># FROM：基础镜像</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> mcr.microsoft.com/dotnet/aspnet:8.0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># WORKDIR：设置工作目录（不存在会自动创建）</span></span>
<span class="line"><span style="color:#61AFEF;">WORKDIR</span><span style="color:#ABB2BF;"> /app</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># COPY：复制文件（从构建上下文或上一阶段）</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> . .                          # 当前目录所有文件</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> --from=build /app/publish .  # 从 build 阶段复制</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># RUN：构建时执行命令（每条 RUN 是一层）</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> dotnet publish -c Release -o /app</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 合并 RUN 减少层数</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> apt-get update &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    apt-get install -y curl &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    rm -rf /var/lib/apt/lists/*</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ENV：设置环境变量</span></span>
<span class="line"><span style="color:#61AFEF;">ENV</span><span style="color:#ABB2BF;"> ASPNETCORE_ENVIRONMENT=Production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># EXPOSE：声明端口（文档性质，不实际开端口）</span></span>
<span class="line"><span style="color:#61AFEF;">EXPOSE</span><span style="color:#ABB2BF;"> 5000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># HEALTHCHECK：健康检查</span></span>
<span class="line"><span style="color:#61AFEF;">HEALTHCHECK</span><span style="color:#ABB2BF;"> --interval=30s --timeout=5s \\</span></span>
<span class="line"><span style="color:#61AFEF;">    CMD</span><span style="color:#ABB2BF;"> curl -f http://localhost:5000/health || exit 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># USER：切换运行用户</span></span>
<span class="line"><span style="color:#61AFEF;">USER</span><span style="color:#ABB2BF;"> appuser</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ENTRYPOINT vs CMD</span></span>
<span class="line"><span style="color:#61AFEF;">ENTRYPOINT</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;dotnet&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;ERP.Host.dll&quot;</span><span style="color:#ABB2BF;">]  # 固定的启动命令</span></span>
<span class="line"><span style="color:#61AFEF;">CMD</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;--urls&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://+:5000&quot;</span><span style="color:#ABB2BF;">]        # 可被 docker run 覆盖的默认参数</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="构建与推送" tabindex="-1"><a class="header-anchor" href="#构建与推送"><span>构建与推送</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 构建镜像</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> build</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> erp-api:v1.0</span><span style="color:#98C379;"> .</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> build</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> erp-api:v1.0</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> Dockerfile.production</span><span style="color:#98C379;"> .</span><span style="color:#7F848E;font-style:italic;">  # 指定 Dockerfile</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 打标签</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> tag</span><span style="color:#98C379;"> erp-api:v1.0</span><span style="color:#98C379;"> registry.company.com/erp-api:v1.0</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> tag</span><span style="color:#98C379;"> erp-api:v1.0</span><span style="color:#98C379;"> registry.company.com/erp-api:latest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 推送到私有仓库</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> push</span><span style="color:#98C379;"> registry.company.com/erp-api:v1.0</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> push</span><span style="color:#98C379;"> registry.company.com/erp-api:latest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看镜像大小</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> images</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># REPOSITORY   TAG    IMAGE ID       CREATED         SIZE</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># erp-api      v1.0   abc123def456   2 minutes ago   248MB</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看镜像层</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> history</span><span style="color:#98C379;"> erp-api:v1.0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="优化总结" tabindex="-1"><a class="header-anchor" href="#优化总结"><span>优化总结</span></a></h2><table><thead><tr><th>优化手段</th><th>效果</th></tr></thead><tbody><tr><td>多阶段构建</td><td>镜像从 2GB → 250MB</td></tr><tr><td>用 alpine 基础镜像</td><td>再减 100MB</td></tr><tr><td>合理利用缓存（先 csproj 再源码）</td><td>重复构建从 5分钟 → 30秒</td></tr><tr><td>.dockerignore</td><td>构建上下文从 GB → MB</td></tr><tr><td>合并 RUN 指令</td><td>减少镜像层数</td></tr><tr><td>非 root 用户</td><td>安全性提升</td></tr><tr><td>HEALTHCHECK</td><td>容器自愈</td></tr></tbody></table>`,32)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};