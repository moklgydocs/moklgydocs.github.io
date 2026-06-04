import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-BnvjiS9D.js";var i=JSON.parse(`{"path":"/%E8%BF%90%E7%BB%B4%E4%B8%8E%E9%83%A8%E7%BD%B2/Docker/01.Docker%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86.html","title":"Docker 核心原理","lang":"zh-CN","frontmatter":{"title":"Docker 核心原理","date":"2025-04-14T00:00:00.000Z","category":["Docker"],"tag":["Docker","容器","Namespace","Cgroup"],"order":1},"git":{"createdTime":1776135420000,"updatedTime":1776135420000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":2.72,"words":815},"filePathRelative":"运维与部署/Docker/01.Docker核心原理.md"}`),a={name:`01.Docker核心原理.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="docker-核心原理" tabindex="-1"><a class="header-anchor" href="#docker-核心原理"><span>Docker 核心原理</span></a></h1><p>Docker 不是虚拟机。搞清楚这一点，后面的东西才好理解。</p><hr><h2 id="容器-vs-虚拟机" tabindex="-1"><a class="header-anchor" href="#容器-vs-虚拟机"><span>容器 vs 虚拟机</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>虚拟机：</span></span>
<span class="line"><span>┌─────────────────────────────┐</span></span>
<span class="line"><span>│         App A    App B      │</span></span>
<span class="line"><span>│      ┌────────┐ ┌────────┐ │</span></span>
<span class="line"><span>│      │ Guest  │ │ Guest  │ │</span></span>
<span class="line"><span>│      │  OS    │ │  OS    │ │</span></span>
<span class="line"><span>│      └────────┘ └────────┘ │</span></span>
<span class="line"><span>│      ┌────────────────────┐ │</span></span>
<span class="line"><span>│      │    Hypervisor      │ │</span></span>
<span class="line"><span>│      └────────────────────┘ │</span></span>
<span class="line"><span>│      ┌────────────────────┐ │</span></span>
<span class="line"><span>│      │     Host OS        │ │</span></span>
<span class="line"><span>│      └────────────────────┘ │</span></span>
<span class="line"><span>└─────────────────────────────┘</span></span>
<span class="line"><span>每个虚拟机有自己的操作系统，重，慢，吃资源</span></span>
<span class="line"><span></span></span>
<span class="line"><span>容器：</span></span>
<span class="line"><span>┌─────────────────────────────┐</span></span>
<span class="line"><span>│    App A    App B    App C  │</span></span>
<span class="line"><span>│   ┌──────┐ ┌──────┐ ┌────┐ │</span></span>
<span class="line"><span>│   │ bins │ │ bins │ │bins│ │</span></span>
<span class="line"><span>│   │ libs │ │ libs │ │libs│ │</span></span>
<span class="line"><span>│   └──────┘ └──────┘ └────┘ │</span></span>
<span class="line"><span>│   ┌────────────────────────┐│</span></span>
<span class="line"><span>│   │    Docker Engine       ││</span></span>
<span class="line"><span>│   └────────────────────────┘│</span></span>
<span class="line"><span>│   ┌────────────────────────┐│</span></span>
<span class="line"><span>│   │      Host OS           ││</span></span>
<span class="line"><span>│   └────────────────────────┘│</span></span>
<span class="line"><span>└─────────────────────────────┘</span></span>
<span class="line"><span>共享宿主机内核，轻，快，秒启动</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>对比项</th><th>虚拟机</th><th>容器</th></tr></thead><tbody><tr><td>启动速度</td><td>分钟级</td><td>秒级</td></tr><tr><td>体积</td><td>GB 级</td><td>MB 级</td></tr><tr><td>性能损耗</td><td>5-15%</td><td>接近原生</td></tr><tr><td>隔离级别</td><td>强（独立内核）</td><td>弱（共享内核）</td></tr><tr><td>典型场景</td><td>多租户、强隔离</td><td>应用部署、微服务</td></tr></tbody></table><hr><h2 id="三大核心技术" tabindex="-1"><a class="header-anchor" href="#三大核心技术"><span>三大核心技术</span></a></h2><p>Docker 靠 Linux 内核的三个特性实现容器化：</p><h3 id="_1-namespace-隔离" tabindex="-1"><a class="header-anchor" href="#_1-namespace-隔离"><span>1. Namespace（隔离）</span></a></h3><p>让容器觉得自己是个独立的系统：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Namespace 类型     隔离了什么</span></span>
<span class="line"><span>─────────────────  ────────────────</span></span>
<span class="line"><span>PID Namespace      进程号（容器里 PID 1 是你的应用）</span></span>
<span class="line"><span>Network Namespace  网络栈（独立 IP、端口）</span></span>
<span class="line"><span>Mount Namespace    文件系统（独立的目录树）</span></span>
<span class="line"><span>UTS Namespace      主机名</span></span>
<span class="line"><span>IPC Namespace      进程间通信</span></span>
<span class="line"><span>User Namespace     用户 ID</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 看看容器里的进程</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> erp-api</span><span style="color:#98C379;"> ps</span><span style="color:#98C379;"> aux</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># PID 1 就是你的 dotnet 进程</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 容器里看不到宿主机的其他进程</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 看容器的网络</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> erp-api</span><span style="color:#98C379;"> ip</span><span style="color:#98C379;"> addr</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 有独立的 IP 地址，和宿主机不同</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-cgroup-资源限制" tabindex="-1"><a class="header-anchor" href="#_2-cgroup-资源限制"><span>2. Cgroup（资源限制）</span></a></h3><p>限制容器能用多少 CPU、内存：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 启动容器时限制资源</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> run</span><span style="color:#D19A66;"> -d</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">  --memory=512m</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">          # 最多用 512M 内存</span></span>
<span class="line"><span style="color:#E06C75;">  --cpus</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1.5</span><span style="color:#56B6C2;"> \\ </span><span style="color:#7F848E;font-style:italic;">             # 最多用 1.5 核 CPU</span></span>
<span class="line"><span style="color:#61AFEF;">  --name</span><span style="color:#98C379;"> erp-api</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">  erp-api:latest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看容器资源使用</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> stats</span><span style="color:#98C379;"> erp-api</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># CONTAINER   CPU %   MEM USAGE / LIMIT     MEM %</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># erp-api     2.35%   256MiB / 512MiB       50.00%</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-unionfs-联合文件系统" tabindex="-1"><a class="header-anchor" href="#_3-unionfs-联合文件系统"><span>3. UnionFS（联合文件系统）</span></a></h3><p>Docker 镜像是一层一层叠起来的，每一层只读，最上面加一层可写层：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>┌─────────────────────┐</span></span>
<span class="line"><span>│  可写层（容器运行时） │  ← 你的应用写的日志、临时文件</span></span>
<span class="line"><span>├─────────────────────┤</span></span>
<span class="line"><span>│  应用层              │  ← COPY publish/ /app</span></span>
<span class="line"><span>├─────────────────────┤</span></span>
<span class="line"><span>│  .NET Runtime 层     │  ← FROM mcr.microsoft.com/dotnet/aspnet:8.0</span></span>
<span class="line"><span>├─────────────────────┤</span></span>
<span class="line"><span>│  Debian 基础层       │  ← 基础操作系统</span></span>
<span class="line"><span>└─────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>好处：</span></span>
<span class="line"><span>- 多个容器共享基础层，省磁盘</span></span>
<span class="line"><span>- 拉取镜像时只下载缺少的层，省带宽</span></span>
<span class="line"><span>- 构建时只重建变化的层，省时间</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="docker-架构" tabindex="-1"><a class="header-anchor" href="#docker-架构"><span>Docker 架构</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>你敲命令 → Docker Client（CLI）</span></span>
<span class="line"><span>              ↓</span></span>
<span class="line"><span>         Docker Daemon（dockerd）</span></span>
<span class="line"><span>              ↓</span></span>
<span class="line"><span>    ┌─────────┼──────────┐</span></span>
<span class="line"><span>    ↓         ↓          ↓</span></span>
<span class="line"><span>  Images  Containers  Networks/Volumes</span></span>
<span class="line"><span>    ↓</span></span>
<span class="line"><span>  Registry（镜像仓库：Docker Hub / 私有仓库）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>核心概念：</p><table><thead><tr><th>概念</th><th>类比</th><th>说明</th></tr></thead><tbody><tr><td>Image（镜像）</td><td>安装包</td><td>只读模板，包含运行环境+代码</td></tr><tr><td>Container（容器）</td><td>运行中的程序</td><td>镜像的运行实例</td></tr><tr><td>Registry（仓库）</td><td>应用商店</td><td>存放和分发镜像</td></tr><tr><td>Dockerfile</td><td>安装脚本</td><td>描述如何构建镜像</td></tr></tbody></table><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 一条命令理解整个流程</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> run</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --name</span><span style="color:#98C379;"> erp-api</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> 5000:5000</span><span style="color:#98C379;"> erp-api:v1.0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 本地找 erp-api:v1.0 镜像</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 找不到就去 Registry 拉取</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 基于镜像创建容器</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 在容器里启动进程</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 映射端口 宿主机5000 → 容器5000</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="理解就够了" tabindex="-1"><a class="header-anchor" href="#理解就够了"><span>理解就够了</span></a></h2><p>不需要背这些原理，但要知道：</p><ol><li><strong>容器不是虚拟机</strong> —— 共享宿主机内核，所以快、轻，但隔离没有 VM 强</li><li><strong>镜像是分层的</strong> —— 所以 Dockerfile 写得好，构建就快</li><li><strong>容器是临时的</strong> —— 容器删了数据就没了，要持久化得用数据卷</li><li><strong>资源可以限制</strong> —— 别让一个容器把整台机器内存吃光</li></ol>`,29)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};